## v0.9.0 sürümünü kurun

Python 3.11–3.13 kullanın. Linux ve macOS üzerinde doğrudan; Windows üzerinde Docker veya WSL ile çalıştırın.

```bash
pip install "mesa-memory[adapters]==0.9.0"
mesa start
```

`mesa start`, `http://127.0.0.1:8000` adresinde yerel sunucuyu başlatır, `~/.mesa/data` altında depolamayı hazırlar ve özel kimlik bilgilerini `~/.mesa/credentials.json` dosyasına yazar. Bu terminali açık bırakın. Modeller ve dış sağlayıcılar varsayılan olarak kapalıdır; BM25 sözcük araması model olmadan çalışır.

## Bir belge ekleyip arayın

İkinci bir terminalde UTF-8 metin dosyasını ekleyip arayın. Sunucu belgenin tamamını belirli kurallarla parçalara ayırır ve sürümünü izler. Komutlar yerel kimlik bilgilerini kendiliğinden kullanır.

```bash
printf '%s\n' 'The archive opens at nine on weekdays.' > document.txt
mesa add document.txt --source file://document.txt
mesa search "archive"
mesa status
```

`Mesa.add()` ve `mesa add`, işin kabul edildiğini gösteren bir alındı döndürür. Yeni belgenin aranabilmesi için arka plandaki işlemenin bitmesi gerekir; HTTP 202 tek başına tamamlanma değildir. Gerektiğinde alındıdaki mutasyonları [durum API’siyle](docs/core/api-reference/) inceleyin.

## Python kullanın veya MCP istemcisi bağlayın

Yerel sunucu başladıktan sonra `Mesa()` kimlik bilgilerini otomatik okur. Açıkça verilen parametreler ve `MESA_API_KEY` / `MESA_BASE_URL`, bağlantıyı değiştirebilir. Bağlam, uygulamanızın dil modeli için kanıt içerir; son yanıtı MESA üretmez.

```python
from mesa_client import Mesa

with Mesa() as mesa:
    print(mesa.search("archive"))
    print(mesa.context("When does the archive open?"))
```

```bash
mesa mcp-config
```

MCP yapılandırması yerel API anahtarınızı içerir. Özel tutun ve MCP istemcinizin yapılandırmasına yapıştırın. Doğrudan stdio bağlantısı, istemcinin araç onaylarını ve anahtarın yetkilerini kullanır; gateway onayları ayrı bir yoldur.

## İsteğe bağlı modelleri ve çizgeyi açın

Modeller zorunlu değildir. Bilgi çıkarımı ve anlamsal arama için hazır sağlayıcılarla `MESA_MODEL_ENABLED=true`, `MESA_LLM_MODEL=provider:model` ve `MESA_EMBEDDING_MODEL=provider:model` ayarlarını kullanın. `MESA_GRAPH_ENABLED=false`, Kùzu’yu ve GRAPH adımlarını atlar. Çizge veya embedding yeniden açıldığında atlanan adımlar başlangıçta tamamlanır. [Yapılandırma](docs/core/configuration/) ve [sağlayıcılar](docs/core/embedding-providers/) rehberlerine bakın. Üretim yeterliliği NO-GO durumundadır.
