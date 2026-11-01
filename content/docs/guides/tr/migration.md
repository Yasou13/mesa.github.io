## Sürüm geçişinden önce yedek alın

Sistemi çevrimdışına alıp yedekleyin. V4 tek combined süreciyle çalışır; modeller isteğe bağlıdır. Geri dönüş için sakladığınız yedeği yeni ve boş bir dizine yükleyin; dönüştürülen dizinin sürümünü yerinde düşürmeyin.

## v0.9.1 geçişini hazırlayın

Eski kökün şema ve embedding kimliğini kaydedip v0.9.1’ın kilitlenmiş ortamını kullanın. Aşağıdaki kaynak eki önceki v0.8.0 yükseltmesini anlatır; tarihsel geçiş rehberidir. Yükseltmeden önce yerel kimlik bilgilerini, isteğe bağlı model/çizge ayarlarını ve tam belge sürüm davranışını inceleyin. [İşletim](docs/core/operations/), [API](docs/core/api-reference/) ve [sürüm sınırları](docs/core/limitations/) belgelerine bakın.

## v0.9.1 veri alımı indeksleri

Normal başlangıç `e6f7a8b9c0d1` migration’ını uygular. Yükseltmeden önce tek depolama sahibini durdurun ve tam çevrimdışı yedek alın. [Yedek ve geri yükleme](docs/core/operations/) ile [tek sahipli kurtarma](docs/core/rebuild-runbook/) prosedürünü izleyin. Doğrulanmış PyPI paketiyle `pip install --upgrade mesa-memory==0.9.1` kullanarak yükseltin; [kuruluma](docs/core/installation/) bakın. Yeni sürümlerde önceki parçalama planı için `MESA_CHUNKING=plain`, önceki vektör ağırlığı için `MESA_RRF_VECTOR_WEIGHT=1` kullanın. Mevcut ACTIVE sürümler değişmez.

```bash
pip install --upgrade mesa-memory==0.9.1
```
