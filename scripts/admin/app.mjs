import { createClient } from '@supabase/supabase-js';
import { requestInbox } from './requests.mjs';
import { AdminService } from './service.mjs';
import { editable, slugify, filterAndSort, articlePath, markdownEdit } from './editor.mjs';
import { escapeHtml, renderMarkdown } from '../markdown_engine.mjs';

const config = JSON.parse(document.getElementById('admin-config').textContent);
const tr = document.documentElement.lang === 'tr';
const t = (en, turkish) => tr ? turkish : en;
const $ = id => document.getElementById(id);
const status = (message, error = false) => {
  const el = $('admin-status');
  if (el) {
    el.textContent = message;
    el.dataset.error = String(error);
    const feedback = $('editor-feedback');
    if (feedback && !$('editor').hidden) { feedback.textContent = message; feedback.dataset.error = String(error); }
  }
};

const errors = {
  REQUESTS: t('Requests could not be loaded. Check the connection and the early-access database migration.', 'Talepler yüklenemedi. Bağlantıyı ve erken erişim veritabanı kurulumunu kontrol edin.'),
  REQUEST_CONFLICT: t('This request changed or access was denied. Copy your notes, then reload before saving.', 'Bu talep başka bir yerde değişmiş olabilir veya erişim izniniz olmayabilir. Notlarınızı kopyalayıp listeyi yenileyin.'),
  SESSION: t('Your session is unavailable or expired. Sign in again.', 'Oturum kullanılamıyor veya süresi dolmuş. Tekrar giriş yapın.'),
  ROLE: t('This account has no administrator access.', 'Bu hesabın yönetici erişimi yok.'),
  DATA: t('Records could not be loaded. Check the connection and database setup.', 'Kayıtlara ulaşılamadı. Bağlantıyı ve veritabanı ayarlarını kontrol edin.'),
  CONFLICT: t('The draft changed or access was denied. Reload it before saving again.', 'Bu taslak başka bir yerde değişmiş olabilir veya yazma izniniz olmayabilir. Metninizi indirdikten sonra makaleyi yeniden açın.'),
  VALIDATION: t('Enter a title, summary, article body and reading time between 1 and 60 minutes.', 'Başlık, özet, makale metni ve 1–60 dakika arasında okuma süresi girin.'),
  SLUG: t('Use lowercase Latin letters, numbers and single hyphens in the URL.', 'URL’de küçük Latin harfleri, rakamlar ve tek tire kullanın.'),
  DUPLICATE: t('This URL already exists in this language. Choose a different slug.', 'Bu dilde aynı URL zaten var. Farklı bir kısa ad seçin.'),
  PUBLISHED: t('Published articles are read-only.', 'Yayımlanmış makaleler salt okunurdur.')
};

