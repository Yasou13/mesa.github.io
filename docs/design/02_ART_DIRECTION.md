# MESA Phase 1 Art Direction

## Concept: Order from Chaos

MESA's visual story begins with scale and uncertainty, then becomes progressively more explicit: an unknown field becomes a bounded path; distant points become relationships; relationships become a verified retrieval structure. The design must feel cinematic without turning the product into a fictional spacecraft interface.

The site remains useful before any final media exists. Typography, editorial composition, restrained contrast, and verified product diagrams carry the experience. Future media is atmosphere behind the content, never a replacement for it.

## Visual principles

1. **Darkness is space, not decoration.** Large quiet fields create scale and safe areas. They do not contain fake black holes, particle storms, or neon rings.
2. **Structure arrives gradually.** Early sections use sparse contrast; later sections introduce rules, ledgers, diagrams, and the verified MESA in Action specimen.
3. **Technical truth stays foregrounded.** Product claims, status language, evidence fields, and architecture remain readable HTML.
4. **Warmth is evidence.** Amber marks provenance, proof, and reviewed boundaries. It is not a general brand fill.
5. **Cold light is orientation.** Blue is used for navigation, relationships, scope, and controlled focus.
6. **Page character comes from composition.** Pages do not receive the same hero plus three-card template.

## Palette and token roles

| Token role | Value | Use |
| --- | --- | --- |
| Cosmic black | `#050508` | Page and hero foundation |
| Deep surface | `#11131B` | Technical panels and alternating sections |
| Primary text | `#E8EAF0` | Headlines and critical labels |
| Cold light | `#8B9CCB` | Relationships, scope, orientation |
| Atmospheric violet | `#9B8ACB` | Reserved for future media grading; not a dominant UI fill |
| Evidence amber | `#D5AE82` | Provenance, proof, selected editorial rules |

Secondary muted and line colors are derived for contrast but stay visually subordinate. Status red/green remain semantic and are not recolored to fit the cosmic palette.

## Typography

- Instrument Sans remains the primary display and body face.
- Instrument Serif is limited to selective editorial emphasis on the homepage and closing statements.
- Commit Mono is used for labels, field names, status coordinates, and code.
- Hero display: approximately 62–98 px desktop; 46–72 px mobile.
- Section display: approximately 42–66 px.
- Body copy: 17–22 px depending on function.
- Long-form reading width: approximately 720 px.

Headlines should be short and composed, not centered slogans. Technical pages favor the sans face; the serif does not enter code, docs navigation, or status surfaces.

## Spacing and geometry

- Main container: 1360 px maximum.
- Section rhythm: 92–132 px desktop, 64–96 px on constrained screens.
- Controls: 48 px minimum height.
- Corners: 2–8 px. Large pill cards and excessive rounded containers are avoided.
- Borders: hairline rules with low-contrast neutral/cold tones.
- Cards are reserved for true records, tools, or grouped actions. Editorial sections use rules and asymmetric whitespace.

## Motion

- UI transitions: 160–280 ms with soft deceleration.
- No parallax, scrubbed video, 3D camera, shader, or particle field in Phase 1.
- Future ambient video may loop silently, but content never depends on playback.
- `prefers-reduced-motion`, Save-Data, playback rejection, and media error states resolve to the poster or static dark fallback.
- Motion is decorative and receives `aria-hidden`; no motion layer may be focusable.

## Homepage composition

1. **Event horizon / hero:** left-aligned message with a protected right-side media field. On mobile, text owns the upper/foreground area and the focal point moves upward.
2. **Flyby / problem:** asymmetric editorial split; the problem statement anchors the left while three concrete failure modes form a ledger.
3. **Deep space / approach:** quiet surface with evidence, structure, scope, and lifecycle as a ruled list.
4. **How it works:** compact four-step public flow; it bridges the approach to the ecosystem without a new cinematic panel.
5. **Connections / ecosystem:** component flow and external quality layers. Future media may turn distant points into relationships behind this section.
6. **Structure / MESA in Action:** verified fixture as the visual climax. The future scene must support, not obscure, the real retrieval/evidence structure.
7. **Use cases and discovery:** editorial ledger followed by a compact Learn/Docs/Methodology invitation.

Repeated build, legal-reference, and trust explanations were removed from the homepage because dedicated pages already hold those details. Routes and source-backed content remain available through the navigation, ecosystem, evaluation, docs, and footer.

## Page signatures

### MESA Core

Architectural, layered, and explicit. Stacked-store geometry, authorization nesting, retrieval lanes, and ruled client surfaces communicate structure. Cold light dominates; amber marks canonical decisions/evidence.

### MESA Data

Source-to-release flow. Archive-like vertical rules and a linear pipeline establish provenance without romanticizing the legal source material. Cool accents indicate controlled movement.

### MESA Law

Quiet editorial dossier. Amber rules identify evidence/review state. Long legal/product copy receives generous measure and no cosmic spectacle.

### Learn and knowledge pages

Publication hierarchy rather than a marketing grid. A lead feature can be larger, but lists, metadata, taxonomy, breadcrumbs, TOC, tables, and related content remain optimized for discovery and reading.

### Documentation

Compact hero, dense link groupings, direct source labels, and high-contrast code. Cinematic media is intentionally absent.

### QA, Certification, Evaluation, and Status

Operational and evidence-oriented. Their unique status colors and fail-closed language have priority over brand atmosphere.

## Responsive rules

- Desktop hero reserves approximately 46% of width for future right-weighted media.
- At 1100 px, text may occupy up to 66% while media contrast is reduced.
- At 800 px and below, media focal point switches to the manifest's mobile value and the veil becomes top-to-bottom.
- At 520 px and below, CTAs stack and all text must wrap without fixed-width assumptions.
- No scene creates an empty `100vh` wait. Section height is driven by real content.

## Accessibility and performance guardrails

- Contrast is evaluated on fallback surfaces first; media overlays may only improve separation.
- All readable information lives outside the media layer.
- Media has `aria-hidden="true"` and `pointer-events: none`.
- Posters reserve the full layer, use `object-fit`, and decode asynchronously.
- The event-horizon poster may load eagerly; all other posters load lazily.
- Videos use `preload="metadata"`, silent inline playback, and no controls because they are decorative.
- No Phase 1 asset request is emitted while manifest asset values are `null`.

