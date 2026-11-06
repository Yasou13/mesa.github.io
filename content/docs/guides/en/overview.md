## What Core owns

MESA Core stores durable, scoped memory with source evidence. SQLite owns canonical records; LanceDB and Kùzu provide derived search projections. Applications use the evidence to write answers.

## Start locally

Follow the [local quickstart](docs/core/getting-started/) using the verified PyPI package `mesa-memory==0.9.2`. Run `mesa start`, then `mesa add` and `mesa search`. BM25 needs no model. OpenAI/Ollama are in the base package; Anthropic needs `[adapters]` and local ML/reranking needs `[ml]`.

## Release baseline

These guides follow [v0.9.2](https://github.com/Yasou13/MESA/releases/tag/v0.9.2), published on 6 November 2026 at `8cd2cfe1df5356e73b3bef83ae640850fd54c798`. Round 16–17 adds bounded Turkish legal rules, scope-learned law names, exact-match-first retrieval and more responsive request processing. Open-ended SPO extraction now defaults off independently of models. V4 HTTP routes remain compatible. Alpha / production NO-GO remains. See [release notes and limits](docs/core/release-notes/).
