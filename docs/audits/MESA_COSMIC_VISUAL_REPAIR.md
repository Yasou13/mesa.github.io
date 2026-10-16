# MESA cosmic background and layout repair

16 October 2026. **Implemented and verified locally; NOT DEPLOYED.** Production baseline: `97429a3`. Repair commits: `04ac9c6` (layout/continuity), `2960046` (nebula/motion/generated pages). The following verification commit contains this report and evidence.

[Before/after gallery](cosmic-repair/gallery.html) · [responsive measurements](cosmic-repair/final-responsive/matrix.json) · [all routes](cosmic-repair/all-routes/matrix.json) · [animation frames and state](cosmic-repair/final-motion/motion.json).

## Defects and confirmed causes

The supplied text described a screenshot; no separate screenshot file accompanied this request. The four defects were reproduced on the actual live `/how-it-works/` baseline and captured in `cosmic-repair/before-*.png`. Screenshots were inspected directly, not inferred from unit tests.

| Defect | Root cause observed in source and browser | Correction |
|---|---|---|
| Source/Structure/Scope/State overlap | The DOM has a generated number, `strong`, and `p`. A later historical rule imposed `42px 30px 220px 1fr`, reserving an icon track despite no icon in the component. The heading occupied the 30px track and its visible glyphs extended into the description. Mobile overrides retained the missing-icon assumption. | One authoritative three-track grid: `2.5rem minmax(0,14rem) minmax(0,1fr)`. Explicit text columns, `min-width:0`, wrapping and gaps. At ≤800px, number + content columns; description sits below heading. Removed obsolete icon rules and contradictory breakpoint definitions. |
| Weather-cloud appearance | SVG fractal noise `.008 .018`, five octaves, constant RGB `.44 .48 .64` and alpha threshold `3.8 -1.65` created disconnected gray-blue patches. Source color variation was flattened; a few displaced/blurred strokes did not restore fine astronomical structure. | Replaced this rendering with the four unchanged owner-supplied WebP references, shared CSS composition, masks and localized lighting. Fine filaments, dark dust and sparse stars come from the actual reference texture. No generated image. |
| Motion invisible | A 240×180px light used color alpha `0d`, opacity .35→.7 over 32 seconds. It ran only for desktop Home/Core/Data. Mobile hid it; other variants had no animation. Actual baseline frame changes peaked at only 2/255 over 20 seconds. | One masked illumination texture changes opacity .08→.78 over 14 seconds, alternating gently. No camera motion, background zoom, rotation animation or animated filter. Shared lifecycle script also loads on Admin. |
| Rectangular cutoff | The environment itself was already fixed to the viewport. `.action-section` painted opaque `#08090d` over it; architecture/pipeline/journey/worktree and other outer sections likewise owned unrelated opaque backgrounds. On mobile, the old SVG additionally occupied only 72% height with a 23vh offset. | Remove those outer paints at their source and redundant overrides. One fixed page-level layer continues through sections. Footer has a deliberate fade. Cards, code, technical diagrams, article/docs reading panels, status notices and Admin form retain protected surfaces. |
| Extra mobile article overflow | EN/TR Reciprocal Rank Fusion reference link used shared `inline-flex` plus an unshrinkable text span and long test identifier; document overflow measured 201px at 390. | Shared icon-link `max-width:100%`; child `min-width:0; overflow-wrap:anywhere`. Code and tables keep their intentional internal scrolling. |

The earlier audit checked document overflow but missed visible text collisions. The new detector compares actual text-node line rectangles across independent text blocks. It excludes decorative/hidden content, closed disclosures, screen-reader-only text and within-block font ascent intersections. It **fails on the old baseline** in EN/TR at 390/801/1440 and passes on the repair. This supplements screenshot review; it is not a proof about every possible font/browser/state.

## Rendering choice and mobile composition

- Pure CSS gradients do not reproduce the fine reference dust structures.
- The existing SVG prototype demonstrably produced the wrong visual vocabulary.
- Canvas would add procedural rendering, resize and pixel-buffer management without an established quality advantage here.
- **Selected: original image + code hybrid**, explicitly permitted by this repair brief. Four reference files total 160,904 bytes; one 25.8–52.9KB texture is fetched per page/viewport. The illumination layer reuses the same URL. [Byte identities and provenance](cosmic-repair/texture-provenance.json).

