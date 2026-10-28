---
id: "what-is-ai-memory"
slug: "what-is-ai-memory"
type: "learn"
language: "tr"
title: "Yapay zekâ hafızası: sohbet bitince ne kalır?"
subtitle: ""
summary: "Modelin öğrendiklerini, o anki konuşmayı ve kalıcı kayıtları birbirinden ayırın. Veritabanı seçmeden önce neyi, nasıl saklayacağınıza karar verin."
shortAnswer: "Modelin öğrendiklerini, o anki konuşmayı ve kalıcı kayıtları birbirinden ayırın. Veritabanı seçmeden önce neyi, nasıl saklayacağınıza karar verin."
category: "Foundations"
tags: ["memory", "context window", "session", "kalıcı hafıza", "bağlam", "oturum"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-28"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Yapay zekâ hafızası: sohbet bitince ne kalır? — MESA"
seoDescription: "Modelin öğrendiklerini, o anki konuşmayı ve kalıcı kayıtları birbirinden ayırın. Veritabanı seçmeden önce neyi, nasıl saklayacağınıza karar verin."
lessonOrder: 1
learningStage: "foundation"
prerequisites: []
learningObjectives: ["Bağlamı kalıcı depodan ayırmak", "Neyi saklayıp ne zaman sileceğini belirlemek", "Bir bilgiyi gözlemden sonraki kullanıma izlemek"]
---

## “Hatırlamanın” üç ayrı anlamı

Atlas arşivi için çalışan kurgusal bir asistan düşünün. Pazartesi, okuma salonunun dokuzda açıldığını söylüyorsunuz. Salı yeni bir sohbette açılış saatini soruyorsunuz. Uygulama önceki kaydı modele sunmazsa model yalnızca eğitimde öğrendiklerine dayanabilir. Kendinden emin bir yanıt vermesi, bilgiyi gerçekten hatırladığını göstermez.

Büyük dil modeli (LLM), girdiden sonra hangi token’ların geleceğini tahmin ederek metin üretir. Token, her zaman tam bir sözcüğe karşılık gelmeyen kodlanmış metin birimidir. Bağlam penceresi, modelin tek istekte işleyebildiği sınırlı girdi ve çıktı alanıdır. Kalıcı depolama ise bu tahmin sürecinin dışında, uygulama tarafından yönetilir. Burada “hafıza” bir mühendislik kavramıdır; modelin insan gibi hatırladığı söylenmiyor.

| Katman | İçerik | Değişim yolu |
| --- | --- | --- |
| Model parametreleri | Eğitimde öğrenilen örüntüler | Eğitim veya ince ayar |
| Bağlam penceresi | Bu isteğe verilen token’lar | Yeni istek oluşturma |
| Kalıcı hafıza | Model dışındaki kayıtlar | Yetkili yazma/güncelleme/silme |

Veritabanına bir satır eklemek modeli yeniden eğitmez. Uygulama o satırı bulup bağlama eklerse model, yalnızca ilgili istekte bu bilgiden yararlanabilir. Konuşma geçmişinde duran bir cümlenin de geçmiş kısaltıldığında veya yeni oturum açıldığında erişilebilir kalacağı garanti değildir. Bunlar, farklı biçimlerde hata verebilen ayrı mekanizmalardır.

## Kullanışlı kayıt bir cümleden fazlasıdır

“Dokuzda açılır” bilgisini saklamadan önce şu soruları sorun: Hangi salon? Hangi günler? Hangi kaynağa göre? Kimler görebilir? İyi bir kayıt, özgün ifadeyi, kaynağını, erişim izinlerini ve zamanını korur. Bu ifadeden çıkarılan bilgi ise bir yorumdur. İkisini ayrı saklamak, kaynağı değiştirmeden hatalı yorumu düzeltmenizi sağlar.

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

Neyin saklanacağına açıkça karar verin. Her mesajı kaydetmek; özel bilgileri, tekrarları ve geçerliliğini yitirmiş talimatları biriktirir. Yalnızca model özeti saklamak da istisnaları veya dayanakları kaybettirebilir. Başlangıç için kaynak metni koruyup görevle ilgili az sayıda bilgi kaydı çıkarabilir ve her birini kaynağına bağlayabilirsiniz. Bu, her sistemde zorunlu olan tek çözüm değil, bir tasarım seçeneğidir.

## Silme ve düzeltme de hafızanın parçasıdır

Çarşamba salonun açılış saati değişsin. Sürüm ve geçerlilik bilgisi tutmadan yalnızca yeni bir cümle eklerseniz, arama birbiriyle yarışan iki yanıt bulabilir. Saklama kurallarınıza uygun geçmişi koruyun ve eski kaydın geçerliliğini yitirdiğini belirtin. Kaynak silindiğinde ona bağlı özetleri, sayısal temsilleri ve önbellekleri de değerlendirin; yalnızca görünen sohbet mesajını kaldırmak yeterli değildir.

Kalıcılığı gözlenebilir davranışla sınayın: Oturumu kapatın, başka bir yetkili oturum açın ve aynı soruyu sorun. Ardından erişimi kaldırıp veya kaynağı değiştirip testi tekrarlayın. Yanıtla birlikte kaynak kimliğini de kontrol edin. Uzun bir bağlam penceresi bu testin yerini tutmaz. Liu ve arkadaşlarının belirli uzun bağlam görevlerinde bulduğu konum etkisi, her model için değişmez bir sınır değil; kendi sisteminizi ölçmeniz için bir gerekçedir. [Araştırma](https://arxiv.org/abs/2307.03172)

## İlk hafıza politikanızı tasarlayın

> [!EXERCISE]
> **Kendinizi sınayın**
> Asistan “salon dokuzda açılır” kaydını saklıyor; kaynağını ve kimlerin görebileceğini bilmiyor. Arama satırı her seferinde bulsa bile hangi iki sorun sürer?
>
> **Açıklama:** Kaynağıyla bağlantılı iddiayı güvenilir biçimde doğrulayamaz veya revize edemezsiniz; erişim sınırını da uygulayamazsınız. Arama başarısı kaynak izi ve yetkilendirmeyi çözmez. Arama kalitesini ölçmeden önce kaynak/revizyon ve kapsam alanlarını ekleyin.

## Kaynaklar ve ileri okuma

1. [Liu et al. (2023) · Lost in the Middle](https://arxiv.org/abs/2307.03172)
2. [Lewis et al. (2020) · Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
3. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

