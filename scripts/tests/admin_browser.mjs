// Isolated protocol fixture: exercises the real bundled Supabase SDK and UI.
// This is NOT a real Auth server and cannot certify production authentication.
export const adminFixture = `(() => {
 const originalFetch=window.fetch.bind(window), key='mesa-admin-127.0.0.1:54321';
 const user={id:'11111111-1111-4111-8111-111111111111',aud:'authenticated',role:'authenticated',email:'owner@example.test',app_metadata:{},user_metadata:{},created_at:'2026-10-16T00:00:00Z'};
 const f=window.__authFixture={mode:sessionStorage.getItem('mesa-fixture-mode')||'ok',calls:[],delay:0,revoked:false};
 f.session=(expiry=3600)=>{const exp=Math.floor(Date.now()/1000)+expiry;return {access_token:btoa(JSON.stringify({alg:'HS256',typ:'JWT'}))+'.'+btoa(JSON.stringify({sub:user.id,exp,iat:Math.floor(Date.now()/1000),aud:'authenticated',role:'authenticated'}))+'.fixture',refresh_token:'isolated-refresh-fixture',token_type:'bearer',expires_in:expiry,expires_at:exp,user};};
 window.fetch=async(input,options={})=>{
  const url=new URL(typeof input==='string'?input:input.url);if(url.origin!=='http://127.0.0.1:54321')return originalFetch(input,options);
  const method=options.method||'GET';f.calls.push({path:url.pathname,grant:url.searchParams.get('grant_type'),method});
  if(f.delay)await new Promise(r=>setTimeout(r,f.delay));
  const response=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
  if(url.pathname==='/auth/v1/token'){
   if(f.mode==='credentials' || (url.searchParams.get('grant_type')==='refresh_token' && f.mode==='expired'))return response({msg:'Invalid credentials',error_code:'invalid_credentials'},400);
   f.revoked=false;return response(f.session());
  }
  if(url.pathname==='/auth/v1/user'){
   if(f.mode==='invalid-user'||f.revoked)return response({msg:'JWT expired'},401);
   if(method==='PUT'&&f.mode==='password-fail')return response({msg:'Update rejected'},422);
   return response(user);
  }
  if(url.pathname==='/auth/v1/logout'){if(f.mode==='logout-fail')return response({msg:'Unavailable'},503);f.revoked=true;return new Response(null,{status:204});}
  if(url.pathname==='/auth/v1/recover'){return f.mode==='reset-fail'?response({msg:'Rate limit'},429):response({});}
  if(url.pathname==='/rest/v1/rpc/is_admin')return f.mode==='role-error'?response({message:'Unavailable'},503):response(f.mode!=='nonadmin');
  if(url.pathname==='/rest/v1/articles'){
   if(f.mode==='data-fail')return response({message:'Denied'},403);
   if(method==='PATCH')return f.mode==='conflict'?response({message:'No rows',code:'PGRST116'},406):response({id:'draft',updated_at:'2026-10-16T10:01:00Z'});
   const article={id:'draft',title:'<img src=x onerror=alert(1)> fixture',language:'en',summary:'Private summary',body_markdown:'# Private draft',status:'draft',updated_at:'2026-10-16T10:00:00Z'};
   return response(url.searchParams.has('id')?article:[article]);
  }
  if(['/rest/v1/media_assets','/rest/v1/publication_jobs'].includes(url.pathname))return response([]);
  throw new Error('Unexpected fixture endpoint '+url.pathname);
 };
})()`;

