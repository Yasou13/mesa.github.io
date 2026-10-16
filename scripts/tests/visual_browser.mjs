// Small CDP harness for reproducible visual evidence; no browser dependency.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
export const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
export async function browser() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'mesa-repair-'));
  const process = spawn(globalThis.process.env.CHROME_BIN || 'google-chrome', ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], {stdio:'ignore'});
  let port;
  for (let i=0;i<100;i++) { try { port=fs.readFileSync(path.join(profile,'DevToolsActivePort'),'utf8').split('\n')[0]; break; } catch { await wait(100); } }
  if (!port) { process.kill(); throw new Error('Chrome did not start'); }
  const version=await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
  const tabs=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const socket=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
  let id=0; const pending=new Map(); const errors=[];
  socket.addEventListener('message',({data})=>{const m=JSON.parse(data);if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(m.method==='Network.responseReceived'&&m.params.response.status>=400)errors.push({url:m.params.response.url,status:m.params.response.status});const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result);}});
  const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});socket.send(JSON.stringify({id:n,method,params}));});
  const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Performance.enable');
  return {send,evaluate,errors,version,
    resize: (width,height=900)=>send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false}),
    async navigate(url) { const old=await evaluate('performance.timeOrigin'); await send('Page.navigate',{url}); for(let i=0;i<150;i++){if(await evaluate(`document.readyState==='complete' && performance.timeOrigin!==${old}`)){await evaluate('document.fonts.ready.then(()=>true)');await wait(100);return;}await wait(100);}throw new Error('Navigation timeout '+url); },
    async capture(file) {fs.mkdirSync(path.dirname(file),{recursive:true});const r=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(file,Buffer.from(r.data,'base64'));},
    async close() {socket.close();process.kill();await wait(300);fs.rmSync(profile,{recursive:true,force:true});}
  };
}
