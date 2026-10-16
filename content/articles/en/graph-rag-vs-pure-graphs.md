---
id: "graph-rag-vs-pure-graphs"
slug: "graph-rag-vs-pure-graphs"
type: "learn"
language: "en"
title: "GraphRAG vs pure knowledge graphs in AI memory"
subtitle: "Comparing hierarchical community summaries with deterministic relational graph traversals"
summary: "GraphRAG clusters text into hierarchical communities for global theme extraction, while pure knowledge graphs represent typed assertions and exact multi-hop entity relations."
shortAnswer: "GraphRAG answers global corpus-level queries through pre-computed summaries; pure knowledge graphs answer precise relational questions through deterministic topological traversals."
category: "Memory & Retrieval"
tags: ["graph-rag", "knowledge-graph", "retrieval", "ai-memory"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "GraphRAG vs pure knowledge graphs in AI memory — MESA Learn"
seoDescription: "GraphRAG clusters text into hierarchical communities for global theme extraction, while pure knowledge graphs represent typed assertions and exact multi-ho"
---

## Two distinct graph philosophies

When structuring agent memory around graphs, two major approaches have emerged: LLM-synthesized community summaries (GraphRAG) and explicit typed assertion topologies (pure knowledge graphs).

> [!WARNING]
> **The Granularity Trade-off**
> GraphRAG summarizes document communities into lossy textual clusters, making it ideal for answering 'What are the main themes across all documents?'. Pure knowledge graphs preserve exact entity triples, making them mandatory when determining whether Person A signed Contract B.

## Engineering trade-offs side-by-side

| Dimension | GraphRAG (Community Summaries) | Pure Knowledge Graphs (Typed Triples) |
| --- | --- | --- |
| Primary Query Type | Global corpus sense-making and thematic discovery | Deterministic entity traversals and multi-hop paths |
| Ingestion Cost | Very high: requires extensive LLM community summarization | Moderate: requires entity-relation extraction and schema validation |
| Query Determinism | Probabilistic: combines LLM summaries of clusters | Deterministic: exact Cypher/SPARQL path traversal |
| Contradiction Handling | Weak: conflicting claims coexist in text summaries | Strong: primary keys, revision links, and retraction states |
| Auditability | Low: claims are blended into synthesized summaries | Complete: every edge maps to a canonical evidence span |

## Hierarchical clustering vs explicit graph topology

GraphRAG partitions graph nodes into hierarchical communities using algorithms such as Leiden clustering. Each community is then summarized by an LLM into an executive brief. In contrast, pure knowledge graphs maintain explicit graph schemas where nodes represent typed entities and edges represent verified predicates.

```text
// Pure Knowledge Graph: Exact Cypher multi-hop query
MATCH (p:Person {name: 'Alice'})-[:OFFICER_OF]->(c:Company)-[:SUBSIDIARY_OF]->(t:Target)
RETURN p, c, t;
```

## MESA's deterministic graph projection

In MESA Core, graphs are not opaque LLM summaries. Canonical memory records typed assertions in SQLite with verified evidence spans, which are then projected into Kùzu for zero-copy, embedded multi-hop graph analytics.

- [ ] Canonical assertions store explicit Subject-Predicate-Object triples.
- [ ] Graph edges inherit exact source document hashes and character offsets.
- [ ] Projections recompute deterministically if graph storage is cleared.
- [ ] Scope and tenancy boundaries are enforced before graph path expansion.

## References

1. [Edge et al. (2024) — From Local to Global: A Graph RAG Approach to Query-Focused Summarization (Microsoft Research)](https://arxiv.org/abs/2404.16130)
2. [Hogan et al. (2021) — Knowledge Graphs (ACM Computing Surveys)](https://dl.acm.org/doi/10.1145/3447772)

