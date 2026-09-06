// Genera las tarjetas OG (1200x630) de las landings con slug localizado (PR #80):
// recordatorios, recepcionista virtual, answering service, contabilidad, SEO dental,
// SEO estética, AEO e integraciones, en ES y EN. Mismo template que public/og/*:
// panel claro con wordmark, kicker, titular (última parte en pino) y "holasara.ai",
// foto a la derecha. Sin dependencias: HTML con fuentes (node_modules) y foto
// embebidas en base64, Chrome headless a 2x y sips (macOS).
//
//   node scripts/og-landings.mjs            # todas
//   node scripts/og-landings.mjs aeo-en     # una sola (nombre del archivo sin .jpg)
//
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const b64 = (p) => readFileSync(p).toString('base64');
const font = (name) => b64(`node_modules/@fontsource-variable/${name}/files/${name}-latin-wght-normal.woff2`);
const FONTS = { archivo: font('archivo'), inter: font('inter') };

// Cada tarjeta: archivo de salida, kicker, líneas en tinta (`lines`) y en pino
// (`accent`), foto y su encuadre (object-position). `size` = tamaño del titular
// (60 por defecto; 54-56 cuando una línea pasa de ~18 caracteres).
const CARDS = [
  { out: 'reminders-es', kicker: 'Recordatorio de citas por WhatsApp', lines: ['Recordatorios', 'por WhatsApp'], accent: ['que sí confirman.'], photo: 'public/img/hero/recordatorios-hero.jpg', pos: '75% 50%' },
  { out: 'reminders-en', kicker: 'Appointment reminders', lines: ['Appointment', 'reminders'], accent: ['patients confirm.'], photo: 'public/img/hero/recordatorios-hero.jpg', pos: '75% 50%' },
  { out: 'receptionist-es', kicker: 'Recepcionista virtual', size: 54, lines: ['Recepcionista virtual', 'para dentales'], accent: ['y estética.'], photo: 'public/img/hero/recepcionista-virtual-hero.jpg', pos: '76% 50%' },
  { out: 'receptionist-en', kicker: 'AI receptionist', size: 56, lines: ['The AI receptionist', 'for dental offices'], accent: ['and med spas.'], photo: 'public/img/hero/recepcionista-virtual-hero.jpg', pos: '76% 50%' },
  { out: 'answering-es', kicker: 'Atiende el teléfono', lines: ['Si nadie atiende,'], accent: ['Sara toma', 'la llamada.'], photo: 'public/equipo/sara.jpg', pos: '50% 15%' },
  { out: 'answering-en', kicker: 'Medical office answering service', lines: ['The answering', 'service'], accent: ['that books.'], photo: 'public/equipo/sara.jpg', pos: '50% 15%' },
  { out: 'finance-es', kicker: 'Daniel · Finanzas de la clínica', size: 56, lines: ['Contabilidad', 'para clínicas,'], accent: ['sin abrir un Excel.'], photo: 'public/img/hero/contabilidad-hero.jpg', pos: '76% 50%' },
  { out: 'finance-en', kicker: 'Daniel · Practice finance', lines: ['Medical practice', 'bookkeeping,'], accent: ['done before', 'you ask.'], photo: 'public/img/hero/contabilidad-hero.jpg', pos: '76% 50%' },
  { out: 'dental-seo-es', kicker: 'Mia · SEO dental', lines: ['SEO dental para', 'tu consultorio,'], accent: ['cada semana.'], photo: 'public/img/hero/seo-dental-hero.jpg', pos: '78% 50%' },
  { out: 'dental-seo-en', kicker: 'Mia · Dental SEO', lines: ['SEO for', 'dental offices,'], accent: ['done every week.'], photo: 'public/img/hero/seo-dental-hero.jpg', pos: '78% 50%' },
  { out: 'med-spa-seo-es', kicker: 'Mia · Marketing para clínicas de estética', lines: ['SEO para clínicas', 'de estética,'], accent: ['cada semana.'], photo: 'public/img/hero/seo-estetica-hero.jpg', pos: '70% 50%' },
  { out: 'med-spa-seo-en', kicker: 'Mia · Med spa marketing', lines: ['Med spa SEO,'], accent: ['done every week.'], photo: 'public/img/hero/seo-estetica-hero.jpg', pos: '70% 50%' },
  { out: 'aeo-es', kicker: 'Marketing · Aparecer en ChatGPT', size: 54, lines: ['Aparece cuando', 'un paciente'], accent: ['le pregunta a ChatGPT.'], photo: 'public/img/hero/aeo-hero.jpg', pos: '72% 50%' },
  { out: 'aeo-en', kicker: 'Marketing · Answer engine optimization', lines: ['Show up when', 'patients'], accent: ['ask ChatGPT.'], photo: 'public/img/hero/aeo-hero.jpg', pos: '72% 50%' },
  { out: 'integrations-es', kicker: 'Integraciones', lines: ['Se conecta con', 'lo que tu clínica'], accent: ['ya usa.'], photo: 'public/img/hero/integraciones-hero.jpg', pos: '72% 50%' },
  { out: 'integrations-en', kicker: 'Integrations', lines: ['Connects with the', 'tools your clinic'], accent: ['already uses.'], photo: 'public/img/hero/integraciones-hero.jpg', pos: '72% 50%' },
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function html(c) {
  const size = c.size ?? 60;
  const h1 = [...c.lines.map((l) => `<b>${esc(l)}</b>`), ...c.accent.map((l) => `<em>${esc(l)}</em>`)].join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Archivo';src:url(data:font/woff2;base64,${FONTS.archivo}) format('woff2');font-weight:100 900}
@font-face{font-family:'Inter';src:url(data:font/woff2;base64,${FONTS.inter}) format('woff2');font-weight:100 900}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1200px;height:630px;overflow:hidden;background:#eef1ee;font-family:'Inter',sans-serif;color:#14261f}
.card{position:relative;width:1200px;height:630px;display:flex}
.left{position:relative;width:770px;height:630px;padding:58px 48px 0 64px;background:#eef1ee}
.wm{font-family:'Archivo',sans-serif;font-weight:900;font-size:46px;letter-spacing:-0.06em;line-height:1;display:inline-flex;align-items:center;gap:.10em}
.caret{display:inline-block;width:.34em;height:.76em;background:#3fe08a;transform:translateY(.02em)}
.mid{position:absolute;left:64px;right:48px;top:50%;transform:translateY(-46%)}
.kicker{display:flex;align-items:center;gap:12px;font-weight:600;font-size:20px;letter-spacing:.14em;text-transform:uppercase;color:#1a6349;white-space:nowrap;margin-bottom:22px}
.kicker i{display:inline-block;width:10px;height:10px;border-radius:50%;background:#3fe08a;flex:none}
h1{font-family:'Archivo',sans-serif;font-weight:900;font-size:${size}px;line-height:1.02;letter-spacing:-0.025em;white-space:nowrap}
h1 b{display:block;font-weight:900;color:#14261f} h1 em{display:block;font-style:normal;font-weight:900;color:#1a6349}
.url{position:absolute;left:64px;bottom:44px;font-weight:600;font-size:22px;color:#1a6349}
.right{position:relative;width:430px;height:630px;overflow:hidden;background:#dfe6e0}
.right img{width:100%;height:100%;object-fit:cover;object-position:${c.pos};display:block}
</style></head><body><div class="card">
<div class="left">
  <div class="wm">sara<span class="caret"></span></div>
  <div class="mid"><div class="kicker"><i></i>${esc(c.kicker)}</div><h1>${h1}</h1></div>
  <div class="url">holasara.ai</div>
</div>
<div class="right"><img src="data:image/jpeg;base64,${b64(c.photo)}"></div>
</div></body></html>`;
}

const only = process.argv[2];
const dir = join(tmpdir(), 'sara-og');
mkdirSync(dir, { recursive: true });
for (const c of CARDS) {
  if (only && c.out !== only) continue;
  const htmlPath = join(dir, `${c.out}.html`);
  const png = join(dir, `${c.out}.png`);
  const out = `public/og/${c.out}.jpg`;
  writeFileSync(htmlPath, html(c));
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=2',
    '--window-size=1200,630', '--virtual-time-budget=3000', `--screenshot=${png}`, `file://${htmlPath}`,
  ], { stdio: 'ignore' });
  execFileSync('sips', ['-z', '630', '1200', png], { stdio: 'ignore' });
  execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', png, '--out', out], { stdio: 'ignore' });
  console.log(`✓ ${out}`);
}
