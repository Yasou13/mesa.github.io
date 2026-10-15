# MESA Admin CMS — User Guide
**Operational Guide for Technical Writers, Editors, and Administrators**

---

## 1. Getting Started & Logging In

1. Open your browser and navigate to the admin portal:
   ```
   https://yasou13.github.io/mesa.github.io/admin/
   ```
   *(Or `http://localhost:8000/admin/` when running locally)*
2. Sign in with your registered email and password.
3. If this is a fresh setup or offline environment, click **"Offline Demo Mode"** to test all editing and preview workflows with local data.

---

## 2. Dashboard Overview

Once authenticated, the dashboard displays:
- **Publication Metrics**: Total articles, published live count, and active drafts.
- **Article Manager**: List of all articles with category tags, language flags (`EN` / `TR`), and publication status badges.
- **Action Toolbar**:
  - `+ New Article`: Create a new technical publication.
  - `Media Manager`: Upload and browse images.
  - `Sync Docs`: Trigger repository documentation synchronization.
  - `Sign Out`: Securely terminate your session.

---

## 3. Creating & Editing Articles

Click **"+ New Article"** to open the split-pane editor:

### 3.1 Metadata Configuration
- **Title**: Article headline (e.g., *Hybrid Retrieval Explained*).
- **Slug**: URL identifier (e.g., `hybrid-retrieval-explained`). Must be unique per language.
- **Language**: Select `English` or `Türkçe`.
- **Category**: Select from taxonomy (e.g., *Retrieval Systems*, *Memory Systems*, *Legal AI*).
- **Difficulty**: *Foundational*, *Intermediate*, or *Advanced*.
- **Author**: Maintainer or researcher name.
- **Estimated Reading Time**: In minutes.
- **Cover Image URL**: Link to an asset or uploaded media file.
- **SEO Title & Description**: Customized meta tags for search engines and social cards.

### 3.2 Authoring in Markdown
The left pane is the authoring editor, while the right pane shows the real-time live preview styled with MESA's Cosmic Minimalism typography.

**Supported Syntax Highlights**:
- **Headings**: `# Title`, `## Section`, `### Subsection` (H2 and H3 automatically generate anchors).
- **Code Blocks**:
  ````markdown
  ```python
  from mesa.retrieval import HybridRetriever
  retriever = HybridRetriever(profile="balanced")
  ```
  ````
- **Math Equations**: `$$ \text{RRF}(d) = \sum_{m \in M} \frac{1}{60 + r_m(d)} $$`
- **GitHub Callouts**:
  ```markdown
  > [!NOTE]
  > MESA uses true Reciprocal Rank Fusion across 4 signals.
  ```
- **Tables**: Use standard pipe syntax (`| Col 1 | Col 2 |`).
- **Autosave**: Content is automatically saved locally every 30 seconds to prevent accidental loss.

---

## 4. Revisions & Rollbacks

1. Every time you save an article, a numbered revision snapshot is created in `article_revisions`.
2. Click **"Revisions"** in the editor toolbar to open the revision history modal.
3. Inspect previous snapshots with timestamps and editor notes.
4. Click **"Restore Version"** to instantly revert the document to any prior state.

---

## 5. Media Asset Management

1. Click **"Media Manager"** from the dashboard or editor toolbar.
2. Drag and drop or browse to select an image (`.png`, `.jpg`, `.webp`, `.svg`, max 5 MB).
3. Once uploaded, click **"Copy Markdown Tag"** to get the formatted snippet:
   ```markdown
   ![Architecture Diagram](https://your-supabase-url/storage/v1/object/public/article-media/...)
   ```
4. Paste directly into your article content.

---

## 6. Publishing Workflow

1. When editing is complete, review the live preview on the right pane.
2. Click **"Save Draft"** if still finalizing changes.
3. Click **"Publish Article"** to initiate the deployment pipeline:
   - Status changes to `deployment_pending`.
   - A Publication Job is dispatched to GitHub Actions.
   - The static site builder generates the HTML page, builds the search index, and runs `check_site.py`.
   - Upon build completion, status updates to `published`.
4. To unpublish an article, click **"Unpublish"**; the route will be pruned upon the next static rebuild.
