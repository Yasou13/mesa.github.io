(() => {
  const form = document.getElementById('early-access-form');
  if (!form) return;
  const tr = document.documentElement.lang === 'tr';
  const t = (en, turkish) => tr ? turkish : en;
  const status = document.getElementById('access-status'), fields = document.getElementById('access-fields'), retry = document.getElementById('access-retry');
  const config = JSON.parse(document.getElementById('early-access-config').textContent);
  let ready = false, sending = false;
  const show = (text, error = false) => { status.textContent = text; status.dataset.error = String(error); };
  async function rpc(name, body) {
    const response = await fetch(config.url + '/rest/v1/rpc/' + name, {method:'POST',headers:{'Content-Type':'application/json',apikey:config.key,Authorization:'Bearer '+config.key},body:JSON.stringify(body),credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(15000)});
    const result = await response.json();
    if (!response.ok) { const error = new Error('REQUEST'); error.code = result?.code; throw error; }
    return result;
  }
  async function initialize() {
    retry.hidden = true; fields.disabled = true; ready = false;
    show(t('Checking the request form…', 'Talep formu hazırlanıyor…'));
    try {
      if (!config || await rpc('early_access_available', {}) !== true) throw new Error('UNAVAILABLE');
      form.hidden = false; ready = true; fields.disabled = false;
      show(t('Your answers are private. No account is needed.', 'Yanıtlarınız gizli kalır. Hesap açmanız gerekmez.'));
    } catch {
      form.hidden = true; retry.hidden = !config;
      show(t('The form is temporarily unavailable. Please try again later. You can still use the quickstart.', 'Forma şu anda ulaşılamıyor. Lütfen daha sonra yeniden deneyin. Bu sırada hızlı başlangıç rehberini kullanabilirsiniz.'), true);
    }
  }
  retry.addEventListener('click', initialize);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!ready || sending || !form.reportValidity()) return;
    const data = new FormData(form), github = String(data.get('github_url') || '').trim();
    if (github && !/^https:\/\/github\.com\/[a-z0-9_-]+(?:\/[a-z0-9_.-]+)?\/?$/i.test(github)) {
      show(t('Enter a public GitHub profile or repository URL.', 'Herkese açık bir GitHub profil veya depo adresi girin.'), true); document.getElementById('access-github').focus(); return;
    }
    sending = true; fields.disabled = true; form.setAttribute('aria-busy','true');
    show(t('Sending your request…', 'Talebiniz gönderiliyor…'));
    try {
      const result = await rpc('submit_early_access', {p_email:String(data.get('email')).trim(),p_intent:data.get('intent'),p_use_case:String(data.get('use_case')).trim(),p_organization:String(data.get('organization')||'').trim(),p_github_url:github,p_language:tr?'tr':'en',p_website:String(data.get('website')||''),p_acknowledged:data.get('acknowledged')==='on'});
      if (result?.accepted !== true) throw new Error('REQUEST');
      ready = false; form.reset(); form.hidden = true;
      show(t('Your request has been received. Thank you for sharing what you want to build. We may contact you at the email you provided. No account has been created.', 'Talebiniz alındı. Ne geliştirmek istediğinizi paylaştığınız için teşekkürler. Gerekirse yazdığınız e-posta adresinden size ulaşacağız. Bu işlemle hesap açılmadı.'));
      status.tabIndex = -1; status.focus();
    } catch (error) {
      show(error.code === 'P0429' ? t('Too many attempts. Please wait an hour before trying again.', 'Çok fazla deneme yapıldı. Lütfen bir saat sonra yeniden deneyin.') : t('We could not confirm receipt. Your answers are still here; please try again. Repeating a request will not create a duplicate.', 'Talebinizin alındığını doğrulayamadık. Yanıtlarınız silinmedi; yeniden deneyebilirsiniz. Tekrar göndermek aynı talebin kopyasını oluşturmaz.'), true);
    } finally { sending = false; fields.disabled = !ready; form.removeAttribute('aria-busy'); }
  });
  initialize();
})();
