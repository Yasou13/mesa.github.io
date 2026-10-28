## Supported providers at a glance

| Role | Provider value | Example model | Dimension | Install extra |
| --- | --- | --- | --- | --- |
| Embeddings · local (default) | sentence-transformers | Magibu, normalized | 768 | `ml` |
| Embeddings · external | `openai_compatible` | `text-embedding-3-small` | 1536 | `adapters` |
| Embeddings · Nemotron-3 profile | `openai_compatible` | Nemotron-3, `nemotron-qpass-v1` (query/passage) | 2048 | `adapters` |
| Extraction / validation LLM | `openai_compatible` | any chat model your endpoint serves, e.g. `gpt-4o-mini` | — | `adapters` |
| Extraction / validation LLM | `claude` | a Claude model | — | provider SDK extra |
| Extraction / validation LLM | `ollama` | a model already pulled on a running Ollama | — | provider SDK extra |
| Tests only | `mock` | returns no facts | — | — |

Extraction and embeddings are configured separately: choosing `claude` or `ollama` for extraction does not set up embeddings. Select `MESA_LLM_MODEL` and `MESA_EMBEDDING_MODEL` with explicit `provider:model` values. Changing provider, model, dimension or normalization starts a new embedding space and needs a reindex or a new storage root.

## Representation must stay compatible

Assertion vectors and query embeddings must share provider/model identity and dimension. The documented local default is Magibu with 768 dimensions; external text-embedding-3-small requires 1536. A settings edit is not an in-place representation migration. Rebuild/reindex under the documented identity rules.

## Configured is not operational

`GET /v4/capability` distinguishes runtime availability. A custom embedding provider remains non-operational until a successful embedding call. Expected vector/provider failure returns explicit 503; the runtime does not silently switch models. A combined consumer accepts V4 writes with models off and supports BM25. Enable extraction and embedding providers only when those capabilities are needed.

## Bound provider access deliberately

`MESA_EXTERNAL_PROVIDER_ENABLED=false` allows local Ollama/OpenAI-compatible endpoints and blocks cloud providers. Set it true and supply keys for cloud providers. It is not a complete air-gap or zero-cost guarantee. Model downloads, local provisioning and other process networking are separate concerns. No current real-provider speed, quality or token-cost benchmark is claimed here.

## v0.9.0 operation

Use `MESA_LLM_MODEL=provider:model` and `MESA_EMBEDDING_MODEL=provider:model`. BM25 ingestion/search works with models off. Local Ollama and OpenAI-compatible endpoints are allowed with the external-provider flag off; cloud providers require it on and need keys.
