import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import sync_docs

class SyncTests(unittest.TestCase):
    def test_partial_failure_preserves_cached_repo_exactly(self):
        with tempfile.TemporaryDirectory() as directory:
            manifest=Path(directory)/'manifest.json'
            old={'schemaVersion':1,'updatedAt':'original','repositories':{'test':{'pages':[{'raw_markdown':'verified'}],'commit':'a'*40}}}
            manifest.write_text(json.dumps(old));before=manifest.read_bytes()
            config={'commit':'b'*40,'version_source':'pyproject.toml','allowlist':[{'src':'README.md','slug':'','title':'Overview'}]}
            def read(config,src,local):
                if src=='pyproject.toml': return 'version = "0.1.0"'
                raise OSError('upstream unavailable')
            with patch.object(sync_docs,'read_source',side_effect=read):
                errors=sync_docs.synchronize({'test':config},manifest)
            self.assertTrue(errors);self.assertEqual(before,manifest.read_bytes())

    def test_only_committed_allowlisted_files_imported_and_idempotent(self):
        with tempfile.TemporaryDirectory() as directory:
            repo=Path(directory)/'repo';repo.mkdir()
            for args in [('init','-q'),('config','user.name','Fixture'),('config','user.email','fixture@example.test')]:subprocess.run(['git','-C',str(repo),*args],check=True)
            (repo/'README.md').write_text('# Source\n## Safe\n')
            (repo/'pyproject.toml').write_text('version = "0.1.0"')
            subprocess.run(['git','-C',str(repo),'add','.'],check=True);subprocess.run(['git','-C',str(repo),'commit','-qm','fixture'],check=True)
            sha=subprocess.check_output(['git','-C',str(repo),'rev-parse','HEAD'],text=True).strip()
            (repo/'README.md').write_text('UNCOMMITTED SECRET');(repo/'private.md').write_text('PRIVATE DRAFT')
            config={'repo_url':'https://github.com/Yasou13/MESA.git','commit':sha,'version_source':'pyproject.toml','base_route':'docs/test/','title':{'en':'Test'},'description':{},'allowlist':[{'src':'README.md','slug':'','title':'Overview'}]}
            manifest=Path(directory)/'manifest.json'
            self.assertFalse(sync_docs.synchronize({'test':config},manifest,{'test':repo}))
            before=manifest.read_bytes();self.assertNotIn(b'SECRET',before);self.assertNotIn(b'PRIVATE',before)
            self.assertFalse(sync_docs.synchronize({'test':config},manifest,{'test':repo}));self.assertEqual(before,manifest.read_bytes())

    def test_relative_paths_are_exact_and_code_examples_are_preserved(self):
        md='[API](api.md#details) ![image](images/a.png)\n```md\n[x](api.md)\n```\n`[y](api.md)`'
        result=sync_docs.rewrite_markdown_links(md,'docs/start.md','docs/test/',[{'src':'docs/api.md','slug':'api'}],commit_sha='a'*40)
        self.assertIn('(docs/test/api/#details)',result)
        self.assertIn('/'+'a'*40+'/docs/images/a.png',result)
        self.assertIn('```md\n[x](api.md)\n```',result);self.assertIn('`[y](api.md)`',result)

if __name__=='__main__':unittest.main()
