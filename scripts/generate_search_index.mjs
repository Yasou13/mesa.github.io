// Build-time static search index generator for MESA
// Indexes Learn articles, native documentation pages, and ecosystem sections
// Outputs search-index.json for client-side instant search.

import fs from 'node:fs';
import { getDocsManifest } from './render_docs.mjs';
import { lessonSearchRecord } from './render_learn.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(scriptDirectory);

export function buildSearchIndex() {
  const index = [];

  // 1. Hub articles from content/hub.json
  const hubPath = path.join(repositoryRoot, 'content', 'hub.json');
  if (fs.existsSync(hubPath)) {
    const hub = JSON.parse(fs.readFileSync(hubPath, 'utf8'));
    for (const entry of hub.entries) {
      if (!entry.indexable || entry.draft) continue;
      for (const lang of ['en', 'tr']) {
        const loc = entry.locales?.[lang];
        const seo = entry.seo?.[lang];
        if (!loc) continue;

        const url = lang === 'tr' ? `tr/${entry.path}` : entry.path;
        index.push({
          id: `${entry.id}-${lang}`,
          url,
          title: loc.title,
          section: entry.type === 'learn' ? 'Learn' : entry.type.charAt(0).toUpperCase() + entry.type.slice(1),
          category: entry.category || 'General',
          summary: loc.summary || loc.shortAnswer || seo?.description || '',
          keywords: entry.tags || [],
          language: lang,
          ...(entry.type === 'learn' ? {
            content: lessonSearchRecord(entry,lang).sections.map(s=>`${s.title} ${s.text}`).join(' '),
            sections: lessonSearchRecord(entry,lang).sections,
          } : {})
        });
      }
    }
  }

  // 2. Documentation pages from content/docs/manifest.json
  const docsPath = path.join(repositoryRoot, 'content', 'docs', 'manifest.json');
  if (fs.existsSync(docsPath)) {
    const manifest = getDocsManifest();
    for (const [repoKey, repo] of Object.entries(manifest.repositories)) {
      const repoTitleEn = repo.title?.en || repoKey;
      const repoTitleTr = repo.title?.tr || repoTitleEn;

      for (const page of repo.pages) {
        for (const lang of ['en', 'tr']) {
          const title = page.title?.[lang] || page.title?.en;
          const url = lang === 'tr' ? `tr/${page.route}` : page.route;
          const sectionTitle = lang === 'tr' ? `Docs · ${repoTitleTr}` : `Docs · ${repoTitleEn}`;

          index.push({
            id: `doc-${repoKey}-${page.slug || 'index'}-${lang}`,
            url,
            title,
            section: sectionTitle,
            category: repoTitleEn,
            summary: lang === 'tr' ? `${title} · ${repoTitleTr} rehberi (${repo.version})` : `${title} · ${repoTitleEn} guide (${repo.version})`,
            keywords: [repoKey, 'docs', repo.version, ...(page.headings ? page.headings.map(h => h.title) : [])],
            language: lang
          });
        }
      }
    }
  }

  // 3. Core Pages
  const siteDataPath = path.join(repositoryRoot, 'site-data.json');
  const trContentPath = path.join(repositoryRoot, 'content', 'tr.json');
  if (fs.existsSync(siteDataPath) && fs.existsSync(trContentPath)) {
    const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf8'));
    const trContent = JSON.parse(fs.readFileSync(trContentPath, 'utf8'));

    for (const [pageKey, meta] of Object.entries(siteData.pages)) {
      if (meta.path === 'docs/') continue; // handled above

      // English
      index.push({
        id: `core-${pageKey}-en`,
        url: meta.path,
        title: meta.title,
        section: 'Ecosystem',
        category: 'Core',
        summary: meta.description,
        keywords: [pageKey, 'mesa', 'memory'],
        language: 'en'
      });

      // Turkish
      const trMeta = trContent.pages?.[pageKey];
      if (trMeta) {
        index.push({
          id: `core-${pageKey}-tr`,
          url: `tr/${meta.path}`,
          title: trMeta.title,
          section: 'Ekosistem',
          category: 'Core',
          summary: trMeta.description,
          keywords: [pageKey, 'mesa', 'hafıza'],
          language: 'tr'
        });
      }
    }
  }

  return index;
}

export function writeSearchIndex(outputDirectory) {
  const index = buildSearchIndex();
  const outputPath = path.join(outputDirectory, 'search-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2), 'utf8');
  console.log(`Generated static search index at ${outputPath} with ${index.length} items`);
  return index;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const outDir = process.argv[2] || path.join(repositoryRoot, 'dist');
  writeSearchIndex(path.resolve(outDir));
}
