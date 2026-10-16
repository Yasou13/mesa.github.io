# MESA Localization Architecture Guide

This document explains MESA's multi-tier localization system, where Turkish translations reside, and how to maintain them without breaking strict localization assertions.

---

## The Four Localization Tiers

Translations in MESA are organized into four distinct tiers based on content lifecycle and structure:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        MESA Localization Tiers                         │
├────────────────────────┬────────────────────────┬──────────────────────┤
│ Tier                   │ Storage Location       │ Mechanism            │
├────────────────────────┼────────────────────────┼──────────────────────┤
│ 1. Global UI & Chrome  │ content/tr.json        │ localizeHtml()       │
│ 2. Product Components  │ scripts/render_product │ t(en, tr) registry   │
│ 3. Hub & Articles      │ content/articles/*.md  │ Bilingual locales    │
│                        │ content/hub.json       │ hubText(en, tr)      │
│ 4. Pinned Docs Sync    │ content/docs/sources   │ Upstream sync        │
└────────────────────────┴────────────────────────┴──────────────────────┘
```

---

### Tier 1: Global UI Chrome & Shared Strings (`content/tr.json`)

- **Files**: `content/tr.json`
- **Purpose**: Page titles, meta descriptions, navigation bars, footer links, privacy policies, and common UI elements across standard static pages (`siteData.pages`).
- **How it works**:
  - The static renderer renders the English page HTML first.
  - When rendering the Turkish locale (`/tr/...`), `localizeHtml()` scans HTML text nodes and replaces English strings using the dictionary `trContent.strings`.
  - **Strict Assertion**: `assertCompleteLocalization()` enforces that every single non-code text node is translated. Any untranslated English text causes the build to fail immediately.
  - **Intentional English**: Brand names and technical terms (e.g., `MESA`, `SQL`, `JSON`, `API`, `SHA-256`) that should not be translated are explicitly allowlisted in `trContent.intentionalEnglish`.

---

### Tier 2: Product & Interactive Pages (`render_product.mjs`)

- **Files**: `scripts/render_product.mjs`
- **Purpose**: High-fidelity product pages (`/`, `/architecture/`, `/retrieval/`, etc.) with dense domain terminology.
- **How it works**:
  - Uses the helper `t(englishString, turkishString)`.
  - Calling `t(en, tr)` registers `{ [en]: tr }` into the exported `productTranslations` registry and returns `en`.
  - During the Turkish build step in `render_site.mjs`:
    ```javascript
    const content = language === 'tr'
      ? localizeHtml(englishContent, {...trContent.strings, ...productTranslations})
      : englishContent;
    ```
  - This allows developers to see English and Turkish text side-by-side during template editing while preserving `localizeHtml`'s exact DOM-tree validation.

---

### Tier 3: Knowledge Hub & Articles (`content/articles/` & `content/hub.json`)

- **Files**:
  - `content/articles/en/*.md` (English articles)
  - `content/articles/tr/*.md` (Turkish articles)
  - `content/hub.json` (Structured JSON database)
- **Purpose**: In-depth educational articles, guides, research notes, and terminology definitions.
- **How it works**:
  - Longform content does not rely on substring translation. Each article has an independent, fully drafted English and Turkish version.
  - In `render_site.mjs`, hub templates use `hubText(english, turkish)` to select locale-specific headers, badges, or labels:
    ```javascript
    const hubText = (en, tr) => (currentLanguage === 'tr' ? tr : en);
    ```
  - Article bodies are rendered directly from `locales.en` or `locales.tr` in `content/hub.json`.
  - **Synchronization**: Use `python3 scripts/sync_articles.py --from-markdown` after editing Markdown articles.

---

### Tier 4: Documentation Sync (`content/docs/`)

- **Files**:
  - `content/docs/sources.json`
  - `content/docs/manifest.json`
- **Purpose**: Formal technical documentation synced from upstream repositories (`MESA`, `mesa-data`, `mesa-law`, `mesa-qa`, `mesa-e2e`).
- **How it works**:
  - `scripts/sync_docs.py` fetches Markdown documents at immutable, reviewed commit hashes.
  - Page titles support Turkish overrides via `"title_tr"` in `sources.json`.
  - Upstream Markdown content is cached in `content/docs/manifest.json`.

---

## Quick Reference: Where Do I Add or Edit a Translation?

| Content to Translate | Where to Change |
| :--- | :--- |
| Navbar, footer, or metadata of static pages | `content/tr.json` (`strings` or `pages`) |
| Product page text (`/`, `/architecture/`, `/retrieval/`) | `scripts/render_product.mjs` (in `t('EN', 'TR')`) |
| Educational article body or summary | `content/articles/{en,tr}/<slug>.md` |
| Hub categories, topics, or tool names | `content/hub.json` |
| Doc sidebar page titles | `content/docs/sources.json` (`title_tr`) |
| Technical acronyms to keep in English | `content/tr.json` (`intentionalEnglish`) |
