// Modular documentation renderer for MESA Native Documentation
// Renders hierarchical multi-repository documentation for Core, Data, Law, QA, E2E, and MCP.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderMarkdown, generateTableOfContents, escapeHtml } from './markdown_engine.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(scriptDirectory);
const manifestPath = path.join(repositoryRoot, 'content', 'docs', 'manifest.json');

let cachedManifest = null;
export function getDocsManifest() {
  if (cachedManifest) return cachedManifest;
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Documentation manifest missing at ${manifestPath}. Run scripts/sync_docs.py first.`);
  }
  cachedManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  return cachedManifest;
}

export function getAllDocRoutes() {
  const manifest = getDocsManifest();
  const routes = [];
  for (const [repoKey, repo] of Object.entries(manifest.repositories)) {
    for (const page of repo.pages) {
      routes.push({
        repoKey,
        repo,
        page,
        path: page.route
      });
    }
  }
  return routes;
}

function docsSidebar(currentRoute, language = 'en', { base = './' } = {}) {
  const manifest = getDocsManifest();
  const route = (p = '') => `${base}${p}`;
  const isTr = language === 'tr';

  let sectionsHtml = '';

  // 1. Docs Hub & Overview
  sectionsHtml += `<div class="sidebar-group">
    <div class="sidebar-group-header">
      <span>${isTr ? 'GENEL BAKIŞ' : 'OVERVIEW'}</span>
    </div>
    <ul class="sidebar-links">
      <li><a href="${route('docs/')}"${currentRoute === 'docs/' ? ' class="active" aria-current="page"' : ''}>${isTr ? 'Dokümantasyon Merkezi' : 'Documentation Hub'}</a></li>
      <li><a href="${route('docs/mcp/')}"${currentRoute === 'docs/mcp/' ? ' class="active" aria-current="page"' : ''}>MCP Integration</a></li>
    </ul>
  </div>`;

  // 2. Each repository group
  const repoOrder = ['core', 'data', 'law', 'qa', 'e2e'];
  for (const key of repoOrder) {
    const repo = manifest.repositories[key];
    if (!repo) continue;
    const repoTitle = repo.title[language] || repo.title.en;
    const isCurrentRepo = currentRoute.startsWith(repo.base_route);

    sectionsHtml += `<div class="sidebar-group${isCurrentRepo ? ' open' : ''}">
      <div class="sidebar-group-header">
        <span>${escapeHtml(repoTitle)}</span>
        <span class="version-tag">${escapeHtml(repo.version)}</span>
      </div>
      <ul class="sidebar-links">`;

    for (const page of repo.pages) {
      const pageTitle = page.title[language] || page.title.en;
      const isCurrentPage = currentRoute === page.route;
      sectionsHtml += `<li><a href="${route(page.route)}"${isCurrentPage ? ' class="active" aria-current="page"' : ''}>${escapeHtml(pageTitle)}</a></li>`;
    }

    sectionsHtml += `</ul></div>`;
  }

  return `<aside class="docs-sidebar" aria-label="${isTr ? 'Dokümantasyon gezintisi' : 'Documentation navigation'}">
    <div class="docs-sidebar-inner">
      <div class="docs-sidebar-header">
        <span class="docs-badge">${isTr ? 'MESA DOKÜMANTASYON' : 'MESA DOCUMENTATION'}</span>
      </div>
      <nav class="docs-nav">
        ${sectionsHtml}
      </nav>
    </div>
  </aside>`;
}

export function renderDocPage(item, language = 'en', { base = './', assetBase = './', siteUrl, headerHtml, footerHtml }) {
  const isTr = language === 'tr';
  const { repoKey, repo, page } = item;
  const pageTitle = page.title[language] || page.title.en;
  const repoTitle = repo.title[language] || repo.title.en;
  const route = (p = '') => `${base}${p}`;

  // Render markdown content
  const rendered = renderMarkdown(page.raw_markdown, {
    base,
    route,
    skipH1: true
  });
  const tocHtml = generateTableOfContents(rendered.headings, {
    label: isTr ? 'Bu belgede' : 'In this document'
  });

  // Breadcrumbs
  const homeHref = route();
  const docsHubHref = route('docs/');
  const repoRootHref = route(repo.base_route);

  const breadcrumbs = `<nav class="breadcrumbs docs-breadcrumbs" aria-label="${isTr ? 'Konum' : 'Breadcrumbs'}">
    <ol>
      <li><a href="${homeHref}">${isTr ? 'Ana sayfa' : 'Home'}</a></li>
      <li><a href="${docsHubHref}">${isTr ? 'Dokümantasyon' : 'Docs'}</a></li>
      <li><a href="${repoRootHref}">${escapeHtml(repoTitle)}</a></li>
      <li aria-current="page">${escapeHtml(pageTitle)}</li>
    </ol>
  </nav>`;

  // Source & version meta bar
  const sourceUrl = `${repo.repo_url.replace(/\.git$/, '')}/blob/${repo.commit}/${page.src}`;
  const metaBar = `<div class="docs-meta-bar">
    <span class="docs-version-pill">${escapeHtml(repo.version)}</span>
    <span class="docs-commit-pill">commit: <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(repo.commit)}</a></span>
    <span class="docs-source-pill">source: <code>${escapeHtml(page.src)}</code></span>
  </div>`;

  // Find previous and next pages within this repo
  const pageIndex = repo.pages.findIndex((p) => p.slug === page.slug);
  const prevPage = pageIndex > 0 ? repo.pages[pageIndex - 1] : null;
  const nextPage = pageIndex < repo.pages.length - 1 ? repo.pages[pageIndex + 1] : null;

  let pageNavHtml = '<div class="docs-page-nav">';
  if (prevPage) {
    const prevTitle = prevPage.title[language] || prevPage.title.en;
    const prevHref = route(prevPage.route);
    pageNavHtml += `<a class="docs-page-prev" href="${prevHref}"><span class="nav-dir">← ${isTr ? 'Önceki' : 'Previous'}</span><span class="nav-title">${escapeHtml(prevTitle)}</span></a>`;
  } else {
    pageNavHtml += '<div class="docs-page-empty"></div>';
  }
  if (nextPage) {
    const nextTitle = nextPage.title[language] || nextPage.title.en;
    const nextHref = route(nextPage.route);
    pageNavHtml += `<a class="docs-page-next" href="${nextHref}"><span class="nav-dir">${isTr ? 'Sonraki' : 'Next'} →</span><span class="nav-title">${escapeHtml(nextTitle)}</span></a>`;
  }
  pageNavHtml += '</div>';

  const sidebarHtml = docsSidebar(page.route, language, { base });

  return `${headerHtml}
