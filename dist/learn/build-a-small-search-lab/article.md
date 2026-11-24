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
updatedAt: "2026-11-24"
readingMinutes: 7
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

Make these changes in order. Each one shows a different limit of lexical retrieval.

1. Change `Friday` to `Monday` in the query and the expected ID to `handbook-r3/c2`. Run it, then change both back.
2. Add a passage: `("notice-r1/c1", "Atlas reading room is closed for maintenance on Friday.")`. The assertion now fails because two passages match. Retrieval has exposed a conflict and has not resolved it. Choosing the current answer needs source revision and validity metadata.
3. Search for `"last working day"`. It returns nothing, because this lexical baseline does not know that the phrase can mean Friday.
4. Search for `"reading` with the closing quote missing. SQLite raises `OperationalError`, so a real search path needs error handling.

Next, turn those checks into a small judged test. Save this as `search_eval.py` and run `python3 search_eval.py`. It uses only the standard library.

```text
import sqlite3

PASSAGES = [
    ("handbook-r3/c1", "Atlas reading room opens at 10:00 on Friday."),
    ("handbook-r3/c2", "Atlas reading room opens at 09:00 on Monday."),
    ("directory-r1/c1", "The garden is closed on Friday."),
    ("notice-r1/c1", "Atlas reading room is closed for maintenance on Friday."),
]
JUDGED = [
    ('"reading room" AND Friday', "handbook-r3/c1"),
    ('"reading room" AND Monday', "handbook-r3/c2"),
    ("garden", "directory-r1/c1"),
    ('"last working day"', "handbook-r3/c1"),
]

def search(db, query, limit=3):
    try:
        rows = db.execute(
            "SELECT source_id FROM atlas WHERE atlas MATCH ? "
            "ORDER BY bm25(atlas), source_id LIMIT ?",
            (query, limit),
        ).fetchall()
    except sqlite3.OperationalError:
        return []  # Malformed FTS syntax is a failed search, not a crash.
    return [row[0] for row in rows]

with sqlite3.connect(":memory:") as db:
    db.execute("CREATE VIRTUAL TABLE atlas USING fts5(source_id UNINDEXED, body)")
    db.executemany("INSERT INTO atlas VALUES (?, ?)", PASSAGES)

    reciprocal_ranks = []
    for query, expected in JUDGED:
        results = search(db, query)
        rank = results.index(expected) + 1 if expected in results else None
        reciprocal_ranks.append(1 / rank if rank else 0)
        print(f"{query:<28} rank={rank} results={results}")

    hits = sum(1 for value in reciprocal_ranks if value > 0)
    print(f"Recall@3: {hits / len(JUDGED):.2f}")
    print(f"MRR: {sum(reciprocal_ranks) / len(JUDGED):.2f}")
    print("Malformed query:", search(db, '"reading'))
```

Expected output, checked with Python’s `sqlite3` on SQLite 3.46.1:

```text
"reading room" AND Friday    rank=1 results=['handbook-r3/c1', 'notice-r1/c1']
"reading room" AND Monday    rank=1 results=['handbook-r3/c2']
garden                       rank=1 results=['directory-r1/c1']
"last working day"           rank=None results=[]
Recall@3: 0.75
MRR: 0.75
Malformed query: []
```

The 0.75 scores come from four invented queries, so they teach the calculation and say nothing about real search quality. Keep a separate test split, and record every time you read it. Only after you understand the lexical failures should you add dense retrieval or a reranker. For Turkish text, try the tokenizer example in [Why BM25 Struggles With Turkish](/research/bm25-turkish-prefix-matching/). For a MESA integration, move to the version-pinned quickstart; this lab is independent instructional code.

## Find the boundary of the demonstration

> [!EXERCISE]
> **Check your understanding**
> The code returns the expected source. Does that prove the handbook is current, the answer is true and tenant isolation is production-ready?
>
> **Answer:** No. The assertion verifies one retrieval behavior on controlled data. Validity, source trust, authentication, concurrency, deletion and production capacity need separate tests and implementation.

## Sources and further reading

1. [SQLite · FTS5 reference](https://www.sqlite.org/fts5.html)
2. [Manning, Raghavan & Schütze · Evaluation of ranked retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)
3. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)

