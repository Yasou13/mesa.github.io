# MESA ecosystem website

The official static introduction, ecosystem map, documentation gateway, and
status surface for MESA. The site is dependency-free at runtime and uses real
semantic HTML; JavaScript only enhances the mobile menu and copy buttons.

Current deployment target: `https://mesamemory.dev/`. The GitHub Pages project
URL redirects to this configured custom domain.

## Architecture

- `site-data.json` — version, release status, repository URLs, route metadata
- `content/tr.json` — complete Turkish metadata and build-time translation map
- `content/hub.json` — validated bilingual content model for Learn, Research,
  Guides, Glossary, Tools, Methodology, relationships, and publication state
- `content/media-scenes.json` — asset-optional five-scene media contract, focal
  points, crop behavior, overlays, and fallback state
- `docs/localization-glossary.md` — agreed English/Turkish technical terminology
- `scripts/render_site.mjs` — shared layout and static page content renderer
- `dist/` — committed static HTML plus CSS, JavaScript, favicon, and social card
- `dist/fonts/` — self-hosted OFL Instrument Sans, Instrument Serif, and Commit Mono assets plus licenses
- `scripts/build_site.py` — produces a deployment-specific `_site/` artifact
- `scripts/check_site.py` — validates static content, metadata, links, anchors,
  assets, and legacy-brand absence

No React, Vue, Next.js, CMS, backend, or npm dependencies are used. Node.js is
needed only to run the dependency-free static renderer during a build.

The homepage uses five semantic scene boundaries and a reusable decorative
media layer. Until final posters or videos are configured, it emits only static
dark CSS surfaces and makes no missing asset requests. Future media remains
separate from readable HTML, cannot intercept input, and falls back to the
poster or static surface for reduced-motion, Save-Data, playback rejection, or
media errors. The complete contract is documented in
`docs/design/03_SCENE_STORYBOARD_AND_ASSET_CONTRACT.md`.

## Routes

English is the source and default language. Existing English URLs remain
unchanged. Every public route also has a static Turkish counterpart under
`/tr/`; for example, `/ecosystem/` maps to `/tr/ecosystem/`. Route slugs stay
the same in both languages. The EN/TR control preserves the current page.

- `/` — value proposition, problem, ecosystem, example path, and use cases
- `/how-it-works/` — simple public flow, verified retrieval fixture, technical path
- `/mesa/` — MESA Core
- `/ecosystem/` — ecosystem overview and component boundaries
- `/data/` — MESA Data
- `/qa/` — MESA QA
- `/certification/` — Profile B scope and current status
- `/law/` — MESA Law
- `/use-cases/` — realistic evaluation scenarios and project boundaries
- `/evaluation/` — QA versus E2E Certification and current evidence state
- `/docs/` and `/docs/mcp/` — documentation and MCP integration
- `/status/` — release and certification status
- `/about/` — project purpose, public maintainer identity, and contact path
- `/faq/` — concise product, architecture, interface, and status answers
- `/404.html` — project-site-safe custom 404

The same list is generated below `/tr/`, including `/tr/docs/mcp/`.

### Knowledge and research routes

The content hub is statically rendered in both languages. Index routes are
`/resources/`, `/learn/`, `/research/`, `/guides/`, `/glossary/`, `/tools/`,
and `/methodology/`, with matching `/tr/` routes. The initial reviewed detail
routes demonstrate each long-form template without inventing benchmark data:

- `/learn/semantic-search/`
- `/research/keyword-vs-semantic-search/` (planned protocol; no results)
- `/guides/verify-ai-yargitay-decision/`
- `/glossary/provenance/`
- `/methodology/retrieval-evaluation/`

Add future publications to `content/hub.json`. The renderer validates required
metadata, route and ID uniqueness, locale coverage, research-specific fields,
and relationship targets before writing HTML. Only non-draft, indexable entries
are rendered and added to the sitemap. Relationships produce related-content
links, while real EN/TR pairs receive reciprocal hreflang metadata.

## Local preview

Build the exact deployed artifact, validate it, and serve it over HTTP:

```bash
python3 scripts/build_site.py --site-url https://mesamemory.dev/
python3 scripts/check_site.py _site
python3 -m http.server 8000 --directory _site
```

