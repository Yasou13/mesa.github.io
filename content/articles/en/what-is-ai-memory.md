---
id: "what-is-ai-memory"
slug: "what-is-ai-memory"
type: "learn"
language: "en"
title: "What is AI agent memory?"
subtitle: ""
summary: "AI agent memory keeps useful information outside the model and brings it back when needed. Learn the main types and design your first memory policy."
shortAnswer: "AI agent memory is a system outside the language model that saves selected information and retrieves it for later requests. It lets an agent use earlier facts, decisions and experience across sessions. The model is not retrained; the application supplies the relevant memory as context."
category: "Foundations"
tags: ["memory", "context window", "session", "kalıcı hafıza", "bağlam", "oturum"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-11-23"
readingMinutes: 6
status: "published"
indexable: true
seoTitle: "What Is AI Agent Memory? Types and Design — MESA"
seoDescription: "AI agent memory stores useful information outside the model and retrieves it later. Learn working, episodic, semantic and procedural memory."
lessonOrder: 1
learningStage: "foundation"
prerequisites: []
learningObjectives: ["Separate context from persistent storage", "Choose what to retain and when to delete it", "Trace one fact from observation to later use"]
---

## What is AI agent memory?

AI memory is the set of mechanisms that lets an application use information beyond the current request. For an AI agent, this usually means storing observations, facts, decisions or instructions, then retrieving the relevant ones when a later task needs them.

The important point is that the language model does not automatically learn from each conversation. Memory works because the application chooses what to save, finds it again and places it in the model’s context.

## Three different meanings of “remember”

Imagine an assistant helping with a fictional Atlas archive. On Monday you say that the reading room opens at nine. On Tuesday you open a new conversation and ask for its opening time. The model can answer only if the application supplies a usable record, or if the information happens to be in its parameters. A confident answer does not tell you which happened.

A large language model (LLM) generates text by predicting tokens from the input it receives. A token is a unit of encoded text, not necessarily a whole word. The context window is the bounded sequence of input and output tokens the model can work with under its interface. Persistent storage is an application mechanism outside that prediction process; the word memory here is an engineering term, not a claim of human-like recollection.

| Layer | What it contains | How it changes |
| --- | --- | --- |
| Model parameters | Patterns learned during training | Training or fine-tuning |
| Context window | Tokens supplied for this request | Build a new request |
| Persistent memory | Records outside the model | Authorized write/update/delete |

Writing a row to a database does not retrain a model. Retrieving that row makes it available in one request, subject to selection and context limits. Conversely, leaving a statement in conversation history does not guarantee that it will be present after truncation or in another session. These are separate mechanisms with separate failure modes.

## Types of AI agent memory

The [CoALA framework](https://arxiv.org/abs/2309.02427) describes agent memory with four useful categories. Real products may combine them or use different names.

| Type | What it holds | Example |
| --- | --- | --- |
| Working memory | Active information for the current decision | The current task and recent tool result |
| Episodic memory | Past experiences and behavior | A failed deployment from last week |
| Semantic memory | Knowledge about the world or the agent | The reading room opens at 09:00 |
| Procedural memory | Rules and skills that guide action | Always run tests before a release |

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

## AI memory vs context window vs RAG

| Concept | Main question | Lifetime |
| --- | --- | --- |
| Context window | What can the model see in this request? | One request |
| RAG | Which source text should support this answer? | Depends on the knowledge base |
| Agent memory | What should the agent retain and reuse? | Across tasks and sessions until changed or deleted |

RAG can be one way to retrieve memory, but memory also needs write, update, scope and deletion rules. Continue with [RAG and memory](/learn/rag-vs-ai-memory/).

## Common AI memory mistakes

- Saving every message and retrieving noise, private data or old instructions.
- Keeping only a summary and losing the original evidence.
- Treating a retrieved document’s instruction as a trusted user preference.
- Having no way to correct, supersede or delete a memory.
- Measuring whether a row was saved, but not whether a later session can use it.

## Design your first memory policy

> [!EXERCISE]
> **Check your understanding**
> The assistant saves “the room opens at nine” but cannot identify its source or who may see it. Which two problems remain even if retrieval always returns the row?
>
> **Answer:** You cannot verify or revise the source-backed claim reliably, and you cannot enforce its access boundary. Retrieval success alone solves neither provenance nor authorization. Add source/revision and scope fields before measuring search quality.

> [!NOTE]
> **Example: memory for coding agents**
> [MESA Lore](/lore/) applies this idea to coding sessions. It keeps past Claude Code and Codex work in a local, searchable record with sources.

## AI agent memory questions

**Does AI memory retrain the model?**
: No. Most agent memory is stored outside the model and added to context when needed.

**Is a larger context window the same as memory?**
: No. It holds more text in one request, but it does not decide what persists, what is current or who may access it.

**Does AI agent memory need a vector database?**
: No. Depending on the task, memory can start with files, SQL or keyword search. Add vectors when you measure a need for meaning-based retrieval.

**What should an AI agent remember?**
: Keep information likely to help later, with its source, scope and time. Avoid storing secrets, temporary noise and claims you cannot trace.

## Sources and further reading

1. [Liu et al. (2023) · Lost in the Middle](https://arxiv.org/abs/2307.03172)
2. [Lewis et al. (2020) · Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
3. [MESA Core v0.9.4 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/e30856ec6e7ed9146bb9af992565e864f727b0b9/docs/architecture-v4.md)
4. [Sumers et al. (TMLR 2024) · Cognitive Architectures for Language Agents](https://arxiv.org/abs/2309.02427)

