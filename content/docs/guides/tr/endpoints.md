## Genel bakış

Core v0.9.0 (commit 7062faf) ile yayımlanan OpenAPI belgesinden üretildi. Örnek gövdeler isteğin biçimini göstermek için şemadan oluşturulur; kaydedilmiş sunucu yanıtları değildir. Alan açıklamaları kaynakta İngilizcedir.

`/health/init` dışındaki her uç nokta `X-API-Key` başlığı ister. V4 çağrısının erişebileceği veri, o anahtara verilen rollerle sınırlıdır; bkz. [Güvenlik ve kapsam](docs/core/security/).

[OpenAPI JSON dosyasını indirin](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/reference/openapi.json)

## V4 · hafıza, katalog ve oturumlar

### POST /v4/catalog/workspaces

**Create Workspace** · `X-API-Key` gerekir.

**İstek gövdesi** · `V4WorkspaceRequest`

```json
{
  "tenant_id": "docs-tenant",
  "workspace_id": "docs-workspace"
}
```

| Alan | Tür | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `tenant_id` | string | evet |  |
| `workspace_id` | string | evet |  |
| `tenant_name` | string \| null | hayır |  |
| `workspace_name` | string \| null | hayır |  |

**Yanıtlar**

- `201` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /v4/catalog/workspaces

**List Workspaces** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `tenant_id` | query | string | evet |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /v4/catalog/datasets

**Create Dataset** · `X-API-Key` gerekir.

**İstek gövdesi** · `V4DatasetRequest`

```json
{
  "tenant_id": "docs-tenant",
  "workspace_id": "docs-workspace",
  "dataset_id": "docs-dataset"
}
```

| Alan | Tür | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `tenant_id` | string | evet |  |
| `workspace_id` | string | evet |  |
| `dataset_id` | string | evet |  |
| `tenant_name` | string \| null | hayır |  |
| `workspace_name` | string \| null | hayır |  |
| `dataset_name` | string \| null | hayır |  |

**Yanıtlar**

- `201` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /v4/catalog/datasets

**List Datasets** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `tenant_id` | query | string | evet |
| `workspace_id` | query | string | evet |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /v4/catalog/documents

**Create Document** · `X-API-Key` gerekir.

**İstek gövdesi** · `V4DocumentRequest`

```json
{
  "tenant_id": "docs-tenant",
  "workspace_id": "docs-workspace",
  "dataset_id": "docs-dataset",
  "document_id": "archive-hours",
  "title": "Archive opening hours"
}
```

| Alan | Tür | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `tenant_id` | string | evet |  |
| `workspace_id` | string | evet |  |
| `dataset_id` | string | evet |  |
| `document_id` | string | evet |  |
| `title` | string | evet |  |
| `external_ref` | string \| null | hayır |  |

**Yanıtlar**

- `201` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /v4/catalog/documents

**List Documents** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `tenant_id` | query | string | evet |
| `workspace_id` | query | string | evet |
| `dataset_id` | query | string | evet |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /v4/catalog/revisions

**Create Revision** · `X-API-Key` gerekir.

**İstek gövdesi** · `V4RevisionRequest`

```json
{
  "tenant_id": "docs-tenant",
  "workspace_id": "docs-workspace",
  "dataset_id": "docs-dataset",
  "document_id": "archive-hours",
  "revision_id": "revision-1",
  "revision_number": 1,
  "content_sha256": "string"
}
```

| Alan | Tür | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `tenant_id` | string | evet |  |
| `workspace_id` | string | evet |  |
| `dataset_id` | string | evet |  |
| `document_id` | string | evet |  |
| `revision_id` | string | evet |  |
| `revision_number` | integer | evet |  |
| `content_sha256` | string | evet |  |
| `supersedes_revision_id` | string \| null | hayır |  |

**Yanıtlar**

- `201` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /v4/catalog/revisions

**List Revisions** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `tenant_id` | query | string | evet |
| `workspace_id` | query | string | evet |
| `dataset_id` | query | string | evet |
| `document_id` | query | string | evet |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /v4/catalog/source-chunks

**Create Source Chunk** · `X-API-Key` gerekir.

**İstek gövdesi** · `V4SourceChunkRequest`

```json
{
  "tenant_id": "docs-tenant",
  "workspace_id": "docs-workspace",
  "dataset_id": "docs-dataset",
  "document_id": "archive-hours",
  "revision_id": "revision-1",
  "chunk_id": "chunk-1",
  "title": "Archive opening hours",
  "content": "The archive opens at nine on weekdays.",
  "source_ref": "demo://archive-hours"
}
```

