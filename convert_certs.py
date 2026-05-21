"""
Convert dark-on-white certification logos to white-on-transparent PNGs so
they sit cleanly on the dark site. Each opaque pixel becomes white, with
alpha proportional to how dark it was. Pure-white background becomes
fully transparent.
"""
from PIL import Image

JOBS = [
    ("images/sfma-source.png", "images/sfma-logo.png"),
    ("images/nasm-source.png", "images/nasm-logo.png"),
]

for src, dst in JOBS:
    img = Image.open(src).convert("RGB")
    w, h = img.size
    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    src_px = img.load()
    out_px = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = src_px[x, y]
            darkness = 255 - (r + g + b) // 3
            out_px[x, y] = (255, 255, 255, darkness)
    out.save(dst, "PNG", optimize=True)
    print(f"wrote {dst} ({w}x{h})")
