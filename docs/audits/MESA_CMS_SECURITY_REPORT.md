# MESA CMS Security Report

Tarih: 2026-10-15, Europe/Istanbul. Kapsam: yerel site kodu, SQL migration'ları, üretilen herkese açık dosyalar ve yalıtılmış PostgreSQL yetkilendirme testleri. Üretim Supabase/Auth/Storage bağlantısı sağlanmadı; üretim veritabanına migration uygulanmadı.

## Sonuç

**CMS yayına hazır değil.** Başlangıçtaki `/admin/` gerçek CMS değildi: giriş/oturum doğrulaması yoktu, ADMIN etiketi herkese gösteriliyordu, arama indeksinden uydurma makale gövdeleri oluşturuluyordu, taslak yalnız localStorage'a kaydediliyor ve Publish hiçbir ağ isteği göndermeden başarılı kuyruk mesajı veriyordu. Import edilen `/admin/scripts/markdown_engine.mjs` dosyası da çıktıda yoktu.

Bu ekranın gerçek yönetici yetkisi verdiği iddia edilmez; backend'e zaten bağlı değildi. Güvenlik açığı, ayrıca mevcut SQL politikasında somut olarak yeniden üretildi. Yönetim rotası EN/TR açıklayıcı, noindex ve işlem yapamayan bir durum sayfası olarak korunuyor. Önceki tarayıcı taslakları silinmedi/okunmadı. Kimlik doğrulama ve yayın hattı tamamlanana kadar sahte başarı arayüzü yeniden açılmamalı.

## Doğrulanan kusurlar ve onarımlar

| ID | Öncelik | Kanıt / kök neden | Yerel onarım | Durum |
|---|---|---|---|---|
| SEC-01 | P0, backend etkinleştirme engeli | EDITOR politikası sadece üyeliğe bakıyor; status=published yazılabiliyor. Anon SELECT bu gövdeyi okuyabiliyor. | Yeni migration: tarayıcı INSERT/UPDATE sadece draft/ready ve published_at=NULL; published satıra editör UPDATE yok; doğrudan DELETE/job INSERT kapalı. | PostgreSQL'de önce açık, sonra engel doğrulandı. Üretime uygulanmadı. |
| CMS-01 | P1 | Kimlik doğrulamasız ADMIN görüntüsü, kayıpsız gerçek gövde yüklemesi yok, ağ isteksiz Publish başarı mesajı | `/admin/`, `/tr/admin/` fail closed; yanlış durum mesajları ve eksik modül import'u kaldırıldı | Yerel HTML ve browser test PASS; gerçek CMS eksik |
| MD-01 | P2 güvenlik sağlamlaştırması | URL HTML'i oluşturulmadan önce inline formatting; URL içinde markup/attribute bozulması, unsafe scheme işleme boşlukları | Raw URL allowlist; token→escape sırası; img/link destination escaping; unsafe HTML metin olarak tutulur | Adversarial renderer test PASS; tam CommonMark parser değildir |
| BUILD-01 | P0 veri kaybı / P1 gizlilik | Output source ancestor/repository root olabiliyordu; eski dist HTML'i withdrawn/draft rotayı yaşatabiliyordu | Kaynak/üst dizin/repo overlap reddi; yalnız disposable artifact'ta eski HTML temizliği; renderer dist yan etkileri kaldırıldı | Geçici fixture testlerinde PASS; kullanıcı dosyası silinmedi |
| SEC-02 | P2 | SECURITY DEFINER search_path sabit değildi; audit/revision kimliği istemci tarafından taklit edilebiliyordu | Empty search_path; anon/PUBLIC EXECUTE revoke; audit user_id ve revision author_id=auth.uid; medya metadata yalnız editöre görünür | İlgili SQL sınırları test edildi; depolama upload backend'i yok |

## Test edilen yetki sınırları

`python3 scripts/check_cms_authorization.py`, digest'e sabitlenmiş PostgreSQL 15 Alpine imajını kullanır. Tek kullanımlık container: **network=none**, yayınlanmış port yok, tmpfs veri, 512 MiB/1 CPU sınırı; sonunda container silinir. Schema, auth.uid() ve anon/authenticated rol/grant fixture'ı kullanılır. Bu, gerçek PostgreSQL RLS testidir; **hosted Supabase Auth/JWT uçtan uca testi değildir**.