Open `http://localhost:8000/` for English and `http://localhost:8000/tr/` for
Turkish. Nested routes such as `http://localhost:8000/tr/ecosystem/` must also
be tested. Do not use `file://`; nested routes, clipboard behavior, and 404
handling should be tested through HTTP.

To regenerate the committed `dist/` HTML after changing content or metadata:

```bash
node scripts/render_site.mjs \
  --output dist \
  --site-url https://mesamemory.dev/
```

## Build modes

The build accepts the exact public URL through `--site-url`. Without that
option, it derives a GitHub Pages fallback from `GITHUB_REPOSITORY` or
`--repository`:

- `Yasou13/Yasou13.github.io` → `https://yasou13.github.io/`
- `Yasou13/mesa.github.io` → `https://yasou13.github.io/mesa.github.io/`

Both modes render deployment-specific canonical URLs, Open Graph URLs,
social-image URLs, sitemap entries, robots metadata, internal navigation, and
404 links. Page and asset paths are not hard-coded to either deployment mode.
The production workflow uses the `base_url` reported by GitHub Pages, so a
configured custom domain such as `https://mesamemory.dev/` automatically wins
over these fallbacks.

## GitHub Pages deployment

The workflow in `.github/workflows/pages.yml` reads the configured Pages URL,
builds and validates against that exact origin/base path, then uploads and
deploys the static artifact with the official GitHub Pages actions.

One repository setting is required before the first deployment:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main` or manually run **Deploy MESA site to GitHub Pages**.

If `actions/configure-pages` reports `Get Pages site failed` with `Not Found`,
Pages has not yet been enabled for the repository. Select **GitHub Actions** in
the setting above, then rerun the failed workflow. The action's automatic
`enablement` option cannot use the default `GITHUB_TOKEN`; it requires a
separately managed token with additional administration permissions, so this
repository intentionally uses the safer one-time setting instead.

## Validation

Custom-domain production build:

```bash
python3 scripts/build_site.py \
  --output /tmp/mesa-pages-production \
  --site-url https://mesamemory.dev/
python3 scripts/check_site.py /tmp/mesa-pages-production
```

Project-site fallback build:

```bash
python3 scripts/build_site.py \
  --output /tmp/mesa-pages-project \
  --repository Yasou13/mesa.github.io
python3 scripts/check_site.py /tmp/mesa-pages-project
```

User-site build:

```bash
python3 scripts/build_site.py \
  --output /tmp/mesa-pages-user \
  --repository Yasou13/Yasou13.github.io
python3 scripts/check_site.py /tmp/mesa-pages-user
```

Additional checks:

```bash
node --check dist/app.js
node --check scripts/render_site.mjs
python3 -m compileall -q scripts
git diff --check
```

The checker requires real page text, one semantic `main` and `h1`, unique page
metadata, canonical/Open Graph/Twitter fields, valid internal files and
anchors, valid JSON-LD, both language route sets, matching `lang`, canonical,
hreflang, language-switch and sitemap pairs, safe external-link attributes,
and the absence of legacy branding in the published artifact.

## Localization workflow

English renderer copy remains the source. Turkish copy and metadata live in
`content/tr.json`; shared version, status, route, repository, code, and fixture
data remain in `site-data.json` or the renderer. The renderer produces complete
HTML for both languages and fails when a new English text node has no Turkish
translation or explicit intentional-English entry. This makes source-copy drift
visible during the build instead of silently falling back to English.

To edit a translation, update `content/tr.json` and keep terminology aligned
with `docs/localization-glossary.md`. To add a localized page, add its English
route metadata and renderer as usual, then add matching Turkish `title`,
`description`, and body strings. Run the production build and checker shown
above. Each page canonicalizes to itself; every pair exposes `en`, `tr`, and
English `x-default` alternates. The sitemap includes both URLs.

## Updating public project data

Edit `site-data.json` for the Core version, maturity, certification summary,
status date, repository URLs, maintainer identity, or route metadata. Do not
duplicate these values in generated HTML. Then update source-backed copy in
`scripts/render_site.mjs`, record claim evidence in `CLAIMS.md`, regenerate
`dist/`, and run both production and project-site validation modes.

The social card sources are `dist/og-image.svg` and `dist/og-image-tr.svg`;
their committed PNG files are the 1200×630 published assets. `dist/CNAME` records the
custom domain, while the build still renders URLs from the Pages-reported
deployment base so preview/fallback artifacts remain testable.
