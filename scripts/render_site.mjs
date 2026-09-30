import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(scriptDirectory);
const siteData = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'site-data.json'), 'utf8'));
const project = siteData.project;
const repos = siteData.repositories;
let base = './';

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

const mark = `<span class="mesa-mark" aria-hidden="true"></span>`;
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
      <div class="footer-brand">${logo}<p>${project.fullName}.</p><p class="footer-note">${project.runtime} ${project.maturity.toLowerCase()} · Production ${project.production}</p></div>
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
      <div><small>CORE LINE</small><strong>v${project.version} / ${project.runtime}</strong></div>
      <div><small>MATURITY</small><strong>${project.maturity}</strong></div>
      <div><small>FINAL MVP CERTIFICATION</small><strong>${project.certification}</strong></div>
      <div><small>PRODUCTION</small><strong class="status-no-go">${project.production}</strong></div>
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
    ['Core', 'mesa/', 'The memory layer', 'Accepts authorized information and makes it retrievable without dropping its evidence or data scope.', 'Owns the V4 catalog, authorization, mutation lifecycle, projections, retrieval, API, SDK, and MCP surfaces.', repos.core],
    ['Data', 'data/', 'The source preparation layer', 'Turns reviewed Turkish legal sources into traceable releases that MESA Core can admit.', 'Preserves raw bytes, canonicalizes records, applies quality gates, freezes releases, and uses a human-started publisher.', repos.data],
    ['QA', 'qa/', 'The behavior testing layer', 'Checks whether candidate builds remember, update, forget, and recover as expected over time.', 'Exercises correctness, temporal change, cross-session persistence, restart durability, and bounded candidate repair.', repos.qa],
    ['Certification', 'certification/', 'The evidence and verdict layer', 'Defines what one end-to-end legal profile must prove before a passing result can be claimed.', 'Uses frozen evidence, independent ground truth, hard gates, and fail-closed Profile B verdicts.', repos.certification],
    ['Law', 'law/', 'The application layer', 'Shows how a legal matter and document workflow can consume MESA through an explicit service boundary.', 'Adds review, provenance, deadlines, drafting controls, and a pinned MESA V4 HTTP contract.', repos.law]
  ];
  return `<div class="ecosystem-grid">${cards.map(([title, path, role, summary, technical, repo], i) => `<article class="ecosystem-card">
      <div class="card-index">0${i + 1}</div><p class="eyebrow">${role}</p><h3>MESA ${title}</h3><p class="card-summary">${summary}</p>
      <details><summary>Technical role</summary><p>${technical}</p></details>
      <div class="card-links"><a href="${route(path)}">Explore ${title}<span aria-hidden="true"> →</span></a>${external(repo, 'Repository')}</div>
    </article>`).join('')}</div>`;
}

