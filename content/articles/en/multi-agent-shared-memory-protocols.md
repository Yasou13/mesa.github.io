---
id: "multi-agent-shared-memory-protocols"
slug: "multi-agent-shared-memory-protocols"
type: "learn"
language: "en"
title: "Shared memory protocols and scope isolation for multi-agent fleets"
subtitle: "Coordinating concurrent agent writes, working scratchpads, and workspace perimeters"
summary: "When fleets of specialized agents collaborate, they require structured protocols to share authoritative discoveries while isolating private working hypotheses."
shortAnswer: "Multi-agent memory enforces layered scopes (agent-private, workspace-collaborative, tenant-wide) to avoid race conditions and cross-context pollution."
category: "Foundations"
tags: ["multi-agent", "shared-memory", "scope-isolation", "concurrency"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Shared memory protocols and scope isolation for multi-agent fleets — MESA Learn"
seoDescription: "When fleets of specialized agents collaborate, they require structured protocols to share authoritative discoveries while isolating private working hypothe"
---

## The shared scratchpad dilemma

If multiple autonomous agents write unverified intermediate thoughts to a shared database, the memory pool quickly degrades into mutual confusion. One agent's speculative hypothesis becomes another agent's confirmed premise.

> [!WARNING]
> **Concurrency and Race Hazards**
> Two agents simultaneously reading memory, computing conflicting actions, and writing assertions can cause race conditions that corrupt long-term entity states without transactional isolation.

## Engineering trade-offs side-by-side

| Scope Layer | Access Rule | Lifecycle Duration | Intended Use Case |
| --- | --- | --- | --- |
| Agent Scratchpad | Private to single agent instance | Ephemeral (session/task) | Drafting intermediate chain-of-thought and scratch work |
| Workspace Perimeter | Shared across project agent fleet | Project/Matter duration | Verified factual findings relevant to a specific team task |
| Tenant Durable Store | Read-only for tasks; authorized write | Permanent organizational life | Corporate policies, approved taxonomies, canonical truth |
| Global Knowledge Base | Read-only across all tenants | Immutable | Official legislation, public documentation, foundational dictionaries |

## Atomic state promotion and scope metadata

Knowledge promotion follows a staged lifecycle: an assertion begins in `scope:agent_private`. Once validated by an evaluator agent or human review, it is promoted to `scope:workspace_shared` via an atomic transaction with full lineage intact.

```text
// Scoped insertion with tenant and workspace isolation
INSERT INTO assertions (id, subject, predicate, object, tenant_id, workspace_id, agent_id, visibility)
VALUES ('asrt_55c', 'Matter402', 'discovery_deadline', '2026-11-15', 'corp_alpha', 'ws_litigation', 'agent_researcher', 'WORKSPACE_SHARED');
```

## Multi-agent isolation in MESA

MESA Core architecture enforces rigid four-level scope metadata on every memory query. Retrieval routers filter by `(tenant_id, workspace_id, agent_id)` at the database engine level before any vector or graph computation takes place.

- [ ] Every retrieval query enforces tenant and workspace isolation in SQL.
- [ ] Agents cannot read outside their authorized workspace perimeter.
- [ ] Promotion from scratchpad to shared memory requires assertion validation.
- [ ] Full actor attribution records which agent produced each factual claim.

## References

1. [Wooldridge (2009) — An Introduction to MultiAgent Systems (John Wiley & Sons)](https://www.wiley.com/en-us/An+Introduction+to+MultiAgent+Systems%2C+2nd+Edition-p-9780470519462)
2. [MESA Evaluation & Security Gates](https://mesamemory.dev/evaluation/)