Home uses `hero`; Core/How It Works/Data use `flow`; Ecosystem uses `structure`; Law/QA/E2E/reading/Admin use restrained `horizon`. Mobile uses a separately positioned tall filament composition: static −58° orientation, bounded 780–1100px texture plane, soft radial edge mask and asymmetric readability scrim. This is a static composition choice, not background rotation animation. Reading surfaces remain opaque. A minimum 67% global scrim protects text at peak illumination; conservative sampled explanation-region contrast is **4.82:1 or better**, including mobile. [Region measurements](cosmic-repair/contrast.json). This is a sample, not a site-wide contrast certification.

## Motion verified in rendered pixels

Chrome 155.0.8059.79 headless on Linux, device scale 1, GPU disabled. Desktop 1440×1000; mobile 390×844. For repaired motion isolation, non-background content was made invisible, layout/scroll remained fixed, visibility changes settled before T=0, and real browser screenshots were captured at 0/5/10/20 seconds. Baseline frames retain page content at the same scroll position; the recorded changes are restricted to the original light region. No generated mockups or synthetic replacement frames.

| Frame vs T=0 | Before max channel difference | Repaired desktop | Repaired mobile |
|---|---:|---:|---:|
| 5s | 1/255 | 5/255 | 4/255 |
| 10s | 1/255 | 16/255 | 12/255 |
| 20s | 2/255 | 12/255 | 9/255 |

At 10s, 15.46% of desktop pixels and 9.83% of mobile pixels change by more than 3 levels. Visual comparison confirms localized illumination becoming perceptible over several seconds while geometry stays still. **Reduced motion: zero pixel differences at all three times, both widths.** The same composition stays visible at a fixed light level. [Pixel measurements](cosmic-repair/pixel-differences.json).

Computed animation name, duration, opacity, state and current time were recorded. Simulated `document.hidden`/`visibilitychange` pauses the animation and restoring visibility resumes it; OS-level background-tab scheduling was not tested. Data Saver pauses optional motion. Without JavaScript, the same background renders statically. Admin receives its own shared motion initialization without changing Auth code.

## Validation

| Test | Result | Evidence / scope |
|---|---|---|
| Required responsive matrix | PASS | 280 observations: 14 page families × EN/TR × 320,360,390,430,768,800,801,1024,1440,1920. No unexpected text collisions, document overflow, missing images or reported runtime/HTTP errors. |
| All index routes | PASS | 178 routes at 390/1440: 356 observations. Includes article routes omitted from the earlier mobile audit. 404 covered by accessibility/static checks. |
| How It Works extra checks | PASS | Same-document resizing at 1920→1024→801→800→320→844×430→1440, EN/TR; no overflow. Numbered rows and section transitions captured. |
| Long-reference regression | PASS | RRF article EN/TR at all 10 required widths. |
| axe-core 4.11.0 | PASS | 179 routes, zero reported violations. Incomplete checks remain in JSON; manual screen-reader audit not performed. |
| Normal/reduced/no-JS/Data Saver/visibility | PASS | Real frames and computed state; visibility event is simulated. |
| Navigation, search, focus, language paths, no-JS reading | PASS | Existing EN/TR browser suite at custom-domain root and GitHub project prefix. |
| Three static builds | PASS | Custom-domain/project/user-site; each 179 HTML files, 176 localized public routes, 15,005 internal references. 1,939 external references checked as markup, not live availability. |
| Public artifact credential scan | PASS | 191 text artifacts in each hosting build. |
| Regression suites | PASS | 7 Python + 14 JavaScript tests. Python sync-error log is an expected passing fixture. |
| Content/routes/generated output | PASS | 179 routes retained; no public visible text or `content/`/`site-data.json` changes. Built output matches renderer text and assets; two graph code samples undergo only CRLF normalization in the Python build. |
| Source syntax / whitespace | PASS | Node syntax checks and `git diff --check`. |
| Safari, iOS, Firefox, Lighthouse, real GPU/battery, field CWV | NOT RUN | Chrome evidence must not be represented as coverage for these. |
| Real Supabase Auth/CMS | UNVERIFIED | Existing configuration blocker remains; this repair does not alter backend/auth operations. |

