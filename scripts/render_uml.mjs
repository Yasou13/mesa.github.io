// UML-style diagrams for MESA Core, drawn as inline SVG.
// Facts follow Core v0.9.0 (7062faf): docs/architecture-v4.md, ADR 0009–0015,
// docs/concepts-and-ingestion.md and docs/RUNBOOK.md.
// Every function takes `t(en, tr)` so the same drawing serves the localized
// product pages (translation map) and the docs pages (direct language choice).

const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

function defs(id) {
  return `<defs>
    <marker id="${id}-open" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M1 1 11 6 1 11" class="uml-head-open"/></marker>
    <marker id="${id}-fill" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M1 1 11 6 1 11Z" class="uml-head-fill"/></marker>
    <marker id="${id}-diamond" viewBox="0 0 16 10" refX="1" refY="5" markerWidth="16" markerHeight="10" orient="auto-start-reverse"><path d="M1 5 8 1 15 5 8 9Z" class="uml-head-fill"/></marker>
  </defs>`;
}

// Text helpers. Labels are short on purpose; the SVG scales with its container.
const text = (x, y, value, cls = 'uml-label', anchor = 'middle') => `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${esc(value)}</text>`;
const stereo = (x, y, value, anchor = 'middle') => text(x, y, `«${value}»`, 'uml-stereo', anchor);
const line = (d, id, { dashed = false, head = 'open', tail = '', cls = '' } = {}) =>
  `<path d="${d}" class="uml-edge${dashed ? ' uml-edge--dashed' : ''}${cls ? ` ${cls}` : ''}"${head ? ` marker-end="url(#${id}-${head})"` : ''}${tail ? ` marker-start="url(#${id}-${tail})"` : ''}/>`;

function componentBox(x, y, w, h, title, sub, { accent = false } = {}) {
  const ix = x + w - 22;
  const iy = y + 10;
  return `<g class="uml-component${accent ? ' uml-component--accent' : ''}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" class="uml-node"/>
    <g class="uml-icon"><rect x="${ix}" y="${iy}" width="14" height="16" rx="1"/><rect x="${ix - 4}" y="${iy + 3}" width="8" height="3.5"/><rect x="${ix - 4}" y="${iy + 9.5}" width="8" height="3.5"/></g>
    ${stereo(x + 14, y + 20, 'component', 'start')}${text(x + 14, y + 41, title, 'uml-title', 'start')}${sub.map((row, i) => text(x + 14, y + 60 + i * 15, row, 'uml-sub', 'start')).join('')}</g>`;
}

function cylinder(x, y, w, h, title, sub, { accent = false } = {}) {
  const ry = 9;
  return `<g class="uml-store${accent ? ' uml-store--accent' : ''}"><path d="M${x} ${y + ry} v${h - 2 * ry} a${w / 2} ${ry} 0 0 0 ${w} 0 v-${h - 2 * ry}" class="uml-node"/><ellipse cx="${x + w / 2}" cy="${y + ry}" rx="${w / 2}" ry="${ry}" class="uml-node"/>
    ${stereo(x + w / 2, y + 36, 'database')}${text(x + w / 2, y + 56, title, 'uml-title')}${text(x + w / 2, y + 73, sub, 'uml-sub')}</g>`;
}

function note(x, y, w, h, rows) {
  const fold = 12;
  return `<g class="uml-note"><path d="M${x} ${y} h${w - fold} l${fold} ${fold} v${h - fold} h-${w} Z M${x + w - fold} ${y} v${fold} h${fold}" class="uml-note-shape"/>${rows.map((row, i) => text(x + 12, y + 22 + i * 16, row, 'uml-note-text', 'start')).join('')}</g>`;
}

function figure({ id, title, caption, viewBox, minWidth, body, t }) {
  return `<figure class="uml-figure" id="${id}">
  <figcaption><span class="uml-kind">${esc(title[0])}</span><strong id="${id}-title">${esc(title[1])}</strong></figcaption>
  <div class="uml-scroll" tabindex="0" role="region" aria-labelledby="${id}-title"><svg class="uml uml--min-${minWidth}" viewBox="${viewBox}" role="img" aria-labelledby="${id}-title" aria-describedby="${id}-desc" xmlns="http://www.w3.org/2000/svg">${defs(id)}${body}</svg></div>
  <p class="uml-caption" id="${id}-desc">${esc(caption)}</p>
</figure>`;
}

