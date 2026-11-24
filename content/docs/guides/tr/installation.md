## Yayımlanmış paketi kurun

CI, Python 3.11–3.13’ü test eder. 0.9.5 wheel’inin kurulumu temiz bir Python 3.14 ortamında da denetlendi; LanceDB 0.41.0 kurulur, çizge veritabanı kurulmaz. Linux/macOS üzerinde doğrudan; Windows üzerinde Docker veya WSL ile çalışır. Rehberlerle aynı sürümü kurun:

```bash
pip install mesa-memory==0.9.5
mesa start
```

CLI; yerel kataloğu, yetkileri, depolamayı ve kimlik bilgilerini hazırlar. Modeller varsayılan olarak kapalıdır; belgeler alınabilir ve BM25 ile aranabilir. İsteğe bağlı `adapters` ve `ml` ekleri seçilen model sağlayıcılarını destekler. Ayrı veritabanı sunucusu gerekmez.

## Sabitlenmiş kaynak kodunu kullanın

Geliştirme için sürümün Git nesnesini ve kilit dosyasını kullanın:

```bash
git clone --branch v0.9.5 --depth 1 https://github.com/Yasou13/MESA.git
cd MESA
uv sync --locked --python 3.11
uv pip check
```

## Yerel Docker çalıştırın

```bash
docker compose -f docker-compose.v4.yml up --build -d
docker compose -f docker-compose.v4.yml exec -T mesa-v4 mesa add - --source file://document.txt < document.txt
docker compose -f docker-compose.v4.yml exec mesa-v4 mesa search "archive"
```

Compose komutlarını sabitlenmiş kaynak klasöründen, kendi `document.txt` dosyanız hazırken çalıştırın. Konteyner `mesa start` çalıştırır, içeride `0.0.0.0` adresine bağlanır ve yalnızca ana makinenin loopback adresinde yayımlanır. Volume, verileri ve `/var/lib/mesa/credentials.json` kimlik dosyasını korur. Her depolama kökünün tek bir combined yazma sahibi vardır. Hazır olma ve yerel başlangıç üretim yeterliliği sağlamaz.

## Paket indeksi ve isteğe bağlı ekler

24 Kasım 2026’da GitHub `v0.9.5` etiketi ve PyPI 0.9.5 yayını doğrulandı. Wheel ve sdist mevcut ve geri çekilmemiştir. Temel kurulum ve yükseltme:

```bash
pip install mesa-memory==0.9.5
pip install --upgrade mesa-memory==0.9.5
```

OpenAI ve Ollama SDK’ları temel pakete dahildir. Anthropic için `[adapters]`; yerel embedding ve BGE yeniden sıralama için `[ml]` gerekir. Seçtiğiniz sağlayıcının gerektirdiği ekleri kurun:

```bash
pip install "mesa-memory[adapters]==0.9.5"
pip install "mesa-memory[ml]==0.9.5"
```

Yayın, Alfa / üretim NO-GO durumunu değiştirmez.
