---
id: "why-mesa-removed-its-graph-store"
slug: "why-mesa-removed-its-graph-store"
type: "research"
language: "tr"
title: "MESA Çizge Deposunu Neden Kaldırdı?"
subtitle: "Çizge kanalının benchmark dev sorularına kattıkları"
summary: "MESA 0.9.5 çizge veritabanını kaldırdı. Dev ölçümlerimizde çizge araması diğer kanalların kaçırdığı hiçbir doğru pasajı bulmadı, kapatılması hiçbir soruyu kaybettirmedi ve atıf izleyen bir alternatif Hit@1’i düşürdü."
shortAnswer: ""
category: "Retrieval Evaluation"
tags: ["graph", "ablation", "architecture", "release"]
author: "MESA contributors"
publishedAt: "2026-11-24"
updatedAt: "2026-11-24"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "MESA Çizge Deposunu Neden Kaldırdı?"
seoDescription: "MESA 0.9.5, dev ölçümlerinden sonra çizge veritabanını kaldırdı: çizgeyi kapatmak hiçbir soruyu kaybettirmedi, atıf izleyen kanal Hit@1’i düşürdü."
---

## 0.9.5 neyi kaldırdı?

MESA Core 0.9.5; Kùzu çizge veritabanını, çizge görünümünü yazan worker’ı, çizge arama kanalını ve çizge yeniden oluşturma yollarını kaldırdı. Yalnızca `mesa_storage` içindeki dört Kùzu modülü 2.610 satırdı. Arama artık BM25, bir embedding modeli ayarlıysa vektör araması, yerleşik hukuk kuralları ve isteğe bağlı yeniden sıralama ile yapılır. Varlıklar, bilgi kayıtları ve hukuki atıflar kaynaklarıyla birlikte SQLite’ta kalır.

Çizge 0.9.4’ten beri zaten varsayılan olarak kapalıydı. Bu yazı, o varsayılanın ve kaldırmanın arkasındaki ölçümleri anlatır.

## Çizge, diğer kanalların kaçırdığı bir şey buldu mu?

Hayır. Varsayılan olarak model çıkarımı kapalıyken çizge yalnızca belge → parça yapısını tutuyordu. 0.9.3 üzerinde yapılan Round 21 incelemesi benchmark v1 dev sonuçlarını yeniden puanladı: çizge kanalı, modelsiz (T0) ve embedding (T1b) koşularının ikisinde de 85 yanıtlanabilir sorunun hiçbirinde doğru pasajı tek başına ilk bulan kanal olmadı (0/85).

## Kapattığımızda ne oldu?

Her kanalı paylaşılan benchmark v2 dev deposunda tek tek kapattık (Tier M, 141 belge, 5.041 parça, 112’si yanıtlanabilir 128 soru, modeller kapalı, önekli BM25 içeren bir 0.9.4 geliştirme derlemesi). Başlangıç noktası, doğru pasajın ilk beşte olduğu 112 sorudan 52’siydi.

| 52 isabetlik temel çizgiden değişiklik | Hit@5 (112’de) |
| --- | --- |
| Bilgi kaydı füzyon ağırlığı 0 | 56 |
| Çizge kapalı | 52 |
| İkisi birlikte | 61 |

Çizgeyi kapatmak hiçbir soruyu kaybettirmedi. Sıfır bilgi kaydı ağırlığıyla birlikte 0.9.4 varsayılanı oldu.

## Atıflar çizgenin yerini alabilir miydi?

Hukuk metinleri birbirine atıf yapar; bu yüzden Round 23’te akla gelen ilk alternatifi denedik: birleştirilmiş ilk 20 sonucu alıp onlar için zaten kayıtlı kanun ve madde atıflarını izlemek ve atıf yapılan kapsam içi maddeleri ayrı bir kanal olarak sıralamak. Kural, kanalı yalnızca Hit@5 en az iki soru kazanırsa ve hiçbir kategori birden fazla soru kaybetmezse tutmaktı.

| Atıf kanalı ağırlığı | Hit@1 | Hit@5 | MRR |
| --- | --- | --- | --- |
| 0 (kapalı) | 30 | 62 | 0,3958 |
| 0,5 | 28 | 62 | 0,3828 |
| 1 | 20 | 60 | 0,3313 |
| 2 | 20 | 60 | 0,3304 |

Depo ve bölüm yukarıdakiyle aynı, modeller kapalı, Round 23 geliştirme commit’i. Atıfları izlemek, sık atıf alan maddeleri soruyu yanıtlayan pasajın önüne çekti. Kanal, ayarı ve testleri aynı iş biriminde silindi.

## Bu sizin için ne anlama geliyor?

- Yükseltirseniz migration eski çizge kayıt satırlarını temizler. Eski `kuzu_db` dosyaları yok sayılır; yedeğinizi denetledikten sonra elle silin.
- `MESA_GRAPH_ENABLED`, `MESA_RRF_GRAPH_WEIGHT` ve `MESA_V4_GRAPH_TIMEOUT_SECONDS` başlangıçta her biri için bir uyarıyla yok sayılır.
- Paket artık Python 3.14’e kurulur; orada wheel’i olmayan bağımlılık Kùzu idi.

Yükseltme notu için [çizge deposu kaldırıldı](/docs/core/graph/) sayfasına bakın.

## Bu ölçümlerin sınırları

- Tüm sayılar dev bölümü sonuçlarıdır; bu kararlar için ayrılmış test bölümü kullanılmadı.
- v1 yeniden puanlaması ile v2 karşılaştırması farklı soru kümeleri ve derlemeler kullandı.
- Çizgede varsayılan olarak çıkarılmış ilişki yoktu. Model çıkarımı ilişkilerinden kurulan bir çizge denenmedi; çünkü model çıkarımı varsayılan olarak kapalıdır ve önceki ölçümler kaliteyi düşürdüğünü gösterdi.
- Sonuçlar bu Türk hukuku metinleri derlemini anlatır; zengin türlü ilişkileri olan başka bir derlem farklı davranabilir.

## Kaynaklar

1. [MESA Core 0.9.5 changelog](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/CHANGELOG.md#095---2026-11-24)
2. [MESA Core 0.9.4 changelog: çizge varsayılan olarak kapalı](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/CHANGELOG.md#094---2026-11-23)

