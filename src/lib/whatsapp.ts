// Líneas reales de Sara (las mismas que usa ray-website, con backend/SDR real),
// con ruteo por región AR/MX igual que allá. El link se server-renderiza a la línea
// MX (default) y el script de atribución del Layout lo re-escribe a la AR para
// visitantes de Argentina (por timezone / idioma). Solo dígitos (formato wa.me).
export const WHATSAPP_AR = '5491150363441';
export const WHATSAPP_MX = '526144659466'; // default
export const WHATSAPP_TEXT = 'Hola Sara, quiero saber cómo funciona para mi clínica.';

export function whatsappLink(text: string = WHATSAPP_TEXT): string {
  return `https://wa.me/${WHATSAPP_MX}?text=${encodeURIComponent(text)}`;
}
