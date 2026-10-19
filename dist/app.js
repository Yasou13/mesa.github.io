const publicAssetRoot = new URL('.', document.currentScript.src);
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-navigation');
const isTurkish = document.documentElement.lang === 'tr';
const labels = isTurkish
  ? { open: 'Menüyü aç', close: 'Menüyü kapat', copied: 'Kopyalandı', selected: 'Seçildi', copy: 'Kopyala', sectionCopied: 'Bölüm bağlantısı kopyalandı' }
  : { open: 'Open navigation', close: 'Close navigation', copied: 'Copied', selected: 'Selected', copy: 'Copy', sectionCopied: 'Section link copied' };

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? labels.close : labels.open);
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', labels.open);
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !nav?.classList.contains('open') || document.querySelector('.search-modal-backdrop.open')) return;
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', labels.open);
  toggle.focus();
});

document.querySelectorAll('.heading-anchor').forEach((link) => {
  link.addEventListener('click', async (event) => {
    event.preventDefault();
    const sectionUrl = new URL(link.href, window.location.href).toString();
    window.history.replaceState(null, '', link.hash);
    try {
      await navigator.clipboard.writeText(sectionUrl);
      link.setAttribute('title', labels.sectionCopied);
    } catch {
      window.location.hash = link.hash;
    }
    window.setTimeout(() => link.setAttribute('title', isTurkish ? 'Bölüm bağlantısını kopyala' : 'Copy section link'), 3500);
  });
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveData = navigator.connection?.saveData === true;

/* ====================================================================
   MESA Static Search Modal & Documentation Sidebar
   ==================================================================== */

let searchIndexData = null;
let searchIndexLoading = false;
let searchModalBackdrop = null;
let searchInput = null;
let searchResultsList = null;
let selectedResultIndex = -1;
let searchReturnFocus = null;
let inertSiblings = [];

function createSearchModal() {
  if (searchModalBackdrop) return;
  const placeholder = isTurkish ? 'Makale veya doküman ara...' : 'Search articles and documentation...';
  const emptyText = isTurkish ? 'Eşleşen sonuç bulunamadı.' : 'No matching results found.';

  const backdrop = document.createElement('div');
  backdrop.className = 'search-modal-backdrop';
  backdrop.hidden = true;
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-label', isTurkish ? 'Arama' : 'Search');

  backdrop.innerHTML = `
    <div class="search-modal-dialog">
      <div class="search-input-wrapper">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="search" class="search-input" placeholder="${placeholder}" aria-label="${placeholder}" autocomplete="off" spellcheck="false">
    <button type="button" class="search-close">${isTurkish ? 'Kapat' : 'Close'}</button>
      </div>
      <ul class="search-results-list" role="listbox">
        <li class="search-result-empty">${isTurkish ? 'Aramak için yazın...' : 'Type to search...'}</li>
      </ul>
    </div>
  `;

  document.body.appendChild(backdrop);
  searchModalBackdrop = backdrop;
  searchInput = backdrop.querySelector('.search-input');
  searchResultsList = backdrop.querySelector('.search-results-list');
  backdrop.querySelector('.search-close').addEventListener('click', closeSearchModal);
  backdrop.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const controls = [...backdrop.querySelectorAll('input, button, a[href]')];
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  // Close when clicking backdrop
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeSearchModal();
  });

  // Search input typing
  searchInput.addEventListener('input', () => {
    performSearch(searchInput.value.trim());
  });

  // Keyboard navigation inside search
  searchInput.addEventListener('keydown', (e) => {
    const items = searchResultsList.querySelectorAll('.search-result-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!items.length) return;
      selectedResultIndex = (selectedResultIndex + 1) % items.length;
      updateActiveResult(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!items.length) return;
      selectedResultIndex = (selectedResultIndex - 1 + items.length) % items.length;
      updateActiveResult(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedResultIndex >= 0 && items[selectedResultIndex]) {
        const link = items[selectedResultIndex].querySelector('a');
        if (link) link.click();
      }
    } else if (e.key === 'Escape') {
      closeSearchModal();
    }
  });
}

