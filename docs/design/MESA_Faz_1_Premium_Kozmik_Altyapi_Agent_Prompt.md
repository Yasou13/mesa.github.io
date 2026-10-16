# MESA — FAZ 1: PREMIUM KOZMİK TASARIM ALTYAPISI

## GÖREV VE YETKİ

Sen bu repoda çalışan **Principal Frontend Engineer + Creative Director + Senior UI/UX Designer + Visual QA Engineer** rolündesin.

Görevin **mevcut MESA web sitesini**, sonradan eklenecek sinematik kara delik, uzay yolculuğu, video ve etkileşimli görseller için hazır hâle getirirken, **bugünden itibaren tasarım ve kullanım açısından belirgin biçimde iyileştirmektir**.

Bu çalışma **FAZ 1 / Görseller Öncesi Altyapı ve Tasarım Dönüşümü**dür.

**Kritik kural: Bu fazda kullanıcı henüz gerçek fotoğraf, video, kara delik render'ı veya 3D sahne sağlamadı.** Bunları oluşturmuş gibi davranma. İnternetten rastgele bulduğun görselleri, film karelerini veya lisanssız içerikleri yerleştirme. Sahte görseller ve kırık asset path'leri üretme. Sonraki fazın işini bu fazda bitirmeye çalışma.

Önce repo gerçeklerini incele; teknoloji, rotalar, içerik ve görsel düzen hakkındaki kararlarını somut bulgulara dayandır. Eğer repoda `MESA_Kozmik_Web_Deneyimi_Uretim_Plani.md` veya eşdeğer kozmik tasarım planı bulunuyorsa oku ve onunla tutarlı ilerle. Bulunmuyorsa burada verilen kapsam kendi başına yeterlidir; dosya yok diye işi durdurma.

---

## 0 — GIT VE GÜVENLİ BAŞLANGIÇ

1. `git status`, mevcut branch, proje komutları ve deployment düzenini incele.
2. Kullanıcının commit edilmemiş işlerini koru; hiçbir dosyayı körlemesine silme veya üstüne yazma.
3. Güvenliyse `design/mesa-cosmic-foundation` isimli yeni çalışma branch'i oluştur. Aynı isim varsa çakışmayı güvenli şekilde çöz.
4. Önce bağımlılıkları ve mevcut mimariyi değerlendir. Sırf tasarım için framework değiştirme; büyük çaplı yeniden yazım yapma.
5. Mantıklı çalışma paketlerinin sonunda ayrı commit'ler oluştur.
6. **Push, merge, production deploy veya yayınlama yapma.**

---

## 1 — MEVCUT SİTENİN EKSİKSİZ DENETİMİ

Başlamadan önce bütün gerçek sayfaları, navigasyonu ve bağlantıları keşfet. Özellikle mevcutsa:

- Homepage
- MESA Core
- MESA Data
- MESA Law
- Learn
- Documentation
- QA / E2E tanıtımları
- About / ecosystem / contact ve diğer rotalar

Bu isimler kontrol listesi niteliğindedir: **repoda olmayan rotaları sırf bu listede bulunduğu için oluşturma.**

Denetle:

- Hero, section sıralaması, içerik tekrarı, CTA'lar
- Sayfa bazında görsel hiyerarşi
- Tekrarlanan kart/grid kalıpları
- Tipografi, renk, boşluk ve ikon tutarsızlıkları
- Header/footer ve mobil navigasyon
- Türkçe/İngilizce dil değişimi ve her iki dilde içerik
- Gerçek linkler, kırık linkler, boş veya yanlış hedefler
- SEO metadata, social preview, semantik HTML
- Responsive durum, erişilebilirlik, performans
- Deployment özelliği: GitHub Pages ve base path / routing davranışı (mevcutsa)
- Mevcut çalışan etkileşimler, testler ve entegrasyonlar

