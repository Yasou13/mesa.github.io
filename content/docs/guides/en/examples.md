## Start locally or use the explicit V4 client

Follow [local quickstart](docs/core/getting-started/) for automatic credentials and models-off BM25 ingestion/search. Use `Mesa()` for local document workflows; the explicit `MesaV4Client` below exposes session and mutation control. Models are optional for extraction and semantic search.

## V4 insert, wait, search

Prerequisites: a combined owner, provisioned credential/agent permission and an existing workspace/dataset writable by the principal. Use a new dataset or fresh document/revision IDs for each independent run. This snippet follows the released SDK contract; it is not a production or real-provider qualification result.

```python
import os
from mesa_client import MesaV4Client

with MesaV4Client("http://127.0.0.1:18080", api_key=os.environ["MESA_API_KEY"]) as client:
    session = client.start_session(
        tenant_id="docs-tenant", workspace_id="docs-workspace",
        dataset_ids=["docs-dataset"], agent_id="docs-agent",
    )
    accepted = client.insert(
        session_id=session["session_id"], dataset_id="docs-dataset",
        document_id="archive-hours", revision_id="revision-1", chunk_id="chunk-1",
        title="Archive opening hours", source_ref="demo://archive-hours",
        content="The archive opens at nine on weekdays.",
    )
    terminal = client.wait_until_committed(accepted["mutation_id"])
    if terminal["state"] != "COMMITTED":
        raise RuntimeError(terminal["state"])
    results = client.search(session_id=session["session_id"], query="When does the archive open?")
    print(results)
```

## Preserve the source contract

Never infer scope from caller metadata. Keep exact content and source_ref; use stable idempotency keys for retries. Both synchronous and asynchronous V4 insert methods retain optional `legal_identity`. Default mutation polling is two seconds. End the server session separately from closing the HTTP client; on timeout inspect mutation status before retrying. Follow [ingestion](docs/core/concepts-and-ingestion/) for multi-chunk finalization and [security](docs/core/security/) for grants.

## Wait for activation and delete by source

`mesa add` waits for ACTIVE by default. In the tagged v0.9.2 SDK, `Mesa.add` defaults to `wait=False`; pass `wait=True` explicitly to wait for ACTIVE. Use `mesa add document.txt --source file://document.txt --no-wait` or `Mesa.add(..., wait=False)` to return after admission. A terminal chunk failure is reported early with mutation ID, state and error class. `RETRY_PENDING` is not terminal.

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
