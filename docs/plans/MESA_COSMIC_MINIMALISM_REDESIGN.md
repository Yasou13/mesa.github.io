# MESA Cosmic Minimalism Redesign — Audit and Implementation Plan

**Prepared:** 15 October 2026 (Europe/Istanbul)  
**Status:** Planning complete; redesign implementation has not begun.  
**Audited website repository:** `/home/yasin/Desktop/mesa_website/photos/site`  
**Baseline commit:** `f83374ef955dd66df8137895f0f3411a14f394bd`  
**Deliverable:** `docs/plans/MESA_COSMIC_MINIMALISM_REDESIGN.md`, relative to that repository.

The user's pasted redesign brief governs this work. Historical design documents and the ZIP's README are evidence and context, not additional instructions to execute. In particular, the ZIP's React/Vite sample is inapplicable to this dependency-free site, and the earlier five-scene/video direction is not a requirement to fill every scene with media. This audit changes no application files, content, assets, dependencies, or deployment configuration.

## 1. Executive Summary

Retain MESA's static architecture, bilingual publishing system, verified examples, route structure, and deployment checks. Refine the existing site incrementally. A framework migration would add cost without solving the observed problems.

The current site already communicates evidence, scope, lifecycle state, and component boundaries accurately. Its main weakness is the distance between that information and the visitor: large introductory surfaces, repeated explanations, and a late proof example make a technically credible project harder to understand quickly. The mobile English homepage measured approximately 14,007 px at 390 × 844; at 320 × 900 it measured 15,408 px, with the fixture starting around y=8,016. These are local Chromium layout observations, not audience analytics or performance scores.

The proposed direction is **Apple-like clarity, restrained cosmic atmosphere, and inspectable technical evidence**. Use the supplied hero image once at the homepage opening; use smaller, optional visual fields for Data and Core; keep Ecosystem, Law, documentation, and status surfaces primarily informational. Bring the deterministic memory example near the start. Reduce duplicate explanations while preserving their full technical versions on existing detail routes.

Recommended first delivery: establish one authoritative token layer, compose a shorter homepage in both languages, integrate its static hero responsibly, then improve Core/Data diagrams and the ecosystem map. No server, WebGL scene, new animation dependency, or video is required.

## 2. Current Website Assessment

### 2.1 Repository architecture and ownership

| Area | Observed implementation | Decision |
| --- | --- | --- |
| Framework/build | No React, Vite, Next.js, Vue, npm manifest, or runtime package dependencies. Python `scripts/build_site.py` copies `dist/` and invokes Node's `scripts/render_site.mjs`. | Keep the existing generator. |
| Routing | Real directories containing `index.html`; 37 public route identities × EN/TR = 74 localized routes, plus one bilingual `404.html`. | Keep URLs and static deep links. Core is `/mesa/`, not a new `/core/` route. |
| Shared components | Template functions in `scripts/render_site.mjs`: `header`, `footer`, `statusStrip`, `architectureFlow`, `publicFlow`, `actionExample`, `sceneLayer`, hub renderers. | Improve these functions selectively; no component framework needed. |
| Page sources | Core pages live in renderer functions; route/status/repository metadata in `site-data.json`; publications in `content/hub.json`. | Edit sources, then regenerate HTML; do not patch generated page HTML by hand. |
| Localization | `content/tr.json` translates core page strings/metadata; hub entries contain locale data and use `hubText`/`hubChrome`. Build fails on missing core translations. | Preserve both mechanisms and the glossary. Update EN/TR together. |
| Styling | One `dist/styles.css`, 2,101 lines / 104,825 bytes. Multiple historical `:root`, component, breakpoint, and reduced-motion blocks; final Phase 1 layer begins around line 1,833. | Consolidate incrementally after recording computed-style baselines. |
| Runtime JS | `dist/app.js`, 3,212 bytes: menu, clipboard fallback, heading links, optional video fallback. | Reuse; add only diagram/reveal enhancements that earn their cost. |
| Typography | Self-hosted Instrument Sans, Instrument Serif Italic, Commit Mono; OFL files retained. Font display uses swap. | Keep families; reduce routine serif use and improve delivery. |
| Color | Final tokens already use black `#050508`, surface `#11131B`, text `#E8EAF0`, muted `#A5A9B5`, cool accent `#8B9CCB`, evidence amber `#D5AE82`. Earlier purple/archive definitions remain. | Evolve the final tokens, avoiding another appended identity layer. |
| Motion | CSS traversal keyframes remain; current home no longer calls the old `evidencePath()` hero helper. No GSAP/Motion/Three.js imports. Five media records have all asset slots null. | Do not describe dormant CSS as active homepage animation. Keep static-first behavior. |
| Navigation | How it works, Ecosystem, Use cases, Resources, Docs, EN/TR, GitHub; footer exposes component and trust routes. Mobile menu opens and Escape closes with focus restoration. | Preserve working interaction; improve component discoverability and active-page context. |
| SEO | Static title/description, canonical, OG/Twitter, JSON-LD, paired hreflang, sitemap, robots, social PNGs, noindex 404. | Preserve and verify; these are existing strengths. |
| Deployment | `.github/workflows/pages.yml`: configure Pages → deployment-specific build → static checker → upload `_site` → deploy. `dist/CNAME` contains custom-domain configuration; `.nojekyll` exists. | Preserve configuration and base-path support. |

`dist/` is unusual: it contains both generated HTML and authoritative CSS, JS, fonts, and assets. Do not delete it as a disposable build directory. Builds for this audit used separate `/tmp/mesa-redesign-audit/` outputs, leaving the checkout intact.

### 2.2 Inspection and validation performed

- Inspected the tracked file inventory, renderer structure and important page/helper bodies, generated headings across every EN route family, hub metadata, Turkish translation mechanism, CSS layers, runtime JS, build/check scripts, Pages workflow, claims ledger, previous audits, and media contract.
- Built and checked production custom-domain, project-site, and user-site artifacts. Each passed: **74 localized routes, 75 HTML files, 3,466 internal references, 967 external references**. These checks establish structural validity; they do not prove availability of every external destination.
- Visually inspected the current home, Core, Data, Law, Ecosystem, Docs, and an AI-memory article in the in-app Chromium browser; inspected English and Turkish home at 390 px; verified mobile menu open and Escape-close behavior.
- Measured English home at 390 × 844 and 320 × 900. Both had zero document-level horizontal overflow. A larger multi-width browser sweep timed out after the 320 px sample; no six-width/all-route browser pass is claimed for this audit. Historical browser results in earlier reports are not new results.
- Opened the ZIP contact sheet and decoded image dimensions/byte sizes. No image package was copied into the site.
- Re-read pinned upstream Core README and retrieval tests, Data README/source configuration, QA README, Law verification report, and E2E independent audit through the GitHub connector. This corroborates the site's recorded baseline; it is not a review of every upstream repository's latest HEAD or a new runtime certification.
- No throttled Lighthouse run, field Core Web Vitals, screen-reader certification, Safari/iOS run, live deployment, DNS check, or backend execution was performed. Those remain explicit implementation acceptance tasks.

### 2.3 Technical truth and capability boundaries

The date in `site-data.json` is **2026-10-01**, not the audit date. Present readiness as dated evidence until new source-backed verification is supplied. Do not update it to today merely because design work occurs today.

| Subject | Recorded/corroborated baseline | Presentation boundary |
| --- | --- | --- |
| Core | v0.7.1, V4 release candidate; SQLite canonical, LanceDB vector and Kùzu Graph V2 projections; scoped retrieval and provenance. | Production remains NO-GO in the reviewed record. A static website cannot demonstrate production isolation or durability. |
| Retrieval | Four reported origins: vector, BM25, assertion, graph. Eligibility precedes fusion; graph paths reconcile to canonical assertion IDs. | Follow runtime/tests over the compressed older SQL/vector/graph prose; retain the source-of-truth note. |
| Fixture | `test_real_four_lanes_fuse_once_and_repeat_deterministically`: Alice knows Aurora, one canonical result, all lane ranks 1, score `4/61`. | SQL and graph are exercised, but vector results are mocked in this test. Label as a deterministic test fixture, never a live model benchmark or latency/quality proof. |
| Data | Specifically Turkish legal-data preparation. Resmî Gazete enabled in approved-web mode; Mevzuat and AYM enabled/manual; Yargıtay disabled/manual. | No universal crawler or enabled Yargıtay acquisition claim. Preserve review, frozen release, human-started delivery, and COMMITTED-only success semantics. |
| QA | External behavioral/endurance/restart tests and isolated candidate repair. | Distinct from certification; no automatic merge/push; no runtime inline dependency. |
| E2E | Profile B legal Data → Core evidence contract; audit repairs verified fail-closed checks. | No legitimate passing runtime certification transaction; mandatory B0–B14 unverified in reviewed evidence. Do not extend certification coverage to Law. |
| Law | Versioned V4 HTTP integration boundary and source-aware legal workflow; isolated Law-side gates pass. | Full stack/live Core integration not run, overall NO-GO; external legal research and AI drafting disabled in the reviewed MVP. |
| Tools/research | Tools are planned; research comparison is a planned protocol without results. | No functional tool controls, completed experiments, benchmark charts, customers, pricing, or security/compliance guarantees may be invented. |

Pinned evidence used for planning:

