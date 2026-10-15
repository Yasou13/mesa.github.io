#!/usr/bin/env python3
"""Optional asset preparation, never required by the production build.

Inputs and their OFL licenses stay in dist/. Requires Pillow, fontTools and Brotli.
Validated toolchain: Pillow 12.3.0, fontTools 4.63.0, Brotli 1.2.0.
"""
from pathlib import Path
from PIL import Image
from fontTools.ttLib import TTFont
from fontTools import subset

root = Path(__file__).resolve().parents[1] / 'dist'
coverage = set(range(0x20, 0x180)) | set(range(0x2000, 0x2070)) | set(range(0x20A0, 0x20D0)) | set(range(0x2190, 0x2200)) | {0x2211, 0x2212, 0x221E, 0x2260, 0x2264, 0x2265}
for name in ('instrument-sans-variable', 'instrument-serif-italic'):
    source = root / 'fonts' / (name + '.ttf')
    target = source.with_suffix('.woff2')
    font = TTFont(source)
    options = subset.Options()
    options.flavor = 'woff2'
    options.name_languages = ['*']
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=set(font.getBestCmap()) & coverage)
    subsetter.subset(font)
    font.flavor = 'woff2'
    font.save(target)
    assert set(map(ord, 'ÇĞİÖŞÜçğıöşü')) <= set(TTFont(target).getBestCmap())
    print(f'{target.name}: {source.stat().st_size} → {target.stat().st_size} bytes; Turkish coverage verified')
image = Image.open(root / 'assets/mesa-logo.png').convert('RGBA')
image.thumbnail((128, 128))
image.save(root / 'assets/mesa-mark.webp', format='WEBP', lossless=True)
print('mesa-mark.webp: 128px lossless web derivative; approved original retained')
