---
id: "structured-vs-unstructured-memory"
slug: "structured-vs-unstructured-memory"
type: "learn"
language: "tr"
title: "Yapılandırılmış hafıza ile yapılandırılmamış hafıza karşılaştırması"
subtitle: "Serbest metin parçaları ile tipli assertion'ların, şemaların ve ilişkisel varlıkların değerlendirilmesi"
summary: "Yapılandırılmamış hafıza ham metin parçaları ve vektörleri saklarken, yapılandırılmış hafıza bilgiyi tipli assertion'lar, varlıklar, ilişkiler ve açık şemalar halinde düzenler."
shortAnswer: "Yapılandırılmamış hafıza esnektir ve kolay yazılır; yapılandırılmış hafıza ise deterministik filtreleme, ilişkisel sorgular, çelişki yönetimi ve güvenilir durum güncellemeleri sağlar."
category: "Foundations"
tags: ["structured-memory", "knowledge-representation", "ai-memory", "foundations"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-01"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Yapılandırılmış Hafıza ile Yapılandırılmamış Hafıza Karşılaştırması — MESA Learn"
seoDescription: "Serbest metin parçaları ile tipli assertion'lar arasındaki teknik farkları, sorgu determinizmini, güncelleme mekaniğini ve mühendislik ödünleşimlerini inceleyin."
---

## Ajan bilgisini temsil etmenin iki paradigması

Bir yapay zekâ ajanı bilgiyi hatırladığında, onu belirli bir veri temsilinde saklamak zorundadır. Temel mimari ayrım, yapılandırılmamış metin parçaları ile tipli yapılandırılmış assertion'lar arasında yaşanır.

![Akışkan yapılandırılmamış metin akışları ile yapılandırılmış taksonomik assertion ağacını karşılaştıran tarihi gravür plakası](assets/taxonomic-classification-plate.svg)
*Yapılandırılmamış hafıza metni akışkan anlamsal parçalar olarak ele alır; yapılandırılmış hafıza tipli varlıkları, açık bağıntıları ve somut kısıtları çıkarır.*

Yapılandırılmamış hafıza ham konuşma turlarını, markdown notlarını veya belge bölümlerini saklar. Bilgiyi bulmak için anlamsal benzerliği tahmin eden embedding algoritmalarına güvenir. Yapılandırılmış hafıza ise ayrık varlıkları, nitelikleri, ilişkileri ve doğruluk koşullarını biçimsel şema tablolarına çıkarır.

## Çelişki ve durum mutasyonu sorunu

Tamamen yapılandırılmamış hafızanın temel kusuru, ajanın zamanla değişen bir olguyu güncellemesi gerektiğinde ortaya çıkar:

> [!WARNING]
> **Vektör çelişki açmazı**
> Bir ajan pazartesi günü 'Kullanıcı Python tercih ediyor' kaydını, cuma günü ise 'Kullanıcı Rust'a geçti' kaydını saklarsa iki metin de vektör uzayına gömülür. 'Kullanıcı hangi dili tercih ediyor?' sorgusu her iki parçayı da yüksek benzerlikle geri getirir. Model hangisinin güncel olduğunu tahmin etmek zorunda kalır.

Yapılandırılmış hafızada ise durum değişiklikleri veritabanı anahtarları, zaman damgaları ve revizyon yaşam döngüleri üzerinden deterministik biçimde yönetilir. Sistem `prefers_language` varlık niteliğini günceller veya eski assertion kaydını geçersiz olarak işaretler.

## Mühendislik ödünleşimlerinin karşılaştırması

| Boyut | Yapılandırılmamış Hafıza (Metin + Vektör) | Yapılandırılmış Hafıza (Assertion + Şema) |
| --- | --- | --- |
| Kabul / Yazma Karmaşıklığı | Düşük: metni böl ve embedding hesapla | Yüksek: ayrıştırma, varlık çıkarma ve şema doğrulaması gerektirir |
| Sorgu İfade Gücü | Yaklaşık anlamsal keşif, eş anlamlılar | Kesin mantıksal filtreler, sayısal karşılaştırmalar, join'ler |
| Çelişki Yönetimi | Zayıf: çelişkili metin parçaları birikir | Güçlü: birincil anahtarlar, sürümleme, açık güncellemeler |
| İlişkisel Çok Sekmeli Gezinim | Zayıf: açık varlık kenarlarını gezemez | Güçlü: graph gezinimleri ve ilişkisel SQL sorguları |
| Token Verimliliği | Düşük: uzun çok cümleli metin parçaları ekler | Yüksek: kompakt, kesin olgusal üçlüler (triple) ekler |
| Şema Evrimi | Önemsiz: şemasız metin depolama | Veritabanı geçişleri (migration) ve tipli şema güncellemeleri gerektirir |

## Modern sentez: Ham kanıtla desteklenen yapılandırılmış olgular

Yüksek güvenilirlikli ajan mimarileri, yapılandırılmış ile yapılandırılmamış veri arasında yapay bir tercih yapmaya zorlamaz. Bunun yerine iki temsili çift katmanlı bir modelde birbirine bağlar:

- [ ] Yapılandırılmış assertion; indekslenebilir, filtrelenebilir kimliği oluşturur (Özne, Yüklem, Nesne, Zaman, Kapsam).
- [ ] Ham yapılandırılmamış metin parçası; doğrulanabilir kanıt aralığını oluşturarak orijinal bağlamın korunmasını sağlar.
- [ ] Sorgular; önce tenant ve kapsam izolasyonunu garanti etmek için yapılandırılmış filtreleri çalıştırır, ardından bu güvenli sınır içinde anlamsal benzerliği ölçer.

## MESA'nın kanonik assertion mimarisi

[MESA Core](mesa/) içinde hafıza, kapalı bir vektör yığınından ibaret değildir. Kanonik bilgi kaynağı; açık şemaları, yaşam döngüsü durumlarını ve kanıt aralıklarını barındıran ilişkisel SQLite veritabanıdır.

LanceDB ve Kùzu yalnızca türetilmiş projeksiyonlar olarak çalışır. Bir projeksiyon bozulursa veya senkronizasyonunu yitirirse, kanonik SQLite assertion'larından deterministik olarak yeniden üretilebilir. Bu çift katmanlı mimariyi [MESA Core Dokümantasyonu](mesa/) sayfasında inceleyin.

## İleri okuma

1. [Sowa (2000) — Knowledge Representation: Logical, Philosophical, and Computational Foundations](https://www.jfsowa.com/krbook/)
2. [Baader vd. (2003) — The Description Logic Handbook](https://www.cambridge.org/core/books/description-logic-handbook/368B04527F3841C313C5EB8A7AEF9B37)
3. [MESA V4 Mimari Spesifikasyonu](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)

