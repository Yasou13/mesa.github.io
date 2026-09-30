# MESA ecosystem website

A dependency-free static landing page, ecosystem portal, documentation gateway,
and status surface for MESA. Published files are authored in `dist/`; the Pages
workflow produces `_site/` with deployment-specific metadata.

## Routes

- `/` — Home
- `/mesa/` — MESA Core
- `/ecosystem/` — ecosystem overview
- `/data/` — MESA Data
- `/qa/` — MESA QA
- `/certification/` — Profile B scope and status
- `/law/` — MESA Law
- `/docs/` and `/docs/mcp/` — documentation gateway
- `/status/` — project status

## Local preview

Preview the source directly:

```bash
python3 -m http.server 8000 --directory dist
```

For an exact built artifact with metadata resolved to localhost:

```bash
python3 scripts/build_site.py
python3 scripts/check_site.py _site
python3 -m http.server 8000 --directory _site
```

Open `http://localhost:8000/`. Do not open pages with `file://`; nested routes,
the clipboard API, and 404 behavior should be tested through HTTP.

## GitHub Pages deployment

The workflow at `.github/workflows/pages.yml` uses the official custom Pages
workflow: checkout, Pages configuration, static artifact upload, and deploy.

1. Push this repository to GitHub and merge the site branch to `main`.
2. In **Settings → Pages → Build and deployment**, choose **GitHub Actions**.
3. Push to `main` or run the workflow manually.

The build derives its URL from `GITHUB_REPOSITORY`:

- Repository `Yasou13/Yasou13.github.io` publishes as the user site at
  `https://yasou13.github.io/`.
- Any other repository name publishes as a project site at
  `https://yasou13.github.io/<repository>/`.

Navigation and assets use page-relative URLs, so both modes work. The build
also writes the correct absolute Open Graph URL, sitemap URLs, robots sitemap
location, and 404 base path for the selected repository name.

The current Git remote is an internal preview remote. It is intentionally not
changed or used for live deployment by this rebuild.

## Verification

```bash
python3 scripts/build_site.py --repository Yasou13/Yasou13.github.io
python3 scripts/check_site.py _site
python3 scripts/build_site.py --repository Yasou13/mesa-website
python3 scripts/check_site.py _site
git diff --check
```

`scripts/check_site.py` verifies route entry points, local assets, metadata,
known dynamic route references and anchors, forbidden empty links, and legacy
brand absence in the published artifact.
