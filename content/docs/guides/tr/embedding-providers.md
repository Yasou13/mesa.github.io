## Desteklenen sağlayıcılar

| Görev | Sağlayıcı değeri | Örnek model | Boyut | Kurulum eki |
| --- | --- | --- | --- | --- |
| Embedding · yerel (varsayılan) | sentence-transformers | Magibu, normalize | 768 | `ml` |
| Embedding · harici | `openai_compatible` | `text-embedding-3-small` | 1536 | `adapters` |
| Embedding · Nemotron-3 profili | `openai_compatible` | Nemotron-3, `nemotron-qpass-v1` (sorgu/pasaj) | 2048 | `adapters` |
| Çıkarım / doğrulama LLM | `openai_compatible` | uç noktanızın sunduğu bir sohbet modeli, örn. `gpt-4o-mini` | — | `adapters` |
| Çıkarım / doğrulama LLM | `claude` | bir Claude modeli | — | sağlayıcı SDK eki |
| Çıkarım / doğrulama LLM | `ollama` | çalışan Ollama’da önceden indirilmiş model | — | sağlayıcı SDK eki |
| Yalnızca test | `mock` | bilgi döndürmez | — | — |

Çıkarım ve embedding ayrı yapılandırılır: çıkarım için `claude` veya `ollama` seçmek embedding’i kurmaz. `auto` gerektiğinde `mock`’a düşebilir; sağlayıcıyı açıkça belirtin. Sağlayıcı, model, boyut veya normalizasyon değişince yeni bir embedding alanı başlar; yeniden indeksleme veya yeni depolama kökü gerekir.

## Belge ve sorgu temsilleri uyumlu olmalı

Bilgi kayıtlarının vektörleri ile sorgu vektörleri aynı sağlayıcı/model kimliğini ve boyutları kullanmalıdır. Belgelenen yerel varsayılan Magibu, 768 boyutludur; dış sağlayıcıdaki text-embedding-3-small ise 1536 boyut kullanır. Ayarı değiştirmek eski verileri dönüştürmez. Model değiştirirken belgelenen kimlik kurallarına göre arama görünümünü ve indeksi yeniden oluşturun.

## Ayarın bulunması, sağlayıcının çalıştığını göstermez

`GET /v4/capability`, o anda kullanılabilen özellikleri bildirir. Özel bir sayısal temsil sağlayıcısı, ilk başarılı çağrıdan önce çalışır kabul edilmez. Beklenen vektör veya sağlayıcı hatalarında açık bir 503 yanıtı verilir; sistem sessizce başka modele geçmez. V4 combined tüketici, modeller kapalıyken de veri alır ve BM25 araması sağlar; çıkarım ve sayısal temsil sağlayıcılarını gerektiğinde açın.

## Dış erişimi ayrıca değerlendirin

`MESA_EXTERNAL_PROVIDER_ENABLED=false`, asıl işleme hattındaki dış sağlayıcı çağrılarını sınırlar. Bu ayar tek başına sistemin tamamen ağdan yalıtıldığını veya hiç ücret doğurmayacağını garanti etmez. Model indirmeleri ve başka süreçlerin ağ erişimi ayrıca değerlendirilmelidir. Burada gerçek sağlayıcıların hızına, kalitesine veya token maliyetine ilişkin güncel bir ölçüm sunulmuyor.

## v0.9.0 ile çalışma

`MESA_LLM_MODEL=provider:model` ve `MESA_EMBEDDING_MODEL=provider:model` kullanın. Modeller kapalıyken BM25 veri alımı/araması çalışır. Dış sağlayıcı bayrağı kapalıyken yerel Ollama ve OpenAI uyumlu uç noktalar kullanılabilir; bulut sağlayıcıları açık bayrak ve anahtar ister.
