// Diccionario de la "chrome" compartida del sitio: header, footer, CTAs comunes
// y los defaults de <Layout>. El copy específico de cada página vive en su propio
// módulo (src/i18n/pages/*). Una entrada por idioma. EN no es traducción: es el sitio
// del producto para clínicas de Estados Unidos (equipo completo, Plaid y QuickBooks).

import type { Locale } from './config';

export const ui = {
  es: {
    // Layout / meta
    'meta.title': 'Sara · La recepción que nunca cierra',
    'meta.description':
      'Sara, recepcionista con IA para clínicas, médicos y wellness: responde, agenda, cobra y baja ausencias por WhatsApp, Instagram y teléfono. Con Mia y Daniel.',

    // Header
    'nav.product': 'Producto',
    'nav.business': 'Negocios',
    'nav.byIndustry': 'Por industria',
    'nav.bySize': 'Por tamaño',
    'header.scanCta': 'Escanear mi negocio',
    'header.demoCta': 'Probar gratis',
    'header.openMenu': 'Abrir menú',
    'header.closeMenu': 'Cerrar menú',
    'header.homeAria': 'Sara, inicio',
    'header.caseKicker': 'Caso real',
    'header.caseTitleProduct': 'ViaLaser ya trabaja con Sara',
    'header.caseTitleBusiness': 'Una cadena de láser ya trabaja con Sara',
    'header.caseTitleSecond': 'Conoce clínicas que ya trabajan con Sara',
    'header.caseCta': 'Ver el caso',
    'header.caseImgAlt': 'Resultados reales de ViaLaser con Sara',
    'header.caseSecondImgAlt': 'Clínica de estética atendiendo a una paciente',

    // Footer
    'footer.tagline': 'La recepción que nunca cierra.',
    'footer.talkToSara': 'Habla con Sara',
    'footer.features': 'Funcionalidades',
    'footer.business': 'Negocios',
    'footer.bySize': 'Por tamaño',
    'footer.company': 'Sara',
    'footer.about': 'Nosotros',
    'footer.cases': 'Casos',
    'footer.compare': 'Comparativa 2026',
    'footer.trial': 'Probar gratis',
    'footer.pricing': 'Precios',
    'footer.terms': 'Términos y condiciones',
    'footer.privacy': 'Política de privacidad',
    'footer.smsNotice': 'SMS: al escribirle a un negocio que usa Sara, aceptas recibir mensajes SMS de atención y agendamiento. La frecuencia de mensajes varía. Pueden aplicar tarifas de mensaje y datos. Responde STOP para darte de baja, HELP para ayuda.',
    'footer.smsNoticeLink': 'Ver términos de SMS',
    'footer.termsShort': 'Términos',
    'footer.privacyShort': 'Privacidad',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.productOf': 'un producto de BotBit, Inc. (RAY).',

    // Language switcher
    'lang.switch': 'Idioma',
    'lang.es': 'Español',
    'lang.en': 'English',
  },
  en: {
    // Layout / meta
    'meta.title': 'Sara AI · AI receptionist, marketing and books for your practice',
    'meta.description':
      'Sara answers calls and texts, books and collects. Mia brings in patients. Daniel keeps the books with Plaid and QuickBooks. For dental offices and med spas.',

    // Header
    'nav.product': 'Product',
    'nav.business': 'Industries',
    'nav.byIndustry': 'By specialty',
    'nav.bySize': 'By size',
    'header.scanCta': 'Scan my business',
    'header.demoCta': 'Try it free',
    'header.openMenu': 'Open menu',
    'header.closeMenu': 'Close menu',
    'header.homeAria': 'Sara, home',
    'header.caseKicker': 'Case study',
    'header.caseTitleProduct': 'ViaLaser already runs on Sara',
    'header.caseTitleBusiness': 'A laser-clinic chain already runs on Sara',
    'header.caseTitleSecond': 'See practices already running on Sara',
    'header.caseCta': 'See the case',
    'header.caseImgAlt': 'Real results from ViaLaser with Sara',
    'header.caseSecondImgAlt': 'Aesthetic clinic treating a patient',

    // Footer
    'footer.tagline': 'Front desk, marketing and books. One AI team.',
    'footer.talkToSara': 'Talk to Sara',
    'footer.features': 'Features',
    'footer.business': 'Industries',
    'footer.bySize': 'By size',
    'footer.company': 'Sara',
    'footer.about': 'About us',
    'footer.cases': 'Case studies',
    'footer.compare': '2026 comparison',
    'footer.trial': 'Try it free',
    'footer.pricing': 'Pricing',
    'footer.terms': 'Terms & conditions',
    'footer.privacy': 'Privacy policy',
    'footer.smsNotice': 'SMS: by texting a business that uses Sara, you agree to receive SMS for customer care and appointment booking. Message frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for help.',
    'footer.smsNoticeLink': 'See SMS terms',
    'footer.termsShort': 'Terms',
    'footer.privacyShort': 'Privacy',
    'footer.rights': 'All rights reserved.',
    'footer.productOf': 'a product of BotBit, Inc. (RAY).',

    // Language switcher
    'lang.switch': 'Language',
    'lang.es': 'Español',
    'lang.en': 'English',
  },
} as const;

export type UIKey = keyof (typeof ui)['es'];

/** Devuelve la función de traducción t() para un idioma, con fallback a ES. */
export function useTranslations(lang: Locale) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui.es[key];
  };
}
