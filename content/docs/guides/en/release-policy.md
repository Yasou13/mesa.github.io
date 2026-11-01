## Publication and production qualification

This site follows the v0.9.1 source release. Alpha / production NO-GO remains; release publication, CI results and DEV retrieval measurements do not establish certification. GitHub and PyPI v0.9.1 publication were verified on 1 November 2026. The PyPI wheel’s 149 Python source files match the tagged release.

## Tag, identity and build evidence

The normal reviewed release process uses an annotated GPG-signed tag and signature preflight against a trusted operator keyring. The owner explicitly approved an unsigned annotated tag for v0.9.1; signed-tag preflight success is not claimed. GPG proves the tag signer; OIDC build attestation ties artifact digests to the build identity. They are different evidence.

## Trusted publishing setup

The tag-triggered `.github/workflows/release.yml` builds wheel/sdist, validates them with Twine and publishes with GitHub Actions OIDC. The owner must configure the PyPI `mesa-memory` trusted publisher once: owner `Yasou13`, repository `MESA`, workflow `release.yml`, environment `pypi`; create the matching GitHub `pypi` environment. A workflow existing is not proof of package publication. Use [installation](docs/core/installation/) for the verified artifact path and [migration](docs/core/migration/) before touching an existing root.
