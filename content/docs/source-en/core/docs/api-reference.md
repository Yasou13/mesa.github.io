# API reference

MESA exposes two versioned surfaces:

- v3 is the backward-compatible lexical-core API.
- v4 is the versioned API authorized by tenant and dataset. Package 0.8.1 is published with the owner's explicit approval, outside production certification.

Versioned memory, health and metrics calls require `X-API-Key`. `/health/init`, OpenAPI, Swagger and ReDoc are public surfaces and need a network/reverse-proxy policy. The V4 key is
generated with `mesa-v4-admin issue-key`; only a salted scrypt hash is stored.
The working sources of the OpenAPI contract are `mesa_api/router.py` and
`mesa_api/v4_router.py`.

## V4 capability

`GET /v4/capability` returns `api_version`, `features`, `capabilities` and
`limits`. `features` contains the capability names whose values are true.
The response depends on the configured and operational runtime; a sample
response must not be used as a fixed feature promise.

| Capability | Meaning |
|---|---|
| `canonical_ledger`, `projection_outbox`, `idempotent_ingestion` | Durable canonical work and projection contracts |
| `vector_retrieval` | Operational embedding generation, not merely configured identity |
| `lexical_retrieval`, `assertion_relational_lane` | SQLite lexical/assertion retrieval; not graph traversal |
| `graph_projection` | Graph projection availability |
| `graph_neighbor_retrieval` | Operational neighbor retrieval implementation |
| `validity_interval_filtering` | Validity filtering, not bitemporal semantics |
| `durable_rebuild` | Enabled by `MESA_V4_REBUILD_ENABLED`; still offline and full-root |
| `associative_ppr`, `bitemporal_query`, `human_review` | Not advertised as implemented Core capabilities |

