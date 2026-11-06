import { recordedExample } from './render_first_search.mjs';
import { passageMark, heroPassageArt } from './passage_mark.mjs';
// Public explanations follow Core v0.9.1 (e2f984d). Technical details live in docs.
export const introTranslations = {};
const t = (en, tr) => { introTranslations[en] = tr; return en; };
const p = (en, tr) => `<p>${t(en, tr)}</p>`;
const label = (en, tr) => `<p class="eyebrow">${t(en, tr)}</p>`;
const h = (en, tr) => `<h2>${t(en, tr)}</h2>`;
const source = 'https://github.com/Yasou13/MESA/blob/e2f984d4ad97c01782a347e29e44808e5a16dad3/';
const arrow = '<span class="explain-arrow" aria-hidden="true">→</span>';
const fileIcon = '<svg viewBox="0 0 32 38" aria-hidden="true" class="explain-file-icon"><path d="M5 1h14l8 8v28H5zM19 1v9h8M10 18h12M10 24h12M10 30h8"/></svg>';
const codeBlock = (id, code) => `<div class="start-code"><button type="button" class="copy-button" data-copy-target="${id}" aria-label="${t('Copy commands', 'Komutları kopyala')}">${t('Copy', 'Kopyala')}</button><pre tabindex="0"><code id="${id}">${code.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</code></pre></div>`;

// Decorative "document lines" inside cards: faint text lines, one marked as the found passage.
// Seeded, so builds are stable; widths are classes because the site CSP blocks inline styles.
function docLines(seed, lines = 4, marked = 1) {
  let state = seed * 9301 + 49297;
  const next = () => { state = (state * 9301 + 49297) % 233280; return state / 233280; };
  const rows = Array.from({length: lines}, (_, index) => `<i class="w${1 + Math.floor(next() * 5)}${index === marked ? ' hl' : ''}"></i>`).join('');
  return `<div class="doc-lines" aria-hidden="true">${rows}</div>`;
}
const warning = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4 21 20H3z"/><path d="M12 10v4M12 17h.01"/></svg>';
const check = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';

// "From documents to your model": many files in, MESA's steps, bounded context out.
// File names and sources are code (not translated), so each language gets its own.
function flowDiagram(language) {
  const tr = language === 'tr';
  const files = tr
    ? ['politikalar/', 'sozlesmeler/2026/', 'urun-notlari.md', 'destek-kayitlari/', 'toplanti-notlari.txt', 'mevzuat/', 'egitim-belgeleri/', 'sss.md']
    : ['policies/', 'contracts/2026/', 'product-notes.md', 'support-tickets/', 'meeting-notes.txt', 'regulations/', 'training/', 'faq.md'];
  const stages = [
    [t('Add', 'Ekle'), t('Documents enter once, with their source.', 'Belgeler kaynağıyla birlikte bir kez eklenir.')],
    [t('Split', 'Parçala'), t('Text becomes searchable passages; with a model, facts are extracted too.', 'Metin aranabilir pasajlara dönüşür; model varsa bilgi kayıtları da çıkarılır.')],
    [t('Keep versions', 'Sürümleri tut'), t('A change creates a new revision; the current one wins.', 'Değişiklik yeni sürüm oluşturur; güncel olan öne çıkar.')],
    [t('Search four ways', 'Dört yoldan ara'), t('Meaning, words, facts and relationships, within what the app may read.', 'Anlam, sözcük, bilgi kaydı ve ilişki; uygulamanın okuma yetkisi içinde.')],
    [t('Rank and limit', 'Sırala ve sınırla'), t('Results are combined and trimmed to fit the model.', 'Sonuçlar birleştirilir ve modele sığacak şekilde sınırlanır.')]
  ];
  const passages = [
    [t('“Returns are accepted within 30 days.”', '“İade süresi 30 gündür.”'), tr ? 'politikalar/iade.txt · v2' : 'policies/returns.txt · v2'],
    [t('“Refunds go back to the original payment method.”', '“Ücret, ödemenin yapıldığı yönteme iade edilir.”'), tr ? 'destek-rehberi.md · v5' : 'support-guide.md · v5'],
    [t('“Opened software cannot be returned.”', '“Açılmış yazılım iade edilemez.”'), tr ? 'politikalar/iade.txt · v2' : 'policies/returns.txt · v2']
  ];
  return `<div class="flow" role="region" tabindex="0" aria-label="${t('From documents to your model', 'Belgelerden modele')}">
    <div class="flow__col flow__docs"><p class="flow__label">${t('YOUR DOCUMENTS', 'BELGELERİNİZ')}</p><ul>${files.map(name => `<li><code>${name}</code></li>`).join('')}</ul><p class="flow__caption">${t('Many files, many versions, different teams.', 'Çok sayıda dosya, sürüm ve ekip.')}</p></div>
    <div class="flow__pipe" aria-hidden="true"><i></i></div>
    <div class="flow__col flow__core"><p class="flow__label">MESA</p><ol>${stages.map(([name, text]) => `<li><strong>${name}</strong><span>${text}</span></li>`).join('')}</ol></div>
    <div class="flow__pipe" aria-hidden="true"><i></i></div>
    <div class="flow__col flow__context"><p class="flow__label">${t('CONTEXT FOR YOUR MODEL', 'MODELİNİZE GİDEN BAĞLAM')}</p><p class="flow__question">${t('How many days do customers have to return a product?', 'Müşteri ürünü kaç gün içinde iade edebilir?')}</p><ul>${passages.map(([text, source]) => `<li><span>${text}</span><code>${source}</code></li>`).join('')}</ul><p class="flow__caption">${t('Your model writes the answer from this context.', 'Cevabı modeliniz bu bağlamdan yazar.')}</p></div>
  </div>`;
}

