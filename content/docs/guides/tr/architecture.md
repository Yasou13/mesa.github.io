## Tek yetkili hafıza kataloğu

SQLite; kaynak kimliği, değişmez revizyonlar, assertion’lar, mutasyon durumu ve artifact sahipliğinin otoritesidir. LanceDB vektör, Kùzu çizge projeksiyonu sağlar. Bir bilginin etkinliğine veya kimin okuyabileceğine bağımsız karar vermezler.

## Veri alımı ve kurtarma

Kabul işlemi; arka plan çıkarımı, seçili doğrulama ve SQL → vektör → çizge projeksiyonundan önce kalıcı işi kaydeder. Depolar tek ACID transaction paylaşmaz; fencing token’lı lease, idempotent receipt, sahiplik ve reconciliation durumlarını tutarlı hale getirir. Yalnızca COMMITTED tamamlanmış hafızadır.

## Sistemi ayrı görünümlerle okuyun

[Mimari sayfası](architecture/); mantıksal akışı, fiziksel depoları, retrieval yürütmesini ve kanıt kimliğini ayrı anlatır. [Veri alımı](docs/core/concepts-and-ingestion/), [retrieval](retrieval/), [güvenlik](docs/core/security/) ve [operasyon](docs/core/operations/) ayrıntılı sözleşmeleri sunar.
