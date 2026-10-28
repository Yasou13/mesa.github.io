## İki bağlantı seçeneğini ayırın

Doğrudan V4 stdio sunucusu ile HTTP geçidi ve yerel köprü farklı biçimde çalışır. Belirli veri kümeleriyle sınırlı köprü, sunucunun verdiği erişim kapsamını korur; tüm sistemi değiştiren yeniden oluşturma işlemini açmaz. Bir aracın kullanılabilir olması, sistemin yetenek bildirimine bağlıdır. MCP kullanmak kimlik doğrulamayı atlamaz veya desteklenmeyen çizge aramasını etkinleştirmez.

## Ayrıntılara geçin

Tam bağlantı kuralları aşağıdaki özgün kaynakta bulunur. Ayrıca [mimariyi](architecture/), [API’yi](docs/core/api-reference/), [işletim koşullarını](docs/core/operations/) ve [sürümün sınırlarını](docs/core/limitations/) okuyun.

## v0.9.0 ile çalışma

Doğrudan V4 stdio, MCP istemcisinin araç onaylarını ve API anahtarının yetkilerini kullanır; gateway onay/denetimi ayrı bir bağlantıdır. Önce `mesa start`, sonra `mesa mcp-config` çalıştırın; üretilen yapılandırmayı özel tutun.
