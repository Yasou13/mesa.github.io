const app = document.querySelector('#app');
const page = app.dataset.page || 'home';
const base = app.dataset.base || './';

const repos = {
  core: 'https://github.com/Yasou13/MESA',
  data: 'https://github.com/Yasou13/MESA_Data',
  qa: 'https://github.com/Yasou13/MESA_QA',
  certification: 'https://github.com/Yasou13/MESA_E2E_Certification',
  law: 'https://github.com/Yasou13/MESA_Law',
  profile: 'https://github.com/Yasou13'
};

const docs = {
  readme: `${repos.core}/blob/main/README.md`,
  architecture: `${repos.core}/blob/main/docs/architecture-v4.md`,
  security: `${repos.core}/blob/main/SECURITY.md`,
  contributing: `${repos.core}/blob/main/CONTRIBUTING.md`,
  installation: `${repos.core}/blob/main/docs/installation.md`,
  api: `${repos.core}/blob/main/docs/api-reference.md`,
  mcp: `${repos.core}/blob/main/README_MCP.md`,
  rebuild: `${repos.core}/blob/main/docs/v4-rebuild-runbook.md`,
  certificationAudit: `${repos.certification}/blob/main/reports/independent-audit/REPORT.md`,
  dataGuide: `${repos.data}/blob/main/docs/KULLANIM_KILAVUZU.md`,
  lawStatus: `${repos.law}/blob/master/docs/mvp-final-verification.md`
};

const route = (path = '') => `${base}${path}`;
const external = (href, label, className = '') =>
  `<a class="${className}" href="${href}" target="_blank" rel="noopener noreferrer">${label}<span aria-hidden="true"> ↗</span></a>`;
const cta = (label, href, kind = 'primary', isExternal = false) =>
  `<a class="button ${kind}" href="${href}"${isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''}>${label}${isExternal ? '<span aria-hidden="true"> ↗</span>' : ''}</a>`;

const mark = `<span class="mesa-mark" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>`;
const logo = `<a class="logo" href="${route()}" aria-label="MESA home">${mark}<span>MESA</span></a>`;

function header(active = '') {
  const nav = [
    ['mesa', 'MESA', 'mesa/'],
    ['ecosystem', 'Ecosystem', 'ecosystem/'],
    ['docs', 'Docs', 'docs/'],
    ['certification', 'Certification', 'certification/']
  ];
  return `<a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <div class="nav-shell">
        ${logo}
        <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="main-navigation">
          <span></span><span></span><span></span>
        </button>
        <nav id="main-navigation" aria-label="Main navigation">
          ${nav.map(([key, label, path]) => `<a${active === key ? ' class="active" aria-current="page"' : ''} href="${route(path)}">${label}</a>`).join('')}
          ${external(repos.core, 'GitHub', 'nav-github')}
        </nav>
      </div>
    </header>`;
}

function footer() {
  return `<section class="closing-cta grid-bg" aria-labelledby="closing-title">
      <div>
        <p class="eyebrow">OPEN SOURCE · MIT</p>
        <h2 id="closing-title">Inspect the source.<br><em>Test the boundaries.</em></h2>
        <p>MESA is under active development. Start with the documented safe-core profile and review the release-candidate limits before evaluating the full V4 runtime.</p>
        <div class="actions">${cta('Read the quickstart', route('docs/'))}${cta('View source', repos.core, 'secondary', true)}</div>
      </div>
    </section>
    <footer class="site-footer">
      <div class="footer-brand">${logo}<p>Memory Engine for Structured Agents.</p><p class="footer-note">V4 release candidate · Production NO-GO</p></div>
      <div class="footer-groups">
        <div><h3>Project</h3><a href="${route('mesa/')}">MESA Core</a><a href="${route('ecosystem/')}">Ecosystem</a><a href="${route('status/')}">Project status</a>${external(repos.core, 'GitHub')}</div>
        <div><h3>Ecosystem</h3><a href="${route('data/')}">MESA Data</a><a href="${route('qa/')}">MESA QA</a><a href="${route('certification/')}">E2E Certification</a><a href="${route('law/')}">MESA Law</a></div>
        <div><h3>Documentation</h3>${external(docs.readme, 'Quickstart')}${external(docs.architecture, 'Architecture')}${external(docs.security, 'Security')}${external(docs.contributing, 'Contributing')}<a href="${route('docs/mcp/')}">MCP integration</a></div>
        <div><h3>Source</h3>${external(repos.profile, 'GitHub profile')}${external(repos.data, 'Data repository')}${external(repos.qa, 'QA repository')}${external(repos.certification, 'Certification repository')}</div>
      </div>
      <div class="footer-bottom"><span>© 2026 MESA contributors</span><span>Source-verified documentation gateway</span></div>
    </footer>`;
}

