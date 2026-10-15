#!/usr/bin/env node
import { getAllDocRoutes } from './render_docs.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(scriptDirectory);
const siteData = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'site-data.json'), 'utf8'));
const hubData = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'content', 'hub.json'), 'utf8'));
const baseUrlIndex = process.argv.indexOf('--base-url');
const baseUrl = (baseUrlIndex === -1 ? 'http://127.0.0.1:8000/' : process.argv[baseUrlIndex + 1]).replace(/\/?$/, '/');
const screenshotsIndex = process.argv.indexOf('--screenshots');
const screenshotsDirectory = screenshotsIndex === -1 ? null : path.resolve(process.argv[screenshotsIndex + 1]);
const warmCache = process.argv.includes('--warm-cache');
if (screenshotsDirectory) fs.mkdirSync(screenshotsDirectory, { recursive: true });
const chrome = process.env.CHROME_BIN || 'google-chrome';
const port = 9300 + (process.pid % 500);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'mesa-browser-qa-'));
const requiredScenes = ['event-horizon'];
const requiredHomeSections = ['hero', 'problem', 'process', 'example', 'capabilities', 'ecosystem', 'explore'];

const routes = [
  ...Object.values(siteData.pages).map(({ path: routePath }) => routePath),
  ...hubData.sections.map(({ path: routePath }) => routePath),
  ...hubData.entries.filter(({ draft, indexable }) => !draft && indexable).map(({ path: routePath }) => routePath),
];
const docsManifest = JSON.parse(fs.readFileSync(path.join(repositoryRoot, 'content/docs/manifest.json'), 'utf8'));
routes.push(...getAllDocRoutes().map(item => item.path));
const localizedRoutes = routes.flatMap((routePath) => [routePath, `tr/${routePath}`]);
const widths = [320, 390, 768, 799, 800, 801, 1024, 1099, 1100, 1101, 1440, 1920];
const failures = [];
const observations = [];
const fallbackChecks = [];
let browserVersion;
let connection;

const browser = spawn(chrome, [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--hide-scrollbars',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  '--window-size=1440,1000',
  'about:blank',
], { stdio: ['ignore', 'ignore', 'ignore'] });

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

async function waitForDebugger() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      return await fetchJson(`http://127.0.0.1:${port}/json/version`);
    } catch {
      await wait(100);
    }
  }
  throw new Error('Chrome DevTools endpoint did not become ready');
}

class DevToolsConnection {
  constructor(url) {
    this.nextId = 1;
    this.pending = new Map();
    this.requests = [];
    this.socket = new WebSocket(url);
    this.ready = new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data);
      if (message.method === 'Network.requestWillBeSent') this.requests.push(message.params);
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
    });
  }

  async send(method, params = {}) {
    await this.ready;
    const id = this.nextId;
    this.nextId += 1;
    const result = new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
    this.socket.send(JSON.stringify({ id, method, params }));
    return result;
  }

  close() {
    this.socket.close();
  }
}

async function waitForPage(url, previousOrigin) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const { result } = await connection.send('Runtime.evaluate', {
      expression: `({ href: location.href, ready: document.readyState, origin: performance.timeOrigin })`,
      returnByValue: true,
    });
    if (result.value?.href === url && result.value?.ready === 'complete' && result.value.origin !== previousOrigin) return;
    await wait(50);
  }
  throw new Error(`Page did not finish loading: ${url}`);
}

async function navigate(url) {
  const previous = await connection.send('Runtime.evaluate', { expression: 'performance.timeOrigin', returnByValue: true });
  const navigation = await connection.send('Page.navigate', { url });
  connection.loaderId = navigation.loaderId;
  await waitForPage(url, previous.result.value);
}

