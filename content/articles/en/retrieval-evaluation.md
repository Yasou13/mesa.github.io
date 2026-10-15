---
id: "retrieval-evaluation"
slug: "retrieval-evaluation"
type: "methodology"
language: "en"
title: "Retrieval evaluation"
subtitle: ""
summary: "A minimum methodology for claims about whether a retrieval system finds useful, source-grounded material."
shortAnswer: "Freeze inputs, separate query creation from judgment, report multiple metrics and failure cases, and bind every result to versions and raw evidence."
category: "Evaluation"
tags: ["methodology", "retrieval", "evaluation"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-01"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Retrieval Evaluation Methodology — MESA Research"
seoDescription: "Review the minimum evidence, judgments, metrics, versioning, and reporting rules for MESA retrieval evaluations."
---

## Scope

This method applies to comparative retrieval evaluations. It does not turn one corpus or query set into a universal performance claim.

## Dataset and query selection

- Define source eligibility and temporal cut-off.
- Record licensing and preservation constraints.
- Version corpus, queries, and exclusions.
- Include difficult and zero-result cases deliberately.

## Relevance judgment

Judgment guidance should define graded relevance, evidence requirements, disagreement handling, and reviewer independence. System output must not silently define its own ground truth.

## Metrics

| Measure | Question |
| --- | --- |
| Recall@k | Was relevant material retrieved within the cut-off? |
| nDCG@k | Were more relevant items ranked earlier? |
| MRR | How early did the first relevant item appear? |
| Latency distribution | What operational cost accompanied retrieval? |

## Reporting and corrections

- [ ] Configuration and code revision
- [ ] Dataset, query, and judgment versions
- [ ] Aggregate and per-query outputs
- [ ] Failure cases and exclusions
- [ ] Known limitations
- [ ] Correction date and change record when findings are amended

