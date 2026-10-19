---
id: "semantic-search"
slug: "semantic-search"
type: "learn"
language: "tr"
title: "Anlamsal arama: vektörler neyi anlatır?"
subtitle: ""
summary: "Sayısal temsillerin nasıl karşılaştırıldığını örneklerle görün. Benzerliğin neden doğruluk veya erişim izni anlamına gelmediğini öğrenin."
shortAnswer: "Sayısal temsillerin nasıl karşılaştırıldığını örneklerle görün. Benzerliğin neden doğruluk veya erişim izni anlamına gelmediğini öğrenin."
category: "Memory & Retrieval"
tags: ["embedding", "dense", "sparse", "cosine", "vector", "vektör", "kosinüs", "anlamsal arama"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Anlamsal arama: vektörler neyi anlatır? — MESA"
seoDescription: "Sayısal temsillerin nasıl karşılaştırıldığını örneklerle görün. Benzerliğin neden doğruluk veya erişim izni anlamına gelmediğini öğrenin."
lessonOrder: 4
learningStage: "retrieval"
prerequisites: ["structured-vs-unstructured-memory"]
learningObjectives: ["Küçük örnekte kosinüs benzerliği hesaplamak", "Temsille en yakın komşu indeksini ayırmak", "Model kimliği ve tam eşleşme sınırlarını görmek"]
---

## Embedding neyi temsil eder?

Bir sayısal temsil (embedding) modeli, girdiyi vektör hâlinde düzenlenmiş sayılara dönüştürür. Eğitim sırasında bazı anlam ilişkileri bu uzaydaki yakınlığa yansır. Örneğin “Açılış saatleri” başlıklı belge, ortak sözcük bulunmasa da “Ne zaman girebilirim?” sorusuna yakın çıkabilir. Bu yöntem aday bulmaya yardımcı olur. Ancak vektörün boyutları “doğruluk”, “erişim izni” veya “güncellik” gibi açıkça adlandırılmış alanlar değildir.

Yoğun temsil, genellikle çok sayıda sıfır olmayan değer içeren sabit uzunlukta bir dizidir. Seyrek temsil ise çok daha büyük bir uzaydan az sayıda boyut ve ağırlık tutar. Klasik sözcük tabanlı temsillerde boyutlar terimlere karşılık gelir; öğrenilmiş seyrek modeller bu terimleri genişletebilir veya ağırlıklarını değiştirebilir. Seyrek olması modelin öğrenmediği, yoğun olması da her alanda daha iyi aradığı anlamına gelmez. Seçimi kendi sorularınızla ölçerek yapın.

## İki boyutlu benzerlik hesabı

```text
cosine(q, d) = dot(q, d) / (norm(q) * norm(d))
q = [1, 0]
A = [0.8, 0.6]   norm(A) = 1   cosine(q,A) = 0.8
B = [0, 1]       norm(B) = 1   cosine(q,B) = 0
C = [8, 6]       norm(C) = 10  cosine(q,C) = 0.8
```

A ve C’nin kosinüs benzerliği aynıdır; kosinüs uzunluğu değil yönü karşılaştırır. Ham iç çarpım A için 0,8, C için 8’dir. Birim uzunluğa normalize edilmiş vektörlerde kosinüs ile iç çarpım aynıdır; normalizasyon yoksa aynı olmak zorunda değildir. Bu kurgusal iki boyutlu vektörler yalnızca hesabı açıklar. Dil modeli çıktısı veya anlamsal kalite kanıtı değildir.

0,8 benzerlik puanı, sonucun yüzde 80 olasılıkla ilgili olduğunu söylemez. Puanın anlamı modele, puan dağılımına ve göreve bağlıdır. Bir veri kümesinde işe yarayan eşik, dil, parçalama veya model değiştiğinde uygun olmayabilir. Eşiği etiketli sorgularla belirleyin; bulunan sonuçların isabetiyle ilgili sonuçları yakalama oranını birlikte izleyin.

## Kodlama ile indeksleme farklı adımlardır

<!-- diagram: Belge ve sorgu kodlayıcıları vektör karşılaştırmasını besler; uygunluk bağımsız uygulanır. -->
1. Kaynak · parça + sürüm
2. Kodla · sabit model kimliği
3. İndeks · tam veya yaklaşık
4. Sorgu · uyumlu kodlayıcı
5. Doğrula · kapsam + kanıt

*Vektör indeksi karşılaştırmayı hızlandırır. Kaydın anlamını belirlemez.*

Tam arama, uygun olan bütün vektörleri puanlar. Yaklaşık en yakın komşu araması ise daha düşük maliyet karşılığında bazı komşuları kaçırabilir. Yönetilebilir büyüklükte bir örnekte, aynı uzaklık ölçüsü ve erişim kapsamıyla tam aramaya göre ne kaybettiğini ölçün. Anlamsal ilgililiği ayrıca insan değerlendirmesiyle sınayın. İndeks en yakın vektörleri doğru bulsa bile bu vektörlerin metinleri soruya iyi yanıt vermeyebilir.

## Boyutların eşleşmesi yeterli değildir

Sağlayıcıyı, modeli, model sürümünü, boyut sayısını, normalizasyonu ve kodlama talimatını kaydedin. İki model de 768 sayı üretebilir, ancak bu sayılar farklı anlam uzaylarına ait olabilir. Bazı modeller sorgu ve belge için ayrı kodlayıcılar veya ön ekler kullanır. Önemli olan girdilerin aynı olması değil, modelin öngördüğü biçimde eşleşmesidir. Temsil değiştiğinde belgeleri yeniden kodlamak ve arama indeksini yeniden kurmak genellikle gerekir.

Kimlik numaraları, olumsuzluklar ve birbirine benzeyen belge sürümleri anlamsal aramanın sınırlarını gösterir. “A-17 kuralı uygulanır” ile “A-17 kuralı uygulanmaz” yakın vektörler üretebilir. Tam kodlar için sözcük tabanlı aramadan, geçerlilik için yapılandırılmış filtrelerden yararlanın. DPR ve Sentence-BERT, öğrenilmiş yoğun arama ve cümle temsili örnekleridir; her çok dilli arşivde aynı başarıyı garanti etmez. [DPR](https://arxiv.org/abs/2004.04906) [Sentence-BERT](https://arxiv.org/abs/1908.10084)

## Model değişikliğini değerlendirin

> [!EXERCISE]
> **Kendinizi sınayın**
> Model değişince vektörler hâlâ 768 boyutlu ve servis sonuç döndürüyor. Eski belge indeksini kullanmak için yeterli mi?
>
> **Açıklama:** Hayır. Sorgu/belge temsil sözleşmesini kontrol edin; uyumsuzsa yeniden kodlayın. Yapısal olarak geçerli vektör başka uzayda olabilir. Hem komşu bulmayı hem görev ilgililiğini değerlendirin.

## Kaynaklar ve ileri okuma

1. [Karpukhin et al. (2020) · Dense Passage Retrieval](https://arxiv.org/abs/2004.04906)
2. [Reimers & Gurevych (2019) · Sentence-BERT](https://arxiv.org/abs/1908.10084)
3. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)

