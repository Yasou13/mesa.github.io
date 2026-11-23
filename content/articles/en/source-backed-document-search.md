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
updatedAt: "2026-11-23"
readingMinutes: 6
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

## 2. Install and start MESA Core

Run this in a new folder and keep the terminal open.

```text
python3 -m venv .venv
. .venv/bin/activate
python -m pip install mesa-memory==0.9.3
mesa start
```

## 3. Add a document with its source

Open a second terminal in the same folder. Use a stable `--source`, because it identifies the document when you update or delete it.

```text
. .venv/bin/activate
printf '%s\n' 'Refunds are accepted within 30 days of purchase.' 'Damaged items are replaced at no cost.' > refund-policy.txt
mesa add refund-policy.txt --source file://refund-policy.txt
```

## 4. Search and inspect the source

```text
mesa search "refund days"
```

A result looks like this. Your document ID can differ.

```text
[1] score: 0.049 | doc-72f2f9bee031b87753ed5b3b1affae68
    Refunds are accepted within 30 days of purchase.
    Damaged items are replaced at no cost.
```

> [!WARNING]
> **A score is not proof**
> The score orders results for this query. It is not a probability that the text is correct. Read the returned passage before using it.

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

After deletion, the same search should no longer return the document. Then stop the server in the first terminal with Ctrl+C.

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
3. [mesa-memory 0.9.3 on PyPI](https://pypi.org/project/mesa-memory/0.9.3/)

