// Editorial product views share one paired vocabulary with the static localization gate.
import { introTranslations, beginnerHome } from './render_intro.mjs';
export const productTranslations = introTranslations;
const t = (en, tr) => {
  productTranslations[en] = tr;
  return en;
};
const paragraph = (en, tr) => `<p>${t(en, tr)}</p>`;
const title = (en, tr) => `<h2>${t(en, tr)}</h2>`;
const eyebrow = (en, tr) => `<p class="eyebrow">${t(en, tr)}</p>`;
const row = (name, en, tr) => `<article><h3>${name}</h3>${paragraph(en, tr)}</article>`;
const source = 'https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/';

export function rankCalculator() {
  const lanes = [
    ['vector', 'Vector', 'Vektör'],
    ['bm25', 'BM25', 'BM25'],
    ['assertion', 'Assertion', 'Assertion'],
    ['graph', 'Graph', 'Çizge']
  ];

  return `
<form class="rank-calculator" data-rank-calculator>
  <fieldset disabled>
    <legend>${t('Illustrative rank fusion · choose contributing lanes', 'Örnek sıra birleştirme · katkı veren kanalları seçin')}</legend>
    <div class="rank-lanes">
      ${lanes.map(([id, en, tr]) => `
      <label>
        <input type="checkbox" name="${id}" checked>
        <span>${t(en, tr)}</span>
        <code>1 / (60 + 1)</code>
      </label>`).join('')}
    </div>
  </fieldset>
  <div class="rank-result">
    <span>${t('RRF score', 'RRF skoru')}</span>
    <output aria-live="polite">4 / 61 = 0.065574</output>
  </div>
  ${paragraph(
    'All enabled lanes rank the same candidate first; weights are 1.0 and k=60. This calculator makes no API call and measures neither probability nor retrieval quality.',
    'Etkin kanallar aynı adayı ilk sıraya koyar; ağırlıklar 1.0 ve k=60’tır. Hesaplayıcı API çağrısı yapmaz; olasılık veya retrieval kalitesi ölçmez.'
  )}
  <noscript>${t('Static example: four contributions give 4/61.', 'Statik örnek: dört katkı 4/61 verir.')}</noscript>
</form>`;
}

function flow(items) {
  const names = {
    '01 · Source': '01 · Kaynak',
    '02 · Ingest': '02 · Veri alımı',
    '03 · Persist': '03 · Kalıcılık',
    '04 · Retrieve': '04 · Retrieval',
    'Source': 'Kaynak',
    'Admission': 'Kabul',
    'Processing': 'İşleme',
    'Projection': 'Projeksiyon',
    'Scope': 'Kapsam',
    'Lanes': 'Kanallar',
    'RRF': 'RRF',
    'Context': 'Bağlam'
  };

  return `
<ol class="system-flow">
  ${items.map(([name, description, en, tr], i) => `
  <li>
    <span class="flow-number">0${i + 1}</span>
    <strong>${t(name, names[name] || name)}</strong>
    <span>${t(en || description, tr || description)}</span>
  </li>`).join('')}
</ol>`;
}

export function productHome(helpers) { return beginnerHome(helpers); }

