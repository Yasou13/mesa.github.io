import { detailedArchitecture } from './render_architecture.mjs';
// Editorial product views share one paired vocabulary with the static localization gate.
import { introTranslations, beginnerHome, developerFixture } from './render_intro.mjs';
export const productTranslations = introTranslations;
const t = (en, tr) => {
  productTranslations[en] = tr;
  return en;
};
const paragraph = (en, tr) => `<p>${t(en, tr)}</p>`;
const title = (en, tr) => `<h2>${t(en, tr)}</h2>`;
const eyebrow = (en, tr) => `<p class="eyebrow">${t(en, tr)}</p>`;
const row = (name, en, tr) => `<article><h3>${name}</h3>${paragraph(en, tr)}</article>`;
const source = 'https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/';

export function rankCalculator() {
  const lanes = [
    ['vector', 'Vector', 'Vektör'],
    ['bm25', 'BM25', 'BM25'],
    ['assertion', 'Assertion', 'Bilgi kaydı'],
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
    'Etkin kanallar aynı adayı ilk sıraya koyar; ağırlıklar 1.0 ve k=60’tır. Hesaplayıcı API çağrısı yapmaz; olasılık veya arama kalitesi ölçmez.'
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

export function architecturePage(helpers) { return detailedArchitecture({...helpers, t}); }

export function retrievalPage({ header, footer, route, cta, actionExample }) {
  return `
${header('architecture')}
<main id="main-content">
  <section class="page-hero compact page-hero--trajectory">
    ${eyebrow('MESA V4 · RETRIEVAL', 'MESA V4 · ARAMA')}
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
        'Bu bilgi kaydı sorguya yakın bir anlam taşıyor mu? Uyumlu sorgu embedding’i LanceDB bilgi kaydı arama görünümünü arar.'
      )}
      ${row(
        t('BM25 · passage and citation', 'BM25 · pasaj ve atıf'),
        'Does the evidence text contain useful terms or a scoped citation? FTS5 ranks passages; exact citation lookup contributes within the lane.',
        'Kanıt metni yararlı terimler veya kapsamlı atıf içeriyor mu? FTS5 pasajları sıralar; tam atıf araması kanal içinde katkı verir.'
      )}
      ${row(
        t('Assertion · structured relation', 'Bilgi kaydı · yapılandırılmış ilişki'),
        'Do subject, predicate, entity/literal object and evidence match? SQLite-owned relations provide a separate signal.',
        'Subject, predicate, entity/literal object ve kanıt eşleşiyor mu? SQLite’ın sahip olduğu ilişkiler ayrı sinyal sağlar.'
      )}
      ${row(
        t('Graph · supported path', 'Çizge · desteklenen yol'),
        'Is there a bounded relationship path supported by eligible canonical assertions? Paths retain supporting IDs and direction.',
        'Uygun asıl bilgi kayıtlarıla desteklenen sınırlı ilişki yolu var mı? Yollar destekleyen kimlikleri ve yönü korur.'
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
      'Tekrarlanan aday kanal başına bir oy verir. Eşitlikler aday kimliğiyle çözülür. Bir kanal uygun hit döndürmeyebilir. Bu örnek tek ilk-sıra adayı kullanır; arama motorunun tamamını simüle etmez.'
    )}
    ${rankCalculator()}
    ${paragraph(
      'Citation boosts apply inside lanes: BM25 exact +200, same statute +40; assertion exact +150, same statute +40. They affect lane order, not RRF increments. After fusion, a query-dependent legal factor is 1.5 for exact statute/article, 1.25 for the same statute, 0.25 for a competing statute, and 1.0 otherwise.',
      'Atıf artırımları kanal içinde uygulanır: BM25 tam eşleşme +200, aynı kanun +40; bilgi kaydı tam eşleşme +150, aynı kanun +40. Kanal sırasını etkiler; doğrudan RRF’ye eklenmez. Birleştirmeden sonra sorguya bağlı hukuk katsayısı tam kanun/madde için 1.5, aynı kanun için 1.25, rakip kanun için 0.25, diğer durumda 1.0’dır.'
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
        'Çizge araması en fazla 20 başlangıç düğümü, üç bağlantı adımı ve istenen 500 sonuçla sınırlıdır. İlerleme kümesi 64 düğümü, düğüm başına yayılım 32 bağlantıyı aşmaz. Varsayılan zaman aşımı 15 saniyedir. PageRank yalnızca izleme verisidir. Bu sınırlar, belirli bir hızda bütün sonuçların bulunacağını garanti etmez.'
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
        'Capability bayrakları çalışır desteği tanımlar. Yapılandırılmış vektör/çizge arka uç’inin beklenen hatası açık 503 döndürür. Yalnız arama görünümü yazan çizge adapter’ları komşu dolaşımı bildirmez.'
      )}
    </div>
  </section>

  ${developerFixture({actionExample})}

  <section class="section source-notes">
    ${title('Inspect the implementation.', 'Uygulamayı inceleyin.')}
    <ul>
      <li><a target="_blank" rel="noopener noreferrer" href="${source}mesa_storage/retrieval_scope.py">mesa_storage/retrieval_scope.py · 7062faf</a></li>
      <li><a target="_blank" rel="noopener noreferrer" href="${source}docs/retrieval-and-graph.md">docs/retrieval-and-graph.md · 7062faf</a></li>
      <li><a target="_blank" rel="noopener noreferrer" href="${source}mesa_memory/context_builder.py">mesa_memory/context_builder.py · 7062faf</a></li>
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
  <p class="eyebrow">CORE v0.9.0 · 7062faf</p>
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
