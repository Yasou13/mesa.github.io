## Açık çalışma sınırlarıyla başlayın

`MESA_STORAGE_ROOT`, V4 için `MESA_RUNTIME_PROFILE=combined`, `MESA_LOAD_DOTENV=false` ve bilinçli model/sağlayıcı bayrakları ayarlayın. V3/V4 için farklı root kullanın. Ayar değişikliği mevcut dataset temsilini yeniden yazmaz; embedding kimliği ve boyutu depolanan projeksiyonla eşleşmelidir.

## Doğrulama ve retrieval kontrolleri

`MESA_TIER3_MODE`: 0 yalnız deterministik, 1 tek validator, 2 farklı A/B sağlayıcı-model uzlaşısı. `MESA_RRF_K=60` ve dört `MESA_RRF_*_WEIGHT=1.0` ayarı birleştirmeyi yönetir. `MESA_V4_GRAPH_TIMEOUT_SECONDS=15.0` çizge isteğini sınırlar. `MESA_V4_REBUILD_ENABLED=false`, kalıcı rebuild’i varsayılan olarak kapalı tutar.

## Tam sabitlenmiş ayar referansını kullanın

Aşağıdaki kaynak eki; admission kotaları, readiness eşikleri, sağlayıcı modelleri ve operatör değişkenleri dahil tam v0.8.1 ayar tablosunu korur. Varsayılanlar yapılandırmayı tanımlar; sağlayıcının kurulu veya çalışır olduğunun kanıtı değildir. Credential’ları gözden geçirilmiş bir secret ortamında saklayın.
