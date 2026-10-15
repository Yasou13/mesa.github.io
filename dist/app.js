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
  if (event.key !== 'Escape' || !nav?.classList.contains('open')) return;
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', labels.open);
  toggle.focus();
});

document.querySelectorAll('.copy-button').forEach((button) => {
  button.addEventListener('click', async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    const text = target?.innerText || '';
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = labels.copied;
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(target);
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = labels.selected;
    }
    window.setTimeout(() => { button.textContent = labels.copy; }, 5000);
  });
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

document.querySelectorAll('.scene-media__video').forEach((video) => {
  const layer = video.closest('.scene-media');
  video.addEventListener('error', () => layer?.setAttribute('data-media-state', 'error'));
  video.addEventListener('canplay', () => layer?.setAttribute('data-media-state', 'ready'));
  if (reduceMotion || saveData) {
    video.pause();
    layer?.setAttribute('data-media-state', reduceMotion ? 'reduced-motion' : 'save-data');
    return;
  }
  video.play().catch(() => layer?.setAttribute('data-media-state', 'paused'));
});

/* ====================================================================
   MESA Static Search Modal & Documentation Sidebar
   ==================================================================== */

let searchIndexData = null;
let searchIndexLoading = false;
let searchModalBackdrop = null;
let searchInput = null;
let searchResultsList = null;
let selectedResultIndex = -1;

function createSearchModal() {
  if (searchModalBackdrop) return;
  const placeholder = isTurkish ? 'Makale veya doküman ara...' : 'Search articles and documentation...';
  const emptyText = isTurkish ? 'Eşleşen sonuç bulunamadı.' : 'No matching results found.';

  const backdrop = document.createElement('div');
  backdrop.className = 'search-modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-label', isTurkish ? 'Arama' : 'Search');

  backdrop.innerHTML = `
    <div class="search-modal-dialog">
      <div class="search-input-wrapper">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="search" class="search-input" placeholder="${placeholder}" aria-label="${placeholder}" autocomplete="off" spellcheck="false">
        <kbd class="search-shortcut">ESC</kbd>
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
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    const base = depth ? '../'.repeat(depth) : './';
    const res = await fetch(`${base}search-index.json`);
    if (res.ok) {
      searchIndexData = await res.json();
    }
  } catch (err) {
    console.warn('Could not load search index', err);
  } finally {
    searchIndexLoading = false;
  }
  return searchIndexData;
}

function openSearchModal() {
  createSearchModal();
  searchModalBackdrop.classList.add('open');
  searchInput.value = '';
  selectedResultIndex = -1;
  searchInput.focus();
  loadSearchIndex();
}

function closeSearchModal() {
  if (!searchModalBackdrop) return;
  searchModalBackdrop.classList.remove('open');
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
  const q = query.toLowerCase();

  const results = searchIndexData
    .filter((item) => (item.language === lang || !item.language) && (
      item.title.toLowerCase().includes(q) ||
      (item.summary && item.summary.toLowerCase().includes(q)) ||
      (item.section && item.section.toLowerCase().includes(q)) ||
      (item.keywords && item.keywords.some((k) => k.toLowerCase().includes(q)))
    ))
    .slice(0, 10);

  if (!results.length) {
    searchResultsList.innerHTML = `<li class="search-result-empty">${isTurkish ? 'Eşleşen sonuç bulunamadı.' : 'No matching results found.'}</li>`;
    selectedResultIndex = -1;
    return;
  }

  // Calculate relative base
  const depth = window.location.pathname.split('/').filter(Boolean).length;
  const base = depth ? '../'.repeat(depth) : './';

  searchResultsList.innerHTML = results.map((item, idx) => {
    const itemHref = `${base}${item.url}`;
    return `<li class="search-result-item${idx === 0 ? ' active' : ''}" role="option">
      <a href="${itemHref}">
        <div class="search-result-meta">
          <span class="search-result-section">${escapeText(item.section || 'MESA')}</span>
        </div>
        <div class="search-result-title">${escapeText(item.title)}</div>
        ${item.summary ? `<div class="search-result-summary">${escapeText(item.summary)}</div>` : ''}
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
  const text = target?.innerText || '';
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
