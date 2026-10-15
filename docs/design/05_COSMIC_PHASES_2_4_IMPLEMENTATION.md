# Cosmic Minimalism — Phases 2–4 implementation record

Date: 15 October 2026 (Europe/Istanbul). Scope: design foundations, homepage composition, and static hero assets only. No deployment, framework migration, new documentation system, Learn article redesign, or Phase 5+ work.

## Repository and evidence

- Starting commit: `f83374ef955dd66df8137895f0f3411a14f394bd`.
- Branch: `design/cosmic-minimalism-phases-2-4`.
- Approved plan recorded separately in `9e3bf52` before implementation.
- Persistent before/after evidence directory: `/home/yasin/Desktop/mesa_website/photos/review/cosmic-phases-2-4/`.
- Each phase has viewport screenshots, full English/Turkish homepage captures at 390/1440 px, and `observations.json` containing route/width/layout observations. Builds and raw working evidence are under `/tmp/mesa-cosmic-implementation/`.

## Phase 2 — shared foundations

Implemented one authoritative `:root` token block, compatibility aliases, rem spacing/type scales, neutral/cosmic surfaces, more legible metadata, discernible secondary controls, cyan focus rings, restrained navigation, and opt-in component variants. Consolidated duplicate shared body, button, navigation, eyebrow, section, and token definitions rather than adding another theme layer. Existing page-specific rules remain for incremental later work. Core/product heading scale now uses the shared title token; article title/body rules and all article content remain intact.

Removed whole-document overflow clipping. This exposed a fixed-width Law figure and a minimum-content home heading. Responsive figure sizing and the actual grid/heading constraint resolve those overflows. No content is hidden to make the checks pass.

Flat-color contrast on `#11131B`: muted body text ≈7.89:1; metadata ≈5.42:1; control boundary ≈3.53:1; focus ring ≈12.01:1. These calculations do not constitute a whole-site WCAG audit.

Validation executed:

```bash
node --check scripts/render_site.mjs
node --check dist/app.js
node --check scripts/check_browser_layout.mjs
node scripts/render_site.mjs --output dist --site-url https://mesamemory.dev/
python3 scripts/build_site.py --output /tmp/mesa-cosmic-implementation/phase2/site --site-url https://mesamemory.dev/
python3 scripts/check_site.py /tmp/mesa-cosmic-implementation/phase2/site
node scripts/check_browser_layout.mjs --base-url http://127.0.0.1:8765/phase2/site/ --screenshots /tmp/mesa-cosmic-implementation/phase2/screenshots
git diff --check
```

Results: static PASS (74 localized routes, 75 HTML files, 3,466 internal / 967 external references). Browser PASS after resolving the two observed overflow causes: all 74 routes, Home in both languages at 320/390/768/1024/1440/1920, representative Core/Law/Docs/article mobile views, image decode, one main/h1, mobile menu open/Escape-close. Visually inspected the shared styles on home, Core, Law, and article screenshots. Screenshot capture and bilingual width coverage were added to the existing dependency-free browser checker. No performance score, screen-reader pass, Safari result, or user-comprehension result is claimed.

Phase 2 commit: `192abda`.

## Phase 3 — bilingual homepage composition

Implemented exactly six main sections: explicit AI-memory hero, short problem bridge, compact verified memory example, four-step memory lifecycle, ecosystem overview, and intent-based Learn/Docs/Law destinations. Preserved `#the-problem`, `#why-mesa`, `#mesa-in-action`, `#how-it-works`, and `#ecosystem`. Home uses a compact footer variant; other page footer behavior is unchanged. Readiness is dated from `site-data.json` (2026-10-01); no status claim was refreshed.

The fixture retains Alice/knows/Aurora, source/document/chunk/span, four lane ranks, `4/61`, and the schema-aligned application context. Native details contains the expanded fields; the mocked-vector/non-live-benchmark caveat remains visible when collapsed. The source link pins the reviewed test at `7c03eff`. Generic Core architecture is distinguished from the legal Data → Core → Law example; QA is external and Profile B scope is explicitly Data → Core, with certification blocked and live Law integration pending. No new interactive technical diagrams were implemented.

Added 48 Turkish translations without relaxing the intentional-English allowlist. Updated the static checker to enforce the six-section contract, preserved anchors, evidence fields, and new truthful EN/TR copy. Browser checks now enforce the approved 390 px fixture-position/page-height budgets and exercise fixture disclosure plus mobile navigation in both languages.

### Content preservation map

