## Overview

Generated from the OpenAPI document published with Core v0.8.1 (commit d394784). Example bodies are built from the schema to show the shape of a request; they are not recorded server responses.

Every endpoint except `/health/init` needs the `X-API-Key` header. What a V4 call may touch is limited by the roles granted to that key; see [Security & Scope](docs/core/security/).

[Download the OpenAPI JSON](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/reference/openapi.json)

## V4 · memory, catalog and sessions

### POST /v4/catalog/workspaces

**Create Workspace** · Requires `X-API-Key`.

**Request body** · `V4WorkspaceRequest`

```json
{
  "tenant_id": "docs-tenant",
  "workspace_id": "docs-workspace"
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `tenant_id` | string | yes |  |
| `workspace_id` | string | yes |  |
| `tenant_name` | string \| null | no |  |
| `workspace_name` | string \| null | no |  |

**Responses**

- `201` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /v4/catalog/workspaces

**List Workspaces** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `tenant_id` | query | string | yes |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /v4/catalog/datasets

**Create Dataset** · Requires `X-API-Key`.

**Request body** · `V4DatasetRequest`

```json
{
  "tenant_id": "docs-tenant",
  "workspace_id": "docs-workspace",
  "dataset_id": "docs-dataset"
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `tenant_id` | string | yes |  |
| `workspace_id` | string | yes |  |
| `dataset_id` | string | yes |  |
| `tenant_name` | string \| null | no |  |
| `workspace_name` | string \| null | no |  |
| `dataset_name` | string \| null | no |  |

**Responses**

- `201` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /v4/catalog/datasets

**List Datasets** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `tenant_id` | query | string | yes |
| `workspace_id` | query | string | yes |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /v4/catalog/documents

**Create Document** · Requires `X-API-Key`.

**Request body** · `V4DocumentRequest`

```json
{
  "tenant_id": "docs-tenant",
  "workspace_id": "docs-workspace",
  "dataset_id": "docs-dataset",
  "document_id": "archive-hours",
  "title": "Archive opening hours"
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `tenant_id` | string | yes |  |
| `workspace_id` | string | yes |  |
| `dataset_id` | string | yes |  |
| `document_id` | string | yes |  |
| `title` | string | yes |  |
| `external_ref` | string \| null | no |  |

**Responses**

- `201` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /v4/catalog/documents

**List Documents** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `tenant_id` | query | string | yes |
| `workspace_id` | query | string | yes |
| `dataset_id` | query | string | yes |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /v4/catalog/revisions

**Create Revision** · Requires `X-API-Key`.

**Request body** · `V4RevisionRequest`

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

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `tenant_id` | string | yes |  |
| `workspace_id` | string | yes |  |
| `dataset_id` | string | yes |  |
| `document_id` | string | yes |  |
| `revision_id` | string | yes |  |
| `revision_number` | integer | yes |  |
| `content_sha256` | string | yes |  |
| `supersedes_revision_id` | string \| null | no |  |

**Responses**

- `201` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /v4/catalog/revisions

**List Revisions** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `tenant_id` | query | string | yes |
| `workspace_id` | query | string | yes |
| `dataset_id` | query | string | yes |
| `document_id` | query | string | yes |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /v4/catalog/source-chunks

**Create Source Chunk** · Requires `X-API-Key`.

**Request body** · `V4SourceChunkRequest`

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

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `tenant_id` | string | yes |  |
| `workspace_id` | string | yes |  |
| `dataset_id` | string | yes |  |
| `document_id` | string | yes |  |
| `revision_id` | string | yes |  |
| `chunk_id` | string | yes |  |
| `title` | string | yes |  |
| `content` | string | yes |  |
| `source_ref` | string | yes |  |
| `revision_number` | integer | no |  |
| `chunk_ordinal` | integer | no |  |
| `finalize_revision` | boolean | no |  |
| `external_ref` | string \| null | no |  |
| `supersedes_revision_id` | string \| null | no |  |

**Responses**

- `201` Successful Response
- `422` Validation Error · `HTTPValidationError`

### DELETE /v4/catalog/documents/{document_id}

**Purge Document** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `document_id` | path | string | yes |
| `tenant_id` | query | string | yes |
| `workspace_id` | query | string | yes |
| `dataset_id` | query | string | yes |

**Responses**

- `202` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /v4/sessions/start

**Start Session** · Requires `X-API-Key`.

**Request body** · `V4SessionStartRequest`

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

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `tenant_id` | string | yes |  |
| `workspace_id` | string | yes |  |
| `dataset_ids` | array<string> | yes |  |
| `agent_id` | string | yes |  |

**Responses**

- `201` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /v4/capability

**Get Capability** · Requires `X-API-Key`.

**Responses**

- `200` Successful Response · `V4CapabilityResponse`

*Example*

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

**Create Rebuild Operation** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `Idempotency-Key` | header | string | yes |

**Responses**

- `202` Successful Response · `V4OperationResponse`
- `422` Validation Error · `HTTPValidationError`

*Example*

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

**Get Rebuild Operation** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `operation_id` | path | string | yes |

**Responses**

- `200` Successful Response · `V4OperationResponse`
- `422` Validation Error · `HTTPValidationError`

*Example*

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

**Cancel Rebuild Operation** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `operation_id` | path | string | yes |

**Responses**

- `200` Successful Response · `V4OperationResponse`
- `422` Validation Error · `HTTPValidationError`

*Example*

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

**Retry Rebuild Operation** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `operation_id` | path | string | yes |

**Responses**

- `202` Successful Response · `V4OperationResponse`
- `422` Validation Error · `HTTPValidationError`

*Example*

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

**Rebuild Index** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `tenant_id` | query | string \| null | no |
| `workspace_id` | query | string \| null | no |
| `dataset_id` | query | string \| null | no |
| `Idempotency-Key` | header | string | yes |

**Responses**

- `202` Successful Response · `V4OperationResponse`
- `422` Validation Error · `HTTPValidationError`

*Example*

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

**Insert Memory** · Requires `X-API-Key`.

**Request body** · `V4MemoryInsertRequest`

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

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `session_id` | string | yes |  |
| `dataset_id` | string | yes |  |
| `document_id` | string | yes |  |
| `revision_id` | string | yes |  |
| `chunk_id` | string | yes |  |
| `title` | string | yes |  |
| `source_ref` | string | yes |  |
| `content` | string | yes |  |
| `evidence_span` | string | no |  |
| `revision_number` | integer | no |  |
| `chunk_ordinal` | integer | no |  |
| `finalize_revision` | boolean | no |  |
| `supersedes_revision_id` | string \| null | no |  |
| `metadata` | object | no |  |
| `legal_identity` | V4LegalIdentityRequest \| null | no |  |
| `idempotency_key` | string \| null | no |  |

**Responses**

- `202` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /v4/memory/search

**Search Memory** · Requires `X-API-Key`.

**Request body** · `V4SearchRequest`

```json
{
  "session_id": "<session_id>",
  "query": "When does the archive open?"
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `session_id` | string | yes |  |
| `dataset_ids` | array<string> \| null | no |  |
| `query` | string | yes |  |
| `limit` | integer | no |  |
| `jurisdiction` | string \| null | no |  |
| `valid_at` | string \| null | no |  |
| `valid_from` | string \| null | no |  |
| `valid_to` | string \| null | no |  |
| `graph_mode` | enabled · disabled | no | Enable or disable only the graph retrieval lane for matched ablation. |

**Responses**

- `200` Successful Response · `V4SearchResponse`
- `422` Validation Error · `HTTPValidationError`

*Example*

```json
{
  "session_id": "<session_id>",
  "dataset_ids": [
    "string"
  ],
  "results": [
    {}
  ],
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
  },
  "vector_lane": {
    "contract_version": "string",
    "status": "string",
    "representation_version": "string",
    "embedding_space_id": "string",
    "registry_artifact_count": 0,
    "compatible_registry_artifact_count": 0
  }
}
```

### GET /v4/mutations/{mutation_id}

**Mutation Status** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `mutation_id` | path | string | yes |

**Responses**

- `200` Successful Response · `V4MutationStatusResponse`
- `422` Validation Error · `HTTPValidationError`

*Example*

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

**Rollback Mutation** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `mutation_id` | path | string | yes |

**Responses**

- `202` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /v4/mutations/{mutation_id}/replay

**Replay Mutation** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `mutation_id` | path | string | yes |

**Responses**

- `202` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /v4/sessions/{session_id}/context

**Get Context** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `session_id` | path | string | yes |
| `query` | query | string | no |
| `token_budget` | query | integer | no |
| `jurisdiction` | query | string \| null | no |
| `valid_at` | query | string \| null | no |
| `valid_from` | query | string \| null | no |
| `valid_to` | query | string \| null | no |
| `retrieval_mode` | query | single · adaptive | no |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /v4/sessions/{session_id}/end

**End Session** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `session_id` | path | string | yes |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

## Health and metrics

### GET /health/init

**Health Init** · No API key required.

**Responses**

- `200` Successful Response

### GET /v3/health

**Health V3** · Requires `X-API-Key`.

**Responses**

- `200` Successful Response

### GET /health

**Health** · Requires `X-API-Key`.

**Responses**

- `200` Successful Response

### GET /metrics

**Metrics** · Requires `X-API-Key`.

**Responses**

- `200` Successful Response

## MCP control plane

### GET /control/mcp/clients

**List Clients** · Requires `X-API-Key`.

**Responses**

- `200` Successful Response

### POST /control/mcp/clients

**Create Client** · Requires `X-API-Key`.

**Request body** · `ClientCreateReq`

```json
{
  "client_id": "string",
  "display_name": "string",
  "client_type": "string",
  "principal_id": "string"
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `client_id` | string | yes |  |
| `display_name` | string | yes |  |
| `client_type` | string | yes |  |
| `principal_id` | string | yes |  |
| `metadata` | object | no |  |

**Responses**

- `201` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/clients/{client_id}

**Get Client** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `client_id` | path | string | yes |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/connections

**List Connections** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `client_id` | query | string \| null | no |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/settings

**Get Settings** · Requires `X-API-Key`.

**Responses**

- `200` Successful Response

### POST /control/mcp/settings

**Update Setting** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `key` | query | string | yes |
| `value` | query | object | yes |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /control/mcp/policies

**Create Policy** · Requires `X-API-Key`.

**Request body** · `PolicyCreateReq`

```json
{
  "rule_id": "string",
  "scope_type": "string",
  "operation": "string",
  "effect": "string",
  "created_by": "string"
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `rule_id` | string | yes |  |
| `scope_type` | string | yes |  |
| `operation` | string | yes |  |
| `effect` | string | yes |  |
| `created_by` | string | yes |  |
| `scope_id` | string \| null | no |  |
| `priority` | integer | no |  |
| `conditions` | object | no |  |

**Responses**

- `201` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/policies

**List Policies** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `operation` | query | string \| null | no |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### PUT /control/mcp/clients/{client_id}/enabled

**Toggle Client Enabled** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `client_id` | path | string | yes |
| `enabled` | query | boolean | yes |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/clients/{client_id}/bindings

**List Bindings** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `client_id` | path | string | yes |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/managed-clients

**List Managed Clients** · Requires `X-API-Key`.

**Responses**

- `200` Successful Response

### POST /control/mcp/credentials/{credential_id}/revoke

**Revoke Managed Credential** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `credential_id` | path | string | yes |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/activity

**List Activity** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `limit` | query | integer | no |
| `offset` | query | integer | no |
| `client_id` | query | string \| null | no |
| `status` | query | string \| null | no |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/activity/{call_id}

**Get Activity Call** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `call_id` | path | string | yes |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/approvals

**List Approvals** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `status` | query | string \| null | no |
| `limit` | query | integer | no |
| `offset` | query | integer | no |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/approvals/pending

**List Pending Approvals Endpoint** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `client_id` | query | string \| null | no |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### POST /control/mcp/approvals/{approval_id}/decide

**Decide Approval Endpoint** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `approval_id` | path | string | yes |

**Request body** · `DecideApprovalReq`

```json
{
  "status": "string"
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | string | yes |  |
| `reason` | string \| null | no |  |

**Responses**

- `200` Successful Response
- `422` Validation Error · `HTTPValidationError`

### GET /control/mcp/overview

**Get Overview** · Requires `X-API-Key`.

**Responses**

- `200` Successful Response

## V3 compatibility · memory

### POST /v3/memory/insert

**Queue memory insertion (hot path)** · Requires `X-API-Key`.

**Request body** · `MemoryInsertRequest`

```json
{
  "agent_id": "agent_alpha",
  "session_id": "session_001",
  "content": "The archive opens at nine on weekdays."
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `agent_id` | string | yes | Tenant identifier for row-level isolation |
| `tenant_id` | string \| null | no | Stable tenant quota/accounting scope. Legacy callers that omit it retain the historical one-agent-per-tenant behavior. |
| `session_id` | string | yes | Session scope within the agent tenant |
| `content` | string | yes | Text content to store in the memory layer |
| `metadata` | object | no | Optional key-value metadata (max 64 keys, flat structure) |
| `idempotency_key` | string \| null | no | Optional idempotency key to prevent duplicate ingestion |

**Responses**

- `202` Acknowledged with log_id for tracking
- `422` Validation Error · `ErrorResponse`
- `500` Internal Error · `ErrorResponse`
- `403` RBAC Access Denied · `ErrorResponse`

### GET /v3/memory/status/{log_id}

**Query cold-path processing status for a raw_log entry** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `log_id` | path | integer | yes |
| `agent_id` | query | string | yes |

**Responses**

- `200` Current processing status of the log entry
- `422` Validation Error · `ErrorResponse`
- `500` Internal Error · `ErrorResponse`

### POST /v3/memory/search

**Search memory** · Requires `X-API-Key`.

**Request body** · `MemorySearchRequest`

```json
{
  "agent_id": "docs-agent",
  "session_id": "<session_id>",
  "query": "When does the archive open?"
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `agent_id` | string | yes | Tenant identifier for scoped search |
| `session_id` | string | yes | Session scope within the agent tenant |
| `query` | string | yes | Search query text |
| `limit` | integer | no | Maximum results to return (1-50) |
| `temporal_filter` | object \| null | no | Optional dict with 'valid_from', 'valid_to', or 'valid_at' ISO-8601 strings |

**Responses**

- `200` Retrieved context with latency metrics · `MemorySearchResponse`
- `422` Validation Error · `ErrorResponse`
- `500` Internal Error · `ErrorResponse`

*Example*

```json
{
  "context": "string",
  "retrieved_nodes": [
    {
      "node_id": "string",
      "entity_name": "string",
      "type": "ENTITY",
      "source": "hybrid",
      "score": 0.5,
      "content_hash": "string"
    }
  ],
  "metrics": {},
  "degraded_sources": [
    "vector"
  ]
}
```

### GET /v3/memory/records/{memory_id}

**Retrieve one memory record within an agent and session scope** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `memory_id` | path | string | yes |
| `agent_id` | query | string | yes |
| `session_id` | query | string | yes |

**Responses**

- `200` Successful Response
- `422` Validation Error · `ErrorResponse`
- `500` Internal Error · `ErrorResponse`

### DELETE /v3/memory/purge

**Soft-delete memory records** · Requires `X-API-Key`.

**Request body** · `MemoryPurgeRequest`

```json
{
  "agent_id": "docs-agent",
  "scope": "agent",
  "scope_id": "string"
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `agent_id` | string | yes | Tenant identifier of the requester |
| `scope` | agent · session | yes | Purge scope: 'agent' for all data, 'session' for a single session |
| `scope_id` | string | yes | Target identifier to purge (agent_id or session_id) |

**Responses**

- `200` Purge result with affected record count
- `422` Validation Error · `ErrorResponse`
- `500` Internal Error · `ErrorResponse`

### POST /v3/memory/session/start

**Start a new session** · Requires `X-API-Key`.

**Request body** · `SessionStartRequest`

```json
{
  "agent_id": "docs-agent"
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `agent_id` | string | yes | Tenant identifier |

**Responses**

- `200` Returns a new unique session_id · `SessionStartResponse`
- `422` Validation Error · `ErrorResponse`
- `500` Internal Error · `ErrorResponse`

*Example*

```json
{
  "session_id": "<session_id>",
  "agent_id": "docs-agent",
  "status": "started"
}
```

### GET /v3/memory/session/{session_id}/context

**Retrieve session context** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `session_id` | path | string | yes |
| `agent_id` | query | string | yes |

**Responses**

- `200` Consolidated memory and recent logs for the session · `SessionContextResponse`
- `422` Validation Error · `ErrorResponse`
- `500` Internal Error · `ErrorResponse`

*Example*

```json
{
  "session_id": "<session_id>",
  "agent_id": "docs-agent",
  "context": "string",
  "recent_logs": [
    {}
  ]
}
```

### POST /v3/memory/session/{session_id}/end

**End a session** · Requires `X-API-Key`.

**Parameters**

| Name | In | Type | Required |
| --- | --- | --- | --- |
| `session_id` | path | string | yes |

**Request body** · `SessionEndRequest`

```json
{
  "agent_id": "docs-agent"
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `agent_id` | string | yes | Tenant identifier |

**Responses**

- `200` Session termination status
- `422` Validation Error · `ErrorResponse`
- `500` Internal Error · `ErrorResponse`
