# 05 — Design System and Visual Refinement

**Run ID:** `20261015T221500Z`  
**Execution Timestamp:** 2026-10-15T22:28:00+03:00  
**Target Baseline:** MESA Core v0.8.0  
**Repository Inspected:** `/home/yasin/Desktop/mesa_website/photos/site`  

---

## 1. Aesthetic Direction: Cosmic Minimalism

The MESA website embodies a **Cosmic Minimalism** design aesthetic inspired by high-end developer tooling, scientific visualization, and Apple-level typographic refinement:

- **Palette:** Deep black foundations (`#050508`) with subtle dark surfaces (`#11131b`, `#171b28`, `#222842`), high-contrast ink (`#e8eaf0`), and muted secondary tones (`#a5a9b5`).
- **Cosmic Accent:** Controlled atmospheric nebula imagery (`event-horizon` scene in `media/desktop/hero.webp` and `media/mobile/hero-portrait.webp`) representing order emerging from complexity.
- **Accents:** Restrained mineral/orientation violet (`#8b9ccb`), copper/amber evidence accents (`#d5ae82`), cyan focus rings (`#8ea5ae`), and explicit status indicators (`#df7468` for NO-GO red, `#77b98e` for OK green).
- **Typography:** `Instrument Sans` for ultra-clean technical prose and navigation, `Instrument Serif` (italic) for expressive editorial moments, and `Commit Mono` for code snippets, hashes, and mathematical notation.

---

## 2. Design Token System (`dist/styles.css`)

All design properties are governed by authoritative `:root` variables:

```css
:root {
  color-scheme: dark;
  --black: #050508;
  --midnight: #0b101b;
  --surface: #11131b;
  --surface-2: #171b28;
  --surface-3: #222842;
  --ink: #e8eaf0;
  --muted: #a5a9b5;
  --muted-2: #858b98;
  --orientation: #8b9ccb;
  --violet: #9b8acb;
  --cyan: #8ea5ae;
  --evidence: #d5ae82;
  --copper: var(--evidence);
  --red: #df7468;
  --green: #77b98e;
  --line: rgba(232, 234, 240, .12);
  --line-strong: rgba(232, 234, 240, .22);
  --control-line: #666c7c;
  --focus: #b8d5dd;
  --max: 1360px;
  --content-wide: 1360px;
  --content-standard: 1200px;
  --content-narrow: 720px;
  --content-reading: 720px;
  --section-space: clamp(5.5rem, 7vw, 7rem);
  --type-display: clamp(3.5rem, 6.1vw, 5.5rem);
  --type-title: clamp(2.75rem, 4.5vw, 4rem);
  --type-section: clamp(2rem, 3.4vw, 3rem);
  --type-subheading: clamp(1.375rem, 2vw, 1.75rem);
  --type-body: 1.125rem;
  --type-meta: .8125rem;
  --radius-technical: .25rem;
  --radius-control: .375rem;
  --radius-panel: .5rem;
  --duration-fast: 160ms;
  --duration-base: 240ms;
  --duration-reveal: 380ms;
  --motion-ui: cubic-bezier(.2, .7, .2, 1);
  --motion-system: cubic-bezier(.45, 0, .15, 1);
}
```

---

## 3. Contrast & Accessibility Verification

Calculated contrast ratios on dark background (`#11131b` / `#050508`):
- Muted body text (`#a5a9b5` on `#11131b`): **≈ 7.89:1** (Exceeds WCAG AAA 7:1)
- Metadata / captions (`#858b98` on `#11131b`): **≈ 5.42:1** (Exceeds WCAG AA 4.5:1)
- Control outlines (`#666c7c` on `#11131b`): **≈ 3.53:1** (Exceeds WCAG non-text 3:1)
- Focus rings (`#b8d5dd` on `#11131b`): **≈ 12.01:1** (High-visibility accessibility focus indicator)

---

## 4. Restrained Micro-Interactions & SVG Animations

1. **Lightweight SVG Visualizations:**
   - Interactive evidence path SVG with animated stroke segments illustrating graph traversal (`.evidence-path`).
   - Clean 2D flow diagrams for admission and pipeline stages with no WebGL or heavy 3D runtimes.
2. **Motion Accessibility:**
   - Fully supports `@media (prefers-reduced-motion: reduce)`.
   - Transitions, pulses, and stroke animations gracefully fall back to static, readable representations when reduced motion is requested.
3. **Responsive Media Optimization:**
   - Desktop hero poster: `media/desktop/hero.webp` (30 KB WebP, 1376×768, focal point 100% 50%).
   - Mobile hero portrait: `media/mobile/hero-portrait.webp` (27 KB WebP, 614×768, focal point 50% 50%).
   - Zero layout shifts (CLS = 0) with explicit intrinsic dimensions.
