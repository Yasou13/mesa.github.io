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
import base64
from io import BytesIO
from PIL import ImageDraw

image = Image.open(root / 'assets/mesa-logo.png').convert('RGBA')
image.thumbnail((128, 128))
image.save(root / 'assets/mesa-mark.webp', format='WEBP', lossless=True)
print('mesa-mark.webp: 128px lossless web derivative; approved original retained')

# Generate standard multi-format favicon family
orig_logo = Image.open(root / 'assets/mesa-logo.png').convert('RGBA')
bbox = orig_logo.getbbox()
cx = (bbox[0] + bbox[2]) // 2
cy = (bbox[1] + bbox[3]) // 2
side = max(bbox[2] - bbox[0], bbox[3] - bbox[1])
margin = int(side * 0.12)
box_size = side + 2 * margin
cropped = orig_logo.crop((cx - box_size // 2, cy - box_size // 2, cx + box_size // 2, cy + box_size // 2))

def create_favicon_tile(size, corner_ratio=0.18):
    tile = Image.new('RGBA', (size, size), (11, 12, 15, 255))
    if corner_ratio > 0:
        mask = Image.new('L', (size, size), 0)
        draw = ImageDraw.Draw(mask)
        draw.rounded_rectangle((0, 0, size, size), radius=int(size * corner_ratio), fill=255)
    else:
        mask = None
    logo_size = int(size * 0.80)
    resized_logo = cropped.resize((logo_size, logo_size), Image.LANCZOS)
    offset = (size - logo_size) // 2
    tile.paste(resized_logo, (offset, offset), resized_logo)
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

svg_img = cropped.resize((96, 96), Image.LANCZOS)
buf = BytesIO()
svg_img.save(buf, format='PNG', optimize=True)
b64_png = base64.b64encode(buf.getvalue()).decode('ascii')
svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" role="img" aria-label="MESA mark">
  <rect width="64" height="64" rx="12" fill="#0b0c0f"/>
  <image href="data:image/png;base64,{b64_png}" xlink:href="data:image/png;base64,{b64_png}" x="5" y="5" width="54" height="54" preserveAspectRatio="xMidYMid meet"/>
</svg>
'''
(root / 'favicon.svg').write_text(svg_content, encoding='utf-8')
print('favicon suite: ICO, PNG (32/48/180), and SVG derivatives created faithfully')

