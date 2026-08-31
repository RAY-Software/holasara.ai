#!/usr/bin/env python3
# Estados acumulativos de un chat WhatsApp (9:16) para el PASO 5 del pipeline:
# el paciente reacciona a un reel y agenda con Sara. Paciente=derecha/verde, Sara=izq/blanco.
from PIL import Image, ImageDraw, ImageFont
import os
D=os.path.expanduser('~/Desktop/sara-persona/reel/')
AV=os.path.expanduser('~/Desktop/sara-persona/existing/sara-thumb.png')
REEL=os.path.expanduser('~/Desktop/sara-persona/set/ig/ig3.jpg')
BOLD='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
REG ='/System/Library/Fonts/Supplemental/Arial.ttf'
UNI ='/System/Library/Fonts/Supplemental/Arial Unicode.ttf'
W,H=1080,1920
HEADER=(18,140,126); WALL=(236,229,221)
INB=(255,255,255); OUTB=(220,248,198)
TXT=(20,20,20); GREY=(120,120,120); BLUE=(52,183,241)
f_name=ImageFont.truetype(BOLD,40); f_on=ImageFont.truetype(REG,28)
f_msg=ImageFont.truetype(REG,38); f_time=ImageFont.truetype(REG,24); f_chk=ImageFont.truetype(UNI,26)
HH=170; IB=120; PAD=24; MAXW=620; GAP=22

# (side, type, text, time)
MSGS=[
 ('out','reel','¡Me encantó este reel!','23:12'),
 ('out','text','¿Tienen cita esta semana?','23:12'),
 ('in','text','¡Hola! Claro. ¿Te agendo el jueves a las 4?','23:12'),
 ('out','text','¡Sí, porfa!','23:13'),
 ('in','text','¡Listo! Cita confirmada. Te mando el recordatorio.','23:13'),
]

def wrap(d,text,fnt,maxw):
    out=[]; cur=''
    for w in text.split():
        t=(cur+' '+w).strip()
        if d.textlength(t,font=fnt)<=maxw: cur=t
        else: out.append(cur); cur=w
    if cur: out.append(cur)
    return out

RW,RH=300,380  # reel media
def measure(d,typ,text):
    if typ=='reel':
        lines=wrap(d,text,f_msg,RW-8)
        lh=f_msg.getbbox('Ay')[3]+8
        bw=RW+PAD*2; bh=RH+lh*len(lines)+PAD*2+30
        return lines,lh,bw,bh
    lines=wrap(d,text,f_msg,MAXW)
    lh=f_msg.getbbox('Ay')[3]+12
    tw=max(d.textlength(l,font=f_msg) for l in lines)
    bw=int(tw)+PAD*2; bh=lh*len(lines)+PAD*2+16
    return lines,lh,bw,bh

def crop(im,w,h):
    r=im.resize((w,int(im.height*w/im.width)))
    if r.height<h: r=im.resize((int(im.width*h/im.height),h))
    return r.crop(((r.width-w)//2,(r.height-h)//2,(r.width-w)//2+w,(r.height-h)//2+h))

def header(img,d):
    d.rectangle([0,0,W,HH],fill=HEADER)
    d.line([(40,HH//2),(72,HH//2-22)],fill='white',width=6)
    d.line([(40,HH//2),(72,HH//2+22)],fill='white',width=6)
    av=Image.open(AV).convert('RGB'); s=min(av.size)
    av=av.crop(((av.width-s)//2,0,(av.width-s)//2+s,s)).resize((100,100))
    m=Image.new('L',(100,100),0); ImageDraw.Draw(m).ellipse([0,0,100,100],fill=255)
    img.paste(av,(96,(HH-100)//2),m)
    d.text((216,50),'Sara',font=f_name,fill='white')
    d.text((216,100),'En línea',font=f_on,fill=(210,235,230))

def render(n,name):
    img=Image.new('RGB',(W,H),WALL); d=ImageDraw.Draw(img)
    y=HH+40
    for side,typ,text,tm in MSGS[:n]:
        lines,lh,bw,bh=measure(d,typ,text)
        x0=(W-40-bw) if side=='out' else 40
        col=OUTB if side=='out' else INB
        d.rounded_rectangle([x0,y,x0+bw,y+bh],radius=26,fill=col)
        if typ=='reel':
            th=crop(Image.open(REEL).convert('RGB'),RW,RH)
            m=Image.new('L',(RW,RH),0); ImageDraw.Draw(m).rounded_rectangle([0,0,RW,RH],radius=18,fill=255)
            img.paste(th,(x0+PAD,y+PAD),m)
            # play + badge
            pcx,pcy=x0+PAD+RW//2,y+PAD+RH//2
            d.ellipse([pcx-34,pcy-34,pcx+34,pcy+34],fill=(255,255,255))
            d.polygon([(pcx-10,pcy-16),(pcx-10,pcy+16),(pcx+18,pcy)],fill=(30,30,30))
            d.rounded_rectangle([x0+PAD+12,y+PAD+12,x0+PAD+12+92,y+PAD+12+36],16,(0,0,0)); d.text((x0+PAD+26,y+PAD+16),'Reel',font=ImageFont.truetype(BOLD,24),fill='white')
            ty=y+PAD+RH+14
            for l in lines: d.text((x0+PAD,ty),l,font=f_msg,fill=TXT); ty+=lh
        else:
            ty=y+PAD
            for l in lines: d.text((x0+PAD,ty),l,font=f_msg,fill=TXT); ty+=lh
        tx=x0+bw-PAD-d.textlength(tm,font=f_time)-(40 if side=='out' else 0)
        d.text((tx,y+bh-36),tm,font=f_time,fill=GREY)
        if side=='out': d.text((x0+bw-PAD-34,y+bh-40),'✓✓',font=f_chk,fill=BLUE)
        y+=bh+GAP
    header(img,d)
    d.rectangle([0,H-IB,W,H],fill=(240,240,240))
    d.rounded_rectangle([30,H-IB+22,W-150,H-22],radius=40,fill='white')
    d.text((60,H-IB+40),'Mensaje',font=f_msg,fill=(170,170,170))
    d.ellipse([W-130,H-IB+20,W-30,H-20],fill=HEADER)
    img.save(D+name); print('OK',name)

for i in range(1,len(MSGS)+1): render(i,f'ws{i}.png')
print('N',len(MSGS))
