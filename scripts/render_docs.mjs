// Modular documentation renderer for MESA Native Documentation
// Renders hierarchical multi-repository documentation for Core, Data, Law, QA, E2E, and MCP.

import fs from 'node:fs';
import { docsSidebar as sharedSidebar, docsTabs, docsCopyButton, docsFooter, docsFrame, hubContent } from './docs_ui.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderMarkdown, generateTableOfContents, escapeHtml } from './markdown_engine.mjs';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(scriptDirectory);
const guideCatalog = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'content/docs/guides.json'), 'utf8'));
const guideByRoute = new Map(guideCatalog.guides.map(guide => [guide.route, guide]));
const manifestPath = path.join(repositoryRoot, 'content', 'docs', 'manifest.json');

let cachedManifest = null;
export function getDocsManifest() {
  if (cachedManifest) return cachedManifest;
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Documentation manifest missing at ${manifestPath}. Run scripts/sync_docs.py first.`);
  }
  cachedManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const core = cachedManifest.repositories.core;
  if (core.commit !== guideCatalog.baseline) throw new Error("Guide baseline differs from imported Core release");
  for (const guide of guideCatalog.guides) {
    const existing = core.pages.find(page => page.route === guide.route);
    if (existing) existing.title = guide.title;
    else {
      const source = core.pages.find(page => page.src === guide.sources[0]);
      if (!source) throw new Error(`Missing guide source: ${guide.id}`);
      core.pages.push({ ...source, title: guide.title, route: guide.route, slug: guide.route.split('/').filter(Boolean).at(-1), derivedGuide: true });
    }
  }
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
  return sharedSidebar(getDocsManifest(), currentRoute, language, {base, guides: guideByRoute});
}

export function renderDocPage(item, language = 'en', { base = './', assetBase = './', siteUrl, headerHtml, footerHtml }) {
  const isTr = language === 'tr';
  const { repoKey, repo, page } = item;
  const pageTitle = page.title[language] || page.title.en;
  const repoTitle = repo.title[language] || repo.title.en;
  const route = (p = '') => `${base}${p}`;

  const guide = guideByRoute.get(page.route);
  const sourceRendered = renderMarkdown(page.raw_markdown, {base, route, skipH1: true, language});
  const repositoryNotes = {
    data: ['MESA Data prepares reviewed Turkish legal sources through acquisition, canonicalization, validation and immutable release publication. Staging or HTTP 202 does not prove delivery into Core. Its package version and release tag are separate facts.', 'MESA Data, Türk hukuk kaynaklarını toplar, korur, ortak biçime dönüştürür ve doğrulayıp yayına hazırlar. Hazırlık ortamındaki başarı veya HTTP 202 yanıtı, verinin Core’a ulaştığını göstermez. Paket sürümü ile yayın etiketi de ayrı bilgilerdir.'],
    law: ['Law consumes the V4 HTTP contract for matters, documents and source-backed workflows. Current live Core integration remains unverified; current HEAD CI is failing. The dated Law-side pass used Core 0.7.1. Research, draft and rebuild surfaces are not completed capabilities.', 'Law, hukuk dosyaları ve belgeler için V4 HTTP arayüzünü kullanır. Güncel canlı Core bağlantısı doğrulanmadı; en son kodun CI kontrolleri başarısız. Önceki başarılı Law testleri Core 0.7.1 ile yapıldı. Araştırma, taslak üretimi ve yeniden oluşturma özellikleri henüz tamamlanmış değildir.'],
    qa: ['QA exercises behavior, persistence and restarts outside the baseline checkout. A harness PASS does not make the candidate correct. The latest first-write INVALID_ARGUMENT and older candidate FAIL remain dated evidence; no current production approval is implied.', 'QA, asıl kod kopyasından ayrı bir ortamda davranışı, kalıcılığı ve yeniden başlatmayı test eder. Test düzeneğinin PASS vermesi, adayın bütün koşulları sağladığını göstermez. İlk yazmada alınan INVALID_ARGUMENT ve eski aday FAIL sonucu, ilgili tarihlerdeki kayıtlardır; güncel canlı kullanım onayı değildir.'],
    e2e: ['Profile B evaluates a frozen Data → Core transaction with independent receipts and fail-closed gates. Official execution and metric producers exist. External B4/B6/B7/B8 evidence and a fresh official PASS remain absent; historical results are not current certification.', 'Profile B, veri ve ayarları sabitlenmiş Data → Core akışını bağımsız işlem alındılarıyla değerlendirir; doğrulanamayan koşullarda ilerlemez. Resmî çalıştırma ve ölçüm bileşenleri hazır, ancak B4/B6/B7/B8 için dış kanıtlar ve yeni bir resmî PASS sonucu henüz yoktur. Eski sonuçlar güncel sertifikasyon sayılmaz.']
  };
  const note = repositoryNotes[repoKey]?.[isTr ? 1 : 0];
  const guideMarkdown = guide ? fs.readFileSync(path.join(repositoryRoot, 'content/docs/guides', language, `${guide.id}.md`), 'utf8') : `## ${isTr ? 'Bu belgenin kapsamı' : 'Scope of this document'}\n\n${note}\n\n${isTr ? 'Aşağıda özgün belgeyi, komutları ve varsa test kayıtlarını kendi dilinde okuyabilirsiniz. Sonuçlar yalnızca belgede belirtilen tarih ve koşullar için geçerlidir.' : 'The original reference below preserves this page’s complete contract, commands or dated evidence in its source language. Test outcomes apply only within their stated date and conditions.'}`;
  const rendered = renderMarkdown(guideMarkdown, {
    base,
    route,
    skipH1: true, language
  });
  // Guide anchors have their own namespace; original source anchors stay stable.
  rendered.html = rendered.html.replace(/id="([^"]+)"/g, 'id="guide-$1"').replace(/href="#([^"]+)"/g, 'href="#guide-$1"').replace(/data-copy-target="([^"]+)"/g, 'data-copy-target="guide-$1"');
  for (const heading of rendered.headings) heading.id = `guide-${heading.id}`;
  const guideTocHtml = generateTableOfContents(rendered.headings, {label: isTr ? 'Bu rehberde' : 'In this guide'});
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
    <span class="docs-commit-pill">commit: <a href="${sourceUrl}" title="${escapeHtml(repo.commit)}" target="_blank" rel="noopener noreferrer">${escapeHtml(repo.commit.slice(0, 7))}</a></span>
    <span class="docs-source-pill">${isTr ? 'kaynak' : 'source'}: <code>${escapeHtml(page.src)}</code></span>
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
  ${docsTabs(page.route, language, base)}
  ${sidebarHtml}
  <div class="docs-main-container">
    <div class="docs-content-column">
      ${breadcrumbs}
      <article class="docs-article" data-doc-copy-content>
        <header class="docs-article-header">
          <p class="eyebrow">${escapeHtml(repoTitle)} · ${escapeHtml(repo.version)}</p>
          <div class="docs-title-row"><h1>${escapeHtml(pageTitle)}</h1>${docsCopyButton(isTr)}</div>
          ${metaBar}
          <p class="docs-language-notice">${isTr ? 'Bu rehberin Türkçe ve İngilizce sürümleri aynı konuyu açıklar. Özgün belgeyi aşağıdaki kaynak bölümünde kendi dilinde okuyabilirsiniz. Paketin yayımlanması, canlı kullanım için onaylandığı anlamına gelmez.' : 'This guide has equivalent English and Turkish explanations. The complete source reference is preserved below in its original language. Package version is not production certification.'}</p>
          ${/audit|verification|closure/i.test(page.src) ? `<p class="docs-language-notice">${isTr ? 'Bu kaynak, belirtilen tarihteki testleri kaydeder. Burada paylaşılması, testlerin bu site için yeniden çalıştırıldığı anlamına gelmez.' : 'This document contains dated source evidence. Its reported test results are not a fresh execution by this website audit.'}</p>` : ''}
        </header>
        <div class="docs-body">
          ${rendered.html}
          <div class="guide-source-list"><strong>${isTr ? 'Dayanak kaynaklar' : 'Verified sources'}</strong><ul>${(guide?.sources || [page.src]).map(src => `<li><a href="${repo.repo_url.replace(/\.git$/, '')}/blob/${repo.commit}/${src}" target="_blank" rel="noopener noreferrer"><code>${escapeHtml(src)}</code></a></li>`).join('')}</ul></div>
          <details class="source-appendix" id="source-reference"><summary>${isTr ? 'Özgün belgenin tamamı' : 'Complete source reference · original language'}</summary><p class="docs-language-notice">${isTr ? 'Bu bölüm, kaynak belgenin değiştirilmemiş metnini içerir. Kaynak içindeki bir bölüme giden bağlantıyı açtığınızda metin otomatik olarak görünür.' : 'This appendix retains the original source text, separately from the localized guide. Source section links open the appendix automatically.'}</p><div class="source-reference-body">${sourceRendered.html}</div></details>
        </div>
        ${pageNavHtml}
      </article>
    </div>
    <div class="docs-toc-column" aria-label="${isTr ? 'İçindekiler' : 'Table of contents'}">
      ${guideTocHtml}
      <div class="docs-source-link">
        <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">
          <svg class="mesa-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>
          <span>${isTr ? 'GitHub üzerinde kaynağı aç' : 'Open source on GitHub'}</span>
        </a>
      </div>
    </div>
  </div>
