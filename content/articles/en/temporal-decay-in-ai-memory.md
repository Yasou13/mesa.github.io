---
id: "temporal-decay-in-ai-memory"
slug: "temporal-decay-in-ai-memory"
type: "learn"
language: "en"
title: "Temporal decay and knowledge freshness in agent memory"
subtitle: "Balancing durable historical facts against mutating real-time beliefs"
summary: "Knowledge in agent memory changes over time. Temporal decay models determine whether an assertion remains active, requires re-verification, or has been superseded."
shortAnswer: "Temporal memory uses validity intervals and decay algorithms so agents do not treat stale or superseded observations as currently active truths."
category: "Foundations"
tags: ["temporal-decay", "memory-freshness", "state-mutation", "ai-memory"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "Temporal decay and knowledge freshness in agent memory — MESA Learn"
seoDescription: "Knowledge in agent memory changes over time. Temporal decay models determine whether an assertion remains active, requires re-verification, or has been sup"
---

## The permanence trap of vector embeddings

Vector databases treat points in latent space as timeless. An embedding computed three years ago remains indefinitely close to queries matching its keywords, creating a dangerous failure mode where agents cite obsolete state.

> [!WARNING]
> **The Stale State Vulnerability**
> If an agent stores 'Server configuration points to Cluster A', and the cluster is migrated to Cluster B, vector distance alone cannot determine that Cluster A is an outdated historical fact rather than current state.

## Engineering trade-offs side-by-side

| Strategy | Mechanism | Best For | Failure Risk |
| --- | --- | --- | --- |
| Exponential Decay | Score multiplied by exp(-lambda * delta_t) | Chat recency, casual interactions | Erases foundational facts that are permanently true |
| Explicit Intervals | valid_from and valid_until timestamps | Contracts, statutes, configuration state | Requires explicit invalidation triggers |
| Bitemporal Modeling | Valid Time vs Transaction Time | Financial audits, legal compliance | Higher storage and query complexity |
| Superseding Chains | Explicit revision pointers (superseded_by) | Entity attribute updates | Dangling references if chains break |

## Bitemporal intervals and decay equations

High-assurance memory engines implement bitemporal indexing: recording both when an event occurred in the real world (valid time) and when the memory system learned about it (transaction time). Decay is applied strictly to relevance scores, never to destructive record deletion.

```text
// Bitemporal memory filter in SQL
SELECT * FROM assertions
WHERE valid_from <= CURRENT_TIMESTAMP
  AND (valid_until IS NULL OR valid_until > CURRENT_TIMESTAMP)
  AND transaction_status = 'COMMITTED';
```

## Temporal scoping in MESA

MESA Core mandates temporal boundary fields on every memory record. Retrieval filters reject superseded records before vector or lexical ranking occurs, ensuring historical logs remain intact without contaminating live agent reasoning.

- [ ] Every assertion schema includes valid_from and valid_until boundaries.
- [ ] State updates create immutable revision records rather than in-place overwrites.
- [ ] Audit queries can time-travel to inspect the exact memory state at any historical point in time.
- [ ] Decay algorithms do not destroy underlying evidence spans.

## References

1. [Snodgrass & Jensen (1999) — Developing Time-Oriented Database Applications in SQL](https://www.cs.arizona.edu/people/rts/tdbbook.pdf)
2. [Ebbinghaus (1885) — Memory: A Contribution to Experimental Psychology](https://psychclassics.yorku.ca/Ebbinghaus/)

