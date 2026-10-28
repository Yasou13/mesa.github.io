## Install v0.9.0

Use Python 3.11–3.13. Linux and macOS run natively; Windows users can use Docker or WSL.

```bash
pip install "mesa-memory[adapters]==0.9.0"
mesa start
```

`mesa start` starts a local server at `http://127.0.0.1:8000`, provisions storage in `~/.mesa/data` and writes private credentials to `~/.mesa/credentials.json`. Leave this terminal running. Models and external providers are off by default; BM25 lexical search works without a model.

## Add a document and search

In a second terminal, add a UTF-8 text file and search it. The server splits the complete document into deterministic chunks and tracks its revision. These commands use the local credentials automatically.

```bash
printf '%s\n' 'The archive opens at nine on weekdays.' > document.txt
mesa add document.txt --source file://document.txt
mesa search "archive"
mesa status
```

`Mesa.add()` and `mesa add` return an admission receipt. Background processing must finish before the new document is searchable; HTTP 202 alone is not completion. Inspect the receipt's mutations when needed with the [mutation status API](docs/core/api-reference/).

## Use Python or connect an MCP client

After starting the local server, `Mesa()` reads the credentials automatically. Explicit arguments and `MESA_API_KEY` / `MESA_BASE_URL` can override the connection. The context contains evidence for your application’s language model; MESA does not generate the final answer.

```python
from mesa_client import Mesa

with Mesa() as mesa:
    print(mesa.search("archive"))
    print(mesa.context("When does the archive open?"))
```

```bash
mesa mcp-config
```

The MCP configuration includes your local API key. Keep it private and paste it into your MCP client’s configuration. Direct stdio uses the client’s tool approvals and the key’s grants; gateway approvals are a separate path.

## Enable optional models and graph

Models are optional. Set `MESA_MODEL_ENABLED=true`, `MESA_LLM_MODEL=provider:model` and `MESA_EMBEDDING_MODEL=provider:model` for extraction and semantic search, using provisioned providers. `MESA_GRAPH_ENABLED=false` skips Kùzu and GRAPH lanes. Re-enabling graph or embeddings backfills skipped lanes at startup. See [configuration](docs/core/configuration/) and [providers](docs/core/embedding-providers/). Production qualification remains NO-GO.
