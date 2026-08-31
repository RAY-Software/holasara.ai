#!/usr/bin/env python3
# Estados acumulativos de un chat de WhatsApp (9:16) con paso de PAGO (Stripe).
# Paciente = derecha/verde, Sara = izq/blanco, pay = tarjeta de pago (Sara).
from PIL import Image, ImageDraw, ImageFont
import os
D = os.path.expanduser('~/Desktop/sara-persona/reel/')
AV = os.path.expanduser('~/Desktop/sara-persona/existing/sara-thumb.png')
os.makedirs(D, exist_ok=True)
BOLD='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
REG ='/System/Library/Fonts/Supplemental/Arial.ttf'
UNI ='/System/Library/Fonts/Supplemental/Arial Unicode.ttf'
W,H=1080,1920
HEADER=(18,140,126); WALL=(236,229,221)
INB=(255,255,255); OUTB=(220,248,198)
TXT=(20,20,20); GREY=(120,120,120); BLUE=(52,183,241)
STRIPE=(99,91,255); GREEN=(37,167,90)
f_name=ImageFont.truetype(BOLD,40); f_on=ImageFont.truetype(REG,28)
f_msg=ImageFont.truetype(REG,38); f_time=ImageFont.truetype(REG,24)
f_chk=ImageFont.truetype(UNI,26)
f_pb=ImageFont.truetype(BOLD,42); f_amt=ImageFont.truetype(BOLD,64)
f_sm=ImageFont.truetype(REG,26); f_btn=ImageFont.truetype(BOLD,36)
HH=170; IB=120; PAD=24; MAXW=680; GAP=22

MSGS=[
 ('out','Hola, necesito una cita con el dermatólogo','23:47'),
 ('in','¡Hola! Tengo lugar mañana a las 10:00, 12:30 o 16:00. ¿Cuál preferís?','23:47'),
 ('out','La de las 12:30','23:48'),
 ('in','¡Listo! Te agendé la cita. Para confirmarla, dejá la seña de la consulta:','23:48'),
 ('pay','','23:48'),
 ('out','Pagué','23:49'),
 ('in','¡Pago recibido! Tu cita quedó confirmada. ¡Que descanses!','23:49'),
]

def wrap(d,text,fnt,maxw):
    out=[]; cur=''
    for w in text.split():
        t=(cur+' '+w).strip()
        if d.textlength(t,font=fnt)<=maxw: cur=t
        else: out.append(cur); cur=w
    if cur: out.append(cur)
    return out

PAY_W=560; PAY_H=300
def measure(d,side,text):
    if side=='pay': return None,None,PAY_W,PAY_H
    lines=wrap(d,text,f_msg,MAXW)
    lh=f_msg.getbbox('Ay')[3]+12
    tw=max(d.textlength(l,font=f_msg) for l in lines)
    bw=int(tw)+PAD*2; bh=lh*len(lines)+PAD*2+16
    return lines,lh,bw,bh

def draw_pay(d,img,x0,y):
    bw,bh=PAY_W,PAY_H
    d.rounded_rectangle([x0,y,x0+bw,y+bh],radius=26,fill=INB)
    # icono tarjeta
    d.rounded_rectangle([x0+28,y+30,x0+96,y+78],radius=8,fill=STRIPE)
    d.rectangle([x0+28,y+42,x0+96,y+54],fill=(255,255,255,60))
    d.text((x0+118,y+34),'Pago de consulta',font=f_pb,fill=TXT)
    d.text((x0+28,y+96),'Seña',font=f_sm,fill=GREY)
    d.text((x0+28,y+120),'$500',font=f_amt,fill=TXT)
    # botón
    by=y+bh-96
    d.rounded_rectangle([x0+28,by,x0+bw-28,by+56],radius=28,fill=STRIPE)
    d.text((x0+(bw-d.textlength('Pagar de forma segura',font=f_btn))/2,by+9),'Pagar de forma segura',font=f_btn,fill='white')
    d.text((x0+bw-d.textlength('Powered by Stripe',font=f_sm)-28,y+bh-30),'Powered by Stripe',font=f_sm,fill=(140,140,150))
    return bh

def draw_header(img,d):
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
    msgs=MSGS[:n]
    y=HH+40
    for side,text,tm in msgs:
        blk=measure(d,side,text)
        lines,lh,bw,bh=blk
        x0=(W-40-bw) if side=='out' else 40
        if side=='pay':
            draw_pay(d,img,x0,y)
        else:
            col=OUTB if side=='out' else INB
            d.rounded_rectangle([x0,y,x0+bw,y+bh],radius=26,fill=col)
            ty=y+PAD
            for l in lines: d.text((x0+PAD,ty),l,font=f_msg,fill=TXT); ty+=lh
            tx=x0+bw-PAD-d.textlength(tm,font=f_time)-(40 if side=='out' else 0)
            d.text((tx,y+bh-36),tm,font=f_time,fill=GREY)
            if side=='out':
                d.text((x0+bw-PAD-34,y+bh-40),'✓✓',font=f_chk,fill=BLUE)
        y+=bh+GAP
    draw_header(img,d)
    d.rectangle([0,H-IB,W,H],fill=(240,240,240))
    d.rounded_rectangle([30,H-IB+22,W-150,H-22],radius=40,fill='white')
    d.text((60,H-IB+40),'Mensaje',font=f_msg,fill=(170,170,170))
    d.ellipse([W-130,H-IB+20,W-30,H-20],fill=HEADER)
    img.save(D+name); print('OK',name)

for i in range(1,len(MSGS)+1):
    render(i,f'wa{i}.png')
print('N=',len(MSGS))
