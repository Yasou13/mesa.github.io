import { createClient } from '@supabase/supabase-js';

const panel = document.querySelector('#benchmark-research-panel');
const config = JSON.parse(document.querySelector('#benchmark-research-config').textContent);
const status = panel.querySelector('#research-status');
const login = panel.querySelector('#research-login');
const email = panel.querySelector('#research-email');
const logout = panel.querySelector('#research-logout');
const request = panel.querySelector('#research-request');
const downloads = panel.querySelector('#research-downloads');
const tr = document.documentElement.lang === 'tr';
const L = (en, turkish) => tr ? turkish : en;
const callback = new URL(location.pathname, location.origin);

// Keep the session in memory. The one-use verifier can cross tabs for email confirmation.
const session = new Map();
const storage = {
  getItem(key) {
    return key.endsWith('-code-verifier') ? localStorage.getItem(key) : session.get(key) ?? null;
  },
  setItem(key, value) {
    if (key.endsWith('-code-verifier')) localStorage.setItem(key, value);
    else session.set(key, value);
  },
  removeItem(key) {
    if (key.endsWith('-code-verifier')) localStorage.removeItem(key);
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

async function showAccount(user) {
  userId = user.id;
  login.hidden = true;
  logout.hidden = false;
  if (request) {
    await showRequest();
  } else {
    status.textContent = L('You are signed in. Research applications will open when the packages are ready.',
      'Oturum açtın. Araştırma paketleri hazır olduğunda başvurular açılacak.');
  }
}

const loginButtons = login.querySelectorAll('button');
const setLoginBusy = busy => loginButtons.forEach(button => { button.disabled = busy; });

for (const button of login.querySelectorAll('button[data-provider]')) {
  button.addEventListener('click', async () => {
    setLoginBusy(true);
    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: button.dataset.provider, options: { redirectTo: callback.href }
      });
      if (error) throw error;
    } catch {
      failure();
      setLoginBusy(false);
    }
  });
}

if (email) {
  const password = email.elements.password;
  const mode = email.querySelector('#research-email-mode');
  const submit = email.querySelector('button[type="submit"]');
  const hint = email.querySelector('#research-password-hint');
  let registering = false;
  mode.addEventListener('click', () => {
    registering = !registering;
    password.value = '';
    password.autocomplete = registering ? 'new-password' : 'current-password';
    if (registering) password.minLength = 8;
    else password.removeAttribute('minlength');
    hint.hidden = !registering;
    submit.textContent = registering ? L('Sign up', 'Kayıt ol') : L('Sign in', 'Giriş yap');
    mode.textContent = registering ? L('Back to sign-in', 'Girişe dön') : L('Create an account', 'Hesap oluştur');
    status.textContent = registering ? L('Create an account with your email address.', 'E-posta adresinle hesap oluştur.')
      : L('Sign in with your account.', 'Hesabınla giriş yap.');
  });

  email.addEventListener('submit', async event => {
    event.preventDefault();
    setLoginBusy(true);
    const credentials = { email: email.elements.email.value.trim(), password: password.value };
    try {
      const { data, error } = registering
        ? await client.auth.signUp({ ...credentials, options: { emailRedirectTo: callback.href } })
        : await client.auth.signInWithPassword(credentials);
      if (error) throw error;
      password.value = '';
      if (data.session && data.user) {
        await showAccount(data.user);
      } else {
        status.textContent = L('If registration succeeded, check your inbox for the confirmation link.',
          'Kayıt tamamlandıysa doğrulama bağlantısı için e-posta kutunu kontrol et.');
      }
    } catch (error) {
      if (error?.code === 'email_not_confirmed') {
        status.textContent = L('Confirm your email address before signing in.', 'Giriş yapmadan önce e-posta adresini doğrula.');
      } else if (error?.code === 'invalid_credentials') {
        status.textContent = L('Check your email address and password.', 'E-posta adresini ve şifreni kontrol et.');
      } else if (error?.code === 'weak_password') {
        status.textContent = L('Choose a stronger password.', 'Daha güçlü bir şifre seç.');
      } else {
        failure();
      }
    } finally {
      setLoginBusy(false);
    }
  });
}

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

request?.addEventListener('submit', async event => {
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

for (const button of downloads?.querySelectorAll('button[data-tier]') ?? []) {
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
  const redirectError = params.has('error') || params.has('error_code');
  if (!code) {
    login.hidden = false;
    status.textContent = redirectError
      ? L('Sign-in or email confirmation did not finish. Try again.', 'Giriş veya e-posta doğrulaması tamamlanamadı. Yeniden dene.')
      : L('Sign in with your account.', 'Hesabınla giriş yap.');
    if (redirectError) history.replaceState(null, '', callback);
    return;
  }
  try {
    const flowId = params.get('sb_flow_id');
    const { data, error } = await client.auth.exchangeCodeForSession(code, flowId ? { flowId } : undefined);
    if (error || !data.user) throw error ?? new Error('No authenticated user');
    await showAccount(data.user);
  } catch (error) {
    login.hidden = Boolean(userId);
    if (email && error?.code === 'pkce_code_verifier_not_found') {
      status.textContent = L('If you have confirmed your email address, sign in with your password.',
        'E-posta adresini doğruladıysan şifrenle giriş yap.');
    } else {
      failure();
    }
  } finally {
    history.replaceState(null, '', callback);
  }
}
start();