export function architecturePage({ header, footer, route, cta }) {
  return `
${header('architecture')}
<main id="main-content">
  <section class="page-hero compact page-hero--trajectory">
    ${eyebrow('MESA CORE v0.8.1 · ARCHITECTURE', 'MESA CORE v0.8.1 · MİMARİ')}
    <h1>${t('One canonical record. Several ways to find it.', 'Tek kanonik kayıt. Onu bulmanın farklı yolları.')}</h1>
    ${paragraph(
      'MESA separates source ownership, background processing and retrieval projections. Read the system through four small views.',
      'MESA; kaynak sahipliğini, arka plan işlemeyi ve retrieval projeksiyonlarını ayırır. Sistemi dört küçük görünümle okuyun.'
    )}
  </section>

  <section class="section">
    ${eyebrow('01 · LOGICAL FLOW', '01 · MANTIKSAL AKIŞ')}
    ${title('Accept work durably, then process it.', 'İşi kalıcı kabul edin; sonra işleyin.')}
    ${flow([
      ['Source', '', 'Exact text, document, revision, chunk', 'Tam metin, belge, revizyon, parça'],
      ['Admission', '', 'Authenticated session; durable mutation', 'Kimliği doğrulanmış oturum; kalıcı mutasyon'],
      ['Processing', '', 'Extraction and selected validation', 'Çıkarım ve seçili doğrulama'],
      ['Projection', '', 'SQL → vector → graph → COMMITTED', 'SQL → vektör → çizge → COMMITTED']
    ])}
    ${paragraph(
      '202 confirms admission. Stores do not share one ACID transaction. Fenced leases, ownership, idempotent receipts and reconciliation support recovery. Mode 0 uses deterministic validation, mode 1 one validator, mode 2 distinct A/B provider-model consensus.',
      '202, kabulü doğrular. Depolar tek ACID transaction paylaşmaz. Fencing token’lı lease, sahiplik, idempotent receipt ve reconciliation kurtarmayı destekler. Mod 0 deterministik doğrulama, mod 1 tek validator, mod 2 farklı A/B sağlayıcı-model uzlaşısı kullanır.'
    )}
  </section>

  <section class="section">
    ${eyebrow('02 · PHYSICAL STORAGE', '02 · FİZİKSEL DEPOLAMA')}
    ${title('SQLite decides. Projections follow.', 'SQLite karar verir. Projeksiyonlar izler.')}
    <div class="storage-grid">
      ${row(
        'SQLite',
        'Canonical catalog, authorization, immutable revisions, assertions, mutation ledger and artifact ownership. FTS5 supplies passage/evidence lexical search.',
        'Kanonik katalog, yetkilendirme, değişmez revizyonlar, assertion’lar, mutasyon kaydı ve artifact sahipliği. FTS5 pasaj/kanıt üzerinde sözcüksel arama sağlar.'
      )}
      ${row(
        'LanceDB',
        'Derived assertion vectors with embedding identity. Query and stored representation must match model and dimension; provider availability is a runtime fact.',
        'Embedding kimliği taşıyan türetilmiş assertion vektörleri. Sorgu ve depolanan temsilin model/boyutu eşleşmelidir; sağlayıcı kullanılabilirliği çalışma anında belirlenir.'
      )}
      ${row(
        'Kùzu',
        'Derived Graph V2 entities and assertion edges. Bounded paths must reconcile to authorized canonical facts; a projection-only adapter cannot traverse.',
        'Türetilmiş Graph V2 düğümleri ve assertion kenarları. Sınırlı yollar yetkili kanonik bilgilerle uzlaşmalıdır; yalnız projeksiyon yazan adapter dolaşım yapamaz.'
      )}
    </div>
    ${paragraph(
      'V4 requires one combined storage owner per root. V3 API/worker roles and V4 must use separate roots. Offline backup and forward-only migration protect the operator boundary.',
      'V4, root başına tek combined storage owner ister. V3 API/worker rolleri ile V4 ayrı root kullanmalıdır. Offline yedekleme ve yalnız ileri migration, operatör sınırını korur.'
    )}
  </section>

  <section class="section">
    ${eyebrow('03 · RETRIEVAL EXECUTION', '03 · RETRIEVAL YÜRÜTMESİ')}
    ${title('Authorize, retrieve, fuse, pack.', 'Yetkilendir, getir, birleştir, paketle.')}
    ${flow([
      ['Scope', '', 'Session-bound authorized datasets', 'Oturuma bağlı yetkili dataset’ler'],
      ['Lanes', '', 'Vector · BM25 · assertion · graph', 'Vektör · BM25 · assertion · çizge'],
      ['RRF', '', 'Rank contributions, then legal reranking', 'Sıra katkıları; ardından hukuk yeniden sıralaması'],
      ['Context', '', 'Complete evidence within a token budget', 'Token bütçesi içinde tam kanıt']
    ])}
    ${paragraph(
      'Eligibility is resolved before rank contribution. Source evidence and graph proof remain attached to candidate identity. Context defaults to 2048 formatted-evidence tokens; empty retrieval is not proof that a proposition is false.',
      'Uygunluk, sıra katkısından önce çözülür. Kaynak kanıtı ve çizge ispatı aday kimliğine bağlı kalır. Bağlam varsayılan olarak 2048 biçimlendirilmiş kanıt token’ıdır; boş retrieval bir önermenin yanlışlığını kanıtlamaz.'
    )}
    ${cta(t('Inspect ranking and limits', 'Sıralama ve sınırları inceleyin'), route('retrieval/'), 'text')}
  </section>

  <section class="section">
    ${eyebrow('04 · EVIDENCE REPRESENTATION', '04 · KANIT TEMSİLİ')}
    ${title('A relationship with a traceable basis.', 'İzlenebilir dayanağı olan ilişki.')}
    <div class="evidence-contract">
      <code>subject → predicate → entity / literal</code>
      <span aria-hidden="true">↓</span>
      <code>document → revision → chunk → evidence</code>
      <span aria-hidden="true">↓</span>
      <code>mutation_id · pipeline_run_id · retrieval_provenance</code>
    </div>
    ${paragraph(
      'A whole-revision declared hash, frozen manifest hash and chunk content hash identify different objects. A legal identity must come from a verified source catalog. Tenant is an authorization boundary; agent IDs are context rather than credentials.',
      'Bütün-revizyon beyan hash’i, dondurulmuş manifest hash’i ve parça içerik hash’i farklı nesneleri tanımlar. Hukuk kimliği doğrulanmış kaynak kataloğundan gelmelidir. Tenant yetkilendirme sınırıdır; agent kimliği credential yerine bağlamdır.'
    )}
    <div class="actions">
      ${cta(t('Evidence and provenance', 'Kanıt ve kaynak izi'), route('docs/core/evidence/'))}
      ${cta(t('Security and scope', 'Güvenlik ve kapsam'), route('docs/core/security/'), 'secondary')}
    </div>
  </section>

  <section class="section source-notes">
    ${title('Read the versioned contracts.', 'Sabitlenmiş sözleşmeleri okuyun.')}
    <ul>
      <li><a target="_blank" rel="noopener noreferrer" href="${source}docs/architecture-v4.md">docs/architecture-v4.md · d394784</a></li>
      <li><a target="_blank" rel="noopener noreferrer" href="${source}docs/concepts-and-ingestion.md">docs/concepts-and-ingestion.md · d394784</a></li>
      <li><a target="_blank" rel="noopener noreferrer" href="${source}mesa_storage/retrieval_scope.py">mesa_storage/retrieval_scope.py · d394784</a></li>
    </ul>
  </section>
  ${footer()}
</main>`;
}

