#!/usr/bin/env python3
"""Dependency-free checks for static HTML, metadata, routes, assets, and links."""

from __future__ import annotations

import argparse
import json
import re
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from urllib.robotparser import RobotFileParser


CORE_ROUTES = (
    "",
    "how-it-works/",
    "architecture/",
    "retrieval/",
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
    "early-access/",
    "privacy/",
)
HUB_DATA = json.loads(
    (Path(__file__).resolve().parents[1] / "content" / "hub.json").read_text(encoding="utf-8")
)
MEDIA_DATA = json.loads(
    (Path(__file__).resolve().parents[1] / "content" / "media-scenes.json").read_text(encoding="utf-8")
)
REQUIRED_MEDIA_RECORDS = ("event-horizon",)
HOME_SCENES = ("event-horizon",)
HOME_SECTIONS = ("hero", "process", "capabilities", "explore")
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

DOCS_MANIFEST_FILE = Path(__file__).resolve().parents[1] / "content" / "docs" / "manifest.json"
if DOCS_MANIFEST_FILE.is_file():
    DOCS_MANIFEST = json.loads(DOCS_MANIFEST_FILE.read_text(encoding="utf-8"))
    DOC_ROUTES = tuple(
        page["route"]
        for repo in DOCS_MANIFEST.get("repositories", {}).values()
        for page in repo.get("pages", [])
    )
else:
    DOC_ROUTES = ()
GUIDE_CATALOG = json.loads((Path(__file__).resolve().parents[1] / "content/docs/guides.json").read_text())
DOC_ROUTES = tuple(dict.fromkeys((*DOC_ROUTES, *(guide["route"] for guide in GUIDE_CATALOG["guides"]))))
DOC_ENTRY_ROUTES = set(DOC_ROUTES)

