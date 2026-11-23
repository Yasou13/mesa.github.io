---
id: "what-improved-search-0-9-4"
slug: "what-improved-search-in-0-9-4"
type: "research"
language: "tr"
title: "MESA 0.9.4’te Arama Kalitesini Ne Artırdı?"
subtitle: "Dev kümesinde iki mod iyileşti, yeniden sıralamalı mod geriledi"
summary: "Önekli BM25 ve yeni birleştirme ayarları, modelsiz ve embedding aramasını dev kümesinde iyileştirdi. Yeniden sıralamalı dev Hit@5 ise 0,9286’dan 0,9107’ye düştü."
shortAnswer: ""
category: "Retrieval Evaluation"
tags: ["benchmark", "bm25", "hybrid-search", "ablation", "turkish"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-23"
readingMinutes: 9
status: "published"
indexable: true
seoTitle: "MESA 0.9.4’te Arama Kalitesini Ne Artırdı?"
seoDescription: "Önekli BM25 ve yeni birleştirme ayarları iki modu iyileştirdi; yeniden sıralamalı dev Hit@5 ise 0,9286’dan 0,9107’ye düştü."
---

## MESA 0.9.4 arama kalitesini artırdı mı?

Kısmen. Benchmark v2 dev bölümünde modellerin kapalı olduğu arama (T0), Hit@5’te 0,4732’den 0,5446’ya çıktı. Embedding araması (T1b) 0,7411’den 0,7768’e yükseldi. En güçlü mod olan yeniden sıralamalı arama (T2) ise Hit@5’te 0,9286’dan 0,9107’ye, MRR’de 0,8076’dan 0,7945’e düştü.

> [!WARNING]
> **0.9.4 tartışmasız bir kazanç değil**
> 0.9.4 varsayılanlarıyla yeniden sıralamalı dev Hit@5, 0,9286’dan 0,9107’ye, yani 104/112 sorudan 102/112 soruya düştü (benchmark v2, Tier M, T2).

Bu sonucu üç değişiklik belirledi: BM25’te 5 karakterlik önek eşleştirme, bilgi kaydı (assertion) kanalının ağırlığının 0 olması ve çizge kanalının varsayılan olarak kapanması. Üç modda da p95 arama süresi düştü. 0.9.4, modelsiz ve embedding araması için daha iyi bir varsayılandır; ama tartışmasız bir kazanç değildir.

| 0.9.3 → 0.9.4 varsayılanları, dev, Tier M | MRR | Hit@5 | Arama p50 (sn) | Arama p95 (sn) |
| --- | --- | --- | --- | --- |
| T0, modeller kapalı | 0,3405 → 0,3954 | 0,4732 → 0,5446 | 0,6615 → 0,3291 | 4,5369 → 0,8155 |
| T1b, bge-m3 | 0,5758 → 0,6487 | 0,7411 → 0,7768 | 1,6736 → 1,6373 | 7,0309 → 2,1655 |
| T2, bge-m3 + yeniden sıralayıcı | 0,8076 → 0,7945 | 0,9286 → 0,9107 | 2,3461 → 2,2725 | 7,8343 → 2,7771 |

> [!NOTE]
> **Kurulum**
> PyPI’da yayımlanan paketler, tek bir Colab NVIDIA A100 80 GB ortamı, değerlendirici v2.1, arama limiti 50. Benchmark v2 dev bölümü, Tier M, 141 belge, 5.041 parça, 128 soru. İlgililik ölçümleri 112 yanıtlanabilir soruyu, gecikme ölçümleri 128 sorunun tamamını kullanır. 0.9.4 varsayılanları: çizge kapalı, bilgi kaydı ağırlığı 0, BM25 ağırlığı 1, vektör ağırlığı 8.

## Yeniden sıralamalı aramada ne kötüleşti?

Yeniden sıralamalı dev Hit@5 iki soru geriledi: 104/112’den 102/112’ye. İki kayıp da sayı, tarih ve esas numarası kategorisinde oldu; bu kategoride Hit@5 1,0000’den 0,9429’a indi (35/35’ten 33/35’e). Birebir ifade, yeniden ifade ve çok belgeli sorularda Hit@5 değişmedi.

Düşüşün kaynağı büyük olasılıkla yeni varsayılanlar. MESA 0.9.4, eski 0.9.3 çizge ve bilgi kaydı ayarlarıyla çalıştırıldığında T2 Hit@5 0,9286, MRR 0,8076 olarak kaldı. 0.9.4 varsayılanlarına geçince düşüş görüldü. T2’de iki ayarı ayrı ayrı denemedik; bu yüzden hangisinin neden olduğunu söyleyemiyoruz.

Yeniden sıralama kullanıyor ve sayı, tarih ya da esas numarası aramalarına güveniyorsanız iki ayarı kendi verinizde karşılaştırın. Şu değişkenler 0.9.4’te önceki birleştirme davranışını geri getirir:

```text
MESA_RRF_ASSERTION_WEIGHT=1.0
MESA_GRAPH_ENABLED=true
```

Çizgeyi açmak, başlangıçta atlanmış çizge projeksiyonlarını tamamlar. Yukarıdaki p95 kazancı çizge kapalıyken elde edildi; yeniden açarsanız aramanın yavaşlamasını bekleyin.

## Modelsiz aramayı hangi değişiklik iyileştirdi?

Her değişikliği tek bir ortak depoda denedik; çünkü o dönemde [sıfırdan kurulan depolar dört soruya kadar oynuyordu](/research/why-two-search-runs-differed/). Bu çalıştırmalar, modeller kapalıyken yerel bir makinede, 0.9.4 öncesi geliştirme derlemesiyle yapıldı. Adımları yalnızca bu tablo içinde karşılaştırın.

| Adım, dev, T0, ortak depo | Hit@5 | MRR | Arama p50 |
| --- | --- | --- | --- |
| Başlangıç | 50/112 | 0,3411 | 361,3 ms |
| + önekli BM25 | 52/112 | 0,3444 | 357,3 ms |
| + önek, bilgi kaydı ağırlığı 0 | 56/112 | 0,3529 | 351,8 ms |
| + önek, çizge kapalı | 52/112 | 0,3535 | 182,2 ms |
| + önek, ikisi birlikte | 61/112 | 0,3955 | 181,4 ms |

İki kanal değişikliği birbirini etkiliyor. Önekli BM25’ten başlayınca bilgi kaydı ağırlığını 0 yapmak 4 soru, çizgeyi kapatmak 0 soru ekledi. İkisi birlikte 9 soru ekledi. Modeller kapalıyken bu birleşim, BM25’i birleştirilen tek kanal olarak bırakıyor. Sonuç, diğer iki kanalın iyi BM25 sonuçlarını aşağı ittiğini düşündürüyor.

Başlangıçtan son adıma 14 soru ilk 5’e girdi, 3 soru çıktı. Sayı/tarih/esas sorularında 35’te 17’den 22’ye, yeniden ifade sorularında 32’de 12’den 17’ye, çok belgeli sorularda 14’te 0’dan 1’e çıkıldı. Birebir ifade soruları 31’de 21’de kaldı.

İşleyişi görmek için [RRF’nin kanalları nasıl birleştirdiğine](/learn/reciprocal-rank-fusion-explained/) ve [hibrit aramaya](/learn/hybrid-retrieval-explained/) bakın.

## Önek eşleştirme Türkçede ne işe yaradı?

Türkçe sözcük köklerine ek alır; bu yüzden tek bir hukuk terimi metinde pek çok biçimde görünür. Birebir token eşleştirme bunları farklı sözcükler sayar. MESA 0.9.4, 6 veya daha uzun olan ve rakam içermeyen sorgu token’larının ilk 5 karakterini eşleştirir. Daha kısa token’lar, rakamlı token’lar ve `ı` → `i` varyantları birebir kalır.

Örnek olarak sorgudaki `sözleşmesi` sözcüğü `sözle*` önekine dönüşür. Böylece `sözleşme` ve `sözleşmesinin` biçimleriyle eşleşir. Aynı önek, `sözler` gibi `sözle` ile başlayan ilgisiz sözcükleri de yakalayabilir.

Ölçülen kazanç küçük: 4 soru ilk 5’e girdi, 2 soru çıktı; net +2. Dört kazancın üçü yalnızca 6. sıradan 5. sıraya geçti. Biri ise 38. sıradan 4. sıraya çıktı. Yararlı ama sınırlı bir değişiklik. Ayar konusunda [alan belgeleri için BM25](/learn/bm25-tuning-for-domain-documents/) dersine bakabilirsiniz.

> [!NOTE]
> **MESA’da ne ölçtük?**
> Soru başına tam analiz için [Türkçe Metinlerde BM25 Neden Zorlanır?](/research/bm25-turkish-prefix-matching/) yazısına bakın.

## Arama neden hızlandı?

Uç gecikmedeki kazancın çoğu çizge kanalını kapatmaktan geldi. Ortak depodaki ablasyon testinde çizge kapanınca p95, 2,07 sn’den 0,45 sn’ye indi.

Sürüm karşılaştırmasında bir uyarı gerekiyor. 0.9.4, LanceDB’yi 0.35’in altında tutar; bu yüzden 0.34.0 ile çalıştı, 0.9.3 çalıştırması ise 0.41.0 kullandı. 0.9.4 varsayılanlarıyla T1b’de LanceDB 0.41.0, 0.34.0’daki 1,6373 sn’ye karşı 1,2285 sn p50 verdi ve 128 sorunun 128’inde sıralar aynı kaldı. Sürüm sınırı şu anda embedding aramasından bir miktar hız götürüyor.

## Test bölümünde durum ne?

> [!WARNING]
> **Bu sayıları dikkatle okuyun**
> Test bölümü altı çalıştırmada okundu: üçü benchmark v1, üçü v2 üzerinde. MESA 0.9.4, v2 test bölümünde iki kez değerlendirildi. v2 test sorularının çoğu v1 test kümesinden türetildi. Bu sonuçlar bağımsız bir sınama değildir; ana sayılarımız dev sonuçlarıdır.

| 0.9.3 → 0.9.4 varsayılanları, v2 test, Tier M (173 soru, 149’u yanıtlanabilir) | MRR | Hit@5 |
| --- | --- | --- |
| T0, modeller kapalı | 0,3988 → 0,4810 | 0,5503 → 0,5772 |
| T1b, bge-m3 | 0,6198 → 0,6413 | 0,7919 → 0,8188 |
| T2, bge-m3 + yeniden sıralayıcı | 0,7867 → 0,7868 | 0,8993 → 0,8993 |

Dev’de görülen yeniden sıralama düşüşü test Hit@5’te görünmedi. Bu bölümün geçmişi düşünüldüğünde bu, dev sonucunu ortadan kaldırmaz.

## Bu sonuçlar neyi gösteremez?

- Tüm sonuçlar tek bir Türkçe hukuk derleminden geliyor.
- 112 yanıtlanabilir dev sorusunda bir soru yaklaşık 0,009 Hit@5 eder. Yeniden sıralamalı düşüş iki sorudur.
- Varsayılanlar aynı dev kümesiyle seçildi; dev kazançları olduğundan iyi görünebilir.
- T2’de bilgi kaydı ağırlığı ve çizge ayarlarını ayrı ayrı denemedik.
- Değişiklik günlüğü, ortak yerel depoda 50 → 61 bildirir. Resmî Colab çalıştırması 53 → 61 (0,4732 → 0,5446) verir. İkisi de doğrudur, ama başlangıç noktaları farklıdır.

> [!NOTE]
> **MESA’da ne ölçtük?**
> 0.9.4, dev sıralarını değiştirmeden iki alt sistemi de kaldırdı. [Neleri sildiğimize](/research/deleting-code-mesa-0-9-4/) bakın.

## Kaynaklar

1. [MESA 0.9.4 değişiklik günlüğü](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
2. [PyPI’da mesa-memory 0.9.4](https://pypi.org/project/mesa-memory/0.9.4/)
3. [SQLite FTS5 belgeleri](https://www.sqlite.org/fts5.html)
4. [Cormack, Clarke ve Büttcher: Reciprocal Rank Fusion (SIGIR 2009)](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)

