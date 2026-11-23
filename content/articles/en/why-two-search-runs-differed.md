---
id: "two-search-runs-differed"
slug: "why-two-search-runs-differed"
type: "research"
language: "en"
title: "Why Two Identical Search Runs Gave Different Results"
subtitle: "A ranking bug that looked like a quality change"
summary: "Two fresh MESA stores built from the same documents disagreed on 49 of 112 dev questions. Random IDs were deciding tied ranks."
shortAnswer: ""
category: "Retrieval Evaluation"
tags: ["benchmark", "determinism", "rrf", "evaluation"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-23"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "Why Two Identical Search Runs Gave Different Results"
seoDescription: "Two fresh MESA stores disagreed on 49 of 112 questions. Here is how random tie-breaks caused it and how we made ranking repeatable."
---

## Why did the same search give different results?

Random IDs were breaking ties. When two passages had the same score, their order depended on a UUID created at ingest. Two fresh stores built from the same 141 documents therefore ranked some passages differently. On benchmark v2 dev (Tier M, models off), one store scored 48/112 on Hit@5 and the other scored 52/112.

The fix was to break ties by stable content identity. On the published MESA 0.9.4 package, two independently built stores returned the same order for all 128 dev questions, in all three tested configurations.

## What did the two runs show?

The difference appeared only between separately built stores. Repeating the search on one store changed nothing, so query-time randomness was not the cause.

| Comparison (dev, T0, before the fix) | Hit@5 | MRR | Answerable questions with a different rank |
| --- | --- | --- | --- |
| Fresh store A | 48/112 | 0.3314 | 49, A vs B |
| Fresh store B | 52/112 | 0.3500 | 49, A vs B |
| Shared store, run 1 | 50/112 | 0.3411 | 0, run 1 vs run 2 |
| Shared store, run 2 | 50/112 | 0.3411 | 0, run 1 vs run 2 |

The Hit@5 gap hides how much moved. Forty-nine answerable questions changed rank. Only six crossed the top-5 boundary: one in store A's favor and five in store B's. The net result was a four-question gap.

> [!NOTE]
> **Setup**
> Development build before the 0.9.4 ranking changes, with graph on and models off. Benchmark v2 dev split, Tier M, 141 documents, 5,041 chunks, 128 questions, 112 of them answerable. Search limit 50.

## Why do ties happen in rank fusion?

[Reciprocal Rank Fusion](/learn/reciprocal-rank-fusion-explained/) scores a passage from its rank in each list, not from the raw score. Ranks are integers, so exact ties are normal.

Here is an illustrative example. With k = 60 and equal weights, a passage ranked third only by BM25 scores 1/(60+3). A passage ranked third only by the assertion lane also scores 1/(60+3). The fused score cannot separate them, so the next sort key decides.

Before the fix, that next key could be a random UUID. The UUID was stable inside one store, which is why repeated runs agreed. A new store generated new UUIDs, so the same tie could resolve the other way.

## How did we make ranking repeatable?

MESA 0.9.4 changed two things. Search lanes and fusion now break equal scores by content identity. The catalog also assigns tenant-scoped, deterministic UUID5 keys, so the same corpus produces the same internal keys. Scores do not change.

```text
# Pseudo-code, simplified from MESA 0.9.4
results = sorted(
    candidates,
    key=lambda c: (
        -c.fused_score,
        c.document_id,
        c.revision_number,
        c.chunk_ordinal,
        c.chunk_id,
    ),
)
```

During development, one pair of fresh stores still differed on 2 of 112 answerable questions, with no change to the top-5 count. The next pair differed on none. The check that matters is the published package:

| MESA 0.9.4 from PyPI, dev, Tier M | Identical questions | Gold-rank differences | Returned-order differences |
| --- | --- | --- | --- |
| T0 (models off) | 128/128 | 0 | 0 |
| T1b (bge-m3) | 128/128 | 0 | 0 |
| T2 (bge-m3 + reranker) | 128/128 | 0 | 0 |

That run used 0.9.3 graph and assertion settings. A separate run with the 0.9.4 release defaults repeated the result. Its T1b ranks also matched on a different LanceDB version, 128 of 128.

## Why does this matter for evaluation?

A four-question swing is larger than some real improvements. In the same development cycle, prefix BM25 alone added a net two questions on a shared store. On fresh stores, that gain could not have been told apart from tie noise.

So we changed how we compare. Before the fix, we measured changes on one shared store. Since the fix, we also build fresh stores and compare the ordered results. Read the full before-and-after numbers in [What Improved MESA Search Quality in 0.9.4](/research/what-improved-search-in-0-9-4/).

## How can you check your own search system?

1. Build two indexes from the same input, in separate locations.
2. Run the same queries against both.
3. Compare the ordered result IDs, not only Hit@k or MRR.
4. If orders differ, look for ties first, then for generated IDs, insertion order and parallel ingestion.
5. Add a final sort key that comes from the content, and keep a test that builds two fresh stores.

Our [evaluation method](/methodology/retrieval-evaluation/) lists what to record with each run. The [MRR and nDCG lesson](/learn/evaluating-ndcg-and-mrr-in-memory/) explains why small rank moves can change a score.

## What can this result not show?

- It covers one Turkish legal corpus and 128 dev questions.
- It shows repeatability for the same corpus, package and settings. Adding a document can still change ranks.
- A deterministic tie-break makes the order repeatable. It does not make the tied passages more relevant.
- We did not count how many of the 49 rank differences came from each lane.

## Sources

1. [MESA 0.9.4 changelog](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
2. [Cormack, Clarke and Büttcher: Reciprocal Rank Fusion (SIGIR 2009)](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)
3. [RFC 9562: Universally Unique IDentifiers](https://www.rfc-editor.org/rfc/rfc9562.html)

