## Kurulum komutları

```bash
mesa-lore install
mesa-lore doctor
mesa-lore uninstall
```

`install`, `doctor` ve `uninstall`, başka bir ana dizinde çalışmak için `--home PATH` kabul eder.

## Hafızada arama

```bash
mesa-lore search "why did login fail" --project my-app
mesa-lore search "redis timeout" --kind decision --budget 400
mesa-lore index --project my-app
mesa-lore list --project my-app
mesa-lore show <id> --before 2 --after 2
```

| Komut | Seçenekler |
| --- | --- |
| `search` | `--project`, `--kind`, `--budget` (varsayılan 800 token) |
| `index` | `--project`, `--budget` (varsayılan 400, çıktı yaklaşık 181 ile sınırlı) |
| `list` | `--project` |
| `show` | `--project`, `--before`, `--after` |

`--project` verilmezse `search`, `index` ve `show` geçerli projeyi kullanır. `list` tüm projeleri gösterir.

## Dışa aktarma ve kullanım

```bash
mesa-lore export --project my-app --out my-app.md
mesa-lore export --all -o notes/
mesa-lore stats --days 30
mesa-lore stats --project my-app --json
```

`export`; kararlar, başarısız denemeler, yapılacaklar, bilgiler, geçmiş ve oturumlarla okunabilir Markdown yazar. `stats` token kullanımını gösterir ve `--project`, `--days`, `--agent`, `--json` kabul eder.

## Hafızayı silme

```bash
mesa-lore delete <id>
mesa-lore purge --project my-app
mesa-lore purge --older-than 90d
```

> [!WARNING]
> `purge` saklanan kayıtları kalıcı olarak siler. `purge --older-than`, ayrıca `--project` vermezseniz tüm projelere uygulanır.

## İleri komutlar

```bash
mesa-lore ingest session.jsonl --agent claude
mesa-lore ingest-pending
mesa-lore serve
```

`ingest` tek bir dökümü içe aktarır ve `--agent claude`, `codex` veya `antigravity` ister. `ingest-pending` kuyruktaki dökümleri işler ve Antigravity’yi tarar. `serve`, MCP sunucusunu stdio üzerinden çalıştırır. `hook` ajan hook’ları tarafından çağrılır, normalde elle çalıştırılmaz.
