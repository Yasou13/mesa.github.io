# MESA CMS Security Specification
**Threat Model, Authentication, Row-Level Security, and Sanitization**

---

## 1. Security Architecture & Threat Model

The MESA website is hosted on GitHub Pages as a static site. Because all frontend source files (including `/admin/index.html`) are technically downloadable by anyone, **security is enforced entirely at the backend layer** (Supabase Auth and PostgreSQL Row Level Security), never by route obscurity.

### Core Security Rules
1. **Never Trust the Client**: Hiding the `/admin/` URL from navigation is a convenience, not a security boundary. All data access and mutations require cryptographic verification of caller claims via Supabase JWTs.
2. **Strict Least Privilege**: Editors cannot publish articles, restore unapproved revisions, or modify system settings without explicit `ADMIN` role assignment verified by PostgreSQL database triggers.
3. **No Private Draft Exposure**: Anonymous users can only query articles where `status = 'published'`. Drafts, revision notes, author IDs, and unreleased documentation cannot be inspected or leaked.
4. **Secret Key Isolation**:
   - `SUPABASE_ANON_KEY`: Safe for public client use; restricted by RLS policies.
   - `SUPABASE_SERVICE_ROLE_KEY`: **Never** provided to browser JavaScript. Only used in trusted GitHub Actions or Supabase Edge Functions.
   - `GH_DISPATCH_TOKEN`: Stored only as an encrypted secret in GitHub Actions or Edge Functions.

---

## 2. Authentication & Role-Based Access Control (RBAC)

Authentication is powered by Supabase Auth using PKCE / secure JWTs.

### 2.1 Role Hierarchy
- **`ADMIN`**:
  - Full access to all articles (drafts, published, archived).
  - Can publish articles and trigger static deployments.
  - Can manage categories, tags, and media assets.
  - Can invite users and assign `EDITOR` roles.
  - Can restore historical revisions and view audit logs.
- **`EDITOR`**:
  - Can create and edit articles.
  - Can save drafts and view live editorial previews.
  - Can upload article images to the media bucket.
  - Cannot publish directly to production.
  - Cannot assign roles or access audit events.
- **`PUBLIC` / Anonymous**:
  - Can only read static HTML pages generated on GitHub Pages CDN.
  - Cannot read unpublished articles from Supabase.
  - Cannot write to any table or storage bucket.

### 2.2 Account Creation Policy
- Public registration is permanently **disabled** in Supabase Auth configuration (`enable_signup = false`).
- New editors must be explicitly created by an `ADMIN` through the Supabase Dashboard or invited via email.

---

## 3. Row-Level Security (RLS) Policies

All tables have RLS enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).

```sql
-- Helper function to check role in editor_roles table
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.editor_roles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 1. Anonymous / Public Access: Only published articles
CREATE POLICY "Public can view published articles"
  ON public.articles FOR SELECT
  USING (status = 'published');

-- 2. Editor Access: Can view all articles and update own drafts
CREATE POLICY "Editors can view all articles"
  ON public.articles FOR SELECT
  TO authenticated
  USING (public.get_user_role() IN ('EDITOR', 'ADMIN'));

CREATE POLICY "Editors can update own drafts"
  ON public.articles FOR UPDATE
  TO authenticated
  USING (
    public.get_user_role() = 'ADMIN' OR
    (public.get_user_role() = 'EDITOR' AND author_id = auth.uid() AND status IN ('draft', 'ready_to_publish'))
  );

-- 3. Admin Access: Can insert, update status to published, delete
CREATE POLICY "Admins full management"
  ON public.articles FOR ALL
  TO authenticated
  USING (public.get_user_role() = 'ADMIN');
```

---

## 4. Input Sanitization & Content Security

### 4.1 Safe Markdown Parsing (`scripts/markdown_engine.mjs`)
- All user-supplied Markdown is parsed through a strict zero-dependency parser.
- All text outside authorized formatting tokens is escaped via `escapeHtml()`:
  - `<` becomes `&lt;`
  - `>` becomes `&gt;`
  - `&` becomes `&amp;`
  - `"` becomes `&quot;`
  - `'` becomes `&#39;`
- **Zero Executable Code**: Raw `<script>`, `<iframe>`, `onload=`, or `<object>` tags are stripped or HTML-escaped.
- External links automatically receive `target="_blank" rel="noopener noreferrer"` to prevent tab-nabbing vulnerabilities.

### 4.2 Media Upload Validation
- Permitted MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`.
- Executable files (`.exe`, `.sh`, `.php`, `.js`, `.py`) are rejected by Supabase Storage bucket policy rules.
- Maximum file size: 5 MB per image asset.

---

## 5. Audit Logging & Compliance

Every privileged action writes an immutable record to `audit_events`:
- Timestamp (UTC)
- User ID (`auth.uid()`)
- Event Type (`ARTICLE_PUBLISHED`, `REVISION_RESTORED`, `MEDIA_DELETED`, `ROLE_CHANGED`)
- Entity Type & Entity ID
- Client IP address and User Agent

Logs cannot be updated or deleted by `EDITOR` users.
