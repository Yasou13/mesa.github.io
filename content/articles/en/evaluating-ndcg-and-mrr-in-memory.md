---
id: "evaluating-ndcg-and-mrr-in-memory"
slug: "evaluating-ndcg-and-mrr-in-memory"
type: "learn"
language: "en"
title: "Evaluating nDCG, MRR, and Recall@k for agent memory retrieval"
subtitle: "Rigorous ranking metrics for measuring multi-lane hybrid retrieval precision"
summary: "Evaluating agent memory retrieval requires mathematically grounded metrics: Recall@k measures completeness, MRR measures first-hit speed, and nDCG accounts for graded relevance."
shortAnswer: "Recall@k measures whether the truth was retrieved; MRR measures how early the first hit appeared; nDCG@k measures the quality of the entire top-k ranking."
category: "Evaluation"
tags: ["evaluation", "ndcg", "mrr", "recall-at-k", "benchmarks"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Evaluating nDCG, MRR, and Recall@k for agent memory retrieval — MESA Learn"
seoDescription: "Evaluating agent memory retrieval requires mathematically grounded metrics: Recall@k measures completeness, MRR measures first-hit speed, and nDCG accounts"
---

## The single-metric illusion

Teams building agent memory often report a single metric such as 'Recall@10 = 92%'. However, if the correct assertion is consistently ranked at position #9 rather than #1, the downstream generator experiences significant context distraction and token bloat.

> [!WARNING]
> **Binary Relevance Flaw**
> Treating all retrieved documents as either 1 (relevant) or 0 (irrelevant) fails in agent workflows where one document contains the primary ruling while two others provide peripheral procedural history.

## Engineering trade-offs side-by-side

| Metric | Definition | Optimal Value | Key Sensitivity |
| --- | --- | --- | --- |
| Recall@k | Proportion of all relevant items found in top k | 1.0 (100%) | Insensitive to ranking order within the top k |
| MRR (Mean Reciprocal Rank) | Average of (1 / rank of first relevant item) | 1.0 (always #1) | Only evaluates the very first relevant hit, ignoring subsequent items |
| nDCG@k (Normalized DCG) | Ratio of DCG to Ideal DCG using graded gains | 1.0 (perfect order) | Rewards placing highly relevant items at the very top of the list |
| MAP (Mean Average Precision) | Mean of precision scores at each relevant retrieval | 1.0 | Balances precision and recall across multiple relevant items |

## The nDCG discounted cumulative gain equation

Discounted Cumulative Gain (DCG) discounts relevance gains logarithmically based on rank position: `DCG@k = Σ (2^{rel_i} - 1) / log_2(i + 1)`. Normalizing by the Ideal DCG (IDCG@k) produces a score in [0.0, 1.0] invariant to list length.

```text
// Python implementation of nDCG@k calculation
def ndcg_at_k(relevance_scores, k):
    dcg = sum((2**rel - 1) / math.log2(idx + 2) for idx, rel in enumerate(relevance_scores[:k]))
    idcg = sum((2**rel - 1) / math.log2(idx + 2) for idx, rel in enumerate(sorted(relevance_scores, reverse=True)[:k]))
    return dcg / idcg if idcg > 0 else 0.0
```

## Evaluation rigor in MESA

MESA's independent retrieval audit suite tests four distinct retrieval lanes across synthetic and legal golden datasets. The pipeline measures Recall@5, MRR, and nDCG@10 deterministically on every release baseline.

- [ ] Ground truth datasets enforce graded relevance labels (0 = irrelevant, 3 = primary authority).
- [ ] Queries and judgments are versioned in frozen JSONL artifacts.
- [ ] Zero-result queries and failure cases are explicitly tracked.
- [ ] Evaluation gates block release regressions in CI before deployment.

## References

1. [Järvelin & Kekäläinen (2002) — Cumulated Gain-Based Evaluation of IR Techniques (ACM TOIS)](https://dl.acm.org/doi/10.1145/582415.582418)
2. [MESA Independent Retrieval Audit and Test Suite](https://github.com/Yasou13/MESA/blob/main/tests/test_v4_independent_retrieval_audit.py)

