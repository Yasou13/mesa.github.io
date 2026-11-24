## Asıl kayıtlar SQLite’ta tutulur

Kaynak kimliği, değiştirilemeyen belge sürümleri, bilgi kayıtları, değişikliklerin durumu, çıktıların sahipliği ve BM25 indeksleri SQLite’ta tutulur. LanceDB isteğe bağlı vektör aramasını sağlar. Bir bilginin hâlâ geçerli olduğuna veya kimlerin erişebileceğine kendi başına karar vermez.

## Veri alımı ve kurtarma nasıl ilerler?

Bir istek kabul edildiğinde, yapılacak iş önce kalıcı olarak kaydedilir. Ardından bilgi çıkarımı ve kurala dayalı doğrulama yapılır; kayıtlar SQL → vektör sırasıyla yazılır. SQLite ve LanceDB tek bir ACID işlemini paylaşmaz. Bu nedenle işin kime ait olduğu, hangi adımların tamamlandığı ve yeniden denendiğinde ne yapılacağı her değişiklik için ayrıca izlenir. Yazma ancak `COMMITTED` durumuna ulaştığında tamamlanmış sayılır. Yarıda kesilen bütün belge yüklemesi, kabul sırasında kaydedilen bölme planıyla kaydedilmiş parçalardan devam eder.

## Ayrıntıları nerede bulabilirsiniz?

[Mimari sayfası](architecture/) veri akışını, depoları, aramayı ve kaynak izini ayrı ayrı açıklar. Uygulama ayrıntıları için [veri alımı](docs/core/concepts-and-ingestion/), [arama](retrieval/), [güvenlik](docs/core/security/) ve [işletim](docs/core/operations/) rehberlerine bakın.

## Arama indeksleri ve kapsam önbelleği

Tarih veya yargı yeri filtresi olmayan, tüm veri kümesini kapsayan bir arama, o veri kümesinin kalıcı FTS5 BM25 indeksini kullanır. SQLite bu indeksi commit, yerine geçme, geri alma ve kalıcı silme işlemleriyle aynı transaction içinde günceller; indeks yoksa asıl kayıtlardan yeniden kurar. Daha dar veya tarihli aramalar geçici bir kapsam FTS5 indeksi kurar; `MESA_SEARCH_SCOPE_CACHE=true` bu indeksleri ve satır/metin özelliklerini dört kapsamlık LRU önbelleğinde yeniden kullanır. SQLite commit değişiklikleri önbelleği geçersiz kılar; her istekte yetkilendirme yeniden denetlenir. Sorgu embedding’i arama kilidinden önce hesaplanır; yeniden sıralama bağlantı bırakıldıktan sonra çalışır.
