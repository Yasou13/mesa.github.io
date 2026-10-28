## Kaynaklarını koruyan hafıza

MESA Core, özgün belge metnini belge, sürüm ve pasaj kimlikleriyle saklar. HTTP, Python SDK ve MCP üzerinden yetki kapsamındaki kanıtları ve boyutu sınırlı bağlamı getirir. Yanıtı uygulamanızın modeli yazar.

## İlk iş akışınızı seçin

[Yerel hızlı başlangıcı](docs/core/getting-started/) izleyin: `mesa-memory[adapters]==0.9.0` kurun, `mesa start` çalıştırın; ardından `mesa add` ve `mesa search` kullanın. BM25 sözcük araması için model gerekmez. `Mesa()` yerel kimlik bilgilerini otomatik okur; `mesa mcp-config` MCP bağlantısını hazırlar. Bilgi çıkarımı ve anlamsal arama için modelleri açın; gerektiğinde `MESA_GRAPH_ENABLED=false` ile Kùzu’yu kapatın.

## Sürüm ve yeterlilik

Rehberler, 28 Ekim 2026’da `7062faf` commit’iyle yayımlanan v0.9.0 sürümünü izler. Bu sürüm tam belge alımı, yerel CLI ve SDK varsayılanları, isteğe bağlı çizge ve geliştirilmiş yeniden deneme/silme davranışını getirir. GitHub ve PyPI yayını üretim yeterliliği anlamına gelmez: gerekli sağlayıcı, kurtarma, dayanıklılık ve sertifikasyon kanıtları tamamlanana kadar NO-GO geçerlidir.