if (config) {
  const storageKey = 'mesa-admin-' + new URL(config.url).host;
  let storage;
  try { sessionStorage.setItem('mesa-storage-check', '1'); sessionStorage.removeItem('mesa-storage-check'); storage = sessionStorage; } catch {}

  if (!storage) {
    status(t('Session storage is unavailable. Allow storage in this browser to sign in.', 'Oturum depolaması kullanılamıyor. Giriş için tarayıcı depolamasına izin verin.'), true);
  } else {
    const hadStoredSession = Boolean(storage.getItem(storageKey));
    const client = createClient(config.url, config.key, {
      auth: { storage, storageKey, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' }
    });
    const service = new AdminService(client);

    let article = null, allArticles = [], categories = [], tags = [];
    let generation = 0, syncId = 0, expiryTimer, signingOut = false;
    let currentUser = null, dirty = false, busy = false, baseline = '', page = 0;
    const pageSize = 12;
    const stateNames = {draft:t('Draft','Taslak'),ready:t('Ready for review','İncelemeye hazır'),published:t('Published','Yayında'),publishing:t('Publishing','Yayımlanıyor'),failed:t('Failed','Başarısız'),unpublished:t('Unpublished','Yayından kaldırıldı')};
    const typeNames = {learn:t('Lesson','Ders'),guide:t('Guide','Rehber'),research:t('Research','Araştırma'),glossary:t('Glossary','Sözlük'),methodology:t('Methodology','Metodoloji')};
    const date = value => value ? new Date(value).toLocaleString(tr ? 'tr-TR' : 'en-GB', {dateStyle:'medium',timeStyle:'short'}) : '—';
    const inbox = requestInbox({service,action,status,t,date});
    function changes() {
      return {title:$('article-title').value.trim(),subtitle:$('article-subtitle').value || null,summary:$('article-summary').value.trim(),short_answer:$('article-short-answer').value || null,body_markdown:$('article-body').value,slug:$('article-slug').value.trim(),category_id:$('article-category').value || null,tags:[...new Set($('article-tags').value.split(',').map(v=>v.trim()).filter(Boolean))],reading_minutes:Number($('article-reading-minutes').value),seo_title:$('article-seo-title').value.trim() || $('article-title').value.trim(),seo_description:$('article-seo-description').value.trim() || $('article-summary').value.trim(),indexable:$('article-indexable').checked};
    }
    function trackChanges() {
      dirty = Boolean(article && editable(article) && JSON.stringify(changes()) !== baseline);
      $('save-state').textContent = dirty ? t('Unsaved changes','Kaydedilmemiş değişiklikler') : t('Saved','Kaydedildi');
      $('save-state').dataset.dirty = String(dirty);
    }
    function canLeave() { return !busy && inbox.canLeave() && (!dirty || confirm(t('Discard unsaved changes?', 'Kaydedilmemiş değişiklikler silinsin mi?'))); }
    function showSubtab(name) {
      document.querySelectorAll('.editor-subtabs .subtab').forEach(b=>{b.classList.toggle('active',b.dataset.subtab===name); b.setAttribute('aria-pressed',String(b.dataset.subtab===name));});
      document.querySelectorAll('.subtab-pane').forEach(p=>p.classList.toggle('active',p.id === 'subtab-'+name));
    }
    function upsertRow(value) {
      const idx = allArticles.findIndex(row=>row.id === value.id);
      if (idx < 0) allArticles.unshift(value); else allArticles[idx] = {...allArticles[idx],...value};
      updateStats(allArticles); filterArticles();
    }
    async function saveCurrent() {
      if (!article || !editable(article)) throw new Error('PUBLISHED');
      // All required inputs must be focusable when native validity reports an error.
      const invalid = $('editor').querySelector('input:invalid, textarea:invalid, select:invalid');
      if (invalid) { showSubtab(invalid.closest('#subtab-meta') ? 'meta' : 'content'); invalid.reportValidity(); return false; }
      const active = generation, current = article, payload = changes();
      $('article-fields').disabled = true;
      try {
        const saved = await service.saveDraft(current, payload);
        if (active !== generation) return false;
        article = {...current,...payload,...saved};
        baseline = JSON.stringify(changes()); trackChanges();
        upsertRow(article);
        $('editor-updated').textContent = t('Updated: ','Güncellendi: ') + date(article.updated_at);
        $('editor-path').textContent = '/' + articlePath(article);
        await loadRevisions(article.id);
        if (active !== generation) return false;
        status(t('Draft saved. It has not been published.','Taslak kaydedildi. Henüz yayımlanmadı.'));
        return true;
      } finally { if (active === generation) $('article-fields').disabled = !editable(article); }
    }
    const query = new URLSearchParams(location.search);
    let recovery = storage.getItem(storageKey + '-recovery') === '1' || (query.get('recovery') === '1' && query.has('code'));

    const stripCallback = () => { if (location.search || location.hash) history.replaceState(null, '', location.pathname); };

    function lock() {
      generation++;
      inbox.clear(true);
      document.body.classList.remove('has-workspace');
      dirty = false; baseline = "";
      clearTimeout(expiryTimer);
      article = null;
      allArticles = [];
      currentUser = null;
      if ($('workspace')) $('workspace').hidden = true;
      if ($('recovery-panel')) $('recovery-panel').hidden = true;
      if ($('login-panel')) $('login-panel').hidden = false;
      for (const id of ['records','aux-records','revisions-list','categories-list','tags-list','audit-events-list','editor-roles-list','markdown-preview']) $(id)?.replaceChildren();
      if ($('editor')) { $('editor').reset(); $('editor').hidden = true; }
      if ($('login-form')) {
        $('login-form').elements.password.value = '';
        $('login-form').querySelector('fieldset').disabled = false;
      }
      if ($('reset-request')) $('reset-request').disabled = false;
    }

    function clearCredentials() {
      for (const key of Object.keys(storage)) {
        if (key.startsWith(storageKey)) storage.removeItem(key);
      }
    }

    async function rejectAccess(error) {
      lock();
      if (error.message === 'ROLE') {
        signingOut = true; ++syncId;
        try { await client.auth.signOut({ scope: 'local' }); } finally { clearCredentials(); signingOut = false; }
      }
      report(error);
    }

    function report(error) {
      status(errors[error.message] || t('The request failed. Please try again.', 'İstek başarısız oldu. Lütfen tekrar deneyin.'), true);
    }

    async function action(button, task) {
      if (busy) return;
      busy = true;
      if (button) { button.disabled = true; button.setAttribute('aria-busy', 'true'); }
      status(t('Working…', 'İşlem sürüyor…'));
      try {
        await task();
      } catch (error) {
        if (['SESSION', 'ROLE'].includes(error.message)) await rejectAccess(error);
        else report(error);
      } finally {
        busy = false;
        if (button) { button.disabled = false; button.removeAttribute('aria-busy'); }
      }
    }

    // Switch between top tabs
    function switchTab(tabName, force = false) {
      if (!force && !canLeave()) return false;
      dirty = false; article = null;
      inbox.clear();
      $('editor').hidden = true;
      $('aux-records-panel').hidden = true;
      document.querySelectorAll('.admin-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tabName));
      const panes = {
        articles: $('tab-content-articles'),
        create: $('create-panel'),
        taxonomy: $('taxonomy-panel'),
        requests: $('requests-panel'),
        audit: $('audit-panel')
      };
      for (const [key, pane] of Object.entries(panes)) {
        if (pane) pane.hidden = (key !== tabName);
      }
      if (tabName !== 'articles' && $('editor')) {
        $('editor').hidden = true;
      }
      if (tabName === 'taxonomy') action(null, loadTaxonomy);
      if (tabName === 'requests') action(null, () => inbox.load(true));
      if (tabName === 'audit') action(null, loadAudit);
      return true;
    }

    // Update Quick Stats Counter
    function updateStats(items) {
      if (!$('stat-total')) return;
      $('stat-total').textContent = items.length;
      $('stat-drafts').textContent = items.filter(a => a.status === 'draft').length;
      $('stat-ready').textContent = items.filter(a => a.status === 'ready').length;
      $('stat-published').textContent = items.filter(a => a.status === 'published').length;
    }

    // Render Articles List (Preserving button elements and textContent for automated tests)
    function renderArticlesList(items) {
      const container = $('records');
      if (!container) return;
      container.replaceChildren();

      if (!items.length) {
        const p = document.createElement('p');
        p.className = 'empty-notice';
        p.textContent = t('No matching articles found.', 'Eşleşen makale bulunamadı.');
        container.append(p);
        return;
      }

      for (const row of items) {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = `admin-article-card status-${row.status}`;

        const heading = document.createElement('strong'); heading.textContent = row.title;
        const meta = document.createElement('span'); meta.className = 'article-card-meta';
        const chip = document.createElement('span'); chip.className = `status-chip status-${row.status}`; chip.textContent = stateNames[row.status] || row.status;
        const details = document.createElement('span'); details.textContent = `${(row.language || '').toUpperCase()} · ${typeNames[row.type] || row.type || ''} · ${date(row.updated_at)}`;
        meta.append(chip, details);
        const summary = document.createElement('span'); summary.className = 'article-card-summary'; summary.textContent = row.summary || '';
        const link = document.createElement('small'); link.textContent = `/${articlePath(row)}`;
        card.append(heading, meta, summary, link);

        card.addEventListener('click', () => action(card, async () => {
          const reqGen = generation;
          const loaded = await service.loadArticle(row.id);
          if (reqGen !== generation) return;
          openEditor(loaded);
        }));

        container.append(card);
      }
    }

    // Filter & Search Logic
    function filterArticles() {
      const filtered = filterAndSort(allArticles, {search:$('article-search').value,language:$('filter-lang').value,status:$('filter-status').value,type:$('filter-type').value,sort:$('article-sort').value});
      const pages = Math.max(1, Math.ceil(filtered.length / pageSize)); page = Math.min(page,pages-1);
      renderArticlesList(filtered.slice(page*pageSize,(page+1)*pageSize));
      $('article-count').textContent = t(`${filtered.length} of ${allArticles.length} articles`, `${allArticles.length} makaleden ${filtered.length} sonuç`);
      $('page-label').textContent = `${page+1} / ${pages}`;
      $('page-prev').disabled = page === 0; $('page-next').disabled = page >= pages-1;
    }

    // Open Article in Editor
    function openEditor(loaded) {
      if (!currentUser) return;
      article = loaded;
      dirty = false;
      showSubtab('content');
      $('editor-heading').textContent = editable(article) ? t('Edit article','Makaleyi düzenle') : t('View article','Makaleyi görüntüle');
      $('editor-path').textContent = '/' + articlePath(article);
      $('editor-updated').textContent = t('Updated: ','Güncellendi: ') + date(article.updated_at);
      $('editor-feedback').textContent = '';
      $('btn-delete-draft').hidden = !editable(article);
      $('article-title').value = article.title || '';
      $('article-summary').value = article.summary || '';
      $('article-body').value = article.body_markdown || '';

      if ($('article-slug')) $('article-slug').value = article.slug || '';
      if ($('article-subtitle')) $('article-subtitle').value = article.subtitle || '';
      if ($('article-short-answer')) $('article-short-answer').value = article.short_answer || '';
      if ($('article-reading-minutes')) $('article-reading-minutes').value = article.reading_minutes || 5;
      if ($('article-seo-title')) {
        $('article-seo-title').value = article.seo_title || article.title || '';
        updateCharCount('seo-title-count', $('article-seo-title').value.length, 70);
      }
      if ($('article-seo-description')) {
        $('article-seo-description').value = article.seo_description || article.summary || '';
        updateCharCount('seo-desc-count', $('article-seo-description').value.length, 160);
      }
      if ($('article-indexable')) $('article-indexable').checked = article.indexable !== false;
      if ($('editor-status-chip')) {
        $('editor-status-chip').textContent = stateNames[article.status] || article.status;
        $('editor-status-chip').className = `status-chip status-${article.status}`;
      }
      if ($('btn-toggle-ready')) {
        $('btn-toggle-ready').textContent = article.status === 'ready'
          ? t('Revert to Draft', 'Taslağa geri çevir')
          : t('Mark Ready', 'İncelemeye hazır');
        $('btn-toggle-ready').hidden = !['draft', 'ready'].includes(article.status);
      }

      // Populate category dropdown
      if ($('article-category')) {
        $('article-category').replaceChildren();
        const defOpt = document.createElement('option');
        defOpt.value = '';
        defOpt.textContent = t('— Select Category —', '— Kategori Seçin —');
        $('article-category').append(defOpt);
        for (const cat of categories) {
          const opt = document.createElement('option');
          opt.value = cat.id;
          opt.textContent = tr ? cat.title_tr : cat.title_en;
          if (cat.id === article.category_id) opt.selected = true;
          $('article-category').append(opt);
        }
      }

      if ($('article-tags')) {
        $('article-tags').value = Array.isArray(article.tags) ? article.tags.join(', ') : '';
      }

      // Render live markdown preview
      updateLivePreview();

      // Load Revisions
      loadRevisions(article.id);

      // Hide articles list so editor is placed cleanly at top of screen
      if ($('tab-content-articles')) $('tab-content-articles').hidden = true;
      $('editor').hidden = false;
      $('editor').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});

      const isEditable = ['draft', 'ready'].includes(article.status);
      $('article-fields').disabled = !isEditable;
      $('editor').querySelector('button[type=submit]').disabled = !isEditable;
      baseline = JSON.stringify(changes()); trackChanges();

      if ($('editor-notice-banner')) {
        $('editor-notice-banner').hidden = isEditable;
      }

      status(t('Article loaded from the database.', 'Makale açıldı.'));
      if (isEditable) $('article-title').focus(); else $('btn-close-editor').focus();
    }

    function updateLivePreview() {
      const markdown = $('article-body')?.value || '';
      if ($('body-char-count')) $('body-char-count').textContent = t(`${markdown.length} characters · ${markdown.trim() ? markdown.trim().split(/\s+/).length : 0} words`, `${markdown.length} karakter · ${markdown.trim() ? markdown.trim().split(/\s+/).length : 0} sözcük`);
      if ($('markdown-preview')) {
        try {
          $('markdown-preview').innerHTML = renderMarkdown(markdown).html;
        } catch {
          $('markdown-preview').textContent = markdown;
        }
      }
    }

    function updateCharCount(id, current, max) {
      const el = $(id);
      if (el) el.textContent = `${current} / ${max}`;
    }

    async function loadRevisions(articleId) {
      const listEl = $('revisions-list');
      if (!listEl) return;
      listEl.replaceChildren();
      const active = generation;
      try {
        const revs = await service.listRevisions(articleId);
        if (active !== generation || article?.id !== articleId) return;
        if (!revs.length) {
          listEl.innerHTML = `<p class="empty-notice">${t('No revisions recorded yet.', 'Henüz kaydedilmiş sürüm yok.')}</p>`;
          return;
        }
        for (const rev of revs) {
          const item = document.createElement('div');
          item.className = 'revision-item';
          const time = new Date(rev.created_at).toLocaleString(tr ? 'tr-TR' : 'en-GB');
          item.innerHTML = `<div><strong>Rev #${rev.revision_number}</strong> · <time>${time}</time><br><small>${escapeHtml(rev.change_summary || '')}</small></div>`;
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'button secondary btn-sm';
          btn.textContent = t('Restore', 'Editöre al');
          btn.disabled = !editable(article);
          btn.addEventListener('click', () => action(btn, async () => {
            if (!confirm(t('Restore this revision into the editor?', 'Bu sürüm editöre geri yüklensin mi?'))) return;
            const fullRev = await service.loadRevision(rev.id);
            if (active !== generation || article?.id !== articleId) return;
            const snapshot = fullRev.metadata || {};
            for (const [key, id] of Object.entries({title:'title',subtitle:'subtitle',summary:'summary',short_answer:'short-answer',body_markdown:'body',seo_title:'seo-title',seo_description:'seo-description'})) $('article-'+id).value = fullRev[key] || '';
            for (const [key,id] of Object.entries({slug:'slug',category_id:'category',reading_minutes:'reading-minutes'})) if (snapshot[key] !== undefined) $('article-'+id).value = snapshot[key] ?? '';
            if (snapshot.tags) $('article-tags').value = snapshot.tags.join(', ');
            if (snapshot.indexable !== undefined) $('article-indexable').checked = snapshot.indexable;
            updateLivePreview(); trackChanges(); showSubtab('content');
            status(t('Revision restored into the editor. Save to apply it.', 'Sürüm editöre alındı. Uygulamak için kaydedin.'));
          }));
          item.append(btn);
          listEl.append(item);
        }
      } catch (error) {
        if (active === generation && article?.id === articleId) { listEl.textContent = t('Revision history could not be loaded. Try reopening the article.', 'Sürüm geçmişi yüklenemedi. Makaleyi yeniden açmayı deneyin.'); if (['SESSION','ROLE'].includes(error.message)) await rejectAccess(error); }
      }
    }

    // Load Taxonomy
    async function loadTaxonomy() {
      const active = generation;
      const loaded = await Promise.all([service.listCategories(), service.listTags()]);
      if (active !== generation) return;
      [categories, tags] = loaded;

      const catList = $('categories-list');
      if (catList) {
        catList.replaceChildren();
        for (const c of categories) {
          const d = document.createElement('div');
          d.className = 'taxonomy-badge';
          d.textContent = `${c.id} · ${c.title_en} / ${c.title_tr}`;
          catList.append(d);
        }
      }
      const tagList = $('tags-list');
      if (tagList) {
        tagList.replaceChildren();
        for (const tg of tags) {
          const d = document.createElement('div');
          d.className = 'taxonomy-badge';
          d.textContent = `${tg.slug} · ${tg.name_en} / ${tg.name_tr}`;
          tagList.append(d);
        }
      }
    }

    // Load Audit & Roles
    async function loadAudit() {
      const active = generation;
      const [events, roles] = await Promise.all([service.listAuditEvents(), service.listRoles()]);
      if (active !== generation) return;
      const auditList = $('audit-events-list');
      if (auditList) {
        auditList.replaceChildren();

        if (!events.length) auditList.innerHTML = `<p class="empty-notice">${t('No audit events found.', 'Denetim olayı bulunamadı.')}</p>`;
        for (const ev of events) {
          const d = document.createElement('div');
          d.className = 'audit-entry';
          const dt = new Date(ev.created_at).toLocaleString();
          d.innerHTML = `<strong>${escapeHtml(ev.action)}</strong> on ${escapeHtml(ev.entity_type)} <time>${dt}</time>`;
          auditList.append(d);
        }
      }
      const rolesList = $('editor-roles-list');
      if (rolesList) {
        rolesList.replaceChildren();

        for (const r of roles) {
          const d = document.createElement('div');
          d.className = 'role-entry';
          d.innerHTML = `<strong>${escapeHtml(r.email)}</strong> · <span class="user-role-chip">${escapeHtml(r.role)}</span>`;
          rolesList.append(d);
        }
      }
    }

    // Fetch and list records (articles, media, jobs)
    async function records(table = 'articles') {
      const active = generation;
      const rows = table === 'articles' ? await service.listArticles() : await service.listRecords(table);
      if (active !== generation) return;
      inbox.clear();

      if ($('editor')) $('editor').hidden = true;
      for (const id of ['tab-content-articles','create-panel','taxonomy-panel','audit-panel','requests-panel','aux-records-panel']) $(id).hidden = true;
      dirty = false; article = null;
      if (table === 'articles') $('tab-content-articles').hidden = false;
      else { $('aux-records-panel').hidden = false; $('aux-records-title').textContent = table === 'media_assets' ? t('Media records','Medya kayıtları') : t('Publication jobs','Yayın kayıtları'); }

      if (table === 'articles') {
        allArticles = rows;
        updateStats(allArticles);
        filterArticles();
      } else {
        const container = $('aux-records');
        container.replaceChildren();
        if (!rows.length) {
          const p = document.createElement('p');
          p.textContent = t('No records found.', 'Kayıt bulunamadı.');
          container.append(p);
        }
        for (const row of rows) {
          const node = document.createElement('p');
          node.className = 'admin-record-item';
          node.textContent = table === 'media_assets'
            ? `${row.filename} · ${row.mime_type} · ${row.file_size_bytes} B`
            : `${row.id} · ${row.status} · ${row.started_at ? new Date(row.started_at).toLocaleString() : ''}`;
          container.append(node);
        }
      }

      status(t('Administrator access verified. Records loaded from the database.', 'Yönetici erişimi doğrulandı. Kayıtlar veritabanından yüklendi.'));
    }

    async function synchronize() {
      if (signingOut) return;
      const request = ++syncId;
      const { data: { session }, error } = await client.auth.getSession();
      if (request !== syncId) return;

      if (error || !session || session.expires_at * 1000 <= Date.now()) {
        lock();
        const expired = !!error || hadStoredSession || query.has('code');
        status(expired ? errors.SESSION : t('Sign in with your administrator account.', 'Yönetici hesabınızla giriş yapın.'), expired);
        stripCallback();
        return;
      }

      try {
        currentUser = await service.authorize();
        if (request !== syncId) return;
        clearTimeout(expiryTimer);
        expiryTimer = setTimeout(() => { lock(); status(errors.SESSION, true); }, Math.max(0, session.expires_at * 1000 - Date.now()));

        $('login-panel').hidden = true;
        if (recovery) {
          storage.setItem(storageKey + '-recovery', '1');
          $('workspace').hidden = true;
          $('recovery-panel').hidden = false;
          $('recovery-form').querySelector('fieldset').disabled = false;
          status(t('Recovery session verified. Choose a new password.', 'Kurtarma oturumu doğrulandı. Yeni parola belirleyin.'));
        } else {
          const newlyOpened = $('workspace').hidden;
          $('workspace').hidden = false;
          document.body.classList.add('has-workspace');
          $('recovery-panel').hidden = true;
          if ($('current-user-email')) $('current-user-email').textContent = session.user.email || '';
          if ($('current-user-role')) $('current-user-role').textContent = 'ADMIN';

          if (newlyOpened) await loadTaxonomy();
          if (newlyOpened) await records('articles');
        }
      } catch (err) {
        if (request === syncId) await rejectAccess(err);
      }
      stripCallback();
    }

    client.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') recovery = true;
      if (event === 'SIGNED_OUT') { ++syncId; lock(); }
      else setTimeout(() => synchronize().catch(report), 0);
    });

    // Form Event Listeners
    $('login-form')?.addEventListener('submit', event => {
      event.preventDefault();
      const form = event.currentTarget;
      action(form.querySelector('button'), async () => {
        const password = form.elements.password.value;
        form.elements.password.value = '';
        const { error } = await client.auth.signInWithPassword({ email: form.elements.email.value.trim(), password });
        if (error) {
          lock();
          status(t('Sign-in failed. Check your credentials or try again later.', 'Giriş başarısız. Bilgilerinizi kontrol edin veya daha sonra deneyin.'), true);
          return;
        }
        recovery = false;
        storage.removeItem(storageKey + '-recovery');
        await synchronize();
      });
    });

    $('reset-request')?.addEventListener('click', event => {
      const email = $('email');
      if (!email.reportValidity()) return;
      action(event.currentTarget, async () => {
        const redirect = new URL(location.pathname, location.origin);
        redirect.searchParams.set('recovery', '1');
        const { error } = await client.auth.resetPasswordForEmail(email.value.trim(), { redirectTo: redirect.href });
        if (error) throw error;
        status(t('If the account is eligible, a reset email has been sent. Open it in this browser.', 'Hesap uygunsa sıfırlama e-postası gönderildi. Bağlantıyı bu tarayıcıda açın.'));
      });
    });

    async function logout() {
      signingOut = true;
      ++syncId;
      lock();
      recovery = false;
      storage.removeItem(storageKey + '-recovery');
      const { error } = await client.auth.signOut();
      clearCredentials();
      ++syncId;
      lock();
      signingOut = false;
      if (error) {
        status(t('Local session cleared. Server revocation could not be confirmed.', 'Yerel oturum temizlendi. Sunucuda iptal doğrulanamadı.'), true);
      } else {
        status(t('Signed out.', 'Çıkış yapıldı.'));
      }
    }

    $('logout')?.addEventListener('click', event => { if (canLeave()) action(event.currentTarget, logout); });

    $('recovery-form')?.addEventListener('submit', event => {
      event.preventDefault();
      const password = $('new-password').value;
      if (password.length < 12 || password !== $('confirm-password').value) {
        status(t('Use matching passwords with at least 12 characters.', 'En az 12 karakterli, birbiriyle aynı parolalar kullanın.'), true);
        return;
      }
      action(event.currentTarget.querySelector('button'), async () => {
        await service.authorize();
        const { error } = await client.auth.updateUser({ password });
        if (error) throw error;
        $('recovery-form').reset();
        await logout();
      });
    });

    // Navigation and tab clicks
    document.querySelectorAll('.admin-tab[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    document.querySelectorAll('[data-records]').forEach(button => {
      button.addEventListener('click', () => { if (!canLeave()) return; action(button, async () => {
        document.querySelectorAll('.admin-tab').forEach(b => b.classList.toggle('active', b === button));
        await records(button.dataset.records);
      }); });
    });

    // Subtab switching in editor
    document.querySelectorAll('.editor-subtabs .subtab').forEach(btn => {
      btn.addEventListener('click', () => {
        showSubtab(btn.dataset.subtab);
      });
    });

    // Live Markdown update
    $('article-body')?.addEventListener('input', updateLivePreview);

    // Character counters
    $('article-seo-title')?.addEventListener('input', e => updateCharCount('seo-title-count', e.target.value.length, 70));
    $('article-seo-description')?.addEventListener('input', e => updateCharCount('seo-desc-count', e.target.value.length, 160));

    // Search and filter triggers
    $('article-search')?.addEventListener('input', () => {page=0;filterArticles();});
    for (const id of ['filter-lang','filter-status','filter-type','article-sort']) $(id).addEventListener('change',()=>{page=0;filterArticles();});
    $('page-prev').addEventListener('click',()=>{page--;filterArticles();});
    $('page-next').addEventListener('click',()=>{page++;filterArticles();});
    $('btn-refresh-articles')?.addEventListener('click', () => action($('btn-refresh-articles'), () => records('articles')));

    // Editor close
    $('btn-close-editor')?.addEventListener('click', () => {
      if (!canLeave()) return;
      article = null; dirty = false; filterArticles();
      $('editor').hidden = true;
      if ($('tab-content-articles')) $('tab-content-articles').hidden = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Duplicate published article as editable draft
    $('btn-duplicate-draft')?.addEventListener('click', () => action($('btn-duplicate-draft'), async () => {
      if (!article) return;
      const baseSlug = (article.slug || 'article').replace(/-draft.*$/, '');
      const uniqueSuffix = Math.random().toString(36).substring(2, 6);
      const newDraftData = {
        title: `${article.title} (Draft)`,
        type: article.type || 'learn',
        language: article.language || 'en',
        slug: `${baseSlug}-draft-${uniqueSuffix}`,
        summary: article.summary || '',
        body_markdown: article.body_markdown || '',
        subtitle: article.subtitle || null,
        short_answer: article.short_answer || null,
        category_id: article.category_id || null,
        tags: Array.isArray(article.tags) ? article.tags : [],
        reading_minutes: Number(article.reading_minutes) || 5,
        seo_title: article.seo_title || article.title,
        seo_description: article.seo_description || article.summary,
        indexable: false
      };
      const active = generation;
      const created = await service.createArticle(newDraftData);
      if (active !== generation) return;
      allArticles = await service.listArticles();
      if (active !== generation) return;
      updateStats(allArticles);
      openEditor(created);
      status(t('Created editable draft from published article.', 'Makalenin bir taslak kopyası oluşturuldu. Artık düzenleyebilirsiniz.'));
    }));

    // Toggle Ready status
    $('btn-toggle-ready')?.addEventListener('click', () => action($('btn-toggle-ready'), async () => {
      if (!article) return;
      if (!await saveCurrent()) return;
      const active = generation;
      const targetStatus = article.status === 'ready' ? 'draft' : 'ready';
      const updated = await service.setArticleStatus(article, targetStatus);
      if (active !== generation || !article) return;
      article.status = updated.status;
      article.updated_at = updated.updated_at;
      if ($('editor-status-chip')) {
        $('editor-status-chip').textContent = stateNames[article.status] || article.status;
        $('editor-status-chip').className = `status-chip status-${article.status}`;
      }
      $('btn-toggle-ready').textContent = article.status === 'ready' ? t('Revert to Draft', 'Taslağa geri çevir') : t('Mark Ready', 'İncelemeye hazır');
      status(t(`Article marked as ${article.status}.`, `Makale ${article.status} olarak işaretlendi.`));
      upsertRow(article);
      await loadRevisions(article.id);
    }));

    $('editor').noValidate = true;
    // Editor save draft
    $('editor')?.addEventListener('submit', event => {
      event.preventDefault();
      action(event.currentTarget.querySelector('button[type="submit"]'), async () => {
        await saveCurrent();
      });
    });

    // Create New Article Form
    $('create-article-form')?.addEventListener('submit', event => {
      event.preventDefault();
      const form = event.currentTarget;
      action(form.querySelector('button[type="submit"]'), async () => {
        const title = $('new-article-title').value.trim();
        const type = $('new-article-type').value;
        const language = $('new-article-lang').value;
        const slug = $('new-article-slug').value.trim();
        const summary = $('new-article-summary').value.trim();

        const active = generation;
        const created = await service.createArticle({ title, type, language, slug, summary });
        if (active !== generation) return;
        form.reset();
        switchTab('articles', true);
        await records('articles');
        openEditor(created);
        status(t('New draft article created and loaded in editor.', 'Yeni taslak hazır. Yazmaya başlayabilirsiniz.'));
      });
    });

    $('btn-cancel-create')?.addEventListener('click', () => switchTab('articles'));

    // Taxonomy additions
    $('add-category-form')?.addEventListener('submit', event => {
      event.preventDefault();
      action(event.currentTarget.querySelector('button'), async () => {
        const id = $('cat-id').value.trim();
        const title_en = $('cat-title-en').value.trim();
        const title_tr = $('cat-title-tr').value.trim();
        await service.saveCategory({ id, slug: id, title_en, title_tr });
        $('add-category-form').reset();
        await loadTaxonomy();
        status(t('Category saved.', 'Kategori kaydedildi.'));
      });
    });

    $('add-tag-form')?.addEventListener('submit', event => {
      event.preventDefault();
      action(event.currentTarget.querySelector('button'), async () => {
        const slug = $('tag-slug').value.trim();
        const name_en = $('tag-name-en').value.trim();
        const name_tr = $('tag-name-tr').value.trim();
        await service.saveTag({ id: slug, slug, name_en, name_tr });
        $('add-tag-form').reset();
        await loadTaxonomy();
        status(t('Tag saved.', 'Etiket kaydedildi.'));
      });
    });

    $('editor').addEventListener('input', trackChanges);
    $('editor').addEventListener('change', trackChanges);
    window.addEventListener('beforeunload', event => { if (dirty || inbox.dirty() || busy) {event.preventDefault();event.returnValue='';} });
    document.querySelectorAll('[data-format]').forEach(button=>button.addEventListener('click',()=>{
      if (!editable(article) || busy) return;
      const body=$('article-body'), edit=markdownEdit(body.value,body.selectionStart,body.selectionEnd,button.dataset.format);
      body.value=edit.value; body.focus(); body.setSelectionRange(edit.start,edit.end); updateLivePreview(); trackChanges();
    }));
    let autoSlug = '';
    $('new-article-title').addEventListener('input',()=>{
      const input=$('new-article-slug');
      if (!input.value || input.value === autoSlug) {autoSlug=slugify($('new-article-title').value);input.value=autoSlug;}
    });
    $('btn-delete-draft').addEventListener('click',event=>{
      if (!article || !editable(article) || !confirm(t('Permanently delete this draft and its history?', 'Bu taslak ve sürüm geçmişi kalıcı olarak silinsin mi?'))) return;
      action(event.currentTarget,async()=>{
        const id=article.id, active=generation;
        await service.deleteDraft(article);
        if (active !== generation) return;
        allArticles=allArticles.filter(row=>row.id!==id); dirty=false; article=null;
        switchTab('articles',true); updateStats(allArticles); filterArticles();
        status(t('Draft deleted.','Taslak silindi.'));
      });
    });
    $('btn-export-draft').addEventListener('click',()=>{
      if (!article) return;
      const current={...article,...changes()};
      const file=new Blob(['---\n'+JSON.stringify({title:current.title,slug:current.slug,language:current.language,type:current.type,summary:current.summary,seo_title:current.seo_title,seo_description:current.seo_description,tags:current.tags},null,2)+'\n---\n\n'+current.body_markdown],{type:'text/markdown;charset=utf-8'});
      const url=URL.createObjectURL(file), link=document.createElement('a');
      link.href=url;link.download=current.slug+'.'+current.language+'.md';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
      status(t('Markdown downloaded. This does not publish the article.', 'Markdown indirildi. Bu işlem makaleyi yayımlamaz.'));
    });

    // Keyboard shortcut for saving: Ctrl+S / Cmd+S
    document.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        const editor = $('editor');
        if (editor && !editor.hidden && editable(article) && !busy) {
          event.preventDefault();
          editor.requestSubmit();
        }
      }
    });

    document.addEventListener('visibilitychange', () => { if (!document.hidden) synchronize().catch(report); });
    setInterval(() => { if (!document.hidden && !$('workspace')?.hidden) synchronize().catch(report); }, 60000);
    synchronize().catch(report);
  }
}
