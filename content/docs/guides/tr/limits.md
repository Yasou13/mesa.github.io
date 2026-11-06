## Sistem hangi garantileri vermez?

Her iş yükü için geçerli bir hız, kapasite veya doğruluk garantisi yoktur. Hatalı model yanıtlarının tamamen ortadan kalktığı da söylenemez. Aynı sonucu veren yerel testler yalnızca tanımlanan davranışı doğrular; önceden belirlenmiş vektörler gerçek modelin anlamsal kalitesini ölçmez. Çizge sınırları iş miktarını kontrol eder, bütün sonuçların bulunmasını garanti etmez. Bağlam bütçesi biçimlendirilmiş kanıt içindir; temkinli çevrimdışı sayım nedeniyle bütçenin tamamı dolmayabilir.

## Sonuçları koşullarıyla birlikte okuyun

Eski sayıları güncel sağlayıcı sonucu olarak kullanmadan önce testin tarihini ve koşullarını inceleyin. Ayrıntılar aşağıdaki özgün kaynakta, [mimari](architecture/), [API](docs/core/api-reference/) ve [işletim](docs/core/operations/) rehberlerinde bulunur.

## v0.9.2 bilinen sınırlar

Ölçülen 1.000 adaylı arama yaklaşık 11,6 saniye sürmüştür; `/health` yanıt verebilirliğinin düzelmesi daha hızlı arama kanıtı değildir. Modeller kapalı, çizge açıkken 4.999.000 baytlık yükleme yaklaşık yedi dakikada hazır olmuştur. Süren kabul baskısı `503 queue_over_capacity` döndürebilir. Eski tam belge gizli bilgi taraması ve uç Unicode normalizasyonu, istek yolunda saniye altı duraklamalar yaratabilir.

UUID eşitlikleri ayrı doldurulmuş depoların sırasını değiştirebilir. Aynı depoda korunan girdilerin determinizmi sürer. Nesne olmayan belge isteklerinde INFO düzeyli 422 ayrıntı metni farklılığı vardır. Resmî yayın, Python 3.13 birleşim sonrası ayrıştırıcı CI süre testinin 200 ms sınırını aştığını ve hız düzeltmesinin 0.9.3 için planlandığını belirtir. [Resmî yayına](https://github.com/Yasou13/MESA/releases/tag/v0.9.2) bakın; üretim NO-GO sürer.