function updateActiveResult(items) {
  items.forEach((item, idx) => {
    item.classList.toggle('active', idx === selectedResultIndex);
    if (idx === selectedResultIndex) {
      item.scrollIntoView({ block: 'nearest' });
    }
  });
}

async function loadSearchIndex() {
  if (searchIndexData) return searchIndexData;
  if (searchIndexLoading) return;
  searchIndexLoading = true;

  try {
    // Determine relative path to search-index.json from current page location
    const res = await fetch(new URL('search-index.json', publicAssetRoot));
    if (!res.ok) throw new Error('Search index unavailable');
    if (res.ok) {
      searchIndexData = await res.json();
    }
  } catch (err) {
    console.warn('Could not load search index', err);
  } finally {
    searchIndexLoading = false;
    if (searchModalBackdrop?.classList.contains('open')) performSearch(searchInput.value.trim());
  }
  return searchIndexData;
}

function openSearchModal() {
  createSearchModal();
  searchReturnFocus = document.activeElement;
  inertSiblings = [...document.body.children].filter(node => node !== searchModalBackdrop).map(node => [node, node.inert]);
  inertSiblings.forEach(([node]) => { node.inert = true; });
  searchModalBackdrop.hidden = false;
  searchModalBackdrop.classList.add('open');
  searchInput.value = '';
  selectedResultIndex = -1;
  searchInput.focus();
  performSearch('');
  loadSearchIndex();
}

function closeSearchModal() {
  if (!searchModalBackdrop) return;
  searchModalBackdrop.classList.remove('open');
  searchModalBackdrop.hidden = true;
  inertSiblings.forEach(([node, wasInert]) => { node.inert = wasInert; });
  inertSiblings = [];
  searchReturnFocus?.focus();
}

function searchText(value) {
  return String(value).toLocaleLowerCase(isTurkish ? 'tr-TR' : 'en-US').normalize('NFD').replace(/\p{Diacritic}/gu,'').replaceAll('ı','i').normalize('NFC');
}

function searchTerms(value) {
  const terms = searchText(value).match(/[\p{L}\p{N}_-]+/gu) || [];
  const stop = new Set(['a','an','the','what','is','are','how','does','do','can','i','nedir','nasil','ne','bir','bu','ve','ile','icin','mi','hesaplanir','calisir','demek','anlama','gelir','calculate','works']);
  const useful = terms.filter(term=>!stop.has(term));
  return useful.length ? useful : terms;
}

function performSearch(query) {
  if (!query) {
    searchResultsList.innerHTML = `<li class="search-result-empty">${isTurkish ? 'Aramak için yazın...' : 'Type to search...'}</li>`;
    selectedResultIndex = -1;
    return;
  }

  if (!searchIndexData) {
    searchResultsList.innerHTML = `<li class="search-result-empty">${isTurkish ? 'Dizin yükleniyor...' : 'Loading index...'}</li>`;
    return;
  }

  const lang = isTurkish ? 'tr' : 'en';
  const q = searchText(query);

  const terms = searchTerms(q);
  const results = searchIndexData.filter(item=>item.language===lang||!item.language)
    .map(item=>{
      const title=searchText(item.title),summary=searchText(item.summary||''),keywords=searchText((item.keywords||[]).join(' '));
      const full=`${title} ${summary} ${keywords} ${searchText(item.content||'')} ${searchText(item.section||'')}`;
      if(!terms.every(term=>full.includes(term)))return null;
      const match=item.sections?.find(s=>terms.every(term=>searchText(`${s.title} ${s.text}`).includes(term)));
      const score=terms.reduce((n,term)=>n+(title.includes(term)?8:0)+(keywords.includes(term)?4:0)+(summary.includes(term)?2:0),0);
      return {...item,match,score};
    }).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,10);

  if (!results.length) {
    searchResultsList.innerHTML = `<li class="search-result-empty">${isTurkish ? 'Eşleşen sonuç bulunamadı.' : 'No matching results found.'}</li>`;
    selectedResultIndex = -1;
    return;
  }

  // Calculate relative base


  searchResultsList.innerHTML = results.map((item, idx) => {
    const itemHref = new URL(item.url+(item.match?'#'+item.match.id:''), publicAssetRoot).href;
    return `<li class="search-result-item${idx === 0 ? ' active' : ''}" role="option">
      <a href="${escapeText(itemHref)}">
        <div class="search-result-meta">
          <span class="search-result-section">${escapeText(item.section || 'MESA')}</span>
        </div>
        <div class="search-result-title">${escapeText(item.title)}</div>
        ${item.match ? `<div class="search-result-summary">${escapeText(item.match.title)} · ${escapeText(item.match.text.slice(0,150))}…</div>` : item.summary ? `<div class="search-result-summary">${escapeText(item.summary)}</div>` : ''}
      </a>
    </li>`;
  }).join('');

  selectedResultIndex = 0;
}

