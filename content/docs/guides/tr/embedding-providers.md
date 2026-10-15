## Temsil uyumlu kalmalıdır

Assertion vektörleri ve sorgu embedding’leri aynı sağlayıcı/model kimliğini ve boyutu paylaşmalıdır. Belgelenmiş yerel varsayılan Magibu 768 boyutludur; dış text-embedding-3-small 1536 ister. Ayar değişikliği yerinde temsil migration’ı değildir. Belgelenmiş kimlik kurallarıyla rebuild/reindex yapın.

## Yapılandırılmış olmak, çalışır olmak değildir

`GET /v4/capability`, çalışma anındaki kullanılabilirliği ayırır. Özel embedding sağlayıcısı başarılı embedding çağrısına kadar çalışır sayılmaz. Beklenen vektör/sağlayıcı hatası açık 503 döndürür; çalışma zamanı sessizce model değiştirmez. Kanonik V4 yazmaları, modeli etkin combined consumer ve çıkarım bağımlılıkları ister.

## Sağlayıcı erişimini bilinçli sınırlayın

`MESA_EXTERNAL_PROVIDER_ENABLED=false`, kanonik dış çağrıları sınırlar. Tam air-gap veya sıfır maliyet garantisi değildir. Model indirmeleri, yerel hazırlık ve diğer süreç ağ erişimleri ayrı konulardır. Burada güncel gerçek sağlayıcı hız, kalite veya token maliyeti benchmark’ı iddia edilmez.
