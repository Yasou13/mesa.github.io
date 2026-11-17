## What Core owns

MESA Core stores durable, scoped memory with source evidence. SQLite owns canonical records; LanceDB and Kùzu provide derived search projections. Applications use the evidence to write answers.

## Start locally

Follow the [local quickstart](docs/core/getting-started/) using the verified PyPI package `mesa-memory==0.9.3`. Run `mesa start`, then `mesa add` and `mesa search`. BM25 needs no model. OpenAI/Ollama are in the base package; Anthropic needs `[adapters]` and local ML/reranking needs `[ml]`.

## Release baseline

These guides follow tag [v0.9.3](https://github.com/Yasou13/MESA/tree/v0.9.3), commit `531209bc45805b478264f6dfa8a9e40a94e345cb`. The changelog dates this release 16 November 2026; tag and PyPI publication were verified on 17 November. Bulk ingestion and legal parsing are faster in the reported local measurements. The default embedding identity is BGE-M3, 1024 dimensions; models remain off by default. Alpha / production NO-GO remains. See [release notes and limits](docs/core/release-notes/).
