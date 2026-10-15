## Kaynak hiyerarşisi

Tenant; workspace ve dataset’leri içerir. Dataset; belgeleri, değişmez revizyonları ve tam kaynak parçalarını sahiplenir. Sunucunun oluşturduğu oturum; principal, tenant, workspace, agent ve değişmez yetkili dataset kümesini bağlar. İstemci metadata’sı kapsam yetkisi vermez.

## Kabul, tamamlanma değildir

`POST /v4/memory/insert`; oturum ve kaynak kimlikleri, title, source_ref ve tam content ister. 202 yanıtı mutation, candidate, pipeline ve raw-log kimlikleri döndürür. Mutasyon durumunu izleyin; `wait_until_committed` başarısız bir terminal durumla da dönebilir. Reddedilen iş etkin retrieval artifact’ı oluşturmamalıdır.

## Revizyon sınırları ve tekrarlar

Çok parçalı revizyonda farklı kimlik/ordinal kullanın ve son insert’e kadar `finalize_revision=false` gönderin. Son insert üyeliği dondurur; etkinleştirme gereken tüm alt işlerin başarısını bekler. Tekrarda aynı body idempotency key ve birebir aynı payload kullanılır. Çelişen tekrar reddedilir. Düzeltme yeni revizyon oluşturur; purge ve rollback açık yetkilerle kaynak sahipliğini kaldırır.
