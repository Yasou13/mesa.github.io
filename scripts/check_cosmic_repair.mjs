#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {browser, wait} from './tests/visual_browser.mjs';
const arg=(name,fallback)=>process.argv.includes(name)?process.argv[process.argv.indexOf(name)+1]:fallback;
const base=arg('--base-url','http://127.0.0.1:8765/mesa-repair-after/');
const out=path.resolve(arg('--output','docs/audits/cosmic-repair'));
fs.mkdirSync(out,{recursive:true});
const b=await browser();const results=[];const failures=[];
// Text-node line rectangles catch overflowing glyphs that element boxes miss.
// Decorations and hidden nodes are excluded, not whole content components.
const inspect=`(() => {
 const box=r=>({x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom});
 const textRects=[];const groups=new Map();const walker=document.createTreeWalker(document.querySelector('main'),NodeFilter.SHOW_TEXT);
 while(walker.nextNode()) {
  const n=walker.currentNode,e=n.parentElement;
  if(!n.textContent.trim()||e.closest('script,style,svg,[aria-hidden="true"],.sr-only'))continue;
  const css=getComputedStyle(e);if(css.visibility!=='visible'||css.display==='none')continue;
  if(!e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true,contentVisibilityAuto:true}))continue;
  const closed=e.closest('details:not([open])');if(closed&&!closed.querySelector(':scope>summary')?.contains(e))continue;
  const group=e.closest('h1,h2,h3,h4,h5,h6,p,li,dt,dd,pre,summary,button,label,legend')||e;
  if(!groups.has(group))groups.set(group,groups.size);
  const range=document.createRange();range.selectNodeContents(n);
  for(const r of range.getClientRects())if(r.width>1&&r.height>1)textRects.push({group:groups.get(group),r:box(r),text:n.textContent.trim().slice(0,80),parent:e.tagName+'.'+e.className});
 }
 textRects.sort((a,b)=>a.r.y-b.r.y);const collisions=[];
 for(let i=0;i<textRects.length;i++)for(let j=i+1;j<textRects.length;j++){
  const a=textRects[i],c=textRects[j];if(c.r.y>=a.r.bottom-2)break;
  if(a.group===c.group)continue; // glyph ascent boxes within a wrapped text block can intersect
  if(Math.min(a.r.right,c.r.right)-Math.max(a.r.x,c.r.x)>2&&Math.min(a.r.bottom,c.r.bottom)-Math.max(a.r.y,c.r.y)>2)collisions.push([a,c]);
 }
 const rows=[...document.querySelectorAll('.reliability-list article')].map(a=>({grid:getComputedStyle(a).gridTemplateColumns,heading:box(a.querySelector('strong').getBoundingClientRect()),description:box(a.querySelector('p').getBoundingClientRect())}));
 const c=document.querySelector('.cosmic'),f=c?.querySelector('.cosmic__field');
 return {width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth-innerWidth,textCount:textRects.length,collisions,rows,cosmic:{count:document.querySelectorAll('.cosmic').length,position:c&&getComputedStyle(c).position,pointer:c&&getComputedStyle(c).pointerEvents,texture:f&&getComputedStyle(f).backgroundImage,motion:document.documentElement.dataset.cosmicMotion},surfaces:[...document.querySelectorAll('main>section')].map(e=>({class:e.className,background:getComputedStyle(e).backgroundColor})),broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)};
})()`;
try {
 if(process.argv.includes('--motion')) {
  for(const [width,reduce] of [[1440,false],[390,false],[1440,true],[390,true]]){
   await b.resize(width,width===390?844:1000);
   await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:reduce?'reduce':'no-preference'}]});
   await b.navigate(new URL('how-it-works/',base).href);
   await b.evaluate(`document.querySelector('.reliability-list').scrollIntoView({block:'center',behavior:'instant'});document.querySelectorAll('body > :not(.cosmic)').forEach(e=>e.style.visibility='hidden');window.frameTimes=[];window.lastFrame=0;window.frameRun=true;function sample(t){if(lastFrame)frameTimes.push(t-lastFrame);lastFrame=t;if(frameRun)requestAnimationFrame(sample)};requestAnimationFrame(sample);document.getAnimations().filter(a=>a.effect.target.closest('.cosmic')).forEach(a=>a.currentTime=0);`);
   // Let visibility transitions finish before T=0; otherwise a reduced-motion
   // screenshot may capture one stale content frame and falsely imply movement.
   await wait(300);
   await b.evaluate(`document.getAnimations().filter(a=>a.effect.target.closest('.cosmic')).forEach(a=>a.currentTime=0)`);
   const start=Date.now(),before=await b.send('Performance.getMetrics');const frames=[];
   for(const time of [0,5,10,20]) {
    await wait(Math.max(0,start+time*1000-Date.now()));
    frames.push({time,actualMs:Date.now()-start,...await b.evaluate(`(()=>{const e=document.querySelector('.cosmic__illumination')||document.querySelector('.cosmic__breath');const s=getComputedStyle(e);return {opacity:s.opacity,name:s.animationName,duration:s.animationDuration,playState:s.animationPlayState,rect:e.getBoundingClientRect().toJSON(),animations:document.getAnimations().filter(a=>a.effect.target.closest('.cosmic')).map(a=>({name:a.animationName,state:a.playState,currentTime:a.currentTime}))}})()`)});
    await b.capture(`${out}/motion-${width}-${reduce?'reduced':'normal'}-${time}.png`);
   }
   const after=await b.send('Performance.getMetrics');const performance=await b.evaluate(`(()=>{frameRun=false;const sorted=frameTimes.toSorted((a,b)=>a-b);return {frames:sorted.length,p50:sorted[Math.floor(sorted.length*.5)],p95:sorted[Math.floor(sorted.length*.95)],max:Math.max(...sorted),above34ms:sorted.filter(x=>x>34).length,heap:window.performance.memory?.usedJSHeapSize}})()`);
   const metrics=x=>Object.fromEntries(x.metrics.map(m=>[m.name,m.value]));const pre=metrics(before),post=metrics(after);
   results.push({width,reduce,frames,performance,metrics:{taskMs:(post.TaskDuration-pre.TaskDuration)*1000,layoutCount:post.LayoutCount-pre.LayoutCount,heapBefore:pre.JSHeapUsedSize,heapAfter:post.JSHeapUsedSize}});
   if(reduce&&frames.some(f=>f.animations.some(a=>a.state==='running')))failures.push('reduced-motion running');
   if(!reduce&&new Set(frames.map(f=>f.opacity)).size<3)failures.push('unchanging light '+width);
  }
  await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await b.navigate(new URL('how-it-works/',base).href);
  const hidden=await b.evaluate(`(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));return document.getAnimations().map(a=>({state:a.playState,time:a.currentTime}));})()`);
  await wait(1000);const paused=await b.evaluate(`document.getAnimations().map(a=>({state:a.playState,time:a.currentTime}))`);
  await b.evaluate(`delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));`);
  await wait(300);const resumed=await b.evaluate(`document.getAnimations().map(a=>({state:a.playState,time:a.currentTime}))`);
  results.push({visibilitySimulation:{hidden,paused,resumed}});
  if(!paused.length||paused.some(a=>a.state!=='paused')||resumed.some(a=>a.state!=='running'))failures.push('visibility pause/resume');
 } else {
  const all=process.argv.includes('--all-routes');
  const families=all?[...fs.globSync('**/index.html',{cwd:arg('--artifact','/tmp/mesa-repair-after')})].map(p=>p==='index.html'?'':p.replace(/index.html$/,'')):arg('--routes',',how-it-works/,mesa/,data/,law/,ecosystem/,qa/,certification/,learn/,docs/core/api-reference/,research/,guides/,status/,admin/').split(',');
  const widths=all?[390,1440]:process.argv.includes('--quick')?[390,801,1440]:[320,360,390,430,768,800,801,1024,1440,1920];
  for(const lang of all?['']:['','tr/'])for(const route of families)for(const width of widths){
   await b.resize(width,width<801?844:1000);await b.navigate(new URL(lang+route,base).href);
   const state=await b.evaluate(inspect);results.push({route:lang+route,...state});
   if(state.collisions.length||state.overflow>1||state.broken.length||state.cosmic.count!==1||state.cosmic.pointer!=='none')failures.push(`${lang+route}@${width}: ${state.collisions.length} collisions, ${state.overflow} overflow`);
   if([390,1440].includes(width)&&!process.argv.includes('--no-captures')){
    const name=(lang+route||'home').replaceAll('/','-').replace(/-$/,'');await b.capture(`${out}/after-${name}-${width}.png`);
    if(route==='how-it-works/'){
     await b.evaluate(`document.querySelector('.reliability-list').scrollIntoView({block:'center',behavior:'instant'})`);await b.capture(`${out}/after-${lang?'tr-':''}rows-${width}.png`);
     await b.evaluate(`window.scrollTo({top:document.querySelector('.action-section').offsetTop-250,behavior:'instant'})`);await b.capture(`${out}/after-${lang?'tr-':''}transition-${width}.png`);
    }
   }
  }
 }
 if(b.errors.length)failures.push(`${b.errors.length} browser exceptions`);
} finally {await b.close();}
const file=process.argv.includes('--motion')?'motion.json':'matrix.json';
fs.writeFileSync(path.join(out,file),JSON.stringify({base,version:b.version,results,failures,errors:b.errors},null,2));
console.log(JSON.stringify({file,observations:results.length,failures},null,2));
if(failures.length)process.exitCode=1;
