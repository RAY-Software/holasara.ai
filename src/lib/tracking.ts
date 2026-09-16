// Config de tracking (GA4 + Google Ads + Meta Pixel). Los tags se cargan SOLO en build
// de producción y SOLO si definís las env vars — ver .env.example.
//
// Dos labels de Google Ads a propósito: el formulario de demo es la conversión PRINCIPAL
// y el clic de WhatsApp va como SECUNDARIA (solo observación). Si comparten label, Smart
// Bidding optimiza hacia el clic —que es barato y no es un lead— y el pipeline queda vacío.
//
// La conversión de WhatsApp que de verdad vale (mensaje recibido, no clic) no se dispara
// desde acá: se sube por Offline Conversion Import desde el backend, matcheando el gclid
// que viaja dentro del texto del mensaje. Ver el script de atribución en Layout.astro.

export const GA4_ID = import.meta.env.PUBLIC_GA4_ID ?? 'G-NRN8H0WR62';
export const META_PIXEL_ID = import.meta.env.PUBLIC_META_PIXEL_ID ?? '';
export const GOOGLE_ADS_ID = import.meta.env.PUBLIC_GOOGLE_ADS_ID ?? '';

// PostHog: instrumentación del funnel del Free Trial (top del embudo, que vive acá).
// El backend (clinic-core) ya captura demo→convert keyed por email; acá cubrimos lo que
// nunca llega al server: landing viewed, errores de validación del form y POST roto.
// Project API key write-only (segura en cliente, como el GA4_ID). El proyecto es COMPARTIDO
// con RAY restaurantes → todos los eventos van namespaceados con product:'sara'.
export const POSTHOG_KEY = import.meta.env.PUBLIC_POSTHOG_KEY ?? 'phc_5z8QWQ0vmiD2s3ODAjiBv3Jm2h09DbhQgx6ikuZgFYW';
export const POSTHOG_HOST = import.meta.env.PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com';

// Label único del setup anterior. Queda como fallback del form para no romper nada si
// todavía no cargaste los labels nuevos.
const LEGACY_LEAD_LABEL = import.meta.env.PUBLIC_GOOGLE_ADS_LEAD_LABEL ?? '';

export const ADS_DEMO_LABEL = import.meta.env.PUBLIC_GOOGLE_ADS_DEMO_LABEL ?? LEGACY_LEAD_LABEL;
export const ADS_WA_LABEL = import.meta.env.PUBLIC_GOOGLE_ADS_WA_LABEL ?? '';

/** Se serializa a window.__saraTrack para que lo lean los scripts inline. */
export const saraTrack = {
  adsId: GOOGLE_ADS_ID,
  demoLabel: ADS_DEMO_LABEL,
  waLabel: ADS_WA_LABEL,
};
