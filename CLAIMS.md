# Public claim verification

Verification date: 2026-10-01

Core HEAD was rechecked at `8af7941` before the final visual pass. That merge
adds the V4 temporal request schema in `mesa_api/v4_router.py` plus its focused
test and lockfile update; it does not change the version, storage ownership,
retrieval origins, interface boundaries, or readiness claims recorded below.

This checklist records the source used for important public website claims.
It is not a substitute for the repositories' own release or certification
authority.

| Claim | Source | Result |
|---|---|---|
| Core is version 0.7.1, V4 release candidate, production `NO-GO` | `Yasou13/MESA` `README.md`, `pyproject.toml`, `docs/architecture-v4.md` at `8af7941` | Verified |
| SQLite is canonical; LanceDB and Kùzu are derived projections | Core architecture, API reference, DAO/provider code at `7c03eff` | Verified |
| V4 retrieval can report vector, BM25, assertion, and graph origins | Core `docs/api-reference.md`, `mesa_api/v4_router.py`, DAO retrieval, and `tests/test_v4_independent_retrieval_audit.py` at `7c03eff` | Verified |
| The public fixture has `Alice knows Aurora`, all four lanes at rank 1, and expected RRF `4/61` | Core `test_real_four_lanes_fuse_once_and_repeat_deterministically` at `7c03eff` | Verified; labelled fixture, not benchmark |
| Dataset/tenant/agent/temporal/jurisdiction eligibility is applied before fusion | Core independent retrieval audit tests and V4 route/DAO code at `7c03eff` | Verified |
| V4 exposes HTTP and sync/async Python SDK surfaces | Core API reference and `mesa_client/client.py` at `7c03eff` | Verified |
| MCP exists as a V3-compatible direct stdio server and a newer V4 gateway/bridge path | Core README, `README_MCP.md`, package scripts, and MCP source at `7c03eff` | Verified |
| MESA Data is Turkish legal-data infrastructure, not a universal ingestion product | `Yasou13/MESA_Data` README/config/source at `6b5a444` | Verified |
| Resmî Gazete, Mevzuat, and AYM are enabled; Yargıtay is configured but disabled | MESA Data `config/sources.yaml` at `6b5a444` | Verified |
| MESA QA tests correctness, temporal behavior, persistence, restarts, and isolated candidate repair with no automatic merge/push | `Yasou13/MESA_QA` README/config/scenarios at `4f6c7ec` | Verified |
| Profile B certification remains blocked; no legitimate passing runtime transaction was executed | `Yasou13/MESA_E2E_Certification` independent audit at `4ec51e0` | Verified |
| MESA Law is a provenance-sensitive legal reference workflow over a versioned V4 HTTP boundary | `Yasou13/MESA_Law` contract and UI/UX verification at `e71f785` | Verified |
| Law-side gates passed but full-stack/live Core integration remains `NO-GO` | MESA Law `docs/mvp-final-verification.md` at `e71f785` | Verified |
| Public maintainer/contact identity is the `Yasou13` GitHub account and Core issue tracker | Repository ownership and public links | Verified without inferring a company or team |

## Source inconsistency handled

The short retrieval paragraph in `docs/architecture-v4.md` groups retrieval as
SQL, vector, and graph lanes. The current API reference, capability contract,
runtime route/DAO code, and independent retrieval tests expose four result
origins: `vector`, `bm25`, `assertion`, and `graph`. The website follows the
executable contract and tests, and explicitly notes this documentation
compression on the Core page instead of silently treating the older three-lane
wording as exact.

## Claims deliberately not made

- no customer, pilot, testimonial, adoption, or production-deployment claims;
- no universal latency, accuracy, uptime, security, or compliance guarantee;
- no pricing, SaaS, hosted cloud, commercial support, or enterprise plan;
- no valid current Profile B PASS;
- no claim that the historical or internal benchmark material is production
  evidence;
- no claim that MESA Law has completed live Core/full-stack integration;
- no claim that MESA Data is a general-purpose web ingestion platform.

## Beginner introduction revision — 2026-10-18

