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
3. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

', ARRAY['memory', 'context window', 'session', 'kalıcı hafıza', 'bağlam', 'oturum']::text[], 'MESA contributors', 5, 'published', 'AI memory: what survives after a conversation? — MESA Learn', 'Distinguish model weights, the current context and persistent records. Design a memory write before choosing a database.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('what-is-ai-memory', 'learn', 'tr', 'Yapay zekâ hafızası: sohbet bitince ne kalır?', '', 'Modelin öğrendiklerini, o anki konuşmayı ve kalıcı kayıtları birbirinden ayırın. Veritabanı seçmeden önce neyi, nasıl saklayacağınıza karar verin.', 'Modelin öğrendiklerini, o anki konuşmayı ve kalıcı kayıtları birbirinden ayırın. Veritabanı seçmeden önce neyi, nasıl saklayacağınıza karar verin.', '## “Hatırlamanın” üç ayrı anlamı

Atlas arşivi için çalışan kurgusal bir asistan düşünün. Pazartesi, okuma salonunun dokuzda açıldığını söylüyorsunuz. Salı yeni bir sohbette açılış saatini soruyorsunuz. Uygulama önceki kaydı modele sunmazsa model yalnızca eğitimde öğrendiklerine dayanabilir. Kendinden emin bir yanıt vermesi, bilgiyi gerçekten hatırladığını göstermez.

Büyük dil modeli (LLM), girdiden sonra hangi token’ların geleceğini tahmin ederek metin üretir. Token, her zaman tam bir sözcüğe karşılık gelmeyen kodlanmış metin birimidir. Bağlam penceresi, modelin tek istekte işleyebildiği sınırlı girdi ve çıktı alanıdır. Kalıcı depolama ise bu tahmin sürecinin dışında, uygulama tarafından yönetilir. Burada “hafıza” bir mühendislik kavramıdır; modelin insan gibi hatırladığı söylenmiyor.

| Katman | İçerik | Değişim yolu |
| --- | --- | --- |
| Model parametreleri | Eğitimde öğrenilen örüntüler | Eğitim veya ince ayar |
| Bağlam penceresi | Bu isteğe verilen token’lar | Yeni istek oluşturma |
| Kalıcı hafıza | Model dışındaki kayıtlar | Yetkili yazma/güncelleme/silme |

Veritabanına bir satır eklemek modeli yeniden eğitmez. Uygulama o satırı bulup bağlama eklerse model, yalnızca ilgili istekte bu bilgiden yararlanabilir. Konuşma geçmişinde duran bir cümlenin de geçmiş kısaltıldığında veya yeni oturum açıldığında erişilebilir kalacağı garanti değildir. Bunlar, farklı biçimlerde hata verebilen ayrı mekanizmalardır.

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

## İlk hafıza politikanızı tasarlayın

> [!EXERCISE]
> **Kendinizi sınayın**
> Asistan “salon dokuzda açılır” kaydını saklıyor; kaynağını ve kimlerin görebileceğini bilmiyor. Arama satırı her seferinde bulsa bile hangi iki sorun sürer?
>
> **Açıklama:** Kaynağıyla bağlantılı iddiayı güvenilir biçimde doğrulayamaz veya revize edemezsiniz; erişim sınırını da uygulayamazsınız. Arama başarısı kaynak izi ve yetkilendirmeyi çözmez. Arama kalitesini ölçmeden önce kaynak/revizyon ve kapsam alanlarını ekleyin.

## Kaynaklar ve ileri okuma

1. [Liu et al. (2023) · Lost in the Middle](https://arxiv.org/abs/2307.03172)
2. [Lewis et al. (2020) · Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
3. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

', ARRAY['memory', 'context window', 'session', 'kalıcı hafıza', 'bağlam', 'oturum']::text[], 'MESA contributors', 5, 'published', 'Yapay zekâ hafızası: sohbet bitince ne kalır? — MESA', 'Modelin öğrendiklerini, o anki konuşmayı ve kalıcı kayıtları birbirinden ayırın. Veritabanı seçmeden önce neyi, nasıl saklayacağınıza karar verin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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
2. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

', ARRAY['assertion', 'entity', 'schema', 'chunk', 'iddia', 'varlık', 'şema', 'kanıt aralığı']::text[], 'MESA contributors', 5, 'published', 'From documents to claims: preserve what extraction loses — MESA Learn', 'Represent exact text, entities and assertions without confusing an extracted claim with verified truth. Work through a source-linked record.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('structured-vs-unstructured-memory', 'learn', 'tr', 'Metinden bilgi kaydına: kaynakta neyi korumalı?', '', 'Bir belgeyi parçalara, varlıklara ve bilgi kayıtlarına dönüştürürken koşulları ve dayanakları nasıl koruyacağınızı öğrenin.', 'Bir belgeyi parçalara, varlıklara ve bilgi kayıtlarına dönüştürürken koşulları ve dayanakları nasıl koruyacağınızı öğrenin.', '## Aynı kaynağın üç temsili

Atlas kılavuzunda “1 Kasım’dan itibaren okuma salonu cuma günleri 10.00’da açılır; diğer hafta içi günlerde saat 09.00 olarak kalır” yazsın. Ham metin özgün ifadeyi korur. Metin parçası, ilgili bölümü aramada bulmayı sağlar. Yapılandırılmış kayıt; özneyi, ilişkiyi, değeri ve koşulları ayrı alanlara ayırır. Çizge de ilişkilerin izlenmesini kolaylaştırır. Bu temsillerin hiçbiri kaynağın doğruluğunu kendiliğinden kanıtlamaz.

| Temsil | Güçlü yönü | Kaybedebileceği bilgi |
| --- | --- | --- |
| Tam kaynak | Denetim ve yeniden yorumlama | Kolay sorgu yapısı |
| Metin parçası | Pasaj aramayı | Belge genelindeki niteleyici |
| İddia | Filtreleme ve join | Nüans veya çıkarım belirsizliği |
| Çizge kenarı | İlişki gezintisi | Açıkça bağlanmazsa kanıt |

Temsili, soracağınız soruya göre seçin. “Dördüncü paragraf ne diyor?” için tam metin gerekir. “Cuma günü dokuzdan sonra hangi salonlar açılıyor?” sorusu ise saat ve gün alanlarından yararlanır. Kaynak metni ve ona bağlı yapılandırılmış kaydı birlikte tutmak iki ihtiyacı da karşılar. Yapılandırılmış kaydı, ayrıştırıcı veya model değiştiğinde kaynaktan yeniden üretilebilen bir yorum olarak ele alın.

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
2. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

', ARRAY['assertion', 'entity', 'schema', 'chunk', 'iddia', 'varlık', 'şema', 'kanıt aralığı']::text[], 'MESA contributors', 5, 'published', 'Metinden bilgi kaydına: kaynakta neyi korumalı? — MESA', 'Bir belgeyi parçalara, varlıklara ve bilgi kayıtlarına dönüştürürken koşulları ve dayanakları nasıl koruyacağınızı öğrenin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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

', ARRAY['embedding', 'dense', 'sparse', 'cosine', 'vector', 'vektör', 'kosinüs', 'anlamsal arama']::text[], 'MESA contributors', 5, 'published', 'Anlamsal arama: vektörler neyi anlatır? — MESA', 'Sayısal temsillerin nasıl karşılaştırıldığını örneklerle görün. Benzerliğin neden doğruluk veya erişim izni anlamına gelmediğini öğrenin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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

## İlk teşhis adımını seçin

> [!EXERCISE]
> **Kendinizi sınayın**
> A-17 politikası araması her defasında A-71’i öne getiriyor. Hemen sıralama ağırlığını mı artırmalısınız?
>
> **Açıklama:** İndekslenen token ve sorgu sözdizimini inceleyin; sonra tam kimlik alanını test edin. İndeks kimlikleri ayırmıyorsa ağırlık bunu güvenilir biçimde onaramaz. Temsil doğru olduktan sonra skor ayarlayın.

## Kaynaklar ve ileri okuma

1. [Manning, Raghavan & Schütze · Okapi BM25](https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html)
2. [SQLite · FTS5 reference](https://www.sqlite.org/fts5.html)

', ARRAY['BM25', 'IDF', 'tokenization', 'FTS5', 'lexical', 'sözcüksel', 'Türkçe', 'tokenizasyon']::text[], 'MESA contributors', 5, 'published', 'BM25: bir sözcük ne zaman daha önemli olur? — MESA', 'Sözcük sıklığının, nadirliğin ve belge uzunluğunun sıralamayı nasıl etkilediğini hesaplayın. Modeli büyütmeden önce metnin nasıl işlendiğini inceleyin.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('hybrid-retrieval-explained', 'learn', 'tr', 'Hibrit arama: farklı sonuçları birleştirmek', '', 'Sözcük ve anlam temelli aramanın birbirini nasıl tamamladığını görün. Aday bulma, sonuçları birleştirme ve yeniden sıralama hatalarını ayırt edin.', 'Sözcük ve anlam temelli aramanın birbirini nasıl tamamladığını görün. Aday bulma, sonuçları birleştirme ve yeniden sıralama hatalarını ayırt edin.', '## Aynı cevabı kaçırmanın iki yolu

Kullanıcı “Son iş gününde ne zaman gelebilirim?” diye sorsun; kılavuzda ise “Cuma açılışı: 10.00” yazsın. Anlamsal arama bu ifade farkını aşabilir. Sözcük tabanlı arama da salon adını veya kural kodunu tam eşleştirebilir. Hibrit arama, farklı yöntemlerin bulduğu adayları birleştirir. Yeni bir kanal, diğerinin kaçırdığı ilgili sonucu buluyorsa veya kabul edilebilir maliyetle sıralamayı iyileştiriyorsa yararlıdır.

Çizge veya başka bir model eklemek, aramayı kendiliğinden iyileştirmez. Birbirine çok benzeyen kanallar aynı hatayı güçlendirebilir. Önce anlaşılır bir sözcük tabanlı yöntem ve uyumlu bir anlamsal model kurun. Ortak ve yalnızca tek kanalda bulunan ilgili sonuçları, boş yanıtları ve gecikmeyi ölçün. Karmaşıklığı, gördüğünüz bir hatayı çözmek için artırın. BEIR, yöntemlerin başarısının veri kümesine göre değiştiğini gösterir; o çalışmanın puanı sizin arşivinizin puanı değildir. [BEIR](https://arxiv.org/abs/2104.08663)

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

## Hatayı konumlandırın

> [!EXERCISE]
> **Kendinizi sınayın**
> Doğru pasaj yoğun kanalda 45. sırada, sözcüksel ilk 20’de yok; yalnızca ilk-20 birleşimini yeniden sıralıyorsunuz. Daha iyi yeniden sıralayıcı onu bulabilir mi?
>
> **Açıklama:** Hayır. Bu pasaj yeniden sıralayıcıya hiç ulaşmıyor. Sorgu temsili, kanal kesimi, parçalama ve aday recall’unu inceleyin. Yeniden sıralamaya daha fazla kaynak ayırmadan aynı etiketli sorularda değişiklikleri karşılaştırın.

## Kaynaklar ve ileri okuma

1. [Thakur et al. (2021) · BEIR](https://arxiv.org/abs/2104.08663)
2. [Nogueira & Cho (2019) · Passage Re-ranking with BERT](https://arxiv.org/abs/1901.04085)
3. [Cormack, Clarke & Büttcher (2009) · Reciprocal Rank Fusion](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)

', ARRAY['hybrid', 'reranking', 'candidate recall', 'cross encoder', 'hibrit', 'yeniden sıralama', 'aday']::text[], 'MESA contributors', 5, 'published', 'Hibrit arama: farklı sonuçları birleştirmek — MESA', 'Sözcük ve anlam temelli aramanın birbirini nasıl tamamladığını görün. Aday bulma, sonuçları birleştirme ve yeniden sıralama hatalarını ayırt edin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-18T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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
2. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

', ARRAY['RRF', 'rank fusion', 'weighted', 'k=60', 'sıra birleştirme', 'ağırlık']::text[], 'MESA contributors', 5, 'published', 'Reciprocal Rank Fusion: calculate and inspect every vote — MESA Learn', 'Fuse two ranked lists by hand, handle duplicates and ties, and understand why an RRF score is not confidence.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('reciprocal-rank-fusion-explained', 'learn', 'tr', 'RRF: iki sıralama nasıl birleştirilir?', '', 'İki sonuç listesini adım adım birleştirin; tekrarları, eşit puanları ve ağırlıkları inceleyin. RRF puanının neden doğruluk olasılığı olmadığını öğrenin.', 'İki sonuç listesini adım adım birleştirin; tekrarları, eşit puanları ve ağırlıkları inceleyin. RRF puanının neden doğruluk olasılığı olmadığını öğrenin.', '## Farklı listelerdeki sıraları kullanın

Atlas arşivinde iki arama yöntemi farklı listeler üretsin: Sözcük tabanlı liste A, B, C; anlamsal liste B, C, D olsun. Ham puanları aynı ölçekteymiş gibi toplamadan bu listeleri birleştirmek istiyorsunuz. Reciprocal Rank Fusion (RRF), her konuma giderek azalan bir katkı verir ve aynı adayın farklı listelerdeki katkılarını toplar. Hesabı açık, basit bir başlangıç yöntemidir.

Cormack, Clarke ve Büttcher, yöntemi belirli arama deneylerinde değerlendirdi. Sonuçları RRF’yi denemek için gerekçe sunar; her görevde iyileşme garantisi vermez. Özgün yöntemde katkılar eşit ağırlıktadır. Ağırlıklı RRF ise her kanalın katkısını ayrıca belirlenen bir ağırlıkla çarpar. [Özgün makale](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)

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

## Uç durumları dağıtımdan önce belirleyin

Katkıları toplamadan önce her kanalın kendi içindeki tekrarları ayıklayın. Aynı kimliğin iki kez dönmesi iki katkı sayılırsa yöntem değişir. Kimliğin belgeyi mi, pasajı mı, bilgi kaydını mı gösterdiğini belirleyin. Kanallar farklı birimler döndürüyorsa önce ortak birimde eşleştirin. Metnin aynı olması tek başına güvenilir kimlik eşleştirmesi değildir.

Toplam puanlar eşitse asıl kayıt kimliğine göre sıralama gibi sabit ve belgelenmiş bir kural kullanın. Ağırlıklı birleştirmede sonlu olmayan ağırlıkları reddedin; sıfır ağırlığın kanalı kapatıp kapatmadığını açıkça belirleyin. Aynı arama yönteminin iki kopyasına tam ağırlık vermek aynı dayanağı iki kez sayabilir. Çok katkı alması, yanlış veya yetkisiz bir kaynağı kabul edilebilir yapmaz.

## Ağırlık değişince yeniden hesaplayın

> [!EXERCISE]
> **Kendinizi sınayın**
> Tabloda yoğun kanalın ağırlığını sıfırlayın. Hangi sıra kalır; D’ye ne olur?
>
> **Açıklama:** A, B, C sözcüksel sırada kalır. D sıfır katkı alır; sıfır skorlu adayın çıkarılması açık çıktı politikasıdır. Sıfır, D’nin yanlış veya ilgisiz olduğunu kanıtlamaz.

## Kaynaklar ve ileri okuma

1. [Cormack, Clarke & Büttcher (2009) · Reciprocal Rank Fusion](https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf)
2. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

', ARRAY['RRF', 'rank fusion', 'weighted', 'k=60', 'sıra birleştirme', 'ağırlık']::text[], 'MESA contributors', 5, 'published', 'RRF: iki sıralama nasıl birleştirilir? — MESA', 'İki sonuç listesini adım adım birleştirin; tekrarları, eşit puanları ve ağırlıkları inceleyin. RRF puanının neden doğruluk olasılığı olmadığını öğrenin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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
3. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

', ARRAY['graph', 'GraphRAG', 'multi hop', 'Kuzu', 'knowledge graph', 'çizge', 'ilişki']::text[], 'MESA contributors', 5, 'published', 'Knowledge graphs: follow relations without inventing proof — MESA Learn', 'Build a source-linked graph, trace a two-hop question, and distinguish graph traversal from GraphRAG summaries and valid inference.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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

Merkezilik ölçüsü, bir düğümün seçilen kurala göre ne kadar bağlantılı olduğunu anlatır. Çok atıf alan bir düğüm yine de yanlış bilgi taşıyabilir. PageRank’i doğruluk puanı olarak kullanmayın. Hangi kaynakların neden geri plana alınacağını da açıkça tanımlayın. Kaynak güvenilirliği, sorguyla ilgililik ve çizgede görünürlük farklı ölçütlerdir.

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
3. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

', ARRAY['graph', 'GraphRAG', 'multi hop', 'Kuzu', 'knowledge graph', 'çizge', 'ilişki']::text[], 'MESA contributors', 5, 'published', 'Bilgi çizgeleri: ilişkileri kaynaklarıyla izlemek — MESA', 'Kaynakları belli bir çizge kurun ve iki adımlı bir soruyu çözün. Bir bağlantıyı bulmakla, o bağlantıdan geçerli bir sonuç çıkarmanın farkını görün.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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
3. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

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
3. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

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
3. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

', ARRAY['authorization', 'RBAC', 'tenant', 'scope', 'cache', 'multi agent', 'yetki', 'kapsam', 'yalıtım']::text[], 'MESA contributors', 5, 'published', 'Shared memory: who may retrieve what? — MESA Learn', 'Trace identity, roles and dataset scope through retrieval, caches and graph paths. Test isolation before measuring relevance.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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

Yalnızca dönen satırları filtrelemek tam yalıtım sağlamaz. Başka bir erişim alanına belge eklenmesi, bütün veriler üzerinden hesaplanan sözcük istatistiklerini ve sıralamayı değiştirebilir. Önbellek daha geniş bir kapsamdan bilgi döndürebilir. Çizge, izinli bir düğümden kapalı bir komşuya geçebilir. İçeriğin dışarı sızmasını önlemekle, kapsam dışındaki verilerin sıralamayı etkilemesini önlemek ayrı güvencelerdir; hangisini sağladığınızı açıkça belirtin.

Önbellek anahtarı; kullanıcının ve kaynakların erişim kapsamını, sorgu ayarlarını, kaynak güncellemesini ve temsil ayarlarını ayırt etmelidir. İzinler değiştiğinde eski sonucu yeniden kullanmadan önce geçersizleştirme veya tekrar doğrulama gerekir. Birden fazla ajanın çalışması bu kuralı değiştirmez: Özetleyen ajan özel bilgiyi herkese açık ortak nota taşımamalıdır. Sözcükler değişse bile türetilen özet hassas bilgiyi koruyabilir.

## Olumlu ve olumsuz kontrolleri çalıştırın

A ve B için ayrı üst erişim alanları oluşturup belgelerine ayırt edici işaretler ekleyin. A’nın kendi kaynağını bulduğunu doğrulayın; sonra B’nin işaretini sorup metin, kimlik veya sayılar üzerinden bilgi sızmadığını kontrol edin. Sözcük, vektör, çizge ve bağlam arayüzlerinde; yeniden başlatmadan ve önbellek dolduktan sonra testi tekrarlayın. İzni kaldırıp mevcut oturumun bildirilen iptal kuralına uyduğunu da sınayın. İzinli bir sonucun bulunabildiğini kontrol etmeden yalnızca boş yanıt beklemek, çalışmayan bir sistemi güvenliymiş gibi gösterebilir.

> [!EXERCISE]
> **Kendinizi sınayın**
> Yasak belge sonuçta hiç görünmüyor ama eklenmesi A’nın sıralamasını değiştiriyor. Tam kapsam yalıtımı gösterildi mi?
>
> **Açıklama:** Hayır. İçerik ifşası engellenmiş olabilir; sıralama kapsam dışı duruma bağımlıdır. Belge istatistiklerini, ortak önbelleği ve aday üretimini yalıtım sözleşmesine göre kontrol edin.

## Kaynaklar ve ileri okuma

1. [NIST · Role Based Access Control](https://csrc.nist.gov/projects/role-based-access-control)
2. [OWASP · LLM Prompt Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/LLM_Prompt_Injection_Prevention_Cheat_Sheet.html)
3. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

', ARRAY['authorization', 'RBAC', 'tenant', 'scope', 'cache', 'multi agent', 'yetki', 'kapsam', 'yalıtım']::text[], 'MESA contributors', 5, 'published', 'Ortak hafıza: kim hangi bilgiye erişebilir? — MESA', 'Kimliği ve izinleri arama, önbellek ve çizge boyunca izleyin. Sonuçların ilgililiğini ölçmeden önce veri yalıtımını sınayın.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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

MESA Core v0.9.0 uses one combined owner per root and treats LanceDB/Kùzu as projections. Its rebuild is offline and full-root, not an online per-tenant repair. Those are product-specific limits; another system may choose different storage. Rebuild correctness requires preserving canonical evidence and representation identity, then verifying the replacement before cutover. [Core contract](docs/core/architecture/).

## Interpret a timeout

> [!EXERCISE]
> **Check your understanding**
> A client times out after the vector write. Should it create a fresh mutation with a fresh ID immediately?
>
> **Answer:** First inspect the original mutation status. Retry using the declared idempotency contract if appropriate. A fresh ID may duplicate an already admitted operation; a timeout is an observation failure, not proof of rollback.

## Sources and further reading

1. [SQLite · Atomic Commit](https://www.sqlite.org/atomiccommit.html)
2. [SQLite · Write-Ahead Logging](https://www.sqlite.org/wal.html)
3. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

', ARRAY['SQLite', 'outbox', 'idempotency', 'projection', 'LanceDB', 'Kuzu', 'projeksiyon', 'kalıcılık']::text[], 'MESA contributors', 5, 'published', 'Canonical storage and projections: survive a partial write — MESA Learn', 'Trace one mutation through SQL, vector and graph stores. Understand durable admission, retries, idempotency and projection rebuilds.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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

MESA Core v0.9.0’de her veri dizinini tek combined süreci yönetir; LanceDB ve Kùzu arama görünümleridir. Yeniden oluşturma çevrimdışıdır ve bütün veri dizinini kapsar. Tek bir üst erişim alanını çevrimiçi onarma işlemi değildir. Bunlar MESA’ya özgü sınırlardır; başka bir sistem farklı depolama düzeni seçebilir. Yeniden oluştururken asıl kanıtı ve temsil kimliğini koruyun; geçişten önce yeni görünümü doğrulayın. [Core sözleşmesi](docs/core/architecture/)

## Zaman aşımını yorumlayın

> [!EXERCISE]
> **Kendinizi sınayın**
> İstemci, vektör yazıldıktan sonra zaman aşımına uğruyor. Hemen yeni kimlikle bir yazma işlemi başlatmalı mı?
>
> **Açıklama:** Önce ilk işlemin durumunu kontrol edin. Yeniden deneme uygunsa aynı işlem kimliği ve güvenli tekrar kurallarıyla ilerleyin. Yeni kimlik, zaten kabul edilmiş işlemi çoğaltabilir. Zaman aşımı, istemcinin sonucu göremediğini gösterir; işlemin geri alındığını göstermez.

## Kaynaklar ve ileri okuma

1. [SQLite · Atomic Commit](https://www.sqlite.org/atomiccommit.html)
2. [SQLite · Write-Ahead Logging](https://www.sqlite.org/wal.html)
3. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

', ARRAY['SQLite', 'outbox', 'idempotency', 'projection', 'LanceDB', 'Kuzu', 'projeksiyon', 'kalıcılık']::text[], 'MESA contributors', 5, 'published', 'Ana kayıt ve arama görünümleri: yarım kalan yazmayı tamamlamak — MESA', 'Bir değişikliğin SQL, vektör ve çizge depolarına nasıl yazıldığını izleyin. Yeniden denemeyi, güvenli tekrarı ve arama görünümlerini yeniden kurmayı öğrenin.', true, '2026-10-17T00:00:00Z', '2026-10-17T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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
2. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

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
2. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

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
3. [MESA Core v0.9.0 · Architecture and limitations](https://github.com/Yasou13/MESA/blob/7062fafe2cff8442eb84d1da60df164099526c8e/docs/architecture-v4.md)

', ARRAY['Python', 'SQLite', 'FTS5', 'lab', 'tutorial', 'uygulama', 'laboratuvar', 'kod']::text[], 'MESA contributors', 5, 'published', 'Build a small search lab, without an LLM — MESA Learn', 'Run a complete Python/SQLite example, predict its results and add a judged regression case. Connect the course concepts to an inspectable program.', true, '2026-10-18T00:00:00Z', '2026-10-18T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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

', ARRAY['Python', 'SQLite', 'FTS5', 'lab', 'tutorial', 'uygulama', 'laboratuvar', 'kod']::text[], 'MESA contributors', 5, 'published', 'Dil modeli olmadan küçük bir arama sistemi kurun — MESA', 'Python ve SQLite ile tam bir örnek çalıştırın. Sonucu tahmin edin, değişiklikler yapın ve daha önce çalışan davranışları koruyan testler ekleyin.', true, '2026-10-18T00:00:00Z', '2026-10-18T00:00:00Z', '2026-10-28T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('verify-ai-yargitay-decision', 'guide', 'tr', 'Yapay zekânın atıf yaptığı Yargıtay kararı nasıl doğrulanır?', '', 'Kararın bilgilerini, asıl metnini, alıntılanan bölümü ve somut olayla ilişkisini kontrol etmeden atfı doğrulanmış kabul etmeyin.', 'Kararı bağımsız bulun, kimlik bilgilerini eşleştirin, tam metni okuyun, her alıntının izini sürün ve kararın neyi ortaya koyup koymadığını kaydedin.', '## 1. İddiayı aynen kaydedin

Esas ve karar numarasını, daireyi, tarihi, alıntıyı ve yapay zekânın bu karardan çıkardığı sonucu kaydedin. Kimlik bilgilerinin eksik olması, tahmin ederek tamamlamanız gereken bir boşluk değil, doğrulama uyarısıdır.

## 2. Güvenilir veya izlenebilir kaynağı bulun

Verilen numaralar ve ayırt edici ifadelerle kararı kendiniz arayın. Varsa resmî yayını kullanın. Başka bir kaynaktan ulaştıysanız sitenin veya veri tabanının adını ve erişim tarihini kaydedin.

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

Atfa dayanmadan önce uyuşmazlığı, önemli olayları, gerekçeyi, hükmü, usul durumunu ve karardan sonra oluşan içtihadı inceleyin.

## 5. Doğrulama izini kaydedin

- [ ] Kalıcı kaynak bağlantısı veya saklanmış kopya
- [ ] Kimlik bilgileri ve erişim tarihi
- [ ] Tam destekleyici bölüm
- [ ] Bölümün neden ilgili olduğu
- [ ] Aksi yöndeki ya da kararı sınırlayan içtihat ve kaynaklar
- [ ] Gerekiyorsa incelemeyi yapan kişi ve inceleme tarihi

', ARRAY['legal-research', 'verification', 'provenance']::text[], 'MESA contributors', 7, 'published', 'Yapay zekânın atıf yaptığı Yargıtay kararı nasıl doğrulanır? — MESA', 'Kararın bilgilerini, asıl metnini, alıntılanan bölümü ve somut olayla ilişkisini kontrol etmeden atfı doğrulanmış kabul etmeyin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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

', ARRAY['methodology', 'retrieval', 'evaluation']::text[], 'MESA contributors', 8, 'published', 'Retrieval Evaluation Methodology — MESA Research', 'Review the minimum evidence, judgments, metrics, versioning, and reporting rules for MESA retrieval evaluations.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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

', ARRAY['methodology', 'retrieval', 'evaluation']::text[], 'MESA contributors', 8, 'published', 'Arama sistemleri nasıl değerlendirilir? — MESA', 'Bir sistemin ilgili bilgileri ve bunların dayanaklarını bulabildiğini göstermek için hangi ölçümler ve kayıtlar gerekir?', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());

COMMIT;
