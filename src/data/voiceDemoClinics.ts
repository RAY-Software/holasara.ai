// Clínicas FICTICIAS de la demo de voz (holasara.ai/llamadas). No son tenants de
// clinic-platform: son config estática, bilingüe, que alimenta el prompt de Sara y
// la agenda simulada. Una entrada por tipo de clínica (`intent`). Lo mismo que hace
// Hello Patient con su enum `intent` (dermatology, dentistry, …), pero en nuestro
// vertical: estética, dental y consultorio médico.
//
// Los precios se hablan en la moneda del idioma: ES → MXN (la clínica está en México),
// EN → USD (la clínica está en Miami). Son cifras verosímiles, no reales.

import type { Locale } from '../i18n/config';

export type VoiceIntent = 'estetica' | 'dental' | 'consultorio';
export const voiceIntents: readonly VoiceIntent[] = ['estetica', 'dental', 'consultorio'];

export function isVoiceIntent(v: unknown): v is VoiceIntent {
  return typeof v === 'string' && (voiceIntents as readonly string[]).includes(v);
}

type Bilingual = Record<Locale, string>;
export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export const weekdays: readonly Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export interface VoiceService {
  name: Bilingual;
  durationMin: number;
  /** Precio por idioma: es → MXN, en → USD. */
  price: Record<Locale, number>;
  note?: Bilingual;
}

export interface VoiceProfessional {
  name: string;
  role: Bilingual;
}

export interface VoiceClinic {
  intent: VoiceIntent;
  name: Bilingual;
  /** Dirección hablable, por idioma (la clínica "vive" en MX para ES y en Miami para EN). */
  address: Bilingual;
  timezone: Record<Locale, string>;
  currency: Record<Locale, string>;
  /** Horarios por día: lista de rangos [apertura, cierre] en "HH:MM". Vacío = cerrado. */
  hours: Record<Weekday, Array<[string, string]>>;
  services: VoiceService[];
  professionals: VoiceProfessional[];
  /** Política de cancelación y anticipo, en texto hablable. */
  policies: Bilingual;
  /** Porcentaje de anticipo que pide al reservar (0 = no pide). */
  depositPct: number;
  /** Rasgos de tono para el prompt. */
  persona: Bilingual;
  /** Qué debe preguntar Sara además de servicio y horario (p. ej. paciente nuevo). */
  intake: Bilingual;
}

const weekdayHours = (open: string, close: string): Array<[string, string]> => [[open, close]];

