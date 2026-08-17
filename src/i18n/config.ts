// i18n del sitio. Español (LATAM) es el idioma principal; inglés (EN) es la
// segunda variante. Rutas prefijadas por idioma (/es/*, /en/*), igual que
// RAY-Website. El routing lo maneja la ruta dinámica src/pages/[lang]/*, así
// que NO usamos el i18n nativo de Astro (chocaría con el param [lang]).

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
 */
export function localePath(path: string, lang: Locale): string {
  if (/^(https?:|mailto:|tel:|#)/i.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return clean === '/' ? `/${lang}` : `/${lang}${clean}`;
}

/**
 * getStaticPaths compartido por todas las páginas bajo [lang]/. Cada página
 * lo re-exporta: `export { getStaticPaths } from '../../i18n/config';`
 */
export function getStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}
