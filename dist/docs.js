// Loaded only on documentation routes; shared locale labels come from app.js.
// Keep the selected article visible in the independently scrolling desktop rail.
if (matchMedia('(min-width:1025px)').matches) {
  const rail = document.querySelector('.docs-nav');
  const active = rail?.querySelector('[aria-current="page"]');
  if (active) {
    const offset = active.getBoundingClientRect().top - rail.getBoundingClientRect().top;
    if (offset > rail.clientHeight * .7) rail.scrollTop = offset - rail.clientHeight * .4;
  }
}

// Documentation page actions use maintained Markdown when available.
const docsCopyPage = document.querySelector('.docs-copy-page');
if (docsCopyPage) {
  docsCopyPage.hidden = false;
  const copyLabel = docsCopyPage.querySelector('span');
  const originalLabel = copyLabel.textContent;
  let copyReset;
  docsCopyPage.addEventListener('click', async () => {
    const markdown = document.querySelector('[data-doc-copy]');
    const content = document.querySelector('[data-doc-copy-content]');
    const text = markdown ? JSON.parse(markdown.textContent) : content.innerText.replace(originalLabel, '').trim();
    try {
      await navigator.clipboard.writeText(text);
      copyLabel.textContent = labels.copied;
    } catch {
      copyLabel.textContent = isTurkish ? 'Kopyalanamadı' : 'Could not copy';
    }
    clearTimeout(copyReset);
    copyReset = setTimeout(() => { copyLabel.textContent = originalLabel; }, 2500);
  });
}

// Track the section crossing the reading line, including deep-linked guides.
const docsTocLinks = [...document.querySelectorAll('.docs-toc-column .article-toc a[href^="#"]')];
if (docsTocLinks.length) {
  const sections = docsTocLinks.map(link => document.getElementById(decodeURIComponent(link.hash.slice(1))));
  let updatePending = false;
  const updateDocsSection = () => {
    let active = 0;
    sections.forEach((section, index) => { if (section?.getBoundingClientRect().top <= 210) active = index; });
    docsTocLinks.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    updatePending = false;
  };
  addEventListener('scroll', () => {
    if (!updatePending) { updatePending = true; requestAnimationFrame(updateDocsSection); }
  }, {passive: true});
  updateDocsSection();
}
