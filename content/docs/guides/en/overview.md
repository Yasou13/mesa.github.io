## What Core owns

MESA Core stores durable, scoped memory with source evidence. SQLite owns canonical records; LanceDB and Kùzu provide derived search projections. Applications use the evidence to write answers.

## Start locally

Follow the [local quickstart](docs/core/getting-started/) using the verified PyPI package `mesa-memory==0.9.1`. Run `mesa start`, then `mesa add` and `mesa search`. BM25 needs no model. OpenAI/Ollama are in the base package; Anthropic needs `[adapters]` and local ML/reranking needs `[ml]`.

## Release baseline

These guides follow [v0.9.1](https://github.com/Yasou13/MESA/releases/tag/v0.9.1), published on 1 November 2026 at `e2f984d4ad97c01782a347e29e44808e5a16dad3`. Round 13 improves scoped search work and CLI activation waiting; Round 14 adds article-aware chunking, optional BGE reranking, vector weight 8.0 and source-based deletion. Existing V4 routes and request shapes remain compatible. Alpha / production NO-GO remains. See [release notes and DEV evidence](docs/core/release-notes/).