function escapeText(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

// Global Search Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (searchModalBackdrop?.classList.contains('open')) {
      closeSearchModal();
    } else {
      openSearchModal();
    }
  } else if (e.key === 'Escape' && searchModalBackdrop?.classList.contains('open')) {
    closeSearchModal();
  }
});

// Search Trigger buttons in Header
document.querySelectorAll('.search-trigger').forEach((btn) => {
  btn.addEventListener('click', () => openSearchModal());
});

// Delegate copy button for dynamically rendered code blocks
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.copy-button');
  if (!btn) return;
  const targetId = btn.dataset.copyTarget;
  if (!targetId) return;
  const target = document.getElementById(targetId);
  if (!target) return;
  const text = target.innerText || '';
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = labels.copied;
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(target);
    selection.removeAllRanges();
    selection.addRange(range);
    btn.textContent = labels.selected;
  }
  window.setTimeout(() => { btn.textContent = labels.copy; }, 4000);
});

// This is a transparent arithmetic example, never a live retrieval request.
for (const calculator of document.querySelectorAll('[data-rank-calculator]')) {
  calculator.querySelector('fieldset').disabled = false;
  calculator.addEventListener('change', () => {
    const contributions = calculator.querySelectorAll('input:checked').length;
    calculator.querySelector('output').value = `${contributions} / 61 = ${(contributions / 61).toFixed(6)}`;
  });
}
// Preserve deep links into original source references even while the appendix is folded.
function revealSourceAnchor() {
  if (!location.hash) return;
  let target;
  try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
  const appendix = target?.closest('.source-appendix');
  if (appendix && !appendix.open) { appendix.open = true; target.scrollIntoView(); }
}
revealSourceAnchor();
window.addEventListener('hashchange', revealSourceAnchor);

const docsNavigation = document.querySelector('.docs-navigation');
if (docsNavigation) {
  const wideDocs = matchMedia('(min-width:1025px)');
  const adaptDocs = () => { docsNavigation.open = wideDocs.matches; };
  adaptDocs(); wideDocs.addEventListener('change', adaptDocs);
}

// An illustrative, local-only walkthrough. All panels remain readable without JS.
for (const story of document.querySelectorAll('[data-memory-story]')) {
  const controls = [...story.querySelectorAll('[data-story-step]')];
  const panels = [...story.querySelectorAll('[data-story-panel]')];
  const play = story.querySelector('[data-story-play]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let timer;
  let playing = false;
  const playText = isTurkish ? 'Akışı oynat' : 'Play the flow';
  const stopText = isTurkish ? 'Duraklat' : 'Pause';
  const stop = () => {
    clearTimeout(timer);
    playing = false;
    story.classList.remove('is-playing');
    play.textContent = playText;
    play.setAttribute('aria-pressed', 'false');
  };
  const show = (index) => {
    current = index;
    story.dataset.step = String(index);
    controls.forEach((control, i) => control.setAttribute('aria-pressed', String(i === index)));
    panels.forEach((panel, i) => {
      panel.hidden = i !== index;
      panel.classList.toggle('intro-enter', i === index);
    });
  };
  const advance = () => {
    timer = setTimeout(() => {
      if (current === panels.length - 1) { stop(); return; }
      show(current + 1);
      advance();
    }, 6500);
  };
  controls.forEach((control, index) => control.addEventListener('click', () => { stop(); show(index); }));
  play.addEventListener('click', () => {
    if (playing) { stop(); return; }
    show(0);
    playing = true;
    play.textContent = stopText;
    play.setAttribute('aria-pressed', 'true');
    story.classList.add('is-playing');
    advance();
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  reduced.addEventListener('change', stop);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) stop(); }).observe(story);
  }
  story.classList.add('is-enhanced');
  play.hidden = false;
  show(0);
  stop();
}

