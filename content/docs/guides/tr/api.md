## Kimliği doğrulayın ve kapsamı bağlayın

Versioned memory, health ve metrics istekleri `X-API-Key` ister. Açık `/health/init`, OpenAPI, Swagger ve ReDoc için dağıtım ağ politikası gerekir. Dataset kapsamlı oturumu başlatmadan önce yetkili principal ile katalog kaynaklarını oluşturun. [SDK örneği](docs/core/examples/) terminal durumu açıkça kontrol eder.

## Uygulanan endpoint aileleri

| Metot | Yol | Amaç |
|---|---|---|
| GET | `/v4/capability` | Çalışır özellikler ve rebuild sınırları |
| POST / GET | `/v4/catalog/workspaces` | Workspace kataloğu |
| POST / GET | `/v4/catalog/datasets` | Dataset kataloğu |
| POST / GET | `/v4/catalog/documents` | Belge kataloğu |
| POST / GET | `/v4/catalog/revisions` | Değişmez revizyonlar |
| POST | `/v4/catalog/source-chunks` | Tam kaynak parçaları |
| POST | `/v4/sessions/start` | Yetkili dataset kapsamını sabitleme |
| POST | `/v4/memory/insert` | Kalıcı mutasyon kabulü (202) |
| POST | `/v4/memory/search` | Kapsamlı hibrit retrieval |
| GET | `/v4/mutations/{mutation_id}` | İşleme durumunu izleme |
| POST | `/v4/mutations/{mutation_id}/replay` | Yetkili tekrar |
| POST | `/v4/mutations/{mutation_id}/rollback` | Kaynak sahipli rollback |
| GET | `/v4/sessions/{session_id}/context` | Sınırlı kanıt bağlamı |
| POST | `/v4/sessions/{session_id}/end` | Kalıcı oturum sonlandırma |

## Yanıt ve hata sözleşmeleri

202, kabul anlamına gelir. Başarılı yazma `COMMITTED` durumuna ulaşmalıdır. Arama; `rrf_score`, `legal_factor`, `raw_score`, `final_score` ve katkı veren kanalları açığa çıkarır. Model kapalı kanonik yazma `503 canonical_processing_unavailable` döndürür; beklenen sağlayıcı hataları açık 503 yanıtlarıdır. Yönetim rebuild’i ayrıdır ve varsayılan kapalıdır. Sabitlenmiş ek; istek şemalarını, diğer yönetim endpoint’lerini ve yetkilendirme ayrıntılarını içerir.
