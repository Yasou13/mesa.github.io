# Testing and developer workflow

Install the declared environment with `uv sync --locked --python 3.11 --extra dev`, then run
`uv pip check`. Use [CONTRIBUTING](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/CONTRIBUTING.md) and [architecture](docs/core/architecture/)
for module boundaries and documentation requirements.

```bash
uv lock --check
uv run ruff check .
uv run mypy mesa_memory mesa_storage mesa_workers mesa_api mesa_client \
  --ignore-missing-imports --explicit-package-bases --follow-imports=skip
make test-local
```

`test-local` selects `not optional_provider and not optional_mcp and not live_external and not timing`.
For the complete installed contract environment use `dev` and `adapters`, then
`make test-all`. Optional provider/MCP tests use mocks; live-external tests require
explicit external enablement. Do not run official TEST or production calls as
documentation smoke. Historical unsafe proof scripts are not release commands.
The obsolete backup/restore proof that modified real `./storage` data has been
removed. Use the isolated recovery contract tests instead.

Inspect fixture roots before execution: `tests/conftest.py` includes
`.test_storage_tmp` fixtures, while runtime contracts use explicit isolated roots.
Do not point a test at user storage or assume `--basetemp` redirects every
custom fixture. Native stores/model tests may consume substantial memory; run
focused checks sequentially before considering load or provider tests.

Focused tests cover V4 API/SDK, revision/ownership, projection fencing, provider
identity, vector representation, graph provenance, temporal/scope filtering,
recovery and bounded query planning. Start with the affected contract, then run
the established broader gates. Tests must not turn backend errors into empty
successful answers or skip failing security checks.

Lightweight authored-document checks:

```bash
.venv/bin/python scripts/check_documentation.py
```

This checks selected first-party prose links/anchors and supported code-fence
syntax. All maintained root documents, guides and ADRs are included, including
the root architecture entry point. Reports, results and `for_mvp/` are outside
this check. No MkDocs/Sphinx site is configured. Executable quickstart is a
separate check.
A static parse is not an executed example; each smoke report must name real,
mocked, skipped or unavailable backend evidence.

Build artifacts with `uv build --wheel`; inspect metadata, migration data and
fresh imports. CI coverage floor is 82 including SDK, MCP service floor is 55.
Legacy full-tree Black/Mypy debt is reported separately; do not call that debt
fixed because the narrower production checks passed.

<a id="ci-assurance"></a>

## CI assurance

CI does not replace a real production environment; it produces repeatable contract and
artifact evidence for the same commit.

| Area | Blocking check | Artifact |
|---|---|---|
| Secrets | TruffleHog history scan + tracked-secret policy | security assurance |
| Code quality | Ruff, scoped Black, production Mypy, override ratchet | job log |
| V4 contract | API, SDK, catalog, ownership, Graph V2, projection, RRF, admin CLI | `v4-contract` |
| V3 compatibility | Principal, queue, worker, finalization and existing route tests | core JUnit |
| Security | V3 isolation + v4 tenant/workspace/dataset negative tests | security/v4 JUnit |
| Migration/DR | Alembic closure, recovery, v4 rebuild/projection tests | migration/DR |
| Package | Wheel install, v3/v4 imports, admin CLI smoke | package report |
| Retrieval contract | Core deterministic RRF ablation and closure manifest | `v4-contract`; comparative benchmark evidence is external |
| Container | Non-root image, v3 Compose and v4 single-combined Compose | Docker logs |
| Documentation | Documented CLI/import/Compose commands | docs smoke |
| Coverage | Full test coverage threshold | HTML/XML report |

`MESA CI` runs quality and core contracts on four Python versions.
The `v4-contract` job makes the versioned surface separately visible; it does not rely
on v4 tests happening to be included in the general coverage run.

The `v4-contract` and `migration-dr` jobs also upload a content-free closure evidence
manifest. The manifest contains the single Alembic head, the canonical OpenAPI hash/count,
a bounded JUnit hash/result summary, golden candidate/mutation/pipeline/entity/
assertion IDs, deterministic RRF ablation values and small fixture SQLite
registry/store counts. Source/query content, credentials, filesystem paths and raw test
output are not in the manifest.

The comparative benchmark suite and the old `Benchmark data quality` workflow are not
in the Core checkout; they belong to the `mesa_benchmark` project. The small
deterministic RRF fixture in Core CI is not comparative model-quality evidence.
External benchmark evidence required for a release is tied to the same commit separately.

`MESA external release gates` tests the single combined storage owner with `docker-compose.v4.yml`.

V4 Compose starting model-disabled in CI proves only the topology, health, ACL/admin
CLI and restart contract. Real full-cognitive provider behavior is a staging gate.

### What CI does not prove

- a 24-hour production-like soak;
- quality/cost/security results with a real provider;
- migration time at production storage size;
- the secret, network and disk behavior of the real deployment platform.
- the real-provider rehearsal, skipped because the environment preflight failed.

No GO can be given until this evidence is added to the release evidence package from outside.

### Triggering workflows

The Core checkout contains `.github/workflows/ci.yml` and `external-release-gates.yml`.
The comparative benchmark workflow is not triggered here. The release policy still
requires benchmark evidence; this gate cannot count as complete until the owner links the
external workflow/evidence to the same commit. Changes to workflow YAML, dependency locks,
Docker/Compose and docs trigger the related smoke gates. The weekly legacy static baseline
only makes debt visible and does not replace the current v4 blocking contract.
