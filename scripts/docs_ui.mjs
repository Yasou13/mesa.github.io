// Shared, framework-free documentation chrome and introductory content.
import { escapeHtml as esc, generateTableOfContents } from './markdown_engine.mjs';
import { navigationIcon } from './navigation_icons.mjs';

export const docIcon = (name) => {
  const paths = {
    arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/>',
    copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    chevron: '<path d="m8 10 4 4 4-4"/>',
    rocket: '<path d="M14 5c3-3 7-2 7-2s1 4-2 7l-7 7-5-5 7-7Z"/><path d="m12 7-6 1-3 5 5 1m9-2-1 6-5 3-1-5m-5 1-2 4 4-2"/><circle cx="16" cy="8" r="1"/>',
    shield: '<path d="m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
    plug: '<path d="M8 3v5m8-5v5M6 8h12v3a6 6 0 0 1-12 0V8Zm6 9v5"/>',
    terminal: '<path d="m4 6 6 6-6 6m9 0h7"/>',
    file: '<path d="M14 3H5v18h14V8l-5-5Zm0 0v5h5M8 12h8m-8 4h6"/>',
  };
  return paths[name] ? `<svg class="docs-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>` : navigationIcon(name);
};

export function docsSidebar(manifest, currentRoute, language, {base = './', guides = new Map()} = {}) {
  const tr = language === 'tr';
  const route = p => base + p;
  const selectedKey = Object.keys(manifest.repositories).find(key => currentRoute.startsWith(manifest.repositories[key].base_route)) || 'core';
  const repo = manifest.repositories[selectedKey];
  const active = p => p === currentRoute ? ' class="active" aria-current="page"' : '';
  const groups = {start: ['Getting started', 'Başlangıç'], concepts: ['Core concepts', 'Temel kavramlar'], retrieval: ['Retrieval & evidence', 'Arama ve kanıt'], reference: ['Build & integrate', 'Geliştirme ve entegrasyon'], operate: ['Operate & recover', 'İşletim ve kurtarma'], release: ['Releases & verification', 'Yayın ve doğrulama']};
  const groupIcons = ['rocket', 'layers', 'network', 'code', 'terminal', 'shield'];
  const links = pages => pages.map(p => `<li><a href="${route(p.route)}"${active(p.route)}>${esc(p.title[language] || p.title.en)}</a></li>`).join('');
  const sections = selectedKey === 'core' ? Object.entries(groups).map(([key, names], i) => `<section class="sidebar-group"><div class="sidebar-group-header">${docIcon(groupIcons[i])}<span>${names[tr ? 1 : 0]}</span></div><ul class="sidebar-links">${links(repo.pages.filter(p => guides.get(p.route)?.group === key && !guides.get(p.route)?.hidden))}</ul></section>`).join('') : `<section class="sidebar-group"><div class="sidebar-group-header">${docIcon('book-open')}<span>${tr ? 'Rehberler ve referanslar' : 'Guides & references'}</span></div><ul class="sidebar-links">${links(repo.pages)}</ul></section>`;
  return `<aside class="docs-sidebar" aria-label="${tr ? 'Dokümantasyon gezintisi' : 'Documentation navigation'}"><details class="docs-navigation" open><summary>${docIcon('book-open')}<span>${tr ? 'Belge menüsü' : 'Documentation menu'}</span>${docIcon('chevron')}</summary><div class="docs-sidebar-inner">
    <div class="docs-sidebar-header"><a href="${route('docs/')}" class="docs-wordmark">MESA <span>/ docs</span></a><span class="docs-sidebar-caption">${tr ? 'Geliştirici dokümantasyonu' : 'Developer documentation'}</span></div>
    <details class="docs-product-select"><summary>${docIcon('layers')}<span>${esc(repo.title[language] || repo.title.en)}</span><small>${esc(repo.version)}</small>${docIcon('chevron')}</summary><nav aria-label="${tr ? 'Bileşen seçimi' : 'Choose component'}">${(() => { const item = ([key, r]) => `<a href="${route(r.base_route)}"${key === selectedKey ? ' aria-current="true"' : ''}><span>${esc(r.title[language] || r.title.en)}</span><small>${esc(r.version)}</small></a>`; const internal = new Set(['qa', 'e2e']); const entries = Object.entries(manifest.repositories); return entries.filter(([key]) => !internal.has(key)).map(item).join('') + `<span class="docs-product-divider">${tr ? 'İç test araçları' : 'Internal test tooling'}</span>` + entries.filter(([key]) => internal.has(key)).map(item).join(''); })()}</nav></details>
    <button class="search-trigger docs-search" type="button" aria-label="${tr ? 'Dokümantasyonda ara' : 'Search documentation'}">${docIcon('search')}<span>${tr ? 'Belgelerde ara…' : 'Search docs…'}</span><kbd>Ctrl K</kbd></button>
    <nav class="docs-nav" aria-label="${tr ? 'Belge konuları' : 'Documentation topics'}"><ul class="sidebar-links docs-overview-links"><li><a href="${route('docs/')}"${active('docs/')}>${docIcon('book-open')}${tr ? 'Giriş' : 'Introduction'}</a></li><li><a href="${route('docs/mcp/')}"${active('docs/mcp/')}>${docIcon('plug')}${tr ? 'MCP entegrasyonu' : 'MCP integration'}</a></li></ul>${sections}</nav>
    <div class="docs-sidebar-footer"><a href="${esc(repo.repo_url.replace(/\.git$/, ''))}" target="_blank" rel="noopener noreferrer">${docIcon('github')}<span>GitHub</span><span aria-hidden="true">↗</span></a><a href="${route('status/')}">${tr ? 'Proje durumu' : 'Project status'}<span aria-hidden="true">↗</span></a></div>
  </div></details></aside>`;
}

