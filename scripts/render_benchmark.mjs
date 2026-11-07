import { comparison, compareVersions, escapeHtml as e, number, percent } from '../dist/benchmark.js';

export function benchmarkPage({ header, footer, language, base, assetBase, catalog, version }) {
  const tr = language === 'tr';
  const L = (en, turkish) => tr ? turkish : en;
  const releases = [...catalog.releases].sort((a, b) => compareVersions(b.version, a.version));
  const selected = version ? releases.find(release => release.version === version) : releases[0];
  const suite = catalog.suites[selected.suite];
  const link = suffix => `${base}benchmark/${suffix}`;
  const current = currentVersion => currentVersion === version ? ' aria-current="page"' : '';
  const navigation = `<nav class="bm-versions" aria-label="${L('Benchmark reports by version', 'Sürüme göre benchmark raporları')}">
    <a class="bm-version" href="${link('')}"${current(undefined)}>${L('Compare versions', 'Sürümleri karşılaştır')}</a>
    ${releases.map(release => `<a class="bm-version" href="${link(release.version + '/')}"${current(release.version)}>MESA ${release.version}</a>`).join('')}
  </nav>`;

  const metrics = `<details class="bm-details"><summary>${L('What do the metrics mean?', 'Ölçütler ne anlama geliyor?')}</summary>
    <dl class="bm-method">
      <div><dt>Hit@1 · Hit@5 · Hit@10</dt><dd>${L('Share of questions with the correct passage in the first 1, 5 or 10 results.', 'Doğru pasajın ilk 1, 5 veya 10 sonuçta bulunduğu soruların oranı.')}</dd></div>
      <div><dt>MRR</dt><dd>${L('Average reciprocal rank of the first correct passage. A score of 1 means it always came first.', 'İlk doğru pasajın 1/sıra değerinin ortalaması. Puan 1 ise doğru pasaj her seferinde ilk sıradadır.')}</dd></div>
      <div><dt>Doc@1 · Doc@5</dt><dd>${L('Share of questions with the correct document among the first 1 or 5 results.', 'Doğru belgenin ilk 1 veya 5 sonuçta bulunduğu soruların oranı.')}</dd></div>
      <div><dt>p50 · p95</dt><dd>${L('Half of queries finished within p50 and 95% within p95. Both are measured in seconds.', 'Sorguların yarısı p50, %95’i p95 süresi içinde tamamlandı. İkisi de saniye cinsinden ölçülür.')}</dd></div>
    </dl></details>`;
  const section = (id, title, body) => `<section class="section bm-section" id="${id}" aria-labelledby="bm-${id}"><h2 id="bm-${id}">${title}</h2>${body}</section>`;
  const method = section('method', L('How we measured', 'Nasıl ölçtük?'),
    `<p>${e(suite.method[language])}</p>${metrics}`);
  const limits = section('limitations', L('Scope and limitations', 'Kapsam ve sınırlar'),
    `<p>${e(suite.limits[language])}</p>`);
  const hero = (title, lead, tiles = '') => `<section class="page-hero bm-hero" aria-labelledby="bm-title">
    <p class="eyebrow">BENCHMARK · ${version ? 'MESA ' + version : 'MESA'}</p>
    <h1 id="bm-title">${title}</h1><p class="bm-hero__lead">${lead}</p>${navigation}${tiles}</section>`;

  let content;
  if (!version) {
    const reference = releases.find(release => release !== selected && release.suite === selected.suite) || releases[1];
    const opts = active => releases.map(release => `<option value="${release.version}"${release === active ? ' selected' : ''}>MESA ${release.version}</option>`).join('');
    const results = reference
      ? `<form id="benchmark-compare" class="bm-controls" hidden>
        <label for="bm-reference">${L('Reference version', 'Referans sürüm')}<select id="bm-reference" name="reference">${opts(reference)}</select></label>
        <label for="bm-version">${L('Selected version', 'Seçilen sürüm')}<select id="bm-version" name="version">${opts(selected)}</select></label>
        </form>
        <div id="benchmark-comparison" aria-live="polite">${comparison(reference, selected, language)}</div>
        <script type="application/json" id="benchmark-data">${JSON.stringify(releases).replaceAll('<', '\\u003c')}</script>`
      : `<p class="bm-note">${L('Comparison becomes available when two releases have reports.', 'İki sürümün raporu yayımlandığında karşılaştırma açılır.')}</p>`;
    content = hero(L('Turkish legal retrieval benchmark', 'Türkçe hukuk metinlerinde arama benchmark’ı'),
      L('Compare how MESA versions find the right passage, or open a version report for test conditions and detailed results.',
        'MESA sürümlerinin doğru pasajı bulma başarısını karşılaştır. Test koşulları ve ayrıntılı sonuçlar için bir sürüm raporunu aç.'))
      + section('results', L('Compare results', 'Sonuçları karşılaştır'), results) + method + limits;
  } else {
    content = hero(L(`MESA ${version} benchmark report`, `MESA ${version} benchmark raporu`),
      e(selected.summary[language]), stats(selected, language))
      + report({ selected, suite, language, section, assetBase }) + method + limits;
  }

  return `${header}<main id="main-content" class="benchmark-page">${content}${footer}</main>`;
}

