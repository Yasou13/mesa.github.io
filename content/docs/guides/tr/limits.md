## Amaç ve sınırlar

Her iş yükü için geçerli bir hız, kapasite veya doğruluk garantisi yoktur. Hatalı model yanıtlarının tamamen ortadan kalktığı da söylenemez. Aynı sonucu veren yerel testler yalnızca tanımlanan davranışı doğrular; önceden belirlenmiş vektörler gerçek modelin anlamsal kalitesini ölçmez. Bağlam bütçesi biçimlendirilmiş kanıta uygulanır; çevrim dışı temkinli sayım bütçeyi tam doldurmayabilir. Tarihsel sayıları güncel sağlayıcı sonucu gibi değil, ölçüldükleri koşullarla birlikte okuyun.

## Bakımı yapılan sözleşmelerle devam edin

Tam tablolar ve işletim ayrıntıları için aşağıdaki sabitlenmiş kaynak bölümünü kullanın. İlgili rehberler: [mimari](architecture/), [API](docs/core/api-reference/), [işletim](docs/core/operations/) ve [sürüm sınırları](docs/core/limitations/).

## v0.9.5 ölçülen ölçek (yerel, 100.820 parça)

Bunlar, v0.9.5’in parçası olan `a0d585f` çalışma zamanı commit’inde yapılan Round 23 yerel ölçümleridir. Koşullar: 8 vCPU, 14 GiB RAM ve 4 GiB swap, NVMe SSD bulunan tek bir Linux x86_64 makine. Derlem, donmuş Tier M benchmark kümesinin (141 belge) tek bir veri kümesine 20 kez kopyalanmasıdır: boş bir depoya `POST /v4/documents` ile yüklenen 2.820 belge, 100.820 parça. Arama, benchmark v2’nin 128 dev sorusuyla, her biri üç geçiş, limit 50, tek veri kümesi ve tarih filtresi olmadan yapıldı; sıcak değerler ikinci ve üçüncü geçişleri birlikte kullanır. Vektör koşuları belirlenimci 1.024 boyutlu vektörler döndüren localhost bir sağlayıcı kullandı; vektör yolunun süresini ölçer, anlamsal kalite hakkında bilgi vermez.

| 100.820 parçada mod | Yazma süresi | Sıcak HTTP arama p50 / p95 | Başlangıçtan sonraki ilk sorgu | En yüksek arama belleği |
|---|---:|---:|---:|---:|
| Modeller kapalı (BM25), 0.9.4 dönemi temel çizgi | 9.288,2 sn | 1.222,7 / 1.616,2 ms | 22.812,9 ms | 2.073,1 MiB |
| Modeller kapalı (BM25), v0.9.5 | 7.422,7 sn | 752,7 / 871,7 ms | 14.764,0 ms | 1.965,6 MiB |
| Belirlenimci vektörler, v0.9.5 | 5.533,2 sn tamamlama | 2.016,2 / 2.451,7 ms | 21.292,4 ms | 3.609,2 MiB |

Sıcak vektör kanalı tek başına 100.820 parçada 286,7 / 342,8 ms (p50 / p95) sürdü; temel çizgide üç sıcak sorguda p50 19.605,5 ms idi. Sıfırdan 100k kurulum sırasında istemci, SQLite meşgul zaman aşımından kaynaklanan bir HTTP 503’ü yeniden denedi. Bu boyutta arama kalitesi ölçülmedi: kopyalar aynı 141 belgeyi tekrarlar. [Ölçek sonuçlarına](benchmark/#scale) bakın.

## v0.9.4 ölçülen değişiklikler

Etiketli 0.9.4 changelog’u, modeller ve yeniden sıralama kapalıyken paylaşılan Tier M DEV deposunda pasaj Hit@5 değerinin 50/112’den 61/112’ye, MRR’nin 0,3411’den 0,3955’e çıktığını, medyan arama gecikmesinin 361,3 ms’den 233,9 ms’ye indiğini bildirir. 5 MB’lık modelsiz fikstürde uçtan uca hazır olma 249,99 sn’den 172,61 sn’ye indi. Bunlar DEV ve yerel ölçümlerdir; ayrılmış test sonucu veya hizmet garantisi değildir.

## Hâlâ açık olan bilinen sorunlar

v0.9.5 changelog’u bu 0.9.3 sorunlarını düzeltilmiş olarak işaretlemez.

- `/v4/*` ve `/control/*` için dakikalık ve günlük hız sınırları uygulanmaz.
- ASCII `yargitay`, `Yargıtay` ile eşleşmez; dizin tarafında Türkçe harf katlama ertelenmiştir.

Üretim NO-GO sürer. Tarihsel arama ölçümleri [sürüm notlarında](docs/core/release-notes/) korunur; hangi sonucun hangi sürümü anlattığı için [benchmark sayfasına](benchmark/) bakın.
