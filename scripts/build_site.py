#!/usr/bin/env python3
"""Build the plain-static GitHub Pages artifact with the correct public base."""

from __future__ import annotations

import argparse
import os
import shutil
from pathlib import Path
from urllib.parse import urlsplit


TEXT_SUFFIXES = {".html", ".xml", ".txt"}


def deployment_url(repository: str | None, explicit_url: str | None) -> str:
    if explicit_url:
        return explicit_url.rstrip("/") + "/"
    if repository:
        owner, name = repository.split("/", 1)
        if name.lower() == f"{owner.lower()}.github.io":
            return f"https://{owner.lower()}.github.io/"
        return f"https://{owner.lower()}.github.io/{name}/"
    return "http://localhost:8000/"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=Path("dist"))
    parser.add_argument("--output", type=Path, default=Path("_site"))
    parser.add_argument("--repository", default=os.getenv("GITHUB_REPOSITORY"))
    parser.add_argument("--site-url")
    args = parser.parse_args()

    source = args.source.resolve()
    output = args.output.resolve()
    if not source.is_dir():
        raise SystemExit(f"source directory does not exist: {source}")
    if output == source or source in output.parents:
        raise SystemExit("output must not be the source directory or inside it")

    site_url = deployment_url(args.repository, args.site_url)
    base_path = urlsplit(site_url).path or "/"
    if not base_path.endswith("/"):
        base_path += "/"

    if output.exists():
        shutil.rmtree(output)
    shutil.copytree(source, output)

    replacements = {"{{SITE_URL}}": site_url, "{{BASE_PATH}}": base_path}
    for path in output.rglob("*"):
        if not path.is_file() or path.suffix not in TEXT_SUFFIXES:
            continue
        text = path.read_text(encoding="utf-8")
        for token, value in replacements.items():
            text = text.replace(token, value)
        path.write_text(text, encoding="utf-8")

    leftovers = []
    for path in output.rglob("*"):
        if path.is_file() and path.suffix in TEXT_SUFFIXES:
            if "{{" in path.read_text(encoding="utf-8"):
                leftovers.append(str(path.relative_to(output)))
    if leftovers:
        raise SystemExit(f"unresolved build tokens: {', '.join(leftovers)}")
    if not (output / "index.html").is_file():
        raise SystemExit("artifact entry point is missing")

    print(f"Built {output} for {site_url}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

