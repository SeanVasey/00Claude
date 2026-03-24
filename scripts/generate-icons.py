#!/usr/bin/env python3
"""Generate PWA icon suite from 00Claude-refined.svg.

Extracts the embedded base64 PNG and resizes to all required sizes.
All outputs preserve transparent backgrounds.
"""
import base64
import io
import os
import re
import shutil
import struct

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SVG_PATH = os.path.join(ROOT, "00Claude-refined.svg")
ICONS_DIR = os.path.join(ROOT, "public", "icons")

os.makedirs(ICONS_DIR, exist_ok=True)

# Read SVG and extract embedded base64 PNG
with open(SVG_PATH, "r") as f:
    svg_content = f.read()

match = re.search(r'href="data:image/png;base64,([^"]+)"', svg_content)
if not match:
    raise SystemExit("ERROR: Could not find embedded base64 PNG in SVG")

png_data = base64.b64decode(match.group(1))
print(f"Extracted PNG from SVG: {len(png_data)} bytes")

source_img = Image.open(io.BytesIO(png_data)).convert("RGBA")
print(f"Source image size: {source_img.size}")

# All icon sizes to generate
icons = [
    ("icon-1024.png", 1024),
    ("icon-512.png", 512),
    ("icon-384.png", 384),
    ("icon-192.png", 192),
    ("icon-144.png", 144),
    ("icon-96.png", 96),
    ("apple-touch-icon.png", 180),
    ("apple-touch-icon-180.png", 180),
    ("apple-touch-icon-167.png", 167),
    ("apple-touch-icon-152.png", 152),
    ("apple-touch-icon-120.png", 120),
    ("favicon-32.png", 32),
    ("favicon-16.png", 16),
]

for name, size in icons:
    resized = source_img.resize((size, size), Image.LANCZOS)
    output_path = os.path.join(ICONS_DIR, name)
    resized.save(output_path, "PNG")
    print(f"Generated: {name} ({size}x{size})")

# Generate favicon.ico (multi-size: 16, 32, 48)
favicon_sizes = [16, 32, 48]
favicon_images = []
for size in favicon_sizes:
    favicon_images.append(source_img.resize((size, size), Image.LANCZOS))

ico_path = os.path.join(ICONS_DIR, "favicon.ico")
# Pillow can save ICO directly with multiple sizes
favicon_images[0].save(
    ico_path,
    format="ICO",
    sizes=[(s, s) for s in favicon_sizes],
    append_images=favicon_images[1:],
)
print(f"Generated: favicon.ico ({', '.join(str(s) for s in favicon_sizes)})")

# Copy favicon.ico to public/ root for Next.js
shutil.copy2(ico_path, os.path.join(ROOT, "public", "favicon.ico"))
print("Copied: favicon.ico → public/favicon.ico")

# Copy the source SVG to public/icons/
shutil.copy2(SVG_PATH, os.path.join(ICONS_DIR, "00Claude-refined.svg"))
print("Copied: 00Claude-refined.svg → public/icons/")

print("\nDone! All icons generated successfully.")
