#!/usr/bin/env python3
"""Deterministic migration script from content/hub.json to canonical Markdown articles and SQL seed.

This script delegates to scripts/sync_articles.py --from-hub for unified synchronization.
"""

from __future__ import annotations

import sys
from pathlib import Path

# Add current scripts directory to path
SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from sync_articles import sync_from_hub


def main() -> int:
    return sync_from_hub()


if __name__ == "__main__":
    raise SystemExit(main())
