## Yerel varsayılanlar ve operatör ayarları

`mesa start`, `~/.mesa/data`, yerel katalog ve `~/.mesa/credentials.json` dosyasını hazırlar; modeller ve dış sağlayıcılar varsayılan olarak kapalıdır. Doğrudan çalışma zamanı başlatıcıları hâlâ açık `MESA_STORAGE_ROOT`, `MESA_RUNTIME_PROFILE=combined`, anahtar ve yetki ayarları ister. `Mesa()` önce açık parametreleri, ardından bağlantı ortam değişkenlerini ve yerel kimlik bilgilerini okur.

## İsteğe bağlı modeller, çizge ve doğrulama

`MESA_LLM_MODEL=provider:model` ve `MESA_EMBEDDING_MODEL=provider:model` kullanın. Örneğin:

```bash
MESA_MODEL_ENABLED=true
MESA_LLM_MODEL=ollama:qwen2.5:7b
MESA_EMBEDDING_MODEL=ollama:bge-m3
```

Yerel ayarları `~/.mesa/.env` dosyasına koyup sunucuyu yeniden başlatın. Seçilen sağlayıcı kurulu ve çalışır olmalıdır. `MESA_EMBEDDING_ENABLED` ve `MESA_EXTRACTION_ENABLED`, model bayrağını izler. İkisi kapalıyken de veri alımı ve BM25 araması çalışır; VECTOR adımları SKIPPED olur. `MESA_GRAPH_ENABLED=false`, Kùzu’nun açılmasını önler, GRAPH adımlarını SKIPPED yapar ve çizgeyi kullanılamayan kaynaklar arasında bildirir. Adım yeniden açılırsa combined başlangıcında eksikler tamamlanır.

`MESA_TIER3_MODE`: 0 kurala dayalı kontroller, 1 tek doğrulayıcı, 2 farklı A/B doğrulayıcıları. `MESA_RRF_K=60`, vektör ağırlığı 8.0 ve BM25/bilgi kaydı/çizge ağırlıkları 1.0 birleştirmeyi yönetir. `MESA_RRF_VECTOR_WEIGHT=1` önceki vektör ağırlığını getirir; sıfır ağırlık kanal katkısını kapatır. Kalıcı yeniden oluşturma varsayılan olarak kapalıdır.

## Sağlayıcı ve depolama sınırları

Yerel Ollama/OpenAI uyumlu uç noktalar `MESA_EXTERNAL_PROVIDER_ENABLED=false` ile çalışabilir; bulut sağlayıcıları true değerini ve anahtarlarını ister. Embedding kimliği model, sürüm, boyut ve normalizasyonu içerir. Etkin vektörler varken kimlik değişimi açık bir yeniden oluşturma gerektirir. Aşağıdaki sabitlenmiş tam ayar tablosuna bakın; yapılandırılmış olmak çalışır olmakla aynı değildir.

## Madde sınırlarını koruyan parçalama ve yeniden deneme

`MESA_CHUNKING=auto|plain` varsayılan olarak `auto` kullanır. Satır başında en az üç Türkçe madde başlığı varsa madde sınırları korunur; uzun parçalar en fazla 512 token olur ve kaynak metin aynen saklanır. `plain`, yeni sürümlerde önceki planı kullanır. Mevcut ACTIVE sürümler değişmez. Yeniden deneme, sunucu yeniden başlatılsa veya ayar değişse bile kabul edilmiş metne uyan planı korur. Kabul edilmiş önek iki farklı plana da uyuyorsa yeni parça eklenmeden HTTP 409 döner.

## İsteğe bağlı BGE yeniden sıralama

Varsayılan `MESA_RERANK_ENABLED=false` değeridir. Açmak için `[ml]` eki gerekir. `MESA_RERANK_MODEL=BAAI/bge-reranker-v2-m3` ve `MESA_RERANK_DEPTH=50` (1–50 aralığı) aşamayı yapılandırır. Model ilk kullanımda yüklenir; ilk sorguya yükleme gecikmesi eklenir. Birleştirmeden sonra izinli adayların tam parça metinleri, ortak arama bağlantısı dışında bir worker thread’de puanlanır. Sonuçlara `rerank_score` eklenir; `rrf_score` ve `final_score` birleştirme değerleri olarak kalır. Eşit puanlarda birleştirme sırası korunur. [DEV kanıtı ve donanım gecikmelerine](docs/core/release-notes/) bakın.
