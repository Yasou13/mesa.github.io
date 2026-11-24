## Sürüm geçişinden önce yedek alın

Sistemi çevrimdışına alıp yedekleyin. V4 tek combined süreciyle çalışır; modeller isteğe bağlıdır. V4 öncesi depolama biçimindeki veri ayrı bir kök gerektirir. Geri dönüş için sakladığınız yedeği yeni ve boş bir dizine yükleyin; dönüştürülen dizinin sürümünü yerinde düşürmeyin.

## v0.9.5 geçişini hazırlayın

Eski kökün şema ve embedding kimliğini kaydedip v0.9.5’in kilitlenmiş ortamını kullanın. Aşağıdaki kaynak eki önceki v0.8.0 yükseltmesini anlatır; tarihsel geçiş rehberidir. Yükseltmeden önce yerel kimlik bilgilerini, isteğe bağlı model ayarlarını ve tam belge sürüm davranışını inceleyin. [İşletim](docs/core/operations/), [API](docs/core/api-reference/) ve [sürüm sınırları](docs/core/limitations/) belgelerine bakın.

## v0.9.4’ten v0.9.5’e yükseltme

Önce tek depolama sahibini durdurun ve tam çevrimdışı yedek alın. Ardından paketi yükseltin:

```bash
pip install --upgrade mesa-memory==0.9.5
```

- Başlangıç, yalnızca ileri yönlü `f9c0d1e2f3a4` migration’ını uygular. Bu migration eski çizge satırlarını görünüm ve çıktı kayıt tablolarından siler; görünümleri tamamlanmış değişiklikleri `COMMITTED` olarak işaretler. Geri dönmek için v0.9.4’ü yükseltme öncesi depo anlık görüntüsüyle çalıştırın.
- Çizge deposu kaldırıldı. Eski `kuzu_db` dosyaları yok sayılır; yedeğinizi doğruladıktan sonra elle silin. `MESA_GRAPH_ENABLED`, `MESA_RRF_GRAPH_WEIGHT` ve `MESA_V4_GRAPH_TIMEOUT_SECONDS` yok sayılır; her anahtar için başlangıçta bir uyarı yazılır. Bkz. [çizge deposu kaldırıldı](docs/core/graph/).
- Kilit dosyası LanceDB 0.41.0’ı sabitler (paket aralığı 0.42’nin altında). Başlangıçta MESA, eski vektör tablolarına kapsam anahtarlarını SQLite’tan ekler ve kayıtlı embedding’leri korur.
- Belgelere tarih vermek isteğe bağlıdır. Tarihsiz belgeler eskisi gibi çalışır; belirli bir andaki hâliyle arama için sürümleri [sürümlü belgeler](docs/core/concepts-and-ingestion/#guide-surumlu-belgeler) bölümünde anlatıldığı gibi `metadata.valid_from` ile yükleyin.
- Kùzu artık bağımlılık olmadığından paket Python 3.14’e de kurulur.

## Önceki yükseltmeler

v0.9.3’ten v0.9.4’e yükseltme, yalnızca ileri yönlü `f7a8b9c0d1e2` ve `f8b9c0d1e2f3` migration’larını uyguladı; bunlar V4 öncesinden kalan tabloları ve yönlendirme ölçüm tablosunu sildi. Changelog, mevcut 0.9.3 V4 depolarının veri kaybı olmadan geçtiğini belirtir. Aynı sürüm varsayılan bilgi kaydı füzyon ağırlığını 0.0 yaptı, eski route ve istemcileri kaldırdı (`MesaV4Client` veya `AsyncMesaV4Client` kullanın) ve 5 karakterlik önekli BM25 ile kararlı eşitlik kuralını getirdi; bu yüzden arama sırası değişebilir. Uygulamanızın dayandığı sıralamaları yeniden kontrol edin. Emekli edilen tüm ayarlar [0.9.4 sürüm notlarında](docs/core/release-notes/) listelenir; her biri başlangıçta bir uyarıyla yok sayılır.

## Mevcut v0.9.1 veri alımı indeksleri

Normal başlangıç `e6f7a8b9c0d1` migration’ını uygular. Yükseltmeden önce tek depolama sahibini durdurun ve tam çevrimdışı yedek alın. [Yedek ve geri yükleme](docs/core/operations/) ile [tek sahipli kurtarma](docs/core/rebuild-runbook/) prosedürünü izleyin. Doğrulanmış PyPI paketiyle `pip install --upgrade mesa-memory==0.9.5` kullanarak yükseltin; [kuruluma](docs/core/installation/) bakın. Yeni sürümlerde önceki parçalama planı için `MESA_CHUNKING=plain`, önceki vektör ağırlığı için `MESA_RRF_VECTOR_WEIGHT=1` kullanın. Mevcut ACTIVE sürümler değişmez.

## Yükseltirken değişen varsayılanları inceleyin

`MESA_EXTRACTION_ENABLED`, modellerden bağımsız olarak varsayılan `false` değerindedir. Açık uçlu model tabanlı SPO çıkarımını sürdürmek için açıkça `true` yapın. Hukuk kuralları varsayılan `true` değerindedir; `MESA_LEGAL_RULES_ENABLED=false`, kayıtlı kimlik/anlık görüntüleri silmeden yeni hukuki zenginleştirme ve arama eklerini kapatır. Ayar değişikliği mevcut ACTIVE sürümleri yeniden çıkarmaya başlamaz. Tek depolama sahibini yeniden başlatmadan [yapılandırmayı](docs/core/configuration/) ve [yayın sınırlarını](docs/core/limitations/) inceleyin.

## Embedding kimliği ve başlangıç

Varsayılan `MESA_EMBEDDING_MODEL=local:BAAI/bge-m3`, `MESA_EMBEDDING_DIMENSION=1024` ve normalizasyon açıktır. Modeller varsayılan kapalı kalır. Yerel modeli açmadan önce indirin. Önceki varsayılanla oluşturulmuş eski depoda aşağıdaki **iki** ayarı birlikte koruyun veya kimliği değiştirmeden önce yeniden oluşturun:

```bash
MESA_EMBEDDING_MODEL=local:magibu/embeddingmagibu-200m
MESA_EMBEDDING_DIMENSION=768
```

`.` içeren başlangıç `MESA_API_KEY` değerleri başlangıçta reddedilir.
