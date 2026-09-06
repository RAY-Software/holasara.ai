// Genera public/og/home-en.jpg (1200x630) con el hero del /en: wordmark, kicker,
// titular en cuatro líneas y la composición de los tres retratos (Sara al frente).
// Mismo template visual que el resto de public/og/*. Sin dependencias: arma un HTML
// con las fuentes del sitio (node_modules) y los retratos (public/equipo) embebidos
// en base64, lo renderiza con Chrome headless a 2x y lo baja a JPG con sips (macOS).
//
//   node scripts/og-home-en.mjs
//
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const OUT = 'public/og/home-en.jpg';
const b64 = (p) => readFileSync(p).toString('base64');
const font = (name) => b64(`node_modules/@fontsource-variable/${name}/files/${name}-latin-wght-normal.woff2`);
const img = (p) => `data:image/jpeg;base64,${b64(p)}`;

// Copy del hero de src/pages/[lang]/index.astro (dict.en). El kicker va acortado
// para que entre en una línea a 20px.
const kicker = 'The AI team for dental offices and med spas';
const h1 = ['Your front desk,', 'your marketing,', 'your books.', 'One AI team.'];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Archivo';src:url(data:font/woff2;base64,${font('archivo')}) format('woff2');font-weight:100 900}
@font-face{font-family:'Inter';src:url(data:font/woff2;base64,${font('inter')}) format('woff2');font-weight:100 900}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px;overflow:hidden;background:#eef1ee;font-family:'Inter',sans-serif;color:#14261f}
.card{position:relative;width:1200px;height:630px;display:flex}
.left{position:relative;width:760px;height:630px;padding:58px 0 0 64px;background:#eef1ee}
.wm{font-family:'Archivo',sans-serif;font-weight:900;font-size:46px;letter-spacing:-0.06em;line-height:1;display:inline-flex;align-items:center;gap:.10em}
.caret{display:inline-block;width:.34em;height:.76em;background:#3fe08a;transform:translateY(.02em)}
.kicker{position:absolute;left:64px;top:214px;display:flex;align-items:center;gap:12px;font-weight:600;font-size:20px;letter-spacing:.14em;text-transform:uppercase;color:#1a6349;white-space:nowrap}
.kicker i{display:inline-block;width:10px;height:10px;border-radius:50%;background:#3fe08a}
h1{position:absolute;left:62px;top:258px;font-family:'Archivo',sans-serif;font-weight:900;font-size:60px;line-height:1.02;letter-spacing:-0.025em}
h1 b{display:block;font-weight:900;color:#14261f} h1 em{display:block;font-style:normal;font-weight:900;color:#1a6349}
.url{position:absolute;left:64px;bottom:44px;font-weight:600;font-size:22px;color:#1a6349}
.right{position:relative;width:440px;height:630px;background:#fff;overflow:hidden}
.glow{position:absolute;right:-160px;top:-180px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(63,224,138,.40),rgba(63,224,138,0) 70%);filter:blur(24px)}
.p{position:absolute;overflow:hidden;background:#eef1ee;border:1px solid #e4e8e4}
.p img{width:100%;height:100%;object-fit:cover;object-position:top;display:block}
.tag{position:absolute;display:flex;align-items:center;gap:6px;white-space:nowrap;background:rgba(238,241,238,.96);border-radius:999px;padding:6px 11px;font-size:13px;font-weight:600;color:#14261f;box-shadow:0 2px 8px rgba(20,38,31,.18)}
.tag i{width:7px;height:7px;border-radius:50%;background:#3fe08a;display:inline-block} .tag span{color:#5e6b62;font-weight:500}
.dn{left:26px;top:96px;width:178px;height:262px;border-radius:18px;transform:rotate(-6deg);box-shadow:0 18px 40px -24px rgba(20,38,31,.45)}
.mi{right:30px;top:96px;width:178px;height:262px;border-radius:18px;transform:rotate(6deg);box-shadow:0 18px 40px -24px rgba(20,38,31,.45)}
.sa{left:50%;bottom:64px;width:228px;height:304px;margin-left:-114px;border-radius:24px;border:2px solid #eef1ee;box-shadow:0 28px 60px -28px rgba(20,38,31,.55)}
</style></head><body><div class="card">
<div class="left">
  <div class="wm">sara<span class="caret"></span></div>
  <div class="kicker"><i></i>${kicker}</div>
  <h1><b>${h1[0]}</b><b>${h1[1]}</b><em>${h1[2]}</em><em>${h1[3]}</em></h1>
  <div class="url">holasara.ai</div>
</div>
<div class="right">
  <div class="glow"></div>
  <div class="p dn"><img src="${img('public/equipo/daniel.jpg')}"><div class="tag" style="left:10px;top:10px"><i></i>Daniel <span>· Finance</span></div></div>
  <div class="p mi"><img src="${img('public/equipo/mia.jpg')}"><div class="tag" style="right:10px;top:10px"><i></i>Mia <span>· Marketing</span></div></div>
  <div class="p sa"><img src="${img('public/equipo/sara.jpg')}"><div class="tag" style="left:50%;bottom:12px;transform:translateX(-50%)"><i></i>Sara <span>· Front desk</span></div></div>
</div>
</div></body></html>`;

const dir = join(tmpdir(), 'sara-og');
mkdirSync(dir, { recursive: true });
const htmlPath = join(dir, 'home-en.html');
const png = join(dir, 'home-en.png');
writeFileSync(htmlPath, html);
execFileSync(CHROME, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=2',
  '--window-size=1200,630', '--virtual-time-budget=3000', `--screenshot=${png}`, `file://${htmlPath}`,
], { stdio: 'ignore' });
execFileSync('sips', ['-z', '630', '1200', png], { stdio: 'ignore' });
execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', png, '--out', OUT], { stdio: 'ignore' });
console.log(`✓ ${OUT}`);
