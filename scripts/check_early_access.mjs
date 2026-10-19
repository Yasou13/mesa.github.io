import { browser } from './tests/visual_browser.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const base = process.argv[2] || 'http://127.0.0.1:8023/';
const out = 'review/early-access';
fs.mkdirSync(out,{recursive:true});
const b = await browser();
const checks=[];
const check=(name,ok)=>{checks.push({name,passed:Boolean(ok)});assert.ok(ok,name);};
const until=async expression=>{for(let i=0;i<100;i++){if(await b.evaluate(expression))return;await new Promise(r=>setTimeout(r,30));}throw new Error('Timed out: '+expression);};
try {
 await b.send('Page.addScriptToEvaluateOnNewDocument',{source:`(()=>{const orig=fetch.bind(window);window.__intake={mode:'ok',calls:[],delay:0};window.fetch=async(input,opts={})=>{const url=new URL(typeof input==='string'?input:input.url,location.href);if(!url.pathname.includes('/rest/v1/rpc/'))return orig(input,opts);const f=window.__intake;f.calls.push({name:url.pathname.split('/').pop(),data:JSON.parse(opts.body||'{}')});if(f.delay)await new Promise(r=>setTimeout(r,f.delay));if(url.pathname.endsWith('early_access_available'))return new Response(JSON.stringify(f.mode!=='unavailable'),{status:200});if(f.mode==='network')throw new TypeError('Fixture network failure');if(f.mode==='rate')return new Response(JSON.stringify({code:'P0429'}),{status:400});return new Response(JSON.stringify({accepted:true}),{status:200});};})()`});
 const axe=fs.readFileSync('node_modules/axe-core/axe.min.js','utf8');
 for(const locale of ['','tr/']) {
  await b.navigate(new URL(locale+'early-access/',base).href);
  await until(`!document.getElementById('access-fields').disabled`);
  for(const width of [390,1440]) {
   await b.resize(width,1100);
   check(locale+'page fits '+width,await b.evaluate('document.documentElement.scrollWidth<=innerWidth+1'));
   const shot=await b.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true});
   fs.writeFileSync(out+'/'+(locale?'tr':'en')+'-form-'+width+'.png',Buffer.from(shot.data,'base64'));
  }
  await b.evaluate(axe);
  const violations=await b.evaluate(`axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}).then(r=>r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))`);
  check(locale+'accessible form',violations.length===0 || (console.log(violations),false));
  await b.evaluate(`(()=>{const f=document.getElementById('early-access-form');f.elements.email.value='person@example.test';f.elements.intent.value='integration';f.elements.use_case.value='A private document assistant with source tracing.';f.elements.acknowledged.checked=true;f.elements.github_url.value='https://example.com/not-github';f.requestSubmit();})()`);
  check(locale+'invalid github prevented',await b.evaluate(`!__intake.calls.some(c=>c.name==='submit_early_access')`));
  await b.evaluate(`(()=>{__intake.mode='network';const f=document.getElementById('early-access-form');f.elements.github_url.value='https://github.com/Yasou13/MESA';f.requestSubmit();})()`);
  await until(`document.getElementById('access-status').dataset.error==='true' && !document.getElementById('access-fields').disabled`);
  check(locale+'network failure preserves answers',await b.evaluate(`!document.getElementById('early-access-form').hidden && document.getElementById('access-use-case').value.includes('private document')`));
  await b.evaluate(`__intake.mode='rate';document.getElementById('early-access-form').requestSubmit()`);
  await until(`document.getElementById('access-status').textContent.includes('${locale?'bir saat':'an hour'}')`);
  check(locale+'rate message preserves input',await b.evaluate(`!document.getElementById('early-access-form').hidden && !document.getElementById('access-fields').disabled`));
  await b.evaluate(`__intake.mode='ok';__intake.delay=200;document.getElementById('early-access-form').requestSubmit();document.getElementById('early-access-form').requestSubmit()`);
  check(locale+'submission disables fields',await b.evaluate(`document.getElementById('access-fields').disabled`));
  await until(`document.getElementById('early-access-form').hidden`);
  check(locale+'receipt only after backend acceptance',await b.evaluate(`document.getElementById('access-status').textContent.includes('${locale?'Talebiniz alındı':'request has been received'}') && __intake.calls.filter(c=>c.name==='submit_early_access').length===3`));
  check(locale+'locale and acknowledgement reach backend',await b.evaluate(`(()=>{const p=__intake.calls.at(-1).data;return p.p_language==='${locale?'tr':'en'}' && p.p_acknowledged===true && !('status' in p);})()`));
  await b.navigate(new URL(locale+'early-access/',base).href);await until(`!document.getElementById('access-fields').disabled`);
  await b.evaluate(`__intake.mode='unavailable';document.getElementById('access-retry').click()`);
  await until(`document.getElementById('access-retry').hidden===false`);
  check(locale+'unavailable backend fails closed',await b.evaluate(`document.getElementById('early-access-form').hidden && document.getElementById('access-fields').disabled`));
 }
 console.log('EARLY ACCESS BROWSER PASS: '+checks.length+' checks');
} finally {fs.writeFileSync(out+'/form-checks.json',JSON.stringify(checks,null,2)+'\n');await b.close();}
