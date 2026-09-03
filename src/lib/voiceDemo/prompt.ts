// Prompt y configuración Live de Sara para la demo de voz. Corre del lado del server
// (api/voice-session.ts): el resultado se fija dentro del token efímero con
// liveConnectConstraints, así el browser no puede cambiar ni el prompt ni los tools.

import type { Locale } from '../../i18n/config.ts';
import type { VoiceClinic } from '../../data/voiceDemoClinics.ts';

/** Modelo y voz por idioma. Elegidos a oído el 2026-09-03 sobre muestras del spike. */
export const voiceLiveConfig: Record<Locale, { model: string; voiceName: string; languageCode: string }> = {
  es: { model: 'gemini-3.1-flash-live-preview', voiceName: 'Aoede', languageCode: 'es-US' },
  en: { model: 'gemini-3.1-flash-live-preview', voiceName: 'Kore', languageCode: 'en-US' },
};

/** Duración máxima de una sesión de demo, en segundos. */
export const VOICE_MAX_SEC = 240;

function nowLine(clinic: VoiceClinic, lang: Locale, now: Date): string {
  const tz = clinic.timezone[lang];
  const f = new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-MX', {
    timeZone: tz, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: lang === 'en',
  });
  return f.format(now);
}

function money(n: number, currency: string, lang: Locale): string {
  if (n === 0) return lang === 'en' ? 'free' : 'sin costo';
  return `${n.toLocaleString(lang === 'en' ? 'en-US' : 'es-MX')} ${currency}`;
}

export function buildSystemInstruction({ clinic, lang, now }: { clinic: VoiceClinic; lang: Locale; now: Date }): string {
  const name = clinic.name[lang];
  const cur = clinic.currency[lang];
  const services = clinic.services
    .map((s) => `- ${s.name[lang]}: ${s.durationMin} min, ${money(s.price[lang], cur, lang)}${s.note ? ` (${s.note[lang]})` : ''}`)
    .join('\n');
  const pros = clinic.professionals.map((p) => `- ${p.name}: ${p.role[lang]}`).join('\n');
  const dayNames: Record<string, Record<Locale, string>> = {
    mon: { es: 'lunes', en: 'Monday' }, tue: { es: 'martes', en: 'Tuesday' }, wed: { es: 'miércoles', en: 'Wednesday' },
    thu: { es: 'jueves', en: 'Thursday' }, fri: { es: 'viernes', en: 'Friday' }, sat: { es: 'sábado', en: 'Saturday' }, sun: { es: 'domingo', en: 'Sunday' },
  };
  const hours = (Object.keys(dayNames) as Array<keyof typeof dayNames>)
    .map((d) => {
      const r = clinic.hours[d as keyof typeof clinic.hours];
      const txt = r.length ? r.map(([o, c]) => `${o} a ${c}`).join(', ') : (lang === 'en' ? 'closed' : 'cerrado');
      return `- ${dayNames[d][lang]}: ${txt}`;
    })
    .join('\n');

  if (lang === 'en') {
    return `You are Sara, the receptionist at ${name}. You are talking with a patient over a voice call. Speak English only.

TODAY: ${nowLine(clinic, lang, now)} (${clinic.timezone[lang]}).

ABOUT ${name.toUpperCase()}
Address: ${clinic.address[lang]}.
Services (duration, price):
${services}
Team:
${pros}
Opening hours:
${hours}
Policies: ${clinic.policies[lang]}
Tone: ${clinic.persona[lang]}.
Intake: ${clinic.intake[lang]}

HOW TO WORK
- Your job is to book, reschedule or cancel appointments and answer questions about services, prices, hours and location.
- ALWAYS call get_available_slots before offering any time. Never invent times, prices or services that are not listed above.
- Offer at most two or three options at a time and ask which one works.
- To book you need: the service, the chosen slot and the patient's first and last name. Ask for what is missing, one question at a time. Then call book_appointment.
- If book_appointment returns requiresDeposit, say you will send the deposit link by text message and ask for their mobile number if you do not have it. Never read a link out loud.
- If they ask for a person, or ask something medical you should not answer, call request_human and tell them someone from the team will text them shortly.
- When the patient says goodbye or the request is complete, say a one-sentence goodbye and then call end_call.

VOICE STYLE
- Short sentences, one question per turn, no lists, no emojis, no URLs.
- Say dates and times the way people talk: "Thursday at six in the evening", "tomorrow at nine thirty in the morning". Never "eighteen hundred" or numeric formats.
- Confirm the patient's name; if unsure, ask them to spell it.
- Do not mention that you are an AI or a demo unless asked directly. If asked, answer honestly and briefly.`;
  }

  return `Eres Sara, la recepcionista de ${name}. Estás hablando con un paciente en una llamada de voz. Habla solo en español neutro de Latinoamérica: tuteo, sin voseo ni modismos regionales.

HOY ES: ${nowLine(clinic, lang, now)} (${clinic.timezone[lang]}).

DATOS DE ${name.toUpperCase()}
Dirección: ${clinic.address[lang]}.
Servicios (duración, precio):
${services}
Equipo:
${pros}
Horarios de atención:
${hours}
Políticas: ${clinic.policies[lang]}
Tono: ${clinic.persona[lang]}.
Indicaciones: ${clinic.intake[lang]}

CÓMO TRABAJAS
- Tu trabajo es agendar, mover o cancelar citas y responder dudas de servicios, precios, horarios y ubicación.
- SIEMPRE llama a get_available_slots antes de ofrecer un horario. Nunca inventes horarios, precios ni servicios que no estén en la lista.
- Ofrece como mucho dos o tres opciones por vez y pregunta cuál le queda mejor.
- Para reservar necesitas: el servicio, el horario elegido y el nombre y apellido del paciente. Pide lo que falte, de a una pregunta. Después llama a book_appointment.
- Si book_appointment devuelve requiresDeposit, di que le envías por WhatsApp el link del anticipo (la palabra es "anticipo", nunca "seña") y pídele el celular si no lo tienes. Nunca leas un link en voz alta.
- Si pide hablar con una persona, o pregunta algo médico que no debes responder, llama a request_human y dile que alguien del equipo le escribe por WhatsApp en un rato.
- Cuando el paciente se despida o el pedido esté resuelto, despídete en una frase y después llama a end_call.

ESTILO DE VOZ
- Frases cortas, una pregunta por turno, sin listas, sin emojis, sin URLs.
- Español neutro con "tú": di "puedes", "prefieres", "disculpa", "te sirve". NUNCA uses voseo ni formas como "podés", "preferís", "querés", "disculpame", "vos". Di "anticipo", nunca "seña". Di "cita", nunca "turno".
- Di fechas y horas como en una conversación: "el jueves a las seis de la tarde", "mañana a las nueve y media de la mañana". Nunca "dieciocho horas" ni formatos numéricos.
- Confirma el nombre del paciente; si tienes dudas, pídele que lo deletree.
- No digas que eres una IA ni que esto es una demo salvo que te lo pregunten directamente. Si te lo preguntan, responde con honestidad y brevedad.`;
}

