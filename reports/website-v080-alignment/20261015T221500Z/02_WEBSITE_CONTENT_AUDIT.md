# 02 — Website Content Audit

**Run ID:** `20261015T221500Z`  
**Execution Timestamp:** 2026-10-15T22:26:30+03:00  
**Target Baseline:** MESA Core v0.8.0  
**Repository Inspected:** `/home/yasin/Desktop/mesa_website/photos/site`  

---

## 1. Audit Overview

A comprehensive audit was performed across all 15 core site pages, the 7 hub section indexes, and the 15 educational articles in both English and Turkish.

Total routes audited: **74 localized routes** (37 English, 37 Turkish) plus `404.html`.

---

## 2. Findings by Category

### A. Version and Release Status Staleness
- **Finding:** `site-data.json` had `"version": "0.7.1"` and `"statusAsOf": "2026-10-01"`.
- **Impact:** The footer note, status strip, development note on `/about/`, and status cards on `/status/` reflected outdated v0.7.1 metadata.
- **Resolution:** Updated `site-data.json` to `"version": "0.8.0"`, `"statusAsOf": "2026-10-15"`, and added synchronized Turkish translations in `content/tr.json`.

### B. Missing Architectural Advancements of v0.8.0
- **Finding:** The site documentation previously omitted several major capabilities introduced in v0.8.0:
  1. *Typed Legal Retrieval Identity:* Provenance-bound `legal_identity` (`law_id`, `statute_code`, `article_id`) and rejection of free-form `_mesa_*` caller keys.
  2. *Bounded Adaptive Context Retrieval:* Single-query default, opt-in adaptive mode running Q0 first, at most 1 reformulation for weak results (up to 2 queries), fused with Q0=1.0, Q1=0.5, Q2=0.5.
  3. *Selectable Validation Policy:* `MESA_TIER3_MODE` (Mode 0: deterministic-only, Mode 1: single LLM, Mode 2: dual LLM).
  4. *Durable Projection Rebuild:* `mesa-v4-rebuild` runner, append-only operation events, fenced leases, generation rollback.
  5. *SQLite Durability:* Canonical production connections enforcing `synchronous=FULL`.
- **Resolution:** Added explicit documentation coverage and direct source links on `/docs/`, `/mesa/`, and `/status/`.

### C. Documentation Hub (`/docs/`) Completeness
- **Finding:** The Documentation Hub only listed a fraction of available guides, omitting the new v0.8.0 Migration Guide, v0.8.0 Release Notes, CLI Reference, Configuration Reference, Concepts & Ingestion, and Troubleshooting guides.
- **Resolution:** Re-organized `/docs/` into 7 comprehensive categories with direct links to all canonical guides.

### D. Status & Trust Truthfulness (`/status/` & `/evaluation/`)
- **Finding:** The site previously lacked a direct link to the official v0.8.0 Release Notes and Migration Guide from the Status page.
- **Resolution:** Added direct links to `docs/release-notes-v0.8.0.md` and `docs/migration-v0.8.0.md` on `/status/`. Preserved the explicit truth that Profile B certification remains **BLOCKED** and production status is **NO-GO**.

### E. Educational Articles (`/learn/`, `/research/`, `/guides/`)
- **Finding:** Hub articles (`content/hub.json`) accurately explain foundational concepts (RRF, vector limits, hybrid retrieval, provenance, graph paths, memory scope). Formulas match MESA Core code ($RRF(c) = \sum \frac{w}{k + r}$, $k=60$).
- **Resolution:** Validated that no hub articles claim unverified benchmark numbers or false accuracy scores.

---

## 3. Page-by-Page Audit Summary

| Page Route | Primary Role | Audit Finding | Action Taken |
|---|---|---|---|
| `/` (`home`) | Value proposition, problem, fixture, lifecycle, ecosystem, explore | Stale version v0.7.1 in footer and development aside | Updated to v0.8.0 (date 2026-10-15); verified fixture link |
| `/mesa/` | Technical Architecture | Lacked explicit v0.8.0 operation details | Added comprehensive v0.8.0 architecture links & updated version badge |
| `/how-it-works/` | Public flow & verified fixture | Accurately describes 6 steps & 4 origins | Kept verified fixture; aligned with v0.8.0 |
| `/docs/` | Documentation Hub | Missing several v0.8.0 canonical guides | Added Getting Started, Concepts, Retrieval, CLI, Migration, Release Notes |
| `/docs/mcp/` | Model Context Protocol | Accurate distinction between V3 stdio and V4 gateway | Aligned with v0.8.0 MCP specification |
| `/status/` | Project Release & Certification Status | Stale v0.7.1 package version | Updated to v0.8.0; added v0.8.0 Release Notes link; preserved NO-GO |
| `/ecosystem/` | Multi-repository boundaries | Accurately reflects 5 repository roles | Maintained explicit boundary definitions |
| `/data/` | Turkish Legal Data Platform | Truthfully bounds sources (Yargıtay disabled) | Maintained auditable pipeline description |
| `/qa/` | Behavioral testing | Correctly frames detached candidate checks | Maintained detached test engineer scope |
| `/certification/` | Profile B evidence harness | Truthfully declares certification BLOCKED | Preserved fail-closed verdict and gate status |
| `/law/` | Reference legal application | Accurately states live Core integration pending | Preserved MVP limitations |
| `/use-cases/` | Realistic evaluation scenarios | Concrete evaluation scenarios without hype | Maintained evidence-focused scenarios |
| `/evaluation/` | QA vs Certification comparison | Clear distinction between behavior & certification | Maintained fail-closed explanations |
| `/about/` | Open-source mission & maintainer | Transparent maintainer identity, stale version | Updated version to v0.8.0 |
| `/faq/` | Direct technical answers | Stale date in intro paragraph (2026-10-01) | Updated to 2026-10-15; verified answers |
| `/learn/*` (11 articles) | Educational technical articles | Accurate concepts, RRF formula, no false claims | Preserved high-quality technical content |
| `/research/*` | Research protocols | Explicitly states "Planned protocol · no results" | Preserved honest methodology |
| `/guides/*` | Step-by-step verification | Practical Yargıtay verification steps | Preserved responsible verification workflow |
| `/glossary/*` | Terminology definitions | Clear definition of Provenance | Preserved |
| `/methodology/*` | Retrieval evaluation methodology | Ground truth, relevance judgments, corrections | Preserved |
