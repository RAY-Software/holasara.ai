// POST /api/voice-session — abre una sesión de la demo de voz.
//
// FUENTE de la función. No vive en api/ porque Vercel no reescribe imports de TS: se
// empaqueta con esbuild a api/voice-session.js en `npm run build` (scripts/build-api.mjs),
// que además inyecta la key desde api/_gemini-key.js (escrito por el deploy). En dev,
// scripts/voice-dev.mjs importa esta fuente directo y la key sale de la env.
//
// El browser manda { intent, lang } y recibe un token efímero de Gemini Live con TODA la
// config fijada del lado del server (modelo, voz, prompt de la clínica ficticia y tools),
// vía liveConnectConstraints. Con ese token el browser abre el WebSocket directo contra
// Google: el audio no pasa por acá y la API key nunca sale de esta función.
//
// Público por necesidad (lo llaman visitantes anónimos). Se acota igual que
// places-autocomplete: origen, rate limit por IP, tope diario por instancia y kill switch.
// El estado es por instancia de Vercel, así que los límites son aproximados, no una cuota.

import type { IncomingMessage, ServerResponse } from 'node:http';
import { randomBytes } from 'node:crypto';
import { GoogleGenAI } from '@google/genai';
import { voiceDemoClinics, isVoiceIntent } from '../data/voiceDemoClinics.ts';
import { buildLiveConfig, greetingTrigger, VOICE_MAX_SEC } from '../lib/voiceDemo/prompt.ts';

// En el bundle de prod esbuild reemplaza esta expresión por la key literal (define).
const GEMINI_API_KEY = process.env.GEMINI_API_KEY_BUNDLED || '';

const ORIGENES = new Set([
  'https://holasara.ai',
  'https://www.holasara.ai',
  ...String(process.env.VOICE_EXTRA_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean),
]);

const VENTANA_MS = 60 * 60_000;
const MAX_POR_IP_VENTANA = Number(process.env.VOICE_MAX_PER_IP_HOUR || 3);
const MAX_POR_DIA = Number(process.env.VOICE_DAILY_SESSIONS_CAP || 300);
const TOKEN_TTL_MS = 2 * 60_000;
const NEW_SESSION_TTL_MS = 60_000;

const golpes = new Map<string, number[]>();
let diaActual = '';
let sesionesHoy = 0;

function limitado(ip: string): boolean {
  const ahora = Date.now();
  const previos = (golpes.get(ip) || []).filter((t) => ahora - t < VENTANA_MS);
  previos.push(ahora);
  golpes.set(ip, previos);
  if (golpes.size > 5000) golpes.clear();
  return previos.length > MAX_POR_IP_VENTANA;
}

function topeDiario(): boolean {
  const hoy = new Date().toISOString().slice(0, 10);
  if (hoy !== diaActual) { diaActual = hoy; sesionesHoy = 0; }
  sesionesHoy += 1;
  return sesionesHoy > MAX_POR_DIA;
}

type Req = IncomingMessage & { body?: unknown; headers: IncomingMessage['headers'] };

function json(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readBody(req: Req): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') return req.body as Record<string, unknown>;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c));
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return {}; }
}

export default async function handler(req: Req, res: ServerResponse) {
  const origen = String(req.headers.origin || '');
  // El browser manda Origin también en un POST same-origin: el propio host siempre vale.
  let mismoHost = false;
  try { mismoHost = !!origen && new URL(origen).host === String(req.headers.host || ''); } catch {}
  const origenOk = !origen || mismoHost || ORIGENES.has(origen);
  if (origen && ORIGENES.has(origen)) {
    res.setHeader('Access-Control-Allow-Origin', origen);
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== 'POST') return json(res, 405, { error: 'method not allowed' });
  if (!origenOk) return json(res, 403, { error: 'origin not allowed' });

  if (process.env.VOICE_DEMO_ENABLED === 'false') return json(res, 503, { error: 'voice demo disabled' });
  const apiKey = GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  if (!apiKey) return json(res, 503, { error: 'voice demo not configured' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (limitado(ip)) return json(res, 429, { error: 'too many sessions, try again later' });
  if (topeDiario()) return json(res, 503, { error: 'daily cap reached' });

  const body = await readBody(req);
  const intent = body.intent;
  const lang = body.lang === 'en' ? 'en' : body.lang === 'es' ? 'es' : null;
  if (!isVoiceIntent(intent) || !lang) return json(res, 400, { error: 'intent and lang are required' });

  const clinic = voiceDemoClinics[intent];
  const now = new Date();
  const live = buildLiveConfig({ clinic, lang, now });
  const sessionId = randomBytes(12).toString('hex');

  try {
    const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1alpha' } });
    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(now.getTime() + TOKEN_TTL_MS).toISOString(),
        newSessionExpireTime: new Date(now.getTime() + NEW_SESSION_TTL_MS).toISOString(),
        liveConnectConstraints: live as any,
      },
    });
    if (!token.name) throw new Error('token sin name');
    const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=${encodeURIComponent(token.name)}`;
    return json(res, 200, {
      sessionId,
      intent,
      lang,
      clinicName: clinic.name[lang],
      model: live.model,
      wsUrl,
      greeting: greetingTrigger(clinic, lang),
      maxSec: VOICE_MAX_SEC,
      now: now.toISOString(),
      expiresAt: new Date(now.getTime() + NEW_SESSION_TTL_MS).toISOString(),
    });
  } catch (err: any) {
    console.error('[voice-session] token error:', err?.message || err);
    return json(res, 502, { error: 'could not open voice session' });
  }
}
