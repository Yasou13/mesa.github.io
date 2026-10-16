---
id: "cryptographic-evidence-spans"
slug: "cryptographic-evidence-spans"
type: "learn"
language: "en"
title: "Content-addressed storage and cryptographic evidence spans"
subtitle: "Binding factual memory assertions to immutable document byte offsets"
summary: "Evidence-aware AI memory binds every factual proposition to content-addressed document hashes and exact byte spans, making factual citations verifiable and tamper-evident."
shortAnswer: "Cryptographic evidence spans tie assertions to exact character ranges in SHA-256 hashed source documents, preventing phantom citations."
category: "Evidence & Trust"
tags: ["content-addressing", "sha256", "evidence-spans", "integrity"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Content-addressed storage and cryptographic evidence spans — MESA Learn"
seoDescription: "Evidence-aware AI memory binds every factual proposition to content-addressed document hashes and exact byte spans, making factual citations verifiable and"
---

## The detached citation vulnerability

Standard conversational systems cite file names or URLs that change over time: 'See contract_v2.pdf'. If the file is modified on disk or the web page updates, the citation becomes detached from the actual text the model observed.

> [!WARNING]
> **The Shifting Ground Truth Hazard**
> In regulated legal or medical workflows, claiming an answer was derived from a document whose contents have shifted makes independent retrospective audit impossible.

## Engineering trade-offs side-by-side

| Binding Method | Integrity Level | Granularity | Audit Verification |
| --- | --- | --- | --- |
| URL Pointer | Low: URL contents can mutate without notice | Entire web page / document | Manual human web browsing |
| File Path | Low: files can be overwritten on disk | Entire document file | Fragile: depends on file system stability |
| Document Hash (SHA-256) | High: document content is cryptographically immutable | Entire document | Verifiable by hashing original file |
| Content Hash + Byte Span | Highest: anchors exact character offset [start..end] | Exact sentence or paragraph span | Deterministic mathematical verification |

## Character offset anchoring and verification mathematics

An evidence span record anchors a factual proposition to an exact byte interval: `doc_sha256:span[c_start, c_end]`. During an audit, an automated checker fetches the original document by its hash, slices the bytes at `[c_start..c_end]`, and verifies that the text matches the recorded evidence quote.

```text
// Content-addressed evidence span record
{
  "document_hash": "a3f892bc...33e1",
  "char_start": 4520,
  "char_end": 4780,
  "quoted_text": "The governing law of this agreement shall be the laws of the Republic of Turkey.",
  "verified_at": "2026-10-17T00:00:00Z"
}
```

## Evidence spans in MESA architecture

In MESA Data and Core, raw official legal texts are preserved as immutable byte bedrock. Every assertion in SQLite maps to a verified evidence span. Frontends highlight the exact authoritative text in the official gazette when users inspect a claim.

- [ ] Source documents are indexed by SHA-256 content hashes.
- [ ] Evidence spans record exact unicode character offsets [start..end].
- [ ] Automated CI pipelines verify that evidence spans match raw source text.
- [ ] No assertion can be admitted to memory without an anchored evidence span.

## References

1. [W3C PROV-DM: The PROV Data Model (2013)](https://www.w3.org/TR/prov-dm/)
2. [MESA Data Ground Truth and Ingestion Specification](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)