function statusStrip() {
  return `<section class="status-strip" aria-label="Current project status">
      <div><small>CORE LINE</small><strong>v0.7.1 / V4</strong></div>
      <div><small>MATURITY</small><strong>Release Candidate</strong></div>
      <div><small>FINAL MVP CERTIFICATION</small><strong>In progress</strong></div>
      <div><small>PRODUCTION</small><strong class="status-no-go">NO-GO</strong></div>
    </section>`;
}

function architectureFlow() {
  const items = [
    ['01', 'Sources', 'Exact source text and version identity'],
    ['02', 'Admission', 'Authorized, dataset-scoped mutation'],
    ['03', 'Validation', 'Deterministic, single, or dual policy'],
    ['04', 'SQL ledger', 'Catalog, ownership, assertions, outbox'],
    ['05', 'Projections', 'Vector then Graph V2, idempotently'],
    ['06', 'Retrieval', 'BM25 + vector + assertion rank fusion'],
    ['07', 'Clients', 'REST, sync/async SDK, MCP']
  ];
  return `<div class="architecture-flow">${items.map(([n, title, text]) => `<div class="flow-step"><span>${n}</span><strong>${title}</strong><small>${text}</small></div>`).join('<b aria-hidden="true">→</b>')}</div>`;
}

function ecosystemCards() {
  const cards = [
    ['Core', 'mesa/', 'Durable memory engine', 'Owns the V4 catalog, authorization, mutation lifecycle, projections, retrieval, API, SDK, and MCP surfaces.', repos.core],
    ['Data', 'data/', 'Turkish legal-data pipeline', 'Collects from configured official sources, preserves raw bytes, canonicalizes records, gates quality, and publishes reviewed releases.', repos.data],
    ['QA', 'qa/', 'Detached endurance testing', 'Exercises correctness, temporal change, cross-session persistence, restart durability, and bounded candidate repair.', repos.qa],
    ['Certification', 'certification/', 'Independent Profile B harness', 'Defines frozen evidence, ground truth, hard gates, and fail-closed verdicts for the legal end-to-end profile.', repos.certification],
    ['Law', 'law/', 'Legal workflow application', 'A matter and document workflow with review, provenance, deadlines, drafting controls, and a pinned MESA V4 HTTP boundary.', repos.law]
  ];
  return `<div class="ecosystem-grid">${cards.map(([title, path, role, text, repo], i) => `<article class="ecosystem-card">
      <div class="card-index">0${i + 1}</div><p class="eyebrow">${role}</p><h3>MESA ${title}</h3><p>${text}</p>
      <div class="card-links"><a href="${route(path)}">Explore ${title}<span aria-hidden="true"> →</span></a>${external(repo, 'Repository')}</div>
    </article>`).join('')}</div>`;
}

