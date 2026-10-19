## Erişim sınırını üst alan belirler

Kimliği doğrulanan anahtar, bir erişim kimliğine bağlanır. Üst erişim alanı (tenant), çalışma alanı ve veri kümesi için OWNER, WRITER ve READER rolleri tanımlanır; bu roller alt alanlara geçer. Ajan kimliği bir erişim anahtarı değildir, isteğin bağlamını belirtir. Oturumun veri kümesi listesi sabittir. Kalıcı silme ve geri alma için role ek olarak açık veri kümesi izni gerekir. Erişim kapsamı arama sıralamasından önce denetlenir.

## Kurulumun güvenliği de sizin sorumluluğunuzdadır

Core; SQLite, LanceDB ve Kùzu verilerini diskte kendisi şifrelemez. Diskleri, işletim sistemi izinlerini, yedekleri ve ağı ayrıca koruyun. Sürümlü hafıza, sağlık ve ölçüm çağrıları API anahtarı ister. Hazır olma, OpenAPI, Swagger ve ReDoc arayüzleri dışarıya açık olabilir; kurulum sınırında TLS ve erişim kuralları uygulayın.

## Kanıt metnini güvenilir talimat saymayın

Kaynağı belli bir kayıt, bağımsız olarak doğrulanmış gerçek anlamına gelmez. `UNTRUSTED_MEMORY_EVIDENCE`, modele ve araçlara aktarılırken veri olarak kalmalı; talimat yetkisi kazanmamalıdır. İçeriği, erişim bilgilerini, model çıktısını veya iş sahipliği anahtarlarını günlüklere yazmayın. İki modelin aynı fikirde olması hukuki doğruluğu garanti etmez veya hatalı yanıtları tamamen önlemez.
