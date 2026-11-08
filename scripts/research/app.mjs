import { createClient } from '@supabase/supabase-js';

// One client for every MESA account page (data-mode on #mesa-auth-panel) and for the
// benchmark research page, which has the request form and downloads instead.
const panel = document.querySelector('#mesa-auth-panel');
const config = JSON.parse(document.querySelector('#mesa-auth-config').textContent);
const status = panel.querySelector('#research-status');
const form = panel.querySelector('#account-form');
const accountLink = panel.querySelector('#research-account-link');
const request = panel.querySelector('#research-request');
const downloads = panel.querySelector('#research-downloads');
const mode = panel.dataset.mode || 'research';
const tr = document.documentElement.lang === 'tr';
const L = (en, turkish) => tr ? turkish : en;
const currentPage = new URL(location.pathname, location.origin);
const pageUrl = attribute => new URL(panel.dataset[attribute] || panel.dataset.accountHref, currentPage);
const dashboardUrl = pageUrl('accountHref');
const signInUrl = pageUrl('signInHref');
const newPasswordUrl = pageUrl('newPasswordHref');

// Consent texts are versioned so a stored agreement can be matched to the text that was shown.
const LEGAL_VERSION = '2026-11-08';
const pendingConsentKey = 'mesa-pending-consent';

// Share the MESA session across pages in this tab and the PKCE verifier across email tabs.
const sessionKey = 'mesa-benchmark-auth';
const storage = {
  getItem(key) {
    return key.endsWith('-code-verifier') ? localStorage.getItem(key) : sessionStorage.getItem(key);
  },
  setItem(key, value) {
    if (key.endsWith('-code-verifier')) localStorage.setItem(key, value);
    else if (key === sessionKey) {
      const saved = JSON.parse(value);
      delete saved.provider_token;
      delete saved.provider_refresh_token;
      sessionStorage.setItem(key, JSON.stringify(saved));
    } else sessionStorage.setItem(key, value);
  },
  removeItem(key) {
    if (key.endsWith('-code-verifier')) localStorage.removeItem(key);
    else sessionStorage.removeItem(key);
  }
};
const client = createClient(config.url, config.key, {
  auth: { flowType: 'pkce', detectSessionInUrl: false, storageKey: sessionKey, storage }
});
let userId;

const say = message => { status.textContent = message; };
const failure = () => say(L('The request could not be completed. Try again.', 'İşlem tamamlanamadı. Yeniden dene.'));
const buttons = () => panel.querySelectorAll('button');
const setBusy = busy => buttons().forEach(button => { button.disabled = busy; });
const strongEnough = value => value.length >= 8 && /\p{L}/u.test(value) && /\d/.test(value);

function consentRecord(marketing) {
  const now = new Date().toISOString();
  return {
    terms_version: LEGAL_VERSION, terms_accepted_at: now, privacy_version: LEGAL_VERSION,
    marketing_opt_in: Boolean(marketing), marketing_updated_at: now
  };
}

function authMessage(error) {
  const code = error?.code;
  if (code === 'email_not_confirmed') return L('Confirm your email address before signing in. Check your inbox.', 'Giriş yapmadan önce e-posta adresini doğrula. Gelen kutunu kontrol et.');
  if (code === 'invalid_credentials') return L('The email address or password is not correct.', 'E-posta adresi veya şifre hatalı.');
  if (code === 'weak_password') return L('Choose a stronger password: at least 8 characters with a letter and a number.', 'Daha güçlü bir şifre seç: en az 8 karakter, harf ve rakam içersin.');
  if (code === 'same_password') return L('Choose a password different from the old one.', 'Eskisinden farklı bir şifre seç.');
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit') return L('Too many attempts. Wait a few minutes and try again.', 'Çok fazla deneme yapıldı. Birkaç dakika bekleyip yeniden dene.');
  if (code === 'user_already_exists' || code === 'email_exists') return L('An account with this email may already exist. Try signing in.', 'Bu e-postayla bir hesap olabilir. Giriş yapmayı dene.');
  return null;
}

// ---- Research page (benchmark/research/) ----------------------------------------
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
  say(messages[state] ?? L('Tell us how you plan to use the data.', 'Veriyi ne amaçla kullanacağını anlat.'));
}