Mümkünse değişiklik öncesi masaüstü/mobil ekran görüntüleri al. Tarayıcı yoksa bunu açıkça kaydet; kod incelemesini görsel denetim diye sunma.

Çıktı: `docs/design/01_SITE_AUDIT.md` (en önemli sorunlar, korunacaklar, önceliklendirme).

---

## 2 — SANAT YÖNETİMİ: “ORDER FROM CHAOS”

Onaylanan konsept: **Kaosun İçindeki Düzen / Order from Chaos**.

Sitenin görsel dili, uzayın büyük ölçeğini ve bilgi ilişkilerinin kaostan düzene dönüşmesini anlatacak. Gelecek fazda Interstellar'daki Gargantua'yı *andıran fakat tamamen özgün* bir kara delik açılışı kullanılacak; scroll ilerledikçe kullanıcı uzayda yavaşça geziniyormuş gibi hissedecek; yıldızlar ve kozmik ilişkiler giderek MESA'nın gerçek veri/retrieval mimarisine bağlanacak.

**Bu fazda sahnelerin medya içeriğini üretme veya taklit etme.** Yalnızca görsel sistemini ve yerleşim altyapısını oluştur.

Başlangıç paleti (nihai görseller geldikten sonra ayarlanabilir):

- `#050508` — kozmik siyah, temel arka plan
- `#11131B` — derin ikinci yüzey
- `#E8EAF0` — ana tipografi
- `#8B9CCB` — sınırlı soğuk ışık
- `#9B8ACB` — son derece sınırlı atmosferik vurgu
- `#D5AE82` — ölçülü kehribar/altın vurgu

Bu değerleri mevcut uygun token/CSS variable sistemine uyumlu tanımla; her dosyaya tekrar tekrar gömme.

Hedef estetik: **sinematik, karanlık, sakin, editoryal, rafine, teknik ve özgün.**

Kaçınılacaklar:

- Parlak oyun / bilimkurgu HUD tasarımı
- Aşırı neon, glow, gradient, glassmorphism
- Her yerde yuvarlatılmış kartlar ve üçlü grid
- Alakasız uzay ikonları, emoji, sahte yıldız yağmuru
- Yalnızca görsel farklılık uğruna karmaşık layout
- Gerçek ürün bilgisinin yerine geçen soyut metinler
- Ürünün kuantum hesaplama kullandığı yönünde yanlış iddialar

---

## 3 — GÖRSEL SİSTEMİ PROFESYONELLEŞTİR

Mevcut yapıya uygun ve gereksiz soyutlama içermeyen temel tasarım sistemini oluştur veya iyileştir:

- Design tokens: renk, tipografi, spacing, container genişliği, border, radius, motion, breakpoints
- Başlık/gövde/teknik etiket/CTA tipografi hiyerarşisi
- Tutarlı header, nav, footer, buton, link, badge, kart ve form stilleri
- Tutarlı SVG ikon stili; rastgele ikon ailelerini karıştırma
- Hover, focus-visible, active, disabled durumları
- Kontrast ve okunabilirlik
- Masaüstü ile mobil için ayrı düşünülmüş kompozisyonlar

Instrument Serif varsa yalnızca seçici vurgular için kullan; teknik alanlarda daha işlevsel tipografi kullan. Yeni font sayısını gereksiz artırma.

Site **medya gelmeden önce bile**, boş veya taslak bir sayfa gibi değil; tutarlı ve rafine bir web sitesi gibi görünmeli. Bunun için çok koyu, temiz yüzeyler, doğru tipografi ve ince kontrast katmanları kullanabilirsin. Ancak **CSS ile ucuz sahte kara delik, neon halkalar veya yoğun parçacık efektleri yaratma.**

---

## 4 — SAYFA YERLEŞİMLERİNİ YENİDEN DÜZENLE

Mevcut işlevsel içeriği koruyarak kompozisyonu geliştir.

### Homepage

