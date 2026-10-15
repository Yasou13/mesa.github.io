## Yetkilendirme sınırı tenant’tır

Kimliği doğrulanmış anahtar principal’a bağlanır; tenant/workspace/dataset OWNER, WRITER ve READER rolleri aşağı miras kalır. Agent kimliği credential değil, bağlamdır. Oturum dataset üyeliğini sabitler. Purge ve rollback, rollere ek olarak açık dataset izinleri ister. Kapsam, retrieval sıralamasından önce kontrol edilir.

## Dağıtım sorumlulukları devam eder

Core, SQLite/LanceDB/Kùzu verisini disk üzerinde şifrelemez. Volume’ları, işletim sistemi izinlerini, yedekleri ve ağı koruyun. Sürümlü memory, health ve metrics çağrıları API key ister; readiness, OpenAPI, Swagger ve Redoc yüzeyleri public sınır taşır. Dağıtım kenarında TLS ve erişim politikası sağlayın.

## Kanıt, güvenilmeyen girdidir

Kaynağa bağlı bağlam bağımsız doğrulanmış gerçek değildir. `UNTRUSTED_MEMORY_EVIDENCE`, sonraki prompt ve araçlarda veri olarak kalmalıdır. İçerik, credential, model çıktısı veya claim token loglamayın. Model uzlaşısı hukuki doğruluğu garanti etmez veya halüsinasyonları ortadan kaldırmaz.
