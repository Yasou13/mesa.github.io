## Install the pinned release

Use a disposable local checkout and Python 3.10–3.13, the CI-tested matrix. The package declares Python >=3.10. These commands select the released source and its lockfile.

```bash
git clone --branch v0.8.1 --depth 1 https://github.com/Yasou13/MESA.git
cd MESA
uv sync --locked --python 3.10
uv pip check
```

## Provision before startup

The following profile uses no model or external provider. It checks installation, credentials and readiness. It cannot complete V3 ingestion or canonical V4 insertion; embeddings and canonical extraction must be provisioned separately. The generated key belongs only to this temporary storage root. Do not share it or capture it in logs.

```bash
mkdir -p "$HOME/mesa-doc-demos"
export MESA_STORAGE_ROOT="$(mktemp -d "$HOME/mesa-doc-demos/run-XXXXXX")"
export MESA_RUNTIME_PROFILE=combined
export MESA_LOAD_DOTENV=false
export MESA_MODEL_ENABLED=false
export MESA_EXTERNAL_PROVIDER_ENABLED=false
export MESA_TIER3_MODE=0
export MESA_PRINCIPAL_ID=docs-principal
export MESA_PORT=18080
export MESA_API_KEY="$(.venv/bin/mesa-v4-admin issue-key --principal docs-principal)"
.venv/bin/mesa-v4-admin grant-role --principal docs-principal --tenant docs-tenant --role OWNER
.venv/bin/mesa-v4-admin grant-agent --principal docs-principal --agent docs-agent --permission SESSION_CREATE
```

## Run and verify

Start the loopback server after provisioning. Use a second terminal with the same exported settings and privately supplied key for health checks. Models-disabled V4 insertion returns `503 canonical_processing_unavailable`; V3 processing also needs embeddings. Stop the process before removing only the newly created temporary root.

```bash
.venv/bin/python -m uvicorn mesa_memory.api.server:app --host 127.0.0.1 --port 18080
```

```bash
curl --fail http://127.0.0.1:18080/health/init
curl --fail -H "X-API-Key: $MESA_API_KEY" http://127.0.0.1:18080/health
```

## First source-backed V4 insertion

On a new root, provision the model-enabled combined runtime, extraction and embedding providers, catalog and ACLs described in the source below. Then run `.venv/bin/python -m examples.v4_quickstart`. It checks `COMMITTED`, prints assertion/source references and ends the session. A timeout does not cancel a mutation. `make health` checks the running API using `MESA_BASE_URL` and `MESA_API_KEY`.
