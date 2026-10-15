## Canonical facts, derived paths

SQLite owns entities and assertions. Kùzu projects their relationships for bounded neighbor retrieval. Different assertions between the same entities remain distinct because predicate, source and temporal identity matter. Entity reachability alone is not a supported answer.

## Read the path and the runtime flag

Require supporting assertion IDs, aligned entity paths and edge directions, reconciled against the authorized canonical records. `graph_neighbor_retrieval` reports operational support; a projection-only adapter does not implement traversal. An operational backend failure is an explicit 503, not silently complete search.

## Ablation and limits

`graph_mode=disabled` removes the retrieval lane for matched comparisons, but keeps canonical assertion retrieval and graph projection writes. PageRank is telemetry only. Bounds on seeds, hops, fan-out and request time prevent unbounded work; they do not guarantee completeness or latency.
