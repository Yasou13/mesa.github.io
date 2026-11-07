import { createClient } from '@supabase/supabase-js';

const panel = document.querySelector('#benchmark-research-panel');
const config = JSON.parse(document.querySelector('#benchmark-research-config').textContent);
const status = panel.querySelector('#research-status');
const login = panel.querySelector('#research-login');
const logout = panel.querySelector('#research-logout');
const request = panel.querySelector('#research-request');
const downloads = panel.querySelector('#research-downloads');
const tr = document.documentElement.lang === 'tr';
const L = (en, turkish) => tr ? turkish : en;
const callback = new URL(location.pathname, location.origin);

// Keep the MESA session in memory. Only the one-use verifier crosses the OAuth redirect.
const session = new Map();
const storage = {
  getItem(key) {
    return key.endsWith('-code-verifier') ? sessionStorage.getItem(key) : session.get(key) ?? null;
  },
  setItem(key, value) {
    if (key.endsWith('-code-verifier')) sessionStorage.setItem(key, value);
    else session.set(key, value);
  },
  removeItem(key) {
    if (key.endsWith('-code-verifier')) sessionStorage.removeItem(key);
    else session.delete(key);
  }
};
const client = createClient(config.url, config.key, {
  auth: { flowType: 'pkce', detectSessionInUrl: false, storageKey: 'mesa-benchmark-auth', storage }
});
let userId;

const failure = () => {
  status.textContent = L('The request could not be completed. Try again.', 'İşlem tamamlanamadı. Yeniden dene.');
};

async function showRequest() {
  const { data, error } = await client.from('benchmark_research_requests')
    .select('status').eq('user_id', userId).maybeSingle();
  if (error) throw error;
  const state = data?.status;
  request.hidden = Boolean(state);
  downloads.hidden = state !== 'approved';
  const messages = {
    pending: L('Your request is under review.', 'Talebin incelemede.'),
    approved: L('Your access is approved. Select a data tier.', 'Erişimin onaylandı. Bir veri katmanı seç.'),
    declined: L('Your request was declined.', 'Talebin reddedildi.'),
    revoked: L('Your download access has been withdrawn.', 'İndirme erişimin geri alındı.')
  };
  status.textContent = messages[state] ?? L('Tell us how you plan to use the data.', 'Veriyi ne amaçla kullanacağını anlat.');
}

login.addEventListener('click', async () => {
  login.disabled = true;
  try {
    const { error } = await client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: callback.href } });
    if (error) throw error;
  } catch {
    failure();
    login.disabled = false;
  }
});

logout.addEventListener('click', async () => {
  logout.disabled = true;
  try {
    const { error } = await client.auth.signOut({ scope: 'local' });
    if (error) throw error;
    location.replace(callback.href);
  } catch {
    failure();
    logout.disabled = false;
  }
});

request.addEventListener('submit', async event => {
  event.preventDefault();
  const button = request.querySelector('button');
  button.disabled = true;
  try {
    const purpose = request.elements.purpose.value.trim();
    if (purpose.length < 20) {
      status.textContent = L('Enter at least 20 characters.', 'En az 20 karakter yaz.');
      return;
    }
    const { error } = await client.from('benchmark_research_requests').insert({ purpose });
    if (error && error.code !== '23505') throw error;
    await showRequest();
    request.reset();
  } catch {
    failure();
  } finally {
    button.disabled = false;
  }
});

for (const button of downloads.querySelectorAll('button[data-tier]')) {
  button.addEventListener('click', async () => {
    button.disabled = true;
    try {
      const filename = `mesa-legal-v1-${button.dataset.tier.toLowerCase()}.tar.gz`;
      const { data, error } = await client.storage.from('benchmark-research').download(`v1/${filename}`);
      if (error) {
        await showRequest();
        throw error;
      }
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      status.textContent = L('The package could not be downloaded. Check your access and try again.',
        'Paket indirilemedi. Erişimini kontrol edip yeniden dene.');
    } finally {
      button.disabled = false;
    }
  });
}

async function start() {
  const params = new URL(location.href).searchParams;
  const code = params.get('code');
  if (!code) {
    login.hidden = false;
    status.textContent = params.has('error')
      ? L('Google sign-in was interrupted. Try again.', 'Google ile giriş yarıda kaldı. Yeniden dene.')
      : L('Sign in to request research access.', 'Araştırma erişimi istemek için giriş yap.');
    if (params.has('error')) history.replaceState(null, '', callback);
    return;
  }
  try {
    const { data, error } = await client.auth.exchangeCodeForSession(code);
    if (error || !data.user) throw error ?? new Error('No authenticated user');
    userId = data.user.id;
    logout.hidden = false;
    await showRequest();
  } catch {
    login.hidden = Boolean(userId);
    failure();
  } finally {
    history.replaceState(null, '', callback);
  }
}
start();
