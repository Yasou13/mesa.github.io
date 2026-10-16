# MESA Articles Authoring & Synchronization Guide

This directory (`content/articles/`) contains the canonical, human-editable Markdown representations of all articles in the MESA Knowledge & Learn Hub, organized by locale (`en/` and `tr/`).

## The Tri-Source Content Architecture

Articles in MESA exist across three synchronized representations:

1. **`content/hub.json`**: Compiled JSON database consumed by `scripts/render_site.mjs` to generate the static site, search index, sitemaps, and RSS feeds.
2. **`content/articles/{en,tr}/*.md`**: Human-readable, version-controlled Markdown files with YAML frontmatter.
3. **`supabase/seed.sql`**: Deterministic database seed for the Supabase CMS and admin interface.

All three sources are kept in **strict 1:1 synchronization** by automated validation in CI.

---

## Authoring & Editing Workflow

### Editing Existing Articles

You can edit any `.md` file directly in your editor. When finished, compile your changes back into `content/hub.json` and `supabase/seed.sql`:

```bash
# Compile Markdown edits into content/hub.json and supabase/seed.sql
python3 scripts/sync_articles.py --from-markdown

# Validate that all 3 sources match 100%
python3 scripts/sync_articles.py --check
```

### Editing via `content/hub.json`

If you modify `content/hub.json` directly:

```bash
# Regenerate Markdown articles and supabase/seed.sql from hub.json
python3 scripts/sync_articles.py --from-hub

# Validate consistency
python3 scripts/sync_articles.py --check
```

### Checking Synchronization in CI

CI automatically verifies synchronization on every pull request and push:

```bash
python3 scripts/sync_articles.py --check
```

If any file is edited without recompilation, the check will fail with exact file diffs and instructions.

---

## Slug vs ID Mapping

Each article has both a **canonical ID** (internal database identifier used for cross-references and relationships) and a **URL slug** (used for clean web URLs and file naming).

The Markdown filename always corresponds to `{slug}.md`. The YAML frontmatter contains both `id` and `slug`.

| Internal ID | URL Slug / Filename (`.md`) | Canonical Route |
| :--- | :--- | :--- |
| `semantic-search` | `semantic-search.md` | `/learn/semantic-search/` |
| `what-is-ai-memory` | `what-is-ai-memory.md` | `/learn/what-is-ai-memory/` |
| `rag-vs-ai-memory` | `rag-vs-ai-memory.md` | `/learn/rag-vs-ai-memory/` |
| `structured-vs-unstructured-memory` | `structured-vs-unstructured-memory.md` | `/learn/structured-vs-unstructured-memory/` |
| `vector-search-limits` | `why-vector-search-alone-is-not-enough.md` | `/learn/why-vector-search-alone-is-not-enough/` |
| `hybrid-retrieval` | `hybrid-retrieval-explained.md` | `/learn/hybrid-retrieval-explained/` |
| `why-graphs-matter` | `why-graphs-matter-in-ai-memory.md` | `/learn/why-graphs-matter-in-ai-memory/` |
| `reciprocal-rank-fusion` | `reciprocal-rank-fusion-explained.md` | `/learn/reciprocal-rank-fusion-explained/` |
| `evidence-aware-memory` | `what-is-evidence-aware-memory.md` | `/learn/what-is-evidence-aware-memory/` |
| `provenance-in-ai` | `what-is-provenance-in-ai.md` | `/learn/what-is-provenance-in-ai/` |
| `memory-scope-and-authorization` | `memory-scope-and-authorization.md` | `/learn/memory-scope-and-authorization/` |
| `keyword-semantic-protocol` | `keyword-vs-semantic-search.md` | `/research/keyword-vs-semantic-search/` |
| `verify-ai-yargitay` | `verify-ai-yargitay-decision.md` | `/guides/verify-ai-yargitay-decision/` |
| `provenance` | `provenance.md` | `/glossary/provenance/` |
| `retrieval-evaluation` | `retrieval-evaluation.md` | `/methodology/retrieval-evaluation/` |

---

## Frontmatter Schema

Each Markdown file starts with a YAML header:

```yaml
---
id: "vector-search-limits"
slug: "why-vector-search-alone-is-not-enough"
type: "learn"
language: "en"
title: "Why vector search alone is not enough for agent memory"
subtitle: "Analyzing semantic similarity strengths and boundaries in stateful AI systems"
summary: "Vector search excels at conceptual similarity over unstructured text, but..."
shortAnswer: "Dense vector search is powerful for semantic recall, but..."
category: "Memory & Retrieval"
tags: ["vector-search", "embeddings", "retrieval", "search-limits"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-01"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Why Vector Search Alone Is Not Enough for Agent Memory — MESA Learn"
seoDescription: "Analyze semantic similarity strengths and boundaries in agent memory..."
---
```
