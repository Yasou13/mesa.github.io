---
id: "temporal-decay-in-ai-memory"
slug: "temporal-decay-in-ai-memory"
type: "learn"
language: "tr"
title: "Bilgi değiştiğinde: güncelleme, çelişki ve unutma"
subtitle: ""
summary: "Bilginin ne zaman geçerli olduğuyla ne zaman kaydedildiğini ayırın. Eski olan her kaydı yanlış saymadan düzeltmeleri ve çelişkileri yönetin."
shortAnswer: "Bilginin ne zaman geçerli olduğuyla ne zaman kaydedildiğini ayırın. Eski olan her kaydı yanlış saymadan düzeltmeleri ve çelişkileri yönetin."
category: "Evidence & Trust"
tags: ["temporal", "validity", "decay", "contradiction", "version", "zaman", "geçerlilik", "çelişki", "unutma"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-28"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Bilgi değiştiğinde: güncelleme, çelişki ve unutma — MESA"
seoDescription: "Bilginin ne zaman geçerli olduğuyla ne zaman kaydedildiğini ayırın. Eski olan her kaydı yanlış saymadan düzeltmeleri ve çelişkileri yönetin."
lessonOrder: 12
learningStage: "systems"
prerequisites: ["evidence-aware-memory", "sqlite-as-canonical-agent-memory"]
learningObjectives: ["Geçerlilik zamanı ile kayıt zamanını ayırmak", "Görünür ve gerçek çelişkiyi tanımak", "Azalmayı doğruluk değil sıralama politikası olarak açıklamak"]
---

## Geçerlilik zamanı ve kayıt zamanı farklıdır

Arşiv 18 Ekim’de yeni cuma açılış saatini duyuruyor; değişiklik 1 Kasım’da geçerli. Sistem duyuruyu 20 Ekim’de öğreniyor. “Bugün açılış saati ne?” ve “Sistemimiz 19 Ekim’e kadar ne kaydetmişti?” farklı sorulardır. Tek `updated_at` alanı iki anlamı güvenilir temsil edemez.

| Alan | Örnek | Anlam |
| --- | --- | --- |
| valid_from | 1 Kasım | İddianın uygulanmaya başladığı zaman |
| valid_to | açık uçlu | Uygulanabilirliğin bittiği zaman |
| recorded_at | 20 Ekim | Bu sistemin kaydettiği zaman |
| source_revision | handbook-r3 | Bunu söyleyen belge |

Bunlar dersin kavramsal alanlarıdır. Hem bilginin geçerlilik tarihine hem sistemin onu kaydettiği tarihe göre geçmiş sorgusu yapabilmek için iki zaman boyutunu açıkça tanımlayan bir model gerekir. Sistemin zaman damgası tutması, bu sorguları desteklediği anlamına gelmez. MESA mimarisi kendi zaman filtrelerini ve sınırlarını belgeler; buradaki örnek tam bitemporal destek iddiası değildir.

## Değişimi aralıkla temsil edin

<!-- diagram: Sürüm 2 kasımdan önce, sürüm 3 kasımdan itibaren geçerlidir; kayıt ayrı zaman çizgisindedir. -->
1. Eski iddia · cuma 09.00
2. Bitiş · 1 Kasım’dan önce
3. Yeni iddia · cuma 10.00
4. Başlangıç · 1 Kasım dahil
5. Kayıt · ayrıca 20 Ekim

*Aralık sınırını ve saat dilimini belirtin; eski değeri sessizce ezmeyin.*

Yarı açık `[başlangıç, bitiş)` başlangıcı içerip bitişi dışlar. Böylece bitişik aralıklar örtüşmez: eski 1 Kasım’a kadar, yeni 1 Kasım’dan itibaren. Saat dilimini ve tarih hassasiyetini tanımlayın; “gece yarısı” saat dilimi olmadan eksiktir. Yalnızca gün belirten duyuruya saat uydurmak yerine kaynak hassasiyetini koruyun.

## Çelişki demeden aynı şeyi karşılaştırın

“Dokuzda açılır” ve “onda açılır” çelişkili görünür. Farklı salon, gün, tarih veya kaynak otoritesini anlatabilirler. Önce varlık kimliğini, yüklemi, birimi, kapsamı ve geçerlilik aralığını hizalayın. Sonra aynı koşulda uyumsuz iki değerin yarışıp yarışmadığını sorun. Olumsuzluk ve kip önemlidir: “açılabilir”, “açılacak” değildir.

Güncel iki kaynak gerçekten ayrışıyorsa ikisini koruyup çatışmayı kaynaklarıyla gösterin. Çözüm politikası resmî revizyonu tercih edebilir, inceleme isteyebilir veya seçimden kaçınabilir. “En yeni kazanır” evrensel olarak güvenli değildir; yeni düşük kaliteli kopya eski yetkili kaynağa karşı çıkabilir. Çözüm gerekçesini ve geri almak için gereken bilgiyi kaydedin.

## Yaş önceliği değiştirebilir, doğruluğu değil

```text
illustrative recency weight = exp(-lambda * age)
half-life H => lambda = ln(2) / H
age = H  => weight = 0.5
age = 2H => weight = 0.25
Apply only after eligibility; this is a ranking policy.
```

Yeni görev notu eskiden daha fazla dikkat gerektirebilir. Geçmiş sözleşme yaşından bağımsız olarak geçmiş tarih için doğru kaynak kalabilir. Azalma seçilmiş sıralama sezgisidir; sürenin dolması geçerlilik kuralı; silme saklama eylemidir. Bunları ayırın. Güncellik ağırlığı açmadan hem “şimdi” hem geçmiş tarih sorularını test edin.

## Görünür çatışmayı sınıflandırın

> [!EXERCISE]
> **Kendinizi sınayın**
> Sürüm 2 kasıma kadar cuma 09.00, sürüm 3 kasımdan itibaren cuma 10.00 diyor. Birini yanlış etiketlemek zorunlu mu?
>
> **Açıklama:** Hayır. Farklı aralıklara uygulanıyorlar. İkisini koruyup sorunun tarihiyle filtreleyin. Çelişki için aynı varlık, kapsam ve örtüşen geçerlilik koşullarında uyumsuz değer gerekir.

## Kaynaklar ve ileri okuma

1. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
2. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

