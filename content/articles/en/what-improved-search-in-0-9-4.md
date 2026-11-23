---
id: "what-improved-search-0-9-4"
slug: "what-improved-search-in-0-9-4"
type: "research"
language: "en"
title: "What Improved MESA Search Quality in 0.9.4"
subtitle: "Two modes improved on dev. The reranked mode got worse."
summary: "Prefix BM25 and new fusion defaults improved models-off and embedding search on dev. Reranked dev Hit@5 fell from 0.9286 to 0.9107."
shortAnswer: ""
category: "Retrieval Evaluation"
tags: ["benchmark", "bm25", "hybrid-search", "ablation", "turkish"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-23"
readingMinutes: 9
status: "published"
indexable: true
seoTitle: "What Improved MESA Search Quality in 0.9.4"
seoDescription: "Prefix BM25 and new fusion defaults helped models-off and embedding search, but reranked dev Hit@5 fell from 0.9286 to 0.9107."
---

## Did MESA 0.9.4 improve search quality?

Partly. On benchmark v2 dev, models-off search (T0) rose from Hit@5 0.4732 to 0.5446. Embedding search (T1b) rose from 0.7411 to 0.7768. Reranked search (T2), the strongest mode, fell from Hit@5 0.9286 to 0.9107, and its MRR fell from 0.8076 to 0.7945.

> [!WARNING]
> **0.9.4 is not a clean win**
> With the 0.9.4 defaults, reranked dev Hit@5 fell from 0.9286 to 0.9107, or from 104/112 to 102/112 questions (benchmark v2, Tier M, T2).

Three changes drove this: 5-character prefix matching in BM25, assertion lane weight 0, and the graph lane off by default. p95 search latency dropped in all three modes. 0.9.4 is a better default for models-off and embedding search. It is not a clean win.

| 0.9.3 → 0.9.4 defaults, dev, Tier M | MRR | Hit@5 | Search p50 (s) | Search p95 (s) |
| --- | --- | --- | --- | --- |
| T0, models off | 0.3405 → 0.3954 | 0.4732 → 0.5446 | 0.6615 → 0.3291 | 4.5369 → 0.8155 |
| T1b, bge-m3 | 0.5758 → 0.6487 | 0.7411 → 0.7768 | 1.6736 → 1.6373 | 7.0309 → 2.1655 |
| T2, bge-m3 + reranker | 0.8076 → 0.7945 | 0.9286 → 0.9107 | 2.3461 → 2.2725 | 7.8343 → 2.7771 |

> [!NOTE]
> **Setup**
> Published PyPI wheels, one Colab NVIDIA A100 80 GB runtime, evaluator v2.1, search limit 50. Benchmark v2 dev split, Tier M, 141 documents, 5,041 chunks, 128 questions. Relevance uses the 112 answerable questions; latency uses all 128. 0.9.4 defaults: graph off, assertion weight 0, BM25 weight 1, vector weight 8.

## What got worse in reranked search?

Reranked dev Hit@5 fell by two questions, from 104/112 to 102/112. Both losses were in the number, date and docket category, where Hit@5 fell from 1.0000 to 0.9429 (35/35 to 33/35). Exact, paraphrase and cross-document Hit@5 did not change.

The new defaults are the likely source. MESA 0.9.4 run with the old 0.9.3 graph and assertion settings kept T2 at Hit@5 0.9286 and MRR 0.8076. Switching to the 0.9.4 defaults produced the drop. We did not test the two settings separately at T2, so we cannot say which one caused it.

If you use reranking and depend on number, date or docket lookups, compare both settings on your own data. These variables restore the earlier fusion behavior in 0.9.4:

```text
MESA_RRF_ASSERTION_WEIGHT=1.0
MESA_GRAPH_ENABLED=true
```

Enabling the graph backfills skipped graph projections at startup. The p95 gain shown above came with the graph off, so expect slower search if you turn it back on.

## Which change helped models-off search?

We tested each change on one shared store, because [fresh stores varied by up to four questions](/research/why-two-search-runs-differed/) at that time. These runs are from a pre-release 0.9.4 development build, on a local machine, with models off. Compare the steps within this table only.

| Step, dev, T0, shared store | Hit@5 | MRR | Search p50 |
| --- | --- | --- | --- |
| Baseline | 50/112 | 0.3411 | 361.3 ms |
| + prefix BM25 | 52/112 | 0.3444 | 357.3 ms |
| + prefix, assertion weight 0 | 56/112 | 0.3529 | 351.8 ms |
| + prefix, graph off | 52/112 | 0.3535 | 182.2 ms |
| + prefix, both | 61/112 | 0.3955 | 181.4 ms |

The two lane changes interact. Starting from prefix BM25, assertion weight 0 added 4 questions and graph off added 0. Together they added 9. With models off, that combination leaves BM25 as the only fused lane. The result suggests the other two lanes were pushing good BM25 hits down.

From baseline to the final step, 14 questions entered the top 5 and 3 left it. Number/date/docket went from 17 to 22 of 35, paraphrase from 12 to 17 of 32, and cross-document from 0 to 1 of 14. Exact-wording questions stayed at 21 of 31.

See [how RRF combines lanes](/learn/reciprocal-rank-fusion-explained/) and [hybrid retrieval](/learn/hybrid-retrieval-explained/) for the mechanics.

## What did prefix matching do for Turkish?

Turkish adds suffixes to word stems, so one legal term appears in many surface forms. Exact token matching treats them as different words. MESA 0.9.4 matches the first 5 characters of query tokens that have 6 or more characters and no digits. Shorter tokens, tokens with digits and `ı` → `i` variants stay exact.

Here is an illustrative example. The query word `sözleşmesi` becomes the prefix `sözle*`. It now matches `sözleşme` and `sözleşmesinin`. It can also match different words that begin with `sözle`, such as `sözler`.

The measured gain was small: 4 questions entered the top 5 and 2 left it, for a net +2. Three of the four gains moved only from rank 6 to rank 5. One moved from rank 38 to rank 4. This is a useful but limited change. See [BM25 for domain documents](/learn/bm25-tuning-for-domain-documents/) for tuning background.

> [!NOTE]
> **What we measured in MESA**
> For the full per-question analysis, see [Why BM25 Struggles With Turkish](/research/bm25-turkish-prefix-matching/).

## Why did search get faster?

Most of the tail-latency gain came from turning off the graph lane. In the shared-store ablation, p95 fell from 2.07 s to 0.45 s with graph off.

One caveat applies to the release comparison. 0.9.4 caps LanceDB below 0.35, so it ran on 0.34.0 while the 0.9.3 run used 0.41.0. On 0.9.4 defaults at T1b, LanceDB 0.41.0 gave p50 1.2285 s against 1.6373 s on 0.34.0, with identical ranks on 128 of 128 questions. The version cap currently costs some embedding-search speed.

## What about the test split?

> [!WARNING]
> **Read these numbers with care**
> The test split has been read in six runs: three on benchmark v1 and three on v2. MESA 0.9.4 was evaluated on the v2 test split twice. Most v2 test questions were derived from the v1 test set. These results are not an independent holdout, so dev results are our main numbers.

| 0.9.3 → 0.9.4 defaults, v2 test, Tier M (173 questions, 149 answerable) | MRR | Hit@5 |
| --- | --- | --- |
| T0, models off | 0.3988 → 0.4810 | 0.5503 → 0.5772 |
| T1b, bge-m3 | 0.6198 → 0.6413 | 0.7919 → 0.8188 |
| T2, bge-m3 + reranker | 0.7867 → 0.7868 | 0.8993 → 0.8993 |

The reranked drop seen on dev did not appear in test Hit@5. Given how the split has been used, that does not cancel the dev result.

## What can these results not show?

- All results come from one Turkish legal corpus.
- With 112 answerable dev questions, one question is worth about 0.009 Hit@5. The reranked drop is two questions.
- The defaults were chosen using the same dev set, so dev gains may be optimistic.
- We did not test assertion weight and graph settings separately at T2.
- The changelog reports 50 → 61 on a shared local store. The official Colab run reports 53 → 61 (0.4732 → 0.5446). Both are valid, but they use different baselines.

> [!NOTE]
> **What we measured in MESA**
> 0.9.4 also removed two subsystems without changing dev ranks. See [what we deleted](/research/deleting-code-mesa-0-9-4/).

## Sources

1. [MESA 0.9.4 changelog](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
2. [mesa-memory 0.9.4 on PyPI](https://pypi.org/project/mesa-memory/0.9.4/)
3. [SQLite FTS5 documentation](https://www.sqlite.org/fts5.html)
4. [Cormack, Clarke and Büttcher: Reciprocal Rank Fusion (SIGIR 2009)](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)