function home() {
  return `${header('home')}<main id="main-content">
    <section class="hero grid-bg">
      <div class="hero-orbit" aria-hidden="true"><span></span><span></span><span></span><span></span><i>M</i></div>
      <div class="hero-copy">
        <p class="eyebrow">EVIDENCE-AWARE MEMORY INFRASTRUCTURE</p>
        <h1>Memory with evidence,<br><em>not mystery.</em></h1>
        <p>MESA helps AI systems remember information without losing where it came from, how it relates, or which data boundary it belongs to. It is open-source infrastructure for assistants and agent workflows that need traceable context.</p>
        <div class="actions">${cta('Explore the ecosystem', route('ecosystem/'))}${cta('How MESA works', route('mesa/'), 'secondary')}</div>
      </div>
      <a class="scroll-cue" href="#the-problem">Why it matters <span aria-hidden="true">↓</span></a>
    </section>
    <section class="section problem-section" id="the-problem">
      <div class="section-heading"><div><p class="eyebrow">THE PROBLEM</p><h2>Remembering is easy.<br><em>Remembering responsibly is not.</em></h2></div><p>Agent context can become detached from its source, mixed across data boundaries, or stale across sessions. MESA treats memory as a controlled lifecycle instead of an unstructured pile of retrieved text.</p></div>
      <div class="principle-grid">
        <article><span>01</span><h3>Context loses its source</h3><p>MESA carries source and revision identity through admission and retrieval, so returned context can remain traceable.</p><a href="${route('mesa/')}">See the lifecycle →</a></article>
        <article><span>02</span><h3>Boundaries become unclear</h3><p>Catalog scopes and server-created sessions keep tenant and dataset authorization attached to memory operations.</p><a href="${route('mesa/#security')}">Review isolation →</a></article>
        <article><span>03</span><h3>Memory stops at one query</h3><p>A durable mutation and projection lifecycle supports updates, retries, replay, rollback, and retrieval across sessions.</p><a href="${route('mesa/#retrieval')}">Inspect retrieval →</a></article>
      </div>
    </section>
    <section class="section reliability-section grid-bg" id="why-mesa">
      <div class="section-heading"><div><p class="eyebrow">WHY MESA</p><h2>Useful context needs<br><em>evidence, structure, and scope.</em></h2></div><p>MESA combines several retrieval signals, but its differentiator is the contract around them: provenance, authorization, lifecycle state, and observable outcomes remain part of the system.</p></div>
      <div class="reliability-list">
        <article><strong>Evidence</strong><p>Keep source, revision, chunk, pipeline, and embedding identity connected to memory and retrieval results.</p></article>
        <article><strong>Structure</strong><p>Preserve assertions and relationships alongside lexical and semantic signals instead of flattening everything into text.</p></article>
        <article><strong>Scope</strong><p>Apply authorized dataset boundaries before results from SQL, vector, and relational lanes are fused.</p></article>
        <article><strong>Lifecycle</strong><p>Expose whether a write was accepted, projected, retried, rejected, rolled back, or still awaiting action.</p></article>
      </div>
      <div class="section-actions">${cta('Read the Core architecture', route('mesa/'))}${cta('Source document', docs.architecture, 'text', true)}</div>
    </section>
    <section class="section ecosystem-intro" id="ecosystem"><div class="section-heading"><div><p class="eyebrow">THE ECOSYSTEM</p><h2>From trusted sources<br><em>to usable application context.</em></h2></div><p>Data prepares reviewed inputs. Core manages memory. Applications consume scoped retrieval. QA and E2E Certification evaluate the chain from outside it.</p></div><div class="ecosystem-flow" aria-label="MESA ecosystem flow"><div><small>PREPARE</small><strong>MESA Data</strong></div><b aria-hidden="true">→</b><div><small>REMEMBER</small><strong>MESA Core</strong></div><b aria-hidden="true">→</b><div><small>APPLY</small><strong>MESA Law</strong></div></div><div class="quality-rail"><span>QUALITY LAYERS</span><strong>MESA QA</strong><i>+</i><strong>E2E Certification</strong></div><div class="section-actions">${cta('Explore all five roles', route('ecosystem/'))}</div></section>
    <section class="section journey-section grid-bg"><div class="section-heading"><div><p class="eyebrow">ONE CONCRETE PATH</p><h2>A legal source becomes<br><em>traceable application context.</em></h2></div><p>This is the ecosystem’s documented legal path—not a claim that every domain or deployment is already supported.</p></div><ol class="journey-flow"><li><span>01</span><strong>Official source</strong><small>A configured legal source or reviewed manual file</small></li><li><span>02</span><strong>MESA Data</strong><small>Preserve, canonicalize, gate, release</small></li><li><span>03</span><strong>MESA Core</strong><small>Authorize, admit, validate, project</small></li><li><span>04</span><strong>Scoped retrieval</strong><small>Lexical, vector, and assertion signals with evidence</small></li><li><span>05</span><strong>MESA Law</strong><small>Use context through a versioned HTTP boundary</small></li></ol></section>
    <section class="section use-cases"><div class="section-heading"><div><p class="eyebrow">TARGET USE CASES</p><h2>Built for systems where<br><em>context needs an audit trail.</em></h2></div><p>These are intended evaluation scenarios, not claims of current customer deployments.</p></div><div class="use-case-grid"><article><span>01</span><h3>Internal AI assistants</h3><p>Agents that need to retrieve organization knowledge while keeping data scope and source identity visible.</p></article><article><span>02</span><h3>Knowledge-heavy agents</h3><p>Long-running workflows that benefit from durable updates, relationships, and evidence-aware retrieval.</p></article><article><span>03</span><h3>Provenance-sensitive domains</h3><p>Workflows where answers must remain connected to reviewed sources. MESA Law is the current vertical example.</p></article></div></section>
    <aside class="development-note" aria-label="Development status"><div><p class="eyebrow">DEVELOPMENT STATUS</p><strong>Core v${project.version} · ${project.maturity}</strong><p>Final MVP certification is ${project.certification.toLowerCase()}; production remains ${project.production}.</p></div>${cta('See current status', route('status/'), 'secondary')}</aside>
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
    <section class="page-hero grid-bg"><p class="eyebrow">MESA CORE · V${project.version}</p><h1>A durable memory engine<br>with <em>structured evidence.</em></h1><p>The ${project.runtime} ${project.maturity.toLowerCase()} introduces canonical provenance, selectable validation, dataset isolation, ordered projections, and versioned REST, SDK, and MCP operations.</p><div class="actions">${cta('Source repository', repos.core, 'primary', true)}${cta('Documentation', route('docs/'), 'secondary')}</div></section>
    ${statusStrip()}
    <section class="section"><div class="section-heading"><div><p class="eyebrow">MEMORY LIFECYCLE</p><h2>Admission to retrieval,<br><em>without hidden writes.</em></h2></div><p>A rejected mutation creates no active SQL, vector, entity, edge, or assertion artifact. Accepted work follows ordered, idempotent lanes.</p></div>${architectureFlow()}</section>
    <section class="section surface-section" id="security"><div class="surface-copy"><p class="eyebrow">SECURITY BOUNDARY</p><h2>Agents are context.<br><em>Tenants are boundaries.</em></h2><p>V4 authorization follows principal → tenant → workspace → dataset → agent → server-created session. Roles inherit down the catalog. Purge and rollback require explicit dataset permissions.</p>${cta('Read security policy', docs.security, 'text', true)}</div><div class="scope-visual" role="img" aria-label="Nested MESA authorization scopes"><span>Principal<strong>Tenant<span>Workspace<strong>Dataset<span>Agent<strong>Session</strong></span></strong></span></strong></span></div></section>
    <section class="section retrieval-section" id="retrieval"><div class="section-heading"><div><p class="eyebrow">RETRIEVAL V2</p><h2>Multiple signals.<br><em>One bounded result.</em></h2></div><p>Authorized dataset filters reach every lane before rank fusion. Higher fused scores are better.</p></div><div class="lane-grid"><article><span>LEXICAL</span><h3>BM25</h3><p>Exact and lexical evidence from the SQL-owned corpus.</p></article><article><span>SEMANTIC</span><h3>Vector</h3><p>LanceDB projection with embedding provenance.</p></article><article><span>RELATIONAL</span><h3>Assertions</h3><p>Graph V2 assertion relations; Kuzu neighbour traversal is not advertised as a retrieval capability.</p></article><article class="fusion"><span>FUSION</span><h3>True RRF</h3><p>Rank fusion followed by a deterministic, bounded legal reranker.</p></article></div></section>
    <section class="section storage-section"><div><p class="eyebrow">PHYSICAL STORES</p><h2>SQLite decides.<br><em>Projections follow.</em></h2></div><div class="storage-grid"><article><strong>SQLite</strong><p>Catalog, authorization, mutation/pipeline ledger, ownership, assertions, and ordered outbox.</p></article><article><strong>LanceDB</strong><p>Idempotent vector projection with embedding identity.</p></article><article><strong>Kuzu</strong><p>Idempotent Graph V2 projection, not the assertion decision source.</p></article></div></section>
    <section class="section client-section"><div class="section-heading"><div><p class="eyebrow">CLIENT SURFACES</p><h2>Versioned access<br><em>around one lifecycle.</em></h2></div></div><div class="client-grid"><a href="${docs.api}" target="_blank" rel="noopener noreferrer"><span>HTTP</span><strong>V4 REST API</strong><small>Catalog, sessions, memory, mutations, operations</small></a><a href="${docs.readme}" target="_blank" rel="noopener noreferrer"><span>PYTHON</span><strong>Sync & async SDK</strong><small>MesaV4Client and version-matched operations</small></a><a href="${route('docs/mcp/')}"><span>PROTOCOL</span><strong>MCP</strong><small>Legacy direct stdio plus the V4 gateway/bridge path</small></a></div></section>
    ${footer()}</main>`;
}

