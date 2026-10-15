#!/usr/bin/env python3
"""Deterministic migration script from content/hub.json to canonical Markdown articles and SQL seed."""

from __future__ import annotations

import json
import re
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
HUB_FILE = ROOT / "content" / "hub.json"
ARTICLES_DIR = ROOT / "content" / "articles"
SEED_SQL_FILE = ROOT / "supabase" / "seed.sql"


def block_to_markdown(block: dict) -> str:
    kind = block.get("kind")
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


def escape_sql(val: str | None) -> str:
    if val is None:
        return "NULL"
    return "'" + str(val).replace("'", "''") + "'"


def main() -> int:
    if not HUB_FILE.is_file():
        raise SystemExit(f"Missing {HUB_FILE}")

    hub_data = json.loads(HUB_FILE.read_text(encoding="utf-8"))
    entries = hub_data.get("entries", [])
    categories = hub_data.get("categories", [])
    topics = hub_data.get("topics", [])

    print(f"Loaded {len(entries)} entries from {HUB_FILE}")

    # Ensure articles directories exist
    (ARTICLES_DIR / "en").mkdir(parents=True, exist_ok=True)
    (ARTICLES_DIR / "tr").mkdir(parents=True, exist_ok=True)

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

        for lang in ("en", "tr"):
            loc = locales.get(lang, {})
            loc_seo = seo.get(lang, {})
            title = loc.get("title", "")
            subtitle = loc.get("subtitle", "")
            summary = loc.get("summary", "")
            short_ans = loc.get("shortAnswer", "")
            sections = loc.get("sections", [])

            # Convert sections to Markdown body
            body_md = ""
            for sec in sections:
                sec_title = sec.get("title", "")
                if sec_title:
                    body_md += f"## {sec_title}\n\n"
                for block in sec.get("blocks", []):
                    body_md += block_to_markdown(block)

            # YAML Frontmatter
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

            md_content = "---\n"
            for k, v in frontmatter.items():
                if isinstance(v, list):
                    md_content += f"{k}: {json.dumps(v, ensure_ascii=False)}\n"
                elif isinstance(v, bool):
                    md_content += f"{k}: {'true' if v else 'false'}\n"
                elif isinstance(v, (int, float)):
                    md_content += f"{k}: {v}\n"
                else:
                    # Escape quotes in string
                    clean_str = str(v).replace("\n", " ").strip()
                    md_content += f'{k}: "{clean_str}"\n'
            md_content += "---\n\n"
            md_content += body_md

            out_file = ARTICLES_DIR / lang / f"{slug}.md"
            out_file.write_text(md_content, encoding="utf-8")

            # SQL Insert
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

    SEED_SQL_FILE.parent.mkdir(parents=True, exist_ok=True)
    SEED_SQL_FILE.write_text("\n".join(sql_lines), encoding="utf-8")
    print(f"Generated {SEED_SQL_FILE} with {len(sql_lines)} lines")
    print(f"Successfully migrated {len(entries)} articles to {ARTICLES_DIR}/en and {ARTICLES_DIR}/tr")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
