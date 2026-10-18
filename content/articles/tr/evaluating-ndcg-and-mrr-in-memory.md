---
id: "evaluating-ndcg-and-mrr-in-memory"
slug: "evaluating-ndcg-and-mrr-in-memory"
type: "learn"
language: "tr"
title: "Retrieval değerlendirme: recall, MRR, nDCG ve gecikme"
subtitle: ""
summary: "Etiketli listede sıralama metriklerini hesaplayın, kaliteyi hızdan ayırın; kendi eğitim örneğini puanlamayan deney tasarlayın."
shortAnswer: "Etiketli listede sıralama metriklerini hesaplayın, kaliteyi hızdan ayırın; kendi eğitim örneğini puanlamayan deney tasarlayın."
category: "Practice"
tags: ["evaluation", "MRR", "nDCG", "recall", "precision", "benchmark", "latency", "değerlendirme", "gecikme"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Retrieval değerlendirme: recall, MRR, nDCG ve gecikme — MESA Learn"
seoDescription: "Etiketli listede sıralama metriklerini hesaplayın, kaliteyi hızdan ayırın; kendi eğitim örneğini puanlamayan deney tasarlayın."
lessonOrder: 13
learningStage: "practice"
prerequisites: ["reciprocal-rank-fusion", "memory-scope-and-authorization"]
learningObjectives: ["Recall@k, MRR ve nDCG hesaplamak", "İlgililik etiketi ve ayrılmış test kümesi kurmak", "Gecikme, hata ve kanıt sınırını birlikte raporlamak"]
---

## Soru ve ilgililik etiketiyle başlayın

Neyin bulunması gerektiğini tanımlayana kadar arama sonucu makul görünür. Kaynak destekli etiketlerle küçük soru kümesi kurun. Tam kimlik, farklı ifade, tarihe duyarlı soru, cevapsız durum ve yasak kaynak ekleyin. Retrieval birimini kaydedin: ilgili belge çok sayıda ilgisiz parça içerebilir. İnceleyici her birimin soruyu destekleyip desteklemediğini değerlendirsin; ayrışmaları uzlaştırma için tutun.

Parça boyutu, birleştirme ağırlığı veya eşik ayarlamadan geliştirme sorusunu son testten ayırın. Sentetik soru kapsamı genişletebilir; fakat LLM sorusu ve LLM etiketi aynı hatayı veya yapay ifadeyi paylaşabilir. Örnekleri inceleyin, uygunsa gerçek kullanıcı sorusunu tutun ve kümeler arasındaki benzer soruları ayıklayın. Cevap metnini sorgu temsiline sızdırmayın.

## Tek sıralı liste, farklı ölçüm soruları

| Sıra | Pasaj | İlgililik derecesi |
| --- | --- | --- |
| 1 | A · ilgisiz salon | 0 |
| 2 | B · tam cuma saati | 2 |
| 3 | C · yararlı destek bağlamı | 1 |

Bu küçük etiketli kümede ilgili birimler yalnızca B ve C olsun. Precision@3, bulunanların ilgili oranı olan 2/3’tür. Recall@3, bütün ilgili birimlerin bulunan oranı olan 2/2 = 1’dir. İlk ilgili sonuç ikinci olduğundan reciprocal rank 1/2’dir. MRR sorguların reciprocal rank ortalamasıdır; belirtilen kesimde ilgili sonuç yoksa sıfır verilir.

```text
gain(rel) = 2**rel - 1
DCG@3 = sum(gain(rel_i) / log2(i+1), i=1..3)
Observed [0,2,1]: 0 + 3/log2(3) + 1/log2(4) = 2.3928
Ideal    [2,1,0]: 3 + 1/log2(3) + 0           = 3.6309
nDCG@3 = 2.3928 / 3.6309 = 0.6590
```

Sistem bütün ilgili öğeyi buldu fakat ilk sıraya ilgisizi koydu. Recall tek başına bunu gizler; nDCG dereceli ilgililik ve konumla cezalandırır. Kazanç, indirim, kesim ve ilgili etiketi olmayan sorgu politikasını belirtin. Farklı tanımlar farklı değer üretebilir. Etiketlenmemiş materyal kendiliğinden ilgisiz kanıtlanmış değildir.

## Tek etkeni değiştirin, hataları inceleyin

<!-- diagram: Soruyu ve veriyi sabitleyin; tabanı tek değişiklikle karşılaştırıp eşlenmiş metrik ve hataları inceleyin. -->
1. Sabitle · veri + etiket
2. Taban · yalnız sözcüksel
3. Değişken · yoğun kanal ekle
4. Karşılaştır · aynı sorular
5. İncele · kayıp ve kazanım

*Daha yüksek ortalama kimlik, dil veya yetkilendirme gerilemesini gizleyebilir.*

Sorgu başına değişimi ve yararlı alt grupları kıyaslayın: kimlik/farklı ifade, kısa/uzun kaynak, dil ve kaynak yaşı. Örnek boyutu uygunsa belirsizlik raporlayın ve ham sorgu sonuçlarını koruyun. BEIR heterojen görevlerde değerlendirme örneğidir; skorunu kendinizin saymak yerine disiplinini kullanın. [BEIR](https://arxiv.org/abs/2104.08663), [IR değerlendirme](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html).

## Hataları gizlemeden hızı ölçün

Uçtan uca retrieval ile aşama sürelerini ayrı ölçün. Donanım, veri boyutu, eşzamanlılık, önbellek, ısınma, istek sayısı ve timeout’u belirtin. Ortanca ve kuyruk gecikmesini hata ve boş yanıtlarla raporlayın. Timeout’ları tablodan çıkarmak bozuk sistemi hızlı gösterebilir. Yerel deterministik örnek sözleşme testidir; gerçek embedding sağlayıcısı kalitesini veya üretim kapasitesini ölçmez.

> [!EXERCISE]
> **Kendinizi sınayın**
> X değişkeni Recall@20’yi artırıp nDCG@5’i düşürüyor. X doğrudan daha iyi mi?
>
> **Answer:** Zorunlu değil. Daha fazla ilgili aday bulup üst sıralara daha kötü yerleştiriyor. Sonraki görev, yeniden sıralama bütçesi, hata alt grupları ve gecikmeyle karar verin; hangi sorunun iyileşip gerilediğini inceleyin.

## Kaynaklar ve ileri okuma

1. [Manning, Raghavan & Schütze · Evaluation of ranked retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)
2. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)