- Hero, güçlü tipografi ve ileride gelecek **kara delik görseli için güvenli, dengeli negatif alan** içermeli.
- Masaüstünde geniş görsel alan planla; kara deliğin muhtemel sağ ağırlıklı kompozisyonuna göre metni konumlandır, ama ileride değişebilir kıl.
- Mobil hero kompozisyonunu ayrıca tasarla: metin görselin altında kaybolmasın.
- Birbiri ardına aynı görünüşte section'lar oluşturma.
- Bölümleri hikâye akışına göre yeniden düzenle: problem → yaklaşım → ekosistem → MESA in Action → öğrenme/keşif/CTA. Mevcut içerik gerçeğine göre uyarlama yap.
- Homepage'i gereksiz uzatma; aynı mesajı tekrarlayan bölümleri içerik kaybı yaratmadan birleştir veya sadeleştir.
- **MESA in Action** ana sayfanın somut ürün ve teknik anlatım merkezi olmalı; ilerideki kozmik ağdan gerçek retrieval akışına geçiş için uygun bir görsel alanı bulunmalı.
- Gerçek ürün teknolojisini kaynaksız değiştirme, özelliği uydurma, sayısal başarı iddiası icat etme.

### Diğer sayfalar

Her gerçek sayfanın amacına uygun ayrı bir kompozisyon kur:

- Core: yapı/ilişkiler, teknik doğruluk
- Data: veri akışı ve kaynaklar
- Law: kanıt, güven, hukuki kaynak; sakin editoryal yaklaşım
- Learn: eğitim odaklı içerik ve keşfedilebilirlik; mevcut doğru bilgiyi koruyarak düzenleme
- Docs: yüksek okunabilirlik ve hızlı gezinme; gösterişli sahne yok

Bu sayfaları aynı hero + aynı 3 kart şablonuyla çoğaltma. Kozmik kimliği ortak tipografi, renk, ölçü ve görsel ritimle hissettir; her sayfaya kara delik koyma.

---

## 5 — SONRADAN GELECEK GÖRSELLER İÇİN MEDYA YUVASI HAZIRLA

Bu fazın kritik teknik çıktısı, ileride verilecek gerçek dosyaların kodu kırmadan yerleştirilebilmesi.

### Planlanan anlatı (5 sahne)

1. `event-horizon`: Açılış, kara delik ve MESA hero
2. `flyby`: Kara deliğin yanından ağır geçiş ve problem anlatımı
3. `deep-space`: Derin uzay ve ekosisteme geçiş
4. `connections`: Yıldızlardan ilişkilere geçiş
5. `structure`: MESA in Action / gerçek teknik mimari

**Bu fazda 3D kamera yolculuğunu, kara delik shader'ını, scroll-video scrubbing'i ve kompleks yıldız animasyonunu UYGULAMA.** Bu unsurlar henüz görseller ve teknik prototip seçilmeden yapılırsa pahalı bir yeniden çalışma doğurur.

Bunun yerine:

- Mevcut framework'e uygun, basit ve genişletilebilir **media/background layer** düzeni kur.
- Okunabilir gerçek HTML içerik katmanını medya katmanından ayır.
- Dekoratif katmanların linklere, scroll'a ve klavye erişimine engel olmamasını sağla.
- Sahne/section sınırlarını semantik olarak belirle; ileride scroll ilerlemesini bunlara bağlamak mümkün olsun.
- Medya yokken uygun statik koyu yüzey göster; **olmayan dosyalara `<img>`, `<video>` veya import ile referans verme**.
- Poster, mobil görsel ve video geldiğinde değiştirilebilir bir yapı tasarla; gerekiyorsa küçük bir manifest veya config kullan.
- Masaüstü/mobil crop, overlay opacity, focal point, `object-fit`, aspect ratio ve metin güvenli alanlarını tasarım kararları olarak belgeye yaz.
- Scroll hikâyesini destekleyecek akış/mesafe mantığını planla ama sahne yokken kullanıcıyı uzun, boş `100vh` panellere mahkûm etme.
- Reduced-motion, video hata/yüklenememe ve düşük performans alternatiflerinin yaklaşımını belirle.
- **Three.js, GSAP, R3F, ağır animasyon kütüphanelerini bu fazda sırf ileride lazım olabilir diye yükleme.** Mevcut projede zaten kullanılan bir teknoloji varsa bozmadan değerlendir.

