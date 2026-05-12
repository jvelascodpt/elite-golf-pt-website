"""
Remove the white-ish background from Jeremy's headshot.

Pipeline:
  1. Flood-fill the bulk white from the corners (kills the empty studio bg).
  2. Erode the alpha mask by 2 pixels (MinFilter 5x5) — this shaves off the
     halo of partially-white anti-aliased edge pixels.
  3. Slightly blur the alpha so the new edge isn't pixel-hard.
"""
from collections import deque
from PIL import Image, ImageFilter

SRC = "images/jeremy.jpg"
DST = "images/jeremy.png"
HARD_THRESHOLD = 230
ERODE_FILTER_SIZE = 5      # 5 = shave 2 pixels off the figure edge; 7 = shave 3
ALPHA_BLUR_RADIUS = 1.2

img = Image.open(SRC).convert("RGBA")
w, h = img.size
px = img.load()


def is_hard_bg(p):
    r, g, b, _ = p
    return min(r, g, b) >= HARD_THRESHOLD


# Pass 1 — flood-fill bulk white background
visited = [[False] * h for _ in range(w)]
queue = deque()
for x in range(w):
    for y in (0, h - 1):
        if is_hard_bg(px[x, y]):
            visited[x][y] = True
            queue.append((x, y))
for y in range(h):
    for x in (0, w - 1):
        if is_hard_bg(px[x, y]):
            visited[x][y] = True
            queue.append((x, y))

while queue:
    x, y = queue.popleft()
    r, g, b, _ = px[x, y]
    px[x, y] = (r, g, b, 0)
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nx, ny = x + dx, y + dy
        if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
            if is_hard_bg(px[nx, ny]):
                visited[nx][ny] = True
                queue.append((nx, ny))

# Pass 2 — erode the alpha mask to remove the halo, then soft-feather the edge
alpha = img.getchannel("A")
alpha = alpha.filter(ImageFilter.MinFilter(ERODE_FILTER_SIZE))
alpha = alpha.filter(ImageFilter.GaussianBlur(radius=ALPHA_BLUR_RADIUS))
img.putalpha(alpha)

img.save(DST, "PNG", optimize=True)
print(f"wrote {DST} ({w}x{h})")