function quickstart(route) {
  return `<article class="path-card home-start" aria-labelledby="home-start-title">
      <div class="path-card__meta"><span class="path-card__when">${t('Today', 'Bugün')}</span><span class="path-card__kind">${t('LOCAL', 'YEREL')}</span></div>
      <h3 id="home-start-title">${t('Run MESA on your computer', 'MESA’yı bilgisayarınızda çalıştırın')}</h3>
      <p>${t('Install the package and start the server. Word search works without any model account.', 'Paketi kurun ve sunucuyu başlatın. Sözcük araması için model hesabı gerekmez.')}</p>
      <div class="home-start__terminal"><span>${t('Terminal · keep this window open', 'Terminal · bu pencere açık kalsın')}</span>${codeBlock('home-install', 'pip install mesa-memory==0.9.1\nmesa start')}</div>
      <p class="home-start-note">${t('Python 3.11–3.13 · Linux / macOS · Windows with WSL or Docker', 'Python 3.11–3.13 · Linux / macOS · Windows için WSL veya Docker')}</p>
      <div class="path-card__footer"><span>${t('New to terminals? The guide goes step by step.', 'Terminalde yeni misiniz? Rehber adım adım anlatır.')}</span><a href="${route('get-started/')}">${t('Step-by-step setup →', 'Adım adım kurulum →')}</a></div>
    </article>`;
}

