---
id: "evidence-aware-memory"
slug: "what-is-evidence-aware-memory"
type: "learn"
language: "tr"
title: "Kanıt ve kaynak izi: atıf gerçekte neyi kanıtlar?"
subtitle: ""
summary: "Kaynak revizyonu ve tam aralıkla doğrulanabilir atıf kurun. Bütünlük, kaynak izi, iddia desteği ve kaynak doğruluğunu ayırın."
shortAnswer: "Kaynak revizyonu ve tam aralıkla doğrulanabilir atıf kurun. Bütünlük, kaynak izi, iddia desteği ve kaynak doğruluğunu ayırın."
category: "Evidence & Trust"
tags: ["provenance", "citation", "hash", "SHA256", "evidence", "kaynak izi", "atıf", "kanıt", "halüsinasyon"]
author: "MESA contributors"
publishedAt: "2026-10-01"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Kanıt ve kaynak izi: atıf gerçekte neyi kanıtlar? — MESA Learn"
seoDescription: "Kaynak revizyonu ve tam aralıkla doğrulanabilir atıf kurun. Bütünlük, kaynak izi, iddia desteği ve kaynak doğruluğunu ayırın."
lessonOrder: 9
learningStage: "systems"
prerequisites: ["structured-vs-unstructured-memory"]
learningObjectives: ["Kanıt aralığını sabit kaynakta doğrulamak", "Hash ile kaynak özgünlüğünü ayırmak", "Denetim kaydı ve desteksiz yanıt davranışı tasarlamak"]
---

## Dört kontrol, dört ayrı sonuç

Asistan “Salon cumaları onda açılır” diyor ve bağlantı gösteriyor. Gerçek bağlantı yalnızca ilk adımdır. Kaynak var mı, atıf pasajı yanıtın dediğini söylüyor mu, kaynak bu zaman ve kapsama uygulanıyor mu, kaynak güvenilir mi? Bunları ayrı sorun. Bir kontrolü geçmek diğerlerini sağlamaz.

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

Konumlar ancak çıkarımda kullanılan tam kaynak temsiline göre anlamlıdır. Bayt, Unicode kod noktası veya başka birim mi sayıldığını ve bitişin dışarıda olup olmadığını belirtin. Unicode normalizasyonu, PDF çıkarımı veya satır sonu dönüşümü konumları değiştirebilir. Değişmez kaynak revizyonunu ve metni yeniden üretmeye yetecek bilgiyi tutup çıkarılan aralığın eşleşmesini doğrulayın.

SHA-256 gibi özet, güvenilen beklenen özete göre uyuşmazlığı belirler. Saldırgan uydurma metni de gerçek metin kadar kolay hash’leyebilir. Metin ve beklenen hash aynı güvenilmeyen taraftan geliyorsa eşitlik özgünlük kanıtı değildir. Kaynak edinimi, doğrulanmış yayıncı kimliği ve teslim zinciri kayıtları problemin başka parçalarını çözer.

## Yanıttan kaynağa zinciri koruyun

<!-- diagram: Yanıt iddiası iddiaya, tam aralığa, kaynak revizyonuna ve edinim kaydına bağlanır. -->
1. Yanıt · cuma onda
2. İddia · a42 + koşullar
3. Aralık · tam destek metni
4. Revizyon · handbook-r3
5. Köken · edinim kaydı

*Atıf inceleyenin hattı yeniden kurmadan kanıtı kontrol etmesini sağlamalıdır.*

Alıntıyı incelenebilir ölçüde dar tutun; gerektiğinde niteleyici cümleyi ekleyin. “1 Kasım sonrası cumaları” olmadan “onda açılır” ifadesi ekim sorusunu desteklemez. Tek atfı paragrafa iliştirip her cümleyi kapsadığını varsaymak yerine çok iddialı yanıtta desteklenmeyen parçaları işaretleyin.

## Özel veriyi çoğaltmadan kararları kaydedin

Retrieval kararında istek/çalışma kimliği, çağıran kapsam kimliği, kaynak nesli, aday kimlikleri, filtre gerekçeleri ve son kanıt kimliklerini kaydedin. Özel belgeleri bütünüyle log’a kopyalamak yerine referans tercih edin. Hassas değerleri hata mesajlarından çıkarın. Denetim kaydı da erişim, saklama ve silme kuralı ister; “her şeyi log’la” denetimsiz başka hafıza deposu yaratır.

Uygun kaynak yanıtı desteklemiyorsa kanıt boşluğunu açıkça döndürün veya daha dar soru isteyin. Atıf biçimi ve retrieval ile kaynaklandırma bazı desteksiz çıktıları azaltabilir; halüsinasyonu ortadan kaldırmaz. W3C PROV türetim sözlüğü sunar; OWASP getirilen materyalin talimat olarak neden güvenilmez kalacağını açıklar. Bunlar tamamlayıcı konulardır. [PROV](https://www.w3.org/TR/prov-overview/), [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

## Bağlantıyı değil iddiayı test edin

> [!EXERCISE]
> **Kendinizi sınayın**
> Belge SHA-256 özetiyle eşleşiyor; fakat belgeyi bilinmeyen kullanıcı yüklemiş. Ne sonuç çıkarabilirsiniz?
>
> **Answer:** Yalnızca verilen baytların belirtilen yöntemle o özete uyduğunu söyleyebilirsiniz. Köken/özgünlük değerlendirmesi ve pasajın cevabı desteklediğine ayrı kontrol gerekir. Sağlama toplamı kaynak doğruluğunu sertifikalandırmaz.

## Kaynaklar ve ileri okuma

1. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
2. [OWASP · LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

