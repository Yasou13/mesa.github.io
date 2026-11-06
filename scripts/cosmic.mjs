// One page-level environment: a faint grid with a few "evidence blocks".
// Block placement is seeded by the page variant, so every page is stable between
// builds and nothing looks random. The layer is decorative and aria-hidden.
// Positions are classes (cx/cy) because the site CSP blocks inline styles.

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

// Small cluster shapes, in grid cells: [column, row].
const SHAPES = [
  [[0, 0], [1, 0], [0, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 2]],
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [1, 0], [1, 1], [2, 1]],
  [[0, 0], [1, 0], [0, 1], [1, 1]],
  [[1, 0], [0, 1], [1, 1], [2, 1]],
  [[0, 0]],
  [[0, 0], [1, 1]]
];

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

function evidenceBlocks(variant) {
  const random = seededRandom(`mesa-${variant}`);
  const clusters = variant === 'home' ? 9 : variant === 'reading' || variant === 'admin' ? 4 : 6;
  const accentClusters = new Set([Math.floor(random() * clusters), Math.floor(random() * clusters)]);
  const cells = [];
  for (let index = 0; index < clusters; index += 1) {
    const shape = SHAPES[Math.floor(random() * SHAPES.length)];
    // Keep blocks to the sides so they never sit behind the main reading column.
    const side = index % 2 === 0 ? -1 : 1;
    const column = side < 0 ? -15 + Math.floor(random() * 6) : 8 + Math.floor(random() * 6);
    const row = 1 + Math.floor(random() * 13);
    const tone = accentClusters.has(index) ? 'accent' : random() > .5 ? 'strong' : 'soft';
    for (const [x, y] of shape) cells.push({ x: column + x, y: row + y, tone, pulse: random() > .82 });
  }
  return cells.map(({ x, y, tone, pulse }) =>
    `<i class="cosmic__block cosmic__block--${tone} cx${x < 0 ? `m${-x}` : x} cy${y}${pulse ? ' cosmic__block--pulse' : ''}"></i>`
  ).join('');
}

export function cosmicVariant(route = '') {
  const page = route.replace(/^tr\//, '').split('/')[0];
  return VARIANT_MAP[page] || 'core';
}

export function cosmicEnvironment(variant = 'core') {
  if (!VALID_VARIANTS.has(variant)) {
    throw new Error('Unknown cosmic variant');
  }
  return `<div class="cosmic cosmic--${variant}" aria-hidden="true"><div class="cosmic__field">${evidenceBlocks(variant)}<div class="cosmic__illumination"></div></div></div>`;
}
