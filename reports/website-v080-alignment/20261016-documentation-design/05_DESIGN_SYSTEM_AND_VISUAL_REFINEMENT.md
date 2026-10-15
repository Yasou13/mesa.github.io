# Design system and visual refinement

The existing black/cosmic identity, approved nebula originals, icon language and fonts remain. Composition now uses distinct editorial rows, a four-step logical flow, an evidence specimen, interactive rank contributions and a connected ecosystem spine with a separate quality rail. No WebGL, particle engine, animation library or runtime dependency was added.

Typography remains Instrument Sans for primary reading, Instrument Serif sparingly for existing editorial emphasis, Commit Mono for code and labels. New WOFF2 derivatives preserve Latin/Turkish glyph coverage (`ÇĞİÖŞÜçğıöşü` verified against both font cmaps). Original fonts and all OFL files remain. `scripts/prepare_web_assets.py` documents repeatable optional preparation; production builds need no imaging/font packages.

Asset bytes: logo original 535,223 → web derivative 7,040 (128×128 lossless WebP); sans 194,336 → 60,240; serif 71,592 → 23,348. Critical sans is preloaded. The unchanged approved desktop/mobile nebula assets remain art-directed at the existing 800px breakpoint. Mobile uses a bounded atmospheric crop to keep the technical example at 1,725px EN / 1,744px TR at 390px viewport.

RRF labels, borders and native inputs show which lanes contribute. Actual Space-key input changes 4/61 to 3/61; zero inputs yields zero. No service request or model execution occurs. No-JS output is static and inputs disabled. Reduced-motion removes optional transitions; imagery never blocks reading. Native source/fixture disclosures and visible focus support keyboard use.

Axe findings corrected: footer text/link contrast, status and certification panel contrast, labeled-group semantics, Data table cell roles, invalid figure role and keyboard access to scrolling code/diagram regions. Screenshots are in `evidence/screenshots/`; browser observations record measured overflow, CLS, image loading and interaction outcomes.
