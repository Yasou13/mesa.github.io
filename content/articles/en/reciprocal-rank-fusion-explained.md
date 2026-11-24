---
id: "reciprocal-rank-fusion"
slug: "reciprocal-rank-fusion-explained"
type: "learn"
language: "en"
title: "What is Reciprocal Rank Fusion (RRF)?"
subtitle: ""
summary: "RRF merges ranked search results using their positions instead of raw scores. Learn the formula, calculate an example and choose k."
shortAnswer: "Reciprocal Rank Fusion (RRF) combines several ranked lists into one. Each result receives 1/(k + rank) from every list that contains it, and the results are sorted by their total. Because it uses positions, it can combine BM25 and vector search without normalizing their scores."
category: "Memory & Retrieval"
tags: ["RRF", "rank fusion", "weighted", "k=60", "sıra birleştirme", "ağırlık"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-11-24"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "What Is RRF? Reciprocal Rank Fusion and k=60 — MESA"
seoDescription: "Reciprocal Rank Fusion (RRF) merges ranked lists using positions, not raw scores. Learn the formula, a worked example, why k is often 60 and when to avoid it."
lessonOrder: 7
learningStage: "retrieval"
prerequisites: ["hybrid-retrieval"]
learningObjectives: ["Compute RRF for three candidates", "Understand the smoothing constant and lane weights", "Specify deduplication, missing ranks and tie policy"]
---

## What is RRF?

Reciprocal Rank Fusion (RRF) is a rank fusion method: it turns several ranked result lists into one list. A result near the top of a list receives a larger contribution, and a result found by several lists adds those contributions together.

RRF is common in hybrid search because BM25 scores and vector similarities use different scales. RRF ignores those raw values and uses only each result’s position.

## Combine agreement without comparing raw scores

Two retrievers disagree about the Atlas archive. Lexical ranks A, B, C; dense ranks B, C, D. You want a method that uses each list’s order without pretending their raw scores share units. Reciprocal Rank Fusion assigns a decreasing contribution to each rank and sums the contributions for the same candidate. It is a simple baseline with explicit assumptions.

Cormack, Clarke and Büttcher evaluated this method on specific retrieval experiments. Their results motivate testing RRF; they do not guarantee an improvement for your task. The original method uses unweighted votes. Weighted RRF is an extension in which each lane’s contribution is multiplied by a declared weight. [Original paper](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf).

## Use one-based ranks

```text
RRF(d) = sum over lanes containing d: w_lane / (k + rank_lane(d))
rank starts at 1; missing candidate contributes 0.
Example below: k = 60, every weight = 1.
```

| Candidate | Lexical rank | Dense rank | RRF contribution sum |
| --- | --- | --- | --- |
| A | 1 | absent / yok | 1/61 = 0.016393 |
| B | 2 | 1 | 1/62 + 1/61 = 0.032522 |
| C | 3 | 2 | 1/63 + 1/62 = 0.032002 |
| D | absent / yok | 3 | 1/63 = 0.015873 |

The fused order is B, C, A, D. Agreement across the lists lifts B and C above A, despite A’s first position in one lane. A candidate missing from a truncated list receives zero from that lane, not a vote for rank infinity or rank zero. Keep candidate cutoffs in your experiment record because truncation changes the votes.

## What changes when k changes?

With `k=60`, first place contributes 1/61 and second place 1/62, a small difference. With `k=1`, they contribute 1/2 and 1/3, a much larger difference. Smaller k emphasizes top positions; larger k flattens contributions across the retrieved ranks. This k is a smoothing constant, not the number of results returned. Choose it with held-out evidence, not because 60 is universal.

<!-- diagram: Rank lists yield per-lane votes that merge by candidate ID and sort deterministically. -->
1. Lexical · A,B,C
2. Dense · B,C,D
3. Votes · 1/(k+rank)
4. Sum by ID · one per lane
5. Sort · B,C,A,D

*The result is a rank signal, not a calibrated probability.*

## Why is k usually 60 in RRF?

The value comes from the [original 2009 SIGIR paper](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf). Cormack, Clarke and Büttcher fixed k = 60 during a pilot investigation and did not change it during validation. They reported that 60 was near-optimal in their pilot, but that the choice was not critical.

Search systems often keep this starting point. [Elasticsearch](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion) defaults `rank_constant` to 60, and [Azure AI Search](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking) describes 60 as a small value that performs well in experiments. Neither fact proves that 60 is best for your documents.

| k | Rank 1 | Rank 2 | Rank 10 | Rank 1 / Rank 10 |
| --- | --- | --- | --- | --- |
| 1 | 0.5000 | 0.3333 | 0.0909 | 5.50× |
| 10 | 0.0909 | 0.0833 | 0.0500 | 1.82× |
| 60 | 0.0164 | 0.0161 | 0.0143 | 1.15× |

The last column shows how strongly k favors the top. At k = 1, first place counts 5.50 times as much as tenth place. At k = 60, it counts only 1.15 times as much, so agreement across lists matters more than one first-place result.

> [!NOTE]
> **Do not confuse the two k values**
> In vector search, k often means how many nearest neighbors to return. The RRF k is a separate smoothing constant.

## Specify the edge cases before deployment

Deduplicate a candidate within each lane before assigning its vote. Otherwise a backend returning the same ID twice changes the method. Decide what the ID represents and keep it consistent across lanes. If one lane returns document IDs and another assertion IDs, reconcile them into the same unit before fusion; matching strings alone is not a sound identity contract.

For exactly tied fused scores, use a documented stable rule such as canonical ID ordering. For weighted fusion, reject non-finite weights and decide whether zero disables a lane. Giving two copies of the same retriever separate full weights can double-count correlated evidence. More votes do not make an incorrect or unauthorized source acceptable.

## RRF vs score normalization and reranking

| Method | Uses | Main strength | Main limit |
| --- | --- | --- | --- |
| RRF | Ranks | Simple, needs no training or score calibration | Ignores how large the score gap was |
| Score normalization | Rescaled scores | Keeps score gaps | Depends on the normalization and score distribution |
| Cross-encoder reranking | Query and passage text | Can compare meaning more directly | Costs more and sees only its shortlist |

## When should you not use RRF?

- You have only one retriever, so there is nothing to fuse.
- Score gaps carry reliable meaning that you do not want to discard.
- Your lanes return nearly the same results, so fusion adds little new evidence.
- You need a calibrated confidence value. An RRF score is not a probability.
- You have enough judged data to train and validate a better ranking model.

MESA Core 0.9.5 uses weighted RRF with k = 60, vector weight 8, BM25 weight 1 and assertion weight 0. The vector lane runs only when an embedding model is set, so with models off BM25 decides the order. These are defaults for this system, not universal settings. See the [retrieval documentation](/docs/core/retrieval-and-graph/).

## What we measured in MESA

MESA’s vector weight of 8 came from a dev-set grid, not from theory. We changed only that weight and kept the other lanes at 1.

| Vector weight | Hit@5, no reranker | MRR, no reranker | MRR, with reranker |
| --- | --- | --- | --- |
| 1 | 0.5176 | 0.3953 | 0.6816 |
| 2 | 0.5765 | 0.4565 | 0.7055 |
| 4 | 0.6588 | 0.5152 | 0.7069 |
| 8 | 0.6706 | 0.5663 | 0.6973 |

> [!NOTE]
> **Setup**
> 0.9.1 development build, benchmark v1 dev split, Tier M, 141 documents, 5,041 chunks, 85 answerable questions, bge-m3, graph on, search limit 50, reranker depth 50.

Weight 8 was best without a reranker. With a reranker, weight 4 had a slightly higher MRR. Eight was also the largest value we tried, so we do not know whether a higher weight would do better. We have not rerun this grid on benchmark v2.

A large weight changes the worked example above. With a dense weight of 8, the scores are B 0.147277, C 0.144905, D 0.126984 and A 0.016393. D now outranks A, even though A was first in the lexical list.

Equal RRF scores are also common. In a [fresh-store test](/research/why-two-search-runs-differed/), random tie-breaks changed ranks on 49 of 112 answerable questions (benchmark v2 dev, Tier M, models off, build before 0.9.4). Setting the assertion weight to 0 was part of a [0.9.4 change](/research/what-improved-search-in-0-9-4/) that helped T0 and T1b on dev and lowered reranked dev Hit@5 from 0.9286 to 0.9107.

## Recalculate after a weight change

> [!EXERCISE]
> **Check your understanding**
> Set the dense lane weight to zero in the table. What order remains, and what happens to D?
>
> **Answer:** A, B, C keep the lexical order. D has zero contribution; whether zero-score candidates are excluded is an explicit output policy. Do not interpret the zero as proof that D is false or irrelevant.

## RRF questions

**Does RRF need score normalization?**
: No. RRF uses ranks, so BM25 and vector scores do not need a shared scale.

**What is a good k value for RRF?**
: Start with 60, then compare a few values such as 10, 30 and 100 on judged questions from your own data.

**Does RRF rank start at 0 or 1?**
: The original formula and Elasticsearch use ranks starting at 1. Keep this consistent, because zero-based ranks change every contribution.

**What happens if a document is missing from one list?**
: That list contributes 0 for the document. Its other lists still count.

**Is a higher RRF score a confidence score?**
: No. It is useful for ordering results in one query. Do not read it as a probability that the answer is correct.

## Sources and further reading

1. [Cormack, Clarke & Büttcher (SIGIR 2009) · Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)
2. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)
3. [Elastic · Reciprocal rank fusion](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion)
4. [Microsoft Learn · Hybrid search scoring (RRF)](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking)

