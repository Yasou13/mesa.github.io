## Üç ipucu, varsayılan olarak ikisi açık

BM25, FTS5 üzerinden pasaj ve kanıt metnini sözcüklerle arar; erişim kapsamındaki atıfları da kullanır. Vektör kanalı, uyumlu sayısal temsiller arasındaki benzerliği karşılaştırır ve bir embedding modeli açıkken çalışır. Bilgi kaydı kanalı özne, ilişki, nesne ve dayanağı değerlendirir; varsayılan füzyon ağırlığı 0.0 olduğundan siz artırmadıkça katkı vermez. Bir kaydın sahipliği ve erişime uygunluğu, sıralamaya katkı vermesinden önce denetlenir.

## RRF sıralamaları birleştirir; olasılık hesaplamaz

Çalışma zamanı varsayılanları k=60, vektör ağırlığı 8.0, BM25 ağırlığı 1.0, bilgi kaydı ağırlığı 0.0’dır. Sıfır ağırlık, kanalın birleştirmeye katkısını kapatır. Hesaplayıcı, öğretici örnek olarak birim ağırlık kullanır. Sıralar 1’den başlar. Aynı aday bir kanalda birden çok kez görünse de yalnızca bir katkı verir: RRF(c)=Σ w/(k+rank). Kanal içindeki atıf artırımları o kanalın sırasını değiştirir; RRF puanına doğrudan eklenmez. Birleştirmeden sonra, sorguya bağlı ayrı bir hukuk katsayısı uygulanabilir. [Arama sayfasındaki](retrieval/) örnek hesaplayıcıyla farkı inceleyebilirsiniz.

## Bağlam sınırları

Bağlam oluşturma varsayılan olarak tek arama ve 2048 token’lık biçimlendirilmiş kanıt bütçesi kullanır. İsteğe bağlı uyarlamalı mod, erişim kapsamını genişletmeden en fazla bir planlayıcı çağrısı ve iki ek arama yapar.

## v0.9.5 ile çalışma

Modeller kapalıyken BM25 saklanan kaynak metnini getirir. Kapalı veya eksik vektör kanalı degraded_sources içinde bildirilir; embedding açıldığında atlanan vektörler başlangıçta tamamlanır. BM25, 6 veya daha uzun rakamsız sorgu sözcüklerini ilk 5 karakterleriyle eşler; daha kısa ve rakam içeren sözcükler tam eşleşir. Eşit skorlar kararlı içerik kimliğiyle ayrılır; aynı derlemden kurulan iki yeni depo aynı sıralamayı üretir. LanceDB 0.41 vektörleri kiracı, veri kümesi ve ajana göre önceden süzer; MESA her adayı sıralamadan önce SQLite’a karşı doğrular.

## Belirli bir andaki hâliyle arama

Bir anda geçerli olan sürümleri aramak için saat dilimi içeren bir `valid_at` gönderin. Aralıklar yarı açıktır: bir sürüm `valid_from <= valid_at < valid_to` olduğunda eşleşir; bu yüzden değişikliğin tam yürürlük anında yalnızca yeni sürüm eşleşir. Tarihsiz aramalar yalnızca etkin sürümleri döndürür. Sonuçlar `revision_number`, `valid_from` ve `valid_to` alanlarını içerir (ayarlı değilse boş metin). Bkz. [sürümlü belgeler](docs/core/concepts-and-ingestion/#guide-surumlu-belgeler).

## İsteğe bağlı BGE yeniden sıralama

Varsayılan `MESA_RERANK_ENABLED=false` değeridir. Açmak için `[ml]` eki gerekir. `MESA_RERANK_MODEL=BAAI/bge-reranker-v2-m3` ve `MESA_RERANK_DEPTH=50` (1–50 aralığı) aşamayı yapılandırır. Model ilk kullanımda yüklenir; ilk sorguya yükleme gecikmesi eklenir. Birleştirmeden sonra izinli adayların tam parça metinleri, ortak arama bağlantısı dışında bir worker thread’de puanlanır. Sonuçlara `rerank_score` eklenir; `rrf_score` ve `final_score` birleştirme değerleri olarak kalır. Eşit puanlarda birleştirme sırası korunur.

## Arama indeksleri ve kapsam önbelleği

Tarih veya yargı yeri filtresi olmayan, tüm veri kümesini kapsayan aramalar veri kümesinin kalıcı FTS5 indeksini kullanır; bu indeks SQLite transaction’ları içinde commit’lerle birlikte güncellenir. Diğer kapsamlar yalnızca izinli satırları içeren geçici bir FTS5 indeksi kurar; `MESA_SEARCH_SCOPE_CACHE=true` bunu SQLite verisi değişene kadar dört kapsamlık LRU önbelleğinde yeniden kullanır. Her istekte yetkilendirme yeniden denetlenir.

## Kapsama bağlı hukuki kimlikler ve tam eşleşme önceliği

Hukuk kuralları açıkken izinli başlıklar ve ilk parça kanun başlıkları, `K.` dâhil kapsam önbellekli kanun adları öğretir. Tam kanun/madde veya kararın kendi esas/karar numarası, birleştirme ve isteğe bağlı yeniden sıralamadan sonra belge sırasıyla en fazla üç konumu başa alabilir; diğer sonuçlar düzenini korur. Karar kimliği sıfırıncı parçanın ilk 300 karakterinde başlamalıdır. Sonraki alıntılar sayılmaz. Yalnızca AYM gibi mahkeme adları Anayasa’yı seçmez.

`retrieval_provenance.legal_items`, özgün parça konumlarıyla sürümlü öğeleri döndürür; SPO kayıtlarından ayrıdır ve birleştirme skoruna eklenmez. `MESA_LEGAL_RULES_ENABLED=false`, hukuki işlemeyi atlar, sonuç kopyalarındaki mevcut hukuki ekleri gizler ve genel aramayı açık tutar. Kalıcı anlık görüntüler/kimlikler saklanır.
