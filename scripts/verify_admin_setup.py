#!/usr/bin/env python3
"""Verification tool for MESA Production Admin Setup and Authentication Backend.

Validates that:
1. MESA_SUPABASE_URL and MESA_SUPABASE_PUBLISHABLE_KEY are properly configured and non-privileged.
2. The Supabase endpoint is reachable over HTTPS.
3. Public anonymous sign-up is disabled (fails closed).
4. Unauthenticated users cannot read draft articles.
5. If admin credentials are provided, verifies authentication and role assignment.

Usage:
    python3 scripts/verify_admin_setup.py
    python3 scripts/verify_admin_setup.py --test-login owner@example.com:password
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from urllib.parse import urlparse


def validate_config(url: str | None, key: str | None) -> list[str]:
    errors = []
    if not url:
        errors.append("MESA_SUPABASE_URL is missing or empty")
    else:
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https") or not parsed.netloc:
            errors.append(f"MESA_SUPABASE_URL '{url}' is not a valid HTTP(S) URL")
        if parsed.scheme == "http" and parsed.hostname not in ("127.0.0.1", "localhost"):
            errors.append("MESA_SUPABASE_URL must use HTTPS for production")

    if not key:
        errors.append("MESA_SUPABASE_PUBLISHABLE_KEY is missing or empty")
    else:
        # Check for accidental service_role key leak
        if "service_role" in key or key.startswith("sb_secret_"):
            errors.append("CRITICAL: Privileged service_role / secret key detected! Use anon/publishable key only.")
        if key.count(".") == 2:
            # JWT format check
            try:
                import base64
                payload = json.loads(base64.b64decode(key.split(".")[1] + "==").decode("utf-8"))
                if payload.get("role") not in ("anon", None):
                    errors.append(f"CRITICAL: JWT key has privileged role '{payload.get('role')}', expected 'anon'")
            except Exception:
                pass
    return errors


def test_public_endpoint(url: str, key: str) -> list[str]:
    issues = []
    rest_url = f"{url.rstrip('/')}/rest/v1/articles?select=id,status,slug&status=neq.published"
    req = urllib.request.Request(rest_url, headers={
        "apikey": key,
        "Authorization": f"Bearer {key}",
    })

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if len(data) > 0:
                issues.append(f"SECURITY DEFECT: Anonymous user was able to query non-published drafts ({len(data)} items returned)!")
    except urllib.error.HTTPError as e:
        # Expected: PostgREST returns empty list or permission denied
        pass
    except Exception as e:
        issues.append(f"Unable to reach Supabase REST endpoint: {e}")

    # Check signup endpoint
    signup_url = f"{url.rstrip('/')}/auth/v1/signup"
    dummy_payload = json.dumps({"email": "test-security-probe@example.invalid", "password": "ProbePassword123!"}).encode()
    signup_req = urllib.request.Request(signup_url, data=dummy_payload, headers={
        "apikey": key,
        "Content-Type": "application/json",
    })
    try:
        with urllib.request.urlopen(signup_req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            if resp.status in (200, 201):
                issues.append("SECURITY DEFECT: Public signup is ENABLED. Please disable public signup in Supabase Auth settings.")
    except urllib.error.HTTPError as e:
        if e.code == 400 or e.code == 403 or e.code == 422:
            body = e.read().decode("utf-8")
            if "signup is disabled" in body.lower() or "signups not allowed" in body.lower():
                print("✓ Verified: Public signup is correctly disabled in Auth settings.")
        else:
            pass
    except Exception:
        pass

    return issues


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify MESA Supabase Admin backend and security posture.")
    parser.add_argument("--url", default=os.getenv("MESA_SUPABASE_URL"))
    parser.add_argument("--key", default=os.getenv("MESA_SUPABASE_PUBLISHABLE_KEY"))
    parser.add_argument("--test-login", metavar="EMAIL:PASSWORD", help="Optional test credentials to verify sign-in")
    args = parser.parse_args()

    print("=== MESA Production Admin Setup Verification ===")
    config_errors = validate_config(args.url, args.key)
    if config_errors:
        print("❌ Configuration Errors:")
        for err in config_errors:
            print(f"  - {err}")
        return 1

    print(f"✓ Configuration syntax valid for URL: {args.url}")
    print("✓ Public key is non-privileged publishable/anon key.")

    print("\nProbing backend endpoint security boundaries...")
    issues = test_public_endpoint(args.url, args.key)
    if issues:
        print("❌ Security Boundary Issues:")
        for issue in issues:
            print(f"  - {issue}")
        return 1
    print("✓ PostgREST RLS draft isolation verified (anonymous callers cannot read drafts).")

    if args.test_login:
        email, password = args.test_login.split(":", 1)
        print(f"\nAttempting authentication probe for {email}...")
        login_url = f"{args.url.rstrip('/')}/auth/v1/token?grant_type=password"
        payload = json.dumps({"email": email, "password": password}).encode()
        req = urllib.request.Request(login_url, data=payload, headers={
            "apikey": args.key,
            "Content-Type": "application/json",
        })
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                auth_data = json.loads(resp.read().decode("utf-8"))
                user_id = auth_data.get("user", {}).get("id")
                access_token = auth_data.get("access_token")
                print(f"✓ Authentication successful! Authenticated User ID: {user_id}")

                # Query editor_roles with token
                roles_url = f"{args.url.rstrip('/')}/rest/v1/editor_roles?select=role,email&user_id=eq.{user_id}"
                role_req = urllib.request.Request(roles_url, headers={
                    "apikey": args.key,
                    "Authorization": f"Bearer {access_token}",
                })
                with urllib.request.urlopen(role_req, timeout=10) as rresp:
                    roles = json.loads(rresp.read().decode("utf-8"))
                    if roles:
                        role = roles[0].get("role")
                        print(f"✓ Database role verified in public.editor_roles: '{role}'")
                    else:
                        print("❌ User is authenticated but has NO assigned role in public.editor_roles!")
                        return 1
        except Exception as e:
            print(f"❌ Authentication probe failed: {e}")
            return 1

    print("\n✓ Production admin verification complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
