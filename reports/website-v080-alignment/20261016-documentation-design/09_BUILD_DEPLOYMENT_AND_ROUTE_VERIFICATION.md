# Build, deployment and route verification

Production remains dependency-free static HTML/CSS/JS on GitHub Pages. No SSR, new backend, CMS, service worker or client-side router was introduced. CNAME and the GitHub Pages deployment workflow remain intact. Builds keep the existing path-aware asset, search, locale and 404 behavior.

Executed checks:

- `python3 scripts/build_site.py --output _site --site-url https://mesamemory.dev/` and `python3 scripts/check_site.py _site` — PASS.
- Equivalent full builds/checks for `https://yasou13.github.io/` and `https://yasou13.github.io/mesa.github.io/` — PASS, same 176 public routes and 179 HTML files.
- `python3 scripts/check_public_artifact.py <artifact>` — PASS, 187 text artifacts, no recognized privileged credentials, in all three modes.
- `node --test scripts/tests/*.test.mjs` — PASS, 10 test cases across five test files. Individual suites also execute in the Pages workflow.
- `python3 -m unittest discover -s scripts/tests -p 'test_*.py'` — PASS, seven tests, including expected simulated sync failure/cache retention.
- `node scripts/tests/documentation.test.mjs` — PASS, paired coverage/code and all native-doc anchors/copy targets.
- `node scripts/check_browser_layout.mjs --base-url http://127.0.0.1:8765/ ...` — PASS, 260 observations.
- Same browser harness `--release-checks-only` — PASS, 84 technical-layout samples, native keyboard arithmetic, source deep links and no-JS fallback.
- Same browser harness `--axe-only --axe-source /tmp/mesa-v080-axe/axe.min.js` — PASS, zero automatic violations on all 176 routes; incomplete reviews retained.
- Same harness `--snapshot-only` — PASS, final EN/TR home/docs at 390/1440px.
- `--interactions-only --base-url http://127.0.0.1:8766/mesa.github.io/` — PASS for EN/TR search URLs, keyboard trap/Escape/focus restoration, admin isolation and no-JS navigation under the actual project prefix; evidence in project-path-interactions.json.

Core-related examples were checked in a **disposable archive of the exact release**, using the existing Python 3.10.12 Core environment without modifying it: `uv lock --check --offline` resolved 251 packages; `uv pip check` checked 159 installed packages, all compatible (uv 0.10.8). Admin provisioning + both health endpoints + `python -m examples.v3_quickstart` passed with models/external providers disabled. `python -m pytest tests/test_v4_independent_retrieval_audit.py -q` passed 12 tests in 7.76s, using local SQLite/Kùzu and fixture vectors.

`<Core python> scripts/verify_core_sdk_example.py --source /tmp/mesa-v080-example-source` executed the identical published EN/TR V4 snippet through the released SDK with deterministic HTTP transport. Actual V4 Pydantic request schemas validated session/insert/search, and the rejected-terminal guard raised correctly. This is SDK/request-contract evidence, not a live model-enabled V4 provider run.

No fresh full dependency installation, Docker production cutover, destructive migration/restore, real-provider rehearsal, 24-hour soak, complete E2E certification, remote Pages workflow or deployment was executed. They are not reported PASS. The local hosting compatibility gate is PASS; publication remains unperformed.
