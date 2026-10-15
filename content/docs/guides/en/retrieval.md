## Four different signals

Vector compares compatible semantic representations. BM25 uses FTS5 passage/evidence text and scoped citation lookup. The assertion lane considers predicate, subject, object/literal and evidence. Graph contributes bounded supported paths. Authorized canonical ownership and eligibility are resolved before rank contribution.

## Rank fusion, not a probability

Defaults: k=60, four weights=1.0, one-based ranks. A duplicate hit casts one lane vote. RRF(c)=Σ w/(k+rank). Lane-local citation boosts change lane order, not RRF increments. A separate query-dependent legal factor follows fusion. See the [retrieval explanation](retrieval/) for the exact distinction and an illustrative calculator.

## Bounded graph and context

Graph traversal is bounded: at most 20 seeds and three hops, 500 requested graph hits, frontier 64, per-node fan-out 32 and a default 15-second request timeout. These are resource limits, not latency guarantees. Context defaults to a 2048-token formatted-evidence budget and single search. Optional adaptive mode uses at most one planner call and two additional searches without widening scope.
