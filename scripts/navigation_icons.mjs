// Official, pinned SVG assets; licenses are also shipped in dist/licenses/.
import fs from 'node:fs';
const names = ['workflow', 'network', 'layers', 'library', 'book-open', 'search'];
const svgs = new Map(names.map(name => [name, fs.readFileSync(new URL(`./vendor/lucide/${name}.svg`, import.meta.url), 'utf8')]));
svgs.set('github', fs.readFileSync(new URL('./vendor/github/github-mark.svg', import.meta.url), 'utf8'));
export function navigationIcon(name) {
  const svg = svgs.get(name);
  if (!svg) throw new Error(`Unknown navigation icon: ${name}`);
  const className = name === 'github' ? 'icon-github' : 'lucide-icon';
  return svg.trim().replace(/<svg\b/, `<svg class="mesa-icon ${className}" data-nav-icon="${name}" aria-hidden="true" focusable="false"`).replace(/\n\s*/g, ' ');
}
