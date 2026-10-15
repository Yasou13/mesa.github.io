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


# Authoritative repository definitions and approved source allowlists
REPO_CONFIGS = {
    "core": {
        "repo_url": "https://github.com/Yasou13/MESA.git",
        "local_path": Path("/home/yasin/Desktop/MESA"),
        "version": "v0.8.0",
        "title": {"en": "MESA Core", "tr": "MESA Core"},
        "description": {
            "en": "Deterministic AI memory infrastructure, SQLite canonical ledger, LanceDB & Kùzu projections, hybrid retrieval.",
            "tr": "Deterministik yapay zekâ hafıza altyapısı, SQLite kanonik defter, LanceDB ve Kùzu projeksiyonları, hibrit retrieval."
        },
        "base_route": "docs/core/",
        "allowlist": [
            {"src": "README.md", "slug": "", "title": "Overview", "title_tr": "Genel Bakış"},
            {"src": "docs/getting-started.md", "slug": "getting-started", "title": "Getting Started", "title_tr": "Başlarken"},
            {"src": "docs/installation.md", "slug": "installation", "title": "Installation", "title_tr": "Kurulum"},
            {"src": "docs/architecture-v4.md", "slug": "architecture", "title": "Architecture V4", "title_tr": "Mimari V4"},
            {"src": "docs/concepts-and-ingestion.md", "slug": "concepts-and-ingestion", "title": "Concepts & Ingestion", "title_tr": "Kavramlar ve Ingestion"},
            {"src": "docs/configuration.md", "slug": "configuration", "title": "Configuration", "title_tr": "Konfigürasyon"},
            {"src": "docs/retrieval-and-graph.md", "slug": "retrieval-and-graph", "title": "Retrieval & Graph", "title_tr": "Retrieval ve Çizge"},
            {"src": "docs/api-reference.md", "slug": "api-reference", "title": "API Reference", "title_tr": "API Referansı"},
            {"src": "docs/cli-reference.md", "slug": "cli-reference", "title": "CLI Reference", "title_tr": "CLI Referansı"},
            {"src": "docs/migration-v0.8.0.md", "slug": "migration", "title": "Migration to v0.8.0", "title_tr": "v0.8.0 Geçişi"},
            {"src": "docs/release-notes-v0.8.0.md", "slug": "release-notes", "title": "Release Notes v0.8.0", "title_tr": "Sürüm Notları v0.8.0"},
            {"src": "docs/troubleshooting.md", "slug": "troubleshooting", "title": "Troubleshooting", "title_tr": "Sorun Giderme"},
            {"src": "docs/performance-and-limitations.md", "slug": "limitations", "title": "Performance & Limitations", "title_tr": "Performans ve Sınırlılıklar"},
            {"src": "docs/v4-rebuild-runbook.md", "slug": "rebuild-runbook", "title": "V4 Rebuild Runbook", "title_tr": "V4 Yeniden Derleme Kılavuzu"},
            {"src": "docs/v4-final-independent-audit.md", "slug": "audit", "title": "Independent Audit", "title_tr": "Bağımsız Denetim"},
            {"src": "docs/colab_kurulum_rehberi.md", "slug": "colab-rehberi", "title": "Google Colab Guide", "title_tr": "Google Colab Rehberi"},
        ]
    },
    "data": {
        "repo_url": "https://github.com/Yasou13/MESA_Data.git",
        "local_path": Path("/tmp/inspect_mesa_data"),
        "version": "v0.3.0",
        "title": {"en": "MESA Data", "tr": "MESA Data"},
        "description": {
            "en": "Turkish legal and official gazette data preparation pipeline with deterministic provenance.",
            "tr": "Deterministik provenance ile Türk hukuku ve Resmî Gazete veri hazırlama hattı."
        },
        "base_route": "docs/data/",
        "allowlist": [
            {"src": "README.md", "slug": "", "title": "Overview", "title_tr": "Genel Bakış"},
            {"src": "docs/HIZLI_BASLANGIC.md", "slug": "quickstart", "title": "Quickstart (TR)", "title_tr": "Hızlı Başlangıç"},
            {"src": "docs/KULLANIM_KILAVUZU.md", "slug": "user-guide", "title": "User Guide (TR)", "title_tr": "Kullanım Kılavuzu"},
            {"src": "docs/IMPORT_CONTRACT.md", "slug": "import-contract", "title": "Import Contract", "title_tr": "İçe Aktarma Sözleşmesi"},
            {"src": "docs/SORUN_GIDERME.md", "slug": "troubleshooting", "title": "Troubleshooting (TR)", "title_tr": "Sorun Giderme"},
            {"src": "docs/MVP_CLOSURE_REPORT.md", "slug": "mvp-closure", "title": "MVP Closure Report", "title_tr": "MVP Kapanış Raporu"},
        ]
    },
    "law": {
        "repo_url": "https://github.com/Yasou13/MESA_Law.git",
        "local_path": Path("/tmp/inspect_mesa_law"),
        "version": "v0.1.0-mvp",
        "title": {"en": "MESA Law", "tr": "MESA Law"},
        "description": {
            "en": "Source-aware legal workflow system with strict evidence verification.",
            "tr": "Sıkı kanıt doğrulamalı kaynak odaklı hukuk iş akışı sistemi."
        },
        "base_route": "docs/law/",
        "allowlist": [
            {"src": "docs/mesa-v4-contract.md", "slug": "", "title": "Contract Overview", "title_tr": "Sözleşme Genel Bakış"},
            {"src": "docs/operations.md", "slug": "operations", "title": "Operations Guide", "title_tr": "Operasyon Rehberi"},
            {"src": "docs/mvp-final-verification.md", "slug": "verification", "title": "Final Verification", "title_tr": "Nihai Doğrulama"},
            {"src": "docs/mvp-baseline.md", "slug": "baseline", "title": "MVP Baseline", "title_tr": "MVP Temel Durumu"},
        ]
    },
    "qa": {
        "repo_url": "https://github.com/Yasou13/MESA_QA.git",
        "local_path": Path("/home/yasin/Desktop/MESA_QA"),
        "version": "v0.2.0",
        "title": {"en": "MESA QA", "tr": "MESA QA"},
        "description": {
            "en": "Independent QA harness, endurance and restart failure injection testing.",
            "tr": "Bağımsız QA harness, dayanıklılık ve yeniden başlatma hata enjeksiyon testleri."
        },
        "base_route": "docs/qa/",
        "allowlist": [
            {"src": "README.md", "slug": "", "title": "Overview", "title_tr": "Genel Bakış"},
            {"src": ".audit/current/FRESH_INDEPENDENT_AUDIT.md", "slug": "audit", "title": "Fresh Independent Audit", "title_tr": "Güncel Bağımsız Denetim"},
            {"src": "prompts/REPAIR.md", "slug": "repair-prompt", "title": "Repair Prompt Specification", "title_tr": "Onarım Prompt Spesifikasyonu"},
            {"src": "prompts/REPRODUCE.md", "slug": "reproduce-prompt", "title": "Reproduce Prompt Specification", "title_tr": "Yeniden Üretim Promptu"},
        ]
    },
    "e2e": {
        "repo_url": "https://github.com/Yasou13/MESA_E2E_Certification.git",
        "local_path": Path("/home/yasin/Desktop/MESA_E2E_Certification"),
        "version": "Profile-B-v1.0",
        "title": {"en": "MESA E2E Certification", "tr": "MESA E2E Sertifikasyonu"},
        "description": {
            "en": "Multi-tier end-to-end certification harness and ground truth validation for MESA Profile B.",
            "tr": "MESA Profil B için çok katmanlı uçtan uca sertifikasyon ve ground truth doğrulama."
        },
        "base_route": "docs/e2e/",
        "allowlist": [
            {"src": "README.md", "slug": "", "title": "Overview", "title_tr": "Genel Bakış"},
            {"src": "reports/independent-audit/REPORT.md", "slug": "audit-report", "title": "Independent Audit Report", "title_tr": "Bağımsız Denetim Raporu"},
            {"src": "agent-pack/00_START_HERE.md", "slug": "agent-pack-start", "title": "Agent Pack Start", "title_tr": "Ajan Paketi Başlangıç"},
            {"src": "agent-pack/02_SYSTEM_MODEL_AND_NON_NEGOTIABLES.md", "slug": "system-model", "title": "System Model & Non-Negotiables", "title_tr": "Sistem Modeli ve Esnetilemezler"},
            {"src": "agent-pack/06_PROFILE_B_OBJECTIVE_GATES_VERDICTS.md", "slug": "gates-and-verdicts", "title": "Profile B Objective Gates", "title_tr": "Profil B Hedef Kapıları"},
            {"src": "agent-pack/09_NATIVE_MESA_DATA_TO_MESA_CONTRACT.md", "slug": "contract", "title": "Data to Core Contract", "title_tr": "Data - Core Sözleşmesi"},
        ]
    }
}


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
    src_to_route = {}
    for item in allowlist:
        src = item["src"]
        slug = item["slug"]
        target_path = f"{base_route}{slug}/" if slug else base_route
        src_to_route[src] = target_path
        src_to_route[Path(src).name] = target_path
        # Also handle docs/relative paths
        if src.startswith("docs/"):
            src_to_route[src[len("docs/"):]] = target_path

    current_dir = os.path.dirname(current_src)
    clean_repo_url = repo_url.rstrip("/").removesuffix(".git")

    # 1. Resolve relative images: ![alt](src)
    def img_replacer(match: re.Match) -> str:
        alt = match.group(1)
        src = match.group(2)
        if src.startswith(("http://", "https://", "data:")):
            return match.group(0)
        parts = src.split(None, 1)
        url_part = parts[0]
        extra = f" {parts[1]}" if len(parts) > 1 else ""
        norm = os.path.normpath(os.path.join(current_dir, url_part)).lstrip("./")
        raw_base = clean_repo_url.replace("github.com", "raw.githubusercontent.com")
        raw_url = f"{raw_base}/{commit_sha}/{norm}"
        return f"![{alt}]({raw_url}{extra})"

    markdown_text = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", img_replacer, markdown_text)

    # 2. Resolve relative links: [text](href) (avoiding image tags)
    def link_replacer(match: re.Match) -> str:
        prefix = match.group(1) or ""
        text = match.group(2)
        href = match.group(3)
        # Skip external or anchor links
        if href.startswith(("http://", "https://", "mailto:", "#")):
            return match.group(0)

        # Separate path and hash anchor
        href_path, _, hash_part = href.partition("#")
        norm_path = os.path.normpath(href_path).lstrip("./")

        # Check if matches any allowlisted document in this repo
        for key, target_route in src_to_route.items():
            if norm_path == key or norm_path.endswith("/" + key) or Path(norm_path).name == key:
                rewritten = target_route
                if hash_part:
                    rewritten += f"#{hash_part}"
                return f"{prefix}[{text}]({rewritten})"

        # Non-allowlisted file in repo -> resolve relative to current_dir and link to GitHub blob
        resolved_repo_path = os.path.normpath(os.path.join(current_dir, href_path)).lstrip("./")
        github_blob_url = f"{clean_repo_url}/blob/{commit_sha}/{resolved_repo_path}"
        if hash_part:
            github_blob_url += f"#{hash_part}"
        return f"{prefix}[{text}]({github_blob_url})"

    return re.sub(r"(^|[^!])\[([^\]]+)\]\(([^)]+)\)", link_replacer, markdown_text)


