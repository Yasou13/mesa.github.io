---
id: "graph-rag-vs-pure-graphs"
slug: "graph-rag-vs-pure-graphs"
type: "learn"
language: "tr"
title: "AI hafızasında GraphRAG ile saf bilgi grafikleri karşılaştırması"
subtitle: "Hiyerarşik topluluk özetleri ile deterministik ilişkisel graph gezinimlerinin değerlendirilmesi"
summary: "GraphRAG metinleri küresel temalar için hiyerarşik topluluklar halinde kümelerken, saf bilgi grafikleri tipli assertion'ları ve kesin çok sekmeli varlık ilişkilerini temsil eder."
shortAnswer: "GraphRAG önceden hesaplanan özetlerle küresel tema sorularını yanıtlar; saf bilgi grafikleri ise deterministik topolojik gezinimlerle kesin ilişkisel soruları çözer."
category: "Memory & Retrieval"
tags: ["graph-rag", "knowledge-graph", "retrieval", "ai-memory"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "AI hafızasında GraphRAG ile saf bilgi grafikleri karşılaştırması — MESA Learn"
seoDescription: "GraphRAG metinleri küresel temalar için hiyerarşik topluluklar halinde kümelerken, saf bilgi grafikleri tipli assertion'ları ve kesin çok sekmeli varlık il"
---

## İki farklı graph felsefesi

Ajan hafızasını grafikler etrafında yapılandırırken iki temel yaklaşım öne çıkmıştır: LLM ile sentezlenen topluluk özetleri (GraphRAG) ve açık tipli assertion topolojileri (saf bilgi grafikleri).

> [!WARNING]
> **Granülerlik Ödünleşimi**
> GraphRAG belge topluluklarını kayıplı metin özetlerine dönüştürür; bu sayede 'Tüm belgelerdeki ana temalar nelerdir?' sorusunu harika çözer. Saf bilgi grafikleri ise varlık üçlülerini tam korur; Ahmet'in B Sözleşmesini imzalayıp imzalamadığını tespit ederken zorunludur.

## Mühendislik ödünleşimlerinin karşılaştırması

| Boyut | GraphRAG (Topluluk Özetleri) | Saf Bilgi Grafikleri (Tipli Üçlüler) |
| --- | --- | --- |
| Birincil Sorgu Türü | Küresel küme anlamlandırması ve tematik keşif | Deterministik varlık gezinimleri ve çok sekmeli yollar |
| Yazma/Kabul Maliyeti | Çok yüksek: kapsamlı LLM topluluk özeti gerektirir | Orta: varlık-ilişki çıkarımı ve şema doğrulaması gerektirir |
| Sorgu Determinizmi | Olasılıksal: metin özetlerini birleştirir | Deterministik: kesin Cypher/SPARQL yol sorguları |
| Çelişki Yönetimi | Zayıf: çelişkili iddialar metin özetinde bir arada kalır | Güçlü: birincil anahtarlar, revizyon bağlantıları ve geri çekme |
| Denetlenebilirlik | Düşük: iddialar sentezlenmiş özetler içinde erir | Eksiksiz: her kenar kanonik kanıt aralığına bağlanır |

## Hiyerarşik kümeleme ile açık graph topolojisi

GraphRAG, Leiden kümeleme algoritmasıyla graph düğümlerini hiyerarşik topluluklara ayırır ve her topluluk için bir LLM özeti üretir. Saf bilgi grafikleri ise düğümlerin somut varlıkları, kenarların ise doğrulanmış yüklemleri temsil ettiği biçimsel şemalar uygular.

```text
// Saf Bilgi Grafiği: Kesin Cypher çok sekmeli yol sorgusu
MATCH (p:Person {name: 'Ahmet'})-[:YONETICI]->(s:Sirket)-[:ISTIRAKI]->(h:Hedef)
RETURN p, s, h;
```

## MESA'nın deterministik graph projeksiyonu

MESA Core içinde grafikler kapalı LLM özetlerinden ibaret değildir. Kanonik hafıza, SQLite içinde doğrulanmış kanıt aralıklarıyla tipli assertion'lar kaydeder; ardından sıfır kopyalı gömülü graph analitiği için Kùzu motoruna projekte edilir.

- [ ] Kanonik assertion'lar açık Özne-Yüklem-Nesne üçlüleri saklar.
- [ ] Graph kenarları orijinal belge hash'ini ve karakter aralığını miras alır.
- [ ] Graph deposu silinse dahi kanonik SQLite kayıtlarından yeniden üretilebilir.
- [ ] Kapsam ve tenant sınırları graph genişletmesinden önce uygulanır.

## Kaynaklar

1. [Edge vd. (2024) — From Local to Global: A Graph RAG Approach to Query-Focused Summarization (Microsoft Research)](https://arxiv.org/abs/2404.16130)
2. [Hogan vd. (2021) — Knowledge Graphs (ACM Computing Surveys)](https://dl.acm.org/doi/10.1145/3447772)

