---
id: "hybrid-retrieval"
slug: "hybrid-retrieval-explained"
type: "learn"
language: "tr"
title: "Hybrid retrieval açıklaması: Vektör arama, lexical arama ve yapılandırılmış sinyaller"
subtitle: "Çok hatlı geri getirme sistemlerinin sağlam erişim için tamamlayıcı arama kiplerini nasıl birleştirdiği"
summary: "Hybrid retrieval; dense vektör embedding'leri, sparse lexical ters indeksleri (BM25) ve yapılandırılmış veritabanı filtrelerini birleştirerek tek stratejili arama hatalarını önler."
shortAnswer: "Dense vektörler anlamı yakalar, lexical arama kesin terimleri yakalar ve yapılandırılmış sorgular katı kısıtları uygular; bunları birleştirmek dayanıklı bir retrieval hattı oluşturur."
category: "Memory & Retrieval"
tags: ["hybrid-retrieval", "vector-search", "bm25", "search", "retrieval"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-01"
readingMinutes: 9
status: "published"
indexable: true
seoTitle: "Hybrid Retrieval Açıklaması: Vektör, BM25 ve Yapı — MESA Learn"
seoDescription: "Hybrid retrieval'ın dense vektör arama, sparse BM25 sözcük sinyalleri ve yapılandırılmış kısıtları Reciprocal Rank Fusion ile nasıl birleştirdiğini anlayın."
---

## Tek kipli geri getirme neden başarısız olur?

Her bağımsız geri getirme paradigmasının iyi belgelenmiş bir hata modu vardır. Yalnızca tek bir mekanizmaya güvenmek, otonom bir ajanı sistematik kör noktalara açık bırakır:

| Retrieval Kipi | Birincil İndeks | Belirgin Güçlü Yön | Temel Hata Modu |
| --- | --- | --- | --- |
| Dense Vektör Arama | HNSW / IVF embedding'leri | Anlamsal eş anlamlılık ve kavramsal eşleşme | Nadir token'larda, sayılarda ve kesin kodlarda yanılır |
| Sparse Lexical Arama | BM25 / Ters indeks | Kesin anahtar kelime ve nadir tanımlayıcı eşleşmesi | Eş anlamlılık ve sözcük uyumsuzluğunda sonuç bulamaz |
| Yapılandırılmış Assertion Arama | B-tree / İlişkisel SQL | Deterministik mantıksal ve sayısal filtreler | Şemaya uymayan serbest dilli sorgularda sonuç vermez |
| Graph Yol Gezinimi | Adjacency indeksi / Graph DB | Varlıklar arasındaki çok sekmeli ilişkisel yollar | Açık kenar çıkarımı yapılmamış izole olgularda yetersiz kalır |

## Çok hatlı arama pratikte nasıl çalışır?

Hybrid retrieval mimarisinde bir kullanıcı sorgusu, aynı veri tabanı üzerinde eşzamanlı olarak birden fazla hatta iletilir:

<!-- diagram: Sorgunun Vektör, BM25, Assertion ve Graph hatlarına dağıtılıp Reciprocal Rank Fusion ile birleştirilmesini gösteren şema -->
1. Sorgu Kabulü ve Kapsam Doğrulaması
2. Paralel Dağıtım: Vektör + BM25 + Assertion + Graph
3. Hat Puanlaması ve Aday Üretimi
4. Reciprocal Rank Fusion (RRF) Birleşimi
5. Birleştirilmiş ve Sıralanmış Sonuçlar

*Çok hatlı geri getirme, nihai aday listesini sentezlemeden önce birden fazla tamamlayıcı bakış açısını değerlendirir.*

Adayları birden fazla hat üzerinden değerlendirerek, vektör aramasında orta sırada kalan ancak BM25'te tam bir karar numarasını yakalayan bir belge öne çıkarılır ve hatalı dışlamalar önlenir.

## Birleştirme stratejileri: Skor normalizasyonu ile rank fusion

Ayrı hatlar aday sonuçlar ürettiğinde, bu skorlar nasıl birleştirilmelidir? İki temel strateji vardır:

> [!WARNING]
> **Skor normalizasyonu tehlikesi**
> Dense vektör kosinüs benzerliği $[0, 1]$ aralığında skorlar üretirken, BM25 belge uzunluğuna ve terim nadirliğine bağlı olarak $[0, \infty)$ aralığında sınırsız skorlar üretir. Bu skorları doğrudan veya min-max ölçeklemesiyle birleştirmek kırılgandır: BM25'teki tek bir uç değer vektör uygunluğunu tamamen bastırabilir.

Sıralama tabanlı birleştirme, özellikle [Reciprocal Rank Fusion (RRF)](learn/reciprocal-rank-fusion-explained/), ham skorları tamamen göz ardı edip belgenin listelerdeki sırasını değerlendirerek bu sorunu çözer: $RRF(d) = \sum rac{1}{k + r(d)}$. Kalibrasyon gerektirmez ve matematiksel olarak kararlıdır.

## Birleşim öncesi kapsam denetiminin önemi

Ajanlar için hybrid retrieval tasarımında kritik bir gereksinim yetkilendirmenin nerede yapıldığıdır:

- [ ] Ön Filtreleme (Doğru): Tenant, workspace, ajan ve zamansal filtreleri vektör taramasından veya BM25 sorgusundan önce uygulayın.
- [ ] Sonradan Filtreleme (Hatalı): Adayları genel indeksten çekip yetkisizleri sonradan ayıklamak, sonuç listesinin boş kalmasına veya kesilmesine yol açar.
- [ ] Kapsam Korunumu: Birleştirilmiş sonuçların ilgili hatların güvenlik sınırlarını miras aldığından emin olun.

## MESA'nın dört hatlı retrieval motoru

[MESA Core](mesa/) içinde V4 retrieval router'ı dört belirgin hat yürütür: `vector` (LanceDB ile), `bm25` (SQLite FTS5 ile), `assertion` (kanonik SQLite tabloları ile) ve `graph` (Kùzu ile).

MESA; dataset, tenant, ajan, zaman ve yargı yetkisi kısıtlarını hatların çalıştırılmasından *önce* uygular. Kamuya açık test fixture'ı `Alice knows Aurora`, bir assertion dört hatta da 1. sırada yer aldığında RRF skorunun deterministik olarak $4/61$ hesaplandığını doğrular. Uygulama ayrıntılarını [MESA Nasıl Çalışır](how-it-works/) sayfasında bulabilirsiniz.

## Kaynaklar

1. [Cormack vd. (2009) — Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods](https://dl.acm.org/doi/10.1145/1571941.1572114)
2. [MESA Bağımsız Retrieval Denetimi ve Test Paketi](https://github.com/Yasou13/MESA/blob/main/tests/test_v4_independent_retrieval_audit.py)
3. [Reciprocal Rank Fusion Nedir? — MESA Learn](learn/reciprocal-rank-fusion-explained/)