export function beginnerHome({header, footer, route, cta, repos, language}) {
  const problemCards = [
    ['01', t('MEMORY', 'HAFIZA'), t('A large archive, organised', 'Büyük arşiv, düzenli hafıza'), t('MESA keeps your documents as searchable passages, so the model gets the relevant part, not the whole archive.', 'MESA belgelerinizi aranabilir pasajlar olarak saklar; modele bütün arşiv değil, ilgili kısım gider.'), t('Only what matters reaches the model.', 'Modele yalnızca gereken bilgi gider.'), 'architecture/', t('See the architecture →', 'Mimariyi inceleyin →'), true],
    ['02', t('REVISION', 'SÜRÜM'), t('The current version wins', 'Güncel sürüm öne çıkar'), t('When a document changes, searches return the new version once it is processed. The old one stays in history.', 'Bir belge değiştiğinde, işlendikten sonra aramalar yeni sürümü döndürür. Eskisi geçmişte kalır.'), t('MESA numbers every revision.', 'MESA her sürüme bir numara verir.'), 'how-it-works/#when-information-changes', t('See it in the example →', 'Örnekte görün →'), false],
    ['03', t('SOURCE', 'KAYNAK'), t('Every answer has a source', 'Her cevabın bir kaynağı var'), t('Your assistant can show which document and which passage supports what it says.', 'Asistanınız söylediğinin hangi belgeye ve hangi pasaja dayandığını gösterebilir.'), t('MESA returns the passage and its document.', 'MESA pasajı ve belgesini birlikte döndürür.'), 'how-it-works/', t('How search works →', 'Arama nasıl çalışır →'), false]
  ];
  const capabilities = [
    [t('Durable intake', 'Kalıcı kayıt'), t('Documents are accepted first and processed in the background. Nothing half-written reaches search.', 'Belgeler önce kabul edilir, sonra arka planda işlenir. Yarım kalmış hiçbir şey aramaya karışmaz.'), 'SQLite · LanceDB · Kùzu'],
    [t('Four ways to search', 'Dört arama yolu'), t('Meaning, exact words, extracted facts and relationships are searched together and combined into one ranking.', 'Anlam, birebir sözcük, çıkarılmış bilgi ve ilişkiler birlikte aranır ve tek bir sıralamada birleşir.'), 'vector · BM25 · assertion · graph'],
    [t('Scoped access', 'Kapsamlı erişim'), t('Each workspace, dataset and agent sees only what it is allowed to. Eligibility is checked before ranking.', 'Her çalışma alanı, veri kümesi ve ajan yalnızca izin verileni görür. Uygunluk, sıralamadan önce kontrol edilir.'), 'tenant · workspace · dataset · agent'],
    [t('Versions and history', 'Sürüm ve geçmiş'), t('Every change becomes a new revision. Search uses the current one; the history stays.', 'Her değişiklik yeni bir sürüm olur. Arama güncel olanı kullanır; geçmiş korunur.'), 'revision · COMMITTED'],
    [t('Context that fits', 'Modele sığan bağlam'), t('Results are trimmed to a token budget before they reach the model, with their sources attached.', 'Sonuçlar modele gitmeden önce bir token bütçesine göre kısaltılır; kaynakları yanlarında gider.'), 'token budget · evidence'],
    [t('Connect from anywhere', 'Her yerden bağlanın'), t('The CLI, Python SDK, HTTP API and MCP all reach the same memory.', 'CLI, Python SDK, HTTP API ve MCP aynı hafızaya ulaşır.'), 'CLI · SDK · HTTP · MCP']
  ];
  const uses = [
    [t('Law firms and legal teams', 'Hukuk büroları ve hukuk ekipleri'), t('Case files, contracts, legislation and court decisions in one memory; every answer points to its passage. MESA Data and MESA Law are being built for this and are still in development.', 'Dava dosyaları, sözleşmeler, mevzuat ve mahkeme kararları tek bir hafızada; her cevap dayandığı pasajı gösterir. Bunun için geliştirilen MESA Data ve MESA Law hâlâ geliştirme aşamasında.'), [t('Case files', 'Dava dosyaları'), t('Contracts', 'Sözleşmeler'), t('Legislation', 'Mevzuat'), t('Court decisions', 'İçtihat')], true],
    [t('Enterprise knowledge', 'Kurumsal bilgi yönetimi'), t('Procedures, policies and notes from many departments, searched by assistants that only see what each team may read.', 'Birçok departmandan prosedür, politika ve notlar; her ekibin yalnızca kendi görebileceğini gören asistanlarla aranır.'), [t('Procedures', 'Prosedürler'), t('Policies', 'Politikalar'), t('Team notes', 'Ekip notları')], false],
    [t('Customer support', 'Müşteri desteği'), t('Product documents and past tickets give support assistants the current answer, not last year’s.', 'Ürün belgeleri ve geçmiş destek kayıtları, destek asistanlarına geçen yılın değil güncel cevabı verir.'), [t('Product docs', 'Ürün belgeleri'), t('Support tickets', 'Destek kayıtları'), t('FAQ', 'SSS')], false],
    [t('Compliance and audit', 'Uyum ve denetim'), t('Regulations and internal rules change; revision history shows which version an answer relied on.', 'Mevzuat ve iç kurallar değişir; sürüm geçmişi bir cevabın hangi sürüme dayandığını gösterir.'), [t('Regulations', 'Yönetmelikler'), t('Internal rules', 'İç kurallar'), t('Audit records', 'Denetim kayıtları')], false],
    [t('Research and analysis', 'Araştırma ve analiz'), t('Reports and papers stay searchable by meaning and by exact terms, with the source of every finding.', 'Raporlar ve makaleler hem anlama hem birebir terime göre aranır; her bulgunun kaynağı bellidir.'), [t('Reports', 'Raporlar'), t('Papers', 'Makaleler'), t('Field notes', 'Saha notları')], false],
    [t('AI agents', 'Yapay zekâ ajanları'), t('Agents keep what they learned across sessions and restarts, kept apart per agent and workspace.', 'Ajanlar öğrendiklerini oturumlar ve yeniden başlatmalar boyunca, ajan ve çalışma alanı bazında ayrı tutar.'), [t('Session notes', 'Oturum notları'), t('Task history', 'Görev geçmişi')], false]
  ];
  const satellites = [
    ['MESA Data', 'data/', t('Prepares legal source documents.', 'Hukuk kaynaklarını hazırlar.'), t('Optional for your own documents.', 'Kendi belgeleriniz için zorunlu değildir.')],
    ['MESA Law', 'law/', t('Uses Core in a legal application.', 'Core’u bir hukuk uygulamasında kullanır.'), t('Under development; live integration is not yet verified.', 'Geliştirme aşamasında; canlı bağlantısı henüz doğrulanmadı.')],
    ['MESA QA', 'qa/', t('Tests memory behavior.', 'Hafızanın davranışını test eder.'), t('A test tool, not part of every query.', 'Her sorguda çalışan bir parça değil, test aracıdır.')],
    ['E2E Certification', 'certification/', t('Checks a complete test setup.', 'Bütün bir test kurulumunu değerlendirir.'), t('No completed production approval.', 'Tamamlanmış bir üretim onayı yoktur.')]
  ];
  const scope = [
    [t('Text input', 'Metin girişi'), t('The CLI reads UTF-8 text files. Convert PDF and Word files to text first.', 'CLI, UTF-8 metin dosyalarını okur. PDF ve Word dosyalarını önce metne dönüştürün.')],
    [t('Local data', 'Yerel veri'), t('Data is stored in ~/.mesa/data. Models and external providers are off by default; this is not a full network-isolation guarantee.', 'Veri ~/.mesa/data altında saklanır. Modeller ve dış sağlayıcılar başlangıçta kapalıdır; bu tam ağ yalıtımı garantisi değildir.')],
    [t('Optional models', 'İsteğe bağlı modeller'), t('Meaning search and fact extraction need a model provider, which can receive data and charge for use.', 'Anlam araması ve bilgi çıkarımı bir model sağlayıcısı ister; sağlayıcı veri alabilir ve ücret doğurabilir.')],
    [t('Size limit', 'Boyut sınırı'), t('The document HTTP API accepts up to 5,000,000 UTF-8 bytes per request.', 'Belge HTTP API’si istek başına en fazla 5.000.000 UTF-8 bayt kabul eder.')]
  ];
  return `${header('home')}<main id="main-content" class="home-page intro-page simple-public home-v2">
    <section class="hero hero--home home-hero scene scene--event-horizon" data-scene="event-horizon" data-home-section="hero" aria-labelledby="home-title">${heroPassageArt()}
      <p class="eyebrow">${t('OPEN SOURCE · v0.9.1 ALPHA', 'AÇIK KAYNAK · v0.9.1 ALFA')}</p>
      <h1 id="home-title">${t('Scattered documents go in.', 'Dağınık belgeler girer.')}<br><em class="accent-word">${t('Your model gets the right information.', 'Modelinize doğru bilgi çıkar.')}</em></h1>
      <p class="home-hero__lead">${t('MESA turns large, scattered document collections into lasting memory for your AI. When a question comes in, it finds what matters, picks the current version and hands it to your model as the right context.', 'MESA, büyük ve dağınık belge koleksiyonlarınızı yapay zekânız için kalıcı bir hafızaya dönüştürür. Bir soru geldiğinde önemli olanı bulur, güncel sürümü seçer ve modelinize doğru bağlam olarak verir.')}</p>
      <div class="actions">${cta(t('Try it on your computer', 'Bilgisayarınızda deneyin'), '#start')}${cta(t('See how it works', 'Nasıl çalıştığını görün'), '#how-it-works', 'secondary')}</div>
      <div class="home-hero__connects"><span class="home-hero__label">${t('CONNECTS THROUGH', 'BAĞLANMA YOLLARI')}</span><ul><li><a href="${route('docs/core/cli-reference/')}">MESA CLI</a></li><li><a href="${route('docs/core/examples/')}">Python SDK</a></li><li><a href="${route('docs/core/api-reference/')}">HTTP API</a></li><li><a href="${route('docs/mcp/')}">MCP</a></li></ul></div>
      <div class="home-release"><span class="chip chip--accent">${t('v0.9.1 · Alpha', 'v0.9.1 · Alfa')}</span><p>${t('Ready for local evaluation, not yet for production.', 'Yerel değerlendirmeye hazır, canlı kullanıma henüz değil.')}</p><a href="${route('status/')}">${t('Project status →', 'Proje durumu →')}</a></div>
    </section>

    <section class="band band--graphite home-flow" id="mesa-in-action" data-home-section="flow" aria-labelledby="flow-title">
      <div class="band__inner">
        <p class="eyebrow">${t('FROM DOCUMENTS TO YOUR MODEL', 'BELGELERDEN MODELE')}</p><h2 id="flow-title">${t('One memory between your archive and your model.', 'Arşiviniz ile modeliniz arasında tek bir hafıza.')}</h2>
        ${flowDiagram(language)}
        <p class="flow-note">${t('Illustrative flow, not a live query.', 'Örnek akıştır, canlı sorgu değildir.')} <a href="${route('how-it-works/#example')}">${t('See a recorded real run →', 'Gerçek bir çalıştırma kaydını görün →')}</a></p>
      </div>
    </section>

    <section class="band home-problem" id="the-problem" data-home-section="problem" aria-labelledby="problem-title">${passageMark(3, 'trail-r passage-mark--low')}${passageMark(6, 'trail-l passage-mark--top', {marked: false})}
      <div class="band__inner">
        <div class="home-problem__head">
          <div><p class="eyebrow">${t('THE PROBLEM', 'SORUN')}</p><h2 id="problem-title">${t('The more documents you have,', 'Belgeleriniz çoğaldıkça,')} <em class="accent-word">${t('the harder the right one is to find.', 'doğrusunu bulmak zorlaşır.')}</em></h2><p class="home-problem__lead">${t('A language model only knows what is in front of it. A whole archive does not fit into a prompt, so something has to pick the right passages every time.', 'Bir dil modeli yalnızca önüne konan metni bilir. Bütün bir arşiv isteme sığmaz; her seferinde doğru pasajları seçen bir şey gerekir.')}</p></div>
          <ul class="problem-flags" aria-label="${t('Common problems', 'Sık görülen sorunlar')}"><li>${warning}<span>${t('The whole archive does not fit.', 'Bütün arşiv bağlama sığmıyor.')}</span></li><li>${warning}<span>${t('Uses an outdated document.', 'Eski belgeyi kullanıyor.')}</span></li><li>${warning}<span>${t('Forgets what it learned yesterday.', 'Dün öğrendiğini unutuyor.')}</span></li></ul>
        </div>
        <div class="problem-cards">${problemCards.map(([n, kind, title, text, fix, href, more, accent], index) => `<article class="problem-card"><div class="problem-card__body"><p class="card-index"><span>${n}</span><span class="card-index__kind">${kind}</span></p><h3>${title}</h3><p>${text}</p><p class="problem-card__fix">${check}<span>${fix}</span></p><a class="text-link" href="${href.startsWith('#') ? href : route(href)}">${more}</a></div>${docLines(index + 2, 4, index + 1)}</article>`).join('')}</div>
      </div>
    </section>

    <section class="band band--graphite home-how" id="how-it-works" data-home-section="how" aria-labelledby="how-title"><span id="why-mesa"></span>
      <div class="band__inner">
        <p class="eyebrow">${t('WHAT MESA DOES', 'MESA NE YAPAR')}</p><h2 id="how-title">${t('Designed to be the memory of', 'Büyük sistemlerin')} <em class="accent-word">${t('larger systems.', 'hafızası olmak için tasarlandı.')}</em></h2>
        <p class="home-how__lead">${t('Many applications, agents and teams can share one memory. MESA keeps it organised, current and limited to what each of them may read.', 'Birçok uygulama, ajan ve ekip aynı hafızayı paylaşabilir. MESA onu düzenli, güncel ve her birinin yalnızca okuyabileceğiyle sınırlı tutar.')}</p>
        <div class="capabilities" role="region" tabindex="0" aria-label="${t('What MESA does', 'MESA ne yapar')}">${capabilities.map(([title, text, tag], index) => `<article class="capability"><span class="capability__index">0${index + 1}</span><h3>${title}</h3><p>${text}</p><code>${tag}</code></article>`).join('')}</div>
        <p class="how-note"><strong>${t('Good to know:', 'Bilmekte fayda var:')}</strong> ${t('your own model writes the answer. MESA gives it the right text.', 'cevabı sizin modeliniz yazar. MESA ona doğru metni verir.')}</p>
        <div class="home-how__links"><a class="text-link" href="${route('architecture/')}">${t('See the architecture →', 'Mimariyi inceleyin →')}</a><a class="text-link" href="${route('how-it-works/')}">${t('Follow the document lifecycle →', 'Belgenin yaşam döngüsünü inceleyin →')}</a></div>
      </div>
    </section>

    <section class="band home-path" id="start" data-home-section="start" aria-labelledby="path-title">${passageMark(4, 'trail-l passage-mark--mid')}
      <div class="band__inner">
        <p class="eyebrow">${t('YOUR FIRST SUCCESSFUL SEARCH', 'İLK BAŞARILI ARAMANIZ')}</p><h2 id="path-title">${t('Start small. Grow when you need to.', 'Küçük başlayın. Gerektikçe büyütün.')}</h2>
        <div class="path-cards">
          ${quickstart(route)}
          <article class="path-card">
            <div class="path-card__meta"><span class="path-card__when">${t('Next', 'Sonra')}</span><span class="path-card__kind">${t('CONNECT', 'BAĞLAN')}</span></div>
            <h3>${t('Connect your application', 'Uygulamanıza bağlayın')}</h3>
            <p>${t('Call MESA from your code. Pick the path that fits your stack.', 'MESA’yı kodunuzdan çağırın. Size uyan yolu seçin.')}</p>
            <ul class="path-links"><li><a href="${route('docs/core/examples/')}"><strong>Python SDK</strong><span>${t('Use MESA in your Python application', 'Python uygulamanızdan kullanın')}</span></a></li><li><a href="${route('docs/core/api-reference/')}"><strong>HTTP API</strong><span>${t('Connect another application', 'Başka bir uygulamadan bağlanın')}</span></a></li><li><a href="${route('docs/mcp/')}"><strong>MCP</strong><span>${t('Connect an AI client', 'Bir yapay zekâ istemcisi bağlayın')}</span></a></li></ul>
          </article>
          <article class="path-card path-card--featured">
            <div class="path-card__meta"><span class="path-card__when">${t('If needed', 'Gerekirse')}</span><span class="path-card__kind">${t('SPECIALIZE', 'UYARLA')}</span></div>
            <h3>${t('Adapt it to your field', 'Alanınıza uyarlayın')}</h3>
            <p>${t('The legal example adds Turkish legal data and a legal workspace. Both are optional and still in development.', 'Hukuk örneği Türk hukuk verisini ve bir hukuk çalışma alanını ekler. İkisi de isteğe bağlıdır ve hâlâ geliştirme aşamasındadır.')}</p>
            <ul class="path-links"><li><a href="${route('data/')}"><strong>MESA Data</strong><span>${t('Prepares legal source documents.', 'Hukuk kaynaklarını hazırlar.')}</span></a></li><li><a href="${route('law/')}"><strong>MESA Law</strong><span>${t('Uses Core in a legal application.', 'Core’u bir hukuk uygulamasında kullanır.')}</span></a></li></ul>
          </article>
        </div>
      </div>
    </section>

    <section class="band band--graphite home-uses" id="use-cases" data-home-section="use-cases" aria-labelledby="uses-title">
      <div class="band__inner">
        <p class="eyebrow">${t('WHERE IT FITS', 'NEREDE İŞE YARAR')}</p><h2 id="uses-title">${t('For organisations that', 'Belgelerle çalışan')} <em class="accent-word">${t('run on documents.', 'her kurum için.')}</em></h2>
        <p class="home-uses__lead">${t('Wherever large document collections have to feed AI reliably. These are fitting scenarios, not customer references.', 'Büyük belge koleksiyonlarının yapay zekâyı güvenilir biçimde beslemesi gereken her yerde. Bunlar uygun senaryolardır, müşteri referansı değildir.')}</p>
        <div class="practical-uses use-grid" role="region" tabindex="0" aria-label="${t('Use cases', 'Kullanım alanları')}">${uses.map(([name, text, docs, featured]) => `<article class="use-card${featured ? ' use-card--featured' : ''}"><h3>${name}</h3><p>${text}</p><ul class="use-card__docs">${docs.map(doc => `<li>${doc}</li>`).join('')}</ul></article>`).join('')}</div>
      </div>
    </section>

    <section class="band home-ecosystem" id="ecosystem" data-home-section="ecosystem" aria-labelledby="eco-title">${passageMark(9, 'trail-r passage-mark--top', {marked: false})}${passageMark(7, 'trail-l passage-mark--low')}
      <div class="band__inner">
        <p class="eyebrow">${t('THE PROJECTS', 'PROJELER')}</p><h2 id="eco-title">${t('Start with Core. Add the rest only if you need it.', 'Core ile başlayın. Gerisini yalnızca gerekirse ekleyin.')}</h2>
        <div class="eco-map">
          <a class="eco-core" href="${route('architecture/')}"><span class="card-index">${t('THE CENTER', 'MERKEZ')}</span><strong>MESA Core</strong><span>${t('Stores and searches your documents.', 'Belgelerinizi saklar ve arar.')}</span><span>${t('Start here to build with MESA.', 'MESA kullanmak için buradan başlayın.')}</span></a>
          <div class="eco-satellites">${satellites.map(([name, path, role, note]) => `<a href="${route(path)}"><strong>${name}</strong><span>${role}</span><small>${note}</small></a>`).join('')}</div>
        </div>
        <a class="text-link" href="${route('ecosystem/')}">${t('What Core, Data, Law and the tests do →', 'Core, Data, Law ve testlerin görevleri →')}</a>
      </div>
    </section>

    <section class="band band--graphite home-scope" id="scope" data-home-section="scope" aria-labelledby="scope-title">
      <div class="band__inner">
        <p class="eyebrow">${t('BEFORE YOU TRY IT', 'DENEMEDEN ÖNCE')}</p><h2 id="scope-title">${t('What works, and what you need.', 'Neler çalışır, nelere ihtiyacınız var?')}</h2>
        <dl class="scope-grid">${scope.map(([name, text]) => `<div><dt>${name}</dt><dd>${text}</dd></div>`).join('')}</dl>
        <div class="scope-links"><a href="${route('docs/core/configuration/')}">${t('Product data and model settings →', 'Ürün verisi ve model ayarları →')}</a><a href="${route('privacy/')}">${t('Website forms and analytics →', 'Web sitesi formları ve istatistikleri →')}</a></div>
      </div>
    </section>

    <section class="band home-cta" data-home-section="cta" aria-labelledby="cta-title">${passageMark(5, 'trail-l passage-mark--mid')}${passageMark(8, 'trail-r passage-mark--top', {marked: false})}
      <div class="band__inner">
        <p class="eyebrow">${t('GET STARTED', 'BAŞLAYIN')}</p><h2 id="cta-title">${t('Try it with', 'Kendi belgelerinizle')} <em class="accent-word">${t('your own documents.', 'deneyin.')}</em></h2>
        <div class="actions">${cta(t('Step-by-step setup', 'Adım adım kurulum'), route('get-started/'))}${cta('GitHub', repos.core, 'secondary', true)}</div>
        <p class="home-cta__line"><code>$ pip install mesa-memory==0.9.1</code><span>·</span><span>${t('Open source · MIT', 'Açık kaynak · MIT')}</span></p>
      </div>
    </section>${footer()}</main>`;
}