function ecosystem() {
  return `${header('ecosystem')}<main id="main-content"><section class="page-hero compact grid-bg"><p class="eyebrow">MESA ECOSYSTEM</p><h1>From sources to memory.<br><em>From memory to applications.</em></h1><p>Five repositories split the work into preparation, memory, application, behavior testing, and independent evidence. Their boundaries are part of the design.</p></section><section class="section boundary-section"><div class="section-heading"><div><p class="eyebrow">THE TEN-SECOND MAP</p><h2>One delivery chain.<br><em>Two quality layers.</em></h2></div><p>MESA Data prepares reviewed legal releases. Core owns the memory lifecycle. MESA Law consumes Core over HTTP. QA and E2E Certification evaluate behavior and evidence without becoming runtime dependencies.</p></div><div class="ecosystem-flow" aria-label="MESA ecosystem delivery chain"><div><small>SOURCES</small><strong>Official legal data</strong></div><b aria-hidden="true">→</b><div><small>PREPARE</small><strong>MESA Data</strong></div><b aria-hidden="true">→</b><div><small>MEMORY</small><strong>MESA Core</strong></div><b aria-hidden="true">→</b><div><small>APPLICATION</small><strong>MESA Law</strong></div></div><div class="quality-rail"><span>VERIFY THE CHAIN</span><strong>MESA QA</strong><i>+</i><strong>E2E Certification</strong></div></section><section class="section ecosystem-section"><div class="section-heading"><div><p class="eyebrow">FIVE EXPLICIT ROLES</p><h2>Simple first.<br><em>Technical when needed.</em></h2></div><p>Open each technical role for detail, then follow the dedicated page or source repository.</p></div>${ecosystemCards()}</section><section class="section journey-section grid-bg"><div class="section-heading"><div><p class="eyebrow">END-TO-END EXAMPLE</p><h2>Legal evidence,<br><em>kept connected.</em></h2></div><p>A reviewed legal source can move through a frozen Data release, authorized Core admission, scoped retrieval, and a Law workflow without presenting local staging or a 202 response as successful publication.</p></div><ol class="journey-flow"><li><span>01</span><strong>Acquire</strong><small>Approved or manual official source</small></li><li><span>02</span><strong>Release</strong><small>Immutable evidence and canonical records</small></li><li><span>03</span><strong>Admit</strong><small>Authorized dataset-scoped mutation</small></li><li><span>04</span><strong>Retrieve</strong><small>Ranked context with provenance</small></li><li><span>05</span><strong>Use</strong><small>Law workflow over the HTTP contract</small></li></ol></section>${footer()}</main>`;
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
  return `${header()}<main id="main-content"><section class="page-hero compact status-accent"><p class="eyebrow">PROJECT STATUS</p><h1>Transparent by default.<br><em>No borrowed confidence.</em></h1><p>Status below reflects current repository documentation and the hardened independent certification audit available on ${project.statusAsOf}.</p></section>${statusStrip()}
    <section class="section status-timeline"><article><span>CORE</span><h2>${project.runtime} ${project.maturity.toLowerCase()}</h2><p>MESA package line v${project.version}. Production remains ${project.production} pending final MVP certification and required production-like gates.</p>${external(docs.architecture, 'Canonical architecture')}</article><article><span>PROFILE B</span><h2>Certification blocked</h2><p>The harness now fails closed, but authoritative runtime/scoring/metric producers and a current valid final run remain absent.</p>${external(docs.certificationAudit, 'Independent audit')}</article><article><span>HISTORICAL RUN</span><h2>Qualification evidence</h2><p>The exposed run is preserved for regression and audit. It is not a valid current Profile B v2 certification result.</p>${external(`${repos.certification}/blob/main/reports/legacy-audits/RUN-20260901T005200Z-p8b03/audit.md`, 'Invalidation record')}</article><article><span>MESA LAW</span><h2>Law-side pass / overall ${project.production}</h2><p>Local Law-side gates passed; full-stack and live Core integration gates were not run.</p>${external(docs.lawStatus, 'Verification report')}</article></section>${footer()}</main>`;
}

