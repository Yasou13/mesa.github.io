## Check startup, then provision models

Follow [local quickstart](docs/core/getting-started/) for model-disabled startup and health checks. First V4 ingestion requires configured extraction and embedding providers; V3 raw-memory processing also requires embeddings. The complete `examples/v4_quickstart.py` provisions its catalog, prints source references and ends the session.

## V4 insert, wait, search

Prerequisites: a model-enabled combined owner, operational embedding provider, provisioned credential/agent permission and an existing workspace/dataset writable by the principal. Use a new dataset or fresh document/revision IDs for each independent run. This snippet follows the released SDK contract; it is not a production or real-provider qualification result.

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

Never infer scope from caller metadata. Keep exact content and source_ref; use stable idempotency keys for retries. Both synchronous and asynchronous V4 insert methods accept optional `legal_identity` in v0.8.1. Default mutation polling is two seconds. End the server session separately from closing the HTTP client; on timeout inspect mutation status before retrying. Follow [ingestion](docs/core/concepts-and-ingestion/) for multi-chunk finalization and [security](docs/core/security/) for grants.
