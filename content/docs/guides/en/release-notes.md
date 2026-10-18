## v0.8.1 · 18 October 2026

The published source release hardens scoped retrieval, storage ownership and error handling. Production qualification remains NO-GO; real-provider integration, production-size capacity and a 24-hour soak are not certified. The annotated tag is unsigned.

## What changed

- BM25 corpus statistics and pre-rank audit queries now use authorized tenant/dataset scope.
- Projection completion checks ownership/fencing; repair avoids deleting other datasets’ artifacts. Kùzu delete and rollback caches stay consistent.
- Vector and embedding failures are explicit; reserved `_mesa_` metadata and non-finite RRF weights are rejected.
- Sync and async V4 SDK insertion accept optional `legal_identity`; default status polling is two seconds. `make health` checks the running API.
- The dashboard/showcase and obsolete scripts were removed. MCP control APIs and approval CLI remain.
- Installation, CLI, troubleshooting, upgrades, ecosystem and limits are consolidated into maintained guides. The schema head is unchanged from v0.8.0.

## Read the maintained sources

The changelog below retains release history. [Installation](docs/core/installation/), [API and CLI](docs/core/api-reference/), [operations](docs/core/operations/) and [architecture decisions](docs/core/decisions/) reflect the new source tree.
