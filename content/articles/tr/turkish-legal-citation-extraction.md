---
id: "turkish-legal-citation-extraction"
slug: "turkish-legal-citation-extraction"
type: "research"
language: "tr"
title: "Hukuki Atıflar Kurallarla Nasıl Çıkarılır?"
subtitle: "Kurallar neyi buluyor, ne kadar doğru, nerede yanılıyor?"
summary: "MESA’nın kural çıkarıcısı, model kullanmadan altı tür hukuki öğe bulur. 150 etiketli parçada 357 doğru öğe buldu; 25 yanlış sonuç verdi, 18 öğeyi kaçırdı."
shortAnswer: ""
category: "Retrieval Evaluation"
tags: ["legal-search", "citations", "extraction", "turkish"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-23"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Hukuki Atıflar Kurallarla Nasıl Çıkarılır?"
seoDescription: "MESA’nın Türkçe hukuk kural çıkarıcısını 150 etiketli parçada ölçtük: 357 doğru, 25 yanlış, 18 eksik öğe. Zayıf noktaları da gösteriyoruz."
---

## MESA Türkçe hukuki atıfları nasıl çıkarıyor?

MESA 0.9.4, dil modeli yerine elle yazılmış kurallar kullanır. Kurallar her parçada altı tür öğe arar: kanun atıfları, karar künyeleri, tarihler, tutarlar, süreler ve karar sonuçları. Her öğe, kaynak metindeki tam karakter konumunu korur.

Yayımlanan çıkarıcıyı 50’şer parçalık üç etiketli kümede puanladık. 150 parçanın tamamında 357 doğru öğe buldu, 25 yanlış sonuç üretti ve 18 öğeyi kaçırdı. En zayıf noktaları bir kümede atıf kesinliği (0,8222), başka bir kümede süre kesinliği (0,6957) oldu.

> [!WARNING]
> **Hukuki tavsiye değildir**
> Bu yazı bir yazılım ölçümünü anlatır. Bulunan bir atıf yine de yanlış, yürürlükten kalkmış veya ilgisiz olabilir. Hukuki kaynakları kendiniz denetleyin; hukuki kararlar için yetkin bir avukata danışın.

## Çıkarıcı ne döndürüyor?

Bu örnek, yayımlanan `mesa-memory` 0.9.4 paketiyle çalışır. Cümle örnek amaçlıdır.

```text
from mesa_storage.legal_rules import extract_all_rules

text = ("6098 sayılı Kanunun 49. maddesi uyarınca dava 15 gün içinde açılır. "
        "Ceza Genel Kurulunun 28/11/2017 tarihli ve 2016/1307 E., 2017/551 K. "
        "sayılı kararı. Davacıya 5.000 TL ödenmesine, hükmün ONANMASINA karar verildi.")

for item in extract_all_rules(text):
    print(item["type"], "|", item["text"], "|", item["start"], item["end"])
```

```text
citation | 6098 sayılı Kanunun 49. maddesi | 0 31
duration | 15 gün | 46 52
decision_ref | Ceza Genel Kurulunun 28/11/2017 tarihli ve 2016/1307 E., 2017/551 K | 68 135
amount | 5.000 TL | 161 169
outcome | ONANMASINA | 189 199
```

Çıkarıcı değerleri de normalize eder. Bu metin için `2016/1307` esas, `2017/551` karar, `2017-11-28` tarih ve `5000` tutar döndürdü. `ONANMASINA` sonucu `onama` oldu.

## Türkçe hukuki atıflar neden zor ayrıştırılır?

- Kanun atıfları `6098 sayılı Kanun` biçiminde, adıyla veya `TBK m. 49` gibi kısaltmayla yazılır.
- Karar künyesi `E.` ve `K.` ile ya da kısa biçimde `tarihli ve 54-280 sayılı` olarak geçebilir.
- Ekler mahkeme adlarını değiştirir: `Mahkemesi`, `Mahkemesince`, `Dairesinin`.
- Karar künyesi veya değişiklik notu içindeki tarihler ayrı tarih sayılmamalıdır.
- OCR sayıları bölebilir. Etiketli verimizde, kanun numarasının içinde boşluk bulunan `50 6 sayılı` ifadesi var.

## Ne kadar doğru çalışıyor?

Bir tahmin, etiketli öğeyle aynı türdeyse ve karakter aralıklarının kesişim/birleşim oranı (IoU) en az 0,5 ise doğru sayılır. Her etiket yalnızca bir tahminle eşleşebilir.

| MESA 0.9.4, küme başına 50 parça | Doğru | Yanlış | Eksik | Kesinlik | Duyarlılık | F1 |
| --- | --- | --- | --- | --- | --- | --- |
| 1. küme (geliştirmede de kullanıldı) | 125 | 2 | 14 | 0,9843 | 0,8993 | 0,9398 |
| 2. küme | 115 | 11 | 2 | 0,9127 | 0,9829 | 0,9465 |
| 3. küme | 117 | 12 | 2 | 0,9070 | 0,9832 | 0,9435 |

| Öğe türü, 150 parçanın tamamı | Doğru | Yanlış | Eksik | Kesinlik | Duyarlılık |
| --- | --- | --- | --- | --- | --- |
| Kanun atfı | 132 | 13 | 14 | 0,9103 | 0,9041 |
| Karar künyesi | 38 | 0 | 0 | 1,0000 | 1,0000 |
| Tarih | 72 | 2 | 3 | 0,9730 | 0,9600 |
| Tutar | 33 | 0 | 1 | 1,0000 | 0,9706 |
| Süre | 74 | 10 | 0 | 0,8810 | 1,0000 |
| Karar sonucu | 8 | 0 | 0 | 1,0000 | 1,0000 |

Küçük gruplardaki tam puanları dikkatle okuyun. Karar sonucunda yalnızca 8, karar künyesinde 38 etiketli öğe var.

## Çıkarım aramaya yardımcı oldu mu?

İlk prototip, MESA 0.9.1’in dışına bir atıf dizini ekledi. Şablonla üretilmiş 50 atıf sorusunda pasaj Hit@5, 8/50’den 50/50’ye çıktı. Eski dev kümesindeki 85 yanıtlanabilir soruda Hit@5 28/85’te kaldı.

MESA 0.9.2 ardından tam eşleşme desteğiyle yayımlandı. Modeller kapalıyken şablon kümesinde 50/50, doğal dille yazılmış atıf kümesinde 39/40 Hit@5 aldı. Bu kümeler dardır: şablon soruları atfı doğrudan söylediği için anlamadan çok aramayı sınar.

Genel arama tablosu için [MESA 0.9.4’te Arama Kalitesini Ne Artırdı?](/research/what-improved-search-in-0-9-4/) yazısını okuyun.

## Çıkarılan atıfları nasıl kullanmalısınız?

1. Çıkarılan öğeyi kaynağa giden bir işaret olarak görün.
2. Kaynak metindeki tam aralığı açıp çevresini okuyun.
3. Kanunu [mevzuat.gov.tr](https://www.mevzuat.gov.tr/) üzerinden, kararı [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/) veya [UYAP Emsal](https://emsal.uyap.gov.tr/) üzerinden denetleyin.
4. Hükmün ilgili tarihte uygulanıp uygulanmadığını doğrulayın.

[Yapay zekânın gösterdiği Yargıtay kararını doğrulama rehberimiz](/law/guides/yapay-zeka-yargitay-karari-dogrulama/) bu adımları anlatır. [Yapay zekâ atıf hataları rehberi](/law/guides/yapay-zeka-hukuk-atif-hatalari/) neye bakacağınızı listeler.

## Bu sonuç neyi gösteremez?

- Örneklem tek derlemden 150 parçadır.
- 1. küme geliştirme sırasında kullanıldı. 2. ve 3. kümelerin sonraki değişikliklerden bağımsız kaldığını gösteremiyoruz.
- Kuralları bir LLM ile karşılaştırmadık; bu yazı kuralların modellerden iyi olduğunu savunmuyor.
- Çıkarıcı, atfın var olduğunu, güncel olduğunu veya iddiayı desteklediğini denetlemez.
- MESA 0.9.4, belirli bir tarihte yürürlükte olma sorularını yanıtlamaz.

## Kaynaklar

1. [MESA hukuk kuralları kaynağı, v0.9.4](https://github.com/Yasou13/MESA/blob/v0.9.4/mesa_storage/legal_rules.py)
2. [MESA 0.9.4 değişiklik günlüğü](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
3. [Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/)
4. [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/)
5. [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/)

