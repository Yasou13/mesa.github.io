// Public changelog page and RSS feed, rendered per language from content/changelog.json.
// Add one entry there for every Core release; scripts/tests/changelog.test.mjs enforces it.
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

const SECTIONS = [
  ['new', 'New', 'Yeni'],
  ['improved', 'Improved', 'İyileşti'],
  ['fixed', 'Fixed', 'Düzeltildi'],
  ['upgrade', 'Before you upgrade', 'Yükseltmeden önce'],
  ['limits', 'Known limits', 'Bilinen sınırlar']
];

const formatDate = (date, language) => new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-GB', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'
}).format(new Date(`${date}T00:00:00Z`));

const sourceUrl = (coreRepo, changelog, release) => `${coreRepo}/blob/${changelog.sourceCommit}/CHANGELOG.md#${release.anchor}`;

export function changelogPage({ header, footer, language, base, changelog, coreRepo }) {
  const tr = language === 'tr';
  const L = (en, turkish) => tr ? turkish : en;
  const href = path => `${base}${path}`;
  const releases = changelog.releases.map((release, index) => {
    const id = `v${release.version.replaceAll('.', '-')}`;
    const sections = SECTIONS.filter(([key]) => release[key]?.length).map(([key, en, turkish]) => `<section class="changelog-group changelog-group--${key}">
          <h3>${L(en, turkish)}</h3>
          <ul>${release[key].map(item => `<li>${escapeHtml(item[language])}</li>`).join('')}</ul>
        </section>`).join('');
    const links = [
      `<a href="${escapeHtml(sourceUrl(coreRepo, changelog, release))}" target="_blank" rel="noopener noreferrer">${L('Full technical changelog', 'Tüm teknik değişiklikler')}</a>`,
      release.benchmark ? `<a href="${href(release.benchmark)}">${L(`Benchmark ${release.version}`, `${release.version} benchmark sonuçları`)}</a>` : ''
    ].filter(Boolean).join('');
    return `<article class="changelog-release" id="${id}" aria-labelledby="${id}-title">
      <div class="changelog-meta">
        <time datetime="${release.date}">${formatDate(release.date, language)}</time>
        ${index === 0 ? `<span class="changelog-latest">${L('Latest', 'Güncel')}</span>` : ''}
      </div>
      <div class="changelog-body">
        <h2 id="${id}-title"><a href="#${id}">v${release.version}</a></h2>
        <p class="changelog-summary">${escapeHtml(release.summary[language])}</p>
        ${sections}
        <p class="changelog-links">${links}</p>
      </div>
    </article>`;
  }).join('');

  return `${header}<main id="main-content" class="changelog-page">
    <section class="page-hero compact">
      <p class="eyebrow">${L('CHANGELOG', 'DEĞİŞİKLİK GÜNLÜĞÜ')}</p>
      <h1>${L('What changed in MESA', 'MESA’da neler değişti')}</h1>
      <p>${L('The changes that matter in each MESA Core release, including what to check before upgrading and what is still limited.', 'Her MESA Core sürümündeki önemli değişiklikler, yükseltmeden önce bakılması gerekenler ve hâlâ süren sınırlar.')}</p>
      <p class="changelog-actions"><a href="${href('changelog/feed.xml')}">${L('Follow with RSS', 'RSS ile takip et')}</a><a href="${href('status/')}">${L('Project status', 'Proje durumu')}</a></p>
    </section>
    <section class="section changelog-list" aria-label="${L('Releases', 'Sürümler')}">
      <p class="changelog-notice">${L('MESA is alpha software and is not yet recommended for production use.', 'MESA alfa aşamasındadır ve henüz canlı kullanım için önerilmez.')}</p>
      ${releases}
    </section>
  </main>${footer}`;
}

export function changelogFeed({ language, siteUrl, changelog, coreRepo }) {
  const prefix = language === 'tr' ? 'tr/' : '';
  const pageUrl = `${siteUrl}${prefix}changelog/`;
  const title = language === 'tr' ? 'MESA Değişiklik Günlüğü' : 'MESA Changelog';
  const description = language === 'tr' ? 'MESA Core sürümlerindeki önemli değişiklikler.' : 'The changes that matter in each MESA Core release.';
  const items = changelog.releases.map(release => {
    const id = `v${release.version.replaceAll('.', '-')}`;
    const body = SECTIONS.filter(([key]) => release[key]?.length).map(([key, en, turkish]) =>
      `<h3>${language === 'tr' ? turkish : en}</h3><ul>${release[key].map(item => `<li>${escapeHtml(item[language])}</li>`).join('')}</ul>`).join('');
    const content = `<p>${escapeHtml(release.summary[language])}</p>${body}<p><a href="${escapeHtml(sourceUrl(coreRepo, changelog, release))}">CHANGELOG.md</a></p>`;
    return `    <item>
      <title>MESA v${release.version}</title>
      <link>${pageUrl}#${id}</link>
      <guid isPermaLink="true">${pageUrl}#${id}</guid>
      <pubDate>${new Date(`${release.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeHtml(content)}</description>
    </item>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <link>${pageUrl}</link>
    <description>${description}</description>
    <language>${language}</language>
    <lastBuildDate>${new Date(`${changelog.releases[0].date}T00:00:00Z`).toUTCString()}</lastBuildDate>
    <atom:link href="${pageUrl}feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}
