// i18n del sitio. Español (LATAM) es el idioma principal; inglés (EN) es la
// segunda variante. Rutas prefijadas por idioma (/es/*, /en/*), igual que
// RAY-Website. El routing lo maneja la ruta dinámica src/pages/[lang]/*, así
// que NO usamos el i18n nativo de Astro (chocaría con el param [lang]).

import { localizedSlugs, slugKeyOf, type SlugKey } from './slugs.ts';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'es';

/** ¿El string es un locale soportado? Type guard para leer Astro.params.lang. */
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** Devuelve un Locale seguro desde un valor arbitrario (params, cookie, etc.). */
export function toLocale(value: unknown): Locale {
  return isLocale(value) ? value : defaultLocale;
}

/**
 * Prefija un path absoluto del sitio con el idioma: '/agenda' → '/es/agenda'.
 * Deja pasar sin tocar los enlaces externos, mailto/tel y anclas puras.
 *
 * Si el primer segmento es un slug localizado (src/i18n/slugs.ts), lo traduce al
 * idioma pedido: '/llamadas' → '/en/medical-answering-service',
 * '/appointment-reminders' → '/es/recordatorio-de-citas-por-whatsapp'. Query y hash
 * se conservan.
 */
export function localePath(path: string, lang: Locale): string {
  if (/^(https?:|mailto:|tel:|#)/i.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (clean === '/') return `/${lang}`;
  const m = clean.match(/^\/([^/?#]+)(.*)$/);
  if (m) {
    const key = slugKeyOf(m[1]);
    if (key) return `/${lang}/${localizedSlugs[key][lang]}${m[2]}`;
  }
  return `/${lang}${clean}`;
}

/** Slug de una página localizada en un idioma dado (sin prefijo de idioma). */
export function slugFor(key: SlugKey, lang: Locale): string {
  return localizedSlugs[key][lang];
}

/**
 * getStaticPaths compartido por todas las páginas bajo [lang]/. Cada página
 * lo re-exporta: `export { getStaticPaths } from '../../i18n/config';`
 */
export function getStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}

/**
 * getStaticPaths para páginas con slug localizado. El archivo se llama
 * src/pages/[lang]/[<key>].astro y hace:
 *   export const getStaticPaths = () => localizedStaticPaths('reminders');
 * Genera /es/<slug es> y /en/<slug en>; el dev server ignora las combinaciones
 * que no estén acá (404), así que /es/<slug en> no existe.
 */
export function localizedStaticPaths(key: SlugKey) {
  return locales.map((lang) => ({ params: { lang, [key]: localizedSlugs[key][lang] } }));
}
