#!/usr/bin/env node
/**
 * Genera una imagen con Gemini "Nano Banana" (gemini-2.5-flash-image) MANTENIENDO
 * la identidad de una o más imágenes de referencia (image-to-image).
 *
 * Uso:
 *   node gen-ref.mjs <archivo-salida> "<prompt>" <ref1> [ref2 ...]
 *
 * Key: env GEMINI_API_KEY o ~/.config/gemini/api-key.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { homedir, tmpdir } from 'node:os';
import { dirname, extname, join } from 'node:path';

const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
const [, , out, prompt, ...refs] = process.argv;
if (!out || !prompt || refs.length === 0) {
  console.error('Uso: node gen-ref.mjs <salida> "<prompt>" <ref1> [ref2 ...]');
  process.exit(1);
}

function getKey() {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) return process.env.GEMINI_API_KEY.trim();
  const p = join(homedir(), '.config', 'gemini', 'api-key');
  if (existsSync(p)) { const k = readFileSync(p, 'utf8').trim(); if (k) return k; }
  console.error('Falta la API key.'); process.exit(1);
}

function mime(f) {
  const e = extname(f).toLowerCase();
  if (e === '.png') return 'image/png';
  if (e === '.webp') return 'image/webp';
  return 'image/jpeg';
}

const parts = [];
for (const r of refs) {
  if (!existsSync(r)) { console.error('No existe ref:', r); process.exit(1); }
  parts.push({ inlineData: { mimeType: mime(r), data: readFileSync(r).toString('base64') } });
}
parts.push({ text: prompt });

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': getKey() },
    body: JSON.stringify({ contents: [{ parts }] }),
  },
);
if (!res.ok) { console.error(`Error API ${res.status}:`, (await res.text()).slice(0, 700)); process.exit(1); }
const data = await res.json();
const part = (data?.candidates?.[0]?.content?.parts || []).find((p) => p.inlineData?.data);
if (!part) { console.error('Sin imagen:', JSON.stringify(data).slice(0, 700)); process.exit(1); }
const bytes = Buffer.from(part.inlineData.data, 'base64');

mkdirSync(dirname(out) || '.', { recursive: true });
const ext = extname(out).toLowerCase();
if (ext === '.jpg' || ext === '.jpeg') {
  const tmp = join(tmpdir(), `gemimg-${process.pid}.png`);
  writeFileSync(tmp, bytes);
  try { execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '90', tmp, '--out', out], { stdio: 'ignore' }); rmSync(tmp); }
  catch { const png = out.replace(/\.jpe?g$/i, '.png'); writeFileSync(png, bytes); console.log('PNG ->', png); process.exit(0); }
} else { writeFileSync(out, bytes); }
console.log('OK ->', out, `(${Math.round(bytes.length / 1024)} KB)`);