/** Declaraciones de tools para Gemini. El contrato es el mismo que tendría clinic-platform. */
export function toolDeclarations(lang: Locale) {
  const en = lang === 'en';
  return [{
    functionDeclarations: [
      {
        name: 'get_available_slots',
        description: en ? 'Lists available appointment slots for a service in the next 7 days. Call it before offering any time.' : 'Lista horarios disponibles para un servicio en los próximos 7 días. Llámalo antes de ofrecer cualquier horario.',
        parameters: {
          type: 'OBJECT',
          properties: {
            service: { type: 'STRING', description: en ? 'Service name as listed.' : 'Nombre del servicio tal como está en la lista.' },
            date: { type: 'STRING', description: en ? 'Optional. Specific day, YYYY-MM-DD.' : 'Opcional. Día puntual, YYYY-MM-DD.' },
            professional: { type: 'STRING', description: en ? 'Optional. Preferred professional name.' : 'Opcional. Nombre del profesional preferido.' },
          },
          required: ['service'],
        },
      },
      {
        name: 'book_appointment',
        description: en ? 'Books the chosen slot for the patient.' : 'Reserva el horario elegido para el paciente.',
        parameters: {
          type: 'OBJECT',
          properties: {
            slotId: { type: 'STRING', description: en ? 'Exact slotId from get_available_slots (like "s3").' : 'slotId exacto devuelto por get_available_slots (como "s3").' },
            name: { type: 'STRING', description: en ? 'Patient first and last name.' : 'Nombre y apellido del paciente.' },
            phone: { type: 'STRING', description: en ? 'Optional mobile number.' : 'Celular, opcional.' },
          },
          required: ['slotId', 'name'],
        },
      },
      {
        name: 'reschedule_appointment',
        description: en ? 'Moves the existing booking to another slot.' : 'Mueve la cita ya reservada a otro horario.',
        parameters: { type: 'OBJECT', properties: { slotId: { type: 'STRING' } }, required: ['slotId'] },
      },
      {
        name: 'cancel_appointment',
        description: en ? 'Cancels the existing booking.' : 'Cancela la cita ya reservada.',
        parameters: { type: 'OBJECT', properties: {} },
      },
      {
        name: 'request_human',
        description: en ? 'The patient asked for a person, or asked something you must not answer.' : 'El paciente pidió hablar con una persona, o preguntó algo que no debes responder.',
        parameters: { type: 'OBJECT', properties: { reason: { type: 'STRING' } }, required: ['reason'] },
      },
      {
        name: 'end_call',
        description: en ? 'Ends the call. Call it only after you have said goodbye.' : 'Termina la llamada. Llámalo solo después de haber dicho la despedida.',
        parameters: { type: 'OBJECT', properties: {} },
      },
    ],
  }];
}

/** Turno oculto de usuario que dispara el saludo de Sara al conectar. */
export function greetingTrigger(clinic: VoiceClinic, lang: Locale): string {
  return lang === 'en'
    ? `(The patient just connected. Greet them briefly as Sara from ${clinic.name[lang]} and ask how you can help. One sentence.)`
    : `(El paciente acaba de conectarse. Salúdalo brevemente como Sara de ${clinic.name[lang]} y pregunta en qué lo puedes ayudar. Una sola frase.)`;
}

/** Config Live completa, lista para liveConnectConstraints. */
export function buildLiveConfig({ clinic, lang, now }: { clinic: VoiceClinic; lang: Locale; now: Date }) {
  const c = voiceLiveConfig[lang];
  return {
    model: c.model,
    config: {
      responseModalities: ['AUDIO'],
      systemInstruction: buildSystemInstruction({ clinic, lang, now }),
      tools: toolDeclarations(lang),
      inputAudioTranscription: {},
      outputAudioTranscription: {},
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: c.voiceName } }, languageCode: c.languageCode },
    },
  };
}
