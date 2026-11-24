## What Core owns

MESA Core stores durable, scoped memory with source evidence. SQLite owns canonical records and the BM25 indexes; LanceDB holds the optional vector projection. Applications use the evidence to write answers.

## Start locally

Follow the [local quickstart](docs/core/getting-started/) using the verified PyPI package `mesa-memory==0.9.5`. Run `mesa start`, then `mesa add` and `mesa search`. BM25 needs no model. OpenAI/Ollama are in the base package; Anthropic needs `[adapters]` and local ML/reranking needs `[ml]`.

## Release baseline

These guides follow tag [v0.9.5](https://github.com/Yasou13/MESA/tree/v0.9.5), commit `c725616364f3931249bd05a62676f132b65768e1`. The changelog dates this release 24 November 2026; the tag and the PyPI wheel and sdist were verified the same day. Search runs BM25 with prefix matching, adds vector search when an embedding model is set, applies the built-in Turkish legal rules by default and can rerank optionally. The assertion fusion weight is 0.0. Versioned documents carry `metadata.valid_from`/`valid_to` and can be searched at a point in time with `valid_at`. The graph store was removed in 0.9.5; see [graph store removed](docs/core/graph/). Models remain off by default. Alpha / production NO-GO remains. See [release notes and limits](docs/core/release-notes/).
