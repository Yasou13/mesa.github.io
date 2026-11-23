## Where data lives

Memory is stored in `~/.local/share/mesa-lore/lore.db`. Set `MESA_LORE_DB` to use another path. The hook queue is stored next to it unless `MESA_LORE_QUEUE` is set. Install backups are in `~/.config/mesa-lore/backup/`.

## What is stored

MESA Lore stores text from imported sessions, including user messages, assistant messages and tool activity, plus saved notes, handoffs and token usage. Treat the database as sensitive, because coding sessions can contain private code and business information.

## Network and model providers

MESA Lore makes no network calls at runtime and no LLM calls. Your coding agent still sends any memory it retrieves to its own model provider, as it does with other context.

## Secret masking

Common API keys, tokens, passwords, bearer values, private keys and credentials in URLs are masked as `[REDACTED]` before storage.

> [!WARNING]
> Masking is pattern-based and can miss an unusual format. Do not rely on it as your only protection for secrets.

## Exclude a project

Add the project name to `~/.config/mesa-lore/config.toml`:

```toml
excluded_projects = ["private-client"]
```

New imports from that project are skipped. Entries already stored stay until you purge them.

## Delete data

- `mesa-lore delete <id>` removes one entry.
- `mesa-lore purge --project my-app` removes a project’s entries, handoffs and usage data.
- `mesa-lore purge --older-than 90d` removes old entries from all projects, unless you add `--project`.

> [!IMPORTANT]
> Purging does not delete your agents’ original transcripts. After `purge --project`, those files can be imported again. Exclude the project first if it should stay out.
