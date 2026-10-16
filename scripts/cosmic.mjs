// One page-level environment. Original astronomical textures preserve fine gas
// structures; CSS owns composition, lighting and motion. No procedural cloud filter.

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

export function cosmicVariant(route = '') {
  const page = route.replace(/^tr\//, '').split('/')[0];
  return VARIANT_MAP[page] || 'core';
}

export function cosmicEnvironment(variant = 'core') {
  if (!VALID_VARIANTS.has(variant)) {
    throw new Error('Unknown cosmic variant');
  }
  return `<div class="cosmic cosmic--${variant}" aria-hidden="true"><div class="cosmic__field"><div class="cosmic__illumination"></div></div></div>`;
}

