# MESA design consistency

16 October 2026. `dist/styles.css :root` remains the authoritative token source.

- Shared neutral palette: black #050508, midnight #0B101B, technical #11131B, text #E8EAF0, muted #A5A9B5; violet #9B8ACB, blue #8B9CCB, cyan #8EA5AE, evidence amber #D5AE82.
- Replaced late editorial, rank calculator, ecosystem, documentation and footer hardcoded purple shades with existing semantic tokens. Consolidated those component radii to panel/control tokens. Preserved red warning and amber evidence semantics.
- Removed the purely decorative hero pseudo-elements (ledger sheets, crosshatch, dossier, rings/trajectory lines), repeated grid background rules and retired bitmap scene styling. These decorations held no text, source records or diagrams. Real diagrams and technical examples remain.
- Removed obsolete page-hero background declarations that painted over the shared environment. The first screenshot review caught one surviving `#07080c` override despite passing DOM tests; it was removed before final verification.
- Existing article and docs content columns now own opaque reading surfaces. Card and table structure stays intact. Mobile typography, navigation and scrollable code are preserved.
- Supplied bitmap files and the media manifest remain as historical source/reference assets, but no page downloads a nebula bitmap. Existing public URLs, EN/TR copy, claims and upstream documentation are unchanged.

The shared stylesheet was edited at the existing rules; `cosmic.css` describes the new component, not a duplicate theme override. Functional CSS was retained where usage could not be disproved. This is not a claim that every historical selector has been deleted.

See `docs/tests/MESA_VISUAL_REGRESSION_REPORT.md` for measured screenshots, contrast, accessibility, sizes and remaining limits.
