-- Seed Data for MESA Content Platform
-- Generated deterministically from content/hub.json
BEGIN;

-- 1. Seed Categories

-- 2. Seed Articles and Revisions

INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('what-is-ai-memory', 'learn', 'en', 'What is AI agent memory?', '', 'AI agent memory keeps useful information outside the model and brings it back when needed. Learn the main types and design your first memory policy.', 'AI agent memory is a system outside the language model that saves selected information and retrieves it for later requests. It lets an agent use earlier facts, decisions and experience across sessions. The model is not retrained; the application supplies the relevant memory as context.', '## What is AI agent memory?

AI memory is the set of mechanisms that lets an application use information beyond the current request. For an AI agent, this usually means storing observations, facts, decisions or instructions, then retrieving the relevant ones when a later task needs them.

The important point is that the language model does not automatically learn from each conversation. Memory works because the application chooses what to save, finds it again and places it in the model’s context.

## Three different meanings of “remember”

Imagine an assistant helping with a fictional Atlas archive. On Monday you say that the reading room opens at nine. On Tuesday you open a new conversation and ask for its opening time. The model can answer only if the application supplies a usable record, or if the information happens to be in its parameters. A confident answer does not tell you which happened.

A large language model (LLM) generates text by predicting tokens from the input it receives. A token is a unit of encoded text, not necessarily a whole word. The context window is the bounded sequence of input and output tokens the model can work with under its interface. Persistent storage is an application mechanism outside that prediction process; the word memory here is an engineering term, not a claim of human-like recollection.

| Layer | What it contains | How it changes |
| --- | --- | --- |
| Model parameters | Patterns learned during training | Training or fine-tuning |
| Context window | Tokens supplied for this request | Build a new request |
| Persistent memory | Records outside the model | Authorized write/update/delete |

Writing a row to a database does not retrain a model. Retrieving that row makes it available in one request, subject to selection and context limits. Conversely, leaving a statement in conversation history does not guarantee that it will be present after truncation or in another session. These are separate mechanisms with separate failure modes.

## Types of AI agent memory

The [CoALA framework](https://arxiv.org/abs/2309.02427) describes agent memory with four useful categories. Real products may combine them or use different names.

| Type | What it holds | Example |
| --- | --- | --- |
| Working memory | Active information for the current decision | The current task and recent tool result |
| Episodic memory | Past experiences and behavior | A failed deployment from last week |
| Semantic memory | Knowledge about the world or the agent | The reading room opens at 09:00 |
| Procedural memory | Rules and skills that guide action | Always run tests before a release |

## A useful record is more than a sentence

Before storing “opens at nine”, ask: which room, on which days, according to whom, and for which readers? A useful record preserves the original observation, its source, scope and time. An extracted fact is an interpretation of that observation. Keeping both lets you correct an extraction without pretending the original source changed.

```text
record_id: hours-17
subject: Atlas reading room
claim: opens at 09:00 on weekdays
source: handbook / revision 2 / paragraph 4
observed_at: 2026-10-18
scope: archive-team
status: active
```

A preference such as “use concise replies” is different from a reference fact such as opening hours. A temporary instruction may apply to one task; a user preference may persist until revoked. Do not silently promote an instruction from a retrieved document into a durable user preference. Define who may write each kind of record.

## Follow the lifecycle, not the chat transcript

<!-- diagram: An observation is admitted, stored, retrieved and used in a later context. -->
1. Observe · exact source
2. Admit · validate and authorize
3. Store · source + record
4. Retrieve · relevant and allowed
5. Use · cite or abstain

*Each arrow can fail. A saved message is not proof that a usable memory was committed.*

Choose a write policy explicitly. Store every message and you accumulate private data, duplicates and stale instructions. Store only an LLM summary and you may lose exceptions or evidence. A practical starting point is to retain exact source records, extract a small set of task-relevant claims and keep a link from each claim to its source. This is a design pattern, not a universal requirement.

## Deletion and correction are part of memory

On Wednesday the room changes its hours. Appending a new sentence leaves two competing answers unless you track revisions or validity. Mark the previous claim as superseded while retaining the audit trail your policy permits. Deleting the source also requires a decision about derived summaries, embeddings and caches; removing only the visible chat message is incomplete.

The test is observable continuity: close the session, start another authorized session, ask the question, then revoke access or supersede the source and repeat. Check the returned source identity as well as the answer. Long context is not a substitute for this test. Liu et al. study position effects in particular long-context tasks; their finding is a reason to evaluate your model, not a timeless limit for every model. [Read the study](https://arxiv.org/abs/2307.03172).

## AI memory vs context window vs RAG

| Concept | Main question | Lifetime |
| --- | --- | --- |
| Context window | What can the model see in this request? | One request |
| RAG | Which source text should support this answer? | Depends on the knowledge base |
| Agent memory | What should the agent retain and reuse? | Across tasks and sessions until changed or deleted |

RAG can be one way to retrieve memory, but memory also needs write, update, scope and deletion rules. Continue with [RAG and memory](/learn/rag-vs-ai-memory/).

## Common AI memory mistakes

- Saving every message and retrieving noise, private data or old instructions.
- Keeping only a summary and losing the original evidence.
- Treating a retrieved document’s instruction as a trusted user preference.
- Having no way to correct, supersede or delete a memory.
- Measuring whether a row was saved, but not whether a later session can use it.

## Design your first memory policy

> [!EXERCISE]
> **Check your understanding**
> The assistant saves “the room opens at nine” but cannot identify its source or who may see it. Which two problems remain even if retrieval always returns the row?
>
> **Answer:** You cannot verify or revise the source-backed claim reliably, and you cannot enforce its access boundary. Retrieval success alone solves neither provenance nor authorization. Add source/revision and scope fields before measuring search quality.

> [!NOTE]
> **Example: memory for coding agents**
> [MESA Lore](/lore/) applies this idea to coding sessions. It keeps past Claude Code and Codex work in a local, searchable record with sources.

## AI agent memory questions

**Does AI memory retrain the model?**
: No. Most agent memory is stored outside the model and added to context when needed.

**Is a larger context window the same as memory?**
: No. It holds more text in one request, but it does not decide what persists, what is current or who may access it.

**Does AI agent memory need a vector database?**
: No. Depending on the task, memory can start with files, SQL or keyword search. Add vectors when you measure a need for meaning-based retrieval.

**What should an AI agent remember?**
: Keep information likely to help later, with its source, scope and time. Avoid storing secrets, temporary noise and claims you cannot trace.

## Sources and further reading

1. [Liu et al. (2023) · Lost in the Middle](https://arxiv.org/abs/2307.03172)
2. [Lewis et al. (2020) · Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
3. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)
4. [Sumers et al. (TMLR 2024) · Cognitive Architectures for Language Agents](https://arxiv.org/abs/2309.02427)

', ARRAY['memory', 'context window', 'session', 'kalıcı hafıza', 'bağlam', 'oturum']::text[], 'MESA contributors', 6, 'published', 'What Is AI Agent Memory? Types and Design — MESA', 'AI agent memory stores useful information outside the model and retrieves it later. Learn working, episodic, semantic and procedural memory.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('what-is-ai-memory', 'learn', 'tr', 'Yapay zekâ ajanı hafızası nedir?', '', 'Yapay zekâ ajanı hafızası, yararlı bilgiyi model dışında saklar ve gerektiğinde geri getirir. Temel türleri öğrenin ve ilk hafıza politikanızı tasarlayın.', 'Yapay zekâ ajanı hafızası, seçilen bilgileri dil modelinin dışında saklayan ve sonraki isteklerde geri getiren sistemdir. Ajanın önceki bilgi, karar ve deneyimleri oturumlar arasında kullanmasını sağlar. Model yeniden eğitilmez; uygulama ilgili hafızayı bağlam olarak verir.', '## Yapay zekâ hafızası nedir?

Yapay zekâ hafızası, bir uygulamanın o anki isteğin ötesindeki bilgileri kullanmasını sağlayan mekanizmaların bütünüdür. Bir yapay zekâ ajanında bu genellikle gözlem, bilgi, karar veya talimatları saklamak ve sonraki bir görevde ilgili olanları geri getirmek demektir.

Önemli nokta şudur: Dil modeli her konuşmadan kendiliğinden öğrenmez. Hafıza, uygulamanın neyi saklayacağını seçmesi, onu yeniden bulması ve modelin bağlamına eklemesiyle çalışır.

## “Hatırlamanın” üç ayrı anlamı

Atlas arşivi için çalışan kurgusal bir asistan düşünün. Pazartesi, okuma salonunun dokuzda açıldığını söylüyorsunuz. Salı yeni bir sohbette açılış saatini soruyorsunuz. Uygulama önceki kaydı modele sunmazsa model yalnızca eğitimde öğrendiklerine dayanabilir. Kendinden emin bir yanıt vermesi, bilgiyi gerçekten hatırladığını göstermez.

Büyük dil modeli (LLM), girdiden sonra hangi token’ların geleceğini tahmin ederek metin üretir. Token, her zaman tam bir sözcüğe karşılık gelmeyen kodlanmış metin birimidir. Bağlam penceresi, modelin tek istekte işleyebildiği sınırlı girdi ve çıktı alanıdır. Kalıcı depolama ise bu tahmin sürecinin dışında, uygulama tarafından yönetilir. Burada “hafıza” bir mühendislik kavramıdır; modelin insan gibi hatırladığı söylenmiyor.

| Katman | İçerik | Değişim yolu |
| --- | --- | --- |
| Model parametreleri | Eğitimde öğrenilen örüntüler | Eğitim veya ince ayar |
| Bağlam penceresi | Bu isteğe verilen token’lar | Yeni istek oluşturma |
| Kalıcı hafıza | Model dışındaki kayıtlar | Yetkili yazma/güncelleme/silme |

Veritabanına bir satır eklemek modeli yeniden eğitmez. Uygulama o satırı bulup bağlama eklerse model, yalnızca ilgili istekte bu bilgiden yararlanabilir. Konuşma geçmişinde duran bir cümlenin de geçmiş kısaltıldığında veya yeni oturum açıldığında erişilebilir kalacağı garanti değildir. Bunlar, farklı biçimlerde hata verebilen ayrı mekanizmalardır.

## Yapay zekâ ajanı hafıza türleri

[CoALA çerçevesi](https://arxiv.org/abs/2309.02427) ajan hafızasını dört kullanışlı kategoriyle açıklar. Gerçek ürünler bunları birleştirebilir veya farklı adlarla kullanabilir.

| Tür | İçeriği | Örnek |
| --- | --- | --- |
| Çalışma hafızası | O anki karar için etkin bilgi | Güncel görev ve son araç sonucu |
| Olay (epizodik) hafızası | Geçmiş deneyim ve davranışlar | Geçen haftaki başarısız dağıtım |
| Anlamsal hafıza | Dünya veya ajan hakkındaki bilgiler | Okuma salonu 09.00’da açılır |
| Yöntem (prosedürel) hafızası | Davranışı yönlendiren kural ve beceriler | Sürümden önce testleri çalıştır |

## Kullanışlı kayıt bir cümleden fazlasıdır

“Dokuzda açılır” bilgisini saklamadan önce şu soruları sorun: Hangi salon? Hangi günler? Hangi kaynağa göre? Kimler görebilir? İyi bir kayıt, özgün ifadeyi, kaynağını, erişim izinlerini ve zamanını korur. Bu ifadeden çıkarılan bilgi ise bir yorumdur. İkisini ayrı saklamak, kaynağı değiştirmeden hatalı yorumu düzeltmenizi sağlar.

```text
record_id: hours-17
subject: Atlas reading room
claim: opens at 09:00 on weekdays
source: handbook / revision 2 / paragraph 4
observed_at: 2026-10-18
scope: archive-team
status: active
```

“Kısa yanıt ver” tercihi, açılış saati gibi bir referans bilgisinden farklıdır. Geçici talimat tek görevde geçerli olabilir; kullanıcı tercihi geri alınana kadar sürebilir. Getirilen belgedeki talimatı sessizce kalıcı kullanıcı tercihine dönüştürmeyin. Her kayıt türünü kimin yazabileceğini tanımlayın.

## Konuşma dökümünü değil yaşam döngüsünü izleyin

<!-- diagram: Gözlem kabul edilir, saklanır, geri getirilir ve sonraki bağlamda kullanılır. -->
1. Gözlem · tam kaynak
2. Kabul · doğrula ve yetkilendir
3. Sakla · kaynak + kayıt
4. Getir · ilgili ve izinli
5. Kullan · atıf yap veya çekimser kal

*Her ok başarısız olabilir. Kaydedilmiş mesaj, kullanılabilir hafızanın tamamlandığını kanıtlamaz.*

Neyin saklanacağına açıkça karar verin. Her mesajı kaydetmek; özel bilgileri, tekrarları ve geçerliliğini yitirmiş talimatları biriktirir. Yalnızca model özeti saklamak da istisnaları veya dayanakları kaybettirebilir. Başlangıç için kaynak metni koruyup görevle ilgili az sayıda bilgi kaydı çıkarabilir ve her birini kaynağına bağlayabilirsiniz. Bu, her sistemde zorunlu olan tek çözüm değil, bir tasarım seçeneğidir.

## Silme ve düzeltme de hafızanın parçasıdır

Çarşamba salonun açılış saati değişsin. Sürüm ve geçerlilik bilgisi tutmadan yalnızca yeni bir cümle eklerseniz, arama birbiriyle yarışan iki yanıt bulabilir. Saklama kurallarınıza uygun geçmişi koruyun ve eski kaydın geçerliliğini yitirdiğini belirtin. Kaynak silindiğinde ona bağlı özetleri, sayısal temsilleri ve önbellekleri de değerlendirin; yalnızca görünen sohbet mesajını kaldırmak yeterli değildir.

Kalıcılığı gözlenebilir davranışla sınayın: Oturumu kapatın, başka bir yetkili oturum açın ve aynı soruyu sorun. Ardından erişimi kaldırıp veya kaynağı değiştirip testi tekrarlayın. Yanıtla birlikte kaynak kimliğini de kontrol edin. Uzun bir bağlam penceresi bu testin yerini tutmaz. Liu ve arkadaşlarının belirli uzun bağlam görevlerinde bulduğu konum etkisi, her model için değişmez bir sınır değil; kendi sisteminizi ölçmeniz için bir gerekçedir. [Araştırma](https://arxiv.org/abs/2307.03172)

## Yapay zekâ hafızası, bağlam penceresi ve RAG farkı

| Kavram | Temel soru | Ömrü |
| --- | --- | --- |
| Bağlam penceresi | Model bu istekte neyi görebilir? | Tek istek |
| RAG | Bu yanıtı hangi kaynak metin desteklemeli? | Bilgi tabanına bağlıdır |
| Ajan hafızası | Ajan neyi saklayıp yeniden kullanmalı? | Değiştirilene veya silinene kadar görev ve oturumlar boyunca |

RAG, hafızayı geri getirmenin bir yolu olabilir; ancak hafıza ayrıca yazma, güncelleme, kapsam ve silme kuralları ister. [RAG ve hafıza](/learn/rag-vs-ai-memory/) dersiyle devam edin.

## Yapay zekâ hafızasında sık yapılan hatalar

- Her mesajı saklayıp gürültü, özel veri veya eski talimatları geri getirmek.
- Yalnızca özet tutup özgün kanıtı kaybetmek.
- Getirilen bir belgedeki talimatı güvenilir kullanıcı tercihi saymak.
- Bir kaydı düzeltme, geçersiz kılma veya silme yolu bırakmamak.
- Kaydın yazıldığını ölçüp sonraki oturumun onu kullanabildiğini ölçmemek.

## İlk hafıza politikanızı tasarlayın

> [!EXERCISE]
> **Kendinizi sınayın**
> Asistan “salon dokuzda açılır” kaydını saklıyor; kaynağını ve kimlerin görebileceğini bilmiyor. Arama satırı her seferinde bulsa bile hangi iki sorun sürer?
>
> **Açıklama:** Kaynağıyla bağlantılı iddiayı güvenilir biçimde doğrulayamaz veya revize edemezsiniz; erişim sınırını da uygulayamazsınız. Arama başarısı kaynak izi ve yetkilendirmeyi çözmez. Arama kalitesini ölçmeden önce kaynak/revizyon ve kapsam alanlarını ekleyin.

> [!NOTE]
> **Örnek: kodlama ajanları için hafıza**
> [MESA Lore](/lore/) bu fikri kodlama oturumlarına uygular. Geçmiş Claude Code ve Codex çalışmalarını kaynaklarıyla birlikte yerel ve aranabilir bir kayıtta tutar.

## Yapay zekâ ajanı hafızası hakkında sorular

**Yapay zekâ hafızası modeli yeniden eğitir mi?**
: Hayır. Ajan hafızasının çoğu model dışında saklanır ve gerektiğinde bağlama eklenir.

**Daha büyük bağlam penceresi hafıza demek mi?**
: Hayır. Tek istekte daha fazla metin taşır, ama neyin kalıcı olacağına, neyin güncel olduğuna veya kimin erişebileceğine karar vermez.

**Ajan hafızası için vektör veritabanı şart mı?**
: Hayır. Göreve göre dosyalar, SQL veya sözcük aramasıyla başlanabilir. Anlam tabanlı aramaya ihtiyaç ölçtüğünüzde vektör ekleyin.

**Bir yapay zekâ ajanı neyi hatırlamalı?**
: Sonradan işe yarayacak bilgileri kaynağı, kapsamı ve zamanıyla saklayın. Gizli bilgileri, geçici gürültüyü ve izlenemeyen iddiaları saklamayın.

## Kaynaklar ve ileri okuma

1. [Liu et al. (2023) · Lost in the Middle](https://arxiv.org/abs/2307.03172)
2. [Lewis et al. (2020) · Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
3. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)
4. [Sumers et al. (TMLR 2024) · Cognitive Architectures for Language Agents](https://arxiv.org/abs/2309.02427)

', ARRAY['memory', 'context window', 'session', 'kalıcı hafıza', 'bağlam', 'oturum']::text[], 'MESA contributors', 6, 'published', 'Yapay Zekâ Hafızası Nedir? Ajan Hafızası Rehberi — MESA', 'Yapay zekâ ajanı hafızası, bilgiyi model dışında saklayıp gerektiğinde geri getirir. Çalışma, olay, anlamsal ve yöntem hafızasını ve tasarımını öğrenin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('rag-vs-ai-memory', 'learn', 'en', 'RAG and memory: build the request step by step', '', 'Trace a source from retrieval into an answer. Learn why RAG and memory overlap, how context budgets work, and where grounding can fail.', 'Trace a source from retrieval into an answer. Learn why RAG and memory overlap, how context budgets work, and where grounding can fail.', '## RAG is a pattern, memory is a lifecycle concern

Retrieval-augmented generation means fetching external information and conditioning a generated answer on it. An application may retrieve a manual, a user preference or a previous task record. “Memory” describes what the application retains and how it manages that information over time. A memory system can supply a RAG pipeline; a RAG corpus can be updated continuously. Static versus dynamic is not the defining distinction.

Lewis et al. introduced a specific trainable RAG architecture combining parametric and retrieved information. Modern applications often use the broader term for prompt-time retrieval without jointly training the retriever and generator. State which meaning you use. This lesson describes the application pattern; it does not claim that every retrieval-based prompt implements the original training method. [Original paper](https://arxiv.org/abs/2005.11401).

## One question, five inspectable decisions

<!-- diagram: A question passes authorization, retrieval, selection and context construction before generation. -->
1. Question · weekday hours?
2. Scope · archive-team
3. Candidates · revisions 1 and 2
4. Select · active source 2
5. Generate · answer + source

*The generator sees only the evidence actually placed in its request.*

First resolve the caller’s allowed sources. Then retrieve candidates and remove ineligible or superseded records. Rank the remaining candidates and pack a bounded evidence context. Finally ask the generator to answer from that context and identify the supporting source. Record each stage separately: a plausible final answer can hide a broken retriever or an accidental answer from model parameters.

## Chunk boundaries change what can be answered

Suppose a source says “The room opens at 09:00 on weekdays, except public holidays.” If chunking separates the exception into another record and retrieval returns only the first, the system may give a misleading answer while quoting a real sentence. Start with document structure: heading, paragraph, table and attachment boundaries. Keep source offsets and test whether questions need neighboring passages.

Overlap helps preserve local context but also creates near-duplicate candidates. Deduplicate by source/revision/span before filling the context. There is no universal chunk size: a short FAQ and a table with a multi-paragraph definition need different treatment. Choose a baseline, inspect failures and compare on held-out questions instead of treating a token count as a rule.

## Calculate the evidence budget

```text
input budget = 8,000 tokens
instructions + question + tool schemas = 2,000
reserved evidence capacity = 6,000
If the model limit includes output: reserve output separately.
Actual packing must include source labels and separators.
```

If each evidence item needs 500 tokens plus 50 tokens of identity/formatting, ten items consume 5,500 tokens. Eleven consume 6,050 and exceed this illustrative budget. Do not cut a passage midway through a negation or qualification just to fit. Drop or replace an item, retain its source identity and count with the model’s actual tokenizer where possible. Numbers here are an exercise, not model specifications.

## Diagnose retrieval and generation separately

| Observation | Likely investigation |
| --- | --- |
| Correct source absent from candidates | Ingestion, query, index and scope |
| Correct source retrieved but omitted | Ranking, deduplication and packing |
| Correct source in prompt, answer wrong | Instructions, model behavior and ambiguity |
| Answer right, source unrelated | Citation support and possible model recall |

Retrieved text is data, even when it says “ignore previous instructions.” Keep it separate from trusted instructions and do not authorize tool actions because a document requests them. Source presence does not establish truth or make a tool call safe. OWASP describes indirect prompt-injection risks and layered defenses; no single delimiter eliminates the problem. [Security reference](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

## Find the missing qualification

> [!EXERCISE]
> **Check your understanding**
> A source has 400 tokens of rules and 100 tokens of exceptions. Only the rules fit. Is truncating the last 100 tokens a safe optimization?
>
> **Answer:** No. Preserve the rule with its qualifications, retrieve a smaller complete unit, or decline to answer fully. Measure answer support, not just the number of passages placed in context.

## Sources and further reading

1. [Lewis et al. (2020) · Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
2. [Liu et al. (2023) · Lost in the Middle](https://arxiv.org/abs/2307.03172)
3. [OWASP · LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

', ARRAY['RAG', 'chunking', 'context budget', 'parçalama', 'bağlam bütçesi', 'prompt injection']::text[], 'MESA contributors', 5, 'published', 'RAG and memory: build the request step by step — MESA Learn', 'Trace a source from retrieval into an answer. Learn why RAG and memory overlap, how context budgets work, and where grounding can fail.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('rag-vs-ai-memory', 'learn', 'tr', 'RAG ve hafıza: kaynaktan yanıta', '', 'Bilginin aramada bulunmasından yanıta dönüşmesine kadar geçen adımları izleyin. RAG ile hafızanın ilişkisini ve bağlam bütçesini örneklerle öğrenin.', 'Bilginin aramada bulunmasından yanıta dönüşmesine kadar geçen adımları izleyin. RAG ile hafızanın ilişkisini ve bağlam bütçesini örneklerle öğrenin.', '## RAG ne yapar, hafıza neyi yönetir?

RAG, dışarıdan bulunan bilgiyi dil modeline sunarak yanıtı bu bilgiye dayandırma yöntemidir. Getirilen içerik bir kılavuz, kullanıcı tercihi veya önceki görev kaydı olabilir. “Hafıza” ise uygulamanın neyi sakladığını ve bunu zaman içinde nasıl yönettiğini anlatır. Bir hafıza sistemi RAG akışına veri sağlayabilir; RAG’in kullandığı belgeler de sürekli güncellenebilir. Ayrım, birinin sabit diğerinin değişken olması değildir.

Lewis ve arkadaşları, modelin öğrendiği bilgiyle aramada bulunan bilgiyi birleştiren belirli bir eğitilebilir RAG mimarisi sundu. Bugün RAG adı, arama bileşeniyle yanıt üreten model birlikte eğitilmeden yapılan uygulamalar için de kullanılıyor. Hangi kullanımdan söz ettiğinizi belirtin. Bu ders uygulama akışını açıklar; kaynağa dayanan her istemin özgün makaledeki eğitim yöntemini kullandığını söylemez. [Özgün makale](https://arxiv.org/abs/2005.11401)

## Tek soru, incelenebilir beş karar

<!-- diagram: Soru üretimden önce yetkilendirme, arama, seçim ve bağlam kurulumundan geçer. -->
1. Soru · hafta içi saat?
2. Kapsam · archive-team
3. Adaylar · sürüm 1 ve 2
4. Seçim · etkin kaynak 2
5. Üretim · yanıt + kaynak

*Generator yalnızca isteğe gerçekten yerleştirilen kanıtı görür.*

Önce isteği yapan kişinin hangi kaynaklara erişebildiğini belirleyin. Sonra adayları bulun; uygun olmayan veya yerini daha yeni sürüme bırakmış kayıtları çıkarın. Kalan sonuçları sıralayıp sınırlı kanıt bağlamına yerleştirin. Son olarak modelden bu bağlama dayalı bir yanıt ve onu destekleyen kaynakları isteyin. Her aşamayı ayrı izleyin: Makul görünen son yanıt, aramadaki bir hatayı veya modelin eğitimden tesadüfen bildiği bir cevabı gizleyebilir.

## Parça sınırları cevaplanabilirliği değiştirir

Kaynakta “Salon hafta içi 09.00’da açılır; resmî tatiller hariç” yazsın. Metni bölerken istisna ayrı parçaya düşer ve arama yalnızca ilk parçayı getirirse sistem gerçek bir cümleye atıf yaparak yanlış yönlendirebilir. Başlık, paragraf, tablo ve ek sınırlarını gözetin. Kaynak içindeki konumları koruyun; soruların komşu parçalara ihtiyaç duyup duymadığını test edin.

Parçaları bir miktar örtüştürmek yakın bağlamı koruyabilir, ancak çok benzer sonuçları da çoğaltır. Modelin bağlamını doldurmadan önce belge, sürüm ve metin aralığına göre tekrarları ayıklayın. Her belgeye uygun tek bir parça boyutu yoktur. Kısa bir SSS ile uzun bir tablo aynı biçimde bölünmez. Başlangıç ayarını seçin, hataları inceleyin ve daha önce ayarlarda kullanmadığınız test sorularıyla karşılaştırın.

## Kanıt bütçesini hesaplayın

```text
input budget = 8,000 tokens
instructions + question + tool schemas = 2,000
reserved evidence capacity = 6,000
If the model limit includes output: reserve output separately.
Actual packing must include source labels and separators.
```

Her kanıt 500 token, kimlik ve biçim bilgileri de 50 token gerektiriyorsa on öğe 5.500 token tutar. On bir öğe 6.050 token ile bu örnekteki bütçeyi aşar. Sığdırmak için metni olumsuzluk veya istisna cümlesinin ortasından kesmeyin. Öğeyi çıkarın ya da daha uygun bir bütünle değiştirin. Kaynak kimliğini koruyun; mümkünse modelin gerçek token sayacını kullanın. Bu sayılar bir modelin kapasitesini değil, hesap örneğini gösterir.

## Aramayla yanıt üretimini ayrı değerlendirin

| Gözlem | İncelenecek alan |
| --- | --- |
| Doğru kaynak adaylarda yok | Veri alımı, sorgu, indeks ve kapsam |
| Kaynak geldi ama bağlama girmedi | Sıralama, tekrar ayıklama ve paketleme |
| Kaynak bağlamda var, yanıt yine de yanlış | Talimat, model davranışı ve belirsizlik |
| Cevap doğru, kaynak ilgisiz | Atfın desteği ve olası model ezberi |

Aramada bulunan metin “önceki talimatları yok say” dese bile veri olarak kalmalıdır. Onu güvenilir talimatlardan ayırın; bir belge istedi diye araçlara işlem yetkisi vermeyin. Kaynağın bulunması, içeriğin doğru olduğunu veya araç çağrısının güvenliğini göstermez. OWASP, dolaylı istem enjeksiyonu riskini ve birden fazla katmanda alınabilecek önlemleri açıklar. Tek bir ayraç kullanmak sorunu çözmez. [Güvenlik kaynağı](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

## Eksik istisnayı bulun

> [!EXERCISE]
> **Kendinizi sınayın**
> Kaynak 400 token kural ve 100 token istisna içeriyor. Yalnızca kurallar sığıyor. Son 100 token’ı kesmek güvenli optimizasyon mudur?
>
> **Açıklama:** Hayır. Kuralı istisnalarıyla koruyun, daha küçük tam birim getirin veya tam cevap veremediğinizi belirtin. Yalnızca bağlama yerleştirilen parça sayısını değil, yanıtın kaynak desteğini ölçün.

## Kaynaklar ve ileri okuma

1. [Lewis et al. (2020) · Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
2. [Liu et al. (2023) · Lost in the Middle](https://arxiv.org/abs/2307.03172)
3. [OWASP · LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

', ARRAY['RAG', 'chunking', 'context budget', 'parçalama', 'bağlam bütçesi', 'prompt injection']::text[], 'MESA contributors', 5, 'published', 'RAG ve hafıza: kaynaktan yanıta — MESA', 'Bilginin aramada bulunmasından yanıta dönüşmesine kadar geçen adımları izleyin. RAG ile hafızanın ilişkisini ve bağlam bütçesini örneklerle öğrenin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('structured-vs-unstructured-memory', 'learn', 'en', 'From documents to claims: preserve what extraction loses', '', 'Represent exact text, entities and assertions without confusing an extracted claim with verified truth. Work through a source-linked record.', 'Represent exact text, entities and assertions without confusing an extracted claim with verified truth. Work through a source-linked record.', '## Three representations of the same source

The Atlas handbook says “Starting 1 November, the reading room opens at 10:00 on Fridays; other weekdays remain 09:00.” Raw text preserves wording. A chunk makes part of it retrievable. An assertion makes one interpretation explicit: subject, predicate, value and qualifiers. A graph makes relationships traversable. None of these representations automatically proves that the source is correct.

| Representation | Good at | Can lose |
| --- | --- | --- |
| Exact source | Audit and re-interpretation | Convenient query structure |
| Text chunk | Passage retrieval | Document-wide qualification |
| Assertion | Filtering and joins | Nuance or extraction uncertainty |
| Graph edge | Relationship traversal | Evidence unless explicitly linked |

Choose representations according to the question. “What does paragraph four say?” needs exact text. “Which rooms open after nine on Friday?” benefits from typed time/day fields. Keeping a source-linked assertion alongside the text serves both. Treat the structured row as a derived interpretation that can be re-extracted when the parser or model changes.

## In MESA 0.9.5

MESA keeps the exact source revision, its chunks, the built-in legal items with their original offsets, and optional model-extracted assertions, all in SQLite. Conditions that make a whole document change over time, such as “starting 1 November”, go on the revision as `valid_from` and `valid_to`, so a search with `valid_at` returns the version in force on that date. MESA has no graph store since 0.9.5. See [versioned documents](/docs/core/concepts-and-ingestion/#guide-versioned-documents).

## Build a claim that retains its conditions

```text
assertion_id: a-42
subject_id: room-atlas-reading
predicate: opening_time
value: "10:00"
day_of_week: Friday
valid_from: 2026-11-01
source_revision: handbook-r3
evidence_text: "opens at 10:00 on Fridays"
extractor_version: example-parser-2
```

Dropping “Friday” changes the claim. Dropping “starting 1 November” makes a future change look current. Treat units, negation, jurisdiction, time and exceptions as part of the assertion when they affect its meaning. If the extraction cannot represent a condition, keep the source and flag the interpretation as incomplete rather than silently discarding it.

Use stable IDs to distinguish the room from its label. “Atlas”, “Atlas Reading Room” and “Room A” might refer to one entity, or to different entities. Entity resolution is a separate decision requiring evidence. A string match can propose a candidate; it should not automatically merge records across organizations or access scopes.

## Keep the derivation visible

<!-- diagram: A source revision produces a chunk, an extraction run and a qualified assertion. -->
1. Revision r3 · original text
2. Chunk c4 · exact range
3. Extraction e2 · model/parser
4. Assertion a42 · qualifiers

*A correction replaces the derived claim; the original revision remains identifiable.*

W3C PROV distinguishes entities, activities and agents in provenance descriptions. Applied here, the source and claim are entities, extraction is an activity, and a software service is an agent. This vocabulary helps ask who produced a claim and from what. It does not prescribe your database schema or certify the truth of the extraction. [PROV overview](https://www.w3.org/TR/prov-overview/).

## Validate structure and meaning separately

Schema validation can reject a missing source ID, invalid time or absent subject. Semantic checks ask whether the source actually supports the claim and whether conditions were preserved. Passing JSON validation proves only structural conformance. Two models agreeing can still share the same misunderstanding; agreement is a signal, not an independent source.

For corrections, distinguish a changed source from a changed interpretation. If the source is unchanged but “Friday” was misread as “every day”, create a new extraction or assertion version and retract the faulty one. If the handbook itself changes, create a new source revision. This separation lets you audit whether a later answer changed because reality, the document or the extraction pipeline changed.

## Repair the extraction

> [!EXERCISE]
> **Check your understanding**
> An extractor turns “closed on public holidays” into `is_open=true`. The JSON schema is valid. What should your review record?
>
> **Answer:** A semantic contradiction with the exact supporting span, the extractor version and the affected assertion ID. Retract or replace the derived claim; preserve the source revision and do not call this a source update.

## Sources and further reading

1. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
2. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)

', ARRAY['assertion', 'entity', 'schema', 'chunk', 'iddia', 'varlık', 'şema', 'kanıt aralığı']::text[], 'MESA contributors', 5, 'published', 'From documents to claims: preserve what extraction loses — MESA Learn', 'Represent exact text, entities and assertions without confusing an extracted claim with verified truth. Work through a source-linked record.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('structured-vs-unstructured-memory', 'learn', 'tr', 'Metinden bilgi kaydına: kaynakta neyi korumalı?', '', 'Bir belgeyi parçalara, varlıklara ve bilgi kayıtlarına dönüştürürken koşulları ve dayanakları nasıl koruyacağınızı öğrenin.', 'Bir belgeyi parçalara, varlıklara ve bilgi kayıtlarına dönüştürürken koşulları ve dayanakları nasıl koruyacağınızı öğrenin.', '## Aynı kaynağın üç temsili

Atlas kılavuzunda “1 Kasım’dan itibaren okuma salonu cuma günleri 10.00’da açılır; diğer hafta içi günlerde saat 09.00 olarak kalır” yazsın. Ham metin özgün ifadeyi korur. Metin parçası, ilgili bölümü aramada bulmayı sağlar. Yapılandırılmış kayıt; özneyi, ilişkiyi, değeri ve koşulları ayrı alanlara ayırır. Çizge de ilişkilerin izlenmesini kolaylaştırır. Bu temsillerin hiçbiri kaynağın doğruluğunu kendiliğinden kanıtlamaz.

| Temsil | Güçlü yönü | Kaybedebileceği bilgi |
| --- | --- | --- |
| Tam kaynak | Denetim ve yeniden yorumlama | Kolay sorgu yapısı |
| Metin parçası | Pasaj aramayı | Belge genelindeki niteleyici |
| İddia | Filtreleme ve join | Nüans veya çıkarım belirsizliği |
| Çizge kenarı | İlişki gezintisi | Açıkça bağlanmazsa kanıt |

Temsili, soracağınız soruya göre seçin. “Dördüncü paragraf ne diyor?” için tam metin gerekir. “Cuma günü dokuzdan sonra hangi salonlar açılıyor?” sorusu ise saat ve gün alanlarından yararlanır. Kaynak metni ve ona bağlı yapılandırılmış kaydı birlikte tutmak iki ihtiyacı da karşılar. Yapılandırılmış kaydı, ayrıştırıcı veya model değiştiğinde kaynaktan yeniden üretilebilen bir yorum olarak ele alın.

## MESA 0.9.5’te

MESA; özgün kaynak sürümünü, parçalarını, özgün konumlarıyla yerleşik hukuki öğeleri ve isteğe bağlı model çıkarımı bilgi kayıtlarını SQLite’ta tutar. Bir belgenin tamamını zamanla değiştiren koşullar, örneğin “1 Kasım’dan itibaren”, sürüme `valid_from` ve `valid_to` olarak yazılır; böylece `valid_at` ile yapılan arama o tarihte yürürlükte olan sürümü döndürür. MESA’da 0.9.5’ten beri çizge deposu yoktur. Bkz. [sürümlü belgeler](/docs/core/concepts-and-ingestion/#guide-surumlu-belgeler).

## Koşullarını koruyan bir iddia kurun

```text
assertion_id: a-42
subject_id: room-atlas-reading
predicate: opening_time
value: "10:00"
day_of_week: Friday
valid_from: 2026-11-01
source_revision: handbook-r3
evidence_text: "opens at 10:00 on Fridays"
extractor_version: example-parser-2
```

“Cuma” koşulunu kaldırmak kaydın anlamını değiştirir. “1 Kasım’dan itibaren” kısmını atmak da gelecekte başlayacak uygulamayı bugün geçerliymiş gibi gösterir. Birim, olumsuzluk, yetki alanı, zaman ve istisnalar anlamı etkiliyorsa kayıtta korunmalıdır. Çıkarım yöntemi bunları gösteremiyorsa kaynağı saklayın ve yorumu eksik olarak işaretleyin; koşulları sessizce atmayın.

Salonu etiketinden ayırmak için sabit kimlik kullanın. “Atlas”, “Atlas Okuma Salonu” ve “A Salonu” aynı varlık da olabilir, farklı varlıklar da. Varlık çözümleme kanıt gerektiren ayrı karardır. Metin eşleşmesi aday önerebilir; kurumlar veya erişim kapsamları arasında kayıtları otomatik birleştirmemelidir.

## Türetimi görünür tutun

<!-- diagram: Kaynak revizyonu parça, çıkarım çalışması ve koşullu iddia üretir. -->
1. Sürüm r3 · özgün metin
2. Parça c4 · tam aralık
3. Çıkarım e2 · model/parser
4. İddia a42 · niteleyiciler

*Düzeltme türetilmiş iddiayı değiştirir; özgün sürüm tanımlanabilir kalır.*

W3C PROV, kaynak izini anlatırken varlık, faaliyet ve aktör ayrımı yapar. Bu örnekte kaynak belge ve çıkarılan kayıt birer varlık; çıkarım işlemi faaliyet; yazılım hizmeti ise aktördür. Bu kavramlar, kaydın kim tarafından ve hangi kaynaktan üretildiğini sormayı kolaylaştırır. Belirli bir veritabanı şemasını zorunlu kılmaz veya çıkarımın doğru olduğunu belgelemez. [PROV genel bakış](https://www.w3.org/TR/prov-overview/)

## Yapıyı ve anlamı ayrı doğrulayın

Şema doğrulama eksik kaynak kimliğini, hatalı saati veya eksik özneyi reddedebilir. Anlamsal kontrol, kaynağın iddiayı gerçekten destekleyip desteklemediğini ve koşulların korunup korunmadığını sorar. JSON doğrulamasını geçmek yalnızca yapısal uyumu gösterir. İki model aynı yanlış anlamayı paylaşabilir; uzlaşma sinyaldir, bağımsız kaynak değildir.

Düzeltme yaparken kaynağın mı, yorumun mu değiştiğini ayırın. Kaynak aynı kaldığı hâlde “cuma” yanlışlıkla “her gün” okunmuşsa yeni bir çıkarım sürümü oluşturup hatalı kaydı geri çekin. Kılavuz gerçekten değiştiyse yeni belge sürümü oluşturun. Böylece bir yanıtın gerçek dünya, kaynak belge veya işleme yöntemi değiştiği için mi farklılaştığını inceleyebilirsiniz.

## Çıkarımı onarın

> [!EXERCISE]
> **Kendinizi sınayın**
> Çıkarım “resmî tatillerde kapalı” ifadesini `is_open=true` yapıyor. JSON şeması geçerli. İnceleme neyi kaydetmeli?
>
> **Açıklama:** Tam destek aralığı, çıkarım sürümü ve etkilenen iddia kimliğiyle anlamsal çelişkiyi kaydetmeli. Türetilmiş iddiayı geri çekin veya değiştirin; kaynak revizyonunu koruyun ve buna kaynak güncellemesi demeyin.

## Kaynaklar ve ileri okuma

1. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
2. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)

', ARRAY['assertion', 'entity', 'schema', 'chunk', 'iddia', 'varlık', 'şema', 'kanıt aralığı']::text[], 'MESA contributors', 5, 'published', 'Metinden bilgi kaydına: kaynakta neyi korumalı? — MESA', 'Bir belgeyi parçalara, varlıklara ve bilgi kayıtlarına dönüştürürken koşulları ve dayanakları nasıl koruyacağınızı öğrenin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('semantic-search', 'learn', 'en', 'Embeddings and semantic search, with numbers', '', 'Calculate similarity, distinguish dense and sparse representations, and understand why nearest neighbors are neither facts nor access decisions.', 'Calculate similarity, distinguish dense and sparse representations, and understand why nearest neighbors are neither facts nor access decisions.', '## What an embedding actually represents

An embedding model maps input into numbers arranged as a vector. Training encourages some relationships to be reflected in geometric proximity. A document about “opening hours” may be close to “when can I enter?” even without shared words. This is useful for candidate retrieval. The coordinates are learned features, not labeled columns such as “truth”, “permission” or “currentness”.

A dense representation usually stores a fixed-length array with many nonzero values. A sparse representation stores a small set of weighted dimensions from a much larger space. Classical lexical dimensions correspond to terms; learned sparse models may expand or reweight them. Sparse does not mean “no learning”, and dense does not guarantee better domain retrieval. The choice requires evaluation on your questions.

## A two-dimensional similarity calculation

```text
cosine(q, d) = dot(q, d) / (norm(q) * norm(d))
q = [1, 0]
A = [0.8, 0.6]   norm(A) = 1   cosine(q,A) = 0.8
B = [0, 1]       norm(B) = 1   cosine(q,B) = 0
C = [8, 6]       norm(C) = 10  cosine(q,C) = 0.8
```

A and C have equal cosine similarity because cosine compares direction, not length. Raw dot products differ: 0.8 for A and 8 for C. For unit-normalized vectors, cosine and dot product coincide; without normalization they need not. These invented two-dimensional vectors explain arithmetic only. They are not outputs of a language model and do not demonstrate semantic quality.

A similarity of 0.8 is not an 80% probability of relevance. Its meaning depends on the embedding model, score distribution and task. A threshold that works for one corpus may fail after changing language, chunking or model. Calibrate any threshold using judged queries and track precision/recall trade-offs.

## Encoding and indexing are different steps

<!-- diagram: Document and query encoders feed a vector comparison; eligibility is independently enforced. -->
1. Source · chunk + revision
2. Encode · fixed model identity
3. Index · exact or approximate
4. Query · compatible encoder
5. Verify · scope + evidence

*A vector index accelerates comparison. It does not define what a record means.*

Exact search scores every eligible vector. Approximate nearest-neighbor search trades some recall for lower search cost. Measure approximation loss against exact search on a manageable sample, keeping the same distance metric and scope. Separately measure semantic relevance with human judgments; an index can perfectly recover the nearest vectors while those vectors are poor answers.

## Matching dimensions is not enough

Record provider, model, revision, dimension, normalization and encoding instructions. Two models can both return 768 numbers while using incompatible spaces. Some retrieval models intentionally use different query/document encoders or prefixes; compatibility means the model’s prescribed pairing, not necessarily identical strings. Changing representation usually requires re-encoding documents and rebuilding the derived index.

Identifiers, negation and near-duplicate versions expose limits. “Rule A-17 applies” and “Rule A-17 does not apply” may be semantically close. Use lexical retrieval for exact symbols and structured filters for validity. DPR and Sentence-BERT provide examples of learned dense retrieval and sentence representation, not a guarantee for every multilingual archive. [DPR](https://arxiv.org/abs/2004.04906), [Sentence-BERT](https://arxiv.org/abs/1908.10084).

## What we measured in MESA

We compared two 1,024-dimensional models on the same Turkish legal corpus. BAAI/bge-m3 was ahead overall, while the Turkish model Mürşit Large led on number, date and docket questions without a reranker.

| MESA 0.9.3, dev, Tier M, T1 | bge-m3 | Mürşit Large |
| --- | --- | --- |
| MRR | 0.5758 | 0.5626 |
| Hit@1 | 0.4375 | 0.4464 |
| Hit@5 | 0.7411 | 0.6875 |
| Hit@5, paraphrase (32 questions) | 0.7188 | 0.5938 |
| Hit@5, number/date/docket (35 questions) | 0.8286 | 0.8571 |

The overall gap is six of 112 answerable questions, so it may not hold on another sample. Read the setup and limits in the [embedding comparison](/research/turkish-legal-embedding-comparison/).

Embeddings also have a cost. With MESA 0.9.4 defaults on benchmark v2 dev, adding bge-m3 raised Hit@5 from 0.5446 to 0.7768. Median search time rose from 0.33 s to 1.64 s, and ingestion of 141 documents rose from 399.44 s to 637.68 s (one Colab A100 runtime).

Model identity matters in practice. MESA changed its default from a 768-dimensional model to bge-m3 in 0.9.3. An older store must keep both its model and dimension settings, or be rebuilt before switching.

## Explain a suspicious improvement

> [!EXERCISE]
> **Check your understanding**
> After switching models, vectors still have 768 dimensions and the service returns results. Is that enough to keep the old document index?
>
> **Answer:** No. Check the query/document representation contract and re-encode if incompatible. A syntactically valid vector can still be in a different space. Evaluate both neighbor recovery and task relevance.

## Sources and further reading

1. [Karpukhin et al. (2020) · Dense Passage Retrieval](https://arxiv.org/abs/2004.04906)
2. [Reimers & Gurevych (2019) · Sentence-BERT](https://arxiv.org/abs/1908.10084)
3. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)

', ARRAY['embedding', 'dense', 'sparse', 'cosine', 'vector', 'vektör', 'kosinüs', 'anlamsal arama']::text[], 'MESA contributors', 6, 'published', 'Embeddings and semantic search, with numbers — MESA Learn', 'Calculate similarity, distinguish dense and sparse representations, and understand why nearest neighbors are neither facts nor access decisions.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('semantic-search', 'learn', 'tr', 'Anlamsal arama: vektörler neyi anlatır?', '', 'Sayısal temsillerin nasıl karşılaştırıldığını örneklerle görün. Benzerliğin neden doğruluk veya erişim izni anlamına gelmediğini öğrenin.', 'Sayısal temsillerin nasıl karşılaştırıldığını örneklerle görün. Benzerliğin neden doğruluk veya erişim izni anlamına gelmediğini öğrenin.', '## Embedding neyi temsil eder?

Bir sayısal temsil (embedding) modeli, girdiyi vektör hâlinde düzenlenmiş sayılara dönüştürür. Eğitim sırasında bazı anlam ilişkileri bu uzaydaki yakınlığa yansır. Örneğin “Açılış saatleri” başlıklı belge, ortak sözcük bulunmasa da “Ne zaman girebilirim?” sorusuna yakın çıkabilir. Bu yöntem aday bulmaya yardımcı olur. Ancak vektörün boyutları “doğruluk”, “erişim izni” veya “güncellik” gibi açıkça adlandırılmış alanlar değildir.

Yoğun temsil, genellikle çok sayıda sıfır olmayan değer içeren sabit uzunlukta bir dizidir. Seyrek temsil ise çok daha büyük bir uzaydan az sayıda boyut ve ağırlık tutar. Klasik sözcük tabanlı temsillerde boyutlar terimlere karşılık gelir; öğrenilmiş seyrek modeller bu terimleri genişletebilir veya ağırlıklarını değiştirebilir. Seyrek olması modelin öğrenmediği, yoğun olması da her alanda daha iyi aradığı anlamına gelmez. Seçimi kendi sorularınızla ölçerek yapın.

## İki boyutlu benzerlik hesabı

```text
cosine(q, d) = dot(q, d) / (norm(q) * norm(d))
q = [1, 0]
A = [0.8, 0.6]   norm(A) = 1   cosine(q,A) = 0.8
B = [0, 1]       norm(B) = 1   cosine(q,B) = 0
C = [8, 6]       norm(C) = 10  cosine(q,C) = 0.8
```

A ve C’nin kosinüs benzerliği aynıdır; kosinüs uzunluğu değil yönü karşılaştırır. Ham iç çarpım A için 0,8, C için 8’dir. Birim uzunluğa normalize edilmiş vektörlerde kosinüs ile iç çarpım aynıdır; normalizasyon yoksa aynı olmak zorunda değildir. Bu kurgusal iki boyutlu vektörler yalnızca hesabı açıklar. Dil modeli çıktısı veya anlamsal kalite kanıtı değildir.

0,8 benzerlik puanı, sonucun yüzde 80 olasılıkla ilgili olduğunu söylemez. Puanın anlamı modele, puan dağılımına ve göreve bağlıdır. Bir veri kümesinde işe yarayan eşik, dil, parçalama veya model değiştiğinde uygun olmayabilir. Eşiği etiketli sorgularla belirleyin; bulunan sonuçların isabetiyle ilgili sonuçları yakalama oranını birlikte izleyin.

## Kodlama ile indeksleme farklı adımlardır

<!-- diagram: Belge ve sorgu kodlayıcıları vektör karşılaştırmasını besler; uygunluk bağımsız uygulanır. -->
1. Kaynak · parça + sürüm
2. Kodla · sabit model kimliği
3. İndeks · tam veya yaklaşık
4. Sorgu · uyumlu kodlayıcı
5. Doğrula · kapsam + kanıt

*Vektör indeksi karşılaştırmayı hızlandırır. Kaydın anlamını belirlemez.*

Tam arama, uygun olan bütün vektörleri puanlar. Yaklaşık en yakın komşu araması ise daha düşük maliyet karşılığında bazı komşuları kaçırabilir. Yönetilebilir büyüklükte bir örnekte, aynı uzaklık ölçüsü ve erişim kapsamıyla tam aramaya göre ne kaybettiğini ölçün. Anlamsal ilgililiği ayrıca insan değerlendirmesiyle sınayın. İndeks en yakın vektörleri doğru bulsa bile bu vektörlerin metinleri soruya iyi yanıt vermeyebilir.

## Boyutların eşleşmesi yeterli değildir

Sağlayıcıyı, modeli, model sürümünü, boyut sayısını, normalizasyonu ve kodlama talimatını kaydedin. İki model de 768 sayı üretebilir, ancak bu sayılar farklı anlam uzaylarına ait olabilir. Bazı modeller sorgu ve belge için ayrı kodlayıcılar veya ön ekler kullanır. Önemli olan girdilerin aynı olması değil, modelin öngördüğü biçimde eşleşmesidir. Temsil değiştiğinde belgeleri yeniden kodlamak ve arama indeksini yeniden kurmak genellikle gerekir.

Kimlik numaraları, olumsuzluklar ve birbirine benzeyen belge sürümleri anlamsal aramanın sınırlarını gösterir. “A-17 kuralı uygulanır” ile “A-17 kuralı uygulanmaz” yakın vektörler üretebilir. Tam kodlar için sözcük tabanlı aramadan, geçerlilik için yapılandırılmış filtrelerden yararlanın. DPR ve Sentence-BERT, öğrenilmiş yoğun arama ve cümle temsili örnekleridir; her çok dilli arşivde aynı başarıyı garanti etmez. [DPR](https://arxiv.org/abs/2004.04906) [Sentence-BERT](https://arxiv.org/abs/1908.10084)

## MESA’da ne ölçtük?

1.024 boyutlu iki modeli aynı Türkçe hukuk derleminde karşılaştırdık. BAAI/bge-m3 genel olarak öndeydi; Türkçe model Mürşit Large ise yeniden sıralama olmadan sayı, tarih ve esas numarası sorularında öne geçti.

| MESA 0.9.3, dev, Tier M, T1 | bge-m3 | Mürşit Large |
| --- | --- | --- |
| MRR | 0,5758 | 0,5626 |
| Hit@1 | 0,4375 | 0,4464 |
| Hit@5 | 0,7411 | 0,6875 |
| Hit@5, yeniden ifade (32 soru) | 0,7188 | 0,5938 |
| Hit@5, sayı/tarih/esas no (35 soru) | 0,8286 | 0,8571 |

Genel fark 112 yanıtlanabilir sorunun altısıdır; başka bir örneklemde korunmayabilir. Kurulum ve sınırlar için [embedding karşılaştırmasını](/research/turkish-legal-embedding-comparison/) okuyun.

Gömme vektörlerinin bir maliyeti de var. MESA 0.9.4 varsayılanlarıyla benchmark v2 dev kümesinde bge-m3 eklemek Hit@5’i 0,5446’dan 0,7768’e çıkardı. Ortanca arama süresi 0,33 sn’den 1,64 sn’ye, 141 belgenin alımı 399,44 sn’den 637,68 sn’ye yükseldi (tek Colab A100 ortamı).

Model kimliği uygulamada önemlidir. MESA, 0.9.3’te varsayılanını 768 boyutlu bir modelden bge-m3’e geçirdi. Eski bir depo hem model hem boyut ayarını korumalı ya da geçişten önce yeniden oluşturulmalıdır.

## Model değişikliğini değerlendirin

> [!EXERCISE]
> **Kendinizi sınayın**
> Model değişince vektörler hâlâ 768 boyutlu ve servis sonuç döndürüyor. Eski belge indeksini kullanmak için yeterli mi?
>
> **Açıklama:** Hayır. Sorgu/belge temsil sözleşmesini kontrol edin; uyumsuzsa yeniden kodlayın. Yapısal olarak geçerli vektör başka uzayda olabilir. Hem komşu bulmayı hem görev ilgililiğini değerlendirin.

## Kaynaklar ve ileri okuma

1. [Karpukhin et al. (2020) · Dense Passage Retrieval](https://arxiv.org/abs/2004.04906)
2. [Reimers & Gurevych (2019) · Sentence-BERT](https://arxiv.org/abs/1908.10084)
3. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)

', ARRAY['embedding', 'dense', 'sparse', 'cosine', 'vector', 'vektör', 'kosinüs', 'anlamsal arama']::text[], 'MESA contributors', 6, 'published', 'Anlamsal arama: vektörler neyi anlatır? — MESA', 'Sayısal temsillerin nasıl karşılaştırıldığını örneklerle görün. Benzerliğin neden doğruluk veya erişim izni anlamına gelmediğini öğrenin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('bm25-tuning-for-domain-documents', 'learn', 'en', 'BM25: why a rare word can beat repeated words', '', 'Work through term frequency, rarity and length normalization. Tune tokenization and field weights before chasing a larger model.', 'Work through term frequency, rarity and length normalization. Tune tokenization and field weights before chasing a larger model.', '## Three questions behind lexical ranking

For “Atlas Friday hours”, a lexical retriever finds passages containing query terms. It needs to decide which match matters most. BM25 combines term rarity, within-document frequency and a correction for document length. Repeating “hours” fifty times should not make a long irrelevant document unbeatable; an uncommon identifier may be a more discriminating clue.

An inverted index maps a term to the documents containing it. Tokenization determines those terms before ranking begins. If “A-17” is split into “a” and “17”, a scoring adjustment cannot restore an identifier boundary that was never indexed. Inspect tokens and query parsing first. Exact identifiers may need a separate normalized field or equality filter.

## Read the formula one factor at a time

```text
score(d,q) = sum over query terms t:
 IDF(t) * f(t,d)*(k1+1) /
 [f(t,d) + k1*(1-b + b*len(d)/avgdl)]

One common non-negative IDF variant:
IDF(t) = ln(1 + (N - df(t) + 0.5)/(df(t) + 0.5))
N: corpus documents   df: documents containing t
f: term frequency    avgdl: average document length
```

IDF gives rarer terms greater influence. The frequency fraction saturates: going from zero to one occurrence matters more than going from ten to eleven. `k1` controls that saturation; `b` controls length normalization. At `b=0`, length has no effect. At `b=1`, the full length ratio enters. BM25 variants differ in IDF details, so record the implementation as well as the parameter names.

## Calculate the length effect

| Quantity | Short passage A | Long passage B |
| --- | --- | --- |
| Term frequency | 2 | 2 |
| Length / average length | 0.5 | 2 |
| With k1=1.2, b=0.75: denominator | 2.75 | 4.10 |
| Numerator: 2 × 2.2 | 4.4 | 4.4 |
| Frequency factor | 1.60 | 1.073 |

With the same IDF and term frequency, the shorter passage receives the larger contribution. This is arithmetic, not evidence that short chunks always win. Splitting documents changes term statistics, context completeness and the unit judged relevant. Keep chunking fixed when testing a ranking change, then evaluate chunking as its own experiment.

## Tune against failure cases

<!-- diagram: Inspect tokens, build a lexical baseline, judge results, adjust one setting and repeat. -->
1. Inspect · A-17 / I / İ
2. Baseline · fixed chunks
3. Judge · exact and paraphrase
4. Change · one field weight
5. Compare · held-out queries

*Do not tune on the same examples used for your final score.*

For Turkish, inspect dotted/dotless I, inflections and diacritics using real query/document pairs. Lowercasing and accent removal can help some matches while collapsing meaningful distinctions. Preserve original text and test both identifier precision and ordinary-language recall. Search syntax and tokenizer behavior are separate from your UI’s text normalization.

SQLite FTS5 uses fixed `k1=1.2` and `b=0.75`; its `bm25(table, ...)` arguments are column weights, not these parameters. It also returns smaller values for better matches, so ascending order is intentional. Do not copy a descending-score rule from another engine. Our worked formula uses an explicit IDF variant; FTS5’s exact scoring definition is in its own reference. [FTS5](https://www.sqlite.org/fts5.html).

## Why is Turkish harder for BM25?

BM25 matches whole tokens, and Turkish adds suffixes to stems. `sözleşme`, `sözleşmesinin` and `sözleşmelerinde` are three index terms. In our 141-document legal corpus, the prefix `karar` covers 87 distinct forms, `yonet` 55, `sozle` 44 and `madde` 39.

- Suffixes split one concept across many terms, which also splits its term statistics.
- A shared prefix can join unrelated words. `sözle*` finds `sözleşmesinin`, and it also finds `sözlerini`.
- Default lowercasing maps `I` to `i`, while Turkish maps it to `ı`. SQLite’s `unicode61` tokenizer stores `YARGITAY` as `yargitay` and `Yargıtay` as `yargıtay`.
- Numbers need exact matching. A law number such as `6098` must not match by prefix.

## What we measured in MESA

MESA 0.9.4 searches the first five characters of query tokens with 6 or more characters and no digits. We tested how often that matters on 112 answerable Turkish legal dev questions.

| Eligible query terms against gold evidence | Count | Share |
| --- | --- | --- |
| Found exactly | 290 | 33.2% |
| Found only through the 5-character prefix | 252 | 28.9% |
| Not found | 331 | 37.9% |
| Total | 873 | 100% |

Those numbers suggest a large opportunity, but the measured gain was small. Prefix matching moved Hit@5 from 50/112 to 52/112: four questions entered the top 5 and two left it (pre-release 0.9.4 build, benchmark v2 dev, Tier M, models off, shared store).

Read the method, examples and limits in [Why BM25 Struggles With Turkish](/research/bm25-turkish-prefix-matching/). Larger gains came from [changing fusion weights](/research/what-improved-search-in-0-9-4/).

## Choose the first debugging step

> [!EXERCISE]
> **Check your understanding**
> Every search for policy A-17 returns policy A-71 first. Should you immediately increase a ranking weight?
>
> **Answer:** Inspect indexed tokens and query syntax, then test an exact identifier field. If the index no longer distinguishes the identifiers, weighting cannot reliably repair it. Only tune scores after the representation is correct.

## Sources and further reading

1. [Manning, Raghavan & Schütze · Okapi BM25](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html)
2. [SQLite · FTS5 reference](https://www.sqlite.org/fts5.html)

', ARRAY['BM25', 'IDF', 'tokenization', 'FTS5', 'lexical', 'sözcüksel', 'Türkçe', 'tokenizasyon']::text[], 'MESA contributors', 7, 'published', 'BM25: why a rare word can beat repeated words — MESA Learn', 'Work through term frequency, rarity and length normalization. Tune tokenization and field weights before chasing a larger model.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('bm25-tuning-for-domain-documents', 'learn', 'tr', 'BM25: bir sözcük ne zaman daha önemli olur?', '', 'Sözcük sıklığının, nadirliğin ve belge uzunluğunun sıralamayı nasıl etkilediğini hesaplayın. Modeli büyütmeden önce metnin nasıl işlendiğini inceleyin.', 'Sözcük sıklığının, nadirliğin ve belge uzunluğunun sıralamayı nasıl etkilediğini hesaplayın. Modeli büyütmeden önce metnin nasıl işlendiğini inceleyin.', '## Sözcüksel sıralamanın arkasındaki üç soru

“Atlas cuma saatleri” sorgusunda sözcük tabanlı arama, bu terimleri içeren pasajları bulur. BM25 hangi eşleşmenin daha önemli olduğuna karar verirken sözcüğün nadirliğini, belge içindeki sıklığını ve belge uzunluğunu birlikte kullanır. “Saat” sözcüğünü elli kez yineleyen ilgisiz bir belge sırf bu yüzden öne çıkmamalıdır. Nadir bir kimlik kodu çok daha ayırt edici olabilir.

Ters indeks, her terimi geçtiği belgelerle eşleştirir. Ancak hangi terimlerin oluşacağını metnin parçalanma yöntemi belirler. “A-17” kodu “a” ve “17” diye ayrılırsa sonradan puan ayarlamak kaybolan kimliği geri getirmez. Önce üretilen token’ları ve sorgunun nasıl çözümlendiğini inceleyin. Tam kimlik araması için ayrı bir alan veya eşitlik filtresi gerekebilir.

## Formülü çarpanlarına ayırın

```text
score(d,q) = sum over query terms t:
 IDF(t) * f(t,d)*(k1+1) /
 [f(t,d) + k1*(1-b + b*len(d)/avgdl)]

One common non-negative IDF variant:
IDF(t) = ln(1 + (N - df(t) + 0.5)/(df(t) + 0.5))
N: corpus documents   df: documents containing t
f: term frequency    avgdl: average document length
```

IDF, nadir geçen terimlere daha çok ağırlık verir. Sözcük sıklığının katkısı ise giderek azalır: İlk eşleşme, onuncudan on birinci tekrara geçişten daha önemlidir. `k1` bu doygunluğu, `b` belge uzunluğuna göre düzeltmeyi belirler. `b=0` uzunluk etkisini kaldırır; `b=1` tam uzunluk oranını kullanır. BM25 uygulamalarında IDF hesabı değişebilir; yalnızca parametreleri değil, kullanılan uygulamayı da kaydedin.

## Uzunluk etkisini hesaplayın

| Nicelik | Kısa pasaj A | Uzun pasaj B |
| --- | --- | --- |
| Terim sıklığı | 2 | 2 |
| Uzunluk / ortalama uzunluk | 0.5 | 2 |
| k1=1.2, b=0.75: payda | 2.75 | 4.10 |
| Pay: 2 × 2.2 | 4.4 | 4.4 |
| Sıklık çarpanı | 1.60 | 1.073 |

IDF ve sözcük sıklığı aynıysa kısa pasaj daha yüksek katkı alır. Bu hesap, kısa parçaların her durumda daha iyi olduğunu göstermez. Metni bölmek sözcük istatistiklerini, bağlam bütünlüğünü ve ilgili sayılan birimi değiştirir. Sıralama ayarını sınarken parçalamayı sabit tutun; parçalama değişikliğini ayrı bir deneyde değerlendirin.

## Hata örneklerine göre ayarlayın

<!-- diagram: Token’ları inceleyin, sözcüksel taban kurun, sonuçları etiketleyin, tek ayarı değiştirip tekrarlayın. -->
1. İncele · A-17 / I / İ
2. Taban · sabit parçalar
3. Etiketle · tam ve dolaylı
4. Değiştir · tek alan ağırlığı
5. Karşılaştır · ayrılmış sorgular

*Son skoru vereceğiniz örneklerle ayar yapmayın.*

Türkçe sorgu ve belgelerde noktalı/noktasız I, ekler ve düzeltme işaretleriyle oluşan farkları inceleyin. Küçük harfe dönüştürmek veya işaretleri kaldırmak bazı eşleşmeleri kolaylaştırırken anlamlı ayrımları da silebilir. Özgün metni koruyun; hem kimlik kodlarının tam eşleşmesini hem doğal dilde ilgili sonuçları bulma oranını test edin. Arama motorunun sorgu dili ve token üretimi, arayüzdeki metin normalizasyonundan ayrıdır.

SQLite FTS5 sabit `k1=1.2` ve `b=0.75` kullanır; `bm25(table, ...)` argümanları bu parametreler değil sütun ağırlıklarıdır. Daha iyi eşleşmeye daha küçük değer döndürdüğü için artan sıralama bilinçlidir. Başka motordan azalan-skor kuralı kopyalamayın. Hesap örneğimiz belirli bir IDF çeşidi kullanır; FTS5’in tam tanımı kendi referansındadır. [FTS5](https://www.sqlite.org/fts5.html).

## Türkçe BM25 için neden daha zordur?

BM25 tam token eşleştirir; Türkçe ise köklere ek getirir. `sözleşme`, `sözleşmesinin` ve `sözleşmelerinde` üç ayrı dizin terimidir. 141 belgelik hukuk derlemimizde `karar` öneki 87, `yonet` 55, `sozle` 44, `madde` 39 farklı biçimi kapsıyor.

- Ekler tek kavramı birçok terime böler; terim istatistikleri de bölünür.
- Ortak önek ilgisiz sözcükleri birleştirebilir. `sözle*`, `sözleşmesinin` biçimini bulur; `sözlerini` sözcüğünü de bulur.
- Varsayılan küçük harf dönüşümü `I` harfini `i` yapar; Türkçede ise `ı` olmalıdır. SQLite’ın `unicode61` tokenizer’ı `YARGITAY` sözcüğünü `yargitay`, `Yargıtay` sözcüğünü `yargıtay` olarak saklar.
- Sayılar birebir eşleşmelidir. `6098` gibi bir kanun numarası önekle eşleşmemelidir.

## MESA’da ne ölçtük?

MESA 0.9.4, 6 veya daha uzun olan ve rakam içermeyen sorgu token’larının ilk beş karakterini arar. Bunun ne kadar önemli olduğunu 112 yanıtlanabilir Türkçe hukuk dev sorusunda ölçtük.

| Uygun sorgu terimlerinin doğru kanıtla eşleşmesi | Sayı | Pay |
| --- | --- | --- |
| Birebir bulundu | 290 | %33,2 |
| Yalnızca 5 karakterlik önekle bulundu | 252 | %28,9 |
| Bulunamadı | 331 | %37,9 |
| Toplam | 873 | %100 |

Bu sayılar büyük bir fırsat varmış gibi gösteriyor; ama ölçülen kazanç küçüktü. Önek eşleştirme Hit@5’i 50/112’den 52/112’ye taşıdı: dört soru ilk 5’e girdi, iki soru çıktı (0.9.4 öncesi derleme, benchmark v2 dev, Tier M, modeller kapalı, ortak depo).

Yöntem, örnekler ve sınırlar için [Türkçe Metinlerde BM25 Neden Zorlanır?](/research/bm25-turkish-prefix-matching/) yazısını okuyun. Daha büyük kazançlar [birleştirme ağırlıklarını değiştirmekten](/research/what-improved-search-in-0-9-4/) geldi.

## İlk teşhis adımını seçin

> [!EXERCISE]
> **Kendinizi sınayın**
> A-17 politikası araması her defasında A-71’i öne getiriyor. Hemen sıralama ağırlığını mı artırmalısınız?
>
> **Açıklama:** İndekslenen token ve sorgu sözdizimini inceleyin; sonra tam kimlik alanını test edin. İndeks kimlikleri ayırmıyorsa ağırlık bunu güvenilir biçimde onaramaz. Temsil doğru olduktan sonra skor ayarlayın.

## Kaynaklar ve ileri okuma

1. [Manning, Raghavan & Schütze · Okapi BM25](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html)
2. [SQLite · FTS5 reference](https://www.sqlite.org/fts5.html)

', ARRAY['BM25', 'IDF', 'tokenization', 'FTS5', 'lexical', 'sözcüksel', 'Türkçe', 'tokenizasyon']::text[], 'MESA contributors', 7, 'published', 'BM25: bir sözcük ne zaman daha önemli olur? — MESA', 'Sözcük sıklığının, nadirliğin ve belge uzunluğunun sıralamayı nasıl etkilediğini hesaplayın. Modeli büyütmeden önce metnin nasıl işlendiğini inceleyin.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('hybrid-retrieval-explained', 'learn', 'en', 'What is hybrid search? BM25, vectors and reranking', '', 'Hybrid search combines keyword and vector retrieval. Learn when it helps, how to fuse results and which stage to fix when search fails.', 'Hybrid search runs keyword search, usually BM25, and vector search for the same query, then combines their results. Keyword search preserves exact terms, while vector search can match different wording. It helps when each method finds relevant results the other misses.', '## What is hybrid search?

Hybrid search, also called hybrid retrieval, combines at least two retrieval methods in one search pipeline. The common pair is BM25 keyword search and dense vector search. Each method returns candidates, a fusion step such as RRF merges them, and an optional reranker refines the top results.

| Compare | BM25 keyword search | Vector search |
| --- | --- | --- |
| Matches | Words and terms in the text | Similarity between embeddings |
| Strong at | Names, codes, IDs and exact phrases | Paraphrases and different wording |
| Can miss | The same idea in other words | A rare exact code or number |
| Needs | A text index and language analysis | An embedding model and vector index |

## Two ways to miss the same answer

A reader asks “When can I visit on the last working day?” The handbook says “Friday opening: 10:00.” Dense retrieval may bridge the wording; lexical retrieval may preserve exact room names and policy IDs. Hybrid retrieval combines complementary candidate sets. It is useful only when the additional lane finds relevant items that the baseline misses, or improves their ordering at acceptable cost.

Adding a graph or another embedding model is not automatically an improvement. Nearly identical lanes can reinforce the same mistake. Begin with one interpretable lexical baseline and one compatible dense model; measure overlap, unique relevant hits, empty results and latency. Add complexity only when a documented failure calls for it. MESA removed its own graph store in 0.9.5 for this reason: on its dev questions graph search found no correct passage the other lanes missed, and turning it off lost no question ([measurements](/research/why-mesa-removed-its-graph-store/)). BEIR illustrates that retrieval methods vary across datasets; its benchmark results are not a score for your archive. [BEIR](https://arxiv.org/abs/2104.08663).

## Keep the stages separate

<!-- diagram: Authorized lexical and vector candidates are reconciled by identity, fused, optionally reranked and packed. -->
1. Authorize · fixed scope
2. Retrieve · lexical + dense
3. Reconcile · canonical IDs
4. Fuse · combine rankings
5. Rerank / pack · final evidence

*Candidate generation aims for coverage; reranking spends more work on fewer items.*

Suppose each lane returns 20 candidates and 8 IDs overlap. The union contains 32 unique candidates, not 40. Deduplicate using the actual retrieval unit: document, passage or assertion. Two chunks from one document may be legitimate separate evidence, but duplicates of the same chunk should not gain extra votes merely because the backend repeated a row.

## Do not add unrelated raw scores

A cosine score of 0.72 and a lexical score of 12 are not on a common scale. Adding them makes the result depend on arbitrary ranges. Rank fusion uses positions; score fusion needs an explicitly chosen normalization or learned calibration. Preserve lane scores and ranks in traces so you can explain why a candidate moved. See the next lesson for a complete RRF calculation.

| Stage | Question | Useful measure |
| --- | --- | --- |
| Candidate retrieval | Did relevant evidence enter the union? | Recall at candidate cutoff |
| Fusion | Did complementary evidence move up? | nDCG / MRR at fixed cutoff |
| Reranking | Did extra scoring improve order? | Gain versus latency and cost |
| Packing | Did complete evidence reach the model? | Support and budget compliance |

## What a reranker can and cannot fix

A cross-encoder scores a query and candidate together, allowing direct interaction between their tokens. This is typically more expensive than comparing precomputed document vectors, so it is applied to a shortlist. Nogueira and Cho study BERT passage reranking; that design does not establish that any particular reranker will improve your domain. [Paper](https://arxiv.org/abs/1901.04085).

A reranker cannot recover a relevant record missing from its input. If the union has zero relevant candidates, changing the reranker will not solve recall. Nor should a reranker override access control or revive a superseded source. Enforce eligibility and verify final evidence identity throughout the pipeline; “highly relevant but forbidden” is still forbidden.

## When should you use hybrid search?

- Users search with both exact identifiers and natural language.
- Your documents contain codes, names, dates or legal citations that must not be blurred.
- Keyword search misses paraphrases, while vector search misses exact terms.
- Judged questions show that the second method adds relevant results.

Keep one method if it already finds the evidence and a second lane adds only latency. In Turkish, also test suffixes and characters such as ı and i, because language analysis can change what keyword search finds.

## A simple first hybrid search pipeline

1. Apply access scope before retrieval.
2. Run BM25 and vector search separately, for example top 50 from each.
3. Deduplicate each list using the same retrieval unit.
4. Fuse with [Reciprocal Rank Fusion](/learn/reciprocal-rank-fusion-explained/), starting with k = 60.
5. Measure recall, MRR or nDCG on judged questions.
6. Add a reranker only if the right evidence is already in the candidates but ranks too low.

## What we measured in MESA

Each added stage helped on our Turkish legal dev set, and each one cost time.

| MESA 0.9.4 defaults, dev, Tier M | MRR | Hit@5 | Search p50 |
| --- | --- | --- | --- |
| T0: lexical only, models off | 0.3954 | 0.5446 | 0.33 s |
| T1b: + bge-m3 embeddings | 0.6487 | 0.7768 | 1.64 s |
| T2: + bge-reranker-v2-m3 | 0.7945 | 0.9107 | 2.27 s |

| Passage Hit@5 by category, dev (questions) | T0 | T1b | T2 |
| --- | --- | --- | --- |
| Exact wording (31) | 0.6774 | 0.8710 | 0.9355 |
| Number, date, docket (35) | 0.6286 | 0.8571 | 0.9429 |
| Paraphrase (32) | 0.5312 | 0.7812 | 0.9375 |
| Cross-document (14) | 0.0714 | 0.3571 | 0.7143 |

> [!NOTE]
> **Setup**
> Published MESA 0.9.4, one Colab NVIDIA A100 80 GB runtime, benchmark v2 dev split, Tier M, 141 documents, 5,041 chunks. Relevance uses 112 answerable questions and latency uses all 128.

Embeddings helped most on paraphrases, where Turkish query words often differ from the source. In our [BM25 analysis](/research/bm25-turkish-prefix-matching/), 119 of 243 eligible paraphrase query terms did not match the evidence at all. Exact legal lookups still benefit from keeping a lexical lane.

More lanes do not always help. [The 0.9.4 fusion defaults](/research/what-improved-search-in-0-9-4/) raised T0 and T1b dev Hit@5, but lowered T2 dev Hit@5 from 0.9286 to 0.9107. Model choice also mattered less after reranking: the [embedding comparison](/research/turkish-legal-embedding-comparison/) found 48 tied questions without a reranker and 101 with one, out of 112 (MESA 0.9.3, benchmark v2 dev, Tier M).

## Locate the failure

> [!EXERCISE]
> **Check your understanding**
> The correct passage is rank 45 in the dense lane, absent from lexical top 20, and you rerank only the top-20 union. Can a better reranker find it?
>
> **Answer:** No. It never reaches the reranker. Investigate query representation, lane cutoff, chunking and candidate recall. Compare changes on the same judged questions before spending more on reranking.

## Hybrid search questions

**Is hybrid search always better than vector search?**
: No. It helps when the lanes find different relevant results. Compare both on your own judged questions.

**Is hybrid search the same as RAG?**
: No. Hybrid search is a retrieval method. RAG uses retrieved text to help a language model generate an answer, and it may or may not use hybrid search.

**Do I need a reranker?**
: Not always. A reranker can improve ordering, but it adds cost and cannot recover a result missing from its input.

**How do you combine BM25 and vector scores?**
: A common starting point is RRF, which uses ranks. If you combine raw scores, choose and test an explicit normalization first.

## Sources and further reading

1. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)
2. [Nogueira & Cho (2019) · Passage Re-ranking with BERT](https://arxiv.org/abs/1901.04085)
3. [Cormack, Clarke & Büttcher (2009) · Reciprocal Rank Fusion](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)
4. [Microsoft Learn · Hybrid search scoring (RRF)](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking)

', ARRAY['hybrid', 'reranking', 'candidate recall', 'cross encoder', 'hibrit', 'yeniden sıralama', 'aday']::text[], 'MESA contributors', 7, 'published', 'What Is Hybrid Search? BM25 and Vector Search — MESA', 'Hybrid search combines keyword and vector retrieval. Learn when BM25 plus vectors helps, how fusion and reranking work and how to measure the result.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('hybrid-retrieval-explained', 'learn', 'tr', 'Hibrit arama nedir? BM25, vektörler ve yeniden sıralama', '', 'Hibrit arama, sözcük ve vektör aramayı birleştirir. Ne zaman işe yaradığını, sonuçların nasıl birleştirildiğini ve hatanın hangi aşamada olduğunu öğrenin.', 'Hibrit arama, aynı sorgu için sözcük aramasını (genellikle BM25) ve vektör aramayı çalıştırıp sonuçlarını birleştirir. Sözcük araması tam terimleri korur, vektör arama ise farklı ifadeleri eşleştirebilir. Her yöntem diğerinin kaçırdığı ilgili sonuçları buluyorsa işe yarar.', '## Hibrit arama nedir?

Hibrit arama, en az iki arama yöntemini tek akışta birleştirir. En yaygın ikili BM25 sözcük araması ve yoğun vektör aramadır. Her yöntem aday döndürür, RRF gibi bir birleştirme adımı bunları tek listede toplar ve isteğe bağlı bir yeniden sıralayıcı üst sonuçları iyileştirir.

| Karşılaştırma | BM25 sözcük araması | Vektör arama |
| --- | --- | --- |
| Eşleştirdiği | Metindeki sözcükler ve terimler | Embedding’ler arasındaki benzerlik |
| Güçlü olduğu | Ad, kod, kimlik ve tam ifadeler | Farklı sözcüklerle anlatılan aynı fikir |
| Kaçırabileceği | Başka sözcüklerle yazılmış aynı fikir | Nadir bir kod veya tam sayı |
| Gereksinimi | Metin dizini ve dil analizi | Embedding modeli ve vektör dizini |

## Aynı cevabı kaçırmanın iki yolu

Kullanıcı “Son iş gününde ne zaman gelebilirim?” diye sorsun; kılavuzda ise “Cuma açılışı: 10.00” yazsın. Anlamsal arama bu ifade farkını aşabilir. Sözcük tabanlı arama da salon adını veya kural kodunu tam eşleştirebilir. Hibrit arama, farklı yöntemlerin bulduğu adayları birleştirir. Yeni bir kanal, diğerinin kaçırdığı ilgili sonucu buluyorsa veya kabul edilebilir maliyetle sıralamayı iyileştiriyorsa yararlıdır.

Çizge veya başka bir model eklemek, aramayı kendiliğinden iyileştirmez. Birbirine çok benzeyen kanallar aynı hatayı güçlendirebilir. Önce anlaşılır bir sözcük tabanlı yöntem ve uyumlu bir anlamsal model kurun. Ortak ve yalnızca tek kanalda bulunan ilgili sonuçları, boş yanıtları ve gecikmeyi ölçün. Karmaşıklığı, gördüğünüz bir hatayı çözmek için artırın. MESA da 0.9.5’te kendi çizge deposunu bu nedenle kaldırdı: dev sorularında çizge araması, diğer kanalların kaçırdığı hiçbir doğru pasajı bulmadı ve kapatılması hiçbir soruyu kaybettirmedi ([ölçümler](/research/why-mesa-removed-its-graph-store/)). BEIR, yöntemlerin başarısının veri kümesine göre değiştiğini gösterir; o çalışmanın puanı sizin arşivinizin puanı değildir. [BEIR](https://arxiv.org/abs/2104.08663)

## Aşamaları ayrı tutun

<!-- diagram: Yetkili sözcüksel ve vektör adayları kimlikle uzlaştırılır, birleştirilir, gerekirse yeniden sıralanır ve paketlenir. -->
1. Yetkilendir · sabit kapsam
2. Getir · sözcüksel + yoğun
3. Uzlaştır · kanonik kimlikler
4. Birleştir · sıralamalar
5. Sırala / paketle · son kanıt

*Aday üretimi kapsamayı hedefler; yeniden sıralama az öğeye daha fazla iş harcar.*

İki kanal da 20 aday döndürsün ve sekiz kimlik ortak olsun. Birleşimde 40 değil, 32 ayrı aday bulunur. Tekrarları, gerçekten aradığınız birime göre ayıklayın: belge, pasaj veya bilgi kaydı. Aynı belgedeki iki parça ayrı dayanak olabilir; aynı parçanın kopyası ise arka uç iki satır döndürdü diye fazladan katkı almamalıdır.

## İlişkisiz ham skorları toplamayın

0,72 kosinüs puanı ile sözcük tabanlı aramadan gelen 12 puan aynı ölçekte değildir. Bunları doğrudan toplamak, sonucu keyfî puan aralıklarına bağımlı kılar. Sıralama birleştirme, listedeki konumları kullanır. Ham puanları birleştirmek için ise açık bir normalizasyon veya öğrenilmiş eşleme gerekir. Sonucun neden yükseldiğini açıklayabilmek için her kanalın puanını ve sırasını koruyun. Sonraki derste RRF hesabını yapacağız.

| Aşama | Soru | Yararlı ölçü |
| --- | --- | --- |
| Aday arama | İlgili kanıt birleşime girdi mi? | Aday kesiminde Recall |
| Birleştirme | Tamamlayıcı kanıt yükseldi mi? | Sabit kesimde nDCG / MRR |
| Yeniden sıralama | Ek skor sıralamayı iyileştirdi mi? | Gecikme/maliyete göre kazanım |
| Paketleme | Tam kanıt modele ulaştı mı? | Destek ve bütçe uyumu |

## Yeniden sıralama neyi düzeltebilir?

Cross-encoder, sorguyla adayı birlikte değerlendirir; iki metindeki token’lar hesap sırasında doğrudan etkileşir. Bu işlem, hazır belge vektörlerini karşılaştırmaktan genellikle daha pahalıdır; bu yüzden kısa bir aday listesine uygulanır. Nogueira ve Cho, BERT ile pasajları yeniden sıralamayı inceler. Çalışma, her yeniden sıralayıcının sizin alanınızda iyileşme sağlayacağını göstermez. [Makale](https://arxiv.org/abs/1901.04085)

Yeniden sıralayıcı, kendisine ulaşmayan ilgili bir kaydı bulamaz. Birleşen adaylar arasında doğru pasaj yoksa yalnızca bu bileşeni değiştirmek eksik sonucu çözmez. Yeniden sıralama erişim izinlerini de aşmamalı veya geçersiz kaynağı geri getirmemelidir. Uygunluk denetimini akış boyunca koruyun ve son dayanağın kimliğini doğrulayın. Çok ilgili olması, erişimi yasak bir kaydı kullanılabilir yapmaz.

## Hibrit arama ne zaman kullanılmalı?

- Kullanıcılar hem tam kimliklerle hem doğal dille arıyorsa.
- Belgelerde bulanıklaşmaması gereken kod, ad, tarih veya hukuki atıflar varsa.
- Sözcük araması farklı ifadeleri, vektör arama ise tam terimleri kaçırıyorsa.
- Etiketli sorular ikinci yöntemin yeni ilgili sonuçlar eklediğini gösteriyorsa.

Bir yöntem kanıtı zaten buluyorsa ve ikinci kanal yalnızca gecikme ekliyorsa tek yöntemle kalın. Türkçede ekleri ve ı/i gibi harfleri de test edin; dil analizi sözcük aramasının bulduklarını değiştirebilir.

## Basit bir ilk hibrit arama akışı

1. Aramadan önce erişim kapsamını uygulayın.
2. BM25 ve vektör aramayı ayrı çalıştırın; örneğin her birinden ilk 50 sonucu alın.
3. Her listeyi aynı arama birimine göre tekilleştirin.
4. [Reciprocal Rank Fusion](/learn/reciprocal-rank-fusion-explained/) ile k = 60’tan başlayarak birleştirin.
5. Etiketli sorularda Recall, MRR veya nDCG ölçün.
6. Yeniden sıralayıcıyı yalnızca doğru kanıt adaylarda olduğu hâlde alt sıralarda kalıyorsa ekleyin.

## MESA’da ne ölçtük?

Türkçe hukuk dev kümemizde eklenen her aşama sonucu iyileştirdi; her biri de zaman maliyeti getirdi.

| MESA 0.9.4 varsayılanları, dev, Tier M | MRR | Hit@5 | Arama p50 |
| --- | --- | --- | --- |
| T0: yalnızca sözcük araması, modeller kapalı | 0,3954 | 0,5446 | 0,33 sn |
| T1b: + bge-m3 gömme vektörleri | 0,6487 | 0,7768 | 1,64 sn |
| T2: + bge-reranker-v2-m3 | 0,7945 | 0,9107 | 2,27 sn |

| Kategoriye göre pasaj Hit@5, dev (soru) | T0 | T1b | T2 |
| --- | --- | --- | --- |
| Birebir ifade (31) | 0,6774 | 0,8710 | 0,9355 |
| Sayı, tarih, esas no (35) | 0,6286 | 0,8571 | 0,9429 |
| Yeniden ifade (32) | 0,5312 | 0,7812 | 0,9375 |
| Çok belgeli (14) | 0,0714 | 0,3571 | 0,7143 |

> [!NOTE]
> **Kurulum**
> Yayımlanan MESA 0.9.4, tek bir Colab NVIDIA A100 80 GB ortamı, benchmark v2 dev bölümü, Tier M, 141 belge, 5.041 parça. İlgililik 112 yanıtlanabilir soruyu, gecikme 128 sorunun tamamını kullanır.

Gömme vektörleri en çok, Türkçe sorgu sözcüklerinin kaynaktan sıkça ayrıldığı yeniden ifade sorularında işe yaradı. [BM25 analizimizde](/research/bm25-turkish-prefix-matching/) yeniden ifade sorularındaki 243 uygun terimin 119’u kanıtla hiç eşleşmedi. Birebir hukuki aramalar için sözcük kanalını korumak yine yararlıdır.

Daha çok kanal her zaman yararlı değildir. [0.9.4 birleştirme varsayılanları](/research/what-improved-search-in-0-9-4/) T0 ve T1b dev Hit@5’i artırdı, T2 dev Hit@5’i ise 0,9286’dan 0,9107’ye düşürdü. Yeniden sıralamadan sonra model seçiminin etkisi de azaldı: [embedding karşılaştırmasında](/research/turkish-legal-embedding-comparison/) 112 sorunun 48’i yeniden sıralayıcı olmadan, 101’i onunla eşit sırada kaldı (MESA 0.9.3, benchmark v2 dev, Tier M).

## Hatayı konumlandırın

> [!EXERCISE]
> **Kendinizi sınayın**
> Doğru pasaj yoğun kanalda 45. sırada, sözcüksel ilk 20’de yok; yalnızca ilk-20 birleşimini yeniden sıralıyorsunuz. Daha iyi yeniden sıralayıcı onu bulabilir mi?
>
> **Açıklama:** Hayır. Bu pasaj yeniden sıralayıcıya hiç ulaşmıyor. Sorgu temsili, kanal kesimi, parçalama ve aday recall’unu inceleyin. Yeniden sıralamaya daha fazla kaynak ayırmadan aynı etiketli sorularda değişiklikleri karşılaştırın.

## Hibrit arama hakkında sorular

**Hibrit arama her zaman vektör aramadan iyi midir?**
: Hayır. Kanallar farklı ilgili sonuçlar bulduğunda işe yarar. İkisini kendi etiketli sorularınızla karşılaştırın.

**Hibrit arama ile RAG aynı şey mi?**
: Hayır. Hibrit arama bir bilgi getirme yöntemidir. RAG ise getirilen metni dil modelinin yanıt üretmesine yardım etmek için kullanır; hibrit arama kullanmak zorunda değildir.

**Yeniden sıralayıcı gerekli mi?**
: Her zaman değil. Sıralamayı iyileştirebilir, ama maliyet ekler ve girdisinde olmayan sonucu geri getiremez.

**BM25 ve vektör puanları nasıl birleştirilir?**
: Yaygın başlangıç noktası, sıraları kullanan RRF’dir. Ham puanları birleştirecekseniz önce açık bir normalizasyon seçip test edin.

## Kaynaklar ve ileri okuma

1. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)
2. [Nogueira & Cho (2019) · Passage Re-ranking with BERT](https://arxiv.org/abs/1901.04085)
3. [Cormack, Clarke & Büttcher (2009) · Reciprocal Rank Fusion](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)
4. [Microsoft Learn · Hibrit arama puanlaması (RRF)](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking)

', ARRAY['hybrid', 'reranking', 'candidate recall', 'cross encoder', 'hibrit', 'yeniden sıralama', 'aday']::text[], 'MESA contributors', 7, 'published', 'Hibrit Arama Nedir? BM25 ve Vektör Arama — MESA', 'Hibrit arama, sözcük ve vektör aramayı birleştirir. BM25 ile vektörlerin ne zaman işe yaradığını, birleştirme ve yeniden sıralamayı, sonucu ölçmeyi öğrenin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('reciprocal-rank-fusion-explained', 'learn', 'en', 'What is Reciprocal Rank Fusion (RRF)?', '', 'RRF merges ranked search results using their positions instead of raw scores. Learn the formula, calculate an example and choose k.', 'Reciprocal Rank Fusion (RRF) combines several ranked lists into one. Each result receives 1/(k + rank) from every list that contains it, and the results are sorted by their total. Because it uses positions, it can combine BM25 and vector search without normalizing their scores.', '## What is RRF?

Reciprocal Rank Fusion (RRF) is a rank fusion method: it turns several ranked result lists into one list. A result near the top of a list receives a larger contribution, and a result found by several lists adds those contributions together.

RRF is common in hybrid search because BM25 scores and vector similarities use different scales. RRF ignores those raw values and uses only each result’s position.

## Combine agreement without comparing raw scores

Two retrievers disagree about the Atlas archive. Lexical ranks A, B, C; dense ranks B, C, D. You want a method that uses each list’s order without pretending their raw scores share units. Reciprocal Rank Fusion assigns a decreasing contribution to each rank and sums the contributions for the same candidate. It is a simple baseline with explicit assumptions.

Cormack, Clarke and Büttcher evaluated this method on specific retrieval experiments. Their results motivate testing RRF; they do not guarantee an improvement for your task. The original method uses unweighted votes. Weighted RRF is an extension in which each lane’s contribution is multiplied by a declared weight. [Original paper](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf).

## Use one-based ranks

```text
RRF(d) = sum over lanes containing d: w_lane / (k + rank_lane(d))
rank starts at 1; missing candidate contributes 0.
Example below: k = 60, every weight = 1.
```

| Candidate | Lexical rank | Dense rank | RRF contribution sum |
| --- | --- | --- | --- |
| A | 1 | absent / yok | 1/61 = 0.016393 |
| B | 2 | 1 | 1/62 + 1/61 = 0.032522 |
| C | 3 | 2 | 1/63 + 1/62 = 0.032002 |
| D | absent / yok | 3 | 1/63 = 0.015873 |

The fused order is B, C, A, D. Agreement across the lists lifts B and C above A, despite A’s first position in one lane. A candidate missing from a truncated list receives zero from that lane, not a vote for rank infinity or rank zero. Keep candidate cutoffs in your experiment record because truncation changes the votes.

## What changes when k changes?

With `k=60`, first place contributes 1/61 and second place 1/62, a small difference. With `k=1`, they contribute 1/2 and 1/3, a much larger difference. Smaller k emphasizes top positions; larger k flattens contributions across the retrieved ranks. This k is a smoothing constant, not the number of results returned. Choose it with held-out evidence, not because 60 is universal.

<!-- diagram: Rank lists yield per-lane votes that merge by candidate ID and sort deterministically. -->
1. Lexical · A,B,C
2. Dense · B,C,D
3. Votes · 1/(k+rank)
4. Sum by ID · one per lane
5. Sort · B,C,A,D

*The result is a rank signal, not a calibrated probability.*

## Why is k usually 60 in RRF?

The value comes from the [original 2009 SIGIR paper](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf). Cormack, Clarke and Büttcher fixed k = 60 during a pilot investigation and did not change it during validation. They reported that 60 was near-optimal in their pilot, but that the choice was not critical.

Search systems often keep this starting point. [Elasticsearch](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion) defaults `rank_constant` to 60, and [Azure AI Search](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking) describes 60 as a small value that performs well in experiments. Neither fact proves that 60 is best for your documents.

| k | Rank 1 | Rank 2 | Rank 10 | Rank 1 / Rank 10 |
| --- | --- | --- | --- | --- |
| 1 | 0.5000 | 0.3333 | 0.0909 | 5.50× |
| 10 | 0.0909 | 0.0833 | 0.0500 | 1.82× |
| 60 | 0.0164 | 0.0161 | 0.0143 | 1.15× |

The last column shows how strongly k favors the top. At k = 1, first place counts 5.50 times as much as tenth place. At k = 60, it counts only 1.15 times as much, so agreement across lists matters more than one first-place result.

> [!NOTE]
> **Do not confuse the two k values**
> In vector search, k often means how many nearest neighbors to return. The RRF k is a separate smoothing constant.

## Specify the edge cases before deployment

Deduplicate a candidate within each lane before assigning its vote. Otherwise a backend returning the same ID twice changes the method. Decide what the ID represents and keep it consistent across lanes. If one lane returns document IDs and another assertion IDs, reconcile them into the same unit before fusion; matching strings alone is not a sound identity contract.

For exactly tied fused scores, use a documented stable rule such as canonical ID ordering. For weighted fusion, reject non-finite weights and decide whether zero disables a lane. Giving two copies of the same retriever separate full weights can double-count correlated evidence. More votes do not make an incorrect or unauthorized source acceptable.

## RRF vs score normalization and reranking

| Method | Uses | Main strength | Main limit |
| --- | --- | --- | --- |
| RRF | Ranks | Simple, needs no training or score calibration | Ignores how large the score gap was |
| Score normalization | Rescaled scores | Keeps score gaps | Depends on the normalization and score distribution |
| Cross-encoder reranking | Query and passage text | Can compare meaning more directly | Costs more and sees only its shortlist |

## When should you not use RRF?

- You have only one retriever, so there is nothing to fuse.
- Score gaps carry reliable meaning that you do not want to discard.
- Your lanes return nearly the same results, so fusion adds little new evidence.
- You need a calibrated confidence value. An RRF score is not a probability.
- You have enough judged data to train and validate a better ranking model.

MESA Core 0.9.5 uses weighted RRF with k = 60, vector weight 8, BM25 weight 1 and assertion weight 0. The vector lane runs only when an embedding model is set, so with models off BM25 decides the order. These are defaults for this system, not universal settings. See the [retrieval documentation](/docs/core/retrieval-and-graph/).

## What we measured in MESA

MESA’s vector weight of 8 came from a dev-set grid, not from theory. We changed only that weight and kept the other lanes at 1.

| Vector weight | Hit@5, no reranker | MRR, no reranker | MRR, with reranker |
| --- | --- | --- | --- |
| 1 | 0.5176 | 0.3953 | 0.6816 |
| 2 | 0.5765 | 0.4565 | 0.7055 |
| 4 | 0.6588 | 0.5152 | 0.7069 |
| 8 | 0.6706 | 0.5663 | 0.6973 |

> [!NOTE]
> **Setup**
> 0.9.1 development build, benchmark v1 dev split, Tier M, 141 documents, 5,041 chunks, 85 answerable questions, bge-m3, graph on, search limit 50, reranker depth 50.

Weight 8 was best without a reranker. With a reranker, weight 4 had a slightly higher MRR. Eight was also the largest value we tried, so we do not know whether a higher weight would do better. We have not rerun this grid on benchmark v2.

A large weight changes the worked example above. With a dense weight of 8, the scores are B 0.147277, C 0.144905, D 0.126984 and A 0.016393. D now outranks A, even though A was first in the lexical list.

Equal RRF scores are also common. In a [fresh-store test](/research/why-two-search-runs-differed/), random tie-breaks changed ranks on 49 of 112 answerable questions (benchmark v2 dev, Tier M, models off, build before 0.9.4). Setting the assertion weight to 0 was part of a [0.9.4 change](/research/what-improved-search-in-0-9-4/) that helped T0 and T1b on dev and lowered reranked dev Hit@5 from 0.9286 to 0.9107.

## Recalculate after a weight change

> [!EXERCISE]
> **Check your understanding**
> Set the dense lane weight to zero in the table. What order remains, and what happens to D?
>
> **Answer:** A, B, C keep the lexical order. D has zero contribution; whether zero-score candidates are excluded is an explicit output policy. Do not interpret the zero as proof that D is false or irrelevant.

## RRF questions

**Does RRF need score normalization?**
: No. RRF uses ranks, so BM25 and vector scores do not need a shared scale.

**What is a good k value for RRF?**
: Start with 60, then compare a few values such as 10, 30 and 100 on judged questions from your own data.

**Does RRF rank start at 0 or 1?**
: The original formula and Elasticsearch use ranks starting at 1. Keep this consistent, because zero-based ranks change every contribution.

**What happens if a document is missing from one list?**
: That list contributes 0 for the document. Its other lists still count.

**Is a higher RRF score a confidence score?**
: No. It is useful for ordering results in one query. Do not read it as a probability that the answer is correct.

## Sources and further reading

1. [Cormack, Clarke & Büttcher (SIGIR 2009) · Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)
2. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)
3. [Elastic · Reciprocal rank fusion](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion)
4. [Microsoft Learn · Hybrid search scoring (RRF)](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking)

', ARRAY['RRF', 'rank fusion', 'weighted', 'k=60', 'sıra birleştirme', 'ağırlık']::text[], 'MESA contributors', 8, 'published', 'What Is RRF? Reciprocal Rank Fusion and k=60 — MESA', 'Reciprocal Rank Fusion (RRF) merges ranked lists using positions, not raw scores. Learn the formula, a worked example, why k is often 60 and when to avoid it.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('reciprocal-rank-fusion-explained', 'learn', 'tr', 'RRF nedir? Reciprocal Rank Fusion nasıl çalışır?', '', 'RRF, arama sonuçlarını ham puanlar yerine listedeki sıralarıyla birleştirir. Formülü öğrenin, örneği hesaplayın ve k değerini seçin.', 'Reciprocal Rank Fusion (RRF), birden fazla sıralı listeyi tek listede birleştirir. Her sonuç, bulunduğu her listeden 1/(k + sıra) katkısı alır ve sonuçlar toplam katkıya göre sıralanır. Konumları kullandığı için BM25 ile vektör aramayı puanları normalize etmeden birleştirebilir.', '## RRF nedir?

Reciprocal Rank Fusion (RRF), birden fazla sıralı sonuç listesini tek listeye dönüştüren bir sıralama birleştirme yöntemidir. Listenin üst sıralarındaki sonuç daha büyük katkı alır. Birden fazla listede bulunan sonuç ise bu katkıları toplar.

RRF hibrit aramada sık kullanılır, çünkü BM25 puanları ile vektör benzerlikleri farklı ölçeklerdedir. RRF bu ham değerleri yok sayar ve yalnızca sonucun sırasını kullanır.

## Farklı listelerdeki sıraları kullanın

Atlas arşivinde iki arama yöntemi farklı listeler üretsin: Sözcük tabanlı liste A, B, C; anlamsal liste B, C, D olsun. Ham puanları aynı ölçekteymiş gibi toplamadan bu listeleri birleştirmek istiyorsunuz. Reciprocal Rank Fusion (RRF), her konuma giderek azalan bir katkı verir ve aynı adayın farklı listelerdeki katkılarını toplar. Hesabı açık, basit bir başlangıç yöntemidir.

Cormack, Clarke ve Büttcher, yöntemi belirli arama deneylerinde değerlendirdi. Sonuçları RRF’yi denemek için gerekçe sunar; her görevde iyileşme garantisi vermez. Özgün yöntemde katkılar eşit ağırlıktadır. Ağırlıklı RRF ise her kanalın katkısını ayrıca belirlenen bir ağırlıkla çarpar. [Özgün makale](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)

## Sıralamayı birden başlatın

```text
RRF(d) = d’yi içeren kanallar üzerinden toplam: w_kanal / (k + sıra_kanal(d))
Sıra 1’den başlar; listede olmayan aday 0 katkı alır.
Aşağıdaki örnek: k = 60, tüm ağırlıklar = 1.
```

| Aday | Sözcüksel sıra | Yoğun sıra | RRF katkı toplamı |
| --- | --- | --- | --- |
| A | 1 | yok | 1/61 = 0.016393 |
| B | 2 | 1 | 1/62 + 1/61 = 0.032522 |
| C | 3 | 2 | 1/63 + 1/62 = 0.032002 |
| D | yok | 3 | 1/63 = 0.015873 |

Birleşen liste B, C, A, D olur. A tek kanalda birinci olsa da iki listede birden öne çıkan B ve C daha yüksek toplam katkı alır. Bir kanalın kısaltılmış listesinde bulunmayan aday, o kanaldan sıfır katkı alır; ona sıfırıncı veya sonsuzuncu sıra verilmez. Listenin nereden kesildiği sonucu etkilediği için bu sınırları deney kaydında belirtin.

## k değişince ne olur?

`k=60` iken birinci 1/61, ikinci 1/62 katkı yapar; fark küçüktür. `k=1` iken 1/2 ve 1/3 ile fark büyür. Küçük k üst sıraları vurgular; büyük k getirilen sıralar arasında katkıyı düzleştirir. Bu k yumuşatma sabitidir; döndürülen sonuç sayısı değildir. 60’ı evrensel saymak yerine ayrılmış değerlendirmeyle seçin.

<!-- diagram: Sıra listeleri kanal oyu üretir; oylar aday kimliğinde birleşip belirli sırayla sıralanır. -->
1. Sözcüksel · A,B,C
2. Yoğun · B,C,D
3. Oy · 1/(k+sıra)
4. Kimlikte topla · tek kanal oyu
5. Sırala · B,C,A,D

*Sonuç bir sıra sinyalidir; kalibre edilmiş olasılık değildir.*

## RRF’de k neden çoğu zaman 60?

Bu değer [2009 tarihli özgün SIGIR makalesinden](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf) gelir. Cormack, Clarke ve Büttcher, k = 60 değerini pilot çalışmada sabitlemiş ve doğrulama sırasında değiştirmemiştir. Pilot sonuçlarında 60’ın optimuma yakın olduğunu, ancak seçimin kritik olmadığını bildirmişlerdir.

Arama sistemleri çoğu zaman bu başlangıç noktasını korur. [Elasticsearch](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion) `rank_constant` değerini varsayılan olarak 60 yapar. [Azure AI Search](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking) da 60’ı deneylerde iyi sonuç veren küçük bir değer olarak anar. Bunlar, 60’ın sizin belgeleriniz için en iyi değer olduğunu kanıtlamaz.

| k | 1. sıra | 2. sıra | 10. sıra | 1. sıra / 10. sıra |
| --- | --- | --- | --- | --- |
| 1 | 0,5000 | 0,3333 | 0,0909 | 5,50× |
| 10 | 0,0909 | 0,0833 | 0,0500 | 1,82× |
| 60 | 0,0164 | 0,0161 | 0,0143 | 1,15× |

Son sütun, k değerinin üst sıraları ne kadar öne çıkardığını gösterir. k = 1 iken birinci sıra, onuncu sıranın 5,50 katı değerlidir. k = 60 iken bu oran yalnızca 1,15’tir; yani listeler arasındaki uyum, tek bir birincilikten daha önemli hâle gelir.

> [!NOTE]
> **İki farklı k değerini karıştırmayın**
> Vektör aramada k çoğu zaman döndürülecek en yakın komşu sayısıdır. RRF’deki k ise ayrı bir yumuşatma sabitidir.

## Uç durumları dağıtımdan önce belirleyin

Katkıları toplamadan önce her kanalın kendi içindeki tekrarları ayıklayın. Aynı kimliğin iki kez dönmesi iki katkı sayılırsa yöntem değişir. Kimliğin belgeyi mi, pasajı mı, bilgi kaydını mı gösterdiğini belirleyin. Kanallar farklı birimler döndürüyorsa önce ortak birimde eşleştirin. Metnin aynı olması tek başına güvenilir kimlik eşleştirmesi değildir.

Toplam puanlar eşitse asıl kayıt kimliğine göre sıralama gibi sabit ve belgelenmiş bir kural kullanın. Ağırlıklı birleştirmede sonlu olmayan ağırlıkları reddedin; sıfır ağırlığın kanalı kapatıp kapatmadığını açıkça belirleyin. Aynı arama yönteminin iki kopyasına tam ağırlık vermek aynı dayanağı iki kez sayabilir. Çok katkı alması, yanlış veya yetkisiz bir kaynağı kabul edilebilir yapmaz.

## RRF, puan normalizasyonu ve yeniden sıralama farkı

| Yöntem | Kullandığı bilgi | Güçlü yanı | Temel sınırı |
| --- | --- | --- | --- |
| RRF | Sıralar | Basittir; eğitim veya puan kalibrasyonu istemez | Puan farkının büyüklüğünü yok sayar |
| Puan normalizasyonu | Yeniden ölçeklenmiş puanlar | Puan farklarını korur | Normalizasyona ve puan dağılımına bağlıdır |
| Cross-encoder ile yeniden sıralama | Sorgu ve pasaj metni | Anlamı daha doğrudan karşılaştırabilir | Daha pahalıdır ve yalnızca kısa listeyi görür |

## RRF ne zaman kullanılmamalı?

- Tek bir arama yönteminiz varsa birleştirilecek liste yoktur.
- Puan farkları güvenilir bir anlam taşıyorsa ve bunu kaybetmek istemiyorsanız.
- Kanallar neredeyse aynı sonuçları döndürüyorsa birleştirme az yeni kanıt ekler.
- Kalibre edilmiş bir güven değeri gerekiyorsa. RRF puanı olasılık değildir.
- Daha iyi bir sıralama modelini eğitip doğrulayacak kadar etiketli veriniz varsa.

MESA Core 0.9.5, k = 60 ile ağırlıklı RRF kullanır. Vektör ağırlığı 8, BM25 ağırlığı 1, bilgi kaydı ağırlığı 0’dır. Vektör kanalı yalnızca bir embedding modeli ayarlıyken çalışır; modeller kapalıyken sırayı BM25 belirler. Bunlar bu sistemin varsayılanlarıdır, evrensel ayarlar değildir. Ayrıntılar için [arama dokümanına](/docs/core/retrieval-and-graph/) bakın.

## MESA’da ne ölçtük?

MESA’daki 8 vektör ağırlığı teoriden değil, dev kümesindeki bir denemeden geldi. Yalnızca bu ağırlığı değiştirdik, diğer kanalları 1’de tuttuk.

| Vektör ağırlığı | Hit@5, yeniden sıralama yok | MRR, yeniden sıralama yok | MRR, yeniden sıralamayla |
| --- | --- | --- | --- |
| 1 | 0,5176 | 0,3953 | 0,6816 |
| 2 | 0,5765 | 0,4565 | 0,7055 |
| 4 | 0,6588 | 0,5152 | 0,7069 |
| 8 | 0,6706 | 0,5663 | 0,6973 |

> [!NOTE]
> **Kurulum**
> 0.9.1 geliştirme derlemesi, benchmark v1 dev bölümü, Tier M, 141 belge, 5.041 parça, 85 yanıtlanabilir soru, bge-m3, çizge açık, arama limiti 50, yeniden sıralama derinliği 50.

Yeniden sıralama olmadan en iyi sonucu 8 verdi. Yeniden sıralamayla 4’ün MRR değeri biraz daha yüksekti. Denediğimiz en büyük değer de 8’di; yani daha yüksek bir ağırlığın daha iyi olup olmadığını bilmiyoruz. Bu denemeyi benchmark v2’de yinelemedik.

Büyük ağırlık, yukarıdaki çözümlü örneği de değiştirir. Yoğun (dense) kanalın ağırlığı 8 olursa puanlar B 0,147277, C 0,144905, D 0,126984 ve A 0,016393 olur. A sözcük listesinde birinci olduğu hâlde D artık A’nın önüne geçer.

Eşit RRF puanları da sık görülür. [Sıfırdan kurulan depolarla yaptığımız testte](/research/why-two-search-runs-differed/) rastgele eşitlik bozma, 112 yanıtlanabilir sorunun 49’unda sırayı değiştirdi (benchmark v2 dev, Tier M, modeller kapalı, 0.9.4 öncesi derleme). Bilgi kaydı ağırlığını 0 yapmak, T0 ve T1b’yi dev kümesinde iyileştiren, yeniden sıralamalı dev Hit@5’i ise 0,9286’dan 0,9107’ye düşüren [0.9.4 değişikliğinin](/research/what-improved-search-in-0-9-4/) parçasıydı.

## Ağırlık değişince yeniden hesaplayın

> [!EXERCISE]
> **Kendinizi sınayın**
> Tabloda yoğun kanalın ağırlığını sıfırlayın. Hangi sıra kalır; D’ye ne olur?
>
> **Açıklama:** A, B, C sözcüksel sırada kalır. D sıfır katkı alır; sıfır skorlu adayın çıkarılması açık çıktı politikasıdır. Sıfır, D’nin yanlış veya ilgisiz olduğunu kanıtlamaz.

## RRF hakkında sorular

**RRF puan normalizasyonu gerektirir mi?**
: Hayır. RRF sıraları kullandığı için BM25 ve vektör puanlarının ortak ölçekte olması gerekmez.

**RRF için iyi bir k değeri nedir?**
: 60 ile başlayın, ardından 10, 30 ve 100 gibi birkaç değeri kendi verinizdeki etiketli sorularla karşılaştırın.

**RRF’de sıra 0’dan mı 1’den mi başlar?**
: Özgün formül ve Elasticsearch sırayı 1’den başlatır. Bunu tutarlı kullanın, çünkü sıfır tabanlı sıra bütün katkıları değiştirir.

**Belge bir listede yoksa ne olur?**
: O liste belgeye 0 katkı verir. Belgenin bulunduğu diğer listeler sayılmaya devam eder.

**Yüksek RRF puanı güven puanı mıdır?**
: Hayır. Tek bir sorgudaki sonuçları sıralamak için kullanışlıdır. Yanıtın doğru olma olasılığı olarak okunmamalıdır.

## Kaynaklar ve ileri okuma

1. [Cormack, Clarke & Büttcher (SIGIR 2009) · Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)
2. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)
3. [Elastic · Reciprocal rank fusion](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion)
4. [Microsoft Learn · Hibrit arama puanlaması (RRF)](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking)

', ARRAY['RRF', 'rank fusion', 'weighted', 'k=60', 'sıra birleştirme', 'ağırlık']::text[], 'MESA contributors', 8, 'published', 'RRF Nedir? Reciprocal Rank Fusion ve k=60 — MESA', 'RRF, sonuç listelerini ham puanlar yerine sıralarıyla birleştirir. Formülü, çözümlü örneği, k değerinin neden çoğu zaman 60 olduğunu ve sınırlarını öğrenin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('why-graphs-matter-in-ai-memory', 'learn', 'en', 'Knowledge graphs: follow relations without inventing proof', '', 'Build a source-linked graph, trace a two-hop question, and distinguish graph traversal from GraphRAG summaries and valid inference.', 'Build a source-linked graph, trace a two-hop question, and distinguish graph traversal from GraphRAG summaries and valid inference.', '## A relationship needs identity and evidence

A text search finds passages. A graph query follows explicitly represented relationships. For the fictional Atlas archive, create nodes for the reading room, archive and district, then edges for “part of” and “located in”. Use stable node IDs and link each asserted edge to the source revision that supports it. A label such as “Central” is not enough to resolve identity.

```text
room-7 --part_of [evidence: handbook-r3/c4]--> archive-2
archive-2 --located_in [evidence: directory-r1/c2]--> district-5
room-7 --opening_time [day: Friday; from: Nov 1]--> 10:00
```

Relations carry direction and type. “A manages B” is not “B manages A”; “cites” is not “agrees with”. Keep time, scope and uncertainty when they change the relationship. If a source mentions two names in one paragraph, that alone does not establish a meaningful edge between them. Co-occurrence can be a discovery signal, not a verified relationship.

## Work through a two-hop question

Ask “Which district contains the archive that owns room 7?” Resolve room 7, follow `part_of` to archive 2, then `located_in` to district 5. Return both edge IDs and source references. The evidence chain is inspectable because each hop has a declared meaning. If either source is inaccessible, stale or ambiguous, the complete answer is not supported for that caller.

<!-- diagram: A reading room links to its archive, then its district; each hop retains source identity. -->
1. Resolve · room-7
2. Hop 1 · part_of
3. Archive · archive-2
4. Hop 2 · located_in
5. Answer · district-5 + 2 sources

*Two edges form a supported chain only if both relations and scopes are valid.*

## A path is not automatically an inference rule

Suppose A cites B and B cites C. You can say there is a two-edge citation path from A to C. You cannot conclude that A agrees with C, that C is correct or even that A directly cited C. A valid inference needs a rule whose meaning permits composition. Distinguish a retrieved path from a proposition actually established by that path.

Likewise, graph centrality measures connectivity under a chosen definition. A popular node may be frequently cited and wrong. Do not use a centrality score as a truth score or allow it to suppress an inconvenient source without an explicit policy. Source quality, relevance and graph prominence answer different questions.

## Graphs in MESA

MESA Core 0.9.5 has no graph store. In MESA''s own measurements graph search never found a correct passage that the other lanes missed (benchmark v1 dev), turning it off lost no benchmark v2 dev question, and following stored legal citations from the top results lowered Hit@1, so Core keeps entities, assertions and citations in SQLite and searches them with BM25 and optional vectors. Read [why MESA removed its graph store](/research/why-mesa-removed-its-graph-store/). The ideas in this lesson still apply if you build a graph yourself.

## Bound cost and recognize incompleteness

With average branching factor 10, exploring three hops can examine roughly 10 + 100 + 1,000 neighbors before deduplication. A hub can make this much worse. Set seed count, hop depth, per-node fan-out, total edge budget and timeout. A bounded search may miss valid paths; report truncation rather than claiming no relationship exists. Cache keys must include access scope and source generation.

GraphRAG is a family of retrieval-augmented approaches using graph information. Edge et al. describe graph-derived community summaries for corpus-level questions. That is different from returning raw paths for a local question. Summary generation introduces another derived artifact whose source coverage and update policy must be evaluated. Storing edges in a graph database does not by itself implement that research method. [GraphRAG paper](https://arxiv.org/abs/2404.16130).

## Separate connection from support

> [!EXERCISE]
> **Check your understanding**
> A cites B, B criticizes C. Can the assistant report “A supports C” because a graph path exists?
>
> **Answer:** No. Return the typed path if relevant and inspect source passages. The relation types do not compose into support. A graph exposes a chain to review; it does not invent its logical meaning.

## Sources and further reading

1. [Edge et al. · From Local to Global: A Graph RAG Approach](https://arxiv.org/abs/2404.16130)
2. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
3. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)

', ARRAY['graph', 'GraphRAG', 'multi hop', 'knowledge graph', 'çizge', 'ilişki']::text[], 'MESA contributors', 5, 'published', 'Knowledge graphs: follow relations without inventing proof — MESA Learn', 'Build a source-linked graph, trace a two-hop question, and distinguish graph traversal from GraphRAG summaries and valid inference.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('why-graphs-matter-in-ai-memory', 'learn', 'tr', 'Bilgi çizgeleri: ilişkileri kaynaklarıyla izlemek', '', 'Kaynakları belli bir çizge kurun ve iki adımlı bir soruyu çözün. Bir bağlantıyı bulmakla, o bağlantıdan geçerli bir sonuç çıkarmanın farkını görün.', 'Kaynakları belli bir çizge kurun ve iki adımlı bir soruyu çözün. Bir bağlantıyı bulmakla, o bağlantıdan geçerli bir sonuç çıkarmanın farkını görün.', '## İlişkinin kimliğini ve dayanağını koruyun

Metin araması ilgili pasajları bulur; çizge araması ise açıkça kaydedilmiş ilişkileri izler. Kurgusal Atlas arşivinde okuma salonu, arşiv ve ilçe için düğümler; “parçasıdır” ve “bulunur” ilişkileri için bağlantılar kurun. Her düğüme sabit kimlik verin ve her ilişkiyi destekleyen kaynak sürümüne bağlayın. “Merkez” gibi bir ad, hangi varlıktan söz edildiğini tek başına belirlemez.

```text
room-7 --part_of [evidence: handbook-r3/c4]--> archive-2
archive-2 --located_in [evidence: directory-r1/c2]--> district-5
room-7 --opening_time [day: Friday; from: Nov 1]--> 10:00
```

İlişkinin yönü ve türü önemlidir. “A, B’yi yönetir” ile “B, A’yı yönetir” aynı değildir; “atıf yapar” da “katılır” anlamına gelmez. Anlamı etkileyen zaman, kapsam ve belirsizlik bilgisini koruyun. İki adın aynı paragrafta geçmesi, aralarında doğrulanmış bir ilişki kurmaz; yalnızca incelenebilecek bir ipucu olabilir.

## İki adımlı soruyu çözün

“7 numaralı salonun bağlı olduğu arşiv hangi ilçede?” sorusunu ele alın. Önce Salon 7’yi bulun; `part_of` bağlantısıyla Arşiv 2’ye, `located_in` bağlantısıyla İlçe 5’e gidin. İki ilişkinin kimliğini ve dayanak kaynaklarını da döndürün. Böylece yanıtın nasıl bulunduğu incelenebilir. Kaynaklardan biri eski, belirsiz veya isteği yapan kişiye kapalıysa tam yanıt o kullanıcı için desteklenmiş sayılmaz.

<!-- diagram: Okuma salonu arşive, ardından ilçeye bağlanır; her adım kaynak kimliğini korur. -->
1. Çöz · room-7
2. Adım 1 · part_of
3. Arşiv · archive-2
4. Adım 2 · located_in
5. Yanıt · district-5 + 2 kaynak

*İki kenar ancak ilişkiler ve kapsamlar geçerliyse desteklenen zincir olur.*

## Yol kendiliğinden çıkarım kuralı değildir

A, B’ye; B de C’ye atıf yapıyor olsun. A’dan C’ye iki kenarlı atıf yolu olduğunu söyleyebilirsiniz. A’nın C’ye katıldığını, C’nin doğru olduğunu veya A’nın doğrudan C’ye atıf yaptığını çıkaramazsınız. Geçerli çıkarım, anlamı bileşime izin veren kural gerektirir. Bulunan yol ile yolun gerçekten desteklediği önermeyi ayırın.

Merkezilik ölçüsü, bir düğümün seçilen kurala göre ne kadar bağlantılı olduğunu anlatır. Çok atıf alan bir düğüm yine de yanlış bilgi taşıyabilir. Bir merkezilik puanını doğruluk puanı olarak kullanmayın. Hangi kaynakların neden geri plana alınacağını da açıkça tanımlayın. Kaynak güvenilirliği, sorguyla ilgililik ve çizgede görünürlük farklı ölçütlerdir.

## MESA’da çizgeler

MESA Core 0.9.5’te çizge deposu yoktur. MESA’nın kendi ölçümlerinde çizge araması, diğer kanalların kaçırdığı hiçbir doğru pasajı bulmadı (benchmark v1 dev); kapatılması benchmark v2 dev bölümünde hiçbir soruyu kaybettirmedi; en üst sonuçlardaki kayıtlı hukuki atıfları izlemek ise Hit@1’i düşürdü. Bu yüzden Core varlıkları, bilgi kayıtlarını ve atıfları SQLite’ta tutar ve BM25 ile isteğe bağlı vektörlerle arar. [MESA çizge deposunu neden kaldırdı](/research/why-mesa-removed-its-graph-store/) yazısını okuyun. Kendi çizgenizi kurarsanız bu dersteki fikirler geçerliliğini korur.

## Maliyeti sınırlayın, eksikliği tanıyın

Her düğümden ortalama on bağlantı çıkıyorsa üç adımda, tekrarlar ayıklanmadan önce yaklaşık 10 + 100 + 1.000 komşu incelenebilir. Çok bağlantılı bir düğüm işi büyütür. Başlangıç sayısını, adım derinliğini, düğüm başına bağlantıyı, toplam bağlantı bütçesini ve zaman aşımını sınırlandırın. Bu sınırlar geçerli bir yolu da dışarıda bırakabilir. Böyle bir durumda “ilişki yok” demek yerine aramanın sınırda durduğunu belirtin. Önbellek anahtarı erişim kapsamını ve kaynakların hangi güncellemesine ait olduğunu içermelidir.

GraphRAG, çizge bilgisinden yararlanan ve aramayla desteklenen yaklaşımların genel adıdır. Edge ve arkadaşları, bütün veri kümesini ilgilendiren sorular için bağlantı gruplarından üretilmiş özetler kullanır. Bu, tek bir soruya ham bağlantı yolu döndürmekten farklıdır. Üretilen her özet için kaynak kapsamını ve güncelleme yöntemini ayrıca değerlendirmek gerekir. İlişkileri bir çizge veritabanına yazmak, tek başına makaledeki yöntemi uygulamak anlamına gelmez. [GraphRAG makalesi](https://arxiv.org/abs/2404.16130)

## Bağlantı ile desteği ayırın

> [!EXERCISE]
> **Kendinizi sınayın**
> A, B’ye atıf yapıyor; B, C’yi eleştiriyor. Çizge yolu var diye asistan “A, C’yi destekliyor” diyebilir mi?
>
> **Açıklama:** Hayır. İlgiliyse türleri belirtilmiş yolu döndürüp kaynak pasajlarını inceleyin. Bu ilişki türleri destek sonucuna birleşmez. Çizge incelenecek zinciri açar; mantıksal anlamını icat etmez.

## Kaynaklar ve ileri okuma

1. [Edge et al. · From Local to Global: A Graph RAG Approach](https://arxiv.org/abs/2404.16130)
2. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
3. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)

', ARRAY['graph', 'GraphRAG', 'multi hop', 'knowledge graph', 'çizge', 'ilişki']::text[], 'MESA contributors', 5, 'published', 'Bilgi çizgeleri: ilişkileri kaynaklarıyla izlemek — MESA', 'Kaynakları belli bir çizge kurun ve iki adımlı bir soruyu çözün. Bir bağlantıyı bulmakla, o bağlantıdan geçerli bir sonuç çıkarmanın farkını görün.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('what-is-evidence-aware-memory', 'learn', 'en', 'Evidence and provenance: what a citation actually proves', '', 'Build a verifiable citation with source revision and exact span. Distinguish integrity, provenance, claim support and source truth.', 'Build a verifiable citation with source revision and exact span. Distinguish integrity, provenance, claim support and source truth.', '## Four checks, four different conclusions

An assistant answers “The room opens at ten on Fridays” and displays a link. A real link is only the first step. You must ask whether the source exists, whether the cited passage says what the answer claims, whether that source applies to this time and scope, and whether the source itself is trustworthy. Passing one check does not imply the others.

| Check | What success establishes | What it does not establish |
| --- | --- | --- |
| Integrity | These bytes match the recorded digest | Who wrote them or whether true |
| Provenance | A recorded derivation/ownership path | Correct extraction or honest origin |
| Support | This passage supports this claim | Source truth or current applicability |
| Applicability | Scope/time match the question | Universal correctness |

## A tiny reproducible span check

```text
text = "Atlas opens at 09:00."
start, end = 15, 20  # Unicode code points; [start, end)
assert text[start:end] == "09:00"
# A different encoding/offset convention must be declared explicitly.
```

Offsets are meaningful only against the exact source representation used when extracting them. Declare whether positions count bytes, Unicode code points or another unit, and whether the end is exclusive. Unicode normalization, PDF extraction or newline conversion can change offsets. Keep an immutable source revision and enough information to reproduce the text, then validate that the extracted span matches it.

A digest such as SHA-256 detects a mismatch relative to a trusted expected digest. An attacker can hash fabricated text just as easily as genuine text. If both text and expected digest come from the same untrusted party, equality is not proof of authenticity. Source acquisition, authenticated publisher identity and chain-of-custody records solve different parts of the problem.

## Keep the chain from answer to source

<!-- diagram: Answer claim links to assertion, exact span, source revision and acquisition record. -->
1. Answer · Friday at ten
2. Assertion · a42 + qualifiers
3. Span · exact supporting text
4. Revision · handbook-r3
5. Origin · acquisition record

*A citation should let a reviewer inspect the evidence without reconstructing the pipeline.*

Keep the source quote narrow enough to inspect, but include the qualifying sentence when necessary. “Open at ten” without “Fridays after 1 November” is insufficient support for a question about October. Mark unsupported parts of a multi-claim answer instead of attaching one citation to the entire paragraph and assuming it covers every sentence.

## Log decisions without duplicating private data

For a retrieval decision, record request/run ID, caller scope identifier, source generation, candidate IDs, filtering reasons and final evidence IDs. Prefer references over copying entire private documents into logs. Keep sensitive values out of exception messages. An audit record must itself have access control, retention and deletion rules; “log everything” creates another uncontrolled memory store.

If no eligible source supports the answer, return a clear evidence gap or ask a narrower question. Citation formatting and retrieval grounding can reduce some unsupported outputs, but cannot eliminate hallucinations. W3C PROV supplies a vocabulary for derivation; OWASP explains why retrieved material must remain untrusted as instructions. These are complementary concerns. [PROV](https://www.w3.org/TR/prov-overview/), [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

## Test the claim, not the link

> [!EXERCISE]
> **Check your understanding**
> A document and SHA-256 digest match, but the document was uploaded by an unknown user. What can you conclude?
>
> **Answer:** Only that the supplied bytes match that digest under the declared procedure. You still need origin/authenticity assessment and a separate check that the passage supports the answer. A checksum does not certify source truth.

## Sources and further reading

1. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
2. [OWASP · LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
3. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)

', ARRAY['provenance', 'citation', 'hash', 'SHA256', 'evidence', 'kaynak izi', 'atıf', 'kanıt', 'halüsinasyon']::text[], 'MESA contributors', 5, 'published', 'Evidence and provenance: what a citation actually proves — MESA Learn', 'Build a verifiable citation with source revision and exact span. Distinguish integrity, provenance, claim support and source truth.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('what-is-evidence-aware-memory', 'learn', 'tr', 'Kaynak izi: bir atıf neyi kanıtlar?', '', 'Bir atfı belge sürümüne ve dayanak pasajına kadar izleyin. İçerik bütünlüğü, kaynak güvenilirliği ve yanıtın desteklenmesi arasındaki farkı öğrenin.', 'Bir atfı belge sürümüne ve dayanak pasajına kadar izleyin. İçerik bütünlüğü, kaynak güvenilirliği ve yanıtın desteklenmesi arasındaki farkı öğrenin.', '## Dört kontrol, dört ayrı sonuç

Asistan “Salon cumaları onda açılır” deyip bir bağlantı göstersin. Bağlantının gerçekten var olması yalnızca ilk kontroldür. Kaynak erişilebilir mi? Alıntılanan pasaj bu yanıtı destekliyor mu? Bilgi sorulan tarih ve kapsam için geçerli mi? Kaynak güvenilir mi? Bu soruları ayrı değerlendirin; birini doğrulamak diğerlerini otomatik olarak doğrulamaz.

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

Metindeki başlangıç ve bitiş konumları, yalnızca bilgi çıkarılırken kullanılan tam metin üzerinde anlamlıdır. Konumların bayt, Unicode kod noktası veya başka bir birimle sayıldığını belirtin. Bitiş konumunun aralığa dâhil olup olmadığını da tanımlayın. Unicode normalizasyonu, PDF’den metin çıkarma veya satır sonu dönüşümü konumları değiştirebilir. Kaynak sürümünü ve aynı metni yeniden elde etmek için gereken bilgileri koruyun; seçilen aralığın gerçekten eşleştiğini kontrol edin.

SHA-256 gibi bir özet, elinizdeki içeriğin güvenilir bir beklenen özetle uyuşup uyuşmadığını gösterir. Ancak uydurma bir metnin özeti de kolayca hesaplanabilir. Metin ve beklenen özet aynı güvenilmeyen kişiden geliyorsa eşleşme özgünlüğü kanıtlamaz. Kaynağın nasıl edinildiği, yayıncının kimliğinin doğrulanması ve aktarım kayıtları farklı soruları yanıtlar.

## Yanıttan kaynağa zinciri koruyun

<!-- diagram: Yanıt iddiası iddiaya, tam aralığa, kaynak revizyonuna ve edinim kaydına bağlanır. -->
1. Yanıt · cuma onda
2. İddia · a42 + koşullar
3. Aralık · tam destek metni
4. Sürüm · handbook-r3
5. Köken · edinim kaydı

*Atıf inceleyenin hattı yeniden kurmadan kanıtı kontrol etmesini sağlamalıdır.*

Alıntıyı kolay incelenecek kadar kısa tutun; anlamı sınırlayan cümleleri de ekleyin. “1 Kasım sonrası cumaları” koşulu olmadan “onda açılır” ifadesi ekim ayına ilişkin soruyu desteklemez. Bir paragrafın sonundaki tek atfın bütün cümlelere dayanak olduğunu varsaymayın. Birden çok iddia içeren yanıtta desteklenmeyen kısımları ayrıca belirtin.

## Özel veriyi çoğaltmadan kararları kaydedin

Arama kararlarını izlemek için istek kimliğini, erişim kapsamını, kaynakların güncelleme bilgisini, adayları, elenme gerekçelerini ve kullanılan son kanıtları kaydedin. Özel belgeleri bütünüyle günlüklere kopyalamak yerine kimlik veya referans kullanın. Hassas değerleri hata mesajlarından çıkarın. Denetim kayıtları için de erişim, saklama ve silme kuralları gerekir. Her şeyi kaydetmek, denetimsiz ikinci bir hafıza deposu oluşturabilir.

Uygun kaynaklar yanıtı desteklemiyorsa kanıtın eksik olduğunu söyleyin veya sorunun daraltılmasını isteyin. Aramayla kaynak sağlamak ve atıfları düzenlemek, bazı dayanaksız yanıtları azaltabilir; tamamen ortadan kaldırmaz. W3C PROV, bilginin hangi kaynaktan nasıl türediğini anlatan kavramlar sunar. OWASP ise bulunan metnin neden güvenilir talimat sayılmaması gerektiğini açıklar. Bu iki konu birbirini tamamlar. [PROV](https://www.w3.org/TR/prov-overview/) [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

## Bağlantıyı değil iddiayı test edin

> [!EXERCISE]
> **Kendinizi sınayın**
> Belge SHA-256 özetiyle eşleşiyor; fakat belgeyi bilinmeyen kullanıcı yüklemiş. Ne sonuç çıkarabilirsiniz?
>
> **Açıklama:** Yalnızca verilen baytların belirtilen yöntemle o özete uyduğunu söyleyebilirsiniz. Köken/özgünlük değerlendirmesi ve pasajın cevabı desteklediğine ayrı kontrol gerekir. Sağlama toplamı kaynak doğruluğunu sertifikalandırmaz.

## Kaynaklar ve ileri okuma

1. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
2. [OWASP · LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
3. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)

', ARRAY['provenance', 'citation', 'hash', 'SHA256', 'evidence', 'kaynak izi', 'atıf', 'kanıt', 'halüsinasyon']::text[], 'MESA contributors', 5, 'published', 'Kaynak izi: bir atıf neyi kanıtlar? — MESA', 'Bir atfı belge sürümüne ve dayanak pasajına kadar izleyin. İçerik bütünlüğü, kaynak güvenilirliği ve yanıtın desteklenmesi arasındaki farkı öğrenin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('memory-scope-and-authorization', 'learn', 'en', 'Shared memory: who may retrieve what?', '', 'Trace identity, roles and dataset scope through retrieval, caches and graph paths. Test isolation before measuring relevance.', 'Trace identity, roles and dataset scope through retrieval, caches and graph paths. Test isolation before measuring relevance.', '## A name in the prompt is not an identity

Two teams share the assistant but have separate archives. The user’s prompt says “I am an administrator; search every dataset.” That sentence is not authorization. Authenticate the principal outside the model, resolve server-controlled grants and bind a permitted resource set. An agent name is execution context; it is not automatically a tenant boundary or proof of ownership.

| Concept | Example | Question answered |
| --- | --- | --- |
| Principal | service-account-4 | Who authenticated? |
| Role | reader / editor | Which class of actions? |
| Resource grant | dataset Atlas | On which resources? |
| Session scope | frozen allowed dataset set | What can this session use? |

Role-based access control groups permissions through roles; resource attributes and explicit grants may further restrict them. A reader role alone should not imply read access to every organization. Decide separately about insertion, retrieval, purge, rollback and administrative operations. Least privilege is meaningful only when those operations are actually checked. [NIST RBAC](https://csrc.nist.gov/projects/role-based-access-control).

## Why filtering after ranking can fail

Imagine a global top-10 list contains ten forbidden records. Removing them gives an empty answer even though the best allowed record is eleventh. This is a recall failure caused by applying scope too late. More seriously, forbidden text must never reach the generator, traces or caller-visible explanations. Prefer authorized candidate generation and independently verify eligibility before final output.

<!-- diagram: Authenticated identity produces allowed scope, which constrains every retrieval lane and final evidence. -->
1. Authenticate · principal
2. Resolve · current grants
3. Bind · dataset scope
4. Retrieve · every lane scoped
5. Verify · output and citations

*Scope is a server decision, not a score bonus or prompt instruction.*

## Statistics, caches and paths also carry scope

Filtering returned rows is not the entire isolation problem. Global corpus statistics can change lexical ranking when another tenant adds documents. Cache entries can replay evidence from a wider scope. Graph traversal can cross an allowed seed into a forbidden neighbor. State your isolation contract: preventing text disclosure and preventing cross-scope ranking influence are related but distinct properties. In MESA Core 0.9.5, a dataset-wide search uses that dataset''s own persistent BM25 index, never shared across datasets or tenants; narrower scopes build a temporary index of authorized rows only, so BM25 statistics stay inside the scope. Vector candidates are prefiltered by tenant, dataset and agent and checked against SQLite before ranking.

Cache keys should distinguish caller/resource scope, query parameters, source generation and representation settings. Permission changes need invalidation or revalidation before using cached evidence. Multi-agent sharing adds no exemption: a summarizing agent must not copy private evidence into a shared note accessible to other agents. Derived artifacts inherit sensitive information even when the original wording is paraphrased.

## Run positive and negative controls

Create tenant A and tenant B with distinctive markers. Verify A can retrieve its own evidence, then ask A for B’s marker and verify no text, IDs or counts reveal it. Repeat through lexical, vector and context paths, after restart and after cache warm-up. Revoke a grant and retest an existing session according to the product’s declared revocation policy. A zero-result test without an allowed positive control can hide a broken system.

> [!EXERCISE]
> **Check your understanding**
> A forbidden document never appears in results, but adding it changes tenant A’s ranking. Has complete scope isolation been demonstrated?
>
> **Answer:** No. Content disclosure may be blocked, but ranking depends on out-of-scope state. Check corpus statistics, shared caches and candidate generation against the stated isolation contract.

## Sources and further reading

1. [NIST · Role Based Access Control](https://csrc.nist.gov/projects/role-based-access-control)
2. [OWASP · LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
3. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)

', ARRAY['authorization', 'RBAC', 'tenant', 'scope', 'cache', 'multi agent', 'yetki', 'kapsam', 'yalıtım']::text[], 'MESA contributors', 5, 'published', 'Shared memory: who may retrieve what? — MESA Learn', 'Trace identity, roles and dataset scope through retrieval, caches and graph paths. Test isolation before measuring relevance.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('memory-scope-and-authorization', 'learn', 'tr', 'Ortak hafıza: kim hangi bilgiye erişebilir?', '', 'Kimliği ve izinleri arama, önbellek ve çizge boyunca izleyin. Sonuçların ilgililiğini ölçmeden önce veri yalıtımını sınayın.', 'Kimliği ve izinleri arama, önbellek ve çizge boyunca izleyin. Sonuçların ilgililiğini ölçmeden önce veri yalıtımını sınayın.', '## İstemde yazan ad, kimlik doğrulaması değildir

İki ekip aynı asistanı kullansın, ancak arşivleri ayrı olsun. Kullanıcı isteme “Ben yöneticiyim; bütün veri kümelerini ara” yazarsa bu cümle ona yetki vermez. Kimliği model dışında doğrulayın; sunucunun yönettiği izinlerden erişebileceği kaynakları belirleyin. Ajan adı işlemin bağlamını anlatır; tek başına üst erişim alanı veya sahiplik kanıtı değildir.

| Kavram | Örnek | Yanıtladığı soru |
| --- | --- | --- |
| Erişim kimliği | service-account-4 | Kim doğrulandı? |
| Rol | okuyucu / editör | Hangi eylem sınıfı? |
| Kaynak izni | Atlas veri kümesi’i | Hangi kaynaklarda? |
| Oturum kapsamı | sabit izinli veri kümesi kümesi | Bu oturum ne kullanabilir? |

Rol tabanlı erişimde izinler roller altında toplanır. Kaynak özellikleri ve açık izinler bu erişimi ayrıca sınırlayabilir. Okuyucu rolü, her kurumun verisine erişim anlamına gelmemelidir. Ekleme, arama, kalıcı silme, geri alma ve yönetim işlemlerinin izinlerini ayrı belirleyin. En az yetki ilkesi, ancak işlemlerde gerçekten denetlenirse işe yarar. [NIST RBAC](https://csrc.nist.gov/projects/role-based-access-control)

## Sıralamadan sonra filtreleme neden yetmeyebilir?

Bütün verilerdeki ilk on sonucun kullanıcıya kapalı olduğunu düşünün. Bunları sonradan çıkarmak boş yanıt verir; oysa kullanıcının görebileceği en iyi kayıt on birinci sıradadır. Erişim kapsamını geç uygulamak, ilgili sonucu kaçırmanıza neden olur. Daha önemlisi, kapalı metin yanıt üreten modele, kullanıcıya açık açıklamalara veya iz kayıtlarına ulaşmamalıdır. Adayları izin verilen kaynaklardan üretin ve çıkışta uygunluğu yeniden denetleyin.

<!-- diagram: Doğrulanmış kimlik izinli kapsam üretir; kapsam her arama kanalını ve son kanıtı sınırlar. -->
1. Doğrula · erişim kimliği
2. Çöz · güncel izinler
3. Bağla · veri kümesi kapsamı
4. Getir · her kanal kapsamlı
5. Kontrol · çıktı ve atıflar

*Erişim kapsamını sunucu belirler; puan artırımı veya istemdeki talimatlar bu izni değiştirmez.*

## İstatistik, önbellek ve yol da kapsam taşır

Yalnızca dönen satırları filtrelemek tam yalıtım sağlamaz. Başka bir erişim alanına belge eklenmesi, bütün veriler üzerinden hesaplanan sözcük istatistiklerini ve sıralamayı değiştirebilir. Önbellek daha geniş bir kapsamdan bilgi döndürebilir. Çizge, izinli bir düğümden kapalı bir komşuya geçebilir. İçeriğin dışarı sızmasını önlemekle, kapsam dışındaki verilerin sıralamayı etkilemesini önlemek ayrı güvencelerdir; hangisini sağladığınızı açıkça belirtin. MESA Core 0.9.5’te tüm veri kümesini kapsayan bir arama, o veri kümesinin kendi kalıcı BM25 indeksini kullanır; bu indeks veri kümeleri veya kurumlar arasında paylaşılmaz. Daha dar kapsamlar yalnızca izinli satırları içeren geçici bir indeks kurar; böylece BM25 istatistikleri kapsamın içinde kalır. Vektör adayları kurum, veri kümesi ve ajana göre önceden süzülür ve sıralamadan önce SQLite’a karşı denetlenir.

Önbellek anahtarı; kullanıcının ve kaynakların erişim kapsamını, sorgu ayarlarını, kaynak güncellemesini ve temsil ayarlarını ayırt etmelidir. İzinler değiştiğinde eski sonucu yeniden kullanmadan önce geçersizleştirme veya tekrar doğrulama gerekir. Birden fazla ajanın çalışması bu kuralı değiştirmez: Özetleyen ajan özel bilgiyi herkese açık ortak nota taşımamalıdır. Sözcükler değişse bile türetilen özet hassas bilgiyi koruyabilir.

## Olumlu ve olumsuz kontrolleri çalıştırın

A ve B için ayrı üst erişim alanları oluşturup belgelerine ayırt edici işaretler ekleyin. A’nın kendi kaynağını bulduğunu doğrulayın; sonra B’nin işaretini sorup metin, kimlik veya sayılar üzerinden bilgi sızmadığını kontrol edin. Sözcük, vektör ve bağlam yollarında; yeniden başlatmadan ve önbellek dolduktan sonra testi tekrarlayın. İzni kaldırıp mevcut oturumun bildirilen iptal kuralına uyduğunu da sınayın. İzinli bir sonucun bulunabildiğini kontrol etmeden yalnızca boş yanıt beklemek, çalışmayan bir sistemi güvenliymiş gibi gösterebilir.

> [!EXERCISE]
> **Kendinizi sınayın**
> Yasak belge sonuçta hiç görünmüyor ama eklenmesi A’nın sıralamasını değiştiriyor. Tam kapsam yalıtımı gösterildi mi?
>
> **Açıklama:** Hayır. İçerik ifşası engellenmiş olabilir; sıralama kapsam dışı duruma bağımlıdır. Belge istatistiklerini, ortak önbelleği ve aday üretimini yalıtım sözleşmesine göre kontrol edin.

## Kaynaklar ve ileri okuma

1. [NIST · Role Based Access Control](https://csrc.nist.gov/projects/role-based-access-control)
2. [OWASP · LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
3. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)

', ARRAY['authorization', 'RBAC', 'tenant', 'scope', 'cache', 'multi agent', 'yetki', 'kapsam', 'yalıtım']::text[], 'MESA contributors', 5, 'published', 'Ortak hafıza: kim hangi bilgiye erişebilir? — MESA', 'Kimliği ve izinleri arama, önbellek ve çizge boyunca izleyin. Sonuçların ilgililiğini ölçmeden önce veri yalıtımını sınayın.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('sqlite-as-canonical-agent-memory', 'learn', 'en', 'Canonical storage and projections: survive a partial write', '', 'Trace one mutation through SQL, vector and graph stores. Understand durable admission, retries, idempotency and projection rebuilds.', 'Trace one mutation through SQL, vector and graph stores. Understand durable admission, retries, idempotency and projection rebuilds.', '## Pick an authority for identity and lifecycle

A memory application may use SQL for source records, a vector index for similarity and a graph for relationships. If the three stores disagree, which decides whether a claim exists and is active? A canonical store owns that decision. A projection is a derived representation rebuilt from the canonical data and its declared transformation. “Derived” describes authority, not importance or search quality.

In an illustrative design, SQL owns source revisions, assertion IDs, status and a mutation ledger. Vector and graph rows refer to those IDs. A search hit becomes evidence only after checking it against canonical eligibility. A stale index row must not resurrect a deleted claim just because its vector is close to the query.

## Walk through a crash between stores

<!-- diagram: SQL admits a mutation and outbox work, then vector and graph projections run before visibility is finalized. -->
1. SQL transaction · source + outbox
2. Worker · claim pending work
3. Vector · apply by stable ID
4. Graph · apply by stable ID
5. Finalize · verify projections

*SQL commit does not create one atomic transaction spanning every independent backend.*

Suppose SQL commits, vector insertion succeeds and the process crashes before graph insertion. Without durable pending work, you may permanently lose the graph write. With an outbox recorded in the same SQL transaction as the canonical mutation, a restarted worker can find incomplete work and retry. The delivery may happen more than once; the effects must therefore be safe to repeat.

## Retry safely with identity and fencing

Idempotency means applying the same logical operation again does not create a different final effect. Use a stable operation ID and a declared payload identity. Reusing the same key with different content should be rejected or handled by an explicit contract. A random new ID on every retry creates duplicates rather than idempotency. A timeout means the caller did not observe completion; it does not prove no write happened.

A lease lets a worker claim work temporarily. A fencing token or equivalent ownership check prevents an old worker from completing work after another owner has taken over. Check ownership at the actual state-changing operation, not only when work starts. Test the race by pausing worker A, expiring its claim, letting B take over and then resuming A.

## What SQLite guarantees, and what it does not

SQLite documents atomic commit and crash-recovery mechanisms for its own transactions under stated assumptions. WAL allows readers and a writer to overlap, but still serializes writers. It does not turn embedded stores into a distributed multi-writer database. Filesystem durability, backup procedure and checkpoint behavior remain operational concerns. [Atomic commit](https://www.sqlite.org/atomiccommit.html), [WAL](https://www.sqlite.org/wal.html).

MESA Core v0.9.5 uses one combined owner per root and treats LanceDB as its only projection; its BM25 indexes live in SQLite and change in the same transaction as the canonical rows. Its rebuild is offline and full-root, not an online per-tenant repair. Those are product-specific limits; another system may choose different storage. Rebuild correctness requires preserving canonical evidence and representation identity, then verifying the replacement before cutover. [Core contract](docs/core/architecture/).

> [!NOTE]
> **What we measured in MESA**
> MESA 0.9.4 [removed its legacy pre-V4 store](/research/deleting-code-mesa-0-9-4/). Dev search ranks stayed identical on all 128 questions after the removal (benchmark v2, Tier M, models off). Version 0.9.5 then [removed its graph store](/research/why-mesa-removed-its-graph-store/), leaving SQLite and LanceDB.

## Interpret a timeout

> [!EXERCISE]
> **Check your understanding**
> A client times out after the vector write. Should it create a fresh mutation with a fresh ID immediately?
>
> **Answer:** First inspect the original mutation status. Retry using the declared idempotency contract if appropriate. A fresh ID may duplicate an already admitted operation; a timeout is an observation failure, not proof of rollback.

> [!NOTE]
> **Example: one local SQLite file**
> [MESA Lore](/lore/) stores coding agent sessions and notes in one local SQLite file and searches them without an LLM.

## Sources and further reading

1. [SQLite · Atomic Commit](https://www.sqlite.org/atomiccommit.html)
2. [SQLite · Write-Ahead Logging](https://www.sqlite.org/wal.html)
3. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)

', ARRAY['SQLite', 'outbox', 'idempotency', 'projection', 'LanceDB', 'projeksiyon', 'kalıcılık']::text[], 'MESA contributors', 5, 'published', 'Canonical storage and projections: survive a partial write — MESA Learn', 'Trace one mutation through SQL, vector and graph stores. Understand durable admission, retries, idempotency and projection rebuilds.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('sqlite-as-canonical-agent-memory', 'learn', 'tr', 'Ana kayıt ve arama görünümleri: yarım kalan yazmayı tamamlamak', '', 'Bir değişikliğin SQL, vektör ve çizge depolarına nasıl yazıldığını izleyin. Yeniden denemeyi, güvenli tekrarı ve arama görünümlerini yeniden kurmayı öğrenin.', 'Bir değişikliğin SQL, vektör ve çizge depolarına nasıl yazıldığını izleyin. Yeniden denemeyi, güvenli tekrarı ve arama görünümlerini yeniden kurmayı öğrenin.', '## Hangi deponun asıl kayıt olacağını belirleyin

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

MESA Core v0.9.5’te her veri dizinini tek combined süreci yönetir; tek arama görünümü LanceDB’dir. BM25 indeksleri SQLite’ta tutulur ve asıl satırlarla aynı transaction içinde değişir. Yeniden oluşturma çevrimdışıdır ve bütün veri dizinini kapsar. Tek bir üst erişim alanını çevrimiçi onarma işlemi değildir. Bunlar MESA’ya özgü sınırlardır; başka bir sistem farklı depolama düzeni seçebilir. Yeniden oluştururken asıl kanıtı ve temsil kimliğini koruyun; geçişten önce yeni görünümü doğrulayın. [Core sözleşmesi](docs/core/architecture/)

> [!NOTE]
> **MESA’da ne ölçtük?**
> MESA 0.9.4, [V4 öncesinden kalan eski depoyu kaldırdı](/research/deleting-code-mesa-0-9-4/). Silmeden sonra 128 dev sorusunun tamamında arama sırası aynı kaldı (benchmark v2, Tier M, modeller kapalı). 0.9.5 ise [çizge deposunu kaldırdı](/research/why-mesa-removed-its-graph-store/); geriye SQLite ve LanceDB kaldı.

## Zaman aşımını yorumlayın

> [!EXERCISE]
> **Kendinizi sınayın**
> İstemci, vektör yazıldıktan sonra zaman aşımına uğruyor. Hemen yeni kimlikle bir yazma işlemi başlatmalı mı?
>
> **Açıklama:** Önce ilk işlemin durumunu kontrol edin. Yeniden deneme uygunsa aynı işlem kimliği ve güvenli tekrar kurallarıyla ilerleyin. Yeni kimlik, zaten kabul edilmiş işlemi çoğaltabilir. Zaman aşımı, istemcinin sonucu göremediğini gösterir; işlemin geri alındığını göstermez.

> [!NOTE]
> **Örnek: tek yerel SQLite dosyası**
> [MESA Lore](/lore/), kodlama ajanı oturumlarını ve notlarını tek bir yerel SQLite dosyasında saklar ve LLM kullanmadan arar.

## Kaynaklar ve ileri okuma

1. [SQLite · Atomic Commit](https://www.sqlite.org/atomiccommit.html)
2. [SQLite · Write-Ahead Logging](https://www.sqlite.org/wal.html)
3. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)

', ARRAY['SQLite', 'outbox', 'idempotency', 'projection', 'LanceDB', 'projeksiyon', 'kalıcılık']::text[], 'MESA contributors', 5, 'published', 'Ana kayıt ve arama görünümleri: yarım kalan yazmayı tamamlamak — MESA', 'Bir değişikliğin SQL, vektör ve çizge depolarına nasıl yazıldığını izleyin. Yeniden denemeyi, güvenli tekrarı ve arama görünümlerini yeniden kurmayı öğrenin.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('temporal-decay-in-ai-memory', 'learn', 'en', 'Changing facts: validity, contradiction and forgetting', '', 'Distinguish when a statement applies from when it was recorded. Handle corrections and conflicts without equating age with invalidity.', 'Distinguish when a statement applies from when it was recorded. Handle corrections and conflicts without equating age with invalidity.', '## Two clocks answer different questions

The archive announces a new Friday opening time on 18 October, effective 1 November. The system learns the announcement on 20 October. “What is the opening time today?” and “What had our system recorded by 19 October?” are different questions. A single `updated_at` field cannot represent both meanings reliably.

| Field | Example | Meaning |
| --- | --- | --- |
| valid_from | 1 November | When the claim starts applying |
| valid_to | open-ended | When applicability ends |
| recorded_at | 20 October | When this system stored it |
| source_revision | handbook-r3 | Which document states it |

These are conceptual fields for the lesson. Supporting both valid-time and transaction-time historical queries requires an explicit bitemporal model and query semantics. Do not infer that capability merely because a product stores timestamps. MESA’s architecture documents its own temporal filters and limitations; the example here is not a claim of full bitemporal support.

## Represent the change as intervals

<!-- diagram: Revision 2 applies before November; revision 3 applies from November; recording happens on a separate timeline. -->
1. Old claim · Friday 09:00
2. End · before Nov 1
3. New claim · Friday 10:00
4. Start · Nov 1 inclusive
5. Recorded · Oct 20 separately

*Declare interval endpoints and timezone; do not silently overwrite the old value.*

A half-open interval `[start, end)` includes the start and excludes the end. Adjacent intervals then meet without overlapping: old until 1 November, new from 1 November. Define timezone and date granularity; “midnight” is incomplete without a timezone. Keep the source’s precision rather than inventing a time of day for a date-only announcement.

## Compare like with like before calling it a conflict

“Opens at nine” and “opens at ten” appear contradictory. They may describe different rooms, days, dates or source authorities. First align entity identity, predicate, units, scope and validity intervals. Only then ask whether two incompatible values compete under the same conditions. Negation and modality matter: “may open” is not “will open”.

If two current sources genuinely disagree, preserve both and expose the conflict with their provenance. A resolution policy might prefer an official revision, require review or decline to choose. “Newest wins” is not universally safe: a recent low-quality copy can contradict an older authoritative source. Record the resolution reason and retain the information needed to undo it.

## Age can change priority without changing truth

```text
illustrative recency weight = exp(-lambda * age)
half-life H => lambda = ln(2) / H
age = H  => weight = 0.5
age = 2H => weight = 0.25
Apply only after eligibility; this is a ranking policy.
```

A recent task note may deserve more attention than an old one. A historical contract can remain the correct source for a past date regardless of age. Decay is a chosen ranking heuristic; expiration is a validity rule; deletion is a retention action. Keep them separate. Test questions about both “now” and historical dates before enabling recency weighting.

## Classify the apparent conflict

> [!EXERCISE]
> **Check your understanding**
> Revision 2 says Friday 09:00 until November; revision 3 says Friday 10:00 from November. Must one be labeled false?
>
> **Answer:** No. They apply to different intervals. Preserve both and filter by the question’s date. A contradiction would require incompatible values under the same entity, scope and overlapping validity conditions.

## Sources and further reading

1. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
2. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)

', ARRAY['temporal', 'validity', 'decay', 'contradiction', 'version', 'zaman', 'geçerlilik', 'çelişki', 'unutma']::text[], 'MESA contributors', 5, 'published', 'Changing facts: validity, contradiction and forgetting — MESA Learn', 'Distinguish when a statement applies from when it was recorded. Handle corrections and conflicts without equating age with invalidity.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('temporal-decay-in-ai-memory', 'learn', 'tr', 'Bilgi değiştiğinde: güncelleme, çelişki ve unutma', '', 'Bilginin ne zaman geçerli olduğuyla ne zaman kaydedildiğini ayırın. Eski olan her kaydı yanlış saymadan düzeltmeleri ve çelişkileri yönetin.', 'Bilginin ne zaman geçerli olduğuyla ne zaman kaydedildiğini ayırın. Eski olan her kaydı yanlış saymadan düzeltmeleri ve çelişkileri yönetin.', '## Geçerlilik zamanı ve kayıt zamanı farklıdır

Arşiv 18 Ekim’de yeni cuma açılış saatini duyuruyor; değişiklik 1 Kasım’da geçerli. Sistem duyuruyu 20 Ekim’de öğreniyor. “Bugün açılış saati ne?” ve “Sistemimiz 19 Ekim’e kadar ne kaydetmişti?” farklı sorulardır. Tek `updated_at` alanı iki anlamı güvenilir temsil edemez.

| Alan | Örnek | Anlam |
| --- | --- | --- |
| valid_from | 1 Kasım | İddianın uygulanmaya başladığı zaman |
| valid_to | açık uçlu | Uygulanabilirliğin bittiği zaman |
| recorded_at | 20 Ekim | Bu sistemin kaydettiği zaman |
| source_revision | handbook-r3 | Bunu söyleyen belge |

Bunlar dersin kavramsal alanlarıdır. Hem bilginin geçerlilik tarihine hem sistemin onu kaydettiği tarihe göre geçmiş sorgusu yapabilmek için iki zaman boyutunu açıkça tanımlayan bir model gerekir. Sistemin zaman damgası tutması, bu sorguları desteklediği anlamına gelmez. MESA mimarisi kendi zaman filtrelerini ve sınırlarını belgeler; buradaki örnek tam bitemporal destek iddiası değildir.

## Değişimi aralıkla temsil edin

<!-- diagram: Sürüm 2 kasımdan önce, sürüm 3 kasımdan itibaren geçerlidir; kayıt ayrı zaman çizgisindedir. -->
1. Eski iddia · cuma 09.00
2. Bitiş · 1 Kasım’dan önce
3. Yeni iddia · cuma 10.00
4. Başlangıç · 1 Kasım dahil
5. Kayıt · ayrıca 20 Ekim

*Aralık sınırını ve saat dilimini belirtin; eski değeri sessizce ezmeyin.*

Yarı açık `[başlangıç, bitiş)` başlangıcı içerip bitişi dışlar. Böylece bitişik aralıklar örtüşmez: eski 1 Kasım’a kadar, yeni 1 Kasım’dan itibaren. Saat dilimini ve tarih hassasiyetini tanımlayın; “gece yarısı” saat dilimi olmadan eksiktir. Yalnızca gün belirten duyuruya saat uydurmak yerine kaynak hassasiyetini koruyun.

## Çelişki demeden aynı şeyi karşılaştırın

“Dokuzda açılır” ve “onda açılır” çelişkili görünür. Farklı salon, gün, tarih veya kaynak otoritesini anlatabilirler. Önce varlık kimliğini, yüklemi, birimi, kapsamı ve geçerlilik aralığını hizalayın. Sonra aynı koşulda uyumsuz iki değerin yarışıp yarışmadığını sorun. Olumsuzluk ve kip önemlidir: “açılabilir”, “açılacak” değildir.

Güncel iki kaynak gerçekten ayrışıyorsa ikisini koruyup çatışmayı kaynaklarıyla gösterin. Çözüm politikası resmî revizyonu tercih edebilir, inceleme isteyebilir veya seçimden kaçınabilir. “En yeni kazanır” evrensel olarak güvenli değildir; yeni düşük kaliteli kopya eski yetkili kaynağa karşı çıkabilir. Çözüm gerekçesini ve geri almak için gereken bilgiyi kaydedin.

## Yaş önceliği değiştirebilir, doğruluğu değil

```text
illustrative recency weight = exp(-lambda * age)
half-life H => lambda = ln(2) / H
age = H  => weight = 0.5
age = 2H => weight = 0.25
Apply only after eligibility; this is a ranking policy.
```

Yeni görev notu eskiden daha fazla dikkat gerektirebilir. Geçmiş sözleşme yaşından bağımsız olarak geçmiş tarih için doğru kaynak kalabilir. Azalma seçilmiş sıralama sezgisidir; sürenin dolması geçerlilik kuralı; silme saklama eylemidir. Bunları ayırın. Güncellik ağırlığı açmadan hem “şimdi” hem geçmiş tarih sorularını test edin.

## Görünür çatışmayı sınıflandırın

> [!EXERCISE]
> **Kendinizi sınayın**
> Sürüm 2 kasıma kadar cuma 09.00, sürüm 3 kasımdan itibaren cuma 10.00 diyor. Birini yanlış etiketlemek zorunlu mu?
>
> **Açıklama:** Hayır. Farklı aralıklara uygulanıyorlar. İkisini koruyup sorunun tarihiyle filtreleyin. Çelişki için aynı varlık, kapsam ve örtüşen geçerlilik koşullarında uyumsuz değer gerekir.

## Kaynaklar ve ileri okuma

1. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
2. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)

', ARRAY['temporal', 'validity', 'decay', 'contradiction', 'version', 'zaman', 'geçerlilik', 'çelişki', 'unutma']::text[], 'MESA contributors', 5, 'published', 'Bilgi değiştiğinde: güncelleme, çelişki ve unutma — MESA', 'Bilginin ne zaman geçerli olduğuyla ne zaman kaydedildiğini ayırın. Eski olan her kaydı yanlış saymadan düzeltmeleri ve çelişkileri yönetin.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('evaluating-ndcg-and-mrr-in-memory', 'learn', 'en', 'Evaluate retrieval: recall, MRR, nDCG and latency', '', 'Calculate ranking metrics on a judged list, separate quality from speed, and design an experiment that does not grade its own training examples.', 'Calculate ranking metrics on a judged list, separate quality from speed, and design an experiment that does not grade its own training examples.', '## Start with questions and relevance judgments

A search result looks plausible until you define what should have been found. Build a small question set with source-backed judgments. Include exact identifiers, paraphrases, date-sensitive questions, missing-answer cases and forbidden sources. Record the retrieval unit: a relevant document may contain many irrelevant chunks. Have a reviewer judge whether each unit supports the question and retain disagreements for adjudication.

Split development questions from the final test before tuning chunk size, fusion weights or thresholds. Synthetic questions can expand coverage, but an LLM-generated question and LLM-generated label may share mistakes or unnatural wording. Review samples, keep real-user questions where appropriate and deduplicate near-identical questions across splits. Never let answer text leak into the query representation.

## One ranked list, several different questions

| Rank | Passage | Relevance grade |
| --- | --- | --- |
| 1 | A · unrelated room | 0 |
| 2 | B · exact Friday hours | 2 |
| 3 | C · useful supporting context | 1 |

Assume B and C are the only two relevant units in this tiny judged corpus. Precision@3 is 2/3: the fraction retrieved that is relevant. Recall@3 is 2/2 = 1: the fraction of all relevant units retrieved. Reciprocal rank is 1/2 because the first relevant result is second. MRR averages reciprocal rank across queries, assigning zero when no relevant result appears within the declared cutoff.

```text
gain(rel) = 2**rel - 1
DCG@3 = sum(gain(rel_i) / log2(i+1), i=1..3)
Observed [0,2,1]: 0 + 3/log2(3) + 1/log2(4) = 2.3928
Ideal    [2,1,0]: 3 + 1/log2(3) + 0           = 3.6309
nDCG@3 = 2.3928 / 3.6309 = 0.6590
```

The system retrieved every relevant item but ranked an irrelevant one first. Recall alone hides that problem; nDCG penalizes it using graded relevance and position. State the gain function, discount, cutoff and policy for queries with no relevant judgments. Different conventions can produce different values. Unjudged material is not automatically proven irrelevant.

## Change one factor, inspect the failures

<!-- diagram: Freeze questions and data, compare a baseline with one change, compute paired metrics and inspect failures. -->
1. Freeze · corpus + judgments
2. Baseline · lexical only
3. Variant · add dense lane
4. Compare · same queries
5. Inspect · losses and gains

*A higher average can conceal regressions in identifiers, language or authorization.*

Compare per-query changes and useful slices: identifier versus paraphrase, short versus long source, language and source age. Report uncertainty when sample size permits, and retain the raw query-level results. BEIR demonstrates evaluation across heterogeneous retrieval tasks; reuse its discipline, not its scores as your own. [BEIR](https://arxiv.org/abs/2104.08663), [IR evaluation](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html).

> [!NOTE]
> **What we measured in MESA**
> Small rank moves can look like quality changes. [Two fresh stores](/research/why-two-search-runs-differed/) built from the same input scored 48/112 and 52/112 on Hit@5 (benchmark v2 dev, Tier M, models off, build before 0.9.4). A benchmark needs evidence as well as metrics. [Benchmark v2](/research/turkish-legal-benchmark-v2/) ties each answer to a verbatim quote, and it discloses that its test split has been read six times.

## Measure speed without hiding failures

Measure end-to-end retrieval and stage timings separately. Declare hardware, corpus size, concurrency, cache state, warm-up, request count and timeout. Report median and tail latency with errors and empty responses. Dropping timed-out requests from the latency table can make a failing system look fast. A local deterministic fixture tests a contract; it does not measure real embedding-provider quality or production capacity.

> [!EXERCISE]
> **Check your understanding**
> Variant X raises Recall@20 but reduces nDCG@5. Is X simply better?
>
> **Answer:** Not necessarily. It finds more relevant candidates but places them less effectively near the top. Decide based on the downstream task, reranking budget, failure slices and latency; inspect which queries improved and regressed.

## Sources and further reading

1. [Manning, Raghavan & Schütze · Evaluation of ranked retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)
2. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)

', ARRAY['evaluation', 'MRR', 'nDCG', 'recall', 'precision', 'benchmark', 'latency', 'değerlendirme', 'gecikme']::text[], 'MESA contributors', 5, 'published', 'Evaluate retrieval: recall, MRR, nDCG and latency — MESA Learn', 'Calculate ranking metrics on a judged list, separate quality from speed, and design an experiment that does not grade its own training examples.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('evaluating-ndcg-and-mrr-in-memory', 'learn', 'tr', 'Arama kalitesini ölçmek: Recall, MRR, nDCG ve hız', '', 'Etiketli bir sonuç listesinde ölçümleri hesaplayın. Kaliteyle hızı ayrı değerlendirin ve ayar yaparken kullandığınız sorulardan bağımsız bir test hazırlayın.', 'Etiketli bir sonuç listesinde ölçümleri hesaplayın. Kaliteyle hızı ayrı değerlendirin ve ayar yaparken kullandığınız sorulardan bağımsız bir test hazırlayın.', '## Soru ve ilgililik etiketiyle başlayın

Ne bulunması gerektiğini tanımlamadığınızda birçok sonuç makul görünebilir. Kaynaklarla desteklenmiş etiketler kullanarak küçük bir soru kümesi oluşturun. Tam kimlik araması, farklı ifadeler, tarih duyarlılığı, yanıtı bulunmayan sorular ve kapalı kaynaklar da yer alsın. Ölçtüğünüz birimi belirtin: İlgili bir belgenin her parçası ilgili olmayabilir. İnceleyen kişiler her birimin soruyu destekleyip desteklemediğini değerlendirsin; ayrışan kararları ayrıca gözden geçirin.

Parça boyutunu, birleştirme ağırlığını veya eşikleri ayarlamadan önce geliştirme sorularını son test sorularından ayırın. Yapay sorular kapsamı genişletebilir, ancak soruyu ve etiketi aynı model üretirse ikisinde de aynı hata veya yapay anlatım bulunabilir. Örnekleri inceleyin; uygunsa gerçek kullanıcı sorularını kullanın ve kümeler arasındaki çok benzer soruları ayıklayın. Yanıt metnini sorgu temsiline sızdırmayın.

## Tek sıralı liste, farklı ölçüm soruları

| Sıra | Pasaj | İlgililik derecesi |
| --- | --- | --- |
| 1 | A · ilgisiz salon | 0 |
| 2 | B · tam cuma saati | 2 |
| 3 | C · yararlı destek bağlamı | 1 |

Bu küçük etiketli kümede ilgili birimler yalnızca B ve C olsun. Precision@3, bulunanların ilgili oranı olan 2/3’tür. Recall@3, bütün ilgili birimlerin bulunan oranı olan 2/2 = 1’dir. İlk ilgili sonuç ikinci olduğundan reciprocal rank 1/2’dir. MRR sorguların reciprocal rank ortalamasıdır; belirtilen kesimde ilgili sonuç yoksa sıfır verilir.

```text
gain(rel) = 2**rel - 1
DCG@3 = sum(gain(rel_i) / log2(i+1), i=1..3)
Observed [0,2,1]: 0 + 3/log2(3) + 1/log2(4) = 2.3928
Ideal    [2,1,0]: 3 + 1/log2(3) + 0           = 3.6309
nDCG@3 = 2.3928 / 3.6309 = 0.6590
```

Sistem bütün ilgili öğeleri bulmuş, ancak ilgisiz bir öğeyi ilk sıraya koymuş olabilir. Recall tek başına bu sorunu göstermez; nDCG hem ilgililik derecesini hem konumu hesaba katar. Kazanç, konuma bağlı indirim ve liste sınırı tanımlarını; ilgili etiketi bulunmayan sorgulara nasıl davranıldığını belirtin. Farklı tanımlar farklı puanlar verir. Etiketlenmemiş bir içeriğin ilgisiz olduğu da kendiliğinden kabul edilemez.

## Tek etkeni değiştirin, hataları inceleyin

<!-- diagram: Soruyu ve veriyi sabitleyin; tabanı tek değişiklikle karşılaştırıp eşlenmiş metrik ve hataları inceleyin. -->
1. Sabitle · veri + etiket
2. Taban · yalnız sözcüksel
3. Değişken · yoğun kanal ekle
4. Karşılaştır · aynı sorular
5. İncele · kayıp ve kazanım

*Daha yüksek ortalama kimlik, dil veya yetkilendirme gerilemesini gizleyebilir.*

Değişimi sorgu başına ve anlamlı alt gruplarda inceleyin: kimlik araması veya farklı ifade, kısa veya uzun kaynak, dil ve kaynak yaşı. Örneklem uygunsa belirsizliği raporlayın ve ham sonuçları koruyun. BEIR, farklı görevleri birlikte değerlendirmeye örnektir. O çalışmanın puanını kendi başarınız gibi kullanmak yerine değerlendirme yaklaşımından yararlanın. [BEIR](https://arxiv.org/abs/2104.08663) [IR değerlendirme](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)

> [!NOTE]
> **MESA’da ne ölçtük?**
> Küçük sıra değişimleri kalite değişimi gibi görünebilir. Aynı girdiyle [sıfırdan kurulan iki depo](/research/why-two-search-runs-differed/) Hit@5’te 48/112 ve 52/112 aldı (benchmark v2 dev, Tier M, modeller kapalı, 0.9.4 öncesi derleme). Benchmark için ölçüt kadar kanıt da gerekir. [Benchmark v2](/research/turkish-legal-benchmark-v2/) her yanıtı birebir bir alıntıya bağlar ve test bölümünün altı kez okunduğunu açıkça belirtir.

## Hataları gizlemeden hızı ölçün

Aramanın toplam süresini ve her aşamasını ayrı ölçün. Donanımı, veri büyüklüğünü, eşzamanlı istek sayısını, önbelleği, ısınmayı ve zaman aşımını belirtin. Ortanca süreyi ve yüksek gecikme yüzdeliklerini; hatalar ve boş sonuçlarla birlikte raporlayın. Zaman aşımına uğrayan istekleri dışarıda bırakmak, sorunlu bir sistemi hızlı gösterebilir. Sabit girdilerle yapılan yerel örnek, davranış testidir; gerçek modelin kalitesini veya canlı kullanım kapasitesini ölçmez.

> [!EXERCISE]
> **Kendinizi sınayın**
> X değişkeni Recall@20’yi artırıp nDCG@5’i düşürüyor. X doğrudan daha iyi mi?
>
> **Açıklama:** Zorunlu değil. Daha fazla ilgili aday bulup üst sıralara daha kötü yerleştiriyor. Sonraki görev, yeniden sıralama bütçesi, hata alt grupları ve gecikmeyle karar verin; hangi sorunun iyileşip gerilediğini inceleyin.

## Kaynaklar ve ileri okuma

1. [Manning, Raghavan & Schütze · Evaluation of ranked retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)
2. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)

', ARRAY['evaluation', 'MRR', 'nDCG', 'recall', 'precision', 'benchmark', 'latency', 'değerlendirme', 'gecikme']::text[], 'MESA contributors', 5, 'published', 'Arama kalitesini ölçmek: Recall, MRR, nDCG ve hız — MESA', 'Etiketli bir sonuç listesinde ölçümleri hesaplayın. Kaliteyle hızı ayrı değerlendirin ve ayar yaparken kullandığınız sorulardan bağımsız bir test hazırlayın.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('build-a-small-search-lab', 'learn', 'en', 'Build a small search lab, without an LLM', '', 'Run a complete Python/SQLite example, predict its results and add a judged regression case. Connect the course concepts to an inspectable program.', 'Run a complete Python/SQLite example, predict its results and add a judged regression case. Connect the course concepts to an inspectable program.', '## What you will build

This lab retrieves one source passage from a tiny archive. It uses Python’s standard `sqlite3` module and a SQLite build with FTS5 enabled. No model, network call, embedding download or MESA server is required. Save the code as `search_lab.py` and run `python3 search_lab.py`. If FTS5 is unavailable, SQLite reports “no such module: fts5”; use a Python/SQLite distribution that includes it.

The example deliberately creates one FTS table per allowed demonstration corpus. That keeps candidate statistics local in this tiny exercise. It is not a production tenancy strategy: authenticated scope resolution, schema management, resource limits and lifecycle operations need a separate design. The fixed `allowed_archive` mapping stands in for a trusted server decision, never a value taken from a prompt.

## Run the complete example

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
    query = ''"reading room" AND Friday''
    rows = db.execute(
        f"SELECT source_id, body FROM {table} "
        f"WHERE {table} MATCH ? ORDER BY bm25({table}), source_id LIMIT ?",
        (query, 3),
    ).fetchall()
    assert [row[0] for row in rows] == ["handbook-r3/c1"]
    for source_id, body in rows:
        print(source_id, "|", body)
```

The phrase query requires “reading room” together, and `AND Friday` requires Friday as well. The Monday passage lacks Friday; the garden passage lacks the phrase. The assertion is a reproducible expected result for this dataset, not an accuracy measurement. SQLite FTS5 ranks better matches with numerically smaller BM25 values, so ascending order is correct. [FTS5 reference](https://www.sqlite.org/fts5.html).

## Trace the program through the course model

<!-- diagram: A trusted archive selection constrains lexical candidates; results retain source IDs for inspection. -->
1. Trusted mapping · atlas
2. Parameterized MATCH · query
3. BM25 order · local corpus
4. Limit · three candidates
5. Inspect · source ID + text

*This is retrieval only. No answer generator or claim extraction is hidden in the example.*

SQL parameters prevent query values from becoming SQL syntax, but they do not disable the FTS query language. User input such as `OR`, quotes or malformed syntax still needs a deliberate search policy and error handling. Table identifiers cannot be bound with `?`; the example interpolates only a hard-coded trusted mapping. Do not replace that mapping with arbitrary user input.

## Make one change and predict the outcome

Make these changes in order. Each one shows a different limit of lexical retrieval.

1. Change `Friday` to `Monday` in the query and the expected ID to `handbook-r3/c2`. Run it, then change both back.
2. Add a passage: `("notice-r1/c1", "Atlas reading room is closed for maintenance on Friday.")`. The assertion now fails because two passages match. Retrieval has exposed a conflict and has not resolved it. Choosing the current answer needs source revision and validity metadata.
3. Search for `"last working day"`. It returns nothing, because this lexical baseline does not know that the phrase can mean Friday.
4. Search for `"reading` with the closing quote missing. SQLite raises `OperationalError`, so a real search path needs error handling.

Next, turn those checks into a small judged test. Save this as `search_eval.py` and run `python3 search_eval.py`. It uses only the standard library.

```text
import sqlite3

PASSAGES = [
    ("handbook-r3/c1", "Atlas reading room opens at 10:00 on Friday."),
    ("handbook-r3/c2", "Atlas reading room opens at 09:00 on Monday."),
    ("directory-r1/c1", "The garden is closed on Friday."),
    ("notice-r1/c1", "Atlas reading room is closed for maintenance on Friday."),
]
JUDGED = [
    (''"reading room" AND Friday'', "handbook-r3/c1"),
    (''"reading room" AND Monday'', "handbook-r3/c2"),
    ("garden", "directory-r1/c1"),
    (''"last working day"'', "handbook-r3/c1"),
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
    print("Malformed query:", search(db, ''"reading''))
```

Expected output, checked with Python’s `sqlite3` on SQLite 3.46.1:

```text
"reading room" AND Friday    rank=1 results=[''handbook-r3/c1'', ''notice-r1/c1'']
"reading room" AND Monday    rank=1 results=[''handbook-r3/c2'']
garden                       rank=1 results=[''directory-r1/c1'']
"last working day"           rank=None results=[]
Recall@3: 0.75
MRR: 0.75
Malformed query: []
```

The 0.75 scores come from four invented queries, so they teach the calculation and say nothing about real search quality. Keep a separate test split, and record every time you read it. Only after you understand the lexical failures should you add dense retrieval or a reranker. For Turkish text, try the tokenizer example in [Why BM25 Struggles With Turkish](/research/bm25-turkish-prefix-matching/). For a MESA integration, move to the version-pinned quickstart; this lab is independent instructional code.

## Find the boundary of the demonstration

> [!EXERCISE]
> **Check your understanding**
> The code returns the expected source. Does that prove the handbook is current, the answer is true and tenant isolation is production-ready?
>
> **Answer:** No. The assertion verifies one retrieval behavior on controlled data. Validity, source trust, authentication, concurrency, deletion and production capacity need separate tests and implementation.

## Sources and further reading

1. [SQLite · FTS5 reference](https://www.sqlite.org/fts5.html)
2. [Manning, Raghavan & Schütze · Evaluation of ranked retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)
3. [MESA Core v0.9.5 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/docs/architecture-v4.md)

', ARRAY['Python', 'SQLite', 'FTS5', 'lab', 'tutorial', 'uygulama', 'laboratuvar', 'kod']::text[], 'MESA contributors', 7, 'published', 'Build a small search lab, without an LLM — MESA Learn', 'Run a complete Python/SQLite example, predict its results and add a judged regression case. Connect the course concepts to an inspectable program.', true, '2026-10-18T00:00:00Z', '2026-10-18T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('build-a-small-search-lab', 'learn', 'tr', 'Dil modeli olmadan küçük bir arama sistemi kurun', '', 'Python ve SQLite ile tam bir örnek çalıştırın. Sonucu tahmin edin, değişiklikler yapın ve daha önce çalışan davranışları koruyan testler ekleyin.', 'Python ve SQLite ile tam bir örnek çalıştırın. Sonucu tahmin edin, değişiklikler yapın ve daha önce çalışan davranışları koruyan testler ekleyin.', '## Ne kuracaksınız?

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
    query = ''"reading room" AND Friday''
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
    (''"reading room" AND Friday'', "handbook-r3/c1"),
    (''"reading room" AND Monday'', "handbook-r3/c2"),
    ("garden", "directory-r1/c1"),
    (''"last working day"'', "handbook-r3/c1"),
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
    print("Malformed query:", search(db, ''"reading''))
```

Beklenen çıktı (Python `sqlite3`, SQLite 3.46.1 ile denendi):

```text
"reading room" AND Friday    rank=1 results=[''handbook-r3/c1'', ''notice-r1/c1'']
"reading room" AND Monday    rank=1 results=[''handbook-r3/c2'']
garden                       rank=1 results=[''directory-r1/c1'']
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

', ARRAY['Python', 'SQLite', 'FTS5', 'lab', 'tutorial', 'uygulama', 'laboratuvar', 'kod']::text[], 'MESA contributors', 7, 'published', 'Dil modeli olmadan küçük bir arama sistemi kurun — MESA', 'Python ve SQLite ile tam bir örnek çalıştırın. Sonucu tahmin edin, değişiklikler yapın ve daha önce çalışan davranışları koruyan testler ekleyin.', true, '2026-10-18T00:00:00Z', '2026-10-18T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('keyword-vs-semantic-search', 'research', 'en', 'Keyword vs semantic search', 'A planned retrieval benchmark protocol', 'This publication defines a proposed comparison. It reports no benchmark result.', '', '## Research question

Under a frozen legal retrieval corpus and independently judged query set, how do lexical, semantic, and hybrid retrieval differ in relevance and operational cost?

## Why this matters

Search approaches are often compared with broad claims that hide corpus, query, relevance, and configuration choices. A useful comparison must make those choices inspectable.

## Dataset

> [!NOTE]
> **Not selected**
> The corpus will not be described by an invented size. Source eligibility, licensing, temporal cut-off, deduplication, and version identity must be recorded before execution.

## Experimental setup

- Freeze the corpus, query set, judgments, and system configurations.
- Run lexical, semantic, and hybrid conditions against identical eligible documents.
- Keep query construction separate from relevance judgment.
- Record failures and zero-result queries, not only favorable examples.

## Results

> [!WARNING]
> **No results yet**
> No benchmark run has been completed. Tables and charts will be added only after evidence artifacts are available.

## Reproducibility

A publishable run should record dataset identity, query and judgment versions, model identifiers, configuration, code revision, seeds where applicable, environment, raw outputs, and analysis steps.

', ARRAY['benchmark', 'retrieval', 'semantic-search']::text[], 'MESA contributors', 9, 'published', 'Keyword vs Semantic Search — Planned Research Protocol', 'Review MESA''s planned, result-free protocol for comparing keyword, semantic, and hybrid legal retrieval.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('keyword-vs-semantic-search', 'research', 'tr', 'Sözcük ve anlam temelli arama nasıl karşılaştırılacak?', 'Planlanan arama karşılaştırmalı test protokolü', 'Bu plan, farklı arama yöntemlerini karşılaştırmak için hazırlanmıştır. Henüz deney yapılmadı ve sonuç yayımlanmadı.', '', '## Araştırma sorusu

Aynı hukuk belgeleri, sabit sorgular ve bağımsız ilgililik değerlendirmeleri kullanıldığında sözcük tabanlı, anlamsal ve hibrit arama; ilgili sonuçları bulma ve işletim maliyeti bakımından nasıl farklılaşır?

## Neden önemli?

Arama yöntemleri bazen kullanılan belgeler, sorular, etiketler ve ayarlar açıklanmadan karşılaştırılıyor. Yararlı bir karşılaştırma, bu seçimlerin nasıl yapıldığını da göstermelidir.

## Veri kümesi

> [!NOTE]
> **Henüz seçilmedi**
> Uydurma bir büyüklük verilmeyecektir. Kaynak uygunluğu, lisans, zamansal kesim, tekilleştirme ve sürüm kimliği çalıştırmadan önce kaydedilmelidir.

## Deney düzeni

- Veri kümesini, sorgu setini, değerlendirmeleri ve sistem yapılandırmalarını dondur.
- Sözcük tabanlı, anlamsal ve hibrit koşulları aynı uygun belgeler üzerinde çalıştır.
- Sorgu üretimini ilgililik değerlendirmesinden ayır.
- Yalnızca olumlu örnekleri değil, hataları ve sıfır sonuçlu sorguları da kaydet.

## Sonuçlar

> [!WARNING]
> **Henüz sonuç yok**
> Karşılaştırmalı test çalıştırılmadı. Tablolar ve grafikler yalnızca kanıt çıktıları mevcut olduğunda eklenecektir.

## Tekrarlanabilirlik

Yayımlanacak bir deneyde veri kümesi, sorgu ve değerlendirme sürümleri; model kimlikleri, ayarlar, kod sürümü, gerekiyorsa rastgelelik başlangıç değerleri, çalışma ortamı, ham çıktılar ve analiz adımları kaydedilmelidir.

', ARRAY['benchmark', 'retrieval', 'semantic-search']::text[], 'MESA contributors', 9, 'published', 'Sözcük ve anlam temelli arama nasıl karşılaştırılacak? — MESA', 'Bu plan, farklı arama yöntemlerini karşılaştırmak için hazırlanmıştır. Henüz deney yapılmadı ve sonuç yayımlanmadı.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('turkish-legal-embedding-comparison', 'research', 'en', 'bge-m3 vs Mürşit on Turkish Legal Retrieval', 'A dev-set comparison, including where the Turkish model won', 'On 112 answerable Turkish legal dev questions, bge-m3 scored higher overall on MRR and Hit@5. Mürşit Large won on some questions and categories.', '', '## Which embedding model did better on Turkish legal search?

On our dev set, BAAI/bge-m3 did better overall. With embeddings alone (T1), it reached Hit@5 0.7411 and MRR 0.5758. Mürşit Large reached Hit@5 0.6875 and MRR 0.5626. With reranking (T2), bge-m3 reached Hit@5 0.9286 and Mürşit Large reached 0.8929.

This does not show that bge-m3 is better for Turkish law in general. The gap is 6 of 112 questions at T1 and 4 of 112 at T2. Mürşit Large ranked higher on 29 questions at T1, and it led on Hit@1. We kept bge-m3 as the MESA default because this run gave us no reason to change it.

## How did we run the comparison?

- MESA 0.9.3 from PyPI with the `ml` extra, on one Colab NVIDIA A100 80 GB runtime.
- Benchmark v2 dev split, Tier M: 141 Turkish legal documents, 5,041 chunks, 128 questions, 112 answerable.
- A new store for each Mürşit configuration. Search started after all 5,041 vectors were complete. The bge-m3 numbers come from the 0.9.3 reference run on the same inputs.
- Both models at 1,024 dimensions, L2-normalized by MESA.
- T1: embeddings with hybrid search. T2: T1 plus `BAAI/bge-reranker-v2-m3` at depth 20.
- Evaluator v2.1, search limit 50.

> [!NOTE]
> **About normalization**
> The published Mürşit pipeline has no final Normalize module and specifies cosine similarity. MESA applied L2 normalization to both models, so both were compared on the same vector setup.

## What were the overall results?

| MESA 0.9.3, dev, Tier M | Model | MRR | Hit@1 | Hit@5 | Hit@10 | Search p50 |
| --- | --- | --- | --- | --- | --- | --- |
| T1 | bge-m3 | 0.5758 | 0.4375 | 0.7411 | 0.8661 | 1.67 s |
| T1 | Mürşit Large | 0.5626 | 0.4464 | 0.6875 | 0.8304 | 1.66 s |
| T2 | bge-m3 | 0.8076 | 0.7143 | 0.9286 | 0.9554 | 2.35 s |
| T2 | Mürşit Large | 0.7814 | 0.6964 | 0.8929 | 0.9196 | 2.31 s |

Speed was not a deciding factor. Median search time and ingestion time were close. Ingestion to full readiness at T1 took 741.60 s with bge-m3 and 738.32 s with Mürşit Large.

## Where did each model win?

The largest gap was on paraphrased questions, where the query uses different words from the source. Mürşit Large led on number, date and docket questions at T1.

| Category, dev (questions) | T1 bge-m3 | T1 Mürşit | T2 bge-m3 | T2 Mürşit |
| --- | --- | --- | --- | --- |
| Exact wording (31) | 0.8387 | 0.7742 | 0.9355 | 0.9355 |
| Number, date, docket (35) | 0.8286 | 0.8571 | 1.0000 | 0.9714 |
| Paraphrase (32) | 0.7188 | 0.5938 | 0.9375 | 0.8438 |
| Cross-document (14) | 0.3571 | 0.2857 | 0.7143 | 0.7143 |

The table shows passage Hit@5. Small categories move in large steps: one cross-document question is worth about 0.07.

| Passage rank, 112 answerable | Mürşit better | Mürşit worse | Tied |
| --- | --- | --- | --- |
| T1 | 29 | 35 | 48 |
| T2 | 4 | 7 | 101 |

At T1 the two models disagree often, and the wins are nearly balanced. That suggests they make different errors. We did not test whether combining them helps. Reranking narrows the difference: at T2, 101 of 112 questions rank the same.

## How did the earlier default compare?

Before 0.9.3, MESA defaulted to `magibu/embeddingmagibu-200m`. Our direct comparison with bge-m3 used an older question set, so it cannot be merged with the tables above.

| MESA 0.9.2, benchmark v1 test, Tier M, T1 | MRR | Hit@5 |
| --- | --- | --- |
| magibu/embeddingmagibu-200m | 0.4095 | 0.5041 |
| BAAI/bge-m3 | 0.5136 | 0.6777 |

> [!WARNING]
> **Caveat on test results**
> This is a benchmark v1 test result. The test split was read in several MESA release runs, so it is not an untouched holdout. Treat it as a regression signal.

## What should you take from this?

- Test candidate models on your own documents and questions. This corpus is Turkish legal text, with many citations and numbers.
- Read results by question type. An overall score hid Mürşit''s lead on number, date and docket questions.
- Compare with and without a reranker. Here, the reranker reduced the model gap.
- Plan for a rebuild. In MESA, a change of embedding identity requires rebuilding active vectors.

For the concepts, see [semantic search](/learn/semantic-search/) and [hybrid retrieval](/learn/hybrid-retrieval-explained/). The [embedding provider docs](/docs/core/embedding-providers/) cover MESA configuration.

## What can this comparison not show?

- Mürşit Large was run only on the dev split.
- With 112 answerable questions, gaps of 4 to 6 questions may not hold on a new sample. We did not run a significance test.
- We tested each model only through MESA''s chunking and fusion pipeline. A different pipeline could change the order.
- Mürşit Base was not tested.
- These are results for this corpus, not a general ranking of the two models.

## Sources

1. [BAAI/bge-m3 model card](https://huggingface.co/BAAI/bge-m3)
2. [BGE-M3 paper](https://arxiv.org/abs/2402.03216)
3. [newmindai/Mursit-Large-TR-Retrieval model card](https://huggingface.co/newmindai/Mursit-Large-TR-Retrieval)
4. [BAAI/bge-reranker-v2-m3 model card](https://huggingface.co/BAAI/bge-reranker-v2-m3)
5. [MESA 0.9.4 changelog](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)

', ARRAY['benchmark', 'embeddings', 'turkish', 'legal-search']::text[], 'MESA contributors', 7, 'published', 'bge-m3 vs Mürşit on Turkish Legal Retrieval', 'We compared bge-m3 and Mürşit Large on 112 answerable Turkish legal dev questions. See where each model won, and what the sample cannot show.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('turkish-legal-embedding-comparison', 'research', 'tr', 'Türkçe Hukukta Hangi Embedding Modeli Daha İyi?', 'bge-m3 ve Mürşit Large için dev kümesi karşılaştırması', '112 yanıtlanabilir Türkçe hukuk sorusunda bge-m3, MRR ve Hit@5’te genel olarak önde kaldı. Mürşit Large bazı soru ve kategorilerde kazandı.', '', '## Türkçe hukuk aramasında hangi model daha iyi sonuç verdi?

Dev kümemizde genel olarak BAAI/bge-m3 daha iyi sonuç verdi. Yalnızca gömme vektörleriyle (embedding, T1) Hit@5 0,7411 ve MRR 0,5758 aldı. Mürşit Large ise Hit@5 0,6875 ve MRR 0,5626 aldı. Yeniden sıralama (reranking, T2) eklenince bge-m3 Hit@5’te 0,9286’ya, Mürşit Large 0,8929’a çıktı.

Bu sonuç, bge-m3’ün Türk hukukunda her zaman daha iyi olduğunu göstermez. Fark T1’de 112 sorunun 6’sı, T2’de 4’üdür. Mürşit Large, T1’de 29 soruda daha üst sıraya çıktı ve Hit@1’de önde kaldı. Bu çalıştırma varsayılanı değiştirmek için bir gerekçe sunmadığından MESA’da bge-m3’ü koruduk.

## Karşılaştırmayı nasıl yaptık?

- PyPI’dan `ml` ekiyle MESA 0.9.3, tek bir Colab NVIDIA A100 80 GB ortamında.
- Benchmark v2 dev bölümü, Tier M: 141 Türkçe hukuk belgesi, 5.041 parça (chunk), 112’si yanıtlanabilir 128 soru.
- Her Mürşit yapılandırması için yeni bir depo. Arama, 5.041 vektörün tamamı hazır olunca başladı. bge-m3 sayıları, aynı girdilerle yapılan 0.9.3 referans çalıştırmasından geliyor.
- İki model de 1.024 boyutlu ve MESA tarafından L2 normalize edildi.
- T1: hibrit aramayla gömme vektörleri. T2: T1’e ek olarak derinliği 20 olan `BAAI/bge-reranker-v2-m3`.
- Değerlendirici v2.1, arama limiti 50.

> [!NOTE]
> **Normalizasyon notu**
> Yayımlanan Mürşit hattında son bir Normalize modülü yoktur ve kosinüs benzerliği belirtilir. MESA iki modele de L2 normalizasyonu uyguladı; böylece ikisi aynı vektör düzeniyle karşılaştırıldı.

## Genel sonuçlar neydi?

| MESA 0.9.3, dev, Tier M | Model | MRR | Hit@1 | Hit@5 | Hit@10 | Arama p50 |
| --- | --- | --- | --- | --- | --- | --- |
| T1 | bge-m3 | 0,5758 | 0,4375 | 0,7411 | 0,8661 | 1,67 sn |
| T1 | Mürşit Large | 0,5626 | 0,4464 | 0,6875 | 0,8304 | 1,66 sn |
| T2 | bge-m3 | 0,8076 | 0,7143 | 0,9286 | 0,9554 | 2,35 sn |
| T2 | Mürşit Large | 0,7814 | 0,6964 | 0,8929 | 0,9196 | 2,31 sn |

Hız belirleyici olmadı. Ortanca arama süreleri ve veri alım süreleri birbirine yakındı. T1’de tüm belgelerin hazır olması bge-m3 ile 741,60 sn, Mürşit Large ile 738,32 sn sürdü.

## Hangi model nerede öne geçti?

En büyük fark, sorunun kaynaktan farklı sözcüklerle sorulduğu yeniden ifade (paraphrase) sorularında çıktı. Sayı, tarih ve esas numarası sorularında T1’de Mürşit Large öndeydi.

| Kategori, dev (soru) | T1 bge-m3 | T1 Mürşit | T2 bge-m3 | T2 Mürşit |
| --- | --- | --- | --- | --- |
| Birebir ifade (31) | 0,8387 | 0,7742 | 0,9355 | 0,9355 |
| Sayı, tarih, esas no (35) | 0,8286 | 0,8571 | 1,0000 | 0,9714 |
| Yeniden ifade (32) | 0,7188 | 0,5938 | 0,9375 | 0,8438 |
| Çok belgeli (14) | 0,3571 | 0,2857 | 0,7143 | 0,7143 |

Tablo, pasaj Hit@5 değerlerini gösterir. Küçük kategorilerde değerler büyük adımlarla oynar: çok belgeli tek bir soru yaklaşık 0,07 eder.

| Pasaj sırası, 112 yanıtlanabilir soru | Mürşit daha iyi | Mürşit daha kötü | Eşit |
| --- | --- | --- | --- |
| T1 | 29 | 35 | 48 |
| T2 | 4 | 7 | 101 |

T1’de iki model sık sık ayrışıyor ve kazanımlar neredeyse dengeli. Bu, modellerin farklı hatalar yaptığını düşündürüyor. İkisini birleştirmenin işe yarayıp yaramadığını denemedik. Yeniden sıralama farkı daraltıyor: T2’de 112 sorunun 101’i aynı sırada.

## Önceki varsayılan model nasıldı?

MESA, 0.9.3’ten önce varsayılan olarak `magibu/embeddingmagibu-200m` kullanıyordu. Bu modeli bge-m3 ile doğrudan karşılaştırdığımız ölçüm eski bir soru kümesine dayanıyor; yukarıdaki tablolarla birleştirilemez.

| MESA 0.9.2, benchmark v1 test, Tier M, T1 | MRR | Hit@5 |
| --- | --- | --- |
| magibu/embeddingmagibu-200m | 0,4095 | 0,5041 |
| BAAI/bge-m3 | 0,5136 | 0,6777 |

> [!WARNING]
> **Test sonuçları için uyarı**
> Bu, benchmark v1 test sonucudur. Test bölümü birkaç MESA sürüm çalıştırmasında okundu; dolayısıyla hiç görülmemiş bir küme değildir. Bu sonucu yalnızca gerileme sinyali olarak okuyun.

## Bu sonuçtan ne çıkarmalısınız?

- Aday modelleri kendi belgeleriniz ve sorularınızla deneyin. Bu derlem, atıf ve sayı yoğun Türkçe hukuk metinlerinden oluşuyor.
- Sonuçları soru türüne göre okuyun. Genel puan, Mürşit’in sayı, tarih ve esas numarası sorularındaki önünü gizledi.
- Yeniden sıralayıcıyla ve onsuz karşılaştırın. Burada yeniden sıralayıcı model farkını azalttı.
- Yeniden kurulumu hesaba katın. MESA’da embedding kimliği değişince etkin vektörler yeniden oluşturulmalıdır.

Kavramlar için [anlamsal arama](/learn/semantic-search/) ve [hibrit arama](/learn/hybrid-retrieval-explained/) derslerine, MESA ayarları için [embedding sağlayıcıları dokümanına](/docs/core/embedding-providers/) bakın.

## Bu karşılaştırma neyi gösteremez?

- Mürşit Large yalnızca dev bölümünde çalıştırıldı.
- 112 yanıtlanabilir soruda 4 ila 6 soruluk fark, yeni bir örneklemde korunmayabilir. Anlamlılık testi yapmadık.
- Modelleri yalnızca MESA’nın parçalama ve birleştirme hattı üzerinden denedik. Farklı bir hat sırayı değiştirebilir.
- Mürşit Base denenmedi.
- Sonuçlar bu derlem içindir; iki modelin genel bir sıralaması değildir.

## Kaynaklar

1. [BAAI/bge-m3 model kartı](https://huggingface.co/BAAI/bge-m3)
2. [BGE-M3 makalesi](https://arxiv.org/abs/2402.03216)
3. [newmindai/Mursit-Large-TR-Retrieval model kartı](https://huggingface.co/newmindai/Mursit-Large-TR-Retrieval)
4. [BAAI/bge-reranker-v2-m3 model kartı](https://huggingface.co/BAAI/bge-reranker-v2-m3)
5. [MESA 0.9.4 değişiklik günlüğü](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)

', ARRAY['benchmark', 'embeddings', 'turkish', 'legal-search']::text[], 'MESA contributors', 7, 'published', 'Türkçe Hukukta Hangi Embedding Modeli Daha İyi?', 'bge-m3 ile Mürşit Large’ı 112 yanıtlanabilir Türkçe hukuk sorusunda karşılaştırdık. Hangi modelin nerede öne geçtiğini görün.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('why-two-search-runs-differed', 'research', 'en', 'Why Two Identical Search Runs Gave Different Results', 'A ranking bug that looked like a quality change', 'Two fresh MESA stores built from the same documents disagreed on 49 of 112 dev questions. Random IDs were deciding tied ranks.', '', '## Why did the same search give different results?

Random IDs were breaking ties. When two passages had the same score, their order depended on a UUID created at ingest. Two fresh stores built from the same 141 documents therefore ranked some passages differently. On benchmark v2 dev (Tier M, models off), one store scored 48/112 on Hit@5 and the other scored 52/112.

The fix was to break ties by stable content identity. On the published MESA 0.9.4 package, two independently built stores returned the same order for all 128 dev questions, in all three tested configurations.

## What did the two runs show?

The difference appeared only between separately built stores. Repeating the search on one store changed nothing, so query-time randomness was not the cause.

| Comparison (dev, T0, before the fix) | Hit@5 | MRR | Answerable questions with a different rank |
| --- | --- | --- | --- |
| Fresh store A | 48/112 | 0.3314 | 49, A vs B |
| Fresh store B | 52/112 | 0.3500 | 49, A vs B |
| Shared store, run 1 | 50/112 | 0.3411 | 0, run 1 vs run 2 |
| Shared store, run 2 | 50/112 | 0.3411 | 0, run 1 vs run 2 |

The Hit@5 gap hides how much moved. Forty-nine answerable questions changed rank. Only six crossed the top-5 boundary: one in store A''s favor and five in store B''s. The net result was a four-question gap.

> [!NOTE]
> **Setup**
> Development build before the 0.9.4 ranking changes, with graph on and models off. Benchmark v2 dev split, Tier M, 141 documents, 5,041 chunks, 128 questions, 112 of them answerable. Search limit 50.

## Why do ties happen in rank fusion?

[Reciprocal Rank Fusion](/learn/reciprocal-rank-fusion-explained/) scores a passage from its rank in each list, not from the raw score. Ranks are integers, so exact ties are normal.

Here is an illustrative example. With k = 60 and equal weights, a passage ranked third only by BM25 scores 1/(60+3). A passage ranked third only by the assertion lane also scores 1/(60+3). The fused score cannot separate them, so the next sort key decides.

Before the fix, that next key could be a random UUID. The UUID was stable inside one store, which is why repeated runs agreed. A new store generated new UUIDs, so the same tie could resolve the other way.

## How did we make ranking repeatable?

MESA 0.9.4 changed two things. Search lanes and fusion now break equal scores by content identity. The catalog also assigns tenant-scoped, deterministic UUID5 keys, so the same corpus produces the same internal keys. Scores do not change.

```text
# Pseudo-code, simplified from MESA 0.9.4
results = sorted(
    candidates,
    key=lambda c: (
        -c.fused_score,
        c.document_id,
        c.revision_number,
        c.chunk_ordinal,
        c.chunk_id,
    ),
)
```

During development, one pair of fresh stores still differed on 2 of 112 answerable questions, with no change to the top-5 count. The next pair differed on none. The check that matters is the published package:

| MESA 0.9.4 from PyPI, dev, Tier M | Identical questions | Gold-rank differences | Returned-order differences |
| --- | --- | --- | --- |
| T0 (models off) | 128/128 | 0 | 0 |
| T1b (bge-m3) | 128/128 | 0 | 0 |
| T2 (bge-m3 + reranker) | 128/128 | 0 | 0 |

That run used 0.9.3 graph and assertion settings. A separate run with the 0.9.4 release defaults repeated the result. Its T1b ranks also matched on a different LanceDB version, 128 of 128.

## Why does this matter for evaluation?

A four-question swing is larger than some real improvements. In the same development cycle, prefix BM25 alone added a net two questions on a shared store. On fresh stores, that gain could not have been told apart from tie noise.

So we changed how we compare. Before the fix, we measured changes on one shared store. Since the fix, we also build fresh stores and compare the ordered results. Read the full before-and-after numbers in [What Improved MESA Search Quality in 0.9.4](/research/what-improved-search-in-0-9-4/).

## How can you check your own search system?

1. Build two indexes from the same input, in separate locations.
2. Run the same queries against both.
3. Compare the ordered result IDs, not only Hit@k or MRR.
4. If orders differ, look for ties first, then for generated IDs, insertion order and parallel ingestion.
5. Add a final sort key that comes from the content, and keep a test that builds two fresh stores.

Our [evaluation method](/methodology/retrieval-evaluation/) lists what to record with each run. The [MRR and nDCG lesson](/learn/evaluating-ndcg-and-mrr-in-memory/) explains why small rank moves can change a score.

## What can this result not show?

- It covers one Turkish legal corpus and 128 dev questions.
- It shows repeatability for the same corpus, package and settings. Adding a document can still change ranks.
- A deterministic tie-break makes the order repeatable. It does not make the tied passages more relevant.
- We did not count how many of the 49 rank differences came from each lane.

## Sources

1. [MESA 0.9.4 changelog](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
2. [Cormack, Clarke and Büttcher: Reciprocal Rank Fusion (SIGIR 2009)](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)
3. [RFC 9562: Universally Unique IDentifiers](https://www.rfc-editor.org/rfc/rfc9562.html)

', ARRAY['benchmark', 'determinism', 'rrf', 'evaluation']::text[], 'MESA contributors', 7, 'published', 'Why Two Identical Search Runs Gave Different Results', 'Two fresh MESA stores disagreed on 49 of 112 questions. Here is how random tie-breaks caused it and how we made ranking repeatable.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('why-two-search-runs-differed', 'research', 'tr', 'Aynı Arama İki Kez Neden Farklı Sonuç Verdi?', 'Kalite değişimi gibi görünen bir sıralama hatası', 'Aynı belgelerle sıfırdan kurulan iki MESA deposu, 112 dev sorusunun 49’unda farklı sıra verdi. Eşit sıraları rastgele kimlikler belirliyordu.', '', '## Aynı arama neden farklı sonuç verdi?

Eşit puanları rastgele kimlikler ayırıyordu. İki pasajın puanı aynı olduğunda sıralarını, belge alınırken üretilen UUID belirliyordu. Bu yüzden aynı 141 belgeyle ayrı ayrı kurulan iki depo bazı pasajları farklı sıraladı. Benchmark v2 dev bölümünde (Tier M, modeller kapalı) depolardan biri Hit@5’te 48/112, diğeri 52/112 aldı.

Çözüm, eşitliği içeriğin kalıcı kimliğiyle bozmak oldu. PyPI’da yayımlanan MESA 0.9.4 paketiyle bağımsız kurulan iki depo, denenen üç yapılandırmanın hepsinde 128 dev sorusunun tamamı için aynı sırayı döndürdü.

## İki çalıştırma ne gösterdi?

Fark yalnızca ayrı kurulan depolar arasında çıktı. Aynı depoda aramayı tekrarlamak hiçbir şeyi değiştirmedi. Demek ki sorun sorgu anındaki bir rastgelelik değildi.

| Karşılaştırma (dev, T0, düzeltmeden önce) | Hit@5 | MRR | Sırası değişen yanıtlanabilir soru |
| --- | --- | --- | --- |
| Sıfırdan kurulan A deposu | 48/112 | 0,3314 | 49, A ve B arasında |
| Sıfırdan kurulan B deposu | 52/112 | 0,3500 | 49, A ve B arasında |
| Ortak depo, 1. çalıştırma | 50/112 | 0,3411 | 0, 1. ve 2. arasında |
| Ortak depo, 2. çalıştırma | 50/112 | 0,3411 | 0, 1. ve 2. arasında |

Hit@5 farkı, ne kadar şeyin oynadığını gizliyor. Yanıtlanabilir 49 sorunun sırası değişti. Bunların yalnızca altısı ilk 5 sınırını geçti: biri A deposunun, beşi B deposunun lehine. Net fark dört soru oldu.

> [!NOTE]
> **Kurulum**
> 0.9.4 sıralama değişikliklerinden önceki geliştirme derlemesi, çizge açık, modeller kapalı. Benchmark v2 dev bölümü, Tier M, 141 belge, 5.041 parça, 112’si yanıtlanabilir 128 soru. Arama limiti 50.

## Sıralama birleştirmede eşitlik neden oluşur?

[Reciprocal Rank Fusion (RRF)](/learn/reciprocal-rank-fusion-explained/), bir pasajı ham puanına göre değil, her listedeki sırasına göre puanlar. Sıralar tam sayı olduğu için birebir eşitlik sık görülür.

Örnek olarak k = 60 ve eşit ağırlık alalım. Yalnızca BM25’te üçüncü olan pasaj 1/(60+3) puan alır. Yalnızca bilgi kaydı (assertion) kanalında üçüncü olan pasaj da 1/(60+3) alır. Birleşik puan ikisini ayıramaz; sırayı bir sonraki sıralama anahtarı belirler.

Düzeltmeden önce bu anahtar rastgele bir UUID olabiliyordu. UUID aynı depoda değişmediği için tekrar eden çalıştırmalar aynı sonucu veriyordu. Yeni bir depo ise yeni UUID’ler üretiyor, aynı eşitlik bu kez öteki yöne çözülebiliyordu.

## Sıralamayı nasıl tekrarlanabilir yaptık?

MESA 0.9.4 iki şeyi değiştirdi. Arama kanalları ve birleştirme adımı artık eşit puanları içerik kimliğiyle ayırıyor. Katalog da kiracı (tenant) kapsamlı, belirlenimci UUID5 anahtarları üretiyor; böylece aynı derlem aynı iç anahtarları alıyor. Puanlar değişmiyor.

```text
# Sözde kod, MESA 0.9.4''ten sadeleştirildi
results = sorted(
    candidates,
    key=lambda c: (
        -c.fused_score,
        c.document_id,
        c.revision_number,
        c.chunk_ordinal,
        c.chunk_id,
    ),
)
```

Geliştirme sırasında sıfırdan kurulan bir depo çifti, 112 yanıtlanabilir sorunun 2’sinde hâlâ ayrışıyordu; ilk 5 sayısı ise değişmedi. Sonraki çiftte hiç fark kalmadı. Asıl önemli kontrol yayımlanan paketle yapıldı:

| PyPI’dan MESA 0.9.4, dev, Tier M | Aynı kalan soru | Doğru yanıt sırası farkı | Dönen sıra farkı |
| --- | --- | --- | --- |
| T0 (modeller kapalı) | 128/128 | 0 | 0 |
| T1b (bge-m3) | 128/128 | 0 | 0 |
| T2 (bge-m3 + yeniden sıralayıcı) | 128/128 | 0 | 0 |

Bu çalıştırmada 0.9.3’ün çizge ve bilgi kaydı ayarları kullanıldı. 0.9.4 varsayılanlarıyla yapılan ayrı çalıştırma da aynı sonucu verdi. Bu çalıştırmanın T1b sıraları, farklı bir LanceDB sürümünde de 128 sorunun 128’inde aynı kaldı.

## Bu, değerlendirme için neden önemli?

Dört soruluk oynama, bazı gerçek iyileştirmelerden büyüktür. Aynı geliştirme döneminde önek eşleştirmeli BM25, ortak depoda tek başına net iki soru kazandırdı. Sıfırdan kurulan depolarda bu kazancı eşitlik gürültüsünden ayırmak mümkün olmazdı.

Bu yüzden karşılaştırma yöntemimizi değiştirdik. Düzeltmeden önce değişiklikleri tek bir ortak depoda ölçtük. Düzeltmeden sonra sıfırdan depolar da kurup dönen sırayı karşılaştırıyoruz. Öncesi ve sonrası için [MESA 0.9.4’te Arama Kalitesini Ne Artırdı?](/research/what-improved-search-in-0-9-4/) yazısına bakın.

## Kendi arama sisteminizi nasıl kontrol edersiniz?

1. Aynı girdiden, ayrı konumlarda iki dizin kurun.
2. Aynı sorguları ikisinde de çalıştırın.
3. Yalnızca Hit@k veya MRR’yi değil, sıralı sonuç kimliklerini karşılaştırın.
4. Sıralar farklıysa önce eşit puanlara, sonra üretilen kimliklere, ekleme sırasına ve paralel veri alımına bakın.
5. İçerikten gelen son bir sıralama anahtarı ekleyin ve iki temiz depo kuran bir test bulundurun.

[Değerlendirme yöntemimiz](/methodology/retrieval-evaluation/), her çalıştırmayla birlikte nelerin kaydedileceğini listeler. [MRR ve nDCG dersi](/learn/evaluating-ndcg-and-mrr-in-memory/), küçük sıra değişimlerinin puanı neden etkilediğini açıklar.

## Bu sonuç neyi gösteremez?

- Tek bir Türkçe hukuk derlemini ve 128 dev sorusunu kapsar.
- Aynı derlem, paket ve ayarlar için tekrarlanabilirliği gösterir. Yeni bir belge eklemek sıraları yine değiştirebilir.
- Belirlenimci eşitlik bozma sırayı tekrarlanabilir yapar; eşit puanlı pasajları daha ilgili yapmaz.
- 49 sıra farkının kaçının hangi kanaldan geldiğini saymadık.

## Kaynaklar

1. [MESA 0.9.4 değişiklik günlüğü](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
2. [Cormack, Clarke ve Büttcher: Reciprocal Rank Fusion (SIGIR 2009)](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)
3. [RFC 9562: Universally Unique IDentifiers](https://www.rfc-editor.org/rfc/rfc9562.html)

', ARRAY['benchmark', 'determinism', 'rrf', 'evaluation']::text[], 'MESA contributors', 7, 'published', 'Aynı Arama İki Kez Neden Farklı Sonuç Verdi?', 'Aynı belgelerle kurulan iki MESA deposu 112 sorunun 49’unda ayrıştı. Rastgele eşitlik bozmanın etkisini ve çözümü anlatıyoruz.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('what-improved-search-in-0-9-4', 'research', 'en', 'What Improved MESA Search Quality in 0.9.4', 'Two modes improved on dev. The reranked mode got worse.', 'Prefix BM25 and new fusion defaults improved models-off and embedding search on dev. Reranked dev Hit@5 fell from 0.9286 to 0.9107.', '', '## Did MESA 0.9.4 improve search quality?

> [!WARNING]
> **Historical record: MESA 0.9.4**
> This post describes MESA 0.9.4 as measured in November 2026. Version 0.9.5 has since removed the graph store; see [why MESA removed its graph store](/research/why-mesa-removed-its-graph-store/) and the [benchmark page](/benchmark/) for later results.

Partly. On benchmark v2 dev, models-off search (T0) rose from Hit@5 0.4732 to 0.5446. Embedding search (T1b) rose from 0.7411 to 0.7768. Reranked search (T2), the strongest mode, fell from Hit@5 0.9286 to 0.9107, and its MRR fell from 0.8076 to 0.7945.

> [!WARNING]
> **0.9.4 is not a clean win**
> With the 0.9.4 defaults, reranked dev Hit@5 fell from 0.9286 to 0.9107, or from 104/112 to 102/112 questions (benchmark v2, Tier M, T2).

Three changes drove this: 5-character prefix matching in BM25, assertion lane weight 0, and the graph lane off by default. p95 search latency dropped in all three modes. 0.9.4 is a better default for models-off and embedding search. It is not a clean win.

| 0.9.3 → 0.9.4 defaults, dev, Tier M | MRR | Hit@5 | Search p50 (s) | Search p95 (s) |
| --- | --- | --- | --- | --- |
| T0, models off | 0.3405 → 0.3954 | 0.4732 → 0.5446 | 0.6615 → 0.3291 | 4.5369 → 0.8155 |
| T1b, bge-m3 | 0.5758 → 0.6487 | 0.7411 → 0.7768 | 1.6736 → 1.6373 | 7.0309 → 2.1655 |
| T2, bge-m3 + reranker | 0.8076 → 0.7945 | 0.9286 → 0.9107 | 2.3461 → 2.2725 | 7.8343 → 2.7771 |

> [!NOTE]
> **Setup**
> Published PyPI wheels, one Colab NVIDIA A100 80 GB runtime, evaluator v2.1, search limit 50. Benchmark v2 dev split, Tier M, 141 documents, 5,041 chunks, 128 questions. Relevance uses the 112 answerable questions; latency uses all 128. 0.9.4 defaults: graph off, assertion weight 0, BM25 weight 1, vector weight 8.

## What got worse in reranked search?

Reranked dev Hit@5 fell by two questions, from 104/112 to 102/112. Both losses were in the number, date and docket category, where Hit@5 fell from 1.0000 to 0.9429 (35/35 to 33/35). Exact, paraphrase and cross-document Hit@5 did not change.

The new defaults are the likely source. MESA 0.9.4 run with the old 0.9.3 graph and assertion settings kept T2 at Hit@5 0.9286 and MRR 0.8076. Switching to the 0.9.4 defaults produced the drop. We did not test the two settings separately at T2, so we cannot say which one caused it.

If you use reranking and depend on number, date or docket lookups, compare both settings on your own data. These variables restore the earlier fusion behavior in 0.9.4:

```text
MESA_RRF_ASSERTION_WEIGHT=1.0
MESA_GRAPH_ENABLED=true
```

Enabling the graph backfills skipped graph projections at startup. The p95 gain shown above came with the graph off, so expect slower search if you turn it back on.

## Which change helped models-off search?

We tested each change on one shared store, because [fresh stores varied by up to four questions](/research/why-two-search-runs-differed/) at that time. These runs are from a pre-release 0.9.4 development build, on a local machine, with models off. Compare the steps within this table only.

| Step, dev, T0, shared store | Hit@5 | MRR | Search p50 |
| --- | --- | --- | --- |
| Baseline | 50/112 | 0.3411 | 361.3 ms |
| + prefix BM25 | 52/112 | 0.3444 | 357.3 ms |
| + prefix, assertion weight 0 | 56/112 | 0.3529 | 351.8 ms |
| + prefix, graph off | 52/112 | 0.3535 | 182.2 ms |
| + prefix, both | 61/112 | 0.3955 | 181.4 ms |

The two lane changes interact. Starting from prefix BM25, assertion weight 0 added 4 questions and graph off added 0. Together they added 9. With models off, that combination leaves BM25 as the only fused lane. The result suggests the other two lanes were pushing good BM25 hits down.

From baseline to the final step, 14 questions entered the top 5 and 3 left it. Number/date/docket went from 17 to 22 of 35, paraphrase from 12 to 17 of 32, and cross-document from 0 to 1 of 14. Exact-wording questions stayed at 21 of 31.

See [how RRF combines lanes](/learn/reciprocal-rank-fusion-explained/) and [hybrid retrieval](/learn/hybrid-retrieval-explained/) for the mechanics.

## What did prefix matching do for Turkish?

Turkish adds suffixes to word stems, so one legal term appears in many surface forms. Exact token matching treats them as different words. MESA 0.9.4 matches the first 5 characters of query tokens that have 6 or more characters and no digits. Shorter tokens, tokens with digits and `ı` → `i` variants stay exact.

Here is an illustrative example. The query word `sözleşmesi` becomes the prefix `sözle*`. It now matches `sözleşme` and `sözleşmesinin`. It can also match different words that begin with `sözle`, such as `sözler`.

The measured gain was small: 4 questions entered the top 5 and 2 left it, for a net +2. Three of the four gains moved only from rank 6 to rank 5. One moved from rank 38 to rank 4. This is a useful but limited change. See [BM25 for domain documents](/learn/bm25-tuning-for-domain-documents/) for tuning background.

> [!NOTE]
> **What we measured in MESA**
> For the full per-question analysis, see [Why BM25 Struggles With Turkish](/research/bm25-turkish-prefix-matching/).

## Why did search get faster?

Most of the tail-latency gain came from turning off the graph lane. In the shared-store ablation, p95 fell from 2.07 s to 0.45 s with graph off.

One caveat applies to the release comparison. 0.9.4 caps LanceDB below 0.35, so it ran on 0.34.0 while the 0.9.3 run used 0.41.0. On 0.9.4 defaults at T1b, LanceDB 0.41.0 gave p50 1.2285 s against 1.6373 s on 0.34.0, with identical ranks on 128 of 128 questions. The version cap currently costs some embedding-search speed.

## What about the test split?

> [!WARNING]
> **Read these numbers with care**
> The test split has been read in six runs: three on benchmark v1 and three on v2. MESA 0.9.4 was evaluated on the v2 test split twice. Most v2 test questions were derived from the v1 test set. These results are not an independent holdout, so dev results are our main numbers.

| 0.9.3 → 0.9.4 defaults, v2 test, Tier M (173 questions, 149 answerable) | MRR | Hit@5 |
| --- | --- | --- |
| T0, models off | 0.3988 → 0.4810 | 0.5503 → 0.5772 |
| T1b, bge-m3 | 0.6198 → 0.6413 | 0.7919 → 0.8188 |
| T2, bge-m3 + reranker | 0.7867 → 0.7868 | 0.8993 → 0.8993 |

The reranked drop seen on dev did not appear in test Hit@5. Given how the split has been used, that does not cancel the dev result.

## What can these results not show?

- All results come from one Turkish legal corpus.
- With 112 answerable dev questions, one question is worth about 0.009 Hit@5. The reranked drop is two questions.
- The defaults were chosen using the same dev set, so dev gains may be optimistic.
- We did not test assertion weight and graph settings separately at T2.
- The changelog reports 50 → 61 on a shared local store. The official Colab run reports 53 → 61 (0.4732 → 0.5446). Both are valid, but they use different baselines.

> [!NOTE]
> **What we measured in MESA**
> 0.9.4 also removed two subsystems without changing dev ranks. See [what we deleted](/research/deleting-code-mesa-0-9-4/).

## Sources

1. [MESA 0.9.4 changelog](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
2. [mesa-memory 0.9.4 on PyPI](https://pypi.org/project/mesa-memory/0.9.4/)
3. [SQLite FTS5 documentation](https://www.sqlite.org/fts5.html)
4. [Cormack, Clarke and Büttcher: Reciprocal Rank Fusion (SIGIR 2009)](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)

', ARRAY['benchmark', 'bm25', 'hybrid-search', 'ablation', 'turkish']::text[], 'MESA contributors', 9, 'published', 'What Improved MESA Search Quality in 0.9.4', 'Prefix BM25 and new fusion defaults helped models-off and embedding search, but reranked dev Hit@5 fell from 0.9286 to 0.9107.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('what-improved-search-in-0-9-4', 'research', 'tr', 'MESA 0.9.4’te Arama Kalitesini Ne Artırdı?', 'Dev kümesinde iki mod iyileşti, yeniden sıralamalı mod geriledi', 'Önekli BM25 ve yeni birleştirme ayarları, modelsiz ve embedding aramasını dev kümesinde iyileştirdi. Yeniden sıralamalı dev Hit@5 ise 0,9286’dan 0,9107’ye düştü.', '', '## MESA 0.9.4 arama kalitesini artırdı mı?

> [!WARNING]
> **Tarihsel kayıt: MESA 0.9.4**
> Bu yazı, Kasım 2026’da ölçüldüğü hâliyle MESA 0.9.4’ü anlatır. 0.9.5 o zamandan beri çizge deposunu kaldırdı; sonraki sonuçlar için [MESA çizge deposunu neden kaldırdı](/research/why-mesa-removed-its-graph-store/) yazısına ve [benchmark sayfasına](/benchmark/) bakın.

Kısmen. Benchmark v2 dev bölümünde modellerin kapalı olduğu arama (T0), Hit@5’te 0,4732’den 0,5446’ya çıktı. Embedding araması (T1b) 0,7411’den 0,7768’e yükseldi. En güçlü mod olan yeniden sıralamalı arama (T2) ise Hit@5’te 0,9286’dan 0,9107’ye, MRR’de 0,8076’dan 0,7945’e düştü.

> [!WARNING]
> **0.9.4 tartışmasız bir kazanç değil**
> 0.9.4 varsayılanlarıyla yeniden sıralamalı dev Hit@5, 0,9286’dan 0,9107’ye, yani 104/112 sorudan 102/112 soruya düştü (benchmark v2, Tier M, T2).

Bu sonucu üç değişiklik belirledi: BM25’te 5 karakterlik önek eşleştirme, bilgi kaydı (assertion) kanalının ağırlığının 0 olması ve çizge kanalının varsayılan olarak kapanması. Üç modda da p95 arama süresi düştü. 0.9.4, modelsiz ve embedding araması için daha iyi bir varsayılandır; ama tartışmasız bir kazanç değildir.

| 0.9.3 → 0.9.4 varsayılanları, dev, Tier M | MRR | Hit@5 | Arama p50 (sn) | Arama p95 (sn) |
| --- | --- | --- | --- | --- |
| T0, modeller kapalı | 0,3405 → 0,3954 | 0,4732 → 0,5446 | 0,6615 → 0,3291 | 4,5369 → 0,8155 |
| T1b, bge-m3 | 0,5758 → 0,6487 | 0,7411 → 0,7768 | 1,6736 → 1,6373 | 7,0309 → 2,1655 |
| T2, bge-m3 + yeniden sıralayıcı | 0,8076 → 0,7945 | 0,9286 → 0,9107 | 2,3461 → 2,2725 | 7,8343 → 2,7771 |

> [!NOTE]
> **Kurulum**
> PyPI’da yayımlanan paketler, tek bir Colab NVIDIA A100 80 GB ortamı, değerlendirici v2.1, arama limiti 50. Benchmark v2 dev bölümü, Tier M, 141 belge, 5.041 parça, 128 soru. İlgililik ölçümleri 112 yanıtlanabilir soruyu, gecikme ölçümleri 128 sorunun tamamını kullanır. 0.9.4 varsayılanları: çizge kapalı, bilgi kaydı ağırlığı 0, BM25 ağırlığı 1, vektör ağırlığı 8.

## Yeniden sıralamalı aramada ne kötüleşti?

Yeniden sıralamalı dev Hit@5 iki soru geriledi: 104/112’den 102/112’ye. İki kayıp da sayı, tarih ve esas numarası kategorisinde oldu; bu kategoride Hit@5 1,0000’den 0,9429’a indi (35/35’ten 33/35’e). Birebir ifade, yeniden ifade ve çok belgeli sorularda Hit@5 değişmedi.

Düşüşün kaynağı büyük olasılıkla yeni varsayılanlar. MESA 0.9.4, eski 0.9.3 çizge ve bilgi kaydı ayarlarıyla çalıştırıldığında T2 Hit@5 0,9286, MRR 0,8076 olarak kaldı. 0.9.4 varsayılanlarına geçince düşüş görüldü. T2’de iki ayarı ayrı ayrı denemedik; bu yüzden hangisinin neden olduğunu söyleyemiyoruz.

Yeniden sıralama kullanıyor ve sayı, tarih ya da esas numarası aramalarına güveniyorsanız iki ayarı kendi verinizde karşılaştırın. Şu değişkenler 0.9.4’te önceki birleştirme davranışını geri getirir:

```text
MESA_RRF_ASSERTION_WEIGHT=1.0
MESA_GRAPH_ENABLED=true
```

Çizgeyi açmak, başlangıçta atlanmış çizge projeksiyonlarını tamamlar. Yukarıdaki p95 kazancı çizge kapalıyken elde edildi; yeniden açarsanız aramanın yavaşlamasını bekleyin.

## Modelsiz aramayı hangi değişiklik iyileştirdi?

Her değişikliği tek bir ortak depoda denedik; çünkü o dönemde [sıfırdan kurulan depolar dört soruya kadar oynuyordu](/research/why-two-search-runs-differed/). Bu çalıştırmalar, modeller kapalıyken yerel bir makinede, 0.9.4 öncesi geliştirme derlemesiyle yapıldı. Adımları yalnızca bu tablo içinde karşılaştırın.

| Adım, dev, T0, ortak depo | Hit@5 | MRR | Arama p50 |
| --- | --- | --- | --- |
| Başlangıç | 50/112 | 0,3411 | 361,3 ms |
| + önekli BM25 | 52/112 | 0,3444 | 357,3 ms |
| + önek, bilgi kaydı ağırlığı 0 | 56/112 | 0,3529 | 351,8 ms |
| + önek, çizge kapalı | 52/112 | 0,3535 | 182,2 ms |
| + önek, ikisi birlikte | 61/112 | 0,3955 | 181,4 ms |

İki kanal değişikliği birbirini etkiliyor. Önekli BM25’ten başlayınca bilgi kaydı ağırlığını 0 yapmak 4 soru, çizgeyi kapatmak 0 soru ekledi. İkisi birlikte 9 soru ekledi. Modeller kapalıyken bu birleşim, BM25’i birleştirilen tek kanal olarak bırakıyor. Sonuç, diğer iki kanalın iyi BM25 sonuçlarını aşağı ittiğini düşündürüyor.

Başlangıçtan son adıma 14 soru ilk 5’e girdi, 3 soru çıktı. Sayı/tarih/esas sorularında 35’te 17’den 22’ye, yeniden ifade sorularında 32’de 12’den 17’ye, çok belgeli sorularda 14’te 0’dan 1’e çıkıldı. Birebir ifade soruları 31’de 21’de kaldı.

İşleyişi görmek için [RRF’nin kanalları nasıl birleştirdiğine](/learn/reciprocal-rank-fusion-explained/) ve [hibrit aramaya](/learn/hybrid-retrieval-explained/) bakın.

## Önek eşleştirme Türkçede ne işe yaradı?

Türkçe sözcük köklerine ek alır; bu yüzden tek bir hukuk terimi metinde pek çok biçimde görünür. Birebir token eşleştirme bunları farklı sözcükler sayar. MESA 0.9.4, 6 veya daha uzun olan ve rakam içermeyen sorgu token’larının ilk 5 karakterini eşleştirir. Daha kısa token’lar, rakamlı token’lar ve `ı` → `i` varyantları birebir kalır.

Örnek olarak sorgudaki `sözleşmesi` sözcüğü `sözle*` önekine dönüşür. Böylece `sözleşme` ve `sözleşmesinin` biçimleriyle eşleşir. Aynı önek, `sözler` gibi `sözle` ile başlayan ilgisiz sözcükleri de yakalayabilir.

Ölçülen kazanç küçük: 4 soru ilk 5’e girdi, 2 soru çıktı; net +2. Dört kazancın üçü yalnızca 6. sıradan 5. sıraya geçti. Biri ise 38. sıradan 4. sıraya çıktı. Yararlı ama sınırlı bir değişiklik. Ayar konusunda [alan belgeleri için BM25](/learn/bm25-tuning-for-domain-documents/) dersine bakabilirsiniz.

> [!NOTE]
> **MESA’da ne ölçtük?**
> Soru başına tam analiz için [Türkçe Metinlerde BM25 Neden Zorlanır?](/research/bm25-turkish-prefix-matching/) yazısına bakın.

## Arama neden hızlandı?

Uç gecikmedeki kazancın çoğu çizge kanalını kapatmaktan geldi. Ortak depodaki ablasyon testinde çizge kapanınca p95, 2,07 sn’den 0,45 sn’ye indi.

Sürüm karşılaştırmasında bir uyarı gerekiyor. 0.9.4, LanceDB’yi 0.35’in altında tutar; bu yüzden 0.34.0 ile çalıştı, 0.9.3 çalıştırması ise 0.41.0 kullandı. 0.9.4 varsayılanlarıyla T1b’de LanceDB 0.41.0, 0.34.0’daki 1,6373 sn’ye karşı 1,2285 sn p50 verdi ve 128 sorunun 128’inde sıralar aynı kaldı. Sürüm sınırı şu anda embedding aramasından bir miktar hız götürüyor.

## Test bölümünde durum ne?

> [!WARNING]
> **Bu sayıları dikkatle okuyun**
> Test bölümü altı çalıştırmada okundu: üçü benchmark v1, üçü v2 üzerinde. MESA 0.9.4, v2 test bölümünde iki kez değerlendirildi. v2 test sorularının çoğu v1 test kümesinden türetildi. Bu sonuçlar bağımsız bir sınama değildir; ana sayılarımız dev sonuçlarıdır.

| 0.9.3 → 0.9.4 varsayılanları, v2 test, Tier M (173 soru, 149’u yanıtlanabilir) | MRR | Hit@5 |
| --- | --- | --- |
| T0, modeller kapalı | 0,3988 → 0,4810 | 0,5503 → 0,5772 |
| T1b, bge-m3 | 0,6198 → 0,6413 | 0,7919 → 0,8188 |
| T2, bge-m3 + yeniden sıralayıcı | 0,7867 → 0,7868 | 0,8993 → 0,8993 |

Dev’de görülen yeniden sıralama düşüşü test Hit@5’te görünmedi. Bu bölümün geçmişi düşünüldüğünde bu, dev sonucunu ortadan kaldırmaz.

## Bu sonuçlar neyi gösteremez?

- Tüm sonuçlar tek bir Türkçe hukuk derleminden geliyor.
- 112 yanıtlanabilir dev sorusunda bir soru yaklaşık 0,009 Hit@5 eder. Yeniden sıralamalı düşüş iki sorudur.
- Varsayılanlar aynı dev kümesiyle seçildi; dev kazançları olduğundan iyi görünebilir.
- T2’de bilgi kaydı ağırlığı ve çizge ayarlarını ayrı ayrı denemedik.
- Değişiklik günlüğü, ortak yerel depoda 50 → 61 bildirir. Resmî Colab çalıştırması 53 → 61 (0,4732 → 0,5446) verir. İkisi de doğrudur, ama başlangıç noktaları farklıdır.

> [!NOTE]
> **MESA’da ne ölçtük?**
> 0.9.4, dev sıralarını değiştirmeden iki alt sistemi de kaldırdı. [Neleri sildiğimize](/research/deleting-code-mesa-0-9-4/) bakın.

## Kaynaklar

1. [MESA 0.9.4 değişiklik günlüğü](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
2. [PyPI’da mesa-memory 0.9.4](https://pypi.org/project/mesa-memory/0.9.4/)
3. [SQLite FTS5 belgeleri](https://www.sqlite.org/fts5.html)
4. [Cormack, Clarke ve Büttcher: Reciprocal Rank Fusion (SIGIR 2009)](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)

', ARRAY['benchmark', 'bm25', 'hybrid-search', 'ablation', 'turkish']::text[], 'MESA contributors', 9, 'published', 'MESA 0.9.4’te Arama Kalitesini Ne Artırdı?', 'Önekli BM25 ve yeni birleştirme ayarları iki modu iyileştirdi; yeniden sıralamalı dev Hit@5 ise 0,9286’dan 0,9107’ye düştü.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('turkish-legal-benchmark-v2', 'research', 'en', 'How We Built a Turkish Legal Retrieval Benchmark', 'What we rebuilt, how we score it, and where it falls short', 'Benchmark v2 rebuilt 246 older questions into 128 dev and 173 test questions with verbatim evidence. Its test split has been read six times, so dev results come first.', '', '## How did we build the benchmark?

We reviewed all 246 questions from benchmark v1 and found that many depended on missing context or on phrases that appeared in several places. We rewrote or rebuilt most of them, dropped 39, added open-style questions, and tied every answer to a verbatim quote in a source file. The result has 128 dev questions and 173 test questions over Turkish legal documents.

> [!WARNING]
> **The test split is not an independent holdout**
> It has been read in six MESA runs, and most v2 test questions derive from a v1 test set that had already been read. We report dev results as our main numbers. Test results appear only with this caveat.

## Why was the first benchmark not good enough?

Mechanical checks over all 246 v1 questions showed that a correct passage could be hard to define:

| Check on v1 questions | Dev | Test | Total |
| --- | --- | --- | --- |
| Wording depends on context and was flagged | 40 | 54 | 94 |
| Expected phrase also occurs in another file | 37 | 48 | 85 |
| Expected phrase occurs in 10 or more other files | 14 | 19 | 33 |
| Expected phrase repeats inside its own file | 25 | 39 | 64 |

A question such as "what does this regulation say" has no answer without knowing which regulation. A short phrase that repeats across files can also give credit to the wrong passage. In the worst case, one phrase repeated 172 times within a single file.

## What changed from v1 to v2?

| Review action on v1 questions | Dev | Test | Total |
| --- | --- | --- | --- |
| Rewritten | 73 | 104 | 177 |
| Rebuilt | 13 | 17 | 30 |
| Dropped | 15 | 24 | 39 |
| Kept unchanged | 0 | 0 | 0 |

The review first produced 207 questions. We then added open-style questions and applied a further correction pass. The final v2 set looks like this:

| Category | Dev | Test |
| --- | --- | --- |
| Exact wording | 31 | 39 |
| Number, date, docket | 35 | 46 |
| Paraphrase | 32 | 48 |
| Cross-document | 14 | 16 |
| No answer in corpus | 16 | 24 |
| Total | 128 | 173 |

## What makes a question valid?

- A question names its source when the answer depends on it. Law names carry their numbers, and decisions carry court, docket and decision numbers.
- Each answer has a verbatim quote of at most 200 characters that occurs once in the full corpus after Turkish normalization.
- Cross-document questions name two sources and require one passage from each.
- No-answer questions were checked against 33,954 indexed windows from all 182 documents, using at least two query variants.
- Automated validation rejects overlapping gold spans between dev and test.

## What is an open-style question?

Named questions tell the system which law to use. Open-style questions describe a situation, as a person would. Here is a real pair from the dev split:

> [!NOTE]
> **Named**
> 6098 sayılı Türk Borçlar Kanunu uyarınca, aralıksız evde çalışan işçinin hazırladığı ürünü işveren teslim almada temerrüde düşerse işçinin ücretini ödeme borcu sürer mi?

> [!NOTE]
> **Open**
> Evde sürekli parça başı üretim yapıyorum. İşveren hazırladığım ürünleri teslim almada temerrüde düşerse ücretimi yine de ödemek zorunda mı?

Both point to the same evidence. That makes the pair useful for testing wording, but it also means the two results are not independent.

## How are results scored?

A hit must come from the correct file. It then counts if it contains the normalized answer quote, or if it overlaps the quote by at least 60 characters or by the quote''s full length when the quote is shorter. A passage from the right article that lacks the evidence earns no passage credit.

For cross-document questions, the rank is the position at which all required passages have appeared. See the [MRR and nDCG lesson](/learn/evaluating-ndcg-and-mrr-in-memory/) for how the metrics behave.

| Configuration | What runs |
| --- | --- |
| T0 | Models off, lexical search |
| T1b | T0 plus normalized BAAI/bge-m3 embeddings |
| T2 | T1b plus BAAI/bge-reranker-v2-m3 |

## How is a run performed?

1. Install the published package from PyPI.
2. Create a fresh store for each configuration on one Colab NVIDIA A100 80 GB runtime.
3. Ingest Tier M: 141 documents, 5,041 chunks.
4. Run dev twice on independently built stores and compare the returned order.
5. Save the dev report locally before the test file is uploaded.
6. Run test once per configuration.

The evaluator exits if a test file is passed without an explicit `--split test`. We added the two-store comparison after [random tie-breaks changed results between stores](/research/why-two-search-runs-differed/).

## How many times was the test split read?

Six runs read a test split. The process above limits accidental use, but it cannot undo repeated reads.

| Run date | Question set | MESA run |
| --- | --- | --- |
| 2026-10-29 | v1 | 0.9.0 experiments |
| 2026-11-07 | v1 | 0.9.2 release |
| 2026-11-17 | v1 | 0.9.3 release |
| 2026-11-21 | v2 | 0.9.3 reference |
| 2026-11-23 | v2 | 0.9.4 with 0.9.3 settings |
| 2026-11-23 | v2 | 0.9.4 release defaults |

The second 0.9.4 read happened because the first run did not use the release defaults. Those defaults were committed before the first v2 test read, but later development followed that read. For measured results, see [What Improved MESA Search Quality in 0.9.4](/research/what-improved-search-in-0-9-4/).

## What can this benchmark not show?

- Annotation had a review pass and an evidence spot check, but no independent agreement measure.
- It covers one snapshot of Turkish legal text. A no-answer label applies to this snapshot only.
- Lexical review can miss answers that are stated indirectly or distorted by OCR.
- Some source PDFs split words or insert page numbers, and those artifacts remain.
- Cross-document results rest on only 14 dev questions.
- The question files and evaluator are not public yet, so outside teams cannot rerun it.

## Sources

1. [SQLite FTS5 documentation](https://www.sqlite.org/fts5.html)
2. [MESA 0.9.4 changelog](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
3. [Manning, Raghavan and Schütze: Introduction to Information Retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html)

', ARRAY['benchmark', 'evaluation', 'turkish', 'legal-search']::text[], 'MESA contributors', 9, 'published', 'How We Built a Turkish Legal Retrieval Benchmark', 'How MESA rebuilt 246 Turkish legal questions into benchmark v2, how runs are scored, and why its test split is no longer an independent holdout.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('turkish-legal-benchmark-v2', 'research', 'tr', 'Türkçe Hukuk Arama Benchmark’ı Nasıl Kurulur?', 'Neyi yeniden kurduk, nasıl puanlıyoruz, nerede eksik kalıyor?', 'Benchmark v2, eski 246 soruyu birebir kanıtlı 128 dev ve 173 test sorusuna dönüştürdü. Test bölümü altı kez okunduğu için ana sonuçlarımız dev bölümünden gelir.', '', '## Benchmark’ı nasıl kurduk?

Benchmark v1’deki 246 sorunun tamamını inceledik. Birçoğu eksik bağlama ya da birden çok yerde geçen ifadelere dayanıyordu. Soruların çoğunu yeniden yazdık veya yeniden kurduk, 39’unu çıkardık, açık uçlu sorular ekledik ve her yanıtı kaynak dosyadaki birebir bir alıntıya bağladık. Sonuçta Türkçe hukuk belgeleri üzerinde 128 dev ve 173 test sorusu oluştu.

> [!WARNING]
> **Test bölümü bağımsız bir sınama değil**
> Bu bölüm altı MESA çalıştırmasında okundu. v2 test sorularının çoğu da daha önce okunmuş v1 test kümesinden türetildi. Ana sayılarımız dev sonuçlarıdır; test sonuçlarını yalnızca bu uyarıyla veriyoruz.

## İlk benchmark neden yetersiz kaldı?

246 v1 sorusu üzerindeki otomatik kontroller, doğru pasajı tanımlamanın çoğu zaman zor olduğunu gösterdi:

| v1 soruları üzerindeki kontrol | Dev | Test | Toplam |
| --- | --- | --- | --- |
| İfade bağlama dayanıyor ve işaretlendi | 40 | 54 | 94 |
| Beklenen ifade başka bir dosyada da geçiyor | 37 | 48 | 85 |
| Beklenen ifade 10 veya daha çok başka dosyada geçiyor | 14 | 19 | 33 |
| Beklenen ifade kendi dosyasında tekrar ediyor | 25 | 39 | 64 |

“Bu yönetmelik ne diyor?” gibi bir soru, hangi yönetmelik olduğu bilinmeden yanıtlanamaz. Dosyalarda tekrar eden kısa bir ifade de yanlış pasaja puan kazandırabilir. En uç örnekte bir ifade tek dosyada 172 kez geçiyordu.

## v1’den v2’ye ne değişti?

| v1 soruları için inceleme kararı | Dev | Test | Toplam |
| --- | --- | --- | --- |
| Yeniden yazıldı | 73 | 104 | 177 |
| Yeniden kuruldu | 13 | 17 | 30 |
| Çıkarıldı | 15 | 24 | 39 |
| Değişmeden kaldı | 0 | 0 | 0 |

İnceleme önce 207 soru üretti. Ardından açık uçlu sorular ekledik ve bir düzeltme turu daha yaptık. Son v2 kümesi şöyle:

| Kategori | Dev | Test |
| --- | --- | --- |
| Birebir ifade | 31 | 39 |
| Sayı, tarih, esas no | 35 | 46 |
| Yeniden ifade | 32 | 48 |
| Çok belgeli | 14 | 16 |
| Derlemde yanıtı yok | 16 | 24 |
| Toplam | 128 | 173 |

## Bir soru hangi koşullarda geçerli sayılır?

- Yanıt kaynağa bağlıysa soru kaynağın adını verir. Kanun adları numarasıyla, kararlar mahkeme, esas ve karar numarasıyla yazılır.
- Her yanıtın en çok 200 karakterlik birebir bir alıntısı vardır; bu alıntı Türkçe normalizasyondan sonra tüm derlemde bir kez geçer.
- Çok belgeli sorular iki kaynağı adıyla anar ve her birinden bir pasaj ister.
- Yanıtı olmayan sorular, 182 belgenin tamamından çıkarılan 33.954 pencere üzerinde en az iki sorgu çeşidiyle denetlendi.
- Otomatik doğrulama, dev ve test arasında çakışan doğru yanıt aralıklarını reddeder.

## Açık uçlu soru nedir?

Adı belirtilen sorular sisteme hangi kanuna bakacağını söyler. Açık uçlu sorular ise bir insanın anlatacağı gibi durumu tarif eder. Dev bölümünden gerçek bir çift:

> [!NOTE]
> **Adı belirtilen**
> 6098 sayılı Türk Borçlar Kanunu uyarınca, aralıksız evde çalışan işçinin hazırladığı ürünü işveren teslim almada temerrüde düşerse işçinin ücretini ödeme borcu sürer mi?

> [!NOTE]
> **Açık uçlu**
> Evde sürekli parça başı üretim yapıyorum. İşveren hazırladığım ürünleri teslim almada temerrüde düşerse ücretimi yine de ödemek zorunda mı?

İkisi de aynı kanıta dayanır. Bu, ifade farkını sınamak için yararlıdır; ama iki sonucun birbirinden bağımsız olmadığı anlamına da gelir.

## Sonuçlar nasıl puanlanıyor?

İsabet sayılması için sonuç doğru dosyadan gelmelidir. Ardından normalize edilmiş alıntıyı içeriyorsa ya da alıntıyla en az 60 karakter örtüşüyorsa geçerli olur; alıntı daha kısaysa tamamıyla örtüşmesi gerekir. Doğru maddeden gelen ama kanıtı içermeyen pasaj puan almaz.

Çok belgeli sorularda sıra, gerekli pasajların tamamının göründüğü konumdur. Ölçütlerin davranışı için [MRR ve nDCG dersine](/learn/evaluating-ndcg-and-mrr-in-memory/) bakın.

| Yapılandırma | Ne çalışıyor? |
| --- | --- |
| T0 | Modeller kapalı, sözcük tabanlı arama |
| T1b | T0’a ek olarak normalize BAAI/bge-m3 gömme vektörleri |
| T2 | T1b’ye ek olarak BAAI/bge-reranker-v2-m3 |

## Bir çalıştırma nasıl yapılıyor?

1. Yayımlanan paketi PyPI’dan kurun.
2. Tek bir Colab NVIDIA A100 80 GB ortamında her yapılandırma için yeni bir depo oluşturun.
3. Tier M’yi alın: 141 belge, 5.041 parça.
4. Dev bölümünü bağımsız kurulan iki depoda çalıştırıp dönen sırayı karşılaştırın.
5. Test dosyası yüklenmeden önce dev raporunu yerelde kaydedin.
6. Testi her yapılandırma için bir kez çalıştırın.

Değerlendirici, açıkça `--split test` verilmeden test dosyası alırsa durur. İki depolu karşılaştırmayı, [rastgele eşitlik bozmanın depolar arasında sonucu değiştirdiğini](/research/why-two-search-runs-differed/) gördükten sonra ekledik.

## Test bölümü kaç kez okundu?

Altı çalıştırma bir test bölümünü okudu. Yukarıdaki süreç yanlışlıkla kullanımı sınırlar; ama tekrar eden okumaları geri alamaz.

| Çalıştırma tarihi | Soru kümesi | MESA çalıştırması |
| --- | --- | --- |
| 2026-10-29 | v1 | 0.9.0 deneyleri |
| 2026-11-07 | v1 | 0.9.2 sürümü |
| 2026-11-17 | v1 | 0.9.3 sürümü |
| 2026-11-21 | v2 | 0.9.3 referansı |
| 2026-11-23 | v2 | 0.9.3 ayarlarıyla 0.9.4 |
| 2026-11-23 | v2 | 0.9.4 sürüm varsayılanları |

İkinci 0.9.4 okuması, ilk çalıştırma sürüm varsayılanlarını kullanmadığı için yapıldı. Bu varsayılanlar ilk v2 test okumasından önce işlenmişti; ama sonraki geliştirme o okumadan sonra sürdü. Ölçülen sonuçlar için [MESA 0.9.4’te Arama Kalitesini Ne Artırdı?](/research/what-improved-search-in-0-9-4/) yazısına bakın.

## Bu benchmark neyi gösteremez?

- Etiketleme bir inceleme turu ve kanıt örneklemesinden geçti; bağımsız uyum ölçümü yapılmadı.
- Türkçe hukuk metinlerinin tek bir anlık görüntüsünü kapsar. “Yanıt yok” etiketi yalnızca bu görüntü için geçerlidir.
- Sözcük tabanlı inceleme, dolaylı anlatılan veya OCR ile bozulan yanıtları kaçırabilir.
- Bazı kaynak PDF’ler sözcükleri böler ya da sayfa numarası ekler; bu izler metinde kalır.
- Çok belgeli sonuçlar yalnızca 14 dev sorusuna dayanır.
- Soru dosyaları ve değerlendirici henüz açık değil; dış ekipler yeniden çalıştıramaz.

## Kaynaklar

1. [SQLite FTS5 belgeleri](https://www.sqlite.org/fts5.html)
2. [MESA 0.9.4 değişiklik günlüğü](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
3. [Manning, Raghavan ve Schütze: Introduction to Information Retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html)

', ARRAY['benchmark', 'evaluation', 'turkish', 'legal-search']::text[], 'MESA contributors', 9, 'published', 'Türkçe Hukuk Arama Benchmark’ı Nasıl Kurulur?', 'MESA’nın 246 hukuk sorusunu nasıl yeniden kurduğunu, sonuçları nasıl puanladığını ve test bölümünün neden bağımsız sayılmadığını okuyun.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('deleting-code-mesa-0-9-4', 'research', 'en', 'What We Deleted From MESA, and Why', 'Removing two subsystems without changing a search rank', 'MESA 0.9.4 removed the legacy pre-V4 node store and model-based fact merging. Runtime Python fell from 48,591 to 42,541 lines, and dev search ranks stayed identical after each removal.', '', '## What did we remove from MESA?

> [!WARNING]
> **Historical record: MESA 0.9.4**
> This post describes MESA 0.9.4 as measured in November 2026. Version 0.9.5 has since removed the graph store; see [why MESA removed its graph store](/research/why-mesa-removed-its-graph-store/) and the [benchmark page](/benchmark/) for later results.

MESA 0.9.4 removed the legacy V3 node store, the LLM consolidation subsystem and related settings. Runtime Python code fell from 48,591 to 42,541 lines, a drop of 6,050 lines or 12.5%. Settings read through the main config fell from 68 to 54.

We checked each removal against benchmark v2 dev with models off. All 128 questions kept the same passage and document ranks after every step.

## What exactly was deleted?

| Area | Lines removed | Lines added |
| --- | --- | --- |
| `mesa_storage/dao.py` (V3 node, purge and WAL methods) | 2,307 | 211 |
| `consolidation/loop.py` | 1,179 | 0 |
| `mesa_storage/vector_engine.py` (soft-delete, Procrustes) | 590 | 1 |
| `consolidation/router.py` | 392 | 0 |
| `consolidation/validator.py` | 286 | 0 |
| `consolidation/parser.py` | 271 | 0 |
| `consolidation/policy.py` | 173 | 0 |

| Scope, v0.9.3 → v0.9.4 | Files changed | Added | Removed |
| --- | --- | --- | --- |
| Runtime packages | 40 | 599 | 6,667 |
| Tests | 88 | 2,672 | 7,887 |
| Whole repository | 149 | 3,523 | 14,737 |

Five database structures also went away: the V3 tables `nodes`, `nodes_fts`, `lancedb_wal`, `purge_journal` and `system_config`. A later migration dropped `routing_telemetry`.

## Why did we delete working code?

Neither subsystem was part of the default document and search flow. MESA''s document and search flow runs on the V4 tables, so the V3 store had become a second storage model to keep correct. Default validation was already deterministic (Mode 0), and in 0.9.3 finishing a session in that mode did not need a consolidation loop.

Keeping them still had a cost. Each path needed tests, documentation, settings and security review. A setting that few runs exercise can also fail quietly. Removing a subsystem turns that ongoing cost into a one-time migration.

## How did we check that search did not change?

We ran the full dev set before and after each removal, on a shared store with models off.

| Removal step, dev, T0 | Hit@5 before → after | MRR before → after | Questions with changed rank |
| --- | --- | --- | --- |
| V3 node store | 61/112 → 61/112 | 0.3955 → 0.3955 | 0 of 128 |
| LLM consolidation | 61/112 → 61/112 | 0.3955 → 0.3955 | 0 of 128 |
| Unused scaffolding | 61/112 → 61/112 | 0.3955 → 0.3955 | 0 of 128 |

We compared per-question ranks as well as averages, because [an average can hide rank changes](/research/why-two-search-runs-differed/). Median latency across these runs ranged from 178 ms to 315 ms with no consistent direction, so we make no speed claim from these removals.

## What happens to the removed settings?

MESA 0.9.4 retires 20 environment variables, including `MESA_TIER3_MODE`, `MESA_USE_V4` and `CONSOLIDATION_BATCH_SIZE`. If one is still set, MESA logs one warning for that key at startup and ignores it. An old configuration file therefore does not stop the server.

See the [configuration guide](/docs/core/configuration/) for current settings and the [migration guide](/docs/core/migration/) before upgrading.

## What did deleting cost?

- The storage migrations are forward-only. To go back, you need a store snapshot from before the upgrade and MESA 0.9.3.
- LLM validator modes 1 and 2 no longer exist.
- Tests were deleted along with the code. Security and durability contract tests for the old path were ported to V4 first.
- Optional fact extraction remains, through `MESA_EXTRACTION_ENABLED=true`.

The [SQLite lesson](/learn/sqlite-as-canonical-agent-memory/) explains why MESA keeps one canonical store.

## What can this result not show?

- The rank checks cover T0 on dev. They do not separately prove unchanged ranks for embedding or reranked search.
- They ran on development builds. The final 0.9.4 quality changes are covered in [a separate post](/research/what-improved-search-in-0-9-4/).
- Fewer lines do not prove better code.
- MESA has no production users yet, so this work has not been tested by real upgrades.

## Sources

1. [MESA 0.9.4 changelog](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
2. [v0.9.3 to v0.9.4 comparison](https://github.com/Yasou13/MESA/compare/v0.9.3...v0.9.4)

', ARRAY['engineering', 'maintenance', 'configuration', 'release']::text[], 'MESA contributors', 6, 'published', 'What We Deleted From MESA, and Why', 'MESA 0.9.4 removed the V3 store and LLM consolidation, cutting 6,050 Python lines. Dev search ranks stayed identical after each removal.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('deleting-code-mesa-0-9-4', 'research', 'tr', 'MESA’dan Neleri Sildik, Neden?', 'Tek bir arama sırası değişmeden iki alt sistemi kaldırmak', 'MESA 0.9.4, V4 öncesinden kalan düğüm deposunu ve model tabanlı bilgi birleştirmeyi kaldırdı. Çalışan Python kodu 48.591 satırdan 42.541’e indi; dev arama sıraları her silmeden sonra aynı kaldı.', '', '## MESA’dan neleri kaldırdık?

> [!WARNING]
> **Tarihsel kayıt: MESA 0.9.4**
> Bu yazı, Kasım 2026’da ölçüldüğü hâliyle MESA 0.9.4’ü anlatır. 0.9.5 o zamandan beri çizge deposunu kaldırdı; sonraki sonuçlar için [MESA çizge deposunu neden kaldırdı](/research/why-mesa-removed-its-graph-store/) yazısına ve [benchmark sayfasına](/benchmark/) bakın.

MESA 0.9.4, eski V3 düğüm deposunu, LLM birleştirme (consolidation) alt sistemini ve bunlara bağlı ayarları kaldırdı. Çalışan Python kodu 48.591 satırdan 42.541 satıra indi; yani 6.050 satır, %12,5 azaldı. Ana yapılandırmanın okuduğu ayar sayısı 68’den 54’e düştü.

Her silmeyi modeller kapalıyken benchmark v2 dev bölümüyle denetledik. 128 sorunun tamamı her adımdan sonra aynı pasaj ve belge sırasını korudu.

## Tam olarak neler silindi?

| Alan | Silinen satır | Eklenen satır |
| --- | --- | --- |
| `mesa_storage/dao.py` (V3 düğüm, temizleme ve WAL yöntemleri) | 2.307 | 211 |
| `consolidation/loop.py` | 1.179 | 0 |
| `mesa_storage/vector_engine.py` (geçici silme, Procrustes) | 590 | 1 |
| `consolidation/router.py` | 392 | 0 |
| `consolidation/validator.py` | 286 | 0 |
| `consolidation/parser.py` | 271 | 0 |
| `consolidation/policy.py` | 173 | 0 |

| Kapsam, v0.9.3 → v0.9.4 | Değişen dosya | Eklenen | Silinen |
| --- | --- | --- | --- |
| Çalışan paketler | 40 | 599 | 6.667 |
| Testler | 88 | 2.672 | 7.887 |
| Tüm depo | 149 | 3.523 | 14.737 |

Beş veritabanı yapısı da kaldırıldı: V3’ün `nodes`, `nodes_fts`, `lancedb_wal`, `purge_journal` ve `system_config` tabloları. Sonraki bir geçiş `routing_telemetry` tablosunu da sildi.

## Çalışan kodu neden sildik?

İki alt sistem de varsayılan belge ve arama akışının parçası değildi. MESA’nın belge ve arama akışı V4 tablolarını kullanıyor; V3 deposu doğru tutulması gereken ikinci bir depolama modeline dönüşmüştü. Varsayılan doğrulama zaten kurallara dayanıyordu (Mode 0) ve 0.9.3’te bu modda oturumu bitirmek için birleştirme döngüsü gerekmiyordu.

Yine de bu kodları tutmanın bir bedeli vardı. Her yol test, belge, ayar ve güvenlik incelemesi istiyordu. Az çalıştırılan bir ayar sessizce bozulabilir. Bir alt sistemi kaldırmak, bu sürekli maliyeti tek seferlik bir geçişe çevirir.

## Aramanın değişmediğini nasıl denetledik?

Her silmeden önce ve sonra, modeller kapalıyken ortak bir depoda tüm dev kümesini çalıştırdık.

| Silme adımı, dev, T0 | Hit@5 önce → sonra | MRR önce → sonra | Sırası değişen soru |
| --- | --- | --- | --- |
| V3 düğüm deposu | 61/112 → 61/112 | 0,3955 → 0,3955 | 128’de 0 |
| LLM birleştirme | 61/112 → 61/112 | 0,3955 → 0,3955 | 128’de 0 |
| Kullanılmayan iskelet kod | 61/112 → 61/112 | 0,3955 → 0,3955 | 128’de 0 |

Yalnızca ortalamaları değil, soru başına sıraları da karşılaştırdık; çünkü [ortalama, sıra değişimlerini gizleyebilir](/research/why-two-search-runs-differed/). Bu çalıştırmalarda ortanca gecikme 178 ms ile 315 ms arasında, belirli bir yön izlemeden değişti. Bu yüzden silmelerden hız iddiası çıkarmıyoruz.

## Kaldırılan ayarlara ne oluyor?

MESA 0.9.4, aralarında `MESA_TIER3_MODE`, `MESA_USE_V4` ve `CONSOLIDATION_BATCH_SIZE` olan 20 ortam değişkenini emekli etti. Biri hâlâ tanımlıysa MESA başlangıçta o anahtar için bir kez uyarı yazar ve ayarı yok sayar. Yani eski yapılandırma dosyası sunucuyu durdurmaz.

Güncel ayarlar için [yapılandırma rehberine](/docs/core/configuration/), yükseltmeden önce [geçiş rehberine](/docs/core/migration/) bakın.

## Silmenin bedeli neydi?

- Depolama geçişleri yalnızca ileri yönlüdür. Geri dönmek için yükseltme öncesi depo kopyası ve MESA 0.9.3 gerekir.
- LLM doğrulayıcı modları 1 ve 2 artık yok.
- Kodla birlikte testler de silindi. Eski yolun güvenlik ve dayanıklılık sözleşme testleri önce V4’e taşındı.
- İsteğe bağlı bilgi çıkarımı `MESA_EXTRACTION_ENABLED=true` ile duruyor.

[SQLite dersi](/learn/sqlite-as-canonical-agent-memory/), MESA’nın neden tek bir ana depo tuttuğunu anlatır.

## Bu sonuç neyi gösteremez?

- Sıra kontrolleri dev bölümündeki T0’ı kapsar. Embedding veya yeniden sıralamalı aramanın sırasının değişmediğini ayrıca kanıtlamaz.
- Geliştirme derlemelerinde yapıldı. 0.9.4’ün son kalite değişiklikleri [ayrı bir yazıda](/research/what-improved-search-in-0-9-4/) anlatılıyor.
- Daha az satır, daha iyi kod anlamına gelmez.
- MESA’nın henüz üretimde kullanıcısı yok; bu iş gerçek yükseltmelerle sınanmadı.

## Kaynaklar

1. [MESA 0.9.4 değişiklik günlüğü](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
2. [v0.9.3 ile v0.9.4 karşılaştırması](https://github.com/Yasou13/MESA/compare/v0.9.3...v0.9.4)

', ARRAY['engineering', 'maintenance', 'configuration', 'release']::text[], 'MESA contributors', 6, 'published', 'MESA’dan Neleri Sildik, Neden?', 'MESA 0.9.4, V3 deposunu ve LLM birleştirmeyi kaldırdı; 6.050 Python satırı azaldı. Her silmeden sonra dev arama sıraları aynı kaldı.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('why-mesa-removed-its-graph-store', 'research', 'en', 'Why MESA Removed Its Graph Store', 'What the graph lane added on the benchmark dev questions', 'MESA 0.9.5 removed its graph database. In our dev measurements graph search never found a correct passage that the other lanes missed, turning it off lost no question, and a citation-following replacement lowered Hit@1.', '', '## What did 0.9.5 remove?

MESA Core 0.9.5 removed the Kùzu graph database, the worker that wrote graph projections, the graph search lane and the graph rebuild paths. The four Kùzu modules in `mesa_storage` alone were 2,610 lines. Search now uses BM25, vector search when an embedding model is set, the built-in legal rules and an optional reranker. Entities, assertions and legal citations stay in SQLite with their sources.

The graph had already been off by default since 0.9.4. This post explains the measurements behind that default and the removal.

## Did the graph find anything the other lanes missed?

No. With model extraction off, which is the default, the graph held a simple document → chunk structure. A Round 21 review of 0.9.3 re-scored the benchmark v1 dev results: the graph lane found the correct passage first and alone for 0 of 85 answerable questions, in both the models-off (T0) and embedding (T1b) runs.

## What happened when we turned it off?

We turned each lane off on the shared benchmark v2 dev store (Tier M, 141 documents, 5,041 chunks, 128 questions of which 112 are answerable, models off, a 0.9.4 development build with prefix BM25). The starting point was 52 of 112 questions with the correct passage in the top five.

| Change from the 52-hit baseline | Hit@5 (of 112) |
| --- | --- |
| Assertion fusion weight 0 | 56 |
| Graph off | 52 |
| Both | 61 |

Turning the graph off lost no question. Together with the zero assertion weight, it became the 0.9.4 default.

## Could citations replace the graph?

Legal documents cite each other, so we tested the obvious replacement in Round 23: take the top 20 fused results, follow the statute and article citations already stored for them, and rank the cited in-scope articles as a separate lane. The rule was to keep it only if Hit@5 gained at least two questions and no category lost more than one.

| Citation lane weight | Hit@1 | Hit@5 | MRR |
| --- | --- | --- | --- |
| 0 (off) | 30 | 62 | 0.3958 |
| 0.5 | 28 | 62 | 0.3828 |
| 1 | 20 | 60 | 0.3313 |
| 2 | 20 | 60 | 0.3304 |

Same store and split as above, models off, at the Round 23 development commit. Following citations pulled frequently cited articles ahead of the passage that answered the question. The lane, its setting and its tests were deleted in the same unit.

## What does this mean for you?

- If you upgrade, the migration clears the old graph bookkeeping rows. Old `kuzu_db` files are ignored; delete them by hand after checking your backup.
- `MESA_GRAPH_ENABLED`, `MESA_RRF_GRAPH_WEIGHT` and `MESA_V4_GRAPH_TIMEOUT_SECONDS` are ignored with one startup warning each.
- The package now installs on Python 3.14, because Kùzu was the dependency that had no wheel there.

See [graph store removed](/docs/core/graph/) for the upgrade note.

## Limits of these measurements

- All numbers are dev-split results; the held-out test split was not used for these decisions.
- The v1 re-scoring and the v2 ablation used different question sets and builds.
- The graph had no extracted relations by default. A graph built from model-extracted relations was not tested, because model extraction is off by default and earlier measurements showed it lowered quality.
- These results describe this corpus of Turkish legal texts; another corpus with rich typed relations could behave differently.

## Sources

1. [MESA Core 0.9.5 changelog](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/CHANGELOG.md#095---2026-11-24)
2. [MESA Core 0.9.4 changelog: graph off by default](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/CHANGELOG.md#094---2026-11-23)

', ARRAY['graph', 'ablation', 'architecture', 'release']::text[], 'MESA contributors', 5, 'published', 'Why MESA Removed Its Graph Store', 'MESA 0.9.5 removed its graph database after dev measurements: turning the graph off lost no question and a citation-following lane lowered Hit@1.', true, '2026-11-24T00:00:00Z', '2026-11-24T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('why-mesa-removed-its-graph-store', 'research', 'tr', 'MESA Çizge Deposunu Neden Kaldırdı?', 'Çizge kanalının benchmark dev sorularına kattıkları', 'MESA 0.9.5 çizge veritabanını kaldırdı. Dev ölçümlerimizde çizge araması diğer kanalların kaçırdığı hiçbir doğru pasajı bulmadı, kapatılması hiçbir soruyu kaybettirmedi ve atıf izleyen bir alternatif Hit@1’i düşürdü.', '', '## 0.9.5 neyi kaldırdı?

MESA Core 0.9.5; Kùzu çizge veritabanını, çizge görünümünü yazan worker’ı, çizge arama kanalını ve çizge yeniden oluşturma yollarını kaldırdı. Yalnızca `mesa_storage` içindeki dört Kùzu modülü 2.610 satırdı. Arama artık BM25, bir embedding modeli ayarlıysa vektör araması, yerleşik hukuk kuralları ve isteğe bağlı yeniden sıralama ile yapılır. Varlıklar, bilgi kayıtları ve hukuki atıflar kaynaklarıyla birlikte SQLite’ta kalır.

Çizge 0.9.4’ten beri zaten varsayılan olarak kapalıydı. Bu yazı, o varsayılanın ve kaldırmanın arkasındaki ölçümleri anlatır.

## Çizge, diğer kanalların kaçırdığı bir şey buldu mu?

Hayır. Varsayılan olarak model çıkarımı kapalıyken çizge yalnızca belge → parça yapısını tutuyordu. 0.9.3 üzerinde yapılan Round 21 incelemesi benchmark v1 dev sonuçlarını yeniden puanladı: çizge kanalı, modelsiz (T0) ve embedding (T1b) koşularının ikisinde de 85 yanıtlanabilir sorunun hiçbirinde doğru pasajı tek başına ilk bulan kanal olmadı (0/85).

## Kapattığımızda ne oldu?

Her kanalı paylaşılan benchmark v2 dev deposunda tek tek kapattık (Tier M, 141 belge, 5.041 parça, 112’si yanıtlanabilir 128 soru, modeller kapalı, önekli BM25 içeren bir 0.9.4 geliştirme derlemesi). Başlangıç noktası, doğru pasajın ilk beşte olduğu 112 sorudan 52’siydi.

| 52 isabetlik temel çizgiden değişiklik | Hit@5 (112’de) |
| --- | --- |
| Bilgi kaydı füzyon ağırlığı 0 | 56 |
| Çizge kapalı | 52 |
| İkisi birlikte | 61 |

Çizgeyi kapatmak hiçbir soruyu kaybettirmedi. Sıfır bilgi kaydı ağırlığıyla birlikte 0.9.4 varsayılanı oldu.

## Atıflar çizgenin yerini alabilir miydi?

Hukuk metinleri birbirine atıf yapar; bu yüzden Round 23’te akla gelen ilk alternatifi denedik: birleştirilmiş ilk 20 sonucu alıp onlar için zaten kayıtlı kanun ve madde atıflarını izlemek ve atıf yapılan kapsam içi maddeleri ayrı bir kanal olarak sıralamak. Kural, kanalı yalnızca Hit@5 en az iki soru kazanırsa ve hiçbir kategori birden fazla soru kaybetmezse tutmaktı.

| Atıf kanalı ağırlığı | Hit@1 | Hit@5 | MRR |
| --- | --- | --- | --- |
| 0 (kapalı) | 30 | 62 | 0,3958 |
| 0,5 | 28 | 62 | 0,3828 |
| 1 | 20 | 60 | 0,3313 |
| 2 | 20 | 60 | 0,3304 |

Depo ve bölüm yukarıdakiyle aynı, modeller kapalı, Round 23 geliştirme commit’i. Atıfları izlemek, sık atıf alan maddeleri soruyu yanıtlayan pasajın önüne çekti. Kanal, ayarı ve testleri aynı iş biriminde silindi.

## Bu sizin için ne anlama geliyor?

- Yükseltirseniz migration eski çizge kayıt satırlarını temizler. Eski `kuzu_db` dosyaları yok sayılır; yedeğinizi denetledikten sonra elle silin.
- `MESA_GRAPH_ENABLED`, `MESA_RRF_GRAPH_WEIGHT` ve `MESA_V4_GRAPH_TIMEOUT_SECONDS` başlangıçta her biri için bir uyarıyla yok sayılır.
- Paket artık Python 3.14’e kurulur; orada wheel’i olmayan bağımlılık Kùzu idi.

Yükseltme notu için [çizge deposu kaldırıldı](/docs/core/graph/) sayfasına bakın.

## Bu ölçümlerin sınırları

- Tüm sayılar dev bölümü sonuçlarıdır; bu kararlar için ayrılmış test bölümü kullanılmadı.
- v1 yeniden puanlaması ile v2 karşılaştırması farklı soru kümeleri ve derlemeler kullandı.
- Çizgede varsayılan olarak çıkarılmış ilişki yoktu. Model çıkarımı ilişkilerinden kurulan bir çizge denenmedi; çünkü model çıkarımı varsayılan olarak kapalıdır ve önceki ölçümler kaliteyi düşürdüğünü gösterdi.
- Sonuçlar bu Türk hukuku metinleri derlemini anlatır; zengin türlü ilişkileri olan başka bir derlem farklı davranabilir.

## Kaynaklar

1. [MESA Core 0.9.5 changelog](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/CHANGELOG.md#095---2026-11-24)
2. [MESA Core 0.9.4 changelog: çizge varsayılan olarak kapalı](https://github.com/Yasou13/MESA/blob/c725616364f3931249bd05a62676f132b65768e1/CHANGELOG.md#094---2026-11-23)

', ARRAY['graph', 'ablation', 'architecture', 'release']::text[], 'MESA contributors', 5, 'published', 'MESA Çizge Deposunu Neden Kaldırdı?', 'MESA 0.9.5, dev ölçümlerinden sonra çizge veritabanını kaldırdı: çizgeyi kapatmak hiçbir soruyu kaybettirmedi, atıf izleyen kanal Hit@1’i düşürdü.', true, '2026-11-24T00:00:00Z', '2026-11-24T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('turkish-legal-citation-extraction', 'research', 'en', 'How Rule-Based Turkish Citation Extraction Works', 'What the rules find, how often they are right, and where they fail', 'MESA''s rule extractor finds six kinds of legal item without a model. On 150 labeled chunks it found 357 correct items, with 25 false positives and 18 misses.', '', '## How does MESA extract Turkish legal citations?

MESA 0.9.4 uses hand-written rules, with no language model. The rules find six item types in each chunk: law citations, decision references, dates, amounts, durations and outcomes. Each item keeps its exact character position in the source text.

We scored the released extractor on three labeled sets of 50 chunks. Across all 150 chunks it found 357 correct items, produced 25 false positives and missed 18. Its weakest areas were citation precision on one set (0.8222) and duration precision on another (0.6957).

> [!WARNING]
> **Not legal advice**
> This post explains a software measurement. A detected citation may still be wrong, repealed or irrelevant. Check legal sources yourself and consult a qualified lawyer for legal decisions.

## What does the extractor return?

This example runs against the released `mesa-memory` 0.9.4 package. The sentence is illustrative.

```text
from mesa_storage.legal_rules import extract_all_rules

text = ("6098 sayılı Kanunun 49. maddesi uyarınca dava 15 gün içinde açılır. "
        "Ceza Genel Kurulunun 28/11/2017 tarihli ve 2016/1307 E., 2017/551 K. "
        "sayılı kararı. Davacıya 5.000 TL ödenmesine, hükmün ONANMASINA karar verildi.")

for item in extract_all_rules(text):
    print(item["type"], "|", item["text"], "|", item["start"], item["end"])
```

```text
citation | 6098 sayılı Kanunun 49. maddesi | 0 31
duration | 15 gün | 46 52
decision_ref | Ceza Genel Kurulunun 28/11/2017 tarihli ve 2016/1307 E., 2017/551 K | 68 135
amount | 5.000 TL | 161 169
outcome | ONANMASINA | 189 199
```

The extractor also normalizes values. It returned docket `2016/1307`, decision `2017/551`, date `2017-11-28` and amount `5000` for this text. The outcome `ONANMASINA` became `onama`.

## Why are Turkish legal citations hard to parse?

- Law references appear as `6098 sayılı Kanun`, by name, or by abbreviation such as `TBK m. 49`.
- A decision can be written with `E.` and `K.`, or in short form as `tarihli ve 54-280 sayılı`.
- Suffixes change court names: `Mahkemesi`, `Mahkemesince`, `Dairesinin`.
- Dates inside a decision reference or an amendment note must not count as separate dates.
- OCR can split numbers. Our labeled data includes `50 6 sayılı`, with a space inside a law number.

## How accurate is it?

A predicted item counts as correct when it has the same type as a labeled item and their character spans overlap by an intersection-over-union of at least 0.5. Each label can match only one prediction.

| MESA 0.9.4, 50 chunks per set | Correct | False | Missed | Precision | Recall | F1 |
| --- | --- | --- | --- | --- | --- | --- |
| Set 1 (also used in development) | 125 | 2 | 14 | 0.9843 | 0.8993 | 0.9398 |
| Set 2 | 115 | 11 | 2 | 0.9127 | 0.9829 | 0.9465 |
| Set 3 | 117 | 12 | 2 | 0.9070 | 0.9832 | 0.9435 |

| Item type, all 150 chunks | Correct | False | Missed | Precision | Recall |
| --- | --- | --- | --- | --- | --- |
| Citation | 132 | 13 | 14 | 0.9103 | 0.9041 |
| Decision reference | 38 | 0 | 0 | 1.0000 | 1.0000 |
| Date | 72 | 2 | 3 | 0.9730 | 0.9600 |
| Amount | 33 | 0 | 1 | 1.0000 | 0.9706 |
| Duration | 74 | 10 | 0 | 0.8810 | 1.0000 |
| Outcome | 8 | 0 | 0 | 1.0000 | 1.0000 |

Perfect scores on small groups need care. Outcome has only 8 labeled items, and decision reference has 38.

## Did extraction help search?

An early prototype added a citation index outside MESA 0.9.1. On 50 template-generated citation questions, passage Hit@5 rose from 8/50 to 50/50. On 85 answerable questions from the older dev set, Hit@5 stayed at 28/85.

MESA 0.9.2 then shipped exact-match handling. With models off, it reached Hit@5 of 50/50 on the template set and 39/40 on a natural-language citation set. These sets are narrow: template questions name the citation directly, so they test lookup more than understanding.

For the general search picture, read [What Improved MESA Search Quality in 0.9.4](/research/what-improved-search-in-0-9-4/).

## How should you use extracted citations?

1. Treat an extracted item as a pointer to the source.
2. Open the exact source span and read the surrounding text.
3. Check the law on [mevzuat.gov.tr](https://www.mevzuat.gov.tr/) and decisions on [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/) or [UYAP Emsal](https://emsal.uyap.gov.tr/).
4. Confirm that the provision applied on the relevant date.

Our guide on [verifying an AI-cited Yargıtay decision](/law/guides/yapay-zeka-yargitay-karari-dogrulama/) walks through these checks, and [common AI citation errors](/law/guides/yapay-zeka-hukuk-atif-hatalari/) lists what to look for.

## What can this result not show?

- The sample is 150 chunks from one corpus.
- Set 1 was used during development. We cannot show that sets 2 and 3 remained independent of later changes.
- We did not compare these rules with an LLM, so this post makes no claim that rules beat models.
- The extractor does not check that a citation exists, is current or supports a claim.
- MESA 0.9.4 does not answer in-force-on-date questions.

## Sources

1. [MESA legal rules source, v0.9.4](https://github.com/Yasou13/MESA/blob/v0.9.4/mesa_storage/legal_rules.py)
2. [MESA 0.9.4 changelog](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
3. [Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/)
4. [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/)
5. [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/)

', ARRAY['legal-search', 'citations', 'extraction', 'turkish']::text[], 'MESA contributors', 8, 'published', 'How Rule-Based Turkish Citation Extraction Works', 'We scored MESA''s Turkish legal rule extractor on 150 labeled chunks: 357 correct items, 25 false positives and 18 misses, with weak spots shown.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('turkish-legal-citation-extraction', 'research', 'tr', 'Hukuki Atıflar Kurallarla Nasıl Çıkarılır?', 'Kurallar neyi buluyor, ne kadar doğru, nerede yanılıyor?', 'MESA’nın kural çıkarıcısı, model kullanmadan altı tür hukuki öğe bulur. 150 etiketli parçada 357 doğru öğe buldu; 25 yanlış sonuç verdi, 18 öğeyi kaçırdı.', '', '## MESA Türkçe hukuki atıfları nasıl çıkarıyor?

MESA 0.9.4, dil modeli yerine elle yazılmış kurallar kullanır. Kurallar her parçada altı tür öğe arar: kanun atıfları, karar künyeleri, tarihler, tutarlar, süreler ve karar sonuçları. Her öğe, kaynak metindeki tam karakter konumunu korur.

Yayımlanan çıkarıcıyı 50’şer parçalık üç etiketli kümede puanladık. 150 parçanın tamamında 357 doğru öğe buldu, 25 yanlış sonuç üretti ve 18 öğeyi kaçırdı. En zayıf noktaları bir kümede atıf kesinliği (0,8222), başka bir kümede süre kesinliği (0,6957) oldu.

> [!WARNING]
> **Hukuki tavsiye değildir**
> Bu yazı bir yazılım ölçümünü anlatır. Bulunan bir atıf yine de yanlış, yürürlükten kalkmış veya ilgisiz olabilir. Hukuki kaynakları kendiniz denetleyin; hukuki kararlar için yetkin bir avukata danışın.

## Çıkarıcı ne döndürüyor?

Bu örnek, yayımlanan `mesa-memory` 0.9.4 paketiyle çalışır. Cümle örnek amaçlıdır.

```text
from mesa_storage.legal_rules import extract_all_rules

text = ("6098 sayılı Kanunun 49. maddesi uyarınca dava 15 gün içinde açılır. "
        "Ceza Genel Kurulunun 28/11/2017 tarihli ve 2016/1307 E., 2017/551 K. "
        "sayılı kararı. Davacıya 5.000 TL ödenmesine, hükmün ONANMASINA karar verildi.")

for item in extract_all_rules(text):
    print(item["type"], "|", item["text"], "|", item["start"], item["end"])
```

```text
citation | 6098 sayılı Kanunun 49. maddesi | 0 31
duration | 15 gün | 46 52
decision_ref | Ceza Genel Kurulunun 28/11/2017 tarihli ve 2016/1307 E., 2017/551 K | 68 135
amount | 5.000 TL | 161 169
outcome | ONANMASINA | 189 199
```

Çıkarıcı değerleri de normalize eder. Bu metin için `2016/1307` esas, `2017/551` karar, `2017-11-28` tarih ve `5000` tutar döndürdü. `ONANMASINA` sonucu `onama` oldu.

## Türkçe hukuki atıflar neden zor ayrıştırılır?

- Kanun atıfları `6098 sayılı Kanun` biçiminde, adıyla veya `TBK m. 49` gibi kısaltmayla yazılır.
- Karar künyesi `E.` ve `K.` ile ya da kısa biçimde `tarihli ve 54-280 sayılı` olarak geçebilir.
- Ekler mahkeme adlarını değiştirir: `Mahkemesi`, `Mahkemesince`, `Dairesinin`.
- Karar künyesi veya değişiklik notu içindeki tarihler ayrı tarih sayılmamalıdır.
- OCR sayıları bölebilir. Etiketli verimizde, kanun numarasının içinde boşluk bulunan `50 6 sayılı` ifadesi var.

## Ne kadar doğru çalışıyor?

Bir tahmin, etiketli öğeyle aynı türdeyse ve karakter aralıklarının kesişim/birleşim oranı (IoU) en az 0,5 ise doğru sayılır. Her etiket yalnızca bir tahminle eşleşebilir.

| MESA 0.9.4, küme başına 50 parça | Doğru | Yanlış | Eksik | Kesinlik | Duyarlılık | F1 |
| --- | --- | --- | --- | --- | --- | --- |
| 1. küme (geliştirmede de kullanıldı) | 125 | 2 | 14 | 0,9843 | 0,8993 | 0,9398 |
| 2. küme | 115 | 11 | 2 | 0,9127 | 0,9829 | 0,9465 |
| 3. küme | 117 | 12 | 2 | 0,9070 | 0,9832 | 0,9435 |

| Öğe türü, 150 parçanın tamamı | Doğru | Yanlış | Eksik | Kesinlik | Duyarlılık |
| --- | --- | --- | --- | --- | --- |
| Kanun atfı | 132 | 13 | 14 | 0,9103 | 0,9041 |
| Karar künyesi | 38 | 0 | 0 | 1,0000 | 1,0000 |
| Tarih | 72 | 2 | 3 | 0,9730 | 0,9600 |
| Tutar | 33 | 0 | 1 | 1,0000 | 0,9706 |
| Süre | 74 | 10 | 0 | 0,8810 | 1,0000 |
| Karar sonucu | 8 | 0 | 0 | 1,0000 | 1,0000 |

Küçük gruplardaki tam puanları dikkatle okuyun. Karar sonucunda yalnızca 8, karar künyesinde 38 etiketli öğe var.

## Çıkarım aramaya yardımcı oldu mu?

İlk prototip, MESA 0.9.1’in dışına bir atıf dizini ekledi. Şablonla üretilmiş 50 atıf sorusunda pasaj Hit@5, 8/50’den 50/50’ye çıktı. Eski dev kümesindeki 85 yanıtlanabilir soruda Hit@5 28/85’te kaldı.

MESA 0.9.2 ardından tam eşleşme desteğiyle yayımlandı. Modeller kapalıyken şablon kümesinde 50/50, doğal dille yazılmış atıf kümesinde 39/40 Hit@5 aldı. Bu kümeler dardır: şablon soruları atfı doğrudan söylediği için anlamadan çok aramayı sınar.

Genel arama tablosu için [MESA 0.9.4’te Arama Kalitesini Ne Artırdı?](/research/what-improved-search-in-0-9-4/) yazısını okuyun.

## Çıkarılan atıfları nasıl kullanmalısınız?

1. Çıkarılan öğeyi kaynağa giden bir işaret olarak görün.
2. Kaynak metindeki tam aralığı açıp çevresini okuyun.
3. Kanunu [mevzuat.gov.tr](https://www.mevzuat.gov.tr/) üzerinden, kararı [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/) veya [UYAP Emsal](https://emsal.uyap.gov.tr/) üzerinden denetleyin.
4. Hükmün ilgili tarihte uygulanıp uygulanmadığını doğrulayın.

[Yapay zekânın gösterdiği Yargıtay kararını doğrulama rehberimiz](/law/guides/yapay-zeka-yargitay-karari-dogrulama/) bu adımları anlatır. [Yapay zekâ atıf hataları rehberi](/law/guides/yapay-zeka-hukuk-atif-hatalari/) neye bakacağınızı listeler.

## Bu sonuç neyi gösteremez?

- Örneklem tek derlemden 150 parçadır.
- 1. küme geliştirme sırasında kullanıldı. 2. ve 3. kümelerin sonraki değişikliklerden bağımsız kaldığını gösteremiyoruz.
- Kuralları bir LLM ile karşılaştırmadık; bu yazı kuralların modellerden iyi olduğunu savunmuyor.
- Çıkarıcı, atfın var olduğunu, güncel olduğunu veya iddiayı desteklediğini denetlemez.
- MESA 0.9.4, belirli bir tarihte yürürlükte olma sorularını yanıtlamaz.

## Kaynaklar

1. [MESA hukuk kuralları kaynağı, v0.9.4](https://github.com/Yasou13/MESA/blob/v0.9.4/mesa_storage/legal_rules.py)
2. [MESA 0.9.4 değişiklik günlüğü](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)
3. [Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/)
4. [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/)
5. [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/)

', ARRAY['legal-search', 'citations', 'extraction', 'turkish']::text[], 'MESA contributors', 8, 'published', 'Hukuki Atıflar Kurallarla Nasıl Çıkarılır?', 'MESA’nın Türkçe hukuk kural çıkarıcısını 150 etiketli parçada ölçtük: 357 doğru, 25 yanlış, 18 eksik öğe. Zayıf noktaları da gösteriyoruz.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('bm25-turkish-prefix-matching', 'research', 'en', 'Why BM25 Struggles With Turkish', 'One legal word, dozens of index terms', 'BM25 matches whole tokens, while Turkish adds suffixes to words. In 112 legal dev questions, 252 of 873 query terms reached the evidence only through a shared prefix.', '', '## Why does BM25 struggle with Turkish?

BM25 scores whole tokens, and Turkish builds many tokens from one stem. `sözleşme`, `sözleşmesinin` and `sözleşmelerinde` are three different index terms, so a query containing one form can miss the others.

We measured this on MESA''s Turkish legal benchmark. Of 873 eligible query terms in 112 answerable dev questions, 290 appeared exactly in the correct evidence, 252 matched only through their first five characters, and 331 did not match at all. Prefix matching addresses the middle group, but its measured gain was small: a net two questions in the top 5.

## How many forms does one Turkish word have?

We indexed the 141 Tier M documents with the tokenizer MESA uses and grouped every term of 6 or more characters by its first five characters. The tokenizer removes most diacritics, so `sözle` is stored as `sozle`.

| Tier M corpus, terms with 6+ characters | Value |
| --- | --- |
| Distinct terms | 26,664 |
| Five-character prefix groups | 5,144 |
| Median forms per group | 2 |
| 90th percentile | 12 |
| Groups with 10 or more forms | 670 |
| Groups with 50 or more forms | 58 |
| Largest group | 191 |

| Prefix | Forms in corpus | Examples |
| --- | --- | --- |
| karar | 87 | kararı, kararın, kararlarına, kararnamenin |
| yonet | 55 | yönetim, yönetmelik, yönetmeliğin, yönetici |
| sozle | 44 | sözleşme, sözleşmesinin, sözleşmelerinde |
| yargı | 41 | yargıtay, yargılama, yargısal |
| madde | 39 | maddesi, maddesinde, maddelerine |
| mahke | 38 | mahkemesi, mahkemece, mahkemelerinin |

Most prefix groups are small. The problem concentrates in common legal words, and those are the words legal queries use.

## How often do query words miss the evidence?

| Dev category, eligible query terms | Exact in evidence | Prefix only | No match |
| --- | --- | --- | --- |
| Exact wording | 95 | 66 | 91 |
| Number, date, docket | 88 | 85 | 93 |
| Paraphrase | 63 | 61 | 119 |
| Cross-document | 44 | 40 | 28 |
| All | 290 | 252 | 331 |

In 102 of 112 answerable questions, at least one query term reached the evidence only through its prefix. Paraphrases have the largest no-match group: 119 of 243 terms. Prefix matching cannot help there, because the words differ. That is where [semantic search](/learn/semantic-search/) and [hybrid retrieval](/learn/hybrid-retrieval-explained/) come in.

## How does MESA''s prefix matching work?

MESA 0.9.4 uses a simple rule. A query token with 6 or more characters and no digits is truncated to five characters and searched as a prefix. Shorter tokens and tokens with digits stay exact, so `6098` cannot match `60981`.

You can see the behavior with Python''s standard library, using the same FTS5 tokenizer settings:

```text
import sqlite3

db = sqlite3.connect(":memory:")
db.execute("""CREATE VIRTUAL TABLE docs USING fts5(
    text, tokenize=''unicode61 remove_diacritics 2'', prefix=''5'')""")
rows = ["Yargıtay kararı", "YARGITAY KARARI", "sözleşmesinin feshi", "sözlerini söyledi"]
db.executemany("INSERT INTO docs VALUES (?)", [(r,) for r in rows])

for query in [''"sözleşme"'', ''"sözle"*'', ''"yargı"*'', ''"yargi"*'']:
    hits = [r[0] for r in db.execute("SELECT text FROM docs WHERE docs MATCH ?", (query,))]
    print(query, "->", hits)
```

```text
"sözleşme" -> []
"sözle"* -> [''sözleşmesinin feshi'', ''sözlerini söyledi'']
"yargı"* -> [''Yargıtay kararı'']
"yargi"* -> [''YARGITAY KARARI'']
```

The output shows both sides of the rule. `sözle*` finds `sözleşmesinin`, which the exact term misses. It also finds `sözlerini`, which has nothing to do with contracts.

## Why are ı and İ a separate problem?

Turkish has dotted and dotless i. In the output above, `yargı*` finds `Yargıtay` but not `YARGITAY`, because the tokenizer lowercases `I` to `i` rather than `ı`.

MESA handles part of this at query time. It normalizes Turkish case, then searches both the `ı` form and an `i` variant. So `Yargıtay` and `YARGITAY` as queries find text written either way. The ASCII query `yargitay` still does not find `Yargıtay`, because index-side Turkish folding is not implemented in 0.9.4.

## What did prefix matching actually change?

On a shared store with models off, prefix matching took dev Hit@5 from 50/112 to 52/112 (pre-release 0.9.4 build, benchmark v2, Tier M). Six questions crossed the top-5 line:

| Category | Rank before → after | Effect | Prefix-only terms in evidence |
| --- | --- | --- | --- |
| Number, date, docket | 6 → 5 | Gain | 2 |
| Cross-document | 6 → 5 | Gain | 7 |
| Number, date, docket | 6 → 5 | Gain | 3 |
| Paraphrase | 38 → 4 | Gain | 0 |
| Exact wording | 5 → 8 | Loss | 1 |
| Number, date, docket | 4 → 11 | Loss | 5 |

Three gains were one-position moves. The largest gain had no prefix-only term in its evidence, so its improvement came indirectly, probably because competing passages changed rank. Both losses had prefix-only terms too. The presence of such a term does not predict whether a question improves.

The [0.9.4 quality post](/research/what-improved-search-in-0-9-4/) shows that larger gains came from changing fusion weights.

## What should you do for Turkish search?

- Measure before adding a stemmer. Over-matching can cost as much as it gains.
- Keep tokens with digits exact. Law numbers, dockets and dates must not match by prefix.
- Handle ı and İ explicitly. Default Unicode lowercasing is wrong for Turkish.
- Combine lexical search with embeddings, because many query words never appear in the evidence.
- Compare ranks per question, not only an average.

## What can this analysis not show?

- It checks each query term against the gold evidence span, not against all candidate passages.
- It does not apply MESA''s filtering of citation tokens, so counts are approximate for citation-heavy questions.
- We did not test a real Turkish stemmer or morphological analyzer.
- A net change of two questions in 112 is small and may not hold on another sample.
- The corpus is legal text. General Turkish may behave differently.

## Sources

1. [SQLite FTS5 documentation](https://www.sqlite.org/fts5.html)
2. [Manning, Raghavan and Schütze: Okapi BM25](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html)
3. [MESA 0.9.4 changelog](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)

', ARRAY['bm25', 'turkish', 'tokenization', 'legal-search']::text[], 'MESA contributors', 8, 'published', 'Why BM25 Struggles With Turkish', 'Turkish suffixes split one word into many index terms. We measured the problem on legal text and what 5-character prefix matching actually fixed.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('bm25-turkish-prefix-matching', 'research', 'tr', 'Türkçe Metinlerde BM25 Neden Zorlanır?', 'Tek hukuk sözcüğü, onlarca dizin terimi', 'BM25 tam token eşleştirir; Türkçe ise sözcüklere ek getirir. 112 hukuk dev sorusundaki 873 sorgu teriminin 252’si kanıta yalnızca ortak önek üzerinden ulaştı.', '', '## BM25 Türkçede neden zorlanır?

BM25 tam token’ları puanlar; Türkçe ise tek kökten çok sayıda token üretir. `sözleşme`, `sözleşmesinin` ve `sözleşmelerinde` üç ayrı dizin terimidir. Bu yüzden sorguda geçen biçim, metindeki öteki biçimleri kaçırabilir.

Bunu MESA’nın Türkçe hukuk benchmark’ında ölçtük. 112 yanıtlanabilir dev sorusundaki 873 uygun sorgu teriminin 290’ı doğru kanıtta birebir geçti, 252’si yalnızca ilk beş karakteriyle eşleşti, 331’i hiç eşleşmedi. Önek eşleştirme ortadaki grubu hedefler; ama ölçülen kazancı küçüktü: ilk 5’te net iki soru.

## Türkçe bir sözcüğün kaç biçimi olur?

141 Tier M belgesini MESA’nın kullandığı tokenizer ile dizinledik. 6 veya daha uzun terimleri ilk beş karakterlerine göre grupladık. Tokenizer çoğu aksanı kaldırdığı için `sözle`, dizinde `sozle` olarak saklanır.

| Tier M derlemi, 6+ karakterli terimler | Değer |
| --- | --- |
| Farklı terim | 26.664 |
| Beş karakterlik önek grubu | 5.144 |
| Grup başına ortanca biçim | 2 |
| 90. yüzdelik | 12 |
| 10 veya daha çok biçimli grup | 670 |
| 50 veya daha çok biçimli grup | 58 |
| En büyük grup | 191 |

| Önek | Derlemdeki biçim | Örnekler |
| --- | --- | --- |
| karar | 87 | kararı, kararın, kararlarına, kararnamenin |
| yonet | 55 | yönetim, yönetmelik, yönetmeliğin, yönetici |
| sozle | 44 | sözleşme, sözleşmesinin, sözleşmelerinde |
| yargı | 41 | yargıtay, yargılama, yargısal |
| madde | 39 | maddesi, maddesinde, maddelerine |
| mahke | 38 | mahkemesi, mahkemece, mahkemelerinin |

Önek gruplarının çoğu küçüktür. Sorun sık kullanılan hukuk sözcüklerinde yoğunlaşır; hukuk sorguları da tam olarak bu sözcükleri kullanır.

## Sorgu sözcükleri kanıtı ne sıklıkla kaçırıyor?

| Dev kategorisi, uygun sorgu terimleri | Kanıtta birebir | Yalnızca önek | Eşleşme yok |
| --- | --- | --- | --- |
| Birebir ifade | 95 | 66 | 91 |
| Sayı, tarih, esas no | 88 | 85 | 93 |
| Yeniden ifade | 63 | 61 | 119 |
| Çok belgeli | 44 | 40 | 28 |
| Toplam | 290 | 252 | 331 |

112 yanıtlanabilir sorunun 102’sinde en az bir sorgu terimi kanıta yalnızca öneki üzerinden ulaştı. En büyük eşleşmeme grubu yeniden ifade sorularında: 243 terimin 119’u. Önek burada işe yaramaz, çünkü sözcükler farklıdır. [Anlamsal arama](/learn/semantic-search/) ve [hibrit arama](/learn/hybrid-retrieval-explained/) bu noktada devreye girer.

## MESA’da önek eşleştirme nasıl çalışıyor?

MESA 0.9.4 basit bir kural kullanır. 6 veya daha uzun olan ve rakam içermeyen sorgu token’ı beş karaktere kısaltılır ve önek olarak aranır. Daha kısa token’lar ile rakamlı token’lar birebir kalır; böylece `6098`, `60981` ile eşleşmez.

Aynı FTS5 tokenizer ayarlarıyla bu davranışı Python’un standart kütüphanesinde görebilirsiniz:

```text
import sqlite3

db = sqlite3.connect(":memory:")
db.execute("""CREATE VIRTUAL TABLE docs USING fts5(
    text, tokenize=''unicode61 remove_diacritics 2'', prefix=''5'')""")
rows = ["Yargıtay kararı", "YARGITAY KARARI", "sözleşmesinin feshi", "sözlerini söyledi"]
db.executemany("INSERT INTO docs VALUES (?)", [(r,) for r in rows])

for query in [''"sözleşme"'', ''"sözle"*'', ''"yargı"*'', ''"yargi"*'']:
    hits = [r[0] for r in db.execute("SELECT text FROM docs WHERE docs MATCH ?", (query,))]
    print(query, "->", hits)
```

```text
"sözleşme" -> []
"sözle"* -> [''sözleşmesinin feshi'', ''sözlerini söyledi'']
"yargı"* -> [''Yargıtay kararı'']
"yargi"* -> [''YARGITAY KARARI'']
```

Çıktı kuralın iki yüzünü gösteriyor. `sözle*`, birebir terimin kaçırdığı `sözleşmesinin` biçimini bulur. Ama sözleşmeyle ilgisi olmayan `sözlerini` sözcüğünü de bulur.

## ı ve İ neden ayrı bir sorun?

Türkçede noktalı ve noktasız i vardır. Yukarıdaki çıktıda `yargı*`, `Yargıtay` biçimini bulur ama `YARGITAY` biçimini bulmaz; çünkü tokenizer `I` harfini `ı` yerine `i` yapar.

MESA bunun bir bölümünü sorgu anında çözer. Türkçe büyük-küçük harfi normalize eder, sonra hem `ı` biçimini hem `i` varyantını arar. Böylece `Yargıtay` ve `YARGITAY` sorguları iki yazımı da bulur. ASCII `yargitay` sorgusu ise `Yargıtay` metnini hâlâ bulamaz; çünkü 0.9.4’te dizin tarafında Türkçe harf katlama yoktur.

## Önek eşleştirme gerçekte neyi değiştirdi?

Modeller kapalıyken ortak depoda önek eşleştirme, dev Hit@5’i 50/112’den 52/112’ye taşıdı (0.9.4 öncesi derleme, benchmark v2, Tier M). Altı soru ilk 5 sınırını geçti:

| Kategori | Sıra önce → sonra | Etki | Kanıtta yalnızca önekle eşleşen terim |
| --- | --- | --- | --- |
| Sayı, tarih, esas no | 6 → 5 | Kazanç | 2 |
| Çok belgeli | 6 → 5 | Kazanç | 7 |
| Sayı, tarih, esas no | 6 → 5 | Kazanç | 3 |
| Yeniden ifade | 38 → 4 | Kazanç | 0 |
| Birebir ifade | 5 → 8 | Kayıp | 1 |
| Sayı, tarih, esas no | 4 → 11 | Kayıp | 5 |

Üç kazanç tek sıralık hareketti. En büyük kazancın kanıtında yalnızca önekle eşleşen terim yoktu; iyileşme büyük olasılıkla rakip pasajların sırası değiştiği için dolaylı geldi. İki kayıpta da bu tür terimler vardı. Yani böyle bir terimin varlığı, sorunun iyileşeceğini göstermiyor.

[0.9.4 kalite yazısı](/research/what-improved-search-in-0-9-4/), daha büyük kazançların birleştirme ağırlıklarını değiştirmekten geldiğini gösteriyor.

## Türkçe arama için ne yapmalısınız?

- Kök bulucu (stemmer) eklemeden önce ölçün. Fazla eşleşme, kazandırdığı kadar kaybettirebilir.
- Rakamlı token’ları birebir tutun. Kanun, esas numaraları ve tarihler önekle eşleşmemelidir.
- ı ve İ harflerini açıkça ele alın. Varsayılan Unicode küçük harf dönüşümü Türkçe için yanlıştır.
- Sözcük tabanlı aramayı gömme vektörleriyle birleştirin; çünkü birçok sorgu sözcüğü kanıtta hiç geçmez.
- Yalnızca ortalamayı değil, soru başına sırayı karşılaştırın.

## Bu analiz neyi gösteremez?

- Her sorgu terimini tüm aday pasajlarla değil, doğru yanıtın kanıt aralığıyla karşılaştırır.
- MESA’nın atıf token’larını süzme adımını uygulamaz; atıf yoğun sorularda sayılar yaklaşıktır.
- Gerçek bir Türkçe kök bulucu veya biçimbilimsel çözümleyici denemedik.
- 112 soruda net iki soruluk değişim küçüktür; başka bir örneklemde korunmayabilir.
- Derlem hukuk metinlerinden oluşuyor; genel Türkçe farklı davranabilir.

## Kaynaklar

1. [SQLite FTS5 belgeleri](https://www.sqlite.org/fts5.html)
2. [Manning, Raghavan ve Schütze: Okapi BM25](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html)
3. [MESA 0.9.4 değişiklik günlüğü](https://github.com/Yasou13/MESA/blob/v0.9.4/CHANGELOG.md)

', ARRAY['bm25', 'turkish', 'tokenization', 'legal-search']::text[], 'MESA contributors', 8, 'published', 'Türkçe Metinlerde BM25 Neden Zorlanır?', 'Türkçe ekler tek sözcüğü onlarca dizin terimine böler. Sorunu hukuk metinlerinde ölçtük ve 5 karakterlik önek eşleştirmenin etkisini gösterdik.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('claude-code-persistent-memory', 'guide', 'en', 'How do you add persistent memory to Claude Code?', '', 'Combine CLAUDE.md, auto memory and searchable session history without loading everything into every conversation.', 'Put stable project rules in CLAUDE.md and let auto memory keep learned preferences. If you also need to find decisions and failed attempts from older sessions, add a local MCP memory server such as MESA Lore.', '## 1. Choose the right memory layer

Each Claude Code session starts with a fresh context window. Three layers can carry useful information forward, and they solve different problems.

| Layer | Keep here | Do not keep here |
| --- | --- | --- |
| CLAUDE.md | Build commands, conventions and project rules | Long logs or temporary task notes |
| Auto memory | Preferences and corrections Claude learns | Rules your whole team must follow |
| MESA Lore | Searchable past sessions, decisions and handoffs | A replacement for project instructions |

## 2. Put stable rules in CLAUDE.md

Create `CLAUDE.md` in the project root and keep it short. Write what you would otherwise repeat in each session. Anthropic’s documentation suggests keeping each CLAUDE.md under 200 lines.

```text
# Project rules
- Run npm test before finishing a change.
- Use TypeScript for new files.
- API handlers live in src/api/.
```

Run `/context all` in a session and check `Memory files` to confirm that it loaded.

## 3. Check auto memory

Auto memory is on by default in local sessions. Open `/memory` to view it or use its toggle. At session start, Claude Code loads up to the first 200 lines or 25KB of `MEMORY.md`.

> [!NOTE]
> **Keep it useful**
> Correct or remove notes that are outdated. A short, accurate memory is easier for the agent to follow.

## 4. Add searchable session history

Built-in memory is not a search index for everything that happened before. MESA Lore imports past transcripts into one local SQLite file. A new session gets a short index and can search for details when needed.

```text
git clone https://github.com/Yasou13/MESA_Lore.git
cd MESA_Lore
python3 -m venv .venv
.venv/bin/pip install .
.venv/bin/mesa-lore install
.venv/bin/mesa-lore doctor
```

`mesa-lore doctor` reports each connection. On a machine where nothing is configured yet, it prints:

```text
Schema version: v12
DB: ~/.local/share/mesa-lore/lore.db (4096 B), Last ingest: never
Claude Code MCP: missing | hooks: missing
Codex MCP: missing | hooks: missing
Antigravity MCP: missing | Claude Desktop MCP: missing
Warnings: none (0)
```

After a successful install, the Claude Code line changes to `Claude Code MCP: OK | hooks: OK` and `Last ingest` shows a time.

> [!WARNING]
> **Review what will be imported**
> Install imports existing Claude Code, Codex and Antigravity transcripts into the local database. [Exclude private projects](/docs/lore/data-and-privacy/) before you run it.

## 5. Test it in a new session

1. Start a new Claude Code session in the same project.
2. Ask: “Use memory_index and summarize the recent work in this project.”
3. Ask about a real earlier decision: “Search memory for why we changed the login flow.”
4. Open the returned source and confirm that it supports the answer.

If the tools are missing, run `mesa-lore doctor` and see [troubleshooting](/docs/lore/troubleshooting/).

> [!NOTE]
> **What the MESA Lore tests measured**
> From the mesa-lore 0.1.0 test suite and benchmark on Linux: session startup cost 432 tokens (163 for the index, 269 for tool definitions), and search p95 was 84 ms of CPU time on 10,000 chunks in one run. End-to-end token savings when resuming a session have not been measured. Search is lexical, so a query needs words or stems that appear in the transcript.

## What if memory does not work?

| What you see | Fix |
| --- | --- |
| `Claude Code MCP: missing` in `mesa-lore doctor` | Run `mesa-lore install` again and restart Claude Code |
| `Last ingest: never` | Install has not imported a transcript yet. Finish a session, then run `mesa-lore doctor` again |
| The memory tools exist but return nothing useful | Search with words that appear in the earlier session; Lore has no synonym matching |
| CLAUDE.md rules are ignored | Run `/context all` and check that the file is listed under Memory files |

More cases are in [MESA Lore troubleshooting](/docs/lore/troubleshooting/).

## Claude Code memory questions

**Does Claude Code remember previous sessions?**
: Each session starts fresh, but CLAUDE.md and auto memory can carry selected knowledge across sessions. They do not make every past message searchable.

**Should I put everything in CLAUDE.md?**
: No. It loads into each session, so keep it concise and limited to information that is useful every time.

**Does MESA Lore replace CLAUDE.md?**
: No. Keep instructions in CLAUDE.md and use Lore to find earlier work.

**Does this send my transcripts to another service?**
: MESA Lore makes no network calls. Claude Code still sends retrieved memory to its model provider as context.

## Sources

1. [Claude Code Docs · How Claude remembers your project](https://code.claude.com/docs/en/memory)
2. [MESA Lore on GitHub](https://github.com/Yasou13/MESA_Lore)

', ARRAY['claude-code', 'agent-memory', 'mcp']::text[], 'MESA contributors', 7, 'published', 'How to Add Persistent Memory to Claude Code — MESA', 'Use CLAUDE.md, auto memory and a local MCP memory server together so Claude Code can keep rules and find work from earlier sessions.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('claude-code-persistent-memory', 'guide', 'tr', 'Claude Code’a kalıcı hafıza nasıl eklenir?', '', 'CLAUDE.md, otomatik hafıza ve aranabilir oturum geçmişini her konuşmaya her şeyi yüklemeden birlikte kullanın.', 'Kalıcı proje kurallarını CLAUDE.md’ye yazın, öğrenilen tercihleri otomatik hafızaya bırakın. Eski oturumlardaki karar ve başarısız denemeleri de bulmak istiyorsanız MESA Lore gibi yerel bir MCP hafıza sunucusu ekleyin.', '## 1. Doğru hafıza katmanını seçin

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

', ARRAY['claude-code', 'agent-memory', 'mcp']::text[], 'MESA contributors', 7, 'published', 'Claude Code’a Kalıcı Hafıza Nasıl Eklenir? — MESA', 'CLAUDE.md, otomatik hafıza ve yerel MCP hafıza sunucusunu birlikte kullanarak Claude Code’un kuralları korumasını ve eski oturumları bulmasını sağlayın.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('codex-cli-mcp-memory', 'guide', 'en', 'How do you set up MCP memory for Codex CLI?', '', 'Keep instructions in AGENTS.md and add a local MCP server that can search earlier Codex sessions.', 'Keep project instructions in AGENTS.md. Install MESA Lore to add a local MCP memory server to Codex, approve its hooks with /hooks, then start a new session and test memory_search.', '## 1. Separate instructions from history

Codex reads `AGENTS.md` files before doing work, so use them for standards and project rules. A memory server has a different job: it helps the agent find what happened in earlier sessions.

| Need | Use |
| --- | --- |
| Rules for every task | AGENTS.md |
| Earlier decisions and failures | MCP memory |
| A note for the next session | Handoff in MESA Lore |

## 2. Install the MCP memory server

```text
git clone https://github.com/Yasou13/MESA_Lore.git
cd MESA_Lore
python3 -m venv .venv
.venv/bin/pip install .
.venv/bin/mesa-lore install
.venv/bin/mesa-lore doctor
```

Install adds a `mesa-lore` server to `~/.codex/config.toml`, the default Codex MCP configuration, and adds session hooks to `~/.codex/hooks.json`. It backs up changed files first. Codex can also read hooks from other places, such as a trusted project’s `.codex/hooks.json`; `~/.codex/hooks.json` is the default user location.

> [!WARNING]
> **Existing history is imported**
> Install also imports existing agent transcripts. [Exclude private projects](/docs/lore/data-and-privacy/) first.

## 3. Approve the hooks

Codex requires non-managed hooks to be reviewed and trusted before they run. Open Codex, run `/hooks` and approve the MESA Lore commands. Without approval, automatic capture and the session-start index do not run.

## 4. Verify the connection

```text
codex mcp list
mesa-lore doctor
```

`codex mcp list` should show `mesa-lore`. Inside Codex, `/mcp` shows active servers. `mesa-lore doctor` should report `OK` for Codex MCP and hooks.

After install and hook approval, the Codex line reads `Codex MCP: OK | hooks: OK (approve with /hooks in Codex)`. Before setup it reads `Codex MCP: missing | hooks: missing`.

## 5. Test memory in a new session

1. Start a new Codex session in the project.
2. Ask: “Call memory_index and summarize recent work.”
3. Ask: “Search memory for the last failed test fix.”
4. Check that the answer points to a real source.
5. Save a decision: “Save this as a decision in memory.”

> [!NOTE]
> **What the MESA Lore tests measured**
> From the mesa-lore 0.1.0 test suite and benchmark on Linux: session startup cost 432 tokens (163 for the index, 269 for tool definitions), and search p95 was 84 ms of CPU time on 10,000 chunks in one run. End-to-end token savings when resuming a session have not been measured. Search is lexical, so a query needs words or stems that appear in the transcript.

## What if Codex does not use memory?

| What you see | Fix |
| --- | --- |
| `codex mcp list` does not show `mesa-lore` | Run `mesa-lore install` again, then check `~/.codex/config.toml` |
| No memory index at session start | Approve the hooks with `/hooks`, then start a new session |
| `Codex MCP: missing` in `mesa-lore doctor` | The MCP entry is absent. Reinstall, or restore it from the backup that install made |
| Search finds nothing for a known decision | Use words from the original session; search is lexical |

More cases are in [MESA Lore troubleshooting](/docs/lore/troubleshooting/).

## Codex memory questions

**Where does Codex store MCP settings?**
: By default in `~/.codex/config.toml`. Trusted projects can also use `.codex/config.toml`.

**Does MESA Lore replace AGENTS.md?**
: No. AGENTS.md gives instructions. Lore makes past work searchable.

**Why is the memory index not appearing?**
: The hook may not be approved. Run `/hooks`, start a new session and check `mesa-lore doctor`.

**Can Codex and Claude Code share memory?**
: Yes. MESA Lore stores both agents in the same local database and searches by project.

## Sources

1. [Codex · Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
2. [Codex · Model Context Protocol](https://learn.chatgpt.com/docs/extend/mcp?surface=cli)
3. [Codex · Hooks](https://learn.chatgpt.com/docs/hooks)
4. [MESA Lore on GitHub](https://github.com/Yasou13/MESA_Lore)

', ARRAY['codex-cli', 'agent-memory', 'mcp']::text[], 'MESA contributors', 6, 'published', 'How to Set Up MCP Memory for Codex CLI — MESA', 'Add a local MCP memory server to Codex CLI, approve its hooks and search earlier sessions while keeping project rules in AGENTS.md.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('codex-cli-mcp-memory', 'guide', 'tr', 'Codex CLI için MCP hafızası nasıl kurulur?', '', 'Talimatları AGENTS.md’de tutun ve önceki Codex oturumlarını arayabilen yerel bir MCP sunucusu ekleyin.', 'Proje talimatlarını AGENTS.md’de tutun. Codex’e yerel MCP hafıza sunucusu eklemek için MESA Lore’u kurun, hook’larını /hooks ile onaylayın, sonra yeni oturum açıp memory_search aracını test edin.', '## 1. Talimatları geçmişten ayırın

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

Kurulum, Codex’in varsayılan MCP yapılandırması olan `~/.codex/config.toml` dosyasına `mesa-lore` sunucusunu, `~/.codex/hooks.json` dosyasına oturum hook’larını ekler. Değiştirdiği dosyaları önce yedekler. Codex hook’ları başka yerlerden de okuyabilir; örneğin güvenilir bir projenin `.codex/hooks.json` dosyası. `~/.codex/hooks.json` varsayılan kullanıcı konumudur.

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

Kurulum ve hook onayından sonra Codex satırı `Codex MCP: OK | hooks: OK (approve with /hooks in Codex)` olur. Kurulumdan önce `Codex MCP: missing | hooks: missing` yazar.

## 5. Hafızayı yeni oturumda test edin

1. Projede yeni bir Codex oturumu başlatın.
2. Şunu sorun: “memory_index çağır ve son çalışmaları özetle.”
3. Şunu sorun: “Son başarısız test düzeltmesini hafızada ara.”
4. Yanıtın gerçek bir kaynağa dayandığını kontrol edin.
5. Bir karar kaydedin: “Bunu hafızaya karar olarak kaydet.”

> [!NOTE]
> **MESA Lore testlerinin ölçtükleri**
> Linux üzerinde mesa-lore 0.1.0 test paketi ve benchmark’ına göre oturum başlangıcı 432 token tuttu (163’ü dizin, 269’u araç tanımları). Bir çalıştırmada 10.000 parçada arama p95 değeri 84 ms CPU süresiydi. Oturuma dönerken uçtan uca token tasarrufu henüz ölçülmedi. Arama sözcük tabanlıdır; sorguda dökümde geçen sözcükler veya kökler bulunmalıdır.

## Codex hafızayı kullanmazsa ne yapmalı?

| Gördüğünüz | Çözüm |
| --- | --- |
| `codex mcp list` çıktısında `mesa-lore` yok | `mesa-lore install` komutunu yeniden çalıştırın, sonra `~/.codex/config.toml` dosyasını kontrol edin |
| Oturum başında hafıza dizini yok | Hook’ları `/hooks` ile onaylayın ve yeni oturum açın |
| `mesa-lore doctor` çıktısında `Codex MCP: missing` | MCP kaydı yok. Yeniden kurun ya da kurulumun aldığı yedekten geri yükleyin |
| Bilinen bir karar için arama sonuç vermiyor | Asıl oturumdaki sözcüklerle arayın; arama sözcük tabanlıdır |

Diğer durumlar için [MESA Lore sorun giderme](/docs/lore/troubleshooting/) sayfasına bakın.

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

', ARRAY['codex-cli', 'agent-memory', 'mcp']::text[], 'MESA contributors', 6, 'published', 'Codex CLI için MCP Hafızası Nasıl Kurulur? — MESA', 'Codex CLI’a yerel MCP hafıza sunucusu ekleyin, hook’ları onaylayın ve proje kurallarını AGENTS.md’de tutarken eski oturumları arayın.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('source-backed-document-search', 'guide', 'en', 'How do you build source-backed document search?', '', 'Add a document with a source reference, search it locally, update it and check that results come from the current revision.', 'Install MESA Core, start the local server, add each text file with a stable --source value and search with mesa search. Results return the matching text and document ID, so you can check the answer against its source.', '## 1. Check what you need

- Python 3.11 or newer
- Linux, macOS or WSL
- UTF-8 text files. Convert PDF and Word files to text first.

This guide uses word search, so it needs no model account. MESA Core is alpha software and is not ready for production use.

Checked against `mesa-memory` 0.9.5 from PyPI on 24 November 2026, on Python 3.14. Your document IDs can differ.

## 2. Install and start MESA Core

Run this in a new folder and keep the terminal open.

```text
python3 -m venv .venv
. .venv/bin/activate
python -m pip install mesa-memory==0.9.5
mesa start
```

## 3. Add a document with its source

Open a second terminal in the same folder. Use a stable `--source`, because it identifies the document when you update or delete it.

First confirm that the server is ready:

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
printf ''%s\n'' ''Refunds are accepted within 30 days of purchase.'' ''Damaged items are replaced at no cost.'' > refund-policy.txt
mesa add refund-policy.txt --source file://refund-policy.txt
```

`mesa add` waits until the document is searchable:

```text
Added document doc-72f2f9bee031b87753ed5b3b1affae68 with 1 chunk(s)
searchable
```

## 4. Search and inspect the source

```text
mesa search "refund days"
```

A result looks like this. Your document ID can differ.

```text
[1] score: 0.016 | doc-72f2f9bee031b87753ed5b3b1affae68
    Refunds are accepted within 30 days of purchase.
    Damaged items are replaced at no cost.
```

With models off, BM25 is the only fused lane, so a first-place match scores 1/61, about 0.016. The number is a rank signal, not a quality grade.

> [!WARNING]
> **A score is not proof**
> The score orders results for this query. It is not a probability that the text is correct. Read the returned passage before using it.

> [!NOTE]
> **What we measured in MESA**
> Search results can carry extracted legal items. [We measured that extractor](/research/turkish-legal-citation-extraction/) on 150 labeled chunks (MESA 0.9.4): 357 correct items, 25 false positives, 18 misses.

## 5. Update the document

Add changed text with the same source. MESA creates a new revision of the same document, and search uses the current text.

```text
printf ''%s\n'' ''Refunds are accepted within 45 days of purchase.'' ''Damaged items are replaced at no cost.'' > refund-policy.txt
mesa add refund-policy.txt --source file://refund-policy.txt
mesa search "refund days"
```

The result should now say 45 days.

## 6. Delete by source

```text
mesa delete --source file://refund-policy.txt
```

Expected output, followed by the same search:

```text
Purged document doc-72f2f9bee031b87753ed5b3b1affae68
$ mesa search "refund days"
No matching memories found.
```

After deletion, the same search should no longer return the document. Then stop the server in the first terminal with Ctrl+C.

## What are the common errors and fixes?

| What you see | Cause | Fix |
| --- | --- | --- |
| `mesa add: error: the following arguments are required: --source` | No source reference | Add `--source`, for example `--source file://refund-policy.txt` |
| `File not found: nope.txt` | Wrong path | Check the file name and the current folder |
| `UnicodeDecodeError: ''utf-8'' codec can''t decode byte` | The file is not UTF-8 | Convert it first, as shown below |
| `No matching memories found.` | No document contains the query words | Try words that appear in the text, or enable a model for meaning-based search |

Older Turkish files are often saved as Windows-1254. In 0.9.5 such a file stops `mesa add` with a Python traceback rather than a short message. Convert it to UTF-8 and add the converted file:

```text
iconv -f WINDOWS-1254 -t UTF-8 notes.txt > notes-utf8.txt
mesa add notes-utf8.txt --source file://notes.txt
```

Turkish letters matter in queries. In our test on 0.9.5, `YARGITAY` and `sözleşme` found a line containing `Yargıtay` and `sözleşmesinin`, but the ASCII query `yargitay` found nothing. Type `ı`, `ğ`, `ş` and the other Turkish letters when you search. [Why BM25 Struggles With Turkish](/research/bm25-turkish-prefix-matching/) explains the cause.

## Document search questions

**Do I need embeddings to start?**
: No. Word search works without a model. Add a model provider later if you need meaning-based search.

**Can I add PDF files directly?**
: The CLI reads UTF-8 text files, so convert PDF and Word files first.

**Does MESA write the final answer?**
: No. It returns source text. Your application and language model write the answer.

## Sources

1. [MESA Core · Getting started](docs/core/getting-started/)
2. [MESA Core · CLI reference](docs/core/cli-reference/)
3. [mesa-memory 0.9.5 on PyPI](https://pypi.org/project/mesa-memory/0.9.5/)

', ARRAY['document-search', 'provenance', 'mesa-core']::text[], 'MESA contributors', 7, 'published', 'How to Build Source-Backed Document Search — MESA', 'Add text documents to MESA Core, search them locally, update a revision and verify that each result points back to its source.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('source-backed-document-search', 'guide', 'tr', 'Kaynak gösteren belge araması nasıl kurulur?', '', 'Belgeyi kaynak bilgisiyle ekleyin, yerelde arayın, güncelleyin ve sonuçların geçerli sürümden geldiğini kontrol edin.', 'MESA Core’u kurun, yerel sunucuyu başlatın, her metin dosyasını sabit bir --source değeriyle ekleyin ve mesa search ile arayın. Sonuçlar eşleşen metni ve belge kimliğini döndürür; böylece yanıtı kaynağıyla kontrol edebilirsiniz.', '## 1. Gerekenleri kontrol edin

- Python 3.11 veya daha yenisi
- Linux, macOS veya WSL
- UTF-8 metin dosyaları. PDF ve Word dosyalarını önce metne dönüştürün.

Bu rehber sözcük aramasını kullanır, bu yüzden model hesabı gerekmez. MESA Core alfa aşamasındadır ve canlı kullanıma hazır değildir.

24 Kasım 2026’da PyPI’daki `mesa-memory` 0.9.5 ile, Python 3.14 üzerinde denendi. Belge kimlikleriniz farklı olabilir.

## 2. MESA Core’u kurup başlatın

Bunu yeni bir klasörde çalıştırın ve terminali açık bırakın.

```text
python3 -m venv .venv
. .venv/bin/activate
python -m pip install mesa-memory==0.9.5
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
printf ''%s\n'' ''Refunds are accepted within 30 days of purchase.'' ''Damaged items are replaced at no cost.'' > refund-policy.txt
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
printf ''%s\n'' ''Refunds are accepted within 45 days of purchase.'' ''Damaged items are replaced at no cost.'' > refund-policy.txt
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
| `UnicodeDecodeError: ''utf-8'' codec can''t decode byte` | Dosya UTF-8 değil | Aşağıdaki gibi önce dönüştürün |
| `No matching memories found.` | Hiçbir belgede sorgu sözcükleri yok | Metinde geçen sözcükleri deneyin veya anlam tabanlı arama için bir model açın |

Eski Türkçe dosyalar çoğu zaman Windows-1254 kodlamasıyla kaydedilmiştir. 0.9.5’te böyle bir dosya `mesa add` komutunu kısa bir mesaj yerine Python hata dökümüyle durdurur. Dosyayı UTF-8’e dönüştürüp dönüştürülmüş dosyayı ekleyin:

```text
iconv -f WINDOWS-1254 -t UTF-8 notes.txt > notes-utf8.txt
mesa add notes-utf8.txt --source file://notes.txt
```

Sorgularda Türkçe harfler önemlidir. 0.9.5 üzerindeki denememizde `YARGITAY` ve `sözleşme` sorguları `Yargıtay` ve `sözleşmesinin` geçen satırı buldu; ASCII `yargitay` sorgusu ise hiçbir şey bulmadı. Ararken `ı`, `ğ`, `ş` ve diğer Türkçe harfleri kullanın. Nedenini [Türkçe Metinlerde BM25 Neden Zorlanır?](/research/bm25-turkish-prefix-matching/) yazısı açıklar.

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
3. [PyPI’da mesa-memory 0.9.5](https://pypi.org/project/mesa-memory/0.9.5/)

> [!NOTE]
> **MESA’da ne ölçtük?**
> Arama sonuçları çıkarılmış hukuki öğeler taşıyabilir. [Bu çıkarıcıyı](/research/turkish-legal-citation-extraction/) 150 etiketli parçada ölçtük (MESA 0.9.4): 357 doğru öğe, 25 yanlış sonuç, 18 eksik.

', ARRAY['document-search', 'provenance', 'mesa-core']::text[], 'MESA contributors', 7, 'published', 'Kaynak Gösteren Belge Araması Nasıl Kurulur? — MESA', 'Metin belgelerini MESA Core’a ekleyin, yerelde arayın, yeni sürüm yükleyin ve her sonucun kaynağına bağlandığını doğrulayın.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('measure-search-quality', 'guide', 'en', 'How do you measure search quality with Recall and MRR?', '', 'Create a small judged question set, record where the right document appears and compare two search settings.', 'Write real questions, mark the correct document for each and record its rank before and after a change. Recall@5 shows how often it appears in the top five. MRR shows how close to the top it appears.', '## 1. Write a small question set

Start with 20 to 50 questions from real use, then grow the set. Include exact terms, natural wording and questions with no answer in the documents.

- [ ] Each question has a known correct document or passage
- [ ] Questions were written before looking at the new results
- [ ] Easy and hard cases are both included
- [ ] The set is saved so that it can be reused

## 2. Change one thing

Compare one change at a time, such as chunk size, fusion weight or reranking. If several settings change together, you cannot tell which one helped.

## 3. Record the rank

Run each question and write the rank of the first correct result. Leave it empty if the result is missing. Save this example as `results.csv`.

```text
question,baseline,changed
q1,1,1
q2,3,2
q3,,4
q4,2,1
q5,6,
```

> [!NOTE]
> **What we measured in MESA**
> For a worked example of question rules, scoring and disclosure, see [how we built benchmark v2](/research/turkish-legal-benchmark-v2/).

## 4. Calculate Recall@5 and MRR

Each example question has one correct document, so Recall@5 is the share of questions answered in the top five. A result after rank five counts as a miss.

```text
import csv

K = 5
rows = list(csv.DictReader(open("results.csv", encoding="utf-8")))
for column in ("baseline", "changed"):
    ranks = [int(row[column]) if row[column] else None for row in rows]
    hits = [rank for rank in ranks if rank and rank <= K]
    recall = len(hits) / len(ranks)
    mrr = sum(1 / rank for rank in hits) / len(ranks)
    print(f"{column}: Recall@{K}={recall:.2f} MRR@{K}={mrr:.2f}")
```

Run it with `python3 evaluate.py`:

```text
baseline: Recall@5=0.60 MRR@5=0.37
changed: Recall@5=0.80 MRR@5=0.55
```

## 5. Read the result carefully

| Question | Baseline | Changed | What happened |
| --- | --- | --- | --- |
| q2 | 3 | 2 | Moved up |
| q3 | Missing | 4 | Newly found |
| q4 | 2 | 1 | Moved up |
| q5 | 6 | Missing | Still outside the top five |

The change improves both metrics in this illustrative data. Five questions are too few to prove a real improvement, so inspect failures and repeat on a larger set.

> [!WARNING]
> **Do not tune on your final test set**
> Keep some questions aside. If you repeatedly tune against the same questions, the score can improve without real search improving.

## What usually goes wrong?

| What you see | Cause | Fix |
| --- | --- | --- |
| `ValueError: invalid literal for int() with base 10` | A cell holds text instead of a rank | Use a whole number, or leave the cell empty for a miss |
| `KeyError: ''baseline''` | Column names differ, for example `Baseline` | Use the exact header `question,baseline,changed` |
| Scores change between two identical runs | Ties are broken by something random, such as generated IDs | Build the index twice and compare the ordered results before you trust a small gain |

The last case happened to us. Two fresh MESA stores built from the same documents scored 48/112 and 52/112 on Hit@5 before a tie-break fix (benchmark v2 dev, Tier M, models off). Read [why two identical search runs differed](/research/why-two-search-runs-differed/).

## Search evaluation questions

**What is a good MRR score?**
: There is no universal threshold. Compare systems on the same questions and documents.

**Recall or MRR: which matters more?**
: Recall shows whether the evidence was found. MRR shows how high it ranked. RAG systems usually need both.

**Should I use nDCG?**
: Use nDCG when results have graded relevance. See the [evaluation lesson](/learn/evaluating-ndcg-and-mrr-in-memory/).

## Sources

1. [MESA Learn · Evaluate retrieval](learn/evaluating-ndcg-and-mrr-in-memory/)
2. [MESA · Retrieval evaluation methodology](methodology/retrieval-evaluation/)

', ARRAY['evaluation', 'recall', 'mrr']::text[], 'MESA contributors', 7, 'published', 'How to Measure Search Quality with Recall and MRR — MESA', 'Build a small judged question set, record result ranks and compare two search settings with Recall@5 and MRR using a short Python script.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('measure-search-quality', 'guide', 'tr', 'Arama kalitesi Recall ve MRR ile nasıl ölçülür?', '', 'Küçük bir etiketli soru seti hazırlayın, doğru belgenin nerede çıktığını kaydedin ve iki arama ayarını karşılaştırın.', 'Gerçek sorular yazın, her biri için doğru belgeyi işaretleyin ve değişiklikten önce ve sonra sırasını kaydedin. Recall@5 doğru belgenin ne sıklıkla ilk beşte çıktığını, MRR ise zirveye ne kadar yakın olduğunu gösterir.', '## 1. Küçük bir soru seti yazın

Gerçek kullanımdan 20 ila 50 soruyla başlayın, sonra seti büyütün. Tam terimler, doğal ifadeler ve belgelerde yanıtı olmayan sorular ekleyin.

- [ ] Her sorunun bilinen doğru belgesi veya pasajı var
- [ ] Sorular yeni sonuçlara bakmadan önce yazıldı
- [ ] Kolay ve zor durumlar birlikte yer alıyor
- [ ] Set yeniden kullanılmak üzere kaydedildi

## 2. Tek bir şeyi değiştirin

Parça boyutu, birleştirme ağırlığı veya yeniden sıralama gibi tek bir değişikliği karşılaştırın. Birden fazla ayar birlikte değişirse hangisinin işe yaradığını bilemezsiniz.

## 3. Sırayı kaydedin

Her soruyu çalıştırın ve ilk doğru sonucun sırasını yazın. Sonuç yoksa boş bırakın. Bu örneği `results.csv` olarak kaydedin.

```text
question,baseline,changed
q1,1,1
q2,3,2
q3,,4
q4,2,1
q5,6,
```

## 4. Recall@5 ve MRR hesaplayın

Örnekteki her sorunun tek doğru belgesi olduğu için Recall@5, ilk beşte yanıtlanan soruların oranıdır. Beşinci sıradan sonraki sonuç kaçırılmış sayılır.

```text
import csv

K = 5
rows = list(csv.DictReader(open("results.csv", encoding="utf-8")))
for column in ("baseline", "changed"):
    ranks = [int(row[column]) if row[column] else None for row in rows]
    hits = [rank for rank in ranks if rank and rank <= K]
    recall = len(hits) / len(ranks)
    mrr = sum(1 / rank for rank in hits) / len(ranks)
    print(f"{column}: Recall@{K}={recall:.2f} MRR@{K}={mrr:.2f}")
```

`python3 evaluate.py` ile çalıştırın:

```text
baseline: Recall@5=0.60 MRR@5=0.37
changed: Recall@5=0.80 MRR@5=0.55
```

## 5. Sonucu dikkatle yorumlayın

| Soru | Önce | Sonra | Ne oldu? |
| --- | --- | --- | --- |
| q2 | 3 | 2 | Yükseldi |
| q3 | Yok | 4 | Yeni bulundu |
| q4 | 2 | 1 | Yükseldi |
| q5 | 6 | Yok | Hâlâ ilk beşin dışında |

Bu örnek veride değişiklik iki ölçüyü de iyileştiriyor. Beş soru gerçek bir iyileşmeyi kanıtlamak için azdır; hataları inceleyin ve daha büyük bir sette tekrarlayın.

> [!WARNING]
> **Son test setinizde ayar yapmayın**
> Bazı soruları ayrı tutun. Aynı sorulara göre tekrar tekrar ayar yaparsanız arama gerçekten iyileşmeden puan yükselebilir.

## En sık ne ters gider?

| Gördüğünüz | Neden | Çözüm |
| --- | --- | --- |
| `ValueError: invalid literal for int() with base 10` | Bir hücrede sıra yerine metin var | Tam sayı yazın; sonuç yoksa hücreyi boş bırakın |
| `KeyError: ''baseline''` | Sütun adları farklı, örneğin `Baseline` | Başlığı tam olarak `question,baseline,changed` yazın |
| Aynı iki çalıştırmada puanlar değişiyor | Eşitlikler rastgele bir şeyle, örneğin üretilen kimliklerle bozuluyor | Küçük bir kazanca güvenmeden önce dizini iki kez kurup sıralı sonuçları karşılaştırın |

Son durum bizim başımıza geldi. Aynı belgelerle sıfırdan kurulan iki MESA deposu, eşitlik bozma düzeltmesinden önce Hit@5’te 48/112 ve 52/112 aldı (benchmark v2 dev, Tier M, modeller kapalı). [Aynı aramanın neden farklı sonuç verdiğini](/research/why-two-search-runs-differed/) okuyun.

## Arama değerlendirmesi hakkında sorular

**İyi bir MRR değeri nedir?**
: Evrensel bir eşik yoktur. Sistemleri aynı soru ve belgelerle karşılaştırın.

**Recall mı MRR mi daha önemli?**
: Recall kanıtın bulunup bulunmadığını, MRR ne kadar üstte çıktığını gösterir. RAG sistemleri genellikle ikisine de ihtiyaç duyar.

**nDCG kullanmalı mıyım?**
: Sonuçların dereceli ilgililiği varsa nDCG kullanın. [Değerlendirme dersine](/learn/evaluating-ndcg-and-mrr-in-memory/) bakın.

## Kaynaklar

1. [MESA Learn · Arama kalitesini ölçmek](learn/evaluating-ndcg-and-mrr-in-memory/)
2. [MESA · Arama değerlendirme yöntemi](methodology/retrieval-evaluation/)

> [!NOTE]
> **MESA’da ne ölçtük?**
> Soru kuralları, puanlama ve açıklama için çalışılmış bir örnek olarak [benchmark v2’yi nasıl kurduğumuza](/research/turkish-legal-benchmark-v2/) bakın.

', ARRAY['evaluation', 'recall', 'mrr']::text[], 'MESA contributors', 7, 'published', 'Arama Kalitesi Recall ve MRR ile Nasıl Ölçülür? — MESA', 'Küçük bir etiketli soru seti hazırlayın, sonuç sıralarını kaydedin ve iki arama ayarını kısa bir Python betiğiyle Recall@5 ve MRR üzerinden karşılaştırın.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('verify-ai-yargitay-decision', 'guide', 'en', 'How do you verify an AI-cited Yargıtay decision?', '', 'Treat the citation as an unverified lead until its identity, official text, quoted passage and legal fit are checked.', 'Search the decision yourself in Yargıtay Karar Arama using its chamber, docket number, decision number and date. Then read the full text, find the quoted passage and check whether the decision really supports the claim. A decision that exists can still be the wrong authority.', '## Why an AI citation needs checking

A language model can produce a citation that looks correct while its number, chamber, date or quotation is wrong. According to [press reports](https://memurlar.net/haber/1170388/), an investigation was opened in Türkiye after Yargıtay decisions added to a petition with AI had incorrect docket and decision numbers.

> [!NOTE]
> **Scope of this guide**
> This guide explains a checking method and is not legal advice. MESA Law is a reference application and does not verify decisions for you. The lawyer or person relying on a citation remains responsible for checking it.

## 1. Capture the exact claim

Before searching, save exactly what the AI gave you. Do not correct or complete it yet, because the differences are part of the check.

- Court, board or chamber
- Docket (E.) and decision (K.) numbers
- Decision date
- Quoted passage, word for word
- The legal conclusion the AI drew from the decision

Missing identifiers are a warning, not an invitation to guess.

## 2. Search the official source

Open [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/) and use DETAYLI ARAMA. The form has fields for keyword, boards, civil chambers, criminal chambers, docket number, decision number and decision date.

1. Select the stated board or chamber.
2. Enter the docket number and search.
3. If nothing appears, search by decision number.
4. Then search a distinctive phrase from the quotation without any numbers.
5. Record what you searched and the date.

For regional appeal and first-instance civil decisions, use [UYAP Emsal Karar Arama](/law/guides/uyap-emsal-karar-dogrulama/).

## 3. Match identity and text

| Check | What must match |
| --- | --- |
| Court | Same board or chamber |
| Docket | Same year and sequence number |
| Decision | Same year and sequence number |
| Date | Same day, month and year |
| Quotation | Same words, in the same context |

If only some fields match, do not repair the citation yourself and continue. It may point to a different decision.

> [!NOTE]
> **What we measured in MESA**
> Software can find a citation but cannot confirm it. [MESA''s rule extractor](/research/turkish-legal-citation-extraction/) recognized decision references in labeled chunks, yet it does not check whether a decision exists.

## 4. Assess legal fit

> [!WARNING]
> **Existence is not relevance**
> A real decision can still be factually distinguishable, superseded, exceptional, or unrelated to the proposed conclusion.

Read the full decision. Identify the dispute, material facts, reasoning, result and procedural posture. Check whether the quoted sentence is the court’s own reasoning or a summary of a party’s argument or a lower court’s view. Then look for later or contrary decisions.

## If you cannot find the decision

Do not rely on it. A failed search does not prove by itself that the decision was invented, because a database may not contain every decision and numbers can be mistyped. Ask for a copy from the source that supplied it, check another reliable database, or remove the citation.

## 5. Record the verification trail

- [ ] Stable source or saved copy
- [ ] Identifiers and access date
- [ ] Exact supporting passage
- [ ] Reason the passage is relevant
- [ ] Contrary or limiting authority
- [ ] Reviewer and review date when the workflow requires one

## Sources

1. [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/)
2. [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/)
3. [Memurlar.net · Report on the AI-generated citation investigation](https://memurlar.net/haber/1170388/)

', ARRAY['legal-research', 'verification', 'provenance']::text[], 'MESA contributors', 7, 'published', 'How to Verify an AI-Cited Yargıtay Decision — MESA Law', 'Check an AI-cited Yargıtay decision step by step: find it in the official search, match its numbers, read the full text and test whether it supports the claim.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('verify-ai-yargitay-decision', 'guide', 'tr', 'Yapay zekânın verdiği Yargıtay kararı nasıl doğrulanır?', '', 'Kararın kimliğini, resmî metnini, alıntılanan bölümü ve somut olayla ilişkisini kontrol etmeden atfı doğrulanmış kabul etmeyin.', 'Kararı daire, esas numarası, karar numarası ve tarihle Yargıtay Karar Arama’da kendiniz arayın. Ardından tam metni okuyun, alıntıyı bulun ve kararın iddiayı gerçekten destekleyip desteklemediğini kontrol edin. Var olan bir karar da yanlış dayanak olabilir.', '## Yapay zekâ atfı neden kontrol edilmeli?

Dil modelleri doğru görünen bir atıf üretirken numarayı, daireyi, tarihi veya alıntıyı yanlış verebilir. [Basına yansıyan bir olayda](https://memurlar.net/haber/1170388/) dilekçeye yapay zekâ ile eklenen Yargıtay kararlarının esas ve karar numaralarının hatalı çıkması üzerine soruşturma başlatıldı.

> [!NOTE]
> **Bu rehberin kapsamı**
> Bu rehber bir kontrol yöntemini anlatır, hukuki danışmanlık değildir. MESA Law örnek bir uygulamadır ve kararları sizin yerinize doğrulamaz. Atfa dayanan avukat veya kişi, kontrol sorumluluğunu taşımaya devam eder.

## 1. İddiayı aynen kaydedin

Aramaya başlamadan önce yapay zekânın verdiği bilgiyi olduğu gibi saklayın. Henüz düzeltmeyin veya tamamlamayın, çünkü farklılıklar kontrolün parçasıdır.

- Mahkeme, kurul veya daire
- Esas (E.) ve karar (K.) numaraları
- Karar tarihi
- Kelimesi kelimesine alıntı
- Yapay zekânın karardan çıkardığı hukuki sonuç

Kimlik bilgilerinin eksik olması, tahmin ederek tamamlamanız gereken bir boşluk değil, doğrulama uyarısıdır.

## 2. Resmî kaynakta arayın

[Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/) sayfasını açın ve DETAYLI ARAMA bölümünü kullanın. Formda aranacak kelime, kurullar, hukuk daireleri, ceza daireleri, esas numarası, karar numarası ve karar tarihi alanları bulunur.

1. Belirtilen kurulu veya daireyi seçin.
2. Esas numarasını girip arayın.
3. Sonuç çıkmazsa karar numarasıyla arayın.
4. Ardından numaraları kullanmadan alıntıdaki ayırt edici bir ifadeyi arayın.
5. Neyi aradığınızı ve tarihi kaydedin.

Bölge adliye ve ilk derece hukuk kararları için [UYAP Emsal Karar Arama rehberine](/law/guides/uyap-emsal-karar-dogrulama/) bakın.

## 3. Kimliği ve metni eşleştirin

| Kontrol | Eşleşmesi gereken |
| --- | --- |
| Mahkeme | Aynı kurul veya daire |
| Esas | Aynı yıl ve sıra numarası |
| Karar | Aynı yıl ve sıra numarası |
| Tarih | Aynı gün, ay ve yıl |
| Alıntı | Aynı kelimeler, aynı bağlamda |

Yalnızca bazı alanlar eşleşiyorsa atfı kendiniz düzeltip devam etmeyin. Başka bir karara işaret ediyor olabilir.

## 4. Hukuki uygunluğu değerlendirin

> [!WARNING]
> **Var olmak, ilgili olmak değildir**
> Gerçek bir karar yine de olgusal olarak ayrışabilir, sonraki içtihatla aşılmış olabilir, istisnai olabilir veya önerilen sonuçla ilgisiz olabilir.

Kararın tamamını okuyun. Uyuşmazlığı, önemli olayları, gerekçeyi, sonucu ve usul durumunu belirleyin. Alıntılanan cümlenin mahkemenin kendi gerekçesi mi, yoksa taraf iddiasının ya da alt mahkeme görüşünün özeti mi olduğuna bakın. Sonra daha yeni veya aksi yöndeki kararları arayın.

## Kararı bulamazsanız ne yapmalısınız?

Karara dayanmayın. Aramada çıkmaması tek başına kararın uydurma olduğunu kanıtlamaz, çünkü bir veri tabanı her kararı içermeyebilir ve numara yanlış yazılmış olabilir. Atfı veren kaynaktan kararın örneğini isteyin, güvenilir başka bir veri tabanını kontrol edin ya da atfı çıkarın.

## 5. Doğrulama izini kaydedin

- [ ] Kalıcı kaynak bağlantısı veya saklanmış kopya
- [ ] Kimlik bilgileri ve erişim tarihi
- [ ] Tam destekleyici bölüm
- [ ] Bölümün neden ilgili olduğu
- [ ] Aksi yöndeki ya da kararı sınırlayan içtihat ve kaynaklar
- [ ] Gerekiyorsa incelemeyi yapan kişi ve inceleme tarihi

## Kaynaklar

1. [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/)
2. [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/)
3. [Memurlar.net · Yapay zekâ atfı soruşturması haberi](https://memurlar.net/haber/1170388/)

> [!NOTE]
> **MESA’da ne ölçtük?**
> Yazılım atıfı bulabilir ama doğrulayamaz. [MESA’nın kural çıkarıcısı](/research/turkish-legal-citation-extraction/) etiketli parçalarda karar künyelerini tanıdı; yine de kararın var olup olmadığını denetlemez.

', ARRAY['legal-research', 'verification', 'provenance']::text[], 'MESA contributors', 7, 'published', 'Yapay Zekânın Verdiği Yargıtay Kararı Nasıl Doğrulanır? — MESA Law', 'Yapay zekânın gösterdiği Yargıtay kararını resmî aramada bulun, esas ve karar numarasını eşleştirin, tam metni okuyun ve iddiayı destekleyip desteklemediğini kontrol edin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('uyap-emsal-karar-dogrulama', 'guide', 'en', 'How do you check a decision in UYAP Emsal?', '', 'Read the citation, choose the right search, enter its numbers and compare every detail with the full decision.', 'Open UYAP Emsal Karar Arama, choose the court group, enter the docket and decision numbers or a date range, and compare the result with the citation. Use Yargıtay Karar Arama first when the citation names a Yargıtay board or chamber.', '## Which search should you use?

| Citation names | Start with |
| --- | --- |
| A Yargıtay board or chamber | [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/) |
| A regional court of appeal (BAM) civil chamber | [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/) |
| A first-instance civil court | [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/) |

> [!NOTE]
> **Scope of this guide**
> This guide explains a checking method and is not legal advice. MESA Law is a reference application and does not verify decisions for you. The lawyer or person relying on a citation remains responsible for checking it.

## Read the citation first

A Turkish decision citation usually has this pattern. The example uses placeholders and is not a real decision.

| Part | Pattern | Meaning |
| --- | --- | --- |
| Court | X. Hukuk Dairesi | The court or chamber |
| Docket | YYYY/NNNN E. | The case file number (esas) |
| Decision | YYYY/NNNN K. | The decision number (karar) |
| Date | DD.MM.YYYY T. | The decision date (tarih) |

Two quick checks can reveal an error before you search. The docket year cannot be later than the decision year, and the decision number’s year should normally match the year of the decision date.

## Search step by step

[UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/) has a detailed query form with keyword, court, docket number, decision number, start date, end date and sort order fields.

1. Choose the court group, such as Bam Hukuk Mahkemeleri or Hukuk Mahkemeleri.
2. Enter the year and sequence of the docket number.
3. If there is no result, clear it and enter the decision number.
4. Narrow the search with a start and end date around the cited date.
5. Try a distinctive phrase from the quotation.
6. Complete any security step the site shows yourself, then open the decision.

## Compare the result

- [ ] Court and chamber are the same
- [ ] Docket year and number are the same
- [ ] Decision year and number are the same
- [ ] Decision date is the same
- [ ] The quoted passage appears in the text
- [ ] The passage supports the stated legal point

## What a search result does and does not show

> [!WARNING]
> **A result is not the end of the check**
> Finding a decision confirms that a matching record exists in that search. It does not show that the decision is final, still followed or applicable to your facts.

If nothing appears, do not conclude that the citation is fake from that alone. Check the numbers, try the other official search and ask for a copy from whoever supplied the citation. For the full review, follow the [AI-cited Yargıtay decision guide](/law/guides/yapay-zeka-yargitay-karari-dogrulama/).

## Sources

1. [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/)
2. [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/)

', ARRAY['legal-research', 'verification', 'provenance']::text[], 'MESA contributors', 5, 'published', 'How to Check a Decision in UYAP Emsal — MESA Law', 'Use UYAP Emsal Karar Arama to find a decision by court, docket number, decision number and date, then check its citation details against the full text.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('uyap-emsal-karar-dogrulama', 'guide', 'tr', 'UYAP Emsal’de karar nasıl aranır ve doğrulanır?', '', 'Künyeyi okuyun, doğru arama ekranını seçin, numaraları girin ve her bilgiyi kararın tam metniyle karşılaştırın.', 'UYAP Emsal Karar Arama’yı açın, mahkeme grubunu seçin, esas ve karar numarasını veya tarih aralığını girin ve sonucu künyeyle karşılaştırın. Künyede Yargıtay kurulu veya dairesi yazıyorsa önce Yargıtay Karar Arama’yı kullanın.', '## Hangi aramayı kullanmalısınız?

| Künyede yazan | Başlayacağınız yer |
| --- | --- |
| Yargıtay kurulu veya dairesi | [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/) |
| Bölge adliye mahkemesi (BAM) hukuk dairesi | [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/) |
| İlk derece hukuk mahkemesi | [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/) |

> [!NOTE]
> **Bu rehberin kapsamı**
> Bu rehber bir kontrol yöntemini anlatır, hukuki danışmanlık değildir. MESA Law örnek bir uygulamadır ve kararları sizin yerinize doğrulamaz. Atfa dayanan avukat veya kişi, kontrol sorumluluğunu taşımaya devam eder.

## Önce künyeyi okuyun

Türk mahkeme kararlarının künyesi genellikle aşağıdaki düzendedir. Örnekte yer tutucular kullanılmıştır, gerçek bir karar değildir.

| Bölüm | Düzen | Anlamı |
| --- | --- | --- |
| Mahkeme | X. Hukuk Dairesi | Kararı veren mahkeme veya daire |
| Esas | YYYY/NNNN E. | Dosyanın esas numarası |
| Karar | YYYY/NNNN K. | Kararın numarası |
| Tarih | GG.AA.YYYY T. | Karar tarihi |

İki hızlı kontrol, aramadan önce hatayı gösterebilir. Esas yılı karar yılından sonra olamaz. Karar numarasındaki yıl da normalde karar tarihinin yılıyla aynı olur.

## Adım adım arama

[UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/) sayfasındaki detaylı sorgulama formunda aranacak kelime, mahkeme, esas numarası, karar numarası, başlangıç tarihi, bitiş tarihi ve sıralama alanları bulunur.

1. Bam Hukuk Mahkemeleri veya Hukuk Mahkemeleri gibi mahkeme grubunu seçin.
2. Esas numarasının yılını ve sırasını girin.
3. Sonuç çıkmazsa bu alanı temizleyip karar numarasını girin.
4. Atıftaki tarihin çevresinde başlangıç ve bitiş tarihi vererek aramayı daraltın.
5. Alıntıdaki ayırt edici bir ifadeyi deneyin.
6. Sitenin gösterdiği güvenlik adımını kendiniz tamamlayıp kararı açın.

## Sonucu karşılaştırın

- [ ] Mahkeme ve daire aynı
- [ ] Esas yılı ve numarası aynı
- [ ] Karar yılı ve numarası aynı
- [ ] Karar tarihi aynı
- [ ] Alıntılanan bölüm metinde geçiyor
- [ ] Bölüm, ileri sürülen hukuki noktayı destekliyor

## Arama sonucu neyi gösterir, neyi göstermez?

> [!WARNING]
> **Sonuç bulmak kontrolün sonu değildir**
> Kararı bulmak, o aramada eşleşen bir kayıt olduğunu gösterir. Kararın kesinleştiğini, hâlâ uygulandığını veya sizin olayınıza uyduğunu göstermez.

Sonuç çıkmazsa yalnızca buna bakarak atfın sahte olduğu sonucuna varmayın. Numaraları kontrol edin, diğer resmî aramayı deneyin ve atfı verenden kararın örneğini isteyin. Tam inceleme için [yapay zekânın verdiği Yargıtay kararı rehberini](/law/guides/yapay-zeka-yargitay-karari-dogrulama/) izleyin.

## Kaynaklar

1. [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/)
2. [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/)

', ARRAY['legal-research', 'verification', 'provenance']::text[], 'MESA contributors', 5, 'published', 'UYAP Emsal Karar Nasıl Aranır ve Doğrulanır? — MESA Law', 'UYAP Emsal Karar Arama’da kararı mahkeme, esas numarası, karar numarası ve tarihle bulun; künyesini tam metinle adım adım karşılaştırın.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('yapay-zeka-hukuk-atif-hatalari', 'guide', 'en', 'What are the most common AI legal citation errors?', '', 'A citation can fail in several ways. Knowing the type of error tells you what to check next.', 'The main errors are invented decisions, wrong identifiers, altered quotations, real decisions that do not support the claim, and outdated legal sources. Check each citation for existence, identity, wording, relevance and currency.', '## Five errors at a glance

| Error | What it looks like | First check |
| --- | --- | --- |
| Invented decision | A complete citation with no matching record | Search the official source |
| Wrong identifier | A real decision with a wrong number, chamber or date | Compare every citation field |
| Altered quotation | A plausible sentence that is not in the text | Search the exact wording |
| Irrelevant authority | A real decision on different facts or issues | Read the reasoning |
| Outdated source | A repealed provision or abandoned approach | Check the current text and later decisions |

> [!NOTE]
> **Scope of this guide**
> This guide explains a checking method and is not legal advice. MESA Law is a reference application and does not verify decisions for you. The lawyer or person relying on a citation remains responsible for checking it.

## 1. Invented decisions

The citation has a convincing format, but no matching decision can be found. Search by number and by phrase in [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/) or [UYAP Emsal](https://emsal.uyap.gov.tr/). A failed search is a strong warning, but not final proof, so do not use the citation unless you obtain the decision.

## 2. Wrong numbers, chamber or date

The content may resemble a real decision while one identifier is wrong. Do not fix the number by guessing. Find the decision from another detail and confirm that every field and the text refer to the same decision.

## 3. Altered or merged quotations

AI output can paraphrase a passage but present it in quotation marks, or join sentences from different places. Search a short exact phrase, then read the paragraphs around it. Also confirm whose view the sentence states: the court, a party or a lower court.

## 4. Real decision, wrong use

> [!WARNING]
> **The hardest error to detect**
> Every identifier can be correct while the decision does not support the conclusion. Automated matching alone cannot settle this.

Compare the material facts, legal issue, procedural stage and result. Note any difference that could change the outcome.

## 5. Outdated law or case law

A model may rely on an older provision or an approach that later changed. Check the current legislation and search for newer decisions from the same chamber and higher boards before relying on it.

## A short check for every citation

1. Existence: Can you find it in a reliable source?
2. Identity: Do the court, numbers and date match?
3. Wording: Is the quotation exact?
4. Relevance: Does it support this claim on these facts?
5. Currency: Is it still good authority?

For the full method, read [how to verify an AI-cited Yargıtay decision](/law/guides/yapay-zeka-yargitay-karari-dogrulama/).

## Sources

1. [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/)
2. [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/)
3. [Memurlar.net · Report on the AI-generated citation investigation](https://memurlar.net/haber/1170388/)

', ARRAY['legal-research', 'verification', 'provenance']::text[], 'MESA contributors', 6, 'published', 'Common AI Legal Citation Errors and How to Spot Them — MESA Law', 'Learn the main AI legal citation errors: invented decisions, wrong numbers, altered quotations, irrelevant authority and outdated law, with a check for each.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('yapay-zeka-hukuk-atif-hatalari', 'guide', 'tr', 'Yapay zekânın en sık yaptığı hukuk atıf hataları nelerdir?', '', 'Bir atıf farklı şekillerde hatalı olabilir. Hatanın türünü bilmek, sonra neyi kontrol edeceğinizi gösterir.', 'Başlıca hatalar uydurma kararlar, yanlış künye bilgileri, değiştirilmiş alıntılar, iddiayı desteklemeyen gerçek kararlar ve güncel olmayan hukuki kaynaklardır. Her atıfta varlığı, kimliği, metni, ilgisi ve güncelliği kontrol edin.', '## Beş hata türü

| Hata | Nasıl görünür? | İlk kontrol |
| --- | --- | --- |
| Uydurma karar | Eşleşen kaydı olmayan eksiksiz bir künye | Resmî kaynakta arayın |
| Yanlış künye | Numarası, dairesi veya tarihi hatalı gerçek karar | Künyenin her alanını karşılaştırın |
| Değiştirilmiş alıntı | Metinde bulunmayan inandırıcı bir cümle | Tam ifadeyi arayın |
| İlgisiz içtihat | Farklı olay veya konudaki gerçek karar | Gerekçeyi okuyun |
| Güncel olmayan kaynak | Yürürlükten kalkmış hüküm veya terk edilmiş görüş | Güncel metni ve sonraki kararları kontrol edin |

> [!NOTE]
> **Bu rehberin kapsamı**
> Bu rehber bir kontrol yöntemini anlatır, hukuki danışmanlık değildir. MESA Law örnek bir uygulamadır ve kararları sizin yerinize doğrulamaz. Atfa dayanan avukat veya kişi, kontrol sorumluluğunu taşımaya devam eder.

## 1. Uydurma kararlar

Künye inandırıcı görünür, ama eşleşen karar bulunamaz. [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/) veya [UYAP Emsal](https://emsal.uyap.gov.tr/) üzerinde hem numarayla hem ifadeyle arayın. Sonuç çıkmaması güçlü bir uyarıdır, ama kesin kanıt değildir. Kararı temin edemiyorsanız atfı kullanmayın.

## 2. Yanlış numara, daire veya tarih

İçerik gerçek bir karara benzerken künyenin bir parçası hatalı olabilir. Numarayı tahminle düzeltmeyin. Kararı başka bir bilgiden bulun ve tüm alanların ve metnin aynı karara ait olduğunu doğrulayın.

## 3. Değiştirilmiş veya birleştirilmiş alıntılar

Yapay zekâ bir bölümü kendi cümleleriyle yazıp tırnak içinde verebilir ya da farklı yerlerdeki cümleleri birleştirebilir. Kısa ve tam bir ifadeyle arayın, ardından çevresindeki paragrafları okuyun. Cümlenin kimin görüşü olduğunu da doğrulayın: mahkeme, taraf veya alt mahkeme.

## 4. Gerçek karar, yanlış kullanım

> [!WARNING]
> **Fark edilmesi en zor hata**
> Künyenin tamamı doğru olduğu hâlde karar ileri sürülen sonucu desteklemeyebilir. Otomatik eşleştirme bunu tek başına çözemez.

Önemli olayları, hukuki sorunu, usul aşamasını ve sonucu karşılaştırın. Sonucu değiştirebilecek her farkı not edin.

## 5. Güncel olmayan mevzuat veya içtihat

Model eski bir hükme ya da sonradan değişen bir görüşe dayanabilir. Atfa güvenmeden önce güncel mevzuatı kontrol edin; aynı dairenin ve üst kurulların daha yeni kararlarını arayın.

## Her atıf için kısa kontrol

1. Varlık: Güvenilir bir kaynakta bulabiliyor musunuz?
2. Kimlik: Mahkeme, numaralar ve tarih eşleşiyor mu?
3. Metin: Alıntı birebir doğru mu?
4. İlgi: Bu olayda bu iddiayı destekliyor mu?
5. Güncellik: Hâlâ geçerli bir dayanak mı?

Yöntemin tamamı için [yapay zekânın verdiği Yargıtay kararı nasıl doğrulanır](/law/guides/yapay-zeka-yargitay-karari-dogrulama/) rehberini okuyun.

## Kaynaklar

1. [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/)
2. [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/)
3. [Memurlar.net · Yapay zekâ atfı soruşturması haberi](https://memurlar.net/haber/1170388/)

', ARRAY['legal-research', 'verification', 'provenance']::text[], 'MESA contributors', 6, 'published', 'Yapay Zekâ Hukuk Atıf Hataları ve Tespit Yöntemleri — MESA Law', 'Uydurma karar, yanlış numara, değiştirilmiş alıntı, ilgisiz içtihat ve güncel olmayan mevzuat gibi yapay zekâ atıf hatalarını nasıl fark edeceğinizi öğrenin.', true, '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z', '2026-11-23T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('read-turkish-court-citation', 'guide', 'en', 'How to Read a Turkish Court Citation', '', 'A Yargıtay citation names the court or chamber, an esas (E.) number, a karar (K.) number and a date. Match all of them before you rely on a decision.', 'Read the court or chamber first, then the esas (E.) number, then the karar (K.) number, then the decision date. Two decisions can share a number in different chambers or years, so all parts must match.', '## What does a Yargıtay citation contain?

A Yargıtay citation (künye) identifies one decision with four parts: the court or chamber, the esas number, the karar number and the decision date. A complete example from an official decision text is:

> [!NOTE]
> **Example**
> Yargıtay Ceza Genel Kurulu, 2017/885 E., 2021/693 K., 29.12.2021

> [!WARNING]
> **Not legal advice**
> This guide explains how to read and check official sources. It is not legal advice. For a decision that affects rights or deadlines, consult a qualified lawyer.

## What does each part mean?

| Part | In the example | What it tells you |
| --- | --- | --- |
| Court or chamber | Ceza Genel Kurulu | Which body decided. Chambers are numbered, such as 12. Ceza Dairesi or 3. Hukuk Dairesi. |
| Esas number (E.) | 2017/885 | The file number: the year the file was registered and its sequence number. |
| Karar number (K.) | 2021/693 | The decision number: the year of the decision and its sequence number. |
| Date | 29.12.2021 | The day of the decision. The text above ends with “29.12.2021 tarihinde yapılan müzakerede oy birliğiyle karar verildi”. |

Numbers are counted per court or chamber, so `2017/885 E.` can exist in many chambers. Never match on one number alone.

## Which abbreviations appear most often?

| Abbreviation | Meaning |
| --- | --- |
| HGK | Hukuk Genel Kurulu (Civil General Assembly) |
| CGK | Ceza Genel Kurulu (Criminal General Assembly) |
| İBK | İçtihadı Birleştirme Kurulu (Assembly for unifying case law) |
| E. / K. | Esas / Karar |
| HD / CD | Hukuk Dairesi / Ceza Dairesi, as in 3. HD or 12. CD |

## How do short forms and earlier decisions appear?

Decision texts often refer to earlier decisions in a shorter form. These lines come from the same official texts:

- `Kararı veren Yargıtay Dairesi: 12. Ceza Dairesi` and `Sayısı: 131-288` give the chamber and the numbers of the earlier decision under review, without years.
- `20.02.2019 tarih ve 84-14 sayı ile` refers to a decision by date and short numbers.
- `28/11/2017 gün ve 2016/1307 Esas, 2017/9551 Karar` spells the words out instead of using E. and K.

A short form is not enough to find a decision. Use it to locate the full citation in the decision text.

## How do you check a citation?

1. Write down the court or chamber, E. number, K. number and date exactly as given.
2. Search for the decision in [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/) or [UYAP Emsal](https://emsal.uyap.gov.tr/).
3. Confirm that all four parts match the decision you found.
4. Read the full text and check that it supports the claim.

The guide on [verifying an AI-cited Yargıtay decision](/law/guides/yapay-zeka-yargitay-karari-dogrulama/) covers the full process. [Common AI citation errors](/law/guides/yapay-zeka-hukuk-atif-hatalari/) shows what usually goes wrong.

## What can MESA do with citations?

MESA 0.9.4 recognizes decision references in Turkish text. In our labeled test it found all 38 labeled decision references across 150 chunks, with no false positives. It does not check whether a decision exists or supports a claim. See [how the extraction was measured](/research/turkish-legal-citation-extraction/).

## Sources

1. [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/)
2. [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/)
3. [Yargıtay](https://www.yargitay.gov.tr/)

', ARRAY['Yargıtay', 'mevzuat', 'künye', 'Resmî Gazete', 'legal research']::text[], 'MESA contributors', 6, 'published', 'How to Read a Turkish Court Citation — MESA Law', 'Read a Yargıtay citation: chamber, esas (E.) and karar (K.) numbers, decision date and short forms, with real examples from official decision texts.', true, '2026-11-24T00:00:00Z', '2026-11-24T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('read-turkish-court-citation', 'guide', 'tr', 'Yargıtay Kararı Künyesi Nasıl Okunur?', '', 'Yargıtay künyesi mahkemeyi veya daireyi, esas (E.) numarasını, karar (K.) numarasını ve tarihi gösterir. Bir karara dayanmadan önce hepsini eşleştirin.', 'Önce mahkemeyi veya daireyi, sonra esas (E.) numarasını, karar (K.) numarasını ve karar tarihini okuyun. Farklı daire veya yıllarda aynı numara bulunabileceği için tüm parçalar eşleşmelidir.', '## Yargıtay künyesinde neler bulunur?

Yargıtay künyesi tek bir kararı dört parçayla tanımlar: mahkeme veya daire, esas numarası, karar numarası ve karar tarihi. Resmî bir karar metninden tam bir örnek:

> [!NOTE]
> **Örnek**
> Yargıtay Ceza Genel Kurulu, 2017/885 E., 2021/693 K., 29.12.2021

> [!WARNING]
> **Hukuki tavsiye değildir**
> Bu rehber resmî kaynakları okumayı ve denetlemeyi anlatır; hukuki tavsiye değildir. Hakları veya süreleri etkileyen bir karar için yetkin bir avukata danışın.

## Her parça ne anlama gelir?

| Parça | Örnekte | Size ne söyler? |
| --- | --- | --- |
| Mahkeme veya daire | Ceza Genel Kurulu | Kararı hangi kurulun verdiğini. Daireler numaralıdır; örneğin 12. Ceza Dairesi veya 3. Hukuk Dairesi. |
| Esas numarası (E.) | 2017/885 | Dosya numarası: dosyanın kaydedildiği yıl ve sıra numarası. |
| Karar numarası (K.) | 2021/693 | Karar numarası: kararın verildiği yıl ve sıra numarası. |
| Tarih | 29.12.2021 | Kararın verildiği gün. Yukarıdaki metin “29.12.2021 tarihinde yapılan müzakerede oy birliğiyle karar verildi” cümlesiyle biter. |

Numaralar her mahkeme veya daire için ayrı sayılır; `2017/885 E.` birçok dairede bulunabilir. Tek bir numarayla eşleştirme yapmayın.

## En sık hangi kısaltmalar geçer?

| Kısaltma | Anlamı |
| --- | --- |
| HGK | Hukuk Genel Kurulu |
| CGK | Ceza Genel Kurulu |
| İBK | İçtihadı Birleştirme Kurulu |
| E. / K. | Esas / Karar |
| HD / CD | Hukuk Dairesi / Ceza Dairesi; örneğin 3. HD veya 12. CD |

## Kısa yazımlar ve önceki kararlar nasıl görünür?

Karar metinleri önceki kararlara çoğu zaman kısa biçimde atıf yapar. Şu satırlar aynı resmî metinlerden alındı:

- `Kararı veren Yargıtay Dairesi: 12. Ceza Dairesi` ve `Sayısı: 131-288`, incelenen önceki kararın dairesini ve yıl içermeyen numaralarını verir.
- `20.02.2019 tarih ve 84-14 sayı ile`, bir karara tarih ve kısa numaralarla atıf yapar.
- `28/11/2017 gün ve 2016/1307 Esas, 2017/9551 Karar`, E. ve K. yerine sözcükleri açık yazar.

Kısa yazım bir kararı bulmak için yetmez. Onu, karar metnindeki tam künyeyi bulmak için kullanın.

## Künye nasıl denetlenir?

1. Mahkemeyi veya daireyi, E. numarasını, K. numarasını ve tarihi verildiği gibi not edin.
2. Kararı [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/) veya [UYAP Emsal](https://emsal.uyap.gov.tr/) üzerinde arayın.
3. Dört parçanın da bulduğunuz kararla eşleştiğini doğrulayın.
4. Tam metni okuyun ve iddiayı destekleyip desteklemediğine bakın.

Sürecin tamamı [yapay zekânın gösterdiği Yargıtay kararını doğrulama](/law/guides/yapay-zeka-yargitay-karari-dogrulama/) rehberinde anlatılıyor. [Yapay zekâ atıf hataları](/law/guides/yapay-zeka-hukuk-atif-hatalari/) sık yapılan yanlışları gösterir.

## MESA künyelerle ne yapabilir?

MESA 0.9.4 Türkçe metindeki karar künyelerini tanır. Etiketli testimizde 150 parçadaki 38 etiketli karar künyesinin tamamını, yanlış sonuç vermeden buldu. Kararın var olup olmadığını veya iddiayı destekleyip desteklemediğini denetlemez. [Çıkarımın nasıl ölçüldüğüne](/research/turkish-legal-citation-extraction/) bakın.

## Kaynaklar

1. [Yargıtay Karar Arama](https://karararama.yargitay.gov.tr/)
2. [UYAP Emsal Karar Arama](https://emsal.uyap.gov.tr/)
3. [Yargıtay](https://www.yargitay.gov.tr/)

', ARRAY['Yargıtay', 'mevzuat', 'künye', 'Resmî Gazete', 'legal research']::text[], 'MESA contributors', 6, 'published', 'Yargıtay Kararı Künyesi Nasıl Okunur? — MESA Law', 'Yargıtay künyesindeki daire, esas (E.) ve karar (K.) numarası, karar tarihi ve kısa yazımları resmî karar metinlerinden gerçek örneklerle okuyun.', true, '2026-11-24T00:00:00Z', '2026-11-24T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('check-law-in-force-on-date', 'guide', 'en', 'Was a Turkish Law Article in Force on a Given Date?', '', 'Publication is not the same as entry into force. Check the yürürlük article, every amendment note on the article, the effective-date list and any Constitutional Court ruling.', 'Find the law on mevzuat.gov.tr, read its yürürlük article, check the notes on the article you need, read the effective-date list at the end of the text and check for Constitutional Court annulments. Then confirm in the Resmî Gazete.', '## How do you check whether an article was in force?

A law can be published on one date and apply from another, and each article can change separately. To know whether an article applied on a given date, check five things: the law’s own yürürlük article, the notes on that article, the effective-date list at the end of the consolidated text, any Constitutional Court annulment, and the Resmî Gazete.

> [!WARNING]
> **Not legal advice**
> This guide explains how to read and check official sources. It is not legal advice. For a decision that affects rights or deadlines, consult a qualified lawyer.

## 1. Read the law’s header

Consolidated texts on [Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/) start with the law’s number, adoption date and Resmî Gazete issue. For the Turkish Code of Obligations:

```text
Kanun Numarası: 6098
Kabul Tarihi: 11/1/2011
Yayımlandığı Resmî Gazete: Tarih: 4/2/2011 Sayı: 27836
```

The adoption date and the publication date are different. Neither tells you yet when the law took effect.

## 2. Read the yürürlük article

Near the end of each law, an article titled “Yürürlük” sets the effective date. Law 6098 was published on 4/2/2011, but its article 648 says: “Bu Kanun 1 Temmuz 2012 tarihinde yürürlüğe girer.”

Different articles can start on different dates. Law 6325 on mediation, published on 22/6/2012, says in article 37 that articles 28 to 32 and the transitional articles took effect on publication, and the other provisions one year after publication.

## 3. Check the notes on the article

Consolidated texts mark later changes in brackets. These are real notes from official texts:

| Note | Meaning |
| --- | --- |
| (Değişik: 2/7/2012-6352/53 md.) | Amended by article 53 of Law 6352 |
| (Ek: 3/5/2012-6302/3 md.) | Added by article 3 of Law 6302 |
| (Mülga: 18/6/2014-6545/103 md.) | Repealed by article 103 of Law 6545 |
| (Ek fıkra:4/3/2021-7292/19 md.) | A paragraph added by Law 7292 |

> [!WARNING]
> **The date in a note is not the effective date**
> For Law 6352, the note shows 2/7/2012, but Mevzuat Bilgi Sistemi lists its Resmî Gazete date as 05.07.2012 (issue 28344). Check the amending law’s own yürürlük article for the date it took effect.

## 4. Read the effective-date list

Many consolidated texts end with a list titled “… EK VE DEĞİŞİKLİK GETİREN MEVZUATIN VEYA ANAYASA MAHKEMESİ İPTAL KARARLARININ YÜRÜRLÜĞE GİRİŞ TARİHLERİNİ GÖSTERİR LİSTE”. It pairs each amending law with the articles it changed and their effective dates. For Law 6325, one row reads:

```text
7036    2, 4, 6, 8, 13, 15, 17, 18, 20, 28, 31, 36    25/10/2017
```

In the 31 consolidated law texts in our test corpus, 27 contained this list. When it is missing, read each amending law.

## 5. Check for a Constitutional Court annulment

An annulment note names the ruling, for example: “Anayasa Mahkemesinin 5/6/2008 tarihli ve E.: 2008/16, K.: 2008/116 sayılı Kararı ile iptal edilmiştir.”

Article 153 of the Constitution says annulled provisions cease to apply on the date the ruling is published in the Resmî Gazete. The Court can set a later date, at most one year after publication, and annulment rulings do not apply retroactively. So check the ruling’s own publication date and any deferral it sets.

## Can an article be in force and still not apply?

Yes. Transitional rules can suspend an article for certain cases. The consolidated text of Law 6098 lists, under “6098 SAYILI KANUNA İŞLENEMEYEN HÜKÜMLER”, a provision of Law 6217 under which certain articles of the Code did not apply for 8 years from 1/7/2012 to commercial leases where the tenant is a merchant or a legal person. Read these sections and the transitional articles (geçici maddeler).

## How do you read the earlier wording?

The consolidated text shows the current wording with notes. To read the wording that applied on an earlier date, open the original law and each amending law in the [Resmî Gazete](https://www.resmigazete.gov.tr/). Check the date range you need against each change. Record the sources you used.

## Can MESA answer this question?

Partly. MESA 0.9.5 does not decide when an article took effect: transitional rules, deferred commencement and annulments still have to be checked against the official sources above. What it can do is store each version you have checked and return the wording that was in force at an instant you give.

Upload every version of the article under the same `document_id`, with the date you established as a timezone-aware `metadata.valid_from`. Versions can be uploaded in any order. Then search with `valid_at`. This example uses a fictional rule from the Core documentation:

```text
from mesa_client import Mesa

mesa = Mesa()
for start, days in [("2025-06-01T00:00:00+03:00", 30), ("2024-01-01T00:00:00+03:00", 15)]:
    mesa.add(
        f"MADDE 1 - Arşiv başvuru süresi {days} gündür.",
        source=f"file://arsiv-{start[:10]}.txt",
        document_id="ornek-arsiv-yonetmeligi",
        title="Örnek Arşiv Yönetmeliği",
        metadata={"valid_from": start},
        wait=True,
    )

hit = mesa.search("Arşiv başvuru süresi", valid_at="2025-05-31T23:59:59+03:00")[0]
print(hit["evidence_span"])  # MADDE 1 - Arşiv başvuru süresi 15 gündür.
```

Intervals are half-open: at exactly `2025-06-01T00:00:00+03:00` the search returns the 30-day version, and one second earlier it returns the 15-day version. Results carry `revision_number`, `valid_from` and `valid_to`, so you can see which version answered. If the `valid_from` you entered is wrong, the answer is wrong too. See [versioned documents](/docs/core/concepts-and-ingestion/#guide-versioned-documents), and [how to track amendments](/law/guides/kanun-degisiklikleri-takip/) for following later changes.

## Sources

1. [Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/)
2. [Resmî Gazete](https://www.resmigazete.gov.tr/)
3. [Türkiye Cumhuriyeti Anayasası on Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=2709&MevzuatTur=1&MevzuatTertip=5)

', ARRAY['Yargıtay', 'mevzuat', 'künye', 'Resmî Gazete', 'legal research']::text[], 'MESA contributors', 7, 'published', 'Was a Turkish Law in Force on a Date? — MESA Law', 'Check whether a Turkish law article applied on a date: the yürürlük article, amendment notes, the effective-date list and Constitutional Court rulings.', true, '2026-11-24T00:00:00Z', '2026-11-24T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('check-law-in-force-on-date', 'guide', 'tr', 'Kanun Maddesi Belirli Bir Tarihte Yürürlükte miydi?', '', 'Yayımlanmak yürürlüğe girmekle aynı şey değildir. Yürürlük maddesini, maddedeki değişiklik notlarını, yürürlük listesini ve Anayasa Mahkemesi kararlarını denetleyin.', 'Kanunu mevzuat.gov.tr’de bulun, yürürlük maddesini okuyun, ihtiyaç duyduğunuz maddedeki notları kontrol edin, metnin sonundaki yürürlük listesine bakın ve Anayasa Mahkemesi iptallerini denetleyin. Ardından Resmî Gazete’den doğrulayın.', '## Bir maddenin yürürlükte olup olmadığını nasıl denetlersiniz?

Bir kanun bir tarihte yayımlanıp başka bir tarihten itibaren uygulanabilir; her madde de ayrı ayrı değişebilir. Bir maddenin belirli bir tarihte uygulanıp uygulanmadığını anlamak için beş şeye bakın: kanunun yürürlük maddesi, o maddedeki notlar, işlenmiş metnin sonundaki yürürlük listesi, varsa Anayasa Mahkemesi iptali ve Resmî Gazete.

> [!WARNING]
> **Hukuki tavsiye değildir**
> Bu rehber resmî kaynakları okumayı ve denetlemeyi anlatır; hukuki tavsiye değildir. Hakları veya süreleri etkileyen bir karar için yetkin bir avukata danışın.

## 1. Kanunun başlık bilgilerini okuyun

[Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/) üzerindeki işlenmiş metinler kanun numarası, kabul tarihi ve Resmî Gazete sayısıyla başlar. Türk Borçlar Kanunu için:

```text
Kanun Numarası: 6098
Kabul Tarihi: 11/1/2011
Yayımlandığı Resmî Gazete: Tarih: 4/2/2011 Sayı: 27836
```

Kabul tarihi ile yayım tarihi farklıdır. İkisi de kanunun ne zaman uygulanmaya başladığını henüz söylemez.

## 2. Yürürlük maddesini okuyun

Her kanunun sonlarında “Yürürlük” başlıklı bir madde yürürlük tarihini belirler. 6098 sayılı Kanun 4/2/2011’de yayımlandı; ama 648. maddesi şöyle der: “Bu Kanun 1 Temmuz 2012 tarihinde yürürlüğe girer.”

Farklı maddeler farklı tarihlerde başlayabilir. 22/6/2012’de yayımlanan 6325 sayılı Arabuluculuk Kanunu’nun 37. maddesine göre 28 ilâ 32. maddeler ile geçici maddeler yayımı tarihinde, diğer hükümler ise yayımından bir yıl sonra yürürlüğe girdi.

## 3. Maddedeki notları kontrol edin

İşlenmiş metinler sonraki değişiklikleri parantez içinde gösterir. Şunlar resmî metinlerden alınmış gerçek notlardır:

| Not | Anlamı |
| --- | --- |
| (Değişik: 2/7/2012-6352/53 md.) | 6352 sayılı Kanunun 53. maddesiyle değiştirildi |
| (Ek: 3/5/2012-6302/3 md.) | 6302 sayılı Kanunun 3. maddesiyle eklendi |
| (Mülga: 18/6/2014-6545/103 md.) | 6545 sayılı Kanunun 103. maddesiyle yürürlükten kaldırıldı |
| (Ek fıkra:4/3/2021-7292/19 md.) | 7292 sayılı Kanunla fıkra eklendi |

> [!WARNING]
> **Nottaki tarih yürürlük tarihi değildir**
> 6352 sayılı Kanun için not 2/7/2012 tarihini gösterir; Mevzuat Bilgi Sistemi ise Resmî Gazete tarihini 05.07.2012 (sayı 28344) olarak verir. Değişikliğin yürürlük tarihi için değiştiren kanunun kendi yürürlük maddesine bakın.

## 4. Yürürlük listesini okuyun

Birçok işlenmiş metin “… EK VE DEĞİŞİKLİK GETİREN MEVZUATIN VEYA ANAYASA MAHKEMESİ İPTAL KARARLARININ YÜRÜRLÜĞE GİRİŞ TARİHLERİNİ GÖSTERİR LİSTE” başlıklı bir listeyle biter. Liste her değiştiren kanunu, değiştirdiği maddeler ve yürürlük tarihleriyle eşleştirir. 6325 sayılı Kanunda bir satır şöyle:

```text
7036    2, 4, 6, 8, 13, 15, 17, 18, 20, 28, 31, 36    25/10/2017
```

Test derlemimizdeki 31 işlenmiş kanun metninin 27’sinde bu liste vardı. Liste yoksa her değiştiren kanunu okuyun.

## 5. Anayasa Mahkemesi iptalini kontrol edin

İptal notu kararı adıyla anar; örneğin: “Anayasa Mahkemesinin 5/6/2008 tarihli ve E.: 2008/16, K.: 2008/116 sayılı Kararı ile iptal edilmiştir.”

Anayasa’nın 153. maddesine göre iptal edilen hükümler, iptal kararının Resmî Gazete’de yayımlandığı tarihte yürürlükten kalkar. Mahkeme, yayımdan başlayarak bir yılı geçmemek üzere daha sonraki bir tarih belirleyebilir; iptal kararları geriye yürümez. Bu yüzden kararın yayım tarihine ve varsa ertelediği tarihe bakın.

## Bir madde yürürlükte olup yine de uygulanmayabilir mi?

Evet. Geçiş hükümleri bir maddeyi belirli durumlar için askıya alabilir. 6098 sayılı Kanunun işlenmiş metni, “6098 SAYILI KANUNA İŞLENEMEYEN HÜKÜMLER” başlığı altında 6217 sayılı Kanunun bir hükmünü gösterir. Bu hükme göre Kanunun bazı maddeleri, kiracının tacir veya tüzel kişi olduğu işyeri kiralarında 1/7/2012’den itibaren 8 yıl süreyle uygulanmadı. Bu bölümleri ve geçici maddeleri mutlaka okuyun.

## Eski metni nasıl okursunuz?

İşlenmiş metin güncel hükmü notlarla birlikte gösterir. Daha önceki bir tarihte uygulanan metni okumak için asıl kanunu ve her değiştiren kanunu [Resmî Gazete](https://www.resmigazete.gov.tr/) üzerinden açın. İhtiyaç duyduğunuz tarih aralığını her değişiklikle karşılaştırın ve kullandığınız kaynakları kaydedin.

## MESA bu soruyu yanıtlayabilir mi?

Kısmen. MESA 0.9.5 bir maddenin ne zaman yürürlüğe girdiğine karar vermez: geçiş hükümleri, ertelenmiş yürürlük ve iptal kararları yine yukarıdaki resmî kaynaklardan denetlenmelidir. Yapabildiği, denetlediğiniz her sürümü saklamak ve verdiğiniz bir anda yürürlükte olan metni döndürmektir.

Maddenin her sürümünü aynı `document_id` altında, belirlediğiniz tarihi saat dilimi içeren bir `metadata.valid_from` olarak vererek yükleyin. Sürümler herhangi bir sırayla yüklenebilir. Ardından `valid_at` ile arayın. Bu örnek, Core belgelerindeki kurgusal bir kuralı kullanır:

```text
from mesa_client import Mesa

mesa = Mesa()
for start, days in [("2025-06-01T00:00:00+03:00", 30), ("2024-01-01T00:00:00+03:00", 15)]:
    mesa.add(
        f"MADDE 1 - Arşiv başvuru süresi {days} gündür.",
        source=f"file://arsiv-{start[:10]}.txt",
        document_id="ornek-arsiv-yonetmeligi",
        title="Örnek Arşiv Yönetmeliği",
        metadata={"valid_from": start},
        wait=True,
    )

hit = mesa.search("Arşiv başvuru süresi", valid_at="2025-05-31T23:59:59+03:00")[0]
print(hit["evidence_span"])  # MADDE 1 - Arşiv başvuru süresi 15 gündür.
```

Aralıklar yarı açıktır: tam `2025-06-01T00:00:00+03:00` anında arama 30 günlük sürümü, bir saniye önce ise 15 günlük sürümü döndürür. Sonuçlar `revision_number`, `valid_from` ve `valid_to` taşır; hangi sürümün yanıt verdiğini görebilirsiniz. Girdiğiniz `valid_from` yanlışsa yanıt da yanlış olur. Bkz. [sürümlü belgeler](/docs/core/concepts-and-ingestion/#guide-surumlu-belgeler); sonraki değişiklikleri izlemek için [kanun değişikliklerini takip etme](/law/guides/kanun-degisiklikleri-takip/) rehberine bakın.

## Kaynaklar

1. [Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/)
2. [Resmî Gazete](https://www.resmigazete.gov.tr/)
3. [Mevzuat Bilgi Sistemi’nde Türkiye Cumhuriyeti Anayasası](https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=2709&MevzuatTur=1&MevzuatTertip=5)

', ARRAY['Yargıtay', 'mevzuat', 'künye', 'Resmî Gazete', 'legal research']::text[], 'MESA contributors', 7, 'published', 'Kanun Maddesi Belirli Tarihte Yürürlükte miydi?', 'Bir kanun maddesinin belirli bir tarihte uygulanıp uygulanmadığını yürürlük maddesi, değişiklik notları, yürürlük listesi ve AYM kararlarıyla denetleyin.', true, '2026-11-24T00:00:00Z', '2026-11-24T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('track-turkish-law-amendments', 'guide', 'en', 'How to Track Changes to a Turkish Law', '', 'Consolidated texts mark each change with a note that names the amending law and article. Use those notes to find the amending law, its effective date and the old wording.', 'Read the bracketed notes in the consolidated text, open each amending law in the Resmî Gazete, check its yürürlük article, and record every change you checked with its source.', '## How do you follow changes to a law?

Each change in a consolidated Turkish law is marked with a note that names the amending law and article. Follow each note to the amending law in the Resmî Gazete, check when it took effect, and keep a dated record of what you checked.

> [!WARNING]
> **Not legal advice**
> This guide explains how to read and check official sources. It is not legal advice. For a decision that affects rights or deadlines, consult a qualified lawyer.

## 1. Learn the note types

| Note type | Real example | What changed |
| --- | --- | --- |
| Değişik | (Değişik: 10/6/1994-4001/1 md.) | Wording replaced |
| Ek | (Ek: 29/12/2005-5444/2 md.) | Article or text added |
| Ek fıkra | (Ek fıkra:17/1/2019-7161/1 md.) | Paragraph added |
| Mülga | (Mülga: 2/7/2018 - KHK-703/185 md.) | Repealed, here by a decree-law |
| Combined | (Ek: 12/3/1985 - 3163/1 md.; Mülga son fıkra: 15/1/2009-5831/1 md.) | Added, then its last paragraph repealed |

Read the pattern as date, amending law number and article. In `6352/53`, 6352 is the law and 53 its article. Spacing varies between texts, as in `(Değişik:6/3/1981-2421/1 md.)`, so search for the law number rather than the exact string.

## 2. Open the amending law

Search for the amending law by number in [Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/) and open its [Resmî Gazete](https://www.resmigazete.gov.tr/) issue. The date in the note may not match: Law 6352’s notes show 2/7/2012, while its Resmî Gazete date is 05.07.2012, issue 28344.

Read the amending law’s yürürlük article. It can set different dates for different articles. [Checking whether an article was in force](/law/guides/kanun-maddesi-yururluk-tarihi/) explains these steps in detail.

## 3. Use the lists at the end of the text

- The effective-date list pairs each amending law or annulment ruling with the changed articles and their effective dates.
- The section on provisions that could not be incorporated (“İŞLENEMEYEN HÜKÜMLER”) holds rules in other laws that still affect this one.
- Annulment notes cite the Constitutional Court ruling by date, E. and K. numbers.

## 4. Keep a record

For each change, record the article, the note, the amending law, its Resmî Gazete date and issue, the effective date, and the date you checked. Keep a link or copy of each source. A record lets someone else repeat the check and shows when it needs updating.

```text
Article: 6325 md. 18
Note: amended by 7036
Amending law RG: (date, issue)
Effective: 25/10/2017 (list at end of 6325)
Checked: 2026-11-24, mevzuat.gov.tr
```

## Can MESA track amendments for me?

Not as a legal service. MESA 0.9.5 does not watch the Resmî Gazete or decide which version applies. It can keep every version you have checked: upload each one under the same `document_id` with `metadata.valid_from` set to the date it took effect. MESA orders versions by that date rather than by upload order, so you can add an older text later and it becomes history. A search with `valid_at` then returns the wording in force at that instant, and a search without a date returns the current version. See [checking an article in force on a date](/law/guides/yururluk-kontrolu/) for an example, and [how citations are extracted](/research/turkish-legal-citation-extraction/) for what MESA recognizes in legal text.

## Sources

1. [Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/)
2. [Resmî Gazete](https://www.resmigazete.gov.tr/)
3. [Constitution of the Republic of Türkiye on Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=2709&MevzuatTur=1&MevzuatTertip=5)

', ARRAY['Yargıtay', 'mevzuat', 'künye', 'Resmî Gazete', 'legal research']::text[], 'MESA contributors', 5, 'published', 'How to Track Changes to a Turkish Law — MESA Law', 'Read amendment notes in Turkish consolidated laws, find the amending law and its effective date, and keep a record of the changes you checked.', true, '2026-11-24T00:00:00Z', '2026-11-24T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('track-turkish-law-amendments', 'guide', 'tr', 'Kanun Değişiklikleri Nasıl Takip Edilir?', '', 'İşlenmiş metinler her değişikliği, değiştiren kanunu ve maddeyi gösteren bir notla işaretler. Bu notlarla değiştiren kanunu, yürürlük tarihini ve eski metni bulun.', 'İşlenmiş metindeki parantez içi notları okuyun, her değiştiren kanunu Resmî Gazete’de açın, yürürlük maddesine bakın ve denetlediğiniz her değişikliği kaynağıyla kaydedin.', '## Bir kanundaki değişiklikler nasıl izlenir?

İşlenmiş bir Türk kanunundaki her değişiklik, değiştiren kanunu ve maddeyi gösteren bir notla işaretlenir. Her notu Resmî Gazete’deki değiştiren kanuna kadar izleyin, ne zaman yürürlüğe girdiğini kontrol edin ve neyi denetlediğinizi tarihiyle kaydedin.

> [!WARNING]
> **Hukuki tavsiye değildir**
> Bu rehber resmî kaynakları okumayı ve denetlemeyi anlatır; hukuki tavsiye değildir. Hakları veya süreleri etkileyen bir karar için yetkin bir avukata danışın.

## 1. Not türlerini öğrenin

| Not türü | Gerçek örnek | Ne değişti? |
| --- | --- | --- |
| Değişik | (Değişik: 10/6/1994-4001/1 md.) | Metin değiştirildi |
| Ek | (Ek: 29/12/2005-5444/2 md.) | Madde veya metin eklendi |
| Ek fıkra | (Ek fıkra:17/1/2019-7161/1 md.) | Fıkra eklendi |
| Mülga | (Mülga: 2/7/2018 - KHK-703/185 md.) | Yürürlükten kaldırıldı; burada bir KHK ile |
| Birleşik | (Ek: 12/3/1985 - 3163/1 md.; Mülga son fıkra: 15/1/2009-5831/1 md.) | Eklendi, sonra son fıkrası kaldırıldı |

Kalıbı tarih, değiştiren kanun numarası ve madde olarak okuyun. `6352/53` ifadesinde 6352 kanunu, 53 ise maddesini gösterir. Boşluklar metinden metne değişir; örneğin `(Değişik:6/3/1981-2421/1 md.)`. Bu yüzden tam ifade yerine kanun numarasını arayın.

## 2. Değiştiren kanunu açın

Değiştiren kanunu [Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/) üzerinde numarasıyla arayın ve [Resmî Gazete](https://www.resmigazete.gov.tr/) sayısını açın. Nottaki tarih bununla aynı olmayabilir: 6352 sayılı Kanunun notlarında 2/7/2012 yazar; Resmî Gazete tarihi ise 05.07.2012, sayısı 28344’tür.

Değiştiren kanunun yürürlük maddesini okuyun; farklı maddeler için farklı tarihler koyabilir. [Bir maddenin yürürlükte olup olmadığını denetleme](/law/guides/kanun-maddesi-yururluk-tarihi/) rehberi bu adımları ayrıntılı anlatır.

## 3. Metnin sonundaki listeleri kullanın

- Yürürlük listesi, her değiştiren kanunu veya iptal kararını değişen maddeler ve yürürlük tarihleriyle eşleştirir.
- “İŞLENEMEYEN HÜKÜMLER” bölümü, başka kanunlarda yer alıp bu kanunu hâlâ etkileyen kuralları gösterir.
- İptal notları Anayasa Mahkemesi kararını tarih, E. ve K. numarasıyla anar.

## 4. Kayıt tutun

Her değişiklik için maddeyi, notu, değiştiren kanunu, Resmî Gazete tarih ve sayısını, yürürlük tarihini ve denetlediğiniz günü yazın. Her kaynağın bağlantısını veya kopyasını saklayın. Kayıt, başka birinin denetimi tekrarlamasını sağlar ve ne zaman güncellenmesi gerektiğini gösterir.

```text
Madde: 6325 md. 18
Not: 7036 ile değişti
Değiştiren kanun RG: (tarih, sayı)
Yürürlük: 25/10/2017 (6325 sonundaki liste)
Denetim: 2026-11-24, mevzuat.gov.tr
```

## MESA değişiklikleri benim için izleyebilir mi?

Hukuki bir hizmet olarak hayır. MESA 0.9.5 Resmî Gazete’yi izlemez ve hangi sürümün uygulanacağına karar vermez. Denetlediğiniz her sürümü saklayabilir: her birini aynı `document_id` altında, yürürlüğe girdiği tarihi `metadata.valid_from` olarak vererek yükleyin. MESA sürümleri yükleme sırasına göre değil bu tarihe göre sıralar; eski bir metni sonradan eklerseniz geçmişe yerleşir. `valid_at` ile yapılan arama o anda yürürlükte olan metni, tarihsiz arama ise güncel sürümü döndürür. Örnek için [bir maddenin belirli bir tarihte yürürlükte olup olmadığını denetleme](/law/guides/yururluk-kontrolu/) rehberine, MESA’nın hukuk metninde neleri tanıdığı için [atıfların nasıl çıkarıldığına](/research/turkish-legal-citation-extraction/) bakın.

## Kaynaklar

1. [Mevzuat Bilgi Sistemi](https://www.mevzuat.gov.tr/)
2. [Resmî Gazete](https://www.resmigazete.gov.tr/)
3. [Mevzuat Bilgi Sistemi’nde Türkiye Cumhuriyeti Anayasası](https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=2709&MevzuatTur=1&MevzuatTertip=5)

', ARRAY['Yargıtay', 'mevzuat', 'künye', 'Resmî Gazete', 'legal research']::text[], 'MESA contributors', 5, 'published', 'Kanun Değişiklikleri Nasıl Takip Edilir? — MESA Law', 'İşlenmiş kanun metinlerindeki değişiklik notlarını okuyun, değiştiren kanunu ve yürürlük tarihini bulun, denetlediğiniz değişiklikleri kaydedin.', true, '2026-11-24T00:00:00Z', '2026-11-24T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('provenance', 'glossary', 'en', 'Provenance', '', 'Provenance is the recorded origin and processing history of information.', 'It answers where information came from, which version was used, how it was transformed, and which evidence supports its use.', '## Simple explanation

**Provenance**
: A trace from a claim or retrieved item back to its source identity and relevant processing steps.

## Legal example

For a cited decision, provenance may include the court, chamber, docket and decision identifiers, date, source URL or preserved artifact, retrieval date, document version, and exact supporting span.

## Technical explanation

In a retrieval system, provenance can connect a result to document, revision, chunk, evidence span, pipeline version, model version, authorization scope, and contributing retrieval signals.

## Why it matters

Without provenance, a plausible answer may be difficult to inspect, reproduce, correct, or safely rely on.

', ARRAY['provenance', 'evidence']::text[], 'MESA contributors', 4, 'published', 'Provenance — MESA Glossary', 'Learn what provenance means in legal AI, retrieval, and evidence-aware memory systems.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('provenance', 'glossary', 'tr', 'Kaynak izi nedir?', '', 'Kaynak izi, bilginin nereden geldiğini ve bugünkü hâline gelene kadar hangi işlemlerden geçtiğini gösteren kayıttır.', 'Bilginin nereden geldiğini, hangi sürümün kullanıldığını, nasıl dönüştürüldüğünü ve kullanımını hangi kanıtın desteklediğini açıklar.', '## Basit açıklama

**Kaynak izi**
: Bir iddia veya arama sonucundan kaynak kimliğine ve ilgili işleme adımlarına uzanan iz.

## Hukuki örnek

Bir yargı kararının kaynak izi; mahkeme ve daireyi, esas ve karar numarasını, tarihi, kaynak adresini veya saklanan kopyayı, erişim tarihini, belge sürümünü ve iddiayı destekleyen tam pasajı içerebilir.

## Teknik açıklama

Arama sisteminde kaynak izi; sonucu belgeye, belge sürümüne, metin parçasına, dayanak pasajına, işleme ve model sürümlerine, erişim kapsamına ve sonuca katkı veren arama kanallarına bağlar.

## Neden önemli?

Kaynak izi olmadığında, doğru gibi görünen bir yanıtı incelemek, aynı sonucu yeniden elde etmek, hatayı düzeltmek veya güvenle kullanmak zorlaşır.

', ARRAY['provenance', 'evidence']::text[], 'MESA contributors', 4, 'published', 'Kaynak izi nedir? — MESA', 'Kaynak izi, bilginin nereden geldiğini ve bugünkü hâline gelene kadar hangi işlemlerden geçtiğini gösteren kayıttır.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('retrieval-evaluation', 'methodology', 'en', 'Retrieval evaluation', '', 'A minimum methodology for claims about whether a retrieval system finds useful, source-grounded material.', 'Freeze inputs, separate query creation from judgment, report multiple metrics and failure cases, and bind every result to versions and raw evidence.', '## Scope

This method applies to comparative retrieval evaluations. It does not turn one corpus or query set into a universal performance claim.

## Dataset and query selection

- Define source eligibility and temporal cut-off.
- Record licensing and preservation constraints.
- Version corpus, queries, and exclusions.
- Include difficult and zero-result cases deliberately.

## Relevance judgment

Judgment guidance should define graded relevance, evidence requirements, disagreement handling, and reviewer independence. System output must not silently define its own ground truth.

## Metrics

| Measure | Question |
| --- | --- |
| Recall@k | Was relevant material retrieved within the cut-off? |
| nDCG@k | Were more relevant items ranked earlier? |
| MRR | How early did the first relevant item appear? |
| Latency distribution | What operational cost accompanied retrieval? |

## Reporting and corrections

- [ ] Configuration and code revision
- [ ] Dataset, query, and judgment versions
- [ ] Aggregate and per-query outputs
- [ ] Failure cases and exclusions
- [ ] Known limitations
- [ ] Correction date and change record when findings are amended
- [ ] Fresh-build comparison of ordered results
- [ ] A log of every test-split read

## What did MESA’s own benchmark teach us?

These rules come from mistakes and limits in our benchmark work. All numbers use benchmark v2 on Tier M.

| What happened | Evidence | Rule we now follow |
| --- | --- | --- |
| Two identical builds scored differently | 48/112 and 52/112 Hit@5 on dev, models off, before 0.9.4 | Build two fresh indexes and compare ordered results |
| An average hid rank movement | 49 of 112 answerable questions changed rank | Keep per-query results |
| A change helped two modes and hurt a third | T2 dev Hit@5 fell from 0.9286 to 0.9107 in 0.9.4 | Report every configuration, including losses |
| The test split was reused | Read in six runs across v1 and v2 | Log every read and do not call the split untouched |
| Labels had one review pass | No independent agreement measure | State annotation limits next to results |

The details are in [How We Built a Turkish Legal Retrieval Benchmark](/research/turkish-legal-benchmark-v2/) and [Why Two Identical Search Runs Gave Different Results](/research/why-two-search-runs-differed/).

', ARRAY['methodology', 'retrieval', 'evaluation']::text[], 'MESA contributors', 9, 'published', 'Retrieval Evaluation Methodology — MESA Research', 'Review the minimum evidence, judgments, metrics, versioning, and reporting rules for MESA retrieval evaluations.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('retrieval-evaluation', 'methodology', 'tr', 'Arama sistemleri nasıl değerlendirilir?', '', 'Bir sistemin ilgili bilgileri ve bunların dayanaklarını bulabildiğini göstermek için hangi ölçümler ve kayıtlar gerekir?', 'Girdileri sabitleyin. Soruları hazırlayanlarla sonuçları değerlendirenleri ayırın. Birden çok ölçümü ve hata örneklerini raporlayın; sonuçları kullanılan sürümler ve ham çıktılarla birlikte kaydedin.', '## Kapsam

Bu yöntem, farklı arama sistemlerini karşılaştırmak içindir. Tek bir veri kümesinde veya soru listesinde elde edilen sonuçlar, bütün kullanım alanları için başarı garantisi vermez.

## Veri kümesi ve sorgu seçimi

- Kaynak uygunluğunu ve zamansal kesimi tanımlayın.
- Lisans ve saklama sınırlarını kaydedin.
- Veri kümesini, sorguları ve hariç tutmaları sürümleyin.
- Zor ve sıfır sonuçlu örnekleri bilinçli biçimde dahil edin.

## İlgililik değerlendirmesi

Değerlendirme kılavuzu; ilgililik derecelerini, gerekli dayanakları, değerlendiriciler arasındaki görüş ayrılıklarının nasıl çözüleceğini ve bağımsızlığın nasıl sağlanacağını açıklamalıdır. Sistemin kendi çıktısı, doğru kabul edilen yanıtları kendiliğinden belirlememelidir.

## Metrikler

| Ölçüm | Soru |
| --- | --- |
| Recall@k | İlgili kayıtların ne kadarı seçilen ilk k sonuçta bulundu? |
| nDCG@k | Daha ilgili öğeler daha önce sıralandı mı? |
| MRR | İlk ilgili öğe ne kadar erken göründü? |
| Gecikme dağılımı | Arama ne kadar sürdü ve hangi kaynakları kullandı? |

## Raporlama ve düzeltmeler

- [ ] Yapılandırma ve kod revizyonu
- [ ] Veri kümesi, sorgu ve değerlendirme sürümleri
- [ ] Toplu ve sorgu bazlı çıktılar
- [ ] Hata örnekleri ve hariç tutmalar
- [ ] Bilinen sınırlılıklar
- [ ] Bulgular değiştirildiğinde düzeltme tarihi ve değişiklik kaydı
- [ ] Temiz kurulumlar arasında sıralı sonuç karşılaştırması
- [ ] Test bölümünün her okunmasının kaydı

## MESA’nın kendi benchmark’ı bize ne öğretti?

Bu kurallar, benchmark çalışmamızdaki hatalardan ve sınırlardan çıktı. Tüm sayılar Tier M üzerinde benchmark v2 kullanır.

| Ne oldu? | Kanıt | Artık uyguladığımız kural |
| --- | --- | --- |
| Aynı iki kurulum farklı puan aldı | Dev’de 48/112 ve 52/112 Hit@5, modeller kapalı, 0.9.4 öncesi | İki temiz dizin kurup sıralı sonuçları karşılaştır |
| Ortalama, sıra hareketini gizledi | 112 yanıtlanabilir sorunun 49’unda sıra değişti | Sorgu başına sonuçları sakla |
| Bir değişiklik iki modu iyileştirip üçüncüsünü kötüleştirdi | 0.9.4’te T2 dev Hit@5, 0,9286’dan 0,9107’ye düştü | Kayıplar dâhil her yapılandırmayı raporla |
| Test bölümü yeniden kullanıldı | v1 ve v2’de altı çalıştırmada okundu | Her okumayı kaydet; bölümü “hiç görülmemiş” diye sunma |
| Etiketler tek inceleme turundan geçti | Bağımsız uyum ölçümü yok | Etiketleme sınırlarını sonuçların yanında yaz |

Ayrıntılar [Türkçe Hukuk Arama Benchmark’ı Nasıl Kurulur?](/research/turkish-legal-benchmark-v2/) ve [Aynı Arama İki Kez Neden Farklı Sonuç Verdi?](/research/why-two-search-runs-differed/) yazılarında.

', ARRAY['methodology', 'retrieval', 'evaluation']::text[], 'MESA contributors', 9, 'published', 'Arama sistemleri nasıl değerlendirilir? — MESA', 'Bir sistemin ilgili bilgileri ve bunların dayanaklarını bulabildiğini göstermek için hangi ölçümler ve kayıtlar gerekir?', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-11-24T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());

COMMIT;