export function retrievalPage({ header, footer, route, cta }) {
  return `
${header('architecture')}
<main id="main-content">
  <section class="page-hero compact page-hero--trajectory">
    ${eyebrow('MESA V4 · RETRIEVAL', 'MESA V4 · RETRIEVAL')}
    <h1>${t('Different signals. One evidence identity.', 'Farklı sinyaller. Tek kanıt kimliği.')}</h1>
    ${paragraph(
      'Each lane proposes eligible candidates for a different reason. Fusion combines their ranks; provenance keeps the reasons inspectable.',
      'Her kanal uygun adayları farklı gerekçeyle önerir. Birleştirme sıralarını toplar; kaynak izi gerekçeleri incelenebilir tutar.'
    )}
  </section>

  <section class="section">
    ${title('Four lanes, four useful questions.', 'Dört kanal, dört yararlı soru.')}
    <div class="editorial-rows">
      ${row(
        t('Vector · semantic similarity', 'Vektör · anlamsal benzerlik'),
        'Does this assertion mean something close to the query? Compatible query embeddings search the LanceDB assertion projection.',
        'Bu assertion sorguya yakın bir anlam taşıyor mu? Uyumlu sorgu embedding’i LanceDB assertion projeksiyonunu arar.'
      )}
      ${row(
        t('BM25 · passage and citation', 'BM25 · pasaj ve atıf'),
        'Does the evidence text contain useful terms or a scoped citation? FTS5 ranks passages; exact citation lookup contributes within the lane.',
        'Kanıt metni yararlı terimler veya kapsamlı atıf içeriyor mu? FTS5 pasajları sıralar; tam atıf araması kanal içinde katkı verir.'
      )}
      ${row(
        t('Assertion · structured relation', 'Assertion · yapılandırılmış ilişki'),
        'Do subject, predicate, entity/literal object and evidence match? SQLite-owned relations provide a separate signal.',
        'Subject, predicate, entity/literal object ve kanıt eşleşiyor mu? SQLite’ın sahip olduğu ilişkiler ayrı sinyal sağlar.'
      )}
      ${row(
        t('Graph · supported path', 'Çizge · desteklenen yol'),
        'Is there a bounded relationship path supported by eligible canonical assertions? Paths retain supporting IDs and direction.',
        'Uygun kanonik assertion’larla desteklenen sınırlı ilişki yolu var mı? Yollar destekleyen kimlikleri ve yönü korur.'
      )}
    </div>
  </section>

  <section class="section">
    ${eyebrow('RECIPROCAL RANK FUSION', 'RECIPROCAL RANK FUSION')}
    ${title('Ranks combine; raw scores stay separate.', 'Sıralar birleşir; ham skorlar ayrı kalır.')}
    <pre tabindex="0"><code>RRF(candidate) = Σ weight_lane / (k + rank_lane)
k = 60 · weight_lane = 1.0 · rank starts at 1</code></pre>
    ${paragraph(
      'A duplicate candidate casts one vote per lane. Ties resolve by candidate identity. A lane may return no eligible hit. This example uses one first-ranked candidate; it does not simulate the complete retrieval engine.',
      'Tekrarlanan aday kanal başına bir oy verir. Eşitlikler aday kimliğiyle çözülür. Bir kanal uygun hit döndürmeyebilir. Bu örnek tek ilk-sıra adayı kullanır; retrieval motorunun tamamını simüle etmez.'
    )}
    ${rankCalculator()}
    ${paragraph(
      'Citation boosts apply inside lanes: BM25 exact +200, same statute +40; assertion exact +150, same statute +40. They affect lane order, not RRF increments. After fusion, a query-dependent legal factor is 1.5 for exact statute/article, 1.25 for the same statute, 0.25 for a competing statute, and 1.0 otherwise.',
      'Atıf artırımları kanal içinde uygulanır: BM25 tam eşleşme +200, aynı kanun +40; assertion tam eşleşme +150, aynı kanun +40. Kanal sırasını etkiler; doğrudan RRF’ye eklenmez. Birleştirmeden sonra sorguya bağlı hukuk katsayısı tam kanun/madde için 1.5, aynı kanun için 1.25, rakip kanun için 0.25, diğer durumda 1.0’dır.'
    )}
    ${paragraph(
      'Responses expose rrf_score, legal_factor, raw_score and final_score separately. Higher fused relevance is better; none of these fields is a probability of truth.',
      'Yanıtlar rrf_score, legal_factor, raw_score ve final_score alanlarını ayrı sunar. Daha yüksek birleştirilmiş uygunluk daha iyidir; bu alanların hiçbiri doğruluk olasılığı değildir.'
    )}
  </section>

  <section class="section">
    ${title('Bounds are part of the contract.', 'Sınırlar sözleşmenin parçasıdır.')}
    <div class="editorial-rows">
      ${row(
        t('Graph resources', 'Çizge kaynakları'),
        'At most 20 seeds, 3 hops and 500 requested graph hits; frontier 64, per-node fan-out 32, default request timeout 15 seconds. PageRank is telemetry only. These limits do not guarantee latency or completeness.',
        'En fazla 20 başlangıç, 3 hop ve 500 istenen graph hit; frontier 64, düğüm başına fan-out 32, varsayılan istek zaman aşımı 15 saniye. PageRank yalnız telemetridir. Bu sınırlar gecikme veya tamlık garantilemez.'
      )}
      ${row(
        t('Context packing', 'Bağlam paketleme'),
        'The default 2048-token budget counts formatted model-visible evidence with cl100k_base. If BPE cannot load, a conservative UTF-8 byte upper bound may fit less. Complete graph proof fits atomically.',
        'Varsayılan 2048 token bütçesi, modelin göreceği biçimlendirilmiş kanıtı cl100k_base ile sayar. BPE yüklenemezse muhafazakâr UTF-8 bayt üst sınırı daha az kanıt sığdırabilir. Tam çizge ispatı atomik sığmalıdır.'
      )}
      ${row(
        t('Adaptive context · opt in', 'Adaptive bağlam · isteğe bağlı'),
        'Single query is the default. Adaptive mode triggers on empty Q0 or no two-lane support in its top three; at most one planner and two expansions keep the same scope. Outer fusion weights are Q0=1.0 and Q1/Q2=0.5. Failure preserves Q0.',
        'Varsayılan tek sorgudur. Adaptive mod, Q0 boşsa veya ilk üçte iki-kanal desteği yoksa tetiklenir; en fazla bir planlayıcı ve iki genişletme aynı kapsamı korur. Dış birleştirme ağırlıkları Q0=1.0 ve Q1/Q2=0.5’tir. Hata Q0’ı korur.'
      )}
      ${row(
        t('Runtime availability', 'Çalışma anında kullanılabilirlik'),
        'Capability flags describe operational support. An expected failure of a configured vector/graph backend returns explicit 503. Projection-only graph adapters do not advertise neighbor traversal.',
        'Capability bayrakları çalışır desteği tanımlar. Yapılandırılmış vektör/çizge backend’inin beklenen hatası açık 503 döndürür. Yalnız projeksiyon yazan çizge adapter’ları komşu dolaşımı bildirmez.'
      )}
    </div>
  </section>

  <section class="section source-notes">
    ${title('Inspect the implementation.', 'Uygulamayı inceleyin.')}
    <ul>
      <li><a target="_blank" rel="noopener noreferrer" href="${source}mesa_storage/retrieval_scope.py">mesa_storage/retrieval_scope.py · d394784</a></li>
      <li><a target="_blank" rel="noopener noreferrer" href="${source}docs/retrieval-and-graph.md">docs/retrieval-and-graph.md · d394784</a></li>
      <li><a target="_blank" rel="noopener noreferrer" href="${source}mesa_memory/context_builder.py">mesa_memory/context_builder.py · d394784</a></li>
    </ul>
    <div class="actions">
      ${cta(t('API response reference', 'API yanıt referansı'), route('docs/core/api-reference/'))}
      ${cta(t('Graph and provenance', 'Çizge ve kaynak izi'), route('docs/core/graph/'), 'secondary')}
    </div>
  </section>
  ${footer()}
</main>`;
}