<main id="main-content" class="docs-layout">
  ${sidebarHtml}
  <div class="docs-main-container">
    <div class="docs-content-column">
      ${breadcrumbs}
      <article class="docs-article">
        <header class="docs-article-header">
          <p class="eyebrow">${escapeHtml(repoTitle)} · ${escapeHtml(repo.version)}</p>
          <h1>${escapeHtml(pageTitle)}</h1>
          ${metaBar}
        </header>
        <div class="docs-body">
          ${rendered.html}
        </div>
        ${pageNavHtml}
      </article>
    </div>
    <aside class="docs-toc-column" aria-label="${isTr ? 'İçindekiler' : 'Table of contents'}">
      ${tocHtml}
      <div class="docs-source-link">
        <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">
          <svg class="mesa-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
          <span>${isTr ? 'GitHub üzerinde kaynağı aç' : 'Open source on GitHub'}</span>
        </a>
      </div>
    </aside>
  </div>
</main>
${footerHtml}`;
}

export function renderDocsHub(language = 'en', { base = './', assetBase = './', siteUrl, headerHtml, footerHtml }) {
  const isTr = language === 'tr';
  const manifest = getDocsManifest();
  const route = (p = '') => `${base}${p}`;

  const repoCards = Object.entries(manifest.repositories).map(([key, repo]) => {
    const title = repo.title[language] || repo.title.en;
    const desc = repo.description[language] || repo.description.en;
    const rootRoute = repo.base_route;
    const pageCount = repo.pages.length;

    return `<article class="docs-hub-card">
      <div class="docs-hub-card-header">
        <span class="docs-hub-version">${escapeHtml(repo.version)}</span>
        <span class="docs-hub-count">${pageCount} ${isTr ? 'belge' : 'documents'}</span>
      </div>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(desc)}</p>
      <div class="docs-hub-links">
        ${repo.pages.slice(0, 4).map((p) => {
          const pTitle = p.title[language] || p.title.en;
          const pHref = route(p.route);
          return `<a href="${pHref}">${escapeHtml(pTitle)} →</a>`;
        }).join('')}
      </div>
      <div class="docs-hub-card-footer">
        <a class="button secondary" href="${route(rootRoute)}">${isTr ? 'Tüm belgeleri gör' : 'Explore all docs'}</a>
      </div>
    </article>`;
  }).join('');

  const sidebarHtml = docsSidebar('docs/', language, { base });

  return `${headerHtml}
<main id="main-content" class="docs-layout">
  ${sidebarHtml}
  <div class="docs-main-container">
    <div class="docs-content-column docs-hub-content">
      <section class="page-hero compact page-hero--functional docs-hero">
        <p class="eyebrow">${isTr ? 'DOKÜMANTASYON MERKEZİ' : 'DOCUMENTATION HUB'}</p>
        <h1>${isTr ? 'Kodu ve sözleşmeleri keşfedin.' : 'Find the contract.<br><em>Then run the code.</em>'}</h1>
        <p>${isTr ? 'MESA ekosistemindeki Core, Data, Law, QA ve E2E Certification bileşenlerinin resmî ve yerel dokümantasyonu.' : 'Authoritative in-website technical documentation across all five MESA repositories: Core, Data, Law, QA, and E2E Certification.'}</p>
      </section>

      <section class="section docs-hub-grid">
        ${repoCards}
      </section>

      <section class="section mcp-promo">
        <div class="mcp-promo-card">
          <p class="eyebrow">MODEL CONTEXT PROTOCOL</p>
          <h2>${isTr ? 'Model Context Protocol Entegrasyonu' : 'Model Context Protocol Integration'}</h2>
          <p>${isTr ? 'V3 uyumlu stdio sunucusu ve V4 gateway/köprü yollarının mimari detayları.' : 'Explore the legacy stdio server and current V4 HTTP gateway + local bridge specifications.'}</p>
          <a class="button primary" href="${route('docs/mcp/')}">${isTr ? 'MCP Kılavuzunu Aç' : 'Open MCP Guide'}</a>
        </div>
      </section>
    </div>
  </div>
</main>
${footerHtml}`;
}
