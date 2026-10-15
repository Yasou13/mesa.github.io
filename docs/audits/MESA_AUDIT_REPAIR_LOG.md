# MESA Audit Repair Log

Tarih: 2026-10-15. Dal: `audit/website-independent-20261015`. Baseline `4e4a3a17947637b32b839f4b9d7a367eeafb109a`. Önce kod/build/browser/source kanıtı toplandı, sonra [initial defect register](INITIAL_DEFECTS.md) oluşturuldu ve ayrı yerel commitlerle onarıldı. Push, merge, üretim deploy veya üretim DB migration yapılmadı.

## Gerçek onarım commitleri

| Commit | Değişiklik | Dosyalar |
|---|---|---|
| `9b26aabc0fb676fae7868985b66de02798fad233` | fix(security): disable unimplemented CMS and restrict publication writes | `docs/admin/CMS_USER_GUIDE.md`, `docs/admin/DEPLOYMENT_SETUP.md`, `docs/architecture/CONTENT_PLATFORM.md`, `docs/architecture/PUBLISHING_PIPELINE.md`, `docs/security/CMS_SECURITY.md`, `scripts/check_site.py`, `scripts/render_admin.mjs`, `scripts/render_site.mjs`; diğerleri inventory içinde; 2 dist dosyası |
| `a6205f500162265a921efd324b5a89923d3d5912` | fix(build): guard source paths and sanitize Markdown output | `scripts/build_site.py`, `scripts/markdown_engine.mjs`, `scripts/render_site.mjs`, `scripts/tests/markdown.test.mjs`, `scripts/tests/test_build.py` |
| `8d4bbce382ad40d66e648df867435c5d9b61a67e` | fix(content): pin real upstream docs and reconcile current ecosystem claims | `.github/workflows/pages.yml`, `content/docs/manifest.json`, `content/docs/sources.json`, `content/tr.json`, `scripts/render_site.mjs`, `scripts/sync_docs.py`, `scripts/tests/claims.test.mjs`, `scripts/tests/test_build.py`; diğerleri inventory içinde |
| `2cb11bb60f839e9556cfb0bdfc7cdfa32095a6e2` | fix(ui): repair responsive docs and base-aware keyboard search | `scripts/check_browser_layout.mjs`, `scripts/check_site.py`, `scripts/render_docs.mjs`; 2 dist dosyası |
| `4cf13d5e67ba72170459f1e67c191d98a463e6b1` | test(audit): verify CMS authorization and public artifact boundaries | `.github/workflows/pages.yml`, `scripts/check_browser_layout.mjs`, `scripts/check_cms_authorization.py`, `scripts/check_public_artifact.py`, `scripts/tests/cms_authorization.sql`, `scripts/tests/cms_fixture.sql`, `scripts/tests/test_secrets.py`; 1 dist dosyası |
| `7155368431165ca5e736a6f4ba317a7e03e3f614` | build(site): refresh verified bilingual static pages and native docs | ; 153 dist dosyası |
| `4337d223801cd3385f814b17b3500802dd0c662e` | fix(search): normalize Turkish dotted and dotless letters | `scripts/tests/search.test.mjs`; 1 dist dosyası |
| `c2c4045997dbaba32632ba91a7b091ce03854742` | build(site): finalize search assets and browser regression coverage | `scripts/check_browser_layout.mjs`; 151 dist dosyası |

Her commitin **eksiksiz değiştirilmiş dosya listesi** [repair-commits.json](evidence/repair-commits.json) içindedir. Generated HTML commitlerinin büyük satır sayısı şablonlardan yeniden üretimdir; authoritative font/logo/WebP dosyaları değiştirilmedi. Audit raporlarının kendi commit SHA'sı bu dosyada kendine referansla hesaplanamaz; son commit terminal/git log ve teslim mesajında bulunur.

## Kusur disposition / risk / validation

