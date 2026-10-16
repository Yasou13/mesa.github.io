#!/usr/bin/env python3
"""Unit tests for MESA article tri-source consistency and synchronization."""

import json
import tempfile
import unittest
from pathlib import Path
import sys

SCRIPT_DIR = Path(__file__).resolve().parents[1]
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from sync_articles import (
    HUB_FILE,
    ARTICLES_DIR,
    SEED_SQL_FILE,
    check_sync,
    generate_article_markdown,
    generate_seed_sql,
    parse_markdown_file,
)


class TestArticlesConsistency(unittest.TestCase):
    def test_current_repo_is_in_full_sync(self):
        """Verify that content/hub.json, Markdown articles, and supabase/seed.sql are 100% in sync."""
        errors = check_sync()
        self.assertEqual(errors, [], f"Repository article sources are out of sync: {errors}")

    def test_hub_entries_have_valid_slugs_and_articles(self):
        """Verify that each hub entry maps correctly to a valid slug and existing Markdown files."""
        hub_data = json.loads(HUB_FILE.read_text(encoding="utf-8"))
        entries = hub_data.get("entries", [])
        self.assertGreater(len(entries), 0)

        for entry in entries:
            eid = entry.get("id")
            slug = entry.get("slug", eid)
            self.assertTrue(bool(eid), "Entry has empty id")
            self.assertTrue(bool(slug), f"Entry {eid} has empty slug")

            for lang in ("en", "tr"):
                md_file = ARTICLES_DIR / lang / f"{slug}.md"
                self.assertTrue(
                    md_file.is_file(),
                    f"Expected article file missing: {md_file} for entry id='{eid}' slug='{slug}'"
                )

                # Verify frontmatter matches
                fm, sections = parse_markdown_file(md_file)
                self.assertEqual(fm.get("id"), eid, f"Frontmatter id mismatch in {md_file}")
                self.assertEqual(fm.get("slug"), slug, f"Frontmatter slug mismatch in {md_file}")
                self.assertEqual(fm.get("language"), lang, f"Frontmatter language mismatch in {md_file}")
                self.assertGreater(len(sections), 0, f"Article {md_file} has no sections")

    def test_known_slug_id_mappings(self):
        """Verify specific known slug-to-ID mappings that differ from id."""
        hub_data = json.loads(HUB_FILE.read_text(encoding="utf-8"))
        entries = {e["id"]: e for e in hub_data.get("entries", [])}

        expected_mappings = {
            "vector-search-limits": "why-vector-search-alone-is-not-enough",
            "hybrid-retrieval": "hybrid-retrieval-explained",
            "why-graphs-matter": "why-graphs-matter-in-ai-memory",
            "reciprocal-rank-fusion": "reciprocal-rank-fusion-explained",
            "evidence-aware-memory": "what-is-evidence-aware-memory",
            "provenance-in-ai": "what-is-provenance-in-ai",
            "keyword-semantic-protocol": "keyword-vs-semantic-search",
            "verify-ai-yargitay": "verify-ai-yargitay-decision",
        }

        for eid, expected_slug in expected_mappings.items():
            self.assertIn(eid, entries, f"Missing entry for id={eid}")
            self.assertEqual(entries[eid].get("slug"), expected_slug)
            self.assertTrue((ARTICLES_DIR / "en" / f"{expected_slug}.md").is_file())
            self.assertTrue((ARTICLES_DIR / "tr" / f"{expected_slug}.md").is_file())

    def test_sql_seed_contains_all_articles(self):
        """Verify that supabase/seed.sql contains INSERT statements for all entries and languages."""
        hub_data = json.loads(HUB_FILE.read_text(encoding="utf-8"))
        entries = hub_data.get("entries", [])
        seed_content = SEED_SQL_FILE.read_text(encoding="utf-8")

        for entry in entries:
            slug = entry.get("slug", entry.get("id"))
            self.assertIn(f"'{slug}'", seed_content, f"Slug {slug} missing in supabase/seed.sql")

    def test_desynchronization_is_detected(self):
        """Verify that any modification to a Markdown file without recompiling is detected."""
        test_file = ARTICLES_DIR / "en" / "what-is-ai-memory.md"
        original_content = test_file.read_text(encoding="utf-8")
        try:
            # Append a dummy line
            test_file.write_text(original_content + "\n<!-- unsynced change -->\n", encoding="utf-8")
            errors = check_sync()
            self.assertTrue(any("what-is-ai-memory.md" in err for err in errors))
        finally:
            test_file.write_text(original_content, encoding="utf-8")

        # After restore, check_sync must be clean again
        self.assertEqual(check_sync(), [])


if __name__ == "__main__":
    unittest.main()

