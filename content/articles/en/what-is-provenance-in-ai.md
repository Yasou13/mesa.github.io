---
id: "provenance-in-ai"
slug: "what-is-provenance-in-ai"
type: "learn"
language: "en"
title: "What is provenance in AI systems?"
subtitle: "Distinguishing superficial citations from tamper-evident source records, spans, and transformation trails"
summary: "Provenance is the complete, recorded history of information: its origin entity, ingestion transformations, supporting evidence spans, and authorization lifecycle."
shortAnswer: "A citation is a pointer; provenance is an auditable, tamper-evident lineage explaining where a fact originated, how it was processed, and why it is valid to use right now."
category: "Evidence & Trust"
tags: ["provenance", "auditability", "evidence", "trust"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-01"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "What Is Provenance in AI Systems? — MESA Learn"
seoDescription: "Learn what provenance means in AI systems: origin entity, transformation pipelines, exact evidence spans, and the distinction between citation and provenance."
---

## The crucial distinction: Citation vs provenance

In contemporary conversational AI, models frequently produce casual citations: footnotes like '[1]' pointing to a URL, or natural language remarks like 'According to recent court decisions...'. These are not provenance.

> [!WARNING]
> **Citation is not verification**
> A citation tells you where someone claims to have found an answer. It does not prove the document exists, that the cited text was not fabricated, that the version used was current, or that the quotation supports the conclusion.

Provenance, by contrast, is a formal computer science and information theory concept: it is an immutable, inspectable audit trail tracking data from its origin through every processing step to its current use.

## The conceptual foundation: Entities, activities, and agents

The international standard for data provenance (W3C PROV-DM) defines three foundational building blocks:

| PROV Element | Definition | AI Memory Example |
| --- | --- | --- |
| Entity | A physical, digital, or conceptual thing with distinct state | The official PDF release of Resmî Gazete issue #32450 |
| Activity | An action that creates, transforms, or uses entities | Document parsing, canonical JSONL extraction, chunk embedding |
| Agent | An actor bearing responsibility for an activity | The ingestion pipeline service, a verified human reviewer, an AI model |

<!-- diagram: W3C PROV diagram: Entity derived from Entity via Activity associated with Agent -->
1. Origin Document (Entity)
2. Extraction & Chunking (Activity)
3. Admitted Assertion (Derived Entity)
4. Review & Signature (Agent)

*The W3C PROV-DM model: Information derivation is modeled as explicit relationships between entities, activities, and agents.*

## What makes a complete AI provenance record?

An audit-ready provenance record in a reliable AI system includes seven mandatory attributes:

- [ ] 1. Origin Identity: Stable URI, official registration identifier, or content-addressable hash (SHA-256).
- [ ] 2. Exact Evidence Span: Character start and end offsets `[start..end]` anchoring the exact supporting passage.
- [ ] 3. Temporal Snapshot: Timestamp of when the source was published, retrieved, and parsed.
- [ ] 4. Pipeline Version: Exact Git commit hash or Docker image tag of the software that performed extraction.
- [ ] 5. Model Identifier: Pinned model ID and version (e.g. `text-embedding-3-small@v1`) if embeddings or LLMs were used.
- [ ] 6. Authorization Scope: Tenant and workspace bounds that define who is legally allowed to inspect or use this fact.
- [ ] 7. Invalidation Link: If superseded, a pointer to the newer authority that replaced this record.

## Why provenance protects against model drift and hallucinations

Provenance is not merely regulatory overhead; it is a powerful technical safeguard in autonomous systems:

- Automated Entailment Checking: A guardrail model can fetch the exact evidence span from the source and verify that the LLM's generated response is mathematically entailed by the source passage.
- Cascade Invalidation: When a legal statute or API document is amended, the system uses provenance graphs to immediately invalidate all downstream memory assertions that depended on that source.
- Deterministic Debugging: When an agent produces an unexpected answer, developers can trace every input assertion back to the exact byte offset in the source document.

## Provenance in the MESA ecosystem

In MESA, provenance is treated as an architectural invariant across repositories:

- In [MESA Data](data/), raw official Turkish legal sources (PDF and HTML) are preserved as immutable byte bedrock, with character spans mapped into canonical JSONL.
- In [MESA Core](mesa/), every memory retrieval returns the source document hash and character span alongside the assertion.
- In [MESA Law](law/), lawyers can click any AI recommendation to highlight the exact authoritative passage in the official gazette.

## References and standards

1. [Moreau & Missier (2013) — W3C PROV-DM: The PROV Data Model](https://www.w3.org/TR/prov-dm/)
2. [Buneman et al. (2001) — Why and Where: A Characterization of Data Provenance (ICDT '01)](https://link.springer.com/chapter/10.1007/3-540-44503-X_20)
3. [Provenance Definition — MESA Glossary](glossary/provenance/)

