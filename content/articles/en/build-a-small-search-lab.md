---
id: "build-a-small-search-lab"
slug: "build-a-small-search-lab"
type: "learn"
language: "en"
title: "Build a small search lab, without an LLM"
subtitle: ""
summary: "Run a complete Python/SQLite example, predict its results and add a judged regression case. Connect the course concepts to an inspectable program."
shortAnswer: "Run a complete Python/SQLite example, predict its results and add a judged regression case. Connect the course concepts to an inspectable program."
category: "Practice"
tags: ["Python", "SQLite", "FTS5", "lab", "tutorial", "uygulama", "laboratuvar", "kod"]
author: "MESA contributors"
publishedAt: "2026-10-18"
updatedAt: "2026-10-28"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Build a small search lab, without an LLM — MESA Learn"
seoDescription: "Run a complete Python/SQLite example, predict its results and add a judged regression case. Connect the course concepts to an inspectable program."
lessonOrder: 14
learningStage: "practice"
prerequisites: ["evaluating-ndcg-and-mrr-in-memory"]
learningObjectives: ["Run a minimal in-memory lexical retriever", "Keep scope separate from free-text queries", "Extend the lab with judged tests and stable source IDs"]
---

## What you will build

This lab retrieves one source passage from a tiny archive. It uses Python’s standard `sqlite3` module and a SQLite build with FTS5 enabled. No model, network call, embedding download or MESA server is required. Save the code as `search_lab.py` and run `python3 search_lab.py`. If FTS5 is unavailable, SQLite reports “no such module: fts5”; use a Python/SQLite distribution that includes it.

The example deliberately creates one FTS table per allowed demonstration corpus. That keeps candidate statistics local in this tiny exercise. It is not a production tenancy strategy: authenticated scope resolution, schema management, resource limits and lifecycle operations need a separate design. The fixed `allowed_archive` mapping stands in for a trusted server decision, never a value taken from a prompt.

## Run the complete example

```text
import sqlite3

with sqlite3.connect(":memory:") as db:
    db.execute("CREATE VIRTUAL TABLE atlas USING fts5(source_id UNINDEXED, body)")
    db.executemany("INSERT INTO atlas VALUES (?, ?)", [
        ("handbook-r3/c1", "Atlas reading room opens at 10:00 on Friday."),
        ("handbook-r3/c2", "Atlas reading room opens at 09:00 on Monday."),
        ("directory-r1/c1", "The garden is closed on Friday."),
    ])
    # Only trusted identifiers are interpolated; query text is bound.
    allowed_archive = {"archive-reader": "atlas"}
    table = allowed_archive["archive-reader"]
    query = '"reading room" AND Friday'
    rows = db.execute(
        f"SELECT source_id, body FROM {table} "
        f"WHERE {table} MATCH ? ORDER BY bm25({table}), source_id LIMIT ?",
        (query, 3),
    ).fetchall()
    assert [row[0] for row in rows] == ["handbook-r3/c1"]
    for source_id, body in rows:
        print(source_id, "|", body)
```

The phrase query requires “reading room” together, and `AND Friday` requires Friday as well. The Monday passage lacks Friday; the garden passage lacks the phrase. The assertion is a reproducible expected result for this dataset, not an accuracy measurement. SQLite FTS5 ranks better matches with numerically smaller BM25 values, so ascending order is correct. [FTS5 reference](https://www.sqlite.org/fts5.html).

## Trace the program through the course model

<!-- diagram: A trusted archive selection constrains lexical candidates; results retain source IDs for inspection. -->
1. Trusted mapping · atlas
2. Parameterized MATCH · query
3. BM25 order · local corpus
4. Limit · three candidates
5. Inspect · source ID + text

*This is retrieval only. No answer generator or claim extraction is hidden in the example.*

SQL parameters prevent query values from becoming SQL syntax, but they do not disable the FTS query language. User input such as `OR`, quotes or malformed syntax still needs a deliberate search policy and error handling. Table identifiers cannot be bound with `?`; the example interpolates only a hard-coded trusted mapping. Do not replace that mapping with arbitrary user input.

## Make one change and predict the outcome

Replace Friday with Monday and update the expected ID to c2. Add a second Friday passage that says the room is closed for maintenance. Both now match the words: retrieval has exposed a conflict, not resolved it. Add explicit source revision and validity metadata before choosing the current answer. Finally try “last working day”; this lexical baseline does not know that phrase is intended to mean Friday.

Build a file of judged queries and expected source IDs, then calculate Recall@k and MRR using the previous lesson. Keep an untouched test split. Only after you understand the lexical failures should you add dense retrieval or a reranker. For an actual MESA integration, move to the version-pinned quickstart with credentials and providers; this lab is independent instructional code.

## Find the boundary of the demonstration

> [!EXERCISE]
> **Check your understanding**
> The code returns the expected source. Does that prove the handbook is current, the answer is true and tenant isolation is production-ready?
>
> **Answer:** No. The assertion verifies one retrieval behavior on controlled data. Validity, source trust, authentication, concurrency, deletion and production capacity need separate tests and implementation.

## Sources and further reading

1. [SQLite · FTS5 reference](https://www.sqlite.org/fts5.html)
2. [Manning, Raghavan & Schütze · Evaluation of ranked retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)
3. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

