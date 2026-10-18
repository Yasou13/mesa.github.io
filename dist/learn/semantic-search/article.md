---
id: "semantic-search"
slug: "semantic-search"
type: "learn"
language: "en"
title: "Embeddings and semantic search, with numbers"
subtitle: ""
summary: "Calculate similarity, distinguish dense and sparse representations, and understand why nearest neighbors are neither facts nor access decisions."
shortAnswer: "Calculate similarity, distinguish dense and sparse representations, and understand why nearest neighbors are neither facts nor access decisions."
category: "Memory & Retrieval"
tags: ["embedding", "dense", "sparse", "cosine", "vector", "vektör", "kosinüs", "anlamsal arama"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Embeddings and semantic search, with numbers — MESA Learn"
seoDescription: "Calculate similarity, distinguish dense and sparse representations, and understand why nearest neighbors are neither facts nor access decisions."
lessonOrder: 4
learningStage: "retrieval"
prerequisites: ["structured-vs-unstructured-memory"]
learningObjectives: ["Calculate cosine similarity on a small example", "Separate representation from nearest-neighbor indexing", "Recognize model identity and exact-match limitations"]
---

## What an embedding actually represents

An embedding model maps input into numbers arranged as a vector. Training encourages some relationships to be reflected in geometric proximity. A document about “opening hours” may be close to “when can I enter?” even without shared words. This is useful for candidate retrieval. The coordinates are learned features, not labeled columns such as “truth”, “permission” or “currentness”.

A dense representation usually stores a fixed-length array with many nonzero values. A sparse representation stores a small set of weighted dimensions from a much larger space. Classical lexical dimensions correspond to terms; learned sparse models may expand or reweight them. Sparse does not mean “no learning”, and dense does not guarantee better domain retrieval. The choice requires evaluation on your questions.

## A two-dimensional similarity calculation

```text
cosine(q, d) = dot(q, d) / (norm(q) * norm(d))
q = [1, 0]
A = [0.8, 0.6]   norm(A) = 1   cosine(q,A) = 0.8
B = [0, 1]       norm(B) = 1   cosine(q,B) = 0
C = [8, 6]       norm(C) = 10  cosine(q,C) = 0.8
```

A and C have equal cosine similarity because cosine compares direction, not length. Raw dot products differ: 0.8 for A and 8 for C. For unit-normalized vectors, cosine and dot product coincide; without normalization they need not. These invented two-dimensional vectors explain arithmetic only. They are not outputs of a language model and do not demonstrate semantic quality.

A similarity of 0.8 is not an 80% probability of relevance. Its meaning depends on the embedding model, score distribution and task. A threshold that works for one corpus may fail after changing language, chunking or model. Calibrate any threshold using judged queries and track precision/recall trade-offs.

## Encoding and indexing are different steps

<!-- diagram: Document and query encoders feed a vector comparison; eligibility is independently enforced. -->
1. Source · chunk + revision
2. Encode · fixed model identity
3. Index · exact or approximate
4. Query · compatible encoder
5. Verify · scope + evidence

*A vector index accelerates comparison. It does not define what a record means.*

Exact search scores every eligible vector. Approximate nearest-neighbor search trades some recall for lower search cost. Measure approximation loss against exact search on a manageable sample, keeping the same distance metric and scope. Separately measure semantic relevance with human judgments; an index can perfectly recover the nearest vectors while those vectors are poor answers.

## Matching dimensions is not enough

Record provider, model, revision, dimension, normalization and encoding instructions. Two models can both return 768 numbers while using incompatible spaces. Some retrieval models intentionally use different query/document encoders or prefixes; compatibility means the model’s prescribed pairing, not necessarily identical strings. Changing representation usually requires re-encoding documents and rebuilding the derived index.

Identifiers, negation and near-duplicate versions expose limits. “Rule A-17 applies” and “Rule A-17 does not apply” may be semantically close. Use lexical retrieval for exact symbols and structured filters for validity. DPR and Sentence-BERT provide examples of learned dense retrieval and sentence representation, not a guarantee for every multilingual archive. [DPR](https://arxiv.org/abs/2004.04906), [Sentence-BERT](https://arxiv.org/abs/1908.10084).

## Explain a suspicious improvement

> [!EXERCISE]
> **Check your understanding**
> After switching models, vectors still have 768 dimensions and the service returns results. Is that enough to keep the old document index?
>
> **Answer:** No. Check the query/document representation contract and re-encode if incompatible. A syntactically valid vector can still be in a different space. Evaluate both neighbor recovery and task relevance.

## Sources and further reading

1. [Karpukhin et al. (2020) · Dense Passage Retrieval](https://arxiv.org/abs/2004.04906)
2. [Reimers & Gurevych (2019) · Sentence-BERT](https://arxiv.org/abs/1908.10084)
3. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)

