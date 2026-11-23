## Genel bakış

Core v0.9.4 (commit e30856e) ile yayımlanan OpenAPI belgesinden üretildi. Örnek gövdeler isteğin biçimini göstermek için şemadan oluşturulur; kaydedilmiş sunucu yanıtları değildir. Alan açıklamaları kaynakta İngilizcedir.

`/health/init` dışındaki her uç nokta `X-API-Key` başlığı ister. V4 çağrısının erişebileceği veri, o anahtara verilen rollerle sınırlıdır; bkz. [Güvenlik ve kapsam](docs/core/security/).

[OpenAPI JSON dosyasını indirin](https://github.com/Yasou13/MESA/blob/e30856ec6e7ed9146bb9af992565e864f727b0b9/docs/reference/openapi.json)

## V4 · hafıza, katalog ve oturumlar

### POST /v4/catalog/workspaces

**Çalışma alanı oluştur** · `X-API-Key` gerekir.

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

- `201` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### GET /v4/catalog/workspaces

**Çalışma alanlarını listele** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `tenant_id` | query | string | evet |

**Yanıtlar**

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### POST /v4/catalog/datasets

**Veri kümesi oluştur** · `X-API-Key` gerekir.

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

- `201` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### GET /v4/catalog/datasets

**Veri kümelerini listele** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `tenant_id` | query | string | evet |
| `workspace_id` | query | string | evet |

**Yanıtlar**

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### POST /v4/catalog/documents

**Belge oluştur** · `X-API-Key` gerekir.

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

- `201` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### GET /v4/catalog/documents

**Belgeleri listele** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `tenant_id` | query | string | evet |
| `workspace_id` | query | string | evet |
| `dataset_id` | query | string | evet |

**Yanıtlar**

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### POST /v4/catalog/revisions

**Revizyon oluştur** · `X-API-Key` gerekir.

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

- `201` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### GET /v4/catalog/revisions

**Revizyonları listele** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `tenant_id` | query | string | evet |
| `workspace_id` | query | string | evet |
| `dataset_id` | query | string | evet |
| `document_id` | query | string | evet |

**Yanıtlar**

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### POST /v4/catalog/source-chunks

**Kaynak parçası oluştur** · `X-API-Key` gerekir.

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

- `201` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### DELETE /v4/catalog/documents/{document_id}

**Belgeyi kalıcı olarak sil** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `document_id` | path | string | evet |
| `tenant_id` | query | string | evet |
| `workspace_id` | query | string | evet |
| `dataset_id` | query | string | evet |

**Yanıtlar**

- `202` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### POST /v4/sessions/start

**Oturum başlat** · `X-API-Key` gerekir.

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

- `201` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### GET /v4/capability

**Yetenekleri getir** · `X-API-Key` gerekir.

**Yanıtlar**

- `200` Başarılı yanıt · `V4CapabilityResponse`

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

**Yeniden oluşturma işlemi başlat** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `Idempotency-Key` | header | string | evet |

**Yanıtlar**

- `202` Başarılı yanıt · `V4OperationResponse`
- `422` Doğrulama hatası · `HTTPValidationError`

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

**Yeniden oluşturma işlemini getir** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `operation_id` | path | string | evet |

**Yanıtlar**

- `200` Başarılı yanıt · `V4OperationResponse`
- `422` Doğrulama hatası · `HTTPValidationError`

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

**Yeniden oluşturma işlemini iptal et** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `operation_id` | path | string | evet |

**Yanıtlar**

- `200` Başarılı yanıt · `V4OperationResponse`
- `422` Doğrulama hatası · `HTTPValidationError`

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

**Yeniden oluşturma işlemini yeniden dene** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `operation_id` | path | string | evet |

**Yanıtlar**

- `202` Başarılı yanıt · `V4OperationResponse`
- `422` Doğrulama hatası · `HTTPValidationError`

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

**Dizini yeniden oluştur** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `tenant_id` | query | string \| null | hayır |
| `workspace_id` | query | string \| null | hayır |
| `dataset_id` | query | string \| null | hayır |
| `Idempotency-Key` | header | string | evet |

**Yanıtlar**

- `202` Başarılı yanıt · `V4OperationResponse`
- `422` Doğrulama hatası · `HTTPValidationError`

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

**Hafızaya kayıt ekle** · `X-API-Key` gerekir.

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

- `202` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### POST /v4/documents

**Belge yükle** · `X-API-Key` gerekir.

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

- `202` Başarılı yanıt · `V4DocumentIngestResponse`
- `422` Doğrulama hatası · `HTTPValidationError`

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

**Hafızada ara** · `X-API-Key` gerekir.

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
| `graph_mode` | enabled · disabled | hayır | Eşleştirilmiş karşılaştırma için yalnızca çizge arama kanalını açar veya kapatır. |

**Yanıtlar**

- `200` Başarılı yanıt · `V4SearchResponse`
- `422` Doğrulama hatası · `HTTPValidationError`

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

**Değişiklik durumu** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `mutation_id` | path | string | evet |

**Yanıtlar**

- `200` Başarılı yanıt · `V4MutationStatusResponse`
- `422` Doğrulama hatası · `HTTPValidationError`

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

**Değişikliği geri al** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `mutation_id` | path | string | evet |

**Yanıtlar**

- `202` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### POST /v4/mutations/{mutation_id}/replay

**Değişikliği yeniden oynat** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `mutation_id` | path | string | evet |

**Yanıtlar**

- `202` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### GET /v4/sessions/{session_id}/context

**Bağlamı getir** · `X-API-Key` gerekir.

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

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### POST /v4/sessions/{session_id}/end

**Oturumu bitir** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `session_id` | path | string | evet |

**Yanıtlar**

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

## Sağlık ve metrikler

### GET /health/init

**İlk kurulum sağlık durumu** · API anahtarı gerekmez.

**Yanıtlar**

- `200` Başarılı yanıt

### GET /health

**Sağlık durumu** · `X-API-Key` gerekir.

**Yanıtlar**

- `200` Başarılı yanıt

### GET /metrics

**Metrikler** · `X-API-Key` gerekir.

**Yanıtlar**

- `200` Başarılı yanıt

## MCP kontrol düzlemi

### GET /control/mcp/clients

**İstemcileri listele** · `X-API-Key` gerekir.

**Yanıtlar**

- `200` Başarılı yanıt

### POST /control/mcp/clients

**İstemci oluştur** · `X-API-Key` gerekir.

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

- `201` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### GET /control/mcp/clients/{client_id}

**İstemciyi getir** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `client_id` | path | string | evet |

**Yanıtlar**

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### GET /control/mcp/connections

**Bağlantıları listele** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `client_id` | query | string \| null | hayır |

**Yanıtlar**

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### GET /control/mcp/settings

**Ayarları getir** · `X-API-Key` gerekir.

**Yanıtlar**

- `200` Başarılı yanıt

### POST /control/mcp/settings

**Ayarı güncelle** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `key` | query | string | evet |
| `value` | query | object | evet |

**Yanıtlar**

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### POST /control/mcp/policies

**Politika oluştur** · `X-API-Key` gerekir.

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

- `201` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### GET /control/mcp/policies

**Politikaları listele** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `operation` | query | string \| null | hayır |

**Yanıtlar**

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### PUT /control/mcp/clients/{client_id}/enabled

**İstemciyi aç veya kapat** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `client_id` | path | string | evet |
| `enabled` | query | boolean | evet |

**Yanıtlar**

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### GET /control/mcp/clients/{client_id}/bindings

**Bağlamaları listele** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `client_id` | path | string | evet |

**Yanıtlar**

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### GET /control/mcp/managed-clients

**Yönetilen istemcileri listele** · `X-API-Key` gerekir.

**Yanıtlar**

- `200` Başarılı yanıt

### POST /control/mcp/credentials/{credential_id}/revoke

**Yönetilen kimlik bilgisini iptal et** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `credential_id` | path | string | evet |

**Yanıtlar**

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### GET /control/mcp/activity

**Etkinlikleri listele** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `limit` | query | integer | hayır |
| `offset` | query | integer | hayır |
| `client_id` | query | string \| null | hayır |
| `status` | query | string \| null | hayır |

**Yanıtlar**

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### GET /control/mcp/activity/{call_id}

**Etkinlik çağrısını getir** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `call_id` | path | string | evet |

**Yanıtlar**

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### GET /control/mcp/approvals

**Onayları listele** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `status` | query | string \| null | hayır |
| `limit` | query | integer | hayır |
| `offset` | query | integer | hayır |

**Yanıtlar**

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### GET /control/mcp/approvals/pending

**Bekleyen onayları listele** · `X-API-Key` gerekir.

**Parametreler**

| Ad | Yer | Tür | Zorunlu |
| --- | --- | --- | --- |
| `client_id` | query | string \| null | hayır |

**Yanıtlar**

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### POST /control/mcp/approvals/{approval_id}/decide

**Onay kararı ver** · `X-API-Key` gerekir.

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

- `200` Başarılı yanıt
- `422` Doğrulama hatası · `HTTPValidationError`

### GET /control/mcp/overview

**Genel görünümü getir** · `X-API-Key` gerekir.

**Yanıtlar**

- `200` Başarılı yanıt
