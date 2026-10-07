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
const chrome = process.env.CHROME_BIN || 'google-chrome';
const port = 9300 + (process.pid % 500);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'mesa-browser-qa-'));
const requiredScenes = ['event-horizon', 'flyby', 'deep-space', 'connections', 'structure'];

const routes = [
  ...Object.values(siteData.pages).map(({ path: routePath }) => routePath),
  ...hubData.sections.map(({ path: routePath }) => routePath),
  ...hubData.entries.filter(({ draft, indexable }) => !draft && indexable).map(({ path: routePath }) => routePath),
];
const localizedRoutes = routes.flatMap((routePath) => [routePath, `tr/${routePath}`]);
const widths = [320, 390, 768, 1024, 1440, 1920];
const failures = [];
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
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await connection.send('Page.navigate', { url });
  await waitForPage(url);
  const { result } = await connection.send('Runtime.evaluate', {
    expression: `(async () => {
      await document.fonts.ready;
      const root = document.documentElement;
      return {
        title: document.title,
        language: root.lang,
        mainCount: document.querySelectorAll('main').length,
        h1Count: document.querySelectorAll('h1').length,
        overflow: root.scrollWidth - root.clientWidth,
        brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc),
        scenes: [...document.querySelectorAll('[data-scene]')].map((node) => node.dataset.scene),
        mediaLayers: [...document.querySelectorAll('[data-scene-media]')].map((node) => ({ id: node.dataset.sceneMedia, hidden: node.getAttribute('aria-hidden') })),
      };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  const state = result.value;
  const label = `/${routePath} @ ${width}px`;
  if (!state.title) failures.push(`${label}: missing title`);
  if (state.mainCount !== 1) failures.push(`${label}: main count ${state.mainCount}`);
  if (state.h1Count !== 1) failures.push(`${label}: h1 count ${state.h1Count}`);
  if (state.overflow > 1) failures.push(`${label}: horizontal overflow ${state.overflow}px`);
  if (state.brokenImages.length) failures.push(`${label}: broken images ${state.brokenImages.join(', ')}`);
  if (routePath === '' || routePath === 'tr/') {
    if (JSON.stringify(state.scenes) !== JSON.stringify(requiredScenes)) failures.push(`${label}: scene order ${state.scenes.join(', ')}`);
    if (state.mediaLayers.some(({ hidden }) => hidden !== 'true')) failures.push(`${label}: interactive media layer`);
  }
}

async function checkMobileMenu() {
  const url = new URL('', baseUrl).toString();
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
  if (!result.value?.opened || !result.value?.closed) failures.push('mobile menu did not open and close with Escape');
}

try {
  await waitForDebugger();
  const target = await fetchJson(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(baseUrl)}`, { method: 'PUT' });
  connection = new DevToolsConnection(target.webSocketDebuggerUrl);
  await connection.send('Page.enable');
  await connection.send('Runtime.enable');

  for (const width of widths) await inspect('', width);
  for (const routePath of localizedRoutes) {
    await inspect(routePath, routePath === '' || routePath === 'tr/' ? 390 : 1440);
  }
  await checkMobileMenu();

  if (failures.length) {
    console.error(`BROWSER QA FAIL (${failures.length})`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    console.log(`BROWSER QA PASS: ${localizedRoutes.length} localized routes, ${widths.length} homepage widths, mobile menu, no document overflow or broken images`);
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
