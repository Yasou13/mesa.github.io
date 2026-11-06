// One page-level canvas, drawn as a single inline SVG: "mesa topography", contour lines of a
// flat-topped plateau. Content sits on opaque panels above it, so lines never run behind text.
// The "highlighted passage" motif is a separate component (passage_mark.mjs).
// Shapes are seeded by the page variant, so builds are stable. The layer is decorative and
// aria-hidden; it uses SVG presentation attributes only (the site CSP blocks inline styles).

const VARIANT_MAP = {
  '': 'home',
  mesa: 'core',
  data: 'data',
  law: 'law',
  ecosystem: 'ecosystem',
  qa: 'quiet',
  certification: 'quiet',
  evaluation: 'quiet',
  docs: 'reading',
  learn: 'reading',
  research: 'reading',
  guides: 'reading',
  glossary: 'reading',
  methodology: 'reading',
  admin: 'admin'
};

const VALID_VARIANTS = new Set([
  'home',
  'core',
  'data',
  'law',
  'ecosystem',
  'quiet',
  'reading',
  'admin'
]);

const WIDTH = 1440;
const HEIGHT = 900;
const LINE = 'rgba(255,255,255,.07)';
const ACCENT = 'rgba(227,181,122,';

function seededRandom(text) {
  let state = 2166136261;
  for (const character of text) state = Math.imul(state ^ character.charCodeAt(0), 16777619);
  return () => {
    state = Math.imul(state ^ (state >>> 15), 2246822507);
    state = Math.imul(state ^ (state >>> 13), 3266489909);
    state ^= state >>> 16;
    return (state >>> 0) / 4294967296;
  };
}

const n = value => Math.round(value * 10) / 10;

// Mesa topography: nested contours of a plateau with a flattened top, in two corners.
function contour(cx, cy, rx, ry, phase, amplitude) {
  const points = [];
  for (let k = 0; k < 96; k += 1) {
    const t = (2 * Math.PI * k) / 96;
    const r = 1 + amplitude * (Math.sin(3 * t + phase) * .5 + Math.sin(5 * t + phase * 1.7) * .3 + Math.sin(2 * t - phase) * .2);
    const flatten = Math.sin(t) < 0 ? .55 : 1;
    points.push(`${n(cx + rx * r * Math.cos(t))},${n(cy + ry * r * Math.sin(t) * flatten)}`);
  }
  return `M${points.join('L')}Z`;
}

function topography(random, quiet) {
  const parts = [];
  // Plateaus spread over the canvas so the margins between content panels always show some lines.
  const plateaus = [
    [1180 + random() * 160, 760 + random() * 90, 520 + random() * 60, 11],
    [140 + random() * 120, 80 + random() * 60, 380 + random() * 40, 9],
    [-40 + random() * 80, 760 + random() * 80, 300 + random() * 40, 7],
    [1400 + random() * 60, 120 + random() * 80, 280 + random() * 40, 7]
  ];
  plateaus.forEach(([cx, cy, base, rings], index) => {
    const phase = random() * 3;
    const accentRing = quiet || index > 0 ? -1 : rings - 3;
    for (let ring = 0; ring < rings; ring += 1) {
      const scale = 1 - ring / (rings + 1);
      const stroke = ring === accentRing ? `${ACCENT}.3)` : LINE;
      parts.push(`<path d="${contour(cx, cy, base * scale * 1.25, base * scale * .8, phase + ring * .18, .1 + .02 * ring)}" fill="none" stroke="${stroke}" stroke-width="1"/>`);
    }
  });
  return parts.join('');
}

export function cosmicVariant(route = '') {
  const page = route.replace(/^tr\//, '').split('/')[0];
  return VARIANT_MAP[page] || 'core';
}

export function cosmicEnvironment(variant = 'core') {
  if (!VALID_VARIANTS.has(variant)) {
    throw new Error('Unknown cosmic variant');
  }
  const random = seededRandom(`mesa-${variant}`);
  // The home page draws its own passage motif (render_intro.mjs); its canvas stays plain.
  const art = variant === 'home' ? '' : topography(random, variant === 'reading' || variant === 'admin');
  return `<div class="cosmic cosmic--${variant}" aria-hidden="true"><div class="cosmic__field"><svg class="cosmic__art" viewBox="0 0 ${WIDTH} ${HEIGHT}" preserveAspectRatio="xMidYMid slice" focusable="false">${art}</svg><div class="cosmic__illumination"></div></div></div>`;
}
