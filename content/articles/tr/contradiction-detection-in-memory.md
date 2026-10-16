---
id: "contradiction-detection-in-memory"
slug: "contradiction-detection-in-memory"
type: "learn"
language: "tr"
title: "Yapay zekâ ajanlarında çelişki tespiti ve inanç revizyonu"
subtitle: "Gelişen assertion yaşam döngülerinde mantıksal tutarlılığın korunması"
summary: "Otonom ajanlar çelişkili bilgiler öğrendiğinde inanç revizyonu algoritmaları çelişen yüklemleri tespit etmeli, kanıt otoritesini değerlendirmeli ve hükümsüz iddiaları işaretlemelidir."
shortAnswer: "Çelişki çözümü, metin parçalarını gelişigüzel yığmak yerine şema düzeyinde teklik kısıtları ve kanıtsal öncelik mekanizmaları gerektirir."
category: "Memory & Retrieval"
tags: ["contradiction-detection", "belief-revision", "state-mutation", "logic"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Yapay zekâ ajanlarında çelişki tespiti ve inanç revizyonu — MESA Learn"
seoDescription: "Otonom ajanlar çelişkili bilgiler öğrendiğinde inanç revizyonu algoritmaları çelişen yüklemleri tespit etmeli, kanıt otoritesini değerlendirmeli ve hükümsü"
---

## Basit hafızadaki birikim paradoksu

Geleneksel RAG sistemlerinde her konuşma turu veya belge çelişki kontrolü yapılmadan vektör uzayına eklenir. Zamanla birbirini dışlayan iddialar birikir ve üretici model bağdaşmaz bilgiler arasında tahmine zorlanır.

> [!WARNING]
> **Halüsinasyon Zinciri**
> Bir dil modeli bağlamında iki çelişkili iddia gördüğünde ('Proje bütçesi 50.000$' ve 'Bütçe 80.000$'a yükseltildi'), genellikle uydurma bir sentez yapar veya gelişigüzel bir cevabı seçer.

## Mühendislik ödünleşimlerinin karşılaştırması

| Yaklaşım | Tespit Mekanizması | Çözüm Stratejisi | Tutarlılık Düzeyi |
| --- | --- | --- | --- |
| Salt Vektör Ekleme | Tespit yok | Yok (her iki parça da geri gelir) | Düşük: ciddi çelişki riski |
| LLM ile Hakemlik | Modele çelişkileri sorma | Olasılıksal bağlam içi seçim | Orta: prompt hassasiyetine bağlı |
| İlişkisel Teklik Kısıtları | Veritabanı birincil anahtarları | Deterministik durum güncellemesi (UPSERT) | Yüksek: varlık başına tek aktif gerçek |
| Biçimsel İnanç Revizyonu (AGM) | Epistemik öncelik ve revizyon operatörleri | Açık geri çekme ve provenance izi | En yüksek: matematiksel tutarlılık garantisi |

## AGM postulatları ve veritabanı assertion'ları

Alchourrón-Gärdenfors-Makinson (AGM) mantıksal çerçevesi inanç revizyonu için temel kuralları belirler: genişletme, daraltma ve revizyon. Yapılandırılmış hafızada her varlık niteliği bir fonksiyonel bağımlılıkla korunur: (Özne, Yüklem) -> Tek Aktif Nesne.

```text
// Assertion hükümsüz kılma işlemi
UPDATE assertions
SET status = 'SUPERSEDED', updated_at = CURRENT_TIMESTAMP
WHERE subject = 'proje_alfa' AND predicate = 'butce' AND status = 'COMMITTED';

INSERT INTO assertions (subject, predicate, object, status, superseded_id)
VALUES ('proje_alfa', 'butce', '80000_USD', 'COMMITTED', 'asrt_onceki_id');
```

## MESA'da çelişki yaşam döngüsü

MESA Core inanç revizyonunu assertion durumları üzerinden deterministik yönetir: COMMITTED, SUPERSEDED, PENDING_REVIEW ve RETRACTED. Yeni assertion'lar eski kayıtları asla sessizce yok etmez; revizyon kenarları bağlar.

- [ ] Çelişkiler kabul anında tipli şema kısıtları sayesinde tespit edilir.
- [ ] Eski assertion'lar zaman damgalı denetim iziyle SUPERSEDED durumuna geçer.
- [ ] Retrieval sorguları varsayılan olarak yalnızca COMMITTED kayıtları çeker.
- [ ] Hem yürürlükteki hem de mülga iddianın kanıt aralıkları incelenebilir kalır.

## Kaynaklar

1. [Alchourrón, Gärdenfors & Makinson (1985) — On the Logic of Theory Change: Partial Meet Contraction and Revision Functions](https://www.jstor.org/stable/2274239)
2. [Gärdenfors (1988) — Knowledge in Flux: Modeling the Dynamics of Epistemic States](https://mitpress.mit.edu/9780262570824/)

