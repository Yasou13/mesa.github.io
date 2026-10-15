import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getAllDocRoutes, renderDocPage } from '../render_docs.mjs';
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
    assert.match(html,/id="source-reference"/);
  }
});
