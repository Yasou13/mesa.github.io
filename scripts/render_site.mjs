import { navigationIcon } from './navigation_icons.mjs';
import { learningIndex, renderLesson, validateCurriculum } from './render_learn.mjs';
import { beginnerHow, beginnerEcosystem, beginnerFaq } from './render_intro.mjs';
import fs from 'node:fs';
import { cosmicEnvironment, cosmicVariant } from './cosmic.mjs';
import { productHome, architecturePage, retrievalPage, productTranslations } from './render_product.mjs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { getAllDocRoutes, renderDocPage, renderDocsHub, renderMcpGuide } from './render_docs.mjs';
import { renderAdminPage } from './render_admin.mjs';
import { earlyAccessPage } from './render_early_access.mjs';
import { privacyPage } from './render_privacy.mjs';
import { adminConfig } from './admin/config.mjs';
const publicAdminConfig = adminConfig(process.env);
import { writeSearchIndex } from './generate_search_index.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(scriptDirectory);
const siteData = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'site-data.json'), 'utf8'));
const trContent = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'content', 'tr.json'), 'utf8'));
const courseData = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'content/learn-curriculum.json'), 'utf8'));
const hubData = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'content', 'hub.json'), 'utf8'));
const glossaryTerms = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'content', 'glossary-terms.json'), 'utf8')).terms;
const mediaData = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'content', 'media-scenes.json'), 'utf8'));
const project = siteData.project;
const repos = siteData.repositories;
let base = './';
let assetBase = './';
let currentLanguage = 'en';
let currentPage = siteData.pages.home;
let alternateHref = './tr/';
const assetVersion = (filename) => crypto
  .createHash('sha256')
  .update(fs.readFileSync(path.join(repositoryRoot, 'dist', filename)))
  .digest('hex')
  .slice(0, 12);
const assetVersions = {
  css: assetVersion('styles.css'),
  accessCss: assetVersion('early-access.css'),
  accessJs: assetVersion('early-access.js'),
  learn: assetVersion('learn.css'),
  cosmic: assetVersion('cosmic.css'),
  cosmicMotion: assetVersion('cosmic-motion.js'),
  js: assetVersion('app.js'),
  docs: assetVersion('docs.css'),
  docsJs: assetVersion('docs.js'),
  logo: assetVersion('assets/mesa-mark.webp'),
  faviconSvg: assetVersion('favicon.svg'),
  faviconIco: assetVersion('favicon.ico')
};

const requiredSceneIds = ['event-horizon'];
const scenes = new Map(mediaData.scenes.map((scene) => [scene.id, scene]));

function validateMediaData() {
  if (mediaData.schemaVersion !== 1 || !/^[a-zA-Z0-9_/-]+\/$/.test(mediaData.mediaRoot) || mediaData.mediaRoot.startsWith('/') || mediaData.mediaRoot.includes('..') || !Array.isArray(mediaData.scenes)) {
    throw new Error('Invalid media scene manifest');
  }
  if (scenes.size !== mediaData.scenes.length) throw new Error('Duplicate media scene id');
  for (const id of requiredSceneIds) {
    if (!scenes.has(id)) throw new Error(`Missing required media scene: ${id}`);
  }
  // Validate every record, including future bounded Core/Data poster records.
  for (const scene of mediaData.scenes) {
    const { id } = scene;
    if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`Invalid media scene id: ${id}`);
    if (!['cover', 'contain'].includes(scene.fit)) throw new Error(`Invalid media fit for ${id}`);
    if (scene.overlayOpacity < 0 || scene.overlayOpacity > 1) throw new Error(`Invalid overlay opacity for ${id}`);
    if (!scene.focalPoint?.desktop || !scene.focalPoint?.mobile || !scene.assets) throw new Error(`Incomplete media scene: ${id}`);
    for (const value of Object.values(scene.assets)) {
      if (value !== null && (typeof value !== 'string' || !/^[a-zA-Z0-9_./-]+$/.test(value) || value.startsWith('/') || value.includes('..'))) {
        throw new Error(`Unsafe media asset path in ${id}`);
      }
      if (value !== null && !fs.existsSync(path.join(repositoryRoot, 'dist', mediaData.mediaRoot, value))) {
        throw new Error(`Configured media asset is missing for ${id}: ${value}`);
      }
    }
    for (const [key, sizeKey] of [['poster', 'posterSize'], ['mobilePoster', 'mobilePosterSize']]) {
      if (!scene.assets[key]) continue;
      const size = scene[sizeKey];
      if (!size || !Number.isInteger(size.width) || !Number.isInteger(size.height) || size.width <= 0 || size.height <= 0) {
        throw new Error(`Missing intrinsic dimensions for ${id}: ${key}`);
      }
    }
  }
}
validateMediaData();

const docs = {
  readme: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/README.md`,
  gettingStarted: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/getting-started.md`,
  architecture: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md`,
  concepts: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/concepts-and-ingestion.md`,
  configuration: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/configuration.md`,
  retrieval: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/retrieval-and-graph.md`,
  api: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/api-reference.md`,
  cli: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/api-reference.md#cli-commands`,
  mcp: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/README_MCP.md`,
  installation: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/getting-started.md#installation`,
  migration: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/RUNBOOK.md#upgrade-v080`,
  releaseNotes: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/CHANGELOG.md#090---2026-10-28`,
  releasePolicy: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/release.md`,
  rebuild: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/v4-rebuild-runbook.md`,
  security: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/SECURITY.md`,
  troubleshooting: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/RUNBOOK.md#troubleshooting`,
  limitations: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md#limitations`,
  contributing: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/CONTRIBUTING.md`,
  openapi: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/reference/openapi.json`,
  retrievalFixture: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/tests/test_v4_independent_retrieval_audit.py`,
  retrievalAudit: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/testing.md`,
  certificationAudit: `${repos.certification}/blob/3b7562cb65800cde27877dc3a7cd505a70822bf8/reports/profile-b-comprehensive-repair/FINAL_AUDIT_AND_REPAIR_REPORT.md`,
  dataGuide: `${repos.data}/blob/main/docs/KULLANIM_KILAVUZU.md`,
  lawStatus: `${repos.law}/blob/b791be27a5d9d2e0306057529f6a5dce222673a4/docs/mvp-final-verification.md`
};

const route = (path = '') => `${base}${path}`;
const asset = (path = '') => `${assetBase}${path}`;
const iconPaths = {
  arrow: '<path d="M5 12h13M14 7l5 5-5 5"/>',
  external: '<path d="M13 5h6v6M19 5l-8 8"/><path d="M17 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h5"/>',
  memory: '<path d="M7 5.5h7.5A2.5 2.5 0 0 1 17 8v8.5H9.5A2.5 2.5 0 0 1 7 14V5.5Z"/><path d="M7 8H5.5A2.5 2.5 0 0 0 3 10.5V18h9.5A2.5 2.5 0 0 0 15 15.5"/>',
  evidence: '<path d="M6 3.5h9l3 3V20.5H6z"/><path d="M15 3.5v3h3M9 11h6M9 15h4"/><circle cx="17.5" cy="16.5" r="3"/>',
  provenance: '<circle cx="5" cy="12" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M7.5 11l9-4M7.5 13l9 4"/>',
  scope: '<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/><circle cx="12" cy="12" r="3.5"/>',
  relationship: '<circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="3"/><path d="M9 12h6"/>',
  graph: '<circle cx="5" cy="17" r="2.5"/><circle cx="12" cy="5" r="2.5"/><circle cx="19" cy="17" r="2.5"/><path d="m6.3 14.8 4.4-7.6M13.3 7.2l4.4 7.6M7.5 17h9"/>',
  source: '<path d="M5 5.5h10.5A2.5 2.5 0 0 1 18 8v10.5H7.5A2.5 2.5 0 0 1 5 16z"/><path d="M8 9h7M8 12h5"/>',
  retrieval: '<circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 4.5 4.5M10.5 7.5v6M7.5 10.5h6"/>',
  lifecycle: '<path d="M19 8a7.5 7.5 0 1 0 .2 7.5"/><path d="M19 3v5h-5"/><path d="M12 8v4l3 2"/>',
  verification: '<path d="m12 3 7 3v5c0 4.6-2.8 8-7 10-4.2-2-7-5.4-7-10V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>',
  dataset: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  assertion: '<path d="M5 5h14v14H5z"/><path d="m8.5 12 2.2 2.2 4.8-5"/>'
};
const icon = (name, className = '') => `<svg class="mesa-icon${className ? ` ${className}` : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${iconPaths[name]}</svg>`;
const external = (href, label, className = '') =>
  `<a class="${className}" href="${href}" target="_blank" rel="noopener noreferrer"><span>${label}</span>${icon('external', 'icon-external')}</a>`;
const cta = (label, href, kind = 'primary', isExternal = false) =>
  `<a class="button ${kind}" href="${href}"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''}><span>${label}</span>${icon(isExternal ? 'external' : 'arrow', isExternal ? 'icon-external' : 'icon-arrow')}</a>`;

const mark = () => `<span class="mesa-mark" aria-hidden="true"><img src="${asset('assets/mesa-mark.webp')}?v=${assetVersions.logo}" alt="" width="256" height="124"></span>`;
const logo = () => `<a class="logo" href="${route()}" aria-label="${currentLanguage === 'tr' ? 'MESA ana sayfa' : 'MESA home'}">${mark()}<span>MESA</span></a>`;

function languageControl() {
  const enHref = currentLanguage === 'en' ? `${base}${currentPage.path}` : alternateHref;
  const trHref = currentLanguage === 'tr' ? `${base}${currentPage.path}` : alternateHref;
  return `<div class="language-switch" role="group" aria-label="${currentLanguage === 'tr' ? 'Dil seçimi' : 'Language'}">
    <a lang="en" hreflang="en"${currentLanguage === 'en' ? ' class="active" aria-current="page"' : ''} href="${enHref}">EN<span class="sr-only"> · ${currentLanguage === 'tr' ? 'İngilizce' : 'English'}</span></a>
    <span aria-hidden="true">/</span>
    <a lang="tr" hreflang="tr"${currentLanguage === 'tr' ? ' class="active" aria-current="page"' : ''} href="${trHref}">TR<span class="sr-only"> · Türkçe</span></a>
  </div>`;
}

function header(active = '') {
  const nav = [
    ['how', 'How it works', 'how-it-works/', 'workflow'],
    ['ecosystem', 'Ecosystem', 'ecosystem/', 'network'],
    ['architecture', 'Architecture', 'architecture/', 'layers'],
    ['resources', 'Resources', 'resources/', 'library'],
    ['docs', 'Docs', 'docs/', 'book-open'],
  ];
  return `<a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <div class="nav-shell">
        ${logo()}
        <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="main-navigation">
          <span></span><span></span><span></span>
        </button>
        <nav id="main-navigation" aria-label="Main navigation">
          ${nav.map(([key, label, path, glyph]) => `<a class="nav-item${active === key ? ' active' : ''}"${active === key ? ' aria-current="page"' : ''} href="${route(path)}"><span class="nav-symbol" aria-hidden="true">${navigationIcon(glyph)}</span><span>${label}</span></a>`).join('')}
          <button class="search-trigger" type="button" aria-label="Search site (Ctrl+K)">${navigationIcon('search')}<span>Search</span><kbd class="search-shortcut">Ctrl K</kbd></button>
          ${languageControl()}
          <a class="nav-github" href="${repos.core}" target="_blank" rel="noopener noreferrer">${navigationIcon('github')}<span>GitHub</span>${icon('external', 'icon-external')}</a>
        </nav>
      </div>
    </header>`;
}

