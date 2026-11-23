---
id: "hybrid-retrieval"
slug: "hybrid-retrieval-explained"
type: "learn"
language: "tr"
title: "Hibrit arama nedir? BM25, vektörler ve yeniden sıralama"
subtitle: ""
summary: "Hibrit arama, sözcük ve vektör aramayı birleştirir. Ne zaman işe yaradığını, sonuçların nasıl birleştirildiğini ve hatanın hangi aşamada olduğunu öğrenin."
shortAnswer: "Hibrit arama, aynı sorgu için sözcük aramasını (genellikle BM25) ve vektör aramayı çalıştırıp sonuçlarını birleştirir. Sözcük araması tam terimleri korur, vektör arama ise farklı ifadeleri eşleştirebilir. Her yöntem diğerinin kaçırdığı ilgili sonuçları buluyorsa işe yarar."
category: "Memory & Retrieval"
tags: ["hybrid", "reranking", "candidate recall", "cross encoder", "hibrit", "yeniden sıralama", "aday"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-11-23"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Hibrit Arama Nedir? BM25 ve Vektör Arama — MESA"
seoDescription: "Hibrit arama, sözcük ve vektör aramayı birleştirir. BM25 ile vektörlerin ne zaman işe yaradığını, birleştirme ve yeniden sıralamayı, sonucu ölçmeyi öğrenin."
lessonOrder: 6
learningStage: "retrieval"
prerequisites: ["semantic-search", "bm25-tuning-for-domain-documents"]
learningObjectives: ["Aday üretimini yeniden sıralamadan ayırmak", "Her kanalın özgün katkısını ölçmek", "Birleştirmede kapsam ve kimliği korumak"]
---

## Hibrit arama nedir?

Hibrit arama, en az iki arama yöntemini tek akışta birleştirir. En yaygın ikili BM25 sözcük araması ve yoğun vektör aramadır. Her yöntem aday döndürür, RRF gibi bir birleştirme adımı bunları tek listede toplar ve isteğe bağlı bir yeniden sıralayıcı üst sonuçları iyileştirir.

| Karşılaştırma | BM25 sözcük araması | Vektör arama |
| --- | --- | --- |
| Eşleştirdiği | Metindeki sözcükler ve terimler | Embedding’ler arasındaki benzerlik |
| Güçlü olduğu | Ad, kod, kimlik ve tam ifadeler | Farklı sözcüklerle anlatılan aynı fikir |
| Kaçırabileceği | Başka sözcüklerle yazılmış aynı fikir | Nadir bir kod veya tam sayı |
| Gereksinimi | Metin dizini ve dil analizi | Embedding modeli ve vektör dizini |

## Aynı cevabı kaçırmanın iki yolu

Kullanıcı “Son iş gününde ne zaman gelebilirim?” diye sorsun; kılavuzda ise “Cuma açılışı: 10.00” yazsın. Anlamsal arama bu ifade farkını aşabilir. Sözcük tabanlı arama da salon adını veya kural kodunu tam eşleştirebilir. Hibrit arama, farklı yöntemlerin bulduğu adayları birleştirir. Yeni bir kanal, diğerinin kaçırdığı ilgili sonucu buluyorsa veya kabul edilebilir maliyetle sıralamayı iyileştiriyorsa yararlıdır.

Çizge veya başka bir model eklemek, aramayı kendiliğinden iyileştirmez. Birbirine çok benzeyen kanallar aynı hatayı güçlendirebilir. Önce anlaşılır bir sözcük tabanlı yöntem ve uyumlu bir anlamsal model kurun. Ortak ve yalnızca tek kanalda bulunan ilgili sonuçları, boş yanıtları ve gecikmeyi ölçün. Karmaşıklığı, gördüğünüz bir hatayı çözmek için artırın. BEIR, yöntemlerin başarısının veri kümesine göre değiştiğini gösterir; o çalışmanın puanı sizin arşivinizin puanı değildir. [BEIR](https://arxiv.org/abs/2104.08663)

## Aşamaları ayrı tutun

<!-- diagram: Yetkili sözcüksel ve vektör adayları kimlikle uzlaştırılır, birleştirilir, gerekirse yeniden sıralanır ve paketlenir. -->
1. Yetkilendir · sabit kapsam
2. Getir · sözcüksel + yoğun
3. Uzlaştır · kanonik kimlikler
4. Birleştir · sıralamalar
5. Sırala / paketle · son kanıt

*Aday üretimi kapsamayı hedefler; yeniden sıralama az öğeye daha fazla iş harcar.*

İki kanal da 20 aday döndürsün ve sekiz kimlik ortak olsun. Birleşimde 40 değil, 32 ayrı aday bulunur. Tekrarları, gerçekten aradığınız birime göre ayıklayın: belge, pasaj veya bilgi kaydı. Aynı belgedeki iki parça ayrı dayanak olabilir; aynı parçanın kopyası ise arka uç iki satır döndürdü diye fazladan katkı almamalıdır.

## İlişkisiz ham skorları toplamayın

0,72 kosinüs puanı ile sözcük tabanlı aramadan gelen 12 puan aynı ölçekte değildir. Bunları doğrudan toplamak, sonucu keyfî puan aralıklarına bağımlı kılar. Sıralama birleştirme, listedeki konumları kullanır. Ham puanları birleştirmek için ise açık bir normalizasyon veya öğrenilmiş eşleme gerekir. Sonucun neden yükseldiğini açıklayabilmek için her kanalın puanını ve sırasını koruyun. Sonraki derste RRF hesabını yapacağız.

| Aşama | Soru | Yararlı ölçü |
| --- | --- | --- |
| Aday arama | İlgili kanıt birleşime girdi mi? | Aday kesiminde Recall |
| Birleştirme | Tamamlayıcı kanıt yükseldi mi? | Sabit kesimde nDCG / MRR |
| Yeniden sıralama | Ek skor sıralamayı iyileştirdi mi? | Gecikme/maliyete göre kazanım |
| Paketleme | Tam kanıt modele ulaştı mı? | Destek ve bütçe uyumu |

## Yeniden sıralama neyi düzeltebilir?

Cross-encoder, sorguyla adayı birlikte değerlendirir; iki metindeki token’lar hesap sırasında doğrudan etkileşir. Bu işlem, hazır belge vektörlerini karşılaştırmaktan genellikle daha pahalıdır; bu yüzden kısa bir aday listesine uygulanır. Nogueira ve Cho, BERT ile pasajları yeniden sıralamayı inceler. Çalışma, her yeniden sıralayıcının sizin alanınızda iyileşme sağlayacağını göstermez. [Makale](https://arxiv.org/abs/1901.04085)

Yeniden sıralayıcı, kendisine ulaşmayan ilgili bir kaydı bulamaz. Birleşen adaylar arasında doğru pasaj yoksa yalnızca bu bileşeni değiştirmek eksik sonucu çözmez. Yeniden sıralama erişim izinlerini de aşmamalı veya geçersiz kaynağı geri getirmemelidir. Uygunluk denetimini akış boyunca koruyun ve son dayanağın kimliğini doğrulayın. Çok ilgili olması, erişimi yasak bir kaydı kullanılabilir yapmaz.

## Hibrit arama ne zaman kullanılmalı?

- Kullanıcılar hem tam kimliklerle hem doğal dille arıyorsa.
- Belgelerde bulanıklaşmaması gereken kod, ad, tarih veya hukuki atıflar varsa.
- Sözcük araması farklı ifadeleri, vektör arama ise tam terimleri kaçırıyorsa.
- Etiketli sorular ikinci yöntemin yeni ilgili sonuçlar eklediğini gösteriyorsa.

Bir yöntem kanıtı zaten buluyorsa ve ikinci kanal yalnızca gecikme ekliyorsa tek yöntemle kalın. Türkçede ekleri ve ı/i gibi harfleri de test edin; dil analizi sözcük aramasının bulduklarını değiştirebilir.

## Basit bir ilk hibrit arama akışı

1. Aramadan önce erişim kapsamını uygulayın.
2. BM25 ve vektör aramayı ayrı çalıştırın; örneğin her birinden ilk 50 sonucu alın.
3. Her listeyi aynı arama birimine göre tekilleştirin.
4. [Reciprocal Rank Fusion](/learn/reciprocal-rank-fusion-explained/) ile k = 60’tan başlayarak birleştirin.
5. Etiketli sorularda Recall, MRR veya nDCG ölçün.
6. Yeniden sıralayıcıyı yalnızca doğru kanıt adaylarda olduğu hâlde alt sıralarda kalıyorsa ekleyin.

## Hatayı konumlandırın

> [!EXERCISE]
> **Kendinizi sınayın**
> Doğru pasaj yoğun kanalda 45. sırada, sözcüksel ilk 20’de yok; yalnızca ilk-20 birleşimini yeniden sıralıyorsunuz. Daha iyi yeniden sıralayıcı onu bulabilir mi?
>
> **Açıklama:** Hayır. Bu pasaj yeniden sıralayıcıya hiç ulaşmıyor. Sorgu temsili, kanal kesimi, parçalama ve aday recall’unu inceleyin. Yeniden sıralamaya daha fazla kaynak ayırmadan aynı etiketli sorularda değişiklikleri karşılaştırın.

## Hibrit arama hakkında sorular

**Hibrit arama her zaman vektör aramadan iyi midir?**
: Hayır. Kanallar farklı ilgili sonuçlar bulduğunda işe yarar. İkisini kendi etiketli sorularınızla karşılaştırın.

**Hibrit arama ile RAG aynı şey mi?**
: Hayır. Hibrit arama bir bilgi getirme yöntemidir. RAG ise getirilen metni dil modelinin yanıt üretmesine yardım etmek için kullanır; hibrit arama kullanmak zorunda değildir.

**Yeniden sıralayıcı gerekli mi?**
: Her zaman değil. Sıralamayı iyileştirebilir, ama maliyet ekler ve girdisinde olmayan sonucu geri getiremez.

**BM25 ve vektör puanları nasıl birleştirilir?**
: Yaygın başlangıç noktası, sıraları kullanan RRF’dir. Ham puanları birleştirecekseniz önce açık bir normalizasyon seçip test edin.

## Kaynaklar ve ileri okuma

1. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)
2. [Nogueira & Cho (2019) · Passage Re-ranking with BERT](https://arxiv.org/abs/1901.04085)
3. [Cormack, Clarke & Büttcher (2009) · Reciprocal Rank Fusion](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)
4. [Microsoft Learn · Hibrit arama puanlaması (RRF)](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking)

