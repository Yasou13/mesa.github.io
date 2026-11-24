---
id: "codex-cli-mcp-memory"
slug: "codex-cli-mcp-memory"
type: "guide"
language: "en"
title: "How do you set up MCP memory for Codex CLI?"
subtitle: ""
summary: "Keep instructions in AGENTS.md and add a local MCP server that can search earlier Codex sessions."
shortAnswer: "Keep project instructions in AGENTS.md. Install MESA Lore to add a local MCP memory server to Codex, approve its hooks with /hooks, then start a new session and test memory_search."
category: "Coding Agents"
tags: ["codex-cli", "agent-memory", "mcp"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-24"
readingMinutes: 6
status: "published"
indexable: true
seoTitle: "How to Set Up MCP Memory for Codex CLI — MESA"
seoDescription: "Add a local MCP memory server to Codex CLI, approve its hooks and search earlier sessions while keeping project rules in AGENTS.md."
---

## 1. Separate instructions from history

Codex reads `AGENTS.md` files before doing work, so use them for standards and project rules. A memory server has a different job: it helps the agent find what happened in earlier sessions.

| Need | Use |
| --- | --- |
| Rules for every task | AGENTS.md |
| Earlier decisions and failures | MCP memory |
| A note for the next session | Handoff in MESA Lore |

## 2. Install the MCP memory server

```text
git clone https://github.com/Yasou13/MESA_Lore.git
cd MESA_Lore
python3 -m venv .venv
.venv/bin/pip install .
.venv/bin/mesa-lore install
.venv/bin/mesa-lore doctor
```

Install adds a `mesa-lore` server to `~/.codex/config.toml`, the default Codex MCP configuration, and adds session hooks to `~/.codex/hooks.json`. It backs up changed files first. Codex can also read hooks from other places, such as a trusted project’s `.codex/hooks.json`; `~/.codex/hooks.json` is the default user location.

> [!WARNING]
> **Existing history is imported**
> Install also imports existing agent transcripts. [Exclude private projects](/docs/lore/data-and-privacy/) first.

## 3. Approve the hooks

Codex requires non-managed hooks to be reviewed and trusted before they run. Open Codex, run `/hooks` and approve the MESA Lore commands. Without approval, automatic capture and the session-start index do not run.

## 4. Verify the connection

```text
codex mcp list
mesa-lore doctor
```

`codex mcp list` should show `mesa-lore`. Inside Codex, `/mcp` shows active servers. `mesa-lore doctor` should report `OK` for Codex MCP and hooks.

After install and hook approval, the Codex line reads `Codex MCP: OK | hooks: OK (approve with /hooks in Codex)`. Before setup it reads `Codex MCP: missing | hooks: missing`.

## 5. Test memory in a new session

1. Start a new Codex session in the project.
2. Ask: “Call memory_index and summarize recent work.”
3. Ask: “Search memory for the last failed test fix.”
4. Check that the answer points to a real source.
5. Save a decision: “Save this as a decision in memory.”

> [!NOTE]
> **What the MESA Lore tests measured**
> From the mesa-lore 0.1.0 test suite and benchmark on Linux: session startup cost 432 tokens (163 for the index, 269 for tool definitions), and search p95 was 84 ms of CPU time on 10,000 chunks in one run. End-to-end token savings when resuming a session have not been measured. Search is lexical, so a query needs words or stems that appear in the transcript.

## What if Codex does not use memory?

| What you see | Fix |
| --- | --- |
| `codex mcp list` does not show `mesa-lore` | Run `mesa-lore install` again, then check `~/.codex/config.toml` |
| No memory index at session start | Approve the hooks with `/hooks`, then start a new session |
| `Codex MCP: missing` in `mesa-lore doctor` | The MCP entry is absent. Reinstall, or restore it from the backup that install made |
| Search finds nothing for a known decision | Use words from the original session; search is lexical |

More cases are in [MESA Lore troubleshooting](/docs/lore/troubleshooting/).

## Codex memory questions

**Where does Codex store MCP settings?**
: By default in `~/.codex/config.toml`. Trusted projects can also use `.codex/config.toml`.

**Does MESA Lore replace AGENTS.md?**
: No. AGENTS.md gives instructions. Lore makes past work searchable.

**Why is the memory index not appearing?**
: The hook may not be approved. Run `/hooks`, start a new session and check `mesa-lore doctor`.

**Can Codex and Claude Code share memory?**
: Yes. MESA Lore stores both agents in the same local database and searches by project.

## Sources

1. [Codex · Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
2. [Codex · Model Context Protocol](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)
3. [Codex · Hooks](https://learn.chatgpt.com/docs/hooks)
4. [MESA Lore on GitHub](https://github.com/Yasou13/MESA_Lore)

