# MESA Documentation Synchronization Engine
**Multi-Repository Synchronization Architecture and Deterministic Ingestion**

---

## 1. Objective & Scope

The MESA ecosystem spans five specialized GitHub repositories:
1. `https://github.com/Yasou13/MESA` (MESA Core, runtime & store)
2. `https://github.com/Yasou13/MESA_Data` (Data extraction & pipeline)
3. `https://github.com/Yasou13/MESA_Law` (Legal knowledge graph reference)
4. `https://github.com/Yasou13/MESA_QA` (Evaluation & adversarial benchmarks)
5. `https://github.com/Yasou13/MESA_E2E_Certification` (Independent audit harness)

### Fundamental Principles
- **No Runtime GitHub Fetching**: All documentation is converted to static HTML at build time. Public visitors never encounter rate limits or external dependencies.
- **Upstream Authoring**: Maintainers update documentation in the primary code repositories where features are developed.
- **Strict Allowlisting**: The website never blindly crawls all Markdown files. Only explicitly vetted, production-ready documents are ingested.

---

## 2. Synchronization Architecture

```
   [ Upstream Repositories ]
   - MESA Core (v0.8.0)
   - MESA Data
   - MESA Law
   - MESA QA
   - MESA E2E Cert
          |
          v
   +-------------------------------------------------------------+
   |                  scripts/sync_docs.py                       |
   |                                                             |
   | 1. Read allowlisted paths for each repository               |
   | 2. Inspect active git commit SHA and release tag            |
   | 3. Parse Markdown AST & extract heading hierarchy           |
   | 4. Rewrite Relative Links:                                  |
   |    - Allowlisted target -> Internal doc URL                 |
   |    - Unallowlisted file -> Upstream GitHub Blob URL         |
   |    - Relative image -> GitHub Raw Asset URL                 |
   | 5. Calculate SHA-256 content hashes                         |
   | 6. Generate content/docs/manifest.json                      |
   +------------------------------+------------------------------+
                                  |
                                  v
   +-------------------------------------------------------------+
   |                  scripts/render_site.mjs                    |
   |                                                             |
   | 1. Ingest manifest.json                                     |
   | 2. Render hierarchical sidebar with active page indicators  |
   | 3. Render breadcrumbs, meta pills (version, commit, source) |
   | 4. Render Table of Contents (H2, H3 anchors)                |
   | 5. Generate bilingual static HTML in _site/docs/ & _site/tr/|
   +-------------------------------------------------------------+
```

---

## 3. Allowlist Configuration

The sync engine uses a deterministic configuration matrix defining allowed source files and their public routes:

### 3.1 MESA Core (`docs/core/`)
- `README.md` -> `/docs/core/` (Overview)
- `docs/getting-started.md` -> `/docs/core/getting-started/`
- `docs/installation.md` -> `/docs/core/installation/`
- `docs/architecture.md` -> `/docs/core/architecture/`
- `docs/concepts-and-ingestion.md` -> `/docs/core/concepts-and-ingestion/`
- `docs/retrieval-and-graph.md` -> `/docs/core/retrieval-and-graph/`
- `docs/api-reference.md` -> `/docs/core/api-reference/`
- `docs/configuration.md` -> `/docs/core/configuration/`
- `docs/cli-reference.md` -> `/docs/core/cli-reference/`
- `docs/rebuild-runbook.md` -> `/docs/core/rebuild-runbook/`
- `docs/performance-and-limitations.md` -> `/docs/core/limitations/`
- `docs/troubleshooting.md` -> `/docs/core/troubleshooting/`
- `docs/release-notes-v0.8.0.md` -> `/docs/core/release-notes/`
- `docs/migration-to-v0.8.0.md` -> `/docs/core/migration/`
- `docs/evidence-format.md` -> `/docs/core/evidence-format/`
- `docs/mcp-setup.md` -> `/docs/core/mcp-setup/`

### 3.2 Ecosystem Repositories
- **MESA Data (`docs/data/`)**: Overview, Ingestion Guide, Turkish User Manual, Schema Reference, Pipeline Architecture.
- **MESA Law (`docs/law/`)**: Overview, Legal KG Architecture, Decision Schema, Verification Report.
- **MESA QA (`docs/qa/`)**: Overview, Adversarial Benchmarks, Quality Evaluation, Golden Datasets.
- **MESA E2E Certification (`docs/e2e/`)**: Overview, Certification Protocol, Audit Methodology, Fail-Closed Hardening, Runner Runbook, Verification Status.

---

## 4. Link & Image Resolution Algorithm

In upstream repositories, Markdown links are authored relative to local files (e.g. `[Install](installation.md)` or `[Architecture](../ARCHITECTURE.md)`).

The sync rewriter evaluates each link `[text](href)`:
1. **Anchor / External Links**: `http://`, `https://`, `#hash` links are preserved as-is.
2. **Internal Allowlisted Document**: If the target filename or normalized relative path matches an entry in the repository allowlist, it is rewritten to the internal route:
   ```python
   # e.g. "installation.md" -> "docs/core/installation/"
   ```
   *At render time, the template prefixes the appropriate language root (`relativeBase`), ensuring seamless navigation in both English and Turkish.*
3. **Repository Reference Outside Allowlist**: If the link points to code or unallowlisted files (e.g. `LICENSE`, `ARCHITECTURE.md`, `tests/test_audit.py`), it is rewritten to the upstream GitHub blob URL:
   ```python
   # e.g. "ARCHITECTURE.md" -> "https://github.com/Yasou13/MESA/blob/99bde3ce6200/ARCHITECTURE.md"
   ```
4. **Referenced Images**: Relative images (`![Alt](images/arch.png)`) are rewritten to raw GitHub CDN URLs:
   ```python
   # -> "https://raw.githubusercontent.com/Yasou13/MESA/99bde3ce6200/docs/images/arch.png"
   ```

---

## 5. Failure Recovery & Cache Invariance

1. **Missing Directory Handling**: If an ecosystem repository is not cloned locally during a build, `sync_docs.py` inspects the existing `content/docs/manifest.json`. If valid cached documents exist, they are preserved and logged as warnings rather than failing the build.
2. **Deterministic Manifest**: `manifest.json` is committed to the repository, ensuring that builds are completely reproducible even in air-gapped or CI environments without multi-repo credentials.
