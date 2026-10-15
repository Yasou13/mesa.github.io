## Kanonik bilgiler, türetilmiş yollar

Düğüm ve assertion’ların otoritesi SQLite’tır. Kùzu, sınırlı komşu retrieval için ilişkileri projekte eder. Aynı düğümler arasındaki farklı assertion’lar; predicate, kaynak ve zaman kimliği önemli olduğu için ayrı kalır. Bir düğüme ulaşılabilmesi tek başına destekli yanıt değildir.

## Yolu ve çalışma zamanı bayrağını okuyun

Destekleyen assertion kimlikleri, hizalı düğüm yolları ve kenar yönleri, yetkili kanonik kayıtlarla uzlaştırılmış olmalıdır. `graph_neighbor_retrieval`, çalışır desteği bildirir; yalnız projeksiyon yazan adapter dolaşım uygulamaz. Çalışır backend’in hatası, sessizce eksiksiz gösterilen arama değil açık 503’tür.

## Ablation ve sınırlar

`graph_mode=disabled`, eşleştirilmiş karşılaştırma için retrieval kanalını kapatır; kanonik assertion retrieval ve graph projection yazmaları sürer. PageRank yalnızca telemetridir. Başlangıç, hop, fan-out ve istek süresi sınırları sınırsız işi önler; tamlık veya gecikme garantisi vermez.
