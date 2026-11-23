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
updatedAt: "2026-11-24"
readingMinutes: 9
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
- [ ] Temiz kurulumlar arasında sıralı sonuç karşılaştırması
- [ ] Test bölümünün her okunmasının kaydı

## MESA’nın kendi benchmark’ı bize ne öğretti?

Bu kurallar, benchmark çalışmamızdaki hatalardan ve sınırlardan çıktı. Tüm sayılar Tier M üzerinde benchmark v2 kullanır.

| Ne oldu? | Kanıt | Artık uyguladığımız kural |
| --- | --- | --- |
| Aynı iki kurulum farklı puan aldı | Dev’de 48/112 ve 52/112 Hit@5, modeller kapalı, 0.9.4 öncesi | İki temiz dizin kurup sıralı sonuçları karşılaştır |
| Ortalama, sıra hareketini gizledi | 112 yanıtlanabilir sorunun 49’unda sıra değişti | Sorgu başına sonuçları sakla |
| Bir değişiklik iki modu iyileştirip üçüncüsünü kötüleştirdi | 0.9.4’te T2 dev Hit@5, 0,9286’dan 0,9107’ye düştü | Kayıplar dâhil her yapılandırmayı raporla |
| Test bölümü yeniden kullanıldı | v1 ve v2’de altı çalıştırmada okundu | Her okumayı kaydet; bölümü “hiç görülmemiş” diye sunma |
| Etiketler tek inceleme turundan geçti | Bağımsız uyum ölçümü yok | Etiketleme sınırlarını sonuçların yanında yaz |

Ayrıntılar [Türkçe Hukuk Arama Benchmark’ı Nasıl Kurulur?](/research/turkish-legal-benchmark-v2/) ve [Aynı Arama İki Kez Neden Farklı Sonuç Verdi?](/research/why-two-search-runs-differed/) yazılarında.

