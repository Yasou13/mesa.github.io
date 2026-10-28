---
id: "temporal-decay-in-ai-memory"
slug: "temporal-decay-in-ai-memory"
type: "learn"
language: "en"
title: "Changing facts: validity, contradiction and forgetting"
subtitle: ""
summary: "Distinguish when a statement applies from when it was recorded. Handle corrections and conflicts without equating age with invalidity."
shortAnswer: "Distinguish when a statement applies from when it was recorded. Handle corrections and conflicts without equating age with invalidity."
category: "Evidence & Trust"
tags: ["temporal", "validity", "decay", "contradiction", "version", "zaman", "geçerlilik", "çelişki", "unutma"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-28"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Changing facts: validity, contradiction and forgetting — MESA Learn"
seoDescription: "Distinguish when a statement applies from when it was recorded. Handle corrections and conflicts without equating age with invalidity."
lessonOrder: 12
learningStage: "systems"
prerequisites: ["evidence-aware-memory", "sqlite-as-canonical-agent-memory"]
learningObjectives: ["Distinguish valid time and recorded time", "Recognize apparent versus real contradiction", "Explain decay as ranking policy rather than truth"]
---

## Two clocks answer different questions

The archive announces a new Friday opening time on 18 October, effective 1 November. The system learns the announcement on 20 October. “What is the opening time today?” and “What had our system recorded by 19 October?” are different questions. A single `updated_at` field cannot represent both meanings reliably.

| Field | Example | Meaning |
| --- | --- | --- |
| valid_from | 1 November | When the claim starts applying |
| valid_to | open-ended | When applicability ends |
| recorded_at | 20 October | When this system stored it |
| source_revision | handbook-r3 | Which document states it |

These are conceptual fields for the lesson. Supporting both valid-time and transaction-time historical queries requires an explicit bitemporal model and query semantics. Do not infer that capability merely because a product stores timestamps. MESA’s architecture documents its own temporal filters and limitations; the example here is not a claim of full bitemporal support.

## Represent the change as intervals

<!-- diagram: Revision 2 applies before November; revision 3 applies from November; recording happens on a separate timeline. -->
1. Old claim · Friday 09:00
2. End · before Nov 1
3. New claim · Friday 10:00
4. Start · Nov 1 inclusive
5. Recorded · Oct 20 separately

*Declare interval endpoints and timezone; do not silently overwrite the old value.*

A half-open interval `[start, end)` includes the start and excludes the end. Adjacent intervals then meet without overlapping: old until 1 November, new from 1 November. Define timezone and date granularity; “midnight” is incomplete without a timezone. Keep the source’s precision rather than inventing a time of day for a date-only announcement.

## Compare like with like before calling it a conflict

“Opens at nine” and “opens at ten” appear contradictory. They may describe different rooms, days, dates or source authorities. First align entity identity, predicate, units, scope and validity intervals. Only then ask whether two incompatible values compete under the same conditions. Negation and modality matter: “may open” is not “will open”.

If two current sources genuinely disagree, preserve both and expose the conflict with their provenance. A resolution policy might prefer an official revision, require review or decline to choose. “Newest wins” is not universally safe: a recent low-quality copy can contradict an older authoritative source. Record the resolution reason and retain the information needed to undo it.

## Age can change priority without changing truth

```text
illustrative recency weight = exp(-lambda * age)
half-life H => lambda = ln(2) / H
age = H  => weight = 0.5
age = 2H => weight = 0.25
Apply only after eligibility; this is a ranking policy.
```

A recent task note may deserve more attention than an old one. A historical contract can remain the correct source for a past date regardless of age. Decay is a chosen ranking heuristic; expiration is a validity rule; deletion is a retention action. Keep them separate. Test questions about both “now” and historical dates before enabling recency weighting.

## Classify the apparent conflict

> [!EXERCISE]
> **Check your understanding**
> Revision 2 says Friday 09:00 until November; revision 3 says Friday 10:00 from November. Must one be labeled false?
>
> **Answer:** No. They apply to different intervals. Preserve both and filter by the question’s date. A contradiction would require incompatible values under the same entity, scope and overlapping validity conditions.

## Sources and further reading

1. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
2. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

