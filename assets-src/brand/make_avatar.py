"""Brand mark: Idaho in solid purple with a white outline, on a red-to-blue gradient.
Idaho is literally the purple between the red and the blue.
Boundary: idaho-boundary.geojson (US state outline, public domain, via github.com/glynnbird/usstatesgeojson).
Run from site/: python3 assets-src/brand/make_avatar.py"""
import json, math, os
from PIL import Image, ImageDraw, ImageFilter
HERE = os.path.dirname(os.path.abspath(__file__))
g = json.load(open(os.path.join(HERE, 'idaho-boundary.geojson')))
g = g.get('geometry') or g['features'][0]['geometry']
k = math.cos(math.radians(45.5))
pts = [(lon * k, -lat) for lon, lat in g['coordinates'][0]]
xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
RED, MID, BLU, PUR = (226, 35, 52), (120, 60, 170), (34, 98, 230), (128, 52, 200)

def mark(W=1024, frac=0.80):
    w = max(xs) - min(xs); h = max(ys) - min(ys); s = W * frac / max(w, h)
    ox = (W - w * s) / 2 - min(xs) * s; oy = (W - h * s) / 2 - min(ys) * s + W * 0.01
    m = Image.new('L', (W, W), 0)
    ImageDraw.Draw(m).polygon([(x * s + ox, y * s + oy) for x, y in pts], fill=255)
    bg = Image.new('RGB', (W, W)); px = bg.load()
    stops = [(0, RED), (0.15, RED), (0.5, MID), (0.85, BLU), (1, BLU)]
    for x in range(W):
        t = x / (W - 1)
        for (t0, c0), (t1, c1) in zip(stops, stops[1:]):
            if t <= t1:
                u = (t - t0) / (t1 - t0) if t1 > t0 else 0
                c = tuple(int(c0[i] + (c1[i] - c0[i]) * u) for i in range(3)); break
        for y in range(W): px[x, y] = c
    bg.paste((255, 255, 255), mask=m.filter(ImageFilter.MaxFilter(max(3, W // 49 | 1))))
    bg.paste(PUR, mask=m)
    return bg

if __name__ == '__main__':
    big = mark()
    big.save(os.path.join(HERE, 'avatar-idaho-purple-1024.png'), optimize=True)
    big.resize((256, 256), Image.LANCZOS).save(os.path.join(HERE, 'avatar-idaho-purple-256.png'), optimize=True)
    print('saved')
