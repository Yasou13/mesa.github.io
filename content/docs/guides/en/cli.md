## Local single-user commands

MESA CLI is the command-line interface included with the `mesa-memory` package. No separate CLI package is needed. Install v0.9.1 and start the local server:

The v0.9.1 package is published on PyPI; the command pins that verified version. See [installation and extras](docs/core/installation/#guide-package-index-and-optional-extras).

```bash
pip install mesa-memory==0.9.1
mesa start
```

Storage and credentials are provisioned automatically. Keep this terminal running and use a second terminal for document commands.

```bash
mesa add document.txt --source file://document.txt
mesa search "archive"
mesa status
mesa mcp-config
```

`mesa delete DOCUMENT_ID` purges a document under the key’s permissions. Purge erases source/extracted text while retaining audit state and hashes; another owning document can retain shared text. `mesa mcp-config` prints an API key: store its output privately. In Docker, run these commands with `docker compose -f docker-compose.v4.yml exec mesa-v4` so they can read volume credentials.

## Advanced operator tools

`mesa-v4-admin` manages keys, roles and explicit dataset permissions. `mesa-v4-rebuild` performs offline full-storage-root rebuilds; `mesa-mcp-control` manages gateway approvals. These are separate from local document commands. Read the version-matched flags and recovery rules below before operating an existing storage root.

## Wait for activation and delete by source

`mesa add` waits for ACTIVE by default. In the tagged v0.9.1 SDK, `Mesa.add` defaults to `wait=False`; pass `wait=True` explicitly to wait for ACTIVE. Use `mesa add document.txt --source file://document.txt --no-wait` or `Mesa.add(..., wait=False)` to return after admission. A terminal chunk failure is reported early with mutation ID, state and error class. `RETRY_PENDING` is not terminal.

```bash
mesa delete --source file://document.txt
mesa delete DOCUMENT_ID
```

```python
from mesa_client import Mesa

with Mesa() as mesa:
    receipt = mesa.add("The archive opens at nine.", source="file://document.txt", wait=True)
    admitted = mesa.add("Another document.", source="file://other.txt", wait=False)
    mesa.delete(source="file://document.txt")
```

ID-based deletion is retained. Deletion still requires the owning scope and purge permissions.
