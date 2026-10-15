---
id: "what-is-ai-memory"
slug: "what-is-ai-memory"
type: "learn"
language: "tr"
title: "AI Memory Nedir?"
subtitle: "Ajan mimarilerinde durum kalıcılığı, bağlam sınırları ve hafıza yaşam döngüsü"
summary: "AI memory, modellerin ve otonom ajanların durumu korumasını, doğrulanmış geçmiş etkileşimleri geri çağırmasını ve çalıştırma sınırlarının ötesinde bilgi biriktirmesini sağlayan kalıcılık katmanıdır."
shortAnswer: "AI memory, sohbet geçmişi veya bağlam penceresinden ibaret değildir: ajanlara kalıcı süreklilik sağlayan depolama, kapsamlı geri getirme, mutasyon ve doğrulama yaşam döngüsüdür."
category: "Foundations"
tags: ["ai-memory", "persistence", "context", "foundations"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-01"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "AI Memory Nedir? — MESA Learn"
seoDescription: "Yapay zekâ ajan hafızasının nasıl çalıştığını, kısa ve uzun vadeli kalıcılığı, bağlam penceresi sınırlarını ve hafıza yaşam döngüsünü anlayın."
---

## Hafıza neden sohbet geçmişinden daha geniştir?

İlk konuşma tabanlı prototiplerde 'hafıza', geçmiş kullanıcı ve asistan mesajlarını bir sonraki prompt'un sonuna eklemekten ibaretti. Bu yöntem kısa vadede bir süreklilik hissi yaratsa da etkileşimler uzadıkça yetersiz kalır.

- Bağlam penceresi tükenmesi: Modellerin token sınırları vardır; prompt alanı hızla dolar.
- Karesel maliyet artışı: Eklenen her tur çıkarım gecikmesini ve işlem maliyetini katlayarak artırır.
- Dikkat seyrelmesi: Alakasız geçmiş turlar prompt'u doldurduğunda modeller 'lost-in-the-middle' etkisi yaşar ve kritik talimatları gözden kaçırır.
- Durum mutasyonu eksikliği: Yalnızca konuşma kaydı tutmak; güncellenen olguları, geri çekilen varsayımları veya tamamlanan görevleri temsil edemez.

**AI Memory**
: Farklı model çağrıları boyunca doğrulanmış olguları ve sistem durumunu seçici biçimde kabul eden, saklayan, indeksleyen, güncelleyen ve geri çağıran yapılandırılmış kalıcılık alt sistemi.

## Ajan hafızasının taksonomisi

Yapay zekâ ajanları için bilişsel mimariler, hafızayı yaşam süresi, temsil biçimi ve değiştirilebilirlik açısından farklı işlevsel katmanlara ayırır:

| Hafıza Türü | Yaşam Süresi | Temsil Biçimi | Birincil İşlev |
| --- | --- | --- | --- |
| Çalışma Hafızası (Working) | Tek görev yürütümü | Prompt içi token'lar, scratchpad | Muhakeme döngüsündeki ara adımları takip etme |
| Episodik Hafıza (Episodic) | Çoklu oturum | Zaman damgalı olay kayıtları, dökümler | Belirli geçmiş deneyimleri ve yürütüm sonuçlarını hatırlama |
| Bildirimsel Hafıza (Declarative) | Kalıcı / Uzun vadeli | Tipli olgular, assertion'lar, bilgi grafikleri | Dünya bilgisini, alan kurallarını ve kullanıcı tercihlerini koruma |
| Prosedürel Hafıza (Procedural) | Kalıcı / Statik | Sistem prompt'ları, araç şemaları, kod akışları | Eylemlerin ve araçların nasıl yürütüleceğini belirleme |

> [!NOTE]
> **Hafıza tek bir veritabanından ibaret değildir**
> Dayanıklı bir otonom ajan nadiren tek bir depolama mekanizmasına güvenir. Çalışma hafızası prompt token'larında yaşar; episodik hafıza vektör ve lexical loglardan beslenir; bildirimsel hafıza ilişkisel tutarlılık gerektirir.

## Hafıza yaşam döngüsünün dört aşaması

Üretim sınıfı ajan mimarileri, hafızayı yalnızca sonuna ekleme yapılan bir log gibi görmek yerine açık bir yaşam döngüsü yürütür:

<!-- diagram: AI hafıza yaşam döngüsünün dört aşamasını gösteren şema: Kabul, Depolama, Kapsamlı Geri Getirme ve Mutasyon -->
1. Kabul: Yeni gözlemi filtrele ve doğrula
2. Depolama: Kanonik kayıt + arama projeksiyonları
3. Geri Getirme: Prompt için kapsamlı geri çağırma
4. Mutasyon: Geçerliliğini yitiren olguları geçersiz kıl

*Ajan hafızası yaşam döngüsü, depolamadan önce doğrulamayı ve durum değiştiğinde geçersiz kılmayı zorunlu tutar.*

1. Kabul Kapısı (Admission Gate): Sistem, yeni bir gözlemin kalıcı depolamaya kaydedilmeden önce yeni, ilgili ve kanıtla desteklenmiş olup olmadığını belirler.
2. Depolama ve İndeksleme: Kabul edilen assertion kanonik bir depoda saklanır ve türetilmiş arama projeksiyonlarında (vektörler, kelimeler, grafikler) indekslenir.
3. Kapsamlı Geri Getirme (Scoped Retrieval): Yeni bir kullanıcı isteği için retriever, yalnızca yetkilendirilmiş kapsam ve workspace sınırları içindeki hafızaları sorgular.
4. Mutasyon ve Geçersiz Kılma (Mutation & Invalidation): Yeni olgular eski iddialarla çeliştiğinde sistem, çelişkili verilerin birikmesine izin vermek yerine eski kayıtları geçersiz olarak işaretler.

## Temel mimari ödünleşimler

Ajan hafızası tasarlamak, sistemin güvenilirliğini ve işletim maliyetini belirleyen temel mühendislik ödünleşimlerini içerir:

> [!WARNING]
> **Bağlam kirlenmesi riski**
> Her ham düşünceyi veya doğrulanmamış halüsinasyonu saklamak, ajanın gelecekteki bağlamını zehirler. Aşırı veri saklama, bilgiyi tamamen unutmak kadar güvenilirliğe zarar verir.

- [ ] Yazma gecikmesi ile Okuma gecikmesi: Erken olgu çıkarma yazma yükü yaratır ancak temiz geri getirme sağlar; tembel depolama yazmayı hızlandırır ancak geri çağırmada pahalı sentez gerektirir.
- [ ] Şema esnekliği ile Sorgu determinizmi: Serbest metin vektörleri çok yönlüdür ancak kesin mantıksal kurallarla filtrelenmesi zordur.
- [ ] Kalıcılık ile Gizlilik: Kullanıcı tercihlerini uzun vadeli saklamak, açık saklama politikaları ve veri sınırları gerektirir.

## MESA bu yapıda nerede durur?

[MESA Core](mesa/) mimarisinde hafıza, dayanıklılık ve doğrulama odaklı inşa edilmiştir. Biçimsiz metin yığınları saklamak yerine MESA; açık kaynak kimliği, karakter düzeyinde kanıt aralığı ve tenant kapsamlarıyla desteklenen kanonik assertion'ları SQLite içinde saklar.

İşlemsel bütünlüğü bozmadan farklı geri getirme ihtiyaçlarını karşılamak için MESA, bu kanonik kayıtları özel arama projeksiyonlarına aktarır: Vektör arama için [LanceDB](mesa/) ve varlık grafiği gezinimi için [Kùzu](mesa/). Bu veri akışını [MESA Nasıl Çalışır](how-it-works/) sayfasında ayrıntılarıyla görebilirsiniz.

## Kaynaklar ve ileri okuma

1. [Park vd. (2023) — Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442)
2. [Sumers vd. (2023) — Cognitive Architectures for Language Agents (CoALA)](https://arxiv.org/abs/2309.02427)
3. [MESA Core Mimari Spesifikasyonu](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)

