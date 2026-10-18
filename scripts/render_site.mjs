import { navigationIcon } from './navigation_icons.mjs';
import { learningIndex, renderLesson, validateCurriculum } from './render_learn.mjs';
import { beginnerHow } from './render_intro.mjs';
import fs from 'node:fs';
import { cosmicEnvironment, cosmicVariant } from './cosmic.mjs';
import { productHome, architecturePage, retrievalPage, productTranslations, ecosystemMaturity, coreRelease } from './render_product.mjs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { getAllDocRoutes, renderDocPage, renderDocsHub, renderMcpGuide } from './render_docs.mjs';
import { renderAdminPage } from './render_admin.mjs';
import { adminConfig } from './admin/config.mjs';
const publicAdminConfig = adminConfig(process.env);
import { writeSearchIndex } from './generate_search_index.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(scriptDirectory);
const siteData = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'site-data.json'), 'utf8'));
const trContent = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'content', 'tr.json'), 'utf8'));
const courseData = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'content/learn-curriculum.json'), 'utf8'));
const hubData = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'content', 'hub.json'), 'utf8'));
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
  readme: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/README.md`,
  gettingStarted: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/getting-started.md`,
  architecture: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md`,
  concepts: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/concepts-and-ingestion.md`,
  configuration: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/configuration.md`,
  retrieval: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/retrieval-and-graph.md`,
  api: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/api-reference.md`,
  cli: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/api-reference.md#cli`,
  mcp: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/README_MCP.md`,
  installation: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/getting-started.md#installation`,
  migration: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/RUNBOOK.md#upgrade-v080`,
  releaseNotes: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/CHANGELOG.md#v081-publication`,
  releasePolicy: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/release.md`,
  rebuild: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/v4-rebuild-runbook.md`,
  security: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/SECURITY.md`,
  troubleshooting: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/RUNBOOK.md#troubleshooting`,
  limitations: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md#limitations`,
  contributing: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/CONTRIBUTING.md`,
  openapi: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/reference/openapi.json`,
  retrievalFixture: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/tests/test_v4_independent_retrieval_audit.py`,
  retrievalAudit: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/testing.md`,
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

const mark = () => `<span class="mesa-mark" aria-hidden="true"><img src="${asset('assets/mesa-mark.webp')}?v=${assetVersions.logo}" alt="" width="128" height="128"></span>`;
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
          <button class="search-trigger" type="button" aria-label="Search site (Ctrl+K)">${navigationIcon('search')}<span>Search</span><kbd class="search-shortcut">⌘K</kbd></button>
          ${languageControl()}
          <a class="nav-github" href="${repos.core}" target="_blank" rel="noopener noreferrer">${navigationIcon('github')}<span>GitHub</span>${icon('external', 'icon-external')}</a>
        </nav>
      </div>
    </header>`;
}

function footer(compact = false) {
  return `${compact ? '' : `<section class="closing-cta" aria-labelledby="closing-title">
      <div>
        <p class="eyebrow">OPEN SOURCE · MIT</p>
        <h2 id="closing-title">Inspect the source.<br><em>Test the boundaries.</em></h2>
        <p>MESA v0.8.1 is a published source release. Start with the model-disabled quickstart and review the production qualification limits before evaluating the full V4 runtime.</p>
        <div class="actions">${cta('Read the quickstart', route('docs/'))}${cta('View source', repos.core, 'secondary', true)}</div>
      </div>
    </section>`}
    <footer class="site-footer">
      <div class="footer-brand">${logo()}<p>${project.fullName}.</p><p class="footer-note">v${project.version} · ${project.runtime} ${project.maturity.toLowerCase()} · <a href="${route('status/')}">View status →</a></p></div>
      <div class="footer-groups">
        <div><h3>Explore</h3><a href="${route('how-it-works/')}">How it works</a><a href="${route('use-cases/')}">Use cases</a><a href="${route('evaluation/')}">Evaluation & trust</a><a href="${route('status/')}">Project status</a></div>
        <div><h3>Ecosystem</h3><a href="${route('mesa/')}">MESA Core</a><a href="${route('data/')}">MESA Data</a><a href="${route('qa/')}">MESA QA</a><a href="${route('certification/')}">E2E Certification</a><a href="${route('law/')}">MESA Law</a></div>
        <div><h3>Resources</h3><a href="${route('learn/')}">Learn</a><a href="${route('research/')}">Research</a><a href="${route('guides/')}">Guides</a><a href="${route('glossary/')}">Glossary</a><a href="${route('methodology/')}">Methodology</a></div>
        <div><h3>Documentation</h3><a href="${route('docs/core/getting-started/')}">Quickstart</a><a href="${route('architecture/')}">Architecture</a><a href="${route('retrieval/')}">Retrieval</a><a href="${route('docs/core/security/')}">Security</a><a href="${route('docs/mcp/')}">MCP integration</a></div>
        <div><h3>Project</h3><a href="${route('about/')}">About</a><a href="${route('faq/')}">FAQ</a>${external(repos.issues, 'Open an issue')}${external(repos.profile, 'Maintainer profile')}<a href="${route('admin/')}">Admin</a></div>
      </div>
      <div class="footer-bottom"><span>© 2026 MESA contributors</span><span>Source-verified documentation gateway</span></div>
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

