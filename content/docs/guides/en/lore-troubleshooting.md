## Start with doctor

```bash
mesa-lore doctor
```

It shows the schema version, database, last import, MCP and hook status for each agent, and transcript warnings.

## Common problems

| Problem | What to check |
| --- | --- |
| `mesa-lore: command not found` | Run `source .venv/bin/activate` in the cloned folder, or use `.venv/bin/mesa-lore` |
| An agent shows `missing` | Run `mesa-lore install` again, then restart the agent |
| Codex does not capture sessions | Approve the hooks with `/hooks` in Codex |
| The latest session is not found | Start a new session or run `mesa-lore ingest-pending` |
| Search returns no match | Use words from the original text, or check `--project` |
| Results come from the wrong project | Check the Git repository name, or add an alias |
| A note shows `[STALE]` | A linked file changed; verify the note against the current code |

## Search limits

Search is lexical and has no embeddings or synonym understanding, so a query needs words or stems present in the text. Recall is incomplete. Check important answers against the returned source.

## Platform status

| Platform | Status |
| --- | --- |
| Linux | Tested |
| macOS | Untested |
| Windows | Not supported yet |

## Measured results

At v0.1.0 on Linux, 200 tests and all 31 required benchmark categories pass. Keyword search finds 8 of 9 benchmark questions and Turkish search finds 3 of 3. Session startup costs 432 tokens: 163 for the index and 269 for tool definitions. Search p95 was 47–86 ms on 10,000 chunks across benchmark runs.

End-to-end token savings when resuming a session have not been measured yet. A separate private evaluation on the author’s transcripts answered 51.7% of 120 questions correctly with an 800-token memory budget. It used LLMs for answers and grading, and it cannot be reproduced from the repository.
