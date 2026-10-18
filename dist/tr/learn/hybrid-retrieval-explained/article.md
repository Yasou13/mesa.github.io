---
id: "hybrid-retrieval"
slug: "hybrid-retrieval-explained"
type: "learn"
language: "tr"
title: "Hibrit retrieval: adaylar, birleştirme ve yeniden sıralama"
subtitle: ""
summary: "Sözcüksel ve anlamsal kanalların farklı kanıt sağladığı arama hattını kurun. Recall, birleştirme ve yeniden sıralama hatasını ayırın."
shortAnswer: "Sözcüksel ve anlamsal kanalların farklı kanıt sağladığı arama hattını kurun. Recall, birleştirme ve yeniden sıralama hatasını ayırın."
category: "Memory & Retrieval"
tags: ["hybrid", "reranking", "candidate recall", "cross encoder", "hibrit", "yeniden sıralama", "aday"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Hibrit retrieval: adaylar, birleştirme ve yeniden sıralama — MESA Learn"
seoDescription: "Sözcüksel ve anlamsal kanalların farklı kanıt sağladığı arama hattını kurun. Recall, birleştirme ve yeniden sıralama hatasını ayırın."
lessonOrder: 6
learningStage: "retrieval"
prerequisites: ["semantic-search", "bm25-tuning-for-domain-documents"]
learningObjectives: ["Aday üretimini yeniden sıralamadan ayırmak", "Her kanalın özgün katkısını ölçmek", "Birleştirmede kapsam ve kimliği korumak"]
---

## Aynı cevabı kaçırmanın iki yolu

Okur “son iş gününde ne zaman gelebilirim?” diye soruyor. Kılavuz “Cuma açılışı: 10.00” diyor. Yoğun retrieval ifade farkını köprüleyebilir; sözcüksel retrieval tam salon adı ve politika kimliğini koruyabilir. Hibrit retrieval tamamlayıcı aday kümelerini birleştirir. Ek kanal, tabanın kaçırdığı ilgili öğeyi buluyor veya kabul edilebilir maliyetle sıralamayı iyileştiriyorsa yararlıdır.

Çizge veya başka embedding modeli eklemek otomatik iyileşme değildir. Neredeyse aynı kanallar aynı yanlışı güçlendirebilir. Açıklanabilir sözcüksel taban ve bir uyumlu yoğun modelle başlayın; örtüşme, özgün ilgili isabet, boş sonuç ve gecikmeyi ölçün. Belgelenmiş hata gerektiriyorsa karmaşıklık ekleyin. BEIR yöntemlerin veri kümelerinde değiştiğini gösterir; benchmark sonucu sizin arşivinizin skoru değildir. [BEIR](https://arxiv.org/abs/2104.08663).

## Aşamaları ayrı tutun

<!-- diagram: Yetkili sözcüksel ve vektör adayları kimlikle uzlaştırılır, birleştirilir, gerekirse yeniden sıralanır ve paketlenir. -->
1. Yetkilendir · sabit kapsam
2. Getir · sözcüksel + yoğun
3. Uzlaştır · kanonik kimlikler
4. Birleştir · sıralamalar
5. Sırala / paketle · son kanıt

*Aday üretimi kapsamayı hedefler; yeniden sıralama az öğeye daha fazla iş harcar.*

Her kanal 20 aday döndürsün ve 8 kimlik örtüşsün. Birleşimde 40 değil 32 benzersiz aday vardır. Gerçek retrieval birimiyle tekrar ayıklayın: belge, pasaj veya iddia. Aynı belgeden iki parça ayrı kanıt olabilir; aynı parçanın kopyası arka uç satırı tekrarladı diye ek oy almamalıdır.

## İlişkisiz ham skorları toplamayın

0,72 kosinüs skoru ile 12 sözcüksel skor ortak ölçekte değildir. Toplamak sonucu keyfî aralığa bağımlı yapar. Sıra birleştirme konum kullanır; skor birleştirme açık normalizasyon veya öğrenilmiş kalibrasyon ister. Adayın neden taşındığını açıklamak için kanal skorunu ve sırasını iz kaydında koruyun. Sonraki derste tam RRF hesabı var.

| Aşama | Soru | Yararlı ölçü |
| --- | --- | --- |
| Aday retrieval | İlgili kanıt birleşime girdi mi? | Aday kesiminde Recall |
| Birleştirme | Tamamlayıcı kanıt yükseldi mi? | Sabit kesimde nDCG / MRR |
| Yeniden sıralama | Ek skor sıralamayı iyileştirdi mi? | Gecikme/maliyete göre kazanım |
| Paketleme | Tam kanıt modele ulaştı mı? | Destek ve bütçe uyumu |

## Reranker neyi düzeltebilir?

Cross-encoder sorgu ve adayı birlikte skorlayarak token’ları doğrudan etkileştirir. Önceden hesaplanmış belge vektörlerini karşılaştırmaktan genellikle daha pahalıdır; bu nedenle kısa listeye uygulanır. Nogueira ve Cho BERT ile pasaj yeniden sıralamayı inceler; bu tasarım her reranker’ın sizin alanınızı iyileştireceğini göstermez. [Makale](https://arxiv.org/abs/1901.04085).

Reranker girdisinde olmayan ilgili kaydı geri getiremez. Birleşimde ilgili aday sıfırsa reranker değiştirmek recall’u çözmez. Erişim kontrolünü geçersiz kılmamalı veya eski kaynağı diriltmemelidir. Hat boyunca uygunluğu uygulayıp son kanıtın kimliğini doğrulayın; “çok ilgili ama yasak” hâlâ yasaktır.

## Hatayı konumlandırın

> [!EXERCISE]
> **Kendinizi sınayın**
> Doğru pasaj yoğun kanalda 45. sırada, sözcüksel ilk 20’de yok; yalnızca ilk-20 birleşimini yeniden sıralıyorsunuz. Daha iyi reranker onu bulabilir mi?
>
> **Answer:** Hayır. Reranker’a ulaşmıyor. Sorgu temsili, kanal kesimi, parçalama ve aday recall’unu inceleyin. Yeniden sıralamaya daha fazla kaynak ayırmadan aynı etiketli sorularda değişiklikleri karşılaştırın.

## Kaynaklar ve ileri okuma

1. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)
2. [Nogueira & Cho (2019) · Passage Re-ranking with BERT](https://arxiv.org/abs/1901.04085)
3. [Cormack, Clarke & Büttcher (2009) · Reciprocal Rank Fusion](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)

