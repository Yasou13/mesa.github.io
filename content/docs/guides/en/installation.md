## Install the released package

Python 3.11–3.13 is the tested matrix. Linux/macOS run natively; Windows uses Docker or WSL. Install the version matched to these guides:

```bash
pip install "mesa-memory[adapters]==0.9.0"
mesa start
```

The CLI provisions the local catalog, grants, storage and credentials. Models default off; documents can be ingested and searched with BM25. Optional `adapters` and `ml` extras support the selected model providers. No separate database server is required.

## Use the pinned source checkout

For development, use the released Git object and lockfile:

```bash
git clone --branch v0.9.0 --depth 1 https://github.com/Yasou13/MESA.git
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
