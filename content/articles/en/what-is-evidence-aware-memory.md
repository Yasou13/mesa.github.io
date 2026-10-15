---
id: "evidence-aware-memory"
slug: "what-is-evidence-aware-memory"
type: "learn"
language: "en"
title: "What is evidence-aware memory?"
subtitle: "The conceptual foundation of attaching source identity, exact spans, and scope to agent knowledge"
summary: "Evidence-aware memory is an architectural paradigm where an AI system cannot store or recall an assertion without binding it to verifiable source identity, evidence spans, and authorization scopes."
shortAnswer: "Traditional agent memory records what happened; evidence-aware memory records what happened, who said it, which source document proves it, what exact character span supports it, and what scope permits reading it."
category: "Evidence & Trust"
tags: ["evidence", "provenance", "ai-memory", "auditability"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-01"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "What Is Evidence-Aware Memory? — MESA Learn"
seoDescription: "Understand evidence-aware memory: attaching source identity, exact evidence character spans, and authorization scopes to every agent assertion."
---

## The grounding crisis in autonomous agent memory

Most conversational and agent frameworks treat memory as an unverified string store. An LLM observes a conversation, extracts a summary such as 'Customer has approved the revised contract terms', and persists that sentence in a database.

> [!WARNING]
> **The untraceable claim dilemma**
> Two weeks later, the agent takes irreversible actions based on that memory. When audited, neither human reviewers nor the system can determine whether that assertion was an authorized statement, a misinterpreted draft, an out-of-date assumption, or a model hallucination. The memory exists, but its grounding does not.

![Archival plate illustrating source documents with highlighted evidence spans connecting through derivation pipelines into tamper-evident canonical assertions](assets/provenance-lineage-plate.svg)
*Evidence-aware memory: A claim derives legitimacy strictly from its lineage, source identity, and exact textual evidence span.*

**Evidence-Aware Memory**
: A memory architecture in which knowledge claims cannot exist as detached propositions; every admitted record is cryptographically or structurally bound to its origin source, exact supporting span, and scope boundaries.

## The five structural elements of evidence-aware memory

To be truly evidence-aware, every recalled memory must resolve five distinct questions:

- [ ] 1. Statement (Proposition): The factual claim or relation (e.g. `(Matter 402, status, FILED)`).
- [ ] 2. Source Identity: The immutable identifier, cryptographic hash, or official URI of the originating document or transaction.
- [ ] 3. Evidence Span: The precise character offset or byte span `[c_start..c_end]` within the source document that contains the supporting text.
- [ ] 4. Scope Bounds: The security perimeter defining which tenant, workspace, agent, and temporal window may access this assertion.
- [ ] 5. Lifecycle State: The auditable status of the record (`COMMITTED`, `PENDING_REVIEW`, `SUPERSEDED`, or `RETRACTED`).

## Casual memory vs evidence-aware memory

The difference between casual string memory and evidence-aware memory is evident in how data is structured for execution:

```text
// Casual string memory (untraceable)
{
  "memory": "Client requested arbitration in Zurich under ICC rules."
}

// Evidence-aware memory assertion (MESA paradigm)
{
  "assertion_id": "asrt_88b14a2",
  "statement": {
    "subject": "Contract_2024_09",
    "predicate": "arbitration_clause",
    "object": "ICC_Zurich"
  },
  "source": {
    "source_id": "doc_contract_v2.pdf",
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "evidence_span": [4120, 4285],
    "quoted_text": "All disputes arising out of the present contract shall be finally settled under the Rules of Arbitration of the International Chamber of Commerce by one or more arbitrators in Zurich."
  },
  "scope": {
    "tenant_id": "tenant_legal_corp",
    "workspace_id": "matter_402",
    "valid_from": "2024-09-01T00:00:00Z"
  },
  "status": "COMMITTED"
}
```

## Why evidence awareness is mandatory in high-stakes domains

In legal, medical, regulatory, and financial operations, autonomous agents cannot ask users to 'trust' an answer. Every assertion must be auditable:

| Domain | Failure Mode of Casual Memory | Evidence-Aware Safeguard |
| --- | --- | --- |
| Legal AI | Citing non-existent precedents or superseded statutory articles | Attaches official gazette edition, article number, and verification trace (see [MESA Law](law/)) |
| Medical Decisions | Relying on outdated patient dosage instructions | Enforces temporal scope and links claim to exact clinician note timestamp |
| Financial Audits | Conflating preliminary budget estimates with approved figures | Requires signed transaction hashes and authorization scope verification |
| Multi-Tenant SaaS | Leaking private company strategy across workspace boundaries | Applies strict pre-retrieval tenant filtering to prevent cross-contamination |

## General concept vs MESA's implementation

The general concept of evidence-aware memory can be implemented across various software stacks. What matters is the architectural commitment to grounding claims in verifiable sources before recall.

In [MESA Core](mesa/), this commitment is enforced at the database level: SQLite acts as the canonical store for assertions, evidence spans, and scopes. Search projections ([LanceDB](mesa/) for vectors, [Kùzu](mesa/) for graphs) derive their entries strictly from these canonical assertions. Learn how evidence flows through the system in [How MESA Works](how-it-works/).

## References

1. [W3C PROV-DM: The PROV Data Model (W3C Recommendation 2013)](https://www.w3.org/TR/prov-dm/)
2. [MESA Core Architecture Specification](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)
3. [What Is Provenance in AI Systems? — MESA Learn](learn/what-is-provenance-in-ai/)

