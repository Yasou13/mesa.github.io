import base64
import json
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from check_public_artifact import credential_types

class ArtifactTests(unittest.TestCase):
    def test_recognizes_privileged_material_but_allows_public_key_placeholders(self):
        self.assertEqual(credential_types('SUPABASE_ANON_KEY=YOUR_PUBLIC_KEY'),set())
        self.assertIn('github-token',credential_types('ghp_'+'a'*36))
        payload=base64.urlsafe_b64encode(json.dumps({'role':'service_role'}).encode()).decode().rstrip('=')
        self.assertIn('service-role-jwt',credential_types('eyJhbGciOiJIUzI1NiJ9.'+payload+'.signature'))

if __name__=='__main__':unittest.main()
