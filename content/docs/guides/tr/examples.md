## Model kapalı çalıştırılabilir giriş

Depodaki V3 örneği için [yerel hızlı başlangıcı](docs/core/getting-started/) izleyin. Yetkili oturum oluşturur; processed ham hafıza kaydını ve kapsamlı sözcüksel sonucu doğrular. V4 çıkarımını veya dış sağlayıcıları çalıştırmaz.

## V4 ekle, bekle, ara

Önkoşullar: modeli etkin combined owner, çalışır embedding sağlayıcısı, hazırlanmış credential/agent izni ve principal’ın yazabildiği mevcut workspace/dataset. Bağımsız her çalıştırmada yeni dataset veya yeni document/revision kimlikleri kullanın. Bu örnek yayımlanmış SDK sözleşmesini izler; üretim veya gerçek sağlayıcı yeterlilik sonucu değildir.

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

## Kaynak sözleşmesini koruyun

İstemci metadata’sından kapsam çıkarmayın. Tam content ve source_ref’i koruyun; tekrarlarda sabit idempotency key kullanın. Bu sürümde SDK insert metodu tipli legal_identity alanını açmaz; doğrulanmış hukuk kataloğu bu alanı sağlamalıysa gözden geçirilmiş HTTP sözleşmesini kullanın. Çok parçalı finalization için [veri alımını](docs/core/concepts-and-ingestion/), grant’ler için [güvenliği](docs/core/security/) izleyin.
