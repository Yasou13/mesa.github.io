// Copy button for the browser view of the changelog RSS feed.
(() => {
  const button = document.getElementById('feed-copy');
  const address = document.getElementById('feed-url');
  if (!button || !address || !navigator.clipboard) return;
  const label = button.textContent;
  let timer;
  button.removeAttribute('hidden');
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(address.textContent);
      button.textContent = button.getAttribute('data-done');
      clearTimeout(timer);
      timer = setTimeout(() => { button.textContent = label; }, 2000);
    } catch {
      getSelection().selectAllChildren(address);
    }
  });
})();
