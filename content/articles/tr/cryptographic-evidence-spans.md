---
id: "cryptographic-evidence-spans"
slug: "cryptographic-evidence-spans"
type: "learn"
language: "tr"
title: "İçerik adresli depolama ve kriptografik kanıt aralıkları"
subtitle: "Olgusal hafıza iddialarını değiştirilemez belge bayt ofsetlerine bağlama"
summary: "Kanıt odaklı yapay zekâ hafızası her olgusal iddiayı içerik adresli belge hash'lerine ve kesin bayt aralıklarına bağlayarak atıfları doğrulanabilir ve tahrifata dayanıklı kılar."
shortAnswer: "Kriptografik kanıt aralıkları, iddiaları SHA-256 ile özetlenmiş kaynak belgelerdeki tam karakter aralıklarına bağlayarak hayali atıfları engeller."
category: "Evidence & Trust"
tags: ["content-addressing", "sha256", "evidence-spans", "integrity"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "İçerik adresli depolama ve kriptografik kanıt aralıkları — MESA Learn"
seoDescription: "Kanıt odaklı yapay zekâ hafızası her olgusal iddiayı içerik adresli belge hash'lerine ve kesin bayt aralıklarına bağlayarak atıfları doğrulanabilir ve tahr"
---

## Kopuk atıf açığı

Standart yapay zekâ sistemleri zamanla değişebilen dosya adlarına veya URL'lere atıf yapar: 'Bkz. sozlesme_v2.pdf'. Dosya diskte güncellenirse veya web sayfası değişirse, atıf modelin o an okuduğu metinden tamamen kopar.

> [!WARNING]
> **Kayan Bilgi Kaynağı Tehlikesi**
> Hukuki veya tıbbi iş akışlarında, içeriği sonradan değişmiş bir belgeye dayanılarak cevap verildiğini iddia etmek bağımsız geriye dönük denetimi imkânsız kılar.

## Mühendislik ödünleşimlerinin karşılaştırması

| Bağlama Yöntemi | Bütünlük Düzeyi | Granülerlik | Denetim Doğrulaması |
| --- | --- | --- | --- |
| URL İşaretçisi | Düşük: URL içeriği haber vermeden değişebilir | Tüm web sayfası / belge | Manuel insan web araması |
| Dosya Yolu | Düşük: dosyaların üzerine diskte yazılabilir | Tüm belge dosyası | Kırılgan: dosya sistemi kararlılığına bağlıdır |
| Belge Hash'i (SHA-256) | Yüksek: belge içeriği kriptografik olarak sabittir | Tüm belge | Orijinal dosyayı hash'leyerek doğrulanabilir |
| İçerik Hash'i + Bayt Aralığı | En yüksek: kesin karakter aralığını sabitler [başlangıç..bitiş] | Kesin cümle veya paragraf aralığı | Deterministik matematiksel doğrulama |

## Karakter ofseti sabitleme ve doğrulama matematiği

Bir kanıt aralığı kaydı, olgusal bir iddiayı kesin bir bayt aralığına kilitler: `belge_sha256:span[c_başlangıç, c_bitiş]`. Denetim sırasında otomatik bir test aracı orijinal belgeyi hash'iyle çeker, `[c_başlangıç..c_bitiş]` aralığındaki baytları keser ve kaydedilen alıntıyla birebir eşleştiğini doğrular.

```text
// İçerik adresli kanıt aralığı kaydı
{
  "belge_hash": "a3f892bc...33e1",
  "karakter_baslangic": 4520,
  "karakter_bitis": 4780,
  "alintilanan_metin": "İşbu sözleşmenin uygulanmasında Türkiye Cumhuriyeti kanunları geçerlidir.",
  "dogrulama_tarihi": "2026-10-17T00:00:00Z"
}
```

## MESA mimarisinde kanıt aralıkları

MESA Data ve Core içinde resmî hukuk metinleri değiştirilemez bayt temeli olarak saklanır. SQLite'taki her assertion doğrulanmış bir kanıt aralığına bağlanır. Kullanıcı bir iddiayı tıkladığında arayüz Resmî Gazete'deki orijinal kanıt metnini anında vurgular.

- [ ] Kaynak belgeler SHA-256 içerik hash'leriyle indekslenir.
- [ ] Kanıt aralıkları kesin unicode karakter ofsetlerini [başlangıç..bitiş] kaydeder.
- [ ] Otomatik CI boru hatları kanıt aralıklarının ham metinle eşleştiğini doğrular.
- [ ] Hiçbir assertion kanıt aralığına bağlanmadan hafızaya kabul edilemez.

## Kaynaklar

1. [W3C PROV-DM: The PROV Data Model (2013)](https://www.w3.org/TR/prov-dm/)
2. [MESA Data Ground Truth ve Ingestion Spesifikasyonu](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)

