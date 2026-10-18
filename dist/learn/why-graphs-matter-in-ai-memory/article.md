---
id: "why-graphs-matter"
slug: "why-graphs-matter-in-ai-memory"
type: "learn"
language: "en"
title: "Knowledge graphs: follow relations without inventing proof"
subtitle: ""
summary: "Build a source-linked graph, trace a two-hop question, and distinguish graph traversal from GraphRAG summaries and valid inference."
shortAnswer: "Build a source-linked graph, trace a two-hop question, and distinguish graph traversal from GraphRAG summaries and valid inference."
category: "Memory & Retrieval"
tags: ["graph", "GraphRAG", "multi hop", "Kuzu", "knowledge graph", "çizge", "ilişki"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Knowledge graphs: follow relations without inventing proof — MESA Learn"
seoDescription: "Build a source-linked graph, trace a two-hop question, and distinguish graph traversal from GraphRAG summaries and valid inference."
lessonOrder: 8
learningStage: "retrieval"
prerequisites: ["structured-vs-unstructured-memory", "hybrid-retrieval"]
learningObjectives: ["Model entities and qualified relationships", "Trace a bounded two-hop query", "Identify when a graph path does not support an answer"]
---

## A relationship needs identity and evidence

A text search finds passages. A graph query follows explicitly represented relationships. For the fictional Atlas archive, create nodes for the reading room, archive and district, then edges for “part of” and “located in”. Use stable node IDs and link each asserted edge to the source revision that supports it. A label such as “Central” is not enough to resolve identity.

```text
room-7 --part_of [evidence: handbook-r3/c4]--> archive-2
archive-2 --located_in [evidence: directory-r1/c2]--> district-5
room-7 --opening_time [day: Friday; from: Nov 1]--> 10:00
```

Relations carry direction and type. “A manages B” is not “B manages A”; “cites” is not “agrees with”. Keep time, scope and uncertainty when they change the relationship. If a source mentions two names in one paragraph, that alone does not establish a meaningful edge between them. Co-occurrence can be a discovery signal, not a verified relationship.

## Work through a two-hop question

Ask “Which district contains the archive that owns room 7?” Resolve room 7, follow `part_of` to archive 2, then `located_in` to district 5. Return both edge IDs and source references. The evidence chain is inspectable because each hop has a declared meaning. If either source is inaccessible, stale or ambiguous, the complete answer is not supported for that caller.

<!-- diagram: A reading room links to its archive, then its district; each hop retains source identity. -->
1. Resolve · room-7
2. Hop 1 · part_of
3. Archive · archive-2
4. Hop 2 · located_in
5. Answer · district-5 + 2 sources

*Two edges form a supported chain only if both relations and scopes are valid.*

## A path is not automatically an inference rule

Suppose A cites B and B cites C. You can say there is a two-edge citation path from A to C. You cannot conclude that A agrees with C, that C is correct or even that A directly cited C. A valid inference needs a rule whose meaning permits composition. Distinguish a retrieved path from a proposition actually established by that path.

Likewise, graph centrality measures connectivity under a chosen definition. A popular node may be frequently cited and wrong. Do not use PageRank as a truth score or allow it to suppress an inconvenient source without an explicit policy. Source quality, relevance and graph prominence answer different questions.

## Bound cost and recognize incompleteness

With average branching factor 10, exploring three hops can examine roughly 10 + 100 + 1,000 neighbors before deduplication. A hub can make this much worse. Set seed count, hop depth, per-node fan-out, total edge budget and timeout. A bounded search may miss valid paths; report truncation rather than claiming no relationship exists. Cache keys must include access scope and source generation.

GraphRAG is a family of retrieval-augmented approaches using graph information. Edge et al. describe graph-derived community summaries for corpus-level questions. That is different from returning raw paths for a local question. Summary generation introduces another derived artifact whose source coverage and update policy must be evaluated. Storing edges in a graph database does not by itself implement that research method. [GraphRAG paper](https://arxiv.org/abs/2404.16130).

## Separate connection from support

> [!EXERCISE]
> **Check your understanding**
> A cites B, B criticizes C. Can the assistant report “A supports C” because a graph path exists?
>
> **Answer:** No. Return the typed path if relevant and inspect source passages. The relation types do not compose into support. A graph exposes a chain to review; it does not invent its logical meaning.

## Sources and further reading

1. [Edge et al. · From Local to Global: A Graph RAG Approach](https://arxiv.org/abs/2404.16130)
2. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

