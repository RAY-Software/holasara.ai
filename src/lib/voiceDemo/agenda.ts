// Agenda SIMULADA de la demo de voz. Pura y determinista: dada la clínica, el idioma, la
// hora actual y una semilla, genera los mismos huecos. Corre en el browser (los tools de
// Gemini se resuelven acá) y en tests. No toca red ni storage.
//
// Contrato de tools: es el mismo que tendría clinic-platform si algún día la voz pasa a
// producto (getAvailableSlots / reserveSlot / rescheduleWithClaim / releaseBooking).
// Cambiar de agenda simulada a real es cambiar este adapter, no el prompt.

import type { Locale } from '../../i18n/config';
import { weekdays, type VoiceClinic, type VoiceService, type Weekday } from '../../data/voiceDemoClinics.ts';

export interface Slot {
  /** Id corto y opaco para el modelo ("s1", "s2"): un id largo lo copia mal. */
  id: string;
  /** Clave interna (día, hora, profesional) para ocupación y reservas. */
  key: string;
  startISO: string;
  /** Etiqueta hablable en el idioma de la sesión: "jueves 4 de septiembre a las 11:30". */
  label: string;
  professional: string;
  service: string;
}

export interface Booking {
  slot: Slot;
  name: string;
  phone: string;
  requiresDeposit: boolean;
  depositLabel: string;
}

export interface AgendaState {
  booking: Booking | null;
  humanRequested: string | null;
  ended: boolean;
}

const MIN_NOTICE_MIN = 120;
const STEP_MIN = 30;
const DAYS_AHEAD = 7;
const OCCUPANCY = 0.55;

// PRNG chico y determinista (mulberry32) para que la ocupación sea estable por sesión.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

/** Partes de una fecha en una zona horaria, sin librerías. */
function zonedParts(d: Date, tz: string) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short',
  });
  const p: Record<string, string> = {};
  for (const { type, value } of f.formatToParts(d)) p[type] = value;
  const wd = p.weekday.toLowerCase().slice(0, 3) as Weekday;
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, mi: +p.minute, weekday: wd };
}

/** Offset (ms) de la zona respecto de UTC en ese instante. */
function tzOffsetMs(d: Date, tz: string): number {
  const p = zonedParts(d, tz);
  const asUtc = Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi);
  const floored = Math.floor(d.getTime() / 60000) * 60000;
  return asUtc - floored;
}

/** Construye un instante a partir de fecha/hora "de pared" en la zona. */
function zonedDate(y: number, m: number, d: number, h: number, mi: number, tz: string): Date {
  const guess = new Date(Date.UTC(y, m - 1, d, h, mi));
  const off = tzOffsetMs(guess, tz);
  return new Date(guess.getTime() - off);
}

export function dayKey(d: Date, tz: string): string {
  const p = zonedParts(d, tz);
  return `${p.y}-${String(p.m).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`;
}

