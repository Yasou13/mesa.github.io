---
id: "multi-hop-reasoning-over-knowledge-graphs"
slug: "multi-hop-reasoning-over-knowledge-graphs"
type: "learn"
language: "tr"
title: "Yapılandırılmış bilgi grafikleri üzerinde deterministik çok sekmeli muhakeme"
subtitle: "Kurumsal verilerde örtük olgu zincirlerini ortaya çıkarmak için ilişki yollarının gezilmesi"
summary: "Çok sekmeli (multi-hop) muhakeme, birden fazla varlık arasındaki bağlantılı graph kenarlarını gezerek düz metin parçalarının yanıtlayamadığı karmaşık soruları çözer."
shortAnswer: "Çok sekmeli muhakeme, varlıklar arasındaki açık graph yollarını izleyerek olasılıksal tahminler yerine doğrulanabilir ilişkisel gezinim sağlar."
category: "Memory & Retrieval"
tags: ["multi-hop", "reasoning", "knowledge-graph", "traversal"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Yapılandırılmış bilgi grafikleri üzerinde deterministik çok sekmeli muhakeme — MESA Learn"
seoDescription: "Çok sekmeli (multi-hop) muhakeme, birden fazla varlık arasındaki bağlantılı graph kenarlarını gezerek düz metin parçalarının yanıtlayamadığı karmaşık sorul"
---

## Tek parça sınırının yetersizliği

Standart RAG belgeleri bağımsız parçalara (örn. 500 token) böler. Bir cevap Belge A'daki 1. Olgu ile Belge B'deki 2. Olgunun ve Belge C'deki 3. Olgunun birleşimini gerektirdiğinde, hiçbir tek parça sorguyu karşılayamaz ve vektör arama yetersiz kalır.

> [!WARNING]
> **Çağrışımsal Körlük Riski**
> Vektör benzerliği geçişli mantığı doğrulayamaz: A'nın B ile, B'nin de C ile ilgili olduğunu bilmek, A ile C arasında belirli bir sözleşmesel bağ bulunduğunu kanıtlamaz.

## Mühendislik ödünleşimlerinin karşılaştırması

| Boyut | Düz Vektör RAG | Çok Sekmeli Bilgi Grafiği |
| --- | --- | --- |
| Yol Keşfi | İmkânsız: metin parçaları birbirinden kopuktur | Deterministik: Cypher/SPARQL yol genişletmesi |
| Geçişli Mantık Zinciri | Modelin metinler arasında tahmin yürütmesine dayanır | Kesin: `(A)-[:ORTAK]->(B)-[:SAHIP]->(C)` doğrulaması |
| Ara Adım Doğrulaması | Yok: model ara kontrol yapmadan sentezler | Her sekmede varlık kimliği ve kenar doğrulanır |
| Sekme Sınır Denetimi | Sınırsız / kontrolsüz | Yapılandırılabilir gezinim çapı (örn. max_depth=3) |
| Denetim İzi | Belirsiz metin benzerliği skoru | Adım adım yol denetim raporu |

## Cypher'da değişken uzunluklu yol ifadeleri

Graph sorgu dilleri sınırlı yol kalıpları tanımlar: `MATCH p = (baslangic:Varlik {id: $id})-[:BAG*1..3]->(hedef:Varlik)`. Gezinim, her adımın yetkilendirme ve durum kısıtlarını sağladığını kontrol eder.

```text
// Cypher içinde sınırlı çok sekmeli gezinim
MATCH yol = (calisan:Kisi {id: 'calisan_98'})-[:RAPOR_VERIR*1..3]->(yonetici:Kisi)
WHERE yonetici.unvan = 'YONETIM_KURULU_UYESI'
RETURN [dugum in nodes(yol) | dugum.ad] AS hiyerarsi_zinciri;
```

## MESA Core'da çok sekmeli gezinim

MESA Core kanonik SQLite assertion'larını Kùzu özellik grafiklerine projekte eder. Çok sekmeli ilişkisel keşif gerektiğinde MESA süreç içi Cypher sorgularını çalıştırır ve destekleyici metin aralıklarıyla doğrulanmış varlık yollarını döndürür.

- [ ] Varlıklar ve tipli ilişkiler kanonik assertion üçlüleri olarak saklanır.
- [ ] Süreç içi Kùzu motoru çok sekmeli Cypher sorgularını mikrosaniyelerde yürütür.
- [ ] Gezinimler üssel genişlemeyi önlemek için maksimum derinlik sınırı uygular.
- [ ] Dönen yollar her ara varlığı eksiksiz provenance bilgisiyle listeler.

## Kaynaklar

1. [Angles vd. (2017) — Foundations of Modern Query Languages for Graph Databases (ACM Computing Surveys)](https://dl.acm.org/doi/10.1145/3104031)
2. [MESA Bağımsız Retrieval Denetimi ve Test Senaryoları](https://mesamemory.dev/how-it-works/)

