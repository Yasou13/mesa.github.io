// One decorative environment per document. All geometry is code, no bitmap assets.
export function cosmicVariant(route = '') {
  const page = route.replace(/^tr\//, '').split('/')[0];
  return ({'': 'home', mesa: 'core', data: 'data', law: 'law', ecosystem: 'ecosystem',
    qa: 'quiet', certification: 'quiet', evaluation: 'quiet', docs: 'reading',
    learn: 'reading', research: 'reading', guides: 'reading', glossary: 'reading',
    methodology: 'reading', admin: 'admin'})[page] || 'core';
}
export function cosmicEnvironment(variant = 'core') {
  if (!['home','core','data','law','ecosystem','quiet','reading','admin'].includes(variant)) throw new Error('Unknown cosmic variant');
  // Seeded sparse stars: stable between navigations, clustered away from copy.
  let seed = 621;
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const stars = Array.from({length: 45}, () => {
    const x = Math.round(380 + random() * 1000), y = Math.round(random() * 900);
    return `<circle cx="${x}" cy="${y}" r="${(.3 + random() * .6).toFixed(2)}" opacity="${(.16 + random() * .32).toFixed(2)}"/>`;
  }).join('');
  return `<div class="cosmic cosmic--${variant}" aria-hidden="true">
  <svg class="cosmic__field" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false">
  <defs>
    <radialGradient id="cosmic-light" cx="72%" cy="45%" r="64%"><stop stop-color="#7d739d" stop-opacity=".7"/><stop offset=".38" stop-color="#354967" stop-opacity=".6"/><stop offset="1" stop-color="#0b101b" stop-opacity="0"/></radialGradient>
    <linearGradient id="cosmic-edge" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#8ea5ae" stop-opacity="0"/><stop offset=".6" stop-color="#8b9ccb" stop-opacity=".55"/><stop offset="1" stop-color="#9b8acb" stop-opacity="0"/></linearGradient>
    <linearGradient id="cosmic-fade"><stop stop-color="white" stop-opacity="0"/><stop offset=".48" stop-color="white" stop-opacity=".2"/><stop offset=".78" stop-color="white" stop-opacity="1"/></linearGradient>
    <filter id="cosmic-cloud" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency=".008 .018" numOctaves="5" seed="23"/>
      <feColorMatrix type="matrix" values="0 0 0 0 .44 0 0 0 0 .48 0 0 0 0 .64 0 0 0 3.8 -1.65"/>
      <feComposite in2="SourceGraphic" operator="in"/>
    </filter>
    <filter id="cosmic-ridge" x="-20%" y="-40%" width="140%" height="180%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency=".009 .023" numOctaves="3" seed="9" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="86" xChannelSelector="R" yChannelSelector="G"/>
      <feGaussianBlur stdDeviation="1.8"/>
    </filter>
    <mask id="cosmic-mask"><rect width="1440" height="900" fill="url(#cosmic-fade)"/></mask>
  </defs>
  <g mask="url(#cosmic-mask)">
    <rect width="1440" height="900" fill="url(#cosmic-light)" opacity=".17"/>
    <rect width="1440" height="900" fill="url(#cosmic-light)" filter="url(#cosmic-cloud)"/>
    <g filter="url(#cosmic-ridge)" fill="none">
      <path d="M310 880C580 650 520 670 810 480S1120 420 1470 100" stroke="url(#cosmic-edge)" stroke-width="36" opacity=".14"/>
      <path d="M340 800C660 680 650 420 890 440S1120 190 1440 170" stroke="#070a11" stroke-width="22" opacity=".35"/>
      <path d="M380 810C680 630 650 450 900 450S1160 200 1440 160" stroke="url(#cosmic-edge)" stroke-width="3" opacity=".25"/>
      <path d="M730 890C760 650 940 610 1040 430S1280 210 1430 260" stroke="url(#cosmic-edge)" stroke-width="13" opacity=".24"/>
    </g>
  </g>
  <g fill="#b1c1d5" class="cosmic__stars">${stars}</g>
  </svg><div class="cosmic__breath"></div></div>`;
}
