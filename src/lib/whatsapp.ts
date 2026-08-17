// Líneas reales de Sara (las mismas que usa ray-website, con backend/SDR real),
// con ruteo por región AR/MX igual que allá. El link se server-renderiza a la línea
// MX (default) y el script de atribución del Layout lo re-escribe a la AR para
// visitantes de Argentina (por timezone / idioma). Solo dígitos (formato wa.me).
import type { Locale } from '../i18n/config';

export const WHATSAPP_AR = '5491150363441';
export const WHATSAPP_MX = '526144659466'; // default
export const WHATSAPP_TEXT = 'Hola Sara, quiero saber cómo funciona para mi clínica.';
export const WHATSAPP_TEXT_EN = 'Hi Sara, I want to know how this works for my clinic.';

/** Texto base del mensaje de WhatsApp según idioma (el sufijo de atribución lo agrega whatsappLink/enhance). */
export function whatsappText(lang: Locale): string {
  return lang === 'en' ? WHATSAPP_TEXT_EN : WHATSAPP_TEXT;
}

// Marcador de marca. Viaja DENTRO del texto del mensaje, igual que los click-ids.
//
// Las dos líneas de WhatsApp son compartidas con RAY y el backend (repo `scrapper`) es
// el mismo, así que sin esto una conversación que nace en holasara.ai es indistinguible
// de una de RAY: Sara responde con el conocimiento de restaurantes y la conversión se
// sube a la acción de Ads equivocada.
//
// Meta resuelve esto solo — sus anuncios Click-to-WhatsApp adjuntan un `referral` con el
// source_id del ad. Google no: el tráfico llega como un wa.me común. Este marcador es el
// único dato de marca que sobrevive el salto del sitio a WhatsApp.
//
// El regex actual del backend (`extractClickId`) solo matchea gclid|wbraid|gbraid, así
// que hoy esto viaja y se ignora sin romper nada. Leerlo requiere un cambio del lado de
// `scrapper` (`extractSource()` + campo `source` en SdrConversation).
export const SRC_TAG = '[src:hs]';

/** Sufijo de atribución: marca (siempre) + click-ids (si los hay). */
export function saraTag(clickToken: string = ''): string {
  return SRC_TAG + (clickToken || '');
}

export function whatsappLink(text: string = WHATSAPP_TEXT): string {
  return `https://wa.me/${WHATSAPP_MX}?text=${encodeURIComponent(`${text} ${SRC_TAG}`)}`;
}
