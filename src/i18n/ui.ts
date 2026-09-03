// Diccionario de la "chrome" compartida del sitio: header, footer, CTAs comunes
// y los defaults de <Layout>. El copy específico de cada página vive en su propio
// módulo (src/i18n/pages/*). Una entrada por idioma; EN es traducción, no calco.

import type { Locale } from './config';

export const ui = {
  es: {
    // Layout / meta
    'meta.title': 'Sara · La recepción que nunca cierra',
    'meta.description':
      'Sara, recepcionista con IA para clínicas: responde, agenda, cobra y baja ausencias en WhatsApp, Instagram y teléfono. Con Mia (marketing) y Daniel (finanzas).',

    // Header
    'nav.product': 'Producto',
    'nav.business': 'Negocios',
    'nav.byIndustry': 'Por industria',
    'nav.bySize': 'Por tamaño',
    'header.scanCta': 'Escanear mi negocio',
    'header.demoCta': 'Pedir demo',
    'header.openMenu': 'Abrir menú',
    'header.closeMenu': 'Cerrar menú',
    'header.homeAria': 'Sara, inicio',
    'header.caseKicker': 'Caso real',
    'header.caseTitleProduct': 'ViaLaser ya trabaja con Sara',
    'header.caseTitleBusiness': 'Una cadena de láser ya trabaja con Sara',
    'header.caseTitleSecond': 'Conoce clínicas que ya trabajan con Sara',
    'header.caseCta': 'Ver el caso',
    'header.caseImgAlt': 'Resultados reales de ViaLaser con Sara',

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
    'footer.pricing': 'Precios',
    'footer.terms': 'Términos y condiciones',
    'footer.privacy': 'Política de privacidad',
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
    'meta.title': 'Sara · The front desk that never closes',
    'meta.description':
      'Sara, the AI receptionist for clinics: answers, books, collects and cuts no-shows on WhatsApp, Instagram and phone. With Mia (marketing) and Daniel (finance).',

    // Header
    'nav.product': 'Product',
    'nav.business': 'Businesses',
    'nav.byIndustry': 'By industry',
    'nav.bySize': 'By size',
    'header.scanCta': 'Scan my business',
    'header.demoCta': 'Book a demo',
    'header.openMenu': 'Open menu',
    'header.closeMenu': 'Close menu',
    'header.homeAria': 'Sara, home',
    'header.caseKicker': 'Real case',
    'header.caseTitleProduct': 'ViaLaser already works with Sara',
    'header.caseTitleBusiness': 'A laser-clinic chain already works with Sara',
    'header.caseTitleSecond': 'See clinics already working with Sara',
    'header.caseCta': 'See the case',
    'header.caseImgAlt': 'Real results from ViaLaser with Sara',

    // Footer
    'footer.tagline': 'The front desk that never closes.',
    'footer.talkToSara': 'Talk to Sara',
    'footer.features': 'Features',
    'footer.business': 'Businesses',
    'footer.bySize': 'By size',
    'footer.company': 'Sara',
    'footer.about': 'About us',
    'footer.cases': 'Cases',
    'footer.compare': '2026 comparison',
    'footer.pricing': 'Pricing',
    'footer.terms': 'Terms & conditions',
    'footer.privacy': 'Privacy policy',
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
