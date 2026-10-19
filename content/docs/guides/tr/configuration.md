## Veri dizinini ve çalışma profilini açıkça belirleyin

`MESA_STORAGE_ROOT` değerini, V4 için `MESA_RUNTIME_PROFILE=combined` ayarını ve `MESA_LOAD_DOTENV=false` seçeneğini belirleyin. Model ve dış sağlayıcı erişimini ihtiyacınıza göre açın. V3 ve V4 için ayrı veri dizinleri kullanın. Bir ayarı değiştirmek, önceden saklanan vektörleri dönüştürmez; model kimliği ve boyutlar mevcut arama görünümüyle uyumlu olmalıdır.

## Doğrulama ve arama ayarları

`MESA_TIER3_MODE=0` yalnızca kurala dayalı kontrolleri kullanır. `1` bir modelle doğrulama ekler; `2` ise farklı iki sağlayıcı/model çiftinin aynı sonuca ulaşmasını ister. Sıralamaların birleştirilmesini `MESA_RRF_K=60` ve dört `MESA_RRF_*_WEIGHT=1.0` ayarı yönetir. `MESA_V4_GRAPH_TIMEOUT_SECONDS=15.0`, çizge isteğinin süresini sınırlar. Kalıcı yeniden oluşturma işlemi `MESA_V4_REBUILD_ENABLED=false` ile varsayılan olarak kapalıdır.

## Tüm seçenekler özgün kaynakta

Aşağıdaki ekte kabul kotaları, hazır olma eşikleri, sağlayıcı modelleri ve yönetim değişkenleri dâhil v0.8.1’in bütün ayarları bulunur. Bir varsayılanın tanımlı olması, ilgili sağlayıcının kurulu veya çalışır olduğunu göstermez. Erişim bilgilerini güvenli bir gizli bilgi yönetim ortamında saklayın.
