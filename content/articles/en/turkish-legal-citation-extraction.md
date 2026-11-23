---
id: "turkish-legal-citation-extraction"
slug: "turkish-legal-citation-extraction"
type: "research"
language: "en"
title: "How Rule-Based Turkish Citation Extraction Works"
subtitle: "What the rules find, how often they are right, and where they fail"
summary: "MESA's rule extractor finds six kinds of legal item without a model. On 150 labeled chunks it found 357 correct items, with 25 false positives and 18 misses."
shortAnswer: ""
category: "Retrieval Evaluation"
tags: ["legal-search", "citations", "extraction", "turkish"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-23"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "How Rule-Based Turkish Citation Extraction Works"
seoDescription: "We scored MESA's Turkish legal rule extractor on 150 labeled chunks: 357 correct items, 25 false positives and 18 misses, with weak spots shown."
---

## How does MESA extract Turkish legal citations?

MESA 0.9.4 uses hand-written rules, with no language model. The rules find six item types in each chunk: law citations, decision references, dates, amounts, durations and outcomes. Each item keeps its exact character position in the source text.

We scored the released extractor on three labeled sets of 50 chunks. Across all 150 chunks it found 357 correct items, produced 25 false positives and missed 18. Its weakest areas were citation precision on one set (0.8222) and duration precision on another (0.6957).

> [!WARNING]
> **Not legal advice**
> This post explains a software measurement. A detected citation may still be wrong, repealed or irrelevant. Check legal sources yourself and consult a qualified lawyer for legal decisions.

## What does the extractor return?

This example runs against the released `mesa-memory` 0.9.4 package. The sentence is illustrative.

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

The extractor also normalizes values. It returned docket `2016/1307`, decision `2017/551`, date `2017-11-28` and amount `5000` for this text. The outcome `ONANMASINA` became `onama`.

## Why are Turkish legal citations hard to parse?

- Law references appear as `6098 sayılı Kanun`, by name, or by abbreviation such as `TBK m. 49`.
- A decision can be written with `E.` and `K.`, or in short form as `tarihli ve 54-280 sayılı`.
- Suffixes change court names: `Mahkemesi`, `Mahkemesince`, `Dairesinin`.
- Dates inside a decision reference or an amendment note must not count as separate dates.
- OCR can split numbers. Our labeled data includes `50 6 sayılı`, with a space inside a law number.

## How accurate is it?

A predicted item counts as correct when it has the same type as a labeled item and their character spans overlap by an intersection-over-union of at least 0.5. Each label can match only one prediction.

| MESA 0.9.4, 50 chunks per set | Correct | False | Missed | Precision | Recall | F1 |
| --- | --- | --- | --- | --- | --- | --- |
| Set 1 (also used in development) | 125 | 2 | 14 | 0.9843 | 0.8993 | 0.9398 |
| Set 2 | 115 | 11 | 2 | 0.9127 | 0.9829 | 0.9465 |
| Set 3 | 117 | 12 | 2 | 0.9070 | 0.9832 | 0.9435 |

| Item type, all 150 chunks | Correct | False | Missed | Precision | Recall |
| --- | --- | --- | --- | --- | --- |
| Citation | 132 | 13 | 14 | 0.9103 | 0.9041 |
| Decision reference | 38 | 0 | 0 | 1.0000 | 1.0000 |
| Date | 72 | 2 | 3 | 0.9730 | 0.9600 |
| Amount | 33 | 0 | 1 | 1.0000 | 0.9706 |
| Duration | 74 | 10 | 0 | 0.8810 | 1.0000 |
| Outcome | 8 | 0 | 0 | 1.0000 | 1.0000 |

Perfect scores on small groups need care. Outcome has only 8 labeled items, and decision reference has 38.

## Did extraction help search?

An early prototype added a citation index outside MESA 0.9.1. On 50 template-generated citation questions, passage Hit@5 rose from 8/50 to 50/50. On 85 answerable questions from the older dev set, Hit@5 stayed at 28/85.

MESA 0.9.2 then shipped exact-match handling. With models off, it reached Hit@5 of 50/50 on the template set and 39/40 on a natural-language citation set. These sets are narrow: template questions name the citation directly, so they test lookup more than understanding.

For the general search picture, read [What Improved MESA Search Quality in 0.9.4](/research/what-improved-search-in-0-9-4/).

## How should you use extracted citations?

1. Treat an extracted item as a pointer to the source.
2. Open the exact source span and read the surrounding text.
3. Check the law on [mevzuat.gov.tr](https://www.mevzuat.gov.tr/) and decisions on [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/) or [UYAP Emsal](https://emsal.uyap.gov.tr/).
4. Confirm that the provision applied on the relevant date.

Our guide on [verifying an AI-cited Yargıtay decision](/law/guides/yapay-zeka-yargitay-karari-dogrulama/) walks through these checks, and [common AI citation errors](/law/guides/yapay-zeka-hukuk-atif-hatalari/) lists what to look for.

## What can this result not show?

- The sample is 150 chunks from one corpus.
- Set 1 was used during development. We cannot show that sets 2 and 3 remained independent of later changes.
- We did not compare these rules with an LLM, so this post makes no claim that rules beat models.
- The extractor does not check that a citation exists, is current or supports a claim.
- MESA 0.9.4 does not answer in-force-on-date questions.

## Sources

1. [MESA legal rules source, v0.9.4](https://github.com/Yasou13/MESA/blob/v0.9.4/mesa_storage/legal_rules.py)
2. [MESA 0.9.4 changelog](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
3. [Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/)
4. [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/)
5. [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/)