export const voiceDemoClinics: Record<VoiceIntent, VoiceClinic> = {
  estetica: {
    intent: 'estetica',
    name: { es: 'Lumen Estética', en: 'Lumen Aesthetics' },
    address: { es: 'Avenida Presidente Masaryk 120, Polanco, Ciudad de México', en: '2800 Ponce de Leon Blvd, Coral Gables, Miami' },
    timezone: { es: 'America/Mexico_City', en: 'America/New_York' },
    currency: { es: 'MXN', en: 'USD' },
    hours: {
      mon: weekdayHours('09:00', '19:00'),
      tue: weekdayHours('09:00', '19:00'),
      wed: weekdayHours('09:00', '19:00'),
      thu: weekdayHours('09:00', '19:00'),
      fri: weekdayHours('09:00', '19:00'),
      sat: weekdayHours('09:00', '14:00'),
      sun: [],
    },
    services: [
      { name: { es: 'Limpieza facial profunda', en: 'Deep cleansing facial' }, durationMin: 60, price: { es: 1200, en: 150 } },
      { name: { es: 'Depilación láser', en: 'Laser hair removal' }, durationMin: 45, price: { es: 1500, en: 180 }, note: { es: 'precio por zona', en: 'price per area' } },
      { name: { es: 'Bótox', en: 'Botox' }, durationMin: 30, price: { es: 4500, en: 400 }, note: { es: 'requiere valoración previa con la doctora', en: 'requires a prior consultation with the doctor' } },
      { name: { es: 'Rellenos con ácido hialurónico', en: 'Hyaluronic acid fillers' }, durationMin: 45, price: { es: 6500, en: 650 }, note: { es: 'requiere valoración previa', en: 'requires a prior consultation' } },
      { name: { es: 'Peeling químico', en: 'Chemical peel' }, durationMin: 45, price: { es: 1800, en: 200 } },
      { name: { es: 'Drenaje linfático', en: 'Lymphatic drainage' }, durationMin: 60, price: { es: 1100, en: 130 } },
      { name: { es: 'Valoración con la doctora', en: 'Consultation with the doctor' }, durationMin: 30, price: { es: 0, en: 0 }, note: { es: 'sin costo, se descuenta del tratamiento', en: 'free, credited toward the treatment' } },
    ],
    professionals: [
      { name: 'Dra. Valeria Soto', role: { es: 'médica estética, hace bótox, rellenos y valoraciones', en: 'aesthetic doctor, does Botox, fillers and consultations' } },
      { name: 'Camila', role: { es: 'cosmetóloga, hace faciales, peelings, láser y drenajes', en: 'aesthetician, does facials, peels, laser and drainage' } },
    ],
    policies: {
      es: 'Para reservar se pide un anticipo del 20 % que se descuenta del tratamiento. Se puede cancelar o mover sin costo hasta 24 horas antes; con menos aviso se pierde el anticipo.',
      en: 'A 20% deposit is required to book and is credited toward the treatment. Cancel or reschedule for free up to 24 hours before; with less notice the deposit is forfeited.',
    },
    depositPct: 20,
    persona: {
      es: 'cálida, cercana y sin apuro; trata a cada paciente como habitual',
      en: 'warm, relaxed and unhurried; treats every patient like a regular',
    },
    intake: {
      es: 'Si el tratamiento requiere valoración (bótox, rellenos), agenda primero la valoración y explica que es sin costo.',
      en: 'If the treatment requires a consultation (Botox, fillers), book the consultation first and explain it is free.',
    },
  },

  dental: {
    intent: 'dental',
    name: { es: 'Sonrisa Dental', en: 'Bright Smile Dental' },
    address: { es: 'Avenida Chapultepec 480, Colonia Americana, Guadalajara', en: '1450 Brickell Ave, Miami' },
    timezone: { es: 'America/Mexico_City', en: 'America/New_York' },
    currency: { es: 'MXN', en: 'USD' },
    hours: {
      mon: weekdayHours('08:00', '20:00'),
      tue: weekdayHours('08:00', '20:00'),
      wed: weekdayHours('08:00', '20:00'),
      thu: weekdayHours('08:00', '20:00'),
      fri: weekdayHours('08:00', '18:00'),
      sat: weekdayHours('09:00', '13:00'),
      sun: [],
    },
    services: [
      { name: { es: 'Limpieza dental', en: 'Dental cleaning' }, durationMin: 45, price: { es: 900, en: 120 } },
      { name: { es: 'Blanqueamiento', en: 'Teeth whitening' }, durationMin: 60, price: { es: 3500, en: 350 } },
      { name: { es: 'Consulta de ortodoncia', en: 'Orthodontic consultation' }, durationMin: 30, price: { es: 500, en: 75 }, note: { es: 'incluye plan de tratamiento', en: 'includes a treatment plan' } },
      { name: { es: 'Valoración para implante', en: 'Implant evaluation' }, durationMin: 45, price: { es: 800, en: 150 } },
      { name: { es: 'Urgencia por dolor', en: 'Emergency visit for pain' }, durationMin: 30, price: { es: 700, en: 110 }, note: { es: 'se atiende el mismo día', en: 'seen the same day' } },
      { name: { es: 'Control de rutina', en: 'Routine check-up' }, durationMin: 30, price: { es: 450, en: 60 } },
    ],
    professionals: [
      { name: 'Dr. Andrés Mora', role: { es: 'odontólogo general, urgencias e implantes', en: 'general dentist, emergencies and implants' } },
      { name: 'Dra. Lucía Fernández', role: { es: 'ortodoncista', en: 'orthodontist' } },
    ],
    policies: {
      es: 'No se pide anticipo. Se puede cancelar o mover sin costo hasta 12 horas antes. Las urgencias por dolor se atienden el mismo día, en el primer hueco libre.',
      en: 'No deposit required. Cancel or reschedule for free up to 12 hours before. Emergencies for pain are seen the same day, in the first open slot.',
    },
    depositPct: 0,
    persona: {
      es: 'clara, tranquilizadora y eficiente; mucha gente llama con dolor o nervios',
      en: 'clear, reassuring and efficient; many callers are in pain or nervous',
    },
    intake: {
      es: 'Si hay dolor, trátalo como urgencia: ofrece el primer hueco de hoy. Para ortodoncia, agenda con la Dra. Fernández.',
      en: 'If there is pain, treat it as an emergency: offer the first open slot today. For orthodontics, book with Dr. Fernández.',
    },
  },

  consultorio: {
    intent: 'consultorio',
    name: { es: 'Consultorio Dra. Rivas', en: 'Rivas Family Practice' },
    address: { es: 'Calzada del Valle 200, San Pedro Garza García, Monterrey', en: '8500 SW 8th St, Westchester, Miami' },
    timezone: { es: 'America/Monterrey', en: 'America/New_York' },
    currency: { es: 'MXN', en: 'USD' },
    hours: {
      mon: weekdayHours('08:00', '18:00'),
      tue: weekdayHours('08:00', '18:00'),
      wed: weekdayHours('08:00', '18:00'),
      thu: weekdayHours('08:00', '18:00'),
      fri: weekdayHours('08:00', '15:00'),
      sat: [],
      sun: [],
    },
    services: [
      { name: { es: 'Consulta general', en: 'General consultation' }, durationMin: 30, price: { es: 800, en: 120 } },
      { name: { es: 'Consulta de seguimiento', en: 'Follow-up visit' }, durationMin: 20, price: { es: 500, en: 80 } },
      { name: { es: 'Certificado médico', en: 'Medical certificate' }, durationMin: 20, price: { es: 400, en: 60 } },
      { name: { es: 'Vacunación', en: 'Vaccination' }, durationMin: 15, price: { es: 350, en: 45 }, note: { es: 'más el costo de la vacuna', en: 'plus the cost of the vaccine' } },
      { name: { es: 'Chequeo anual con análisis', en: 'Annual check-up with lab work' }, durationMin: 45, price: { es: 1800, en: 250 }, note: { es: 'ir en ayunas', en: 'come fasting' } },
      { name: { es: 'Consulta por videollamada', en: 'Video consultation' }, durationMin: 20, price: { es: 600, en: 90 } },
    ],
    professionals: [
      { name: 'Dra. Mariana Rivas', role: { es: 'médica familiar', en: 'family physician' } },
      { name: 'Dr. Tomás Herrera', role: { es: 'médico general, atiende los lunes, miércoles y viernes', en: 'general practitioner, sees patients Monday, Wednesday and Friday' } },
    ],
    policies: {
      es: 'No se pide anticipo. Se puede cancelar o mover sin costo hasta 24 horas antes. Los pacientes nuevos deben llegar 10 minutos antes para completar la ficha.',
      en: 'No deposit required. Cancel or reschedule for free up to 24 hours before. New patients should arrive 10 minutes early to complete their intake form.',
    },
    depositPct: 0,
    persona: {
      es: 'serena, respetuosa y precisa; nunca da consejo médico',
      en: 'calm, respectful and precise; never gives medical advice',
    },
    intake: {
      es: 'Pregunta siempre si es paciente nuevo o ya se atendió antes. Si describe síntomas graves (dolor de pecho, dificultad para respirar), indícale que llame a emergencias y no agendes.',
      en: 'Always ask whether they are a new or existing patient. If they describe severe symptoms (chest pain, trouble breathing), tell them to call emergency services and do not book.',
    },
  },
};
