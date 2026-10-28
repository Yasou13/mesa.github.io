# Release procedure

The pinned source describes V4 package `0.9.0` before owner publication. The owner previously authorized the v0.8.1 source release exception recorded below. See the website release notes for the subsequent v0.9.0 publication. Production qualification
is still assessed as a release candidate. The production decision stays `NO-GO`
until Final MVP Certification is complete. Assigning a version number or a tag
does not on its own mean production GO. Old V3 tags/release records are read in their historical context.

## Mandatory v4 gates

Production GO can be given only when all of the following evidence exists for the
same commit. A source publication exception, if any, is recorded per release; it
does not mark these gates as met:

- locked build, Ruff, Black and Mypy;
- all core and benchmark contract tests;
- v4 API/SDK/MCP contract parity;
- Tier-3 rejection, retry, lease loss, projection crash and rollback tests;
- Graph V2 identity/provenance/purge and two-way reconciliation;
- cross-tenant/workspace/dataset negative security tests;
- dataset-filtered RRF lane ablation and a vector-only comparison report;
- production-like queue saturation, worker crash and concurrency;
- offline backup → restore → rebuild → parity → cutover rehearsal;
- boot/restart, cost and token evidence with the selected real provider/model;
- a 24-hour soak.

The production-readiness decision stays `NO-GO` until every gate, including the last,
passes. CI success alone is not GO.

## Local preflight

On a clean checkout at the release commit:

```bash
uv lock --check
uv sync --locked --python 3.11 --extra dev
uv pip check
uv run ruff check .
uv run mypy mesa_memory mesa_storage mesa_workers mesa_api mesa_client \
  --ignore-missing-imports --explicit-package-bases --follow-imports=skip
make test-local
# Separate adapter-inclusive gate: make test-all after installing dev + adapters
uv build --wheel
```

Compose contracts:

```bash
MESA_API_KEY=release-placeholder \
MESA_PRINCIPAL_ID=release-principal \
MESA_MODEL_ENABLED=false \
MESA_EXTERNAL_PROVIDER_ENABLED=false \
docker compose -f docker-compose.v4.yml config --quiet
```

This model-disabled render only validates the deployment topology.
Full-cognitive evidence comes from a separate staging rehearsal with a real provider.

## CI evidence

These workflows must pass on the release commit:

- `MESA CI`: quality, v4 contract, security, migrations, package and coverage;
- Benchmark contracts and the dataset-filtered RRF ablation artifact:
  the old `Benchmark data quality` workflow has been removed from Core; separate
  `mesa_benchmark` evidence must be tied to the same release commit. Its absence is not a PASS;
- `MESA external release gates`: v3 compatibility Compose, v4 combined Compose,
  flow, bounded capacity and executable docs.

A 24-hour soak does not fit in a GitHub-hosted runner's time limit; it runs outside, in a
production-like environment. Start/end time, image digest, config hash,
health/parity series, restart/incident log and a result summary are kept as release evidence.

## Version, build and tag

After the gates pass:

1. Apply the SemVer decision to `pyproject.toml` and `CHANGELOG.md`.
2. Run the release commit through CI.
3. Produce and verify the wheel/SBOM on a clean checkout.
4. An authorized operator creates a signed annotated tag.

```bash
git tag -s vX.Y.Z -m "MESA vX.Y.Z"
python scripts/release_preflight.py vX.Y.Z
git push origin vX.Y.Z
```

The Core CI tag job produces a reproducible wheel, a CycloneDX SBOM and a GitHub OIDC
attestation. The repository workflows do not create a GitHub Release or a production
deployment automatically.

On the CI tag checkout only SemVer, the `pyproject.toml` version and the CHANGELOG
heading are verified. Annotated tag and signature verification is done with the full
preflight command above, on a clean checkout that has the trusted operator keyring;
CI neither imitates nor weakens this signature check.

The release operator must download the **OIDC build attestations** produced for the wheel
and SBOM and verify them together with the artifact digests.

## Migration and rollback package

Release artifacts carry together:

- wheel/image digest and SBOM;
- the Alembic head and the migration rehearsal result;
- the backup manifest format and restore verification;
- the V4 upgrade/projection rebuild/parity report; separate ingestion verification if V3 content is moved;
- the retained backup location and the cutover rollback procedure;
- v4 API/OpenAPI, SDK/MCP contract test results;
- benchmark and soak evidence.

Restore never overwrites an existing target. If a parity or health gate fails, there is
no cutover; the old storage and the v3 compatibility service are kept.

## Release-specific publication exceptions

The v0.8.1 source publication was explicitly approved by the repository owner on 18 October 2026.
Because no local GPG key was available, this release uses an annotated, unsigned tag;
signed-tag preflight success is not claimed. Real-provider and production
certification are not part of this source publication. Details are recorded in the
[v0.8.1 release notes](docs/core/release-notes/#v081-publication).

The v0.8.0 source publication approval, unsigned tag and missing certification evidence
are kept in the [v0.8.0 release notes](docs/core/release-notes/#v080-publication). This exception
does not carry over to later releases and does not count as production GO. This page defines
the general procedure; the release notes define the status of that publication.
