---
id: "measure-search-quality"
slug: "measure-search-quality"
type: "guide"
language: "tr"
title: "Arama kalitesi Recall ve MRR ile nasıl ölçülür?"
subtitle: ""
summary: "Küçük bir etiketli soru seti hazırlayın, doğru belgenin nerede çıktığını kaydedin ve iki arama ayarını karşılaştırın."
shortAnswer: "Gerçek sorular yazın, her biri için doğru belgeyi işaretleyin ve değişiklikten önce ve sonra sırasını kaydedin. Recall@5 doğru belgenin ne sıklıkla ilk beşte çıktığını, MRR ise zirveye ne kadar yakın olduğunu gösterir."
category: "Document Memory"
tags: ["evaluation", "recall", "mrr"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-24"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "Arama Kalitesi Recall ve MRR ile Nasıl Ölçülür? — MESA"
seoDescription: "Küçük bir etiketli soru seti hazırlayın, sonuç sıralarını kaydedin ve iki arama ayarını kısa bir Python betiğiyle Recall@5 ve MRR üzerinden karşılaştırın."
---

## 1. Küçük bir soru seti yazın

Gerçek kullanımdan 20 ila 50 soruyla başlayın, sonra seti büyütün. Tam terimler, doğal ifadeler ve belgelerde yanıtı olmayan sorular ekleyin.

- [ ] Her sorunun bilinen doğru belgesi veya pasajı var
- [ ] Sorular yeni sonuçlara bakmadan önce yazıldı
- [ ] Kolay ve zor durumlar birlikte yer alıyor
- [ ] Set yeniden kullanılmak üzere kaydedildi

## 2. Tek bir şeyi değiştirin

Parça boyutu, birleştirme ağırlığı veya yeniden sıralama gibi tek bir değişikliği karşılaştırın. Birden fazla ayar birlikte değişirse hangisinin işe yaradığını bilemezsiniz.

## 3. Sırayı kaydedin

Her soruyu çalıştırın ve ilk doğru sonucun sırasını yazın. Sonuç yoksa boş bırakın. Bu örneği `results.csv` olarak kaydedin.

```text
question,baseline,changed
q1,1,1
q2,3,2
q3,,4
q4,2,1
q5,6,
```

## 4. Recall@5 ve MRR hesaplayın

Örnekteki her sorunun tek doğru belgesi olduğu için Recall@5, ilk beşte yanıtlanan soruların oranıdır. Beşinci sıradan sonraki sonuç kaçırılmış sayılır.

```text
import csv

K = 5
rows = list(csv.DictReader(open("results.csv", encoding="utf-8")))
for column in ("baseline", "changed"):
    ranks = [int(row[column]) if row[column] else None for row in rows]
    hits = [rank for rank in ranks if rank and rank <= K]
    recall = len(hits) / len(ranks)
    mrr = sum(1 / rank for rank in hits) / len(ranks)
    print(f"{column}: Recall@{K}={recall:.2f} MRR@{K}={mrr:.2f}")
```

`python3 evaluate.py` ile çalıştırın:

```text
baseline: Recall@5=0.60 MRR@5=0.37
changed: Recall@5=0.80 MRR@5=0.55
```

## 5. Sonucu dikkatle yorumlayın

| Soru | Önce | Sonra | Ne oldu? |
| --- | --- | --- | --- |
| q2 | 3 | 2 | Yükseldi |
| q3 | Yok | 4 | Yeni bulundu |
| q4 | 2 | 1 | Yükseldi |
| q5 | 6 | Yok | Hâlâ ilk beşin dışında |

Bu örnek veride değişiklik iki ölçüyü de iyileştiriyor. Beş soru gerçek bir iyileşmeyi kanıtlamak için azdır; hataları inceleyin ve daha büyük bir sette tekrarlayın.

> [!WARNING]
> **Son test setinizde ayar yapmayın**
> Bazı soruları ayrı tutun. Aynı sorulara göre tekrar tekrar ayar yaparsanız arama gerçekten iyileşmeden puan yükselebilir.

## En sık ne ters gider?

| Gördüğünüz | Neden | Çözüm |
| --- | --- | --- |
| `ValueError: invalid literal for int() with base 10` | Bir hücrede sıra yerine metin var | Tam sayı yazın; sonuç yoksa hücreyi boş bırakın |
| `KeyError: 'baseline'` | Sütun adları farklı, örneğin `Baseline` | Başlığı tam olarak `question,baseline,changed` yazın |
| Aynı iki çalıştırmada puanlar değişiyor | Eşitlikler rastgele bir şeyle, örneğin üretilen kimliklerle bozuluyor | Küçük bir kazanca güvenmeden önce dizini iki kez kurup sıralı sonuçları karşılaştırın |

Son durum bizim başımıza geldi. Aynı belgelerle sıfırdan kurulan iki MESA deposu, eşitlik bozma düzeltmesinden önce Hit@5’te 48/112 ve 52/112 aldı (benchmark v2 dev, Tier M, modeller kapalı). [Aynı aramanın neden farklı sonuç verdiğini](/research/why-two-search-runs-differed/) okuyun.

## Arama değerlendirmesi hakkında sorular

**İyi bir MRR değeri nedir?**
: Evrensel bir eşik yoktur. Sistemleri aynı soru ve belgelerle karşılaştırın.

**Recall mı MRR mi daha önemli?**
: Recall kanıtın bulunup bulunmadığını, MRR ne kadar üstte çıktığını gösterir. RAG sistemleri genellikle ikisine de ihtiyaç duyar.

**nDCG kullanmalı mıyım?**
: Sonuçların dereceli ilgililiği varsa nDCG kullanın. [Değerlendirme dersine](/learn/evaluating-ndcg-and-mrr-in-memory/) bakın.

## Kaynaklar

1. [MESA Learn · Arama kalitesini ölçmek](learn/evaluating-ndcg-and-mrr-in-memory/)
2. [MESA · Arama değerlendirme yöntemi](methodology/retrieval-evaluation/)

> [!NOTE]
> **MESA’da ne ölçtük?**
> Soru kuralları, puanlama ve açıklama için çalışılmış bir örnek olarak [benchmark v2’yi nasıl kurduğumuza](/research/turkish-legal-benchmark-v2/) bakın.

