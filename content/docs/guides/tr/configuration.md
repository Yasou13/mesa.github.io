## Yerel varsayılanlar ve operatör ayarları

`mesa start`, `~/.mesa/data`, yerel katalog ve `~/.mesa/credentials.json` dosyasını hazırlar; modeller ve dış sağlayıcılar varsayılan olarak kapalıdır. Doğrudan çalışma zamanı başlatıcıları hâlâ açık `MESA_STORAGE_ROOT`, `MESA_RUNTIME_PROFILE=combined`, anahtar ve yetki ayarları ister. `Mesa()` önce açık parametreleri, ardından bağlantı ortam değişkenlerini ve yerel kimlik bilgilerini okur.

## İsteğe bağlı modeller ve doğrulama

`MESA_LLM_MODEL=provider:model` ve `MESA_EMBEDDING_MODEL=provider:model` kullanın. Örneğin:

```bash
MESA_MODEL_ENABLED=true
MESA_LLM_MODEL=ollama:qwen2.5:7b
MESA_EMBEDDING_MODEL=ollama:bge-m3
```

Yerel ayarları `~/.mesa/.env` dosyasına koyup sunucuyu yeniden başlatın. Seçilen sağlayıcı kurulu ve çalışır olmalıdır. `MESA_EMBEDDING_ENABLED`, model bayrağını izler. Modeller açık olsa da varsayılan `MESA_EXTRACTION_ENABLED=false` değeridir; açık uçlu SPO çıkarımı için açıkça `true` yapın. İkisi kapalıyken de veri alımı ve BM25 araması çalışır; VECTOR adımları SKIPPED olur ve eksik olarak bildirilir. Embedding sonradan açılırsa atlanan vektörler combined başlangıcında tamamlanır.

Doğrulama kurala dayalı mod 0 ile çalışır. Kaldırılan özelliklere ait ayarlar yok sayılır ve sunucu başlangıçta her emekli anahtar için bir uyarı yazar; 0.9.5’te buna eski çizge anahtarıyla birlikte `MESA_RRF_GRAPH_WEIGHT` ve `MESA_V4_GRAPH_TIMEOUT_SECONDS` de dâhildir (bkz. [çizge deposu kaldırıldı](docs/core/graph/)). `MESA_RRF_K=60`, vektör ağırlığı 8.0, BM25 ağırlığı 1.0 ve `MESA_RRF_ASSERTION_WEIGHT=0.0` birleştirmeyi yönetir; sıfır ağırlık kanal katkısını kapatır.

## Sağlayıcı ve depolama sınırları

Yerel Ollama/OpenAI uyumlu uç noktalar `MESA_EXTERNAL_PROVIDER_ENABLED=false` ile çalışabilir; bulut sağlayıcıları true değerini ve anahtarlarını ister. Embedding kimliği model, sürüm, boyut ve normalizasyonu içerir. Etkin vektörler varken kimlik değişimi açık bir yeniden oluşturma gerektirir. Aşağıdaki sabitlenmiş tam ayar tablosuna bakın; yapılandırılmış olmak çalışır olmakla aynı değildir.

## Madde sınırlarını koruyan parçalama ve yeniden deneme

`MESA_CHUNKING=auto|plain` varsayılan olarak `auto` kullanır. Satır başında en az üç Türkçe madde başlığı varsa madde sınırları korunur; uzun parçalar en fazla 512 token olur ve kaynak metin aynen saklanır. `plain`, yeni sürümlerde önceki planı kullanır. Mevcut ACTIVE sürümler değişmez. Yeniden deneme, sunucu yeniden başlatılsa veya ayar değişse bile kabul edilmiş metne uyan planı korur. Kabul edilmiş önek iki farklı plana da uyuyorsa yeni parça eklenmeden HTTP 409 döner.

## İsteğe bağlı BGE yeniden sıralama

Varsayılan `MESA_RERANK_ENABLED=false` değeridir. Açmak için `[ml]` eki gerekir. `MESA_RERANK_MODEL=BAAI/bge-reranker-v2-m3` ve `MESA_RERANK_DEPTH=50` (1–50 aralığı) aşamayı yapılandırır. Model ilk kullanımda yüklenir; ilk sorguya yükleme gecikmesi eklenir. Birleştirmeden sonra izinli adayların tam parça metinleri, ortak arama bağlantısı dışında bir worker thread’de puanlanır. Sonuçlara `rerank_score` eklenir; `rrf_score` ve `final_score` birleştirme değerleri olarak kalır. Eşit puanlarda birleştirme sırası korunur. [DEV kanıtı ve donanım gecikmelerine](docs/core/release-notes/) bakın.

## Türk hukuk kuralları ve açık SPO çıkarımı

`MESA_LEGAL_RULES_ENABLED=true`, modellerden bağımsızdır. Otomatik planlarda normal maddeler, `metadata.law_number` veya ilk 3.000 karakterdeki desteklenen başlıktan kanun numarası alır; devam parçaları madde kimliğini korur. Önsözler, GEÇİCİ/EK maddeler ve plain planları otomatik kimlik almaz. Türlü kimlik API’si 3–5 basamaklı kanun numaralarını kabul eder; tutarsız numara/kod çiftleri ve bilinmeyen adlar reddedilir.

Yeni parçalar sürümlü hukuki öğeleri SPO kayıtlarından ayrı saklar. `false`; yeni kimlik/öğeleri, hukuki atıf/sıralama/tam eşleşmeyi kapatır, kalıcı verileri silmeden sonuç kopyalarındaki hukuki ekleri gizler. Genel sözcük ve vektör araması çalışır. Model tabanlı SPO kayıtları için `MESA_EXTRACTION_ENABLED=true` değerini açıkça ayarlayın; yalnızca modeli açmak artık çıkarımı açmaz.

## Embedding kimliği ve başlangıç

Varsayılan `MESA_EMBEDDING_MODEL=local:BAAI/bge-m3`, `MESA_EMBEDDING_DIMENSION=1024` ve normalizasyon açıktır. Modeller varsayılan kapalı kalır. Yerel modeli açmadan önce indirin. Önceki varsayılanla oluşturulmuş eski depoda aşağıdaki **iki** ayarı birlikte koruyun veya kimliği değiştirmeden önce yeniden oluşturun:

```bash
MESA_EMBEDDING_MODEL=local:magibu/embeddingmagibu-200m
MESA_EMBEDDING_DIMENSION=768
```

`.` içeren başlangıç `MESA_API_KEY` değerleri de başlangıçta reddedilir.
