## Çalışma profilini seçin

V4’te her veri dizinini tek bir combined süreci yönetir; bilgi işlemek için model desteğinin açık olması gerekir. V3 uyumluluk profili ayrı API ve arka plan çalışanı rolleri kullanır. V3 ile veri almak için de çalışan bir sayısal temsil sağlayıcısı gerekir. İki sürümü ayrı veri dizinlerinde tutun.

## Paketleri kurun

`uv sync --locked --python 3.10` ve `uv pip check` komutlarını kullanın. Otomatik testlerde Python 3.10–3.13 sürümleri denenir. Yerel depolama, HTTP ve SDK desteği temel kuruluma dahildir. Testler için `dev`, yerel modeller için `ml`, sağlayıcı SDK’ları için `adapters` ek paketlerini seçebilirsiniz. Model kullanmadan başlatmak için ML ek paketi veya ayrı bir veritabanı sunucusu gerekmez. [Sağlayıcı rehberini](docs/core/embedding-providers/) de inceleyin.

## Başlatmadan önce hazırlayın

Erişim bilgilerini, izinleri, veri dizinini ve sağlayıcı ayarlarını hazırlayın. Doğrudan sistem üzerinde veya Docker ile kurulum için aşağıdaki güncel kaynağı izleyin. Hazır olma kontrolünün geçmesi, canlı kullanım için bütün testlerin tamamlandığı anlamına gelmez.
