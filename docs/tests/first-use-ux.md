# First-use UX verification — 29 October 2026

- Core baseline: v0.9.0 / 7062fafe2cff8442eb84d1da60df164099526c8e.
- Real EN/TR archive-text ingestion, COMMITTED states, source-linked search,
  and replacement revision were recorded with models, graph and external
  providers disabled. Raw public evidence: `content/examples/first-search.json`.
- `npm test`: 18 Python tests and 28 Node tests passed.
- `npm run verify:admin`, static site checks, public-artifact credential scan,
  syntax checks and `git diff --check` passed.
- Focused Chrome checks: EN/TR home, docs hub, quickstart and CLI at 320, 390,
  768, 1280 and 1920 px (40 combinations), with no document overflow.
- 16 axe scans at 390/1280 px returned zero WCAG A/AA violations. This is
  automated evidence, not a complete accessibility certification.
- Demo keyboard activation, endpoint focus, command clipboard contents,
  mobile menus, reduced motion and all four no-JavaScript steps passed.
- Body copy is at least 16 px in the tested content; auxiliary text/code is
  at least 14 px. The quickstart hides its right rail and technical metadata
  moves to the source disclosure.
- Native Linux runtime was executed. macOS, WSL and Docker installation
  instructions were checked against the pinned source/Compose configuration;
  those separate operating-system installations were not executed here.

Reproduction commands and the isolated capture procedure are in the README.
Local browser reports and screenshots were retained in
`/tmp/mesa-first-use-browser/` for this session.

## Standalone Get started follow-up

- Public navigation now opens `/get-started/` or `/tr/get-started/` with
  Get started/Başlayın selected and no documentation sidebar or tabs.
  The existing technical quickstart URLs remain available.
- Both screens render the same guide source to keep commands in sync.
- The full test suite, admin bundle check, route/link verification and
  public-artifact scan passed again.
- EN/TR home, standalone setup, docs hub, technical quickstart and CLI passed
  50 viewport checks; 20 axe scans returned zero WCAG A/AA violations.
  Clipboard, keyboard, mobile navigation, reduced motion and no-JavaScript
  checks also passed. Reports: `/tmp/mesa-standalone-browser/`.
