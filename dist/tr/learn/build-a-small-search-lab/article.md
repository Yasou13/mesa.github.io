---
id: "build-a-small-search-lab"
slug: "build-a-small-search-lab"
type: "learn"
language: "tr"
title: "LLM kullanmadan küçük bir arama laboratuvarı kurun"
subtitle: ""
summary: "Tam Python/SQLite örneğini çalıştırın, sonucunu öngörün ve etiketli gerileme örneği ekleyin. Dersleri incelenebilir programa bağlayın."
shortAnswer: "Tam Python/SQLite örneğini çalıştırın, sonucunu öngörün ve etiketli gerileme örneği ekleyin. Dersleri incelenebilir programa bağlayın."
category: "Practice"
tags: ["Python", "SQLite", "FTS5", "lab", "tutorial", "uygulama", "laboratuvar", "kod"]
author: "MESA contributors"
publishedAt: "2026-10-18"
updatedAt: "2026-10-18"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "LLM kullanmadan küçük bir arama laboratuvarı kurun — MESA Learn"
seoDescription: "Tam Python/SQLite örneğini çalıştırın, sonucunu öngörün ve etiketli gerileme örneği ekleyin. Dersleri incelenebilir programa bağlayın."
lessonOrder: 14
learningStage: "practice"
prerequisites: ["evaluating-ndcg-and-mrr-in-memory"]
learningObjectives: ["Bellek içi küçük sözcüksel retriever çalıştırmak", "Kapsamı serbest metin sorgusundan ayırmak", "Etiketli test ve sabit kaynak kimliği eklemek"]
---

## Ne kuracaksınız?

Bu laboratuvar küçük arşivden bir kaynak pasajı getirir. Python’ın standart `sqlite3` modülü ve FTS5 etkin SQLite gerekir. Model, ağ çağrısı, embedding indirme veya MESA sunucusu gerekmez. Kodu `search_lab.py` olarak kaydedip `python3 search_lab.py` çalıştırın. FTS5 yoksa SQLite “no such module: fts5” der; bunu içeren Python/SQLite dağıtımı kullanın.

Örnek her izinli gösterim veri kümesi için ayrı FTS tablosu açar. Bu küçük alıştırmada aday istatistiğini yerel tutar. Üretim tenant stratejisi değildir; doğrulanmış kapsam çözümü, şema yönetimi, kaynak sınırı ve yaşam döngüsü ayrı tasarım ister. Sabit `allowed_archive` eşlemesi güvenilir sunucu kararını temsil eder; prompt’tan alınan değer değildir.

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
3. BM25 sırası · yerel corpus
4. Sınır · üç aday
5. İncele · kaynak kimliği + metin

*Bu yalnızca retrieval’dır. Örnekte gizli yanıt üretimi veya iddia çıkarımı yoktur.*

SQL parametresi sorgu değerinin SQL sözdizimine dönüşmesini önler; FTS sorgu dilini kapatmaz. `OR`, tırnak veya bozuk sözdizimi içeren kullanıcı girdisi hâlâ açık arama politikası ve hata yönetimi ister. Tablo kimliği `?` ile bağlanamaz; örnek yalnızca kodda sabit güvenilir eşlemeyi yerleştirir. Bu eşlemeyi keyfî kullanıcı girdisiyle değiştirmeyin.

## Tek değişiklik yapıp sonucu öngörün

Friday yerine Monday yazıp beklenen kimliği c2 yapın. Salonun bakım için kapalı olduğunu söyleyen ikinci cuma pasajı ekleyin. Artık ikisi de kelimelere uyar: retrieval çatışmayı gösterdi, çözmedi. Güncel cevabı seçmeden kaynak revizyonu ve geçerlilik ekleyin. Son olarak “last working day” deneyin; bu sözcüksel taban onun Friday anlamında kullanıldığını bilmez.

Etiketli sorgu ve beklenen kaynak kimliği dosyası oluşturup önceki dersten Recall@k ve MRR hesaplayın. Dokunulmamış test kümesi tutun. Sözcüksel hatayı anladıktan sonra yoğun retrieval veya reranker ekleyin. Gerçek MESA entegrasyonu için credential ve sağlayıcı içeren sürüme sabit hızlı başlangıca geçin; bu laboratuvar bağımsız eğitim kodudur.

## Gösterimin sınırını bulun

> [!EXERCISE]
> **Kendinizi sınayın**
> Kod beklenen kaynağı döndürüyor. Bu, kılavuzun güncel, yanıtın doğru ve tenant yalıtımının üretime hazır olduğunu kanıtlar mı?
>
> **Answer:** Hayır. Assert kontrollü veride tek retrieval davranışını doğrular. Geçerlilik, kaynak güveni, kimlik doğrulama, eşzamanlılık, silme ve üretim kapasitesi ayrı test ve uygulama ister.

## Kaynaklar ve ileri okuma

1. [SQLite · FTS5 reference](https://www.sqlite.org/fts5.html)
2. [Manning, Raghavan & Schütze · Evaluation of ranked retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