function home() {
  return `${header('home')}<main id="main-content">
    <section class="hero grid-bg">
      <div class="hero-orbit" aria-hidden="true"><span></span><span></span><span></span><span></span><i>M</i></div>
      <div class="hero-copy">
        <p class="eyebrow">MEMORY ENGINE FOR STRUCTURED AGENTS</p>
        <h1>Memory with evidence,<br><em>not mystery.</em></h1>
        <p>MESA is an open-source, durable memory engine for AI agents. Its V4 release candidate keeps source provenance and dataset scope attached from admission through retrieval.</p>
        <div class="actions">${cta('Explore MESA', route('mesa/'))}${cta('View on GitHub', repos.core, 'secondary', true)}</div>
      </div>
      <a class="scroll-cue" href="#why-mesa">Explore the system <span aria-hidden="true">↓</span></a>
    </section>
    ${statusStrip()}
    <section class="section problem-section" id="why-mesa">
      <div class="section-heading"><div><p class="eyebrow">WHY MESA</p><h2>Agent memory needs<br><em>boundaries and lineage.</em></h2></div><p>Retrieval is only useful when the system can say which source, revision, dataset, and policy produced a result—and when failed writes cannot leak into active memory.</p></div>
      <div class="principle-grid">
        <article><span>01</span><h3>Durable lifecycle</h3><p>Accepted mutations move through a ledger, ordered projection lanes, retries, dead-letter handling, replay, and source-owned rollback.</p><a href="${route('mesa/')}">Follow the lifecycle →</a></article>
        <article><span>02</span><h3>Scoped by design</h3><p>Server-created sessions bind a principal to tenant, workspace, agent, and an immutable authorized dataset set.</p><a href="${route('mesa/#security')}">Review isolation →</a></article>
        <article><span>03</span><h3>Evidence in retrieval</h3><p>Dataset-filtered BM25, vector, and assertion-relational lanes fuse ranked results while retaining provenance.</p><a href="${route('mesa/#retrieval')}">Inspect retrieval →</a></article>
      </div>
    </section>
    <section class="section architecture-section grid-bg" id="architecture">
      <div class="section-heading"><div><p class="eyebrow">V4 ARCHITECTURE</p><h2>One decision path.<br><em>Three physical stores.</em></h2></div><p>MESA Data can prepare upstream legal releases; MESA Core owns admission, validation, projections, and retrieval. SQLite is the decision source, with LanceDB and Kuzu as ordered projections.</p></div>
      ${architectureFlow()}
      <div class="section-actions">${cta('Read architecture', route('mesa/'))}${cta('Source document', docs.architecture, 'text', true)}</div>
    </section>
    <section class="section ecosystem-section" id="ecosystem"><div class="section-heading"><div><p class="eyebrow">THE ECOSYSTEM</p><h2>Separate systems.<br><em>Explicit contracts.</em></h2></div><p>Each repository has a narrow role. The website preserves those boundaries rather than presenting one undifferentiated product.</p></div>${ecosystemCards()}</section>
    <section class="section reliability-section">
      <div class="section-heading"><div><p class="eyebrow">CORRECTNESS SURFACES</p><h2>Reliability is a process,<br><em>not a badge.</em></h2></div></div>
      <div class="reliability-list">
        <article><strong>Provenance</strong><p>Source, revision, chunk, pipeline, and embedding identity can travel with canonical artifacts and retrieval results.</p></article>
        <article><strong>Isolation</strong><p>Dataset filters are applied to SQL, vector, and graph lanes before fusion; agent IDs alone are not tenant credentials.</p></article>
        <article><strong>QA</strong><p>A detachable system evaluates behavior over sessions and restarts without writing to the baseline checkout.</p></article>
        <article><strong>Certification</strong><p>Profile B defines evidence and hard gates for one legal path. It does not certify the full MESA MVP.</p></article>
      </div>
    </section>
    <section class="section quickstart-section" id="quickstart">
      <div class="quickstart-copy"><p class="eyebrow">SAFE-CORE QUICKSTART</p><h2>Start from the<br><em>locked environment.</em></h2><p>The documented default Compose profile keeps model and external-provider access disabled and commits accepted records as durable raw memories.</p>${cta('Full installation guide', docs.installation, 'text', true)}</div>
      <div class="terminal" aria-label="MESA safe-core quickstart commands"><div class="terminal-bar"><span><i></i><i></i><i></i></span><strong>mesa / safe-core</strong><button class="copy-button" type="button" data-copy-target="quickstart-code">Copy</button></div><pre id="quickstart-code"><code>git clone https://github.com/Yasou13/MESA.git
cd MESA
export MESA_API_KEY=local-dev-key
export MESA_PRINCIPAL_ID=local-compose-principal
docker compose config --quiet
docker compose up --build -d

curl --fail -H "X-API-Key: $MESA_API_KEY" \
  http://localhost:8000/health</code></pre></div>
    </section>
    ${footer()}</main>`;
}

