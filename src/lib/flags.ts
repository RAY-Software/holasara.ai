/**
 * Interruptores de sitio. Uno por constante, con el motivo al lado:
 * un `false` sin explicación es imposible de revertir con confianza meses después.
 */

/**
 * CTA "Escanear mi negocio" que sale a grader.rayapp.ai (header + hero).
 *
 * Prendido 2026-08-17 por decisión de Franco. OJO con el contexto que motivó el
 * apagado original: el grader es otro dominio y solo tiene GA4 (`G-DK6TVZ0YVE`),
 * no el tag de Google Ads — una conversión allá es invisible para el bidding de la
 * cuenta 139-339-4662. Con campañas activas, este CTA manda tráfico pago a un embudo
 * que Ads no mide y Smart Bidding aprende con datos incompletos.
 *
 * Poner en `false` para volver a ocultarlo si eso vuelve a ser un problema. La
 * solución de fondo es que el grader dispare la conversión a la misma cuenta de Ads.
 */
export const SHOW_GRADER_CTA = true;
