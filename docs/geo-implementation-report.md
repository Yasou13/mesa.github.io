# MESA GEO / AEO / SEO uygulama raporu

Tarih: **23 Ekim 2026**. Alan adı: https://mesamemory.dev/. Başlangıç commit’i: `caa63942c7cbbf373e286d1fd2144ad9a5319609`.

**Sonuç:** Rehber, MESA’nın açık kaynak yazılım / teknik dokümantasyon / eğitim sitesi yapısına uyarlandı. Kaynak şablonlar ve yayıma hazır `dist/` HTML’leri güncellendi, `_site/` üretildi. Bu rapor ilk yerel uygulama aşamasının kaydıdır; aşağıdaki testler sırasında henüz commit, push veya canlı yayın yapılmamıştı. Kullanıcının sonraki yayın talebi üzerine GitHub Pages dağıtımı başlatılacaktır; kesin yayın sonucu dağıtım kaydında ayrıca tutulur. Canlı başlangıç denetimi eski yayını; yerel testler yeni değişiklikleri değerlendirir. AI görünürlüğü veya trafik artışı ölçülmedi ve garanti edilmez.

## 1. Kapsam ve başlangıç

Framework değişikliği gerekmiyor: temel içerik, metadata ve navigasyon zaten statik HTML’de. EN/TR canonical/hreflang, sosyal metadata, sitemap, gerçek ürün sınırları, kısa yanıtlar, SSS, kaynak bağlantıları ve durum sayfaları mevcut. E-ticaret veya fiziksel yerel işletme olmadığı için Product/Offer/LocalBusiness verisi eklenmedi.

[Başlangıç envanteri](geo-audit-baseline.md), değişiklik öncesi **239 HTML’nin** URL, tür, indeksleme niyeti, başlık, açıklama, H1, canonical, Schema, önem, sorun, işlem ve doğrulamasını içerir. Bunların 200’ü sitemap rotası, 36’sı eski ders bağlantısı, 2’si yönetim sayfası ve biri 404’tür. Ana sayfalardan takip edilen iç bağlantılarda yetim public sayfa bulunmadı. Başlangıç `check_site.py` kontrolü PASS idi; aşağıdaki anlamsal sorunları kapsamıyordu.

Canlı başlıklarda Cloudflare ve GitHub Pages altyapısına ait izler görüldü. DNS, WAF kuralları, Search Console, Bing, GA4 ve gerçek bot loglarına yönetim erişimi bulunmuyor. Kaynakta analitik/doğrulama kodu görülmemesi, hesaplarda DNS doğrulaması bulunmadığı anlamına gelmez.

## 2. Uygulanan değişiklikler

