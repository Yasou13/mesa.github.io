import { componentDiagram, writeSequenceDiagram, mutationStateDiagram, readActivityDiagram, catalogClassDiagram, deploymentDiagram } from './render_uml.mjs';
const source = 'https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/';

export function detailedArchitecture({ header, footer, route, cta, t }) {
  const p = (en, tr) => `<p>${t(en, tr)}</p>`;
  const h = (en, tr) => `<h2>${t(en, tr)}</h2>`;
  const label = (en, tr) => `<p class="eyebrow">${t(en, tr)}</p>`;
  // One sentence of "why" per section, linked to the decision record behind it.
  const why = (en, tr, adr, adrTitleEn, adrTitleTr) => `<div class="arch-why"><span class="intro-index">${t('WHY', 'NEDEN')}</span><p>${t(en, tr)}</p><a href="${route(`docs/core/adr-${adr}/`)}">${t(`ADR ${adr} · ${adrTitleEn} →`, `ADR ${adr} · ${adrTitleTr} →`)}</a></div>`;
  const step = (number, name, text, code) => `<li><span class="intro-index">${number}</span><div><h3>${name}</h3><p>${text}</p>${code ? `<code>${code}</code>` : ''}</div></li>`;
  const modules = [
    ['mesa_api / mesa_mcp', t('Entry points', 'Giriş kapıları'), t('Receive HTTP or MCP requests and bind them to an authenticated session.', 'HTTP veya MCP isteklerini alır, kimliği doğrulanmış oturuma bağlar.')],
    ['mesa_workers', t('Background work', 'Arka plan işleri'), t('Consume durable ingestion, projection and maintenance work.', 'Kalıcı veri alımı, depolama görünümü ve bakım işlerini yürütür.')],
    ['mesa_memory', t('Information processing', 'Bilgiyi işleme'), t('Own extraction, validation, embeddings and context building.', 'Bilgi çıkarımını, doğrulamayı, sayısal temsilleri ve bağlam hazırlamayı yönetir.')],
    ['mesa_storage', t('Records and search', 'Kayıtlar ve arama'), t('Own canonical SQLite state, source ownership, projections and retrieval through MemoryDAO.', 'MemoryDAO üzerinden asıl SQLite kayıtlarını, kaynak sahipliğini, arama görünümlerini ve aramayı yönetir.')],
    ['mesa_client', t('Application connection', 'Uygulama bağlantısı'), t('Provides synchronous and asynchronous Python clients for the HTTP boundary.', 'HTTP API’sine bağlanan senkron ve asenkron Python istemcilerini sağlar.')]
  ];
  const bounds = [
    [t('Context budget', 'Bağlam bütçesi'), t('2048 tokens by default', 'varsayılan 2048 token')],
    [t('Graph search', 'Çizge araması'), t('≤ 20 seeds · ≤ 3 hops · ≤ 500 hits', '≤ 20 başlangıç · ≤ 3 adım · ≤ 500 sonuç')],
    [t('Graph request timeout', 'Çizge zaman aşımı'), t('15 s by default', 'varsayılan 15 sn')],
    [t('Rank fusion', 'Sıra birleştirme'), t('RRF, k = 60, lane weight 1.0', 'RRF, k = 60, kanal ağırlığı 1.0')],
    [t('SDK status polling', 'SDK durum sorgusu'), t('every 2 s by default', 'varsayılan 2 sn’de bir')],
    [t('Storage writers', 'Depolama yazıcısı'), t('exactly one process per storage root', 'her depolama kökünde tam bir süreç')]
  ];
  return `${header('architecture')}
<main id="main-content" class="intro-page architecture-page">
  <section class="page-hero compact page-hero--short">
    ${label('MESA CORE v0.8.1 · INSIDE THE ENGINE', 'MESA CORE v0.8.1 · ÇEKİRDEĞİN İÇİNDE')}
    <h1>${t('How information moves through MESA.', 'Bilgi, Mesa’nın içinde nasıl ilerler?')}</h1>
    ${p('Two paths: turning a source into stored memory, and finding evidence when an application asks a question. Each section below has a UML diagram, the reason behind the design and a link to its decision record.', 'İki yol var: bir kaynağı hafızaya yazmak ve uygulama soru sorduğunda dayanak bilgiyi bulmak. Aşağıdaki her bölümde bir UML şeması, tasarımın gerekçesi ve ilgili karar kaydının bağlantısı yer alır.')}
    <nav class="arch-path-links" aria-label="${t('Diagrams on this page', 'Bu sayfadaki şemalar')}"><a href="#runtime-map">${t('Components', 'Bileşenler')}</a><a href="#writing-memory">${t('Write path', 'Yazma yolu')}</a><a href="#mutation-lifecycle">${t('States', 'Durumlar')}</a><a href="#reading-memory">${t('Read path', 'Okuma yolu')}</a><a href="#data-model">${t('Data model', 'Veri modeli')}</a><a href="#deployment">${t('Deployment', 'Dağıtım')}</a></nav>
  </section>

  <section class="section" id="runtime-map">
    ${label('THE WHOLE SYSTEM AT A GLANCE', 'BÜTÜN SİSTEME TEK BAKIŞ')}
    ${h('One application outside. One storage owner inside.', 'Uygulama dışarıda, depolama tek sürecin yönetiminde.')}
    ${p('In the supported V4 topology, one combined process owns the API, the background workers and all three stores. The boxes are modules inside that process, not separate servers.', 'Desteklenen V4 kurulumunda tek bir birleşik süreç; API’yi, arka plan işçilerini ve üç depoyu birlikte yönetir. Kutular ayrı sunucular değil, bu sürecin içindeki modüllerdir.')}
    ${componentDiagram(t)}
    ${why('SQLite, LanceDB and Kùzu cannot share one transaction, and two writers on the same files make recovery ambiguous. So one process writes, SQLite records every step, and the other stores follow it.', 'SQLite, LanceDB ve Kùzu tek bir işlemi paylaşamaz; aynı dosyalara iki yazıcı kurtarmayı belirsizleştirir. Bu yüzden tek süreç yazar, SQLite her adımı kaydeder, diğer depolar onu izler.', '0009', 'Ledger and single owner', 'Günlük ve tek sahip')}
  </section>

  <section class="section" id="writing-memory">
    ${label('01 · THE WRITE PATH', '01 · YAZMA YOLU')}
    ${h('From exact source text to usable memory.', 'Özgün kaynak metinden kullanılabilir hafızaya.')}
    ${p('Your application sends exact text with its document, revision and chunk identity. The API accepts the work right away and returns 202; the rest happens in the background. Your application asks for the status until it reaches a final state.', 'Uygulamanız özgün metni belge, sürüm ve parça kimliğiyle gönderir. API işi hemen kabul edip 202 döndürür; gerisi arka planda olur. Uygulamanız durum son hâline ulaşana kadar sorgular.')}
    ${writeSequenceDiagram(t)}
    <details class="arch-detail"><summary>${t('Developer detail · the six steps with their code names', 'Geliştirici ayrıntısı · altı adım ve kod adları')}</summary>
    <ol class="arch-write-flow">
      ${step('01', t('Check the session and source', 'Oturumu ve kaynağı kontrol et'), t('The server derives access scope from the authenticated session. The request identifies a dataset, document, revision and exact source chunk.', 'Sunucu erişim kapsamını kimliği doğrulanmış oturumdan alır. İstek; veri kümesini, belgeyi, sürümü ve özgün metin parçasını belirtir.'), 'POST /v4/memory/insert')}
      ${step('02', t('Accept the work durably', 'İşi kalıcı olarak kabul et'), t('A candidate, mutation ledger record and pipeline run are created. HTTP 202 confirms admission; it does not confirm completed processing.', 'Bir aday kayıt, değişiklik günlüğü ve işlem hattı çalışması oluşturulur. HTTP 202, kabulü bildirir; işlemenin tamamlandığını bildirmez.'), 'MemoryCandidate · memory_mutations · pipeline_runs')}
      ${step('03', t('Extract structured facts', 'Düzenli bilgi kayıtları çıkar'), t('A model extracts zero or more subject–relation–object facts, keeping the link to the supporting text.', 'Bir model sıfır veya daha fazla özne–ilişki–nesne kaydı çıkarır; dayanak metinle bağlantıyı korur.'), 'FactExtractionService → 0..N FactCandidate')}
      ${step('04', t('Apply the selected validation', 'Seçilen doğrulamayı uygula'), t('Mode 0 uses deterministic checks; mode 1 adds one model validator; mode 2 requires two distinct provider/model pairs to agree.', 'Mod 0 kurala dayalı kontrolleri kullanır; mod 1 bir model doğrulayıcı ekler; mod 2 farklı iki sağlayıcı/model çiftinin uzlaşmasını ister.'), 'MESA_TIER3_MODE = 0 / 1 / 2')}
      ${step('05', t('Write the stores in order', 'Depolara sırayla yaz'), t('Canonical facts go to SQLite, then vectors to LanceDB, then relationships to Kùzu. Each stage waits for its predecessor.', 'Asıl bilgi kayıtları SQLite’a, ardından vektörler LanceDB’ye, son olarak ilişkiler Kùzu’ya yazılır. Her adım bir öncekini bekler.'), 'SQL_APPLIED → VECTOR_APPLIED → GRAPH_APPLIED')}
      ${step('06', t('Confirm completion', 'Tamamlanmayı doğrula'), t('The client checks the durable mutation status. COMMITTED is the successful final state.', 'İstemci kalıcı değişiklik kaydının durumunu sorgular. Başarılı son durum COMMITTED’dır.'), 'GET /v4/mutations/{id}')}
    </ol></details>
  </section>

  <section class="section" id="mutation-lifecycle">
    ${label('WHAT IF A STEP FAILS?', 'BİR ADIM BAŞARISIZ OLURSA?')}
    ${h('Every mutation ends in a state you can see.', 'Her değişiklik görebileceğiniz bir durumda biter.')}
    ${p('The three stores do not share a single database transaction. Durable work records, expiring ownership leases and idempotent receipts let the system retry or reconcile unfinished work without calling it a success.', 'Üç depo tek bir veritabanı işlemini paylaşmaz. Kalıcı iş kayıtları, süreli iş sahipliği ve tekrarı güvenli kılan alındılar; yarım kalan işin başarı sayılmadan yeniden denenmesini veya uzlaştırılmasını sağlar.')}
    ${mutationStateDiagram(t)}
    ${why('A failed projection should be visible as retry, DLQ or BLOCKED instead of being hidden behind a compensating write.', 'Başarısız bir görünüm yazması, telafi edici bir yazmanın arkasına saklanmak yerine retry, DLQ veya BLOCKED olarak görünmelidir.', '0009', 'Ledger and single owner', 'Günlük ve tek sahip')}
  </section>

  <section class="section" id="reading-memory">
    ${label('02 · THE READ PATH', '02 · OKUMA YOLU')}
    ${h('From a question to source-linked evidence.', 'Bir sorudan kaynağına bağlı kanıta.')}
    ${p('The session fixes which datasets may be read. Eligibility rules remove everything else before any ranking. Four lanes then search the same eligible set in parallel, and their rankings are merged.', 'Oturum hangi veri kümelerinin okunabileceğini sabitler. Uygunluk kuralları sıralamadan önce geri kalan her şeyi eler. Ardından dört kanal aynı uygun küme üzerinde paralel arar ve sıralamaları birleştirilir.')}
    ${readActivityDiagram(t)}
    <div class="arch-read-notes"><article><h3>${t('Search returns evidence', 'Arama kanıt döndürür')}</h3><p>${t('Hits keep assertion, document, revision, chunk and lane identity. A graph path keeps its supporting assertions and directions.', 'Sonuçlar bilgi kaydı, belge, sürüm, parça ve kanal kimliğini korur. Çizge yolu dayanak kayıtlarını ve yönlerini taşır.')}</p></article><article><h3>${t('Context fits the model’s input', 'Bağlam modelin girdisine sığar')}</h3><p>${t('The context endpoint packs evidence once into a token budget. A complete graph proof fits together or not at all; your application’s model then writes the answer.', 'Bağlam uç noktası kanıtı bir kez token bütçesine yerleştirir. Çizge ispatı ya bütün olarak sığar ya hiç; ardından uygulamanızın modeli yanıtı yazar.')}</p></article></div>
    ${why('Vector, keyword and graph scores live on different scales, so adding them is meaningless. Fusing rank positions avoids that; low graph centrality is never treated as evidence that a fact is false.', 'Vektör, sözcük ve çizge skorları farklı ölçeklerdedir; bunları toplamak anlamsızdır. Sıra konumlarını birleştirmek bu sorunu önler; düşük çizge merkeziliği bir bilginin yanlış olduğuna kanıt sayılmaz.', '0010', 'RRF and PageRank', 'RRF ve PageRank')}
    <details class="arch-detail"><summary>${t('Optional adaptive search: when is the question reformulated?', 'İsteğe bağlı uyarlanabilir arama: soru ne zaman yeniden yazılır?')}</summary>${p('Search and context default to a single query. When adaptive context is explicitly requested, an empty result or insufficient multi-lane support can trigger one planner call and up to two reformulations. Every search keeps the original scope; this does not generate an answer.', 'Arama ve bağlam varsayılan olarak tek sorgu kullanır. Uyarlanabilir bağlam açıkça istendiğinde, boş sonuç veya yetersiz çok kanallı destek bir planlayıcı çağrısını ve en fazla iki yeniden yazımı tetikleyebilir. Her arama özgün kapsamı korur; bu adım yanıt üretmez.')}<a href="${route('docs/core/adr-0015/')}">${t('ADR 0015 · Adaptive query planning →', 'ADR 0015 · Uyarlanabilir sorgu planlama →')}</a></details>
    ${cta(t('Ranking formula and search limits', 'Sıralama formülü ve arama sınırları'), route('retrieval/'), 'text')}
  </section>

  <section class="section" id="data-model">
    ${label('WHO MAY READ WHAT?', 'KİM NEYİ OKUYABİLİR?')}
    ${h('Scope comes from the server. Every fact points to its source.', 'Kapsamı sunucu belirler. Her bilgi kaynağını gösterir.')}
    ${p('Tenants own workspaces, workspaces own datasets, datasets own documents. A document has immutable revisions made of exact source chunks, and every assertion points back to the chunks that support it.', 'Kurumlar çalışma alanlarına, çalışma alanları veri kümelerine, veri kümeleri belgelere sahiptir. Bir belgenin özgün metin parçalarından oluşan değişmez sürümleri vardır ve her bilgi kaydı onu destekleyen parçalara bağlanır.')}
    ${catalogClassDiagram(t)}
    ${why('An agent ID describes a persona, not an owner. Treating a client-supplied ID as the boundary made ownership ambiguous, so the server resolves the whole chain itself.', 'Ajan kimliği bir kişiliği tanımlar, sahibi değil. İstemcinin gönderdiği kimliği sınır saymak sahipliği belirsizleştiriyordu; bu yüzden zinciri sunucu kendisi çözer.', '0011', 'Tenant/dataset authorization', 'Kurum/veri kümesi yetkilendirmesi')}
  </section>

  <section class="section" id="deployment">
    ${label('WHERE DOES IT RUN?', 'NEREDE ÇALIŞIR?')}
    ${h('One process, one folder of data.', 'Tek süreç, tek veri klasörü.')}
    ${p('All three stores are embedded: they are files under one storage root, opened by one Python process. There is no separate database server to run.', 'Üç depo da gömülüdür: tek bir depolama kökü altındaki dosyalardır ve tek bir Python süreci tarafından açılır. Ayrıca çalıştırılacak bir veritabanı sunucusu yoktur.')}
    ${deploymentDiagram(t)}
    <div class="arch-bounds"><h3>${t('Configured bounds', 'Yapılandırılmış sınırlar')}</h3><p class="intro-caption">${t('Limits from the v0.8.1 source, not measured latency or capacity. No benchmark has been published yet.', 'v0.8.1 kaynağındaki sınırlar; ölçülmüş gecikme veya kapasite değildir. Henüz yayımlanmış bir ölçüm yoktur.')}</p><dl>${bounds.map(([name, value]) => `<div><dt>${name}</dt><dd>${value}</dd></div>`).join('')}</dl></div>
  </section>

  <section class="section" id="building-blocks">
    ${label('03 · HOW THE CODE IS ASSEMBLED', '03 · KOD NASIL BİR ARAYA GELİR?')}${h('Separate modules, explicit responsibilities.', 'Ayrı modüller, açık sorumluluklar.')}
    <div class="arch-modules">${modules.map(([name, role, text]) => `<article><code>${name}</code><div><h3>${role}</h3><p>${text}</p></div></article>`).join('')}</div>
    ${why('Imports may only point down the layers. A CI check rejects reverse imports, so storage code can never depend on the API.', 'İçe aktarmalar yalnızca katmanlarda aşağı yönlü olabilir. CI kontrolü ters yönlü içe aktarmayı reddeder; depolama kodu API’ye hiçbir zaman bağımlı olamaz.', '0013', 'Production dependencies', 'Üretim bağımlılıkları')}
    <details class="arch-detail"><summary>${t('Read the exact Core sources behind these diagrams', 'Bu şemaların dayandığı gerçek Core kaynakları')}</summary><ul>${[
      ['docs/architecture-v4.md', t('Architecture and process boundary', 'Mimari ve süreç sınırı')],
      ['docs/concepts-and-ingestion.md', t('Ingestion and state transitions', 'Veri alımı ve durum geçişleri')],
      ['mesa_memory/extraction/service.py', t('Canonical fact extraction', 'Kanonik bilgi çıkarımı')],
      ['mesa_workers/projection_worker.py', t('Ordered projection writes', 'Sıralı depolama yazmaları')],
      ['mesa_storage/dao.py', t('Canonical storage and search coordination', 'Asıl depolama ve arama koordinasyonu')],
      ['mesa_storage/retrieval_scope.py', t('Eligibility and RRF', 'Uygunluk ve RRF')],
      ['mesa_memory/context_builder.py', t('Evidence context packing', 'Kanıt bağlamının hazırlanması')]
    ].map(([path, text]) => `<li><a target="_blank" rel="noopener noreferrer" href="${source}${path}">${text}<span aria-hidden="true"> ↗</span></a><code>${path}</code></li>`).join('')}</ul><p class="intro-caption">${t('Verified source baseline: Core v0.8.1 · d394784. Diagrams simplify the runtime.', 'Doğrulanan kaynak temeli: Core v0.8.1 · d394784. Şemalar çalışma zamanını sadeleştirir.')}</p></details>
    <div class="actions">${cta(t('Installation and configuration', 'Kurulum ve yapılandırma'), route('docs/core/getting-started/'))}${cta(t('All decision records', 'Tüm karar kayıtları'), route('docs/core/decisions/'), 'secondary')}</div>
  </section>
  ${footer(true)}
</main>`;
}
