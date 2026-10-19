## v0.8.1 · 18 Ekim 2026

Bu sürüm, erişim sınırları içinde aramayı, depoların sahiplik denetimini ve hata yönetimini iyileştirir. Canlı kullanım durumu NO-GO’dur. Gerçek sağlayıcı bağlantısı, canlı sistem ölçeğinde kapasite ve 24 saatlik dayanıklılık henüz sertifikalandırılmamıştır. Açıklamalı sürüm etiketi imzasızdır.

## Neler değişti?

- BM25’in belge istatistikleri ve sıralama öncesi denetimleri, izin verilen üst erişim alanı ve veri kümesiyle sınırlandırıldı.
- Arama görünümlerinin tamamlanmasında sahiplik kontrolü eklendi. Onarım başka veri kümelerinin çıktılarını silmez. Kùzu’daki silme ve geri alma önbellekleri tutarlı tutulur.
- Vektör ve sayısal temsil hataları açıkça bildirilir. Ayrılmış `_mesa_` üst veri alanları ile sonlu olmayan RRF ağırlıkları reddedilir.
- Senkron ve asenkron V4 SDK ekleme işlemleri, isteğe bağlı `legal_identity` kabul eder. Varsayılan durum sorgulama aralığı iki saniyedir. `make health`, çalışan API’yi kontrol eder.
- Eski gösterim panelleri ve betikler kaldırıldı. MCP yönetim API’si ve onay komutları korundu.
- Kurulum, komutlar, sorun giderme, yükseltme, ekosistem ve sınırlarla ilgili bilgiler güncel ana rehberlerde toplandı. Veritabanı şeması v0.8.0 ile aynıdır.

## İlgili belgeler

Aşağıdaki değişiklik günlüğü sürüm geçmişini korur. [Kurulum](docs/core/installation/), [API](docs/core/api-reference/), [işletim](docs/core/operations/) ve [mimari kararlar](docs/core/decisions/) belgeleri güncel kaynak yapısına göre düzenlenmiştir.
