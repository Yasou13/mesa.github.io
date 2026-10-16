---
id: "benchmarking-retrieval-latency"
slug: "benchmarking-retrieval-latency"
type: "learn"
language: "tr"
title: "Hibrit retrieval hatlarında uçtan uca gecikme süresinin ölçülmesi"
subtitle: "Eşzamanlı çok hatlı yük altında p50, p95 ve p99 sorgu performansının analizi"
summary: "Retrieval performansını ölçmek; bireysel hatlar (Vektör, BM25, Graph, SQL) ve birleşim aşaması boyunca gecikme dağılımlarını eşzamanlı yük altında takip etmeyi gerektirir."
shortAnswer: "Ortalama gecikme ciddi kuyruk gecikmesi sıçramalarını gizler. Sistemler p95 ve p99 yanıt sürelerini eşzamanlı hatlar üzerinde ölçmelidir."
category: "Retrieval Evaluation"
tags: ["latency", "benchmarking", "hybrid-retrieval", "performance"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Hibrit retrieval hatlarında uçtan uca gecikme süresinin ölçülmesi — MESA Learn"
seoDescription: "Retrieval performansını ölçmek; bireysel hatlar (Vektör, BM25, Graph, SQL) ve birleşim aşaması boyunca gecikme dağılımlarını eşzamanlı yük altında takip et"
---

## Aritmetik ortalama gecikme yanılsaması

'Ortalama gecikme 15 ms' gibi raporlar; sorguların %5'inin indekslenmemiş graph aramaları veya iş parçacığı tükenmesi nedeniyle 500 ms sürdüğü kuyruk gecikmesi felaketlerini gizler.

> [!WARNING]
> **Kuyruk Gecikmesi Bulaşması**
> Dört hattın aynı anda çalıştığı hibrit mimarilerde toplam süreyi en yavaş hat belirler: toplam süre = maks(hat_1, hat_2, hat_3, hat_4).

## Mühendislik ödünleşimlerinin karşılaştırması

| Retrieval Hattı | Motor | p50 Hedefi | p99 Hedefi |
| --- | --- | --- | --- |
| Dense Vektör Hattı | LanceDB (sütunlu disk tabanlı) | 3.5 ms | 12.0 ms |
| Lexical BM25 Hattı | SQLite FTS5 (süreç içi B-tree) | 0.8 ms | 4.2 ms |
| Assertion SQL Hattı | SQLite indeksli tablo taraması | 0.4 ms | 1.8 ms |
| Graph Gezinim Hattı | Kùzu gömülü 2 sekmeli sorgu | 1.5 ms | 8.5 ms |
| Reciprocal Rank Fusion | Bellek içi matematiksel sıra birleşimi | 0.1 ms | 0.5 ms |

## Paralel yürütüm ve asenkron koordinasyon

Hibrit arama, bloklamayan asenkron çalışma zamanlarıyla eşzamanlı sorgular dağıtır. Hat başına tanımlanan katı zaman aşımı bütçesi, uzayan bir graph aramasının tüm arama sürecini kilitlemesini engeller.

```text
// Zaman aşımı korumalı paralel hat dağıtımı
async def hibrit_arama(sorgu, zaman_asimi_ms=50):
    gorevler = [vektor_hatti(sorgu), bm25_hatti(sorgu), graph_hatti(sorgu), sql_hatti(sorgu)]
    sonuclar = await asyncio.wait_for(asyncio.gather(*gorevler, return_exceptions=True), timeout=zaman_asimi_ms/1000)
    return reciprocal_rank_fusion([s for s in sonuclar if not isinstance(s, Exception)])
```

## MESA'da gecikme ölçümü ve optimizasyon

MESA'nın otomatik benchmark paketleri her derlemede p50, p95 ve p99 sürelerini ölçer. SQLite, LanceDB ve Kùzu ağ soketi olmadan tamamen süreç içi çalıştığından MESA p99 seviyesinde 15 ms'nin altında uçtan uca hibrit arama sağlar.

- [ ] Sıfır ağ soketi kullanımı süreçler arası gecikme yükünü tamamen kaldırır.
- [ ] Asenkron sorgu dağıtımı dört hattın tamamını eşzamanlı çalıştırır.
- [ ] Hat bazlı zaman aşımı sınırları öngörülebilir kuyruk süreleri sunar.
- [ ] CI performans kapıları p99 gecikmesini artıran commit'leri otomatik engeller.

## Kaynaklar

1. [Dean & Barroso (2013) — The Tail at Scale (Communications of the ACM)](https://cacm.acm.org/magazines/2013/2/160173-the-tail-at-scale/fulltext)
2. [MESA Bağımsız Retrieval Denetimi ve Benchmarkları](https://github.com/Yasou13/MESA/blob/main/tests/test_v4_independent_retrieval_audit.py)

