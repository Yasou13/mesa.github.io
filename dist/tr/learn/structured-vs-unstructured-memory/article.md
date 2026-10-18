---
id: "structured-vs-unstructured-memory"
slug: "structured-vs-unstructured-memory"
type: "learn"
language: "tr"
title: "Belgeden iddiaya: çıkarımın kaybettirdiklerini korumak"
subtitle: ""
summary: "Tam metni, varlığı ve iddiayı; çıkarımı doğrulanmış gerçek sanmadan temsil edin. Kaynağa bağlı bir kaydı adım adım kurun."
shortAnswer: "Tam metni, varlığı ve iddiayı; çıkarımı doğrulanmış gerçek sanmadan temsil edin. Kaynağa bağlı bir kaydı adım adım kurun."
category: "Foundations"
tags: ["assertion", "entity", "schema", "chunk", "iddia", "varlık", "şema", "kanıt aralığı"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Belgeden iddiaya: çıkarımın kaybettirdiklerini korumak — MESA Learn"
seoDescription: "Tam metni, varlığı ve iddiayı; çıkarımı doğrulanmış gerçek sanmadan temsil edin. Kaynağa bağlı bir kaydı adım adım kurun."
lessonOrder: 3
learningStage: "foundation"
prerequisites: ["what-is-ai-memory", "rag-vs-ai-memory"]
learningObjectives: ["Parça, varlık ve iddiayı ayırmak", "Niteleyicileri ve kanıt konumunu korumak", "Geçmişi değiştirmeden çıkarımı düzeltmek"]
---

## Aynı kaynağın üç temsili

Atlas kılavuzu “1 Kasım’dan itibaren okuma salonu cuma günleri 10.00’da açılır; diğer hafta içi günler 09.00 olarak kalır” diyor. Ham metin ifadeyi korur. Parça, bölümünü getirilebilir yapar. İddia bir yorumu açıklaştırır: özne, yüklem, değer ve niteleyiciler. Çizge ilişkileri gezilebilir yapar. Bu temsillerin hiçbiri kaynağın doğruluğunu kendiliğinden kanıtlamaz.

| Temsil | Güçlü yönü | Kaybedebileceği bilgi |
| --- | --- | --- |
| Tam kaynak | Denetim ve yeniden yorumlama | Kolay sorgu yapısı |
| Metin parçası | Pasaj retrieval’ı | Belge genelindeki niteleyici |
| İddia | Filtreleme ve join | Nüans veya çıkarım belirsizliği |
| Çizge kenarı | İlişki gezintisi | Açıkça bağlanmazsa kanıt |

Temsili soruya göre seçin. “Dördüncü paragraf ne diyor?” tam metin gerektirir. “Cuma dokuzdan sonra hangi salonlar açılıyor?” tipli saat/gün alanlarından yararlanır. Metin yanında kaynağa bağlı iddia tutmak ikisine de hizmet eder. Yapılı satırı parser veya model değişince yeniden çıkarılabilir türetilmiş yorum olarak ele alın.

## Koşullarını koruyan bir iddia kurun

```text
assertion_id: a-42
subject_id: room-atlas-reading
predicate: opening_time
value: "10:00"
day_of_week: Friday
valid_from: 2026-11-01
source_revision: handbook-r3
evidence_text: "opens at 10:00 on Fridays"
extractor_version: example-parser-2
```

“Cuma”yı düşürmek iddiayı değiştirir. “1 Kasım’dan itibaren” kısmını düşürmek gelecekteki değişikliği güncel gösterir. Birim, olumsuzluk, yetki alanı, zaman ve istisna anlamı etkiliyorsa iddianın parçasıdır. Çıkarım koşulu temsil edemiyorsa kaynağı koruyup yorumu eksik olarak işaretleyin; sessizce atmayın.

Salonu etiketinden ayırmak için sabit kimlik kullanın. “Atlas”, “Atlas Okuma Salonu” ve “A Salonu” aynı varlık da olabilir, farklı varlıklar da. Varlık çözümleme kanıt gerektiren ayrı karardır. Metin eşleşmesi aday önerebilir; kurumlar veya erişim kapsamları arasında kayıtları otomatik birleştirmemelidir.

## Türetimi görünür tutun

<!-- diagram: Kaynak revizyonu parça, çıkarım çalışması ve koşullu iddia üretir. -->
1. Revizyon r3 · özgün metin
2. Parça c4 · tam aralık
3. Çıkarım e2 · model/parser
4. İddia a42 · niteleyiciler

*Düzeltme türetilmiş iddiayı değiştirir; özgün revizyon tanımlanabilir kalır.*

W3C PROV kaynak izi anlatımında varlık, faaliyet ve aktörü ayırır. Bu örnekte kaynak ve iddia varlık; çıkarım faaliyet; yazılım servisi aktördür. Bu sözlük, iddiayı kimin neyden ürettiğini sormayı kolaylaştırır. Veritabanı şemanızı zorunlu kılmaz veya çıkarımın doğruluğunu sertifikalandırmaz. [PROV genel bakış](https://www.w3.org/TR/prov-overview/).

## Yapıyı ve anlamı ayrı doğrulayın

Şema doğrulama eksik kaynak kimliğini, hatalı saati veya eksik özneyi reddedebilir. Anlamsal kontrol, kaynağın iddiayı gerçekten destekleyip desteklemediğini ve koşulların korunup korunmadığını sorar. JSON doğrulamasını geçmek yalnızca yapısal uyumu gösterir. İki model aynı yanlış anlamayı paylaşabilir; uzlaşma sinyaldir, bağımsız kaynak değildir.

Düzeltmede değişen kaynakla değişen yorumu ayırın. Kaynak aynıysa ama “cuma” yanlışlıkla “her gün” okunduysa yeni çıkarım veya iddia sürümü oluşturup hatalıyı geri çekin. Kılavuz değiştiyse yeni kaynak revizyonu oluşturun. Bu ayrım sonraki yanıtın gerçek, belge veya çıkarım hattı değiştiği için mi değiştiğini denetletir.

## Çıkarımı onarın

> [!EXERCISE]
> **Kendinizi sınayın**
> Çıkarım “resmî tatillerde kapalı” ifadesini `is_open=true` yapıyor. JSON şeması geçerli. İnceleme neyi kaydetmeli?
>
> **Answer:** Tam destek aralığı, çıkarım sürümü ve etkilenen iddia kimliğiyle anlamsal çelişkiyi kaydetmeli. Türetilmiş iddiayı geri çekin veya değiştirin; kaynak revizyonunu koruyun ve buna kaynak güncellemesi demeyin.

## Kaynaklar ve ileri okuma

1. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
2. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

