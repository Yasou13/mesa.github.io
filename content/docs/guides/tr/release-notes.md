## v0.9.0 · 28 Ekim 2026

GitHub sürümü ve PyPI üzerindeki `mesa-memory` 0.9.0 paketi yayımlandı. Sürüm etiketi `7062fafe2cff8442eb84d1da60df164099526c8e` commit’ine bağlıdır. Python >=3.11 gerekir. Üretim yeterliliği NO-GO durumundadır.

## Neler değişti?

- Yerel CLI: `start`, `add`, `search`, `delete`, `status` ve `mcp-config`; otomatik yerel depolama ve özel kimlik bilgileri.
- Üst seviye `Mesa()` SDK: elle oturum hazırlamadan yerel varsayılanlar, tam belge alımı ve kanıt bağlamı.
- `POST /v4/documents`: kayıpsız ve belirli kurallara dayalı parçalama, tekrar tespiti ve sürüm takibi. Modeller kapalıyken belgeler saklanır ve BM25 araması yapılır.
- `MESA_GRAPH_ENABLED=false`: Kùzu açılmadan çalışma; GRAPH adımları SKIPPED olur ve çizge yeniden açıldığında tamamlanabilir.
- Birleşik model ayarları: `MESA_LLM_MODEL` ve `MESA_EMBEDDING_MODEL`, `provider:model` biçimini kullanır. Yerel Docker, `mesa start` çalıştırır ve kimlik bilgilerini volume içinde korur.
- Belge silme, denetim kimlikleri ve özetleri korunurken kaynak/çıkarım metinlerini temizler; başka bir belgenin hâlâ sahip olduğu ortak metin korunur.
- Yeniden deneme aralıkları, başarısız işlerin tekrar kuyruğa alınması, SDK başlangıç 503 denemeleri, eksik ek paket mesajları ve Türkçe atıfları koruyan parçalama geliştirildi.

## Güncel kaynakları okuyun

[Yerel hızlı başlangıç](docs/core/getting-started/), [CLI](docs/core/cli-reference/), [HTTP uç noktaları](docs/core/endpoints/) ve [yapılandırma](docs/core/configuration/) ile başlayın. Aşağıdaki özgün değişiklik günlüğü önceki sürümleri tarihsel bağlamında korur. Paket yayını tek başına yeni üretim sertifikası veya performans ölçümü sağlamaz.
