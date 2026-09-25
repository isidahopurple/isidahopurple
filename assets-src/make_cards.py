"""Build share images from the Gemini art plus our own (exact) text.
  public/og/*.jpg      1200x630 link previews (Signal, iMessage, Facebook, X, ...), one per page and language
  public/share/*.jpg   Instagram feed (1080x1350) and story (1080x1920) images
Run: python3 assets-src/make_cards.py  (from site/). Re-run when race names or dates change."""
import glob, os, textwrap
import yaml
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "assets-src", "art")
OG = os.path.join(ROOT, "public", "og")
SHARE = os.path.join(ROOT, "public", "share")
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
DOMAIN = "isidahopurple.com"
os.makedirs(OG, exist_ok=True)
os.makedirs(os.path.join(OG, "races"), exist_ok=True)
os.makedirs(SHARE, exist_ok=True)


def cover(img, w, h, focus_y=0.5):
    """Resize/crop like CSS object-fit: cover."""
    s = max(w / img.width, h / img.height)
    im = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
    x = (im.width - w) // 2
    y = int((im.height - h) * focus_y)
    return im.crop((x, y, x + w, y + h))


def shade(im, box, strength=170):
    """Darken a region with a soft gradient so white text is always readable."""
    w, h = im.size
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).rectangle(box, fill=strength)
    mask = mask.filter(ImageFilter.GaussianBlur(min(w, h) // 10))
    dark = Image.new("RGB", (w, h), (18, 10, 30))
    return Image.composite(dark, im, mask)


def fit(draw, text, font_path, max_w, start, min_size=20):
    size = start
    while size > min_size:
        f = ImageFont.truetype(font_path, size)
        if all(draw.textlength(line, font=f) <= max_w for line in text.split("\n")):
            return f
        size -= 2
    return ImageFont.truetype(font_path, min_size)


def text_block(draw, x, y, lines, max_w):
    """lines: [(text, font_path, start_size, color, gap_after)] -> returns y after."""
    for text, fp, size, color, gap in lines:
        f = fit(draw, text, fp, max_w, size)
        for line in text.split("\n"):
            draw.text((x, y), line, font=f, fill=color)
            y += int(f.size * 1.18)
        y += gap
    return y


def pill(draw, x, y, text, size, fill=(255, 255, 255), ink=(40, 16, 70)):
    f = ImageFont.truetype(BOLD, size)
    w = draw.textlength(text, font=f)
    pad = size * 0.55
    draw.rounded_rectangle((x, y, x + w + 2 * pad, y + size * 1.7), radius=size, fill=fill)
    draw.text((x + pad, y + size * 0.3), text, font=f, fill=ink)
    return y + size * 1.7


WIDE = Image.open(glob.glob(os.path.join(ART, "wide.*"))[0]).convert("RGB")
TALL = Image.open(glob.glob(os.path.join(ART, "tall.*"))[0]).convert("RGB")
WHITE, SOFT = (255, 255, 255), (228, 218, 244)


def wrap_px(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = f"{cur} {w}".strip()
        if draw.textlength(t, font=font) <= max_w or not cur:
            cur = t
        else:
            lines.append(cur); cur = w
    return lines + [cur]


def og_race(path, eyebrow, office, sub, chip):
    im = cover(WIDE, 1200, 630, 0.35)
    im = shade(im, (0, 0, 780, 630), 190)
    d = ImageDraw.Draw(im)
    for size in (64, 58, 52, 46, 40):
        f = ImageFont.truetype(BOLD, size)
        lines = wrap_px(d, office, f, 700)
        if len(lines) <= 3:
            break
    y = text_block(d, 64, 64, [(eyebrow, BOLD, 28, SOFT, 16)], 700)
    for line in lines:
        d.text((64, y), line, font=f, fill=WHITE); y += int(size * 1.16)
    y = text_block(d, 64, y + 14, [(sub, REG, 30, SOFT, 18)], 700)
    pill(d, 64, min(y, 468), chip, 26)
    d.text((64, 566), DOMAIN, font=ImageFont.truetype(BOLD, 28), fill=WHITE)
    im.save(path, quality=84, optimize=True, progressive=True)


def og(path, eyebrow, title, sub, chip):
    im = cover(WIDE, 1200, 630, 0.35)
    im = shade(im, (0, 0, 760, 630), 190)
    d = ImageDraw.Draw(im)
    y = text_block(d, 64, 70, [(eyebrow, BOLD, 28, SOFT, 18), (title, BOLD, 76, WHITE, 16), (sub, REG, 32, SOFT, 28)], 680)
    if chip:
        y = pill(d, 64, max(y, 400), chip, 28)
    d.text((64, 560), DOMAIN, font=ImageFont.truetype(BOLD, 28), fill=WHITE)
    im.save(path, quality=84, optimize=True, progressive=True)


def insta(path, w, h, lines, chip, focus):
    im = cover(TALL, w, h, focus)
    im = shade(im, (0, 0, w, int(h * 0.55)), 175)
    d = ImageDraw.Draw(im)
    y = text_block(d, 80, int(h * 0.08), lines, w - 160)
    if chip:
        pill(d, 80, y + 10, chip, 40 if w >= 1080 else 32)
    f = ImageFont.truetype(BOLD, 44)
    d.text(((w - d.textlength(DOMAIN, font=f)) / 2, h - 120), DOMAIN, font=f, fill=WHITE)
    im.save(path, quality=86, optimize=True, progressive=True)


COPY = {
    "en": {
        "brand": "IS IDAHO PURPLE?",
        "home": ("How to vote\nin Idaho", "Check your registration, register,\nor get a mail ballot. Official links.", "Deadline: Fri Oct 23, 5 p.m."),
        "default": ("Is Idaho\nPurple?", "An open experiment for the\nNov 3, 2026 election.", "Let’s find out Nov 3"),
        "race_sub": "Who’s running, the polls\nand the vote math.",
        "race_chip": "Election Day: Tue Nov 3",
    },
    "es": {
        "brand": "¿ES IDAHO MORADO?",
        "home": ("Cómo votar\nen Idaho", "Revise su registro, regístrese\no pida su boleta por correo.", "Fecha límite: vie 23 oct, 5 p.m."),
        "default": ("¿Es Idaho\nmorado?", "Un experimento abierto para la\nelección del 3 de noviembre de 2026.", "Averigüémoslo el 3 de nov"),
        "race_sub": "Quién se postula, las encuestas\ny las matemáticas del voto.",
        "race_chip": "Día de la elección: mar 3 nov",
    },
}

for lang, c in COPY.items():
    sfx = "" if lang == "en" else "-es"
    og(f"{OG}/home{sfx}.jpg", c["brand"], *c["home"])
    og(f"{OG}/default{sfx}.jpg", "", *c["default"])
    for f in glob.glob(os.path.join(ROOT, "data", "idaho", "races", "*.yaml")):
        r = yaml.safe_load(open(f))
        office = r["office"] if isinstance(r["office"], str) else r["office"].get(lang) or r["office"]["en"]
        rid = os.path.basename(f)[:-5]
        og_race(f"{OG}/races/{rid}{sfx}.jpg", c["brand"], office, c["race_sub"], c["race_chip"])

# Instagram: feed (4:5) and story (9:16)
POSTS = {
    "purple": {
        "en": [("Is Idaho\npurple?", BOLD, 150, WHITE, 24), ("Everyone says it’s red.\nLet’s find out Nov 3.", REG, 56, SOFT, 20)],
        "es": [("¿Es Idaho\nmorado?", BOLD, 150, WHITE, 24), ("Todos dicen que es rojo.\nAveriguémoslo el 3 de nov.", REG, 56, SOFT, 20)],
        "chip": {"en": "Register by Fri Oct 23, 5 p.m.", "es": "Regístrese antes del 23 de oct, 5 p.m."},
    },
    "howto": {
        "en": [("Vote in Idaho.\nHere’s how.", BOLD, 120, WHITE, 24), ("✓ Am I registered?\n✎ Register to vote\n✉ Vote by mail\n→ Where do I vote?", REG, 60, SOFT, 20)],
        "es": [("Vote en Idaho.\nAsí se hace.", BOLD, 120, WHITE, 24), ("✓ ¿Estoy registrado?\n✎ Registrarme\n✉ Votar por correo\n→ ¿Dónde voto?", REG, 60, SOFT, 20)],
        "chip": {"en": "Deadline: Fri Oct 23, 5 p.m.", "es": "Fecha límite: vie 23 oct, 5 p.m."},
    },
}
for name, p in POSTS.items():
    for lang in ("en", "es"):
        sfx = "" if lang == "en" else "-es"
        insta(f"{SHARE}/{name}-feed{sfx}.jpg", 1080, 1350, p[lang], p["chip"][lang], 0.15)
        insta(f"{SHARE}/{name}-story{sfx}.jpg", 1080, 1920, p[lang], p["chip"][lang], 0.0)
print("cards done:", len(glob.glob(f"{OG}/**/*.jpg", recursive=True)), "previews,", len(glob.glob(f"{SHARE}/*.jpg")), "instagram")
