"""
Convert the TPI badge JPG to a transparent PNG.
Flood-fills the outer black square from the corners so only the outer black
(around the cyan hexagon) becomes transparent. Inner black inside the hexagon
is preserved.
"""
from collections import deque
from PIL import Image

SRC = "images/tpi-certified-medical-level-3-dark-lg.jpg"
DST = "images/tpi-certified-medical-level-3.png"
THRESHOLD = 60  # treat any pixel darker than this (per channel) as "black"

img = Image.open(SRC).convert("RGBA")
w, h = img.size
px = img.load()


def is_black(p):
    r, g, b, _ = p
    return r < THRESHOLD and g < THRESHOLD and b < THRESHOLD


visited = [[False] * h for _ in range(w)]
queue = deque()

# Seed flood-fill from every pixel along the four edges that's "black"
for x in range(w):
    for y in (0, h - 1):
        if is_black(px[x, y]) and not visited[x][y]:
            visited[x][y] = True
            queue.append((x, y))
for y in range(h):
    for x in (0, w - 1):
        if is_black(px[x, y]) and not visited[x][y]:
            visited[x][y] = True
            queue.append((x, y))

# BFS — fan out across connected black pixels, stopping at the cyan border
while queue:
    x, y = queue.popleft()
    r, g, b, _ = px[x, y]
    px[x, y] = (r, g, b, 0)  # make transparent
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nx, ny = x + dx, y + dy
        if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
            if is_black(px[nx, ny]):
                visited[nx][ny] = True
                queue.append((nx, ny))

img.save(DST, "PNG", optimize=True)
print(f"wrote {DST} ({w}x{h})")
