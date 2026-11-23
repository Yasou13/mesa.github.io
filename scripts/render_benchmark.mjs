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
    <a class="bm-version" href="${link('research/')}">${L('Data and examples', 'Veriler ve örnekler')}</a>
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
  const currentReport = selected.version === '0.9.3';
  const limits = section('limitations', L('Scope and limitations', 'Kapsam ve sınırlar'),
    `<p>${e(suite.limits[language])}</p>${currentReport ? currentLimitations(language) : ''}`);
  const hero = (title, lead, tiles = '') => `<section class="page-hero bm-hero" aria-labelledby="bm-title">
    <p class="eyebrow">BENCHMARK · ${'MESA ' + (version || selected.version)}</p>
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
      currentReport ? e(selected.summary[language]) : L('Compare how MESA versions find the right passage, or open a version report for test conditions and detailed results.',
        'MESA sürümlerinin doğru pasajı bulma başarısını karşılaştır. Test koşulları ve ayrıntılı sonuçlar için bir sürüm raporunu aç.'))
      + section('compare', L('Compare results', 'Sonuçları karşılaştır'), results)
      + (currentReport ? overview({ releases, suite, language, section, assetBase }) : '') + method + limits;
    content = content.replace('</section>', `${stats(selected, language)}</section>`);
  } else {
    content = hero(L(`MESA ${version} benchmark report`, `MESA ${version} benchmark raporu`),
      e(selected.summary[language]), stats(selected, language))
      + report({ selected, suite, language, section, assetBase }) + method + limits;
  }

  if (currentReport) content += `<p class="bm-note">${L('0.9.3 run: 18 November 2026 · mesa-memory 0.9.3 · 20261117T230132Z_v093. These results do not describe 0.9.4, which changed search defaults.', '0.9.3 koşusu: 18 Kasım 2026 · mesa-memory 0.9.3 · 20261117T230132Z_v093. Bu sonuçlar, arama varsayılanlarını değiştiren 0.9.4’ü anlatmaz.')}</p>`;

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
  if (release.version === '0.9.3') tiles.push([percent(release.citations.rows.find(row => row.config === release.featured).named, language), L('Citation Hit@5', 'Atıf Hit@5'), L('Explicit citation questions', 'Açık madde atfı soruları')]);
  return `<div class="bm-strip${release.version === '0.9.3' ? ' bm-strip--four' : ''}"><div class="bm-strip__items">${tiles.map(([value, label, text]) => `<div class="bm-strip__item">
    <p class="bm-strip__value">${value}</p><p class="bm-strip__name">${label}</p><p class="bm-strip__text">${text}</p></div>`).join('')}</div>
    <p class="bm-strip__scope">MESA ${e(release.version)} · ${e(config.label[language])}</p></div>`;
}

function report({ selected, suite, language, section, assetBase, overview = false }) {
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
  // Heat map: the cell tone follows the value in ten steps (classes, because the CSP blocks inline styles).
  const heat = (value, text) => `<td class="bm-heat bm-heat--${Math.min(9, Math.floor(Number(value) * 10))}">${text}</td>`;
  const groups = [selected.configs.filter(row => !row.experiment), selected.configs.filter(row => row.experiment)];
  const resultTables = groups.filter(group => group.length).map(group =>
    table(group[0].experiment ? L('Offline experiments', 'Çevrimdışı deneyler') : L('Built-in configurations', 'Yerleşik yapılandırmalar'),
      [configuration, 'Hit@5', 'Hit@1', 'MRR', 'Hit@10', 'Doc@1', 'Doc@5', 'p50', 'p95', L('Hardware', 'Donanım')],
      group.map(({ id, gpu, source, metrics: m }) => `<tr${id === selected.featured ? ' class="bm-row--featured"' : ''}><th scope="row">${label(id)}<small>${e(source)}</small></th>${cells([
        percent(m.hit5, language), percent(m.hit1, language), number(m.mrr, language, 3), percent(m.hit10, language),
        percent(m.doc1, language), percent(m.doc5, language), seconds(m.p50), seconds(m.p95), e(gpu)
      ])}</tr>`).join(''))
  ).join('');
  const date = new Intl.DateTimeFormat(language, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(selected.date));
  const citation = selected.citations;
  const currentReport = selected.version === '0.9.3';
  return section('results', L('Search results', 'Arama sonuçları'),
    `<p class="bm-note">${date} · ${suite.documents} ${L('documents', 'belge')} · ${suite.answerable} / ${suite.test} ${L('answerable test questions', 'cevaplanabilir test sorusu')}</p>
    ${resultTables}<ul class="bm-footnotes">${selected.notes.map(note => `<li>${e(note[language])}</li>`).join('')}</ul>`)
  + section('by-type', L('Results by question type', 'Soru türüne göre sonuçlar'),
    `<p class="bm-note">${L('Hit@5 per question type. Darker cells mean the right passage was found more often.', 'Soru türüne göre Hit@5. Koyu hücreler doğru pasajın daha sık bulunduğunu gösterir.')}</p>` + table(L('Correct passage in the first five results', 'Doğru pasaj ilk beş sonuçta'),
      [L('Question type', 'Soru türü'), ...selected.configs.map(row => label(row.id))],
      Object.entries(suite.questionTypes).map(([type, count]) => `<tr><th scope="row">${categoryNames[type]} (${count})</th>
        ${selected.configs.map(row => heat(row.byType[type], percent(row.byType[type], language))).join('')}</tr>`).join('')))
  + (citation ? section('citations', L('Citation questions', 'Atıf soruları'),
    (currentReport ? `<p class="bm-note">${L('0.9.3 keeps the 0.9.2 result: explicit citation Hit@5 is 100.0% (50/50) for T0, T1b and T2. Natural wording is 97.5% (39/40) for T0 and T1b, and 100.0% (40/40) for T2.', '0.9.3, 0.9.2 sonucunu koruyor: açık madde atfında Hit@5, T0, T1b ve T2 için %100,0 (50/50). Doğal ifadede T0 ve T1b için %97,5 (39/40), T2 için %100,0 (40/40).')}</p>` : '') + table(L('Citation questions, Hit@5', 'Atıf sorularında Hit@5'),
      [configuration, L(`Explicit citation (${citation.namedCount})`, `Açık madde atfı (${citation.namedCount})`),
        L(`Natural wording (${citation.naturalCount})`, `Doğal ifade (${citation.naturalCount})`)],
      citation.rows.map(row => `<tr><th scope="row">${label(row.config)}</th>${cells([
        percent(row.named, language), percent(row.natural, language)
      ])}</tr>`).join(''))) : '')
  + (selected.ingest.length ? section('ingest', L('Time until searchable', 'Belgelerin aramaya hazır olma süresi'),
    table(L('Full corpus ingestion', 'Derlemin tamamının içe alınması'), [
      configuration, L('Total time', 'Toplam süre'), L('Chunks', 'Parça'), ...(currentReport ? [L('Seconds per chunk', 'Parça başına saniye')] : []), L('Hardware', 'Donanım')
    ], selected.ingest.map(row => `<tr><th scope="row">${label(row.config)}</th>${cells([
      `${number(row.minutes, language, 1)} ${L('min', 'dk')}`, number(row.chunks, language, 0),
      ...(currentReport ? [`${number(Number(row.minutes) * 60 / row.chunks, language, 2)} ${L('s', 'sn')}`] : []),
      e(selected.configs.find(config => config.id === row.config).gpu)
    ])}</tr>`).join('')) + (currentReport ? `<p class="bm-note">${L('0.9.3 batches ingest work; retrieval quality is unchanged.', '0.9.3, içe alma işlerini toplu yürütür; arama kalitesi değişmedi.')}</p>` : '')) : '')
  + section('data', L('Download results', 'Sonuçları indir'),
    `${overview ? selected.downloads.map(version => `<p><a class="text-link" href="${assetBase}benchmark/${version}/metrics.json" download>MESA ${version} · ${L('Report and aggregate metrics (JSON)', 'Rapor ve toplu metrikler (JSON)')} ↓</a></p>`).join('') : `<a class="text-link" href="${assetBase}benchmark/${selected.version}/metrics.json" download>${L('Report and aggregate metrics (JSON)', 'Rapor ve toplu metrikler (JSON)')} ↓</a>`}`);
}


function currentLimitations(language) {
  return `<p>${language === 'tr'
    ? 'Sayı, tarih ve esas no sorularında T2 sonucu 0.9.3’te değişmedi: 14/29 = %48,3 Hit@5. Benchmark 50 sonuç ister. 10 sonuç istendiğinde yeniden sıralayıcı 20 aday görür; geliştirme kümesinde Hit@5, %77,7 yerine %75,3 oldu. Bu karşılaştırmada hem aday sayısı hem döndürülen sonuç sayısı değişir.'
    : 'For number, date and docket questions, the T2 result is unchanged in 0.9.3: 14/29 = 48.3% Hit@5. The benchmark requests 50 results. With a 10-result request the reranker sees 20 candidates; on the dev split Hit@5 was 75.3% instead of 77.7%. This comparison changes both the candidate pool and the number of returned results.'}</p>`;
}

function overview({ releases, suite, language, section, assetBase }) {
  const L = (en, tr) => language === 'tr' ? tr : en;
  const ordered = [...releases].reverse();
  const latest = ordered.at(-1);
  const key = (release, id) => `${release.version}-${id}`;
  const combined = {
    ...latest,
    featured: key(latest, latest.featured),
    configs: ordered.flatMap(release => release.configs.map(row => ({ ...row, id: key(release, row.id),
      label: { en: `${release.version} · ${row.label.en}`, tr: `${release.version} · ${row.label.tr}` } }))),
    notes: ordered.flatMap(release => release.notes.map(note => ({ en: `${release.version}: ${note.en}`, tr: `${release.version}: ${note.tr}` }))),
    ingest: ordered.flatMap(release => release.ingest.map(row => ({ ...row, config: key(release, row.config) }))),
    citations: { ...latest.citations, rows: ordered.flatMap(release => (release.citations?.rows || []).map(row => ({ ...row, config: key(release, row.config) }))) },
    downloads: ordered.map(release => release.version)
  };
  const chart = ['off', 'embedding', 'reranker'].map((profile, index) => {
    const title = [L('Models off', 'Modelsiz'), L('BGE-M3 embeddings', 'BGE-M3 gömme modeli'), L('Built-in reranker', 'Yerleşik yeniden sıralayıcı')][index];
    return `<div class="bm-bars__group"><h3>${title}</h3>${ordered.map((release, i) => {
      const config = release.configs.find(row => row.profile === profile);
      return `<div class="bm-bars__row"><span>MESA ${release.version}</span><svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" class="bm-bars__track bm-bars__track--${i}"><rect class="bm-bars__background" width="100" height="10"/>${config ? `<rect width="${Number(config.metrics.hit5) * 100}" height="10"/>` : ''}</svg><span>${config ? percent(config.metrics.hit5, language) : L('Unavailable', 'Ölçüm yok')}</span></div>`;
    }).join('')}</div>`;
  }).join('');
  return section('hit5', L('Hit@5 by configuration', 'Yapılandırmaya göre Hit@5'), `<div class="bm-bars">${chart}</div>`)
    + report({ selected: combined, suite, language, section, assetBase, overview: true });
}
