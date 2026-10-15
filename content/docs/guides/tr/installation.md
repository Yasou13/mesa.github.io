## Bilinçli seçilen iki çalışma profili

V3 uyumluluk profili, model kapalı sözcüksel çekirdektir; Compose dosyası API ve worker rollerini ayırır. V4 kanonik işleme, modeli etkin tek combined storage owner gerektirir. Aynı fiziksel root’u iki yazıcıya bağlamayın veya V3 ile V4 arasında paylaşmayın.

## Yalnızca gereken ek paketleri kurun

Kilitli development extra yerel test ortamını kurar. Yerel model çalıştırmak için `ml`, seçilen sağlayıcının SDK’sı gerekiyorsa `adapters` ekleyin. V3 hızlı başlangıcı çalıştırmak için model paketlerini yüklemeyin. V4 yazmalarından önce [sağlayıcıları yapılandırın](docs/core/embedding-providers/).

## Dağıtım sınırını koruyun

Başlatmadan önce credential ve ACL’leri hazırlayın. Uygulamaya ait açık bir storage root ve `MESA_LOAD_DOTENV=false` ayarlayın. Süreç başlatıcısı içeride tüm arayüzleri dinler; loopback yayınlama, TLS ve kimlik doğrulamalı ters proxy dağıtımın sorumluluğudur. Başarılı boot, üretim yeterliliği sayılmaz.
