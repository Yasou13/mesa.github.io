// One page-level environment, drawn as a single inline SVG. Two motifs, both MESA's own:
// - home: "highlighted passage" — faint document lines with one amber passage linked to its source;
// - every other page: "mesa topography" — contour lines of a flat-topped plateau (mesa).
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
const LINE = 'rgba(255,255,255,.055)';
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

// Highlighted passage: two columns of document lines, one passage marked and tied to a source tag.
function passage(random) {
  const parts = [];
  for (const [x, width] of [[70, 300], [1080, 300]]) {
    let y = 120;
    while (y < 860) {
      const lines = 3 + Math.floor(random() * 4);
      for (let line = 0; line < lines; line += 1) {
        const w = width * (line === 0 ? .3 + random() * .3 : .55 + random() * .45);
        parts.push(`<rect x="${x}" y="${y}" width="${Math.round(w)}" height="6" rx="3" fill="${LINE}"/>`);
        y += 18;
      }
      y += 26;
    }
  }
  const y = 430;
  parts.push(`<rect x="1074" y="${y - 7}" width="292" height="20" rx="3" fill="${ACCENT}.12)"/>`);
  parts.push(`<rect class="cosmic__passage" x="1080" y="${y}" width="250" height="6" rx="3" fill="${ACCENT}.62)"/>`);
  parts.push(`<path class="cosmic__thread" d="M1366 ${y + 3} C1402 ${y + 3} 1402 ${y + 92} 1362 ${y + 110}" fill="none" stroke="${ACCENT}.45)" stroke-width="1" pathLength="1"/>`);
  parts.push(`<rect x="1250" y="${y + 100}" width="110" height="24" rx="4" fill="none" stroke="${ACCENT}.45)"/>`);
  parts.push(`<path d="M1262 ${y + 106}h7l4 4v8h-11z" fill="none" stroke="${ACCENT}.6)" stroke-width="1"/>`);
  parts.push(`<rect x="1282" y="${y + 109}" width="64" height="5" rx="2.5" fill="${ACCENT}.5)"/>`);
  parts.push(`<rect x="70" y="250" width="180" height="6" rx="3" fill="${ACCENT}.25)"/>`);
  return parts.join('');
}

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
  const plateaus = [
    [1150 + random() * 160, 760 + random() * 90, 500 + random() * 60, 11],
    [120 + random() * 120, 60 + random() * 60, 360 + random() * 40, 8]
  ];
  for (const [cx, cy, base, rings] of plateaus) {
    const phase = random() * 3;
    const accentRing = quiet ? -1 : rings - 3;
    for (let ring = 0; ring < rings; ring += 1) {
      const scale = 1 - ring / (rings + 1);
      const stroke = ring === accentRing ? `${ACCENT}.28)` : LINE;
      parts.push(`<path d="${contour(cx, cy, base * scale * 1.25, base * scale * .8, phase + ring * .18, .1 + .02 * ring)}" fill="none" stroke="${stroke}" stroke-width="1"/>`);
    }
  }
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
  const art = variant === 'home' ? passage(random) : topography(random, variant === 'reading' || variant === 'admin');
  return `<div class="cosmic cosmic--${variant}" aria-hidden="true"><div class="cosmic__field"><svg class="cosmic__art" viewBox="0 0 ${WIDTH} ${HEIGHT}" preserveAspectRatio="xMidYMid slice" focusable="false">${art}</svg><div class="cosmic__illumination"></div></div></div>`;
}
