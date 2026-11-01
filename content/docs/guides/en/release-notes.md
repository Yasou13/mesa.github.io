## v0.9.1 · 1 November 2026

The [GitHub release](https://github.com/Yasou13/MESA/releases/tag/v0.9.1) is published at `e2f984d4ad97c01782a347e29e44808e5a16dad3`. The [PyPI 0.9.1 package](https://pypi.org/project/mesa-memory/0.9.1/) is also published and verified; see [installation](docs/core/installation/). Python >=3.11 is required. Alpha / production NO-GO remains.

## What changed

Round 13 adds the four-scope cache, ingestion indexes, off-event-loop scrypt and CLI activation waiting. Round 14 adds `MESA_CHUNKING=auto|plain`, lazy optional BGE reranking, vector weight 8.0, early terminal chunk errors and source-based deletion. OpenAI/Ollama SDKs move into the base package. Other RRF weights remain 1.0, `k=60`; zero weights remove lane contribution. Existing ACTIVE revisions and V4 route/request contracts remain compatible.

The CLI waits for ACTIVE by default; `--no-wait` returns admission. The tagged `Mesa.add` SDK signature still defaults to `wait=False`; pass `wait=True` to wait. `RETRY_PENDING` is not terminal. See [CLI](docs/core/cli-reference/), [SDK](docs/core/examples/), [configuration](docs/core/configuration/) and [upgrade](docs/core/migration/).

## Round 14 DEV evidence

Measured 1 November 2026: frozen Turkish Tier M corpus, 141 documents, 5,041 chunks; 101 DEV questions (85 answerable, 16 no-answer). Article chunking enabled, extraction disabled, embeddings and graph enabled. The test split was not accessed. Passage hit@5 and MRR use the 85 answerable questions; latency covers all 101. Search limit and reranker depth are 50, reranker max_length 1024. Other lane weights stay 1.

| Vector weight | Reranker | Passage hit@5 | Passage MRR | Search p50 (s) | Search p95 (s) |
| --- | --- | --- | --- | --- | --- |
| 1 | Off | 0.5176 | 0.3953 | 1.2693 | 2.0035 |
| 1 | On | 0.7412 | 0.6816 | 1.9548 | 2.5736 |
| 2 | Off | 0.5765 | 0.4565 | 1.2708 | 1.9640 |
| 2 | On | 0.7529 | 0.7055 | 1.9569 | 2.6364 |
| 4 | Off | 0.6588 | 0.5152 | 1.2836 | 1.9469 |
| 4 | On | 0.7765 | 0.7069 | 1.9279 | 2.6100 |
| 8 | Off | 0.6706 | 0.5663 | 1.2849 | 1.9115 |
| 8 | On | 0.7647 | 0.6973 | 1.9161 | 2.5360 |

The default is selected by reranker-off MRR because reranking defaults off: weight 8 improves unrounded MRR by 0.171008, exceeding the 0.02 rule. Weight 4 has the best reranker-on MRR in this sweep. These are corpus-specific development results, not test-split evidence or production certification.

## Separate CPU/GPU device pass

This separate pass uses vector weight 1; it must not be combined with the weight-8 row above.

| Device / reranker | Passage hit@5 | Passage MRR | Search p50 (s) | Search p95 (s) |
| --- | --- | --- | --- | --- |
| GPU / Off | 0.5176 | 0.3953 | 1.2531 | 1.9953 |
| GPU / On | 0.7412 | 0.6816 | 1.9627 | 2.6029 |
| CPU / On | 0.7412 | 0.6816 | 26.9158 | 33.8756 |

Embedding: `BAAI/bge-m3`, 1024 dimensions, normalized. Reranker: `BAAI/bge-reranker-v2-m3`. Hardware: Colab A100-SXM4 40GB and Intel Xeon 2.20GHz, eight CPU threads. The CPU row moves both models to CPU without quantization. Models were acquired before runtime startup. Python 3.13.16, Torch 2.11.0+cu130, sentence-transformers 5.7.0, transformers 5.21.0, NumPy 2.5.4, LanceDB 0.41.0, Kùzu 0.11.3: installed Colab packages, not exact ML lockfile pins.

Requests use the authenticated HTTP route through ASGI without TCP. Passes are sequential, reuse store/caches and exclude one first-query warmup per pass. Latency includes embedding, scoped retrieval and optional reranking. It is descriptive, not a controlled hardware speedup claim. The store was reused after the search-lock change, with all 101 DEV top-50 result dictionaries unchanged.

## Round 13 local DAO control

Synthetic local scope-cache microcheck: 3,500 chunks, 20 queries; DAO p50 100.813 → 20.142 ms, p95 155.789 → 46.862 ms. It excludes HTTP, authentication and model time; it does not show the whole system becoming five times faster. Ingest-index timings measure bookkeeping only.

## Sources and retained example

The home demo and quickstart receipts remain explicitly labelled Core v0.9.0 recordings. The OpenAPI snapshot is refreshed from v0.9.1; existing V4 route/request contracts remain compatible. Read the immutable [retrieval benchmark](https://github.com/Yasou13/MESA/blob/e2f984d4ad97c01782a347e29e44808e5a16dad3/docs/retrieval-and-graph.md#round-14-dev-benchmark) and [measurement data](https://github.com/Yasou13/MESA/blob/e2f984d4ad97c01782a347e29e44808e5a16dad3/docs/benchmarks/round14_dev.json) for model revisions, hashes, warmups and unrounded metrics. Production remains NO-GO.