request?.addEventListener('submit', async event => {
  event.preventDefault();
  const button = request.querySelector('button');
  button.disabled = true;
  try {
    const purpose = request.elements.purpose.value.trim();
    if (purpose.length < 20) {
      say(L('Enter at least 20 characters.', 'En az 20 karakter yaz.'));
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
      say(L('The package could not be downloaded. Check your access and try again.',
        'Paket indirilemedi. Erişimini kontrol edip yeniden dene.'));
    } finally {
      button.disabled = false;
    }
  });
}

// ---- Sign in / sign up with Google or GitHub ------------------------------------
for (const button of panel.querySelectorAll('button[data-provider]')) {
  button.addEventListener('click', async () => {
    const terms = document.querySelector('#account-terms');
    if (terms && !terms.checked) {
      say(L('Accept the Terms of Use to continue.', 'Devam etmek için Kullanım Koşulları’nı kabul et.'));
      terms.focus();
      return;
    }
    if (terms) {
      // Saved until the first signed-in page load, then written to the account.
      localStorage.setItem(pendingConsentKey, JSON.stringify(consentRecord(document.querySelector('#account-marketing')?.checked)));
    }
    setBusy(true);
    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: button.dataset.provider, options: { redirectTo: dashboardUrl.href }
      });
      if (error) throw error;
    } catch {
      failure();
      setBusy(false);
    }
  });
}

// ---- Email forms -----------------------------------------------------------------
function matchPasswords() {
  const password = form.elements.password.value;
  if (!strongEnough(password)) return L('Use at least 8 characters with a letter and a number.', 'En az 8 karakter kullan; harf ve rakam içersin.');
  if (form.elements.confirm && password !== form.elements.confirm.value) return L('The passwords do not match.', 'Şifreler eşleşmiyor.');
  return null;
}

form?.addEventListener('submit', async event => {
  event.preventDefault();
  const email = form.elements.email?.value.trim();
  if (form.elements.email && !form.elements.email.checkValidity()) {
    say(L('Enter a valid email address.', 'Geçerli bir e-posta adresi yaz.'));
    return;
  }
  if (mode === 'sign-up' || mode === 'new-password') {
    const problem = matchPasswords();
    if (problem) { say(problem); return; }
  }
  if (mode === 'sign-up' && !form.elements.terms.checked) {
    say(L('Accept the Terms of Use to create an account.', 'Hesap oluşturmak için Kullanım Koşulları’nı kabul et.'));
    return;
  }
  setBusy(true);
  try {
    if (mode === 'sign-in') {
      const { error } = await client.auth.signInWithPassword({ email, password: form.elements.password.value });
      if (error) throw error;
      location.replace(dashboardUrl.href);
      return;
    }
    if (mode === 'sign-up') {
      const { data, error } = await client.auth.signUp({
        email, password: form.elements.password.value,
        options: { emailRedirectTo: dashboardUrl.href, data: consentRecord(form.elements.marketing.checked) }
      });
      if (error) throw error;
      if (data.session) { location.replace(dashboardUrl.href); return; }
      form.hidden = true;
      say(L(`Almost done. We sent a confirmation link to ${email}. Open it to activate your account.`,
        `Neredeyse bitti. ${email} adresine bir doğrulama bağlantısı gönderdik. Hesabını etkinleştirmek için bağlantıyı aç.`));
      return;
    }
    if (mode === 'reset') {
      const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: newPasswordUrl.href });
      if (error && !['user_not_found'].includes(error.code)) throw error;
      form.hidden = true;
      // Same message whether or not the address has an account.
      say(L(`If an account exists for ${email}, a reset link is on its way. The link works in this browser.`,
        `${email} için bir hesap varsa sıfırlama bağlantısı yolda. Bağlantı bu tarayıcıda çalışır.`));
      return;
    }
    if (mode === 'new-password') {
      const { error } = await client.auth.updateUser({ password: form.elements.password.value });
      if (error) throw error;
      form.hidden = true;
      say(L('Your password has been changed. Taking you to your account…', 'Şifren değiştirildi. Hesabına yönlendiriliyorsun…'));
      setTimeout(() => location.replace(dashboardUrl.href), 1200);
    }
  } catch (error) {
    say(authMessage(error) ?? L('The request could not be completed. Try again.', 'İşlem tamamlanamadı. Yeniden dene.'));
  } finally {
    setBusy(false);
  }
});

