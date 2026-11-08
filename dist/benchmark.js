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
  // Dumbbell row: one 0–100% scale, a grey dot for the reference and an amber dot for the
  // selected version, joined by a line. Dots are zero-length round-capped lines with
  // non-scaling strokes, so they stay round while the track stretches to any width.
  const pct = row => row ? Number(row.metrics.hit5) * 100 : null;
  const track = (left, right) => {
    const a = pct(left);
    const b = pct(right);
    const grid = [0, 25, 50, 75, 100].map(x => `<line class="bm-db__grid" x1="${x}" x2="${x}" y1="0" y2="20" vector-effect="non-scaling-stroke"/>`).join('');
    const link = a !== null && b !== null ? `<line class="bm-db__link${b < a ? ' bm-db__link--down' : ''}" x1="${a}" x2="${b}" y1="10" y2="10" vector-effect="non-scaling-stroke"/>` : '';
    const dot = (x, modifier) => x === null ? '' : `<line class="bm-db__dot bm-db__dot--${modifier}" x1="${x}" x2="${x}" y1="10" y2="10" vector-effect="non-scaling-stroke"/>`;
    return `<svg class="bm-db__track" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true" focusable="false">${grid}${link}${dot(a, 'old')}${dot(b, 'new')}</svg>`;
  };
  const values = (left, right) => `<span class="bm-db__values"><span class="bm-db__old">${left ? percent(left.metrics.hit5, language) : unavailable}</span><span aria-hidden="true">→</span><span class="bm-db__new">${right ? percent(right.metrics.hit5, language) : unavailable}</span></span>`;
  const change = (left, right) => {
    if (!left || !right) return `<span class="bm-db__delta bm-db__delta--none">${L('new', 'yeni')}</span>`;
    const difference = Math.round((Number(right.metrics.hit5) - Number(left.metrics.hit5)) * 1000) / 10;
    const formatted = new Intl.NumberFormat(language, { minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: 'exceptZero' }).format(difference);
    return `<span class="bm-db__delta${difference < 0 ? ' bm-db__delta--down' : ''}">${formatted} ${L('pp', 'yp')}</span>`;
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
  const axis = [0, 25, 50, 75, 100].map(x => `<span>${percent(x / 100, language).replace(/[.,]0(?=\D*$)/, '')}</span>`).join('');
  return `<figure class="bm-db"><figcaption><span>${label}</span><span class="bm-db__legend"><span class="bm-db__key bm-db__key--old"></span>MESA ${leftVersion}<span class="bm-db__key bm-db__key--new"></span>MESA ${rightVersion}</span></figcaption>
    <div class="bm-db__axis" aria-hidden="true"><span></span><div class="bm-db__ticks">${axis}</div><span></span></div>
    ${rows.map(({ label, left, right }) => `<div class="bm-db__row"><p class="bm-db__label">${label}</p>${track(left, right)}<p class="bm-db__meta">${values(left, right)}${change(left, right)}</p></div>`).join('')}
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
