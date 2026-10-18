---
id: "semantic-search"
slug: "semantic-search"
type: "learn"
language: "tr"
title: "Embedding ve anlamsal arama: sayılarla açıklama"
subtitle: ""
summary: "Benzerliği hesaplayın, yoğun ve seyrek temsili ayırın; en yakın komşunun neden gerçeklik veya erişim kararı olmadığını anlayın."
shortAnswer: "Benzerliği hesaplayın, yoğun ve seyrek temsili ayırın; en yakın komşunun neden gerçeklik veya erişim kararı olmadığını anlayın."
category: "Memory & Retrieval"
tags: ["embedding", "dense", "sparse", "cosine", "vector", "vektör", "kosinüs", "anlamsal arama"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Embedding ve anlamsal arama: sayılarla açıklama — MESA Learn"
seoDescription: "Benzerliği hesaplayın, yoğun ve seyrek temsili ayırın; en yakın komşunun neden gerçeklik veya erişim kararı olmadığını anlayın."
lessonOrder: 4
learningStage: "retrieval"
prerequisites: ["structured-vs-unstructured-memory"]
learningObjectives: ["Küçük örnekte kosinüs benzerliği hesaplamak", "Temsille en yakın komşu indeksini ayırmak", "Model kimliği ve tam eşleşme sınırlarını görmek"]
---

## Embedding neyi temsil eder?

Embedding modeli girdiyi vektör halinde düzenlenmiş sayılara dönüştürür. Eğitim, bazı ilişkilerin geometrik yakınlıkta görünmesini teşvik eder. “Açılış saatleri” belgesi ortak kelime olmadan “ne zaman girebilirim?” sorusuna yakın olabilir. Aday retrieval için yararlıdır. Koordinatlar öğrenilmiş özelliklerdir; “doğruluk”, “izin” veya “güncellik” gibi etiketli sütunlar değildir.

Yoğun temsil genellikle çok sayıda sıfır olmayan değer içeren sabit uzunluklu dizidir. Seyrek temsil çok daha büyük uzaydan az sayıda ağırlıklı boyut tutar. Klasik sözcüksel boyutlar terimlere karşılık gelir; öğrenilmiş seyrek modeller bunları genişletebilir veya yeniden ağırlıklandırabilir. Seyrek “öğrenmesiz”, yoğun ise “alanda daha iyi retrieval” demek değildir. Seçim kendi sorularınızda ölçüm gerektirir.

## İki boyutlu benzerlik hesabı

```text
cosine(q, d) = dot(q, d) / (norm(q) * norm(d))
q = [1, 0]
A = [0.8, 0.6]   norm(A) = 1   cosine(q,A) = 0.8
B = [0, 1]       norm(B) = 1   cosine(q,B) = 0
C = [8, 6]       norm(C) = 10  cosine(q,C) = 0.8
```

A ve C’nin kosinüs benzerliği aynıdır; kosinüs uzunluğu değil yönü karşılaştırır. Ham iç çarpım A için 0,8, C için 8’dir. Birim uzunluğa normalize edilmiş vektörlerde kosinüs ile iç çarpım aynıdır; normalizasyon yoksa aynı olmak zorunda değildir. Bu kurgusal iki boyutlu vektörler yalnızca hesabı açıklar. Dil modeli çıktısı veya anlamsal kalite kanıtı değildir.

0,8 benzerlik, yüzde 80 ilgililik olasılığı değildir. Anlamı embedding modeline, skor dağılımına ve göreve bağlıdır. Bir veri kümesinde çalışan eşik; dil, parçalama veya model değişince bozulabilir. Eşiği etiketlenmiş sorgularla ayarlayın ve precision/recall dengesini izleyin.

## Kodlama ile indeksleme farklı adımlardır

<!-- diagram: Belge ve sorgu kodlayıcıları vektör karşılaştırmasını besler; uygunluk bağımsız uygulanır. -->
1. Kaynak · parça + revizyon
2. Kodla · sabit model kimliği
3. İndeks · tam veya yaklaşık
4. Sorgu · uyumlu kodlayıcı
5. Doğrula · kapsam + kanıt

*Vektör indeksi karşılaştırmayı hızlandırır. Kaydın anlamını belirlemez.*

Tam arama uygun her vektörü skorlar. Yaklaşık en yakın komşu araması daha düşük maliyet karşılığında bazı komşuları kaçırabilir. Aynı uzaklık ve kapsamla yönetilebilir örnekte tam aramaya kıyasla yaklaşım kaybını ölçün. Anlamsal ilgililiği insan etiketleriyle ayrıca ölçün; indeks en yakın vektörleri kusursuz bulurken bu vektörler kötü yanıtlar olabilir.

## Boyutların eşleşmesi yeterli değildir

Sağlayıcı, model, revizyon, boyut, normalizasyon ve kodlama talimatını kaydedin. İki model de 768 sayı döndürüp uyumsuz uzay kullanabilir. Bazı retrieval modelleri farklı sorgu/belge kodlayıcısı veya öneki ister; uyumluluk mutlaka aynı metin değil, modelin öngördüğü eşleşmedir. Temsili değiştirmek çoğunlukla belgeleri yeniden kodlayıp türetilmiş indeksi kurmayı gerektirir.

Kimlikler, olumsuzluk ve benzer revizyonlar sınırları ortaya çıkarır. “A-17 kuralı uygulanır” ve “A-17 kuralı uygulanmaz” anlamsal olarak yakın olabilir. Tam semboller için sözcüksel retrieval, geçerlilik için yapılı filtre kullanın. DPR ve Sentence-BERT öğrenilmiş yoğun retrieval ve cümle temsili örnekleridir; her çok dilli arşiv için garanti değildir. [DPR](https://arxiv.org/abs/2004.04906), [Sentence-BERT](https://arxiv.org/abs/1908.10084).

## Şüpheli iyileşmeyi açıklayın

> [!EXERCISE]
> **Kendinizi sınayın**
> Model değişince vektörler hâlâ 768 boyutlu ve servis sonuç döndürüyor. Eski belge indeksini kullanmak için yeterli mi?
>
> **Answer:** Hayır. Sorgu/belge temsil sözleşmesini kontrol edin; uyumsuzsa yeniden kodlayın. Yapısal olarak geçerli vektör başka uzayda olabilir. Hem komşu bulmayı hem görev ilgililiğini değerlendirin.

## Kaynaklar ve ileri okuma

1. [Karpukhin et al. (2020) · Dense Passage Retrieval](https://arxiv.org/abs/2004.04906)
2. [Reimers & Gurevych (2019) · Sentence-BERT](https://arxiv.org/abs/1908.10084)
3. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)

