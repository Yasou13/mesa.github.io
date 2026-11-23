## Claude Code

`mesa-lore install`, MCP sunucusunu `~/.claude.json` dosyasına; `SessionStart`, `Stop` ve `SessionEnd` hook’larını `~/.claude/settings.json` dosyasına ekler. Kurulumdan sonra yeni bir oturum başlatın. Oturum kısa bir proje dizini alır ve ajan dört hafıza aracını kullanabilir.

MESA Lore, `CLAUDE.md` ve otomatik hafızayla birlikte çalışır. Talimatları bu dosyalarda tutun, önceki oturumları aramak için Lore’u kullanın.

## Codex CLI

Kurulum, MCP sunucusunu `~/.codex/config.toml` dosyasına, aynı hook’ları `~/.codex/hooks.json` dosyasına ekler. Codex’i açıp bunları `/hooks` ile onaylayın. Onaylayana kadar hafıza araçları çalışabilir, ancak otomatik yakalama ve oturum başı dizini çalışmaz.

## Antigravity

Kurulum, MCP sunucusunu `~/.gemini/antigravity/mcp_config.json` dosyasına ekler. Antigravity için MESA Lore hook’u yoktur; dökümler sunucu başladığında veya `mesa-lore ingest-pending` çalıştırdığınızda taranır. Proje özetini istediğinizde ajandan `memory_index` çağırmasını isteyin. Verileri başka bir klasördeyse `ANTIGRAVITY_BRAIN_DIR` ayarlayın.

## Claude masaüstü

Kurulum, MCP sunucusunu Claude masaüstü yapılandırmasına ekler; böylece hafıza araçları kullanılabilir. Otomatik yakalama yoktur. claude.ai ve masaüstü sohbet sekmesindeki sohbetler içe aktarılmaz.

## Bağlantıyı kontrol edin

`mesa-lore doctor` çalıştırın. Komut her ajan için MCP ve hook durumunu, veritabanı yolunu, son içe aktarmayı ve döküm uyarılarını gösterir. Bir ajan `missing` görünüyorsa [sorun giderme](docs/lore/troubleshooting/) sayfasına bakın.
