// Fail closed until the authenticated CMS and publication backend exist.
import { cosmicEnvironment } from './cosmic.mjs';
import { escapeHtml } from './markdown_engine.mjs';

export function renderAdminPage({ assetBase = '../', language = 'en' } = {}) {
  const tr = language === 'tr';
  const title = tr ? 'MESA Yönetim — Kullanıma kapalı' : 'MESA Admin — Unavailable';
  return `<!doctype html>
<html lang="${language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <meta name="description" content="MESA administration backend is unavailable; publishing is blocked.">
  <title>${title}</title>
  <link rel="icon" href="${escapeHtml(assetBase)}assets/mesa-logo.png" type="image/png">
  <link rel="stylesheet" href="${escapeHtml(assetBase)}styles.css">
  <link rel="stylesheet" href="${escapeHtml(assetBase)}cosmic.css">
</head>
<body>
${cosmicEnvironment('admin')}
<main id="main-content" class="knowledge-article">
  <header class="article-header">
    <p class="eyebrow">MESA · ${tr ? 'YÖNETİM DURUMU' : 'ADMIN STATUS'}</p>
    <h1>${tr ? 'Yönetim sistemi henüz bağlı değil.' : 'The administration backend is not connected.'}</h1>
    <p>${tr ? 'Giriş, sunucuda taslak kaydetme, revizyon, medya yükleme ve makale yayınlama şu anda kullanılamıyor.' : 'Login, server-side drafts, revisions, media uploads and article publishing are currently unavailable.'}</p>
  </header>
  <section class="article-body">
    <h2>${tr ? 'Yayınlama engelli' : 'Publishing blocked'}</h2>
    <p>${tr ? 'Kimlik doğrulama, sunucu yetkilendirmesi, içerik aktarımı ve doğrulanmış dağıtım sonucu uygulanmadan yayın işlemi başlatılamaz.' : 'Publishing requires authentication, server-side authorization, content export and a verified deployment result before it can be enabled.'}</p>
    <p>${tr ? 'Bu sayfa oturum veya yönetici yetkisi vermez. Önceki tarayıcı taslakları bu sayfa tarafından okunmaz veya silinmez.' : 'This page grants no session or administrator role. Any previous browser drafts are neither read nor deleted by this page.'}</p>
    <p>${tr ? 'Mevcut yayın kaynağı content/hub.json dosyasıdır. Yerel Markdown dosyaları henüz Learn oluşturucusuna bağlı değildir.' : 'The current publication source is content/hub.json. Local Markdown articles are not yet connected to the Learn builder.'}</p>
    <a class="button secondary" href="${escapeHtml(assetBase)}${tr ? 'tr/learn/' : 'learn/'}">${tr ? 'Makalelere dön' : 'Return to articles'}</a>
    <a class="button secondary" href="${escapeHtml(assetBase)}${tr ? 'admin/' : 'tr/admin/'}" lang="${tr ? 'en' : 'tr'}">${tr ? 'English' : 'Türkçe'}</a>
  </section>
</main>
</body>
</html>`;
}
