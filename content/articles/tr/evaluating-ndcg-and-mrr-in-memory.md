---
id: "evaluating-ndcg-and-mrr-in-memory"
slug: "evaluating-ndcg-and-mrr-in-memory"
type: "learn"
language: "tr"
title: "Ajan hafıza retrieval'ında nDCG, MRR ve Recall@k değerlendirmesi"
subtitle: "Çok hatlı hibrit arama kesinliğini ölçmek için matematiksel sıralama metrikleri"
summary: "Ajan hafızasını değerlendirmek matematiksel temellere dayanan metrikler gerektirir: Recall@k eksiksizliği, MRR ilk isabet hızını, nDCG ise dereceli uygunluk kalitesini ölçer."
shortAnswer: "Recall@k bilginin bulunup bulunmadığını, MRR ilk isabetin sırasını, nDCG@k ise listenin genel sıralama kalitesini ölçer."
category: "Evaluation"
tags: ["evaluation", "ndcg", "mrr", "recall-at-k", "benchmarks"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Ajan hafıza retrieval'ında nDCG, MRR ve Recall@k değerlendirmesi — MESA Learn"
seoDescription: "Ajan hafızasını değerlendirmek matematiksel temellere dayanan metrikler gerektirir: Recall@k eksiksizliği, MRR ilk isabet hızını, nDCG ise dereceli uygunlu"
---

## Tek metrik yanılsaması

Ajan hafızası geliştiren ekipler genellikle 'Recall@10 = %92' gibi tek bir metrik raporlar. Ancak aranan doğru assertion 1. sıra yerine sürekli 9. sırada geliyorsa, dil modeli ciddi bağlam dağınıklığı ve token israfı yaşar.

> [!WARNING]
> **İkili Alaka Hatası**
> Tüm belgeleri yalnızca 1 (ilgili) veya 0 (ilgisiz) olarak ele almak, bir belgenin esas hükmü içerdiği, diğer ikisinin ise yalnızca yan usul bilgilerini verdiği senaryolarda başarısız olur.

## Mühendislik ödünleşimlerinin karşılaştırması

| Metrik | Tanım | İdeal Değer | Temel Duyarlılık |
| --- | --- | --- | --- |
| Recall@k | İlk k sonuç içinde bulunan ilgili belgelerin oranı | 1.0 (%100) | İlk k içindeki sıralama düzenine duyarsızdır |
| MRR (Mean Reciprocal Rank) | İlk ilgili belgenin sıra numarasının tersinin ortalaması | 1.0 (daima 1. sıra) | Yalnızca ilk isabeti değerlendirir, sonrakileri göz ardı eder |
| nDCG@k (Normalized DCG) | Dereceli kazançlarla hesaplanan DCG'nin ideal DCG'ye oranı | 1.0 (kusursuz sıra) | En ilgili belgelerin listenin en başında yer almasını ödüllendirir |
| MAP (Mean Average Precision) | Her ilgili belgedeki hassasiyet puanlarının ortalaması | 1.0 | Birden fazla ilgili belge içeren sorgularda dengeyi kurar |

## nDCG logaritmik indirim formülü

Discounted Cumulative Gain (DCG), alaka kazancını sıra numarasına göre logaritmik olarak indirger: `DCG@k = Σ (2^{rel_i} - 1) / log_2(i + 1)`. İdeal Sıralama (IDCG@k) değerine bölünerek [0.0, 1.0] aralığında liste uzunluğundan bağımsız bir skor elde edilir.

```text
// nDCG@k hesaplama Python fonksiyonu
def ndcg_at_k(relevance_scores, k):
    dcg = sum((2**rel - 1) / math.log2(idx + 2) for idx, rel in enumerate(relevance_scores[:k]))
    idcg = sum((2**rel - 1) / math.log2(idx + 2) for idx, rel in enumerate(sorted(relevance_scores, reverse=True)[:k]))
    return dcg / idcg if idcg > 0 else 0.0
```

## MESA'da değerlendirme disiplini

MESA'nın bağımsız retrieval denetim paketi, dört farklı arama hattını sentetik ve hukuki altın veri kümeleri üzerinde test eder. Her sürümde Recall@5, MRR ve nDCG@10 deterministik olarak ölçülür.

- [ ] Altın veri kümeleri dereceli alaka etiketleri (0 = ilgisiz, 3 = esas otorite) uygular.
- [ ] Sorgular ve değerlendirme kararları dondurulmuş JSONL dosyalarında sürümle tutulur.
- [ ] Sıfır sonuçlu sorgular ve başarısızlık vakaları şeffaf biçimde takip edilir.
- [ ] Değerlendirme kapıları CI ortamında kalite kayıplarını engeller.

## Kaynaklar

1. [Järvelin & Kekäläinen (2002) — Cumulated Gain-Based Evaluation of IR Techniques (ACM TOIS)](https://dl.acm.org/doi/10.1145/582415.582418)
2. [MESA Bağımsız Retrieval Denetimi ve Test Paketi](https://github.com/Yasou13/MESA/blob/main/tests/test_v4_independent_retrieval_audit.py)