// 1 · Component diagram — what runs inside the one combined process.
export function componentDiagram(t, id = 'uml-components') {
  const body = `
  <g class="uml-boundary"><rect x="230" y="22" width="560" height="510" rx="6" class="uml-frame"/><path d="M230 22 h236 v26 h-236z" class="uml-frame-tab"/>${text(244, 40, t('MESA Core · one combined process', 'MESA Core · tek birleşik süreç'), 'uml-frame-label', 'start')}</g>
  ${componentBox(20, 214, 172, 96, t('Your application', 'Uygulamanız'), [t('Python SDK · HTTP', 'Python SDK · HTTP'), t('or an MCP client', 'veya MCP istemcisi')])}
  ${componentBox(262, 70, 216, 92, 'mesa_api · mesa_mcp', [t('auth · session · admission', 'kimlik · oturum · kabul')], { accent: true })}
  ${componentBox(542, 70, 216, 92, 'mesa_workers', [t('durable queue consumers', 'kalıcı kuyruk işçileri')])}
  ${componentBox(542, 206, 216, 106, 'mesa_memory', [t('extract · validate', 'çıkar · doğrula'), t('embed · build context', 'vektörle · bağlam kur')])}
  ${componentBox(262, 206, 216, 106, 'mesa_storage', [t('MemoryDAO façade', 'MemoryDAO cephesi'), t('canonical writes · search', 'asıl yazma · arama')], { accent: true })}
  ${cylinder(262, 392, 140, 108, 'SQLite', t('source of truth', 'asıl kayıt'), { accent: true })}
  ${cylinder(436, 392, 140, 108, 'LanceDB', t('vector projection', 'vektör görünümü'))}
  ${cylinder(610, 392, 140, 108, 'Kùzu', t('graph projection', 'çizge görünümü'))}
  ${componentBox(806, 206, 140, 106, t('Model provider', 'Model sağlayıcı'), [t('LLM + embeddings', 'LLM + embedding'), t('external', 'harici')])}
  <path d="M192 262 H222 V116 H240" class="uml-edge"/><path d="M240 108 a8 8 0 0 1 0 16" class="uml-socket"/><circle cx="252" cy="116" r="8" class="uml-lollipop"/><path d="M260 116 h2" class="uml-edge"/>
  ${text(212, 100, t('REST /v4 · MCP', 'REST /v4 · MCP'), 'uml-edge-label', 'end')}
  ${line('M478 116 H538', id, { dashed: true })}${text(510, 108, t('enqueue', 'kuyruk'), 'uml-edge-label')}
  ${line('M650 162 V202', id, { dashed: true })}${text(658, 186, t('use', 'kullanır'), 'uml-edge-label', 'start')}
  ${line('M370 162 V202', id, { dashed: true })}${text(378, 186, t('read · admit', 'oku · kabul'), 'uml-edge-label', 'start')}
  ${line('M542 259 H482', id, { dashed: true })}${text(510, 251, t('write', 'yaz'), 'uml-edge-label')}
  ${line('M758 259 H802', id, { dashed: true })}${text(780, 251, t('calls', 'çağrı'), 'uml-edge-label')}
  <path d="M370 312 V346 H680" class="uml-edge"/><path d="M332 346 H370" class="uml-edge"/>
  ${line('M332 346 V388', id)}${line('M506 346 V388', id)}${line('M680 346 V388', id)}
  ${text(340, 372, '1 · SQL', 'uml-order', 'start')}${text(514, 372, t('2 · vector', '2 · vektör'), 'uml-order', 'start')}${text(688, 372, t('3 · graph', '3 · çizge'), 'uml-order', 'start')}
  ${note(20, 360, 196, 92, [t('One owner process writes', 'Üç depoya yalnızca'), t('all three stores. A second', 'bu süreç yazar. İkinci'), t('writer on the same root', 'bir yazıcı aynı kökü'), t('is not supported.', 'kullanamaz.')])}
  <path d="M216 406 H258" class="uml-edge uml-edge--dashed"/>`;
  return figure({ id, t, viewBox: '0 0 960 545', minWidth: 760, body,
    title: [t('UML · Component diagram', 'UML · Bileşen şeması'), t('Modules, interfaces and stores inside Core', 'Core içindeki modüller, arayüzler ve depolar')],
    caption: t('Calls point down only: API/MCP → workers → memory → storage (ADR 0013). SQLite decides; LanceDB and Kùzu are projections written after it, in order (ADR 0009).', 'Çağrılar yalnızca aşağı yönlüdür: API/MCP → işçiler → hafıza → depolama (ADR 0013). Kararı SQLite verir; LanceDB ve Kùzu ondan sonra sırayla yazılan görünümlerdir (ADR 0009).') });
}