- [Core README at 8af7941](https://github.com/Yasou13/MESA/blob/8af7941/README.md).
- [Core independent retrieval tests at 7c03eff](https://github.com/Yasou13/MESA/blob/7c03eff/tests/test_v4_independent_retrieval_audit.py).
- [Data README at 6b5a444](https://github.com/Yasou13/MESA_Data/blob/6b5a444/README.md) and [source configuration](https://github.com/Yasou13/MESA_Data/blob/6b5a444/config/sources.yaml).
- [QA README at 4f6c7ec](https://github.com/Yasou13/MESA_QA/blob/4f6c7ec/README.md).
- [Law final verification at e71f785](https://github.com/Yasou13/MESA_Law/blob/e71f785/docs/mvp-final-verification.md).
- [E2E independent audit at 4ec51e0](https://github.com/Yasou13/MESA_E2E_Certification/blob/4ec51e0/reports/independent-audit/REPORT.md).

`CLAIMS.md` remains the local claim ledger. Attach new copy/diagram decisions to that evidence or to newly reviewed, pinned source. Source documents' embedded historical commands and workflow restrictions describe their own projects; they are not commands for this website audit.

## 3. Identified Design Problems

| Priority / kind | Evidence and visitor impact | Concrete change / verification |
| --- | --- | --- |
| P1 structural: proof arrives late | `home()` places problem, principles, public flow, and ecosystem before `#mesa-in-action`; at 320 px the fixture begins around y=8,016. | Move a compact fixture immediately after a short problem bridge. Target fixture heading by y≤1,800 at 390 px. |
| P1 structural: repeated narrative | Problem entries, Why MESA rows, flow, and ecosystem repeatedly explain evidence/scope/structure before showing output. | Merge problem/principles into one short section; preserve full explanations on `/how-it-works/`, `/mesa/`, and Learn. Use a content move map before cutting copy. |
| P1 structural: excessive mobile length | 14,007 px home at 390 × 844; problem ≈1,701 px, principles ≈1,736 px, fixture ≈2,548 px. Fixed hero minimums 790/820/880 px contribute. | Use content-driven heights; compact the specimen and heading scales; target ≤9,000 px total home at 390 × 844, allowing TR ≤10,000. Targets are proposed, not achieved. |
| P1 content: unclear first impression | Hero definition is in a long paragraph, while the headline is an abstract contrast; the primary CTA says “in action” for a static fixture. | Put “AI memory infrastructure” in the main headline/subhead; say “Inspect a memory example.” A 10-second test must identify product, problem, next action. |
| P1 structural: same page opening | Core, Data, Law use large left headlines and similar empty ruled pseudo-graphics; the system map starts below Ecosystem's oversized hero. | Core opens with memory anatomy; Data with compact source/release overview; Law with a verified workflow specimen; Ecosystem with its actual map. |
| P2 visual: accumulated CSS | Four successive visual eras and repeated breakpoints obscure final ownership. | Consolidate tokens and touched components with before/after screenshots; no wholesale rewrite or deletion of unverified selectors. |
| P2 visual: forced heading cadence | Recurrent explicit `<br><em>` headings and serif emphasis impose the same rhythm on technical and editorial pages. | Let headlines wrap naturally; sans by default; reserve serif for one optional editorial moment. Check EN/TR independently. |
| P2 visual: excessive section scale | 92–132 px desktop section padding and large mobile headings repeat on small directories and articles. | Separate marketing, system, directory, and reading spacing variants; use 56–80 px mobile narrative spacing and smaller utility headers. |
| P2 navigation: components indirect | Core/Data/Law are found via Ecosystem/footer; several component routes highlight only Ecosystem. | Retain top-level IA; add a lightweight component subnav on ecosystem/product routes with exact current-page indication and a link to status. |
| P2 accessibility risk | Tiny technical labels, faded metadata, image overlays not yet exercised. `#777D8B` on `#11131B` computes ≈4.49:1, just below normal-text AA. | Raise secondary text token; use ≥13 px for essential metadata, maintain contrast over actual crops; run manual and automated checks. This audit does not assert a site-wide contrast failure. |
| P2 performance: oversized shared mark | 1,254 × 1,254 logo PNG is 535,223 bytes, requested for a small header mark and favicon. Fonts total 352,696 bytes; hero WebP is only 30,238 bytes. | Optimize the existing logo faithfully at real display sizes and a separate favicon; WOFF2 fonts with Turkish coverage. Measure initial transfer before prioritizing image micro-optimizations. |
| P2 content: translation/claim tone | TR hero reads “Hafıza, kanıt, gizemle değil.” Several Learn headings make broad absolute claims, e.g. “mathematically mandatory” or protection against hallucinations. | Write idiomatic TR and qualified educational explanations; distinguish architectural mechanisms from guaranteed outcomes. |
| P2 media-contract mismatch | Manifest expects five old cinematic scenes, all empty; new assets are four static nebulae. Checkers hard-code scene identity/order. | Keep optional fallback slots where useful; revise scene expectations alongside composition changes. Never populate every slot just to satisfy an old storyboard. |

Do not reintroduce historical problems that were already fixed: there is no evidence here of dead primary CTAs, absent mobile navigation, missing localization, absent sitemap, or broken project-site routing. Preserve those working features.

## 4. Proposed Visual Identity

**Complex technology. Clear communication. Cosmic atmosphere. Minimalist execution.**

Use near-black canvases with quiet blue/indigo depth, white headlines, soft gray body copy, and a restrained muted-violet identity accent. Cyan should identify a selected relationship or keyboard focus, never form neon clouds. Preserve amber only as a small provenance/evidence cue and red/green as semantic status colors.

Three page treatments share typography and controls but differ in composition:

1. **Product introduction:** left-aligned headline, controlled nebula field, short story, concrete example. Home; small image excerpts on Core/Data only.
2. **System explanation:** opaque diagram surfaces, labeled boundaries, readable evidence records, local highlights. Core, Data pipeline, Ecosystem, QA.
3. **Reading and verification:** quiet background, article measures, plain tables and metadata, no ambient motion. Docs/Learn, Law detail, research, status/certification.

Hierarchy comes from size, alignment, and spacing. Avoid default glass cards, repeated grids, gradient headline fills, glow borders, fictional dashboards, and animated telemetry. Retain the existing MESA mark; its warm colors need not be recolored to match nebulae. Optimize delivery without changing brand geometry.

## 5. Page-by-Page Design Strategy

Every path below retains its `/tr/` counterpart. Component pages keep distinct layouts. Existing technical content remains reachable through the same route and anchor identities, or a documented equivalent anchor if a section is merged.

| Existing route / renderer | Role and proposed composition | Preserve / verify |
| --- | --- | --- |
| `/` — `home()` | Concise introduction → short problem bridge → fixture → simple lifecycle → ecosystem → navigation choices. See §6. | Static fixture labels, legal-reference qualification, status, all existing destination links. |
| `/how-it-works/` — `howItWorksPage()` | Compact opening, six-step explanation, inspectable fixture, deeper lifecycle detail. Use a single vertical narrative with expanders for storage jargon. | Do not imply Data/Law mandatory for every Core deployment. Separate QA/Certification from runtime. |
| `/mesa/` — `mesa()` | Technical opening with memory anatomy beside a short definition; lifecycle and scope diagram; retrieval explorer; storage authority table; client surfaces. Small structure image only in opening field. | SQLite authority, eligibility before fusion, graph reconciliation, source wording note, dated status, HTTP/SDK/MCP distinctions. |
| `/data/` — `dataPage()` | Source/status matrix, raw artifact → canonical record specimen, seven-step release pipeline with human boundaries. Flow image occupies a small introductory side field. | Four actual configured sources and modes; delivery manually initiated, staging distinct, COMMITTED success. |
| `/ecosystem/` — `ecosystem()` | Actual map immediately below a two-line introduction; generic architecture first, legal reference path second; repository ownership in a compact comparison ledger. | QA outside runtime; Profile B scope only Data → Core; Law integration pending. |
| `/law/` — `lawPage()` | Professional source/document/review composition with short definition, annotated repository-backed workflow specimen, HTTP boundary, limits/status. | Do not fake a live UI, case record, retrieved judgment, research result, drafting feature, or deployed customer. Use redacted real UI only after repository/UI verification; otherwise label HTML specimen as illustrative. |
| `/qa/` — `qaPage()` | Restart/endurance timeline and baseline-versus-candidate boundary, then links to scenario evidence. No nebula. | Independent ground truth, isolated storage, pre-fix failure, no automatic merge/push. Timeline is an explanation, not live monitoring. |
| `/certification/` — `certification()` | Dated verdict first; gate/evidence ledger; scope/limits; historical record. Plain dossier rather than a decorative seal-led hero. | BLOCKED and UNVERIFIED stay prominent; audit checks passing never become certification PASS. |
| `/evaluation/` — `evaluationPage()` | Side-by-side QA/certification purpose comparison, shared evidence limitations, publication policy. | Distinct authority and scope; no placeholder performance numbers. |
| `/status/` — `statusPage()` | Compact date/version/verdict summary, source links, blocker list, historical evidence below. | Static dated status, never a live uptime dashboard. Preserve source dates. |
| `/use-cases/` — `useCasesPage()` | Editorial rows: visitor problem → MESA mechanism → evaluation question. One legal reference callout. | Scenarios remain prospective evaluation targets, not adoption claims. |
| `/docs/` — `docsPage()` | Short utility header; retain Start/Understand/Build/Operate/Trust/Reference/Contribute groups, improve density and quickstart prominence. | Working outbound documentation and copy buttons. Avoid invented search or another docs application. |
| `/docs/mcp/` — `mcpPage()` | Comparison table for direct V3-compatible stdio and V4 gateway/bridge, operation-state explanation, versioned source links. | Separate runtime contracts; avoid a combined fictional universal endpoint. |
| `/about/` — `aboutPage()` | Short purpose essay, component ownership strip, maintainer/contact facts. Borderless editorial layout. | Public Yasou13 identity and issue tracker; no invented company/team. |
| `/faq/` — `faqPage()` | Preserve native disclosure answers; group by basics, architecture, integration, readiness, with direct source links. | Keyboard/native details behavior, answer availability without JS, all substantive answers. |
| `/resources/` — `renderHubIndex()` | Compact directory of six learning/research surfaces with clear entry tasks. | No impression of a running product knowledge graph; this is editorial related-content navigation. |
| `/learn/` — `renderLearnHubIndex()` via hub index | One featured starting article; sequential curriculum; compact article directory; secondary taxonomy links. Reduce repeated lead cards and large heading panels. | Existing learning paths, category/topic links, published-only entries. |
| `/research/` — hub index | Methods/status-led publication list; clear planned-protocol state. | No fabricated results or performance charts. |
| `/guides/` — hub index | Task-based directory: who the guide helps, inputs, expected verification artifact. | Existing published guide; no invented downloadable tool. |
| `/glossary/` — hub index | Readable term index, alphabetic grouping when volume warrants; current single term stays compact. | Do not manufacture entries to fill columns. |
| `/tools/` — hub tools branch | Plain availability register for the three planned tools. | Planned / not yet interactive remains text, without disabled-looking launch CTAs. |
| `/methodology/` — hub index | Methods directory and publication criteria; future scopes separated from published methods. | Preserve draft/indexability rules. |
| `/404.html` — `notFound()` | Quiet bilingual recovery links and clear error heading; no large decorative grid. | Root and project-path-safe Home/TR/Docs links, noindex. |

### 5.1 Every existing detail publication

All use `renderHubEntry()` and `renderHubBlock()` with content in `content/hub.json`. Preserve breadcrumbs, author/date metadata, short answer, TOC, heading links, references, related content, and publication state. Shared target: title 40–64 px desktop, 32–42 px mobile; body 18 px / 1.7; readable width 66–72 ch, capped at 720 px. Long article titles should never inherit the 98 px marketing hero scale.

| Detail route | Specific composition or content action |
| --- | --- |
| `/learn/semantic-search/` | Query → meaning → retrieved evidence conceptual diagram; explicitly distinguish concept from a measured MESA result. |
| `/learn/what-is-ai-memory/` | Lifecycle overview after the short answer; reduce oversized title/byline gap. |
| `/learn/what-is-evidence-aware-memory/` | One annotated evidence record; qualify domain claims and link to Core's concrete contract. |
| `/learn/rag-vs-ai-memory/` | Maintain comparison table and explain overlap; avoid categorical claims about all RAG implementations. |
| `/learn/structured-vs-unstructured-memory/` | Side-by-side text/assertion example with source identity; keep trade-offs visible. |
| `/learn/why-vector-search-alone-is-not-enough/` | Four failure-mode examples; separate generic limitations from documented MESA mitigations. |
| `/learn/hybrid-retrieval-explained/` | Reuse static retrieval diagram; distinguish rank fusion from score normalization. |
| `/learn/what-is-provenance-in-ai/` | Source/revision/chunk/assertion lineage; explain provenance supports inspection without guaranteeing correct generation. |
| `/learn/why-graphs-matter-in-ai-memory/` | Small, source-labeled traversal diagram; no force-directed decorative network. |
| `/learn/memory-scope-and-authorization/` | Eligibility-before-fusion diagram; revise absolute wording to specify the contract and threat model. |
| `/learn/reciprocal-rank-fusion-explained/` | Accessible formula + rank table; use `4/61` only in the named fixture, not as confidence. |
| `/research/keyword-vs-semantic-search/` | Protocol metadata before research narrative; results section clearly says not executed/no results. |
| `/guides/verify-ai-yargitay-decision/` | Numbered verification checklist and record specimen. Educational verification task does not imply enabled Data Yargıtay ingestion. |
| `/glossary/provenance/` | Concise definition, example, technical expansion, related concepts; minimal promotional ending. |
| `/methodology/retrieval-evaluation/` | Scope → dataset/query selection → judgment → planned metrics → reproducibility and corrections. Metrics definitions are not reported measurements. |

## 6. Homepage Section Composition

Target six main narrative sections, one compact dated status note, and the shared footer. Reuse content and helpers; reduce duplicated presentation rather than discarding technical information. Proposed copy below is a planning candidate, not an approved backend claim change.

| Order | Composition / content | Implementation and target |
| --- | --- | --- |
| 1. Hero | EN headline: **“AI memory, with its evidence attached.”** EN description: “MESA is open-source memory infrastructure for AI systems. It keeps information connected to its sources, relationships, and authorized data scope.” Primary: **Inspect a memory example** → `#mesa-in-action`; secondary: **Explore the architecture** → `/mesa/`. | `home()` + `sceneLayer('event-horizon')`; text on left, hero image on right. Under 800 px text sits on an opaque surface above the visual. Definition and CTAs require no scrolling at common 390 × 844 sizes; artwork may continue below. No fixed viewport minimum. |
| 2. Short problem bridge | One heading and three compact statements: lost sources, flattened relationships, wrong scope. Follow with one sentence connecting them to Core. | Merge current Problem/Why MESA copy. Borderless list, 180–260 px desktop / approximately 300–430 px mobile; no background media. Retain `#the-problem` and `#why-mesa` as meaningful destinations. |
| 3. Evidence example | Query “Alice” → Alice knows Aurora → source-chunk-1. Always-visible evidence and fixture label; lane-rank details and application context available in native disclosure. | Reuse `actionExample()` with a compact mode, full mode on explanation pages. Fixture heading begins by y≤1,800 at 390 px; clear static-test caption including mocked vector input. |
| 4. How memory moves | Four steps: Source → scoped memory → retrieval → context with evidence. Link the detailed six-step/technical lifecycle separately. | Reuse `publicFlow(true)`. Four-column desktop, ordered vertical list mobile; no sticky scroll/pinning. Include one short statement that explains canonical state and derived projections, linking to Core. |
| 5. Ecosystem | Generic sources/preparation → Core → application, then a clearly labeled legal reference row Data → Core → Law. External QA and certification lines with exact scope captions. | Compact semantic map; Law connection labeled “HTTP contract; live integration pending.” No cosmic image under labels. Link each component plus Evaluation. |
| 6. Continue by intent | Three concise destinations: Understand concepts → Learn; Build/integrate → Docs; Explore the legal reference → Law. One secondary Use cases link. | Ruled editorial rows, not another three promotional cards. Existing use-case details remain on `/use-cases/`. |
| Status + footer | “Core v0.7.1 · V4 release candidate · Production NO-GO · As of 1 Oct 2026” from shared data and dated source review. One status link. | Keep the safety information; reduce the current separate discovery + development + large closing-CTA repetition. Footer stays shared; offer a compact closing variant on reading/utility pages. |

Turkish hero candidate: **“Yapay zekâ hafızası, dayandığı kanıtlarla birlikte.”** Description: “MESA, yapay zekâ sistemleri için açık kaynaklı bir hafıza altyapısıdır. Bilgiyi kaynakları, ilişkileri ve yetkili veri kapsamıyla bağlantılı tutar.” CTAs: **Hafıza örneğini incele** / **Mimariyi keşfet**. Have a native-language editorial pass check phrasing and established glossary terminology before implementation acceptance.

Home content budget: approximately 450–650 English body words excluding navigation/footer; Turkish may be longer. Preserve detailed explanations by linking/moving them, not by hiding essential product limits in disclosures. Conduct a five-person, 10-second comprehension check: at least four can describe MESA as AI memory infrastructure, name evidence/scope as a purpose, and find the architecture/example action. This is a proposed usability target, not a claimed research result.

## 7. Cosmic Asset Placement Plan

### 7.1 Inspected files

The ZIP README identifies the originals as Google Flow images. Treat them as **nebula imagery**, not verified astronomical observatory photography. Record user-supplied provenance accurately; do not invent telescope credits or a public-domain license. The inspected contact sheet shows the desktop/mobile composition changes described below.

All desktop WebPs and source JPGs are **1376 × 768**; mobile WebPs are **614 × 768**, approximately 4:5. These are not 4K assets. All WebPs are static.

| Pair | Desktop bytes / KiB | Mobile bytes / KiB | Actual composition and chosen role |
| --- | --- | --- | --- |
| `hero.webp` / `hero-portrait.webp` | 30,238 / 29.5 | 27,636 / 27.0 | Dark left half, dense violet-blue mass on right; mobile crop concentrates the mass. Main home hero only. Protect left text; separate text and image on narrow layouts. |
| `cosmic-flow.webp` / `cosmic-flow-portrait.webp` | 51,958 / 50.7 | 23,674 / 23.1 | Bright diagonal filament from lower left toward upper right, useful directional movement but poor text background. Optional Data intro side field; actual pipeline drawn separately on opaque surface. |
| `cosmic-structure.webp` / `cosmic-structure-portrait.webp` | 52,932 / 51.7 | 36,788 / 35.9 | Bright intersecting central structure, higher visual density and less safe negative space. Small Core intro artwork, separated from memory/retrieval diagrams. Never encode graph topology with this image. |
| `cosmic-horizon.webp` / `cosmic-horizon-portrait.webp` | 25,776 / 25.2 | 12,872 / 12.6 | Mostly dark upper field, low filament/ridge. Reserve as an optional shallow closing transition; default home and Ecosystem maps need none. Do not force usage. |

The eight delivery WebPs total **261,874 bytes (~255.7 KiB)**, but no page should request all eight. Keep original JPGs and contact sheet as source references outside the deployed asset tree; no reason to serve them to visitors.

### 7.2 Integration contract

- Proposed delivery paths: `dist/media/desktop/<name>.webp` and `dist/media/mobile/<name>-portrait.webp`. Update `content/media-scenes.json` only during the implementation phase. Use the renderer's existing `asset()`/relative path convention; do not paste the ZIP's `import.meta.env.BASE_URL` example.
- Map home `event-horizon` poster to `desktop/hero.webp` and mobilePoster to `mobile/hero-portrait.webp`. Keep existing scene ID if it simplifies compatibility, but revise its obsolete black-hole purpose description. Do not map flow, structure, and horizon onto every other homepage scene.
- Keep still-useful legacy scene records optional/null. New Core/Data art can use a small generalized poster helper with explicit manifest records; validate every configured record, not just the old five required IDs. Coordinate renderer/checker changes.
- Use `<picture>` with a mobile `<source media="(max-width: 800px)">` and a desktop fallback `<img>`. This is **art direction**. The mobile and desktop files are different crops, not interchangeable resolution variants. Add width-descriptor `srcset`/`sizes` only when generating same-crop variants; do not mislabel portrait 614w and landscape 1376w as the same composition. See [MDN picture guidance](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/picture).
- Home hero: eager loading, `fetchpriority="high"`, async decoding, explicit image dimensions and a reserved visual container. Do not preload both crops. Add a responsive preload only if measurement demonstrates discovery delay; the existing HTML picture should usually suffice.
- Core/Data below-fold fields: lazy loading with reserved ratio; if a page places its image above the fold, load it eagerly at normal priority after identifying the actual LCP element. Optional horizon is lazy. Request only the chosen crop.
- Preserve full original colors/content; no hue rotation, distortion, image warping, or AI regeneration. A separate directional black scrim may protect text. Start desktop hero at centered image positioning inside a right-weighted field, then inspect at 1024/1440/1920; the old `76% 44%` focal point is not automatically correct for these assets.
- Mobile portrait: display in a separate approximately 4:5 field, optionally reduce its visible height only after crop review. Never stretch 614 × 768 across a tall text-driven hero background. At large desktop sizes constrain art width or let it fade into black; do not upscale to apparent 4K detail.
- Decorative images use empty alt and a noninteractive hidden visual wrapper. Meaningful diagrams have their own accessible descriptions. If an image fails, the existing dark fallback and all copy/actions remain usable.

## 8. Animation Architecture

### 8.1 Technology decision

| Technology | Fit with this repository | Recommendation |
| --- | --- | --- |
| CSS transitions/keyframes | Native, no package/bundler cost; adequate for hover/focus and small state changes. | Default. Animate opacity/transform only where they clarify state. |
| IntersectionObserver + CSS | Native visibility trigger for one-time reveals and offscreen suspension. | Optional progressive enhancement, about 1–2 KiB of additional uncompressed code budget. Content remains visible if initialization fails. |
| Inline SVG + CSS/small JS | Fixed technical topology, deterministic highlights and evidence selection; static fallback easy. | Default diagram technology. Keep readable labels as HTML where possible. |
| GSAP + ScrollTrigger | Framework-agnostic and useful for complex timelines; current needs do not require a timeline engine or scroll pinning. | Defer. Introduce only for an approved interaction that cannot remain simple; measure bytes/main-thread cost first. |
| Motion | Vanilla JS `animate`/`inView` is available; React wrappers are unnecessary. | Defer; native observer and CSS cover the requested interactions. Do not add React for animation. |
| Three.js | No real spatial product model or 3D task exists here. | Exclude from this redesign. Nebula imagery does not justify WebGL. |

Current documentation was fetched through Context7: GSAP `/websites/gsap_v3`, Motion `/websites/motion_dev`. [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia%28%29) can scope and revert responsive animations; use that API if GSAP is later justified. [Motion inView](https://motion.dev/docs/inview) supports vanilla DOM visibility callbacks; React `MotionConfig`/hooks are not applicable to this codebase. Neither dependency is proposed for installation.

### 8.2 Motion specification

| Surface | Behavior | Duration / limits |
| --- | --- | --- |
| Buttons/links | Color/border response; optional 1 px lift only on pointer hover. Focus always clearly visible. | 140–180 ms; no geometry shift. |
| Narrative reveal | Optional one-time opacity + ≤8 px translation after entering viewport. Never hide hero, primary actions, article text, or readiness labels. | 320–420 ms, at most 60 ms stagger across three items. |
| Hero | Prefer a static image. If motion improves the approved composition, fade a separate low-opacity veil on entry; do not move/scale/rotate the nebula. | One ≤600 ms transition; no perpetual zoom, parallax, or camera movement. |
| Retrieval/graph | User chooses a lane/node and the connected evidence is highlighted. Optional Step/Replay illustrates a known fixture. | 180–280 ms state changes; one sequence ≤3 s; no autonomous loop. |
| Data pipeline | Selecting a stage highlights its documented input/output and human boundary. Optional one-shot Step sequence. | No fake speed, live progress bars, or automatic approval/publication. |
| Reading/utility pages | Stable layout; normal disclosure/anchor behavior. | No scroll reveals, ambient animation, pinning, or background media. |

Respect `prefers-reduced-motion` in CSS and use a live [matchMedia change listener](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) for any JS-controlled effects. Reduced motion renders the final readable state immediately and suppresses animated movement, smooth scrolling, replay, and media playback. Pause optional work when hidden/offscreen. Controls must work by keyboard and touch without animation. Existing video fallback code can remain dormant; configuring video is out of scope.

## 9. Technical Visualization Plan

Every diagram needs a named, pinned source, a caption stating whether it is an architectural summary or a test fixture, and a readable HTML explanation/table. Diagrams are static website illustrations with optional local selection; they do not query live services or simulate unverified runtime outcomes. Build SVG at generation time or use semantic HTML/CSS plus SVG connectors. Avoid a diagramming runtime.

### A. MESA Memory Architecture

- **Communicates/why:** Persistent canonical state differs from derived indexes; source provenance and scope remain attached across admission and retrieval. This replaces empty “stacked paper” hero geometry with useful architecture.
- **Placement:** Core opening and lifecycle section; simplified snapshot linked from How it works.
- **Represented behavior:** Source/document revision/chunk identity → authorized admission → selected validation policy → SQLite ledger/assertions/outbox → ordered idempotent vector and Graph V2 projections. Retrieval consumes eligible canonical/projection records and returns evidence. Rejection is a separate branch, not a partially successful write. This is a summary, not a transaction timing diagram.
- **Source:** `architectureFlow()`, Core README at 8af7941, reviewed architecture/API/DAO evidence in `CLAIMS.md`. Before coding branch/status details, pin the exact mutation/projection contract; do not invent state names from UI needs.
- **Technology/interaction:** Semantic step list plus inline SVG connectors and a storage table. Optional stage buttons reveal source-linked explanations; no draggable nodes or zoom required.
- **Cost/acceptance:** ≤20 KiB SVG/markup and ≤40 nodes/connectors; static no-JS reading order matches visual order. SQLite is visibly authoritative, and LanceDB/Kùzu cannot appear as independent canonical owners.

### B. Vector + BM25 + Assertion + Graph Retrieval

- **Communicates/why:** Four origins contribute ranked evidence; eligibility happens before fusion; origin scores are not interchangeable confidence probabilities.
- **Placement:** Core retrieval section; compact static version in Home fixture and hybrid-retrieval/RRF articles.
- **Represented behavior:** Authorized scope → four parallel eligible lanes → deduplicated canonical candidate → True RRF → bounded reranking/context where supported. Show each lane's rank separately. The Alice fixture has four rank-1 contributions, `Σ 1/(60+1) = 4/61`; the test mocks vector search results and is not a live embedding demonstration.
- **Source:** Core `test_real_four_lanes_fuse_once_and_repeat_deterministically` and `rrf_fuse_lanes` at 7c03eff; keep the existing runtime-versus-overview terminology note.
- **Technology/interaction:** HTML lane table plus SVG connectors. Lane buttons highlight contributions without changing the known fixture. If a later exploratory rank calculator is added, label its values as educational inputs and separate it from test output; it is unnecessary for initial delivery.
- **Cost/acceptance:** ≤20 KiB markup/SVG; share the diagram controller, no library. Duplicate vector hits must not become extra votes; `4/61` must never be formatted as percent accuracy or confidence.

### C. Knowledge Graph Traversal

- **Communicates/why:** A graph path needs supporting assertion identities and evidence; an attractive network alone says nothing about retrieval validity.
- **Placement:** Core graph subsection and `/learn/why-graphs-matter-in-ai-memory/`.
- **Represented behavior:** Initial small fixture uses Alice → Bridge → Destination and Xavier → Bridge → Destination with the shared primary evidence, matching `test_graph_primary_source_and_parallel_paths_remain_aligned`. That test supplies graph paths via a mock: label this a **path-alignment test illustration**, not proof that a live graph traversal executed. Use the two-node Alice/Aurora fixture for the smaller home example. Do not imply an evidence link is another entity-to-entity graph hop.
- **Source:** Same pinned independent retrieval test module; if showing actual executed multi-hop traversal, first select and review the corresponding real-graph test and its bounds/filters. Do not invent extra nodes, hop limits, or confidence values.
- **Technology/interaction:** Fixed-layout SVG, HTML node buttons and an evidence detail region. Select an entity/path to highlight supporting IDs; provide next/previous controls if Step is offered. No force simulation, canvas, pan, or hover-only labels.
- **Cost/acceptance:** ≤16 KiB markup, initial ≤6 visible entities and ≤8 edges. Evidence and primary/supporting assertions remain aligned; text alternative explains direction and fixtures. Controls work without precision pointing.

### D. MESA Data Ingestion Pipeline

- **Communicates/why:** Raw input becomes a traceable reviewed release; human initiation and verified commitment prevent a false “fully automatic ingestion” impression.
- **Placement:** Data page centerpiece; small summary on Ecosystem legal path.
- **Represented behavior:** Collect → preserve immutable raw bytes/hash → canonicalize JSONL → gate → review → build/verify/freeze release and human approval → human-started publish, with COMMITTED-only success. Manual source modes and disabled Yargıtay stay visible. Local staging is a separate development branch, not publication.
- **Source:** Existing `dataPage()` seven-stage description, Data README/configuration at 6b5a444. Pin the release/publisher contract before adding specific intermediate operation states.
- **Technology/interaction:** Ordered HTML stages, lightweight SVG connectors; stage selection exposes actual artifacts and boundary descriptions. Mobile is vertical, with separate review and delivery callouts.
- **Cost/acceptance:** ≤20 KiB markup; all stages readable without JS. No automatic transition across human approval; no fabricated throughput, download activity, enabled sources, or completion statuses.

### E. MESA Ecosystem Architecture

- **Communicates/why:** Core is the memory infrastructure; Data and Law demonstrate a legal path, while QA/E2E have distinct external evaluation roles.
- **Placement:** Ecosystem first viewport after compact introduction; smaller Home version.
- **Represented behavior:** Generic compatible input/preparation → Core → application, followed by legal Data → Core → Law. QA is an external behavioral layer. Profile B certification spans the legal Data → Core path only; it is not an inline runtime stage and does not certify Law. Law HTTP connection is a documented integration contract with live integration pending.
- **Source:** `ecosystem()`, site metadata/claims, pinned QA/E2E/Law evidence in §2.
- **Technology/interaction:** Semantic HTML nodes/links with SVG connectors; native details for ownership. Use separate diagrams for generic and legal models rather than one overloaded map.
- **Cost/acceptance:** ≤24 KiB markup/SVG, local page navigation only. Diagram labels expose boundaries and dated limits without hover; mobile reflows vertically. No nebula behind the map.

Conceptual layout contract (the implementation must preserve the scope captions):

```text
Generic: compatible sources/preparation → MESA Core → application

Legal reference:
MESA Data → MESA Core ── V4 HTTP contract; live integration pending ─→ MESA Law
   └──── Profile B evidence scope: Data → Core; BLOCKED ────┘

MESA QA: external behavioral/endurance testing of Core candidates
E2E Certification: external, profile-bounded evidence and verdict
```

Create one small diagram controller in `dist/app.js` only when interactions are implemented. Page HTML supplies the data/relationships; JS changes selected state and explanatory text, never the technical fixture. Proposed optional fixture metadata file: `content/diagram-fixtures.json`, introduced only if sharing between pages warrants it, with source commit, test name, mock limitations, locale labels, and stable node IDs validated at build time.

## 10. Design System Specifications

### 10.1 Tokens

Replace duplicated definitions in the authoritative layer as components are migrated; retain old custom-property aliases until all references have been checked.

| Proposed role | Value | Existing compatibility / use |
| --- | --- | --- |
| Page black | `#050508` | `--black`; main canvas. |
| Midnight surface | `#0B101B` | Quiet alternate background. |
| Technical surface | `#11131B` | `--surface`; opaque diagrams/records. |
| Raised surface | `#171B28` | Detail/selected panel, no translucent glass requirement. |
| Deep indigo | `#222842` | Small selected/background area, never body text. |
| Primary text | `#E8EAF0` | `--ink`. |
| Body muted | `#A5A9B5` | `--muted`; computed ≈7.89:1 on technical surface. |
| Secondary text | `#858B98` | Replace `--muted-2` where essential small text currently risks contrast. Validate all actual backgrounds. |
| Cool orientation | `#8B9CCB` | Existing mineral/purple compatibility aliases; relationships and links. |
| Muted violet | `#9B8ACB` | Identity detail, not a full-page wash. |
| Subtle cyan | `#8EA5AE` | Selected connector/focus; avoid multiple competing accents. |
| Evidence amber | `#D5AE82` | Existing copper; provenance labels only. |
| Status | Existing red/green values | Preserve semantic meanings; include text/icon. |
| Decorative line | `rgba(232,234,240,.12)` | Hairlines between content groups. Not sufficient alone for control identification. |
| Control boundary | Solid color verified ≥3:1 against adjacent surface | Separate from decorative hairlines; start near `#666C7C` and test the actual control state. |
| Focus | `#B8D5DD`, 2 px ring, 4 px offset | Visible on dark surfaces; validate light button interiors too. |

Ratios above are calculations against flat colors, not a substitute for testing composited image/scrim backgrounds. Keep important text on an opaque surface when contrast would otherwise vary with a crop.

### 10.2 Type, layout, components

| Specification | Proposed values / behavior |
| --- | --- |
| Font families | Instrument Sans for UI/display/body; Commit Mono for code/IDs; Instrument Serif Italic optional, at most one editorial accent on a marketing page, none required on technical pages. |
| Weights | Body 400; labels 500–550; headings 500–600; controls 600. Avoid synthetic bold/italic. |
| Display scale | Home 56–88 px desktop, 40–56 px mobile; technical page h1 44–64 / 34–44; article h1 40–64 / 32–42; section h2 32–48 / 28–36; h3 22–28 / 20–24. Use rem-based fluid clamps. |
| Body/metadata | Body 18 px / 1.65; article 18 px / 1.7; mobile body 17–18 px / 1.65; essential metadata 13–14 px / 1.5; short technical code 13–15 px with wrapping or its own scroll container. |
| Tracking | Display about −.035em, body normal; avoid wide all-caps except short secondary labels. Never letter-space long Turkish text. |
| Spacing scale | 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 120 px, represented in rem tokens. |
| Containers | Preserve 1360 px maximum wide canvas; primary content 1200 px; reading body 66–72 ch and ≤720 px; article shell ≤1180 px including TOC. |
| Gutters | 20 px at 320–520; 24 px to 800; 32 px to 1100; 40–48 px above, bounded by centered container. |
| Section spacing | Marketing 88–112 px desktop / 56–80 mobile; utility 40–64 / 32–48; article blocks 28–40. No viewport-height filler sections. |
| Corners/borders | 6 px controls, 8–10 px true panels, 2–4 px technical specimens; 1 px decorative rules. Avoid pill-shaped cards and universal shadows. |
| Card variants | Evidence record (opaque, labeled fields); navigation row (open/ruled); resource publication (title/status/summary); status ledger (date/verdict/source). Do not wrap every paragraph. |
| Button hierarchy | One primary per action group: white/off-white fill with dark text. Secondary outline with a discernible control boundary. Tertiary underlined/text link. Clear external-link indicator and real destination. |
| Interaction targets | Prefer 44 × 44 px minimum, primary buttons 48 px high; wrap long labels without clipping. Text links may use spacing to meet target requirements. |
| Navigation | Preserve current IA/menu; compact component subnav on relevant routes. Current page uses `aria-current`. Keep EN/TR page pairing. No mega-menu dependency, sticky header, or search feature required. |
| Breakpoints | Retain 520, 800, 1100 px boundaries; add a component-specific breakpoint only for demonstrated overflow. Validate 320/390/768/1024/1440/1920. |
| Timing/easing | Fast 160 ms, base 240 ms, reveal 380 ms; `cubic-bezier(.2,.7,.2,1)`; reduced motion final state. |

Define visual variants through explicit component classes rather than page-order selectors. Do not change heading levels for size. Preserve source code and public identifiers exactly, while translating their surrounding explanatory labels.

## 11. Content Improvement Plan

### 11.1 Editorial decisions

| Current content / location | Proposed revision | Evidence and preservation rule |
| --- | --- | --- |
| Home headline and long definition | Use the explicit product definition in §6, one clear benefit sentence, example/architecture CTAs. | Describe source/relationship/scope attachment without claiming reliable generation or production readiness. |
| Problem + Why MESA duplication | Combine into one bridge; keep the four contract concepts on Core/How it works and in the fixture annotation. | Maintain a copy relocation ledger so no valuable technical explanation disappears. |
| “See MESA in action” | “Inspect a memory example” / “Hafıza örneğini incele.” | Static fixture is not live software. Include test name, commit, mocked vector limitation, and no benchmark language. |
| “From trusted sources” | “From reviewed sources” where source review is what is established. | Official origin and review are inspectable properties; universal trustworthiness is not guaranteed. |
| Home legal chain | Add “Current legal reference path”; show generic architecture separately. | Data and Law are not universal Core dependencies. |
| Core paragraphs dense with storage jargon | Introduce persistent memory/evidence first; expose storage ownership, eligibility, projection, and recovery through diagrams with short definitions. | Full technical details and canonical documentation stay linked and readable. |
| Data scope phrased mainly as a disclaimer | Lead with “Prepare traceable Turkish legal data,” then show actual sources/modes. Keep scope limitations adjacent to pipeline. | No new acquisition capabilities or automatic delivery. |
| Law broad workflow list | Show one verified document/evidence/review path; separate implemented repository scope, stub/contract evidence, and unexecuted live integration. | No fabricated legal answer, draft-generation feature, or legal-outcome promise. |
| Learn absolute assertions | Review “mandatory,” “protects against hallucinations,” and sweeping RAG/vector comparisons; explain conditions, limitations, and what a mechanism supports. | Distinguish general education from MESA-specific claims and measured outcomes. |
| Article default Law CTA | Use each entry's existing `productContext` when relevant; for general methods/research, prefer appropriate Core/Methodology/Docs links. | Avoid steering every topic to Law. Shared footer must not overwhelm the article ending. |
| Status phrased as current without prominent date | Print `statusAsOf` next to the status summary and source links. | Reviewed pinned records are historical evidence; updating design does not refresh readiness. |
| Tools and research previews | Retain explicit “Planned · not yet interactive” and “Planned protocol · no results.” | Planned resources do not become interactive features or measured publications through visual polish. |

### 11.2 Bilingual workflow

1. Identify each source string in `scripts/render_site.mjs`, `site-data.json`, or the bilingual hub model. Record old copy → destination/new copy → supporting source before editing.
2. Update core-page keys and metadata in `content/tr.json` with the English change; for hub copy update both `locales`/SEO entries in `content/hub.json` or both arguments of `hubText`. Do not bypass missing-translation failures by adding English phrases to the intentional-English allowlist.
3. Follow `docs/localization-glossary.md`. Keep identifiers (`source-chunk-1`, `COMMITTED`, schema fields, repository names) exact. Explain technical terms in natural prose before using abbreviations.
4. Review Turkish sentence flow, punctuation, dotted/dotless I, ş/ğ/ç/ö/ü, long labels, table headings, and button wrapping. The current home slogan requires rewriting, not literal substitution.
5. Verify paired routes, `lang`, locale metadata, canonicals, hreflang, and language switching. Check Home, Data, article, Docs, and a long FAQ answer at 320/390 px in both languages.

No pricing, “book a demo,” sign-in, customer metrics, certification badge, security guarantee, or company/team story is added. Existing public repository/issues paths remain the contact/contribution mechanism.

## 12. Responsive Design Strategy

| Layout range | Home / marketing | System / reading surfaces |
| --- | --- | --- |
| 320–520 px | Single column, 20 px gutters, text and actions before a separate hero visual; full-width actions when needed. Heading wraps naturally; no forced two-line slogan. | Vertical diagrams/ordered lists; evidence detail below selection; TOC before article; stack source records with associated labels. |
| 521–800 px | Maintain separated image/copy unless their actual combined width supports overlap safely. Avoid fixed minimum hero height. | Two-column record groups only if labels remain readable; local horizontal scrolling for genuine data/code only. |
| 801–1100 px | Compact split hero with protected copy width, restrained visual crop. Menu behavior follows existing breakpoint. | Allow map to wrap to a vertical form before diagram labels shrink. TOC may stack according to available reading width. |
| >1100 px | Centered 1200–1360 px container; hero art remains bounded, with natural fade into black. | Two-column article shell with ≤720 px body; wide maps align labels without oversized empty hero zones. |

Use CSS grid `minmax(0, 1fr)`, intrinsic sizing, and explicit min-width resets on evidence/table panels. Never solve overflow by globally clipping the body: that conceals inaccessible content. Use native table semantics where a real table remains; if the Data source matrix becomes stacked records, each value needs its label programmatically and visually.

Preserve logical DOM order when changing visual order. Do not render separate desktop/mobile copies of the same content. Use `<picture>` for crop selection, not duplicate hidden images. At 200% text zoom and 400% browser zoom/reflow, actions, tables, disclosures, diagram descriptions, and navigation must remain reachable. Verify landscape mobile and long Turkish words. Existing no-JS mobile CSS exposes the navigation; confirm that expanded navigation does not overlap the absolute-positioned hero header before retaining that fallback unchanged.

Test 320, 390, 768, 1024, 1440, and 1920 px; also test 799/800/801 and 1099/1100/1101 around affected transitions. Whole-document overflow target is ≤1 px; overflow within a labeled, keyboard-accessible code/table region is acceptable when the data genuinely requires it.

## 13. Performance Strategy

### 13.1 Observed size priorities

| Existing asset | Raw bytes | Local gzip size (diagnostic only) | Implication |
| --- | --- | --- | --- |
| `dist/styles.css` | 104,825 | 20,124 | Cascade complexity matters more than its compressed size alone. Consolidate safely. |
| `dist/app.js` | 3,212 | 1,119 | Keep the runtime small; no animation framework needed. |
| `dist/assets/mesa-logo.png` | 535,223 | 529,119 | Largest obvious shared image cost; optimize the existing mark first. |
| Instrument Sans TTF | 194,336 | 112,117 | Convert to WOFF2 from the licensed source if tooling is available; validate glyphs. |
| Instrument Serif Italic TTF | 71,592 | 35,954 | Reduce widespread usage; avoid fetching where no serif is used. |
| Commit Mono WOFF2 | 86,768 | 86,762 | Already compressed; constrain usage and avoid unnecessary preload. |

Local gzip figures are not observed CDN transfer sizes. Browser caching, HTTP compression, load timing, and actual requested subsets require network measurements. The 29.5 KiB desktop hero is modest compared with the current 522.7 KiB logo; do not begin by degrading nebula quality further.

### 13.2 Proposed budgets and validation

| Metric | Target for redesigned pages | Validation |
| --- | --- | --- |
| LCP | ≤2.5 s | Three cold Lighthouse mobile runs per representative EN/TR template; inspect median and worst run. Later field p75 if sufficient data exists. |
| CLS | ≤0.1, aim ≤0.05 | Full load + image/font arrival + menu/diagram/disclosure interaction. Reserve image dimensions and stabilize font metrics. |
| INP | ≤200 ms field p75 when available | No field value claimed from a local test; use browser interaction traces and long-task review during implementation. |
| Lab main-thread proxy | Lighthouse TBT ≤200 ms | Same device/CPU/network settings, cached state reset. TBT is not an INP measurement. |
| Lighthouse scores | Performance ≥90 mobile, ≥95 desktop on representative pages | Advisory regression signal, accompanied by actual timings; do not trade readable text for score. |
| JS delivery | ≤8 KiB gzip per page | Measure generated payload; no animation dependency by default. |
| CSS delivery | ≤25 KiB gzip initially, preferably ≤20 after consolidation | Compare actual HTTP-encoded transfer and local gzip as separate evidence. |
| Initial font delivery | ≤140 KiB compressed on marketing pages; ≤180 KiB on technical pages | WOFF2 conversion/subsetting with full needed EN/TR glyph coverage; preload only the proven critical face. Revisit budget if exact licensed font cannot meet it without glyph loss. |
| Logo + favicon | ≤40 KiB combined delivery | Preserve appearance at 1×/2× display sizes; use appropriately sized derivatives, not traced or invented branding. |
| Initial page transfer | ≤400 KiB compressed at 390 px, ≤500 KiB desktop | Includes HTML/CSS/JS/fonts/critical images, excludes below-fold deferred assets. Verify actual requests. |
| Hero images | Supplied 30,238-byte desktop or 27,636-byte mobile file; one selected request | Browser network panel confirms correct source, no duplicate preload/background request. |
| Diagrams | No library; individual markup budgets in §9; ≤10 ms typical selection-handler work as a profiling target | Static HTML/SVG parsing and interaction traces on mobile CPU throttling. No perpetual animation or layout thrashing. |
| Homepage length | ≤9,000 px EN and ≤10,000 px TR at 390 × 844 | Same fonts/viewport as baseline. Product clarity and access to information remain required. |

[Core Web Vitals guidance](https://web.dev/articles/vitals) uses LCP, INP, and CLS and field assessment at the 75th percentile. The transfer and homepage-length budgets above are project proposals, not industry certification thresholds or existing results.

Implementation priorities: optimize shared mark/favicon; establish font strategy with Turkish coverage; integrate one correct hero crop; reserve media space; remove redundant CSS rules only with visual parity checks; keep runtime effects event-driven. Do not preload all fonts, all nebulae, or below-fold diagrams. Keep articles free of heavy media. Do not add image filters/backdrop blur/continuous painted gradients to create atmosphere.

Record Lighthouse/browser versions, OS/device, CPU/network profile, URL, viewport, cache state, three run artifacts, median/worst timings, and before/after payloads. Production CDN behavior must be checked after a later authorized deployment; localhost timings alone do not establish deployed performance. No analytics service is required merely to finish this redesign.

## 14. Accessibility Strategy

Target **WCAG 2.2 AA**, with checks mapped to actual components rather than a claim of conformance from a checker pass. [WCAG 2.2](https://www.w3.org/TR/WCAG22/) is the reference; this plan does not certify the existing site.

- Text contrast: ≥4.5:1 normal text, ≥3:1 qualifying large text. Essential control boundaries, selected states, and meaningful diagram graphics need ≥3:1 against adjacent colors. Decorative separators may be lower contrast. Recheck every image overlay and disabled/planned label.
- Keep one page h1, one semantic main, meaningful heading progression, landmarks, skip link, programmatically labeled nav and language controls. Keep `aria-current` accurate. Footer heading scale need not force visual importance.
- Preserve mobile Escape-close/focus return and native FAQ details. Ensure tab order reaches all links. Use native buttons for diagram actions; keyboard activation changes selected state just like pointer activation. Status labels always include words.
- Decorative nebula wrappers remain `aria-hidden` and `pointer-events:none`, with empty image alt. Meaningful diagrams use figure/caption and a concise description plus an equivalent HTML list/table. An interactive subtree must not be hidden by a decorative wrapper.
- Announce selected evidence through an appropriately labeled detail region; use polite status feedback only when necessary, with no repeated narration from decorative highlights. Copy buttons should expose success/failure feedback without removing the copied text.
- All movement has a reduced-motion final state. Essential content is never initialized at opacity zero while waiting for JS. No flashing, scroll hijacking, autoplay carousel, or timed disclosure.
- Prefer ≥44 px targets; ensure WCAG minimum target-size/spacing requirements across small inline links. Visible focus must not be clipped by overflow containers or hidden under headers. A modal focus trap is not needed for the existing nonmodal menu.
- Retain working no-JS navigation/content; test failed-image, blocked-font, clipboard-denied, and JS-disabled cases. Review the current early `.js` class behavior if enhancement initialization fails: mobile navigation must stay reachable when `app.js` cannot load.
- Article TOC, section anchors, code, tables, metadata, and related links remain usable with zoom and keyboard. Underline reading-area links so color is not the sole cue. Translate accessible labels and live feedback; use `lang` for intentional language changes where meaningful.

Validation: existing structural checker; an available accessibility scanner (browser tooling or an explicitly introduced audit tool, not a runtime dependency); keyboard-only traversal; manual contrast checks; NVDA/Firefox or VoiceOver/Safari reading of Home, a diagram, Data source table, article, and mobile menu; reduced-motion setting change; 200% text/400% reflow. Scanner success does not replace manual review. Record any platform not tested.

## 15. SEO and Deployment Considerations

Preserve the static route directory model, not-found behavior, `CNAME`, `.nojekyll`, and GitHub Pages Actions deployment. No SPA fallback, server API, dynamic route rewrite, or Sites-hosting migration is proposed.

Current `.github/workflows/pages.yml` uses `actions/checkout@v6`, `configure-pages@v5`, `upload-pages-artifact@v4`, and `deploy-pages@v4`; its build receives `steps.pages.outputs.base_url`, validates `_site`, then deploys with the required environment and permissions. Keep those settings unless a separately established deployment problem requires change. Context7's GitHub documentation corroborates the [custom-workflow artifact/deployment model](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). [Custom-domain behavior](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages) makes base-path verification necessary; do not infer hosting state from `CNAME` alone.

Implementation requirements:

1. Regenerate from sources into `dist` only after the associated source changes are ready; build `_site`/temporary outputs from that. Ensure generated HTML and authoritative assets are committed together when implementation is later committed.
2. Resolve all new media and diagram links with current relative helpers. Test `/`, `/mesa.github.io/`, nested `/tr/learn/.../`, and 404 recovery. Never add root-relative `/media/...` paths that bypass the project prefix.
3. Preserve canonical self-URLs, EN/TR/x-default alternates, unique localized titles/descriptions, static article/breadcrumb structured data, robots and sitemap. Keep draft/nonindexable entries excluded; the current `hubRoutes` filter already does this.
4. If hero copy changes, synchronize title/description/social-card text where appropriate. Keep both EN/TR social images at 1200 × 630; verify contrast if art direction changes. Avoid SoftwareApplication ratings, offers, organization data, or other unsubstantiated structured claims.
5. Preserve existing section anchors used by CTAs and publications. If merging Why MESA into Problem, retain a meaningful target for `#why-mesa`, not a dead fragment. Do not rename public paths for marketing terminology.
6. Do not claim the live domain serves this checkout or these proposed designs without later checking the deployed version. This audit validates local deployment artifacts only.

## 16. Phased Implementation Roadmap

All phases below are **future work**, except the explicitly completed planning/audit work in Phase 1. File paths are repository-relative. Each phase should be independently reviewable and reversible; preserve passing output before moving on.

### 16.1 Shared validation commands

Run from `/home/yasin/Desktop/mesa_website/photos/site`. Command labels below are referenced by every phase to avoid ambiguous “run tests” instructions. Temporary output directories are dedicated to this task; `build_site.py` replaces its output directory.

**V1 — syntax and whitespace (no generated source changes):**

```bash
node --check scripts/render_site.mjs
node --check dist/app.js
git diff --check
```

**V2 — custom-domain build and static validation:**

```bash
python3 scripts/build_site.py --output /tmp/mesa-redesign-audit/production --site-url https://mesamemory.dev/
python3 scripts/check_site.py /tmp/mesa-redesign-audit/production
```

**V3 — project-site and user-site fallbacks:**

```bash
python3 scripts/build_site.py --output /tmp/mesa-redesign-audit/project --repository Yasou13/mesa.github.io
python3 scripts/check_site.py /tmp/mesa-redesign-audit/project
python3 scripts/build_site.py --output /tmp/mesa-redesign-audit/user --repository Yasou13/Yasou13.github.io
python3 scripts/check_site.py /tmp/mesa-redesign-audit/user
```

**V4 — local HTTP and repository browser checker:**

```bash
python3 -m http.server 8765 --bind 127.0.0.1 --directory /tmp/mesa-redesign-audit/production
```

With that preview running, a future implementation environment with Chrome/CDP access can use the existing checker:

```bash
node scripts/check_browser_layout.mjs --base-url http://127.0.0.1:8765/
```

It currently checks all localized routes at desktop width, six English-home widths, mobile menu, image decode, and fixed scene order. It does **not** provide a comprehensive multilingual multi-width accessibility, visual, performance, or reduced-motion audit. Its scene constants and expectations must evolve with Phase 3 without weakening route/asset checks. In this planning session, visual inspection used the supported in-app browser; V4's repository Chrome checker was not run.

**V5 — publishable generated HTML refresh, only in an implementation phase:**

```bash
node scripts/render_site.mjs --output dist --site-url https://mesamemory.dev/
```

Then run V1/V2; use V3 for changes involving links/media/metadata. Planning does not run V5 because it modifies tracked application output.

**V6 — asset inventory (standard Python, no Pillow dependency):**

```bash
python3 - <<'PY'
from pathlib import Path
import gzip
for folder in ('dist/fonts', 'dist/media'):
    root = Path(folder)
    if root.exists():
        for item in sorted(root.rglob('*')):
            if item.is_file():
                print(item, item.stat().st_size)
for name in ('styles.css', 'app.js'):
    item = Path('dist') / name
    print(item, item.stat().st_size, 'gzip', len(gzip.compress(item.read_bytes())))
PY
```

V6 checks bytes, not browser requests/crops. Use the network panel for actual loading priorities and selected source. Performance/accessibility audits use available browser tooling; do not assume Lighthouse/axe or Safari are installed or invent a passing CLI result. If adding an audit dependency later, pin it and document the exact command/version before making it a gate.

### Phase 1 — Repository audit and evidence baseline

- **Goals:** Record real architecture, route coverage, claim limits, asset suitability, baseline behavior, and implementation decisions.
- **Files likely to change:** This planning document only. Future audit records may live under `docs/design/` without replacing historical reports.
- **Components affected:** None at runtime; inspected all shared page families and contracts.
- **Dependencies:** Website checkout, user brief, supplied ZIP, pinned upstream evidence.
- **Tasks:** Inventory tracked files; inspect source/generation/deploy flow; review assets; run V2/V3; inspect representative browser layouts; list unknowns and separate historical results from fresh evidence.
- **Risks:** Treating old reports as current truth; auditing `photos/` as though it were the Git root; overstating browser/backend coverage.
- **Acceptance criteria:** 37 EN route identities plus matching TR and 404 accounted for; limitations documented; only planning file added.
- **Validation commands:** V2, V3, `git status --short`; results recorded in §2. V1 whitespace check for the final document.
- **Expected deliverables:** This complete plan, source/evidence links, asset inventory, measured layout/size baseline. **Status: completed for the documented scope.**

### Phase 2 — Design system and shared foundations

- **Goals:** Establish authoritative tokens, page typography variants, spacing, and stable control styles while retaining behavior.
- **Files likely to change:** `dist/styles.css`; shared classes in `scripts/render_site.mjs`; `docs/design/02_ART_DIRECTION.md` or a new design decision record. Font/logo files can be optimized in Phase 9, not required for token work.
- **Components affected:** Header, buttons, section headings, cards/rows, article/utility headers, focus styles.
- **Dependencies:** Phase 1 baseline and §10 specifications.
- **Tasks:** Document computed style ownership; consolidate touched token/rule duplicates; introduce explicit marketing/system/reading variants; keep compatibility aliases; validate focus/control contrast; preserve existing font family/license choices.
- **Risks:** Cascade regressions across 74 pages; unsolicited full stylesheet rewrite; Turkish line breaks.
- **Acceptance criteria:** One authoritative definition for each migrated token; no new override era; intended component changes visible with unrelated page layouts stable; menu/copy/FAQ behavior retained.
- **Validation commands:** V1, V5, V2; V4 or supported browser inspection of Home/Core/Law/article/Docs at 390 and 1440. Record computed colors and actual contrast.
- **Expected deliverables:** Reusable tokens/component variants, EN/TR reference screenshots, concise style ownership record.

### Phase 3 — Homepage composition and bilingual copy

- **Goals:** Explain the product within 5–10 seconds and bring evidence forward; reduce redundant sections.
- **Files likely to change:** `scripts/render_site.mjs` (`home`, `actionExample`, `footer`, `publicFlow`), `content/tr.json`, `site-data.json` metadata only as needed, `dist/styles.css`, generated `dist/**/index.html`; scene assertions in `scripts/check_site.py` and `scripts/check_browser_layout.mjs`.
- **Components affected:** Home hero, problem bridge, fixture compact variant, process, ecosystem preview, destination rows, compact closing/footer variant.
- **Dependencies:** Phase 2; source-backed copy candidates in §6/§11.
- **Tasks:** Apply six-section composition without adding media yet; relocate valuable prose to detail routes; keep anchors; expose dated status; update both locales; align semantic scene checks with intentional new composition. Retain media-optional fallback.
- **Risks:** Losing deep links, hiding limitations, treating a static example as a demo, weakening checks merely to make changed markup pass.
- **Acceptance criteria:** Fixture heading y≤1,800 at 390 px; total home ≤9,000 EN/≤10,000 TR at 390 × 844; full fixture and sources remain accessible; one h1/main; 10-second comprehension target scheduled/performed and results recorded.
- **Validation commands:** V1, V5, V2; V4 plus manual 320/390/768/1440 EN/TR screenshots, CTA/anchor/language-switch checks. Do not mark a usability study passed without participants.
- **Expected deliverables:** Recomposed bilingual home, content relocation ledger, aligned scene contracts, reviewable before/after captures.

### Phase 4 — Static cosmic asset integration

- **Goals:** Add atmospheric identity without obscuring copy or increasing rendering complexity.
- **Files likely to change:** `dist/media/desktop/*.webp`, `dist/media/mobile/*.webp`, `content/media-scenes.json`, `scripts/render_site.mjs` (`sceneLayer`/poster helper and validation), `dist/styles.css`, relevant checker asset assertions, `docs/visual-sources.md`, generated pages.
- **Components affected:** Home hero; reusable bounded poster field for later Core/Data use. Horizon remains optional.
- **Dependencies:** Phase 3 stable composition and actual ZIP dimensions in §7.
- **Tasks:** Copy selected supplied WebPs unchanged; record provenance; wire home poster pair with base-aware paths; add priority/dimensions/fallback; avoid scene-wide auto-population; support additional manifest records safely.
- **Risks:** Incorrect mobile crop, old overlay making image invisible, duplicate downloads, upscaling, fabricated licensing/photography credits.
- **Acceptance criteria:** One selected hero crop request per viewport; readable failed-image fallback; no original JPG downloads; no image distortion or continuous animation; desktop/mobile contrast and layout shift verified. Core/Data may wait for Phase 5 to mount their images.
- **Validation commands:** V1, V5, V2, V3, V6; browser network/source/crop checks at 390/800/1024/1440/1920 and image-failure inspection.
- **Expected deliverables:** Static hero integration, safe reusable poster primitive, asset attribution/inventory record, crop/contrast evidence.

### Phase 5 — Core and Data pages

- **Goals:** Replace empty technical hero plates with useful architecture/pipeline explanations.
- **Files likely to change:** `scripts/render_site.mjs` (`mesa`, `dataPage`, `architectureFlow`), `content/tr.json`, `dist/styles.css`, `dist/app.js` only for justified stage selection; optional `content/diagram-fixtures.json`; generated pages.
- **Components affected:** Core memory/storage/scope diagrams, Data source matrix/pipeline, bounded structure/flow image fields.
- **Dependencies:** Phases 2/4; pinned state/source contracts for diagrams A/D.
- **Tasks:** Implement static accessible A/D first; integrate optional Core/Data intro artwork without diagram overlap; improve memory-versus-projection explanation; show seven stages/human boundary and configured source state; update translations/captions.
- **Risks:** Suggesting universal ingestion, automatic delivery, unreviewed status names, or projections as canonical storage.
- **Acceptance criteria:** SQLite ownership and human-started COMMITTED-only delivery clear; source states exact; image fields remain subordinate; diagrams fully understandable without JS and at 320 px.
- **Validation commands:** V1, V5, V2, V3; V4 plus source/caption comparison, keyboard/zoom review, Data table and Core scope checks in EN/TR.
- **Expected deliverables:** Distinct Core/Data compositions, source-linked static diagrams, source matrix and documented optional interaction states.

### Phase 6 — Ecosystem, retrieval, and graph visualizations

- **Goals:** Explain component boundaries and four-origin evidence accurately with small optional interactions.
- **Files likely to change:** `scripts/render_site.mjs` (`ecosystem`, `actionExample`, graph/retrieval helpers), `dist/app.js`, `dist/styles.css`, `content/tr.json`, selected `content/hub.json` diagram blocks; optional fixture metadata; checkers and generated pages.
- **Components affected:** Diagrams B/C/E, compact home versions, related Learn diagrams, component subnav.
- **Dependencies:** Phase 5 static primitives; named source/test/commit and mock limitations from §9.
- **Tasks:** Build parallel retrieval lanes with pre-fusion scope; distinguish primary/supporting evidence; create generic/legal ecosystem maps; put QA/E2E outside runtime; add selection/Step only when useful; keep static alternatives.
- **Risks:** Invented graph topology, wrong RRF semantics, implying live retrieval, certification coverage incorrectly spanning Law.
- **Acceptance criteria:** Exact fixture rank/score; duplicate hits add no votes; mock captions visible; no confidence percentages; Profile B labeled Data → Core only; Law live integration pending; keyboard selection and reduced-motion final state pass.
- **Validation commands:** V1, V5, V2, V3; V4 plus source-to-diagram checklist, manual keyboard/touch/reduced-motion review, interaction profiling against §13 budgets.
- **Expected deliverables:** Five completed diagram families across Phases 5/6, optional shared controller, technical evidence review record.

### Phase 7 — Remaining pages, publishing layouts, and content refinement

- **Goals:** Give Law, trust pages, Docs, and knowledge content their appropriate composition and bilingual voice.
- **Files likely to change:** Remaining renderer page functions, `renderHubIndex`, `renderLearnHubIndex`, `renderHubEntry`, `renderHubBlock`, `footer`; `content/hub.json`, `content/tr.json`, relevant `site-data.json` metadata; `dist/styles.css`; generated pages; `CLAIMS.md` only when recording newly verified claim decisions.
- **Components affected:** Law workflow specimen, QA timeline, certification/status ledger, FAQ, About, Use Cases, Docs/MCP directories, all hub indexes and detail templates, 404.
- **Dependencies:** Phase 2 system and Phase 6 diagram vocabulary; additional Law UI verification only if actual screenshots are proposed.
- **Tasks:** Apply every route strategy in §5; keep publication fields and related-content links; reduce repeated closing CTA on reading pages; review absolute Learn language; use illustrative Law HTML unless a real source-verified UI capture is available.
- **Risks:** Fabricated legal features, false live status, untranslated hub chrome, promotional clutter in articles, accidental draft exposure.
- **Acceptance criteria:** 74 public localized routes plus noindex 404 preserved; all 15 detail publications accounted for; no invented tool interaction or research results; article body ≤720 px, idiomatic TR checked, status date visible.
- **Validation commands:** V1, V5, V2, V3; V4 plus one visual sample per template/locale, full route-link review, research/tool/status copy verification.
- **Expected deliverables:** Completed page family refinements, bilingual editorial review, preserved information/route inventory.

### Phase 8 — Responsive and accessibility completion

- **Goals:** Close the remaining device, interaction, contrast, and assistive-technology gaps; accessibility is also checked in earlier phases.
- **Files likely to change:** `dist/styles.css`, shared markup and `dist/app.js` for actual findings; checker coverage; translations of accessible labels; generated pages; a QA report under `docs/design/`.
- **Components affected:** Menu/subnav, diagram controls, source records, article TOC/tables, footer, all image/text combinations.
- **Dependencies:** Complete page compositions; actual assets and interactive states.
- **Tasks:** Six-width matrix and breakpoint edges; EN/TR long text; 200% text/400% reflow; keyboard and screen-reader samples; image/font/JS failures; live reduced-motion preference change. Expand browser checks only for meaningful regression contracts.
- **Risks:** Treating zero overflow as full accessibility; clipping instead of fixing; inaccessible SVG controls; JS class hiding nav after failed script load.
- **Acceptance criteria:** No document overflow/clipped essential content; contrast targets met; menu and disclosures usable; meaningful equivalent text for diagrams; test platforms and residual limitations recorded.
- **Validation commands:** V1, V5, V2, V4; V3 if markup paths change. Use available scanner/browser tools and document exact versions/results; no unperformed manual checks marked passed.
- **Expected deliverables:** Responsive captures, accessibility findings/resolutions, assistive-technology and failure-mode evidence.

### Phase 9 — Performance, SEO, and asset efficiency

- **Goals:** Meet measurable budgets while preserving text, visual quality, localization, and existing deployment behavior.
- **Files likely to change:** Optimized derivatives in `dist/assets/`, `dist/fonts/`, optional same-crop media variants; `dist/styles.css`, `dist/app.js` if profiling warrants; `documentShell()`/asset hashes; EN/TR metadata/social cards; generated sitemap/robots/HTML. Keep workflow unchanged unless an evidenced defect requires a scoped fix.
- **Components affected:** Shared mark/favicon/fonts, critical hero loading, metadata/social preview, diagram/render payload.
- **Dependencies:** Phase 8 stable layouts and actual network/performance baseline.
- **Tasks:** Resize existing mark faithfully, separate favicon, convert/subset fonts with Turkish glyph coverage and retained OFL files, inspect actual LCP, avoid duplicate preloads, consolidate remaining touched CSS, run repeated cold audits, verify canonical/hreflang/indexability and three deployment modes.
- **Risks:** Missing Turkish glyphs, altered logo fidelity, font CLS, misleading local metrics, breaking the hybrid `dist` source/output model.
- **Acceptance criteria:** §13 budgets measured or explicit justified exceptions documented; no route/SEO regression; no increased JS dependency footprint; no degraded readable content.
- **Validation commands:** V1, V5, V2, V3, V6; V4; available Lighthouse/browser performance tooling with recorded settings and three-run artifacts. Network request audit for each image family.
- **Expected deliverables:** Asset and payload diff, performance report, SEO/deployment artifact matrix, EN/TR glyph/social preview checks.

### Phase 10 — Final QA and GitHub Pages readiness

- **Goals:** Produce a reviewable static release candidate and validate the existing Pages path without deploying during planning.
- **Files likely to change:** Final generated `dist/` refresh; QA/checker fixes supported by findings; new final report in `docs/design/`. `.github/workflows/pages.yml` and `dist/CNAME` are review targets, not automatic change targets.
- **Components affected:** Entire built site, external destinations, deep links, failure states, deployment artifact.
- **Dependencies:** Phases 2–9 complete; claim and language review complete; any missing browser platforms recorded.
- **Tasks:** Fresh build from the implementation branch; three hosting modes; all routes and anchors; external source-link availability; real Chrome six-width checks; EN/TR representative Safari/iOS/Firefox checks; image/font/JS failure and reduced motion; compare final diff against scope; record remaining risks and release evidence.
- **Risks:** Local build mistaken for deployed validation; stale committed HTML; unreviewed status refresh; artifacts diverging from source.
- **Acceptance criteria:** §18 checklist satisfied, no unexplained route/claim loss, no blocker concealed by reduced checker coverage. A later deployment uses the existing Pages workflow only within the authorized implementation/release task; then verify actual deployed deep links, assets, and metadata.
- **Validation commands:** V1, V5, V2, V3, V4, V6; `git diff --stat` and `git status --short`; run any added meaningful validation gates. Record production URL/commit only after deployment actually occurs.
- **Expected deliverables:** Final QA report, complete static artifact/source diff, precise release limitations and rollback reference. This phase is not completed by the planning document.

## 17. Risks and Trade-offs

| Risk / trade-off | Mitigation / decision |
| --- | --- |
| Existing project is already partly redesigned | Preserve its accurate copy, functional architecture, native interactions, and all route contracts. Historical audit complaints do not automatically describe today's checkout. |
| Multiple CSS eras make global cleanup risky | Consolidate touched components in controlled phases, using visual parity and computed-style checks. Avoid a giant rewrite and avoid yet another appended theme. |
| Static assets mismatch the earlier five-video storyboard | Supersede media placement intentionally. Keep null fallback support; do not invent missing video or fill every section. Update required-scene checks as a coordinated contract change. |
| Nebula detail competes with technical content | Bounded image fields; opaque reading/diagram surfaces; no image behind source tables or graph labels. Horizon remains unused unless it earns a specific purpose. |
| Source resolution limits premium large-screen rendering | Bound art and preserve negative space; retain original files. Request higher-resolution sources only if final large-screen review demonstrates a real need; do not pretend these are 4K. |
| Generated imagery mistaken for scientific photography | Record ZIP provenance as user-supplied Google Flow visuals; do not invent astronomical identity/credits or licensing assertions. |
| Marketing implies readiness beyond source evidence | Dated status and source-linked claims; separate repository code, mocked fixtures, unexecuted integrations, and planned features. No new product metrics. |
| Graph visualization overstates proof | Use named tests and visible mock limitations; verify any actual multi-hop execution source before illustrating it as runtime behavior. |
| Diagram interactivity adds code and accessibility complexity | Begin static; add selection only when it helps explain evidence. Keep HTML alternatives and meaningful local controls; no live backend connection. |
| Reduced homepage length hides necessary detail | Keep complete detail routes and deep links; compact only duplicated homepage explanation. Essential scope/status stays visible. |
| EN/TR divergence or lost glyphs | Build-time translation checks plus native-language review and explicit glyph checks after font optimization. Never treat UTF-8 parsing as a glyph/rendering test. |
| `dist/` contains source assets as well as output | Preserve asset tree during regeneration; never clean/delete `dist` wholesale. Test temporary output directories and inspect generated diffs. |
| Third-party docs evolve while site status is static | Pin reviewed evidence in the claim ledger, keep public links usable, and display status date. Newly verified product changes are a separate evidence update, not automatic redesign work. |
| Benchmark goals confused with achieved performance | Label targets and measurements separately; use repeated lab runs and field data only if available. Do not describe INP using a Lighthouse TBT result. |
| Browser/platform coverage incomplete | Current audit documents sampled Chromium views and a timed-out sweep. Final implementation requires its own complete matrix and explicit residual gaps. |

## 18. Acceptance Criteria

### 18.1 This planning deliverable

- [x] All 19 requested sections present.
- [x] Existing repository/framework/routes/components/styles/animations/localization/SEO/deployment inspected, with retained strengths identified.
- [x] Every major route and all 15 detail publications have a specific strategy; EN/TR preservation is explicit.
- [x] Four desktop/mobile asset pairs visually inspected and measured; placement is selective, with horizon optional.
- [x] Five technical visualization plans specify purpose, placement, source behavior, implementation, interaction, performance impact, and evidence limits.
- [x] Ten independently verifiable phases document goals, files, components, dependencies, tasks, risks, acceptance, commands, and deliverables.
- [x] Local custom-domain/project-site/user-site builds and static checks passed; fresh browser observations are distinguished from historical reports and unperformed tests.
- [x] Application source/content/assets/deployment configuration unchanged; this plan is the only repository addition.

### 18.2 Future implementation release gate

- [ ] All 74 localized routes and 404 remain valid; no source-backed information/functionality lost; deep anchors preserved or deliberately maintained as equivalents.
- [ ] Home explains product/problem/next action within 5–10 seconds; comprehension check performed with results recorded.
- [ ] Fixture placement and EN/TR length targets in §6 are met without clipping or concealing essential information.
- [ ] Every claim/diagram has a reviewed source or is explicitly labeled conceptual/planned; fixture mocks and non-benchmark status remain visible.
- [ ] Data modes/human publishing boundary, Core storage authority and pre-fusion scope, QA/E2E distinctions, and Law integration limits remain accurate.
- [ ] Exactly the intended crop loads at tested viewports; images retain integrity; failed media leaves usable content; no continuous ambient overload.
- [ ] No new framework/runtime animation dependency without a documented, measured necessity.
- [ ] Keyboard, touch, screen-reader samples, contrast, 200%/400% reflow, no-JS/failed-JS, reduced motion, and failure states pass or have explicit release-blocking findings.
- [ ] Performance/payload budgets measured with reproducible settings; INP field availability stated accurately; no fabricated scores.
- [ ] Unique EN/TR metadata, canonical/hreflang, sitemap/robots, structured data, social cards, nested media paths and three hosting modes pass.
- [ ] Final source and generated `dist` agree; existing Pages workflow/custom-domain configuration preserved; browser/platform coverage and remaining risks documented.
- [ ] Any later deployment is separately recorded and the actual deployed build is verified; no local preview is presented as a published redesign.

## 19. Recommended Implementation Order

1. **Keep the completed audit as the baseline.** Start from the actual `site/` repository and preserve its existing claim/version evidence.
2. **Establish tokens and component variants.** Keep layout/content stable enough to detect CSS regressions.
3. **Recompose and translate Home.** Move the example forward and reduce repeated explanation before adding artwork.
4. **Integrate the static hero and poster primitive.** Validate crops, contrast, priority, and fallbacks; leave unnecessary scene media empty.
5. **Deliver Core/Data static diagrams and distinct page openings.** Add their small image fields only where they support composition.
6. **Complete ecosystem/retrieval/graph explanations.** Add optional interaction after source accuracy and static accessibility are established.
7. **Refine remaining product, trust, directory, and article templates in both languages.** Preserve current publication and readiness boundaries.
8. **Complete responsive/accessibility review.** Resolve findings across every template and interaction state.
9. **Optimize shared logo/fonts, verify measured performance and SEO.** Keep image integrity and Turkish coverage.
10. **Run final static/browser/deployment-artifact QA.** Produce a reviewable release candidate and record actual deployment separately if later performed.

The website remains on its current static GitHub Pages architecture. The result sought is a clearer product explanation with tangible evidence and selective cosmic atmosphere. **This document prepares that implementation; it does not implement or deploy the redesign.**