function architectureFlow() {
  const items = [
    ['01', 'Sources', 'Exact source text and version identity'],
    ['02', 'Admission', 'Authorized, dataset-scoped mutation'],
    ['03', 'Validation', 'Deterministic, single, or dual policy'],
    ['04', 'SQL ledger', 'Catalog, ownership, assertions, outbox'],
    ['05', 'Projections', 'Vector then Graph V2, idempotently'],
    ['06', 'Retrieval', 'Vector + BM25 + assertion + graph-path RRF'],
    ['07', 'Clients', 'REST, sync/async SDK, MCP']
  ];
  return `<div class="architecture-flow">${items.map(([n, title, text]) => `<div class="flow-step"><span>${n}</span><strong>${title}</strong><small>${text}</small></div>`).join('<b aria-hidden="true">→</b>')}</div>`;
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
}</code></pre><p class="text--meta">Schema-aligned website rendering of the fixture fields; production context is token-bounded JSON evidence.</p></div></div><p class="memory-example__test"><code>test_real_four_lanes_fuse_once_and_repeat_deterministically</code><span>Core test at release commit d394784.</span></p></details>
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

function ecosystemCards() {
  const cards = [
    ['Core', 'mesa/', 'The memory layer', 'Accepts authorized information and makes it retrievable without dropping its evidence or data scope.', 'Owns the V4 catalog, authorization, mutation lifecycle, projections, retrieval, API, SDK, and MCP surfaces.', repos.core],
    ['Data', 'data/', 'The source preparation layer', 'Turns reviewed Turkish legal sources into traceable releases that MESA Core can admit.', 'Preserves raw bytes, canonicalizes records, applies quality gates, freezes releases, and uses a human-started publisher.', repos.data],
    ['QA', 'qa/', 'The behavior testing layer', 'Checks whether candidate builds remember, update, forget, and recover as expected over time.', 'Exercises correctness, temporal change, cross-session persistence, restart durability, and bounded candidate repair.', repos.qa],
    ['Certification', 'certification/', 'The evidence and verdict layer', 'Defines what one end-to-end legal profile must prove before a passing result can be claimed.', 'Uses frozen evidence, independent ground truth, hard gates, and fail-closed Profile B verdicts.', repos.certification],
    ['Law', 'law/', 'The application layer', 'Shows how a legal matter and document workflow can consume MESA through an explicit service boundary.', 'Adds matter/document review, provenance, deadlines and a pinned MESA V4 HTTP contract. Research, drafting and rebuild surfaces remain disabled.', repos.law]
  ];
  return `<div class="ecosystem-grid">${cards.map(([title, path, role, summary, technical, repo], i) => `<article class="ecosystem-card">
      <div class="card-index">0${i + 1}</div><p class="eyebrow">${role}</p><h3>MESA ${title}</h3><p class="card-summary">${summary}</p>
      <details><summary>Technical role</summary><p>${technical}</p></details>
      <div class="card-links"><a href="${route(path)}">Explore ${title}<span aria-hidden="true"> →</span></a>${external(repo, 'Repository')}</div>
    </article>`).join('')}</div>`;
}

const productHelpers = () => ({header,footer,route,cta,actionExample});
function home() { return productHome(productHelpers()); }
function architecture() { return architecturePage(productHelpers()); }
function retrieval() { return retrievalPage(productHelpers()); }

function howItWorksPage() { return beginnerHow(productHelpers()); }