| Öncelik | Dosya / şablon | Değişiklik ve neden | Etkilenen URL’ler | Kanıt |
|---|---|---|---|---|
| P0 denetim | HTTP, HTML, sitemap | Yerel public noindex, canonical ve JS-only içerik; canlı HTTP/canonical kontrolü | 200 EN/TR public rota | Yerel gate ve canlı GET kayıtları |
| P1 | `scripts/render_site.mjs` / `documentShell` | Site ve yazılım kimliğinin açıklaması EN/TR ana sayfa verisinden sabitlendi; kalıcı `@id` değerleriyle bağlı, sayfaya özel `WebPage` eklendi | 200 public rota; ortak kabuğu kullanan eski bağlantılar/404 | Sayfa adı, açıklaması, dili, canonical ve graph ilişkisi kontrolü |
| P1 | `scripts/render_docs.mjs`, `scripts/render_site.mjs` | Belge köklerinde kendine yinelenen breadcrumb kaldırıldı; görünür gezinme ve JSON-LD birlikte düzeltildi | `/docs/{core,data,law,qa,e2e}/` ve TR karşılıkları, 10 sayfa | Tekil adres, sıra, son canonical ve mobil kontrol |
| P1 | `scripts/render_site.mjs` / `hubBreadcrumb` | Boş path artık gerçek Home bağlantısı üretir; yanlış `aria-current` kaldırılır | Kaynak merkezi ve makaleler, iki dil | Tarayıcıda ana sayfa bağlantı hedefleri |
| P1 | `scripts/render_learn.mjs` | 14 dersin EN/TR künyesine mevcut yazar ve gerçek yayın tarihi eklendi; güncelleme tarihi değiştirilmedi | 28 ders sayfası | JS kapalı okuma, HTML/Schema tarih ve yazar eşleşmesi |
| P1 | `scripts/render_site.mjs` / makale Schema | Türkçe yazar adı görünür künye ile aynı; belgelerde kaynaktan doğrulanamayan genel yazar ataması kaldırıldı | Makaleler ve teknik belgeler | JSON-LD / görünür metin kontrolü |
| P1 | `scripts/render_site.mjs` / robots | Admin dışlama yolları deployment base path’e uyarlandı | Alt dizin GitHub Pages build’i | Gerçek domain robots çıktısı değişmedi; proje yolu build testi |
| P1 | `dist/docs.css` | Belge metnindeki bağlantılara alt çizgi eklendi; yalnızca renk ile ayrım sorunu giderildi | Teknik belgeler | EN/TR Core kökünde önce 5’er axe bulgusu, sonra 0 |
| P1 | `scripts/render_site.mjs`, `scripts/markdown_engine.mjs` | Kaydırılabilir tablolar odaklanabilir, EN/TR etiketli bölgeler oldu | Hub/makale ve Markdown belge tabloları | Statik gate; derslerin mobil axe taraması |
| P1 | `scripts/check_site.py`, `scripts/tests/test_seo.py`, `scripts/tests/markdown.test.mjs` | Public noindex/nosnippet, sitemap XML/tam URL kümesi/tekrar, arama bot erişimi, admin dışlama, WebPage/kimlik ilişkileri, breadcrumb, görünür yazar/tarih ve tablo odak kontrolü | Tüm build modları | 9 kasıtlı bozulma senaryosu reddedildi |
| P1 | `scripts/check_site.py` | Geçerli iç içe JSON’daki `}}` karakterlerini hatalı build token sayan kontrol düzeltildi; `{{` denetimi korundu | Ortak JSON-LD | Yeni graph ile tüm build’ler PASS |
| P2 hazırlık | `docs/geo/`, README ve doküman dizini | 40 soruluk ölçüm havuzu, boş sonuç şablonu, ölçüm ve 90 günlük içerik planı | Editoryal/operasyonel süreç | Şablonlarda sonuç satırı yok |

`dist/` altındaki HTML’ler kaynak şablonlardan yeniden üretildi. Yayın öncesi bundle kontrolünde, ortak Markdown tablo erişilebilirliği değişikliğinin `dist/admin.js` paketine de aktarılması gerektiği görüldü; paket mevcut kaynaklardan yeniden derlendi. Sayfa adresleri, başlıkları ve açıklamaları zaten benzersiz olduğundan yeniden yazılmadı. Mevcut kısa yanıtlar/SSS/kaynaklar korundu; yeni seri içerik üretilmedi. Şirket, fiyat, puan, müşteri, hukuk uzmanı veya sertifikasyon başarısı eklenmedi.

## 3. Önce / sonra

| Kontrol | Önce | Sonra |
|---|---:|---:|
| Public sitemap rotası | 200 | 200 |
| Toplam HTML | 239 | 239 |
| WebPage kimliği bulunan public sayfa | 0 | 200 |
| WebSite açıklaması ilgili dildeki ana sayfa kimliğinden farklı olan public sayfa | 198 | 0 |
| Yinelenen breadcrumb URL’si olan sayfa | 10 | 0 |
| Görünür ders künyesinde yazar ve yayın tarihi | Eksik | 28 ders sürümünde mevcut |
| Article yazarı sayfanın hiçbir yerinde görünmeyen kayıt | 18 | 0 |
| Article yayın/güncelleme tarihi `<time>` ile eşleşmeyen kayıt | 26 | 0 |
| İç referanslar | 15956 | 15994 |
| Dış referanslar | 2173 | 2173 |
| Teknik belge / ders mobil axe örneği | Bağlantı ayrımı ve tablo odak bulguları | 4 EN/TR örneğinde 0 ihlal |