Üretim dosyaları için beklenen sözleşmeyi açıkça dokümante et. Örnek hedef dosyalar (şimdi oluşturulmayacak):

- `blackhole-hero-poster.webp`
- `blackhole-idle-web.webm` / `.mp4`
- `blackhole-mobile.webp`
- `blackhole-flyby-keyframe.webp`
- `deep-space.webp`
- `cosmic-connections.webp`
- `structured-universe.webp`

**İsimler sözleşme taslağıdır, dosyalar mevcutmuş gibi davranma.** Bu plan görseller geldiğinde gerçek adlarına uyarlanabilir olmalı.

Çıktı:

- `docs/design/02_ART_DIRECTION.md`
- `docs/design/03_SCENE_STORYBOARD_AND_ASSET_CONTRACT.md`

Asset contract içinde sahne bazında: amaç, format, önerilen kadraj, masaüstü/mobil varyant, metin için güvenli alan, katman sırası, fallback, gelecekteki scroll etkileşimi ve entegrasyon noktası bulunsun.

---

## 6 — FONKSİYON KORUMA VE DİL DESTEĞİ

Mevcut:

- Rotaları, linkleri, anchor'ları, navigasyonu
- Türkçe ve İngilizce dil seçimini ve içerik eşleşmesini
- Formları, CTA'ları, dokümantasyon ve Learn bağlantılarını
- SEO etiketlerini ve semantik yapıyı
- GitHub Pages / mevcut hosting uyumunu

koru veya tespit edilen gerçek hataları düzelt.

Dil dosyaları varsa doğru biçimde güncelle. Sadece bir dilde görünen yeni metin ekleme. Türkçe/İngilizce kelime uzunluğu farklarında bozulma olmadığını kontrol et.

Harici URL'leri, MESA iddialarını ve teknik mimariyi tahmin ederek değiştirme. Doğrulanamayan bir özelliği pazarlama vaadi gibi yazma.

---

## 7 — RESPONSIVE, ACCESSIBILITY VE PERFORMANS

Aşağıdaki genişliklerde test et: **320, 390, 768, 1024, 1440, 1920 px**.

Özellikle:

- Mobil menü
- Başlık satır kırılımları
- Hero güvenli metin alanı
- Yatay taşma olmaması
- Dokunmatik hedefler
- Klavyeyle gezinme ve belirgin focus
- Kontrast ve heading hiyerarşisi
- `prefers-reduced-motion`
- Layout shift / CLS
- Gereksiz JS ve CSS yükü

Mevcut özellikleri bozmadan kaliteyi yükselt. Medya gelmeden yapay Lighthouse başarısı iddia etme.

---

## 8 — GERÇEK TARAYICIDA GÖRSEL QA DÖNGÜSÜ

Uygulama sonunda mümkünse gerçek tarayıcıda bütün önemli rotaları aç ve masaüstü/mobil ekran görüntülerini incele.

Özellikle kontrol et:

- Premium his ve görsel tutarlılık
- Monoton/kopyalanmış section yapıları
- Hero kadrajının gelecekteki kara deliğe uygunluğu
- Medya yokken boş alan ve anlamsız placeholder olmaması
- MESA in Action'ın görsel olarak güçlü olması
- Grid/boşluk/tipografi dengesi
- Menü ve footer
- İki dil
- Responsive ve etkileşim hataları

Bulgulara göre düzelt, tekrar görüntüle. Çalışan kodu görsel kalite doğrulaması sayma.

