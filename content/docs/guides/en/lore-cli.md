## Setup commands

```bash
mesa-lore install
mesa-lore doctor
mesa-lore uninstall
```

`install`, `doctor` and `uninstall` accept `--home PATH` to work on another home directory.

## Find memory

```bash
mesa-lore search "why did login fail" --project my-app
mesa-lore search "redis timeout" --kind decision --budget 400
mesa-lore index --project my-app
mesa-lore list --project my-app
mesa-lore show <id> --before 2 --after 2
```

| Command | Options |
| --- | --- |
| `search` | `--project`, `--kind`, `--budget` (default 800 tokens) |
| `index` | `--project`, `--budget` (default 400, output capped near 181) |
| `list` | `--project` |
| `show` | `--project`, `--before`, `--after` |

Without `--project`, `search`, `index` and `show` use the current project. `list` shows all projects.

## Export and usage

```bash
mesa-lore export --project my-app --out my-app.md
mesa-lore export --all -o notes/
mesa-lore stats --days 30
mesa-lore stats --project my-app --json
```

`export` writes readable Markdown with decisions, failed attempts, todos, facts, history and sessions. `stats` reports token usage and accepts `--project`, `--days`, `--agent` and `--json`.

## Delete memory

```bash
mesa-lore delete <id>
mesa-lore purge --project my-app
mesa-lore purge --older-than 90d
```

> [!WARNING]
> `purge` permanently removes stored entries. `purge --older-than` applies to all projects unless you also pass `--project`.

## Advanced commands

```bash
mesa-lore ingest session.jsonl --agent claude
mesa-lore ingest-pending
mesa-lore serve
```

`ingest` imports one transcript and requires `--agent claude`, `codex` or `antigravity`. `ingest-pending` processes queued transcripts and scans Antigravity. `serve` runs the MCP server over stdio. `hook` is called by agent hooks and is not normally run by hand.