function mesa() {
  return `${header('mesa')}<main id="main-content">
    <section class="page-hero grid-bg"><p class="eyebrow">MESA CORE · V0.7.1</p><h1>A durable memory engine<br>with <em>structured evidence.</em></h1><p>The V4 release candidate introduces canonical provenance, selectable validation, dataset isolation, ordered projections, and versioned REST, SDK, and MCP operations.</p><div class="actions">${cta('Source repository', repos.core, 'primary', true)}${cta('Documentation', route('docs/'), 'secondary')}</div></section>
    ${statusStrip()}
    <section class="section"><div class="section-heading"><div><p class="eyebrow">MEMORY LIFECYCLE</p><h2>Admission to retrieval,<br><em>without hidden writes.</em></h2></div><p>A rejected mutation creates no active SQL, vector, entity, edge, or assertion artifact. Accepted work follows ordered, idempotent lanes.</p></div>${architectureFlow()}</section>
    <section class="section surface-section" id="security"><div class="surface-copy"><p class="eyebrow">SECURITY BOUNDARY</p><h2>Agents are context.<br><em>Tenants are boundaries.</em></h2><p>V4 authorization follows principal → tenant → workspace → dataset → agent → server-created session. Roles inherit down the catalog. Purge and rollback require explicit dataset permissions.</p>${cta('Read security policy', docs.security, 'text', true)}</div><div class="scope-visual" role="img" aria-label="Nested MESA authorization scopes"><span>Principal<strong>Tenant<span>Workspace<strong>Dataset<span>Agent<strong>Session</strong></span></strong></span></strong></span></div></section>
    <section class="section retrieval-section" id="retrieval"><div class="section-heading"><div><p class="eyebrow">RETRIEVAL V2</p><h2>Multiple signals.<br><em>One bounded result.</em></h2></div><p>Authorized dataset filters reach every lane before rank fusion. Higher fused scores are better.</p></div><div class="lane-grid"><article><span>LEXICAL</span><h3>BM25</h3><p>Exact and lexical evidence from the SQL-owned corpus.</p></article><article><span>SEMANTIC</span><h3>Vector</h3><p>LanceDB projection with embedding provenance.</p></article><article><span>RELATIONAL</span><h3>Assertions</h3><p>Graph V2 assertion relations; Kuzu neighbour traversal is not advertised as a retrieval capability.</p></article><article class="fusion"><span>FUSION</span><h3>True RRF</h3><p>Rank fusion followed by a deterministic, bounded legal reranker.</p></article></div></section>
    <section class="section storage-section"><div><p class="eyebrow">PHYSICAL STORES</p><h2>SQLite decides.<br><em>Projections follow.</em></h2></div><div class="storage-grid"><article><strong>SQLite</strong><p>Catalog, authorization, mutation/pipeline ledger, ownership, assertions, and ordered outbox.</p></article><article><strong>LanceDB</strong><p>Idempotent vector projection with embedding identity.</p></article><article><strong>Kuzu</strong><p>Idempotent Graph V2 projection, not the assertion decision source.</p></article></div></section>
    <section class="section client-section"><div class="section-heading"><div><p class="eyebrow">CLIENT SURFACES</p><h2>Versioned access<br><em>around one lifecycle.</em></h2></div></div><div class="client-grid"><a href="${docs.api}" target="_blank" rel="noopener noreferrer"><span>HTTP</span><strong>V4 REST API</strong><small>Catalog, sessions, memory, mutations, operations</small></a><a href="${docs.readme}" target="_blank" rel="noopener noreferrer"><span>PYTHON</span><strong>Sync & async SDK</strong><small>MesaV4Client and version-matched operations</small></a><a href="${route('docs/mcp/')}"><span>PROTOCOL</span><strong>MCP</strong><small>Legacy direct stdio plus the V4 gateway/bridge path</small></a></div></section>
    ${footer()}</main>`;
}

