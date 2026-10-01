const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-navigation');
const isTurkish = document.documentElement.lang === 'tr';
const labels = isTurkish
  ? { open: 'Menüyü aç', close: 'Menüyü kapat', copied: 'Kopyalandı', selected: 'Seçildi', copy: 'Kopyala' }
  : { open: 'Open navigation', close: 'Close navigation', copied: 'Copied', selected: 'Selected', copy: 'Copy' };

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? labels.close : labels.open);
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
