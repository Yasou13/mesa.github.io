---
id: "claude-code-persistent-memory"
slug: "claude-code-persistent-memory"
type: "guide"
language: "en"
title: "How do you add persistent memory to Claude Code?"
subtitle: ""
summary: "Combine CLAUDE.md, auto memory and searchable session history without loading everything into every conversation."
shortAnswer: "Put stable project rules in CLAUDE.md and let auto memory keep learned preferences. If you also need to find decisions and failed attempts from older sessions, add a local MCP memory server such as MESA Lore."
category: "Coding Agents"
tags: ["claude-code", "agent-memory", "mcp"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-24"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "How to Add Persistent Memory to Claude Code — MESA"
seoDescription: "Use CLAUDE.md, auto memory and a local MCP memory server together so Claude Code can keep rules and find work from earlier sessions."
---

## 1. Choose the right memory layer

Each Claude Code session starts with a fresh context window. Three layers can carry useful information forward, and they solve different problems.

| Layer | Keep here | Do not keep here |
| --- | --- | --- |
| CLAUDE.md | Build commands, conventions and project rules | Long logs or temporary task notes |
| Auto memory | Preferences and corrections Claude learns | Rules your whole team must follow |
| MESA Lore | Searchable past sessions, decisions and handoffs | A replacement for project instructions |

## 2. Put stable rules in CLAUDE.md

Create `CLAUDE.md` in the project root and keep it short. Write what you would otherwise repeat in each session. Anthropic’s documentation suggests keeping each CLAUDE.md under 200 lines.

```text
# Project rules
- Run npm test before finishing a change.
- Use TypeScript for new files.
- API handlers live in src/api/.
```

Run `/context all` in a session and check `Memory files` to confirm that it loaded.

## 3. Check auto memory

Auto memory is on by default in local sessions. Open `/memory` to view it or use its toggle. At session start, Claude Code loads up to the first 200 lines or 25KB of `MEMORY.md`.

> [!NOTE]
> **Keep it useful**
> Correct or remove notes that are outdated. A short, accurate memory is easier for the agent to follow.

## 4. Add searchable session history

Built-in memory is not a search index for everything that happened before. MESA Lore imports past transcripts into one local SQLite file. A new session gets a short index and can search for details when needed.

```text
git clone https://github.com/Yasou13/MESA_Lore.git
cd MESA_Lore
python3 -m venv .venv
.venv/bin/pip install .
.venv/bin/mesa-lore install
.venv/bin/mesa-lore doctor
```

`mesa-lore doctor` reports each connection. On a machine where nothing is configured yet, it prints:

```text
Schema version: v12
DB: ~/.local/share/mesa-lore/lore.db (4096 B), Last ingest: never
Claude Code MCP: missing | hooks: missing
Codex MCP: missing | hooks: missing
Antigravity MCP: missing | Claude Desktop MCP: missing
Warnings: none (0)
```

After a successful install, the Claude Code line changes to `Claude Code MCP: OK | hooks: OK` and `Last ingest` shows a time.

> [!WARNING]
> **Review what will be imported**
> Install imports existing Claude Code, Codex and Antigravity transcripts into the local database. [Exclude private projects](/docs/lore/data-and-privacy/) before you run it.

## 5. Test it in a new session

1. Start a new Claude Code session in the same project.
2. Ask: “Use memory_index and summarize the recent work in this project.”
3. Ask about a real earlier decision: “Search memory for why we changed the login flow.”
4. Open the returned source and confirm that it supports the answer.

If the tools are missing, run `mesa-lore doctor` and see [troubleshooting](/docs/lore/troubleshooting/).

> [!NOTE]
> **What the MESA Lore tests measured**
> From the mesa-lore 0.1.0 test suite and benchmark on Linux: session startup cost 432 tokens (163 for the index, 269 for tool definitions), and search p95 was 84 ms of CPU time on 10,000 chunks in one run. End-to-end token savings when resuming a session have not been measured. Search is lexical, so a query needs words or stems that appear in the transcript.

## What if memory does not work?

| What you see | Fix |
| --- | --- |
| `Claude Code MCP: missing` in `mesa-lore doctor` | Run `mesa-lore install` again and restart Claude Code |
| `Last ingest: never` | Install has not imported a transcript yet. Finish a session, then run `mesa-lore doctor` again |
| The memory tools exist but return nothing useful | Search with words that appear in the earlier session; Lore has no synonym matching |
| CLAUDE.md rules are ignored | Run `/context all` and check that the file is listed under Memory files |

More cases are in [MESA Lore troubleshooting](/docs/lore/troubleshooting/).

## Claude Code memory questions

**Does Claude Code remember previous sessions?**
: Each session starts fresh, but CLAUDE.md and auto memory can carry selected knowledge across sessions. They do not make every past message searchable.

**Should I put everything in CLAUDE.md?**
: No. It loads into each session, so keep it concise and limited to information that is useful every time.

**Does MESA Lore replace CLAUDE.md?**
: No. Keep instructions in CLAUDE.md and use Lore to find earlier work.

**Does this send my transcripts to another service?**
: MESA Lore makes no network calls. Claude Code still sends retrieved memory to its model provider as context.

## Sources

1. [Claude Code Docs · How Claude remembers your project](https://code.claude.com/docs/en/memory)
2. [MESA Lore on GitHub](https://github.com/Yasou13/MESA_Lore)

