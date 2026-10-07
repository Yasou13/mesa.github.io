# MESA Phase 1 Site Audit

Audit date: 2026-10-08  
Branch: `design/mesa-cosmic-foundation`  
Baseline: `website/apple-level-visual-polish-loop` at `7e86ab4`

## Executive summary

MESA already has a strong content and delivery foundation: it is a dependency-free static site with semantic HTML, bilingual route parity, build-time localization checks, deployment-aware URLs, and a strict link/metadata validator. The Phase 1 work should preserve that architecture rather than introduce a client framework or animation runtime.

The current visual system is coherent but belongs to an "Obsidian Archive" direction: purple is the dominant accent, archival diagrams are embedded directly in the homepage, several surfaces share the same bordered-card treatment, and the homepage is longer than its narrative requires. There is no explicit scene/media contract, no optional media manifest, and no reusable separation between future media and readable content.

The highest-value change is therefore a focused evolution: consolidate the CSS into a calm cosmic token layer, add a no-asset-required media-layer primitive, recompose the homepage around problem → approach → ecosystem → verified action → learning, and give the principal product/content surfaces distinct layouts without changing claims or routes.

## Architecture and deployment facts

- Runtime: plain static HTML, CSS, and a 54-line progressive-enhancement script.
- Build: Node.js renderer (`scripts/render_site.mjs`) plus Python deployment wrapper (`scripts/build_site.py`).
- Source data: `site-data.json`, `content/tr.json`, and `content/hub.json`.
- Published artifact: committed `dist/`; deployment-specific artifact: generated `_site/`.
- Hosting: GitHub Pages workflow with support for both the `mesamemory.dev` custom domain and repository base paths.
- Fonts: self-hosted Instrument Sans, Instrument Serif, and Commit Mono.
- Client JavaScript: mobile navigation, copy buttons, and heading-link copy only.
- Heavy animation/3D dependencies: none, and none are needed for Phase 1.

## Public route inventory

Every route below has a matching `/tr/` page. Slugs are intentionally identical across languages.

### Product and project routes

- `/`
- `/how-it-works/`
- `/ecosystem/`
- `/mesa/`
- `/data/`
- `/qa/`
- `/certification/`
- `/law/`
- `/use-cases/`
- `/evaluation/`
- `/docs/`
- `/docs/mcp/`
- `/status/`
- `/about/`
- `/faq/`
- `/404.html`

### Knowledge routes

- `/resources/`
- `/learn/`
- `/research/`
- `/guides/`
- `/glossary/`
- `/tools/`
- `/methodology/`
- `/learn/semantic-search/`
- `/research/keyword-vs-semantic-search/`
- `/guides/verify-ai-yargitay-decision/`
- `/glossary/provenance/`
- `/methodology/retrieval-evaluation/`

No separate cosmic production plan was found; the Phase 1 prompt is the governing brief.

## What should be preserved

1. **Evidence-based product language.** The site carefully distinguishes verified fixtures, release-candidate status, blocked certification, and reference implementations from production claims.
2. **Build-time bilingual parity.** Turkish is generated from an explicit translation map, with a structural completeness assertion.
3. **Deployment-safe routing.** Relative paths, canonical URLs, hreflang, sitemap output, and GitHub Pages base paths are derived at build time.
4. **Semantic and accessible foundation.** Pages contain one main and one h1, a skip link, real links, keyboard-operable controls, visible focus, and reduced-motion handling.
5. **Functional documentation design.** Docs and long-form knowledge pages already prioritize reading and navigation over spectacle.
6. **Very small runtime footprint.** The desired media foundation can remain declarative; Three.js, GSAP, R3F, and video-scrubbing code would be premature.

## Findings and priorities

### P0 — Phase acceptance blockers

- There is no reusable media/background layer or scene identity contract. Future posters/videos would require bespoke markup changes and risk colliding with content.
- The homepage hero directly references the existing astronomical plate and animated evidence SVG. It does not expose a clean, asset-optional event-horizon slot with focal point, crop, overlay, mobile, and fallback settings.
- The five future scenes are not represented semantically or documented as integration points.
- Required Phase 1 design, storyboard/asset, and implementation-report documents do not exist.

### P1 — Visual and composition issues

- The active purple (`#7562a8`) and archive/mineral palette does not match the approved restrained cosmic palette.
- The homepage sequence contains many complete marketing sections after the product proof. It repeats evidence, trust, flow, and application ideas, diluting the verified MESA in Action centerpiece.
- Hero, subpage hero, cards, and grid backgrounds still share a recognizable previous-design vocabulary. Product pages need stronger individual signatures.
- Several homepage elements are visually "technical plates" rather than media-ready layers. These should become fallbacks or product diagrams, not pretend to be the future cosmic media.
- Repeated bordered cards remain common in ecosystem, learning, documentation, status, and supporting sections. Hierarchy should use editorial rules, scale, and whitespace in addition to boxes.
- The current hero has a right-side graph but lacks an explicit safe-area boundary for a future right-weighted black-hole composition.

