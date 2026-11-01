## Four different signals

Vector compares compatible semantic representations. BM25 uses FTS5 passage/evidence text and scoped citation lookup. The assertion lane considers predicate, subject, object/literal and evidence. Graph contributes bounded supported paths. Authorized canonical ownership and eligibility are resolved before rank contribution.

## Rank fusion, not a probability

Runtime defaults: k=60, vector weight=8.0; BM25, assertion and graph weights=1.0, with one-based ranks. Set `MESA_RRF_VECTOR_WEIGHT=1` for the previous vector weight. A zero lane weight removes that lane’s fusion contribution. The calculator deliberately uses unit weights as a teaching example. A duplicate hit casts one lane vote. RRF(c)=Σ w/(k+rank). Lane-local citation boosts change lane order, not RRF increments. A separate query-dependent legal factor follows fusion. See the [retrieval explanation](retrieval/) for the exact distinction and an illustrative calculator.

## Bounded graph and context

Graph traversal is bounded: at most 20 seeds and three hops, 500 requested graph hits, frontier 64, per-node fan-out 32 and a default 15-second request timeout. These are resource limits, not latency guarantees. Context defaults to a 2048-token formatted-evidence budget and single search. Optional adaptive mode uses at most one planner call and two additional searches without widening scope.

## v0.9.1 operation

With models off, BM25 still retrieves stored source text. Disabled/incomplete vector and graph lanes are reported in degraded_sources. MESA_GRAPH_ENABLED=false skips Kùzu; re-enabling graph or embedding backfills skipped lanes at startup.

## Optional BGE reranking

`MESA_RERANK_ENABLED=false` is the default. Enabling it needs the `[ml]` extra. `MESA_RERANK_MODEL=BAAI/bge-reranker-v2-m3` and `MESA_RERANK_DEPTH=50` (range 1–50) configure the stage. The model loads lazily on first use, adding cold-start latency. After fusion, authorized full chunk texts are scored in a worker thread outside the shared search connection. Results add `rerank_score`; `rrf_score` and `final_score` retain their fusion values. Ties keep fused order. See [DEV evidence and device latency](docs/core/release-notes/#guide-round-14-dev-evidence).

## Search concurrency and scope cache

`MESA_SEARCH_SCOPE_CACHE=true` reuses temporary scope-specific FTS indexes and row/text features in a four-scope LRU. SQLite commit changes invalidate the cache; every request still rechecks authorization. Query embedding is computed before the search lock, and reranking runs after releasing the connection. scrypt verification, issuance and rotation run outside the event loop without caching authorization results. With graph disabled, graph seed preparation is skipped.