[Accessibility](cosmic-repair/accessibility.json) · [supplementary checks](cosmic-repair/supplement.json) · [project interactions](cosmic-repair/project-interactions.json) · [builds](cosmic-repair/builds.json) · [preservation/sizes](cosmic-repair/preservation-and-sizes.json).

## Performance and costs

Final CSS: styles 121,928B + cosmic 2,903B. Public app JS 12,003B + lifecycle 556B. Admin bundle unchanged 231,727B, only on admin routes. Removed SVG turbulence/displacement/blur layers and their repeated HTML markup; no animation dependency, Canvas, per-scroll handler or per-frame DOM update was added.

Isolated five-second idle windows, after fonts settled (How It Works):

| Setting | Before main-thread task time | After | After busy share |
|---|---:|---:|---:|
| Desktop 1440, normal |5.496ms |4.148ms |0.083% |
| Mobile 390, normal |0.498ms |15.915ms |0.318% |
| Desktop 1440, reduced |0.479ms |0.443ms |0.009% |

All windows: 0 new layouts; observed load CLS 0. Short-window JS heap was stable or collected; this does not establish long-term leak freedom. The 20-second frame sampler recorded 95th-percentile intervals 16.7ms and no interval >34ms in either normal-motion viewport. That sampler and screenshots add measurement overhead; idle task numbers above come from a separate run without the sampler. GPU/compositor memory and CPU are not included.

**Tradeoff:** mobile now animates, so its task time increases from the previous static state. Local uncompressed resource transfer increases by 52,086B (desktop 324,698→376,784B; mobile 317,358→369,444B), excluding the navigation document. Reference texture fidelity costs one small cached image. These bounded observations do not justify a blanket “no performance regression” or field performance certification. [Raw performance data](cosmic-repair/performance.json).

## Files and reproducibility

- `dist/styles.css`: authoritative numbered grid, icon-link wrapping, outer-surface ownership, footer fade; obsolete reliability icon layouts and archival striping removed.
- `scripts/cosmic.mjs`, `dist/cosmic.css`, `dist/cosmic-motion.js`, `dist/media/cosmic/`: shared hybrid environment, variants, composition and lifecycle.
- `scripts/render_site.mjs`, `scripts/render_admin.mjs`, `dist/app.js`: shared script inclusion and removal of duplicate lifecycle logic; generated HTML refreshed.
- `scripts/check_cosmic_repair.mjs`, `scripts/check_cosmic_supplement.mjs`, `scripts/check_cosmic_performance.mjs`, `scripts/tests/visual_browser.mjs`: reproducible browser evidence. Existing browser checker updated from obsolete SVG/no-bitmap assertions to the hybrid contract.

From repository root, with Node 24, Python 3, Chrome and existing dependencies:

```sh
python3 scripts/build_site.py --site-url https://mesamemory.dev --output /tmp/mesa-repair-after
python3 -m http.server 8765 --bind 127.0.0.1 --directory /tmp
node scripts/check_cosmic_repair.mjs --output /tmp/mesa-repair-responsive
node scripts/check_cosmic_repair.mjs --all-routes --no-captures --output /tmp/mesa-repair-all
node scripts/check_cosmic_repair.mjs --motion --output /tmp/mesa-repair-motion
python3 scripts/check_site.py /tmp/mesa-repair-after
```

The supplied captures are tied to `2960046`; later verification-only commit adds scripts/reports. Root/project interaction commands and environment are recorded in their logs. The performance comparison additionally requires the baseline build at `/tmp/mesa-repair-before`; reconstruct it from `97429a3` in an isolated checkout. Do not delete authoritative `dist` assets.

## Remaining limits and deployment

Confirmed screenshot defects are repaired locally: heading collisions, wrong noise appearance, imperceptible/restricted motion, and accidental section cutoffs. Final EN/TR representative screenshots were inspected side by side. Status bars, evidence cards, reading surfaces and Admin panels intentionally keep their boundaries.

Cross-browser/hardware performance and real Supabase login remain unverified. Production still serves `97429a3`; **no push, merge or deployment occurred in this repair task**. The earlier publication request applied to that prior release. These repairs are committed and ready for owner review and a new publishing instruction.
