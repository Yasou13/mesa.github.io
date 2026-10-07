# MESA Scene Storyboard and Asset Contract

## Integration model

The source of truth is `content/media-scenes.json`. Each required scene has layout data and four nullable asset fields. With all fields set to `null`, the renderer emits only a stable dark fallback. It never emits a request to a missing file.

Future files belong in `dist/media/`. To activate an asset:

1. Add the optimized file to `dist/media/`.
2. Set its filename (not an absolute path) in the matching manifest field.
3. Regenerate `dist/` with `node scripts/render_site.mjs --output dist --site-url https://mesamemory.dev/`.
4. Run the production and project-path builds plus `scripts/check_site.py`.
5. Inspect all required widths and both languages.

The renderer rejects absolute paths, parent traversal, duplicate scenes, missing required scenes, unsupported fit values, invalid opacity, and configured filenames that do not exist.

## Shared delivery requirements

### Image formats

- Primary: WebP, with AVIF considered only after cross-browser QA.
- Hero desktop target: 2400×1350 or larger, 16:9 master with composition-safe crop.
- Section desktop target: 2000×1125 or larger.
- Mobile target: 1080×1440 (3:4) or 1080×1350 (4:5), based on final composition.
- Preserve texture without visible banding in near-black gradients.
- Strip unnecessary metadata and color-manage to sRGB.

### Video formats

- WebM (VP9/AV1 after compatibility validation) plus H.264 MP4 fallback.
- 1920×1080 desktop master; mobile-specific video is optional and should not be introduced until network/performance QA supports it.
- 24 or 30 fps, silent, seamless or gently reversible loop, 6–12 seconds for ambient scenes.
- Avoid fast flashes, hard cuts, high-frequency star motion, or camera shake.
- Keep the first decoded frame visually close to the poster to avoid a perceived jump.

### Layer order

1. CSS dark fallback
2. Poster/picture
3. Optional silent video
4. Configurable readability veil
5. Real HTML content

All four media layers are decorative and non-interactive.

## Scene 01 — `event-horizon`

**Purpose:** Opening scale, MESA identity, and the first suggestion of an original black-hole environment.

- Draft filenames: `blackhole-hero-poster.webp`, `blackhole-mobile.webp`, `blackhole-idle-web.webm`, `blackhole-idle-web.mp4`
- Desktop composition: visual mass weighted to the right; event horizon/accretion detail must not cross the left 46% text-safe area.
- Mobile composition: dedicated crop; primary mass in the upper half, with enough low-contrast field behind the headline and CTAs.
- Current focal points: desktop `76% 44%`; mobile `52% 28%`.
- Object fit: `cover`.
- Overlay: `0.56`, adjustable after contrast testing.
- Fallback: subtle black-to-deep-surface directional field; no CSS black hole.
- Future interaction: may become the opening/idle state of a scroll sequence, but Phase 1 does not bind scroll progress.
- Integration point: homepage `.scene--event-horizon` / `data-scene="event-horizon"`.

## Scene 02 — `flyby`

**Purpose:** A slow passage beside the black-hole environment while the problem is explained.

- Draft filename: `blackhole-flyby-keyframe.webp`; future video names should follow the same scene prefix.
- Desktop composition: motion direction left-to-right or shallow diagonal; no bright feature behind the problem ledger.
- Mobile composition: simplified keyframe preferred over video; contrast concentrated away from text.
- Current focal points: desktop `64% 50%`; mobile `50% 35%`.
- Object fit: `cover`.
- Overlay: `0.68`.
- Fallback: deep neutral directional field.
- Future interaction: optional crossfade or short fixed-rate ambient clip; no scrub until a prototype proves smooth fallback and input behavior.
- Integration point: homepage `#the-problem` / `data-scene="flyby"`.

## Scene 03 — `deep-space`

**Purpose:** Create calm separation before MESA's approach becomes explicit.

- Draft filename: `deep-space.webp`.
- Desktop composition: sparse, low-frequency detail; no centered object and no literal UI elements.
- Mobile composition: darker and quieter than desktop, with no important detail at crop edges.
- Current focal points: desktop `70% 45%`; mobile `50% 34%`.
- Object fit: `cover`.
- Overlay: `0.72`.
- Fallback: deep-surface diagonal field.
- Future interaction: slow opacity/scale drift only if it survives reduced-motion and performance review.
- Integration point: homepage `#why-mesa` / `data-scene="deep-space"`.

## Scene 04 — `connections`

**Purpose:** Move from distant points to meaningful relationships as the ecosystem is introduced.

- Draft filename: `cosmic-connections.webp`.
- Desktop composition: relationships should visually flow toward the center/product path, with the left heading area kept calm.
- Mobile composition: fewer nodes/relationships; avoid a dense graph behind text.
- Current focal points: desktop `58% 50%`; mobile `50% 40%`.
- Object fit: `cover`.
- Overlay: `0.74`.
- Fallback: calm deep gradient; the HTML ecosystem flow supplies the actual information.
- Future interaction: the scene may transition from star-like points to relationship paths, but must remain original and must not imply quantum computing.
- Integration point: homepage `#ecosystem` / `data-scene="connections"`.

## Scene 05 — `structure`

**Purpose:** Resolve the cosmic metaphor into MESA's verified retrieval/evidence structure.

- Draft filename: `structured-universe.webp`.
- Desktop composition: quiet structural depth around, not under, the specimen plate. Do not reproduce product text inside the bitmap.
- Mobile composition: poster may be omitted entirely if it competes with the fixture.
- Current focal points: desktop `50% 50%`; mobile `50% 42%`.
- Object fit: `cover`.
- Overlay: `0.78`.
- Fallback: near-black structured surface.
- Future interaction: a crossfade from the connections scene into the real HTML fixture is preferred over animating the fixture itself.
- Integration point: homepage `#mesa-in-action` / `data-scene="structure"`.

## Runtime fallback behavior

- No configured asset: CSS fallback only.
- Poster configured, no video: responsive picture/poster above fallback.
- Video configured: poster remains below video; playback begins only when motion and Save-Data preferences allow it.
- Playback rejected: poster/fallback remains visible and content is unchanged.
- Video error: layer receives `data-media-state="error"`; video is hidden.
- Reduced motion: video is hidden and poster/fallback remains.
- Save-Data: video is not played and poster/fallback remains.
- JavaScript unavailable: the video does not autoplay; poster/fallback and all content remain complete.

## Phase 2 acceptance checklist

- [ ] All supplied assets are original or have explicit usage rights.
- [ ] Desktop and mobile crops are approved separately.
- [ ] Text-safe areas hold in EN and TR at 320, 390, 768, 1024, 1440, and 1920 px.
- [ ] Near-black banding and compression artifacts are acceptable on common displays.
- [ ] LCP and transferred bytes are measured with real assets.
- [ ] Reduced-motion, Save-Data, playback rejection, missing source, and decode failure are tested.
- [ ] Media never covers links, focus rings, or selectable text.
- [ ] Any future scroll behavior has a non-scroll-driven fallback and does not trap the user in empty viewport panels.
