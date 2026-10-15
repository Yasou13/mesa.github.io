---
id: "memory-scope-and-authorization"
slug: "memory-scope-and-authorization"
type: "learn"
language: "tr"
title: "Çok ajanlı sistemlerde hafıza kapsamı ve yetkilendirme"
subtitle: "Güvenlik, kiracı (tenant) sınırları ve erişim denetimlerinin neden retrieval birleşiminden önce uygulanması gerektiği"
summary: "Çok ajanlı sistemler; veri sızıntısını ve bağlam kirlenmesini önlemek için kiracılar, çalışma alanları, ajanlar ve zaman pencereleri arasında titiz bir hafıza kapsamı gerektirir."
shortAnswer: "Ajan hafızasında yetkilendirme sonradan düşünülen bir yama olamaz: kapsamlar vektör veya kelime araması çalıştırılmadan önce doğrulanmalı, ajanların yetki sınırları dışındaki verilere erişmesi engellenmelidir."
category: "Evidence & Trust"
tags: ["authorization", "multi-agent", "security", "scope", "tenancy"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-01"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Çok Ajanlı Sistemlerde Hafıza Kapsamı ve Yetkilendirme — MESA Learn"
seoDescription: "Çok kiracılı (multi-tenant) izolasyonu, workspace sınırlarını, ajan gizliliğini ve yetkilendirmenin neden retrieval birleşiminden önce uygulanması gerektiğini anlayın."
---

## Çok ajanlı sistemlerde veri sızıntısı sorunu

Kurumsal ortamlarda birden fazla ajan işbirliği yaptığında ortak veri altyapısını paylaşır. Hafıza belirgin sınır denetimlerine sahip değilse, anlamsal arama devasa bir güvenlik açığına dönüşür.

> [!WARNING]
> **Anlamsal aramanın gizlilik kavramı yoktur**
> 'Geçen hafta konuşulan yönetici tazminat şartları nelerdi?' gibi bir sorgu, sonuçları yalnızca kosinüs benzerliğine göre geri getirir. Dense embedding'ler şirket içi bilgi duvarlarını, organizasyon hiyerarşisini veya kiracı (tenant) sınırlarını tanımaz.

Sınır denetimi olmadan, bir pazarlama yüklenicisine yardımcı olan ajan, aynı veritabanında üst düzey bir ajanın sakladığı gizli şirket satın alma stratejilerini yanlışlıkla geri çağırabilir.

## Hafıza kapsamının altı boyutu

Üretim sınıfı hafıza motorlarında güvenlik altı bağımsız eksende modellenir:

| Kapsam Boyutu | Sınır Türü | Örnek | Uygulama Rolü |
| --- | --- | --- | --- |
| Tenant ID | Kurumsal izolasyon | Kurumsal Hesap A ile Hesap B | Mutlak izolasyon: kiracılar arası sorgu yürütümü sıfırdır |
| Workspace ID | Proje / Ekip sınırı | Dosya 402 ile Dosya 510 | Ajanın hangi proje veya müvekkil dosyalarını okuyabileceğini belirler |
| Agent ID | Özel scratchpad | AraştırmaAjanı ile DenetimAjanı | Ajanların paylaşmadan önce özel çalışma hafızası tutmasını sağlar |
| Session ID | Oturum yaşam döngüsü | Canlı konuşma turu | Geçici konuşma durumunu kalıcı hafızadan izole eder |
| Zaman Penceresi | Geçerlilik süresi | `valid_from` ile `valid_until` | Süresi dolmuş, taslak veya yürürlükten kalkmış iddiaları dışlar |
| Yargı Yetkisi | Mevzuat sınırı | TR ile AB veri sınırı | Yerel veri egemenliği kurallarına uyumu güvenceye alır |

## Ön filtreleme neden matematiksel olarak zorunludur?

Ajan geliştirmede sıkça yapılan bir hata sonradan filtrelemedir (post-filtering): vektör veritabanını genel olarak sorgulayıp ilk k sonucu almak, ardından yetkisiz olanları bir `if` koşuluyla ayıklamak.

<!-- diagram: Sonradan Filtreleme (top-k açlığına yol açan) ile Doğru Ön Filtrelemeyi (yalnızca yetkili bölmede arama yapan) karşılaştıran şema -->
1. Hatalı Sonradan Filtreleme: Genel Arama -> Tenant B'den ilk 10 sonuç -> Ayıklandı -> Tenant A'ya sıfır sonuç döndü
2. Doğru Ön Filtreleme: Kapsam Filtresi (Tenant A) -> Kapsamlı Vektör Taraması -> Tenant A'ya 10 ilgili sonuç döndü

*Sonradan filtreleme sonuç açlığına yol açar; ön filtreleme aramanın yalnızca yetkili bölümlerde çalışmasını garanti eder.*

- [ ] Top-k Açlığı: Genel vektör eşleşmelerinin ilk 20'si başka bir kiracıya aitse, sonradan filtreleme hepsini eler; sistemde 21-50. sıralarda onlarca geçerli kayıt olmasına rağmen kullanıcıya boş liste döner.
- [ ] İşlem Maliyeti: Milyonlarca yetkisiz satır üzerinde vektör mesafesi hesaplamak GPU ve CPU kaynaklarını israf eder.
- [ ] Veri Sızıntısı Riski: Genel indekslerin yetkisiz adayları işlemesi zamanlama ve önbellek yan kanalları üzerinden bilgi sızdırabilir.

## Otonom ajanlar arasında kapsamlı işbirliği

Çok ajanlı iş akışları, ajanların ortak bir çalışma alanı bağlamını paylaşırken özel hafızalarını koruyabildiği incelikli bir izin modeli gerektirir:

> [!TIP]
> **İşbirlikçi ajan senaryosu**
> Ajan A (Araştırmacı) `workspace:dosya_104` kapsamına herkese açık iddialar yazar. Ajan B (Denetçi) bu iddiaları okur, gizli bir ücret denetimi yapar ve `agent:denetci_ozel` kapsamına yazar. Ajan A hafızayı sorguladığında yalnızca genel iddiaları görürken, Ajan B her iki katmanı da görebilir.

## MESA hafıza yetkilendirmesini nasıl uygular?

[MESA Core](mesa/) içinde kapsam isteğe bağlı bir etiket değildir: her hafıza tablosu şeması zorunlu `dataset_id`, `tenant_id`, `agent_id` ve zamansal sınır sütunlarını içerir.

Retrieval router'ları, aday üretimi başlamadan *önce* SQL `WHERE` koşullarını ve vektör metaveri bölüm filtrelerini uygular. Ayrıca MESA, Profile B güvenlik sertifikasyon kapılarını destekleyerek hafıza sınırlarının kurcalamaya karşı korumalı olmasını ve hata durumunda kapanmasını (fail-closed) sağlar. Detayları [MESA Core Dokümantasyonu](mesa/) sayfasında bulabilirsiniz.

## Kaynaklar

1. [Sandhu vd. (1996) — Role-Based Access Control Models (IEEE Computer)](https://ieeexplore.ieee.org/document/485845)
2. [Saltzer & Schroeder (1975) — The Protection of Information in Computer Systems](https://www.cs.virginia.edu/~evans/cs551/saltzer/)
3. [MESA Değerlendirme ve Güvenlik Kapıları](https://mesamemory.dev/evaluation/)

