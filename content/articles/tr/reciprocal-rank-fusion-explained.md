---
id: "reciprocal-rank-fusion"
slug: "reciprocal-rank-fusion-explained"
type: "learn"
language: "tr"
title: "Reciprocal Rank Fusion (RRF) nedir?"
subtitle: "Çok hatlı arama birleştirmesinde sıralama tabanlı yöntemin matematiksel açıklaması"
summary: "Reciprocal Rank Fusion (RRF); birden fazla arama algoritmasının sıralı listelerini, hassas skor normalizasyonuna ihtiyaç duymadan tek ve tutarlı bir sonuç kümesinde birleştirir."
shortAnswer: "RRF bir belgenin puanını, farklı hatlardaki sıralama derecelerinin terslerinin toplamı olarak hesaplar: RRF(d) = sum(1 / (k + r(d))). Birden fazla hatta istikrarlı şekilde üst sıralarda yer alan belgeler en yüksek toplam skoru alır."
category: "Memory & Retrieval"
tags: ["rrf", "rank-fusion", "retrieval", "algorithms"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-01"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "Reciprocal Rank Fusion (RRF) Nedir? — MESA Learn"
seoDescription: "Reciprocal Rank Fusion (RRF) algoritmasının matematiğini, adım adım sayısal örneğini ve çok hatlı aramadaki avantajlarını anlayın."
---

## Skor normalizasyonu neden zordur?

Hybrid arama geliştirirken farklı algoritmaların skorlarını birleştirmek şaşırtıcı derecede zordur. Dense vektör modelleri 0.0 ile 1.0 arasında sıkışmış kosinüs benzerliği üretir. BM25 lexical arama ise terim nadirliğine ve belge uzunluğuna bağlı olarak 2.0'dan 35.0+'e kadar sınırsız pozitif skorlar verir.

Min-max normalizasyonu veya z-score standardizasyonu bu uçurumu kapatmaya çalışır ancak ikisi de kırılgandır. Lexical aramada tek bir uç değer tüm dağılımı saptırabilir ve bir arama kipinin diğerini yapay biçimde ezmesine yol açabilir.

**Skor Kalibrasyon Kayması**
: Farklı istatistiksel dağılımlardan gelen ham skorları ortak bir referans noktası olmadan birleştirmeye çalışırken ortaya çıkan matematiksel bozulma.

## RRF formülünün açıklaması

2009 yılında Cormack, Clarke ve Buettcher Reciprocal Rank Fusion (RRF) yöntemini geliştirdi. RRF ham skorlar yerine yalnızca her belgenin ilgili arama listesindeki sıra numarasını (rank) değerlendirir:

```text
RRF_skoru(d) = Σ [ 1 / (k + r_m(d)) ]  (her m kipi için)
```

- d: Değerlendirilen aday belge veya hafıza assertion'ı.
- m: Belirli bir arama kipi (örneğin vektör, BM25, graph).
- r_m(d): d belgesinin m kipindeki sıra numarası (1. sıra için 1, 2. sıra için 2 vb.).
- k: Yumuşatma sabiti, geleneksel olarak 60 alınır. 1. sıra ile 2. sıra arasındaki farkın, birden fazla listede istikrarlı görünmenin önüne geçmesini engeller.

## Adım adım sayısal bir örnek

İki arama hattında (Vektör ve BM25) k = 60 sabitiyle geri getirilen üç belgeyi karşılaştıralım:

| Belge | Vektör Sırası | BM25 Sırası | Hesaplama (k=60) | Nihai RRF Skoru |
| --- | --- | --- | --- | --- |
| Belge A | 1. Sıra | 10. Sıra | 1/(60+1) + 1/(60+10) = 0.01639 + 0.01429 | 0.03068 |
| Belge B | 2. Sıra | 2. Sıra | 1/(60+2) + 1/(60+2) = 0.01613 + 0.01613 | 0.03226 (Kazanan) |
| Belge C | 25. Sıra | 1. Sıra | 1/(60+25) + 1/(60+1) = 0.01176 + 0.01639 | 0.02815 |

> [!NOTE]
> **Belge B neden kazandı?**
> Belge B hiçbir hatta birinci olamadı; ancak iki hatta da istikrarlı biçimde üst sırada (2. sıra) yer aldığı için toplam puanı, vektörde 1. olup BM25'te 10. sıraya düşen Belge A'yı geçti. RRF çok hatlı uzlaşmayı ödüllendirir.

## RRF neden yapay zekâ hafızası için idealdir?

- [ ] Ayar (tuning) gerektirmez: Ağırlıklı doğrusal birleştirmelerin aksine, k=60 ile RRF farklı alanlarda parametre ayarı gerektirmeden en iyi performansı gösterir.
- [ ] Kip bağımsızdır: Değişiklik gerekmeden 2, 3, 4 veya daha fazla hattı (vektör, anahtar kelime, graph, zaman sönümlenmesi) birleştirebilir.
- [ ] Eksik hat toleransı: Bir assertion bir hattan sonuç alamazsa, o hattan 0 katkı alır; diğer hatlardaki olumlu derecesi cezalandırılmaz.

## MESA mimarisinde gerçek RRF

[MESA Core](mesa/) içinde V4 router'ı, dört farklı sonuç kaynağı arasında gerçek RRF hesaplar: `vector`, `bm25`, `assertion` ve `graph`.

Doğrulanmış test fixture'ı `Alice knows Aurora` senaryosunda, hedef hafıza assertion'ı dört hatta da aynı anda 1. sırayı alır. Ortaya çıkan skor tam olarak şöyledir:

```text
RRF_skoru = 1/(60+1) + 1/(60+1) + 1/(60+1) + 1/(60+1) = 4 / 61 ≈ 0.06557
```

Bu deterministik hesaplamayı [MESA Nasıl Çalışır](how-it-works/) sayfasında görebilir ve açık kaynak test paketinde doğrulayabilirsiniz.

## Kaynaklar

1. [Cormack, Clarke ve Buettcher (2009) — Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods (SIGIR '09)](https://dl.acm.org/doi/10.1145/1571941.1572114)
2. [MESA Retrieval Fixture Testi: test_real_four_lanes_fuse_once_and_repeat_deterministically](https://github.com/Yasou13/MESA/blob/main/tests/test_v4_independent_retrieval_audit.py)

