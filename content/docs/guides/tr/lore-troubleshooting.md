## doctor ile başlayın

```bash
mesa-lore doctor
```

Komut şema sürümünü, veritabanını, son içe aktarmayı, her ajanın MCP ve hook durumunu ve döküm uyarılarını gösterir.

## Sık karşılaşılan sorunlar

| Sorun | Kontrol edilecek |
| --- | --- |
| `mesa-lore: command not found` | Klonlanan klasörde `source .venv/bin/activate` çalıştırın veya `.venv/bin/mesa-lore` kullanın |
| Bir ajan `missing` görünüyor | `mesa-lore install` komutunu yeniden çalıştırıp ajanı yeniden başlatın |
| Codex oturumları yakalamıyor | Hook’ları Codex’te `/hooks` ile onaylayın |
| Son oturum bulunamıyor | Yeni oturum başlatın veya `mesa-lore ingest-pending` çalıştırın |
| Arama sonuç döndürmüyor | Özgün metindeki kelimeleri kullanın veya `--project` değerini kontrol edin |
| Sonuçlar yanlış projeden geliyor | Git deposunun adını kontrol edin veya takma ad ekleyin |
| Not `[STALE]` görünüyor | Bağlı bir dosya değişti; notu güncel kodla karşılaştırın |

## Arama sınırları

Arama sözcük tabanlıdır; embedding veya eş anlamlı anlayışı yoktur. Bu yüzden sorgunun metinde geçen kelimeleri veya kökleri içermesi gerekir. Her sonucu bulamayabilir. Önemli yanıtları döndürülen kaynakla kontrol edin.

## Platform durumu

| Platform | Durum |
| --- | --- |
| Linux | Test edildi |
| macOS | Test edilmedi |
| Windows | Henüz desteklenmiyor |

## Ölçülen sonuçlar

v0.1.0 sürümünde Linux üzerinde 200 test ve zorunlu 31 benchmark kategorisinin tamamı geçiyor. Sözcük araması 9 benchmark sorusunun 8’ini, Türkçe arama 3 sorunun 3’ünü buluyor. Oturum başlangıcı 432 token harcıyor: dizin için 163, araç tanımları için 269. 10.000 parçada arama p95 değeri benchmark çalıştırmalarında 47–86 ms oldu.

Oturuma dönerken uçtan uca token tasarrufu henüz ölçülmedi. Geliştiricinin kendi dökümleriyle yapılan ayrı ve özel bir değerlendirmede, 800 token hafıza bütçesiyle 120 sorunun %51,7’si doğru yanıtlandı. Yanıtlama ve puanlamada LLM kullanıldı; bu değerlendirme depodan yeniden üretilemez.
