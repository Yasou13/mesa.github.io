---
id: "turkish-legal-benchmark-v2"
slug: "turkish-legal-benchmark-v2"
type: "research"
language: "tr"
title: "Türkçe Hukuk Arama Benchmark’ı Nasıl Kurulur?"
subtitle: "Neyi yeniden kurduk, nasıl puanlıyoruz, nerede eksik kalıyor?"
summary: "Benchmark v2, eski 246 soruyu birebir kanıtlı 128 dev ve 173 test sorusuna dönüştürdü. Test bölümü altı kez okunduğu için ana sonuçlarımız dev bölümünden gelir."
shortAnswer: ""
category: "Retrieval Evaluation"
tags: ["benchmark", "evaluation", "turkish", "legal-search"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-23"
readingMinutes: 9
status: "published"
indexable: true
seoTitle: "Türkçe Hukuk Arama Benchmark’ı Nasıl Kurulur?"
seoDescription: "MESA’nın 246 hukuk sorusunu nasıl yeniden kurduğunu, sonuçları nasıl puanladığını ve test bölümünün neden bağımsız sayılmadığını okuyun."
---

## Benchmark’ı nasıl kurduk?

Benchmark v1’deki 246 sorunun tamamını inceledik. Birçoğu eksik bağlama ya da birden çok yerde geçen ifadelere dayanıyordu. Soruların çoğunu yeniden yazdık veya yeniden kurduk, 39’unu çıkardık, açık uçlu sorular ekledik ve her yanıtı kaynak dosyadaki birebir bir alıntıya bağladık. Sonuçta Türkçe hukuk belgeleri üzerinde 128 dev ve 173 test sorusu oluştu.

> [!WARNING]
> **Test bölümü bağımsız bir sınama değil**
> Bu bölüm altı MESA çalıştırmasında okundu. v2 test sorularının çoğu da daha önce okunmuş v1 test kümesinden türetildi. Ana sayılarımız dev sonuçlarıdır; test sonuçlarını yalnızca bu uyarıyla veriyoruz.

## İlk benchmark neden yetersiz kaldı?

246 v1 sorusu üzerindeki otomatik kontroller, doğru pasajı tanımlamanın çoğu zaman zor olduğunu gösterdi:

| v1 soruları üzerindeki kontrol | Dev | Test | Toplam |
| --- | --- | --- | --- |
| İfade bağlama dayanıyor ve işaretlendi | 40 | 54 | 94 |
| Beklenen ifade başka bir dosyada da geçiyor | 37 | 48 | 85 |
| Beklenen ifade 10 veya daha çok başka dosyada geçiyor | 14 | 19 | 33 |
| Beklenen ifade kendi dosyasında tekrar ediyor | 25 | 39 | 64 |

“Bu yönetmelik ne diyor?” gibi bir soru, hangi yönetmelik olduğu bilinmeden yanıtlanamaz. Dosyalarda tekrar eden kısa bir ifade de yanlış pasaja puan kazandırabilir. En uç örnekte bir ifade tek dosyada 172 kez geçiyordu.

## v1’den v2’ye ne değişti?

| v1 soruları için inceleme kararı | Dev | Test | Toplam |
| --- | --- | --- | --- |
| Yeniden yazıldı | 73 | 104 | 177 |
| Yeniden kuruldu | 13 | 17 | 30 |
| Çıkarıldı | 15 | 24 | 39 |
| Değişmeden kaldı | 0 | 0 | 0 |

İnceleme önce 207 soru üretti. Ardından açık uçlu sorular ekledik ve bir düzeltme turu daha yaptık. Son v2 kümesi şöyle:

| Kategori | Dev | Test |
| --- | --- | --- |
| Birebir ifade | 31 | 39 |
| Sayı, tarih, esas no | 35 | 46 |
| Yeniden ifade | 32 | 48 |
| Çok belgeli | 14 | 16 |
| Derlemde yanıtı yok | 16 | 24 |
| Toplam | 128 | 173 |

## Bir soru hangi koşullarda geçerli sayılır?

- Yanıt kaynağa bağlıysa soru kaynağın adını verir. Kanun adları numarasıyla, kararlar mahkeme, esas ve karar numarasıyla yazılır.
- Her yanıtın en çok 200 karakterlik birebir bir alıntısı vardır; bu alıntı Türkçe normalizasyondan sonra tüm derlemde bir kez geçer.
- Çok belgeli sorular iki kaynağı adıyla anar ve her birinden bir pasaj ister.
- Yanıtı olmayan sorular, 182 belgenin tamamından çıkarılan 33.954 pencere üzerinde en az iki sorgu çeşidiyle denetlendi.
- Otomatik doğrulama, dev ve test arasında çakışan doğru yanıt aralıklarını reddeder.

## Açık uçlu soru nedir?

Adı belirtilen sorular sisteme hangi kanuna bakacağını söyler. Açık uçlu sorular ise bir insanın anlatacağı gibi durumu tarif eder. Dev bölümünden gerçek bir çift:

> [!NOTE]
> **Adı belirtilen**
> 6098 sayılı Türk Borçlar Kanunu uyarınca, aralıksız evde çalışan işçinin hazırladığı ürünü işveren teslim almada temerrüde düşerse işçinin ücretini ödeme borcu sürer mi?

> [!NOTE]
> **Açık uçlu**
> Evde sürekli parça başı üretim yapıyorum. İşveren hazırladığım ürünleri teslim almada temerrüde düşerse ücretimi yine de ödemek zorunda mı?

İkisi de aynı kanıta dayanır. Bu, ifade farkını sınamak için yararlıdır; ama iki sonucun birbirinden bağımsız olmadığı anlamına da gelir.

## Sonuçlar nasıl puanlanıyor?

İsabet sayılması için sonuç doğru dosyadan gelmelidir. Ardından normalize edilmiş alıntıyı içeriyorsa ya da alıntıyla en az 60 karakter örtüşüyorsa geçerli olur; alıntı daha kısaysa tamamıyla örtüşmesi gerekir. Doğru maddeden gelen ama kanıtı içermeyen pasaj puan almaz.

Çok belgeli sorularda sıra, gerekli pasajların tamamının göründüğü konumdur. Ölçütlerin davranışı için [MRR ve nDCG dersine](/learn/evaluating-ndcg-and-mrr-in-memory/) bakın.

| Yapılandırma | Ne çalışıyor? |
| --- | --- |
| T0 | Modeller kapalı, sözcük tabanlı arama |
| T1b | T0’a ek olarak normalize BAAI/bge-m3 gömme vektörleri |
| T2 | T1b’ye ek olarak BAAI/bge-reranker-v2-m3 |

## Bir çalıştırma nasıl yapılıyor?

1. Yayımlanan paketi PyPI’dan kurun.
2. Tek bir Colab NVIDIA A100 80 GB ortamında her yapılandırma için yeni bir depo oluşturun.
3. Tier M’yi alın: 141 belge, 5.041 parça.
4. Dev bölümünü bağımsız kurulan iki depoda çalıştırıp dönen sırayı karşılaştırın.
5. Test dosyası yüklenmeden önce dev raporunu yerelde kaydedin.
6. Testi her yapılandırma için bir kez çalıştırın.

Değerlendirici, açıkça `--split test` verilmeden test dosyası alırsa durur. İki depolu karşılaştırmayı, [rastgele eşitlik bozmanın depolar arasında sonucu değiştirdiğini](/research/why-two-search-runs-differed/) gördükten sonra ekledik.

## Test bölümü kaç kez okundu?

Altı çalıştırma bir test bölümünü okudu. Yukarıdaki süreç yanlışlıkla kullanımı sınırlar; ama tekrar eden okumaları geri alamaz.

| Çalıştırma tarihi | Soru kümesi | MESA çalıştırması |
| --- | --- | --- |
| 2026-10-29 | v1 | 0.9.0 deneyleri |
| 2026-11-07 | v1 | 0.9.2 sürümü |
| 2026-11-17 | v1 | 0.9.3 sürümü |
| 2026-11-21 | v2 | 0.9.3 referansı |
| 2026-11-23 | v2 | 0.9.3 ayarlarıyla 0.9.4 |
| 2026-11-23 | v2 | 0.9.4 sürüm varsayılanları |

İkinci 0.9.4 okuması, ilk çalıştırma sürüm varsayılanlarını kullanmadığı için yapıldı. Bu varsayılanlar ilk v2 test okumasından önce işlenmişti; ama sonraki geliştirme o okumadan sonra sürdü. Ölçülen sonuçlar için [MESA 0.9.4’te Arama Kalitesini Ne Artırdı?](/research/what-improved-search-in-0-9-4/) yazısına bakın.

## Bu benchmark neyi gösteremez?

- Etiketleme bir inceleme turu ve kanıt örneklemesinden geçti; bağımsız uyum ölçümü yapılmadı.
- Türkçe hukuk metinlerinin tek bir anlık görüntüsünü kapsar. “Yanıt yok” etiketi yalnızca bu görüntü için geçerlidir.
- Sözcük tabanlı inceleme, dolaylı anlatılan veya OCR ile bozulan yanıtları kaçırabilir.
- Bazı kaynak PDF’ler sözcükleri böler ya da sayfa numarası ekler; bu izler metinde kalır.
- Çok belgeli sonuçlar yalnızca 14 dev sorusuna dayanır.
- Soru dosyaları ve değerlendirici henüz açık değil; dış ekipler yeniden çalıştıramaz.

## Kaynaklar

1. [SQLite FTS5 belgeleri](https://www.sqlite.org/fts5.html)
2. [MESA 0.9.4 değişiklik günlüğü](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
3. [Manning, Raghavan ve Schütze: Introduction to Information Retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html)

