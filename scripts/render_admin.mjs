import { escapeHtml } from './markdown_engine.mjs';
import { cosmicEnvironment } from './cosmic.mjs';
export function renderAdminPage({ assetBase = '../', language = 'en', config = null } = {}) {
  const tr = language === 'tr';
  const t = (en, turkish) => tr ? turkish : en;
  const base = escapeHtml(assetBase);
  const field = (id, label, type = 'text', autocomplete = '') => `<label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}"${autocomplete ? ` autocomplete="${autocomplete}"` : ''} required>`;
  return `<!doctype html><html lang="${language}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><meta name="referrer" content="no-referrer">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:; connect-src 'self'${config ? ' '+escapeHtml(config.url) : ''}; base-uri 'none'; form-action 'none'; object-src 'none'">
<title>${t('MESA Admin — Sign in','MESA Yönetim — Giriş')}</title>
<meta name="description" content="${t('Private MESA administration. Authentication is required; publishing is blocked.','Özel MESA yönetimi. Kimlik doğrulama gerekir; yayınlama kapalıdır.')}">
<link rel="icon" href="${base}assets/mesa-mark.webp" type="image/webp">
<link rel="stylesheet" href="${base}styles.css"><link rel="stylesheet" href="${base}cosmic.css"><link rel="stylesheet" href="${base}admin.css">
</head><body>${cosmicEnvironment('admin')}
<header class="admin-header"><a class="logo" href="${base}${tr ? 'tr/' : ''}"><img src="${base}assets/mesa-mark.webp" alt="" width="40" height="40">MESA</a><a href="${base}${tr ? 'admin/' : 'tr/admin/'}" lang="${tr ? 'en':'tr'}">${tr ? 'English':'Türkçe'}</a></header>
<main id="main-content" class="admin-shell">
<p class="eyebrow">MESA · ${t('ADMINISTRATION','YÖNETİM')}</p><h1>${t('A private workspace.','Özel çalışma alanı.')}</h1>
<p id="admin-status" role="status" aria-live="polite">${config ? t('Checking your session…','Oturumunuz denetleniyor…') : t('Authentication is not configured. Sign-in is unavailable.','Kimlik doğrulama yapılandırılmamış. Giriş kullanılamıyor.')}</p>
<noscript><p>${t('JavaScript is required for secure sign-in. Public documentation remains available.','Güvenli giriş için JavaScript gerekir. Genel dokümantasyon kullanılabilir.')}</p></noscript>
<section id="login-panel" class="admin-panel" aria-labelledby="login-title"><h2 id="login-title">${t('Administrator sign-in','Yönetici girişi')}</h2>
<form id="login-form"><fieldset disabled>${field('email',t('Email','E-posta'),'email','username')}${field('password',t('Password','Parola'),'password','current-password')}<button class="button primary" type="submit">${t('Sign in','Giriş yap')}</button></fieldset></form>
<button id="reset-request" class="button secondary" type="button" disabled>${t('Send password reset email','Parola sıfırlama e-postası gönder')}</button>
<p class="admin-note">${t('Access is restricted to administrators invited by the website owner.','Erişim, site sahibinin davet ettiği yöneticilerle sınırlıdır.')}</p></section>
<section id="recovery-panel" class="admin-panel" hidden><h2>${t('Choose a new password','Yeni parola belirleyin')}</h2><form id="recovery-form"><fieldset disabled>${field('new-password',t('New password (at least 12 characters)','Yeni parola (en az 12 karakter)'),'password','new-password')}${field('confirm-password',t('Confirm password','Parolayı doğrulayın'),'password','new-password')}<button class="button primary" type="submit">${t('Update password','Parolayı güncelle')}</button></fieldset></form></section>
<section id="workspace" hidden aria-labelledby="workspace-title"><div class="admin-toolbar"><h2 id="workspace-title">${t('Content workspace','İçerik çalışma alanı')}</h2><button id="logout" type="button" class="button secondary">${t('Sign out','Çıkış yap')}</button></div>
<p>${t('Draft editing is connected to the database. Publishing and media uploads are unavailable.','Taslak düzenleme veritabanına bağlıdır. Yayınlama ve medya yükleme kullanılamıyor.')}</p>
<div class="admin-toolbar"><button data-records="articles" type="button" class="button secondary">${t('Articles & drafts','Makaleler ve taslaklar')}</button><button data-records="media_assets" type="button" class="button secondary">${t('Media records','Medya kayıtları')}</button><button data-records="publication_jobs" type="button" class="button secondary">${t('Publication records','Yayın kayıtları')}</button></div>
<div id="records" class="admin-records"></div>
<form id="editor" class="admin-panel" hidden><fieldset><legend>${t('Edit existing draft','Mevcut taslağı düzenle')}</legend>${field('article-title',t('Title','Başlık'))}<label for="article-summary">${t('Summary','Özet')}</label><textarea id="article-summary" required rows="3"></textarea><label for="article-body">Markdown</label><textarea id="article-body" required rows="18" spellcheck="false"></textarea><button class="button primary" type="submit">${t('Save draft','Taslağı kaydet')}</button></fieldset></form>
<p class="admin-note">${t('Published articles are read-only. Saving a draft does not publish it to the website.','Yayımlanmış makaleler salt okunurdur. Taslak kaydetmek makaleyi web sitesinde yayımlamaz.')}</p></section>
<a class="admin-return" href="${base}${tr ? 'tr/' : ''}learn/">${t('Return to articles','Makalelere dön')} →</a>
</main><script id="admin-config" type="application/json">${JSON.stringify(config).replaceAll('<','\\u003c')}</script>
<script src="${base}cosmic-motion.js" defer></script><script src="${base}admin.js" defer></script></body></html>`;
}
