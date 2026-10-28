# MESA operations runbook

This runbook is the canonical operations guide for the v4 full-cognitive release
candidate. The production decision stays `NO-GO` until Final MVP Certification is
complete. V3 lexical-core compatibility operations are marked separately.

## 1. Supported v4 topology

V4 runs with a single `combined` process writing to one storage root. API
admission, the durable consumer, validation and SQLite/LanceDB/Kùzu projection
work all live in this process.

```bash
export MESA_RUNTIME_PROFILE=combined
export MESA_STORAGE_ROOT=/srv/mesa/v4-data
export MESA_LOAD_DOTENV=false
# Provision credentials and reviewed model/provider settings before startup.
.venv/bin/python -m mesa_memory.runtime_entrypoint
```

This command on its own is not a V4 provider setup. Canonical insert needs
`MESA_MODEL_ENABLED=true`, working extraction/embedding and a selected
validation policy; complete the [installation](docs/core/getting-started/#installation) and
[configuration](docs/core/configuration/) prerequisites.

Do not mount the same storage root writable into a second API, worker or combined
process. Horizontal scaling needs a storage ownership protocol first. V3 and v4 must
use different physical storage roots.

<a id="credential-bootstrap"></a>

## 2. First credential and ACL setup

With the application stopped, or as the only operator using the policy DB:

```bash
export MESA_STORAGE_ROOT=/srv/mesa/v4-data
mesa-v4-admin issue-key --principal service-api
mesa-v4-admin grant-role --principal service-api \
  --tenant tenant-a --role OWNER
mesa-v4-admin grant-agent --principal service-api \
  --agent agent-a --permission SESSION_CREATE
```

The first command writes the credential to stdout only once. Move it into a secret
manager; never put it in logs, shell history or documentation. A rotated old key is
revoked in the same operation:

```bash
mesa-v4-admin rotate-key --key-id KEY_ID
mesa-v4-admin revoke-key --key-id KEY_ID
```

Purge/rollback do not come implicitly with a role:

```bash
mesa-v4-admin grant-dataset-permission --principal service-api \
  --tenant tenant-a --dataset dataset-a --permission ROLLBACK
```

## 3. Projection backlog and DLQ

First check the `status`, `maintenance`, `rebuild_state` summary with `/health` and
readiness with `/health/init`. `/health` can return HTTP 200 while `status` is
degraded. The detailed counters below are watched through `/metrics`; they are not
separate fields in the public `/health` response:

- `mesa_v4_projection_backlog`
- `mesa_v4_projection_dead_letter`
- `mesa_v4_projection_stuck_leases`
- `mesa_v4_cleanup_backlog`
- `mesa_v4_cleanup_blocked`
- `mesa_v4_orphan_registry`
- `mesa_v4_shared_artifacts`

If the backlog grows, search the process logs for the mutation/pipeline run ID,
failure class and lane. Content, credentials and claim tokens must not be logged.
A transient error progresses through bounded retry; a permanent/poison error goes to the DLQ.

Before replay, fix the root cause and confirm the mutation belongs to the same
tenant/dataset scope. The authorized API call:

```bash
curl --fail -X POST \
  -H "X-API-Key: $MESA_API_KEY" \
  "http://127.0.0.1:8000/v4/mutations/$MUTATION_ID/replay"
```

Because leases are fenced, a worker that lost its claim token cannot finalize its
result. Instead of touching the lease by hand, restart the process and wait for the
reconciler to pick up the expired claim.

## 4. Rollback and BLOCKED

Rolling back an uncommitted failed run first creates the SQLite retrieval tombstone,
then the vector/graph cleanup outbox. Only the relevant `artifact_sources` ownership is
removed. A shared artifact that has another active owner is not deleted.

If cleanup cannot complete, the run becomes `BLOCKED`; do not treat it as success.
Fix store access, check health parity and rerun the idempotent cleanup/replay flow.
Do not delete manually in the physical store; the ledger and store would drift further apart.

## 5. Reconciliation

Reconciliation is two-way at the tenant and dataset boundary:

- an artifact that is in the ledger but missing from the store is projected again;
- an artifact that is in the store without a ledger/owner record is quarantined and
  moved to the cleanup queue.

Before a release or cutover, projection backlog, blocked cleanup and ownerless
orphans must be zero. The shared artifact count need not be zero; shared ownership
is expected.

<a id="6-backup-restore-ve-v4-rebuild"></a>

## 6. Backup, restore and v4 rebuild

Stop the application and take the source storage offline:

```bash
mesa-recovery --trusted-root /srv/mesa backup \
  --source-root /srv/mesa/v4-data \
  --backup-root /srv/mesa/backups/v4-2026-07-23 \
  --stores-stopped
mesa-recovery --trusted-root /srv/mesa validate \
  --backup-root /srv/mesa/backups/v4-2026-07-23
mesa-recovery --trusted-root /srv/mesa restore \
  --backup-root /srv/mesa/backups/v4-2026-07-23 \
  --restore-root /srv/mesa/restore-v4-test
```

`--stores-stopped` is an explicit operator precondition kept for backward
compatibility; on its own it is not proof of consistency. The backup implementation
also verifies/takes the storage-root writer lock, copies each SQLite file as a separate
consistent snapshot using SQLite's online backup primitive, and publishes atomically
only after staging verification. SQL is the authoritative/canonical truth. The LanceDB
vector and Kùzu graph projections are rebuildable derived state and are copied only
under the exclusive writer-lock boundary.

Restore must not overwrite an existing target. Restore the backup into a new empty
root with compatible code and config, then verify it. Moving V3 data to V4 is separate
source/catalog mapping plus V4 ingestion work; the projection runner is not a V3→V4
converter. The [migration guide](docs/core/operations/#upgrade-v080) explains the V4 upgrade.
Keep the backup for the whole rollback window.

The V4 projection rebuild flow — submit → drain → stop → offline run/resume →
restart → status → automatic rollback — together with its exit codes and retained
generation rules, is documented canonically in
[`v4-rebuild-runbook.md`](docs/core/rebuild-runbook/). Dataset/tenant-scoped rebuilds
and an online runner are not supported.

Alembic migrations are forward-only. If a migration fails, do not run
`alembic downgrade`: stop the release, restore the verified backup into a new empty
storage root, rerun the parity check, and only then cut over.

### Single-writer capacity limit

V4 uses one active `combined` owner per storage root.
On startup a worker rejects a second writer on the same host with an advisory lock;
this is not a coordination mechanism for multiple hosts/NFS. API, valence and MCP
process-local caches are only a performance optimization; correctness state lives in
the SQLite ledger and fenced leases. Horizontal writer scaling opens only after a
shared lease/coordination service has been designed and verified.

## 7. Model/provider incident

Set `MESA_MODEL_ENABLED` and `MESA_EXTERNAL_PROVIDER_ENABLED` explicitly.
A provider timeout/rate-limit error is retryable; a broken schema is permanent; the
same toxic payload repeating is classified as poison. SQL/vector/graph projection does
not start before the selected validation policy completes. Do not force a mutation
straight to VALIDATED to skip the provider.

## 8. PageRank

V4 PageRank output is telemetry only. Low centrality cannot quarantine a memory,
assertion, vector or source. If PageRank-based `hallucination`/delete behavior is seen,
stop the deploy; it violates the v4 contract.

## 9. Session finalization

Ending a session creates a durable finalization record. After a restart, pending work is
picked up by the combined consumer. If something stays pending for long, check the
session, finalization ID, lease and DLQ state; do not rely on in-process FastAPI
`BackgroundTasks`.

## 10. Logging and incident evidence

The production default is `MESA_LOG_LEVEL=INFO` and `MESA_LOG_FORMAT=json`.
Logs may contain request/operation/mutation/pipeline run identifiers; they must not
contain queries, source content, payloads, credentials, raw model output or claim
tokens. The Docker `local` driver uses a 10 MB × 5 files limit.

As incident evidence, keep masked logs, mutation status, a health/metrics snapshot,
the image digest and the storage manifest.

## 12. Release status

Passing unit/integration/contract tests is not a production GO. The decision stays
`NO-GO` until evidence is complete for backup→restore→rebuild→cutover with a real
provider and a production-like store, queue saturation, worker crash, cross-tenant
concurrency and a 24-hour soak.

<a id="troubleshooting"></a>

## Troubleshooting

Capture version/commit, runtime profile, content-free health, mutation/operation
IDs and error class. Never include keys, claim tokens or full source/query text.

| Symptom | Check | Safe response |
|---|---|---|
| Missing runtime profile/root | Explicit environment and CLI help | Use a dedicated writable root, never repo/home/filesystem root |
| 401 | Key registry, active principal, key rotation | Re-provision/reload authorized credentials; do not disable auth |
| 403/session conflict | ACL, session principal and dataset/agent binding | Grant intended scope offline; start a properly scoped session |
| Insert 422 | Required title/IDs, character bounds and content | Compare actual OpenAPI schema; keep exact source |
| Insert 409 | Frozen revision, identity/idempotency conflict | Reuse exact retry payload or create a new revision |
| Embedding 409/mismatch | Full provider/model/revision/dimension/normalization identity | Follow offline migration/rebuild; equal dimension is not equal space |
| `503 vector_backend_unavailable` | Provider availability and operational identity | Restore the selected provider; no silent model switch |
| `503 graph_backend_unavailable` | Health, timeout, Kùzu schema/parity | Diagnose query/backend and bounded traversal; do not advertise complete results |
| `503 maintenance_pending` | Active/retryable rebuild status | Follow [rebuild runbook](docs/core/rebuild-runbook/); no manual lease/queue deletion |
| Mutation stalls or enters DLQ | Projection predecessor, fenced claim, provider errors | Repair cause, then authorized replay if state permits |
| Semantic rejection | Rejection reason and validation policy | Treat as terminal; generic replay returns `NON_REPLAYABLE` |
| Cleanup `BLOCKED` | Store availability and shared ownership | Preserve evidence, repair store, run supported recovery |
| Readiness 503 | Worker liveness, thresholds, canonical backlog | Resolve health; process alive does not mean ready |
| FTS/parity error | Matching Alembic head and checksummed backup | Stop writers and rehearse recovery into a new root |
| Old Kùzu timestamp/schema error | Release code and offline schema migration | Upgrade/rehearse from backups; do not issue ad hoc ALTER or wipe |
| Growing RSS/disk | Lance fragments/versions, queues and retained generations | Measure representative workload; apply supported maintenance, reserve capacity |

Inspect `/v4/capability` before assuming semantic/graph availability. A model-disabled
profile intentionally lacks semantic generation. `wait_until_committed()` can
return failed terminal states; inspect `state` explicitly.

CLI `--help`, [configuration](docs/core/configuration/), [API](docs/core/api-reference/),
[operations](docs/core/operations/) and [migration](docs/core/operations/#upgrade-v080) describe supported
interfaces. Avoid raw SQL edits, in-place restore, forced queue completion and
unbounded retries. Real provider or production-size evidence unavailable in an
audit must remain `NOT EXECUTED`, never converted to a simulated success.


<a id="upgrade-v080"></a>

## Upgrading to v0.8.0

The pinned source describes package metadata 0.9.0 before its publication. The v0.8.1 publication was owner-approved with the limitations in
the [release notes](docs/core/release-notes/#v081-publication); it does not certify production
readiness. Confirm actual tags in GitHub Releases. This guide describes changes
since v0.7.1, not a completed production migration.

v0.8.1 retains the v0.8.0 schema head below. It adds storage/retrieval hardening
and developer-experience fixes; it introduces no new schema migration. The
existing embedding identity, offline upgrade and backup requirements still apply.

### Preconditions and changed contracts

Use a stopped, backed-up storage root and rehearse on a new disposable root.
Record source commit, lockfile, provider/model/revision/dimension/normalization,
Alembic head, artifacts and rollback path. RBAC has its own schema version.

Since v0.7.1, the tree includes immutable revision manifest activation, opaque
physical catalog identity, declared/manifest/chunk hash separation, durable
rebuild operations/generations, provider identity, assertion FTS/representation
and typed legal identity migrations. Current source expects Alembic head
`d5e6f7a8b9c0`. Do not assume an old database is compatible just because the
package version stayed 0.7.1 throughout the development branch.

New insertion/reprojection uses `assertion-semantic-v1`; migrated old vectors
are `legacy-v0` and cannot contribute as current semantic evidence. Reindex via
the supported full offline [rebuild](docs/core/rebuild-runbook/). Unknown legacy provider
identity can be adopted only with external proof and a fresh unclaimed pending
operation. Matching dimensions alone do not prove matching embedding spaces.

Search/context carry temporal and jurisdiction filters; graph ON/OFF ablation
and bounded diagnostics are available. Context has atomic proof packing and an
opt-in adaptive mode. HTTP insert supports typed legal identity, while SDK
insert does not currently expose it. Invalid/frozen/idempotency-conflicting
source identity fails rather than silently overwriting. Semantic `REJECTED`
replay returns `409 NON_REPLAYABLE`.

### Migration configuration

`mesa_storage/alembic.ini` owns the migration database URL.
`MESA_STORAGE_ROOT` alone does not change that URL. With all writers stopped,
prepare a reviewed copy of the Alembic configuration with an absolute staging
SQLite URL and absolute `script_location` pointing to this release's migrations:

```bash
.venv/bin/alembic -c /srv/mesa/reviewed-staging-alembic.ini upgrade head
```

The path is an operator example, not a configuration supplied by the repository.
Use a verified restored staging root and the matching release environment.
This migrates canonical V4 schema; the [projection runner](docs/core/rebuild-runbook/)
rebuilds its derived stores. Neither procedure is a general V3 content converter.
V3 content needs explicit source/catalog mapping and V4 ingestion into a separate root.

### Upgrade and rollback sequence

1. Drain work, stop writers and take a checksummed backup under the writer-lock boundary.
2. Validate the backup and restore to a new empty staging root.
3. Apply forward migrations offline with the supported release environment.
4. Rebuild derived projections where required; check scope, provenance and parity.
5. Rehearse start, insert, poll, search, restart and negative authorization.
6. Cut over only with full release evidence and retain previous roots/generations.

Alembic downgrade is not the rollback strategy. Restore a verified prior backup
into a new empty root using the matching prior code/config, then validate before
switching traffic. V3 and V4 never share writable physical storage. Do not alter
official certification evidence as part of upgrade verification.
