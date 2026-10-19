# Erken erişim talepleri

Ana sayfadaki **Erken erişim iste** düğmesi `/tr/early-access/` sayfasını açar.
İngilizce sayfa `/early-access/` adresindedir. Kullanıcı hesap açmadan e-posta,
ilgi alanı (deneme, entegrasyon, katkı) ve kullanım amacını paylaşır. Kurum/proje
ve herkese açık GitHub adresi isteğe bağlıdır. Gönderim için veri kullanımı
bildirimini okuduğunu ve talebe ilişkin iletişimi kabul ettiğini işaretler.
Form yalnızca sunucu `accepted: true` döndürdükten sonra alındı mesajı gösterir.
Hatalarda yanıtları korur; aynı e-posta ve amaç tekrar gönderilirse yeni kayıt
açmaz ve önceki kaydı değiştirmez. Hiçbir otomatik e-posta gönderilmez.

## Kurulum

1. Mevcut güvenli içerik platformu şemasının ve `public.is_admin()` işlevinin
   bulunduğu Supabase projesinde `20261019010000_early_access_requests.sql`
   migration dosyasını çalıştırın. İlk üç migration mevcut kuruluma aittir;
   sıfırdan kurulumda hepsini zaman sırasıyla uygulayın. Seed dosyasını mevcut
   içeriklerin üzerine çalıştırmayın.
2. GitHub Pages değişkenleri `MESA_SUPABASE_URL` ve
   `MESA_SUPABASE_PUBLISHABLE_KEY` mevcut admin ayarlarıyla aynıdır.
3. Siteyi derleyip yayınlayın. `early_access_available` kontrolü başarıyla
   dönmezse gönderim açılmaz; kullanıcıya yeniden deneme seçeneği sunulur.

Bu migration 19 Ekim 2026 tarihinde mevcut MESA projesine Supabase SQL Editor
üzerinden uygulandı. Anonim rol ile kayıt oluşturma işlemi canlı veritabanında
transaction içinde sınandı ve geri alındı; kalıcı test talebi bırakılmadı.

## Admin paneli

Admin hesabınızla giriş yapıp **Erken erişim talepleri** bölümünü açın.
E-posta ile arayabilir, duruma göre filtreleyebilir ve 25 kayıtlık sayfalarda
gezinebilirsiniz. Bir talebi açınca kullanım amacı, kurum/proje, GitHub adresi,
gönderim tarihi ve dil görünür. Özel not ve durum değişikliklerini **Talebi
kaydet** ile kaydedin. Başka bir yönetici aynı kaydı değiştirdiyse kaydetme
reddedilir; notlarınızı kopyalayıp listeyi yenileyin.

Durumlar: **Yeni → İnceleniyor → İletişim kuruldu → Davet edildi**.
Tamamlanan talepleri **Kapatıldı**, ilgisiz gönderimleri **İstenmeyen** olarak
işaretleyebilirsiniz. Durum değiştirmek davet göndermez, hesap açmaz veya erişim
vermez. İletişim ve erişim sağlama işlemlerini ayrıca yürütün.

## Veri sınırları ve işletim

- `early_access_requests` tablosunda RLS açıktır. Anonim kullanıcılar tabloyu
  okuyamaz veya doğrudan yazamaz. Editörler talepleri göremez. Yalnızca mevcut
  ADMIN rolü okuyabilir; arayüzden yalnızca durum ve özel notlar değiştirilebilir.
- Gönderim, sabit arama yoluna sahip SECURITY DEFINER RPC üzerinden geçer.
  Alan sınırları, e-posta, amaç, GitHub adresi ve iletişim onayı veritabanında da
  doğrulanır. İstemci durum/not/kimlik gibi yönetim alanlarını gönderemez.
- Aynı ağ adresinden saatlik kovada en fazla 5 başarılı gönderim denemesi,
  tüm proje için kayan 24 saatte 500 deneme kabul edilir. Yinelenen kayıtlar
  da deneme sayılır. Ağ adresinin hash değeri tutulur; 48 saatten eski sayaçlar
  sonraki gönderimde temizlenir. Tam ağ adresi bu tablolarda saklanmaz.
  Bu temel korumadır; dağıtık botları durduran CAPTCHA/WAF yerine geçmez.
- Talepler için otomatik saklama süresi veya silme işi kurulmamıştır. Artık
  gerekli olmayan kişisel verileri yetkili Supabase yönetimi üzerinden silin.
  Paneldeki kapatma/istenmeyen durumu veriyi silmez. Supabase yedekleri varsa
  bunların kendi saklama koşulları geçerlidir.
- Talep metinleri HTML olarak işlenmez; admin ekranında düz metin gösterilir.
  Oturum kapanınca veya rol kaybedilince tarayıcıdaki özel kayıtlar temizlenir.
- Kayıtlar statik siteye, arama dizinine, içerik JSON’una veya GitHub’a
  aktarılmaz. Talep içeriğini herkese açık issue olarak paylaşmayın.

## Kontroller

```bash
npm test
python3 scripts/check_cms_authorization.py
node scripts/check_early_access.mjs http://127.0.0.1:8023/
node scripts/check_browser_layout.mjs --base-url http://127.0.0.1:8023/ --admin-auth-only
```

Tarayıcı testleri için siteyi yalnızca yerel örnek public config ile derleyin:
`MESA_SUPABASE_URL=http://127.0.0.1:54321` ve
`MESA_SUPABASE_PUBLISHABLE_KEY=sb_publishable_fixture`. API örnekleri test
süresince tarayıcıda taklit edilir; üretim oturumunu veya gerçek talepleri
kullanmaz. SQL testleri ağsız, geçici PostgreSQL konteynerinde çalışır.