export function spokenLabel(d: Date, tz: string, lang: Locale): string {
  const locale = lang === 'en' ? 'en-US' : 'es-MX';
  const day = new Intl.DateTimeFormat(locale, { timeZone: tz, weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  const time = new Intl.DateTimeFormat(locale, { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: lang === 'en' }).format(d);
  return lang === 'en' ? `${day} at ${time}` : `${day} a las ${time}`;
}

export function findService(clinic: VoiceClinic, query: string, lang: Locale): VoiceService | null {
  const q = (query || '').toLowerCase().trim();
  if (!q) return null;
  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const nq = norm(q);
  const exact = clinic.services.find((s) => norm(s.name[lang]) === nq || norm(s.name.es) === nq || norm(s.name.en) === nq);
  if (exact) return exact;
  const words = nq.split(/\s+/).filter((w) => w.length > 3);
  let best: VoiceService | null = null;
  let bestScore = 0;
  for (const s of clinic.services) {
    const hay = norm(`${s.name.es} ${s.name.en}`);
    const score = words.filter((w) => hay.includes(w)).length;
    if (score > bestScore) { best = s; bestScore = score; }
  }
  return best;
}

export interface AgendaOptions {
  clinic: VoiceClinic;
  lang: Locale;
  now: Date;
  seed: string;
}

export function createAgenda({ clinic, lang, now, seed }: AgendaOptions) {
  const tz = clinic.timezone[lang];
  const rand = mulberry32(hashSeed(seed));
  // Ocupación fija por (día, hora, profesional) para que dos llamadas al tool coincidan.
  const busy = new Map<string, boolean>();
  const isBusy = (key: string) => {
    if (!busy.has(key)) busy.set(key, rand() < OCCUPANCY);
    return busy.get(key)!;
  };
  const state: AgendaState = { booking: null, humanRequested: null, ended: false };
  const taken = new Set<string>();
  const byKey = new Map<string, Slot>();
  let seq = 0;
  const slotFor = (key: string, make: () => Omit<Slot, 'id' | 'key'>): Slot => {
    let s = byKey.get(key);
    if (!s) { s = { id: `s${++seq}`, key, ...make() }; byKey.set(key, s); }
    return s;
  };

  function professionalsFor(service: VoiceService, wanted?: string) {
    const list = clinic.professionals;
    if (wanted) {
      const w = wanted.toLowerCase();
      const hit = list.find((p) => p.name.toLowerCase().includes(w) || w.includes(p.name.toLowerCase().split(' ').pop() || '#'));
      if (hit) return [hit];
    }
    return list;
  }

  function listSlots({ service, date, professional, count = 4 }: { service: string; date?: string; professional?: string; count?: number }): { service: VoiceService | null; slots: Slot[] } {
    const svc = findService(clinic, service, lang);
    if (!svc) return { service: null, slots: [] };
    const earliest = new Date(now.getTime() + MIN_NOTICE_MIN * 60000);
    const out: Slot[] = [];
    const todayKey = dayKey(now, tz);
    for (let i = 0; i < DAYS_AHEAD && out.length < count; i++) {
      const dayRef = new Date(now.getTime() + i * 86400000);
      const p = zonedParts(dayRef, tz);
      const key = `${p.y}-${String(p.m).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`;
      if (date && key !== date) continue;
      const ranges = clinic.hours[p.weekday] || [];
      for (const [open, close] of ranges) {
        const [oh, om] = open.split(':').map(Number);
        const [ch, cm] = close.split(':').map(Number);
        for (let t = oh * 60 + om; t + svc.durationMin <= ch * 60 + cm && out.length < count; t += STEP_MIN) {
          const start = zonedDate(p.y, p.m, p.d, Math.floor(t / 60), t % 60, tz);
          if (start < earliest) continue;
          for (const pro of professionalsFor(svc, professional)) {
            const k = `${key}T${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}|${pro.name}`;
            if (taken.has(k) || isBusy(k)) continue;
            out.push(slotFor(k, () => ({ startISO: start.toISOString(), label: spokenLabel(start, tz, lang), professional: pro.name, service: svc.name[lang] })));
            break; // un slot por horario, no uno por profesional
          }
          // Espaciar: no listar 4 huecos consecutivos del mismo día salvo que se pidió ese día.
          if (!date && key === todayKey && out.length >= 2) break;
          if (!date && out.length >= 2 && out.filter((s) => s.key.startsWith(key)).length >= 2) break;
        }
      }
    }
    return { service: svc, slots: out };
  }

  const cache = new Map<string, Slot>();

  return {
    state,
    tz,
    slotById(id: string): Slot | undefined { return cache.get(id); },
    getAvailableSlots(args: { service?: string; date?: string; professional?: string }) {
      const { service, slots } = listSlots({ service: args.service || '', date: args.date, professional: args.professional });
      if (!service) {
        return { ok: false, error: lang === 'en' ? 'unknown service; ask which of the listed services they want' : 'servicio desconocido; pregunta cuál de los servicios de la lista quiere' };
      }
      for (const s of slots) cache.set(s.id, s);
      return {
        ok: true,
        service: service.name[lang],
        durationMin: service.durationMin,
        slots: slots.map((s) => ({ slotId: s.id, when: s.label, professional: s.professional })),
        note: slots.length ? undefined : (lang === 'en' ? 'no availability in the next 7 days for that filter' : 'sin disponibilidad en los próximos 7 días con ese filtro'),
      };
    },
    bookAppointment(args: { slotId?: string; name?: string; phone?: string }) {
      const slot = args.slotId ? cache.get(args.slotId) : undefined;
      if (!slot) return { ok: false, error: lang === 'en' ? 'invalid slotId; call get_available_slots first' : 'slotId inválido; llama a get_available_slots primero' };
      const name = (args.name || '').trim();
      if (!name) return { ok: false, error: lang === 'en' ? 'name is required' : 'falta el nombre' };
      if (state.booking) taken.delete(state.booking.slot.key);
      taken.add(slot.key);
      const svc = findService(clinic, slot.service, lang)!;
      const requiresDeposit = clinic.depositPct > 0 && svc.price[lang] > 0;
      const amount = Math.round((svc.price[lang] * clinic.depositPct) / 100);
      const depositLabel = requiresDeposit ? `${amount} ${clinic.currency[lang]}` : '';
      state.booking = { slot, name, phone: (args.phone || '').trim(), requiresDeposit, depositLabel };
      return {
        ok: true,
        confirmed: true,
        when: slot.label,
        professional: slot.professional,
        service: slot.service,
        requiresDeposit,
        depositAmount: depositLabel || undefined,
        nextStep: requiresDeposit
          ? (lang === 'en' ? 'tell them you will send the deposit link by text message; ask for their mobile number if you do not have it' : 'dile que le envías por WhatsApp el link del anticipo (di "anticipo", nunca "seña"); pídele el celular si no lo tienes')
          : (lang === 'en' ? 'tell them they will get the confirmation by text message' : 'dile que le llega la confirmación por WhatsApp'),
      };
    },
    rescheduleAppointment(args: { slotId?: string }) {
      if (!state.booking) return { ok: false, error: lang === 'en' ? 'there is no booking to reschedule' : 'no hay ninguna cita para mover' };
      const slot = args.slotId ? cache.get(args.slotId) : undefined;
      if (!slot) return { ok: false, error: lang === 'en' ? 'invalid slotId; call get_available_slots first' : 'slotId inválido; llama a get_available_slots primero' };
      taken.delete(state.booking.slot.key);
      taken.add(slot.key);
      state.booking = { ...state.booking, slot };
      return { ok: true, when: slot.label, professional: slot.professional };
    },
    cancelAppointment() {
      if (!state.booking) return { ok: false, error: lang === 'en' ? 'there is no booking to cancel' : 'no hay ninguna cita para cancelar' };
      taken.delete(state.booking.slot.key);
      const was = state.booking.slot.label;
      state.booking = null;
      return { ok: true, cancelled: was };
    },
    requestHuman(args: { reason?: string }) {
      state.humanRequested = (args.reason || '').trim() || 'unspecified';
      return { ok: true, nextStep: lang === 'en' ? 'tell them someone from the team will text them shortly' : 'dile que alguien del equipo le escribe por WhatsApp en un rato' };
    },
    endCall() {
      state.ended = true;
      return { ok: true };
    },
  };
}

export type Agenda = ReturnType<typeof createAgenda>;

/** Despacha un function call de Gemini contra la agenda. Nunca lanza: devuelve {ok:false}. */
export function runDemoTool(agenda: Agenda, name: string, args: Record<string, unknown> = {}) {
  const a = args as any;
  try {
    switch (name) {
      case 'get_available_slots': return agenda.getAvailableSlots(a);
      case 'book_appointment': return agenda.bookAppointment(a);
      case 'reschedule_appointment': return agenda.rescheduleAppointment(a);
      case 'cancel_appointment': return agenda.cancelAppointment();
      case 'request_human': return agenda.requestHuman(a);
      case 'end_call': return agenda.endCall();
      default: return { ok: false, error: `unknown tool ${name}` };
    }
  } catch (e: any) {
    return { ok: false, error: e?.message || 'tool failed' };
  }
}
