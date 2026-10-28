---
id: "evidence-aware-memory"
slug: "what-is-evidence-aware-memory"
type: "learn"
language: "tr"
title: "Kaynak izi: bir atıf neyi kanıtlar?"
subtitle: ""
summary: "Bir atfı belge sürümüne ve dayanak pasajına kadar izleyin. İçerik bütünlüğü, kaynak güvenilirliği ve yanıtın desteklenmesi arasındaki farkı öğrenin."
shortAnswer: "Bir atfı belge sürümüne ve dayanak pasajına kadar izleyin. İçerik bütünlüğü, kaynak güvenilirliği ve yanıtın desteklenmesi arasındaki farkı öğrenin."
category: "Evidence & Trust"
tags: ["provenance", "citation", "hash", "SHA256", "evidence", "kaynak izi", "atıf", "kanıt", "halüsinasyon"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-28"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Kaynak izi: bir atıf neyi kanıtlar? — MESA"
seoDescription: "Bir atfı belge sürümüne ve dayanak pasajına kadar izleyin. İçerik bütünlüğü, kaynak güvenilirliği ve yanıtın desteklenmesi arasındaki farkı öğrenin."
lessonOrder: 9
learningStage: "systems"
prerequisites: ["structured-vs-unstructured-memory"]
learningObjectives: ["Kanıt aralığını sabit kaynakta doğrulamak", "İçerik bütünlüğü ile kaynak özgünlüğünü ayırmak", "Denetim kaydı ve desteksiz yanıt davranışı tasarlamak"]
---

## Dört kontrol, dört ayrı sonuç

Asistan “Salon cumaları onda açılır” deyip bir bağlantı göstersin. Bağlantının gerçekten var olması yalnızca ilk kontroldür. Kaynak erişilebilir mi? Alıntılanan pasaj bu yanıtı destekliyor mu? Bilgi sorulan tarih ve kapsam için geçerli mi? Kaynak güvenilir mi? Bu soruları ayrı değerlendirin; birini doğrulamak diğerlerini otomatik olarak doğrulamaz.

| Kontrol | Başarının gösterdiği | Göstermediği |
| --- | --- | --- |
| Bütünlük | Baytlar kayıtlı özete uyuyor | Kimin yazdığı veya doğruluk |
| Kaynak izi | Kayıtlı türetim/sahiplik yolu | Doğru çıkarım veya dürüst köken |
| Destek | Bu pasaj bu iddiayı destekliyor | Kaynağın doğruluğu veya güncellik |
| Uygulanabilirlik | Kapsam/zaman soruya uyuyor | Evrensel doğruluk |

## Küçük, tekrar üretilebilir aralık kontrolü

```text
text = "Atlas opens at 09:00."
start, end = 15, 20  # Unicode code points; [start, end)
assert text[start:end] == "09:00"
# A different encoding/offset convention must be declared explicitly.
```

Metindeki başlangıç ve bitiş konumları, yalnızca bilgi çıkarılırken kullanılan tam metin üzerinde anlamlıdır. Konumların bayt, Unicode kod noktası veya başka bir birimle sayıldığını belirtin. Bitiş konumunun aralığa dâhil olup olmadığını da tanımlayın. Unicode normalizasyonu, PDF’den metin çıkarma veya satır sonu dönüşümü konumları değiştirebilir. Kaynak sürümünü ve aynı metni yeniden elde etmek için gereken bilgileri koruyun; seçilen aralığın gerçekten eşleştiğini kontrol edin.

SHA-256 gibi bir özet, elinizdeki içeriğin güvenilir bir beklenen özetle uyuşup uyuşmadığını gösterir. Ancak uydurma bir metnin özeti de kolayca hesaplanabilir. Metin ve beklenen özet aynı güvenilmeyen kişiden geliyorsa eşleşme özgünlüğü kanıtlamaz. Kaynağın nasıl edinildiği, yayıncının kimliğinin doğrulanması ve aktarım kayıtları farklı soruları yanıtlar.

## Yanıttan kaynağa zinciri koruyun

<!-- diagram: Yanıt iddiası iddiaya, tam aralığa, kaynak revizyonuna ve edinim kaydına bağlanır. -->
1. Yanıt · cuma onda
2. İddia · a42 + koşullar
3. Aralık · tam destek metni
4. Sürüm · handbook-r3
5. Köken · edinim kaydı

*Atıf inceleyenin hattı yeniden kurmadan kanıtı kontrol etmesini sağlamalıdır.*

Alıntıyı kolay incelenecek kadar kısa tutun; anlamı sınırlayan cümleleri de ekleyin. “1 Kasım sonrası cumaları” koşulu olmadan “onda açılır” ifadesi ekim ayına ilişkin soruyu desteklemez. Bir paragrafın sonundaki tek atfın bütün cümlelere dayanak olduğunu varsaymayın. Birden çok iddia içeren yanıtta desteklenmeyen kısımları ayrıca belirtin.

## Özel veriyi çoğaltmadan kararları kaydedin

Arama kararlarını izlemek için istek kimliğini, erişim kapsamını, kaynakların güncelleme bilgisini, adayları, elenme gerekçelerini ve kullanılan son kanıtları kaydedin. Özel belgeleri bütünüyle günlüklere kopyalamak yerine kimlik veya referans kullanın. Hassas değerleri hata mesajlarından çıkarın. Denetim kayıtları için de erişim, saklama ve silme kuralları gerekir. Her şeyi kaydetmek, denetimsiz ikinci bir hafıza deposu oluşturabilir.

Uygun kaynaklar yanıtı desteklemiyorsa kanıtın eksik olduğunu söyleyin veya sorunun daraltılmasını isteyin. Aramayla kaynak sağlamak ve atıfları düzenlemek, bazı dayanaksız yanıtları azaltabilir; tamamen ortadan kaldırmaz. W3C PROV, bilginin hangi kaynaktan nasıl türediğini anlatan kavramlar sunar. OWASP ise bulunan metnin neden güvenilir talimat sayılmaması gerektiğini açıklar. Bu iki konu birbirini tamamlar. [PROV](https://www.w3.org/TR/prov-overview/) [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

## Bağlantıyı değil iddiayı test edin

> [!EXERCISE]
> **Kendinizi sınayın**
> Belge SHA-256 özetiyle eşleşiyor; fakat belgeyi bilinmeyen kullanıcı yüklemiş. Ne sonuç çıkarabilirsiniz?
>
> **Açıklama:** Yalnızca verilen baytların belirtilen yöntemle o özete uyduğunu söyleyebilirsiniz. Köken/özgünlük değerlendirmesi ve pasajın cevabı desteklediğine ayrı kontrol gerekir. Sağlama toplamı kaynak doğruluğunu sertifikalandırmaz.

## Kaynaklar ve ileri okuma

1. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
2. [OWASP · LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
3. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

