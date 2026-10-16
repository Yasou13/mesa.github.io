# Administrator authentication setup

The static page uses the official `@supabase/supabase-js` 2.118.0 SDK, bundled locally in `dist/admin.js`. Only `/admin/` and `/tr/admin/` load it. Supabase Auth is the authentication backend; PostgREST and the existing RLS policies are the authorization backend. There is no local password database.

## Owner setup (not performed against production)

1. Use the intended Supabase project. Apply both files in `supabase/migrations/` in timestamp order after testing on an isolated environment. Do not expose a project with only the first migration: its publication policy is unsafe. Verify the second migration's draft-only INSERT/UPDATE policies and revoked job INSERT policy.
2. Disable public signup and anonymous sign-in in Auth settings. Create/invite the owner through the Supabase dashboard, confirm the email and establish a password. Do not enable a public signup endpoint in the website.
3. In a trusted SQL session, assign that existing `auth.users.id` an `ADMIN` row in `public.editor_roles`. The browser must never provision its own role. Example, substituting the owner's actual UUID/email:

   ```sql
   insert into public.editor_roles(user_id,email,role)
   values ('OWNER_AUTH_USER_UUID','OWNER_EMAIL','ADMIN');
   ```

4. Set Auth Site URL to the real site origin. Add **exact** reset redirects `https://mesamemory.dev/admin/?recovery=1` and `https://mesamemory.dev/tr/admin/?recovery=1`. Project-site installations need their repository prefix in both URLs. Configure working SMTP, mail delivery and rate limits. PKCE reset links must be opened in the same browser/tab session that requested them; an expired/missing verifier requires a new reset request.
5. Set GitHub repository **variables** `MESA_SUPABASE_URL` and `MESA_SUPABASE_PUBLISHABLE_KEY`. These are public values; use `sb_publishable_…` (or legacy JWT with `role=anon`). No service-role key, secret API key, DB password or GitHub credential belongs here. The build rejects missing pairs and privileged key formats. The Pages build now passes these two variables explicitly.
6. Build locally with the same variables in the process environment. `python3 scripts/build_site.py --site-url https://mesamemory.dev/`. Without them, both routes remain disabled and no auth request is issued. Never commit a real authenticated session or put it in public test evidence.
7. Verify a real owner sign-in, role rejection, refresh, logout, email recovery and database reads in a staging deployment. Run the RLS checks against that actual backend before marking production verified. These checks still require owner configuration and are **BLOCKED** here.

## Local development

`supabase/config.toml` describes a separate local environment (54321 API, 54322 PostgreSQL, no public signup). It is prepared but the full Supabase CLI stack was **NOT RUN** in this task. Start it with the installed Supabase CLI, apply migrations and create a local test owner through trusted administration. Serve the website on `localhost:8000`, and use the local stack's publishable/anon key through the same two environment variables. Never connect the isolated fixtures to production.

Rebuild the committed admin bundle after changing `scripts/admin/`: `npm ci --ignore-scripts`, then `npm run build:admin`. Lockfile pins dependencies. Ordinary static builds use the committed bundle and need no npm install or external CDN.

## CMS boundary

After server-verified ADMIN login: list up to 100 article records; load full real article bodies; edit existing draft/ready title, summary and Markdown with optimistic concurrency; inspect private media metadata and publication-job status. Published records are read-only. Missing records stay empty; no articles are synthesized from search results.

Creating a full article, revision restore, safe image upload/download, publication snapshots, trusted dispatch, exporter, deployment receipts and rollback are **not implemented**. Publication and upload controls are deliberately absent. `content/hub.json` remains the public site's source. A saved database draft is not a published website update. Do not weaken RLS to make a button appear functional.

Sessions use `sessionStorage` (tab lifetime), not persistent localStorage. Access tokens are revalidated with Auth `getUser()` and server `is_admin()` before each private operation. RLS is the actual enforcement layer. On expiry, role loss or logout the UI erases private fields; failed remote logout removes local credentials and explicitly reports that server revocation is unconfirmed. Existing JWTs may remain usable until expiry, as with Supabase generally. Revoke roles immediately in the DB when access must end; RLS checks roles per request.