export function beginnerHow({header, footer, route, cta, language}) {
  return `${header('how')}<main id="main-content" class="intro-page simple-public intro-how">
    <section class="page-hero compact page-hero--short">${label('HOW IT WORKS · ONE EXAMPLE', 'NASIL ÇALIŞIR? · TEK BİR ÖRNEK')}<h1>${t('What happens to the document you add?', 'Eklediğiniz belgeye ne olur?')}</h1>${p('Follow one shop policy from a file on your computer to the text your assistant uses. The example below explains the process; it does not run a live MESA query.', 'Bilgisayarınızdaki bir mağaza koşulları dosyasının, asistanınızın kullanacağı bilgiye nasıl dönüştüğünü izleyin. Aşağıdaki örnek süreci açıklar; canlı MESA sorgusu çalıştırmaz.')}</section>
    <section class="section walkthrough-section" id="memory-walkthrough" aria-label="${t('A document in three steps', 'Üç adımda bir belge')}">
      <article class="walkthrough-step"><div class="walkthrough-number">01</div><div class="walkthrough-copy"><h2>${t('You add a text file.', 'Bir metin dosyası eklersiniz.')}</h2><p>${t('Save the policy as policy.txt, then add it with mesa add. MESA keeps the text and a reference to this source.', 'Koşulları policy.txt olarak kaydedip mesa add komutuyla eklersiniz. MESA metni ve bu kaynağa ait bilgileri saklar.')}</p><code>mesa add policy.txt --source file://policy.txt</code></div><div class="walkthrough-example"><div class="explain-file">${fileIcon}<strong><code>policy.txt</code><small>${t('Version 1', 'Sürüm 1')}</small></strong></div><blockquote>${t('“Returns are accepted within 14 days. Keep your receipt.”', '“İade süresi 14 gündür. Fişinizi saklayın.”')}</blockquote></div></article>
      <article class="walkthrough-step" id="inside-core"><div class="walkthrough-number">02</div><div class="walkthrough-copy"><h2>${t('MESA prepares the text for search.', 'MESA metni aranabilir hâle getirir.')}</h2><p>${t('It divides the document into smaller passages, keeps their source and processes the work in the background. Adding a file starts this work; search it once processing is complete.', 'Belgeyi küçük metin parçalarına ayırır, her parçanın kaynağını korur ve arka planda işler. Dosyayı eklemek bu işlemi başlatır; işleme tamamlanınca belgede arama yapabilirsiniz.')}</p></div><div class="walkthrough-example process-notebook"><span class="intro-index">MESA Core</span><ol><li><span>${t('Source file', 'Kaynak dosya')}</span><strong><code>policy.txt · v1</code></strong></li><li><span>${t('Stored text', 'Saklanan metin')}</span><strong>${t('Returns: 14 days. Keep the receipt.', 'İade: 14 gün. Fişi saklayın.')}</strong></li><li><span>${t('Source link', 'Kaynak bağı')}</span><strong>${t('Every passage points back to this file.', 'Her parça bu dosyaya bağlı kalır.')}</strong></li></ol></div></article>
      <article class="walkthrough-step" id="finding-evidence"><div class="walkthrough-number">03</div><div class="walkthrough-copy"><h2>${t('Your application asks a question.', 'Uygulamanız bir soru sorar.')}</h2><p>${t('MESA searches the data this application is allowed to read. It returns the relevant text, document and version. Your application’s model uses that text to write the answer.', 'MESA, uygulamanın okumaya yetkili olduğu verilerde arama yapar. İlgili metni, belgeyi ve sürümünü döndürür. Uygulamanızın modeli bu metni kullanarak yanıtı yazar.')}</p><code>mesa search "returns"</code></div><div class="walkthrough-example" id="source-trail"><div class="explain-question">${t('How long do I have to return it?', 'Kaç gün içinde iade edebilirim?')}</div><span class="intro-index">${t('TEXT FOUND BY MESA', 'MESA’NIN BULDUĞU METİN')}</span><blockquote>${t('“Returns are accepted within 14 days.”', '“İade süresi 14 gündür.”')}</blockquote><div class="explain-source"><span>${t('Source', 'Kaynak')}</span><strong><code>policy.txt · v1</code></strong></div></div></article>
    </section>
    <section class="section how-recorded">${recordedExample({t, route, language})}</section>
    <section class="section change-example" id="when-information-changes">${label('IF THE DOCUMENT CHANGES', 'BELGE DEĞİŞİRSE')}${h('The new version becomes the current source.', 'Yeni sürüm, güncel kaynak olur.')}${p('Suppose the shop changes its return policy. Once the new document version is processed, current searches use the new information instead of the superseded version.', 'Mağaza iade koşullarını değiştirdi diyelim. Yeni belge sürümü işlendikten sonra güncel aramalar, eski sürümün yerine yeni bilgiyi kullanır.')}<div class="revision-comparison"><div><span>${t('Old version · history', 'Eski sürüm · geçmişte')}</span><strong>${t('14 days', '14 gün')}</strong><code>policy.txt · v1</code></div><span class="revision-comparison__arrow" aria-hidden="true">→</span><div><span>${t('New version · current', 'Yeni sürüm · güncel')}</span><strong>${t('30 days', '30 gün')}</strong><code>policy.txt · v2</code></div></div><p class="intro-caption">${t('To update or delete a source in your application, follow the document lifecycle API.', 'Uygulamanızda bir kaynağı güncellemek veya silmek için belge yaşam döngüsü API’sini izleyin.')} <a href="${route('docs/core/api-reference/')}">${t('Document API →', 'Belge API’si →')}</a></p></section>
    <section class="section plain-boundary"><h2>${t('What does the first installation give you?', 'İlk kurulumda ne çalışır?')}</h2><p>${t('Word search works without a model. To find similar meanings or extract relationships, configure a model provider. MESA returns source material; it does not write the final answer.', 'Sözcük araması model olmadan çalışır. Benzer anlamları bulmak veya ilişkileri çıkarmak için bir model sağlayıcısı ayarlarsınız. MESA kaynak metni döndürür; son yanıtı kendisi yazmaz.')}</p><div class="actions">${cta(t('Try this on your computer', 'Bilgisayarınızda deneyin'), route('get-started/'))}${cta(t('See the technical diagrams', 'Teknik şemaları görün'), route('architecture/'), 'secondary')}</div></section>${footer()}</main>`;
}

