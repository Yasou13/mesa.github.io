# MESA v0.9.2 website alignment — 7 November 2026

The pre-change file inventory is in [INVENTORY.md](INVENTORY.md); `inventory.json` lists all 880 tracked baseline files. Website baseline: `7039edbdc280cdc4e48ba31ffedf2f951e5f11b4`. Core release: signed tag `v0.9.2`, commit `8cd2cfe1df5356e73b3bef83ae640850fd54c798`.

## Implemented

- Aligned active EN/TR release identity, footer, status, install/upgrade commands, source links and SEO/software metadata to 0.9.2.
- Refreshed all 23 Core imports from committed Git objects, maintained paired guides and translated source appendices. Independent Data/Law/QA/E2E imports are unchanged and visibly qualified as dated evidence.
- Added `openapi-0.9.2.json`, regenerated paired endpoint references, verified identical paths/components against 0.9.1.
- Documented legal identity assignment, scope-learned law names, versioned chunk-offset `legal_items`, exact-match-first with a three-result cap, first-300-character decision identity, AYM handling and the legal-rules bypass switch.
- Corrected SPO extraction default to false independently of models, queue-capacity/deadline semantics, heavy query/readiness limits and remaining known issues. Official release-only Python 3.13 parser timing issue is attributed and not represented as fixed in this version.
- Reviewed all six UML views; updated admission snapshots, explicit SPO enablement, final exact-match stage, source-owned LegalItem snapshots, SKIPPED lane semantics, Python >=3.11 and models-off BM25 admission. Added immutable code links.
- Updated current article citations and regenerated synchronized Markdown/hub/SQL seed exports. No live CMS/database changes are part of this refresh.
- Preserved v0.9.0 demo recordings byte-for-byte, dated v0.9.1 development measurements, independent certification blockers, Alpha and production NO-GO.

## Validation

| Check | Result |
| --- | --- |
| Existing regression suite | PASS — 18 Python and 28 Node tests |
| Full Chrome sweep | PASS — 820 layouts at 320/390/768/1440px; 202 localized public routes, admin shells, 404 and shared interactions |
| First-use browser regression | PASS — 50 localized viewport checks; accessibility, clipboard, keyboard, reduced motion and no-JavaScript |
| Direct visual QA | PASS — EN/TR architecture diagrams; mobile diagrams scroll within their regions, no document overflow |
| Production-domain build | PASS — 202 localized routes, 245 HTML files, 19,854 internal references, 2,023 external references structurally checked |
| GitHub Pages project-path build | PASS — same route/file/reference counts |
| Secret scanner | PASS — 265 text artifacts |
| Immutable Core source targets | PASS — 52 file/anchor targets |
| Released SDK examples | PASS — paired snippets and V4 request schemas; admission/ACTIVE/no-wait/source delete/retry and terminal failure guards |
| Release wheel | PASS — all 150 Python source files match the signed release tag; official wheel/sdist digests match PyPI; not yanked |
| OpenAPI compatibility | PASS — paths/components identical to 0.9.1; version metadata updated |
| Historical and independent evidence | PASS — demo bytes and four independent repository imports unchanged |
| Committed admin bundle | PASS — rebuilding creates no admin.js diff |

The deliberate sync-failure messages in unit tests are fixtures, not failures. External-reference counts are structural checks, not a network audit of every third-party URL. Browser evidence is retained in compact JSON; selected screenshots are included.

## Publication

Publish this validated source to the existing `Yasou13/mesa.github.io` main branch and await `.github/workflows/pages.yml`. The custom-domain target remains https://mesamemory.dev/; audience and DNS settings are unchanged. Deployment outcome is verified after the source commit and reported in the task completion message.

Before publication, direct scripted requests to mesamemory.dev returned HTTP 403. A successful Pages deployment can be verified independently through GitHub Actions even if the origin continues to restrict automated HTTP clients. Do not infer a live content version from a 403 response.
