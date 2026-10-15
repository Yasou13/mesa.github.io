## Amaç ve sınırlar

Rebuild varsayılan kapalı, yalnız ADMIN yetkili, tüm storage root’u kapsayan control-plane işlemidir. Kabul, checkpoint’li offline replay, doğrulama ve cutover ayrı aşamalardır. Bayrak kapalı gönderim 501; desteklenmeyen kapsamlı istek 409 döndürür. Kanonik sahipliği ve yedeği koruyun; bunu online tenant başına onarım olarak anlatmayın.

## Sürdürülen sözleşmelerle devam edin

Tam tablolar ve operatör ayrıntıları için aşağıdaki sabitlenmiş kaynak referansını kullanın. İlgili rehberler: [mimari](architecture/), [API](docs/core/api-reference/), [operasyon](docs/core/operations/) ve [sürüm sınırları](docs/core/limitations/).
