---
id: "reciprocal-rank-fusion"
slug: "reciprocal-rank-fusion-explained"
type: "learn"
language: "tr"
title: "RRF nedir? Reciprocal Rank Fusion nasıl çalışır?"
subtitle: ""
summary: "RRF, arama sonuçlarını ham puanlar yerine listedeki sıralarıyla birleştirir. Formülü öğrenin, örneği hesaplayın ve k değerini seçin."
shortAnswer: "Reciprocal Rank Fusion (RRF), birden fazla sıralı listeyi tek listede birleştirir. Her sonuç, bulunduğu her listeden 1/(k + sıra) katkısı alır ve sonuçlar toplam katkıya göre sıralanır. Konumları kullandığı için BM25 ile vektör aramayı puanları normalize etmeden birleştirebilir."
category: "Memory & Retrieval"
tags: ["RRF", "rank fusion", "weighted", "k=60", "sıra birleştirme", "ağırlık"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-11-24"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "RRF Nedir? Reciprocal Rank Fusion ve k=60 — MESA"
seoDescription: "RRF, sonuç listelerini ham puanlar yerine sıralarıyla birleştirir. Formülü, çözümlü örneği, k değerinin neden çoğu zaman 60 olduğunu ve sınırlarını öğrenin."
lessonOrder: 7
learningStage: "retrieval"
prerequisites: ["hybrid-retrieval"]
learningObjectives: ["Üç aday için RRF hesaplamak", "Yumuşatma sabiti ve kanal ağırlığını anlamak", "Tekrar, eksik sıra ve eşitlik politikasını tanımlamak"]
---

## RRF nedir?

Reciprocal Rank Fusion (RRF), birden fazla sıralı sonuç listesini tek listeye dönüştüren bir sıralama birleştirme yöntemidir. Listenin üst sıralarındaki sonuç daha büyük katkı alır. Birden fazla listede bulunan sonuç ise bu katkıları toplar.

RRF hibrit aramada sık kullanılır, çünkü BM25 puanları ile vektör benzerlikleri farklı ölçeklerdedir. RRF bu ham değerleri yok sayar ve yalnızca sonucun sırasını kullanır.

## Farklı listelerdeki sıraları kullanın

Atlas arşivinde iki arama yöntemi farklı listeler üretsin: Sözcük tabanlı liste A, B, C; anlamsal liste B, C, D olsun. Ham puanları aynı ölçekteymiş gibi toplamadan bu listeleri birleştirmek istiyorsunuz. Reciprocal Rank Fusion (RRF), her konuma giderek azalan bir katkı verir ve aynı adayın farklı listelerdeki katkılarını toplar. Hesabı açık, basit bir başlangıç yöntemidir.

Cormack, Clarke ve Büttcher, yöntemi belirli arama deneylerinde değerlendirdi. Sonuçları RRF’yi denemek için gerekçe sunar; her görevde iyileşme garantisi vermez. Özgün yöntemde katkılar eşit ağırlıktadır. Ağırlıklı RRF ise her kanalın katkısını ayrıca belirlenen bir ağırlıkla çarpar. [Özgün makale](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)

## Sıralamayı birden başlatın

```text
RRF(d) = d’yi içeren kanallar üzerinden toplam: w_kanal / (k + sıra_kanal(d))
Sıra 1’den başlar; listede olmayan aday 0 katkı alır.
Aşağıdaki örnek: k = 60, tüm ağırlıklar = 1.
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

## RRF’de k neden çoğu zaman 60?

Bu değer [2009 tarihli özgün SIGIR makalesinden](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf) gelir. Cormack, Clarke ve Büttcher, k = 60 değerini pilot çalışmada sabitlemiş ve doğrulama sırasında değiştirmemiştir. Pilot sonuçlarında 60’ın optimuma yakın olduğunu, ancak seçimin kritik olmadığını bildirmişlerdir.

Arama sistemleri çoğu zaman bu başlangıç noktasını korur. [Elasticsearch](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion) `rank_constant` değerini varsayılan olarak 60 yapar. [Azure AI Search](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking) da 60’ı deneylerde iyi sonuç veren küçük bir değer olarak anar. Bunlar, 60’ın sizin belgeleriniz için en iyi değer olduğunu kanıtlamaz.

| k | 1. sıra | 2. sıra | 10. sıra | 1. sıra / 10. sıra |
| --- | --- | --- | --- | --- |
| 1 | 0,5000 | 0,3333 | 0,0909 | 5,50× |
| 10 | 0,0909 | 0,0833 | 0,0500 | 1,82× |
| 60 | 0,0164 | 0,0161 | 0,0143 | 1,15× |

Son sütun, k değerinin üst sıraları ne kadar öne çıkardığını gösterir. k = 1 iken birinci sıra, onuncu sıranın 5,50 katı değerlidir. k = 60 iken bu oran yalnızca 1,15’tir; yani listeler arasındaki uyum, tek bir birincilikten daha önemli hâle gelir.

> [!NOTE]
> **İki farklı k değerini karıştırmayın**
> Vektör aramada k çoğu zaman döndürülecek en yakın komşu sayısıdır. RRF’deki k ise ayrı bir yumuşatma sabitidir.

## Uç durumları dağıtımdan önce belirleyin

Katkıları toplamadan önce her kanalın kendi içindeki tekrarları ayıklayın. Aynı kimliğin iki kez dönmesi iki katkı sayılırsa yöntem değişir. Kimliğin belgeyi mi, pasajı mı, bilgi kaydını mı gösterdiğini belirleyin. Kanallar farklı birimler döndürüyorsa önce ortak birimde eşleştirin. Metnin aynı olması tek başına güvenilir kimlik eşleştirmesi değildir.

Toplam puanlar eşitse asıl kayıt kimliğine göre sıralama gibi sabit ve belgelenmiş bir kural kullanın. Ağırlıklı birleştirmede sonlu olmayan ağırlıkları reddedin; sıfır ağırlığın kanalı kapatıp kapatmadığını açıkça belirleyin. Aynı arama yönteminin iki kopyasına tam ağırlık vermek aynı dayanağı iki kez sayabilir. Çok katkı alması, yanlış veya yetkisiz bir kaynağı kabul edilebilir yapmaz.

## RRF, puan normalizasyonu ve yeniden sıralama farkı

| Yöntem | Kullandığı bilgi | Güçlü yanı | Temel sınırı |
| --- | --- | --- | --- |
| RRF | Sıralar | Basittir; eğitim veya puan kalibrasyonu istemez | Puan farkının büyüklüğünü yok sayar |
| Puan normalizasyonu | Yeniden ölçeklenmiş puanlar | Puan farklarını korur | Normalizasyona ve puan dağılımına bağlıdır |
| Cross-encoder ile yeniden sıralama | Sorgu ve pasaj metni | Anlamı daha doğrudan karşılaştırabilir | Daha pahalıdır ve yalnızca kısa listeyi görür |

## RRF ne zaman kullanılmamalı?

- Tek bir arama yönteminiz varsa birleştirilecek liste yoktur.
- Puan farkları güvenilir bir anlam taşıyorsa ve bunu kaybetmek istemiyorsanız.
- Kanallar neredeyse aynı sonuçları döndürüyorsa birleştirme az yeni kanıt ekler.
- Kalibre edilmiş bir güven değeri gerekiyorsa. RRF puanı olasılık değildir.
- Daha iyi bir sıralama modelini eğitip doğrulayacak kadar etiketli veriniz varsa.

MESA Core 0.9.4, k = 60 ile ağırlıklı RRF kullanır. Vektör ağırlığı 8, BM25 ağırlığı 1, bilgi kaydı ağırlığı 0, çizge ağırlığı 1’dir. Çizge kanalı varsayılan olarak kapalıdır; ağırlığı yalnızca bu kanal açıkken geçerlidir. Bunlar bu sistemin varsayılanlarıdır, evrensel ayarlar değildir. Ayrıntılar için [arama dokümanına](/docs/core/retrieval-and-graph/) bakın.

## MESA’da ne ölçtük?

MESA’daki 8 vektör ağırlığı teoriden değil, dev kümesindeki bir denemeden geldi. Yalnızca bu ağırlığı değiştirdik, diğer kanalları 1’de tuttuk.

| Vektör ağırlığı | Hit@5, yeniden sıralama yok | MRR, yeniden sıralama yok | MRR, yeniden sıralamayla |
| --- | --- | --- | --- |
| 1 | 0,5176 | 0,3953 | 0,6816 |
| 2 | 0,5765 | 0,4565 | 0,7055 |
| 4 | 0,6588 | 0,5152 | 0,7069 |
| 8 | 0,6706 | 0,5663 | 0,6973 |

> [!NOTE]
> **Kurulum**
> 0.9.1 geliştirme derlemesi, benchmark v1 dev bölümü, Tier M, 141 belge, 5.041 parça, 85 yanıtlanabilir soru, bge-m3, çizge açık, arama limiti 50, yeniden sıralama derinliği 50.

Yeniden sıralama olmadan en iyi sonucu 8 verdi. Yeniden sıralamayla 4’ün MRR değeri biraz daha yüksekti. Denediğimiz en büyük değer de 8’di; yani daha yüksek bir ağırlığın daha iyi olup olmadığını bilmiyoruz. Bu denemeyi benchmark v2’de yinelemedik.

Büyük ağırlık, yukarıdaki çözümlü örneği de değiştirir. Yoğun (dense) kanalın ağırlığı 8 olursa puanlar B 0,147277, C 0,144905, D 0,126984 ve A 0,016393 olur. A sözcük listesinde birinci olduğu hâlde D artık A’nın önüne geçer.

Eşit RRF puanları da sık görülür. [Sıfırdan kurulan depolarla yaptığımız testte](/research/why-two-search-runs-differed/) rastgele eşitlik bozma, 112 yanıtlanabilir sorunun 49’unda sırayı değiştirdi (benchmark v2 dev, Tier M, modeller kapalı, 0.9.4 öncesi derleme). Bilgi kaydı ağırlığını 0 yapmak, T0 ve T1b’yi dev kümesinde iyileştiren, yeniden sıralamalı dev Hit@5’i ise 0,9286’dan 0,9107’ye düşüren [0.9.4 değişikliğinin](/research/what-improved-search-in-0-9-4/) parçasıydı.

## Ağırlık değişince yeniden hesaplayın

> [!EXERCISE]
> **Kendinizi sınayın**
> Tabloda yoğun kanalın ağırlığını sıfırlayın. Hangi sıra kalır; D’ye ne olur?
>
> **Açıklama:** A, B, C sözcüksel sırada kalır. D sıfır katkı alır; sıfır skorlu adayın çıkarılması açık çıktı politikasıdır. Sıfır, D’nin yanlış veya ilgisiz olduğunu kanıtlamaz.

## RRF hakkında sorular

**RRF puan normalizasyonu gerektirir mi?**
: Hayır. RRF sıraları kullandığı için BM25 ve vektör puanlarının ortak ölçekte olması gerekmez.

**RRF için iyi bir k değeri nedir?**
: 60 ile başlayın, ardından 10, 30 ve 100 gibi birkaç değeri kendi verinizdeki etiketli sorularla karşılaştırın.

**RRF’de sıra 0’dan mı 1’den mi başlar?**
: Özgün formül ve Elasticsearch sırayı 1’den başlatır. Bunu tutarlı kullanın, çünkü sıfır tabanlı sıra bütün katkıları değiştirir.

**Belge bir listede yoksa ne olur?**
: O liste belgeye 0 katkı verir. Belgenin bulunduğu diğer listeler sayılmaya devam eder.

**Yüksek RRF puanı güven puanı mıdır?**
: Hayır. Tek bir sorgudaki sonuçları sıralamak için kullanışlıdır. Yanıtın doğru olma olasılığı olarak okunmamalıdır.

## Kaynaklar ve ileri okuma

1. [Cormack, Clarke & Büttcher (SIGIR 2009) · Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)
2. [MESA Core v0.9.4 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/e30856ec6e7ed9146bb9af992565e864f727b0b9/docs/architecture-v4.md)
3. [Elastic · Reciprocal rank fusion](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion)
4. [Microsoft Learn · Hibrit arama puanlaması (RRF)](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking)

