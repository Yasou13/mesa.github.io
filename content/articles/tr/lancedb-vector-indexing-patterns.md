---
id: "lancedb-vector-indexing-patterns"
slug: "lancedb-vector-indexing-patterns"
type: "learn"
language: "tr"
title: "LanceDB ve sütunlu formatlarla yüksek performanslı vektör depolama"
subtitle: "Diskten doğrudan vektör araması, IVF-PQ indeksleme ve sıfır kopyalı Arrow bellek arabellekleri"
summary: "LanceDB, sütunlu Lance formatını kullanarak tüm vektör indeksinin bellekte bulunması gerekmeden doğrudan NVMe depolama üzerinde en yakın komşu aramasını yürütür."
shortAnswer: "Lance formatı sütunlu yerleşim, IVF-PQ sıkıştırması ve Apache Arrow sıfır kopya erişimiyle vektör aramayı RAM sınırlarından kurtarır."
category: "Memory & Retrieval"
tags: ["lancedb", "vector-storage", "columnar", "hnsw"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "LanceDB ve sütunlu formatlarla yüksek performanslı vektör depolama — MESA Learn"
seoDescription: "LanceDB, sütunlu Lance formatını kullanarak tüm vektör indeksinin bellekte bulunması gerekmeden doğrudan NVMe depolama üzerinde en yakın komşu aramasını yü"
---

## Vektör veritabanlarında RAM patlaması

Geleneksel bellek içi vektör veritabanları tüm HNSW grafiğini sistem RAM'inde tutar. Ajan hafızası milyonlarca parçaya ulaştığında sunucu bellek maliyeti katlanarak artar.

> [!WARNING]
> **Bellek Tükenmesi (OOM) Çöküşü**
> Ajan konteynerlerinde HNSW grafikleri çalıştırmak, toplu belge aktarımı sırasında bellek dolduğunda sistemin aniden çökmesine (OOM kill) yol açar.

## Mühendislik ödünleşimlerinin karşılaştırması

| Özellik | Salt Bellek İçi HNSW | Lance Sütunlu Format (LanceDB) |
| --- | --- | --- |
| Depolama Yeri | %100 RAM içinde tutulur | Diskte (NVMe) saklanır, yalnızca gereken bloklar önbelleğe alınır |
| Ölçeklenme Sınırı | Fiziksel RAM boyutuyla sınırlıdır | Yerel disk kapasitesi ölçüsünde milyarlarca vektöre ölçeklenir |
| Veri Serileştirme | Özel ikili yapılar | Apache Arrow yerel sıfır kopyalı bellek |
| Hibrit Sorgulama | Sonradan filtreleme gerektirir | Sütunlu SQL filtreleri doğrudan disk taramasına itilir |
| İndeksleme Hızı | Yavaş: karmaşık graph inşası | Hızlı: Ters Dosya Nicemleme (IVF-PQ) |

## Sütunlu vektörler ve IVF-PQ nicemleme

LanceDB veriyi sütun bloklarına böler; vektör dizileri ve metaveri sütunları diskte ardışık saklanır. IVF-PQ algoritması vektör uzayını Voronoi hücrelerine ayırır ve kesirli sayıları ürün nicemleme kodlarıyla sıkıştırır.

```text
// LanceDB Python vektör araması ve metaveri filtresi
import lancedb
db = lancedb.connect('./lancedb_memory')
tbl = db.open_table('embeddings')
results = tbl.search(sorgu_vektoru).where('tenant_id = "corp_a"').limit(10).to_arrow()
```

## MESA Core'da LanceDB entegrasyonu

MESA Core, yoğun vektör projeksiyon katmanı olarak LanceDB'yi kullanır. SQLite assertion metinlerinden üretilen embedding'ler Lance tablolarına projekte edilir; sıfır kopyalı ve milisaniyenin altında arama sağlanır.

- [ ] Embedding'ler yerel NVMe diskte sütunlu Lance formatında saklanır.
- [ ] Sıfır kopyalı Apache Arrow entegrasyonu serileştirme yükünü ortadan kaldırır.
- [ ] Metaveri filtreleri vektör taramasından önce uygulanır.
- [ ] Vektör projeksiyonları kanonik SQLite veritabanından yeniden üretilebilir.

## Kaynaklar

1. [Lance Sütunlu Veri Formatı Spesifikasyonu](https://lancedb.github.io/lance/)
2. [Jegou vd. (2011) — Product Quantization for Nearest Neighbor Search (IEEE TPAMI)](https://ieeexplore.ieee.org/document/5432202)

