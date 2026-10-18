---
id: "bm25-tuning-for-domain-documents"
slug: "bm25-tuning-for-domain-documents"
type: "learn"
language: "tr"
title: "BM25: nadir kelime neden tekrarlanan kelimeyi geçer?"
subtitle: ""
summary: "Terim sıklığını, nadirliği ve uzunluk normalizasyonunu hesaplayın. Büyük model aramadan önce tokenizasyonu ve alan ağırlıklarını inceleyin."
shortAnswer: "Terim sıklığını, nadirliği ve uzunluk normalizasyonunu hesaplayın. Büyük model aramadan önce tokenizasyonu ve alan ağırlıklarını inceleyin."
category: "Memory & Retrieval"
tags: ["BM25", "IDF", "tokenization", "FTS5", "lexical", "sözcüksel", "Türkçe", "tokenizasyon"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "BM25: nadir kelime neden tekrarlanan kelimeyi geçer? — MESA Learn"
seoDescription: "Terim sıklığını, nadirliği ve uzunluk normalizasyonunu hesaplayın. Büyük model aramadan önce tokenizasyonu ve alan ağırlıklarını inceleyin."
lessonOrder: 5
learningStage: "retrieval"
prerequisites: ["semantic-search"]
learningObjectives: ["BM25 formülünü okumak", "Belge uzunluğu etkisini hesaplamak", "Tam kimlik ve Türkçe tokenizasyon testi tasarlamak"]
---

## Sözcüksel sıralamanın arkasındaki üç soru

“Atlas cuma saatleri” için sözcüksel retriever sorgu terimlerini içeren pasajları bulur. Hangi eşleşmenin önemli olduğuna karar vermelidir. BM25 terim nadirliğini, belge içi sıklığı ve belge uzunluğu düzeltmesini birleştirir. “Saat” kelimesini elli kez tekrarlamak uzun ilgisiz belgeyi yenilmez yapmamalıdır; nadir kimlik daha ayırt edici ipucu olabilir.

Ters indeks terimi onu içeren belgelere eşler. Terimleri sıralamadan önce tokenizasyon belirler. “A-17”, “a” ve “17” olarak bölünürse skor ayarı hiç indekslenmemiş kimlik sınırını geri getiremez. Önce token’ları ve sorgu ayrıştırmasını inceleyin. Tam kimlik ayrı normalize alan veya eşitlik filtresi gerektirebilir.

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

IDF nadir terime daha fazla etki verir. Sıklık kesri doygunlaşır: sıfırdan bir tekrara çıkmak, ondan on bire çıkmaktan daha önemlidir. `k1` doygunluğu, `b` uzunluk normalizasyonunu kontrol eder. `b=0` iken uzunluk etkisizdir; `b=1` iken tam uzunluk oranı girer. BM25 sürümleri IDF ayrıntısında farklılaşır; parametre adlarıyla birlikte uygulamayı da kaydedin.

## Uzunluk etkisini hesaplayın

| Nicelik | Kısa pasaj A | Uzun pasaj B |
| --- | --- | --- |
| Terim sıklığı | 2 | 2 |
| Uzunluk / ortalama uzunluk | 0.5 | 2 |
| k1=1.2, b=0.75: payda | 2.75 | 4.10 |
| Pay: 2 × 2.2 | 4.4 | 4.4 |
| Sıklık çarpanı | 1.60 | 1.073 |

Aynı IDF ve sıklıkta kısa pasaj daha büyük katkı alır. Bu hesap kısa parçaların her zaman iyi olduğunu kanıtlamaz. Belgeleri bölmek terim istatistiğini, bağlam tamlığını ve ilgili sayılan birimi değiştirir. Sıralama değişikliğini test ederken parçalamayı sabit tutun; sonra parçalamayı ayrı deneyde değerlendirin.

## Hata örneklerine göre ayarlayın

<!-- diagram: Token’ları inceleyin, sözcüksel taban kurun, sonuçları etiketleyin, tek ayarı değiştirip tekrarlayın. -->
1. İncele · A-17 / I / İ
2. Taban · sabit parçalar
3. Etiketle · tam ve dolaylı
4. Değiştir · tek alan ağırlığı
5. Karşılaştır · ayrılmış sorgular

*Son skoru vereceğiniz örneklerle ayar yapmayın.*

Türkçe için gerçek sorgu/belge çiftlerinde noktalı/noktasız I, ekler ve aksanları inceleyin. Küçük harfe çevirme ve işaret kaldırma bazı eşleşmelere yardımcı olurken anlamlı ayrımları silebilir. Özgün metni koruyup hem kimlik kesinliğini hem doğal dil recall’unu test edin. Arama sözdizimi ve tokenizer davranışı, arayüzün metin normalizasyonundan ayrıdır.

SQLite FTS5 sabit `k1=1.2` ve `b=0.75` kullanır; `bm25(table, ...)` argümanları bu parametreler değil sütun ağırlıklarıdır. Daha iyi eşleşmeye daha küçük değer döndürdüğü için artan sıralama bilinçlidir. Başka motordan azalan-skor kuralı kopyalamayın. Hesap örneğimiz belirli bir IDF çeşidi kullanır; FTS5’in tam tanımı kendi referansındadır. [FTS5](https://www.sqlite.org/fts5.html).

## İlk teşhis adımını seçin

> [!EXERCISE]
> **Kendinizi sınayın**
> A-17 politikası araması her defasında A-71’i öne getiriyor. Hemen sıralama ağırlığını mı artırmalısınız?
>
> **Answer:** İndekslenen token ve sorgu sözdizimini inceleyin; sonra tam kimlik alanını test edin. İndeks kimlikleri ayırmıyorsa ağırlık bunu güvenilir biçimde onaramaz. Temsil doğru olduktan sonra skor ayarlayın.

## Kaynaklar ve ileri okuma

1. [Manning, Raghavan & Schütze · Okapi BM25](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html)
2. [SQLite · FTS5 reference](https://www.sqlite.org/fts5.html)

