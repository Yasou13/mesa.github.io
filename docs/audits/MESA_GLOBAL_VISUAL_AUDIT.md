# MESA global visual audit — 16 October 2026

Baseline: `cae7a09`. Clean `main` checkout; older CMS branch `4e4a3a1` is already an ancestor and contains the retired prototype, not a separate completed backend. No other ecosystem repository changed.

## Independently reproduced

- **PASS** baseline custom-domain build/static check: 176 localized public routes, 179 HTML files. Fresh Chrome run: every public route at desktop, 12 home widths, representative reading/product widths, bilingual search/menu/no-JS interactions.
- **VISUAL FAIL** cosmic identity ends at the homepage image. Core has large decorative ledger/grid pseudo-elements; Data/Law/QA lack the photographic atmosphere. Reading surfaces inherit several historical purple/brown shades.
- **MOBILE FAIL** the portrait hero is forced to 200px and `object-fit: cover` by trailing v0.8.0 overrides, overriding earlier 614:768 composition. No document overflow in the baseline; the defect is composition, not horizontal sizing.
- **AUTH BLOCKED** `/admin/` and `/tr/admin/` intentionally display unavailable status. No client/session/backend connection. Existing SQL forbids direct browser publishing; this protection must remain.
- **CSS FAIL** one root palette exists, but later editorial/rank/documentation styles introduce unrelated hardcoded colors, radii and backgrounds. Several old page-hero effects have no information content.

## Reference inspection

All four actual WebP references extracted from the supplied `~/Downloads/MESA-Visual-Assets.zip` and inspected: hero, cosmic-flow, cosmic-structure, cosmic-horizon. Dark left fields, directional violet/blue dust, rare cyan ridges, very sparse stars. No new raster imagery is needed. The first SVG prototype was rejected for a visible hard-edged cloud boundary; the revision uses continuously masked noise.

## Evidence

Fresh before screenshots and full structured observations: [before gallery](../../../review/global-cosmic/before/). Representative files: `home-390.png`, `home-1440.png`, `mesa-1440.png`, `law-390.png`, `docs-1440.png`, `learn-what-is-ai-memory-390.png`. All are local Chrome captures, not historical screenshots. Final implementation and remaining limitations are recorded in the linked design, security and regression reports.

Implementation history: `4e5a75a` baseline audit; `cd9a594` shared engine; `687cf9f` global/mobile integration; `074b350` Auth/CMS and verification repairs. Final metrics and persistent before/after screenshots: [regression report](../tests/MESA_VISUAL_REGRESSION_REPORT.md).