| Alan | Tür | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `tenant_id` | string | evet |  |
| `workspace_id` | string | evet |  |
| `dataset_id` | string | evet |  |
| `document_id` | string | evet |  |
| `revision_id` | string | evet |  |
| `chunk_id` | string | evet |  |
| `title` | string | evet |  |
| `content` | string | evet |  |
| `source_ref` | string | evet |  |
| `revision_number` | integer | hayır |  |
| `chunk_ordinal` | integer | hayır |  |
| `finalize_revision` | boolean | hayır |  |
| `external_ref` | string \| null | hayır |  |
| `supersedes_revision_id` | string \| null | hayır |  |

**Yanıtlar**

- `201` Successful Response
- `422` Validation Error · `HTTPValidationError`

### DELETE /v4/catalog/documents/{document_id}

**Purge Document** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `document_id` | path | string | evet |
| `tenant_id` | query | string | evet |
| `workspace_id` | query | string | evet |
| `dataset_id` | query | string | evet |

**Yanıtlar**

- `202` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /v4/sessions/start

**Start Session** · `X-API-Key` gerekir.

**İstek gövdesi** · `V4SessionStartRequest`

```json
{
  "tenant_id": "docs-tenant",
  "workspace_id": "docs-workspace",
  "dataset_ids": [
    "string"
  ],
  "agent_id": "docs-agent"
}
```

| Alan | Tür | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `tenant_id` | string | evet |  |
| `workspace_id` | string | evet |  |
| `dataset_ids` | array<string> | evet |  |
| `agent_id` | string | evet |  |

**Yanıtlar**

- `201` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /v4/capability

**Get Capability** · `X-API-Key` gerekir.

**Yanıtlar**

- `200` Successful Response · `V4CapabilityResponse`

*Örnek*

```json
{
  "api_version": "v4",
  "features": [
    "string"
  ],
  "capabilities": {
    "canonical_ledger": true,
    "projection_outbox": true,
    "idempotent_ingestion": true,
    "vector_retrieval": true,
    "lexical_retrieval": true,
    "assertion_relational_lane": true
  },
  "validation": {
    "mode": 0,
    "policy": "deterministic_only",
    "llm_validation_enabled": false,
    "validator_count": 0
  },
  "limits": {
    "rebuild_kind": "projection",
    "rebuild_scope": "storage_root",
    "requires_offline_runner": true
  }
}
```

### POST /v4/operations/rebuild

**Create Rebuild Operation** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `Idempotency-Key` | header | string | evet |

**Yanıtlar**

- `202` Successful Response · `V4OperationResponse`
- `422` Validation Error · `HTTPValidationError`

*Örnek*

```json
{
  "operation_id": "<operation_id>",
  "operation_kind": "projection_rebuild",
  "scope": "storage_root",
  "state": "string",
  "attempt": 0,
  "progress": {
    "completed": 0,
    "total": 0
  }
}
```

### GET /v4/operations/{operation_id}

**Get Rebuild Operation** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `operation_id` | path | string | evet |

**Yanıtlar**

- `200` Successful Response · `V4OperationResponse`
- `422` Validation Error · `HTTPValidationError`

*Örnek*

```json
{
  "operation_id": "<operation_id>",
  "operation_kind": "projection_rebuild",
  "scope": "storage_root",
  "state": "string",
  "attempt": 0,
  "progress": {
    "completed": 0,
    "total": 0
  }
}
```

### POST /v4/operations/{operation_id}/cancel

**Cancel Rebuild Operation** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `operation_id` | path | string | evet |

**Yanıtlar**

- `200` Successful Response · `V4OperationResponse`
- `422` Validation Error · `HTTPValidationError`

*Örnek*

```json
{
  "operation_id": "<operation_id>",
  "operation_kind": "projection_rebuild",
  "scope": "storage_root",
  "state": "string",
  "attempt": 0,
  "progress": {
    "completed": 0,
    "total": 0
  }
}
```

### POST /v4/operations/{operation_id}/retry

**Retry Rebuild Operation** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `operation_id` | path | string | evet |

**Yanıtlar**

- `202` Successful Response · `V4OperationResponse`
- `422` Validation Error · `HTTPValidationError`

*Örnek*

```json
{
  "operation_id": "<operation_id>",
  "operation_kind": "projection_rebuild",
  "scope": "storage_root",
  "state": "string",
  "attempt": 0,
  "progress": {
    "completed": 0,
    "total": 0
  }
}
```

### POST /v4/rebuild

**Rebuild Index** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `tenant_id` | query | string \| null | hayır |
| `workspace_id` | query | string \| null | hayır |
| `dataset_id` | query | string \| null | hayır |
| `Idempotency-Key` | header | string | evet |

**Yanıtlar**