| Condensed home material | Existing full explanation retained |
| --- | --- |
| Source/revision/chunk/evidence/pipeline/embedding identity | `/how-it-works/` “What travels with memory”; `/mesa/` lifecycle/storage sections; full fixture on How it works. |
| Assertion/graph/SQL ownership and four retrieval origins | `/mesa/#retrieval`, physical stores, and How it works technical flow. |
| Authorized tenant/workspace/dataset/agent/session binding | `/mesa/#security`; How it works scope explanation. |
| Accepted/projected/retry/rejection/rollback/outcome state | Existing Core lifecycle/client contracts and How it works state row. |
| Home evaluation scenarios | Existing `/use-cases/` scenarios and legal-reference section. |
| Component ownership and validation layers | Existing `/ecosystem/`, `/qa/`, `/certification/`, `/evaluation/`. Home retains concise scope/limits. |
| Large repeated closing introduction | Home retains safe-core/development caveat and all destination/footer links; full closing remains on other pages. |

No detail-page content was deleted, rewritten, or moved into a new documentation system. Learn articles and `content/hub.json` were not edited.

Validation executed: V1 syntax/whitespace; V5 generated HTML refresh; V2 custom-domain build/check; V3 project/user builds/checks; V4 expanded Chrome checker. All pass. Static result: 74 localized routes, 75 HTML files, 3,474 internal / 961 external references. Visually inspected full desktop home, English/Turkish mobile home, and the compact specimen; manually pressed Enter on the native disclosure in the supported browser and confirmed visible ranks/score with no overflow.

| 390 × 844 local Chrome layout | Captured baseline | Phase 3 |
| --- | --- | --- |
| English full page | 13,837 px | 6,558 px |
| Turkish full page | 13,807 px | 6,617 px |
| English fixture section begins | 7,085 px | 1,045 px |
| Turkish fixture section begins | 7,052 px | 1,066 px |

These fresh measurements differ slightly from the earlier planning audit's browser capture; comparisons above use the same checker/environment. Screenshots: `phase3/` in the persistent evidence directory. No five-person comprehension study or native-speaker review has been performed; those remain review tasks, not claimed passes.

Phase 3 commit: `4e23a19`.

## Phase 4 — supplied static cosmic hero

Inspected the actual desktop and mobile hero WebPs and the supplied ZIP README. Integrated only `hero.webp` and `hero-portrait.webp`, copied byte-for-byte to `dist/media/desktop/` and `dist/media/mobile/`. Checksums, dimensions, and provenance are recorded in `docs/visual-sources.md`. Flow, structure, horizon, original JPGs, and preview sheets are not deployed. No imagery was regenerated, recolored, distorted, or recompressed.

Desktop uses the supplied landscape image as a bounded right-hand visual with separate CSS scrims. Tablet widths have a stronger text-protection scrim. At ≤800 px, a reserved 614:768 visual field sits below the opaque copy and actions. The image has intrinsic dimensions, eager loading, high fetch priority, and async decoding; there are no image preloads, video requests, parallax, continuous animations, or new dependencies.

Added reusable `posterPicture()` markup with default lazy loading and explicit priority opt-in. It uses the existing relative asset helper, accepts manifest-supplied intrinsic dimensions and an optional mobile crop, and supports a bounded normal-flow `poster-visual` variant for future work. Every manifest record is validated, including future additional records; old unused scene slots remain optional/null. Core and Data pages have not been integrated or redesigned.

Expanded the static checker to validate `srcset` targets and required poster dimensions. The browser checker now checks the selected crop, request/transfer behavior, priority, load-time layout shift, missing-image fallback, and reduced motion, in addition to existing routes/menu/fixture checks. New-document waits prevent measurements being taken from the previous page during repeated navigation.

### Final validation and evidence

Executed on local Chrome `155.0.8059.79`:

```bash
node --check scripts/render_site.mjs
node --check dist/app.js
node --check scripts/check_browser_layout.mjs
node scripts/render_site.mjs --output dist --site-url https://mesamemory.dev/
python3 scripts/build_site.py --output /tmp/mesa-cosmic-implementation/phase4/site --site-url https://mesamemory.dev/
python3 scripts/check_site.py /tmp/mesa-cosmic-implementation/phase4/site
python3 scripts/build_site.py --output /tmp/mesa-cosmic-implementation/phase4/project --repository Yasou13/mesa.github.io
python3 scripts/check_site.py /tmp/mesa-cosmic-implementation/phase4/project
python3 scripts/build_site.py --output /tmp/mesa-cosmic-implementation/phase4/user --repository Yasou13/Yasou13.github.io
python3 scripts/check_site.py /tmp/mesa-cosmic-implementation/phase4/user
node scripts/check_browser_layout.mjs --base-url http://127.0.0.1:8765/phase4/site/ --screenshots /tmp/mesa-cosmic-implementation/phase4/screenshots
node scripts/check_browser_layout.mjs --base-url http://127.0.0.1:8765/phase4/site/ --warm-cache --screenshots /tmp/mesa-cosmic-implementation/phase4-warm/screenshots
git diff --check
```

