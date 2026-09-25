"""Generate background art with Gemini (no text, no people). Text is overlaid later by make_cards.py.
Usage: GEMINI_API_KEY=... python3 gen_art.py"""
import base64, json, os, sys, urllib.request

KEY = os.environ["GEMINI_API_KEY"]
MODEL = os.environ.get("GEMINI_IMAGE_MODEL", "gemini-3-pro-image")
OUT = os.path.join(os.path.dirname(__file__), "art")
BASE = ("A breathtaking wide landscape photograph-style illustration of Idaho: the jagged Sawtooth Mountains "
        "reflected in a calm alpine lake, sagebrush foothills in the foreground. Golden-hour sky that shifts "
        "smoothly from warm crimson red on the left to deep royal blue on the right, the two blending into a "
        "luminous violet-purple glow in the middle, as if the sky itself were asking a question. Hopeful, "
        "cinematic, inviting, high detail, soft light. Absolutely no text, no letters, no words, no logos, "
        "no flags, no people, no faces, no signs. {extra}")
JOBS = {
    "wide": ("16:9", "Keep the left third of the image darker and simpler (sky and shadowed hills) so white headline text can sit there."),
    "square": ("1:1", "Keep the top half of the image calmer (open sky) so a headline can sit there."),
    "tall": ("9:16", "Keep the top third and bottom quarter calmer (sky, still water) so text can sit there."),
}
for name, (ratio, extra) in JOBS.items():
    if len(sys.argv) > 1 and name not in sys.argv[1:]:
        continue
    body = {"contents": [{"parts": [{"text": BASE.format(extra=extra)}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": ratio}}}
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={KEY}",
        data=json.dumps(body).encode(), headers={"content-type": "application/json"})
    try:
        d = json.load(urllib.request.urlopen(req, timeout=240))
    except urllib.error.HTTPError as e:
        print(name, "HTTP", e.code, e.read()[:300]); continue
    parts = d["candidates"][0]["content"]["parts"]
    img = next((p["inlineData"] for p in parts if "inlineData" in p), None)
    if not img:
        print(name, "no image", json.dumps(d)[:300]); continue
    ext = "png" if "png" in img["mimeType"] else "jpg"
    path = os.path.join(OUT, f"{name}.{ext}")
    open(path, "wb").write(base64.b64decode(img["data"]))
    print(name, "->", path)
