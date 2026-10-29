## Ön koşulları kontrol edin

Bu rehber bir yerel denemedir. Metin belgesi ekleyip kaynaklı arama sonucu alacaksınız; model hesabı gerekmez. MESA son yanıtı yazmaz. Terminal, komut yazdığınız uygulamadır; Linux’ta Terminal’i, macOS’ta Terminal uygulamasını açın.

### Linux ve macOS

Python 3.11–3.13 ve pip gerekir. Önce sürümü kontrol edin:

```bash
python3 --version
```

**Başarı ölçütü:** çıktı `Python 3.11`, `3.12` veya `3.13` ile başlamalıdır. Python yoksa veya sürüm farklıysa [resmî Python indirme sayfasını](https://www.python.org/downloads/) kullanın. Linux’ta venv bileşeni eksikse dağıtımınızın Python venv paketini kurun.

### Windows: WSL

Windows’un yerel PowerShell penceresinde `mesa start` çalışmaz. [Microsoft’un WSL kurulum rehberini](https://learn.microsoft.com/windows/wsl/install) izleyip Linux terminali açın; aşağıdaki Linux komutlarını o terminalde uygulayın. Python sürümünü WSL içinde kontrol edin.

### Docker yolu

Python kurulumunu kullanmayacaksanız [Docker kurulumunu](https://docs.docker.com/get-started/get-docker/) tamamlayıp [Docker ile kurulum bölümüne](#docker-ile-kurulum) geçin.

## v0.9.0 sürümünü kurun

Yeni bir çalışma klasöründe bu komutları çalıştırın. Sanal ortam, MESA paketlerini diğer Python projelerinizden ayırır.

```bash
python3 -m venv .venv
. .venv/bin/activate
python -m pip install "mesa-memory[adapters]==0.9.0"
mesa --help
```

**Başarı ölçütü:** yardım çıktısında `start`, `add`, `search` ve `status` komutları görünür. `mesa: command not found` hatasında doğru klasörde `. .venv/bin/activate` çalıştırın.

## Yerel sunucuyu başlatın

Terminal 1’de:

```bash
mesa start
```

**Başarı ölçütü:** sunucu `http://127.0.0.1:8000` adresinde başlar ve `Application startup complete` kaydı görünür. Bu pencereyi açık bırakın. Yerel depolama `~/.mesa/data`, özel kimlik bilgileri `~/.mesa/credentials.json` içindedir.

Modeller ve dış sağlayıcılar varsayılan olarak kapalıdır; mevcut `.env` ayarlarınız bu varsayılanı değiştirebilir. Bu rehber sözcük araması içindir.

## Bir belge ekleyip arayın

Terminal 2’yi aynı çalışma klasöründe açıp sanal ortamı etkinleştirin:

```bash
. .venv/bin/activate
```

UTF-8 örnek belgeyi oluşturun. Alındıyı bir sonraki adım için `receipt.json` dosyasına kaydedin:

```bash
printf '%s\n' 'Atlas arşivi hafta içi 09:00 saatinde açılır.' > archive-tr.txt
mesa add archive-tr.txt --source file://archive-tr.txt --json > receipt.json
cat receipt.json
```

Kaydedilmiş çalıştırmadan seçilmiş alındı alanları aşağıdadır. Kimlikler sizin çalıştırmanızda farklı olabilir; `receipt.json` kendi tam alındınızı içerir.

```json
{
  "document_id": "doc-d206865140f38f4fcadb22c4645c222f",
  "revision_number": 1,
  "chunk_count": 1,
  "mutation_ids": [
    "a7e6110e-5e6f-55f5-88ee-0ad1fd9086ee"
  ]
}
```

**Başarı ölçütü:** alındıda `document_id`, `chunk_count` ve `mutation_ids` bulunur. Bu kabul bilgisidir; henüz aranabilir olduğunu göstermez.

## İşlemenin tamamlandığını doğrulayın

Aşağıdaki kodu `wait_for_document.py` adlı dosyaya kaydedin. Yerel kimlik bilgilerini otomatik okur ve her mutasyonun son durumunu kontrol eder:

```python
import json
from mesa_client import Mesa, MesaV4Client

receipt = json.load(open("receipt.json", encoding="utf-8"))
with Mesa() as local:
    with MesaV4Client(local.base_url, api_key=local.api_key) as client:
        for mutation_id in receipt["mutation_ids"]:
            state = client.wait_until_committed(mutation_id)
            print(mutation_id, state["state"])
            if state["state"] != "COMMITTED":
                raise SystemExit("Document processing failed")
```

```bash
python wait_for_document.py
```

**Başarı ölçütü:** her satırın sonunda `COMMITTED` görünür. Başka bir son durumda betik hata ile durur; belgeyi başarılı işlenmiş kabul etmeyin. Zaman aşımında sunucunun açık olduğunu kontrol edip aynı betiği yeniden çalıştırın. [Durum API’si](docs/core/api-reference/) ayrıntıları gösterir.

`mesa status`, sunucunun hazır ve sağlıklı olup olmadığını gösterir; belge mutasyonlarının tamamlandığını göstermez.

## İlk arama sonucunu görün

```bash
mesa search "arşivi"
```

Kaydedilmiş gerçek CLI çıktısı:

```text
[1] score: 0.033 | doc-d206865140f38f4fcadb22c4645c222f
    Atlas arşivi hafta içi 09:00 saatinde açılır.
```

**Başarı ölçütü:** sonuçta belgenizdeki `09:00` metni ve belge kimliği görünür. Kimlik ve skor değişebilir; skor doğruluk olasılığı değildir. Kaynak ve sürüm alanlarını [ana sayfadaki gerçek kayıt örneğinde](https://mesamemory.dev/tr/#example) görebilirsiniz.

**Sonuç boşsa:** önce tamamlanma betiğini çalıştırın; sonra belgedeki sözcüğü aynen arayın. **Bağlantı hatasında:** Terminal 1’in açık ve `mesa status` çıktısının sağlıklı olduğunu kontrol edin. **Port kullanımda ise:** başka bir MESA örneği olup olmadığını kontrol edin; bu rehber mevcut depolamayı silmenizi gerektirmez.

## Docker ile kurulum

Bu yol için Git, Docker Engine/Desktop ve Compose gerekir. Sabitlenmiş kaynak sürümünü açın:

```bash
git clone --branch v0.9.0 --depth 1 https://github.com/Yasou13/MESA.git
cd MESA
docker compose -f docker-compose.v4.yml up --build -d
docker compose -f docker-compose.v4.yml exec mesa-v4 mesa status
```

**Başarı ölçütü:** durum çıktısı `ready` ve `healthy` gösterir. Compose, 8000 portunu yalnızca ana makinenin loopback adresinde yayımlar; volume veriyi ve kimlik bilgilerini korur.

Belge ekleme, tamamlanma kontrolü ve arama adımlarını konteyner içinde uygulayın. Kabuk açmak için:

```bash
docker compose -f docker-compose.v4.yml exec mesa-v4 sh
```

Konteyner kabuğunda sanal ortam etkinleştirme adımını atlayın; örnek dosyayı oluşturup yukarıdaki `mesa add` ve Python tamamlanma betiğini kullanın. Komut bitince `exit` ile çıkın. Yerel makinedeki `mesa` komutu konteyner kimlik bilgilerini kendiliğinden kullanmaz. [Dağıtım rehberi](docs/core/installation/) ayrıntıları açıklar.

## Python kullanın veya MCP istemcisi bağlayın

İlk aramanız başarılı olduktan sonra [Python SDK örneklerine](docs/core/examples/) veya [MCP rehberine](docs/mcp/) geçin. MCP ayarını üretmek için:

```bash
mesa mcp-config
```

Çıktı yerel API anahtarını içerir; paylaşmayın. MESA bağlam metnini döndürür, son yanıtı uygulamanız ve onun modeli üretir.

## İsteğe bağlı modelleri ve çizgeyi açın

Bu ilk arama için gerekli değildir. Anlamsal arama ve bilgi çıkarımı için [model yapılandırmasını](docs/core/configuration/) ve [sağlayıcıları](docs/core/embedding-providers/) inceleyin. Dış sağlayıcılar veri aktarımı ve kullanım ücreti doğurabilir. Grafik/embedding yeniden açıldığında atlanan işler başlangıçta tamamlanabilir. Yerel başarı üretim yeterliliği sağlamaz; canlı kullanım doğrulamaları tamamlanmadı.
