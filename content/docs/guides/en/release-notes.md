## v0.9.5 · 24 November 2026

The [tagged changelog](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/CHANGELOG.md#095---2026-11-24) dates this release 24 November. GitHub tag `v0.9.5` resolves to `c725616364f3931249bd05a62676f132b65768e1`. [PyPI 0.9.5](https://pypi.org/project/mesa-memory/0.9.5/) wheel and sdist were verified present, not yanked and hash-identical to the GitHub release files on 24 November 2026; the pull-request CI, push CI, external release gates and release workflow passed on the tagged commit. Upgrade with `pip install --upgrade mesa-memory==0.9.5` after an offline backup; see the [upgrade guide](docs/core/migration/). Alpha / production NO-GO remains.

## v0.9.5 versioned documents

Upload each version under the same `document_id` with a timezone-aware `metadata.valid_from`. Validity order, not upload order, decides the ACTIVE revision and the `[valid_from, valid_to)` history, so an older version uploaded later becomes history. Search with `valid_at` returns the version valid at that instant; intervals are half-open, so an exact amendment instant returns only the new version. HTTP, SDK and MCP results add `revision_number`, `valid_from` and `valid_to`. The changelog reports that in the four-law Turkish temporal fixture the correct revision ranked first on all 18 dated and all eight undated questions; see the [benchmark page](benchmark/#temporal) for how that smoke test was run.

## v0.9.5 search, storage and uploads

- Each dataset has a persistent FTS5 BM25 index for undated dataset-wide queries, updated in the same SQLite transaction as commits and rebuilt from SQLite when missing. Dated and narrower queries build a temporary scoped index.
- LanceDB is locked to 0.41.0. Vector search prefilters by dataset and agent before ranking and verifies eligibility in SQLite; startup adds scope keys to older vector tables.
- Interrupted whole-document uploads resume from their saved chunks with the chunking plan chosen at admission.
- Internal storage identifiers no longer enter lexical scoring or citation matching.
- Kùzu, the graph projection worker and the graph search lane were removed; graph settings are ignored with a warning. See [graph store removed](docs/core/graph/).
- The package installs on Python 3.14; CI still tests 3.11–3.13.

## v0.9.5 measurements

The release notes report a local Round 23 scale run in which a fresh store reached 100,820 committed chunks, the warm models-off HTTP search median fell from 1,223 ms to 753 ms and the deterministic vector lane median was 287 ms. The conditions are listed under [measured scale](docs/core/limitations/#guide-v095-measured-scale-local-100820-chunks). These are local measurements on one machine, not service guarantees, and they do not measure retrieval quality at that size.

## v0.9.4 · 23 November 2026

The [tagged changelog](https://github.com/Yasou13/MESA/blob/e30856ec6e7ed9146bb9af992565e864f727b0b9/CHANGELOG.md#094---2026-11-23) dates this release 23 November. GitHub tag `v0.9.4` resolves to `e30856ec6e7ed9146bb9af992565e864f727b0b9`. [PyPI 0.9.4](https://pypi.org/project/mesa-memory/0.9.4/) wheel and sdist were verified present, not yanked and hash-identical to the GitHub release files on 23 November 2026. Upgrade with `pip install --upgrade mesa-memory==0.9.4` after an offline backup. Alpha / production NO-GO remains.

## v0.9.4 changed search defaults

`MESA_GRAPH_ENABLED` now defaults to `false` and `MESA_RRF_ASSERTION_WEIGHT` to `0.0`. Restore the earlier fusion with `MESA_GRAPH_ENABLED=true` and `MESA_RRF_ASSERTION_WEIGHT=1.0`. Scoped BM25 uses 5-character prefix matching for query tokens of 6 or more non-digit characters. Equal-score results break ties by stable content identity, so two fresh stores built from the same corpus produce identical ranks.

## v0.9.4 removals and migrations

Forward-only migrations `f7a8b9c0d1e2` and `f8b9c0d1e2f3` drop the legacy V3 node store and `routing_telemetry`. V3 routes and clients, LLM consolidation and Tier 3 modes 1/2 are removed; validation uses deterministic mode 0 and optional fact extraction runs through `FactExtractionService`. Retired settings are ignored with one startup warning per key. Fresh installs cap FastAPI below 0.142, LanceDB below 0.35, Kùzu below 0.12 and Pydantic below 3. See the [upgrade guide](docs/core/migration/).

## v0.9.4 measurements and release checks

The changelog reports, on the shared Tier M DEV store with models and reranking off, passage Hit@5 from 50/112 to 61/112, MRR from 0.3411 to 0.3955 and median search latency from 361.3 ms to 233.9 ms. A 5 MB models-off fixture went from 249.99 s to 172.61 s end-to-end readiness. These are DEV and local results, not held-out test results or service guarantees. On the benchmark v2 DEV split with the 0.9.4 defaults, models-off and embedding search improved, but reranked (T2) passage Hit@5 fell from 0.9286 to 0.9107; see [what changed search quality in 0.9.4](research/what-improved-search-in-0-9-4/). The [0.9.3 benchmark](benchmark/0.9.3/) does not describe 0.9.4; the 0.9.4 benchmark v2 results are on the [benchmark page](benchmark/).

The pull-request CI and the release workflow passed on the tagged commit. The post-tag push CI recorded one failure in `coverage (3.13)`: a legal-extraction timing test exceeded its 200 ms bound, with 1,796 other tests passing.

## v0.9.3 · 16 November 2026

The [tagged changelog](https://github.com/Yasou13/MESA/blob/531209bc45805b478264f6dfa8a9e40a94e345cb/CHANGELOG.md#093---2026-11-16) dates this release 16 November. GitHub tag `v0.9.3` resolves to `531209bc45805b478264f6dfa8a9e40a94e345cb`. [PyPI 0.9.3](https://pypi.org/project/mesa-memory/0.9.3/) wheel and sdist were verified present and not yanked on 17 November 2026. Upgrade with `pip install --upgrade mesa-memory==0.9.3`. Alpha / production NO-GO remains.

## v0.9.3 measured ingestion and parser changes

Bulk ingestion batches SQL and graph projections and outbox completion in the existing worker pass. The changelog reports full readiness for a 4,999,000-byte document in **245.20 s versus 718.27 s (2.93× faster)**: all 4,882 mutations COMMITTED, SQL and GRAPH COMPLETED, VECTOR SKIPPED, with lossless chunk readback. Round 20 P13-01/P13-02b records these conditions (models off, graph on). The Opus Round 20 check separately reports **239.35 s (3.00×)** on final checked code `dbf113b`, with the same durable readback. These are local development measurements, not throughput or service guarantees.

Legal extraction skips impossible decision-reference scans and delays law-name cleanup until an attached article is found. For the API-limit `TCK/1` input, best-of-five local thread CPU fell from **129.861 ms to 52.330 ms (2.48×)** with identical saved outputs and spans. The isolated 200 ms CI CPU-budget check is blocking again; a 2 s hang guard remains.

## v0.9.3 embedding default and older stores

The default is now `local:BAAI/bge-m3`, **1024 dimensions**, normalized, including the Compose model default. Models remain **off by default**. Download the model before enabling it. Stores created with the old default must retain both settings below, or rebuild before changing embedding identity:

```bash
MESA_EMBEDDING_MODEL=local:magibu/embeddingmagibu-200m
MESA_EMBEDDING_DIMENSION=768
```

## v0.9.3 fixes and release behavior

Turkish legal comparisons and date lookups handle uppercase İ/I consistently while preserving original text, offsets and rule versions. Scoped FTS adds deduplicated `ı` → `i` query variants so `YARGITAY` and `yargıtay` find text written `YARGITAY KARARI`; the ASCII limitation below remains.

MCP session creation provisions missing workspace/dataset entries on a fresh store and retries once; a provisioning failure preserves the original session-start error. Mode 0 session ending finalizes deferred records without a consolidation loop. Startup fails clearly for `MESA_TIER3_MODE=1/2` without an active consolidation loop (extraction must be enabled), and for bootstrap `MESA_API_KEY` secrets containing `.`.

Tag-triggered PyPI releases now wait for the complete reusable CI workflow before building and publishing. The changelog leaves verification of that wiring to the first live tag run; this refresh has not audited that run.

## v0.9.3 known issues and measurement scope

Per-minute and daily rate limits are not enforced for `/v4/*` and `/control/*`. ASCII `yargitay` still does not match `Yargıtay`; index-side Turkish folding remains deferred. Kùzu 0.11.3 may write uninitialized memory into graph page tails: raw graph files can contain text fragments handled by the process even though logical graph queries confirm memory text is not stored as graph properties. Treat the graph directory as sensitive like SQLite. See [current limits](docs/core/limitations/).

No new retrieval benchmark was run for 0.9.3. The [Round 18 results](benchmark/0.9.2/) remain labelled 0.9.2, and historical demos and DEV measurements below retain their original versions. The older 11.6 s search measurement is historical 0.9.2 evidence; it is not listed in the 0.9.3 known-issues section and was not re-measured here.

## v0.9.2 · 6 November 2026

The [official release](https://github.com/Yasou13/MESA/releases/tag/v0.9.2) pins `8cd2cfe1df5356e73b3bef83ae640850fd54c798`. [PyPI 0.9.2](https://pypi.org/project/mesa-memory/0.9.2/) wheel and sdist publication, non-yanked status and matching release SHA256 hashes were verified on 7 November 2026. Python >=3.11; upgrade with `pip install --upgrade mesa-memory==0.9.2`. V4 HTTP routes remain compatible. Alpha / production NO-GO remains.

## Legal extraction and retrieval

New chunks keep versioned rule items for citation, decision_ref, date, amount, duration and outcome. `retrieval_provenance.legal_items` keeps `{version, items}` with offsets into the original chunk. These are separate from model-extracted subject–predicate–object (SPO) facts and do not add fusion score. Purge erases their source quotes.

Authorized titles and first-chunk law headers teach scope-cached law names, including `K.`. Exact law/article or a decision’s own docket/decision reference can occupy at most three leading result positions in document order. Decision identity requires a reference beginning within the first 300 characters of chunk zero; later quotations do not count. Remaining results keep fused or reranked order. AYM/court-name mentions alone no longer trigger Constitution ranking.

## Changed defaults and admission

`MESA_LEGAL_RULES_ENABLED=true` enables identities, snapshots and legal search. `false` disables new automatic legal identities/items, citation resolution, exact-match promotion, legal factors and graph citation parsing; it hides existing legal overlays in returned copies without erasing durable identities/snapshots. Generic retrieval remains available. `MESA_EXTRACTION_ENABLED=false` now applies regardless of `MESA_MODEL_ENABLED`; explicit `true` enables SPO extraction. Embeddings still follow the model flag by default.

Document admission briefly waits for queue capacity without repeating the full chunk plan. `add_document(deadline=600)` uses the remaining document budget for the HTTP request. Persistent queue pressure can still return `503 queue_over_capacity`; retry the exact payload. HTTP 202 is admission, not readiness.

## Security and measured limits

Bounded parsing, worker-thread execution and cooperative work restore `/health` responsiveness in measured rule extraction, citation, scope and heavy scoring repros. This fixes request-path stalls affecting 0.9.1; upgrading is recommended. It does not establish faster heavy queries: a 1,000-candidate search still took about 11.6 seconds. A 4,999,000-byte document took about seven minutes to become ready with models off and graph on. These are specific development repros, not service guarantees.

Whole-document secret scanning and extreme Unicode normalization can still cause sub-second stalls. UUID ties can reorder independently ingested stores; same-store retained inputs remain deterministic. Non-object document requests retain an INFO-level 422 detail wording difference; status, code, location and OpenAPI remain compatible. The official release also records a Python 3.13 post-merge parser timing test exceeding its 200 ms CI bound; its speed fix is scheduled for 0.9.3, outside this release.

## Release validation and evidence

The official release reports 2,037 local tests plus 10 separate MCP tests, with 2,032 passing tests per PR coverage job (3.11: 88.09%; 3.13: 88.07%). [PR #143](https://github.com/Yasou13/MESA/pull/143) and attached build evidence/SBOM/provenance are linked from the release. These are attributed release results, not a new website-run Core certification. Independent QA, Law and E2E evidence retains its own dates and pins. Historical v0.9.0 demo recordings and v0.9.1 DEV measurements below remain historical.

## Previous release v0.9.1 · 1 November 2026

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