function notFound() {
  return `${header()}<main id="main-content" class="not-found grid-bg"><div><p class="eyebrow">404 · ROUTE NOT FOUND</p><h1>This memory<br><em>does not exist.</em></h1><p>The page may have moved during the MESA ecosystem rebuild.</p><div class="actions">${cta('Return home', route())}${cta('Open docs', route('docs/'), 'secondary')}${cta('GitHub', repos.core, 'text', true)}</div></div></main>`;
}

const renderers = { home, mesa, ecosystem, data: dataPage, qa: qaPage, certification, law: lawPage, docs: docsPage, mcp: mcpPage, status: statusPage };

function argument(name, fallback) {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
}

function relativeBase(routePath) {
  const depth = routePath.split('/').filter(Boolean).length;
  return depth ? '../'.repeat(depth) : './';
}

function documentShell({ title, description, canonical, content, assetBase, noIndex = false }) {
  const socialImage = `${siteUrl}og-image.png`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#070609">
  ${noIndex ? '<meta name="robots" content="noindex">' : ''}
  <link rel="canonical" href="${canonical}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${socialImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="MESA — Memory with evidence, not mystery.">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${socialImage}">
  <link rel="icon" href="${assetBase}favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${assetBase}styles.css">
</head>
<body>
${content}
  <script src="${assetBase}app.js"></script>
</body>
</html>
`;
}

const outputDirectory = path.resolve(argument('--output', path.join(repositoryRoot, 'dist')));
const rawSiteUrl = argument('--site-url', 'https://yasou13.github.io/mesa.github.io/');
const siteUrl = rawSiteUrl.endsWith('/') ? rawSiteUrl : `${rawSiteUrl}/`;
const basePath = new URL(siteUrl).pathname;

for (const [key, metadata] of Object.entries(siteData.pages)) {
  base = relativeBase(metadata.path);
  const content = renderers[key]();
  const destination = path.join(outputDirectory, metadata.path, 'index.html');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, documentShell({
    title: metadata.title,
    description: metadata.description,
    canonical: `${siteUrl}${metadata.path}`,
    content,
    assetBase: base
  }));
}

base = basePath;
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(path.join(outputDirectory, '404.html'), documentShell({
  title: 'Page Not Found — MESA',
  description: 'The requested MESA ecosystem page could not be found.',
  canonical: `${siteUrl}404.html`,
  content: notFound(),
  assetBase: basePath,
  noIndex: true
}));

console.log(`Rendered ${Object.keys(siteData.pages).length} static routes and 404.html for ${siteUrl}`);
