# MESA Türkçe yazım ve terim rehberi

Türkçe sayfalar, İngilizce cümleleri sözcük sözcük izlemek yerine aynı teknik
anlamı doğal Türkçeyle anlatır. Kısa, tamamlanmış cümleler kullanın. Okura bir
kavramı açıklarken doğrudan ne yaptığını söyleyin. Düğmelerde kısa eylemler,
rehberlerde tutarlı olarak “siz” dili kullanın. MESA adını marka olarak koruyun.

“Engellenen kapılar”, “arayüz yüzeyleri”, “sözleşmeyi tüketmek” ve “kanıtla inşa
etmek” gibi İngilizceden taşınan kalıpları kullanmayın. Bağlama göre “tamamlanamayan
kontroller”, “arayüzler”, “API’yi kullanmak”, “bir sistem kurmak” gibi açık ifadeler
seçin. “Scoped” sözcüğünü “kapsamlı” diye çevirmeyin: yetki veya veri sınırını anlatır.

| Kavram | Türkçe kullanım |
| --- | --- |
| memory | hafıza |
| evidence | kanıt; metindeki dayanağı anlatırken dayanak pasajı |
| provenance | kaynak izi |
| retrieval | arama; bağlama göre ilgili bilgiyi bulma veya getirme |
| assertion | bilgi kaydı; API alanıysa özgün ad |
| source chunk | kaynak metin parçası |
| revision | belge sürümü |
| graph | çizge |
| graph path | çizge yolu, bağlantı yolu |
| canonical store | ana kayıt deposu; açıklamada asıl kayıtların tutulduğu yer |
| projection | arama görünümü; gerektiğinde asıl kayıttan türetilen görünüm |
| embedding | ilk kullanımda sayısal temsil (embedding); ardından sayısal temsil |
| lexical search | sözcük tabanlı arama |
| semantic search | anlamsal arama |
| hybrid retrieval | hibrit arama |
| rank fusion | sıralama birleştirme |
| reranker | yeniden sıralayıcı |
| scope | kapsam; erişim anlatılıyorsa erişim kapsamı |
| tenant | ilk kullanımda üst erişim alanı (tenant); ardından üst erişim alanı |
| principal | erişim kimliği |
| workspace | çalışma alanı |
| dataset | veri kümesi |
| admission | isteğin kabulü; işin tamamlanmasıyla karıştırmayın |
| mutation | değişiklik işlemi; API alanıysa özgün ad |
| idempotency | güvenli tekrar; aynı işlemin tekrarında sonucun değişmemesi |
| rollback | geri alma |
| purge | kalıcı silme |
| replay | yeniden yürütme |
| fixture | test örneği |
| benchmark | karşılaştırmalı test; sayısal sonuç varsa performans ölçümü |
| ground truth | bağımsız doğrulama verisi; bağlama göre doğru kabul edilen yanıtlar |
| gate | doğrulama adımı, zorunlu koşul veya kontrol |
| blocked | eksikler nedeniyle bekliyor / tamamlanamıyor |
| fail closed | doğrulanamayan koşulda işlemi durdurma |
| production readiness | canlı kullanıma hazırlık |
| reproducibility | tekrarlanabilirlik |
| release | paket/kod için sürüm, yayımlama eylemi için yayın |

## Aynen korunacak içerik

Kod örnekleri, komutlar, API yolları, alan ve durum adları (`COMMITTED`, `PASS`,
`NO-GO` gibi), sürüm numaraları, kaynak kimlikleri, URL’ler ve resmî araştırma
başlıkları değiştirilmez. MESA bileşenlerinin ve SQLite, LanceDB, Kùzu, MCP,
Python gibi ürünlerin adları korunur. Teknik İngilizce terim gerekiyorsa ilk
kullanımda Türkçe açıklamasıyla birlikte verilir.

Dokümantasyondaki özgün kaynak eki, alıntı doğruluğu için kendi dilinde tutulur;
Türkçe rehberden ayrı ve açıkça etiketlenir. Kaynak eşitleme sırasında Türkçe
başlıkların geri dönmemesi için `content/docs/sources.json` da güncellenir.
Makaleler değiştiğinde hub, indirilebilir Markdown ve SQL başlangıç verisi
`sync_articles.py --from-hub` ile birlikte üretilir.
