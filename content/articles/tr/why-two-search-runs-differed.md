---
id: "two-search-runs-differed"
slug: "why-two-search-runs-differed"
type: "research"
language: "tr"
title: "Aynı Arama İki Kez Neden Farklı Sonuç Verdi?"
subtitle: "Kalite değişimi gibi görünen bir sıralama hatası"
summary: "Aynı belgelerle sıfırdan kurulan iki MESA deposu, 112 dev sorusunun 49’unda farklı sıra verdi. Eşit sıraları rastgele kimlikler belirliyordu."
shortAnswer: ""
category: "Retrieval Evaluation"
tags: ["benchmark", "determinism", "rrf", "evaluation"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-23"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "Aynı Arama İki Kez Neden Farklı Sonuç Verdi?"
seoDescription: "Aynı belgelerle kurulan iki MESA deposu 112 sorunun 49’unda ayrıştı. Rastgele eşitlik bozmanın etkisini ve çözümü anlatıyoruz."
---

## Aynı arama neden farklı sonuç verdi?

Eşit puanları rastgele kimlikler ayırıyordu. İki pasajın puanı aynı olduğunda sıralarını, belge alınırken üretilen UUID belirliyordu. Bu yüzden aynı 141 belgeyle ayrı ayrı kurulan iki depo bazı pasajları farklı sıraladı. Benchmark v2 dev bölümünde (Tier M, modeller kapalı) depolardan biri Hit@5’te 48/112, diğeri 52/112 aldı.

Çözüm, eşitliği içeriğin kalıcı kimliğiyle bozmak oldu. PyPI’da yayımlanan MESA 0.9.4 paketiyle bağımsız kurulan iki depo, denenen üç yapılandırmanın hepsinde 128 dev sorusunun tamamı için aynı sırayı döndürdü.

## İki çalıştırma ne gösterdi?

Fark yalnızca ayrı kurulan depolar arasında çıktı. Aynı depoda aramayı tekrarlamak hiçbir şeyi değiştirmedi. Demek ki sorun sorgu anındaki bir rastgelelik değildi.

| Karşılaştırma (dev, T0, düzeltmeden önce) | Hit@5 | MRR | Sırası değişen yanıtlanabilir soru |
| --- | --- | --- | --- |
| Sıfırdan kurulan A deposu | 48/112 | 0,3314 | 49, A ve B arasında |
| Sıfırdan kurulan B deposu | 52/112 | 0,3500 | 49, A ve B arasında |
| Ortak depo, 1. çalıştırma | 50/112 | 0,3411 | 0, 1. ve 2. arasında |
| Ortak depo, 2. çalıştırma | 50/112 | 0,3411 | 0, 1. ve 2. arasında |

Hit@5 farkı, ne kadar şeyin oynadığını gizliyor. Yanıtlanabilir 49 sorunun sırası değişti. Bunların yalnızca altısı ilk 5 sınırını geçti: biri A deposunun, beşi B deposunun lehine. Net fark dört soru oldu.

> [!NOTE]
> **Kurulum**
> 0.9.4 sıralama değişikliklerinden önceki geliştirme derlemesi, çizge açık, modeller kapalı. Benchmark v2 dev bölümü, Tier M, 141 belge, 5.041 parça, 112’si yanıtlanabilir 128 soru. Arama limiti 50.

## Sıralama birleştirmede eşitlik neden oluşur?

[Reciprocal Rank Fusion (RRF)](/learn/reciprocal-rank-fusion-explained/), bir pasajı ham puanına göre değil, her listedeki sırasına göre puanlar. Sıralar tam sayı olduğu için birebir eşitlik sık görülür.

Örnek olarak k = 60 ve eşit ağırlık alalım. Yalnızca BM25’te üçüncü olan pasaj 1/(60+3) puan alır. Yalnızca bilgi kaydı (assertion) kanalında üçüncü olan pasaj da 1/(60+3) alır. Birleşik puan ikisini ayıramaz; sırayı bir sonraki sıralama anahtarı belirler.

Düzeltmeden önce bu anahtar rastgele bir UUID olabiliyordu. UUID aynı depoda değişmediği için tekrar eden çalıştırmalar aynı sonucu veriyordu. Yeni bir depo ise yeni UUID’ler üretiyor, aynı eşitlik bu kez öteki yöne çözülebiliyordu.

## Sıralamayı nasıl tekrarlanabilir yaptık?

MESA 0.9.4 iki şeyi değiştirdi. Arama kanalları ve birleştirme adımı artık eşit puanları içerik kimliğiyle ayırıyor. Katalog da kiracı (tenant) kapsamlı, belirlenimci UUID5 anahtarları üretiyor; böylece aynı derlem aynı iç anahtarları alıyor. Puanlar değişmiyor.

```text
# Sözde kod, MESA 0.9.4'ten sadeleştirildi
results = sorted(
    candidates,
    key=lambda c: (
        -c.fused_score,
        c.document_id,
        c.revision_number,
        c.chunk_ordinal,
        c.chunk_id,
    ),
)
```

Geliştirme sırasında sıfırdan kurulan bir depo çifti, 112 yanıtlanabilir sorunun 2’sinde hâlâ ayrışıyordu; ilk 5 sayısı ise değişmedi. Sonraki çiftte hiç fark kalmadı. Asıl önemli kontrol yayımlanan paketle yapıldı:

| PyPI’dan MESA 0.9.4, dev, Tier M | Aynı kalan soru | Doğru yanıt sırası farkı | Dönen sıra farkı |
| --- | --- | --- | --- |
| T0 (modeller kapalı) | 128/128 | 0 | 0 |
| T1b (bge-m3) | 128/128 | 0 | 0 |
| T2 (bge-m3 + yeniden sıralayıcı) | 128/128 | 0 | 0 |

Bu çalıştırmada 0.9.3’ün çizge ve bilgi kaydı ayarları kullanıldı. 0.9.4 varsayılanlarıyla yapılan ayrı çalıştırma da aynı sonucu verdi. Bu çalıştırmanın T1b sıraları, farklı bir LanceDB sürümünde de 128 sorunun 128’inde aynı kaldı.

## Bu, değerlendirme için neden önemli?

Dört soruluk oynama, bazı gerçek iyileştirmelerden büyüktür. Aynı geliştirme döneminde önek eşleştirmeli BM25, ortak depoda tek başına net iki soru kazandırdı. Sıfırdan kurulan depolarda bu kazancı eşitlik gürültüsünden ayırmak mümkün olmazdı.

Bu yüzden karşılaştırma yöntemimizi değiştirdik. Düzeltmeden önce değişiklikleri tek bir ortak depoda ölçtük. Düzeltmeden sonra sıfırdan depolar da kurup dönen sırayı karşılaştırıyoruz. Öncesi ve sonrası için [MESA 0.9.4’te Arama Kalitesini Ne Artırdı?](/research/what-improved-search-in-0-9-4/) yazısına bakın.

## Kendi arama sisteminizi nasıl kontrol edersiniz?

1. Aynı girdiden, ayrı konumlarda iki dizin kurun.
2. Aynı sorguları ikisinde de çalıştırın.
3. Yalnızca Hit@k veya MRR’yi değil, sıralı sonuç kimliklerini karşılaştırın.
4. Sıralar farklıysa önce eşit puanlara, sonra üretilen kimliklere, ekleme sırasına ve paralel veri alımına bakın.
5. İçerikten gelen son bir sıralama anahtarı ekleyin ve iki temiz depo kuran bir test bulundurun.

[Değerlendirme yöntemimiz](/methodology/retrieval-evaluation/), her çalıştırmayla birlikte nelerin kaydedileceğini listeler. [MRR ve nDCG dersi](/learn/evaluating-ndcg-and-mrr-in-memory/), küçük sıra değişimlerinin puanı neden etkilediğini açıklar.

## Bu sonuç neyi gösteremez?

- Tek bir Türkçe hukuk derlemini ve 128 dev sorusunu kapsar.
- Aynı derlem, paket ve ayarlar için tekrarlanabilirliği gösterir. Yeni bir belge eklemek sıraları yine değiştirebilir.
- Belirlenimci eşitlik bozma sırayı tekrarlanabilir yapar; eşit puanlı pasajları daha ilgili yapmaz.
- 49 sıra farkının kaçının hangi kanaldan geldiğini saymadık.

## Kaynaklar

1. [MESA 0.9.4 değişiklik günlüğü](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
2. [Cormack, Clarke ve Büttcher: Reciprocal Rank Fusion (SIGIR 2009)](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)
3. [RFC 9562: Universally Unique IDentifiers](https://www.rfc-editor.org/rfc/rfc9562.html)

