## Belirli bir sürümü kurun

Deneme için ayrı bir yerel depo kopyası açın. Python 3.10–3.13 sürümleri otomatik testlerde kullanılıyor; paketin alt sınırı Python 3.10’dur. Aşağıdaki komutlar v0.8.1 kaynak kodunu ve o sürüme ait kilit dosyasını kullanır.

```bash
git clone --branch v0.8.1 --depth 1 https://github.com/Yasou13/MESA.git
cd MESA
uv sync --locked --python 3.10
uv pip check
```

## Başlatmadan önce erişim izinlerini verin

Bu kurulum model veya dış sağlayıcı kullanmaz; paketleri, erişim bilgilerini ve sistemin başlatılabildiğini kontrol etmek içindir. V3 ile veri işlemek veya V4’e asıl bilgi kaydı eklemek için sayısal temsil ve bilgi çıkarımı sağlayıcılarını ayrıca hazırlamanız gerekir. Oluşturulan anahtar yalnızca bu geçici veri dizini içindir; paylaşmayın veya günlüklere yazmayın.

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

## Sunucuyu başlatıp durumunu kontrol edin

Sunucu yalnızca yerel bilgisayardan erişilebilecek şekilde açılır. Kontrolleri, aynı ortam değişkenlerinin ve oluşturduğunuz anahtarın bulunduğu ikinci bir terminalde çalıştırın. Model kapalıyken V4’e bilgi ekleme `503 canonical_processing_unavailable` döndürür. V3 işleme de sayısal temsil sağlayıcısı gerektirir. Deneme bittiğinde yalnızca yeni oluşturduğunuz geçici dizini silin ve önce sunucuyu durdurun.

```bash
.venv/bin/python -m uvicorn mesa_memory.api.server:app --host 127.0.0.1 --port 18080
```

```bash
curl --fail http://127.0.0.1:18080/health/init
curl --fail -H "X-API-Key: $MESA_API_KEY" http://127.0.0.1:18080/health
```

## V4 ile ilk kaydı eklemek için

Aşağıdaki özgün kaynakta anlatıldığı gibi yeni bir veri dizini, modelin etkin olduğu combined süreci, bilgi çıkarımı ve sayısal temsil sağlayıcıları, katalog ve erişim izinleri hazırlayın. Sonra `.venv/bin/python -m examples.v4_quickstart` komutunu çalıştırın. Örnek, `COMMITTED` durumunu kontrol eder, bilgi kaydıyla kaynak referanslarını yazdırır ve oturumu kapatır. Zaman aşımı, sunucudaki işlemi iptal etmez. Çalışan API’yi kontrol etmek için `MESA_BASE_URL` ve `MESA_API_KEY` ile `make health` kullanabilirsiniz.