// 2 · Sequence diagram — the asynchronous write path.
export function writeSequenceDiagram(t, id = 'uml-write-sequence') {
  const lanes = [
    [70, t('Your app', 'Uygulamanız'), 'actor'],
    [225, 'API', 'boundary'],
    [400, t('SQLite ledger', 'SQLite günlüğü'), 'entity'],
    [590, t('Worker', 'İşçi'), 'control'],
    [760, t('Model', 'Model'), 'external'],
    [890, 'LanceDB · Kùzu', 'entity']
  ];
  const head = lanes.map(([x, name, kind]) => `<g class="uml-participant"><rect x="${x - 60}" y="18" width="120" height="44" rx="4" class="uml-node${kind === 'boundary' ? ' uml-node--accent' : ''}"/>${stereo(x, 34, kind)}${text(x, 52, name, 'uml-title-sm')}</g><path d="M${x} 62 V748" class="uml-lifeline"/>`).join('');
  const bar = (x, y1, y2) => `<rect x="${x - 5}" y="${y1}" width="10" height="${y2 - y1}" class="uml-activation"/>`;
  const msg = (x1, x2, y, label, ret = false) => {
    const d = x2 > x1 ? `M${x1 + 5} ${y} H${x2 - 6}` : `M${x1 - 5} ${y} H${x2 + 6}`;
    return `${line(d, id, { dashed: ret, head: ret ? 'open' : 'fill' })}${text((x1 + x2) / 2, y - 7, label, ret ? 'uml-msg uml-msg--return' : 'uml-msg')}`;
  };
  const frame = (x, y, w, h, kind, guard) => `<g class="uml-fragment"><rect x="${x}" y="${y}" width="${w}" height="${h}" class="uml-frame"/><path d="M${x} ${y} h${kind.length * 8 + 22} v14 l-8 8 h-${kind.length * 8 + 14}z" class="uml-frame-tab"/>${text(x + 8, y + 15, kind, 'uml-frame-label', 'start')}${guard ? text(x + kind.length * 8 + 32, y + 16, guard, 'uml-guard', 'start') : ''}</g>`;
  const body = `${head}
  ${bar(225, 92, 186)}${bar(400, 112, 150)}
  ${msg(70, 225, 100, t('insert(source chunk)', 'insert(kaynak parça)'))}
  ${msg(225, 400, 122, t('create mutation + run', 'değişiklik + çalışma yarat'))}
  ${msg(400, 225, 146, 'mutation_id', true)}
  ${msg(225, 70, 176, '202 · mutation_id', true)}
  ${note(86, 194, 200, 44, [t('202 = accepted, not processed.', '202 = kabul edildi, işlenmedi.'), t('Processing continues below.', 'İşleme aşağıda sürer.')])}
  ${bar(590, 222, 560)}${bar(760, 290, 316)}${bar(760, 342, 368)}
  ${msg(590, 400, 232, t('claim run (lease)', 'işi sahiplen (süreli)'))}
  ${msg(400, 590, 256, t('source chunk', 'kaynak parça'), true)}
  ${msg(590, 760, 298, t('extract if enabled', 'açıksa bilgi çıkar'))}
  ${msg(760, 590, 316, t('0..N facts', '0..N bilgi'), true)}
  ${msg(590, 760, 350, t('validate (mode 0–2)', 'doğrula (mod 0–2)'))}
  ${msg(760, 590, 368, t('accept / reject', 'kabul / ret'), true)}
  ${frame(300, 386, 650, 178, 'alt', t('[accepted]', '[kabul]'))}
  ${msg(590, 400, 428, t('facts · SQL_APPLIED', 'bilgiler · SQL_APPLIED'))}
  ${msg(590, 890, 456, t('VECTOR_APPLIED / SKIPPED', 'VECTOR_APPLIED / SKIPPED'))}
  ${msg(590, 890, 482, t('GRAPH_APPLIED / SKIPPED', 'GRAPH_APPLIED / SKIPPED'))}
  ${msg(590, 400, 508, 'state = COMMITTED')}
  <path d="M300 516 H950" class="uml-edge uml-edge--dashed"/>${text(310, 532, t('[rejected]', '[ret]'), 'uml-guard', 'start')}
  ${msg(590, 400, 548, 'state = REJECTED')}
  ${frame(20, 590, 430, 150, 'loop', t('[every 2 s until a terminal state]', '[son duruma kadar 2 sn’de bir]'))}
  ${bar(225, 636, 706)}
  ${msg(70, 225, 644, 'GET /v4/mutations/{id}')}
  ${msg(225, 400, 666, t('read state', 'durumu oku'))}
  ${msg(400, 225, 688, 'state', true)}
  ${msg(225, 70, 714, t('final state', 'son durum'), true)}`;
  return figure({ id, t, viewBox: '0 0 960 760', minWidth: 820, body,
    title: [t('UML · Sequence diagram', 'UML · Sıralı etkileşim şeması'), t('Write path: accept now, process in the background, poll for the result', 'Yazma yolu: hemen kabul, arka planda işleme, sonucu sorgulama')],
    caption: t('Each store write waits for the previous one. Retries reuse idempotent artifact IDs, so a repeated step does not create duplicates. Default SDK polling interval: 2 seconds.', 'Her depo yazması bir öncekini bekler. Yeniden denemeler aynı kimlikleri kullanır; tekrarlanan adım çift kayıt üretmez. SDK’nın varsayılan sorgulama aralığı 2 saniyedir.') });
}

