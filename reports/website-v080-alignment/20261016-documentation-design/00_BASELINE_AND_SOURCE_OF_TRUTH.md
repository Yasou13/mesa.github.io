# Baseline and source of truth · 16 October 2026

Website baseline: `670ed7a8ac55ef1b1e6df5638519510d15c2204e`. Work branch: `revise/v080-documentation-design`. The only pre-existing working change was 42 manifest timestamp values; it is preserved separately from committed revision work.

Core baseline: **published v0.8.0**, commit **`07d387f9a4592ea39518fea549e9cf8330051e1f`**. Annotated tag object: `e2c28ea42ab772d62f7e93537902050bfef12837`. [Official release](https://github.com/Yasou13/MESA/releases/tag/v0.8.0) published **2026-10-15T18:21:44Z**, draft=false, prerelease=false. Core main was `e3750a7c44c26d7e3555be755e8c07fd5282ca64`; its difference from the release is README badges. The handbook uses the release commit, not moving main. Package version is 0.8.0. Publication does not change the production qualification **NO-GO**.

Evidence priority: release metadata and immutable package metadata → maintained documentation index → API/runtime implementation and released tests → dated audit evidence. Historical ARCHITECTURE/ADRs/audits are not promoted to current product contracts.

Architecture discovered before edits: plain Python/Node static generation; no frontend framework or SSR. `scripts/build_site.py` copies authoritative `dist/` assets into disposable output, removes copied HTML and runs `scripts/render_site.mjs`. JSON product/hub content, paired locale metadata, Markdown imports, CSS and a small vanilla-JS enhancement layer. `dist/` must never be cleaned as a disposable build directory. `_site/` is disposable. GitHub Actions builds and uploads static Pages artifacts; `dist/CNAME` remains `mesamemory.dev`.

Core source was read from a temporary Git checkout and its exact tag objects. Relevant Data/Law/QA/E2E source files were read at pinned commits, and public GitHub metadata was inspected. Law uses **master**, while the other repositories use main. Repository SHAs and CI scope are in `evidence/ecosystem-remote.json`; source import SHAs are in `content/docs/sources.json`. No upstream source, tag, release or historical report was edited.

Discovery, source verification and gap analysis preceded implementation. This report directory is new; all 60 historical report/evidence files retain their baseline SHA-256 values. No production deployment or Git push was performed.