PAGE_REDIRECTS = {page["path"]: page["redirectTo"] for page in json.loads(
    (Path(__file__).resolve().parents[1] / "site-data.json").read_text()
)["pages"].values() if page.get("redirectTo")}
REDIRECT_ROUTES = {prefix + route: prefix + target for prefix in ("", "tr/") for route, target in PAGE_REDIRECTS.items()}
ROUTES = tuple(route for route in CORE_ROUTES if route not in PAGE_REDIRECTS) + HUB_ROUTES + DOC_ROUTES
LOCALIZED_ROUTES = ROUTES + tuple(f"tr/{route}" for route in ROUTES)
FORBIDDEN = ("href=\"#\"", "href=''", 'href=""', "javascript:void")


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: list[tuple[str, str, dict[str, str | None]]] = []
        self.ids: set[str] = set()
        self.duplicate_ids: set[str] = set()
        self.unsafe_attributes: list[str] = []
        self.title_parts: list[str] = []
        self.text_parts: list[str] = []
        self.description: str | None = None
        self.robots: set[str] = set()
        self.dates: set[str] = set()
        self.unfocusable_tables = 0
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
        self.scene_ids: list[str] = []
        self.home_sections: list[str] = []
        self.scene_media: list[tuple[str, str | None, str | None]] = []
        self._in_title = False
        self._hidden_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if "table-scroll" in (values.get("class") or "").split() and values.get("tabindex") != "0":
            self.unfocusable_tables += 1
        self.unsafe_attributes.extend(name for name, _ in attrs if name.lower().startswith("on"))
        if tag == "html":
            self.html_lang = values.get("lang")
        if values.get("data-scene"):
            self.scene_ids.append(str(values["data-scene"]))
        if values.get("data-home-section"):
            self.home_sections.append(str(values["data-home-section"]))
        if values.get("data-scene-media"):
            self.scene_media.append(
                (
                    str(values["data-scene-media"]),
                    values.get("aria-hidden"),
                    values.get("data-media-state"),
                )
            )
        if values.get("id"):
            if str(values["id"]) in self.ids:
                self.duplicate_ids.add(str(values["id"]))
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
            elif name and name.lower() in {"robots", "googlebot", "bingbot"}:
                self.robots.update((content or "").lower().replace(",", " ").split())
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
        if tag == "time" and values.get("datetime"):
            self.dates.add(str(values["datetime"]))
        if tag == "link" and values.get("rel") == "alternate" and values.get("hreflang"):
            self.alternates[str(values["hreflang"])] = str(values.get("href") or "")
        for key in ("href", "src"):
            value = values.get(key)
            if value:
                self.refs.append((tag, str(value), values))
        if values.get("srcset"):
            for candidate in str(values["srcset"]).split(","):
                self.refs.append((tag, candidate.strip().split()[0], values))

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

    for route in (*LOCALIZED_ROUTES, *REDIRECT_ROUTES):
        page = root / route / "index.html"
        if not page.is_file():
            errors.append(f"missing route: /{route}")
    for required in (
        "404.html",
        "CNAME",
        "favicon.svg",
        "favicon.ico",
        "favicon.png",
        "apple-touch-icon.png",
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

    manifest_scenes = MEDIA_DATA.get("scenes", [])
    manifest_ids = tuple(scene.get("id") for scene in manifest_scenes)
    if len(set(manifest_ids)) != len(manifest_ids) or not set(REQUIRED_MEDIA_RECORDS).issubset(manifest_ids):
        errors.append(f"media manifest has duplicate or missing required records: {manifest_ids}")
    for scene in manifest_scenes:
        for filename in scene.get("assets", {}).values():
            if filename and not (root / MEDIA_DATA["mediaRoot"] / filename).is_file():
                errors.append(f"configured scene asset is missing: {scene['id']} / {filename}")
        for key, size_key in (("poster", "posterSize"), ("mobilePoster", "mobilePosterSize")):
            if scene.get("assets", {}).get(key):
                size = scene.get(size_key, {})
                if not all(isinstance(size.get(dim), int) and size[dim] > 0 for dim in ("width", "height")):
                    errors.append(f"configured poster lacks intrinsic dimensions: {scene['id']} / {key}")

    for page, parsed in parsed_pages.items():
        relative = page.relative_to(root)
        is_exempt = page.name == "404.html" or str(relative) in {"admin/index.html", "tr/admin/index.html"}
        text = page.read_text(encoding="utf-8")
        if parsed.duplicate_ids:
            errors.append(f"duplicate element IDs: {relative}: {sorted(parsed.duplicate_ids)}")
        if parsed.unsafe_attributes:
            errors.append(f"inline event attributes: {relative}")
        if parsed.unfocusable_tables:
            errors.append(f"scrollable table is not keyboard focusable: {relative}")
        if str(relative) in {"admin/index.html", "tr/admin/index.html"} and 'content="noindex, nofollow"' not in text:
            errors.append(f"admin must be noindex: {relative}")
        if not parsed.title:
            errors.append(f"missing title: {relative}")
        elif parsed.title in titles and not is_exempt:
            errors.append(f"duplicate title: {relative}")
        titles.add(parsed.title)
        if not parsed.description:
            errors.append(f"missing description: {relative}")
        elif parsed.description in descriptions and not is_exempt:
            errors.append(f"duplicate description: {relative}")
        descriptions.add(parsed.description or "")
        expected_language = "tr" if str(relative).startswith("tr/") else "en"
        if not is_exempt and parsed.html_lang != expected_language:
            errors.append(f"incorrect html lang at {relative}: {parsed.html_lang}")
        expected_locale = "tr_TR" if expected_language == "tr" else "en_US"
        if not is_exempt and parsed.og_locale != expected_locale:
            errors.append(f"incorrect og:locale at {relative}: {parsed.og_locale}")
        if not is_exempt and not all(
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
        if not is_exempt and parsed.canonical != parsed.og_url:
            errors.append(f"canonical/og:url mismatch: {relative}")
        if str(relative).removesuffix("index.html") in LOCALIZED_ROUTES and parsed.robots & {"noindex", "none", "nosnippet"}:
            errors.append(f"public page has restrictive robots metadata: {relative}")
        if not is_exempt and parsed.og_image != parsed.twitter_image:
            errors.append(f"Open Graph/Twitter image mismatch: {relative}")
        if not is_exempt and parsed.main_count != 1:
            errors.append(f"expected one main element: {relative}")
        if not is_exempt and parsed.h1_count != 1:
            errors.append(f"expected one h1: {relative}")
        if not is_exempt and parsed.heading_levels and parsed.heading_levels[0] != 1:
            errors.append(f"first heading is not h1: {relative}")
        for previous, current in zip(
            parsed.heading_levels, parsed.heading_levels[1:], strict=False
        ):
            if current > previous + 1:
                errors.append(
                    f"heading level jumps from h{previous} to h{current}: {relative}"
                )
        if not is_exempt and str(relative).removesuffix("index.html") not in REDIRECT_ROUTES and len(parsed.visible_text) < 250:
            errors.append(f"insufficient static HTML content: {relative}")
        if relative in {Path("index.html"), Path("tr/index.html")}:
            if tuple(parsed.home_sections) != HOME_SECTIONS:
                errors.append(f"homepage section order mismatch at {relative}: {parsed.home_sections}")
            if tuple(parsed.scene_ids) != HOME_SCENES:
                errors.append(f"homepage scene order mismatch at {relative}: {parsed.scene_ids}")
            if parsed.scene_media:
                errors.append(f"retired homepage bitmap media at {relative}")
            for anchor in ("the-problem", "why-mesa", "mesa-in-action", "how-it-works", "ecosystem"):
                if anchor not in parsed.ids:
                    errors.append(f"missing preserved homepage anchor at {relative}: {anchor}")
            for fixture_field in ("pip install", "mesa-memory[adapters]==0.9.0", "mesa start", "MESA Core", "policy.txt"):
                if fixture_field not in parsed.visible_text:
                    errors.append(f"missing homepage installation or document example at {relative}: {fixture_field}")
            for scene_id, hidden, state in parsed.scene_media:
                if hidden != "true":
                    errors.append(f"scene media must be aria-hidden at {relative}: {scene_id}")
                if state not in {"fallback", "configured"}:
                    errors.append(f"invalid initial media state at {relative}: {scene_id} / {state}")
        if relative in {Path("retrieval/index.html"), Path("tr/retrieval/index.html")}:
            for fixture_field in ("source-chunk-1", "doc-1 / chunk-1", "4 ÷ 61", "7062faf"):
                if fixture_field not in parsed.visible_text:
                    errors.append(f"missing technical fixture evidence at {relative}: {fixture_field}")
        if text.count('class="cosmic cosmic--') != 1:
            errors.append(f"expected one shared cosmic environment: {relative}")
        if 'id="app"' in text or "requires JavaScript to render" in text:
            errors.append(f"JavaScript-only shell found: {relative}")
        if "{{" in text:
            errors.append(f"unresolved build token: {relative}")
        json_ld_match = re.search(
            r'<script type="application/ld\+json">(.*?)</script>', text, re.DOTALL
        )
        if is_exempt:
            pass
        elif not json_ld_match:
            errors.append(f"missing JSON-LD: {relative}")
        else:
            try:
                structured = json.loads(json_ld_match.group(1))
                schema_types = {
                    item.get("@type")
                    for item in structured.get("@graph", [])
                    if isinstance(item, dict)
                }
                if not {"WebSite", "WebPage", "SoftwareSourceCode"}.issubset(schema_types):
                    errors.append(f"incomplete JSON-LD graph: {relative}")
                nodes = structured.get("@graph", [])
                website = next((node for node in nodes if node.get("@type") == "WebSite"), {})
                webpage = next((node for node in nodes if node.get("@type") == "WebPage"), {})
                software = next((node for node in nodes if node.get("@type") == "SoftwareSourceCode"), {})
                if (webpage.get("url"), webpage.get("name"), webpage.get("description"), webpage.get("inLanguage")) != (parsed.canonical, parsed.title, parsed.description, parsed.html_lang):
                    errors.append(f"WebPage does not match page metadata: {relative}")
                if webpage.get("isPartOf", {}).get("@id") != website.get("@id") or webpage.get("about", {}).get("@id") != software.get("@id"):
                    errors.append(f"disconnected page/site/software identities: {relative}")
                home_path = root / ("tr/index.html" if expected_language == "tr" else "index.html")
                home = parsed_pages.get(home_path.resolve())
                if home and (website.get("description") != home.description or software.get("description") != home.description):
                    errors.append(f"site/software identity description varies by page: {relative}")
                for node in nodes:
                    if node.get("@type") == "BreadcrumbList":
                        crumbs = node.get("itemListElement", [])
                        urls = [crumb.get("item") for crumb in crumbs]
                        if len(urls) != len(set(urls)) or not urls or urls[-1] != parsed.canonical or [crumb.get("position") for crumb in crumbs] != list(range(1, len(crumbs) + 1)):
                            errors.append(f"invalid breadcrumb hierarchy: {relative}")
                    if node.get("@type") in {"Article", "TechArticle"}:
                        author = node.get("author", {}).get("name")
                        if author and author not in parsed.visible_text:
                            errors.append(f"Schema author is not visible: {relative}")
                        for date_field in ("datePublished", "dateModified"):
                            if node.get(date_field) and node[date_field] not in parsed.dates:
                                errors.append(f"Schema {date_field} is not visible: {relative}")
                route_name = str(relative).removesuffix("index.html")
                unlocalized_route = route_name.removeprefix("tr/")
                if (
                    unlocalized_route in HUB_SECTION_ROUTES | HUB_ENTRY_ROUTES | DOC_ENTRY_ROUTES
                    and "BreadcrumbList" not in schema_types
                ):
                    errors.append(f"missing BreadcrumbList JSON-LD: {relative}")
                if unlocalized_route in HUB_ENTRY_ROUTES and "Article" not in schema_types:
                    errors.append(f"missing Article JSON-LD: {relative}")
                if unlocalized_route in DOC_ENTRY_ROUTES and not ({"Article", "TechArticle"} & schema_types):
                    errors.append(f"missing TechArticle JSON-LD: {relative}")
            except (json.JSONDecodeError, AttributeError):
                errors.append(f"invalid JSON-LD: {relative}")
        for marker in FORBIDDEN:
            if marker in text:
                errors.append(f"forbidden link pattern {marker}: {relative}")
        for tag, value, attrs in parsed.refs:
            split = urlsplit(value)
            if split.scheme and split.scheme not in {"http", "https", "mailto", "tel"}:
                errors.append(f"unsafe URL scheme: {relative}")
                continue
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

    search_path = root / "search-index.json"
    if not search_path.is_file():
        errors.append("missing search index")
    else:
        search = json.loads(search_path.read_text(encoding="utf-8"))
        search_ids = set()
        for item in search:
            value = item.get("url", "")
            if item.get("id") in search_ids:
                errors.append("duplicate search identity")
            search_ids.add(item.get("id"))
            if value.startswith("/") or ".." in value.split("/") or urlsplit(value).scheme or "admin/" in value:
                errors.append("unsafe/private search URL")
                continue
            if value in REDIRECT_ROUTES:
                errors.append(f"consolidated route leaked into search: {value}")
            target = root / value / "index.html"
            if not target.is_file():
                errors.append(f"search result has no public route: {value}")

    home_text = parsed_pages.get((root / "index.html").resolve(), PageParser()).visible_text
    ecosystem_text = parsed_pages.get((root / "ecosystem/index.html").resolve(), PageParser()).visible_text
    if "pip install" not in home_text or "relevant text and its source" not in home_text:
        errors.append("home page lacks required static value proposition")
    if not all(name in ecosystem_text for name in ("MESA Data", "MESA Core", "MESA QA", "E2E Certification", "MESA Law")):
        errors.append("ecosystem page lacks required static component content")

    static_markers = {
        "how-it-works/": ("You add a text file.", "MESA prepares the text for search.", "Your application asks a question."),
        "law/": ("PRIMARY REFERENCE IMPLEMENTATION", "Official legal source"),
        "evaluation/": ("MESA QA", "E2E CERTIFICATION", "Certification remains blocked"),
        "about/": ("WHO MAINTAINS IT", "Open a GitHub issue"),
        "faq/": ("Does MESA write the answer?", "Is MESA production-ready?"),
        "resources/": ("Install MESA", "Learn how AI memory works", "Look up an unfamiliar term"),
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
        "tr/": ("belgelerinizden bilgi bulsun.", "pip install", "Alfa"),
        "tr/how-it-works/": ("Bir metin dosyası eklersiniz.", "MESA metni aranabilir hâle getirir.", "Uygulamanız bir soru sorar."),
        "tr/law/": ("BİRİNCİL REFERANS UYGULAMA", "Resmî hukuk kaynağı"),
        "tr/evaluation/": ("MESA QA", "E2E CERTIFICATION", "Sertifikasyon için eksikler sürüyor"),
        "tr/about/": ("KİM GELİŞTİRİYOR", "GitHub üzerinden bildirin"),
        "tr/faq/": ("MESA yanıtı kendisi mi yazar?", "MESA canlı kullanıma hazır mı?"),
        "tr/resources/": ("MESA’yı kurmak istiyorum", "Bilmediğim bir terime bakacağım", "Değerlendirme yöntemleri"),
        "tr/learn/semantic-search/": ("Anlamsal arama: vektörler neyi anlatır?", "İki boyutlu benzerlik hesabı"),
        "tr/research/keyword-vs-semantic-search/": ("Henüz sonuç yok", "Araştırma planı · henüz sonuç yok"),
        "tr/guides/verify-ai-yargitay-decision/": ("İddiayı aynen kaydedin", "Var olmak, ilgili olmak değildir"),
        "tr/glossary/provenance/": ("Kaynak izi", "Hukuki örnek"),
        "tr/methodology/retrieval-evaluation/": ("İlgililik değerlendirmesi", "Raporlama ve düzeltmeler"),
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

    for old_route, target in REDIRECT_ROUTES.items():
        page = root / old_route / "index.html"
        parsed = parsed_pages.get(page.resolve())
        if not parsed:
            continue
        origin = english_home.canonical if english_home else None
        if not origin:
            continue
        if "noindex" not in parsed.robots or parsed.canonical != origin + target.split("#")[0]:
            errors.append(f"invalid consolidated route metadata: {old_route}")
        if not any(tag == "a" and resolve_local(page, root, value) == (root / target.split("#")[0] / "index.html").resolve() for tag, value, attrs in parsed.refs):
            errors.append(f"consolidated route has no working destination: {old_route}")
        if 'http-equiv="refresh"' not in page.read_text():
            errors.append(f"consolidated route does not forward: {old_route}")

    home_parser = parsed_pages.get((root / "index.html").resolve())
    if home_parser and home_parser.canonical:
        site_url = home_parser.canonical
        sitemap = (root / "sitemap.xml").read_text(encoding="utf-8")
        try:
            sitemap_root = ET.fromstring(sitemap)
            namespace = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
            if sitemap_root.tag != f"{namespace}urlset":
                errors.append("sitemap root is not a sitemap.org urlset")
            urls = [node.text for node in sitemap_root.findall(f"{namespace}url/{namespace}loc")]
            expected_urls = {f"{site_url}{route}" for route in LOCALIZED_ROUTES}
            if len(urls) != len(set(urls)) or set(urls) != expected_urls:
                errors.append("sitemap must contain exactly the public canonical URLs without duplicates")
        except ET.ParseError:
            errors.append("sitemap is not valid XML")
        for route in LOCALIZED_ROUTES:
            expected = f"<loc>{site_url}{route}</loc>"
            if expected not in sitemap:
                errors.append(f"sitemap missing route: /{route}")
        for entry in HUB_DATA["entries"]:
            if entry.get("draft") or not entry.get("indexable"):
                if entry["path"] in sitemap:
                    errors.append(f"draft or non-indexable hub route leaked into sitemap: {entry['path']}")
        robots = (root / "robots.txt").read_text(encoding="utf-8")
        crawler_rules = RobotFileParser()
        crawler_rules.parse(robots.splitlines())
        for bot in ("Googlebot", "Bingbot", "OAI-SearchBot", "PerplexityBot", "Claude-SearchBot"):
            if any(not crawler_rules.can_fetch(bot, f"{site_url}{route}") for route in LOCALIZED_ROUTES):
                errors.append(f"robots.txt blocks a public canonical page for {bot}")
        # Admin pages stay out of search through noindex; robots.txt must not advertise their path.
        for admin_route in ("admin/", "tr/admin/"):
            admin_html = (root / admin_route / "index.html").read_text(encoding="utf-8")
            if '<meta name="robots" content="noindex' not in admin_html:
                errors.append(f"admin page lost its noindex directive: /{admin_route}")
            if f"/{admin_route}" in robots:
                errors.append(f"robots.txt advertises the admin path: /{admin_route}")
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
