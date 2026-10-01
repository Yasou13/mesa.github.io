# Public claim verification

Verification date: 2026-10-01

This checklist records the source used for important public website claims.
It is not a substitute for the repositories' own release or certification
authority.

| Claim | Source | Result |
|---|---|---|
| Core is version 0.7.1, V4 release candidate, production `NO-GO` | `Yasou13/MESA` `README.md`, `pyproject.toml`, `docs/architecture-v4.md` at `7c03eff` | Verified |
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
