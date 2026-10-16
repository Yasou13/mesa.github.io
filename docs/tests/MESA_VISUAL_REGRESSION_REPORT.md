# MESA visual regression report

> Historical first-pass report. The subsequent visual repair supersedes its procedural background and acceptance findings: [MESA_COSMIC_VISUAL_REPAIR](../audits/MESA_COSMIC_VISUAL_REPAIR.md), implementation `2960046`. The later audit reproduced text collisions that the earlier overflow-only checks missed.

16 October 2026 · implementation `074b350` · baseline `cae7a09` · Chrome 155.0.8059.79, Linux, headless software rendering. No deployment performed.

## Final acceptance

**PASS (local Chrome visual review):** shared environment across Home, Core, Data, Law, Ecosystem, QA/E2E, Learn, Docs, Admin and 404. Screenshots were opened and inspected, including desktop/mobile before–after comparisons. The first hard-edged prototype and the surviving opaque Core/Law hero override were rejected and repaired. This is not an owner aesthetic approval or a claim of photographic equivalence with the references.

**PASS (mobile code background):** 320, 360, 390, 430, 768, 799, 800, 801, 1024, 1099, 1100, 1101, 1440 and 1920px; both languages for major page families. Landscape samples at 844×430. 521 page/viewport observations; zero document overflow failures. Portrait image cropping is eliminated because there is no bitmap hero in the rendered layout. Mobile noise is recomposed, scrim-protected and static.

**BLOCKED (owner login):** production backend and real owner sign-in are unverified. Forty isolated browser authentication checks and real PostgreSQL RLS tests pass; neither certifies hosted Auth. See [login verification](../security/MESA_ADMIN_LOGIN_VERIFICATION.md).

## Evidence

[Before/after visual gallery](visual-gallery.html) · [responsive matrix](evidence/browser-matrix.json) · [accessibility](evidence/accessibility.json) · [performance](evidence/performance.json) · [authentication fixture](evidence/auth-fixture.json) · [preservation/sizes](evidence/preservation-and-sizes.json) · [three hosting builds](evidence/hosting-builds.json).

## Executed tests

| Check | Status | Evidence / boundary |
|---|---|---|
| Custom domain, GitHub project-site and user-site builds | PASS | Each: 176 localized public routes, 179 HTML files, 14,826 internal references, 1,939 external references. External counts validate markup, not live availability. |
| Route and public text preservation | PASS | All 179 paths preserved; no visible public text differences after excluding script/style/decorative SVG. `content/` and `site-data.json` unchanged. |
| Shared layer, no bitmap requests, layering, hero visibility | PASS | One pointer-transparent environment per document; transparent product hero checks. |
| Full responsive browser matrix and final captures | PASS | 521 observations, all requested widths plus breakpoint boundaries and landscape samples. |
| Search, language/path retention, focus trap, menu Escape, article/docs navigation, native disclosure | PASS | EN/TR; custom-domain and project-prefix interactions. |
| JavaScript-disabled reading/navigation | PASS | EN/TR Home, Learn article, API reference; static environment retained. |
| Reduced motion / mobile animation | PASS | No running animations in reduced-motion or mobile sample. |
| Hidden-document handler | PASS | Simulated `visibilitychange` verifies motion off/on; OS-level background-tab GPU behavior NOT RUN. |
| axe-core 4.11.0 | PASS | 179 distinct routes, no reported final violations. Automated testing does not prove complete accessibility. Incomplete contrast evaluations remain manual-review items in JSON. |
| Python regression suite | PASS | 7 tests. Expected sync-error fixture logs “FAILED” while the unittest assertions pass. |
| JavaScript regression suites | PASS | 14 tests: admin, claims, docs, Markdown and search. |
| Isolated authentication UI/SDK | PASS | 40 EN/TR checks, synthetic responses, no real backend. |
| PostgreSQL role/RLS boundaries | PASS | Network-isolated disposable PostgreSQL, protected drafts/media and role revocation included. |
| Public secret-pattern scan | PASS | 190 text artifacts in each hosting build. |
| Syntax, compileall, whitespace | PASS | Node syntax checks, Python compilation, `git diff --check`. |
| Hosted Supabase login, SMTP recovery, deployed RLS/Storage | BLOCKED | Owner setup required. |
| Publishing/upload/export/dispatch integration | BLOCKED | Missing trusted backend features explicitly documented; no fake success UI. |
| Lighthouse, real GPU/battery cost, field LCP/INP, Safari/iOS/Firefox, manual screen-reader review | NOT RUN | Not represented as passed. |

## Performance

Maximum load-time layout shift across the final matrix: **0.05315**. This is a local observation, below the .1 check threshold, not field CWV certification. Baseline maximum was 0.02254; the matrices differ in size, so this is not a controlled performance improvement claim.

Three-second idle windows after fonts settled:

| Viewport / preference | Main-thread task time | Busy share | Running animations |
|---|---:|---:|---:|
| 1440px / normal | 5.97 ms | 0.199% | 1 |
| 1440px / reduced | 2.82 ms | 0.094% | 0 |
| 390px / normal | 11.11 ms | 0.370% | 0 |

These CDP TaskDuration deltas exclude compositor/GPU cost and are not CPU utilization measured for the entire process. SVG filters rasterize initially; no large filter or dust animation is running. Only the small opacity layer animates at desktop normal-motion settings.

- Home 390px resource transfer: 334,925 → 293,710 bytes (HTTP local server, excludes navigation document).
- Home 1440px resource transfer: 337,527 → 293,710 bytes (HTTP local server, excludes navigation document).

Fonts remain self-hosted and preload behavior unchanged. No nebula bitmap downloads. The fixed SVG reserves no layout space. Public JS decreased slightly; the Supabase bundle is requested only on admin routes.

| Asset | Raw bytes | gzip bytes (computed) |
|---|---:|---:|
| styles.css | 123,453 | 22,893 |
| cosmic.css | 2,012 | 841 |
| app.js | 12,397 | 3,830 |
| admin.js | 231,727 | 61,422 |
| admin.css | 2,097 | 798 |

## Repairs during verification

- Core/Law opaque hero override covered the SVG despite passing DOM-presence checks; removed and added a computed-style regression assertion.
- Learn/article callouts were incorrectly exposed as nested complementary landmarks. Converted integral-content wrappers to neutral containers; inner navigation semantics preserved. Re-scan passed.
- 404 test initially served the custom-domain build below an artificial prefix, producing missing styles. Correct root-server test passed; production/project path generation was not changed to mask the harness error.
- Removed unused decorative evidence-path SVG helper, CSS and nine keyframes after confirming no call sites/rendered instances.
- Hardened logout/role rejection against delayed responses reopening a workspace; private fields and tab credentials clear.

## Handoff and remaining limits

Commits: `4e5a75a` audit, `cd9a594` engine, `687cf9f` site-wide design/mobile, `074b350` authentication/CMS integration and verification repairs. The evidence/report commit is the next commit after these and does not embed its own hash.

Static website changes are ready for owner review. Production authentication/CMS publication is **NO-GO** until [owner setup](../admin/ADMIN_AUTH_SETUP.md) and real staging verification are complete. Existing ecosystem version/readiness claims, upstream evidence and documentation synchronization behavior are preserved. No push, merge or deployment was performed.
