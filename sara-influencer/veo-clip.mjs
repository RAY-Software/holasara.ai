#!/usr/bin/env node
/**
 * Genera un clip de video con Veo 3.1 (image-to-video) desde un still de Sara,
 * manteniendo su identidad. Usa la MISMA key de Gemini (~/.config/gemini/api-key).
 *
 * Uso:
 *   node veo-clip.mjs <still.jpg> "<prompt de accion/camara>" [out.mp4] [aspect] [model]
 *   # aspect: 16:9 (default, website) | 9:16 (reels)
 *   # model:  veo-3.1-generate-preview (default) | veo-3.1-fast-generate-preview | veo-3.1-lite-generate-preview
 *
 * Ej:
 *   node veo-clip.mjs set/id-08.jpg "Sara looks at camera and speaks warmly, subtle natural head movement, soft studio light" clips/sara-01.mp4 16:9
 */
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, extname } from 'node:path';
import { GoogleGenAI } from '@google/genai';

const [still, prompt, out = 'clips/sara-clip.mp4', aspect = '16:9', model = 'veo-3.1-generate-preview'] = process.argv.slice(2);
if (!still || !prompt) { console.error('Uso: node veo-clip.mjs <still> "<prompt>" [out.mp4] [aspect] [model]'); process.exit(1); }
if (!existsSync(still)) { console.error('No existe el still:', still); process.exit(1); }

function getKey() {
  if (process.env.GEMINI_API_KEY?.trim()) return process.env.GEMINI_API_KEY.trim();
  const p = join(homedir(), '.config', 'gemini', 'api-key');
  if (existsSync(p)) { const k = readFileSync(p, 'utf8').trim(); if (k) return k; }
  console.error('Falta la key de Gemini.'); process.exit(1);
}
const mime = extname(still).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';

const ai = new GoogleGenAI({ apiKey: getKey() });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

console.log(`[1/3] Enviando a ${model} (${aspect})...`);
let op = await ai.models.generateVideos({
  model,
  prompt,
  image: { imageBytes: readFileSync(still).toString('base64'), mimeType: mime },
  config: { aspectRatio: aspect, numberOfVideos: 1 },
});

console.log('[2/3] Procesando (Veo tarda ~1-3 min)...');
let n = 0;
while (!op.done) {
  await sleep(10000);
  process.stdout.write(`      ...poll ${++n}\r`);
  op = await ai.operations.getVideosOperation({ operation: op });
}
console.log('\n[3/3] Listo, descargando...');

const vids = op.response?.generatedVideos || [];
if (!vids.length) { console.error('Sin video en la respuesta:', JSON.stringify(op.response || op).slice(0, 800)); process.exit(1); }
await ai.files.download({ file: vids[0].video, downloadPath: out });
console.log('OK ->', out);
