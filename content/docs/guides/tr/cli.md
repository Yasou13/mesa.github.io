## Yerel tek kullanıcılı komutlar

v0.9.0 sürümünü kurup `mesa start` çalıştırın. Depolama ve kimlik bilgileri otomatik hazırlanır. Belge komutları için ikinci terminal kullanın.

```bash
mesa add document.txt --source file://document.txt
mesa search "archive"
mesa status
mesa mcp-config
```

`mesa delete DOCUMENT_ID`, anahtarın yetkileri kapsamında belgeyi siler. Kaynak/çıkarım metinleri temizlenir; denetim durumu ve özetler korunur. Başka bir belgenin sahip olduğu ortak metin kalabilir. `mesa mcp-config`, API anahtarı yazdırır: çıktısını özel saklayın. Docker’da bu komutları `docker compose -f docker-compose.v4.yml exec mesa-v4` ile çalıştırarak volume kimlik bilgilerine erişin.

## İleri seviye operatör araçları

`mesa-v4-admin`; anahtarları, rolleri ve açık veri kümesi izinlerini yönetir. `mesa-v4-rebuild`, depolama kökünün tamamını çevrimdışı yeniden oluşturur; `mesa-mcp-control`, gateway onaylarını yönetir. Bunlar yerel belge komutlarından ayrıdır. Mevcut depolamayı işletmeden önce aşağıdaki sürümle eşleşen parametreleri ve kurtarma kurallarını okuyun.
