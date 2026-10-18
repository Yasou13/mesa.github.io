import assert from 'node:assert/strict';
import fs from 'node:fs';
import {browser} from './visual_browser.mjs';
const base=process.argv[2]||'http://127.0.0.1:8001/';
const root=new URL('../../',import.meta.url);
const hub=JSON.parse(fs.readFileSync(new URL('content/hub.json',root),'utf8'));
const course=JSON.parse(fs.readFileSync(new URL('content/learn-curriculum.json',root),'utf8'));
const lessons=course.lessons.map(id=>hub.entries.find(e=>e.id===id));
const b=await browser();let layouts=0,redirects=0;
const until=async expression=>{for(let i=0;i<80;i++){if(await b.evaluate(expression))return;await new Promise(r=>setTimeout(r,50));}throw Error('Timeout: '+expression);};
try {
 for(const lang of ['','tr/'])for(const route of ['learn/',...lessons.map(e=>e.path)])for(const width of [320,768,1440]){
  await b.resize(width,1000);await b.navigate(base+lang+route);
  const state=await b.evaluate(`({overflow:document.documentElement.scrollWidth-innerWidth,h1:document.querySelectorAll('h1').length,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),nav:document.querySelectorAll('[data-nav-lesson]').length,exercises:document.querySelectorAll('.learn-exercise').length})`);
  assert.ok(state.overflow<=1,`${lang+route} ${width}: overflow ${state.overflow}`);assert.equal(state.h1,1);assert.deepEqual(state.broken,[]);
  if(route!=='learn/'){assert.equal(state.nav,14);assert.ok(state.exercises>=1);}
  layouts++;
 }
 for(const lang of ['','tr/']) {
  await b.resize(1440);await b.navigate(base+lang+'learn/');
  await b.evaluate(`document.querySelector('[data-stage-filter="retrieval"]').click()`);
  assert.equal(await b.evaluate(`document.querySelectorAll('.learn-lesson:not([hidden])').length`),5);
  await b.evaluate(`(()=>{document.querySelector('[data-learn-clear]').click();const input=document.getElementById('learn-query');input.value='fencing';input.dispatchEvent(new Event('input',{bubbles:true}))})()`);
  assert.ok(await b.evaluate(`document.querySelector('[data-learn-matches] a').href.endsWith('#idempotency')`));
  await b.evaluate(`document.getElementById('learn-query').value='zzzz-no-such-concept';document.getElementById('learn-query').dispatchEvent(new Event('input',{bubbles:true}))`);
  assert.equal(await b.evaluate(`document.querySelector('[data-learn-empty]').hidden`),false);
  await b.evaluate(`document.querySelector('[data-learn-clear]').click()`);
  assert.equal(await b.evaluate(`document.querySelectorAll('.learn-lesson:not([hidden])').length`),14);
  if(lang==='tr/'){
   await b.evaluate(`(()=>{const i=document.getElementById('learn-query');i.value='kosinus';i.dispatchEvent(new Event('input',{bubbles:true}))})()`);
   assert.ok(await b.evaluate(`document.querySelector('[data-learn-matches] a').href.includes('/semantic-search/#')`));
  }
  await b.evaluate(`document.querySelector('.search-trigger').click()`);
  await until(`!!document.querySelector('.search-input')`);
  await b.evaluate(`(()=>{const i=document.querySelector('.search-input');i.value='fencing';i.dispatchEvent(new Event('input',{bubbles:true}))})()`);
  await until(`!!document.querySelector('.search-results-list a[href*="#idempotency"]')`);
  await b.evaluate(`localStorage.removeItem('mesa-learn-progress-v2')`);
  await b.navigate(base+lang+lessons[0].path);
  await b.evaluate(`document.querySelector('[data-mark-lesson]').click()`);
  assert.equal(await b.evaluate(`JSON.parse(localStorage.getItem('mesa-learn-progress-v2')).includes('what-is-ai-memory')`),true);
  await b.evaluate(`document.querySelector('.learn-exercise summary').click()`);
  assert.equal(await b.evaluate(`document.querySelector('.learn-exercise details').open`),true);
  await b.navigate(base+lang+'learn/');
  assert.ok(await b.evaluate(`document.querySelector('[data-learn-resume]').href.includes('/rag-vs-ai-memory/')`));
  assert.ok(await b.evaluate(`document.querySelector('[data-lesson-id="what-is-ai-memory"]').classList.contains('is-complete')`));
  for(const r of course.redirects){
   const target=hub.entries.find(e=>e.id===r.toId).path;
   await b.navigate(base+lang+r.fromPath);
   await until(`location.pathname===${JSON.stringify(new URL(base+lang+target).pathname)}`);
   redirects++;
  }
  await b.send('Emulation.setScriptExecutionDisabled',{value:true});
  await b.navigate(base+lang+'learn/');
  assert.equal(await b.evaluate(`document.querySelectorAll('[data-lesson-id] a[data-lesson-url]').length`),14);
  assert.equal(await b.evaluate(`getComputedStyle(document.querySelector('[data-learn-controls]')).display`),'none');
  await b.navigate(base+lang+lessons[0].path);
  assert.equal(await b.evaluate(`document.querySelector('.learn-course-nav').open`),true);
  assert.equal(await b.evaluate(`getComputedStyle(document.querySelector('[data-mark-lesson]')).display`),'none');
  await b.send('Emulation.setScriptExecutionDisabled',{value:false});
 }
 assert.deepEqual(b.errors,[]);
 console.log(JSON.stringify({pass:true,layouts,redirects,features:['stage filters','full-text and section search','Turkish unaccented query','global deep-link search','progress and resume','answered exercises','no-JavaScript reading'],browser:b.version.Browser},null,2));
} finally {await b.close();}