| Aktör / işlem | Beklenen | Sonuç |
|---|---|---|
| Başlangıç EDITOR: draft→published; ardından anon gövde okuma | Önceki açık yeniden üretilecek | PASS: BASELINE EDITOR PUBLICATION BYPASS REPRODUCED |
| Anon: published dışı satır okuma | 0 satır | PASS |
| Anon: draft INSERT | Reddedilir | PASS |
| Anon: privileged role helper EXECUTE | Reddedilir | PASS |
| Rolü olmayan authenticated kullanıcı: draft okuma | 0 satır | PASS |
| EDITOR: kendi rolünü ADMIN yapma | Değişiklik yok | PASS |
| EDITOR: published INSERT veya draft→published UPDATE | RLS reject | PASS |
| EDITOR: yayımlanmış gövdeyi değiştirme | Değişiklik yok | PASS |
| EDITOR: kendi draft/ready gövdesini düzenleme | İzin | PASS |
| EDITOR: admin kimliğiyle audit olayı yazma | RLS reject | PASS |
| ADMIN: tarayıcı rolüyle publish veya publication job INSERT | Reddedilir; trusted backend gerekli | PASS |
| Anon site ziyaretçisi: admin formu/JS/session kontrolü | İşlem yok, noindex | Browser PASS, EN/TR |
| Draft işaretlenen mevcut makale: HTML/search/sitemap | Çıktıda bulunmamalı | İzole build fixture PASS |

Kanıt: [SQL log](evidence/sql-authorization.log), [SQL vakaları](../../scripts/tests/cms_authorization.sql), [fixture](../../scripts/tests/cms_fixture.sql), [runner](../../scripts/check_cms_authorization.py). SQL testleri gerçek Supabase'in storage.objects politikalarını, Auth oturum iptalini veya token rotation'ını doğrulamaz; bunlar kurulmamış/bağlanmamış servis sınırlarıdır.

## Eksik güvenlik mimarisi

| Bileşen | Gerçek durum |
|---|---|
| Login/logout/session expiry/refresh | NOT_IMPLEMENTED; public admin route oturum vermez |
| Server-side admin/editor uygulama yetkilendirmesi | Sadece şema/RLS var; application backend ve Auth entegrasyonu yok |
| Draft gizliliği | Statik JSON kaynak filtresi + SQL policy izole testleri PASS; hosted DB bilinmiyor |
| Immutable publication snapshot | Schema var; transactional snapshot/immutable trigger ve çalışan export yok |
| Publish/unpublish/restore yetkilendirmesi | Trusted backend/Edge Function yok; doğrudan browser publish kapalı |
| Audit logging | İstemci actor taklidi engellendi; gerçek güvenilir backend publication audit otomasyonu yok |
| Safe image upload | Storage bucket, MIME/boyut doğrulama, içerik kontrolü ve upload endpoint uygulanmamış |
| Revision restoration | Çalışan restore RPC/UI/yeniden yayın akışı yok |
| Dispatch token | İstemcide yok; çalışan dispatcher/secret configuration da yok |
| İş sonucu / rollback | Deployment callback, retry, revision binding, başarı teyidi yok |

CMS'yi yeni servisler kurarak tamamlamak küçük bir hata onarımı değildir. Bu denetim ücretli kaynak açmadı, credential üretmedi, üretim altyapısını değiştirmedi. Owner'ın backend ortamı ve gerekli servis sınırları olmadan gerçek administrator create/edit/publish zinciri doğrulanamaz.

## Public artifact / XSS kontrolleri

`check_public_artifact.py` tanınabilir private key, GitHub/OpenAI/Supabase secret formatlarını ve service_role JWT payload'larını tarar; eşleşen değerleri asla yazdırmaz. Son build'de **161 metin artifact**: PASS, tanınan privileged credential yok. Bu desen taraması tüm olası credential biçimlerinin matematiksel yokluk ispatı değildir.

Public sayfalarda Supabase SDK/CMS bundle yüklenmiyor; admin sayfası JS/form içermez. Makaleler ve dokümanlar statik HTML'dir. Markdown'da raw script HTML'i escape edilir, javascript/data/protocol-relative destination'lar reddedilir. Generated HTML event attribute, duplicate ID, unsafe URL scheme ve private/search URL kontrolleri de geçer. İndeks ve sitemap admin/draft içermiyor.

Kaynak: [Supabase resmi RLS dokümantasyonu](https://github.com/supabase/supabase/blob/master/apps/docs/content/guides/database/postgres/row-level-security.mdx), Context7 üzerinden kontrol edildi. Aktif role sorguları auth.uid() kullanır; yeni definer search_path='' ve schema-qualified erişimler taşır.

## Yayın kararı

Yerel doğrulanan kritik kusurlar giderildi; açık doğrulanmış yerel P0 kalmadı. **CMS / publishing production readiness: NO-GO.** Üretim oturumu, storage, RLS kurulum durumu ve dispatch/deploy sınırları UNVERIFIED/NOT_IMPLEMENTED. Bu rapor üretim güvenlik onayı veya migration uygulama izni değildir.
