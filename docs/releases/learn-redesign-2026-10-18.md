# Learn editorial and navigation redesign — 18 October 2026

The Learn catalogue has been rewritten as 14 bilingual lessons in four ordered
stages. Eighteen overlapping publications are merged into maintained lessons.
Every lesson includes prerequisites/objectives, a worked example or concrete case,
an accessible diagram, an answered exercise and relevant primary references.

The course corrects the static-RAG/dynamic-memory false dichotomy, separates
similarity and RRF scores from probability, distinguishes hashes from authenticity,
and treats graph paths, model agreement and citations as inspectable evidence
rather than truth guarantees. General instructional designs are explicitly
separate from MESA Core v0.8.1 runtime support.

## Navigation and delivery

- A connected beginner map, four stage filters, complete lesson text search and
  direct links to matching sections.
- Desktop course/section sidebars; expandable mobile navigation; ordered previous
  and next lessons and prerequisite links.
- Browser-local read progress and resume, with graceful storage failure handling.
- Plain Markdown downloads with objectives/prerequisites and EN/TR course indexes.
- Global search ranks title/keyword matches and searches lesson bodies as well.
- Canonical noindex redirects keep retired URLs usable without indexing duplicates.
- Static reading, diagrams, exercises and lesson navigation work without JavaScript.

## Consolidation map

| Retired route | Maintained lesson |
| --- | --- |
| `learn/session-state-vs-durable-memory/` | `learn/what-is-ai-memory/` |
| `learn/why-vector-search-alone-is-not-enough/` | `learn/semantic-search/` |
| `learn/dense-vs-sparse-embeddings/` | `learn/semantic-search/` |
| `learn/lancedb-vector-indexing-patterns/` | `learn/sqlite-as-canonical-agent-memory/` |
| `learn/graph-rag-vs-pure-graphs/` | `learn/why-graphs-matter-in-ai-memory/` |
| `learn/multi-hop-reasoning-over-knowledge-graphs/` | `learn/why-graphs-matter-in-ai-memory/` |
| `learn/kuzu-graph-storage-projections/` | `learn/why-graphs-matter-in-ai-memory/` |
| `learn/what-is-provenance-in-ai/` | `learn/what-is-evidence-aware-memory/` |
| `learn/cryptographic-evidence-spans/` | `learn/what-is-evidence-aware-memory/` |
| `learn/hallucination-mitigation-via-evidence/` | `learn/what-is-evidence-aware-memory/` |
| `learn/audit-logging-in-production-ai/` | `learn/what-is-evidence-aware-memory/` |
| `learn/role-based-access-control-in-memory/` | `learn/memory-scope-and-authorization/` |
| `learn/multi-agent-shared-memory-protocols/` | `learn/memory-scope-and-authorization/` |
| `learn/contradiction-detection-in-memory/` | `learn/temporal-decay-in-ai-memory/` |
| `learn/legal-statute-invalidation-pipelines/` | `learn/temporal-decay-in-ai-memory/` |
| `learn/reranking-strategies-for-agent-memory/` | `learn/hybrid-retrieval-explained/` |
| `learn/benchmarking-retrieval-latency/` | `learn/evaluating-ndcg-and-mrr-in-memory/` |
| `learn/synthetic-query-generation-for-benchmarks/` | `learn/evaluating-ndcg-and-mrr-in-memory/` |

## Validation

- All Python and Node regression tests passed, including real SQLite/FTS5 lab
  execution, the source-span and arithmetic examples and exercise Markdown roundtrip.
- 90 browser layout checks cover the index and every lesson, both languages, at
  320/768/1440 px. No document overflow, broken images or browser runtime errors.
- 36 old localized URLs redirect to the expected canonical lesson.
- Browser tests cover stage filters, section search, Turkish unaccented queries,
  global search deep links, read/resume state, answered exercises and no-JS reading.
- Four targeted WCAG A/AA automated checks reported no violations.
- Natural beginner queries such as “embedding nedir” and “BM25 nasıl hesaplanır”
  resolve to the expected lesson and section.
- Public-artifact secret scanning and static route/link checks passed.

This is educational content and interface validation. It adds no runtime quality,
production-capacity or production-certification claim for MESA Core.