function ecosystem() {
  return `${header('ecosystem')}<main id="main-content"><section class="page-hero compact grid-bg"><p class="eyebrow">ECOSYSTEM</p><h1>One memory project.<br><em>Five explicit roles.</em></h1><p>Core, legal data, QA, certification, and an application layer evolve in separate repositories with observable boundaries.</p></section><section class="section ecosystem-section">${ecosystemCards()}</section><section class="section boundary-section"><p class="eyebrow">BOUNDARY MAP</p><h2>How the parts relate</h2><div class="boundary-map"><div><strong>MESA Data</strong><small>Reviewed legal release</small></div><b>→</b><div><strong>MESA Core</strong><small>Canonical memory lifecycle</small></div><b>→</b><div><strong>MESA Law</strong><small>HTTP-bound legal workflow</small></div><i></i><div class="below"><strong>MESA QA</strong><small>Detached behavior testing</small></div><div class="below"><strong>E2E Certification</strong><small>Frozen Profile B evidence</small></div></div></section>${footer()}</main>`;
}

function dataPage() {
  return `${header('ecosystem')}<main id="main-content"><section class="page-hero compact data-accent"><p class="eyebrow">MESA DATA</p><h1>Legal data with an<br><em>auditable release path.</em></h1><p>MESA Data is specifically a Turkish legal-data platform. It is not presented as a universal ingestion service.</p><div class="actions">${cta('Repository', repos.data, 'primary', true)}${cta('Usage guide', docs.dataGuide, 'secondary', true)}</div></section>
    <section class="section"><div class="section-heading"><div><p class="eyebrow">CONFIGURED SOURCES</p><h2>Official sources,<br><em>policy-bound access.</em></h2></div><p>The current configuration enables Resmî Gazete discovery and manual collection from Mevzuat and the Constitutional Court. Yargıtay is configured but disabled.</p></div><div class="source-table" role="table" aria-label="MESA Data configured sources"><div role="row"><strong role="columnheader">Source</strong><strong role="columnheader">Mode</strong><strong role="columnheader">State</strong><strong role="columnheader">Role</strong></div><div role="row"><span>Resmî Gazete</span><span>Approved web</span><span class="ok">Enabled</span><span>Original publication</span></div><div role="row"><span>Mevzuat Bilgi Sistemi</span><span>Manual</span><span class="ok">Enabled</span><span>Consolidated text</span></div><div role="row"><span>Anayasa Mahkemesi</span><span>Manual</span><span class="ok">Enabled</span><span>Official case law</span></div><div role="row"><span>Yargıtay</span><span>Manual</span><span class="muted">Disabled</span><span>Official case law</span></div></div></section>
    <section class="section pipeline-section grid-bg"><p class="eyebrow">RELEASE PIPELINE</p><h2>Raw bytes remain traceable.</h2><div class="pipeline"><div><span>01</span><strong>Collect</strong><small>Allowlisted HTTPS or manual file</small></div><div><span>02</span><strong>Preserve</strong><small>Immutable raw artifact + SHA-256</small></div><div><span>03</span><strong>Canonicalize</strong><small>Versioned canonical JSONL</small></div><div><span>04</span><strong>Gate</strong><small>Quality, privacy, legal metadata</small></div><div><span>05</span><strong>Review</strong><small>Safe auto-approval or human exception</small></div><div><span>06</span><strong>Release</strong><small>Build, verify, freeze, human approval</small></div><div><span>07</span><strong>Publish</strong><small>Human-started, idempotent MESA delivery</small></div></div><div class="notice"><strong>Human boundary</strong><p>MESA delivery never starts automatically. Local staging is a development tool and is not the real MESA publisher.</p></div></section>${footer()}</main>`;
}

