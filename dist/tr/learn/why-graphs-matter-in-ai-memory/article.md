---
id: "why-graphs-matter"
slug: "why-graphs-matter-in-ai-memory"
type: "learn"
language: "tr"
title: "Bilgi çizgeleri: kanıt uydurmadan ilişkileri izlemek"
subtitle: ""
summary: "Kaynağa bağlı çizge kurun, iki adımlı soruyu izleyin; çizge gezintisini GraphRAG özetlerinden ve geçerli çıkarımdan ayırın."
shortAnswer: "Kaynağa bağlı çizge kurun, iki adımlı soruyu izleyin; çizge gezintisini GraphRAG özetlerinden ve geçerli çıkarımdan ayırın."
category: "Memory & Retrieval"
tags: ["graph", "GraphRAG", "multi hop", "Kuzu", "knowledge graph", "çizge", "ilişki"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Bilgi çizgeleri: kanıt uydurmadan ilişkileri izlemek — MESA Learn"
seoDescription: "Kaynağa bağlı çizge kurun, iki adımlı soruyu izleyin; çizge gezintisini GraphRAG özetlerinden ve geçerli çıkarımdan ayırın."
lessonOrder: 8
learningStage: "retrieval"
prerequisites: ["structured-vs-unstructured-memory", "hybrid-retrieval"]
learningObjectives: ["Varlık ve koşullu ilişki modellemek", "Sınırlı iki adımlı sorguyu izlemek", "Çizge yolunun yanıtı desteklemediğini görmek"]
---

## İlişki kimlik ve kanıt gerektirir

Metin araması pasaj bulur. Çizge sorgusu açıkça temsil edilmiş ilişkileri izler. Kurgusal Atlas arşivinde okuma salonu, arşiv ve ilçe düğümleri; “parçası” ve “bulunduğu yer” kenarları kurun. Sabit düğüm kimliği kullanıp her iddia kenarını destekleyen kaynak revizyonuna bağlayın. “Merkez” gibi etiket kimliği çözmeye yetmez.

```text
room-7 --part_of [evidence: handbook-r3/c4]--> archive-2
archive-2 --located_in [evidence: directory-r1/c2]--> district-5
room-7 --opening_time [day: Friday; from: Nov 1]--> 10:00
```

İlişkiler yön ve tür taşır. “A, B’yi yönetir”, “B, A’yı yönetir” değildir; “atıf yapar”, “katılır” değildir. Zaman, kapsam ve belirsizlik ilişkiyi değiştiriyorsa koruyun. Kaynağın aynı paragrafta iki isim anması aralarında anlamlı kenar kurmaz. Birlikte görünme keşif sinyali olabilir; doğrulanmış ilişki değildir.

## İki adımlı soruyu çözün

“7 numaralı salonun bağlı olduğu arşiv hangi ilçede?” diye sorun. Salon 7’yi çözün, `part_of` ile arşiv 2’ye, `located_in` ile ilçe 5’e gidin. İki kenar kimliğini ve kaynaklarını döndürün. Her adımın anlamı belli olduğundan kanıt zinciri incelenebilir. Kaynaklardan biri erişilemez, eski veya belirsizse tam yanıt o çağıran için desteklenmez.

<!-- diagram: Okuma salonu arşive, ardından ilçeye bağlanır; her adım kaynak kimliğini korur. -->
1. Çöz · room-7
2. Adım 1 · part_of
3. Arşiv · archive-2
4. Adım 2 · located_in
5. Yanıt · district-5 + 2 kaynak

*İki kenar ancak ilişkiler ve kapsamlar geçerliyse desteklenen zincir olur.*

## Yol kendiliğinden çıkarım kuralı değildir

A, B’ye; B de C’ye atıf yapıyor olsun. A’dan C’ye iki kenarlı atıf yolu olduğunu söyleyebilirsiniz. A’nın C’ye katıldığını, C’nin doğru olduğunu veya A’nın doğrudan C’ye atıf yaptığını çıkaramazsınız. Geçerli çıkarım, anlamı bileşime izin veren kural gerektirir. Bulunan yol ile yolun gerçekten desteklediği önermeyi ayırın.

Benzer biçimde merkezilik, seçilmiş tanım altında bağlantısallığı ölçer. Popüler düğüme sık atıf yapılıp düğüm yanlış olabilir. PageRank’i doğruluk skoru yapmayın veya açık politika olmadan hoşunuza gitmeyen kaynağı bastırmasına izin vermeyin. Kaynak niteliği, ilgililik ve çizge görünürlüğü ayrı soruları yanıtlar.

## Maliyeti sınırlayın, eksikliği tanıyın

Ortalama dallanma 10 ise üç adım, tekrar ayıklamadan önce yaklaşık 10 + 100 + 1.000 komşu inceleyebilir. Merkez düğüm bunu büyütebilir. Başlangıç sayısı, adım derinliği, düğüm başına yayılım, toplam kenar bütçesi ve timeout belirleyin. Sınırlı arama geçerli yolu kaçırabilir; “ilişki yok” demek yerine kesilmeyi belirtin. Önbellek anahtarı erişim kapsamını ve kaynak neslini içermelidir.

GraphRAG çizge bilgisini kullanan retrieval destekli yaklaşımlar ailesidir. Edge ve arkadaşları veri kümesi genelindeki sorular için çizgeden türetilmiş topluluk özetleri açıklar. Bu, yerel soruda ham yol döndürmekten farklıdır. Özet üretimi, kaynak kapsamı ve güncelleme politikası değerlendirilecek yeni türetilmiş artefakt ekler. Kenarları çizge veritabanına yazmak tek başına o araştırma yöntemini uygulamaz. [GraphRAG makalesi](https://arxiv.org/abs/2404.16130).

## Bağlantı ile desteği ayırın

> [!EXERCISE]
> **Kendinizi sınayın**
> A, B’ye atıf yapıyor; B, C’yi eleştiriyor. Çizge yolu var diye asistan “A, C’yi destekliyor” diyebilir mi?
>
> **Answer:** Hayır. İlgiliyse türleri belirtilmiş yolu döndürüp kaynak pasajlarını inceleyin. Bu ilişki türleri destek sonucuna birleşmez. Çizge incelenecek zinciri açar; mantıksal anlamını icat etmez.

## Kaynaklar ve ileri okuma

1. [Edge et al. · From Local to Global: A Graph RAG Approach](https://arxiv.org/abs/2404.16130)
2. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

