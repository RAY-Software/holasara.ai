// Deterministic frame renderer: drives index.html's window.setTime(t) and
// screenshots each frame, then muxes the ORIGINAL audio track back in.
//
// Usage:
//   node render.mjs               -> full render to out/Sara.mp4
//   node render.mjs qa 0 2.2 9.4 12.2 54  -> save single PNGs at given times to out/qa/
//   node render.mjs range 0 12    -> render only [0s,12s) then encode (no audio) to out/preview.mp4
import puppeteer from 'puppeteer-core';
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SRC_AUDIO = join(__dir, 'assets/audio/music.m4a'); // audio dentro del repo (auto-contenido)
const W = 1920, H = 1080, FPS = 30, DUR = 56.6;
const INDEX = 'file://' + join(__dir, 'index.html');

const mode = process.argv[2] || 'full';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--no-sandbox', '--force-device-scale-factor=1', '--hide-scrollbars',
         '--disable-gpu', `--window-size=${W},${H}`],
});
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
await page.goto(INDEX, { waitUntil: 'networkidle0' });
await page.evaluate(async () => { if (document.fonts) await document.fonts.ready; });
await new Promise(r => setTimeout(r, 300));

async function frame(t, path) {
  await page.evaluate((tt) => window.setTime(tt), t);
  await page.screenshot({ path, captureBeyondViewport: false });
}

if (mode === 'qa') {
  const times = process.argv.slice(3).map(Number);
  const dir = join(__dir, 'out/qa'); mkdirSync(dir, { recursive: true });
  for (const t of times) { const p = join(dir, `t_${t}.png`); await frame(t, p); console.log('QA', t, '->', p); }
  await browser.close(); process.exit(0);
}

let t0 = 0, t1 = DUR, withAudio = true, outName = 'Sara.mp4';
if (mode === 'range') { t0 = Number(process.argv[3]); t1 = Number(process.argv[4]); withAudio = false; outName = 'preview.mp4'; }

const framesDir = join(__dir, 'frames');
rmSync(framesDir, { recursive: true, force: true }); mkdirSync(framesDir, { recursive: true });

const startF = Math.round(t0 * FPS), endF = Math.round(t1 * FPS);
console.log(`Rendering frames ${startF}..${endF} (${endF - startF} frames)`);
for (let f = startF; f < endF; f++) {
  const t = f / FPS;
  const p = join(framesDir, `f${String(f - startF).padStart(5, '0')}.png`);
  await frame(t, p);
  if ((f - startF) % 60 === 0) console.log(`  frame ${f - startF}/${endF - startF} (t=${t.toFixed(2)}s)`);
}
await browser.close();

const outDir = join(__dir, 'out'); mkdirSync(outDir, { recursive: true });
const silent = join(outDir, '_video.mp4');
console.log('Encoding video...');
let r = spawnSync('ffmpeg', ['-y', '-framerate', String(FPS), '-i', join(framesDir, 'f%05d.png'),
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'slow',
  '-movflags', '+faststart', silent], { stdio: 'inherit' });
if (r.status !== 0) process.exit(1);

const out = join(outDir, outName);
if (withAudio) {
  console.log('Muxing original audio...');
  r = spawnSync('ffmpeg', ['-y', '-i', silent, '-i', SRC_AUDIO,
    '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
    '-shortest', out], { stdio: 'inherit' });
} else {
  r = spawnSync('cp', [silent, out]);
}
console.log(r.status === 0 ? `\n✅ ${out}` : `\n❌ encode failed`);
process.exit(r.status || 0);
