## Purpose and boundaries

Back up offline before a forward migration. V4 requires an explicit combined owner and optional model processing; data from the pre-V4 storage format needs a separate root. Older capability names have narrower replacements. Restore the retained backup into a new empty target for rollback; do not downgrade an in-place migrated root.

## Continue with the maintained contracts

Use the pinned source reference below for complete tables and operator details. Related guides: [architecture](architecture/), [API](docs/core/api-reference/), [operations](docs/core/operations/) and [release limits](docs/core/limitations/).

Back up the old root, record its schema/embedding identity and use the v0.9.5 locked environment. The retained source appendix describes the earlier v0.8.0 upgrade; it is historical migration guidance. Review local credentials, optional model flags and whole-document revision semantics before upgrading.

## Upgrade from v0.9.4 to v0.9.5

Stop the single storage owner and take a complete offline backup first. Then upgrade the package:

```bash
pip install --upgrade mesa-memory==0.9.5
```

- Startup applies forward-only migration `f9c0d1e2f3a4`. It removes the old graph rows from the projection and artifact bookkeeping tables and marks mutations whose projections had completed as `COMMITTED`. To go back, run v0.9.4 with the pre-upgrade store snapshot.
- The graph store is gone. Old `kuzu_db` files are ignored; delete them by hand after you have verified your backup. `MESA_GRAPH_ENABLED`, `MESA_RRF_GRAPH_WEIGHT` and `MESA_V4_GRAPH_TIMEOUT_SECONDS` are ignored with one startup warning per key. See [graph store removed](docs/core/graph/).
- The lockfile pins LanceDB 0.41.0 (package range below 0.42). On startup MESA adds scope keys to older vector tables from SQLite and keeps the stored embeddings.
- Dates on documents are optional. Undated documents behave as before; to use point-in-time search, upload versions with `metadata.valid_from` as described in [versioned documents](docs/core/concepts-and-ingestion/#guide-versioned-documents).
- The package now installs on Python 3.14, because Kùzu is no longer a dependency.

## Earlier upgrades

Upgrading from v0.9.3 to v0.9.4 applied forward-only migrations `f7a8b9c0d1e2` and `f8b9c0d1e2f3`, which dropped legacy pre-V4 tables and the routing telemetry table; the changelog states that existing 0.9.3 V4 stores migrate without data loss. That release also switched the default assertion fusion weight to 0.0, removed the legacy routes and clients (use `MesaV4Client` or `AsyncMesaV4Client`), and introduced 5-character prefix BM25 and stable tie-breaks, so search order can change. Re-check any ranking your application depends on. The [0.9.4 release notes](docs/core/release-notes/) list every retired setting; each is ignored with one startup warning.

## Existing v0.9.1 ingestion indexes

Normal startup applies migration `e6f7a8b9c0d1`. Stop the single storage owner and take a complete offline backup before upgrading. Follow [backup and restore](docs/core/operations/) and [single-owner recovery](docs/core/rebuild-runbook/). Upgrade with the verified PyPI package using `pip install --upgrade mesa-memory==0.9.5`; see [installation](docs/core/installation/). Set `MESA_CHUNKING=plain` and `MESA_RRF_VECTOR_WEIGHT=1` for previous chunk planning on new revisions and previous vector weighting. Existing ACTIVE revisions are unchanged.

## Review changed defaults on upgrade

`MESA_EXTRACTION_ENABLED` defaults to `false` independently of models. Set it explicitly to `true` to retain open-ended model-based SPO extraction. Legal rules default to `true`; `MESA_LEGAL_RULES_ENABLED=false` disables new legal enrichment and legal search overlays without deleting stored identities/snapshots. Existing ACTIVE revisions are not re-extracted by a settings change. Review the [configuration](docs/core/configuration/) and [release limits](docs/core/limitations/) before restarting the single storage owner.

## Embedding identity and startup

The default is `MESA_EMBEDDING_MODEL=local:BAAI/bge-m3`, `MESA_EMBEDDING_DIMENSION=1024`, normalized. Models remain off by default. Download the local model before enabling it. For an older store created with the earlier default, keep **both** settings below, or rebuild before changing identity:

```bash
MESA_EMBEDDING_MODEL=local:magibu/embeddingmagibu-200m
MESA_EMBEDDING_DIMENSION=768
```

Bootstrap `MESA_API_KEY` values containing `.` are rejected at startup.
