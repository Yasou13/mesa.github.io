## Desteklenen çalışma profilini seçin

V4, storage root başına modeli etkin tek combined owner çalıştırır. V3 uyumluluğu ayrı API/worker rolleri kullanır ve veri alımı için çalışır embedding gerektirir. V3 ve V4 root’larını ayırın.

## Temel ortamı kurun

`uv sync --locked --python 3.10` ve `uv pip check` kullanın; CI matrisinde Python 3.10–3.13 test edilir. Yerel depolama ve HTTP/SDK desteği dahildir. Testler için `dev`, yerel modeller için `ml`, sağlayıcı SDK’ları için `adapters` ekleyin. Model kapalı başlangıç ML extra veya veritabanı sunucusu gerektirmez. [Sağlayıcılara](docs/core/embedding-providers/) bakın.

## Dağıtımdan önce hazırlayın

Credential, ACL, açık storage root ve gözden geçirilmiş sağlayıcı ayarlarını hazırlayın. Native ve Docker dağıtımı için aşağıdaki kaynağın güncel kurulum bölümünü izleyin. Readiness tek başına üretim yeterliliği değildir.
