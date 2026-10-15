---
id: "rag-vs-ai-memory"
slug: "rag-vs-ai-memory"
type: "learn"
language: "tr"
title: "RAG ile AI Memory arasındaki fark nedir?"
subtitle: "Dış bilgi geri getirme ile gelişen durum odaklı ajan sürekliliğinin karşılaştırılması"
summary: "Retrieval-Augmented Generation (RAG) üretim için statik referans materyali getirirken, AI memory zaman içinde gelişen ajan ve kullanıcı durumunu yönetir."
shortAnswer: "RAG veriyi salt okunur bir kütüphane gibi ele alır; AI memory ise ajanın ne öğrendiğini, neye karar verdiğini ve ne gözlemlediğini takip eden dinamik bir durum kaydıdır."
category: "Foundations"
tags: ["rag", "ai-memory", "retrieval", "foundations"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-01"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "RAG ile AI Memory Arasındaki Fark Nedir? — MESA Learn"
seoDescription: "Statik veri kümesi üzerindeki RAG yaklaşımı ile durum bilgisi tutan kalıcı AI memory arasındaki farkları, mutasyonu, kapsamları ve yaşam döngüsünü karşılaştırın."
---

## İki farklı görev: Referans kütüphanesi ile iç durum

Mühendisler sık sık RAG ve AI memory kavramlarını birbirine karıştırır çünkü iki teknik de bir veritabanını sorgular ve geri getirilen parçaları prompt'a ekler. Ancak mimari amaçları ve veri yaşam döngüleri kökten farklıdır.

Klasik RAG harici bir bilgi sorununu çözer: temel modelin ağırlıklarında güncel veya kuruma özel bilgiler yer almaz. Dış veri kümesi (kanunlar, teknik kılavuzlar, şirket içi dokümantasyon) çevrimdışı parçalanır, vektörleştirilir ve indekslenir. Çalışma zamanında retriever salt okunur bir sorgu yürütür.

AI memory ise iç süreklilik sorununu çözer: otonom ajanlar kullanıcılarla etkileşime girer, görevleri yürütür, hatalarla karşılaşır ve düzeltmeler alır. Hafıza, bu etkileşimlerin oturumlar boyunca gelişen durum modelini korur.

## Mimari farkların karşılaştırması

| Boyut | Retrieval-Augmented Generation (RAG) | AI Agent Memory |
| --- | --- | --- |
| Birincil Amaç | Üretimi referans belgelerle temellendirme | Kalıcı durumu, tercihleri ve ilerlemeyi sürdürme |
| Veri Değişkenliği | Statik / Periyodik toplu indeksleme | Son derece dinamik / Sürekli okuma-yazma-güncelleme |
| Yazma Tetikleyicisi | Çevrimdışı ingestion hattı | Ajan eylemleri, araç çıktıları, kullanıcı geri bildirimi |
| Kapsam ve İzolasyon | Geniş veri kümesi veya koleksiyon düzeyinde izinler | Sıkı tenant, workspace, ajan ve oturum sınırları |
| Zamansal Geçersiz Kılma | Nadiren (sürümlenmiş belge yayınları) | Sıkça (eski olguları güncelleme, çürütülen iddiaları kaldırma) |
| Kaynak Materyali | Dış belgeler (PDF'ler, Markdown, web sayfaları) | İç ajan gözlemleri, yapılandırılmış iddialar, diyaloglar |

## İki yaklaşımın kesiştiği ortak mekanizmalar

RAG ile hafıza arasındaki kafa karışıklığı, kullandıkları ortak teknik araç setinden kaynaklanır:

- Dense Vektör Temsilleri: İkisi de sözcükler farklı olduğunda anlamsal olarak ilişkili metinleri bulmak için vektör benzerliğinden yararlanır.
- Lexical Ters İndeksler: İkisi de özel isimleri ve kesin tanımlayıcıları korumak için BM25 veya tam metin arama kullanır.
- Rank Fusion: İkisi de tamamlayıcı arama sinyallerini birleştirmek için Reciprocal Rank Fusion (RRF) gibi sıralama algoritmalarından faydalanır.
- Prompt Enjeksiyonu: İkisi de geri getirilen kayıtları LLM isteğinin başına bağlam metni olarak ekler.

## Bir ajanın her iki sisteme ne zaman ihtiyacı olur?

Uzmanlaşmış alanlarda çalışan otonom sistemler nadiren RAG ile hafıza arasında bir seçim yapar; ikisini tamamlayıcı hatlar olarak birleştirir:

> [!TIP]
> **Gerçek dünya senaryosu: Hukuk Asistanı**
> Bir avukat ajandan Dosya #104 için bir dilekçe taslağı hazırlamasını istediğinde; ajan mevzuat ve emsal kararlar için [MESA Data](data/) RAG hattını sorgularken, müvekkil kısıtlamalarını ve format tercihlerini hatırlamak için [MESA Core](mesa/) hafızasını sorgular.

<!-- diagram: Çift geri getirme akışı: Sorgu RAG veri kümesi ve Ajan Hafızasına ayrılır, yetki denetiminden geçer ve LLM bağlamında birleşir -->
1. Kullanıcı Sorgusu: 'Dosya 104 taslağını hazırla'
2. Paralel Getirme: RAG (Mevzuat) + Hafıza (Dosya Durumu)
3. Birleşim Öncesi Kapsam Denetimi: Workspace ve yetki kontrolü
4. Birleştirilmiş Bağlam LLM'e aktarılır

*Tamamlayıcı geri getirme: RAG alan otoritesini sağlarken, AI memory görev ve kullanıcı sürekliliğini sunar.*

## MESA bu sınıra nasıl yaklaşır?

MESA ekosistemi, referans verilerini ve durum bilgisi tutan hafızayı belirgin sistem sınırlarına sahip ayrı bileşenlerde tutarak bu ayrımı korur:

- [MESA Data](data/), resmî hukuk kaynaklarını (Resmî Gazete, Mevzuat, AYM) işleyen ve değiştirilemez, denetlenebilir veri paketleri yayımlayan altyapıdır.
- [MESA Core](mesa/), ajanlar için durum bilgisi tutan hafıza motorudur; iddiaları, yürütüm durumunu ve kapsamlı ilişkileri zaman içinde takip eder.
- Her iki bileşen de doğrulanabilir kanıt kuralını uygular: bir veri ister mevzuat arşivinden ister ajan hafızasından gelsin, kaynak kimliği ve kanıt aralığı korunur.

## Kaynaklar

1. [Lewis vd. (2020) — Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)
2. [Shinn vd. (2023) — Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366)
3. [MESA Ekosistem Mimarisi ve Sınırları](https://mesamemory.dev/ecosystem/)

