# MESA administrator login verification

16 October 2026, Europe/Istanbul. **Production authentication: BLOCKED / UNVERIFIED.** No configured Supabase URL/public key pair or owner test account was supplied to this build. No production migration, sign-in, email delivery, deployment or storage operation was performed.

## Implemented locally

- `scripts/render_admin.mjs`: bilingual `/admin/` and `/tr/admin/`, real forms, disabled without configuration/JavaScript, honest status, no signup, `noindex`, restrictive CSP and no-referrer policy.
- `scripts/admin/app.mjs`: official Supabase SDK password login, session refresh, Auth identity validation, server-side ADMIN check, logout, expiry/role-loss cleanup, loading/error states, PKCE password recovery and password update. Callback codes are removed from the URL. Sessions are tab-scoped. Failed remote logout explicitly reports unconfirmed server revocation while clearing local credentials.
- `scripts/admin/service.mjs`: `getUser()` then PostgreSQL `is_admin()` before each private request; actual RLS enforces article/media/job access. Existing draft/ready edits use allowlisted fields and `updated_at` optimistic concurrency. Published articles cannot be edited/published by this client. Untrusted content is rendered as text, not HTML.
- `scripts/admin/config.mjs`: only HTTPS origins (loopback exception), complete public config pair and publishable/anon keys accepted. Privileged key formats rejected. Pages workflow passes only the two public repository variables. No credential was added.
- `supabase/config.toml`: isolated local setup prepared, signup disabled. Full local Auth stack **NOT RUN**. Existing secure migrations retained unchanged; SQL coverage extended for private media and revoked roles.

## Evidence and limits

| Test | Status | Scope |
|---|---|---|
| Public configuration / privileged-key rejection / private-operation guards / stale writes | PASS | Six Node tests in `scripts/tests/admin.test.mjs` |
| Real SDK + browser login/logout/recovery/session/private access | PASS | 40 EN/TR checks with isolated synthetic protocol responses; `scripts/tests/admin_browser.mjs` |
| Invalid password, unassigned role, invalid user, unavailable role service | PASS | No private article request before identity and role verification |
| Expired token refresh and refresh rejection | PASS | Actual SDK exercised against isolated response fixture |
| PKCE reset, invalid verifier, password update, reset failure | PASS | Protocol fixture only; no real mail sent |
| Private title XSS, draft save, stale conflict, media/job listing, revoked-role cleanup | PASS | Browser fixture; real RLS separately below |
| Anonymous drafts/media, editor self-promotion, direct publication, admin job insertion, revoked admin | PASS | Real PostgreSQL RLS in network-isolated disposable container; `docs/tests/evidence/cms-authorization.log` |
| Public artifact credential patterns | PASS | 190 text artifacts; no recognized privileged credentials. Pattern scan is not a universal secret absence proof. |
| Real hosted Auth, JWT verification, token rotation/revocation, SMTP recovery | BLOCKED | Backend/owner configuration absent |
| Hosted RLS/grants and private Storage bucket/object policies | UNVERIFIED | No production connection; no upload bucket created |
| Full local Supabase stack | NOT RUN | Config prepared; protocol fixture is not an Auth server |

The SQL fixture simulates `auth.uid()` claims to test policies. It does not validate JWT signatures or replace a hosted integration test. Browser mocks cannot prove an owner can sign in. Existing access JWTs can survive logout until expiry; immediate role revocation is enforced on subsequent RLS requests.

## CMS access truth table

| Feature | Local code | Actual configured backend |
|---|---|---|
| Authenticated workspace | Implemented | BLOCKED |
| Article list/full record load | Implemented, up to 100 records | BLOCKED |
| Existing draft/ready editing | Implemented, conflict detection | BLOCKED |
| Published articles | Read-only | BLOCKED |
| Private media metadata | Read-only listing | BLOCKED |
| Publication jobs | Read-only listing | BLOCKED |
| Full new-article workflow, immutable revision/restore | NOT IMPLEMENTED | BLOCKED |
| File upload/download and safe media processing | NOT IMPLEMENTED | BLOCKED |
| Publishing/export/dispatch/deploy receipts/rollback | NOT IMPLEMENTED | BLOCKED |

Public publication source remains `content/hub.json`. Draft saves never claim to publish. No frontend role badge is treated as authorization. No service-role key or GitHub dispatch credential is delivered to the browser.

Exact setup and staging acceptance steps: [ADMIN_AUTH_SETUP.md](../admin/ADMIN_AUTH_SETUP.md). Owner must apply both migrations, disable signup, provision an ADMIN role through trusted administration, configure exact EN/TR recovery redirects and working SMTP, set the two public build variables, and complete real staging sign-in/recovery/RLS verification.

**Can the owner actually log in using the configured backend? Not verified; this build has no configured backend and deliberately disables sign-in.** The client and existing RLS integration are implemented; production login must not be labelled COMPLETE.

Implementation history: `4e5a75a` baseline audit; `cd9a594` shared engine; `687cf9f` global/mobile integration; `074b350` Auth/CMS and verification repairs. Final metrics and persistent before/after screenshots: [regression report](../tests/MESA_VISUAL_REGRESSION_REPORT.md).
