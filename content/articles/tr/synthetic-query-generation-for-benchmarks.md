---
id: "synthetic-query-generation-for-benchmarks"
slug: "synthetic-query-generation-for-benchmarks"
type: "learn"
language: "tr"
title: "Yapay zekâ hafızası için sentetik sorgu üretimi ve ground-truth değerlendirmesi"
subtitle: "Manuel etiketleme darboğazı olmadan tarafsız ve tekrarlanabilir retrieval test paketlerinin oluşturulması"
summary: "Alana özgü hafıza sistemlerini değerlendirmek; doğrulanabilir kanıt hedeflerine bağlı çok sekmeli, eş anlamlı ve negatif sorgular üreten sentetik boru hatları gerektirir."
shortAnswer: "Sentetik sorgu boru hatları, doğrulanabilir assertion hedeflerine sabitlenmiş test senaryoları üreterek otomatik retrieval testlerini mümkün kılar."
category: "Evaluation"
tags: ["synthetic-queries", "ground-truth", "benchmarks", "evaluation"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Yapay zekâ hafızası için sentetik sorgu üretimi ve ground-truth değerlendirmesi — MESA Learn"
seoDescription: "Alana özgü hafıza sistemlerini değerlendirmek; doğrulanabilir kanıt hedeflerine bağlı çok sekmeli, eş anlamlı ve negatif sorgular üreten sentetik boru hatl"
---

## Manuel etiketleme darboğazı

Kurumsal retrieval benchmarkları için uzmanlar tarafından binlerce sorgu hazırlatmak son derece maliyetli ve yavaştır. Veri kümesi güncellendiğinde manuel değerlendirmeler hızla eskir.

> [!WARNING]
> **Döngüsel Öz-Değerlendirme Tehlikesi**
> Aynı dil modeli hem sorguları üretip hem de arama sonucunun doğruluğunu değerlendirirse sistem döngüsel bir önyargıya kapılır ve gerçek arama hatalarını gizler.

## Mühendislik ödünleşimlerinin karşılaştırması

| Sorgu Türü | Üretim Şablonu | Hedeflenen Retrieval Hattı | Değerlendirme Amacı |
| --- | --- | --- | --- |
| Kesin Kod / Lexical | Kanun maddeleri, esas numaraları ve kimlikleri çıkarma | BM25 ters indeks eşleşmesi | Nadir token ve kesin tanımlayıcı hatırlamasını ölçer |
| Eş Anlam / Kavramsal | Alana özgü eş anlamlılar ve alternatif ifadeler | Dense vektör embedding hattı | Sözcük dağarcığı farklarına karşı anlamsal dayanıklılığı ölçer |
| Çok Sekmeli İlişkisel | Uzak iki graph düğümünü bağlayan sorular üretme | Graph gezinim hattı (Kùzu) | Tek parçada bulunmayan çok adımlı keşif yeteneğini ölçer |
| Negatif / Yanıtsız | Koleksiyonda bulunmayan makul olguları sorma | Tüm hatlar (sıfır sonuç dönmeli) | Halüsinasyon direncini ve güvenli kapanmayı ölçer |

## Deterministik sorgu sabitleme ve değerlendirme şemaları

Sentetik üretim boru hattı, kanonik depodan hedef assertion'ları seçer, kanıt aralıklarını belirler ve belirli kısıtlarla test sorguları üretir. Üretilen sorgu hedef assertion kimliğine ground truth olarak programatik bağlanır.

```text
// Sentetik ground-truth test kaydı
{
  "sorgu_id": "syn_q_4021",
  "sorgu_metni": "Ahmet tarafından imzalanan sözleşmelerde uyuşmazlık çözümü nereye tabidir?",
  "beklenen_assertion_idleri": ["asrt_88b14a2"],
  "asgari_alaka_derecesi": 3,
  "sorgu_kipi": "cok_sekmeli"
}
```

## MESA'da sentetik benchmark uygulaması

MESA'nın v0.3.0 değerlendirme boru hattı; hukuk, finans ve kodlama alanlarında hibrit arama kesinliğini sürekli doğrulamak için sentetik sorgu üretiminden yararlanır. nDCG@10 ve Recall@5 hedefleri her sürümde denetlenir.

- [ ] Sorgular kanonik assertion kimliklerine programatik olarak sabitlenir.
- [ ] Lexical, anlamsal, çok sekmeli ve yanıtsız negatif sorgular üretilir.
- [ ] Sıfır sonuçlu negatif sorgular sistemin yanlış pozitif üretmediğini doğrular.
- [ ] Benchmark veri kümeleri değiştirilemez JSONL dosyaları olarak sürümle saklanır.

## Kaynaklar

1. [Jeronymo vd. (2023) — InPars-v2: Large Language Models as Efficient Dataset Generators for Information Retrieval](https://arxiv.org/abs/2301.01820)
2. [MESA Değerlendirme Boru Hattı ve Altın Veri Kümesi Şemaları](https://mesamemory.dev/evaluation/)

