---
id: "why-mesa-removed-its-graph-store"
slug: "why-mesa-removed-its-graph-store"
type: "research"
language: "en"
title: "Why MESA Removed Its Graph Store"
subtitle: "What the graph lane added on the benchmark dev questions"
summary: "MESA 0.9.5 removed its graph database. In our dev measurements graph search never found a correct passage that the other lanes missed, turning it off lost no question, and a citation-following replacement lowered Hit@1."
shortAnswer: ""
category: "Retrieval Evaluation"
tags: ["graph", "ablation", "architecture", "release"]
author: "MESA contributors"
publishedAt: "2026-11-24"
updatedAt: "2026-11-24"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Why MESA Removed Its Graph Store"
seoDescription: "MESA 0.9.5 removed its graph database after dev measurements: turning the graph off lost no question and a citation-following lane lowered Hit@1."
---

## What did 0.9.5 remove?

MESA Core 0.9.5 removed the Kùzu graph database, the worker that wrote graph projections, the graph search lane and the graph rebuild paths. The four Kùzu modules in `mesa_storage` alone were 2,610 lines. Search now uses BM25, vector search when an embedding model is set, the built-in legal rules and an optional reranker. Entities, assertions and legal citations stay in SQLite with their sources.

The graph had already been off by default since 0.9.4. This post explains the measurements behind that default and the removal.

## Did the graph find anything the other lanes missed?

No. With model extraction off, which is the default, the graph held a simple document → chunk structure. A Round 21 review of 0.9.3 re-scored the benchmark v1 dev results: the graph lane found the correct passage first and alone for 0 of 85 answerable questions, in both the models-off (T0) and embedding (T1b) runs.

## What happened when we turned it off?

We turned each lane off on the shared benchmark v2 dev store (Tier M, 141 documents, 5,041 chunks, 128 questions of which 112 are answerable, models off, a 0.9.4 development build with prefix BM25). The starting point was 52 of 112 questions with the correct passage in the top five.

| Change from the 52-hit baseline | Hit@5 (of 112) |
| --- | --- |
| Assertion fusion weight 0 | 56 |
| Graph off | 52 |
| Both | 61 |

Turning the graph off lost no question. Together with the zero assertion weight, it became the 0.9.4 default.

## Could citations replace the graph?

Legal documents cite each other, so we tested the obvious replacement in Round 23: take the top 20 fused results, follow the statute and article citations already stored for them, and rank the cited in-scope articles as a separate lane. The rule was to keep it only if Hit@5 gained at least two questions and no category lost more than one.

| Citation lane weight | Hit@1 | Hit@5 | MRR |
| --- | --- | --- | --- |
| 0 (off) | 30 | 62 | 0.3958 |
| 0.5 | 28 | 62 | 0.3828 |
| 1 | 20 | 60 | 0.3313 |
| 2 | 20 | 60 | 0.3304 |

Same store and split as above, models off, at the Round 23 development commit. Following citations pulled frequently cited articles ahead of the passage that answered the question. The lane, its setting and its tests were deleted in the same unit.

## What does this mean for you?

- If you upgrade, the migration clears the old graph bookkeeping rows. Old `kuzu_db` files are ignored; delete them by hand after checking your backup.
- `MESA_GRAPH_ENABLED`, `MESA_RRF_GRAPH_WEIGHT` and `MESA_V4_GRAPH_TIMEOUT_SECONDS` are ignored with one startup warning each.
- The package now installs on Python 3.14, because Kùzu was the dependency that had no wheel there.

See [graph store removed](/docs/core/graph/) for the upgrade note.

## Limits of these measurements

- All numbers are dev-split results; the held-out test split was not used for these decisions.
- The v1 re-scoring and the v2 ablation used different question sets and builds.
- The graph had no extracted relations by default. A graph built from model-extracted relations was not tested, because model extraction is off by default and earlier measurements showed it lowered quality.
- These results describe this corpus of Turkish legal texts; another corpus with rich typed relations could behave differently.

## Sources

1. [MESA Core 0.9.5 changelog](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/CHANGELOG.md#095---2026-11-24)
2. [MESA Core 0.9.4 changelog: graph off by default](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/CHANGELOG.md#094---2026-11-23)

