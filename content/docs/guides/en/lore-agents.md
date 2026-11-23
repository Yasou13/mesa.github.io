## Claude Code

`mesa-lore install` adds the MCP server to `~/.claude.json` and the `SessionStart`, `Stop` and `SessionEnd` hooks to `~/.claude/settings.json`. Start a new session after installing. It receives a short project index, and the agent can use the four memory tools.

MESA Lore works alongside `CLAUDE.md` and auto memory. Keep instructions in those files and use Lore to search earlier sessions.

## Codex CLI

Install adds the MCP server to `~/.codex/config.toml` and the same hooks to `~/.codex/hooks.json`. Open Codex and approve them with `/hooks`. Until you approve them, the memory tools can work, but automatic capture and the session-start index do not.

## Antigravity

Install adds the MCP server to `~/.gemini/antigravity/mcp_config.json`. Antigravity has no MESA Lore hooks, so transcripts are scanned when the server starts or when you run `mesa-lore ingest-pending`. Ask the agent to call `memory_index` when you want the project overview. Set `ANTIGRAVITY_BRAIN_DIR` if its data is in another folder.

## Claude desktop

Install adds the MCP server to the Claude desktop configuration, so the memory tools are available. There is no automatic capture. Chats on claude.ai and in the desktop chat tab are not imported.

## Check the connection

Run `mesa-lore doctor`. It reports MCP and hook status for each agent, the database path, the last import and any transcript warnings. See [troubleshooting](docs/lore/troubleshooting/) if an agent shows `missing`.
