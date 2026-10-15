# 06 — Page-by-Page Changelog

**Run ID:** `20261015T221500Z`  
**Execution Timestamp:** 2026-10-15T22:28:30+03:00  
**Target Baseline:** MESA Core v0.8.0  
**Repository Inspected:** `/home/yasin/Desktop/mesa_website/photos/site`  

---

## 1. Summary of Changes Across Site Pages

| Page Route | Changes Implemented | Status |
|---|---|---|
| `/` (`home`) | Updated package version to v0.8.0; updated evidence review date to `2026-10-15`; verified fixture test links; updated footer note to `v0.8.0 · V4 release candidate ·`. | Updated & Verified |
| `/mesa/` | Updated hero badge to `MESA CORE · V0.8.0`; updated status strip; added comprehensive v0.8.0 architecture links (Configuration, Getting started, CLI, Rebuild); updated storage and retrieval descriptions. | Updated & Verified |
| `/how-it-works/` | Preserved verified `Alice knows Aurora` fixture and 6-step public flow; aligned with v0.8.0 Core contracts; updated footer version string. | Updated & Verified |
| `/docs/` | Overhauled documentation cards into 7 structured categories; added links to Getting started, Concepts & Ingestion, Retrieval & Graph, OpenAPI specification, CLI reference, Performance & Limitations, Troubleshooting, v0.8.0 Release notes, Migration to v0.8.0, and Release policy. Verified copyable `uv sync --locked --extra dev` snippet. | Updated & Verified |
| `/docs/mcp/` | Validated MCP integration paths (V3 legacy direct stdio server vs V4 gateway/bridge); verified bridge tools (`mesa_recall`, `mesa_remember`, `mesa_improve`, `mesa_forget`, `mesa_health`, `mesa_get_operation_status`). | Updated & Verified |
| `/status/` | Updated Core package line to v0.8.0; updated audit date to `2026-10-15`; added direct link to official `v0.8.0 Release notes`; reinforced that Profile B certification remains BLOCKED and production is NO-GO. | Updated & Verified |
| `/ecosystem/` | Validated explicit separation of 5 repository roles; verified generic platform flow vs legal reference implementation path; updated footer version note. | Updated & Verified |
| `/data/` | Maintained Turkish legal data platform scope; verified Resmî Gazete, Mevzuat, Anayasa Mahkemesi configured and Yargıtay disabled; confirmed human boundary note. | Verified Unchanged |
| `/qa/` | Validated detached behavioral testing scope; confirmed SQLite ground truth and candidate worktree repair flow. | Verified Unchanged |
| `/certification/` | Confirmed Profile B status is BLOCKED; verified fail-closed handling and missing mandatory gates B0–B14. | Verified Unchanged |
| `/law/` | Confirmed primary reference implementation status; matter workspaces, review queues; live Core integration pending. | Verified Unchanged |
| `/use-cases/` | Verified 4 concrete evaluation targets (Agent memory, Knowledge-heavy assistants, Provenance-sensitive AI, Long-lived structured memory). | Verified Unchanged |
| `/evaluation/` | Maintained clear distinction between behavioral QA and profile certification; preserved trust state. | Verified Unchanged |
| `/about/` | Updated maintainer section and development note to `Core v0.8.0 · Release Candidate`. | Updated & Verified |
| `/faq/` | Updated introductory timestamp to `2026-10-15`; verified 15 technical answers including vector DB, RAG, provenance, and production status. | Updated & Verified |
| `/tr/*` (37 routes) | Fully synchronized Turkish equivalents for all modified English pages with 100% text parity enforced by `assertCompleteLocalization`. | Updated & Verified |
| `/learn/*` (15 entries) | Educational hub articles verified for accurate RRF formula ($k=60, w=1.0$), hybrid search principles, and provenance definitions without false benchmark claims. | Verified Unchanged |
| `404.html` | Clean fallback page with responsive navigation, logo, and return links. | Verified |
| `sitemap.xml` | Fully generated sitemap containing 74 localized routes with xhtml:link alternates (en, tr, x-default). | Generated & Verified |
| `robots.txt` | Directs crawlers to `https://mesamemory.dev/sitemap.xml`. | Generated & Verified |

---

## 2. Configuration & Rendering Code Changes

1. **`site-data.json`:**
   - `"version"`: updated from `"0.7.1"` to `"0.8.0"`.
   - `"statusAsOf"`: updated from `"2026-10-01"` to `"2026-10-15"`.
2. **`scripts/render_site.mjs`:**
   - Added verified v0.8.0 documentation links to `const docs`.
   - Updated `docsPage()` groups to provide deep documentation discoverability.
   - Added `v0.8.0 Release notes` link to `statusPage()`.
3. **`content/tr.json`:**
   - Added `"MESA CORE · V0.8.0"`, `"v0.8.0 / V4"`, and `"2026-10-15"` to `intentionalEnglish`.
   - Added Turkish translations for all new documentation guide titles and updated status strings.
