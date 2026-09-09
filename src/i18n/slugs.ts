// Slugs localizados por idioma (decisión de Franco, 3-sep-2026): una landing nace con
// su slug en cada idioma, pensado para la keyword de ese mercado (ES México, EN US).
//
// Cada entrada es UNA página fuente en src/pages/[lang]/[<key>].astro, que genera
// /es/<es> y /en/<en>. La key es el nombre del param dinámico del archivo.
//
// Todo lo que resuelve rutas (localePath, hreflang del Layout, switch de idioma del
// Header) pasa por acá: un link interno puede escribirse con el slug de cualquier
// idioma (`/llamadas` o `/medical-answering-service`) y se traduce al idioma de render.
//
// Ojo: las páginas históricas (agenda, cobros, etc.) siguen con el mismo slug en ambos
// idiomas; migran a este mapa cuando alguien les defina un slug EN propio.

import type { Locale } from './locales.ts';

export const localizedSlugs = {
  /** Recordatorios de citas por WhatsApp (MX) ↔ appointment reminders (US). */
  reminders: { es: 'recordatorio-de-citas-por-whatsapp', en: 'appointment-reminders' },
  /** Recepcionista virtual para dentales y estética (MX) ↔ ai receptionist for dental & med spa (US). */
  receptionist: { es: 'recepcionista-virtual', en: 'ai-receptionist' },
  /** Sara atiende el teléfono (ES) ↔ medical answering service (US). Antes /en/llamadas (301 en vercel.json). */
  answering: { es: 'llamadas', en: 'medical-answering-service' },
  /** Daniel: contabilidad de la clínica con Plaid y QuickBooks. */
  finance: { es: 'contabilidad-para-clinicas', en: 'medical-practice-bookkeeping' },
  /** Mia: SEO dental. */
  dentalSeo: { es: 'seo-dental', en: 'dental-seo' },
  /** Mia: SEO para med spa / clínicas de estética. */
  medSpaSeo: { es: 'seo-para-clinicas-de-estetica', en: 'med-spa-seo' },
  /** Mia: AEO / GEO, aparecer en ChatGPT y los buscadores con IA. */
  aeo: { es: 'aeo', en: 'aeo' },
  /** Página de integraciones. */
  integrations: { es: 'integraciones', en: 'integrations' },
  /** Términos y condiciones ↔ terms. */
  terms: { es: 'terminos', en: 'terms' },
  /** Política de privacidad ↔ privacy. */
  privacy: { es: 'privacidad', en: 'privacy' },
  /** Nosotros ↔ about. */
  about: { es: 'nosotros', en: 'about' },
  /** Cobros y señas ↔ payments. */
  payments: { es: 'cobros', en: 'payments' },
  /** Canales (WhatsApp/Instagram/web) ↔ channels. */
  channels: { es: 'canales', en: 'channels' },
  /** Agenda ↔ scheduling. */
  scheduling: { es: 'agenda', en: 'scheduling' },
  /** Reactivación de pacientes ↔ win-back. */
  winBack: { es: 'reactivacion', en: 'win-back' },
  /** Reseñas ↔ reviews. */
  reviews: { es: 'resenas', en: 'reviews' },
  /** Modo operador ↔ operator. */
  operator: { es: 'operador', en: 'operator' },
  /** Implementación ↔ implementation. */
  implementation: { es: 'implementacion', en: 'implementation' },
  /** Prueba gratis ↔ free-trial. */
  freeTrial: { es: 'free-trial', en: 'free-trial' },
  /** Precios ↔ pricing. Vuelve a publicarse (sep 2026); antes redirigía a /demo. */
  pricing: { es: 'precios', en: 'pricing' },
  /** Caso de éxito ↔ case-study. */
  caseStudy: { es: 'caso', en: 'case-study' },
  /** Comparativa de asistentes IA ↔ best-ai-assistants-for-clinics. */
  bestAssistants: { es: 'mejores-asistentes-ia-clinicas', en: 'best-ai-assistants-for-clinics' },
} as const satisfies Record<string, Record<Locale, string>>;

export type SlugKey = keyof typeof localizedSlugs;

/** Devuelve la key cuyo slug (en cualquier idioma) coincide con el segmento dado. */
export function slugKeyOf(segment: string): SlugKey | undefined {
  for (const key of Object.keys(localizedSlugs) as SlugKey[]) {
    const s = localizedSlugs[key];
    if (s.es === segment || s.en === segment) return key;
  }
  return undefined;
}
