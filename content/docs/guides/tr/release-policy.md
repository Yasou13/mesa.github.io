## Yayın ve üretim yeterliliği

Site v0.9.1 kaynak sürümünü izler. Alfa / üretim NO-GO sürer; yayın, CI sonuçları ve DEV arama ölçümleri sertifikasyon sayılmaz. GitHub ve PyPI v0.9.1 yayını 1 Kasım 2026’da doğrulandı. PyPI wheel’inin 149 Python kaynak dosyası etiketli sürümle aynı.

## Etiket, kimlik ve derleme kanıtı

Normal yayın süreci annotated, GPG imzalı etiket ve güvenilir operatör anahtarlığıyla imza ön kontrolü kullanır. Proje sahibi v0.9.1 için imzasız annotated etiketi açıkça onayladı; imzalı etiket kontrolünün geçtiği iddia edilmez. GPG etiket imzalayanını doğrular; OIDC build attestation, artefakt özetlerini derleme kimliğine bağlar. Farklı kanıtlardır.

## Trusted publishing kurulumu

Etiketle tetiklenen `.github/workflows/release.yml` wheel/sdist üretir, Twine ile doğrular ve GitHub Actions OIDC üzerinden yayımlar. Proje sahibi PyPI `mesa-memory` trusted publisher ayarını bir kez yapmalıdır: owner `Yasou13`, repository `MESA`, workflow `release.yml`, environment `pypi`; GitHub’da eşleşen `pypi` ortamını oluşturmalıdır. İş akışının varlığı paket yayını kanıtı değildir. Doğrulanmış artefakt yolu için [kuruluma](docs/core/installation/), mevcut veri dizinine dokunmadan önce [yükseltme rehberine](docs/core/migration/) bakın.