function mesa() {
  return `
    ${header('mesa')}
    <main id="main-content">
      <section class="page-hero page-hero--core">
        <p class="eyebrow">MESA CORE · V${project.version}</p>
        <h1>A durable memory engine<br>with <em>structured evidence.</em></h1>
        <p>The ${project.runtime} ${project.maturity.toLowerCase()} introduces canonical provenance, selectable validation, dataset isolation, ordered projections, and versioned REST, SDK, and MCP operations.</p>
        <div class="actions">
          ${cta('Source repository', repos.core, 'primary', true)}
          ${cta('Documentation', route('docs/'), 'secondary')}
        </div>
      </section>
      ${statusStrip()}
      ${coreRelease(route)}

      <section class="section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">MEMORY LIFECYCLE</p>
            <h2>Admission to retrieval,<br><em>without hidden writes.</em></h2>
          </div>
          <p>A rejected mutation creates no active SQL, vector, entity, edge, or assertion artifact. Accepted work follows ordered, idempotent lanes.</p>
        </div>
        ${architectureFlow()}
      </section>

      <section class="section surface-section" id="security">
        <div class="surface-copy">
          <p class="eyebrow">SECURITY BOUNDARY</p>
          <h2>Agents are context.<br><em>Tenants are boundaries.</em></h2>
          <p>V4 authorization follows principal → tenant → workspace → dataset → agent → server-created session. Roles inherit down the catalog. Purge and rollback require explicit dataset permissions.</p>
          ${cta('Read security policy', docs.security, 'text', true)}
        </div>
        <div class="scope-visual" role="img" aria-label="Nested MESA authorization scopes">
          <span>Principal<strong>Tenant<span>Workspace<strong>Dataset<span>Agent<strong>Session</strong></span></strong></span></strong></span>
        </div>
      </section>

      <section class="section retrieval-section" id="retrieval">
        <div class="section-heading">
          <div>
            <p class="eyebrow">RETRIEVAL V2</p>
            <h2>Four signals.<br><em>One bounded result.</em></h2>
          </div>
          <p>Authorized dataset, temporal, jurisdiction, tenant, and agent eligibility are enforced before lane fusion. Higher fused scores are better.</p>
        </div>
        <div class="lane-grid five">
          <article>
            <span>SEMANTIC</span>
            <h3>Vector</h3>
            <p>LanceDB assertion projection with embedding provenance.</p>
          </article>
          <article>
            <span>LEXICAL</span>
            <h3>BM25</h3>
            <p>Exact and lexical evidence from the SQL-owned corpus.</p>
          </article>
          <article>
            <span>RELATIONAL</span>
            <h3>Assertions</h3>
            <p>SQLite-authoritative assertion relations and citation-aware scoring.</p>
          </article>
          <article>
            <span>BOUNDED GRAPH</span>
            <h3>Graph paths</h3>
            <p>Kùzu Graph V2 paths reconciled to authorized canonical assertion IDs.</p>
          </article>
          <article class="fusion">
            <span>FUSION</span>
            <h3>True RRF</h3>
            <p>Each lane votes once per candidate, then a bounded legal reranker may apply.</p>
          </article>
        </div>
        <div class="notice">
          <strong>Storage and retrieval views</strong>
          <p>The storage overview describes SQL, vector and graph projections. Retrieval uses four lanes: vector, BM25, assertion and bounded graph paths, each reconciled to canonical eligibility.</p>
        </div>
      </section>

      <section class="section storage-section">
        <div>
          <p class="eyebrow">PHYSICAL STORES</p>
          <h2>SQLite decides.<br><em>Projections follow.</em></h2>
        </div>
        <div class="storage-grid">
          <article>
            <strong>SQLite</strong>
            <p>Catalog, authorization, mutation/pipeline ledger, ownership, assertions, and ordered outbox.</p>
          </article>
          <article>
            <strong>LanceDB</strong>
            <p>Idempotent vector projection with embedding identity.</p>
          </article>
          <article>
            <strong>Kuzu</strong>
            <p>Idempotent Graph V2 projection, not the assertion decision source.</p>
          </article>
        </div>
      </section>

      <section class="section client-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">CLIENT SURFACES</p>
            <h2>Versioned access<br><em>around one lifecycle.</em></h2>
          </div>
        </div>
        <div class="client-grid">
          <a href="${docs.api}" target="_blank" rel="noopener noreferrer">
            <span>HTTP</span>
            <strong>V4 REST API</strong>
            <small>Catalog, sessions, memory, mutations, operations</small>
          </a>
          <a href="${docs.readme}" target="_blank" rel="noopener noreferrer">
            <span>PYTHON</span>
            <strong>Sync & async SDK</strong>
            <small>MesaV4Client and version-matched operations</small>
          </a>
          <a href="${route('docs/mcp/')}">
            <span>PROTOCOL</span>
            <strong>MCP</strong>
            <small>Legacy direct stdio plus the V4 gateway/bridge path</small>
          </a>
        </div>
      </section>
      ${footer()}
    </main>`;
}

