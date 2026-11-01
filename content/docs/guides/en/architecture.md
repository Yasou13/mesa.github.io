## One authoritative memory catalog

SQLite owns source identity, immutable revisions, assertions, mutation state and artifact ownership. LanceDB supplies vector projections; Kùzu supplies graph projections. They do not independently decide which fact is active or who may read it.

## Ingestion and recovery

Admission records durable work before background extraction, selected validation and SQL → vector → graph projection. Stores do not share one ACID transaction; fenced leases, idempotent receipts, ownership and reconciliation converge their state. Only COMMITTED is completed memory.

## Read the system in separate views

The [architecture page](architecture/) separates the logical flow, physical stores, retrieval execution and evidence identity. [Ingestion](docs/core/concepts-and-ingestion/), [retrieval](retrieval/), [security](docs/core/security/) and [operations](docs/core/operations/) provide the detailed contracts.

## Search concurrency and scope cache

`MESA_SEARCH_SCOPE_CACHE=true` reuses temporary scope-specific FTS indexes and row/text features in a four-scope LRU. SQLite commit changes invalidate the cache; every request still rechecks authorization. Query embedding is computed before the search lock, and reranking runs after releasing the connection. scrypt verification, issuance and rotation run outside the event loop without caching authorization results. With graph disabled, graph seed preparation is skipped.
