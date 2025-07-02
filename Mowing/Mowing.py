import pygame
import random
import math
from collections import deque

WIDTH, HEIGHT = 400, 400      # Smaller screen
TILE_SIZE = 20
COLS, ROWS = WIDTH // TILE_SIZE, HEIGHT // TILE_SIZE
FPS = 120

MAX_GRASS_PER_SUBGRID = 10    # Fewer per subgrid = faster Held–Karp

GREEN     = (34, 139, 34)
BROWN     = (139, 69, 19)
DIRT_GRAY = (169, 169, 169)
WHITE     = (255, 255, 255)
MOWER_COLOR = (255, 0, 0)

pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Lawn Mower Python")
clock = pygame.time.Clock()

grass_mask = [[1 for _ in range(COLS)] for _ in range(ROWS)]

for _ in range(2):  # Fewer obstacles
    cx = random.uniform(0, COLS)
    cy = random.uniform(0, ROWS)
    radius = random.uniform(2, 3)
    for y in range(ROWS):
        for x in range(COLS):
            if math.hypot(x - cx, y - cy) < radius:
                grass_mask[y][x] = 0

for _ in range(1):
    w = random.randint(2, 3)
    h = random.randint(2, 3)
    sx = random.randint(0, COLS - w)
    sy = random.randint(0, ROWS - h)
    for y in range(sy, sy + h):
        for x in range(sx, sx + w):
            grass_mask[y][x] = 0

subgrids = []

def count_grass(r0, r1, c0, c1):
    return sum(grass_mask[r][c] for r in range(r0, r1+1) for c in range(c0, c1+1))

def subdivide(r0, r1, c0, c1):
    if len(subgrids) > 10: return  # Skip extra work
    cnt = count_grass(r0, r1, c0, c1)
    if cnt <= MAX_GRASS_PER_SUBGRID:
        subgrids.append((r0, r1, c0, c1))
        return
    dr, dc = r1 - r0 + 1, c1 - c0 + 1
    if dr >= dc:
        mid = (r0 + r1) // 2
        subdivide(r0, mid, c0, c1)
        subdivide(mid + 1, r1, c0, c1)
    else:
        mid = (c0 + c1) // 2
        subdivide(r0, r1, c0, mid)
        subdivide(r0, r1, mid + 1, c1)

subdivide(0, ROWS - 1, 0, COLS - 1)

def solve_subgrid_tsp(r0, r1, c0, c1):
    nodes = [(c, r) for r in range(r0, r1+1) for c in range(c0, c1+1) if grass_mask[r][c] == 1]
    n = len(nodes)
    if n == 0: return []
    dist = [[abs(x1 - x2) + abs(y1 - y2) for x2, y2 in nodes] for x1, y1 in nodes]
    FULL, INF = 1 << n, 10**9
    dp = [[INF]*n for _ in range(FULL)]
    parent = [[-1]*n for _ in range(FULL)]
    for i in range(n): dp[1<<i][i] = 0
    for mask in range(1, FULL):
        for last in range(n):
            if not (mask & (1<<last)): continue
            prev_mask = mask ^ (1<<last)
            if prev_mask == 0: continue
            for k in range(n):
                if not (prev_mask & (1<<k)): continue
                cost = dp[prev_mask][k] + dist[k][last]
                if cost < dp[mask][last]:
                    dp[mask][last] = cost
                    parent[mask][last] = k
    end = min(range(n), key=lambda i: dp[FULL - 1][i])
    rev, mask = [], FULL - 1
    while end != -1:
        rev.append(end)
        next_end = parent[mask][end]
        mask ^= (1 << end)
        end = next_end
    return [nodes[i] for i in reversed(rev)]

subgrid_tours = [solve_subgrid_tsp(*s) for s in subgrids]

def manhattan_path(A, B):
    path = []
    x0,y0 = A
    x1,y1 = B
    dx = 1 if x1 > x0 else -1 if x1 < x0 else 0
    while x0 != x1:
        x0 += dx
        path.append((x0, y0))
    dy = 1 if y1 > y0 else -1 if y1 < y0 else 0
    while y0 != y1:
        y0 += dy
        path.append((x0, y0))
    return path

full_path = []
if subgrid_tours:
    full_path.append(subgrid_tours[0][0])
    for pt in subgrid_tours[0][1:]:
        full_path.extend(manhattan_path(full_path[-1], pt))
    for i in range(1, len(subgrid_tours)):
        full_path.extend(manhattan_path(full_path[-1], subgrid_tours[i][0]))
        for pt in subgrid_tours[i][1:]:
            full_path.extend(manhattan_path(full_path[-1], pt))

mowed = [[0]*COLS for _ in range(ROWS)]
path_index = 0

def draw_grid():
    for y in range(ROWS):
        for x in range(COLS):
            color = DIRT_GRAY if grass_mask[y][x] == 0 else (BROWN if mowed[y][x] else GREEN)
            pygame.draw.rect(screen, color, (x*TILE_SIZE, y*TILE_SIZE, TILE_SIZE, TILE_SIZE))
    if path_index < len(full_path):
        mx, my = full_path[path_index]
        pygame.draw.rect(screen, MOWER_COLOR, (mx*TILE_SIZE, my*TILE_SIZE, TILE_SIZE, TILE_SIZE))

running = True
while running:
    clock.tick(FPS)
    screen.fill(WHITE)
    draw_grid()
    if path_index < len(full_path):
        x, y = full_path[path_index]
        if grass_mask[y][x] == 1:
            mowed[y][x] = 1
        path_index += 1
    pygame.display.flip()
    for e in pygame.event.get():
        if e.type == pygame.QUIT:
            running = False
# Stay on last frame
done = False
while not done:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            done = True
pygame.quit()
