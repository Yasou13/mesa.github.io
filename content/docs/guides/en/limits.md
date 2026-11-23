## Purpose and boundaries

No general latency, throughput, accuracy or hallucination-elimination guarantee is established. Local deterministic fixtures verify contracts; mock vectors do not measure semantic quality. Graph limits bound work, not completeness. Context budgets apply to formatted evidence; conservative offline counting can underfill. Read dated benchmark conditions rather than treating historical numbers as current provider results.

## Continue with the maintained contracts

Use the pinned source reference below for complete tables and operator details. Related guides: [architecture](architecture/), [API](docs/core/api-reference/), [operations](docs/core/operations/) and [release limits](docs/core/limitations/).

## v0.9.4 measured changes

The tagged changelog reports, on the shared Tier M DEV store with models and reranking off, passage Hit@5 rising from 50/112 to 61/112, MRR from 0.3411 to 0.3955 and median search latency falling from 361.3 ms to 233.9 ms. For a 5 MB models-off fixture, end-to-end readiness fell from 249.99 s to 172.61 s. These are DEV and local measurements, not held-out test results or service guarantees.

## v0.9.3 measured readiness

The tagged changelog reports full readiness for a 4,999,000-byte document in **245.20 s**, versus **718.27 s** before (2.93× faster), with models off and graph on: all 4,882 mutations COMMITTED, SQL and GRAPH COMPLETED, VECTOR SKIPPED, lossless chunk readback. The separate final Opus Round 20 check reports **239.35 s (3.00×)** on `dbf113b`. These local measurements are not a service guarantee.

## Known issues recorded in v0.9.3

The v0.9.4 changelog does not mark these as fixed.

- Per-minute and daily rate limits are not enforced for `/v4/*` and `/control/*`.
- ASCII `yargitay` does not match `Yargıtay`; index-side Turkish folding remains deferred.
- Kùzu 0.11.3 can write uninitialized memory into graph page tails. Raw graph files may contain fragments of text handled by the process even though memory text is not stored in logical graph properties (checked by query). Treat the graph directory as sensitive like SQLite.

See the [tagged changelog](https://github.com/Yasou13/MESA/blob/531209bc45805b478264f6dfa8a9e40a94e345cb/CHANGELOG.md#093---2026-11-16). Production NO-GO remains. Historical 0.9.2 search measurements are retained in [release notes](docs/core/release-notes/); the [0.9.3 benchmark](benchmark/0.9.3/) does not describe 0.9.4, and no 0.9.4 benchmark is published yet.
