---
id: "reranking-strategies-for-agent-memory"
slug: "reranking-strategies-for-agent-memory"
type: "learn"
language: "en"
title: "Cross-encoder reranking and second-stage scoring in memory systems"
subtitle: "Refining candidate recall with full cross-attention transformer models"
summary: "First-stage retrieval rapidly gathers candidate passages, while second-stage cross-encoder rerankers perform deep query-document cross-attention to eliminate false positives."
shortAnswer: "Bi-encoders prioritize search speed across millions of items; cross-encoders prioritize precision by analyzing full token interactions over the top 50 candidates."
category: "Memory & Retrieval"
tags: ["reranking", "cross-encoder", "retrieval", "precision"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Cross-encoder reranking and second-stage scoring in memory systems — MESA Learn"
seoDescription: "First-stage retrieval rapidly gathers candidate passages, while second-stage cross-encoder rerankers perform deep query-document cross-attention to elimina"
---

## The bi-encoder independence limitation

First-stage retrievers (bi-encoders and BM25) process queries and documents independently. Because query tokens cannot attend to document tokens during indexing, bi-encoders miss subtle logical relationships such as negation or conditional statements.

> [!WARNING]
> **The Top-K Pollution Risk**
> Feeding unranked top-20 candidates directly into an agent's context window consumes precious token budget and injects distractors that confuse model reasoning.

## Engineering trade-offs side-by-side

| Stage | Model Architecture | Latency per Query | Scoring Mechanism |
| --- | --- | --- | --- |
| First-Stage Retrieval | Bi-Encoder (HNSW) + BM25 | < 5 ms across 1,000,000 items | Dot product / Cosine distance between pre-computed vectors |
| Second-Stage Reranking | Cross-Encoder (Full Transformer) | 20-80 ms over top 50 candidates | Joint cross-attention over concatenated (Query, Document) tokens |
| Third-Stage Verification | Deterministic Assertion Logic | < 1 ms over top 10 items | Schema filter, evidence verification, temporal validity check |

## Cross-attention vs dot product representations

In a cross-encoder, the query and document are concatenated into a single sequence: `[CLS] Query [SEP] Document [SEP]`. Every transformer layer allows every query token to attend directly to every document token, capturing nuanced nuances like 'except', 'unless', and 'not'.

```text
// Cross-encoder invocation schema
Input = '[CLS] Does Alice have power of attorney? [SEP] Alice was granted limited power of attorney, excluding real estate transactions. [SEP]'
Output Logits = [0.12 (irrelevant), 0.88 (relevant)]
```

## MESA's multi-stage retrieval pipeline

In MESA Core, hybrid first-stage retrieval surfaces candidates from vector, BM25, and graph lanes. Candidates are fused via RRF, reranked for precision, and passed through deterministic profile gates before prompt injection.

- [ ] First-stage gathers broad candidate recall across complementary lanes.
- [ ] Cross-encoder reranking eliminates lexical distractors and semantic near-misses.
- [ ] Reranked results retain immutable pointers to canonical evidence spans.
- [ ] Strict latency budgets ensure reranking does not breach interactive SLAs.

## References

1. [Nogueira & Cho (2019) — Passage Re-ranking with BERT](https://arxiv.org/abs/1901.04085)
2. [Thakur et al. (2021) — BEIR: A Heterogeneous Benchmark for Zero-shot Evaluation of Information Retrieval Models (NeurIPS)](https://arxiv.org/abs/2104.08663)

