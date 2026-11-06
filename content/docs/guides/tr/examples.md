## Yerelde başlayın veya açık V4 istemcisini kullanın

Otomatik kimlik bilgileri ve modeller kapalıyken BM25 veri alımı/araması için [yerel hızlı başlangıcı](docs/core/getting-started/) izleyin. Yerel belge işlemlerinde `Mesa()` kullanın; aşağıdaki `MesaV4Client` oturum ve mutasyon denetimini açıkça gösterir. Bilgi çıkarımı ve anlamsal arama için modeller isteğe bağlıdır.

## V4 ile ekleyin, tamamlanmasını bekleyin ve arayın

Önkoşullar: combined süreci, erişim anahtarı, ajan izni ve erişim kimliğinin yazabildiği mevcut çalışma alanı/veri kümesi. Birbirinden bağımsız denemelerde yeni veri kümesi veya yeni belge/sürüm kimlikleri kullanın. Örnek, yayımlanan SDK’nın kullanımını gösterir; canlı kullanım veya gerçek sağlayıcı doğrulaması değildir.

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

## Kaynağı ve işlem kimliğini koruyun

Erişim kapsamını istemcinin gönderdiği ek bilgilerden çıkarmayın. Kaynağın tam metnini ve `source_ref` değerini koruyun. Tekrar denemelerde aynı yineleme anahtarını kullanın. v0.9.2’de senkron ve asenkron V4 ekleme yöntemleri isteğe bağlı `legal_identity` kabul eder; durum varsayılan olarak iki saniyede bir sorgulanır. HTTP istemcisini kapatmakla sunucudaki oturumu bitirmek farklı işlemlerdir. Zaman aşımından sonra yeniden denemeden önce işlemin durumuna bakın. Birden fazla parçadan oluşan sürümler için [veri alımı](docs/core/concepts-and-ingestion/), izinler için [güvenlik](docs/core/security/) rehberini okuyun.

## Etkinleşmeyi bekleme ve kaynakla silme

`mesa add` varsayılan olarak ACTIVE durumunu bekler. Etiketli v0.9.2 SDK’sında `Mesa.add` varsayılanı `wait=False` değeridir; ACTIVE durumunu beklemek için açıkça `wait=True` verin. Kabulden hemen sonra dönmek için `mesa add document.txt --source file://document.txt --no-wait` veya `Mesa.add(..., wait=False)` kullanın. Terminal parça hatası, mutation ID, durum ve hata sınıfıyla erken bildirilir. `RETRY_PENDING` terminal durum değildir.

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

Kimlikle silme korunur. Silme yine sahiplik kapsamını ve purge izinlerini gerektirir.