function qaPage() {
  return `${header('ecosystem')}<main id="main-content"><section class="page-hero compact"><p class="eyebrow">MESA QA</p><h1>Test the candidate.<br><em>Protect the baseline.</em></h1><p>An external, detachable test-engineer system for long-running behavioral checks against MESA through its canonical MCP surface.</p><div class="actions">${cta('Repository', repos.qa, 'primary', true)}</div></section>
    <section class="section"><div class="section-heading"><div><p class="eyebrow">EVALUATION SCOPE</p><h2>Behavior over time,<br><em>not just unit calls.</em></h2></div></div><div class="principle-grid"><article><span>01</span><h3>Correctness</h3><p>Independent SQLite ground truth judges memory results instead of asking an LLM to grade itself.</p></article><article><span>02</span><h3>Endurance</h3><p>Profiles cover sustained remember/recall cycles, temporal updates, corrections, forgetting, and session rotation.</p></article><article><span>03</span><h3>Restart durability</h3><p>Scenarios restart candidate processes and verify that expected memory survives.</p></article></div></section>
    <section class="section worktree-section grid-bg"><div><p class="eyebrow">BOUNDED REPAIR</p><h2>Candidate-only changes.</h2><p>When a reproducible defect is found, QA can write a failing regression, apply a minimal repair, restart the candidate, and verify the result.</p></div><ol><li><span>1</span>Baseline checkout remains read-only</li><li><span>2</span>Dedicated candidate worktree and isolated storage</li><li><span>3</span>Pre-fix failure required before patching</li><li><span>4</span>Policy-limited diff and verification gates</li><li><span>5</span>No automatic merge or push to main</li></ol></section>${footer()}</main>`;
}

function certification() {
  return `${header('certification')}<main id="main-content"><section class="page-hero compact certification-accent"><p class="eyebrow">MESA PROFILE B</p><h1>Evidence before<br><em>certification language.</em></h1><p>The legal E2E repository defines the independent harness and evidence contract for MESA Data → MESA. Profile B is one profile, not full MESA MVP certification.</p><div class="actions">${cta('Certification repository', repos.certification, 'primary', true)}${cta('Current independent audit', docs.certificationAudit, 'secondary', true)}</div></section>
    <section class="cert-status"><div><small>CURRENT HARDENED PATH</small><strong>BLOCKED</strong></div><p>No current passing runtime certification transaction has been executed. Mandatory B0–B14 gates remain unverified until authoritative runtime, scoring, and metric producers are registered and proven.</p></section>
    <section class="section compare-section"><div><p class="eyebrow">WHAT PROFILE B IS DESIGNED TO PROVE</p><ul class="check-list"><li>Official legal data acquisition and byte preservation</li><li>Canonicalization without silent Turkish text loss</li><li>Native MESA Data → MESA V4 delivery</li><li>Scoped ingestion, provenance, idempotency, and restart persistence</li><li>Frozen retrieval and grounded-answer gates</li><li>Observable graph participation on designated relational queries</li></ul></div><div><p class="eyebrow">WHAT IT DOES NOT PROVE</p><ul class="cross-list"><li>Full MESA MVP certification</li><li>General production readiness</li><li>Every workload, provider, or deployment shape</li><li>Universal latency, uptime, or retrieval guarantees</li><li>That a historical qualification run remains a valid current verdict</li></ul></div></section>
    <section class="section historical-note"><p class="eyebrow">STATUS TRANSPARENCY</p><h2>The historical result is preserved,<br><em>but not promoted.</em></h2><p>The exposed 2026-09-01 run remains useful qualification/regression evidence. A later independent audit found integrity defects, invalidated its use as a Profile B v2 certification result, hardened the harness to fail closed, and recorded the remaining runtime-producer blockers.</p>${cta('Read the audit', docs.certificationAudit, 'text', true)}</section>${footer()}</main>`;
}

