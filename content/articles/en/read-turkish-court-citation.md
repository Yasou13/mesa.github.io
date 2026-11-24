---
id: "kunye-okuma"
slug: "read-turkish-court-citation"
type: "guide"
language: "en"
title: "How to Read a Turkish Court Citation"
subtitle: ""
summary: "A Yargıtay citation names the court or chamber, an esas (E.) number, a karar (K.) number and a date. Match all of them before you rely on a decision."
shortAnswer: "Read the court or chamber first, then the esas (E.) number, then the karar (K.) number, then the decision date. Two decisions can share a number in different chambers or years, so all parts must match."
category: "Legal Research"
tags: ["Yargıtay", "mevzuat", "künye", "Resmî Gazete", "legal research"]
author: "MESA contributors"
publishedAt: "2026-11-24"
updatedAt: "2026-11-24"
readingMinutes: 6
status: "published"
indexable: true
seoTitle: "How to Read a Turkish Court Citation — MESA Law"
seoDescription: "Read a Yargıtay citation: chamber, esas (E.) and karar (K.) numbers, decision date and short forms, with real examples from official decision texts."
---

## What does a Yargıtay citation contain?

A Yargıtay citation (künye) identifies one decision with four parts: the court or chamber, the esas number, the karar number and the decision date. A complete example from an official decision text is:

> [!NOTE]
> **Example**
> Yargıtay Ceza Genel Kurulu, 2017/885 E., 2021/693 K., 29.12.2021

> [!WARNING]
> **Not legal advice**
> This guide explains how to read and check official sources. It is not legal advice. For a decision that affects rights or deadlines, consult a qualified lawyer.

## What does each part mean?

| Part | In the example | What it tells you |
| --- | --- | --- |
| Court or chamber | Ceza Genel Kurulu | Which body decided. Chambers are numbered, such as 12. Ceza Dairesi or 3. Hukuk Dairesi. |
| Esas number (E.) | 2017/885 | The file number: the year the file was registered and its sequence number. |
| Karar number (K.) | 2021/693 | The decision number: the year of the decision and its sequence number. |
| Date | 29.12.2021 | The day of the decision. The text above ends with “29.12.2021 tarihinde yapılan müzakerede oy birliğiyle karar verildi”. |

Numbers are counted per court or chamber, so `2017/885 E.` can exist in many chambers. Never match on one number alone.

## Which abbreviations appear most often?

| Abbreviation | Meaning |
| --- | --- |
| HGK | Hukuk Genel Kurulu (Civil General Assembly) |
| CGK | Ceza Genel Kurulu (Criminal General Assembly) |
| İBK | İçtihadı Birleştirme Kurulu (Assembly for unifying case law) |
| E. / K. | Esas / Karar |
| HD / CD | Hukuk Dairesi / Ceza Dairesi, as in 3. HD or 12. CD |

## How do short forms and earlier decisions appear?

Decision texts often refer to earlier decisions in a shorter form. These lines come from the same official texts:

- `Kararı veren Yargıtay Dairesi: 12. Ceza Dairesi` and `Sayısı: 131-288` give the chamber and the numbers of the earlier decision under review, without years.
- `20.02.2019 tarih ve 84-14 sayı ile` refers to a decision by date and short numbers.
- `28/11/2017 gün ve 2016/1307 Esas, 2017/9551 Karar` spells the words out instead of using E. and K.

A short form is not enough to find a decision. Use it to locate the full citation in the decision text.

## How do you check a citation?

1. Write down the court or chamber, E. number, K. number and date exactly as given.
2. Search for the decision in [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/) or [UYAP Emsal](https://emsal.uyap.gov.tr/).
3. Confirm that all four parts match the decision you found.
4. Read the full text and check that it supports the claim.

The guide on [verifying an AI-cited Yargıtay decision](/law/guides/yapay-zeka-yargitay-karari-dogrulama/) covers the full process. [Common AI citation errors](/law/guides/yapay-zeka-hukuk-atif-hatalari/) shows what usually goes wrong.

## What can MESA do with citations?

MESA 0.9.4 recognizes decision references in Turkish text. In our labeled test it found all 38 labeled decision references across 150 chunks, with no false positives. It does not check whether a decision exists or supports a claim. See [how the extraction was measured](/research/turkish-legal-citation-extraction/).

## Sources

1. [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/)
2. [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/)
3. [Yargıtay](https://www.yargitay.gov.tr/)

