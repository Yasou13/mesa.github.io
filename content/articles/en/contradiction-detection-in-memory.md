---
id: "contradiction-detection-in-memory"
slug: "contradiction-detection-in-memory"
type: "learn"
language: "en"
title: "Contradiction detection and belief revision in AI agents"
subtitle: "Maintaining logical consistency across evolving assertion lifecycles"
summary: "When autonomous agents learn conflicting information, belief revision algorithms must detect contradictory predicates, assess evidence authority, and mark superseded claims."
shortAnswer: "Contradiction resolution requires schema-defined uniqueness constraints and evidentiary precedence rather than naive text accumulation."
category: "Memory & Retrieval"
tags: ["contradiction-detection", "belief-revision", "state-mutation", "logic"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Contradiction detection and belief revision in AI agents — MESA Learn"
seoDescription: "When autonomous agents learn conflicting information, belief revision algorithms must detect contradictory predicates, assess evidence authority, and mark"
---

## The accumulation paradox in naive memory

In naive RAG setups, every conversation turn or ingested document is embedded into vector space without contradiction checking. Over time, mutual contradictions accumulate, forcing the generator to arbitrate between irreconcilable statements.

> [!WARNING]
> **The Hallucination Cascade**
> When an LLM receives two conflicting factual claims in its prompt context (e.g. 'Project budget is $50k' and 'Project budget was increased to $80k'), it often hallucinates an ungrounded synthesis or picks an arbitrary answer.

## Engineering trade-offs side-by-side

| Approach | Detection Mechanism | Resolution Strategy | Consistency Level |
| --- | --- | --- | --- |
| Vector Append-Only | No detection | None (both chunks retrieved) | Low: severe contradiction risk |
| LLM Arbitration | Prompting model to spot conflicts | Probabilistic in-context selection | Medium: prone to prompt sensitivity |
| Relational Unique Constraints | Database primary keys & unique indexes | Deterministic state replacement (UPSERT) | High: guarantees single active truth per entity |
| Formal Belief Revision (AGM) | Epistemic entrenchment and revision operators | Explicit retraction and provenance trail | Highest: mathematical consistency guarantee |

## AGM postulates and database assertions

The Alchourrón-Gärdenfors-Makinson (AGM) framework defines mathematical postulates for rational belief revision: expansion, contraction, and revision. In structured memory, each entity attribute is governed by a functional dependency: (Subject, Predicate) -> Unique Active Object.

```text
// Assertion superseding transaction
UPDATE assertions
SET status = 'SUPERSEDED', updated_at = CURRENT_TIMESTAMP
WHERE subject = 'project_alpha' AND predicate = 'budget' AND status = 'COMMITTED';

INSERT INTO assertions (subject, predicate, object, status, superseded_id)
VALUES ('project_alpha', 'budget', '80000_USD', 'COMMITTED', 'asrt_prev_id');
```

## Contradiction lifecycle in MESA

MESA Core handles belief revision deterministically through assertion lifecycle states: COMMITTED, SUPERSEDED, PENDING_REVIEW, and RETRACTED. New assertions can never silently overwrite historical records; they append revision edges.

- [ ] Contradictions are detected at ingestion time through typed schema constraints.
- [ ] Older assertions transition to SUPERSEDED status with timestamped audit trails.
- [ ] Retrieval queries filter out non-COMMITTED records by default.
- [ ] Evidence spans for both the superseded and active claims remain inspectable.

## References

1. [Alchourrón, Gärdenfors & Makinson (1985) — On the Logic of Theory Change: Partial Meet Contraction and Revision Functions](https://www.jstor.org/stable/2274239)
2. [Gärdenfors (1988) — Knowledge in Flux: Modeling the Dynamics of Epistemic States](https://mitpress.mit.edu/9780262570824/)

