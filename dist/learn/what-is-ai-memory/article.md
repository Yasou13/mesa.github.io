---
id: "what-is-ai-memory"
slug: "what-is-ai-memory"
type: "learn"
language: "en"
title: "AI memory: what survives after a conversation?"
subtitle: ""
summary: "Distinguish model weights, the current context and persistent records. Design a memory write before choosing a database."
shortAnswer: "Distinguish model weights, the current context and persistent records. Design a memory write before choosing a database."
category: "Foundations"
tags: ["memory", "context window", "session", "kalıcı hafıza", "bağlam", "oturum"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-28"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "AI memory: what survives after a conversation? — MESA Learn"
seoDescription: "Distinguish model weights, the current context and persistent records. Design a memory write before choosing a database."
lessonOrder: 1
learningStage: "foundation"
prerequisites: []
learningObjectives: ["Separate context from persistent storage", "Choose what to retain and when to delete it", "Trace one fact from observation to later use"]
---

## Three different meanings of “remember”

Imagine an assistant helping with a fictional Atlas archive. On Monday you say that the reading room opens at nine. On Tuesday you open a new conversation and ask for its opening time. The model can answer only if the application supplies a usable record, or if the information happens to be in its parameters. A confident answer does not tell you which happened.

A large language model (LLM) generates text by predicting tokens from the input it receives. A token is a unit of encoded text, not necessarily a whole word. The context window is the bounded sequence of input and output tokens the model can work with under its interface. Persistent storage is an application mechanism outside that prediction process; the word memory here is an engineering term, not a claim of human-like recollection.

| Layer | What it contains | How it changes |
| --- | --- | --- |
| Model parameters | Patterns learned during training | Training or fine-tuning |
| Context window | Tokens supplied for this request | Build a new request |
| Persistent memory | Records outside the model | Authorized write/update/delete |

Writing a row to a database does not retrain a model. Retrieving that row makes it available in one request, subject to selection and context limits. Conversely, leaving a statement in conversation history does not guarantee that it will be present after truncation or in another session. These are separate mechanisms with separate failure modes.

## A useful record is more than a sentence

Before storing “opens at nine”, ask: which room, on which days, according to whom, and for which readers? A useful record preserves the original observation, its source, scope and time. An extracted fact is an interpretation of that observation. Keeping both lets you correct an extraction without pretending the original source changed.

```text
record_id: hours-17
subject: Atlas reading room
claim: opens at 09:00 on weekdays
source: handbook / revision 2 / paragraph 4
observed_at: 2026-10-18
scope: archive-team
status: active
```

A preference such as “use concise replies” is different from a reference fact such as opening hours. A temporary instruction may apply to one task; a user preference may persist until revoked. Do not silently promote an instruction from a retrieved document into a durable user preference. Define who may write each kind of record.

## Follow the lifecycle, not the chat transcript

<!-- diagram: An observation is admitted, stored, retrieved and used in a later context. -->
1. Observe · exact source
2. Admit · validate and authorize
3. Store · source + record
4. Retrieve · relevant and allowed
5. Use · cite or abstain

*Each arrow can fail. A saved message is not proof that a usable memory was committed.*

Choose a write policy explicitly. Store every message and you accumulate private data, duplicates and stale instructions. Store only an LLM summary and you may lose exceptions or evidence. A practical starting point is to retain exact source records, extract a small set of task-relevant claims and keep a link from each claim to its source. This is a design pattern, not a universal requirement.

## Deletion and correction are part of memory

On Wednesday the room changes its hours. Appending a new sentence leaves two competing answers unless you track revisions or validity. Mark the previous claim as superseded while retaining the audit trail your policy permits. Deleting the source also requires a decision about derived summaries, embeddings and caches; removing only the visible chat message is incomplete.

The test is observable continuity: close the session, start another authorized session, ask the question, then revoke access or supersede the source and repeat. Check the returned source identity as well as the answer. Long context is not a substitute for this test. Liu et al. study position effects in particular long-context tasks; their finding is a reason to evaluate your model, not a timeless limit for every model. [Read the study](https://arxiv.org/abs/2307.03172).

## Design your first memory policy

> [!EXERCISE]
> **Check your understanding**
> The assistant saves “the room opens at nine” but cannot identify its source or who may see it. Which two problems remain even if retrieval always returns the row?
>
> **Answer:** You cannot verify or revise the source-backed claim reliably, and you cannot enforce its access boundary. Retrieval success alone solves neither provenance nor authorization. Add source/revision and scope fields before measuring search quality.

## Sources and further reading

1. [Liu et al. (2023) · Lost in the Middle](https://arxiv.org/abs/2307.03172)
2. [Lewis et al. (2020) · Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
3. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

