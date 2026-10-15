# 01 — Documentation Inventory

**Run ID:** `20261015T221500Z`  
**Execution Timestamp:** 2026-10-15T22:26:00+03:00  
**Target Baseline:** MESA Core v0.8.0  
**Source Repository:** `/home/yasin/Desktop/MESA`  

---

## 1. Inventory of Maintained MESA Core Documentation

Every authoritative documentation file maintained in MESA Core v0.8.0 was inventoried, categorized, and analyzed for technical claims and website relevance:

| File Path | Title / Scope | Key Technical Contracts | Status in v0.8.0 |
|---|---|---|---|
| `docs/README.md` | MESA Core Documentation Index | Navigation guide across canonical topics, V3 vs V4 boundaries, owner approval notice, production NO-GO. | Maintained / Canonical Index |
| `docs/architecture-v4.md` | Current V4 Architecture | Single `combined` process writer topology, tenant hierarchy (`Principal → Tenant → Workspace → Dataset → Document → Revision → Chunk`), SQLite canonical authority (`synchronous=FULL`), LanceDB (`ASSERTION_VECTOR`), Kùzu (Graph V2), pipeline stages (`QUEUED` to `COMMITTED`), `FactExtractionService` (REBEL is legacy V3 only). | Maintained / Canonical Architecture |
| `docs/retrieval-and-graph.md` | Retrieval, Graph, and Evidence | 4 retrieval lanes (Vector, BM25, Assertions, Bounded Graph), Reciprocal Rank Fusion ($k=60, w=1.0$), lexical boosts (+200/+40), assertion boosts (+150/+40), post-RRF legal factors (1.5, 1.25, 0.25, 1.0), ContextBuilder token budget (2048 default), bounded adaptive context retrieval. | Maintained / Retrieval Canonical |
| `docs/concepts-and-ingestion.md` | Concepts & Ingestion | Exact source text admission, immutable DocumentRevisions, typed legal retrieval identity (`law_id`, `statute_code`, `article_id`), validation policy modes (`MESA_TIER3_MODE`: 0, 1, 2), artifact registry and shared ownership. | Maintained / Ingestion Canonical |
| `docs/configuration.md` | Configuration Reference | Environment variables, storage root, log formats, port, model toggles (`MESA_MODEL_ENABLED`), external provider toggles (`MESA_EXTERNAL_PROVIDER_ENABLED`), embedding dimensions (768 local Magibu vs 1536 OpenAI), rebuild flag (`MESA_V4_REBUILD_ENABLED`). | Maintained / Configuration Reference |
| `docs/api-reference.md` | API Reference | Versioned V3 and V4 REST APIs, `GET /v4/capability`, `/health`, `/metrics`, scrypt API keys (`mesa-v4-admin issue-key`), request/response schemas. | Maintained / API Reference |
| `docs/cli-reference.md` | CLI Reference | `mesa-v4-admin` (issue-key, grant-role, grant-agent, revoke-key, list-keys) and `mesa-v4-rebuild` (submit, status, cancel, retry, offline runner). | Maintained / Operator Reference |
| `docs/installation.md` | Installation and Deployment | Python 3.10–3.13, locked setup via `uv==0.9.6`, `uv sync --locked --extra dev`, separate V3 safe-core and V4 full-cognitive profiles. | Maintained / Deployment Reference |
| `docs/getting-started.md` | Local Quickstarts & Prerequisites | Fast, model-disabled loopback setup; V3 raw memory insert/search test; provider prerequisites for V4 insertion. | Maintained / Developer Quickstart |
| `docs/migration-v0.8.0.md` | Upgrading to v0.8.0 | Forward schema requirements, Alembic head `d5e6f7a8b9c0`, `assertion-semantic-v1`, storage root offline rebuild, rollback sequence. | Maintained / Migration Guide |
| `docs/release-notes-v0.8.0.md` | MESA Core v0.8.0 Release Notes | Explicit owner approval notice, production NO-GO, missing certification evidence, change history. | Maintained / Official Release Notes |
| `docs/release.md` | Release Policy & Gates | Release candidate checklist, signed tagging requirements, CI coverage, provider rehearsals, 24h soak requirements. | Maintained / Release Policy |
| `docs/v4-rebuild-runbook.md` | V4 Projection Rebuild Runbook | Offline projection rebuild procedures, checkpointing, leased workers, retained-generation rollback. | Maintained / Operator Runbook |
| `docs/RUNBOOK.md` | Operator Runbook | Backup under writer lock, restore verification, metrics inspection, alert thresholds. | Maintained / Operator Runbook |
| `docs/security-and-privacy.md` | Security and Privacy | Tenant isolation, scrypt password hashing, session tokens, audit ledgers, vulnerability reporting. | Maintained / Security Policy |
| `docs/troubleshooting.md` | Troubleshooting | Diagnostics for 503 canonical_processing_unavailable, graph timeouts, lock contention, token budget exhaustion. | Maintained / Support Reference |
| `docs/performance-and-limitations.md` | Performance & Limitations | Single-process writer constraint, offline tokenizer byte-bound upper limits, graph traversal bounds (20 seeds, 3 hops). | Maintained / Limitations Reference |
| `docs/ecosystem.md` | Ecosystem & Ownership Boundaries | Explicit separation of MESA Core, MESA_Data, MESA_E2E_Certification, MESA_QA, MESA_Law. | Maintained / Ecosystem Canonical |
| `docs/reference/openapi.json` | OpenAPI 3.1.0 Contract | Machine-readable API specifications generated directly from `mesa_api` routers. | Maintained / API Specification |
| `README_MCP.md` | Model Context Protocol | V3 legacy direct stdio server vs V4 supervised HTTP gateway and local stdio bridge. | Maintained / MCP Specification |

---

## 2. Superseded & Historical Documents (Not Authoritative for v0.8.0)

The following documents in MESA repositories represent historical records, past benchmarks, or legacy architectures. They are preserved for audit purposes but must **not** be used as active product documentation:

- `ARCHITECTURE.md` (root): Historical V3-era architecture document.
- `historical_benchmarks/BENCHMARK_INTEGRITY_LOG.md`: Past synthetic/DEV benchmark runs.
- `docs/v4-final-independent-audit.md`: Historical audit report from earlier development phase.
- REBEL fact-extraction references: Historical compatibility only; canonical V4 extraction is owned by `FactExtractionService`.

---

## 3. Website Documentation Integration Strategy

The website Documentation Hub (`/docs/` and `/tr/docs/`) must directly link to these maintained source files on GitHub rather than recreating hollow duplicate pages. It provides:
1. Conceptual orientation (what the contract is).
2. Direct GitHub links to the exact source documents.
3. Accurate code blocks (tested and executable).
4. Truthful maturity markers (NO-GO, Release Candidate).
