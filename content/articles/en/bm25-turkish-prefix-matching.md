---
id: "bm25-turkish-prefix-matching"
slug: "bm25-turkish-prefix-matching"
type: "research"
language: "en"
title: "Why BM25 Struggles With Turkish"
subtitle: "One legal word, dozens of index terms"
summary: "BM25 matches whole tokens, while Turkish adds suffixes to words. In 112 legal dev questions, 252 of 873 query terms reached the evidence only through a shared prefix."
shortAnswer: ""
category: "Retrieval Evaluation"
tags: ["bm25", "turkish", "tokenization", "legal-search"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-23"
readingMinutes: 8
status: "published"
indexable: true
seoTitle: "Why BM25 Struggles With Turkish"
seoDescription: "Turkish suffixes split one word into many index terms. We measured the problem on legal text and what 5-character prefix matching actually fixed."
---

## Why does BM25 struggle with Turkish?

BM25 scores whole tokens, and Turkish builds many tokens from one stem. `sözleşme`, `sözleşmesinin` and `sözleşmelerinde` are three different index terms, so a query containing one form can miss the others.

We measured this on MESA's Turkish legal benchmark. Of 873 eligible query terms in 112 answerable dev questions, 290 appeared exactly in the correct evidence, 252 matched only through their first five characters, and 331 did not match at all. Prefix matching addresses the middle group, but its measured gain was small: a net two questions in the top 5.

## How many forms does one Turkish word have?

We indexed the 141 Tier M documents with the tokenizer MESA uses and grouped every term of 6 or more characters by its first five characters. The tokenizer removes most diacritics, so `sözle` is stored as `sozle`.

| Tier M corpus, terms with 6+ characters | Value |
| --- | --- |
| Distinct terms | 26,664 |
| Five-character prefix groups | 5,144 |
| Median forms per group | 2 |
| 90th percentile | 12 |
| Groups with 10 or more forms | 670 |
| Groups with 50 or more forms | 58 |
| Largest group | 191 |

| Prefix | Forms in corpus | Examples |
| --- | --- | --- |
| karar | 87 | kararı, kararın, kararlarına, kararnamenin |
| yonet | 55 | yönetim, yönetmelik, yönetmeliğin, yönetici |
| sozle | 44 | sözleşme, sözleşmesinin, sözleşmelerinde |
| yargı | 41 | yargıtay, yargılama, yargısal |
| madde | 39 | maddesi, maddesinde, maddelerine |
| mahke | 38 | mahkemesi, mahkemece, mahkemelerinin |

Most prefix groups are small. The problem concentrates in common legal words, and those are the words legal queries use.

## How often do query words miss the evidence?

| Dev category, eligible query terms | Exact in evidence | Prefix only | No match |
| --- | --- | --- | --- |
| Exact wording | 95 | 66 | 91 |
| Number, date, docket | 88 | 85 | 93 |
| Paraphrase | 63 | 61 | 119 |
| Cross-document | 44 | 40 | 28 |
| All | 290 | 252 | 331 |

In 102 of 112 answerable questions, at least one query term reached the evidence only through its prefix. Paraphrases have the largest no-match group: 119 of 243 terms. Prefix matching cannot help there, because the words differ. That is where [semantic search](/learn/semantic-search/) and [hybrid retrieval](/learn/hybrid-retrieval-explained/) come in.

## How does MESA's prefix matching work?

MESA 0.9.4 uses a simple rule. A query token with 6 or more characters and no digits is truncated to five characters and searched as a prefix. Shorter tokens and tokens with digits stay exact, so `6098` cannot match `60981`.

You can see the behavior with Python's standard library, using the same FTS5 tokenizer settings:

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

The output shows both sides of the rule. `sözle*` finds `sözleşmesinin`, which the exact term misses. It also finds `sözlerini`, which has nothing to do with contracts.

## Why are ı and İ a separate problem?

Turkish has dotted and dotless i. In the output above, `yargı*` finds `Yargıtay` but not `YARGITAY`, because the tokenizer lowercases `I` to `i` rather than `ı`.

MESA handles part of this at query time. It normalizes Turkish case, then searches both the `ı` form and an `i` variant. So `Yargıtay` and `YARGITAY` as queries find text written either way. The ASCII query `yargitay` still does not find `Yargıtay`, because index-side Turkish folding is not implemented in 0.9.4.

## What did prefix matching actually change?

On a shared store with models off, prefix matching took dev Hit@5 from 50/112 to 52/112 (pre-release 0.9.4 build, benchmark v2, Tier M). Six questions crossed the top-5 line:

| Category | Rank before → after | Effect | Prefix-only terms in evidence |
| --- | --- | --- | --- |
| Number, date, docket | 6 → 5 | Gain | 2 |
| Cross-document | 6 → 5 | Gain | 7 |
| Number, date, docket | 6 → 5 | Gain | 3 |
| Paraphrase | 38 → 4 | Gain | 0 |
| Exact wording | 5 → 8 | Loss | 1 |
| Number, date, docket | 4 → 11 | Loss | 5 |

Three gains were one-position moves. The largest gain had no prefix-only term in its evidence, so its improvement came indirectly, probably because competing passages changed rank. Both losses had prefix-only terms too. The presence of such a term does not predict whether a question improves.

The [0.9.4 quality post](/research/what-improved-search-in-0-9-4/) shows that larger gains came from changing fusion weights.

## What should you do for Turkish search?

- Measure before adding a stemmer. Over-matching can cost as much as it gains.
- Keep tokens with digits exact. Law numbers, dockets and dates must not match by prefix.
- Handle ı and İ explicitly. Default Unicode lowercasing is wrong for Turkish.
- Combine lexical search with embeddings, because many query words never appear in the evidence.
- Compare ranks per question, not only an average.

## What can this analysis not show?

- It checks each query term against the gold evidence span, not against all candidate passages.
- It does not apply MESA's filtering of citation tokens, so counts are approximate for citation-heavy questions.
- We did not test a real Turkish stemmer or morphological analyzer.
- A net change of two questions in 112 is small and may not hold on another sample.
- The corpus is legal text. General Turkish may behave differently.

## Sources

1. [SQLite FTS5 documentation](https://www.sqlite.org/fts5.html)
2. [Manning, Raghavan and Schütze: Okapi BM25](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html)
3. [MESA 0.9.4 changelog](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)

