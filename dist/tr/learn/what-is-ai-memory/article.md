---
id: "what-is-ai-memory"
slug: "what-is-ai-memory"
type: "learn"
language: "tr"
title: "Yapay zekâ ajanı hafızası nedir?"
subtitle: ""
summary: "Yapay zekâ ajanı hafızası, yararlı bilgiyi model dışında saklar ve gerektiğinde geri getirir. Temel türleri öğrenin ve ilk hafıza politikanızı tasarlayın."
shortAnswer: "Yapay zekâ ajanı hafızası, seçilen bilgileri dil modelinin dışında saklayan ve sonraki isteklerde geri getiren sistemdir. Ajanın önceki bilgi, karar ve deneyimleri oturumlar arasında kullanmasını sağlar. Model yeniden eğitilmez; uygulama ilgili hafızayı bağlam olarak verir."
category: "Foundations"
tags: ["memory", "context window", "session", "kalıcı hafıza", "bağlam", "oturum"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-11-23"
readingMinutes: 6
status: "published"
indexable: true
seoTitle: "Yapay Zekâ Hafızası Nedir? Ajan Hafızası Rehberi — MESA"
seoDescription: "Yapay zekâ ajanı hafızası, bilgiyi model dışında saklayıp gerektiğinde geri getirir. Çalışma, olay, anlamsal ve yöntem hafızasını ve tasarımını öğrenin."
lessonOrder: 1
learningStage: "foundation"
prerequisites: []
learningObjectives: ["Bağlamı kalıcı depodan ayırmak", "Neyi saklayıp ne zaman sileceğini belirlemek", "Bir bilgiyi gözlemden sonraki kullanıma izlemek"]
---

## Yapay zekâ hafızası nedir?

Yapay zekâ hafızası, bir uygulamanın o anki isteğin ötesindeki bilgileri kullanmasını sağlayan mekanizmaların bütünüdür. Bir yapay zekâ ajanında bu genellikle gözlem, bilgi, karar veya talimatları saklamak ve sonraki bir görevde ilgili olanları geri getirmek demektir.

Önemli nokta şudur: Dil modeli her konuşmadan kendiliğinden öğrenmez. Hafıza, uygulamanın neyi saklayacağını seçmesi, onu yeniden bulması ve modelin bağlamına eklemesiyle çalışır.

## “Hatırlamanın” üç ayrı anlamı

Atlas arşivi için çalışan kurgusal bir asistan düşünün. Pazartesi, okuma salonunun dokuzda açıldığını söylüyorsunuz. Salı yeni bir sohbette açılış saatini soruyorsunuz. Uygulama önceki kaydı modele sunmazsa model yalnızca eğitimde öğrendiklerine dayanabilir. Kendinden emin bir yanıt vermesi, bilgiyi gerçekten hatırladığını göstermez.

Büyük dil modeli (LLM), girdiden sonra hangi token’ların geleceğini tahmin ederek metin üretir. Token, her zaman tam bir sözcüğe karşılık gelmeyen kodlanmış metin birimidir. Bağlam penceresi, modelin tek istekte işleyebildiği sınırlı girdi ve çıktı alanıdır. Kalıcı depolama ise bu tahmin sürecinin dışında, uygulama tarafından yönetilir. Burada “hafıza” bir mühendislik kavramıdır; modelin insan gibi hatırladığı söylenmiyor.

| Katman | İçerik | Değişim yolu |
| --- | --- | --- |
| Model parametreleri | Eğitimde öğrenilen örüntüler | Eğitim veya ince ayar |
| Bağlam penceresi | Bu isteğe verilen token’lar | Yeni istek oluşturma |
| Kalıcı hafıza | Model dışındaki kayıtlar | Yetkili yazma/güncelleme/silme |

Veritabanına bir satır eklemek modeli yeniden eğitmez. Uygulama o satırı bulup bağlama eklerse model, yalnızca ilgili istekte bu bilgiden yararlanabilir. Konuşma geçmişinde duran bir cümlenin de geçmiş kısaltıldığında veya yeni oturum açıldığında erişilebilir kalacağı garanti değildir. Bunlar, farklı biçimlerde hata verebilen ayrı mekanizmalardır.

## Yapay zekâ ajanı hafıza türleri

[CoALA çerçevesi](https://arxiv.org/abs/2309.02427) ajan hafızasını dört kullanışlı kategoriyle açıklar. Gerçek ürünler bunları birleştirebilir veya farklı adlarla kullanabilir.

| Tür | İçeriği | Örnek |
| --- | --- | --- |
| Çalışma hafızası | O anki karar için etkin bilgi | Güncel görev ve son araç sonucu |
| Olay (epizodik) hafızası | Geçmiş deneyim ve davranışlar | Geçen haftaki başarısız dağıtım |
| Anlamsal hafıza | Dünya veya ajan hakkındaki bilgiler | Okuma salonu 09.00’da açılır |
| Yöntem (prosedürel) hafızası | Davranışı yönlendiren kural ve beceriler | Sürümden önce testleri çalıştır |

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

## Yapay zekâ hafızası, bağlam penceresi ve RAG farkı

| Kavram | Temel soru | Ömrü |
| --- | --- | --- |
| Bağlam penceresi | Model bu istekte neyi görebilir? | Tek istek |
| RAG | Bu yanıtı hangi kaynak metin desteklemeli? | Bilgi tabanına bağlıdır |
| Ajan hafızası | Ajan neyi saklayıp yeniden kullanmalı? | Değiştirilene veya silinene kadar görev ve oturumlar boyunca |

RAG, hafızayı geri getirmenin bir yolu olabilir; ancak hafıza ayrıca yazma, güncelleme, kapsam ve silme kuralları ister. [RAG ve hafıza](/learn/rag-vs-ai-memory/) dersiyle devam edin.

## Yapay zekâ hafızasında sık yapılan hatalar

- Her mesajı saklayıp gürültü, özel veri veya eski talimatları geri getirmek.
- Yalnızca özet tutup özgün kanıtı kaybetmek.
- Getirilen bir belgedeki talimatı güvenilir kullanıcı tercihi saymak.
- Bir kaydı düzeltme, geçersiz kılma veya silme yolu bırakmamak.
- Kaydın yazıldığını ölçüp sonraki oturumun onu kullanabildiğini ölçmemek.

## İlk hafıza politikanızı tasarlayın

> [!EXERCISE]
> **Kendinizi sınayın**
> Asistan “salon dokuzda açılır” kaydını saklıyor; kaynağını ve kimlerin görebileceğini bilmiyor. Arama satırı her seferinde bulsa bile hangi iki sorun sürer?
>
> **Açıklama:** Kaynağıyla bağlantılı iddiayı güvenilir biçimde doğrulayamaz veya revize edemezsiniz; erişim sınırını da uygulayamazsınız. Arama başarısı kaynak izi ve yetkilendirmeyi çözmez. Arama kalitesini ölçmeden önce kaynak/revizyon ve kapsam alanlarını ekleyin.

> [!NOTE]
> **Örnek: kodlama ajanları için hafıza**
> [MESA Lore](/lore/) bu fikri kodlama oturumlarına uygular. Geçmiş Claude Code ve Codex çalışmalarını kaynaklarıyla birlikte yerel ve aranabilir bir kayıtta tutar.

## Yapay zekâ ajanı hafızası hakkında sorular

**Yapay zekâ hafızası modeli yeniden eğitir mi?**
: Hayır. Ajan hafızasının çoğu model dışında saklanır ve gerektiğinde bağlama eklenir.

**Daha büyük bağlam penceresi hafıza demek mi?**
: Hayır. Tek istekte daha fazla metin taşır, ama neyin kalıcı olacağına, neyin güncel olduğuna veya kimin erişebileceğine karar vermez.

**Ajan hafızası için vektör veritabanı şart mı?**
: Hayır. Göreve göre dosyalar, SQL veya sözcük aramasıyla başlanabilir. Anlam tabanlı aramaya ihtiyaç ölçtüğünüzde vektör ekleyin.

**Bir yapay zekâ ajanı neyi hatırlamalı?**
: Sonradan işe yarayacak bilgileri kaynağı, kapsamı ve zamanıyla saklayın. Gizli bilgileri, geçici gürültüyü ve izlenemeyen iddiaları saklamayın.

## Kaynaklar ve ileri okuma

1. [Liu et al. (2023) · Lost in the Middle](https://arxiv.org/abs/2307.03172)
2. [Lewis et al. (2020) · Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
3. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)
4. [Sumers et al. (TMLR 2024) · Cognitive Architectures for Language Agents](https://arxiv.org/abs/2309.02427)

