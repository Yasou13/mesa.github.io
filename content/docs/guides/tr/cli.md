## Yerel tek kullanıcılı komutlar

MESA CLI, `mesa-memory` paketiyle birlikte gelen komut satırı arayüzüdür. Ayrı bir CLI paketi kurmanız gerekmez. v0.9.1 sürümünü kurup yerel sunucuyu başlatın:

v0.9.1 paketi PyPI’da yayımlandı; komut doğrulanan bu sürümü sabitler. [Kurulum ve eklere](docs/core/installation/) bakın.

```bash
pip install mesa-memory==0.9.1
mesa start
```

Depolama ve kimlik bilgileri otomatik hazırlanır. Bu terminali açık tutup belge komutları için ikinci terminal kullanın.

```bash
mesa add document.txt --source file://document.txt
mesa search "archive"
mesa status
mesa mcp-config
```

`mesa delete DOCUMENT_ID`, anahtarın yetkileri kapsamında belgeyi siler. Kaynak/çıkarım metinleri temizlenir; denetim durumu ve özetler korunur. Başka bir belgenin sahip olduğu ortak metin kalabilir. `mesa mcp-config`, API anahtarı yazdırır: çıktısını özel saklayın. Docker’da bu komutları `docker compose -f docker-compose.v4.yml exec mesa-v4` ile çalıştırarak volume kimlik bilgilerine erişin.

## İleri seviye operatör araçları

`mesa-v4-admin`; anahtarları, rolleri ve açık veri kümesi izinlerini yönetir. `mesa-v4-rebuild`, depolama kökünün tamamını çevrimdışı yeniden oluşturur; `mesa-mcp-control`, gateway onaylarını yönetir. Bunlar yerel belge komutlarından ayrıdır. Mevcut depolamayı işletmeden önce aşağıdaki sürümle eşleşen parametreleri ve kurtarma kurallarını okuyun.

## Etkinleşmeyi bekleme ve kaynakla silme

`mesa add` varsayılan olarak ACTIVE durumunu bekler. Etiketli v0.9.1 SDK’sında `Mesa.add` varsayılanı `wait=False` değeridir; ACTIVE durumunu beklemek için açıkça `wait=True` verin. Kabulden hemen sonra dönmek için `mesa add document.txt --source file://document.txt --no-wait` veya `Mesa.add(..., wait=False)` kullanın. Terminal parça hatası, mutation ID, durum ve hata sınıfıyla erken bildirilir. `RETRY_PENDING` terminal durum değildir.

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
