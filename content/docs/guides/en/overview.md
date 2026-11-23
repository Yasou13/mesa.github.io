## What Core owns

MESA Core stores durable, scoped memory with source evidence. SQLite owns canonical records; LanceDB and Kùzu provide derived search projections. Applications use the evidence to write answers.

## Start locally

Follow the [local quickstart](docs/core/getting-started/) using the verified PyPI package `mesa-memory==0.9.4`. Run `mesa start`, then `mesa add` and `mesa search`. BM25 needs no model. OpenAI/Ollama are in the base package; Anthropic needs `[adapters]` and local ML/reranking needs `[ml]`.

## Release baseline

These guides follow tag [v0.9.4](https://github.com/Yasou13/MESA/tree/v0.9.4), commit `e30856ec6e7ed9146bb9af992565e864f727b0b9`. The changelog dates this release 23 November 2026; the tag, GitHub release and PyPI files were verified the same day. Search now keeps BM25 and vector lanes on the default path: the graph is off and the assertion fusion weight is 0.0 unless you enable them. V3 storage, LLM consolidation and Tier 3 modes 1/2 are removed. The default embedding identity is BGE-M3, 1024 dimensions; models remain off by default. Alpha / production NO-GO remains. See [release notes and limits](docs/core/release-notes/).
