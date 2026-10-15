# MESA Content Platform — Architecture and Implementation Plan
## Learn, Documentation & CMS Integration

**Prepared:** 15 October 2026 (Europe/Istanbul)  
**Status:** Architecture Approved; Implementation in Progress  
**Audited Repository:** `/home/yasin/Desktop/mesa_website/photos/site`  
**Target Branch:** `feat/content-platform-learn-docs-cms`  
**Deliverable:** `docs/plans/MESA_CONTENT_PLATFORM_PLAN.md`

---

## 1. Executive Summary

This plan defines the architectural transformation of MESA's website from a static product site with limited educational content into a **professional technical publishing platform** with:

1. **MESA Learn:** A world-class editorial knowledge hub for long-form technical articles (2,000–8,000+ words) on AI memory systems, hybrid retrieval, knowledge graphs, and legal AI.
2. **MESA Documentation:** A native, multi-repository in-website technical documentation system for MESA Core, MESA Data, MESA Law, MESA QA, and MESA E2E Certification.
3. **MESA Admin CMS:** A secure, browser-based content management interface at `/admin/` enabling authorized maintainers to draft, preview, manage revisions, and publish articles without manual JSON editing or terminal commands.
4. **Documentation Synchronization Engine:** A build-time pipeline that ingests approved Markdown documentation from allowlisted paths across the five MESA repositories, rewrites relative links, resolves images, and generates version-traceable static pages.
5. **Static Search System:** A zero-dependency, build-time client-side search index covering both Learn articles and documentation in English and Turkish.

The entire public platform remains **100% static, fast, accessible, bilingual (EN/TR), SEO-optimized, and hosted on GitHub Pages**, adhering strictly to the **Cosmic Minimalism** design system.

---

## 2. Architectural Evaluation & Decision

### 2.1 Evaluated Architecture Options

| Criterion | Option A: Static Generator + Supabase CMS (Hybrid) | Option B: Git-Backed CMS (e.g. Decap / Git Gateway) |
| :--- | :--- | :--- |
| **Security & RLS** | **Superior:** Native Supabase Auth with Row Level Security (RLS); fine-grained ADMIN vs EDITOR roles; drafts completely inaccessible to anonymous visitors; service-role keys restricted to serverless functions. | **Weak:** Relies on GitHub repo permissions or third-party OAuth proxies; hard to enforce draft isolation without granting Git write access. |
| **Maintenance & Longevity** | **Low:** Proven PostgreSQL schema, standard REST/JS SDK, no brittle Git tree commits or merge conflicts. | **High:** Complex merge conflict resolution when multiple authors edit; Git repo size bloats from revisions and binary media commits. |
| **Cost** | **Zero:** Free tier of Supabase (500MB database, 1GB storage, 50k MAU) is more than sufficient for an editorial team of 1–5 maintainers. | **Zero:** Uses GitHub storage, but requires external proxy (Cloudflare Worker / Netlify) for OAuth token exchange. |
| **GitHub Pages Compatibility**| **Perfect:** Public layer is 100% pre-rendered static HTML/CSS/JS. Anonymous visitors never make authenticated database calls. | **Perfect:** Public layer is static HTML/CSS/JS. |
| **Content Migration** | **Seamless:** Deterministic import script converts `content/hub.json` entries into database records while preserving existing URLs and JSON backups. | **Moderate:** Requires writing JSON/Markdown files to git branches. |
| **Publishing Reliability** | **High:** Publishing creates an immutable revision, records a publication job, and triggers a deterministic GitHub Actions workflow with full rollback capability. | **Moderate:** Every draft save triggers a git commit and CI build unless complex branching workflows are established. |
| **Editorial Usability** | **Exceptional:** Modern rich-text / Markdown split editor, real-time preview, autosave, unsaved changes warning, media asset manager, revision restoration. | **Basic:** Form-based editor with limited preview accuracy and sluggish git commit roundtrips. |
| **Operational Dependencies**| Decoupled: Public site has **zero** runtime dependency on Supabase. If Supabase is down, the public site remains 100% available. | Decoupled: Public site is static. |

