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

## Learning course and consolidation

The published Learn course is defined in `content/learn-curriculum.json`. Its
14 lessons follow four stages: foundations, retrieval, trustworthy systems and
practice. Prerequisites must refer to earlier published lessons. Course order,
learning objectives and prerequisites live in the hub/curriculum model; Markdown
frontmatter exports a snapshot for readers and downstream tools.

All Learn articles require substantive explanation, a worked example or concrete
case, an accessible diagram, an exercise with an explanation, and at least two
relevant primary references. A list of links alone is not source-backed teaching.
Explain which source supports the concept; label original illustrative examples.
Verify executable code and arithmetic and keep general concepts distinct from
MESA's implemented contracts.

Before adding an article, check whether it belongs in an existing lesson. The
`redirects` array records 18 merged routes and their maintained lesson IDs. These
routes render noindex redirects with the new canonical target; they are excluded
from search and the sitemap. Remove the retired Markdown files and repair related
IDs instead of leaving duplicate publications.

Each published lesson exports `article.md` next to its HTML route. `/learn/index.md`
and `/tr/learn/index.md` list these readable Markdown sources. Search indexes the
actual lesson sections and links directly to matching anchors. Core documentation,
Research, Guides, Glossary and Methodology retain their own publication models.

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
