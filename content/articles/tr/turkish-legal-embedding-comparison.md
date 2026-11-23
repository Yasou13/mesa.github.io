---
id: "turkish-legal-embedding-comparison"
slug: "turkish-legal-embedding-comparison"
type: "research"
language: "tr"
title: "Türkçe Hukukta Hangi Embedding Modeli Daha İyi?"
subtitle: "bge-m3 ve Mürşit Large için dev kümesi karşılaştırması"
summary: "112 yanıtlanabilir Türkçe hukuk sorusunda bge-m3, MRR ve Hit@5’te genel olarak önde kaldı. Mürşit Large bazı soru ve kategorilerde kazandı."
shortAnswer: ""
category: "Retrieval Evaluation"
tags: ["benchmark", "embeddings", "turkish", "legal-search"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-23"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "Türkçe Hukukta Hangi Embedding Modeli Daha İyi?"
seoDescription: "bge-m3 ile Mürşit Large’ı 112 yanıtlanabilir Türkçe hukuk sorusunda karşılaştırdık. Hangi modelin nerede öne geçtiğini görün."
---

## Türkçe hukuk aramasında hangi model daha iyi sonuç verdi?

Dev kümemizde genel olarak BAAI/bge-m3 daha iyi sonuç verdi. Yalnızca gömme vektörleriyle (embedding, T1) Hit@5 0,7411 ve MRR 0,5758 aldı. Mürşit Large ise Hit@5 0,6875 ve MRR 0,5626 aldı. Yeniden sıralama (reranking, T2) eklenince bge-m3 Hit@5’te 0,9286’ya, Mürşit Large 0,8929’a çıktı.

Bu sonuç, bge-m3’ün Türk hukukunda her zaman daha iyi olduğunu göstermez. Fark T1’de 112 sorunun 6’sı, T2’de 4’üdür. Mürşit Large, T1’de 29 soruda daha üst sıraya çıktı ve Hit@1’de önde kaldı. Bu çalıştırma varsayılanı değiştirmek için bir gerekçe sunmadığından MESA’da bge-m3’ü koruduk.

## Karşılaştırmayı nasıl yaptık?

- PyPI’dan `ml` ekiyle MESA 0.9.3, tek bir Colab NVIDIA A100 80 GB ortamında.
- Benchmark v2 dev bölümü, Tier M: 141 Türkçe hukuk belgesi, 5.041 parça (chunk), 112’si yanıtlanabilir 128 soru.
- Her Mürşit yapılandırması için yeni bir depo. Arama, 5.041 vektörün tamamı hazır olunca başladı. bge-m3 sayıları, aynı girdilerle yapılan 0.9.3 referans çalıştırmasından geliyor.
- İki model de 1.024 boyutlu ve MESA tarafından L2 normalize edildi.
- T1: hibrit aramayla gömme vektörleri. T2: T1’e ek olarak derinliği 20 olan `BAAI/bge-reranker-v2-m3`.
- Değerlendirici v2.1, arama limiti 50.

> [!NOTE]
> **Normalizasyon notu**
> Yayımlanan Mürşit hattında son bir Normalize modülü yoktur ve kosinüs benzerliği belirtilir. MESA iki modele de L2 normalizasyonu uyguladı; böylece ikisi aynı vektör düzeniyle karşılaştırıldı.

## Genel sonuçlar neydi?

| MESA 0.9.3, dev, Tier M | Model | MRR | Hit@1 | Hit@5 | Hit@10 | Arama p50 |
| --- | --- | --- | --- | --- | --- | --- |
| T1 | bge-m3 | 0,5758 | 0,4375 | 0,7411 | 0,8661 | 1,67 sn |
| T1 | Mürşit Large | 0,5626 | 0,4464 | 0,6875 | 0,8304 | 1,66 sn |
| T2 | bge-m3 | 0,8076 | 0,7143 | 0,9286 | 0,9554 | 2,35 sn |
| T2 | Mürşit Large | 0,7814 | 0,6964 | 0,8929 | 0,9196 | 2,31 sn |

Hız belirleyici olmadı. Ortanca arama süreleri ve veri alım süreleri birbirine yakındı. T1’de tüm belgelerin hazır olması bge-m3 ile 741,60 sn, Mürşit Large ile 738,32 sn sürdü.

## Hangi model nerede öne geçti?

En büyük fark, sorunun kaynaktan farklı sözcüklerle sorulduğu yeniden ifade (paraphrase) sorularında çıktı. Sayı, tarih ve esas numarası sorularında T1’de Mürşit Large öndeydi.

| Kategori, dev (soru) | T1 bge-m3 | T1 Mürşit | T2 bge-m3 | T2 Mürşit |
| --- | --- | --- | --- | --- |
| Birebir ifade (31) | 0,8387 | 0,7742 | 0,9355 | 0,9355 |
| Sayı, tarih, esas no (35) | 0,8286 | 0,8571 | 1,0000 | 0,9714 |
| Yeniden ifade (32) | 0,7188 | 0,5938 | 0,9375 | 0,8438 |
| Çok belgeli (14) | 0,3571 | 0,2857 | 0,7143 | 0,7143 |

Tablo, pasaj Hit@5 değerlerini gösterir. Küçük kategorilerde değerler büyük adımlarla oynar: çok belgeli tek bir soru yaklaşık 0,07 eder.

| Pasaj sırası, 112 yanıtlanabilir soru | Mürşit daha iyi | Mürşit daha kötü | Eşit |
| --- | --- | --- | --- |
| T1 | 29 | 35 | 48 |
| T2 | 4 | 7 | 101 |

T1’de iki model sık sık ayrışıyor ve kazanımlar neredeyse dengeli. Bu, modellerin farklı hatalar yaptığını düşündürüyor. İkisini birleştirmenin işe yarayıp yaramadığını denemedik. Yeniden sıralama farkı daraltıyor: T2’de 112 sorunun 101’i aynı sırada.

## Önceki varsayılan model nasıldı?

MESA, 0.9.3’ten önce varsayılan olarak `magibu/embeddingmagibu-200m` kullanıyordu. Bu modeli bge-m3 ile doğrudan karşılaştırdığımız ölçüm eski bir soru kümesine dayanıyor; yukarıdaki tablolarla birleştirilemez.

| MESA 0.9.2, benchmark v1 test, Tier M, T1 | MRR | Hit@5 |
| --- | --- | --- |
| magibu/embeddingmagibu-200m | 0,4095 | 0,5041 |
| BAAI/bge-m3 | 0,5136 | 0,6777 |

> [!WARNING]
> **Test sonuçları için uyarı**
> Bu, benchmark v1 test sonucudur. Test bölümü birkaç MESA sürüm çalıştırmasında okundu; dolayısıyla hiç görülmemiş bir küme değildir. Bu sonucu yalnızca gerileme sinyali olarak okuyun.

## Bu sonuçtan ne çıkarmalısınız?

- Aday modelleri kendi belgeleriniz ve sorularınızla deneyin. Bu derlem, atıf ve sayı yoğun Türkçe hukuk metinlerinden oluşuyor.
- Sonuçları soru türüne göre okuyun. Genel puan, Mürşit’in sayı, tarih ve esas numarası sorularındaki önünü gizledi.
- Yeniden sıralayıcıyla ve onsuz karşılaştırın. Burada yeniden sıralayıcı model farkını azalttı.
- Yeniden kurulumu hesaba katın. MESA’da embedding kimliği değişince etkin vektörler yeniden oluşturulmalıdır.

Kavramlar için [anlamsal arama](/learn/semantic-search/) ve [hibrit arama](/learn/hybrid-retrieval-explained/) derslerine, MESA ayarları için [embedding sağlayıcıları dokümanına](/docs/core/embedding-providers/) bakın.

## Bu karşılaştırma neyi gösteremez?

- Mürşit Large yalnızca dev bölümünde çalıştırıldı.
- 112 yanıtlanabilir soruda 4 ila 6 soruluk fark, yeni bir örneklemde korunmayabilir. Anlamlılık testi yapmadık.
- Modelleri yalnızca MESA’nın parçalama ve birleştirme hattı üzerinden denedik. Farklı bir hat sırayı değiştirebilir.
- Mürşit Base denenmedi.
- Sonuçlar bu derlem içindir; iki modelin genel bir sıralaması değildir.

## Kaynaklar

1. [BAAI/bge-m3 model kartı](https://huggingface.co/BAAI/bge-m3)
2. [BGE-M3 makalesi](https://arxiv.org/abs/2402.03216)
3. [newmindai/Mursit-Large-TR-Retrieval model kartı](https://huggingface.co/newmindai/Mursit-Large-TR-Retrieval)
4. [BAAI/bge-reranker-v2-m3 model kartı](https://huggingface.co/BAAI/bge-reranker-v2-m3)
5. [MESA 0.9.4 değişiklik günlüğü](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)

