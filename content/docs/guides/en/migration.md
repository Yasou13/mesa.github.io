## Purpose and boundaries

Back up offline before a forward migration. V4 requires an explicit combined owner and optional model processing; V3 uses a separate root. Old graph/vector/temporal capability names have narrower replacements. Restore the retained backup into a new empty target for rollback; do not downgrade an in-place migrated root.

## Continue with the maintained contracts

Use the pinned source reference below for complete tables and operator details. Related guides: [architecture](architecture/), [API](docs/core/api-reference/), [operations](docs/core/operations/) and [release limits](docs/core/limitations/).

Back up the old root, record its schema/embedding identity and use the v0.9.1 locked environment. The retained source appendix describes the earlier v0.8.0 upgrade; it is historical migration guidance. Review local credentials, optional model/graph flags and whole-document revision semantics before upgrading.

## v0.9.1 ingestion indexes

Normal startup applies migration `e6f7a8b9c0d1`. Stop the single storage owner and take a complete offline backup before upgrading. Follow [backup and restore](docs/core/operations/) and [single-owner recovery](docs/core/rebuild-runbook/). Upgrade with the verified PyPI package using `pip install --upgrade mesa-memory==0.9.1`; see [installation](docs/core/installation/). Set `MESA_CHUNKING=plain` and `MESA_RRF_VECTOR_WEIGHT=1` for previous chunk planning on new revisions and previous vector weighting. Existing ACTIVE revisions are unchanged.

```bash
pip install --upgrade mesa-memory==0.9.1
```
