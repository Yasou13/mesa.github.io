---
id: "rag-vs-ai-memory"
slug: "rag-vs-ai-memory"
type: "learn"
language: "tr"
title: "RAG ve hafıza: isteği adım adım kurmak"
subtitle: ""
summary: "Kaynağı retrieval’dan yanıta kadar izleyin. RAG ile hafızanın örtüşmesini, bağlam bütçesini ve kaynaklandırmanın nerede bozulduğunu öğrenin."
shortAnswer: "Kaynağı retrieval’dan yanıta kadar izleyin. RAG ile hafızanın örtüşmesini, bağlam bütçesini ve kaynaklandırmanın nerede bozulduğunu öğrenin."
category: "Foundations"
tags: ["RAG", "chunking", "context budget", "parçalama", "bağlam bütçesi", "prompt injection"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "RAG ve hafıza: isteği adım adım kurmak — MESA Learn"
seoDescription: "Kaynağı retrieval’dan yanıta kadar izleyin. RAG ile hafızanın örtüşmesini, bağlam bütçesini ve kaynaklandırmanın nerede bozulduğunu öğrenin."
lessonOrder: 2
learningStage: "foundation"
prerequisites: ["what-is-ai-memory"]
learningObjectives: ["Kaynakla desteklenen istek kurmak", "Retrieval ve yanıt hatasını ayırmak", "İstisnaları kaybetmeden kanıt bütçelemek"]
---

## RAG bir örüntü, hafıza bir yaşam döngüsü konusudur

Retrieval-augmented generation, dış bilgiyi getirip üretilen yanıtı bu bilgiyle koşullandırmaktır. Uygulama bir kılavuz, kullanıcı tercihi veya önceki görev kaydı getirebilir. “Hafıza”, uygulamanın neyi koruduğunu ve zaman içinde nasıl yönettiğini anlatır. Hafıza sistemi RAG hattını besleyebilir; RAG veri kümesi sürekli güncellenebilir. Tanımlayıcı ayrım statik/dinamik olması değildir.

Lewis ve arkadaşları parametrik bilgiyle getirilen bilgiyi birleştiren belirli bir eğitilebilir RAG mimarisi sundu. Güncel uygulamalarda terim, retriever ve generator birlikte eğitilmeden, istek anındaki retrieval için de kullanılır. Hangi anlamı kullandığınızı belirtin. Bu ders uygulama örüntüsünü açıklar; her kaynaklı prompt’un özgün eğitim yöntemini uyguladığını iddia etmez. [Özgün makale](https://arxiv.org/abs/2005.11401).

## Tek soru, incelenebilir beş karar

<!-- diagram: Soru üretimden önce yetkilendirme, retrieval, seçim ve bağlam kurulumundan geçer. -->
1. Soru · hafta içi saat?
2. Kapsam · archive-team
3. Adaylar · revizyon 1 ve 2
4. Seçim · etkin kaynak 2
5. Üretim · yanıt + kaynak

*Generator yalnızca isteğe gerçekten yerleştirilen kanıtı görür.*

Önce çağıranın izinli kaynaklarını çözün. Sonra adayları getirin; uygun olmayan veya eski sürümle değiştirilmiş kayıtları çıkarın. Kalan adayları sıralayıp sınırlı kanıt bağlamına yerleştirin. Son olarak generator’dan bu bağlama dayanarak cevap ve destekleyen kaynak isteyin. Aşamaları ayrı kaydedin: makul son yanıt bozuk retriever’ı veya model parametrelerinden gelen tesadüfi cevabı gizleyebilir.

## Parça sınırları cevaplanabilirliği değiştirir

Kaynak “Salon hafta içi 09.00’da açılır; resmî tatiller hariç” diyor. Parçalama istisnayı başka kayda ayırır ve retrieval yalnızca ilkini getirirse sistem gerçek cümleye atıf yaparken yanıltıcı cevap verebilir. Belge yapısıyla başlayın: başlık, paragraf, tablo ve ek sınırları. Kaynak konumlarını koruyup soruların komşu parçalara ihtiyaç duyup duymadığını test edin.

Örtüşme yerel bağlamı korumaya yardımcıdır; aynı zamanda birbirine çok benzeyen adaylar üretir. Bağlamı doldurmadan önce kaynak/revizyon/aralıkla tekrarları ayıklayın. Evrensel parça boyutu yoktur: kısa SSS ve uzun tanımlı tablo farklı işlem ister. Token sayısını kural yapmak yerine başlangıç ayarı seçin, hataları inceleyin ve ayrılmış test sorularında karşılaştırın.

## Kanıt bütçesini hesaplayın

```text
input budget = 8,000 tokens
instructions + question + tool schemas = 2,000
reserved evidence capacity = 6,000
If the model limit includes output: reserve output separately.
Actual packing must include source labels and separators.
```

Her kanıt 500 token ve kimlik/biçim için 50 token gerektiriyorsa on öğe 5.500 token tüketir. On bir öğe 6.050 ile bu örnek bütçeyi aşar. Sığdırmak için parçayı olumsuzluk veya istisna ortasında kesmeyin. Öğeyi çıkarın ya da değiştirin; kaynak kimliğini koruyun ve mümkünse modelin gerçek tokenizer’ıyla sayın. Sayılar model özelliği değil alıştırmadır.

## Retrieval ile üretimi ayrı teşhis edin

| Gözlem | İncelenecek alan |
| --- | --- |
| Doğru kaynak adaylarda yok | Veri alımı, sorgu, indeks ve kapsam |
| Kaynak geldi ama bağlama girmedi | Sıralama, tekrar ayıklama ve paketleme |
| Kaynak prompt’ta, cevap yanlış | Talimat, model davranışı ve belirsizlik |
| Cevap doğru, kaynak ilgisiz | Atfın desteği ve olası model ezberi |

Getirilen metin “önceki talimatları yok say” dese bile veridir. Güvenilir talimattan ayrı tutun; belge istedi diye araç eylemine yetki vermeyin. Kaynağın bulunması doğruluğu veya araç çağrısının güvenliğini sağlamaz. OWASP dolaylı prompt injection riskini ve katmanlı önlemleri açıklar; tek ayraç sorunu ortadan kaldırmaz. [Güvenlik kaynağı](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

## Eksik istisnayı bulun

> [!EXERCISE]
> **Kendinizi sınayın**
> Kaynak 400 token kural ve 100 token istisna içeriyor. Yalnızca kurallar sığıyor. Son 100 token’ı kesmek güvenli optimizasyon mudur?
>
> **Answer:** Hayır. Kuralı istisnalarıyla koruyun, daha küçük tam birim getirin veya tam cevap veremediğinizi belirtin. Yalnızca bağlama yerleştirilen parça sayısını değil, yanıtın kaynak desteğini ölçün.

## Kaynaklar ve ileri okuma

1. [Lewis et al. (2020) · Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
2. [Liu et al. (2023) · Lost in the Middle](https://arxiv.org/abs/2307.03172)
3. [OWASP · LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