function lawPage() {
  return `${header('ecosystem')}<main id="main-content"><section class="page-hero compact"><p class="eyebrow">MESA LAW</p><h1>A legal workflow<br><em>at an explicit boundary.</em></h1><p>A multi-service legal matter and document workflow. Its MESA relationship is an HTTP contract—not an embedded copy of Core.</p><div class="actions">${cta('Explore repository', repos.law, 'primary', true)}${cta('Law-side status', docs.lawStatus, 'secondary', true)}</div></section>
    <section class="section"><div class="section-heading"><div><p class="eyebrow">VERIFIED REPOSITORY SCOPE</p><h2>Cases, documents,<br><em>review, and evidence.</em></h2></div><p>Current code includes a Next.js web app, FastAPI and Java API work, workers, PostgreSQL migrations, document parsing, matter-level access controls, deadlines, review state, drafting controls, and provenance-aware QA.</p></div><div class="law-grid"><article><h3>Matter workspace</h3><p>Tenant-scoped matters, parties, members, timelines, claims, evidence, and document revisions.</p></article><article><h3>Human review</h3><p>Review queues, immutable audit records, citation verification, and approval gates before external draft use.</p></article><article><h3>MESA binding</h3><p>Catalog onboarding and V4 mutation state are tracked over HTTP. A 202 admission is not presented as publication; only COMMITTED is success.</p></article><article><h3>MVP limits</h3><p>External legal research and AI draft generation are disabled in the documented MVP contract.</p></article></div></section>
    <section class="section law-status"><p class="eyebrow">CURRENT STATUS</p><h2>Law-side gates pass.<br><em>Overall integration: NO-GO.</em></h2><p>The latest repository report says isolated Law code, contract, database, frontend, and stub gates passed. The full running stack and live MESA Core integration were not executed, so overall MVP GO is not claimed.</p>${cta('Read verification report', docs.lawStatus, 'text', true)}</section>${footer()}</main>`;
}

function docsPage() {
  const groups = [
    ['Start', [['Core README & quickstart', docs.readme], ['Installation', docs.installation], ['API reference', docs.api]]],
    ['Understand', [['V4 architecture', docs.architecture], ['Security policy', docs.security], ['Rebuild runbook', docs.rebuild]]],
    ['Integrate', [['MCP integration guide', route('docs/mcp/'), false], ['Contributing', docs.contributing], ['MESA Data guide', docs.dataGuide]]],
    ['Verify', [['Project status', route('status/'), false], ['Certification audit', docs.certificationAudit], ['Law-side verification', docs.lawStatus]]]
  ];
  return `${header('docs')}<main id="main-content"><section class="page-hero compact docs-accent"><p class="eyebrow">DOCUMENTATION HUB</p><h1>Read the contract.<br><em>Then run the code.</em></h1><p>This site links to current source documents instead of maintaining a stale mirror.</p></section><section class="section docs-grid">${groups.map(([name, links]) => `<section><p class="eyebrow">${name}</p>${links.map(([label, href, ext = true]) => ext ? external(href, label) : `<a href="${href}">${label}<span aria-hidden="true"> →</span></a>`).join('')}</section>`).join('')}</section>
    <section class="section quickstart-doc"><div><p class="eyebrow">REPRODUCIBLE LOCAL SETUP</p><h2>Use the checked-in lock.</h2><p>The standard local development environment installs the locked development extra. Optional model/provider packages are separate.</p></div><div class="terminal"><div class="terminal-bar"><span><i></i><i></i><i></i></span><strong>local install</strong><button class="copy-button" type="button" data-copy-target="install-code">Copy</button></div><pre id="install-code"><code>git clone https://github.com/Yasou13/MESA.git
cd MESA
uv sync --locked --extra dev</code></pre></div></section>${footer()}</main>`;
}

