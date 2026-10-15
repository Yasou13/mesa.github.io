#!/usr/bin/env node
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
if (screenshotsDirectory) fs.mkdirSync(screenshotsDirectory, { recursive: true });
const chrome = process.env.CHROME_BIN || 'google-chrome';
const port = 9300 + (process.pid % 500);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'mesa-browser-qa-'));
const requiredScenes = ['event-horizon'];
const requiredHomeSections = ['hero', 'problem', 'example', 'process', 'ecosystem', 'explore'];

const routes = [
  ...Object.values(siteData.pages).map(({ path: routePath }) => routePath),
  ...hubData.sections.map(({ path: routePath }) => routePath),
  ...hubData.entries.filter(({ draft, indexable }) => !draft && indexable).map(({ path: routePath }) => routePath),
];
const localizedRoutes = routes.flatMap((routePath) => [routePath, `tr/${routePath}`]);
const widths = [320, 390, 768, 1024, 1440, 1920];
const failures = [];
const observations = [];
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
    this.socket = new WebSocket(url);
    this.ready = new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data);
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

async function waitForPage(url) {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const { result } = await connection.send('Runtime.evaluate', {
      expression: `({ href: location.href, ready: document.readyState })`,
      returnByValue: true,
    });
    if (result.value?.href === url && result.value?.ready === 'complete') return;
    await wait(50);
  }
  throw new Error(`Page did not finish loading: ${url}`);
}

async function inspect(routePath, width) {
  const url = new URL(routePath, baseUrl).toString();
  await connection.send('Emulation.setDeviceMetricsOverride', {
    width,
    height: width <= 520 ? 844 : 1000,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await connection.send('Page.navigate', { url });
  await waitForPage(url);
  const { result } = await connection.send('Runtime.evaluate', {
    expression: `(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].filter(image => image.complete).map(image => image.decode().catch(() => {})));
      const root = document.documentElement;
      const hero = document.querySelector('.hero');
      const fixture = document.querySelector('#mesa-in-action');
      return {
        title: document.title,
        language: root.lang,
        mainCount: document.querySelectorAll('main').length,
        h1Count: document.querySelectorAll('h1').length,
        overflow: root.scrollWidth - root.clientWidth,
        height: root.scrollHeight,
        fixtureTop: fixture ? Math.round(fixture.getBoundingClientRect().top + scrollY) : null,
        heroHeight: hero ? Math.round(hero.getBoundingClientRect().height) : null,
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
  observations.push({ route: routePath, width, ...state });
  const label = `/${routePath} @ ${width}px`;
  if (!state.title) failures.push(`${label}: missing title`);
  if (state.mainCount !== 1) failures.push(`${label}: main count ${state.mainCount}`);
  if (state.h1Count !== 1) failures.push(`${label}: h1 count ${state.h1Count}`);
  if (state.overflow > 1) failures.push(`${label}: horizontal overflow ${state.overflow}px`);
  if (state.brokenImages.length) failures.push(`${label}: broken images ${state.brokenImages.join(', ')}`);
  if (routePath === '' || routePath === 'tr/') {
    if (JSON.stringify(state.homeSections) !== JSON.stringify(requiredHomeSections)) failures.push(`${label}: homepage section order ${state.homeSections.join(', ')}`);
    if (JSON.stringify(state.scenes) !== JSON.stringify(requiredScenes)) failures.push(`${label}: scene order ${state.scenes.join(', ')}`);
    if (state.mediaLayers.some(({ hidden }) => hidden !== 'true')) failures.push(`${label}: interactive media layer`);
    if (width === 390) {
      if (state.fixtureTop === null || state.fixtureTop > 1800) failures.push(`${label}: fixture starts too late (${state.fixtureTop}px)`);
      const heightBudget = routePath === 'tr/' ? 10000 : 9000;
      if (state.height > heightBudget) failures.push(`${label}: homepage exceeds ${heightBudget}px (${state.height}px)`);
    }
  }
  const samplePages = ['mesa/', 'law/', 'docs/', 'learn/what-is-ai-memory/'];
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
  await connection.send('Page.navigate', { url });
  await waitForPage(url);
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
  await connection.send('Page.navigate', { url });
  await waitForPage(url);
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

try {
  await waitForDebugger();
  const target = await fetchJson(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(baseUrl)}`, { method: 'PUT' });
  connection = new DevToolsConnection(target.webSocketDebuggerUrl);
  await connection.send('Page.enable');
  await connection.send('Runtime.enable');

  for (const routePath of ['', 'tr/']) {
    for (const width of widths) await inspect(routePath, width);
  }
  for (const routePath of localizedRoutes) {
    await inspect(routePath, routePath === '' || routePath === 'tr/' ? 390 : 1440);
  }
  for (const routePath of ['mesa/', 'law/', 'docs/', 'learn/what-is-ai-memory/']) {
    await inspect(routePath, 390);
    await inspect(`tr/${routePath}`, 390);
  }
  for (const routePath of ['', 'tr/']) {
    await checkMobileMenu(routePath);
    await checkMemoryDisclosure(routePath);
  }

  if (failures.length) {
    console.error(`BROWSER QA FAIL (${failures.length})`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    console.log(`BROWSER QA PASS: ${localizedRoutes.length} localized routes, ${widths.length} homepage widths in EN/TR, mobile menu, no document overflow or broken images`);
  }
  if (screenshotsDirectory) {
    fs.writeFileSync(path.join(screenshotsDirectory, 'observations.json'), `${JSON.stringify({ baseUrl, observations, failures }, null, 2)}\n`);
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
