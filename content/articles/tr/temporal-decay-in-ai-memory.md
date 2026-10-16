---
id: "temporal-decay-in-ai-memory"
slug: "temporal-decay-in-ai-memory"
type: "learn"
language: "tr"
title: "Ajan hafızasında zamansal sönümlenme ve bilgi güncelliği"
subtitle: "Kalıcı tarihsel olgular ile değişen anlık inançlar arasındaki dengenin kurulması"
summary: "Ajan hafızasındaki bilgi zamanla değişir. Zamansal sönümlenme modelleri bir iddianın aktif mi kaldığını, yeniden doğrulama mı gerektirdiğini yoksa geçerliliğini yitirdiğini mi belirler."
shortAnswer: "Zamansal hafıza geçerlilik aralıkları ve sönümlenme algoritmaları kullanarak ajanların eski veya yürürlükten kalkmış gözlemleri güncel gerçek sanmasını engeller."
category: "Foundations"
tags: ["temporal-decay", "memory-freshness", "state-mutation", "ai-memory"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "Ajan hafızasında zamansal sönümlenme ve bilgi güncelliği — MESA Learn"
seoDescription: "Ajan hafızasındaki bilgi zamanla değişir. Zamansal sönümlenme modelleri bir iddianın aktif mi kaldığını, yeniden doğrulama mı gerektirdiğini yoksa geçerlil"
---

## Vektör embedding'lerinin zamansızlık tuzağı

Vektör veritabanları uzaydaki noktaları zamansız kabul eder. Üç yıl önce hesaplanmış bir embedding, ilgili kelimelerle arandığında süresiz yakın kalır; bu da ajanın eski durumu güncel sanmasına yol açar.

> [!WARNING]
> **Eski Durum Açığı**
> Bir ajan 'Sunucu yapılandırması Küme A'ya bakar' bilgisini kaydeder ve küme Küme B'ye taşınırsa, salt vektör mesafesi Küme A bilgisinin artık yürürlükte olmadığını anlayamaz.

## Mühendislik ödünleşimlerinin karşılaştırması

| Strateji | Mekanizma | En Uygun Alan | Hata Riski |
| --- | --- | --- | --- |
| Üssel Sönümlenme | Puan exp(-lambda * delta_t) ile çarpılır | Sohbet güncelliği, gündelik etkileşim | Kalıcı doğru olan temel olguları silebilir |
| Açık Zaman Aralıkları | valid_from ve valid_until damgaları | Sözleşmeler, mevzuat, sistem ayarları | Açık geçersiz kılma tetikleyicisi gerektirir |
| Bitemporal Modelleme | Geçerlilik Zamanı ile İşlem Zamanı | Finansal denetim, hukuki uyumluluk | Daha yüksek depolama ve sorgu karmaşıklığı |
| Hükümsüzlük Zincirleri | Açık revizyon işaretçileri (superseded_by) | Varlık nitelik güncellemeleri | Zincir koparsa yetim kayıtlar oluşabilir |

## Bitemporal aralıklar ve sönümlenme denklemleri

Yüksek güvenilirlikli hafıza motorları bitemporal indeksleme uygular: hem olayın gerçek dünyada gerçekleştiği zamanı (geçerlilik zamanı) hem de hafıza sistemine kaydedildiği zamanı (işlem zamanı) saklar. Sönümlenme relevance puanına uygulanır, kayıtları fiziksel olarak silmez.

```text
// SQL içinde bitemporal hafıza filtresi
SELECT * FROM assertions
WHERE valid_from <= CURRENT_TIMESTAMP
  AND (valid_until IS NULL OR valid_until > CURRENT_TIMESTAMP)
  AND transaction_status = 'COMMITTED';
```

## MESA'da zamansal kapsam denetimi

MESA Core her hafıza kaydında zamansal sınır alanlarını zorunlu kılar. Retrieval router'ları, vektör veya lexical sıralama başlamadan önce süresi dolmuş kayıtları eler; böylece tarihsel denetim izi korunurken canlı akıl yürütme temiz tutulur.

- [ ] Her assertion şeması valid_from ve valid_until sınırları içerir.
- [ ] Durum güncellemeleri yerinde üzerine yazmak yerine değiştirilemez revizyon kaydı üretir.
- [ ] Denetim sorguları tarihteki herhangi bir ana dönerek tam hafıza durumunu inceleyebilir.
- [ ] Sönümlenme algoritmaları temel kanıt aralıklarını asla yok etmez.

## Kaynaklar

1. [Snodgrass & Jensen (1999) — Developing Time-Oriented Database Applications in SQL](https://www.cs.arizona.edu/people/rts/tdbbook.pdf)
2. [Ebbinghaus (1885) — Memory: A Contribution to Experimental Psychology](https://psychclassics.yorku.ca/Ebbinghaus/)

