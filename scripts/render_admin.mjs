import { escapeHtml } from './markdown_engine.mjs';
import { cosmicEnvironment } from './cosmic.mjs';

export function renderAdminPage({ assetBase = '../', language = 'en', config = null } = {}) {
  const tr = language === 'tr';
  const t = (en, turkish) => tr ? turkish : en;
  const base = escapeHtml(assetBase);
  const field = (id, label, type = 'text', autocomplete = '', extra = '') =>
    `<div class="form-group"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}"${autocomplete ? ` autocomplete="${autocomplete}"` : ''}${extra} required></div>`;

  return `<!doctype html><html lang="${language}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><meta name="referrer" content="no-referrer">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:; connect-src 'self'${config ? ' '+escapeHtml(config.url) : ''}; base-uri 'none'; form-action 'none'; object-src 'none'">
<title>${t('MESA Admin — Workspace','MESA Yönetim — Çalışma Alanı')}</title>
<meta name="description" content="${t('Private MESA administration. Authentication is required; publishing is blocked.','Özel MESA yönetimi. Kimlik doğrulama gerekir; yayınlama kapalıdır.')}">
<link rel="icon" href="${base}assets/mesa-mark.webp" type="image/webp">
<link rel="stylesheet" href="${base}styles.css"><link rel="stylesheet" href="${base}cosmic.css"><link rel="stylesheet" href="${base}admin.css">
</head><body>${cosmicEnvironment('admin')}
<header class="admin-header">
  <div class="admin-header__brand">
    <a class="logo" href="${base}${tr ? 'tr/' : ''}" aria-label="${tr ? 'MESA ana sayfa' : 'MESA home'}">
      <img src="${base}assets/mesa-mark.webp" alt="" width="36" height="36">
      <span>MESA</span>
    </a>
    <span class="admin-tag">${t('CMS Workspace','İçerik Yönetimi')}</span>
  </div>
  <div class="admin-header__nav">
    <a href="${base}${tr ? 'tr/' : ''}resources/" class="nav-link">${t('Resources','Kaynaklar')}</a>
    <a href="${base}${tr ? 'tr/' : ''}docs/" class="nav-link">${t('Docs','Dokümanlar')}</a>
    <div class="language-switch">
      <a href="${base}${tr ? 'admin/' : 'tr/admin/'}" lang="${tr ? 'en':'tr'}">${tr ? 'EN':'TR'}</a>
    </div>
  </div>
</header>

<main id="main-content" class="admin-shell">
  <div class="admin-hero">
    <p class="eyebrow">MESA · ${t('ADMINISTRATION','YÖNETİM')}</p>
    <h1>${t('Content Workspace','İçerik Çalışma Alanı')}</h1>
    <p id="admin-status" role="status" aria-live="polite">${config ? t('Checking your session…','Oturumunuz denetleniyor…') : t('Authentication is not configured. Sign-in is unavailable.','Kimlik doğrulama yapılandırılmamış. Giriş kullanılamıyor.')}</p>
  </div>

  <noscript><p class="admin-alert error">${t('JavaScript is required for secure sign-in. Public documentation remains available.','Güvenli giriş için JavaScript gerekir. Genel dokümantasyon kullanılabilir.')}</p></noscript>

  <section id="login-panel" class="admin-panel auth-panel" aria-labelledby="login-title">
    <h2 id="login-title">${t('Administrator sign-in','Yönetici girişi')}</h2>
    <p class="admin-panel__intro">${t('Sign in with your verified administrator credentials to access drafts and content.','Taslaklara ve içeriklere erişmek için onaylı yönetici bilgilerinizle giriş yapın.')}</p>
    <form id="login-form">
      <fieldset disabled>
        ${field('email',t('Email','E-posta'),'email','username')}
        ${field('password',t('Password','Parola'),'password','current-password')}
        <button class="button primary" type="submit">${t('Sign in','Giriş yap')}</button>
      </fieldset>
    </form>
    <button id="reset-request" class="button secondary" type="button" disabled>${t('Send password reset email','Parola sıfırlama e-postası gönder')}</button>
    <p class="admin-note">${t('Access is restricted to administrators invited by the website owner.','Erişim, site sahibinin davet ettiği yöneticilerle sınırlıdır.')}</p>
  </section>

  <section id="recovery-panel" class="admin-panel auth-panel" hidden aria-labelledby="recovery-title">
    <h2 id="recovery-title">${t('Choose a new password','Yeni parola belirleyin')}</h2>
    <form id="recovery-form">
      <fieldset disabled>
        ${field('new-password',t('New password (at least 12 characters)','Yeni parola (en az 12 karakter)'),'password','new-password')}
        ${field('confirm-password',t('Confirm password','Parolayı doğrulayın'),'password','new-password')}
        <button class="button primary" type="submit">${t('Update password','Parolayı güncelle')}</button>
      </fieldset>
    </form>
  </section>

  <section id="workspace" hidden aria-labelledby="workspace-title">
    <div class="workspace-topbar">
      <div>
        <h2 id="workspace-title">${t('Editorial Dashboard','Editöryal Panel')}</h2>
        <p class="user-info">${t('Signed in as','Oturum:')} <strong id="current-user-email"></strong> <span id="current-user-role" class="user-role-chip"></span></p>
      </div>
      <div class="topbar-actions">
        <a class="button secondary" href="${base}${tr ? 'tr/' : ''}learn/" target="_blank">${t('View Live Site ↗','Canlı Siteyi Gör ↗')}</a>
        <button id="logout" type="button" class="button secondary">${t('Sign out','Çıkış yap')}</button>
      </div>
    </div>

    <!-- Main Navigation Tabs -->
    <nav class="admin-tabs" aria-label="${t('Workspace views','Çalışma alanı sekmeleri')}">
      <button class="admin-tab active" data-tab="articles" type="button">${t('Articles & Drafts','Makaleler ve Taslaklar')}</button>
      <button class="admin-tab" data-tab="create" type="button">${t('+ New Article','+ Yeni Makale')}</button>
      <button class="admin-tab" data-tab="taxonomy" type="button">${t('Taxonomy','Kategoriler & Etiketler')}</button>
      <button class="admin-tab" data-records="media_assets" type="button">${t('Media Records','Medya Kayıtları')}</button>
      <button class="admin-tab" data-records="publication_jobs" type="button">${t('Publication Jobs','Yayın Kayıtları')}</button>
      <button class="admin-tab" data-tab="audit" type="button">${t('Audit & Roles','Denetim ve Roller')}</button>
    </nav>

    <!-- TAB 1: Articles View -->
    <div id="tab-content-articles" class="tab-pane active">
      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card"><small>${t('Total Articles','Toplam Makale')}</small><strong id="stat-total">0</strong></div>
        <div class="stat-card"><small>${t('Drafts','Taslaklar')}</small><strong id="stat-drafts" class="text-amber">0</strong></div>
        <div class="stat-card"><small>${t('Ready to Publish','Yayına Hazır')}</small><strong id="stat-ready" class="text-blue">0</strong></div>
        <div class="stat-card"><small>${t('Published','Yayımlanan')}</small><strong id="stat-published" class="text-green">0</strong></div>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="table-toolbar">
        <div class="search-box">
          <input id="article-search" type="search" placeholder="${t('Search articles by title, slug or summary…','Başlık, slug veya özete göre ara…')}">
        </div>
        <div class="filter-group">
          <select id="filter-lang" aria-label="${t('Language filter','Dil filtresi')}">
            <option value="all">${t('All Languages','Tüm Diller')}</option>
            <option value="en">English (EN)</option>
            <option value="tr">Türkçe (TR)</option>
          </select>
          <select id="filter-status" aria-label="${t('Status filter','Durum filtresi')}">
            <option value="all">${t('All Statuses','Tüm Durumlar')}</option>
            <option value="draft">${t('Draft','Taslak')}</option>
            <option value="ready">${t('Ready to publish','Yayına hazır')}</option>
            <option value="published">${t('Published','Yayımlanmış')}</option>
          </select>
          <button id="btn-refresh-articles" class="button secondary" type="button">${t('Refresh','Yenile')}</button>
        </div>
      </div>

      <!-- Articles List Container (Required for automated tests & UI) -->
      <div id="records" class="admin-records" role="region" aria-label="${t('Records list','Kayıt listesi')}"></div>
    </div>

    <!-- TAB 2: Full Article Editor Form -->
    <form id="editor" class="admin-panel editor-panel" hidden>
      <fieldset>
        <div class="editor-header">
          <div>
            <button id="btn-close-editor" type="button" class="button secondary btn-sm">← ${t('Back to list','Listeye dön')}</button>
            <legend id="editor-heading">${t('Edit Article','Makale Düzenle')}</legend>
          </div>
          <div class="editor-header-actions">
            <span id="editor-status-chip" class="status-chip">draft</span>
            <button id="btn-toggle-ready" type="button" class="button secondary btn-sm">${t('Mark Ready','Hazır Olarak İşaretle')}</button>
            <button class="button primary" type="submit">${t('Save draft','Taslağı kaydet')} <kbd class="kbd-hint">Ctrl+S</kbd></button>
          </div>
        </div>

        <!-- Editor Tabs: Details, Markdown Editor & Live Preview, Revisions -->
        <div class="editor-subtabs">
          <button type="button" class="subtab active" data-subtab="content">${t('Content & Markdown','İçerik ve Markdown')}</button>
          <button type="button" class="subtab" data-subtab="meta">${t('SEO & Metadata','SEO ve Meta Veriler')}</button>
          <button type="button" class="subtab" data-subtab="revisions">${t('Revision History','Sürüm Geçmişi')}</button>
        </div>

        <!-- Subtab 1: Content & Live Preview -->
        <div id="subtab-content" class="subtab-pane active">
          <div class="form-grid">
            <div class="form-group col-span-2">
              <label for="article-title">${t('Title','Başlık')}</label>
              <input id="article-title" name="article-title" type="text" required>
            </div>
            <div class="form-group col-span-2">
              <label for="article-subtitle">${t('Subtitle','Alt Başlık')}</label>
              <input id="article-subtitle" name="article-subtitle" type="text" placeholder="${t('Optional subtitle…','İsteğe bağlı alt başlık…')}">
            </div>
            <div class="form-group col-span-2">
              <label for="article-summary">${t('Summary','Özet')}</label>
              <textarea id="article-summary" name="article-summary" required rows="3" placeholder="${t('Concise 1-2 sentence article summary…','1-2 cümlelik kısa makale özeti…')}"></textarea>
            </div>
            <div class="form-group col-span-2">
              <label for="article-short-answer">${t('Short Answer / Key Takeaway','Kısa Cevap / Temel Çıkarım')}</label>
              <textarea id="article-short-answer" name="article-short-answer" rows="2" placeholder="${t('Key takeaway shown in highlighted callout box…','Vurgulanan kutuda gösterilen temel çıkarım…')}"></textarea>
            </div>
          </div>

          <!-- Markdown Writing & Preview Split -->
          <div class="markdown-workspace">
            <div class="markdown-editor-pane">
              <div class="pane-header">
                <label for="article-body"><strong>Markdown ${t('Source','Kaynağı')}</strong></label>
                <span class="char-count" id="body-char-count">0 chars</span>
              </div>
              <textarea id="article-body" name="article-body" required rows="22" spellcheck="false" placeholder="# Heading&#10;&#10;Write markdown content here..."></textarea>
            </div>
            <div class="markdown-preview-pane">
              <div class="pane-header">
                <strong>${t('Live Preview','Canlı Önizleme')}</strong>
                <span class="preview-badge">${t('Real-time','Anlık')}</span>
              </div>
              <div id="markdown-preview" class="preview-content knowledge-article" aria-live="polite"></div>
            </div>
          </div>
        </div>

        <!-- Subtab 2: Metadata & Taxonomy -->
        <div id="subtab-meta" class="subtab-pane">
          <div class="form-grid">
            <div class="form-group">
              <label for="article-slug">Slug</label>
              <input id="article-slug" name="article-slug" type="text" required>
            </div>
            <div class="form-group">
              <label for="article-category">${t('Category','Kategori')}</label>
              <select id="article-category" name="article-category"></select>
            </div>
            <div class="form-group">
              <label for="article-tags">${t('Tags (comma separated)','Etiketler (virgülle ayırın)')}</label>
              <input id="article-tags" name="article-tags" type="text" placeholder="memory, retrieval, graph">
            </div>
            <div class="form-group">
              <label for="article-reading-minutes">${t('Reading Time (minutes)','Okuma Süresi (dakika)')}</label>
              <input id="article-reading-minutes" name="article-reading-minutes" type="number" min="1" max="60" value="5">
            </div>
            <div class="form-group col-span-2">
              <label for="article-seo-title">${t('SEO Title','SEO Başlığı')}</label>
              <input id="article-seo-title" name="article-seo-title" type="text" maxlength="70">
              <small class="meta-hint" id="seo-title-count">0 / 70</small>
            </div>
            <div class="form-group col-span-2">
              <label for="article-seo-description">${t('SEO Description','SEO Açıklaması')}</label>
              <textarea id="article-seo-description" name="article-seo-description" rows="2" maxlength="160"></textarea>
              <small class="meta-hint" id="seo-desc-count">0 / 160</small>
            </div>
            <div class="form-group col-span-2 form-checkbox">
              <input id="article-indexable" name="article-indexable" type="checkbox" checked>
              <label for="article-indexable">${t('Indexable by search engines and sitemap','Arama motorları ve site haritası tarafından indekslensin')}</label>
            </div>
          </div>
        </div>

        <!-- Subtab 3: Revisions History -->
        <div id="subtab-revisions" class="subtab-pane">
          <p class="admin-panel__intro">${t('Every draft save records an immutable revision snapshot. Click any revision to restore its content.','Her taslak kaydında değişmez bir sürüm anlık görüntüsü kaydedilir. İçeriğini geri yüklemek için herhangi bir sürüme tıklayın.')}</p>
          <div id="revisions-list" class="revisions-timeline"></div>
        </div>
      </fieldset>
      <p class="admin-note">${t('Published articles are read-only. Saving a draft updates the database; public site publication requires triggering the deployment pipeline.','Yayımlanmış makaleler salt okunurdur. Taslak kaydetmek veritabanını günceller; genel sitede yayınlama dağıtım hattının tetiklenmesini gerektirir.')}</p>
    </form>

    <!-- TAB 3: New Article Creator -->
    <section id="create-panel" class="admin-panel" hidden>
      <h2>${t('Create New Article','Yeni Makale Oluştur')}</h2>
      <p class="admin-panel__intro">${t('Draft a new article. Once created, you can write the markdown content and link paired translations.','Yeni bir taslak makale oluşturun. Oluşturulduktan sonra markdown içeriğini yazabilir ve çeviri eşleşmesini bağlayabilirsiniz.')}</p>
      <form id="create-article-form">
        <div class="form-grid">
          <div class="form-group col-span-2">
            <label for="new-article-title">${t('Article Title','Makale Başlığı')}</label>
            <input id="new-article-title" type="text" required placeholder="${t('e.g. Graph Storage Foundations','Örn: Vektör İndeksleme Prensipleri')}">
          </div>
          <div class="form-group">
            <label for="new-article-type">${t('Content Type','İçerik Türü')}</label>
            <select id="new-article-type">
              <option value="learn">Learn</option>
              <option value="guide">Guide</option>
              <option value="research">Research</option>
              <option value="glossary">Glossary</option>
              <option value="methodology">Methodology</option>
            </select>
          </div>
          <div class="form-group">
            <label for="new-article-lang">${t('Language','Dil')}</label>
            <select id="new-article-lang">
              <option value="en">English (EN)</option>
              <option value="tr">Türkçe (TR)</option>
            </select>
          </div>
          <div class="form-group col-span-2">
            <label for="new-article-slug">Slug</label>
            <input id="new-article-slug" type="text" placeholder="${t('auto-generated-from-title','basliktan-otomatik-olusturulur')}">
          </div>
          <div class="form-group col-span-2">
            <label for="new-article-summary">${t('Summary','Özet')}</label>
            <textarea id="new-article-summary" rows="3" required placeholder="${t('A concise overview of what this article covers…','Bu makalenin neyi ele aldığına dair kısa bir genel bakış…')}"></textarea>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="button primary">${t('Create Draft Article','Taslak Makaleyi Oluştur')}</button>
          <button type="button" id="btn-cancel-create" class="button secondary">${t('Cancel','İptal')}</button>
        </div>
      </form>
    </section>

    <!-- TAB 4: Taxonomy Panel (Categories & Tags) -->
    <section id="taxonomy-panel" class="admin-panel" hidden>
      <h2>${t('Categories & Tags Management','Kategoriler ve Etiketler')}</h2>
      <div class="taxonomy-layout">
        <div class="taxonomy-column">
          <h3>${t('Categories','Kategoriler')}</h3>
          <div id="categories-list" class="taxonomy-list"></div>
          <form id="add-category-form" class="inline-subform">
            <h4>${t('Add Category','Yeni Kategori')}</h4>
            <input id="cat-id" type="text" placeholder="ID (slug)" required>
            <input id="cat-title-en" type="text" placeholder="Title (EN)" required>
            <input id="cat-title-tr" type="text" placeholder="Title (TR)" required>
            <button type="submit" class="button secondary btn-sm">${t('Save Category','Kategori Ekle')}</button>
          </form>
        </div>
        <div class="taxonomy-column">
          <h3>${t('Tags','Etiketler')}</h3>
          <div id="tags-list" class="taxonomy-list"></div>
          <form id="add-tag-form" class="inline-subform">
            <h4>${t('Add Tag','Yeni Etiket')}</h4>
            <input id="tag-slug" type="text" placeholder="Slug" required>
            <input id="tag-name-en" type="text" placeholder="Name (EN)" required>
            <input id="tag-name-tr" type="text" placeholder="Name (TR)" required>
            <button type="submit" class="button secondary btn-sm">${t('Save Tag','Etiket Ekle')}</button>
          </form>
        </div>
      </div>
    </section>

    <!-- TAB 5: Audit & Roles Panel -->
    <section id="audit-panel" class="admin-panel" hidden>
      <h2>${t('Audit Events & Editor Roles','Denetim Günlüğü ve Editör Rolleri')}</h2>
      <div class="audit-layout">
        <div class="audit-column">
          <h3>${t('Recent Audit Events','Son Denetim Olayları')}</h3>
          <div id="audit-events-list" class="audit-log-list"></div>
        </div>
        <div class="audit-column">
          <h3>${t('Editor Accounts','Yetkili Hesaplar')}</h3>
          <div id="editor-roles-list" class="roles-list"></div>
        </div>
      </div>
    </section>
  </section>

  <a class="admin-return" href="${base}${tr ? 'tr/' : ''}learn/">← ${t('Return to public articles','Genel makalelere dön')}</a>
</main>

<footer class="site-footer admin-footer">
  <div class="footer-bottom">
    <span>© 2026 MESA contributors · ${t('Administrative Workspace','Yönetim Alanı')}</span>
    <span>
      <a href="${base}${tr ? 'tr/' : ''}">${t('Home','Ana Sayfa')}</a> ·
      <a href="${base}${tr ? 'tr/' : ''}docs/">${t('Docs','Dokümanlar')}</a> ·
      <a href="${base}${tr ? 'tr/' : ''}resources/">${t('Resources','Kaynaklar')}</a>
    </span>
  </div>
</footer>

<script id="admin-config" type="application/json">${JSON.stringify(config).replaceAll('<','\\u003c')}</script>
<script src="${base}cosmic-motion.js" defer></script>
<script src="${base}admin.js" defer></script>
</body></html>`;
}