- `202` Successful Response · `V4OperationResponse`
- `422` Validation Error · `HTTPValidationError`

*Örnek*

```json
{
  "operation_id": "<operation_id>",
  "operation_kind": "projection_rebuild",
  "scope": "storage_root",
  "state": "string",
  "attempt": 0,
  "progress": {
    "completed": 0,
    "total": 0
  }
}
```

### POST /v4/memory/insert

**Insert Memory** · `X-API-Key` gerekir.

**İstek gövdesi** · `V4MemoryInsertRequest`

```json
{
  "session_id": "<session_id>",
  "dataset_id": "docs-dataset",
  "document_id": "archive-hours",
  "revision_id": "revision-1",
  "chunk_id": "chunk-1",
  "title": "Archive opening hours",
  "source_ref": "demo://archive-hours",
  "content": "The archive opens at nine on weekdays."
}
```

| Alan | Tür | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `session_id` | string | evet |  |
| `dataset_id` | string | evet |  |
| `document_id` | string | evet |  |
| `revision_id` | string | evet |  |
| `chunk_id` | string | evet |  |
| `title` | string | evet |  |
| `source_ref` | string | evet |  |
| `content` | string | evet |  |
| `evidence_span` | string | hayır |  |
| `revision_number` | integer | hayır |  |
| `chunk_ordinal` | integer | hayır |  |
| `finalize_revision` | boolean | hayır |  |
| `supersedes_revision_id` | string \| null | hayır |  |
| `metadata` | object | hayır |  |
| `legal_identity` | V4LegalIdentityRequest \| null | hayır |  |
| `idempotency_key` | string \| null | hayır |  |

**Yanıtlar**

- `202` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /v4/documents

**Ingest Document** · `X-API-Key` gerekir.

**İstek gövdesi** · `V4DocumentIngestRequest`

```json
{
  "session_id": "<session_id>",
  "dataset_id": "docs-dataset",
  "document_id": "archive-hours",
  "title": "Archive opening hours",
  "source_ref": "demo://archive-hours",
  "content": "The archive opens at nine on weekdays."
}
```

| Alan | Tür | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `session_id` | string | evet |  |
| `dataset_id` | string | evet |  |
| `document_id` | string | evet |  |
| `title` | string | evet |  |
| `source_ref` | string | evet |  |
| `content` | string | evet |  |
| `metadata` | object | hayır |  |

**Yanıtlar**

- `202` Successful Response · `V4DocumentIngestResponse`
- `422` Validation Error · `HTTPValidationError`

*Örnek*

```json
{
  "document_id": "archive-hours",
  "revision_id": "revision-1",
  "revision_number": 1,
  "chunk_count": 1,
  "mutation_ids": [
    "string"
  ],
  "duplicate": true
}
```

### POST /v4/memory/search

**Search Memory** · `X-API-Key` gerekir.

**İstek gövdesi** · `V4SearchRequest`

```json
{
  "session_id": "<session_id>",
  "query": "When does the archive open?"
}
```

| Alan | Tür | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `session_id` | string | evet |  |
| `dataset_ids` | array<string> \| null | hayır |  |
| `query` | string | evet |  |
| `limit` | integer | hayır |  |
| `jurisdiction` | string \| null | hayır |  |
| `valid_at` | string \| null | hayır |  |
| `valid_from` | string \| null | hayır |  |
| `valid_to` | string \| null | hayır |  |
| `graph_mode` | enabled · disabled | hayır | Enable or disable only the graph retrieval lane for matched ablation. |

**Yanıtlar**

- `200` Successful Response · `V4SearchResponse`
- `422` Validation Error · `HTTPValidationError`

*Örnek*

```json
{
  "session_id": "<session_id>",
  "dataset_ids": [
    "string"
  ],
  "results": [
    {}
  ],
  "degraded_sources": [],
  "scope_audit": {
    "contract_version": "string",
    "enforcement_stage": "string",
    "requested_scope": {},
    "requested_scope_identity": "string",
    "query_identity": "string",
    "evaluated_candidate_count": 0
  },
  "graph_ablation": {
    "contract_version": "string",
    "mode": "enabled",
    "pair_identity": "string",
    "query_identity": "string",
    "retrieval_config_identity": "string",
    "scope_identity": "string"
  }
}
```

### GET /v4/mutations/{mutation_id}

**Mutation Status** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `mutation_id` | path | string | evet |

**Yanıtlar**

- `200` Successful Response · `V4MutationStatusResponse`
- `422` Validation Error · `HTTPValidationError`

*Örnek*

```json
{
  "mutation_id": "<mutation_id>",
  "candidate_id": "string",
  "state": "string",
  "failure_class": "string",
  "rejection_reason": "string",
  "tier3_audit": {}
}
```

