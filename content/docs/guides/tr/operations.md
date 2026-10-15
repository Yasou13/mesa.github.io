## Tek yazıcı ve gözlenebilir iş

Her storage root için tek combined V4 owner çalıştırın. Projection backlog, dead letter, takılmış lease, cleanup backlog/blocked ve orphan registry metriklerini izleyin. Paylaşılan artifact sayısının sıfır olması gerekmez. Artan backlog, depodaki satırları elle düzenleme izni değil operasyonel sinyaldir.

## Kurtarma sahipliği korur

Yetkili replay’den önce asıl depo/sağlayıcı hatasını giderin. Fencing claim’ini kaybeden iş tamamlanamaz. Rollback, kaynak sahipliğini kaldırır ve ikincil temizlikten önce tombstone yazar; başka etkin kaynak sahip olduğu sürece ortak artifact yaşar. BLOCKED cleanup başarı değildir.

## Cutover öncesi yedek alın

Writer-lock kontrolleri içeren sabitlenmiş offline backup/restore prosedürünü kullanın. Geri dönüş koruması boyunca özgün root ve yedeği saklayın. Yeni boş hedefe restore edin; mevcut root’u ezmeyin veya genel downgrade çalıştırmayın. [Rebuild](docs/core/rebuild-runbook/) offline ve storage-root genelindedir; online veya tenant kapsamlı değildir.
