## 0.9.5’te kaldırıldı

MESA Core 0.9.5; Kùzu çizge veritabanını, çizge görünümünü yazan worker’ı ve çizge arama kanalını kaldırdı. Arama artık BM25, isteğe bağlı vektör araması, yerleşik hukuk kuralları ve isteğe bağlı yeniden sıralama ile yapılır. Varlıklar ve bilgi kayıtları kaynaklarıyla birlikte SQLite’ta saklanmaya devam eder; asıl kayıtlardan hiçbir şey kaybolmadı.

Çizge 0.9.4’ten beri varsayılan olarak kapalıydı. Benchmark v2 dev bölümündeki Round 21 ölçümünde çizgeyi kapatmak hiçbir dev sorusunu kaybettirmedi. Ölçümler için [MESA çizge deposunu neden kaldırdı](research/why-mesa-removed-its-graph-store/) yazısını okuyun.

## Mevcut bir depoyu yükseltmek

- Yükseltme, eski çizge kayıt satırlarını temizleyen ve geri alınamayan bir migration çalıştırır. Önce depolama kökünün yedeğini alın.
- Diskteki eski `kuzu_db` dosyaları yok sayılır. Yedeğinizi doğruladıktan sonra bunları elle silebilirsiniz.
- `MESA_GRAPH_ENABLED`, `MESA_RRF_GRAPH_WEIGHT` ve `MESA_V4_GRAPH_TIMEOUT_SECONDS` yok sayılır; sunucu başlangıçta her anahtar için bir uyarı yazar. Bunları ortamınızdan kaldırın.
- Arama isteği eski istemciler için `graph_mode` alanını hâlâ kabul eder, ancak değerin etkisi yoktur.

[Yükseltme rehberine](docs/core/migration/) ve [0.9.5 sürüm notlarına](docs/core/release-notes/) bakın.
