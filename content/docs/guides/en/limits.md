## Purpose and boundaries

No general latency, throughput, accuracy or hallucination-elimination guarantee is established. Local deterministic fixtures verify contracts; mock vectors do not measure semantic quality. Graph limits bound work, not completeness. Context budgets apply to formatted evidence; conservative offline counting can underfill. Read dated benchmark conditions rather than treating historical numbers as current provider results.

## Continue with the maintained contracts

Use the pinned source reference below for complete tables and operator details. Related guides: [architecture](architecture/), [API](docs/core/api-reference/), [operations](docs/core/operations/) and [release limits](docs/core/limitations/).

## v0.9.2 known limitations

A measured 1,000-candidate search took about 11.6 seconds; restored `/health` responsiveness is not proof of faster search. A 4,999,000-byte upload took about seven minutes to become ready with models off and graph on. Persistent admission pressure can still return `503 queue_over_capacity`. Older whole-document secret scanning and extreme Unicode normalization can stall the request path for sub-second periods.

UUID ties may reorder separately ingested stores. Same-store retained-input determinism remains. Non-object document requests retain an INFO-level 422 detail wording difference. The official release notes a Python 3.13 post-merge parser CI timing failure (200 ms bound), with a speed fix intended for 0.9.3. See the [official release](https://github.com/Yasou13/MESA/releases/tag/v0.9.2); production NO-GO remains.
