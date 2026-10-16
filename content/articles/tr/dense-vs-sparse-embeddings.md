---
id: "dense-vs-sparse-embeddings"
slug: "dense-vs-sparse-embeddings"
type: "learn"
language: "tr"
title: "Aramada dense embedding'ler ile sparse lexical temsillerin karşılaştırması"
subtitle: "Sürekli geometrik uzaylar ile ayrık ters indeks token ağırlıklarının analizi"
summary: "Dense embedding'ler sözcük dağarcığı farklarını aşarak anlamsal özü yakalamakta mükemmeldir; sparse temsiller ise kesin terim eşleşmelerini ve nadir kodları korur."
shortAnswer: "Dense modeller anlamı kesirli sayı vektörlerine eşler; sparse modeller ise kesin anahtar kelimeleri yüksek boyutlu ağırlıklara eşler. Sağlam mimariler her ikisini de birleştirir."
category: "Memory & Retrieval"
tags: ["dense-embeddings", "sparse-lexical", "vector-search", "bm25"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Aramada dense embedding'ler ile sparse lexical temsillerin karşılaştırması — MESA Learn"
seoDescription: "Dense embedding'ler sözcük dağarcığı farklarını aşarak anlamsal özü yakalamakta mükemmeldir; sparse temsiller ise kesin terim eşleşmelerini ve nadir kodlar"
---

## Sözcük uyumsuzluğu ile kesin tanımlayıcı paradoksu

Dense vektörler metinleri 768 veya 1536 kayan noktalı sayıya sıkıştırır. Bu sıkıştırma eş anlamlıları birleştirirken kesin karakter dizilerini siler; bu da dosya numaralarını veya teknik hata kodlarını bulmada dense modelleri yetersiz kılar.

> [!WARNING]
> **Kesin Tanımlayıcı Hata Modu**
> Dense indekste 'Madde 314/2' arandığında model 'Madde 314/1' veya 'Madde 312' metinlerini 0.94 benzerlikle döndürebilir; çünkü model spesifik fıkrayı değil genel ceza hukuku konusunu temsil eder.

## Mühendislik ödünleşimlerinin karşılaştırması

| Özellik | Dense Embedding (örn. OpenAI, Cohere) | Sparse Temsil (örn. BM25, SPLADE) |
| --- | --- | --- |
| Veri Temsili | Sabit uzunluklu kesirli vektör (örn. 1536 float) | Sözlük boyutunda seyrek (sparse) vektör |
| Anlamsal Genelleme | Yüksek: farklı ifadeleri ve kavramsal yakınlığı yakalar | Düşük: doğrudan terim frekansı ve örtüşmesine bağlıdır |
| Nadir Kod Doğruluğu | Düşük: nadir token'lar sıkıştırmada bilgi kaybeder | Çok yüksek: nadir kelimeler en yüksek IDF puanını alır |
| İndeks Depolama Boyutu | Yüksek: gigabaytlarca RAM ve HNSW grafikleri gerektirir | Kompakt: diskte sıkıştırılmış ters indeks listeleri |
| Alan Değişimi Direnci | Eğitim dışı veride performans kaybı riski | Sağlam: BM25 yeni sözcük dağarcıklarında doğrudan çalışır |

## Sürekli kosinüs mesafesi ile BM25 terim doygunluğu

Dense arama sürekli vektörler arasında kosinüs benzerliği hesaplar: cos(u, v) = (u . v) / (||u|| ||v||). Sparse arama ise BM25 olasılıksal alaka modelini uygular: terim frekansı (TF) ve ters belge frekansını (IDF) belge uzunluğu normalizasyonuyla tartar.

```text
// Sparse BM25 Puan hesaplama yapısı
Puan(D, Q) = Σ IDF(q_i) * [ (f(q_i, D) * (k1 + 1)) / (f(q_i, D) + k1 * (1 - b + b * (|D| / avgdl))) ]
```

## MESA'nın çift vektör ve lexical hattı

MESA Core dense ile sparse arasında tercih yapmaz. LanceDB dense vektör araması ile SQLite FTS5 BM25 lexical aramasını eşzamanlı çalıştırır ve iki sıralı listeyi Reciprocal Rank Fusion (RRF) ile birleştirir.

- [ ] Dense vektörler kavramsal eş anlamlıları ve çok dilli eşleşmeleri yakalar.
- [ ] BM25 tam kanun maddelerini, taraf adlarını ve hata kodlarını yakalar.
- [ ] Rank fusion yöntemi uyumsuz ham skorları normalize etme zorunluluğunu kaldırır.
- [ ] Ön filtreleme her iki hattı da yalnızca yetkili kiracı bölümünde çalıştırır.

## Kaynaklar

1. [Robertson & Zaragoza (2009) — The Probabilistic Relevance Framework: BM25 and Beyond](https://www.nowpublishers.com/article/Details/INR-019)
2. [FormalSPLADE: Sparse Lexical and Expansion Models for Information Retrieval (SIGIR '21)](https://arxiv.org/abs/2107.05720)

