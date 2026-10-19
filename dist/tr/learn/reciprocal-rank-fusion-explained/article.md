---
id: "reciprocal-rank-fusion"
slug: "reciprocal-rank-fusion-explained"
type: "learn"
language: "tr"
title: "RRF: iki sıralama nasıl birleştirilir?"
subtitle: ""
summary: "İki sonuç listesini adım adım birleştirin; tekrarları, eşit puanları ve ağırlıkları inceleyin. RRF puanının neden doğruluk olasılığı olmadığını öğrenin."
shortAnswer: "İki sonuç listesini adım adım birleştirin; tekrarları, eşit puanları ve ağırlıkları inceleyin. RRF puanının neden doğruluk olasılığı olmadığını öğrenin."
category: "Memory & Retrieval"
tags: ["RRF", "rank fusion", "weighted", "k=60", "sıra birleştirme", "ağırlık"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "RRF: iki sıralama nasıl birleştirilir? — MESA"
seoDescription: "İki sonuç listesini adım adım birleştirin; tekrarları, eşit puanları ve ağırlıkları inceleyin. RRF puanının neden doğruluk olasılığı olmadığını öğrenin."
lessonOrder: 7
learningStage: "retrieval"
prerequisites: ["hybrid-retrieval"]
learningObjectives: ["Üç aday için RRF hesaplamak", "Yumuşatma sabiti ve kanal ağırlığını anlamak", "Tekrar, eksik sıra ve eşitlik politikasını tanımlamak"]
---

## Farklı listelerdeki sıraları kullanın

Atlas arşivinde iki arama yöntemi farklı listeler üretsin: Sözcük tabanlı liste A, B, C; anlamsal liste B, C, D olsun. Ham puanları aynı ölçekteymiş gibi toplamadan bu listeleri birleştirmek istiyorsunuz. Reciprocal Rank Fusion (RRF), her konuma giderek azalan bir katkı verir ve aynı adayın farklı listelerdeki katkılarını toplar. Hesabı açık, basit bir başlangıç yöntemidir.

Cormack, Clarke ve Büttcher, yöntemi belirli arama deneylerinde değerlendirdi. Sonuçları RRF’yi denemek için gerekçe sunar; her görevde iyileşme garantisi vermez. Özgün yöntemde katkılar eşit ağırlıktadır. Ağırlıklı RRF ise her kanalın katkısını ayrıca belirlenen bir ağırlıkla çarpar. [Özgün makale](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)

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

Birleşen liste B, C, A, D olur. A tek kanalda birinci olsa da iki listede birden öne çıkan B ve C daha yüksek toplam katkı alır. Bir kanalın kısaltılmış listesinde bulunmayan aday, o kanaldan sıfır katkı alır; ona sıfırıncı veya sonsuzuncu sıra verilmez. Listenin nereden kesildiği sonucu etkilediği için bu sınırları deney kaydında belirtin.

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

Katkıları toplamadan önce her kanalın kendi içindeki tekrarları ayıklayın. Aynı kimliğin iki kez dönmesi iki katkı sayılırsa yöntem değişir. Kimliğin belgeyi mi, pasajı mı, bilgi kaydını mı gösterdiğini belirleyin. Kanallar farklı birimler döndürüyorsa önce ortak birimde eşleştirin. Metnin aynı olması tek başına güvenilir kimlik eşleştirmesi değildir.

Toplam puanlar eşitse asıl kayıt kimliğine göre sıralama gibi sabit ve belgelenmiş bir kural kullanın. Ağırlıklı birleştirmede sonlu olmayan ağırlıkları reddedin; sıfır ağırlığın kanalı kapatıp kapatmadığını açıkça belirleyin. Aynı arama yönteminin iki kopyasına tam ağırlık vermek aynı dayanağı iki kez sayabilir. Çok katkı alması, yanlış veya yetkisiz bir kaynağı kabul edilebilir yapmaz.

## Ağırlık değişince yeniden hesaplayın

> [!EXERCISE]
> **Kendinizi sınayın**
> Tabloda yoğun kanalın ağırlığını sıfırlayın. Hangi sıra kalır; D’ye ne olur?
>
> **Açıklama:** A, B, C sözcüksel sırada kalır. D sıfır katkı alır; sıfır skorlu adayın çıkarılması açık çıktı politikasıdır. Sıfır, D’nin yanlış veya ilgisiz olduğunu kanıtlamaz.

## Kaynaklar ve ileri okuma

1. [Cormack, Clarke & Büttcher (2009) · Reciprocal Rank Fusion](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)
2. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

