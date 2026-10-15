# 10 — Remaining Technical & Content Limitations

**Run ID:** `20261015T221500Z`  
**Execution Timestamp:** 2026-10-15T22:30:30+03:00  
**Target Baseline:** MESA Core v0.8.0  
**Repository Inspected:** `/home/yasin/Desktop/mesa_website/photos/site`  

---

## 1. Explicit Architectural & Release Limitations

In accordance with strict operating rules, the website explicitly avoids presenting unreleased capabilities, unexecuted tests, or hypothetical certifications as finished achievements. The following verified limitations remain active for MESA Core v0.8.0:

### A. Production Status: NO-GO
- MESA Core v0.8.0 is an **explicitly owner-approved source release**, not an independently certified production release.
- Production status remains strictly `NO-GO` pending Final MVP Certification, 24-hour continuous soak evidence, and formal provider telemetry.

### B. E2E Certification: Profile B Blocked
- The official Profile B certification harness in `MESA_E2E_Certification` currently **fails closed**.
- Authoritative runtime producers, scoring joins, and mandatory metric telemetry (gates B0–B14) remain unverified for an official PASS.
- Historical benchmark runs (e.g., `RUN-20260901T005200Z-p8b03`) remain preserved for audit and regression purposes, but do **not** represent a valid current certification verdict.

### C. Vertical Reference Application: MESA Law
- Isolated Law-side tests (FastAPI, database migrations, frontend matter workspaces) pass in the `MESA_Law` repository.
- However, the live full-stack runtime integration between MESA Law and running MESA Core V4 instances has not been executed in an official certified environment; live integration remains **PENDING**.

### D. Provider Prerequisites for V4 Ingestion
- Canonical V4 memory insertion (`POST /v4/memory/insert`) requires the model-enabled combined processing worker.
- Running without a configured embedding provider (or with `MESA_MODEL_ENABLED=false`) returns `503 canonical_processing_unavailable`.
- The model-disabled loopback quickstart demonstrates V3 raw memory and lexical search only; it does not demonstrate full V4 entity/graph extraction.

### E. Offline Tokenizer Fallback
- `ContextBuilder` formats and budgets evidence under the 2048-token limit using `cl100k_base`.
- If the canonical BPE model cannot be loaded offline, the tokenizer falls back to counting one token per UTF-8 byte as a conservative upper bound, which may pack less evidence into context.

### F. Unsigned Release Tag
- The `v0.8.0` annotated tag in MESA Core is unsigned because no local GPG key was available at the time of publication.

---

## 2. Website Content Integrity Safeguards
1. **No Fabricated Benchmarks:** No simulated or synthetic latency, recall, or accuracy numbers are published on the website.
2. **Honest Vertical Labels:** The legal pipeline is explicitly identified as a *reference implementation*, not a mandatory dependency for general agent memory use cases.
3. **No Unbounded Claims:** MESA is presented as infrastructure for traceable evidence, structure, and scope—not as an opaque AI memory that magically eliminates model errors or hallucinations.