function ecosystem() {
  return `
    ${header('ecosystem')}
    <main id="main-content">
      <section class="page-hero compact page-hero--field">
        <p class="eyebrow">MESA ECOSYSTEM</p>
        <h1>Clear boundaries.<br><em>Evidence across them.</em></h1>
        <p>Five repositories split preparation, memory, application, behavior testing, and independent evidence. The generic platform model is separate from the current legal reference path.</p>
      </section>

      <section class="section boundary-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">GENERIC PLATFORM MODEL</p>
            <h2>Core sits between<br><em>sources and applications.</em></h2>
          </div>
          <p>Preparation may be performed by MESA Data or by another compatible source pipeline. MESA Law is one application, not a required runtime stage.</p>
        </div>
        <div class="platform-map" role="group" aria-label="Generic MESA platform model">
          <div class="map-runtime">
            <div><small>INPUT</small><strong>Sources</strong><span>Reviewed material</span></div>
            <b aria-hidden="true">→</b>
            <div><small>PREPARE</small><strong>Ingestion layer</strong><span>MESA Data or compatible producer</span></div>
            <b aria-hidden="true">→</b>
            <div class="core-node"><small>MEMORY</small><strong>MESA Core</strong><span>Admission · retrieval · evidence</span></div>
            <b aria-hidden="true">→</b>
            <div><small>OUTPUT</small><strong>Application</strong><span>Versioned API / SDK / MCP</span></div>
          </div>
          <div class="map-quality">
            <span>OUT-OF-RUNTIME EVALUATION</span>
            <a href="${route('qa/')}">MESA QA</a><i>behavior over time</i>
            <a href="${route('certification/')}">E2E Certification</a><i>profile evidence & verdict</i>
          </div>
        </div>
      </section>

      <section class="section legal-reference">
        <div class="section-heading">
          <div>
            <p class="eyebrow copper">CURRENT LEGAL REFERENCE PATH</p>
            <h2>A concrete path,<br><em>not a universal dependency.</em></h2>
          </div>
          <p>This is the current Profile B and MESA Law shape. It is intentionally labeled as the legal reference implementation.</p>
        </div>
        <div class="ecosystem-flow legal-flow" role="group" aria-label="Current legal reference implementation">
          <div><small>SOURCE</small><strong>Official legal sources</strong></div>
          <b aria-hidden="true">→</b>
          <div><small>PREPARE</small><strong>MESA Data</strong></div>
          <b aria-hidden="true">→</b>
          <div><small>MEMORY</small><strong>MESA Core</strong></div>
          <b aria-hidden="true">→</b>
          <div><small>REFERENCE APP</small><strong>MESA Law</strong></div>
        </div>
      </section>

      <section class="section ecosystem-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">FIVE EXPLICIT ROLES</p>
            <h2>Repository boundaries<br><em>with distinct ownership.</em></h2>
          </div>
          <p>Each component answers what it is, why it exists, and what it technically owns.</p>
        </div>
        ${ecosystemCards()}
      </section>
      ${ecosystemMaturity()}

      <section class="section journey-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow copper">END-TO-END EXAMPLE</p>
            <h2>Legal evidence,<br><em>kept connected.</em></h2>
          </div>
          <p>A reviewed legal source can move through a frozen Data release, authorized Core admission, scoped retrieval, and a Law workflow without presenting local staging or a 202 response as successful publication.</p>
        </div>
        <ol class="journey-flow">
          <li><span>01</span><strong>Acquire</strong><small>Approved or manual official source</small></li>
          <li><span>02</span><strong>Release</strong><small>Immutable evidence and canonical records</small></li>
          <li><span>03</span><strong>Admit</strong><small>Authorized dataset-scoped mutation</small></li>
          <li><span>04</span><strong>Retrieve</strong><small>Ranked context with provenance</small></li>
          <li><span>05</span><strong>Use</strong><small>Law workflow over the HTTP contract</small></li>
        </ol>
      </section>
      ${footer()}
    </main>`;
}

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
        <p>The latest QA state records a live first-write INVALID_ARGUMENT failure. Earlier Lite harness evidence includes a candidate session verdict of FAIL; it does not validate current Core 0.8.1.</p>
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
        <p>The 2026-08-01 report records isolated Law-side gates against Core 0.7.1. Full-stack and live Core integration were not run. Current Law HEAD CI reports failure; this is not current Core 0.8.1 integration proof.</p>
        ${cta('Read verification report', docs.lawStatus, 'text', true)}
      </section>
      ${footer()}
    </main>`;
}

function useCasesPage() {
  const cases = [
    ['Agent memory', 'Long-running agents need to update and retrieve context without turning every prior interaction into an unscoped text pile.', 'MESA provides a durable mutation lifecycle, dataset-scoped sessions, structured assertions, and observable outcomes.', 'A clearer basis for inspecting what was remembered, from which source, and under which scope.'],
    ['Knowledge-heavy assistants', 'A single similarity score can miss exact wording, explicit relationships, and multi-hop context.', 'MESA fuses vector, BM25, assertion, and bounded graph-path origins around canonical evidence.', 'Broader retrieval signals without discarding evidence identity or treating graph projection as canonical truth.'],
    ['Provenance-sensitive AI', 'Returned context may be useful but impossible to trace back to a document revision, chunk, or span.', 'Source and pipeline provenance remain part of the V4 assertion and retrieval contracts.', 'Applications can surface the basis and limitations of retrieved context.'],
    ['Long-lived structured memory', 'Facts change, sources are revised, and shared artifacts may have more than one owner.', 'V4 models immutable revisions, supersession, source-owned rollback, purge, replay, and reconciliation.', 'Memory can evolve through explicit lifecycle rules instead of silent replacement.']
  ];

  return `
    ${header('use-cases')}
    <main id="main-content">
      <section class="page-hero compact page-hero--scope">
        <p class="eyebrow">USE CASES</p>
        <h1>Memory for systems where<br><em>evidence and scope matter.</em></h1>
        <p>These are realistic evaluation targets derived from the current architecture. They are not customer, compliance, or production-deployment claims.</p>
      </section>

      <section class="section case-list">
        ${cases.map(([name, problem, role, benefit], index) => `
        <article>
          <span>0${index + 1}</span>
          <h2>${name}</h2>
          <dl>
            <div><dt>Problem</dt><dd>${problem}</dd></div>
            <div><dt>MESA role</dt><dd>${role}</dd></div>
            <div><dt>Expected benefit</dt><dd>${benefit}</dd></div>
          </dl>
        </article>`).join('')}
      </section>

      <section class="section reference-callout">
        <div>
          <p class="eyebrow">CURRENT VERTICAL EXAMPLE</p>
          <h2>MESA Law explores<br><em>the legal workflow shape.</em></h2>
          <p>Its source-aware matter, document, review, and QA surfaces show why provenance matters. Live Core integration remains pending.</p>
        </div>
        ${cta('Explore the reference implementation', route('law/'))}
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

