---
id: "evaluating-ndcg-and-mrr-in-memory"
slug: "evaluating-ndcg-and-mrr-in-memory"
type: "learn"
language: "tr"
title: "Arama kalitesini ölçmek: Recall, MRR, nDCG ve hız"
subtitle: ""
summary: "Etiketli bir sonuç listesinde ölçümleri hesaplayın. Kaliteyle hızı ayrı değerlendirin ve ayar yaparken kullandığınız sorulardan bağımsız bir test hazırlayın."
shortAnswer: "Etiketli bir sonuç listesinde ölçümleri hesaplayın. Kaliteyle hızı ayrı değerlendirin ve ayar yaparken kullandığınız sorulardan bağımsız bir test hazırlayın."
category: "Practice"
tags: ["evaluation", "MRR", "nDCG", "recall", "precision", "benchmark", "latency", "değerlendirme", "gecikme"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Arama kalitesini ölçmek: Recall, MRR, nDCG ve hız — MESA"
seoDescription: "Etiketli bir sonuç listesinde ölçümleri hesaplayın. Kaliteyle hızı ayrı değerlendirin ve ayar yaparken kullandığınız sorulardan bağımsız bir test hazırlayın."
lessonOrder: 13
learningStage: "practice"
prerequisites: ["reciprocal-rank-fusion", "memory-scope-and-authorization"]
learningObjectives: ["Recall@k, MRR ve nDCG hesaplamak", "İlgililik etiketi ve ayrılmış test kümesi kurmak", "Gecikme, hata ve kanıt sınırını birlikte raporlamak"]
---

## Soru ve ilgililik etiketiyle başlayın

Ne bulunması gerektiğini tanımlamadığınızda birçok sonuç makul görünebilir. Kaynaklarla desteklenmiş etiketler kullanarak küçük bir soru kümesi oluşturun. Tam kimlik araması, farklı ifadeler, tarih duyarlılığı, yanıtı bulunmayan sorular ve kapalı kaynaklar da yer alsın. Ölçtüğünüz birimi belirtin: İlgili bir belgenin her parçası ilgili olmayabilir. İnceleyen kişiler her birimin soruyu destekleyip desteklemediğini değerlendirsin; ayrışan kararları ayrıca gözden geçirin.

Parça boyutunu, birleştirme ağırlığını veya eşikleri ayarlamadan önce geliştirme sorularını son test sorularından ayırın. Yapay sorular kapsamı genişletebilir, ancak soruyu ve etiketi aynı model üretirse ikisinde de aynı hata veya yapay anlatım bulunabilir. Örnekleri inceleyin; uygunsa gerçek kullanıcı sorularını kullanın ve kümeler arasındaki çok benzer soruları ayıklayın. Yanıt metnini sorgu temsiline sızdırmayın.

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

Sistem bütün ilgili öğeleri bulmuş, ancak ilgisiz bir öğeyi ilk sıraya koymuş olabilir. Recall tek başına bu sorunu göstermez; nDCG hem ilgililik derecesini hem konumu hesaba katar. Kazanç, konuma bağlı indirim ve liste sınırı tanımlarını; ilgili etiketi bulunmayan sorgulara nasıl davranıldığını belirtin. Farklı tanımlar farklı puanlar verir. Etiketlenmemiş bir içeriğin ilgisiz olduğu da kendiliğinden kabul edilemez.

## Tek etkeni değiştirin, hataları inceleyin

<!-- diagram: Soruyu ve veriyi sabitleyin; tabanı tek değişiklikle karşılaştırıp eşlenmiş metrik ve hataları inceleyin. -->
1. Sabitle · veri + etiket
2. Taban · yalnız sözcüksel
3. Değişken · yoğun kanal ekle
4. Karşılaştır · aynı sorular
5. İncele · kayıp ve kazanım

*Daha yüksek ortalama kimlik, dil veya yetkilendirme gerilemesini gizleyebilir.*

Değişimi sorgu başına ve anlamlı alt gruplarda inceleyin: kimlik araması veya farklı ifade, kısa veya uzun kaynak, dil ve kaynak yaşı. Örneklem uygunsa belirsizliği raporlayın ve ham sonuçları koruyun. BEIR, farklı görevleri birlikte değerlendirmeye örnektir. O çalışmanın puanını kendi başarınız gibi kullanmak yerine değerlendirme yaklaşımından yararlanın. [BEIR](https://arxiv.org/abs/2104.08663) [IR değerlendirme](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)

## Hataları gizlemeden hızı ölçün

Aramanın toplam süresini ve her aşamasını ayrı ölçün. Donanımı, veri büyüklüğünü, eşzamanlı istek sayısını, önbelleği, ısınmayı ve zaman aşımını belirtin. Ortanca süreyi ve yüksek gecikme yüzdeliklerini; hatalar ve boş sonuçlarla birlikte raporlayın. Zaman aşımına uğrayan istekleri dışarıda bırakmak, sorunlu bir sistemi hızlı gösterebilir. Sabit girdilerle yapılan yerel örnek, davranış testidir; gerçek modelin kalitesini veya canlı kullanım kapasitesini ölçmez.

> [!EXERCISE]
> **Kendinizi sınayın**
> X değişkeni Recall@20’yi artırıp nDCG@5’i düşürüyor. X doğrudan daha iyi mi?
>
> **Açıklama:** Zorunlu değil. Daha fazla ilgili aday bulup üst sıralara daha kötü yerleştiriyor. Sonraki görev, yeniden sıralama bütçesi, hata alt grupları ve gecikmeyle karar verin; hangi sorunun iyileşip gerilediğini inceleyin.

## Kaynaklar ve ileri okuma

1. [Manning, Raghavan & Schütze · Evaluation of ranked retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)
2. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)

