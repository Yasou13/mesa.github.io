# MESA documentation

This folder holds 12 usage/development guides and 8 architecture decision records.
You do not need to read them in order. Pick the entry point below that matches your goal.
Package version 0.9.0; V4 is the current API.

## Where should I start?

| Your goal | Document to read |
|---|---|
| Install MESA and run the first example | [Installation and first run](docs/core/getting-started/) |
| Set model, provider, port or capacity | [Configuration](docs/core/configuration/) |
| Use it over HTTP, the Python SDK or terminal commands | [API, SDK and CLI](docs/core/api-reference/) |
| Connect Codex/Antigravity | [MCP guide](docs/core/mcp/) |
| Understand tenant, dataset, revision and mutation | [Concepts and ingestion](docs/core/concepts-and-ingestion/) |
| Understand the system's modules and boundaries | [Architecture](docs/core/architecture/) |
| Understand search scores, the graph and context | [Retrieval and graph](docs/core/retrieval-and-graph/) |
| Handle permissions, backups, failures or upgrades | [Operations guide](docs/core/operations/) |
| Regenerate vector/graph stores from existing V4 data | [Projection rebuild](docs/core/rebuild-runbook/) |
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

The [OpenAPI snapshot](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/reference/openapi.json) is a generated API schema; the running
application's `/openapi.json` output and the route/schema code are the current authority.
The [Prometheus rules](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/prometheus_alerts.yml) are alert rules loaded into the monitoring
system; they are not a Markdown guide.

## Keeping the docs current

Update the main document above for each topic; do not open new
“final/latest/current” files about the same topic. Keep API/package version, the V3/V4
split, implemented features and measured results apart.
Production readiness is judged by the [release gates](docs/core/release-policy/); unit test
success or a version number is not a production GO.

When moving content, update links and the documentation tests together; then run the
[documentation check in the testing guide](docs/core/testing/). Older full texts are in
Git history. `for_mvp/` is a working plan and outside this arrangement.
