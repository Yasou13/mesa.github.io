## Kaynaklar ve erişim alanları nasıl düzenlenir?

Üst erişim alanı (tenant), çalışma alanlarını ve veri kümelerini içerir. Her veri kümesinin belgeleri, değiştirilemeyen sürümleri ve kaynak metin parçaları vardır. Sunucunun açtığı oturum; erişim kimliğini, üst alanı, çalışma alanını, ajanı ve izin verilen sabit veri kümesi listesini bir araya getirir. İstemcinin gönderdiği ek bilgiler kendi başına erişim yetkisi vermez.

## Kabul edilmesi, tamamlandığı anlamına gelmez

`POST /v4/memory/insert` için oturum ve kaynak kimlikleriyle birlikte `title`, `source_ref` ve tam `content` gerekir. HTTP 202 yanıtında değişiklik işleminin, aday kaydın, işleme hattının ve ham günlüğün kimlikleri döner. Sonrasında işlemin durumunu izleyin: `wait_until_committed` başarısız bir son durumla da dönebilir. Reddedilen iş, etkin arama kayıtları oluşturmamalıdır.

## Çok parçalı sürümler ve tekrar denemeler

Bir sürüm birden fazla parçadan oluşuyorsa her parçaya ayrı kimlik ve sıra numarası verin. Son eklemeye kadar `finalize_revision=false` gönderin. Son ekleme parça listesini sabitler; sürümün etkinleşmesi gereken tüm alt işlerin başarısını bekler. Tekrar denemede aynı yineleme anahtarını ve birebir aynı içeriği kullanın. Çelişen tekrar reddedilir. Düzeltme için yeni sürüm oluşturulur; kalıcı silme ve geri alma ise açık izinlerle kaynağın sahiplik bağını kaldırır.
