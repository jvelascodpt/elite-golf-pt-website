"""
Convert the black-on-white TPI hex badge into a white-on-transparent PNG so
it can sit cleanly on the dark site. Maps pixel brightness to alpha:
fully white pixels become fully transparent, fully black pixels become fully
opaque white. Anti-aliased edges fade smoothly between the two.
"""
from PIL import Image

SRC = "images/titleist-performance-institute-certified-hex-light-lg.jpg"
DST = "images/tpi-certified-hex-white.png"

img = Image.open(SRC).convert("RGB")
w, h = img.size
out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
src_px = img.load()
out_px = out.load()

for y in range(h):
    for x in range(w):
        r, g, b = src_px[x, y]
        # Darkness 0..255, where pure black -> 255, pure white -> 0
        darkness = 255 - (r + g + b) // 3
        out_px[x, y] = (255, 255, 255, darkness)

out.save(DST, "PNG", optimize=True)
print(f"wrote {DST} ({w}x{h})")
