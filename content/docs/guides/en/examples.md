## A runnable model-disabled introduction

Follow [local quickstart](docs/core/getting-started/) for the checked-in V3 example. It provisions an authorized session and verifies a processed raw-memory record and scoped lexical result. It does not exercise V4 extraction or external providers.

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

Never infer scope from caller metadata. Keep exact content and source_ref; use stable idempotency keys for retries. The SDK insert method does not expose typed legal_identity in this version; use the reviewed HTTP contract when a verified legal catalog must supply that field. Follow [ingestion](docs/core/concepts-and-ingestion/) for multi-chunk finalization and [security](docs/core/security/) for grants.
