#!/usr/bin/env python3
"""Reject recognizable privileged credentials without printing matched values."""
import argparse
import base64
import json
import re
from pathlib import Path

PATTERNS = {
    'private-key': re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),
    'github-token': re.compile(r'\bgh[pousr]_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{40,}\b'),
    'supabase-secret': re.compile(r'\bsb_secret_[A-Za-z0-9_-]{20,}\b'),
    'openai-secret': re.compile(r'\bsk-(?:proj-)?[A-Za-z0-9_-]{40,}\b'),
}


def credential_types(text):
    found = {kind for kind, pattern in PATTERNS.items() if pattern.search(text)}
    for token in re.findall(r'\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+', text):
        try:
            body = token.split('.')[1]
            payload = json.loads(base64.urlsafe_b64decode(body + '=' * (-len(body) % 4)))
            if payload.get('role') == 'service_role':
                found.add('service-role-jwt')
        except (ValueError, UnicodeError, AttributeError):
            continue
    return found


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('artifact', type=Path)
    args = parser.parse_args()
    findings = []
    checked = 0
    for path in args.artifact.rglob('*'):
        if path.is_file() and path.suffix in {'.html', '.js', '.mjs', '.json', '.txt', '.xml', '.css'}:
            checked += 1
            for kind in credential_types(path.read_text(encoding='utf-8')):
                findings.append(f'{path.relative_to(args.artifact)}: {kind}')
    if findings:
        print('PUBLIC ARTIFACT SECRET CHECK FAILED (values withheld)\n' + '\n'.join(findings))
        return 1
    print(f'PUBLIC ARTIFACT SECRET CHECK PASS: {checked} text artifacts; no recognized privileged credentials')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
