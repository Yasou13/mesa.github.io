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
updatedAt: "2026-11-24"
readingMinutes: 7
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

Bu değişiklikleri sırayla yapın. Her biri sözcük tabanlı aramanın farklı bir sınırını gösterir.

1. Sorgudaki `Friday` sözcüğünü `Monday`, beklenen kimliği `handbook-r3/c2` yapın. Çalıştırın, sonra ikisini de geri alın.
2. Şu pasajı ekleyin: `("notice-r1/c1", "Atlas reading room is closed for maintenance on Friday.")`. İki pasaj eşleştiği için doğrulama artık başarısız olur. Arama bir çelişkiyi ortaya çıkardı ama çözmedi. Güncel yanıtı seçmek için kaynak sürümü ve geçerlilik bilgisi gerekir.
3. `"last working day"` ifadesini arayın. Sonuç dönmez; çünkü bu sözcük tabanlı temel sistem, ifadenin cuma anlamına gelebileceğini bilmez.
4. Kapanış tırnağı eksik `"reading` sorgusunu deneyin. SQLite `OperationalError` verir; gerçek bir arama akışında hata yönetimi gerekir.

Şimdi bu kontrolleri küçük bir etiketli teste dönüştürün. Kodu `search_eval.py` olarak kaydedip `python3 search_eval.py` komutuyla çalıştırın. Yalnızca standart kütüphaneyi kullanır.

```text
import sqlite3

PASSAGES = [
    ("handbook-r3/c1", "Atlas reading room opens at 10:00 on Friday."),
    ("handbook-r3/c2", "Atlas reading room opens at 09:00 on Monday."),
    ("directory-r1/c1", "The garden is closed on Friday."),
    ("notice-r1/c1", "Atlas reading room is closed for maintenance on Friday."),
]
JUDGED = [
    ('"reading room" AND Friday', "handbook-r3/c1"),
    ('"reading room" AND Monday', "handbook-r3/c2"),
    ("garden", "directory-r1/c1"),
    ('"last working day"', "handbook-r3/c1"),
]

def search(db, query, limit=3):
    try:
        rows = db.execute(
            "SELECT source_id FROM atlas WHERE atlas MATCH ? "
            "ORDER BY bm25(atlas), source_id LIMIT ?",
            (query, limit),
        ).fetchall()
    except sqlite3.OperationalError:
        return []  # Malformed FTS syntax is a failed search, not a crash.
    return [row[0] for row in rows]

with sqlite3.connect(":memory:") as db:
    db.execute("CREATE VIRTUAL TABLE atlas USING fts5(source_id UNINDEXED, body)")
    db.executemany("INSERT INTO atlas VALUES (?, ?)", PASSAGES)

    reciprocal_ranks = []
    for query, expected in JUDGED:
        results = search(db, query)
        rank = results.index(expected) + 1 if expected in results else None
        reciprocal_ranks.append(1 / rank if rank else 0)
        print(f"{query:<28} rank={rank} results={results}")

    hits = sum(1 for value in reciprocal_ranks if value > 0)
    print(f"Recall@3: {hits / len(JUDGED):.2f}")
    print(f"MRR: {sum(reciprocal_ranks) / len(JUDGED):.2f}")
    print("Malformed query:", search(db, '"reading'))
```

Beklenen çıktı (Python `sqlite3`, SQLite 3.46.1 ile denendi):

```text
"reading room" AND Friday    rank=1 results=['handbook-r3/c1', 'notice-r1/c1']
"reading room" AND Monday    rank=1 results=['handbook-r3/c2']
garden                       rank=1 results=['directory-r1/c1']
"last working day"           rank=None results=[]
Recall@3: 0.75
MRR: 0.75
Malformed query: []
```

0,75 puanları uydurma dört sorgudan geliyor; hesaplamayı öğretir, gerçek arama kalitesi hakkında bir şey söylemez. Ayrı bir test bölümü tutun ve onu her okuduğunuzda kaydedin. Yoğun (dense) aramayı veya yeniden sıralayıcıyı, sözcük tabanlı hataları anladıktan sonra ekleyin. Türkçe metin için [Türkçe Metinlerde BM25 Neden Zorlanır?](/research/bm25-turkish-prefix-matching/) yazısındaki tokenizer örneğini deneyin. MESA entegrasyonu için sürümü sabitlenmiş hızlı başlangıca geçin; bu laboratuvar bağımsız bir eğitim kodudur.

## Gösterimin sınırını bulun

> [!EXERCISE]
> **Kendinizi sınayın**
> Kod beklenen kaynağı döndürüyor. Bu, kılavuzun güncel, yanıtın doğru ve üst erişim alanı yalıtımının canlı kullanıma hazır olduğunu kanıtlar mı?
>
> **Açıklama:** Hayır. Assert kontrollü veride tek arama davranışını doğrular. Geçerlilik, kaynak güveni, kimlik doğrulama, eşzamanlılık, silme ve üretim kapasitesi ayrı test ve uygulama ister.

## Kaynaklar ve ileri okuma

1. [SQLite · FTS5 reference](https://www.sqlite.org/fts5.html)
2. [Manning, Raghavan & Schütze · Evaluation of ranked retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)
3. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)

