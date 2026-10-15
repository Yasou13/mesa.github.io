# MESA Visual Assets & Source Record

This document records the provenance, historical origin, licensing status, and site-native integration of all visual and archival assets used on [mesamemory.dev](https://mesamemory.dev/).

Sections 1–9 preserve the earlier archival/vector asset record. The supplied cosmic imagery added in Phase 4 is documented separately below; the historical licensing descriptions do not establish a license for those new files. The active design tokens are defined in `dist/styles.css`.

---

## 1. Hero Astronomical Trace
- **File**: `dist/assets/hero-astronomical-trace.svg`
- **Title**: *Prodromus Astronomiae / Firmamentum Sobiescianum* (Celestial Coordinate & Triangulation Charts)
- **Original Source / Artist**: Johannes Hevelius (1611–1687), engraved by Charles de La Haye (1690)
- **Institution / Archive**: Library of Congress / Smithsonian Libraries (Open Access / Public Domain)
- **License**: Public Domain (work published prior to 1928 / author died >70 years ago)
- **Where Used**: Homepage Hero background texture / watermark
- **Conceptual Purpose**: Represents the cosmic map of information and the structural triangulation of memory across axes.

---

## 2. Cartographic Triangulation Plate
- **File**: `dist/assets/cartographic-triangulation-plate.svg`
- **Title**: *Libellus de locorum describendorum ratione* (Principles of Geodetic Triangulation & Baseline Measurement)
- **Original Source / Artist**: Gemma Frisius (1508–1555) / César-François Cassini de Thury (1714–1784), *Carte de France* geodetic survey
- **Institution / Archive**: Bibliothèque nationale de France / The Met Open Access (Public Domain)
- **License**: Public Domain (historical scientific engraving)
- **Where Used**: Homepage Problem Section (`#the-problem`)
- **Conceptual Purpose**: Visually embodies the core problem: *"The answer survives. Its source does not."* Contrasts the solid grounded baseline (provenance) with distant, fragile sightings.

---

## 3. Legal Gazette & Register Engraving
- **File**: `dist/assets/legal-gazette-engraving.svg`
- **Title**: *Official Gazette Register & Imperial Seal Ornaments*
- **Original Source / Artist**: 19th-Century State Gazette Printing & Notarial Seal Engravings (c. 1876–1908)
- **Institution / Archive**: Ottoman State Archives / National Archives & Records Administration (Public Domain)
- **License**: Public Domain (official government publication & historical legal seal)
- **Where Used**: Homepage MESA Law section & MESA Law subpage (`/law/`)
- **Conceptual Purpose**: Reinforces the primary reference implementation — authentic legal matter workflows, official gazette records, and immutable human review gates.

---

## 4. Stratigraphy Strata Layers Plate
- **File**: `dist/assets/stratigraphy-layers.svg`
- **Title**: *Delineation of the Strata of England and Wales* (Geological Strata Cross-Section)
- **Original Source / Artist**: William Smith (1769–1839), engraved by John Cary (1815)
- **Institution / Archive**: Geological Society of London / Library of Congress (Public Domain)
- **License**: Public Domain
- **Where Used**: MESA Data subpage (`/data/`)
- **Conceptual Purpose**: Illustrates the immutable layering of data: raw byte bedrock at bottom, partitioned canonical JSONL, and verified release packages on top.

---

## 5. Horologium & Harmonic Chronometer Cycles
- **File**: `dist/assets/chronometer-cycles.svg`
- **Title**: *Horologium Oscillatorium* (Isochronism & Harmonic Oscillation Diagrams)
- **Original Source / Artist**: Christiaan Huygens (1629–1695)
- **Institution / Archive**: Rijksmuseum Open Access / Leiden University Library (Public Domain)
- **License**: Public Domain
- **Where Used**: MESA QA subpage (`/qa/`)
- **Conceptual Purpose**: Symbolizes temporal persistence, sustained endurance cycles, session rotation, and state survival across restart disruptions.

---

## 6. Verification Seal & Calibration Plate
- **File**: `dist/assets/certification-seal-plate.svg`
- **Title**: *Etalons des Poids et Mesures* (Official Verification Standards & Vernier Calibration Plates)
- **Original Source / Artist**: French Academy of Sciences / Bureau International des Poids et Mesures (1799)
- **Institution / Archive**: Conservatoire National des Arts et Métiers / The Met Open Access (Public Domain)
- **License**: Public Domain
- **Where Used**: MESA E2E Certification subpage (`/certification/`) & Evaluation page (`/evaluation/`)
- **Conceptual Purpose**: Embodies hard gates B0–B14, metric calibration, tamper-evident audit manifests, and fail-closed verdict requirements.

---

## 7. Provenance Lineage & Source Cataloging Plate
- **File**: `dist/assets/provenance-lineage-plate.svg`
- **Title**: *Arbor Scientiae & Catalogus Fontium* (Source Lineage & Archival Cataloging)
- **Original Source / Artist**: Ramon Llull (c. 1232–1316) / Denis Diderot & Jean le Rond d'Alembert, *Système figuré des connoissances humaines* (1751)
- **Institution / Archive**: Bibliothèque nationale de France / University of Barcelona Digital Archive (Public Domain)
- **License**: Public Domain (historical encyclopedic engraving)
- **Where Used**: Learn Hub (`/learn/what-is-provenance-in-ai/`, `/learn/what-is-evidence-aware-memory/`)
- **Conceptual Purpose**: Visually conveys information derivation: an origin document span extracted and bound into a canonical, tamper-evident assertion.

---

## 8. Topological Network Plate
- **File**: `dist/assets/topological-network-plate.svg`
- **Title**: *Analysis Situs & Graphica Nodal* (Topological Node Graph & Multi-Hop Paths)
- **Original Source / Artist**: Leonhard Euler (1707–1783), *Solutio problematis ad geometriam situs pertinentis* (1736, Commentarii Academiae Scientiarum Imperialis Petropolitanae)
- **Institution / Archive**: Saint Petersburg Academy of Sciences / Euler Archive (Public Domain)
- **License**: Public Domain (foundational paper in graph theory)
- **Where Used**: Learn Hub (`/learn/why-graphs-matter-in-ai-memory/`)
- **Conceptual Purpose**: Illustrates multi-hop relational path traversal between entities, demonstrating why relational queries can resolve context that flat similarity searches miss.

---

## 9. Taxonomic Classification Plate
- **File**: `dist/assets/taxonomic-classification-plate.svg`
- **Title**: *Systema Naturae & Dichotomia Cognitiva* (Structured Schema Taxonomy vs Fluid Text Chunks)
- **Original Source / Artist**: Carl Linnaeus (1707–1778), *Systema Naturae* (1735) / Petrus Ramus (1515–1572)
- **Institution / Archive**: National Library of Sweden / British Library (Public Domain)
- **License**: Public Domain (historical scientific taxonomy)
- **Where Used**: Learn Hub (`/learn/structured-vs-unstructured-memory/`)
- **Conceptual Purpose**: Contrasts unstructured, diffuse text chunks against typed assertions with explicit entity bindings, evidence spans, and scope constraints.

---

## 10. User-supplied cosmic hero — Phase 4

- **Source package:** `MESA-Visual-Assets.zip`, supplied by the user. Its README identifies the originals as Google Flow images, with WebP compression and prepared portrait crops.
- **Desktop:** `dist/media/desktop/hero.webp`, 1376 × 768, 30,238 bytes; SHA-256 `0ae36ca732ce8fd9c5cef24c0b4d1e35d72391f19d671855a8068617e26e33ba`.
- **Mobile:** `dist/media/mobile/hero-portrait.webp`, 614 × 768, 27,636 bytes; SHA-256 `6d2161d6eec3439b426cee651e5c8cb9b9c0d53b87ce02a42774b9183213360c`.
- **Integrity:** both delivery files are byte-for-byte copies from the supplied ZIP. No regeneration, color adjustment, image distortion, or additional compression. Separate CSS scrims protect text and blend the visual into the canvas.
- **Usage:** homepage only. Desktop uses the supplied landscape composition; mobile ≤800 px uses its prepared portrait crop in a separate field below the copy/actions. The image is static and decorative (`alt=""`, hidden noninteractive wrapper).
- **Provenance boundary:** user-supplied generated nebula imagery, not verified observatory photography. The package does not provide a separate public-domain/CC0 declaration; no telescope, astronomical object, artist, or license credit is invented.
- **Other nebula assets:** flow, structure, and horizon remain outside the deployed site. Future Core/Data placement is not implemented in Phases 2–4.

## Accessibility and provenance scope

Decorative integration uses empty alt text and noninteractive hidden media layers. The historical vector-source descriptions above are retained as existing project records; Phase 4 does not independently reverify those historical attributions or assert that every site asset is public domain.
