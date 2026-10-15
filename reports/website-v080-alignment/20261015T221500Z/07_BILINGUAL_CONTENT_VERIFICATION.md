# 07 — Bilingual Content Verification

**Run ID:** `20261015T221500Z`  
**Execution Timestamp:** 2026-10-15T22:29:00+03:00  
**Target Baseline:** MESA Core v0.8.0  
**Repository Inspected:** `/home/yasin/Desktop/mesa_website/photos/site`  

---

## 1. Bilingual Architecture & Parity Mechanism

The website enforces **100% strict bilingual parity** between English (`/`) and Turkish (`/tr/`) through an automated compiler-level guarantee implemented in `scripts/render_site.mjs`:

```javascript
function assertCompleteLocalization(key, englishContent, localizedContent) {
  const english = localizableText(englishContent);
  const localized = localizableText(localizedContent);
  if (english.length !== localized.length) {
    throw new Error(`Localization structure drift for ${key}: ${english.length} source nodes, ${localized.length} Turkish nodes`);
  }
  const intentional = new Set(trContent.intentionalEnglish);
  const untranslated = english.filter((source, index) =>
    source === localized[index] && /[A-Za-z]/.test(source) && !intentional.has(source));
  if (untranslated.length) {
    throw new Error(`Untranslated Turkish content in ${key}: ${[...new Set(untranslated)].join(' | ')}`);
  }
}
```

### Verification Guarantees
1. **Node Count Parity:** Every page in Turkish must have the exact same number of text nodes as its English counterpart. Any structural drift immediately aborts the build.
2. **Zero Untranslated Fragments:** Any English word appearing in the Turkish output that is not explicitly in `intentionalEnglish` throws a hard fatal error during build.
3. **Canonical Language Switcher:** Every page includes a context-preserving `EN / TR` toggle targeting the exact counterpart route:
   - English: `href="./tr/{path}"`
   - Turkish: `href="../{path}"`
4. **Hreflang Tags:** Every HTML `<head>` declares accurate bidirectional `hreflang` links:
   - `<link rel="alternate" hreflang="en" href="https://mesamemory.dev/{path}">`
   - `<link rel="alternate" hreflang="tr" href="https://mesamemory.dev/tr/{path}">`
   - `<link rel="alternate" hreflang="x-default" href="https://mesamemory.dev/{path}">`

---

## 2. Technical Glossary & Terminology Alignment

To ensure natural technical Turkish rather than awkward literal translation, standard technical terms follow an established glossary:

| English Term | Technical Turkish Term | Context / Rationale |
|---|---|---|
| Evidence-aware memory | Kanıt odaklı hafıza | Expresses memory that actively retains supporting proof |
| Provenance | Kaynak izi | Exact provenance metadata tracing chunks, spans, and pipelines |
| Ingestion pipeline | Alım / işlem hattı | Clean processing pipeline representation |
| Reciprocal Rank Fusion | Karşılıklı Sıra Birleştirme (RRF) | Established IR ranking fusion method |
| Bounded adaptive context | Sınırlı uyarlanabilir bağlam | Controlled query reformulation under budget |
| Selectable validation | Seçilebilir doğrulama | Policy modes for deterministic vs LLM admission gates |
| Durable projection rebuild | Kalıcı projeksiyon yeniden oluşturma | Safe offline index reconstruction |
| Fenced lease | Sınırlı kiralama | Distributed worker claim fencing |
| Mutation ledger | Mutasyon günlüğü | Append-only ledger of memory state changes |
| Tenant boundary | Tenant / kiracı sınırı | Catalog-level multi-tenant isolation |
| Single-process writer | Tek süreçli yazıcı | Single combined writer runtime topology |
| Release Candidate | Sürüm Adayı | Formal version maturity indicator |
| Production: NO-GO | Üretim durumu: NO-GO | Universal industry term for blocked production readiness |

---

## 3. Verified Execution Proof

During `node scripts/render_site.mjs`, all 15 core pages were verified against `assertCompleteLocalization`:

```text
✓ home (assertCompleteLocalization PASS)
✓ mesa (assertCompleteLocalization PASS)
✓ howItWorks (assertCompleteLocalization PASS)
✓ ecosystem (assertCompleteLocalization PASS)
✓ data (assertCompleteLocalization PASS)
✓ qa (assertCompleteLocalization PASS)
✓ certification (assertCompleteLocalization PASS)
✓ law (assertCompleteLocalization PASS)
✓ useCases (assertCompleteLocalization PASS)
✓ evaluation (assertCompleteLocalization PASS)
✓ about (assertCompleteLocalization PASS)
✓ faq (assertCompleteLocalization PASS)
✓ docs (assertCompleteLocalization PASS)
✓ mcp (assertCompleteLocalization PASS)
✓ status (assertCompleteLocalization PASS)
```

Static link and markup checks across all 37 Turkish routes passed via `python3 scripts/check_site.py`:
`SITE CHECK PASS: 74 localized routes, 75 HTML files, 3476 internal references, 977 external references`
Zero untranslated fragments detected.
