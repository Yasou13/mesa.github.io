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
<link rel="icon" href="${base}favicon.ico" sizes="32x32">
<link rel="icon" href="${base}favicon.svg" type="image/svg+xml">
<link rel="icon" type="image/png" sizes="48x48" href="${base}favicon-48x48.png">
<link rel="icon" href="${base}assets/mesa-mark.webp" type="image/webp">
<link rel="apple-touch-icon" href="${base}apple-touch-icon.png">
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
    <h1>${t('Content Workspace','İçerik yönetimi')}</h1>
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
        <h2 id="workspace-title" class="sr-only">${t('Editorial Dashboard','Editöryal Panel')}</h2>
        <p class="user-info">${t('Signed in as','Oturum:')} <strong id="current-user-email"></strong> <span id="current-user-role" class="user-role-chip"></span></p>
      </div>
      <div class="topbar-actions">
        <a class="button secondary" href="${base}${tr ? 'tr/' : ''}learn/" target="_blank">${t('View Live Site ↗','Siteyi aç ↗')}</a>
        <button id="logout" type="button" class="button secondary">${t('Sign out','Çıkış yap')}</button>
      </div>
    </div>

    <!-- Main Navigation Tabs -->
    <nav class="admin-tabs" aria-label="${t('Çalışma alanı views','Yönetim bölümleri')}">
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
      <div class="workspace-guide"><strong>${t('Draft → Review → Ready → Site deployment','Taslak → İnceleme → Hazır → Siteye aktarım')}</strong><p>${t('Write and save here. “Ready” marks an editorial handoff; it does not publish to the website.','İçeriği burada yazıp kaydedin. “Hazır”, editöryal onay durumudur; siteye otomatik yayın yapmaz.')}</p></div>
      <div class="table-toolbar">
        <div class="search-box">
          <input aria-label="${t('Search articles','Makalelerde ara')}" id="article-search" type="search" placeholder="${t('Search articles by title, slug or summary…','Başlık, adres veya özette ara…')}">
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
            <option value="published">${t('Published','Yayımlanmış')}</option><option value="publishing">${t('Publishing','Yayımlanıyor')}</option><option value="failed">${t('Failed','Başarısız')}</option><option value="unpublished">${t('Unpublished','Yayından kaldırıldı')}</option>
          </select>
          <select id="filter-type" aria-label="${t('Content type filter','İçerik türü filtresi')}"><option value="all">${t('All types','Tüm türler')}</option>${['learn','guide','research','glossary','methodology'].map(v=>`<option value="${v}">${({learn:t('Lesson','Ders'),guide:t('Guide','Rehber'),research:t('Research','Araştırma'),glossary:t('Glossary','Sözlük'),methodology:t('Methodology','Metodoloji')})[v]}</option>`).join('')}</select>
          <select id="article-sort" aria-label="${t('Sort articles','Makale sıralaması')}"><option value="updated">${t('Recently updated','Son güncellenen')}</option><option value="oldest">${t('Oldest updated','Uzun süredir güncellenmeyen')}</option><option value="title">${t('Title A–Z','Başlık A–Z')}</option></select>
          <button id="btn-refresh-articles" class="button secondary" type="button">${t('Refresh','Yenile')}</button>
        </div>
      </div>

      <p id="article-count" role="status" class="admin-note"></p>
      <!-- Articles List Container (Required for automated tests & UI) -->
      <div id="records" class="admin-records" role="region" aria-label="${t('Records list','Kayıt listesi')}"></div>
      <div class="list-pagination"><button id="page-prev" class="button secondary" type="button">${t('Previous','Önceki')}</button><span id="page-label"></span><button id="page-next" class="button secondary" type="button">${t('Next','Sonraki')}</button></div>
    </div>
    <section id="aux-records-panel" class="admin-panel" hidden><h3 id="aux-records-title"></h3><div id="aux-records"></div></section>

    <!-- TAB 2: Full Article Editor Form -->
    <form id="editor" class="admin-panel editor-panel" hidden>
      <div class="editor-frame">
        <div class="editor-header">
          <div>
            <button id="btn-close-editor" type="button" class="button secondary btn-sm">← ${t('Back to list','Listeye dön')}</button>
            <h3 id="editor-heading">${t('Edit Article','Makale Düzenle')}</h3>
          </div>
          <div class="editor-header-actions">
            <span id="save-state" role="status"></span><span id="editor-status-chip" class="status-chip">draft</span>
            <button id="btn-toggle-ready" type="button" class="button secondary btn-sm">${t('Mark Ready','İncelemeye hazır')}</button>
            <button class="button primary" type="submit">${t('Save draft','Taslağı kaydet')} <kbd class="kbd-hint">Ctrl+S</kbd></button>
          </div>
        </div>

        <div id="editor-notice-banner" class="editor-notice-banner" hidden>
          <div class="notice-info">
            <span class="notice-badge">${t('LIVE PUBLISHED','YAYINDA')}</span>
            <p>${t('This article is currently published on the live site. To edit safely without altering the production page directly, duplicate it as an editable draft.','Bu makale şu anda sitede yayındadır. Canlı sayfayı doğrudan bozmamak için içeriği düzenlenebilir taslak olarak kopyalayabilirsiniz.')}</p>
          </div>
          <button id="btn-duplicate-draft" type="button" class="button secondary btn-sm">${t('Duplicate as Editable Draft','Taslak kopyası oluştur')}</button>
        </div>

        <div class="editor-context"><span id="editor-path"></span><span id="editor-updated"></span></div>
        <p id="editor-feedback" class="editor-feedback" role="status" aria-live="polite"></p>
        <!-- Editor Tabs: Details, Markdown Editor & Live Preview, Revisions -->
        <div class="editor-subtabs">
          <button type="button" class="subtab active" data-subtab="content">${t('Content & Markdown','Yazı ve önizleme')}</button>
          <button type="button" class="subtab" data-subtab="meta">${t('SEO & Metadata','Arama motoru ayarları')}</button>
          <button type="button" class="subtab" data-subtab="revisions">${t('Revision History','Sürüm Geçmişi')}</button>
        </div>

        <!-- Subtab 1: Content & Live Preview -->
        <fieldset id="article-fields"><div id="subtab-content" class="subtab-pane active">
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
              <label for="article-short-answer">${t('Short Answer / Key Takeaway','Öne çıkan bilgi')}</label>
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
              <div class="markdown-toolbar" role="group" aria-label="${t('Formatting tools','Biçimlendirme araçları')}">${[['heading',t('Heading','Başlık')],['bold',t('Bold','Kalın')],['italic',t('Italic','İtalik')],['list',t('List','Liste')],['link',t('Link','Bağlantı')],['code',t('Code','Kod')],['quote',t('Quote','Alıntı')]].map(([key,text])=>`<button type="button" data-format="${key}">${text}</button>`).join('')}</div>
              <textarea id="article-body" name="article-body" required rows="22" placeholder="${t('## Heading&#10;&#10;Write your article…','## Başlık&#10;&#10;Makalenizi yazın…')}"></textarea>
            </div>
            <div class="markdown-preview-pane">
              <div class="pane-header">
                <strong>${t('Live Preview','Canlı Önizleme')}</strong>
                <span class="preview-badge">${t('Real-time','Anlık')}</span>
              </div>
              <div id="markdown-preview" class="preview-content knowledge-article"></div>
            </div>
          </div>
        </div>

        <!-- Subtab 2: Metadata & Taxonomy -->
        <div id="subtab-meta" class="subtab-pane">
          <div class="form-grid">
            <div class="form-group">
              <label for="article-slug">${t('Slug','URL kısa adı')}</label>
              <input id="article-slug" name="article-slug" type="text" required pattern="[a-z0-9]+(-[a-z0-9]+)*" aria-describedby="slug-help"><small id="slug-help">${t('URL: lowercase letters, numbers and hyphens.','URL: küçük Latin harfleri, rakamlar ve tire kullanın.')}</small>
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

        </fieldset>
        <!-- Subtab 3: Revisions History -->
        <div id="subtab-revisions" class="subtab-pane">
          <p class="admin-panel__intro">${t('Saved revisions appear here when database revision tracking is enabled. Restore a revision into the editor, then save to apply it.','Veritabanı sürüm takibi etkinse kaydedilen sürümler burada görünür. Bir sürümü editöre alın, ardından uygulamak için kaydedin.')}</p>
          <div id="revisions-list" class="revisions-timeline"></div>
        </div>
        <div class="editor-utilities"><button id="btn-export-draft" class="button secondary" type="button">${t('Download Markdown','Markdown indir')}</button><button id="btn-delete-draft" class="button secondary danger" type="button">${t('Delete draft','Taslağı sil')}</button></div>
      </div>
      <p class="admin-note">${t('Published articles are read-only. Saving a draft updates the database; public site publication requires triggering the deployment pipeline.','Yayındaki makaleler burada yalnızca görüntülenir. Kaydedilen taslaklar doğrudan siteye yansımaz; yayın için ayrıca siteye aktarılmaları gerekir.')}</p>
    </form>

    <!-- TAB 3: New Article Creator -->
    <section id="create-panel" class="admin-panel" hidden>
      <h2>${t('Create New Article','Yeni Makale Oluştur')}</h2>
      <p class="admin-panel__intro">${t('Draft a new article. Once created, you can write, preview and organize its content.','Yeni bir taslak makale oluşturun. Oluşturulduktan sonra içeriği yazabilir, önizleyebilir ve düzenleyebilirsiniz.')}</p>
      <form id="create-article-form">
        <div class="form-grid">
          <div class="form-group col-span-2">
            <label for="new-article-title">${t('Article Title','Makale Başlığı')}</label>
            <input id="new-article-title" type="text" required placeholder="${t('e.g. Çizge Storage Foundations','Örn: Vektör İndeksleme Prensipleri')}">
          </div>
          <div class="form-group">
            <label for="new-article-type">${t('Content Type','İçerik Türü')}</label>
            <select id="new-article-type">
              <option value="learn">${t('Lesson','Ders')}</option>
              <option value="guide">${t('Guide','Rehber')}</option>
              <option value="research">${t('Research','Araştırma')}</option>
              <option value="glossary">${t('Glossary','Sözlük')}</option>
              <option value="methodology">${t('Methodology','Yöntem')}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="new-article-lang">${t('Language','Dil')}</label>
            <select id="new-article-lang">
              <option value="en"${tr ? '' : ' selected'}>English (EN)</option>
              <option value="tr"${tr ? ' selected' : ''}>Türkçe (TR)</option>
            </select>
          </div>
          <div class="form-group col-span-2">
            <label for="new-article-slug">${t('Slug','URL kısa adı')}</label>
            <input id="new-article-slug" type="text" pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="${t('auto-generated-from-title','basliktan-otomatik-olusturulur')}">
          </div>
          <div class="form-group col-span-2">
            <label for="new-article-summary">${t('Summary','Özet')}</label>
            <textarea id="new-article-summary" rows="3" required placeholder="${t('A concise overview of what this article covers…','Bu makalenin neyi ele aldığına dair kısa bir genel bakış…')}"></textarea>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="button primary">${t('Create Draft Article','Taslak oluştur')}</button>
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
            <label for="cat-id">${t('Category ID','Kategori kimliği')}</label><input id="cat-id" type="text" placeholder="ID (slug)" required>
            <label for="cat-title-en">${t('Category name (EN)','Kategori adı (EN)')}</label><input id="cat-title-en" type="text" placeholder="Title (EN)" required>
            <label for="cat-title-tr">${t('Category name (TR)','Kategori adı (TR)')}</label><input id="cat-title-tr" type="text" placeholder="Title (TR)" required>
            <button type="submit" class="button secondary btn-sm">${t('Save Category','Kategori Ekle')}</button>
          </form>
        </div>
        <div class="taxonomy-column">
          <h3>${t('Tags','Etiketler')}</h3>
          <div id="tags-list" class="taxonomy-list"></div>
          <form id="add-tag-form" class="inline-subform">
            <h4>${t('Add Tag','Yeni Etiket')}</h4>
            <label for="tag-slug">${t('Tag slug','Etiket kısa adı')}</label><input id="tag-slug" type="text" placeholder="Slug" required>
            <label for="tag-name-en">${t('Tag name (EN)','Etiket adı (EN)')}</label><input id="tag-name-en" type="text" placeholder="Name (EN)" required>
            <label for="tag-name-tr">${t('Tag name (TR)','Etiket adı (TR)')}</label><input id="tag-name-tr" type="text" placeholder="Name (TR)" required>
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
