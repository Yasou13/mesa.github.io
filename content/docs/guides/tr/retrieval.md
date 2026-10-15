## Dört farklı sinyal

Vektör kanalı uyumlu anlamsal temsilleri karşılaştırır. BM25, FTS5 pasaj/kanıt metnini ve kapsamlı atıf aramasını kullanır. Assertion kanalı predicate, subject, object/literal ve kanıtı değerlendirir. Çizge kanalı, kanıtla desteklenen sınırlı yollar katkılar. Yetkili kanonik sahiplik ve uygunluk, sıralama katkısından önce çözülür.

## Sıra birleştirme; olasılık değil

Varsayılanlar: k=60, dört ağırlık=1.0, sıralar 1’den başlar. Tekrarlanan hit bir kanalda tek oy verir. RRF(c)=Σ w/(k+rank). Kanal içi atıf artırımları kanal sırasını değiştirir; doğrudan RRF’ye eklenmez. Birleştirmeden sonra ayrı, sorguya bağlı hukuk katsayısı uygulanır. Ayrımı ve örnek hesaplayıcıyı [retrieval açıklamasında](retrieval/) inceleyin.

## Sınırlı çizge ve bağlam

Çizge dolaşımı sınırlıdır: en fazla 20 başlangıç düğümü, üç hop, 500 istenen graph hit, 64 frontier, düğüm başına 32 fan-out ve varsayılan 15 saniyelik istek zaman aşımı. Bunlar kaynak sınırlarıdır; gecikme garantisi değildir. Bağlam, varsayılan 2048 token biçimlendirilmiş kanıt bütçesi ve tek arama kullanır. İsteğe bağlı adaptive mod kapsamı genişletmeden en fazla bir planlayıcı çağrısı ve iki ek arama yapar.
