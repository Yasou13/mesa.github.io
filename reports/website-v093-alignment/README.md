# MESA v0.9.3 website alignment — 17 November 2026

Website baseline: `22d98daa531c0291bffeba8b505a472c31ee2bcd`. Branch retained: `codex/website-v0.9.2`.
Core tag: `v0.9.3`; commit: `531209bc45805b478264f6dfa8a9e40a94e345cb`.

## Publication preconditions

Public PyPI version JSON confirmed both `mesa_memory-0.9.3-py3-none-any.whl` and `mesa_memory-0.9.3.tar.gz`, neither yanked. Upload times are 2026-11-17 03:27:19/21 UTC. The GitHub tag API resolves annotated tag object `2b602a6c44776c36ca1fabc07b65654507416ab1` to the commit above, matching the local tag. These were live metadata checks on 17 November (Europe/Istanbul); see [release-verification.json](release-verification.json). No artifact download/byte parity, signature preflight, build attestation or live release-CI audit is claimed.

## Changes and source scope

- Updated active version/status date, install/upgrade/extras commands, source links and English/Turkish metadata.
- Read all 23 Core imports through the existing `sync_docs.py` implementation's `sync_repository` using immutable Git objects; retained independent caches without a network resync. Pinned the exact tagged OpenAPI bytes and ran `build_endpoint_reference.py`.
- Maintained EN/TR guides and translated appendices cover BGE-M3 / 1024 normalized defaults, models off, explicit Magibu/768 preservation or rebuild, fresh-store MCP setup, Turkish uppercase fixes, startup failures and CI-before-publish behavior.
- Added paired release notes and limits. Changelog performance is 718.27 → 245.20 s (2.93×); the separate Opus confirmation is 239.35 s (3.00×) on `dbf113b`. Parser evidence is 129.861 → 52.330 ms (2.48×), best-of-five thread CPU, unchanged outputs/spans. These are attributed measurements from Core CHANGELOG/PROGRESS, not new website measurements.
- Documented unenforced per-minute/daily limits, ASCII `yargitay` mismatch and sensitive Kùzu page-tail memory fragments. Removed the old parser timing warning from current limits. Historical release notes retain it and the 11.6 s 0.9.2 search measurement; that measurement is absent from the 0.9.3 known-issues section.
- Corrected only two localized T1m labels (MiniLM → Magibu). D51, Round 18 PROGRESS and the actual `mesa_bench/runs/20261107T141454Z_v092_benchmark/settings-T1m-ingest.json` confirm `local:magibu/embeddingmagibu-200m`, 768 dimensions. Benchmark values, versions and research data are unchanged.
- Synchronized existing article Markdown/hub/seed exports using the existing script. No live database or CMS operation was performed.

## Validation

| Check | Result |
| --- | --- |
| Production-domain build, `build_site.py` | PASS, `https://mesamemory.dev/`, output `/tmp/mesa-v093-site` |
| GitHub Pages project-path build | PASS, `https://yasou13.github.io/mesa.github.io/`, output `/tmp/mesa-v093-project-site` |
| `check_site.py`, both builds | PASS, 228 localized routes, 271 HTML files, 23,067 internal / 2,517 external references |
| `check_public_artifact.py`, both builds | PASS, 297 text artifacts each |
| Existing package test commands | PASS, 18 Python / 28 Node tests; executed the commands declared by `npm test` directly because npm is absent |
| Chrome all-page sweep | PASS, 908 layouts at 320/390/768/1440 px, EN/TR public routes, admin shells, 404 and shared interactions |
| Chrome first-use regression | PASS, 50 localized viewport checks, accessibility, clipboard, keyboard, reduced motion and no-JavaScript |
| Final security-paragraph follow-up | PASS, eight EN/TR layouts using the existing browser harness after the full sweep |
| Paired SDK example verifier | PASS against an exported `git archive v0.9.3`, using the existing Core Python environment and fixture HTTP |
| OpenAPI | Exact tag bytes; paths/components identical to 0.9.2, version metadata 0.9.3 |
| Article tri-source synchronization | PASS |
| History / preservation audit | PASS, demo bytes, four independent imports, benchmark metrics/research and all 295 original local files preserved |
| Current 0.9.2 text audit | No current install, version or source pin remains; retained matches are historical records, release notes, prior OpenAPI and benchmark data/tests |

Compact browser and source evidence is retained alongside this report. Screenshots/full observations and build artifacts remain under `/tmp/mesa-v093-*`. Static external-link checks validate structure; they do not audit every third-party URL over the network. Deliberate sync-failure messages in unit tests are fixtures. No new tools or dependencies were added; the bundled Node runtime supplied the missing PATH entry.

The final README/CLAIMS record commit runs build/static/secret checks again. Earlier implementation commits each passed build/static/secret checks before committing; the full suite and relevant focused checks also passed.

## Preserved work and limits

Existing generated `dist/` files and untracked `.mcp.json`, `review/`, account/legal output directories were left untouched; SHA256 checks cover the original 295 local files. Generated HTML/search/sitemap for this refresh lives in temporary artifacts because the owner required preserving those changes. A build from updated sources produces the refreshed site without regenerating committed `dist/` in place.

No new 0.9.3 retrieval benchmark, provider/model evaluation, production qualification or deployment was run. Alpha / production NO-GO and dated independent evidence remain. No push, PR, tag mutation or force operation was performed.
