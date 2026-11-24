## Core’un görevi

MESA Core, bilgiyi kaynağı ve erişim kapsamıyla kalıcı olarak saklar. Asıl kayıtların ve BM25 indekslerinin sahibi SQLite’tır; LanceDB isteğe bağlı vektör görünümünü tutar. Yanıtı uygulama bu kanıttan üretir.

## Yerelde başlayın

Doğrulanan PyPI paketi `mesa-memory==0.9.5` ile [yerel hızlı başlangıcı](docs/core/getting-started/) izleyin. `mesa start`, ardından `mesa add` ve `mesa search` kullanın. BM25 için model gerekmez. OpenAI/Ollama temel pakettedir; Anthropic `[adapters]`, yerel ML/yeniden sıralama `[ml]` gerektirir.

## Sürüm temeli

Rehberler [v0.9.5](https://github.com/Yasou13/MESA/tree/v0.9.5) etiketini, `c725616364f3931249bd05a62676f132b65768e1` commit’ini izler. Changelog sürümü 24 Kasım 2026 olarak tarihler; etiket ile PyPI wheel ve sdist dosyaları aynı gün doğrulandı. Arama, önek eşleşmeli BM25 ile çalışır; embedding modeli ayarlıysa vektör aramasını ekler, yerleşik Türk hukuku kurallarını varsayılan olarak uygular ve isteğe bağlı olarak yeniden sıralar. Bilgi kaydı füzyon ağırlığı 0.0’dır. Sürümlü belgeler `metadata.valid_from`/`valid_to` taşır ve `valid_at` ile belirli bir andaki hâliyle aranabilir. Çizge deposu 0.9.5’te kaldırıldı; bkz. [çizge deposu kaldırıldı](docs/core/graph/). Modeller varsayılan olarak kapalıdır. Alfa / üretim NO-GO sürer. [Sürüm notları ve sınırlara](docs/core/release-notes/) bakın.
