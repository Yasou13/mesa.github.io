## What is MESA Lore?

MESA Lore is a local MCP memory server for coding agents. It indexes past Claude Code, Codex CLI and Antigravity sessions plus short agent notes in one SQLite file. A new session can then search earlier decisions, failures and work and pull back only small passages with their sources.

It runs on CPU, makes no LLM calls, uses no embeddings and sends nothing over the network at runtime. It is a separate tool and does not require MESA Core.

## How a session works

1. `mesa-lore install` connects your agents and imports existing session history.
2. In Claude Code and Codex, a `SessionStart` hook adds a short project index to the new session.
3. The agent calls `memory_search` when it needs a detail, then `memory_get` to read the surrounding context.
4. `Stop` and `SessionEnd` hooks queue the transcript, and it is indexed when the next session starts.
5. The agent can save decisions, facts, todos, failed attempts and handoffs with `memory_save`.

## When should you use it?

| Need | Better fit |
| --- | --- |
| Project rules and coding standards | `CLAUDE.md` or `AGENTS.md` |
| Learned preferences in Claude Code | Claude Code auto memory |
| Finding what happened in earlier sessions | MESA Lore |
| Document memory for an application you build | [MESA Core](docs/core/) |

MESA Lore complements built-in agent memory. It does not replace your instruction files.

## Current status

Version 0.1.0 is an open-source release under Apache-2.0. It requires Python 3.10 or newer and is installed from GitHub. Linux is tested, macOS is untested and Windows is not supported yet. See [limits and measured results](docs/lore/troubleshooting/).

## Next steps

- [Install MESA Lore](docs/lore/installation/)
- [Connect your agents](docs/lore/agents/)
- [Learn the MCP tools](docs/lore/mcp-tools/)
