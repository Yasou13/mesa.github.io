## Gereksinimler

- Python 3.10 veya üstü
- Git
- Linux. macOS test edilmedi, Windows henüz desteklenmiyor.

Paket henüz PyPI’da olmadığı için GitHub’dan kurulur.

## GitHub’dan kurulum

```bash
git clone https://github.com/Yasou13/MESA_Lore.git
cd MESA_Lore
python3 -m venv .venv
.venv/bin/pip install .
.venv/bin/mesa-lore install
.venv/bin/mesa-lore doctor
```

`install` desteklenen ajanları yapılandırır ve mevcut geçmişi içe aktarır. `doctor`, kullandığınız ajanlar için `OK` göstermelidir. Komutları `.venv/bin/` öneki olmadan çalıştırmak için ortamı etkinleştirin:

```bash
source .venv/bin/activate
mesa-lore --help
```

## Kurulum neleri değiştirir?

| Ajan | Dosyalar |
| --- | --- |
| Claude Code | `~/.claude.json`, `~/.claude/settings.json` |
| Codex CLI | `~/.codex/config.toml`, `~/.codex/hooks.json` |
| Antigravity | `~/.gemini/antigravity/mcp_config.json` |
| Linux’ta Claude masaüstü | `~/.config/Claude/claude_desktop_config.json` |

İlk kurulum bu dosyaları `~/.config/mesa-lore/backup/` altına kopyalar. Kurulumu yeniden çalıştırmak hook’ları çoğaltmaz.

> [!IMPORTANT]
> Kurulum ayrıca mevcut Claude Code, Codex ve Antigravity dökümlerini yerel veritabanına aktarır. Bir projeyi dışarıda tutmak için kurulumdan önce onu [hariç tutun](docs/lore/data-and-privacy/).

## Güncelleme

Bu komutları klonlanan klasörün içinde çalıştırın:

```bash
git pull
.venv/bin/pip install .
.venv/bin/mesa-lore install
.venv/bin/mesa-lore doctor
```

Veritabanı şeması, MESA Lore onu açtığında taşınır.

## Kaldırma

```bash
.venv/bin/mesa-lore uninstall
```

Bu komut MESA Lore kayıtlarını ajan dosyalarından kaldırır. Yedekleri ve veritabanını korur. Saklanan hafızayı silmek için [veri ve gizlilik](docs/lore/data-and-privacy/) sayfasına bakın.