// ---- Dashboard -------------------------------------------------------------------
async function showDashboard(user) {
  userId = user.id;
  const pending = localStorage.getItem(pendingConsentKey);
  if (pending) {
    localStorage.removeItem(pendingConsentKey);
    if (!user.user_metadata?.terms_accepted_at) {
      const { data } = await client.auth.updateUser({ data: JSON.parse(pending) });
      if (data?.user) user = data.user;
    }
  }
  const dashboard = panel.querySelector('#account-dashboard');
  dashboard.hidden = false;
  panel.querySelector('#account-email').textContent = user.email ?? '';
  say('');
  const toggle = panel.querySelector('#account-marketing-toggle');
  toggle.checked = Boolean(user.user_metadata?.marketing_opt_in);
  toggle.addEventListener('change', async () => {
    toggle.disabled = true;
    const { error } = await client.auth.updateUser({ data: { marketing_opt_in: toggle.checked, marketing_updated_at: new Date().toISOString() } });
    toggle.disabled = false;
    if (error) { toggle.checked = !toggle.checked; failure(); return; }
    say(toggle.checked ? L('You will receive MESA news by email.', 'MESA haberleri e-postana gelecek.')
      : L('You will no longer receive MESA news by email.', 'Artık MESA haberleri e-postana gelmeyecek.'));
  });
  panel.querySelector('#account-logout').addEventListener('click', async () => {
    setBusy(true);
    try {
      const { error } = await client.auth.signOut({ scope: 'local' });
      if (error) throw error;
      location.replace(signInUrl.href);
    } catch {
      failure();
      setBusy(false);
    }
  });
}

// ---- Start -----------------------------------------------------------------------
async function start() {
  const params = new URL(location.href).searchParams;
  const code = params.get('code');
  const redirectError = params.has('error') || params.has('error_code');
  if (code || redirectError) history.replaceState(null, '', currentPage);
  if (redirectError) {
    say(mode === 'new-password'
      ? L('This reset link has expired or was already used.', 'Bu sıfırlama bağlantısının süresi dolmuş ya da daha önce kullanılmış.')
      : L('Sign-in or email confirmation did not finish. Try again.', 'Giriş veya e-posta doğrulaması tamamlanamadı. Yeniden dene.'));
    panel.querySelector('#account-reset-again')?.removeAttribute('hidden');
    return;
  }
  try {
    let user;
    if (code) {
      const flowId = params.get('sb_flow_id');
      const { data, error } = await client.auth.exchangeCodeForSession(code, flowId ? { flowId } : undefined);
      if (error || !data.user) throw error ?? new Error('No authenticated user');
      user = data.user;
    } else {
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      user = data.session?.user;
    }

    if (mode === 'dashboard') {
      if (!user) { location.replace(signInUrl.href); return; }
      await showDashboard(user);
    } else if (mode === 'new-password') {
      if (!user) {
        say(L('Open this page from the link in your reset email, in the same browser where you asked for it.',
          'Bu sayfayı, sıfırlamayı istediğin tarayıcıda, e-postadaki bağlantıdan aç.'));
        panel.querySelector('#account-reset-again').hidden = false;
        return;
      }
      say('');
      form.hidden = false;
    } else if (mode === 'sign-in' || mode === 'sign-up') {
      if (user) location.replace(dashboardUrl.href);
    } else if (mode === 'research') {
      if (user) {
        userId = user.id;
        if (accountLink) accountLink.hidden = true;
        if (request) await showRequest();
      } else {
        say(L('Sign in to request research access.', 'Araştırma erişimi talep etmek için giriş yap.'));
      }
    }
  } catch (error) {
    if (error?.code === 'pkce_code_verifier_not_found') {
      say(mode === 'new-password'
        ? L('Open the reset link in the same browser where you asked for it, or request a new one.', 'Sıfırlama bağlantısını istediğin tarayıcıda aç ya da yeni bir bağlantı iste.')
        : L('If you have confirmed your email address, sign in with your password.', 'E-posta adresini doğruladıysan şifrenle giriş yap.'));
      panel.querySelector('#account-reset-again')?.removeAttribute('hidden');
    } else {
      failure();
    }
  }
}
start();