function faqPage() {
  const questions = [
    ['What is MESA?', 'MESA is open-source memory infrastructure for AI systems. Its released V4 source combines durable mutation state, structured assertions, scoped retrieval, and source provenance across versioned HTTP, Python SDK, and MCP surfaces.'],
    ['Is MESA a vector database?', 'No. LanceDB is one internal projection. SQLite is the canonical decision source, Kùzu is a Graph V2 projection, and retrieval can combine vector, BM25, assertion, and bounded graph-path origins.'],
    ['Is MESA a RAG framework?', 'Not primarily. It can supply grounded context to an application, but its public contract focuses on durable memory, catalog scope, lifecycle state, evidence, and retrieval rather than owning an entire generation stack.'],
    ['How is MESA different from plain vector search?', 'It keeps canonical source and assertion identity, applies authorization before ranking, combines several retrieval origins, and exposes mutation, projection, rollback, and provenance state.'],
    ['Why SQLite, LanceDB, and Kùzu?', 'SQLite owns catalog, authorization, ledgers, ownership, assertions, and outbox state. LanceDB stores the vector projection. Kùzu stores the Graph V2 projection and supports bounded graph-path retrieval reconciled to SQLite assertion IDs.'],
    ['What does evidence-aware memory mean?', 'Retrieved knowledge can remain connected to document, revision, chunk, evidence span, assertion, pipeline, and embedding identity instead of returning only detached text.'],
    ['What is provenance?', 'Provenance is the trace of where a memory came from and how it was processed: source reference, catalog identity, evidence span, pipeline and model versions, and contributing retrieval origins when available.'],
    ['What is MESA Data?', 'A Turkish legal-data preparation platform. It preserves raw artifacts, canonicalizes records, applies gates and review, freezes releases, and uses a human-started delivery path. It is not advertised as a universal web ingestion service.'],
    ['What is MESA Law?', 'The primary reference implementation: a legal matter and document workflow with source-aware review and a versioned MESA V4 HTTP contract. Its live Core/full-stack integration is still pending.'],
    ['How do MESA QA and E2E Certification differ?', 'QA asks whether candidate behavior stays correct across time, sessions, and restarts. E2E Certification asks whether one frozen system profile can produce the required authoritative evidence and pass all hard gates.'],
    ['Does MESA support MCP?', 'Yes. The repository documents a legacy direct stdio server for the V3-compatible path and a newer V4 gateway/bridge path with binding-scoped operations and approvals.'],
    ['Can MESA run locally?', 'Yes. The repository documents locked local installation and Docker profiles. The simple safe-core profile disables model and external-provider access; the V4 full-cognitive profile requires explicit configuration and one storage owner.'],
    ['Is MESA production-ready?', `No. Core is a ${project.maturity.toLowerCase()} and production remains ${project.production}. Required production-like migration, restore, crash, saturation, concurrency, benchmark, and soak gates are not all complete.`],
    ['What is the current certification status?', 'Blocked. The current harness implements official execution, scoring and metric producers, but B4/B6/B7/B8 require unavailable external delivery/restart evidence and a fresh official run.'],
    ['Where should a developer start?', 'Read the quickstart, run the locked environment, choose the V3-compatible safe core or the explicit V4 topology deliberately, then inspect the API, SDK, MCP, architecture, and status documents before integration.']
  ];

  return `
    ${header()}
    <main id="main-content">
      <section class="page-hero compact page-hero--functional faq-hero docs-accent">
        <p class="eyebrow">FREQUENTLY ASKED QUESTIONS</p>
        <h1>Short answers.<br><em>Source-linked depth.</em></h1>
        <p>These answers reflect current public repositories and the ${project.runtime} ${project.maturity.toLowerCase()} status as of ${project.statusAsOf}.</p>
      </section>

      <section class="section faq-list">
        ${questions.map(([question, answer], index) => `
        <details${index === 0 ? ' open' : ''}>
          <summary>${question}</summary>
          <p>${answer}</p>
        </details>`).join('')}
      </section>

      <section class="section faq-next">
        <div>
          <p class="eyebrow">GO DEEPER</p>
          <h2>Architecture, interfaces,<br><em>status, and source.</em></h2>
        </div>
        <div class="actions">
          ${cta('Read the docs', route('docs/'))}
          ${cta('Review project status', route('status/'), 'secondary')}
          ${cta('Open GitHub', repos.core, 'text', true)}
        </div>
      </section>
      ${footer()}
    </main>`;
}

