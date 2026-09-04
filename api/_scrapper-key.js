// Placeholder. Mismo mecanismo que api/_gemini-key.js: el workflow de deploy escribe el valor
// real antes del build desde el secret SCRAPPER_INBOUND_SECRET de GitHub (es el
// INBOUND_LEAD_SECRET del scrapper). Lo usa api/voice-end para avisar a Slack al terminar
// una demo de voz. Vacío en el repo a propósito. Nunca commitear el valor real.
export const SCRAPPER_INBOUND_SECRET = '';
