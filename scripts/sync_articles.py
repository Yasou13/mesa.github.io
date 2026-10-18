#!/usr/bin/env python3
"""Article synchronization and consistency engine for MESA content platform.

Ensures strict 1:1 synchronization between:
1. content/hub.json (Compiled static site generation source)
2. content/articles/{en,tr}/*.md (Human-editable canonical Markdown files)
3. supabase/seed.sql (Database seed data for CMS backend)

Usage:
    python3 scripts/sync_articles.py --check          # Validate synchronization in CI
    python3 scripts/sync_articles.py --from-hub       # Regenerate Markdown & seed.sql from hub.json
    python3 scripts/sync_articles.py --from-markdown  # Compile Markdown edits into hub.json & seed.sql
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HUB_FILE = ROOT / "content" / "hub.json"
ARTICLES_DIR = ROOT / "content" / "articles"
SEED_SQL_FILE = ROOT / "supabase" / "seed.sql"


def block_to_markdown(block: dict) -> str:
    kind = block.get("kind")
    if kind == "exercise":
        return (f"> [!EXERCISE]\n> **{block['title']}**\n> {block['text']}\n>\n"
                f"> **Answer:** {block['answer']}\n\n")
    if kind == "paragraph":
        return block.get("text", "") + "\n\n"
    elif kind == "list":
        items = block.get("items", [])
        return "\n".join(f"- {item}" for item in items) + "\n\n"
    elif kind == "numbered-list":
        items = block.get("items", [])
        return "\n".join(f"{i+1}. {item}" for i, item in enumerate(items)) + "\n\n"
    elif kind == "checklist":
        items = block.get("items", [])
        return "\n".join(f"- [ ] {item}" for item in items) + "\n\n"
    elif kind in ("warning", "callout", "example"):
        title = block.get("title", kind.upper())
        text = block.get("text", "")
        alert_type = "WARNING" if kind == "warning" else "NOTE" if kind == "callout" else "TIP"
        return f"> [!{alert_type}]\n> **{title}**\n> {text}\n\n"
    elif kind == "definition":
        term = block.get("term", "")
        text = block.get("text", "")
        return f"**{term}**\n: {text}\n\n"
    elif kind == "quote":
        text = block.get("text", "")
        cite = block.get("cite", "")
        quote_str = f"> {text}\n"
        if cite:
            quote_str += f">\n> — *{cite}*\n"
        return quote_str + "\n"
    elif kind == "code":
        code = block.get("code", "")
        return f"```text\n{code}\n```\n\n"
    elif kind == "image":
        src = block.get("src", "")
        alt = block.get("alt", "")
        caption = block.get("caption", "")
        img_str = f"![{alt}]({src})\n"
        if caption:
            img_str += f"*{caption}*\n"
        return img_str + "\n"
    elif kind == "diagram":
        alt = block.get("alt", "")
        steps = block.get("steps", [])
        caption = block.get("caption", "")
        diag_str = f"<!-- diagram: {alt} -->\n"
        diag_str += "\n".join(f"{i+1}. {step}" for i, step in enumerate(steps)) + "\n"
        if caption:
            diag_str += f"\n*{caption}*\n"
        return diag_str + "\n"
    elif kind == "references":
        items = block.get("items", [])
        ref_lines = []
        for i, item in enumerate(items):
            label = item.get("label", "")
            href = item.get("href", "")
            if href:
                ref_lines.append(f"{i+1}. [{label}]({href})")
            else:
                ref_lines.append(f"{i+1}. {label}")
        return "\n".join(ref_lines) + "\n\n"
    elif kind == "table":
        headers = block.get("headers", [])
        rows = block.get("rows", [])
        out = "| " + " | ".join(headers) + " |\n"
        out += "| " + " | ".join(["---"] * len(headers)) + " |\n"
        for row in rows:
            out += "| " + " | ".join(str(cell) for cell in row) + " |\n"
        return out + "\n"
    return ""


def parse_markdown_blocks(content: str, sec_title: str = "") -> list[dict]:
    """Parse Markdown section body back into structured content blocks."""
    blocks = []
    chunks = re.split(r"\n\n+", content.strip())
    for chunk in chunks:
        chunk = chunk.strip()
        if not chunk:
            continue

        # Table
        if chunk.startswith("|") and "\n| ---" in chunk:
            lines = [l.strip() for l in chunk.split("\n") if l.strip()]
            headers = [c.strip() for c in lines[0].strip("|").split("|")]
            rows = []
            for line in lines[2:]:
                rows.append([c.strip() for c in line.strip("|").split("|")])
            blocks.append({"kind": "table", "headers": headers, "rows": rows})
            continue

        if chunk.startswith("> [!EXERCISE]"):
            match = re.fullmatch(r"> \[!EXERCISE\]\n> \*\*(.*?)\*\*\n> (.*?)\n>\n> \*\*Answer:\*\* (.*)", chunk, re.DOTALL)
            if match:
                title, question, answer = match.groups()
                blocks.append({"kind": "exercise", "title": title, "text": question, "answer": answer})
                continue

        # Callouts / Alerts (> [!NOTE], > [!WARNING], > [!TIP])
        if chunk.startswith("> [!"):
            m = re.match(r"> \[!(NOTE|WARNING|TIP)\]\n> \*\*(.*?)\*\*\n> (.*)", chunk, re.DOTALL)
            if m:
                atype, title, btext = m.groups()
                clean_text = "\n".join(l[2:] if l.startswith("> ") else l for l in btext.split("\n")).strip()
                kind = "warning" if atype == "WARNING" else "callout" if atype == "NOTE" else "example"
                blocks.append({"kind": kind, "title": title, "text": clean_text})
                continue

        # Blockquote
        if chunk.startswith("> ") and not chunk.startswith("> [!"):
            m = re.match(r"> (.*?)(?:\n>\n> — \*(.*?)\*)?$", chunk, re.DOTALL)
            if m:
                qtext, cite = m.groups()
                clean_text = "\n".join(l[2:] if l.startswith("> ") else l for l in qtext.split("\n")).strip()
                block = {"kind": "quote", "text": clean_text}
                if cite:
                    block["cite"] = cite
                blocks.append(block)
                continue

        # Definition (**term**\n: text)
        if "\n: " in chunk and chunk.startswith("**"):
            lines = chunk.split("\n: ", 1)
            term = lines[0].strip("*").strip()
            dtext = lines[1].strip()
            blocks.append({"kind": "definition", "term": term, "text": dtext})
            continue

        # Code block (```text ... ```)
        if chunk.startswith("```"):
            m = re.match(r"```(?:text)?\n(.*?)\n```", chunk, re.DOTALL)
            if m:
                blocks.append({"kind": "code", "code": m.group(1)})
                continue

        # Diagram
        if chunk.startswith("<!-- diagram:"):
            m = re.match(r"<!-- diagram: (.*?) -->\n(.*?)(?:\n\*(.*?)\*)?$", chunk, re.DOTALL)
            if m:
                alt = m.group(1).strip()
                steps_raw = m.group(2).strip()
                caption = m.group(3).strip() if m.group(3) else ""
                steps = [re.sub(r"^\d+\.\s*", "", l).strip() for l in steps_raw.split("\n") if l.strip()]
                diag = {"kind": "diagram", "alt": alt, "steps": steps}
                if caption:
                    diag["caption"] = caption
                blocks.append(diag)
                continue

        # Image
        if chunk.startswith("!["):
            m = re.match(r"!\[(.*?)\]\((.*?)\)(?:\n\*(.*?)\*)?$", chunk, re.DOTALL)
            if m:
                alt, src, caption = m.groups()
                img = {"kind": "image", "alt": alt, "src": src}
                if caption:
                    img["caption"] = caption.strip()
                blocks.append(img)
                continue

        # References list
        if "reading and research" in sec_title.lower() or "okuma ve araştırma" in sec_title.lower():
            lines = [l.strip() for l in chunk.split("\n") if l.strip()]
            ref_items = []
            for l in lines:
                m = re.match(r"^\d+\.\s*(?:\[(.*?)\]\((.*?)\)|(.*))$", l)
                if m:
                    if m.group(1) and m.group(2):
                        ref_items.append({"label": m.group(1).strip(), "href": m.group(2).strip()})
                    else:
                        ref_items.append({"label": m.group(3).strip()})
            if ref_items:
                blocks.append({"kind": "references", "items": ref_items})
                continue

        # Checklist (- [ ] item)
        if chunk.startswith("- [ ] "):
            items = [l[6:].strip() for l in chunk.split("\n") if l.strip().startswith("- [ ] ")]
            blocks.append({"kind": "checklist", "items": items})
            continue

        # Numbered list (1. item)
        if re.match(r"^\d+\.\s", chunk):
            items = [re.sub(r"^\d+\.\s*", "", l).strip() for l in chunk.split("\n") if l.strip()]
            blocks.append({"kind": "numbered-list", "items": items})
            continue

        # Unordered bullet list (- item)
        if chunk.startswith("- "):
            items = [l[2:].strip() for l in chunk.split("\n") if l.strip().startswith("- ")]
            blocks.append({"kind": "list", "items": items})
            continue

        # Fallback: paragraph
        blocks.append({"kind": "paragraph", "text": chunk.replace("\n", " ").strip()})

    return blocks


def parse_markdown_file(path: Path) -> tuple[dict, list[dict]]:
    """Parse a Markdown article file into frontmatter dict and sections list."""
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        raise ValueError(f"File {path} lacks frontmatter")

    parts = text.split("---", 2)
    if len(parts) < 3:
        raise ValueError(f"Malformed frontmatter in {path}")

    fm_raw = parts[1].strip()
    body_raw = parts[2].strip()

    frontmatter = {}
    for line in fm_raw.split("\n"):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if ":" not in line:
            continue
        key, val = line.split(":", 1)
        key = key.strip()
        val = val.strip()
        if val.startswith('"') and val.endswith('"'):
            val = val[1:-1]
        elif val.startswith("[") and val.endswith("]"):
            try:
                val = json.loads(val)
            except Exception:
                pass
        elif val in ("true", "True"):
            val = True
        elif val in ("false", "False"):
            val = False
        elif val.isdigit():
            val = int(val)
        frontmatter[key] = val

    # Parse sections
    sec_splits = re.split(r"\n(?=## )", "\n" + body_raw)
    sections = []
    for s in sec_splits:
        s = s.strip()
        if not s:
            continue
        lines = s.split("\n")
        title = ""
        content_lines = lines
        if lines[0].startswith("## "):
            title = lines[0][3:].strip()
            content_lines = lines[1:]
        content = "\n".join(content_lines).strip()
        blocks = parse_markdown_blocks(content, title)
        sections.append({"title": title, "blocks": blocks})

    return frontmatter, sections


def escape_sql(val: str | None) -> str:
    if val is None:
        return "NULL"
    return "'" + str(val).replace("'", "''") + "'"


def generate_article_markdown(entry: dict, lang: str) -> str:
    """Generate exact deterministic Markdown representation for an entry locale."""
    eid = entry.get("id")
    etype = entry.get("type", "learn")
    slug = entry.get("slug", eid)
    category = entry.get("category", "")
    tags = entry.get("tags", [])
    author = entry.get("author", "MESA contributors")
    pub_at = entry.get("publishedAt", "2026-10-01")
    upd_at = entry.get("updatedAt", pub_at)
    reading_min = entry.get("readingMinutes", 5)
    indexable = entry.get("indexable", True)
    draft = entry.get("draft", False)
    status = "draft" if draft else "published"

    locales = entry.get("locales", {})
    seo = entry.get("seo", {})

    loc = locales.get(lang, {})
    loc_seo = seo.get(lang, {})
    title = loc.get("title", "")
    subtitle = loc.get("subtitle", "")
    summary = loc.get("summary", "")
    short_ans = loc.get("shortAnswer", "")
    sections = loc.get("sections", [])

    body_md = ""
    for sec in sections:
        sec_title = sec.get("title", "")
        if sec_title:
            body_md += f"## {sec_title}\n\n"
        for block in sec.get("blocks", []):
            body_md += block_to_markdown(block)

    frontmatter = {
        "id": eid,
        "slug": slug,
        "type": etype,
        "language": lang,
        "title": title,
        "subtitle": subtitle,
        "summary": summary,
        "shortAnswer": short_ans,
        "category": category,
        "tags": tags,
        "author": author,
        "publishedAt": pub_at,
        "updatedAt": upd_at,
        "readingMinutes": reading_min,
        "status": status,
        "indexable": indexable,
        "seoTitle": loc_seo.get("title", title),
        "seoDescription": loc_seo.get("description", summary),
    }
    if etype == "learn" and entry.get("learning"):
        learning = entry["learning"]
        frontmatter.update(lessonOrder=learning["order"], learningStage=learning["stage"],
                           prerequisites=learning["prerequisites"],
                           learningObjectives=learning["objectives"][lang])

    md_content = "---\n"
    for k, v in frontmatter.items():
        if isinstance(v, list):
            md_content += f"{k}: {json.dumps(v, ensure_ascii=False)}\n"
        elif isinstance(v, bool):
            md_content += f"{k}: {'true' if v else 'false'}\n"
        elif isinstance(v, (int, float)):
            md_content += f"{k}: {v}\n"
        else:
            clean_str = str(v).replace("\n", " ").strip()
            md_content += f'{k}: "{clean_str}"\n'
    md_content += "---\n\n"
    md_content += body_md
    return md_content


def generate_seed_sql(hub_data: dict) -> str:
    """Generate canonical SQL seed statements deterministically from hub data."""
    entries = hub_data.get("entries", [])
    categories = hub_data.get("categories", [])

    sql_lines = [
        "-- Seed Data for MESA Content Platform",
        "-- Generated deterministically from content/hub.json",
        "BEGIN;",
        "",
        "-- 1. Seed Categories",
    ]

    for cat in categories:
        cid = cat.get("id")
        sql_lines.append(
            f"INSERT INTO public.categories (id, slug, title_en, title_tr, description_en, description_tr) "
            f"VALUES ({escape_sql(cid)}, {escape_sql(cid)}, {escape_sql(cat.get('title', cid))}, "
            f"{escape_sql(cat.get('title', cid))}, {escape_sql(cat.get('description', ''))}, {escape_sql(cat.get('description', ''))}) "
            f"ON CONFLICT (id) DO NOTHING;"
        )

    sql_lines.append("\n-- 2. Seed Articles and Revisions\n")

    for entry in entries:
        eid = entry.get("id")
        etype = entry.get("type", "learn")
        slug = entry.get("slug", eid)
        tags = entry.get("tags", [])
        author = entry.get("author", "MESA contributors")
        pub_at = entry.get("publishedAt", "2026-10-01")
        upd_at = entry.get("updatedAt", pub_at)
        reading_min = entry.get("readingMinutes", 5)
        indexable = entry.get("indexable", True)
        draft = entry.get("draft", False)
        status = "draft" if draft else "published"

        locales = entry.get("locales", {})
        seo = entry.get("seo", {})

        for lang in ("en", "tr"):
            loc = locales.get(lang, {})
            loc_seo = seo.get(lang, {})
            title = loc.get("title", "")
            subtitle = loc.get("subtitle", "")
            summary = loc.get("summary", "")
            short_ans = loc.get("shortAnswer", "")
            sections = loc.get("sections", [])

            body_md = ""
            for sec in sections:
                sec_title = sec.get("title", "")
                if sec_title:
                    body_md += f"## {sec_title}\n\n"
                for block in sec.get("blocks", []):
                    body_md += block_to_markdown(block)

            tags_sql = "ARRAY[" + ", ".join(escape_sql(t) for t in tags) + "]::text[]" if tags else "'{}'::text[]"
            sql_lines.append(
                f"INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, "
                f"body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, "
                f"published_at, created_at, updated_at) "
                f"VALUES ({escape_sql(slug)}, {escape_sql(etype)}, {escape_sql(lang)}, {escape_sql(title)}, "
                f"{escape_sql(subtitle)}, {escape_sql(summary)}, {escape_sql(short_ans)}, {escape_sql(body_md)}, "
                f"{tags_sql}, {escape_sql(author)}, {reading_min}, '{status}', {escape_sql(loc_seo.get('title', title))}, "
                f"{escape_sql(loc_seo.get('description', summary))}, {'true' if indexable else 'false'}, "
                f"'{pub_at}T00:00:00Z', '{pub_at}T00:00:00Z', '{upd_at}T00:00:00Z') "
                f"ON CONFLICT (slug, language) DO UPDATE SET "
                f"title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());"
            )

    sql_lines.append("\nCOMMIT;\n")
    return "\n".join(sql_lines)


def check_sync() -> list[str]:
    """Check whether hub.json, Markdown articles, and seed.sql are in sync.
    Returns list of mismatch descriptions."""
    errors = []

    if not HUB_FILE.is_file():
        return [f"Missing {HUB_FILE}"]

    hub_data = json.loads(HUB_FILE.read_text(encoding="utf-8"))
    entries = hub_data.get("entries", [])

    # Check 1: Each entry in hub.json has corresponding Markdown files in content/articles/{en,tr}/
    for entry in entries:
        eid = entry.get("id")
        slug = entry.get("slug", eid)
        for lang in ("en", "tr"):
            md_path = ARTICLES_DIR / lang / f"{slug}.md"
            if not md_path.is_file():
                errors.append(f"Missing Markdown file: {md_path.relative_to(ROOT)} for entry id='{eid}' slug='{slug}'")
                continue

            expected_content = generate_article_markdown(entry, lang)
            actual_content = md_path.read_text(encoding="utf-8")
            if actual_content != expected_content:
                errors.append(
                    f"Out of sync: {md_path.relative_to(ROOT)} does not match content/hub.json entry '{eid}'"
                )

    # Check 2: No rogue/orphan Markdown files exist that aren't in hub.json
    expected_slugs = {e.get("slug", e.get("id")) for e in entries}
    for lang in ("en", "tr"):
        lang_dir = ARTICLES_DIR / lang
        if lang_dir.is_dir():
            for p in lang_dir.glob("*.md"):
                slug = p.stem
                if slug not in expected_slugs:
                    errors.append(f"Orphan Markdown file: {p.relative_to(ROOT)} has no entry in content/hub.json")

    # Check 3: supabase/seed.sql matches generated SQL
    if SEED_SQL_FILE.is_file():
        expected_sql = generate_seed_sql(hub_data)
        actual_sql = SEED_SQL_FILE.read_text(encoding="utf-8")
        if actual_sql.strip() != expected_sql.strip():
            errors.append(f"Out of sync: {SEED_SQL_FILE.relative_to(ROOT)} does not match content/hub.json")
    else:
        errors.append(f"Missing SQL seed file: {SEED_SQL_FILE.relative_to(ROOT)}")

    return errors


def sync_from_hub() -> int:
    """Regenerate Markdown articles and supabase/seed.sql from content/hub.json."""
    if not HUB_FILE.is_file():
        print(f"Error: Missing {HUB_FILE}", file=sys.stderr)
        return 1

    hub_data = json.loads(HUB_FILE.read_text(encoding="utf-8"))
    entries = hub_data.get("entries", [])

    (ARTICLES_DIR / "en").mkdir(parents=True, exist_ok=True)
    (ARTICLES_DIR / "tr").mkdir(parents=True, exist_ok=True)

    written_count = 0
    for entry in entries:
        eid = entry.get("id")
        slug = entry.get("slug", eid)
        for lang in ("en", "tr"):
            md_content = generate_article_markdown(entry, lang)
            out_file = ARTICLES_DIR / lang / f"{slug}.md"
            out_file.write_text(md_content, encoding="utf-8")
            written_count += 1

    seed_sql = generate_seed_sql(hub_data)
    SEED_SQL_FILE.parent.mkdir(parents=True, exist_ok=True)
    SEED_SQL_FILE.write_text(seed_sql, encoding="utf-8")

    print(f"✓ Synchronized {written_count} Markdown articles and {SEED_SQL_FILE} from {HUB_FILE}")
    return 0


def sync_from_markdown() -> int:
    """Compile modified Markdown articles back into content/hub.json and supabase/seed.sql."""
    if not HUB_FILE.is_file():
        print(f"Error: Missing {HUB_FILE}", file=sys.stderr)
        return 1

    hub_data = json.loads(HUB_FILE.read_text(encoding="utf-8"))
    entries_map = {e.get("slug", e.get("id")): e for e in hub_data.get("entries", [])}
    id_map = {e.get("id"): e for e in hub_data.get("entries", [])}

    updated_count = 0
    for lang in ("en", "tr"):
        lang_dir = ARTICLES_DIR / lang
        if not lang_dir.is_dir():
            continue
        for md_path in lang_dir.glob("*.md"):
            fm, sections = parse_markdown_file(md_path)
            slug = fm.get("slug", md_path.stem)
            eid = fm.get("id")

            entry = entries_map.get(slug) or (id_map.get(eid) if eid else None)
            if not entry:
                print(f"Warning: Markdown {md_path.name} not found in hub.json, skipping auto-create")
                continue

            # Update common entry metadata from frontmatter
            if "type" in fm:
                entry["type"] = fm["type"]
            if "category" in fm:
                entry["category"] = fm["category"]
            if "tags" in fm and isinstance(fm["tags"], list):
                entry["tags"] = fm["tags"]
            if "author" in fm:
                entry["author"] = fm["author"]
            if "publishedAt" in fm:
                entry["publishedAt"] = fm["publishedAt"]
            if "updatedAt" in fm:
                entry["updatedAt"] = fm["updatedAt"]
            if "readingMinutes" in fm:
                entry["readingMinutes"] = fm["readingMinutes"]
            if "indexable" in fm:
                entry["indexable"] = fm["indexable"]
            if "status" in fm:
                entry["draft"] = fm["status"] == "draft"

            # Update locale specific content
            if "locales" not in entry:
                entry["locales"] = {}
            if lang not in entry["locales"]:
                entry["locales"][lang] = {}

            loc = entry["locales"][lang]
            loc["title"] = fm.get("title", loc.get("title", ""))
            loc["subtitle"] = fm.get("subtitle", loc.get("subtitle", ""))
            loc["summary"] = fm.get("summary", loc.get("summary", ""))
            loc["shortAnswer"] = fm.get("shortAnswer", loc.get("shortAnswer", ""))
            if sections:
                loc["sections"] = sections

            # Update seo
            if "seo" not in entry:
                entry["seo"] = {}
            if lang not in entry["seo"]:
                entry["seo"][lang] = {}
            if "seoTitle" in fm:
                entry["seo"][lang]["title"] = fm["seoTitle"]
            if "seoDescription" in fm:
                entry["seo"][lang]["description"] = fm["seoDescription"]

            updated_count += 1

    # Write updated hub.json
    HUB_FILE.write_text(json.dumps(hub_data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    # Regenerate seed.sql
    seed_sql = generate_seed_sql(hub_data)
    SEED_SQL_FILE.write_text(seed_sql, encoding="utf-8")

    print(f"✓ Compiled {updated_count} Markdown locale files into {HUB_FILE} and {SEED_SQL_FILE}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Synchronize MESA content across Hub JSON, Markdown, and SQL seed.")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--check", action="store_true", help="Validate 1:1 synchronization between all three sources")
    group.add_argument("--from-hub", action="store_true", help="Regenerate Markdown and seed.sql from hub.json")
    group.add_argument("--from-markdown", action="store_true", help="Compile Markdown changes back into hub.json and seed.sql")

    args = parser.parse_args()

    if args.check:
        errors = check_sync()
        if errors:
            print("❌ Article Tri-Source Synchronization Error:", file=sys.stderr)
            for err in errors:
                print(f"  - {err}", file=sys.stderr)
            print("\nTo resolve desynchronization:", file=sys.stderr)
            print("  - If you edited Markdown:  python3 scripts/sync_articles.py --from-markdown", file=sys.stderr)
            print("  - If you edited hub.json:  python3 scripts/sync_articles.py --from-hub", file=sys.stderr)
            return 1
        print("✓ All 3 article sources (content/hub.json, Markdown files, supabase/seed.sql) are 100% in sync.")
        return 0

    if args.from_hub:
        return sync_from_hub()

    if args.from_markdown:
        return sync_from_markdown()

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
