## One authoritative memory catalog

SQLite owns source identity, immutable revisions, assertions, mutation state and artifact ownership. LanceDB supplies vector projections; Kùzu supplies graph projections. They do not independently decide which fact is active or who may read it.

## Ingestion and recovery

Admission records durable work before background extraction, selected validation and SQL → vector → graph projection. Stores do not share one ACID transaction; fenced leases, idempotent receipts, ownership and reconciliation converge their state. Only COMMITTED is completed memory.

## Read the system in separate views

The [architecture page](architecture/) separates the logical flow, physical stores, retrieval execution and evidence identity. [Ingestion](docs/core/concepts-and-ingestion/), [retrieval](retrieval/), [security](docs/core/security/) and [operations](docs/core/operations/) provide the detailed contracts.
