## Kimliği doğrulayın ve erişim kapsamını belirleyin

Her uç noktanın istek gövdesi, alanları ve yanıt kodları için [HTTP uç nokta referansına](docs/core/endpoints/) bakın.

Sürümlü hafıza, sağlık ve ölçüm isteklerinde `X-API-Key` gerekir. Dışarıya açık `/health/init`, OpenAPI, Swagger ve ReDoc için ağ erişim kurallarını kurulumda ayrıca belirleyin. Veri kümeleriyle sınırlı bir oturum açmadan önce katalog kaynaklarını yetkili erişim kimliğiyle oluşturun. [SDK örneği](docs/core/examples/) işlemin son durumunu açıkça kontrol eder.

## Kullanılabilen API işlemleri

| Metot | Yol | Amaç |
|---|---|---|
| GET | `/v4/capability` | Kullanılabilir özellikler ve yeniden oluşturma sınırları |
| POST / GET | `/v4/catalog/workspaces` | Çalışma alanı kataloğu |
| POST / GET | `/v4/catalog/datasets` | Veri kümesi kataloğu |
| POST / GET | `/v4/catalog/documents` | Belge kataloğu |
| POST / GET | `/v4/catalog/revisions` | Değiştirilemeyen belge sürümleri |
| POST | `/v4/catalog/source-chunks` | Tam kaynak parçaları |
| POST | `/v4/sessions/start` | Oturumun erişebileceği veri kümelerini belirleme |
| POST | `/v4/memory/insert` | Değişiklik isteğini kalıcı kayda alma (202) |
| POST | `/v4/documents` | Tam belgeyi kayıpsız parçalama, tekrar tespiti ve sürüm takibiyle alma (202) |
| POST | `/v4/memory/search` | Erişim izinlerine göre hibrit arama |
| GET | `/v4/mutations/{mutation_id}` | İşleme durumunu izleme |
| POST | `/v4/mutations/{mutation_id}/replay` | Yetkili yeniden yürütme |
| POST | `/v4/mutations/{mutation_id}/rollback` | Kaynağın sahiplik bağını geri alma |
| GET | `/v4/sessions/{session_id}/context` | Sınırlı kanıt bağlamı |
| POST | `/v4/sessions/{session_id}/end` | Kalıcı oturum sonlandırma |

## Yanıtları nasıl yorumlamalı?

HTTP 202 yalnızca isteğin kabul edildiğini bildirir. Başarılı bir yazma `COMMITTED` durumuna ulaşmalıdır. Arama yanıtı; `rrf_score`, `legal_factor`, `raw_score`, `final_score` ve katkı veren kanalları içerir. Modeller kapalıyken combined çalışma belgeleri kabul eder ve BM25 araması sağlar; VECTOR adımları SKIPPED olur. `503 canonical_processing_unavailable`, combined tüketicinin kullanılamadığını belirtir. Yönetim amaçlı yeniden oluşturma ayrı bir işlemdir ve varsayılan olarak kapalıdır. Tam istek şemaları, diğer yönetim işlemleri ve yetkilendirme ayrıntıları aşağıdaki özgün kaynakta bulunur.

## Tam belge alımı

`POST /v4/documents`; `session_id`, `dataset_id`, `document_id`, `title`, `source_ref`, `content` ve isteğe bağlı `metadata` alır. Yanıt `revision_id`, `revision_number`, `chunk_count`, `mutation_ids` ve `duplicate` içerir. Her mutasyon için COMMITTED bekleyin. Aynı ACTIVE içerik kimliklerini yeniden kullanır; değişen içerik yeni sürüm oluşturur. Sınır 5.000.000 UTF-8 bayttır; boş metin 422 döndürür ve silinmiş belge kimliği yeniden kullanılamaz. `Mesa().add()` bu uç noktayı kullanır.
