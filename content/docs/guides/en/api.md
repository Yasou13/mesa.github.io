## Authenticate and bind scope

For every endpoint with request bodies, fields and response codes, see the [HTTP endpoint reference](docs/core/endpoints/).

Versioned memory, health and metrics requests require `X-API-Key`. Public `/health/init`, OpenAPI, Swagger and ReDoc need deployment network policy. Create catalog resources with an authorized principal before starting a dataset-bound session. [The SDK example](docs/core/examples/) checks terminal state explicitly.

## The implemented endpoint families

| Method | Path | Purpose |
|---|---|---|
| GET | `/v4/capability` | Operational features and rebuild limits |
| POST / GET | `/v4/catalog/workspaces` | Workspace catalog |
| POST / GET | `/v4/catalog/datasets` | Dataset catalog |
| POST / GET | `/v4/catalog/documents` | Document catalog |
| POST / GET | `/v4/catalog/revisions` | Immutable revisions |
| POST | `/v4/catalog/source-chunks` | Exact source chunks |
| POST | `/v4/sessions/start` | Freeze authorized dataset scope |
| POST | `/v4/memory/insert` | Admit a durable chunk mutation (202) |
| POST | `/v4/documents` | Ingest a whole document with lossless chunking, duplicate detection and revision tracking (202) |
| POST | `/v4/memory/search` | Scoped hybrid retrieval |
| GET | `/v4/mutations/{mutation_id}` | Observe processing state |
| POST | `/v4/mutations/{mutation_id}/replay` | Authorized retry |
| POST | `/v4/mutations/{mutation_id}/rollback` | Source-owned rollback |
| GET | `/v4/sessions/{session_id}/context` | Bounded evidence context |
| POST | `/v4/sessions/{session_id}/end` | Durable session finalization |

## Response and error contracts

202 means admission. A successful write must reach `COMMITTED`. Search exposes `rrf_score`, `legal_factor`, `raw_score`, `final_score` and contributing origins. Model-disabled combined operation accepts documents and supports BM25 search; disabled VECTOR lanes are SKIPPED. `503 canonical_processing_unavailable` means the combined consumer is unavailable. Search reports missing lanes in `degraded_sources`; expected provider failures are explicit 503 responses. Administrative rebuild is separate and disabled by default. The pinned appendix contains request schemas, remaining administrative endpoints and authorization details.

## Whole-document ingestion

`POST /v4/documents` accepts `session_id`, `dataset_id`, `document_id`, `title`, `source_ref`, `content` and optional `metadata`. The response includes `revision_id`, `revision_number`, `chunk_count`, `mutation_ids` and `duplicate`. Poll every mutation for COMMITTED. Identical ACTIVE content reuses its IDs; changed content creates a revision. Text is limited to 5,000,000 UTF-8 bytes; blank text returns 422 and purged document IDs cannot be reused. `Mesa().add()` uses this endpoint.
