## MESA Lore nedir?

MESA Lore, kodlama ajanları için yerel bir MCP hafıza sunucusudur. Geçmiş Claude Code, Codex CLI ve Antigravity oturumlarını ve ajanların kısa notlarını tek bir SQLite dosyasında dizinler. Yeni bir oturum önceki kararları, hataları ve çalışmaları arayabilir ve yalnızca kaynaklarıyla birlikte küçük bölümleri geri çağırır.

CPU üzerinde çalışır, LLM çağrısı yapmaz, embedding kullanmaz ve çalışırken ağ üzerinden hiçbir şey göndermez. Ayrı bir araçtır ve MESA Core gerektirmez.

## Bir oturum nasıl işler?

1. `mesa-lore install` ajanlarınızı bağlar ve mevcut oturum geçmişini içe aktarır.
2. Claude Code ve Codex’te `SessionStart` hook’u yeni oturuma kısa bir proje dizini ekler.
3. Ajan bir ayrıntıya ihtiyaç duyduğunda `memory_search`, çevresindeki bağlamı okumak için `memory_get` çağırır.
4. `Stop` ve `SessionEnd` hook’ları dökümü kuyruğa alır; döküm sonraki oturum başladığında dizinlenir.
5. Ajan `memory_save` ile karar, bilgi, yapılacak iş, başarısız deneme ve devir notu kaydedebilir.

## Ne zaman kullanmalısınız?

| İhtiyaç | Daha uygun çözüm |
| --- | --- |
| Proje kuralları ve kod standartları | `CLAUDE.md` veya `AGENTS.md` |
| Claude Code’da öğrenilen tercihler | Claude Code otomatik hafızası |
| Önceki oturumlarda ne olduğunu bulmak | MESA Lore |
| Geliştirdiğiniz uygulama için belge hafızası | [MESA Core](docs/core/) |

MESA Lore, ajanların yerleşik hafızasını tamamlar. Talimat dosyalarınızın yerine geçmez.

## Güncel durum

0.1.0 sürümü Apache-2.0 lisanslı açık kaynak bir sürümdür. Python 3.10 veya üstü gerektirir ve GitHub’dan kurulur. Linux test edildi, macOS test edilmedi, Windows henüz desteklenmiyor. [Sınırlar ve ölçülen sonuçlara](docs/lore/troubleshooting/) bakın.

## Sonraki adımlar

- [MESA Lore’u kurun](docs/lore/installation/)
- [Ajanlarınızı bağlayın](docs/lore/agents/)
- [MCP araçlarını öğrenin](docs/lore/mcp-tools/)
