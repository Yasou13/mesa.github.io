> **Implementation status (independent audit, 2026-10-15):** This document describes the intended architecture, not a verified working CMS. Authentication, server-side editing, immutable publication snapshots, database export, privileged dispatch, deployment callbacks and storage policies are not implemented. `/admin/` is disabled and reports this limitation. Do not enable production publishing from these instructions. See `docs/audits/MESA_CMS_SECURITY_REPORT.md` for tested boundaries.

# MESA CMS & Publishing Setup Guide
**Infrastructure Provisioning, Supabase Database Configuration, and GitHub Actions Secrets**

---

## 1. Required External Accounts & Dependencies

To connect the CMS to production deployment, the repository owner must configure:

1. **Supabase Project** (Free or Pro tier)
   - PostgreSQL Database
   - Supabase Auth (Email authentication)
   - Supabase Storage (Bucket: `article-media`)
2. **GitHub Repository Settings**
   - Repository Secrets for GitHub Actions deployment
   - Fine-grained Personal Access Token (PAT) for workflow dispatches

*Note: All local builds and documentation synchronization function 100% offline without these external services. This setup is only required for live browser-based publishing.*

---

## 2. Step-by-Step Setup Instructions

### Step 1: Create Supabase Project
1. Log in to [supabase.com](https://supabase.com/) and create a new project (e.g. `mesa-content-platform`).
2. Navigate to **Project Settings -> API** and copy:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **anon / public key** (client-safe)
   - **service_role key** (secret, privileged)

### Step 2: Apply Database Schema Migration
1. In the Supabase Dashboard, open the **SQL Editor**.
2. Copy and execute the contents of:
   ```
   supabase/migrations/20261015000000_content_platform_schema.sql
   ```
   This creates the tables (`editor_roles`, `articles`, `article_revisions`, `categories`, `tags`, `media_assets`, `publication_jobs`, `audit_events`) and enforces Row-Level Security (RLS).
3. Next, copy and execute the contents of:
   ```
   supabase/seed.sql
   ```
   This seeds the database with all 15 existing published MESA Learn articles, taxonomy categories, and tags.

### Step 3: Configure Storage Bucket
1. In the Supabase Dashboard, navigate to **Storage -> New Bucket**.
2. Name the bucket `article-media`.
3. Toggle **Public Bucket** to ON (so published images are viewable by public readers).
4. Under **Storage Policies**, add an insert policy:
   - Allowed operation: `INSERT`
   - Target role: `authenticated`
   - Check condition: `auth.uid() IS NOT NULL`

### Step 4: Create Initial Admin Account
1. In Supabase Dashboard, navigate to **Authentication -> Users -> Add User**.
2. Create your admin user with your email and a strong password.
3. Copy the generated `User UID`.
4. Open the SQL Editor and grant this user the `ADMIN` role:
   ```sql
   INSERT INTO public.editor_roles (user_id, role)
   VALUES ('<PASTE_USER_UID_HERE>', 'ADMIN');
   ```

### Step 5: Configure GitHub Secrets
In your GitHub repository (`https://github.com/Yasou13/mesa.github.io`), go to **Settings -> Secrets and variables -> Actions -> New repository secret**:

| Secret Name | Value | Description |
| :--- | :--- | :--- |
| `SUPABASE_URL` | `https://<YOUR-PROJECT>.supabase.co` | Supabase API endpoint |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Privileged service key (CI only) |
| `GH_DISPATCH_TOKEN` | `github_pat_...` | Fine-grained PAT with `actions:write` |

---

## 3. GitHub Actions Publishing Workflow

The publishing pipeline is integrated into `.github/workflows/pages.yml`. When an admin publishes an article, the CMS triggers `repository_dispatch`:

```yaml
name: Deploy MESA Static Pages

on:
  push:
    branches: [main]
  repository_dispatch:
    types: [publish_article]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Synchronize Documentation
        run: python3 scripts/sync_docs.py

      - name: Build Static Site
        run: python3 scripts/build_site.py --site-url "https://yasou13.github.io/mesa.github.io/"

      - name: Validate Generated Site
        run: python3 scripts/check_site.py _site

      - name: Upload Pages Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: _site

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 4. Troubleshooting & Fallback

- **Offline / Local Authoring**:
  If Supabase is unreachable, you can author articles directly in `content/articles/en/*.md` and `content/articles/tr/*.md`. The build script will compile them into `content/hub.json` and generate static pages without database connectivity.
- **Failed Build Recovery**:
  If `check_site.py` detects a broken link or malformed heading during publication, GitHub Actions terminates the job immediately. GitHub Pages continues serving the last verified deployment snapshot without downtime.
