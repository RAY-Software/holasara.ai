// Locales del sitio. Módulo hoja sin imports: lo usan config.ts (que lo re-exporta)
// y slugs.ts, así ninguno de los dos cierra un ciclo de imports con el otro.
export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';