export function docsTabs(currentRoute, language, base) {
  const tr = language === 'tr';
  const items = [
    ['docs/', tr ? 'Dokümantasyon' : 'Documentation', 'book-open', !/mcp|api-reference|endpoints|examples|installation|cli-reference/.test(currentRoute)],
    ['docs/core/installation/', tr ? 'Kurulum' : 'Deploy', 'layers', currentRoute.includes('installation')],
    ['docs/core/cli-reference/', 'MESA CLI', 'terminal', currentRoute.includes('cli-reference')],
    ['docs/core/examples/', 'Python SDK', 'code', currentRoute.includes('examples')],
    ['docs/core/api-reference/', 'HTTP API', 'terminal', /api-reference|endpoints/.test(currentRoute)],
    ['docs/mcp/', 'MCP', 'plug', currentRoute.includes('mcp')],
  ];
  return `<nav class="docs-tabs" aria-label="${tr ? 'Dokümantasyon alanları' : 'Documentation sections'}">${items.map(([p, label, icon, active]) => `<a href="${base + p}"${active ? ' class="active"' : ''}>${docIcon(icon)}<span>${label}</span></a>`).join('')}<a class="docs-tabs-release" href="${base}docs/core/release-notes/">v0.9.0<span class="docs-release-dot" aria-hidden="true"></span></a></nav>`;
}

export const docsCopyButton = tr => `<button class="docs-copy-page" type="button" hidden>${docIcon('copy')}<span aria-live="polite">${tr ? 'Sayfayı kopyala' : 'Copy page'}</span></button>`;
export const docsFooter = (tr, base) => `<footer class="docs-footer"><span>MESA <span aria-hidden="true">/</span> ${tr ? 'Kaynağını koruyan hafıza.' : 'Memory that keeps its evidence.'}</span><a href="${base}docs/core/release-notes/">v0.9.0</a><a href="${base}docs/core/security/">${tr ? 'Güvenlik' : 'Security'}</a><span>${tr ? 'MIT · Açık kaynak' : 'MIT · Open source'}</span></footer>`;

export function docsFrame({manifest, currentRoute, language, base, guides, headerHtml, content, toc}) {
  const tr = language === 'tr';
  return `${headerHtml}<main id="main-content" class="docs-layout">${docsTabs(currentRoute, language, base)}${docsSidebar(manifest, currentRoute, language, {base, guides})}<div class="docs-main-container"><div class="docs-content-column">${content}</div><aside class="docs-toc-column" aria-label="${tr ? 'İçindekiler' : 'Table of contents'}">${toc}<div class="docs-rail-note">${docIcon('shield')}<p>${tr ? 'Kaynak koduna dayanan belgeler' : 'Source-backed documentation'}</p><a href="${base}docs/core/release-notes/">${tr ? 'Sürüm ve kapsam' : 'Release & scope'} <span aria-hidden="true">↗</span></a></div></aside></div></main>${docsFooter(tr, base)}`;
}

