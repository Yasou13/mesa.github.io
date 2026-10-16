# Shared cosmic environment

16 October 2026. Source: `scripts/cosmic.mjs`, `dist/cosmic.css`; integration: `documentShell()` and `renderAdminPage()`.

## Composition and prototype

One decorative, fixed, pointer-transparent SVG per document. Five layers: midnight base; asymmetric violet/blue illumination; seeded fractal dust; 45 sparse stable stars; optional 240×180 opacity-only light. No raster background requests, canvas, WebGL, particle loops, scroll handlers or animation library. Supplied hero/flow/structure/horizon images were inspected as references and retained untouched in their existing asset locations.

The first prototype had a hard cloud boundary and was rejected. The accepted implementation direction replaces it with continuously masked turbulence. See [prototype and page captures](../../../review/global-cosmic/). This is an engineering visual review, not owner sign-off or photographic equivalence.

`cosmicVariant()` is the authoritative route→composition mapping. Home 1.0, Core/default .7, Data .8 (direction reversed), Ecosystem .65, Law/Admin .5, QA/E2E .3, all reading families .26. One palette; no separate themes. Static noise is rasterized by the browser; filters are never animated.

## Mobile and fallbacks

At ≤800px, the field is recomposed within a taller canvas with a rotated field group, fewer visible stars, no ridge filter, no light animation, and a text-protection scrim. The portrait photo and its conflicting 200px `cover` layout are no longer part of the rendered homepage. There is no empty image reservation or image decode shift.

Without JavaScript the complete SVG remains visible and static. Motion is opt-in through `data-cosmic-motion`; `visibilitychange`, data-saver and live reduced-motion preference changes disable it. Only Home/Core/Data desktop can animate. Reading surfaces are opaque. The layer is clipped inside its own fixed container, not by hiding document overflow. Menus and dialogs retain their existing layers.

## Limits

SVG turbulence has an initial rasterization cost; it is not a zero-cost effect. Performance measurements and actual tested viewports are in `docs/tests/MESA_VISUAL_REGRESSION_REPORT.md`. No Safari/iOS or field performance certification is implied.