- All three static builds/checks PASS: **74 localized routes, 75 HTML files, 3,478 internal references, 961 external references**. External-reference count is structural validation, not a network availability crawl.
- Cold and warm browser runs PASS: all routes at desktop, both homepages at 320, 390, 768, 799, 800, 801, 1024, 1099, 1100, 1101, 1440, 1920 px, plus representative mobile Core/Law/Docs/article samples. Final cold run repeated after a tablet-only scrim refinement; warm evidence predates that CSS-only refinement.
- Both languages' mobile menu open/Escape-close and compact fixture open/close retain their evidence and do not overflow. A manual supported-browser Enter activation also opened the fixture.
- Cold loads request exactly the selected hero crop. The mobile encoded body is 27,636 bytes; desktop is 30,238 bytes. Warm Chrome sometimes emits an additional fallback resource entry from cache; its transfer size is zero. The warm checker rejects an extra crop that actually transfers bytes, rather than treating a cache trace as a duplicate download.
- Both languages' blocked-image tests keep visible copy, working-sized actions, and zero document overflow. Reduced-motion emulation reports static hero, decoded image, no running movement, and automatic (not smooth) scrolling.
- Maximum recorded load-time layout shift across the final cold sample set: **0.0496**; warm sample set: **0.0385**. These are local load observations, not field/Core Web Vitals certification. The earlier progress statement describing no observed shift was superseded by this instrumented measurement.
- Final 390 × 844 home: **7,028 px EN / 7,087 px TR**; fixture section starts at **1,514 px EN / 1,535 px TR**. This meets the plan's ≤9,000/10,000 page-length and ≤1,800 fixture-placement targets.
- All **73 non-home HTML files** compare equal to the starting baseline after normalizing only the shared stylesheet cache hash. `content/hub.json`, `site-data.json`, `dist/app.js`, `.github/workflows/pages.yml`, and `dist/CNAME` are unchanged from the starting commit.
- Final stylesheet: 118,016 bytes / 22,050 bytes gzip; runtime JS remains 3,212 bytes / 1,119 bytes gzip. Asset dimensions and ZIP-byte equality were verified locally. No dependency was added.

Durable screenshot/report locations:

- `/home/yasin/Desktop/mesa_website/photos/review/cosmic-phases-2-4/README.md` — before/after gallery.
- `phase4/home-1440.png`, `phase4/home-390.png`, `phase4/tr-1440.png`, `phase4/tr-390.png` — final viewport captures under that evidence directory.
- `phase4/home-1440-full.png`, `phase4/home-390-full.png` and matching TR captures — complete page composition.
- `phase4/observations.json` and `phase4-warm/observations.json` — exact dimensions, selected sources, transfer observations, browser version, fallback states, and failures (empty).

### Files modified by the implementation

| Area | Files |
| --- | --- |
| Foundations / homepage styling | `dist/styles.css` |
| Static rendering and reusable poster markup | `scripts/render_site.mjs` |
| Bilingual home copy | `content/tr.json` |
| Media contract / supplied assets | `content/media-scenes.json`, `dist/media/desktop/hero.webp`, `dist/media/mobile/hero-portrait.webp` |
| Meaningful validation coverage | `scripts/check_site.py`, `scripts/check_browser_layout.mjs` |
| Generated output | `dist/index.html`, `dist/tr/index.html`; other generated HTML only receives the new shared stylesheet cache hash. |
| Documentation | `README.md`, `docs/visual-sources.md`, this report; approved plan recorded before the implementation commits. |

### Known limits and remaining work

No Phase 5+ redesign was begun and no push, merge, publication, or deployment was performed. Core/Data diagrams, additional product-page compositions, full accessibility/platform QA, font/logo optimization, and performance/SEO work remain in their later phases. The shared foundation intentionally retains page-specific legacy CSS for incremental migration.

No five-person comprehension study, independent native-speaker editorial review, full screen-reader review, Safari/iOS/Firefox matrix, throttled Lighthouse scores, LCP/INP field measurements, or live deployed-domain verification is claimed. The current large logo/font assets remain a known later-phase performance opportunity. The supplied images have the package's original resolution and are not represented as 4K photography.

**Stopped after Phase 4, as requested.** The Phase 4 commit containing this report is identifiable by the subject `feat(media): integrate responsive cosmic hero (phase 4)`; its final hash is reported in the chat because a commit cannot embed its own hash.
