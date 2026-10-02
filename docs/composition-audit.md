# MESA Website — Composition, Art Direction & Visual Rhythm Audit

**Audit Date**: 2026-10-02  
**Target**: https://mesamemory.dev/  
**Branch**: `website/composition-art-direction-loop`

---

## 1. Visual Repetition & Layout Formula Audit

Inspection of all 15 core routes and hub templates revealed four primary sources of visual repetition:

1. **Monotonous Section Headings**:
   - Almost every section across all pages uses the identical pattern:
     ```html
     <div class="section-heading">
       <div>
         <p class="eyebrow">...</p>
         <h2>Title Line 1<br><em>Title Line 2</em></h2>
       </div>
       <p>Section descriptive paragraph...</p>
     </div>
     ```
   - Nearly 100% of headings featured `<br><em>...</em>`, creating an artificial rhythm where every title followed the same 2-line cadence.

2. **Repetitive Card Enclosures**:
   - `.principle-grid article`, `.ecosystem-card`, `.law-grid article`, `.use-case-grid article`, `.about-grid article`, and `.tool-card` all shared identical square/rectangular boxes with `padding: 30px`, `border: 1px solid var(--line)`, and a monospace tag at top-left.
   - This made Problem, Use Cases, Law, About, and Architecture feel like the same template filled with different text.

3. **Indiscriminate Grid Background (`.grid-bg`) Usage**:
   - Grid backgrounds were applied indiscriminately to 12 different sections, including purely narrative, editorial, and legal contexts:
     - `closing-cta grid-bg` (Final CTA)
     - `page-hero compact grid-bg` (How it works, Use cases, About)
     - `reliability-section grid-bg` (Why MESA / Principles)
     - `reference-callout grid-bg` (Use Cases callout)
     - `trust-state grid-bg` (Evaluation page)
     - `faq-next grid-bg` (FAQ bottom)
     - `not-found grid-bg` (404 page)
   - **Remedy**: Grid must be strictly restricted to genuine system/technical surfaces (How it Works system preview/page, MESA in Action technical specimen, Core physical stores & retrieval, Ecosystem system map, Data release pipeline).

4. **Instrument Serif Over-saturation**:
   - Instrument Serif italic was applied across every page hero and heading accent.
   - **Remedy**: Restrict to rare editorial devices (~3–5% of typography): exactly 1 word in the Hero headline (`<em>evidence</em>`), 1 key editorial statement in About/Law, and the Final CTA. Instrument Sans remains the dominant typographic voice, with Commit Mono for technical metadata.

5. **Hero Clutter & Static Animation**:
   - The hero SVG was a single pre-drawn path revealed via CSS dash-offset rather than true sequential graph traversal.
   - The hero contained redundant technical UI (`TRACE / 04`, `scope: dataset-a`, fake telemetry) that detracted from the core editorial message: *"Memory with evidence, not mystery."*

6. **MESA in Action Subordination**:
   - The verified fixture (`Alice knows Aurora`, `source-chunk-1`, `4 ÷ 61` RRF) was cramped into a standard section box instead of acting as the site's undeniable visual and technical centerpiece.

---

## 2. Three Primary Visual Modes Strategy

| Mode | Purpose | Visual Characteristics | Assigned Sections / Surfaces |
|---|---|---|---|
| **EDITORIAL** | Narrative, problem, concept, positioning | Plain obsidian background (`#0b0c0f`), large high-contrast typography, ample whitespace, borderless asymmetric layouts, fine archival textures | Home Hero copy, Problem, Why MESA, Use Cases, About, Final CTA |
| **SYSTEM** | Architecture, retrieval, flow, code, runtime behavior | Technical grid (`.grid-bg`), structured schematics, hairline alignment, code terminals, signal badges, nodes & edges | How MESA Works, Core Storage & Retrieval, Ecosystem System Map, Build with MESA |
| **ARCHIVE** | Evidence, provenance, fixture, status, verification | Commit Mono metadata, hairline rules, document specimen frames, warm copper (`--copper`) accents, gazette/manuscript textures | MESA in Action Centerpiece, MESA Law Reference Plate, Data Pipeline, E2E Certification Dossier, Status Rail |

---

## 3. Page-Specific Art Direction Plan

- **Home**: Editorial narrative pacing leading into the expanded MESA in Action centerpiece; genuine sequential node traversal in hero; no clutter.
- **How It Works**: Deep technical architecture, memory anatomy, 6-step public flow, physical store lifecycle.
- **Ecosystem**: Comprehensive system map (`Sources → Ingestion → Core → Application` with external `QA` and `Certification` layers).
- **Core**: Infrastructure specification, SQL ledger vs LanceDB/Kùzu projections, 4-lane True RRF, nested authorization hierarchy.
- **Data**: Archival source preparation, configured Turkish legal sources table, immutable 7-stage release pipeline, gazette plate.
- **QA**: Behavioral testing over time, restart endurance, candidate-only repair isolation, temporal sequence traces.
- **Certification**: Evidence dossier, fail-closed status, B0–B14 verification gates, qualification record transparency.
- **Law**: Archival legal reference plate, matter workspace, review gates, HTTP contract boundary.
- **Docs**: Dense, functional, fast technical directory with code quickstart and zero decorative distraction.
- **Status**: Operational reality, audit timeline, gate blockers, NO-GO transparency.
- **About**: Architectural purpose, maintainer chronicle, public issue gateway, quiet archival visual.
- **FAQ**: Clean information design, high-contrast accordion list, direct answers.
