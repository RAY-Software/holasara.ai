// Link a WhatsApp de Sara. Reemplazar por el número real de la línea comercial.
export const WHATSAPP_NUMBER = '17868547465'; // línea de Sara (+1 786 854 7465)
export const WHATSAPP_TEXT = 'Hola Sara, quiero saber cómo funciona para mi clínica.';

export function whatsappLink(text: string = WHATSAPP_TEXT): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
