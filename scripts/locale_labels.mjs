// Display names only. Search keys, routes and stored tag identifiers remain stable.
const trTags = {
 assertion:'bilgi kaydı', authorization:'yetkilendirme', benchmark:'karşılaştırmalı test',
 cache:'önbellek', 'candidate recall':'ilgili adayları bulma', chunk:'metin parçası',chunking:'parçalama',
 citation:'atıf','context budget':'bağlam bütçesi','context window':'bağlam penceresi',
 contradiction:'çelişki',cosine:'kosinüs','cross encoder':'birlikte kodlama',decay:'zamanla azalan ağırlık',
 dense:'yoğun temsil',embedding:'sayısal temsil',entity:'varlık',evaluation:'değerlendirme',evidence:'kanıt',
 graph:'çizge',hash:'içerik özeti',hybrid:'hibrit',idempotency:'güvenli tekrar','knowledge graph':'bilgi çizgesi',
 lab:'uygulama','legal-research':'hukuki araştırma',latency:'gecikme',lexical:'sözcük tabanlı',memory:'hafıza',
 methodology:'yöntem','multi agent':'çoklu ajan','multi hop':'çok adımlı arama',outbox:'gönderim kuyruğu',
 precision:'isabet oranı',projection:'arama görünümü',projeksiyon:'arama görünümü','prompt injection':'istem enjeksiyonu',
 provenance:'kaynak izi','rank fusion':'sıralama birleştirme',recall:'yakalama oranı',reranking:'yeniden sıralama',
 retrieval:'arama',schema:'şema',scope:'erişim kapsamı','semantic-search':'anlamsal arama',session:'oturum',
 sparse:'seyrek temsil',temporal:'zamana bağlı bilgi',tenant:'üst erişim alanı',tokenization:'tokenlara ayırma',
 tutorial:'uygulamalı rehber',validity:'geçerlilik',vector:'vektör',verification:'doğrulama',version:'sürüm',weighted:'ağırlıklı'
};
export const tagLabel = (tag, language) => language === 'tr' ? trTags[tag] || tag : tag;
