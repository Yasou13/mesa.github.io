---
id: "source-backed-document-search"
slug: "source-backed-document-search"
type: "guide"
language: "en"
title: "How do you build source-backed document search?"
subtitle: ""
summary: "Add a document with a source reference, search it locally, update it and check that results come from the current revision."
shortAnswer: "Install MESA Core, start the local server, add each text file with a stable --source value and search with mesa search. Results return the matching text and document ID, so you can check the answer against its source."
category: "Document Memory"
tags: ["document-search", "provenance", "mesa-core"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-24"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "How to Build Source-Backed Document Search — MESA"
seoDescription: "Add text documents to MESA Core, search them locally, update a revision and verify that each result points back to its source."
---

## 1. Check what you need

- Python 3.11, 3.12 or 3.13
- Linux, macOS or WSL
- UTF-8 text files. Convert PDF and Word files to text first.

This guide uses word search, so it needs no model account. MESA Core is alpha software and is not ready for production use.

Checked against `mesa-memory` 0.9.4 from PyPI on 24 November 2026. Your document IDs can differ.

## 2. Install and start MESA Core

Run this in a new folder and keep the terminal open.

```text
python3 -m venv .venv
. .venv/bin/activate
python -m pip install mesa-memory==0.9.4
mesa start
```

## 3. Add a document with its source

Open a second terminal in the same folder. Use a stable `--source`, because it identifies the document when you update or delete it.

First confirm that the server is ready:

```text
. .venv/bin/activate
mesa status
```

```text
MESA Server: http://127.0.0.1:8000
Readiness (/health/init): ready
Health (/health): healthy
```

```text
. .venv/bin/activate
printf '%s\n' 'Refunds are accepted within 30 days of purchase.' 'Damaged items are replaced at no cost.' > refund-policy.txt
mesa add refund-policy.txt --source file://refund-policy.txt
```

`mesa add` waits until the document is searchable:

```text
Added document doc-72f2f9bee031b87753ed5b3b1affae68 with 1 chunk(s)
searchable
```

## 4. Search and inspect the source

```text
mesa search "refund days"
```

A result looks like this. Your document ID can differ.

```text
[1] score: 0.016 | doc-72f2f9bee031b87753ed5b3b1affae68
    Refunds are accepted within 30 days of purchase.
    Damaged items are replaced at no cost.
```

With models off, BM25 is the only fused lane, so a first-place match scores 1/61, about 0.016. The number is a rank signal, not a quality grade.

> [!WARNING]
> **A score is not proof**
> The score orders results for this query. It is not a probability that the text is correct. Read the returned passage before using it.

> [!NOTE]
> **What we measured in MESA**
> Search results can carry extracted legal items. [We measured that extractor](/research/turkish-legal-citation-extraction/) on 150 labeled chunks (MESA 0.9.4): 357 correct items, 25 false positives, 18 misses.

## 5. Update the document

Add changed text with the same source. MESA creates a new revision of the same document, and search uses the current text.

```text
printf '%s\n' 'Refunds are accepted within 45 days of purchase.' 'Damaged items are replaced at no cost.' > refund-policy.txt
mesa add refund-policy.txt --source file://refund-policy.txt
mesa search "refund days"
```

The result should now say 45 days.

## 6. Delete by source

```text
mesa delete --source file://refund-policy.txt
```

Expected output, followed by the same search:

```text
Purged document doc-72f2f9bee031b87753ed5b3b1affae68
$ mesa search "refund days"
No matching memories found.
```

After deletion, the same search should no longer return the document. Then stop the server in the first terminal with Ctrl+C.

## What are the common errors and fixes?

| What you see | Cause | Fix |
| --- | --- | --- |
| `mesa add: error: the following arguments are required: --source` | No source reference | Add `--source`, for example `--source file://refund-policy.txt` |
| `File not found: nope.txt` | Wrong path | Check the file name and the current folder |
| `UnicodeDecodeError: 'utf-8' codec can't decode byte` | The file is not UTF-8 | Convert it first, as shown below |
| `No matching memories found.` | No document contains the query words | Try words that appear in the text, or enable a model for meaning-based search |

Older Turkish files are often saved as Windows-1254. In 0.9.4 such a file stops `mesa add` with a Python traceback rather than a short message. Convert it to UTF-8 and add the converted file:

```text
iconv -f WINDOWS-1254 -t UTF-8 notes.txt > notes-utf8.txt
mesa add notes-utf8.txt --source file://notes.txt
```

Turkish letters matter in queries. In our test on 0.9.4, `YARGITAY` and `sözleşme` found a line containing `Yargıtay` and `sözleşmesinin`, but the ASCII query `yargitay` found nothing. Type `ı`, `ğ`, `ş` and the other Turkish letters when you search. [Why BM25 Struggles With Turkish](/research/bm25-turkish-prefix-matching/) explains the cause.

## Document search questions

**Do I need embeddings to start?**
: No. Word search works without a model. Add a model provider later if you need meaning-based search.

**Can I add PDF files directly?**
: The CLI reads UTF-8 text files, so convert PDF and Word files first.

**Does MESA write the final answer?**
: No. It returns source text. Your application and language model write the answer.

## Sources

1. [MESA Core · Getting started](docs/core/getting-started/)
2. [MESA Core · CLI reference](docs/core/cli-reference/)
3. [mesa-memory 0.9.4 on PyPI](https://pypi.org/project/mesa-memory/0.9.4/)

