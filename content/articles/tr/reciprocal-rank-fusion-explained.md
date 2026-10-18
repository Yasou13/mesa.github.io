---
id: "reciprocal-rank-fusion"
slug: "reciprocal-rank-fusion-explained"
type: "learn"
language: "tr"
title: "Reciprocal Rank Fusion: her oyu hesaplamak ve incelemek"
subtitle: ""
summary: "İki sıralı listeyi elle birleştirin, tekrarları ve eşitlikleri yönetin; RRF skorunun neden güven olasılığı olmadığını anlayın."
shortAnswer: "İki sıralı listeyi elle birleştirin, tekrarları ve eşitlikleri yönetin; RRF skorunun neden güven olasılığı olmadığını anlayın."
category: "Memory & Retrieval"
tags: ["RRF", "rank fusion", "weighted", "k=60", "sıra birleştirme", "ağırlık"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Reciprocal Rank Fusion: her oyu hesaplamak ve incelemek — MESA Learn"
seoDescription: "İki sıralı listeyi elle birleştirin, tekrarları ve eşitlikleri yönetin; RRF skorunun neden güven olasılığı olmadığını anlayın."
lessonOrder: 7
learningStage: "retrieval"
prerequisites: ["hybrid-retrieval"]
learningObjectives: ["Üç aday için RRF hesaplamak", "Yumuşatma sabiti ve kanal ağırlığını anlamak", "Tekrar, eksik sıra ve eşitlik politikasını tanımlamak"]
---

## Ham skorları kıyaslamadan uzlaşmayı birleştirin

Atlas arşivinde iki retriever farklı sıralıyor. Sözcüksel liste A, B, C; yoğun liste B, C, D. Ham skorların birimi aynıymış gibi davranmadan liste sırasını kullanmak istiyorsunuz. Reciprocal Rank Fusion her sıraya azalan katkı atar ve aynı adayın katkılarını toplar. Varsayımları açık, basit bir başlangıç yöntemidir.

Cormack, Clarke ve Büttcher yöntemi belirli retrieval deneylerinde değerlendirdi. Sonuçları RRF’yi denemeyi gerekçelendirir; görevinizde iyileşmeyi garanti etmez. Özgün yöntem ağırlıksız oy kullanır. Ağırlıklı RRF, her kanal katkısını açık ağırlıkla çarpan bir genişletmedir. [Özgün makale](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf).

## Sıralamayı birden başlatın

```text
RRF(d) = sum over lanes containing d: w_lane / (k + rank_lane(d))
rank starts at 1; missing candidate contributes 0.
Example below: k = 60, every weight = 1.
```

| Aday | Sözcüksel sıra | Yoğun sıra | RRF katkı toplamı |
| --- | --- | --- | --- |
| A | 1 | yok | 1/61 = 0.016393 |
| B | 2 | 1 | 1/62 + 1/61 = 0.032522 |
| C | 3 | 2 | 1/63 + 1/62 = 0.032002 |
| D | yok | 3 | 1/63 = 0.015873 |

Birleşik sıra B, C, A, D’dir. Listeler arası uzlaşma, tek kanalda birinci olan A’ya rağmen B ve C’yi yükseltir. Kesilmiş listede olmayan aday o kanaldan sıfır alır; sonsuz veya sıfırıncı sıra oyu almaz. Kesim oyları değiştirdiği için aday kesimlerini deney kaydına yazın.

## k değişince ne olur?

`k=60` iken birinci 1/61, ikinci 1/62 katkı yapar; fark küçüktür. `k=1` iken 1/2 ve 1/3 ile fark büyür. Küçük k üst sıraları vurgular; büyük k getirilen sıralar arasında katkıyı düzleştirir. Bu k yumuşatma sabitidir; döndürülen sonuç sayısı değildir. 60’ı evrensel saymak yerine ayrılmış değerlendirmeyle seçin.

<!-- diagram: Sıra listeleri kanal oyu üretir; oylar aday kimliğinde birleşip belirli sırayla sıralanır. -->
1. Sözcüksel · A,B,C
2. Yoğun · B,C,D
3. Oy · 1/(k+sıra)
4. Kimlikte topla · tek kanal oyu
5. Sırala · B,C,A,D

*Sonuç bir sıra sinyalidir; kalibre edilmiş olasılık değildir.*

## Uç durumları dağıtımdan önce belirleyin

Oy vermeden önce kanal içindeki aday tekrarını ayıklayın. Aksi halde arka ucun aynı kimliği iki kez döndürmesi yöntemi değiştirir. Kimliğin temsil ettiği birimi belirleyip kanallar arasında koruyun. Bir kanal belge, diğeri iddia kimliği döndürüyorsa birleştirmeden önce ortak birime uzlaştırın; yalnızca aynı metin sağlam kimlik sözleşmesi değildir.

Tam eşit birleşik skorda kanonik kimlik sırası gibi belgeli sabit kural kullanın. Ağırlıklı birleştirmede sonlu olmayan ağırlığı reddedin; sıfırın kanalı kapatıp kapatmadığını belirleyin. Aynı retriever’ın iki kopyasına tam ağırlık vermek ilişkili kanıtı iki kez sayabilir. Fazla oy yanlış veya yetkisiz kaynağı kabul edilebilir yapmaz.

## Ağırlık değişince yeniden hesaplayın

> [!EXERCISE]
> **Kendinizi sınayın**
> Tabloda yoğun kanalın ağırlığını sıfırlayın. Hangi sıra kalır; D’ye ne olur?
>
> **Answer:** A, B, C sözcüksel sırada kalır. D sıfır katkı alır; sıfır skorlu adayın çıkarılması açık çıktı politikasıdır. Sıfır, D’nin yanlış veya ilgisiz olduğunu kanıtlamaz.

## Kaynaklar ve ileri okuma

1. [Cormack, Clarke & Büttcher (2009) · Reciprocal Rank Fusion](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)
2. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