export function beginnerEcosystem({header,footer,route,repos}) {
  const projects = [
    ['Core','docs/core/',repos.core,t('Stores and searches your documents.', 'Belgelerinizi saklar ve arar.'),t('Input: your source text. Output: matching passages with their source.', 'Girdi: kaynak metin. Çıktı: kaynağı belli olan arama sonuçları.'),t('Start here to build with MESA.', 'MESA kullanmak için buradan başlayın.')],
    ['Data','data/',repos.data,t('Prepares legal source documents.', 'Hukuk kaynaklarını hazırlar.'),t('Input: reviewed legal sources. Output: a versioned data release for Core.', 'Girdi: incelenmiş hukuk kaynakları. Çıktı: Core’a aktarılacak sürümlü veri paketi.'),t('Optional for your own documents.', 'Kendi belgeleriniz için zorunlu değildir.')],
    ['Law','law/',repos.law,t('Uses Core in a legal application.', 'Core’u bir hukuk uygulamasında kullanır.'),t('Adds case files, documents and review screens around the memory service.', 'Hafıza servisinin çevresine dava dosyaları, belgeler ve inceleme ekranları ekler.'),t('Under development; live integration is not yet verified.', 'Geliştirme aşamasında; canlı bağlantısı henüz doğrulanmadı.')],
    ['QA','qa/',repos.qa,t('Tests memory behavior.', 'Hafızanın davranışını test eder.'),t('Checks saving, updates, deletion and behavior after a restart.', 'Kaydetme, güncelleme, silme ve yeniden başlatma sonrası davranışları kontrol eder.'),t('A test tool, not part of every query.', 'Her sorguda çalışan bir parça değil, test aracıdır.')],
    ['E2E Certification','certification/',repos.certification,t('Checks a complete test setup.', 'Bütün bir test kurulumunu değerlendirir.'),t('Collects evidence across projects and checks required pass/fail conditions.', 'Projelerden test kayıtlarını toplar ve geçme koşullarını kontrol eder.'),t('No completed production approval.', 'Tamamlanmış bir üretim onayı yoktur.')]
  ];
  return `${header('ecosystem')}<main id="main-content" class="intro-page simple-public ecosystem-page"><section class="page-hero compact page-hero--short">${label('THE MESA REPOSITORIES', 'MESA DEPOLARI')}<h1>${t('Which MESA project do you need?', 'Hangi MESA projesi ne işe yarar?')}</h1>${p('Start with Core to add memory to your application. Data and Law serve the legal example; QA and E2E Certification test the projects. You do not need to install all five.', 'Uygulamanıza hafıza eklemek için Core ile başlayın. Data ve Law hukuk örneği için, QA ve E2E Certification ise test için geliştirilir. Beşini birden kurmanız gerekmez.')}</section>
    <section class="section" aria-labelledby="ecosystem-map-title"><h2 id="ecosystem-map-title">${t('Core connects your documents to your application.', 'Core, belgeleriniz ile uygulamanız arasında çalışır.')}</h2><figure class="explain-diagram ecosystem-diagram"><figcaption><span class="intro-index">${t('USING YOUR OWN DOCUMENTS', 'KENDİ BELGELERİNİZİ KULLANIRKEN')}</span><strong>${t('Three parts are enough to understand the system.', 'Sistemi anlamak için üç parça yeterli.')}</strong></figcaption><div class="explain-path"><div class="explain-card"><span class="intro-index">${t('INPUT', 'GİRDİ')}</span><div class="explain-file">${fileIcon}<h3>${t('Your documents', 'Belgeleriniz')}</h3></div><p>${t('Notes, policies or product documents you choose to add.', 'Eklemeyi seçtiğiniz notlar, kurallar veya ürün belgeleri.')}</p></div>${arrow}<div class="explain-card explain-card--core"><span class="intro-index">${t('MEMORY', 'HAFIZA')}</span><h3>MESA Core</h3><p>${t('Stores the text. Finds relevant passages. Keeps the source.', 'Metni saklar. İlgili parçaları bulur. Kaynağı korur.')}</p><a href="${route('get-started/')}">${t('Install Core →', 'Core’u kurun →')}</a></div>${arrow}<div class="explain-card"><span class="intro-index">${t('APPLICATION', 'UYGULAMA')}</span><h3>${t('Your assistant', 'Asistanınız')}</h3><p>${t('Asks Core for information and uses it to answer the user.', 'Core’dan bilgi ister, bu bilgiyi kullanıcıya yanıt vermek için kullanır.')}</p><small><code>Python SDK · HTTP · MCP</code></small></div></div><div class="ecosystem-test-rail"><span>${t('TESTS RUN SEPARATELY', 'TESTLER AYRI ÇALIŞIR')}</span><a href="${route('qa/')}">MESA QA</a><span aria-hidden="true">+</span><a href="${route('certification/')}">E2E Certification</a><p>${t('They check the system; they do not carry each user question.', 'Sistemi kontrol ederler; her kullanıcı sorusu bu araçlardan geçmez.')}</p></div></figure></section>
    <section class="section"><h2>${t('The legal example adds Data and Law.', 'Hukuk örneğinde Data ve Law eklenir.')}</h2><p>${t('Data prepares legal sources; Core stores and searches them; Law provides the legal workspace. This is one application of MESA, not a required installation chain.', 'Data hukuk kaynaklarını hazırlar, Core saklayıp arar, Law ise hukuk çalışma ekranlarını sağlar. Bu, MESA’nın bir kullanım örneğidir; zorunlu kurulum sırası değildir.')}</p><ol class="legal-simple-path"><li><strong>MESA Data</strong><span>${t('Prepare the source', 'Kaynağı hazırla')}</span></li><li><strong>MESA Core</strong><span>${t('Store and search', 'Sakla ve ara')}</span></li><li><strong>MESA Law</strong><span>${t('Use it in legal work', 'Hukuk işinde kullan')}</span></li></ol></section>
    <section class="section repo-directory"><h2>${t('Open the repository you need.', 'İhtiyacınız olan depoyu açın.')}</h2>${projects.map(([name,path,repo,role,task,status])=>`<article><div><h3>${name === 'E2E Certification' ? name : 'MESA '+name}</h3><strong>${role}</strong></div><div><p>${task}</p><small>${status}</small></div><div class="repo-directory__links"><a href="${route(path)}">${t('Read the guide →', 'Açıklamayı oku →')}</a><a href="${repo}" target="_blank" rel="noopener noreferrer"><span>GitHub</span> <span aria-hidden="true">↗</span></a></div></article>`).join('')}<a class="text-link" href="${route('status/')}">${t('Versions, test results and current limits →', 'Sürümler, test sonuçları ve güncel sınırlar →')}</a></section>${footer()}</main>`;
}