export function documentationJourney(route) {
  const journeyItems = [
    ['docs/core/getting-started/', 'Run locally', 'Yerelde çalıştırın', 'Model-disabled startup health check', 'Model kapalı başlangıç sağlık kontrolü'],
    ['architecture/', 'Understand the system', 'Sistemi anlayın', 'Canonical ownership and projections', 'Kanonik sahiplik ve projeksiyonlar'],
    ['retrieval/', 'Follow the evidence', 'Kanıtı izleyin', 'Four lanes, fusion and bounded context', 'Dört kanal, birleştirme ve sınırlı bağlam'],
    ['docs/core/examples/', 'Integrate V4', 'V4 entegre edin', 'SDK workflow and terminal state', 'SDK iş akışı ve terminal durum'],
    ['docs/core/operations/', 'Operate and recover', 'İşletin ve kurtarın', 'Readiness, backup and migration', 'Readiness, yedekleme ve migration']
  ];

  return `
<section class="section docs-reading-path">
  <p class="eyebrow">CORE v0.8.1 · d394784</p>
  <h2>${t('Choose a path through the contracts.', 'Sözleşmeler arasında bir yol seçin.')}</h2>
  <ol>
    ${journeyItems.map(([href, en, tr, desc, trDesc]) => `
    <li>
      <a href="${route(href)}">
        <strong>${t(en, tr)}</strong>
        <span>${t(desc, trDesc)}</span>
      </a>
    </li>`).join('')}
  </ol>
  ${paragraph(
    'Published source release · 18 October 2026. Production qualification remains NO-GO.',
    'Yayımlanmış kaynak sürümü · 18 Ekim 2026. Üretim yeterliliği NO-GO durumundadır.'
  )}
</section>`;
}

