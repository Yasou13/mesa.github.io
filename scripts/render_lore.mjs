// MESA Lore product page, rendered per language.
// Facts follow mesa-lore 0.1.0 (efb3406). The test and benchmark figures were re-run from that
// commit on 23 November 2026; update them together with the version.
export const LORE_VERSION = '0.1.0';

const INSTALL = `git clone https://github.com/Yasou13/MESA_Lore.git
cd MESA_Lore
python3 -m venv .venv
.venv/bin/pip install .
.venv/bin/mesa-lore install
.venv/bin/mesa-lore doctor`;

const USAGE = `source .venv/bin/activate
mesa-lore search "why did login fail" --project my-app
mesa-lore index --project my-app
mesa-lore export --project my-app --out my-app.md
mesa-lore stats --days 30`;

export function lorePage({ header, footer, language, base, repo, external }) {
  const L = (en, tr) => language === 'tr' ? tr : en;
  const href = path => `${base}${path}`;
  const code = (id, label, text) => `<div class="learn-code"><div><span>${label}</span><button class="copy-button" type="button" data-copy-target="${id}">${L('Copy', 'Kopyala')}</button></div><pre tabindex="0" class="article-code" id="${id}"><code>${text.replaceAll('&', '&amp;').replaceAll('<', '&lt;')}</code></pre></div>`;
  const list = items => `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;

  const facts = [
    [L('Runs on', 'Çalıştığı yer'), L('Your computer, on CPU', 'Bilgisayarınız, CPU')],
    [L('Storage', 'Depolama'), L('One SQLite file', 'Tek SQLite dosyası')],
    [L('Model calls', 'Model çağrısı'), L('None', 'Yok')],
    [L('License', 'Lisans'), 'Apache-2.0']
  ];
  const steps = [
    [L('Capture', 'Yakala'), L('Hooks and transcript scans add past sessions to a local index. Agents can also save short notes.', 'Hook’lar ve döküm taramaları geçmiş oturumları yerel dizine ekler. Ajanlar kısa notlar da kaydedebilir.')],
    [L('Start small', 'Küçük başla'), L('With hooks, a new session receives a short index instead of the whole history. Other agents can request it through MCP.', 'Hook’lar sayesinde yeni oturum, geçmişin tamamı yerine kısa bir dizin alır. Diğer ajanlar bunu MCP ile isteyebilir.')],
    [L('Pull what is needed', 'Gerekeni çek'), L('The agent searches for details when it needs them and gets small passages with their sources.', 'Ajan, ayrıntıya ihtiyaç duyduğunda arama yapar ve kaynaklarıyla birlikte küçük bölümler alır.')],
    [L('Hand off', 'Devret'), L('A handoff tells the next session what was done, what was decided and what comes next.', 'Devir notu, sonraki oturuma nelerin yapıldığını, hangi kararların alındığını ve sırada ne olduğunu söyler.')]
  ];
  const agents = [
    ['Claude Code', 'MCP', L('SessionStart, Stop and SessionEnd hooks', 'SessionStart, Stop ve SessionEnd hook’ları')],
    ['Codex CLI', 'MCP', L('Same hooks, after you approve them with /hooks in Codex', 'Aynı hook’lar, Codex’te /hooks ile onayladıktan sonra')],
    ['Antigravity', 'MCP', L('Transcripts are scanned at server start or with ingest-pending', 'Dökümler sunucu başlarken veya ingest-pending ile taranır')],
    [L('Claude desktop', 'Claude masaüstü'), 'MCP', L('None. Chats on claude.ai and in the desktop chat tab are not captured', 'Yok. claude.ai ve masaüstü sohbet sekmesindeki sohbetler yakalanmaz')]
  ];
  const tools = [
    ['memory_index', L('Shows the short project index.', 'Kısa proje dizinini gösterir.')],
    ['memory_search', L('Finds relevant passages and notes.', 'İlgili bölümleri ve notları bulur.')],
    ['memory_get', L('Opens one result with its context.', 'Bir sonucu bağlamıyla açar.')],
    ['memory_save', L('Saves a decision, fact, todo, failed attempt or handoff.', 'Karar, bilgi, yapılacak iş, başarısız deneme veya devir notu kaydeder.')]
  ];
  const measured = [
    ['432', L('tokens at session start', 'oturum başında token'), L('163 for the index, 269 for tool definitions', 'Dizin için 163, araç tanımları için 269')],
    ['8/9', L('keyword benchmark questions', 'sözcük benchmark sorusu'), L('Turkish search: 3 of 3', 'Türkçe arama: 3 sorudan 3’ü')],
    ['47–86 ms', L('search p95 on 10,000 chunks', '10.000 parçada arama p95'), L('Range across three benchmark runs on Linux', 'Linux’ta üç benchmark çalıştırmasının aralığı')],
    ['200', L('passing tests', 'geçen test'), L('All 31 required benchmark categories pass', 'Zorunlu 31 benchmark kategorisinin tamamı geçiyor')]
  ];
  const comparison = [
    [L('Written by', 'Yazan'), L('You', 'Siz'), 'Claude', L('Hooks and the agent', 'Hook’lar ve ajan')],
    [L('Holds', 'İçerik'), L('Instructions and rules', 'Talimatlar ve kurallar'), L('Learnings and patterns', 'Öğrenimler ve kalıplar'), L('Past transcripts, notes and handoffs', 'Geçmiş dökümler, notlar ve devir notları')],
    [L('Reaches a session', 'Oturuma ulaşma'), L('Loaded at session start', 'Oturum başında yüklenir'), L('First 200 lines or 25KB of MEMORY.md', 'MEMORY.md’nin ilk 200 satırı veya 25KB’ı'), L('Short index, then search on demand', 'Kısa dizin, sonra gerektiğinde arama')],
    [L('Best for', 'En uygun kullanım'), L('Standards and workflows', 'Standartlar ve iş akışları'), L('Preferences and corrections', 'Tercihler ve düzeltmeler'), L('Earlier decisions, failed attempts and work', 'Önceki kararlar, başarısız denemeler ve çalışmalar')]
  ];
  const questions = [
    [L('What is an MCP memory server?', 'MCP hafıza sunucusu nedir?'),
      L('It is a service that gives an AI agent memory tools through the Model Context Protocol. MESA Lore runs locally and provides four tools for viewing an index, searching, opening results and saving notes.', 'Model Context Protocol üzerinden bir yapay zekâ ajanına hafıza araçları sağlayan servistir. MESA Lore yerelde çalışır; dizini görmek, arama yapmak, sonuçları açmak ve not kaydetmek için dört araç sunar.')],
    [L('Does MESA Lore replace CLAUDE.md or auto memory?', 'MESA Lore, CLAUDE.md veya otomatik hafızanın yerine geçer mi?'),
      L('No. CLAUDE.md is for instructions and auto memory is for learned preferences. MESA Lore adds searchable history from past sessions alongside them.', 'Hayır. CLAUDE.md talimatlar, otomatik hafıza ise öğrenilen tercihler içindir. MESA Lore bunların yanına geçmiş oturumlardan aranabilir bir kayıt ekler.')],
    [L('How do I give Claude Code memory between sessions?', 'Claude Code’a oturumlar arasında nasıl hafıza kazandırırım?'),
      L('Install MESA Lore and run mesa-lore install. It adds the MCP server and hooks, imports existing history and backs up the files it changes. New sessions then start with a short index and can search earlier work.', 'MESA Lore’u kurup mesa-lore install komutunu çalıştırın. Komut MCP sunucusunu ve hook’ları ekler, mevcut geçmişi içe aktarır ve değiştirdiği dosyaları yedekler. Yeni oturumlar kısa bir dizinle başlar ve önceki çalışmaları arayabilir.')],
    [L('How do I add memory to Codex CLI?', 'Codex CLI’a nasıl hafıza eklerim?'),
      L('Run mesa-lore install. Codex gets the same memory tools and hooks. Approve the hooks with /hooks in Codex to turn on automatic capture.', 'mesa-lore install komutunu çalıştırın. Codex aynı hafıza araçlarını ve hook’ları kullanır. Otomatik yakalamayı açmak için hook’ları Codex’te /hooks ile onaylayın.')],
    [L('Does MESA Lore send my code or transcripts anywhere?', 'MESA Lore kodumu veya dökümlerimi bir yere gönderir mi?'),
      L('MESA Lore sends nothing over the network. Your coding agent still sends the memory it retrieves to its own model provider, as it does with any other context.', 'MESA Lore ağ üzerinden hiçbir şey göndermez. Ancak kodlama ajanınız, aldığı hafızayı diğer bağlamlar gibi kendi model sağlayıcısına iletir.')],
    [L('Do I need an API key, GPU or embedding model?', 'API anahtarı, GPU veya embedding modeli gerekir mi?'),
      L('No. MESA Lore makes no LLM calls and uses no embeddings. Search is lexical, so a query needs words or stems that appear in the text.', 'Hayır. MESA Lore LLM çağrısı yapmaz ve embedding kullanmaz. Arama sözcük tabanlıdır, bu yüzden sorgunun metinde geçen kelimeleri veya kökleri içermesi gerekir.')],
    [L('Are secrets stored in memory?', 'Gizli bilgiler hafızada saklanır mı?'),
      L('Common API keys, tokens, passwords and private keys are masked before storage. Masking is pattern-based, so an unusual secret format can be missed. You can exclude projects from ingest.', 'Yaygın API anahtarları, token’lar, şifreler ve özel anahtarlar kaydedilmeden önce maskelenir. Maskeleme kalıp tabanlıdır, bu yüzden alışılmadık bir biçim gözden kaçabilir. Projeleri içe aktarmanın dışında bırakabilirsiniz.')],
    [L('How is MESA Lore different from MESA Core?', 'MESA Lore ile MESA Core arasındaki fark nedir?'),
      L('MESA Lore remembers the work of coding agents on your computer. MESA Core stores and searches documents for the AI applications you build. Lore does not require Core.', 'MESA Lore, bilgisayarınızdaki kodlama ajanlarının çalışmalarını hatırlar. MESA Core ise geliştirdiğiniz yapay zekâ uygulamaları için belgeleri saklar ve arar. Lore için Core gerekmez.')],
    [L('How do I remove it?', 'Nasıl kaldırırım?'),
      L('Run mesa-lore uninstall. It removes MESA Lore from your agent settings and keeps the backups and database. To delete stored entries, use mesa-lore purge with a project or age limit.', 'mesa-lore uninstall komutunu çalıştırın. Komut MESA Lore’u ajan ayarlarından kaldırır; yedekleri ve veritabanını korur. Kayıtları silmek için mesa-lore purge komutunu proje veya yaş sınırıyla kullanın.')]
  ];

  return `${header}<main id="main-content" class="lore-page">
    <section class="page-hero compact">
      <p class="eyebrow">${L(`MESA LORE · v${LORE_VERSION} · OPEN SOURCE`, `MESA LORE · v${LORE_VERSION} · AÇIK KAYNAK`)}</p>
      <h1>${L('Local MCP memory for Claude Code and Codex', 'Claude Code ve Codex için yerel MCP hafızası')}</h1>
      <p>${L('MESA Lore is an open-source MCP memory server for coding agents. It makes past Claude Code, Codex CLI and Antigravity sessions searchable on your computer. In Claude Code and Codex, each new session starts with a short index. Agents then pull back only what they need, with sources.', 'MESA Lore, kodlama ajanları için açık kaynak bir MCP hafıza sunucusudur. Claude Code, Codex CLI ve Antigravity’deki geçmiş oturumları bilgisayarınızda aranabilir yapar. Claude Code ve Codex’te her yeni oturum kısa bir dizinle başlar. Ajanlar yalnızca ihtiyaç duydukları bilgiyi kaynaklarıyla birlikte geri çağırır.')}</p>
      <div class="actions"><a class="button primary" href="#install">${L('Install MESA Lore', 'MESA Lore’u kur')}</a><a class="button secondary" href="${href('docs/lore/')}">${L('Read the docs', 'Dokümanları oku')}</a>${external(repo, L('View on GitHub', 'GitHub’da incele'), 'button secondary')}</div>
    </section>

    <section class="section lore-facts" aria-label="${L('Key facts', 'Temel bilgiler')}">
      <dl>${facts.map(([term, value]) => `<div><dt>${term}</dt><dd>${value}</dd></div>`).join('')}</dl>
    </section>

    <section class="section lore-block" aria-labelledby="lore-problem">
      <p class="eyebrow">${L('THE PROBLEM', 'SORUN')}</p>
      <h2 id="lore-problem">${L('Rules carry over. Past work is harder to find.', 'Kurallar taşınır. Geçmiş çalışmayı bulmak zordur.')}</h2>
      <p>${L('Each coding session starts with a fresh context window. Project instructions and saved notes can carry over, but details from older sessions are often left behind. Replaying a long session or explaining it again costs tokens. MESA Lore keeps that history searchable, so the agent loads details only when they are useful.', 'Her kodlama oturumu yeni bir bağlam penceresiyle başlar. Proje talimatları ve kayıtlı notlar taşınabilir, ama eski oturumlardaki ayrıntılar çoğu zaman geride kalır. Uzun bir oturumu yeniden yüklemek veya baştan anlatmak token harcar. MESA Lore bu geçmişi aranabilir tutar; ajan ayrıntıları yalnızca işe yaradığında yükler.')}</p>
    </section>

    <section class="section lore-block" aria-labelledby="lore-compare">
      <p class="eyebrow">${L('CLAUDE CODE MEMORY', 'CLAUDE CODE HAFIZASI')}</p>
      <h2 id="lore-compare">${L('How it differs from CLAUDE.md and auto memory', 'CLAUDE.md ve otomatik hafızadan farkı')}</h2>
      <p>${L('MESA Lore does not replace Claude Code’s built-in memory. Keep rules in CLAUDE.md and let auto memory hold learned preferences. Use Lore when you need to find what happened in earlier sessions.', 'MESA Lore, Claude Code’un yerleşik hafızasının yerine geçmez. Kuralları CLAUDE.md’de tutun, öğrenilen tercihleri otomatik hafızaya bırakın. Önceki oturumlarda ne olduğunu bulmanız gerektiğinde Lore’u kullanın.')}</p>
      <div class="table-scroll" tabindex="0" role="region" aria-label="${L('Claude Code memory comparison', 'Claude Code hafıza karşılaştırması')}"><table><thead><tr><th scope="col">${L('Compare', 'Karşılaştırma')}</th><th scope="col">CLAUDE.md</th><th scope="col">${L('Auto memory', 'Otomatik hafıza')}</th><th scope="col">MESA Lore</th></tr></thead><tbody>${comparison.map(([name, ...cells]) => `<tr><th scope="row">${name}</th>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
      <p class="lore-related">${L('Claude Code details come from the', 'Claude Code bilgileri')} ${external('https://code.claude.com/docs/en/memory', L('official memory documentation', 'resmî hafıza dokümanına'), 'lore-source')}${L('.', ' dayanır.')}</p>
    </section>

    <section class="section lore-block" aria-labelledby="lore-how">
      <p class="eyebrow">${L('HOW IT WORKS', 'NASIL ÇALIŞIR')}</p>
      <h2 id="lore-how">${L('Small context first. Details on demand.', 'Önce küçük bağlam. Ayrıntı gerektiğinde.')}</h2>
      <ol class="lore-steps">${steps.map(([title, text]) => `<li><h3>${title}</h3><p>${text}</p></li>`).join('')}</ol>
    </section>

    <section class="section lore-block" id="install" aria-labelledby="lore-install">
      <p class="eyebrow">${L('INSTALL', 'KURULUM')}</p>
      <h2 id="lore-install">${L('Set it up in one terminal session.', 'Tek terminal oturumunda kurun.')}</h2>
      <p>${L('Requires Python 3.10 or newer. Tested on Linux. macOS is untested and Windows is not supported yet.', 'Python 3.10 veya üstü gerekir. Linux’ta test edildi. macOS test edilmedi, Windows henüz desteklenmiyor.')}</p>
      ${code('lore-install-code', L('Install from GitHub', 'GitHub’dan kur'), INSTALL)}
      <p>${L('<code>install</code> adds the MCP server and hooks to supported agents, imports existing history and backs up changed files to <code>~/.config/mesa-lore/backup/</code>.', '<code>install</code>, desteklenen ajanlara MCP sunucusunu ve hook’ları ekler, mevcut geçmişi içe aktarır ve değiştirdiği dosyaları <code>~/.config/mesa-lore/backup/</code> altına yedekler.')}</p>
      ${code('lore-usage-code', L('Everyday commands', 'Günlük komutlar'), USAGE)}
      <p class="lore-related">${L(`See the <a href="${href('docs/lore/installation/')}">installation guide</a>, <a href="${href('docs/lore/agents/')}">agent setup</a> and <a href="${href('docs/lore/cli/')}">CLI reference</a>.`, `<a href="${href('docs/lore/installation/')}">Kurulum rehberine</a>, <a href="${href('docs/lore/agents/')}">ajan kurulumuna</a> ve <a href="${href('docs/lore/cli/')}">CLI komutlarına</a> bakın.`)}</p>
    </section>

    <section class="section lore-block" aria-labelledby="lore-agents">
      <p class="eyebrow">${L('SUPPORTED AGENTS', 'DESTEKLENEN AJANLAR')}</p>
      <h2 id="lore-agents">${L('One memory across your coding agents.', 'Kodlama ajanlarınız için tek hafıza.')}</h2>
      <div class="table-scroll" tabindex="0" role="region" aria-label="${L('Supported agents', 'Desteklenen ajanlar')}"><table><thead><tr><th scope="col">${L('Agent', 'Ajan')}</th><th scope="col">${L('Memory tools', 'Hafıza araçları')}</th><th scope="col">${L('Automatic capture', 'Otomatik yakalama')}</th></tr></thead><tbody>${agents.map(([agent, toolsCell, capture]) => `<tr><th scope="row">${agent}</th><td>${toolsCell}</td><td>${capture}</td></tr>`).join('')}</tbody></table></div>
      <h3>${L('Four MCP tools', 'Dört MCP aracı')}</h3>
      <dl class="lore-tools">${tools.map(([name, text]) => `<div><dt><code>${name}</code></dt><dd>${text}</dd></div>`).join('')}</dl>
    </section>

    <section class="section lore-block" aria-labelledby="lore-privacy">
      <p class="eyebrow">${L('DATA AND PRIVACY', 'VERİ VE GİZLİLİK')}</p>
      <h2 id="lore-privacy">${L('Your history stays on your machine.', 'Geçmişiniz bilgisayarınızda kalır.')}</h2>
      ${list([
        L('Data stays in <code>~/.local/share/mesa-lore/lore.db</code>. Set <code>MESA_LORE_DB</code> to use another path.', 'Veriler <code>~/.local/share/mesa-lore/lore.db</code> dosyasında kalır. Başka bir yol için <code>MESA_LORE_DB</code> ayarlayın.'),
        L('MESA Lore sends nothing over the network.', 'MESA Lore ağ üzerinden hiçbir şey göndermez.'),
        L('Common secrets are masked before storage. Masking is pattern-based and can miss unusual formats.', 'Yaygın gizli bilgiler kaydedilmeden önce maskelenir. Maskeleme kalıp tabanlıdır ve alışılmadık biçimleri kaçırabilir.'),
        L('Returned text is wrapped in <code>&lt;untrusted_memory&gt;</code> tags so agents treat it as data.', 'Döndürülen metin, ajanların veri olarak ele alması için <code>&lt;untrusted_memory&gt;</code> etiketleriyle sarılır.'),
        L('Projects can be excluded with <code>excluded_projects</code> in <code>~/.config/mesa-lore/config.toml</code>.', 'Projeler <code>~/.config/mesa-lore/config.toml</code> içindeki <code>excluded_projects</code> ile dışarıda bırakılabilir.')
      ])}
    </section>

    <section class="section lore-block" aria-labelledby="lore-measured">
      <p class="eyebrow">${L('MEASURED RESULTS', 'ÖLÇÜLEN SONUÇLAR')}</p>
      <h2 id="lore-measured">${L('What has been measured, and what has not.', 'Neler ölçüldü, neler ölçülmedi?')}</h2>
      <div class="lore-metrics">${measured.map(([value, label, note]) => `<article><strong>${value}</strong><span>${label}</span><small>${note}</small></article>`).join('')}</div>
      <p>${L('These figures come from the repository’s test suite and benchmark at v0.1.0 on Linux with Python 3.12 and 3.14 and can be re-run from the source.', 'Bu sonuçlar, v0.1.0 deposundaki test paketi ve benchmark’tan Linux ile Python 3.12 ve 3.14 üzerinde alınmıştır; kaynak koddan yeniden çalıştırılabilir.')}</p>
      <p>${L('A separate private evaluation on the author’s own transcripts (38,291 entries, 168 MB) answered 51.7% of 120 questions correctly with an 800-token memory budget. Answers and grading used LLMs, and this evaluation cannot be reproduced from the repository.', 'Geliştiricinin kendi dökümleriyle (38.291 kayıt, 168 MB) yapılan ayrı ve özel bir değerlendirmede, 800 token hafıza bütçesiyle 120 sorunun %51,7’si doğru yanıtlandı. Yanıtlama ve puanlamada LLM kullanıldı; bu değerlendirme depodan yeniden üretilemez.')}</p>
      <div class="article-callout warning"><strong>${L('Current limits', 'Güncel sınırlar')}</strong><p>${L('End-to-end token savings when resuming a session have not been measured yet. Search is lexical and recall is incomplete, so check important answers against the returned source.', 'Oturuma dönerken uçtan uca token tasarrufu henüz ölçülmedi. Arama sözcük tabanlıdır ve her sonucu bulamayabilir; önemli yanıtları döndürülen kaynakla kontrol edin.')}</p></div>
    </section>

    <section class="section lore-block lore-faq" aria-labelledby="lore-faq">
      <p class="eyebrow">${L('QUESTIONS', 'SORULAR')}</p>
      <h2 id="lore-faq">${L('Common questions about MESA Lore', 'MESA Lore hakkında sık sorulanlar')}</h2>
      ${questions.map(([question, answer]) => `<article><h3>${question}</h3><p>${answer}</p></article>`).join('')}
      <p class="lore-related">${L(`Building an application over documents instead? <a href="${href('ecosystem/')}">See the MESA projects</a>.`, `Bunun yerine belgeler üzerinde bir uygulama mı geliştiriyorsunuz? <a href="${href('ecosystem/')}">MESA projelerine bakın</a>.`)}</p>
    </section>
  </main>${footer}`;
}
