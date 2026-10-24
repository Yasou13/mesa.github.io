# V4 projection rebuild runbook

This procedure is for the existing V4 storage-root-wide projection rebuild; its design
started with [ADR 0014](docs/core/adr-0014/).
LanceDB and Kùzu generations are produced from the existing canonical V4 snapshot;
it does not convert V3 data and does not rewrite canonical source/assertion content.
FTS integrity is verified on the snapshot. SQLite operation/checkpoint and
active-generation records are updated; after a successful cutover, representation
metadata is also advanced by the rule described below. The explicit `adopt-provider`
step can additionally fill in missing provenance metadata.
Tenant-, workspace- or dataset-scoped rebuilds are not supported.

## Safety boundaries and prerequisites

- `MESA_V4_REBUILD_ENABLED` stays `false` by default. Set it to `true` for the API
  and runner only during an approved rehearsal/change window.
- API operations need a principal-bound credential and the control-plane `ADMIN` role.
  Dataset roles alone are not enough.
- Rebuild is not online. Submit closes write admission; after the backlog is
  drained the combined runtime is stopped and the runner takes the storage writer
  lock on its own.
- The trusted, storage and work roots must exist beforehand; storage/work must be real
  subdirectories of the trusted root, must not overlap each other and must not contain
  symlinks. These paths are never taken from an HTTP request.
- The work filesystem needs free space of at least twice the storage size plus the
  runner's safety reserve. The runner measures this itself and fails closed when
  space is insufficient.
- The API and the runner must use the same provider, embedding model/version and
  dimension config. `MESA_EMBEDDING_VERSION` cannot be empty; the dimension must match
  the real provider output. If snapshot provenance does not match, the runner does not
  rebuild.
- Backups and retained generations are never deleted automatically. This release has no
  automatic or scheduled projection-generation cleanup.

Before starting, verify a real-provider rehearsal, production-like disk/concurrency
evidence and enough capacity for the rollback window.

## 1. Prepare operator authority and the flag

Enable the flag in the combined runtime's explicit deployment config:

```bash
export MESA_V4_REBUILD_ENABLED=true
```

Keep the verified provider/model/version/dimension settings of the existing corpus.
Do not change the existing embedding identity by assigning a sample dimension or
version here; the [configuration](docs/core/configuration/) and provenance records must
show the same identity.

Generate the credential once and give the same principal the control-plane role.
Do not copy the credential into shell history, logs or runbook notes:

```bash
export MESA_STORAGE_ROOT=/srv/mesa/v4-data
mesa-v4-admin issue-key --principal rebuild-operator
mesa-v4-admin grant-control --principal rebuild-operator
```

After the runtime restarts, check what capability actually reports:

```bash
curl --fail \
  -H "X-API-Key: $MESA_API_KEY" \
  http://127.0.0.1:8000/v4/capability
```

`capabilities.durable_rebuild` must be `true`, `limits.rebuild_scope`
`storage_root` and `limits.requires_offline_runner` `true`.

## 2. Submit the durable operation

Use a unique, content-free idempotency key for each change window:

```bash
export MESA_REBUILD_IDEMPOTENCY_KEY="$(.venv/bin/python -c 'import uuid; print(uuid.uuid4())')"
curl --fail-with-body -X POST \
  -H "X-API-Key: $MESA_API_KEY" \
  -H "Idempotency-Key: $MESA_REBUILD_IDEMPOTENCY_KEY" \
  http://127.0.0.1:8000/v4/operations/rebuild
```

A successful durable commit returns `202` and a `PENDING` operation. The same key and the
same fixed storage-root payload return the same operation. A conflicting payload or another
active rebuild on the same root returns `409`. `Idempotency-Key` is mandatory.

Record the `operation_id` from the response in a non-secret incident/change record:

```bash
export MESA_REBUILD_OPERATION_ID=00000000-0000-4000-8000-000000000000
```

After submit, v4 mutation endpoints return `503 maintenance_pending` and
`Retry-After: 5`. Read, capability, health, metrics and operation status stay
open. `RETRYABLE_FAILED` also keeps maintenance admission closed.

## 3. Drain the backlog

Before stopping the combined runtime, check the summary with `/health` and
readiness with `/health/init`. Watch the queue counters exposed on `/metrics`;
all of the backlog conditions below are verified again in the offline runner's
preflight:

- projection backlog and dead letter;
- cleanup backlog and blocked cleanup;
- stuck/in-flight projection leases;
- dispatch/raw-log jobs, the vector WAL and session finalization jobs.