// Chrome strings are shared by product, hub and docs pages, so they register in both maps.
const chrome = (en, tr) => { trContent.strings[en] = tr; productTranslations[en] = tr; return en; };

function footer() {
  return `
    <footer class="site-footer">
      <div class="footer-brand">${logo()}<p>${chrome('Document search for your AI application.', 'Yapay zekâ uygulamanız için belge arama.')}</p><p class="footer-note"><span>v${project.version}</span> · <span>${chrome('Alpha', 'Alfa')}</span> · <a href="${route('status/')}">${chrome('Project status →', 'Proje durumu →')}</a></p></div>
      <div class="footer-groups">
        <div><h3>${chrome('Product', 'Ürün')}</h3><a href="${route('how-it-works/')}">${chrome('How it works', 'Nasıl çalışır')}</a><a href="${route('architecture/')}">${chrome('Architecture', 'Mimari')}</a><a href="${route('ecosystem/')}">${chrome('Ecosystem', 'Ekosistem')}</a><a href="${route('#use-cases')}">${chrome('Use cases', 'Kullanım alanları')}</a><a href="${route('law/')}">MESA Law</a></div>
        <div><h3>${chrome('Developers', 'Geliştiriciler')}</h3><a href="${route('docs/core/getting-started/')}">${chrome('Quickstart', 'Hızlı başlangıç')}</a><a href="${route('docs/core/cli-reference/')}">MESA CLI</a><a href="${route('docs/core/api-reference/')}">${chrome('API reference', 'API referansı')}</a><a href="${route('docs/core/examples/')}">Python SDK</a><a href="${route('docs/mcp/')}">MCP</a><a href="${route('docs/core/security/')}">${chrome('Security', 'Güvenlik')}</a></div>
        <div><h3>${chrome('Learn', 'Öğrenin')}</h3><a href="${route('learn/')}">${chrome('Lessons', 'Dersler')}</a><a href="${route('glossary/')}">${chrome('Glossary', 'Sözlük')}</a><a href="${route('guides/')}">${chrome('Guides', 'Rehberler')}</a><a href="${route('faq/')}">${chrome('FAQ', 'SSS')}</a></div>
        <div><h3>${chrome('Project', 'Proje')}</h3><a href="${route('about/')}">${chrome('About', 'Hakkında')}</a><a href="${route('early-access/')}">${chrome('Early access', 'Erken erişim')}</a><a href="${route('privacy/')}">${chrome('Privacy', 'Gizlilik')}</a>${external(repos.issues, chrome('Open an issue', 'Issue açın'))}${external(`${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/LICENSE`, chrome('MIT License', 'MIT Lisansı'))}</div>
      </div>
      <div class="footer-bottom"><span>© 2026 MESA contributors</span><span>${chrome('Docs match Core v0.9.0 · 7062faf', 'Belgeler Core v0.9.0 · 7062faf ile uyumlu')}</span></div>
    </footer>`.trim();
}

function statusStrip() {
  return `<section class="status-strip" aria-label="Current project status">
      <div><small>CORE LINE</small><strong>v${project.version} / ${project.runtime}</strong></div>
      <div><small>MATURITY</small><strong>${project.maturity}</strong></div>
      <div><small>FINAL MVP CERTIFICATION</small><strong>${project.certification}</strong></div>
      <div><small>PRODUCTION</small><strong class="status-no-go">${project.production}</strong></div>
    </section>`;
}

function publicFlow(compact = false) {
  const items = compact ? [
    ['01', 'Source', 'Exact source material and identity'],
    ['02', 'Remember', 'Core admits scoped memory and keeps evidence'],
    ['03', 'Retrieve', 'Authorized signals are rank-fused'],
    ['04', 'Verify & use', 'Provenance and scope travel with context']
  ] : [
    ['01', 'Source', 'Exact source material and identity'],
    ['02', 'Prepare', 'MESA Data preserves and reviews legal inputs'],
    ['03', 'Remember', 'Core admits scoped memory and keeps evidence'],
    ['04', 'Retrieve', 'Four authorized signals are rank-fused'],
    ['05', 'Verify', 'Provenance and scope travel with the result'],
    ['06', 'Use', 'Applications consume bounded context']
  ];
  return `<ol class="public-flow" aria-label="Simple MESA flow">${items.map(([n, title, text]) => `<li><span>${n}</span><strong>${title}</strong><small>${text}</small></li>`).join('')}</ol>`;
}

function actionExample(compact = false) {
  if (compact) return `<div class="memory-example panel--evidence">
    <div class="memory-example__query"><span class="text--meta">QUERY</span><code>“Alice”</code><span class="text--meta">Deterministic test fixture</span></div>
    <div class="memory-example__body">
      <div class="memory-example__knowledge"><span class="text--meta">RETRIEVED KNOWLEDGE</span><p><strong>Alice</strong><span>knows</span><strong>Aurora</strong></p><p class="memory-example__identity">One assertion. Its source still attached.</p></div>
      <div class="memory-example__evidence"><span class="text--meta">EVIDENCE</span><dl><div><dt>source</dt><dd><code>source-chunk-1</code></dd></div><div><dt>document / chunk</dt><dd><code>doc-1 / chunk-1</code></dd></div><div><dt>span</dt><dd>“Alice knows Aurora”</dd></div></dl></div>
    </div>
    <details class="memory-example__details"><summary>Retrieval signals & application context</summary><div class="memory-example__expanded"><div><ul class="signal-list"><li>vector <b>rank 1</b></li><li>BM25 <b>rank 1</b></li><li>assertion <b>rank 1</b></li><li>graph path <b>rank 1</b></li></ul><p class="fixture-score">Expected RRF: 4 ÷ 61</p></div><div><span class="text--meta">APPLICATION CONTEXT</span><pre tabindex="0"><code>UNTRUSTED_MEMORY_EVIDENCE {
  subject: "Alice", relation: "knows",
  object: "Aurora", source: "source-chunk-1"
}</code></pre><p class="text--meta">Schema-aligned website rendering of the fixture fields; production context is token-bounded JSON evidence.</p></div></div><p class="memory-example__test"><code>test_real_four_lanes_fuse_once_and_repeat_deterministically</code><span>Core test at release commit 7062faf.</span></p></details>
    <p class="memory-example__caption text--meta">Vector search results are mocked in this test. This is a static example, not a live benchmark.</p>
  </div>`;
  return `<div class="action-example specimen-plate">
    <div class="specimen-frame">
      <div class="action-query"><span>QUERY</span><strong>“Alice”</strong><small>Exact deterministic fixture query · not a live benchmark</small></div>
      <div class="fixture-trace" role="img" aria-label="Alice knows Aurora, supported by source chunk 1 in document 1">
        <div class="trace-node"><small>ENTITY</small><strong>Alice</strong></div><span class="trace-edge"><i></i><b>knows</b></span><div class="trace-node"><small>ENTITY</small><strong>Aurora</strong></div><span class="trace-evidence"><i></i><b>evidence</b></span><div class="trace-node evidence"><small>SOURCE</small><strong>source-chunk-1</strong><em>doc-1 / chunk-1</em></div>
      </div>
      <div class="action-output">
        <section><span>RETRIEVED KNOWLEDGE</span><dl><div><dt>subject</dt><dd>Alice</dd></div><div><dt>predicate</dt><dd>knows</dd></div><div><dt>object</dt><dd>Aurora</dd></div></dl></section>
        <section><span>EVIDENCE</span><dl><div><dt>source</dt><dd>source-chunk-1</dd></div><div><dt>document</dt><dd>doc-1</dd></div><div><dt>chunk</dt><dd>chunk-1</dd></div><div><dt>span</dt><dd>“Alice knows Aurora”</dd></div></dl></section>
        <section><span>RETRIEVAL SIGNALS</span><ul class="signal-list"><li>vector <b>rank 1</b></li><li>BM25 <b>rank 1</b></li><li>assertion <b>rank 1</b></li><li>graph path <b>rank 1</b></li></ul><p class="fixture-score">Expected RRF: 4 ÷ 61</p></section>
      </div>
      <div class="context-output"><span>APPLICATION CONTEXT</span><div><code>UNTRUSTED_MEMORY_EVIDENCE { subject: "Alice", relation: "knows", object: "Aurora", source: "source-chunk-1" }</code><small>Schema-aligned website rendering of the fixture fields; production context is token-bounded JSON evidence.</small></div></div>
    </div>
  </div>`;
}

const productHelpers = () => ({header,footer,route,cta,actionExample});
function home() { return productHome(productHelpers()); }
function architecture() { return architecturePage(productHelpers()); }
function retrieval() { return retrievalPage(productHelpers()); }

function howItWorksPage() { return beginnerHow(productHelpers()); }

function ecosystem() { return beginnerEcosystem({...productHelpers(), repos}); }

function dataPage() {
  return `
    ${header('ecosystem')}
    <main id="main-content">
      <section class="page-hero compact page-hero--archive data-accent">
        <p class="eyebrow">MESA DATA</p>
        <h1>Legal data with an<br><em>auditable release path.</em></h1>
        <p>MESA Data is specifically a Turkish legal-data platform. It is not presented as a universal ingestion service.</p>
        <div class="actions">
          ${cta('Repository', repos.data, 'primary', true)}
          ${cta('Usage guide', docs.dataGuide, 'secondary', true)}
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">CONFIGURED SOURCES</p>
            <h2>Official sources,<br><em>policy-bound access.</em></h2>
          </div>
          <p>The current configuration enables Resmî Gazete discovery and manual collection from Mevzuat and the Constitutional Court. Yargıtay is configured but disabled.</p>
        </div>
        <div class="source-table" role="table" aria-label="MESA Data configured sources">
          <div role="row">
            <strong role="columnheader">Source</strong>
            <strong role="columnheader">Mode</strong>
            <strong role="columnheader">State</strong>
            <strong role="columnheader">Role</strong>
          </div>
          <div role="row">
            <span role="cell">Resmî Gazete</span>
            <span role="cell">Approved web</span>
            <span role="cell" class="ok">Enabled</span>
            <span role="cell">Original publication</span>
          </div>
          <div role="row">
            <span role="cell">Mevzuat Bilgi Sistemi</span>
            <span role="cell">Manual</span>
            <span role="cell" class="ok">Enabled</span>
            <span role="cell">Consolidated text</span>
          </div>
          <div role="row">
            <span role="cell">Anayasa Mahkemesi</span>
            <span role="cell">Manual</span>
            <span role="cell" class="ok">Enabled</span>
            <span role="cell">Official case law</span>
          </div>
          <div role="row">
            <span role="cell">Yargıtay</span>
            <span role="cell">Manual</span>
            <span role="cell" class="muted">Disabled</span>
            <span role="cell">Official case law</span>
          </div>
        </div>
        <figure class="data-figure" aria-hidden="true">
          <img src="${asset('assets/stratigraphy-layers.svg')}" alt="" loading="lazy" width="600" height="380">
        </figure>
      </section>

      <section class="section pipeline-section">
        <p class="eyebrow">RELEASE PIPELINE</p>
        <h2>Raw bytes remain traceable.</h2>
        <div class="pipeline">
          <div><span>01</span><strong>Collect</strong><small>Allowlisted HTTPS or manual file</small></div>
          <div><span>02</span><strong>Preserve</strong><small>Immutable raw artifact + SHA-256</small></div>
          <div><span>03</span><strong>Canonicalize</strong><small>Versioned canonical JSONL</small></div>
          <div><span>04</span><strong>Gate</strong><small>Quality, privacy, legal metadata</small></div>
          <div><span>05</span><strong>Review</strong><small>Safe auto-approval or human exception</small></div>
          <div><span>06</span><strong>Release</strong><small>Build, verify, freeze, human approval</small></div>
          <div><span>07</span><strong>Publish</strong><small>Human-started, idempotent MESA delivery</small></div>
        </div>
        <div class="notice">
          <strong>Human boundary</strong>
          <p>MESA delivery never starts automatically. Local staging is a development tool and is not the real MESA publisher.</p>
        </div>
      </section>
      ${footer()}
    </main>`;
}

function qaPage() {
  return `
    ${header('ecosystem')}
    <main id="main-content">
      <section class="page-hero compact page-hero--trace qa-hero">
        <p class="eyebrow">MESA QA</p>
        <h1>Test the candidate.<br><em>Protect the baseline.</em></h1>
        <p>An external, detachable test-engineer system for long-running behavioral checks against MESA through its canonical MCP surface.</p>
        <div class="actions">
          ${cta('Repository', repos.qa, 'primary', true)}
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">EVALUATION SCOPE</p>
            <h2>Behavior over time,<br><em>not just unit calls.</em></h2>
          </div>
        </div>
        <div class="principle-grid">
          <article>
            <span>01</span>
            <h3>Correctness</h3>
            <p>Independent SQLite ground truth judges memory results instead of asking an LLM to grade itself.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Endurance</h3>
            <p>Profiles cover sustained remember/recall cycles, temporal updates, corrections, forgetting, and session rotation.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Restart durability</h3>
            <p>Scenarios restart candidate processes and verify that expected memory survives.</p>
          </article>
        </div>
        <figure class="qa-figure" aria-hidden="true">
          <img src="${asset('assets/chronometer-cycles.svg')}" alt="" loading="lazy" width="600" height="360">
        </figure>
      </section>

      <section class="section worktree-section">
        <div>
          <p class="eyebrow">BOUNDED REPAIR</p>
          <h2>Candidate-only changes.</h2>
          <p>When a reproducible defect is found, QA can write a failing regression, apply a minimal repair, restart the candidate, and verify the result.</p>
        </div>
        <ol>
          <li><span>1</span>Baseline checkout remains read-only</li>
          <li><span>2</span>Dedicated candidate worktree and isolated storage</li>
          <li><span>3</span>Pre-fix failure required before patching</li>
          <li><span>4</span>Policy-limited diff and verification gates</li>
          <li><span>5</span>No automatic merge or push to main</li>
        </ol>
        <p>The latest QA state records a live first-write INVALID_ARGUMENT failure. Earlier Lite harness evidence includes a candidate session verdict of FAIL; it does not validate current Core 0.9.0.</p>
      </section>
      ${footer()}
    </main>`;
}

function certification() {
  return `
    ${header('certification')}
    <main id="main-content">
      <section class="page-hero compact page-hero--dossier certification-accent">
        <p class="eyebrow">MESA PROFILE B</p>
        <h1>Evidence before<br><em>certification language.</em></h1>
        <p>The legal E2E repository defines the independent harness and evidence contract for MESA Data → MESA. Profile B is one profile, not full MESA MVP certification.</p>
        <div class="actions">
          ${cta('Certification repository', repos.certification, 'primary', true)}
          ${cta('Current independent audit', docs.certificationAudit, 'secondary', true)}
        </div>
      </section>

      <section class="cert-status">
        <div><small>CURRENT HARDENED PATH</small><strong>BLOCKED</strong></div>
        <p>Official runner, scoring, and metric producers are implemented. A new Profile B run remains blocked by missing runner-owned MESA Data delivery and restart evidence for B4/B6/B7/B8; no new certification PASS is claimed.</p>
      </section>

      <section class="section compare-section">
        <div>
          <p class="eyebrow">WHAT PROFILE B IS DESIGNED TO PROVE</p>
          <ul class="check-list">
            <li>Official legal data acquisition and byte preservation</li>
            <li>Canonicalization without silent Turkish text loss</li>
            <li>Native MESA Data → MESA V4 delivery</li>
            <li>Scoped ingestion, provenance, idempotency, and restart persistence</li>
            <li>Frozen retrieval and grounded-answer gates</li>
            <li>Observable graph participation on designated relational queries</li>
          </ul>
        </div>
        <div>
          <p class="eyebrow">WHAT IT DOES NOT PROVE</p>
          <ul class="cross-list">
            <li>Full MESA MVP certification</li>
            <li>General production readiness</li>
            <li>Every workload, provider, or deployment shape</li>
            <li>Universal latency, uptime, or retrieval guarantees</li>
            <li>That a historical qualification run remains a valid current verdict</li>
          </ul>
        </div>
      </section>

      <figure class="cert-figure" aria-hidden="true">
        <img src="${asset('assets/certification-seal-plate.svg')}" alt="" loading="lazy" width="600" height="360">
      </figure>

      <section class="section historical-note">
        <p class="eyebrow">STATUS TRANSPARENCY</p>
        <h2>The historical result is preserved,<br><em>but not promoted.</em></h2>
        <p>The exposed 2026-09-01 run remains useful qualification/regression evidence. A later independent audit found integrity defects, invalidated its use as a Profile B v2 certification result, hardened the harness to fail closed, and recorded the remaining runtime-producer blockers.</p>
        ${cta('Read the audit', docs.certificationAudit, 'text', true)}
      </section>
      ${footer()}
    </main>`;
}

function lawPage() {
  return `
    ${header('ecosystem')}
    <main id="main-content">
      <section class="page-hero compact page-hero--law law-hero">
        <p class="eyebrow copper">PRIMARY REFERENCE IMPLEMENTATION</p>
        <h1>Evidence-aware memory<br><em>in a legal workflow.</em></h1>
        <p>MESA Law demonstrates how matters, documents, review, and sourced question answering can meet MESA through a versioned HTTP contract. It is a reference implementation, not a customer deployment.</p>
        <div class="actions">
          ${cta('Explore repository', repos.law, 'primary', true)}
          ${cta('Law-side status', docs.lawStatus, 'secondary', true)}
        </div>
      </section>

      <section class="section reference-flow">
        <div class="section-heading">
          <div>
            <p class="eyebrow">THE USER PROBLEM</p>
            <h2>Legal context needs<br><em>its source and review state.</em></h2>
          </div>
          <p>A legal workflow cannot safely treat an answer as detached text. The repository models source-aware document workspaces, evidence and citation cards, review state, and sourced QA that can abstain.</p>
        </div>
        <ol class="journey-flow">
          <li><span>01</span><strong>Official legal source</strong><small>Reviewed or configured acquisition</small></li>
          <li><span>02</span><strong>MESA Data</strong><small>Traceable legal release</small></li>
          <li><span>03</span><strong>MESA Core</strong><small>Authorized memory and evidence</small></li>
          <li><span>04</span><strong>Versioned HTTP</strong><small>Explicit integration boundary</small></li>
          <li><span>05</span><strong>MESA Law</strong><small>Matter, document, review, sourced QA</small></li>
        </ol>
        <figure class="law-figure" aria-hidden="true">
          <img src="${asset('assets/legal-gazette-engraving.svg')}" alt="" loading="lazy" width="640" height="360">
        </figure>
      </section>

      <section class="section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">VERIFIED REPOSITORY SCOPE</p>
            <h2>Cases, documents,<br><em>review, and evidence.</em></h2>
          </div>
          <p>Current code includes a Next.js web app, FastAPI and Java API work, workers, PostgreSQL migrations, document parsing, matter-level access controls, deadlines, review state, drafting controls, and provenance-aware QA.</p>
        </div>
        <div class="law-grid">
          <article>
            <h3>Matter workspace</h3>
            <p>Tenant-scoped matters, parties, members, timelines, claims, evidence, and document revisions.</p>
          </article>
          <article>
            <h3>Human review</h3>
            <p>Review queues, immutable audit records, citation verification, and approval gates before external draft use.</p>
          </article>
          <article>
            <h3>MESA binding</h3>
            <p>Catalog onboarding and V4 mutation state are tracked over HTTP. A 202 admission is not presented as publication; only COMMITTED is success.</p>
          </article>
          <article>
            <h3>MVP limits</h3>
            <p>External legal research and AI draft generation are disabled in the documented MVP contract.</p>
          </article>
        </div>
      </section>

      <section class="section law-status">
        <p class="eyebrow">CURRENT STATUS</p>
        <h2>Historical Law-side gates passed.<br><em>Overall integration: NO-GO.</em></h2>
        <p>The 2026-08-01 report records isolated Law-side gates against Core 0.7.1. Full-stack and live Core integration were not run. Current Law HEAD CI reports failure; this is not current Core 0.9.0 integration proof.</p>
        ${cta('Read verification report', docs.lawStatus, 'text', true)}
      </section>
      ${footer()}
    </main>`;
}

function evaluationPage() {
  return `
    ${header()}
    <main id="main-content">
      <section class="page-hero compact page-hero--evidence status-accent">
        <p class="eyebrow">EVALUATION & TRUST</p>
        <h1>Two layers.<br><em>Two different questions.</em></h1>
        <p>MESA separates ongoing behavioral testing from profile-specific certification evidence. Neither is presented as a substitute for production proof.</p>
      </section>

      <section class="section evaluation-compare">
        <article>
          <p class="eyebrow">MESA QA</p>
          <h2>Does the candidate keep behaving correctly?</h2>
          <ul class="check-list">
            <li>memory correctness and independent ground truth</li>
            <li>temporal updates, correction, and forgetting</li>
            <li>cross-session persistence and restart durability</li>
            <li>sustained endurance profiles</li>
            <li>isolated candidate repair with no automatic merge or push</li>
          </ul>
          <a href="${route('qa/')}">Explore MESA QA →</a>
        </article>

        <article>
          <p class="eyebrow">E2E CERTIFICATION</p>
          <h2>Can this exact profile prove its required guarantees?</h2>
          <ul class="check-list">
            <li>frozen inputs, identity, and evidence bindings</li>
            <li>authoritative runtime, scoring, and metric producers</li>
            <li>hard gates and independent finalization</li>
            <li>profile-bounded evidence and verdicts</li>
            <li>fail-closed handling of missing or unverified gates</li>
          </ul>
          <a href="${route('certification/')}">Explore certification →</a>
        </article>
      </section>

      <section class="section trust-state">
        <div>
          <p class="eyebrow">CURRENT EVIDENCE STATE</p>
          <h2>Harness integrity improved.<br><em>Certification remains blocked.</em></h2>
        </div>
        <div>
          <p>The independent audit corrected reproduced integrity defects and verified fail-closed behavior. It did not execute a legitimate passing runtime certification transaction.</p>
          <p>The current harness implements official execution, frozen ground-truth scoring and metric derivation. External delivery/restart collectors, provider qualification and a fresh official run remain unverified.</p>
          ${external(docs.certificationAudit, 'Read the independent audit')}
        </div>
      </section>

      <section class="section future-benchmarks">
        <p class="eyebrow">BENCHMARK PUBLICATION</p>
        <h2>No placeholder numbers.</h2>
        <p>Historical or synthetic diagnostics are not promoted as current production guarantees. Publishable retrieval quality, latency, resource, and endurance results should follow valid certification and clearly identified methodology.</p>
      </section>
      ${footer()}
    </main>`;
}

function aboutPage() {
  return `
    ${header()}
    <main id="main-content">
      <section class="page-hero compact page-hero--editorial">
        <p class="eyebrow">ABOUT MESA</p>
        <h1>An open-source exploration of<br><em>memory with evidence.</em></h1>
        <p>MESA exists to explore durable AI memory that keeps provenance, structure, scope, and lifecycle state visible instead of reducing memory to an opaque similarity lookup.</p>
      </section>

      <section class="section about-grid">
        <article>
          <p class="eyebrow">WHAT IT IS</p>
          <h2>A multi-repository system.</h2>
          <p>Core owns the memory lifecycle. Data prepares Turkish legal sources. QA tests behavior. E2E Certification defines a fail-closed evidence path. Law is the primary reference implementation.</p>
        </article>

        <article>
          <p class="eyebrow">WHY IT EXISTS</p>
          <h2>Useful context needs a basis.</h2>
          <p>The project examines how agents can retain information while preserving where it came from, how it is related, which scope can retrieve it, and how it changes over time.</p>
        </article>

        <article>
          <p class="eyebrow">WHO MAINTAINS IT</p>
          <h2>Publicly maintained on GitHub.</h2>
          <p>The public maintainer identity exposed by the repositories is the <strong>${project.maintainer}</strong> GitHub account. This site does not infer a company, team, office, investor, or customer structure that the source does not establish.</p>
          ${external(repos.profile, 'View maintainer profile')}
        </article>

        <article>
          <p class="eyebrow">HOW TO CONTACT</p>
          <h2>Use the public project channel.</h2>
          <p>Open an issue for reproducible bugs, architecture questions, documentation gaps, or evaluation discussion. No sales or enterprise support channel is claimed.</p>
          ${external(repos.issues, 'Open a GitHub issue')}
        </article>
      </section>

      <div class="development-note">
        <div>
          <p class="eyebrow">CURRENT STATUS</p>
          <strong>Core v${project.version} · ${project.maturity}</strong>
          <p>Certification is ${project.certification.toLowerCase()}; production remains ${project.production}.</p>
        </div>
        ${cta('Review status and limits', route('status/'), 'secondary')}
      </div>
      ${footer()}
    </main>`;
}

function faqPage() { return beginnerFaq(productHelpers()); }

function docsPage() {
  return renderDocsHub(currentLanguage, {base, headerHtml: hubChrome(header('docs'))});
}

function mcpPage() {
  const body = `

      <header class="docs-article-header">
        <p class="eyebrow">MODEL CONTEXT PROTOCOL</p>
        <h1>Two integration paths.<br><em>Different runtime contracts.</em></h1>
        <p>MESA v0.9.0 supports direct V4 stdio with mesa mcp-config, plus a separately managed HTTP gateway and local bridge.</p>
        <div class="actions">
          ${cta('Source guide', docs.mcp, 'primary', true)}
          ${cta('Core repository', repos.core, 'secondary', true)}
        </div>
      </header>

      <section id="integration-paths" class="mcp-paths">
        <article>
          <p class="eyebrow">DIRECT V4 · LOCAL</p>
          <h2>Direct stdio server</h2>
          <p><code>mesa_mcp.server</code> runs a V4 JSON-RPC stdio stream against the HTTP API. Run mesa start, then mesa mcp-config to generate the private client configuration. Tool approvals come from the MCP client and access comes from the API key’s grants.</p>
          <div class="tag-row"><span>stdio</span><span>HTTP API</span><span>project scope</span></div>
        </article>
        <article class="highlight">
          <p class="eyebrow">CURRENT V4 PATH</p>
          <h2>Gateway + local bridge</h2>
          <p>A separately supervised HTTP gateway owns credentials, policy, approvals, operation state, and connections. Codex can connect directly to its <code>/mcp</code> endpoint; Antigravity uses a binding-scoped stdio bridge.</p>
          <div class="tag-row"><span>V4</span><span>approvals</span><span>binding-scoped</span></div>
        </article>
      </section>

      <section id="bridge-tools" class="tool-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">V4 BRIDGE TOOLS</p>
            <h2>Operations expose<br><em>their real state.</em></h2>
          </div>
          <p>Writes return durable operation IDs. Default policy may return PENDING_APPROVAL rather than holding stdio open.</p>
        </div>
        <div class="tool-list">
          <div><code>mesa_health</code><span>Bridge, gateway, MESA, and spool health</span></div>
          <div><code>mesa_recall</code><span>Scoped V4 search or token-bounded context</span></div>
          <div><code>mesa_remember</code><span>Durable write operation</span></div>
          <div><code>mesa_improve</code><span>Revision operation with idempotency key</span></div>
          <div><code>mesa_forget</code><span>Purge operation; never queued offline</span></div>
          <div><code>mesa_get_operation_status</code><span>Approval and mutation progress</span></div>
        </div>
      </section>

      <section id="boundary-notes" class="mcp-guard">
        <p class="eyebrow">BOUNDARY NOTES</p>
        <ul class="check-list">
          <li>stdout is reserved for MCP JSON-RPC; logs go to stderr</li>
          <li>bridges do not import or access storage backends</li>
          <li>credentials live outside project configuration</li>
          <li>missing client/workspace bindings fail closed</li>
          <li>the exact supported host depends on the selected integration path</li>
        </ul>
      </section>
`;
  return renderMcpGuide(currentLanguage, {base, headerHtml: hubChrome(header('docs')), body: hubChrome(body)});
}

function statusPage() {
  return `
    ${header()}
    <main id="main-content">
      <section class="page-hero compact page-hero--operational status-accent">
        <p class="eyebrow">PROJECT STATUS</p>
        <h1>Transparent by default.<br><em>No borrowed confidence.</em></h1>
        <p>Status below reflects current repository documentation and the hardened independent certification audit available on ${project.statusAsOf}.</p>
      </section>
      ${statusStrip()}

      <section class="section status-timeline">
        <article>
          <span>CORE</span>
          <h2>${project.runtime} ${project.maturity.toLowerCase()}</h2>
          <p>MESA package line v${project.version}. Production remains ${project.production} pending final MVP certification and required production-like gates.</p>
          ${external(docs.architecture, 'Canonical architecture')}
          ${external(docs.releaseNotes, 'v0.9.0 Release notes')}
          ${external('https://github.com/Yasou13/MESA/releases/tag/v0.9.0', 'Official v0.9.0 release')}
        </article>
        <article>
          <span>PROFILE B</span>
          <h2>Certification blocked</h2>
          <p>Official execution, scoring and metric producers exist. B4/B6/B7/B8 external evidence remains blocked; the historical PROFILE_B_FAIL is unchanged and no fresh official PASS exists.</p>
          ${external(docs.certificationAudit, 'Independent audit')}
        </article>
        <article>
          <span>HISTORICAL RUN</span>
          <h2>Qualification evidence</h2>
          <p>The exposed run is preserved for regression and audit. It is not a valid current Profile B v2 certification result.</p>
          ${external(`${repos.certification}/blob/main/reports/legacy-audits/RUN-20260901T005200Z-p8b03/audit.md`, 'Invalidation record')}
        </article>
        <article>
          <span>MESA LAW</span>
          <h2>Historical Law pass / overall ${project.production}</h2>
          <p>The dated Law-side report passed against Core 0.7.1; current HEAD CI is failing. Live Core 0.9.0 integration remains unverified.</p>
          ${external(docs.lawStatus, 'Verification report')}
        </article>
      </section>
      ${footer()}
    </main>`;
}




const hubSections = new Map(hubData.sections.map((section) => [section.id, section]));
const hubEntries = new Map(hubData.entries.map((entry) => [entry.id, entry]));
const hubTypeLabels = {
  en: { learn: 'Learn', research: 'Research', guide: 'Guide', glossary: 'Glossary', methodology: 'Methodology' },
  tr: { learn: 'Ders', research: 'Araştırma', guide: 'Rehber', glossary: 'Sözlük', methodology: 'Yöntem' }
};

function validateHubData() {
  const sectionIds = new Set(hubData.sections.map(({ id }) => id));
  const entryIds = new Set();
  const paths = new Set();
  const supportedBlocks = new Set(['paragraph', 'list', 'numbered-list', 'checklist', 'warning', 'callout', 'example', 'definition', 'quote', 'code', 'image', 'diagram', 'references', 'table', 'exercise']);
  if (hubData.schemaVersion !== 1) throw new Error('Unsupported content hub schema version');
  for (const section of hubData.sections) {
    if (!section.id || !section.path || !section.locales?.en || !section.locales?.tr) throw new Error(`Invalid hub section: ${section.id}`);
    if (paths.has(section.path)) throw new Error(`Duplicate hub route: ${section.path}`);
    paths.add(section.path);
  }
  for (const entry of hubData.entries) {
    for (const field of ['id', 'type', 'slug', 'path', 'author', 'category']) {
      if (!entry[field]) throw new Error(`Missing ${field} on hub entry ${entry.id || '(unknown)'}`);
    }
    if (entryIds.has(entry.id) || paths.has(entry.path)) throw new Error(`Duplicate hub id or route: ${entry.id}`);
    if (!entry.locales?.en?.sections || !entry.locales?.tr?.sections || !entry.seo?.en || !entry.seo?.tr) throw new Error(`Incomplete locale data: ${entry.id}`);
    if (entry.type === 'research' && (!entry.status || !entry.dataset || !entry.metrics || !entry.limitations || !entry.methodology)) throw new Error(`Incomplete research metadata: ${entry.id}`);
    if (entry.reviewers && (!Array.isArray(entry.reviewers.technical || []) || !Array.isArray(entry.reviewers.legal || []))) throw new Error(`Invalid reviewer metadata: ${entry.id}`);
    for (const locale of ['en', 'tr']) for (const section of entry.locales[locale].sections) for (const block of section.blocks) {
      if (!supportedBlocks.has(block.kind)) throw new Error(`Unsupported ${block.kind} block in ${entry.id}`);
      if (['image', 'diagram'].includes(block.kind) && !block.alt) throw new Error(`Missing accessible diagram/image text in ${entry.id}`);
    }
    entryIds.add(entry.id);
    paths.add(entry.path);
  }
  for (const relation of [
    ...hubData.topics.flatMap(({ related }) => related),
    ...hubData.entries.flatMap(({ related }) => related)
  ]) if (!entryIds.has(relation)) throw new Error(`Unknown content relation: ${relation}`);
  for (const section of ['resources', 'learn', 'research', 'guides', 'glossary', 'tools', 'methodology']) {
    if (!sectionIds.has(section)) throw new Error(`Missing required hub section: ${section}`);
  }
  for (const tool of hubData.tools) if (tool.status === 'available' && !tool.route) throw new Error(`Available tool has no route: ${tool.id}`);
}
validateHubData();
validateCurriculum(courseData, hubData.entries);

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const hubText = (en, tr) => currentLanguage === 'tr' ? tr : en;
const hubChrome = (html) => currentLanguage === 'tr' ? localizeHtml(html, trContent.strings) : html;
const publishedEntries = () => hubData.entries.filter(({ draft, indexable }) => !draft && indexable);

function renderFormattedText(text) {
  if (!text) return '';
  let escaped = escapeHtml(text);
  escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
  escaped = escaped.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
    if (href.startsWith('http://') || href.startsWith('https://')) {
      return external(href, label);
    }
    const cleanHref = href.startsWith('/') ? href.slice(1) : href;
    return `<a href="${route(cleanHref)}">${label}</a>`;
  });
  return escaped;
}

