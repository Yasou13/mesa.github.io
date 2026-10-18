-- Seed Data for MESA Content Platform
-- Generated deterministically from content/hub.json
BEGIN;

-- 1. Seed Categories

-- 2. Seed Articles and Revisions

INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('what-is-ai-memory', 'learn', 'en', 'AI memory: what survives after a conversation?', '', 'Distinguish model weights, the current context and persistent records. Design a memory write before choosing a database.', 'Distinguish model weights, the current context and persistent records. Design a memory write before choosing a database.', '## Three different meanings of “remember”

Imagine an assistant helping with a fictional Atlas archive. On Monday you say that the reading room opens at nine. On Tuesday you open a new conversation and ask for its opening time. The model can answer only if the application supplies a usable record, or if the information happens to be in its parameters. A confident answer does not tell you which happened.

A large language model (LLM) generates text by predicting tokens from the input it receives. A token is a unit of encoded text, not necessarily a whole word. The context window is the bounded sequence of input and output tokens the model can work with under its interface. Persistent storage is an application mechanism outside that prediction process; the word memory here is an engineering term, not a claim of human-like recollection.

| Layer | What it contains | How it changes |
| --- | --- | --- |
| Model parameters | Patterns learned during training | Training or fine-tuning |
| Context window | Tokens supplied for this request | Build a new request |
| Persistent memory | Records outside the model | Authorized write/update/delete |

Writing a row to a database does not retrain a model. Retrieving that row makes it available in one request, subject to selection and context limits. Conversely, leaving a statement in conversation history does not guarantee that it will be present after truncation or in another session. These are separate mechanisms with separate failure modes.

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

## Design your first memory policy

> [!EXERCISE]
> **Check your understanding**
> The assistant saves “the room opens at nine” but cannot identify its source or who may see it. Which two problems remain even if retrieval always returns the row?
>
> **Answer:** You cannot verify or revise the source-backed claim reliably, and you cannot enforce its access boundary. Retrieval success alone solves neither provenance nor authorization. Add source/revision and scope fields before measuring search quality.

## Sources and further reading

1. [Liu et al. (2023) · Lost in the Middle](https://arxiv.org/abs/2307.03172)
2. [Lewis et al. (2020) · Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

', ARRAY['memory', 'context window', 'session', 'kalıcı hafıza', 'bağlam', 'oturum']::text[], 'MESA contributors', 5, 'published', 'AI memory: what survives after a conversation? — MESA Learn', 'Distinguish model weights, the current context and persistent records. Design a memory write before choosing a database.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('what-is-ai-memory', 'learn', 'tr', 'Yapay zekâ hafızası: konuşmadan sonra ne kalır?', '', 'Model ağırlıklarını, güncel bağlamı ve kalıcı kayıtları ayırın. Veritabanı seçmeden önce bir hafıza kaydını tasarlayın.', 'Model ağırlıklarını, güncel bağlamı ve kalıcı kayıtları ayırın. Veritabanı seçmeden önce bir hafıza kaydını tasarlayın.', '## “Hatırlamanın” üç ayrı anlamı

Kurgusal Atlas arşivi için çalışan bir asistan düşünün. Pazartesi okuma salonunun dokuzda açıldığını söylüyorsunuz. Salı yeni konuşmada açılış saatini soruyorsunuz. Uygulama kullanılabilir bir kayıt sağlamazsa model ancak parametrelerindeki bilgiye dayanabilir. Kendinden emin yanıt hangi yolun kullanıldığını göstermez.

Büyük dil modeli (LLM), aldığı girdiden sonraki token’ları tahmin ederek metin üretir. Token kodlanmış metin birimidir; her zaman tam kelime değildir. Bağlam penceresi modelin arayüzü altında çalışabildiği sınırlı girdi/çıktı token dizisidir. Kalıcı depolama bu tahmin sürecinin dışında, uygulamaya ait mekanizmadır. Burada hafıza bir mühendislik terimidir; insan gibi hatırlama iddiası değildir.

| Katman | İçerik | Değişim yolu |
| --- | --- | --- |
| Model parametreleri | Eğitimde öğrenilen örüntüler | Eğitim veya ince ayar |
| Bağlam penceresi | Bu isteğe verilen token’lar | Yeni istek oluşturma |
| Kalıcı hafıza | Model dışındaki kayıtlar | Yetkili yazma/güncelleme/silme |

Veritabanına satır yazmak modeli yeniden eğitmez. O satırı getirmek, seçim ve bağlam sınırları içinde yalnızca bir istekte kullanılabilir kılar. Konuşma geçmişinde duran bir cümlenin budamadan sonra veya başka oturumda bulunacağı da garanti değildir. Bunlar farklı hata biçimleri olan ayrı mekanizmalardır.

## Kullanışlı kayıt bir cümleden fazlasıdır

“Dokuzda açılır” bilgisini saklamadan önce sorun: hangi salon, hangi günler, kime göre ve hangi okuyucular için? Kullanışlı kayıt özgün gözlemi, kaynağı, erişim kapsamını ve zamanı korur. Çıkarılmış olgu bu gözlemin yorumudur. İkisini saklamak, özgün kaynak değişmiş gibi davranmadan çıkarımı düzeltmenizi sağlar.

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

Yazma politikasını açık seçin. Her mesajı saklamak özel veriyi, tekrarları ve eski talimatları biriktirir. Yalnızca LLM özeti saklamak istisnaları veya kanıtı kaybettirebilir. Başlangıç için tam kaynak kayıtlarını koruyup görevle ilgili az sayıda iddia çıkarmak ve her iddiayı kaynağına bağlamak uygundur. Bu bir tasarım örüntüsüdür; evrensel gereklilik değildir.

## Silme ve düzeltme de hafızanın parçasıdır

Çarşamba salonun saati değişiyor. Yeni cümle eklemek, revizyon veya geçerlilik izlenmiyorsa yarışan iki yanıt bırakır. Politikanızın izin verdiği denetim izini korurken önceki iddiayı geçersizleşmiş olarak işaretleyin. Kaynak silindiğinde türetilmiş özet, embedding ve önbellekler hakkında da karar gerekir; yalnızca görünen sohbet mesajını kaldırmak yeterli değildir.

Test, gözlenebilir devamlılıktır: oturumu kapatın, başka yetkili oturum açın, soruyu sorun; sonra erişimi kaldırıp veya kaynağı değiştirip tekrarlayın. Yanıtla birlikte dönen kaynak kimliğini kontrol edin. Uzun bağlam bu testin yerini tutmaz. Liu ve arkadaşları belirli uzun bağlam görevlerinde konum etkisini inceler; bulgu her model için zamansız sınır değil, kendi modelinizi değerlendirme nedenidir. [Araştırma](https://arxiv.org/abs/2307.03172).

## İlk hafıza politikanızı tasarlayın

> [!EXERCISE]
> **Kendinizi sınayın**
> Asistan “salon dokuzda açılır” kaydını saklıyor; kaynağını ve kimlerin görebileceğini bilmiyor. Retrieval satırı her seferinde bulsa bile hangi iki sorun sürer?
>
> **Answer:** Kaynağa bağlı iddiayı güvenilir biçimde doğrulayamaz veya revize edemezsiniz; erişim sınırını da uygulayamazsınız. Retrieval başarısı kaynak izi ve yetkilendirmeyi çözmez. Arama kalitesini ölçmeden önce kaynak/revizyon ve kapsam alanlarını ekleyin.

## Kaynaklar ve ileri okuma

1. [Liu et al. (2023) · Lost in the Middle](https://arxiv.org/abs/2307.03172)
2. [Lewis et al. (2020) · Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

', ARRAY['memory', 'context window', 'session', 'kalıcı hafıza', 'bağlam', 'oturum']::text[], 'MESA contributors', 5, 'published', 'Yapay zekâ hafızası: konuşmadan sonra ne kalır? — MESA Learn', 'Model ağırlıklarını, güncel bağlamı ve kalıcı kayıtları ayırın. Veritabanı seçmeden önce bir hafıza kaydını tasarlayın.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('rag-vs-ai-memory', 'learn', 'tr', 'RAG ve hafıza: isteği adım adım kurmak', '', 'Kaynağı retrieval’dan yanıta kadar izleyin. RAG ile hafızanın örtüşmesini, bağlam bütçesini ve kaynaklandırmanın nerede bozulduğunu öğrenin.', 'Kaynağı retrieval’dan yanıta kadar izleyin. RAG ile hafızanın örtüşmesini, bağlam bütçesini ve kaynaklandırmanın nerede bozulduğunu öğrenin.', '## RAG bir örüntü, hafıza bir yaşam döngüsü konusudur

Retrieval-augmented generation, dış bilgiyi getirip üretilen yanıtı bu bilgiyle koşullandırmaktır. Uygulama bir kılavuz, kullanıcı tercihi veya önceki görev kaydı getirebilir. “Hafıza”, uygulamanın neyi koruduğunu ve zaman içinde nasıl yönettiğini anlatır. Hafıza sistemi RAG hattını besleyebilir; RAG veri kümesi sürekli güncellenebilir. Tanımlayıcı ayrım statik/dinamik olması değildir.

Lewis ve arkadaşları parametrik bilgiyle getirilen bilgiyi birleştiren belirli bir eğitilebilir RAG mimarisi sundu. Güncel uygulamalarda terim, retriever ve generator birlikte eğitilmeden, istek anındaki retrieval için de kullanılır. Hangi anlamı kullandığınızı belirtin. Bu ders uygulama örüntüsünü açıklar; her kaynaklı prompt’un özgün eğitim yöntemini uyguladığını iddia etmez. [Özgün makale](https://arxiv.org/abs/2005.11401).

## Tek soru, incelenebilir beş karar

<!-- diagram: Soru üretimden önce yetkilendirme, retrieval, seçim ve bağlam kurulumundan geçer. -->
1. Soru · hafta içi saat?
2. Kapsam · archive-team
3. Adaylar · revizyon 1 ve 2
4. Seçim · etkin kaynak 2
5. Üretim · yanıt + kaynak

*Generator yalnızca isteğe gerçekten yerleştirilen kanıtı görür.*

Önce çağıranın izinli kaynaklarını çözün. Sonra adayları getirin; uygun olmayan veya eski sürümle değiştirilmiş kayıtları çıkarın. Kalan adayları sıralayıp sınırlı kanıt bağlamına yerleştirin. Son olarak generator’dan bu bağlama dayanarak cevap ve destekleyen kaynak isteyin. Aşamaları ayrı kaydedin: makul son yanıt bozuk retriever’ı veya model parametrelerinden gelen tesadüfi cevabı gizleyebilir.

## Parça sınırları cevaplanabilirliği değiştirir

Kaynak “Salon hafta içi 09.00’da açılır; resmî tatiller hariç” diyor. Parçalama istisnayı başka kayda ayırır ve retrieval yalnızca ilkini getirirse sistem gerçek cümleye atıf yaparken yanıltıcı cevap verebilir. Belge yapısıyla başlayın: başlık, paragraf, tablo ve ek sınırları. Kaynak konumlarını koruyup soruların komşu parçalara ihtiyaç duyup duymadığını test edin.

Örtüşme yerel bağlamı korumaya yardımcıdır; aynı zamanda birbirine çok benzeyen adaylar üretir. Bağlamı doldurmadan önce kaynak/revizyon/aralıkla tekrarları ayıklayın. Evrensel parça boyutu yoktur: kısa SSS ve uzun tanımlı tablo farklı işlem ister. Token sayısını kural yapmak yerine başlangıç ayarı seçin, hataları inceleyin ve ayrılmış test sorularında karşılaştırın.

## Kanıt bütçesini hesaplayın

```text
input budget = 8,000 tokens
instructions + question + tool schemas = 2,000
reserved evidence capacity = 6,000
If the model limit includes output: reserve output separately.
Actual packing must include source labels and separators.
```

Her kanıt 500 token ve kimlik/biçim için 50 token gerektiriyorsa on öğe 5.500 token tüketir. On bir öğe 6.050 ile bu örnek bütçeyi aşar. Sığdırmak için parçayı olumsuzluk veya istisna ortasında kesmeyin. Öğeyi çıkarın ya da değiştirin; kaynak kimliğini koruyun ve mümkünse modelin gerçek tokenizer’ıyla sayın. Sayılar model özelliği değil alıştırmadır.

## Retrieval ile üretimi ayrı teşhis edin

| Gözlem | İncelenecek alan |
| --- | --- |
| Doğru kaynak adaylarda yok | Veri alımı, sorgu, indeks ve kapsam |
| Kaynak geldi ama bağlama girmedi | Sıralama, tekrar ayıklama ve paketleme |
| Kaynak prompt’ta, cevap yanlış | Talimat, model davranışı ve belirsizlik |
| Cevap doğru, kaynak ilgisiz | Atfın desteği ve olası model ezberi |

Getirilen metin “önceki talimatları yok say” dese bile veridir. Güvenilir talimattan ayrı tutun; belge istedi diye araç eylemine yetki vermeyin. Kaynağın bulunması doğruluğu veya araç çağrısının güvenliğini sağlamaz. OWASP dolaylı prompt injection riskini ve katmanlı önlemleri açıklar; tek ayraç sorunu ortadan kaldırmaz. [Güvenlik kaynağı](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

## Eksik istisnayı bulun

> [!EXERCISE]
> **Kendinizi sınayın**
> Kaynak 400 token kural ve 100 token istisna içeriyor. Yalnızca kurallar sığıyor. Son 100 token’ı kesmek güvenli optimizasyon mudur?
>
> **Answer:** Hayır. Kuralı istisnalarıyla koruyun, daha küçük tam birim getirin veya tam cevap veremediğinizi belirtin. Yalnızca bağlama yerleştirilen parça sayısını değil, yanıtın kaynak desteğini ölçün.

## Kaynaklar ve ileri okuma

1. [Lewis et al. (2020) · Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
2. [Liu et al. (2023) · Lost in the Middle](https://arxiv.org/abs/2307.03172)
3. [OWASP · LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)

', ARRAY['RAG', 'chunking', 'context budget', 'parçalama', 'bağlam bütçesi', 'prompt injection']::text[], 'MESA contributors', 5, 'published', 'RAG ve hafıza: isteği adım adım kurmak — MESA Learn', 'Kaynağı retrieval’dan yanıta kadar izleyin. RAG ile hafızanın örtüşmesini, bağlam bütçesini ve kaynaklandırmanın nerede bozulduğunu öğrenin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('structured-vs-unstructured-memory', 'learn', 'en', 'From documents to claims: preserve what extraction loses', '', 'Represent exact text, entities and assertions without confusing an extracted claim with verified truth. Work through a source-linked record.', 'Represent exact text, entities and assertions without confusing an extracted claim with verified truth. Work through a source-linked record.', '## Three representations of the same source

The Atlas handbook says “Starting 1 November, the reading room opens at 10:00 on Fridays; other weekdays remain 09:00.” Raw text preserves wording. A chunk makes part of it retrievable. An assertion makes one interpretation explicit: subject, predicate, value and qualifiers. A graph makes relationships traversable. None of these representations automatically proves that the source is correct.

| Representation | Good at | Can lose |
| --- | --- | --- |
| Exact source | Audit and re-interpretation | Convenient query structure |
| Text chunk | Passage retrieval | Document-wide qualification |
| Assertion | Filtering and joins | Nuance or extraction uncertainty |
| Graph edge | Relationship traversal | Evidence unless explicitly linked |

Choose representations according to the question. “What does paragraph four say?” needs exact text. “Which rooms open after nine on Friday?” benefits from typed time/day fields. Keeping a source-linked assertion alongside the text serves both. Treat the structured row as a derived interpretation that can be re-extracted when the parser or model changes.

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
2. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

', ARRAY['assertion', 'entity', 'schema', 'chunk', 'iddia', 'varlık', 'şema', 'kanıt aralığı']::text[], 'MESA contributors', 5, 'published', 'From documents to claims: preserve what extraction loses — MESA Learn', 'Represent exact text, entities and assertions without confusing an extracted claim with verified truth. Work through a source-linked record.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('structured-vs-unstructured-memory', 'learn', 'tr', 'Belgeden iddiaya: çıkarımın kaybettirdiklerini korumak', '', 'Tam metni, varlığı ve iddiayı; çıkarımı doğrulanmış gerçek sanmadan temsil edin. Kaynağa bağlı bir kaydı adım adım kurun.', 'Tam metni, varlığı ve iddiayı; çıkarımı doğrulanmış gerçek sanmadan temsil edin. Kaynağa bağlı bir kaydı adım adım kurun.', '## Aynı kaynağın üç temsili

Atlas kılavuzu “1 Kasım’dan itibaren okuma salonu cuma günleri 10.00’da açılır; diğer hafta içi günler 09.00 olarak kalır” diyor. Ham metin ifadeyi korur. Parça, bölümünü getirilebilir yapar. İddia bir yorumu açıklaştırır: özne, yüklem, değer ve niteleyiciler. Çizge ilişkileri gezilebilir yapar. Bu temsillerin hiçbiri kaynağın doğruluğunu kendiliğinden kanıtlamaz.

| Temsil | Güçlü yönü | Kaybedebileceği bilgi |
| --- | --- | --- |
| Tam kaynak | Denetim ve yeniden yorumlama | Kolay sorgu yapısı |
| Metin parçası | Pasaj retrieval’ı | Belge genelindeki niteleyici |
| İddia | Filtreleme ve join | Nüans veya çıkarım belirsizliği |
| Çizge kenarı | İlişki gezintisi | Açıkça bağlanmazsa kanıt |

Temsili soruya göre seçin. “Dördüncü paragraf ne diyor?” tam metin gerektirir. “Cuma dokuzdan sonra hangi salonlar açılıyor?” tipli saat/gün alanlarından yararlanır. Metin yanında kaynağa bağlı iddia tutmak ikisine de hizmet eder. Yapılı satırı parser veya model değişince yeniden çıkarılabilir türetilmiş yorum olarak ele alın.

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

“Cuma”yı düşürmek iddiayı değiştirir. “1 Kasım’dan itibaren” kısmını düşürmek gelecekteki değişikliği güncel gösterir. Birim, olumsuzluk, yetki alanı, zaman ve istisna anlamı etkiliyorsa iddianın parçasıdır. Çıkarım koşulu temsil edemiyorsa kaynağı koruyup yorumu eksik olarak işaretleyin; sessizce atmayın.

Salonu etiketinden ayırmak için sabit kimlik kullanın. “Atlas”, “Atlas Okuma Salonu” ve “A Salonu” aynı varlık da olabilir, farklı varlıklar da. Varlık çözümleme kanıt gerektiren ayrı karardır. Metin eşleşmesi aday önerebilir; kurumlar veya erişim kapsamları arasında kayıtları otomatik birleştirmemelidir.

## Türetimi görünür tutun

<!-- diagram: Kaynak revizyonu parça, çıkarım çalışması ve koşullu iddia üretir. -->
1. Revizyon r3 · özgün metin
2. Parça c4 · tam aralık
3. Çıkarım e2 · model/parser
4. İddia a42 · niteleyiciler

*Düzeltme türetilmiş iddiayı değiştirir; özgün revizyon tanımlanabilir kalır.*

W3C PROV kaynak izi anlatımında varlık, faaliyet ve aktörü ayırır. Bu örnekte kaynak ve iddia varlık; çıkarım faaliyet; yazılım servisi aktördür. Bu sözlük, iddiayı kimin neyden ürettiğini sormayı kolaylaştırır. Veritabanı şemanızı zorunlu kılmaz veya çıkarımın doğruluğunu sertifikalandırmaz. [PROV genel bakış](https://www.w3.org/TR/prov-overview/).

## Yapıyı ve anlamı ayrı doğrulayın

Şema doğrulama eksik kaynak kimliğini, hatalı saati veya eksik özneyi reddedebilir. Anlamsal kontrol, kaynağın iddiayı gerçekten destekleyip desteklemediğini ve koşulların korunup korunmadığını sorar. JSON doğrulamasını geçmek yalnızca yapısal uyumu gösterir. İki model aynı yanlış anlamayı paylaşabilir; uzlaşma sinyaldir, bağımsız kaynak değildir.

Düzeltmede değişen kaynakla değişen yorumu ayırın. Kaynak aynıysa ama “cuma” yanlışlıkla “her gün” okunduysa yeni çıkarım veya iddia sürümü oluşturup hatalıyı geri çekin. Kılavuz değiştiyse yeni kaynak revizyonu oluşturun. Bu ayrım sonraki yanıtın gerçek, belge veya çıkarım hattı değiştiği için mi değiştiğini denetletir.

## Çıkarımı onarın

> [!EXERCISE]
> **Kendinizi sınayın**
> Çıkarım “resmî tatillerde kapalı” ifadesini `is_open=true` yapıyor. JSON şeması geçerli. İnceleme neyi kaydetmeli?
>
> **Answer:** Tam destek aralığı, çıkarım sürümü ve etkilenen iddia kimliğiyle anlamsal çelişkiyi kaydetmeli. Türetilmiş iddiayı geri çekin veya değiştirin; kaynak revizyonunu koruyun ve buna kaynak güncellemesi demeyin.

## Kaynaklar ve ileri okuma

1. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
2. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

', ARRAY['assertion', 'entity', 'schema', 'chunk', 'iddia', 'varlık', 'şema', 'kanıt aralığı']::text[], 'MESA contributors', 5, 'published', 'Belgeden iddiaya: çıkarımın kaybettirdiklerini korumak — MESA Learn', 'Tam metni, varlığı ve iddiayı; çıkarımı doğrulanmış gerçek sanmadan temsil edin. Kaynağa bağlı bir kaydı adım adım kurun.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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

', ARRAY['embedding', 'dense', 'sparse', 'cosine', 'vector', 'vektör', 'kosinüs', 'anlamsal arama']::text[], 'MESA contributors', 5, 'published', 'Embeddings and semantic search, with numbers — MESA Learn', 'Calculate similarity, distinguish dense and sparse representations, and understand why nearest neighbors are neither facts nor access decisions.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('semantic-search', 'learn', 'tr', 'Embedding ve anlamsal arama: sayılarla açıklama', '', 'Benzerliği hesaplayın, yoğun ve seyrek temsili ayırın; en yakın komşunun neden gerçeklik veya erişim kararı olmadığını anlayın.', 'Benzerliği hesaplayın, yoğun ve seyrek temsili ayırın; en yakın komşunun neden gerçeklik veya erişim kararı olmadığını anlayın.', '## Embedding neyi temsil eder?

Embedding modeli girdiyi vektör halinde düzenlenmiş sayılara dönüştürür. Eğitim, bazı ilişkilerin geometrik yakınlıkta görünmesini teşvik eder. “Açılış saatleri” belgesi ortak kelime olmadan “ne zaman girebilirim?” sorusuna yakın olabilir. Aday retrieval için yararlıdır. Koordinatlar öğrenilmiş özelliklerdir; “doğruluk”, “izin” veya “güncellik” gibi etiketli sütunlar değildir.

Yoğun temsil genellikle çok sayıda sıfır olmayan değer içeren sabit uzunluklu dizidir. Seyrek temsil çok daha büyük uzaydan az sayıda ağırlıklı boyut tutar. Klasik sözcüksel boyutlar terimlere karşılık gelir; öğrenilmiş seyrek modeller bunları genişletebilir veya yeniden ağırlıklandırabilir. Seyrek “öğrenmesiz”, yoğun ise “alanda daha iyi retrieval” demek değildir. Seçim kendi sorularınızda ölçüm gerektirir.

## İki boyutlu benzerlik hesabı

```text
cosine(q, d) = dot(q, d) / (norm(q) * norm(d))
q = [1, 0]
A = [0.8, 0.6]   norm(A) = 1   cosine(q,A) = 0.8
B = [0, 1]       norm(B) = 1   cosine(q,B) = 0
C = [8, 6]       norm(C) = 10  cosine(q,C) = 0.8
```

A ve C’nin kosinüs benzerliği aynıdır; kosinüs uzunluğu değil yönü karşılaştırır. Ham iç çarpım A için 0,8, C için 8’dir. Birim uzunluğa normalize edilmiş vektörlerde kosinüs ile iç çarpım aynıdır; normalizasyon yoksa aynı olmak zorunda değildir. Bu kurgusal iki boyutlu vektörler yalnızca hesabı açıklar. Dil modeli çıktısı veya anlamsal kalite kanıtı değildir.

0,8 benzerlik, yüzde 80 ilgililik olasılığı değildir. Anlamı embedding modeline, skor dağılımına ve göreve bağlıdır. Bir veri kümesinde çalışan eşik; dil, parçalama veya model değişince bozulabilir. Eşiği etiketlenmiş sorgularla ayarlayın ve precision/recall dengesini izleyin.

## Kodlama ile indeksleme farklı adımlardır

<!-- diagram: Belge ve sorgu kodlayıcıları vektör karşılaştırmasını besler; uygunluk bağımsız uygulanır. -->
1. Kaynak · parça + revizyon
2. Kodla · sabit model kimliği
3. İndeks · tam veya yaklaşık
4. Sorgu · uyumlu kodlayıcı
5. Doğrula · kapsam + kanıt

*Vektör indeksi karşılaştırmayı hızlandırır. Kaydın anlamını belirlemez.*

Tam arama uygun her vektörü skorlar. Yaklaşık en yakın komşu araması daha düşük maliyet karşılığında bazı komşuları kaçırabilir. Aynı uzaklık ve kapsamla yönetilebilir örnekte tam aramaya kıyasla yaklaşım kaybını ölçün. Anlamsal ilgililiği insan etiketleriyle ayrıca ölçün; indeks en yakın vektörleri kusursuz bulurken bu vektörler kötü yanıtlar olabilir.

## Boyutların eşleşmesi yeterli değildir

Sağlayıcı, model, revizyon, boyut, normalizasyon ve kodlama talimatını kaydedin. İki model de 768 sayı döndürüp uyumsuz uzay kullanabilir. Bazı retrieval modelleri farklı sorgu/belge kodlayıcısı veya öneki ister; uyumluluk mutlaka aynı metin değil, modelin öngördüğü eşleşmedir. Temsili değiştirmek çoğunlukla belgeleri yeniden kodlayıp türetilmiş indeksi kurmayı gerektirir.

Kimlikler, olumsuzluk ve benzer revizyonlar sınırları ortaya çıkarır. “A-17 kuralı uygulanır” ve “A-17 kuralı uygulanmaz” anlamsal olarak yakın olabilir. Tam semboller için sözcüksel retrieval, geçerlilik için yapılı filtre kullanın. DPR ve Sentence-BERT öğrenilmiş yoğun retrieval ve cümle temsili örnekleridir; her çok dilli arşiv için garanti değildir. [DPR](https://arxiv.org/abs/2004.04906), [Sentence-BERT](https://arxiv.org/abs/1908.10084).

## Şüpheli iyileşmeyi açıklayın

> [!EXERCISE]
> **Kendinizi sınayın**
> Model değişince vektörler hâlâ 768 boyutlu ve servis sonuç döndürüyor. Eski belge indeksini kullanmak için yeterli mi?
>
> **Answer:** Hayır. Sorgu/belge temsil sözleşmesini kontrol edin; uyumsuzsa yeniden kodlayın. Yapısal olarak geçerli vektör başka uzayda olabilir. Hem komşu bulmayı hem görev ilgililiğini değerlendirin.

## Kaynaklar ve ileri okuma

1. [Karpukhin et al. (2020) · Dense Passage Retrieval](https://arxiv.org/abs/2004.04906)
2. [Reimers & Gurevych (2019) · Sentence-BERT](https://arxiv.org/abs/1908.10084)
3. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)

', ARRAY['embedding', 'dense', 'sparse', 'cosine', 'vector', 'vektör', 'kosinüs', 'anlamsal arama']::text[], 'MESA contributors', 5, 'published', 'Embedding ve anlamsal arama: sayılarla açıklama — MESA Learn', 'Benzerliği hesaplayın, yoğun ve seyrek temsili ayırın; en yakın komşunun neden gerçeklik veya erişim kararı olmadığını anlayın.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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

## Choose the first debugging step

> [!EXERCISE]
> **Check your understanding**
> Every search for policy A-17 returns policy A-71 first. Should you immediately increase a ranking weight?
>
> **Answer:** Inspect indexed tokens and query syntax, then test an exact identifier field. If the index no longer distinguishes the identifiers, weighting cannot reliably repair it. Only tune scores after the representation is correct.

## Sources and further reading

1. [Manning, Raghavan & Schütze · Okapi BM25](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html)
2. [SQLite · FTS5 reference](https://www.sqlite.org/fts5.html)

', ARRAY['BM25', 'IDF', 'tokenization', 'FTS5', 'lexical', 'sözcüksel', 'Türkçe', 'tokenizasyon']::text[], 'MESA contributors', 5, 'published', 'BM25: why a rare word can beat repeated words — MESA Learn', 'Work through term frequency, rarity and length normalization. Tune tokenization and field weights before chasing a larger model.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('bm25-tuning-for-domain-documents', 'learn', 'tr', 'BM25: nadir kelime neden tekrarlanan kelimeyi geçer?', '', 'Terim sıklığını, nadirliği ve uzunluk normalizasyonunu hesaplayın. Büyük model aramadan önce tokenizasyonu ve alan ağırlıklarını inceleyin.', 'Terim sıklığını, nadirliği ve uzunluk normalizasyonunu hesaplayın. Büyük model aramadan önce tokenizasyonu ve alan ağırlıklarını inceleyin.', '## Sözcüksel sıralamanın arkasındaki üç soru

“Atlas cuma saatleri” için sözcüksel retriever sorgu terimlerini içeren pasajları bulur. Hangi eşleşmenin önemli olduğuna karar vermelidir. BM25 terim nadirliğini, belge içi sıklığı ve belge uzunluğu düzeltmesini birleştirir. “Saat” kelimesini elli kez tekrarlamak uzun ilgisiz belgeyi yenilmez yapmamalıdır; nadir kimlik daha ayırt edici ipucu olabilir.

Ters indeks terimi onu içeren belgelere eşler. Terimleri sıralamadan önce tokenizasyon belirler. “A-17”, “a” ve “17” olarak bölünürse skor ayarı hiç indekslenmemiş kimlik sınırını geri getiremez. Önce token’ları ve sorgu ayrıştırmasını inceleyin. Tam kimlik ayrı normalize alan veya eşitlik filtresi gerektirebilir.

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

IDF nadir terime daha fazla etki verir. Sıklık kesri doygunlaşır: sıfırdan bir tekrara çıkmak, ondan on bire çıkmaktan daha önemlidir. `k1` doygunluğu, `b` uzunluk normalizasyonunu kontrol eder. `b=0` iken uzunluk etkisizdir; `b=1` iken tam uzunluk oranı girer. BM25 sürümleri IDF ayrıntısında farklılaşır; parametre adlarıyla birlikte uygulamayı da kaydedin.

## Uzunluk etkisini hesaplayın

| Nicelik | Kısa pasaj A | Uzun pasaj B |
| --- | --- | --- |
| Terim sıklığı | 2 | 2 |
| Uzunluk / ortalama uzunluk | 0.5 | 2 |
| k1=1.2, b=0.75: payda | 2.75 | 4.10 |
| Pay: 2 × 2.2 | 4.4 | 4.4 |
| Sıklık çarpanı | 1.60 | 1.073 |

Aynı IDF ve sıklıkta kısa pasaj daha büyük katkı alır. Bu hesap kısa parçaların her zaman iyi olduğunu kanıtlamaz. Belgeleri bölmek terim istatistiğini, bağlam tamlığını ve ilgili sayılan birimi değiştirir. Sıralama değişikliğini test ederken parçalamayı sabit tutun; sonra parçalamayı ayrı deneyde değerlendirin.

## Hata örneklerine göre ayarlayın

<!-- diagram: Token’ları inceleyin, sözcüksel taban kurun, sonuçları etiketleyin, tek ayarı değiştirip tekrarlayın. -->
1. İncele · A-17 / I / İ
2. Taban · sabit parçalar
3. Etiketle · tam ve dolaylı
4. Değiştir · tek alan ağırlığı
5. Karşılaştır · ayrılmış sorgular

*Son skoru vereceğiniz örneklerle ayar yapmayın.*

Türkçe için gerçek sorgu/belge çiftlerinde noktalı/noktasız I, ekler ve aksanları inceleyin. Küçük harfe çevirme ve işaret kaldırma bazı eşleşmelere yardımcı olurken anlamlı ayrımları silebilir. Özgün metni koruyup hem kimlik kesinliğini hem doğal dil recall’unu test edin. Arama sözdizimi ve tokenizer davranışı, arayüzün metin normalizasyonundan ayrıdır.

SQLite FTS5 sabit `k1=1.2` ve `b=0.75` kullanır; `bm25(table, ...)` argümanları bu parametreler değil sütun ağırlıklarıdır. Daha iyi eşleşmeye daha küçük değer döndürdüğü için artan sıralama bilinçlidir. Başka motordan azalan-skor kuralı kopyalamayın. Hesap örneğimiz belirli bir IDF çeşidi kullanır; FTS5’in tam tanımı kendi referansındadır. [FTS5](https://www.sqlite.org/fts5.html).

## İlk teşhis adımını seçin

> [!EXERCISE]
> **Kendinizi sınayın**
> A-17 politikası araması her defasında A-71’i öne getiriyor. Hemen sıralama ağırlığını mı artırmalısınız?
>
> **Answer:** İndekslenen token ve sorgu sözdizimini inceleyin; sonra tam kimlik alanını test edin. İndeks kimlikleri ayırmıyorsa ağırlık bunu güvenilir biçimde onaramaz. Temsil doğru olduktan sonra skor ayarlayın.

## Kaynaklar ve ileri okuma

1. [Manning, Raghavan & Schütze · Okapi BM25](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html)
2. [SQLite · FTS5 reference](https://www.sqlite.org/fts5.html)

', ARRAY['BM25', 'IDF', 'tokenization', 'FTS5', 'lexical', 'sözcüksel', 'Türkçe', 'tokenizasyon']::text[], 'MESA contributors', 5, 'published', 'BM25: nadir kelime neden tekrarlanan kelimeyi geçer? — MESA Learn', 'Terim sıklığını, nadirliği ve uzunluk normalizasyonunu hesaplayın. Büyük model aramadan önce tokenizasyonu ve alan ağırlıklarını inceleyin.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('hybrid-retrieval-explained', 'learn', 'en', 'Hybrid retrieval: candidates, fusion and reranking', '', 'Design a search pipeline where lexical and semantic lanes contribute different evidence. Diagnose whether recall, fusion or reranking is failing.', 'Design a search pipeline where lexical and semantic lanes contribute different evidence. Diagnose whether recall, fusion or reranking is failing.', '## Two ways to miss the same answer

A reader asks “When can I visit on the last working day?” The handbook says “Friday opening: 10:00.” Dense retrieval may bridge the wording; lexical retrieval may preserve exact room names and policy IDs. Hybrid retrieval combines complementary candidate sets. It is useful only when the additional lane finds relevant items that the baseline misses, or improves their ordering at acceptable cost.

Adding a graph or another embedding model is not automatically an improvement. Nearly identical lanes can reinforce the same mistake. Begin with one interpretable lexical baseline and one compatible dense model; measure overlap, unique relevant hits, empty results and latency. Add complexity only when a documented failure calls for it. BEIR illustrates that retrieval methods vary across datasets; its benchmark results are not a score for your archive. [BEIR](https://arxiv.org/abs/2104.08663).

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

## Locate the failure

> [!EXERCISE]
> **Check your understanding**
> The correct passage is rank 45 in the dense lane, absent from lexical top 20, and you rerank only the top-20 union. Can a better reranker find it?
>
> **Answer:** No. It never reaches the reranker. Investigate query representation, lane cutoff, chunking and candidate recall. Compare changes on the same judged questions before spending more on reranking.

## Sources and further reading

1. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)
2. [Nogueira & Cho (2019) · Passage Re-ranking with BERT](https://arxiv.org/abs/1901.04085)
3. [Cormack, Clarke & Büttcher (2009) · Reciprocal Rank Fusion](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)

', ARRAY['hybrid', 'reranking', 'candidate recall', 'cross encoder', 'hibrit', 'yeniden sıralama', 'aday']::text[], 'MESA contributors', 5, 'published', 'Hybrid retrieval: candidates, fusion and reranking — MESA Learn', 'Design a search pipeline where lexical and semantic lanes contribute different evidence. Diagnose whether recall, fusion or reranking is failing.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('hybrid-retrieval-explained', 'learn', 'tr', 'Hibrit retrieval: adaylar, birleştirme ve yeniden sıralama', '', 'Sözcüksel ve anlamsal kanalların farklı kanıt sağladığı arama hattını kurun. Recall, birleştirme ve yeniden sıralama hatasını ayırın.', 'Sözcüksel ve anlamsal kanalların farklı kanıt sağladığı arama hattını kurun. Recall, birleştirme ve yeniden sıralama hatasını ayırın.', '## Aynı cevabı kaçırmanın iki yolu

Okur “son iş gününde ne zaman gelebilirim?” diye soruyor. Kılavuz “Cuma açılışı: 10.00” diyor. Yoğun retrieval ifade farkını köprüleyebilir; sözcüksel retrieval tam salon adı ve politika kimliğini koruyabilir. Hibrit retrieval tamamlayıcı aday kümelerini birleştirir. Ek kanal, tabanın kaçırdığı ilgili öğeyi buluyor veya kabul edilebilir maliyetle sıralamayı iyileştiriyorsa yararlıdır.

Çizge veya başka embedding modeli eklemek otomatik iyileşme değildir. Neredeyse aynı kanallar aynı yanlışı güçlendirebilir. Açıklanabilir sözcüksel taban ve bir uyumlu yoğun modelle başlayın; örtüşme, özgün ilgili isabet, boş sonuç ve gecikmeyi ölçün. Belgelenmiş hata gerektiriyorsa karmaşıklık ekleyin. BEIR yöntemlerin veri kümelerinde değiştiğini gösterir; benchmark sonucu sizin arşivinizin skoru değildir. [BEIR](https://arxiv.org/abs/2104.08663).

## Aşamaları ayrı tutun

<!-- diagram: Yetkili sözcüksel ve vektör adayları kimlikle uzlaştırılır, birleştirilir, gerekirse yeniden sıralanır ve paketlenir. -->
1. Yetkilendir · sabit kapsam
2. Getir · sözcüksel + yoğun
3. Uzlaştır · kanonik kimlikler
4. Birleştir · sıralamalar
5. Sırala / paketle · son kanıt

*Aday üretimi kapsamayı hedefler; yeniden sıralama az öğeye daha fazla iş harcar.*

Her kanal 20 aday döndürsün ve 8 kimlik örtüşsün. Birleşimde 40 değil 32 benzersiz aday vardır. Gerçek retrieval birimiyle tekrar ayıklayın: belge, pasaj veya iddia. Aynı belgeden iki parça ayrı kanıt olabilir; aynı parçanın kopyası arka uç satırı tekrarladı diye ek oy almamalıdır.

## İlişkisiz ham skorları toplamayın

0,72 kosinüs skoru ile 12 sözcüksel skor ortak ölçekte değildir. Toplamak sonucu keyfî aralığa bağımlı yapar. Sıra birleştirme konum kullanır; skor birleştirme açık normalizasyon veya öğrenilmiş kalibrasyon ister. Adayın neden taşındığını açıklamak için kanal skorunu ve sırasını iz kaydında koruyun. Sonraki derste tam RRF hesabı var.

| Aşama | Soru | Yararlı ölçü |
| --- | --- | --- |
| Aday retrieval | İlgili kanıt birleşime girdi mi? | Aday kesiminde Recall |
| Birleştirme | Tamamlayıcı kanıt yükseldi mi? | Sabit kesimde nDCG / MRR |
| Yeniden sıralama | Ek skor sıralamayı iyileştirdi mi? | Gecikme/maliyete göre kazanım |
| Paketleme | Tam kanıt modele ulaştı mı? | Destek ve bütçe uyumu |

## Reranker neyi düzeltebilir?

Cross-encoder sorgu ve adayı birlikte skorlayarak token’ları doğrudan etkileştirir. Önceden hesaplanmış belge vektörlerini karşılaştırmaktan genellikle daha pahalıdır; bu nedenle kısa listeye uygulanır. Nogueira ve Cho BERT ile pasaj yeniden sıralamayı inceler; bu tasarım her reranker’ın sizin alanınızı iyileştireceğini göstermez. [Makale](https://arxiv.org/abs/1901.04085).

Reranker girdisinde olmayan ilgili kaydı geri getiremez. Birleşimde ilgili aday sıfırsa reranker değiştirmek recall’u çözmez. Erişim kontrolünü geçersiz kılmamalı veya eski kaynağı diriltmemelidir. Hat boyunca uygunluğu uygulayıp son kanıtın kimliğini doğrulayın; “çok ilgili ama yasak” hâlâ yasaktır.

## Hatayı konumlandırın

> [!EXERCISE]
> **Kendinizi sınayın**
> Doğru pasaj yoğun kanalda 45. sırada, sözcüksel ilk 20’de yok; yalnızca ilk-20 birleşimini yeniden sıralıyorsunuz. Daha iyi reranker onu bulabilir mi?
>
> **Answer:** Hayır. Reranker’a ulaşmıyor. Sorgu temsili, kanal kesimi, parçalama ve aday recall’unu inceleyin. Yeniden sıralamaya daha fazla kaynak ayırmadan aynı etiketli sorularda değişiklikleri karşılaştırın.

## Kaynaklar ve ileri okuma

1. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)
2. [Nogueira & Cho (2019) · Passage Re-ranking with BERT](https://arxiv.org/abs/1901.04085)
3. [Cormack, Clarke & Büttcher (2009) · Reciprocal Rank Fusion](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)

', ARRAY['hybrid', 'reranking', 'candidate recall', 'cross encoder', 'hibrit', 'yeniden sıralama', 'aday']::text[], 'MESA contributors', 5, 'published', 'Hibrit retrieval: adaylar, birleştirme ve yeniden sıralama — MESA Learn', 'Sözcüksel ve anlamsal kanalların farklı kanıt sağladığı arama hattını kurun. Recall, birleştirme ve yeniden sıralama hatasını ayırın.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('reciprocal-rank-fusion-explained', 'learn', 'en', 'Reciprocal Rank Fusion: calculate and inspect every vote', '', 'Fuse two ranked lists by hand, handle duplicates and ties, and understand why an RRF score is not confidence.', 'Fuse two ranked lists by hand, handle duplicates and ties, and understand why an RRF score is not confidence.', '## Combine agreement without comparing raw scores

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

## Specify the edge cases before deployment

Deduplicate a candidate within each lane before assigning its vote. Otherwise a backend returning the same ID twice changes the method. Decide what the ID represents and keep it consistent across lanes. If one lane returns document IDs and another assertion IDs, reconcile them into the same unit before fusion; matching strings alone is not a sound identity contract.

For exactly tied fused scores, use a documented stable rule such as canonical ID ordering. For weighted fusion, reject non-finite weights and decide whether zero disables a lane. Giving two copies of the same retriever separate full weights can double-count correlated evidence. More votes do not make an incorrect or unauthorized source acceptable.

## Recalculate after a weight change

> [!EXERCISE]
> **Check your understanding**
> Set the dense lane weight to zero in the table. What order remains, and what happens to D?
>
> **Answer:** A, B, C keep the lexical order. D has zero contribution; whether zero-score candidates are excluded is an explicit output policy. Do not interpret the zero as proof that D is false or irrelevant.

## Sources and further reading

1. [Cormack, Clarke & Büttcher (2009) · Reciprocal Rank Fusion](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)
2. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

', ARRAY['RRF', 'rank fusion', 'weighted', 'k=60', 'sıra birleştirme', 'ağırlık']::text[], 'MESA contributors', 5, 'published', 'Reciprocal Rank Fusion: calculate and inspect every vote — MESA Learn', 'Fuse two ranked lists by hand, handle duplicates and ties, and understand why an RRF score is not confidence.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('reciprocal-rank-fusion-explained', 'learn', 'tr', 'Reciprocal Rank Fusion: her oyu hesaplamak ve incelemek', '', 'İki sıralı listeyi elle birleştirin, tekrarları ve eşitlikleri yönetin; RRF skorunun neden güven olasılığı olmadığını anlayın.', 'İki sıralı listeyi elle birleştirin, tekrarları ve eşitlikleri yönetin; RRF skorunun neden güven olasılığı olmadığını anlayın.', '## Ham skorları kıyaslamadan uzlaşmayı birleştirin

Atlas arşivinde iki retriever farklı sıralıyor. Sözcüksel liste A, B, C; yoğun liste B, C, D. Ham skorların birimi aynıymış gibi davranmadan liste sırasını kullanmak istiyorsunuz. Reciprocal Rank Fusion her sıraya azalan katkı atar ve aynı adayın katkılarını toplar. Varsayımları açık, basit bir başlangıç yöntemidir.

Cormack, Clarke ve Büttcher yöntemi belirli retrieval deneylerinde değerlendirdi. Sonuçları RRF’yi denemeyi gerekçelendirir; görevinizde iyileşmeyi garanti etmez. Özgün yöntem ağırlıksız oy kullanır. Ağırlıklı RRF, her kanal katkısını açık ağırlıkla çarpan bir genişletmedir. [Özgün makale](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf).

## Sıralamayı birden başlatın

```text
RRF(d) = sum over lanes containing d: w_lane / (k + rank_lane(d))
rank starts at 1; missing candidate contributes 0.
Example below: k = 60, every weight = 1.
```

| Aday | Sözcüksel sıra | Yoğun sıra | RRF katkı toplamı |
| --- | --- | --- | --- |
| A | 1 | yok | 1/61 = 0.016393 |
| B | 2 | 1 | 1/62 + 1/61 = 0.032522 |
| C | 3 | 2 | 1/63 + 1/62 = 0.032002 |
| D | yok | 3 | 1/63 = 0.015873 |

Birleşik sıra B, C, A, D’dir. Listeler arası uzlaşma, tek kanalda birinci olan A’ya rağmen B ve C’yi yükseltir. Kesilmiş listede olmayan aday o kanaldan sıfır alır; sonsuz veya sıfırıncı sıra oyu almaz. Kesim oyları değiştirdiği için aday kesimlerini deney kaydına yazın.

## k değişince ne olur?

`k=60` iken birinci 1/61, ikinci 1/62 katkı yapar; fark küçüktür. `k=1` iken 1/2 ve 1/3 ile fark büyür. Küçük k üst sıraları vurgular; büyük k getirilen sıralar arasında katkıyı düzleştirir. Bu k yumuşatma sabitidir; döndürülen sonuç sayısı değildir. 60’ı evrensel saymak yerine ayrılmış değerlendirmeyle seçin.

<!-- diagram: Sıra listeleri kanal oyu üretir; oylar aday kimliğinde birleşip belirli sırayla sıralanır. -->
1. Sözcüksel · A,B,C
2. Yoğun · B,C,D
3. Oy · 1/(k+sıra)
4. Kimlikte topla · tek kanal oyu
5. Sırala · B,C,A,D

*Sonuç bir sıra sinyalidir; kalibre edilmiş olasılık değildir.*

## Uç durumları dağıtımdan önce belirleyin

Oy vermeden önce kanal içindeki aday tekrarını ayıklayın. Aksi halde arka ucun aynı kimliği iki kez döndürmesi yöntemi değiştirir. Kimliğin temsil ettiği birimi belirleyip kanallar arasında koruyun. Bir kanal belge, diğeri iddia kimliği döndürüyorsa birleştirmeden önce ortak birime uzlaştırın; yalnızca aynı metin sağlam kimlik sözleşmesi değildir.

Tam eşit birleşik skorda kanonik kimlik sırası gibi belgeli sabit kural kullanın. Ağırlıklı birleştirmede sonlu olmayan ağırlığı reddedin; sıfırın kanalı kapatıp kapatmadığını belirleyin. Aynı retriever’ın iki kopyasına tam ağırlık vermek ilişkili kanıtı iki kez sayabilir. Fazla oy yanlış veya yetkisiz kaynağı kabul edilebilir yapmaz.

## Ağırlık değişince yeniden hesaplayın

> [!EXERCISE]
> **Kendinizi sınayın**
> Tabloda yoğun kanalın ağırlığını sıfırlayın. Hangi sıra kalır; D’ye ne olur?
>
> **Answer:** A, B, C sözcüksel sırada kalır. D sıfır katkı alır; sıfır skorlu adayın çıkarılması açık çıktı politikasıdır. Sıfır, D’nin yanlış veya ilgisiz olduğunu kanıtlamaz.

## Kaynaklar ve ileri okuma

1. [Cormack, Clarke & Büttcher (2009) · Reciprocal Rank Fusion](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)
2. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

', ARRAY['RRF', 'rank fusion', 'weighted', 'k=60', 'sıra birleştirme', 'ağırlık']::text[], 'MESA contributors', 5, 'published', 'Reciprocal Rank Fusion: her oyu hesaplamak ve incelemek — MESA Learn', 'İki sıralı listeyi elle birleştirin, tekrarları ve eşitlikleri yönetin; RRF skorunun neden güven olasılığı olmadığını anlayın.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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

Likewise, graph centrality measures connectivity under a chosen definition. A popular node may be frequently cited and wrong. Do not use PageRank as a truth score or allow it to suppress an inconvenient source without an explicit policy. Source quality, relevance and graph prominence answer different questions.

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
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

', ARRAY['graph', 'GraphRAG', 'multi hop', 'Kuzu', 'knowledge graph', 'çizge', 'ilişki']::text[], 'MESA contributors', 5, 'published', 'Knowledge graphs: follow relations without inventing proof — MESA Learn', 'Build a source-linked graph, trace a two-hop question, and distinguish graph traversal from GraphRAG summaries and valid inference.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('why-graphs-matter-in-ai-memory', 'learn', 'tr', 'Bilgi çizgeleri: kanıt uydurmadan ilişkileri izlemek', '', 'Kaynağa bağlı çizge kurun, iki adımlı soruyu izleyin; çizge gezintisini GraphRAG özetlerinden ve geçerli çıkarımdan ayırın.', 'Kaynağa bağlı çizge kurun, iki adımlı soruyu izleyin; çizge gezintisini GraphRAG özetlerinden ve geçerli çıkarımdan ayırın.', '## İlişki kimlik ve kanıt gerektirir

Metin araması pasaj bulur. Çizge sorgusu açıkça temsil edilmiş ilişkileri izler. Kurgusal Atlas arşivinde okuma salonu, arşiv ve ilçe düğümleri; “parçası” ve “bulunduğu yer” kenarları kurun. Sabit düğüm kimliği kullanıp her iddia kenarını destekleyen kaynak revizyonuna bağlayın. “Merkez” gibi etiket kimliği çözmeye yetmez.

```text
room-7 --part_of [evidence: handbook-r3/c4]--> archive-2
archive-2 --located_in [evidence: directory-r1/c2]--> district-5
room-7 --opening_time [day: Friday; from: Nov 1]--> 10:00
```

İlişkiler yön ve tür taşır. “A, B’yi yönetir”, “B, A’yı yönetir” değildir; “atıf yapar”, “katılır” değildir. Zaman, kapsam ve belirsizlik ilişkiyi değiştiriyorsa koruyun. Kaynağın aynı paragrafta iki isim anması aralarında anlamlı kenar kurmaz. Birlikte görünme keşif sinyali olabilir; doğrulanmış ilişki değildir.

## İki adımlı soruyu çözün

“7 numaralı salonun bağlı olduğu arşiv hangi ilçede?” diye sorun. Salon 7’yi çözün, `part_of` ile arşiv 2’ye, `located_in` ile ilçe 5’e gidin. İki kenar kimliğini ve kaynaklarını döndürün. Her adımın anlamı belli olduğundan kanıt zinciri incelenebilir. Kaynaklardan biri erişilemez, eski veya belirsizse tam yanıt o çağıran için desteklenmez.

<!-- diagram: Okuma salonu arşive, ardından ilçeye bağlanır; her adım kaynak kimliğini korur. -->
1. Çöz · room-7
2. Adım 1 · part_of
3. Arşiv · archive-2
4. Adım 2 · located_in
5. Yanıt · district-5 + 2 kaynak

*İki kenar ancak ilişkiler ve kapsamlar geçerliyse desteklenen zincir olur.*

## Yol kendiliğinden çıkarım kuralı değildir

A, B’ye; B de C’ye atıf yapıyor olsun. A’dan C’ye iki kenarlı atıf yolu olduğunu söyleyebilirsiniz. A’nın C’ye katıldığını, C’nin doğru olduğunu veya A’nın doğrudan C’ye atıf yaptığını çıkaramazsınız. Geçerli çıkarım, anlamı bileşime izin veren kural gerektirir. Bulunan yol ile yolun gerçekten desteklediği önermeyi ayırın.

Benzer biçimde merkezilik, seçilmiş tanım altında bağlantısallığı ölçer. Popüler düğüme sık atıf yapılıp düğüm yanlış olabilir. PageRank’i doğruluk skoru yapmayın veya açık politika olmadan hoşunuza gitmeyen kaynağı bastırmasına izin vermeyin. Kaynak niteliği, ilgililik ve çizge görünürlüğü ayrı soruları yanıtlar.

## Maliyeti sınırlayın, eksikliği tanıyın

Ortalama dallanma 10 ise üç adım, tekrar ayıklamadan önce yaklaşık 10 + 100 + 1.000 komşu inceleyebilir. Merkez düğüm bunu büyütebilir. Başlangıç sayısı, adım derinliği, düğüm başına yayılım, toplam kenar bütçesi ve timeout belirleyin. Sınırlı arama geçerli yolu kaçırabilir; “ilişki yok” demek yerine kesilmeyi belirtin. Önbellek anahtarı erişim kapsamını ve kaynak neslini içermelidir.

GraphRAG çizge bilgisini kullanan retrieval destekli yaklaşımlar ailesidir. Edge ve arkadaşları veri kümesi genelindeki sorular için çizgeden türetilmiş topluluk özetleri açıklar. Bu, yerel soruda ham yol döndürmekten farklıdır. Özet üretimi, kaynak kapsamı ve güncelleme politikası değerlendirilecek yeni türetilmiş artefakt ekler. Kenarları çizge veritabanına yazmak tek başına o araştırma yöntemini uygulamaz. [GraphRAG makalesi](https://arxiv.org/abs/2404.16130).

## Bağlantı ile desteği ayırın

> [!EXERCISE]
> **Kendinizi sınayın**
> A, B’ye atıf yapıyor; B, C’yi eleştiriyor. Çizge yolu var diye asistan “A, C’yi destekliyor” diyebilir mi?
>
> **Answer:** Hayır. İlgiliyse türleri belirtilmiş yolu döndürüp kaynak pasajlarını inceleyin. Bu ilişki türleri destek sonucuna birleşmez. Çizge incelenecek zinciri açar; mantıksal anlamını icat etmez.

## Kaynaklar ve ileri okuma

1. [Edge et al. · From Local to Global: A Graph RAG Approach](https://arxiv.org/abs/2404.16130)
2. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

', ARRAY['graph', 'GraphRAG', 'multi hop', 'Kuzu', 'knowledge graph', 'çizge', 'ilişki']::text[], 'MESA contributors', 5, 'published', 'Bilgi çizgeleri: kanıt uydurmadan ilişkileri izlemek — MESA Learn', 'Kaynağa bağlı çizge kurun, iki adımlı soruyu izleyin; çizge gezintisini GraphRAG özetlerinden ve geçerli çıkarımdan ayırın.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

', ARRAY['provenance', 'citation', 'hash', 'SHA256', 'evidence', 'kaynak izi', 'atıf', 'kanıt', 'halüsinasyon']::text[], 'MESA contributors', 5, 'published', 'Evidence and provenance: what a citation actually proves — MESA Learn', 'Build a verifiable citation with source revision and exact span. Distinguish integrity, provenance, claim support and source truth.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('what-is-evidence-aware-memory', 'learn', 'tr', 'Kanıt ve kaynak izi: atıf gerçekte neyi kanıtlar?', '', 'Kaynak revizyonu ve tam aralıkla doğrulanabilir atıf kurun. Bütünlük, kaynak izi, iddia desteği ve kaynak doğruluğunu ayırın.', 'Kaynak revizyonu ve tam aralıkla doğrulanabilir atıf kurun. Bütünlük, kaynak izi, iddia desteği ve kaynak doğruluğunu ayırın.', '## Dört kontrol, dört ayrı sonuç

Asistan “Salon cumaları onda açılır” diyor ve bağlantı gösteriyor. Gerçek bağlantı yalnızca ilk adımdır. Kaynak var mı, atıf pasajı yanıtın dediğini söylüyor mu, kaynak bu zaman ve kapsama uygulanıyor mu, kaynak güvenilir mi? Bunları ayrı sorun. Bir kontrolü geçmek diğerlerini sağlamaz.

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

Konumlar ancak çıkarımda kullanılan tam kaynak temsiline göre anlamlıdır. Bayt, Unicode kod noktası veya başka birim mi sayıldığını ve bitişin dışarıda olup olmadığını belirtin. Unicode normalizasyonu, PDF çıkarımı veya satır sonu dönüşümü konumları değiştirebilir. Değişmez kaynak revizyonunu ve metni yeniden üretmeye yetecek bilgiyi tutup çıkarılan aralığın eşleşmesini doğrulayın.

SHA-256 gibi özet, güvenilen beklenen özete göre uyuşmazlığı belirler. Saldırgan uydurma metni de gerçek metin kadar kolay hash’leyebilir. Metin ve beklenen hash aynı güvenilmeyen taraftan geliyorsa eşitlik özgünlük kanıtı değildir. Kaynak edinimi, doğrulanmış yayıncı kimliği ve teslim zinciri kayıtları problemin başka parçalarını çözer.

## Yanıttan kaynağa zinciri koruyun

<!-- diagram: Yanıt iddiası iddiaya, tam aralığa, kaynak revizyonuna ve edinim kaydına bağlanır. -->
1. Yanıt · cuma onda
2. İddia · a42 + koşullar
3. Aralık · tam destek metni
4. Revizyon · handbook-r3
5. Köken · edinim kaydı

*Atıf inceleyenin hattı yeniden kurmadan kanıtı kontrol etmesini sağlamalıdır.*

Alıntıyı incelenebilir ölçüde dar tutun; gerektiğinde niteleyici cümleyi ekleyin. “1 Kasım sonrası cumaları” olmadan “onda açılır” ifadesi ekim sorusunu desteklemez. Tek atfı paragrafa iliştirip her cümleyi kapsadığını varsaymak yerine çok iddialı yanıtta desteklenmeyen parçaları işaretleyin.

## Özel veriyi çoğaltmadan kararları kaydedin

Retrieval kararında istek/çalışma kimliği, çağıran kapsam kimliği, kaynak nesli, aday kimlikleri, filtre gerekçeleri ve son kanıt kimliklerini kaydedin. Özel belgeleri bütünüyle log’a kopyalamak yerine referans tercih edin. Hassas değerleri hata mesajlarından çıkarın. Denetim kaydı da erişim, saklama ve silme kuralı ister; “her şeyi log’la” denetimsiz başka hafıza deposu yaratır.

Uygun kaynak yanıtı desteklemiyorsa kanıt boşluğunu açıkça döndürün veya daha dar soru isteyin. Atıf biçimi ve retrieval ile kaynaklandırma bazı desteksiz çıktıları azaltabilir; halüsinasyonu ortadan kaldırmaz. W3C PROV türetim sözlüğü sunar; OWASP getirilen materyalin talimat olarak neden güvenilmez kalacağını açıklar. Bunlar tamamlayıcı konulardır. [PROV](https://www.w3.org/TR/prov-overview/), [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html).

## Bağlantıyı değil iddiayı test edin

> [!EXERCISE]
> **Kendinizi sınayın**
> Belge SHA-256 özetiyle eşleşiyor; fakat belgeyi bilinmeyen kullanıcı yüklemiş. Ne sonuç çıkarabilirsiniz?
>
> **Answer:** Yalnızca verilen baytların belirtilen yöntemle o özete uyduğunu söyleyebilirsiniz. Köken/özgünlük değerlendirmesi ve pasajın cevabı desteklediğine ayrı kontrol gerekir. Sağlama toplamı kaynak doğruluğunu sertifikalandırmaz.

## Kaynaklar ve ileri okuma

1. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
2. [OWASP · LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

', ARRAY['provenance', 'citation', 'hash', 'SHA256', 'evidence', 'kaynak izi', 'atıf', 'kanıt', 'halüsinasyon']::text[], 'MESA contributors', 5, 'published', 'Kanıt ve kaynak izi: atıf gerçekte neyi kanıtlar? — MESA Learn', 'Kaynak revizyonu ve tam aralıkla doğrulanabilir atıf kurun. Bütünlük, kaynak izi, iddia desteği ve kaynak doğruluğunu ayırın.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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

Filtering returned rows is not the entire isolation problem. Global corpus statistics can change lexical ranking when another tenant adds documents. Cache entries can replay evidence from a wider scope. Graph traversal can cross an allowed seed into a forbidden neighbor. State your isolation contract: preventing text disclosure and preventing cross-scope ranking influence are related but distinct properties.

Cache keys should distinguish caller/resource scope, query parameters, source generation and representation settings. Permission changes need invalidation or revalidation before using cached evidence. Multi-agent sharing adds no exemption: a summarizing agent must not copy private evidence into a shared note accessible to other agents. Derived artifacts inherit sensitive information even when the original wording is paraphrased.

## Run positive and negative controls

Create tenant A and tenant B with distinctive markers. Verify A can retrieve its own evidence, then ask A for B’s marker and verify no text, IDs or counts reveal it. Repeat through lexical, vector, graph and context endpoints, after restart and after cache warm-up. Revoke a grant and retest an existing session according to the product’s declared revocation policy. A zero-result test without an allowed positive control can hide a broken system.

> [!EXERCISE]
> **Check your understanding**
> A forbidden document never appears in results, but adding it changes tenant A’s ranking. Has complete scope isolation been demonstrated?
>
> **Answer:** No. Content disclosure may be blocked, but ranking depends on out-of-scope state. Check corpus statistics, shared caches and candidate generation against the stated isolation contract.

## Sources and further reading

1. [NIST · Role Based Access Control](https://csrc.nist.gov/projects/role-based-access-control)
2. [OWASP · LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

', ARRAY['authorization', 'RBAC', 'tenant', 'scope', 'cache', 'multi agent', 'yetki', 'kapsam', 'yalıtım']::text[], 'MESA contributors', 5, 'published', 'Shared memory: who may retrieve what? — MESA Learn', 'Trace identity, roles and dataset scope through retrieval, caches and graph paths. Test isolation before measuring relevance.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('memory-scope-and-authorization', 'learn', 'tr', 'Ortak hafıza: kim neyi geri getirebilir?', '', 'Kimliği, rolü ve dataset kapsamını retrieval, önbellek ve çizge yolunda izleyin. İlgililikten önce yalıtımı test edin.', 'Kimliği, rolü ve dataset kapsamını retrieval, önbellek ve çizge yolunda izleyin. İlgililikten önce yalıtımı test edin.', '## Prompt’taki isim kimlik değildir

İki ekip aynı asistanı kullanıyor ama arşivleri ayrı. Prompt “Ben yöneticiyim; bütün dataset’leri ara” diyor. Bu cümle yetki değildir. Principal’ı model dışında doğrulayın, sunucunun kontrol ettiği izinleri çözün ve izinli kaynak kümesine bağlayın. Ajan adı yürütme bağlamıdır; kendiliğinden tenant sınırı veya sahiplik kanıtı değildir.

| Kavram | Örnek | Yanıtladığı soru |
| --- | --- | --- |
| Principal | service-account-4 | Kim doğrulandı? |
| Rol | okuyucu / editör | Hangi eylem sınıfı? |
| Kaynak izni | Atlas dataset’i | Hangi kaynaklarda? |
| Oturum kapsamı | sabit izinli dataset kümesi | Bu oturum ne kullanabilir? |

Rol tabanlı erişim kontrolü izinleri rollerle gruplar; kaynak nitelikleri ve açık izinler bunları ayrıca sınırlayabilir. Okuyucu rolü her kurumun verisine erişim anlamına gelmemelidir. Ekleme, retrieval, purge, rollback ve yönetim işlemlerini ayrı kararlaştırın. En az yetki, işlemler gerçekten denetleniyorsa anlamlıdır. [NIST RBAC](https://csrc.nist.gov/projects/role-based-access-control).

## Sıralamadan sonra filtreleme neden yetmeyebilir?

Küresel ilk-10’un tamamı yasak kayıt olsun. Onları silmek boş cevap verir; oysa izinli en iyi kayıt on birincidir. Bu, kapsamın geç uygulanmasından doğan recall hatasıdır. Daha önemlisi yasak metin generator’a, iz kaydına veya çağırana görünen açıklamaya ulaşmamalıdır. Yetkili aday üretimini tercih edin ve son çıktı öncesi uygunluğu ayrıca doğrulayın.

<!-- diagram: Doğrulanmış kimlik izinli kapsam üretir; kapsam her retrieval kanalını ve son kanıtı sınırlar. -->
1. Doğrula · principal
2. Çöz · güncel izinler
3. Bağla · dataset kapsamı
4. Getir · her kanal kapsamlı
5. Kontrol · çıktı ve atıflar

*Kapsam sunucu kararıdır; skor bonusu veya prompt talimatı değildir.*

## İstatistik, önbellek ve yol da kapsam taşır

Dönen satırları filtrelemek yalıtımın tamamı değildir. Başka tenant belge ekleyince küresel corpus istatistiği sözcüksel sıralamayı değiştirebilir. Önbellek daha geniş kapsamın kanıtını yeniden sunabilir. Çizge izinli başlangıçtan yasak komşuya geçebilir. Yalıtım sözleşmesini belirtin: metin ifşasını önlemek ile kapsam dışı sıralama etkisini önlemek ilişkili fakat ayrı özelliklerdir.

Önbellek anahtarı çağıran/kaynak kapsamını, sorgu parametrelerini, kaynak neslini ve temsil ayarlarını ayırmalıdır. İzin değişince önbellek kanıtını kullanmadan geçersizleştirme veya tekrar doğrulama gerekir. Çok ajanlı paylaşım istisna değildir: özetleyen ajan özel kanıtı diğer ajanların görebildiği ortak nota kopyalamamalıdır. Türetilmiş artefaktlar özgün ifade değişse bile hassas bilgi taşıyabilir.

## Olumlu ve olumsuz kontrolleri çalıştırın

A ve B tenant’larını ayırt edici işaretlerle oluşturun. A’nın kendi kanıtını getirdiğini doğrulayın; sonra A’ya B’nin işaretini sorup metin, kimlik veya sayının bunu açığa çıkarmadığını kontrol edin. Sözcüksel, vektör, çizge ve bağlam endpoint’lerinde; restart ve önbellek ısınması sonrasında tekrarlayın. İzni kaldırıp mevcut oturumu ürünün beyan ettiği iptal politikasına göre test edin. İzinli olumlu kontrol olmadan sıfır sonuç testi bozuk sistemi gizleyebilir.

> [!EXERCISE]
> **Kendinizi sınayın**
> Yasak belge sonuçta hiç görünmüyor ama eklenmesi A tenant’ının sıralamasını değiştiriyor. Tam kapsam yalıtımı gösterildi mi?
>
> **Answer:** Hayır. İçerik ifşası engellenmiş olabilir; sıralama kapsam dışı duruma bağımlıdır. Corpus istatistiğini, ortak önbelleği ve aday üretimini yalıtım sözleşmesine göre kontrol edin.

## Kaynaklar ve ileri okuma

1. [NIST · Role Based Access Control](https://csrc.nist.gov/projects/role-based-access-control)
2. [OWASP · LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

', ARRAY['authorization', 'RBAC', 'tenant', 'scope', 'cache', 'multi agent', 'yetki', 'kapsam', 'yalıtım']::text[], 'MESA contributors', 5, 'published', 'Ortak hafıza: kim neyi geri getirebilir? — MESA Learn', 'Kimliği, rolü ve dataset kapsamını retrieval, önbellek ve çizge yolunda izleyin. İlgililikten önce yalıtımı test edin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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

MESA Core v0.8.1 uses one combined owner per root and treats LanceDB/Kùzu as projections. Its rebuild is offline and full-root, not an online per-tenant repair. Those are product-specific limits; another system may choose different storage. Rebuild correctness requires preserving canonical evidence and representation identity, then verifying the replacement before cutover. [Core contract](docs/core/architecture/).

## Interpret a timeout

> [!EXERCISE]
> **Check your understanding**
> A client times out after the vector write. Should it create a fresh mutation with a fresh ID immediately?
>
> **Answer:** First inspect the original mutation status. Retry using the declared idempotency contract if appropriate. A fresh ID may duplicate an already admitted operation; a timeout is an observation failure, not proof of rollback.

## Sources and further reading

1. [SQLite · Atomic Commit](https://www.sqlite.org/atomiccommit.html)
2. [SQLite · Write-Ahead Logging](https://www.sqlite.org/wal.html)
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

', ARRAY['SQLite', 'outbox', 'idempotency', 'projection', 'LanceDB', 'Kuzu', 'projeksiyon', 'kalıcılık']::text[], 'MESA contributors', 5, 'published', 'Canonical storage and projections: survive a partial write — MESA Learn', 'Trace one mutation through SQL, vector and graph stores. Understand durable admission, retries, idempotency and projection rebuilds.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('sqlite-as-canonical-agent-memory', 'learn', 'tr', 'Kanonik depo ve projeksiyonlar: yarım yazmadan kurtulmak', '', 'Bir mutasyonu SQL, vektör ve çizge depolarında izleyin. Kalıcı kabulü, tekrarı, idempotency ve projeksiyon rebuild’ini anlayın.', 'Bir mutasyonu SQL, vektör ve çizge depolarında izleyin. Kalıcı kabulü, tekrarı, idempotency ve projeksiyon rebuild’ini anlayın.', '## Kimlik ve yaşam döngüsü için otorite belirleyin

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

', ARRAY['SQLite', 'outbox', 'idempotency', 'projection', 'LanceDB', 'Kuzu', 'projeksiyon', 'kalıcılık']::text[], 'MESA contributors', 5, 'published', 'Kanonik depo ve projeksiyonlar: yarım yazmadan kurtulmak — MESA Learn', 'Bir mutasyonu SQL, vektör ve çizge depolarında izleyin. Kalıcı kabulü, tekrarı, idempotency ve projeksiyon rebuild’ini anlayın.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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
2. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

', ARRAY['temporal', 'validity', 'decay', 'contradiction', 'version', 'zaman', 'geçerlilik', 'çelişki', 'unutma']::text[], 'MESA contributors', 5, 'published', 'Changing facts: validity, contradiction and forgetting — MESA Learn', 'Distinguish when a statement applies from when it was recorded. Handle corrections and conflicts without equating age with invalidity.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('temporal-decay-in-ai-memory', 'learn', 'tr', 'Değişen bilgi: geçerlilik, çelişki ve unutma', '', 'Bilginin geçerli olduğu zamanla kaydedildiği zamanı ayırın. Yaşı geçersizlik sanmadan düzeltme ve çatışmayı yönetin.', 'Bilginin geçerli olduğu zamanla kaydedildiği zamanı ayırın. Yaşı geçersizlik sanmadan düzeltme ve çatışmayı yönetin.', '## İki saat farklı soruları yanıtlar

Arşiv 18 Ekim’de yeni cuma açılış saatini duyuruyor; değişiklik 1 Kasım’da geçerli. Sistem duyuruyu 20 Ekim’de öğreniyor. “Bugün açılış saati ne?” ve “Sistemimiz 19 Ekim’e kadar ne kaydetmişti?” farklı sorulardır. Tek `updated_at` alanı iki anlamı güvenilir temsil edemez.

| Alan | Örnek | Anlam |
| --- | --- | --- |
| valid_from | 1 Kasım | İddianın uygulanmaya başladığı zaman |
| valid_to | açık uçlu | Uygulanabilirliğin bittiği zaman |
| recorded_at | 20 Ekim | Bu sistemin kaydettiği zaman |
| source_revision | handbook-r3 | Bunu söyleyen belge |

Bunlar dersin kavramsal alanlarıdır. Geçerlilik ve işlem zamanı geçmiş sorgularını birlikte desteklemek açık bitemporal model ve sorgu semantiği ister. Ürün zaman damgası saklıyor diye bu yeteneği çıkarmayın. MESA mimarisi kendi zaman filtrelerini ve sınırlarını belgeler; buradaki örnek tam bitemporal destek iddiası değildir.

## Değişimi aralıkla temsil edin

<!-- diagram: Revizyon 2 kasımdan önce, revizyon 3 kasımdan itibaren geçerlidir; kayıt ayrı zaman çizgisindedir. -->
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

Yeni görev notu eskiden daha fazla dikkat gerektirebilir. Tarihsel sözleşme yaşından bağımsız olarak geçmiş tarih için doğru kaynak kalabilir. Azalma seçilmiş sıralama sezgisidir; sürenin dolması geçerlilik kuralı; silme saklama eylemidir. Bunları ayırın. Güncellik ağırlığı açmadan hem “şimdi” hem geçmiş tarih sorularını test edin.

## Görünür çatışmayı sınıflandırın

> [!EXERCISE]
> **Kendinizi sınayın**
> Revizyon 2 kasıma kadar cuma 09.00, revizyon 3 kasımdan itibaren cuma 10.00 diyor. Birini yanlış etiketlemek zorunlu mu?
>
> **Answer:** Hayır. Farklı aralıklara uygulanıyorlar. İkisini koruyup sorunun tarihiyle filtreleyin. Çelişki için aynı varlık, kapsam ve örtüşen geçerlilik koşullarında uyumsuz değer gerekir.

## Kaynaklar ve ileri okuma

1. [W3C · PROV Overview](https://www.w3.org/TR/prov-overview/)
2. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

', ARRAY['temporal', 'validity', 'decay', 'contradiction', 'version', 'zaman', 'geçerlilik', 'çelişki', 'unutma']::text[], 'MESA contributors', 5, 'published', 'Değişen bilgi: geçerlilik, çelişki ve unutma — MESA Learn', 'Bilginin geçerli olduğu zamanla kaydedildiği zamanı ayırın. Yaşı geçersizlik sanmadan düzeltme ve çatışmayı yönetin.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('evaluating-ndcg-and-mrr-in-memory', 'learn', 'tr', 'Retrieval değerlendirme: recall, MRR, nDCG ve gecikme', '', 'Etiketli listede sıralama metriklerini hesaplayın, kaliteyi hızdan ayırın; kendi eğitim örneğini puanlamayan deney tasarlayın.', 'Etiketli listede sıralama metriklerini hesaplayın, kaliteyi hızdan ayırın; kendi eğitim örneğini puanlamayan deney tasarlayın.', '## Soru ve ilgililik etiketiyle başlayın

Neyin bulunması gerektiğini tanımlayana kadar arama sonucu makul görünür. Kaynak destekli etiketlerle küçük soru kümesi kurun. Tam kimlik, farklı ifade, tarihe duyarlı soru, cevapsız durum ve yasak kaynak ekleyin. Retrieval birimini kaydedin: ilgili belge çok sayıda ilgisiz parça içerebilir. İnceleyici her birimin soruyu destekleyip desteklemediğini değerlendirsin; ayrışmaları uzlaştırma için tutun.

Parça boyutu, birleştirme ağırlığı veya eşik ayarlamadan geliştirme sorusunu son testten ayırın. Sentetik soru kapsamı genişletebilir; fakat LLM sorusu ve LLM etiketi aynı hatayı veya yapay ifadeyi paylaşabilir. Örnekleri inceleyin, uygunsa gerçek kullanıcı sorusunu tutun ve kümeler arasındaki benzer soruları ayıklayın. Cevap metnini sorgu temsiline sızdırmayın.

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

Sistem bütün ilgili öğeyi buldu fakat ilk sıraya ilgisizi koydu. Recall tek başına bunu gizler; nDCG dereceli ilgililik ve konumla cezalandırır. Kazanç, indirim, kesim ve ilgili etiketi olmayan sorgu politikasını belirtin. Farklı tanımlar farklı değer üretebilir. Etiketlenmemiş materyal kendiliğinden ilgisiz kanıtlanmış değildir.

## Tek etkeni değiştirin, hataları inceleyin

<!-- diagram: Soruyu ve veriyi sabitleyin; tabanı tek değişiklikle karşılaştırıp eşlenmiş metrik ve hataları inceleyin. -->
1. Sabitle · veri + etiket
2. Taban · yalnız sözcüksel
3. Değişken · yoğun kanal ekle
4. Karşılaştır · aynı sorular
5. İncele · kayıp ve kazanım

*Daha yüksek ortalama kimlik, dil veya yetkilendirme gerilemesini gizleyebilir.*

Sorgu başına değişimi ve yararlı alt grupları kıyaslayın: kimlik/farklı ifade, kısa/uzun kaynak, dil ve kaynak yaşı. Örnek boyutu uygunsa belirsizlik raporlayın ve ham sorgu sonuçlarını koruyun. BEIR heterojen görevlerde değerlendirme örneğidir; skorunu kendinizin saymak yerine disiplinini kullanın. [BEIR](https://arxiv.org/abs/2104.08663), [IR değerlendirme](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html).

## Hataları gizlemeden hızı ölçün

Uçtan uca retrieval ile aşama sürelerini ayrı ölçün. Donanım, veri boyutu, eşzamanlılık, önbellek, ısınma, istek sayısı ve timeout’u belirtin. Ortanca ve kuyruk gecikmesini hata ve boş yanıtlarla raporlayın. Timeout’ları tablodan çıkarmak bozuk sistemi hızlı gösterebilir. Yerel deterministik örnek sözleşme testidir; gerçek embedding sağlayıcısı kalitesini veya üretim kapasitesini ölçmez.

> [!EXERCISE]
> **Kendinizi sınayın**
> X değişkeni Recall@20’yi artırıp nDCG@5’i düşürüyor. X doğrudan daha iyi mi?
>
> **Answer:** Zorunlu değil. Daha fazla ilgili aday bulup üst sıralara daha kötü yerleştiriyor. Sonraki görev, yeniden sıralama bütçesi, hata alt grupları ve gecikmeyle karar verin; hangi sorunun iyileşip gerilediğini inceleyin.

## Kaynaklar ve ileri okuma

1. [Manning, Raghavan & Schütze · Evaluation of ranked retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)
2. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)

', ARRAY['evaluation', 'MRR', 'nDCG', 'recall', 'precision', 'benchmark', 'latency', 'değerlendirme', 'gecikme']::text[], 'MESA contributors', 5, 'published', 'Retrieval değerlendirme: recall, MRR, nDCG ve gecikme — MESA Learn', 'Etiketli listede sıralama metriklerini hesaplayın, kaliteyi hızdan ayırın; kendi eğitim örneğini puanlamayan deney tasarlayın.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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

Replace Friday with Monday and update the expected ID to c2. Add a second Friday passage that says the room is closed for maintenance. Both now match the words: retrieval has exposed a conflict, not resolved it. Add explicit source revision and validity metadata before choosing the current answer. Finally try “last working day”; this lexical baseline does not know that phrase is intended to mean Friday.

Build a file of judged queries and expected source IDs, then calculate Recall@k and MRR using the previous lesson. Keep an untouched test split. Only after you understand the lexical failures should you add dense retrieval or a reranker. For an actual MESA integration, move to the version-pinned quickstart with credentials and providers; this lab is independent instructional code.

## Find the boundary of the demonstration

> [!EXERCISE]
> **Check your understanding**
> The code returns the expected source. Does that prove the handbook is current, the answer is true and tenant isolation is production-ready?
>
> **Answer:** No. The assertion verifies one retrieval behavior on controlled data. Validity, source trust, authentication, concurrency, deletion and production capacity need separate tests and implementation.

## Sources and further reading

1. [SQLite · FTS5 reference](https://www.sqlite.org/fts5.html)
2. [Manning, Raghavan & Schütze · Evaluation of ranked retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-ranked-retrieval-results-1.html)
3. [MESA Core v0.8.1 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/d3947846615e63b48dc7a5df9f1051b29f734263/docs/architecture-v4.md)

', ARRAY['Python', 'SQLite', 'FTS5', 'lab', 'tutorial', 'uygulama', 'laboratuvar', 'kod']::text[], 'MESA contributors', 5, 'published', 'Build a small search lab, without an LLM — MESA Learn', 'Run a complete Python/SQLite example, predict its results and add a judged regression case. Connect the course concepts to an inspectable program.', true, '2026-10-18T00:00:00Z', '2026-10-18T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('build-a-small-search-lab', 'learn', 'tr', 'LLM kullanmadan küçük bir arama laboratuvarı kurun', '', 'Tam Python/SQLite örneğini çalıştırın, sonucunu öngörün ve etiketli gerileme örneği ekleyin. Dersleri incelenebilir programa bağlayın.', 'Tam Python/SQLite örneğini çalıştırın, sonucunu öngörün ve etiketli gerileme örneği ekleyin. Dersleri incelenebilir programa bağlayın.', '## Ne kuracaksınız?

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

', ARRAY['Python', 'SQLite', 'FTS5', 'lab', 'tutorial', 'uygulama', 'laboratuvar', 'kod']::text[], 'MESA contributors', 5, 'published', 'LLM kullanmadan küçük bir arama laboratuvarı kurun — MESA Learn', 'Tam Python/SQLite örneğini çalıştırın, sonucunu öngörün ve etiketli gerileme örneği ekleyin. Dersleri incelenebilir programa bağlayın.', true, '2026-10-18T00:00:00Z', '2026-10-18T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('keyword-vs-semantic-search', 'research', 'tr', 'Keyword vs Semantic Search', 'Planlanan retrieval benchmark protokolü', 'Bu yayın önerilen bir karşılaştırmayı tanımlar. Herhangi bir benchmark sonucu sunmaz.', '', '## Araştırma sorusu

Dondurulmuş bir hukuk retrieval veri kümesi ve bağımsız değerlendirilen sorgu seti altında lexical, semantic ve hybrid retrieval relevance ve operasyonel maliyet bakımından nasıl farklılaşır?

## Neden önemli?

Arama yaklaşımları çoğu zaman veri kümesi, sorgu, relevance ve yapılandırma seçimlerini gizleyen geniş iddialarla karşılaştırılır. Yararlı bir karşılaştırma bu seçimleri incelenebilir kılmalıdır.

## Veri seti

> [!NOTE]
> **Henüz seçilmedi**
> Uydurma bir büyüklük verilmeyecektir. Kaynak uygunluğu, lisans, zamansal kesim, tekilleştirme ve sürüm kimliği çalıştırmadan önce kaydedilmelidir.

## Deney düzeni

- Veri kümesini, sorgu setini, değerlendirmeleri ve sistem yapılandırmalarını dondur.
- Lexical, semantic ve hybrid koşulları aynı uygun belgeler üzerinde çalıştır.
- Sorgu üretimini relevance değerlendirmesinden ayır.
- Yalnızca olumlu örnekleri değil, hataları ve sıfır sonuçlu sorguları da kaydet.

## Sonuçlar

> [!WARNING]
> **Henüz sonuç yok**
> Benchmark çalıştırılmadı. Tablolar ve grafikler yalnızca kanıt çıktıları mevcut olduğunda eklenecektir.

## Yeniden üretilebilirlik

Yayımlanabilir bir çalışma; veri seti kimliğini, sorgu ve değerlendirme sürümlerini, model kimliklerini, yapılandırmayı, kod revizyonunu, uygun olduğunda seed değerlerini, ortamı, ham çıktıları ve analiz adımlarını kaydetmelidir.

', ARRAY['benchmark', 'retrieval', 'semantic-search']::text[], 'MESA contributors', 9, 'published', 'Keyword vs Semantic Search — Planlanan Araştırma Protokolü', 'Keyword, semantic ve hybrid hukuki retrieval karşılaştırması için MESA''nın sonuç içermeyen planlı protokolünü inceleyin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('verify-ai-yargitay-decision', 'guide', 'en', 'How do you verify an AI-cited Yargıtay decision?', '', 'Treat the citation as an unverified lead until the decision identity, authoritative text, quoted passage, and legal fit are checked.', 'Locate the decision independently, match its identifiers, read the full text, trace every quotation, and document what the decision does and does not establish.', '## 1. Capture the exact claim

Save the decision number, chamber, date, quoted passage, and the conclusion the AI attached to it. Missing identifiers are a warning, not an invitation to guess.

## 2. Find an authoritative or traceable source

Search independently using the stated identifiers and distinctive phrases. Prefer an official publication where available; otherwise record the repository and retrieval date.

## 3. Match identity and text

- Court and chamber
- Docket and decision numbers
- Decision date
- Parties or anonymized factual pattern
- Quoted passage in its surrounding context

## 4. Assess legal fit

> [!WARNING]
> **Existence is not relevance**
> A real decision can still be factually distinguishable, superseded, exceptional, or unrelated to the proposed conclusion.

Identify the issue, material facts, reasoning, holding, procedural posture, and any later authority before relying on the citation.

## 5. Record the verification trail

- [ ] Stable source or saved artifact
- [ ] Identifiers and access date
- [ ] Exact supporting passage
- [ ] Reason the passage is relevant
- [ ] Contrary or limiting authority
- [ ] Reviewer and review date when the workflow requires one

', ARRAY['legal-research', 'verification', 'provenance']::text[], 'MESA contributors', 7, 'published', 'How to Verify an AI-Cited Yargıtay Decision — MESA Guide', 'Use a cautious, repeatable workflow to verify the identity, source, text, and relevance of an AI-cited Yargıtay decision.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('verify-ai-yargitay-decision', 'guide', 'tr', 'AI''nin Verdiği Yargıtay Kararı Nasıl Doğrulanır?', '', 'Karar kimliği, güvenilir metin, alıntılanan bölüm ve hukuki uygunluk kontrol edilene kadar atfı doğrulanmamış bir araştırma ipucu sayın.', 'Kararı bağımsız bulun, kimlik bilgilerini eşleştirin, tam metni okuyun, her alıntının izini sürün ve kararın neyi ortaya koyup koymadığını kaydedin.', '## 1. İddiayı aynen kaydedin

Esas ve karar numarasını, daireyi, tarihi, alıntılanan bölümü ve yapay zekânın buna bağladığı sonucu saklayın. Eksik kimlik bilgileri tahmin daveti değil, uyarıdır.

## 2. Güvenilir veya izlenebilir kaynağı bulun

Belirtilen kimlik bilgileri ve ayırt edici ifadelerle bağımsız arama yapın. Mümkünse resmî yayını tercih edin; değilse repository bilgisini ve erişim tarihini kaydedin.

## 3. Kimliği ve metni eşleştirin

- Mahkeme ve daire
- Esas ve karar numaraları
- Karar tarihi
- Taraflar veya anonimleştirilmiş olay örgüsü
- Alıntılanan bölümün çevresindeki bağlam

## 4. Hukuki uygunluğu değerlendirin

> [!WARNING]
> **Var olmak, ilgili olmak değildir**
> Gerçek bir karar yine de olgusal olarak ayrışabilir, sonraki içtihatla aşılmış olabilir, istisnai olabilir veya önerilen sonuçla ilgisiz olabilir.

Atfa güvenmeden önce hukuki sorunu, maddi olguları, gerekçeyi, hükmü, usulî aşamayı ve sonraki otoriteleri belirleyin.

## 5. Doğrulama izini kaydedin

- [ ] Stabil kaynak veya saklanan çıktı
- [ ] Kimlik bilgileri ve erişim tarihi
- [ ] Tam destekleyici bölüm
- [ ] Bölümün neden ilgili olduğu
- [ ] Aksi yöndeki veya sınırlayıcı otorite
- [ ] İş akışı gerektiriyorsa reviewer ve inceleme tarihi

', ARRAY['legal-research', 'verification', 'provenance']::text[], 'MESA contributors', 7, 'published', 'AI''nin Verdiği Yargıtay Kararı Nasıl Doğrulanır? — MESA Rehberi', 'Yapay zekânın atıf verdiği Yargıtay kararının kimliğini, kaynağını, metnini ve relevance''ını dikkatli bir iş akışıyla doğrulayın.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('provenance', 'glossary', 'tr', 'Provenance', '', 'Provenance, bilginin kaydedilmiş kökeni ve işlenme geçmişidir.', 'Bilginin nereden geldiğini, hangi sürümün kullanıldığını, nasıl dönüştürüldüğünü ve kullanımını hangi kanıtın desteklediğini açıklar.', '## Basit açıklama

**Provenance**
: Bir iddia veya retrieval sonucundan kaynak kimliğine ve ilgili işleme adımlarına uzanan iz.

## Hukuki örnek

Atıf verilen bir karar için provenance; mahkeme, daire, esas ve karar kimlikleri, tarih, kaynak URL''si veya saklanan çıktı, erişim tarihi, belge sürümü ve tam destekleyici bölümü içerebilir.

## Teknik açıklama

Bir retrieval sisteminde provenance; sonucu belgeye, revizyona, chunk''a, evidence span''e, pipeline sürümüne, model sürümüne, yetkilendirme kapsamına ve katkıda bulunan retrieval sinyallerine bağlayabilir.

## Neden önemli?

Provenance olmadan makul görünen bir yanıtı incelemek, yeniden üretmek, düzeltmek veya güvenle kullanmak zorlaşabilir.

', ARRAY['provenance', 'evidence']::text[], 'MESA contributors', 4, 'published', 'Provenance Nedir? — MESA Sözlüğü', 'Provenance''ın legal AI, retrieval ve kanıt odaklı memory sistemlerinde ne anlama geldiğini öğrenin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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

', ARRAY['methodology', 'retrieval', 'evaluation']::text[], 'MESA contributors', 8, 'published', 'Retrieval Evaluation Methodology — MESA Research', 'Review the minimum evidence, judgments, metrics, versioning, and reporting rules for MESA retrieval evaluations.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('retrieval-evaluation', 'methodology', 'tr', 'Retrieval değerlendirmesi', '', 'Bir retrieval sisteminin yararlı ve kaynağa dayalı materyali bulup bulmadığına ilişkin iddialar için asgari metodoloji.', 'Girdileri dondurun, sorgu üretimini judgment''tan ayırın, birden fazla metriği ve hata örneklerini raporlayın, her sonucu sürümlere ve ham kanıta bağlayın.', '## Kapsam

Bu yöntem karşılaştırmalı retrieval değerlendirmelerine uygulanır. Tek bir veri kümesini veya sorgu setini evrensel performans iddiasına dönüştürmez.

## Veri seti ve sorgu seçimi

- Kaynak uygunluğunu ve zamansal kesimi tanımlayın.
- Lisans ve saklama sınırlarını kaydedin.
- Veri kümesini, sorguları ve hariç tutmaları sürümleyin.
- Zor ve sıfır sonuçlu örnekleri bilinçli biçimde dahil edin.

## Relevance judgment

Judgment rehberi; dereceli relevance''ı, kanıt gereksinimlerini, anlaşmazlık yönetimini ve reviewer bağımsızlığını tanımlamalıdır. Sistem çıktısı kendi ground truth''unu sessizce belirlememelidir.

## Metrikler

| Ölçüm | Soru |
| --- | --- |
| Recall@k | İlgili materyal kesim içinde geri getirildi mi? |
| nDCG@k | Daha ilgili öğeler daha önce sıralandı mı? |
| MRR | İlk ilgili öğe ne kadar erken göründü? |
| Gecikme dağılımı | Retrieval hangi operasyonel maliyetle gerçekleşti? |

## Raporlama ve düzeltmeler

- [ ] Yapılandırma ve kod revizyonu
- [ ] Veri seti, sorgu ve judgment sürümleri
- [ ] Toplu ve sorgu bazlı çıktılar
- [ ] Hata örnekleri ve hariç tutmalar
- [ ] Bilinen sınırlılıklar
- [ ] Bulgular değiştirildiğinde düzeltme tarihi ve değişiklik kaydı

', ARRAY['methodology', 'retrieval', 'evaluation']::text[], 'MESA contributors', 8, 'published', 'Retrieval Değerlendirme Metodolojisi — MESA Research', 'MESA retrieval değerlendirmeleri için asgari kanıt, judgment, metrik, sürümleme ve raporlama kurallarını inceleyin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());

COMMIT;
