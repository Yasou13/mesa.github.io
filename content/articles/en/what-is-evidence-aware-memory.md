---
id: "evidence-aware-memory"
slug: "what-is-evidence-aware-memory"
type: "learn"
language: "en"
title: "Evidence and provenance: what a citation actually proves"
subtitle: ""
summary: "Build a verifiable citation with source revision and exact span. Distinguish integrity, provenance, claim support and source truth."
shortAnswer: "Build a verifiable citation with source revision and exact span. Distinguish integrity, provenance, claim support and source truth."
category: "Evidence & Trust"
tags: ["provenance", "citation", "hash", "SHA256", "evidence", "kaynak izi", "atıf", "kanıt", "halüsinasyon"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-28"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Evidence and provenance: what a citation actually proves — MESA Learn"
seoDescription: "Build a verifiable citation with source revision and exact span. Distinguish integrity, provenance, claim support and source truth."
lessonOrder: 9
learningStage: "systems"
prerequisites: ["structured-vs-unstructured-memory"]
learningObjectives: ["Verify an evidence span against a frozen source", "Distinguish hashes from source authenticity", "Design audit records and unsupported-answer behavior"]
---

## Four checks, four different conclusions

An assistant answers “The room opens at ten on Fridays” and displays a link. A real link is only the first step. You must ask whether the source exists, whether the cited passage says what the answer claims, whether that source applies to this time and scope, and whether the source itself is trustworthy. Passing one check does not imply the others.

| Check | What success establishes | What it does not establish |
| --- | --- | --- |
| Integrity | These bytes match the recorded digest | Who wrote them or whether true |
| Provenance | A recorded derivation/ownership path | Correct extraction or honest origin |
| Support | This passage supports this claim | Source truth or current applicability |
| Applicability | Scope/time match the question | Universal correctness |

## A tiny reproducible span check

```text
text = "Atlas opens at 09:00."
start, end = 15, 20  # Unicode code points; [start, end)
assert text[start:end] == "09:00"
# A different encoding/offset convention must be declared explicitly.
```

Offsets are meaningful only against the exact source representation used when extracting them. Declare whether positions count bytes, Unicode code points or another unit, and whether the end is exclusive. Unicode normalization, PDF extraction or newline conversion can change offsets. Keep an immutable source revision and enough information to reproduce the text, then validate that the extracted span matches it.

A digest such as SHA-256 detects a mismatch relative to a trusted expected digest. An attacker can hash fabricated text just as easily as genuine text. If both text and expected digest come from the same untrusted party, equality is not proof of authenticity. Source acquisition, authenticated publisher identity and chain-of-custody records solve different parts of the problem.

## Keep the chain from answer to source

<!-- diagram: Answer claim links to assertion, exact span, source revision and acquisition record. -->
1. Answer · Friday at ten
2. Assertion · a42 + qualifiers
3. Span · exact supporting text
4. Revision · handbook-r3
5. Origin · acquisition record

*A citation should let a reviewer inspect the evidence without reconstructing the pipeline.*

Keep the source quote narrow enough to inspect, but include the qualifying sentence when necessary. “Open at ten” without “Fridays after 1 November” is insufficient support for a question about October. Mark unsupported parts of a multi-claim answer instead of attaching one citation to the entire paragraph and assuming it covers every sentence.

## Log decisions without duplicating private data

For a retrieval decision, record request/run ID, caller scope identifier, source generation, candidate IDs, filtering reasons and final evidence IDs. Prefer references over copying entire private documents into logs. Keep sensitive values out of exception messages. An audit record must itself have access control, retention and deletion rules; “log everything” creates another uncontrolled memory store.

If no eligible source supports the answer, return a clear evidence gap or ask a narrower question. Citation formatting and retrieval grounding can reduce some unsupported outputs, but cannot eliminate hallucinations. W3C PROV supplies a vocabulary for derivation; OWASP explains why retrieved material must remain untrusted as instructions. These are complementary concerns. [PROV](https://www.w3.org/TR/prov-overview/), [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

## Test the claim, not the link

> [!EXERCISE]
> **Check your understanding**
> A document and SHA-256 digest match, but the document was uploaded by an unknown user. What can you conclude?
>
> **Answer:** Only that the supplied bytes match that digest under the declared procedure. You still need origin/authenticity assessment and a separate check that the passage supports the answer. A checksum does not certify source truth.

## Sources and further reading

1. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
2. [OWASP · LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
3. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

