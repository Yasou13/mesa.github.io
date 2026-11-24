## Erişim sınırını üst alan belirler

Kimliği doğrulanan anahtar, bir erişim kimliğine bağlanır. Üst erişim alanı (tenant), çalışma alanı ve veri kümesi için OWNER, WRITER ve READER rolleri tanımlanır; bu roller alt alanlara geçer. Ajan kimliği bir erişim anahtarı değildir, isteğin bağlamını belirtir. Oturumun veri kümesi listesi sabittir. Kalıcı silme ve geri alma için role ek olarak açık veri kümesi izni gerekir. Erişim kapsamı arama sıralamasından önce denetlenir.

## Kurulumun güvenliği de sizin sorumluluğunuzdadır

Core; SQLite ve LanceDB verilerini diskte kendisi şifrelemez. Diskleri, işletim sistemi izinlerini, yedekleri ve ağı ayrıca koruyun. Sürümlü hafıza, sağlık ve ölçüm çağrıları API anahtarı ister. Hazır olma, OpenAPI, Swagger ve ReDoc arayüzleri dışarıya açık olabilir; kurulum sınırında TLS ve erişim kuralları uygulayın.

## Kanıt metnini güvenilir talimat saymayın

Kaynağı belli bir kayıt, bağımsız olarak doğrulanmış gerçek anlamına gelmez. `UNTRUSTED_MEMORY_EVIDENCE`, modele ve araçlara aktarılırken veri olarak kalmalı; talimat yetkisi kazanmamalıdır. İçeriği, erişim bilgilerini, model çıktısını veya iş sahipliği anahtarlarını günlüklere yazmayın. İki modelin aynı fikirde olması hukuki doğruluğu garanti etmez veya hatalı yanıtları tamamen önlemez.

## v0.9.5 ile çalışma

Silme, denetim kimlikleri ve özetler korunurken belgenin sahip olduğu kaynak ve çıkarım metnini temizler. Başka bir belgenin sahip olduğu ortak bilgi/varlık metni kalır. Yerel kimlik bilgilerini ve üretilen MCP yapılandırmasını koruyun.

## v0.9.5’te sınırlı istek işi

Hukuki kural çıkarımı, atıf çözümleme, kapsam hazırlama ve yoğun token puanlama; kullanıcı metni üzerinde yapılan işi sınırlar ve thread yürütmesini paylaşır. Böylece ölçülen yoğun örnekler sürerken sağlık istekleri çalışabilir. v0.9.5’te `/v4/*` ve `/control/*` için dakikalık ve günlük hız sınırları uygulanmaz. Önceki sürümlerden yükseltilen depolarda eski çizge veritabanı dizini kalmış olabilir; 0.9.5 bu dizini açmaz, ancak silene kadar hassas veri gibi koruyun. [Güncel sınırlara](docs/core/limitations/) bakın. Kanun adları, kimlikler ve tam eşleşme önceliği izinli kurum/veri kümesi/ajan/zaman kapsamında çözülür.
