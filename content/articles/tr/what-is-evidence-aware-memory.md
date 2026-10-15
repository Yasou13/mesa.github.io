---
id: "evidence-aware-memory"
slug: "what-is-evidence-aware-memory"
type: "learn"
language: "tr"
title: "Kanıt odaklı hafıza (evidence-aware memory) nedir?"
subtitle: "Ajan bilgisine kaynak kimliğini, kesin kanıt aralıklarını ve yetki kapsamını bağlamanın kavramsal temeli"
summary: "Kanıt odaklı hafıza; bir yapay zekâ sisteminin herhangi bir iddiayı doğrulanabilir kaynak kimliği, kanıt aralıkları ve yetkilendirme kapsamı olmaksızın saklayamayacağı veya geri çağıramayacağı bir mimari paradigmadır."
shortAnswer: "Geleneksel ajan hafızası ne olduğunu kaydeder; kanıt odaklı hafıza ise ne olduğunu, kimin söylediğini, hangi kaynak belgenin kanıtladığını, hangi karakter aralığının desteklediğini ve hangi kapsamın okumaya izin verdiğini kaydeder."
category: "Evidence & Trust"
tags: ["evidence", "provenance", "ai-memory", "auditability"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-01"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Kanıt Odaklı Hafıza (Evidence-Aware Memory) Nedir? — MESA Learn"
seoDescription: "Kanıt odaklı hafızayı anlayın: her ajan iddiasına doğrulanabilir kaynak kimliğini, kesin kanıt aralıklarını ve yetki kapsamlarını bağlama."
---

## Otonom ajan hafızasında temellendirme krizi

Çoğu konuşma ve ajan kütüphanesi hafızayı doğrulanmamış bir metin deposu olarak ele alır. LLM konuşmayı gözlemler, 'Müvekkil revize sözleşme şartlarını onayladı' gibi bir özet çıkarır ve bu cümleyi veritabanına kaydeder.

> [!WARNING]
> **İzlenemeyen iddia açmazı**
> İki hafta sonra ajan bu hafızaya dayanarak geri dönüşü olmayan işlemler yapar. Denetim yapıldığında ne insan inceleyiciler ne de sistem bu iddianın yetkili bir beyan mı, yanlış anlaşılmış bir taslak mı yoksa bir model halüsinasyonu mu olduğunu anlayabilir. Hafıza vardır ama kanıtı yoktur.

![Kaynak belgelerdeki kanıt aralıklarının türetim boru hatlarından geçerek kanonik assertion'lara bağlandığını gösteren tarihi gravür plakası](assets/provenance-lineage-plate.svg)
*Kanıt odaklı hafıza: Bir iddia meşruiyetini yalnızca kaynak kimliğinden, kesin metin aralığından ve türetim izinden alır.*

**Kanıt Odaklı Hafıza (Evidence-Aware Memory)**
: Bilgi iddialarının bağlamsız cümleler olarak var olamayacağı; kabul edilen her kaydın köken kaynağına, kesin kanıt aralığına ve yetki sınırlarına yapısal olarak bağlandığı hafıza mimarisi.

## Kanıt odaklı hafızanın beş temel unsuru

Gerçek anlamda kanıt odaklı olabilmesi için geri çağrılan her hafıza kaydı beş soruyu yanıtlamalıdır:

- [ ] 1. İddia (Proposition): Olgusal iddia veya bağıntı (örneğin `(Dosya 402, durum, AÇILDI)`).
- [ ] 2. Kaynak Kimliği (Source Identity): Belgenin veya işlemin değiştirilemez URI'si, kriptografik özeti (hash) veya resmî sicil kimliği.
- [ ] 3. Kanıt Aralığı (Evidence Span): Kaynak belge içinde destekleyici metni barındıran kesin karakter veya bayt aralığı `[c_başlangıç..c_bitiş]`.
- [ ] 4. Kapsam Sınırları (Scope Bounds): Bu iddiaya hangi tenant, workspace, ajan ve zaman penceresinin erişebileceğini tanımlayan güvenlik sınırı.
- [ ] 5. Yaşam Döngüsü Durumu (Lifecycle State): Kaydın denetlenebilir durumu (`COMMITTED`, `PENDING_REVIEW`, `SUPERSEDED` veya `RETRACTED`).

## Gelişigüzel hafıza ile kanıt odaklı hafıza karşılaştırması

Gelişigüzel metin hafızası ile kanıt odaklı hafıza arasındaki fark, verinin yürütüm için nasıl modellendiğinde açıkça görülür:

```text
// Gelişigüzel metin hafızası (kaynağı izlenemez)
{
  "memory": "Müvekkil uyuşmazlığın Zürih'te ICC kurallarına göre çözülmesini istedi."
}

// Kanıt odaklı hafıza assertion'ı (MESA paradigması)
{
  "assertion_id": "asrt_88b14a2",
  "statement": {
    "subject": "Sozlesme_2024_09",
    "predicate": "tahkim_sarti",
    "object": "ICC_Zurih"
  },
  "source": {
    "source_id": "sozlesme_v2.pdf",
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "evidence_span": [4120, 4285],
    "quoted_text": "İşbu sözleşmeden doğan tüm uyuşmazlıklar Milletlerarası Ticaret Odası Tahkim Kuralları uyarınca Zürih'te nihai olarak çözümlenecektir."
  },
  "scope": {
    "tenant_id": "tenant_hukuk",
    "workspace_id": "dosya_402",
    "valid_from": "2024-09-01T00:00:00Z"
  },
  "status": "COMMITTED"
}
```

## Kanıt odaklılık kritik alanlarda neden zorunludur?

Hukuk, tıp, regülasyon ve finans alanlarında otonom ajanlar kullanıcılardan 'kendilerine güvenmelerini' isteyemez. Her iddia denetlenebilir olmalıdır:

| Alan | Gelişigüzel Hafızanın Hata Modu | Kanıt Odaklı Güvenlik Ağı |
| --- | --- | --- |
| Hukuk Yapay Zekâsı | Var olmayan emsal kararlar veya mülga kanun maddeleri atfetme | Resmî gazete sayısını, madde numarasını ve doğrulama izini bağlar (bkz. [MESA Law](law/)) |
| Tıbbi Kararlar | Eski hasta dozaj talimatlarına güvenme | Zamansal kapsamı zorunlu kılar ve iddiayı hekim notunun tam zaman damgasına bağlar |
| Finansal Denetim | Taslak bütçe tahminlerini onaylanmış rakamlarla karıştırma | İmzalı işlem özetleri ve yetkilendirme kapsam doğrulaması gerektirir |
| Çoklu Şirket (SaaS) | Şirket stratejisini workspace sınırlarının dışına sızdırma | Çapraz veri sızıntısını önlemek için geri getirme öncesi sıkı tenant filtrelemesi uygular |

## Genel kavram ile MESA'nın uygulaması

Kanıt odaklı hafıza genel bir kavram olarak farklı yazılım mimarilerinde uygulanabilir. Önemli olan, iddiaları geri çağırmadan önce doğrulanabilir kaynaklara bağlama ilkesidir.

[MESA Core](mesa/) içinde bu ilke veritabanı seviyesinde uygulanır: SQLite; assertion'ların, kanıt aralıklarının ve kapsamların kanonik deposudur. Arama projeksiyonları (vektörler için [LanceDB](mesa/), grafikler için [Kùzu](mesa/)) verilerini doğrudan bu kanonik kayıtlardan türetir. Kanıtın sistemde nasıl aktığını [MESA Nasıl Çalışır](how-it-works/) sayfasında görebilirsiniz.

## Kaynaklar

1. [W3C PROV-DM: The PROV Data Model (W3C Tavsiyesi 2013)](https://www.w3.org/TR/prov-dm/)
2. [MESA Core Mimari Spesifikasyonu](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)
3. [Yapay Zekâ Sistemlerinde Provenance Nedir? — MESA Learn](learn/what-is-provenance-in-ai/)

