---
id: "sqlite-as-canonical-agent-memory"
slug: "sqlite-as-canonical-agent-memory"
type: "learn"
language: "tr"
title: "SQLite neden yapay zekâ hafızası için en uygun kanonik depodur?"
subtitle: "Çok kipli türetilmiş projeksiyonların temeli olarak gömülü işlemsel güvenilirlik"
summary: "Yapay zekâ hafızası işlemsel dayanıklılık, katı şema doğrulaması ve sıfır ağ yükü gerektirir. SQLite, vektör ve graph indekslerinin türetilebileceği ACID uyumlu bir temel sağlar."
shortAnswer: "SQLite hafıza durum geçişlerinin atomik ve dayanıklı olmasını garanti eder; türetilmiş vektör ve graph depoları bozulsa bile deterministik olarak yeniden üretilebilir."
category: "Foundations"
tags: ["sqlite", "architecture", "canonical-store", "durability"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "SQLite neden yapay zekâ hafızası için en uygun kanonik depodur? — MESA Learn"
seoDescription: "Yapay zekâ hafızası işlemsel dayanıklılık, katı şema doğrulaması ve sıfır ağ yükü gerektirir. SQLite, vektör ve graph indekslerinin türetilebileceği ACID u"
---

## Çoklu veritabanı karmaşasının kırılganlığı

Birçok modern ajan kütüphanesi harici bir vektör veritabanını, bağımsız bir graph veritabanını ve bir anahtar-değer önbelleğini aynı anda bağlamaya çalışır. Bir yazma işlemi sırasında ajan çökerse veritabanları uyumsuz hale gelir, yetim kenarlar ve hayalet kayıtlar kalır.

> [!WARNING]
> **Dağıtık İşlem Tehlikesi**
> Ajan çalışma zamanlarında heterojen vektör ve graph servisleri arasında iki aşamalı commit (2PC) yürütmek son derece kırılgandır. Ağ hatası silinmiş graph düğümlerini işaret eden yetim vektörler bırakabilir.

## Mühendislik ödünleşimlerinin karşılaştırması

| Boyut | Çoklu Veritabanı Karmaşası | SQLite Kanonik Mimarisi |
| --- | --- | --- |
| ACID Garantisi | Harici servisler arasında yok | Tam işlemsel atomiklik ve WAL dayanıklılığı |
| Dağıtım Karmaşıklığı | Birden fazla arka plan sunucusu, ağ ayarları, token'lar | Tek dosya, süreç içi gömülü, sıfır ağ gecikmesi |
| Bozulma Onarımı | Manuel veritabanı mutabakatı gerektirir | Projeksiyonlar SQLite'tan deterministik olarak üretilir |
| Lexical Arama | Ayrı Elasticsearch / OpenSearch kümesi gerektirir | BM25 sıralamalı yerleşik SQLite FTS5 eklentisi |
| Taşınabilirlik | Belirli bulut servis sağlayıcılarına kilitlenir | İşletim sistemleri ve işlemciler arasında taşınabilir tek dosya |

## İşlemsel assertion'lar ve türetilmiş projeksiyonlar

Kanonik mimaride tüm yazma işlemleri atomik bir işlem içinde doğrudan SQLite'a yapılır. Arka plan dinleyicileri veya senkronizasyon kancaları ardından türetilmiş arama projeksiyonlarını (LanceDB vektör tabloları ve Kùzu graph tabloları gibi) günceller.

```text
// SQLite içinde atomik assertion kabulü
BEGIN TRANSACTION;
INSERT INTO assertions (id, subject, predicate, object, source_id, status)
VALUES ('asrt_102', 'Model', 'kullandigi_kuantalama', 'INT8', 'doc_sys_v1', 'COMMITTED');
INSERT INTO evidence_spans (assertion_id, start_char, end_char)
VALUES ('asrt_102', 1240, 1310);
COMMIT;
```

## MESA'nın tek bilgi kaynağı ilkesi

MESA Core, SQLite'ı değiştirilemez işlem motoru olarak kurar. LanceDB ve Kùzu tamamen türetilmiş projeksiyonlar olarak çalışır: biri silinse veya bozulsa bile MESA ikisini de kanonik SQLite veritabanından sıfır kayıpla yeniden inşa eder.

- [ ] Tüm hafıza değişiklikleri SQLite WAL kipinde kaydedilir.
- [ ] FTS5 süreç içi ve milisaniyenin altında BM25 eşleşmesi sağlar.
- [ ] Projeksiyonlar geçicidir ve kesin biçimde yeniden üretilebilir.
- [ ] Yerel hafıza okuma ve yazmalarında sıfır ağ soket gecikmesi vardır.

## Kaynaklar

1. [Hipp (2020) — SQLite Architecture and Design](https://www.sqlite.org/arch.html)
2. [MESA Core Depolama Projeksiyonları Spesifikasyonu](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)