function docsPage() {
  return renderDocsHub(currentLanguage, {base, headerHtml: hubChrome(header('docs'))});
}

function mcpPage() {
  const body = `

      <header class="docs-article-header">
        <p class="eyebrow">MODEL CONTEXT PROTOCOL</p>
        <h1>Two integration paths.<br><em>Different runtime contracts.</em></h1>
        <p>MESA’s MCP documentation distinguishes the legacy direct stdio server from the current V4 gateway and local bridge path.</p>
        <div class="actions">
          ${cta('Source guide', docs.mcp, 'primary', true)}
          ${cta('Core repository', repos.core, 'secondary', true)}
        </div>
      </header>

      <section id="integration-paths" class="mcp-paths">
        <article>
          <p class="eyebrow">LEGACY V3-COMPATIBLE</p>
          <h2>Direct stdio server</h2>
          <p><code>mesa_mcp.server</code> runs an MCP JSON-RPC stdio stream and calls the public MESA HTTP API; it does not open storage databases directly. The root README documents five project-memory tools.</p>
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
          ${external(docs.releaseNotes, 'v0.8.1 Release notes')}
          ${external('https://github.com/Yasou13/MESA/releases/tag/v0.8.1', 'Official v0.8.1 release')}
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
          <p>The dated Law-side report passed against Core 0.7.1; current HEAD CI is failing. Live Core 0.8.1 integration remains unverified.</p>
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
  tr: { learn: 'Learn', research: 'Research', guide: 'Rehber', glossary: 'Sözlük', methodology: 'Metodoloji' }
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
  return `<nav class="breadcrumbs" aria-label="${hubText('Breadcrumb', 'İçerik yolu')}"><ol>${items.map((item, index) => `<li>${item.path ? `<a href="${route(item.path)}">${escapeHtml(item.label)}</a>` : `<span aria-current="page">${escapeHtml(item.label)}</span>`}${index < items.length - 1 ? '<span aria-hidden="true">/</span>' : ''}</li>`).join('')}</ol></nav>`;
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
    body = `
      <section class="section resource-map" aria-labelledby="resource-map-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">${hubText('CONNECTED PUBLISHING', 'BAĞLANTILI YAYIN')}</p>
            <h2 id="resource-map-title">${hubText('Six surfaces. One knowledge graph.', 'Altı alan. Tek bilgi ağı.')}</h2>
          </div>
          <p>${hubText('Move from a concept to a practical workflow, research evidence, and the method behind it without losing context.', 'Bir kavramdan pratik iş akışına, araştırma kanıtına ve arkasındaki yönteme bağlamı kaybetmeden ilerleyin.')}</p>
        </div>
        <div class="resource-section-grid">
          ${hubData.sections.filter(({ id }) => id !== 'resources').map((item) => {
            const copy = item.locales[currentLanguage];
            return `
            <a href="${route(item.path)}">
              <span>${escapeHtml(copy.eyebrow)}</span>
              <strong>${escapeHtml(copy.heading)}</strong>
              <p>${escapeHtml(copy.intro)}</p>
              <i aria-hidden="true">→</i>
            </a>`;
          }).join('')}
        </div>
      </section>`;
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
              <span>${escapeHtml(tool.category)}</span>
              <h2>${escapeHtml(copy.title)}</h2>
              <p>${escapeHtml(copy.description)}</p>
              ${available
                ? `<a href="${route(tool.route)}">${hubText('Open tool', 'Aracı aç')}<span aria-hidden="true"> →</span></a>`
                : `<strong>${hubText('Planned · not yet interactive', 'Planlandı · henüz interaktif değil')}</strong>`}
            </article>`;
          }).join('')}
        </div>
      </section>`;
  } else {
    const contentType = section.id === 'guides' ? 'guide' : section.id === 'glossary' ? 'glossary' : section.id;
    const entries = publishedEntries().filter(({ type }) => type === contentType);
    const future = section.id === 'methodology' ? `
      <div class="methodology-scope">
        <p class="eyebrow">${hubText('SUPPORTED NEXT', 'SONRAKİ DESTEKLENEN ALANLAR')}</p>
        <ul>
          <li>${hubText('Dataset selection', 'Veri seti seçimi')}</li>
          <li>${hubText('Relevance judgment', 'Relevance judgment')}</li>
          <li>${hubText('Dataset versioning', 'Veri seti sürümleme')}</li>
          <li>${hubText('Corrections policy', 'Düzeltme politikası')}</li>
        </ul>
        <p>${hubText('These are supported by the content model; unpublished pages are not exposed as routes.', 'Bu alanlar içerik modeli tarafından desteklenir; yayımlanmamış sayfalar route olarak gösterilmez.')}</p>
      </div>` : '';
    body = `
      <section class="section publication-index">
        <div>
          <h2 class="sr-only">${hubText('Published resources', 'Yayımlanmış kaynaklar')}</h2>
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
  if (block.kind === 'table') return `<div class="table-scroll"><table><thead><tr>${block.headers.map((item) => `<th scope="col">${escapeHtml(item)}</th>`).join('')}</tr></thead><tbody>${block.rows.map((row) => `<tr>${row.map((item, index) => `<${index ? 'td' : 'th'}${index ? '' : ' scope="row"'}>${renderFormattedText(item)}</${index ? 'td' : 'th'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  throw new Error(`Unsupported hub block type: ${block.kind}`);
}

function renderResearchMetadata(entry) {
  if (entry.type !== 'research') return '';
  const limitations = currentLanguage === 'tr'
    ? ['Henüz deney yürütülmedi.', 'Veri seti büyüklüğü, skor veya performans iddiası sunulmuyor.', 'Protokol ön kayıttan önce değişebilir.']
    : entry.limitations;
  const reviewers = [
    ...(entry.reviewers?.technical || []).map((name) => [hubText('Technical reviewer', 'Teknik reviewer'), name]),
    ...(entry.reviewers?.legal || []).map((name) => [hubText('Legal reviewer', 'Hukuk reviewer'), name])
  ];
  const evidenceLinks = [
    entry.repository ? external(entry.repository, hubText('Code repository', 'Kod repository’si')) : '',
    entry.datasetUrl ? external(entry.datasetUrl, hubText('Dataset record', 'Veri seti kaydı')) : '',
    ...(entry.methodology || []).map((id) => { const method = hubEntries.get(id); return method ? `<a href="${route(method.path)}">${escapeHtml(method.locales[currentLanguage].title)}<span aria-hidden="true"> →</span></a>` : ''; })
  ].filter(Boolean);

  return `
    <section class="research-record" aria-labelledby="research-record-title">
      <h2 id="research-record-title">${hubText('Research record', 'Araştırma kaydı')}</h2>
      <dl>
        <div>
          <dt>${hubText('Status', 'Durum')}</dt>
          <dd>${hubText('Planned protocol · no results', 'Planlanan protokol · sonuç yok')}</dd>
        </div>
        <div>
          <dt>${hubText('MESA version', 'MESA sürümü')}</dt>
          <dd>${hubText('To be pinned before execution', 'Çalıştırmadan önce sabitlenecek')}</dd>
        </div>
        <div>
          <dt>${hubText('Dataset', 'Veri seti')}</dt>
          <dd>${hubText('Not selected; criteria must be frozen first', 'Seçilmedi; önce seçim ölçütleri dondurulmalı')}</dd>
        </div>
        <div>
          <dt>${hubText('Models', 'Modeller')}</dt>
          <dd>${hubText('To be declared and version-pinned', 'Beyan edilip sürümü sabitlenecek')}</dd>
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
      <h2 id="related-title">${hubText('Continue through the evidence graph.', 'Kanıt ağı içinde ilerleyin.')}</h2>
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
          <h2>${hubText('See how provenance appears in MESA Law.', 'Provenance yaklaşımının MESA Law örneğini görün.')}</h2>
          <p>${hubText('A restrained product link for readers who want the application context.', 'Uygulama bağlamını görmek isteyen okurlar için ölçülü bir ürün bağlantısı.')}</p>
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
          <p class="eyebrow">${escapeHtml(typeLabel)} · ${escapeHtml(entry.category)}</p>
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
              <dd>${escapeHtml(entry.author)}</dd>
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
  architecture,
  retrieval,
  mesa,
  howItWorks: howItWorksPage,
  ecosystem,
  data: dataPage,
  qa: qaPage,
  certification,
  law: lawPage,
  useCases: useCasesPage,
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

function documentShell({ title, description, canonical, content, assetBase, language = 'en', alternateUrls, noIndex = false, pageType = 'website', structuredNodes = [] }) {
  const socialImage = `${siteUrl}${language === 'tr' ? 'og-image-tr.png' : 'og-image.png'}`;
  const locale = language === 'tr' ? 'tr_TR' : 'en_US';
  const alternateLocale = language === 'tr' ? 'en_US' : 'tr_TR';
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', name: project.name, url: siteUrl, inLanguage: language, description },
      {
        '@type': 'SoftwareSourceCode',
        name: project.fullName,
        alternateName: project.name,
        description,
        codeRepository: repos.core,
        license: `${repos.core}/blob/d3947846615e63b48dc7a5df9f1051b29f734263/LICENSE`,
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
  <link rel="icon" type="image/png" sizes="48x48" href="${assetBase}favicon-48x48.png">
  <link rel="icon" href="${assetBase}assets/mesa-mark.webp?v=${assetVersions.logo}" type="image/webp">
  <link rel="apple-touch-icon" href="${assetBase}apple-touch-icon.png">
  <script>document.documentElement.classList.add('js')</script>
  <link rel="preload" href="${assetBase}fonts/instrument-sans-variable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${assetBase}styles.css?v=${assetVersions.css}">
  <link rel="stylesheet" href="${assetBase}cosmic.css?v=${assetVersions.cosmic}">
  <link rel="stylesheet" href="${assetBase}learn.css?v=${assetVersions.learn}">
${content.includes('class="docs-layout"') ? `  <link rel="stylesheet" href="${assetBase}docs.css?v=${assetVersions.docs}">\n` : ''}  <script src="${assetBase}cosmic-motion.js?v=${assetVersions.cosmicMotion}" defer></script>
</head>
<body>
${cosmicEnvironment(cosmicVariant(new URL(canonical).pathname.slice(basePath.length)))}
${content}
  <script src="${assetBase}app.js?v=${assetVersions.js}"></script>
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
    author: { '@type': 'Organization', name: data.author },
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
    const title = language === 'tr' ? 'Bu konu güncel bir derste birleştirildi' : 'This topic is now part of a revised lesson';
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
      ? `${pageTitle} — MESA ${repoTitle} Dokümantasyonu`
      : `${pageTitle} — MESA ${repoTitle} Documentation`;
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
          { '@type': 'ListItem', position: 3, name: crumbRepo, item: crumbRepoUrl },
          { '@type': 'ListItem', position: 4, name: pageTitle, item: canonical }
        ]
      },
      {
        '@type': 'TechArticle',
        headline: pageTitle,
        description,
        inLanguage: language,
        mainEntityOfPage: canonical,
        author: { '@type': 'Organization', name: 'MESA Contributors' },
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
  ...Object.values(siteData.pages),
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
  `User-agent: *\nDisallow: /admin/\nDisallow: /tr/admin/\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`
);

// Admin routes remain reachable but cannot impersonate an authenticated CMS.
for (const language of ['en', 'tr']) {
  const adminRoute = language === 'tr' ? 'tr/admin/' : 'admin/';
  const destination = path.join(outputDirectory, adminRoute, 'index.html');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, renderAdminPage({ assetBase: relativeBase(adminRoute), language, config: publicAdminConfig }));
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
