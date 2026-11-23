---
id: "measure-search-quality"
slug: "measure-search-quality"
type: "guide"
language: "en"
title: "How do you measure search quality with Recall and MRR?"
subtitle: ""
summary: "Create a small judged question set, record where the right document appears and compare two search settings."
shortAnswer: "Write real questions, mark the correct document for each and record its rank before and after a change. Recall@5 shows how often it appears in the top five. MRR shows how close to the top it appears."
category: "Document Memory"
tags: ["evaluation", "recall", "mrr"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-23"
readingMinutes: 6
status: "published"
indexable: true
seoTitle: "How to Measure Search Quality with Recall and MRR — MESA"
seoDescription: "Build a small judged question set, record result ranks and compare two search settings with Recall@5 and MRR using a short Python script."
---

## 1. Write a small question set

Start with 20 to 50 questions from real use, then grow the set. Include exact terms, natural wording and questions with no answer in the documents.

- [ ] Each question has a known correct document or passage
- [ ] Questions were written before looking at the new results
- [ ] Easy and hard cases are both included
- [ ] The set is saved so that it can be reused

## 2. Change one thing

Compare one change at a time, such as chunk size, fusion weight or reranking. If several settings change together, you cannot tell which one helped.

## 3. Record the rank

Run each question and write the rank of the first correct result. Leave it empty if the result is missing. Save this example as `results.csv`.

```text
question,baseline,changed
q1,1,1
q2,3,2
q3,,4
q4,2,1
q5,6,
```

> [!NOTE]
> **What we measured in MESA**
> For a worked example of question rules, scoring and disclosure, see [how we built benchmark v2](/research/turkish-legal-benchmark-v2/).

## 4. Calculate Recall@5 and MRR

Each example question has one correct document, so Recall@5 is the share of questions answered in the top five. A result after rank five counts as a miss.

```text
import csv

K = 5
rows = list(csv.DictReader(open("results.csv", encoding="utf-8")))
for column in ("baseline", "changed"):
    ranks = [int(row[column]) if row[column] else None for row in rows]
    hits = [rank for rank in ranks if rank and rank <= K]
    recall = len(hits) / len(ranks)
    mrr = sum(1 / rank for rank in hits) / len(ranks)
    print(f"{column}: Recall@{K}={recall:.2f} MRR@{K}={mrr:.2f}")
```

Run it with `python3 evaluate.py`:

```text
baseline: Recall@5=0.60 MRR@5=0.37
changed: Recall@5=0.80 MRR@5=0.55
```

## 5. Read the result carefully

| Question | Baseline | Changed | What happened |
| --- | --- | --- | --- |
| q2 | 3 | 2 | Moved up |
| q3 | Missing | 4 | Newly found |
| q4 | 2 | 1 | Moved up |
| q5 | 6 | Missing | Still outside the top five |

The change improves both metrics in this illustrative data. Five questions are too few to prove a real improvement, so inspect failures and repeat on a larger set.

> [!WARNING]
> **Do not tune on your final test set**
> Keep some questions aside. If you repeatedly tune against the same questions, the score can improve without real search improving.

## Search evaluation questions

**What is a good MRR score?**
: There is no universal threshold. Compare systems on the same questions and documents.

**Recall or MRR: which matters more?**
: Recall shows whether the evidence was found. MRR shows how high it ranked. RAG systems usually need both.

**Should I use nDCG?**
: Use nDCG when results have graded relevance. See the [evaluation lesson](/learn/evaluating-ndcg-and-mrr-in-memory/).

## Sources

1. [MESA Learn · Evaluate retrieval](learn/evaluating-ndcg-and-mrr-in-memory/)
2. [MESA · Retrieval evaluation methodology](methodology/retrieval-evaluation/)

