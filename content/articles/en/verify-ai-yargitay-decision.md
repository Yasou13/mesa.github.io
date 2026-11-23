---
id: "verify-ai-yargitay"
slug: "verify-ai-yargitay-decision"
type: "guide"
language: "en"
title: "How do you verify an AI-cited Yargıtay decision?"
subtitle: ""
summary: "Treat the citation as an unverified lead until its identity, official text, quoted passage and legal fit are checked."
shortAnswer: "Search the decision yourself in Yargıtay Karar Arama using its chamber, docket number, decision number and date. Then read the full text, find the quoted passage and check whether the decision really supports the claim. A decision that exists can still be the wrong authority."
category: "Legal Research"
tags: ["legal-research", "verification", "provenance"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-11-23"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "How to Verify an AI-Cited Yargıtay Decision — MESA Law"
seoDescription: "Check an AI-cited Yargıtay decision step by step: find it in the official search, match its numbers, read the full text and test whether it supports the claim."
---

## Why an AI citation needs checking

A language model can produce a citation that looks correct while its number, chamber, date or quotation is wrong. According to [press reports](https://memurlar.net/haber/1170388/), an investigation was opened in Türkiye after Yargıtay decisions added to a petition with AI had incorrect docket and decision numbers.

> [!NOTE]
> **Scope of this guide**
> This guide explains a checking method and is not legal advice. MESA Law is a reference application and does not verify decisions for you. The lawyer or person relying on a citation remains responsible for checking it.

## 1. Capture the exact claim

Before searching, save exactly what the AI gave you. Do not correct or complete it yet, because the differences are part of the check.

- Court, board or chamber
- Docket (E.) and decision (K.) numbers
- Decision date
- Quoted passage, word for word
- The legal conclusion the AI drew from the decision

Missing identifiers are a warning, not an invitation to guess.

## 2. Search the official source

Open [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/) and use DETAYLI ARAMA. The form has fields for keyword, boards, civil chambers, criminal chambers, docket number, decision number and decision date.

1. Select the stated board or chamber.
2. Enter the docket number and search.
3. If nothing appears, search by decision number.
4. Then search a distinctive phrase from the quotation without any numbers.
5. Record what you searched and the date.

For regional appeal and first-instance civil decisions, use [UYAP Emsal Karar Arama](/law/guides/uyap-emsal-karar-dogrulama/).

## 3. Match identity and text

| Check | What must match |
| --- | --- |
| Court | Same board or chamber |
| Docket | Same year and sequence number |
| Decision | Same year and sequence number |
| Date | Same day, month and year |
| Quotation | Same words, in the same context |

If only some fields match, do not repair the citation yourself and continue. It may point to a different decision.

> [!NOTE]
> **What we measured in MESA**
> Software can find a citation but cannot confirm it. [MESA's rule extractor](/research/turkish-legal-citation-extraction/) recognized decision references in labeled chunks, yet it does not check whether a decision exists.

## 4. Assess legal fit

> [!WARNING]
> **Existence is not relevance**
> A real decision can still be factually distinguishable, superseded, exceptional, or unrelated to the proposed conclusion.

Read the full decision. Identify the dispute, material facts, reasoning, result and procedural posture. Check whether the quoted sentence is the court’s own reasoning or a summary of a party’s argument or a lower court’s view. Then look for later or contrary decisions.

## If you cannot find the decision

Do not rely on it. A failed search does not prove by itself that the decision was invented, because a database may not contain every decision and numbers can be mistyped. Ask for a copy from the source that supplied it, check another reliable database, or remove the citation.

## 5. Record the verification trail

- [ ] Stable source or saved copy
- [ ] Identifiers and access date
- [ ] Exact supporting passage
- [ ] Reason the passage is relevant
- [ ] Contrary or limiting authority
- [ ] Reviewer and review date when the workflow requires one

## Sources

1. [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/)
2. [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/)
3. [Memurlar.net · Report on the AI-generated citation investigation](https://memurlar.net/haber/1170388/)

