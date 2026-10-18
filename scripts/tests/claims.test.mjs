import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root = new URL('../../', import.meta.url);
test('current claims retain external certification blockers and dated Law evidence', () => {
  const source=fs.readFileSync(new URL('scripts/render_site.mjs',root),'utf8');
  assert.doesNotMatch(source,/remain unverified until authoritative runtime, scoring, and metric producers|producers and a current valid final run remain absent/);
  assert.match(source,/B4\/B6\/B7\/B8/);assert.match(source,/Current Law HEAD CI reports failure/);
  assert.match(source,/2026-08-01/);assert.match(source,/Core 0.7.1/);
});
test('package versions and source commits are backed by immutable imports', () => {
  const manifest=JSON.parse(fs.readFileSync(new URL('content/docs/manifest.json',root),'utf8'));
  const sources=JSON.parse(fs.readFileSync(new URL('content/docs/sources.json',root),'utf8'));
  const site=JSON.parse(fs.readFileSync(new URL('site-data.json',root),'utf8'));
  assert.equal(sources.core.release_tag,`v${site.project.version}`);
  assert.equal(manifest.repositories.core.commit,sources.core.commit);
  assert.deepEqual(manifest.repositories.core.pages.map(page=>page.src),sources.core.allowlist.map(page=>page.src));
  for(const [key,repo] of Object.entries(manifest.repositories)) {
    assert.match(repo.commit,/^[a-f0-9]{40}$/);
    assert.equal(repo.version,key==='core'?'v0.8.1':'v0.1.0');
  }
});
