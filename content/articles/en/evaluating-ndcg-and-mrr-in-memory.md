---
id: "evaluating-ndcg-and-mrr-in-memory"
slug: "evaluating-ndcg-and-mrr-in-memory"
type: "learn"
language: "en"
title: "Evaluate retrieval: recall, MRR, nDCG and latency"
subtitle: ""
summary: "Calculate ranking metrics on a judged list, separate quality from speed, and design an experiment that does not grade its own training examples."
shortAnswer: "Calculate ranking metrics on a judged list, separate quality from speed, and design an experiment that does not grade its own training examples."
category: "Practice"
tags: ["evaluation", "MRR", "nDCG", "recall", "precision", "benchmark", "latency", "değerlendirme", "gecikme"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Evaluate retrieval: recall, MRR, nDCG and latency — MESA Learn"
seoDescription: "Calculate ranking metrics on a judged list, separate quality from speed, and design an experiment that does not grade its own training examples."
lessonOrder: 13
learningStage: "practice"
prerequisites: ["reciprocal-rank-fusion", "memory-scope-and-authorization"]
learningObjectives: ["Calculate Recall@k, MRR and nDCG", "Build relevance judgments and a held-out test set", "Report latency, failures and evidence limits together"]
---

## Start with questions and relevance judgments

A search result looks plausible until you define what should have been found. Build a small question set with source-backed judgments. Include exact identifiers, paraphrases, date-sensitive questions, missing-answer cases and forbidden sources. Record the retrieval unit: a relevant document may contain many irrelevant chunks. Have a reviewer judge whether each unit supports the question and retain disagreements for adjudication.

Split development questions from the final test before tuning chunk size, fusion weights or thresholds. Synthetic questions can expand coverage, but an LLM-generated question and LLM-generated label may share mistakes or unnatural wording. Review samples, keep real-user questions where appropriate and deduplicate near-identical questions across splits. Never let answer text leak into the query representation.

## One ranked list, several different questions

| Rank | Passage | Relevance grade |
| --- | --- | --- |
| 1 | A · unrelated room | 0 |
| 2 | B · exact Friday hours | 2 |
| 3 | C · useful supporting context | 1 |

Assume B and C are the only two relevant units in this tiny judged corpus. Precision@3 is 2/3: the fraction retrieved that is relevant. Recall@3 is 2/2 = 1: the fraction of all relevant units retrieved. Reciprocal rank is 1/2 because the first relevant result is second. MRR averages reciprocal rank across queries, assigning zero when no relevant result appears within the declared cutoff.

```text
gain(rel) = 2**rel - 1
DCG@3 = sum(gain(rel_i) / log2(i+1), i=1..3)
Observed [0,2,1]: 0 + 3/log2(3) + 1/log2(4) = 2.3928
Ideal    [2,1,0]: 3 + 1/log2(3) + 0           = 3.6309
nDCG@3 = 2.3928 / 3.6309 = 0.6590
```

The system retrieved every relevant item but ranked an irrelevant one first. Recall alone hides that problem; nDCG penalizes it using graded relevance and position. State the gain function, discount, cutoff and policy for queries with no relevant judgments. Different conventions can produce different values. Unjudged material is not automatically proven irrelevant.

## Change one factor, inspect the failures

<!-- diagram: Freeze questions and data, compare a baseline with one change, compute paired metrics and inspect failures. -->
1. Freeze · corpus + judgments
2. Baseline · lexical only
3. Variant · add dense lane
4. Compare · same queries
5. Inspect · losses and gains

*A higher average can conceal regressions in identifiers, language or authorization.*

Compare per-query changes and useful slices: identifier versus paraphrase, short versus long source, language and source age. Report uncertainty when sample size permits, and retain the raw query-level results. BEIR demonstrates evaluation across heterogeneous retrieval tasks; reuse its discipline, not its scores as your own. [BEIR](https://arxiv.org/abs/2104.08663), [IR evaluation](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html).

## Measure speed without hiding failures

Measure end-to-end retrieval and stage timings separately. Declare hardware, corpus size, concurrency, cache state, warm-up, request count and timeout. Report median and tail latency with errors and empty responses. Dropping timed-out requests from the latency table can make a failing system look fast. A local deterministic fixture tests a contract; it does not measure real embedding-provider quality or production capacity.

> [!EXERCISE]
> **Check your understanding**
> Variant X raises Recall@20 but reduces nDCG@5. Is X simply better?
>
> **Answer:** Not necessarily. It finds more relevant candidates but places them less effectively near the top. Decide based on the downstream task, reranking budget, failure slices and latency; inspect which queries improved and regressed.

## Sources and further reading

1. [Manning, Raghavan & Schütze · Evaluation of ranked retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)
2. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)