</main>
<script type="application/json" data-doc-copy>${JSON.stringify(`# ${pageTitle}\n\n${guideMarkdown}\n\n${sourceUrl}`).replaceAll('<', '\\u003c')}</script>
${docsFooter(isTr, base)}`;
}

export function renderDocsHub(language = 'en', {base = './', headerHtml}) {
  const manifest = getDocsManifest();
  return docsFrame({manifest, currentRoute: 'docs/', language, base, guides: guideByRoute, headerHtml, ...hubContent(manifest, language, base)});
}

export function renderMcpGuide(language = 'en', {base = './', headerHtml, body}) {
  const isTr = language === 'tr';
  const headings = [
    {id: 'integration-paths', title: isTr ? 'Entegrasyon yolları' : 'Integration paths', level: 2},
    {id: 'bridge-tools', title: isTr ? 'V4 köprü araçları' : 'V4 bridge tools', level: 2},
    {id: 'boundary-notes', title: isTr ? 'Sınırlar ve güvenlik' : 'Boundaries & security', level: 2}
  ];
  const content = `<article class="docs-article docs-mcp-content" data-doc-copy-content>${body.replace(/<h1>([\s\S]*?)<\/h1>/, (_, title) => `<div class="docs-title-row"><h1>${title}</h1>${docsCopyButton(isTr)}</div>`)}</article>`;
  return docsFrame({manifest: getDocsManifest(), currentRoute: 'docs/mcp/', language, base, guides: guideByRoute, headerHtml, content, toc: generateTableOfContents(headings, {label: isTr ? 'Bu sayfada' : 'On this page'})});
}
