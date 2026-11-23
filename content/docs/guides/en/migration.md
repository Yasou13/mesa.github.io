## Purpose and boundaries

Back up offline before a forward migration. V4 requires an explicit combined owner and optional model processing; V3 uses a separate root. Old graph/vector/temporal capability names have narrower replacements. Restore the retained backup into a new empty target for rollback; do not downgrade an in-place migrated root.

## Continue with the maintained contracts

Use the pinned source reference below for complete tables and operator details. Related guides: [architecture](architecture/), [API](docs/core/api-reference/), [operations](docs/core/operations/) and [release limits](docs/core/limitations/).

Back up the old root, record its schema/embedding identity and use the v0.9.4 locked environment. The retained source appendix describes the earlier v0.8.0 upgrade; it is historical migration guidance. Review local credentials, optional model/graph flags and whole-document revision semantics before upgrading.

## Upgrade from v0.9.3 to v0.9.4

Stop the single storage owner and take a complete offline backup first. Startup applies forward-only migrations `f7a8b9c0d1e2` (drops the legacy V3 `nodes`, `nodes_fts`, `lancedb_wal`, `purge_journal` and `system_config` tables) and `f8b9c0d1e2f3` (drops `routing_telemetry`). The changelog states that existing 0.9.3 V4 stores migrate without data loss. To go back, run v0.9.3 with the pre-upgrade store snapshot.

```bash
pip install --upgrade mesa-memory==0.9.4
```

- The graph is now off and the assertion fusion weight is 0.0. To keep the earlier fusion defaults, set `MESA_RRF_ASSERTION_WEIGHT=1.0` and `MESA_GRAPH_ENABLED=true`. Enabling the graph backfills skipped GRAPH projections at startup.
- V3 routes and clients are removed. Use `MesaV4Client` or `AsyncMesaV4Client`.
- LLM consolidation and Tier 3 modes 1/2 are removed. `MESA_TIER3_*`, `MESA_USE_V4`, `CONSOLIDATION_*` and the other retired settings listed in the changelog are ignored with one startup warning per key.
- Search order can change because of 5-character prefix BM25 and stable tie-breaks. Re-check any ranking your application depends on.

## Existing v0.9.1 ingestion indexes

Normal startup applies migration `e6f7a8b9c0d1`. Stop the single storage owner and take a complete offline backup before upgrading. Follow [backup and restore](docs/core/operations/) and [single-owner recovery](docs/core/rebuild-runbook/). Upgrade with the verified PyPI package using `pip install --upgrade mesa-memory==0.9.4`; see [installation](docs/core/installation/). Set `MESA_CHUNKING=plain` and `MESA_RRF_VECTOR_WEIGHT=1` for previous chunk planning on new revisions and previous vector weighting. Existing ACTIVE revisions are unchanged.

```bash
pip install --upgrade mesa-memory==0.9.4
```

## Review changed defaults on upgrade

`MESA_EXTRACTION_ENABLED` now defaults to `false` independently of models. Set it explicitly to `true` to retain open-ended model-based SPO extraction. Legal rules default to `true`; `MESA_LEGAL_RULES_ENABLED=false` disables new legal enrichment and legal search overlays without deleting stored identities/snapshots. Existing ACTIVE revisions are not re-extracted by a settings change. Review the [configuration](docs/core/configuration/) and [release limits](docs/core/limitations/) before restarting the single storage owner.

## v0.9.3 embedding identity and startup

The default is `MESA_EMBEDDING_MODEL=local:BAAI/bge-m3`, `MESA_EMBEDDING_DIMENSION=1024`, normalized. Models remain off by default. Download the local model before enabling it. For an older store created with the previous default, keep **both** settings below, or rebuild before changing identity:

```bash
MESA_EMBEDDING_MODEL=local:magibu/embeddingmagibu-200m
MESA_EMBEDDING_DIMENSION=768
```

v0.9.4 removes Tier 3 modes 1/2 and ignores `MESA_TIER3_MODE` with a warning. Bootstrap `MESA_API_KEY` values containing `.` are rejected at startup.
