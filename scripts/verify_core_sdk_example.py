#!/usr/bin/env python3
"""Execute the published website snippet through the released SDK and request schemas.

Usage: <Core environment python> scripts/verify_core_sdk_example.py --source /tmp/release-copy
The HTTP transport is a deterministic contract fixture, never a real-provider run.
"""
import argparse
import contextlib
import io
import json
import os
from pathlib import Path
import re
import sys
from unittest.mock import patch

parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path, required=True)
args = parser.parse_args()
sys.path.insert(0, str(args.source.resolve()))
import httpx
from mesa_client import MesaV4Client
from mesa_api.v4_router import V4SessionStartRequest, V4MemoryInsertRequest, V4SearchRequest

root = Path(__file__).resolve().parents[1]
text = (root/'content/docs/guides/en/examples.md').read_text()
snippet = re.search(r'```python\n(.*?)```', text, re.S).group(1)
assert snippet == re.search(r'```python\n(.*?)```', (root/'content/docs/guides/tr/examples.md').read_text(), re.S).group(1)
real_init = MesaV4Client.__init__
observed = []
terminal_state = 'COMMITTED'

def transport(request):
    assert request.headers['X-API-Key'] == 'fixture-only-credential'
    payload = json.loads(request.content) if request.content else None
    observed.append((request.method, request.url.path))
    if request.url.path == '/v4/sessions/start':
        V4SessionStartRequest.model_validate(payload)
        return httpx.Response(200, json={'session_id':'docs-session'})
    if request.url.path == '/v4/memory/insert':
        V4MemoryInsertRequest.model_validate(payload)
        assert payload['content'] == 'The archive opens at nine on weekdays.'
        assert payload['finalize_revision'] is True
        return httpx.Response(202, json={'mutation_id':'docs-mutation'})
    if request.url.path == '/v4/mutations/docs-mutation':
        return httpx.Response(200, json={'state':terminal_state})
    if request.url.path == '/v4/memory/search':
        V4SearchRequest.model_validate(payload)
        return httpx.Response(200, json={'results':[]})
    raise AssertionError(request.url.path)

def fixture_init(self,*args,**kwargs):
    real_init(self,*args,**kwargs)
    self._client.close()
    self._client=httpx.Client(base_url=self.base_url, headers={'X-API-Key':'fixture-only-credential'}, transport=httpx.MockTransport(transport))

with patch.dict(os.environ, {'MESA_API_KEY':'fixture-only-credential'}), patch.object(MesaV4Client,'__init__',fixture_init), contextlib.redirect_stdout(io.StringIO()):
    exec(compile(snippet, 'website-v4-example', 'exec'), {})
    assert observed == [('POST','/v4/sessions/start'),('POST','/v4/memory/insert'),('GET','/v4/mutations/docs-mutation'),('POST','/v4/memory/search')]
    terminal_state='REJECTED'
    try:
        exec(compile(snippet, 'website-v4-example', 'exec'), {})
    except RuntimeError as error:
        assert str(error)=='REJECTED'
    else:
        raise AssertionError('The sample accepted failed terminal state')
print('PASS: identical EN/TR snippet; released SDK requests validate against real V4 schemas; COMMITTED path and REJECTED guard checked using fixture HTTP transport (no real provider).')
