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

`MESA_TIER3_MODE`: 0 kurala dayalı kontroller, 1 tek doğrulayıcı, 2 farklı A/B doğrulayıcıları. `MESA_RRF_K=60` ve varsayılanı 1.0 olan kanal ağırlıkları birleştirmeyi yönetir. Kalıcı yeniden oluşturma varsayılan olarak kapalıdır.

## Sağlayıcı ve depolama sınırları

Yerel Ollama/OpenAI uyumlu uç noktalar `MESA_EXTERNAL_PROVIDER_ENABLED=false` ile çalışabilir; bulut sağlayıcıları true değerini ve anahtarlarını ister. Embedding kimliği model, sürüm, boyut ve normalizasyonu içerir. Etkin vektörler varken kimlik değişimi açık bir yeniden oluşturma gerektirir. Aşağıdaki sabitlenmiş tam ayar tablosuna bakın; yapılandırılmış olmak çalışır olmakla aynı değildir.
