// "Highlighted passage" mark: faint document lines, one passage marked in amber and tied by a
// thread to its source tag. Decorative and aria-hidden; drawn in when scrolled into view (app.js).
// No text inside, and SVG presentation attributes only (the site CSP blocks inline styles).
export function passageMark(seed = 1, variant = '', {marked: withPassage = true} = {}) {
  let state = seed * 9301 + 49297;
  const next = () => { state = (state * 9301 + 49297) % 233280; return state / 233280; };
  const rows = [];
  let y = 18;
  let bottom = 0;
  const marked = withPassage ? 3 + (seed % 3) : -1;
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

// The home hero drawing: two columns of document lines beside the title, one passage marked on
// the right and tied to its source tag. Same classes as passageMark, so it draws in the same way.
export function heroPassageArt() {
  let state = 7919;
  const random = () => { state = (state * 9301 + 49297) % 233280; return state / 233280; };
  const parts = [];
  for (const [x, width] of [[70, 300], [1080, 300]]) {
    let y = 120;
    while (y < 860) {
      const lines = 3 + Math.floor(random() * 4);
      for (let line = 0; line < lines; line += 1) {
        const w = width * (line === 0 ? .3 + random() * .3 : .55 + random() * .45);
        if (!(x === 1080 && y > 400 && y < 450)) parts.push(`<rect class="pm-line" x="${x}" y="${y}" width="${Math.round(w)}" height="6" rx="3"/>`);
        y += 18;
      }
      y += 26;
    }
  }
  const y = 430;
  parts.push(`<rect class="pm-band" x="1074" y="${y - 7}" width="292" height="20" rx="3"/>`);
  parts.push(`<rect class="pm-hl" x="1080" y="${y}" width="250" height="6" rx="3"/>`);
  parts.push(`<path class="pm-thread" d="M1366 ${y + 3} C1402 ${y + 3} 1402 ${y + 92} 1362 ${y + 110}" pathLength="1"/>`);
  parts.push(`<g class="pm-tag"><rect x="1250" y="${y + 100}" width="110" height="24" rx="4"/><path d="M1262 ${y + 106}h7l4 4v8h-11z"/><rect class="pm-tag-bar" x="1282" y="${y + 109}" width="64" height="5" rx="2.5"/></g>`);
  parts.push(`<rect class="pm-hl pm-hl--soft" x="70" y="250" width="180" height="6" rx="3"/>`);
  return `<div class="passage-mark passage-mark--hero-art" aria-hidden="true"><svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">${parts.join('')}</svg></div>`;
}
