#!/usr/bin/env python3
# Mockup limpia de un chat de WhatsApp (9:16) con Sara agendando una CITA (México).
# Salida: set/whatsapp-cita.png (1080x1920)
from PIL import Image, ImageDraw, ImageFont, ImageOps
import os

W, H = 1080, 1920
AV = os.path.expanduser('~/Desktop/sara-persona/set/id-09.jpg')
OUT = os.path.expanduser('~/Desktop/sara-persona/set/whatsapp-cita.png')

ARIAL = '/System/Library/Fonts/Supplemental/Arial.ttf'
ARIALB = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
def font(path, sz): return ImageFont.truetype(path, sz)

f_name = font(ARIALB, 40)
f_sub  = font(ARIAL, 28)
f_msg  = font(ARIAL, 36)
f_time = font(ARIAL, 24)

# colores
HEADER = (7, 94, 84)       # WhatsApp verde oscuro
WALL   = (236, 229, 221)   # fondo chat
OUTB   = (220, 248, 198)   # burbuja saliente (paciente)
INB    = (255, 255, 255)   # burbuja Sara
TXT    = (30, 30, 30)
GREY   = (120, 120, 120)
BLUE   = (52, 183, 241)    # doble check

img = Image.new('RGB', (W, H), WALL)
d = ImageDraw.Draw(img)

# ---- header ----
HH = 170
d.rectangle([0, 0, W, HH], fill=HEADER)
# back arrow
d.line([(38, HH//2), (70, HH//2-22)], fill='white', width=6)
d.line([(38, HH//2), (70, HH//2+22)], fill='white', width=6)
# avatar circular
av = Image.open(AV).convert('RGB')
s = min(av.size); av = av.crop(((av.width-s)//2, 0, (av.width-s)//2+s, s)).resize((110, 110))
mask = Image.new('L', (110, 110), 0); ImageDraw.Draw(mask).ellipse([0, 0, 110, 110], fill=255)
img.paste(av, (95, (HH-110)//2), mask)
# nombre + subtítulo
d.text((225, 48), 'Sara', font=f_name, fill='white')
d.text((225, 100), 'Clínica Dental Sonrisa · en línea', font=f_sub, fill=(210, 235, 230))

# ---- helpers de burbujas ----
PAD = 26
MAXW = 620
GAP = 26
y = HH + 40

def wrap(text, fnt, maxw):
    words = text.split(); lines = []; cur = ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if d.textlength(t, font=fnt) <= maxw: cur = t
        else: lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def bubble(text, side, t, read=False):
    global y
    lines = wrap(text, f_msg, MAXW)
    lh = f_msg.getbbox('Ay')[3] + 12
    tw = max(d.textlength(l, font=f_msg) for l in lines)
    bw = int(tw) + PAD*2
    bh = lh*len(lines) + PAD*2 + 14
    if side == 'out':
        x0 = W - 40 - bw; col = OUTB
    else:
        x0 = 40; col = INB
    d.rounded_rectangle([x0, y, x0+bw, y+bh], radius=26, fill=col)
    ty = y + PAD
    for l in lines:
        d.text((x0+PAD, ty), l, font=f_msg, fill=TXT); ty += lh
    # hora + checks
    tstr = t
    tx = x0 + bw - PAD - d.textlength(tstr, font=f_time) - (44 if side=='out' else 0)
    d.text((tx, y+bh-38), tstr, font=f_time, fill=GREY)
    if side == 'out':
        cx = x0 + bw - PAD - 34; cy = y+bh-34
        cc = BLUE if read else GREY
        for off in (0, 12):
            d.line([(cx+off, cy+8),(cx+off+8, cy+16)], fill=cc, width=4)
            d.line([(cx+off+8, cy+16),(cx+off+22, cy-2)], fill=cc, width=4)
    y += bh + GAP

# ---- conversación (México, cita) ----
bubble('Hola, quiero agendar una cita', 'out', '9:41', read=True)
bubble('¡Hola! Claro que sí. Tengo lugar mañana a las 10:00, 12:30 o 4:00 pm. ¿Cuál te acomoda?', 'in', '9:41')
bubble('El de las 12:30, por favor', 'out', '9:42', read=True)
bubble('¡Listo! Te agendé mañana a las 12:30 con el Dr. García. Te mando un recordatorio por aquí. ¡Nos vemos!', 'in', '9:42')

# ---- barra de input ----
IB = 150
d.rectangle([0, H-IB, W, H], fill=(240, 240, 240))
d.rounded_rectangle([40, H-IB+28, W-170, H-28], radius=44, fill='white')
d.text((72, H-IB+62), 'Escribe un mensaje', font=f_msg, fill=(160,160,160))
d.ellipse([W-140, H-IB+30, W-40, H-30], fill=HEADER)  # botón enviar
d.polygon([(W-108, H-IB+62),(W-108, H-62),(W-58, H-90)], fill='white')  # avioncito simple

img.save(OUT)
print('OK ->', OUT, img.size)
