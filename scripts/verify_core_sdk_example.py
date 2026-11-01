#!/usr/bin/env python3
"""Execute paired website examples against the pinned SDK with fixture HTTP.

Usage: <Core environment python> scripts/verify_core_sdk_example.py --source /tmp/release-copy
No live server, provider, credentials, or persistent user storage is used.
"""
import argparse
import contextlib
import io
import json
import os
from pathlib import Path
import re
import sys
import tempfile
from unittest.mock import patch

parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path, required=True)
args = parser.parse_args()
sys.path.insert(0, str(args.source.resolve()))
import httpx
from mesa_client import Mesa, MesaV4Client, MesaClientError
from mesa_api.v4_router import V4SessionStartRequest, V4MemoryInsertRequest, V4SearchRequest, V4DocumentIngestRequest

root = Path(__file__).resolve().parents[1]


def paired_snippets(guide):
    texts = [(root / f'content/docs/guides/{lang}/{guide}.md').read_text() for lang in ('en', 'tr')]
    snippets = [re.findall(r'```python\n(.*?)```', text, re.S) for text in texts]
    assert snippets[0] == snippets[1], f'EN/TR Python examples differ: {guide}'
    return snippets[0]


v4_snippet, local_snippet = paired_snippets('examples')
[completion_snippet] = paired_snippets('getting-started')
real_init = MesaV4Client.__init__
observed = []
terminal_state = 'COMMITTED'
pending_polls = 0
admitted = {}


def transport(request):
    global pending_polls
    assert request.headers['X-API-Key'] == 'fixture-only-credential'
    payload = json.loads(request.content) if request.content else None
    observed.append((request.method, request.url.path))
    if request.url.path == '/v4/sessions/start':
        V4SessionStartRequest.model_validate(payload)
        return httpx.Response(200, json={'session_id': 'docs-session'})
    if request.url.path in ('/v4/catalog/workspaces', '/v4/catalog/datasets'):
        return httpx.Response(200, json={})
    if request.url.path == '/v4/documents':
        V4DocumentIngestRequest.model_validate(payload)
        assert payload['content'] in {
            'The archive opens at nine on weekdays.',
            'The archive opens at nine.', 'Another document.',
        }
        admitted[payload['source_ref']] = payload['document_id']
        return httpx.Response(202, json={
            'document_id': payload['document_id'], 'revision_id': 'docs-revision',
            'revision_number': 1, 'chunk_count': 1, 'mutation_ids': ['docs-mutation'],
        })
    if request.url.path == '/v4/catalog/revisions':
        assert request.url.params['document_id'] in admitted.values()
        status = 'PENDING' if pending_polls else 'ACTIVE'
        pending_polls = max(0, pending_polls - 1)
        return httpx.Response(200, json={'revisions': [{'revision_id': 'docs-revision', 'status': status}]})
    if request.method == 'DELETE' and request.url.path.startswith('/v4/catalog/documents/'):
        assert request.url.path.rsplit('/', 1)[-1] == admitted['file://document.txt']
        return httpx.Response(200, json={'purged': True})
    if request.url.path == '/v4/memory/insert':
        V4MemoryInsertRequest.model_validate(payload)
        assert payload['content'] == 'The archive opens at nine on weekdays.'
        assert payload['finalize_revision'] is True
        return httpx.Response(202, json={'mutation_id': 'docs-mutation'})
    if request.url.path == '/v4/mutations/docs-mutation':
        return httpx.Response(200, json={'state': terminal_state, 'failure_class': 'fixture_failure'})
    if request.url.path == '/v4/memory/search':
        V4SearchRequest.model_validate(payload)
        return httpx.Response(200, json={'results': []})
    raise AssertionError(request.url.path)


def fixture_init(self, *args, **kwargs):
    real_init(self, *args, **kwargs)
    self._client.close()
    self._client = httpx.Client(base_url=self.base_url, headers={'X-API-Key': 'fixture-only-credential'}, transport=httpx.MockTransport(transport))


def execute(snippet, label):
    exec(compile(snippet, label, 'exec'), {})


with patch.dict(os.environ, {'MESA_API_KEY': 'fixture-only-credential'}), patch.object(MesaV4Client, '__init__', fixture_init), patch('mesa_client.client.time.sleep'), contextlib.redirect_stdout(io.StringIO()):
    execute(v4_snippet, 'website-v4-example')
    assert observed == [('POST', '/v4/sessions/start'), ('POST', '/v4/memory/insert'), ('GET', '/v4/mutations/docs-mutation'), ('POST', '/v4/memory/search')]
    terminal_state = 'REJECTED'
    try:
        execute(v4_snippet, 'website-v4-rejected-example')
    except RuntimeError as error:
        assert str(error) == 'REJECTED'
    else:
        raise AssertionError('The sample accepted failed terminal state')

    with tempfile.TemporaryDirectory() as local_home, patch.dict(os.environ, {'MESA_HOME': local_home, 'MESA_API_KEY': '', 'MESA_BASE_URL': ''}), contextlib.chdir(local_home):
        Path('credentials.json').write_text(json.dumps({'api_key': 'fixture-only-credential', 'base_url': 'http://127.0.0.1:8000'}))
        terminal_state = 'COMMITTED'
        observed.clear()
        with Mesa() as local:
            receipt = local.add('The archive opens at nine on weekdays.', source='file://document.txt')
        # The published SDK default returns admission, without a revision poll.
        assert not any(path == '/v4/catalog/revisions' for _, path in observed)
        Path('receipt.json').write_text(json.dumps(receipt))
        observed.clear()
        execute(completion_snippet, 'website-completion-example')
        assert observed == [('GET', '/v4/mutations/docs-mutation')]
        terminal_state = 'REJECTED'
        try:
            execute(completion_snippet, 'website-failed-completion-example')
        except SystemExit as error:
            assert str(error) == 'Document processing failed'
        else:
            raise AssertionError('The completion script accepted failed processing')

        terminal_state = 'COMMITTED'
        observed.clear()
        execute(local_snippet, 'website-local-add-delete-example')
        assert sum(path == '/v4/documents' for _, path in observed) == 2
        assert sum(path == '/v4/catalog/revisions' for _, path in observed) == 1
        assert observed[-1] == ('DELETE', '/v4/catalog/documents/' + admitted['file://document.txt'])

        with Mesa() as local:
            terminal_state = 'RETRY_PENDING'
            pending_polls = 1
            # A retryable chunk must not be mistaken for terminal failure.
            local.add('The archive opens at nine.', source='file://document.txt', wait=True)
            terminal_state = 'REJECTED'
            pending_polls = 1
            try:
                local.add('The archive opens at nine.', source='file://document.txt', wait=True)
            except MesaClientError as error:
                assert all(part in str(error) for part in ('docs-mutation', 'REJECTED', 'fixture_failure'))
            else:
                raise AssertionError('SDK accepted a terminal chunk failure')

print('PASS: paired EN/TR V4 example and request schemas; COMMITTED and REJECTED guards.')
print('PASS: isolated local credentials, receipt-file completion script and failed-processing guard.')
print('PASS: default SDK admission, explicit ACTIVE wait, no-wait admission, source deletion, RETRY_PENDING and terminal error details.')