### P1 — Implementation inconsistencies

- Later CSS defines `.problem-entry`, `.ledger-row`, `.specimen-header`, and `.specimen-corner`, while current homepage HTML emits plain articles without those classes. The intended refined layouts are therefore only partially applied.
- `localizeHtml()` increments protected element depth twice on opening `code`, `pre`, `script`, and `style` tags but decrements once. This can suppress translations after the first protected block and should be corrected.
- The mobile menu closes with Escape, but it does not close after an internal navigation selection and does not synchronize on viewport changes.
- The existing validator is strong for generated markup but does not assert scene identifiers, media-layer safety, media-manifest integrity, or horizontal overflow at target widths.

### P2 — Design-system debt

- Tokens are declared in multiple historical layers in one CSS file. Phase 1 should add one authoritative final cosmic layer and document the source-of-truth values; a future cleanup can remove superseded declarations after visual stability.
- Button and card states are present, but disabled styling and media failure/loading conventions are not formalized.
- Breakpoints are implementation values rather than named tokens. CSS custom properties cannot drive media-query conditions reliably, so they should be documented alongside the actual query values.
- The footer is comprehensive but visually dense, especially at tablet widths.

## Page-by-page assessment

### Homepage

Strong semantic content and verified product proof. The hero has solid typography but the page is overlong and uses a live graph/archival image in the same space reserved for future media. Recompose and shorten. Move ecosystem before MESA in Action, retain the verified fixture as the visual/technical climax, and end with a compact learning/build invitation.

### MESA Core

The lifecycle, authorization scope, four retrieval lanes, and storage authority are accurate and useful. Preserve content. Strengthen its architectural character through rails, ledger-like rules, and a restrained structure-scene integration point rather than another decorative hero.

### MESA Data

The pipeline and source/release boundary are the page's identity. Favor a vertical source-flow composition and cool accent; avoid generic feature cards.

### MESA Law

The evidence and legal-review positioning is credible and appropriately cautious. Move toward an editorial dossier aesthetic with amber rules, generous line length control, and no theatrical cosmic scene.

### Learn and knowledge hub

Content model, taxonomy, breadcrumbs, article metadata, related links, and table-of-contents are strong. Reduce card sameness and use publication hierarchy, reading rhythm, and index-like rules. Cosmic identity should be subtle.

### Documentation

Already functional and compact. Preserve short hero, grouping, code blocks, and direct source links. Visual changes should improve scanability and contrast, not add cinematic space.

### QA, Certification, Evaluation, Status

Claims and status framing are excellent. Use operational/evidence signatures and retain red/amber semantics. Do not let cosmic accents obscure blocked or NO-GO states.

### About, FAQ, Use Cases, Ecosystem

All contain useful, non-invented copy. Their shared section/card patterns need stronger variation: editorial ledger for use cases, system map for ecosystem, minimal text panels for About, and plain disclosure rhythm for FAQ.

## Localization audit

- EN and TR route sets are generated together.
- Metadata, canonical, hreflang, and language controls are paired.
- New Phase 1 text must either use existing translated strings, be added to `content/tr.json`, or be emitted through bilingual build-time helpers in knowledge-only templates.
- Long Turkish words and translated CTA labels must be checked at 320 and 390 px.
- No route slug changes are required.

## SEO, accessibility, and performance audit

- Metadata coverage is comprehensive: title, description, canonical, Open Graph, Twitter, JSON-LD, hreflang, robots, and sitemap.
- Existing checks verify one `main`, one `h1`, heading progression, link targets, anchors, safe external links, and JSON-LD.
- Decorative layers must use `aria-hidden="true"`, `pointer-events: none`, and never contain focusable content.
- Optional media must not block LCP while absent; a static CSS fallback remains the default.
- Media integration must reserve aspect ratio and avoid loading desktop video on constrained mobile connections by default.
- Motion must remain optional under `prefers-reduced-motion` and video failure must reveal the same readable HTML content.

## Baseline visual QA

Real Chrome screenshots were captured locally at 1440×1000 and 390×844 before implementation. They showed:

- no horizontal overflow in the initial viewport;
- a functional collapsed mobile menu control;
- legible hero typography at both sizes;
- a distinctly purple, archival visual identity rather than the approved cosmic palette;
- a large blank/right-side technical graph zone that can be refactored into the future hero media safe area;
- full-width mobile CTAs with adequate touch height.

The app-integrated browser could not reach the isolated localhost server, so visual QA uses installed headless Google Chrome plus inspected screenshots. This is a real Chromium render, not a source-only approximation.

## Implementation order

1. Correct renderer inconsistencies and establish media manifest/layer primitives.
2. Add the final cosmic token and component layer.
3. Recompose the homepage and mark five semantic scene boundaries without empty viewport panels.
4. Strengthen distinct Core, Data, Law, Learn, and Docs compositions.
5. Extend automated checks for media safety and scene contracts.
6. Rebuild both languages and deployment modes, then run responsive Chrome QA at all required widths.