// 3 · State machine — one mutation's lifecycle, failure branches included.
export function mutationStateDiagram(t, id = 'uml-mutation-states') {
  const top = 74, low = 262;
  const states = {
    QUEUED: [70, top], RUNNING: [226, top], EXTRACTED: [382, top], VALIDATED: [538, top], PROJECTING: [694, top], COMMITTED: [850, top],
    DLQ: [70, low], RETRY_PENDING: [226, low], REJECTED: [460, low], BLOCKED: [694, low], ROLLED_BACK: [850, low]
  };
  const w = 124, h = 46;
  const kind = { COMMITTED: 'ok', REJECTED: 'stop', DLQ: 'stop', BLOCKED: 'warn', RETRY_PENDING: 'warn', ROLLED_BACK: 'muted' };
  const node = (name) => { const [x, y] = states[name]; return `<g class="uml-state uml-state--${kind[name] || 'flow'}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" class="uml-node"/>${text(x + w / 2, y + 28, name, 'uml-state-name')}</g>`; };
  const L = (n) => states[n][0], R = (n) => states[n][0] + w, M = (n) => states[n][0] + w / 2, T = (n) => states[n][1], B = (n) => states[n][1] + h, C = (n) => states[n][1] + h / 2;
  const flow = ['QUEUED', 'RUNNING', 'EXTRACTED', 'VALIDATED', 'PROJECTING', 'COMMITTED'];
  const labels = [t('worker claims', 'işçi alır'), t('facts found', 'bilgi çıktı'), t('checks pass', 'kontrol geçti'), t('SQL written', 'SQL yazıldı'), t('all stores', 'tüm depolar')];
  const forward = flow.slice(0, -1).map((name, i) => `${line(`M${R(name)} ${C(name)} H${L(flow[i + 1]) - 2}`, id)}${text((R(name) + L(flow[i + 1])) / 2, T(name) - 12, labels[i], 'uml-edge-label')}`).join('');
  const body = `
  <circle cx="30" cy="${C('QUEUED')}" r="9" class="uml-initial"/>${line(`M39 ${C('QUEUED')} H${L('QUEUED') - 2}`, id)}
  ${Object.keys(states).map(node).join('')}
  ${forward}
  ${line(`M${M('PROJECTING')} ${B('PROJECTING')} V160 H${M('RETRY_PENDING') + 24} V${T('RETRY_PENDING') - 2}`, id)}${text(M('PROJECTING') - 8, 152, t('transient error (any step)', 'geçici hata (herhangi adım)'), 'uml-guard', 'end')}
  ${line(`M${M('EXTRACTED')} ${B('EXTRACTED')} V196 H${M('REJECTED')} V${T('REJECTED') - 2}`, id)}${text(M('EXTRACTED') + 10, 216, t('[validation rejects]', '[doğrulama reddeder]'), 'uml-guard', 'start')}
  ${line(`M${M('RETRY_PENDING') - 24} ${T('RETRY_PENDING')} V${B('RUNNING') + 2}`, id)}${text(M('RETRY_PENDING') - 32, 214, t('retry', 'yeniden dene'), 'uml-edge-label', 'end')}
  ${line(`M${L('RETRY_PENDING')} ${C('RETRY_PENDING')} H${R('DLQ') + 2}`, id)}${text((L('RETRY_PENDING') + R('DLQ')) / 2, B('DLQ') + 20, t('retries exhausted', 'deneme hakkı bitti'), 'uml-edge-label')}
  ${line(`M${M('DLQ')} ${T('DLQ')} V${B('QUEUED') + 2}`, id)}${text(M('DLQ') + 8, 214, t('replay', 'yeniden kuyruk'), 'uml-edge-label', 'start')}
  ${line(`M${M('COMMITTED') + 22} ${B('COMMITTED')} V${T('ROLLED_BACK') - 2}`, id)}${text(M('COMMITTED') + 30, 196, t('rollback', 'geri alma'), 'uml-edge-label', 'start')}${text(M('COMMITTED') + 30, 212, t('[cleanup done]', '[temizlik bitti]'), 'uml-guard', 'start')}
  ${line(`M${M('COMMITTED') - 22} ${B('COMMITTED')} V228 H${M('BLOCKED')} V${T('BLOCKED') - 2}`, id)}${text(M('BLOCKED') - 10, 244, t('rollback [cleanup unfinished]', 'geri alma [temizlik bitmedi]'), 'uml-guard', 'end')}
  ${note(386, 336, 352, 40, [t('REJECTED keeps the audit source but creates no search data.', 'REJECTED denetim kaynağını tutar, arama verisi oluşturmaz.')])}`;
  return figure({ id, t, viewBox: '0 0 1050 390', minWidth: 800, body,
    title: [t('UML · State machine', 'UML · Durum makinesi'), t('One mutation from QUEUED to a terminal state', 'Bir değişikliğin QUEUED’dan son duruma yolu')],
    caption: t('Only COMMITTED means every store was written. Retries are bounded; exhausted work parks in the dead-letter queue (DLQ) until someone replays it. A failure stays visible instead of being hidden by compensation.', 'Yalnızca COMMITTED tüm depolara yazıldığını gösterir. Yeniden denemeler sınırlıdır; sonuçlanmayan iş, biri yeniden kuyruğa alana kadar hata kuyruğunda (DLQ) bekler. Hata gizlenmez, görünür kalır.') });
}

