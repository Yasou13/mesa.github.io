# 04 — Information Architecture Changes

**Run ID:** `20261015T221500Z`  
**Execution Timestamp:** 2026-10-15T22:27:30+03:00  
**Target Baseline:** MESA Core v0.8.0  
**Repository Inspected:** `/home/yasin/Desktop/mesa_website/photos/site`  

---

## 1. Structural Objectives & Narrative Architecture

The website's information architecture is structured around five fundamental technical questions:

```
Visitors arrive
      │
      ├── 1. WHAT IS MESA? ───────────────► Open-source evidence-aware memory infrastructure for AI systems.
      │
      ├── 2. WHAT PROBLEMS DOES IT SOLVE? ► Fragmented context, loss of relationships, missing provenance, unscoped memory.
      │
      ├── 3. HOW DOES IT ACTUALLY WORK? ──► Exact admission → SQLite canonical storage & projections → 4-lane RRF hybrid retrieval.
      │
      ├── 4. HOW CAN DEVELOPERS USE IT? ──► REST API, Python SDK (MesaV4Client), Supervised MCP Gateway/Bridge, locked quickstart.
      │
      └── 5. HOW DOES ECOSYSTEM FIT? ─────► MESA Data (Preparation) → MESA Core (Memory) → MESA Law (Application), with QA/Cert quality layers.
```

---

## 2. Homepage Composition (The 6-Section Contract)

The homepage maintains a disciplined six-section narrative flow designed for technical clarity without marketing hyperbole:

1. **Section 1 — Hero (`#hero`):**
   - Direct value proposition: "AI memory, with its evidence attached."
   - Concise explanation of MESA as open-source memory infrastructure.
   - Dual calls to action: "Inspect a memory example" (`#mesa-in-action`) and "Explore the architecture" (`/mesa/`).
   - Atmospheric cosmic background (`event-horizon` nebula poster) serving as visual depth.
2. **Section 2 — The Problem (`#the-problem`):**
   - "Memory needs more than recall."
   - Three concrete requirements: Keep the source, Keep the relationships, Keep the boundary.
3. **Section 3 — Verified Memory Example (`#mesa-in-action`):**
   - Centerpiece interactive specimen plate featuring the deterministic `Alice knows Aurora` test fixture.
   - Shows entity graph relationship, source chunk `source-chunk-1`, span, 4 lane ranks, and true RRF score ($4/61$).
   - Direct link to the exact test file on GitHub (`tests/test_v4_independent_retrieval_audit.py`).
4. **Section 4 — How Memory Works (`#how-it-works`):**
   - 4-step public flow: Source → Remember → Retrieve → Verify & Use.
   - Explicit architectural reminder: "SQLite owns canonical decisions. LanceDB and Kùzu are derived projections."
5. **Section 5 — The Ecosystem (`#ecosystem`):**
   - Generic platform model: Sources & preparation → MESA Core → Applications.
   - Current legal reference implementation: MESA Data → MESA Core → MESA Law.
   - Quality layers: MESA QA and E2E Certification (Profile B blocked).
6. **Section 6 — Continue Exploring (`#continue-exploring`):**
   - Three clear pathways: Understand the concepts (`/learn/`), Build with MESA (`/docs/`), Explore the legal reference (`/law/`).
7. **Status Aside (`home-status`):**
   - Live status strip reflecting Core v0.8.0, Release Candidate maturity, Production NO-GO, and evidence date 2026-10-15.

---

## 3. Documentation Hub Restructuring (`/docs/`)

The Documentation Hub was restructured into seven logical functional modules connecting visitors directly to MESA Core v0.8.0 canonical guides:

```
DOCUMENTATION HUB (/docs/)
├── 01 / Start
│   ├── Quickstart (README.md)
│   ├── Getting started (docs/getting-started.md) [NEW]
│   ├── Installation & deployment (docs/installation.md)
│   └── Current status (/status/)
├── 02 / Understand
│   ├── V4 architecture (docs/architecture-v4.md)
│   ├── Concepts & ingestion (docs/concepts-and-ingestion.md) [NEW]
│   ├── Retrieval & graph (docs/retrieval-and-graph.md) [NEW]
│   └── How MESA works (/how-it-works/)
├── 03 / Build
│   ├── Python SDK (docs/api-reference.md)
│   ├── HTTP API (docs/api-reference.md)
│   ├── OpenAPI specification (docs/reference/openapi.json) [NEW]
│   └── MCP integration (/docs/mcp/)
├── 04 / Operate
│   ├── Configuration reference (docs/configuration.md) [NEW]
│   ├── CLI reference (docs/cli-reference.md) [NEW]
│   ├── Rebuild & recovery runbook (docs/v4-rebuild-runbook.md)
│   └── Core lifecycle overview (/mesa/)
├── 05 / Trust
│   ├── Security policy (SECURITY.md)
│   ├── Performance & limitations (docs/performance-and-limitations.md) [NEW]
│   ├── Troubleshooting (docs/troubleshooting.md) [NEW]
│   └── Evaluation & trust (/evaluation/)
├── 06 / Reference
│   ├── v0.8.0 Release notes (docs/release-notes-v0.8.0.md) [NEW]
│   ├── Migration to v0.8.0 (docs/migration-v0.8.0.md) [NEW]
│   ├── Release policy (docs/release.md) [NEW]
│   └── Ecosystem boundaries (/ecosystem/)
└── 07 / Contribute
    ├── Contributing guide (CONTRIBUTING.md)
    ├── Issue tracker (GitHub Issues)
    └── MESA QA repository (MESA_QA)
```

---

## 4. Technical Architecture Page (`/mesa/`) Navigation Flow

The Technical Architecture page provides deep progressive disclosure:
1. Status badge & Core v0.8.0 version statement.
2. Ingestion pipeline: 7-step outbox progression (`QUEUED` to `COMMITTED`).
3. Security boundary: Catalog authorization hierarchy (`Principal → Tenant → Workspace → Dataset → Document → Revision → Chunk`).
4. Retrieval lanes: 5-column grid (Vector, BM25, Assertions, Bounded Graph, True RRF).
5. Storage subsystems: SQLite canonical authority (`synchronous=FULL`), LanceDB, Kùzu.
6. Client & Tooling surfaces: V4 REST API, Python SDK, Supervised MCP gateway + bridge.
