## Choose a supported runtime

V4 runs one model-enabled combined owner per storage root. V3 compatibility uses separate API/worker roles and still needs operational embeddings for ingestion. Keep V3 and V4 roots separate.

## Install the base environment

Use `uv sync --locked --python 3.10` and `uv pip check`; Python 3.10–3.13 are CI-tested. Native storage and HTTP/SDK support are included. Add `dev` for tests, `ml` for local models and `adapters` for provider SDKs as needed. Models-disabled startup needs no ML extra or database server. See [providers](docs/core/embedding-providers/).

## Provision before deployment

Prepare credentials, ACLs, an explicit storage root and reviewed provider settings. Use the current installation section in the source below for native and Docker deployment. Readiness alone does not qualify production.
