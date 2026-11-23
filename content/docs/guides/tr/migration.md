## Sürüm geçişinden önce yedek alın

Sistemi çevrimdışına alıp yedekleyin. V4 tek combined süreciyle çalışır; modeller isteğe bağlıdır. Geri dönüş için sakladığınız yedeği yeni ve boş bir dizine yükleyin; dönüştürülen dizinin sürümünü yerinde düşürmeyin.

## v0.9.4 geçişini hazırlayın

Eski kökün şema ve embedding kimliğini kaydedip v0.9.4’ün kilitlenmiş ortamını kullanın. Aşağıdaki kaynak eki önceki v0.8.0 yükseltmesini anlatır; tarihsel geçiş rehberidir. Yükseltmeden önce yerel kimlik bilgilerini, isteğe bağlı model/çizge ayarlarını ve tam belge sürüm davranışını inceleyin. [İşletim](docs/core/operations/), [API](docs/core/api-reference/) ve [sürüm sınırları](docs/core/limitations/) belgelerine bakın.

## v0.9.3’ten v0.9.4’e yükseltme

Önce tek depolama sahibini durdurun ve tam çevrimdışı yedek alın. Başlangıç, yalnızca ileri yönlü iki migration uygular: `f7a8b9c0d1e2` eski V3 `nodes`, `nodes_fts`, `lancedb_wal`, `purge_journal` ve `system_config` tablolarını, `f8b9c0d1e2f3` ise `routing_telemetry` tablosunu siler. Changelog, mevcut 0.9.3 V4 depolarının veri kaybı olmadan geçtiğini belirtir. Geri dönmek için v0.9.3’ü yükseltme öncesi depo anlık görüntüsüyle çalıştırın.

```bash
pip install --upgrade mesa-memory==0.9.4
```

- Çizge artık kapalı, bilgi kaydı füzyon ağırlığı 0.0’dır. Önceki füzyon varsayılanları için `MESA_RRF_ASSERTION_WEIGHT=1.0` ve `MESA_GRAPH_ENABLED=true` ayarlayın. Çizge açıldığında atlanan GRAPH görünümleri başlangıçta tamamlanır.
- V3 route ve istemcileri kaldırıldı. `MesaV4Client` veya `AsyncMesaV4Client` kullanın.
- LLM consolidation ve Tier 3 mod 1/2 kaldırıldı. `MESA_TIER3_*`, `MESA_USE_V4`, `CONSOLIDATION_*` ve changelog’daki diğer emekli ayarlar yok sayılır; her anahtar için başlangıçta bir uyarı yazılır.
- 5 karakterlik önekli BM25 ve kararlı eşitlik kuralı nedeniyle arama sırası değişebilir. Uygulamanızın dayandığı sıralamaları yeniden kontrol edin.

## Mevcut v0.9.1 veri alımı indeksleri

Normal başlangıç `e6f7a8b9c0d1` migration’ını uygular. Yükseltmeden önce tek depolama sahibini durdurun ve tam çevrimdışı yedek alın. [Yedek ve geri yükleme](docs/core/operations/) ile [tek sahipli kurtarma](docs/core/rebuild-runbook/) prosedürünü izleyin. Doğrulanmış PyPI paketiyle `pip install --upgrade mesa-memory==0.9.4` kullanarak yükseltin; [kuruluma](docs/core/installation/) bakın. Yeni sürümlerde önceki parçalama planı için `MESA_CHUNKING=plain`, önceki vektör ağırlığı için `MESA_RRF_VECTOR_WEIGHT=1` kullanın. Mevcut ACTIVE sürümler değişmez.

```bash
pip install --upgrade mesa-memory==0.9.4
```

## Yükseltirken değişen varsayılanları inceleyin

`MESA_EXTRACTION_ENABLED`, artık modellerden bağımsız olarak varsayılan `false` değerindedir. Açık uçlu model tabanlı SPO çıkarımını sürdürmek için açıkça `true` yapın. Hukuk kuralları varsayılan `true` değerindedir; `MESA_LEGAL_RULES_ENABLED=false`, kayıtlı kimlik/anlık görüntüleri silmeden yeni hukuki zenginleştirme ve arama eklerini kapatır. Ayar değişikliği mevcut ACTIVE sürümleri yeniden çıkarmaya başlamaz. Tek depolama sahibini yeniden başlatmadan [yapılandırmayı](docs/core/configuration/) ve [yayın sınırlarını](docs/core/limitations/) inceleyin.

## v0.9.3 embedding kimliği ve başlangıç

Varsayılan `MESA_EMBEDDING_MODEL=local:BAAI/bge-m3`, `MESA_EMBEDDING_DIMENSION=1024` ve normalizasyon açıktır. Modeller varsayılan kapalı kalır. Yerel modeli açmadan önce indirin. Önceki varsayılanla oluşturulmuş eski depoda aşağıdaki **iki** ayarı birlikte koruyun veya kimliği değiştirmeden önce yeniden oluşturun:

```bash
MESA_EMBEDDING_MODEL=local:magibu/embeddingmagibu-200m
MESA_EMBEDDING_DIMENSION=768
```

v0.9.4, Tier 3 mod 1/2’yi kaldırır ve `MESA_TIER3_MODE` ayarını uyarıyla yok sayar. `.` içeren başlangıç `MESA_API_KEY` değerleri de başlangıçta reddedilir.