In particular `mesa_v4_projection_backlog`,
`mesa_v4_projection_dead_letter`, `mesa_v4_projection_stuck_leases`,
`mesa_v4_cleanup_backlog` and `mesa_v4_cleanup_blocked` must be zero. The runner
checks every queue in canonical SQLite and the storage-root DLQ file again; any
non-zero value rejects the rebuild. Do not skip the preflight by deleting a queue
record or lease by hand.

## 4. Stop the combined runtime and run the offline runner

Once the backlog is zero, stop the combined process in a controlled way. Confirm the
process released the storage writer lock. Then run the command below with the same
reviewed provider config:

If active vector mutations created before `fd4e5f6a7b8c` lack provider identity, the
normal runner fails closed. Adoption can only be done on a fresh `PENDING` operation that
has never been claimed (`attempt_count=0`) and has no `source_manifest_hash` written. If
the combined runtime is stopped and provider/model/version/dimension have been verified
externally from the config records that produced the old generation, run this explicit
adoption step once:

```bash
mesa-v4-rebuild adopt-provider \
  --trusted-root /srv/mesa \
  --storage-root /srv/mesa/v4-data \
  --provider openai_compatible \
  --model text-embedding-3-small \
  --version "$MESA_EMBEDDING_VERSION" \
  --dimension "$MESA_EMBEDDING_DIMENSION" \
  --confirm-legacy-provider-unknown
```

This command is not a rebuild: it is a one-off, writer-lock-protected metadata adoption
that needs explicit operator confirmation and fills the missing provider fields in the
canonical mutation rows tied to active vector ownership using `COALESCE`. If any existing
provider/model/version/dimension value contradicts the assertion, the whole transaction
is rolled back. Without this evidence, do not adopt; the release stays `NO-GO` and waits
for the later full raw-source rebuild work package. `mesa-v4-rebuild run` does not change
canonical content records, apart from the verified assertion-vector representation marker
described below.

If a rebuild attempt has already started, adoption could change the canonical manifest,
so resuming with the same backup/checkpoint is not safe and the command fails closed.
This rule also covers the crash window before `source_manifest_hash` is written;
adoption is never done on a `RETRYABLE_FAILED` operation. Cancel the old operation,
submit a fresh rebuild with a new `Idempotency-Key`, drain the backlog again, stop the
runtime and run adoption on the new `PENDING` operation before the runner. Do not use the
old operation's backup or checkpoint for the new operation.

Then run the normal runner with the same reviewed provider config:

```bash
mesa-v4-rebuild run \
  --trusted-root /srv/mesa \
  --storage-root /srv/mesa/v4-data \
  --work-root /srv/mesa/rebuild-work \
  --operation-id "$MESA_REBUILD_OPERATION_ID"
```

The optional `--batch-size` range is `1..1000`, and `--lease-seconds` is
`30..3600`. In order, the runner checks the writer lock, Alembic head, fenced
operation lease, backlog, paths/symlinks, disk, checksummed backup, source
manifest, provider provenance, deterministic vector/graph replay, parity and
cutover.

### Assertion-vector representation transition

The Alembic upgrade explicitly marks existing `ASSERTION_VECTOR` records as
`legacy-v0`. The runtime admits only vector records with the `assertion-semantic-v1`
representation version to the semantic lane; missing, broken or mixed-version metadata
fails closed. New ingestion/reprojection upserts the same physical assertion ID and
replaces both the receipt and the registry metadata with the current version.

For an existing corpus the supported reindex path is the full, offline
`mesa-v4-rebuild run` flow. The only replay source is the canonical SQL assertion
fields, and the payload is regenerated deterministically from subject + predicate +
object + the full evidence span; entity/chunk vectors are not carried over as assertion
evidence. While the old active generation runs, `legacy-v0` records do not join the
semantic lane. The registry's representation version becomes `assertion-semantic-v1`
only after parity, atomic cutover and post-cutover health/smoke verification succeed.
A failed or half-done staging generation cannot advance this marker; the same
operation's crash-resume flow republishes the marker idempotently.

Exit codes:

| Code | Meaning | Operator action |
|---|---|---|
| `0` | `COMPLETED` | Move on to restarting the runtime |
| `2` | Flag/config/operation rejected | Fix config and operation status; do not retry blindly |
| `3` | Safe retryable failure | Inspect status/checkpoint and use the resume flow below |
| `4` | Another writer is active | Find the API/worker/combined process; do not start a second writer |
| `5` | Retry budget exhausted, `FINAL_FAILED` | Stop the rehearsal; fix the root cause before a new operation |

Runner stdout/stderr output is limited to operation/generation/state/count/error class.
Physical paths, content, credentials, manifest payloads and claim tokens must not be
logged.

## 5. Resume, retry and cancel

If a controlled error produced `RETRYABLE_FAILED`, first send a retry request for the same
durable operation and checkpoint, then run the same runner command:

```bash
curl --fail-with-body -X POST \
  -H "X-API-Key: $MESA_API_KEY" \
  "http://127.0.0.1:8000/v4/operations/$MESA_REBUILD_OPERATION_ID/retry"
```

If the API was restarted temporarily for this, stop it again before the runner.
`retry` returns `202` only in the `RETRYABLE_FAILED` state and does not delete the
checkpoint. When the retry budget is exhausted it returns `409`.

If the process was cut off while active by `SIGKILL`, a host crash or power loss, do
not call the API retry. After the lease expires, the same runner command reclaims the
stale owner with a new fencing token. Completed batches are reused only if the source
manifest has not changed. If the crash happened during `READY_TO_CUTOVER`, the runner
distinguishes the two safe states — pointer unchanged or pointer moved to the target —
and re-verifies without replay, then completes or returns to the retained source.

Abandoning the operation is safe only for `PENDING` or `RETRYABLE_FAILED`:

```bash
curl --fail-with-body -X POST \
  -H "X-API-Key: $MESA_API_KEY" \
  "http://127.0.0.1:8000/v4/operations/$MESA_REBUILD_OPERATION_ID/cancel"
```

`CANCELLED` reopens mutation admission with the old active generation.
The staging generation and backup are not deleted automatically. Trying to cancel a
`CLAIMED`, `RUNNING`, `VERIFYING` or `READY_TO_CUTOVER` operation returns `409`;
stop the runner at a safe batch boundary first.

## 6. Cutover, automatic rollback and restart

If pre-cutover parity fails, the pointer is not changed. If parity passes, vector and
graph are activated together in a single SQLite generation pointer transaction.
If post-cutover reopen/health/smoke fails, the runner automatically returns the pointer
to the retained source generation, re-verifies the rollback and sets the operation to
`RETRYABLE_FAILED`.

This release offers no manual HTTP rollback endpoint for a completed operation.
If an incident appears on the new generation after `COMPLETED`, stop all writers; do not
edit pointer tables or generation directories by hand. Keep the backup/retained
generation and escalate the incident through the recovery procedure. A late activation
crash is completed or rolled back automatically by the same operation's reclaim flow.

After the runner returns `0`, or the operation has been cancelled safely, restart the
combined runtime. Verify the status with the control-plane `ADMIN` credential:

```bash
curl --fail \
  -H "X-API-Key: $MESA_API_KEY" \
  "http://127.0.0.1:8000/v4/operations/$MESA_REBUILD_OPERATION_ID"
```

Unauthorized status/cancel/retry calls return `404` so the operation's existence is not
leaked. Status contains only kind/scope/state/attempt, progress, a bounded error class and
time fields.

After the change window, if no new submit/retry is needed, set the flag back to `false`
and restart the runtime with the reviewed config. Existing operation status and health
remain readable while the flag is off.

## 7. Observability and retained artifacts

Rebuild metrics to watch:

- `mesa_v4_rebuild_operation_state{state=...}`;
- `mesa_v4_rebuild_duration_seconds`;
- `mesa_v4_rebuild_progress_completed` and
  `mesa_v4_rebuild_progress_total`;
- `mesa_v4_rebuild_parity_missing`;
- `mesa_v4_rebuild_staging_bytes`;
- `mesa_v4_rebuild_rollbacks_total`.

`/health` gives only the `status`, `maintenance` and `rebuild_state` summary;
it has no separate rebuild detail object. Duration, progress and rollback counters are
read from `/metrics`. Operation details are at the authorized
`/v4/operations/{operation_id}` endpoint. `FINAL_FAILED` is degraded;
active and `RETRYABLE_FAILED` states count as maintenance.

Keep a separate change record for the backup, the failed staging generation and the
retained generation. Delete none of them automatically in this release. A deletion/retention
policy is a later, explicit operator work package.

## 8. API/SDK boundary and the production decision

The deprecated `POST /v4/rebuild` is only a storage-root alias. If `tenant_id`,
`workspace_id` or `dataset_id` is given it returns `409`. Dataset-bound MCP tools offer no
global rebuild submit/cancel/retry. The sync and async Python SDKs offer the
`capability`, `submit_rebuild`, `operation_status`, `cancel_operation` and
`retry_operation` methods.

A merge, unit/integration tests or CI evidence alone is not a production `GO`.
The decision stays `NO-GO` until all of the following are complete for the same release
candidate:

- backup → rebuild → reopen → parity → rollback rehearsal with real LanceDB/Kùzu and the
  selected embedding provider;
- production-like disk capacity, dataset size and concurrency;
- migration/DR and content-free closure evidence artifacts;
- cross-tenant/dataset negative retrieval and crash/fencing evidence;
- an uninterrupted 24-hour soak and operations sign-off.