function hubBreadcrumb(items) {
  return `<nav class="breadcrumbs" aria-label="${hubText('Breadcrumb', 'Sayfa yolu')}"><ol>${items.map((item, index) => `<li>${item.path !== undefined ? `<a href="${route(item.path)}">${escapeHtml(item.label)}</a>` : `<span aria-current="page">${escapeHtml(item.label)}</span>`}${index < items.length - 1 ? '<span aria-hidden="true">/</span>' : ''}</li>`).join('')}</ol></nav>`;
}

function hubCard(entry) {
  const localized = entry.locales[currentLanguage];
  const type = hubTypeLabels[currentLanguage][entry.type];
  return `<article class="resource-card"><p class="resource-type">${escapeHtml(type)}</p><h3><a href="${route(entry.path)}">${escapeHtml(localized.title)}</a></h3><p>${escapeHtml(localized.summary)}</p><div><span>${entry.readingMinutes} ${hubText('min read', 'dk okuma')}</span><a href="${route(entry.path)}">${hubText('Read', 'Oku')}<span aria-hidden="true"> →</span></a></div></article>`;
}

function renderLearnHubIndex() {
  return learningIndex({course:courseData,entries:hubData.entries,language:currentLanguage,route});
}

function renderHubIndex(section) {
  const localized = section.locales[currentLanguage];
  if (section.id === 'learn') return `${hubChrome(header('resources'))}<main id="main-content">${renderLearnHubIndex()}${hubChrome(footer())}</main>`;
  const breadcrumbs = hubBreadcrumb([
    { label: hubText('Home', 'Ana sayfa'), path: '' },
    ...(section.id === 'resources' ? [] : [{ label: hubText('Resources', 'Kaynaklar'), path: 'resources/' }]),
    { label: localized.eyebrow }
  ]);
  let body = '';
  if (section.id === 'resources') {
    const choices = [
      ['docs/core/getting-started/', hubText('Install MESA', 'MESA’yı kurmak istiyorum'), hubText('Install the package, start the server, add one file and search it.', 'Paketi kurun, sunucuyu başlatın, bir dosya ekleyip arayın.'), hubText('Commands + requirements', 'Komutlar + gereksinimler')],
      ['learn/', hubText('Learn how AI memory works', 'Yapay zekâ hafızasını öğrenmek istiyorum'), hubText('Follow the lessons in order, from basic concepts to a small working search program.', 'Temel kavramlardan küçük bir arama programına uzanan dersleri sırayla izleyin.'), hubText(`${courseData.lessons.length} lessons · start with no background`, `${courseData.lessons.length} ders · ön bilgi gerektirmez`)],
      ['glossary/', hubText('Look up an unfamiliar term', 'Bilmediğim bir terime bakacağım'), hubText('Find short explanations of RAG, embeddings, context windows and the other terms used here.', 'RAG, embedding, bağlam penceresi ve burada geçen diğer terimlerin kısa açıklamalarını bulun.'), hubText('Short definitions + examples', 'Kısa tanımlar + örnekler')],
      ['guides/', hubText('Follow a practical guide', 'Bir işi adım adım yapmak istiyorum'), hubText('Work through concrete tasks such as verifying a legal source, with examples and checks.', 'Hukuk kaynağı doğrulama gibi somut işleri örnek ve kontrollerle adım adım izleyin.'), hubText('Practical walkthroughs', 'Uygulama rehberleri')]
    ];
    body = `<section class="section resource-choices" aria-labelledby="resource-map-title"><h2 id="resource-map-title">${hubText('Choose what you need.', 'İhtiyacınıza göre başlayın.')}</h2><div class="resource-choice-grid">${choices.map(([path,title,text,format],i)=>`<a href="${route(path)}"><span class="intro-index">0${i+1} · ${format}</span><h3>${title}</h3><p>${text}</p><span class="text-link">${hubText('Open →', 'Aç →')}</span></a>`).join('')}</div></section>
    <section class="section resource-secondary"><h2>${hubText('For people evaluating search systems', 'Arama sistemlerini değerlendirenler için')}</h2><div><a href="${route('research/')}"><strong>${hubText('Research plans', 'Araştırma planları')}</strong><span>${hubText('The questions and experiments being investigated →', 'İncelenen sorular ve planlanan deneyler →')}</span></a><a href="${route('methodology/')}"><strong>${hubText('Evaluation methods', 'Değerlendirme yöntemleri')}</strong><span>${hubText('How to select questions and measure search results →', 'Soruları seçme ve arama sonuçlarını ölçme yöntemleri →')}</span></a></div><details><summary>${hubText('Planned tools · not available yet', 'Planlanan araçlar · henüz kullanıma açık değil')}</summary><p>${hubText('The tools list describes future utilities, not software you can run today.', 'Araçlar listesi, bugün çalıştırabileceğiniz uygulamaları değil, geliştirilmesi planlanan yardımcıları açıklar.')} <a href="${route('tools/')}">${hubText('See the plans →', 'Planları gör →')}</a></p></details></section>`;
  } else if (section.id === 'learn') {
    body = renderLearnHubIndex();
  } else if (section.id === 'tools') {
    body = `
      <section class="section">
        <div class="tool-card-grid">
          ${hubData.tools.map((tool) => {
            const copy = tool.locales[currentLanguage];
            const available = tool.status === 'available' && tool.route;
            return `
            <article class="tool-card">
              ${tool.icon ? `<span class="tool-icon" aria-hidden="true">${escapeHtml(tool.icon)}</span>` : ''}
              <span>${escapeHtml(hubText(tool.category, ({research:'Araştırma',verification:'Doğrulama',evaluation:'Değerlendirme'})[tool.category] || tool.category))}</span>
              <h2>${escapeHtml(copy.title)}</h2>
              <p>${escapeHtml(copy.description)}</p>
              ${available
                ? `<a href="${route(tool.route)}">${hubText('Open tool', 'Aracı aç')}<span aria-hidden="true"> →</span></a>`
                : `<strong>${hubText('Planned · not yet interactive', 'Planlanıyor · henüz kullanıma açık değil')}</strong>`}
            </article>`;
          }).join('')}
        </div>
      </section>`;
  } else {
    const contentType = section.id === 'guides' ? 'guide' : section.id === 'glossary' ? 'glossary' : section.id;
    const entries = publishedEntries().filter(({ type }) => type === contentType);
    const future = section.id === 'methodology' ? `
      <div class="methodology-scope">
        <p class="eyebrow">${hubText('SUPPORTED NEXT', 'ELE ALINACAK KONULAR')}</p>
        <ul>
          <li>${hubText('Dataset selection', 'Veri kümesi seçimi')}</li>
          <li>${hubText('Relevance judgment', 'İlgililik değerlendirmesi')}</li>
          <li>${hubText('Dataset versioning', 'Veri kümesi sürümleme')}</li>
          <li>${hubText('Corrections policy', 'Düzeltme politikası')}</li>
        </ul>
        <p>${hubText('These are supported by the content model; unpublished pages are not exposed as routes.', 'Bu konular için ayrıntılı rehberler hazırlanabilir. Henüz yayımlanmamış sayfalar listelenmez.')}</p>
      </div>` : '';
    const termList = section.id === 'glossary' ? `
      <section class="section glossary-terms" aria-labelledby="glossary-terms-title">
        <h2 id="glossary-terms-title">${hubText('Terms used on this site', 'Sitede kullanılan terimler')}</h2>
        <nav class="glossary-index" aria-label="${hubText('Jump to a term', 'Terime git')}">${glossaryTerms.map((term) => `<a href="#term-${term.id}">${escapeHtml(term[currentLanguage][0])}</a>`).join('')}</nav>
        <dl>${glossaryTerms.map((term) => `<div id="term-${term.id}"><dt>${escapeHtml(term[currentLanguage][0])}</dt><dd>${escapeHtml(term[currentLanguage][1])}</dd></div>`).join('')}</dl>
      </section>` : '';
    body = `${termList}
      <section class="section publication-index">
        <div>
          ${section.id === 'glossary' ? `<h2>${hubText('In-depth entries', 'Ayrıntılı maddeler')}</h2>` : `<h2 class="sr-only">${hubText('Published resources', 'Yayımlanmış kaynaklar')}</h2>`}
          <div class="publication-grid">
            ${entries.map(hubCard).join('') || `<p class="empty-state">${hubText('No reviewed publication yet.', 'Henüz incelenmiş yayın yok.')}</p>`}
          </div>
        </div>
        ${future}
      </section>`;
  }
  return `${hubChrome(header('resources'))}<main id="main-content">${breadcrumbs}<section class="page-hero compact page-hero--editorial knowledge-hero"><p class="eyebrow">${escapeHtml(localized.eyebrow)}</p><h1>${escapeHtml(localized.heading)}</h1><p>${escapeHtml(localized.intro)}</p></section>${body}${hubChrome(footer())}</main>`;
}

