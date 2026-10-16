#!/usr/bin/env python3
"""Articles 1 to 10 for MESA Content Platform."""

from article_builder import build_article

def get_articles_1_to_10() -> list[dict]:
    return [
        # 1. GraphRAG vs Pure Knowledge Graphs
        build_article(
            slug="graph-rag-vs-pure-graphs",
            category="Memory & Retrieval",
            reading_minutes=8,
            tags=["graph-rag", "knowledge-graph", "retrieval", "ai-memory"],
            en_title="GraphRAG vs pure knowledge graphs in AI memory",
            en_subtitle="Comparing hierarchical community summaries with deterministic relational graph traversals",
            en_summary="GraphRAG clusters text into hierarchical communities for global theme extraction, while pure knowledge graphs represent typed assertions and exact multi-hop entity relations.",
            en_short_answer="GraphRAG answers global corpus-level queries through pre-computed summaries; pure knowledge graphs answer precise relational questions through deterministic topological traversals.",
            en_dilemma_title="Two distinct graph philosophies",
            en_dilemma_text="When structuring agent memory around graphs, two major approaches have emerged: LLM-synthesized community summaries (GraphRAG) and explicit typed assertion topologies (pure knowledge graphs).",
            en_warning_title="The Granularity Trade-off",
            en_warning_text="GraphRAG summarizes document communities into lossy textual clusters, making it ideal for answering 'What are the main themes across all documents?'. Pure knowledge graphs preserve exact entity triples, making them mandatory when determining whether Person A signed Contract B.",
            en_table_headers=["Dimension", "GraphRAG (Community Summaries)", "Pure Knowledge Graphs (Typed Triples)"],
            en_table_rows=[
                ["Primary Query Type", "Global corpus sense-making and thematic discovery", "Deterministic entity traversals and multi-hop paths"],
                ["Ingestion Cost", "Very high: requires extensive LLM community summarization", "Moderate: requires entity-relation extraction and schema validation"],
                ["Query Determinism", "Probabilistic: combines LLM summaries of clusters", "Deterministic: exact Cypher/SPARQL path traversal"],
                ["Contradiction Handling", "Weak: conflicting claims coexist in text summaries", "Strong: primary keys, revision links, and retraction states"],
                ["Auditability", "Low: claims are blended into synthesized summaries", "Complete: every edge maps to a canonical evidence span"]
            ],
            en_mech_title="Hierarchical clustering vs explicit graph topology",
            en_mech_text="GraphRAG partitions graph nodes into hierarchical communities using algorithms such as Leiden clustering. Each community is then summarized by an LLM into an executive brief. In contrast, pure knowledge graphs maintain explicit graph schemas where nodes represent typed entities and edges represent verified predicates.",
            en_code="// Pure Knowledge Graph: Exact Cypher multi-hop query\nMATCH (p:Person {name: 'Alice'})-[:OFFICER_OF]->(c:Company)-[:SUBSIDIARY_OF]->(t:Target)\nRETURN p, c, t;",
            en_mesa_title="MESA's deterministic graph projection",
            en_mesa_text="In MESA Core, graphs are not opaque LLM summaries. Canonical memory records typed assertions in SQLite with verified evidence spans, which are then projected into Kùzu for zero-copy, embedded multi-hop graph analytics.",
            en_checklist=[
                "Canonical assertions store explicit Subject-Predicate-Object triples.",
                "Graph edges inherit exact source document hashes and character offsets.",
                "Projections recompute deterministically if graph storage is cleared.",
                "Scope and tenancy boundaries are enforced before graph path expansion."
            ],
            en_refs=[
                {"label": "Edge et al. (2024) — From Local to Global: A Graph RAG Approach to Query-Focused Summarization (Microsoft Research)", "href": "https://arxiv.org/abs/2404.16130"},
                {"label": "Hogan et al. (2021) — Knowledge Graphs (ACM Computing Surveys)", "href": "https://dl.acm.org/doi/10.1145/3447772"}
            ],
            tr_title="AI hafızasında GraphRAG ile saf bilgi grafikleri karşılaştırması",
            tr_subtitle="Hiyerarşik topluluk özetleri ile deterministik ilişkisel graph gezinimlerinin değerlendirilmesi",
            tr_summary="GraphRAG metinleri küresel temalar için hiyerarşik topluluklar halinde kümelerken, saf bilgi grafikleri tipli assertion'ları ve kesin çok sekmeli varlık ilişkilerini temsil eder.",
            tr_short_answer="GraphRAG önceden hesaplanan özetlerle küresel tema sorularını yanıtlar; saf bilgi grafikleri ise deterministik topolojik gezinimlerle kesin ilişkisel soruları çözer.",
            tr_dilemma_title="İki farklı graph felsefesi",
            tr_dilemma_text="Ajan hafızasını grafikler etrafında yapılandırırken iki temel yaklaşım öne çıkmıştır: LLM ile sentezlenen topluluk özetleri (GraphRAG) ve açık tipli assertion topolojileri (saf bilgi grafikleri).",
            tr_warning_title="Granülerlik Ödünleşimi",
            tr_warning_text="GraphRAG belge topluluklarını kayıplı metin özetlerine dönüştürür; bu sayede 'Tüm belgelerdeki ana temalar nelerdir?' sorusunu harika çözer. Saf bilgi grafikleri ise varlık üçlülerini tam korur; Ahmet'in B Sözleşmesini imzalayıp imzalamadığını tespit ederken zorunludur.",
            tr_table_headers=["Boyut", "GraphRAG (Topluluk Özetleri)", "Saf Bilgi Grafikleri (Tipli Üçlüler)"],
            tr_table_rows=[
                ["Birincil Sorgu Türü", "Küresel küme anlamlandırması ve tematik keşif", "Deterministik varlık gezinimleri ve çok sekmeli yollar"],
                ["Yazma/Kabul Maliyeti", "Çok yüksek: kapsamlı LLM topluluk özeti gerektirir", "Orta: varlık-ilişki çıkarımı ve şema doğrulaması gerektirir"],
                ["Sorgu Determinizmi", "Olasılıksal: metin özetlerini birleştirir", "Deterministik: kesin Cypher/SPARQL yol sorguları"],
                ["Çelişki Yönetimi", "Zayıf: çelişkili iddialar metin özetinde bir arada kalır", "Güçlü: birincil anahtarlar, revizyon bağlantıları ve geri çekme"],
                ["Denetlenebilirlik", "Düşük: iddialar sentezlenmiş özetler içinde erir", "Eksiksiz: her kenar kanonik kanıt aralığına bağlanır"]
            ],
            tr_mech_title="Hiyerarşik kümeleme ile açık graph topolojisi",
            tr_mech_text="GraphRAG, Leiden kümeleme algoritmasıyla graph düğümlerini hiyerarşik topluluklara ayırır ve her topluluk için bir LLM özeti üretir. Saf bilgi grafikleri ise düğümlerin somut varlıkları, kenarların ise doğrulanmış yüklemleri temsil ettiği biçimsel şemalar uygular.",
            tr_code="// Saf Bilgi Grafiği: Kesin Cypher çok sekmeli yol sorgusu\nMATCH (p:Person {name: 'Ahmet'})-[:YONETICI]->(s:Sirket)-[:ISTIRAKI]->(h:Hedef)\nRETURN p, s, h;",
            tr_mesa_title="MESA'nın deterministik graph projeksiyonu",
            tr_mesa_text="MESA Core içinde grafikler kapalı LLM özetlerinden ibaret değildir. Kanonik hafıza, SQLite içinde doğrulanmış kanıt aralıklarıyla tipli assertion'lar kaydeder; ardından sıfır kopyalı gömülü graph analitiği için Kùzu motoruna projekte edilir.",
            tr_checklist=[
                "Kanonik assertion'lar açık Özne-Yüklem-Nesne üçlüleri saklar.",
                "Graph kenarları orijinal belge hash'ini ve karakter aralığını miras alır.",
                "Graph deposu silinse dahi kanonik SQLite kayıtlarından yeniden üretilebilir.",
                "Kapsam ve tenant sınırları graph genişletmesinden önce uygulanır."
            ],
            tr_refs=[
                {"label": "Edge vd. (2024) — From Local to Global: A Graph RAG Approach to Query-Focused Summarization (Microsoft Research)", "href": "https://arxiv.org/abs/2404.16130"},
                {"label": "Hogan vd. (2021) — Knowledge Graphs (ACM Computing Surveys)", "href": "https://dl.acm.org/doi/10.1145/3447772"}
            ]
        ),

        # 2. Temporal Decay in AI Memory
        build_article(
            slug="temporal-decay-in-ai-memory",
            category="Foundations",
            reading_minutes=7,
            tags=["temporal-decay", "memory-freshness", "state-mutation", "ai-memory"],
            en_title="Temporal decay and knowledge freshness in agent memory",
            en_subtitle="Balancing durable historical facts against mutating real-time beliefs",
            en_summary="Knowledge in agent memory changes over time. Temporal decay models determine whether an assertion remains active, requires re-verification, or has been superseded.",
            en_short_answer="Temporal memory uses validity intervals and decay algorithms so agents do not treat stale or superseded observations as currently active truths.",
            en_dilemma_title="The permanence trap of vector embeddings",
            en_dilemma_text="Vector databases treat points in latent space as timeless. An embedding computed three years ago remains indefinitely close to queries matching its keywords, creating a dangerous failure mode where agents cite obsolete state.",
            en_warning_title="The Stale State Vulnerability",
            en_warning_text="If an agent stores 'Server configuration points to Cluster A', and the cluster is migrated to Cluster B, vector distance alone cannot determine that Cluster A is an outdated historical fact rather than current state.",
            en_table_headers=["Strategy", "Mechanism", "Best For", "Failure Risk"],
            en_table_rows=[
                ["Exponential Decay", "Score multiplied by exp(-lambda * delta_t)", "Chat recency, casual interactions", "Erases foundational facts that are permanently true"],
                ["Explicit Intervals", "valid_from and valid_until timestamps", "Contracts, statutes, configuration state", "Requires explicit invalidation triggers"],
                ["Bitemporal Modeling", "Valid Time vs Transaction Time", "Financial audits, legal compliance", "Higher storage and query complexity"],
                ["Superseding Chains", "Explicit revision pointers (superseded_by)", "Entity attribute updates", "Dangling references if chains break"]
            ],
            en_mech_title="Bitemporal intervals and decay equations",
            en_mech_text="High-assurance memory engines implement bitemporal indexing: recording both when an event occurred in the real world (valid time) and when the memory system learned about it (transaction time). Decay is applied strictly to relevance scores, never to destructive record deletion.",
            en_code="// Bitemporal memory filter in SQL\nSELECT * FROM assertions\nWHERE valid_from <= CURRENT_TIMESTAMP\n  AND (valid_until IS NULL OR valid_until > CURRENT_TIMESTAMP)\n  AND transaction_status = 'COMMITTED';",
            en_mesa_title="Temporal scoping in MESA",
            en_mesa_text="MESA Core mandates temporal boundary fields on every memory record. Retrieval filters reject superseded records before vector or lexical ranking occurs, ensuring historical logs remain intact without contaminating live agent reasoning.",
            en_checklist=[
                "Every assertion schema includes valid_from and valid_until boundaries.",
                "State updates create immutable revision records rather than in-place overwrites.",
                "Audit queries can time-travel to inspect the exact memory state at any historical point in time.",
                "Decay algorithms do not destroy underlying evidence spans."
            ],
            en_refs=[
                {"label": "Snodgrass & Jensen (1999) — Developing Time-Oriented Database Applications in SQL", "href": "https://www.cs.arizona.edu/people/rts/tdbbook.pdf"},
                {"label": "Ebbinghaus (1885) — Memory: A Contribution to Experimental Psychology", "href": "https://psychclassics.yorku.ca/Ebbinghaus/"}
            ],
            tr_title="Ajan hafızasında zamansal sönümlenme ve bilgi güncelliği",
            tr_subtitle="Kalıcı tarihsel olgular ile değişen anlık inançlar arasındaki dengenin kurulması",
            tr_summary="Ajan hafızasındaki bilgi zamanla değişir. Zamansal sönümlenme modelleri bir iddianın aktif mi kaldığını, yeniden doğrulama mı gerektirdiğini yoksa geçerliliğini yitirdiğini mi belirler.",
            tr_short_answer="Zamansal hafıza geçerlilik aralıkları ve sönümlenme algoritmaları kullanarak ajanların eski veya yürürlükten kalkmış gözlemleri güncel gerçek sanmasını engeller.",
            tr_dilemma_title="Vektör embedding'lerinin zamansızlık tuzağı",
            tr_dilemma_text="Vektör veritabanları uzaydaki noktaları zamansız kabul eder. Üç yıl önce hesaplanmış bir embedding, ilgili kelimelerle arandığında süresiz yakın kalır; bu da ajanın eski durumu güncel sanmasına yol açar.",
            tr_warning_title="Eski Durum Açığı",
            tr_warning_text="Bir ajan 'Sunucu yapılandırması Küme A'ya bakar' bilgisini kaydeder ve küme Küme B'ye taşınırsa, salt vektör mesafesi Küme A bilgisinin artık yürürlükte olmadığını anlayamaz.",
            tr_table_headers=["Strateji", "Mekanizma", "En Uygun Alan", "Hata Riski"],
            tr_table_rows=[
                ["Üssel Sönümlenme", "Puan exp(-lambda * delta_t) ile çarpılır", "Sohbet güncelliği, gündelik etkileşim", "Kalıcı doğru olan temel olguları silebilir"],
                ["Açık Zaman Aralıkları", "valid_from ve valid_until damgaları", "Sözleşmeler, mevzuat, sistem ayarları", "Açık geçersiz kılma tetikleyicisi gerektirir"],
                ["Bitemporal Modelleme", "Geçerlilik Zamanı ile İşlem Zamanı", "Finansal denetim, hukuki uyumluluk", "Daha yüksek depolama ve sorgu karmaşıklığı"],
                ["Hükümsüzlük Zincirleri", "Açık revizyon işaretçileri (superseded_by)", "Varlık nitelik güncellemeleri", "Zincir koparsa yetim kayıtlar oluşabilir"]
            ],
            tr_mech_title="Bitemporal aralıklar ve sönümlenme denklemleri",
            tr_mech_text="Yüksek güvenilirlikli hafıza motorları bitemporal indeksleme uygular: hem olayın gerçek dünyada gerçekleştiği zamanı (geçerlilik zamanı) hem de hafıza sistemine kaydedildiği zamanı (işlem zamanı) saklar. Sönümlenme relevance puanına uygulanır, kayıtları fiziksel olarak silmez.",
            tr_code="// SQL içinde bitemporal hafıza filtresi\nSELECT * FROM assertions\nWHERE valid_from <= CURRENT_TIMESTAMP\n  AND (valid_until IS NULL OR valid_until > CURRENT_TIMESTAMP)\n  AND transaction_status = 'COMMITTED';",
            tr_mesa_title="MESA'da zamansal kapsam denetimi",
            tr_mesa_text="MESA Core her hafıza kaydında zamansal sınır alanlarını zorunlu kılar. Retrieval router'ları, vektör veya lexical sıralama başlamadan önce süresi dolmuş kayıtları eler; böylece tarihsel denetim izi korunurken canlı akıl yürütme temiz tutulur.",
            tr_checklist=[
                "Her assertion şeması valid_from ve valid_until sınırları içerir.",
                "Durum güncellemeleri yerinde üzerine yazmak yerine değiştirilemez revizyon kaydı üretir.",
                "Denetim sorguları tarihteki herhangi bir ana dönerek tam hafıza durumunu inceleyebilir.",
                "Sönümlenme algoritmaları temel kanıt aralıklarını asla yok etmez."
            ],
            tr_refs=[
                {"label": "Snodgrass & Jensen (1999) — Developing Time-Oriented Database Applications in SQL", "href": "https://www.cs.arizona.edu/people/rts/tdbbook.pdf"},
                {"label": "Ebbinghaus (1885) — Memory: A Contribution to Experimental Psychology", "href": "https://psychclassics.yorku.ca/Ebbinghaus/"}
            ]
        ),

        # 3. SQLite as Canonical Agent Memory
        build_article(
            slug="sqlite-as-canonical-agent-memory",
            category="Foundations",
            reading_minutes=8,
            tags=["sqlite", "architecture", "canonical-store", "durability"],
            en_title="Why SQLite is the optimal canonical store for AI memory",
            en_subtitle="Embedded transactional reliability as the foundation for multi-modal derived projections",
            en_summary="AI memory requires transactional durability, strict schema validation, and zero-network overhead. SQLite provides an ACID-compliant bedrock from which vector and graph indexes can be derived.",
            en_short_answer="SQLite ensures memory state transitions are atomic and durable; derived vector and graph stores can be rebuilt deterministically if they ever corrupt.",
            en_dilemma_title="The fragility of multi-database sprawl",
            en_dilemma_text="Many modern agent frameworks attempt to connect an external vector database, a standalone graph database, and a key-value cache simultaneously. When an agent crashes during a write operation, the databases fall out of sync, leading to orphaned edges and ghost records.",
            en_warning_title="Distributed Transaction Hazard",
            en_warning_text="Two-phase commits across heterogenous vector and graph services are notoriously fragile in agent runtimes. A network failure during ingestion can leave vectors pointing to deleted graph nodes.",
            en_table_headers=["Dimension", "Multi-Database Sprawl", "SQLite-Canonical Architecture"],
            en_table_rows=[
                ["ACID Guarantees", "None across external services", "Full transactional atomicity and WAL durability"],
                ["Deployment Complexity", "Multiple background servers, network configs, auth tokens", "Single file, embedded in-process, zero network hops"],
                ["Corruption Recovery", "Manual database reconciliation required", "Projections deterministically regenerate from SQLite"],
                ["Lexical Search", "Requires separate Elasticsearch / OpenSearch cluster", "Built-in SQLite FTS5 extension with BM25 ranking"],
                ["Portability", "Locked into specific cloud vendor architectures", "Cross-platform single file, portable across OS and architectures"]
            ],
            en_mech_title="Transactional assertions and derived projections",
            en_mech_text="In a canonical architecture, all write operations write exclusively to SQLite inside an atomic transaction. Background listeners or sync hooks then update derived search projections (such as LanceDB vector tables and Kùzu graph tables).",
            en_code="-- Atomic assertion ingestion in SQLite\nBEGIN TRANSACTION;\nINSERT INTO assertions (id, subject, predicate, object, source_id, status)\nVALUES ('asrt_102', 'Model', 'uses_quantization', 'INT8', 'doc_sys_v1', 'COMMITTED');\nINSERT INTO evidence_spans (assertion_id, start_char, end_char)\nVALUES ('asrt_102', 1240, 1310);\nCOMMIT;",
            en_mesa_title="MESA's single source of truth",
            en_mesa_text="MESA Core establishes SQLite as its immutable transaction engine. LanceDB and Kùzu operate as purely derived projections: if either is deleted or corrupted, MESA rebuilds both from the canonical SQLite database with bitwise precision.",
            en_checklist=[
                "All memory mutations commit through SQLite WAL mode.",
                "FTS5 provides in-process, sub-millisecond BM25 keyword matching.",
                "Projections are ephemeral and strictly recomputable.",
                "Zero network socket latency for local memory reads and writes."
            ],
            en_refs=[
                {"label": "Hipp (2020) — SQLite Architecture and Design", "href": "https://www.sqlite.org/arch.html"},
                {"label": "MESA Core Storage Projections Specification", "href": "https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md"}
            ],
            tr_title="SQLite neden yapay zekâ hafızası için en uygun kanonik depodur?",
            tr_subtitle="Çok kipli türetilmiş projeksiyonların temeli olarak gömülü işlemsel güvenilirlik",
            tr_summary="Yapay zekâ hafızası işlemsel dayanıklılık, katı şema doğrulaması ve sıfır ağ yükü gerektirir. SQLite, vektör ve graph indekslerinin türetilebileceği ACID uyumlu bir temel sağlar.",
            tr_short_answer="SQLite hafıza durum geçişlerinin atomik ve dayanıklı olmasını garanti eder; türetilmiş vektör ve graph depoları bozulsa bile deterministik olarak yeniden üretilebilir.",
            tr_dilemma_title="Çoklu veritabanı karmaşasının kırılganlığı",
            tr_dilemma_text="Birçok modern ajan kütüphanesi harici bir vektör veritabanını, bağımsız bir graph veritabanını ve bir anahtar-değer önbelleğini aynı anda bağlamaya çalışır. Bir yazma işlemi sırasında ajan çökerse veritabanları uyumsuz hale gelir, yetim kenarlar ve hayalet kayıtlar kalır.",
            tr_warning_title="Dağıtık İşlem Tehlikesi",
            tr_warning_text="Ajan çalışma zamanlarında heterojen vektör ve graph servisleri arasında iki aşamalı commit (2PC) yürütmek son derece kırılgandır. Ağ hatası silinmiş graph düğümlerini işaret eden yetim vektörler bırakabilir.",
            tr_table_headers=["Boyut", "Çoklu Veritabanı Karmaşası", "SQLite Kanonik Mimarisi"],
            tr_table_rows=[
                ["ACID Garantisi", "Harici servisler arasında yok", "Tam işlemsel atomiklik ve WAL dayanıklılığı"],
                ["Dağıtım Karmaşıklığı", "Birden fazla arka plan sunucusu, ağ ayarları, token'lar", "Tek dosya, süreç içi gömülü, sıfır ağ gecikmesi"],
                ["Bozulma Onarımı", "Manuel veritabanı mutabakatı gerektirir", "Projeksiyonlar SQLite'tan deterministik olarak üretilir"],
                ["Lexical Arama", "Ayrı Elasticsearch / OpenSearch kümesi gerektirir", "BM25 sıralamalı yerleşik SQLite FTS5 eklentisi"],
                ["Taşınabilirlik", "Belirli bulut servis sağlayıcılarına kilitlenir", "İşletim sistemleri ve işlemciler arasında taşınabilir tek dosya"]
            ],
            tr_mech_title="İşlemsel assertion'lar ve türetilmiş projeksiyonlar",
            tr_mech_text="Kanonik mimaride tüm yazma işlemleri atomik bir işlem içinde doğrudan SQLite'a yapılır. Arka plan dinleyicileri veya senkronizasyon kancaları ardından türetilmiş arama projeksiyonlarını (LanceDB vektör tabloları ve Kùzu graph tabloları gibi) günceller.",
            tr_code="// SQLite içinde atomik assertion kabulü\nBEGIN TRANSACTION;\nINSERT INTO assertions (id, subject, predicate, object, source_id, status)\nVALUES ('asrt_102', 'Model', 'kullandigi_kuantalama', 'INT8', 'doc_sys_v1', 'COMMITTED');\nINSERT INTO evidence_spans (assertion_id, start_char, end_char)\nVALUES ('asrt_102', 1240, 1310);\nCOMMIT;",
            tr_mesa_title="MESA'nın tek bilgi kaynağı ilkesi",
            tr_mesa_text="MESA Core, SQLite'ı değiştirilemez işlem motoru olarak kurar. LanceDB ve Kùzu tamamen türetilmiş projeksiyonlar olarak çalışır: biri silinse veya bozulsa bile MESA ikisini de kanonik SQLite veritabanından sıfır kayıpla yeniden inşa eder.",
            tr_checklist=[
                "Tüm hafıza değişiklikleri SQLite WAL kipinde kaydedilir.",
                "FTS5 süreç içi ve milisaniyenin altında BM25 eşleşmesi sağlar.",
                "Projeksiyonlar geçicidir ve kesin biçimde yeniden üretilebilir.",
                "Yerel hafıza okuma ve yazmalarında sıfır ağ soket gecikmesi vardır."
            ],
            tr_refs=[
                {"label": "Hipp (2020) — SQLite Architecture and Design", "href": "https://www.sqlite.org/arch.html"},
                {"label": "MESA Core Depolama Projeksiyonları Spesifikasyonu", "href": "https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md"}
            ]
        ),

        # 4. Contradiction Detection in Memory
        build_article(
            slug="contradiction-detection-in-memory",
            category="Memory & Retrieval",
            reading_minutes=8,
            tags=["contradiction-detection", "belief-revision", "state-mutation", "logic"],
            en_title="Contradiction detection and belief revision in AI agents",
            en_subtitle="Maintaining logical consistency across evolving assertion lifecycles",
            en_summary="When autonomous agents learn conflicting information, belief revision algorithms must detect contradictory predicates, assess evidence authority, and mark superseded claims.",
            en_short_answer="Contradiction resolution requires schema-defined uniqueness constraints and evidentiary precedence rather than naive text accumulation.",
            en_dilemma_title="The accumulation paradox in naive memory",
            en_dilemma_text="In naive RAG setups, every conversation turn or ingested document is embedded into vector space without contradiction checking. Over time, mutual contradictions accumulate, forcing the generator to arbitrate between irreconcilable statements.",
            en_warning_title="The Hallucination Cascade",
            en_warning_text="When an LLM receives two conflicting factual claims in its prompt context (e.g. 'Project budget is $50k' and 'Project budget was increased to $80k'), it often hallucinates an ungrounded synthesis or picks an arbitrary answer.",
            en_table_headers=["Approach", "Detection Mechanism", "Resolution Strategy", "Consistency Level"],
            en_table_rows=[
                ["Vector Append-Only", "No detection", "None (both chunks retrieved)", "Low: severe contradiction risk"],
                ["LLM Arbitration", "Prompting model to spot conflicts", "Probabilistic in-context selection", "Medium: prone to prompt sensitivity"],
                ["Relational Unique Constraints", "Database primary keys & unique indexes", "Deterministic state replacement (UPSERT)", "High: guarantees single active truth per entity"],
                ["Formal Belief Revision (AGM)", "Epistemic entrenchment and revision operators", "Explicit retraction and provenance trail", "Highest: mathematical consistency guarantee"]
            ],
            en_mech_title="AGM postulates and database assertions",
            en_mech_text="The Alchourrón-Gärdenfors-Makinson (AGM) framework defines mathematical postulates for rational belief revision: expansion, contraction, and revision. In structured memory, each entity attribute is governed by a functional dependency: (Subject, Predicate) -> Unique Active Object.",
            en_code="// Assertion superseding transaction\nUPDATE assertions\nSET status = 'SUPERSEDED', updated_at = CURRENT_TIMESTAMP\nWHERE subject = 'project_alpha' AND predicate = 'budget' AND status = 'COMMITTED';\n\nINSERT INTO assertions (subject, predicate, object, status, superseded_id)\nVALUES ('project_alpha', 'budget', '80000_USD', 'COMMITTED', 'asrt_prev_id');",
            en_mesa_title="Contradiction lifecycle in MESA",
            en_mesa_text="MESA Core handles belief revision deterministically through assertion lifecycle states: COMMITTED, SUPERSEDED, PENDING_REVIEW, and RETRACTED. New assertions can never silently overwrite historical records; they append revision edges.",
            en_checklist=[
                "Contradictions are detected at ingestion time through typed schema constraints.",
                "Older assertions transition to SUPERSEDED status with timestamped audit trails.",
                "Retrieval queries filter out non-COMMITTED records by default.",
                "Evidence spans for both the superseded and active claims remain inspectable."
            ],
            en_refs=[
                {"label": "Alchourrón, Gärdenfors & Makinson (1985) — On the Logic of Theory Change: Partial Meet Contraction and Revision Functions", "href": "https://www.jstor.org/stable/2274239"},
                {"label": "Gärdenfors (1988) — Knowledge in Flux: Modeling the Dynamics of Epistemic States", "href": "https://mitpress.mit.edu/9780262570824/"}
            ],
            tr_title="Yapay zekâ ajanlarında çelişki tespiti ve inanç revizyonu",
            tr_subtitle="Gelişen assertion yaşam döngülerinde mantıksal tutarlılığın korunması",
            tr_summary="Otonom ajanlar çelişkili bilgiler öğrendiğinde inanç revizyonu algoritmaları çelişen yüklemleri tespit etmeli, kanıt otoritesini değerlendirmeli ve hükümsüz iddiaları işaretlemelidir.",
            tr_short_answer="Çelişki çözümü, metin parçalarını gelişigüzel yığmak yerine şema düzeyinde teklik kısıtları ve kanıtsal öncelik mekanizmaları gerektirir.",
            tr_dilemma_title="Basit hafızadaki birikim paradoksu",
            tr_dilemma_text="Geleneksel RAG sistemlerinde her konuşma turu veya belge çelişki kontrolü yapılmadan vektör uzayına eklenir. Zamanla birbirini dışlayan iddialar birikir ve üretici model bağdaşmaz bilgiler arasında tahmine zorlanır.",
            tr_warning_title="Halüsinasyon Zinciri",
            tr_warning_text="Bir dil modeli bağlamında iki çelişkili iddia gördüğünde ('Proje bütçesi 50.000$' ve 'Bütçe 80.000$'a yükseltildi'), genellikle uydurma bir sentez yapar veya gelişigüzel bir cevabı seçer.",
            tr_table_headers=["Yaklaşım", "Tespit Mekanizması", "Çözüm Stratejisi", "Tutarlılık Düzeyi"],
            tr_table_rows=[
                ["Salt Vektör Ekleme", "Tespit yok", "Yok (her iki parça da geri gelir)", "Düşük: ciddi çelişki riski"],
                ["LLM ile Hakemlik", "Modele çelişkileri sorma", "Olasılıksal bağlam içi seçim", "Orta: prompt hassasiyetine bağlı"],
                ["İlişkisel Teklik Kısıtları", "Veritabanı birincil anahtarları", "Deterministik durum güncellemesi (UPSERT)", "Yüksek: varlık başına tek aktif gerçek"],
                ["Biçimsel İnanç Revizyonu (AGM)", "Epistemik öncelik ve revizyon operatörleri", "Açık geri çekme ve provenance izi", "En yüksek: matematiksel tutarlılık garantisi"]
            ],
            tr_mech_title="AGM postulatları ve veritabanı assertion'ları",
            tr_mech_text="Alchourrón-Gärdenfors-Makinson (AGM) mantıksal çerçevesi inanç revizyonu için temel kuralları belirler: genişletme, daraltma ve revizyon. Yapılandırılmış hafızada her varlık niteliği bir fonksiyonel bağımlılıkla korunur: (Özne, Yüklem) -> Tek Aktif Nesne.",
            tr_code="// Assertion hükümsüz kılma işlemi\nUPDATE assertions\nSET status = 'SUPERSEDED', updated_at = CURRENT_TIMESTAMP\nWHERE subject = 'proje_alfa' AND predicate = 'butce' AND status = 'COMMITTED';\n\nINSERT INTO assertions (subject, predicate, object, status, superseded_id)\nVALUES ('proje_alfa', 'butce', '80000_USD', 'COMMITTED', 'asrt_onceki_id');",
            tr_mesa_title="MESA'da çelişki yaşam döngüsü",
            tr_mesa_text="MESA Core inanç revizyonunu assertion durumları üzerinden deterministik yönetir: COMMITTED, SUPERSEDED, PENDING_REVIEW ve RETRACTED. Yeni assertion'lar eski kayıtları asla sessizce yok etmez; revizyon kenarları bağlar.",
            tr_checklist=[
                "Çelişkiler kabul anında tipli şema kısıtları sayesinde tespit edilir.",
                "Eski assertion'lar zaman damgalı denetim iziyle SUPERSEDED durumuna geçer.",
                "Retrieval sorguları varsayılan olarak yalnızca COMMITTED kayıtları çeker.",
                "Hem yürürlükteki hem de mülga iddianın kanıt aralıkları incelenebilir kalır."
            ],
            tr_refs=[
                {"label": "Alchourrón, Gärdenfors & Makinson (1985) — On the Logic of Theory Change: Partial Meet Contraction and Revision Functions", "href": "https://www.jstor.org/stable/2274239"},
                {"label": "Gärdenfors (1988) — Knowledge in Flux: Modeling the Dynamics of Epistemic States", "href": "https://mitpress.mit.edu/9780262570824/"}
            ]
        ),

        # 5. Multi-Agent Shared Memory Protocols
        build_article(
            slug="multi-agent-shared-memory-protocols",
            category="Foundations",
            reading_minutes=8,
            tags=["multi-agent", "shared-memory", "scope-isolation", "concurrency"],
            en_title="Shared memory protocols and scope isolation for multi-agent fleets",
            en_subtitle="Coordinating concurrent agent writes, working scratchpads, and workspace perimeters",
            en_summary="When fleets of specialized agents collaborate, they require structured protocols to share authoritative discoveries while isolating private working hypotheses.",
            en_short_answer="Multi-agent memory enforces layered scopes (agent-private, workspace-collaborative, tenant-wide) to avoid race conditions and cross-context pollution.",
            en_dilemma_title="The shared scratchpad dilemma",
            en_dilemma_text="If multiple autonomous agents write unverified intermediate thoughts to a shared database, the memory pool quickly degrades into mutual confusion. One agent's speculative hypothesis becomes another agent's confirmed premise.",
            en_warning_title="Concurrency and Race Hazards",
            en_warning_text="Two agents simultaneously reading memory, computing conflicting actions, and writing assertions can cause race conditions that corrupt long-term entity states without transactional isolation.",
            en_table_headers=["Scope Layer", "Access Rule", "Lifecycle Duration", "Intended Use Case"],
            en_table_rows=[
                ["Agent Scratchpad", "Private to single agent instance", "Ephemeral (session/task)", "Drafting intermediate chain-of-thought and scratch work"],
                ["Workspace Perimeter", "Shared across project agent fleet", "Project/Matter duration", "Verified factual findings relevant to a specific team task"],
                ["Tenant Durable Store", "Read-only for tasks; authorized write", "Permanent organizational life", "Corporate policies, approved taxonomies, canonical truth"],
                ["Global Knowledge Base", "Read-only across all tenants", "Immutable", "Official legislation, public documentation, foundational dictionaries"]
            ],
            en_mech_title="Atomic state promotion and scope metadata",
            en_mech_text="Knowledge promotion follows a staged lifecycle: an assertion begins in `scope:agent_private`. Once validated by an evaluator agent or human review, it is promoted to `scope:workspace_shared` via an atomic transaction with full lineage intact.",
            en_code="// Scoped insertion with tenant and workspace isolation\nINSERT INTO assertions (id, subject, predicate, object, tenant_id, workspace_id, agent_id, visibility)\nVALUES ('asrt_55c', 'Matter402', 'discovery_deadline', '2026-11-15', 'corp_alpha', 'ws_litigation', 'agent_researcher', 'WORKSPACE_SHARED');",
            en_mesa_title="Multi-agent isolation in MESA",
            en_mesa_text="MESA Core architecture enforces rigid four-level scope metadata on every memory query. Retrieval routers filter by `(tenant_id, workspace_id, agent_id)` at the database engine level before any vector or graph computation takes place.",
            en_checklist=[
                "Every retrieval query enforces tenant and workspace isolation in SQL.",
                "Agents cannot read outside their authorized workspace perimeter.",
                "Promotion from scratchpad to shared memory requires assertion validation.",
                "Full actor attribution records which agent produced each factual claim."
            ],
            en_refs=[
                {"label": "Wooldridge (2009) — An Introduction to MultiAgent Systems (John Wiley & Sons)", "href": "https://www.wiley.com/en-us/An+Introduction+to+MultiAgent+Systems%2C+2nd+Edition-p-9780470519462"},
                {"label": "MESA Evaluation & Security Gates", "href": "https://mesamemory.dev/evaluation/"}
            ],
            tr_title="Çok ajanlı filolar için ortak hafıza protokolleri ve kapsam izolasyonu",
            tr_subtitle="Eşzamanlı ajan yazmalarının, çalışma karalama defterlerinin ve çalışma alanı sınırlarının koordinasyonu",
            tr_summary="Uzmanlaşmış ajan filoları işbirliği yaptığında, doğrulanmış bulguları paylaşırken özel çalışma hipotezlerini izole eden yapılandırılmış protokollere ihtiyaç duyar.",
            tr_short_answer="Çok ajanlı hafıza; yarış koşullarını ve bağlam kirlenmesini önlemek için katmanlı kapsamlar (ajan-özel, çalışma alanı-ortak, kiracı-genel) uygular.",
            tr_dilemma_title="Ortak karalama defteri çıkmazı",
            tr_dilemma_text="Birden fazla otonom ajan doğrulanmamış ara düşüncelerini ortak bir veritabanına yazarsa, hafıza havuzu hızla karşılıklı kafa karışıklığına dönüşür. Bir ajanın spekülatif tahmini, diğer ajanın kesin dayanağı haline gelir.",
            tr_warning_title="Eşzamanlılık ve Yarış Tehlikesi",
            tr_warning_text="Aynı anda hafızayı okuyan, çelişkili eylemler hesaplayan ve assertion yazan iki ajan, işlemsel izolasyon olmadan varlık durumunu bozan yarış koşullarına (race condition) neden olur.",
            tr_table_headers=["Kapsam Katmanı", "Erişim Kuralı", "Yaşam Süresi", "Kullanım Amacı"],
            tr_table_rows=[
                ["Ajan Özel Alanı", "Yalnızca ilgili ajan okur/yazar", "Geçici (oturum/görev süresince)", "Ara akıl yürütme notları ve taslak çalışmalar"],
                ["Çalışma Alanı (Workspace)", "Görevdeki tüm ajanlar paylaşır", "Proje veya dosya süresince", "Belirli bir ekip görevine dair doğrulanmış bulgular"],
                ["Kiracı (Tenant) Deposu", "Görevler için salt-okunur", "Kalıcı kurumsal yaşam döngüsü", "Şirket politikaları, onaylı taksonomiler, ana olgular"],
                ["Genel Bilgi Tabanı", "Tüm kiracılar için salt-okunur", "Değiştirilemez", "Resmî mevzuat, kamuya açık dokümantasyon, sözlükler"]
            ],
            tr_mech_title="Atomik durum terfisi ve kapsam metaverisi",
            tr_mech_text="Bilginin terfisi aşamalı bir yaşam döngüsünü izler: Bir assertion `scope:agent_private` içinde başlar. Bir denetçi ajan veya insan incelemesiyle doğrulandığında, soykütüğü bozulmadan atomik bir işlemle `scope:workspace_shared` düzeyine yükseltilir.",
            tr_code="// Kiracı ve çalışma alanı izolasyonlu kayıt ekleme\nINSERT INTO assertions (id, subject, predicate, object, tenant_id, workspace_id, agent_id, visibility)\nVALUES ('asrt_55c', 'Dosya402', 'delil_sunma_son_gun', '2026-11-15', 'corp_alfa', 'ws_dava', 'ajan_arastirmaci', 'WORKSPACE_SHARED');",
            tr_mesa_title="MESA'da çok ajanlı izolasyon",
            tr_mesa_text="MESA Core mimarisi her hafıza sorgusunda dört seviyeli katı kapsam metaverisini zorunlu kılar. Retrieval router'ları herhangi bir vektör veya graph taramasından önce veritabanı motorunda `(tenant_id, workspace_id, agent_id)` filtrelemesini çalıştırır.",
            tr_checklist=[
                "Her retrieval sorgusu SQL düzeyinde kiracı ve çalışma alanı izolasyonu uygular.",
                "Ajanlar yetkili çalışma alanı sınırlarının dışındaki kayıtları okuyamaz.",
                "Karalama defterinden ortak hafızaya terfi assertion doğrulaması gerektirir.",
                "Eksiksiz aktör atfı, her olgusal iddiayı hangi ajanın ürettiğini kaydeder."
            ],
            tr_refs=[
                {"label": "Wooldridge (2009) — An Introduction to MultiAgent Systems (John Wiley & Sons)", "href": "https://www.wiley.com/en-us/An+Introduction+to+MultiAgent+Systems%2C+2nd+Edition-p-9780470519462"},
                {"label": "MESA Değerlendirme ve Güvenlik Kapıları", "href": "https://mesamemory.dev/evaluation/"}
            ]
        ),

        # 6. Dense vs Sparse Embeddings
        build_article(
            slug="dense-vs-sparse-embeddings",
            category="Memory & Retrieval",
            reading_minutes=8,
            tags=["dense-embeddings", "sparse-lexical", "vector-search", "bm25"],
            en_title="Dense embeddings vs sparse lexical representations in search",
            en_subtitle="Understanding continuous geometric spaces and discrete inverted token indexes",
            en_summary="Dense embeddings excel at conceptual meaning across vocabulary gaps, while sparse representations capture exact term matches and rare identifiers.",
            en_short_answer="Dense models map meaning into dense float vectors; sparse models map exact tokens into high-dimensional keyword weights. Hybrid pipelines require both.",
            en_dilemma_title="The vocabulary mismatch vs exact identifier paradox",
            en_dilemma_text="Dense vectors compress texts into 768 or 1536 floating point numbers. This compression bridges synonyms but erases exact character sequences, making dense models unreliable for finding unique docket numbers or software error codes.",
            en_warning_title="The Exact Identifier Failure Mode",
            en_warning_text="Querying a dense index for 'Article 314/2' often returns 'Article 314/1' or 'Article 312' with 0.94 cosine similarity, because the dense model represents the legal topic rather than the discrete statutory sub-clause.",
            en_table_headers=["Feature", "Dense Embeddings (e.g. OpenAI, Cohere)", "Sparse Representations (e.g. BM25, SPLADE)"],
            en_table_rows=[
                ["Representation", "Dense fixed-length vector (e.g. 1536 floats)", "High-dimensional sparse vector (vocabulary-sized)"],
                ["Semantic Generalization", "High: captures paraphrases and conceptual affinity", "Low: strictly dependent on token frequency and co-occurrence"],
                ["Rare Token Accuracy", "Low: rare tokens suffer from tokenization compression", "Extremely high: rare words receive highest IDF weights"],
                ["Index Storage Size", "High: requires multi-gigabyte RAM/HNSW graphs", "Compact: inverted lists compressed on disk"],
                ["Domain Transfer", "Prone to out-of-distribution degradation", "Robust: BM25 operates effectively on unseen vocabularies"]
            ],
            en_mech_title="Continuous cosine distance vs BM25 term saturation",
            en_mech_text="Dense search computes cosine similarity between continuous vectors: cos(u, v) = (u . v) / (||u|| ||v||). Sparse search uses BM25 probabilistic relevance: scoring documents based on term frequency (TF) and inverse document frequency (IDF) with length normalization.",
            en_code="// Sparse BM25 Score calculation structure\nScore(D, Q) = Σ IDF(q_i) * [ (f(q_i, D) * (k1 + 1)) / (f(q_i, D) + k1 * (1 - b + b * (|D| / avgdl))) ]",
            en_mesa_title="MESA's dual vector and lexical lanes",
            en_mesa_text="MESA Core does not compromise between dense and sparse. It executes LanceDB dense vector search and SQLite FTS5 BM25 lexical search in parallel, fusing both ranked candidate lists using Reciprocal Rank Fusion (RRF).",
            en_checklist=[
                "Dense vectors retrieve conceptual paraphrases and multilingual matches.",
                "BM25 catches exact law article numbers, party names, and error codes.",
                "Rank fusion eliminates the need to normalize incompatible raw scores.",
                "Pre-filtering restricts both lanes to the authorized tenant partition."
            ],
            en_refs=[
                {"label": "Robertson & Zaragoza (2009) — The Probabilistic Relevance Framework: BM25 and Beyond", "href": "https://www.nowpublishers.com/article/Details/INR-019"},
                {"label": "FormalSPLADE: Sparse Lexical and Expansion Models for Information Retrieval (SIGIR '21)", "href": "https://arxiv.org/abs/2107.05720"}
            ],
            tr_title="Aramada dense embedding'ler ile sparse lexical temsillerin karşılaştırması",
            tr_subtitle="Sürekli geometrik uzaylar ile ayrık ters indeks token ağırlıklarının analizi",
            tr_summary="Dense embedding'ler sözcük dağarcığı farklarını aşarak anlamsal özü yakalamakta mükemmeldir; sparse temsiller ise kesin terim eşleşmelerini ve nadir kodları korur.",
            tr_short_answer="Dense modeller anlamı kesirli sayı vektörlerine eşler; sparse modeller ise kesin anahtar kelimeleri yüksek boyutlu ağırlıklara eşler. Sağlam mimariler her ikisini de birleştirir.",
            tr_dilemma_title="Sözcük uyumsuzluğu ile kesin tanımlayıcı paradoksu",
            tr_dilemma_text="Dense vektörler metinleri 768 veya 1536 kayan noktalı sayıya sıkıştırır. Bu sıkıştırma eş anlamlıları birleştirirken kesin karakter dizilerini siler; bu da dosya numaralarını veya teknik hata kodlarını bulmada dense modelleri yetersiz kılar.",
            tr_warning_title="Kesin Tanımlayıcı Hata Modu",
            tr_warning_text="Dense indekste 'Madde 314/2' arandığında model 'Madde 314/1' veya 'Madde 312' metinlerini 0.94 benzerlikle döndürebilir; çünkü model spesifik fıkrayı değil genel ceza hukuku konusunu temsil eder.",
            tr_table_headers=["Özellik", "Dense Embedding (örn. OpenAI, Cohere)", "Sparse Temsil (örn. BM25, SPLADE)"],
            tr_table_rows=[
                ["Veri Temsili", "Sabit uzunluklu kesirli vektör (örn. 1536 float)", "Sözlük boyutunda seyrek (sparse) vektör"],
                ["Anlamsal Genelleme", "Yüksek: farklı ifadeleri ve kavramsal yakınlığı yakalar", "Düşük: doğrudan terim frekansı ve örtüşmesine bağlıdır"],
                ["Nadir Kod Doğruluğu", "Düşük: nadir token'lar sıkıştırmada bilgi kaybeder", "Çok yüksek: nadir kelimeler en yüksek IDF puanını alır"],
                ["İndeks Depolama Boyutu", "Yüksek: gigabaytlarca RAM ve HNSW grafikleri gerektirir", "Kompakt: diskte sıkıştırılmış ters indeks listeleri"],
                ["Alan Değişimi Direnci", "Eğitim dışı veride performans kaybı riski", "Sağlam: BM25 yeni sözcük dağarcıklarında doğrudan çalışır"]
            ],
            tr_mech_title="Sürekli kosinüs mesafesi ile BM25 terim doygunluğu",
            tr_mech_text="Dense arama sürekli vektörler arasında kosinüs benzerliği hesaplar: cos(u, v) = (u . v) / (||u|| ||v||). Sparse arama ise BM25 olasılıksal alaka modelini uygular: terim frekansı (TF) ve ters belge frekansını (IDF) belge uzunluğu normalizasyonuyla tartar.",
            tr_code="// Sparse BM25 Puan hesaplama yapısı\nPuan(D, Q) = Σ IDF(q_i) * [ (f(q_i, D) * (k1 + 1)) / (f(q_i, D) + k1 * (1 - b + b * (|D| / avgdl))) ]",
            tr_mesa_title="MESA'nın çift vektör ve lexical hattı",
            tr_mesa_text="MESA Core dense ile sparse arasında tercih yapmaz. LanceDB dense vektör araması ile SQLite FTS5 BM25 lexical aramasını eşzamanlı çalıştırır ve iki sıralı listeyi Reciprocal Rank Fusion (RRF) ile birleştirir.",
            tr_checklist=[
                "Dense vektörler kavramsal eş anlamlıları ve çok dilli eşleşmeleri yakalar.",
                "BM25 tam kanun maddelerini, taraf adlarını ve hata kodlarını yakalar.",
                "Rank fusion yöntemi uyumsuz ham skorları normalize etme zorunluluğunu kaldırır.",
                "Ön filtreleme her iki hattı da yalnızca yetkili kiracı bölümünde çalıştırır."
            ],
            tr_refs=[
                {"label": "Robertson & Zaragoza (2009) — The Probabilistic Relevance Framework: BM25 and Beyond", "href": "https://www.nowpublishers.com/article/Details/INR-019"},
                {"label": "FormalSPLADE: Sparse Lexical and Expansion Models for Information Retrieval (SIGIR '21)", "href": "https://arxiv.org/abs/2107.05720"}
            ]
        ),

        # 7. Reranking Strategies for Agent Memory
        build_article(
            slug="reranking-strategies-for-agent-memory",
            category="Memory & Retrieval",
            reading_minutes=8,
            tags=["reranking", "cross-encoder", "retrieval", "precision"],
            en_title="Cross-encoder reranking and second-stage scoring in memory systems",
            en_subtitle="Refining candidate recall with full cross-attention transformer models",
            en_summary="First-stage retrieval rapidly gathers candidate passages, while second-stage cross-encoder rerankers perform deep query-document cross-attention to eliminate false positives.",
            en_short_answer="Bi-encoders prioritize search speed across millions of items; cross-encoders prioritize precision by analyzing full token interactions over the top 50 candidates.",
            en_dilemma_title="The bi-encoder independence limitation",
            en_dilemma_text="First-stage retrievers (bi-encoders and BM25) process queries and documents independently. Because query tokens cannot attend to document tokens during indexing, bi-encoders miss subtle logical relationships such as negation or conditional statements.",
            en_warning_title="The Top-K Pollution Risk",
            en_warning_text="Feeding unranked top-20 candidates directly into an agent's context window consumes precious token budget and injects distractors that confuse model reasoning.",
            en_table_headers=["Stage", "Model Architecture", "Latency per Query", "Scoring Mechanism"],
            en_table_rows=[
                ["First-Stage Retrieval", "Bi-Encoder (HNSW) + BM25", "< 5 ms across 1,000,000 items", "Dot product / Cosine distance between pre-computed vectors"],
                ["Second-Stage Reranking", "Cross-Encoder (Full Transformer)", "20-80 ms over top 50 candidates", "Joint cross-attention over concatenated (Query, Document) tokens"],
                ["Third-Stage Verification", "Deterministic Assertion Logic", "< 1 ms over top 10 items", "Schema filter, evidence verification, temporal validity check"]
            ],
            en_mech_title="Cross-attention vs dot product representations",
            en_mech_text="In a cross-encoder, the query and document are concatenated into a single sequence: `[CLS] Query [SEP] Document [SEP]`. Every transformer layer allows every query token to attend directly to every document token, capturing nuanced nuances like 'except', 'unless', and 'not'.",
            en_code="// Cross-encoder invocation schema\nInput = '[CLS] Does Alice have power of attorney? [SEP] Alice was granted limited power of attorney, excluding real estate transactions. [SEP]'\nOutput Logits = [0.12 (irrelevant), 0.88 (relevant)]",
            en_mesa_title="MESA's multi-stage retrieval pipeline",
            en_mesa_text="In MESA Core, hybrid first-stage retrieval surfaces candidates from vector, BM25, and graph lanes. Candidates are fused via RRF, reranked for precision, and passed through deterministic profile gates before prompt injection.",
            en_checklist=[
                "First-stage gathers broad candidate recall across complementary lanes.",
                "Cross-encoder reranking eliminates lexical distractors and semantic near-misses.",
                "Reranked results retain immutable pointers to canonical evidence spans.",
                "Strict latency budgets ensure reranking does not breach interactive SLAs."
            ],
            en_refs=[
                {"label": "Nogueira & Cho (2019) — Passage Re-ranking with BERT", "href": "https://arxiv.org/abs/1901.04085"},
                {"label": "Thakur et al. (2021) — BEIR: A Heterogeneous Benchmark for Zero-shot Evaluation of Information Retrieval Models (NeurIPS)", "href": "https://arxiv.org/abs/2104.08663"}
            ],
            tr_title="Hafıza sistemlerinde cross-encoder reranking ve ikinci aşama puanlaması",
            tr_subtitle="Tam cross-attention modelleriyle aday geri getirme hassasiyetinin artırılması",
            tr_summary="İlk aşama retrieval adayları hızla toplarken, ikinci aşama cross-encoder modelleri sorgu ile belge arasında derin çapraz dikkat kurarak hatalı eşleşmeleri eler.",
            tr_short_answer="Bi-encoder'lar milyonlarca kayıt üzerinde hız sağlar; cross-encoder'lar ise ilk 50 aday üzerinde token etkileşimlerini inceleyerek kesinlik sağlar.",
            tr_dilemma_title="Bi-encoder bağımsızlık sınırlaması",
            tr_dilemma_text="İlk aşama arama motorları (bi-encoder ve BM25) sorgu ve belgeleri birbirinden bağımsız işler. İndeksleme sırasında sorgu kelimeleri belge kelimeleriyle etkileşime giremediğinden olumsuzluk veya şart ekleri gibi kritik anlamları kaçırabilirler.",
            tr_warning_title="İlk-K Kirlenme Riski",
            tr_warning_text="İlk aşamadan gelen ham 20 sonucu doğrudan ajanın bağlamına beslemek, değerli token bütçesini tüketir ve ajanın muhakemesini bozan yanıltıcı parçalar ekler.",
            tr_table_headers=["Aşama", "Model Mimarisi", "Sorgu Başına Gecikme", "Puanlama Mekanizması"],
            tr_table_rows=[
                ["İlk Aşama Retrieval", "Bi-Encoder (HNSW) + BM25", "1.000.000 kayıtta < 5 ms", "Önceden hesaplanmış vektörler arasında nokta çarpımı"],
                ["İkinci Aşama Reranking", "Cross-Encoder (Tam Transformer)", "İlk 50 adayda 20-80 ms", "Birleştirilmiş (Sorgu, Belge) token'ları üzerinde çapraz dikkat"],
                ["Üçüncü Aşama Doğrulama", "Deterministik Assertion Mantığı", "İlk 10 adayda < 1 ms", "Şema filtreleme, kanıt doğrulaması ve zaman kontrolü"]
            ],
            tr_mech_title="Çapraz dikkat (cross-attention) ile nokta çarpımı farkı",
            tr_mech_text="Cross-encoder mimarisinde sorgu ve belge tek bir dizide birleştirilir: `[CLS] Sorgu [SEP] Belge [SEP]`. Tüm transformer katmanları sorgudaki her kelimenin belgedeki her kelimeyle doğrudan etkileşime girmesini sağlar; 'hariç', 'koşuluyla' gibi nüanslar tam yakalanır.",
            tr_code="// Cross-encoder çalıştırma yapısı\nGirdi = '[CLS] Ahmet''in vekalet yetkisi var mı? [SEP] Ahmet''e taşınmaz satışları hariç olmak üzere sınırlı vekalet verilmiştir. [SEP]'\nÇıktı Olasılığı = [0.12 (ilgisiz), 0.88 (ilgili)]",
            tr_mesa_title="MESA'nın çok aşamalı retrieval hattı",
            tr_mesa_text="MESA Core içinde ilk aşama retrieval; vektör, BM25 ve graph hatlarından geniş bir aday havuzu toplar. Adaylar RRF ile birleştirilir, hassasiyet için rerank edilir ve prompt'a girmeden önce deterministik kontrol kapılarından geçer.",
            tr_checklist=[
                "İlk aşama tamamlayıcı hatlar üzerinden geniş recall sağlar.",
                "Cross-encoder reranking yüzeysel eşleşmeleri ve yanıltıcı parçaları ayıklar.",
                "Rerank edilen sonuçlar kanonik kanıt aralıklarına olan değiştirilemez işaretçilerini korur.",
                "Katı gecikme bütçeleri reranking işleminin sistem yanıt süresini aşmamasını garanti eder."
            ],
            tr_refs=[
                {"label": "Nogueira & Cho (2019) — Passage Re-ranking with BERT", "href": "https://arxiv.org/abs/1901.04085"},
                {"label": "Thakur vd. (2021) — BEIR: A Heterogeneous Benchmark for Zero-shot Evaluation of Information Retrieval Models (NeurIPS)", "href": "https://arxiv.org/abs/2104.08663"}
            ]
        ),

        # 8. Audit Logging in Production AI
        build_article(
            slug="audit-logging-in-production-ai",
            category="Evidence & Trust",
            reading_minutes=7,
            tags=["audit-logging", "compliance", "tamper-evident", "evidence"],
            en_title="Immutable audit logs and compliance verification in AI workflows",
            en_subtitle="Designing append-only cryptographically chained event records for enterprise AI",
            en_summary="Autonomous agents operating in regulated industries require immutable audit trails that record every prompt, memory retrieval, model output, and database mutation.",
            en_short_answer="Audit logging in AI requires append-only hash chains that prove what memory assertions an agent observed before executing an autonomous decision.",
            en_dilemma_title="The black-box accountability crisis",
            en_dilemma_text="When an AI system commits a financial transaction or issues legal advice, standard application logs merely record that an HTTP request completed. They fail to capture the internal epistemic state: what facts the agent remembered, which evidence was retrieved, and what prompt instructions guided the decision.",
            en_warning_title="The Tamper Vulnerability",
            en_warning_text="Traditional database log tables can be modified or deleted by rogue administrators or compromised processes. Compliance audits in regulated domains mandate mathematically verifiable tamper-evidence.",
            en_table_headers=["Audit Component", "Required Data", "Storage Pattern", "Compliance Objective"],
            en_table_rows=[
                ["Retrieval Event", "Query, tenant_id, returned assertion_ids, RRF scores", "Append-only event stream", "Proves which facts the agent was exposed to"],
                ["Prompt Snapshot", "Exact system prompt, user turn, formatted context context", "Content-addressed SHA-256 storage", "Guarantees reproducible replay of model input"],
                ["Model Generation", "Model ID, temperature, seed, raw output token stream", "Immutable JSONL ledger", "Eliminates disputes over whether output was altered"],
                ["State Mutation", "Before-state, after-state, actor_id, transaction hash", "Cryptographically chained audit table", "Guarantees complete traceability for legal audits"]
            ],
            en_mech_title="Cryptographic hash chaining in audit ledgers",
            en_mech_text="Every audit event record contains a cryptographic hash of its payload combined with the hash of the preceding record: `H_i = SHA-256(Record_i || H_{i-1})`. Any retroactive modification to a historical event invalidates all downstream hash links.",
            en_code="// Cryptographically chained audit event schema\nCREATE TABLE audit_events (\n    id BIGSERIAL PRIMARY KEY,\n    prev_hash TEXT NOT NULL,\n    event_type TEXT NOT NULL,\n    payload JSONB NOT NULL,\n    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    record_hash TEXT NOT NULL\n);",
            en_mesa_title="Audit verification in MESA",
            en_mesa_text="MESA Core records every retrieval cycle and assertion lifecycle change in its canonical audit schema. Profile B security certification verifies that audit logs are tamper-evident and fail closed under unauthorized mutation attempts.",
            en_checklist=[
                "Every memory query emits an immutable audit event with retrieved assertion IDs.",
                "Audit logs include tenant, workspace, agent, and temporal boundaries.",
                "Hash chaining ensures historical logs cannot be secretly altered.",
                "Auditors can verify full end-to-end provenance traces without granting production database access."
            ],
            en_refs=[
                {"label": "Haber & Stornetta (1991) — How to Time-Stamp a Digital Document (Journal of Cryptology)", "href": "https://link.springer.com/article/10.1007/BF00196791"},
                {"label": "ISO/IEC 27001 — Information Security Management Systems", "href": "https://www.iso.org/standard/27001"}
            ],
            tr_title="Yapay zekâ iş akışlarında değiştirilemez denetim günlükleri ve uyumluluk doğrulaması",
            tr_subtitle="Kurumsal yapay zekâ için yalnızca eklemeli ve kriptografik zincirli olay kayıtlarının tasarımı",
            tr_summary="Düzenlemeye tabi sektörlerde çalışan otonom ajanlar; her promptu, hafıza sorgusunu, model çıktısını ve veritabanı değişikliğini kaydeden değiştirilemez denetim izleri gerektirir.",
            tr_short_answer="Yapay zekâda denetim günlüğü tutmak, bir ajanın otonom karar almadan önce hangi iddiaları ve kanıtları gördüğünü kanıtlayan hash zincirleri gerektirir.",
            tr_dilemma_title="Kara kutu hesap verebilirlik krizi",
            tr_dilemma_text="Bir yapay zekâ finansal işlem yaptığında veya hukuki değerlendirme sunduğunda standart sunucu günlükleri yalnızca HTTP isteğinin bittiğini kaydeder. Ajanın o an neyi hatırladığını, hangi kanıtları okuduğunu ve hangi prompt talimatlarıyla yönlendirildiğini açıklayamaz.",
            tr_warning_title="Tahrifat Açığı",
            tr_warning_text="Geleneksel veritabanı log tabloları yetkili kullanıcılar veya sızan yazılımlar tarafından sonradan değiştirilebilir veya silinebilir. Regülasyona tabi alanlarda denetimler matematiksel olarak kanıtlanabilir tahrifat koruması zorunlu kılar.",
            tr_table_headers=["Denetim Bileşeni", "Gerekli Veri", "Depolama Modeli", "Uyumluluk Hedefi"],
            tr_table_rows=[
                ["Retrieval Olayı", "Sorgu, tenant_id, dönen assertion_id'leri, RRF puanları", "Yalnızca eklemeli (append-only) akış", "Ajanın hangi olgulara maruz kaldığını kanıtlar"],
                ["Prompt Anlık Görüntüsü", "Tam sistem promptu, kullanıcı girdisi, formatlanmış bağlam", "İçerik adresli SHA-256 depolama", "Model girdisinin birebir yeniden üretilmesini sağlar"],
                ["Model Üretimi", "Model kimliği, sıcaklık, seed, ham token akışı", "Değiştirilemez JSONL defteri", "Çıktının sonradan değiştirilmediğini ispatlar"],
                ["Durum Değişikliği", "Önceki durum, sonraki durum, aktör kimliği, işlem hash'i", "Kriptografik zincirli denetim tablosu", "Hukuki denetimler için tam izlenebilirlik sunar"]
            ],
            tr_mech_title="Denetim defterlerinde kriptografik hash zinciri",
            tr_mech_text="Her denetim kaydı kendi içeriğinin hash'i ile bir önceki kaydın hash'ini birleştirir: `H_i = SHA-256(Kayit_i || H_{i-1})`. Geçmişteki herhangi bir kayıtta yapılan en küçük tahrifat, sonraki tüm zincir hash'lerini geçersiz kılar.",
            tr_code="// Kriptografik zincirli denetim tablosu şeması\nCREATE TABLE audit_events (\n    id BIGSERIAL PRIMARY KEY,\n    prev_hash TEXT NOT NULL,\n    event_type TEXT NOT NULL,\n    payload JSONB NOT NULL,\n    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,\n    record_hash TEXT NOT NULL\n);",
            tr_mesa_title="MESA'da denetim doğrulaması",
            tr_mesa_text="MESA Core her retrieval döngüsünü ve assertion durum değişikliğini kanonik denetim şemasında kaydeder. Profile B güvenlik sertifikasyonu, denetim günlüklerinin tahrifata karşı dayanıklı olduğunu ve izinsiz müdahalelerde güvenli kapandığını doğrular.",
            tr_checklist=[
                "Her hafıza sorgusu, getirilen assertion kimlikleriyle birlikte değiştirilemez bir denetim kaydı üretir.",
                "Denetim günlükleri kiracı, çalışma alanı, ajan ve zaman sınırlarını içerir.",
                "Hash zinciri geçmiş günlüklerin gizlice değiştirilemeyeceğini garanti eder.",
                "Denetçiler üretim veritabanına erişmeden uçtan uca provenance izlerini doğrulayabilir."
            ],
            tr_refs=[
                {"label": "Haber & Stornetta (1991) — How to Time-Stamp a Digital Document (Journal of Cryptology)", "href": "https://link.springer.com/article/10.1007/BF00196791"},
                {"label": "ISO/IEC 27001 — Information Security Management Systems", "href": "https://www.iso.org/standard/27001"}
            ]
        ),

        # 9. Cryptographic Evidence Spans
        build_article(
            slug="cryptographic-evidence-spans",
            category="Evidence & Trust",
            reading_minutes=8,
            tags=["content-addressing", "sha256", "evidence-spans", "integrity"],
            en_title="Content-addressed storage and cryptographic evidence spans",
            en_subtitle="Binding factual memory assertions to immutable document byte offsets",
            en_summary="Evidence-aware AI memory binds every factual proposition to content-addressed document hashes and exact byte spans, making factual citations verifiable and tamper-evident.",
            en_short_answer="Cryptographic evidence spans tie assertions to exact character ranges in SHA-256 hashed source documents, preventing phantom citations.",
            en_dilemma_title="The detached citation vulnerability",
            en_dilemma_text="Standard conversational systems cite file names or URLs that change over time: 'See contract_v2.pdf'. If the file is modified on disk or the web page updates, the citation becomes detached from the actual text the model observed.",
            en_warning_title="The Shifting Ground Truth Hazard",
            en_warning_text="In regulated legal or medical workflows, claiming an answer was derived from a document whose contents have shifted makes independent retrospective audit impossible.",
            en_table_headers=["Binding Method", "Integrity Level", "Granularity", "Audit Verification"],
            en_table_rows=[
                ["URL Pointer", "Low: URL contents can mutate without notice", "Entire web page / document", "Manual human web browsing"],
                ["File Path", "Low: files can be overwritten on disk", "Entire document file", "Fragile: depends on file system stability"],
                ["Document Hash (SHA-256)", "High: document content is cryptographically immutable", "Entire document", "Verifiable by hashing original file"],
                ["Content Hash + Byte Span", "Highest: anchors exact character offset [start..end]", "Exact sentence or paragraph span", "Deterministic mathematical verification"]
            ],
            en_mech_title="Character offset anchoring and verification mathematics",
            en_mech_text="An evidence span record anchors a factual proposition to an exact byte interval: `doc_sha256:span[c_start, c_end]`. During an audit, an automated checker fetches the original document by its hash, slices the bytes at `[c_start..c_end]`, and verifies that the text matches the recorded evidence quote.",
            en_code="// Content-addressed evidence span record\n{\n  \"document_hash\": \"a3f892bc...33e1\",\n  \"char_start\": 4520,\n  \"char_end\": 4780,\n  \"quoted_text\": \"The governing law of this agreement shall be the laws of the Republic of Turkey.\",\n  \"verified_at\": \"2026-10-17T00:00:00Z\"\n}",
            en_mesa_title="Evidence spans in MESA architecture",
            en_mesa_text="In MESA Data and Core, raw official legal texts are preserved as immutable byte bedrock. Every assertion in SQLite maps to a verified evidence span. Frontends highlight the exact authoritative text in the official gazette when users inspect a claim.",
            en_checklist=[
                "Source documents are indexed by SHA-256 content hashes.",
                "Evidence spans record exact unicode character offsets [start..end].",
                "Automated CI pipelines verify that evidence spans match raw source text.",
                "No assertion can be admitted to memory without an anchored evidence span."
            ],
            en_refs=[
                {"label": "W3C PROV-DM: The PROV Data Model (2013)", "href": "https://www.w3.org/TR/prov-dm/"},
                {"label": "MESA Data Ground Truth and Ingestion Specification", "href": "https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md"}
            ],
            tr_title="İçerik adresli depolama ve kriptografik kanıt aralıkları",
            tr_subtitle="Olgusal hafıza iddialarını değiştirilemez belge bayt ofsetlerine bağlama",
            tr_summary="Kanıt odaklı yapay zekâ hafızası her olgusal iddiayı içerik adresli belge hash'lerine ve kesin bayt aralıklarına bağlayarak atıfları doğrulanabilir ve tahrifata dayanıklı kılar.",
            tr_short_answer="Kriptografik kanıt aralıkları, iddiaları SHA-256 ile özetlenmiş kaynak belgelerdeki tam karakter aralıklarına bağlayarak hayali atıfları engeller.",
            tr_dilemma_title="Kopuk atıf açığı",
            tr_dilemma_text="Standart yapay zekâ sistemleri zamanla değişebilen dosya adlarına veya URL'lere atıf yapar: 'Bkz. sozlesme_v2.pdf'. Dosya diskte güncellenirse veya web sayfası değişirse, atıf modelin o an okuduğu metinden tamamen kopar.",
            tr_warning_title="Kayan Bilgi Kaynağı Tehlikesi",
            tr_warning_text="Hukuki veya tıbbi iş akışlarında, içeriği sonradan değişmiş bir belgeye dayanılarak cevap verildiğini iddia etmek bağımsız geriye dönük denetimi imkânsız kılar.",
            tr_table_headers=["Bağlama Yöntemi", "Bütünlük Düzeyi", "Granülerlik", "Denetim Doğrulaması"],
            tr_table_rows=[
                ["URL İşaretçisi", "Düşük: URL içeriği haber vermeden değişebilir", "Tüm web sayfası / belge", "Manuel insan web araması"],
                ["Dosya Yolu", "Düşük: dosyaların üzerine diskte yazılabilir", "Tüm belge dosyası", "Kırılgan: dosya sistemi kararlılığına bağlıdır"],
                ["Belge Hash'i (SHA-256)", "Yüksek: belge içeriği kriptografik olarak sabittir", "Tüm belge", "Orijinal dosyayı hash'leyerek doğrulanabilir"],
                ["İçerik Hash'i + Bayt Aralığı", "En yüksek: kesin karakter aralığını sabitler [başlangıç..bitiş]", "Kesin cümle veya paragraf aralığı", "Deterministik matematiksel doğrulama"]
            ],
            tr_mech_title="Karakter ofseti sabitleme ve doğrulama matematiği",
            tr_mech_text="Bir kanıt aralığı kaydı, olgusal bir iddiayı kesin bir bayt aralığına kilitler: `belge_sha256:span[c_başlangıç, c_bitiş]`. Denetim sırasında otomatik bir test aracı orijinal belgeyi hash'iyle çeker, `[c_başlangıç..c_bitiş]` aralığındaki baytları keser ve kaydedilen alıntıyla birebir eşleştiğini doğrular.",
            tr_code="// İçerik adresli kanıt aralığı kaydı\n{\n  \"belge_hash\": \"a3f892bc...33e1\",\n  \"karakter_baslangic\": 4520,\n  \"karakter_bitis\": 4780,\n  \"alintilanan_metin\": \"İşbu sözleşmenin uygulanmasında Türkiye Cumhuriyeti kanunları geçerlidir.\",\n  \"dogrulama_tarihi\": \"2026-10-17T00:00:00Z\"\n}",
            tr_mesa_title="MESA mimarisinde kanıt aralıkları",
            tr_mesa_text="MESA Data ve Core içinde resmî hukuk metinleri değiştirilemez bayt temeli olarak saklanır. SQLite'taki her assertion doğrulanmış bir kanıt aralığına bağlanır. Kullanıcı bir iddiayı tıkladığında arayüz Resmî Gazete'deki orijinal kanıt metnini anında vurgular.",
            tr_checklist=[
                "Kaynak belgeler SHA-256 içerik hash'leriyle indekslenir.",
                "Kanıt aralıkları kesin unicode karakter ofsetlerini [başlangıç..bitiş] kaydeder.",
                "Otomatik CI boru hatları kanıt aralıklarının ham metinle eşleştiğini doğrular.",
                "Hiçbir assertion kanıt aralığına bağlanmadan hafızaya kabul edilemez."
            ],
            tr_refs=[
                {"label": "W3C PROV-DM: The PROV Data Model (2013)", "href": "https://www.w3.org/TR/prov-dm/"},
                {"label": "MESA Data Ground Truth ve Ingestion Spesifikasyonu", "href": "https://github.com/Yasou13/MESA/blob/main/docs/architecture-v4.md"}
            ]
        ),

        # 10. Hallucination Mitigation via Evidence Chains
        build_article(
            slug="hallucination-mitigation-via-evidence",
            category="Evidence & Trust",
            reading_minutes=8,
            tags=["hallucination-mitigation", "grounding", "evidence", "entailment"],
            en_title="Mitigating LLM hallucinations through grounded evidence chains",
            en_subtitle="Pre-generation retrieval bounds and post-generation entailment verification",
            en_summary="Eliminating hallucinations requires a dual-stage architecture: restricting model generation strictly to retrieved evidence spans and verifying natural language entailment before delivery.",
            en_short_answer="Hallucination mitigation enforces strict grounding constraints: models must cite verifiable evidence spans and pass automated entailment checks.",
            en_dilemma_title="The parametric confabulation dilemma",
            en_dilemma_text="Large language models are probabilistic text generators trained to predict plausible next tokens. In the absence of strict grounding boundaries, they fill factual gaps by generating statistically plausible fiction with high synthetic confidence.",
            en_warning_title="The Fluent Hallucination Danger",
            en_warning_text="The most dangerous hallucinations are not bizarre gibberish, but highly articulate, well-structured assertions that sound completely authoritative while being factually untrue.",
            en_table_headers=["Defense Layer", "Technique", "Mechanism", "Hallucination Reduction"],
            en_table_rows=[
                ["Prompt Guardrails", "Negative constraints ('Answer only using facts below')", "System prompt instruction", "Moderate: models still leak parametric priors"],
                ["Evidence Scoping", "Strict context injection of verified assertions only", "Multi-lane hybrid retrieval pre-filtering", "High: eliminates out-of-context retrieval"],
                ["Citation Enforcing", "Model must output explicit assertion keys for claims", "Constrained decoding / JSON grammar", "Very High: binds statements to IDs"],
                ["Post-Generation Entailment", "NLI model checks whether Premise entails Hypothesis", "Automated NLI classification (Entailment/Contradiction)", "Highest: blocks ungrounded output before user delivery"]
            ],
            en_mech_title="Natural language inference (NLI) entailment scoring",
            en_mech_text="Before a generated response is displayed to the user, an independent verification worker breaks the response into atomic propositions and runs an NLI classifier: `NLI(Evidence_Span, Generated_Proposition) -> {ENTAILMENT, NEUTRAL, CONTRADICTION}`. If any proposition scores NEUTRAL or CONTRADICTION, the response is rejected or flagged.",
            en_code="// Automated entailment verification check\nFor each sentence in Model_Response:\n    Proposition = ExtractClaim(sentence)\n    Evidence = FetchCanonicalSpan(Proposition.citation_id)\n    Score = NLI_Model.predict(premise=Evidence, hypothesis=Proposition)\n    Assert Score.entailment > 0.90, 'Ungrounded claim detected!'",
            en_mesa_title="MESA's zero-trust generation protocol",
            en_mesa_text="MESA adheres to a zero-trust grounding paradigm. The system never relies on an LLM's self-reported accuracy. Every response is generated from canonical SQLite assertions and verified against immutable evidence spans.",
            en_checklist=[
                "Prompt context contains only verified, scope-validated assertions.",
                "Generated claims must cite specific assertion identifiers.",
                "Post-generation guardrails verify premise entailment before presentation.",
                "Unverified claims fail closed and trigger explicit user notifications."
            ],
            en_refs=[
                {"label": "Maynez et al. (2020) — On Faithfulness and Factuality in Abstractive Summarization (ACL)", "href": "https://arxiv.org/abs/2005.00661"},
                {"label": "Gao et al. (2023) — RAG vs Fine-tuning: Pipelines, Tradeoffs, and Metrics", "href": "https://arxiv.org/abs/2312.10997"}
            ],
            tr_title="Temellendirilmiş kanıt zincirleriyle LLM halüsinasyonlarını önleme",
            tr_subtitle="Üretim öncesi retrieval sınırları ve üretim sonrası entailment doğrulama mimarisi",
            tr_summary="Halüsinasyonları önlemek çift aşamalı bir mimari gerektirir: model üretimini doğrulanmış kanıt aralıklarıyla sınırlamak ve kullanıcıya sunmadan önce doğal dil çıkarımını (entailment) doğrulamak.",
            tr_short_answer="Halüsinasyon engelleme, katı temellendirme kuralları uygular: modeller doğrulanabilir kanıt aralıklarına atıf yapmalı ve otomatik entailment testlerinden geçmelidir.",
            tr_dilemma_title="Parametrik kurgulama çıkmazı",
            tr_dilemma_text="Büyük dil modelleri bir sonraki en olası kelimeyi tahmin etmek üzere eğitilmiş olasılıksal sistemlerdir. Katı temellendirme sınırları olmadığında olgusal boşlukları istatistiksel olarak makul görünen uydurmalarla doldururlar.",
            tr_warning_title="Akıcı Halüsinasyon Tehlikesi",
            tr_warning_text="En tehlikeli halüsinasyonlar anlamsız saçmalıklar değil; son derece akıcı, iyi yapılandırılmış, yetkili bir dille yazılmış ancak tamamen gerçek dışı olan iddialardır.",
            tr_table_headers=["Savunma Katmanı", "Teknik", "Mekanizma", "Halüsinasyon Azaltma"],
            tr_table_rows=[
                ["Prompt Koruması", "Negatif kısıtlar ('Yalnızca aşağıdaki metne göre yanıtla')", "Sistem prompt talimatı", "Orta: modeller yine de parametrik bilgilerini sızdırabilir"],
                ["Kanıt Kapsamı", "Yalnızca doğrulanmış assertion'ları bağlama ekleme", "Çok hatlı hybrid retrieval ön filtrelemesi", "Yüksek: bağlam dışı alakasız veriyi eler"],
                ["Atıf Zorunluluğu", "Modelin her iddiada açık assertion ID vermesi", "Kısıtlı kod çözme / JSON grameri", "Çok yüksek: iddiaları somut kimliklere bağlar"],
                ["Üretim Sonrası Entailment", "NLI modelinin öncülün sonucu gerektirdiğini denetlemesi", "Otomatik NLI sınıflandırması (Gerektirme/Çelişki)", "En yüksek: temellendirilmemiş cevabı kullanıcıya gitmeden engeller"]
            ],
            tr_mech_title="Doğal dil çıkarımı (NLI) entailment puanlaması",
            tr_mech_text="Üretilen cevap kullanıcıya gösterilmeden önce bağımsız bir doğrulayıcı servisi cevabı atomik iddialara böler ve bir NLI sınıflandırıcısı çalıştırır: `NLI(Kanıt_Aralığı, Üretilen_İddia) -> {GEREKTİRME, NÖTR, ÇELİŞKİ}`. Herhangi bir iddia NÖTR veya ÇELİŞKİ alırsa cevap reddedilir veya uyarı eklenir.",
            tr_code="// Otomatik entailment doğrulama kontrolü\nCevaptaki her cümle için:\n    Iddia = IdidyiCikar(cumle)\n    Kanit = KanonikAraligiGetir(Iddia.atif_id)\n    Skor = NLI_Modeli.tahmin_et(oncul=Kanit, hipotez=Iddia)\n    Dogrula Skor.gerektirme > 0.90, 'Temellendirilmemis iddia tespit edildi!'",
            tr_mesa_title="MESA'nın sıfır güvenli üretim protokolü",
            tr_mesa_text="MESA sıfır güvene dayalı temellendirme paradigmasını benimser. Sistem asla bir dil modelinin kendi doğruluğuna ilişkin beyanına güvenmez. Her cevap kanonik SQLite assertion'larından üretilir ve değiştirilemez kanıt aralıklarıyla doğrulanır.",
            tr_checklist=[
                "Prompt bağlamı yalnızca doğrulanmış ve kapsamı denetlenmiş assertion'ları içerir.",
                "Üretilen iddiaların belirli assertion tanımlayıcılarına atıf yapması zorunludur.",
                "Üretim sonrası güvenlik kapıları kullanıcıya sunulmadan önce çıkarımı doğrular.",
                "Doğrulanamayan iddialar hata durumunda kapanır ve açık kullanıcı uyarısı üretir."
            ],
            tr_refs=[
                {"label": "Maynez vd. (2020) — On Faithfulness and Factuality in Abstractive Summarization (ACL)", "href": "https://arxiv.org/abs/2005.00661"},
                {"label": "Gao vd. (2023) — RAG vs Fine-tuning: Pipelines, Tradeoffs, and Metrics", "href": "https://arxiv.org/abs/2312.10997"}
            ]
        ),
    ]
