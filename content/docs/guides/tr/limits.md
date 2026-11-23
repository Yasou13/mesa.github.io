## Sistem hangi garantileri vermez?

Her iş yükü için geçerli bir hız, kapasite veya doğruluk garantisi yoktur. Hatalı model yanıtlarının tamamen ortadan kalktığı da söylenemez. Aynı sonucu veren yerel testler yalnızca tanımlanan davranışı doğrular; önceden belirlenmiş vektörler gerçek modelin anlamsal kalitesini ölçmez. Çizge sınırları iş miktarını kontrol eder, bütün sonuçların bulunmasını garanti etmez. Bağlam bütçesi biçimlendirilmiş kanıt içindir; temkinli çevrimdışı sayım nedeniyle bütçenin tamamı dolmayabilir.

## Sonuçları koşullarıyla birlikte okuyun

Eski sayıları güncel sağlayıcı sonucu olarak kullanmadan önce testin tarihini ve koşullarını inceleyin. Ayrıntılar aşağıdaki özgün kaynakta, [mimari](architecture/), [API](docs/core/api-reference/) ve [işletim](docs/core/operations/) rehberlerinde bulunur.

## v0.9.4 ölçülen değişiklikler

Etiketli changelog, modeller ve yeniden sıralama kapalıyken paylaşılan Tier M DEV deposunda pasaj Hit@5 değerinin 50/112’den 61/112’ye, MRR’nin 0,3411’den 0,3955’e çıktığını, medyan arama gecikmesinin 361,3 ms’den 233,9 ms’ye indiğini bildirir. 5 MB’lık modelsiz fikstürde uçtan uca hazır olma 249,99 sn’den 172,61 sn’ye indi. Bunlar DEV ve yerel ölçümlerdir; ayrılmış test sonucu veya hizmet garantisi değildir.

## v0.9.3 hazır olma ölçümleri

Etiketli changelog, 4.999.000 baytlık belgenin tam hazır olmasını önceki **718,27 saniyeden 245,20 saniyeye** indirir (2,93× hızlanma). Modeller kapalı, çizge açıktır: 4.882 mutation’ın tamamı COMMITTED, SQL ve GRAPH COMPLETED, VECTOR SKIPPED; parçalar kayıpsız geri okunmuştur. Ayrı son Opus Round 20 kontrolü `dbf113b` üzerinde **239,35 saniye (3,00×)** raporlar. Bu yerel ölçümler hizmet garantisi değildir.

## v0.9.3’te kaydedilen bilinen sorunlar

v0.9.4 changelog’u bunları düzeltilmiş olarak işaretlemez.

- `/v4/*` ve `/control/*` için dakikalık ve günlük hız sınırları uygulanmaz.
- ASCII `yargitay`, `Yargıtay` ile eşleşmez; indeks tarafında Türkçe normalizasyon ertelenmiştir.
- Kùzu 0.11.3, çizge sayfalarının sonuna başlatılmamış bellek yazabilir. Mantıksal çizge özelliklerinde hafıza metni saklanmasa da (sorguyla doğrulandı) ham çizge dosyaları sürecin işlediği metin parçalarını içerebilir. Çizge dizinini SQLite gibi hassas kabul edin.

[Etiketli changelog’a](https://github.com/Yasou13/MESA/blob/531209bc45805b478264f6dfa8a9e40a94e345cb/CHANGELOG.md#093---2026-11-16) bakın. Üretim NO-GO sürer. Tarihsel 0.9.2 arama ölçümleri [sürüm notlarında](docs/core/release-notes/) korunur; [0.9.3 benchmark’ı](benchmark/0.9.3/) 0.9.4’ü anlatmaz; 0.9.4 benchmark’ı henüz yayımlanmadı.
