## v0.9.0 · 28 October 2026

GitHub release and PyPI package `mesa-memory` 0.9.0 are published. The release tag resolves to `7062fafe2cff8442eb84d1da60df164099526c8e`. Python >=3.11 is required. Production qualification remains NO-GO.

## What changed

- Local CLI: `start`, `add`, `search`, `delete`, `status` and `mcp-config`; automatic local storage and private credentials.
- High-level `Mesa()` SDK: local defaults, whole-document ingestion and evidence context without manual session setup.
- `POST /v4/documents`: lossless deterministic chunking, duplicate detection and revision tracking. Models-disabled operation stores documents and supports BM25 retrieval.
- `MESA_GRAPH_ENABLED=false`: run without opening Kùzu; GRAPH lanes are SKIPPED and can be backfilled when re-enabled.
- Unified model settings: `MESA_LLM_MODEL` and `MESA_EMBEDDING_MODEL` use `provider:model` syntax. Local Docker runs `mesa start` and retains credentials in its volume.
- Document purge erases source/extracted text while retaining audit identifiers and hashes; shared text remains while another document still owns it.
- Retry backoff, dead-letter replay, SDK startup 503 retries, missing-extra messages and Turkish citation-aware chunking are improved.

## Read the maintained sources

Start with [local quickstart](docs/core/getting-started/), [CLI](docs/core/cli-reference/), [HTTP endpoints](docs/core/endpoints/) and [configuration](docs/core/configuration/). The original changelog below keeps earlier releases in their historical context. A package release supplies no new production certificate or benchmark by itself.
