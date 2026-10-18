---
id: "bm25-tuning-for-domain-documents"
slug: "bm25-tuning-for-domain-documents"
type: "learn"
language: "en"
title: "BM25: why a rare word can beat repeated words"
subtitle: ""
summary: "Work through term frequency, rarity and length normalization. Tune tokenization and field weights before chasing a larger model."
shortAnswer: "Work through term frequency, rarity and length normalization. Tune tokenization and field weights before chasing a larger model."
category: "Memory & Retrieval"
tags: ["BM25", "IDF", "tokenization", "FTS5", "lexical", "sözcüksel", "Türkçe", "tokenizasyon"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "BM25: why a rare word can beat repeated words — MESA Learn"
seoDescription: "Work through term frequency, rarity and length normalization. Tune tokenization and field weights before chasing a larger model."
lessonOrder: 5
learningStage: "retrieval"
prerequisites: ["semantic-search"]
learningObjectives: ["Read the BM25 formula", "Calculate a document-length effect", "Design exact-identifier and Turkish tokenization tests"]
---

## Three questions behind lexical ranking

For “Atlas Friday hours”, a lexical retriever finds passages containing query terms. It needs to decide which match matters most. BM25 combines term rarity, within-document frequency and a correction for document length. Repeating “hours” fifty times should not make a long irrelevant document unbeatable; an uncommon identifier may be a more discriminating clue.

An inverted index maps a term to the documents containing it. Tokenization determines those terms before ranking begins. If “A-17” is split into “a” and “17”, a scoring adjustment cannot restore an identifier boundary that was never indexed. Inspect tokens and query parsing first. Exact identifiers may need a separate normalized field or equality filter.

## Read the formula one factor at a time

```text
score(d,q) = sum over query terms t:
 IDF(t) * f(t,d)*(k1+1) /
 [f(t,d) + k1*(1-b + b*len(d)/avgdl)]

One common non-negative IDF variant:
IDF(t) = ln(1 + (N - df(t) + 0.5)/(df(t) + 0.5))
N: corpus documents   df: documents containing t
f: term frequency    avgdl: average document length
```

IDF gives rarer terms greater influence. The frequency fraction saturates: going from zero to one occurrence matters more than going from ten to eleven. `k1` controls that saturation; `b` controls length normalization. At `b=0`, length has no effect. At `b=1`, the full length ratio enters. BM25 variants differ in IDF details, so record the implementation as well as the parameter names.

## Calculate the length effect

| Quantity | Short passage A | Long passage B |
| --- | --- | --- |
| Term frequency | 2 | 2 |
| Length / average length | 0.5 | 2 |
| With k1=1.2, b=0.75: denominator | 2.75 | 4.10 |
| Numerator: 2 × 2.2 | 4.4 | 4.4 |
| Frequency factor | 1.60 | 1.073 |

With the same IDF and term frequency, the shorter passage receives the larger contribution. This is arithmetic, not evidence that short chunks always win. Splitting documents changes term statistics, context completeness and the unit judged relevant. Keep chunking fixed when testing a ranking change, then evaluate chunking as its own experiment.

## Tune against failure cases

<!-- diagram: Inspect tokens, build a lexical baseline, judge results, adjust one setting and repeat. -->
1. Inspect · A-17 / I / İ
2. Baseline · fixed chunks
3. Judge · exact and paraphrase
4. Change · one field weight
5. Compare · held-out queries

*Do not tune on the same examples used for your final score.*

For Turkish, inspect dotted/dotless I, inflections and diacritics using real query/document pairs. Lowercasing and accent removal can help some matches while collapsing meaningful distinctions. Preserve original text and test both identifier precision and ordinary-language recall. Search syntax and tokenizer behavior are separate from your UI’s text normalization.

SQLite FTS5 uses fixed `k1=1.2` and `b=0.75`; its `bm25(table, ...)` arguments are column weights, not these parameters. It also returns smaller values for better matches, so ascending order is intentional. Do not copy a descending-score rule from another engine. Our worked formula uses an explicit IDF variant; FTS5’s exact scoring definition is in its own reference. [FTS5](https://www.sqlite.org/fts5.html).

## Choose the first debugging step

> [!EXERCISE]
> **Check your understanding**
> Every search for policy A-17 returns policy A-71 first. Should you immediately increase a ranking weight?
>
> **Answer:** Inspect indexed tokens and query syntax, then test an exact identifier field. If the index no longer distinguishes the identifiers, weighting cannot reliably repair it. Only tune scores after the representation is correct.

## Sources and further reading

1. [Manning, Raghavan & Schütze · Okapi BM25](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html)
2. [SQLite · FTS5 reference](https://www.sqlite.org/fts5.html)

