"""Regression checks against generated HTML, rather than renderer string shapes."""
import json
import re
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


class SeoTests(unittest.TestCase):
    def test_generated_metadata_and_crawl_regressions(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / 'site'
            subprocess.run(['python3', 'scripts/build_site.py', '--output', str(output),
                            '--site-url', 'https://example.test/project/'],
                           cwd=ROOT, check=True, capture_output=True)

            def check():
                return subprocess.run(['python3', 'scripts/check_site.py', str(output)],
                                      cwd=ROOT, capture_output=True, text=True)

            result = check()
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

            def change_schema(text, mutate):
                match = re.search(r'<script type="application/ld\+json">(.*?)</script>', text)
                graph = json.loads(match[1])
                mutate(graph['@graph'])
                return text[:match.start(1)] + json.dumps(graph) + text[match.end(1):]

            mutations = [
                ('index.html', lambda s: s.replace('</head>', '<meta name="robots" content="noindex"></head>'), 'restrictive robots'),
                ('sitemap.xml', lambda s: s.replace('</urlset>', '<url><loc>https://example.test/project/admin/</loc></url></urlset>'), 'exactly the public canonical'),
                ('sitemap.xml', lambda s: s.replace('</urlset>', ''), 'not valid XML'),
                ('robots.txt', lambda s: 'User-agent: OAI-SearchBot\nDisallow: /\n\n' + s, 'blocks a public canonical'),
                ('index.html', lambda s: change_schema(s, lambda nodes: next(n for n in nodes if n['@type'] == 'WebPage').update(description='Wrong page')), 'WebPage does not match'),
                ('docs/core/index.html', lambda s: change_schema(s, lambda nodes: next(n for n in nodes if n['@type'] == 'BreadcrumbList')['itemListElement'].append({'@type': 'ListItem', 'position': 4, 'name': 'Duplicate', 'item': 'https://example.test/project/docs/core/'})), 'invalid breadcrumb hierarchy'),
                ('learn/what-is-ai-memory/index.html', lambda s: change_schema(s, lambda nodes: next(n for n in nodes if n['@type'] == 'Article').update(author={'@type': 'Person', 'name': 'UNVERIFIED_AUTHOR'})), 'Schema author is not visible'),
                ('learn/what-is-ai-memory/index.html', lambda s: change_schema(s, lambda nodes: next(n for n in nodes if n['@type'] == 'Article').update(datePublished='2000-01-01')), 'datePublished is not visible'),
                ('learn/what-is-ai-memory/index.html', lambda s: s.replace('class="table-scroll" tabindex="0"', 'class="table-scroll"'), 'table is not keyboard focusable'),
            ]
            for relative, mutate, message in mutations:
                with self.subTest(relative=relative, expected=message):
                    file = output / relative
                    original = file.read_text()
                    try:
                        file.write_text(mutate(original))
                        result = check()
                        self.assertNotEqual(result.returncode, 0)
                        self.assertIn(message, result.stdout)
                    finally:
                        file.write_text(original)


if __name__ == '__main__':
    unittest.main()
