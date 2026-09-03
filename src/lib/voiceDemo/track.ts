// Eventos de la demo de voz → GA4 (gtag) y Meta Pixel, los mismos tags que carga
// Layout.astro solo en prod. En dev no hay gtag: se loguea en consola y listo.
//
// Nombres snake_case con prefijo voice_demo_ para que en GA4 se filtren de un
// plumazo. Params cortos (GA4 corta a 100 caracteres). Nunca viaja el teléfono
// ni el transcript: solo métricas del embudo.
//
//   voice_demo_visible    la sección entró en pantalla (una vez por página)
//   voice_demo_start      clic en "Hablar con Sara"
//   voice_demo_connected  sesión viva (connect_ms desde el clic)
//   voice_demo_tool       Sara llamó un tool (tool, ok)
//   voice_demo_booked     reservó (service, requires_deposit)
//   voice_demo_ended      terminó (reason, duration_sec, booked, human_requested, turns)
//   voice_demo_error      no se pudo abrir o se cayó (detail)
//   voice_demo_switch     cambió de clínica o idioma (kind, from, to, mid_call)
//   voice_demo_cta        clic en la pantalla final (target: demo | again)

export type VoiceEventName =
  | 'voice_demo_visible'
  | 'voice_demo_start'
  | 'voice_demo_connected'
  | 'voice_demo_tool'
  | 'voice_demo_booked'
  | 'voice_demo_ended'
  | 'voice_demo_error'
  | 'voice_demo_switch'
  | 'voice_demo_cta';

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Eventos que también valen como "lead caliente" para Meta. */
const META_CUSTOM: Partial<Record<VoiceEventName, string>> = {
  voice_demo_start: 'VoiceDemoStart',
  voice_demo_booked: 'VoiceDemoBooked',
};

function clean(params: Params): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    out[k] = typeof v === 'string' ? v.slice(0, 100) : v;
  }
  return out;
}

export function trackVoice(name: VoiceEventName, params: Params = {}): void {
  const p = clean(params);
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, { event_category: 'voice_demo', transport_type: 'beacon', ...p });
    } else {
      console.debug('[voice] track', name, p);
    }
    const meta = META_CUSTOM[name];
    if (meta && typeof window.fbq === 'function') window.fbq('trackCustom', meta, p);
  } catch {
    // El tracking nunca rompe la demo.
  }
}
