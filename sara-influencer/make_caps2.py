#!/usr/bin/env python3
# Overlays 1080x1920 con banda + keywords por clip (auto-fit al ancho).
from PIL import Image, ImageDraw, ImageFont
import os
D = os.path.expanduser('~/Desktop/sara-persona/reel/')
os.makedirs(D, exist_ok=True)
BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
W, H = 1080, 1920
MAXW = 980

def make(name, text, band_y=1600, band_h=150, fs=52):
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(BOLD, fs)
    while d.textlength(text, font=f) > MAXW and fs > 28:
        fs -= 2; f = ImageFont.truetype(BOLD, fs)
    tw = d.textlength(text, font=f)
    bw = int(tw) + 80
    bx = (W - bw) // 2
    d.rounded_rectangle([bx, band_y, bx+bw, band_y+band_h], radius=30, fill=(0, 0, 0, 140))
    tx = (W - tw) / 2
    ty = band_y + (band_h - fs) / 2 - 4
    d.text((tx+2, ty+2), text, font=f, fill=(0, 0, 0, 180))
    d.text((tx, ty), text, font=f, fill=(255, 255, 255, 255))
    img.save(D + name); print('OK', name, 'fs', fs)

make('kc1.png', 'Recepcionista con IA')
make('kc2.png', 'Agenda  ·  Reagenda  ·  Cobra')
make('kc3.png', 'Reseñas Google  ·  Contenido IG')
