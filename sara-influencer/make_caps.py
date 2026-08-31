#!/usr/bin/env python3
# Genera overlays 1080x1920 RGBA con una banda semitransparente + texto centrado.
from PIL import Image, ImageDraw, ImageFont
import os
D = os.path.expanduser('~/Desktop/sara-persona/reel/')
os.makedirs(D, exist_ok=True)
BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
W, H = 1080, 1920

def make(name, text, band_y, band_h, fs=46):
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    f = ImageFont.truetype(BOLD, fs)
    # banda redondeada semitransparente
    d.rounded_rectangle([40, band_y, W-40, band_y+band_h], radius=28, fill=(0, 0, 0, 130))
    tw = d.textlength(text, font=f)
    tx = (W - tw) / 2
    ty = band_y + (band_h - fs) / 2 - 4
    # sombra suave + texto
    d.text((tx+2, ty+2), text, font=f, fill=(0, 0, 0, 180))
    d.text((tx, ty), text, font=f, fill=(255, 255, 255, 255))
    img.save(D + name)
    print('OK', name)

make('cap1.png', 'Agendo tus citas por WhatsApp, sola, 24/7', 1560, 150, 44)
make('cap2.png', 'Ya funciona en clinicas reales', 90, 130, 48)
make('cap3.png', 'Sara responde y agenda en el sitio, sola', 1620, 150, 44)
