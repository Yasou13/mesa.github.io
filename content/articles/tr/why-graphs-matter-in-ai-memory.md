---
id: "why-graphs-matter"
slug: "why-graphs-matter-in-ai-memory"
type: "learn"
language: "tr"
title: "AI memory sistemlerinde grafikler (graph) neden önemlidir?"
subtitle: "Ajan bilgisinde varlıklar, çok sekmeli gezinimler ve ilişkisel bağlam"
summary: "Bilgi grafikleri varlıkları ve açık ilişkilerini temsil eder; yapay zekâ ajanlarının düz metin aramasının çözemediği çok sekmeli bağlantıları ve topolojik bağlamı gezmesini sağlar."
shortAnswer: "Grafikler olguları açık tipli kenarlarla birbirine bağlar; ajanların anlamsal benzerlikle tahmin yürütmek yerine ilişkisel yolları gezerek karmaşık soruları yanıtlamasına imkân tanır."
category: "Memory & Retrieval"
tags: ["knowledge-graph", "relations", "ai-memory", "graph-theory"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-01"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "AI Memory Sistemlerinde Grafikler (Graph) Neden Önemlidir? — MESA Learn"
seoDescription: "Ajan hafızasında bilgi grafiklerini keşfedin: varlıklar, tipli ilişkiler, çok sekmeli gezinimler ve grafik derinliği ile yazma karmaşıklığı arasındaki ödünleşimler."
---

## Yalıtılmış olgulardan bağlantılı ağlara

Yapılandırılmamış hafıza olguları birbirinden kopuk metin parçaları olarak saklar: 'Ahmet X Hukuk Bürosunda ortaktır', 'X Hukuk Bürosu Y Şirketini temsil eder', 'Y Şirketi Z İştirakini satın almıştır'. Yalnızca düz vektör aramasına dayanan bir ajan, her cümleyi uzayda izole bir nokta olarak görür.

![Birbirine bağlı graph düğümlerini, 2 sekmeli gezinimleri ve kapsam sınırlarını gösteren tarihi gravür plakası](assets/topological-network-plate.svg)
*Topolojik graph gezinimi, varlıklar arasındaki tipli ilişki yollarını takip ederek bağlamı birden fazla sekmede çözümler.*

Bir bilgi grafiği bu olguları açık ve gezilebilir bir topolojiye bağlar: `(Ahmet)-[:ORTAK]->(X Bürosu)-[:TEMSİL_EDER]->(Y Şirketi)-[:SATIN_ALDI]->(Z İştiraki)`. İlişkilerin kendisi birinci sınıf, sorgulanabilir veri varlıkları haline gelir.

## Çok sekmeli gezinim (multi-hop traversal) nasıl çalışır?

Bir ajanın 'Ahmet'in Z İştiraki ile potansiyel bir çıkar çatışması var mı?' sorusunu yanıtlaması gerektiğini düşünün:

- Vektör Arama başarısızlığı: Hiçbir tek metin parçası hem 'Ahmet' hem de 'Z İştiraki' ifadelerini birlikte içermez. Sorgu ile izole metin parçaları arasındaki benzerlik düşüktür.
- Graph Gezinimi başarısı: Ajan 'Ahmet' varlık düğümünü sorgular, dışa doğru ilişki kenarlarını takip eder ve onu Z İştirakine bağlayan çok sekmeli yolu 3 deterministik adımda keşfeder.

**Çok Sekmeli Gezinim (Multi-Hop Traversal)**
: Tek bir metin parçasında açıkça belirtilmeyen dolaylı ilişkileri çıkarmak için bağlantılı kenarlar $(E_1 ightarrow E_2 ightarrow \dots ightarrow E_k)$ boyunca sırayla ilerleme süreci.

## Grafikler ne zaman yardımcı olur — ne zaman gereksiz karmaşıklık getirir?

Grafikler tüm yapay zekâ uygulamaları için zorunlu değildir. Basit problemlere graph altyapısı eklemek ciddi bir mühendislik yükü yaratır:

| Boyut | Düz Vektör / Lexical Hafıza | Graph Destekli Hafıza |
| --- | --- | --- |
| Kabul / Yazma Maliyeti | Düşük: metin parçalarını doğrudan vektörleştir | Yüksek: LLM ile varlık, tip ve ilişki çıkarımı gerektirir |
| Çıkarım Güvenilirliği | Deterministik metin bölme | Olasılıksal: LLM var olmayan ilişkiler halüsinasyon edebilir |
| İlişkisel Çok Sekmeli Muhakeme | Çok zayıf: akıl yürütme zincirlerini izleyemez | Çok güçlü: yol sorguları (Cypher, SPARQL) kesindir |
| Sorgu Gecikmesi | Milisaniyenin altında vektör taraması | Değişken: graph çapına ve bağlantı yoğunluğuna bağlıdır |
| İdeal Kullanım Alanları | Belge arama, SSS, anlamsal keşif | Şirket yapıları, hukuki çatışmalar, bağımlılık ağları |

## Çıkarım ve senkronizasyon zorluğu

Üretim ortamlarında bağımsız bir graph veritabanını tek bilgi kaynağı (source of truth) yapmak senkronizasyon krizlerine yol açar. Bir varlık güncellendiğinde veya silindiğinde, graph düğümlerinin yetim kalmaması için atomik olarak güncellenmesi gerekir.

> [!WARNING]
> **Graph veritabanlarını birincil veri kaynağı yapmayın**
> Büyük dil modelleriyle graph ilişkileri çıkarmak doğası gereği gürültülüdür. Graph veritabanı tek kayıt yeri olursa, hataları düzeltmek zorlu ameliyatlar gerektirir. Sağlam mimariler kanonik bir ilişkisel depo tutar ve graph projeksiyonlarını aşağı akışta türetir.

## MESA graph hafızasını nasıl uygular?

[MESA Core](mesa/) içinde graph, dışarıdan bağımlı kapalı bir veritabanı değildir. Kanonik hafıza, SQLite içinde yapılandırılmış assertion'lar olarak kaydedilir. MESA ardından ilişkisel üçlüleri analitik graph sorguları için optimize edilmiş süreç içi [Kùzu](mesa/) veritabanına projekte eder.

Bu projeksiyon yaklaşımı işlemsel dayanıklılık sağlar: graph projeksiyonu bozulursa veya senkronizasyonunu kaybederse, kanonik SQLite deposundan deterministik olarak yeniden üretilebilir. Veri projeksiyonlarını [MESA Core](mesa/) sayfasında inceleyin.

## Kaynaklar

1. [Hogan vd. (2021) — Knowledge Graphs (ACM Computing Surveys)](https://dl.acm.org/doi/10.1145/3447772)
2. [Angles & Gutierrez (2008) — Survey of Graph Database Models](https://dl.acm.org/doi/10.1145/1322432.1322433)
3. [MESA Core Depolama Projeksiyonları Spesifikasyonu](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)

