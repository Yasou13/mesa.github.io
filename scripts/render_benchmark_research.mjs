import { escapeHtml as e } from '../dist/benchmark.js';

export function benchmarkResearchPage({ header, footer, language, base, assetBase, evidence, enabled }) {
  const L = (en, tr) => language === 'tr' ? tr : en;
  const official = L('Official source ↗', 'Resmî kaynak ↗');
  const kinds = {
    legislation: L('Law', 'Kanun'), regulation: L('Regulation', 'Yönetmelik'), communique: L('Communiqué', 'Tebliğ')
  };
  const sourceLink = (url, label) => `<a href="${e(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  const sources = evidence.sources.map(({ title, kind, tiers, url }) =>
    `<li>${sourceLink(url, e(title))} <small>${kinds[kind]} · ${tiers.join(' / ')}</small></li>`).join('');
  const examples = evidence.examples.map(({ question, title, article, rank, excerpt, url }) => `
    <details class="bm-details"><summary>${e(question)}</summary>
      <p class="bm-note">${e(title)} · ${e(article)} · ${L('Rank', 'Sonuç sırası')} ${rank}</p>
      <blockquote lang="tr">${e(excerpt)}</blockquote><p>${sourceLink(url, official)}</p>
    </details>`).join('');
  const title = L('Benchmark data and examples', 'Benchmark verileri ve örnekler');
  const accessTitle = L('Research access', 'Araştırma erişimi');
  return `${header}<main id="main-content" class="benchmark-page">
    <section class="page-hero compact bm-hero"><p class="eyebrow">BENCHMARK · MESA</p><h1>${title}</h1>
      <p class="bm-hero__lead">${L('See passages returned by MESA, check official sources and request research access.', 'MESA’nın bulduğu pasajları ve resmî kaynakları incele, araştırma erişimi talep et.')}</p>
      <p class="bm-versions"><a class="bm-version" href="${base}benchmark/">${L('Back to benchmark', 'Benchmark sayfasına dön')}</a><a class="bm-version" href="#research-access">${accessTitle}</a></p>
    </section>
    <section class="section bm-section" aria-labelledby="bm-demo">
      <h2 id="bm-demo">${L('Search examples', 'Arama örnekleri')}</h2>
      <p>${L('These Turkish questions come from the development set. The excerpts and ranks are from a recorded run.', 'Bu Türkçe sorular geliştirme setinden seçildi. Pasajlar ve sıralar kaydedilmiş bir çalıştırmadan alındı.')} <span class="bm-note">${e(evidence.run)}</span></p>
      <div lang="tr">${examples}</div>
    </section>
    <section class="section bm-section" aria-labelledby="bm-corpus">
      <h2 id="bm-corpus">${L('Legal corpus', 'Hukuk derlemesi')}</h2>
      <ul class="bm-versions bm-tiers">${evidence.tiers.map(({ tier, documents }) => `<li class="bm-version"><strong>${tier}</strong> ${documents} ${L('documents', 'belge')}</li>`).join('')}</ul>
      <details class="bm-details"><summary>${L('Official legislation sources', 'Resmî mevzuat kaynakları')} (${evidence.sources.length})</summary>
      <p>${L('This list covers the legislation in the S, M and L tiers with an official link in the corpus manifest.', 'Bu liste S, M ve L katmanlarında derlem kaydında resmî bağlantısı bulunan mevzuatı kapsar.')}</p>
      <ul class="bm-source-list" lang="tr">${sources}</ul></details>
    </section>
    <section class="section bm-section" id="research-access" aria-labelledby="bm-access">
      <h2 id="bm-access">${accessTitle}</h2>
      <p>${L('Reviewed research packages are available to approved accounts. The held-out evaluation questions are kept separately.', 'İncelenmiş araştırma paketlerine onaylı hesaplar erişebilir. Sürüm değerlendirmesinde kullanılan test soruları ayrı tutulur.')}</p>
      ${enabled ? `<div id="benchmark-research-panel" class="access-card">
        <p id="research-status" role="status" aria-live="polite">${L('Checking sign-in…', 'Oturum kontrol ediliyor…')}</p>
        <button class="bm-google-button" id="research-login" type="button" hidden><img src="${assetBase}assets/google-sign-in.png" alt="" width="20" height="20">${L('Continue with Google', 'Google ile devam et')}</button>
        <form id="research-request" method="post" hidden>
          <label for="research-purpose">${L('How will you use the data?', 'Veriyi ne için kullanacaksınız?')}</label>
          <textarea id="research-purpose" name="purpose" rows="4" minlength="20" maxlength="1000" required></textarea>
          <button class="button primary" type="submit">${L('Request access', 'Erişim talep et')}</button>
        </form>
        <div id="research-downloads" class="bm-versions" hidden>${evidence.tiers.map(({ tier }) =>
          `<button class="button secondary" type="button" data-tier="${tier}">${L('Download', 'İndir')} ${tier}</button>`).join('')}</div>
        <button class="button secondary" id="research-logout" type="button" hidden>${L('Sign out', 'Çıkış yap')}</button>
        <p class="bm-note">${L('MESA stores your account ID, request and its status to review and manage access. Keep personal case details out of the request.', 'MESA erişimi değerlendirmek ve yönetmek için hesap kimliğini, talebini ve durumunu saklar. Talebe kişisel dava ayrıntıları ekleme.')}</p>
        <p><a href="${base}privacy/">${L('Privacy notice', 'Gizlilik bildirimi')}</a></p>
      </div>` : `<p class="bm-note">${L('Research applications will open when the packages are ready.', 'Araştırma paketleri hazır olduğunda başvurular açılacak.')}</p>`}
    </section>${footer}</main>`;
}