export function ecosystemMaturity() {
  const components = [
    ['MESA Core v0.8.1', 'Implemented · published source', 'Uygulanmış · yayımlanmış kaynak', 'Production qualification NO-GO; real-provider rehearsal and soak incomplete.', 'Üretim yeterliliği NO-GO; gerçek sağlayıcı provası ve dayanıklılık çalışması eksik.'],
    ['MESA Data v0.1.0', 'Implemented release pipeline', 'Uygulanmış yayın hattı', 'Reviewed Turkish legal sources; package version differs from its v1.0 release tag.', 'Gözden geçirilmiş Türk hukuk kaynakları; paket sürümü v1.0 yayın tag’inden farklıdır.'],
    ['MESA Law v0.1.0', 'In development · reference app', 'Geliştirme aşamasında · referans uygulama', 'Current CI failing; live Core v0.8.1 integration unverified. Research/draft/rebuild disabled.', 'Güncel CI başarısız; canlı Core v0.8.1 entegrasyonu doğrulanmadı. Research/draft/rebuild kapalı.'],
    ['MESA QA v0.1.0', 'Experimental evaluation tooling', 'Deneysel değerlendirme araçları', 'Latest first-write failure and historical candidate FAIL are not current qualification.', 'Son ilk-yazma hatası ve tarihsel aday FAIL güncel yeterlilik değildir.'],
    ['E2E Certification v0.1.0', 'Implemented harness · blocked profile', 'Uygulanmış harness · engelli profil', 'B4/B6/B7/B8 external receipts and a fresh official PASS remain absent.', 'B4/B6/B7/B8 dış receipt’leri ve yeni resmî PASS halen eksiktir.']
  ];

  return `
<section class="section">
  ${eyebrow('IMPLEMENTATION AND MATURITY', 'UYGULAMA VE OLGUNLUK')}
  ${title('A repository role is not production approval.', 'Depodaki rol, üretim onayı değildir.')}
  <div class="table-scroll" tabindex="0">
    <table class="maturity-table">
      <thead>
        <tr>
          <th>${t('Component', 'Bileşen')}</th>
          <th>${t('Verified state', 'Doğrulanan durum')}</th>
          <th>${t('Boundary', 'Sınır')}</th>
        </tr>
      </thead>
      <tbody>
        ${components.map(([name, en, tr, desc, trDesc]) => `
        <tr>
          <th scope="row">${name}</th>
          <td>${t(en, tr)}</td>
          <td>${t(desc, trDesc)}</td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>
</section>`;
}

export function coreRelease(route) {
  return `<section class="section" id="release-081">
    ${eyebrow('WHAT CHANGED · v0.8.1', 'NELER DEĞİŞTİ · v0.8.1')}
    ${title('Stronger boundaries. Clearer operations.', 'Daha güçlü sınırlar. Daha açık operasyonlar.')}
    <div class="storage-grid">
      ${row(t('Scoped retrieval', 'Kapsamlı retrieval'), 'BM25 statistics and audit queries use authorized tenant/dataset scope. RRF rejects non-finite weights.', 'BM25 istatistikleri ve denetim sorguları yetkili tenant/dataset kapsamını kullanır. RRF sonlu olmayan ağırlıkları reddeder.')}
      ${row(t('Storage ownership', 'Depolama sahipliği'), 'Fenced projection completion, safer dataset repair and consistent Kùzu rollback caches protect canonical ownership.', 'Fencing kontrollü projeksiyon tamamlanması, güvenli dataset onarımı ve tutarlı Kùzu rollback önbellekleri kanonik sahipliği korur.')}
      ${row(t('SDK and operations', 'SDK ve operasyon'), 'Sync/async insertion accepts legal_identity. Mutation polling defaults to two seconds; make health checks the running API.', 'Senkron/asenkron ekleme legal_identity kabul eder. Mutasyon sorgulama varsayılanı iki saniyedir; make health çalışan API’yi kontrol eder.')}
    </div>
    ${paragraph('The unused Core dashboard/showcase was removed. MCP control APIs and operator approval CLI remain. Consolidated guides replace duplicated installation, CLI, troubleshooting and upgrade documents.', 'Kullanılmayan Core dashboard/showcase kaldırıldı. MCP control API ve operatör onay CLI’ı korunur. Birleştirilmiş rehberler yinelenen kurulum, CLI, sorun giderme ve yükseltme belgelerinin yerini alır.')}
    <a href="${route('docs/core/release-notes/')}">${t('Read v0.8.1 release notes →', 'v0.8.1 sürüm notlarını okuyun →')}</a>
  </section>`;
}