// 4 · Activity diagram — the read path with four parallel lanes.
export function readActivityDiagram(t, id = 'uml-read-activity') {
  const action = (x, y, w, h, title, sub) => `<g class="uml-action"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" class="uml-node"/>${text(x + w / 2, y + (sub ? h / 2 - 2 : h / 2 + 5), title, 'uml-title-sm')}${sub ? text(x + w / 2, y + h / 2 + 15, sub, 'uml-sub') : ''}</g>`;
  const lanes = [
    [t('Vector', 'Vektör'), t('LanceDB · meaning', 'LanceDB · anlam')],
    ['BM25', t('SQLite FTS5 · words', 'SQLite FTS5 · sözcük')],
    [t('Assertion', 'Bilgi kaydı'), t('SQLite · structured facts', 'SQLite · düzenli bilgi')],
    [t('Graph path', 'Çizge yolu'), t('Kùzu · ≤ 3 hops', 'Kùzu · ≤ 3 adım')]
  ];
  const ys = [44, 128, 212, 296];
  const body = `
  <circle cx="26" cy="196" r="9" class="uml-initial"/>${line('M35 196 H56', id)}
  ${action(58, 160, 150, 72, t('Resolve session', 'Oturumu çöz'), t('authorized datasets', 'yetkili veri kümeleri'))}
  ${line('M208 196 H232', id)}
  ${action(234, 160, 160, 72, t('Filter eligible', 'Uygunları süz'), t('tenant · time · committed', 'kurum · zaman · tamamlanmış'))}
  ${line('M394 196 H418', id)}
  <rect x="420" y="40" width="7" height="312" class="uml-bar"/>
  ${lanes.map(([name, sub], i) => `${line(`M427 ${ys[i] + 34} H452`, id)}${action(454, ys[i], 200, 68, name, sub)}${line(`M654 ${ys[i] + 34} H678`, id)}`).join('')}
  <rect x="680" y="40" width="7" height="312" class="uml-bar"/>
  ${line('M687 196 H708', id)}
  ${action(710, 160, 120, 72, t('Fuse ranks', 'Sıraları birleştir'), 'RRF · k = 60')}
  ${line('M770 232 V266', id)}
  ${action(700, 268, 140, 72, t('Pack evidence', 'Kanıtı paketle'), t('≤ 2048 tokens', '≤ 2048 token'))}
  ${line('M840 304 H896', id)}
  <circle cx="910" cy="304" r="12" class="uml-final-ring"/><circle cx="910" cy="304" r="7" class="uml-initial"/>
  ${text(560, 375, t('fork: each lane runs on the same eligible set · join: one vote per lane per candidate', 'çatal: her kanal aynı uygun küme üzerinde çalışır · birleşim: aday başına kanal başına bir oy'), 'uml-guard')}`;
  return figure({ id, t, viewBox: '0 0 940 390', minWidth: 760, body,
    title: [t('UML · Activity diagram', 'UML · Etkinlik şeması'), t('Read path: four lanes in parallel, one fused result', 'Okuma yolu: dört paralel kanal, tek birleşik sonuç')],
    caption: t('Scope is applied before ranking, so no lane can rank a record the session may not read. RRF combines rank positions, not raw scores; PageRank is telemetry only (ADR 0010).', 'Kapsam sıralamadan önce uygulanır; hiçbir kanal oturumun okuyamayacağı kaydı sıralayamaz. RRF ham skorları değil sıra konumlarını birleştirir; PageRank yalnızca izleme verisidir (ADR 0010).') });
}

