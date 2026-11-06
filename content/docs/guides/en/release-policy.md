## Publication and production qualification

This site follows the v0.9.2 source release. Alpha / production NO-GO remains; release publication, CI results and DEV retrieval measurements do not establish certification. GitHub and PyPI v0.9.2 publication were verified on 7 November 2026. The PyPI wheel’s 150 Python source files match the tagged release.

## Tag, identity and build evidence

The official v0.9.2 release records an SSH-signed annotated tag and a passing full local signed-tag preflight. Tag signatures verify the signer; OIDC build attestations tie artifact digests to the build identity. The release attaches verified provenance reports constrained to Yasou13/MESA, .github/workflows/ci.yml, refs/tags/v0.9.2 and release commit 8cd2cfe1df5356e73b3bef83ae640850fd54c798. These are separate evidence from production certification.

## Trusted publishing setup

The tag-triggered `.github/workflows/release.yml` builds wheel/sdist, validates them with Twine and publishes with GitHub Actions OIDC. The owner must configure the PyPI `mesa-memory` trusted publisher once: owner `Yasou13`, repository `MESA`, workflow `release.yml`, environment `pypi`; create the matching GitHub `pypi` environment. A workflow existing is not proof of package publication. Use [installation](docs/core/installation/) for the verified artifact path and [migration](docs/core/migration/) before touching an existing root.