Yazar/tarih sayıları farklıdır: önce bazı yazar isimleri ve tarihler makale gövdesinde tesadüfen görünüyordu. Şimdi ders başlığının altındaki künyede açıkça gösterilir. Kaynakta bulunan yayın/güncelleme tarihleri SEO çalışmasının tarihiyle değiştirilmedi; sitemap’e sahte `lastmod` eklenmedi.

## 4. Test raporu

| Komut / kontrol | Sonuç | Sınır / kanıt |
|---|---|---|
| `npm test` | PASS: 18 Python + 27 Node testi | Negatif sync testlerindeki beklenen ERROR/WARN kayıtları test başarısızlığı değildir. [Tam log](geo/evidence/tests.log) |
| `python3 scripts/build_site.py --output _site --site-url https://mesamemory.dev/ --verify-articles` | PASS | Makale kaynak eşleşmesi dahil |
| `python3 scripts/check_site.py _site` | PASS: 200 rota, 239 HTML, 15994 iç / 2173 dış referans | Başlık, açıklama, H1, lang, canonical, hreflang, link/anchor, yeni SEO kontrolleri |
| `python3 scripts/check_public_artifact.py _site` | PASS: 258 metin artifact’i | Tanınan ayrıcalıklı kimlik bilgisi bulunmadı; genel güvenlik sertifikası değildir |
| `python3 scripts/build_site.py --output /tmp/mesa-geo-project --repository Yasou13/mesa.github.io` ve `check_site.py` | PASS | Alt dizin canonical/asset/robots uyumu |
| `python3 scripts/build_site.py --output /tmp/mesa-geo-user --repository Yasou13/Yasou13.github.io` ve `check_site.py` | PASS | Kullanıcı sitesi kök yolu |
| `node scripts/tests/learn_browser.mjs http://127.0.0.1:8765/` | PASS: 90 görünüm, 36 eski ders bağlantısı | 320/768/1440 px, EN/TR, arama, filtre, ilerleme/devam, alıştırma, JS kapalı okuma. [Kayıt](geo/evidence/learn-browser.json) |
| Ek Chrome/CDP kontrolü | PASS: 42 görünüm | EN/TR 5 belge kökü, kaynak merkezi, örnek ders; 320/768/1440 px, breadcrumb/Home hedefleri, taşma ve JS kapalı künye. [Kayıt](geo/evidence/browser.json) |
| axe-core WCAG 2 A/AA + 2.1 AA örneği | PASS: 4 sayfa, 0 ihlal | EN/TR `/docs/core/` ve `/learn/what-is-ai-memory/`, 390 px. Tam site erişilebilirlik sertifikası değildir |
| `node --check` değişen renderer/Markdown modülleri; `python3 -m compileall -q scripts`; `git diff --check` | PASS | Sözdizimi ve whitespace |

Ek CDP taraması geçici `/tmp/mesa_geo_browser.mjs` ile yürütüldü; gözlemleri kalıcı JSON’a aktarıldı. Standart ders testi depoda kalıcıdır. [TR 320 px künye](../../review/geo/tr-lesson-320.png) ve [EN 320 px künye](../../review/geo/en-lesson-320.png) görsel olarak incelendi; taşma görülmedi.

Mobil menü, ders araması, genel aramada bölüm bağlantısı, okundu işareti, kaldığı yerden devam ve JS kapalı ders gezinmesi mevcut tarayıcı testleriyle doğrulandı. Admin ve erken erişim akışlarının kaynak kodu değiştirilmedi. Gerçek kullanıcı LCP/INP/CLS ölçülmedi; yerel ekran görüntüsü veya axe sonucu Core Web Vitals saha kanıtı olarak sunulmaz.

## 5. Canlı site doğrulaması

23 Ekim 2026 tarihinde yapılan salt okunur HTTP GET taraması:

- Ana sayfa, robots.txt ve sitemap.xml: **200**.
- Canlı sitemap’in **200/200 URL’si 200**; canonical kendi URL’siyle eşleşiyor. Public HTML’de robots veya HTTP başlığında engelleyici noindex saptanmadı.
- Var olmayan `/this-route-does-not-exist-geo-audit/`: **404**.
- HTTP ve `www` ana sayfa varyasyonlarının son hedefi HTTPS non-www ana sayfa. Ara yönlendirme durumları bu kayıtta tutulmadı.
- Örnek eski ders URL’si HTTP 200 + HTML canonical hedefi + noindex davranışında; tarayıcıda hedef derse geçiş doğrulandı. Bu **HTTP 301 değildir**; mevcut Pages uyumlu davranış korundu.
- Robots: genel izin; `/admin/` ve `/tr/admin/` dışlanmış. Eğitim botları için mevcut genel politika korunmuştur. User-agent taklidiyle WAF erişimi kanıtlanmadı, güvenlik bypass’ı eklenmedi.

[204 HTTP örneğinin kaydı](geo/evidence/live-http.json), tarama anını temsil eder. 200 yanıt almak Google/Bing tarafından indekslendiğini veya gerçek arama botunun WAF’tan geçebildiğini kanıtlamaz. Yeni kod henüz canlıya gönderilmediği için canlıda yeni Schema/künye doğrulandığı iddia edilmez.

## 6. Ölçüm planı ve kullanılacak şablonlar

[query-pool.csv](geo/query-pool.csv): **20 niyetin EN/TR karşılıkları, toplam 40 soru**; markalı/markasız ayrımı, hedef URL ve doğruluk kriteri. Tanım, seçim/karşılaştırma, entegrasyon, uygunluk/lisans, kaynak izi, veri yetkisi, değerlendirme ve hukuk verisi bağlamını kapsar. Rakip adları veya karşılaştırmalı üstünlük uydurulmadı.

[results-template.csv](geo/results-template.csv): yalnızca başlık satırı. AI test yanıtı henüz toplanmadı.

