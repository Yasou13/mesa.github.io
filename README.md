# MESA ecosystem website

The official static introduction, ecosystem map, documentation gateway, and
status surface for MESA. The site is dependency-free at runtime and uses real
semantic HTML; JavaScript only enhances the mobile menu and copy buttons.

Current deployment target: `https://mesamemory.dev/`. The GitHub Pages project
URL redirects to this configured custom domain.

## Architecture

- `site-data.json` — version, release status, repository URLs, route metadata
- `scripts/render_site.mjs` — shared layout and static page content renderer
- `dist/` — committed static HTML plus CSS, JavaScript, favicon, and social card
- `scripts/build_site.py` — produces a deployment-specific `_site/` artifact
- `scripts/check_site.py` — validates static content, metadata, links, anchors,
  assets, and legacy-brand absence

No React, Vue, Next.js, CMS, backend, or npm dependencies are used. Node.js is
needed only to run the dependency-free static renderer during a build.

## Routes

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

## Local preview

Build the exact deployed artifact, validate it, and serve it over HTTP:

```bash
python3 scripts/build_site.py --site-url https://mesamemory.dev/
python3 scripts/check_site.py _site
python3 -m http.server 8000 --directory _site
```

Open `http://localhost:8000/`. Do not use `file://`; nested routes, clipboard
behavior, and 404 handling should be tested through HTTP.

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
anchors, valid JSON-LD, complete sitemap coverage, safe external-link
attributes, and the absence of legacy branding in the published artifact.

## Updating public project data

Edit `site-data.json` for the Core version, maturity, certification summary,
status date, repository URLs, maintainer identity, or route metadata. Do not
duplicate these values in generated HTML. Then update source-backed copy in
`scripts/render_site.mjs`, record claim evidence in `CLAIMS.md`, regenerate
`dist/`, and run both production and project-site validation modes.

The social card source is `dist/og-image.svg`; the committed
`dist/og-image.png` is the 1200×630 published asset. `dist/CNAME` records the
custom domain, while the build still renders URLs from the Pages-reported
deployment base so preview/fallback artifacts remain testable.
