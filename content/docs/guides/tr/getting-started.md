## Sabitlenmiş sürümü kurun

Geçici bir yerel checkout ve CI matrisinde test edilen Python 3.10–3.13 sürümlerinden birini kullanın. Paket Python >=3.10 beyan eder. Bu komutlar yayımlanmış kaynağı ve ona ait kilit dosyasını seçer.

```bash
git clone --branch v0.8.1 --depth 1 https://github.com/Yasou13/MESA.git
cd MESA
uv sync --locked --python 3.10
uv pip check
```

## Başlatmadan önce yetkilendirin

Aşağıdaki profil model veya dış sağlayıcı kullanmaz. Kurulum, credential ve readiness kontrolü yapar. V3 veri alımını veya kanonik V4 eklemeyi tamamlayamaz; embedding ve kanonik çıkarım ayrı hazırlanmalıdır. Oluşturulan anahtar yalnızca bu geçici storage root içindir. Paylaşmayın veya loglara kaydetmeyin.

```bash
mkdir -p "$HOME/mesa-doc-demos"
export MESA_STORAGE_ROOT="$(mktemp -d "$HOME/mesa-doc-demos/run-XXXXXX")"
export MESA_RUNTIME_PROFILE=combined
export MESA_LOAD_DOTENV=false
export MESA_MODEL_ENABLED=false
export MESA_EXTERNAL_PROVIDER_ENABLED=false
export MESA_TIER3_MODE=0
export MESA_PRINCIPAL_ID=docs-principal
export MESA_PORT=18080
export MESA_API_KEY="$(.venv/bin/mesa-v4-admin issue-key --principal docs-principal)"
.venv/bin/mesa-v4-admin grant-role --principal docs-principal --tenant docs-tenant --role OWNER
.venv/bin/mesa-v4-admin grant-agent --principal docs-principal --agent docs-agent --permission SESSION_CREATE
```

## Çalıştırın ve doğrulayın

Hazırlıktan sonra loopback sunucusunu başlatın. Sağlık kontrolleri için aynı export ayarlarını ve özel sağlanan anahtarı taşıyan ikinci terminali kullanın. Model kapalı V4 ekleme `503 canonical_processing_unavailable` döndürür; V3 işleme de embedding gerektirir. Yalnızca yeni oluşturulan geçici root’u kaldırmadan önce süreci durdurun.

```bash
.venv/bin/python -m uvicorn mesa_memory.api.server:app --host 127.0.0.1 --port 18080
```

```bash
curl --fail http://127.0.0.1:18080/health/init
curl --fail -H "X-API-Key: $MESA_API_KEY" http://127.0.0.1:18080/health
```

## Kaynağa bağlı ilk V4 ekleme

Yeni bir root üzerinde aşağıdaki kaynakta açıklanan modeli etkin combined runtime, çıkarım ve embedding sağlayıcıları, katalog ve ACL’leri hazırlayın. Ardından `.venv/bin/python -m examples.v4_quickstart` çalıştırın. Örnek `COMMITTED` kontrolü yapar, assertion/kaynak referanslarını yazdırır ve oturumu bitirir. Timeout mutasyonu iptal etmez. `make health`, `MESA_BASE_URL` ve `MESA_API_KEY` ile çalışan API’yi kontrol eder.
