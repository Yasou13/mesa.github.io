import { storage, retrieval } from './render_intro.mjs';
const source = 'https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/';

export function detailedArchitecture({ header, footer, route, cta, t }) {
  const p = (en, tr) => `<p>${t(en, tr)}</p>`;
  const h = (en, tr) => `<h2>${t(en, tr)}</h2>`;
  const label = (en, tr) => `<p class="eyebrow">${t(en, tr)}</p>`;
  const step = (number, name, text, code) => `<li><span class="intro-index">${number}</span><div><h3>${name}</h3><p>${text}</p>${code ? `<code>${code}</code>` : ''}</div></li>`;
  const arrow = '<span class="arch-down" aria-hidden="true">↓</span>';
  const modules = [
    ['mesa_api / mesa_mcp', t('Entry points', 'Giriş kapıları'), t('Receive HTTP or MCP requests and bind them to an authenticated session.', 'HTTP veya MCP isteklerini alır, kimliği doğrulanmış oturuma bağlar.')],
    ['mesa_workers', t('Background work', 'Arka plan işleri'), t('Consume durable ingestion, projection and maintenance work.', 'Kalıcı veri alımı, depolama görünümü ve bakım işlerini yürütür.')],
    ['mesa_memory', t('Information processing', 'Bilgiyi işleme'), t('Own extraction, validation, embeddings and context building.', 'Bilgi çıkarımını, doğrulamayı, sayısal temsilleri ve bağlam hazırlamayı yönetir.')],
    ['mesa_storage', t('Records and search', 'Kayıtlar ve arama'), t('Own canonical SQLite state, source ownership, projections and retrieval through MemoryDAO.', 'MemoryDAO üzerinden asıl SQLite kayıtlarını, kaynak sahipliğini, arama görünümlerini ve aramayı yönetir.')],
    ['mesa_client', t('Application connection', 'Uygulama bağlantısı'), t('Provides synchronous and asynchronous Python clients for the HTTP boundary.', 'HTTP API’sine bağlanan senkron ve asenkron Python istemcilerini sağlar.')]
  ];
  return `${header('architecture')}
<main id="main-content" class="intro-page architecture-page">
  <section class="page-hero compact page-hero--trajectory">
    ${label('MESA CORE v0.8.1 · INSIDE THE ENGINE', 'MESA CORE v0.8.1 · ÇEKİRDEĞİN İÇİNDE')}
    <h1>${t('How information moves through MESA.', 'Bilgi, Mesa’nın içinde nasıl ilerler?')}</h1>
    ${p('The architecture has two main paths: turning a source into stored memory, and finding evidence when an application asks a question. Follow both paths below, from entry to output.', 'Mimaride iki ana yol var: bir kaynağı hafızaya yazmak ve uygulama soru sorduğunda dayanak bilgiyi bulmak. Aşağıda iki yolu da girişten çıktıya kadar izleyebilirsiniz.')}
    <div class="arch-path-links"><a href="#writing-memory">${t('01 · Write information ↓', '01 · Bilgiyi yaz ↓')}</a><a href="#reading-memory">${t('02 · Find information ↓', '02 · Bilgiyi bul ↓')}</a><a href="#building-blocks">${t('03 · See the building blocks ↓', '03 · Yapı taşlarını gör ↓')}</a></div>
  </section>

  <section class="section" id="runtime-map">
    ${label('THE WHOLE SYSTEM AT A GLANCE', 'BÜTÜN SİSTEME TEK BAKIŞ')}
    ${h('One application outside. One storage owner inside.', 'Uygulama dışarıda, depolama tek sürecin yönetiminde.')}
    ${p('In the supported V4 topology, one combined process owns the API admission path, background consumers and all three stores. The boxes below are responsibilities inside that process, not separate servers.', 'Desteklenen V4 kurulumunda tek bir combined süreç; API kabul yolunu, arka plan çalışanlarını ve üç depoyu birlikte yönetir. Aşağıdaki kutular ayrı sunucular değil, bu sürecin içindeki görevlerdir.')}
    <figure class="arch-runtime"><figcaption>${t('Runtime boundary and the two data paths', 'Çalışma zamanı sınırı ve iki veri yolu')}</figcaption>
      <div class="arch-outside"><strong>${t('Your application', 'Uygulamanız')}</strong><span>${t('Source text in · source-linked evidence out', 'Kaynak metin alınır · dayanaklarıyla bilgi sunulur')}</span></div>${arrow}
      <div class="arch-combined"><span class="arch-boundary">${t('MESA CORE · ONE COMBINED PROCESS', 'MESA CORE · TEK COMBINED SÜREÇ')}</span>
        <div class="arch-gate"><strong>${t('HTTP API / V4 MCP gateway', 'HTTP API / V4 MCP geçidi')}</strong><p>${t('Authenticate → resolve session → use its authorized datasets', 'Kimliği doğrula → oturumu belirle → oturumun yetkili veri kümelerini kullan')}</p></div>${arrow}
        <div class="arch-two-paths"><div><span class="intro-index">${t('WRITE PATH', 'YAZMA YOLU')}</span><strong>${t('Durable admission → extraction → validation', 'Kalıcı kabul → bilgi çıkarımı → doğrulama')}</strong><p>${t('Background processing prepares the canonical facts and their search views.', 'Arka plan işlemleri asıl bilgi kayıtlarını ve arama görünümlerini hazırlar.')}</p></div><div><span class="intro-index">${t('READ PATH', 'OKUMA YOLU')}</span><strong>${t('Eligibility → four search lanes → rank fusion', 'Uygunluk → dört arama kanalı → sıralama birleştirme')}</strong><p>${t('Search uses eligible records and returns their supporting evidence.', 'Arama, uygun kayıtları kullanır ve dayanak kanıtlarını döndürür.')}</p></div></div>
        <div class="arch-store-strip"><strong>SQLite</strong><span>${t('Main record', 'Ana kayıt')}</span><strong>LanceDB</strong><span>${t('Meaning', 'Anlam')}</span><strong>Kùzu</strong><span>${t('Connections', 'Bağlantılar')}</span></div>
      </div>${arrow}<div class="arch-outside"><strong>${t('Evidence context → your application’s model → answer', 'Kanıt bağlamı → uygulamanızın modeli → yanıt')}</strong><span>${t('MESA retrieval supplies context; answer generation belongs to the application.', 'Mesa araması bağlamı sağlar; yanıt üretimini uygulama yapar.')}</span></div>
    </figure>
  </section>

  <section class="section" id="writing-memory">
    ${label('01 · THE WRITE PATH', '01 · YAZMA YOLU')}
    ${h('From exact source text to usable memory.', 'Özgün kaynak metinden kullanılabilir hafızaya.')}
    ${p('Your application provides exact text and its document, revision and chunk identity. Core consumes that source; source acquisition and chunk preparation belong to the producer.', 'Uygulamanız özgün metni; belge, sürüm ve parça kimliğiyle gönderir. Core bu kaynağı işler; kaynağın toplanması ve parçalara ayrılması veriyi gönderen sistemin sorumluluğundadır.')}
    <ol class="arch-write-flow">
      ${step('01', t('Check the session and source', 'Oturumu ve kaynağı kontrol et'), t('The server derives access scope from the authenticated session. The request identifies a dataset, document, revision and exact source chunk.', 'Sunucu erişim kapsamını kimliği doğrulanmış oturumdan alır. İstek; veri kümesini, belgeyi, sürümü ve özgün metin parçasını belirtir.'), 'POST /v4/memory/insert')}
      ${step('02', t('Accept the work durably', 'İşi kalıcı olarak kabul et'), t('A candidate, mutation ledger record and pipeline run are created. HTTP 202 confirms admission; it does not confirm completed processing.', 'Bir aday kayıt, değişiklik günlüğü ve işlem hattı çalışması oluşturulur. HTTP 202, kabulü bildirir; işlemenin tamamlandığını bildirmez.'), 'MemoryCandidate · memory_mutations · pipeline_runs')}
      ${step('03', t('Extract structured facts', 'Düzenli bilgi kayıtları çıkar'), t('FactExtractionService uses a model to extract zero or more subject–relation–object facts, keeping the link to the supporting text.', 'FactExtractionService bir model kullanarak sıfır veya daha fazla özne–ilişki–nesne kaydı çıkarır; dayanak metinle bağlantıyı korur.'), 'FactExtractionService → 0..N FactCandidate')}
      ${step('04', t('Apply the selected validation', 'Seçilen doğrulamayı uygula'), t('Mode 0 uses deterministic checks; mode 1 adds one model validator; mode 2 requires two distinct provider/model pairs to agree. These checks gate admission to active memory.', 'Mod 0 kurala dayalı kontrolleri kullanır; mod 1 bir model doğrulayıcı ekler; mod 2 farklı iki sağlayıcı/model çiftinin uzlaşmasını ister. Etkin hafızaya geçiş bu kontrollerle sınırlandırılır.'), 'MESA_TIER3_MODE = 0 / 1 / 2')}
      ${step('05', t('Write the stores in order', 'Depolara sırayla yaz'), t('Canonical facts are written to SQLite, then vector representations to LanceDB, then relationships to Kùzu. Each stage waits for its predecessor.', 'Asıl bilgi kayıtları SQLite’a, ardından vektör temsilleri LanceDB’ye, son olarak ilişkiler Kùzu’ya yazılır. Her adım bir öncekinin tamamlanmasını bekler.'), 'SQL → vector → graph')}
      ${step('06', t('Confirm completion', 'Tamamlanmayı doğrula'), t('The client checks the durable mutation status. COMMITTED is the successful terminal state; an accepted request alone is not enough.', 'İstemci, kalıcı değişiklik kaydının durumunu sorgular. Başarılı son durum COMMITTED’dır; isteğin kabul edilmiş olması tek başına yeterli değildir.'), 'COMMITTED')}
    </ol>
    <div class="arch-state-band"><span>${t('Pipeline states', 'İşlem hattı durumları')}</span><code>QUEUED → RUNNING → EXTRACTED → VALIDATED → PROJECTING → COMMITTED</code></div>
    <p class="intro-caption">${t('The pipeline summarizes progress; the mutation ledger tracks the SQL_APPLIED, VECTOR_APPLIED and GRAPH_APPLIED write stages separately.', 'İşlem hattı ilerlemeyi özetler; değişiklik günlüğü SQL_APPLIED, VECTOR_APPLIED ve GRAPH_APPLIED yazma adımlarını ayrıca izler.')}</p>
  </section>

  <section class="section arch-storage-layout" id="storage-model">
    <div>${label('WHERE DOES EACH PIECE LIVE?', 'HANGİ PARÇA NEREDE TUTULUR?')}${h('The record is authoritative. Search views follow it.', 'Asıl kayıt belirleyicidir. Arama görünümleri onu izler.')}
      ${p('SQLite owns documents, immutable revisions, entities, assertions, permissions and processing state. FTS5 also supplies keyword search over passages and evidence.', 'SQLite; belgeleri, değişmez sürümleri, varlıkları, bilgi kayıtlarını, izinleri ve işleme durumunu tutar. FTS5 ile pasajlar ve kanıtlar üzerinde sözcük araması da sağlar.')}
      <dl class="intro-terms"><div><dt>${t('LanceDB: find similar meaning', 'LanceDB: yakın anlamı bul')}</dt><dd>${t('Stores derived assertion vectors. The query representation must use the compatible embedding model and dimensions.', 'Bilgi kayıtlarından türetilmiş vektörleri tutar. Sorgunun sayısal temsili uyumlu model ve boyutları kullanmalıdır.')}</dd></div><div><dt>${t('Kùzu: follow relationships', 'Kùzu: ilişkileri izle')}</dt><dd>${t('Stores derived entities and assertion edges. A graph path must reconcile to eligible canonical assertions.', 'Türetilmiş varlıkları ve bilgi bağlantılarını tutar. Çizgedeki yol, erişime uygun asıl bilgi kayıtlarıyla uyuşmalıdır.')}</dd></div></dl>
      <div class="arch-example"><span class="intro-index">${t('ILLUSTRATIVE FACT + SOURCE', 'ÖRNEK BİLGİ + KAYNAK')}</span><p>${t('Atlas archive → weekday opening time → 09:00', 'Atlas arşivi → hafta içi açılış saati → 09.00')}</p><small>${t('Visitor guide → revision 1 → chunk 1 → supporting passage', 'Ziyaretçi rehberi → sürüm 1 → parça 1 → dayanak pasaj')}</small></div>
    </div>${storage()}
  </section>

  <section class="section" id="reading-memory">
    ${label('02 · THE READ PATH', '02 · OKUMA YOLU')}
    ${h('From a question to source-linked evidence.', 'Bir sorudan kaynağına bağlı kanıta.')}
    ${p('The session fixes the authorized datasets. Tenant, dataset, agent, committed-state and applicable time/jurisdiction rules constrain candidates before rank contribution. MemoryDAO.search_v4_memory coordinates the search.', 'Oturum, erişime izin verilen veri kümelerini sabitler. Kurum, veri kümesi, ajan, tamamlanma durumu ve geçerli zaman/yargı alanı kuralları sıralamaya katkıdan önce adayları sınırlar. Aramayı MemoryDAO.search_v4_memory koordine eder.')}
    ${retrieval()}
    <div class="arch-read-notes"><article><h3>${t('Search returns evidence', 'Arama kanıt döndürür')}</h3><p>${t('Hits retain assertion, document, revision, chunk and retrieval-origin identity. A bounded graph path retains its supporting assertions and directions.', 'Sonuçlar bilgi kaydı, belge, sürüm, parça ve arama kanalı kimliğini korur. Sınırlı çizge yolları dayanak kayıtları ve yönleriyle birlikte taşınır.')}</p></article><article><h3>${t('ContextBuilder fits the model’s input', 'ContextBuilder, modelin girdisini hazırlar')}</h3><p>${t('The context endpoint packs evidence once into a token budget, defaulting to 2048 formatted-evidence tokens. Complete graph proof must fit together; the application model then writes the answer.', 'Bağlam uç noktası kanıtı bir kez token bütçesine yerleştirir; varsayılan bütçe biçimlendirilmiş kanıt için 2048 token’dır. Çizge ispatı bütün olarak sığmalıdır; ardından uygulamanın modeli yanıtı yazar.')}</p></article></div>
    <details class="arch-detail"><summary>${t('Optional adaptive search: when is the question reformulated?', 'İsteğe bağlı uyarlanabilir arama: soru ne zaman yeniden yazılır?')}</summary>${p('Search and context default to a single query. When adaptive context is explicitly requested, an empty result or insufficient multi-lane support can trigger one planner call and up to two reformulations. Every search keeps the original scope; this does not generate an answer.', 'Arama ve bağlam varsayılan olarak tek sorgu kullanır. Uyarlanabilir bağlam açıkça istendiğinde, boş sonuç veya yetersiz çok kanallı destek bir planlayıcı çağrısını ve en fazla iki yeniden yazımı tetikleyebilir. Her arama özgün kapsamı korur; bu adım yanıt üretmez.')}</details>
    ${cta(t('Ranking formula and search limits', 'Sıralama formülü ve arama sınırları'), route('retrieval/'), 'text')}
  </section>

  <section class="section" id="failure-recovery">
    ${label('WHAT IF A STEP FAILS?', 'BİR ADIM BAŞARISIZ OLURSA?')}${h('Progress is recorded. Recovery follows ownership.', 'İlerleme kaydedilir. Kurtarma, sahipliği izler.')}
    ${p('The three stores do not share a single database transaction. Durable work records, expiring ownership leases and idempotent receipts let the system retry or reconcile unfinished work without treating it as success.', 'Üç depo tek bir veritabanı işlemini paylaşmaz. Kalıcı iş kayıtları, süreli iş sahipliği ve aynı işi tekrar uygulamayı güvenli kılan alındılar; yarım kalan işin yeniden denenmesini veya uzlaştırılmasını sağlar.')}
    <div class="arch-recovery-grid"><article><span class="intro-index">${t('VALIDATION REJECTION', 'DOĞRULAMADA RET')}</span><code>REJECTED</code><p>${t('Audit source may remain, but no active retrieval artifact is created.', 'Denetim için ham kaynak kalabilir; aktif arama kaydı oluşturulmaz.')}</p></article><article><span class="intro-index">${t('TRANSIENT FAILURE', 'GEÇİCİ HATA')}</span><code>RETRY_PENDING → DLQ</code><p>${t('Retries are bounded. Exhausted work can enter a dead-letter state rather than loop forever.', 'Yeniden denemeler sınırlıdır. Sonuçlanmayan iş sonsuz döngü yerine hata kuyruğuna alınabilir.')}</p></article><article><span class="intro-index">${t('ROLLBACK / CLEANUP', 'GERİ ALMA / TEMİZLİK')}</span><code>ROLLED_BACK / BLOCKED</code><p>${t('Rollback removes that source’s ownership. Shared artifacts survive while another active owner exists; unfinished cleanup stays blocked.', 'Geri alma, ilgili kaynağın sahipliğini kaldırır. Başka aktif sahip varsa ortak kayıt korunur; bitmeyen temizlik engelli durumda kalır.')}</p></article></div>
  </section>

  <section class="section" id="building-blocks">
    ${label('03 · HOW THE CODE IS ASSEMBLED', '03 · KOD NASIL BİR ARAYA GELİR?')}${h('Separate modules, explicit responsibilities.', 'Ayrı modüller, açık sorumluluklar.')}
    <div class="arch-modules">${modules.map(([name,role,text])=>`<article><code>${name}</code><div><h3>${role}</h3><p>${text}</p></div></article>`).join('')}</div>
    <div class="arch-state-band"><span>${t('General dependency direction', 'Genel bağımlılık yönü')}</span><code>API / MCP → workers → memory → storage</code></div>
    ${p('Runtime composition roots are explicit exceptions to that layering. MemoryDAO is the compatibility façade; mesa_evals supplies diagnostics and retrieval contract tooling outside the request path.', 'Çalışma zamanını birleştiren başlangıç noktaları bu katmanlaşmanın açık istisnalarıdır. MemoryDAO ortak erişim cephesidir; mesa_evals istek yolunun dışında tanılama ve arama sözleşmesi araçlarını sağlar.')}
    <details class="arch-detail"><summary>${t('Read the exact Core sources behind these diagrams', 'Bu şemaların dayandığı gerçek Core kaynakları')}</summary><ul>${[
      ['docs/architecture-v4.md',t('Architecture and process boundary', 'Mimari ve süreç sınırı')],
      ['docs/concepts-and-ingestion.md',t('Ingestion and state transitions', 'Veri alımı ve durum geçişleri')],
      ['mesa_memory/extraction/service.py',t('Canonical fact extraction', 'Kanonik bilgi çıkarımı')],
      ['mesa_workers/projection_worker.py',t('Ordered projection writes', 'Sıralı depolama yazmaları')],
      ['mesa_storage/dao.py',t('Canonical storage and search coordination', 'Asıl depolama ve arama koordinasyonu')],
      ['mesa_storage/retrieval_scope.py',t('Eligibility and RRF', 'Uygunluk ve RRF')],
      ['mesa_memory/context_builder.py',t('Evidence context packing', 'Kanıt bağlamının hazırlanması')]
    ].map(([path,text])=>`<li><a target="_blank" rel="noopener noreferrer" href="${source}${path}">${text}<span aria-hidden="true"> ↗</span></a><code>${path}</code></li>`).join('')}</ul><p class="intro-caption">${t('Verified source baseline: Core v0.8.1 · d394784. Schematics simplify the runtime; they do not claim production certification.', 'Doğrulanan kaynak temeli: Core v0.8.1 · d394784. Şemalar çalışma zamanını sadeleştirir; canlı kullanım onayı iddiası taşımaz.')}</p></details>
    <div class="actions">${cta(t('Installation and configuration', 'Kurulum ve yapılandırma'), route('docs/core/getting-started/'))}${cta(t('Evidence and security', 'Kanıt ve güvenlik'), route('docs/core/evidence/'), 'secondary')}</div>
  </section>
  ${footer(true)}
</main>`;
}
