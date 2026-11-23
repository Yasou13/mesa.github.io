---
id: "hybrid-retrieval"
slug: "hybrid-retrieval-explained"
type: "learn"
language: "en"
title: "What is hybrid search? BM25, vectors and reranking"
subtitle: ""
summary: "Hybrid search combines keyword and vector retrieval. Learn when it helps, how to fuse results and which stage to fix when search fails."
shortAnswer: "Hybrid search runs keyword search, usually BM25, and vector search for the same query, then combines their results. Keyword search preserves exact terms, while vector search can match different wording. It helps when each method finds relevant results the other misses."
category: "Memory & Retrieval"
tags: ["hybrid", "reranking", "candidate recall", "cross encoder", "hibrit", "yeniden sıralama", "aday"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-11-24"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "What Is Hybrid Search? BM25 and Vector Search — MESA"
seoDescription: "Hybrid search combines keyword and vector retrieval. Learn when BM25 plus vectors helps, how fusion and reranking work and how to measure the result."
lessonOrder: 6
learningStage: "retrieval"
prerequisites: ["semantic-search", "bm25-tuning-for-domain-documents"]
learningObjectives: ["Separate candidate generation from reranking", "Measure each lane’s unique contribution", "Keep scope and identity stable through fusion"]
---

## What is hybrid search?

Hybrid search, also called hybrid retrieval, combines at least two retrieval methods in one search pipeline. The common pair is BM25 keyword search and dense vector search. Each method returns candidates, a fusion step such as RRF merges them, and an optional reranker refines the top results.

| Compare | BM25 keyword search | Vector search |
| --- | --- | --- |
| Matches | Words and terms in the text | Similarity between embeddings |
| Strong at | Names, codes, IDs and exact phrases | Paraphrases and different wording |
| Can miss | The same idea in other words | A rare exact code or number |
| Needs | A text index and language analysis | An embedding model and vector index |

## Two ways to miss the same answer

A reader asks “When can I visit on the last working day?” The handbook says “Friday opening: 10:00.” Dense retrieval may bridge the wording; lexical retrieval may preserve exact room names and policy IDs. Hybrid retrieval combines complementary candidate sets. It is useful only when the additional lane finds relevant items that the baseline misses, or improves their ordering at acceptable cost.

Adding a graph or another embedding model is not automatically an improvement. Nearly identical lanes can reinforce the same mistake. Begin with one interpretable lexical baseline and one compatible dense model; measure overlap, unique relevant hits, empty results and latency. Add complexity only when a documented failure calls for it. BEIR illustrates that retrieval methods vary across datasets; its benchmark results are not a score for your archive. [BEIR](https://arxiv.org/abs/2104.08663).

## Keep the stages separate

<!-- diagram: Authorized lexical and vector candidates are reconciled by identity, fused, optionally reranked and packed. -->
1. Authorize · fixed scope
2. Retrieve · lexical + dense
3. Reconcile · canonical IDs
4. Fuse · combine rankings
5. Rerank / pack · final evidence

*Candidate generation aims for coverage; reranking spends more work on fewer items.*

Suppose each lane returns 20 candidates and 8 IDs overlap. The union contains 32 unique candidates, not 40. Deduplicate using the actual retrieval unit: document, passage or assertion. Two chunks from one document may be legitimate separate evidence, but duplicates of the same chunk should not gain extra votes merely because the backend repeated a row.

## Do not add unrelated raw scores

A cosine score of 0.72 and a lexical score of 12 are not on a common scale. Adding them makes the result depend on arbitrary ranges. Rank fusion uses positions; score fusion needs an explicitly chosen normalization or learned calibration. Preserve lane scores and ranks in traces so you can explain why a candidate moved. See the next lesson for a complete RRF calculation.

| Stage | Question | Useful measure |
| --- | --- | --- |
| Candidate retrieval | Did relevant evidence enter the union? | Recall at candidate cutoff |
| Fusion | Did complementary evidence move up? | nDCG / MRR at fixed cutoff |
| Reranking | Did extra scoring improve order? | Gain versus latency and cost |
| Packing | Did complete evidence reach the model? | Support and budget compliance |

## What a reranker can and cannot fix

A cross-encoder scores a query and candidate together, allowing direct interaction between their tokens. This is typically more expensive than comparing precomputed document vectors, so it is applied to a shortlist. Nogueira and Cho study BERT passage reranking; that design does not establish that any particular reranker will improve your domain. [Paper](https://arxiv.org/abs/1901.04085).

A reranker cannot recover a relevant record missing from its input. If the union has zero relevant candidates, changing the reranker will not solve recall. Nor should a reranker override access control or revive a superseded source. Enforce eligibility and verify final evidence identity throughout the pipeline; “highly relevant but forbidden” is still forbidden.

## When should you use hybrid search?

- Users search with both exact identifiers and natural language.
- Your documents contain codes, names, dates or legal citations that must not be blurred.
- Keyword search misses paraphrases, while vector search misses exact terms.
- Judged questions show that the second method adds relevant results.

Keep one method if it already finds the evidence and a second lane adds only latency. In Turkish, also test suffixes and characters such as ı and i, because language analysis can change what keyword search finds.

## A simple first hybrid search pipeline

1. Apply access scope before retrieval.
2. Run BM25 and vector search separately, for example top 50 from each.
3. Deduplicate each list using the same retrieval unit.
4. Fuse with [Reciprocal Rank Fusion](/learn/reciprocal-rank-fusion-explained/), starting with k = 60.
5. Measure recall, MRR or nDCG on judged questions.
6. Add a reranker only if the right evidence is already in the candidates but ranks too low.

## What we measured in MESA

Each added stage helped on our Turkish legal dev set, and each one cost time.

| MESA 0.9.4 defaults, dev, Tier M | MRR | Hit@5 | Search p50 |
| --- | --- | --- | --- |
| T0: lexical only, models off | 0.3954 | 0.5446 | 0.33 s |
| T1b: + bge-m3 embeddings | 0.6487 | 0.7768 | 1.64 s |
| T2: + bge-reranker-v2-m3 | 0.7945 | 0.9107 | 2.27 s |

| Passage Hit@5 by category, dev (questions) | T0 | T1b | T2 |
| --- | --- | --- | --- |
| Exact wording (31) | 0.6774 | 0.8710 | 0.9355 |
| Number, date, docket (35) | 0.6286 | 0.8571 | 0.9429 |
| Paraphrase (32) | 0.5312 | 0.7812 | 0.9375 |
| Cross-document (14) | 0.0714 | 0.3571 | 0.7143 |

> [!NOTE]
> **Setup**
> Published MESA 0.9.4, one Colab NVIDIA A100 80 GB runtime, benchmark v2 dev split, Tier M, 141 documents, 5,041 chunks. Relevance uses 112 answerable questions and latency uses all 128.

Embeddings helped most on paraphrases, where Turkish query words often differ from the source. In our [BM25 analysis](/research/bm25-turkish-prefix-matching/), 119 of 243 eligible paraphrase query terms did not match the evidence at all. Exact legal lookups still benefit from keeping a lexical lane.

More lanes do not always help. [The 0.9.4 fusion defaults](/research/what-improved-search-in-0-9-4/) raised T0 and T1b dev Hit@5, but lowered T2 dev Hit@5 from 0.9286 to 0.9107. Model choice also mattered less after reranking: the [embedding comparison](/research/turkish-legal-embedding-comparison/) found 48 tied questions without a reranker and 101 with one, out of 112 (MESA 0.9.3, benchmark v2 dev, Tier M).

## Locate the failure

> [!EXERCISE]
> **Check your understanding**
> The correct passage is rank 45 in the dense lane, absent from lexical top 20, and you rerank only the top-20 union. Can a better reranker find it?
>
> **Answer:** No. It never reaches the reranker. Investigate query representation, lane cutoff, chunking and candidate recall. Compare changes on the same judged questions before spending more on reranking.

## Hybrid search questions

**Is hybrid search always better than vector search?**
: No. It helps when the lanes find different relevant results. Compare both on your own judged questions.

**Is hybrid search the same as RAG?**
: No. Hybrid search is a retrieval method. RAG uses retrieved text to help a language model generate an answer, and it may or may not use hybrid search.

**Do I need a reranker?**
: Not always. A reranker can improve ordering, but it adds cost and cannot recover a result missing from its input.

**How do you combine BM25 and vector scores?**
: A common starting point is RRF, which uses ranks. If you combine raw scores, choose and test an explicit normalization first.

## Sources and further reading

1. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)
2. [Nogueira & Cho (2019) · Passage Re-ranking with BERT](https://arxiv.org/abs/1901.04085)
3. [Cormack, Clarke & Büttcher (2009) · Reciprocal Rank Fusion](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)
4. [Microsoft Learn · Hybrid search scoring (RRF)](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking)

