#!/usr/bin/env python3
"""Generate the static HTTP endpoint reference from the pinned Core OpenAPI file.

Input:  content/docs/openapi-0.8.1.json (Core v0.8.1, docs/reference/openapi.json at d394784)
Output: content/docs/guides/{en,tr}/endpoints.md

Examples are built from the schema (types, defaults, enums and declared examples).
They show the request shape; they are not captured server responses.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SPEC = json.loads((ROOT / "content/docs/openapi-0.8.1.json").read_text(encoding="utf-8"))
SCHEMAS = SPEC["components"]["schemas"]

# Placeholder values that match the IDs used throughout the quickstart.
NAMED = {
    "tenant_id": "docs-tenant", "workspace_id": "docs-workspace", "dataset_id": "docs-dataset",
    "agent_id": "docs-agent", "session_id": "<session_id>", "document_id": "archive-hours",
    "revision_id": "revision-1", "chunk_id": "chunk-1", "title": "Archive opening hours",
    "source_ref": "demo://archive-hours", "content": "The archive opens at nine on weekdays.",
    "query": "When does the archive open?", "mutation_id": "<mutation_id>", "operation_id": "<operation_id>",
}

GROUPS = [
    ("v4-full-cognitive", ("V4 · memory, catalog and sessions", "V4 · hafıza, katalog ve oturumlar")),
    ("-", ("Health and metrics", "Sağlık ve metrikler")),
    ("mcp-control", ("MCP control plane", "MCP kontrol düzlemi")),
    ("memory", ("V3 compatibility · memory", "V3 uyumluluk · hafıza")),
    ("session", ("V3 compatibility · sessions", "V3 uyumluluk · oturumlar")),
]

LABELS = {
    "en": {
        "title_note": "Generated from the OpenAPI document published with Core v0.8.1 (commit d394784). Example bodies are built from the schema to show the shape of a request; they are not recorded server responses.",
        "download": "Download the OpenAPI JSON",
        "auth": "Every endpoint except `/health/init` needs the `X-API-Key` header. What a V4 call may touch is limited by the roles granted to that key; see [Security & Scope](docs/core/security/).",
        "params": "Parameters", "body": "Request body", "fields": "Fields", "responses": "Responses",
        "example": "Example", "name": "Name", "in": "In", "type": "Type", "required": "Required", "yes": "yes", "no": "no",
        "field": "Field", "description": "Description", "auth_required": "Requires `X-API-Key`.", "public": "No API key required.",
        "contents": "Endpoints in this group",
    },
    "tr": {
        "title_note": "Core v0.8.1 (commit d394784) ile yayımlanan OpenAPI belgesinden üretildi. Örnek gövdeler isteğin biçimini göstermek için şemadan oluşturulur; kaydedilmiş sunucu yanıtları değildir. Alan açıklamaları kaynakta İngilizcedir.",
        "download": "OpenAPI JSON dosyasını indirin",
        "auth": "`/health/init` dışındaki her uç nokta `X-API-Key` başlığı ister. V4 çağrısının erişebileceği veri, o anahtara verilen rollerle sınırlıdır; bkz. [Güvenlik ve kapsam](docs/core/security/).",
        "params": "Parametreler", "body": "İstek gövdesi", "fields": "Alanlar", "responses": "Yanıtlar",
        "example": "Örnek", "name": "Ad", "in": "Yer", "type": "Tür", "required": "Zorunlu", "yes": "evet", "no": "hayır",
        "field": "Alan", "description": "Açıklama", "auth_required": "`X-API-Key` gerekir.", "public": "API anahtarı gerekmez.",
        "contents": "Bu gruptaki uç noktalar",
    },
}


def resolve(schema: dict) -> dict:
    while "$ref" in schema:
        schema = SCHEMAS[schema["$ref"].rsplit("/", 1)[-1]]
    return schema


def non_null(schema: dict) -> dict:
    options = [s for s in schema.get("anyOf", []) if s.get("type") != "null"]
    return resolve(options[0]) if options else resolve(schema)


def type_name(schema: dict) -> str:
    if "$ref" in schema:
        return schema["$ref"].rsplit("/", 1)[-1]
    if "anyOf" in schema:
        parts = [type_name(s) for s in schema["anyOf"]]
        return " | ".join(dict.fromkeys(parts))
    kind = schema.get("type", "object")
    if kind == "array":
        return f"array<{type_name(schema.get('items', {}))}>"
    if "enum" in schema:
        return " · ".join(map(str, schema["enum"]))
    return kind


def example(schema: dict, name: str = "", depth: int = 0, required_only: bool = True):
    if "examples" in schema and schema["examples"]:
        return schema["examples"][0]
    if name in NAMED:
        return NAMED[name]
    schema = non_null(schema)
    if "examples" in schema and schema["examples"]:
        return schema["examples"][0]
    if "default" in schema and schema["default"] not in ("", None):
        return schema["default"]
    if "enum" in schema:
        return schema["enum"][0]
    kind = schema.get("type")
    if kind == "object" or "properties" in schema:
        if depth > 2:
            return {}
        props = schema.get("properties", {})
        keys = schema.get("required", []) if required_only and schema.get("required") else list(props)[:6]
        return {key: example(props[key], key, depth + 1, required_only) for key in keys if key in props}
    if kind == "array":
        return [example(schema.get("items", {}), name, depth + 1, required_only)]
    if kind == "integer":
        return int(schema.get("minimum", 1))
    if kind == "number":
        return 0.5
    if kind == "boolean":
        return True
    return "string"


def table(headers: list[str], rows: list[list[str]]) -> str:
    clean = lambda v: str(v).replace("|", "\\|").replace("\n", " ")
    out = ["| " + " | ".join(headers) + " |", "| " + " | ".join("---" for _ in headers) + " |"]
    out += ["| " + " | ".join(clean(v) for v in row) + " |" for row in rows]
    return "\n".join(out)


def short(text: str, limit: int = 140) -> str:
    text = " ".join((text or "").split())
    return text if len(text) <= limit else text[: limit - 1].rstrip() + "…"


def render(lang: str) -> str:
    L = LABELS[lang]
    ops: dict[str, list] = {key: [] for key, _ in GROUPS}
    for path, item in SPEC["paths"].items():
        for method, op in item.items():
            if method not in {"get", "post", "put", "delete", "patch"}:
                continue
            ops[(op.get("tags") or ["-"])[0]].append((path, method.upper(), op))
    lines = [f"## {'Overview' if lang == 'en' else 'Genel bakış'}", "", L["title_note"], "", L["auth"], "",
             f"[{L['download']}](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/reference/openapi.json)", ""]
    for key, names in GROUPS:
        group = ops.get(key) or []
        if not group:
            continue
        lines += [f"## {names[0 if lang == 'en' else 1]}", ""]
        for path, method, op in group:
            lines += [f"### {method} {path}", "", f"**{op.get('summary', '')}** · " + (L["auth_required"] if op.get("security") else L["public"]), ""]
            params = op.get("parameters", [])
            if params:
                lines += [f"**{L['params']}**", "", table([L["name"], L["in"], L["type"], L["required"]], [[f"`{p['name']}`", p["in"], type_name(p.get("schema", {})), L["yes"] if p.get("required") else L["no"]] for p in params]), ""]
            body = op.get("requestBody", {}).get("content", {}).get("application/json", {}).get("schema")
            if body:
                resolved = resolve(body)
                lines += [f"**{L['body']}** · `{type_name(body)}`", "", "```json", json.dumps(example(body), ensure_ascii=False, indent=2), "```", ""]
                props = resolved.get("properties", {})
                if props:
                    required = set(resolved.get("required", []))
                    lines += [table([L["field"], L["type"], L["required"], L["description"]], [[f"`{k}`", type_name(v), L["yes"] if k in required else L["no"], short(v.get("description", ""))] for k, v in props.items()]), ""]
            responses = op.get("responses", {})
            lines += [f"**{L['responses']}**", ""]
            for code, response in responses.items():
                schema = response.get("content", {}).get("application/json", {}).get("schema")
                lines.append(f"- `{code}` {response.get('description', '')}" + (f" · `{type_name(schema)}`" if schema and "$ref" in schema else ""))
            lines.append("")
            ok = next((r for c, r in responses.items() if c.startswith("2")), None)
            schema = ok and ok.get("content", {}).get("application/json", {}).get("schema")
            if schema and "$ref" in schema:
                lines += [f"*{L['example']}*", "", "```json", json.dumps(example(schema, required_only=False), ensure_ascii=False, indent=2), "```", ""]
    return "\n".join(lines).rstrip() + "\n"


def main() -> int:
    for lang in ("en", "tr"):
        target = ROOT / "content/docs/guides" / lang / "endpoints.md"
        target.write_text(render(lang), encoding="utf-8")
        print(f"wrote {target.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
