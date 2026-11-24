## Local defaults and operator configuration

`mesa start` provisions `~/.mesa/data`, a local catalog and `~/.mesa/credentials.json`; models and external providers default off. Direct runtime launchers still require explicit `MESA_STORAGE_ROOT`, `MESA_RUNTIME_PROFILE=combined`, keys and ACLs. `Mesa()` reads explicit arguments, environment connection settings, then local credentials.

## Optional models and validation

Use `MESA_LLM_MODEL=provider:model` and `MESA_EMBEDDING_MODEL=provider:model`. For example:

```bash
MESA_MODEL_ENABLED=true
MESA_LLM_MODEL=ollama:qwen2.5:7b
MESA_EMBEDDING_MODEL=ollama:bge-m3
```

Put local settings in `~/.mesa/.env` and restart the local server. The selected provider must be installed and running. `MESA_EMBEDDING_ENABLED` defaults to the model flag. `MESA_EXTRACTION_ENABLED=false` is the default even when models are enabled; set it explicitly to `true` for open-ended SPO extraction. Both off still allows ingestion and BM25 search; disabled VECTOR lanes are SKIPPED and reported as degraded. Enabling embeddings later backfills skipped vectors on combined startup.

Validation uses deterministic mode 0. Settings for removed features are ignored, and the server logs one warning per retired key at startup; in 0.9.5 this includes `MESA_RRF_GRAPH_WEIGHT` and `MESA_V4_GRAPH_TIMEOUT_SECONDS` together with the old graph switch (see [graph store removed](docs/core/graph/)). `MESA_RRF_K=60`, vector weight 8.0, BM25 weight 1.0 and `MESA_RRF_ASSERTION_WEIGHT=0.0` control fusion; zero removes a lane’s contribution. Durable rebuild remains disabled by default.

## Provider and storage boundaries

Local Ollama/OpenAI-compatible endpoints can run with `MESA_EXTERNAL_PROVIDER_ENABLED=false`; cloud providers require it to be true and need their keys. Embedding identity includes model, revision, dimension and normalization. Active vectors require an explicit rebuild before an identity change. See the full pinned setting table below; configuration is separate from operational availability.

## Article-aware chunking and retries

`MESA_CHUNKING=auto|plain` defaults to `auto`. At least three Turkish article headings at line starts trigger article-boundary splitting; long pieces remain bounded to 512 tokens and preserve exact source text. `plain` keeps the previous plan for new revisions. Existing ACTIVE revisions do not change. A retry preserves the plan matching the admitted text, even after restart or a setting change. If the admitted prefix matches two different plans, admission fails closed with HTTP 409 without appending chunks.

## Optional BGE reranking

`MESA_RERANK_ENABLED=false` is the default. Enabling it needs the `[ml]` extra. `MESA_RERANK_MODEL=BAAI/bge-reranker-v2-m3` and `MESA_RERANK_DEPTH=50` (range 1–50) configure the stage. The model loads lazily on first use, adding cold-start latency. After fusion, authorized full chunk texts are scored in a worker thread outside the shared search connection. Results add `rerank_score`; `rrf_score` and `final_score` retain their fusion values. Ties keep fused order. See [DEV evidence and device latency](docs/core/release-notes/#guide-round-14-dev-evidence).

## Turkish legal rules and explicit SPO extraction

`MESA_LEGAL_RULES_ENABLED=true` is independent of models. In auto plans, ordinary articles inherit a law number from `metadata.law_number` or a supported header in the first 3,000 characters; continuation chunks keep the article identity. Preambles, GEÇİCİ/EK articles and plain plans receive no automatic identity. Typed identities accept 3–5 digit law numbers; inconsistent number/code pairs and unknown names are rejected.

New chunks keep versioned legal items separately from SPO facts. `false` prevents new identities/items, bypasses legal citation/ranking/exact-match, and hides existing legal overlays in result copies without deleting stored data. Generic lexical and vector retrieval remain enabled. Set `MESA_EXTRACTION_ENABLED=true` explicitly if model-based SPO facts are wanted; merely enabling models no longer enables extraction.

## Embedding identity and startup

The default is `MESA_EMBEDDING_MODEL=local:BAAI/bge-m3`, `MESA_EMBEDDING_DIMENSION=1024`, normalized. Models remain off by default. Download the local model before enabling it. For an older store created with the previous default, keep **both** settings below, or rebuild before changing identity:

```bash
MESA_EMBEDDING_MODEL=local:magibu/embeddingmagibu-200m
MESA_EMBEDDING_DIMENSION=768
```

Bootstrap `MESA_API_KEY` values containing `.` are rejected at startup.
