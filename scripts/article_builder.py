#!/usr/bin/env python3
"""Generator and appender for 20 cohesive, comprehensive, bilingual MESA articles."""

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HUB_FILE = ROOT / "content" / "hub.json"


def build_article(
    slug: str,
    category: str,
    reading_minutes: int,
    tags: list[str],
    en_title: str,
    en_subtitle: str,
    en_summary: str,
    en_short_answer: str,
    en_dilemma_title: str,
    en_dilemma_text: str,
    en_warning_title: str,
    en_warning_text: str,
    en_table_headers: list[str],
    en_table_rows: list[list[str]],
    en_mech_title: str,
    en_mech_text: str,
    en_code: str,
    en_mesa_title: str,
    en_mesa_text: str,
    en_checklist: list[str],
    en_refs: list[dict],
    tr_title: str,
    tr_subtitle: str,
    tr_summary: str,
    tr_short_answer: str,
    tr_dilemma_title: str,
    tr_dilemma_text: str,
    tr_warning_title: str,
    tr_warning_text: str,
    tr_table_headers: list[str],
    tr_table_rows: list[list[str]],
    tr_mech_title: str,
    tr_mech_text: str,
    tr_code: str,
    tr_mesa_title: str,
    tr_mesa_text: str,
    tr_checklist: list[str],
    tr_refs: list[dict],
) -> dict:
    return {
        "id": slug,
        "type": "learn",
        "slug": slug,
        "path": f"learn/{slug}/",
        "publishedAt": "2026-10-17",
        "updatedAt": "2026-10-17",
        "author": "MESA contributors",
        "tags": tags,
        "category": category,
        "draft": False,
        "indexable": True,
        "readingMinutes": reading_minutes,
        "related": ["what-is-ai-memory", "hybrid-retrieval"],
        "seo": {
            "en": {
                "title": f"{en_title} — MESA Learn",
                "description": en_summary[:155],
            },
            "tr": {
                "title": f"{tr_title} — MESA Learn",
                "description": tr_summary[:155],
            },
        },
        "locales": {
            "en": {
                "title": en_title,
                "subtitle": en_subtitle,
                "summary": en_summary,
                "shortAnswer": en_short_answer,
                "sections": [
                    {
                        "id": "architectural-dilemma",
                        "title": en_dilemma_title,
                        "blocks": [
                            {"kind": "paragraph", "text": en_dilemma_text},
                            {"kind": "warning", "title": en_warning_title, "text": en_warning_text},
                        ],
                    },
                    {
                        "id": "engineering-trade-offs",
                        "title": "Engineering trade-offs side-by-side",
                        "blocks": [
                            {"kind": "table", "headers": en_table_headers, "rows": en_table_rows},
                        ],
                    },
                    {
                        "id": "core-mechanisms",
                        "title": en_mech_title,
                        "blocks": [
                            {"kind": "paragraph", "text": en_mech_text},
                            {"kind": "code", "code": en_code},
                        ],
                    },
                    {
                        "id": "mesa-implementation",
                        "title": en_mesa_title,
                        "blocks": [
                            {"kind": "paragraph", "text": en_mesa_text},
                            {"kind": "checklist", "items": en_checklist},
                        ],
                    },
                    {
                        "id": "references",
                        "title": "References",
                        "blocks": [
                            {"kind": "references", "items": en_refs},
                        ],
                    },
                ],
            },
            "tr": {
                "title": tr_title,
                "subtitle": tr_subtitle,
                "summary": tr_summary,
                "shortAnswer": tr_short_answer,
                "sections": [
                    {
                        "id": "architectural-dilemma",
                        "title": tr_dilemma_title,
                        "blocks": [
                            {"kind": "paragraph", "text": tr_dilemma_text},
                            {"kind": "warning", "title": tr_warning_title, "text": tr_warning_text},
                        ],
                    },
                    {
                        "id": "engineering-trade-offs",
                        "title": "Mühendislik ödünleşimlerinin karşılaştırması",
                        "blocks": [
                            {"kind": "table", "headers": tr_table_headers, "rows": tr_table_rows},
                        ],
                    },
                    {
                        "id": "core-mechanisms",
                        "title": tr_mech_title,
                        "blocks": [
                            {"kind": "paragraph", "text": tr_mech_text},
                            {"kind": "code", "code": tr_code},
                        ],
                    },
                    {
                        "id": "mesa-implementation",
                        "title": tr_mesa_title,
                        "blocks": [
                            {"kind": "paragraph", "text": tr_mesa_text},
                            {"kind": "checklist", "items": tr_checklist},
                        ],
                    },
                    {
                        "id": "references",
                        "title": "Kaynaklar",
                        "blocks": [
                            {"kind": "references", "items": tr_refs},
                        ],
                    },
                ],
            },
        },
    }
