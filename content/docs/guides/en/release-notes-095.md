## What 0.9.5 adds

MESA 0.9.5 lets you search a document as it stood at a point in time. Upload each version under the same `document_id` with a timezone-aware `metadata.valid_from`, then search with `valid_at`. Versions can arrive in any order, intervals are half-open, and results carry `revision_number`, `valid_from` and `valid_to`. See [versioned documents](docs/core/concepts-and-ingestion/#guide-versioned-documents).

## Search, storage and upgrade

Undated dataset-wide searches use a persistent per-dataset BM25 index in SQLite. LanceDB is locked to 0.41.0 and vector search is prefiltered by scope. Interrupted whole-document uploads resume from their saved chunks. The graph store is removed; read [graph store removed](docs/core/graph/) and the [upgrade guide](docs/core/migration/) before upgrading. The upstream release notes are reproduced below, and the [maintained release notes](docs/core/release-notes/) list measurements and limits.
