---
id: "sqlite-as-canonical-agent-memory"
slug: "sqlite-as-canonical-agent-memory"
type: "learn"
language: "tr"
title: "Ana kayıt ve arama görünümleri: yarım kalan yazmayı tamamlamak"
subtitle: ""
summary: "Bir değişikliğin SQL, vektör ve çizge depolarına nasıl yazıldığını izleyin. Yeniden denemeyi, güvenli tekrarı ve arama görünümlerini yeniden kurmayı öğrenin."
shortAnswer: "Bir değişikliğin SQL, vektör ve çizge depolarına nasıl yazıldığını izleyin. Yeniden denemeyi, güvenli tekrarı ve arama görünümlerini yeniden kurmayı öğrenin."
category: "Evidence & Trust"
tags: ["SQLite", "outbox", "idempotency", "projection", "LanceDB", "Kuzu", "projeksiyon", "kalıcılık"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Ana kayıt ve arama görünümleri: yarım kalan yazmayı tamamlamak — MESA"
seoDescription: "Bir değişikliğin SQL, vektör ve çizge depolarına nasıl yazıldığını izleyin. Yeniden denemeyi, güvenli tekrarı ve arama görünümlerini yeniden kurmayı öğrenin."
lessonOrder: 11
learningStage: "systems"
prerequisites: ["structured-vs-unstructured-memory", "evidence-aware-memory"]
learningObjectives: ["Kanonik ve türetilmiş durumu ayırmak", "Depolar arasındaki çökmeden kurtulmak", "Idempotent yazma ve gözlenebilir durum tasarlamak"]
---

## Hangi deponun asıl kayıt olacağını belirleyin

Bir hafıza uygulaması asıl kayıtlar için SQL, benzerlik araması için vektör indeksi, ilişkiler için çizge kullanabilir. Üçü uyuşmazsa bir kaydın hâlâ var ve etkin olduğuna hangisi karar verecek? Ana kayıt deposu bu kararın dayanağıdır. Diğer arama görünümleri, asıl veriden tanımlı bir dönüşümle yeniden üretilebilir. “Türetilmiş” olmaları önemsiz olduklarını değil, asıl kayıt yerine geçmediklerini anlatır.

Bu örnekte SQL; kaynak sürümünü, bilgi kaydının kimliğini, durumunu ve değişiklik günlüğünü tutar. Vektör ve çizge satırları bu kimliklere bağlanır. Aramada bulunan bir sonuç ancak asıl kaydın uygunluğu denetlendikten sonra dayanak olarak kullanılabilir. Eski indekste kalan bir vektör, soruya yakın diye silinmiş bir kaydı yeniden geçerli hâle getirmemelidir.

## Depolar arasındaki çökmeyi izleyin

<!-- diagram: SQL mutasyonu ve gönderim kuyruğu işini kabul eder; ardından vektör/çizge arama görünümlerini çalışır ve görünürlük tamamlanır. -->
1. SQL işlemi · kaynak + gönderim kuyruğu
2. Worker · bekleyen işi al
3. Vektör · sabit kimlikle uygula
4. Çizge · sabit kimlikle uygula
5. Tamamla · arama görünümlerini doğrula

*SQL commit, bağımsız bütün arka uçları kapsayan tek atomik işlem oluşturmaz.*

SQL işlemi tamamlansın ve vektör yazılsın; süreç çizgeye yazmadan çöksün. Bekleyen iş kalıcı olarak tutulmuyorsa eksik adım kaybolabilir. Değişiklikle aynı SQL işleminde bir gönderim kuyruğu kaydı oluşturulmuşsa, yeniden başlayan çalışan işi bulup tekrar deneyebilir. Aktarım birden fazla kez yapılabileceği için aynı işlemi tekrarlamanın sonucu bozmaması gerekir.

## Tekrar denemede iş sahipliğini koruyun

Güvenli tekrar (idempotency), aynı mantıksal işlemi yeniden yapmanın son durumu değiştirmemesidir. Sabit işlem kimliği ve içeriği tanımlayan bir kimlik kullanın. Aynı anahtarın farklı içerikle kullanılmasını reddedin veya bu durumu açıkça belirlenmiş kurallarla yönetin. Her denemeye yeni rastgele kimlik vermek güvenli tekrar değil, kopya kayıt üretir. Zaman aşımı yalnızca istemcinin sonucu göremediğini söyler; yazmanın yapılmadığını kanıtlamaz.

Süreli iş sahipliği (lease), bir çalışanın işi geçici olarak üstlenmesini sağlar. Sahiplik anahtarı (fencing token) ise iş başka çalışana geçtiğinde eski çalışanın işlemi tamamlamasını önler. Yetkiyi yalnızca başlangıçta değil, kayıt durumu değişirken de kontrol edin. Yarışı sınamak için A çalışanını durdurun, işini B’ye devredin ve ardından A’yı sürdürün.

## SQLite neyi garanti eder?

SQLite kendi işlemleri için belirtilen varsayımlarda atomik commit ve çökme kurtarmayı belgeler. WAL okuyucularla yazıcının örtüşmesine izin verir; yazıcıları yine sıraya koyar. Gömülü depoları dağıtık çok yazıcılı veritabanına dönüştürmez. Dosya sistemi dayanıklılığı, yedekleme yöntemi ve checkpoint davranışı operasyon konularıdır. [Atomik commit](https://www.sqlite.org/atomiccommit.html), [WAL](https://www.sqlite.org/wal.html).

MESA Core v0.8.1’de her veri dizinini tek combined süreci yönetir; LanceDB ve Kùzu arama görünümleridir. Yeniden oluşturma çevrimdışıdır ve bütün veri dizinini kapsar. Tek bir üst erişim alanını çevrimiçi onarma işlemi değildir. Bunlar MESA’ya özgü sınırlardır; başka bir sistem farklı depolama düzeni seçebilir. Yeniden oluştururken asıl kanıtı ve temsil kimliğini koruyun; geçişten önce yeni görünümü doğrulayın. [Core sözleşmesi](docs/core/architecture/)

## Zaman aşımını yorumlayın

> [!EXERCISE]
> **Kendinizi sınayın**
> İstemci, vektör yazıldıktan sonra zaman aşımına uğruyor. Hemen yeni kimlikle bir yazma işlemi başlatmalı mı?
>
> **Açıklama:** Önce ilk işlemin durumunu kontrol edin. Yeniden deneme uygunsa aynı işlem kimliği ve güvenli tekrar kurallarıyla ilerleyin. Yeni kimlik, zaten kabul edilmiş işlemi çoğaltabilir. Zaman aşımı, istemcinin sonucu göremediğini gösterir; işlemin geri alındığını göstermez.

## Kaynaklar ve ileri okuma

1. [SQLite · Atomic Commit](https://www.sqlite.org/atomiccommit.html)
2. [SQLite · Write-Ahead Logging](https://www.sqlite.org/wal.html)
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

