#!/usr/bin/env python3
"""Apply 20 new comprehensive bilingual articles to MESA Content Platform."""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HUB_FILE = ROOT / "content" / "hub.json"

sys.path.insert(0, str(Path(__file__).resolve().parent))
from data_articles_1_10 import get_articles_1_to_10
from data_articles_11_20 import get_articles_11_to_20

def main():
    print("Loading 20 new articles...")
    articles_1_10 = get_articles_1_to_10()
    articles_11_20 = get_articles_11_to_20()
    all_20 = articles_1_10 + articles_11_20
    print(f"Total new articles prepared: {len(all_20)}")

    if not HUB_FILE.exists():
        print(f"Error: {HUB_FILE} not found", file=sys.stderr)
        return 1

    hub_data = json.loads(HUB_FILE.read_text(encoding="utf-8"))
    existing_entries = hub_data.get("entries", [])
    existing_ids = {e["id"] for e in existing_entries}

    added = 0
    updated = 0
    for new_article in all_20:
        nid = new_article["id"]
        if nid in existing_ids:
            # Replace existing
            for idx, e in enumerate(existing_entries):
                if e["id"] == nid:
                    existing_entries[idx] = new_article
                    updated += 1
                    break
        else:
            existing_entries.append(new_article)
            added += 1

    hub_data["entries"] = existing_entries
    HUB_FILE.write_text(json.dumps(hub_data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"✓ hub.json updated: {added} added, {updated} updated. Total entries: {len(existing_entries)}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
