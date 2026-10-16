/* Optional atmosphere only: no scroll loop, geometry updates or Auth dependency. */
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const update = () => {
    document.documentElement.dataset.cosmicMotion =
      !document.hidden && !preference.matches && !connection?.saveData ? 'on' : 'off';
  };
  document.addEventListener('visibilitychange', update);
  preference.addEventListener('change', update);
  connection?.addEventListener('change', update);
  update();
})();
