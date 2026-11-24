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
updatedAt: "2026-11-24"
readingMinutes: 7
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

Çizge veya başka bir model eklemek, aramayı kendiliğinden iyileştirmez. Birbirine çok benzeyen kanallar aynı hatayı güçlendirebilir. Önce anlaşılır bir sözcük tabanlı yöntem ve uyumlu bir anlamsal model kurun. Ortak ve yalnızca tek kanalda bulunan ilgili sonuçları, boş yanıtları ve gecikmeyi ölçün. Karmaşıklığı, gördüğünüz bir hatayı çözmek için artırın. MESA da 0.9.5’te kendi çizge deposunu bu nedenle kaldırdı: dev sorularında çizge araması, diğer kanalların kaçırdığı hiçbir doğru pasajı bulmadı ve kapatılması hiçbir soruyu kaybettirmedi ([ölçümler](/research/why-mesa-removed-its-graph-store/)). BEIR, yöntemlerin başarısının veri kümesine göre değiştiğini gösterir; o çalışmanın puanı sizin arşivinizin puanı değildir. [BEIR](https://arxiv.org/abs/2104.08663)

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

## MESA’da ne ölçtük?

Türkçe hukuk dev kümemizde eklenen her aşama sonucu iyileştirdi; her biri de zaman maliyeti getirdi.

| MESA 0.9.4 varsayılanları, dev, Tier M | MRR | Hit@5 | Arama p50 |
| --- | --- | --- | --- |
| T0: yalnızca sözcük araması, modeller kapalı | 0,3954 | 0,5446 | 0,33 sn |
| T1b: + bge-m3 gömme vektörleri | 0,6487 | 0,7768 | 1,64 sn |
| T2: + bge-reranker-v2-m3 | 0,7945 | 0,9107 | 2,27 sn |

| Kategoriye göre pasaj Hit@5, dev (soru) | T0 | T1b | T2 |
| --- | --- | --- | --- |
| Birebir ifade (31) | 0,6774 | 0,8710 | 0,9355 |
| Sayı, tarih, esas no (35) | 0,6286 | 0,8571 | 0,9429 |
| Yeniden ifade (32) | 0,5312 | 0,7812 | 0,9375 |
| Çok belgeli (14) | 0,0714 | 0,3571 | 0,7143 |

> [!NOTE]
> **Kurulum**
> Yayımlanan MESA 0.9.4, tek bir Colab NVIDIA A100 80 GB ortamı, benchmark v2 dev bölümü, Tier M, 141 belge, 5.041 parça. İlgililik 112 yanıtlanabilir soruyu, gecikme 128 sorunun tamamını kullanır.

Gömme vektörleri en çok, Türkçe sorgu sözcüklerinin kaynaktan sıkça ayrıldığı yeniden ifade sorularında işe yaradı. [BM25 analizimizde](/research/bm25-turkish-prefix-matching/) yeniden ifade sorularındaki 243 uygun terimin 119’u kanıtla hiç eşleşmedi. Birebir hukuki aramalar için sözcük kanalını korumak yine yararlıdır.

Daha çok kanal her zaman yararlı değildir. [0.9.4 birleştirme varsayılanları](/research/what-improved-search-in-0-9-4/) T0 ve T1b dev Hit@5’i artırdı, T2 dev Hit@5’i ise 0,9286’dan 0,9107’ye düşürdü. Yeniden sıralamadan sonra model seçiminin etkisi de azaldı: [embedding karşılaştırmasında](/research/turkish-legal-embedding-comparison/) 112 sorunun 48’i yeniden sıralayıcı olmadan, 101’i onunla eşit sırada kaldı (MESA 0.9.3, benchmark v2 dev, Tier M).

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

