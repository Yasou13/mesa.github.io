export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
})[char]);

export const number = (value, language, digits = 1) => new Intl.NumberFormat(language, {
  minimumFractionDigits: digits, maximumFractionDigits: digits
}).format(Number(value));

export const percent = (value, language) => new Intl.NumberFormat(language, {
  style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1
}).format(Number(value));

export function compareVersions(left, right) {
  return left.localeCompare(right, 'en', { numeric: true });
}

export function comparison(baseline, target, language) {
  const L = (en, tr) => language === 'tr' ? tr : en;
  if (baseline.version === target.version) return `<p class="bm-note">${L('Select two different versions to compare.', 'Karşılaştırmak için iki farklı sürüm seç.')}</p>`;
  if (baseline.suite !== target.suite) return `<p class="bm-note">${L('These releases use different test protocols. Open the individual reports for their results.', 'Bu sürümler farklı test protokolleri kullanıyor. Sonuçları sürüm raporlarında görebilirsin.')}</p>`;

  const profiles = [
    ['off', L('Models off', 'Modelsiz')],
    ['embedding', L('BGE-M3 embeddings', 'BGE-M3 gömme modeli')],
    ['reranker', L('Built-in reranker', 'Yerleşik yeniden sıralayıcı')]
  ];
  const rows = profiles.map(([profile, label]) => ({
    label, left: baseline.configs.find(row => row.profile === profile), right: target.configs.find(row => row.profile === profile)
  })).filter(({ left, right }) => left || right);

  const leftVersion = escapeHtml(baseline.version);
  const rightVersion = escapeHtml(target.version);
  const unavailable = L('Unavailable', 'Ölçüm yok');
  const bar = (row, version, modifier) => {
    const value = row?.metrics.hit5;
    const graphic = row
      ? `<svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" focusable="false"><rect width="${Number(value) * 100}" height="10" rx="1"/></svg>` : '';
    return `<div class="bm-bar bm-bar--${modifier}${row ? '' : ' bm-bar--none'}"><span class="bm-bar__version">${version}</span><span class="bm-bar__track">${graphic}</span><span class="bm-bar__value">${row ? percent(value, language) : unavailable}</span></div>`;
  };

  const label = L('Hit@5 by configuration', 'Yapılandırmaya göre Hit@5');
  const heading = L('Configuration', 'Yapılandırma');
  const deltaLabel = L('Hit@5 change', 'Hit@5 farkı');
  const metricCells = row => row
    ? `<td>${percent(row.metrics.hit5, language)}</td><td>${number(row.metrics.mrr, language, 3)}</td>`
    : `<td aria-label="${unavailable}">—</td><td aria-label="${unavailable}">—</td>`;
  const delta = (left, right) => {
    if (!left || !right) return `<td aria-label="${unavailable}">—</td>`;
    const difference = Math.round((Number(right.metrics.hit5) - Number(left.metrics.hit5)) * 1000) / 10;
    const formatted = new Intl.NumberFormat(language, { minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: 'exceptZero' }).format(difference);
    return `<td>${formatted} ${L('pp', 'yp')}</td>`;
  };
  return `<figure class="bm-chart"><figcaption>${label}</figcaption>
    ${rows.map(({ label, left, right }) => `<div class="bm-chart__group"><p class="bm-chart__level">${label}</p>${bar(left, leftVersion, 'old')}${bar(right, rightVersion, 'new')}</div>`).join('')}
    </figure>
    <div class="table-scroll bm-table" tabindex="0" role="region" aria-label="${L('Version comparison', 'Sürüm karşılaştırması')}">
    <table><caption>${L('Passage retrieval comparison', 'Pasaj arama karşılaştırması')}</caption><colgroup span="1"></colgroup><colgroup span="2"></colgroup><colgroup span="2"></colgroup><colgroup span="1"></colgroup>
    <thead><tr><th rowspan="2" scope="col">${heading}</th><th colspan="2" scope="colgroup">${leftVersion}</th><th colspan="2" scope="colgroup">${rightVersion}</th><th rowspan="2" scope="col">${deltaLabel}</th></tr>
    <tr><th scope="col">Hit@5</th><th scope="col">MRR</th><th scope="col">Hit@5</th><th scope="col">MRR</th></tr></thead>
    <tbody>${rows.map(({ label, left, right }) => `<tr><th scope="row">${label}</th>${metricCells(left)}${metricCells(right)}${delta(left, right)}</tr>`).join('')}</tbody></table></div>
    <p class="bm-note">${L('Changes are in percentage points, calculated as selected version minus reference. Profiles are matched by model setup. Search settings and hardware can differ. See the individual reports for timing and offline experiments.',
      'Fark, seçilen sürümden referans sürüm çıkarılarak yüzde puan cinsinden hesaplanır. Yapılandırmalar model kurulumuna göre eşleştirilir. Arama ayarları ve donanım farklı olabilir. Süreler ve çevrimdışı deneyler sürüm raporlarında yer alır.')}</p>`;
}

if (typeof document !== 'undefined') {
  const form = document.querySelector('#benchmark-compare');
  if (form) {
    const releases = JSON.parse(document.querySelector('#benchmark-data').textContent);
    const reference = form.elements.reference;
    const version = form.elements.version;
    const result = document.querySelector('#benchmark-comparison');
    const defaults = [reference.value, version.value];
    const alternates = document.querySelectorAll('.language-switch a:not([aria-current])');

    function update(readUrl) {
      const url = new URL(location.href);
      if (readUrl) {
        for (const [index, field] of [reference, version].entries()) {
          const selected = url.searchParams.get(field.name);
          field.value = releases.some(release => release.version === selected) ? selected : defaults[index];
        }
      } else {
        url.searchParams.set(reference.name, reference.value);
        url.searchParams.set(version.name, version.value);
        history.pushState(null, '', url);
      }
      for (const alternate of alternates) {
        const translated = new URL(alternate.href);
        translated.searchParams.set(reference.name, reference.value);
        translated.searchParams.set(version.name, version.value);
        alternate.href = translated.href;
      }
      result.innerHTML = comparison(
        releases.find(release => release.version === reference.value),
        releases.find(release => release.version === version.value),
        document.documentElement.lang
      );
    }

    update(true);
    form.hidden = false;
    form.addEventListener('change', () => update(false));
    window.addEventListener('popstate', () => update(true));
  }
}
