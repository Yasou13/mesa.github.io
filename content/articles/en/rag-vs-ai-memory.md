---
id: "rag-vs-ai-memory"
slug: "rag-vs-ai-memory"
type: "learn"
language: "en"
title: "RAG and memory: build the request step by step"
subtitle: ""
summary: "Trace a source from retrieval into an answer. Learn why RAG and memory overlap, how context budgets work, and where grounding can fail."
shortAnswer: "Trace a source from retrieval into an answer. Learn why RAG and memory overlap, how context budgets work, and where grounding can fail."
category: "Foundations"
tags: ["RAG", "chunking", "context budget", "parçalama", "bağlam bütçesi", "prompt injection"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "RAG and memory: build the request step by step — MESA Learn"
seoDescription: "Trace a source from retrieval into an answer. Learn why RAG and memory overlap, how context budgets work, and where grounding can fail."
lessonOrder: 2
learningStage: "foundation"
prerequisites: ["what-is-ai-memory"]
learningObjectives: ["Build a retrieval-augmented request", "Separate retrieval failure from answer failure", "Budget evidence without discarding qualifications"]
---

## RAG is a pattern, memory is a lifecycle concern

Retrieval-augmented generation means fetching external information and conditioning a generated answer on it. An application may retrieve a manual, a user preference or a previous task record. “Memory” describes what the application retains and how it manages that information over time. A memory system can supply a RAG pipeline; a RAG corpus can be updated continuously. Static versus dynamic is not the defining distinction.

Lewis et al. introduced a specific trainable RAG architecture combining parametric and retrieved information. Modern applications often use the broader term for prompt-time retrieval without jointly training the retriever and generator. State which meaning you use. This lesson describes the application pattern; it does not claim that every retrieval-based prompt implements the original training method. [Original paper](https://arxiv.org/abs/2005.11401).

## One question, five inspectable decisions

<!-- diagram: A question passes authorization, retrieval, selection and context construction before generation. -->
1. Question · weekday hours?
2. Scope · archive-team
3. Candidates · revisions 1 and 2
4. Select · active source 2
5. Generate · answer + source

*The generator sees only the evidence actually placed in its request.*

First resolve the caller’s allowed sources. Then retrieve candidates and remove ineligible or superseded records. Rank the remaining candidates and pack a bounded evidence context. Finally ask the generator to answer from that context and identify the supporting source. Record each stage separately: a plausible final answer can hide a broken retriever or an accidental answer from model parameters.

## Chunk boundaries change what can be answered

Suppose a source says “The room opens at 09:00 on weekdays, except public holidays.” If chunking separates the exception into another record and retrieval returns only the first, the system may give a misleading answer while quoting a real sentence. Start with document structure: heading, paragraph, table and attachment boundaries. Keep source offsets and test whether questions need neighboring passages.

Overlap helps preserve local context but also creates near-duplicate candidates. Deduplicate by source/revision/span before filling the context. There is no universal chunk size: a short FAQ and a table with a multi-paragraph definition need different treatment. Choose a baseline, inspect failures and compare on held-out questions instead of treating a token count as a rule.

## Calculate the evidence budget

```text
input budget = 8,000 tokens
instructions + question + tool schemas = 2,000
reserved evidence capacity = 6,000
If the model limit includes output: reserve output separately.
Actual packing must include source labels and separators.
```

If each evidence item needs 500 tokens plus 50 tokens of identity/formatting, ten items consume 5,500 tokens. Eleven consume 6,050 and exceed this illustrative budget. Do not cut a passage midway through a negation or qualification just to fit. Drop or replace an item, retain its source identity and count with the model’s actual tokenizer where possible. Numbers here are an exercise, not model specifications.

## Diagnose retrieval and generation separately

| Observation | Likely investigation |
| --- | --- |
| Correct source absent from candidates | Ingestion, query, index and scope |
| Correct source retrieved but omitted | Ranking, deduplication and packing |
| Correct source in prompt, answer wrong | Instructions, model behavior and ambiguity |
| Answer right, source unrelated | Citation support and possible model recall |

Retrieved text is data, even when it says “ignore previous instructions.” Keep it separate from trusted instructions and do not authorize tool actions because a document requests them. Source presence does not establish truth or make a tool call safe. OWASP describes indirect prompt-injection risks and layered defenses; no single delimiter eliminates the problem. [Security reference](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

## Find the missing qualification

> [!EXERCISE]
> **Check your understanding**
> A source has 400 tokens of rules and 100 tokens of exceptions. Only the rules fit. Is truncating the last 100 tokens a safe optimization?
>
> **Answer:** No. Preserve the rule with its qualifications, retrieve a smaller complete unit, or decline to answer fully. Measure answer support, not just the number of passages placed in context.

## Sources and further reading

1. [Lewis et al. (2020) · Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
2. [Liu et al. (2023) · Lost in the Middle](https://arxiv.org/abs/2307.03172)
3. [OWASP · LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

