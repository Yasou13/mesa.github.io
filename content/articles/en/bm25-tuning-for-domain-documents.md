---
id: "bm25-tuning-for-domain-documents"
slug: "bm25-tuning-for-domain-documents"
type: "learn"
language: "en"
title: "Practical BM25 parameter tuning for legal and technical texts"
subtitle: "Optimizing term frequency saturation (k1) and document length normalization (b)"
summary: "Standard BM25 defaults (k1=1.2, b=0.75) are calibrated for general web documents. Highly structured legal statutes and code repositories require tailored parameters."
shortAnswer: "Tuning k1 controls how fast multiple occurrences saturate relevance; tuning b controls how heavily long documents are penalized."
category: "Memory & Retrieval"
tags: ["bm25", "lexical-search", "tuning", "domain-documents"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-17"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "Practical BM25 parameter tuning for legal and technical texts — MESA Learn"
seoDescription: "Standard BM25 defaults (k1=1.2, b=0.75) are calibrated for general web documents. Highly structured legal statutes and code repositories require tailored p"
---

## The one-size-fits-all default trap

Information retrieval libraries commonly ship with hardcoded BM25 defaults calibrated on 1990s TREC news corpora. In technical, statutory, or medical domains, document length variation and repetitive domain nomenclature cause these defaults to degrade recall.

> [!WARNING]
> **The Long-Document Penalty Flaw**
> Setting b too high (e.g. 0.85) in legal research harshly penalizes long statutory codes or multi-page court rulings, artificially favoring short procedural notices.

## Engineering trade-offs side-by-side

| Parameter | Formula Role | Default Value | Domain Tuning Guidance |
| --- | --- | --- | --- |
| k1 | Term frequency saturation scale | 1.2 - 1.5 | Increase to 1.8 - 2.0 when repeated terms indicate genuine emphasis (e.g. contracts) |
| b | Document length normalization factor | 0.75 | Lower to 0.3 - 0.5 for legal statutes where long documents naturally cover more sub-topics |
| avgdl | Average document length in corpus | Computed dynamically | Freeze during evaluation to avoid scoring drift across dataset partitions |
| Tokenizer / Stemmer | Morphological token normalization | Standard Porter | Use domain-specific lemmatizers (e.g. Turkish Zemberek / Snowball) |

## The BM25 saturation curve mechanics

As the count of a query term increases in a document, BM25 increases score asymptotically towards (k1 + 1). Higher k1 values make the curve steeper, rewarding documents with higher repetition of the exact query phrase.

```text
// SQLite FTS5 custom BM25 weights
SELECT rowid, bm25(articles_fts, 10.0, 5.0, 1.0) AS rank
FROM articles_fts
WHERE articles_fts MATCH 'arbitration clause'
ORDER BY rank;
```

## BM25 tuning in MESA Core

MESA Core leverages SQLite FTS5 with customized column weights and calibrated saturation parameters. Legal article numbers and docket references receive dedicated column multipliers during lexical candidate generation.

- [ ] k1 and b parameters are configurable per dataset partition.
- [ ] Column weights prioritize title and section heading matches.
- [ ] Turkish locale uses custom tokenizers handling dotted and dotless I.
- [ ] Evaluations verify lexical Recall@k before Reciprocal Rank Fusion.

## References

1. [Robertson et al. (1994) — Okapi at TREC-3](https://trec.nist.gov/pubs/trec3/papers/city.ps.gz)
2. [Trotman et al. (2014) — Improvements to BM25 and Language Models Examined (ADCS '14)](https://dl.acm.org/doi/10.1145/2682862.2682863)

