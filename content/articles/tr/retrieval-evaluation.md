---
id: "retrieval-evaluation"
slug: "retrieval-evaluation"
type: "methodology"
language: "tr"
title: "Arama sistemleri nasıl değerlendirilir?"
subtitle: ""
summary: "Bir sistemin ilgili bilgileri ve bunların dayanaklarını bulabildiğini göstermek için hangi ölçümler ve kayıtlar gerekir?"
shortAnswer: "Girdileri sabitleyin. Soruları hazırlayanlarla sonuçları değerlendirenleri ayırın. Birden çok ölçümü ve hata örneklerini raporlayın; sonuçları kullanılan sürümler ve ham çıktılarla birlikte kaydedin."
category: "Evaluation"
tags: ["methodology", "retrieval", "evaluation"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-01"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Arama sistemleri nasıl değerlendirilir? — MESA"
seoDescription: "Bir sistemin ilgili bilgileri ve bunların dayanaklarını bulabildiğini göstermek için hangi ölçümler ve kayıtlar gerekir?"
---

## Kapsam

Bu yöntem, farklı arama sistemlerini karşılaştırmak içindir. Tek bir veri kümesinde veya soru listesinde elde edilen sonuçlar, bütün kullanım alanları için başarı garantisi vermez.

## Veri kümesi ve sorgu seçimi

- Kaynak uygunluğunu ve zamansal kesimi tanımlayın.
- Lisans ve saklama sınırlarını kaydedin.
- Veri kümesini, sorguları ve hariç tutmaları sürümleyin.
- Zor ve sıfır sonuçlu örnekleri bilinçli biçimde dahil edin.

## İlgililik değerlendirmesi

Değerlendirme kılavuzu; ilgililik derecelerini, gerekli dayanakları, değerlendiriciler arasındaki görüş ayrılıklarının nasıl çözüleceğini ve bağımsızlığın nasıl sağlanacağını açıklamalıdır. Sistemin kendi çıktısı, doğru kabul edilen yanıtları kendiliğinden belirlememelidir.

## Metrikler

| Ölçüm | Soru |
| --- | --- |
| Recall@k | İlgili kayıtların ne kadarı seçilen ilk k sonuçta bulundu? |
| nDCG@k | Daha ilgili öğeler daha önce sıralandı mı? |
| MRR | İlk ilgili öğe ne kadar erken göründü? |
| Gecikme dağılımı | Arama ne kadar sürdü ve hangi kaynakları kullandı? |

## Raporlama ve düzeltmeler

- [ ] Yapılandırma ve kod revizyonu
- [ ] Veri kümesi, sorgu ve değerlendirme sürümleri
- [ ] Toplu ve sorgu bazlı çıktılar
- [ ] Hata örnekleri ve hariç tutmalar
- [ ] Bilinen sınırlılıklar
- [ ] Bulgular değiştirildiğinde düzeltme tarihi ve değişiklik kaydı

