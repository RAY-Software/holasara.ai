// Empaqueta las funciones de Vercel escritas en TS (src/server/*.ts) a JS plano en api/.
// Vercel compila TS pero no reescribe imports relativos a src/, así que en runtime fallaba
// con FUNCTION_INVOCATION_FAILED. Un bundle por función, ESM, con @google/genai externo
// (Vercel lo trae de node_modules). La key de Gemini entra como literal desde
// api/_gemini-key.js, que el workflow de deploy escribe antes de `vercel build`.
import { build } from 'esbuild';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const keyMod = await import(pathToFileURL(resolve('api/_gemini-key.js')).href).catch(() => ({ GEMINI_API_KEY: '' }));
const key = keyMod.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
const scrMod = await import(pathToFileURL(resolve('api/_scrapper-key.js')).href).catch(() => ({ SCRAPPER_INBOUND_SECRET: '' }));
const scrapperSecret = scrMod.SCRAPPER_INBOUND_SECRET || process.env.SCRAPPER_INBOUND_SECRET || '';

const FUNCIONES = [
  { entry: 'src/server/voice-session.ts', out: 'api/voice-session.js', define: { 'process.env.GEMINI_API_KEY_BUNDLED': JSON.stringify(key) }, note: `key Gemini: ${key ? key.length + ' caracteres' : 'vacía'}` },
  { entry: 'src/server/voice-end.ts', out: 'api/voice-end.js', define: { 'process.env.SCRAPPER_INBOUND_SECRET_BUNDLED': JSON.stringify(scrapperSecret), 'process.env.SCRAPPER_API_URL_BUNDLED': JSON.stringify(process.env.SCRAPPER_API_URL || '') }, note: `secret scrapper: ${scrapperSecret ? 'presente' : 'vacío'}` },
];

for (const f of FUNCIONES) {
  await build({
    entryPoints: [f.entry],
    outfile: f.out,
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node22',
    external: ['@google/genai'],
    define: f.define,
    banner: { js: `// Generado por scripts/build-api.mjs desde ${f.entry}. No editar.` },
    logLevel: 'info',
  });
  console.log(`${f.out} listo (${f.note})`);
}
