#!/usr/bin/env python3
"""Dependency-free checks for static HTML, metadata, routes, assets, and links."""

from __future__ import annotations

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


CORE_ROUTES = (
    "",
    "how-it-works/",
    "ecosystem/",
    "mesa/",
    "data/",
    "qa/",
    "certification/",
    "law/",
    "use-cases/",
    "evaluation/",
    "docs/",
    "docs/mcp/",
    "status/",
    "about/",
    "faq/",
)
HUB_DATA = json.loads(
    (Path(__file__).resolve().parents[1] / "content" / "hub.json").read_text(encoding="utf-8")
)
HUB_ROUTES = tuple(section["path"] for section in HUB_DATA["sections"]) + tuple(
    entry["path"]
    for entry in HUB_DATA["entries"]
    if entry.get("indexable") and not entry.get("draft")
)
HUB_ENTRY_ROUTES = {
    entry["path"]
    for entry in HUB_DATA["entries"]
    if entry.get("indexable") and not entry.get("draft")
}
HUB_SECTION_ROUTES = {section["path"] for section in HUB_DATA["sections"]}
ROUTES = CORE_ROUTES + HUB_ROUTES
LOCALIZED_ROUTES = ROUTES + tuple(f"tr/{route}" for route in ROUTES)
FORBIDDEN = ("href=\"#\"", "href=''", 'href=""', "javascript:void")


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: list[tuple[str, str, dict[str, str | None]]] = []
        self.ids: set[str] = set()
        self.title_parts: list[str] = []
        self.text_parts: list[str] = []
        self.description: str | None = None
        self.canonical: str | None = None
        self.og_title: str | None = None
        self.og_description: str | None = None
        self.og_url: str | None = None
        self.og_image: str | None = None
        self.twitter_card: str | None = None
        self.twitter_title: str | None = None
        self.twitter_description: str | None = None
        self.twitter_image: str | None = None
        self.html_lang: str | None = None
        self.og_locale: str | None = None
        self.alternates: dict[str, str] = {}
        self.main_count = 0
        self.h1_count = 0
        self.heading_levels: list[int] = []
        self._in_title = False
        self._hidden_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "html":
            self.html_lang = values.get("lang")
        if values.get("id"):
            self.ids.add(str(values["id"]))
        if tag == "title":
            self._in_title = True
        if tag in {"script", "style"}:
            self._hidden_depth += 1
        if tag == "main":
            self.main_count += 1
        if tag == "h1":
            self.h1_count += 1
        if re.fullmatch(r"h[1-6]", tag):
            self.heading_levels.append(int(tag[1]))
        if tag == "meta":
            name, prop, content = values.get("name"), values.get("property"), values.get("content")
            if name == "description":
                self.description = content
            elif name == "twitter:card":
                self.twitter_card = content
            elif name == "twitter:title":
                self.twitter_title = content
            elif name == "twitter:description":
                self.twitter_description = content
            elif name == "twitter:image":
                self.twitter_image = content
            elif prop == "og:title":
                self.og_title = content
            elif prop == "og:description":
                self.og_description = content
            elif prop == "og:url":
                self.og_url = content
            elif prop == "og:image":
                self.og_image = content
            elif prop == "og:locale":
                self.og_locale = content
        if tag == "link" and values.get("rel") == "canonical":
            self.canonical = values.get("href")
        if tag == "link" and values.get("rel") == "alternate" and values.get("hreflang"):
            self.alternates[str(values["hreflang"])] = str(values.get("href") or "")
        for key in ("href", "src"):
            value = values.get(key)
            if value:
                self.refs.append((tag, str(value), values))

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False
        if tag in {"script", "style"} and self._hidden_depth:
            self._hidden_depth -= 1

    def handle_data(self, data: str) -> None:
        cleaned = " ".join(data.split())
        if not cleaned:
            return
        if self._in_title:
            self.title_parts.append(cleaned)
        if not self._hidden_depth:
            self.text_parts.append(cleaned)

    @property
    def title(self) -> str:
        return " ".join(self.title_parts)

    @property
    def visible_text(self) -> str:
        return " ".join(self.text_parts)


