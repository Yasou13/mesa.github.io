## Core’un görevi

MESA Core, bilgiyi kaynağı ve erişim kapsamıyla kalıcı olarak saklar. Asıl kayıtların sahibi SQLite’tır; LanceDB ve Kùzu arama görünümleri sağlar. Yanıtı uygulama bu kanıttan üretir.

## Yerelde başlayın

Doğrulanan PyPI paketi `mesa-memory==0.9.4` ile [yerel hızlı başlangıcı](docs/core/getting-started/) izleyin. `mesa start`, ardından `mesa add` ve `mesa search` kullanın. BM25 için model gerekmez. OpenAI/Ollama temel pakettedir; Anthropic `[adapters]`, yerel ML/yeniden sıralama `[ml]` gerektirir.

## Sürüm temeli

Rehberler [v0.9.4](https://github.com/Yasou13/MESA/tree/v0.9.4) etiketini, `e30856ec6e7ed9146bb9af992565e864f727b0b9` commit’ini izler. Changelog sürümü 23 Kasım 2026 olarak tarihler; etiket, GitHub sürümü ve PyPI dosyaları aynı gün doğrulandı. Aramanın varsayılan yolu artık BM25 ve vektör kanallarıdır: siz açmadıkça çizge kapalı, bilgi kaydı füzyon ağırlığı 0.0’dır. V3 depolama, LLM consolidation ve Tier 3 mod 1/2 kaldırıldı. Varsayılan embedding kimliği BGE-M3, 1024 boyuttur; modeller varsayılan kapalıdır. Alfa / üretim NO-GO sürer. [Sürüm notları ve sınırlara](docs/core/release-notes/) bakın.