export function developerFixture({actionExample}) {
  return `<section class="section" id="verified-example">${label('FOR DEVELOPERS · CONTRACT TEST', 'GELİŞTİRİCİLER İÇİN · SÖZLEŞME TESTİ')}<details class="intro-technical"><summary>${t('Show the repository test and source references', 'Depo testini ve kaynakları göster')}</summary><div>${p('Core has a deterministic contract fixture: one “Alice knows Aurora” assertion ranks first in all four lanes, with RRF = 4/61 under explicit unit weights (the runtime vector default is 8.0). It uses real SQLite and Kùzu with mock vectors; it is not a quality benchmark.', 'Core’da deterministik bir sözleşme testi bulunur: “Alice knows Aurora” kaydı dört kanalda da ilk sıradadır ve açıkça seçilmiş birim ağırlıklarda RRF = 4/61 olur (çalışma zamanı vektör varsayılanı 8.0’dır). Gerçek SQLite ve Kùzu ile mock vektörler kullanılır; kalite karşılaştırması değildir.')}${actionExample(true)}<div class="intro-proof-links"><a href="${source}docs/architecture-v4.md" target="_blank" rel="noopener noreferrer">${t('Core architecture ↗', 'Core mimarisi ↗')}</a><a href="${source}docs/retrieval-and-graph.md" target="_blank" rel="noopener noreferrer">${t('Retrieval contract ↗', 'Arama sözleşmesi ↗')}</a><a href="${source}tests/test_v4_independent_retrieval_audit.py" target="_blank" rel="noopener noreferrer">${t('Exact fixture test ↗', 'Gerçek test örneği testi ↗')}</a></div><p class="intro-caption">${t('Source baseline: Core v0.9.1.', 'Kaynak temeli: Core v0.9.1.')}</p></div></details></section>`;
}

