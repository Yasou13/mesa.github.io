## Removed in 0.9.5

MESA Core 0.9.5 removed the Kùzu graph database, the graph projection worker and the graph search lane. Search now uses BM25, optional vector search, the built-in legal rules and optional reranking. SQLite still stores entities and assertions with their sources; nothing in the canonical record was lost.

The graph had been off by default since 0.9.4. In the Round 21 measurement on the benchmark v2 dev split, turning the graph off lost no dev questions. Read [why MESA removed its graph store](research/why-mesa-removed-its-graph-store/) for the measurements.

## Upgrading an existing store

- The upgrade runs a forward-only migration that clears old graph bookkeeping rows. Back up the storage root first.
- Old `kuzu_db` files on disk are ignored. After you have verified your backup, you can delete them by hand.
- `MESA_GRAPH_ENABLED`, `MESA_RRF_GRAPH_WEIGHT` and `MESA_V4_GRAPH_TIMEOUT_SECONDS` are ignored; the server logs one warning per key at startup. Remove them from your environment.
- The search request still accepts `graph_mode` for older clients, but the value has no effect.

See the [upgrade guide](docs/core/migration/) and the [0.9.5 release notes](docs/core/release-notes/).
