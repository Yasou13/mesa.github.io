---
id: "structured-vs-unstructured-memory"
slug: "structured-vs-unstructured-memory"
type: "learn"
language: "en"
title: "From documents to claims: preserve what extraction loses"
subtitle: ""
summary: "Represent exact text, entities and assertions without confusing an extracted claim with verified truth. Work through a source-linked record."
shortAnswer: "Represent exact text, entities and assertions without confusing an extracted claim with verified truth. Work through a source-linked record."
category: "Foundations"
tags: ["assertion", "entity", "schema", "chunk", "iddia", "varlık", "şema", "kanıt aralığı"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "From documents to claims: preserve what extraction loses — MESA Learn"
seoDescription: "Represent exact text, entities and assertions without confusing an extracted claim with verified truth. Work through a source-linked record."
lessonOrder: 3
learningStage: "foundation"
prerequisites: ["what-is-ai-memory", "rag-vs-ai-memory"]
learningObjectives: ["Distinguish chunks, entities and assertions", "Keep qualifiers and evidence offsets", "Correct an extraction without rewriting history"]
---

## Three representations of the same source

The Atlas handbook says “Starting 1 November, the reading room opens at 10:00 on Fridays; other weekdays remain 09:00.” Raw text preserves wording. A chunk makes part of it retrievable. An assertion makes one interpretation explicit: subject, predicate, value and qualifiers. A graph makes relationships traversable. None of these representations automatically proves that the source is correct.

| Representation | Good at | Can lose |
| --- | --- | --- |
| Exact source | Audit and re-interpretation | Convenient query structure |
| Text chunk | Passage retrieval | Document-wide qualification |
| Assertion | Filtering and joins | Nuance or extraction uncertainty |
| Graph edge | Relationship traversal | Evidence unless explicitly linked |

Choose representations according to the question. “What does paragraph four say?” needs exact text. “Which rooms open after nine on Friday?” benefits from typed time/day fields. Keeping a source-linked assertion alongside the text serves both. Treat the structured row as a derived interpretation that can be re-extracted when the parser or model changes.

## Build a claim that retains its conditions

```text
assertion_id: a-42
subject_id: room-atlas-reading
predicate: opening_time
value: "10:00"
day_of_week: Friday
valid_from: 2026-11-01
source_revision: handbook-r3
evidence_text: "opens at 10:00 on Fridays"
extractor_version: example-parser-2
```

Dropping “Friday” changes the claim. Dropping “starting 1 November” makes a future change look current. Treat units, negation, jurisdiction, time and exceptions as part of the assertion when they affect its meaning. If the extraction cannot represent a condition, keep the source and flag the interpretation as incomplete rather than silently discarding it.

Use stable IDs to distinguish the room from its label. “Atlas”, “Atlas Reading Room” and “Room A” might refer to one entity, or to different entities. Entity resolution is a separate decision requiring evidence. A string match can propose a candidate; it should not automatically merge records across organizations or access scopes.

## Keep the derivation visible

<!-- diagram: A source revision produces a chunk, an extraction run and a qualified assertion. -->
1. Revision r3 · original text
2. Chunk c4 · exact range
3. Extraction e2 · model/parser
4. Assertion a42 · qualifiers

*A correction replaces the derived claim; the original revision remains identifiable.*

W3C PROV distinguishes entities, activities and agents in provenance descriptions. Applied here, the source and claim are entities, extraction is an activity, and a software service is an agent. This vocabulary helps ask who produced a claim and from what. It does not prescribe your database schema or certify the truth of the extraction. [PROV overview](https://www.w3.org/TR/prov-overview/).

## Validate structure and meaning separately

Schema validation can reject a missing source ID, invalid time or absent subject. Semantic checks ask whether the source actually supports the claim and whether conditions were preserved. Passing JSON validation proves only structural conformance. Two models agreeing can still share the same misunderstanding; agreement is a signal, not an independent source.

For corrections, distinguish a changed source from a changed interpretation. If the source is unchanged but “Friday” was misread as “every day”, create a new extraction or assertion version and retract the faulty one. If the handbook itself changes, create a new source revision. This separation lets you audit whether a later answer changed because reality, the document or the extraction pipeline changed.

## Repair the extraction

> [!EXERCISE]
> **Check your understanding**
> An extractor turns “closed on public holidays” into `is_open=true`. The JSON schema is valid. What should your review record?
>
> **Answer:** A semantic contradiction with the exact supporting span, the extractor version and the affected assertion ID. Retract or replace the derived claim; preserve the source revision and do not call this a source update.

## Sources and further reading

1. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
2. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

