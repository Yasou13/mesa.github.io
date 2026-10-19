---
id: "bm25-tuning-for-domain-documents"
slug: "bm25-tuning-for-domain-documents"
type: "learn"
language: "tr"
title: "BM25: bir sözcük ne zaman daha önemli olur?"
subtitle: ""
summary: "Sözcük sıklığının, nadirliğin ve belge uzunluğunun sıralamayı nasıl etkilediğini hesaplayın. Modeli büyütmeden önce metnin nasıl işlendiğini inceleyin."
shortAnswer: "Sözcük sıklığının, nadirliğin ve belge uzunluğunun sıralamayı nasıl etkilediğini hesaplayın. Modeli büyütmeden önce metnin nasıl işlendiğini inceleyin."
category: "Memory & Retrieval"
tags: ["BM25", "IDF", "tokenization", "FTS5", "lexical", "sözcüksel", "Türkçe", "tokenizasyon"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "BM25: bir sözcük ne zaman daha önemli olur? — MESA"
seoDescription: "Sözcük sıklığının, nadirliğin ve belge uzunluğunun sıralamayı nasıl etkilediğini hesaplayın. Modeli büyütmeden önce metnin nasıl işlendiğini inceleyin."
lessonOrder: 5
learningStage: "retrieval"
prerequisites: ["semantic-search"]
learningObjectives: ["BM25 formülünü okumak", "Belge uzunluğu etkisini hesaplamak", "Tam kimlik ve Türkçe tokenizasyon testi tasarlamak"]
---

## Sözcüksel sıralamanın arkasındaki üç soru

“Atlas cuma saatleri” sorgusunda sözcük tabanlı arama, bu terimleri içeren pasajları bulur. BM25 hangi eşleşmenin daha önemli olduğuna karar verirken sözcüğün nadirliğini, belge içindeki sıklığını ve belge uzunluğunu birlikte kullanır. “Saat” sözcüğünü elli kez yineleyen ilgisiz bir belge sırf bu yüzden öne çıkmamalıdır. Nadir bir kimlik kodu çok daha ayırt edici olabilir.

Ters indeks, her terimi geçtiği belgelerle eşleştirir. Ancak hangi terimlerin oluşacağını metnin parçalanma yöntemi belirler. “A-17” kodu “a” ve “17” diye ayrılırsa sonradan puan ayarlamak kaybolan kimliği geri getirmez. Önce üretilen token’ları ve sorgunun nasıl çözümlendiğini inceleyin. Tam kimlik araması için ayrı bir alan veya eşitlik filtresi gerekebilir.

## Formülü çarpanlarına ayırın

```text
score(d,q) = sum over query terms t:
 IDF(t) * f(t,d)*(k1+1) /
 [f(t,d) + k1*(1-b + b*len(d)/avgdl)]

One common non-negative IDF variant:
IDF(t) = ln(1 + (N - df(t) + 0.5)/(df(t) + 0.5))
N: corpus documents   df: documents containing t
f: term frequency    avgdl: average document length
```

IDF, nadir geçen terimlere daha çok ağırlık verir. Sözcük sıklığının katkısı ise giderek azalır: İlk eşleşme, onuncudan on birinci tekrara geçişten daha önemlidir. `k1` bu doygunluğu, `b` belge uzunluğuna göre düzeltmeyi belirler. `b=0` uzunluk etkisini kaldırır; `b=1` tam uzunluk oranını kullanır. BM25 uygulamalarında IDF hesabı değişebilir; yalnızca parametreleri değil, kullanılan uygulamayı da kaydedin.

## Uzunluk etkisini hesaplayın

| Nicelik | Kısa pasaj A | Uzun pasaj B |
| --- | --- | --- |
| Terim sıklığı | 2 | 2 |
| Uzunluk / ortalama uzunluk | 0.5 | 2 |
| k1=1.2, b=0.75: payda | 2.75 | 4.10 |
| Pay: 2 × 2.2 | 4.4 | 4.4 |
| Sıklık çarpanı | 1.60 | 1.073 |

IDF ve sözcük sıklığı aynıysa kısa pasaj daha yüksek katkı alır. Bu hesap, kısa parçaların her durumda daha iyi olduğunu göstermez. Metni bölmek sözcük istatistiklerini, bağlam bütünlüğünü ve ilgili sayılan birimi değiştirir. Sıralama ayarını sınarken parçalamayı sabit tutun; parçalama değişikliğini ayrı bir deneyde değerlendirin.

## Hata örneklerine göre ayarlayın

<!-- diagram: Token’ları inceleyin, sözcüksel taban kurun, sonuçları etiketleyin, tek ayarı değiştirip tekrarlayın. -->
1. İncele · A-17 / I / İ
2. Taban · sabit parçalar
3. Etiketle · tam ve dolaylı
4. Değiştir · tek alan ağırlığı
5. Karşılaştır · ayrılmış sorgular

*Son skoru vereceğiniz örneklerle ayar yapmayın.*

Türkçe sorgu ve belgelerde noktalı/noktasız I, ekler ve düzeltme işaretleriyle oluşan farkları inceleyin. Küçük harfe dönüştürmek veya işaretleri kaldırmak bazı eşleşmeleri kolaylaştırırken anlamlı ayrımları da silebilir. Özgün metni koruyun; hem kimlik kodlarının tam eşleşmesini hem doğal dilde ilgili sonuçları bulma oranını test edin. Arama motorunun sorgu dili ve token üretimi, arayüzdeki metin normalizasyonundan ayrıdır.

SQLite FTS5 sabit `k1=1.2` ve `b=0.75` kullanır; `bm25(table, ...)` argümanları bu parametreler değil sütun ağırlıklarıdır. Daha iyi eşleşmeye daha küçük değer döndürdüğü için artan sıralama bilinçlidir. Başka motordan azalan-skor kuralı kopyalamayın. Hesap örneğimiz belirli bir IDF çeşidi kullanır; FTS5’in tam tanımı kendi referansındadır. [FTS5](https://www.sqlite.org/fts5.html).

## İlk teşhis adımını seçin

> [!EXERCISE]
> **Kendinizi sınayın**
> A-17 politikası araması her defasında A-71’i öne getiriyor. Hemen sıralama ağırlığını mı artırmalısınız?
>
> **Açıklama:** İndekslenen token ve sorgu sözdizimini inceleyin; sonra tam kimlik alanını test edin. İndeks kimlikleri ayırmıyorsa ağırlık bunu güvenilir biçimde onaramaz. Temsil doğru olduktan sonra skor ayarlayın.

## Kaynaklar ve ileri okuma

1. [Manning, Raghavan & Schütze · Okapi BM25](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html)
2. [SQLite · FTS5 reference](https://www.sqlite.org/fts5.html)

