## The source hierarchy

A tenant contains workspaces and datasets. A dataset owns documents, immutable revisions and exact source chunks. A server-created session binds the principal, tenant, workspace, agent and an immutable authorized dataset set. Caller metadata never grants scope.

## Admission is not completion

`POST /v4/memory/insert` requires session and source identities, title, source_ref and exact content. A 202 returns mutation, candidate, pipeline and raw-log IDs. Poll mutation state; `wait_until_committed` can also return a failed terminal state. Rejection must not create active retrieval artifacts.

## Revision boundaries and retries

For a multi-chunk revision, use distinct IDs/ordinals and `finalize_revision=false` until the last insert. The final insert freezes membership; activation waits for every required child. Retry with the same body idempotency key and exact payload. Conflicting retries are rejected. Correction creates a new revision; purge and rollback remove source ownership through explicit permissions.

## Whole documents and purge

`POST /v4/documents` handles exact-text chunking, duplicate detection and revision IDs on the server. It returns per-chunk mutation IDs; admission remains distinct from COMMITTED. Models-off operation stores text and supports BM25; the optional vector lane can be SKIPPED and later backfilled. Document purge removes owned source/extracted text while retaining audit identifiers and hashes; shared text stays while another document owns it.

## Article-aware chunking and retries

`MESA_CHUNKING=auto|plain` defaults to `auto`. At least three Turkish article headings at line starts trigger article-boundary splitting; long pieces remain bounded to 512 tokens and preserve exact source text. `plain` keeps the previous plan for new revisions. Existing ACTIVE revisions do not change. A retry preserves the plan matching the admitted text, even after restart or a setting change. If the admitted prefix matches two different plans, admission fails closed with HTTP 409 without appending chunks.

## Queue capacity and document deadlines

Document admission waits briefly for room for the current chunk on `queue_over_capacity`, retaining the complete chunk plan within that request. Persistent pressure still returns `503 queue_over_capacity`; retry the exact payload to resume stored ordinals; the retry keeps the chunking plan saved for that revision. `add_document(deadline=600)` uses the remaining document deadline for the HTTP request. Admission and full readiness remain separate; large uploads can take minutes.

Legal rules default on for newly admitted chunks; model-based SPO extraction defaults off, even with models enabled. Legal items retain original chunk offsets and remain separate from SPO facts. Existing identities are immutable on resume.

## Versioned documents

Upload each version of a changing document (an amended law, a revised policy) under the same `document_id` with a timezone-aware `metadata.valid_from`, and optionally `metadata.valid_to`. Date-only or naive timestamps and `valid_from >= valid_to` are rejected with HTTP 422 before any chunk is written. Versions can arrive in any order: validity order, not upload order, decides which revision is ACTIVE and how the `[valid_from, valid_to)` history chain links. An older version uploaded later is stored directly as history. A second version with the same `valid_from` returns HTTP 409; an undated version on a document that already has dated versions returns HTTP 422. See [point-in-time search](docs/core/retrieval-and-graph/#guide-point-in-time-search).