// 5 · Class diagram — catalog scope and source identity.
export function catalogClassDiagram(t, id = 'uml-catalog-classes') {
  const W = 190;
  const cls = (x, y, name, attrs, { accent = false, stereotype = '' } = {}) => {
    const top = stereotype ? 44 : 32, h = top + 12 + attrs.length * 16;
    return `<g class="uml-class${accent ? ' uml-class--accent' : ''}"><rect x="${x}" y="${y}" width="${W}" height="${h}" rx="3" class="uml-node"/>${stereotype ? stereo(x + W / 2, y + 16, stereotype) : ''}${text(x + W / 2, y + (stereotype ? 34 : 22), name, 'uml-title')}<path d="M${x} ${y + top} H${x + W}" class="uml-divider"/>${attrs.map((a, i) => text(x + 10, y + top + 18 + i * 16, a, 'uml-attr', 'start')).join('')}</g>`;
  };
  const mult = (x, y, value, anchor = 'middle') => text(x, y, value, 'uml-mult', anchor);
  const body = `
  ${cls(20, 40, 'Principal', ['+ principal_id', t('+ key (scrypt hash)', '+ anahtar (scrypt özeti)')])}
  ${cls(280, 40, 'Tenant', ['+ tenant_id'])}
  ${cls(540, 40, 'Workspace', ['+ workspace_id'])}
  ${cls(780, 40, 'Dataset', ['+ dataset_id', t('+ purge, rollback grants', '+ purge, rollback izni')], { accent: true })}
  ${cls(280, 128, 'Role', ['OWNER', 'WRITER', 'READER'], { stereotype: 'enumeration' })}
  ${cls(20, 250, 'Session', ['+ session_id', t('+ dataset_ids {frozen}', '+ dataset_ids {sabit}')], { accent: true })}
  ${cls(280, 250, 'Agent', ['+ agent_id', t('persona, not a boundary', 'kişilik, sınır değil')])}
  ${cls(780, 250, 'Document', ['+ document_id', '+ title'])}
  ${cls(780, 400, 'Revision', ['+ revision_id'], { stereotype: 'immutable' })}
  ${cls(540, 400, 'SourceChunk', ['+ chunk_id', t('+ exact content', '+ özgün metin')])}
  ${cls(280, 400, 'Assertion', [t('+ subject', '+ özne'), t('+ predicate', '+ yüklem'), t('+ object', '+ nesne'), '+ state'])}
  ${line('M470 72 H539', id, { head: '', tail: 'diamond' })}${mult(534, 64, '1..*', 'end')}
  ${line('M730 72 H779', id, { head: '', tail: 'diamond' })}${mult(774, 64, '1..*', 'end')}
  ${line('M875 116 V249', id, { head: '', tail: 'diamond' })}${mult(882, 242, '0..*', 'start')}
  ${line('M875 326 V399', id, { head: '', tail: 'diamond' })}${mult(882, 392, '1..*', 'start')}
  ${line('M780 444 H731', id, { head: '', tail: 'diamond' })}${mult(736, 436, '1..*', 'start')}
  <path d="M210 72 H279" class="uml-edge"/>${mult(216, 64, '*', 'start')}${mult(274, 64, '*', 'end')}${text(245, 90, t('role', 'rol'), 'uml-edge-label')}
  <path d="M245 72 V100 M245 108 V176 H279" class="uml-edge uml-edge--dashed"/>
  <path d="M115 116 V249" class="uml-edge"/>${mult(122, 134, '1', 'start')}${mult(122, 242, '0..*', 'start')}${text(124, 190, t('starts', 'başlatır'), 'uml-edge-label', 'start')}
  <path d="M210 282 H279" class="uml-edge"/>${mult(216, 274, '*', 'start')}${mult(274, 274, '1', 'end')}${text(245, 300, t('acts as', 'adına'), 'uml-edge-label')}
  ${line('M115 326 V364 H750 V190 H810 V120', id, { dashed: true })}${text(430, 356, t('«scope» 1..* datasets', '«kapsam» 1..* veri kümesi'), 'uml-edge-label')}
  <path d="M540 444 H471" class="uml-edge"/>${mult(535, 436, '1..*', 'end')}${mult(476, 436, '0..*', 'start')}${text(505, 462, t('evidence', 'kanıt'), 'uml-edge-label')}
  ${note(20, 400, 230, 60, [t('Roles inherit downward.', 'Roller aşağı doğru miras kalır.'), t('Request metadata never', 'İstek verisi hiçbir zaman'), t('grants authority (ADR 0011).', 'yetki vermez (ADR 0011).')])}`;
  return figure({ id, t, viewBox: '0 0 990 525', minWidth: 780, body,
    title: [t('UML · Class diagram', 'UML · Sınıf şeması'), t('Who may read what, and where every fact comes from', 'Kim neyi okuyabilir, her bilgi nereden gelir')],
    caption: t('Filled diamonds mean ownership (composition): deleting a dataset removes its documents. Role is an association class on the Principal–Tenant link and inherits down to workspaces and datasets. A session is created by the server and freezes its dataset set.', 'Dolu elmas sahipliği (bileşim) gösterir: veri kümesi silinince belgeleri de gider. Role, Principal–Tenant bağındaki ilişki sınıfıdır ve çalışma alanlarına, veri kümelerine miras kalır. Oturumu sunucu oluşturur ve veri kümesi setini sabitler.') });
}

