---
id: "audit-logging-in-production-ai"
slug: "audit-logging-in-production-ai"
type: "learn"
language: "tr"
title: "Yapay zekâ iş akışlarında değiştirilemez denetim günlükleri ve uyumluluk doğrulaması"
subtitle: "Kurumsal yapay zekâ için yalnızca eklemeli ve kriptografik zincirli olay kayıtlarının tasarımı"
summary: "Düzenlemeye tabi sektörlerde çalışan otonom ajanlar; her promptu, hafıza sorgusunu, model çıktısını ve veritabanı değişikliğini kaydeden değiştirilemez denetim izleri gerektirir."
shortAnswer: "Yapay zekâda denetim günlüğü tutmak, bir ajanın otonom karar almadan önce hangi iddiaları ve kanıtları gördüğünü kanıtlayan hash zincirleri gerektirir."
category: "Evidence & Trust"
tags: ["audit-logging", "compliance", "tamper-evident", "evidence"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "Yapay zekâ iş akışlarında değiştirilemez denetim günlükleri ve uyumluluk doğrulaması — MESA Learn"
seoDescription: "Düzenlemeye tabi sektörlerde çalışan otonom ajanlar; her promptu, hafıza sorgusunu, model çıktısını ve veritabanı değişikliğini kaydeden değiştirilemez den"
---

## Kara kutu hesap verebilirlik krizi

Bir yapay zekâ finansal işlem yaptığında veya hukuki değerlendirme sunduğunda standart sunucu günlükleri yalnızca HTTP isteğinin bittiğini kaydeder. Ajanın o an neyi hatırladığını, hangi kanıtları okuduğunu ve hangi prompt talimatlarıyla yönlendirildiğini açıklayamaz.

> [!WARNING]
> **Tahrifat Açığı**
> Geleneksel veritabanı log tabloları yetkili kullanıcılar veya sızan yazılımlar tarafından sonradan değiştirilebilir veya silinebilir. Regülasyona tabi alanlarda denetimler matematiksel olarak kanıtlanabilir tahrifat koruması zorunlu kılar.

## Mühendislik ödünleşimlerinin karşılaştırması

| Denetim Bileşeni | Gerekli Veri | Depolama Modeli | Uyumluluk Hedefi |
| --- | --- | --- | --- |
| Retrieval Olayı | Sorgu, tenant_id, dönen assertion_id'leri, RRF puanları | Yalnızca eklemeli (append-only) akış | Ajanın hangi olgulara maruz kaldığını kanıtlar |
| Prompt Anlık Görüntüsü | Tam sistem promptu, kullanıcı girdisi, formatlanmış bağlam | İçerik adresli SHA-256 depolama | Model girdisinin birebir yeniden üretilmesini sağlar |
| Model Üretimi | Model kimliği, sıcaklık, seed, ham token akışı | Değiştirilemez JSONL defteri | Çıktının sonradan değiştirilmediğini ispatlar |
| Durum Değişikliği | Önceki durum, sonraki durum, aktör kimliği, işlem hash'i | Kriptografik zincirli denetim tablosu | Hukuki denetimler için tam izlenebilirlik sunar |

## Denetim defterlerinde kriptografik hash zinciri

Her denetim kaydı kendi içeriğinin hash'i ile bir önceki kaydın hash'ini birleştirir: `H_i = SHA-256(Kayit_i || H_{i-1})`. Geçmişteki herhangi bir kayıtta yapılan en küçük tahrifat, sonraki tüm zincir hash'lerini geçersiz kılar.

```text
// Kriptografik zincirli denetim tablosu şeması
CREATE TABLE audit_events (
    id BIGSERIAL PRIMARY KEY,
    prev_hash TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    record_hash TEXT NOT NULL
);
```

## MESA'da denetim doğrulaması

MESA Core her retrieval döngüsünü ve assertion durum değişikliğini kanonik denetim şemasında kaydeder. Profile B güvenlik sertifikasyonu, denetim günlüklerinin tahrifata karşı dayanıklı olduğunu ve izinsiz müdahalelerde güvenli kapandığını doğrular.

- [ ] Her hafıza sorgusu, getirilen assertion kimlikleriyle birlikte değiştirilemez bir denetim kaydı üretir.
- [ ] Denetim günlükleri kiracı, çalışma alanı, ajan ve zaman sınırlarını içerir.
- [ ] Hash zinciri geçmiş günlüklerin gizlice değiştirilemeyeceğini garanti eder.
- [ ] Denetçiler üretim veritabanına erişmeden uçtan uca provenance izlerini doğrulayabilir.

## Kaynaklar

1. [Haber & Stornetta (1991) — How to Time-Stamp a Digital Document (Journal of Cryptology)](https://link.springer.com/article/10.1007/BF00196791)
2. [ISO/IEC 27001 — Information Security Management Systems](https://www.iso.org/standard/27001)

