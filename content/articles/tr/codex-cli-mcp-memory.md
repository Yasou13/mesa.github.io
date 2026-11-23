---
id: "codex-cli-mcp-memory"
slug: "codex-cli-mcp-memory"
type: "guide"
language: "tr"
title: "Codex CLI için MCP hafızası nasıl kurulur?"
subtitle: ""
summary: "Talimatları AGENTS.md’de tutun ve önceki Codex oturumlarını arayabilen yerel bir MCP sunucusu ekleyin."
shortAnswer: "Proje talimatlarını AGENTS.md’de tutun. Codex’e yerel MCP hafıza sunucusu eklemek için MESA Lore’u kurun, hook’larını /hooks ile onaylayın, sonra yeni oturum açıp memory_search aracını test edin."
category: "Coding Agents"
tags: ["codex-cli", "agent-memory", "mcp"]
author: "MESA contributors"
publishedAt: "2026-11-23"
updatedAt: "2026-11-23"
readingMinutes: 5
status: "published"
indexable: true
seoTitle: "Codex CLI için MCP Hafızası Nasıl Kurulur? — MESA"
seoDescription: "Codex CLI’a yerel MCP hafıza sunucusu ekleyin, hook’ları onaylayın ve proje kurallarını AGENTS.md’de tutarken eski oturumları arayın."
---

## 1. Talimatları geçmişten ayırın

Codex işe başlamadan önce `AGENTS.md` dosyalarını okur; standartlar ve proje kuralları için bunları kullanın. Hafıza sunucusunun görevi farklıdır: ajanın önceki oturumlarda ne olduğunu bulmasına yardım eder.

| İhtiyaç | Kullanın |
| --- | --- |
| Her görev için kurallar | AGENTS.md |
| Önceki kararlar ve hatalar | MCP hafızası |
| Sonraki oturum için not | MESA Lore devir notu |

## 2. MCP hafıza sunucusunu kurun

```text
git clone https://github.com/Yasou13/MESA_Lore.git
cd MESA_Lore
python3 -m venv .venv
.venv/bin/pip install .
.venv/bin/mesa-lore install
.venv/bin/mesa-lore doctor
```

Kurulum, Codex’in varsayılan MCP yapılandırması olan `~/.codex/config.toml` dosyasına `mesa-lore` sunucusunu, `~/.codex/hooks.json` dosyasına oturum hook’larını ekler. Değiştirdiği dosyaları önce yedekler.

> [!WARNING]
> **Mevcut geçmiş içe aktarılır**
> Kurulum, mevcut ajan dökümlerini de içe aktarır. Önce [özel projeleri hariç tutun](/docs/lore/data-and-privacy/).

## 3. Hook’ları onaylayın

Codex, yönetilmeyen hook’ların çalışmadan önce incelenip güvenilir olarak işaretlenmesini ister. Codex’i açın, `/hooks` çalıştırın ve MESA Lore komutlarını onaylayın. Onay olmadan otomatik yakalama ve oturum başı dizini çalışmaz.

## 4. Bağlantıyı doğrulayın

```text
codex mcp list
mesa-lore doctor
```

`codex mcp list` çıktısında `mesa-lore` görünmelidir. Codex içinde `/mcp` etkin sunucuları gösterir. `mesa-lore doctor`, Codex MCP ve hook’ları için `OK` bildirmelidir.

## 5. Hafızayı yeni oturumda test edin

1. Projede yeni bir Codex oturumu başlatın.
2. Şunu sorun: “memory_index çağır ve son çalışmaları özetle.”
3. Şunu sorun: “Son başarısız test düzeltmesini hafızada ara.”
4. Yanıtın gerçek bir kaynağa dayandığını kontrol edin.
5. Bir karar kaydedin: “Bunu hafızaya karar olarak kaydet.”

## Codex hafızası hakkında sorular

**Codex MCP ayarlarını nerede saklar?**
: Varsayılan olarak `~/.codex/config.toml` dosyasında. Güvenilir projeler `.codex/config.toml` da kullanabilir.

**MESA Lore, AGENTS.md’nin yerine geçer mi?**
: Hayır. AGENTS.md talimat verir, Lore geçmiş çalışmaları aranabilir yapar.

**Hafıza dizini neden görünmüyor?**
: Hook onaylanmamış olabilir. `/hooks` çalıştırın, yeni oturum açın ve `mesa-lore doctor` ile kontrol edin.

**Codex ve Claude Code aynı hafızayı kullanabilir mi?**
: Evet. MESA Lore iki ajanı aynı yerel veritabanında saklar ve projeye göre arar.

## Kaynaklar

1. [Codex · Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
2. [Codex · Model Context Protocol](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)
3. [Codex · Hooks](https://learn.chatgpt.com/docs/hooks)
4. [GitHub’da MESA Lore](https://github.com/Yasou13/MESA_Lore)