let hubCodeNumber = 0;
function renderHubBlock(block) {
  if (block.kind === 'exercise') return `<div class="learn-exercise"><strong>${escapeHtml(block.title)}</strong><p>${renderFormattedText(block.text)}</p><details><summary>${hubText('Reveal the explanation', 'Açıklamayı göster')}</summary><p>${renderFormattedText(block.answer)}</p></details></div>`;
  if (block.kind === 'paragraph') return `<p>${renderFormattedText(block.text)}</p>`;
  if (block.kind === 'list') return `<ul>${block.items.map((item) => `<li>${renderFormattedText(item)}</li>`).join('')}</ul>`;
  if (block.kind === 'numbered-list') return `<ol>${block.items.map((item) => `<li>${renderFormattedText(item)}</li>`).join('')}</ol>`;
  if (block.kind === 'checklist') return `<ul class="article-checklist">${block.items.map((item) => `<li>${renderFormattedText(item)}</li>`).join('')}</ul>`;
  if (['warning', 'callout', 'example'].includes(block.kind)) return `<div class="article-callout ${block.kind}"><strong>${escapeHtml(block.title)}</strong><p>${renderFormattedText(block.text)}</p></div>`;
  if (block.kind === 'definition') return `<dl class="definition"><dt>${escapeHtml(block.term)}</dt><dd>${renderFormattedText(block.text)}</dd></dl>`;
  if (block.kind === 'quote') return `<blockquote><p>${renderFormattedText(block.text)}</p>${block.cite ? `<cite>${renderFormattedText(block.cite)}</cite>` : ''}</blockquote>`;
  if (block.kind === 'code') { const id = `lesson-code-${++hubCodeNumber}`; return `<div class="learn-code"><div><span>${hubText('Worked example', 'Çözümlü örnek')}</span><button class="copy-button" type="button" data-copy-target="${id}">${hubText('Copy', 'Kopyala')}</button></div><pre tabindex="0" class="article-code" id="${id}"><code>${escapeHtml(block.code)}</code></pre></div>`; }
  if (block.kind === 'image') return `<figure><img src="${asset(block.src)}" alt="${escapeHtml(block.alt)}" loading="lazy">${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ''}</figure>`;
  if (block.kind === 'diagram') return `<figure class="article-diagram" aria-label="${escapeHtml(block.alt)}"><ol tabindex="0">${block.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol>${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ''}</figure>`;
  if (block.kind === 'references') return `<ol class="reference-list">${block.items.map((item) => `<li>${item.href ? (item.href.startsWith('http') ? external(item.href, escapeHtml(item.label)) : `<a href="${route(item.href)}">${escapeHtml(item.label)}</a>`) : escapeHtml(item.label)}</li>`).join('')}</ol>`;
  if (block.kind === 'table') return `<div class="table-scroll" tabindex="0" role="region" aria-label="${hubText('Scrollable table', 'Kaydırılabilir tablo')}"><table><thead><tr>${block.headers.map((item) => `<th scope="col">${escapeHtml(item)}</th>`).join('')}</tr></thead><tbody>${block.rows.map((row) => `<tr>${row.map((item, index) => `<${index ? 'td' : 'th'}${index ? '' : ' scope="row"'}>${renderFormattedText(item)}</${index ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  throw new Error(`Unsupported hub block type: ${block.kind}`);
}

function renderResearchMetadata(entry) {
  if (entry.type !== 'research') return '';
  const limitations = currentLanguage === 'tr'
    ? ['Henüz deney yürütülmedi.', 'Veri seti büyüklüğü, skor veya performans iddiası sunulmuyor.', 'Araştırma planı, ön kayıt yapılana kadar değişebilir.']
    : entry.limitations;
  const reviewers = [
    ...(entry.reviewers?.technical || []).map((name) => [hubText('Technical reviewer', 'Teknik incelemeyi yapan'), name]),
    ...(entry.reviewers?.legal || []).map((name) => [hubText('Legal reviewer', 'Hukuki incelemeyi yapan'), name])
  ];
  const evidenceLinks = [
    entry.repository ? external(entry.repository, hubText('Code repository', 'Kod deposu')) : '',
    entry.datasetUrl ? external(entry.datasetUrl, hubText('Dataset record', 'Veri kümesi kaydı')) : '',
    ...(entry.methodology || []).map((id) => { const method = hubEntries.get(id); return method ? `<a href="${route(method.path)}">${escapeHtml(method.locales[currentLanguage].title)}<span aria-hidden="true"> →</span></a>` : ''; })
  ].filter(Boolean);

  return `
    <section class="research-record" aria-labelledby="research-record-title">
      <h2 id="research-record-title">${hubText('Research record', 'Araştırma kaydı')}</h2>
      <dl>
        <div>
          <dt>${hubText('Status', 'Durum')}</dt>
          <dd>${hubText('Planned protocol · no results', 'Araştırma planı · henüz sonuç yok')}</dd>
        </div>
        <div>
          <dt>${hubText('MESA version', 'MESA sürümü')}</dt>
          <dd>${hubText('To be pinned before execution', 'Çalıştırmadan önce sabitlenecek')}</dd>
        </div>
        <div>
          <dt>${hubText('Dataset', 'Veri kümesi')}</dt>
          <dd>${hubText('Not selected; criteria must be frozen first', 'Henüz seçilmedi; önce seçim ölçütleri kesinleştirilecek')}</dd>
        </div>
        <div>
          <dt>${hubText('Models', 'Modeller')}</dt>
          <dd>${hubText('To be declared and version-pinned', 'Modeller ve kullanılacak sürümleri açıklanacak')}</dd>
        </div>
        <div>
          <dt>${hubText('Planned metrics', 'Planlanan metrikler')}</dt>
          <dd>${entry.metrics.map(escapeHtml).join(' · ')}</dd>
        </div>
        ${reviewers.map(([label, name]) => `
        <div>
          <dt>${label}</dt>
          <dd>${escapeHtml(name)}</dd>
        </div>`).join('')}
      </dl>
      ${evidenceLinks.length ? `<div class="research-links">${evidenceLinks.join('')}</div>` : ''}
      <div class="limitations">
        <h3>${hubText('Known limitations', 'Bilinen sınırlılıklar')}</h3>
        <ul>
          ${limitations.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>
    </section>`;
}

function renderHubEntry(entry) {
  const localized = entry.locales[currentLanguage];
  const sectionId = entry.type === 'guide' ? 'guides' : entry.type;
  const section = hubSections.get(sectionId);
  const typeLabel = hubTypeLabels[currentLanguage][entry.type];
  const date = new Intl.DateTimeFormat(currentLanguage === 'tr' ? 'tr-TR' : 'en-GB', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${entry.publishedAt}T00:00:00Z`));
  const related = entry.related.map((id) => hubEntries.get(id)).filter((item) => item && !item.draft && item.indexable);
  const breadcrumbs = hubBreadcrumb([
    { label: hubText('Home', 'Ana sayfa'), path: '' },
    { label: hubText('Resources', 'Kaynaklar'), path: 'resources/' },
    { label: hubTypeLabels[currentLanguage][entry.type] || section.locales[currentLanguage].eyebrow, path: section.path },
    { label: localized.title }
  ]);
  if (entry.type === 'learn') return renderLesson({entry,course:courseData,entries:hubData.entries,language:currentLanguage,route,header:hubChrome(header('resources')),footer:hubChrome(footer()),renderBlock:renderHubBlock,breadcrumbs});
  const toc = `
    <nav class="article-toc" aria-label="${hubText('On this page', 'Bu sayfada')}">
      <strong>${hubText('On this page', 'Bu sayfada')}</strong>
      <ol>
        ${localized.sections.map((sectionItem) => `<li><a href="#${escapeHtml(sectionItem.id)}">${escapeHtml(sectionItem.title)}</a></li>`).join('')}
      </ol>
    </nav>`;
  const sections = localized.sections.map((sectionItem) => `
    <section id="${escapeHtml(sectionItem.id)}" class="article-section">
      <h2>${escapeHtml(sectionItem.title)}<a class="heading-anchor" href="#${escapeHtml(sectionItem.id)}" aria-label="${hubText('Link to this section', 'Bu bölüme bağlantı')}" title="${hubText('Copy section link', 'Bölüm bağlantısını kopyala')}">#</a></h2>
      ${sectionItem.blocks.map(renderHubBlock).join('')}
    </section>`).join('');
  const relatedHtml = `
    <section class="related-content" aria-labelledby="related-title">
      <p class="eyebrow">${hubText('CONNECTED KNOWLEDGE', 'BAĞLANTILI BİLGİ')}</p>
      <h2 id="related-title">${hubText('Continue through the evidence graph.', 'İlgili konularla devam edin.')}</h2>
      <div class="publication-grid">
        ${related.map(hubCard).join('')}
      </div>
    </section>`;
  const customCta = entry.productCta?.locales?.[currentLanguage];
  const productCta = customCta
    ? `
      <div class="contextual-cta">
        <div>
          <p class="eyebrow">${escapeHtml(customCta.eyebrow)}</p>
          <h2>${escapeHtml(customCta.heading)}</h2>
          <p>${escapeHtml(customCta.description)}</p>
        </div>
        <a class="button secondary" href="${route(entry.productCta.href)}">${escapeHtml(customCta.button)}</a>
      </div>`
    : `
      <div class="contextual-cta">
        <div>
          <p class="eyebrow">${hubText('PRODUCT CONTEXT', 'ÜRÜN BAĞLAMI')}</p>
          <h2>${hubText('See how provenance appears in MESA Law.', 'Kaynak izinin MESA Law’da nasıl kullanıldığına bakın.')}</h2>
          <p>${hubText('A restrained product link for readers who want the application context.', 'Hukuk alanındaki örnek uygulamada dosyaların, belgelerin ve kaynakların nasıl birlikte ele alındığını inceleyin.')}</p>
        </div>
        <a class="button secondary" href="${route('law/')}">${hubText('Explore MESA Law', 'MESA Law’u incele')}</a>
      </div>`;
  const updated = new Intl.DateTimeFormat(currentLanguage === 'tr' ? 'tr-TR' : 'en-GB', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${entry.updatedAt}T00:00:00Z`));
  return `
    ${hubChrome(header('resources'))}
    <main id="main-content">
      ${breadcrumbs}
      <article class="knowledge-article">
        <header class="article-header">
          <p class="eyebrow">${escapeHtml(typeLabel)} · ${escapeHtml(localized.category || entry.category)}</p>
          <h1>${escapeHtml(localized.title)}</h1>
          ${localized.subtitle ? `<p class="article-subtitle">${escapeHtml(localized.subtitle)}</p>` : ''}
          <p class="article-summary">${escapeHtml(localized.summary)}</p>
          <dl class="article-byline">
            <div>
              <dt>${hubText('Published', 'Yayın')}</dt>
              <dd><time datetime="${entry.publishedAt}">${date}</time></dd>
            </div>
            <div>
              <dt>${hubText('Updated', 'Güncelleme')}</dt>
              <dd><time datetime="${entry.updatedAt}">${updated}</time></dd>
            </div>
            <div>
              <dt>${hubText('Author', 'Yazar')}</dt>
              <dd>${escapeHtml(hubText(entry.author, entry.author === 'MESA contributors' ? 'MESA’ya katkıda bulunanlar' : entry.author))}</dd>
            </div>
            <div>
              <dt>${hubText('Reading time', 'Okuma süresi')}</dt>
              <dd>${entry.readingMinutes} ${hubText('minutes', 'dakika')}</dd>
            </div>
          </dl>
        </header>
        <div class="article-layout">
          ${toc}
          <div class="article-body">
            ${localized.shortAnswer ? `<div class="short-answer"><strong>${hubText('Short answer', 'Kısa yanıt')}</strong><p>${escapeHtml(localized.shortAnswer)}</p></div>` : ''}
            ${renderResearchMetadata(entry)}
            ${sections}
          </div>
        </div>
        ${relatedHtml}
        ${productCta}
      </article>
      ${hubChrome(footer())}
    </main>`;
}

function notFound() {
  return `
    ${header()}
    <main id="main-content" class="not-found">
      <div>
        <p class="eyebrow">404 · ROUTE NOT FOUND / SAYFA BULUNAMADI</p>
        <h1>This memory does not exist.<br><em>Bu hafıza mevcut değil.</em></h1>
        <p>The page may have moved. Sayfa taşınmış olabilir.</p>
        <div class="actions">
          ${cta('English home', route())}
          ${cta('Türkçe ana sayfa', `${route()}tr/`, 'secondary')}
          ${cta('Open docs', route('docs/'), 'secondary')}
          ${cta('GitHub', repos.core, 'text', true)}
        </div>
      </div>
    </main>`;
}

const renderers = {
  home,
  earlyAccess: () => earlyAccessPage(productHelpers()),
  privacy: () => privacyPage(productHelpers()),
  architecture,
  retrieval,
  howItWorks: howItWorksPage,
  ecosystem,
  data: dataPage,
  qa: qaPage,
  certification,
  law: lawPage,
  evaluation: evaluationPage,
  docs: docsPage,
  mcp: mcpPage,
  status: statusPage,
  about: aboutPage,
  faq: faqPage
};

function argument(name, fallback) {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
}

function relativeBase(routePath) {
  const depth = routePath.split('/').filter(Boolean).length;
  return depth ? '../'.repeat(depth) : './';
}

// GitHub Pages cannot send response headers, so the policy travels in a meta tag.
// frame-ancestors, HSTS and X-Frame-Options still need the CDN (docs/security/HTTP_HEADERS.md).
const inlineBootHash = `'sha256-${crypto.createHash('sha256').update("document.documentElement.classList.add('js')").digest('base64')}'`;
// Allow the observed Codex annotation overlay stylesheet without enabling arbitrary inline CSS.
// If Codex changes this stylesheet, verify its new contents before updating the hash.
const codexAnnotationStyleHash = "'sha256-WO55anZ1V8A0G22bY2t72RV4dI79SLI4VnYLgsEeWUc='";
const supabaseOrigin = publicAdminConfig?.url ? ` ${new URL(publicAdminConfig.url).origin}` : '';
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' ${inlineBootHash} https://static.cloudflareinsights.com`,
  `style-src 'self' ${codexAnnotationStyleHash}`,
  "font-src 'self'",
  "img-src 'self' data: https:",
  `connect-src 'self' https://cloudflareinsights.com${supabaseOrigin}`,
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests'
].join('; ');

function documentShell({ title, description, canonical, content, assetBase, language = 'en', alternateUrls, noIndex = false, pageType = 'website', structuredNodes = [] }) {
  const socialImage = `${siteUrl}${language === 'tr' ? 'og-image-tr.png' : 'og-image.png'}?v=${assetVersions.logo}`;
  const locale = language === 'tr' ? 'tr_TR' : 'en_US';
  const alternateLocale = language === 'tr' ? 'en_US' : 'tr_TR';
  const siteDescription = language === 'tr' ? trContent.pages.home.description : siteData.pages.home.description;
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': `${siteUrl}#website`, name: project.name, url: siteUrl, inLanguage: ['en', 'tr'], description: siteDescription },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: title,
        description,
        inLanguage: language,
        isPartOf: { '@id': `${siteUrl}#website` },
        about: { '@id': `${siteUrl}#software` }
      },
      {
        '@type': 'SoftwareSourceCode',
        '@id': `${siteUrl}#software`,
        name: project.fullName,
        alternateName: project.name,
        description: siteDescription,
        codeRepository: repos.core,
        license: `${repos.core}/blob/7062fafe2cff8442eb84d1da60df164099526c8e/LICENSE`,
        version: project.version,
        url: siteUrl
      },
      ...structuredNodes
    ]
  }).replaceAll('<', '\\u003c');
  return `<!doctype html>
<html lang="${language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#050508">
  <meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy}">
  <meta name="referrer" content="strict-origin-when-cross-origin">
${noIndex ? '  <meta name="robots" content="noindex">\n' : ''}  <link rel="canonical" href="${canonical}">
${alternateUrls ? `  <link rel="alternate" hreflang="en" href="${alternateUrls.en}">
  <link rel="alternate" hreflang="tr" href="${alternateUrls.tr}">
  <link rel="alternate" hreflang="x-default" href="${alternateUrls.en}">` : ''}
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="${pageType}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:locale" content="${locale}">
  <meta property="og:locale:alternate" content="${alternateLocale}">
  <meta property="og:image" content="${socialImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${language === 'tr' ? 'MESA — Kanıtıyla birlikte hafıza.' : 'MESA — Memory with evidence, not mystery.'}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${socialImage}">
  <script type="application/ld+json">${structuredData}</script>
  <link rel="icon" href="${assetBase}favicon.ico?v=${assetVersions.faviconIco}" sizes="32x32">
  <link rel="icon" href="${assetBase}favicon.svg?v=${assetVersions.faviconSvg}" type="image/svg+xml">
  <link rel="icon" type="image/png" sizes="48x48" href="${assetBase}favicon-48x48.png?v=${assetVersions.logo}">
  <link rel="icon" href="${assetBase}assets/mesa-mark.webp?v=${assetVersions.logo}" type="image/webp">
  <link rel="apple-touch-icon" href="${assetBase}apple-touch-icon.png?v=${assetVersions.logo}">
  <script>document.documentElement.classList.add('js')</script>
  <link rel="preload" href="${assetBase}fonts/instrument-sans-variable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${assetBase}styles.css?v=${assetVersions.css}">
  <link rel="stylesheet" href="${assetBase}cosmic.css?v=${assetVersions.cosmic}">
  <link rel="stylesheet" href="${assetBase}learn.css?v=${assetVersions.learn}">
${content.includes('id="early-access-form"') ? `  <link rel="stylesheet" href="${assetBase}early-access.css?v=${assetVersions.accessCss}">\n` : ''}
${content.includes('class="docs-layout"') ? `  <link rel="stylesheet" href="${assetBase}docs.css?v=${assetVersions.docs}">\n` : ''}  <script src="${assetBase}cosmic-motion.js?v=${assetVersions.cosmicMotion}" defer></script>
</head>
<body>
${cosmicEnvironment(cosmicVariant(new URL(canonical).pathname.slice(basePath.length)))}
${content}
  <script src="${assetBase}app.js?v=${assetVersions.js}"></script>
${content.includes('id="early-access-form"') ? `  <script id="early-access-config" type="application/json">${JSON.stringify(publicAdminConfig).replaceAll('<','\\u003c')}</script>
  <script src="${assetBase}early-access.js?v=${assetVersions.accessJs}" defer></script>
