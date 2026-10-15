---
id: "memory-scope-and-authorization"
slug: "memory-scope-and-authorization"
type: "learn"
language: "en"
title: "Memory scope and authorization in multi-agent systems"
subtitle: "Why security, tenant boundaries, and access controls must be enforced before retrieval fusion"
summary: "Multi-agent systems require rigorous memory scoping across tenants, workspaces, agents, and temporal windows to prevent data leakage and cross-context contamination."
shortAnswer: "Authorization in agent memory cannot be an afterthought: scopes must be validated before vector or keyword retrieval runs, ensuring agents never recall data outside their authorized perimeter."
category: "Evidence & Trust"
tags: ["authorization", "multi-agent", "security", "scope", "tenancy"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-01"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Memory Scope and Authorization in Multi-Agent Systems — MESA Learn"
seoDescription: "Understand multi-tenant isolation, workspace perimeters, agent privacy, and why authorization must be enforced prior to retrieval fusion in AI memory."
---

## The multi-agent data leakage problem

When multiple agents collaborate in enterprise environments, they share data infrastructure. If memory lacks explicit boundary enforcement, semantic search becomes a massive security vulnerability.

> [!WARNING]
> **Semantic search has no concept of confidentiality**
> A query like 'What were the executive compensation terms discussed last week?' will retrieve relevant records strictly based on cosine similarity. Dense embeddings do not understand ethical walls, organizational hierarchies, or tenant boundaries.

Without boundary enforcement, an agent assisting a marketing contractor could inadvertently retrieve confidential acquisition strategies stored by an executive agent in the same underlying database.

## The six dimensions of memory scoping

In production memory engines, security is modeled along six orthogonal dimensions:

| Scope Dimension | Boundary Type | Example | Enforcement Role |
| --- | --- | --- | --- |
| Tenant ID | Organizational isolation | Enterprise Account A vs Account B | Absolute isolation: zero cross-tenant query execution |
| Workspace ID | Project / Team perimeter | Matter 402 vs Matter 510 | Controls which projects or client files an agent can read |
| Agent ID | Private scratchpad | ResearchAgent vs ReviewAgent | Allows agents to maintain private working memory before sharing |
| Session ID | Ephemeral lifecycle | Interactive conversation turn | Isolates temporary conversation state from durable memory |
| Temporal Window | Validity duration | `valid_from` to `valid_until` | Excludes expired, preliminary, or superseded assertions |
| Jurisdiction | Regulatory boundary | TR vs EU data boundary | Ensures compliance with local data sovereignty mandates |

## Why pre-filtering is mathematically mandatory

A common mistake in agent development is post-filtering: querying the vector database for top-k results globally, and then discarding unauthorized results using an `if` statement.

<!-- diagram: Diagram contrasting flawed Post-Filtering (which causes top-k starvation) with correct Pre-Filtering (which searches strictly within the authorized partition) -->
1. Flawed Post-Filter: Global Search -> Top 10 from Tenant B -> Filtered Out -> Zero Results returned to Tenant A
2. Correct Pre-Filter: Scope Filter (Tenant A) -> Scoped Vector Scan -> 10 relevant results returned to Tenant A

*Post-filtering causes result starvation; pre-filtering guarantees search executes exclusively within authorized partitions.*

- [ ] Top-k Starvation: If the top 20 global vector matches belong to another tenant, post-filtering strips them all out, returning an empty list to the user even if dozens of valid records exist at ranks 21–50.
- [ ] Performance Overhead: Calculating vector distances over millions of unauthorized rows wastes GPU and CPU cycles.
- [ ] Data Leakage Timing: Timing and cache side-channels can leak information when global indexes process unauthorized candidates.

## Scoped collaboration between autonomous agents

Multi-agent workflows require nuanced permission models where agents share common workspace context while retaining private working memory:

> [!TIP]
> **Collaborative agent workflow**
> Agent A (Legal Researcher) writes assertions to `workspace:matter_104` with public visibility. Agent B (Partner Reviewer) reads workspace assertions, conducts a confidential fee audit, and writes assertions to `agent:reviewer_private`. When Agent A queries memory, it sees only the public matter assertions, while Agent B sees both.

## How MESA enforces memory authorization

In [MESA Core](mesa/), scope is not an optional tag: every memory table schema includes required `dataset_id`, `tenant_id`, `agent_id`, and temporal boundary columns.

Retrieval routers apply SQL `WHERE` clauses and vector metadata partition filters *before* candidate generation begins. Furthermore, MESA supports Profile B security certification gates, ensuring that memory boundaries are tamper-evident and fail closed. Learn more in the [MESA Core Documentation](mesa/).

## References

1. [Sandhu et al. (1996) — Role-Based Access Control Models (IEEE Computer)](https://ieeexplore.ieee.org/document/485845)
2. [Saltzer & Schroeder (1975) — The Protection of Information in Computer Systems](https://www.cs.virginia.edu/~evans/cs551/saltzer/)
3. [MESA Evaluation & Security Gates](https://mesamemory.dev/evaluation/)