def get_git_commit(repo_path: Path) -> str:
    try:
        res = subprocess.run(
            ["git", "-C", str(repo_path), "rev-parse", "HEAD"],
            capture_output=True,
            text=True,
            check=True
        )
        return res.stdout.strip()[:12]
    except Exception:
        return "latest"


def sync_repository(repo_key: str, config: dict, existing_manifest: dict | None) -> dict:
    local_path = config["local_path"]
    allowlist = config["allowlist"]
    base_route = config["base_route"]

    print(f"Syncing [{repo_key}] from {local_path}...")
    if not local_path.is_dir():
        print(f"Warning: Directory {local_path} not found. Attempting to preserve existing cached docs.")
        if existing_manifest and repo_key in existing_manifest.get("repositories", {}):
            return existing_manifest["repositories"][repo_key]
        raise RuntimeError(f"Source repository path missing for {repo_key}: {local_path}")

    commit_sha = get_git_commit(local_path)
    pages = []

    for item in allowlist:
        src = item["src"]
        slug = item["slug"]
        doc_file = local_path / src

        if not doc_file.is_file():
            print(f"  [MISSING] {src} not found in {local_path}")
            continue

        raw_md = doc_file.read_text(encoding="utf-8")
        # Extract title if not explicitly provided or from first H1
        title_en = item.get("title")
        title_tr = item.get("title_tr", title_en)

        first_h1_match = re.search(r"^#\s+(.+)$", raw_md, re.MULTILINE)
        if first_h1_match and not item.get("title"):
            title_en = first_h1_match.group(1).strip()
            title_tr = title_en

        # Rewrite relative links
        processed_md = rewrite_markdown_links(
            raw_md, src, base_route, allowlist, config["repo_url"], commit_sha
        )
        headings = extract_headings(processed_md)
        content_hash = hashlib.sha256(processed_md.encode("utf-8")).hexdigest()[:12]

        route_path = f"{base_route}{slug}/" if slug else base_route

        pages.append({
            "src": src,
            "slug": slug,
            "route": route_path,
            "title": {"en": title_en, "tr": title_tr},
            "headings": headings,
            "raw_markdown": processed_md,
            "content_hash": content_hash,
            "last_synced": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        })

    return {
        "repo_url": config["repo_url"],
        "version": config["version"],
        "commit": commit_sha,
        "title": config["title"],
        "description": config["description"],
        "base_route": base_route,
        "pages": pages,
        "last_sync": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Synchronize MESA documentation repositories.")
    parser.add_argument("--force", action="store_true", help="Force resynchronization.")
    args = parser.parse_args()

    DOCS_CACHE_DIR.mkdir(parents=True, exist_ok=True)

    existing_manifest = None
    if MANIFEST_FILE.is_file():
        try:
            existing_manifest = json.loads(MANIFEST_FILE.read_text(encoding="utf-8"))
        except Exception:
            existing_manifest = None

    manifest = {
        "schemaVersion": 1,
        "updatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "repositories": {}
    }

    sync_errors = []

    for repo_key, config in REPO_CONFIGS.items():
        try:
            repo_data = sync_repository(repo_key, config, existing_manifest)
            manifest["repositories"][repo_key] = repo_data
            print(f"  [OK] Synchronized {len(repo_data['pages'])} pages for {repo_key} (commit: {repo_data['commit']})")
        except Exception as e:
            err_msg = f"Failed to sync {repo_key}: {e}"
            print(f"  [ERROR] {err_msg}")
            sync_errors.append(err_msg)
            # Retain cached version if available
            if existing_manifest and repo_key in existing_manifest.get("repositories", {}):
                print(f"  [FALLBACK] Retained cached documentation for {repo_key}")
                manifest["repositories"][repo_key] = existing_manifest["repositories"][repo_key]

    MANIFEST_FILE.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Manifest written to {MANIFEST_FILE}")

    if sync_errors:
        FAILURE_LOG.write_text("\n".join(sync_errors) + "\n", encoding="utf-8")
        print(f"Recorded sync errors to {FAILURE_LOG}")
        return 1

    if FAILURE_LOG.exists():
        FAILURE_LOG.unlink()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
