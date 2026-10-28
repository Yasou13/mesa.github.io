## Local defaults and operator configuration

`mesa start` provisions `~/.mesa/data`, a local catalog and `~/.mesa/credentials.json`; models and external providers default off. Direct runtime launchers still require explicit `MESA_STORAGE_ROOT`, `MESA_RUNTIME_PROFILE=combined`, keys and ACLs. `Mesa()` reads explicit arguments, environment connection settings, then local credentials.

## Optional models, graph and validation

Use `MESA_LLM_MODEL=provider:model` and `MESA_EMBEDDING_MODEL=provider:model`. For example:

```bash
MESA_MODEL_ENABLED=true
MESA_LLM_MODEL=ollama:qwen2.5:7b
MESA_EMBEDDING_MODEL=ollama:bge-m3
```

Put local settings in `~/.mesa/.env` and restart the local server. The selected provider must be installed and running. `MESA_EMBEDDING_ENABLED` and `MESA_EXTRACTION_ENABLED` default to the model flag. Both off still allows ingestion and BM25 search; disabled VECTOR lanes are SKIPPED. `MESA_GRAPH_ENABLED=false` avoids opening Kùzu, marks GRAPH lanes SKIPPED and reports graph as degraded. Re-enabling a lane backfills it on combined startup.

`MESA_TIER3_MODE`: 0 deterministic checks, 1 one validator, 2 distinct A/B validators. `MESA_RRF_K=60` and lane weights defaulting to 1.0 control fusion. Durable rebuild remains disabled by default.

## Provider and storage boundaries

Local Ollama/OpenAI-compatible endpoints can run with `MESA_EXTERNAL_PROVIDER_ENABLED=false`; cloud providers require it to be true and need their keys. Embedding identity includes model, revision, dimension and normalization. Active vectors require an explicit rebuild before an identity change. See the full pinned setting table below; configuration is separate from operational availability.
