## v0.9.4 · 23 Kasım 2026

[Etiketli changelog](https://github.com/Yasou13/MESA/blob/e30856ec6e7ed9146bb9af992565e864f727b0b9/CHANGELOG.md#094---2026-11-23) sürümü 23 Kasım olarak tarihler. GitHub `v0.9.4` etiketi `e30856ec6e7ed9146bb9af992565e864f727b0b9` commit’ine işaret eder. [PyPI 0.9.4](https://pypi.org/project/mesa-memory/0.9.4/) wheel ve sdist dosyalarının mevcut, geri çekilmemiş ve GitHub sürüm dosyalarıyla aynı hash’e sahip olduğu 23 Kasım 2026’da doğrulandı. Çevrimdışı yedekten sonra `pip install --upgrade mesa-memory==0.9.4` ile yükseltin. Alfa / üretim NO-GO sürer.

## v0.9.4 arama varsayılanları

`MESA_GRAPH_ENABLED` artık varsayılan olarak `false`, `MESA_RRF_ASSERTION_WEIGHT` ise `0.0`’dır. Önceki füzyon için `MESA_GRAPH_ENABLED=true` ve `MESA_RRF_ASSERTION_WEIGHT=1.0` ayarlayın. Kapsamlı BM25, 6 veya daha uzun rakamsız sorgu sözcüklerinde 5 karakterlik önek eşleşmesi kullanır. Eşit skorlu sonuçlar kararlı içerik kimliğiyle ayrılır; aynı derlemden kurulan iki yeni depo aynı sıralamayı üretir.

## v0.9.4 kaldırılanlar ve migration’lar

Yalnızca ileri yönlü `f7a8b9c0d1e2` ve `f8b9c0d1e2f3` migration’ları eski V3 düğüm deposunu ve `routing_telemetry` tablosunu siler. V3 route ve istemcileri, LLM consolidation ve Tier 3 mod 1/2 kaldırıldı; doğrulama kurala dayalı mod 0 ile çalışır, isteğe bağlı bilgi çıkarımı `FactExtractionService` üzerinden yürür. Emekli ayarlar yok sayılır ve her anahtar için başlangıçta bir uyarı yazılır. Yeni kurulumlar FastAPI’yi 0.142, LanceDB’yi 0.35, Kùzu’yu 0.12 ve Pydantic’i 3 altında sınırlar. [Yükseltme rehberine](docs/core/migration/) bakın.

## v0.9.4 ölçümleri ve yayın kontrolleri

Changelog, modeller ve yeniden sıralama kapalıyken paylaşılan Tier M DEV deposunda pasaj Hit@5 değerinin 50/112’den 61/112’ye, MRR’nin 0,3411’den 0,3955’e çıktığını, medyan arama gecikmesinin 361,3 ms’den 233,9 ms’ye indiğini bildirir. 5 MB’lık modelsiz fikstürde uçtan uca hazır olma 249,99 sn’den 172,61 sn’ye indi. Bunlar DEV ve yerel sonuçlardır; ayrılmış test sonucu veya hizmet garantisi değildir. Benchmark v2 DEV bölümünde 0.9.4 varsayılanlarıyla modelsiz ve embedding araması iyileşti; yeniden sıralamalı (T2) pasaj Hit@5 ise 0,9286’dan 0,9107’ye düştü. Ayrıntılar için [0.9.4’te arama kalitesini neyin değiştirdiğine](research/what-improved-search-in-0-9-4/) bakın. [0.9.3 benchmark’ı](benchmark/0.9.3/) 0.9.4’ü anlatmaz; 0.9.4 benchmark’ı henüz yayımlanmadı.

Etiketli commit’te PR CI ve yayın iş akışı başarılı oldu. Etiket sonrası push CI’ında `coverage (3.13)` işinde bir hata kaydedildi: bir hukuki çıkarım zamanlama testi 200 ms sınırını aştı, diğer 1.796 test geçti.

## v0.9.3 · 16 Kasım 2026

[Etiketli changelog](https://github.com/Yasou13/MESA/blob/531209bc45805b478264f6dfa8a9e40a94e345cb/CHANGELOG.md#093---2026-11-16) sürümü 16 Kasım olarak tarihler. GitHub `v0.9.3` etiketi `531209bc45805b478264f6dfa8a9e40a94e345cb` commit’ine işaret eder. [PyPI 0.9.3](https://pypi.org/project/mesa-memory/0.9.3/) wheel ve sdist dosyalarının mevcut ve geri çekilmemiş olması 17 Kasım 2026’da doğrulandı. `pip install --upgrade mesa-memory==0.9.3` ile yükseltin. Alfa / üretim NO-GO sürer.

## v0.9.3 veri alımı ve ayrıştırıcı ölçümleri

Toplu veri alımı, mevcut worker geçişinde SQL ve çizge izdüşümleri ile outbox tamamlamasını gruplar. Changelog, 4.999.000 baytlık belgenin tam hazır olmasını **718,27 saniyeden 245,20 saniyeye (2,93× hızlanma)** indirir: 4.882 mutation’ın tamamı COMMITTED, SQL ve GRAPH COMPLETED, VECTOR SKIPPED; parçalar kayıpsız geri okunmuştur. Round 20 P13-01/P13-02b bu koşulları kaydeder (modeller kapalı, çizge açık). Opus Round 20 kontrolü, son denetlenen `dbf113b` kodunda aynı kalıcı geri okumayla ayrıca **239,35 saniye (3,00×)** raporlar. Bunlar yerel geliştirme ölçümleridir; kapasite veya hizmet garantisi değildir.

Hukuk ayrıştırması, sonuç vermesi mümkün olmayan karar atfı taramalarını atlar ve kanun adı temizliğini bağlı bir madde bulunana kadar erteler. API sınırındaki `TCK/1` girdisinde yerel thread CPU süresinin beş denemedeki en iyi değeri **129,861 ms’den 52,330 ms’ye (2,48×)** düşmüştür; kayıtlı çıktılar ve metin aralıkları aynıdır. İzole 200 ms CI CPU kontrolü yeniden engelleyicidir; 2 saniyelik takılma koruması sürer.

## v0.9.3 embedding varsayılanı ve eski depolar

Compose model varsayılanı dahil yeni varsayılan `local:BAAI/bge-m3`, **1024 boyut** ve normalizasyon açıktır. Modeller **varsayılan kapalı** kalır. Modeli açmadan önce indirin. Eski varsayılanla oluşturulmuş depolar aşağıdaki iki ayarı birlikte korumalı veya embedding kimliğini değiştirmeden önce yeniden oluşturulmalıdır:

```bash
MESA_EMBEDDING_MODEL=local:magibu/embeddingmagibu-200m
MESA_EMBEDDING_DIMENSION=768
```

## v0.9.3 düzeltmeleri ve yayın davranışı

Türk hukuk karşılaştırmaları ve tarih aramaları büyük İ/I harflerini tutarlı işler; özgün metin, konumlar ve kural sürümleri korunur. Kapsamlı FTS sorguları tekilleştirilmiş `ı` → `i` çeşitlerini ekler; `YARGITAY` ve `yargıtay`, `YARGITAY KARARI` metnini bulur. Aşağıdaki ASCII sınırlaması sürer.

MCP oturum başlangıcı, yeni depoda eksik workspace/dataset kayıtlarını oluşturup bir kez yeniden dener; oluşturma başarısızsa özgün oturum başlangıcı hatası korunur. Mode 0 oturum sonlandırması, consolidation döngüsü olmadan ertelenen kayıtları tamamlar. Etkin consolidation döngüsü olmayan `MESA_TIER3_MODE=1/2` ayarı (çıkarım açık olmalıdır) ve `.` içeren başlangıç `MESA_API_KEY` sırları, başlangıçta açık hatayla reddedilir.

Etiketle tetiklenen PyPI yayınları artık derleme ve yayımlamadan önce tam yeniden kullanılabilir CI iş akışını bekler. Changelog bu bağlantının doğrulanmasını ilk canlı etiket çalışmasına bırakır; bu yenilemede o çalışma denetlenmedi.

## v0.9.3 bilinen sorunlar ve ölçüm kapsamı

`/v4/*` ve `/control/*` için dakikalık ve günlük hız sınırları uygulanmaz. ASCII `yargitay`, `Yargıtay` ile hâlâ eşleşmez; indeks tarafında Türkçe normalizasyon ertelenmiştir. Kùzu 0.11.3, çizge sayfalarının sonuna başlatılmamış bellek yazabilir: mantıksal çizge sorgularında hafıza metninin özellik olarak saklanmadığı doğrulansa da ham çizge dosyaları sürecin işlediği metin parçalarını içerebilir. Çizge dizinini SQLite gibi hassas kabul edin. [Güncel sınırlara](docs/core/limitations/) bakın.

0.9.3 için yeni erişim benchmark’ı çalıştırılmadı. [Round 18 sonuçları](benchmark/0.9.2/) 0.9.2 olarak kalır; aşağıdaki tarihsel demolar ve DEV ölçümleri kendi sürümlerini korur. Önceki 11,6 saniyelik arama ölçümü tarihsel 0.9.2 kanıtıdır; 0.9.3 bilinen sorunlar bölümünde listelenmez ve burada yeniden ölçülmedi.

## v0.9.2 · 6 Kasım 2026

[Resmî yayın](https://github.com/Yasou13/MESA/releases/tag/v0.9.2), `8cd2cfe1df5356e73b3bef83ae640850fd54c798` commit’ine sabittir. [PyPI 0.9.2](https://pypi.org/project/mesa-memory/0.9.2/) wheel ve sdist yayını, geri çekilmemiş olması ve yayınla eşleşen SHA256 özetleri 7 Kasım 2026’da doğrulandı. Python >=3.11 gerekir; `pip install --upgrade mesa-memory==0.9.2` ile yükseltin. V4 HTTP yolları uyumludur. Alfa / üretim NO-GO sürer.

## Hukuki çıkarım ve arama

Yeni parçalar; citation, decision_ref, date, amount, duration ve outcome türlerinde sürümlü kural öğeleri saklar. `retrieval_provenance.legal_items`, özgün parçaya göre konumlarla `{version, items}` döndürür. Bunlar modelin çıkardığı özne–yüklem–nesne (SPO) kayıtlarından ayrıdır ve birleştirme skoruna eklenmez. Purge bu öğelerin kaynak alıntılarını da siler.

İzinli başlıklar ve ilk parça kanun başlıkları, `K.` kısaltması dâhil kapsam önbellekli kanun adları öğretir. Tam kanun/madde veya kararın kendi esas/karar numarası eşleşmesi, belge sırasıyla en fazla üç sonucu başa alabilir. Karar kimliği, sıfırıncı parçanın ilk 300 karakterinde başlayan referansı gerektirir; sonraki alıntılar kimlik sayılmaz. Diğer sonuçlar birleşik veya yeniden sıralanmış düzenini korur. Yalnızca AYM/mahkeme adı geçmesi artık Anayasa sıralamasını tetiklemez.

## Değişen varsayılanlar ve kabul

`MESA_LEGAL_RULES_ENABLED=true`; kimlikleri, anlık görüntüleri ve hukuki aramayı açar. `false`; yeni otomatik hukuki kimlik/öğeleri, atıf çözümlemeyi, tam eşleşme önceliğini, hukuk katsayılarını ve çizge atıf ayrıştırmasını kapatır; kalıcı kimlikleri/anlık görüntüleri silmeden sonuç kopyalarındaki hukuki ekleri gizler. Genel arama çalışır. `MESA_EXTRACTION_ENABLED=false`, artık `MESA_MODEL_ENABLED` değerinden bağımsızdır; açık `true` SPO çıkarımını açar. Embedding varsayılanı model bayrağını izlemeyi sürdürür.

Belge kabulü, tam parçalama planını yeniden üretmeden kuyruk kapasitesini kısa süre bekler. `add_document(deadline=600)`, HTTP isteğinde kalan belge süresini kullanır. Süren kuyruk baskısı yine `503 queue_over_capacity` döndürebilir; aynı gövdeyi yeniden gönderin. HTTP 202 hazır olma değil, kabul anlamındadır.

## Güvenlik ve ölçülen sınırlar

Sınırlı ayrıştırma, worker thread ve işbirlikli çalışma; ölçülen kural çıkarımı, atıf, kapsam ve yoğun puanlama örneklerinde `/health` yanıt verebilirliğini düzeltir. 0.9.1’i de etkileyen istek yolu duraklamaları için yükseltme önerilir. Bu, yoğun sorguların hızlandığını kanıtlamaz: 1.000 adaylı arama yaklaşık 11,6 saniye sürmüştür. Modeller kapalı, çizge açıkken 4.999.000 baytlık belge yaklaşık yedi dakikada hazır olmuştur. Bunlar belirli geliştirme ölçümleridir; hizmet garantisi değildir.

Tam belge gizli bilgi taraması ve uç Unicode normalizasyonu saniye altı duraklamalar yaratabilir. UUID eşitlikleri ayrı doldurulmuş depolarda sıralamayı değiştirebilir; aynı depodaki korunan girdiler deterministiktir. Nesne olmayan belge isteklerinde INFO düzeyli 422 ayrıntı metni farklılığı sürer; durum, kod, konum ve OpenAPI uyumludur. Resmî yayın ayrıca Python 3.13 birleşim sonrası ayrıştırıcı testinin CI’da 200 ms sınırını aştığını kaydeder; hız düzeltmesi bu sürümün dışında, 0.9.3 için planlanmıştır.

## Yayın doğrulaması ve kanıt

Resmî yayın; 2.037 yerel test ve ayrı 10 MCP testi, PR kapsam işlerinin her birinde 2.032 geçen test raporlar (3.11: %88,09; 3.13: %88,07). [PR #143](https://github.com/Yasou13/MESA/pull/143), derleme kanıtı, SBOM ve köken raporları yayın sayfasındadır. Bunlar yayına atfedilen sonuçlardır; web sitesi çalışmasında yeniden yürütülmüş Core sertifikasyonu değildir. Bağımsız QA, Law ve E2E kanıtları kendi tarih ve kaynaklarına bağlı kalır. Tarihsel v0.9.0 demo kayıtları ve aşağıdaki v0.9.1 DEV ölçümleri tarihsel kalır.

## Önceki sürüm v0.9.1 · 1 Kasım 2026

[GitHub sürümü](https://github.com/Yasou13/MESA/releases/tag/v0.9.1), `e2f984d4ad97c01782a347e29e44808e5a16dad3` commit’iyle yayımlandı. [PyPI 0.9.1 paketi](https://pypi.org/project/mesa-memory/0.9.1/) de yayımlandı ve doğrulandı; [kurulum rehberini](docs/core/installation/) izleyin. Python >=3.11 gerekir. Alfa / üretim NO-GO sürer.

## Neler değişti

Round 13 dört kapsamlık önbellek, veri alımı indeksleri, event loop dışında scrypt ve CLI etkinleşme beklemesi ekler. Round 14 `MESA_CHUNKING=auto|plain`, ilk kullanımda yüklenen isteğe bağlı BGE yeniden sıralama, 8.0 vektör ağırlığı, erken terminal parça hatası ve kaynakla silme getirir. OpenAI/Ollama SDK’ları temel pakete taşınır. Diğer RRF ağırlıkları 1.0, `k=60` kalır; sıfır ağırlık kanal katkısını kapatır. Mevcut ACTIVE sürümler ve V4 yol/istek sözleşmeleri uyumludur.

CLI varsayılan olarak ACTIVE bekler; `--no-wait` kabulden sonra döner. Etiketli `Mesa.add` SDK imzasında varsayılan hâlâ `wait=False` değeridir; beklemek için `wait=True` verin. `RETRY_PENDING` terminal değildir. [CLI](docs/core/cli-reference/), [SDK](docs/core/examples/), [yapılandırma](docs/core/configuration/) ve [yükseltme](docs/core/migration/) rehberlerine bakın.

## Round 14 DEV kanıtı

1 Kasım 2026 ölçümü: sabitlenmiş Türkçe Tier M korpusu, 141 belge, 5.041 parça; 101 DEV sorusu (85 yanıtlanabilir, 16 yanıtsız). Madde sınırlarını koruyan parçalama açık, bilgi çıkarımı kapalı, embedding ve çizge açık. Test bölümüne erişilmedi. Pasaj hit@5 ve MRR 85 yanıtlanabilir soruda; gecikme 101 sorunun tamamında ölçüldü. Arama limiti ve yeniden sıralama derinliği 50, reranker max_length 1024. Diğer kanal ağırlıkları 1.

| Vektör ağırlığı | Yeniden sıralama | Pasaj hit@5 | Pasaj MRR | Arama p50 (s) | Arama p95 (s) |
| --- | --- | --- | --- | --- | --- |
| 1 | Kapalı | 0.5176 | 0.3953 | 1.2693 | 2.0035 |
| 1 | Açık | 0.7412 | 0.6816 | 1.9548 | 2.5736 |
| 2 | Kapalı | 0.5765 | 0.4565 | 1.2708 | 1.9640 |
| 2 | Açık | 0.7529 | 0.7055 | 1.9569 | 2.6364 |
| 4 | Kapalı | 0.6588 | 0.5152 | 1.2836 | 1.9469 |
| 4 | Açık | 0.7765 | 0.7069 | 1.9279 | 2.6100 |
| 8 | Kapalı | 0.6706 | 0.5663 | 1.2849 | 1.9115 |
| 8 | Açık | 0.7647 | 0.6973 | 1.9161 | 2.5360 |

Yeniden sıralama varsayılan olarak kapalı olduğu için seçim reranker kapalı MRR’ye dayanır: ağırlık 8, yuvarlanmamış MRR’yi 0.171008 artırarak 0.02 koşulunu aşar. Bu taramada yeniden sıralama açıkken en yüksek MRR ağırlık 4’tedir. Sonuçlar bu korpusa özel geliştirme ölçümleridir; test bölümü kanıtı veya üretim sertifikasyonu değildir.

## Ayrı CPU/GPU donanım ölçümü

Bu ayrı ölçümde vektör ağırlığı 1’dir; yukarıdaki ağırlık 8 satırıyla birleştirilmemelidir.

| Donanım / yeniden sıralama | Pasaj hit@5 | Pasaj MRR | Arama p50 (s) | Arama p95 (s) |
| --- | --- | --- | --- | --- |
| GPU / Kapalı | 0.5176 | 0.3953 | 1.2531 | 1.9953 |
| GPU / Açık | 0.7412 | 0.6816 | 1.9627 | 2.6029 |
| CPU / Açık | 0.7412 | 0.6816 | 26.9158 | 33.8756 |

Embedding: `BAAI/bge-m3`, 1024 boyut, normalize. Reranker: `BAAI/bge-reranker-v2-m3`. Donanım: Colab A100-SXM4 40GB ve Intel Xeon 2.20GHz, sekiz CPU thread’i. CPU satırında iki model de nicemleme olmadan CPU’ya taşınır. Modeller çalışma zamanı başlamadan edinildi. Python 3.13.16, Torch 2.11.0+cu130, sentence-transformers 5.7.0, transformers 5.21.0, NumPy 2.5.4, LanceDB 0.41.0, Kùzu 0.11.3 kullanıldı; bunlar Colab’da kurulu paketlerdir, ML lockfile sürümlerinin birebir aynısı değildir.

İstekler yetkilendirilmiş HTTP yolundan ASGI ile, TCP olmadan geçer. Ölçümler sıralı çalışır, veri dizinini/önbelleği yeniden kullanır ve her ölçümde ilk ısınma sorgusu dışarıda bırakılır. Gecikme embedding, kapsamlı arama ve isteğe bağlı yeniden sıralamayı içerir. Kontrollü donanım hızlanma iddiası değildir. Arama kilidi değişikliğinden sonra aynı veri dizini kullanılmış, 101 DEV sorusunun ilk 50 sonuç sözlüğü değişmemiştir.

## Round 13 yerel DAO kontrolü

Sentetik yerel kapsam önbelleği mikroölçümü: 3.500 parça, 20 sorgu; DAO p50 100.813 → 20.142 ms, p95 155.789 → 46.862 ms. HTTP, kimlik doğrulama ve model süresini içermez; tüm sistemin beş kat hızlandığını göstermez. Veri alımı indeks süreleri yalnız bookkeeping işlemlerini ölçer.

## Kaynaklar ve korunan örnek

Ana sayfa demosu ve hızlı başlangıç alındıları Core v0.9.0 kayıtları olarak etiketli kalır. OpenAPI snapshot’ı v0.9.1’den yenilendi; mevcut V4 yol/istek sözleşmeleri uyumludur. Model revision’ları, özetler, ısınma ve yuvarlanmamış ölçümler için sabit [arama benchmark’ı](https://github.com/Yasou13/MESA/blob/e2f984d4ad97c01782a347e29e44808e5a16dad3/docs/retrieval-and-graph.md#round-14-dev-benchmark) ile [ölçüm verisine](https://github.com/Yasou13/MESA/blob/e2f984d4ad97c01782a347e29e44808e5a16dad3/docs/benchmarks/round14_dev.json) bakın. Üretim NO-GO sürer.
