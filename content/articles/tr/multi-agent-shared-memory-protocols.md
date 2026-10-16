---
id: "multi-agent-shared-memory-protocols"
slug: "multi-agent-shared-memory-protocols"
type: "learn"
language: "tr"
title: "Çok ajanlı filolar için ortak hafıza protokolleri ve kapsam izolasyonu"
subtitle: "Eşzamanlı ajan yazmalarının, çalışma karalama defterlerinin ve çalışma alanı sınırlarının koordinasyonu"
summary: "Uzmanlaşmış ajan filoları işbirliği yaptığında, doğrulanmış bulguları paylaşırken özel çalışma hipotezlerini izole eden yapılandırılmış protokollere ihtiyaç duyar."
shortAnswer: "Çok ajanlı hafıza; yarış koşullarını ve bağlam kirlenmesini önlemek için katmanlı kapsamlar (ajan-özel, çalışma alanı-ortak, kiracı-genel) uygular."
category: "Foundations"
tags: ["multi-agent", "shared-memory", "scope-isolation", "concurrency"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Çok ajanlı filolar için ortak hafıza protokolleri ve kapsam izolasyonu — MESA Learn"
seoDescription: "Uzmanlaşmış ajan filoları işbirliği yaptığında, doğrulanmış bulguları paylaşırken özel çalışma hipotezlerini izole eden yapılandırılmış protokollere ihtiya"
---

## Ortak karalama defteri çıkmazı

Birden fazla otonom ajan doğrulanmamış ara düşüncelerini ortak bir veritabanına yazarsa, hafıza havuzu hızla karşılıklı kafa karışıklığına dönüşür. Bir ajanın spekülatif tahmini, diğer ajanın kesin dayanağı haline gelir.

> [!WARNING]
> **Eşzamanlılık ve Yarış Tehlikesi**
> Aynı anda hafızayı okuyan, çelişkili eylemler hesaplayan ve assertion yazan iki ajan, işlemsel izolasyon olmadan varlık durumunu bozan yarış koşullarına (race condition) neden olur.

## Mühendislik ödünleşimlerinin karşılaştırması

| Kapsam Katmanı | Erişim Kuralı | Yaşam Süresi | Kullanım Amacı |
| --- | --- | --- | --- |
| Ajan Özel Alanı | Yalnızca ilgili ajan okur/yazar | Geçici (oturum/görev süresince) | Ara akıl yürütme notları ve taslak çalışmalar |
| Çalışma Alanı (Workspace) | Görevdeki tüm ajanlar paylaşır | Proje veya dosya süresince | Belirli bir ekip görevine dair doğrulanmış bulgular |
| Kiracı (Tenant) Deposu | Görevler için salt-okunur | Kalıcı kurumsal yaşam döngüsü | Şirket politikaları, onaylı taksonomiler, ana olgular |
| Genel Bilgi Tabanı | Tüm kiracılar için salt-okunur | Değiştirilemez | Resmî mevzuat, kamuya açık dokümantasyon, sözlükler |

## Atomik durum terfisi ve kapsam metaverisi

Bilginin terfisi aşamalı bir yaşam döngüsünü izler: Bir assertion `scope:agent_private` içinde başlar. Bir denetçi ajan veya insan incelemesiyle doğrulandığında, soykütüğü bozulmadan atomik bir işlemle `scope:workspace_shared` düzeyine yükseltilir.

```text
// Kiracı ve çalışma alanı izolasyonlu kayıt ekleme
INSERT INTO assertions (id, subject, predicate, object, tenant_id, workspace_id, agent_id, visibility)
VALUES ('asrt_55c', 'Dosya402', 'delil_sunma_son_gun', '2026-11-15', 'corp_alfa', 'ws_dava', 'ajan_arastirmaci', 'WORKSPACE_SHARED');
```

## MESA'da çok ajanlı izolasyon

MESA Core mimarisi her hafıza sorgusunda dört seviyeli katı kapsam metaverisini zorunlu kılar. Retrieval router'ları herhangi bir vektör veya graph taramasından önce veritabanı motorunda `(tenant_id, workspace_id, agent_id)` filtrelemesini çalıştırır.

- [ ] Her retrieval sorgusu SQL düzeyinde kiracı ve çalışma alanı izolasyonu uygular.
- [ ] Ajanlar yetkili çalışma alanı sınırlarının dışındaki kayıtları okuyamaz.
- [ ] Karalama defterinden ortak hafızaya terfi assertion doğrulaması gerektirir.
- [ ] Eksiksiz aktör atfı, her olgusal iddiayı hangi ajanın ürettiğini kaydeder.

## Kaynaklar

1. [Wooldridge (2009) — An Introduction to MultiAgent Systems (John Wiley & Sons)](https://www.wiley.com/en-us/An+Introduction+to+MultiAgent+Systems%2C+2nd+Edition-p-9780470519462)
2. [MESA Değerlendirme ve Güvenlik Kapıları](https://mesamemory.dev/evaluation/)

