## Başlangıcı kontrol edin, ardından modelleri hazırlayın

Model kapalı başlangıç ve sağlık kontrolleri için [yerel hızlı başlangıcı](docs/core/getting-started/) izleyin. İlk V4 veri alımı hazırlanmış çıkarım ve embedding sağlayıcıları gerektirir; V3 ham hafıza işleme de embedding ister. Tam `examples/v4_quickstart.py` örneği kataloğunu hazırlar, kaynak referanslarını yazdırır ve oturumu bitirir.

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

İstemci metadata’sından kapsam çıkarmayın. Tam content ve source_ref’i koruyun; tekrarlarda sabit idempotency key kullanın. v0.8.1’de senkron ve asenkron V4 insert metodları isteğe bağlı `legal_identity` kabul eder. Varsayılan mutasyon sorgulama aralığı iki saniyedir. Sunucu oturumunu HTTP istemcisini kapatmaktan ayrı sonlandırın; timeout sonrasında tekrardan önce mutasyon durumunu inceleyin. Çok parçalı finalization için [veri alımını](docs/core/concepts-and-ingestion/), grant’ler için [güvenliği](docs/core/security/) izleyin.
