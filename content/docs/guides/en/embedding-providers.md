## Representation must stay compatible

Assertion vectors and query embeddings must share provider/model identity and dimension. The documented local default is Magibu with 768 dimensions; external text-embedding-3-small requires 1536. A settings edit is not an in-place representation migration. Rebuild/reindex under the documented identity rules.

## Configured is not operational

`GET /v4/capability` distinguishes runtime availability. A custom embedding provider remains non-operational until a successful embedding call. Expected vector/provider failure returns explicit 503; the runtime does not silently switch models. Canonical V4 writes need a model-enabled combined consumer and extraction dependencies.

## Bound provider access deliberately

`MESA_EXTERNAL_PROVIDER_ENABLED=false` fences canonical external calls. It is not a complete air-gap or zero-cost guarantee. Model downloads, local provisioning and other process networking are separate concerns. No current real-provider speed, quality or token-cost benchmark is claimed here.
