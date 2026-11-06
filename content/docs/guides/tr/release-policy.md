## Yayın ve üretim yeterliliği

Site v0.9.2 kaynak sürümünü izler. Alfa / üretim NO-GO sürer; yayın, CI sonuçları ve DEV arama ölçümleri sertifikasyon sayılmaz. GitHub ve PyPI v0.9.2 yayını 7 Kasım 2026’da doğrulandı. PyPI wheel’inin 150 Python kaynak dosyası etiketli sürümle aynı.

## Etiket, kimlik ve derleme kanıtı

Resmî v0.9.2 yayını, SSH imzalı annotated etiket ve tam yerel imzalı etiket ön kontrolünün geçtiğini kaydeder. Etiket imzası imzalayanı; OIDC build attestation ise artefakt özetlerini derleme kimliğine bağlar. Yayında Yasou13/MESA, .github/workflows/ci.yml, refs/tags/v0.9.2 ve 8cd2cfe1df5356e73b3bef83ae640850fd54c798 yayın commit’iyle sınırlı doğrulanmış köken raporları bulunur. Bunlar üretim sertifikasyonundan ayrı kanıtlardır.

## Trusted publishing kurulumu

Etiketle tetiklenen `.github/workflows/release.yml` wheel/sdist üretir, Twine ile doğrular ve GitHub Actions OIDC üzerinden yayımlar. Proje sahibi PyPI `mesa-memory` trusted publisher ayarını bir kez yapmalıdır: owner `Yasou13`, repository `MESA`, workflow `release.yml`, environment `pypi`; GitHub’da eşleşen `pypi` ortamını oluşturmalıdır. İş akışının varlığı paket yayını kanıtı değildir. Doğrulanmış artefakt yolu için [kuruluma](docs/core/installation/), mevcut veri dizinine dokunmadan önce [yükseltme rehberine](docs/core/migration/) bakın.
