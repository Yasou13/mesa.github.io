#!/usr/bin/env python3
"""Optional asset preparation, never required by the production build.

Inputs and their OFL licenses stay in dist/. Requires Pillow, fontTools and Brotli.
Use --brand-only to process brand assets with Pillow without rebuilding fonts.
Validated toolchain: Pillow 12.3.0, fontTools 4.63.0, Brotli 1.2.0.
"""
from pathlib import Path
from PIL import Image
import argparse
import re

root = Path(__file__).resolve().parents[1] / 'dist'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--brand-only', action='store_true', help='Regenerate brand assets without processing fonts')
args = parser.parse_args()

def prepare_fonts():
    from fontTools.ttLib import TTFont
    from fontTools import subset
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
if not args.brand_only:
    prepare_fonts()

import base64
from io import BytesIO
from PIL import ImageDraw

# Crop to the visible mark rather than the square artwork canvas. Ignore
# near-transparent generator noise when measuring the mark's clear space.
orig_logo = Image.open(root / 'assets/mesa-logo.png').convert('RGBA')
bbox = orig_logo.getchannel('A').point(lambda alpha: 255 if alpha > 128 else 0).getbbox()
if bbox is None:
    raise ValueError('Logo source has no visible pixels')
cropped = orig_logo.crop(bbox)
image = cropped.copy()
image.thumbnail((256, 256))
image.save(root / 'assets/mesa-mark.webp', format='WEBP', lossless=True)
print('mesa-mark.webp: tightly fitted lossless web derivative')

def create_favicon_tile(size, corner_ratio=0.18):
    tile = Image.new('RGBA', (size, size), (5, 5, 8, 255))
    if corner_ratio > 0:
        mask = Image.new('L', (size, size), 0)
        draw = ImageDraw.Draw(mask)
        draw.rounded_rectangle((0, 0, size, size), radius=int(size * corner_ratio), fill=255)
    else:
        mask = None
    logo_size = int(size * 0.80)
    resized_logo = cropped.copy()
    resized_logo.thumbnail((logo_size, logo_size), Image.LANCZOS)
    offset = ((size - resized_logo.width) // 2, (size - resized_logo.height) // 2)
    tile.alpha_composite(resized_logo, offset)
    if mask:
        result = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        result.paste(tile, (0, 0), mask)
        return result
    return tile

ico_16 = create_favicon_tile(16)
ico_32 = create_favicon_tile(32)
ico_48 = create_favicon_tile(48)
ico_48.save(root / 'favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
create_favicon_tile(32).save(root / 'favicon-32x32.png', format='PNG', optimize=True)
create_favicon_tile(48).save(root / 'favicon-48x48.png', format='PNG', optimize=True)
create_favicon_tile(48).save(root / 'favicon.png', format='PNG', optimize=True)
create_favicon_tile(180, corner_ratio=0).save(root / 'apple-touch-icon.png', format='PNG', optimize=True)

svg_img = cropped.copy()
svg_img.thumbnail((256, 256), Image.LANCZOS)
buf = BytesIO()
svg_img.save(buf, format='PNG', optimize=True)
b64_png = base64.b64encode(buf.getvalue()).decode('ascii')
svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" role="img" aria-label="MESA mark">
  <rect width="64" height="64" rx="12" fill="#050508"/>
  <image href="data:image/png;base64,{b64_png}" xlink:href="data:image/png;base64,{b64_png}" x="5" y="5" width="54" height="54" preserveAspectRatio="xMidYMid meet"/>
</svg>
'''
(root / 'favicon.svg').write_text(svg_content, encoding='utf-8')
print('favicon suite: ICO, PNG (32/48/180), and SVG derivatives created faithfully')


# Keep both social-card sources on the same mark. PNGs are rendered from
# these SVGs alongside asset preparation, using an SVG renderer.
for filename in ('og-image.svg', 'og-image-tr.svg'):
    social = root / filename
    content = social.read_text(encoding='utf-8')
    mark = f'<image id="mesa-brand-mark" href="data:image/png;base64,{b64_png}" x="0" y="7" width="56" height="27" preserveAspectRatio="xMidYMid meet"/>'
    content, count = re.subn(r'<(?:path d="M0 42V0h10[^>]+|image id="mesa-brand-mark"[^>]+?)/>', lambda match: mark, content)
    if count != 1:
        raise ValueError(f'{filename}: expected exactly one brand mark, found {count}')
    content = content.replace('fill="#0b0c0f"', 'fill="#050508"')
    social.write_text(content, encoding='utf-8')
print('Social SVGs updated; render og-image.svg and og-image-tr.svg to PNG')
