---
id: "provenance-in-ai"
slug: "what-is-provenance-in-ai"
type: "learn"
language: "tr"
title: "Yapay zekâ sistemlerinde provenance nedir?"
subtitle: "Yüzeysel atıflar ile değiştirilemez kaynak kayıtları, kanıt aralıkları ve dönüşüm izlerinin ayırt edilmesi"
summary: "Provenance, bilginin eksiksiz ve kaydedilmiş geçmişidir: köken varlığı, ingestion dönüşümleri, destekleyici kanıt aralıkları ve yetkilendirme yaşam döngüsü."
shortAnswer: "Atıf bir işarettir; provenance ise bir olgunun nereden kaynaklandığını, nasıl işlendiğini ve şu anda kullanılmasının neden geçerli olduğunu açıklayan denetlenebilir bir köken çizgisidir."
category: "Evidence & Trust"
tags: ["provenance", "auditability", "evidence", "trust"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-01"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "Yapay Zekâ Sistemlerinde Provenance Nedir? — MESA Learn"
seoDescription: "Yapay zekâda provenance'ın ne anlama geldiğini öğrenin: köken varlığı, dönüşüm süreçleri, kesin kanıt aralıkları ve atıf ile provenance arasındaki fark."
---

## Kritik ayrım: Atıf ile provenance arasındaki fark

Günümüz üretken yapay zekâ uygulamalarında modeller sık sık gelişigüzel atıflar üretir: bir URL'ye işaret eden '[1]' dipnotları veya 'Yargıtay kararlarına göre...' gibi serbest dilli ifadeler. Bunlar provenance değildir.

> [!WARNING]
> **Atıf doğrulama değildir**
> Bir atıf yalnızca bir cevabın nerede bulunduğu iddiasını taşır. Belgenin gerçekten var olduğunu, alıntının uydurulmadığını, kullanılan sürümün güncel olduğunu veya alıntının varılan sonucu desteklediğini kanıtlamaz.

Buna karşılık provenance (kaynak izi), bilgisayar biliminde biçimsel bir kavramdır: veriyi kökeninden başlayarak her işleme adımından geçip mevcut kullanımına kadar takip eden değiştirilemez, incelenebilir bir denetim izidir.

## Kavramsal temel: Varlıklar, faaliyetler ve aktörler

Veri provenance'ı için uluslararası standart olan W3C PROV-DM, üç temel yapı taşı tanımlar:

| PROV Unsuru | Tanım | AI Hafıza Örneği |
| --- | --- | --- |
| Varlık (Entity) | Belirgin bir duruma sahip fiziksel, dijital veya kavramsal nesne | Resmî Gazete 32450 sayılı nüshasının orijinal PDF dosyası |
| Faaliyet (Activity) | Varlıkları oluşturan, dönüştüren veya kullanan eylem | Belge ayrıştırma, kanonik JSONL çıkarma, parça embedding'i |
| Aktör (Agent) | Bir faaliyetten sorumlu olan kişi, sistem veya model | Ingestion servisi, onaylayan hukukçu reviewer, yapay zekâ modeli |

<!-- diagram: W3C PROV şeması: Faaliyet aracılığıyla Varlıktan türetilen ve Aktör ile ilişkilendirilen Varlık -->
1. Kaynak Belge (Varlık)
2. Ayrıştırma ve Çıkarım (Faaliyet)
3. Kabul Edilen İddia (Türetilmiş Varlık)
4. İnceleme ve Onay (Aktör)

*W3C PROV-DM modeli: Bilgi türetimi, varlıklar, faaliyetler ve aktörler arasındaki açık ilişkiler olarak modellenir.*

## Eksiksiz bir yapay zekâ provenance kaydı neleri içerir?

Güvenilir bir yapay zekâ sisteminde denetime hazır bir provenance kaydı yedi zorunlu nitelik taşır:

- [ ] 1. Köken Kimliği: Kararlı URL, resmî sicil kimliği veya kriptografik içerik özeti (SHA-256).
- [ ] 2. Kesin Kanıt Aralığı: Destekleyici metin bölümünü sabitleyen karakter başlangıç ve bitiş aralıkları `[başlangıç..bitiş]`.
- [ ] 3. Zamansal Anlık Görüntü: Kaynağın yayımlandığı, çekildiği ve işlendiği zaman damgaları.
- [ ] 4. Pipeline Sürümü: Çıkarımı yürüten yazılımın tam Git commit hash'i veya sürüm etiketi.
- [ ] 5. Model Tanımlayıcısı: Vektörleştirme veya çıkarımda kullanılan modelin sabitlenmiş sürümü (örneğin `text-embedding-3-small@v1`).
- [ ] 6. Yetkilendirme Kapsamı: Bu veriyi inceleme veya kullanma yetkisine sahip tenant ve workspace sınırları.
- [ ] 7. Geçersiz Kılma Bağlantısı: Mevzuat veya olgu değiştiğinde bu kaydın yerine geçen yeni otoriteye işaret eden bağlantı.

## Provenance model sapmasına ve halüsinasyona karşı nasıl korur?

Provenance yalnızca mevzuat yükümlülüğü değil; otonom sistemlerde güçlü bir teknik koruma kalkanıdır:

- Otomatik Doğrulama (Entailment Check): Bir denetim modeli, üretilen cevabın kaynak belgedeki kanıt aralığı tarafından matematiksel olarak desteklendiğini kullanıcıya sunmadan önce kontrol edebilir.
- Kademeli Geçersiz Kılma: Bir kanun maddesi değiştiğinde, sistem provenance grafiğini kullanarak o maddeye dayanan tüm hafıza iddialarını anında geçersiz kılabilir.
- Deterministik Hata Ayıklama: Bir ajan beklenmedik bir cevap ürettiğinde, mühendisler her girdi assertion'ını kaynak belgedeki tam bayt aralığına kadar takip edebilir.

## MESA ekosisteminde provenance

MESA projesinde provenance, tüm depolar arasında mimari bir ilke olarak uygulanır:

- [MESA Data](data/) içinde resmî hukuk kaynakları (PDF ve HTML) değiştirilemez bayt temeli olarak saklanır ve karakter aralıkları kanonik JSONL kayıtlarına işlenir.
- [MESA Core](mesa/) içinde her hafıza sorgusu, assertion ile birlikte kaynak belge özetini ve kanıt aralığını döndürür.
- [MESA Law](law/) içinde avukatlar, yapay zekânın sunduğu her tespiti tıklayarak Resmî Gazete'deki orijinal kanıt metnini anında inceleyebilir.

## Kaynaklar ve standartlar

1. [Moreau & Missier (2013) — W3C PROV-DM: The PROV Data Model](https://www.w3.org/TR/prov-dm/)
2. [Buneman vd. (2001) — Why and Where: A Characterization of Data Provenance (ICDT '01)](https://link.springer.com/chapter/10.1007/3-540-44503-X_20)
3. [Provenance Tanımı — MESA Sözlüğü](glossary/provenance/)

