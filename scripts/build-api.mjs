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

await build({
  entryPoints: ['src/server/voice-session.ts'],
  outfile: 'api/voice-session.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  external: ['@google/genai'],
  define: { 'process.env.GEMINI_API_KEY_BUNDLED': JSON.stringify(key) },
  banner: { js: '// Generado por scripts/build-api.mjs desde src/server/voice-session.ts. No editar.' },
  logLevel: 'info',
});
console.log(`api/voice-session.js listo (key: ${key ? key.length + ' caracteres' : 'vacía'})`);
