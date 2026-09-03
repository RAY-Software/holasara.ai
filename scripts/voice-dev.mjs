// Servidor local para la demo de voz. Astro estático no ejecuta api/, así que este
// proxy monta api/voice-session.ts (Node ejecuta el TS directo) y reenvía todo lo demás
// a `astro dev` en :4321. Uso:
//   npm run dev            (en otra terminal)
//   npm run voice:dev      → http://localhost:4322/es/llamadas?voice=1
// La key sale de GEMINI_API_KEY o de ~/.config/gemini/api-key.
import http from 'node:http';
import net from 'node:net';
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';

const keyFile = `${homedir()}/.config/gemini/api-key`;
if (!process.env.GEMINI_API_KEY && existsSync(keyFile)) process.env.GEMINI_API_KEY = readFileSync(keyFile, 'utf8').trim();
process.env.VOICE_MAX_PER_IP_HOUR ||= '100';

const { default: voiceSession } = await import('../api/voice-session.ts');
const ASTRO = process.env.ASTRO_URL || 'http://localhost:4321';
const PORT = Number(process.env.PORT || 4322);

const server = http.createServer((req, res) => {
  if (req.url?.startsWith('/api/voice-session')) return void voiceSession(req, res);
  const target = new URL(req.url || '/', ASTRO);
  const p = http.request(target, { method: req.method, headers: { ...req.headers, host: target.host } }, (r) => {
    res.writeHead(r.statusCode || 502, r.headers);
    r.pipe(res);
  });
  p.on('error', (e) => { res.statusCode = 502; res.end(`astro dev no responde en ${ASTRO}: ${e.message}`); });
  req.pipe(p);
});

// HMR de Vite va por WebSocket: reenviar el upgrade tal cual al servidor de Astro.
server.on('upgrade', (req, socket, head) => {
  const target = new URL(ASTRO);
  const up = net.connect(Number(target.port), target.hostname, () => {
    const lines = [`${req.method} ${req.url} HTTP/1.1`];
    for (let i = 0; i < req.rawHeaders.length; i += 2) lines.push(`${req.rawHeaders[i]}: ${req.rawHeaders[i + 1]}`);
    up.write(lines.join('\r\n') + '\r\n\r\n');
    if (head.length) up.write(head);
    socket.pipe(up).pipe(socket);
  });
  up.on('error', () => socket.destroy());
  socket.on('error', () => up.destroy());
});

server.listen(PORT, () => console.log(`voice dev → http://localhost:${PORT}/es/llamadas?voice=1  (proxy a ${ASTRO})`));
