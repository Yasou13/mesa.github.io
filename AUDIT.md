# MESA ecosystem website audit

Audit date: 2026-09-30

## Starting point

The repository contained a seven-route Cognee reference-site reconstruction:

- `/`
- `/product/`
- `/cloud/`
- `/enterprise/`
- `/company/`
- `/docs/`
- `/docs/mcp-overview/`

The deployment source was `dist/`. The Git remote was an internal
`git.chatgpt-team.site` URL, not GitHub, and was left unchanged.

## Blockers found

- Cognee branding, product copy, legal/company details, testimonials, customer
  names, metrics, comparison copy, and unsupported commercial claims filled all
  routes.
- `team-collage.png` contained another company's people and mark.
- `docs-diagram.png` was a Cognee architecture graphic.
- Pricing, login, signup, book-a-call, newsletter, replay, docs search, docs
  questions, social icons, sidebar entries, and "Learn more" controls were dead
  or misleading.
- Every CTA helper targeted `#get-started` regardless of intent.
- Several anchors had no `href`; one login used `href="#"`.
- `/cloud/` and `/enterprise/` claimed products and deployment guarantees that
  do not exist in the MESA repositories.
- All local URLs were root-relative and would break when deployed as a GitHub
  project site.
- Important pages had weak or missing descriptions and no Open Graph/Twitter
  metadata. There was no 404 page, sitemap, robots file, Pages workflow, or
  link checker.
- Mobile docs navigation disappeared completely below 900 px.

## Verified source-of-truth conclusions

Research used current public source, tests, configs, and documentation from:

- `Yasou13/MESA` at `14d0520` (2026-09-27)
- `Yasou13/MESA_Data` at `6b24931` (2026-09-22)
- `Yasou13/MESA_QA` at `4f6c7ec` (2026-08-18)
- `Yasou13/MESA_E2E_Certification` at `4ec51e0` (2026-09-29)
- `Yasou13/MESA_Law` at `e71f785` (2026-09-28)

The resulting public-content boundaries are:

- MESA v0.7.1 is a v4 full-cognitive release candidate. Production remains
  `NO-GO` pending Final MVP Certification.
- V4 uses a principal → tenant → workspace → dataset → agent → server-created
  session boundary, canonical provenance, selectable validation, ordered
  SQL/vector/graph projection, and dataset-filtered vector/BM25/assertion
  retrieval. Kuzu neighbour traversal is not advertised as a retrieval
  capability.
- The built-in direct MCP server is stdio. Current source also documents a
  separately supervised HTTP gateway/stdio bridge for newer V4 operations.
- MESA Data is specifically a Turkish legal-data platform, not a generic data
  ingestion product. Its configured sources are Resmi Gazete, Mevzuat Bilgi
  Sistemi, Anayasa Mahkemesi, and a disabled Yargitay source.
- MESA QA is an external, detachable endurance/correctness system. Repairs are
  restricted to an isolated candidate worktree; automatic merge and push are
  forbidden.
- Profile B concerns the legal MESA Data → MESA path only. The historical run
  is now a qualification/regression artifact, not valid current Profile B v2
  certification. The hardened path currently reports all mandatory gates
  unverified because authoritative producers are not registered.
- MESA Law is a legal matter/document workflow application with a tested
  Law-side MESA V4 HTTP contract. Its own final report says Law-side gates pass
  while live Core/full-stack integration remains `NO-GO`.

## Rebuild decision

The Cognee SaaS information architecture will be replaced by a static MESA
technical landing page and ecosystem/docs gateway. Commercial cloud,
enterprise, pricing, login, company, testimonial, and newsletter concepts will
not be carried forward.
