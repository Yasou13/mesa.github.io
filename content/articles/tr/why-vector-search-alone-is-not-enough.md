---
id: "vector-search-limits"
slug: "why-vector-search-alone-is-not-enough"
type: "learn"
language: "tr"
title: "Vektör arama neden ajan hafızası için tek başına yetersizdir?"
subtitle: "Durum bilgisi tutan yapay zekâ sistemlerinde anlamsal benzerliğin güçlü ve sınırlı yönleri"
summary: "Vektör arama yapılandırılmamış metin üzerinde anlamsal benzerlikte mükemmeldir; ancak ajan hafızası kesin tanımlayıcılar, ilişkisel join'ler, zamansal geçerlilik ve sıkı yetkilendirme gerektirir."
shortAnswer: "Dense vektör arama kavramsal geri getirmede son derece güçlüdür; ancak kesin anahtar kelime eşleştirmede, çok sekmeli ilişkisel yollarda, zamansal güncellemelerde ve deterministik erişim denetimlerinde zorlanır."
category: "Memory & Retrieval"
tags: ["vector-search", "embeddings", "retrieval", "search-limits"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-01"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Vektör Arama Neden Ajan Hafızası İçin Tek Başına Yetersizdir? — MESA Learn"
seoDescription: "Ajan hafızasında anlamsal benzerliğin güçlü ve sınırlı yönlerini analiz edin: kesin tanımlayıcılar, ilişkisel join'ler, zamansal geçerlilik ve kapsam izolasyonu."
---

## Vektör aramanın olağanüstü iyi yaptığı şeyler

Dense vektör arama, doğal dili geometrik embedding uzaylarına eşleyerek bilgi erişiminde devrim yarattı. Bir sorgu ve belge tamamen farklı sözcükler kullanarak aynı kavramı ifade ettiğinde, kosinüs benzerliği anlamsal köprüyü kurar.

- Yaklaşık anlamsal eşleşme: 'Otomobil arızası' ifadesinin 'araba motoru bozulması' ile ilişkili olduğunu anlama.
- Eş anlamlılara ve ifadelere direnç: Farklı cümle yapılarına rağmen ilgili içeriği geri getirme.
- Çok dilli eşleme: Farklı dillerdeki kavramları ortak anlamsal uzayda bağlama.
- Yapılandırılmamış keşif: Katı veritabanı şemaları gerekmeden ilgili metin parçalarını bulma.

> [!NOTE]
> **Vektör veritabanları genel olarak yetersiz değildir**
> Vektör veritabanları tasarlandıkları işi son derece iyi yapar: statik embedding'ler üzerinde yaklaşık en yakın komşu araması. Sınırlılıklar; vektör aramanın tasarlanmadığı ilişkisel, zamansal ve yetkilendirme sorunlarını tek başına çözmeye zorlandığında ortaya çıkar.

## Hata modu 1: Kesin tanımlayıcılar ve sözcük uyumsuzluğu

Dense embedding'ler değişken uzunluktaki metinleri sabit boyutlu vektörlere (örneğin 768 veya 1536 kayan noktalı sayı) sıkıştırır. Bu kayıplı sıkıştırma, kesin token kimliklerini göz ardı eder.

> [!WARNING]
> **Kesin tanımlayıcı kör noktası**
> Uzmanlık alanlarında ajanlar sık sık kesin kodları sorgular: kanun maddeleri (`Madde 314/2`), dosya esas numaraları (`2023/1458`), hata kodları (`ERR_CONN_REFUSED`) veya kullanıcı kimlikleri (`usr_98af`). Vektör uzayında küçük karakter farkları öngörülemez mesafelere yol açar. Yüksek benzerlik, kesin tanımlayıcının eşleştiğini garanti etmez.

BM25 gibi lexical arama algoritmaları kesin token örtüşmesinde mükemmeldir. Lexical indeksleri tamamen terk edip yalnızca vektör aramaya güvenmek, ajanın kesin olgusal atıfları hatırlama yeteneğini zayıflatır.

## Hata modu 2: Çok sekmeli ilişkisel sorgular

Vektörler her metin parçasını bağımsız bir geometrik nokta olarak ele alır. Kenarlar, mülkiyet veya çok sekmeli ilişki yolları kavramına sahip değillerdir.

> [!TIP]
> **İlişkisel sorgu problemi**
> 'Ahmet tarafından imzalanan ve tahkim şartı içeren sözleşmeler hangileridir?' sorgusunu düşünün. Vektör uzayında 'Ahmet', 'sözleşme' ve 'tahkim' içeren belgeler orta düzeyde benzerlik alır; ancak vektör mesafesi Ahmet'in tahkim içeren o somut sözleşmeyi bizzat imzaladığını doğrulayamaz. Bunu yanıtlamak açık ilişkisel graph yollarını gezmeyi gerektirir: `(Ahmet)-[:İMZALADI]->(Sözleşme)-[:TABİDİR]->(Tahkim)`.

## Hata modu 3 & 4: Zamansal geçersiz kılma ve yetkilendirme

Çok ajanlı ortamlarda iki operasyonel gereksinim salt vektör mimarilerini zorlar:

1. Zamansal Geçersiz Kılma: Vektör benzerliği zamana göre kendiliğinden sönümlenmez. Bir ajan 'Kullanıcı Roma'da yaşıyor' ve daha sonra 'Kullanıcı Madrid'e taşındı' kaydettiğinde, iki vektör de 'Kullanıcı nerede yaşıyor?' sorusuna yakın kalır. Zaman metaverisi olmadan retriever çelişkili durum döndürür.
2. Yetkilendirme ve Kapsam İzolasyonu: Vektör araması genel indekste yapılıp yetkisiz kayıtları ayıklamak için sonradan filtreleme (post-filtering) kullanılırsa, top-k budanması yaşanır: en yakın 10 sonuç Tenant B'ye aitse ve filtrelenirse, Tenant A için sistemde ilgili kayıtlar olmasına rağmen sıfır sonuç döner.

## Çok hatlı çözüm mimarisi

Çözüm vektör aramadan vazgeçmek değil; onu tamamlayıcı arama mekanizmalarıyla çok hatlı bir mimaride birleştirmektir:

- [ ] Dense Vektör Hattı: Anlamsal kavramsal hatırlama ve eş anlamlı eşleme.
- [ ] Sparse Lexical Hat (BM25): Kesin tanımlayıcılar, varlık adları ve kod eşleşmeleri.
- [ ] Yapılandırılmış Assertion Hattı: Mantıksal filtreleme, sayısal aralıklar ve zamansal geçerlilik.
- [ ] İlişkisel Graph Hattı: Açık varlık bağlantıları üzerinde çok sekmeli yol gezinimi.
- [ ] Birleşim Öncesi Kapsam Filtreleme: Vektör taramasından veya birleşimden önce güvenlik sınırlarını uygulama.

Bunun pratikte nasıl uygulandığını [Hybrid Retrieval Açıklaması](learn/hybrid-retrieval-explained/) rehberimizde okuyabilir ve [MESA Core](mesa/) mimarisinin dört farklı hattı nasıl koordine ettiğini inceleyebilirsiniz.

## Kaynaklar

1. [Karpukhin vd. (2020) — Dense Passage Retrieval for Open-Domain Question Answering](https://arxiv.org/abs/2004.04906)
2. [Robertson & Zaragoza (2009) — The Probabilistic Relevance Framework: BM25 and Beyond](https://www.nowpublishers.com/article/Details/INR-019)
3. [MESA Bağımsız Retrieval Denetimi ve Test Fixture'ları](https://mesamemory.dev/how-it-works/)

