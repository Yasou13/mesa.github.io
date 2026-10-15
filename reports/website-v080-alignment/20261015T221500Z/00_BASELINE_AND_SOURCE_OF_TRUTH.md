# 00 — Baseline and Source of Truth

**Run ID:** `20261015T221500Z`  
**Execution Timestamp:** 2026-10-15T22:25:00+03:00  
**Target Baseline:** MESA Core v0.8.0  
**Website Repository:** `/home/yasin/Desktop/mesa_website/photos/site`  
**Working Branch:** `website/v080-documentation-alignment`  

---

## 1. Verified Release State & Git Metadata

The authoritative technical documentation baseline for this website alignment was established by direct inspection of the official local MESA Core repository and its Git metadata at `/home/yasin/Desktop/MESA`:

- **Official Upstream Repository:** `https://github.com/Yasou13/MESA`
- **Release Tag:** `v0.8.0`
- **Tag Object SHA:** `e2c28ea42ab772d62f7e93537902050bfef12837`
- **Release Target Commit SHA:** `07d387f9a4592ea39518fea549e9cf8330051e1f` (Merge pull request #109 from `Yasou13/fix/mesa-core-comprehensive-retrieval-hardening`)
- **Current Main / Head SHA:** `99bde3ce62000c0cd94649ba1bff0d817538f3ff`
- **Tagger:** Yasin Büyüktepe <yasinbuyuktepe3@gmail.com>
- **Tag Date:** Thu Oct 15 21:10:15 2026 +0300
- **Tag Message:** `MESA Core v0.8.0; explicitly owner-approved unsigned source release; production certification remains NO-GO`
- **Release Package Version:** `0.8.0` (in `pyproject.toml`, `mesa_client/client.py`, `docs/release-notes-v0.8.0.md`, `CHANGELOG.md`)

---

## 2. Release Status & Maturity Definition

The release status is explicitly established by authoritative documentation in `docs/release-notes-v0.8.0.md` and `CHANGELOG.md`:

1. **Source Release (Owner-Approved):**  
   The repository owner explicitly approved publication of MESA Core v0.8.0 after reviewing missing certification evidence.
2. **Production Status: NO-GO:**  
   This source release **does not certify production readiness**. Production status remains strictly `NO-GO` until the standard certification gates pass.
3. **Missing Certification Gates:**
   - Real model/provider boot, restart, and token-cost telemetry.
   - Production-like 24-hour continuous soak test.
   - Formal Profile B passing certification run (Profile B harness in `MESA_E2E_Certification` currently fails closed).
   - Local GPG signing key was unavailable; the annotated `v0.8.0` tag is unsigned.
4. **Governing Principle on Website:**  
   The website must present v0.8.0 as an available, owner-approved source release with explicit architectural improvements, but must **never claim production readiness or complete certification**.

---

## 3. Primary Authoritative Documents Consulted

The following primary source files within MESA Core v0.8.0 define the ground truth for all website claims:

| Source File | Scope / Subject Matter | Key Verified Constraints |
|---|---|---|
| `CHANGELOG.md` (v0.8.0) | Complete implementation history since v0.7.1 | Added typed legal identity, bounded adaptive context retrieval, selectable validation policies, durable projection rebuilds, SQLite `synchronous=FULL`, backup authority. |
| `docs/release-notes-v0.8.0.md` | Official v0.8.0 release statement & limitations | Owner-approved source release, production NO-GO, missing 24h soak, unsigned tag. |
| `docs/architecture-v4.md` | Canonical V4 system architecture | Single `combined` process writer topology, tenant security hierarchy, SQLite canonical authority, LanceDB/Kùzu projections, ingestion pipeline states. |
| `docs/retrieval-and-graph.md` | 4-lane retrieval & scoring mechanics | Vector, BM25, Assertion, Graph path lanes; exact RRF formula: $RRF(c) = \sum \frac{w_{lane}}{k + r_{lane}(c)}$ ($k=60, w=1.0$); citation boosts; post-RRF legal factor; ContextBuilder token budget. |
| `docs/concepts-and-ingestion.md` | Data lifecycle & admission | Scoped admissions, immutable revisions, typed legal identity validation, pipeline states `QUEUED` to `COMMITTED`. |
| `docs/configuration.md` | Runtime environment & flags | `MESA_TIER3_MODE` (0, 1, 2), `MESA_STORAGE_ROOT`, provider configurations, embedding dimension contracts. |
| `docs/api-reference.md` | REST API contracts & capabilities | `GET /v4/capability`, `/v4/memory/insert`, `/v4/sessions/{id}/context`, scrypt API keys. |
| `docs/migration-v0.8.0.md` | Breaking changes & upgrade procedures | Forward schema requirements, `assertion-semantic-v1`, storage root offline rebuild, rollback sequence. |
| `docs/installation.md` & `README.md` | Setup & deployment commands | Python 3.10–3.13, locked setup via `uv==0.9.6`, `uv sync --locked --extra dev`. Explicit separation of V3 smoke vs V4 canonical provider dependencies. |
| `docs/ecosystem.md` | Ecosystem boundaries | MESA Core, MESA_Data, MESA_E2E_Certification, MESA_QA, MESA_Law ownership boundaries. |

---

## 4. Ecosystem Checkouts and Verification

In addition to MESA Core, external ecosystem repositories were verified:

1. **`MESA_E2E_Certification`** (`/home/yasin/Desktop/MESA_E2E_Certification`):
   - Commit: `3b7562c` (Merge pull request #17 from `fix/profile-b-comprehensive-certification-hardening`).
   - Verified status: Hardened fail-closed harness; official Profile B certification remains **BLOCKED**; production NO-GO.
2. **`MESA_QA`** (`/home/yasin/Desktop/MESA_QA`):
   - Commit: `4f6c7ec` (chore(state): record live smoke first-write failure).
   - Role: Detached behavioral test engineer, candidate repair workflow.
3. **`MESA_Data`** (`https://github.com/Yasou13/MESA_Data`):
   - Role: Turkish legal data platform (Resmî Gazete, Mevzuat, Anayasa Mahkemesi, Yargıtay disabled), raw byte preservation, canonical JSONL, human-initiated delivery.
4. **`MESA_Law`** (`https://github.com/Yasou13/MESA_Law`):
   - Role: Primary vertical reference application for legal matter/document workflows. Local Law-side gates passed, but live full-stack MESA Core integration remains pending.

---

## 5. Baseline Verdict

The website baseline is strictly **MESA Core v0.8.0** at commit `07d387f9` / tag `v0.8.0`. All prior website claims referencing `v0.7.1` or older staging assumptions are superseded.
