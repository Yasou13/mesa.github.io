## Check the prerequisites

This is a local evaluation. You will add text and retrieve a result with its source; no model account is required. MESA does not write the final answer. A terminal is the application where you enter commands; open Terminal on Linux or macOS.

### Linux and macOS

You need Python 3.11–3.13 and pip. Check the version first:

```bash
python3 --version
```

**Success:** the output begins with `Python 3.11`, `3.12` or `3.13`. If Python is missing or a different version is installed, use the [official Python downloads](https://www.python.org/downloads/). If venv is missing on Linux, install your distribution’s Python venv package.

### Windows: WSL

`mesa start` does not run in native Windows PowerShell. Follow [Microsoft’s WSL installation guide](https://learn.microsoft.com/windows/wsl/install), open a Linux terminal and use the Linux commands below there. Check Python inside WSL.

### Docker path

If you prefer containers, [install Docker](https://docs.docker.com/get-started/get-docker/) and skip to [Docker setup](#docker-setup).

## Install v0.9.0

Run these commands in a new working directory. The virtual environment keeps MESA packages separate from your other Python projects.

```bash
python3 -m venv .venv
. .venv/bin/activate
python -m pip install "mesa-memory[adapters]==0.9.0"
mesa --help
```

**Success:** the help lists `start`, `add`, `search` and `status`. For `mesa: command not found`, run `. .venv/bin/activate` in the correct directory.

## Start the local server

In Terminal 1:

```bash
mesa start
```

**Success:** the server starts at `http://127.0.0.1:8000` and logs `Application startup complete`. Keep this window open. Local storage is in `~/.mesa/data` and private credentials in `~/.mesa/credentials.json`.

Models and external providers are off by default; an existing `.env` configuration can change those defaults. This guide uses word search.

## Add a document and search

Open Terminal 2 in the same working directory and activate the environment:

```bash
. .venv/bin/activate
```

Create the UTF-8 sample document. Save its receipt in `receipt.json` for the next step:

```bash
printf '%s\n' 'The Atlas archive opens at 09:00 on weekdays.' > archive-en.txt
mesa add archive-en.txt --source file://archive-en.txt --json > receipt.json
cat receipt.json
```

Selected receipt fields from the recorded run are shown below. Your identifiers can differ; `receipt.json` contains your own complete receipt.

```json
{
  "document_id": "doc-5239a0bb570c977f678a3a48e2947b81",
  "revision_number": 1,
  "chunk_count": 1,
  "mutation_ids": [
    "8db5a8d0-d6f0-592c-8d23-23d27662de2c"
  ]
}
```

**Success:** the receipt includes `document_id`, `chunk_count` and `mutation_ids`. This is admission, not proof that the document is searchable yet.

## Verify processing has finished

Save the following code as `wait_for_document.py`. It reads local credentials automatically and checks the terminal state of every mutation:

```python
import json
from mesa_client import Mesa, MesaV4Client

receipt = json.load(open("receipt.json", encoding="utf-8"))
with Mesa() as local:
    with MesaV4Client(local.base_url, api_key=local.api_key) as client:
        for mutation_id in receipt["mutation_ids"]:
            state = client.wait_until_committed(mutation_id)
            print(mutation_id, state["state"])
            if state["state"] != "COMMITTED":
                raise SystemExit("Document processing failed")
```

```bash
python wait_for_document.py
```

**Success:** every line ends with `COMMITTED`. Another terminal state makes the script fail; do not treat that document as successfully processed. On timeout, check that the server is running and run the same script again. The [status API](docs/core/api-reference/) exposes the details.

`mesa status` reports server readiness and health; it does not verify that document mutations have finished.

## See your first search result

```bash
mesa search "archive"
```

Recorded real CLI output:

```text
[1] score: 0.033 | doc-5239a0bb570c977f678a3a48e2947b81
    The Atlas archive opens at 09:00 on weekdays.
```

**Success:** the result contains your document’s `09:00` text and document identifier. Identifiers and scores can differ; a score is not a truth probability. Inspect source and revision fields in the [recorded example on the home page](https://mesamemory.dev/#example).

**Empty result:** run the completion script first, then search for the exact word in your document. **Connection error:** keep Terminal 1 running and check for healthy `mesa status` output. **Port already in use:** check for another MESA instance; this guide does not require deleting existing storage.

## Docker setup

This path needs Git, Docker Engine/Desktop and Compose. Open the pinned source release:

```bash
git clone --branch v0.9.0 --depth 1 https://github.com/Yasou13/MESA.git
cd MESA
docker compose -f docker-compose.v4.yml up --build -d
docker compose -f docker-compose.v4.yml exec mesa-v4 mesa status
```

**Success:** the status output shows `ready` and `healthy`. Compose publishes port 8000 only on the host loopback address; the volume preserves data and credentials.

Run the document, completion and search steps inside the container. Open a shell with:

```bash
docker compose -f docker-compose.v4.yml exec mesa-v4 sh
```

Skip virtual-environment activation in this shell. Create the sample file, then use the `mesa add` command and Python completion script above. Enter `exit` when done. A host-side `mesa` command does not automatically read container credentials. See the [deployment guide](docs/core/installation/) for details.

## Use Python or connect an MCP client

After your first successful search, open the [Python SDK examples](docs/core/examples/) or [MCP guide](docs/mcp/). Generate MCP settings with:

```bash
mesa mcp-config
```

The output contains your local API key; keep it private. MESA returns context; your application and its model write the final answer.

## Enable optional models and graph

You do not need this for your first search. For semantic search and extraction, review [model configuration](docs/core/configuration/) and [providers](docs/core/embedding-providers/). External providers can transmit data and incur usage charges. Re-enabling graph/embeddings can backfill skipped work at startup. Local success does not establish production qualification; production checks remain incomplete.
