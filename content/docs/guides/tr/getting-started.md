## Sabitlenmiş sürümü kurun

Geçici bir yerel checkout ve CI matrisinde test edilen Python 3.10–3.13 sürümlerinden birini kullanın. Paket Python >=3.10 beyan eder. Bu komutlar yayımlanmış kaynağı ve ona ait kilit dosyasını seçer.

```bash
git clone --branch v0.8.0 --depth 1 https://github.com/Yasou13/MESA.git
cd MESA
uv sync --locked --extra dev
uv pip check
```

## Başlatmadan önce yetkilendirin

Aşağıdaki profil model veya dış sağlayıcı kullanmaz. Kanonik V4 çıkarımı yerine V3 ham hafıza kabulünü ve sözcüksel retrieval davranışını gösterir. Oluşturulan anahtar yalnızca bu geçici storage root içindir. Paylaşmayın veya loglara kaydetmeyin.

```bash
export MESA_STORAGE_ROOT="$(mktemp -d /tmp/mesa-quickstart-XXXXXX)"
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

Aynı ortam değişkenlerini taşıyan ikinci terminalde sunucuyu yalnızca loopback üzerinde başlatın. Hazır olmasını bekleyip depodaki örneği çalıştırın. Örnek yetkili oturum açar, tarafsız bir metin ekler, processed durumunu bekler ve kapsamlı retrieval sonucunu doğrular. Bu komut gerçek model benchmark’ı değildir. Yalnızca yeni oluşturulan geçici root’u kaldırmadan önce süreci durdurun.

```bash
.venv/bin/python -m uvicorn mesa_memory.api.server:app --host 127.0.0.1 --port 18080
```

```bash
curl --fail http://127.0.0.1:18080/health/init
curl --fail -H "X-API-Key: $MESA_API_KEY" http://127.0.0.1:18080/health
.venv/bin/python -m examples.v3_quickstart
```