export function beginnerFaq({header,footer,route,cta}) {
  const questions = [
    [t('What is MESA?', 'MESA nedir?'), t('A tool that stores and searches documents for the AI application you build. It returns relevant text with the document it came from.', 'Geliştirdiğiniz yapay zekâ uygulaması için belgeleri saklayıp arayan bir araçtır. İlgili metni, geldiği belgeyle birlikte döndürür.')],
    [t('Who is it for?', 'Kimin için?'), t('Developers building an assistant, a research tool or an agent that needs to use saved information. MESA is not a ready-made chat application.', 'Kaydedilmiş bilgiyi kullanacak asistan, araştırma aracı veya ajan geliştiren yazılımcılar için. MESA hazır bir sohbet uygulaması değildir.')],
    [t('Does MESA write the answer?', 'MESA yanıtı kendisi mi yazar?'), t('No. It finds the text your application needs. Your application and its language model use that text to write the answer.', 'Hayır. Uygulamanızın ihtiyaç duyduğu metni bulur. Yanıtı, bu metni kullanan uygulamanız ve onun dil modeli yazar.')],
    [t('Do I need a model account?', 'Model hesabı gerekiyor mu?'), t('Not for basic word search. Add a model provider if you want meaning search or automatic extraction of facts and relationships.', 'Temel sözcük araması için gerekmez. Anlama göre arama veya bilgi ve ilişkilerin otomatik çıkarılması için bir model sağlayıcısı eklersiniz.')],
    [t('How do I try it?', 'Nasıl deneyebilirim?'), t('Install the Python package, run mesa start, then add a text file and search it. The installation guide lists the commands and supported systems.', 'Python paketini kurun, mesa start çalıştırın, sonra bir metin dosyası ekleyip arayın. Komutlar ve desteklenen sistemler kurulum rehberinde listelenir.')],
    [t('Does MESA have a CLI?', 'MESA’nın CLI’si var mı?'), t('Yes. The mesa command comes with the mesa-memory package. Start the server with mesa start; add, search and delete documents with mesa add, mesa search and mesa delete. Use mesa status to check the server.', 'Evet. mesa komutu, mesa-memory paketiyle birlikte gelir. mesa start ile sunucuyu başlatın; mesa add, mesa search ve mesa delete ile belge ekleyin, arayın ve silin. Sunucuyu kontrol etmek için mesa status kullanın.')],
    [t('Can I connect an MCP client?', 'MCP istemcisi bağlayabilir miyim?'), t('Yes. Run mesa start, then mesa mcp-config. Keep the generated connection settings private because they contain your local API key.', 'Evet. mesa start sonrasında mesa mcp-config çalıştırın. Oluşturulan bağlantı ayarları yerel API anahtarınızı içerdiği için gizli tutun.')],
    [t('What if the document changes?', 'Belge değişirse ne olur?'), t('After a new revision is processed, it replaces the old revision in current search results. Document update and deletion operations are described in the API guide.', 'Yeni sürüm işlendikten sonra güncel arama sonuçlarında eski sürümün yerini alır. Belge güncelleme ve silme işlemleri API rehberinde açıklanır.')],
    [t('Is MESA production-ready?', 'MESA canlı kullanıma hazır mı?'), t('Not yet. Version 0.9.1 is published, but the required production qualification is incomplete. Try it locally and read the current limits before integrating it.', 'Henüz değil. 0.9.1 sürümü yayımlandı, fakat gerekli üretim doğrulamaları tamamlanmadı. Yerelde deneyin ve uygulamanıza bağlamadan önce güncel sınırları okuyun.')]
  ];
  return `${header()}<main id="main-content" class="intro-page simple-public"><section class="page-hero compact page-hero--short">${label('FREQUENT QUESTIONS', 'SIK SORULANLAR')}<h1>${t('Before you start using MESA.', 'MESA kullanmaya başlamadan önce.')}</h1>${p('Direct answers about what you install, what it does and what it needs.', 'Ne kuracağınız, ne işe yaradığı ve neye ihtiyaç duyduğu hakkında kısa yanıtlar.')}</section><section class="section faq-list">${questions.map(([question,answer],i)=>`<details${i===0?' open':''}><summary><h2>${question}</h2></summary><p>${answer}</p></details>`).join('')}</section><section class="section"><h2>${t('Try it, or check the limits first.', 'Deneyin veya önce sınırlarını inceleyin.')}</h2><div class="actions">${cta(t('Installation guide', 'Kurulum rehberi'),route('get-started/'))}${cta(t('Current project status', 'Güncel proje durumu'),route('status/'),'secondary')}</div></section>${footer()}</main>`;
}
