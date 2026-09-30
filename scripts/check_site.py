#!/usr/bin/env python3
"""Dependency-free static route, asset, metadata, and link contract checks."""

from __future__ import annotations

import argparse
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROUTES = (
    "",
    "mesa/",
    "ecosystem/",
    "data/",
    "qa/",
    "certification/",
    "law/",
    "docs/",
    "docs/mcp/",
    "status/",
)
FORBIDDEN = ("href=\"#\"", "href=''", 'href=""', "javascript:void")


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: list[tuple[str, str]] = []
        self.title = False
        self.description = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "title":
            self.title = True
        if tag == "meta" and values.get("name") == "description" and values.get("content"):
            self.description = True
        for key in ("href", "src"):
            value = values.get(key)
            if value:
                self.refs.append((key, value))


def resolve_local(page: Path, root: Path, value: str) -> Path | None:
    parsed = urlsplit(value)
    if parsed.scheme or value.startswith("//") or value.startswith("{{"):
        return None
    clean = parsed.path
    if not clean:
        return None
    if clean.startswith("/"):
        target = root / clean.lstrip("/")
        # A built project-site 404 uses its deployed /<repository>/ prefix.
        # The artifact root itself already represents that prefix.
        if not target.exists() and len(Path(clean).parts) > 2:
            target = root.joinpath(*Path(clean).parts[2:])
    else:
        target = page.parent / clean
    if clean.endswith("/"):
        target /= "index.html"
    return target.resolve()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("root", nargs="?", type=Path, default=Path("dist"))
    args = parser.parse_args()
    root = args.root.resolve()
    errors: list[str] = []
    internal_refs = 0
    external_refs = 0

    for route in ROUTES:
        page = root / route / "index.html" if route else root / "index.html"
        if not page.is_file():
            errors.append(f"missing route: /{route}")
    for required in ("404.html", "favicon.svg", "robots.txt", "sitemap.xml", ".nojekyll"):
        if not (root / required).is_file():
            errors.append(f"missing required file: {required}")

    for page in root.rglob("*.html"):
        text = page.read_text(encoding="utf-8")
        parsed = PageParser()
        parsed.feed(text)
        if not parsed.title:
            errors.append(f"missing title: {page.relative_to(root)}")
        if not parsed.description:
            errors.append(f"missing description: {page.relative_to(root)}")
        for marker in FORBIDDEN:
            if marker in text:
                errors.append(f"forbidden link pattern {marker}: {page.relative_to(root)}")
        for _, value in parsed.refs:
            if urlsplit(value).scheme in {"http", "https"}:
                external_refs += 1
                continue
            target = resolve_local(page, root, value)
            if target is None:
                continue
            internal_refs += 1
            if not target.exists():
                errors.append(f"missing local target: {page.relative_to(root)} -> {value}")

    app_js = (root / "app.js").read_text(encoding="utf-8")
    for marker in FORBIDDEN:
        if marker in app_js:
            errors.append(f"forbidden link pattern {marker}: app.js")
    for value in re.findall(r"route\('([^']*)'\)", app_js):
        clean, _, fragment = value.partition("#")
        target = root / clean
        if clean.endswith("/"):
            target /= "index.html"
        internal_refs += 1
        if not target.exists():
            errors.append(f"missing route referenced by app.js: {value}")
        if fragment and f'id="{fragment}"' not in app_js:
            errors.append(f"missing dynamic anchor referenced by app.js: {value}")
    external_refs += len(re.findall(r"https://", app_js))

    forbidden_brand = re.compile(r"cognee|topoteretes|cognee\.ai", re.IGNORECASE)
    for path in root.rglob("*"):
        if path.is_file() and path.suffix.lower() in {".html", ".css", ".js", ".svg", ".txt", ".xml"}:
            if forbidden_brand.search(path.read_text(encoding="utf-8")):
                errors.append(f"forbidden legacy brand in published artifact: {path.relative_to(root)}")

    if errors:
        print("SITE CHECK FAILED")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"SITE CHECK PASS: {len(ROUTES)} routes, {internal_refs} internal references, {external_refs} external references")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
