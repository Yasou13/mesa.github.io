// One page-level environment. Original astronomical textures preserve fine gas
// structures; CSS owns composition, lighting and motion. No procedural cloud filter.
export function cosmicVariant(route = '') {
  const page = route.replace(/^tr\//, '').split('/')[0];
  return ({'': 'home', mesa: 'core', data: 'data', law: 'law', ecosystem: 'ecosystem',
    qa: 'quiet', certification: 'quiet', evaluation: 'quiet', docs: 'reading',
    learn: 'reading', research: 'reading', guides: 'reading', glossary: 'reading',
    methodology: 'reading', admin: 'admin'})[page] || 'core';
}
export function cosmicEnvironment(variant = 'core') {
  if (!['home','core','data','law','ecosystem','quiet','reading','admin'].includes(variant)) throw new Error('Unknown cosmic variant');
  return `<div class="cosmic cosmic--${variant}" aria-hidden="true"><div class="cosmic__field"><div class="cosmic__illumination"></div></div></div>`;
}
