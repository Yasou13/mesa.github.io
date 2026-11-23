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
updatedAt: "2026-11-24"
readingMinutes: 9
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
- [ ] Fresh-build comparison of ordered results
- [ ] A log of every test-split read

## What did MESA’s own benchmark teach us?

These rules come from mistakes and limits in our benchmark work. All numbers use benchmark v2 on Tier M.

| What happened | Evidence | Rule we now follow |
| --- | --- | --- |
| Two identical builds scored differently | 48/112 and 52/112 Hit@5 on dev, models off, before 0.9.4 | Build two fresh indexes and compare ordered results |
| An average hid rank movement | 49 of 112 answerable questions changed rank | Keep per-query results |
| A change helped two modes and hurt a third | T2 dev Hit@5 fell from 0.9286 to 0.9107 in 0.9.4 | Report every configuration, including losses |
| The test split was reused | Read in six runs across v1 and v2 | Log every read and do not call the split untouched |
| Labels had one review pass | No independent agreement measure | State annotation limits next to results |

The details are in [How We Built a Turkish Legal Retrieval Benchmark](/research/turkish-legal-benchmark-v2/) and [Why Two Identical Search Runs Gave Different Results](/research/why-two-search-runs-differed/).

