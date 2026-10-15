#!/usr/bin/env python3
"""Exercise migrations in disposable, network-isolated PostgreSQL; never a hosted DB."""
import subprocess
import time
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMAGE = 'postgres:15-alpine@sha256:f7d23353e1b15400d22ebe31189f4d314b87a4c129cc400c8c2d8d4ca127bf81'


def main():
    name = 'mesa-cms-audit-' + uuid.uuid4().hex[:12]
    subprocess.run(['docker', 'run', '--detach', '--rm', '--name', name,
                    '--network', 'none', '--memory', '512m', '--cpus', '1',
                    '--tmpfs', '/var/lib/postgresql/data',
                    '-e', 'POSTGRES_HOST_AUTH_METHOD=trust', IMAGE], check=True, capture_output=True)
    try:
        for attempt in range(60):
            ready = subprocess.run(['docker', 'exec', name, 'sh', '-c', 'test "$(cat /proc/1/comm)" = postgres && pg_isready -U postgres'], capture_output=True)
            if ready.returncode == 0:
                break
            time.sleep(.25)
        else:
            raise RuntimeError('isolated PostgreSQL did not become ready')
        setup, fixtures = (ROOT/'scripts/tests/cms_fixture.sql').read_text().split('-- SCHEMA IS APPLIED HERE BY THE RUNNER')
        migrations = sorted((ROOT/'supabase/migrations').glob('*.sql'))
        sql = setup + migrations[0].read_text() + fixtures
        sql += ''.join(migration.read_text() for migration in migrations[1:])
        sql += (ROOT/'scripts/tests/cms_authorization.sql').read_text()
        result = subprocess.run(['docker', 'exec', '-i', name, 'psql', '-U', 'postgres', '-v', 'ON_ERROR_STOP=1'],
                                input=sql, text=True, capture_output=True, timeout=45)
        if result.returncode:
            print(result.stderr)
        for line in (result.stdout + result.stderr).splitlines():
            if any(word in line for word in ['PASS', 'REPRODUCED', 'ERROR']):
                print(line)
        return result.returncode
    finally:
        subprocess.run(['docker', 'stop', name], check=True, capture_output=True, timeout=20)


if __name__ == '__main__':
    raise SystemExit(main())