function mcpPage() {
  return `${header('docs')}<main id="main-content"><section class="page-hero compact"><p class="eyebrow">MODEL CONTEXT PROTOCOL</p><h1>Two integration paths.<br><em>Different runtime contracts.</em></h1><p>MESA’s MCP documentation distinguishes the legacy direct stdio server from the current V4 gateway and local bridge path.</p><div class="actions">${cta('Source guide', docs.mcp, 'primary', true)}${cta('Core repository', repos.core, 'secondary', true)}</div></section>
    <section class="section mcp-paths"><article><p class="eyebrow">LEGACY V3-COMPATIBLE</p><h2>Direct stdio server</h2><p><code>mesa_mcp.server</code> runs an MCP JSON-RPC stdio stream and calls the public MESA HTTP API; it does not open storage databases directly. The root README documents five project-memory tools.</p><div class="tag-row"><span>stdio</span><span>HTTP API</span><span>project scope</span></div></article><article class="highlight"><p class="eyebrow">CURRENT V4 PATH</p><h2>Gateway + local bridge</h2><p>A separately supervised HTTP gateway owns credentials, policy, approvals, operation state, and connections. Codex can connect directly to its <code>/mcp</code> endpoint; Antigravity uses a binding-scoped stdio bridge.</p><div class="tag-row"><span>V4</span><span>approvals</span><span>binding-scoped</span></div></article></section>
    <section class="section tool-section"><div class="section-heading"><div><p class="eyebrow">V4 BRIDGE TOOLS</p><h2>Operations expose<br><em>their real state.</em></h2></div><p>Writes return durable operation IDs. Default policy may return PENDING_APPROVAL rather than holding stdio open.</p></div><div class="tool-list"><div><code>mesa_health</code><span>Bridge, gateway, MESA, and spool health</span></div><div><code>mesa_recall</code><span>Scoped V4 search or token-bounded context</span></div><div><code>mesa_remember</code><span>Durable write operation</span></div><div><code>mesa_improve</code><span>Revision operation with idempotency key</span></div><div><code>mesa_forget</code><span>Purge operation; never queued offline</span></div><div><code>mesa_get_operation_status</code><span>Approval and mutation progress</span></div></div></section>
    <section class="section mcp-guard"><p class="eyebrow">BOUNDARY NOTES</p><ul class="check-list"><li>stdout is reserved for MCP JSON-RPC; logs go to stderr</li><li>bridges do not import or access storage backends</li><li>credentials live outside project configuration</li><li>missing client/workspace bindings fail closed</li><li>the exact supported host depends on the selected integration path</li></ul></section>${footer()}</main>`;
}

function statusPage() {
  return `${header()}<main id="main-content"><section class="page-hero compact status-accent"><p class="eyebrow">PROJECT STATUS</p><h1>Transparent by default.<br><em>No borrowed confidence.</em></h1><p>Status below reflects current repository documentation and the hardened independent certification audit available on 2026-09-30.</p></section>${statusStrip()}
    <section class="section status-timeline"><article><span>CORE</span><h2>V4 release candidate</h2><p>MESA package line v0.7.1. Production remains NO-GO pending final MVP certification and required production-like gates.</p>${external(docs.architecture, 'Canonical architecture')}</article><article><span>PROFILE B</span><h2>Certification blocked</h2><p>The harness now fails closed, but authoritative runtime/scoring/metric producers and a current valid final run remain absent.</p>${external(docs.certificationAudit, 'Independent audit')}</article><article><span>HISTORICAL RUN</span><h2>Qualification evidence</h2><p>The exposed run is preserved for regression and audit. It is not a valid current Profile B v2 certification result.</p>${external(`${repos.certification}/blob/main/reports/legacy-audits/RUN-20260901T005200Z-p8b03/audit.md`, 'Invalidation record')}</article><article><span>MESA LAW</span><h2>Law-side pass / overall NO-GO</h2><p>Local Law-side gates passed; full-stack and live Core integration gates were not run.</p>${external(docs.lawStatus, 'Verification report')}</article></section>${footer()}</main>`;
}

function notFound() {
  return `${header()}<main id="main-content" class="not-found grid-bg"><div><p class="eyebrow">404 · ROUTE NOT FOUND</p><h1>This memory<br><em>does not exist.</em></h1><p>The page may have moved during the MESA ecosystem rebuild.</p><div class="actions">${cta('Return home', route())}${cta('Open docs', route('docs/'), 'secondary')}${cta('GitHub', repos.core, 'text', true)}</div></div></main>`;
}

const renderers = { home, mesa, ecosystem, data: dataPage, qa: qaPage, certification, law: lawPage, docs: docsPage, mcp: mcpPage, status: statusPage, notFound };
app.innerHTML = (renderers[page] || notFound)();

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-navigation');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

document.querySelectorAll('.copy-button').forEach((button) => {
  button.addEventListener('click', async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    const text = target?.innerText || '';
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = 'Copied';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(target);
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = 'Selected';
    }
    window.setTimeout(() => { button.textContent = 'Copy'; }, 1800);
  });
});
