---
id: "yururluk-kontrolu"
slug: "check-law-in-force-on-date"
type: "guide"
language: "en"
title: "Was a Turkish Law Article in Force on a Given Date?"
subtitle: ""
summary: "Publication is not the same as entry into force. Check the yürürlük article, every amendment note on the article, the effective-date list and any Constitutional Court ruling."
shortAnswer: "Find the law on mevzuat.gov.tr, read its yürürlük article, check the notes on the article you need, read the effective-date list at the end of the text and check for Constitutional Court annulments. Then confirm in the Resmî Gazete."
category: "Legal Research"
tags: ["Yargıtay", "mevzuat", "künye", "Resmî Gazete", "legal research"]
author: "MESA contributors"
publishedAt: "2026-11-24"
updatedAt: "2026-11-24"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "Was a Turkish Law in Force on a Date? — MESA Law"
seoDescription: "Check whether a Turkish law article applied on a date: the yürürlük article, amendment notes, the effective-date list and Constitutional Court rulings."
---

## How do you check whether an article was in force?

A law can be published on one date and apply from another, and each article can change separately. To know whether an article applied on a given date, check five things: the law’s own yürürlük article, the notes on that article, the effective-date list at the end of the consolidated text, any Constitutional Court annulment, and the Resmî Gazete.

> [!WARNING]
> **Not legal advice**
> This guide explains how to read and check official sources. It is not legal advice. For a decision that affects rights or deadlines, consult a qualified lawyer.

## 1. Read the law’s header

Consolidated texts on [Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/) start with the law’s number, adoption date and Resmî Gazete issue. For the Turkish Code of Obligations:

```text
Kanun Numarası: 6098
Kabul Tarihi: 11/1/2011
Yayımlandığı Resmî Gazete: Tarih: 4/2/2011 Sayı: 27836
```

The adoption date and the publication date are different. Neither tells you yet when the law took effect.

## 2. Read the yürürlük article

Near the end of each law, an article titled “Yürürlük” sets the effective date. Law 6098 was published on 4/2/2011, but its article 648 says: “Bu Kanun 1 Temmuz 2012 tarihinde yürürlüğe girer.”

Different articles can start on different dates. Law 6325 on mediation, published on 22/6/2012, says in article 37 that articles 28 to 32 and the transitional articles took effect on publication, and the other provisions one year after publication.

## 3. Check the notes on the article

Consolidated texts mark later changes in brackets. These are real notes from official texts:

| Note | Meaning |
| --- | --- |
| (Değişik: 2/7/2012-6352/53 md.) | Amended by article 53 of Law 6352 |
| (Ek: 3/5/2012-6302/3 md.) | Added by article 3 of Law 6302 |
| (Mülga: 18/6/2014-6545/103 md.) | Repealed by article 103 of Law 6545 |
| (Ek fıkra:4/3/2021-7292/19 md.) | A paragraph added by Law 7292 |

> [!WARNING]
> **The date in a note is not the effective date**
> For Law 6352, the note shows 2/7/2012, but Mevzuat Bilgi Sistemi lists its Resmî Gazete date as 05.07.2012 (issue 28344). Check the amending law’s own yürürlük article for the date it took effect.

## 4. Read the effective-date list

Many consolidated texts end with a list titled “… EK VE DEĞİŞİKLİK GETİREN MEVZUATIN VEYA ANAYASA MAHKEMESİ İPTAL KARARLARININ YÜRÜRLÜĞE GİRİŞ TARİHLERİNİ GÖSTERİR LİSTE”. It pairs each amending law with the articles it changed and their effective dates. For Law 6325, one row reads:

```text
7036    2, 4, 6, 8, 13, 15, 17, 18, 20, 28, 31, 36    25/10/2017
```

In the 31 consolidated law texts in our test corpus, 27 contained this list. When it is missing, read each amending law.

## 5. Check for a Constitutional Court annulment

An annulment note names the ruling, for example: “Anayasa Mahkemesinin 5/6/2008 tarihli ve E.: 2008/16, K.: 2008/116 sayılı Kararı ile iptal edilmiştir.”

Article 153 of the Constitution says annulled provisions cease to apply on the date the ruling is published in the Resmî Gazete. The Court can set a later date, at most one year after publication, and annulment rulings do not apply retroactively. So check the ruling’s own publication date and any deferral it sets.

## Can an article be in force and still not apply?

Yes. Transitional rules can suspend an article for certain cases. The consolidated text of Law 6098 lists, under “6098 SAYILI KANUNA İŞLENEMEYEN HÜKÜMLER”, a provision of Law 6217 under which certain articles of the Code did not apply for 8 years from 1/7/2012 to commercial leases where the tenant is a merchant or a legal person. Read these sections and the transitional articles (geçici maddeler).

## How do you read the earlier wording?

The consolidated text shows the current wording with notes. To read the wording that applied on an earlier date, open the original law and each amending law in the [Resmî Gazete](https://www.resmigazete.gov.tr/). Check the date range you need against each change. Record the sources you used.

## Can MESA answer this question?

Partly. MESA 0.9.5 does not decide when an article took effect: transitional rules, deferred commencement and annulments still have to be checked against the official sources above. What it can do is store each version you have checked and return the wording that was in force at an instant you give.

Upload every version of the article under the same `document_id`, with the date you established as a timezone-aware `metadata.valid_from`. Versions can be uploaded in any order. Then search with `valid_at`. This example uses a fictional rule from the Core documentation:

```text
from mesa_client import Mesa

mesa = Mesa()
for start, days in [("2025-06-01T00:00:00+03:00", 30), ("2024-01-01T00:00:00+03:00", 15)]:
    mesa.add(
        f"MADDE 1 - Arşiv başvuru süresi {days} gündür.",
        source=f"file://arsiv-{start[:10]}.txt",
        document_id="ornek-arsiv-yonetmeligi",
        title="Örnek Arşiv Yönetmeliği",
        metadata={"valid_from": start},
        wait=True,
    )

hit = mesa.search("Arşiv başvuru süresi", valid_at="2025-05-31T23:59:59+03:00")[0]
print(hit["evidence_span"])  # MADDE 1 - Arşiv başvuru süresi 15 gündür.
```

Intervals are half-open: at exactly `2025-06-01T00:00:00+03:00` the search returns the 30-day version, and one second earlier it returns the 15-day version. Results carry `revision_number`, `valid_from` and `valid_to`, so you can see which version answered. If the `valid_from` you entered is wrong, the answer is wrong too. See [versioned documents](/docs/core/concepts-and-ingestion/#guide-versioned-documents), and [how to track amendments](/law/guides/kanun-degisiklikleri-takip/) for following later changes.

## Sources

1. [Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/)
2. [Resmî Gazete](https://www.resmigazete.gov.tr/)
3. [Türkiye Cumhuriyeti Anayasası on Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=2709&MevzuatTur=1&MevzuatTertip=5)

