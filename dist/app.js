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
