#!/usr/bin/env node
import fs from 'node:fs';
import {browser,wait} from './tests/visual_browser.mjs';
const b=await browser(),results=[];
try {
 await b.send('Network.setCacheDisabled',{cacheDisabled:true});
 await b.send('Page.addScriptToEvaluateOnNewDocument',{source:`window.auditCLS=0;new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)auditCLS+=e.value}).observe({type:'layout-shift',buffered:true});`});
 for(const version of ['before','after'])for(const [width,reduce] of [[1440,false],[390,false],[1440,true]]){
  await b.resize(width,width===390?844:1000);await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:reduce?'reduce':'no-preference'}]});
  await b.navigate(`http://127.0.0.1:8765/mesa-repair-${version}/how-it-works/`);await wait(1000);
  const read=async()=>Object.fromEntries((await b.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
  const start=await read();await wait(5000);const end=await read();
  const page=await b.evaluate(`({cls:auditCLS,resources:performance.getEntriesByType('resource').map(e=>({name:e.name,transfer:e.transferSize,encoded:e.encodedBodySize})),animations:document.querySelector('.cosmic').getAnimations({subtree:true}).map(a=>({name:a.animationName,state:a.playState}))})`);
  results.push({version,width,reduce,intervalMs:5000,mainThreadMs:(end.TaskDuration-start.TaskDuration)*1000,layoutCount:end.LayoutCount-start.LayoutCount,heapBefore:start.JSHeapUsedSize,heapAfter:end.JSHeapUsedSize,...page});
 }
}finally{await b.close();}
fs.writeFileSync('docs/audits/cosmic-repair/performance.json',JSON.stringify({browser:b.version,results,errors:b.errors},null,2));console.log(JSON.stringify(results.map(({resources,...r})=>({...r,resourceBytes:resources.reduce((s,r)=>s+r.transfer,0)})),null,2));
