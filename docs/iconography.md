# MESA iconography

MESA uses a small, original inline-SVG icon set. The icons are part of this
MIT-licensed repository; no SF Symbols, icon font, or third-party icon library
is shipped.

## Construction

- Grid: `24 × 24`
- UI rendering sizes: `16`, `20`, and `24` px
- Concept rendering sizes: `32`, `40`, `48`, and `72` px
- Stroke: `1.6` CSS units, round caps and round joins
- Fill: none by default
- Optical rule: directional icons may translate by 1–2 px on hover; their
  underlying paths remain on the same grid

## Color semantics

- Neutral ivory/gray: ordinary interface action
- Dusty violet: MESA system or memory concept
- Mineral: relationship, retrieval, or movement between system parts
- Copper: evidence, provenance, reviewed source, or archival record
- Status colors: only for actual operational state

## Concept icons

| Name | Meaning | Typical use |
| --- | --- | --- |
| `memory` | Durable, indexed memory object | Core and educational material |
| `evidence` | Record with inspectable basis | Results, certification, source claims |
| `provenance` | Trace between source and outcomes | Lineage and audit explanations |
| `scope` | Explicit retrieval boundary | Tenant, workspace, dataset, agent scope |
| `relationship` | Typed connection between two objects | Assertions and entity relations |
| `graph` | Bounded connected structure | Graph-path retrieval and topology |
| `source` | Reviewed source record | Data and archival inputs |
| `retrieval` | Search and inspection | Retrieval and Learn content |
| `lifecycle` | State change over time | Mutation and projection lifecycle |
| `verification` | Checked contract or gate | QA and certification |
| `dataset` | Versioned data collection | Catalog and release boundaries |
| `assertion` | Structured checked statement | Assertion lane and evidence model |

## Interface icons

`arrow` and `external` are used inside links and buttons. Text remains the
accessible name; decorative SVGs are hidden from assistive technology.

Do not add an icon merely to fill space. New icons must use the same grid,
stroke, cap, join, and semantic color rules.
