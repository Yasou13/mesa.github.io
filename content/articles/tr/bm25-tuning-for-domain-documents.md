---
id: "bm25-tuning-for-domain-documents"
slug: "bm25-tuning-for-domain-documents"
type: "learn"
language: "tr"
title: "Hukuki ve teknik metinler için pratik BM25 parametre optimizasyonu"
subtitle: "Terim frekansı doygunluğu (k1) ve belge uzunluğu normalizasyonunun (b) ayarlanması"
summary: "Standart BM25 varsayılanları (k1=1.2, b=0.75) genel web belgeleri için kalibre edilmiştir. Yapılandırılmış kanun metinleri ve teknik depolar özel parametreler gerektirir."
shortAnswer: "k1 parametresi terim tekrarının alaka puanını ne hızla doyurduğunu kontrol eder; b parametresi ise uzun belgelerin ne kadar cezalandırılacağını belirler."
category: "Memory & Retrieval"
tags: ["bm25", "lexical-search", "tuning", "domain-documents"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "Hukuki ve teknik metinler için pratik BM25 parametre optimizasyonu — MESA Learn"
seoDescription: "Standart BM25 varsayılanları (k1=1.2, b=0.75) genel web belgeleri için kalibre edilmiştir. Yapılandırılmış kanun metinleri ve teknik depolar özel parametre"
---

## Tek tip varsayılan parametre tuzağı

Arama kütüphaneleri genellikle 1990'ların gazete arşivleri üzerinde belirlenmiş BM25 varsayılanlarıyla gelir. Hukuk, mevzuat ve tıp gibi alanlarda belge uzunluklarındaki büyük farklar ve tekrar eden terimler bu varsayılanların arama kalitesini düşürmesine yol açar.

> [!WARNING]
> **Uzun Belge Cezası Hatası**
> Hukuk araştırmalarında b parametresini çok yüksek tutmak (örn. 0.85), kapsamlı kanun metinlerini veya Yargıtay ilamlarını aşırı cezalandırır ve kısa usul yazılarını yapay biçimde öne çıkarır.

## Mühendislik ödünleşimlerinin karşılaştırması

| Parametre | Formüldeki Rolü | Varsayılan | Alana Özgü Ayar Tavsiyesi |
| --- | --- | --- | --- |
| k1 | Terim frekansı doygunluk katsayısı | 1.2 - 1.5 | Sözleşmeler gibi terim tekrarının önemi gösterdiği metinlerde 1.8 - 2.0'ye yükseltin |
| b | Belge uzunluğu normalizasyon oranı | 0.75 | Uzun metinlerin doğal olarak birden fazla alt başlık işlediği kanunlarda 0.3 - 0.5'e düşürün |
| avgdl | Koleksiyondaki ortalama belge uzunluğu | Dinamik hesaplanır | Bölümler arasında puan kaymasını önlemek için benchmark sırasında dondurulmalıdır |
| Tokenizer / Stemmer | Morfolojik kök ve gövdeleme | Standart Porter | Türkçe için noktalı/noktasız I kurallarını bilen morfolojik analizciler kullanın |

## BM25 doygunluk eğrisi mekaniği

Bir kelimenin belgedeki sayısı arttıkça BM25 puanı asimptotik olarak (k1 + 1) değerine yaklaşır. Daha yüksek k1 değerleri eğriyi dikleştirerek sorgu ifadesini sık tekrarlayan belgeleri ödüllendirir.

```text
// SQLite FTS5 özel BM25 sütun ağırlıkları
SELECT rowid, bm25(articles_fts, 10.0, 5.0, 1.0) AS rank
FROM articles_fts
WHERE articles_fts MATCH 'tahkim sarti'
ORDER BY rank;
```

## MESA Core'da BM25 optimizasyonu

MESA Core, özelleştirilmiş sütun ağırlıkları ve kalibre edilmiş doygunluk parametreleriyle SQLite FTS5 motorunu çalıştırır. Kanun maddeleri ve esas numaraları lexical aday üretiminde öncelikli sütun çarpanları alır.

- [ ] k1 ve b parametreleri veri kümesi bölümlerine göre yapılandırılabilir.
- [ ] Sütun ağırlıkları başlık ve fıkra numarası eşleşmelerini öne çıkarır.
- [ ] Türkçe aramada noktalı ve noktasız I harflerini çözen özel tokenizer kullanılır.
- [ ] Reciprocal Rank Fusion öncesinde lexical Recall@k değeri sürekli test edilir.

## Kaynaklar

1. [Robertson vd. (1994) — Okapi at TREC-3](https://trec.nist.gov/pubs/trec3/papers/city.ps.gz)
2. [Trotman vd. (2014) — Improvements to BM25 and Language Models Examined (ADCS '14)](https://dl.acm.org/doi/10.1145/2682862.2682863)

