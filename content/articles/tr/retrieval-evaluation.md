---
id: "retrieval-evaluation"
slug: "retrieval-evaluation"
type: "methodology"
language: "tr"
title: "Retrieval değerlendirmesi"
subtitle: ""
summary: "Bir retrieval sisteminin yararlı ve kaynağa dayalı materyali bulup bulmadığına ilişkin iddialar için asgari metodoloji."
shortAnswer: "Girdileri dondurun, sorgu üretimini judgment'tan ayırın, birden fazla metriği ve hata örneklerini raporlayın, her sonucu sürümlere ve ham kanıta bağlayın."
category: "Evaluation"
tags: ["methodology", "retrieval", "evaluation"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-01"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Retrieval Değerlendirme Metodolojisi — MESA Research"
seoDescription: "MESA retrieval değerlendirmeleri için asgari kanıt, judgment, metrik, sürümleme ve raporlama kurallarını inceleyin."
---

## Kapsam

Bu yöntem karşılaştırmalı retrieval değerlendirmelerine uygulanır. Tek bir veri kümesini veya sorgu setini evrensel performans iddiasına dönüştürmez.

## Veri seti ve sorgu seçimi

- Kaynak uygunluğunu ve zamansal kesimi tanımlayın.
- Lisans ve saklama sınırlarını kaydedin.
- Veri kümesini, sorguları ve hariç tutmaları sürümleyin.
- Zor ve sıfır sonuçlu örnekleri bilinçli biçimde dahil edin.

## Relevance judgment

Judgment rehberi; dereceli relevance'ı, kanıt gereksinimlerini, anlaşmazlık yönetimini ve reviewer bağımsızlığını tanımlamalıdır. Sistem çıktısı kendi ground truth'unu sessizce belirlememelidir.

## Metrikler

| Ölçüm | Soru |
| --- | --- |
| Recall@k | İlgili materyal kesim içinde geri getirildi mi? |
| nDCG@k | Daha ilgili öğeler daha önce sıralandı mı? |
| MRR | İlk ilgili öğe ne kadar erken göründü? |
| Gecikme dağılımı | Retrieval hangi operasyonel maliyetle gerçekleşti? |

## Raporlama ve düzeltmeler

- [ ] Yapılandırma ve kod revizyonu
- [ ] Veri seti, sorgu ve judgment sürümleri
- [ ] Toplu ve sorgu bazlı çıktılar
- [ ] Hata örnekleri ve hariç tutmalar
- [ ] Bilinen sınırlılıklar
- [ ] Bulgular değiştirildiğinde düzeltme tarihi ve değişiklik kaydı

