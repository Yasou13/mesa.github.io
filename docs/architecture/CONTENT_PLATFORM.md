# MESA Content Platform Architecture
**Authoritative Architectural Specification for MESA Learn, Native Documentation, and CMS**

---

## 1. Executive Summary & Core Philosophy

The MESA Content Platform transforms the MESA web presence from a product showcase with static documentation links into an authoritative, source-backed technical publishing platform.

### Core Architectural Axioms
1. **Strict Separation of Public Reading and Private Administration**:
   - The public website is **100% static HTML, CSS, and lightweight vanilla JavaScript**.
   - Public readers **never** make authenticated or unauthenticated queries to an active database.
   - GitHub Pages serves all Learn articles, documentation pages, and search indexes with zero cold starts, zero latency, and maximum CDN cacheability.
2. **Zero Runtime Framework Dependencies**:
   - Built with vanilla CSS, semantic HTML5, and Node.js / Python build tooling.
   - Preserves MESA's Cosmic Minimalism design language without React, Next.js, or heavyweight runtime frameworks.
3. **Multi-Repository Source of Truth**:
   - Documentation for all five MESA repositories (`MESA` Core, `MESA_Data`, `MESA_Law`, `MESA_QA`, `MESA_E2E_Certification`) is authored in upstream repositories and synchronized deterministically at build time.
4. **Browser-Based Editorial Independence**:
   - Maintainers can draft, preview, edit, revise, and publish technical publications directly from the browser at `/admin/` without editing raw JSON or pushing manual git commits for routine content updates.

---

## 2. Architecture Diagram

```
                                  +------------------------------------+
                                  |     MESA Ecosystem GitHub Repos     |
                                  | Core | Data | Law | QA | E2E Cert  |
                                  +-----------------+------------------+
                                                    | (Build-time sync)
                                                    v
+-----------------------+                 +--------------------+
|  Editor / Admin       |                 |  scripts/sync_docs |
|  Browser at /admin/   |                 +---------+----------+
+-----------+-----------+                           |
            |                                       v
            | (Supabase Auth / RLS)       +--------------------+
            v                             | content/docs/      |
+-----------------------+                 | manifest.json      |
|  Supabase Backend     |                 +---------+----------+
|  - PostgreSQL DB      |                           |
|  - Storage (Media)    |                           |
|  - Auth (RBAC)        |                           |
+-----------+-----------+                           |
            |                                       |
            | (Publish Job Trigger)                 |
            v                                       v
+-----------------------+                 +--------------------+
| GitHub Actions CI/CD  | <---------------+ scripts/render_site|
| - pages.yml           |                 +---------+----------+
| - check_site.py       |                           |
+-----------+-----------+                           |
            |                                       | (Generate static HTML)
            v                                       v
+--------------------------------------------------------------+
|                     GitHub Pages Edge CDN                    |
|             https://yasou13.github.io/mesa.github.io/        |
|                                                              |
|   /learn/                      /docs/                /admin/ |
|   - Long-form articles         - Core Docs           - CMS   |
|   - Reading paths & taxonomy   - Data, Law, QA, E2E  - Auth  |
|   /tr/learn/                   /tr/docs/                     |
|   - Bilingual mirrors          - Turkish docs                |
|   search-index.json                                          |
+--------------------------------------------------------------+
```

---

## 3. Logical Entities & PostgreSQL Schema

The CMS editorial database utilizes Supabase PostgreSQL, structured to mirror the static site generator's content model while providing version history and audit trails.

### 3.1 Schema Definition (`supabase/migrations/20261015000000_content_platform_schema.sql`)

- **`editor_roles`**: Maps Supabase `auth.users` to `ADMIN`, `EDITOR`, or `READER`. Controls administrative panel access.
- **`categories` & `tags`**: Taxonomy clusters aligned with MESA's cognitive architecture (AI Fundamentals, Memory Systems, Vector Databases, Knowledge Graphs, Retrieval Systems, RAG, Legal AI, Methodology).
- **`articles`**: Canonical content record containing:
  - `id` (UUID, primary key)
  - `slug` (Unique per language, e.g. `what-is-ai-memory`)
  - `title`, `description`, `body_markdown`
  - `language` (`en` or `tr`)
  - `translation_group_id` (Links EN and TR pairs)
  - `category`, `reading_minutes`, `difficulty`
  - `author_name`, `cover_image_url`
  - `status` (`draft`, `ready_to_publish`, `published`, `unpublished`, `archived`)
  - `published_at`, `current_revision`
- **`article_revisions`**: Immutable revision ledger. Every save creates an incremental revision snapshot (`revision_number`, `body_markdown`, `metadata_snapshot`, `created_by`), enabling one-click rollbacks.
- **`media_assets`**: Tracks uploaded cover images, technical diagrams, and inline assets stored in Supabase Storage buckets.
- **`publication_jobs`**: Asynchronous dispatch queue tracking static build triggers, GitHub Actions workflow run IDs, deployment status, and error logs.
- **`audit_events`**: Immutable compliance log recording user ID, action (`publish`, `rollback`, `role_change`), entity target, and timestamp.

---

## 4. Bilingual Model & Localized URLs

1. **Path Symmetry**:
   - English: `/learn/<slug>/`, `/docs/<repo>/<slug>/`
   - Turkish: `/tr/learn/<slug>/`, `/tr/docs/<repo>/<slug>/`
2. **Translation Linking (`translation_group_id`)**:
   - When an article exists in both languages, both records share the same `translation_group_id`.
   - The static site generator outputs bilateral `<link rel="alternate" hreflang="en" href="...">` and `<link rel="alternate" hreflang="tr" href="...">` headers.
   - If an article is published only in English, no Turkish alternate is emitted and no artificial translation is generated.
3. **Locale-Aware Base Resolution**:
   - Both English and Turkish doc pages compute their relative links deterministically based on their URL depth (`relativeBase(routePath)`).
   - Internal links inside markdown resolve dynamically to stay within the active language namespace.

---

## 5. Performance Budget & Caching

| Metric | Target | Verification Method |
| :--- | :--- | :--- |
| **Public Page TTFB** | < 100ms (Edge CDN) | GitHub Pages CDN distribution |
| **Public JavaScript** | < 12 KB gzipped (`dist/app.js`) | Plain vanilla JS, zero bundle overhead |
| **Search Index Size** | < 25 KB gzipped | Build-time client-side inverted index |
| **Full Site Build Time** | < 3.5 seconds for 150+ pages | `scripts/build_site.py` execution gate |
| **SEO Audit** | 100% clean check | `scripts/check_site.py` validation gate |
