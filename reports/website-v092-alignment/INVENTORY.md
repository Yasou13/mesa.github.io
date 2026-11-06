# v0.9.2 website update inventory — 7 November 2026

Prepared before implementation. Publication target: existing https://mesamemory.dev/ via Yasou13/mesa.github.io GitHub Pages. Baseline website HEAD 7039edbd; Core target is signed release tag v0.9.2, commit 8cd2cfe1df5356e73b3bef83ae640850fd54c798.

| Area | Files / outputs | Required review and update |
| --- | --- | --- |
| Release identity | site-data.json, content/tr.json, shared footer/status/metadata | 0.9.2, release/publication dates, current install and upgrade commands |
| Immutable Core sources | content/docs/sources.json, manifest.json, guides.json, source-en/core | Refresh pinned Git objects, guide source links and translated source appendices |
| API | new openapi-0.9.2.json, build_endpoint_reference.py, endpoint guides and download assets | Regenerate from release schema; check V4 route/request compatibility |
| EN/TR docs | content/docs/guides/{en,tr}/*.md | Legal rules, typed identities, snapshots, exact-match-first, scope-learned law names, extraction default false, queue capacity/deadline behavior |
| Public narrative | render_site.mjs, render_intro.mjs, render_product.mjs, render_architecture.mjs | Home, setup, architecture, retrieval, ecosystem, FAQ, status and MCP integration |
| Architecture visuals | render_uml.mjs; architecture and reused docs diagrams | Review six UML views; show legal items separately from SPO, explicit SPO enablement, exact-match stage, queue admission; correct stale models-off/Python labels |
| Articles and references | hub.json, articles/{en,tr}, source generator data, SQL export | Update maintained Core citations, preserve dated examples and prior benchmark attribution; verify tri-source consistency |
| Evidence and limitations | release-notes, limits, testing, security, migration, CLAIMS.md | Document CPU responsiveness fix, heavy query/readiness limits, cross-store UUID ties, remaining scan/Unicode stalls and release-only CI timing issue; NO-GO status |
| Historical material | recorded first-search v0.9.0 and prior release evidence | Keep original recordings and dated measurements, label historical context |
| Generated site | dist/, build artifact, search index, sitemap, robots, localized pages | Regenerate complete EN/TR site, verify links, schema, localization and version drift |
| Validation | existing tests, content gates, production/project builds, browser QA | Run relevant automated checks and inspect key desktop/mobile diagrams and pages |
| Publication | .github/workflows/pages.yml, main branch, Pages deployment | Publish validated source through current workflow, await result, verify live release marker |

The complete tracked-file checklist and detected version markers are in inventory.json. Untracked .mcp.json and review/ are existing local files, excluded from publication. Independent Data/Law/QA/E2E source pins and their dated verdicts must not be presented as newly certified by Core 0.9.2.
