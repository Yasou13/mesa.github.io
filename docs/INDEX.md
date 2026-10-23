# MESA Documentation & Reports Index

This index provides a comprehensive map of active technical documentation, operational runbooks, historical audit logs, and test evidence across the MESA repository.

---

## 1. Active Specifications & Architectural Guidance

Authoritative documentation representing the current production implementation:

| Document | Topic | Description |
| :--- | :--- | :--- |
| [`docs/localization.md`](file:///home/yasin/Desktop/mesa_website/photos/site/docs/localization.md) | Localization | Architecture of the 4 translation tiers (UI chrome, product components, articles, synced docs). |
| [`docs/architecture/CONTENT_PLATFORM.md`](file:///home/yasin/Desktop/mesa_website/photos/site/docs/architecture/CONTENT_PLATFORM.md) | CMS & Platform | Database schema, RLS policies, revision control, and publication boundaries. |
| [`docs/architecture/DOCUMENTATION_SYNC.md`](file:///home/yasin/Desktop/mesa_website/photos/site/docs/architecture/DOCUMENTATION_SYNC.md) | Documentation Sync | Protocol for fetching and validating docs from upstream repositories at immutable commits. |
| [`content/articles/README.md`](file:///home/yasin/Desktop/mesa_website/photos/site/content/articles/README.md) | Article Workflow | Canonical Markdown article editing, frontmatter schema, and slug vs ID mappings. |
| [`docs/admin/CMS_USER_GUIDE.md`](file:///home/yasin/Desktop/mesa_website/photos/site/docs/admin/CMS_USER_GUIDE.md) | Content Management | Manual for editors and admins using `/admin/` and `/tr/admin/`. |
| [`docs/admin/ADMIN_AUTH_SETUP.md`](file:///home/yasin/Desktop/mesa_website/photos/site/docs/admin/ADMIN_AUTH_SETUP.md) | Authentication Setup | Production setup guide for Supabase Auth, SMTP, and GitHub environment variables. |
| [`docs/admin/DEPLOYMENT_SETUP.md`](file:///home/yasin/Desktop/mesa_website/photos/site/docs/admin/DEPLOYMENT_SETUP.md) | Deployment | CI/CD pipeline, GitHub Pages configuration, and release automation. |
| [`docs/security/CMS_SECURITY.md`](file:///home/yasin/Desktop/mesa_website/photos/site/docs/security/CMS_SECURITY.md) | Security Policy | Threat model, CSP headers, rate limits, and RLS privilege isolation. |
| [`docs/security/MESA_ADMIN_LOGIN_VERIFICATION.md`](file:///home/yasin/Desktop/mesa_website/photos/site/docs/security/MESA_ADMIN_LOGIN_VERIFICATION.md) | Auth Verification | Security audit matrix for production administrator authentication. |

---

## 2. Verification Scripts & Operational Tooling

Key operational scripts maintained in `scripts/`:

| Script | Purpose |
| :--- | :--- |
| `scripts/sync_articles.py` | Tri-source synchronizer (`--check`, `--from-markdown`, `--from-hub`) for articles. |
| `scripts/sync_docs.py` | Documentation synchronizer (`--fallback-cache`) pulling from upstream repos. |
| `scripts/build_site.py` | Static site builder producing Pages deployment bundle (`--verify-articles`). |
| `scripts/check_site.py` | Comprehensive route, link, anchor, and metadata integrity validator. |
| `scripts/verify_admin_setup.py` | Diagnostic tool testing Supabase endpoints, RLS draft boundaries, and admin credentials. |
| `scripts/bundle_admin.mjs` | Deterministic bundler for `dist/admin.js` using esbuild. |

---

## 3. Historical Audit Logs & Dated Claims (Archival)

The following files represent point-in-time audit evidence, preserved for compliance and provenance:

- [GEO / SEO baseline inventory](geo-audit-baseline.md) — 23 October 2026, before-change route inventory.
- [GEO / SEO implementation report](geo-implementation-report.md) — changes, validation, measurement and 90-day follow-up.
- [Visibility query pool](geo/query-pool.csv) and [results template](geo/results-template.csv) — manual EN/TR measurement.

- **Root Audits**:
  - `AUDIT.md`: Initial website audit and remediation baseline (2026-10-01).
  - `CLAIMS.md`: Public claim verification table against Core 0.7.1 and V4 contract (2026-10-01).
- **Audit Reports (`docs/audits/`)**:
  - `MESA_WEBSITE_FULL_AUDIT.md`: Complete defect log and priority triage.
  - `MESA_VERSION_ACCURACY_REPORT.md`: Version alignment across ecosystem components.
  - `MESA_CMS_SECURITY_REPORT.md`: Security analysis of early CMS endpoints and RLS functions.
  - `MESA_COSMIC_VISUAL_REPAIR.md`: Cosmic minimalism art direction and visual refinement logs.
- **Verification Reports (`reports/`)**:
  - `reports/website-v080-alignment/`: Comprehensive test logs and verification receipts for v0.8.0 release.
- **External Review Assets**:
  - `photos/review/`: Local high-resolution screenshot gallery (kept uncommitted to avoid Git repo bloat).
