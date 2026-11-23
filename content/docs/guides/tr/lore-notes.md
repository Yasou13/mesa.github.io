## Not türleri

| Tür | Kullanım |
| --- | --- |
| `decision` | Sonraki oturumların uyması gereken seçim |
| `fact` | Proje hakkında kalıcı bilgi |
| `todo` | Hâlâ açık olan iş |
| `failed_attempt` | Denenip işe yaramayan çözüm |
| `handoff` | Sonraki oturumun devam etmek için bilmesi gerekenler |

Notları kısa ve belirli tutun. Dökümler zaten aranabilir; yalnızca doğrudan bulunmaya değer bilgileri kaydedin.

## Eski bir notu değiştirme

Yeni bir `decision` veya `fact` eski bir notu değiştiriyor gibi görünürse `memory_save`, `possibly replaces` ipucu döndürür. Bu ipucu tek başına hiçbir şeyi değiştirmez. Onaylamak için aynı metni `replaces` ile kaydedin:

```json
{"text": "Switched the Redis session timeout to 7200 seconds", "kind": "decision", "replaces": "n_0560d0d76b33"}
```

Eski not, `superseded` durumuyla geçmişte kalır.

## Devir notları

Devir notu nelerin yapıldığını, hangi kararların alındığını ve sırada ne olduğunu kaydeder. MESA Lore içe aktarılan her oturumdan temel bir devir notu oluşturur. `Stop` hook’u olan ajanlarda 8. turda, sonra en fazla 20 turda bir ajandan kendi notunu yazmasını ister. Ajanın yazdığı devir notu önceliklidir.

## Projeler ve kapsamlar

Proje, Git deposunun adıdır; depo dışında klasör adıdır. Git worktree’leri ana deponun adını kullanır.

- Arama, geçerli projeyi ve `global` notlarını döndürür.
- `research:<topic>` notları yalnızca o kapsamı doğrudan istediğinizde döner.
- Diğer projelerde arama yapılmaz.

Proje yeniden adlandırıldıysa eski adı `~/.config/mesa-lore/config.toml` içinde eşleyin:

```toml
[aliases]
old-project-name = "new-project-name"
```

## Eskimiş notlar

Bir not `files` ve `repo` ile kaydedilirse MESA Lore her dosyanın son Git commit’ini kaydeder. Dosya değiştiğinde sonuçlar notu `[STALE]` olarak işaretler. Nota güvenmeden önce güncel kodla karşılaştırın.
