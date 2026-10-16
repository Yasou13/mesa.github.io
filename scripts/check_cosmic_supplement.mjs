import fs from 'node:fs';
import {browser,wait} from './tests/visual_browser.mjs';
const out='docs/audits/cosmic-repair';const b=await browser(),results=[];
try {
 await b.send('Page.addScriptToEvaluateOnNewDocument',{source:`window.auditCLS=0;new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)auditCLS+=e.value}).observe({type:'layout-shift',buffered:true});`});
 for(const route of ['how-it-works/','tr/how-it-works/']){
  await b.navigate('http://127.0.0.1:8766/'+route);
  for(const [width,height] of [[1920,1000],[1024,900],[801,900],[800,900],[320,844],[844,430],[1440,1000]]){
   await b.resize(width,height);await wait(150);
   results.push({type:'live-resize',route,width,height,...await b.evaluate(`({overflow:document.documentElement.scrollWidth-innerWidth,grid:getComputedStyle(document.querySelector('.reliability-list article')).gridTemplateColumns,cosmic:document.querySelector('.cosmic').getBoundingClientRect().toJSON(),cls:auditCLS})`)});
  }
 }
 for(const width of [1440,390]){
  await b.resize(width,width===390?844:1000);await b.navigate('http://127.0.0.1:8766/how-it-works/');
  await b.evaluate(`document.querySelector('.reliability-list').scrollIntoView({block:'center',behavior:'instant'});document.getAnimations().filter(a=>a.effect.target.closest('.cosmic')).forEach(a=>{a.pause();a.currentTime=14000});`);
  await b.capture(`${out}/peak-content-${width}.png`);
  const rects=await b.evaluate(`Array.from(document.querySelectorAll('.reliability-list p,.reliability-section .section-heading p')).map(e=>({rect:e.getBoundingClientRect().toJSON(),color:getComputedStyle(e).color}))`);
  await b.evaluate(`document.querySelectorAll('body > :not(.cosmic)').forEach(e=>e.style.visibility='hidden')`);
  await b.capture(`${out}/peak-background-${width}.png`);results.push({type:'contrast-regions',width,rects});
  await b.send('Emulation.setScriptExecutionDisabled',{value:true});await b.navigate('http://127.0.0.1:8766/how-it-works/');
  results.push({type:'no-js',width,...await b.evaluate(`({background:getComputedStyle(document.querySelector('.cosmic__field')).backgroundImage,moving:document.querySelector('.cosmic').getAnimations({subtree:true}).length,overflow:document.documentElement.scrollWidth-innerWidth})`)});await b.send('Emulation.setScriptExecutionDisabled',{value:false});
 }
 await b.resize(1440,1000);await b.navigate('http://127.0.0.1:8766/admin/');results.push({type:'admin-motion',...await b.evaluate(`({state:document.documentElement.dataset.cosmicMotion,animations:document.querySelector('.cosmic').getAnimations({subtree:true}).map(a=>a.playState)})`)});
 await b.send('Page.addScriptToEvaluateOnNewDocument',{source:`Object.defineProperty(navigator.connection,'saveData',{configurable:true,get:()=>true});`});await b.navigate('http://127.0.0.1:8766/');results.push({type:'data-saver',...await b.evaluate(`({state:document.documentElement.dataset.cosmicMotion,animations:document.querySelector('.cosmic').getAnimations({subtree:true}).map(a=>a.playState)})`)});
}finally{await b.close();}
fs.writeFileSync(`${out}/supplement.json`,JSON.stringify({results,errors:b.errors},null,2));console.log(JSON.stringify({checks:results.length,errors:b.errors}));
