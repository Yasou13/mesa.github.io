---
id: "kuzu-graph-storage-projections"
slug: "kuzu-graph-storage-projections"
type: "learn"
language: "tr"
title: "Hafıza projeksiyonlarında Kùzu ile gömülü graph analitiği"
subtitle: "İstemci-sunucu ağ gecikmesi olmadan yüksek performanslı Cypher graph sorguları"
summary: "Kùzu; çok sekmeli graph analitiği için optimize edilmiş, sütunlu depolama kullanan gömülü bir özellik grafiği veritabanıdır; türetilmiş hafıza projeksiyonları için idealdir."
shortAnswer: "Kùzu doğrudan Python ve Node süreçleri içine gömülür, hafıza üçlüleri üzerinde karmaşık Cypher yol gezinimlerini mikrosaniyeler içinde yürütür."
category: "Foundations"
tags: ["kuzu", "graph-database", "projections", "analytics"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Hafıza projeksiyonlarında Kùzu ile gömülü graph analitiği — MESA Learn"
seoDescription: "Kùzu; çok sekmeli graph analitiği için optimize edilmiş, sütunlu depolama kullanan gömülü bir özellik grafiği veritabanıdır; türetilmiş hafıza projeksiyonl"
---

## Ağır graph veritabanı sorunu

Geleneksel graph veritabanları (Neo4j, TigerGraph) bağımsız JVM veya ağ sunucuları olarak çalışır. Ajan çalışma zamanlarında her graph sorgusu için TCP soket çağrıları yapmak sorgu başına 10-30 ms gecikme ekler.

> [!WARNING]
> **Operasyonel Yük Tehlikesi**
> Uç cihazlarda veya yerel masaüstü iş akışlarında bağımsız graph sunucuları çalıştırmak yüksek RAM tüketimi ve karmaşık konteyner yönetim zorunlulukları doğurur.

## Mühendislik ödünleşimlerinin karşılaştırması

| Boyut | Harici Sunucu (örn. Neo4j) | Gömülü Motor (Kùzu) |
| --- | --- | --- |
| Süreç Mimarisi | TCP / Bolt protokolü üzerinden istemci-sunucu | Süreç içi gömülü C++ kütüphanesi (sıfır ağ gecikmesi) |
| Depolama Modeli | Geleneksel adjacency listeleri | Sütunlu bellek haritalı vektör blokları (DuckDB benzeri) |
| Sorgu Dili | Cypher / GQL | Modern openCypher standardı |
| Başlatma Süresi | 10 - 45 saniye (JVM ısınması) | < 5 milisaniye |
| Bellek Ayak İzi | Minimum 1 - 4 GB heap alanı | < 50 MB taban bellek |

## Sütunlu graph depolama ve faktörizasyon

Kùzu, faktörize sorgu yürütme özelliğine sahip sütunlu depolama kullanır: ara join sonuçları kompakt tablolar halinde saklanır ve çok sekmeli gezinimlerde yaşanan üssel durum patlaması engellenir.

```text
// Python içinde Kùzu gömülü çalıştırma
import kuzu
db = kuzu.Database('./kuzu_memory')
conn = kuzu.Connection(db)
results = conn.execute('MATCH (a:Varlik)-[:UYESIDIR]->(g:Grup) WHERE a.ad = $ad RETURN g.ad', {'ad': 'Ahmet'})
```

## MESA Core'da Kùzu entegrasyonu

MESA Core, Kùzu'yu özel graph projeksiyon motoru olarak kullanır. SQLite'taki ilişkisel assertion'lar Kùzu düğüm ve kenarlarına projekte edilir; böylece çok sekmeli yollar anında taranabilir.

- [ ] Kùzu, SQLite ve LanceDB ile birlikte tamamen süreç içi çalışır.
- [ ] Özellik grafiği şeması kanonik SQLite assertion üçlülerini yansıtır.
- [ ] Graph projeksiyonları silinip kanonik tablolardan yeniden üretilebilir.
- [ ] 2 sekmeli ve 3 sekmeli çıkar çatışması analizlerini mikrosaniyelerde tamamlar.

## Kaynaklar

1. [Kùzu Veritabanı Mimarisi ve Benchmarkları](https://kuzudb.com/)
2. [MESA Core Depolama Projeksiyonları Spesifikasyonu](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)

