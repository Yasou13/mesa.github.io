---
id: "structured-vs-unstructured-memory"
slug: "structured-vs-unstructured-memory"
type: "learn"
language: "tr"
title: "Metinden bilgi kaydına: kaynakta neyi korumalı?"
subtitle: ""
summary: "Bir belgeyi parçalara, varlıklara ve bilgi kayıtlarına dönüştürürken koşulları ve dayanakları nasıl koruyacağınızı öğrenin."
shortAnswer: "Bir belgeyi parçalara, varlıklara ve bilgi kayıtlarına dönüştürürken koşulları ve dayanakları nasıl koruyacağınızı öğrenin."
category: "Foundations"
tags: ["assertion", "entity", "schema", "chunk", "iddia", "varlık", "şema", "kanıt aralığı"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-28"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Metinden bilgi kaydına: kaynakta neyi korumalı? — MESA"
seoDescription: "Bir belgeyi parçalara, varlıklara ve bilgi kayıtlarına dönüştürürken koşulları ve dayanakları nasıl koruyacağınızı öğrenin."
lessonOrder: 3
learningStage: "foundation"
prerequisites: ["what-is-ai-memory", "rag-vs-ai-memory"]
learningObjectives: ["Parça, varlık ve iddiayı ayırmak", "Niteleyicileri ve kanıt konumunu korumak", "Geçmişi değiştirmeden çıkarımı düzeltmek"]
---

## Aynı kaynağın üç temsili

Atlas kılavuzunda “1 Kasım’dan itibaren okuma salonu cuma günleri 10.00’da açılır; diğer hafta içi günlerde saat 09.00 olarak kalır” yazsın. Ham metin özgün ifadeyi korur. Metin parçası, ilgili bölümü aramada bulmayı sağlar. Yapılandırılmış kayıt; özneyi, ilişkiyi, değeri ve koşulları ayrı alanlara ayırır. Çizge de ilişkilerin izlenmesini kolaylaştırır. Bu temsillerin hiçbiri kaynağın doğruluğunu kendiliğinden kanıtlamaz.

| Temsil | Güçlü yönü | Kaybedebileceği bilgi |
| --- | --- | --- |
| Tam kaynak | Denetim ve yeniden yorumlama | Kolay sorgu yapısı |
| Metin parçası | Pasaj aramayı | Belge genelindeki niteleyici |
| İddia | Filtreleme ve join | Nüans veya çıkarım belirsizliği |
| Çizge kenarı | İlişki gezintisi | Açıkça bağlanmazsa kanıt |

Temsili, soracağınız soruya göre seçin. “Dördüncü paragraf ne diyor?” için tam metin gerekir. “Cuma günü dokuzdan sonra hangi salonlar açılıyor?” sorusu ise saat ve gün alanlarından yararlanır. Kaynak metni ve ona bağlı yapılandırılmış kaydı birlikte tutmak iki ihtiyacı da karşılar. Yapılandırılmış kaydı, ayrıştırıcı veya model değiştiğinde kaynaktan yeniden üretilebilen bir yorum olarak ele alın.

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

“Cuma” koşulunu kaldırmak kaydın anlamını değiştirir. “1 Kasım’dan itibaren” kısmını atmak da gelecekte başlayacak uygulamayı bugün geçerliymiş gibi gösterir. Birim, olumsuzluk, yetki alanı, zaman ve istisnalar anlamı etkiliyorsa kayıtta korunmalıdır. Çıkarım yöntemi bunları gösteremiyorsa kaynağı saklayın ve yorumu eksik olarak işaretleyin; koşulları sessizce atmayın.

Salonu etiketinden ayırmak için sabit kimlik kullanın. “Atlas”, “Atlas Okuma Salonu” ve “A Salonu” aynı varlık da olabilir, farklı varlıklar da. Varlık çözümleme kanıt gerektiren ayrı karardır. Metin eşleşmesi aday önerebilir; kurumlar veya erişim kapsamları arasında kayıtları otomatik birleştirmemelidir.

## Türetimi görünür tutun

<!-- diagram: Kaynak revizyonu parça, çıkarım çalışması ve koşullu iddia üretir. -->
1. Sürüm r3 · özgün metin
2. Parça c4 · tam aralık
3. Çıkarım e2 · model/parser
4. İddia a42 · niteleyiciler

*Düzeltme türetilmiş iddiayı değiştirir; özgün sürüm tanımlanabilir kalır.*

W3C PROV, kaynak izini anlatırken varlık, faaliyet ve aktör ayrımı yapar. Bu örnekte kaynak belge ve çıkarılan kayıt birer varlık; çıkarım işlemi faaliyet; yazılım hizmeti ise aktördür. Bu kavramlar, kaydın kim tarafından ve hangi kaynaktan üretildiğini sormayı kolaylaştırır. Belirli bir veritabanı şemasını zorunlu kılmaz veya çıkarımın doğru olduğunu belgelemez. [PROV genel bakış](https://www.w3.org/TR/prov-overview/)

## Yapıyı ve anlamı ayrı doğrulayın

Şema doğrulama eksik kaynak kimliğini, hatalı saati veya eksik özneyi reddedebilir. Anlamsal kontrol, kaynağın iddiayı gerçekten destekleyip desteklemediğini ve koşulların korunup korunmadığını sorar. JSON doğrulamasını geçmek yalnızca yapısal uyumu gösterir. İki model aynı yanlış anlamayı paylaşabilir; uzlaşma sinyaldir, bağımsız kaynak değildir.

Düzeltme yaparken kaynağın mı, yorumun mu değiştiğini ayırın. Kaynak aynı kaldığı hâlde “cuma” yanlışlıkla “her gün” okunmuşsa yeni bir çıkarım sürümü oluşturup hatalı kaydı geri çekin. Kılavuz gerçekten değiştiyse yeni belge sürümü oluşturun. Böylece bir yanıtın gerçek dünya, kaynak belge veya işleme yöntemi değiştiği için mi farklılaştığını inceleyebilirsiniz.

## Çıkarımı onarın

> [!EXERCISE]
> **Kendinizi sınayın**
> Çıkarım “resmî tatillerde kapalı” ifadesini `is_open=true` yapıyor. JSON şeması geçerli. İnceleme neyi kaydetmeli?
>
> **Açıklama:** Tam destek aralığı, çıkarım sürümü ve etkilenen iddia kimliğiyle anlamsal çelişkiyi kaydetmeli. Türetilmiş iddiayı geri çekin veya değiştirin; kaynak revizyonunu koruyun ve buna kaynak güncellemesi demeyin.

## Kaynaklar ve ileri okuma

1. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
2. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

