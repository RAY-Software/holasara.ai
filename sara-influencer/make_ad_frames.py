#!/usr/bin/env python3
# Frames compuestos para el ad de ROI: overlay hook (seg1), canvas dashboard (seg2), CTA (seg3)
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter
import os
D = os.path.expanduser('~/Desktop/sara-persona/reel/')
S = os.path.expanduser('~/Desktop/sara-persona/set/')
os.makedirs(D, exist_ok=True)
BOLD='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
REG ='/System/Library/Fonts/Supplemental/Arial.ttf'
W,H=1080,1920

def band_caption(name, text, band_y, fs=52):
    img=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(img)
    f=ImageFont.truetype(BOLD,fs)
    while d.textlength(text,font=f)>980: fs-=2; f=ImageFont.truetype(BOLD,fs)
    tw=d.textlength(text,font=f); bw=int(tw)+80; bx=(W-bw)//2
    d.rounded_rectangle([bx,band_y,bx+bw,band_y+130],radius=28,fill=(0,0,0,140))
    d.text(((W-tw)/2+2,band_y+38+2),text,font=f,fill=(0,0,0,180))
    d.text(((W-tw)/2,band_y+38),text,font=f,fill=(255,255,255,255))
    img.save(D+name); print('OK',name)

# ---- seg1: hook overlay (abajo) ----
band_caption('adcap-hook.png','¿Tu Instagram trae pacientes?',1560,54)

# ---- seg2: canvas dashboard ----
bg=(238,242,246)
canvas=Image.new('RGB',(W,H),bg); d=ImageDraw.Draw(canvas)
ft=ImageFont.truetype(BOLD,60); fs=ImageFont.truetype(REG,34)
title='El ROI de tu Instagram, medido'
d.text(((W-d.textlength(title,font=ft))/2,150),title,font=ft,fill=(24,32,40))
# dashboard con sombra + card blanca
dash=Image.open(S+'conversiones-real.png').convert('RGB')
dw=1000; dh=int(dash.height*dw/dash.width); dash=dash.resize((dw,dh))
card=Image.new('RGB',(dw+48,dh+48),(255,255,255))
card.paste(dash,(24,24))
# sombra
sh=Image.new('RGBA',(W,H),(0,0,0,0)); ds=ImageDraw.Draw(sh)
cx=(W-card.width)//2; cy=(H-card.height)//2+40
ds.rounded_rectangle([cx-6,cy+14,cx+card.width+6,cy+card.height+18],radius=28,fill=(0,0,0,60))
sh=sh.filter(ImageFilter.GaussianBlur(18))
canvas.paste(sh,(0,0),sh)
rc=ImageOps.expand(card,border=0)
mask=Image.new('L',card.size,0); ImageDraw.Draw(mask).rounded_rectangle([0,0,card.width,card.height],radius=24,fill=255)
canvas.paste(card,(cx,cy),mask)
note='Datos reales de una clínica · últimos 90 días'
d.text(((W-d.textlength(note,font=fs))/2,cy+card.height+40),note,font=fs,fill=(90,100,110))
canvas.save(D+'ad-dash.png'); print('OK ad-dash.png')

# ---- seg3: CTA ----
cta=Image.new('RGB',(W,H),(232,240,236)); d=ImageDraw.Draw(cta)
# avatar Sara
av=Image.open(S+'../clips/franco-frame.jpg') if False else Image.open(os.path.expanduser('~/Desktop/sara-persona/set/id-09.jpg')).convert('RGB')
s=min(av.size); av=av.crop(((av.width-s)//2,0,(av.width-s)//2+s,s)).resize((300,300))
m=Image.new('L',(300,300),0); ImageDraw.Draw(m).ellipse([0,0,300,300],fill=255)
cta.paste(av,((W-300)//2,360),m)
d.ellipse([(W-300)//2-6,360-6,(W-300)//2+306,360+306],outline=(120,160,140),width=6)
fh=ImageFont.truetype(BOLD,64); fsub=ImageFont.truetype(REG,40); fp=ImageFont.truetype(BOLD,52)
def ctext(y,txt,f,col):
    d.text(((W-d.textlength(txt,font=f))/2,y),txt,font=f,fill=col)
ctext(760,'Medí el ROI real',fh,(24,32,40))
ctext(838,'de tu Instagram',fh,(24,32,40))
ctext(960,'Sara lo mide por vos, sola.',fsub,(70,90,80))
# pill url
pill='holasara.ai'; pw=int(d.textlength(pill,font=fp))+120; px=(W-pw)//2; py=1120
d.rounded_rectangle([px,py,px+pw,py+110],radius=55,fill=(28,52,42))
d.text(((W-d.textlength(pill,font=fp))/2,py+28),pill,font=fp,fill=(255,255,255))
cta.save(D+'ad-cta.png'); print('OK ad-cta.png')
