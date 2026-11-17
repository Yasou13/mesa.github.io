## Sürüm geçişinden önce yedek alın

Sistemi çevrimdışına alıp yedekleyin. V4 tek combined süreciyle çalışır; modeller isteğe bağlıdır. Geri dönüş için sakladığınız yedeği yeni ve boş bir dizine yükleyin; dönüştürülen dizinin sürümünü yerinde düşürmeyin.

## v0.9.3 geçişini hazırlayın

Eski kökün şema ve embedding kimliğini kaydedip v0.9.3’nin kilitlenmiş ortamını kullanın. Aşağıdaki kaynak eki önceki v0.8.0 yükseltmesini anlatır; tarihsel geçiş rehberidir. Yükseltmeden önce yerel kimlik bilgilerini, isteğe bağlı model/çizge ayarlarını ve tam belge sürüm davranışını inceleyin. [İşletim](docs/core/operations/), [API](docs/core/api-reference/) ve [sürüm sınırları](docs/core/limitations/) belgelerine bakın.

## Mevcut v0.9.1 veri alımı indeksleri

Normal başlangıç `e6f7a8b9c0d1` migration’ını uygular. Yükseltmeden önce tek depolama sahibini durdurun ve tam çevrimdışı yedek alın. [Yedek ve geri yükleme](docs/core/operations/) ile [tek sahipli kurtarma](docs/core/rebuild-runbook/) prosedürünü izleyin. Doğrulanmış PyPI paketiyle `pip install --upgrade mesa-memory==0.9.3` kullanarak yükseltin; [kuruluma](docs/core/installation/) bakın. Yeni sürümlerde önceki parçalama planı için `MESA_CHUNKING=plain`, önceki vektör ağırlığı için `MESA_RRF_VECTOR_WEIGHT=1` kullanın. Mevcut ACTIVE sürümler değişmez.

```bash
pip install --upgrade mesa-memory==0.9.3
```

## Yükseltirken değişen varsayılanları inceleyin

`MESA_EXTRACTION_ENABLED`, artık modellerden bağımsız olarak varsayılan `false` değerindedir. Açık uçlu model tabanlı SPO çıkarımını sürdürmek için açıkça `true` yapın. Hukuk kuralları varsayılan `true` değerindedir; `MESA_LEGAL_RULES_ENABLED=false`, kayıtlı kimlik/anlık görüntüleri silmeden yeni hukuki zenginleştirme ve arama eklerini kapatır. Ayar değişikliği mevcut ACTIVE sürümleri yeniden çıkarmaya başlamaz. Tek depolama sahibini yeniden başlatmadan [yapılandırmayı](docs/core/configuration/) ve [yayın sınırlarını](docs/core/limitations/) inceleyin.

## v0.9.3 embedding kimliği ve başlangıç

Varsayılan `MESA_EMBEDDING_MODEL=local:BAAI/bge-m3`, `MESA_EMBEDDING_DIMENSION=1024` ve normalizasyon açıktır. Modeller varsayılan kapalı kalır. Yerel modeli açmadan önce indirin. Önceki varsayılanla oluşturulmuş eski depoda aşağıdaki **iki** ayarı birlikte koruyun veya kimliği değiştirmeden önce yeniden oluşturun:

```bash
MESA_EMBEDDING_MODEL=local:magibu/embeddingmagibu-200m
MESA_EMBEDDING_DIMENSION=768
```

Başlangıç, etkin consolidation döngüsü olmadan `MESA_TIER3_MODE=1/2` ayarını reddeder; çıkarım açık olmalıdır. `.` içeren başlangıç `MESA_API_KEY` değerleri de başlangıçta reddedilir.
