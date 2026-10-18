## v0.8.1 · 18 Ekim 2026

Yayımlanmış kaynak sürümü kapsamlı retrieval, depolama sahipliği ve hata yönetimini güçlendirir. Üretim yeterliliği NO-GO; gerçek sağlayıcı entegrasyonu, üretim boyutunda kapasite ve 24 saatlik dayanıklılık sertifikalı değildir. Açıklamalı tag imzasızdır.

## Neler değişti

- BM25 corpus istatistikleri ve sıralama öncesi denetim sorguları yetkili tenant/dataset kapsamını kullanır.
- Projeksiyon tamamlanması sahiplik/fencing kontrolü yapar; onarım diğer dataset artefaktlarını silmez. Kùzu silme ve rollback önbellekleri tutarlı tutulur.
- Vektör ve embedding hataları açıktır; ayrılmış `_mesa_` metadata ve sonlu olmayan RRF ağırlıkları reddedilir.
- Senkron ve asenkron V4 SDK ekleme isteğe bağlı `legal_identity` kabul eder; varsayılan durum sorgulama iki saniyedir. `make health` çalışan API’yi kontrol eder.
- Dashboard/showcase ve eski script’ler kaldırıldı. MCP control API ve onay CLI’ı korunur.
- Kurulum, CLI, sorun giderme, yükseltme, ekosistem ve sınırlar güncel ana rehberlerde birleştirildi. Şema head’i v0.8.0 ile aynıdır.

## Güncel kaynakları okuyun

Aşağıdaki değişiklik günlüğü sürüm geçmişini korur. [Kurulum](docs/core/installation/), [API ve CLI](docs/core/api-reference/), [operasyon](docs/core/operations/) ve [mimari kararlar](docs/core/decisions/) yeni kaynak ağacını yansıtır.
