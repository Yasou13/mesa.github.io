import { navigationIcon } from './navigation_icons.mjs';

export function accountPage({ header, footer, language, base, providers }) {
  const L = (en, tr) => language === 'tr' ? tr : en;
  const social = providers.some(provider => provider !== 'email');
  return `${header}<main id="main-content" class="account-page">
    <section class="account-shell" aria-labelledby="account-title">
      <div class="account-intro">
        <p class="eyebrow">MESA</p>
        <h1 id="account-title">${L('Your MESA account', 'MESA hesabın')}</h1>
        <p>${L('Sign in or create an account to use MESA services on this website.', 'Bu sitedeki MESA hizmetlerini kullanmak için giriş yap veya hesap oluştur.')}</p>
      </div>
      ${providers.length ? `<div id="mesa-auth-panel" data-account-href="./" class="account-card">
        <h2 class="account-card-title" id="sign-up">${L('Account access', 'Hesaba erişim')}</h2>
        <p id="research-status" class="account-status" role="status">${L('Checking your session…', 'Oturumun kontrol ediliyor…')}</p>
        <div id="research-login" hidden>
          ${social ? `<div class="account-providers">
            ${providers.includes('google') ? `<button class="account-provider account-provider--google" type="button" data-provider="google"><span class="account-google-mark" aria-hidden="true"></span>${L('Continue with Google', 'Google ile devam et')}</button>` : ''}
            ${providers.includes('github') ? `<button class="account-provider" type="button" data-provider="github">${navigationIcon('github')}${L('Continue with GitHub', 'GitHub ile devam et')}</button>` : ''}
          </div>` : ''}
          ${providers.includes('email') ? `
          ${social ? `<p class="account-divider">${L('or use email', 'veya e-posta kullan')}</p>` : ''}
          <form id="research-email" method="post" aria-label="${L('Email sign-in and registration', 'E-posta ile giriş ve kayıt')}">
            <label for="research-email-address">${L('Email', 'E-posta')}</label>
            <input id="research-email-address" name="email" type="email" autocomplete="username" required>
            <label for="research-password">${L('Password', 'Şifre')}</label>
            <input id="research-password" name="password" type="password" autocomplete="current-password" aria-describedby="research-password-hint" required>
            <p id="research-password-hint" class="account-muted" hidden>${L('Use at least 8 characters for a new password.', 'Yeni şifren en az 8 karakter olsun.')}</p>
            <button class="button primary account-submit" type="submit">${L('Sign in', 'Giriş yap')}</button>
            <button class="account-switch" type="button" id="research-email-mode">${L('Create an account', 'Hesap oluştur')}</button>
          </form>` : ''}
        </div>
        <div id="account-summary" hidden>
          <p id="account-email" class="account-email"></p>
          <button class="button secondary" id="research-logout" type="button">${L('Sign out', 'Çıkış yap')}</button>
        </div>
        <a class="account-privacy" href="${base}privacy/#account">${L('Privacy notice', 'Gizlilik bildirimi')}</a>
      </div>` : `<div class="account-card"><h2 class="account-card-title" id="sign-up">${L('Account access', 'Hesaba erişim')}</h2>
        <p class="account-muted">${L('Account services are currently unavailable.', 'Hesap hizmetleri şu anda kullanılamıyor.')}</p></div>`}
    </section>
  </main>${footer}`;
}
