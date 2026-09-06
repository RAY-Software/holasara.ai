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
