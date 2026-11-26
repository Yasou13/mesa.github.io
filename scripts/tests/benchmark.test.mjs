import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { comparison } from '../../dist/benchmark.js';
import { loadBenchmarkCatalog, validateBenchmarkCatalog } from '../benchmark_data.mjs';
import { benchmarkPage } from '../render_benchmark.mjs';

const catalog = await loadBenchmarkCatalog();
const [old, current] = catalog.releases;
assert.deepEqual(catalog.releases.map(release => release.version), ['0.9.0', '0.9.2', '0.9.3', '0.9.5']);
assert.deepEqual([...new Set(catalog.releases.map(release => release.suite))], ['tier-m-v1-test', 'tier-m-v2-test']);

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

// The overview leads with the newest release (benchmark v2) and keeps the v1
// releases as a separate block with their own comparison and reports.
for (const language of ['en', 'tr']) {
  const overview = benchmarkPage({ header: '', footer: '', language, base: '../', assetBase: '../', catalog });
  assert.match(overview, /BENCHMARK · MESA 0\.9\.5/);
  assert.match(overview, /id="latest"/);
  assert.match(overview, /id="earlier"/);
  assert.match(overview, /Colab L4/);
  assert.match(overview, language === 'en' ? /not comparable with earlier A100 runs; quality metrics are/ : /A100 koşularıyla karşılaştırılamaz/);
  assert.match(overview, language === 'en' ? /89\.9%/ : /%89,9/);
  assert.match(overview, /href="\.\.\/benchmark\/0\.9\.5\/"/);
  assert.doesNotMatch(overview, /<option value="0\.9\.5"/);
  assert.equal((overview.match(/class="bm-bars__group"/g) || []).length, 3);
  assert.equal((overview.match(/class="bm-bars__row"/g) || []).length, 9);
  for (const id of ['results', 'by-type', 'citations', 'ingest', 'limitations']) assert.match(overview, new RegExp(`id="${id}"`));
  for (const release of catalog.releases.filter(release => release.suite === 'tier-m-v1-test')) assert.match(overview, new RegExp(`benchmark/${release.version.replaceAll('.', '\\.')}/metrics\\.json`));
  assert.match(overview, /14\/29/);
  assert.doesNotMatch(overview, /Ollama/);
}
assert.match(report('0.9.3'), /12,0 dk/);
assert.match(report('0.9.3'), /%75,3/);
assert.match(report('0.9.3'), /mesa-memory 0\.9\.3/);
assert.doesNotMatch(report('0.9.2'), /14\/29|bm-strip--four/);
// 0.9.5 ran on an L4: every speed row names the GPU and the report keeps the run's note.
assert.match(report('0.9.5'), /%89,9/);
assert.match(report('0.9.5'), /1,76 sn<\/td><td>2,23 sn<\/td><td>Colab L4/);
assert.match(report('0.9.5'), /A100 koşularıyla karşılaştırılamaz; kalite ölçütleri karşılaştırılabilir/);
assert.match(report('0.9.5'), /149 \/ 173/);
assert.match(comparison(current, catalog.releases.at(-1), 'en'), /different test protocols/);

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
