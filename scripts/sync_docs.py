#!/usr/bin/env python3
"""Bounded, deterministic documentation synchronization engine for MESA repositories."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import time
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DOCS_CACHE_DIR = ROOT / "content" / "docs"
MANIFEST_FILE = DOCS_CACHE_DIR / "manifest.json"
FAILURE_LOG = DOCS_CACHE_DIR / "sync-failures.log"


# Reviewed paths and immutable commits; no machine-specific source directories.
REPO_CONFIGS = json.loads((DOCS_CACHE_DIR / "sources.json").read_text(encoding="utf-8"))

def extract_headings(markdown_text: str) -> list[dict]:
    headings = []
    for line in markdown_text.splitlines():
        match = re.match(r"^(#{1,6})\s+(.+)$", line.strip())
        if match:
            level = len(match.group(1))
            raw_title = match.group(2).strip()
            # Remove existing markdown links or bold inside heading
            clean_title = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", raw_title)
            clean_title = re.sub(r"[*_`]", "", clean_title)
            slug = re.sub(r"[^a-zA-Z0-9\s-]", "", clean_title.lower()).strip()
            slug = re.sub(r"[\s_]+", "-", slug)
            headings.append({"level": level, "title": clean_title, "id": slug})
    return headings


def rewrite_markdown_links(
    markdown_text: str,
    current_src: str,
    base_route: str,
    allowlist: list[dict],
    repo_url: str = "https://github.com/Yasou13/MESA",
    commit_sha: str = "main"
) -> str:
    """Rewrites relative doc links and images:
    - If target matches an allowlisted doc in this repo: rewrites to internal doc URL.
    - If target points to other files in the repo (e.g. LICENSE, ARCHITECTURE.md): rewrites to GitHub blob URL.
    - If relative image link: rewrites to GitHub raw content URL.
    """
    from urllib.parse import urlsplit
    import posixpath
    src_to_route = {item["src"]: base_route + (item["slug"] + "/" if item["slug"] else "")
                    for item in allowlist}
    current_dir = posixpath.dirname(current_src)
    clean_repo = repo_url.rstrip("/").removesuffix(".git")

    def rewrite(match):
        image, label, href, caption = match.groups()
        if image is None:
            return match.group(0)
        if urlsplit(href).scheme or href.startswith(("#", "//")):
            return match.group(0)
        target, separator, anchor = href.partition("#")
        normalized = posixpath.normpath(posixpath.join(current_dir, target))
        if normalized.startswith("../") or normalized.startswith("/"):
            return label
        if image:
            destination = clean_repo.replace("github.com", "raw.githubusercontent.com") + f"/{commit_sha}/{normalized}"
        else:
            destination = src_to_route.get(normalized, f"{clean_repo}/blob/{commit_sha}/{normalized}")
        if separator:
            destination += "#" + anchor
        return f'{image}[{label}]({destination}{caption or ""})'

    # Code examples are literal, never rewrite links inside fenced or inline code.
    chunks = re.split(r"(```[^\n]*\n.*?(?:```|\Z)|~~~[^\n]*\n.*?(?:~~~|\Z))",
                      markdown_text, flags=re.DOTALL)
    pattern = r'(!?)\[([^\]]*)\]\(([^\s)]+)(\s+"[^"]*")?\)|`[^`\n]+`'
    return "".join(chunk if index % 2 else re.sub(pattern, rewrite, chunk)
                   for index, chunk in enumerate(chunks))


def read_source(config: dict, src: str, local_path: Path | None = None) -> str:
    """Read committed bytes only; a dirty checkout cannot contaminate the cache."""
    import urllib.request
    commit = config["commit"]
    if not re.fullmatch(r"[0-9a-f]{40}", commit):
        raise ValueError("source commit must be a full immutable Git SHA")
    if src.startswith("/") or ".." in Path(src).parts:
        raise ValueError("unsafe source path")
    if local_path is not None:
        result = subprocess.run(["git", "-C", str(local_path), "show", f"{commit}:{src}"],
                                capture_output=True, check=True, timeout=30)
        data = result.stdout
    else:
        repo = config["repo_url"].removesuffix(".git")
        if not re.fullmatch(r"https://github.com/Yasou13/[A-Za-z0-9_]+", repo):
            raise ValueError("unapproved documentation repository")
        url = repo.replace("github.com", "raw.githubusercontent.com") + f"/{commit}/{src}"
        request = urllib.request.Request(url, headers={"User-Agent": "MESA-docs-sync"})
        with urllib.request.urlopen(request, timeout=20) as response:
            data = response.read(2_000_001)
    if len(data) > 2_000_000:
        raise ValueError("documentation source exceeds 2 MB")
    return data.decode("utf-8")


def sync_repository(repo_key: str, config: dict, existing_manifest: dict | None = None,
                    local_path: Path | None = None) -> dict:
    from concurrent.futures import ThreadPoolExecutor
    allowlist = config["allowlist"]
    commit = config["commit"]
    # Every approved page is required. A partial sync must retain the old repo.
    paths = [config["version_source"], *[item["src"] for item in allowlist]]
    with ThreadPoolExecutor(max_workers=4) as pool:
        contents = dict(zip(paths, pool.map(lambda src: read_source(config, src, local_path), paths)))
    match = re.search(r'^version\s*=\s*"([^"]+)"', contents[config["version_source"]], re.MULTILINE)
    if not match:
        raise ValueError(f"declared package version missing for {repo_key}")
    timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    pages = []
    for item in allowlist:
        src, slug = item["src"], item["slug"]
        processed = rewrite_markdown_links(contents[src], src, config["base_route"], allowlist,
                                           config["repo_url"], commit)
        pages.append({"src": src, "slug": slug,
                      "route": config["base_route"] + (slug + "/" if slug else ""),
                      "title": {"en": item["title"], "tr": item.get("title_tr", item["title"])},
                      "headings": extract_headings(processed), "raw_markdown": processed,
                      "content_hash": hashlib.sha256(processed.encode()).hexdigest()[:12],
                      "last_synced": timestamp})
    result = {"repo_url": config["repo_url"], "commit": commit, "version": "v" + match[1],
              "title": config["title"], "description": config["description"],
              "base_route": config["base_route"], "pages": pages, "last_sync": timestamp}
    previous = (existing_manifest or {}).get("repositories", {}).get(repo_key)
    def stable(value):
        return json.dumps(value, sort_keys=True, ensure_ascii=False,
                          default=str)
    if previous:
        old = dict(previous); new = dict(result)
        for value in [old, new]:
            value.pop("last_sync", None)
            value["pages"] = [{k: v for k, v in page.items() if k != "last_synced"} for page in value["pages"]]
        if stable(old) == stable(new):
            return previous
    return result


def synchronize(configs: dict, manifest_file: Path, local_sources: dict | None = None) -> list[str]:
    existing = json.loads(manifest_file.read_text()) if manifest_file.is_file() else {"schemaVersion": 1, "repositories": {}}
    manifest = {"schemaVersion": 1, "repositories": {}}
    errors = []
    for key, config in configs.items():
        try:
            manifest["repositories"][key] = sync_repository(key, config, existing, (local_sources or {}).get(key))
            print(f"[OK] {key}: {config['commit']}")
        except Exception as error:
            errors.append(f"{key}: {type(error).__name__}: synchronization failed; cache retained")
            if key in existing["repositories"]:
                manifest["repositories"][key] = existing["repositories"][key]
            print(f"[FAILED] {errors[-1]}")
    if manifest["repositories"] == existing["repositories"]:
        return errors
    manifest["updatedAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    manifest_file.parent.mkdir(parents=True, exist_ok=True)
    temporary = manifest_file.with_suffix(".tmp")
    temporary.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    temporary.replace(manifest_file)
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync allowlisted documentation at reviewed commits from GitHub.")
    parser.add_argument("--manifest", type=Path, default=MANIFEST_FILE)
    parser.add_argument("--source", action="append", default=[], metavar="KEY=GIT_REPOSITORY",
                        help="Read pinned Git objects locally instead of fetching public raw files")
    args = parser.parse_args()
    sources = {key: Path(value) for key, value in (item.split("=", 1) for item in args.source)}
    unknown = set(sources) - set(REPO_CONFIGS)
    if unknown:
        parser.error(f"unknown source keys: {sorted(unknown)}")
    errors = synchronize(REPO_CONFIGS, args.manifest, sources)
    failure_log = args.manifest.parent / "sync-failures.log"
    if errors:
        failure_log.write_text("\n".join(errors) + "\n")
        return 1
    failure_log.unlink(missing_ok=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
