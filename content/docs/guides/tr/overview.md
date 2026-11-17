## Core’un görevi

MESA Core, bilgiyi kaynağı ve erişim kapsamıyla kalıcı olarak saklar. Asıl kayıtların sahibi SQLite’tır; LanceDB ve Kùzu arama görünümleri sağlar. Yanıtı uygulama bu kanıttan üretir.

## Yerelde başlayın

Doğrulanan PyPI paketi `mesa-memory==0.9.3` ile [yerel hızlı başlangıcı](docs/core/getting-started/) izleyin. `mesa start`, ardından `mesa add` ve `mesa search` kullanın. BM25 için model gerekmez. OpenAI/Ollama temel pakettedir; Anthropic `[adapters]`, yerel ML/yeniden sıralama `[ml]` gerektirir.

## Sürüm temeli

Rehberler [v0.9.3](https://github.com/Yasou13/MESA/tree/v0.9.3) etiketini, `531209bc45805b478264f6dfa8a9e40a94e345cb` commit’ini izler. Changelog sürümü 16 Kasım 2026 olarak tarihler; etiket ve PyPI yayını 17 Kasım’da doğrulandı. Bildirilen yerel ölçümlerde toplu veri alımı ve hukuk ayrıştırması hızlandı. Varsayılan embedding kimliği BGE-M3, 1024 boyuttur; modeller varsayılan kapalıdır. Alfa / üretim NO-GO sürer. [Sürüm notları ve sınırlara](docs/core/release-notes/) bakın.
