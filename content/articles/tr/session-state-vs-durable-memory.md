---
id: "session-state-vs-durable-memory"
slug: "session-state-vs-durable-memory"
type: "learn"
language: "tr"
title: "Ajanlarda geçici oturum durumu ile kalıcı uzun vadeli hafıza farkı"
subtitle: "Konuşma bağlam pencereleri ile kalıcı kanonik bilginin birbirinden ayrılması"
summary: "Yapay zekâ ajanları; geçici konuşma karalama alanları (oturum durumu) ile doğrulanmış uzun vadeli olgusal bilgi (kalıcı hafıza) arasında kesin bir ayrım gerektirir."
shortAnswer: "Oturum durumu geçici konuşma akışını ve ara muhakemeleri tutar; kalıcı hafıza ise uzun vadeli geçerliliği olan doğrulanmış assertion'ları saklar."
category: "Foundations"
tags: ["session-state", "durable-memory", "agent-lifecycle", "architecture"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Ajanlarda geçici oturum durumu ile kalıcı uzun vadeli hafıza farkı — MESA Learn"
seoDescription: "Yapay zekâ ajanları; geçici konuşma karalama alanları (oturum durumu) ile doğrulanmış uzun vadeli olgusal bilgi (kalıcı hafıza) arasında kesin bir ayrım ge"
---

## Konuşma kirliliği tuzağı

Her sohbet mesajını kalıcı hafıza olarak kaydetmek; bilgi tabanını selamlaşmalar, geçici yazım hataları ve spekülatif düşüncelerle doldurur ve sonraki sorgularda ajanın kalitesini düşürür.

> [!WARNING]
> **Bağlam Sıkıştırma Kaybı**
> Ajanın bağlam penceresi dolduğunda yüzeysel özetleme algoritmaları devreye girer; bu sırada kesin atıflar, karakter aralıkları ve belge hash'leri sessizce kaybolur.

## Mühendislik ödünleşimlerinin karşılaştırması

| Boyut | Oturum Durumu (Çalışma Hafızası) | Kalıcı Hafıza (Uzun Vadeli Kanonik) |
| --- | --- | --- |
| Depolama Ortamı | Bellek içi Redis, süreç belleği, geçici KV | ACID ilişkisel veritabanı (SQLite / Postgres) |
| Yaşam Süresi | Tek bir kullanıcı görevi veya sohbet süresi | Kalıcı kurumsal veya proje ömrü |
| Kabul Filtresi | Filtresiz: her kullanıcı mesajı kabul edilir | Katı: şema çıkarımı ve kanıt doğrulaması gerektirir |
| Değişebilirlik | Sıkça üzerine yazılır, kesilir veya atılır | Değiştirilemez revizyonlar ve denetim izleri |
| Sorgulama Biçimi | Sıralı bağlam penceresi token tamponu | Çok hatlı hybrid retrieval (Vektör, BM25, Graph, SQL) |

## Hafıza konsolidasyonu ve kabul filtreleri

Oturum tamamlandığında bir konsolidasyon servisi diyalog geçmişinden aday iddiaları çıkarır. Yalnızca şema doğrulamasından, tekilleştirme kontrolünden ve kanıt sabitlemesinden geçen iddialar kalıcı hafızaya aktarılır.

```text
// Hafıza konsolidasyonu aşaması
AdayIddialar = IddialariCikar(oturum_gecmisi)
Her iddia icin:
    Eger GecerliSema(iddia) ve KanitAraligiVar(iddia) ve CeliskiYok(iddia):
        KaliciDB.kaydet(iddia)
```

## MESA'da iki katmanlı hafıza

MESA Core geçici oturum geçmişini kalıcı assertion'lardan kesin olarak ayırır. Kullanıcı diyalogları sınırlı oturum kapsamında çalışırken, kanonik olgular SQLite'ta saklanır ve LanceDB ile Kùzu'ya projekte edilir.

- [ ] Oturum durumu geçici hafıza bölümlerinde izole edilir.
- [ ] Kalıcı hafızaya kabul açık şema ve kanıt doğrulaması gerektirir.
- [ ] Bağlam sıkıştırma rutinleri kanonik assertion kimliklerini korur.
- [ ] Oturumlar arası arama yalnızca doğrulanmış kalıcı kayıtları sorgular.

## Kaynaklar

1. [Atkinson & Shiffrin (1968) — Human Memory: A Proposed System and its Control Processes](https://www.sciencedirect.com/science/article/pii/S0079742108604223)
2. [MESA V4 Mimari Spesifikasyonu](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)