` : ''}
${content.includes('class="docs-layout"') ? `  <script src="${assetBase}docs.js?v=${assetVersions.docsJs}"></script>\n` : ''}</body>
</html>
`;
}

const outputDirectory = path.resolve(argument('--output', path.join(repositoryRoot, 'dist')));
const rawSiteUrl = argument('--site-url', 'https://yasou13.github.io/mesa.github.io/');
const siteUrl = rawSiteUrl.endsWith('/') ? rawSiteUrl : `${rawSiteUrl}/`;
const basePath = new URL(siteUrl).pathname;

function localizeHtml(html, translations) {
  let protectedDepth = 0;
  return html.split(/(<[^>]+>)/g).map((token) => {
    if (token.startsWith('<')) {
      const closing = token.match(/^<\/(code|pre|script|style)\b/i);
      const opening = token.match(/^<(code|pre|script|style)\b/i);
      if (closing) protectedDepth = Math.max(0, protectedDepth - 1);
      const localizedTag = token.replace(/(aria-label|title)="([^"]+)"/g, (match, attribute, value) =>
        translations[value] ? `${attribute}="${translations[value]}"` : match);
      if (opening && !token.endsWith('/>')) protectedDepth += 1;
      return localizedTag;
    }
    if (protectedDepth) return token;
    const leading = token.match(/^\s*/)?.[0] ?? '';
    const trailing = token.match(/\s*$/)?.[0] ?? '';
    const value = token.trim();
    return value && Object.hasOwn(translations, value)
      ? `${leading}${translations[value]}${trailing}`
      : token;
  }).join('');
}

