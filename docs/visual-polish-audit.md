# MESA visual polish audit

**Date:** 2026-10-07  
**Branch:** `website/apple-level-visual-polish-loop`  
**Scope:** English and Turkish static routes, shared navigation/footer, core
product pages, knowledge hub, functional pages, and 404.

## Before

The existing Obsidian Archive direction, typography, archival plates, homepage
graph traversal, and MESA in Action fixture were already strong. The remaining
quality gap was systemic rather than decorative:

- most subpages reused the same large hero, right-side diagonal grid, and short
  accent rule;
- Learn presented its cornerstone articles at equal visual weight;
- Docs, FAQ, and Status spent too much of the first viewport on a cinematic
  hero before exposing useful content;
- interface arrows mixed Unicode glyphs with text rather than using one icon
  construction;
- spacing values existed, but had no named semantic scale for future work;
- the 390 px Certification view could expose horizontal page overflow;
- MESA concepts had diagrams but no small reusable icon vocabulary.

## Implemented system

### Iconography

An original inline-SVG set now covers memory, evidence, provenance, scope,
relationship, graph, source, retrieval, lifecycle, verification, dataset,
assertion, internal arrow, and external link. All use a 24 × 24 grid, 1.6-unit
stroke, round caps/joins, and semantic color. See `docs/iconography.md`.

### Spacing and width

The CSS exposes a 4/8/12/16/24/32/48/64/96/128/160 spacing scale and narrow,
standard, and wide content measures. The existing full-width technical
sections remain available for diagrams and lifecycle flows.

### Surface hierarchy

- Level 0: obsidian page background
- Level 1: quiet section shift with no container by default
- Level 2: functional panel for code, indexes, and grouped metadata
- Level 3: focused evidence object, such as MESA in Action or a certification
  dossier

### Page signatures

- How it works: trajectory with three optically distinct states
- Ecosystem: sparse system field and relationship traces
- Core: stacked memory-ledger layers
- Data: ruled archival release sheet
- QA: temporal trace
- Certification: copper evidence dossier
- Law: legal/archive ruling lines
- Use cases: nested scope boundary
- Evaluation: evidence ledger
- Learn/About: editorial rule and asymmetric negative space
- Docs/FAQ: shorter functional entry
- Status: compact operational rail

## Responsive audit

The 13 required page families were compared at 1440, 1024, 768, and 390 px.
At 768 px navigation changes to the dedicated mobile control, compositions lose
nonessential detail, and technical motifs fade behind content. At 390 px the
page heroes, actions, status strips, and long Certification labels fit without
horizontal document scrolling.

## Subtraction pass

- removed the universal diagonal hero motif from page families;
- avoided adding images or gradients to functional pages;
- kept diagrams vector-only and did not add animation beyond the existing graph
  traversal and quiet UI transitions;
- kept the current logo and archival artwork;
- used icons only for interface direction and high-value concepts.

## Verification

- 74 localized routes plus 404 render successfully
- static-site checker validates 75 HTML files
- no emoji UI icons
- no icon font or third-party icon library
- all decorative SVG icons are hidden from assistive technology
- reduced-motion behavior remains in the shared stylesheet
- total deployment artifact remains approximately 2.3 MB; largest assets are
  the three self-hosted licensed font files
- all added page graphics are CSS geometry or original inline SVG; the existing
  external artwork license record is unchanged
