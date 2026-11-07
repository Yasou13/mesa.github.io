import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const localCatalog = new URL('../content/benchmark/catalog.json', import.meta.url);
const metricKeys = ['mrr', 'hit1', 'hit5', 'hit10', 'doc1', 'doc5', 'p50', 'p95'];
const profiles = ['off', 'embedding', 'reranker'];

function requireValid(condition, detail) {
  if (!condition) throw new Error(`Invalid benchmark catalog: ${detail}`);
}

function exactKeys(value, keys) {
  return value && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
}

const localized = value => exactKeys(value, ['en', 'tr'])
  && [value.en, value.tr].every(text => typeof text === 'string' && text.trim());
const count = value => Number.isSafeInteger(value) && value > 0;
const decimal = value => typeof value === 'string' && /^\d+(\.\d+)?$/.test(value) && Number.isFinite(Number(value));
const ratio = value => decimal(value) && Number(value) <= 1;
const identifier = value => typeof value === 'string' && /^[a-z0-9][a-z0-9-]*$/i.test(value);
const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function validateBenchmarkCatalog(catalog) {
  requireValid(exactKeys(catalog, ['schemaVersion', 'suites', 'releases']) && catalog.schemaVersion === 1
    && catalog.suites && typeof catalog.suites === 'object' && !Array.isArray(catalog.suites)
    && Array.isArray(catalog.releases) && catalog.releases.length > 0, 'schema');
  for (const [id, suite] of Object.entries(catalog.suites)) {
    requireValid(identifier(id) && exactKeys(suite, ['documents', 'dev', 'test', 'answerable', 'questionTypes', 'method', 'limits'])
      && [suite.documents, suite.dev, suite.test, suite.answerable].every(count) && suite.answerable <= suite.test
      && localized(suite.method) && localized(suite.limits), `suite ${id}`);
    const types = ['exact', 'paraphrase', 'cross_document', 'number_date_docket'];
    requireValid(exactKeys(suite.questionTypes, types) && Object.values(suite.questionTypes).every(count)
      && Object.values(suite.questionTypes).reduce((sum, size) => sum + size, 0) === suite.answerable, `question types in ${id}`);
  }

  const versions = new Set();
  for (const release of catalog.releases) {
    requireValid(exactKeys(release, ['version', 'date', 'suite', 'featured', 'configs', 'summary', 'notes', 'ingest', 'citations'])
      && typeof release.version === 'string' && versionPattern.test(release.version) && !versions.has(release.version)
      && typeof release.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(release.date)
      && !Number.isNaN(Date.parse(release.date)) && new Date(release.date).toISOString().slice(0, 10) === release.date
      && typeof release.suite === 'string' && Object.hasOwn(catalog.suites, release.suite) && localized(release.summary)
      && Array.isArray(release.notes) && release.notes.every(localized)
      && Array.isArray(release.configs) && Array.isArray(release.ingest), 'release metadata');
    versions.add(release.version);
    const configs = new Map();
    const seenProfiles = new Set();
    for (const row of release.configs) {
      const keys = ['id', 'label', 'gpu', 'source', 'profile', 'experiment', 'metrics', 'byType'];
      requireValid(exactKeys(row, keys) && identifier(row.id) && !configs.has(row.id) && localized(row.label)
        && [row.gpu, row.source].every(value => typeof value === 'string' && value.trim())
        && typeof row.experiment === 'boolean' && (row.profile === null
          || (profiles.includes(row.profile) && !row.experiment && !seenProfiles.has(row.profile))), `configuration in ${release.version}`);
      requireValid(exactKeys(row.metrics, metricKeys) && metricKeys.every(key => key.startsWith('p')
        ? row.metrics[key] === null || decimal(row.metrics[key]) : ratio(row.metrics[key]))
        && exactKeys(row.byType, Object.keys(catalog.suites[release.suite].questionTypes))
        && Object.values(row.byType).every(ratio), `metrics in ${release.version}/${row.id}`);
      configs.set(row.id, row);
      seenProfiles.add(row.profile);
    }
    requireValid(configs.has(release.featured) && !configs.get(release.featured).experiment, `featured configuration in ${release.version}`);
    requireValid(release.ingest.every(row => exactKeys(row, ['config', 'minutes', 'chunks'])
      && configs.has(row.config) && decimal(row.minutes) && count(row.chunks)), `ingestion in ${release.version}`);
    if (release.citations !== null) {
      const citations = release.citations;
      requireValid(exactKeys(citations, ['namedCount', 'naturalCount', 'rows']) && count(citations.namedCount)
        && count(citations.naturalCount) && Array.isArray(citations.rows) && citations.rows.length
        && citations.rows.every(row => exactKeys(row, ['config', 'named', 'natural']) && configs.has(row.config)
          && ratio(row.named) && ratio(row.natural)), `citations in ${release.version}`);
    }
  }
  return catalog;
}

export async function loadBenchmarkCatalog({ origin, digest, fetchCatalog = fetch } = {}) {
  if (!digest) return validateBenchmarkCatalog(JSON.parse(await readFile(localCatalog, 'utf8')));
  const url = new URL(origin);
  if (!/^[a-f0-9]{64}$/.test(digest) || url.href !== url.origin + '/' || url.protocol !== 'https:'
    || url.username || url.password) throw new Error('Invalid Supabase benchmark build configuration');
  const path = `/storage/v1/object/public/benchmark-reports/catalogs/${digest}.json`;
  const response = await fetchCatalog(new URL(path, url), { redirect: 'error', signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Supabase benchmark catalog returned HTTP ${response.status}`);
  const data = Buffer.from(await response.arrayBuffer());
  if (createHash('sha256').update(data).digest('hex') !== digest) throw new Error('Supabase benchmark catalog checksum mismatch');
  return validateBenchmarkCatalog(JSON.parse(data.toString('utf8')));
}
