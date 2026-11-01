# MESA v0.9.1 / Round 13–14 — full re-audit

Completed on 1 November 2026. Findings were corrected in the local source, regenerated `dist/` and rebuilt `_site/`. Final checks have no known failures. No Git push, GitHub Pages deployment, Core release action or database update was performed.

## Findings and corrections

| Finding | Correction |
| --- | --- |
| PyPI initially returned 404, then publication completed during the re-audit. Active commands still used the GitHub wheel. | Reverified PyPI 200, wheel/sdist and non-yanked status. All primary install/copy commands now use `pip install mesa-memory==0.9.1`; upgrades use `pip install --upgrade mesa-memory==0.9.1`. EN/TR status, guides and README are consistent. |
| Long source paths overflowed five QA/E2E page pairs at 320/390px. | Source metadata wraps without widening the document. |
| Mobile DEV tables fitted the viewport by splitting header words into individual letters. | Tables preserve word boundaries, have readable minimum column widths and scroll horizontally inside keyboard-focusable, named regions. |
| Handwritten Core guide content was missing from site search. New settings such as `MESA_RERANK_ENABLED` were not searchable. | Indexes now include maintained EN/TR guide content. Real browser searches for reranking, chunking and scope-cache settings find the correct guides. |
| Deferred demo initialization caused a desktop load-time layout shift of about 0.207–0.220. | First paint reserves the enhanced demo controls and first-step layout. EN/TR home CLS was 0 in final snapshot and all-page checks. No-JavaScript still exposes all four steps. |
| `verify_core_sdk_example.py` expected an earlier quickstart and failed because it never created `receipt.json`. | The verifier uses temporary credentials/receipt data and executes both paired SDK examples plus the current quickstart completion script. It checks ACTIVE waiting, source deletion, RETRY_PENDING and terminal error details. |
| The architecture table generalized 2-second mutation polling to all SDK waits. | Labels now distinguish mutation polling (2 seconds) from revision activation polling (1 second). |
| The full browser checker classified standalone Get started as a docs workspace with a hidden background. | Corrected that classification to match the established standalone stylesheet. The overflow and CLS thresholds were preserved; CLS failure sources are now retained. |

## Verified release and package

- [GitHub release](https://github.com/Yasou13/MESA/releases/tag/v0.9.1): commit `e2f984d4ad97c01782a347e29e44808e5a16dad3`; local tag dereference matches.
- [PyPI package](https://pypi.org/project/mesa-memory/0.9.1/): JSON endpoint 200, Python >=3.11, wheel/sdist present and not yanked. Wheel upload: 16:25 UTC / 19:25 Istanbul on 1 November 2026.
- PyPI wheel SHA256: `84aa8f285496319a8b1392cddfac43d7d088a05e567b82317fb5e07ca2901a83`. All 149 Python source files match the pinned tag. OpenAI/Ollama are base dependencies; Anthropic requires `[adapters]`, local ML/reranking `[ml]`.
- Tagged `Mesa.add` still defaults to `wait=False`; examples use explicit `wait=True` when ACTIVE is needed. CLI waits by default. The initial checklist's contrary SDK-default claim was corrected against code.
- Core source cache and all source pins match a fresh sync. OpenAPI bytes match the tagged snapshot; SHA256 `c3368af2424c8a94ea76431f4a340302beadab9d21628251743fd91dadefba3c`.
- Historical `content/examples/first-search.json` remains byte-for-byte unchanged at v0.9.0 and is visibly labelled as such.

## Final validation

| Check | Result |
| --- | --- |
| Existing test suite | PASS — 18 Python + 28 Node tests |
| All-page Chrome sweep | PASS — 820 layouts at 320/390/768/1440px; 202 localized routes, two admin shells and 404; shared interactions; no document overflow or broken images |
| First-use Chrome regression | PASS — 50 localized viewport checks at five widths; axe accessibility, clipboard, keyboard, reduced motion and no-JavaScript |
| Localized setting search | PASS — 6 real EN/TR searches |
| Released SDK fixture verification | PASS — paired snippets, real V4 request schemas, success/failure guards, ACTIVE/no-wait/source-delete/retry behavior |
| Real released-wheel runtime smoke | PASS — 8 checks: EN/TR ingestion, immediate search after default wait, revision replacement, source delete, SDK explicit wait and CLI no-wait with later completion |
| Production-domain and project-path builds | PASS — each has 202 localized routes / 245 HTML files / 15,905 internal references / 2,045 external references structurally checked |
| Core source links | PASS — 51 immutable file/anchor targets checked against the tagged Git tree |
| Source synchronization and syntax | PASS — source cache, OpenAPI, historical demo, article Markdown/hub/SQL consistency, JavaScript syntax and `git diff --check` |

Deliberate sync-failure log messages in the Python suite are test fixtures, not failed tests. External-reference counts indicate structural validation; they do not claim all third-party URLs were checked over the network.

## Evidence and outputs

- `all-pages-browser.json`: compact observations and final empty failure list.
- `first-use-browser.json`, `accessibility.json`, `localized-search.json`: retained interaction evidence.
- `pypi-publication.json`, `core-source-links.json`, `released-wheel-runtime.json`: package/source/runtime evidence.
- `layout-shift-check.json`: final focused cold-cache CLS observations.
- `source-metadata-320.png`, `dev-benchmark-320.png`: visual checks of repaired mobile layouts.
- `dist/` and `_site/`: final generated local outputs.

## Verification limits

The live origin still returns HTTP 403, so its current deployed version is unverified. No deployment was performed. The real wheel smoke used existing Core dependencies on Linux with a temporary storage root, models/graph disabled and loopback HTTP; it was not a clean dependency installation, Docker/Windows/macOS check, real-model benchmark or production certification. Alpha / production NO-GO and independent certification blockers remain unchanged.