Rebuild limits are `rebuild_kind=projection`, `rebuild_scope=storage_root`, and
`requires_offline_runner=true`. A projection-only graph adapter does not supply
neighbor retrieval. Custom embedding providers are non-operational until a
successful embedding call. Configured backend failure is surfaced explicitly;
see [retrieval behavior](docs/core/retrieval-and-graph/) and [troubleshooting](docs/core/operations/#troubleshooting).

## V4 administrative rebuild operations

This surface is only for a control-plane `ADMIN` principal and accepts no
physical path or canonical content:

| Method | Path | Success | Purpose |
|---|---|---|---|
| `POST` | `/v4/operations/rebuild` | `202` | Submits a storage-root operation with a mandatory `Idempotency-Key` |
| `GET` | `/v4/operations/{operation_id}` | `200` | Returns content-free state/progress |
| `POST` | `/v4/operations/{operation_id}/cancel` | `200` | Cancels only a `PENDING`/`RETRYABLE_FAILED` operation |
| `POST` | `/v4/operations/{operation_id}/retry` | `202` | Returns a safe `RETRYABLE_FAILED` checkpoint to pending |
| `POST` | `/v4/rebuild` | `202` | Deprecated storage-root alias |

With the flag off, submit/retry returns `501`; an unsupported scoped alias returns `409`;
an invalid state returns `409`. Unauthorized status/cancel/retry returns `404` so the
operation's existence is not leaked. The state flow is
`PENDING → CLAIMED → RUNNING → VERIFYING → READY_TO_CUTOVER → COMPLETED`;
side states are `RETRYABLE_FAILED`, `FINAL_FAILED` and `CANCELLED`. While an
operation is active or retryable, mutation admission returns `503 maintenance_pending`.
The offline operating procedure is in
[`v4-rebuild-runbook.md`](docs/core/rebuild-runbook/).

## V4 catalog

| Method | Path | Required permission | Purpose |
|---|---|---|---|
| `POST` | `/v4/catalog/workspaces` | Tenant `OWNER` | Creates a tenant/workspace |
| `GET` | `/v4/catalog/workspaces` | `READER` in the visible scope | Lists workspaces |
| `POST` | `/v4/catalog/datasets` | Dataset/workspace `OWNER` | Creates a dataset |
| `GET` | `/v4/catalog/datasets` | `READER` in the visible scope | Lists datasets |
| `POST` | `/v4/catalog/documents` | Dataset `WRITER` | Creates a document |
| `GET` | `/v4/catalog/documents` | Dataset `READER` | Lists documents |
| `POST` | `/v4/catalog/revisions` | Dataset `WRITER` | Creates an immutable revision |
| `GET` | `/v4/catalog/revisions` | Dataset `READER` | Lists revisions |
| `POST` | `/v4/catalog/source-chunks` | Dataset `WRITER` | Creates an exact source chunk |
| `DELETE` | `/v4/catalog/documents/{document_id}` | Dataset `OWNER` + `PURGE` | Starts a source-owned purge |

Catalog IDs are tenant-scoped public IDs; physical storage keys are not public
aliases. Revision/chunk identity, finalization and the distinction between
`declared_content_hash`, `manifest_hash` and chunk `content_hash` are defined in
[concepts and ingestion](docs/core/concepts-and-ingestion/).

## V4 session and memory

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v4/sessions/start` | Starts a server-generated session whose dataset scope cannot change |
| `POST` | `/v4/memory/insert` | Admits exact source and creates a mutation and pipeline run |
| `POST` | `/v4/memory/search` | Runs vector/BM25/assertion/graph RRF search over authorized datasets |
| `GET` | `/v4/mutations/{mutation_id}` | Returns state, pipeline, artifact and projection status |
| `POST` | `/v4/mutations/{mutation_id}/replay` | Re-queues authorized DLQ/retry work |
| `POST` | `/v4/mutations/{mutation_id}/rollback` | Starts a source-owned rollback |
| `GET` | `/v4/sessions/{session_id}/context` | Returns session context and mutation provenance |
| `POST` | `/v4/sessions/{session_id}/end` | Requests durable finalization and closes the session |

Insert derives tenant/workspace/agent from the authorized session and returns
`202` with `mutation_id`, `candidate_id`, `pipeline_run_id` and `raw_log_id`.
This is admission; poll status and require `COMMITTED` before assuming success.
`wait_until_committed()` also returns failed terminal states.

For multiple chunks use distinct IDs/ordinals, `finalize_revision=false` until
the last insert, then `true`. Retry the exact payload with the same body
`idempotency_key`. Revision lifecycle, rejection/replay and rollback semantics
are defined in [concepts and ingestion](docs/core/concepts-and-ingestion/).

The HTTP insert contract accepts optional typed `legal_identity`: `law_id` and
`article_id` are required within that object; `statute_code`, `version_id`,
`paragraph_id` and `clause_id` are optional. Identity must resolve consistently
through the bounded legal aliases. Caller metadata cannot supply trusted
`_mesa_*` fields. The producer remains responsible for source truth.

Search and context both accept `jurisdiction`, `valid_at`, `valid_from` and
`valid_to`. Context uses query parameters and defaults to `token_budget=2048`,
`retrieval_mode=single`. Opt-in `adaptive` permits at most one planner call and
two additional scoped searches. Scores, graph provenance, proof packing and
offline token counting are defined in [retrieval and graph](docs/core/retrieval-and-graph/).
Raw `/v4/memory/search` remains the single-query primitive.

## V4 Python SDK

This example assumes a model-enabled V4 server, a provisioned `credential`, an existing
`tenant-a/workspace-a/dataset-a` catalog and session permission for `agent-a`.
For an example that also sets these up, use [Getting started](docs/core/getting-started/).

```python
from mesa_client import MesaV4Client

with MesaV4Client("http://127.0.0.1:8000", api_key=credential) as client:
    session = client.start_session(
        tenant_id="tenant-a",
        workspace_id="workspace-a",
        dataset_ids=["dataset-a"],
        agent_id="agent-a",
    )
    accepted = client.insert(
        session_id=session["session_id"],
        dataset_id="dataset-a",
        document_id="doc-a",
        revision_id="rev-1",
        chunk_id="chunk-1",
        title="Neutral source example",
        source_ref="demo://source-a",
        content="Exact source text",
    )
    terminal = client.wait_until_committed(accepted["mutation_id"])
    if terminal["state"] != "COMMITTED":
        raise RuntimeError(terminal["state"])
    result = client.search(session_id=session["session_id"], query="Exact source")
    for hit in result["results"]:
        print(hit["assertion_id"])
        for source in hit.get("provenance", []):
            print(source["source_ref"], source["dataset_id"], source["chunk_id"])
    context = client.get_context(session_id=session["session_id"], query="Exact source")
    print(context["context"])
    client.end_session(session_id=session["session_id"])
```

`accepted` is durable admission, not finished retrieval. `client.status(mutation_id)`
exposes `state`, `failure_class`, `rejection_reason`, `pipeline_run`, `artifacts`
and `projections`. Wait for `COMMITTED`; `REJECTED`, `DEAD_LETTER`, `BLOCKED` and
`ROLLED_BACK` are terminal outcomes too. A wait timeout raises `MesaNetworkError`
and leaves the mutation running. Recheck status; for an uncertain insert retry
the same payload with an explicit, unchanged `idempotency_key`.

`results=[]` on a successful search means no matching visible evidence. Provider,
storage and authorization failures raise errors instead. Each hit's
`assertion_id` identifies a canonical claim; `provenance` links it to the source
and dataset/chunk. A score ranks evidence; it is not a truth probability.
Context returns packed text in `context` and structured evidence in
`canonical_memories`. Finish retrieval before `end_session`; closing the HTTP
client alone does not end the server session.

For async code use `async with AsyncMesaV4Client(...) as client` and `await` each
of these methods, including polling and `end_session`. Do not run the blocking
`MesaV4Client` inside an event loop. Async clients also support `await client.aclose()`;
sync clients support `client.close()`.

For a multi-chunk revision, use `finalize_revision=False` on the first calls and the
default `True` on the last call. The `search` and `get_context` methods
support all three of `valid_at`, `valid_from` and `valid_to`.

Besides capability, catalog, session, insert, search, status, wait, replay,
rollback, purge, context and end operations, `MesaV4Client` and `AsyncMesaV4Client`
offer the control-plane methods `submit_rebuild`, `operation_status`,
`cancel_operation` and `retry_operation`. The V3 clients are kept as `MesaClient`
and `AsyncMesaClient`. The dataset-bound MCP surface offers no mutating global
rebuild tool.

## V4 authorization

The route layer resolves this context on the server:

```text
principal → tenant → workspace → dataset → agent → session
```

The `OWNER`, `WRITER` and `READER` roles inherit downward. Purge and
rollback additionally need the dataset `PURGE` or `ROLLBACK` permission. An agent is a
persona/compute context; on its own it is not a security boundary.
Rollback and replay are historical management operations; the originating session may
be closed. Even so, principal/session ownership, the match between the mutation's and
the session's tenant/workspace/dataset/agent scope, the dataset role and the explicit
`ROLLBACK` permission are verified on every call.

Provision keys, roles and explicit dataset permissions using the
[operations runbook](docs/core/operations/#credential-bootstrap); the
[CLI reference](docs/core/api-reference/#cli) identifies admin entry points. RBAC uses its
own schema version in the policy database, independently of Alembic migrations
for canonical storage. Lost grants from an old database cannot be inferred or
recreated automatically.

Internal DAO ownership, projection and Graph V2 structure belong in the
[architecture](docs/core/architecture/); they are not separate public HTTP methods.

## V3 compatibility API

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v3/memory/insert` | Durable lexical-core dispatch |
| `POST` | `/v3/memory/search` | V3 retrieval |
| `GET` | `/v3/memory/status/{log_id}` | Raw-log job status |
| `DELETE` | `/v3/memory/purge` | V3 soft-delete flow |
| `POST` | `/v3/memory/session/start` | Starts a V3 session |
| `GET` | `/v3/memory/session/{session_id}/context` | V3 context |
| `POST` | `/v3/memory/session/{session_id}/end` | Durable finalization |

V3's `agent_id/session_id` RBAC and compensating multi-store behavior exist only for
the compatibility surface. Do not confuse them with V4's dataset security or its
ledger/outbox guarantees.

## Health and metrics

- `/health` and `/v3/health`: `status`, `maintenance`, `rebuild_state` summary with an API key
- `/health/init`: public readiness; `200 {"status":"ready"}` when ready, otherwise `503`
- `/metrics`: Prometheus counters and gauges with an API key

`/health` can return HTTP 200 even when degraded or in maintenance; do not treat the
HTTP code alone as success — check the `status` field. Detailed queue,
projection and rebuild counters are read from `/metrics`.

V4 metrics cover projection backlog/DLQ/stuck leases, cleanup backlog/BLOCKED,
ownerless registry, shared artifacts and rebuild state/duration/progress,
parity-missing, staging bytes and rollback counts. Alert rules are in
`docs/prometheus_alerts.yml`.

## Request and SDK details

`title` is required for V4 HTTP insert and the sync/async SDK insert. `title` is 1..512,
`content` 1..32768 characters, `source_ref` 1..2048, `evidence_span` at most 4096 and
`idempotency_key` at most 128 characters. The dataset must belong to the session.
HTTP and the sync/async SDK `insert` support the optional `legal_identity` parameter.
Use the running OpenAPI for differences between public/source ID validators.

A search request requires `session_id` and `query`; the query is 1..4096 characters,
`limit` defaults to 10 within 1..50, `dataset_ids`, when given, is 1..64 and a subset of the
session, and `graph_mode` is enabled/disabled. ISO timestamp strings must include a
timezone offset. `valid_from > valid_to` is rejected. The response carries `session_id`,
`dataset_ids`, `results` and optional `scope_audit`, `graph_ablation` and `vector_lane`.
The presence of result provenance does not guarantee source truth.

The SDK sync/async client defaults to a 10 s timeout and max_retries 3; only the safe
network retry boundary applies. API HTTP error responses become `MesaAPIError`,
network errors `MesaNetworkError`, SDK schema errors `MesaValidationError`. Status
400/401/403/404/409/413/422/429/503 varies by endpoint; OpenAPI and the contract
tests are the source of authority. Honour Retry-After for queue saturation and rebuild
maintenance. The per-minute default is 60/minute and the daily default 10000,
per principal; health/metrics are outside the daily budget.

### Actionable errors

Catch `MesaAPIError` to inspect `status_code`, `error` and `detail`. HTTP bodies
also include `retryable`; the SDK does not automatically retry HTTP failures.
Rejected request values and internal route paths are omitted from validation
errors. For example, a non-string search query returns HTTP 422:

```json
{"error":"VALIDATION_ERROR","detail":"body.query: Input should be a valid string","status_code":422,"retryable":false}
```

| Response | Next step |
|---|---|
| 401 `UNAUTHORIZED` | Supply the issued MESA key, not the provider key |
| 403 `ACCESS_DENIED` | Check tenant/dataset roles, agent grant and session scope |
| 404 `NOT_FOUND` | Check the ID and credential scope; hidden objects may also return 404 |
| 409 `SESSION_INACTIVE` | Start an authorized active session before new writes |
| 409 `IDEMPOTENCY_CONFLICT` | Reuse the original payload with that key, or use a new key for new content |
| 422 `VALIDATION_ERROR` | Correct the named field/format; timestamps need a timezone |
| 503 `BACKEND_UNAVAILABLE`, detail `canonical_processing_unavailable` | Enable configured extraction/embedding in one combined owner; models-off startup cannot ingest V4 |
| 503, detail `vector_backend_unavailable` / `graph_backend_unavailable` | Check provider credentials, embedding identity and backend readiness; an empty result is not a substitute |
| 503, detail `queue_over_capacity` / `maintenance_pending` | Respect `Retry-After` when present and wait for capacity/maintenance |

Failed background processing is reported by mutation status even when the insert
returned 202. Inspect its failure/projection fields; an admission response or an
empty early search does not establish successful processing. Startup
configuration errors appear in the server terminal before readiness; see
[configuration](docs/core/configuration/#environment-file-and-first-startup).

The list catalog calls offer no explicitly documented pagination guarantee here;
inspect the response/schema. A runnable example, including the first catalog/ACL and
credential prerequisites, is in [Getting started](docs/core/getting-started/).

Canonical V4 insertion requires the model-enabled combined processing consumer.
Model-disabled boot is topology/compatibility smoke and rejects V4 writes with
`503 canonical_processing_unavailable`; it is not a V4 insert/search demonstration.

The [OpenAPI snapshot](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/reference/openapi.json) is a generated reference.
Use the running app's `/openapi.json` and route/schema source for the exact
checkout; do not infer snapshot freshness from this page. Generating a schema
without server startup does not exercise authentication or runtime behavior.

<a id="cli"></a>

## CLI commands

The entry points are declared in `pyproject.toml`. Run `.venv/bin/<command>
--help` after the locked install. These commands do not have a universal
`--version`; read package metadata with:

```bash
.venv/bin/python -c "from importlib.metadata import version; print(version('mesa-memory'))"
```

| Command | Scope |
|---|---|
| `mesa-v4-admin` | Offline credentials and ACL provisioning; defaults to `MESA_STORAGE_ROOT/rbac_policy.db` |
| `mesa-recovery` | Trusted-root checksummed backup, validate and new-root restore |
| `mesa-v4-rebuild` | Offline full-root projection rebuild/adoption; never an online worker |
| `mesa-mcp` | stdio server; V3 default, explicit V4 settings supported |
| `mesa-mcp-gateway` | Independently supervised HTTP/Streamable HTTP control gateway |
| `mesa-antigravity-bridge` | Binding-scoped stdio bridge with encrypted write spool |
| `mesa` | Codex/Antigravity install, doctor, profiles, credential lifecycle and operations approvals |

### Admin bootstrap

```bash
.venv/bin/mesa-v4-admin --help
.venv/bin/mesa-v4-admin grant-role --principal docs-principal --tenant docs-tenant --role OWNER
.venv/bin/mesa-v4-admin grant-agent --principal docs-principal --agent docs-agent --permission SESSION_CREATE
```

Use these only against the intended stopped/new policy database. `issue-key`
prints the credential once; `rotate-key --key-id` revokes/replaces it.
`grant-control` assigns `ADMIN`. `grant-dataset-permission` explicitly assigns
`PURGE`/`ROLLBACK`; role inheritance alone does not give those operations.
Dataset role grants require both `--workspace` and `--dataset`. Corresponding
`revoke-role`/`revoke-dataset-permission` remove authorization.

### Recovery, rebuild and MCP

Use [operations](docs/core/operations/) and [rebuild](docs/core/rebuild-runbook/) for safety,
trusted paths, locking, status, retry/lease, exit codes and retained generations.
Never use arbitrary raw-store cleanup as a CLI substitute.
[MCP](docs/core/mcp/) describes binding credentials, encryption and local
operator approval. `mesa operations approve/reject` acts on durable operation
IDs with server-side ADMIN authority; it does not bypass gateway policy.

`python -m mesa_memory.runtime_entrypoint` selects the explicit runtime profile;
there is no `mesa serve` command. `mesa-benchmark` belongs to the separate
benchmark project and is not installed by this Core package.


<a id="mcp-control-api"></a>

## MCP control API

A server-side control API manages MCP clients, connections, credential summaries and
approvals. The sources are in `mesa_api/routers/control/router.py`,
`mesa_mcp/gateway/` and `mesa_storage/control/`.

### Permissions and access

The API prefix is `/control/mcp`. Every call requires an active authenticated principal
with the server-side `ADMIN` role. Loopback access does not grant this automatically.
Credential summaries contain no plaintext token. Gateway transport/binding credentials
are a separate authority boundary. Use an authenticated reverse proxy for remote access.

### Available routes

| Method | Path under `/control/mcp` | Purpose |
|---|---|---|
| POST/GET | `/clients` | Create/list clients |
| GET | `/clients/{client_id}` | Client detail |
| PUT | `/clients/{client_id}/enabled` | Enable/disable (`enabled` query) |
| GET | `/clients/{client_id}/bindings` | Project/dataset bindings |
| GET | `/connections` | Active connections |
| GET/POST | `/settings` | Settings; POST takes `key` and `value` query fields |
| GET/POST | `/policies` | Policy rules |
| GET | `/managed-clients` | Codex/Antigravity safe binding/credential summary |
| POST | `/credentials/{credential_id}/revoke` | Revoke a credential |
| GET | `/activity`, `/activity/{call_id}` | Bounded activity list/detail |
| GET | `/approvals`, `/approvals/pending` | Approval list |
| POST | `/approvals/{approval_id}/decide` | Authorized decision |
| GET | `/overview` | Aggregate status |

The live OpenAPI is the final source for parameters and schemas. This API offers no web
interface; the removed dashboard and showcase applications do not need to be started.

### Gateway and approval lifecycle

Codex connects directly to the HTTP MCP gateway; Antigravity connects through the
binding-scoped stdio bridge. The gateway stores policy, credentials, approvals and durable
operation state. A default write approval returns pending with an operation ID; it does not
keep a long stdio call open. `mesa operations approve/reject` records a decision only for a
valid pending operation, an active client/binding and an ADMIN principal. The gateway's normal
consumer runs the approved work. The same idempotency key returns the same operation.

The CLI uses the public operation ID. The control API path
`POST /control/mcp/approvals/{approval_id}/decide` uses the approval ID instead;
the two identifiers are not interchangeable. When legacy middleware returns only an
approval ID, decide through the control API.

Credential install, doctor, rotate, disable/uninstall, protected XDG files and
operator CLI examples are in the [MCP guide](docs/core/mcp/).

### Evidence boundary

An activity record can show that a context response was delivered; it does not prove
that the model actually used that information or that the answer is correct. Human
approval is not the same as the Core V4 `human_review` legal capability flag.