def resolve_local(page: Path, root: Path, value: str) -> Path | None:
    parsed = urlsplit(value)
    if parsed.scheme or value.startswith("//"):
        return None
    clean = parsed.path
    if not clean:
        return page.resolve()
    if clean.startswith("/"):
        target = root / clean.lstrip("/")
        deployed_parts = clean.strip("/").split("/") if clean.strip("/") else []
        if not target.exists() and deployed_parts:
            target = root.joinpath(*deployed_parts[1:])
    else:
        target = page.parent / clean
    if clean.endswith("/"):
        target /= "index.html"
    return target.resolve()


def parse_page(page: Path) -> PageParser:
    parsed = PageParser()
    parsed.feed(page.read_text(encoding="utf-8"))
    return parsed


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("root", nargs="?", type=Path, default=Path("dist"))
    args = parser.parse_args()
    root = args.root.resolve()
    errors: list[str] = []
    internal_refs = 0
    external_refs = 0
    titles: set[str] = set()
    descriptions: set[str] = set()

    route_pages = [root / route / "index.html" if route else root / "index.html" for route in LOCALIZED_ROUTES]
    for route, page in zip(LOCALIZED_ROUTES, route_pages, strict=True):
        if not page.is_file():
            errors.append(f"missing route: /{route}")
    for required in (
        "404.html",
        "CNAME",
        "favicon.svg",
        "og-image.png",
        "og-image-tr.png",
        "robots.txt",
        "sitemap.xml",
        ".nojekyll",
    ):
        if not (root / required).is_file():
            errors.append(f"missing required file: {required}")

    pages = sorted(root.rglob("*.html"))
    parsed_pages = {page.resolve(): parse_page(page) for page in pages}
    for page, parsed in parsed_pages.items():
        relative = page.relative_to(root)
        text = page.read_text(encoding="utf-8")
        if not parsed.title:
            errors.append(f"missing title: {relative}")
        elif parsed.title in titles and page.name != "404.html":
            errors.append(f"duplicate title: {relative}")
        titles.add(parsed.title)
        if not parsed.description:
            errors.append(f"missing description: {relative}")
        elif parsed.description in descriptions and page.name != "404.html":
            errors.append(f"duplicate description: {relative}")
        descriptions.add(parsed.description or "")
        expected_language = "tr" if str(relative).startswith("tr/") else "en"
        if page.name != "404.html" and parsed.html_lang != expected_language:
            errors.append(f"incorrect html lang at {relative}: {parsed.html_lang}")
        expected_locale = "tr_TR" if expected_language == "tr" else "en_US"
        if page.name != "404.html" and parsed.og_locale != expected_locale:
            errors.append(f"incorrect og:locale at {relative}: {parsed.og_locale}")
        if not all(
            (
                parsed.canonical,
                parsed.og_title,
                parsed.og_description,
                parsed.og_url,
                parsed.og_image,
                parsed.twitter_card,
                parsed.twitter_title,
                parsed.twitter_description,
                parsed.twitter_image,
            )
        ):
            errors.append(f"incomplete social/canonical metadata: {relative}")
        if parsed.canonical != parsed.og_url:
            errors.append(f"canonical/og:url mismatch: {relative}")
        if parsed.og_image != parsed.twitter_image:
            errors.append(f"Open Graph/Twitter image mismatch: {relative}")
        if parsed.main_count != 1:
            errors.append(f"expected one main element: {relative}")
        if parsed.h1_count != 1:
            errors.append(f"expected one h1: {relative}")
        if parsed.heading_levels and parsed.heading_levels[0] != 1:
            errors.append(f"first heading is not h1: {relative}")
        for previous, current in zip(
            parsed.heading_levels, parsed.heading_levels[1:], strict=False
        ):
            if current > previous + 1:
                errors.append(
                    f"heading level jumps from h{previous} to h{current}: {relative}"
                )
        if page.name != "404.html" and len(parsed.visible_text) < 250:
            errors.append(f"insufficient static HTML content: {relative}")
        if 'id="app"' in text or "requires JavaScript to render" in text:
            errors.append(f"JavaScript-only shell found: {relative}")
        if "{{" in text or "}}" in text:
            errors.append(f"unresolved build token: {relative}")
        json_ld_match = re.search(
            r'<script type="application/ld\+json">(.*?)</script>', text, re.DOTALL
        )
        if not json_ld_match:
            errors.append(f"missing JSON-LD: {relative}")
        else:
            try:
                structured = json.loads(json_ld_match.group(1))
                schema_types = {
                    item.get("@type")
                    for item in structured.get("@graph", [])
                    if isinstance(item, dict)
                }
                if not {"WebSite", "SoftwareSourceCode"}.issubset(schema_types):
                    errors.append(f"incomplete JSON-LD graph: {relative}")
                route_name = str(relative).removesuffix("index.html")
                unlocalized_route = route_name.removeprefix("tr/")
                if (
                    unlocalized_route in HUB_SECTION_ROUTES | HUB_ENTRY_ROUTES
                    and "BreadcrumbList" not in schema_types
                ):
                    errors.append(f"missing BreadcrumbList JSON-LD: {relative}")
                if unlocalized_route in HUB_ENTRY_ROUTES and "Article" not in schema_types:
                    errors.append(f"missing Article JSON-LD: {relative}")
            except (json.JSONDecodeError, AttributeError):
                errors.append(f"invalid JSON-LD: {relative}")
        for marker in FORBIDDEN:
            if marker in text:
                errors.append(f"forbidden link pattern {marker}: {relative}")
        for tag, value, attrs in parsed.refs:
            split = urlsplit(value)
            if split.scheme in {"http", "https"}:
                external_refs += 1
                rel = set((attrs.get("rel") or "").split())
                if tag == "a" and (attrs.get("target") != "_blank" or not {"noopener", "noreferrer"}.issubset(rel)):
                    errors.append(f"unsafe external link: {relative} -> {value}")
                continue
            target = resolve_local(page, root, value)
            if target is None:
                continue
            internal_refs += 1
            if tag == "a" and attrs.get("aria-label") == "MESA home" and target != (root / "index.html").resolve():
                errors.append(f"English home logo does not target site root: {relative} -> {value}")
            if tag == "a" and attrs.get("aria-label") == "MESA ana sayfa" and target != (root / "tr/index.html").resolve():
                errors.append(f"Turkish home logo does not target /tr/: {relative} -> {value}")
            if not target.exists():
                errors.append(f"missing local target: {relative} -> {value}")
                continue
            if split.fragment and target.suffix == ".html":
                target_parser = parsed_pages.get(target) or parse_page(target)
                if split.fragment not in target_parser.ids:
                    errors.append(f"missing anchor: {relative} -> {value}")

    home_text = parsed_pages.get((root / "index.html").resolve(), PageParser()).visible_text
    ecosystem_text = parsed_pages.get((root / "ecosystem/index.html").resolve(), PageParser()).visible_text
    if "Memory with evidence" not in home_text or "MESA helps AI systems" not in home_text:
        errors.append("home page lacks required static value proposition")
    if not all(name in ecosystem_text for name in ("MESA Data", "MESA Core", "MESA QA", "E2E Certification", "MESA Law")):
        errors.append("ecosystem page lacks required static component content")

    static_markers = {
        "how-it-works/": ("Six steps", "Four origins", "MESA QA"),
        "mesa/": ("Four signals", "Graph paths", "True RRF"),
        "law/": ("PRIMARY REFERENCE IMPLEMENTATION", "Official legal source"),
        "use-cases/": ("Agent memory", "Expected benefit"),
        "evaluation/": ("MESA QA", "E2E CERTIFICATION", "Certification remains blocked"),
        "about/": ("WHO MAINTAINS IT", "Open a GitHub issue"),
        "faq/": ("Is MESA a vector database?", "Is MESA production-ready?"),
        "resources/": ("Six surfaces. One knowledge graph.", "METHODOLOGY"),
        "research/keyword-vs-semantic-search/": ("No results yet", "Planned protocol · no results"),
        "guides/verify-ai-yargitay-decision/": ("Capture the exact claim", "Existence is not relevance"),
    }
    for route, markers in static_markers.items():
        page = root / route / "index.html"
        visible = parsed_pages.get(page.resolve(), PageParser()).visible_text
        for marker in markers:
            if marker not in visible:
                errors.append(f"missing static marker at /{route}: {marker}")

    turkish_markers = {
        "tr/": ("KANIT ODAKLI HAFIZA", "MESA yaklaşımı", "GELİŞTİRME DURUMU"),
        "tr/how-it-works/": ("Altı adım", "Dört kaynak", "KALİTE KATMANLARI"),
        "tr/mesa/": ("Dört sinyal", "Graph path", "Gerçek RRF"),
        "tr/law/": ("BİRİNCİL REFERANS UYGULAMA", "Resmî hukuk kaynağı"),
        "tr/use-cases/": ("Ajan hafızası", "Beklenen yarar"),
        "tr/evaluation/": ("MESA QA", "E2E CERTIFICATION", "Sertifikasyon hâlâ engelli"),
        "tr/about/": ("KİM SÜRDÜRÜYOR", "GitHub issue aç"),
        "tr/faq/": ("MESA bir vektör veritabanı mı?", "MESA üretime hazır mı?"),
        "tr/resources/": ("Altı alan. Tek bilgi ağı.", "METODOLOJİ"),
        "tr/learn/semantic-search/": ("Semantic Search Nedir?", "Retrieval hukuki otorite değildir"),
        "tr/research/keyword-vs-semantic-search/": ("Henüz sonuç yok", "Planlanan protokol · sonuç yok"),
        "tr/guides/verify-ai-yargitay-decision/": ("İddiayı aynen kaydedin", "Var olmak, ilgili olmak değildir"),
        "tr/glossary/provenance/": ("Provenance", "Hukuki örnek"),
        "tr/methodology/retrieval-evaluation/": ("Relevance judgment", "Raporlama ve düzeltmeler"),
    }
    for route, markers in turkish_markers.items():
        page = root / route / "index.html"
        visible = parsed_pages.get(page.resolve(), PageParser()).visible_text
        for marker in markers:
            if marker not in visible:
                errors.append(f"missing Turkish static marker at /{route}: {marker}")

    english_home = parsed_pages.get((root / "index.html").resolve())
    if english_home and english_home.canonical:
        origin = english_home.canonical
        for route in ROUTES:
            for localized, language in ((route, "en"), (f"tr/{route}", "tr")):
                page = root / localized / "index.html" if localized else root / "index.html"
                parsed = parsed_pages.get(page.resolve())
                if not parsed:
                    continue
                expected_canonical = f"{origin}{localized}"
                expected_alternates = {
                    "en": f"{origin}{route}",
                    "tr": f"{origin}tr/{route}",
                    "x-default": f"{origin}{route}",
                }
                if parsed.canonical != expected_canonical:
                    errors.append(f"incorrect localized canonical: {page.relative_to(root)}")
                if parsed.alternates != expected_alternates:
                    errors.append(f"incorrect hreflang set: {page.relative_to(root)}")
                switch_language = "tr" if language == "en" else "en"
                counterpart_route = f"tr/{route}" if switch_language == "tr" else route
                counterpart = root / counterpart_route / "index.html" if counterpart_route else root / "index.html"
                if not any(
                    attrs.get("hreflang") == switch_language
                    and resolve_local(page, root, value) == counterpart.resolve()
                    for tag, value, attrs in parsed.refs
                    if tag == "a"
                ):
                    errors.append(f"missing context-preserving language switch: {page.relative_to(root)}")

    home_parser = parsed_pages.get((root / "index.html").resolve())
    if home_parser and home_parser.canonical:
        site_url = home_parser.canonical
        sitemap = (root / "sitemap.xml").read_text(encoding="utf-8")
        for route in LOCALIZED_ROUTES:
            expected = f"<loc>{site_url}{route}</loc>"
            if expected not in sitemap:
                errors.append(f"sitemap missing route: /{route}")
        for entry in HUB_DATA["entries"]:
            if entry.get("draft") or not entry.get("indexable"):
                if entry["path"] in sitemap:
                    errors.append(f"draft or non-indexable hub route leaked into sitemap: {entry['path']}")
        robots = (root / "robots.txt").read_text(encoding="utf-8")
        if f"Sitemap: {site_url}sitemap.xml" not in robots:
            errors.append("robots.txt sitemap URL does not match canonical origin")
        if site_url == "https://mesamemory.dev/":
            if (root / "CNAME").read_text(encoding="utf-8").strip() != "mesamemory.dev":
                errors.append("CNAME does not match mesamemory.dev")
            published_text = "\n".join(
                path.read_text(encoding="utf-8")
                for path in root.rglob("*")
                if path.is_file() and path.suffix in {".html", ".xml", ".txt"}
            )
            if "yasou13.github.io/mesa.github.io" in published_text:
                errors.append("legacy GitHub Pages URL leaked into custom-domain artifact")

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
    print(f"SITE CHECK PASS: {len(LOCALIZED_ROUTES)} localized routes, {len(pages)} HTML files, {internal_refs} internal references, {external_refs} external references")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