function localizableText(html) {
  let protectedDepth = 0;
  const values = [];
  for (const token of html.split(/(<[^>]+>)/g)) {
    if (token.startsWith('<')) {
      if (token.match(/^<\/(code|pre|script|style)\b/i)) protectedDepth = Math.max(0, protectedDepth - 1);
      if (token.match(/^<(code|pre|script|style)\b/i) && !token.endsWith('/>')) protectedDepth += 1;
      continue;
    }
    const value = token.trim();
    if (!protectedDepth && value) values.push(value);
  }
  return values;
}

function assertCompleteLocalization(key, englishContent, localizedContent) {
  const english = localizableText(englishContent);
  const localized = localizableText(localizedContent);
  if (english.length !== localized.length) {
    throw new Error(`Localization structure drift for ${key}: ${english.length} source nodes, ${localized.length} Turkish nodes`);
  }
  const intentional = new Set(trContent.intentionalEnglish);
  const untranslated = english.filter((source, index) =>
    source === localized[index] && /[A-Za-z]/.test(source) && !intentional.has(source));
  if (untranslated.length) {
    throw new Error(`Untranslated Turkish content in ${key}: ${[...new Set(untranslated)].join(' | ')}`);
  }
}

for (const language of ['en', 'tr']) {
  for (const [key, metadata] of Object.entries(siteData.pages)) {
    currentLanguage = language;
    currentPage = metadata;
    const localizedPath = language === 'tr' ? `tr/${metadata.path}` : metadata.path;
    base = relativeBase(metadata.path);
    assetBase = relativeBase(localizedPath);
    alternateHref = language === 'en'
      ? `${base}tr/${metadata.path}`
      : `${relativeBase(localizedPath)}${metadata.path}`;
    if (metadata.redirectTo) {
      const targetPath = metadata.redirectTo.split('#')[0];
      const link = `${base}${metadata.redirectTo}`;
      const title = language === 'tr' ? `Bu sayfa taşındı — ${metadata.path}` : `This page has moved — ${metadata.path}`;
      const description = language === 'tr' ? `${metadata.path} içeriği ilgili sayfada birleştirildi. Eski bağlantınız çalışmaya devam eder.` : `The content from ${metadata.path} has been consolidated into its maintained page. Your old link still works.`;
      const destination = path.join(outputDirectory, localizedPath, 'index.html');
      const content = `<main id="main-content" class="learn-redirect"><h1>${title}</h1><p>${description}</p><a href="${link}">${language === 'tr' ? 'Güncel sayfayı aç →' : 'Open the current page →'}</a></main>`;
      let html = documentShell({title, description, canonical:`${siteUrl}${language === 'tr' ? 'tr/' : ''}${targetPath}`, content, language, noIndex:true, assetBase});
      html = html.replace('</head>', `<meta http-equiv="refresh" content="0;url=${link}">\n</head>`);
      fs.mkdirSync(path.dirname(destination), {recursive:true});
      fs.writeFileSync(destination, html);
      continue;
    }
    const englishContent = renderers[key]();
    const localizedMetadata = language === 'tr' ? trContent.pages[key] : metadata;
    if (!localizedMetadata?.title || !localizedMetadata?.description) {
      throw new Error(`Missing ${language} metadata for ${key}`);
    }
    const nativeDocs = key === 'docs' || key === 'mcp';
    const content = language === 'tr' && !nativeDocs ? localizeHtml(englishContent, {...trContent.strings, ...productTranslations}) : englishContent;
    if (language === 'tr' && !nativeDocs) assertCompleteLocalization(key, englishContent, content);
    const destination = path.join(outputDirectory, localizedPath, 'index.html');
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, documentShell({
      title: localizedMetadata.title,
      description: localizedMetadata.description,
      canonical: `${siteUrl}${localizedPath}`,
      content,
      language,
      alternateUrls: { en: `${siteUrl}${metadata.path}`, tr: `${siteUrl}tr/${metadata.path}` },
      assetBase: relativeBase(localizedPath)
    }));
  }
}

