// Privacy notice. Facts mirror docs/admin/EARLY_ACCESS.md and the Supabase migration.
import { productTranslations } from './render_product.mjs';
const t = (en, tr) => { productTranslations[en] = tr; return en; };

export function privacyPage({ header, footer, route }) {
  const section = (id, heading, body) => `<article id="${id}"><h2>${heading}</h2>${body}</article>`;
  const p = (en, tr) => `<p>${t(en, tr)}</p>`;
  const list = (items) => `<ul>${items.map(([en, tr]) => `<li>${t(en, tr)}</li>`).join('')}</ul>`;
  return `${header()}<main id="main-content" class="privacy-page">
    <section class="page-hero compact page-hero--short"><p class="eyebrow">${t('PRIVACY', 'GİZLİLİK')}</p><h1>${t('Privacy notice', 'Gizlilik bildirimi')}</h1>${p('What this website collects, why, and how to ask for it to be removed. Covers KVKK (Turkey) and GDPR (EU) information duties.', 'Bu sitenin hangi bilgileri neden topladığını ve silinmesini nasıl isteyebileceğinizi açıklar. KVKK ve GDPR kapsamındaki aydınlatma yükümlülüğünü karşılar.')}<p class="privacy-updated">${t('Last updated: 24 October 2026', 'Son güncelleme: 24 Ekim 2026')}</p></section>
    <section class="section privacy-body">
      ${section('summary', t('In short', 'Kısaca'), list([
        ['Reading the site does not require an account, and the site sets no cookies.', 'Siteyi okumak için hesap gerekmez; site çerez kullanmaz.'],
        ['Personal data is collected only when you submit the early access form.', 'Kişisel veri yalnızca erken erişim formunu gönderdiğinizde toplanır.'],
        ['Visit statistics come from Cloudflare Web Analytics, which is cookie-free and does not build visitor profiles.', 'Ziyaret istatistikleri, çerez kullanmayan ve ziyaretçi profili çıkarmayan Cloudflare Web Analytics ile tutulur.']
      ]))}
      ${section('controller', t('Who is responsible', 'Veri sorumlusu'), p('The MESA project is maintained by the Yasou13 GitHub account. That maintainer decides how early access requests are used and is the data controller for them.', 'MESA projesi Yasou13 GitHub hesabı tarafından sürdürülür. Erken erişim taleplerinin nasıl kullanılacağına bu proje sorumlusu karar verir ve bu veriler için veri sorumlusudur.'))}
      ${section('early-access', t('Early access form', 'Erken erişim formu'), `${list([
        ['Collected: email, your stated interest, your use case, and optionally an organization name and a public GitHub URL.', 'Toplananlar: e-posta, ilgi alanınız, kullanım amacınız; isteğe bağlı olarak kurum adı ve herkese açık GitHub adresi.'],
        ['Purpose: to review your request and contact you about MESA. You are not added to a newsletter.', 'Amaç: talebinizi değerlendirmek ve MESA hakkında sizinle iletişim kurmak. Bültene eklenmezsiniz.'],
        ['Legal basis: your explicit consent, given with the checkbox on the form (KVKK art. 5/1, GDPR art. 6(1)(a)).', 'Hukuki sebep: formdaki onay kutusuyla verdiğiniz açık rıza (KVKK m. 5/1, GDPR m. 6/1-a).'],
        ['Storage: a Supabase database. Only administrators can read requests; they never appear on the website, in search or on GitHub.', 'Saklama yeri: Supabase veritabanı. Talepleri yalnızca yöneticiler okuyabilir; sitede, aramada veya GitHub’da görünmez.'],
        ['Abuse protection: a one-way hash of your network address is kept for up to 48 hours to limit repeated submissions. The full address is not stored.', 'Kötüye kullanım koruması: tekrarlanan gönderimleri sınırlamak için ağ adresinizin tek yönlü özeti en fazla 48 saat tutulur. Tam adres saklanmaz.'],
        ['Retention: requests are kept until they are no longer needed for that request and are then deleted manually.', 'Saklama süresi: talepler, ilgili talep için gerekli olduğu sürece tutulur ve ardından elle silinir.']
      ])}`)}
      ${section('analytics', t('Analytics', 'İstatistik'), p('Cloudflare Web Analytics counts page views without cookies, local storage or fingerprinting. Aggregate numbers only; no cookie banner is required.', 'Cloudflare Web Analytics, sayfa görüntülemelerini çerez, yerel depolama veya parmak izi olmadan sayar. Yalnızca toplu sayılar tutulur; çerez bildirimi gerekmez.'))}
      ${section('transfers', t('Processors and transfers', 'Hizmet sağlayıcılar ve aktarım'), p('The site is hosted on GitHub Pages behind Cloudflare. Form data is stored by Supabase. These providers may process data outside Turkey and the EU under their own safeguards.', 'Site, Cloudflare arkasında GitHub Pages üzerinde barındırılır. Form verisi Supabase’de saklanır. Bu sağlayıcılar veriyi kendi güvenceleriyle Türkiye ve AB dışında işleyebilir.'))}
      ${section('rights', t('Your rights', 'Haklarınız'), `${p('You can ask what data is held about you, ask for it to be corrected or deleted, and withdraw consent at any time (KVKK art. 11, GDPR art. 15–21). Withdrawing consent does not affect processing that happened before.', 'Hakkınızda hangi verinin tutulduğunu öğrenebilir, düzeltilmesini veya silinmesini isteyebilir ve rızanızı her zaman geri alabilirsiniz (KVKK m. 11, GDPR m. 15–21). Rızanın geri alınması önceki işlemeyi etkilemez.')}${p('To make a request, contact the maintainer through the GitHub profile. Do not post personal data in a public issue.', 'Talepte bulunmak için proje sorumlusuna GitHub profili üzerinden ulaşın. Kişisel verilerinizi herkese açık bir issue’ya yazmayın.')}<p><a href="https://github.com/Yasou13" target="_blank" rel="noopener noreferrer">${t('Maintainer profile ↗', 'Proje sorumlusu profili ↗')}</a> · <a href="${route('early-access/')}">${t('Early access form →', 'Erken erişim formu →')}</a></p>`)}
    </section>${footer(true)}</main>`;
}