Tarayıcı aracı yoksa öz değerlendirme sınırını belirt; screenshot üretmiş veya gözle test etmiş gibi yazma.

---

## 9 — TESTLER, COMMIT'LER VE FİNAL RAPOR

Projede geçerli olan build, lint, typecheck, test ve link doğrulama komutlarını çalıştır.

- Mevcut testleri kapatma veya silme.
- Yalnızca bu tasarım çalışmasıyla ilişkili değişiklikleri yap.
- Kritik hata varsa düzelt; doğrulanamayanları açıkça raporla.
- Büyük fazlardan sonra anlamlı commit'ler at.
- Git çalışma ağacının son durumunu bildir.

Son rapor:

`docs/design/04_PHASE1_IMPLEMENTATION_REPORT.md`

Şunları içersin:

1. Önceki tasarımın sorunları
2. Yapılan sayfa bazlı değişiklikler
3. Yeni/iyileştirilmiş tasarım token'ları ve bileşenler
4. Hazırlanan medya katmanları ve sahne entegrasyon noktaları
5. Henüz **yapılmayan** görsel/video/3D işleri
6. Dosya adları ve görsel üretimi için kesin ihtiyaç listesi
7. Türkçe/İngilizce, navigasyon, SEO ve responsive sonuçları
8. Komutlar ve gerçekten çalıştırılan testler
9. Görsel QA bulguları, varsa ekran görüntüleri
10. Kalan riskler ve FAZ 2'ye geçiş kontrol listesi
11. Oluşturulan commit'ler

---

## NET KABUL KRİTERLERİ

Bu faz tamamlandığında:

- [ ] Mevcut site **medya gelmese bile** şık, kullanılabilir ve premium bir temel sunuyor.
- [ ] Koyu kozmik tasarım dili, tipografi ve bileşen sistemi tutarlı.
- [ ] Homepage bölüm sırası ve kompozisyonu yenilenmiş; boş ve aşırı uzun sahneler yok.
- [ ] Hero, özgün kara delik görseli ve videosunu daha sonra kabul edecek şekilde hazırlanmış.
- [ ] Beş sahne için entegrasyon/asset sözleşmesi yazılmış.
- [ ] MESA in Action somut içerik merkezi hâline getirilmiş.
- [ ] Diğer gerçek sayfalar kendi karakterlerini koruyan tutarlı tasarıma kavuşmuş.
- [ ] Türkçe/İngilizce, linkler, SEO, navigasyon ve mevcut işlevler korunmuş.
- [ ] Mobil, klavye ve reduced-motion gözden geçirilmiş.
- [ ] Büyük gereksiz 3D/animasyon bağımlılıkları eklenmemiş.
- [ ] Sahte kara delik, geçici stok görsel veya olmayan dosyalara referans eklenmemiş.
- [ ] Değişiklikler test edilmiş, commit'lenmiş ve açıkça raporlanmış.
- [ ] Push/merge/deploy yapılmamış.

## KAPSAM DIŞI — BİR SONRAKİ FAZA BIRAK

- Nihai kara delik görseli üretimi
- Runway/Luma video üretimi
- Kara deliğin yanından gerçek 3D kamera geçişi
- Three.js/GLSL kara delik shader'ı
- Scroll-controlled video seek/scrubbing
- Tam yıldız alanı ve etkileşimli graph animasyonu
- Sahne bazlı sinematik post-processing

Bu işleri yapılmış gibi sunma. Ama ileride entegrasyon için gerekli tasarım kararlarını, medya sınırlarını ve yerleşim noktalarını hazırla.

## UYGULAMA TALİMATI

**Sadece analiz veya plan üretip durma.** Güvenli Git başlangıcını ve incelemeyi yaptıktan sonra gerçek arayüz kodunu iyileştir; ölçülebilir test ve görsel QA ile doğrula; raporla. Gereksiz soru sormadan repo bulgularına göre makul kararları ver, mevcut ürünü koru.

**Başla.**
