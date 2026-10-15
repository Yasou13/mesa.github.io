import test from 'node:test';
import assert from 'node:assert/strict';
import { renderMarkdown, renderInlineMarkdown } from '../markdown_engine.mjs';
test('hostile content cannot create active HTML or unsafe destinations', () => {
  for (const source of ['<script>alert(1)</script>', '[x](javascript:alert(1))', '[x](data:text/html,evil)', '![x](javascript:evil)', '[x](https://x/`onmouseover=evil`)', '[x](//evil.test)', '[x](https://x/"onmouseover="evil)']) {
    const html = renderMarkdown(source).html;
    assert.doesNotMatch(html, /<script|<a[^>]+href="(?:javascript|data|\/\/)|<[^>]+\sonmouseover=/i);
  }
  assert.match(renderInlineMarkdown('[safe](https://example.com/?x="quoted")'), /&quot;/);
});
test('code remains literal; duplicate headings receive distinct anchors', () => {
  assert.equal(renderInlineMarkdown('`**literal** $x$`'), '<code class="inline-code">**literal** $x$</code>');
  const result=renderMarkdown('## Türkçe başlık\n## Türkçe başlık\n```js\nconst literal = "<script>";');
  assert.deepEqual(result.headings.map(h=>h.id), ['turkce-baslik', 'turkce-baslik-1']);
  assert.match(result.html, /const literal = &quot;&lt;script&gt;&quot;/);
});
test('checklists, tables, images, captions and literal math render safely', () => {
  const html=renderMarkdown('- [x] done\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n![alt](media/p.png "Caption")\n\n$$x^2$$', {route:p=>'../../'+p}).html;
  assert.match(html, /<input type="checkbox" disabled checked>/);
  assert.match(html, /<table>/);assert.match(html, /src="..\/..\/media\/p.png"/);assert.match(html, /<figcaption>Caption/);assert.match(html, /role="math"/);
});
