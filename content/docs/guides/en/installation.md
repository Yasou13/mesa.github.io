## Install the released package

CI tests Python 3.11–3.13. Installing the 0.9.5 wheel was also checked in a clean Python 3.14 environment, where it pulls in LanceDB 0.41.0 and no graph database. Linux/macOS run natively; Windows uses Docker or WSL. Install the version matched to these guides:

```bash
pip install mesa-memory==0.9.5
mesa start
```

The CLI provisions the local catalog, grants, storage and credentials. Models default off; documents can be ingested and searched with BM25. Optional `adapters` and `ml` extras support the selected model providers. No separate database server is required.

## Use the pinned source checkout

For development, use the released Git object and lockfile:

```bash
git clone --branch v0.9.5 --depth 1 https://github.com/Yasou13/MESA.git
cd MESA
uv sync --locked --python 3.11
uv pip check
```

## Run local Docker

```bash
docker compose -f docker-compose.v4.yml up --build -d
docker compose -f docker-compose.v4.yml exec -T mesa-v4 mesa add - --source file://document.txt < document.txt
docker compose -f docker-compose.v4.yml exec mesa-v4 mesa search "archive"
```

Run Compose from the pinned source checkout, with your own `document.txt` present. The container runs `mesa start`, binds internally to `0.0.0.0` and publishes only on the host loopback. Its volume retains data and credentials at `/var/lib/mesa/credentials.json`. One combined writer owns each storage root. Readiness and local startup do not qualify production.

## Package index and optional extras

On 24 November 2026, GitHub tag `v0.9.5` and PyPI 0.9.5 publication were verified. Both the wheel and sdist are present and not yanked. Base installation and upgrade:

```bash
pip install mesa-memory==0.9.5
pip install --upgrade mesa-memory==0.9.5
```

OpenAI and Ollama SDKs are included in the base package. Anthropic needs `[adapters]`; local embedding and BGE reranking need `[ml]`. Install only the extras needed for your selected provider:

```bash
pip install "mesa-memory[adapters]==0.9.5"
pip install "mesa-memory[ml]==0.9.5"
```

Publication does not change the Alpha / production NO-GO status.
