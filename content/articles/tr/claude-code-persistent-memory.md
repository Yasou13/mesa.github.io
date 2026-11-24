---
id: "claude-code-persistent-memory"
slug: "claude-code-persistent-memory"
type: "guide"
language: "tr"
title: "Claude Code’a kalıcı hafıza nasıl eklenir?"
subtitle: ""
summary: "CLAUDE.md, otomatik hafıza ve aranabilir oturum geçmişini her konuşmaya her şeyi yüklemeden birlikte kullanın."
shortAnswer: "Kalıcı proje kurallarını CLAUDE.md’ye yazın, öğrenilen tercihleri otomatik hafızaya bırakın. Eski oturumlardaki karar ve başarısız denemeleri de bulmak istiyorsanız MESA Lore gibi yerel bir MCP hafıza sunucusu ekleyin."
category: "Coding Agents"
tags: ["claude-code", "agent-memory", "mcp"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-24"
readingMinutes: 7
status: "published"
indexable: true
seoTitle: "Claude Code’a Kalıcı Hafıza Nasıl Eklenir? — MESA"
seoDescription: "CLAUDE.md, otomatik hafıza ve yerel MCP hafıza sunucusunu birlikte kullanarak Claude Code’un kuralları korumasını ve eski oturumları bulmasını sağlayın."
---

## 1. Doğru hafıza katmanını seçin

Her Claude Code oturumu yeni bir bağlam penceresiyle başlar. Yararlı bilgiyi üç katman taşıyabilir ve her biri farklı bir sorunu çözer.

| Katman | Burada tutun | Burada tutmayın |
| --- | --- | --- |
| CLAUDE.md | Derleme komutları, kurallar ve proje standartları | Uzun günlükler veya geçici görev notları |
| Otomatik hafıza | Claude’un öğrendiği tercih ve düzeltmeler | Tüm ekibin uyması gereken kurallar |
| MESA Lore | Aranabilir geçmiş oturumlar, kararlar ve devir notları | Proje talimatlarının yerine geçecek içerik |

## 2. Kalıcı kuralları CLAUDE.md’ye yazın

Proje kökünde `CLAUDE.md` oluşturun ve kısa tutun. Her oturumda yeniden söyleyeceğiniz şeyleri yazın. Anthropic’in belgeleri her CLAUDE.md dosyasını 200 satırın altında tutmayı önerir.

```text
# Project rules
- Run npm test before finishing a change.
- Use TypeScript for new files.
- API handlers live in src/api/.
```

Yüklendiğini doğrulamak için oturumda `/context all` çalıştırıp `Memory files` listesine bakın.

## 3. Otomatik hafızayı kontrol edin

Otomatik hafıza yerel oturumlarda varsayılan olarak açıktır. Görmek veya açıp kapatmak için `/memory` kullanın. Claude Code oturum başında `MEMORY.md` dosyasının en fazla ilk 200 satırını veya 25KB’ını yükler.

> [!NOTE]
> **Yararlı tutun**
> Eskimiş notları düzeltin veya silin. Kısa ve doğru bir hafızayı ajan daha kolay izler.

## 4. Aranabilir oturum geçmişi ekleyin

Yerleşik hafıza, geçmişte olan her şey için bir arama dizini değildir. MESA Lore eski dökümleri tek bir yerel SQLite dosyasına aktarır. Yeni oturum kısa bir dizin alır ve gerektiğinde ayrıntıları arayabilir.

```text
git clone https://github.com/Yasou13/MESA_Lore.git
cd MESA_Lore
python3 -m venv .venv
.venv/bin/pip install .
.venv/bin/mesa-lore install
.venv/bin/mesa-lore doctor
```

`mesa-lore doctor` her bağlantının durumunu bildirir. Henüz hiçbir şeyin yapılandırılmadığı bir makinede şunu yazar:

```text
Schema version: v12
DB: ~/.local/share/mesa-lore/lore.db (4096 B), Last ingest: never
Claude Code MCP: missing | hooks: missing
Codex MCP: missing | hooks: missing
Antigravity MCP: missing | Claude Desktop MCP: missing
Warnings: none (0)
```

Başarılı bir kurulumdan sonra Claude Code satırı `Claude Code MCP: OK | hooks: OK` olur ve `Last ingest` bir zaman gösterir.

> [!WARNING]
> **İçe aktarılacakları gözden geçirin**
> Kurulum, mevcut Claude Code, Codex ve Antigravity dökümlerini yerel veritabanına aktarır. Çalıştırmadan önce [özel projeleri hariç tutun](/docs/lore/data-and-privacy/).

## 5. Yeni oturumda test edin

1. Aynı projede yeni bir Claude Code oturumu başlatın.
2. Şunu sorun: “memory_index kullanarak bu projedeki son çalışmaları özetle.”
3. Gerçek bir eski kararı sorun: “Giriş akışını neden değiştirdiğimizi hafızada ara.”
4. Dönen kaynağı açın ve yanıtı desteklediğini doğrulayın.

Araçlar görünmüyorsa `mesa-lore doctor` çalıştırın ve [sorun giderme](/docs/lore/troubleshooting/) sayfasına bakın.

> [!NOTE]
> **MESA Lore testlerinin ölçtükleri**
> Linux üzerinde mesa-lore 0.1.0 test paketi ve benchmark’ına göre oturum başlangıcı 432 token tuttu (163’ü dizin, 269’u araç tanımları). Bir çalıştırmada 10.000 parçada arama p95 değeri 84 ms CPU süresiydi. Oturuma dönerken uçtan uca token tasarrufu henüz ölçülmedi. Arama sözcük tabanlıdır; sorguda dökümde geçen sözcükler veya kökler bulunmalıdır.

## Hafıza çalışmazsa ne yapmalı?

| Gördüğünüz | Çözüm |
| --- | --- |
| `mesa-lore doctor` çıktısında `Claude Code MCP: missing` | `mesa-lore install` komutunu yeniden çalıştırın ve Claude Code’u yeniden başlatın |
| `Last ingest: never` | Kurulum henüz döküm aktarmadı. Bir oturumu bitirin, sonra `mesa-lore doctor` çalıştırın |
| Hafıza araçları var ama işe yarar sonuç dönmüyor | Önceki oturumda geçen sözcüklerle arayın; Lore eş anlamlı sözcükleri eşleştirmez |
| CLAUDE.md kuralları dikkate alınmıyor | `/context all` çalıştırın ve dosyanın Memory files altında listelendiğini kontrol edin |

Diğer durumlar için [MESA Lore sorun giderme](/docs/lore/troubleshooting/) sayfasına bakın.

## Claude Code hafızası hakkında sorular

**Claude Code önceki oturumları hatırlar mı?**
: Her oturum yeni başlar, ancak CLAUDE.md ve otomatik hafıza seçilen bilgileri oturumlar arasında taşıyabilir. Geçmişteki her mesajı aranabilir yapmazlar.

**Her şeyi CLAUDE.md’ye yazmalı mıyım?**
: Hayır. Her oturuma yüklendiği için kısa tutun ve yalnızca her seferinde işe yarayacak bilgileri yazın.

**MESA Lore, CLAUDE.md’nin yerine geçer mi?**
: Hayır. Talimatları CLAUDE.md’de tutun, eski çalışmaları bulmak için Lore’u kullanın.

**Bu kurulum dökümlerimi başka bir servise gönderir mi?**
: MESA Lore ağ çağrısı yapmaz. Claude Code ise getirilen hafızayı bağlam olarak model sağlayıcısına iletir.

## Kaynaklar

1. [Claude Code Docs · How Claude remembers your project](https://code.claude.com/docs/en/memory)
2. [GitHub’da MESA Lore](https://github.com/Yasou13/MESA_Lore)

