// MESA account pages: sign in, sign up, password reset, new password and the signed-in
// dashboard. One client bundle (scripts/research/app.mjs) drives all of them through
// data-mode on #mesa-auth-panel. Rendered per language.
import { navigationIcon } from './navigation_icons.mjs';

export const ACCOUNT_MODES = ['dashboard', 'sign-in', 'sign-up', 'reset', 'new-password'];

export function accountPage({ header, footer, language, base, providers, mode = 'dashboard' }) {
  const L = (en, tr) => language === 'tr' ? tr : en;
  const href = path => `${base}${path}`;
  const social = providers.filter(provider => provider !== 'email');
  const email = providers.includes('email');
  const passwordRules = L('At least 8 characters, with a letter and a number.', 'En az 8 karakter; harf ve rakam içersin.');

  const intro = {
    dashboard: [L('Your MESA account', 'MESA hesabın'), L('Your MESA account opens the benchmark data, early access and future MESA services.', 'MESA hesabın; benchmark verilerine, erken erişime ve gelecekteki MESA hizmetlerine açılan kapındır.')],
    'sign-in': [L('Sign in to MESA', 'MESA’ya giriş yap'), L('Welcome back. Sign in to reach your account, benchmark data and early access.', 'Tekrar hoş geldin. Hesabına, benchmark verilerine ve erken erişime ulaşmak için giriş yap.')],
    'sign-up': [L('Create your MESA account', 'MESA hesabını oluştur'), L('One account for the benchmark data, early access and MESA updates.', 'Benchmark verileri, erken erişim ve MESA gelişmeleri için tek hesap.')],
    reset: [L('Reset your password', 'Şifreni sıfırla'), L('Enter the email address of your account. We will send you a link to choose a new password.', 'Hesabının e-posta adresini yaz. Yeni şifre belirlemen için bir bağlantı gönderelim.')],
    'new-password': [L('Choose a new password', 'Yeni şifreni belirle'), L('Set a new password for your MESA account.', 'MESA hesabın için yeni bir şifre belirle.')]
  }[mode];

  const providerButtons = social.length ? `<div class="account-providers">
      ${social.includes('google') ? `<button class="account-provider account-provider--google" type="button" data-provider="google"><span class="account-google-mark" aria-hidden="true"></span>${L('Continue with Google', 'Google ile devam et')}</button>` : ''}
      ${social.includes('github') ? `<button class="account-provider account-provider--github" type="button" data-provider="github">${navigationIcon('github')}${L('Continue with GitHub', 'GitHub ile devam et')}</button>` : ''}
    </div>${email ? `<p class="account-divider">${L('or with email', 'veya e-postayla')}</p>` : ''}` : '';

  const consent = `<fieldset class="account-consents">
      <legend class="sr-only">${L('Agreements', 'Onaylar')}</legend>
      <label class="account-check"><input type="checkbox" name="terms" id="account-terms" required>
        <span>${L(`I accept the <a href="${href('legal/terms/')}">Terms of Use</a> and have read the <a href="${href('legal/kvkk/')}">KVKK Information Notice</a> and <a href="${href('privacy/')}">Privacy Policy</a>.`,
          `<a href="${href('legal/terms/')}">Kullanım Koşulları</a>’nı kabul ediyorum; <a href="${href('legal/kvkk/')}">KVKK Aydınlatma Metni</a>’ni ve <a href="${href('privacy/')}">Gizlilik Politikası</a>’nı okudum.`)}</span></label>
      <label class="account-check"><input type="checkbox" name="marketing" id="account-marketing">
        <span>${L(`Optional: send me MESA news and product updates by email, as described in the <a href="${href('legal/commercial-messages/')}">commercial message consent</a>. I can opt out at any time.`,
          `İsteğe bağlı: <a href="${href('legal/commercial-messages/')}">Ticari Elektronik İleti Onay Metni</a> kapsamında MESA haberleri ve ürün güncellemeleri e-postayla gönderilsin. Dilediğim zaman vazgeçebilirim.`)}</span></label>
    </fieldset>`;

  const forms = {
    'sign-in': `${providerButtons}${email ? `<form id="account-form" method="post" novalidate>
        <label for="account-email-input">${L('Email', 'E-posta')}</label>
        <input id="account-email-input" name="email" type="email" autocomplete="email" required>
        <div class="account-label-row"><label for="account-password">${L('Password', 'Şifre')}</label><a href="${href('account/reset-password/')}">${L('Forgot password?', 'Şifremi unuttum')}</a></div>
        <input id="account-password" name="password" type="password" autocomplete="current-password" required>
        <button class="button primary account-submit" type="submit">${L('Sign in', 'Giriş yap')}</button>
      </form>` : ''}
      <p class="account-alt">${L('New to MESA?', 'MESA’da yeni misin?')} <a href="${href('account/sign-up/')}">${L('Create an account', 'Hesap oluştur')}</a></p>`,
    'sign-up': `${email ? `<form id="account-form" method="post" novalidate>
        <label for="account-email-input">${L('Email', 'E-posta')}</label>
        <input id="account-email-input" name="email" type="email" autocomplete="email" required>
        <label for="account-password">${L('Password', 'Şifre')}</label>
        <input id="account-password" name="password" type="password" autocomplete="new-password" minlength="8" aria-describedby="account-password-rules" required>
        <p id="account-password-rules" class="account-muted">${passwordRules}</p>
        <label for="account-password-confirm">${L('Repeat password', 'Şifre tekrarı')}</label>
        <input id="account-password-confirm" name="confirm" type="password" autocomplete="new-password" minlength="8" required>
        ${consent}
        <button class="button primary account-submit" type="submit">${L('Create account', 'Hesap oluştur')}</button>
      </form>` : consent}
      ${social.length ? `${email ? `<p class="account-divider">${L('or', 'veya')}</p>` : ''}<div class="account-providers">
        ${social.includes('google') ? `<button class="account-provider account-provider--google" type="button" data-provider="google"><span class="account-google-mark" aria-hidden="true"></span>${L('Sign up with Google', 'Google ile kayıt ol')}</button>` : ''}
        ${social.includes('github') ? `<button class="account-provider account-provider--github" type="button" data-provider="github">${navigationIcon('github')}${L('Sign up with GitHub', 'GitHub ile kayıt ol')}</button>` : ''}
      </div><p class="account-muted account-small">${L('Google and GitHub sign-up also need the first box above.', 'Google ve GitHub ile kayıtta da yukarıdaki ilk kutunun işaretlenmesi gerekir.')}</p>` : ''}
      <p class="account-alt">${L('Already have an account?', 'Zaten hesabın var mı?')} <a href="${href('account/sign-in/')}">${L('Sign in', 'Giriş yap')}</a></p>`,
    reset: `<form id="account-form" method="post" novalidate>
        <label for="account-email-input">${L('Email', 'E-posta')}</label>
        <input id="account-email-input" name="email" type="email" autocomplete="email" required>
        <button class="button primary account-submit" type="submit">${L('Send reset link', 'Sıfırlama bağlantısı gönder')}</button>
      </form>
      <p class="account-alt"><a href="${href('account/sign-in/')}">${L('Back to sign-in', 'Girişe dön')}</a></p>`,
    'new-password': `<form id="account-form" method="post" novalidate hidden>
        <label for="account-password">${L('New password', 'Yeni şifre')}</label>
        <input id="account-password" name="password" type="password" autocomplete="new-password" minlength="8" aria-describedby="account-password-rules" required>
        <p id="account-password-rules" class="account-muted">${passwordRules}</p>
        <label for="account-password-confirm">${L('Repeat new password', 'Yeni şifre tekrarı')}</label>
        <input id="account-password-confirm" name="confirm" type="password" autocomplete="new-password" minlength="8" required>
        <button class="button primary account-submit" type="submit">${L('Save password', 'Şifreyi kaydet')}</button>
      </form>
      <p class="account-alt" id="account-reset-again" hidden><a href="${href('account/reset-password/')}">${L('Request a new link', 'Yeni bağlantı iste')}</a></p>`,
    dashboard: `<div id="account-dashboard" hidden>
        <p class="account-welcome">${L('Welcome to the MESA family', 'MESA ailesine hoş geldin')}</p>
        <p class="account-email" id="account-email"></p>
        <nav class="account-next" aria-label="${L('Where to go next', 'Buradan nereye')}">
          <a href="${href('benchmark/research/')}"><strong>${L('Benchmark data and examples', 'Benchmark verileri ve örnekler')}</strong><span>${L('Apply for research access and download the data packages.', 'Araştırma erişimine başvur, veri paketlerini indir.')}</span></a>
          <a href="${href('early-access/')}"><strong>${L('Early access', 'Erken erişim')}</strong><span>${L('Tell us what you want to build with MESA.', 'MESA ile ne yapmak istediğini anlat.')}</span></a>
          <a href="${href('get-started/')}"><strong>${L('Try MESA locally', 'MESA’yı yerelde dene')}</strong><span>${L('Install it and run your first search.', 'Kur ve ilk aramanı yap.')}</span></a>
          <a href="${href('docs/')}"><strong>${L('Documentation', 'Dokümantasyon')}</strong><span>${L('Guides, API and integrations.', 'Rehberler, API ve entegrasyonlar.')}</span></a>
        </nav>
        <section class="account-settings" aria-labelledby="account-settings-title">
          <h3 id="account-settings-title">${L('Account settings', 'Hesap ayarları')}</h3>
          <label class="account-check"><input type="checkbox" id="account-marketing-toggle">
            <span>${L('Email me MESA news and product updates.', 'MESA haberleri ve ürün güncellemeleri e-postayla gelsin.')} <a href="${href('legal/commercial-messages/')}">${L('Details', 'Ayrıntılar')}</a></span></label>
          <p class="account-muted account-small">${L(`To change your password, use <a href="${href('account/reset-password/')}">password reset</a>. To see or delete your data, follow the <a href="${href('legal/kvkk/#application')}">KVKK application</a> steps.`,
            `Şifreni değiştirmek için <a href="${href('account/reset-password/')}">şifre sıfırlamayı</a> kullan. Verilerini görmek veya sildirmek için <a href="${href('legal/kvkk/#application')}">KVKK başvurusu</a> adımlarını izle.`)}</p>
          <button class="button secondary" id="account-logout" type="button">${L('Sign out', 'Çıkış yap')}</button>
        </section>
      </div>`
  }[mode];

  const card = providers.length || mode === 'dashboard'
    ? `<div id="mesa-auth-panel" data-mode="${mode}" data-account-href="${href('account/')}" data-sign-in-href="${href('account/sign-in/')}" data-new-password-href="${href('account/new-password/')}" class="account-card">
        <h2 class="sr-only">${intro[0]}</h2>
        <p id="research-status" class="account-status" role="status" aria-live="polite">${mode === 'dashboard' || mode === 'new-password' ? L('Checking your session…', 'Oturumun kontrol ediliyor…') : ''}</p>
        ${forms}
      </div>`
    : `<div class="account-card"><h2 class="account-card-title">${L('Account access', 'Hesaba erişim')}</h2><p class="account-muted">${L('Account services are currently unavailable.', 'Hesap hizmetleri şu anda kullanılamıyor.')}</p></div>`;

  return `${header}<main id="main-content" class="account-page">
    <section class="account-shell account-shell--${mode}" aria-labelledby="account-title">
      <div class="account-intro">
        <p class="eyebrow">MESA</p>
        <h1 id="account-title">${intro[0]}</h1>
        <p>${intro[1]}</p>
        <p class="account-legal-links"><a href="${href('privacy/')}">${L('Privacy Policy', 'Gizlilik Politikası')}</a><a href="${href('legal/kvkk/')}">${L('KVKK Notice', 'KVKK Aydınlatma Metni')}</a><a href="${href('legal/terms/')}">${L('Terms of Use', 'Kullanım Koşulları')}</a></p>
      </div>
      ${card}
    </section>
  </main>${footer}`;
}