### POST /v4/mutations/{mutation_id}/rollback

**Rollback Mutation** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `mutation_id` | path | string | evet |

**Yanıtlar**

- `202` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /v4/mutations/{mutation_id}/replay

**Replay Mutation** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `mutation_id` | path | string | evet |

**Yanıtlar**

- `202` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /v4/sessions/{session_id}/context

**Get Context** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `session_id` | path | string | evet |
| `query` | query | string | hayır |
| `token_budget` | query | integer | hayır |
| `jurisdiction` | query | string \| null | hayır |
| `valid_at` | query | string \| null | hayır |
| `valid_from` | query | string \| null | hayır |
| `valid_to` | query | string \| null | hayır |
| `retrieval_mode` | query | single · adaptive | hayır |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /v4/sessions/{session_id}/end

**End Session** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `session_id` | path | string | evet |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

## Sağlık ve metrikler

### GET /health/init

**Health Init** · API anahtarı gerekmez.

**Yanıtlar**

- `200` Successful Response

### GET /health

**Health** · `X-API-Key` gerekir.

**Yanıtlar**

- `200` Successful Response

### GET /metrics

**Metrics** · `X-API-Key` gerekir.

**Yanıtlar**

- `200` Successful Response

## MCP kontrol düzlemi

### GET /control/mcp/clients

**List Clients** · `X-API-Key` gerekir.

**Yanıtlar**

- `200` Successful Response

### POST /control/mcp/clients

**Create Client** · `X-API-Key` gerekir.

**İstek gövdesi** · `ClientCreateReq`

```json
{
  "client_id": "string",
  "display_name": "string",
  "client_type": "string",
  "principal_id": "string"
}
```

| Alan | Tür | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `client_id` | string | evet |  |
| `display_name` | string | evet |  |
| `client_type` | string | evet |  |
| `principal_id` | string | evet |  |
| `metadata` | object | hayır |  |

**Yanıtlar**

- `201` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/clients/{client_id}

**Get Client** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `client_id` | path | string | evet |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/connections

**List Connections** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `client_id` | query | string \| null | hayır |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/settings

**Get Settings** · `X-API-Key` gerekir.

**Yanıtlar**

- `200` Successful Response

### POST /control/mcp/settings

**Update Setting** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `key` | query | string | evet |
| `value` | query | object | evet |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /control/mcp/policies

**Create Policy** · `X-API-Key` gerekir.

**İstek gövdesi** · `PolicyCreateReq`

```json
{
  "rule_id": "string",
  "scope_type": "string",
  "operation": "string",
  "effect": "string",
  "created_by": "string"
}
```

| Alan | Tür | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `rule_id` | string | evet |  |
| `scope_type` | string | evet |  |
| `operation` | string | evet |  |
| `effect` | string | evet |  |
| `created_by` | string | evet |  |
| `scope_id` | string \| null | hayır |  |
| `priority` | integer | hayır |  |
| `conditions` | object | hayır |  |

**Yanıtlar**

- `201` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/policies

**List Policies** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `operation` | query | string \| null | hayır |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### PUT /control/mcp/clients/{client_id}/enabled

**Toggle Client Enabled** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `client_id` | path | string | evet |
| `enabled` | query | boolean | evet |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/clients/{client_id}/bindings

**List Bindings** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `client_id` | path | string | evet |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/managed-clients

**List Managed Clients** · `X-API-Key` gerekir.

**Yanıtlar**

- `200` Successful Response

### POST /control/mcp/credentials/{credential_id}/revoke

**Revoke Managed Credential** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `credential_id` | path | string | evet |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/activity

**List Activity** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `limit` | query | integer | hayır |
| `offset` | query | integer | hayır |
| `client_id` | query | string \| null | hayır |
| `status` | query | string \| null | hayır |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/activity/{call_id}

**Get Activity Call** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `call_id` | path | string | evet |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/approvals

**List Approvals** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `status` | query | string \| null | hayır |
| `limit` | query | integer | hayır |
| `offset` | query | integer | hayır |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/approvals/pending

**List Pending Approvals Endpoint** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `client_id` | query | string \| null | hayır |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /control/mcp/approvals/{approval_id}/decide

**Decide Approval Endpoint** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `approval_id` | path | string | evet |

**İstek gövdesi** · `DecideApprovalReq`

```json
{
  "status": "string"
}
```

| Alan | Tür | Zorunlu | Açıklama |
| --- | --- | --- | --- |
| `status` | string | evet |  |
| `reason` | string \| null | hayır |  |

**Yanıtlar**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/overview

**Get Overview** · `X-API-Key` gerekir.

**Yanıtlar**

- `200` Successful Response
