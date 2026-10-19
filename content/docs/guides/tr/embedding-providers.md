## Belge ve sorgu temsilleri uyumlu olmalı

Bilgi kayıtlarının vektörleri ile sorgu vektörleri aynı sağlayıcı/model kimliğini ve boyutları kullanmalıdır. Belgelenen yerel varsayılan Magibu, 768 boyutludur; dış sağlayıcıdaki text-embedding-3-small ise 1536 boyut kullanır. Ayarı değiştirmek eski verileri dönüştürmez. Model değiştirirken belgelenen kimlik kurallarına göre arama görünümünü ve indeksi yeniden oluşturun.

## Ayarın bulunması, sağlayıcının çalıştığını göstermez

`GET /v4/capability`, o anda kullanılabilen özellikleri bildirir. Özel bir sayısal temsil sağlayıcısı, ilk başarılı çağrıdan önce çalışır kabul edilmez. Beklenen vektör veya sağlayıcı hatalarında açık bir 503 yanıtı verilir; sistem sessizce başka modele geçmez. V4 ile asıl kayıtlara yazmak için modelin etkin olduğu combined süreci ve bilgi çıkarımı bağımlılıkları hazır olmalıdır.

## Dış erişimi ayrıca değerlendirin

`MESA_EXTERNAL_PROVIDER_ENABLED=false`, asıl işleme hattındaki dış sağlayıcı çağrılarını sınırlar. Bu ayar tek başına sistemin tamamen ağdan yalıtıldığını veya hiç ücret doğurmayacağını garanti etmez. Model indirmeleri ve başka süreçlerin ağ erişimi ayrıca değerlendirilmelidir. Burada gerçek sağlayıcıların hızına, kalitesine veya token maliyetine ilişkin güncel bir ölçüm sunulmuyor.
