import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { changelogFeed, changelogPage } from '../render_changelog.mjs';

const root = new URL('../../', import.meta.url);
const read = path => JSON.parse(fs.readFileSync(new URL(path, root), 'utf8'));
const changelog = read('content/changelog.json');
const site = read('site-data.json');
const coreRepo = 'https://github.com/Yasou13/MESA';

test('the newest changelog entry is the published Core version', () => {
  assert.equal(changelog.releases[0].version, site.project.version);
});

test('releases run newest first and every text exists in both languages', () => {
  const dates = changelog.releases.map(release => release.date);
  assert.deepEqual(dates, [...dates].sort().reverse());
  assert.equal(new Set(changelog.releases.map(release => release.version)).size, changelog.releases.length);
  for (const release of changelog.releases) {
    assert.match(release.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(release.anchor, `${release.version.replaceAll('.', '')}---${release.date}`);
    const items = [release.summary, ...['new', 'improved', 'fixed', 'upgrade', 'limits'].flatMap(key => release[key] ?? [])];
    for (const item of items) assert.ok(item.en?.trim() && item.tr?.trim(), `Missing translation in ${release.version}`);
  }
});

test('page and feed render every release', () => {
  for (const language of ['en', 'tr']) {
    const page = changelogPage({ header: '', footer: '', language, base: '../', changelog, coreRepo });
    const feed = changelogFeed({ language, siteUrl: 'https://example.test/', changelog, coreRepo });
    for (const { version } of changelog.releases) {
      assert.ok(page.includes(`>v${version}</a>`));
      assert.ok(feed.includes(`<title>MESA v${version}</title>`));
    }
    assert.match(feed, /<\?xml-stylesheet type="text\/css" href="(\.\.\/)+changelog-feed\.css/);
    assert.doesNotMatch(feed, /text\/xsl/);
  }
});
