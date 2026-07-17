#!/usr/bin/env python3
# Regenera las OG images con el logo Complejo oficial.
# Descarga las fuentes de marca automáticamente.
# Uso desde la raíz del proyecto:  python3 scripts/build-og.py
import os, urllib.request
from PIL import Image, ImageDraw, ImageFont

FONTS = {
    "Inter-800.ttf": "https://raw.githubusercontent.com/fontsource/font-files/main/fonts/google/inter/files/inter-latin-800-normal.woff2",
    "Inter-600.ttf": "https://raw.githubusercontent.com/fontsource/font-files/main/fonts/google/inter/files/inter-latin-600-normal.woff2",
    "Inter-500.ttf": "https://raw.githubusercontent.com/fontsource/font-files/main/fonts/google/inter/files/inter-latin-500-normal.woff2",
    "JBMono-600.ttf": "https://raw.githubusercontent.com/fontsource/font-files/main/fonts/google/jetbrains-mono/files/jetbrains-mono-latin-600-normal.woff2",
}
FONT_DIR = os.path.join(os.path.dirname(__file__), ".fonts")

def ensure_fonts():
    os.makedirs(FONT_DIR, exist_ok=True)
    try:
        from fontTools.ttLib import TTFont
    except ImportError:
        os.system("pip install --quiet fonttools brotli")
        from fontTools.ttLib import TTFont
    for name, url in FONTS.items():
        ttf = os.path.join(FONT_DIR, name)
        if os.path.exists(ttf):
            continue
        woff2 = ttf.replace(".ttf", ".woff2")
        print(f"  descargando {name}…")
        urllib.request.urlretrieve(url, woff2)
        f = TTFont(woff2); f.flavor = None; f.save(ttf); os.remove(woff2)

def font(name, size): return ImageFont.truetype(os.path.join(FONT_DIR, name), size)

def content_crop(im, thr=10):
    a = im.getchannel("A")
    bbox = a.point(lambda p: 255 if p > thr else 0).getbbox()
    return im.crop(bbox) if bbox else im

THEMES = {
    "light": dict(out="public/og-image.png", logo="public/brand/ComplejoClaro.png",
        bg=(250,250,250), bar=(185,83,25), eyebrow=(185,83,25),
        head=(22,43,67), body=(44,62,80), sub=(100,116,139)),
    "dark": dict(out="public/og-image-dark.png", logo="public/brand/ComplejoOscuro.png",
        bg=(15,20,28), bar=(230,95,25), eyebrow=(230,95,25),
        head=(226,232,240), body=(203,213,225), sub=(148,163,184)),
}
W, H = 1200, 630

def main():
    print("Preparando fuentes de marca…")
    ensure_fonts()
    for theme, c in THEMES.items():
        img = Image.new("RGBA", (W, H), c["bg"] + (255,))
        d = ImageDraw.Draw(img)
        d.rectangle([0, 0, 10, H], fill=c["bar"] + (255,))
        logo = content_crop(Image.open(c["logo"]).convert("RGBA"))
        scale = 300 / logo.height
        logo = logo.resize((round(logo.width*scale), 300), Image.LANCZOS)
        lx, ly = 70, (H - logo.height)//2
        img.alpha_composite(logo, (lx, ly))
        tx = min(lx + logo.width + 60, 760)
        d.text((tx, 150), "PORTFOLIO ADAPTATIVO", font=font("JBMono-600.ttf", 22), fill=c["eyebrow"]+(255,))
        d.text((tx-2, 205), "David Naranjo", font=font("Inter-800.ttf", 58), fill=c["head"]+(255,))
        d.text((tx-2, 275), "Ramírez", font=font("Inter-800.ttf", 58), fill=c["head"]+(255,))
        d.text((tx, 360), "Data Science · Desarrollo Full-Stack", font=font("Inter-500.ttf", 27), fill=c["body"]+(255,))
        d.text((tx, 430), "El portfolio que se recompila", font=font("Inter-600.ttf", 23), fill=c["sub"]+(255,))
        d.text((tx, 462), "según quién lo visita.", font=font("Inter-600.ttf", 23), fill=c["sub"]+(255,))
        img.convert("RGB").save(c["out"], "PNG")
        print(f"  ✓ generada: {c['out']}")
    print("Listo.")

if __name__ == "__main__":
    main()