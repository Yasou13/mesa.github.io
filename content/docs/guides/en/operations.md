## One writer and observable work

Run one combined V4 owner per storage root. Monitor projection backlog, dead letters, stuck leases, cleanup backlog/blocked and orphan registry metrics. A shared-artifact count is expected and need not be zero. A growing backlog is an operational signal, not permission to edit store rows manually.

## Recovery preserves ownership

Fix the underlying store/provider fault before authorized replay. A lost fencing claim cannot finalize work. Rollback removes source ownership and writes tombstones before secondary cleanup; shared artifacts survive while another active source owns them. BLOCKED cleanup is not success.

## Backup before cutover

Use the pinned offline backup/restore procedure with writer-lock checks. Keep the original root and backup during rollback protection. Restore into a new empty target; do not overwrite an existing root or run generic downgrade. [Rebuild](docs/core/rebuild-runbook/) is offline and storage-root-wide, not online or tenant-scoped.
