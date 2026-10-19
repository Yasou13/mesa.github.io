// The inbox receives only RLS-authorized rows. Request content is always rendered as text.
export function requestInbox({service, action, status, t, date}) {
  const $ = id => document.getElementById(id);
  const names = {new:t('New','Yeni'),reviewing:t('Reviewing','İnceleniyor'),contacted:t('Contacted','İletişim kuruldu'),invited:t('Invited','Davet edildi'),closed:t('Closed','Kapatıldı'),spam:t('Spam','İstenmeyen')};
  const intents = {try:t('Try MESA','Denemek istiyor'),integration:t('Integration','Entegrasyon'),contribute:t('Contribute','Katkıda bulunmak istiyor')};
  let page = 0, rows = [], selected = null, baseline = '', epoch = 0, saving = false;
  const size = 25;
  const dirty = () => selected && JSON.stringify({status:$('request-state').value,notes:$('request-notes').value}) !== baseline;
  const canLeave = () => !saving && (!dirty() || confirm(t('Discard unsaved request notes and status?', 'Talepteki kaydedilmemiş not ve durum değişiklikleri silinsin mi?')));
  function clear(resetFilters = false) {
    ++epoch; rows = []; selected = null; baseline = ''; saving = false;
    if (resetFilters) {$('request-search').value = ''; $('request-filter').value = 'all';}
    $('request-list').replaceChildren(); $('request-detail').hidden = true;
    $('request-edit-fields').disabled = false; $('request-notes').value = ''; $('request-email').textContent = ''; $('request-use-case').textContent = '';
    $('request-organization').textContent = ''; $('request-github').replaceChildren(); $('request-date').textContent = '';
    $('request-count').textContent = ''; $('request-feedback').textContent = '';
  }
  function open(row) {
    if (!canLeave()) return;
    selected = row;
    $('request-detail').hidden = false;
    $('request-email').textContent = row.email;
    $('request-use-case').textContent = row.use_case;
    $('request-organization').textContent = row.organization || '—';
    $('request-date').textContent = `${date(row.created_at)} · ${row.language.toUpperCase()} · ${intents[row.intent]}`;
    $('request-state').value = row.status; $('request-notes').value = row.admin_notes;
    $('request-github').replaceChildren();
    if (/^https:\/\/github\.com\/[a-z0-9_-]+(?:\/[a-z0-9_.-]+)?\/?$/i.test(row.github_url)) {
      const a = document.createElement('a'); a.href = row.github_url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = row.github_url; $('request-github').append(a);
    } else $('request-github').textContent = '—';
    baseline = JSON.stringify({status:row.status,notes:row.admin_notes});
    $('request-feedback').textContent = '';
    $('request-email').focus();
  }
  async function load(reset = false) {
    if (reset) page = 0;
    const active = ++epoch;
    $('request-feedback').textContent = t('Loading requests…','Talepler yükleniyor…');
    let result;
    try {result = await service.listAccessRequests({page,status:$('request-filter').value,search:$('request-search').value});}
    catch (error) {if(active === epoch)$('request-feedback').textContent = t('Could not load requests. Try refreshing.','Talepler yüklenemedi. Listeyi yenilemeyi deneyin.');throw error;}
    if (active !== epoch) return;
    if (page && !result.rows.length) {page--;return load();}
    rows = result.rows; selected = null; baseline = ''; $('request-detail').hidden = true;
    $('request-list').replaceChildren();
    for (const row of rows) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'request-row';
      for (const text of [row.email, `${intents[row.intent]} · ${names[row.status]}`, `${row.organization || '—'} · ${date(row.created_at)}`]) {const span = document.createElement('span');span.textContent = text;b.append(span);}
      b.addEventListener('click', () => open(row)); $('request-list').append(b);
    }
    if (!rows.length) {const p = document.createElement('p');p.textContent = t('No requests match these filters.','Bu filtrelere uygun talep yok.');$('request-list').append(p);}
    const total = result.count;
    $('request-count').textContent = t(`${total} requests · Page ${page+1} of ${Math.max(1,Math.ceil(total/size))}`,`${total} talep · Sayfa ${page+1} / ${Math.max(1,Math.ceil(total/size))}`);
    $('request-prev').disabled = page === 0; $('request-next').disabled = (page+1)*size >= total;
    $('request-feedback').textContent = '';
    status(t('Early access requests loaded.','Erken erişim talepleri yüklendi.'));
  }
  $('request-filter-form').addEventListener('submit', e => {e.preventDefault();if(canLeave())action($('request-refresh'),()=>load(true));});
  $('request-filter').addEventListener('change', () => {if(canLeave())action($('request-refresh'),()=>load(true));});
  for (const [id,delta] of [['request-prev',-1],['request-next',1]]) $(id).addEventListener('click', e => {if(canLeave())action(null,()=>{page+=delta;return load();});});
  $('request-detail').addEventListener('submit', e => {
    e.preventDefault(); if(!selected || !e.currentTarget.reportValidity()) return;
    action($('request-save'),async()=>{
      const active = epoch, current = selected; saving = true;
      $('request-edit-fields').disabled = true;
      try {
        const saved = await service.saveAccessRequest(current,{status:$('request-state').value,admin_notes:$('request-notes').value});
        if(active !== epoch) return;
        selected = {...current,...saved}; baseline = JSON.stringify({status:selected.status,notes:selected.admin_notes});
        $('request-feedback').textContent = t('Saved. No email was sent.','Kaydedildi. E-posta gönderilmedi.');
        status(t('Request updated.','Talep güncellendi.'));
        // Update the list without discarding the detail or any other request.
        const i = rows.findIndex(row=>row.id === selected.id); rows[i] = selected;
        $('request-list').children[i]?.children[1] && ($('request-list').children[i].children[1].textContent = `${intents[selected.intent]} · ${names[selected.status]}`);
      } finally {saving = false;if(active === epoch)$('request-edit-fields').disabled = false;}
    });
  });
  return {load,clear,dirty,canLeave};
}
