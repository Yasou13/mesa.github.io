---
id: "benchmarking-retrieval-latency"
slug: "benchmarking-retrieval-latency"
type: "learn"
language: "en"
title: "Benchmarking end-to-end latency across hybrid retrieval lanes"
subtitle: "Measuring p50, p95, and p99 query performance under concurrent multi-lane load"
summary: "Measuring retrieval performance requires tracking latency distributions across individual lanes (Vector, BM25, Graph, SQL) and the fusion step under concurrent query load."
shortAnswer: "Average latency hides severe tail-latency spikes. Systems must benchmark p95 and p99 response times across concurrent retrieval lanes."
category: "Retrieval Evaluation"
tags: ["latency", "benchmarking", "hybrid-retrieval", "performance"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Benchmarking end-to-end latency across hybrid retrieval lanes — MESA Learn"
seoDescription: "Measuring retrieval performance requires tracking latency distributions across individual lanes (Vector, BM25, Graph, SQL) and the fusion step under concur"
---

## The arithmetic mean latency fallacy

Reporting mean latency (e.g. 'Average query latency is 15 ms') conceals catastrophic tail latencies where 5% of queries hang for 500 ms due to unindexed graph traversals or thread pool exhaustion.

> [!WARNING]
> **Tail Latency Contagion**
> In multi-lane architectures where four lanes run concurrently, the slowest lane dictates the overall response time: overall latency equals max(lane_1, lane_2, lane_3, lane_4).

## Engineering trade-offs side-by-side

| Retrieval Lane | Engine | p50 Target | p99 Target |
| --- | --- | --- | --- |
| Dense Vector Lane | LanceDB (disk-backed columnar) | 3.5 ms | 12.0 ms |
| Lexical BM25 Lane | SQLite FTS5 (in-process B-tree) | 0.8 ms | 4.2 ms |
| Assertion SQL Lane | SQLite indexed table scan | 0.4 ms | 1.8 ms |
| Graph Traversal Lane | Kùzu embedded 2-hop query | 1.5 ms | 8.5 ms |
| Reciprocal Rank Fusion | In-memory mathematical rank combination | 0.1 ms | 0.5 ms |

## Parallel execution and asynchronous coordination

Hybrid retrieval dispatches concurrent queries using non-blocking asynchronous runtimes. A strict per-lane timeout budget prevents a runaway graph traversal from holding up the overall search pipeline.

```text
// Parallel lane dispatch with timeout guard
async def hybrid_retrieve(query, timeout_ms=50):
    tasks = [vector_lane(query), bm25_lane(query), graph_lane(query), sql_lane(query)]
    results = await asyncio.wait_for(asyncio.gather(*tasks, return_exceptions=True), timeout=timeout_ms/1000)
    return reciprocal_rank_fusion([r for r in results if not isinstance(r, Exception)])
```

## Latency benchmarking in MESA

MESA's automated benchmark suites measure p50, p95, and p99 latencies on every build. Because SQLite, LanceDB, and Kùzu all execute in-process without network hops, MESA achieves sub-15ms p99 end-to-end multi-lane retrieval.

- [ ] Zero network socket hops eliminate inter-process latency overhead.
- [ ] Asynchronous query dispatch executes all four lanes concurrently.
- [ ] Per-lane timeout guards ensure predictable tail latencies.
- [ ] CI performance regression gates block commits that increase p99 latency.

## References

1. [Dean & Barroso (2013) — The Tail at Scale (Communications of the ACM)](https://cacm.acm.org/magazines/2013/2/160173-the-tail-at-scale/fulltext)
2. [MESA Independent Retrieval Audit and Benchmarks](https://github.com/Yasou13/MESA/blob/main/tests/test_v4_independent_retrieval_audit.py)

