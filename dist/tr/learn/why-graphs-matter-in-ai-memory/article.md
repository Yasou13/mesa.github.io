---
id: "why-graphs-matter"
slug: "why-graphs-matter-in-ai-memory"
type: "learn"
language: "tr"
title: "Bilgi çizgeleri: ilişkileri kaynaklarıyla izlemek"
subtitle: ""
summary: "Kaynakları belli bir çizge kurun ve iki adımlı bir soruyu çözün. Bir bağlantıyı bulmakla, o bağlantıdan geçerli bir sonuç çıkarmanın farkını görün."
shortAnswer: "Kaynakları belli bir çizge kurun ve iki adımlı bir soruyu çözün. Bir bağlantıyı bulmakla, o bağlantıdan geçerli bir sonuç çıkarmanın farkını görün."
category: "Memory & Retrieval"
tags: ["graph", "GraphRAG", "multi hop", "Kuzu", "knowledge graph", "çizge", "ilişki"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Bilgi çizgeleri: ilişkileri kaynaklarıyla izlemek — MESA"
seoDescription: "Kaynakları belli bir çizge kurun ve iki adımlı bir soruyu çözün. Bir bağlantıyı bulmakla, o bağlantıdan geçerli bir sonuç çıkarmanın farkını görün."
lessonOrder: 8
learningStage: "retrieval"
prerequisites: ["structured-vs-unstructured-memory", "hybrid-retrieval"]
learningObjectives: ["Varlık ve koşullu ilişki modellemek", "Sınırlı iki adımlı sorguyu izlemek", "Çizge yolunun yanıtı desteklemediğini görmek"]
---

## İlişkinin kimliğini ve dayanağını koruyun

Metin araması ilgili pasajları bulur; çizge araması ise açıkça kaydedilmiş ilişkileri izler. Kurgusal Atlas arşivinde okuma salonu, arşiv ve ilçe için düğümler; “parçasıdır” ve “bulunur” ilişkileri için bağlantılar kurun. Her düğüme sabit kimlik verin ve her ilişkiyi destekleyen kaynak sürümüne bağlayın. “Merkez” gibi bir ad, hangi varlıktan söz edildiğini tek başına belirlemez.

```text
room-7 --part_of [evidence: handbook-r3/c4]--> archive-2
archive-2 --located_in [evidence: directory-r1/c2]--> district-5
room-7 --opening_time [day: Friday; from: Nov 1]--> 10:00
```

İlişkinin yönü ve türü önemlidir. “A, B’yi yönetir” ile “B, A’yı yönetir” aynı değildir; “atıf yapar” da “katılır” anlamına gelmez. Anlamı etkileyen zaman, kapsam ve belirsizlik bilgisini koruyun. İki adın aynı paragrafta geçmesi, aralarında doğrulanmış bir ilişki kurmaz; yalnızca incelenebilecek bir ipucu olabilir.

## İki adımlı soruyu çözün

“7 numaralı salonun bağlı olduğu arşiv hangi ilçede?” sorusunu ele alın. Önce Salon 7’yi bulun; `part_of` bağlantısıyla Arşiv 2’ye, `located_in` bağlantısıyla İlçe 5’e gidin. İki ilişkinin kimliğini ve dayanak kaynaklarını da döndürün. Böylece yanıtın nasıl bulunduğu incelenebilir. Kaynaklardan biri eski, belirsiz veya isteği yapan kişiye kapalıysa tam yanıt o kullanıcı için desteklenmiş sayılmaz.

<!-- diagram: Okuma salonu arşive, ardından ilçeye bağlanır; her adım kaynak kimliğini korur. -->
1. Çöz · room-7
2. Adım 1 · part_of
3. Arşiv · archive-2
4. Adım 2 · located_in
5. Yanıt · district-5 + 2 kaynak

*İki kenar ancak ilişkiler ve kapsamlar geçerliyse desteklenen zincir olur.*

## Yol kendiliğinden çıkarım kuralı değildir

A, B’ye; B de C’ye atıf yapıyor olsun. A’dan C’ye iki kenarlı atıf yolu olduğunu söyleyebilirsiniz. A’nın C’ye katıldığını, C’nin doğru olduğunu veya A’nın doğrudan C’ye atıf yaptığını çıkaramazsınız. Geçerli çıkarım, anlamı bileşime izin veren kural gerektirir. Bulunan yol ile yolun gerçekten desteklediği önermeyi ayırın.

Merkezilik ölçüsü, bir düğümün seçilen kurala göre ne kadar bağlantılı olduğunu anlatır. Çok atıf alan bir düğüm yine de yanlış bilgi taşıyabilir. PageRank’i doğruluk puanı olarak kullanmayın. Hangi kaynakların neden geri plana alınacağını da açıkça tanımlayın. Kaynak güvenilirliği, sorguyla ilgililik ve çizgede görünürlük farklı ölçütlerdir.

## Maliyeti sınırlayın, eksikliği tanıyın

Her düğümden ortalama on bağlantı çıkıyorsa üç adımda, tekrarlar ayıklanmadan önce yaklaşık 10 + 100 + 1.000 komşu incelenebilir. Çok bağlantılı bir düğüm işi büyütür. Başlangıç sayısını, adım derinliğini, düğüm başına bağlantıyı, toplam bağlantı bütçesini ve zaman aşımını sınırlandırın. Bu sınırlar geçerli bir yolu da dışarıda bırakabilir. Böyle bir durumda “ilişki yok” demek yerine aramanın sınırda durduğunu belirtin. Önbellek anahtarı erişim kapsamını ve kaynakların hangi güncellemesine ait olduğunu içermelidir.

GraphRAG, çizge bilgisinden yararlanan ve aramayla desteklenen yaklaşımların genel adıdır. Edge ve arkadaşları, bütün veri kümesini ilgilendiren sorular için bağlantı gruplarından üretilmiş özetler kullanır. Bu, tek bir soruya ham bağlantı yolu döndürmekten farklıdır. Üretilen her özet için kaynak kapsamını ve güncelleme yöntemini ayrıca değerlendirmek gerekir. İlişkileri bir çizge veritabanına yazmak, tek başına makaledeki yöntemi uygulamak anlamına gelmez. [GraphRAG makalesi](https://arxiv.org/abs/2404.16130)

## Bağlantı ile desteği ayırın

> [!EXERCISE]
> **Kendinizi sınayın**
> A, B’ye atıf yapıyor; B, C’yi eleştiriyor. Çizge yolu var diye asistan “A, C’yi destekliyor” diyebilir mi?
>
> **Açıklama:** Hayır. İlgiliyse türleri belirtilmiş yolu döndürüp kaynak pasajlarını inceleyin. Bu ilişki türleri destek sonucuna birleşmez. Çizge incelenecek zinciri açar; mantıksal anlamını icat etmez.

## Kaynaklar ve ileri okuma

1. [Edge et al. · From Local to Global: A Graph RAG Approach](https://arxiv.org/abs/2404.16130)
2. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