| ID | Seviye | Onarım ve risk | Doğrulama / kalan sınır |
|---|---|---|---|
| SEC-01 | P0 | Browser role writes draft/ready ile sınırlı; published satır düzenlenemez, direct delete/job insert kapalı. Bu backend completion değildir. | Gerçek PG baseline bypass ve onarım sonrası anon/editor/admin testleri PASS; migration yalnız yerelde |
| CMS-01 | P1 | Sahte admin/publish ve uydurma article body kaldırıldı; fail-closed rota. Önceki localStorage verisine dokunulmadı. | EN/TR admin JS/form yok, noindex; gerçek CMS NOT_IMPLEMENTED |
| BUILD-01 | P0 | Source/root overlap reddi, artifact stale HTML purge; yanlış klasör silme ve withdrawn HTML sızıntısı önlendi. dist kaynağı temizlenmez. | Temp fixture source ancestor, source unchanged, existing article draft→HTML/search/sitemap yok test PASS |
| MD-01 | P2 | URL token/escape sırası, allowlist, Unicode/dedup IDs, literal code/checklist/open fence | 3 adversarial renderer testi + site links/IDs PASS; tam CommonMark/TeX/citation engine yok |
| SYNC-01 | P1 | Pinned raw GitHub retrieval, committed-byte local provider, required allowlist, atomic replacement/nonzero failure | Gerçek network 5 repo PASS; fixture failure cache byte eşitliği ve dirty/untracked exclusion PASS |
| VERSION-01 | P2 | Paketten türetilen etiketler; E2E producers mevcut/dış bloklar; Law dated report/current CI ayrımı; QA candidate FAIL ve first-write hatası | 50 claim grup, 69 Git blob link, Core 12/E2E 567 test; canlı birleşik sistem doğrulanmadı |
| DOCS-01 | P2 | Min-content grid, prev/next mobil reflow, details sidebar, source-language ve tarihsel rapor notları | 76 native route + EN/TR browser PASS; tam içerik çevirisi açık |
| UI-01 | P2 | Header 801 px taşması ve breadcrumb overlay düzeltildi | 234 browser gözlemi / altı hedef genişlik ve sınırlar PASS; font kaynaklı bazı CLS hedefleri açık |
| SEARCH-01 | P2 | Asset URL tabanlı project prefix, async index sonrası query retry, focus trap/restore, Escape menü çakışması, kapalı dialog hidden | Root/project EN/TR browser PASS; TR dotted/dotless unit + gerçek lowercase içe query PASS |
| LEARN-01 | P2 kalan | Otorite hub JSON açıkça belgelendi; disconnected Markdown migration gerçekmiş gibi sunulmuyor | Existing 15 yayın/EN-TR preserved; Markdown article provider hâlâ eksik |
| PERF-ASSETS | P2 kalan | Varlıklar kalite düşürülmeden korundu | 535 KB logo ve font bütçeleri / bazı doc CLS açık; Lighthouse/field INP NOT RUN |

## Test kayıtları

- [Baseline](evidence/baseline.json): build/statik PASS'in CMS doğrulaması olmadığı, browser FAIL kanıtı.
- [Son site check](evidence/site-check.log), [browser](evidence/browser.log), [project interactions](evidence/browser-interactions-project.log).
- [Python 7 regresyon](evidence/python-tests.log); Node [admin](evidence/admin-tests.log), [Markdown](evidence/markdown-tests.log), [claims](evidence/claims-tests.log), [TR search](evidence/search-tests.log).
- [SQL authorization](evidence/sql-authorization.log), [public secret scan](evidence/secret-scan.log).
- [Core 12 test](evidence/core-tests.log); [E2E ilk tam run 565 PASS/2 Git index hatası](evidence/e2e-first-full-tests.log), [final 567 PASS](evidence/e2e-final-full-tests.log). Hata kayıtları saklandı.
- [Network sync](evidence/sync-network.log), [deterministic 183-file artifact](evidence/reproducibility.json), [148/148 route preservation](evidence/route-preservation.json).
- İlk SQL runner denemesi container'ın geçici initialization server'ına erken bağlandı ve exit 2 döndü. PID-1 PostgreSQL + readiness beklemesi düzeltilip tekrarlandı; final kayıt PASS. Bu environment/test harness hatası gizlenmedi.

## Tekrar üretme

```bash
python3 scripts/build_site.py --site-url https://mesamemory.dev/
python3 scripts/check_site.py _site
python3 scripts/check_public_artifact.py _site
python3 -m unittest discover -s scripts/tests -p 'test_*.py' -v
for test in scripts/tests/*.test.mjs; do node "$test"; done
# Docker çalıştırma izni ve test image gerektirir; hiçbir production URL kabul etmez:
python3 scripts/check_cms_authorization.py
# Yalnız reviewed commitler: network gerekir; mevcut kullanıcı manifest'ini korumak için temp output:
python3 scripts/sync_docs.py --manifest /tmp/mesa-docs-audit/manifest.json
```

Browser QA için yerel HTTP server başlatılıp `node scripts/check_browser_layout.mjs --base-url http://127.0.0.1:PORT/ --screenshots /tmp/mesa-browser-audit` kullanılır. Son doğrulamada açılan üç audit server'ı iş sonunda kapatılır; test container'ları her koşulda silinir.

## Kullanıcı değişikliklerinin korunması

Orijinal `content/docs/manifest.json` alan farkları baseline'a göre hesaplandı ve güncel kaynak/ek sayfalar korunarak tekrar **unstaged kullanıcı değişikliği** olarak uygulandı. Alan listesi [preservation proof](evidence/user-change-preservation.json). Bu zaman değişiklikleri temiz çalışma ağacı elde etmek için silinmedi. Güncel kaynak commitleri/versiyonları ve iki yeni E2E belge kaydı korunur.

## Kalan yayın engelleri

Gerçek Auth/Storage/backend/immutable revision/export/dispatcher/deployment callback yok. CMS acceptance **NO-GO**. Local artifact deploy'a hazır bir onarım adayını gösterir; remote website CI, tam servis entegrasyonu, performans yeterliliği ve üretim yayın doğrulaması yapılmadı. Ayrıntılı 12 kabul yanıtı full audit raporundadır.
