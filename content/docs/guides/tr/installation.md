## Yayımlanmış paketi kurun

Test matrisi Python 3.11–3.13’tür. Linux/macOS üzerinde doğrudan; Windows üzerinde Docker veya WSL ile çalışır. Rehberlerle aynı sürümü kurun:

```bash
pip install "mesa-memory[adapters]==0.9.0"
mesa start
```

CLI; yerel kataloğu, yetkileri, depolamayı ve kimlik bilgilerini hazırlar. Modeller varsayılan olarak kapalıdır; belgeler alınabilir ve BM25 ile aranabilir. İsteğe bağlı `adapters` ve `ml` ekleri seçilen model sağlayıcılarını destekler. Ayrı veritabanı sunucusu gerekmez.

## Sabitlenmiş kaynak kodunu kullanın

Geliştirme için sürümün Git nesnesini ve kilit dosyasını kullanın:

```bash
git clone --branch v0.9.0 --depth 1 https://github.com/Yasou13/MESA.git
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
