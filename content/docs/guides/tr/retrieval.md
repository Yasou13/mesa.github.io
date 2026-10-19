## Dört arama kanalı farklı ipuçları kullanır

Vektör kanalı, uyumlu sayısal temsiller arasındaki benzerliği karşılaştırır. BM25, FTS5 üzerinden pasaj ve kanıt metnini sözcüklerle arar; erişim kapsamındaki atıfları da kullanır. Bilgi kaydı kanalı özne, ilişki, nesne ve dayanağı değerlendirir. Çizge kanalı ise kaynakları belli olan sınırlı bağlantı yollarını bulur. Bir kaydın sahipliği ve erişime uygunluğu, sıralamaya katkı vermesinden önce denetlenir.

## RRF sıralamaları birleştirir; olasılık hesaplamaz

Varsayılan olarak k=60 ve dört kanalın ağırlığı 1.0’dır. Sıralar 1’den başlar. Aynı aday bir kanalda birden çok kez görünse de yalnızca bir katkı verir: RRF(c)=Σ w/(k+rank). Kanal içindeki atıf artırımları o kanalın sırasını değiştirir; RRF puanına doğrudan eklenmez. Birleştirmeden sonra, sorguya bağlı ayrı bir hukuk katsayısı uygulanabilir. [Arama sayfasındaki](retrieval/) örnek hesaplayıcıyla farkı inceleyebilirsiniz.

## Çizge ve bağlam sınırları

Çizge araması en fazla 20 başlangıç düğümü, üç bağlantı adımı, istenen 500 sonuç, 64 düğümlük ilerleme kümesi ve düğüm başına 32 bağlantıyla sınırlandırılır. Varsayılan zaman aşımı 15 saniyedir. Bunlar kaynak tüketimini sınırlayan değerlerdir; hız garantisi değildir. Bağlam oluşturma varsayılan olarak tek arama ve 2048 token’lık biçimlendirilmiş kanıt bütçesi kullanır. İsteğe bağlı uyarlamalı mod, erişim kapsamını genişletmeden en fazla bir planlayıcı çağrısı ve iki ek arama yapar.
