---
id: "bm25-turkish-prefix-matching"
slug: "bm25-turkish-prefix-matching"
type: "research"
language: "tr"
title: "Türkçe Metinlerde BM25 Neden Zorlanır?"
subtitle: "Tek hukuk sözcüğü, onlarca dizin terimi"
summary: "BM25 tam token eşleştirir; Türkçe ise sözcüklere ek getirir. 112 hukuk dev sorusundaki 873 sorgu teriminin 252’si kanıta yalnızca ortak önek üzerinden ulaştı."
shortAnswer: ""
category: "Retrieval Evaluation"
tags: ["bm25", "turkish", "tokenization", "legal-search"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-23"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Türkçe Metinlerde BM25 Neden Zorlanır?"
seoDescription: "Türkçe ekler tek sözcüğü onlarca dizin terimine böler. Sorunu hukuk metinlerinde ölçtük ve 5 karakterlik önek eşleştirmenin etkisini gösterdik."
---

## BM25 Türkçede neden zorlanır?

BM25 tam token’ları puanlar; Türkçe ise tek kökten çok sayıda token üretir. `sözleşme`, `sözleşmesinin` ve `sözleşmelerinde` üç ayrı dizin terimidir. Bu yüzden sorguda geçen biçim, metindeki öteki biçimleri kaçırabilir.

Bunu MESA’nın Türkçe hukuk benchmark’ında ölçtük. 112 yanıtlanabilir dev sorusundaki 873 uygun sorgu teriminin 290’ı doğru kanıtta birebir geçti, 252’si yalnızca ilk beş karakteriyle eşleşti, 331’i hiç eşleşmedi. Önek eşleştirme ortadaki grubu hedefler; ama ölçülen kazancı küçüktü: ilk 5’te net iki soru.

## Türkçe bir sözcüğün kaç biçimi olur?

141 Tier M belgesini MESA’nın kullandığı tokenizer ile dizinledik. 6 veya daha uzun terimleri ilk beş karakterlerine göre grupladık. Tokenizer çoğu aksanı kaldırdığı için `sözle`, dizinde `sozle` olarak saklanır.

| Tier M derlemi, 6+ karakterli terimler | Değer |
| --- | --- |
| Farklı terim | 26.664 |
| Beş karakterlik önek grubu | 5.144 |
| Grup başına ortanca biçim | 2 |
| 90. yüzdelik | 12 |
| 10 veya daha çok biçimli grup | 670 |
| 50 veya daha çok biçimli grup | 58 |
| En büyük grup | 191 |

| Önek | Derlemdeki biçim | Örnekler |
| --- | --- | --- |
| karar | 87 | kararı, kararın, kararlarına, kararnamenin |
| yonet | 55 | yönetim, yönetmelik, yönetmeliğin, yönetici |
| sozle | 44 | sözleşme, sözleşmesinin, sözleşmelerinde |
| yargı | 41 | yargıtay, yargılama, yargısal |
| madde | 39 | maddesi, maddesinde, maddelerine |
| mahke | 38 | mahkemesi, mahkemece, mahkemelerinin |

Önek gruplarının çoğu küçüktür. Sorun sık kullanılan hukuk sözcüklerinde yoğunlaşır; hukuk sorguları da tam olarak bu sözcükleri kullanır.

## Sorgu sözcükleri kanıtı ne sıklıkla kaçırıyor?

| Dev kategorisi, uygun sorgu terimleri | Kanıtta birebir | Yalnızca önek | Eşleşme yok |
| --- | --- | --- | --- |
| Birebir ifade | 95 | 66 | 91 |
| Sayı, tarih, esas no | 88 | 85 | 93 |
| Yeniden ifade | 63 | 61 | 119 |
| Çok belgeli | 44 | 40 | 28 |
| Toplam | 290 | 252 | 331 |

112 yanıtlanabilir sorunun 102’sinde en az bir sorgu terimi kanıta yalnızca öneki üzerinden ulaştı. En büyük eşleşmeme grubu yeniden ifade sorularında: 243 terimin 119’u. Önek burada işe yaramaz, çünkü sözcükler farklıdır. [Anlamsal arama](/learn/semantic-search/) ve [hibrit arama](/learn/hybrid-retrieval-explained/) bu noktada devreye girer.

## MESA’da önek eşleştirme nasıl çalışıyor?

MESA 0.9.4 basit bir kural kullanır. 6 veya daha uzun olan ve rakam içermeyen sorgu token’ı beş karaktere kısaltılır ve önek olarak aranır. Daha kısa token’lar ile rakamlı token’lar birebir kalır; böylece `6098`, `60981` ile eşleşmez.

Aynı FTS5 tokenizer ayarlarıyla bu davranışı Python’un standart kütüphanesinde görebilirsiniz:

```text
import sqlite3

db = sqlite3.connect(":memory:")
db.execute("""CREATE VIRTUAL TABLE docs USING fts5(
    text, tokenize='unicode61 remove_diacritics 2', prefix='5')""")
rows = ["Yargıtay kararı", "YARGITAY KARARI", "sözleşmesinin feshi", "sözlerini söyledi"]
db.executemany("INSERT INTO docs VALUES (?)", [(r,) for r in rows])

for query in ['"sözleşme"', '"sözle"*', '"yargı"*', '"yargi"*']:
    hits = [r[0] for r in db.execute("SELECT text FROM docs WHERE docs MATCH ?", (query,))]
    print(query, "->", hits)
```

```text
"sözleşme" -> []
"sözle"* -> ['sözleşmesinin feshi', 'sözlerini söyledi']
"yargı"* -> ['Yargıtay kararı']
"yargi"* -> ['YARGITAY KARARI']
```

Çıktı kuralın iki yüzünü gösteriyor. `sözle*`, birebir terimin kaçırdığı `sözleşmesinin` biçimini bulur. Ama sözleşmeyle ilgisi olmayan `sözlerini` sözcüğünü de bulur.

## ı ve İ neden ayrı bir sorun?

Türkçede noktalı ve noktasız i vardır. Yukarıdaki çıktıda `yargı*`, `Yargıtay` biçimini bulur ama `YARGITAY` biçimini bulmaz; çünkü tokenizer `I` harfini `ı` yerine `i` yapar.

MESA bunun bir bölümünü sorgu anında çözer. Türkçe büyük-küçük harfi normalize eder, sonra hem `ı` biçimini hem `i` varyantını arar. Böylece `Yargıtay` ve `YARGITAY` sorguları iki yazımı da bulur. ASCII `yargitay` sorgusu ise `Yargıtay` metnini hâlâ bulamaz; çünkü 0.9.4’te dizin tarafında Türkçe harf katlama yoktur.

## Önek eşleştirme gerçekte neyi değiştirdi?

Modeller kapalıyken ortak depoda önek eşleştirme, dev Hit@5’i 50/112’den 52/112’ye taşıdı (0.9.4 öncesi derleme, benchmark v2, Tier M). Altı soru ilk 5 sınırını geçti:

| Kategori | Sıra önce → sonra | Etki | Kanıtta yalnızca önekle eşleşen terim |
| --- | --- | --- | --- |
| Sayı, tarih, esas no | 6 → 5 | Kazanç | 2 |
| Çok belgeli | 6 → 5 | Kazanç | 7 |
| Sayı, tarih, esas no | 6 → 5 | Kazanç | 3 |
| Yeniden ifade | 38 → 4 | Kazanç | 0 |
| Birebir ifade | 5 → 8 | Kayıp | 1 |
| Sayı, tarih, esas no | 4 → 11 | Kayıp | 5 |

Üç kazanç tek sıralık hareketti. En büyük kazancın kanıtında yalnızca önekle eşleşen terim yoktu; iyileşme büyük olasılıkla rakip pasajların sırası değiştiği için dolaylı geldi. İki kayıpta da bu tür terimler vardı. Yani böyle bir terimin varlığı, sorunun iyileşeceğini göstermiyor.

[0.9.4 kalite yazısı](/research/what-improved-search-in-0-9-4/), daha büyük kazançların birleştirme ağırlıklarını değiştirmekten geldiğini gösteriyor.

## Türkçe arama için ne yapmalısınız?

- Kök bulucu (stemmer) eklemeden önce ölçün. Fazla eşleşme, kazandırdığı kadar kaybettirebilir.
- Rakamlı token’ları birebir tutun. Kanun, esas numaraları ve tarihler önekle eşleşmemelidir.
- ı ve İ harflerini açıkça ele alın. Varsayılan Unicode küçük harf dönüşümü Türkçe için yanlıştır.
- Sözcük tabanlı aramayı gömme vektörleriyle birleştirin; çünkü birçok sorgu sözcüğü kanıtta hiç geçmez.
- Yalnızca ortalamayı değil, soru başına sırayı karşılaştırın.

## Bu analiz neyi gösteremez?

- Her sorgu terimini tüm aday pasajlarla değil, doğru yanıtın kanıt aralığıyla karşılaştırır.
- MESA’nın atıf token’larını süzme adımını uygulamaz; atıf yoğun sorularda sayılar yaklaşıktır.
- Gerçek bir Türkçe kök bulucu veya biçimbilimsel çözümleyici denemedik.
- 112 soruda net iki soruluk değişim küçüktür; başka bir örneklemde korunmayabilir.
- Derlem hukuk metinlerinden oluşuyor; genel Türkçe farklı davranabilir.

## Kaynaklar

1. [SQLite FTS5 belgeleri](https://www.sqlite.org/fts5.html)
2. [Manning, Raghavan ve Schütze: Okapi BM25](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html)
3. [MESA 0.9.4 değişiklik günlüğü](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)

