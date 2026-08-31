#!/usr/bin/env node
// Genera música instrumental con Lyria 3 (Gemini API). Guarda el audio crudo.
// Uso: node gen-music.mjs <out-base> "<prompt>"
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const outBase = process.argv[2] || 'clips/music';
const prompt = process.argv.slice(3).join(' ') || 'Upbeat modern corporate instrumental, uplifting, positive, medium tempo, clean and professional, tech startup vibe';
function getKey() {
  if (process.env.GEMINI_API_KEY?.trim()) return process.env.GEMINI_API_KEY.trim();
  return readFileSync(join(homedir(), '.config', 'gemini', 'api-key'), 'utf8').trim();
}
const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/lyria-3-clip-preview:generateContent', {
  method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': getKey() },
  body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
});
if (!res.ok) { console.error('API', res.status, (await res.text()).slice(0, 600)); process.exit(1); }
const data = await res.json();
const part = (data?.candidates?.[0]?.content?.parts || []).find((p) => p.inlineData?.data);
if (!part) { console.error('sin audio:', JSON.stringify(data).slice(0, 600)); process.exit(1); }
const mime = part.inlineData.mimeType || 'audio/unknown';
const bytes = Buffer.from(part.inlineData.data, 'base64');
const ext = mime.includes('wav') ? 'wav' : mime.includes('mp3') || mime.includes('mpeg') ? 'mp3' : mime.includes('L16') || mime.includes('pcm') ? 'pcm' : 'bin';
const out = `${outBase}.${ext}`;
writeFileSync(out, bytes);
console.log('OK ->', out, `(${Math.round(bytes.length / 1024)} KB) mime=${mime}`);
