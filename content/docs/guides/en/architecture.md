## One authoritative memory catalog

SQLite owns source identity, immutable revisions, assertions, mutation state, artifact ownership and the BM25 indexes. LanceDB supplies the optional vector projection. It does not independently decide which fact is active or who may read it.

## Ingestion and recovery

Admission records durable work before background extraction, deterministic validation and the SQL → vector projection. SQLite and LanceDB do not share one ACID transaction; fenced leases, idempotent per-mutation receipts, ownership and reconciliation converge their state. Only COMMITTED is completed memory. A whole-document upload that is interrupted resumes from its saved chunks with the chunking plan recorded at admission.

## Read the system in separate views

The [architecture page](architecture/) separates the logical flow, physical stores, retrieval execution and evidence identity. [Ingestion](docs/core/concepts-and-ingestion/), [retrieval](retrieval/), [security](docs/core/security/) and [operations](docs/core/operations/) provide the detailed contracts.

## Search indexes and scope cache

A dataset-wide search without a date or jurisdiction filter uses that dataset's persistent FTS5 BM25 index. SQLite updates it in the same transaction as commits, supersessions, rollbacks and purges, and rebuilds it from canonical rows if it is missing. Narrower or dated searches build a temporary scoped FTS5 index; `MESA_SEARCH_SCOPE_CACHE=true` reuses those indexes and row/text features in a four-scope LRU. SQLite commit changes invalidate the cache; every request still rechecks authorization. Query embedding is computed before the search lock, and reranking runs after releasing the connection.