export async function checkAdminAuth({connection,evaluate,navigate,baseUrl,failures,fallbackChecks,screenshotsDirectory,fs,path}) {
 await connection.send('Page.addScriptToEvaluateOnNewDocument',{source:adminFixture});
 const key='mesa-admin-127.0.0.1:54321';
 const until=async expression=>{for(let i=0;i<100;i++){if(await evaluate(expression))return;await new Promise(r=>setTimeout(r,50));}throw new Error('Timed out: '+expression);};
 const record=(name,passed)=>{fallbackChecks.push({type:'isolated-auth-fixture',name,status:passed?'PASS':'FAIL'});if(!passed)failures.push('Admin fixture: '+name);};
 for(const locale of ['','tr/']) {
  const url=new URL(locale+'admin/',baseUrl).href;
  await navigate(url);
  const reset=async(mode='ok')=>{
   await evaluate(`(()=>{for(const k of Object.keys(sessionStorage))if(k.startsWith('${key}'))sessionStorage.removeItem(k);sessionStorage.setItem('mesa-fixture-mode',${JSON.stringify(mode)});})()`);
   await navigate(url);await until(`!document.querySelector('#login-form fieldset').disabled`);
  };
  const signin=async()=>{await evaluate(`(()=>{document.querySelector('#email').value='owner@example.test';document.querySelector('#password').value='fixture-only-password';document.querySelector('#login-form').requestSubmit();})()`);};
  await reset('credentials');await signin();await until(`!document.querySelector('#login-form button').disabled`);
  record(locale+'invalid password fails closed',await evaluate(`document.querySelector('#workspace').hidden && document.querySelector('#admin-status').dataset.error==='true'`));
  await reset('nonadmin');await signin();await until(`document.querySelector('#admin-status').textContent.includes('${locale?'yönetici erişimi yok':'no administrator access'}')`);
  record(locale+'server role rejection before draft fetch',await evaluate(`document.querySelector('#workspace').hidden && !__authFixture.calls.some(c=>c.path==='/rest/v1/articles')`));
  await reset();await evaluate(`__authFixture.delay=120`);await signin();
  record(locale+'loading state',await evaluate(`document.querySelector('#login-form button').disabled`));
  await until(`!document.querySelector('#workspace').hidden && document.querySelector('#records button')`);
  record(locale+'real SDK token user and role sequence',await evaluate(`['/auth/v1/token','/auth/v1/user','/rest/v1/rpc/is_admin','/rest/v1/articles'].every(path=>__authFixture.calls.some(c=>c.path===path))`));
  record(locale+'draft title remains text',await evaluate(`!document.querySelector('#records img') && document.querySelector('#records').textContent.includes('<img')`));
  await evaluate(`document.querySelector('#records button').click()`);await until(`!document.querySelector('#editor').hidden`);
  await evaluate(`document.querySelector('#article-title').value='Saved fixture';document.querySelector('#editor').requestSubmit()`);await until(`!document.querySelector('#editor button').disabled`);
  record(locale+'draft save waits for backend',await evaluate(`__authFixture.calls.some(c=>c.method==='PATCH') && document.querySelector('#admin-status').textContent.includes('${locale?'kaydedildi':'saved'}')`));
  await evaluate(`__authFixture.mode='conflict';document.querySelector('#editor').requestSubmit()`);await until(`!document.querySelector('#editor button').disabled`);
  record(locale+'stale write rejected',await evaluate(`document.querySelector('#admin-status').dataset.error==='true'`));
  await evaluate(`__authFixture.mode='ok';document.querySelector('[data-records="media_assets"]').click()`);await until(`__authFixture.calls.some(c=>c.path==='/rest/v1/media_assets')`);
  await evaluate(`document.querySelector('[data-records="publication_jobs"]').click()`);await until(`__authFixture.calls.some(c=>c.path==='/rest/v1/publication_jobs')`);
  record(locale+'private media and publication metadata',true);
  await evaluate(`document.querySelector('#logout').click()`);await until(`!sessionStorage.getItem('${key}')`);
  record(locale+'logout clears private fields and session',await evaluate(`document.querySelector('#workspace').hidden && document.querySelector('#records').children.length===0 && document.querySelector('#article-body').value===''`));
  await reset();await evaluate(`sessionStorage.setItem('${key}',JSON.stringify(__authFixture.session(-10)))`);await navigate(url);
  await until(`!document.querySelector('#workspace').hidden`);
  record(locale+'expired access token refresh',await evaluate(`__authFixture.calls.some(c=>c.grant==='refresh_token')`));
  await evaluate(`sessionStorage.setItem('${key}',JSON.stringify(__authFixture.session(-10)));sessionStorage.setItem('mesa-fixture-mode','expired')`);await navigate(url);
  await until(`!document.querySelector('#login-form fieldset').disabled`);
  record(locale+'rejected refresh locks session',await evaluate(`document.querySelector('#workspace').hidden`));
  await reset();await evaluate(`document.querySelector('#email').value='owner@example.test';document.querySelector('#reset-request').click()`);await until(`!document.querySelector('#reset-request').disabled`);
  record(locale+'password recovery sends actual SDK request',await evaluate(`__authFixture.calls.some(c=>c.path==='/auth/v1/recover') && document.querySelector('#admin-status').dataset.error==='false'`));
  await evaluate(`sessionStorage.setItem('${key}-code-verifier',JSON.stringify('a'.repeat(64)+'/recovery'))`);
  await navigate(url+'?code=isolated-recovery&recovery=1');await until(`!document.querySelector('#recovery-panel').hidden`);
  record(locale+'PKCE recovery validates session and strips code',await evaluate(`location.search==='' && __authFixture.calls.some(c=>c.grant==='pkce') && __authFixture.calls.some(c=>c.path==='/auth/v1/user')`));
  await evaluate(`document.querySelector('#new-password').value='fixture-replacement-password';document.querySelector('#confirm-password').value='fixture-replacement-password';document.querySelector('#recovery-form').requestSubmit()`);
  await until(`!sessionStorage.getItem('${key}')`);
  record(locale+'password change and logout',await evaluate(`__authFixture.calls.some(c=>c.path==='/auth/v1/user'&&c.method==='PUT') && document.querySelector('#workspace').hidden`));
  await reset();await signin();await until(`!document.querySelector('#workspace').hidden`);
  await evaluate(`__authFixture.mode='nonadmin';document.querySelector('[data-records="articles"]').click()`);await until(`document.querySelector('#workspace').hidden`);
  record(locale+'revoked role clears loaded private content',await evaluate(`document.querySelector('#records').children.length===0 && document.querySelector('#article-body').value===''`));
  await reset();await signin();await until(`!document.querySelector('#workspace').hidden`);
  await evaluate(`__authFixture.mode='logout-fail';document.querySelector('#logout').click()`);await until(`!sessionStorage.getItem('${key}')`);
  record(locale+'network failure logout clears local credentials honestly',await evaluate(`document.querySelector('#workspace').hidden && document.querySelector('#admin-status').dataset.error==='true'`));
  for(const mode of ['invalid-user','role-error']) {
    await reset(mode); await signin(); await until(`document.querySelector('#admin-status').dataset.error==='true' && !document.querySelector('#login-form button').disabled`);
    record(locale+mode+' denies private access',await evaluate(`document.querySelector('#workspace').hidden && !__authFixture.calls.some(c=>c.path==='/rest/v1/articles')`));
  }
  await reset('reset-fail');await evaluate(`document.querySelector('#email').value='owner@example.test';document.querySelector('#reset-request').click()`);await until(`!document.querySelector('#reset-request').disabled`);
  record(locale+'reset failure has no fake success',await evaluate(`document.querySelector('#admin-status').dataset.error==='true'`));
  await reset();await navigate(url+'?code=invalid&recovery=1');await until(`!document.querySelector('#login-form fieldset').disabled`);
  record(locale+'missing recovery verifier fails closed',await evaluate(`document.querySelector('#workspace').hidden && document.querySelector('#recovery-panel').hidden && location.search===''`));
  await reset();
  if(screenshotsDirectory){const shot=await connection.send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(screenshotsDirectory,locale?'tr-admin-configured-fixture.png':'admin-configured-fixture.png'),Buffer.from(shot.data,'base64'));}
 }
}
