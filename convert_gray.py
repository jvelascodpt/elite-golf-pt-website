"""
Knock out the pure-black background on the Gray Institute logo so it sits
cleanly on the dark card background. Flood-fills from corners and treats
near-black pixels as transparent. White/grey/red logo content stays opaque.
"""
from collections import deque
from PIL import Image

SRC = "images/gray-institute-logo.png"
DST = "images/gray-institute-logo.png"  # overwrite
THRESHOLD = 40

img = Image.open(SRC).convert("RGBA")
w, h = img.size
px = img.load()


def is_black(p):
    r, g, b, _ = p
    return max(r, g, b) <= THRESHOLD


visited = [[False] * h for _ in range(w)]
queue = deque()
for x in range(w):
    for y in (0, h - 1):
        if is_black(px[x, y]):
            visited[x][y] = True
            queue.append((x, y))
for y in range(h):
    for x in (0, w - 1):
        if is_black(px[x, y]):
            visited[x][y] = True
            queue.append((x, y))

while queue:
    x, y = queue.popleft()
    r, g, b, _ = px[x, y]
    px[x, y] = (r, g, b, 0)
    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nx, ny = x + dx, y + dy
        if 0 <= nx < w and 0 <= ny < h and not visited[nx][ny]:
            if is_black(px[nx, ny]):
                visited[nx][ny] = True
                queue.append((nx, ny))

img.save(DST, "PNG", optimize=True)
print(f"wrote {DST} ({w}x{h})")
