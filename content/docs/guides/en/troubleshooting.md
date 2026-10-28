## Purpose and boundaries

Check initialization separately from authenticated readiness. Inspect capability flags before claiming vector or graph availability. Models-off combined operation supports ingestion and BM25 search. A 503 canonical_processing_unavailable error indicates the combined consumer is unavailable; 202 still needs mutation polling. Inspect pipeline/projection receipts for retryable failures. Do not delete locks, bypass tenant checks or replay semantic rejection as a generic recovery step.

## Continue with the maintained contracts

Use the pinned source reference below for complete tables and operator details. Related guides: [architecture](architecture/), [API](docs/core/api-reference/), [operations](docs/core/operations/) and [release limits](docs/core/limitations/).
