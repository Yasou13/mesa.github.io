---
id: "turkish-legal-benchmark-v2"
slug: "turkish-legal-benchmark-v2"
type: "research"
language: "en"
title: "How We Built a Turkish Legal Retrieval Benchmark"
subtitle: "What we rebuilt, how we score it, and where it falls short"
summary: "Benchmark v2 rebuilt 246 older questions into 128 dev and 173 test questions with verbatim evidence. Its test split has been read six times, so dev results come first."
shortAnswer: ""
category: "Retrieval Evaluation"
tags: ["benchmark", "evaluation", "turkish", "legal-search"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-23"
readingMinutes: 9
status: "published"
indexable: true
seoTitle: "How We Built a Turkish Legal Retrieval Benchmark"
seoDescription: "How MESA rebuilt 246 Turkish legal questions into benchmark v2, how runs are scored, and why its test split is no longer an independent holdout."
---

## How did we build the benchmark?

We reviewed all 246 questions from benchmark v1 and found that many depended on missing context or on phrases that appeared in several places. We rewrote or rebuilt most of them, dropped 39, added open-style questions, and tied every answer to a verbatim quote in a source file. The result has 128 dev questions and 173 test questions over Turkish legal documents.

> [!WARNING]
> **The test split is not an independent holdout**
> It has been read in six MESA runs, and most v2 test questions derive from a v1 test set that had already been read. We report dev results as our main numbers. Test results appear only with this caveat.

## Why was the first benchmark not good enough?

Mechanical checks over all 246 v1 questions showed that a correct passage could be hard to define:

| Check on v1 questions | Dev | Test | Total |
| --- | --- | --- | --- |
| Wording depends on context and was flagged | 40 | 54 | 94 |
| Expected phrase also occurs in another file | 37 | 48 | 85 |
| Expected phrase occurs in 10 or more other files | 14 | 19 | 33 |
| Expected phrase repeats inside its own file | 25 | 39 | 64 |

A question such as "what does this regulation say" has no answer without knowing which regulation. A short phrase that repeats across files can also give credit to the wrong passage. In the worst case, one phrase repeated 172 times within a single file.

## What changed from v1 to v2?

| Review action on v1 questions | Dev | Test | Total |
| --- | --- | --- | --- |
| Rewritten | 73 | 104 | 177 |
| Rebuilt | 13 | 17 | 30 |
| Dropped | 15 | 24 | 39 |
| Kept unchanged | 0 | 0 | 0 |

The review first produced 207 questions. We then added open-style questions and applied a further correction pass. The final v2 set looks like this:

| Category | Dev | Test |
| --- | --- | --- |
| Exact wording | 31 | 39 |
| Number, date, docket | 35 | 46 |
| Paraphrase | 32 | 48 |
| Cross-document | 14 | 16 |
| No answer in corpus | 16 | 24 |
| Total | 128 | 173 |

## What makes a question valid?

- A question names its source when the answer depends on it. Law names carry their numbers, and decisions carry court, docket and decision numbers.
- Each answer has a verbatim quote of at most 200 characters that occurs once in the full corpus after Turkish normalization.
- Cross-document questions name two sources and require one passage from each.
- No-answer questions were checked against 33,954 indexed windows from all 182 documents, using at least two query variants.
- Automated validation rejects overlapping gold spans between dev and test.

## What is an open-style question?

Named questions tell the system which law to use. Open-style questions describe a situation, as a person would. Here is a real pair from the dev split:

> [!NOTE]
> **Named**
> 6098 sayılı Türk Borçlar Kanunu uyarınca, aralıksız evde çalışan işçinin hazırladığı ürünü işveren teslim almada temerrüde düşerse işçinin ücretini ödeme borcu sürer mi?

> [!NOTE]
> **Open**
> Evde sürekli parça başı üretim yapıyorum. İşveren hazırladığım ürünleri teslim almada temerrüde düşerse ücretimi yine de ödemek zorunda mı?

Both point to the same evidence. That makes the pair useful for testing wording, but it also means the two results are not independent.

## How are results scored?

A hit must come from the correct file. It then counts if it contains the normalized answer quote, or if it overlaps the quote by at least 60 characters or by the quote's full length when the quote is shorter. A passage from the right article that lacks the evidence earns no passage credit.

For cross-document questions, the rank is the position at which all required passages have appeared. See the [MRR and nDCG lesson](/learn/evaluating-ndcg-and-mrr-in-memory/) for how the metrics behave.

| Configuration | What runs |
| --- | --- |
| T0 | Models off, lexical search |
| T1b | T0 plus normalized BAAI/bge-m3 embeddings |
| T2 | T1b plus BAAI/bge-reranker-v2-m3 |

## How is a run performed?

1. Install the published package from PyPI.
2. Create a fresh store for each configuration on one Colab NVIDIA A100 80 GB runtime.
3. Ingest Tier M: 141 documents, 5,041 chunks.
4. Run dev twice on independently built stores and compare the returned order.
5. Save the dev report locally before the test file is uploaded.
6. Run test once per configuration.

The evaluator exits if a test file is passed without an explicit `--split test`. We added the two-store comparison after [random tie-breaks changed results between stores](/research/why-two-search-runs-differed/).

## How many times was the test split read?

Six runs read a test split. The process above limits accidental use, but it cannot undo repeated reads.

| Run date | Question set | MESA run |
| --- | --- | --- |
| 2026-10-29 | v1 | 0.9.0 experiments |
| 2026-11-07 | v1 | 0.9.2 release |
| 2026-11-17 | v1 | 0.9.3 release |
| 2026-11-21 | v2 | 0.9.3 reference |
| 2026-11-23 | v2 | 0.9.4 with 0.9.3 settings |
| 2026-11-23 | v2 | 0.9.4 release defaults |

The second 0.9.4 read happened because the first run did not use the release defaults. Those defaults were committed before the first v2 test read, but later development followed that read. For measured results, see [What Improved MESA Search Quality in 0.9.4](/research/what-improved-search-in-0-9-4/).

## What can this benchmark not show?

- Annotation had a review pass and an evidence spot check, but no independent agreement measure.
- It covers one snapshot of Turkish legal text. A no-answer label applies to this snapshot only.
- Lexical review can miss answers that are stated indirectly or distorted by OCR.
- Some source PDFs split words or insert page numbers, and those artifacts remain.
- Cross-document results rest on only 14 dev questions.
- The question files and evaluator are not public yet, so outside teams cannot rerun it.

## Sources

1. [SQLite FTS5 documentation](https://www.sqlite.org/fts5.html)
2. [MESA 0.9.4 changelog](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
3. [Manning, Raghavan and Schütze: Introduction to Information Retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html)

