// Local-project regression tests. Reuses the repository's isolated Chrome harness.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {browser} from './visual_browser.mjs';
const base = process.argv[2] || 'http://127.0.0.1:8000/';
const output = process.argv[3] || '/tmp/mesa-first-use-browser';
fs.mkdirSync(output, {recursive:true});
const b = await browser();
const observations = [];
const accessibility = [];
const axe = fs.readFileSync(new URL('../../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
try {
  for (const language of ['en', 'tr']) {
    const prefix = language === 'tr' ? 'tr/' : '';
    for (const route of ['', 'get-started/', 'docs/', 'docs/core/getting-started/', 'docs/core/cli-reference/']) {
      for (const width of [320, 390, 768, 1280, 1920]) {
        await b.resize(width, 900);
        await b.navigate(base + prefix + route);
        const state = await b.evaluate(`(() => {
          const visible = element => element.getClientRects().length > 0;
          const small = [...document.querySelectorAll('main p,main pre code')].filter(visible).filter(e => parseFloat(getComputedStyle(e).fontSize) < 14).map(e=>({text:e.textContent.slice(0,50),size:getComputedStyle(e).fontSize}));
          const smallBody = [...document.querySelectorAll('.docs-body > p,.docs-interface-card p,.docs-hub-section > p,.practical-uses p,.home-start-note')].filter(visible).filter(e=>parseFloat(getComputedStyle(e).fontSize)<16).map(e=>({text:e.textContent.slice(0,50),size:getComputedStyle(e).fontSize}));
          const smallLabels = [...document.querySelectorAll('main *,header *,footer *')].filter(e=>e.checkVisibility()&&[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&parseFloat(getComputedStyle(e).fontSize)<14).map(e=>({text:e.textContent.slice(0,35),size:getComputedStyle(e).fontSize}));
          return {sidebar:!!document.querySelector('.docs-sidebar'),tabs:!!document.querySelector('.docs-tabs'),active:document.querySelector('#main-navigation .nav-item.active')?.getAttribute('href'),smallLabels,smallBody,width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,h1:document.querySelectorAll('h1').length,small,
          steps:[...document.querySelectorAll('[data-demo-step]')].filter(visible).length,
          rail:document.querySelector('.docs-onboarding .docs-toc-column') ? visible(document.querySelector('.docs-onboarding .docs-toc-column')) : false};
        })()`);
        assert.equal(state.overflow, false, JSON.stringify({language,route,...state}));
        assert.equal(state.h1, 1);
        assert.deepEqual(state.small, [], JSON.stringify({language,route,width,small:state.small}));
        assert.deepEqual(state.smallBody, [], JSON.stringify({language,route,width,smallBody:state.smallBody}));
        assert.deepEqual(state.smallLabels, [], JSON.stringify({language,route,width,smallLabels:state.smallLabels}));
        assert.equal(state.rail, false);
        if (route === 'get-started/') {
          assert.equal(state.sidebar, false);
          assert.equal(state.tabs, false);
          assert.match(state.active, /get-started\/$/);
        }
        if (width === 390 || width === 1280) {
          await b.evaluate(axe);
          const violations = await b.evaluate(`(async () => (await axe.run(document, {runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})))()`);
          accessibility.push({language,route,width,violations});
          fs.writeFileSync(`${output}/accessibility.json`, JSON.stringify(accessibility,null,2));
          assert.deepEqual(violations, [], JSON.stringify({language,route,width,violations}));
        }
        if (!route) {
          assert.equal(state.steps, 1, JSON.stringify({language,route,width,state}));
          await b.evaluate(`document.querySelector('[data-demo-next]').click(); document.querySelector('[data-demo-next]').click();`);
          assert.ok(await b.evaluate(`document.querySelector('[data-demo-step]:not([hidden])').textContent.includes('09:00') && document.querySelector('[data-demo-step]:not([hidden])').textContent.includes('COMMITTED')`));
          await b.evaluate(`document.querySelector('[data-demo-next]').click()`);
          assert.ok(await b.evaluate(`document.querySelector('[data-demo-step]:not([hidden])').textContent.includes('10:00') && document.querySelector('[data-demo-next]').disabled`));
          if (width===390 || width===1280) await b.capture(`${output}/${language}-home-${width}.png`);
          if (width===320) {
            await b.evaluate(`document.querySelector('.menu-toggle').click()`);
            assert.equal(await b.evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')`),'true');
          }
        }
        if ((route==='docs/core/getting-started/' || route==='get-started/') && width===1280) await b.capture(`${output}/${language}-${route === 'get-started/' ? 'standalone' : 'setup'}-${width}.png`);
        observations.push({language,route,...state});
      }
    }
    await b.resize(1280,900);
    await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await b.navigate(base+prefix);
    assert.equal(await b.evaluate(`matchMedia('(prefers-reduced-motion: reduce)').matches`),true);
    assert.equal(await b.evaluate(`getComputedStyle(document.querySelector('.cosmic__illumination')).animationName`),'none');
    await b.send('Browser.grantPermissions', {origin:base.replace(/\/$/, ''),permissions:['clipboardReadWrite','clipboardSanitizedWrite']});
    await b.send('Page.bringToFront');
    await b.send('Emulation.setFocusEmulationEnabled',{enabled:true});
    await b.evaluate(`document.querySelector('[data-demo-next]').focus()`);
    await b.send('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});
    await b.send('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});
    assert.equal(await b.evaluate(`document.querySelector('[data-demo-progress]').textContent`),'2 / 4');
    await b.evaluate(`document.querySelector('[data-demo-next]').click(); document.querySelector('[data-demo-next]').click()`);
    assert.equal(await b.evaluate(`document.activeElement.hasAttribute('data-demo-prev')`),true);
    await b.evaluate(`document.querySelector('[data-copy-target="home-install"]').click()`);
    for (let i=0;i<20;i++) {
      if (await b.evaluate(`document.querySelector('[data-copy-target="home-install"]').textContent === ${language === 'tr' ? '"Kopyalandı"' : '"Copied"'}`)) break;
      await new Promise(resolve=>setTimeout(resolve,50));
    }
    assert.equal(await b.evaluate(`navigator.clipboard.readText()`), 'pip install "mesa-memory[adapters]==0.9.0"\nmesa start');
    await b.send('Emulation.setScriptExecutionDisabled',{value:true});
    await b.navigate(base+prefix);
    assert.equal(await b.evaluate(`document.querySelectorAll('[data-demo-step]:not([hidden])').length`),4);
    await b.capture(`${output}/${language}-no-javascript.png`);
    await b.send('Emulation.setScriptExecutionDisabled',{value:false});
  }
  assert.deepEqual(b.errors, []);
  fs.writeFileSync(`${output}/report.json`,JSON.stringify(observations,null,2));
  console.log(`FIRST USE BROWSER PASS: ${observations.length} localized viewport checks; reduced motion and no-JavaScript passed.`);
} finally { await b.close(); }