### 2.2 Selected Architecture

**Option A (Static Generator + Supabase CMS Hybrid Architecture)** is selected as the production architecture. To guarantee maximum resilience, bounded builds, and offline developer velocity, the system includes a **deterministic local file provider & test fixture harness**. This allows full build-time generation, documentation synchronization, local content authoring, and CI verification even before production Supabase credentials are configured.

```
+----------------------------------------------------------------------------------------------------+
|                                    MESA PUBLIC LAYER (GitHub Pages)                               |
|                                                                                                    |
|   /                      /how-it-works/          /ecosystem/             /mesa/                    |
|   /data/                 /law/                   /qa/                    /certification/           |
|   /learn/                /learn/<slug>/          /docs/                  /docs/<repo>/<slug>/      |
|   /tr/...                sitemap.xml             robots.txt              search.json (Static Index)|
|                                                                                                    |
|   * 100% Static HTML / CSS / Vanilla JS                                                            |
|   * Zero runtime API/database requests for public visitors                                         |
|   * Fully bilingual (EN / TR) with paired hreflang                                                 |
|   * Sub-second load times & zero cold starts                                                       |
+----------------------------------------------------------------------------------------------------+
                                                  ^
                                                  | Static HTML Build Artifact (_site/)
                                                  |
+-------------------------------------------------+--------------------------------------------------+
|                                    BUILD & SYNC LAYER (GitHub Actions)                             |
|                                                                                                    |
|   1. Documentation Sync Engine:                                                                    |
|      - Allowlisted doc paths from MESA, MESA_Data, MESA_Law, MESA_QA, MESA_E2E_Certification       |
|      - Markdown -> Safe HTML transformation, relative link rewriting, image resolution             |
|   2. Content Ingestion:                                                                            |
|      - Reads approved published articles (from content/hub.json and/or Supabase export)            |
|   3. Static Site Generator (scripts/build_site.py + scripts/render_site.mjs):                      |
|      - Renders long-form Learn articles & hierarchical Docs pages                                  |
|      - Generates build-time static search index (dist/search-index.json)                           |
|      - Runs strict structural and link validator (scripts/check_site.py)                           |
+----------------------------------------------------------------------------------------------------+
                 ^                                                                ^
                 | Trigger: push to main                                          | Trigger: workflow_dispatch
                 |                                                                | (via Supabase Edge Function)
+----------------+-------------------------------+       +------------------------+------------------+
|        SOURCE CODE & REPOSITORIES             |       |        MESA ADMIN CMS (/admin/)          |
|                                                |       |                                          |
|  * Yasou13/MESA (Core v0.8.0)                 |       |  * Hidden route, noindex                 |
|  * Yasou13/MESA_Data                           |       |  * Supabase Auth (Admin/Editor roles)    |
|  * Yasou13/MESA_Law                            |       |  * Markdown Editor + Real-time Preview   |
|  * Yasou13/MESA_QA                             |       |  * Autosave, Revision History & Rollback |
|  * Yasou13/MESA_E2E_Certification              |       |  * Media Upload with MIME validation     |
|  * Yasou13/mesa.github.io (Website repo)       |       |  * One-click "Publish" with job status   |
+------------------------------------------------+       +------------------------------------------+
                                                                                  |
                                                                                  v
                                                         +------------------------------------------+
                                                         |       SUPABASE BACKEND SERVICES          |
                                                         |                                          |
                                                         |  * PostgreSQL Database (with RLS)        |
                                                         |  * Storage Bucket (article-media)        |
                                                         |  * Edge Function (trigger-publish)       |
                                                         +------------------------------------------+
```

---

## 3. Implementation Phases

- **Phase 1: Repository Audit & Publishing Architecture** (Completed)
  - Full inspection of existing site scripts, routes, redesign plans, and all 5 MESA repositories.
  - Creation of `feat/content-platform-learn-docs-cms` branch.
