# MESA Publishing Pipeline Architecture
**Immutable Lifecycle, Build Dispatch, and Deterministic Deployment**

---

## 1. Publishing Lifecycle Overview

The MESA publishing pipeline bridges the dynamic CMS editorial dashboard with GitHub Pages static hosting. It enforces strict authorization, state progression, and build gates to ensure no unverified or broken content is ever visible to public readers.

```
+-----------------------------------------------------------------------------------+
|                                 CMS OPERATOR (BROWSER)                            |
|                                                                                   |
|  [ Write Content ] ---> [ Autosave / Draft ] ---> [ Live Markdown Preview ]       |
+-------------------------------------------------------------+---------------------+
                                                              | Click "Publish"
                                                              v
+-----------------------------------------------------------------------------------+
|                             SUPABASE BACKEND / EDGE FUNCTION                      |
|                                                                                   |
|  1. Verify Session & ADMIN/EDITOR Role (JWT + RLS)                               |
|  2. Validate Title, Slug, Markdown Body, SEO Fields                               |
|  3. Create Immutable Record in `article_revisions`                                 |
|  4. Set Status: `deployment_pending`                                              |
|  5. Insert Job into `publication_jobs` (State: `QUEUED`)                           |
|  6. Trigger GitHub Actions via `repository_dispatch` (`publish_article`)          |
+-------------------------------------------------------------+---------------------+
                                                              | Dispatch event
                                                              v
+-----------------------------------------------------------------------------------+
|                           GITHUB ACTIONS CI/CD (.github/workflows/pages.yml)      |
|                                                                                   |
|  1. Sync Docs: `python3 scripts/sync_docs.py`                                     |
|  2. Export Database / Git Articles: Markdown Frontmatter Files                    |
|  3. Build Site: `python3 scripts/build_site.py --site-url <BASE_URL>`             |
|  4. Generate Search Index: `node scripts/generate_search_index.mjs`                |
|  5. Strict Audit Gate: `python3 scripts/check_site.py _site`                      |
|     * If check fails: Terminate build immediately, do NOT deploy.                |
|  6. Deploy: Upload artifact to GitHub Pages CDN                                    |
+-------------------------------------------------------------+---------------------+
                                                              |
                   +------------------------------------------+--------------------+
                   | Build Success                                                 | Build Failure
                   v                                                               v
+---------------------------------------+      +-----------------------------------+
|          SUPABASE STATUS UPDATE       |      |       SUPABASE STATUS UPDATE      |
|                                       |      |                                   |
| - Set Status: `published`             |      | - Set Status: `deployment_failed` |
| - Job Status: `COMPLETED`             |      | - Job Status: `FAILED` (Log saved)|
| - Public Page Live on CDN             |      | - Last Published Version Unharmed |
+---------------------------------------+      +-----------------------------------+
```

---

## 2. State Machine & Transitions

An article can exist in one of six explicit states:

| State | Publicly Reachable? | In Sitemap? | In Search Index? | Description |
| :--- | :--- | :--- | :--- | :--- |
| **`draft`** | No | No | No | Work in progress. Saved to database and browser local storage. Only accessible to author and editors in CMS. |
| **`ready_to_publish`** | No | No | No | Editor marked content ready for review. Awaiting Admin approval. |
| **`deployment_pending`**| No | No | No | Admin initiated publish. Build job dispatched to GitHub Actions. |
| **`published`** | **Yes** | **Yes** | **Yes** | Successfully rendered into static HTML and verified by `check_site.py`. |
| **`deployment_failed`** | No | No | No | Build gate failed. Error log captured in CMS. Previous public site untouched. |
| **`unpublished`** | No | No | No | Withdrawn from public circulation. Static rebuild purges route from CDN and sitemap. |

---

## 3. Idempotency & Concurrency Control

1. **Deterministic Build Gate**:
   - The publishing trigger never directly edits production HTML. It triggers `pages.yml`.
   - If two publishing actions occur in close succession, GitHub Actions serializes deployment runs.
2. **Immutable Revisions**:
   - Every publish creates an immutable record in `article_revisions` containing `revision_number`, `body_markdown`, and a JSON snapshot of metadata.
   - Restoring a previous version does not overwrite history; it creates a new revision pointing to the historical payload.
3. **Rollback Guarantee**:
   - Because GitHub Pages retains deployment snapshots, a failed build automatically aborts the deployment step, leaving the currently active site completely undisturbed.

---

## 4. Edge Function Dispatch Contract

Privileged operations (such as triggering GitHub Actions) are mediated through a Supabase Edge Function (`dispatch-publish`):

```typescript
// supabase/functions/dispatch-publish/index.ts (Sample Signature)
Deno.serve(async (req) => {
  // 1. Verify caller has ADMIN role from JWT
  const user = await verifyAdminUser(req);
  if (!user) return new Response('Unauthorized', { status: 403 });

  const { articleId } = await req.json();

  // 2. Fetch article and create revision snapshot
  const revision = await createRevisionSnapshot(articleId);

  // 3. Dispatch to GitHub Actions
  const ghResponse = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/dispatches`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('GH_DISPATCH_TOKEN')}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'MESA-CMS-Dispatcher'
    },
    body: JSON.stringify({
      event_type: 'publish_article',
      client_payload: { article_id: articleId, revision_id: revision.id }
    })
  });

  return new Response(JSON.stringify({ success: true, status: 'dispatched' }), { status: 200 });
});
```
*Note: Secrets (`GH_DISPATCH_TOKEN`) are held exclusively in the secure Edge Function runtime and are never exposed to client-side JavaScript.*
