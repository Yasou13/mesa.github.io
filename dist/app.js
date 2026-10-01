const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-navigation');

toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

document.querySelectorAll('.copy-button').forEach((button) => {
  button.addEventListener('click', async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    const text = target?.innerText || '';
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = 'Copied';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(target);
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = 'Selected';
    }
    window.setTimeout(() => { button.textContent = 'Copy'; }, 5000);
  });
});
