## Core’un görevi

MESA Core, bilgiyi kaynağı ve erişim kapsamıyla kalıcı olarak saklar. Asıl kayıtların sahibi SQLite’tır; LanceDB ve Kùzu arama görünümleri sağlar. Yanıtı uygulama bu kanıttan üretir.

## Yerelde başlayın

Doğrulanan PyPI paketi `mesa-memory==0.9.1` ile [yerel hızlı başlangıcı](docs/core/getting-started/) izleyin. `mesa start`, ardından `mesa add` ve `mesa search` kullanın. BM25 için model gerekmez. OpenAI/Ollama temel pakettedir; Anthropic `[adapters]`, yerel ML/yeniden sıralama `[ml]` gerektirir.

## Sürüm temeli

Rehberler 1 Kasım 2026’da `e2f984d4ad97c01782a347e29e44808e5a16dad3` commit’iyle yayımlanan [v0.9.1](https://github.com/Yasou13/MESA/releases/tag/v0.9.1) sürümünü izler. Round 13 kapsamlı aramayı ve CLI etkinleşme beklemesini iyileştirir; Round 14 madde sınırlarını koruyan parçalama, isteğe bağlı BGE yeniden sıralama, 8.0 vektör ağırlığı ve kaynakla silme ekler. Mevcut V4 yolları ve istek biçimleri uyumludur. Alfa / üretim NO-GO sürer. [Sürüm notları ve DEV kanıtına](docs/core/release-notes/) bakın.
