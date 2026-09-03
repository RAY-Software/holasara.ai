// Cliente de la demo de voz: mic → Gemini Live → parlante, con transcript y tools.
// Port a TypeScript del harness de diezx (backend/src/public/voice-agent/index.html),
// sin nada del producto de allá. WebSocket crudo contra el endpoint "Constrained": el
// token efímero ya trae modelo, prompt, voz y tools; acá solo mandamos el modelo.
//
// Eventos que emite (todos opcionales):
//   status(s)              'idle' | 'connecting' | 'live' | 'ended' | 'error'
//   transcript(role, text, final)   role 'user' | 'sara'; parciales se reescriben hasta final
//   speaking(on)           Sara está hablando
//   level(0..1)            nivel del mic, para la onda
//   tick(sec)              segundos transcurridos
//   tool(name, args, result)
//   ended(reason)          'user' | 'sara' | 'max' | 'hidden' | 'error' | 'closed'

import type { Locale } from '../i18n/config.ts';
import { voiceDemoClinics, type VoiceIntent } from '../data/voiceDemoClinics.ts';
import { createAgenda, runDemoTool, type Agenda } from '../lib/voiceDemo/agenda.ts';

export type VoiceStatus = 'idle' | 'connecting' | 'live' | 'ended' | 'error';
export type EndReason = 'user' | 'sara' | 'max' | 'hidden' | 'error' | 'closed';

export interface VoiceEvents {
  status: (s: VoiceStatus, detail?: string) => void;
  transcript: (role: 'user' | 'sara', text: string, final: boolean) => void;
  speaking: (on: boolean) => void;
  level: (v: number) => void;
  tick: (sec: number) => void;
  tool: (name: string, args: unknown, result: unknown) => void;
  ended: (reason: EndReason, summary: { booking: Agenda['state']['booking']; humanRequested: string | null; durationSec: number }) => void;
}

export interface SessionInfo {
  sessionId: string;
  intent: VoiceIntent;
  lang: Locale;
  clinicName: string;
  model: string;
  wsUrl: string;
  greeting: string;
  maxSec: number;
  now: string;
}

interface Options {
  intent: VoiceIntent;
  lang: Locale;
  endpoint?: string;
  on?: Partial<VoiceEvents>;
}

const CAPTURE_RATE = 16000;
const PLAYBACK_RATE = 24000;

const WORKLET = `class PCMCapture extends AudioWorkletProcessor {
  process(inputs) { const i = inputs[0]; if (i && i[0] && i[0].length) this.port.postMessage(i[0]); return true; }
}
registerProcessor('pcm-capture', PCMCapture);`;

function b64ToBytes(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}

function bytesToB64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 0x8000)));
  return btoa(s);
}

export class VoiceClient {
  private opts: Options;
  private on: Partial<VoiceEvents>;
  private ws: WebSocket | null = null;
  private session: SessionInfo | null = null;
  private agenda: Agenda | null = null;
  private stream: MediaStream | null = null;
  private captureCtx: AudioContext | null = null;
  private playCtx: AudioContext | null = null;
  private gain: GainNode | null = null;
  private nextPlayAt = 0;
  private speaking = false;
  private speakEndTimer: number | null = null;
  private ready = false;
  private startedAt = 0;
  private tickTimer: number | null = null;
  private stopped = false;
  private draft = { user: '', sara: '' };
  private endAfterSpeech = false;
  private endTimer: number | null = null;
  private endFallback: number | null = null;
  private levelAt = 0;
  private wakeLock: any = null;
  private onVisibility = () => { if (document.hidden) this.stop('hidden'); };

  status: VoiceStatus = 'idle';

  constructor(opts: Options) {
    this.opts = opts;
    this.on = opts.on || {};
  }

  /** Llamar desde un gesto del usuario (click): iOS exige crear el AudioContext ahí. */
  async start(): Promise<void> {
    if (this.status !== 'idle') return;
    this.setStatus('connecting');
    try {
      this.playCtx = new AudioContext({ sampleRate: PLAYBACK_RATE });
      this.gain = this.playCtx.createGain();
      this.gain.connect(this.playCtx.destination);
      if (this.playCtx.state === 'suspended') await this.playCtx.resume();

      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });

      const r = await fetch(this.opts.endpoint || '/api/voice-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ intent: this.opts.intent, lang: this.opts.lang }),
      });
      if (!r.ok) {
        const e = await r.json().catch(() => ({}));
        throw new Error(e.error || `session ${r.status}`);
      }
      this.session = (await r.json()) as SessionInfo;
      this.agenda = createAgenda({
        clinic: voiceDemoClinics[this.session.intent],
        lang: this.session.lang,
        now: new Date(this.session.now),
        seed: this.session.sessionId,
      });
      await this.connect();
    } catch (e: any) {
      this.setStatus('error', e?.message || 'error');
      this.teardown();
      this.on.ended?.('error', this.summary());
    }
  }

  /** Manda un turno de texto como si fuera habla. Para QA automatizada, no lo usa la UI. */
  sendText(text: string): void {
    if (!this.ready || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({ clientContent: { turns: [{ role: 'user', parts: [{ text }] }], turnComplete: true } }));
    this.on.transcript?.('user', text, true);
  }

  stop(reason: EndReason = 'user'): void {
    if (this.stopped) return;
    this.stopped = true;
    this.setStatus('ended');
    this.teardown();
    this.on.ended?.(reason, this.summary());
  }

  private summary() {
    return {
      booking: this.agenda?.state.booking ?? null,
      humanRequested: this.agenda?.state.humanRequested ?? null,
      durationSec: this.startedAt ? Math.round((Date.now() - this.startedAt) / 1000) : 0,
    };
  }

  private setStatus(s: VoiceStatus, detail?: string) {
    this.status = s;
    console.debug('[voice]', s, detail || '');
    this.on.status?.(s, detail);
  }

  private onSetupComplete: (() => void) | null = null;

  private connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const s = this.session!;
      const ws = new WebSocket(s.wsUrl);
      this.ws = ws;
      let opened = false;
      // Los mensajes llegan como Blob y se leen async: la promesa se resuelve desde handle()
      // cuando aparece setupComplete, no desde onmessage.
      this.onSetupComplete = () => { opened = true; resolve(); };
      ws.onopen = () => {
        ws.send(JSON.stringify({ setup: { model: `models/${s.model}` } }));
      };
      ws.onmessage = (ev) => {
        const data = ev.data;
        if (data instanceof Blob) data.text().then((t) => this.handle(t));
        else if (data instanceof ArrayBuffer) this.handle(new TextDecoder().decode(data));
        else this.handle(String(data));
      };
      ws.onerror = () => {
        if (!opened) reject(new Error('websocket error'));
        else this.stop('error');
      };
      ws.onclose = (e) => {
        console.debug('[voice] ws close', e.code, e.reason);
        if (!opened) reject(new Error(e.reason || `websocket closed (${e.code})`));
        else if (!this.stopped) this.stop(this.endAfterSpeech ? 'sara' : 'closed');
      };
      window.setTimeout(() => { if (!opened) reject(new Error('setup timeout')); }, 10_000);
    });
  }

  private handle(raw: string) {
    let m: any;
    try { m = JSON.parse(raw); } catch { return; }

    if (m.setupComplete) {
      this.ready = true;
      this.onSetupComplete?.();
      this.onSetupComplete = null;
      this.startedAt = Date.now();
      this.setStatus('live');
      this.startTimer();
      this.startCapture().catch((e) => this.setStatus('error', e?.message));
      document.addEventListener('visibilitychange', this.onVisibility);
      (navigator as any).wakeLock?.request?.('screen').then((l: any) => (this.wakeLock = l)).catch(() => {});
      this.ws?.send(JSON.stringify({ clientContent: { turns: [{ role: 'user', parts: [{ text: this.session!.greeting }] }], turnComplete: true } }));
      return;
    }

    const sc = m.serverContent;
    if (sc) {
      if (sc.inputTranscription?.text) {
        if (this.draft.sara) this.finalize('sara');
        this.draft.user += sc.inputTranscription.text;
        this.on.transcript?.('user', this.draft.user, false);
      }
      if (sc.outputTranscription?.text) {
        if (this.draft.user) this.finalize('user');
        this.draft.sara += sc.outputTranscription.text;
        this.on.transcript?.('sara', this.draft.sara, false);
      }
      for (const p of sc.modelTurn?.parts || []) {
        if (p.inlineData?.data) {
          if (this.draft.user) this.finalize('user');
          this.play(p.inlineData.data);
        }
      }
      if (sc.interrupted) {
        this.cancelAudio();
        this.finalize('sara');
        this.setSpeaking(false);
      }
      if (sc.turnComplete) {
        this.finalize('sara');
        this.scheduleSpeechEnd();
        // end_call ya respondido: este turnComplete es el final. Colgar cuando termine de sonar.
        if (this.endAfterSpeech) this.stopWhenDrained();
      }
    }

    if (m.toolCall?.functionCalls) {
      const responses = [];
      for (const fc of m.toolCall.functionCalls) {
        const result = runDemoTool(this.agenda!, fc.name, fc.args || {});
        console.debug('[voice] tool', fc.name, fc.args, result);
        this.on.tool?.(fc.name, fc.args, result);
        responses.push({ id: fc.id, name: fc.name, response: result });
        if (fc.name === 'end_call') this.endAfterSpeech = true;
      }
      this.ws?.send(JSON.stringify({ toolResponse: { functionResponses: responses } }));
      // Tope de seguridad: si después de end_call no llega un cierre, colgar igual.
      if (this.endAfterSpeech && !this.endFallback) this.endFallback = window.setTimeout(() => this.stopWhenDrained(), 12_000);
    }
  }

  private finalize(role: 'user' | 'sara') {
    const text = this.draft[role].trim();
    this.draft[role] = '';
    if (text) this.on.transcript?.(role, text, true);
  }

  // ── Timer ──
  private startTimer() {
    this.tickTimer = window.setInterval(() => {
      const sec = Math.round((Date.now() - this.startedAt) / 1000);
      this.on.tick?.(sec);
      if (sec >= (this.session?.maxSec || 240)) this.stop('max');
    }, 1000);
  }

  // ── Captura ──
  private async startCapture() {
    if (!this.stream) return;
    const ctx = new AudioContext({ sampleRate: CAPTURE_RATE });
    this.captureCtx = ctx;
    if (ctx.state === 'suspended') await ctx.resume();
    const src = ctx.createMediaStreamSource(this.stream);
    const url = URL.createObjectURL(new Blob([WORKLET], { type: 'application/javascript' }));
    await ctx.audioWorklet.addModule(url);
    const node = new AudioWorkletNode(ctx, 'pcm-capture');
    node.port.onmessage = (e) => this.sendAudio(e.data as Float32Array);
    src.connect(node);
    // El worklet no necesita salida audible; conectar a destination mantiene el grafo vivo en Safari.
    const mute = ctx.createGain();
    mute.gain.value = 0;
    node.connect(mute).connect(ctx.destination);
  }

  private sendAudio(f32: Float32Array) {
    if (!this.ready || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const pcm = new Int16Array(f32.length);
    let sum = 0;
    for (let i = 0; i < f32.length; i++) {
      const s = Math.max(-1, Math.min(1, f32[i]));
      pcm[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      sum += s * s;
    }
    const now = performance.now();
    if (now - this.levelAt > 60) {
      this.levelAt = now;
      this.on.level?.(Math.min(1, Math.sqrt(sum / f32.length) * 4));
    }
    this.ws.send(JSON.stringify({ realtimeInput: { audio: { mimeType: `audio/pcm;rate=${CAPTURE_RATE}`, data: bytesToB64(pcm.buffer) } } }));
  }

  // ── Reproducción: cada chunk PCM se agenda como AudioBuffer en tiempo preciso ──
  private play(b64: string) {
    const ctx = this.playCtx;
    if (!ctx || !this.gain) return;
    const raw = b64ToBytes(b64);
    const i16 = new Int16Array(raw);
    if (!i16.length) return;
    const buf = ctx.createBuffer(1, i16.length, PLAYBACK_RATE);
    const ch = buf.getChannelData(0);
    for (let i = 0; i < i16.length; i++) ch[i] = i16[i] / 0x8000;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(this.gain);
    const startAt = Math.max(ctx.currentTime + 0.02, this.nextPlayAt);
    src.start(startAt);
    this.nextPlayAt = startAt + buf.duration;
    this.setSpeaking(true);
    this.scheduleSpeechEnd();
  }

  private scheduleSpeechEnd() {
    if (this.speakEndTimer) window.clearTimeout(this.speakEndTimer);
    const ctx = this.playCtx;
    const ms = ctx ? Math.max(0, (this.nextPlayAt - ctx.currentTime) * 1000) + 150 : 0;
    this.speakEndTimer = window.setTimeout(() => this.setSpeaking(false), ms);
  }

  /** Cuelga cuando la cola de audio terminó de sonar, con un pequeño margen. */
  private stopWhenDrained() {
    if (this.endTimer) window.clearTimeout(this.endTimer);
    const ctx = this.playCtx;
    const ms = ctx ? Math.max(0, (this.nextPlayAt - ctx.currentTime) * 1000) + 600 : 0;
    console.debug('[voice] colgar en', Math.round(ms), 'ms');
    this.endTimer = window.setTimeout(() => this.stop('sara'), ms);
  }

  private cancelAudio() {
    if (!this.playCtx || !this.gain) return;
    this.gain.disconnect();
    this.gain = this.playCtx.createGain();
    this.gain.connect(this.playCtx.destination);
    this.nextPlayAt = 0;
  }

  private setSpeaking(on: boolean) {
    if (this.speaking === on) return;
    this.speaking = on;
    this.on.speaking?.(on);
  }

  private teardown() {
    document.removeEventListener('visibilitychange', this.onVisibility);
    if (this.tickTimer) window.clearInterval(this.tickTimer);
    if (this.speakEndTimer) window.clearTimeout(this.speakEndTimer);
    if (this.endTimer) window.clearTimeout(this.endTimer);
    if (this.endFallback) window.clearTimeout(this.endFallback);
    try { this.ws?.close(); } catch {}
    this.ws = null;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.captureCtx?.close().catch(() => {});
    this.playCtx?.close().catch(() => {});
    this.captureCtx = null;
    this.playCtx = null;
    this.wakeLock?.release?.().catch?.(() => {});
    this.wakeLock = null;
    this.ready = false;
  }
}
