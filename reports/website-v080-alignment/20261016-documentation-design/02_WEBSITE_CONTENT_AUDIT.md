# Content audit and resolution

| Finding before revision | Resolution | Evidence |
|---|---|---|
| Core imports pinned to current main rather than the official source release | Pin imports and Core links to v0.8.0 / 07d387f | sources.json; official-release.json |
| Public maturity still said Release Candidate after source publication | Published source release; retain production NO-GO and certification blockers | site-data.json; home/status/FAQ/footer |
| English pages exposed largely Turkish original bodies, while Turkish pages had only localized navigation | 27 equivalent paired Core guides, localized context for every ecosystem reference, original-language appendices clearly disclosed | guides.json; documentation.test.mjs |
| Security, runbook, provider, graph, provenance and SDK workflow hard to discover | Grouped sidebar, five-step documentation journey, 11 new native guide routes | route-preservation.json |
| No dedicated architecture or retrieval public page | Separate logical flow, physical stores, execution and evidence; exact ranking explanation | /architecture/ and /retrieval/ in EN/TR |
| Home fixture precedes how-it-works; weak developer entry point | Seven-section narrative, Docs/GitHub actions, pinned install snippet | home screenshots and section-order checks |
| RRF formula insufficiently explained for non-source readers | Opt-in lane arithmetic with keyboard input, explicit illustrative label and no API calls | release-browser-checks.json |
| Storage views can be confused with retrieval lanes | Three stores and four retrieval lanes explained separately | architecture and Core guide |
| Law technical role could imply enabled drafting | Explicit research/draft/rebuild disabled state, dated 0.7.1 evidence and unverified live 0.8.0 integration | ecosystem maturity table; source notes |
| Logo/TTF transfer dominates loading | Retain approved originals, serve small logo and Latin/Turkish WOFF2 derivatives | asset-optimization.json |
| Low contrast and semantic/keyboard defects survived layout-only checks | Fix footer/status surfaces, table cells, figure semantics, labeled groups and focusable scroll regions | full-route axe results |

Every existing public page was included in route, metadata, link and browser checks. Existing accurate Learn, methodology, Data, QA and E2E explanations were retained. Research protocols remain explicitly without results; no benchmark or certification PASS was invented. Historical audit bodies remain original source evidence, not rewritten product explanations.
