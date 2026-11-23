---
id: "deleting-code-mesa-0-9-4"
slug: "deleting-code-mesa-0-9-4"
type: "research"
language: "en"
title: "What We Deleted From MESA, and Why"
subtitle: "Removing two subsystems without changing a search rank"
summary: "MESA 0.9.4 removed the V3 node store and LLM consolidation. Runtime Python fell from 48,591 to 42,541 lines, and dev search ranks stayed identical after each removal."
shortAnswer: ""
category: "Retrieval Evaluation"
tags: ["engineering", "maintenance", "configuration", "release"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-23"
readingMinutes: 6
status: "published"
indexable: true
seoTitle: "What We Deleted From MESA, and Why"
seoDescription: "MESA 0.9.4 removed the V3 store and LLM consolidation, cutting 6,050 Python lines. Dev search ranks stayed identical after each removal."
---

## What did we remove from MESA?

MESA 0.9.4 removed the legacy V3 node store, the LLM consolidation subsystem and related settings. Runtime Python code fell from 48,591 to 42,541 lines, a drop of 6,050 lines or 12.5%. Settings read through the main config fell from 68 to 54.

We checked each removal against benchmark v2 dev with models off. All 128 questions kept the same passage and document ranks after every step.

## What exactly was deleted?

| Area | Lines removed | Lines added |
| --- | --- | --- |
| `mesa_storage/dao.py` (V3 node, purge and WAL methods) | 2,307 | 211 |
| `consolidation/loop.py` | 1,179 | 0 |
| `mesa_storage/vector_engine.py` (soft-delete, Procrustes) | 590 | 1 |
| `consolidation/router.py` | 392 | 0 |
| `consolidation/validator.py` | 286 | 0 |
| `consolidation/parser.py` | 271 | 0 |
| `consolidation/policy.py` | 173 | 0 |

| Scope, v0.9.3 → v0.9.4 | Files changed | Added | Removed |
| --- | --- | --- | --- |
| Runtime packages | 40 | 599 | 6,667 |
| Tests | 88 | 2,672 | 7,887 |
| Whole repository | 149 | 3,523 | 14,737 |

Five database structures also went away: the V3 tables `nodes`, `nodes_fts`, `lancedb_wal`, `purge_journal` and `system_config`. A later migration dropped `routing_telemetry`.

## Why did we delete working code?

Neither subsystem was part of the default document and search flow. MESA's document and search flow runs on the V4 tables, so the V3 store had become a second storage model to keep correct. Default validation was already deterministic (Mode 0), and in 0.9.3 finishing a session in that mode did not need a consolidation loop.

Keeping them still had a cost. Each path needed tests, documentation, settings and security review. A setting that few runs exercise can also fail quietly. Removing a subsystem turns that ongoing cost into a one-time migration.

## How did we check that search did not change?

We ran the full dev set before and after each removal, on a shared store with models off.

| Removal step, dev, T0 | Hit@5 before → after | MRR before → after | Questions with changed rank |
| --- | --- | --- | --- |
| V3 node store | 61/112 → 61/112 | 0.3955 → 0.3955 | 0 of 128 |
| LLM consolidation | 61/112 → 61/112 | 0.3955 → 0.3955 | 0 of 128 |
| Unused scaffolding | 61/112 → 61/112 | 0.3955 → 0.3955 | 0 of 128 |

We compared per-question ranks as well as averages, because [an average can hide rank changes](/research/why-two-search-runs-differed/). Median latency across these runs ranged from 178 ms to 315 ms with no consistent direction, so we make no speed claim from these removals.

## What happens to the removed settings?

MESA 0.9.4 retires 20 environment variables, including `MESA_TIER3_MODE`, `MESA_USE_V4` and `CONSOLIDATION_BATCH_SIZE`. If one is still set, MESA logs one warning for that key at startup and ignores it. An old configuration file therefore does not stop the server.

See the [configuration guide](/docs/core/configuration/) for current settings and the [migration guide](/docs/core/migration/) before upgrading.

## What did deleting cost?

- The storage migrations are forward-only. To go back, you need a store snapshot from before the upgrade and MESA 0.9.3.
- LLM validator modes 1 and 2 no longer exist.
- Tests were deleted along with the code. Security and durability contract tests for the old path were ported to V4 first.
- Optional fact extraction remains, through `MESA_EXTRACTION_ENABLED=true`.

The [SQLite lesson](/learn/sqlite-as-canonical-agent-memory/) explains why MESA keeps one canonical store.

## What can this result not show?

- The rank checks cover T0 on dev. They do not separately prove unchanged ranks for embedding or reranked search.
- They ran on development builds. The final 0.9.4 quality changes are covered in [a separate post](/research/what-improved-search-in-0-9-4/).
- Fewer lines do not prove better code.
- MESA has no production users yet, so this work has not been tested by real upgrades.

## Sources

1. [MESA 0.9.4 changelog](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
2. [v0.9.3 to v0.9.4 comparison](https://github.com/Yasou13/MESA/compare/v0.9.3...v0.9.4)

