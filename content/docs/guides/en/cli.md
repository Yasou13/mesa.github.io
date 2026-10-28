## Local single-user commands

Install v0.9.0, then run `mesa start`. Storage and credentials are provisioned automatically. Use a second terminal for document commands.

```bash
mesa add document.txt --source file://document.txt
mesa search "archive"
mesa status
mesa mcp-config
```

`mesa delete DOCUMENT_ID` purges a document under the key’s permissions. Purge erases source/extracted text while retaining audit state and hashes; another owning document can retain shared text. `mesa mcp-config` prints an API key: store its output privately. In Docker, run these commands with `docker compose -f docker-compose.v4.yml exec mesa-v4` so they can read volume credentials.

## Advanced operator tools

`mesa-v4-admin` manages keys, roles and explicit dataset permissions. `mesa-v4-rebuild` performs offline full-storage-root rebuilds; `mesa-mcp-control` manages gateway approvals. These are separate from local document commands. Read the version-matched flags and recovery rules below before operating an existing storage root.