// Course search is a progressive enhancement; all lessons remain static links.
const learningCatalog = document.querySelector('[data-learning-catalog]');
const learningArticle = document.querySelector('[data-learn-article]');
if (learningCatalog || learningArticle) {
  const progressKey = 'mesa-learn-progress-v2';
  let completed = new Set();
  try { const stored=JSON.parse(localStorage.getItem(progressKey)||'[]'); if(Array.isArray(stored))completed=new Set(stored.filter(id=>typeof id==='string')); } catch {}
  const courseIds=[...document.querySelectorAll('[data-lesson-id],[data-nav-lesson]')].map(el=>el.dataset.lessonId||el.dataset.navLesson);
  const refreshProgress=()=>{
    document.querySelectorAll('[data-lesson-id]').forEach(row=>{
      const done=completed.has(row.dataset.lessonId);
      row.classList.toggle('is-complete',done);
      row.querySelector('[data-lesson-complete]').textContent=done?(isTurkish?'✓ Okundu':'✓ Read'):'';
    });
    const count=courseIds.filter(id=>completed.has(id)).length;
    const progress=document.querySelector('[data-learn-progress]');
    if(progress)progress.textContent=isTurkish?`${count} / ${courseIds.length} ders okundu · Bu tarayıcıdaki ilerlemeniz`:`${count} / ${courseIds.length} lessons read · Progress in this browser`;
    const resume=document.querySelector('[data-learn-resume]');
    const unread=[...document.querySelectorAll('[data-lesson-id]')].find(row=>!completed.has(row.dataset.lessonId));
    if(resume&&count>0&&unread) {resume.href=unread.querySelector('[data-lesson-url]').href;resume.textContent=isTurkish?'Kaldığınız yerden devam edin ↗':'Continue your learning path ↗';}
    const mark=document.querySelector('[data-mark-lesson]');
    if(mark){mark.hidden=false;mark.setAttribute('aria-pressed',String(completed.has(mark.dataset.markLesson)));mark.textContent=completed.has(mark.dataset.markLesson)?(isTurkish?'✓ Okundu · geri al':'✓ Read · undo'):(isTurkish?'Okundu işaretle ✓':'Mark as read ✓');}
  };
  document.querySelector('[data-mark-lesson]')?.addEventListener('click',event=>{
    const id=event.currentTarget.dataset.markLesson;
    completed.has(id)?completed.delete(id):completed.add(id);
    let saved=true;try{localStorage.setItem(progressKey,JSON.stringify([...completed]));}catch{saved=false;}
    refreshProgress();
    document.querySelector('[data-lesson-status]').textContent=saved?(isTurkish?'İlerlemeniz bu tarayıcıda güncellendi.':'Your progress was updated in this browser.'):(isTurkish?'İlerleme bu oturum için güncellendi; kalıcı depolama kullanılamıyor.':'Progress updated for this visit; persistent storage is unavailable.');
  });
  refreshProgress();
  const courseNav=document.querySelector('.learn-course-nav');const toc=document.querySelector('.learn-toc');
  if(courseNav){const wide=matchMedia('(min-width:1100px)');const adapt=()=>{courseNav.open=wide.matches;if(toc)toc.open=wide.matches;};adapt();wide.addEventListener('change',adapt);}
  if(learningCatalog) {
    const records=JSON.parse(document.getElementById('learn-catalog-data').textContent);
    const input=document.getElementById('learn-query');const matches=document.querySelector('[data-learn-matches]');
    const rows=new Map([...document.querySelectorAll('[data-lesson-id]')].map(row=>[row.dataset.lessonId,row]));
    let selectedStage='all';
    document.querySelector('[data-learn-controls]').hidden=false;
    const updateCatalog=()=>{
      const terms=searchTerms(input.value);
      const results=records.filter(record=>(selectedStage==='all'||record.stage===selectedStage)&&terms.every(term=>searchText(`${record.title} ${record.summary} ${record.keywords} ${record.sections.map(s=>s.title+' '+s.text).join(' ')}`).includes(term)));
      if(terms.length){
        const relevance=record=>terms.reduce((n,term)=>n+(searchText(record.title).includes(term)?8:0)+(searchText(record.keywords).includes(term)?4:0)+(searchText(record.summary).includes(term)?2:0),0);
        results.sort((a,b)=>relevance(b)-relevance(a));
      }
      const ids=new Set(results.map(r=>r.id));
      for(const [id,row]of rows)row.hidden=!ids.has(id);
      document.querySelectorAll('[data-learn-stage]').forEach(stage=>{stage.hidden=terms.length>0||![...stage.querySelectorAll('[data-lesson-id]')].some(row=>!row.hidden);});
      matches.hidden=!terms.length||!results.length;
      matches.replaceChildren();
      if(terms.length)for(const record of results){
        const section=record.sections.find(s=>terms.every(term=>searchText(s.title+' '+s.text).includes(term)));
        const link=document.createElement('a');const source=rows.get(record.id).querySelector('[data-lesson-url]');link.href=source.href+(section?'#'+section.id:'');
        const strong=document.createElement('strong');strong.textContent=record.title;
        const label=document.createElement('span');label.textContent=section?.title||(isTurkish?'Dersin tamamı':'Full lesson');
        const snippet=document.createElement('p');const full=section?.text||record.summary;let at=terms.length?searchText(full).indexOf(terms[0]):0;at=Math.max(0,at-55);snippet.textContent=(at?'…':'')+full.slice(at,at+220)+(full.length>at+220?'…':'');
        link.append(label,strong,snippet);matches.append(link);
      }
      document.querySelector('[data-learn-results]').textContent=isTurkish?`${results.length} ders${terms.length?' · eşleşen bölüme doğrudan gidin':''}`:`${results.length} lessons${terms.length?' · jump directly to the matching section':''}`;
      document.querySelector('[data-learn-empty]').hidden=results.length>0;
      document.querySelectorAll('[data-stage-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.stageFilter===selectedStage)));
    };
    input.addEventListener('input',updateCatalog);
    document.querySelectorAll('[data-stage-filter]').forEach(button=>button.addEventListener('click',()=>{selectedStage=button.dataset.stageFilter;updateCatalog();}));
    document.querySelector('[data-learn-clear]').addEventListener('click',()=>{input.value='';selectedStage='all';updateCatalog();input.focus();});
    document.querySelectorAll('[data-stage-jump]').forEach(link=>link.addEventListener('click',()=>{input.value='';selectedStage=link.dataset.stageJump;updateCatalog();}));
    updateCatalog();
  }
}

// Advertise the shortcut available on this device. Touch interfaces need no hint.
const appleKeyboard = /Mac|iPad|iPhone/.test(navigator.platform || navigator.userAgent);
const searchShortcut = appleKeyboard ? '⌘ K' : 'Ctrl K';
for (const trigger of document.querySelectorAll('.search-trigger')) {
  trigger.querySelector('.search-shortcut').textContent = searchShortcut;
  trigger.setAttribute('aria-label', (isTurkish ? 'Sitede ara' : 'Search site') + (matchMedia('(pointer: fine)').matches ? ` (${searchShortcut})` : ''));
}
