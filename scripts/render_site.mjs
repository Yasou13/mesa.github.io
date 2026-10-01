import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(scriptDirectory);
const siteData = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'site-data.json'), 'utf8'));
const project = siteData.project;
const repos = siteData.repositories;
let base = './';
const assetVersion = (filename) => crypto
  .createHash('sha256')
  .update(fs.readFileSync(path.join(repositoryRoot, 'dist', filename)))
  .digest('hex')
  .slice(0, 12);
const assetVersions = {
  css: assetVersion('styles.css'),
  js: assetVersion('app.js')
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
  retrievalFixture: `${repos.core}/blob/main/tests/test_v4_independent_retrieval_audit.py`,
  retrievalAudit: `${repos.core}/blob/main/docs/v4-final-independent-audit.md`,
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
const logo = () => `<a class="logo" href="${route()}" aria-label="MESA home">${mark}<span>MESA</span></a>`;

function header(active = '') {
  const nav = [
    ['how', 'How it works', 'how-it-works/'],
    ['ecosystem', 'Ecosystem', 'ecosystem/'],
    ['use-cases', 'Use cases', 'use-cases/'],
    ['docs', 'Docs', 'docs/'],
  ];
  return `<a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <div class="nav-shell">
        ${logo()}
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
      <div class="footer-brand">${logo()}<p>${project.fullName}.</p><p class="footer-note">v${project.version} · ${project.runtime} ${project.maturity.toLowerCase()} · <a href="${route('status/')}">View status →</a></p></div>
      <div class="footer-groups">
        <div><h3>Explore</h3><a href="${route('how-it-works/')}">How it works</a><a href="${route('use-cases/')}">Use cases</a><a href="${route('evaluation/')}">Evaluation & trust</a><a href="${route('status/')}">Project status</a></div>
        <div><h3>Ecosystem</h3><a href="${route('mesa/')}">MESA Core</a><a href="${route('data/')}">MESA Data</a><a href="${route('qa/')}">MESA QA</a><a href="${route('certification/')}">E2E Certification</a><a href="${route('law/')}">MESA Law</a></div>
        <div><h3>Documentation</h3>${external(docs.readme, 'Quickstart')}${external(docs.architecture, 'Architecture')}${external(docs.security, 'Security')}${external(docs.contributing, 'Contributing')}<a href="${route('docs/mcp/')}">MCP integration</a></div>
        <div><h3>Project</h3><a href="${route('about/')}">About</a><a href="${route('faq/')}">FAQ</a>${external(repos.issues, 'Open an issue')}${external(repos.profile, 'Maintainer profile')}</div>
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
    ['06', 'Retrieval', 'Vector + BM25 + assertion + graph-path RRF'],
    ['07', 'Clients', 'REST, sync/async SDK, MCP']
  ];
  return `<div class="architecture-flow">${items.map(([n, title, text]) => `<div class="flow-step"><span>${n}</span><strong>${title}</strong><small>${text}</small></div>`).join('<b aria-hidden="true">→</b>')}</div>`;
}

function publicFlow(compact = false) {
  const items = compact ? [
    ['01', 'Source', 'Exact source material and identity'],
    ['02', 'Remember', 'Core admits scoped memory and keeps evidence'],
    ['03', 'Retrieve', 'Authorized signals are rank-fused'],
    ['04', 'Verify & use', 'Provenance and scope travel with context']
  ] : [
    ['01', 'Source', 'Exact source material and identity'],
    ['02', 'Prepare', 'MESA Data preserves and reviews legal inputs'],
    ['03', 'Remember', 'Core admits scoped memory and keeps evidence'],
    ['04', 'Retrieve', 'Four authorized signals are rank-fused'],
    ['05', 'Verify', 'Provenance and scope travel with the result'],
    ['06', 'Use', 'Applications consume bounded context']
  ];
  return `<ol class="public-flow" aria-label="Simple MESA flow">${items.map(([n, title, text]) => `<li><span>${n}</span><strong>${title}</strong><small>${text}</small></li>`).join('')}</ol>`;
}

function actionExample() {
  return `<div class="action-example">
    <div class="action-query"><span>QUERY</span><strong>“Alice”</strong><small>Exact deterministic fixture query · not a live benchmark</small></div>
    <div class="fixture-trace" role="img" aria-label="Alice knows Aurora, supported by source chunk 1 in document 1">
      <div class="trace-node"><small>ENTITY</small><strong>Alice</strong></div><span class="trace-edge"><i></i><b>knows</b></span><div class="trace-node"><small>ENTITY</small><strong>Aurora</strong></div><span class="trace-evidence"><i></i><b>evidence</b></span><div class="trace-node evidence"><small>SOURCE</small><strong>source-chunk-1</strong><em>doc-1 / chunk-1</em></div>
    </div>
    <div class="action-output">
      <section><span>RETRIEVED KNOWLEDGE</span><dl><div><dt>subject</dt><dd>Alice</dd></div><div><dt>predicate</dt><dd>knows</dd></div><div><dt>object</dt><dd>Aurora</dd></div></dl></section>
      <section><span>EVIDENCE</span><dl><div><dt>source</dt><dd>source-chunk-1</dd></div><div><dt>document</dt><dd>doc-1</dd></div><div><dt>chunk</dt><dd>chunk-1</dd></div><div><dt>span</dt><dd>“Alice knows Aurora”</dd></div></dl></section>
      <section><span>RETRIEVAL SIGNALS</span><ul class="signal-list"><li>vector <b>rank 1</b></li><li>BM25 <b>rank 1</b></li><li>assertion <b>rank 1</b></li><li>graph path <b>rank 1</b></li></ul><p class="fixture-score">Expected RRF: 4 ÷ 61</p></section>
    </div>
    <div class="context-output"><span>APPLICATION CONTEXT</span><div><code>UNTRUSTED_MEMORY_EVIDENCE { subject: "Alice", relation: "knows", object: "Aurora", source: "source-chunk-1" }</code><small>Schema-aligned website rendering of the fixture fields; production context is token-bounded JSON evidence.</small></div></div>
  </div>`;
}

function evidencePath() {
  return `<div class="evidence-path" aria-hidden="true">
    <svg viewBox="0 0 760 620" role="presentation">
      <g class="graph-lines">
        <path d="M92 122 C180 80 214 170 286 150 S416 66 492 112 S620 214 690 166"/>
        <path d="M92 122 C132 228 232 224 286 150"/>
        <path d="M196 284 C254 218 316 248 356 318 S448 414 526 362"/>
        <path d="M286 150 C332 218 306 278 356 318"/>
        <path d="M492 112 C446 188 448 272 526 362"/>
        <path d="M196 284 C132 354 168 462 258 486 S418 454 526 362"/>
        <path d="M526 362 C610 330 662 382 680 468"/>
        <path d="M258 486 C370 564 554 560 680 468"/>
      </g>
      <path class="traversal-path" pathLength="1" d="M92 122 C180 80 214 170 286 150 C332 218 306 278 356 318 S448 414 526 362 C610 330 662 382 680 468"/>
      <path class="evidence-path-line" pathLength="1" d="M356 318 C428 284 478 298 526 362"/>
      <g class="graph-nodes">
        <circle cx="92" cy="122" r="7"/><circle cx="286" cy="150" r="8"/><circle cx="492" cy="112" r="6"/><circle cx="690" cy="166" r="5"/><circle cx="196" cy="284" r="6"/><circle cx="356" cy="318" r="9"/><circle class="evidence-node" cx="526" cy="362" r="10"/><circle cx="258" cy="486" r="6"/><circle cx="680" cy="468" r="7"/>
      </g>
      <g class="graph-labels"><text x="68" y="100">source</text><text x="267" y="126">memory</text><text x="331" y="350">retrieve</text><text class="copper-label" x="548" y="388">evidence</text></g>
    </svg>
    <div class="path-readout"><span>TRACE / 04</span><strong>source → memory → evidence</strong><small>scope: dataset-a</small></div>
  </div>`;
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
    <section class="hero">
      ${evidencePath()}
      <div class="hero-copy">
        <p class="eyebrow">EVIDENCE-AWARE MEMORY INFRASTRUCTURE</p>
        <h1>Memory with <em>evidence</em>,<br>not mystery.</h1>
        <p>MESA helps AI systems remember information without losing where it came from, how it relates, or which data boundary it belongs to. It is open-source infrastructure for assistants and agent workflows that need traceable context.</p>
        <div class="actions">${cta('See MESA in action', '#mesa-in-action')}${cta('How MESA works', route('how-it-works/'), 'secondary')}</div>
      </div>
      <a class="scroll-cue" href="#the-problem">Why it matters <span aria-hidden="true">↓</span></a>
    </section>
    <section class="section problem-section" id="the-problem">
      <div class="section-heading"><div><p class="eyebrow">THE PROBLEM</p><h2>Remembering is easy.<br><em>Remembering responsibly is not.</em></h2></div><p>Agent context can become detached from its source, mixed across data boundaries, or stale across sessions. MESA treats memory as a controlled lifecycle instead of an unstructured pile of retrieved text.</p></div>
      <div class="principle-grid">
        <article><span>01 · PROBLEM</span><h3>The answer survives. Its source does not.</h3><p><strong>MESA approach:</strong> source, revision, chunk, evidence, pipeline, and embedding identity remain connected to retrieval.</p><p class="why-line">Why it matters: applications can inspect what returned context is based on.</p></article>
        <article><span>02 · PROBLEM</span><h3>Relevant text loses its relationships.</h3><p><strong>MESA approach:</strong> assertions and graph paths complement lexical and semantic retrieval without replacing the SQL decision source.</p><p class="why-line">Why it matters: structured connections can remain visible instead of being flattened away.</p></article>
        <article><span>03 · PROBLEM</span><h3>Memory crosses the wrong boundary.</h3><p><strong>MESA approach:</strong> server-created sessions bind authorized tenant, workspace, dataset, and agent scope before ranking.</p><p class="why-line">Why it matters: scope is part of retrieval, not a filter added after the result.</p></article>
      </div>
    </section>
    <section class="section reliability-section" id="why-mesa">
      <div class="section-heading"><div><p class="eyebrow">WHY MESA</p><h2>Useful context needs<br><em>evidence, structure, and scope.</em></h2></div><p>MESA combines several retrieval signals, but its differentiator is the contract around them: provenance, authorization, lifecycle state, and observable outcomes remain part of the system.</p></div>
      <div class="reliability-list">
        <article><strong>Evidence</strong><p>Keep source, revision, chunk, pipeline, and embedding identity connected to memory and retrieval results.</p></article>
        <article><strong>Structure</strong><p>Preserve assertions and bounded graph paths alongside lexical and semantic signals instead of flattening everything into text.</p></article>
        <article><strong>Scope</strong><p>Apply authorized dataset boundaries before vector, BM25, assertion, and graph-path signals are fused.</p></article>
        <article><strong>Lifecycle</strong><p>Expose whether a write was accepted, projected, retried, rejected, rolled back, or still awaiting action.</p></article>
      </div>
      <div class="section-actions">${cta('Read the Core architecture', route('mesa/'))}${cta('Source document', docs.architecture, 'text', true)}</div>
    </section>
    <section class="section how-preview grid-bg" id="how-it-works"><div class="section-heading"><div><p class="eyebrow">HOW MESA WORKS</p><h2>Source to context<br><em>in one readable path.</em></h2></div><p>The public flow stays simple here. Admission, projections, recovery, and the full retrieval contract live on the dedicated explanation.</p></div>${publicFlow(true)}<div class="section-actions">${cta('Explore the full flow', route('how-it-works/'))}${cta('Technical architecture', route('mesa/'), 'secondary')}</div></section>
    <section class="section action-section archive-texture" id="mesa-in-action"><div class="section-heading"><div><p class="eyebrow copper">MESA IN ACTION · VERIFIED FIXTURE</p><h2>A result with<br><em>its basis still attached.</em></h2></div><p>This example comes from Core’s deterministic four-lane retrieval test. It proves the fixture contract; it is not a claim about live deployment performance.</p></div>${actionExample()}<div class="proof-links">${external(docs.retrievalFixture, 'Inspect the fixture')}${external(docs.retrievalAudit, 'Read the retrieval audit')}</div></section>
    <section class="section use-cases"><div class="section-heading"><div><p class="eyebrow">TARGET USE CASES</p><h2>For systems where<br><em>context needs an audit trail.</em></h2></div><p>These are evaluation scenarios, not claims of current customers or deployments.</p></div><div class="use-case-grid"><article><span>01</span><h3>Agent memory</h3><p>Long-running agents that need durable updates, explicit lifecycle state, and scoped retrieval.</p></article><article><span>02</span><h3>Knowledge-heavy assistants</h3><p>Assistants that benefit from lexical, semantic, assertion, and graph-path signals around one evidence record.</p></article><article><span>03</span><h3>Provenance-sensitive workflows</h3><p>Domains where returned context should remain connected to reviewed sources. MESA Law is the current vertical example.</p></article></div><div class="section-actions">${cta('Explore use cases', route('use-cases/'))}</div></section>
    <section class="section ecosystem-intro" id="ecosystem"><div class="section-heading"><div><p class="eyebrow">THE ECOSYSTEM</p><h2>From trusted sources<br><em>to usable application context.</em></h2></div><p>Data prepares reviewed inputs. Core manages memory. Applications consume scoped retrieval. QA and E2E Certification evaluate the chain from outside it.</p></div><div class="ecosystem-flow" aria-label="MESA ecosystem flow"><div><small>PREPARE</small><strong>MESA Data</strong></div><b aria-hidden="true">→</b><div><small>REMEMBER</small><strong>MESA Core</strong></div><b aria-hidden="true">→</b><div><small>APPLY</small><strong>MESA Law</strong></div></div><div class="quality-rail"><span>QUALITY LAYERS</span><strong>MESA QA</strong><i>+</i><strong>E2E Certification</strong></div><div class="section-actions">${cta('Explore all five roles', route('ecosystem/'))}${cta('Evaluation & trust', route('evaluation/'), 'secondary')}</div></section>
    <section class="section build-section"><div class="section-heading"><div><p class="eyebrow">BUILD WITH MESA</p><h2>Store. Wait. Retrieve.<br><em>Inspect the evidence.</em></h2></div><p>The version-specific Python client follows the same catalog, session, mutation, search, and provenance contract exposed over HTTP. MCP provides a separate protocol surface.</p></div><div class="build-grid"><ol><li><span>01</span><strong>Start a scoped session</strong></li><li><span>02</span><strong>Insert exact source text</strong></li><li><span>03</span><strong>Wait for COMMITTED</strong></li><li><span>04</span><strong>Search and inspect provenance</strong></li></ol><div class="terminal"><div class="terminal-bar"><span><i></i><i></i><i></i></span><strong>Python · MesaV4Client</strong><button class="copy-button" type="button" data-copy-target="sdk-code">Copy</button></div><pre id="sdk-code"><code>with MesaV4Client(url, api_key=credential) as client:
    session = client.start_session(
        tenant_id="tenant-a", workspace_id="workspace-a",
        dataset_ids=["dataset-a"], agent_id="agent-a")
    accepted = client.insert(
        session_id=session["session_id"], dataset_id="dataset-a",
        document_id="doc-a", revision_id="rev-1", chunk_id="chunk-1",
        title="Contract A", source_ref="contract://a",
        content="Exact source text")
    committed = client.wait_until_committed(accepted["mutation_id"])
    assert committed["state"] == "COMMITTED"
    results = client.search(
        session_id=session["session_id"], query="source text")
    print(results["results"][0]["retrieval_provenance"])</code></pre></div></div><div class="interface-row"><span>EXPOSED INTERFACES</span><strong>Python SDK</strong><strong>HTTP API</strong><strong>MCP</strong><i>Internal stores: SQLite · LanceDB · Kùzu</i></div></section>
    <section class="section journey-section grid-bg"><div class="section-heading"><div><p class="eyebrow copper">REFERENCE IMPLEMENTATION</p><h2>MESA Law makes<br><em>the boundary concrete.</em></h2></div><p>A provenance-sensitive legal workflow demonstrates the intended ecosystem shape. Its live Core integration remains unproven, so it is a reference implementation—not a customer case study.</p></div><ol class="journey-flow"><li><span>01</span><strong>Official source</strong><small>Configured legal source or reviewed manual file</small></li><li><span>02</span><strong>MESA Data</strong><small>Preserve, canonicalize, gate, release</small></li><li><span>03</span><strong>MESA Core</strong><small>Authorize, admit, validate, project</small></li><li><span>04</span><strong>Evidence-aware retrieval</strong><small>Four signals, provenance, bounded context</small></li><li><span>05</span><strong>MESA Law</strong><small>Legal matter and document workflow over HTTP</small></li></ol><div class="section-actions">${cta('Explore MESA Law', route('law/'))}</div></section>
    <section class="section home-trust"><div class="section-heading"><div><p class="eyebrow">EVALUATION & TRUST</p><h2>Behavior over time.<br><em>Evidence for the verdict.</em></h2></div><p>MESA QA tests whether candidate behavior remains correct. E2E Certification asks whether an exact frozen profile can prove its required contract.</p></div><div class="trust-pair"><a href="${route('qa/')}"><span>QA / SEQUENCE</span><strong>Remember → restart → retrieve</strong><small>Correctness, temporal change, persistence, endurance</small></a><a class="evidence-package" href="${route('certification/')}"><span>CERT / MANIFEST</span><strong>Profile B · BLOCKED</strong><small>Required producers remain unavailable for a current PASS</small></a></div><div class="section-actions">${cta('Open Evaluation & Trust', route('evaluation/'), 'secondary')}</div></section>
    <aside class="development-note" aria-label="Development status"><div><p class="eyebrow">DEVELOPMENT STATUS</p><strong>Core v${project.version} · ${project.maturity}</strong><p>Final MVP certification is ${project.certification.toLowerCase()}; production remains ${project.production}.</p></div>${cta('See current status', route('status/'), 'secondary')}</aside>
    ${footer()}</main>`;
}

function howItWorksPage() {
  return `${header('how')}<main id="main-content"><section class="page-hero compact grid-bg"><p class="eyebrow">HOW MESA WORKS</p><h1>Keep the memory.<br><em>Keep its basis.</em></h1><p>MESA turns authorized source material into structured, retrievable memory while keeping scope and provenance in the result contract.</p><div class="actions">${cta('See the fixture', '#verified-example')}${cta('Technical architecture', route('mesa/'), 'secondary')}</div></section>
    <section class="section"><div class="section-heading"><div><p class="eyebrow">LEVEL 1 · PUBLIC FLOW</p><h2>Six steps,<br><em>no storage jargon required.</em></h2></div><p>MESA Data is the verified legal-source preparation layer. Core owns the runtime memory lifecycle. Other applications can use the same versioned interfaces.</p></div>${publicFlow()}</section>
    <section class="section reliability-section grid-bg"><div class="section-heading"><div><p class="eyebrow">WHAT TRAVELS WITH MEMORY</p><h2>More than<br><em>a similarity score.</em></h2></div><p>Current V4 responses can include catalog identity, source evidence, assertion identity, pipeline identity, embedding provenance, and contributing retrieval origins.</p></div><div class="reliability-list"><article><strong>Source</strong><p>Document, revision, chunk, source reference, and bounded evidence span.</p></article><article><strong>Structure</strong><p>Entity and assertion identity, predicates, literal or entity objects, and bounded supporting graph paths.</p></article><article><strong>Scope</strong><p>Tenant and authorized dataset eligibility resolved before lane ranking and fusion.</p></article><article><strong>State</strong><p>Mutation, pipeline, projection, retry, rollback, and committed outcomes remain observable.</p></article></div></section>
    <section class="section action-section" id="verified-example"><div class="section-heading"><div><p class="eyebrow">VERIFIED REPOSITORY EXAMPLE</p><h2>Four origins.<br><em>One evidence identity.</em></h2></div><p>The fixture creates one canonical assertion, makes all four origins rank it first, and checks deterministic replay plus a fused score of 4/61.</p></div>${actionExample()}<div class="proof-links">${external(docs.retrievalFixture, 'Inspect the exact test')}${external(docs.api, 'Read the response contract')}</div></section>
    <section class="section architecture-section"><div class="section-heading"><div><p class="eyebrow">LEVEL 2 · TECHNICAL FLOW</p><h2>Admission, projection,<br><em>retrieval, and recovery.</em></h2></div><p>SQLite owns decisions and canonical assertions. LanceDB and Kùzu are derived projections. The current retrieval contract includes vector, BM25, assertion, and bounded graph-path origins.</p></div>${architectureFlow()}<div class="section-actions">${cta('Explore Core in detail', route('mesa/'))}${cta('Canonical source doc', docs.architecture, 'text', true)}</div></section>
    <section class="section quality-context"><div><p class="eyebrow">QUALITY LAYERS</p><h2>They surround the flow.<br><em>They do not run inside it.</em></h2></div><div><article><strong>MESA QA</strong><p>Exercises behavior, temporal change, cross-session persistence, restarts, and bounded candidate repair.</p></article><article><strong>E2E Certification</strong><p>Evaluates a frozen profile with evidence, authoritative producers, hard gates, and a fail-closed verdict.</p></article></div><a href="${route('evaluation/')}">Compare evaluation layers →</a></section>${footer()}</main>`;
}

function mesa() {
  return `${header('mesa')}<main id="main-content">
    <section class="page-hero grid-bg"><p class="eyebrow">MESA CORE · V${project.version}</p><h1>A durable memory engine<br>with <em>structured evidence.</em></h1><p>The ${project.runtime} ${project.maturity.toLowerCase()} introduces canonical provenance, selectable validation, dataset isolation, ordered projections, and versioned REST, SDK, and MCP operations.</p><div class="actions">${cta('Source repository', repos.core, 'primary', true)}${cta('Documentation', route('docs/'), 'secondary')}</div></section>
    ${statusStrip()}
    <section class="section"><div class="section-heading"><div><p class="eyebrow">MEMORY LIFECYCLE</p><h2>Admission to retrieval,<br><em>without hidden writes.</em></h2></div><p>A rejected mutation creates no active SQL, vector, entity, edge, or assertion artifact. Accepted work follows ordered, idempotent lanes.</p></div>${architectureFlow()}</section>
    <section class="section surface-section" id="security"><div class="surface-copy"><p class="eyebrow">SECURITY BOUNDARY</p><h2>Agents are context.<br><em>Tenants are boundaries.</em></h2><p>V4 authorization follows principal → tenant → workspace → dataset → agent → server-created session. Roles inherit down the catalog. Purge and rollback require explicit dataset permissions.</p>${cta('Read security policy', docs.security, 'text', true)}</div><div class="scope-visual" role="img" aria-label="Nested MESA authorization scopes"><span>Principal<strong>Tenant<span>Workspace<strong>Dataset<span>Agent<strong>Session</strong></span></strong></span></strong></span></div></section>
    <section class="section retrieval-section" id="retrieval"><div class="section-heading"><div><p class="eyebrow">RETRIEVAL V2</p><h2>Four signals.<br><em>One bounded result.</em></h2></div><p>Authorized dataset, temporal, jurisdiction, tenant, and agent eligibility are enforced before lane fusion. Higher fused scores are better.</p></div><div class="lane-grid five"><article><span>SEMANTIC</span><h3>Vector</h3><p>LanceDB assertion projection with embedding provenance.</p></article><article><span>LEXICAL</span><h3>BM25</h3><p>Exact and lexical evidence from the SQL-owned corpus.</p></article><article><span>RELATIONAL</span><h3>Assertions</h3><p>SQLite-authoritative assertion relations and citation-aware scoring.</p></article><article><span>BOUNDED GRAPH</span><h3>Graph paths</h3><p>Kùzu Graph V2 paths reconciled to authorized canonical assertion IDs.</p></article><article class="fusion"><span>FUSION</span><h3>True RRF</h3><p>Each lane votes once per candidate, then a bounded legal reranker may apply.</p></article></div><div class="notice"><strong>Source-of-truth note</strong><p>The current runtime, API reference, capability response, and independent retrieval tests support the graph origin. The shorter architecture overview still groups retrieval as SQL/vector/graph and should be read with the API contract.</p></div></section>
    <section class="section storage-section"><div><p class="eyebrow">PHYSICAL STORES</p><h2>SQLite decides.<br><em>Projections follow.</em></h2></div><div class="storage-grid"><article><strong>SQLite</strong><p>Catalog, authorization, mutation/pipeline ledger, ownership, assertions, and ordered outbox.</p></article><article><strong>LanceDB</strong><p>Idempotent vector projection with embedding identity.</p></article><article><strong>Kuzu</strong><p>Idempotent Graph V2 projection, not the assertion decision source.</p></article></div></section>
    <section class="section client-section"><div class="section-heading"><div><p class="eyebrow">CLIENT SURFACES</p><h2>Versioned access<br><em>around one lifecycle.</em></h2></div></div><div class="client-grid"><a href="${docs.api}" target="_blank" rel="noopener noreferrer"><span>HTTP</span><strong>V4 REST API</strong><small>Catalog, sessions, memory, mutations, operations</small></a><a href="${docs.readme}" target="_blank" rel="noopener noreferrer"><span>PYTHON</span><strong>Sync & async SDK</strong><small>MesaV4Client and version-matched operations</small></a><a href="${route('docs/mcp/')}"><span>PROTOCOL</span><strong>MCP</strong><small>Legacy direct stdio plus the V4 gateway/bridge path</small></a></div></section>
    ${footer()}</main>`;
}

function ecosystem() {
  return `${header('ecosystem')}<main id="main-content"><section class="page-hero compact"><p class="eyebrow">MESA ECOSYSTEM</p><h1>Clear boundaries.<br><em>Evidence across them.</em></h1><p>Five repositories split preparation, memory, application, behavior testing, and independent evidence. The generic platform model is separate from the current legal reference path.</p></section>
    <section class="section boundary-section grid-bg"><div class="section-heading"><div><p class="eyebrow">GENERIC PLATFORM MODEL</p><h2>Core sits between<br><em>sources and applications.</em></h2></div><p>Preparation may be performed by MESA Data or by another compatible source pipeline. MESA Law is one application, not a required runtime stage.</p></div><div class="platform-map" aria-label="Generic MESA platform model"><div class="map-runtime"><div><small>INPUT</small><strong>Sources</strong><span>Reviewed material</span></div><b aria-hidden="true">→</b><div><small>PREPARE</small><strong>Ingestion layer</strong><span>MESA Data or compatible producer</span></div><b aria-hidden="true">→</b><div class="core-node"><small>MEMORY</small><strong>MESA Core</strong><span>Admission · retrieval · evidence</span></div><b aria-hidden="true">→</b><div><small>OUTPUT</small><strong>Application</strong><span>Versioned API / SDK / MCP</span></div></div><div class="map-quality"><span>OUT-OF-RUNTIME EVALUATION</span><a href="${route('qa/')}">MESA QA</a><i>behavior over time</i><a href="${route('certification/')}">E2E Certification</a><i>profile evidence & verdict</i></div></div></section>
    <section class="section legal-reference archive-texture"><div class="section-heading"><div><p class="eyebrow copper">CURRENT LEGAL REFERENCE PATH</p><h2>A concrete path,<br><em>not a universal dependency.</em></h2></div><p>This is the current Profile B and MESA Law shape. It is intentionally labeled as the legal reference implementation.</p></div><div class="ecosystem-flow legal-flow" aria-label="Current legal reference implementation"><div><small>SOURCE</small><strong>Official legal sources</strong></div><b aria-hidden="true">→</b><div><small>PREPARE</small><strong>MESA Data</strong></div><b aria-hidden="true">→</b><div><small>MEMORY</small><strong>MESA Core</strong></div><b aria-hidden="true">→</b><div><small>REFERENCE APP</small><strong>MESA Law</strong></div></div></section>
    <section class="section ecosystem-section"><div class="section-heading"><div><p class="eyebrow">FIVE EXPLICIT ROLES</p><h2>Repository boundaries<br><em>with distinct ownership.</em></h2></div><p>Each component answers what it is, why it exists, and what it technically owns.</p></div>${ecosystemCards()}</section>
    <section class="section journey-section grid-bg"><div class="section-heading"><div><p class="eyebrow copper">END-TO-END EXAMPLE</p><h2>Legal evidence,<br><em>kept connected.</em></h2></div><p>A reviewed legal source can move through a frozen Data release, authorized Core admission, scoped retrieval, and a Law workflow without presenting local staging or a 202 response as successful publication.</p></div><ol class="journey-flow"><li><span>01</span><strong>Acquire</strong><small>Approved or manual official source</small></li><li><span>02</span><strong>Release</strong><small>Immutable evidence and canonical records</small></li><li><span>03</span><strong>Admit</strong><small>Authorized dataset-scoped mutation</small></li><li><span>04</span><strong>Retrieve</strong><small>Ranked context with provenance</small></li><li><span>05</span><strong>Use</strong><small>Law workflow over the HTTP contract</small></li></ol></section>${footer()}</main>`;
}

function dataPage() {
  return `${header('ecosystem')}<main id="main-content"><section class="page-hero compact data-accent"><p class="eyebrow">MESA DATA</p><h1>Legal data with an<br><em>auditable release path.</em></h1><p>MESA Data is specifically a Turkish legal-data platform. It is not presented as a universal ingestion service.</p><div class="actions">${cta('Repository', repos.data, 'primary', true)}${cta('Usage guide', docs.dataGuide, 'secondary', true)}</div></section>
    <section class="section"><div class="section-heading"><div><p class="eyebrow">CONFIGURED SOURCES</p><h2>Official sources,<br><em>policy-bound access.</em></h2></div><p>The current configuration enables Resmî Gazete discovery and manual collection from Mevzuat and the Constitutional Court. Yargıtay is configured but disabled.</p></div><div class="source-table" role="table" aria-label="MESA Data configured sources"><div role="row"><strong role="columnheader">Source</strong><strong role="columnheader">Mode</strong><strong role="columnheader">State</strong><strong role="columnheader">Role</strong></div><div role="row"><span>Resmî Gazete</span><span>Approved web</span><span class="ok">Enabled</span><span>Original publication</span></div><div role="row"><span>Mevzuat Bilgi Sistemi</span><span>Manual</span><span class="ok">Enabled</span><span>Consolidated text</span></div><div role="row"><span>Anayasa Mahkemesi</span><span>Manual</span><span class="ok">Enabled</span><span>Official case law</span></div><div role="row"><span>Yargıtay</span><span>Manual</span><span class="muted">Disabled</span><span>Official case law</span></div></div></section>
    <section class="section pipeline-section grid-bg"><p class="eyebrow">RELEASE PIPELINE</p><h2>Raw bytes remain traceable.</h2><div class="pipeline"><div><span>01</span><strong>Collect</strong><small>Allowlisted HTTPS or manual file</small></div><div><span>02</span><strong>Preserve</strong><small>Immutable raw artifact + SHA-256</small></div><div><span>03</span><strong>Canonicalize</strong><small>Versioned canonical JSONL</small></div><div><span>04</span><strong>Gate</strong><small>Quality, privacy, legal metadata</small></div><div><span>05</span><strong>Review</strong><small>Safe auto-approval or human exception</small></div><div><span>06</span><strong>Release</strong><small>Build, verify, freeze, human approval</small></div><div><span>07</span><strong>Publish</strong><small>Human-started, idempotent MESA delivery</small></div></div><div class="notice"><strong>Human boundary</strong><p>MESA delivery never starts automatically. Local staging is a development tool and is not the real MESA publisher.</p></div></section>${footer()}</main>`;
}

function qaPage() {
  return `${header('ecosystem')}<main id="main-content"><section class="page-hero compact qa-hero"><p class="eyebrow">MESA QA</p><h1>Test the candidate.<br><em>Protect the baseline.</em></h1><p>An external, detachable test-engineer system for long-running behavioral checks against MESA through its canonical MCP surface.</p><div class="actions">${cta('Repository', repos.qa, 'primary', true)}</div></section>
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
  return `${header('ecosystem')}<main id="main-content"><section class="page-hero compact law-hero"><p class="eyebrow copper">PRIMARY REFERENCE IMPLEMENTATION</p><h1>Evidence-aware memory<br><em>in a legal workflow.</em></h1><p>MESA Law demonstrates how matters, documents, review, and sourced question answering can meet MESA through a versioned HTTP contract. It is a reference implementation, not a customer deployment.</p><div class="actions">${cta('Explore repository', repos.law, 'primary', true)}${cta('Law-side status', docs.lawStatus, 'secondary', true)}</div></section>
    <section class="section reference-flow"><div class="section-heading"><div><p class="eyebrow">THE USER PROBLEM</p><h2>Legal context needs<br><em>its source and review state.</em></h2></div><p>A legal workflow cannot safely treat an answer as detached text. The repository models source-aware document workspaces, evidence and citation cards, review state, and sourced QA that can abstain.</p></div><ol class="journey-flow"><li><span>01</span><strong>Official legal source</strong><small>Reviewed or configured acquisition</small></li><li><span>02</span><strong>MESA Data</strong><small>Traceable legal release</small></li><li><span>03</span><strong>MESA Core</strong><small>Authorized memory and evidence</small></li><li><span>04</span><strong>Versioned HTTP</strong><small>Explicit integration boundary</small></li><li><span>05</span><strong>MESA Law</strong><small>Matter, document, review, sourced QA</small></li></ol></section>
    <section class="section"><div class="section-heading"><div><p class="eyebrow">VERIFIED REPOSITORY SCOPE</p><h2>Cases, documents,<br><em>review, and evidence.</em></h2></div><p>Current code includes a Next.js web app, FastAPI and Java API work, workers, PostgreSQL migrations, document parsing, matter-level access controls, deadlines, review state, drafting controls, and provenance-aware QA.</p></div><div class="law-grid"><article><h3>Matter workspace</h3><p>Tenant-scoped matters, parties, members, timelines, claims, evidence, and document revisions.</p></article><article><h3>Human review</h3><p>Review queues, immutable audit records, citation verification, and approval gates before external draft use.</p></article><article><h3>MESA binding</h3><p>Catalog onboarding and V4 mutation state are tracked over HTTP. A 202 admission is not presented as publication; only COMMITTED is success.</p></article><article><h3>MVP limits</h3><p>External legal research and AI draft generation are disabled in the documented MVP contract.</p></article></div></section>
    <section class="section law-status"><p class="eyebrow">CURRENT STATUS</p><h2>Law-side gates pass.<br><em>Overall integration: NO-GO.</em></h2><p>The latest repository report says isolated Law code, contract, database, frontend, and stub gates passed. The full running stack and live MESA Core integration were not executed, so overall MVP GO is not claimed.</p>${cta('Read verification report', docs.lawStatus, 'text', true)}</section>${footer()}</main>`;
}

function useCasesPage() {
  const cases = [
    ['Agent memory', 'Long-running agents need to update and retrieve context without turning every prior interaction into an unscoped text pile.', 'MESA provides a durable mutation lifecycle, dataset-scoped sessions, structured assertions, and observable outcomes.', 'A clearer basis for inspecting what was remembered, from which source, and under which scope.'],
    ['Knowledge-heavy assistants', 'A single similarity score can miss exact wording, explicit relationships, and multi-hop context.', 'MESA fuses vector, BM25, assertion, and bounded graph-path origins around canonical evidence.', 'Broader retrieval signals without discarding evidence identity or treating graph projection as canonical truth.'],
    ['Provenance-sensitive AI', 'Returned context may be useful but impossible to trace back to a document revision, chunk, or span.', 'Source and pipeline provenance remain part of the V4 assertion and retrieval contracts.', 'Applications can surface the basis and limitations of retrieved context.'],
    ['Long-lived structured memory', 'Facts change, sources are revised, and shared artifacts may have more than one owner.', 'V4 models immutable revisions, supersession, source-owned rollback, purge, replay, and reconciliation.', 'Memory can evolve through explicit lifecycle rules instead of silent replacement.']
  ];
  return `${header('use-cases')}<main id="main-content"><section class="page-hero compact grid-bg"><p class="eyebrow">USE CASES</p><h1>Memory for systems where<br><em>evidence and scope matter.</em></h1><p>These are realistic evaluation targets derived from the current architecture. They are not customer, compliance, or production-deployment claims.</p></section><section class="section case-list">${cases.map(([name, problem, role, benefit], index) => `<article><span>0${index + 1}</span><h2>${name}</h2><dl><div><dt>Problem</dt><dd>${problem}</dd></div><div><dt>MESA role</dt><dd>${role}</dd></div><div><dt>Expected benefit</dt><dd>${benefit}</dd></div></dl></article>`).join('')}</section><section class="section reference-callout grid-bg"><div><p class="eyebrow">CURRENT VERTICAL EXAMPLE</p><h2>MESA Law explores<br><em>the legal workflow shape.</em></h2><p>Its source-aware matter, document, review, and QA surfaces show why provenance matters. Live Core integration remains pending.</p></div>${cta('Explore the reference implementation', route('law/'))}</section>${footer()}</main>`;
}

function evaluationPage() {
  return `${header()}<main id="main-content"><section class="page-hero compact status-accent"><p class="eyebrow">EVALUATION & TRUST</p><h1>Two layers.<br><em>Two different questions.</em></h1><p>MESA separates ongoing behavioral testing from profile-specific certification evidence. Neither is presented as a substitute for production proof.</p></section>
    <section class="section evaluation-compare"><article><p class="eyebrow">MESA QA</p><h2>Does the candidate keep behaving correctly?</h2><ul class="check-list"><li>memory correctness and independent ground truth</li><li>temporal updates, correction, and forgetting</li><li>cross-session persistence and restart durability</li><li>sustained endurance profiles</li><li>isolated candidate repair with no automatic merge or push</li></ul><a href="${route('qa/')}">Explore MESA QA →</a></article><article><p class="eyebrow">E2E CERTIFICATION</p><h2>Can this exact profile prove its required guarantees?</h2><ul class="check-list"><li>frozen inputs, identity, and evidence bindings</li><li>authoritative runtime, scoring, and metric producers</li><li>hard gates and independent finalization</li><li>profile-bounded evidence and verdicts</li><li>fail-closed handling of missing or unverified gates</li></ul><a href="${route('certification/')}">Explore certification →</a></article></section>
    <section class="section trust-state grid-bg"><div><p class="eyebrow">CURRENT EVIDENCE STATE</p><h2>Harness integrity improved.<br><em>Certification remains blocked.</em></h2></div><div><p>The independent audit corrected reproduced integrity defects and verified fail-closed behavior. It did not execute a legitimate passing runtime certification transaction.</p><p>Authoritative runtime, ground-truth join, scoring, health, and mandatory metric producers remain unavailable for a current PASS.</p>${external(docs.certificationAudit, 'Read the independent audit')}</div></section>
    <section class="section future-benchmarks"><p class="eyebrow">BENCHMARK PUBLICATION</p><h2>No placeholder numbers.</h2><p>Historical or synthetic diagnostics are not promoted as current production guarantees. Publishable retrieval quality, latency, resource, and endurance results should follow valid certification and clearly identified methodology.</p></section>${footer()}</main>`;
}

function aboutPage() {
  return `${header()}<main id="main-content"><section class="page-hero compact grid-bg"><p class="eyebrow">ABOUT MESA</p><h1>An open-source exploration of<br><em>memory with evidence.</em></h1><p>MESA exists to explore durable AI memory that keeps provenance, structure, scope, and lifecycle state visible instead of reducing memory to an opaque similarity lookup.</p></section>
    <section class="section about-grid"><article><p class="eyebrow">WHAT IT IS</p><h2>A multi-repository system.</h2><p>Core owns the memory lifecycle. Data prepares Turkish legal sources. QA tests behavior. E2E Certification defines a fail-closed evidence path. Law is the primary reference implementation.</p></article><article><p class="eyebrow">WHY IT EXISTS</p><h2>Useful context needs a basis.</h2><p>The project examines how agents can retain information while preserving where it came from, how it is related, which scope can retrieve it, and how it changes over time.</p></article><article><p class="eyebrow">WHO MAINTAINS IT</p><h2>Publicly maintained on GitHub.</h2><p>The public maintainer identity exposed by the repositories is the <strong>${project.maintainer}</strong> GitHub account. This site does not infer a company, team, office, investor, or customer structure that the source does not establish.</p>${external(repos.profile, 'View maintainer profile')}</article><article><p class="eyebrow">HOW TO CONTACT</p><h2>Use the public project channel.</h2><p>Open an issue for reproducible bugs, architecture questions, documentation gaps, or evaluation discussion. No sales or enterprise support channel is claimed.</p>${external(repos.issues, 'Open a GitHub issue')}</article></section>
    <aside class="development-note"><div><p class="eyebrow">CURRENT STATUS</p><strong>Core v${project.version} · ${project.maturity}</strong><p>Certification is ${project.certification.toLowerCase()}; production remains ${project.production}.</p></div>${cta('Review status and limits', route('status/'), 'secondary')}</aside>${footer()}</main>`;
}

function faqPage() {
  const questions = [
    ['What is MESA?', 'MESA is open-source memory infrastructure for AI systems. Its V4 release candidate combines durable mutation state, structured assertions, scoped retrieval, and source provenance across versioned HTTP, Python SDK, and MCP surfaces.'],
    ['Is MESA a vector database?', 'No. LanceDB is one internal projection. SQLite is the canonical decision source, Kùzu is a Graph V2 projection, and retrieval can combine vector, BM25, assertion, and bounded graph-path origins.'],
    ['Is MESA a RAG framework?', 'Not primarily. It can supply grounded context to an application, but its public contract focuses on durable memory, catalog scope, lifecycle state, evidence, and retrieval rather than owning an entire generation stack.'],
    ['How is MESA different from plain vector search?', 'It keeps canonical source and assertion identity, applies authorization before ranking, combines several retrieval origins, and exposes mutation, projection, rollback, and provenance state.'],
    ['Why SQLite, LanceDB, and Kùzu?', 'SQLite owns catalog, authorization, ledgers, ownership, assertions, and outbox state. LanceDB stores the vector projection. Kùzu stores the Graph V2 projection and supports bounded graph-path retrieval reconciled to SQLite assertion IDs.'],
    ['What does evidence-aware memory mean?', 'Retrieved knowledge can remain connected to document, revision, chunk, evidence span, assertion, pipeline, and embedding identity instead of returning only detached text.'],
    ['What is provenance?', 'Provenance is the trace of where a memory came from and how it was processed: source reference, catalog identity, evidence span, pipeline and model versions, and contributing retrieval origins when available.'],
    ['What is MESA Data?', 'A Turkish legal-data preparation platform. It preserves raw artifacts, canonicalizes records, applies gates and review, freezes releases, and uses a human-started delivery path. It is not advertised as a universal web ingestion service.'],
    ['What is MESA Law?', 'The primary reference implementation: a legal matter and document workflow with source-aware review and a versioned MESA V4 HTTP contract. Its live Core/full-stack integration is still pending.'],
    ['How do MESA QA and E2E Certification differ?', 'QA asks whether candidate behavior stays correct across time, sessions, and restarts. E2E Certification asks whether one frozen system profile can produce the required authoritative evidence and pass all hard gates.'],
    ['Does MESA support MCP?', 'Yes. The repository documents a legacy direct stdio server for the V3-compatible path and a newer V4 gateway/bridge path with binding-scoped operations and approvals.'],
    ['Can MESA run locally?', 'Yes. The repository documents locked local installation and Docker profiles. The simple safe-core profile disables model and external-provider access; the V4 full-cognitive profile requires explicit configuration and one storage owner.'],
    ['Is MESA production-ready?', `No. Core is a ${project.maturity.toLowerCase()} and production remains ${project.production}. Required production-like migration, restore, crash, saturation, concurrency, benchmark, and soak gates are not all complete.`],
    ['What is the current certification status?', 'Blocked. The hardened Profile B path fails closed because authoritative runtime, scoring, ground-truth join, health, and mandatory metric producers are not yet all available for a legitimate PASS.'],
    ['Where should a developer start?', 'Read the quickstart, run the locked environment, choose the V3-compatible safe core or the explicit V4 topology deliberately, then inspect the API, SDK, MCP, architecture, and status documents before integration.']
  ];
  return `${header()}<main id="main-content"><section class="page-hero compact docs-accent"><p class="eyebrow">FREQUENTLY ASKED QUESTIONS</p><h1>Short answers.<br><em>Source-linked depth.</em></h1><p>These answers reflect current public repositories and the ${project.runtime} ${project.maturity.toLowerCase()} status as of ${project.statusAsOf}.</p></section><section class="section faq-list">${questions.map(([question, answer], index) => `<details${index === 0 ? ' open' : ''}><summary>${question}</summary><p>${answer}</p></details>`).join('')}</section><section class="section faq-next grid-bg"><div><p class="eyebrow">GO DEEPER</p><h2>Architecture, interfaces,<br><em>status, and source.</em></h2></div><div class="actions">${cta('Read the docs', route('docs/'))}${cta('Review project status', route('status/'), 'secondary')}${cta('Open GitHub', repos.core, 'text', true)}</div></section>${footer()}</main>`;
}

function docsPage() {
  const groups = [
    ['Start', [['Quickstart', docs.readme], ['Installation', docs.installation], ['Current status', route('status/'), false]]],
    ['Understand', [['V4 architecture', docs.architecture], ['Memory & retrieval contract', docs.api], ['How MESA works', route('how-it-works/'), false]]],
    ['Build', [['Python SDK', docs.readme], ['HTTP API', docs.api], ['MCP integration', route('docs/mcp/'), false]]],
    ['Operate', [['Configuration & installation', docs.installation], ['Rebuild & recovery runbook', docs.rebuild], ['Core lifecycle overview', route('mesa/'), false]]],
    ['Trust', [['Security policy', docs.security], ['Evaluation & trust', route('evaluation/'), false], ['Certification audit', docs.certificationAudit]]],
    ['Reference', [['API contracts', docs.api], ['Ecosystem boundaries', route('ecosystem/'), false], ['Release status', route('status/'), false]]],
    ['Contribute', [['Contributing guide', docs.contributing], ['Issue tracker', repos.issues], ['MESA QA repository', repos.qa]]]
  ];
  return `${header('docs')}<main id="main-content"><section class="page-hero compact docs-accent"><p class="eyebrow">DOCUMENTATION HUB</p><h1>Find the contract.<br><em>Then run the code.</em></h1><p>A functional gateway to current source documents, public explanations, integration surfaces, operations, and verification evidence.</p></section><section class="section docs-grid">${groups.map(([name, links], index) => `<section${index === 0 ? ' class="docs-start"' : ''}><p class="eyebrow">0${index + 1} / ${name}</p>${links.map(([label, href, ext = true]) => ext ? external(href, label) : `<a href="${href}">${label}<span aria-hidden="true"> →</span></a>`).join('')}</section>`).join('')}</section>
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
  return `${header()}<main id="main-content" class="not-found grid-bg"><div><p class="eyebrow">404 · ROUTE NOT FOUND</p><h1>This memory<br><em>does not exist.</em></h1><p>The page may have moved during the MESA ecosystem rebuild.</p><div class="actions">${cta('Return home', route())}${cta('How MESA works', route('how-it-works/'), 'secondary')}${cta('Open docs', route('docs/'), 'secondary')}${cta('GitHub', repos.core, 'text', true)}</div></div></main>`;
}

const renderers = {
  home,
  mesa,
  howItWorks: howItWorksPage,
  ecosystem,
  data: dataPage,
  qa: qaPage,
  certification,
  law: lawPage,
  useCases: useCasesPage,
  evaluation: evaluationPage,
  docs: docsPage,
  mcp: mcpPage,
  status: statusPage,
  about: aboutPage,
  faq: faqPage
};

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
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', name: project.name, url: siteUrl, description: siteData.pages.home.description },
      {
        '@type': 'SoftwareSourceCode',
        name: project.fullName,
        alternateName: project.name,
        description: siteData.pages.home.description,
        codeRepository: repos.core,
        license: `${repos.core}/blob/main/LICENSE`,
        version: project.version,
        url: siteUrl
      }
    ]
  }).replaceAll('<', '\\u003c');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="theme-color" content="#0b0c0f">
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
  <script type="application/ld+json">${structuredData}</script>
  <link rel="icon" href="${assetBase}favicon.svg" type="image/svg+xml">
  <script>document.documentElement.classList.add('js')</script>
  <link rel="stylesheet" href="${assetBase}styles.css?v=${assetVersions.css}">
</head>
<body>
${content}
  <script src="${assetBase}app.js?v=${assetVersions.js}"></script>
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

const sitemapEntries = Object.values(siteData.pages)
  .map(({ path: routePath }) => `  <url><loc>${siteUrl}${routePath}</loc></url>`)
  .join('\n');
fs.writeFileSync(
  path.join(outputDirectory, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`
);
fs.writeFileSync(
  path.join(outputDirectory, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}sitemap.xml\n`
);

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
