---
id: "turkish-legal-embedding-comparison"
slug: "turkish-legal-embedding-comparison"
type: "research"
language: "en"
title: "bge-m3 vs Mürşit on Turkish Legal Retrieval"
subtitle: "A dev-set comparison, including where the Turkish model won"
summary: "On 112 answerable Turkish legal dev questions, bge-m3 scored higher overall on MRR and Hit@5. Mürşit Large won on some questions and categories."
shortAnswer: ""
category: "Retrieval Evaluation"
tags: ["benchmark", "embeddings", "turkish", "legal-search"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-23"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "bge-m3 vs Mürşit on Turkish Legal Retrieval"
seoDescription: "We compared bge-m3 and Mürşit Large on 112 answerable Turkish legal dev questions. See where each model won, and what the sample cannot show."
---

## Which embedding model did better on Turkish legal search?

On our dev set, BAAI/bge-m3 did better overall. With embeddings alone (T1), it reached Hit@5 0.7411 and MRR 0.5758. Mürşit Large reached Hit@5 0.6875 and MRR 0.5626. With reranking (T2), bge-m3 reached Hit@5 0.9286 and Mürşit Large reached 0.8929.

This does not show that bge-m3 is better for Turkish law in general. The gap is 6 of 112 questions at T1 and 4 of 112 at T2. Mürşit Large ranked higher on 29 questions at T1, and it led on Hit@1. We kept bge-m3 as the MESA default because this run gave us no reason to change it.

## How did we run the comparison?

- MESA 0.9.3 from PyPI with the `ml` extra, on one Colab NVIDIA A100 80 GB runtime.
- Benchmark v2 dev split, Tier M: 141 Turkish legal documents, 5,041 chunks, 128 questions, 112 answerable.
- A new store for each Mürşit configuration. Search started after all 5,041 vectors were complete. The bge-m3 numbers come from the 0.9.3 reference run on the same inputs.
- Both models at 1,024 dimensions, L2-normalized by MESA.
- T1: embeddings with hybrid search. T2: T1 plus `BAAI/bge-reranker-v2-m3` at depth 20.
- Evaluator v2.1, search limit 50.

> [!NOTE]
> **About normalization**
> The published Mürşit pipeline has no final Normalize module and specifies cosine similarity. MESA applied L2 normalization to both models, so both were compared on the same vector setup.

## What were the overall results?

| MESA 0.9.3, dev, Tier M | Model | MRR | Hit@1 | Hit@5 | Hit@10 | Search p50 |
| --- | --- | --- | --- | --- | --- | --- |
| T1 | bge-m3 | 0.5758 | 0.4375 | 0.7411 | 0.8661 | 1.67 s |
| T1 | Mürşit Large | 0.5626 | 0.4464 | 0.6875 | 0.8304 | 1.66 s |
| T2 | bge-m3 | 0.8076 | 0.7143 | 0.9286 | 0.9554 | 2.35 s |
| T2 | Mürşit Large | 0.7814 | 0.6964 | 0.8929 | 0.9196 | 2.31 s |

Speed was not a deciding factor. Median search time and ingestion time were close. Ingestion to full readiness at T1 took 741.60 s with bge-m3 and 738.32 s with Mürşit Large.

## Where did each model win?

The largest gap was on paraphrased questions, where the query uses different words from the source. Mürşit Large led on number, date and docket questions at T1.

| Category, dev (questions) | T1 bge-m3 | T1 Mürşit | T2 bge-m3 | T2 Mürşit |
| --- | --- | --- | --- | --- |
| Exact wording (31) | 0.8387 | 0.7742 | 0.9355 | 0.9355 |
| Number, date, docket (35) | 0.8286 | 0.8571 | 1.0000 | 0.9714 |
| Paraphrase (32) | 0.7188 | 0.5938 | 0.9375 | 0.8438 |
| Cross-document (14) | 0.3571 | 0.2857 | 0.7143 | 0.7143 |

The table shows passage Hit@5. Small categories move in large steps: one cross-document question is worth about 0.07.

| Passage rank, 112 answerable | Mürşit better | Mürşit worse | Tied |
| --- | --- | --- | --- |
| T1 | 29 | 35 | 48 |
| T2 | 4 | 7 | 101 |

At T1 the two models disagree often, and the wins are nearly balanced. That suggests they make different errors. We did not test whether combining them helps. Reranking narrows the difference: at T2, 101 of 112 questions rank the same.

## How did the earlier default compare?

Before 0.9.3, MESA defaulted to `magibu/embeddingmagibu-200m`. Our direct comparison with bge-m3 used an older question set, so it cannot be merged with the tables above.

| MESA 0.9.2, benchmark v1 test, Tier M, T1 | MRR | Hit@5 |
| --- | --- | --- |
| magibu/embeddingmagibu-200m | 0.4095 | 0.5041 |
| BAAI/bge-m3 | 0.5136 | 0.6777 |

> [!WARNING]
> **Caveat on test results**
> This is a benchmark v1 test result. The test split was read in several MESA release runs, so it is not an untouched holdout. Treat it as a regression signal.

## What should you take from this?

- Test candidate models on your own documents and questions. This corpus is Turkish legal text, with many citations and numbers.
- Read results by question type. An overall score hid Mürşit's lead on number, date and docket questions.
- Compare with and without a reranker. Here, the reranker reduced the model gap.
- Plan for a rebuild. In MESA, a change of embedding identity requires rebuilding active vectors.

For the concepts, see [semantic search](/learn/semantic-search/) and [hybrid retrieval](/learn/hybrid-retrieval-explained/). The [embedding provider docs](/docs/core/embedding-providers/) cover MESA configuration.

## What can this comparison not show?

- Mürşit Large was run only on the dev split.
- With 112 answerable questions, gaps of 4 to 6 questions may not hold on a new sample. We did not run a significance test.
- We tested each model only through MESA's chunking and fusion pipeline. A different pipeline could change the order.
- Mürşit Base was not tested.
- These are results for this corpus, not a general ranking of the two models.

## Sources

1. [BAAI/bge-m3 model card](https://huggingface.co/BAAI/bge-m3)
2. [BGE-M3 paper](https://arxiv.org/abs/2402.03216)
3. [newmindai/Mursit-Large-TR-Retrieval model card](https://huggingface.co/newmindai/Mursit-Large-TR-Retrieval)
4. [BAAI/bge-reranker-v2-m3 model card](https://huggingface.co/BAAI/bge-reranker-v2-m3)
5. [MESA 0.9.4 changelog](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)

