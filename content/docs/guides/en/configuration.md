## Start with explicit runtime boundaries

Set `MESA_STORAGE_ROOT`, `MESA_RUNTIME_PROFILE=combined` for V4, `MESA_LOAD_DOTENV=false`, and deliberate model/provider flags. Use different roots for V3/V4. Settings changes do not rewrite an existing dataset representation; embedding identity and dimensions must match stored projections.

## Validation and retrieval controls

`MESA_TIER3_MODE`: 0 deterministic-only, 1 single validator, 2 distinct A/B provider-model consensus. `MESA_RRF_K=60` and the four `MESA_RRF_*_WEIGHT=1.0` settings control fusion. `MESA_V4_GRAPH_TIMEOUT_SECONDS=15.0` bounds graph requests. `MESA_V4_REBUILD_ENABLED=false` keeps durable rebuild disabled by default.

## Use the full pinned setting reference

The source appendix below preserves the full v0.8.0 settings table, including admission quotas, readiness thresholds, provider models and operator variables. Defaults describe configuration, not proof that a provider is installed or operational. Credentials belong in a reviewed secret environment.