const hubRoutes = [
  ...hubData.sections.map((section) => ({ kind: 'section', data: section, path: section.path, indexable: true })),
  ...hubData.entries.map((entry) => ({ kind: 'entry', data: entry, path: entry.path, indexable: entry.indexable && !entry.draft }))
].filter(({ indexable }) => indexable);

function hubStructuredNodes(item, language, canonical) {
  const isEntry = item.kind === 'entry';
  const data = item.data;
  const localized = data.locales[language];
  const sectionId = isEntry ? (data.type === 'guide' ? 'guides' : data.type) : data.id;
  const section = hubSections.get(sectionId);
  const crumbs = [
    [language === 'tr' ? 'Ana sayfa' : 'Home', language === 'tr' ? `${siteUrl}tr/` : siteUrl],
    ...(data.id === 'resources' ? [] : [[language === 'tr' ? 'Kaynaklar' : 'Resources', `${siteUrl}${language === 'tr' ? 'tr/' : ''}resources/`]]),
    ...(isEntry ? [[hubTypeLabels[language][data.type] || section.locales[language].eyebrow, `${siteUrl}${language === 'tr' ? 'tr/' : ''}${section.path}`]] : []),
    [isEntry ? localized.title : localized.eyebrow, canonical]
  ];
  const nodes = [{
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map(([name, itemUrl], index) => ({ '@type': 'ListItem', position: index + 1, name, item: itemUrl }))
  }];
  if (isEntry) nodes.push({
    '@type': 'Article',
    headline: localized.title,
    description: data.seo[language].description,
    datePublished: data.publishedAt,
    dateModified: data.updatedAt,
    inLanguage: language,
    mainEntityOfPage: canonical,
    author: { '@type': 'Organization', name: language === 'tr' && data.author === 'MESA contributors' ? 'MESA’ya katkıda bulunanlar' : data.author },
    publisher: { '@type': 'Organization', name: 'MESA', url: siteUrl },
    articleSection: hubTypeLabels[language][data.type],
    keywords: data.tags.join(', ')
  });
  return nodes;
}

