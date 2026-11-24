## 0.9.5 neler ekliyor?

MESA 0.9.5, bir belgeyi belirli bir anda olduğu hâliyle aramanızı sağlar. Her sürümü aynı `document_id` altında, saat dilimi içeren bir `metadata.valid_from` ile yükleyin, ardından `valid_at` ile arayın. Sürümler herhangi bir sırayla gelebilir, aralıklar yarı açıktır ve sonuçlar `revision_number`, `valid_from` ve `valid_to` taşır. Bkz. [sürümlü belgeler](docs/core/concepts-and-ingestion/#guide-surumlu-belgeler).

## Arama, depolama ve yükseltme

Tarihsiz ve tüm veri kümesini kapsayan aramalar, SQLite’taki veri kümesine ait kalıcı bir BM25 indeksini kullanır. LanceDB 0.41.0’a kilitlendi ve vektör araması kapsama göre önceden süzülür. Yarıda kalan tam belge yüklemeleri kayıtlı parçalardan devam eder. Çizge deposu kaldırıldı; yükseltmeden önce [çizge deposu kaldırıldı](docs/core/graph/) notunu ve [yükseltme rehberini](docs/core/migration/) okuyun. Özgün sürüm notları aşağıda yer alır; ölçümler ve sınırlar [bakımı yapılan sürüm notlarındadır](docs/core/release-notes/).
