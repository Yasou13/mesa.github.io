import hashlib
import json
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

class BuildTests(unittest.TestCase):
    def test_artifact_prunes_stale_html_without_mutating_dist(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / 'source'
            source.mkdir()
            (source / 'withdrawn').mkdir()
            (source / 'withdrawn/index.html').write_text('PRIVATE_DRAFT_SENTINEL')
            (source / 'keep.webp').write_bytes(b'original asset')
            output = Path(directory) / 'output'
            before = {str(p.relative_to(ROOT/'dist')):hashlib.sha256(p.read_bytes()).hexdigest() for p in (ROOT/'dist').rglob('*') if p.is_file()}
            subprocess.run(['python3', str(ROOT/'scripts/build_site.py'), '--source', str(source), '--output', str(output), '--site-url', 'https://example.test/project/'], cwd=ROOT, check=True, capture_output=True)
            self.assertFalse((output/'withdrawn/index.html').exists())
            self.assertTrue((source/'withdrawn/index.html').exists())
            self.assertEqual((output/'keep.webp').read_bytes(), b'original asset')
            self.assertNotIn('PRIVATE_DRAFT_SENTINEL', (output/'search-index.json').read_text())
            after = {str(p.relative_to(ROOT/'dist')):hashlib.sha256(p.read_bytes()).hexdigest() for p in (ROOT/'dist').rglob('*') if p.is_file()}
            self.assertEqual(before,after)

    def test_withdrawn_article_is_absent_from_html_search_and_sitemap(self):
        with tempfile.TemporaryDirectory() as directory:
            checkout=Path(directory)/'site';checkout.mkdir()
            for folder in ['scripts','content','dist']:
                shutil.copytree(ROOT/folder, checkout/folder)
            shutil.copy2(ROOT/'site-data.json',checkout/'site-data.json')
            hub_path=checkout/'content/hub.json';hub=json.loads(hub_path.read_text())
            entry=hub['entries'][0];entry['draft']=True
            removed_path=entry['path'];removed_id=entry['id']
            hub_path.write_text(json.dumps(hub))
            subprocess.run(['python3','scripts/build_site.py'],cwd=checkout,check=True,capture_output=True)
            for prefix in ['', 'tr/']:
                self.assertFalse((checkout/'_site'/prefix/removed_path/'index.html').exists())
            index=json.loads((checkout/'_site/search-index.json').read_text())
            self.assertFalse(any(item['id'] in [removed_id+'-en',removed_id+'-tr'] for item in index))
            self.assertNotIn('/'+removed_path+'</loc>',(checkout/'_site/sitemap.xml').read_text())

    def test_rejects_source_ancestor_and_repository_root(self):
        with tempfile.TemporaryDirectory() as directory:
            source=Path(directory)/'source';source.mkdir()
            for output in [Path(directory), ROOT, ROOT.parent]:
                result=subprocess.run(['python3',str(ROOT/'scripts/build_site.py'),'--source',str(source),'--output',str(output)],capture_output=True,text=True)
                self.assertNotEqual(result.returncode,0)
                self.assertIn('must not overlap',result.stderr)
            self.assertTrue(source.is_dir())

if __name__ == '__main__': unittest.main()
