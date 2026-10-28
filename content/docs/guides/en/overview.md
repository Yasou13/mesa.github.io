## Memory that keeps its sources

MESA Core stores exact document text with document, revision and passage identities. It retrieves authorized evidence and bounded context over HTTP, Python SDK and MCP. Your application’s model writes the answer.

## Choose your first workflow

Follow the [local quickstart](docs/core/getting-started/): install `mesa-memory[adapters]==0.9.0`, run `mesa start`, then use `mesa add` and `mesa search`. No model is needed for BM25 lexical search. `Mesa()` reads local credentials automatically; `mesa mcp-config` prepares an MCP connection. Enable models for extraction and semantic search; disable Kùzu with `MESA_GRAPH_ENABLED=false` when appropriate.

## Release and qualification

These guides follow v0.9.0, published on 28 October 2026 at commit `7062faf`. The release adds whole-document ingestion, local CLI and SDK defaults, optional graph operation and improved retry/purge behavior. GitHub and PyPI publication do not establish production qualification: NO-GO remains until the required provider, recovery, soak and certification evidence is complete.
