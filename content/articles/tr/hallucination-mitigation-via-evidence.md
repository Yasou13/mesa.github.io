---
id: "hallucination-mitigation-via-evidence"
slug: "hallucination-mitigation-via-evidence"
type: "learn"
language: "tr"
title: "Temellendirilmiş kanıt zincirleriyle LLM halüsinasyonlarını önleme"
subtitle: "Üretim öncesi retrieval sınırları ve üretim sonrası entailment doğrulama mimarisi"
summary: "Halüsinasyonları önlemek çift aşamalı bir mimari gerektirir: model üretimini doğrulanmış kanıt aralıklarıyla sınırlamak ve kullanıcıya sunmadan önce doğal dil çıkarımını (entailment) doğrulamak."
shortAnswer: "Halüsinasyon engelleme, katı temellendirme kuralları uygular: modeller doğrulanabilir kanıt aralıklarına atıf yapmalı ve otomatik entailment testlerinden geçmelidir."
category: "Evidence & Trust"
tags: ["hallucination-mitigation", "grounding", "evidence", "entailment"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Temellendirilmiş kanıt zincirleriyle LLM halüsinasyonlarını önleme — MESA Learn"
seoDescription: "Halüsinasyonları önlemek çift aşamalı bir mimari gerektirir: model üretimini doğrulanmış kanıt aralıklarıyla sınırlamak ve kullanıcıya sunmadan önce doğal"
---

## Parametrik kurgulama çıkmazı

Büyük dil modelleri bir sonraki en olası kelimeyi tahmin etmek üzere eğitilmiş olasılıksal sistemlerdir. Katı temellendirme sınırları olmadığında olgusal boşlukları istatistiksel olarak makul görünen uydurmalarla doldururlar.

> [!WARNING]
> **Akıcı Halüsinasyon Tehlikesi**
> En tehlikeli halüsinasyonlar anlamsız saçmalıklar değil; son derece akıcı, iyi yapılandırılmış, yetkili bir dille yazılmış ancak tamamen gerçek dışı olan iddialardır.

## Mühendislik ödünleşimlerinin karşılaştırması

| Savunma Katmanı | Teknik | Mekanizma | Halüsinasyon Azaltma |
| --- | --- | --- | --- |
| Prompt Koruması | Negatif kısıtlar ('Yalnızca aşağıdaki metne göre yanıtla') | Sistem prompt talimatı | Orta: modeller yine de parametrik bilgilerini sızdırabilir |
| Kanıt Kapsamı | Yalnızca doğrulanmış assertion'ları bağlama ekleme | Çok hatlı hybrid retrieval ön filtrelemesi | Yüksek: bağlam dışı alakasız veriyi eler |
| Atıf Zorunluluğu | Modelin her iddiada açık assertion ID vermesi | Kısıtlı kod çözme / JSON grameri | Çok yüksek: iddiaları somut kimliklere bağlar |
| Üretim Sonrası Entailment | NLI modelinin öncülün sonucu gerektirdiğini denetlemesi | Otomatik NLI sınıflandırması (Gerektirme/Çelişki) | En yüksek: temellendirilmemiş cevabı kullanıcıya gitmeden engeller |

## Doğal dil çıkarımı (NLI) entailment puanlaması

Üretilen cevap kullanıcıya gösterilmeden önce bağımsız bir doğrulayıcı servisi cevabı atomik iddialara böler ve bir NLI sınıflandırıcısı çalıştırır: `NLI(Kanıt_Aralığı, Üretilen_İddia) -> {GEREKTİRME, NÖTR, ÇELİŞKİ}`. Herhangi bir iddia NÖTR veya ÇELİŞKİ alırsa cevap reddedilir veya uyarı eklenir.

```text
// Otomatik entailment doğrulama kontrolü
Cevaptaki her cümle için:
    Iddia = IdidyiCikar(cumle)
    Kanit = KanonikAraligiGetir(Iddia.atif_id)
    Skor = NLI_Modeli.tahmin_et(oncul=Kanit, hipotez=Iddia)
    Dogrula Skor.gerektirme > 0.90, 'Temellendirilmemis iddia tespit edildi!'
```

## MESA'nın sıfır güvenli üretim protokolü

MESA sıfır güvene dayalı temellendirme paradigmasını benimser. Sistem asla bir dil modelinin kendi doğruluğuna ilişkin beyanına güvenmez. Her cevap kanonik SQLite assertion'larından üretilir ve değiştirilemez kanıt aralıklarıyla doğrulanır.

- [ ] Prompt bağlamı yalnızca doğrulanmış ve kapsamı denetlenmiş assertion'ları içerir.
- [ ] Üretilen iddiaların belirli assertion tanımlayıcılarına atıf yapması zorunludur.
- [ ] Üretim sonrası güvenlik kapıları kullanıcıya sunulmadan önce çıkarımı doğrular.
- [ ] Doğrulanamayan iddialar hata durumunda kapanır ve açık kullanıcı uyarısı üretir.

## Kaynaklar

1. [Maynez vd. (2020) — On Faithfulness and Factuality in Abstractive Summarization (ACL)](https://arxiv.org/abs/2005.00661)
2. [Gao vd. (2023) — RAG vs Fine-tuning: Pipelines, Tradeoffs, and Metrics](https://arxiv.org/abs/2312.10997)

