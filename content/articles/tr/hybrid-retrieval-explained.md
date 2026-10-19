---
id: "hybrid-retrieval"
slug: "hybrid-retrieval-explained"
type: "learn"
language: "tr"
title: "Hibrit arama: farklı sonuçları birleştirmek"
subtitle: ""
summary: "Sözcük ve anlam temelli aramanın birbirini nasıl tamamladığını görün. Aday bulma, sonuçları birleştirme ve yeniden sıralama hatalarını ayırt edin."
shortAnswer: "Sözcük ve anlam temelli aramanın birbirini nasıl tamamladığını görün. Aday bulma, sonuçları birleştirme ve yeniden sıralama hatalarını ayırt edin."
category: "Memory & Retrieval"
tags: ["hybrid", "reranking", "candidate recall", "cross encoder", "hibrit", "yeniden sıralama", "aday"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Hibrit arama: farklı sonuçları birleştirmek — MESA"
seoDescription: "Sözcük ve anlam temelli aramanın birbirini nasıl tamamladığını görün. Aday bulma, sonuçları birleştirme ve yeniden sıralama hatalarını ayırt edin."
lessonOrder: 6
learningStage: "retrieval"
prerequisites: ["semantic-search", "bm25-tuning-for-domain-documents"]
learningObjectives: ["Aday üretimini yeniden sıralamadan ayırmak", "Her kanalın özgün katkısını ölçmek", "Birleştirmede kapsam ve kimliği korumak"]
---

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

## Hatayı konumlandırın

> [!EXERCISE]
> **Kendinizi sınayın**
> Doğru pasaj yoğun kanalda 45. sırada, sözcüksel ilk 20’de yok; yalnızca ilk-20 birleşimini yeniden sıralıyorsunuz. Daha iyi yeniden sıralayıcı onu bulabilir mi?
>
> **Açıklama:** Hayır. Bu pasaj yeniden sıralayıcıya hiç ulaşmıyor. Sorgu temsili, kanal kesimi, parçalama ve aday recall’unu inceleyin. Yeniden sıralamaya daha fazla kaynak ayırmadan aynı etiketli sorularda değişiklikleri karşılaştırın.

## Kaynaklar ve ileri okuma

1. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)
2. [Nogueira & Cho (2019) · Passage Re-ranking with BERT](https://arxiv.org/abs/1901.04085)
3. [Cormack, Clarke & Büttcher (2009) · Reciprocal Rank Fusion](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)

