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

Extraction and embeddings are configured separately: choosing `claude` or `ollama` for extraction does not set up embeddings. `auto` can fall back to `mock`, so name a provider explicitly. Changing provider, model, dimension or normalization starts a new embedding space and needs a reindex or a new storage root.

## Representation must stay compatible

Assertion vectors and query embeddings must share provider/model identity and dimension. The documented local default is Magibu with 768 dimensions; external text-embedding-3-small requires 1536. A settings edit is not an in-place representation migration. Rebuild/reindex under the documented identity rules.

## Configured is not operational

`GET /v4/capability` distinguishes runtime availability. A custom embedding provider remains non-operational until a successful embedding call. Expected vector/provider failure returns explicit 503; the runtime does not silently switch models. Canonical V4 writes need a model-enabled combined consumer and extraction dependencies.

## Bound provider access deliberately

`MESA_EXTERNAL_PROVIDER_ENABLED=false` fences canonical external calls. It is not a complete air-gap or zero-cost guarantee. Model downloads, local provisioning and other process networking are separate concerns. No current real-provider speed, quality or token-cost benchmark is claimed here.
