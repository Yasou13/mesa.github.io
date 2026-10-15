# 03 — Technical Claim Traceability Matrix

**Run ID:** `20261015T221500Z`  
**Execution Timestamp:** 2026-10-15T22:27:00+03:00  
**Target Baseline:** MESA Core v0.8.0  
**Repository Inspected:** `/home/yasin/Desktop/MESA` (commit `07d387f9`)  

---

## Traceability Matrix

Every critical technical claim presented across the MESA website was verified against primary source code and authoritative documentation in MESA Core v0.8.0:

| # | Website Section | Technical Claim | Source Repository | Source File / Symbol | Version / Commit | Verification Status | Website Implementation Status |
|---|---|---|---|---|---|---|---|
| 1 | Global Status | MESA Core version is 0.8.0 | MESA Core | `pyproject.toml`, `docs/release-notes-v0.8.0.md` | v0.8.0 (`07d387f9`) | Verified Implemented | Updated `site-data.json` to 0.8.0; updated badges and status strips |
| 2 | Global Status | Production readiness status is NO-GO | MESA Core | `docs/release-notes-v0.8.0.md#verification-and-known-limitations` | v0.8.0 (`07d387f9`) | Verified Constraint | Explicitly displayed in red as `NO-GO` on all status sections |
| 3 | Global Status | Release is an owner-approved source release with incomplete certification | MESA Core | `CHANGELOG.md` (0.8.0), `docs/release-notes-v0.8.0.md` | v0.8.0 (`07d387f9`) | Verified Implemented | Documented on `/status/` with link to official release notes |
| 4 | Architecture (`/mesa/`) | Single combined process writer topology for SQLite, LanceDB, and Kùzu | MESA Core | `docs/architecture-v4.md#runtime-boundary` | v0.8.0 (`07d387f9`) | Verified Implemented | Stated on `/mesa/` and `/how-it-works/` under Storage Topology |
| 5 | Architecture (`/mesa/`) | SQLite is authoritative canonical store; LanceDB and Kùzu are projections | MESA Core | `docs/architecture-v4.md#canonical-entity-and-graph-v2` | v0.8.0 (`07d387f9`) | Verified Implemented | Explicitly stated: "SQLite decides. Projections follow." |
| 6 | Architecture (`/mesa/`) | Production SQLite connections enforce `synchronous=FULL` | MESA Core | `CHANGELOG.md` (0.8.0), `mesa_storage/sqlite_canonical.py` | v0.8.0 (`07d387f9`) | Verified Implemented | Included in SQLite store card and architecture documentation |
| 7 | Security (`/mesa/`) | Security boundary is tenant, not agent (`Principal → Tenant → Workspace → Dataset → Document → Revision → Chunk`) | MESA Core | `docs/architecture-v4.md#security-and-catalog-hierarchy` | v0.8.0 (`07d387f9`) | Verified Implemented | Documented with nested visual on `/mesa/#security` |
| 8 | Ingestion (`/mesa/`) | Mutation lifecycle: `QUEUED → RUNNING → EXTRACTED → VALIDATED → PROJECTING → COMMITTED` | MESA Core | `docs/architecture-v4.md#pipeline-and-failure-model` | v0.8.0 (`07d387f9`) | Verified Implemented | Depicted in 7-step lifecycle architecture flow on `/mesa/` |
| 9 | Ingestion (`/mesa/`) | Selectable validation policy via `MESA_TIER3_MODE` (0=deterministic, 1=single LLM, 2=dual LLM) | MESA Core | `CHANGELOG.md` (0.8.0), `docs/configuration.md` | v0.8.0 (`07d387f9`) | Verified Implemented | Documented on `/mesa/` and `/docs/` configuration guide |
| 10 | Ingestion (`/mesa/`) | Typed legal retrieval identity (`law_id`, `statute_code`, `article_id`) bound to provenance; caller `_mesa_*` keys stripped | MESA Core | `docs/architecture-v4.md#canonical-ingestion`, `CHANGELOG.md` | v0.8.0 (`07d387f9`) | Verified Implemented | Documented in Retrieval and Ingestion contracts |
| 11 | Retrieval (`/mesa/`) | Four retrieval lanes: Vector, BM25 (FTS5), Assertions, Bounded Graph paths | MESA Core | `docs/retrieval-and-graph.md#four-lanes-and-scoring` | v0.8.0 (`07d387f9`) | Verified Implemented | Displayed in 5-column lane grid on `/mesa/#retrieval` |
| 12 | Retrieval (`/mesa/`) | Reciprocal Rank Fusion formula: $RRF(c) = \sum \frac{w_{lane}}{k + rank_{lane}(c)}$ ($k=60, w=1.0$) | MESA Core | `docs/retrieval-and-graph.md`, `mesa_storage/retrieval_scope.py` | v0.8.0 (`07d387f9`) | Verified Implemented | Documented in fusion card on `/mesa/` and `/learn/reciprocal-rank-fusion/` |
| 13 | Retrieval (`/mesa/`) | Citation boosts alter lane ordering: Lexical (+200/+40), Assertion (+150/+40); post-RRF legal factor (1.5, 1.25, 0.25, 1.0) | MESA Core | `docs/retrieval-and-graph.md` | v0.8.0 (`07d387f9`) | Verified Implemented | Explicitly explained on `/mesa/` and in educational hub entries |
| 14 | Context (`/mesa/`) | Bounded adaptive context retrieval: single query default, max 1 reformulation for weak results, max 2 queries, fusion Q0=1.0, Q1=0.5, Q2=0.5 | MESA Core | `docs/architecture-v4.md#bounded-adaptive-context-retrieval` | v0.8.0 (`07d387f9`) | Verified Implemented | Documented on `/mesa/` and `/docs/` |
| 15 | Context (`/how-it-works/`) | ContextBuilder token budget defaults to 2048 with `cl100k_base` and atomic proof packing | MESA Core | `docs/retrieval-and-graph.md#context-and-adaptive-search` | v0.8.0 (`07d387f9`) | Verified Implemented | Explained in How it works and retrieval articles |
| 16 | Rebuild (`/mesa/`) | Durable projection rebuild via offline `mesa-v4-rebuild` runner with leased checkpoints and generation rollback | MESA Core | `docs/v4-rebuild-runbook.md`, `CHANGELOG.md` | v0.8.0 (`07d387f9`) | Verified Implemented | Documented on `/mesa/` and `/docs/` CLI/Rebuild links |
| 17 | Setup (`/docs/`) | Locked setup uses `uv==0.9.6`, command `uv sync --locked --extra dev` | MESA Core | `README.md`, `docs/installation.md` | v0.8.0 (`07d387f9`) | Verified Implemented | Displayed in copyable terminal snippet on `/docs/` |
| 18 | Ecosystem (`/ecosystem/`) | Five explicit repositories: MESA Core, MESA_Data, MESA_QA, MESA_E2E_Certification, MESA_Law | Ecosystem | `docs/ecosystem.md#ecosystem-and-ownership-boundaries` | All checkouts (`2026-10-15`) | Verified Implemented | Diagrammed on `/ecosystem/`, `/how-it-works/`, `/` |
| 19 | Certification (`/certification/`) | Profile B covers Data → Core; current status is BLOCKED (fail-closed) | Certification | `MESA_E2E_Certification/README.md`, commit `3b7562c` | v0.8.0-era audit | Verified Constraint | Banner displayed on `/certification/`, `/status/`, `/evaluation/` |
| 20 | Law (`/law/`) | Reference application for matter workspaces; live Core integration pending | MESA Law | `docs/ecosystem.md`, `MESA_Law` docs | v0.8.0-era audit | Verified Constraint | Clearly stated on `/law/` and `/ecosystem/` |

---

## Summary of Unsupported / Omitted Claims Rejected
1. *Elimination of hallucinations:* Never claimed on any website page.
2. *Production readiness:* Explicitly rejected with `NO-GO` label and documented missing gates.
3. *Universal web scraper for MESA Data:* Explicitly clarified as a curated Turkish legal data platform.
4. *Live Law end-to-end certification:* Explicitly marked as integration pending.
