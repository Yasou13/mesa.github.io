## Veriler nerede?

Hafıza `~/.local/share/mesa-lore/lore.db` dosyasında saklanır. Başka bir yol için `MESA_LORE_DB` ayarlayın. Hook kuyruğu, `MESA_LORE_QUEUE` ayarlanmadıkça bu dosyanın yanında tutulur. Kurulum yedekleri `~/.config/mesa-lore/backup/` altındadır.

## Neler saklanır?

MESA Lore; içe aktarılan oturumlardaki kullanıcı mesajlarını, asistan mesajlarını ve araç etkinliklerini, ayrıca kaydedilen notları, devir notlarını ve token kullanımını saklar. Kodlama oturumları özel kod ve iş bilgisi içerebileceği için veritabanını hassas kabul edin.

## Ağ ve model sağlayıcıları

MESA Lore çalışırken ağ çağrısı ve LLM çağrısı yapmaz. Ancak kodlama ajanınız, aldığı hafızayı diğer bağlamlar gibi kendi model sağlayıcısına iletir.

## Gizli bilgi maskeleme

Yaygın API anahtarları, token’lar, şifreler, bearer değerleri, özel anahtarlar ve URL içindeki kimlik bilgileri kaydedilmeden önce `[REDACTED]` olarak maskelenir.

> [!WARNING]
> Maskeleme kalıp tabanlıdır ve alışılmadık bir biçimi kaçırabilir. Gizli bilgiler için tek koruma olarak buna güvenmeyin.

## Bir projeyi hariç tutma

Proje adını `~/.config/mesa-lore/config.toml` dosyasına ekleyin:

```toml
excluded_projects = ["private-client"]
```

O projeden gelen yeni içe aktarmalar atlanır. Daha önce saklanan kayıtlar, siz silene kadar kalır.

## Verileri silme

- `mesa-lore delete <id>` tek bir kaydı siler.
- `mesa-lore purge --project my-app` projenin kayıtlarını, devir notlarını ve kullanım verilerini siler.
- `mesa-lore purge --older-than 90d`, `--project` eklemezseniz tüm projelerdeki eski kayıtları siler.

> [!IMPORTANT]
> Silme işlemi ajanlarınızın özgün dökümlerini silmez. `purge --project` sonrasında bu dosyalar yeniden içe aktarılabilir. Projenin dışarıda kalması gerekiyorsa önce onu hariç tutun.