The home and how-it-works explanations were checked directly against the local
Core checkout at `d3947846615e63b48dc7a5df9f1051b29f734263` (v0.8.1).

| Explanation / diagram | Core evidence |
|---|---|
| Application → Core → source-linked evidence; application model writes the answer | `docs/architecture-v4.md` (runtime, retrieval, limitations), `docs/retrieval-and-graph.md` (context); Core retrieval does not generate answers |
| Source admission is separate from completed processing | `docs/architecture-v4.md` (canonical ingestion, pipeline and failure model) |
| SQLite authority; derived LanceDB/Kùzu views; SQL → vector → graph writes | `docs/architecture-v4.md` (pipeline, canonical entities), `README.md` |
| Four lanes and eligibility before rank contribution | `mesa_storage/dao.py::MemoryDAO.search_v4_memory`, `docs/retrieval-and-graph.md` |
| RRF combines ranks rather than truth probabilities | `mesa_storage/retrieval_scope.py::compute_rrf_lane_score`, `rrf_fuse_lanes` |
| Document/revision/chunk/evidence source chain | `docs/architecture-v4.md` (canonical ingestion, retrieval) |
| Real fixture: four rank-one lanes, deterministic replay, 4/61 | `tests/test_v4_independent_retrieval_audit.py::test_real_four_lanes_fuse_once_and_repeat_deterministically` |

The Atlas archive note is explicitly fictional and illustrative. The browser
walkthrough performs no Core query or model call. Its four stages explain the
lifecycle, rather than reproduce runtime timing or imply measured quality.
The repository fixture is separately disclosed as a contract test using mock
vectors, not a semantic benchmark. No new readiness or customer claims are made.

## Architecture diagrams and spacing revision — 2026-10-18

The detailed architecture page follows the same Core v0.8.1 `d394784` baseline.
Runtime and module boundaries, the canonical/derived-store split and ownership
recovery follow `docs/architecture-v4.md`. The write path separates HTTP 202
admission from terminal completion, and pipeline aggregate states from mutation
write states, following `docs/concepts-and-ingestion.md`. Model extraction of
0..N facts was checked in `mesa_memory/extraction/service.py`; ordered write
handling was checked in `mesa_workers/projection_worker.py`. Read-side scope,
four lanes, default single query, optional adaptive context and 2048-token
context defaults follow `docs/retrieval-and-graph.md` and the prior source map.
Diagrams represent responsibilities inside the supported combined process,
not independent storage-writing services. The simplified Atlas example remains
illustrative. No runtime capability or certification claim was added.

## Evidence change scenario — 2026-10-24

The home and how-it-works scenario now illustrates three-document dependency
retrieval, explicit revision replacement, session dataset access, and source
rollback. The Atlas project, services, team, passages and displayed responses
are fictional, scripted examples; they are not recorded Core query results or
quality measurements. Links identify immutable Core v0.8.1 `d394784` evidence:

| Displayed mechanism | Source at d394784 |
|---|---|
| Three-hop supported graph path | `tests/test_v4_independent_retrieval_audit.py::test_real_three_hop_mixed_direction_and_path_alignment` (real Kùzu graph; no semantic quality claim) |
| Matched and supporting source passages remain aligned | `tests/test_v4_independent_retrieval_audit.py::test_graph_primary_source_and_parallel_paths_remain_aligned` |
| Out-of-scope data cannot contribute to any lane or model-visible context | `tests/test_v4_independent_retrieval_audit.py::test_all_lanes_reject_shared_entity_scope_collisions_before_fusion` (real SQL/graph, mock vectors) |
| Explicitly ingested new revision supersedes prior assertions | `docs/architecture-v4.md`, artifact ownership and rollback |
| Source-owned rollback; independent knowledge survives | `docs/architecture-v4.md`, artifact ownership and rollback |

The revision example does not imply automatic truth resolution between arbitrary
conflicting documents. Access examples describe a server-bound session's data
scope, not client-side security enforcement. The operations source is visibly
excluded from the illustrated model context when access is absent; its sample
metadata is shown only to explain the fictional scene. The updated status does
not certify project readiness. MESA returns evidence, while the application's
model produces the final answer. Existing alpha/readiness notices remain.
