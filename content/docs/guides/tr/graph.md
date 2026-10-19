## Asıl kayıtlarla çizge görünümünü ayırın

Düğümlerin ve bilgi kayıtlarının aslı SQLite’ta tutulur. Kùzu, ilişkileri belirli sınırlar içinde gezip aramak için kullanılır. Aynı düğümleri bağlayan farklı kayıtlar tekleştirilmez; ilişki türü, kaynak ve zaman bilgisi ayrı anlam taşıyabilir. Bir düğüme ulaşılabilmesi, tek başına o düğüme dayalı bir yanıtı doğrulamaz.

## Yolun dayanaklarını ve kullanılabilirliğini kontrol edin

Bir yolu destekleyen kayıt kimlikleri, düğüm sırası ve bağlantı yönleri, erişime izin verilen asıl kayıtlarla eşleşmelidir. `graph_neighbor_retrieval`, çizge üzerinde aramanın gerçekten kullanılabildiğini bildirir. Yalnızca çizge görünümüne yazabilen bir bileşen arama yapabiliyor sayılmaz. Çalışan arka uç hata verirse eksik sonuçlar tam gibi sunulmaz; açık 503 yanıtı döner.

## Kanalı kapatarak karşılaştırın

`graph_mode=disabled`, eş koşullarda karşılaştırma yapmak için çizge arama kanalını kapatır. Bilgi kaydı araması ve çizge görünümüne yazma devam eder. PageRank yalnızca izleme verisidir. Başlangıç düğümü, adım sayısı, düğüm başına bağlantı ve istek süresi sınırları işi kontrol altında tutar; tüm sonuçların bulunacağını veya belirli bir hız sağlanacağını garanti etmez.
