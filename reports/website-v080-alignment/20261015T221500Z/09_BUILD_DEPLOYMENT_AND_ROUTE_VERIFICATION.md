# 09 — Build, Deployment, and Route Verification

**Run ID:** `20261015T221500Z`  
**Execution Timestamp:** 2026-10-15T22:30:00+03:00  
**Target Baseline:** MESA Core v0.8.0  
**Repository Inspected:** `/home/yasin/Desktop/mesa_website/photos/site`  

---

## 1. Static Build Pipeline Verification

The website uses a plain-static build architecture fully compatible with GitHub Pages:

- **Build Script:** `scripts/build_site.py`
- **Static Page Renderer:** `scripts/render_site.mjs`
- **Output Artifact:** `_site` (for CI/CD deployment) and `dist` (for repository tracking)
- **Deployment Workflow:** `.github/workflows/pages.yml` (GitHub Pages standard workflow using `actions/configure-pages@v5`, `actions/upload-pages-artifact@v4`, `actions/deploy-pages@v4`)

### Build Execution Command
```bash
python3 scripts/build_site.py --output _site --site-url "https://mesamemory.dev/"
```

**Observed Result:**
- Output directory: `/home/yasin/Desktop/mesa_website/photos/site/_site`
- Base URL configured: `https://mesamemory.dev/`
- Rendered 74 localized static routes and `404.html`.
- Token replacement: All `{{SITE_URL}}` and `{{BASE_PATH}}` tokens resolved cleanly with zero leftover tokens.
- Exit code: `0` (Success).

---

## 2. Route & Link Integrity Verification (`check_site.py`)

Every static page, internal reference, asset path, anchor target, and external link was verified using the dependency-free static integrity checker:

```bash
python3 scripts/check_site.py _site
```

**Observed Output:**
```text
SITE CHECK PASS: 74 localized routes, 75 HTML files, 3476 internal references, 977 external references
```

### Checks Passed:
1. **Route Coverage:** All 74 localized routes (37 EN, 37 TR) exist as valid `index.html` files.
2. **Internal References:** All 3,476 relative URLs, asset links, and language toggles resolve to existing files.
3. **Anchor Fragments:** All internal URL hashes (e.g. `#retrieval`, `#security`, `#the-problem`, `#mesa-in-action`) resolve to valid element IDs.
4. **External Links:** All 977 external links specify `target="_blank"` and `rel="noopener noreferrer"`.
5. **No Forbidden Links:** Zero empty `href=""` or `javascript:void` instances.
6. **Sitemap & Robots:** `sitemap.xml` and `robots.txt` present and structurally valid.

---

## 3. Headless Browser Layout Verification (`check_browser_layout.mjs`)

Full browser-level layout, responsiveness, and interaction testing was executed across viewports using headless Google Chrome 155:

```bash
python3 -m http.server 8765 --bind 127.0.0.1 --directory _site &
node scripts/check_browser_layout.mjs --base-url http://127.0.0.1:8765/
```

**Observed Output:**
```text
BROWSER QA PASS: 74 localized routes, 12 homepage widths in EN/TR, navigation, fixture, hero crops (cold cache), reduced motion and image failure; no document overflow or unexpected broken images
```

### Test Scope:
- **74 Localized Routes:** Verified on Chrome rendering engine.
- **12 Homepage Viewport Widths:** 320, 390, 768, 799, 800, 801, 1024, 1099, 1100, 1101, 1440, 1920 px tested in both English and Turkish.
- **Responsive Navigation:** Mobile hamburger menu open/escape-close verified.
- **Interactive Disclosures:** Specimen plate details disclosure tested.
- **Image Decoding:** All WebP hero and diagram assets decoded without error.
- **Zero Document Overflow:** Horizontal scroll checks confirmed 0 px overflow across all tested widths.
- **Reduced Motion:** Confirmed visual stability with `@media (prefers-reduced-motion)`.

---

## 4. GitHub Pages Deployment Compatibility

1. **Custom Domain:** Verified `dist/CNAME` contains `mesamemory.dev`.
2. **Jekyll Bypass:** Verified `dist/.nojekyll` exists, ensuring directories with underscores or dots are not ignored by GitHub Pages.
3. **Workflow Parity:** The verified build commands in local testing match the steps defined in `.github/workflows/pages.yml`.
