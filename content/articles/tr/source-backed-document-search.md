---
id: "source-backed-document-search"
slug: "source-backed-document-search"
type: "guide"
language: "tr"
title: "Kaynak gösteren belge araması nasıl kurulur?"
subtitle: ""
summary: "Belgeyi kaynak bilgisiyle ekleyin, yerelde arayın, güncelleyin ve sonuçların geçerli sürümden geldiğini kontrol edin."
shortAnswer: "MESA Core’u kurun, yerel sunucuyu başlatın, her metin dosyasını sabit bir --source değeriyle ekleyin ve mesa search ile arayın. Sonuçlar eşleşen metni ve belge kimliğini döndürür; böylece yanıtı kaynağıyla kontrol edebilirsiniz."
category: "Document Memory"
tags: ["document-search", "provenance", "mesa-core"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-24"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "Kaynak Gösteren Belge Araması Nasıl Kurulur? — MESA"
seoDescription: "Metin belgelerini MESA Core’a ekleyin, yerelde arayın, yeni sürüm yükleyin ve her sonucun kaynağına bağlandığını doğrulayın."
---

## 1. Gerekenleri kontrol edin

- Python 3.11, 3.12 veya 3.13
- Linux, macOS veya WSL
- UTF-8 metin dosyaları. PDF ve Word dosyalarını önce metne dönüştürün.

Bu rehber sözcük aramasını kullanır, bu yüzden model hesabı gerekmez. MESA Core alfa aşamasındadır ve canlı kullanıma hazır değildir.

24 Kasım 2026’da PyPI’daki `mesa-memory` 0.9.4 ile denendi. Belge kimlikleriniz farklı olabilir.

## 2. MESA Core’u kurup başlatın

Bunu yeni bir klasörde çalıştırın ve terminali açık bırakın.

```text
python3 -m venv .venv
. .venv/bin/activate
python -m pip install mesa-memory==0.9.4
mesa start
```

## 3. Belgeyi kaynağıyla ekleyin

Aynı klasörde ikinci bir terminal açın. Güncelleme ve silmede belgeyi tanımladığı için sabit bir `--source` kullanın.

Önce sunucunun hazır olduğunu doğrulayın:

```text
. .venv/bin/activate
mesa status
```

```text
MESA Server: http://127.0.0.1:8000
Readiness (/health/init): ready
Health (/health): healthy
```

```text
. .venv/bin/activate
printf '%s\n' 'Refunds are accepted within 30 days of purchase.' 'Damaged items are replaced at no cost.' > refund-policy.txt
mesa add refund-policy.txt --source file://refund-policy.txt
```

`mesa add`, belge aranabilir olana kadar bekler:

```text
Added document doc-72f2f9bee031b87753ed5b3b1affae68 with 1 chunk(s)
searchable
```

## 4. Arayın ve kaynağı inceleyin

```text
mesa search "refund days"
```

Sonuç aşağıdaki gibi görünür. Belge kimliğiniz farklı olabilir.

```text
[1] score: 0.016 | doc-72f2f9bee031b87753ed5b3b1affae68
    Refunds are accepted within 30 days of purchase.
    Damaged items are replaced at no cost.
```

Modeller kapalıyken birleştirilen tek kanal BM25’tir; birinci sıradaki eşleşme 1/61, yani yaklaşık 0,016 puan alır. Bu sayı bir sıralama işaretidir, kalite notu değildir.

> [!WARNING]
> **Puan kanıt değildir**
> Puan, bu sorgudaki sonuçları sıralar. Metnin doğru olma olasılığı değildir. Kullanmadan önce dönen bölümü okuyun.

## 5. Belgeyi güncelleyin

Değişen metni aynı kaynakla ekleyin. MESA aynı belgenin yeni sürümünü oluşturur ve arama güncel metni kullanır.

```text
printf '%s\n' 'Refunds are accepted within 45 days of purchase.' 'Damaged items are replaced at no cost.' > refund-policy.txt
mesa add refund-policy.txt --source file://refund-policy.txt
mesa search "refund days"
```

Sonuç artık 45 gün demelidir.

## 6. Kaynağa göre silin

```text
mesa delete --source file://refund-policy.txt
```

Beklenen çıktı ve ardından aynı arama:

```text
Purged document doc-72f2f9bee031b87753ed5b3b1affae68
$ mesa search "refund days"
No matching memories found.
```

Silmeden sonra aynı arama belgeyi döndürmemelidir. Ardından ilk terminalde Ctrl+C ile sunucuyu durdurun.

## Sık görülen hatalar ve çözümleri neler?

| Gördüğünüz | Neden | Çözüm |
| --- | --- | --- |
| `mesa add: error: the following arguments are required: --source` | Kaynak bilgisi yok | `--source` ekleyin; örneğin `--source file://refund-policy.txt` |
| `File not found: nope.txt` | Yol yanlış | Dosya adını ve bulunduğunuz klasörü kontrol edin |
| `UnicodeDecodeError: 'utf-8' codec can't decode byte` | Dosya UTF-8 değil | Aşağıdaki gibi önce dönüştürün |
| `No matching memories found.` | Hiçbir belgede sorgu sözcükleri yok | Metinde geçen sözcükleri deneyin veya anlam tabanlı arama için bir model açın |

Eski Türkçe dosyalar çoğu zaman Windows-1254 kodlamasıyla kaydedilmiştir. 0.9.4’te böyle bir dosya `mesa add` komutunu kısa bir mesaj yerine Python hata dökümüyle durdurur. Dosyayı UTF-8’e dönüştürüp dönüştürülmüş dosyayı ekleyin:

```text
iconv -f WINDOWS-1254 -t UTF-8 notes.txt > notes-utf8.txt
mesa add notes-utf8.txt --source file://notes.txt
```

Sorgularda Türkçe harfler önemlidir. 0.9.4 üzerindeki denememizde `YARGITAY` ve `sözleşme` sorguları `Yargıtay` ve `sözleşmesinin` geçen satırı buldu; ASCII `yargitay` sorgusu ise hiçbir şey bulmadı. Ararken `ı`, `ğ`, `ş` ve diğer Türkçe harfleri kullanın. Nedenini [Türkçe Metinlerde BM25 Neden Zorlanır?](/research/bm25-turkish-prefix-matching/) yazısı açıklar.

## Belge araması hakkında sorular

**Başlamak için embedding gerekir mi?**
: Hayır. Sözcük araması modelsiz çalışır. Anlam tabanlı arama gerekirse sonra model sağlayıcısı ekleyin.

**PDF dosyalarını doğrudan ekleyebilir miyim?**
: CLI UTF-8 metin dosyalarını okur; PDF ve Word dosyalarını önce dönüştürün.

**MESA son yanıtı yazar mı?**
: Hayır. Kaynak metni döndürür. Yanıtı uygulamanız ve dil modeli yazar.

## Kaynaklar

1. [MESA Core · Başlangıç](docs/core/getting-started/)
2. [MESA Core · CLI referansı](docs/core/cli-reference/)
3. [PyPI’da mesa-memory 0.9.4](https://pypi.org/project/mesa-memory/0.9.4/)

> [!NOTE]
> **MESA’da ne ölçtük?**
> Arama sonuçları çıkarılmış hukuki öğeler taşıyabilir. [Bu çıkarıcıyı](/research/turkish-legal-citation-extraction/) 150 etiketli parçada ölçtük (MESA 0.9.4): 357 doğru öğe, 25 yanlış sonuç, 18 eksik.

