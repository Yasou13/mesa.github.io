## Her veri dizininin tek yazıcısı olmalı

Her veri dizini için tek combined V4 süreci çalıştırın. Arama görünümü ve temizlik kuyruklarını, başarısız iş kuyruğunu, takılı iş sahipliklerini ve sahipsiz kayıtları izleyin. Paylaşılan çıktıların sayısının sıfır olması gerekmez. Kuyruğun büyümesi, depodaki satırları elle değiştirmek için gerekçe değildir; nedenini araştırmanız gereken bir işletim işaretidir.

## Kurtarma, sahiplik kurallarını korur

Bir işi yeniden yürütmeden önce depo veya sağlayıcı hatasını giderin. İş sahipliğini kaybeden bir çalışan, o işi tamamlayamaz. Geri alma işleminde önce kaynağın sahiplik bağı kaldırılıp silindi işareti yazılır, ardından ikincil temizlik yapılır. Başka bir etkin kaynağın hâlâ kullandığı ortak çıktı korunur. Temizliğin BLOCKED olması, başarılı olduğu anlamına gelmez.

## Yeni düzene geçmeden önce yedek alın

Aşağıdaki kaynakta yer alan, yazıcı kilidi kontrollerini içeren çevrimdışı yedekleme ve geri yükleme adımlarını izleyin. Geri dönme olanağını koruduğunuz sürece özgün veri dizinini ve yedeği saklayın. Yedeği yeni, boş bir dizine yükleyin; mevcut dizinin üzerine yazmayın veya genel bir sürüm düşürme işlemi çalıştırmayın. [Yeniden oluşturma](docs/core/rebuild-runbook/) çevrimdışıdır ve veri dizininin tamamını kapsar; tek bir üst erişim alanını çevrimiçi onarmaz.