async function inspect(routePath, width) {
  const url = new URL(routePath, baseUrl).toString();
  await connection.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: width <= 520 ? 844 : 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await navigate(url);
  const { result } = await connection.send('Runtime.evaluate', {
    expression: `(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].filter(image => image.complete).map(image => image.decode().catch(() => {})));
      const root = document.documentElement;
      const hero = document.querySelector('.hero');
      const fixture = document.querySelector('#mesa-in-action');
      const heroImage = hero?.querySelector('picture img');
      return {
        title: document.title,
        docsBreadcrumbTop: document.querySelector('.docs-breadcrumbs')?.getBoundingClientRect().top ?? null,
        docsToggleBottom: document.querySelector('.docs-navigation summary')?.getBoundingClientRect().bottom ?? null,
        language: root.lang,
        mainCount: document.querySelectorAll('main').length,
        h1Count: document.querySelectorAll('h1').length,
        overflow: root.scrollWidth - root.clientWidth,
        overflowElements: [...document.querySelectorAll('body *')].filter(el => el.getBoundingClientRect().right > root.clientWidth + 1 && getComputedStyle(el).position !== 'fixed').slice(0, 8).map(el => ({ tag: el.tagName, class: el.className, right: Math.round(el.getBoundingClientRect().right) })),
        height: root.scrollHeight,
        fixtureTop: fixture ? Math.round(fixture.getBoundingClientRect().top + scrollY) : null,
        heroHeight: hero ? Math.round(hero.getBoundingClientRect().height) : null,
        heroImage: heroImage ? { src: heroImage.currentSrc, naturalWidth: heroImage.naturalWidth, naturalHeight: heroImage.naturalHeight, loading: heroImage.loading, priority: heroImage.fetchPriority } : null,
        heroRequests: performance.getEntriesByType('resource').filter(entry => /hero(?:-portrait)?\\.webp/.test(entry.name)).map(entry => entry.name),
        heroTransfers: performance.getEntriesByType('resource').filter(entry => /hero(?:-portrait)?\\.webp/.test(entry.name)).map(entry => ({ url: entry.name, transfer: entry.transferSize, encoded: entry.encodedBodySize })),
        layoutShift: window.__mesaAuditCLS || 0,
        lcpMs: window.__mesaAuditLCP || null,
        resources: performance.getEntriesByType('resource').map(entry => ({url: entry.name, encoded: entry.encodedBodySize, transfer: entry.transferSize})),
        brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc),
        scenes: [...document.querySelectorAll('[data-scene]')].map((node) => node.dataset.scene),
        homeSections: [...document.querySelectorAll('[data-home-section]')].map((node) => node.dataset.homeSection),
        mediaLayers: [...document.querySelectorAll('[data-scene-media]')].map((node) => ({ id: node.dataset.sceneMedia, hidden: node.getAttribute('aria-hidden') })),
      };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  const state = result.value;
  state.heroNetwork = connection.requests.filter(entry => entry.loaderId === connection.loaderId && /hero(?:-portrait)?\.webp/.test(entry.request.url)).map(entry => ({ url: entry.request.url, initiator: entry.initiator }));
  observations.push({ route: routePath, width, ...state });
  const label = `/${routePath} @ ${width}px`;
  if (!state.title) failures.push(`${label}: missing title`);
  if (state.mainCount !== 1) failures.push(`${label}: main count ${state.mainCount}`);
  if (state.h1Count !== 1) failures.push(`${label}: h1 count ${state.h1Count}`);
  if (state.overflow > 1) failures.push(`${label}: horizontal overflow ${state.overflow}px`);
  if (width <= 1024 && state.docsBreadcrumbTop !== null && state.docsBreadcrumbTop < state.docsToggleBottom) failures.push(`${label}: documentation breadcrumbs overlap navigation`);
  if (state.brokenImages.length) failures.push(`${label}: broken images ${state.brokenImages.join(', ')}`);
  if (routePath === '' || routePath === 'tr/') {
    if (JSON.stringify(state.homeSections) !== JSON.stringify(requiredHomeSections)) failures.push(`${label}: homepage section order ${state.homeSections.join(', ')}`);
    if (JSON.stringify(state.scenes) !== JSON.stringify(requiredScenes)) failures.push(`${label}: scene order ${state.scenes.join(', ')}`);
    if (state.mediaLayers.some(({ hidden }) => hidden !== 'true')) failures.push(`${label}: interactive media layer`);
    const heroSuffix = width <= 800 ? '/media/mobile/hero-portrait.webp' : '/media/desktop/hero.webp';
    if (!state.heroImage?.src.endsWith(heroSuffix) || state.heroImage.loading !== 'eager' || state.heroImage.priority !== 'high') {
      failures.push(`${label}: incorrect responsive hero source or loading priority`);
    }
    const selectedRequest = state.heroRequests.some(url => url.endsWith(heroSuffix));
    const extraTransfer = state.heroTransfers.some(entry => !entry.url.endsWith(heroSuffix) && entry.transfer > 0);
    if (!selectedRequest || extraTransfer || (!warmCache && state.heroRequests.length !== 1)) {
      failures.push(`${label}: duplicate or incorrect hero requests`);
      console.error(JSON.stringify({ label, requests: state.heroNetwork }));
    }
    if (state.layoutShift > .1) failures.push(`${label}: load-time layout shift ${state.layoutShift}`);
    if (width === 390) {
      if (state.fixtureTop === null || state.fixtureTop > 1800) failures.push(`${label}: fixture starts too late (${state.fixtureTop}px)`);
      const heightBudget = routePath === 'tr/' ? 10000 : 9000;
      if (state.height > heightBudget) failures.push(`${label}: homepage exceeds ${heightBudget}px (${state.height}px)`);
    }
  }
  const samplePages = ['architecture/', 'retrieval/', 'docs/core/getting-started/', 'mesa/', 'law/', 'docs/', 'docs/core/api-reference/', 'learn/what-is-ai-memory/'];
  const unlocalized = routePath.replace(/^tr\//, '');
  if (screenshotsDirectory && (unlocalized === '' || (samplePages.includes(unlocalized) && [390, 1440].includes(width)))) {
    const stem = `${routePath.replaceAll('/', '-') || 'home-'}${width}`;
    const screenshot = await connection.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(screenshotsDirectory, `${stem}.png`), Buffer.from(screenshot.data, 'base64'));
    if (unlocalized === '' && [390, 1440].includes(width)) {
      const full = await connection.send('Page.captureScreenshot', {
        format: 'png', captureBeyondViewport: true,
        clip: { x: 0, y: 0, width, height: state.height, scale: 1 },
      });
      fs.writeFileSync(path.join(screenshotsDirectory, `${stem}-full.png`), Buffer.from(full.data, 'base64'));
    }
  }
}

async function checkMobileMenu(routePath = '') {
  const url = new URL(routePath, baseUrl).toString();
  await connection.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
  await navigate(url);
  const { result } = await connection.send('Runtime.evaluate', {
    expression: `(() => {
      const toggle = document.querySelector('.menu-toggle');
      const nav = document.querySelector('#main-navigation');
      toggle.click();
      const opened = toggle.getAttribute('aria-expanded') === 'true' && nav.classList.contains('open');
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      const closed = toggle.getAttribute('aria-expanded') === 'false' && !nav.classList.contains('open');
      return { opened, closed, label: toggle.getAttribute('aria-label') };
    })()`,
    returnByValue: true,
  });
  if (!result.value?.opened || !result.value?.closed) failures.push(`/${routePath}: mobile menu did not open and close with Escape`);
}

async function checkMemoryDisclosure(routePath) {
  const url = new URL(routePath, baseUrl).toString();
  await navigate(url);
  const { result } = await connection.send('Runtime.evaluate', {
    expression: `(() => {
      const details = document.querySelector('.memory-example__details');
      const summary = details.querySelector('summary');
      summary.click();
      const opened = details.open && details.querySelector('.memory-example__expanded').getBoundingClientRect().height > 0;
      const score = details.querySelector('.fixture-score').textContent.includes('4 ÷ 61');
      const ranks = [...details.querySelectorAll('.signal-list li')].length === 4;
      const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      summary.click();
      return { opened, closed: !details.open, score, ranks, overflow };
    })()`, returnByValue: true,
  });
  if (!result.value?.opened || !result.value?.closed || !result.value?.score || !result.value?.ranks || result.value.overflow > 1) {
    failures.push(`/${routePath}: compact fixture disclosure lost evidence or overflowed`);
  }
}

async function checkHeroFallbacks(routePath) {
  const url = new URL(routePath, baseUrl).toString();
  await connection.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
  await connection.send('Network.setBlockedURLs', { urls: ['*media/desktop/hero.webp', '*media/mobile/hero-portrait.webp'] });
  await navigate(url);
  const failed = await connection.send('Runtime.evaluate', {
    expression: `(() => {
      const hero = document.querySelector('.hero');
      const copy = hero.querySelector('.hero-copy');
      const image = hero.querySelector('picture img');
      return {
        imageFailed: image.complete && image.naturalWidth === 0,
        copyVisible: copy.getBoundingClientRect().width > 0 && getComputedStyle(copy).visibility === 'visible',
        actions: [...copy.querySelectorAll('.button')].every(link => link.getBoundingClientRect().height >= 44 && link.href),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    })()`, returnByValue: true,
  });
  if (!failed.result.value?.imageFailed || !failed.result.value?.copyVisible || !failed.result.value?.actions || failed.result.value.overflow > 1) {
    failures.push(`/${routePath}: failed hero image blocked content or actions`);
  }
  if (screenshotsDirectory) {
    const shot = await connection.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(screenshotsDirectory, `${routePath ? 'tr' : 'home'}-390-image-failure.png`), Buffer.from(shot.data, 'base64'));
  }
  await connection.send('Network.setBlockedURLs', { urls: [] });
  await connection.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await navigate(url);
  const reduced = await connection.send('Runtime.evaluate', {
    expression: `({
      reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
      scroll: getComputedStyle(document.documentElement).scrollBehavior,
      moving: document.getAnimations().filter(animation => animation.playState === 'running' && animation.effect.getTiming().duration > 1).length,
      heroDecoded: document.querySelector('.hero picture img').naturalWidth > 0,
    })`, returnByValue: true,
  });
  if (!reduced.result.value?.reduced || reduced.result.value.scroll !== 'auto' || reduced.result.value.moving || !reduced.result.value.heroDecoded) {
    failures.push(`/${routePath}: reduced-motion hero did not remain static and readable`);
  }
  fallbackChecks.push({ route: routePath, failedImage: failed.result.value, reducedMotion: reduced.result.value });
  await connection.send('Emulation.setEmulatedMedia', { features: [] });
}

async function evaluate(expression) {
  const result = await connection.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

async function checkContentInteractions() {
  for (const localized of ['', 'tr/']) {
    await connection.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
    await navigate(new URL(`${localized}docs/core/api-reference/`, baseUrl).href);
    const result = await evaluate(`(async () => {
      const trigger = document.querySelector('.search-trigger');
      if (getComputedStyle(document.querySelector('#main-navigation')).display === 'none') document.querySelector('.menu-toggle').click();
      trigger.focus(); trigger.click();
      const input = document.querySelector('.search-input');
      input.value = 'retrieval'; input.dispatchEvent(new Event('input', { bubbles: true }));
      for(let i=0; i<60 && !document.querySelector('.search-result-item a'); i++) await new Promise(resolve => setTimeout(resolve, 50));
      const links = [...document.querySelectorAll('.search-result-item a')].map(a => a.href);
      let turkishCase = true;
      if (document.documentElement.lang === 'tr') {
        input.value = 'içe'; input.dispatchEvent(new Event('input', {bubbles:true}));
        turkishCase = [...document.querySelectorAll('.search-result-item a')].some(link => link.href.includes('docs/data/import-contract/'));
      }
      const dialog = document.querySelector('[role="dialog"]');
      const controls = [...dialog.querySelectorAll('input,button,a[href]')];
      controls[controls.length-1].focus();
      controls[controls.length-1].dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));
      const trapped = document.activeElement === input;
      const focusOutline = getComputedStyle(input).outlineStyle;
      document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
      const restored = document.activeElement === trigger;
      const closed = !dialog.classList.contains('open');
      const docsToggle = document.querySelector('.docs-navigation summary');
      docsToggle.click();
      return {links, turkishCase, trapped, restored, closed, focusOutline, docsExpanded: docsToggle.parentElement.open};
    })()`);
    if (!result.links.length || result.links.some(link => !link.startsWith(new URL(localized, baseUrl).href))) failures.push(`${localized}: search path or language mismatch`);
    if (!result.turkishCase || !result.trapped || !result.restored || !result.closed || result.focusOutline === 'none' || !result.docsExpanded) failures.push(`${localized}: keyboard focus or documentation disclosure failed`);
    fallbackChecks.push({ type: 'search-and-docs', language: localized || 'en', ...result });
    await navigate(new URL(`${localized}admin/`, baseUrl).href);
    const admin = await evaluate(`({forms: document.forms.length, controls: document.querySelectorAll('input,textarea,button').length, noindex: document.querySelector('meta[name="robots"]').content, scripts: document.scripts.length})`);
    if (admin.forms || admin.controls || admin.scripts || !admin.noindex.includes('noindex')) failures.push(`${localized}: admin did not fail closed`);
    fallbackChecks.push({ type: 'admin-unavailable', language: localized || 'en', ...admin });
  }
  await connection.send('Emulation.setScriptExecutionDisabled', { value: true });
  for (const localized of ['', 'tr/']) {
    for (const route of ['', 'learn/what-is-ai-memory/', 'docs/core/api-reference/']) {
      await navigate(new URL(localized + route, baseUrl).href);
      const state = await evaluate(`({body: document.querySelector('main').innerText.length, h1: document.querySelectorAll('h1').length, overflow: document.documentElement.scrollWidth-document.documentElement.clientWidth, navigation: getComputedStyle(document.querySelector('#main-navigation')).display, titleY: document.querySelector('h1').getBoundingClientRect().top, headerBottom: document.querySelector('.site-header').getBoundingClientRect().bottom})`);
      if (state.body < 150 || state.h1 !== 1 || state.overflow > 1 || state.navigation === 'none' || state.titleY < state.headerBottom) failures.push(`${localized}${route}: no-JavaScript reading/navigation failed`);
      fallbackChecks.push({ type: 'no-javascript', route: localized + route, ...state });
    }
  }
  await connection.send('Emulation.setScriptExecutionDisabled', { value: false });
}


async function checkReleaseInteractions() {
  for (const localized of ['', 'tr/']) {
    for(const routePath of ['', 'retrieval/']) {
      await connection.send('Emulation.setDeviceMetricsOverride', {width:390,height:844,deviceScaleFactor:1,mobile:false});
      await navigate(new URL(localized+routePath,baseUrl).href);
      const initial = await evaluate(`({value:document.querySelector('[data-rank-calculator] output').value, disabled:document.querySelector('[data-rank-calculator] fieldset').disabled})`);
      await evaluate(`document.querySelector('[data-rank-calculator] input').focus()`);
      await connection.send('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});
      await connection.send('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});
      const changed = await evaluate(`({value:document.querySelector('[data-rank-calculator] output').value, outline:getComputedStyle(document.activeElement.closest('label')).outlineStyle})`);
      const empty = await evaluate(`(() => {for(const checkbox of document.querySelectorAll('[data-rank-calculator] input:checked')) checkbox.click();return document.querySelector('[data-rank-calculator] output').value;})()`);
      if(initial.disabled || initial.value!=='4 / 61 = 0.065574' || changed.value!=='3 / 61 = 0.049180' || changed.outline==='none' || empty!=='0 / 61 = 0.000000') failures.push(`${localized}${routePath}: RRF keyboard arithmetic failed`);
      fallbackChecks.push({type:'rank-calculator',route:localized+routePath,initial,changed,empty});
    }
    await navigate(new URL(localized+'docs/core/api-reference/',baseUrl).href);
    const appendix = await evaluate(`(async () => {const details=document.querySelector('.source-appendix');const target=details.querySelector('[id]');const before=details.open;location.hash=target.id;await new Promise(r=>setTimeout(r,100));return {before,after:details.open,anchor:target.id,exists:!!target};})()`);
    if(appendix.before || !appendix.after || !appendix.exists) failures.push(`${localized}: source appendix deep link failed`);
    fallbackChecks.push({type:'source-appendix',language:localized||'en',...appendix});
  }
  for(const routePath of ['architecture/','retrieval/','docs/core/getting-started/','docs/core/embedding-providers/','docs/core/evidence/','docs/core/graph/','docs/core/examples/']) {
    for(const width of [320,390,768,1024,1440,1920]) {
      await inspect(routePath,width);await inspect('tr/'+routePath,width);
    }
  }
  await connection.send('Emulation.setScriptExecutionDisabled',{value:true});
  for(const routePath of ['retrieval/','tr/retrieval/']) {
    await navigate(new URL(routePath,baseUrl).href);
    const state=await evaluate(`({disabled:document.querySelector('[data-rank-calculator] fieldset').disabled,value:document.querySelector('[data-rank-calculator] output').value})`);
    if(!state.disabled || state.value!=='4 / 61 = 0.065574') failures.push(`${routePath}: calculator static fallback failed`);
    fallbackChecks.push({type:'rank-static-fallback',route:routePath,...state});
  }
  await connection.send('Emulation.setScriptExecutionDisabled',{value:false});
}
async function checkAxe() {
  const index=process.argv.indexOf('--axe-source');
  if(index===-1)return;
  const source=fs.readFileSync(path.resolve(process.argv[index+1]),'utf8');
  for(const routePath of localizedRoutes) {
    await connection.send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
    await navigate(new URL(routePath,baseUrl).href);
    await evaluate(source);
    const state=await evaluate(`(async()=>{const result=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']}});return {version:axe.version,violations:result.violations.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:result.incomplete.map(v=>({id:v.id,help:v.help,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),passes:result.passes.length};})()`);
    if(state.violations.length)failures.push(`${routePath}: axe ${state.violations.map(v=>v.id).join(',')}`);
    fallbackChecks.push({type:'axe',route:routePath,...state});
  }
}

try {
  await waitForDebugger();
  const target = await fetchJson(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(baseUrl)}`, { method: 'PUT' });
  connection = new DevToolsConnection(target.webSocketDebuggerUrl);
  await connection.send('Page.enable');
  await connection.send('Runtime.enable');
  await connection.send('Network.enable');
  await connection.send('Network.setCacheDisabled', { cacheDisabled: !warmCache });
  browserVersion = await connection.send('Browser.getVersion');
  await connection.send('Page.addScriptToEvaluateOnNewDocument', { source: `
    window.__mesaAuditCLS = 0;
    window.__mesaAuditLCP = 0;
    new PerformanceObserver(list => { for(const entry of list.getEntries()) window.__mesaAuditLCP=entry.startTime; }).observe({type: 'largest-contentful-paint', buffered: true});
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__mesaAuditCLS += entry.value;
    }).observe({ type: 'layout-shift', buffered: true });
  ` });

  if (!process.argv.includes('--interactions-only') && !process.argv.includes('--release-checks-only') && !process.argv.includes('--axe-only') && !process.argv.includes('--snapshot-only')) {
  for (const routePath of ['', 'tr/']) {
    for (const width of widths) await inspect(routePath, width);
  }
  for (const routePath of localizedRoutes) {
    await inspect(routePath, routePath === '' || routePath === 'tr/' ? 390 : 1440);
  }
  for (const routePath of ['mesa/', 'law/', 'docs/', 'docs/core/api-reference/', 'learn/what-is-ai-memory/']) {
    for (const width of [320, 390, 768, 1024, 1440, 1920]) {
      await inspect(routePath, width);
      await inspect(`tr/${routePath}`, width);
    }
  }
  for (const routePath of ['', 'tr/']) {
    await checkMobileMenu(routePath);
    await checkMemoryDisclosure(routePath);
    await checkHeroFallbacks(routePath);
  }

  }
  if(process.argv.includes('--snapshot-only')) { for(const routePath of ['', 'tr/', 'docs/', 'tr/docs/']) for(const width of [390,1440]) await inspect(routePath,width); }
  else if(process.argv.includes('--axe-only')) await checkAxe();
  else if(process.argv.includes('--release-checks-only')) { await checkReleaseInteractions(); await checkAxe(); }
  else await checkContentInteractions();

  if (failures.length) {
    console.error(`BROWSER QA FAIL (${failures.length})`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    if (process.argv.includes('--snapshot-only')) console.log(`SNAPSHOT QA PASS: home and documentation gateway in EN/TR at 390/1440px`);
    else if (process.argv.includes('--axe-only')) console.log(`AXE QA PASS: ${localizedRoutes.length} EN/TR public routes at ${baseUrl}`);
    else if (process.argv.includes('--release-checks-only')) console.log(`RELEASE BROWSER QA PASS: EN/TR arithmetic, native keyboard, source deep links, new-page responsive layouts and optional axe at ${baseUrl}`);
    else if (process.argv.includes('--interactions-only')) console.log(`BROWSER INTERACTION QA PASS: EN/TR search paths, keyboard focus, admin isolation and no-JavaScript navigation at ${baseUrl}`);
    else console.log(`BROWSER QA PASS: ${localizedRoutes.length} localized routes, ${widths.length} homepage widths in EN/TR, navigation, fixture, hero crops (${warmCache ? 'warm' : 'cold'} cache), reduced motion and image failure; no document overflow or unexpected broken images`);
  }
  if (screenshotsDirectory) {
    fs.writeFileSync(path.join(screenshotsDirectory, 'observations.json'), `${JSON.stringify({ baseUrl, cacheMode: warmCache ? 'warm' : 'cold', browserVersion, observations, fallbackChecks, failures }, null, 2)}\n`);
    console.log(`Screenshots and layout observations: ${screenshotsDirectory}`);
  }
} finally {
  connection?.close();
  browser.kill('SIGTERM');
  if (browser.exitCode === null) {
    await Promise.race([once(browser, 'exit'), wait(2000)]);
  }
  if (browser.exitCode === null) {
    browser.kill('SIGKILL');
    await once(browser, 'exit');
  }
  fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
}
