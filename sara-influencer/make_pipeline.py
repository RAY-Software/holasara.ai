#!/usr/bin/env python3
# 5 beats (1080x1920) del pipeline de contenido de Sara: feed -> ideas -> genera -> calendario -> ROI
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os, math
D=os.path.expanduser('~/Desktop/sara-persona/reel/')
IG=os.path.expanduser('~/Desktop/sara-persona/set/ig/')
os.makedirs(D,exist_ok=True)
BOLD='/System/Library/Fonts/Supplemental/Arial Bold.ttf'; REG='/System/Library/Fonts/Supplemental/Arial.ttf'
W,H=1080,1920
BG=(246,247,249); INK=(22,28,36); MUT=(120,128,140)
SAGE=(38,120,98); CARD=(255,255,255); LINE=(228,231,236)
IGP=[(245,133,41),(221,42,123),(129,52,175)]  # instagram gradient-ish
def F(p,s): return ImageFont.truetype(p,s)

def rr(d,box,r,fill,outline=None,width=1):
    d.rounded_rectangle(box,radius=r,fill=fill,outline=outline,width=width)

def shadow(img,box,r,blur=22,alpha=45,dy=12):
    sh=Image.new('RGBA',(W,H),(0,0,0,0)); ds=ImageDraw.Draw(sh)
    ds.rounded_rectangle([box[0],box[1]+dy,box[2],box[3]+dy],radius=r,fill=(0,0,0,alpha))
    img.alpha_composite(sh.filter(ImageFilter.GaussianBlur(blur)))

