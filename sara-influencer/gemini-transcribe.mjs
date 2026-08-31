#!/usr/bin/env node
// Transcribe un audio con Gemini (verbatim) para detectar tartamudeos/repeticiones.
// Uso: node gemini-transcribe.mjs <archivo-audio>
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, extname } from 'node:path';

const file = process.argv[2];
if (!file || !existsSync(file)) { console.error('Falta audio válido'); process.exit(1); }
function getKey() {
  if (process.env.GEMINI_API_KEY?.trim()) return process.env.GEMINI_API_KEY.trim();
  const p = join(homedir(), '.config', 'gemini', 'api-key');
  return readFileSync(p, 'utf8').trim();
}
const mimeByExt = { '.wav': 'audio/wav', '.mp3': 'audio/mp3', '.m4a': 'audio/mp4', '.aac': 'audio/aac', '.ogg': 'audio/ogg' };
const mime = mimeByExt[extname(file).toLowerCase()] || 'audio/wav';

const prompt = "Transcribe VERBATIM el audio, exactamente lo que se escucha, incluyendo cualquier tartamudeo, repetición de palabras o sílabas, o hipos (por ejemplo 'por por'). No corrijas ni limpies nada. Devolvé SOLO la transcripción literal.";

const res = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent',
  { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': getKey() },
    body: JSON.stringify({ contents: [{ parts: [ { inlineData: { mimeType: mime, data: readFileSync(file).toString('base64') } }, { text: prompt } ] }] }) },
);
if (!res.ok) { console.error('API', res.status, (await res.text()).slice(0, 400)); process.exit(1); }
const data = await res.json();
const txt = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text).filter(Boolean).join(' ').trim();
console.log(txt || '(sin texto)');