export function hubContent(manifest, language, base) {
  const tr = language === 'tr';
  const t = (en, turkish) => tr ? turkish : en;
  const route = p => base + p;
  const headings = [['start', t('Start building with MESA', 'MESA ile geliştirmeye başlayın')], ['memory-flow', t('From source to evidence', 'Kaynaktan kanıta')], ['interfaces', t('Choose your interface', 'Entegrasyon yolunuzu seçin')], ['ecosystem-docs', t('Explore the ecosystem', 'Ekosistemi keşfedin')], ['release-scope', t('Know your release', 'Bu sürüm neleri destekliyor?')]];
  const toc = generateTableOfContents(headings.map(([id, title]) => ({id, title, level: 2})), {label: t('On this page', 'Bu sayfada')});
  const interfaces = [
    ['code', 'Python SDK', t('Build memory into your Python application with worked V4 examples.', 'V4 örnekleriyle Python uygulamanıza hafıza ekleyin.'), 'docs/core/examples/', t('Explore examples', 'Örnekleri keşfedin')],
    ['terminal', 'HTTP API', t('Connect through scoped API contracts, operations and authorization.', 'Erişim izinlerini ve işlem durumlarını gözeten HTTP API’siyle bağlanın.'), 'docs/core/api-reference/', t('Read the reference', 'Referansı okuyun')],
    ['plug', 'MCP', t('Connect agents through the V4 gateway and local bridge.', 'Ajanları V4 geçidi ve yerel köprü üzerinden bağlayın.'), 'docs/mcp/', t('Integrate your agent', 'Ajanınızı bağlayın')],
    ['terminal', 'MESA CLI', t('Start MESA, add documents and search from your terminal. Included with the mesa-memory package.', 'MESA’yı terminalden başlatın, belge ekleyip arayın. mesa-memory paketiyle birlikte gelir.'), 'docs/core/cli-reference/', t('Explore CLI commands', 'CLI komutlarını inceleyin')]
  ];
  const stages = [
    ['file', t('Source', 'Kaynak'), t('Documents & context', 'Belgeler ve bağlam'), 'source'],
    ['layers', t('Memory', 'Hafıza'), t('Canonical assertions', 'Asıl bilgi kayıtları'), 'memory'],
    ['network', t('Retrieval', 'Arama'), t('Scope-aware recall', 'Yetkili kapsamda arama'), 'retrieval'],
    ['shield', t('Evidence', 'Kanıt'), t('Traceable references', 'İzlenebilir referanslar'), 'evidence']
  ];
  const descriptions = {
    core: t('Memory runtime, storage, retrieval and public interfaces.', 'Bilginin işlenmesi, saklanması, aranması ve uygulamalara sunulması.'),
    data: t('Source acquisition, validation and immutable releases.', 'Kaynak edinimi, doğrulama ve değişmez yayınlar.'),
    law: t('Legal workflows built on source-backed memory.', 'Kaynağıyla bağlantılı hafıza üzerine kurulan hukuk iş akışları.'),
    qa: t('Independent behavior, persistence and restart checks.', 'Bağımsız davranış, kalıcılık ve yeniden başlatma kontrolleri.'),
    e2e: t('Profile B contracts, receipts and certification gates.', 'Profile B’nin doğrulama kuralları, işlem alındıları ve sertifikasyon koşulları.')
  };
  const content = `<article class="docs-hub-content" data-doc-copy-content>
    <header class="docs-intro"><div class="docs-kicker">${t('GETTING STARTED', 'BAŞLANGIÇ')}<span>/</span>${t('Introduction', 'Giriş')}</div><div class="docs-title-row"><h1>${t('Give your agents memory.<br><span>Keep the evidence.</span>', 'Ajanlarınıza hafıza kazandırın.<br><span>Kanıtı koruyun.</span>')}</h1>${docsCopyButton(tr)}</div><p class="docs-lead">${t('Build with MESA, the evidence-aware memory infrastructure for AI agents. Ingest sources, retrieve scoped context, and trace every assertion back to its origin.', 'MESA ile yapay zekâ ajanlarınıza kalıcı hafıza ekleyin. Kaynakları sisteme aktarın, yalnızca erişime izin verilen bilgileri bulun ve her kaydı dayandığı metne kadar izleyin.')}</p></header>
    <section id="start" class="docs-start-section"><a class="docs-quickstart-card" href="${route('get-started/')}"><span class="docs-card-icon">${docIcon('rocket')}</span><div><span class="docs-mini-label">${t('YOUR FIRST STEP', 'İLK ADIMINIZ')}</span><h2>${headings[0][1]}</h2><p>${t('Install v0.9.0, run mesa start, then add and search a document. BM25 works without a model.', 'v0.9.0 sürümünü kurun, mesa start çalıştırın; belge ekleyip arayın. BM25, model olmadan çalışır.')}</p><span class="docs-inline-link">${t('Open the quickstart', 'Hızlı başlangıcı açın')} ${docIcon('arrow')}</span></div>${docIcon('arrow')}</a><div class="docs-start-links"><a href="${route('docs/core/installation/')}">${t('Installation options', 'Kurulum seçenekleri')} <span>↗</span></a><span>Python 3.11–3.13 <span aria-hidden="true">·</span> v0.9.0</span></div></section>
    <section id="memory-flow" class="docs-hub-section"><div class="docs-section-heading"><h2>${headings[1][1]}</h2><a href="${route('docs/core/concepts-and-ingestion/')}">${t('How it works', 'Nasıl çalışır')} ${docIcon('arrow')}</a></div><p>${t('Memory is useful when you can follow it back to the source. MESA keeps that connection through the full lifecycle.', 'Saklanan bilginin dayanağını görebilmeniz gerekir. MESA, bilgi eklenirken, değişirken ve aranırken kaynakla bağlantısını korur.')}</p><figure class="docs-memory-flow"><div class="docs-flow-track">${stages.map(([icon, title, sub, style], i) => `<div class="docs-flow-stage docs-flow-stage--${style}"><div class="docs-flow-visual">${docIcon(icon)}${i === 1 ? '<i></i><i></i><i></i>' : ''}</div><span class="docs-flow-number">0${i + 1}</span><strong>${title}</strong><small>${sub}</small></div>`).join('')}</div><figcaption>${t('Source text → durable memory → authorized retrieval → source references', 'Kaynak metni → kalıcı hafıza → yetkili arama → kaynak referansları')}</figcaption></figure></section>
    <section id="interfaces" class="docs-hub-section"><h2>${headings[2][1]}</h2><p>${t('Use the interface that fits your application. Each path leads to the same source-backed memory system.', 'Uygulamanıza uygun arayüzü seçin. Bu seçeneklerin tümü bilgiyi kaynaklarıyla birlikte saklayan aynı sisteme erişir.')}</p><div class="docs-interface-grid">${interfaces.map(([icon, title, desc, href, label]) => `<a class="docs-interface-card" href="${route(href)}">${docIcon(icon)}<h3>${title}</h3><p>${desc}</p><span>${label} ${docIcon('arrow')}</span></a>`).join('')}</div></section>
    <section id="ecosystem-docs" class="docs-hub-section"><h2>${headings[3][1]}</h2><p>${t('Five components, clear boundaries. Find the contract for the part you are working with.', 'Beş bileşenin görevi farklıdır. Kullandığınız bileşenin nasıl çalıştığını ilgili belgelerden öğrenin.')}</p><div class="docs-repo-list">${Object.entries(manifest.repositories).map(([key, repo], i) => `<a href="${route(repo.base_route)}"><span class="docs-repo-number">0${i + 1}</span><div><h3>${esc(repo.title[language] || repo.title.en)}</h3><p>${descriptions[key]}</p></div><span class="version-tag">${esc(repo.version)}</span>${docIcon('arrow')}</a>`).join('')}</div></section>
    <section id="release-scope" class="docs-release-note">${docIcon('shield')}<div><h2>${headings[4][1]}</h2><p>${t('These docs follow the published v0.9.0 Core source release. A published package is separate from production qualification and fresh Profile B certification.', 'Bu belgeler yayımlanan Core v0.9.0 sürümüne göre hazırlanmıştır. Kaynak kodunun yayımlanmış olması, canlı kullanım onayı veya yeni bir Profile B sertifikasyonu anlamına gelmez.')}</p><a href="${route('docs/core/release-notes/')}">${t('Read release notes & limitations', 'Sürüm notlarını ve sınırları okuyun')} ${docIcon('arrow')}</a></div></section>
  </article>`;
  return {content, toc};
}
