import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getAllDocRoutes, renderDocPage, renderDocsHub } from '../render_docs.mjs';
const root = new URL('../../', import.meta.url);
const catalog = JSON.parse(fs.readFileSync(new URL('content/docs/guides.json',root),'utf8'));

test('all Core routes have a paired guide at the same immutable release baseline', () => {
  const routes=getAllDocRoutes();
  assert.equal(new Set(routes.map(item=>item.path)).size,routes.length);
  for(const item of routes.filter(item=>item.repoKey==='core')) {
    assert.equal(item.repo.commit,catalog.baseline);
    assert.ok(catalog.guides.some(guide=>guide.route===item.path),item.path);
  }
  for(const guide of catalog.guides) {
    const texts=['en','tr'].map(lang=>fs.readFileSync(new URL(`content/docs/guides/${lang}/${guide.id}.md`,root),'utf8'));
    assert.notEqual(texts[0],texts[1],guide.id);
    assert.equal((texts[0].match(/^## /gm)||[]).length,(texts[1].match(/^## /gm)||[]).length,guide.id);
    const snippets=text=>[...text.matchAll(/```[^\n]*\n([\s\S]*?)```/g)].map(match=>match[1]);
    assert.deepEqual(snippets(texts[0]),snippets(texts[1]),guide.id);
  }
});

test('localized docs keep source anchors and copy targets without duplicate IDs', () => {
  for(const item of getAllDocRoutes()) for(const language of ['en','tr']) {
    const html=renderDocPage(item,language,{base:'../../../',assetBase:'../../../',siteUrl:'https://mesamemory.dev/',headerHtml:'',footerHtml:''});
    const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
    assert.equal(new Set(ids).size,ids.length,`${item.path} ${language}`);
    for(const match of html.matchAll(/(?:href="#|data-copy-target=")([^"]+)"/g)) assert.ok(ids.includes(match[1]),`${item.path} ${language}: ${match[1]}`);
    if(language==='tr') {
      assert.doesNotMatch(html,/>Copy<|aria-label="Link to section|>MCP Integration</);
    }
    // Guides that declare no appendix sections intentionally show only their source links.
    const guide=catalog.guides.find(g=>g.route===item.path);
    if(guide?.appendixSections?.length===0) assert.doesNotMatch(html,/id="source-reference"/);
    else assert.match(html,/id="source-reference"/);
  }
});


test('docs hub has localized entry points and resolvable section links in both deployment modes', () => {
  for (const language of ['en', 'tr']) for (const base of ['../', '/mesa.github.io/']) {
    const html = renderDocsHub(language, {base, headerHtml: ''});
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), match[1]);
    for (const repo of ['core', 'data', 'law', 'qa', 'e2e']) assert.ok(html.includes(`href="${base}docs/${repo}/"`));
    assert.match(html, /<details class="docs-navigation" open>/); // Navigation survives without JavaScript.
    assert.equal(html.match(/<h[1-6]\b/)[0], '<h1');
    assert.ok(html.includes(language === 'tr' ? 'Ajanlarınıza hafıza kazandırın.' : 'Give your agents memory.'));
    assert.ok(html.includes(language === 'tr' ? 'Sayfayı kopyala' : 'Copy page'));
  }
});

test('page copy contains localized Markdown and its immutable source', () => {
  const item = getAllDocRoutes().find(item => item.path === 'docs/core/getting-started/');
  for (const language of ['en', 'tr']) {
    const html = renderDocPage(item, language, {base:'../../../', headerHtml:''});
    const copy = JSON.parse(html.match(/<script type="application\/json" data-doc-copy>([\s\S]*?)<\/script>/)[1]);
    const guide = fs.readFileSync(new URL(`content/docs/guides/${language}/getting-started.md`, root),'utf8');
    assert.ok(copy.includes(guide));
    assert.ok(copy.includes(`/blob/${catalog.baseline}/`));
    assert.ok(copy.includes('uv sync --locked --python 3.10'));
  }
});
