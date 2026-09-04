// POST /api/voice-end — resumen de una sesión de la demo de voz al terminar.
//
// El browser lo manda al colgar (VoiceDemo.astro) y esta función lo reenvía al scrapper
// (POST /api/inbound/voice-demo-session, con INBOUND_LEAD_SECRET), que postea el aviso en
// Slack #hola-sara. Sin secret configurado responde 202 igual: el aviso es best-effort y
// nunca debe romper la demo. Empaquetada por scripts/build-api.mjs como voice-session.

import type { IncomingMessage, ServerResponse } from 'node:http';

const ORIGENES = new Set(['https://holasara.ai', 'https://www.holasara.ai']);
const SCRAPPER_URL = process.env.SCRAPPER_API_URL_BUNDLED || 'https://scrapper.rayapp.io/api/inbound/voice-demo-session';
const SECRET = process.env.SCRAPPER_INBOUND_SECRET_BUNDLED || process.env.SCRAPPER_INBOUND_SECRET || '';
const MAX_BODY = 32 * 1024;
const VENTANA_MS = 60 * 60_000;
const MAX_POR_IP = 12;
const golpes = new Map<string, number[]>();

function limitado(ip: string): boolean {
  const ahora = Date.now();
  const previos = (golpes.get(ip) || []).filter((t) => ahora - t < VENTANA_MS);
  previos.push(ahora);
  golpes.set(ip, previos);
  if (golpes.size > 5000) golpes.clear();
  return previos.length > MAX_POR_IP;
}

type Req = IncomingMessage & { body?: unknown };

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readBody(req: Req): Promise<Record<string, unknown> | null> {
  if (req.body && typeof req.body === 'object') return req.body as Record<string, unknown>;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return null; } }
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const c of req) {
    const b = Buffer.isBuffer(c) ? c : Buffer.from(c);
    size += b.length;
    if (size > MAX_BODY) return null;
    chunks.push(b);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return null; }
}

export default async function handler(req: Req, res: ServerResponse) {
  const origen = String(req.headers.origin || '');
  let mismoHost = false;
  try { mismoHost = !!origen && new URL(origen).host === String(req.headers.host || ''); } catch {}
  if (origen && !mismoHost && !ORIGENES.has(origen)) return json(res, 403, { error: 'origin not allowed' });
  if (req.method !== 'POST') return json(res, 405, { error: 'method not allowed' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (limitado(ip)) return json(res, 429, { error: 'too many' });

  const body = await readBody(req);
  if (!body) return json(res, 400, { error: 'bad body' });
  if (!SECRET) {
    console.warn('[voice-end] sin SCRAPPER_INBOUND_SECRET: aviso a Slack omitido');
    return json(res, 202, { ok: true, forwarded: false });
  }
  // Respondemos rápido y reenviamos con timeout corto: el browser está colgando.
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    const r = await fetch(SCRAPPER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-inbound-secret': SECRET },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!r.ok) console.warn(`[voice-end] scrapper respondió ${r.status}`);
    return json(res, 202, { ok: true, forwarded: r.ok });
  } catch (err: any) {
    console.warn('[voice-end] reenvío falló:', err?.message || err);
    return json(res, 202, { ok: true, forwarded: false });
  }
}
