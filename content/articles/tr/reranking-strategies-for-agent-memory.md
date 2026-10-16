---
id: "reranking-strategies-for-agent-memory"
slug: "reranking-strategies-for-agent-memory"
type: "learn"
language: "tr"
title: "Hafıza sistemlerinde cross-encoder reranking ve ikinci aşama puanlaması"
subtitle: "Tam cross-attention modelleriyle aday geri getirme hassasiyetinin artırılması"
summary: "İlk aşama retrieval adayları hızla toplarken, ikinci aşama cross-encoder modelleri sorgu ile belge arasında derin çapraz dikkat kurarak hatalı eşleşmeleri eler."
shortAnswer: "Bi-encoder'lar milyonlarca kayıt üzerinde hız sağlar; cross-encoder'lar ise ilk 50 aday üzerinde token etkileşimlerini inceleyerek kesinlik sağlar."
category: "Memory & Retrieval"
tags: ["reranking", "cross-encoder", "retrieval", "precision"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Hafıza sistemlerinde cross-encoder reranking ve ikinci aşama puanlaması — MESA Learn"
seoDescription: "İlk aşama retrieval adayları hızla toplarken, ikinci aşama cross-encoder modelleri sorgu ile belge arasında derin çapraz dikkat kurarak hatalı eşleşmeleri"
---

## Bi-encoder bağımsızlık sınırlaması

İlk aşama arama motorları (bi-encoder ve BM25) sorgu ve belgeleri birbirinden bağımsız işler. İndeksleme sırasında sorgu kelimeleri belge kelimeleriyle etkileşime giremediğinden olumsuzluk veya şart ekleri gibi kritik anlamları kaçırabilirler.

> [!WARNING]
> **İlk-K Kirlenme Riski**
> İlk aşamadan gelen ham 20 sonucu doğrudan ajanın bağlamına beslemek, değerli token bütçesini tüketir ve ajanın muhakemesini bozan yanıltıcı parçalar ekler.

## Mühendislik ödünleşimlerinin karşılaştırması

| Aşama | Model Mimarisi | Sorgu Başına Gecikme | Puanlama Mekanizması |
| --- | --- | --- | --- |
| İlk Aşama Retrieval | Bi-Encoder (HNSW) + BM25 | 1.000.000 kayıtta < 5 ms | Önceden hesaplanmış vektörler arasında nokta çarpımı |
| İkinci Aşama Reranking | Cross-Encoder (Tam Transformer) | İlk 50 adayda 20-80 ms | Birleştirilmiş (Sorgu, Belge) token'ları üzerinde çapraz dikkat |
| Üçüncü Aşama Doğrulama | Deterministik Assertion Mantığı | İlk 10 adayda < 1 ms | Şema filtreleme, kanıt doğrulaması ve zaman kontrolü |

## Çapraz dikkat (cross-attention) ile nokta çarpımı farkı

Cross-encoder mimarisinde sorgu ve belge tek bir dizide birleştirilir: `[CLS] Sorgu [SEP] Belge [SEP]`. Tüm transformer katmanları sorgudaki her kelimenin belgedeki her kelimeyle doğrudan etkileşime girmesini sağlar; 'hariç', 'koşuluyla' gibi nüanslar tam yakalanır.

```text
// Cross-encoder çalıştırma yapısı
Girdi = '[CLS] Ahmet''in vekalet yetkisi var mı? [SEP] Ahmet''e taşınmaz satışları hariç olmak üzere sınırlı vekalet verilmiştir. [SEP]'
Çıktı Olasılığı = [0.12 (ilgisiz), 0.88 (ilgili)]
```

## MESA'nın çok aşamalı retrieval hattı

MESA Core içinde ilk aşama retrieval; vektör, BM25 ve graph hatlarından geniş bir aday havuzu toplar. Adaylar RRF ile birleştirilir, hassasiyet için rerank edilir ve prompt'a girmeden önce deterministik kontrol kapılarından geçer.

- [ ] İlk aşama tamamlayıcı hatlar üzerinden geniş recall sağlar.
- [ ] Cross-encoder reranking yüzeysel eşleşmeleri ve yanıltıcı parçaları ayıklar.
- [ ] Rerank edilen sonuçlar kanonik kanıt aralıklarına olan değiştirilemez işaretçilerini korur.
- [ ] Katı gecikme bütçeleri reranking işleminin sistem yanıt süresini aşmamasını garanti eder.

## Kaynaklar

1. [Nogueira & Cho (2019) — Passage Re-ranking with BERT](https://arxiv.org/abs/1901.04085)
2. [Thakur vd. (2021) — BEIR: A Heterogeneous Benchmark for Zero-shot Evaluation of Information Retrieval Models (NeurIPS)](https://arxiv.org/abs/2104.08663)

