/**
 * Interruptores de sitio. Uno por constante, con el motivo al lado:
 * un `false` sin explicación es imposible de revertir con confianza meses después.
 */

/**
 * CTA "Escanear mi negocio" del header, que sale a grader.rayapp.ai.
 *
 * Apagado mientras corren las campañas de Google Ads (desde 2026-08-17). El grader
 * es otro dominio y solo tiene GA4 (`G-DK6TVZ0YVE`), no el tag de Ads: una conversión
 * allá es invisible para el bidding de la cuenta 139-339-4662. Con el CTA visible, el
 * botón más prominente del header se lleva tráfico pago a un embudo que no medimos, y
 * Smart Bidding aprende con datos incompletos.
 *
 * Para revertir alcanza con poner `true`. Si algún día el grader carga el tag de Ads
 * y la conversión vuelve a la misma cuenta, esta constante deja de tener sentido.
 */
export const SHOW_GRADER_CTA = false;
