## Note kinds

| Kind | Use it for |
| --- | --- |
| `decision` | A choice future sessions should follow |
| `fact` | Stable information about the project |
| `todo` | Work that is still open |
| `failed_attempt` | Something tried that did not work |
| `handoff` | What the next session needs to continue |

Keep notes short and specific. Transcripts are already searchable, so save only what is worth finding directly.

## Replace an older note

When a new `decision` or `fact` looks like it changes an older note, `memory_save` returns a `possibly replaces` hint. It does not change anything by itself. To confirm, save the same text with `replaces`:

```json
{"text": "Switched the Redis session timeout to 7200 seconds", "kind": "decision", "replaces": "n_0560d0d76b33"}
```

The older note stays in history with the state `superseded`.

## Handoffs

A handoff records what was done, what was decided and what comes next. MESA Lore builds a basic handoff from each imported session. In agents with a `Stop` hook, it asks the agent to write its own at turn 8, then at most once every 20 turns. An agent-written handoff takes precedence.

## Projects and scopes

The project is the Git repository name, or the folder name outside a repository. Git worktrees use the main repository’s name.

- Search returns the current project and `global` notes.
- `research:<topic>` notes are returned only when you ask for that scope directly.
- Other projects are not searched.

If a project was renamed, map the old name in `~/.config/mesa-lore/config.toml`:

```toml
[aliases]
old-project-name = "new-project-name"
```

## Stale notes

If a note is saved with `files` and `repo`, MESA Lore records each file’s latest Git commit. When a file changes, results mark the note `[STALE]`. Check it against the current code before relying on it.
