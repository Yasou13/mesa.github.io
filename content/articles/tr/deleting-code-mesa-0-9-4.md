---
id: "deleting-code-mesa-0-9-4"
slug: "deleting-code-mesa-0-9-4"
type: "research"
language: "tr"
title: "MESA’dan Neleri Sildik, Neden?"
subtitle: "Tek bir arama sırası değişmeden iki alt sistemi kaldırmak"
summary: "MESA 0.9.4, V4 öncesinden kalan düğüm deposunu ve model tabanlı bilgi birleştirmeyi kaldırdı. Çalışan Python kodu 48.591 satırdan 42.541’e indi; dev arama sıraları her silmeden sonra aynı kaldı."
shortAnswer: ""
category: "Retrieval Evaluation"
tags: ["engineering", "maintenance", "configuration", "release"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-24"
readingMinutes: 6
status: "published"
indexable: true
seoTitle: "MESA’dan Neleri Sildik, Neden?"
seoDescription: "MESA 0.9.4, V3 deposunu ve LLM birleştirmeyi kaldırdı; 6.050 Python satırı azaldı. Her silmeden sonra dev arama sıraları aynı kaldı."
---

## MESA’dan neleri kaldırdık?

> [!WARNING]
> **Tarihsel kayıt: MESA 0.9.4**
> Bu yazı, Kasım 2026’da ölçüldüğü hâliyle MESA 0.9.4’ü anlatır. 0.9.5 o zamandan beri çizge deposunu kaldırdı; sonraki sonuçlar için [MESA çizge deposunu neden kaldırdı](/research/why-mesa-removed-its-graph-store/) yazısına ve [benchmark sayfasına](/benchmark/) bakın.

MESA 0.9.4, eski V3 düğüm deposunu, LLM birleştirme (consolidation) alt sistemini ve bunlara bağlı ayarları kaldırdı. Çalışan Python kodu 48.591 satırdan 42.541 satıra indi; yani 6.050 satır, %12,5 azaldı. Ana yapılandırmanın okuduğu ayar sayısı 68’den 54’e düştü.

Her silmeyi modeller kapalıyken benchmark v2 dev bölümüyle denetledik. 128 sorunun tamamı her adımdan sonra aynı pasaj ve belge sırasını korudu.

## Tam olarak neler silindi?

| Alan | Silinen satır | Eklenen satır |
| --- | --- | --- |
| `mesa_storage/dao.py` (V3 düğüm, temizleme ve WAL yöntemleri) | 2.307 | 211 |
| `consolidation/loop.py` | 1.179 | 0 |
| `mesa_storage/vector_engine.py` (geçici silme, Procrustes) | 590 | 1 |
| `consolidation/router.py` | 392 | 0 |
| `consolidation/validator.py` | 286 | 0 |
| `consolidation/parser.py` | 271 | 0 |
| `consolidation/policy.py` | 173 | 0 |

| Kapsam, v0.9.3 → v0.9.4 | Değişen dosya | Eklenen | Silinen |
| --- | --- | --- | --- |
| Çalışan paketler | 40 | 599 | 6.667 |
| Testler | 88 | 2.672 | 7.887 |
| Tüm depo | 149 | 3.523 | 14.737 |

Beş veritabanı yapısı da kaldırıldı: V3’ün `nodes`, `nodes_fts`, `lancedb_wal`, `purge_journal` ve `system_config` tabloları. Sonraki bir geçiş `routing_telemetry` tablosunu da sildi.

## Çalışan kodu neden sildik?

İki alt sistem de varsayılan belge ve arama akışının parçası değildi. MESA’nın belge ve arama akışı V4 tablolarını kullanıyor; V3 deposu doğru tutulması gereken ikinci bir depolama modeline dönüşmüştü. Varsayılan doğrulama zaten kurallara dayanıyordu (Mode 0) ve 0.9.3’te bu modda oturumu bitirmek için birleştirme döngüsü gerekmiyordu.

Yine de bu kodları tutmanın bir bedeli vardı. Her yol test, belge, ayar ve güvenlik incelemesi istiyordu. Az çalıştırılan bir ayar sessizce bozulabilir. Bir alt sistemi kaldırmak, bu sürekli maliyeti tek seferlik bir geçişe çevirir.

## Aramanın değişmediğini nasıl denetledik?

Her silmeden önce ve sonra, modeller kapalıyken ortak bir depoda tüm dev kümesini çalıştırdık.

| Silme adımı, dev, T0 | Hit@5 önce → sonra | MRR önce → sonra | Sırası değişen soru |
| --- | --- | --- | --- |
| V3 düğüm deposu | 61/112 → 61/112 | 0,3955 → 0,3955 | 128’de 0 |
| LLM birleştirme | 61/112 → 61/112 | 0,3955 → 0,3955 | 128’de 0 |
| Kullanılmayan iskelet kod | 61/112 → 61/112 | 0,3955 → 0,3955 | 128’de 0 |

Yalnızca ortalamaları değil, soru başına sıraları da karşılaştırdık; çünkü [ortalama, sıra değişimlerini gizleyebilir](/research/why-two-search-runs-differed/). Bu çalıştırmalarda ortanca gecikme 178 ms ile 315 ms arasında, belirli bir yön izlemeden değişti. Bu yüzden silmelerden hız iddiası çıkarmıyoruz.

## Kaldırılan ayarlara ne oluyor?

MESA 0.9.4, aralarında `MESA_TIER3_MODE`, `MESA_USE_V4` ve `CONSOLIDATION_BATCH_SIZE` olan 20 ortam değişkenini emekli etti. Biri hâlâ tanımlıysa MESA başlangıçta o anahtar için bir kez uyarı yazar ve ayarı yok sayar. Yani eski yapılandırma dosyası sunucuyu durdurmaz.

Güncel ayarlar için [yapılandırma rehberine](/docs/core/configuration/), yükseltmeden önce [geçiş rehberine](/docs/core/migration/) bakın.

## Silmenin bedeli neydi?

- Depolama geçişleri yalnızca ileri yönlüdür. Geri dönmek için yükseltme öncesi depo kopyası ve MESA 0.9.3 gerekir.
- LLM doğrulayıcı modları 1 ve 2 artık yok.
- Kodla birlikte testler de silindi. Eski yolun güvenlik ve dayanıklılık sözleşme testleri önce V4’e taşındı.
- İsteğe bağlı bilgi çıkarımı `MESA_EXTRACTION_ENABLED=true` ile duruyor.

[SQLite dersi](/learn/sqlite-as-canonical-agent-memory/), MESA’nın neden tek bir ana depo tuttuğunu anlatır.

## Bu sonuç neyi gösteremez?

- Sıra kontrolleri dev bölümündeki T0’ı kapsar. Embedding veya yeniden sıralamalı aramanın sırasının değişmediğini ayrıca kanıtlamaz.
- Geliştirme derlemelerinde yapıldı. 0.9.4’ün son kalite değişiklikleri [ayrı bir yazıda](/research/what-improved-search-in-0-9-4/) anlatılıyor.
- Daha az satır, daha iyi kod anlamına gelmez.
- MESA’nın henüz üretimde kullanıcısı yok; bu iş gerçek yükseltmelerle sınanmadı.

## Kaynaklar

1. [MESA 0.9.4 değişiklik günlüğü](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
2. [v0.9.3 ile v0.9.4 karşılaştırması](https://github.com/Yasou13/MESA/compare/v0.9.3...v0.9.4)

