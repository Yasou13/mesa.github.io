## Tenant is the authorization boundary

Authenticated keys bind a principal; tenant/workspace/dataset OWNER, WRITER and READER roles inherit downward. Agent IDs describe context, not credentials. Sessions freeze dataset membership. Purge and rollback need explicit dataset permissions in addition to roles. Scope is checked before retrieval ranking.

## Deployment responsibilities remain

Core does not encrypt SQLite/LanceDB/Kùzu at rest. Protect volumes, OS permissions, backups and networks. Versioned memory, health and metrics need an API key, but readiness, OpenAPI, Swagger and Redoc have public boundaries. Provide TLS and access policy at the deployment edge.

## Evidence is untrusted input

Source-linked context is not independently verified truth. `UNTRUSTED_MEMORY_EVIDENCE` must remain data in downstream prompts and tools. Avoid logging content, credentials, model output or claim tokens. Model consensus does not guarantee legal correctness or eliminate hallucinations.

## v0.9.0 operation

Purge erases the document’s owned source and extracted text while retaining audit IDs and hashes. Shared assertion/entity text remains while another document owns it. Protect local credentials and generated MCP configuration.
