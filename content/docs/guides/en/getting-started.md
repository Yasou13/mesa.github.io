## Install the pinned release

Use a disposable local checkout and Python 3.10–3.13, the CI-tested matrix. The package declares Python >=3.10. These commands select the released source and its lockfile.

```bash
git clone --branch v0.8.0 --depth 1 https://github.com/Yasou13/MESA.git
cd MESA
uv sync --locked --extra dev
uv pip check
```

## Provision before startup

The following profile uses no model or external provider. It demonstrates V3 raw-memory admission and lexical retrieval, not canonical V4 extraction. The generated key belongs only to this temporary storage root. Do not share it or capture it in logs.

```bash
export MESA_STORAGE_ROOT="$(mktemp -d /tmp/mesa-quickstart-XXXXXX)"
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

In another terminal with the same environment, start the server on loopback. Wait for readiness, then run the checked-in example. It creates an authorized session, inserts neutral text, polls for processed state and verifies scoped retrieval. The command is not a real-model benchmark. Stop the process before removing only the newly created temporary root.

```bash
.venv/bin/python -m uvicorn mesa_memory.api.server:app --host 127.0.0.1 --port 18080
```

```bash
curl --fail http://127.0.0.1:18080/health/init
curl --fail -H "X-API-Key: $MESA_API_KEY" http://127.0.0.1:18080/health
.venv/bin/python -m examples.v3_quickstart
```
