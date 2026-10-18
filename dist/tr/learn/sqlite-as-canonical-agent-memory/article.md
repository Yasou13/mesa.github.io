---
id: "sqlite-as-canonical-agent-memory"
slug: "sqlite-as-canonical-agent-memory"
type: "learn"
language: "tr"
title: "Kanonik depo ve projeksiyonlar: yarım yazmadan kurtulmak"
subtitle: ""
summary: "Bir mutasyonu SQL, vektör ve çizge depolarında izleyin. Kalıcı kabulü, tekrarı, idempotency ve projeksiyon rebuild’ini anlayın."
shortAnswer: "Bir mutasyonu SQL, vektör ve çizge depolarında izleyin. Kalıcı kabulü, tekrarı, idempotency ve projeksiyon rebuild’ini anlayın."
category: "Evidence & Trust"
tags: ["SQLite", "outbox", "idempotency", "projection", "LanceDB", "Kuzu", "projeksiyon", "kalıcılık"]
author: "MESA contributors"
publishedAt: "2026-10-17"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Kanonik depo ve projeksiyonlar: yarım yazmadan kurtulmak — MESA Learn"
seoDescription: "Bir mutasyonu SQL, vektör ve çizge depolarında izleyin. Kalıcı kabulü, tekrarı, idempotency ve projeksiyon rebuild’ini anlayın."
lessonOrder: 11
learningStage: "systems"
prerequisites: ["structured-vs-unstructured-memory", "evidence-aware-memory"]
learningObjectives: ["Kanonik ve türetilmiş durumu ayırmak", "Depolar arasındaki çökmeden kurtulmak", "Idempotent yazma ve gözlenebilir durum tasarlamak"]
---

## Kimlik ve yaşam döngüsü için otorite belirleyin

Hafıza uygulaması kaynak kayıtları için SQL, benzerlik için vektör indeksi, ilişkiler için çizge kullanabilir. Üçü uyuşmazsa iddianın var ve etkin olduğuna hangisi karar verir? Kanonik depo bu kararın sahibidir. Projeksiyon, kanonik veri ve beyan edilmiş dönüşümden yeniden kurulabilen türetilmiş temsildir. “Türetilmiş” önem veya arama kalitesini değil otoriteyi anlatır.

Örnek tasarımda SQL kaynak revizyonunu, iddia kimliğini, durumu ve mutasyon defterini sahiplenir. Vektör ve çizge satırı bu kimliklere bağlanır. Arama isabeti ancak kanonik uygunluk kontrolünden sonra kanıt olur. Eski indeks satırı, vektörü sorguya yakın diye silinmiş iddiayı diriltmemelidir.

## Depolar arasındaki çökmeyi izleyin

<!-- diagram: SQL mutasyonu ve outbox işini kabul eder; ardından vektör/çizge projeksiyonları çalışır ve görünürlük tamamlanır. -->
1. SQL işlemi · kaynak + outbox
2. Worker · bekleyen işi al
3. Vektör · sabit kimlikle uygula
4. Çizge · sabit kimlikle uygula
5. Tamamla · projeksiyonları doğrula

*SQL commit, bağımsız bütün arka uçları kapsayan tek atomik işlem oluşturmaz.*

SQL commit olsun, vektör ekleme başarılı olsun; süreç çizge eklemeden çöksün. Kalıcı bekleyen iş yoksa çizge yazması tamamen kaybolabilir. Kanonik mutasyonla aynı SQL işleminde kaydedilmiş outbox varsa yeniden başlayan worker eksik işi bulup tekrarlar. Teslim birden fazla kez gerçekleşebilir; etkiyi tekrarlamak bu yüzden güvenli olmalıdır.

## Kimlik ve fencing ile güvenli tekrar

Idempotency aynı mantıksal işlemi yeniden uygulamanın farklı son etki oluşturmamasıdır. Sabit işlem kimliği ve tanımlı payload kimliği kullanın. Aynı anahtarı başka içerikle kullanmak reddedilmeli veya açık sözleşmeyle yönetilmelidir. Her tekrarda rastgele kimlik üretmek idempotency değil kopya üretir. Timeout, çağıranın tamamlanmayı gözlemediğini söyler; yazma olmadığını kanıtlamaz.

Lease, worker’ın işi geçici sahiplenmesini sağlar. Fencing token veya eşdeğer sahiplik kontrolü başka sahip devraldıktan sonra eski worker’ın işi tamamlamasını önler. Sahipliği yalnızca başlangıçta değil gerçek durum değişikliğinde kontrol edin. A worker’ını durdurup iznini düşürün, B’ye devrettikten sonra A’yı sürdürerek yarışı test edin.

## SQLite neyi garanti eder?

SQLite kendi işlemleri için belirtilen varsayımlarda atomik commit ve çökme kurtarmayı belgeler. WAL okuyucularla yazıcının örtüşmesine izin verir; yazıcıları yine sıraya koyar. Gömülü depoları dağıtık çok yazıcılı veritabanına dönüştürmez. Dosya sistemi dayanıklılığı, yedekleme yöntemi ve checkpoint davranışı operasyon konularıdır. [Atomik commit](https://www.sqlite.org/atomiccommit.html), [WAL](https://www.sqlite.org/wal.html).

MESA Core v0.8.1 root başına tek combined owner kullanır; LanceDB/Kùzu projeksiyondur. Rebuild çevrimdışı ve tüm root kapsamındadır; çevrimiçi tenant başına onarım değildir. Bunlar ürüne özgü sınırlardır; başka sistem başka depolama seçebilir. Doğru rebuild, kanonik kanıtı ve temsil kimliğini korumayı; geçişten önce yeni projeksiyonu doğrulamayı gerektirir. [Core sözleşmesi](docs/core/architecture/).

## Timeout’u yorumlayın

> [!EXERCISE]
> **Kendinizi sınayın**
> İstemci vektör yazmasından sonra timeout alıyor. Hemen yeni kimlikle yeni mutasyon oluşturmalı mı?
>
> **Answer:** Önce özgün mutasyon durumunu inceleyin. Uygunsa tanımlı idempotency sözleşmesiyle tekrarlayın. Yeni kimlik zaten kabul edilmiş işlemi çoğaltabilir; timeout gözlem hatasıdır, rollback kanıtı değildir.

## Kaynaklar ve ileri okuma

1. [SQLite · Atomic Commit](https://www.sqlite.org/atomiccommit.html)
2. [SQLite · Write-Ahead Logging](https://www.sqlite.org/wal.html)
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