1. **İlk hafta — sahip:** Search Console/Bing mülk erişimini doğrulayın; `https://mesamemory.dev/sitemap.xml` gönderimini ve indeksleme raporunu kontrol edin. Ana sayfa, Core hızlı başlangıç, örnek ders, About, FAQ ve TR karşılıkları için URL Inspection kullanın. Güncel ve beklenen canonical/HTML karşılaştırmasını yayın sonrası tekrarlayın.
2. **Haftalık — geliştirici:** Build gate, yeni yanlış noindex, sitemap kapsamı, 404/5xx, gerçek bot engelleri ve kaynak sürümü doğruluğu. CDN/WAF log erişimi varsa sağlayıcının resmî doğrulamasıyla bot erişimini inceleyin; user-agent tek başına kanıt değildir.
3. **Aylık — içerik sahibi:** Search Console Web performansını ve hesapta sunulan Search Generative AI raporunu ayrı kaydedin. Raporun dünya genelinde açılımı [3 Haziran 2026 tarihli ve 31 Ağustos güncellemeli resmî duyuruda](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports) belirtilir; MESA hesabına erişilmedi, veri varlığı doğrulanmadı. Bing AI Performance’da atıf sayıları ve atıf alan URL’leri kaydedin; [resmî önizleme açıklamasındaki](https://blogs.bing.com/webmaster/2026/2/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview/) örnekleme ve toplulaştırma sınırlarını koruyun.
4. **Aylık — manuel sorgu testi:** ChatGPT Search, Google AI deneyimleri, Perplexity ve Copilot için erişilebilir yüzeylerde aynı havuzu çalıştırın. Tarih, ülke, dil, model/yüzey, oturum koşulları ve cevap kanıtını kaydedin. Çalıştırılmayan/yanıtsız soruları boş bırakın; sıfır başarı gibi saymayın.
5. **Oranlar:** Marka anılma / kaynak gösterilme / önerilme için ilgili geçerli test yanıtları payda olur. Önerilme oranında yalnızca seçenek önerme niyeti olan sorular kullanılır. EN/TR ve markalı/markasız ayrı raporlanır. Marka tanımının doğruluğu sürüme sabitlenmiş kaynak ve `/status/` sınırlarıyla karşılaştırılır. Bunlar örneklem ölçümüdür, platformun genel pazar oranı değildir.
6. **Trafik/dönüşüm — ONAY_GEREKLI:** Mevcut izinli analitik varsa AI referrer oturumları, hızlı başlangıç etkileşimi ve sunucuda başarıyla kabul edilen erken erişim taleplerinin toplu sayısı incelenir. Form tıklaması tamamlanan talep sayılmaz. Referer kaybı görünmez trafik yaratabilir. Yeni GA4/GTM, çerez, dış hesap veya kişisel veri aktarımı bu çalışmada kurulmadı. Ölçüm için e-posta/mesaj gövdelerini CSV’ye taşımayın.
7. **Üç aylık:** Aynı soru havuzu, sayfa bazlı trafik/atıf ve nitelikli talep verilerini karşılaştırın. Hesapta görülen artışı tek başına bu kod değişikliğine nedensel olarak atfetmeyin.

## 7. Yapılmayanlar / sahip işlemleri

| İş | Durum ve net sonraki adım |
|---|---|
| Canlıya yayın | Yerel kod ve `dist/` hazır. Mevcut GitHub Pages sürecinde yayımlayın; ardından canlı HTML/Schema ve URL Inspection tekrar kontrol edilir. |
| Search Console/Bing doğrulama, gerçek indeks, atıf ve sıralama | **ONAY_GEREKLI / hesap erişimi.** Sahip mevcut mülkü kontrol eder; gerekli resmi doğrulama değeri sağlanmadan placeholder meta eklenmez. |
| CDN/WAF/DNS | **Erişim gerekli.** Cloudflare başlığı konfigürasyon erişimi değildir. Gerçek bot engelleri sağlayıcının resmî doğrulamasıyla incelenir; geniş bypass yapılmaz. |
| AI eğitim bot tercihi | **ONAY_GEREKLI.** GPTBot/ClaudeBot/Google-Extended politikası değiştirilmedi. Arama erişimiyle ayrı değerlendirilir. |
| Ayrı staging indeksleme politikası | Mevcut repo çoklu URL build’i yapabiliyor; public staging kurulmadı. İleride sunucu erişimi veya noindex ve sitemap dışlama politikası ortam özelinde seçilmeli. |
| 301 yönlendirmesi | Mevcut 36 eski ders yolu korundu. Gerçek 301 istenirse hosting/edge düzeyinde sahip onaylı yönlendirme planı gerekir. |
| Gerçek saha performansı ve Rich Results/Schema Validator | Yayın sonrası PageSpeed/CrUX ve resmî doğrulayıcılarla manuel kontrol. Burada JSON ayrıştırma ve içerik eşleşmesi doğrulandı; dış validator başarısı iddia edilmedi. |
| Hukuki içerik ve gizlilik | Mevcut hukuk rehberinin içeriği değiştirilmedi. Yeni hukuki değerlendirme, uzman imzası veya gizlilik metni için yetkili inceleme gerekir. Erken erişim verisi için sahip onaylı politikanın yeterliliği ayrıca değerlendirilir. |
| Fiyat, şirket, adres, ekip, müşteri örneği | Kaynakta doğrulanmış yeni veri yok; **ONAY_GEREKLI**. Şema veya görünür metne tahmini bilgi konmadı. |
| `llms.txt`, özel AI Schema, otomatik içerik bandı | Somut entegrasyon ihtiyacı yok. [Google’ın AI özellikleri rehberi](https://developers.google.com/search/docs/appearance/ai-features) özel dosya veya AI Schema gerektirmediğini belirtiyor; eklenmedi. |

## 8. 90 günlük içerik ve otorite planı

| Dönem | Küme / somut teslimat | Yayın öncesi kanıt / sorumlu |
|---|---|---|
| Gün 1–15 | Hesap erişimi, indeks/atıf/organik başlangıç, 40 sorgunun ilk ölçümü | Sahip + geliştirici; sonuçlar gerçek cevap kanıtıyla kaydedilir |
| Gün 16–30 | Kurulum/entegrasyon: kilitli yerel kurulumun birinci el yürütümü; Core hızlı başlangıç ve MCP rehberinde karşılıklı yararlı bağlantılar | Sürüm/komut/ortam kaydı; geliştirici editör |
| Gün 16–30 | Yetki ve kaynak izi: küçük açık/sentetik veriyle bir erişim sınırı ve kaynak pasajı örneği | Tekrarlanabilir fixture, beklenen sonuç, sınırlamalar; güvenlik sorumlusu incelemesi |
| Gün 31–60 | Retrieval: mevcut `/research/keyword-vs-semantic-search/` planı ve `/methodology/retrieval-evaluation/` üzerinden özgün deney | Dondurulmuş veri, sorgu/etiketler, nDCG/MRR/latency yöntemleri, donanım, kod/commit; sonuç yoksa plan olarak kalır |
| Gün 31–60 | Ürün seçimi: vektör arama / kalıcı hafıza / RAG sınırlarını aynı gerçek kullanıcı senaryosunda açıklayan gözden geçirilmiş örnek | Adil ölçütler, lisans/kurulum/işletim maliyetinin gerçek koşulları; doğrulanmamış rakip fiyatı veya üstünlük yok |
| Gün 31–60 | Hukuk referans yolu: örnek bir kaynağın Data → Core → Law izlenebilirlik kaydı | Kaynak lisansı, uzman incelemesi, entegrasyonun gerçek durumu; hukuk uzmanı onayı olmadan hukuki sonuç yok |
| Gün 61–90 | Kaynakla desteklenen kurulum ve araştırma sonuçlarını ilgili geliştirici topluluklarına sunulacak taslağa dönüştürme | Gerçek kayıtlar, uygun kaynak/lisans; dış paylaşım sahibi tarafından yapılır |
| Gün 61–90 | Aynı soru havuzunu yeniden çalıştırma; EN/TR konu kapsamı, atıf, doğruluk ve dönüşüm karşılaştırması | Başlangıçla tutarlı koşullar; ölçüm sınırları ve sonraki çeyrek öncelikleri |

Mevcut kaynakları geliştirin; her soru varyasyonuna yeni sayfa açmayın. Araştırma planı sonuç değildir, package release sertifikasyon değildir. Bu plan içerik yayınlandığını veya deneylerin yürütüldüğünü ifade etmez.

## 9. Risk ve geri dönüş

- **Görsel etki:** Ders künyesi mobilde birkaç satır uzar; tabloya klavye odağı ve belge bağlantılarına alt çizgi eklenir. Mevcut tasarım korunur. EN/TR 320 px görüntüleri incelendi.
- **Robots:** Üretim domain’inde çıktı aynı; alt dizin artifact’inde admin yolunun yanlış köke uygulanması giderildi. Robots güvenlik mekanizması değildir; Auth/RLS değişmedi. GitHub proje alt yolundaki robots dosyasının origin kökündeki politikayı yönetmediği unutulmamalı.
- **Metadata:** Mevcut sayfa canonical/title/description/hreflang ve URL’ler korundu; kimlik grafiği düzenlendi. İndekslenme veya zengin sonuç garantisi yok. [Google yapılandırılmış veri ilkeleri](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) görünür içerikle uyum gerektirir.
- **Geri dönüş:** Bu çalışmanın `scripts/render_site.mjs`, `render_docs.mjs`, `render_learn.mjs`, `markdown_engine.mjs`, `check_site.py`, ilgili testler ve `dist/docs.css` farklarını birlikte geri alın; ardından `node scripts/render_site.mjs --output dist --site-url https://mesamemory.dev/` çalıştırıp production/project/user kontrollerini tekrarlayın. Yayınlanmışsa önceki başarılı Pages artifact’i de geri dönüş seçeneğidir. Kullanıcının başka değişikliklerini topluca sıfırlamayın.
- Veritabanı, ödeme, giriş, kişisel veri ve izin ayarları değiştirilmedi; yeni bağımlılık veya izleyici kurulmadı. Önceden mevcut `review/` dosyaları korunmuştur.

## 10. Başarı iddialarının sınırı

Kod ve test çalışmaları tamamlandı; yayına alma ve hesap erişimi gerektiren ölçümler ayrıdır. Yapay zekâdan gerçek atıf, önerilme, dönüşüm veya sıralama sonucu **ölçülmedi**. Mevcut canlı yayının 200 HTTP yanıtları ve yeni kodun yerel test başarısı, gelecekteki arama görünürlüğünü kanıtlamaz.
