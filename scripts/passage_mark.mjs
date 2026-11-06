// "Highlighted passage" mark: faint document lines, one passage marked in amber and tied by a
// thread to its source tag. Decorative and aria-hidden; drawn in when scrolled into view (app.js).
// No text inside, and SVG presentation attributes only (the site CSP blocks inline styles).
export function passageMark(seed = 1, variant = '') {
  let state = seed * 9301 + 49297;
  const next = () => { state = (state * 9301 + 49297) % 233280; return state / 233280; };
  const rows = [];
  let y = 18;
  let bottom = 0;
  const marked = 3 + (seed % 3);
  for (let index = 0; index < 10; index += 1) {
    if (index === 4) y += 14;
    const width = index === marked ? 250 : Math.round(110 + next() * 200);
    if (index === marked) {
      rows.push(`<rect class="pm-band" x="0" y="${y - 7}" width="300" height="20" rx="4"/>`);
      rows.push(`<rect class="pm-hl" x="8" y="${y}" width="${width}" height="6" rx="3"/>`);
      rows.push(`<path class="pm-thread" d="M300 ${y + 3} C330 ${y + 3} 334 ${y + 92} 300 ${y + 116}" pathLength="1"/>`);
      bottom = y + 140;
      rows.push(`<g class="pm-tag"><rect x="190" y="${y + 104}" width="110" height="26" rx="5"/><path d="M202 ${y + 110}h7l4 4v8h-11z"/><rect class="pm-tag-bar" x="222" y="${y + 114}" width="64" height="5" rx="2.5"/></g>`);
    } else {
      rows.push(`<rect class="pm-line" x="8" y="${y}" width="${width}" height="6" rx="3"/>`);
    }
    y += 18;
  }
  return `<div class="passage-mark${variant ? ` passage-mark--${variant}` : ''}" aria-hidden="true"><svg viewBox="0 0 340 ${Math.max(y + 20, bottom)}" focusable="false">${rows.join('')}</svg></div>`;
}
