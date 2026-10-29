# MESA logo

The rounded asymmetric M supplied on 29 October 2026 is the brand mark.
The source is `dist/assets/mesa-logo.png`, prepared with built-in ImageGen.
Its transparent background blends with the site's `#050508` surface; the
periwinkle-to-lavender palette uses `#b8c2de` and `#9b8acb`.

Header, footer, administration, favicons, Apple touch icon and both social
cards derive from this source. Preserve the mark's proportions.

Regenerate the derivatives without changing fonts:

```sh
python3 scripts/prepare_web_assets.py --brand-only
convert-im6.q16 -background none dist/og-image.svg dist/og-image.png
convert-im6.q16 -background none dist/og-image-tr.svg dist/og-image-tr.png
node scripts/render_site.mjs --output dist --site-url https://mesamemory.dev/
python3 scripts/build_site.py --site-url https://mesamemory.dev/ --verify-articles
python3 scripts/check_site.py _site
```

The social PNG rendering commands require ImageMagick. Production builds
use the committed assets and do not require ImageGen or ImageMagick.

ImageGen edit prompt (reference: the user-supplied green M on navy):

> Use case: precise-object-edit / logo-brand. Input image is the user's approved MESA logo to edit, not just a style reference. Extract and preserve exactly the asymmetric rounded zigzag M silhouette: left circular endpoint, smaller left peak, middle low circular node, higher right peak, right circular endpoint. Change only color and background. Remove the navy rectangular background completely and use true transparent alpha. Recolor the neon lime mark to a restrained pale periwinkle/lavender gradient, #b8c2de at upper portions through #9b8acb at lower portions, compatible with a website background of #050508. Clean flat graphic with crisp smooth edges, no neon green, no blue background, no glow or shadow or texture. Keep the entire original M geometry and round ends intact. Center the mark in a square canvas, with the symbol occupying 90% of the width and around 48% of height, leaving only reasonable clear space. No text, no other objects. This is a production website header/footer logo and favicon source.
