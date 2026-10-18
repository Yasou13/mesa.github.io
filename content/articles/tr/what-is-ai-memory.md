---
id: "what-is-ai-memory"
slug: "what-is-ai-memory"
type: "learn"
language: "tr"
title: "Yapay zekâ hafızası: konuşmadan sonra ne kalır?"
subtitle: ""
summary: "Model ağırlıklarını, güncel bağlamı ve kalıcı kayıtları ayırın. Veritabanı seçmeden önce bir hafıza kaydını tasarlayın."
shortAnswer: "Model ağırlıklarını, güncel bağlamı ve kalıcı kayıtları ayırın. Veritabanı seçmeden önce bir hafıza kaydını tasarlayın."
category: "Foundations"
tags: ["memory", "context window", "session", "kalıcı hafıza", "bağlam", "oturum"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Yapay zekâ hafızası: konuşmadan sonra ne kalır? — MESA Learn"
seoDescription: "Model ağırlıklarını, güncel bağlamı ve kalıcı kayıtları ayırın. Veritabanı seçmeden önce bir hafıza kaydını tasarlayın."
lessonOrder: 1
learningStage: "foundation"
prerequisites: []
learningObjectives: ["Bağlamı kalıcı depodan ayırmak", "Neyi saklayıp ne zaman sileceğini belirlemek", "Bir bilgiyi gözlemden sonraki kullanıma izlemek"]
---

## “Hatırlamanın” üç ayrı anlamı

Kurgusal Atlas arşivi için çalışan bir asistan düşünün. Pazartesi okuma salonunun dokuzda açıldığını söylüyorsunuz. Salı yeni konuşmada açılış saatini soruyorsunuz. Uygulama kullanılabilir bir kayıt sağlamazsa model ancak parametrelerindeki bilgiye dayanabilir. Kendinden emin yanıt hangi yolun kullanıldığını göstermez.

Büyük dil modeli (LLM), aldığı girdiden sonraki token’ları tahmin ederek metin üretir. Token kodlanmış metin birimidir; her zaman tam kelime değildir. Bağlam penceresi modelin arayüzü altında çalışabildiği sınırlı girdi/çıktı token dizisidir. Kalıcı depolama bu tahmin sürecinin dışında, uygulamaya ait mekanizmadır. Burada hafıza bir mühendislik terimidir; insan gibi hatırlama iddiası değildir.

| Katman | İçerik | Değişim yolu |
| --- | --- | --- |
| Model parametreleri | Eğitimde öğrenilen örüntüler | Eğitim veya ince ayar |
| Bağlam penceresi | Bu isteğe verilen token’lar | Yeni istek oluşturma |
| Kalıcı hafıza | Model dışındaki kayıtlar | Yetkili yazma/güncelleme/silme |

Veritabanına satır yazmak modeli yeniden eğitmez. O satırı getirmek, seçim ve bağlam sınırları içinde yalnızca bir istekte kullanılabilir kılar. Konuşma geçmişinde duran bir cümlenin budamadan sonra veya başka oturumda bulunacağı da garanti değildir. Bunlar farklı hata biçimleri olan ayrı mekanizmalardır.

## Kullanışlı kayıt bir cümleden fazlasıdır

“Dokuzda açılır” bilgisini saklamadan önce sorun: hangi salon, hangi günler, kime göre ve hangi okuyucular için? Kullanışlı kayıt özgün gözlemi, kaynağı, erişim kapsamını ve zamanı korur. Çıkarılmış olgu bu gözlemin yorumudur. İkisini saklamak, özgün kaynak değişmiş gibi davranmadan çıkarımı düzeltmenizi sağlar.

```text
record_id: hours-17
subject: Atlas reading room
claim: opens at 09:00 on weekdays
source: handbook / revision 2 / paragraph 4
observed_at: 2026-10-18
scope: archive-team
status: active
```

“Kısa yanıt ver” tercihi, açılış saati gibi bir referans bilgisinden farklıdır. Geçici talimat tek görevde geçerli olabilir; kullanıcı tercihi geri alınana kadar sürebilir. Getirilen belgedeki talimatı sessizce kalıcı kullanıcı tercihine dönüştürmeyin. Her kayıt türünü kimin yazabileceğini tanımlayın.

## Konuşma dökümünü değil yaşam döngüsünü izleyin

<!-- diagram: Gözlem kabul edilir, saklanır, geri getirilir ve sonraki bağlamda kullanılır. -->
1. Gözlem · tam kaynak
2. Kabul · doğrula ve yetkilendir
3. Sakla · kaynak + kayıt
4. Getir · ilgili ve izinli
5. Kullan · atıf yap veya çekimser kal

*Her ok başarısız olabilir. Kaydedilmiş mesaj, kullanılabilir hafızanın tamamlandığını kanıtlamaz.*

Yazma politikasını açık seçin. Her mesajı saklamak özel veriyi, tekrarları ve eski talimatları biriktirir. Yalnızca LLM özeti saklamak istisnaları veya kanıtı kaybettirebilir. Başlangıç için tam kaynak kayıtlarını koruyup görevle ilgili az sayıda iddia çıkarmak ve her iddiayı kaynağına bağlamak uygundur. Bu bir tasarım örüntüsüdür; evrensel gereklilik değildir.

## Silme ve düzeltme de hafızanın parçasıdır

Çarşamba salonun saati değişiyor. Yeni cümle eklemek, revizyon veya geçerlilik izlenmiyorsa yarışan iki yanıt bırakır. Politikanızın izin verdiği denetim izini korurken önceki iddiayı geçersizleşmiş olarak işaretleyin. Kaynak silindiğinde türetilmiş özet, embedding ve önbellekler hakkında da karar gerekir; yalnızca görünen sohbet mesajını kaldırmak yeterli değildir.

Test, gözlenebilir devamlılıktır: oturumu kapatın, başka yetkili oturum açın, soruyu sorun; sonra erişimi kaldırıp veya kaynağı değiştirip tekrarlayın. Yanıtla birlikte dönen kaynak kimliğini kontrol edin. Uzun bağlam bu testin yerini tutmaz. Liu ve arkadaşları belirli uzun bağlam görevlerinde konum etkisini inceler; bulgu her model için zamansız sınır değil, kendi modelinizi değerlendirme nedenidir. [Araştırma](https://arxiv.org/abs/2307.03172).

## İlk hafıza politikanızı tasarlayın

> [!EXERCISE]
> **Kendinizi sınayın**
> Asistan “salon dokuzda açılır” kaydını saklıyor; kaynağını ve kimlerin görebileceğini bilmiyor. Retrieval satırı her seferinde bulsa bile hangi iki sorun sürer?
>
> **Answer:** Kaynağa bağlı iddiayı güvenilir biçimde doğrulayamaz veya revize edemezsiniz; erişim sınırını da uygulayamazsınız. Retrieval başarısı kaynak izi ve yetkilendirmeyi çözmez. Arama kalitesini ölçmeden önce kaynak/revizyon ve kapsam alanlarını ekleyin.

## Kaynaklar ve ileri okuma

1. [Liu et al. (2023) · Lost in the Middle](https://arxiv.org/abs/2307.03172)
2. [Lewis et al. (2020) · Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

