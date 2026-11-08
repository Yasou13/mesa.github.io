// Legal pages: privacy policy, KVKK information notice (with the data-subject application),
// cookie policy, terms of use and commercial electronic message consent. Rendered per language.
// Turkish is the governing text; English is a translation.
//
// Owner checklist (not shown on the site):
// - Fill site-data.json "legal" (controller name, address, contact email, KEP, city). Until then the
//   pages show highlighted placeholders.
// - Confirm the cross-border transfer mechanism for Supabase, Cloudflare and GitHub under KVKK art. 9
//   (standard contract + notification to the Authority) and the Supabase region.
// - Register with İYS before sending any commercial email, and add an unsubscribe link to every message.
// - Have a lawyer review these texts; they are a careful draft, not legal advice.
export const LEGAL_VERSION = '2026-11-08';

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

export const LEGAL_PAGES = ['privacy', 'kvkk', 'cookies', 'terms', 'commercialMessages'];

export function legalPage(kind, { header, footer, language, base, legal = {} }) {
  const tr = language === 'tr';
  const L = (en, turkish) => tr ? turkish : en;
  const href = path => `${base}${path}`;
  const todo = label => `<mark class="legal-todo">[${label}]</mark>`;
  const field = (key, en, turkish) => legal[key] ? escapeHtml(legal[key]) : todo(L(en, turkish));
  const controller = field('controllerName', 'Data controller name', 'Veri sorumlusu adı / unvanı');
  const address = field('controllerAddress', 'Postal address', 'Posta adresi');
  const email = legal.contactEmail ? `<a href="mailto:${escapeHtml(legal.contactEmail)}">${escapeHtml(legal.contactEmail)}</a>` : todo(L('Contact email', 'Başvuru e-postası'));
  // KEP is optional: when site-data has none, the KEP row and the KEP application route are left out.
  const kep = legal.kep ? escapeHtml(legal.kep) : null;
  const city = field('city', 'City', 'Şehir');
  const updated = tr ? '8 Kasım 2026' : '8 November 2026';
  const p = text => `<p>${text}</p>`;
  const ul = items => `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
  const table = (head, rows) => `<div class="table-scroll legal-table" tabindex="0" role="region" aria-label="${escapeHtml(head[0])}"><table><thead><tr>${head.map(cell => `<th scope="col">${cell}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map((cell, index) => index ? `<td>${cell}</td>` : `<th scope="row">${cell}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const controllerBlock = `<dl class="legal-contact"><div><dt>${L('Data controller', 'Veri sorumlusu')}</dt><dd>${controller}</dd></div><div><dt>${L('Address', 'Adres')}</dt><dd>${address}</dd></div><div><dt>${L('Email', 'E-posta')}</dt><dd>${email}</dd></div>${kep ? `<div><dt>KEP</dt><dd>${kep}</dd></div>` : ''}</dl>`;

  const processing = [
    [L('MESA account', 'MESA hesabı'),
      L('Email address, account ID, password (stored only as a hash by Supabase Auth), sign-in time, and the name, email and avatar shared by Google or GitHub if you use them.', 'E-posta adresi, hesap kimliği, şifre (Supabase Auth tarafından yalnızca özet olarak saklanır), giriş zamanı; Google veya GitHub kullanırsanız bu sağlayıcının paylaştığı ad, e-posta ve profil görseli.'),
      L('Creating and running your account, signing you in, password reset.', 'Hesabın oluşturulması ve yürütülmesi, giriş, şifre sıfırlama.'),
      L('Establishing and performing the contract (KVKK art. 5/2-c).', 'Sözleşmenin kurulması ve ifası (KVKK m. 5/2-c).'),
      L('While the account is open; deleted within 30 days after you close it.', 'Hesap açık olduğu sürece; hesap kapatıldıktan sonra 30 gün içinde silinir.')],
    [L('Agreement records', 'Onay kayıtları'),
      L('Which version of the Terms and notices you accepted, when, and your commercial message choice.', 'Kullanım Koşulları ve metinlerin hangi sürümünü ne zaman kabul ettiğiniz; ticari ileti tercihiniz.'),
      L('Proving what was agreed and when.', 'Neyin ne zaman onaylandığını ispat etmek.'),
      L('Legal obligation and establishing, exercising or defending a right (KVKK art. 5/2-ç, e).', 'Hukuki yükümlülük ile bir hakkın tesisi, kullanılması veya korunması (KVKK m. 5/2-ç, e).'),
      L('While the account is open, and for 3 years after a commercial message consent ends.', 'Hesap açık olduğu sürece; ticari ileti onayı sona erdikten sonra 3 yıl.')],
    [L('Benchmark research access', 'Benchmark araştırma erişimi'),
      L('Your stated purpose, the request status and download activity linked to your account.', 'Belirttiğiniz kullanım amacı, talebin durumu ve hesabınıza bağlı indirme işlemleri.'),
      L('Reviewing requests and giving access to the data packages.', 'Taleplerin değerlendirilmesi ve veri paketlerine erişim verilmesi.'),
      L('Establishing and performing the contract (KVKK art. 5/2-c).', 'Sözleşmenin kurulması ve ifası (KVKK m. 5/2-c).'),
      L('While the account is open.', 'Hesap açık olduğu sürece.')],
    [L('Early access form', 'Erken erişim formu'),
      L('Email, area of interest, use case; optionally organisation and public GitHub URL. A one-way hash of your network address for abuse protection.', 'E-posta, ilgi alanı, kullanım amacı; isteğe bağlı olarak kurum ve herkese açık GitHub adresi. Kötüye kullanımı önlemek için ağ adresinizin tek yönlü özeti.'),
      L('Reviewing your request and contacting you about it.', 'Talebinizi değerlendirmek ve bununla ilgili sizinle iletişim kurmak.'),
      L('Your explicit consent given on the form (KVKK art. 5/1); for the address hash, legitimate interest (art. 5/2-f).', 'Formda verdiğiniz açık rıza (KVKK m. 5/1); adres özeti için meşru menfaat (m. 5/2-f).'),
      L('Until the request is handled; the address hash for at most 48 hours.', 'Talep sonuçlanana kadar; adres özeti en fazla 48 saat.')],
    [L('Commercial messages', 'Ticari elektronik iletiler'),
      L('Email address and your opt-in, only if you chose it.', 'Yalnızca onay verdiyseniz e-posta adresiniz ve onayınız.'),
      L('Sending MESA news and product updates.', 'MESA haberleri ve ürün güncellemelerinin gönderilmesi.'),
      L('Your explicit consent (KVKK art. 5/1) and approval under Law No. 6563.', 'Açık rızanız (KVKK m. 5/1) ve 6563 sayılı Kanun kapsamındaki onayınız.'),
      L('Until you withdraw it.', 'Onayınızı geri alana kadar.')],
    [L('Security and visit statistics', 'Güvenlik ve ziyaret istatistikleri'),
      L('Technical request data (IP address, browser, time) in the logs of the hosting and network providers; aggregate page-view counts without cookies.', 'Barındırma ve ağ sağlayıcılarının kayıtlarında teknik istek verileri (IP adresi, tarayıcı, zaman); çerezsiz toplu sayfa görüntüleme sayıları.'),
      L('Keeping the site secure and available; understanding which pages are read.', 'Sitenin güvenli ve erişilebilir kalması; hangi sayfaların okunduğunu anlamak.'),
      L('Legitimate interest (KVKK art. 5/2-f).', 'Meşru menfaat (KVKK m. 5/2-f).'),
      L('As set by the providers; we do not build visitor profiles.', 'Sağlayıcıların belirlediği süre; ziyaretçi profili oluşturmayız.')]
  ];
  // One card per processing activity: easier to read than a five-column table.
  const terms = [L('Data', 'Veri'), L('Purpose', 'Amaç'), L('Legal basis', 'Hukuki sebep'), L('Retention', 'Saklama süresi')];
  const processingTable = `<div class="legal-activities">${processing.map(([activity, ...cells]) => `<section class="legal-activity"><h3>${activity}</h3><dl>${cells.map((cell, index) => `<div><dt>${terms[index]}</dt><dd>${cell}</dd></div>`).join('')}</dl></section>`).join('')}</div>`;

  const processors = ul([
    L('<strong>Supabase</strong>: account sign-in, database and file storage.', '<strong>Supabase</strong>: hesap girişi, veritabanı ve dosya depolama.'),
    L('<strong>GitHub Pages</strong> and <strong>Cloudflare</strong>: hosting, network security and cookie-free visit statistics.', '<strong>GitHub Pages</strong> ve <strong>Cloudflare</strong>: barındırma, ağ güvenliği ve çerezsiz ziyaret istatistikleri.'),
    L('<strong>Google</strong> and <strong>GitHub</strong>: only if you choose to sign in with them.', '<strong>Google</strong> ve <strong>GitHub</strong>: yalnızca bunlarla giriş yapmayı seçerseniz.')
  ]);
  const transfer = p(L('These providers may store data on servers outside Turkey (for example in the EU or the USA). Transfers abroad are carried out under the conditions of KVKK art. 9.',
    'Bu sağlayıcılar veriyi Türkiye dışındaki sunucularda (örneğin AB veya ABD) saklayabilir. Yurt dışına aktarım, KVKK m. 9’da öngörülen şartlara uygun olarak yapılır.'));
  const rights = ul(tr ? [
    'Kişisel verilerinizin işlenip işlenmediğini öğrenme,', 'İşlenmişse buna ilişkin bilgi talep etme,', 'İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,',
    'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,', 'Eksik veya yanlış işlenmişse düzeltilmesini isteme,', 'KVKK m. 7’deki şartlar çerçevesinde silinmesini veya yok edilmesini isteme,',
    'Düzeltme ve silme işlemlerinin, verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,', 'Münhasıran otomatik sistemlerle analiz edilmesi sonucunda aleyhinize bir sonuç ortaya çıkmasına itiraz etme,',
    'Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme.'
  ] : [
    'learn whether your personal data is processed,', 'request information about it,', 'learn the purpose and whether it is used for that purpose,',
    'know the third parties in Turkey or abroad it is transferred to,', 'ask for incomplete or incorrect data to be corrected,', 'ask for deletion or destruction under the conditions of KVKK art. 7,',
    'ask that corrections and deletions are notified to those third parties,', 'object to a result against you arising solely from automated analysis,',
    'claim compensation for damage caused by unlawful processing.'
  ]);
  const application = `${p(L(`You can apply in writing to ${address}; ${kep ? `by registered electronic mail (KEP) to ${kep}; ` : ''}with a secure electronic or mobile signature; or by email to ${email} from the email address registered in your MESA account. State your name, your request and an address for the reply.`,
    `Başvurunuzu yazılı olarak ${address} adresine; ${kep ? `kayıtlı elektronik posta (KEP) ile ${kep} adresine; ` : ''}güvenli elektronik imza veya mobil imza ile ya da MESA hesabınızda kayıtlı e-posta adresinizden ${email} adresine iletebilirsiniz. Başvurunuzda adınızı, talebinizi ve yanıt için bir iletişim adresini belirtin.`))}${p(L('We answer within 30 days at the latest, free of charge. If the reply requires a separate cost, the fee set by the Personal Data Protection Board may be charged. If you are not satisfied, you can complain to the Board.',
    'Başvurunuz en geç 30 gün içinde ücretsiz olarak sonuçlandırılır; işlemin ayrıca bir maliyet gerektirmesi hâlinde Kişisel Verileri Koruma Kurulu’nca belirlenen ücret alınabilir. Yanıtı yeterli bulmazsanız Kurul’a şikâyette bulunabilirsiniz.'))}`;

  const docs = {
    privacy: {
      eyebrow: L('LEGAL', 'YASAL'), title: L('Privacy Policy', 'Gizlilik Politikası'),
      lead: L('What the MESA website and MESA accounts collect, why, how long it is kept and how you control it.', 'MESA sitesinin ve MESA hesaplarının hangi verileri, neden topladığını, ne kadar sakladığını ve bunları nasıl yönetebileceğinizi açıklar.'),
      sections: [
        ['summary', L('In short', 'Kısaca'), ul([
          L('Reading the site needs no account, and the site sets no cookies.', 'Siteyi okumak için hesap gerekmez; site çerez kullanmaz.'),
          L('We collect personal data when you create an account, request research access or send the early access form.', 'Hesap oluşturduğunuzda, araştırma erişimi istediğinizde veya erken erişim formunu gönderdiğinizde kişisel veri toplarız.'),
          L('We do not sell personal data and do not show ads.', 'Kişisel verileri satmayız ve reklam göstermeyiz.'),
          L('Commercial emails are sent only if you opt in, and you can opt out at any time.', 'Ticari e-postalar yalnızca onay verirseniz gönderilir; dilediğiniz zaman vazgeçebilirsiniz.')
        ])],
        ['controller', L('Who is responsible', 'Veri sorumlusu'), controllerBlock],
        ['processing', L('What we process and why', 'Neyi, neden işliyoruz'), processingTable],
        ['account', L('Your account', 'Hesabınız'), p(L('Your session is kept in this browser tab only and ends when you close the tab or sign out. You can change your commercial email choice in your account settings at any time.',
          'Oturumunuz yalnızca bu tarayıcı sekmesinde tutulur; sekmeyi kapattığınızda veya çıkış yaptığınızda sona erer. Ticari e-posta tercihinizi hesap ayarlarınızdan dilediğiniz zaman değiştirebilirsiniz.'))],
        ['processors', L('Service providers and transfers abroad', 'Hizmet sağlayıcılar ve yurt dışına aktarım'), processors + transfer],
        ['security', L('Security', 'Güvenlik'), p(L('Connections are encrypted (HTTPS). Passwords are stored only as hashes. Database rules let each user read only their own records; administrators see requests only through an authenticated panel.',
          'Bağlantılar şifrelidir (HTTPS). Şifreler yalnızca özet olarak saklanır. Veritabanı kuralları her kullanıcının yalnızca kendi kayıtlarını görmesine izin verir; yöneticiler talepleri yalnızca kimliği doğrulanmış bir panelden görür.'))],
        ['children', L('Children', 'Çocuklar'), p(L('MESA accounts are meant for people aged 18 or over.', 'MESA hesapları 18 yaşını doldurmuş kişiler içindir.'))],
        ['rights', L('Your rights', 'Haklarınız'), p(L('Under KVKK art. 11 (and, for people in the EU, GDPR art. 15–22) you can access, correct, delete and object. The <a href="' + href('legal/kvkk/#application') + '">KVKK Information Notice</a> explains how to apply.',
          'KVKK m. 11 (AB’de bulunanlar için GDPR m. 15–22) kapsamında verilerinize erişebilir, düzeltilmesini veya silinmesini isteyebilir ve itiraz edebilirsiniz. Başvuru yöntemi <a href="' + href('legal/kvkk/#application') + '">KVKK Aydınlatma Metni</a>’nde yer alır.'))],
        ['related', L('Related documents', 'İlgili metinler'), ul([
          `<a href="${href('legal/kvkk/')}">${L('KVKK Information Notice', 'KVKK Aydınlatma Metni')}</a>`, `<a href="${href('legal/cookies/')}">${L('Cookie Policy', 'Çerez Politikası')}</a>`,
          `<a href="${href('legal/terms/')}">${L('Terms of Use', 'Kullanım Koşulları')}</a>`, `<a href="${href('legal/commercial-messages/')}">${L('Commercial Electronic Message Consent', 'Ticari Elektronik İleti Onay Metni')}</a>`
        ])],
        ['changes', L('Changes', 'Değişiklikler'), p(L('If this policy changes in a way that affects you, we will tell you on the site and, for account holders, by email.', 'Bu politika sizi etkileyecek şekilde değişirse sitede ve hesap sahiplerine e-postayla bildiririz.'))]
      ]
    },
    kvkk: {
      eyebrow: 'KVKK', title: L('KVKK Information Notice', 'KVKK Aydınlatma Metni'),
      lead: L('Information under Article 10 of the Personal Data Protection Law No. 6698 (KVKK).', '6698 sayılı Kişisel Verilerin Korunması Kanunu’nun (KVKK) 10. maddesi kapsamında aydınlatma metni.'),
      sections: [
        ['controller', L('1. Data controller', '1. Veri sorumlusu'), p(L('Your personal data is processed by the data controller below as described in this notice.', 'Kişisel verileriniz, aşağıda bilgileri yer alan veri sorumlusu tarafından bu metinde açıklanan şekilde işlenir.')) + controllerBlock],
        ['purposes', L('2. Data, purposes, legal bases and retention', '2. İşlenen veriler, amaçlar, hukuki sebepler ve süreler'), processingTable],
        ['method', L('3. How data is collected', '3. Toplama yöntemi'), p(L('Data is collected electronically and partly automatically, through the forms on mesamemory.dev, Supabase Auth, and Google or GitHub sign-in when you choose it.', 'Veriler; mesamemory.dev üzerindeki formlar, Supabase Auth ve tercih etmeniz hâlinde Google veya GitHub girişi aracılığıyla elektronik ortamda, kısmen otomatik yollarla toplanır.'))],
        ['recipients', L('4. Who data is transferred to', '4. Aktarılan taraflar'), processors + transfer + p(L('Data may also be shared with authorised public bodies when the law requires it.', 'Kanunen yetkili kamu kurum ve kuruluşlarına, talep hâlinde ve mevzuatın gerektirdiği ölçüde aktarım yapılabilir.'))],
        ['rights', L('5. Your rights under KVKK art. 11', '5. KVKK m. 11 kapsamındaki haklarınız'), rights],
        ['application', L('6. How to apply', '6. Başvuru yöntemi'), application]
      ]
    },
    cookies: {
      eyebrow: L('LEGAL', 'YASAL'), title: L('Cookie Policy', 'Çerez Politikası'),
      lead: L('How the MESA website uses cookies and similar browser storage.', 'MESA sitesinin çerezleri ve benzeri tarayıcı depolama teknolojilerini nasıl kullandığı.'),
      sections: [
        ['summary', L('No cookies, no tracking', 'Çerez yok, takip yok'), p(L('The MESA website does not set cookies and uses no advertising, profiling or cross-site tracking. Visit statistics come from Cloudflare Web Analytics, which counts page views without cookies or fingerprinting. That is why the site shows no cookie banner.',
          'MESA sitesi çerez yerleştirmez; reklam, profilleme veya siteler arası takip yapmaz. Ziyaret istatistikleri, sayfa görüntülemelerini çerez ve parmak izi kullanmadan sayan Cloudflare Web Analytics ile tutulur. Bu nedenle sitede çerez bildirimi gösterilmez.'))],
        ['storage', L('Browser storage we use', 'Kullandığımız tarayıcı depolaması'), p(L('Some features need to remember a small amount of data in your browser. These items are strictly necessary for the feature you use and are not used for tracking.', 'Bazı özellikler tarayıcınızda az miktarda veriyi hatırlamak zorundadır. Bunlar kullandığınız özellik için zorunludur ve takip amacıyla kullanılmaz.')) + table(
          [L('Name', 'Ad'), L('Type', 'Tür'), L('Purpose', 'Amaç'), L('Duration', 'Süre')],
          [
            ['<code>mesa-benchmark-auth</code>', 'sessionStorage', L('Keeps you signed in to your MESA account.', 'MESA hesabınızda oturumunuzu açık tutar.'), L('Until the tab is closed or you sign out', 'Sekme kapanana veya çıkış yapana kadar')],
            ['<code>mesa-benchmark-auth-code-verifier</code>', 'localStorage', L('Secures sign-in, email confirmation and password reset (PKCE).', 'Girişi, e-posta doğrulamasını ve şifre sıfırlamayı güvenli kılar (PKCE).'), L('Until the sign-in step finishes', 'Giriş adımı tamamlanana kadar')],
            ['<code>mesa-pending-consent</code>', 'localStorage', L('Carries your sign-up agreements through Google or GitHub sign-up.', 'Google veya GitHub ile kayıtta onaylarınızı hesabınıza taşır.'), L('Until your first sign-in completes', 'İlk giriş tamamlanana kadar')],
            ['<code>mesa-learn-progress-v2</code>', 'localStorage', L('Remembers which lessons you marked as read. Stays on your device.', 'Okundu olarak işaretlediğiniz dersleri hatırlar. Cihazınızda kalır.'), L('Until you clear it', 'Siz silene kadar')]
          ])],
        ['third-parties', L('Sign-in providers', 'Giriş sağlayıcıları'), p(L('If you sign in with Google or GitHub, their sign-in pages may set their own cookies on their own domains under their policies.', 'Google veya GitHub ile giriş yaparsanız, bu sağlayıcıların giriş sayfaları kendi alan adlarında, kendi politikalarına göre çerez kullanabilir.'))],
        ['control', L('How to control it', 'Nasıl yönetebilirsiniz'), p(L('You can clear this data at any time in your browser settings (site data for mesamemory.dev). Signing out also removes your session.', 'Bu verileri tarayıcı ayarlarınızdan (mesamemory.dev site verileri) dilediğiniz zaman silebilirsiniz. Çıkış yapmak da oturumunuzu kaldırır.'))]
      ]
    },
    terms: {
      eyebrow: L('LEGAL', 'YASAL'), title: L('Terms of Use', 'Kullanım Koşulları'),
      lead: L('The rules for using mesamemory.dev and a MESA account.', 'mesamemory.dev sitesinin ve MESA hesabının kullanım kuralları.'),
      sections: [
        ['parties', L('1. Parties and scope', '1. Taraflar ve kapsam'), p(L(`These terms apply between ${controller} ("MESA") and everyone who uses mesamemory.dev or creates a MESA account. By creating an account you accept these terms.`,
          `Bu koşullar, ${controller} (“MESA”) ile mesamemory.dev sitesini kullanan veya MESA hesabı oluşturan herkes arasında geçerlidir. Hesap oluşturarak bu koşulları kabul etmiş olursunuz.`))],
        ['service', L('2. The service', '2. Hizmet'), p(L('MESA is an open-source project in alpha. The website, documentation, benchmark reports and account services are offered free of charge and “as is”. Features may change or be withdrawn. MESA is not qualified for production use.',
          'MESA, alfa aşamasında açık kaynaklı bir projedir. Site, dokümantasyon, benchmark raporları ve hesap hizmetleri ücretsiz ve “olduğu gibi” sunulur. Özellikler değişebilir veya kaldırılabilir. MESA canlı kullanım için doğrulanmış değildir.'))],
        ['account', L('3. Your account', '3. Hesabınız'), ul([
          L('You must be 18 or over and give accurate information.', '18 yaşını doldurmuş olmanız ve doğru bilgi vermeniz gerekir.'),
          L('Keep your password secret; you are responsible for activity on your account.', 'Şifrenizi gizli tutun; hesabınızdaki işlemlerden siz sorumlusunuz.'),
          L('Tell us at once if you think your account has been misused.', 'Hesabınızın kötüye kullanıldığını düşünürseniz hemen bize bildirin.'),
          L('You can close your account at any time by applying as described in the KVKK notice.', 'KVKK metnindeki başvuru yoluyla hesabınızı dilediğiniz zaman kapatabilirsiniz.')
        ])],
        ['use', L('4. Acceptable use', '4. Kabul edilebilir kullanım'), ul([
          L('Do not attack, overload or try to bypass the security of the site or its services.', 'Siteye veya hizmetlerine saldırmayın, aşırı yük bindirmeyin, güvenlik önlemlerini aşmaya çalışmayın.'),
          L('Do not create accounts automatically or on behalf of others without permission.', 'Otomatik yollarla veya izinsiz başkaları adına hesap oluşturmayın.'),
          L('Do not use the services for unlawful purposes.', 'Hizmetleri hukuka aykırı amaçlarla kullanmayın.')
        ])],
        ['data', L('5. Benchmark data and software', '5. Benchmark verileri ve yazılım'), p(L('Access to research data packages is granted case by case and is subject to the conditions shown at approval and the licence of each package. The MESA software is licensed separately under the Apache License 2.0; these terms do not change that licence.',
          'Araştırma veri paketlerine erişim talep bazında verilir; onay sırasında belirtilen koşullar ve her paketin lisansı geçerlidir. MESA yazılımı ayrıca Apache License 2.0 ile lisanslanır; bu koşullar o lisansı değiştirmez.'))],
        ['ip', L('6. Intellectual property', '6. Fikrî mülkiyet'), p(L('Texts, design and benchmark reports on the site belong to MESA unless stated otherwise. Short quotations with attribution are welcome.', 'Sitedeki metinler, tasarım ve benchmark raporları aksi belirtilmedikçe MESA’ya aittir. Kaynak gösterilerek kısa alıntı yapılabilir.'))],
        ['liability', L('7. Liability', '7. Sorumluluk'), p(L('To the extent permitted by law, MESA is not liable for indirect damage, data loss or interruptions arising from the use of the free services. Rights that cannot be limited by law, including consumer rights under Law No. 6502, remain reserved.',
          'Hukukun izin verdiği ölçüde MESA, ücretsiz hizmetlerin kullanımından doğan dolaylı zararlardan, veri kaybından veya kesintilerden sorumlu değildir. 6502 sayılı Kanun kapsamındaki tüketici hakları dâhil, kanunen sınırlandırılamayan haklar saklıdır.'))],
        ['termination', L('8. Suspension and termination', '8. Askıya alma ve sona erme'), p(L('We may suspend or close accounts that break these terms. You can stop using the services at any time.', 'Bu koşullara aykırı hesapları askıya alabilir veya kapatabiliriz. Hizmetleri kullanmayı dilediğiniz zaman bırakabilirsiniz.'))],
        ['changes', L('9. Changes', '9. Değişiklikler'), p(L('We may update these terms. Material changes are announced on the site and, for account holders, by email before they take effect.', 'Bu koşulları güncelleyebiliriz. Önemli değişiklikler yürürlüğe girmeden önce sitede ve hesap sahiplerine e-postayla duyurulur.'))],
        ['law', L('10. Governing law', '10. Uygulanacak hukuk'), p(L(`Turkish law applies. The courts and enforcement offices of ${city} have jurisdiction; in consumer matters, consumer arbitration committees and consumer courts remain competent.`,
          `Türk hukuku uygulanır. Uyuşmazlıklarda ${city} mahkemeleri ve icra daireleri yetkilidir; tüketici işlemlerinde tüketici hakem heyetleri ve tüketici mahkemelerinin yetkisi saklıdır.`))],
        ['contact', L('11. Contact', '11. İletişim'), controllerBlock]
      ]
    },
    commercialMessages: {
      eyebrow: L('LEGAL', 'YASAL'), title: L('Commercial Electronic Message Consent', 'Ticari Elektronik İleti Onay Metni'),
      lead: L('What you agree to when you choose to receive MESA news by email. This consent is optional and is not a condition for opening an account.', 'MESA haberlerini e-postayla almayı seçtiğinizde neyi onayladığınız. Bu onay isteğe bağlıdır ve hesap açmanın şartı değildir.'),
      sections: [
        ['consent', L('Consent', 'Onay'), p(L(`Under Law No. 6563 on the Regulation of Electronic Commerce and the related regulation, I agree that ${controller} may send commercial electronic messages to the email address I provide, about MESA product news, releases, benchmark results, events and research opportunities.`,
          `6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun ve ilgili yönetmelik kapsamında; ${controller} tarafından, bildirdiğim e-posta adresime MESA ürün haberleri, yeni sürümler, benchmark sonuçları, etkinlikler ve araştırma fırsatları hakkında ticari elektronik ileti gönderilmesine onay veriyorum.`))],
        ['channel', L('Channel and content', 'Kanal ve içerik'), ul([
          L('Channel: email only.', 'Kanal: yalnızca e-posta.'),
          L('Frequency: occasional; no more than a few messages a month.', 'Sıklık: ara sıra; ayda birkaç iletiyi aşmayacak şekilde.'),
          L('Every message identifies the sender and contains a free, one-click way to stop receiving messages.', 'Her ileti göndericiyi tanıtır ve iletileri almayı ücretsiz ve tek tıkla durdurma imkânı içerir.')
        ])],
        ['withdraw', L('Withdrawing consent', 'Onayın geri alınması'), p(L(`You can withdraw your consent at any time, free of charge and without giving a reason: through the link in any message, in your <a href="${href('account/')}">account settings</a>, or by writing to ${email}. Messages stop within 3 working days at the latest.`,
          `Onayınızı dilediğiniz zaman, ücretsiz ve gerekçe göstermeden geri alabilirsiniz: iletilerdeki bağlantıdan, <a href="${href('account/')}">hesap ayarlarınızdan</a> veya ${email} adresine yazarak. Gönderimler en geç 3 iş günü içinde durdurulur.`))],
        ['records', L('Records', 'Kayıtlar'), p(L('Your consent and its withdrawal are recorded with date and time and kept for 3 years after the consent ends, as the regulation requires. Your data is processed as described in the <a href="' + href('legal/kvkk/') + '">KVKK Information Notice</a>.',
          'Onayınız ve geri alınması tarih ve saatiyle kaydedilir ve mevzuat gereği onayın sona ermesinden itibaren 3 yıl saklanır. Verileriniz <a href="' + href('legal/kvkk/') + '">KVKK Aydınlatma Metni</a>’nde açıklandığı şekilde işlenir.'))]
      ]
    }
  };

  const doc = docs[kind];
  const toc = `<nav class="legal-toc" aria-label="${L('On this page', 'Bu sayfada')}"><p>${L('On this page', 'Bu sayfada')}</p><ol>${doc.sections.map(([id, heading]) => `<li><a href="#${id}">${heading.replace(/^\d+\.\s*/, '')}</a></li>`).join('')}</ol></nav>`;
  const others = LEGAL_PAGES.filter(page => page !== kind).map(page => {
    const path = { privacy: 'privacy/', kvkk: 'legal/kvkk/', cookies: 'legal/cookies/', terms: 'legal/terms/', commercialMessages: 'legal/commercial-messages/' }[page];
    return `<a href="${href(path)}">${docs[page].title}</a>`;
  }).join('');
  return `${header}<main id="main-content" class="legal-page">
    <section class="page-hero compact page-hero--short"><p class="eyebrow">${doc.eyebrow}</p><h1>${doc.title}</h1><p>${doc.lead}</p>
      <p class="legal-updated">${L('Last updated', 'Son güncelleme')}: ${updated} · ${L('Version', 'Sürüm')} ${LEGAL_VERSION}${tr ? '' : ' · The Turkish text prevails.'}</p></section>
    <section class="section legal-body"><div class="legal-layout">${toc}<div class="legal-content">${doc.sections.map(([id, heading, body]) => `<article id="${id}"><h2>${heading}</h2>${body}</article>`).join('')}
      <p class="legal-others">${L('Other documents:', 'Diğer metinler:')} ${others}</p></div></div></section>
    ${footer}</main>`;
}
