## Three signals, two on by default

BM25 uses FTS5 passage/evidence text and scoped citation lookup. Vector compares compatible semantic representations and runs when an embedding model is enabled. The assertion lane considers predicate, subject, object/literal and evidence; its default fusion weight is 0.0, so it does not contribute unless you raise it. Authorized canonical ownership and eligibility are resolved before rank contribution.

## Rank fusion, not a probability

Runtime defaults: k=60, vector weight=8.0, BM25 weight=1.0, assertion weight=0.0, with one-based ranks. A zero lane weight removes that lane’s fusion contribution. The calculator deliberately uses unit weights as a teaching example. A duplicate hit casts one lane vote. RRF(c)=Σ w/(k+rank). Lane-local citation boosts change lane order, not RRF increments. A separate query-dependent legal factor follows fusion. See the [retrieval explanation](retrieval/) for the exact distinction and an illustrative calculator.

## Context limits

Context defaults to a 2048-token formatted-evidence budget and single search. Optional adaptive mode uses at most one planner call and two additional searches without widening scope.

## v0.9.5 operation

With models off, BM25 still retrieves stored source text. A disabled or incomplete vector lane is reported in degraded_sources; enabling embeddings backfills skipped vectors at startup. BM25 matches query tokens of 6 or more non-digit characters by their first 5 characters; shorter tokens and tokens with digits stay exact. Equal scores break by stable content identity, so two fresh stores built from the same corpus rank identically. LanceDB 0.41 prefilters vectors by tenant, dataset and agent, and MESA verifies each candidate against SQLite before ranking.

## Point-in-time search

Pass a timezone-aware `valid_at` to search the revisions that were valid at that instant. Intervals are half-open: a revision matches when `valid_from <= valid_at < valid_to`, so at an exact amendment instant only the new revision matches. Searches without a date return active revisions only. Results include `revision_number`, `valid_from` and `valid_to` (empty strings when unset). See [versioned documents](docs/core/concepts-and-ingestion/#guide-versioned-documents).

## Optional BGE reranking

`MESA_RERANK_ENABLED=false` is the default. Enabling it needs the `[ml]` extra. `MESA_RERANK_MODEL=BAAI/bge-reranker-v2-m3` and `MESA_RERANK_DEPTH=50` (range 1–50) configure the stage. The model loads lazily on first use, adding cold-start latency. After fusion, authorized full chunk texts are scored in a worker thread outside the shared search connection. Results add `rerank_score`; `rrf_score` and `final_score` retain their fusion values. Ties keep fused order.

## Search indexes and scope cache

Dataset-wide searches without a date or jurisdiction filter use the dataset's persistent FTS5 index, kept in step with commits inside SQLite transactions. Other scopes build a temporary FTS5 index containing only authorized rows; `MESA_SEARCH_SCOPE_CACHE=true` reuses it in a four-scope LRU until SQLite data changes. Every request still rechecks authorization.

## Scoped legal identities and exact-match-first results

With legal rules enabled, authorized titles and first-chunk law headers teach scope-cached law names, including `K.`. An exact law/article or decision’s own docket/decision reference can occupy at most three leading positions in document order after fusion and optional reranking; remaining results retain their order. A decision identity must start within the first 300 characters of chunk zero. Later quotations do not count. Court-name mentions such as AYM alone do not select the Constitution.

`retrieval_provenance.legal_items` returns versioned items with original chunk offsets; these are separate from SPO facts and do not add fusion score. `MESA_LEGAL_RULES_ENABLED=false` skips legal processing, hides stored legal annotations in result copies and leaves generic retrieval available. Existing snapshots/identities remain stored.
