---
id: "sqlite-as-canonical-agent-memory"
slug: "sqlite-as-canonical-agent-memory"
type: "learn"
language: "en"
title: "Canonical storage and projections: survive a partial write"
subtitle: ""
summary: "Trace one mutation through SQL, vector and graph stores. Understand durable admission, retries, idempotency and projection rebuilds."
shortAnswer: "Trace one mutation through SQL, vector and graph stores. Understand durable admission, retries, idempotency and projection rebuilds."
category: "Evidence & Trust"
tags: ["SQLite", "outbox", "idempotency", "projection", "LanceDB", "Kuzu", "projeksiyon", "kalıcılık"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Canonical storage and projections: survive a partial write — MESA Learn"
seoDescription: "Trace one mutation through SQL, vector and graph stores. Understand durable admission, retries, idempotency and projection rebuilds."
lessonOrder: 11
learningStage: "systems"
prerequisites: ["structured-vs-unstructured-memory", "evidence-aware-memory"]
learningObjectives: ["Explain canonical versus derived state", "Recover from a crash between stores", "Design idempotent writes and observable status"]
---

## Pick an authority for identity and lifecycle

A memory application may use SQL for source records, a vector index for similarity and a graph for relationships. If the three stores disagree, which decides whether a claim exists and is active? A canonical store owns that decision. A projection is a derived representation rebuilt from the canonical data and its declared transformation. “Derived” describes authority, not importance or search quality.

In an illustrative design, SQL owns source revisions, assertion IDs, status and a mutation ledger. Vector and graph rows refer to those IDs. A search hit becomes evidence only after checking it against canonical eligibility. A stale index row must not resurrect a deleted claim just because its vector is close to the query.

## Walk through a crash between stores

<!-- diagram: SQL admits a mutation and outbox work, then vector and graph projections run before visibility is finalized. -->
1. SQL transaction · source + outbox
2. Worker · claim pending work
3. Vector · apply by stable ID
4. Graph · apply by stable ID
5. Finalize · verify projections

*SQL commit does not create one atomic transaction spanning every independent backend.*

Suppose SQL commits, vector insertion succeeds and the process crashes before graph insertion. Without durable pending work, you may permanently lose the graph write. With an outbox recorded in the same SQL transaction as the canonical mutation, a restarted worker can find incomplete work and retry. The delivery may happen more than once; the effects must therefore be safe to repeat.

## Retry safely with identity and fencing

Idempotency means applying the same logical operation again does not create a different final effect. Use a stable operation ID and a declared payload identity. Reusing the same key with different content should be rejected or handled by an explicit contract. A random new ID on every retry creates duplicates rather than idempotency. A timeout means the caller did not observe completion; it does not prove no write happened.

A lease lets a worker claim work temporarily. A fencing token or equivalent ownership check prevents an old worker from completing work after another owner has taken over. Check ownership at the actual state-changing operation, not only when work starts. Test the race by pausing worker A, expiring its claim, letting B take over and then resuming A.

## What SQLite guarantees, and what it does not

SQLite documents atomic commit and crash-recovery mechanisms for its own transactions under stated assumptions. WAL allows readers and a writer to overlap, but still serializes writers. It does not turn embedded stores into a distributed multi-writer database. Filesystem durability, backup procedure and checkpoint behavior remain operational concerns. [Atomic commit](https://www.sqlite.org/atomiccommit.html), [WAL](https://www.sqlite.org/wal.html).

MESA Core v0.8.1 uses one combined owner per root and treats LanceDB/Kùzu as projections. Its rebuild is offline and full-root, not an online per-tenant repair. Those are product-specific limits; another system may choose different storage. Rebuild correctness requires preserving canonical evidence and representation identity, then verifying the replacement before cutover. [Core contract](docs/core/architecture/).

## Interpret a timeout

> [!EXERCISE]
> **Check your understanding**
> A client times out after the vector write. Should it create a fresh mutation with a fresh ID immediately?
>
> **Answer:** First inspect the original mutation status. Retry using the declared idempotency contract if appropriate. A fresh ID may duplicate an already admitted operation; a timeout is an observation failure, not proof of rollback.

## Sources and further reading

1. [SQLite · Atomic Commit](https://www.sqlite.org/atomiccommit.html)
2. [SQLite · Write-Ahead Logging](https://www.sqlite.org/wal.html)
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

