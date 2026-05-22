"""
Compress all JPG/JPEG images in the images folder to web-friendly sizes.
Resizes anything wider than 1920px down to 1920px (we never need bigger
than that for a background image) and re-encodes at JPEG quality 80,
which is visually indistinguishable from the source for backgrounds.

Skips files smaller than 500 KB so we don't pointlessly recompress
already-tiny logos.
"""
import os
from PIL import Image

IMAGES_DIR = "images"
MAX_WIDTH = 1920
QUALITY = 80
SKIP_BELOW_BYTES = 500 * 1024  # 500 KB

total_before = 0
total_after = 0
count = 0

for filename in sorted(os.listdir(IMAGES_DIR)):
    if not filename.lower().endswith((".jpg", ".jpeg")):
        continue

    path = os.path.join(IMAGES_DIR, filename)
    size_before = os.path.getsize(path)

    if size_before < SKIP_BELOW_BYTES:
        print(f"  skip   {filename:50s} {size_before/1024:7.0f} KB (already small)")
        continue

    img = Image.open(path)
    # Convert any non-RGB modes (e.g. CMYK, RGBA) so we can save as JPEG
    if img.mode != "RGB":
        img = img.convert("RGB")

    # Resize down if too wide
    if img.width > MAX_WIDTH:
        ratio = MAX_WIDTH / img.width
        new_size = (MAX_WIDTH, int(img.height * ratio))
        img = img.resize(new_size, Image.LANCZOS)

    img.save(path, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    size_after = os.path.getsize(path)
    total_before += size_before
    total_after += size_after
    count += 1
    pct = 100 * (1 - size_after / size_before)
    print(f"  wrote  {filename:50s} {size_before/1024:7.0f} KB -> {size_after/1024:7.0f} KB  ({pct:.0f}% smaller)")

print()
print(f"Compressed {count} files")
print(f"Total before: {total_before/1024/1024:6.1f} MB")
print(f"Total after:  {total_after/1024/1024:6.1f} MB")
if total_before:
    print(f"Saved:        {(total_before-total_after)/1024/1024:6.1f} MB  ({100*(1-total_after/total_before):.0f}% reduction)")