for (const language of ['en', 'tr']) {
  for (const item of hubRoutes) {
    const routePath = item.path;
    const localizedPath = language === 'tr' ? `tr/${routePath}` : routePath;
    currentLanguage = language;
    currentPage = { path: routePath };
    base = relativeBase(routePath);
    assetBase = relativeBase(localizedPath);
    alternateHref = language === 'en'
      ? `${base}tr/${routePath}`
      : `${relativeBase(localizedPath)}${routePath}`;
    const metadata = item.kind === 'entry' ? item.data.seo[language] : item.data.locales[language];
    const canonical = `${siteUrl}${localizedPath}`;
    const destination = path.join(outputDirectory, localizedPath, 'index.html');
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, documentShell({
      title: metadata.title,
      description: metadata.description,
      canonical,
      content: item.kind === 'entry' ? renderHubEntry(item.data) : renderHubIndex(item.data),
      language,
      alternateUrls: { en: `${siteUrl}${routePath}`, tr: `${siteUrl}tr/${routePath}` },
      assetBase: relativeBase(localizedPath),
      pageType: item.kind === 'entry' ? 'article' : 'website',
      structuredNodes: hubStructuredNodes(item, language, canonical)
    }));
  }
}

for (const language of ['en','tr']) {
  const prefix = language === 'tr' ? 'tr/' : '';
  const markdownIndex = [`# MESA Learn — ${language === 'tr' ? 'Öğrenme yolu' : 'Learning path'}`, ''];
  for (const id of courseData.lessons) {
    const entry = hubEntries.get(id);
    const target = path.join(outputDirectory, prefix + entry.path, 'article.md');
    fs.copyFileSync(path.join(repositoryRoot,'content/articles',language,entry.slug+'.md'),target);
    markdownIndex.push(`${entry.learning.order}. [${entry.locales[language].title}](${siteUrl}${prefix}${entry.path}article.md)`);
  }
  fs.writeFileSync(path.join(outputDirectory,prefix+'learn/index.md'),markdownIndex.join('\n')+'\n');
  for (const redirect of courseData.redirects) {
    const entry = hubEntries.get(redirect.toId);
    const oldPath = prefix+redirect.fromPath;
    const targetPath = prefix+entry.path;
    const link = relativeBase(oldPath)+targetPath;
    const title = language === 'tr' ? 'Bu konu artık daha kapsamlı bir derste' : 'This topic is now part of a revised lesson';
    const description = `${title}: ${entry.locales[language].title}. (${redirect.fromPath})`;
    const destination = path.join(outputDirectory,oldPath,'index.html');
    fs.mkdirSync(path.dirname(destination),{recursive:true});
    let html = documentShell({title:`${title} — ${redirect.fromPath}`,description,canonical:siteUrl+targetPath,language,noIndex:true,assetBase:relativeBase(oldPath),content:`<main id="main-content" class="learn-redirect"><h1>${title}</h1><p>${language === 'tr' ? 'Tekrarlanan içerikler daha kapsamlı bir derste toplandı. Güncel açıklamalar, şema, alıştırma ve kaynaklar için aşağıdaki dersi izleyin. Eski bağlantınız çalışmaya devam eder.' : 'Overlapping articles have been consolidated into a deeper lesson with worked examples, a diagram, an exercise and source references. Your previous link still leads to the maintained explanation.'}</p><a href="${link}">${escapeHtml(entry.locales[language].title)} →</a></main>`});
    html = html.replace('</head>',`<meta http-equiv="refresh" content="0;url=${link}">\n</head>`);
    fs.writeFileSync(destination,html);
  }
}

const docRoutes = getAllDocRoutes();

for (const language of ['en', 'tr']) {
  for (const item of docRoutes) {
    const routePath = item.path;
    const localizedPath = language === 'tr' ? `tr/${routePath}` : routePath;
    currentLanguage = language;
    currentPage = { path: routePath };
    base = relativeBase(routePath);
    assetBase = relativeBase(localizedPath);
    alternateHref = language === 'en'
      ? `${relativeBase(localizedPath)}tr/${routePath}`
      : `${relativeBase(localizedPath)}${routePath}`;
    const pageTitle = item.page.title[language] || item.page.title.en;
    const repoTitle = item.repo.title[language] || item.repo.title.en;
    const title = language === 'tr'
      ? `${pageTitle} — ${repoTitle} Belgeleri`
      : `${pageTitle} — ${repoTitle} Documentation`;
    const description = language === 'tr'
      ? `${repoTitle} için ${pageTitle} teknik dokümantasyonu (${item.repo.version}).`
      : `${pageTitle} documentation for ${repoTitle} (${item.repo.version}).`;
    const canonical = `${siteUrl}${localizedPath}`;
    const destination = path.join(outputDirectory, localizedPath, 'index.html');
    fs.mkdirSync(path.dirname(destination), { recursive: true });

    const crumbParent = language === 'tr' ? 'Dokümantasyon' : 'Docs';
    const crumbParentUrl = `${siteUrl}${language === 'tr' ? 'tr/' : ''}docs/`;
    const crumbRepo = repoTitle;
    const crumbRepoUrl = `${siteUrl}${language === 'tr' ? 'tr/' : ''}${item.repo.base_route}`;

    const structuredNodes = [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: language === 'tr' ? 'Ana sayfa' : 'Home', item: language === 'tr' ? `${siteUrl}tr/` : siteUrl },
          { '@type': 'ListItem', position: 2, name: crumbParent, item: crumbParentUrl },
          ...(routePath === item.repo.base_route ? [] : [{ '@type': 'ListItem', position: 3, name: crumbRepo, item: crumbRepoUrl }]),
          { '@type': 'ListItem', position: routePath === item.repo.base_route ? 3 : 4, name: pageTitle, item: canonical }
        ]
      },
      {
        '@type': 'TechArticle',
        headline: pageTitle,
        description,
        inLanguage: language,
        mainEntityOfPage: canonical,
        publisher: { '@type': 'Organization', name: 'MESA', url: siteUrl },
        keywords: `${item.repoKey}, documentation, ${item.repo.version}`
      }
    ];

    fs.writeFileSync(destination, documentShell({
      title,
      description,
      canonical,
      content: renderDocPage(item, language, {
        base,
        assetBase,
        siteUrl,
        headerHtml: hubChrome(header('docs')),
        footerHtml: hubChrome(footer())
      }),
      language,
      alternateUrls: { en: `${siteUrl}${routePath}`, tr: `${siteUrl}tr/${routePath}` },
      assetBase: relativeBase(localizedPath),
      pageType: 'article',
      structuredNodes
    }));
  }
}

const allPublicRoutes = [
  ...Object.values(siteData.pages).filter(page => !page.redirectTo),
  ...hubRoutes.map(({ path: routePath }) => ({ path: routePath })),
  ...docRoutes.map(({ path: routePath }) => ({ path: routePath }))
];

const sitemapEntries = allPublicRoutes
  .flatMap(({ path: routePath }) => [routePath, `tr/${routePath}`].map((localizedPath) => `  <url>
    <loc>${siteUrl}${localizedPath}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}${routePath}" />
    <xhtml:link rel="alternate" hreflang="tr" href="${siteUrl}tr/${routePath}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}${routePath}" />
  </url>`))
  .join('\n');
fs.writeFileSync(
  path.join(outputDirectory, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapEntries}\n</urlset>\n`
);
fs.writeFileSync(
  path.join(outputDirectory, 'robots.txt'),
  // Admin pages carry noindex; listing them here would only advertise the path.
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`
);

// Admin routes remain reachable but cannot impersonate an authenticated CMS.
for (const language of ['en', 'tr']) {
  const adminRoute = language === 'tr' ? 'tr/admin/' : 'admin/';
  const destination = path.join(outputDirectory, adminRoute, 'index.html');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, renderAdminPage({ assetBase: relativeBase(adminRoute), language, config: publicAdminConfig, bundleVersion: assetVersion('admin.js'), cssVersion: assetVersion('admin.css'), assetVersions }));
}
writeSearchIndex(outputDirectory);

base = basePath;
assetBase = basePath;
currentLanguage = 'en';
currentPage = siteData.pages.home;
alternateHref = `${basePath}tr/`;
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(path.join(outputDirectory, '404.html'), documentShell({
  title: 'Page Not Found — MESA',
  description: 'The requested MESA ecosystem page could not be found.',
  canonical: `${siteUrl}404.html`,
  content: notFound(),
  assetBase: basePath,
  language: 'en',
  noIndex: true
}));

console.log(`Rendered ${(allPublicRoutes.length) * 2} localized static routes, configured-or-closed admin pages, and 404.html for ${siteUrl}`);
