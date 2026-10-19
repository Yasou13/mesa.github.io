## Asıl kayıtlar SQLite’ta tutulur

Kaynak kimliği, değiştirilemeyen belge sürümleri, bilgi kayıtları, değişikliklerin durumu ve çıktıların sahipliği SQLite’ta tutulur. LanceDB vektör araması, Kùzu ise ilişkiler üzerinde arama için kullanılır. Bu iki sistem, bir bilginin hâlâ geçerli olduğuna veya kimlerin erişebileceğine kendi başına karar vermez.

## Veri alımı ve kurtarma nasıl ilerler?

Bir istek kabul edildiğinde, yapılacak iş önce kalıcı olarak kaydedilir. Ardından bilgi çıkarımı ve seçilen doğrulamalar yapılır; kayıtlar SQL → vektör → çizge sırasıyla yazılır. Üç depo tek bir ACID işlemini paylaşmaz. Bu nedenle işin kime ait olduğu, hangi adımların tamamlandığı ve yeniden denendiğinde ne yapılacağı ayrıca izlenir. Yazma ancak `COMMITTED` durumuna ulaştığında tamamlanmış sayılır.

## Ayrıntıları nerede bulabilirsiniz?

[Mimari sayfası](architecture/) veri akışını, depoları, aramayı ve kaynak izini ayrı ayrı açıklar. Uygulama ayrıntıları için [veri alımı](docs/core/concepts-and-ingestion/), [arama](retrieval/), [güvenlik](docs/core/security/) ve [işletim](docs/core/operations/) rehberlerine bakın.
