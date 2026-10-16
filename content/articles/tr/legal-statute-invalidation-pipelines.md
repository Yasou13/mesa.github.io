---
id: "legal-statute-invalidation-pipelines"
slug: "legal-statute-invalidation-pipelines"
type: "learn"
language: "tr"
title: "Provenance ile kanun değişikliklerini ve içtihat geçersiz kılınmasını izleme"
subtitle: "Dayanak hukuki normlar değiştiğinde otomatik kademeli geçersiz kılma mimarisi"
summary: "Bir kanun maddesi değiştiğinde veya iptal edildiğinde, otonom hukuk yapay zekâsı provenance grafiklerini izleyerek o norma dayanan tüm assertion'ları anında geçersiz kılmalıdır."
shortAnswer: "Kanun geçersiz kılma mekanizması, mevzuat değiştiği anda mülga yorumları geri çekmek için provenance bağımlılık grafiklerini kullanır."
category: "Legal Research"
tags: ["statutes", "invalidation", "legal-ai", "provenance"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Provenance ile kanun değişikliklerini ve içtihat geçersiz kılınmasını izleme — MESA Learn"
seoDescription: "Bir kanun maddesi değiştiğinde veya iptal edildiğinde, otonom hukuk yapay zekâsı provenance grafiklerini izleyerek o norma dayanan tüm assertion'ları anınd"
---

## Mülga kanun maddesi halüsinasyonu

Statik verilerle eğitilen modeller yürürlükten kalkmış maddeleri veya aşılmış içtihatları yürürlükteymiş gibi atfederek hukukçular için ciddi mesleki sorumluluk riskleri doğurur.

> [!WARNING]
> **Zamansal Uyumsuzluk Tehlikesi**
> 2018 tarihli bir Yargıtay kararı eski mevzuata göre Madde 40'ı doğru yorumlamış olabilir; ancak 2022'deki bir kanun değişikliği o içtihadı hukuken geçersiz kılmış olabilir.

## Mühendislik ödünleşimlerinin karşılaştırması

| Hukuki Olay | Tetikleyici Kaynak | Geçersiz Kılma Mekanizması | Aşağı Akış Etkisi |
| --- | --- | --- | --- |
| Kanun Mülga Olması | Resmî Gazete yayımı (PDF/HTML) | Doğrudan durum güncellemesi: `status = 'REPEALED'` | Tüm türetilmiş kural assertion'larına kademeli yansır |
| Madde Değişikliği | Değişiklik yapan kanun metni | Bitemporal güncelleme: `valid_until = yururluk_tarihi` | Geçmiş uyuşmazlıklar için tarihsel geçerliliği korur |
| İçtihadın Aşılması | Hukuk Genel Kurulu kararı | Öncelik kenarı güncellemesi: yeni karara bağlanır | Eski içtihadı aşılmış olarak işaretler |
| Anayasa Mahkemesi İptali | AYM iptal kararı yayımı | İptal yürürlük penceresi tanımlama | Aktif dosyalarda zorunlu insan incelemesi tetikler |

## Kademeli geçersiz kılma için bağımlılık grafiği gezinimi

Her hukuki assertion dayandığı kanun maddesine açık bir kenar bağlar: `(Assertion)-[:TURETILDI]->(Kanun_Maddesi)`. Kanun kaydı REPEALED durumuna geçtiğinde özyinelemeli graph gezinimi aşağı akıştaki tüm assertion'ları SUPERSEDED yapar.

```text
// Graph hafızasında kademeli geçersiz kılma
MATCH (k:Kanun {no: '6100', madde: '114'})
SET k.status = 'DEGISTI', k.valid_until = CURRENT_TIMESTAMP
WITH k
MATCH (a:Assertion)-[:TURETILDI*1..3]->(k)
SET a.status = 'SUPERSEDED', a.updated_at = CURRENT_TIMESTAMP;
```

## MESA Law'da norm takibi

MESA Law resmî mevzuat ve içtihat metinlerini değiştirilemez bayt kayıtları olarak saklar. Provenance motoru zamansal geçerlilik pencerelerini izler; böylece hiçbir ajan mülga hükümleri güncel sanmaz.

- [ ] Resmî Gazete nüshaları tam yürürlük tarihleriyle sisteme alınır.
- [ ] Provenance bağımlılık grafikleri yorumları doğrudan kanun maddelerine bağlar.
- [ ] Değişiklikler otomatik olarak bitemporal valid_until kapanışı üretir.
- [ ] Hukukçular herhangi bir normun tam tarihsel sürüm geçmişini inceleyebilir.

## Kaynaklar

1. [Kelsen (1945) — General Theory of Law and State (Harvard University Press)](https://www.hup.harvard.edu/books/9780674344501)
2. [MESA Law Mevzuat ve Resmî Gazete Kuralları](https://mesamemory.dev/law/)

