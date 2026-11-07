import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { comparison } from '../../dist/benchmark.js';
import { loadBenchmarkCatalog, validateBenchmarkCatalog } from '../benchmark_data.mjs';
import { benchmarkPage } from '../render_benchmark.mjs';

const catalog = await loadBenchmarkCatalog();
const [old, current] = catalog.releases;
assert.deepEqual(catalog.releases.map(release => release.version), ['0.9.0', '0.9.2']);

const en = comparison(old, current, 'en');
assert.match(en, /33\.1%/);
assert.match(en, /74\.4%/);
assert.match(en, /\+16\.5 pp/);
assert.match(en, /Unavailable/);
assert.doesNotMatch(en, /76\.0%|Offline experiments/);
assert.match(comparison(current, old, 'tr'), /[-−]16,5 yp/);
assert.match(comparison(old, old, 'en'), /different versions/);
assert.match(comparison(old, { ...current, suite: 'another' }, 'en'), /different test protocols/);

const report = version => benchmarkPage({
  header: '', footer: '', language: 'tr', base: '../../', assetBase: '../../../', catalog, version
});
assert.match(report('0.9.0'), /%51,7/);
assert.match(report('0.9.0'), /Çevrimdışı deneyler/);
assert.doesNotMatch(report('0.9.0'), /Atıf soruları/);
assert.match(report('0.9.2'), /%74,4/);
assert.match(report('0.9.2'), /Açık madde atfı \(50\)/);
assert.match(report('0.9.2'), /href="\.\.\/\.\.\/\.\.\/benchmark\/0\.9\.2\/metrics\.json"/);

const raw = await readFile(new URL('../../content/benchmark/catalog.json', import.meta.url));
const digest = createHash('sha256').update(raw).digest('hex');
const remote = {
  origin: 'https://example.supabase.co', digest,
  fetchCatalog: async (url, options) => {
    assert.equal(url.pathname, `/storage/v1/object/public/benchmark-reports/catalogs/${digest}.json`);
    assert.equal(options.redirect, 'error');
    return new Response(raw);
  }
};
assert.deepEqual(await loadBenchmarkCatalog(remote), catalog);
await assert.rejects(loadBenchmarkCatalog({ ...remote, fetchCatalog: async () => new Response('{}') }), /checksum mismatch/);
await assert.rejects(loadBenchmarkCatalog({ ...remote, fetchCatalog: async () => new Response(null, { status: 404 }) }), /HTTP 404/);
assert.throws(() => validateBenchmarkCatalog({ ...catalog, rawQuestions: [] }), /Invalid benchmark catalog/);
const duplicate = structuredClone(catalog);
duplicate.releases[0].configs[1].profile = 'off';
assert.throws(() => validateBenchmarkCatalog(duplicate), /configuration/);
