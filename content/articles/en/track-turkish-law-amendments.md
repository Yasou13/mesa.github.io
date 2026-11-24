---
id: "degisiklik-takibi"
slug: "track-turkish-law-amendments"
type: "guide"
language: "en"
title: "How to Track Changes to a Turkish Law"
subtitle: ""
summary: "Consolidated texts mark each change with a note that names the amending law and article. Use those notes to find the amending law, its effective date and the old wording."
shortAnswer: "Read the bracketed notes in the consolidated text, open each amending law in the Resmî Gazete, check its yürürlük article, and record every change you checked with its source."
category: "Legal Research"
tags: ["Yargıtay", "mevzuat", "künye", "Resmî Gazete", "legal research"]
author: "MESA contributors"
publishedAt: "2026-11-24"
updatedAt: "2026-11-24"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "How to Track Changes to a Turkish Law — MESA Law"
seoDescription: "Read amendment notes in Turkish consolidated laws, find the amending law and its effective date, and keep a record of the changes you checked."
---

## How do you follow changes to a law?

Each change in a consolidated Turkish law is marked with a note that names the amending law and article. Follow each note to the amending law in the Resmî Gazete, check when it took effect, and keep a dated record of what you checked.

> [!WARNING]
> **Not legal advice**
> This guide explains how to read and check official sources. It is not legal advice. For a decision that affects rights or deadlines, consult a qualified lawyer.

## 1. Learn the note types

| Note type | Real example | What changed |
| --- | --- | --- |
| Değişik | (Değişik: 10/6/1994-4001/1 md.) | Wording replaced |
| Ek | (Ek: 29/12/2005-5444/2 md.) | Article or text added |
| Ek fıkra | (Ek fıkra:17/1/2019-7161/1 md.) | Paragraph added |
| Mülga | (Mülga: 2/7/2018 - KHK-703/185 md.) | Repealed, here by a decree-law |
| Combined | (Ek: 12/3/1985 - 3163/1 md.; Mülga son fıkra: 15/1/2009-5831/1 md.) | Added, then its last paragraph repealed |

Read the pattern as date, amending law number and article. In `6352/53`, 6352 is the law and 53 its article. Spacing varies between texts, as in `(Değişik:6/3/1981-2421/1 md.)`, so search for the law number rather than the exact string.

## 2. Open the amending law

Search for the amending law by number in [Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/) and open its [Resmî Gazete](https://www.resmigazete.gov.tr/) issue. The date in the note may not match: Law 6352’s notes show 2/7/2012, while its Resmî Gazete date is 05.07.2012, issue 28344.

Read the amending law’s yürürlük article. It can set different dates for different articles. [Checking whether an article was in force](/law/guides/kanun-maddesi-yururluk-tarihi/) explains these steps in detail.

## 3. Use the lists at the end of the text

- The effective-date list pairs each amending law or annulment ruling with the changed articles and their effective dates.
- The section on provisions that could not be incorporated (“İŞLENEMEYEN HÜKÜMLER”) holds rules in other laws that still affect this one.
- Annulment notes cite the Constitutional Court ruling by date, E. and K. numbers.

## 4. Keep a record

For each change, record the article, the note, the amending law, its Resmî Gazete date and issue, the effective date, and the date you checked. Keep a link or copy of each source. A record lets someone else repeat the check and shows when it needs updating.

```text
Article: 6325 md. 18
Note: amended by 7036
Amending law RG: (date, issue)
Effective: 25/10/2017 (list at end of 6325)
Checked: 2026-11-24, mevzuat.gov.tr
```

## Can MESA track amendments for me?

Not as a legal service. MESA 0.9.5 does not watch the Resmî Gazete or decide which version applies. It can keep every version you have checked: upload each one under the same `document_id` with `metadata.valid_from` set to the date it took effect. MESA orders versions by that date rather than by upload order, so you can add an older text later and it becomes history. A search with `valid_at` then returns the wording in force at that instant, and a search without a date returns the current version. See [checking an article in force on a date](/law/guides/yururluk-kontrolu/) for an example, and [how citations are extracted](/research/turkish-legal-citation-extraction/) for what MESA recognizes in legal text.

## Sources

1. [Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/)
2. [Resmî Gazete](https://www.resmigazete.gov.tr/)
3. [Constitution of the Republic of Türkiye on Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=2709&MevzuatTur=1&MevzuatTertip=5)

