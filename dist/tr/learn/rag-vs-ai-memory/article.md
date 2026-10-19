---
id: "rag-vs-ai-memory"
slug: "rag-vs-ai-memory"
type: "learn"
language: "tr"
title: "RAG ve hafıza: kaynaktan yanıta"
subtitle: ""
summary: "Bilginin aramada bulunmasından yanıta dönüşmesine kadar geçen adımları izleyin. RAG ile hafızanın ilişkisini ve bağlam bütçesini örneklerle öğrenin."
shortAnswer: "Bilginin aramada bulunmasından yanıta dönüşmesine kadar geçen adımları izleyin. RAG ile hafızanın ilişkisini ve bağlam bütçesini örneklerle öğrenin."
category: "Foundations"
tags: ["RAG", "chunking", "context budget", "parçalama", "bağlam bütçesi", "prompt injection"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "RAG ve hafıza: kaynaktan yanıta — MESA"
seoDescription: "Bilginin aramada bulunmasından yanıta dönüşmesine kadar geçen adımları izleyin. RAG ile hafızanın ilişkisini ve bağlam bütçesini örneklerle öğrenin."
lessonOrder: 2
learningStage: "foundation"
prerequisites: ["what-is-ai-memory"]
learningObjectives: ["Kaynakla desteklenen istek kurmak", "Arama ve yanıt hatasını ayırmak", "İstisnaları kaybetmeden kanıt bütçelemek"]
---

## RAG ne yapar, hafıza neyi yönetir?

RAG, dışarıdan bulunan bilgiyi dil modeline sunarak yanıtı bu bilgiye dayandırma yöntemidir. Getirilen içerik bir kılavuz, kullanıcı tercihi veya önceki görev kaydı olabilir. “Hafıza” ise uygulamanın neyi sakladığını ve bunu zaman içinde nasıl yönettiğini anlatır. Bir hafıza sistemi RAG akışına veri sağlayabilir; RAG’in kullandığı belgeler de sürekli güncellenebilir. Ayrım, birinin sabit diğerinin değişken olması değildir.

Lewis ve arkadaşları, modelin öğrendiği bilgiyle aramada bulunan bilgiyi birleştiren belirli bir eğitilebilir RAG mimarisi sundu. Bugün RAG adı, arama bileşeniyle yanıt üreten model birlikte eğitilmeden yapılan uygulamalar için de kullanılıyor. Hangi kullanımdan söz ettiğinizi belirtin. Bu ders uygulama akışını açıklar; kaynağa dayanan her istemin özgün makaledeki eğitim yöntemini kullandığını söylemez. [Özgün makale](https://arxiv.org/abs/2005.11401)

## Tek soru, incelenebilir beş karar

<!-- diagram: Soru üretimden önce yetkilendirme, arama, seçim ve bağlam kurulumundan geçer. -->
1. Soru · hafta içi saat?
2. Kapsam · archive-team
3. Adaylar · sürüm 1 ve 2
4. Seçim · etkin kaynak 2
5. Üretim · yanıt + kaynak

*Generator yalnızca isteğe gerçekten yerleştirilen kanıtı görür.*

Önce isteği yapan kişinin hangi kaynaklara erişebildiğini belirleyin. Sonra adayları bulun; uygun olmayan veya yerini daha yeni sürüme bırakmış kayıtları çıkarın. Kalan sonuçları sıralayıp sınırlı kanıt bağlamına yerleştirin. Son olarak modelden bu bağlama dayalı bir yanıt ve onu destekleyen kaynakları isteyin. Her aşamayı ayrı izleyin: Makul görünen son yanıt, aramadaki bir hatayı veya modelin eğitimden tesadüfen bildiği bir cevabı gizleyebilir.

## Parça sınırları cevaplanabilirliği değiştirir

Kaynakta “Salon hafta içi 09.00’da açılır; resmî tatiller hariç” yazsın. Metni bölerken istisna ayrı parçaya düşer ve arama yalnızca ilk parçayı getirirse sistem gerçek bir cümleye atıf yaparak yanlış yönlendirebilir. Başlık, paragraf, tablo ve ek sınırlarını gözetin. Kaynak içindeki konumları koruyun; soruların komşu parçalara ihtiyaç duyup duymadığını test edin.

Parçaları bir miktar örtüştürmek yakın bağlamı koruyabilir, ancak çok benzer sonuçları da çoğaltır. Modelin bağlamını doldurmadan önce belge, sürüm ve metin aralığına göre tekrarları ayıklayın. Her belgeye uygun tek bir parça boyutu yoktur. Kısa bir SSS ile uzun bir tablo aynı biçimde bölünmez. Başlangıç ayarını seçin, hataları inceleyin ve daha önce ayarlarda kullanmadığınız test sorularıyla karşılaştırın.

## Kanıt bütçesini hesaplayın

```text
input budget = 8,000 tokens
instructions + question + tool schemas = 2,000
reserved evidence capacity = 6,000
If the model limit includes output: reserve output separately.
Actual packing must include source labels and separators.
```

Her kanıt 500 token, kimlik ve biçim bilgileri de 50 token gerektiriyorsa on öğe 5.500 token tutar. On bir öğe 6.050 token ile bu örnekteki bütçeyi aşar. Sığdırmak için metni olumsuzluk veya istisna cümlesinin ortasından kesmeyin. Öğeyi çıkarın ya da daha uygun bir bütünle değiştirin. Kaynak kimliğini koruyun; mümkünse modelin gerçek token sayacını kullanın. Bu sayılar bir modelin kapasitesini değil, hesap örneğini gösterir.

## Aramayla yanıt üretimini ayrı değerlendirin

| Gözlem | İncelenecek alan |
| --- | --- |
| Doğru kaynak adaylarda yok | Veri alımı, sorgu, indeks ve kapsam |
| Kaynak geldi ama bağlama girmedi | Sıralama, tekrar ayıklama ve paketleme |
| Kaynak bağlamda var, yanıt yine de yanlış | Talimat, model davranışı ve belirsizlik |
| Cevap doğru, kaynak ilgisiz | Atfın desteği ve olası model ezberi |

Aramada bulunan metin “önceki talimatları yok say” dese bile veri olarak kalmalıdır. Onu güvenilir talimatlardan ayırın; bir belge istedi diye araçlara işlem yetkisi vermeyin. Kaynağın bulunması, içeriğin doğru olduğunu veya araç çağrısının güvenliğini göstermez. OWASP, dolaylı istem enjeksiyonu riskini ve birden fazla katmanda alınabilecek önlemleri açıklar. Tek bir ayraç kullanmak sorunu çözmez. [Güvenlik kaynağı](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

## Eksik istisnayı bulun

> [!EXERCISE]
> **Kendinizi sınayın**
> Kaynak 400 token kural ve 100 token istisna içeriyor. Yalnızca kurallar sığıyor. Son 100 token’ı kesmek güvenli optimizasyon mudur?
>
> **Açıklama:** Hayır. Kuralı istisnalarıyla koruyun, daha küçük tam birim getirin veya tam cevap veremediğinizi belirtin. Yalnızca bağlama yerleştirilen parça sayısını değil, yanıtın kaynak desteğini ölçün.

## Kaynaklar ve ileri okuma

1. [Lewis et al. (2020) · Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
2. [Liu et al. (2023) · Lost in the Middle](https://arxiv.org/abs/2307.03172)
3. [OWASP · LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

