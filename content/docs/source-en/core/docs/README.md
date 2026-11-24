# MESA documentation

This folder holds 12 usage/development guides and 8 architecture decision records.
You do not need to read them in order. Pick the entry point below that matches your goal.
Package version 0.9.5; V4 is the current API.

## Where should I start?

| Your goal | Document to read |
|---|---|
| Install MESA and run the first example | [Installation and first run](docs/core/getting-started/) |
| Set model, provider, port or capacity | [Configuration](docs/core/configuration/) |
| Use it over HTTP, the Python SDK or terminal commands | [API, SDK and CLI](docs/core/api-reference/) |
| Connect Codex/Antigravity | [MCP guide](docs/core/mcp/) |
| Understand tenant, dataset, revision and mutation | [Concepts and ingestion](docs/core/concepts-and-ingestion/) |
| Understand how the system works and its boundaries | [One-page architecture summary](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/ARCHITECTURE.md), [detailed module guide](docs/core/architecture/#module-ownership) |
| Understand search scores and source evidence | [Retrieval and evidence](docs/core/retrieval-and-graph/#lanes-and-scoring) |
| Handle permissions, backups, failures or upgrades | [Operations guide](docs/core/operations/) |
| Regenerate the vector store from existing V4 data | [Projection rebuild](docs/core/rebuild-runbook/) |
| Learn the access and data security boundaries | [Security](docs/core/security/) |
| Run the tests and read CI results | [Testing and CI](docs/core/testing/) |
| Publish a new release | [Release procedure](docs/core/release-policy/) |

## Where did merged topics go?

- Docker and runtime profiles: [installation](docs/core/getting-started/#installation).
- Terminal commands: [CLI](docs/core/api-reference/#cli-commands).
- MCP management endpoints and approval IDs: [control API](docs/core/api-reference/#mcp-control-api).
- Error table: [troubleshooting](docs/core/operations/#troubleshooting).
- Upgrading older V4 data: [v0.8.0 upgrade](docs/core/operations/#upgrade-v080).
- Responsibilities of the other MESA projects: [ecosystem](docs/core/architecture/#ecosystem).
- Capacity and unsupported features: [limits](docs/core/architecture/#limitations).
- Scope of the GitHub checks: [CI](docs/core/testing/#ci-assurance).
- v0.8.1 release status and exceptions: [CHANGELOG](docs/core/release-notes/#v081-publication).

## Design decisions and technical files

The [ADR index](docs/core/decisions/) explains why the design was chosen. Seven current
decisions have their own files; the index holds a short history of retired decisions.
Historical decisions are not a current feature or performance guarantee.

The [OpenAPI snapshot](https://github.com/Yasou13/MESA/blob/531209bc45805b478264f6dfa8a9e40a94e345cb/docs/reference/openapi.json) is a generated API schema; the running
application's `/openapi.json` output and the route/schema code are the current authority.
The [Prometheus rules](https://github.com/Yasou13/MESA/blob/531209bc45805b478264f6dfa8a9e40a94e345cb/docs/prometheus_alerts.yml) are alert rules loaded into the monitoring
system; they are not a Markdown guide.

## Keeping the docs current

Update the main document above for each topic; do not open new
“final/latest/current” files about the same topic. State the API version, the package
version and the release that each measured result belongs to.
Production readiness is judged by the [release gates](docs/core/release-policy/); unit test
success or a version number is not a production GO.

When moving content, update links and the documentation tests together; then run the
[documentation check in the testing guide](docs/core/testing/). Older full texts are in
Git history. `for_mvp/` is a working plan and outside this arrangement.
