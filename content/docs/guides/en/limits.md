## Purpose and boundaries

No general latency, throughput, accuracy or hallucination-elimination guarantee is established. Local deterministic fixtures verify contracts; mock vectors do not measure semantic quality. Context budgets apply to formatted evidence; conservative offline counting can underfill. Read dated benchmark conditions rather than treating historical numbers as current provider results.

## Continue with the maintained contracts

Use the pinned source reference below for complete tables and operator details. Related guides: [architecture](architecture/), [API](docs/core/api-reference/), [operations](docs/core/operations/) and [release limits](docs/core/limitations/).

## v0.9.5 measured scale (local, 100,820 chunks)

These are Round 23 local measurements on runtime commit `a0d585f`, which is part of v0.9.5. Conditions: one Linux x86_64 machine with 8 vCPU, 14 GiB RAM plus 4 GiB swap and an NVMe SSD. The corpus is the frozen Tier M benchmark set (141 documents) repeated 20 times into one dataset: 2,820 documents, 100,820 chunks, uploaded to an empty store through `POST /v4/documents`. Search used the 128 benchmark v2 dev questions, three passes each, limit 50, one dataset, no date filter; warm figures pool passes two and three. The vector runs used a localhost provider that returns deterministic 1,024-dimension vectors, so they time the vector path but say nothing about semantic quality.

| Mode at 100,820 chunks | Write time | Warm HTTP search p50 / p95 | First query after start | Peak search memory |
|---|---:|---:|---:|---:|
| Models off (BM25), 0.9.4-era baseline | 9,288.2 s | 1,222.7 / 1,616.2 ms | 22,812.9 ms | 2,073.1 MiB |
| Models off (BM25), v0.9.5 | 7,422.7 s | 752.7 / 871.7 ms | 14,764.0 ms | 1,965.6 MiB |
| Deterministic vectors, v0.9.5 | 5,533.2 s backfill | 2,016.2 / 2,451.7 ms | 21,292.4 ms | 3,609.2 MiB |

The warm vector lane alone took 286.7 / 342.8 ms (p50 / p95) at 100,820 chunks, against a p50 of 19,605.5 ms over three warm queries in the baseline. During the fresh 100k build the client retried one HTTP 503 caused by a SQLite busy timeout. Retrieval quality at this size was not measured: the copies repeat the same 141 documents.

## v0.9.4 measured changes

The tagged 0.9.4 changelog reports, on the shared Tier M DEV store with models and reranking off, passage Hit@5 rising from 50/112 to 61/112, MRR from 0.3411 to 0.3955 and median search latency falling from 361.3 ms to 233.9 ms. For a 5 MB models-off fixture, end-to-end readiness fell from 249.99 s to 172.61 s. These are DEV and local measurements, not held-out test results or service guarantees.

## Known issues still open

The v0.9.5 changelog does not mark these 0.9.3 issues as fixed.

- Per-minute and daily rate limits are not enforced for `/v4/*` and `/control/*`.
- ASCII `yargitay` does not match `Yargıtay`; index-side Turkish folding remains deferred.

Production NO-GO remains. Historical search measurements are retained in [release notes](docs/core/release-notes/); see the [benchmark page](benchmark/) for which release each result describes.
