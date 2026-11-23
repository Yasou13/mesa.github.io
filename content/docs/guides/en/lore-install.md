## Requirements

- Python 3.10 or newer
- Git
- Linux. macOS is untested and Windows is not supported yet.

The package is not on PyPI yet, so install it from GitHub.

## Install from GitHub

```bash
git clone https://github.com/Yasou13/MESA_Lore.git
cd MESA_Lore
python3 -m venv .venv
.venv/bin/pip install .
.venv/bin/mesa-lore install
.venv/bin/mesa-lore doctor
```

`install` configures supported agents and imports existing history. `doctor` should report `OK` for the agents you use. To run commands without the `.venv/bin/` prefix, activate the environment:

```bash
source .venv/bin/activate
mesa-lore --help
```

## What install changes

| Agent | Files |
| --- | --- |
| Claude Code | `~/.claude.json`, `~/.claude/settings.json` |
| Codex CLI | `~/.codex/config.toml`, `~/.codex/hooks.json` |
| Antigravity | `~/.gemini/antigravity/mcp_config.json` |
| Claude desktop on Linux | `~/.config/Claude/claude_desktop_config.json` |

The first install copies these files to `~/.config/mesa-lore/backup/`. Running install again does not duplicate its hooks.

> [!IMPORTANT]
> Install also imports existing Claude Code, Codex and Antigravity transcripts into the local database. To keep a project out, [exclude it](docs/lore/data-and-privacy/) before you run install.

## Update

Run these commands inside the cloned folder:

```bash
git pull
.venv/bin/pip install .
.venv/bin/mesa-lore install
.venv/bin/mesa-lore doctor
```

The database schema is migrated when MESA Lore opens it.

## Uninstall

```bash
.venv/bin/mesa-lore uninstall
```

This removes MESA Lore’s entries from the agent files. It keeps the backups and the database. To delete stored memory, see [data and privacy](docs/lore/data-and-privacy/).
