## Dört arama kanalı farklı ipuçları kullanır

Vektör kanalı, uyumlu sayısal temsiller arasındaki benzerliği karşılaştırır. BM25, FTS5 üzerinden pasaj ve kanıt metnini sözcüklerle arar; erişim kapsamındaki atıfları da kullanır. Bilgi kaydı kanalı özne, ilişki, nesne ve dayanağı değerlendirir. Çizge kanalı ise kaynakları belli olan sınırlı bağlantı yollarını bulur. Bir kaydın sahipliği ve erişime uygunluğu, sıralamaya katkı vermesinden önce denetlenir.

## RRF sıralamaları birleştirir; olasılık hesaplamaz

Çalışma zamanı varsayılanları k=60, vektör ağırlığı 8.0; BM25, bilgi kaydı ve çizge ağırlıkları 1.0’dır. Eski vektör ağırlığı için `MESA_RRF_VECTOR_WEIGHT=1` kullanın. Sıfır ağırlık, kanalın birleştirmeye katkısını kapatır. Hesaplayıcı, öğretici örnek olarak birim ağırlık kullanır. Sıralar 1’den başlar. Aynı aday bir kanalda birden çok kez görünse de yalnızca bir katkı verir: RRF(c)=Σ w/(k+rank). Kanal içindeki atıf artırımları o kanalın sırasını değiştirir; RRF puanına doğrudan eklenmez. Birleştirmeden sonra, sorguya bağlı ayrı bir hukuk katsayısı uygulanabilir. [Arama sayfasındaki](retrieval/) örnek hesaplayıcıyla farkı inceleyebilirsiniz.

## Çizge ve bağlam sınırları

Çizge araması en fazla 20 başlangıç düğümü, üç bağlantı adımı, istenen 500 sonuç, 64 düğümlük ilerleme kümesi ve düğüm başına 32 bağlantıyla sınırlandırılır. Varsayılan zaman aşımı 15 saniyedir. Bunlar kaynak tüketimini sınırlayan değerlerdir; hız garantisi değildir. Bağlam oluşturma varsayılan olarak tek arama ve 2048 token’lık biçimlendirilmiş kanıt bütçesi kullanır. İsteğe bağlı uyarlamalı mod, erişim kapsamını genişletmeden en fazla bir planlayıcı çağrısı ve iki ek arama yapar.

## v0.9.2 ile çalışma

Modeller kapalıyken BM25 saklanan kaynak metnini getirir. Kapalı veya eksik vektör ve çizge adımları degraded_sources içinde bildirilir. MESA_GRAPH_ENABLED=false, Kùzu’yu atlar; çizge veya embedding yeniden açıldığında başlangıçta eksikler tamamlanır.

## İsteğe bağlı BGE yeniden sıralama

Varsayılan `MESA_RERANK_ENABLED=false` değeridir. Açmak için `[ml]` eki gerekir. `MESA_RERANK_MODEL=BAAI/bge-reranker-v2-m3` ve `MESA_RERANK_DEPTH=50` (1–50 aralığı) aşamayı yapılandırır. Model ilk kullanımda yüklenir; ilk sorguya yükleme gecikmesi eklenir. Birleştirmeden sonra izinli adayların tam parça metinleri, ortak arama bağlantısı dışında bir worker thread’de puanlanır. Sonuçlara `rerank_score` eklenir; `rrf_score` ve `final_score` birleştirme değerleri olarak kalır. Eşit puanlarda birleştirme sırası korunur. [DEV kanıtı ve donanım gecikmelerine](docs/core/release-notes/) bakın.

## Eşzamanlı arama ve kapsam önbelleği

`MESA_SEARCH_SCOPE_CACHE=true`, kapsama özel geçici FTS indekslerini ve satır/metin özelliklerini dört kapsamlık LRU önbelleğinde yeniden kullanır. SQLite commit değişiklikleri önbelleği geçersiz kılar; her istekte yetkilendirme yeniden denetlenir. Sorgu embedding’i arama kilidinden önce hesaplanır; yeniden sıralama bağlantı bırakıldıktan sonra çalışır. scrypt doğrulama, anahtar oluşturma ve döndürme işlemleri event loop dışında yürütülür; yetki sonuçları önbelleğe alınmaz. Çizge kapalıysa başlangıç düğümlerinin hazırlığı atlanır.

## Kapsama bağlı hukuki kimlikler ve tam eşleşme önceliği

Hukuk kuralları açıkken izinli başlıklar ve ilk parça kanun başlıkları, `K.` dâhil kapsam önbellekli kanun adları öğretir. Tam kanun/madde veya kararın kendi esas/karar numarası, birleştirme ve isteğe bağlı yeniden sıralamadan sonra belge sırasıyla en fazla üç konumu başa alabilir; diğer sonuçlar düzenini korur. Karar kimliği sıfırıncı parçanın ilk 300 karakterinde başlamalıdır. Sonraki alıntılar sayılmaz. Yalnızca AYM gibi mahkeme adları Anayasa’yı seçmez.

`retrieval_provenance.legal_items`, özgün parça konumlarıyla sürümlü öğeleri döndürür; SPO kayıtlarından ayrıdır ve birleştirme skoruna eklenmez. `MESA_LEGAL_RULES_ENABLED=false`, hukuki işlemeyi atlar, sonuç kopyalarındaki mevcut hukuki ekleri gizler ve genel aramayı açık tutar. Kalıcı anlık görüntüler/kimlikler saklanır.
