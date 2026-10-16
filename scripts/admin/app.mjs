import { createClient } from '@supabase/supabase-js';
import { AdminService } from './service.mjs';

const config = JSON.parse(document.getElementById('admin-config').textContent);
const tr = document.documentElement.lang === 'tr';
const t = (en, turkish) => tr ? turkish : en;
const $ = id => document.getElementById(id);
const status = (message, error = false) => { $('admin-status').textContent = message; $('admin-status').dataset.error = String(error); };
const errors = {
  SESSION:t('Your session is unavailable or expired. Sign in again.','Oturum kullanılamıyor veya süresi dolmuş. Tekrar giriş yapın.'),
  ROLE:t('This account has no administrator access.','Bu hesabın yönetici erişimi yok.'),
  DATA:t('Records could not be loaded. Check the connection and database setup.','Kayıtlar yüklenemedi. Bağlantıyı ve veritabanı kurulumunu kontrol edin.'),
  CONFLICT:t('The draft changed or access was denied. Reload it before saving again.','Taslak değişmiş veya erişim reddedilmiş. Yeniden kaydetmeden önce yükleyin.'),
  PUBLISHED:t('Published articles are read-only.','Yayımlanmış makaleler salt okunurdur.')
};

if (config) {
  const storageKey = 'mesa-admin-' + new URL(config.url).host;
  let storage;
  try { sessionStorage.setItem('mesa-storage-check','1'); sessionStorage.removeItem('mesa-storage-check'); storage = sessionStorage; } catch {}
  if (!storage) {
    status(t('Session storage is unavailable. Allow storage in this browser to sign in.','Oturum depolaması kullanılamıyor. Giriş için tarayıcı depolamasına izin verin.'), true);
  } else {
    const hadStoredSession = !!storage.getItem(storageKey);
    const client = createClient(config.url, config.key, { auth: { storage, storageKey, persistSession:true, autoRefreshToken:true, detectSessionInUrl:true, flowType:'pkce' } });
    const service = new AdminService(client);
    let article = null, generation = 0, syncId = 0, expiryTimer, signingOut = false;
    const query = new URLSearchParams(location.search);
    let recovery = storage.getItem(storageKey+'-recovery') === '1' || (query.get('recovery') === '1' && query.has('code'));
    const stripCallback = () => { if (location.search || location.hash) history.replaceState(null,'',location.pathname); };
    function lock() {
      generation++; clearTimeout(expiryTimer); article = null;
      $('workspace').hidden = true; $('recovery-panel').hidden = true; $('login-panel').hidden = false;
      $('records').replaceChildren(); $('editor').reset(); $('editor').hidden = true;
      $('login-form').elements.password.value = '';
      $('login-form').querySelector('fieldset').disabled = false; $('reset-request').disabled = false;
    }
    function clearCredentials() {
      for (const key of Object.keys(storage)) if (key.startsWith(storageKey)) storage.removeItem(key);
    }
    async function rejectAccess(error) {
      lock();
      if (error.message === 'ROLE') {
        signingOut = true; ++syncId;
        try { await client.auth.signOut({scope:'local'}); } finally { clearCredentials(); signingOut = false; }
      }
      report(error);
    }
    function report(error) { status(errors[error.message] || t('The request failed. Please try again.','İstek başarısız oldu. Lütfen tekrar deneyin.'), true); }
    async function action(button, task) {
      button.disabled = true; button.setAttribute('aria-busy','true');
      status(t('Working…','İşlem sürüyor…'));
      try { await task(); } catch (error) { if (['SESSION','ROLE'].includes(error.message)) await rejectAccess(error); else report(error); }
      finally { button.disabled = false; button.removeAttribute('aria-busy'); }
    }
    async function records(table='articles') {
      const active = generation;
      const rows = table === 'articles' ? await service.listArticles() : await service.listRecords(table);
      if (active !== generation) return;
      $('records').replaceChildren(); $('editor').hidden = true; article = null;
      if (!rows.length) { const p=document.createElement('p');p.textContent=t('No records found.','Kayıt bulunamadı.');$('records').append(p); }
      for (const row of rows) {
        const node = document.createElement(table === 'articles' ? 'button' : 'p');
        node.textContent = table === 'articles' ? `${row.title} · ${row.language.toUpperCase()} · ${row.status}` : table === 'media_assets' ? `${row.filename} · ${row.mime_type} · ${row.file_size_bytes} B` : `${row.id} · ${row.status}`;
        if (table === 'articles') {
          node.type='button'; node.addEventListener('click',()=>action(node,async()=>{
            const requestGeneration=generation;
            const loaded=await service.loadArticle(row.id);
            if (requestGeneration !== generation) return;
            article=loaded; $('article-title').value=article.title; $('article-summary').value=article.summary; $('article-body').value=article.body_markdown;
            $('editor').hidden=false; $('editor').querySelector('fieldset').disabled=!['draft','ready'].includes(article.status);
            status(t('Article loaded from the database.','Makale veritabanından yüklendi.')); $('article-title').focus();
          }));
        }
        $('records').append(node);
      }
      status(t('Administrator access verified. Records loaded from the database.','Yönetici erişimi doğrulandı. Kayıtlar veritabanından yüklendi.'));
    }
    async function synchronize() {
      if (signingOut) return;
      const request = ++syncId;
      const {data:{session},error} = await client.auth.getSession();
      if (request !== syncId) return;
      if (error || !session || session.expires_at * 1000 <= Date.now()) { lock(); const expired = !!error || hadStoredSession || query.has('code'); status(expired ? errors.SESSION : t('Sign in with your administrator account.','Yönetici hesabınızla giriş yapın.'),expired); stripCallback(); return; }
      try {
        // Never trust a locally stored role or user object to unlock the workspace.
        await service.authorize();
        if (request !== syncId) return;
        clearTimeout(expiryTimer);
        expiryTimer = setTimeout(()=>{lock();status(errors.SESSION,true);},Math.max(0,session.expires_at*1000-Date.now()));
        $('login-panel').hidden=true;
        if (recovery) {
          storage.setItem(storageKey+'-recovery','1'); $('workspace').hidden=true;
          $('recovery-panel').hidden=false; $('recovery-form').querySelector('fieldset').disabled=false;
          status(t('Recovery session verified. Choose a new password.','Kurtarma oturumu doğrulandı. Yeni parola belirleyin.'));
        } else {
          const newlyOpened=$('workspace').hidden; $('workspace').hidden=false; $('recovery-panel').hidden=true;
          if (newlyOpened) await records();
        }
      } catch(error) { if (request === syncId) await rejectAccess(error); }
      stripCallback();
    }
    client.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') recovery=true;
      if (event === 'SIGNED_OUT') { ++syncId; lock(); }
      else setTimeout(()=>synchronize().catch(report),0);
    });
    $('login-form').addEventListener('submit',event=>{
      event.preventDefault(); const form=event.currentTarget;
      action(form.querySelector('button'),async()=>{
        const password=form.elements.password.value; form.elements.password.value='';
        const {error}=await client.auth.signInWithPassword({email:form.elements.email.value.trim(),password});
        if (error) { lock();status(t('Sign-in failed. Check your credentials or try again later.','Giriş başarısız. Bilgilerinizi kontrol edin veya daha sonra deneyin.'),true);return; }
        recovery=false;storage.removeItem(storageKey+'-recovery');await synchronize();
      });
    });
    $('reset-request').addEventListener('click',event=>{
      const email=$('email');if(!email.reportValidity())return;
      action(event.currentTarget,async()=>{
        const redirect=new URL(location.pathname,location.origin);redirect.searchParams.set('recovery','1');
        const {error}=await client.auth.resetPasswordForEmail(email.value.trim(),{redirectTo:redirect.href});
        if(error)throw error;
        status(t('If the account is eligible, a reset email has been sent. Open it in this browser.','Hesap uygunsa sıfırlama e-postası gönderildi. Bağlantıyı bu tarayıcıda açın.'));
      });
    });
    async function logout() {
      signingOut = true; ++syncId;lock();recovery=false;storage.removeItem(storageKey+'-recovery');
      const {error}=await client.auth.signOut();
      // Even a network failure must remove this tab's credentials and private data.
      clearCredentials();
      ++syncId; lock(); signingOut = false;
      if(error) { status(t('Local session cleared. Server revocation could not be confirmed.','Yerel oturum temizlendi. Sunucuda iptal doğrulanamadı.'),true); }
      else status(t('Signed out.','Çıkış yapıldı.'));
    }
    $('logout').addEventListener('click',event=>action(event.currentTarget,logout));
    $('recovery-form').addEventListener('submit',event=>{
      event.preventDefault(); const password=$('new-password').value;
      if(password.length<12 || password !== $('confirm-password').value) {status(t('Use matching passwords with at least 12 characters.','En az 12 karakterli, birbiriyle aynı parolalar kullanın.'),true);return;}
      action(event.currentTarget.querySelector('button'),async()=>{
        await service.authorize(); const {error}=await client.auth.updateUser({password});if(error)throw error;
        $('recovery-form').reset();await logout();
      });
    });
    document.querySelectorAll('[data-records]').forEach(button=>button.addEventListener('click',()=>action(button,()=>records(button.dataset.records))));
    $('editor').addEventListener('submit',event=>{
      event.preventDefault();action(event.currentTarget.querySelector('button'),async()=>{
        const active=generation, current=article;
        if(!current)throw new Error('DATA');
        const saved=await service.saveDraft(current,{title:$('article-title').value,summary:$('article-summary').value,body_markdown:$('article-body').value});
        if(active!==generation)return; article={...current,updated_at:saved.updated_at};
        status(t('Draft saved to the database. It has not been published.','Taslak veritabanına kaydedildi. Yayımlanmadı.'));
      });
    });
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)synchronize().catch(report);});
    // Detect revoked roles while the workspace is open; backend RLS applies immediately.
    setInterval(()=>{if(!document.hidden && !$('workspace').hidden)synchronize().catch(report);},60000);
    synchronize().catch(report);
  }
}
