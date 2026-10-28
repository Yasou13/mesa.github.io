---
id: "build-a-small-search-lab"
slug: "build-a-small-search-lab"
type: "learn"
language: "tr"
title: "Dil modeli olmadan küçük bir arama sistemi kurun"
subtitle: ""
summary: "Python ve SQLite ile tam bir örnek çalıştırın. Sonucu tahmin edin, değişiklikler yapın ve daha önce çalışan davranışları koruyan testler ekleyin."
shortAnswer: "Python ve SQLite ile tam bir örnek çalıştırın. Sonucu tahmin edin, değişiklikler yapın ve daha önce çalışan davranışları koruyan testler ekleyin."
category: "Practice"
tags: ["Python", "SQLite", "FTS5", "lab", "tutorial", "uygulama", "laboratuvar", "kod"]
author: "MESA contributors"
publishedAt: "2026-10-18"
updatedAt: "2026-10-28"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Dil modeli olmadan küçük bir arama sistemi kurun — MESA"
seoDescription: "Python ve SQLite ile tam bir örnek çalıştırın. Sonucu tahmin edin, değişiklikler yapın ve daha önce çalışan davranışları koruyan testler ekleyin."
lessonOrder: 14
learningStage: "practice"
prerequisites: ["evaluating-ndcg-and-mrr-in-memory"]
learningObjectives: ["Bellek içi küçük sözcüksel arama bileşeni çalıştırmak", "Kapsamı serbest metin sorgusundan ayırmak", "Etiketli test ve sabit kaynak kimliği eklemek"]
---

## Ne kuracaksınız?

Bu alıştırmada küçük bir arşivden ilgili kaynak pasajını bulan program kuracaksınız. Python’ın standart `sqlite3` modülü ve FTS5 desteği açık bir SQLite yeterlidir. Model, ağ çağrısı, temsil modeli indirme veya MESA sunucusu gerekmez. Kodu `search_lab.py` adıyla kaydedip `python3 search_lab.py` komutuyla çalıştırın. “no such module: fts5” hatası alırsanız FTS5 içeren bir Python/SQLite kurulumu kullanın.

Örnek, izin verilen her deneme veri kümesi için ayrı FTS tablosu açar. Böylece bu küçük alıştırmada arama istatistikleri de ayrı tutulur. Bu, canlı bir sistemin erişim alanlarını yönetmek için hazır bir çözüm değildir. Kimlik doğrulama, kapsam belirleme, şema, kaynak sınırları ve kayıtların yaşam döngüsü ayrıca tasarlanmalıdır. Koddaki sabit `allowed_archive` eşlemesi, kullanıcının isteminden gelen bir değer değil, güvenilir sunucu kararını temsil eder.

## Tam örneği çalıştırın

```text
import sqlite3

with sqlite3.connect(":memory:") as db:
    db.execute("CREATE VIRTUAL TABLE atlas USING fts5(source_id UNINDEXED, body)")
    db.executemany("INSERT INTO atlas VALUES (?, ?)", [
        ("handbook-r3/c1", "Atlas reading room opens at 10:00 on Friday."),
        ("handbook-r3/c2", "Atlas reading room opens at 09:00 on Monday."),
        ("directory-r1/c1", "The garden is closed on Friday."),
    ])
    # Only trusted identifiers are interpolated; query text is bound.
    allowed_archive = {"archive-reader": "atlas"}
    table = allowed_archive["archive-reader"]
    query = '"reading room" AND Friday'
    rows = db.execute(
        f"SELECT source_id, body FROM {table} "
        f"WHERE {table} MATCH ? ORDER BY bm25({table}), source_id LIMIT ?",
        (query, 3),
    ).fetchall()
    assert [row[0] for row in rows] == ["handbook-r3/c1"]
    for source_id, body in rows:
        print(source_id, "|", body)
```

Öbek sorgusu “reading room” kelimelerini birlikte, `AND Friday` ise ayrıca Friday kelimesini ister. Pazartesi pasajında Friday, bahçe pasajında öbek yoktur. Assert bu veri için tekrar üretilebilir beklenen sonuçtur; doğruluk ölçümü değildir. SQLite FTS5 daha iyi eşleşmeye daha küçük BM25 verdiğinden artan sıralama doğrudur. [FTS5 referansı](https://www.sqlite.org/fts5.html).

## Programı ders modeliyle izleyin

<!-- diagram: Güvenilir arşiv seçimi sözcüksel adayları sınırlar; sonuç inceleme için kaynak kimliğini korur. -->
1. Güvenilir eşleme · atlas
2. Parametreli MATCH · sorgu
3. BM25 sırası · yalnızca bu veri kümesi
4. Sınır · üç aday
5. İncele · kaynak kimliği + metin

*Bu örnek yalnızca arama yapar; arka planda yanıt üretmez veya bilgi çıkarmaz.*

SQL parametreleri sorgu değerinin SQL komutuna dönüşmesini önler; ancak FTS’nin kendi sorgu dilini kapatmaz. Kullanıcı girdisindeki `OR`, tırnaklar veya bozuk sözdizimi için hâlâ açık arama kuralları ve hata yönetimi gerekir. Tablo adı `?` parametresiyle verilemez. Örnek bu yüzden yalnızca kodda belirlenmiş güvenilir eşlemeyi kullanır; bunu keyfî kullanıcı girdisiyle değiştirmeyin.

## Tek değişiklik yapıp sonucu öngörün

Friday yerine Monday yazıp beklenen kimliği c2 yapın. Sonra salonun bakım nedeniyle kapalı olduğunu belirten ikinci bir cuma pasajı ekleyin. Artık iki metin de aynı sözcüklere uyar: Arama çelişkiyi bulmuştur, çözmemiştir. Güncel yanıtı seçmeden önce kaynak sürümü ve geçerlilik bilgisi ekleyin. Son olarak “last working day” ifadesini deneyin. Bu sözcük tabanlı yöntem, ifadenin Friday anlamında kullanıldığını kendi başına bilemez.

Etiketli sorguları ve beklenen kaynak kimliklerini bir dosyada tutun; önceki dersteki Recall@k ile MRR ölçümlerini hesaplayın. Ayar yaparken hiç kullanmadığınız bir test kümesi ayırın. Sözcük tabanlı aramanın hatalarını anladıktan sonra anlamsal arama veya yeniden sıralama ekleyin. Gerçek MESA bağlantısı için erişim bilgileri ve sağlayıcı gereksinimleri bulunan hızlı başlangıca geçin. Bu alıştırma bağımsız bir eğitim örneğidir.

## Gösterimin sınırını bulun

> [!EXERCISE]
> **Kendinizi sınayın**
> Kod beklenen kaynağı döndürüyor. Bu, kılavuzun güncel, yanıtın doğru ve üst erişim alanı yalıtımının canlı kullanıma hazır olduğunu kanıtlar mı?
>
> **Açıklama:** Hayır. Assert kontrollü veride tek arama davranışını doğrular. Geçerlilik, kaynak güveni, kimlik doğrulama, eşzamanlılık, silme ve üretim kapasitesi ayrı test ve uygulama ister.

## Kaynaklar ve ileri okuma

1. [SQLite · FTS5 reference](https://www.sqlite.org/fts5.html)
2. [Manning, Raghavan & Schütze · Evaluation of ranked retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)
3. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