def crop_sq(im,sz):
    s=min(im.size); im=im.crop(((im.width-s)//2,(im.height-s)//2,(im.width-s)//2+s,(im.height-s)//2+s))
    return im.resize((sz,sz))

def top(img,d,n,title,sub=None):
    # pill
    pill=f'PASO {n} DE 6'; fp=F(BOLD,30); pw=int(d.textlength(pill,font=fp))+56
    px=(W-pw)//2; py=150
    rr(d,[px,py,px+pw,py+56],28,SAGE)
    d.text((px+28,py+12),pill,font=fp,fill='white')
    ft=F(BOLD,66); yy=246
    for ln in title:
        d.text(((W-d.textlength(ln,font=ft))/2,yy),ln,font=ft,fill=INK); yy+=76
    if sub:
        fs=F(REG,38); d.text(((W-d.textlength(sub,font=fs))/2,yy+6),sub,font=fs,fill=MUT)

def base():
    img=Image.new('RGBA',(W,H),BG+(255,)); return img,ImageDraw.Draw(img)

def ig_ring(d,cx,cy,r):
    for i,col in enumerate(IGP):
        d.arc([cx-r,cy-r,cx+r,cy+r],start=i*120-90,end=i*120+30,fill=col,width=8)

# ---------- BEAT 1: lee tu Instagram ----------
def beat1():
    img,d=base()
    top(img,d,1,['Lee tu Instagram'],'Analiza tu feed y tu audiencia')
    bx=[210,470,870,1660]; shadow(img,bx,40); rr(d,bx,40,CARD,LINE,2)
    # header IG
    ig_ring(d,290,560,46); av=crop_sq(Image.open(IG+'ig4.jpg').convert('RGB'),74)
    m=Image.new('L',(74,74),0); ImageDraw.Draw(m).ellipse([0,0,74,74],fill=255); img.paste(av,(253,523),m)
    d.text((360,524),'@clinica.estetica',font=F(BOLD,36),fill=INK)
    d.text((360,568),'128 publicaciones · 8.4k seguidores',font=F(REG,28),fill=MUT)
    # grid 3x3
    imgs=['ig1','ig2','ig3','ig5','ig6','ig4','ig2','ig3','ig1']
    gx,gy=246,640; tile=192; gap=8
    for i,nm in enumerate(imgs):
        r,c=divmod(i,3); x=gx+c*(tile+gap); y=gy+r*(tile+gap)
        t=crop_sq(Image.open(IG+nm+'.jpg').convert('RGB'),tile); img.paste(t,(x,y))
    # lupa "scanning"
    lx=740
    d.ellipse([lx,1180,lx+120,1300],outline=SAGE,width=8)
    d.line([lx+108,1288,lx+150,1330],fill=SAGE,width=10)
    img.convert('RGB').save(D+'pipe1.png'); print('pipe1')

# ---------- BEAT 2: propone ideas ----------
def beat2():
    img,d=base(); top(img,d,2,['Propone ideas'],'Contenido pensado para agendar')
    ideas=[('5 mitos del cuidado facial','#skincare #tips'),
           ('Antes y después: láser','#resultados #glow'),
           ('Tu rutina nocturna en 3 pasos','#rutina #piel')]
    y=470
    for tit,tags in ideas:
        bx=[130,y,950,y+230]; shadow(img,bx,28,blur=16,alpha=35,dy=8); rr(d,bx,28,CARD,LINE,2)
        # sparkle
        d.text((172,y+40),'✦',font=F(BOLD,48),fill=SAGE)
        d.text((250,y+42),tit,font=F(BOLD,44),fill=INK)
        d.text((250,y+112),tags,font=F(REG,34),fill=(120,120,200))
        rr(d,[250,y+160,250+220,y+160+52],26,(233,245,240)); d.text((278,y+170),'Aprobar idea',font=F(BOLD,28),fill=SAGE)
        y+=262
    img.convert('RGB').save(D+'pipe2.png'); print('pipe2')

# ---------- BEAT 3: genera contenido ----------
def beat3():
    img,d=base(); top(img,d,3,['Crea el contenido'],'Carruseles, reels y videos')
    items=[('ig1','Carrusel'),('ig3','Reel'),('ig6','Video'),('ig5','Carrusel')]
    gx,gy=150,480; tile=360; gap=30
    for i,(nm,badge) in enumerate(items):
        r,c=divmod(i,2); x=gx+c*(tile+gap); y=gy+r*(tile+gap)
        bx=[x,y,x+tile,y+tile]; shadow(img,bx,26,blur=14,alpha=35,dy=8)
        t=crop_sq(Image.open(IG+nm+'.jpg').convert('RGB'),tile)
        m=Image.new('L',(tile,tile),0); ImageDraw.Draw(m).rounded_rectangle([0,0,tile,tile],radius=26,fill=255)
        img.paste(t,(x,y),m)
        bw=int(d.textlength(badge,font=F(BOLD,30)))+40
        rr(d,[x+16,y+16,x+16+bw,y+16+48],24,(0,0,0)); d.text((x+36,y+24),badge,font=F(BOLD,30),fill='white')
    img.convert('RGB').save(D+'pipe3.png'); print('pipe3')

# ---------- BEAT 4: calendario ----------
def beat4():
    img,d=base(); top(img,d,4,['Publica por ti'],'Tú apruebas, Sara publica')
    bx=[130,480,950,1240]; shadow(img,bx,32); rr(d,bx,32,CARD,LINE,2)
    d.text((180,520),'Septiembre',font=F(BOLD,44),fill=INK)
    days=['L','M','M','J','V','S','D']; cx0=180; cw=108; cy0=610
    for i,dd in enumerate(days): d.text((cx0+i*cw+38,cy0),dd,font=F(BOLD,30),fill=MUT)
    posts={3:(221,42,123),9:(38,120,98),12:(245,133,41),18:(38,120,98),24:(129,52,175),27:(221,42,123)}
    num=1
    for r in range(4):
        for c in range(7):
            x=cx0+c*cw; y=cy0+64+r*128
            if num<=28:
                d.text((x+30,y+20),str(num),font=F(REG,34),fill=INK)
                if num in posts:
                    d.ellipse([x+34,y+72,x+66,y+104],fill=posts[num])
                num+=1
    rr(d,[560,1150,910,1210],28,(233,245,240)); d.text((588,1160),'6 posts programados',font=F(BOLD,30),fill=SAGE)
    img.convert('RGB').save(D+'pipe4.png'); print('pipe4')

# ---------- BEAT 5: el paciente reacciona y escribe a Sara ----------
def bub(d,text,side,y):
    f=F(REG,36); maxw=560
    words=text.split(); lines=[]; cur=''
    for w in words:
        t=(cur+' '+w).strip()
        if d.textlength(t,font=f)<=maxw: cur=t
        else: lines.append(cur); cur=w
    if cur: lines.append(cur)
    lh=f.getbbox('Ay')[3]+10; tw=max(d.textlength(l,font=f) for l in lines)
    bw=int(tw)+44; bh=lh*len(lines)+40
    x0=(W-90-bw) if side=='out' else 90
    col=(220,248,198) if side=='out' else CARD
    d.rounded_rectangle([x0,y,x0+bw,y+bh],22,col,LINE,1)
    ty=y+18
    for l in lines: d.text((x0+22,ty),l,font=f,fill=INK); ty+=lh
    return y+bh+20

def beat5():
    img,d=base(); top(img,d,5,['Reacciona y te','escribe'],'Del reel al chat con Sara')
    # reel thumbnail (portrait)
    rw,rh=340,454; rx=(W-rw)//2; ry=460
    shadow(img,[rx,ry,rx+rw,ry+rh],26,blur=16,alpha=40,dy=8)
    im=Image.open(IG+'ig3.jpg').convert('RGB')
    tr=im.resize((rw,int(im.height*rw/im.width)))
    if tr.height<rh: tr=im.resize((int(im.width*rh/im.height),rh))
    tr=tr.crop(((tr.width-rw)//2,(tr.height-rh)//2,(tr.width-rw)//2+rw,(tr.height-rh)//2+rh))
    m=Image.new('L',(rw,rh),0); ImageDraw.Draw(m).rounded_rectangle([0,0,rw,rh],radius=26,fill=255)
    img.paste(tr,(rx,ry),m)
    # play
    pcx,pcy=rx+rw//2,ry+rh//2
    d.ellipse([pcx-46,pcy-46,pcx+46,pcy+46],fill=(255,255,255))
    d.polygon([(pcx-14,pcy-24),(pcx-14,pcy+24),(pcx+26,pcy)],fill=(30,30,30))
    d.rounded_rectangle([rx+16,ry+16,rx+16+118,ry+16+44],20,(0,0,0)); d.text((rx+36,ry+22),'Reel',font=F(BOLD,28),fill='white')
    d.text((rx+18,ry+rh-46),'1.2k me gusta',font=F(BOLD,30),fill='white')
    # chat
    y=ry+rh+40
    y=bub(d,'¡Me encantó! ¿Tienen cita esta semana?','out',y)
    y=bub(d,'¡Hola! Claro. Te agendo ahora mismo.','in',y)
    img.convert('RGB').save(D+'pipe5.png'); print('pipe5')

# ---------- BEAT 6: mide citas y ROI ----------
def beat6():
    img,d=base(); top(img,d,6,['Mide las citas','y tu ROI'],'De cada post a la agenda')
    stats=[('6','citas nuevas','desde tu contenido'),
           ('$9k','MXN en agenda','valor estimado'),
           ('43%','de tus DMs de IG','atribuidos')]
    y=560
    for big,mid,sub in stats:
        bx=[150,y,930,y+230]; shadow(img,bx,28,blur=16,alpha=35,dy=8); rr(d,bx,28,CARD,LINE,2)
        d.text((196,y+40),big,font=F(BOLD,96),fill=SAGE)
        d.text((420,y+64),mid,font=F(BOLD,46),fill=INK)
        d.text((420,y+128),sub,font=F(REG,34),fill=MUT)
        y+=262
    img.convert('RGB').save(D+'pipe6.png'); print('pipe6')

beat1(); beat2(); beat3(); beat4(); beat5(); beat6()