function stats(release, language) {
  const L = (en, tr) => language === 'tr' ? tr : en;
  const config = release.configs.find(row => row.id === release.featured);
  const tiles = [
    [percent(config.metrics.hit5, language), 'Hit@5', L('Correct passage in the first five results', 'Doğru pasaj ilk beş sonuçta')],
    [percent(config.metrics.hit1, language), 'Hit@1', L('Correct passage in the first result', 'Doğru pasaj ilk sırada')],
    [number(config.metrics.mrr, language, 3), 'MRR', L('Ranking of the first correct passage', 'İlk doğru pasajın sırası')]
  ];
  return `<div class="bm-stats">${tiles.map(([value, label, text]) => `<div class="bm-stat">
    <p class="bm-stat__value">${value}</p><p class="bm-stat__name">${label}</p>
    <p class="bm-stat__text">${text}</p><p class="bm-stat__scope">${e(config.label[language])}</p></div>`).join('')}</div>`;
}

function report({ selected, suite, language, section, assetBase }) {
  const L = (en, tr) => language === 'tr' ? tr : en;
  const label = id => e(selected.configs.find(row => row.id === id).label[language]);
  const seconds = value => value === null ? '—' : `${number(value, language, 2)} ${L('s', 'sn')}`;
  const configuration = L('Configuration', 'Yapılandırma');
  const categoryNames = {
    exact: L('Exact wording', 'Birebir ifade'),
    paraphrase: L('Paraphrase', 'Farklı ifade'),
    cross_document: L('Cross-document', 'Belgeler arası'),
    number_date_docket: L('Number, date or docket', 'Sayı, tarih veya esas no')
  };
  const table = (caption, columns, body) => `<div class="table-scroll bm-table" tabindex="0" role="region" aria-label="${caption}">
    <table><caption>${caption}</caption><thead><tr>${columns.map(col => `<th scope="col">${col}</th>`).join('')}</tr></thead>
    <tbody>${body}</tbody></table></div>`;
  const cells = values => values.map(value => `<td>${value}</td>`).join('');
  const groups = [selected.configs.filter(row => !row.experiment), selected.configs.filter(row => row.experiment)];
  const resultTables = groups.filter(group => group.length).map(group =>
    table(group[0].experiment ? L('Offline experiments', 'Çevrimdışı deneyler') : L('Built-in configurations', 'Yerleşik yapılandırmalar'),
      [configuration, 'Hit@5', 'Hit@1', 'MRR', 'Hit@10', 'Doc@1', 'Doc@5', 'p50', 'p95', L('Hardware', 'Donanım')],
      group.map(({ id, gpu, source, metrics: m }) => `<tr><th scope="row">${label(id)}<small>${e(source)}</small></th>${cells([
        percent(m.hit5, language), percent(m.hit1, language), number(m.mrr, language, 3), percent(m.hit10, language),
        percent(m.doc1, language), percent(m.doc5, language), seconds(m.p50), seconds(m.p95), e(gpu)
      ])}</tr>`).join(''))
  ).join('');
  const date = new Intl.DateTimeFormat(language, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(selected.date));
  const citation = selected.citations;
  return section('results', L('Search results', 'Arama sonuçları'),
    `<p class="bm-note">${date} · ${suite.documents} ${L('documents', 'belge')} · ${suite.answerable} / ${suite.test} ${L('answerable test questions', 'cevaplanabilir test sorusu')}</p>
    ${resultTables}<ul class="bm-footnotes">${selected.notes.map(note => `<li>${e(note[language])}</li>`).join('')}</ul>`)
  + section('by-type', L('Results by question type', 'Soru türüne göre sonuçlar'),
    table(L('Correct passage in the first five results', 'Doğru pasaj ilk beş sonuçta'),
      [L('Question type', 'Soru türü'), ...selected.configs.map(row => label(row.id))],
      Object.entries(suite.questionTypes).map(([type, count]) => `<tr><th scope="row">${categoryNames[type]} (${count})</th>
        ${cells(selected.configs.map(row => percent(row.byType[type], language)))}</tr>`).join('')))
  + (citation ? section('citations', L('Citation questions', 'Atıf soruları'),
    table(L('Citation questions, Hit@5', 'Atıf sorularında Hit@5'),
      [configuration, L(`Explicit citation (${citation.namedCount})`, `Açık madde atfı (${citation.namedCount})`),
        L(`Natural wording (${citation.naturalCount})`, `Doğal ifade (${citation.naturalCount})`)],
      citation.rows.map(row => `<tr><th scope="row">${label(row.config)}</th>${cells([
        percent(row.named, language), percent(row.natural, language)
      ])}</tr>`).join(''))) : '')
  + (selected.ingest.length ? section('ingest', L('Time until searchable', 'Belgelerin aramaya hazır olma süresi'),
    table(L('Full corpus ingestion', 'Derlemin tamamının içe alınması'), [
      configuration, L('Total time', 'Toplam süre'), L('Chunks', 'Parça'), L('Hardware', 'Donanım')
    ], selected.ingest.map(row => `<tr><th scope="row">${label(row.config)}</th>${cells([
      `${number(row.minutes, language, 1)} ${L('min', 'dk')}`, number(row.chunks, language, 0),
      e(selected.configs.find(config => config.id === row.config).gpu)
    ])}</tr>`).join(''))) : '')
  + section('data', L('Download results', 'Sonuçları indir'),
    `<a class="text-link" href="${assetBase}benchmark/${selected.version}/metrics.json" download>${L('Report and aggregate metrics (JSON)', 'Rapor ve toplu metrikler (JSON)')} ↓</a>`);
}