// 6 · Deployment diagram — what runs where.
export function deploymentDiagram(t, id = 'uml-deployment') {
  const node3d = (x, y, w, h, kindLabel, title, cls = '') => `<g class="uml-deploy-node ${cls}"><path d="M${x} ${y + 12} l12 -12 h${w} v${h} l-12 12" class="uml-node-depth"/><path d="M${x + w} ${y + 12} l12 -12" class="uml-node-depth-line"/><rect x="${x}" y="${y + 12}" width="${w}" height="${h}" class="uml-node"/>${stereo(x + 14, y + 32, kindLabel, 'start')}${text(x + 14, y + 52, title, 'uml-title', 'start')}</g>`;
  const artifact = (x, y, w, title, sub) => `<g class="uml-artifact"><rect x="${x}" y="${y}" width="${w}" height="54" rx="3" class="uml-node uml-node--inner"/><path d="M${x + w - 22} ${y + 8} h9 l5 5 v13 h-14z" class="uml-doc-icon"/>${stereo(x + 10, y + 18, 'artifact', 'start')}${text(x + 10, y + 36, title, 'uml-title-sm', 'start')}${sub ? text(x + 10, y + 49, sub, 'uml-sub', 'start') : ''}</g>`;
  const body = `
  ${node3d(196, 18, 540, 392, 'device', t('Host · VM or Docker Compose service', 'Sunucu · VM veya Docker Compose servisi'))}
  ${node3d(222, 86, 262, 200, 'execution environment', 'Python 3.10–3.13 · uvicorn', 'uml-deploy-node--inner')}
  ${artifact(240, 160, 226, t('mesa · combined runtime', 'mesa · birleşik çalışma'), t('API + workers + MemoryDAO', 'API + işçiler + MemoryDAO'))}
  ${text(252, 246, '{replicas = 1}', 'uml-constraint', 'start')}
  ${node3d(512, 86, 196, 296, 'volume', 'MESA_STORAGE_ROOT', 'uml-deploy-node--inner')}
  ${artifact(526, 156, 168, 'SQLite', '')}${artifact(526, 222, 168, 'LanceDB', '')}${artifact(526, 288, 168, 'Kùzu', '')}
  ${line('M466 196 H522', id)}${text(494, 188, t('owns', 'sahip'), 'uml-edge-label')}
  ${node3d(10, 160, 130, 80, 'device', t('Client', 'İstemci'))}
  ${text(24, 236, t('app · agent · SDK', 'uygulama · ajan · SDK'), 'uml-sub', 'start')}
  ${line('M140 214 H220', id)}${text(181, 206, t('HTTP API', 'HTTP API'), 'uml-edge-label')}${text(181, 230, 'X-API-Key', 'uml-mult')}
  ${node3d(774, 70, 170, 84, 'external', t('Model providers', 'Model sağlayıcıları'))}
  ${text(788, 150, t('only if models enabled', 'yalnız model açıksa'), 'uml-sub', 'start')}
  ${line('M420 98 V8 H858 V76', id, { dashed: true })}${text(640, 22, t('extraction · validation · embeddings', 'çıkarım · doğrulama · embedding'), 'uml-edge-label')}
  ${node3d(774, 290, 170, 84, 'device', t('Backup target', 'Yedek hedefi'))}
  ${line('M708 330 H770', id, { dashed: true })}${text(740, 322, t('offline', 'çevrimdışı'), 'uml-edge-label')}
  ${note(222, 312, 262, 64, [t('Never point two processes', 'İki süreci aynı depolama'), t('at one storage root.', 'köküne bağlamayın.'), t('Scale admission, not writers.', 'Kabulü ölçekleyin, yazıcıyı değil.')])}`;
  return figure({ id, t, viewBox: '0 0 960 420', minWidth: 780, body,
    title: [t('UML · Deployment diagram', 'UML · Dağıtım şeması'), t('One process, one storage root, optional model providers', 'Tek süreç, tek depolama kökü, isteğe bağlı model sağlayıcılar')],
    caption: t('The three stores are embedded files under one root, so they are backed up and restored together. With models disabled the server starts and answers health checks, but cannot admit new memory (503).', 'Üç depo tek kök altındaki gömülü dosyalardır; birlikte yedeklenir ve geri yüklenir. Modeller kapalıyken sunucu açılır ve sağlık kontrolüne yanıt verir, ancak yeni hafıza kabul edemez (503).') });
}

export const diagrams = {
  components: componentDiagram,
  'write-sequence': writeSequenceDiagram,
  'mutation-states': mutationStateDiagram,
  'read-activity': readActivityDiagram,
  'catalog-classes': catalogClassDiagram,
  deployment: deploymentDiagram
};
