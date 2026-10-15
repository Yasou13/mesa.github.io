-- Seed Data for MESA Content Platform
-- Generated deterministically from content/hub.json
BEGIN;

-- 1. Seed Categories

-- 2. Seed Articles and Revisions

INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('semantic-search', 'learn', 'en', 'What is semantic search?', '', 'Semantic search retrieves information by estimated meaning and context, not only by exact word overlap.', 'It can find conceptually related text when the query and source use different words, but relevance still needs evaluation and source evidence.', '## Simple explanation

Keyword search asks which documents contain the terms. Semantic search asks which documents appear to express a related meaning. In practice, strong systems often combine both signals rather than treating either as universally superior.

## How it works

- Convert the query and candidate text into comparable representations.
- Estimate similarity within the authorized corpus.
- Rank candidates and preserve their source identity.
- Evaluate relevance against explicit judgments rather than intuition alone.

## Legal research example

A researcher may ask about an employer ending an employment relationship for loss of trust while a decision uses different doctrinal wording. Semantic retrieval may surface the conceptually related decision; the researcher must still verify the court, chamber, date, full text, and legal fit.

> [!WARNING]
> **Retrieval is not authority**
> A high similarity score does not prove that a decision exists, is current, or supports the proposed conclusion.

## Why it matters

Meaning-based retrieval can broaden recall, while lexical retrieval can preserve exact citations and terminology. Hybrid approaches can be useful when their contribution is measured transparently.

', ARRAY['semantic-search', 'retrieval']::text[], 'MESA contributors', 6, 'published', 'What Is Semantic Search? — MESA Learn', 'Understand semantic search, how it differs from keyword search, its limits, and why provenance still matters.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('semantic-search', 'learn', 'tr', 'Semantic Search Nedir?', '', 'Semantic search, bilgiyi yalnızca aynı kelimelere göre değil, tahmin edilen anlam ve bağlama göre geri getirir.', 'Sorgu ile kaynak farklı kelimeler kullandığında kavramsal olarak ilgili metni bulabilir; yine de relevance değerlendirmesi ve kaynak kanıtı gerekir.', '## Basit açıklama

Keyword search, hangi belgelerin terimleri içerdiğini sorar. Semantic search ise hangi belgelerin ilişkili bir anlam ifade ettiğini tahmin eder. Güçlü sistemler pratikte birini evrensel olarak üstün saymak yerine çoğu zaman iki sinyali birleştirir.

## Nasıl çalışır?

- Sorguyu ve aday metinleri karşılaştırılabilir temsillere dönüştürür.
- Yetkili veri kümesi içinde benzerliği tahmin eder.
- Adayları sıralar ve kaynak kimliklerini korur.
- Relevance''ı yalnızca sezgiyle değil, açık değerlendirmelerle ölçer.

## Hukuki araştırma örneği

Bir araştırmacı, güven kaybı nedeniyle iş ilişkisinin sona erdirilmesini ararken karar farklı bir doktrinsel ifade kullanabilir. Semantic retrieval kavramsal olarak ilgili kararı bulabilir; araştırmacı yine de mahkemeyi, daireyi, tarihi, tam metni ve hukuki uygunluğu doğrulamalıdır.

> [!WARNING]
> **Retrieval hukuki otorite değildir**
> Yüksek benzerlik skoru, kararın var olduğunu, güncel olduğunu veya önerilen sonucu desteklediğini kanıtlamaz.

## Neden önemli?

Anlam tabanlı retrieval recall''u genişletebilir; lexical retrieval ise kesin atıfları ve terminolojiyi koruyabilir. Hybrid yaklaşımlar, katkıları şeffaf biçimde ölçüldüğünde yararlı olabilir.

', ARRAY['semantic-search', 'retrieval']::text[], 'MESA contributors', 6, 'published', 'Semantic Search Nedir? — MESA Learn', 'Semantic search''ün ne olduğunu, keyword search''ten farkını, sınırlarını ve provenance''ın neden hâlâ önemli olduğunu anlayın.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('what-is-ai-memory', 'learn', 'en', 'What is AI memory?', 'State persistence, context limits, and the memory lifecycle in agent architectures', 'AI memory is the persistence layer that allows models and autonomous agents to retain state, recall verified past interactions, and accumulate knowledge across execution boundaries.', 'AI memory is more than chat history or context windows: it is a structured lifecycle of admission, storage, scoped retrieval, mutation, and verification that gives agents durable continuity.', '## Why memory is broader than chat history

In early conversational prototypes, ''memory'' simply meant appending past user and assistant messages into the next prompt. While this creates an illusion of continuity, it collapses as interactions grow.

- Context window exhaustion: Models have finite token limits; prompt space quickly runs out.
- Quadratic cost scaling: Every additional turn increases inference latency and processing cost.
- Attention dilution: When irrelevant historical turns crowd the prompt, models suffer from the ''lost-in-the-middle'' phenomenon and misplace critical instructions.
- Lack of state mutation: Simply keeping a transcript cannot represent updated facts, retracted assumptions, or resolved tasks.

**AI Memory**
: A structured persistence subsystem that selectively admits, stores, indexes, updates, and retrieves verified facts and state across independent model invocations.

## The taxonomy of agent memory

Cognitive architectures for AI agents categorize memory into distinct functional layers according to lifespan, representation, and mutability:

| Memory Type | Lifespan | Representation | Primary Function |
| --- | --- | --- | --- |
| Working Memory | Single task execution | In-context tokens, scratchpads | Tracking intermediate steps in a reasoning loop |
| Episodic Memory | Multi-session | Timestamped event logs, transcripts | Recalling specific past experiences and execution outcomes |
| Declarative Memory | Durable / Long-term | Typed facts, assertions, knowledge graphs | Retaining world knowledge, domain rules, and user preferences |
| Procedural Memory | Durable / Static | System prompts, tool schemas, code workflows | Guiding how actions and tools should be executed |

> [!NOTE]
> **Memory is not one single database**
> A robust autonomous agent rarely relies on a single storage mechanism. Working memory lives in prompt tokens; episodic memory benefits from vector and lexical logs; declarative memory requires relational consistency.

## The four phases of the memory lifecycle

Rather than treating memory as an append-only log, production agent architectures enforce an explicit lifecycle:

<!-- diagram: Diagram showing the four phases of the AI memory lifecycle: Admission, Storage, Scoped Retrieval, and Mutation -->
1. Admission: Filter & validate new observation
2. Storage: Canonical record + index projections
3. Retrieval: Scoped recall for prompt
4. Mutation: Invalidate superseded facts

*The agent memory lifecycle enforces validation before storage and invalidation upon state change.*

1. Admission Gate: The system determines whether an observation is novel, relevant, and supported by evidence before committing it to durable storage.
2. Storage and Indexing: The admitted assertion is persisted in a canonical store and indexed across derived search projections (vectors, keywords, graphs).
3. Scoped Retrieval: For any new user request, the retriever queries eligible memories within strict authorization and workspace bounds.
4. Mutation and Invalidation: When new facts contradict older claims, the system marks outdated records as superseded rather than letting contradictory data accumulate.

## Core architectural trade-offs

Designing agent memory involves fundamental engineering trade-offs that determine reliability and operational cost:

> [!WARNING]
> **The risk of catastrophic context pollution**
> Storing every raw thought or unverified hallucination poisons the agent''s future context. Over-retention is as damaging to reliability as catastrophic forgetting.

- [ ] Write latency vs Read latency: Eager fact extraction creates write overhead but clean retrieval; lazy storage saves ingestion time but demands expensive synthesis during recall.
- [ ] Schema flexibility vs Query determinism: Free-form text embeddings are versatile but difficult to filter with exact boolean rules.
- [ ] Persistence vs Privacy: Storing user preferences long-term requires explicit retention policies, forget mechanisms, and data boundaries.

## Where MESA fits

In the [MESA Core](mesa/) architecture, memory is engineered around durability and verification. Rather than storing amorphous text blobs, MESA maintains canonical assertions in SQLite, backed by explicit source identity, character-level evidence spans, and tenant scopes.

To serve diverse retrieval needs without compromising transactional integrity, MESA projects these canonical records into specialized search projections: [LanceDB](mesa/) for dense semantic vector search, and [Kùzu](mesa/) for entity graph traversal. Learn more about this data flow in [How MESA Works](how-it-works/).

## Further reading and research

1. [Park et al. (2023) — Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442)
2. [Sumers et al. (2023) — Cognitive Architectures for Language Agents (CoALA)](https://arxiv.org/abs/2309.02427)
3. [MESA Core Architecture Specification](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)

', ARRAY['ai-memory', 'persistence', 'context', 'foundations']::text[], 'MESA contributors', 7, 'published', 'What Is AI Memory? — MESA Learn', 'Understand how AI agent memory works, short-term vs long-term persistence, context window limits, and the complete memory lifecycle.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('what-is-ai-memory', 'learn', 'tr', 'AI Memory Nedir?', 'Ajan mimarilerinde durum kalıcılığı, bağlam sınırları ve hafıza yaşam döngüsü', 'AI memory, modellerin ve otonom ajanların durumu korumasını, doğrulanmış geçmiş etkileşimleri geri çağırmasını ve çalıştırma sınırlarının ötesinde bilgi biriktirmesini sağlayan kalıcılık katmanıdır.', 'AI memory, sohbet geçmişi veya bağlam penceresinden ibaret değildir: ajanlara kalıcı süreklilik sağlayan depolama, kapsamlı geri getirme, mutasyon ve doğrulama yaşam döngüsüdür.', '## Hafıza neden sohbet geçmişinden daha geniştir?

İlk konuşma tabanlı prototiplerde ''hafıza'', geçmiş kullanıcı ve asistan mesajlarını bir sonraki prompt''un sonuna eklemekten ibaretti. Bu yöntem kısa vadede bir süreklilik hissi yaratsa da etkileşimler uzadıkça yetersiz kalır.

- Bağlam penceresi tükenmesi: Modellerin token sınırları vardır; prompt alanı hızla dolar.
- Karesel maliyet artışı: Eklenen her tur çıkarım gecikmesini ve işlem maliyetini katlayarak artırır.
- Dikkat seyrelmesi: Alakasız geçmiş turlar prompt''u doldurduğunda modeller ''lost-in-the-middle'' etkisi yaşar ve kritik talimatları gözden kaçırır.
- Durum mutasyonu eksikliği: Yalnızca konuşma kaydı tutmak; güncellenen olguları, geri çekilen varsayımları veya tamamlanan görevleri temsil edemez.

**AI Memory**
: Farklı model çağrıları boyunca doğrulanmış olguları ve sistem durumunu seçici biçimde kabul eden, saklayan, indeksleyen, güncelleyen ve geri çağıran yapılandırılmış kalıcılık alt sistemi.

## Ajan hafızasının taksonomisi

Yapay zekâ ajanları için bilişsel mimariler, hafızayı yaşam süresi, temsil biçimi ve değiştirilebilirlik açısından farklı işlevsel katmanlara ayırır:

| Hafıza Türü | Yaşam Süresi | Temsil Biçimi | Birincil İşlev |
| --- | --- | --- | --- |
| Çalışma Hafızası (Working) | Tek görev yürütümü | Prompt içi token''lar, scratchpad | Muhakeme döngüsündeki ara adımları takip etme |
| Episodik Hafıza (Episodic) | Çoklu oturum | Zaman damgalı olay kayıtları, dökümler | Belirli geçmiş deneyimleri ve yürütüm sonuçlarını hatırlama |
| Bildirimsel Hafıza (Declarative) | Kalıcı / Uzun vadeli | Tipli olgular, assertion''lar, bilgi grafikleri | Dünya bilgisini, alan kurallarını ve kullanıcı tercihlerini koruma |
| Prosedürel Hafıza (Procedural) | Kalıcı / Statik | Sistem prompt''ları, araç şemaları, kod akışları | Eylemlerin ve araçların nasıl yürütüleceğini belirleme |

> [!NOTE]
> **Hafıza tek bir veritabanından ibaret değildir**
> Dayanıklı bir otonom ajan nadiren tek bir depolama mekanizmasına güvenir. Çalışma hafızası prompt token''larında yaşar; episodik hafıza vektör ve lexical loglardan beslenir; bildirimsel hafıza ilişkisel tutarlılık gerektirir.

## Hafıza yaşam döngüsünün dört aşaması

Üretim sınıfı ajan mimarileri, hafızayı yalnızca sonuna ekleme yapılan bir log gibi görmek yerine açık bir yaşam döngüsü yürütür:

<!-- diagram: AI hafıza yaşam döngüsünün dört aşamasını gösteren şema: Kabul, Depolama, Kapsamlı Geri Getirme ve Mutasyon -->
1. Kabul: Yeni gözlemi filtrele ve doğrula
2. Depolama: Kanonik kayıt + arama projeksiyonları
3. Geri Getirme: Prompt için kapsamlı geri çağırma
4. Mutasyon: Geçerliliğini yitiren olguları geçersiz kıl

*Ajan hafızası yaşam döngüsü, depolamadan önce doğrulamayı ve durum değiştiğinde geçersiz kılmayı zorunlu tutar.*

1. Kabul Kapısı (Admission Gate): Sistem, yeni bir gözlemin kalıcı depolamaya kaydedilmeden önce yeni, ilgili ve kanıtla desteklenmiş olup olmadığını belirler.
2. Depolama ve İndeksleme: Kabul edilen assertion kanonik bir depoda saklanır ve türetilmiş arama projeksiyonlarında (vektörler, kelimeler, grafikler) indekslenir.
3. Kapsamlı Geri Getirme (Scoped Retrieval): Yeni bir kullanıcı isteği için retriever, yalnızca yetkilendirilmiş kapsam ve workspace sınırları içindeki hafızaları sorgular.
4. Mutasyon ve Geçersiz Kılma (Mutation & Invalidation): Yeni olgular eski iddialarla çeliştiğinde sistem, çelişkili verilerin birikmesine izin vermek yerine eski kayıtları geçersiz olarak işaretler.

## Temel mimari ödünleşimler

Ajan hafızası tasarlamak, sistemin güvenilirliğini ve işletim maliyetini belirleyen temel mühendislik ödünleşimlerini içerir:

> [!WARNING]
> **Bağlam kirlenmesi riski**
> Her ham düşünceyi veya doğrulanmamış halüsinasyonu saklamak, ajanın gelecekteki bağlamını zehirler. Aşırı veri saklama, bilgiyi tamamen unutmak kadar güvenilirliğe zarar verir.

- [ ] Yazma gecikmesi ile Okuma gecikmesi: Erken olgu çıkarma yazma yükü yaratır ancak temiz geri getirme sağlar; tembel depolama yazmayı hızlandırır ancak geri çağırmada pahalı sentez gerektirir.
- [ ] Şema esnekliği ile Sorgu determinizmi: Serbest metin vektörleri çok yönlüdür ancak kesin mantıksal kurallarla filtrelenmesi zordur.
- [ ] Kalıcılık ile Gizlilik: Kullanıcı tercihlerini uzun vadeli saklamak, açık saklama politikaları ve veri sınırları gerektirir.

## MESA bu yapıda nerede durur?

[MESA Core](mesa/) mimarisinde hafıza, dayanıklılık ve doğrulama odaklı inşa edilmiştir. Biçimsiz metin yığınları saklamak yerine MESA; açık kaynak kimliği, karakter düzeyinde kanıt aralığı ve tenant kapsamlarıyla desteklenen kanonik assertion''ları SQLite içinde saklar.

İşlemsel bütünlüğü bozmadan farklı geri getirme ihtiyaçlarını karşılamak için MESA, bu kanonik kayıtları özel arama projeksiyonlarına aktarır: Vektör arama için [LanceDB](mesa/) ve varlık grafiği gezinimi için [Kùzu](mesa/). Bu veri akışını [MESA Nasıl Çalışır](how-it-works/) sayfasında ayrıntılarıyla görebilirsiniz.

## Kaynaklar ve ileri okuma

1. [Park vd. (2023) — Generative Agents: Interactive Simulacra of Human Behavior](https://arxiv.org/abs/2304.03442)
2. [Sumers vd. (2023) — Cognitive Architectures for Language Agents (CoALA)](https://arxiv.org/abs/2309.02427)
3. [MESA Core Mimari Spesifikasyonu](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)

', ARRAY['ai-memory', 'persistence', 'context', 'foundations']::text[], 'MESA contributors', 7, 'published', 'AI Memory Nedir? — MESA Learn', 'Yapay zekâ ajan hafızasının nasıl çalıştığını, kısa ve uzun vadeli kalıcılığı, bağlam penceresi sınırlarını ve hafıza yaşam döngüsünü anlayın.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('rag-vs-ai-memory', 'learn', 'en', 'RAG vs AI memory: What is the difference?', 'Comparing external knowledge retrieval with evolving, stateful agent continuity', 'Retrieval-Augmented Generation (RAG) fetches static reference material to ground prompt generation, whereas AI memory manages persistent, evolving agent and user state across time.', 'RAG treats data as an external, read-only reference library. AI memory treats data as a dynamic, stateful record of what an agent has learned, decided, and observed.', '## Two distinct missions: Reference library vs internal state

Engineers frequently confuse RAG and AI memory because both techniques query a database and inject retrieved snippets into a prompt. However, their architectural purpose and data lifecycle are fundamentally different.

Classic RAG solves an external knowledge problem: the foundation model''s training weights lack current or private facts. An external corpus (legal statutes, technical manuals, internal documentation) is chunked, embedded, and indexed offline. At runtime, the retriever executes a read-only query.

AI memory solves an internal continuity problem: autonomous agents interact with users, execute tasks, encounter failures, and receive corrections. Memory maintains an evolving, stateful model of those interactions across session boundaries.

## Architectural differences side-by-side

| Dimension | Retrieval-Augmented Generation (RAG) | AI Agent Memory |
| --- | --- | --- |
| Primary Purpose | Grounding generation in reference documents | Maintaining continuous state, preferences, and progress |
| Corpus Mutability | Static / Periodic batch indexing | Highly dynamic / Continuous read-write-update operations |
| Write Trigger | Offline ingestion pipeline | Agent actions, tool results, user feedback |
| Scoping & Isolation | Broad corpus or collection-level permissions | Strict tenant, workspace, agent, and session boundaries |
| Temporal Invalidation | Rare (versioned document releases) | Frequent (updating old facts, retracting invalidated claims) |
| Source Material | External documents (PDFs, Markdown, web pages) | Internal agent observations, structured assertions, dialogues |

## Where the two paradigms overlap

The shared confusion between RAG and memory stems from their common technical toolkit:

- Dense Vector Embeddings: Both use vector similarity to find conceptually related text when exact words differ.
- Lexical Inverted Indexes: Both rely on BM25 or full-text search to preserve exact proper nouns and identifiers.
- Rank Fusion: Both benefit from hybrid ranking algorithms like Reciprocal Rank Fusion (RRF) to merge complementary search signals.
- Context Window Injection: Both format retrieved records as context text prepended to an LLM completion request.

## When an agent needs both systems

Autonomous systems operating in specialized domains rarely choose between RAG and memory; they combine them into complementary pathways:

> [!TIP]
> **Real-world workflow: Legal AI Assistant**
> When a lawyer asks an agent to draft a memorandum for Matter #104, the agent queries RAG for statutory articles and precedents in [MESA Data](data/), while simultaneously querying AI Memory in [MESA Core](mesa/) to recall client constraints, agreed drafting templates, and previous feedback.

<!-- diagram: Workflow diagram showing dual retrieval: Query splits into RAG Reference Corpus and Agent Memory Store, fuses through scope checks, and delivers unified context to LLM -->
1. User Query: ''Draft brief for Matter 104''
2. Parallel Retrieve: RAG (Statutes) + Memory (Matter State)
3. Pre-fusion Scope Check: Verify workspace & authorization
4. Unified Scoped Context injected into LLM

*Complementary retrieval: RAG supplies domain authority while AI memory supplies task and user continuity.*

## How MESA approaches the boundary

The MESA ecosystem honors this distinction by keeping reference data and stateful memory in separate, auditable components with clean system boundaries:

- [MESA Data](data/) manages official legal-source pipelines (Resmî Gazete, Mevzuat, AYM), producing immutable, verified data releases.
- [MESA Core](mesa/) provides the stateful memory engine for agents, tracking assertions, execution state, and scoped relationships over time.
- Both components enforce verifiable evidence: whether a snippet comes from a statutory archive or an agent assertion, its source identity and character spans remain inspectable.

## References

1. [Lewis et al. (2020) — Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)
2. [Shinn et al. (2023) — Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366)
3. [MESA Ecosystem Architecture & Boundaries](https://mesamemory.dev/ecosystem/)

', ARRAY['rag', 'ai-memory', 'retrieval', 'foundations']::text[], 'MESA contributors', 8, 'published', 'RAG vs AI Memory: What Is the Difference? — MESA Learn', 'Compare Retrieval-Augmented Generation (RAG) over static corpora with stateful, persistent AI agent memory across mutability, scopes, and lifecycle.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('rag-vs-ai-memory', 'learn', 'tr', 'RAG ile AI Memory arasındaki fark nedir?', 'Dış bilgi geri getirme ile gelişen durum odaklı ajan sürekliliğinin karşılaştırılması', 'Retrieval-Augmented Generation (RAG) üretim için statik referans materyali getirirken, AI memory zaman içinde gelişen ajan ve kullanıcı durumunu yönetir.', 'RAG veriyi salt okunur bir kütüphane gibi ele alır; AI memory ise ajanın ne öğrendiğini, neye karar verdiğini ve ne gözlemlediğini takip eden dinamik bir durum kaydıdır.', '## İki farklı görev: Referans kütüphanesi ile iç durum

Mühendisler sık sık RAG ve AI memory kavramlarını birbirine karıştırır çünkü iki teknik de bir veritabanını sorgular ve geri getirilen parçaları prompt''a ekler. Ancak mimari amaçları ve veri yaşam döngüleri kökten farklıdır.

Klasik RAG harici bir bilgi sorununu çözer: temel modelin ağırlıklarında güncel veya kuruma özel bilgiler yer almaz. Dış veri kümesi (kanunlar, teknik kılavuzlar, şirket içi dokümantasyon) çevrimdışı parçalanır, vektörleştirilir ve indekslenir. Çalışma zamanında retriever salt okunur bir sorgu yürütür.

AI memory ise iç süreklilik sorununu çözer: otonom ajanlar kullanıcılarla etkileşime girer, görevleri yürütür, hatalarla karşılaşır ve düzeltmeler alır. Hafıza, bu etkileşimlerin oturumlar boyunca gelişen durum modelini korur.

## Mimari farkların karşılaştırması

| Boyut | Retrieval-Augmented Generation (RAG) | AI Agent Memory |
| --- | --- | --- |
| Birincil Amaç | Üretimi referans belgelerle temellendirme | Kalıcı durumu, tercihleri ve ilerlemeyi sürdürme |
| Veri Değişkenliği | Statik / Periyodik toplu indeksleme | Son derece dinamik / Sürekli okuma-yazma-güncelleme |
| Yazma Tetikleyicisi | Çevrimdışı ingestion hattı | Ajan eylemleri, araç çıktıları, kullanıcı geri bildirimi |
| Kapsam ve İzolasyon | Geniş veri kümesi veya koleksiyon düzeyinde izinler | Sıkı tenant, workspace, ajan ve oturum sınırları |
| Zamansal Geçersiz Kılma | Nadiren (sürümlenmiş belge yayınları) | Sıkça (eski olguları güncelleme, çürütülen iddiaları kaldırma) |
| Kaynak Materyali | Dış belgeler (PDF''ler, Markdown, web sayfaları) | İç ajan gözlemleri, yapılandırılmış iddialar, diyaloglar |

## İki yaklaşımın kesiştiği ortak mekanizmalar

RAG ile hafıza arasındaki kafa karışıklığı, kullandıkları ortak teknik araç setinden kaynaklanır:

- Dense Vektör Temsilleri: İkisi de sözcükler farklı olduğunda anlamsal olarak ilişkili metinleri bulmak için vektör benzerliğinden yararlanır.
- Lexical Ters İndeksler: İkisi de özel isimleri ve kesin tanımlayıcıları korumak için BM25 veya tam metin arama kullanır.
- Rank Fusion: İkisi de tamamlayıcı arama sinyallerini birleştirmek için Reciprocal Rank Fusion (RRF) gibi sıralama algoritmalarından faydalanır.
- Prompt Enjeksiyonu: İkisi de geri getirilen kayıtları LLM isteğinin başına bağlam metni olarak ekler.

## Bir ajanın her iki sisteme ne zaman ihtiyacı olur?

Uzmanlaşmış alanlarda çalışan otonom sistemler nadiren RAG ile hafıza arasında bir seçim yapar; ikisini tamamlayıcı hatlar olarak birleştirir:

> [!TIP]
> **Gerçek dünya senaryosu: Hukuk Asistanı**
> Bir avukat ajandan Dosya #104 için bir dilekçe taslağı hazırlamasını istediğinde; ajan mevzuat ve emsal kararlar için [MESA Data](data/) RAG hattını sorgularken, müvekkil kısıtlamalarını ve format tercihlerini hatırlamak için [MESA Core](mesa/) hafızasını sorgular.

<!-- diagram: Çift geri getirme akışı: Sorgu RAG veri kümesi ve Ajan Hafızasına ayrılır, yetki denetiminden geçer ve LLM bağlamında birleşir -->
1. Kullanıcı Sorgusu: ''Dosya 104 taslağını hazırla''
2. Paralel Getirme: RAG (Mevzuat) + Hafıza (Dosya Durumu)
3. Birleşim Öncesi Kapsam Denetimi: Workspace ve yetki kontrolü
4. Birleştirilmiş Bağlam LLM''e aktarılır

*Tamamlayıcı geri getirme: RAG alan otoritesini sağlarken, AI memory görev ve kullanıcı sürekliliğini sunar.*

## MESA bu sınıra nasıl yaklaşır?

MESA ekosistemi, referans verilerini ve durum bilgisi tutan hafızayı belirgin sistem sınırlarına sahip ayrı bileşenlerde tutarak bu ayrımı korur:

- [MESA Data](data/), resmî hukuk kaynaklarını (Resmî Gazete, Mevzuat, AYM) işleyen ve değiştirilemez, denetlenebilir veri paketleri yayımlayan altyapıdır.
- [MESA Core](mesa/), ajanlar için durum bilgisi tutan hafıza motorudur; iddiaları, yürütüm durumunu ve kapsamlı ilişkileri zaman içinde takip eder.
- Her iki bileşen de doğrulanabilir kanıt kuralını uygular: bir veri ister mevzuat arşivinden ister ajan hafızasından gelsin, kaynak kimliği ve kanıt aralığı korunur.

## Kaynaklar

1. [Lewis vd. (2020) — Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401)
2. [Shinn vd. (2023) — Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366)
3. [MESA Ekosistem Mimarisi ve Sınırları](https://mesamemory.dev/ecosystem/)

', ARRAY['rag', 'ai-memory', 'retrieval', 'foundations']::text[], 'MESA contributors', 8, 'published', 'RAG ile AI Memory Arasındaki Fark Nedir? — MESA Learn', 'Statik veri kümesi üzerindeki RAG yaklaşımı ile durum bilgisi tutan kalıcı AI memory arasındaki farkları, mutasyonu, kapsamları ve yaşam döngüsünü karşılaştırın.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('structured-vs-unstructured-memory', 'learn', 'en', 'Structured memory vs unstructured memory', 'Evaluating freeform text chunks against typed assertions, schemas, and relational entities', 'Unstructured memory stores raw text snippets and embeddings, while structured memory organizes knowledge into typed assertions, entities, relations, and explicit schemas.', 'Unstructured memory is flexible and easy to write; structured memory enables deterministic filtering, relational queries, contradiction resolution, and reliable state updates.', '## Two paradigms for representing agent knowledge

When an AI agent remembers information, it must store it in a specific representation. The primary architectural divide lies between unstructured text chunks and typed structured assertions.

![Archival engraving plate illustrating diffuse unstructured text streams contrasted against a structured taxonomic assertion tree](assets/taxonomic-classification-plate.svg)
*Unstructured memory treats text as fluid semantic chunks; structured memory extracts typed entities, explicit predicates, and discrete constraints.*

Unstructured memory stores raw conversation turns, markdown notes, or document passages. To find information, it relies on embedding algorithms to estimate semantic similarity. Structured memory extracts discrete entities, attributes, relations, and truth conditions into formal schema tables.

## The contradiction and state mutation problem

The fundamental flaw of purely unstructured memory emerges when an agent must update a fact that changes over time:

> [!WARNING]
> **The vector contradiction dilemma**
> If an agent stores ''User prefers Python'' on Monday, and ''User migrated to Rust'' on Friday, both text snippets are embedded into vector space. A query for ''What programming language does the user prefer?'' retrieves both chunks with high semantic similarity. The model must guess which one is current.

In structured memory, state changes are handled deterministically through database keys, timestamps, and revision lifecycles. The system updates the entity attribute `prefers_language` or marks the older assertion record as superseded.

## Engineering trade-offs side-by-side

| Dimension | Unstructured Memory (Text + Vectors) | Structured Memory (Assertions + Schemas) |
| --- | --- | --- |
| Ingestion Complexity | Low: split text and calculate embeddings | High: requires parsing, entity extraction, and schema validation |
| Query Expressiveness | Fuzzy semantic exploration, paraphrases | Precise boolean filters, numerical comparisons, joins |
| Contradiction Handling | Poor: conflicting chunks accumulate | Strong: primary keys, versioning, explicit updates |
| Relational Multi-Hop | Weak: cannot traverse explicit entity edges | Strong: graph traversals and relational SQL joins |
| Token Efficiency | Low: injects verbose multi-sentence chunks | High: injects compact, precise factual triples |
| Schema Evolution | Trivial: schema-free text storage | Requires migration runbooks and typed schema changes |

## The modern synthesis: Structured facts backed by raw evidence

High-assurance agent architectures do not force an artificial choice between structured and unstructured data. Instead, they link both representations in a dual-layer model:

- [ ] The structured assertion acts as the indexable, filterable identity (Subject, Predicate, Object, Timestamp, Scope).
- [ ] The raw unstructured passage acts as the verifiable evidence span, ensuring the original textual context is preserved.
- [ ] Queries use structured filters to guarantee tenant and scope isolation, then use vector similarity to evaluate semantic relevance within that safe boundary.

## MESA''s canonical assertion architecture

In [MESA Core](mesa/), memory is not an opaque vector blob. The canonical source of truth is a relational SQLite database holding structured assertions with explicit schemas, lifecycle states, and evidence spans.

LanceDB and Kùzu exist strictly as derived projections. If a projection becomes corrupt or unsynchronized, it can be recomputed deterministically from canonical SQLite assertions. Explore this dual architecture in the [MESA Core Documentation](mesa/).

## Further reading

1. [Sowa (2000) — Knowledge Representation: Logical, Philosophical, and Computational Foundations](https://www.jfsowa.com/krbook/)
2. [Baader et al. (2003) — The Description Logic Handbook](https://www.cambridge.org/core/books/description-logic-handbook/368B04527F3841C313C5EB8A7AEF9B37)
3. [MESA V4 Architecture Specification](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)

', ARRAY['structured-memory', 'knowledge-representation', 'ai-memory', 'foundations']::text[], 'MESA contributors', 8, 'published', 'Structured Memory vs Unstructured Memory — MESA Learn', 'Examine the technical differences, query determinism, update mechanics, and trade-offs between freeform text chunks and typed assertions in agent memory.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('structured-vs-unstructured-memory', 'learn', 'tr', 'Yapılandırılmış hafıza ile yapılandırılmamış hafıza karşılaştırması', 'Serbest metin parçaları ile tipli assertion''ların, şemaların ve ilişkisel varlıkların değerlendirilmesi', 'Yapılandırılmamış hafıza ham metin parçaları ve vektörleri saklarken, yapılandırılmış hafıza bilgiyi tipli assertion''lar, varlıklar, ilişkiler ve açık şemalar halinde düzenler.', 'Yapılandırılmamış hafıza esnektir ve kolay yazılır; yapılandırılmış hafıza ise deterministik filtreleme, ilişkisel sorgular, çelişki yönetimi ve güvenilir durum güncellemeleri sağlar.', '## Ajan bilgisini temsil etmenin iki paradigması

Bir yapay zekâ ajanı bilgiyi hatırladığında, onu belirli bir veri temsilinde saklamak zorundadır. Temel mimari ayrım, yapılandırılmamış metin parçaları ile tipli yapılandırılmış assertion''lar arasında yaşanır.

![Akışkan yapılandırılmamış metin akışları ile yapılandırılmış taksonomik assertion ağacını karşılaştıran tarihi gravür plakası](assets/taxonomic-classification-plate.svg)
*Yapılandırılmamış hafıza metni akışkan anlamsal parçalar olarak ele alır; yapılandırılmış hafıza tipli varlıkları, açık bağıntıları ve somut kısıtları çıkarır.*

Yapılandırılmamış hafıza ham konuşma turlarını, markdown notlarını veya belge bölümlerini saklar. Bilgiyi bulmak için anlamsal benzerliği tahmin eden embedding algoritmalarına güvenir. Yapılandırılmış hafıza ise ayrık varlıkları, nitelikleri, ilişkileri ve doğruluk koşullarını biçimsel şema tablolarına çıkarır.

## Çelişki ve durum mutasyonu sorunu

Tamamen yapılandırılmamış hafızanın temel kusuru, ajanın zamanla değişen bir olguyu güncellemesi gerektiğinde ortaya çıkar:

> [!WARNING]
> **Vektör çelişki açmazı**
> Bir ajan pazartesi günü ''Kullanıcı Python tercih ediyor'' kaydını, cuma günü ise ''Kullanıcı Rust''a geçti'' kaydını saklarsa iki metin de vektör uzayına gömülür. ''Kullanıcı hangi dili tercih ediyor?'' sorgusu her iki parçayı da yüksek benzerlikle geri getirir. Model hangisinin güncel olduğunu tahmin etmek zorunda kalır.

Yapılandırılmış hafızada ise durum değişiklikleri veritabanı anahtarları, zaman damgaları ve revizyon yaşam döngüleri üzerinden deterministik biçimde yönetilir. Sistem `prefers_language` varlık niteliğini günceller veya eski assertion kaydını geçersiz olarak işaretler.

## Mühendislik ödünleşimlerinin karşılaştırması

| Boyut | Yapılandırılmamış Hafıza (Metin + Vektör) | Yapılandırılmış Hafıza (Assertion + Şema) |
| --- | --- | --- |
| Kabul / Yazma Karmaşıklığı | Düşük: metni böl ve embedding hesapla | Yüksek: ayrıştırma, varlık çıkarma ve şema doğrulaması gerektirir |
| Sorgu İfade Gücü | Yaklaşık anlamsal keşif, eş anlamlılar | Kesin mantıksal filtreler, sayısal karşılaştırmalar, join''ler |
| Çelişki Yönetimi | Zayıf: çelişkili metin parçaları birikir | Güçlü: birincil anahtarlar, sürümleme, açık güncellemeler |
| İlişkisel Çok Sekmeli Gezinim | Zayıf: açık varlık kenarlarını gezemez | Güçlü: graph gezinimleri ve ilişkisel SQL sorguları |
| Token Verimliliği | Düşük: uzun çok cümleli metin parçaları ekler | Yüksek: kompakt, kesin olgusal üçlüler (triple) ekler |
| Şema Evrimi | Önemsiz: şemasız metin depolama | Veritabanı geçişleri (migration) ve tipli şema güncellemeleri gerektirir |

## Modern sentez: Ham kanıtla desteklenen yapılandırılmış olgular

Yüksek güvenilirlikli ajan mimarileri, yapılandırılmış ile yapılandırılmamış veri arasında yapay bir tercih yapmaya zorlamaz. Bunun yerine iki temsili çift katmanlı bir modelde birbirine bağlar:

- [ ] Yapılandırılmış assertion; indekslenebilir, filtrelenebilir kimliği oluşturur (Özne, Yüklem, Nesne, Zaman, Kapsam).
- [ ] Ham yapılandırılmamış metin parçası; doğrulanabilir kanıt aralığını oluşturarak orijinal bağlamın korunmasını sağlar.
- [ ] Sorgular; önce tenant ve kapsam izolasyonunu garanti etmek için yapılandırılmış filtreleri çalıştırır, ardından bu güvenli sınır içinde anlamsal benzerliği ölçer.

## MESA''nın kanonik assertion mimarisi

[MESA Core](mesa/) içinde hafıza, kapalı bir vektör yığınından ibaret değildir. Kanonik bilgi kaynağı; açık şemaları, yaşam döngüsü durumlarını ve kanıt aralıklarını barındıran ilişkisel SQLite veritabanıdır.

LanceDB ve Kùzu yalnızca türetilmiş projeksiyonlar olarak çalışır. Bir projeksiyon bozulursa veya senkronizasyonunu yitirirse, kanonik SQLite assertion''larından deterministik olarak yeniden üretilebilir. Bu çift katmanlı mimariyi [MESA Core Dokümantasyonu](mesa/) sayfasında inceleyin.

## İleri okuma

1. [Sowa (2000) — Knowledge Representation: Logical, Philosophical, and Computational Foundations](https://www.jfsowa.com/krbook/)
2. [Baader vd. (2003) — The Description Logic Handbook](https://www.cambridge.org/core/books/description-logic-handbook/368B04527F3841C313C5EB8A7AEF9B37)
3. [MESA V4 Mimari Spesifikasyonu](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)

', ARRAY['structured-memory', 'knowledge-representation', 'ai-memory', 'foundations']::text[], 'MESA contributors', 8, 'published', 'Yapılandırılmış Hafıza ile Yapılandırılmamış Hafıza Karşılaştırması — MESA Learn', 'Serbest metin parçaları ile tipli assertion''lar arasındaki teknik farkları, sorgu determinizmini, güncelleme mekaniğini ve mühendislik ödünleşimlerini inceleyin.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('why-vector-search-alone-is-not-enough', 'learn', 'en', 'Why vector search alone is not enough for agent memory', 'Analyzing semantic similarity strengths and boundaries in stateful AI systems', 'Vector search excels at conceptual similarity over unstructured text, but agent memory requires exact identifiers, relational joins, temporal validity, and strict authorization.', 'Dense vector search is powerful for semantic recall, but struggles with exact keyword matching, multi-hop relational paths, temporal updates, and deterministic access controls.', '## What vector search does exceptionally well

Dense vector search transformed modern information retrieval by mapping natural language into geometric embedding spaces. When a query and a document express the same underlying concept using completely different vocabulary, cosine similarity bridges the semantic gap.

- Fuzzy conceptual matching: Understanding that ''automobile malfunction'' is related to ''car engine failure''.
- Paraphrase resilience: Retrieving relevant guidance regardless of syntactic phrasing.
- Multilingual bridging: Linking concepts across different natural languages.
- Unstructured exploration: Surfacing relevant passages without requiring rigid upfront database schemas.

> [!NOTE]
> **Vector databases are not inadequate in general**
> Vector databases are extraordinarily capable at what they were designed to do: approximate nearest neighbor search over static dense embeddings. The limitations arise when systems force vector search to solve relational, temporal, and authorization challenges it was never meant to handle.

## Failure mode 1: Exact identifiers and vocabulary mismatch

Dense embeddings compress variable-length text into fixed dimensional vectors (e.g. 768 or 1536 floating-point numbers). This lossy compression discards exact token identities.

> [!WARNING]
> **The exact identifier blind spot**
> In professional domains, agents frequently query exact codes: article numbers (`Article 314/2`), docket IDs (`2023/1458`), error codes (`ERR_CONN_REFUSED`), or user identifiers (`usr_98af`). In embedding space, tiny character variations produce unpredictable vector shifts. High similarity does not guarantee the exact identifier matches.

Lexical search algorithms like BM25 excel at exact token overlap. Replacing lexical indexes entirely with vector search cripples an agent''s ability to recall exact factual references.

## Failure mode 2: Multi-hop relational queries

Vectors treat chunks as independent geometric points. They have no concept of edges, ownership, or multi-hop relationship paths.

> [!TIP]
> **The relational query problem**
> Consider the query: ''Which contracts signed by Alice are subject to German arbitration?'' In vector space, documents containing ''Alice'', ''contract'', and ''German arbitration'' will score moderately, but vector distance cannot verify that Alice signed the specific contract that specifies German arbitration. Answering this requires traversing explicit relational graph edges: `(Alice)-[:SIGNED]->(Contract)-[:GOVERNED_BY]->(Arbitration)`.

## Failure modes 3 & 4: Temporal invalidation and authorization

Two operational requirements in multi-agent environments break naive vector architectures:

1. Temporal invalidation: Vector similarity does not decay gracefully. If an agent stores ''User lives in Rome'' and later ''User relocated to Madrid'', both vectors remain neighbors of ''Where does the user live?''. Without temporal metadata, the retriever surfaces contradictory state.
2. Authorization and Scope Isolation: If vector search queries the global embedding index and relies on post-filtering to remove unauthorized records, top-k truncation occurs: if the top 10 results belong to Tenant B, post-filtering strips them all, returning zero results to Tenant A even though relevant records exist deeper in the index.

## The multi-lane solution

The solution is not to discard vector search, but to combine it with complementary retrieval mechanisms into a multi-lane architecture:

- [ ] Dense Vector Lane: Semantic conceptual recall and paraphrase matching.
- [ ] Sparse Lexical Lane (BM25): Exact identifier, entity name, and code matching.
- [ ] Structured Assertion Lane: Boolean filtering, numerical ranges, and temporal validity.
- [ ] Relational Graph Lane: Multi-hop path traversal across explicit entity links.
- [ ] Pre-fusion Scope Filtering: Enforcing security boundaries before vector scan or fusion.

Learn how this is implemented in practice in our guide to [Hybrid Retrieval Explained](learn/hybrid-retrieval-explained/) and explore how [MESA Core](mesa/) coordinates four distinct retrieval lanes.

## Further reading

1. [Karpukhin et al. (2020) — Dense Passage Retrieval for Open-Domain Question Answering](https://arxiv.org/abs/2004.04906)
2. [Robertson & Zaragoza (2009) — The Probabilistic Relevance Framework: BM25 and Beyond](https://www.nowpublishers.com/article/Details/INR-019)
3. [MESA Independent Retrieval Audit & Fixtures](https://mesamemory.dev/how-it-works/)

', ARRAY['vector-search', 'embeddings', 'retrieval', 'search-limits']::text[], 'MESA contributors', 8, 'published', 'Why Vector Search Alone Is Not Enough for Agent Memory — MESA Learn', 'Analyze semantic similarity strengths and boundaries in agent memory: exact identifiers, relational joins, temporal validity, and scope isolation.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('why-vector-search-alone-is-not-enough', 'learn', 'tr', 'Vektör arama neden ajan hafızası için tek başına yetersizdir?', 'Durum bilgisi tutan yapay zekâ sistemlerinde anlamsal benzerliğin güçlü ve sınırlı yönleri', 'Vektör arama yapılandırılmamış metin üzerinde anlamsal benzerlikte mükemmeldir; ancak ajan hafızası kesin tanımlayıcılar, ilişkisel join''ler, zamansal geçerlilik ve sıkı yetkilendirme gerektirir.', 'Dense vektör arama kavramsal geri getirmede son derece güçlüdür; ancak kesin anahtar kelime eşleştirmede, çok sekmeli ilişkisel yollarda, zamansal güncellemelerde ve deterministik erişim denetimlerinde zorlanır.', '## Vektör aramanın olağanüstü iyi yaptığı şeyler

Dense vektör arama, doğal dili geometrik embedding uzaylarına eşleyerek bilgi erişiminde devrim yarattı. Bir sorgu ve belge tamamen farklı sözcükler kullanarak aynı kavramı ifade ettiğinde, kosinüs benzerliği anlamsal köprüyü kurar.

- Yaklaşık anlamsal eşleşme: ''Otomobil arızası'' ifadesinin ''araba motoru bozulması'' ile ilişkili olduğunu anlama.
- Eş anlamlılara ve ifadelere direnç: Farklı cümle yapılarına rağmen ilgili içeriği geri getirme.
- Çok dilli eşleme: Farklı dillerdeki kavramları ortak anlamsal uzayda bağlama.
- Yapılandırılmamış keşif: Katı veritabanı şemaları gerekmeden ilgili metin parçalarını bulma.

> [!NOTE]
> **Vektör veritabanları genel olarak yetersiz değildir**
> Vektör veritabanları tasarlandıkları işi son derece iyi yapar: statik embedding''ler üzerinde yaklaşık en yakın komşu araması. Sınırlılıklar; vektör aramanın tasarlanmadığı ilişkisel, zamansal ve yetkilendirme sorunlarını tek başına çözmeye zorlandığında ortaya çıkar.

## Hata modu 1: Kesin tanımlayıcılar ve sözcük uyumsuzluğu

Dense embedding''ler değişken uzunluktaki metinleri sabit boyutlu vektörlere (örneğin 768 veya 1536 kayan noktalı sayı) sıkıştırır. Bu kayıplı sıkıştırma, kesin token kimliklerini göz ardı eder.

> [!WARNING]
> **Kesin tanımlayıcı kör noktası**
> Uzmanlık alanlarında ajanlar sık sık kesin kodları sorgular: kanun maddeleri (`Madde 314/2`), dosya esas numaraları (`2023/1458`), hata kodları (`ERR_CONN_REFUSED`) veya kullanıcı kimlikleri (`usr_98af`). Vektör uzayında küçük karakter farkları öngörülemez mesafelere yol açar. Yüksek benzerlik, kesin tanımlayıcının eşleştiğini garanti etmez.

BM25 gibi lexical arama algoritmaları kesin token örtüşmesinde mükemmeldir. Lexical indeksleri tamamen terk edip yalnızca vektör aramaya güvenmek, ajanın kesin olgusal atıfları hatırlama yeteneğini zayıflatır.

## Hata modu 2: Çok sekmeli ilişkisel sorgular

Vektörler her metin parçasını bağımsız bir geometrik nokta olarak ele alır. Kenarlar, mülkiyet veya çok sekmeli ilişki yolları kavramına sahip değillerdir.

> [!TIP]
> **İlişkisel sorgu problemi**
> ''Ahmet tarafından imzalanan ve tahkim şartı içeren sözleşmeler hangileridir?'' sorgusunu düşünün. Vektör uzayında ''Ahmet'', ''sözleşme'' ve ''tahkim'' içeren belgeler orta düzeyde benzerlik alır; ancak vektör mesafesi Ahmet''in tahkim içeren o somut sözleşmeyi bizzat imzaladığını doğrulayamaz. Bunu yanıtlamak açık ilişkisel graph yollarını gezmeyi gerektirir: `(Ahmet)-[:İMZALADI]->(Sözleşme)-[:TABİDİR]->(Tahkim)`.

## Hata modu 3 & 4: Zamansal geçersiz kılma ve yetkilendirme

Çok ajanlı ortamlarda iki operasyonel gereksinim salt vektör mimarilerini zorlar:

1. Zamansal Geçersiz Kılma: Vektör benzerliği zamana göre kendiliğinden sönümlenmez. Bir ajan ''Kullanıcı Roma''da yaşıyor'' ve daha sonra ''Kullanıcı Madrid''e taşındı'' kaydettiğinde, iki vektör de ''Kullanıcı nerede yaşıyor?'' sorusuna yakın kalır. Zaman metaverisi olmadan retriever çelişkili durum döndürür.
2. Yetkilendirme ve Kapsam İzolasyonu: Vektör araması genel indekste yapılıp yetkisiz kayıtları ayıklamak için sonradan filtreleme (post-filtering) kullanılırsa, top-k budanması yaşanır: en yakın 10 sonuç Tenant B''ye aitse ve filtrelenirse, Tenant A için sistemde ilgili kayıtlar olmasına rağmen sıfır sonuç döner.

## Çok hatlı çözüm mimarisi

Çözüm vektör aramadan vazgeçmek değil; onu tamamlayıcı arama mekanizmalarıyla çok hatlı bir mimaride birleştirmektir:

- [ ] Dense Vektör Hattı: Anlamsal kavramsal hatırlama ve eş anlamlı eşleme.
- [ ] Sparse Lexical Hat (BM25): Kesin tanımlayıcılar, varlık adları ve kod eşleşmeleri.
- [ ] Yapılandırılmış Assertion Hattı: Mantıksal filtreleme, sayısal aralıklar ve zamansal geçerlilik.
- [ ] İlişkisel Graph Hattı: Açık varlık bağlantıları üzerinde çok sekmeli yol gezinimi.
- [ ] Birleşim Öncesi Kapsam Filtreleme: Vektör taramasından veya birleşimden önce güvenlik sınırlarını uygulama.

Bunun pratikte nasıl uygulandığını [Hybrid Retrieval Açıklaması](learn/hybrid-retrieval-explained/) rehberimizde okuyabilir ve [MESA Core](mesa/) mimarisinin dört farklı hattı nasıl koordine ettiğini inceleyebilirsiniz.

## Kaynaklar

1. [Karpukhin vd. (2020) — Dense Passage Retrieval for Open-Domain Question Answering](https://arxiv.org/abs/2004.04906)
2. [Robertson & Zaragoza (2009) — The Probabilistic Relevance Framework: BM25 and Beyond](https://www.nowpublishers.com/article/Details/INR-019)
3. [MESA Bağımsız Retrieval Denetimi ve Test Fixture''ları](https://mesamemory.dev/how-it-works/)

', ARRAY['vector-search', 'embeddings', 'retrieval', 'search-limits']::text[], 'MESA contributors', 8, 'published', 'Vektör Arama Neden Ajan Hafızası İçin Tek Başına Yetersizdir? — MESA Learn', 'Ajan hafızasında anlamsal benzerliğin güçlü ve sınırlı yönlerini analiz edin: kesin tanımlayıcılar, ilişkisel join''ler, zamansal geçerlilik ve kapsam izolasyonu.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('hybrid-retrieval-explained', 'learn', 'en', 'Hybrid retrieval explained: Vector search, lexical search, and structured signals', 'How multi-lane retrieval systems combine complementary search modalities for robust recall', 'Hybrid retrieval combines dense vector embeddings, sparse lexical inverted indexes (BM25), and structured database filters to prevent single-strategy retrieval failures.', 'Dense vectors capture meaning, lexical search captures exact terms, and structured queries enforce hard constraints; combining them creates a resilient retrieval pipeline.', '## Why single-modality retrieval fails

Every individual retrieval paradigm has a well-documented failure mode. Relying on a single mechanism exposes an autonomous agent to systematic blind spots:

| Retrieval Modality | Primary Index | Distinct Strength | Primary Failure Mode |
| --- | --- | --- | --- |
| Dense Vector Search | HNSW / IVF embeddings | Semantic paraphrasing and conceptual match | Fails on rare tokens, numbers, and exact codes |
| Sparse Lexical Search | BM25 / Inverted index | Exact keyword matching and rare identifiers | Fails on synonymy, polysemy, and vocabulary mismatch |
| Structured Assertion Search | B-tree / Relational SQL | Deterministic boolean and numerical filters | Fails on natural language inquiries with no schema match |
| Graph Path Traversal | Adjacency index / Graph DB | Multi-hop relational connections between entities | Fails on isolated facts lacking explicit edge extraction |

## How multi-lane search works in practice

In a hybrid retrieval architecture, a user query is dispatched concurrently to multiple retrieval lanes against the same underlying corpus:

<!-- diagram: Diagram showing query distributed across Vector, BM25, Assertion, and Graph lanes, followed by Reciprocal Rank Fusion -->
1. Query Ingestion & Scope Validation
2. Parallel Dispatch: Vector + BM25 + Assertion + Graph
3. Lane Scoring & Candidate Generation
4. Reciprocal Rank Fusion (RRF) Combination
5. Unified Re-ranked Results

*Multi-lane retrieval evaluates multiple complementary perspectives before synthesizing a final candidate list.*

By evaluating candidates across multiple lanes, a document that scores moderately in vector search but matches an exact docket code in BM25 is elevated, preventing false negatives.

## Fusion strategies: Score normalization vs rank fusion

Once individual lanes produce candidate results, how should their scores be combined? Two strategies exist:

> [!WARNING]
> **The hazard of score normalization**
> Dense vector cosine similarity produces scores in $[0, 1]$, while BM25 produces unbounded scores in $[0, \infty)$ depending on document length and term rarity. Combining raw or min-max scaled scores is brittle: one outlier score in BM25 can completely override vector relevance.

Rank-based fusion, specifically [Reciprocal Rank Fusion (RRF)](learn/reciprocal-rank-fusion-explained/), solves this by ignoring raw scores entirely and evaluating the position of a document across lists: $RRF(d) = \sum rac{1}{k + r(d)}$. It requires no calibration and is mathematically stable.

## The importance of pre-fusion scoping

A critical design requirement in hybrid retrieval for agents is where authorization occurs:

- [ ] Pre-filtering (Correct): Apply tenant, workspace, agent, and temporal filters before vector scanning or BM25 querying.
- [ ] Post-filtering (Flawed): Retrieve top-k candidates globally and drop unauthorized results afterwards, leading to empty or truncated result sets.
- [ ] Scope Preservation: Ensure fused results inherit the security bounds of the constituent lanes.

## MESA''s four-lane retrieval engine

In [MESA Core](mesa/), the V4 retrieval router implements four distinct lanes: `vector` (via LanceDB), `bm25` (via SQLite FTS5), `assertion` (via canonical SQLite tables), and `graph` (via Kùzu).

MESA applies dataset, tenant, agent, temporal, and jurisdiction constraints *before* lane execution. The public test fixture `Alice knows Aurora` verifies that when an assertion ranks #1 across all four lanes, its reciprocal rank fusion score computes deterministically to $4/61$. Read the execution details in [How MESA Works](how-it-works/).

## Further reading

1. [Cormack et al. (2009) — Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods](https://dl.acm.org/doi/10.1145/1571941.1572114)
2. [MESA Independent Retrieval Audit and Test Suite](https://github.com/Yasou13/MESA/blob/main/tests/test_v4_independent_retrieval_audit.py)
3. [What Is Reciprocal Rank Fusion? — MESA Learn](learn/reciprocal-rank-fusion-explained/)

', ARRAY['hybrid-retrieval', 'vector-search', 'bm25', 'search', 'retrieval']::text[], 'MESA contributors', 9, 'published', 'Hybrid Retrieval Explained: Vectors, BM25, and Structure — MESA Learn', 'Understand how hybrid retrieval fuses dense vector search, sparse BM25 lexical signals, and structured constraints using Reciprocal Rank Fusion.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('hybrid-retrieval-explained', 'learn', 'tr', 'Hybrid retrieval açıklaması: Vektör arama, lexical arama ve yapılandırılmış sinyaller', 'Çok hatlı geri getirme sistemlerinin sağlam erişim için tamamlayıcı arama kiplerini nasıl birleştirdiği', 'Hybrid retrieval; dense vektör embedding''leri, sparse lexical ters indeksleri (BM25) ve yapılandırılmış veritabanı filtrelerini birleştirerek tek stratejili arama hatalarını önler.', 'Dense vektörler anlamı yakalar, lexical arama kesin terimleri yakalar ve yapılandırılmış sorgular katı kısıtları uygular; bunları birleştirmek dayanıklı bir retrieval hattı oluşturur.', '## Tek kipli geri getirme neden başarısız olur?

Her bağımsız geri getirme paradigmasının iyi belgelenmiş bir hata modu vardır. Yalnızca tek bir mekanizmaya güvenmek, otonom bir ajanı sistematik kör noktalara açık bırakır:

| Retrieval Kipi | Birincil İndeks | Belirgin Güçlü Yön | Temel Hata Modu |
| --- | --- | --- | --- |
| Dense Vektör Arama | HNSW / IVF embedding''leri | Anlamsal eş anlamlılık ve kavramsal eşleşme | Nadir token''larda, sayılarda ve kesin kodlarda yanılır |
| Sparse Lexical Arama | BM25 / Ters indeks | Kesin anahtar kelime ve nadir tanımlayıcı eşleşmesi | Eş anlamlılık ve sözcük uyumsuzluğunda sonuç bulamaz |
| Yapılandırılmış Assertion Arama | B-tree / İlişkisel SQL | Deterministik mantıksal ve sayısal filtreler | Şemaya uymayan serbest dilli sorgularda sonuç vermez |
| Graph Yol Gezinimi | Adjacency indeksi / Graph DB | Varlıklar arasındaki çok sekmeli ilişkisel yollar | Açık kenar çıkarımı yapılmamış izole olgularda yetersiz kalır |

## Çok hatlı arama pratikte nasıl çalışır?

Hybrid retrieval mimarisinde bir kullanıcı sorgusu, aynı veri tabanı üzerinde eşzamanlı olarak birden fazla hatta iletilir:

<!-- diagram: Sorgunun Vektör, BM25, Assertion ve Graph hatlarına dağıtılıp Reciprocal Rank Fusion ile birleştirilmesini gösteren şema -->
1. Sorgu Kabulü ve Kapsam Doğrulaması
2. Paralel Dağıtım: Vektör + BM25 + Assertion + Graph
3. Hat Puanlaması ve Aday Üretimi
4. Reciprocal Rank Fusion (RRF) Birleşimi
5. Birleştirilmiş ve Sıralanmış Sonuçlar

*Çok hatlı geri getirme, nihai aday listesini sentezlemeden önce birden fazla tamamlayıcı bakış açısını değerlendirir.*

Adayları birden fazla hat üzerinden değerlendirerek, vektör aramasında orta sırada kalan ancak BM25''te tam bir karar numarasını yakalayan bir belge öne çıkarılır ve hatalı dışlamalar önlenir.

## Birleştirme stratejileri: Skor normalizasyonu ile rank fusion

Ayrı hatlar aday sonuçlar ürettiğinde, bu skorlar nasıl birleştirilmelidir? İki temel strateji vardır:

> [!WARNING]
> **Skor normalizasyonu tehlikesi**
> Dense vektör kosinüs benzerliği $[0, 1]$ aralığında skorlar üretirken, BM25 belge uzunluğuna ve terim nadirliğine bağlı olarak $[0, \infty)$ aralığında sınırsız skorlar üretir. Bu skorları doğrudan veya min-max ölçeklemesiyle birleştirmek kırılgandır: BM25''teki tek bir uç değer vektör uygunluğunu tamamen bastırabilir.

Sıralama tabanlı birleştirme, özellikle [Reciprocal Rank Fusion (RRF)](learn/reciprocal-rank-fusion-explained/), ham skorları tamamen göz ardı edip belgenin listelerdeki sırasını değerlendirerek bu sorunu çözer: $RRF(d) = \sum rac{1}{k + r(d)}$. Kalibrasyon gerektirmez ve matematiksel olarak kararlıdır.

## Birleşim öncesi kapsam denetiminin önemi

Ajanlar için hybrid retrieval tasarımında kritik bir gereksinim yetkilendirmenin nerede yapıldığıdır:

- [ ] Ön Filtreleme (Doğru): Tenant, workspace, ajan ve zamansal filtreleri vektör taramasından veya BM25 sorgusundan önce uygulayın.
- [ ] Sonradan Filtreleme (Hatalı): Adayları genel indeksten çekip yetkisizleri sonradan ayıklamak, sonuç listesinin boş kalmasına veya kesilmesine yol açar.
- [ ] Kapsam Korunumu: Birleştirilmiş sonuçların ilgili hatların güvenlik sınırlarını miras aldığından emin olun.

## MESA''nın dört hatlı retrieval motoru

[MESA Core](mesa/) içinde V4 retrieval router''ı dört belirgin hat yürütür: `vector` (LanceDB ile), `bm25` (SQLite FTS5 ile), `assertion` (kanonik SQLite tabloları ile) ve `graph` (Kùzu ile).

MESA; dataset, tenant, ajan, zaman ve yargı yetkisi kısıtlarını hatların çalıştırılmasından *önce* uygular. Kamuya açık test fixture''ı `Alice knows Aurora`, bir assertion dört hatta da 1. sırada yer aldığında RRF skorunun deterministik olarak $4/61$ hesaplandığını doğrular. Uygulama ayrıntılarını [MESA Nasıl Çalışır](how-it-works/) sayfasında bulabilirsiniz.

## Kaynaklar

1. [Cormack vd. (2009) — Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods](https://dl.acm.org/doi/10.1145/1571941.1572114)
2. [MESA Bağımsız Retrieval Denetimi ve Test Paketi](https://github.com/Yasou13/MESA/blob/main/tests/test_v4_independent_retrieval_audit.py)
3. [Reciprocal Rank Fusion Nedir? — MESA Learn](learn/reciprocal-rank-fusion-explained/)

', ARRAY['hybrid-retrieval', 'vector-search', 'bm25', 'search', 'retrieval']::text[], 'MESA contributors', 9, 'published', 'Hybrid Retrieval Açıklaması: Vektör, BM25 ve Yapı — MESA Learn', 'Hybrid retrieval''ın dense vektör arama, sparse BM25 sözcük sinyalleri ve yapılandırılmış kısıtları Reciprocal Rank Fusion ile nasıl birleştirdiğini anlayın.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('why-graphs-matter-in-ai-memory', 'learn', 'en', 'Why graphs matter in AI memory', 'Navigating entities, multi-hop traversals, and relational context in agent knowledge', 'Knowledge graphs represent entities and their explicit relationships, allowing AI agents to navigate multi-hop connections and topological context that flat chunk search cannot resolve.', 'Graphs connect facts through explicit typed edges, allowing agents to answer complex relational questions by traversing paths rather than guessing through text similarity.', '## From isolated facts to connected networks

Unstructured memory stores facts as disconnected textual fragments: ''Alice is a partner at LawFirm X'', ''LawFirm X represents Corporation Y'', ''Corporation Y acquired Subsidiary Z''. An agent relying solely on flat vector search treats each sentence as an isolated point in space.

![Archival topological plate illustrating interconnected graph nodes, 2-hop traversals, and scope boundaries](assets/topological-network-plate.svg)
*Topological graph traversal follows typed relationship paths across entities, resolving context across multiple hops.*

A knowledge graph connects these facts into an explicit, traversable topology: `(Alice)-[:PARTNER_AT]->(LawFirm X)-[:REPRESENTS]->(Corporation Y)-[:ACQUIRED]->(Subsidiary Z)`. The relationships themselves become first-class, queryable data entities.

## How multi-hop traversal works

Consider an agent asked to answer: ''Does Alice have a potential conflict of interest regarding Subsidiary Z?''

- Vector Search failure: No single text chunk contains both ''Alice'' and ''Subsidiary Z''. Vector similarity between the query and isolated chunks is low.
- Graph Traversal success: The agent queries the entity node for ''Alice'', expands outward through outward relationship edges, and discovers the multi-hop path connecting her to Subsidiary Z in 3 deterministic hops.

**Multi-Hop Traversal**
: The sequential navigation across connected graph edges $(E_1 ightarrow E_2 ightarrow \dots ightarrow E_k)$ to infer indirect relationships that are never explicitly stated in a single text passage.

## When graphs help — and when they add needless complexity

Graphs are not universally required for all AI applications. Applying graph infrastructure to simple problems introduces substantial engineering overhead:

| Dimension | Flat Vector / Lexical Memory | Graph-Enhanced Memory |
| --- | --- | --- |
| Ingestion Cost | Low: embed text chunks directly | High: LLM extraction of entities, types, and relations |
| Extraction Reliability | Deterministic chunking | Probabilistic: LLM may hallucinate non-existent edges |
| Relational Multi-Hop | Very weak: cannot follow chains of reasoning | Very strong: path queries (Cypher, SPARQL) are exact |
| Query Latency | Sub-millisecond vector indexing | Variable: depends on graph diameter and fan-out |
| Ideal Use Cases | Document search, FAQs, semantic search | Corporate structures, legal conflicts, dependency graphs |

## The extraction and synchronization challenge

In production, relying on an independent graph database as the primary source of truth introduces synchronization headaches. If an entity is updated or deleted in memory, graph nodes and edges must be updated atomically to prevent orphan references and phantom knowledge.

> [!WARNING]
> **Do not treat graph databases as the primary source of truth**
> Extracting graph relationships with language models is inherently noisy. If the graph database is the only record, fixing errors requires complex graph surgery. Robust architectures maintain a canonical relational store and derive graph projections downstream.

## How MESA implements graph memory

In [MESA Core](mesa/), the graph is not an external, opaque database. Canonical memory is recorded as structured assertions in SQLite. MESA then projects relational triples into [Kùzu](mesa/), an embedded, high-performance graph database optimized for analytical graph queries.

This projection design ensures transactional durability: if the graph projection becomes desynchronized, it can be regenerated deterministically from the canonical SQLite store. Learn more about MESA''s data projections in [MESA Core](mesa/).

## References

1. [Hogan et al. (2021) — Knowledge Graphs (ACM Computing Surveys)](https://dl.acm.org/doi/10.1145/3447772)
2. [Angles & Gutierrez (2008) — Survey of Graph Database Models](https://dl.acm.org/doi/10.1145/1322432.1322433)
3. [MESA Core Storage Projections Specification](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)

', ARRAY['knowledge-graph', 'relations', 'ai-memory', 'graph-theory']::text[], 'MESA contributors', 8, 'published', 'Why Graphs Matter in AI Memory — MESA Learn', 'Explore knowledge graphs in agent memory: entities, typed relations, multi-hop traversals, and trade-offs between graph depth and ingestion complexity.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('why-graphs-matter-in-ai-memory', 'learn', 'tr', 'AI memory sistemlerinde grafikler (graph) neden önemlidir?', 'Ajan bilgisinde varlıklar, çok sekmeli gezinimler ve ilişkisel bağlam', 'Bilgi grafikleri varlıkları ve açık ilişkilerini temsil eder; yapay zekâ ajanlarının düz metin aramasının çözemediği çok sekmeli bağlantıları ve topolojik bağlamı gezmesini sağlar.', 'Grafikler olguları açık tipli kenarlarla birbirine bağlar; ajanların anlamsal benzerlikle tahmin yürütmek yerine ilişkisel yolları gezerek karmaşık soruları yanıtlamasına imkân tanır.', '## Yalıtılmış olgulardan bağlantılı ağlara

Yapılandırılmamış hafıza olguları birbirinden kopuk metin parçaları olarak saklar: ''Ahmet X Hukuk Bürosunda ortaktır'', ''X Hukuk Bürosu Y Şirketini temsil eder'', ''Y Şirketi Z İştirakini satın almıştır''. Yalnızca düz vektör aramasına dayanan bir ajan, her cümleyi uzayda izole bir nokta olarak görür.

![Birbirine bağlı graph düğümlerini, 2 sekmeli gezinimleri ve kapsam sınırlarını gösteren tarihi gravür plakası](assets/topological-network-plate.svg)
*Topolojik graph gezinimi, varlıklar arasındaki tipli ilişki yollarını takip ederek bağlamı birden fazla sekmede çözümler.*

Bir bilgi grafiği bu olguları açık ve gezilebilir bir topolojiye bağlar: `(Ahmet)-[:ORTAK]->(X Bürosu)-[:TEMSİL_EDER]->(Y Şirketi)-[:SATIN_ALDI]->(Z İştiraki)`. İlişkilerin kendisi birinci sınıf, sorgulanabilir veri varlıkları haline gelir.

## Çok sekmeli gezinim (multi-hop traversal) nasıl çalışır?

Bir ajanın ''Ahmet''in Z İştiraki ile potansiyel bir çıkar çatışması var mı?'' sorusunu yanıtlaması gerektiğini düşünün:

- Vektör Arama başarısızlığı: Hiçbir tek metin parçası hem ''Ahmet'' hem de ''Z İştiraki'' ifadelerini birlikte içermez. Sorgu ile izole metin parçaları arasındaki benzerlik düşüktür.
- Graph Gezinimi başarısı: Ajan ''Ahmet'' varlık düğümünü sorgular, dışa doğru ilişki kenarlarını takip eder ve onu Z İştirakine bağlayan çok sekmeli yolu 3 deterministik adımda keşfeder.

**Çok Sekmeli Gezinim (Multi-Hop Traversal)**
: Tek bir metin parçasında açıkça belirtilmeyen dolaylı ilişkileri çıkarmak için bağlantılı kenarlar $(E_1 ightarrow E_2 ightarrow \dots ightarrow E_k)$ boyunca sırayla ilerleme süreci.

## Grafikler ne zaman yardımcı olur — ne zaman gereksiz karmaşıklık getirir?

Grafikler tüm yapay zekâ uygulamaları için zorunlu değildir. Basit problemlere graph altyapısı eklemek ciddi bir mühendislik yükü yaratır:

| Boyut | Düz Vektör / Lexical Hafıza | Graph Destekli Hafıza |
| --- | --- | --- |
| Kabul / Yazma Maliyeti | Düşük: metin parçalarını doğrudan vektörleştir | Yüksek: LLM ile varlık, tip ve ilişki çıkarımı gerektirir |
| Çıkarım Güvenilirliği | Deterministik metin bölme | Olasılıksal: LLM var olmayan ilişkiler halüsinasyon edebilir |
| İlişkisel Çok Sekmeli Muhakeme | Çok zayıf: akıl yürütme zincirlerini izleyemez | Çok güçlü: yol sorguları (Cypher, SPARQL) kesindir |
| Sorgu Gecikmesi | Milisaniyenin altında vektör taraması | Değişken: graph çapına ve bağlantı yoğunluğuna bağlıdır |
| İdeal Kullanım Alanları | Belge arama, SSS, anlamsal keşif | Şirket yapıları, hukuki çatışmalar, bağımlılık ağları |

## Çıkarım ve senkronizasyon zorluğu

Üretim ortamlarında bağımsız bir graph veritabanını tek bilgi kaynağı (source of truth) yapmak senkronizasyon krizlerine yol açar. Bir varlık güncellendiğinde veya silindiğinde, graph düğümlerinin yetim kalmaması için atomik olarak güncellenmesi gerekir.

> [!WARNING]
> **Graph veritabanlarını birincil veri kaynağı yapmayın**
> Büyük dil modelleriyle graph ilişkileri çıkarmak doğası gereği gürültülüdür. Graph veritabanı tek kayıt yeri olursa, hataları düzeltmek zorlu ameliyatlar gerektirir. Sağlam mimariler kanonik bir ilişkisel depo tutar ve graph projeksiyonlarını aşağı akışta türetir.

## MESA graph hafızasını nasıl uygular?

[MESA Core](mesa/) içinde graph, dışarıdan bağımlı kapalı bir veritabanı değildir. Kanonik hafıza, SQLite içinde yapılandırılmış assertion''lar olarak kaydedilir. MESA ardından ilişkisel üçlüleri analitik graph sorguları için optimize edilmiş süreç içi [Kùzu](mesa/) veritabanına projekte eder.

Bu projeksiyon yaklaşımı işlemsel dayanıklılık sağlar: graph projeksiyonu bozulursa veya senkronizasyonunu kaybederse, kanonik SQLite deposundan deterministik olarak yeniden üretilebilir. Veri projeksiyonlarını [MESA Core](mesa/) sayfasında inceleyin.

## Kaynaklar

1. [Hogan vd. (2021) — Knowledge Graphs (ACM Computing Surveys)](https://dl.acm.org/doi/10.1145/3447772)
2. [Angles & Gutierrez (2008) — Survey of Graph Database Models](https://dl.acm.org/doi/10.1145/1322432.1322433)
3. [MESA Core Depolama Projeksiyonları Spesifikasyonu](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)

', ARRAY['knowledge-graph', 'relations', 'ai-memory', 'graph-theory']::text[], 'MESA contributors', 8, 'published', 'AI Memory Sistemlerinde Grafikler (Graph) Neden Önemlidir? — MESA Learn', 'Ajan hafızasında bilgi grafiklerini keşfedin: varlıklar, tipli ilişkiler, çok sekmeli gezinimler ve grafik derinliği ile yazma karmaşıklığı arasındaki ödünleşimler.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('reciprocal-rank-fusion-explained', 'learn', 'en', 'What is Reciprocal Rank Fusion (RRF)?', 'A mathematical explanation of rank-based combination in multi-lane retrieval', 'Reciprocal Rank Fusion (RRF) combines ranked lists from multiple search algorithms into a single unified result set without requiring fragile score normalization.', 'RRF calculates a document''s score as the sum of reciprocals of its ranks across different retrieval lanes: RRF(d) = sum(1 / (k + r(d))). Documents that appear consistently near the top in multiple lanes receive the highest combined score.', '## Why score normalization is hard

When building hybrid search, combining scores from different algorithms is surprisingly treacherous. Dense vector models output cosine similarities tightly bounded between 0.0 and 1.0. BM25 lexical search outputs unbounded positive scores (often ranging from 2.0 to 35.0+) that vary wildly based on term rarity and document length.

Min-max normalization or z-score standardization attempts to bridge this gap, but both are fragile. An extreme outlier in lexical search skews the entire distribution, causing one modality to arbitrarily dominate or erase the other.

**Score Calibration Drift**
: The distortion that occurs when attempting to mathematically combine raw scores from different statistical distributions without invariant reference points.

## The RRF formula explained

In 2009, Cormack, Clarke, and Buettcher introduced Reciprocal Rank Fusion (RRF). Instead of looking at raw scores, RRF evaluates solely the ordinal rank of each document across each retrieval list:

```text
RRF_score(d) = Σ [ 1 / (k + r_m(d)) ]  for each modality m
```

- d: The candidate document or memory assertion being evaluated.
- m: A specific retrieval modality (e.g. vector, BM25, graph).
- r_m(d): The rank position of document d in modality m (1 for 1st place, 2 for 2nd place, etc.).
- k: A smoothing constant, conventionally set to 60. It ensures that the difference between rank 1 and rank 2 does not excessively overshadow consistent appearances across multiple lists.

## A step-by-step numerical example

Let us compare three documents retrieved across two search lanes (Vector and BM25) using standard k = 60:

| Document | Vector Rank | BM25 Rank | Calculation (k=60) | Final RRF Score |
| --- | --- | --- | --- | --- |
| Document A | Rank 1 | Rank 10 | 1/(60+1) + 1/(60+10) = 0.01639 + 0.01429 | 0.03068 |
| Document B | Rank 2 | Rank 2 | 1/(60+2) + 1/(60+2) = 0.01613 + 0.01613 | 0.03226 (Winner) |
| Document C | Rank 25 | Rank 1 | 1/(60+25) + 1/(60+1) = 0.01176 + 0.01639 | 0.02815 |

> [!NOTE]
> **Why Document B wins**
> Document B was not the #1 result in either lane, but because it ranked consistently high (#2 in both), its reciprocal sum surpassed Document A (which was #1 in vector but slipped to #10 in BM25). RRF rewards multi-lane consensus.

## Why RRF is ideal for AI agent memory

- [ ] Zero tuning required: Unlike weighted linear combination, RRF with k=60 performs near-optimally across widely different domains without parameter tuning.
- [ ] Modality agnostic: Can fuse 2, 3, 4, or more lanes (vector, keyword, graph, temporal decay) without modification.
- [ ] Missing lane resilience: If an assertion is not retrieved by one lane, it simply contributes 0 from that lane without penalizing its positive ranks in others.

## True RRF in the MESA architecture

In [MESA Core](mesa/), the V4 router computes true reciprocal rank fusion across up to four result origins: `vector`, `bm25`, `assertion`, and `graph`.

In the verified retrieval fixture `Alice knows Aurora`, the target memory assertion achieves rank 1 across all four lanes simultaneously. The resulting score is exactly:

```text
RRF_score = 1/(60+1) + 1/(60+1) + 1/(60+1) + 1/(60+1) = 4 / 61 ≈ 0.06557
```

You can inspect this exact deterministic calculation in [How MESA Works](how-it-works/) and verify it in the public repository test suite.

## References

1. [Cormack, Clarke, and Buettcher (2009) — Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods (SIGIR ''09)](https://dl.acm.org/doi/10.1145/1571941.1572114)
2. [MESA Retrieval Fixture Test: test_real_four_lanes_fuse_once_and_repeat_deterministically](https://github.com/Yasou13/MESA/blob/main/tests/test_v4_independent_retrieval_audit.py)

', ARRAY['rrf', 'rank-fusion', 'retrieval', 'algorithms']::text[], 'MESA contributors', 7, 'published', 'What Is Reciprocal Rank Fusion (RRF)? — MESA Learn', 'Understand the mathematics, step-by-step numerical example, and multi-lane retrieval advantages of Reciprocal Rank Fusion (RRF).', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('reciprocal-rank-fusion-explained', 'learn', 'tr', 'Reciprocal Rank Fusion (RRF) nedir?', 'Çok hatlı arama birleştirmesinde sıralama tabanlı yöntemin matematiksel açıklaması', 'Reciprocal Rank Fusion (RRF); birden fazla arama algoritmasının sıralı listelerini, hassas skor normalizasyonuna ihtiyaç duymadan tek ve tutarlı bir sonuç kümesinde birleştirir.', 'RRF bir belgenin puanını, farklı hatlardaki sıralama derecelerinin terslerinin toplamı olarak hesaplar: RRF(d) = sum(1 / (k + r(d))). Birden fazla hatta istikrarlı şekilde üst sıralarda yer alan belgeler en yüksek toplam skoru alır.', '## Skor normalizasyonu neden zordur?

Hybrid arama geliştirirken farklı algoritmaların skorlarını birleştirmek şaşırtıcı derecede zordur. Dense vektör modelleri 0.0 ile 1.0 arasında sıkışmış kosinüs benzerliği üretir. BM25 lexical arama ise terim nadirliğine ve belge uzunluğuna bağlı olarak 2.0''dan 35.0+''e kadar sınırsız pozitif skorlar verir.

Min-max normalizasyonu veya z-score standardizasyonu bu uçurumu kapatmaya çalışır ancak ikisi de kırılgandır. Lexical aramada tek bir uç değer tüm dağılımı saptırabilir ve bir arama kipinin diğerini yapay biçimde ezmesine yol açabilir.

**Skor Kalibrasyon Kayması**
: Farklı istatistiksel dağılımlardan gelen ham skorları ortak bir referans noktası olmadan birleştirmeye çalışırken ortaya çıkan matematiksel bozulma.

## RRF formülünün açıklaması

2009 yılında Cormack, Clarke ve Buettcher Reciprocal Rank Fusion (RRF) yöntemini geliştirdi. RRF ham skorlar yerine yalnızca her belgenin ilgili arama listesindeki sıra numarasını (rank) değerlendirir:

```text
RRF_skoru(d) = Σ [ 1 / (k + r_m(d)) ]  (her m kipi için)
```

- d: Değerlendirilen aday belge veya hafıza assertion''ı.
- m: Belirli bir arama kipi (örneğin vektör, BM25, graph).
- r_m(d): d belgesinin m kipindeki sıra numarası (1. sıra için 1, 2. sıra için 2 vb.).
- k: Yumuşatma sabiti, geleneksel olarak 60 alınır. 1. sıra ile 2. sıra arasındaki farkın, birden fazla listede istikrarlı görünmenin önüne geçmesini engeller.

## Adım adım sayısal bir örnek

İki arama hattında (Vektör ve BM25) k = 60 sabitiyle geri getirilen üç belgeyi karşılaştıralım:

| Belge | Vektör Sırası | BM25 Sırası | Hesaplama (k=60) | Nihai RRF Skoru |
| --- | --- | --- | --- | --- |
| Belge A | 1. Sıra | 10. Sıra | 1/(60+1) + 1/(60+10) = 0.01639 + 0.01429 | 0.03068 |
| Belge B | 2. Sıra | 2. Sıra | 1/(60+2) + 1/(60+2) = 0.01613 + 0.01613 | 0.03226 (Kazanan) |
| Belge C | 25. Sıra | 1. Sıra | 1/(60+25) + 1/(60+1) = 0.01176 + 0.01639 | 0.02815 |

> [!NOTE]
> **Belge B neden kazandı?**
> Belge B hiçbir hatta birinci olamadı; ancak iki hatta da istikrarlı biçimde üst sırada (2. sıra) yer aldığı için toplam puanı, vektörde 1. olup BM25''te 10. sıraya düşen Belge A''yı geçti. RRF çok hatlı uzlaşmayı ödüllendirir.

## RRF neden yapay zekâ hafızası için idealdir?

- [ ] Ayar (tuning) gerektirmez: Ağırlıklı doğrusal birleştirmelerin aksine, k=60 ile RRF farklı alanlarda parametre ayarı gerektirmeden en iyi performansı gösterir.
- [ ] Kip bağımsızdır: Değişiklik gerekmeden 2, 3, 4 veya daha fazla hattı (vektör, anahtar kelime, graph, zaman sönümlenmesi) birleştirebilir.
- [ ] Eksik hat toleransı: Bir assertion bir hattan sonuç alamazsa, o hattan 0 katkı alır; diğer hatlardaki olumlu derecesi cezalandırılmaz.

## MESA mimarisinde gerçek RRF

[MESA Core](mesa/) içinde V4 router''ı, dört farklı sonuç kaynağı arasında gerçek RRF hesaplar: `vector`, `bm25`, `assertion` ve `graph`.

Doğrulanmış test fixture''ı `Alice knows Aurora` senaryosunda, hedef hafıza assertion''ı dört hatta da aynı anda 1. sırayı alır. Ortaya çıkan skor tam olarak şöyledir:

```text
RRF_skoru = 1/(60+1) + 1/(60+1) + 1/(60+1) + 1/(60+1) = 4 / 61 ≈ 0.06557
```

Bu deterministik hesaplamayı [MESA Nasıl Çalışır](how-it-works/) sayfasında görebilir ve açık kaynak test paketinde doğrulayabilirsiniz.

## Kaynaklar

1. [Cormack, Clarke ve Buettcher (2009) — Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods (SIGIR ''09)](https://dl.acm.org/doi/10.1145/1571941.1572114)
2. [MESA Retrieval Fixture Testi: test_real_four_lanes_fuse_once_and_repeat_deterministically](https://github.com/Yasou13/MESA/blob/main/tests/test_v4_independent_retrieval_audit.py)

', ARRAY['rrf', 'rank-fusion', 'retrieval', 'algorithms']::text[], 'MESA contributors', 7, 'published', 'Reciprocal Rank Fusion (RRF) Nedir? — MESA Learn', 'Reciprocal Rank Fusion (RRF) algoritmasının matematiğini, adım adım sayısal örneğini ve çok hatlı aramadaki avantajlarını anlayın.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('what-is-evidence-aware-memory', 'learn', 'en', 'What is evidence-aware memory?', 'The conceptual foundation of attaching source identity, exact spans, and scope to agent knowledge', 'Evidence-aware memory is an architectural paradigm where an AI system cannot store or recall an assertion without binding it to verifiable source identity, evidence spans, and authorization scopes.', 'Traditional agent memory records what happened; evidence-aware memory records what happened, who said it, which source document proves it, what exact character span supports it, and what scope permits reading it.', '## The grounding crisis in autonomous agent memory

Most conversational and agent frameworks treat memory as an unverified string store. An LLM observes a conversation, extracts a summary such as ''Customer has approved the revised contract terms'', and persists that sentence in a database.

> [!WARNING]
> **The untraceable claim dilemma**
> Two weeks later, the agent takes irreversible actions based on that memory. When audited, neither human reviewers nor the system can determine whether that assertion was an authorized statement, a misinterpreted draft, an out-of-date assumption, or a model hallucination. The memory exists, but its grounding does not.

![Archival plate illustrating source documents with highlighted evidence spans connecting through derivation pipelines into tamper-evident canonical assertions](assets/provenance-lineage-plate.svg)
*Evidence-aware memory: A claim derives legitimacy strictly from its lineage, source identity, and exact textual evidence span.*

**Evidence-Aware Memory**
: A memory architecture in which knowledge claims cannot exist as detached propositions; every admitted record is cryptographically or structurally bound to its origin source, exact supporting span, and scope boundaries.

## The five structural elements of evidence-aware memory

To be truly evidence-aware, every recalled memory must resolve five distinct questions:

- [ ] 1. Statement (Proposition): The factual claim or relation (e.g. `(Matter 402, status, FILED)`).
- [ ] 2. Source Identity: The immutable identifier, cryptographic hash, or official URI of the originating document or transaction.
- [ ] 3. Evidence Span: The precise character offset or byte span `[c_start..c_end]` within the source document that contains the supporting text.
- [ ] 4. Scope Bounds: The security perimeter defining which tenant, workspace, agent, and temporal window may access this assertion.
- [ ] 5. Lifecycle State: The auditable status of the record (`COMMITTED`, `PENDING_REVIEW`, `SUPERSEDED`, or `RETRACTED`).

## Casual memory vs evidence-aware memory

The difference between casual string memory and evidence-aware memory is evident in how data is structured for execution:

```text
// Casual string memory (untraceable)
{
  "memory": "Client requested arbitration in Zurich under ICC rules."
}

// Evidence-aware memory assertion (MESA paradigm)
{
  "assertion_id": "asrt_88b14a2",
  "statement": {
    "subject": "Contract_2024_09",
    "predicate": "arbitration_clause",
    "object": "ICC_Zurich"
  },
  "source": {
    "source_id": "doc_contract_v2.pdf",
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "evidence_span": [4120, 4285],
    "quoted_text": "All disputes arising out of the present contract shall be finally settled under the Rules of Arbitration of the International Chamber of Commerce by one or more arbitrators in Zurich."
  },
  "scope": {
    "tenant_id": "tenant_legal_corp",
    "workspace_id": "matter_402",
    "valid_from": "2024-09-01T00:00:00Z"
  },
  "status": "COMMITTED"
}
```

## Why evidence awareness is mandatory in high-stakes domains

In legal, medical, regulatory, and financial operations, autonomous agents cannot ask users to ''trust'' an answer. Every assertion must be auditable:

| Domain | Failure Mode of Casual Memory | Evidence-Aware Safeguard |
| --- | --- | --- |
| Legal AI | Citing non-existent precedents or superseded statutory articles | Attaches official gazette edition, article number, and verification trace (see [MESA Law](law/)) |
| Medical Decisions | Relying on outdated patient dosage instructions | Enforces temporal scope and links claim to exact clinician note timestamp |
| Financial Audits | Conflating preliminary budget estimates with approved figures | Requires signed transaction hashes and authorization scope verification |
| Multi-Tenant SaaS | Leaking private company strategy across workspace boundaries | Applies strict pre-retrieval tenant filtering to prevent cross-contamination |

## General concept vs MESA''s implementation

The general concept of evidence-aware memory can be implemented across various software stacks. What matters is the architectural commitment to grounding claims in verifiable sources before recall.

In [MESA Core](mesa/), this commitment is enforced at the database level: SQLite acts as the canonical store for assertions, evidence spans, and scopes. Search projections ([LanceDB](mesa/) for vectors, [Kùzu](mesa/) for graphs) derive their entries strictly from these canonical assertions. Learn how evidence flows through the system in [How MESA Works](how-it-works/).

## References

1. [W3C PROV-DM: The PROV Data Model (W3C Recommendation 2013)](https://www.w3.org/TR/prov-dm/)
2. [MESA Core Architecture Specification](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)
3. [What Is Provenance in AI Systems? — MESA Learn](learn/what-is-provenance-in-ai/)

', ARRAY['evidence', 'provenance', 'ai-memory', 'auditability']::text[], 'MESA contributors', 8, 'published', 'What Is Evidence-Aware Memory? — MESA Learn', 'Understand evidence-aware memory: attaching source identity, exact evidence character spans, and authorization scopes to every agent assertion.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('what-is-evidence-aware-memory', 'learn', 'tr', 'Kanıt odaklı hafıza (evidence-aware memory) nedir?', 'Ajan bilgisine kaynak kimliğini, kesin kanıt aralıklarını ve yetki kapsamını bağlamanın kavramsal temeli', 'Kanıt odaklı hafıza; bir yapay zekâ sisteminin herhangi bir iddiayı doğrulanabilir kaynak kimliği, kanıt aralıkları ve yetkilendirme kapsamı olmaksızın saklayamayacağı veya geri çağıramayacağı bir mimari paradigmadır.', 'Geleneksel ajan hafızası ne olduğunu kaydeder; kanıt odaklı hafıza ise ne olduğunu, kimin söylediğini, hangi kaynak belgenin kanıtladığını, hangi karakter aralığının desteklediğini ve hangi kapsamın okumaya izin verdiğini kaydeder.', '## Otonom ajan hafızasında temellendirme krizi

Çoğu konuşma ve ajan kütüphanesi hafızayı doğrulanmamış bir metin deposu olarak ele alır. LLM konuşmayı gözlemler, ''Müvekkil revize sözleşme şartlarını onayladı'' gibi bir özet çıkarır ve bu cümleyi veritabanına kaydeder.

> [!WARNING]
> **İzlenemeyen iddia açmazı**
> İki hafta sonra ajan bu hafızaya dayanarak geri dönüşü olmayan işlemler yapar. Denetim yapıldığında ne insan inceleyiciler ne de sistem bu iddianın yetkili bir beyan mı, yanlış anlaşılmış bir taslak mı yoksa bir model halüsinasyonu mu olduğunu anlayabilir. Hafıza vardır ama kanıtı yoktur.

![Kaynak belgelerdeki kanıt aralıklarının türetim boru hatlarından geçerek kanonik assertion''lara bağlandığını gösteren tarihi gravür plakası](assets/provenance-lineage-plate.svg)
*Kanıt odaklı hafıza: Bir iddia meşruiyetini yalnızca kaynak kimliğinden, kesin metin aralığından ve türetim izinden alır.*

**Kanıt Odaklı Hafıza (Evidence-Aware Memory)**
: Bilgi iddialarının bağlamsız cümleler olarak var olamayacağı; kabul edilen her kaydın köken kaynağına, kesin kanıt aralığına ve yetki sınırlarına yapısal olarak bağlandığı hafıza mimarisi.

## Kanıt odaklı hafızanın beş temel unsuru

Gerçek anlamda kanıt odaklı olabilmesi için geri çağrılan her hafıza kaydı beş soruyu yanıtlamalıdır:

- [ ] 1. İddia (Proposition): Olgusal iddia veya bağıntı (örneğin `(Dosya 402, durum, AÇILDI)`).
- [ ] 2. Kaynak Kimliği (Source Identity): Belgenin veya işlemin değiştirilemez URI''si, kriptografik özeti (hash) veya resmî sicil kimliği.
- [ ] 3. Kanıt Aralığı (Evidence Span): Kaynak belge içinde destekleyici metni barındıran kesin karakter veya bayt aralığı `[c_başlangıç..c_bitiş]`.
- [ ] 4. Kapsam Sınırları (Scope Bounds): Bu iddiaya hangi tenant, workspace, ajan ve zaman penceresinin erişebileceğini tanımlayan güvenlik sınırı.
- [ ] 5. Yaşam Döngüsü Durumu (Lifecycle State): Kaydın denetlenebilir durumu (`COMMITTED`, `PENDING_REVIEW`, `SUPERSEDED` veya `RETRACTED`).

## Gelişigüzel hafıza ile kanıt odaklı hafıza karşılaştırması

Gelişigüzel metin hafızası ile kanıt odaklı hafıza arasındaki fark, verinin yürütüm için nasıl modellendiğinde açıkça görülür:

```text
// Gelişigüzel metin hafızası (kaynağı izlenemez)
{
  "memory": "Müvekkil uyuşmazlığın Zürih''te ICC kurallarına göre çözülmesini istedi."
}

// Kanıt odaklı hafıza assertion''ı (MESA paradigması)
{
  "assertion_id": "asrt_88b14a2",
  "statement": {
    "subject": "Sozlesme_2024_09",
    "predicate": "tahkim_sarti",
    "object": "ICC_Zurih"
  },
  "source": {
    "source_id": "sozlesme_v2.pdf",
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "evidence_span": [4120, 4285],
    "quoted_text": "İşbu sözleşmeden doğan tüm uyuşmazlıklar Milletlerarası Ticaret Odası Tahkim Kuralları uyarınca Zürih''te nihai olarak çözümlenecektir."
  },
  "scope": {
    "tenant_id": "tenant_hukuk",
    "workspace_id": "dosya_402",
    "valid_from": "2024-09-01T00:00:00Z"
  },
  "status": "COMMITTED"
}
```

## Kanıt odaklılık kritik alanlarda neden zorunludur?

Hukuk, tıp, regülasyon ve finans alanlarında otonom ajanlar kullanıcılardan ''kendilerine güvenmelerini'' isteyemez. Her iddia denetlenebilir olmalıdır:

| Alan | Gelişigüzel Hafızanın Hata Modu | Kanıt Odaklı Güvenlik Ağı |
| --- | --- | --- |
| Hukuk Yapay Zekâsı | Var olmayan emsal kararlar veya mülga kanun maddeleri atfetme | Resmî gazete sayısını, madde numarasını ve doğrulama izini bağlar (bkz. [MESA Law](law/)) |
| Tıbbi Kararlar | Eski hasta dozaj talimatlarına güvenme | Zamansal kapsamı zorunlu kılar ve iddiayı hekim notunun tam zaman damgasına bağlar |
| Finansal Denetim | Taslak bütçe tahminlerini onaylanmış rakamlarla karıştırma | İmzalı işlem özetleri ve yetkilendirme kapsam doğrulaması gerektirir |
| Çoklu Şirket (SaaS) | Şirket stratejisini workspace sınırlarının dışına sızdırma | Çapraz veri sızıntısını önlemek için geri getirme öncesi sıkı tenant filtrelemesi uygular |

## Genel kavram ile MESA''nın uygulaması

Kanıt odaklı hafıza genel bir kavram olarak farklı yazılım mimarilerinde uygulanabilir. Önemli olan, iddiaları geri çağırmadan önce doğrulanabilir kaynaklara bağlama ilkesidir.

[MESA Core](mesa/) içinde bu ilke veritabanı seviyesinde uygulanır: SQLite; assertion''ların, kanıt aralıklarının ve kapsamların kanonik deposudur. Arama projeksiyonları (vektörler için [LanceDB](mesa/), grafikler için [Kùzu](mesa/)) verilerini doğrudan bu kanonik kayıtlardan türetir. Kanıtın sistemde nasıl aktığını [MESA Nasıl Çalışır](how-it-works/) sayfasında görebilirsiniz.

## Kaynaklar

1. [W3C PROV-DM: The PROV Data Model (W3C Tavsiyesi 2013)](https://www.w3.org/TR/prov-dm/)
2. [MESA Core Mimari Spesifikasyonu](https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md)
3. [Yapay Zekâ Sistemlerinde Provenance Nedir? — MESA Learn](learn/what-is-provenance-in-ai/)

', ARRAY['evidence', 'provenance', 'ai-memory', 'auditability']::text[], 'MESA contributors', 8, 'published', 'Kanıt Odaklı Hafıza (Evidence-Aware Memory) Nedir? — MESA Learn', 'Kanıt odaklı hafızayı anlayın: her ajan iddiasına doğrulanabilir kaynak kimliğini, kesin kanıt aralıklarını ve yetki kapsamlarını bağlama.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('what-is-provenance-in-ai', 'learn', 'en', 'What is provenance in AI systems?', 'Distinguishing superficial citations from tamper-evident source records, spans, and transformation trails', 'Provenance is the complete, recorded history of information: its origin entity, ingestion transformations, supporting evidence spans, and authorization lifecycle.', 'A citation is a pointer; provenance is an auditable, tamper-evident lineage explaining where a fact originated, how it was processed, and why it is valid to use right now.', '## The crucial distinction: Citation vs provenance

In contemporary conversational AI, models frequently produce casual citations: footnotes like ''[1]'' pointing to a URL, or natural language remarks like ''According to recent court decisions...''. These are not provenance.

> [!WARNING]
> **Citation is not verification**
> A citation tells you where someone claims to have found an answer. It does not prove the document exists, that the cited text was not fabricated, that the version used was current, or that the quotation supports the conclusion.

Provenance, by contrast, is a formal computer science and information theory concept: it is an immutable, inspectable audit trail tracking data from its origin through every processing step to its current use.

## The conceptual foundation: Entities, activities, and agents

The international standard for data provenance (W3C PROV-DM) defines three foundational building blocks:

| PROV Element | Definition | AI Memory Example |
| --- | --- | --- |
| Entity | A physical, digital, or conceptual thing with distinct state | The official PDF release of Resmî Gazete issue #32450 |
| Activity | An action that creates, transforms, or uses entities | Document parsing, canonical JSONL extraction, chunk embedding |
| Agent | An actor bearing responsibility for an activity | The ingestion pipeline service, a verified human reviewer, an AI model |

<!-- diagram: W3C PROV diagram: Entity derived from Entity via Activity associated with Agent -->
1. Origin Document (Entity)
2. Extraction & Chunking (Activity)
3. Admitted Assertion (Derived Entity)
4. Review & Signature (Agent)

*The W3C PROV-DM model: Information derivation is modeled as explicit relationships between entities, activities, and agents.*

## What makes a complete AI provenance record?

An audit-ready provenance record in a reliable AI system includes seven mandatory attributes:

- [ ] 1. Origin Identity: Stable URI, official registration identifier, or content-addressable hash (SHA-256).
- [ ] 2. Exact Evidence Span: Character start and end offsets `[start..end]` anchoring the exact supporting passage.
- [ ] 3. Temporal Snapshot: Timestamp of when the source was published, retrieved, and parsed.
- [ ] 4. Pipeline Version: Exact Git commit hash or Docker image tag of the software that performed extraction.
- [ ] 5. Model Identifier: Pinned model ID and version (e.g. `text-embedding-3-small@v1`) if embeddings or LLMs were used.
- [ ] 6. Authorization Scope: Tenant and workspace bounds that define who is legally allowed to inspect or use this fact.
- [ ] 7. Invalidation Link: If superseded, a pointer to the newer authority that replaced this record.

## Why provenance protects against model drift and hallucinations

Provenance is not merely regulatory overhead; it is a powerful technical safeguard in autonomous systems:

- Automated Entailment Checking: A guardrail model can fetch the exact evidence span from the source and verify that the LLM''s generated response is mathematically entailed by the source passage.
- Cascade Invalidation: When a legal statute or API document is amended, the system uses provenance graphs to immediately invalidate all downstream memory assertions that depended on that source.
- Deterministic Debugging: When an agent produces an unexpected answer, developers can trace every input assertion back to the exact byte offset in the source document.

## Provenance in the MESA ecosystem

In MESA, provenance is treated as an architectural invariant across repositories:

- In [MESA Data](data/), raw official Turkish legal sources (PDF and HTML) are preserved as immutable byte bedrock, with character spans mapped into canonical JSONL.
- In [MESA Core](mesa/), every memory retrieval returns the source document hash and character span alongside the assertion.
- In [MESA Law](law/), lawyers can click any AI recommendation to highlight the exact authoritative passage in the official gazette.

## References and standards

1. [Moreau & Missier (2013) — W3C PROV-DM: The PROV Data Model](https://www.w3.org/TR/prov-dm/)
2. [Buneman et al. (2001) — Why and Where: A Characterization of Data Provenance (ICDT ''01)](https://link.springer.com/chapter/10.1007/3-540-44503-X_20)
3. [Provenance Definition — MESA Glossary](glossary/provenance/)

', ARRAY['provenance', 'auditability', 'evidence', 'trust']::text[], 'MESA contributors', 7, 'published', 'What Is Provenance in AI Systems? — MESA Learn', 'Learn what provenance means in AI systems: origin entity, transformation pipelines, exact evidence spans, and the distinction between citation and provenance.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('what-is-provenance-in-ai', 'learn', 'tr', 'Yapay zekâ sistemlerinde provenance nedir?', 'Yüzeysel atıflar ile değiştirilemez kaynak kayıtları, kanıt aralıkları ve dönüşüm izlerinin ayırt edilmesi', 'Provenance, bilginin eksiksiz ve kaydedilmiş geçmişidir: köken varlığı, ingestion dönüşümleri, destekleyici kanıt aralıkları ve yetkilendirme yaşam döngüsü.', 'Atıf bir işarettir; provenance ise bir olgunun nereden kaynaklandığını, nasıl işlendiğini ve şu anda kullanılmasının neden geçerli olduğunu açıklayan denetlenebilir bir köken çizgisidir.', '## Kritik ayrım: Atıf ile provenance arasındaki fark

Günümüz üretken yapay zekâ uygulamalarında modeller sık sık gelişigüzel atıflar üretir: bir URL''ye işaret eden ''[1]'' dipnotları veya ''Yargıtay kararlarına göre...'' gibi serbest dilli ifadeler. Bunlar provenance değildir.

> [!WARNING]
> **Atıf doğrulama değildir**
> Bir atıf yalnızca bir cevabın nerede bulunduğu iddiasını taşır. Belgenin gerçekten var olduğunu, alıntının uydurulmadığını, kullanılan sürümün güncel olduğunu veya alıntının varılan sonucu desteklediğini kanıtlamaz.

Buna karşılık provenance (kaynak izi), bilgisayar biliminde biçimsel bir kavramdır: veriyi kökeninden başlayarak her işleme adımından geçip mevcut kullanımına kadar takip eden değiştirilemez, incelenebilir bir denetim izidir.

## Kavramsal temel: Varlıklar, faaliyetler ve aktörler

Veri provenance''ı için uluslararası standart olan W3C PROV-DM, üç temel yapı taşı tanımlar:

| PROV Unsuru | Tanım | AI Hafıza Örneği |
| --- | --- | --- |
| Varlık (Entity) | Belirgin bir duruma sahip fiziksel, dijital veya kavramsal nesne | Resmî Gazete 32450 sayılı nüshasının orijinal PDF dosyası |
| Faaliyet (Activity) | Varlıkları oluşturan, dönüştüren veya kullanan eylem | Belge ayrıştırma, kanonik JSONL çıkarma, parça embedding''i |
| Aktör (Agent) | Bir faaliyetten sorumlu olan kişi, sistem veya model | Ingestion servisi, onaylayan hukukçu reviewer, yapay zekâ modeli |

<!-- diagram: W3C PROV şeması: Faaliyet aracılığıyla Varlıktan türetilen ve Aktör ile ilişkilendirilen Varlık -->
1. Kaynak Belge (Varlık)
2. Ayrıştırma ve Çıkarım (Faaliyet)
3. Kabul Edilen İddia (Türetilmiş Varlık)
4. İnceleme ve Onay (Aktör)

*W3C PROV-DM modeli: Bilgi türetimi, varlıklar, faaliyetler ve aktörler arasındaki açık ilişkiler olarak modellenir.*

## Eksiksiz bir yapay zekâ provenance kaydı neleri içerir?

Güvenilir bir yapay zekâ sisteminde denetime hazır bir provenance kaydı yedi zorunlu nitelik taşır:

- [ ] 1. Köken Kimliği: Kararlı URL, resmî sicil kimliği veya kriptografik içerik özeti (SHA-256).
- [ ] 2. Kesin Kanıt Aralığı: Destekleyici metin bölümünü sabitleyen karakter başlangıç ve bitiş aralıkları `[başlangıç..bitiş]`.
- [ ] 3. Zamansal Anlık Görüntü: Kaynağın yayımlandığı, çekildiği ve işlendiği zaman damgaları.
- [ ] 4. Pipeline Sürümü: Çıkarımı yürüten yazılımın tam Git commit hash''i veya sürüm etiketi.
- [ ] 5. Model Tanımlayıcısı: Vektörleştirme veya çıkarımda kullanılan modelin sabitlenmiş sürümü (örneğin `text-embedding-3-small@v1`).
- [ ] 6. Yetkilendirme Kapsamı: Bu veriyi inceleme veya kullanma yetkisine sahip tenant ve workspace sınırları.
- [ ] 7. Geçersiz Kılma Bağlantısı: Mevzuat veya olgu değiştiğinde bu kaydın yerine geçen yeni otoriteye işaret eden bağlantı.

## Provenance model sapmasına ve halüsinasyona karşı nasıl korur?

Provenance yalnızca mevzuat yükümlülüğü değil; otonom sistemlerde güçlü bir teknik koruma kalkanıdır:

- Otomatik Doğrulama (Entailment Check): Bir denetim modeli, üretilen cevabın kaynak belgedeki kanıt aralığı tarafından matematiksel olarak desteklendiğini kullanıcıya sunmadan önce kontrol edebilir.
- Kademeli Geçersiz Kılma: Bir kanun maddesi değiştiğinde, sistem provenance grafiğini kullanarak o maddeye dayanan tüm hafıza iddialarını anında geçersiz kılabilir.
- Deterministik Hata Ayıklama: Bir ajan beklenmedik bir cevap ürettiğinde, mühendisler her girdi assertion''ını kaynak belgedeki tam bayt aralığına kadar takip edebilir.

## MESA ekosisteminde provenance

MESA projesinde provenance, tüm depolar arasında mimari bir ilke olarak uygulanır:

- [MESA Data](data/) içinde resmî hukuk kaynakları (PDF ve HTML) değiştirilemez bayt temeli olarak saklanır ve karakter aralıkları kanonik JSONL kayıtlarına işlenir.
- [MESA Core](mesa/) içinde her hafıza sorgusu, assertion ile birlikte kaynak belge özetini ve kanıt aralığını döndürür.
- [MESA Law](law/) içinde avukatlar, yapay zekânın sunduğu her tespiti tıklayarak Resmî Gazete''deki orijinal kanıt metnini anında inceleyebilir.

## Kaynaklar ve standartlar

1. [Moreau & Missier (2013) — W3C PROV-DM: The PROV Data Model](https://www.w3.org/TR/prov-dm/)
2. [Buneman vd. (2001) — Why and Where: A Characterization of Data Provenance (ICDT ''01)](https://link.springer.com/chapter/10.1007/3-540-44503-X_20)
3. [Provenance Tanımı — MESA Sözlüğü](glossary/provenance/)

', ARRAY['provenance', 'auditability', 'evidence', 'trust']::text[], 'MESA contributors', 7, 'published', 'Yapay Zekâ Sistemlerinde Provenance Nedir? — MESA Learn', 'Yapay zekâda provenance''ın ne anlama geldiğini öğrenin: köken varlığı, dönüşüm süreçleri, kesin kanıt aralıkları ve atıf ile provenance arasındaki fark.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('memory-scope-and-authorization', 'learn', 'en', 'Memory scope and authorization in multi-agent systems', 'Why security, tenant boundaries, and access controls must be enforced before retrieval fusion', 'Multi-agent systems require rigorous memory scoping across tenants, workspaces, agents, and temporal windows to prevent data leakage and cross-context contamination.', 'Authorization in agent memory cannot be an afterthought: scopes must be validated before vector or keyword retrieval runs, ensuring agents never recall data outside their authorized perimeter.', '## The multi-agent data leakage problem

When multiple agents collaborate in enterprise environments, they share data infrastructure. If memory lacks explicit boundary enforcement, semantic search becomes a massive security vulnerability.

> [!WARNING]
> **Semantic search has no concept of confidentiality**
> A query like ''What were the executive compensation terms discussed last week?'' will retrieve relevant records strictly based on cosine similarity. Dense embeddings do not understand ethical walls, organizational hierarchies, or tenant boundaries.

Without boundary enforcement, an agent assisting a marketing contractor could inadvertently retrieve confidential acquisition strategies stored by an executive agent in the same underlying database.

## The six dimensions of memory scoping

In production memory engines, security is modeled along six orthogonal dimensions:

| Scope Dimension | Boundary Type | Example | Enforcement Role |
| --- | --- | --- | --- |
| Tenant ID | Organizational isolation | Enterprise Account A vs Account B | Absolute isolation: zero cross-tenant query execution |
| Workspace ID | Project / Team perimeter | Matter 402 vs Matter 510 | Controls which projects or client files an agent can read |
| Agent ID | Private scratchpad | ResearchAgent vs ReviewAgent | Allows agents to maintain private working memory before sharing |
| Session ID | Ephemeral lifecycle | Interactive conversation turn | Isolates temporary conversation state from durable memory |
| Temporal Window | Validity duration | `valid_from` to `valid_until` | Excludes expired, preliminary, or superseded assertions |
| Jurisdiction | Regulatory boundary | TR vs EU data boundary | Ensures compliance with local data sovereignty mandates |

## Why pre-filtering is mathematically mandatory

A common mistake in agent development is post-filtering: querying the vector database for top-k results globally, and then discarding unauthorized results using an `if` statement.

<!-- diagram: Diagram contrasting flawed Post-Filtering (which causes top-k starvation) with correct Pre-Filtering (which searches strictly within the authorized partition) -->
1. Flawed Post-Filter: Global Search -> Top 10 from Tenant B -> Filtered Out -> Zero Results returned to Tenant A
2. Correct Pre-Filter: Scope Filter (Tenant A) -> Scoped Vector Scan -> 10 relevant results returned to Tenant A

*Post-filtering causes result starvation; pre-filtering guarantees search executes exclusively within authorized partitions.*

- [ ] Top-k Starvation: If the top 20 global vector matches belong to another tenant, post-filtering strips them all out, returning an empty list to the user even if dozens of valid records exist at ranks 21–50.
- [ ] Performance Overhead: Calculating vector distances over millions of unauthorized rows wastes GPU and CPU cycles.
- [ ] Data Leakage Timing: Timing and cache side-channels can leak information when global indexes process unauthorized candidates.

## Scoped collaboration between autonomous agents

Multi-agent workflows require nuanced permission models where agents share common workspace context while retaining private working memory:

> [!TIP]
> **Collaborative agent workflow**
> Agent A (Legal Researcher) writes assertions to `workspace:matter_104` with public visibility. Agent B (Partner Reviewer) reads workspace assertions, conducts a confidential fee audit, and writes assertions to `agent:reviewer_private`. When Agent A queries memory, it sees only the public matter assertions, while Agent B sees both.

## How MESA enforces memory authorization

In [MESA Core](mesa/), scope is not an optional tag: every memory table schema includes required `dataset_id`, `tenant_id`, `agent_id`, and temporal boundary columns.

Retrieval routers apply SQL `WHERE` clauses and vector metadata partition filters *before* candidate generation begins. Furthermore, MESA supports Profile B security certification gates, ensuring that memory boundaries are tamper-evident and fail closed. Learn more in the [MESA Core Documentation](mesa/).

## References

1. [Sandhu et al. (1996) — Role-Based Access Control Models (IEEE Computer)](https://ieeexplore.ieee.org/document/485845)
2. [Saltzer & Schroeder (1975) — The Protection of Information in Computer Systems](https://www.cs.virginia.edu/~evans/cs551/saltzer/)
3. [MESA Evaluation & Security Gates](https://mesamemory.dev/evaluation/)

', ARRAY['authorization', 'multi-agent', 'security', 'scope', 'tenancy']::text[], 'MESA contributors', 8, 'published', 'Memory Scope and Authorization in Multi-Agent Systems — MESA Learn', 'Understand multi-tenant isolation, workspace perimeters, agent privacy, and why authorization must be enforced prior to retrieval fusion in AI memory.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
INSERT INTO public.articles (slug, type, language, title, subtitle, summary, short_answer, body_markdown, tags, author, reading_minutes, status, seo_title, seo_description, indexable, published_at, created_at, updated_at) VALUES ('memory-scope-and-authorization', 'learn', 'tr', 'Çok ajanlı sistemlerde hafıza kapsamı ve yetkilendirme', 'Güvenlik, kiracı (tenant) sınırları ve erişim denetimlerinin neden retrieval birleşiminden önce uygulanması gerektiği', 'Çok ajanlı sistemler; veri sızıntısını ve bağlam kirlenmesini önlemek için kiracılar, çalışma alanları, ajanlar ve zaman pencereleri arasında titiz bir hafıza kapsamı gerektirir.', 'Ajan hafızasında yetkilendirme sonradan düşünülen bir yama olamaz: kapsamlar vektör veya kelime araması çalıştırılmadan önce doğrulanmalı, ajanların yetki sınırları dışındaki verilere erişmesi engellenmelidir.', '## Çok ajanlı sistemlerde veri sızıntısı sorunu

Kurumsal ortamlarda birden fazla ajan işbirliği yaptığında ortak veri altyapısını paylaşır. Hafıza belirgin sınır denetimlerine sahip değilse, anlamsal arama devasa bir güvenlik açığına dönüşür.

> [!WARNING]
> **Anlamsal aramanın gizlilik kavramı yoktur**
> ''Geçen hafta konuşulan yönetici tazminat şartları nelerdi?'' gibi bir sorgu, sonuçları yalnızca kosinüs benzerliğine göre geri getirir. Dense embedding''ler şirket içi bilgi duvarlarını, organizasyon hiyerarşisini veya kiracı (tenant) sınırlarını tanımaz.

Sınır denetimi olmadan, bir pazarlama yüklenicisine yardımcı olan ajan, aynı veritabanında üst düzey bir ajanın sakladığı gizli şirket satın alma stratejilerini yanlışlıkla geri çağırabilir.

## Hafıza kapsamının altı boyutu

Üretim sınıfı hafıza motorlarında güvenlik altı bağımsız eksende modellenir:

| Kapsam Boyutu | Sınır Türü | Örnek | Uygulama Rolü |
| --- | --- | --- | --- |
| Tenant ID | Kurumsal izolasyon | Kurumsal Hesap A ile Hesap B | Mutlak izolasyon: kiracılar arası sorgu yürütümü sıfırdır |
| Workspace ID | Proje / Ekip sınırı | Dosya 402 ile Dosya 510 | Ajanın hangi proje veya müvekkil dosyalarını okuyabileceğini belirler |
| Agent ID | Özel scratchpad | AraştırmaAjanı ile DenetimAjanı | Ajanların paylaşmadan önce özel çalışma hafızası tutmasını sağlar |
| Session ID | Oturum yaşam döngüsü | Canlı konuşma turu | Geçici konuşma durumunu kalıcı hafızadan izole eder |
| Zaman Penceresi | Geçerlilik süresi | `valid_from` ile `valid_until` | Süresi dolmuş, taslak veya yürürlükten kalkmış iddiaları dışlar |
| Yargı Yetkisi | Mevzuat sınırı | TR ile AB veri sınırı | Yerel veri egemenliği kurallarına uyumu güvenceye alır |

## Ön filtreleme neden matematiksel olarak zorunludur?

Ajan geliştirmede sıkça yapılan bir hata sonradan filtrelemedir (post-filtering): vektör veritabanını genel olarak sorgulayıp ilk k sonucu almak, ardından yetkisiz olanları bir `if` koşuluyla ayıklamak.

<!-- diagram: Sonradan Filtreleme (top-k açlığına yol açan) ile Doğru Ön Filtrelemeyi (yalnızca yetkili bölmede arama yapan) karşılaştıran şema -->
1. Hatalı Sonradan Filtreleme: Genel Arama -> Tenant B''den ilk 10 sonuç -> Ayıklandı -> Tenant A''ya sıfır sonuç döndü
2. Doğru Ön Filtreleme: Kapsam Filtresi (Tenant A) -> Kapsamlı Vektör Taraması -> Tenant A''ya 10 ilgili sonuç döndü

*Sonradan filtreleme sonuç açlığına yol açar; ön filtreleme aramanın yalnızca yetkili bölümlerde çalışmasını garanti eder.*

- [ ] Top-k Açlığı: Genel vektör eşleşmelerinin ilk 20''si başka bir kiracıya aitse, sonradan filtreleme hepsini eler; sistemde 21-50. sıralarda onlarca geçerli kayıt olmasına rağmen kullanıcıya boş liste döner.
- [ ] İşlem Maliyeti: Milyonlarca yetkisiz satır üzerinde vektör mesafesi hesaplamak GPU ve CPU kaynaklarını israf eder.
- [ ] Veri Sızıntısı Riski: Genel indekslerin yetkisiz adayları işlemesi zamanlama ve önbellek yan kanalları üzerinden bilgi sızdırabilir.

## Otonom ajanlar arasında kapsamlı işbirliği

Çok ajanlı iş akışları, ajanların ortak bir çalışma alanı bağlamını paylaşırken özel hafızalarını koruyabildiği incelikli bir izin modeli gerektirir:

> [!TIP]
> **İşbirlikçi ajan senaryosu**
> Ajan A (Araştırmacı) `workspace:dosya_104` kapsamına herkese açık iddialar yazar. Ajan B (Denetçi) bu iddiaları okur, gizli bir ücret denetimi yapar ve `agent:denetci_ozel` kapsamına yazar. Ajan A hafızayı sorguladığında yalnızca genel iddiaları görürken, Ajan B her iki katmanı da görebilir.

## MESA hafıza yetkilendirmesini nasıl uygular?

[MESA Core](mesa/) içinde kapsam isteğe bağlı bir etiket değildir: her hafıza tablosu şeması zorunlu `dataset_id`, `tenant_id`, `agent_id` ve zamansal sınır sütunlarını içerir.

Retrieval router''ları, aday üretimi başlamadan *önce* SQL `WHERE` koşullarını ve vektör metaveri bölüm filtrelerini uygular. Ayrıca MESA, Profile B güvenlik sertifikasyon kapılarını destekleyerek hafıza sınırlarının kurcalamaya karşı korumalı olmasını ve hata durumunda kapanmasını (fail-closed) sağlar. Detayları [MESA Core Dokümantasyonu](mesa/) sayfasında bulabilirsiniz.

## Kaynaklar

1. [Sandhu vd. (1996) — Role-Based Access Control Models (IEEE Computer)](https://ieeexplore.ieee.org/document/485845)
2. [Saltzer & Schroeder (1975) — The Protection of Information in Computer Systems](https://www.cs.virginia.edu/~evans/cs551/saltzer/)
3. [MESA Değerlendirme ve Güvenlik Kapıları](https://mesamemory.dev/evaluation/)

', ARRAY['authorization', 'multi-agent', 'security', 'scope', 'tenancy']::text[], 'MESA contributors', 8, 'published', 'Çok Ajanlı Sistemlerde Hafıza Kapsamı ve Yetkilendirme — MESA Learn', 'Çok kiracılı (multi-tenant) izolasyonu, workspace sınırlarını, ajan gizliliğini ve yetkilendirmenin neden retrieval birleşiminden önce uygulanması gerektiğini anlayın.', true, '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z', '2026-10-01T00:00:00Z') ON CONFLICT (slug, language) DO UPDATE SET title = EXCLUDED.title, body_markdown = EXCLUDED.body_markdown, updated_at = timezone('utc'::text, now());
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