- **Phase 2: Content Schema & Migration Strategy**
  - Database schema definitions (SQL migrations) for articles, revisions, categories, tags, media, and audit events.
  - Deterministic migration script from `content/hub.json` to canonical storage format.
  - Preservation of all existing URLs, bilingual metadata, and JSON backups.
- **Phase 3: MESA Learn — Long-Form Article Engine**
  - Markdown parser & renderer supporting H1–H4, code blocks with syntax highlighting & copy buttons, tables, blockquotes, callouts, math formulas, footnotes, and diagrams.
  - Automatic table of contents with stable heading anchors.
  - Apple-inspired editorial typography, generous whitespace, reading time, and reading paths.
- **Phase 4: Multi-Repository Documentation Synchronization Engine**
  - Pipeline discovering allowlisted docs in MESA Core, Data, Law, QA, and E2E Certification.
  - Link rewriting for internal documentation routing (`/docs/core/...`, `/docs/data/...`).
  - Safe HTML conversion, image asset resolution, and broken reference detection.
  - Version & commit traceability metadata.
- **Phase 5: Learn & Docs Navigation and Static Search**
  - Hierarchical documentation sidebar with expandable section groups and active page indicators.
  - Build-time static search index generator (`search-index.json`).
  - Lightweight, accessible, keyboard-driven search modal (supporting English and Turkish).
- **Phase 6: Authentication & Authorization Model**
  - Supabase Auth integration for `/admin/`.
  - Role-based authorization policies (ADMIN vs EDITOR).
  - Row Level Security (RLS) policies preventing anonymous draft access and unauthorized mutations.
- **Phase 7: MESA Admin CMS & Article Editor**
  - Clean, high-density admin dashboard at `/admin/` (login, article list, filtering, status badges).
  - Modern split-screen Markdown editor with toolbar (formatting, code, tables, callouts, images).
  - Real-time preview sharing exact public typography tokens.
  - Autosave, unsaved change alerts, draft recovery.
- **Phase 8: Revisions, Media Management & Previews**
  - Immutable revision snapshots and one-click revision restore.
  - Media asset manager (image upload with strict MIME and size validation).
  - Private preview mode for draft articles.
- **Phase 9: Publishing Pipeline & Deployment Integration**
  - Publication state machine: Draft -> Ready to publish -> Deployment pending -> Published -> Failed.
  - Supabase Edge Function / secure build dispatcher invoking GitHub Actions `workflow_dispatch`.
  - Deployment status monitoring in CMS with safe retry and zero public disruption on failure.
- **Phase 10: SEO, Localization & Accessibility**
  - Schema.org `TechArticle` / `Article` structured data.
  - Paired hreflang tags for English and Turkish articles.
  - Sitemap.xml inclusion for published articles (excluding drafts).
  - Full keyboard navigation and screen-reader accessibility.
- **Phase 11: Security Hardening & Test Verification**
  - Validation test suite covering reading experience, documentation import, authorization, and build checks.
- **Phase 12: Release Candidate & Operational Documentation**
  - Release candidate verification and complete administrator/deployment guides.

---

## 4. Required External Credentials & Approval Checklist

Before connecting to external cloud services in Phase 9, the following external items will be needed from the project owner:

1. **Supabase Project:**
   - Supabase Project URL (`SUPABASE_URL`)
   - Supabase Anon/Public Key (`SUPABASE_ANON_KEY`)
   - Supabase Service Role Key (`SUPABASE_SERVICE_ROLE_KEY` - stored only in GitHub Secrets & Edge Functions)
2. **GitHub Personal Access Token (PAT):**
   - Fine-grained token with `actions:write` scope for triggering `workflow_dispatch` on `Yasou13/mesa.github.io`.

*Note: All core functionality (rendering, sync engine, editor UI, search, tests, and static builds) is implemented and verified locally without needing production cloud credentials.*
