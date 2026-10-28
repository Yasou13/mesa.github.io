## The source hierarchy

A tenant contains workspaces and datasets. A dataset owns documents, immutable revisions and exact source chunks. A server-created session binds the principal, tenant, workspace, agent and an immutable authorized dataset set. Caller metadata never grants scope.

## Admission is not completion

`POST /v4/memory/insert` requires session and source identities, title, source_ref and exact content. A 202 returns mutation, candidate, pipeline and raw-log IDs. Poll mutation state; `wait_until_committed` can also return a failed terminal state. Rejection must not create active retrieval artifacts.

## Revision boundaries and retries

For a multi-chunk revision, use distinct IDs/ordinals and `finalize_revision=false` until the last insert. The final insert freezes membership; activation waits for every required child. Retry with the same body idempotency key and exact payload. Conflicting retries are rejected. Correction creates a new revision; purge and rollback remove source ownership through explicit permissions.

## Whole documents and purge

`POST /v4/documents` handles exact-text chunking, duplicate detection and revision IDs on the server. It returns per-chunk mutation IDs; admission remains distinct from COMMITTED. Models-off operation stores text and supports BM25; optional vector and graph lanes can be SKIPPED and later backfilled. Document purge removes owned source/extracted text while retaining audit identifiers and hashes; shared text stays while another document owns it.
