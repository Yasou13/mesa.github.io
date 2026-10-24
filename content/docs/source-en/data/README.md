# MESA Legal Data

MESA Legal Data is a data platform that automatically collects official legislation, case law and legal citation data, stores raw files immutably, canonicalizes them and passes them through quality gates. Versions that meet safe conditions can be approved automatically; exceptions go to human review. Real delivery to MESA happens only when a person starts it, from an immutable release package that was built and verified automatically. Local staging is only a development tool and is not real MESA.

---

## Layered architecture

```text
Official source (HTTPS / manual PDF)
   ├─ Manual URL / local file (collect)
   └─ Automatic discovery queue (harvest discover → run)
              ↓
Raw data store (raw/ — immutable artifact + SHA-256 + metadata)
              ↓
Parsing & canonicalization pipeline (parse → canonical JSONL)
              ↓
Quality gates + privacy + legal metadata validation
              ↓
Safe automatic approval / human exception review
              ↓
Immutable release (automatic build → verify → frozen summary → human approval)
              ↓
Real MESA publisher (idempotent, only COMMITTED counts as success)
              └─ Local development staging (separate, optional)
```

---

## Data directory layout (workspace)

The system keeps all its data in the directory named by the `MESA_DATA_DATA_ROOT` environment variable (precedence: configured `MESA_DATA_DATA_ROOT` → default `/storage/mesa-legal-data/data` → fallback on a permission error: `~/.mesa-data/data`).


```text
$DATA_ROOT/
  raw/                    # Immutable raw artifact files (PDF, HTML)
  canonical/              # Canonical JSONL records per version
  releases/               # Published release packages (manifest.json + JSONL)
  exports/                # Generated export files
  backups/                # Catalog database backups
  harvest/                # Harvest database (harvest.sqlite) and its backups
  catalog.sqlite          # Main catalog database
```

---

## Automatic data collection (harvest)

MESA Legal Data has a harvest subsystem that discovers document links from defined official sources and manages the download queue. Harvest runs on `harvest.sqlite`, independent of the main catalog.

### Harvest commands
```bash
uv run mesa-data harvest init
uv run mesa-data harvest config-check
uv run mesa-data harvest discover --source resmi_gazete
uv run mesa-data harvest status
uv run mesa-data harvest run --once --limit 25
uv run mesa-data harvest failures
uv run mesa-data harvest maintenance
```

### Security & policy
- Discovery and downloads run only on the official sources allowed in `config/sources.yaml` and `config/harvest.yaml`.
- Downloads pass SSRF, MIME type, size limit (~50 MB) and rate limit checks.
- Only versions from certified sources/parsers that meet PASS quality conditions can be auto-approved safely; the rest go to human review.
- Delivery to MESA never starts automatically.

---

## Web admin panel (FastAPI + HTML/CSS/JS)

MESA Legal Data has a web interface for managing data collection, quality/exception review, immutable releases and human-started real MESA delivery. In the normal flow the panel does not ask the user for a release ID; it prepares the exact release and manifest summary automatically.

### Starting the web panel
```bash
uv run mesa-data web --host 127.0.0.1 --port 8765
```
Open `http://127.0.0.1:8765` in your browser.

### Security & admin token
- By default the web panel is reachable only from the local machine (`127.0.0.1`).
- When the server is exposed to an external network (`0.0.0.0`), the `MESA_DATA_WEB_ADMIN_TOKEN` environment variable is required.

---

## Quick command flow (CLI)

### 1. Install and initialize
```bash
# Bağımlılıkları yükleyin
uv sync --frozen

# Veri dizinlerini ve veritabanı şemasını hazırlayın
uv run mesa-data init
uv run mesa-data migrate
```

### 2. Example usage flow

```bash
# A. Veri Ekleme (Manuel veya URL)
uv run mesa-data collect url \
  --source mevzuat \
  --url https://www.mevzuat.gov.tr/MevzuatMetin/1.5.2709.pdf \
  --document-id tr:legislation:constitution:2709 \
  --title "Türkiye Cumhuriyeti Anayasası"

# B. Pipeline Orkestrasyonu
uv run mesa-data pipeline run --artifact-id sha256:<ARTIFACT_HASH>

# C. İnceleme ve Onay
uv run mesa-data review list --status pending
uv run mesa-data review approve-version <VERSION_ID> --reviewer "operator@example.com"

# D. Release Derleme ve Yayınlama
uv run mesa-data release build --release-id release-v1.0
uv run mesa-data release verify --release-id release-v1.0
uv run mesa-data release publish --release-id release-v1.0

# E. Yalnız geliştirme amaçlı yerel staging importu (gerçek MESA değildir)
uv run mesa-data release import --release-id release-v1.0

# F. İzlenebilirlik Sorgusu
uv run mesa-data provenance <RECORD_ID>
```

Code comments are kept as in the upstream file. In order: install dependencies; prepare data directories and the database schema; A. add data (manual or URL); B. pipeline orchestration; C. review and approval; D. build and publish a release; E. local staging import for development only (not real MESA); F. traceability query.

### 3. Diagnostics and health checks
```bash
# Sistem teşhisi ve bütünlük denetimi
uv run mesa-data doctor

# Raw artifact SHA-256 bütünlük kontrolü
uv run mesa-data audit

# Veritabanı yedeği alma
uv run mesa-data backup
```

The three commands run system diagnostics and an integrity check, verify raw artifact SHA-256 integrity, and take a database backup.

---

## Documentation

- 🚀 **[Quickstart guide](docs/data/quickstart/)** — Setup and first data import in 5 minutes (Turkish).
- 📖 **[User guide](docs/data/user-guide/)** — Detailed operations guide, the harvest subsystem, the interface and the CLI reference (Turkish).
- 📐 **[MESA import contract](docs/data/import-contract/)** — Staging DB transfer rules and the data model contract.
- 🔒 **[MVP closure report](docs/data/mvp-closure/)** — MVP freeze verification and the TLS security architecture.

---

## Limits and V2 scope

The following features were left out of the MVP and deferred to V2:
- Record revision editor (record revision UI)
- Web-based source configuration editor (managed through `config/sources.yaml`)
- Automatic issue closing/waive mechanism (issues are read-only)
- Multi-user OAuth/OIDC authorization
