// Arquitectura de información del sitio. Fuente única para el mega menú (desktop
// + mobile), el footer y los índices. Cada feature es una página dedicada.
//
// Bilingüe: el `href` es el path base (sin prefijo de idioma, se prefija al
// render con localePath). `name`/`desc` traen las dos variantes. EN no es traducción:
// es el sitio del producto para clínicas de Estados Unidos (front desk, med spa,
// dental office, bookkeeping). Las landings con slug localizado se linkean por su
// slug ES (localePath lo traduce, ver src/i18n/slugs.ts).

import type { Locale } from '../i18n/config';

export type ProductIcon =
  | 'spark'
  | 'chat'
  | 'phone'
  | 'headset'
  | 'refresh'
  | 'calendar'
  | 'card'
  | 'gift'
  | 'camera'
  | 'star'
  | 'bell'
  | 'badge'
  | 'search'
  | 'robot'
  | 'chart';

export type BusinessIcon =
  | 'laser'
  | 'face'
  | 'hair'
  | 'tooth'
  | 'flower'
  | 'buildings'
  | 'storefront'
  | 'person';

export type NavIconName = ProductIcon | BusinessIcon;

export interface FeatureLink {
  name: string;
  href: string;
  desc: string;
  icon?: NavIconName;
}

export interface FeatureGroup {
  label: string;
  items: FeatureLink[];
}

interface RawLink {
  href: string;
  name: Record<Locale, string>;
  desc: Record<Locale, string>;
  icon?: NavIconName;
}

interface RawGroup {
  label: Record<Locale, string>;
  items: RawLink[];
}

const productGroupsRaw: RawGroup[] = [
  {
    label: { es: 'Atiende', en: 'Front desk' },
    items: [
      {
        href: '/sara',
        name: { es: 'Conoce a Sara', en: 'Meet Sara' },
        desc: { es: 'La secretaria con IA, de punta a punta.', en: 'Your AI receptionist, end to end.' },
        icon: 'spark',
      },
      {
        href: '/canales',
        name: { es: 'WhatsApp e Instagram 24/7', en: 'WhatsApp & Instagram DMs' },
        desc: { es: 'Responde donde te escriben, siempre.', en: 'Answers wherever patients message you, 24/7.' },
        icon: 'chat',
      },
      {
        // Slug localizado: /es/llamadas ↔ /en/medical-answering-service (src/i18n/slugs.ts).
        href: '/llamadas',
        name: { es: 'Atiende el teléfono', en: 'Medical answering service' },
        desc: { es: 'Contesta las llamadas por voz, 24/7.', en: 'Answers every call, 24/7, and books it.' },
        icon: 'phone',
      },
      {
        // Slug localizado: /es/recepcionista-virtual ↔ /en/ai-receptionist.
        href: '/recepcionista-virtual',
        name: { es: 'Recepcionista virtual', en: 'AI receptionist' },
        desc: { es: 'Para consultorios dentales y clínicas de estética.', en: 'For dental offices and med spas.' },
        icon: 'badge',
      },
      {
        href: '/operador',
        name: { es: 'Modo operador', en: 'Operator mode' },
        desc: { es: 'Tu equipo le pide cosas por WhatsApp.', en: 'Your team texts her, she gets it done.' },
        icon: 'headset',
      },
    ],
  },
  {
    label: { es: 'Agenda', en: 'Scheduling' },
    items: [
      {
        href: '/reactivacion',
        name: { es: 'Reactivación y lista de espera', en: 'Win-back & waitlist' },
        desc: {
          es: 'Trae de vuelta a quien no vuelve, llena los huecos.',
          en: 'Brings lapsed patients back, fills the gaps.',
        },
        icon: 'refresh',
      },
      {
        href: '/agenda',
        name: { es: 'Agenda automática', en: 'Scheduling & reminders' },
        desc: {
          es: 'Agenda sola, recuerda y confirma, sin dobles reservas.',
          en: 'Books, reminds and confirms. No double bookings.',
        },
        icon: 'calendar',
      },
      {
        // Slug localizado: /es/recordatorio-de-citas-por-whatsapp ↔ /en/appointment-reminders.
        href: '/recordatorio-de-citas-por-whatsapp',
        name: { es: 'Recordatorios por WhatsApp', en: 'Appointment reminders' },
        desc: { es: 'Recuerda, confirma y reprograma sola.', en: 'Reminds, confirms and reschedules on her own.' },
        icon: 'bell',
      },
    ],
  },
  {
    label: { es: 'Cobros', en: 'Payments' },
    items: [
      {
        href: '/cobros',
        name: { es: 'Anticipo y consulta', en: 'Deposits & consult fees' },
        desc: { es: 'Cobra antes de atender.', en: 'Get paid before the visit.' },
        icon: 'card',
      },
      {
        href: '/gift-cards',
        name: { es: 'Gift cards', en: 'Gift cards' },
        desc: { es: 'Vende tratamientos por adelantado.', en: 'Sell treatments in advance.' },
        icon: 'gift',
      },
    ],
  },
  {
    label: { es: 'Marketing', en: 'Marketing' },
    items: [
      {
        href: '/instagram',
        name: { es: 'Instagram con IA', en: 'Instagram on autopilot' },
        desc: { es: 'Publica y agenda a quien responde.', en: 'Mia posts, Sara books whoever replies.' },
        icon: 'camera',
      },
      {
        href: '/resenas',
        name: { es: 'Reseñas', en: 'Google reviews' },
        desc: { es: 'Más reseñas de 5 estrellas, solas.', en: 'More 5-star reviews, on their own.' },
        icon: 'star',
      },
      {
        // Slug localizado: /es/seo-dental ↔ /en/dental-seo.
        href: '/seo-dental',
        name: { es: 'SEO dental', en: 'Dental SEO' },
        desc: { es: 'Mia posiciona tu consultorio en Google.', en: 'Mia gets your practice found on Google.' },
        icon: 'search',
      },
      {
        // Slug localizado: /es/seo-para-clinicas-de-estetica ↔ /en/med-spa-seo.
        href: '/seo-para-clinicas-de-estetica',
        name: { es: 'SEO para estética', en: 'Med spa SEO' },
        desc: { es: 'Que te encuentren antes que a la competencia.', en: 'Get found before the med spa down the street.' },
        icon: 'search',
      },
      {
        // Slug localizado: /es/aeo ↔ /en/aeo.
        href: '/aeo',
        name: { es: 'Aparecer en ChatGPT (AEO)', en: 'AEO: show up in ChatGPT' },
        desc: { es: 'Que los asistentes con IA te recomienden.', en: 'Get recommended by AI assistants.' },
        icon: 'robot',
      },
    ],
  },
  {
    label: { es: 'Finanzas', en: 'Finance' },
    items: [
      {
        // Slug localizado: /es/contabilidad-para-clinicas ↔ /en/medical-practice-bookkeeping.
        href: '/contabilidad-para-clinicas',
        name: { es: 'Contabilidad de la clínica', en: 'Practice bookkeeping' },
        desc: { es: 'Daniel lleva las cuentas con Plaid y QuickBooks.', en: 'Daniel keeps the books with Plaid and QuickBooks.' },
        icon: 'chart',
      },
    ],
  },
];

const industryLinksRaw: RawLink[] = [
  {
    href: '/negocios/depilacion-laser',
    name: { es: 'Depilación láser', en: 'Laser hair removal' },
    desc: {
      es: 'La agenda llena entre sesiones, sin ausencias.',
      en: 'A full schedule between sessions, no no-shows.',
    },
    icon: 'laser',
  },
  {
    href: '/negocios/medicina-estetica',
    name: { es: 'Medicina estética', en: 'Med spas & aesthetics' },
    desc: {
      es: 'Consultas y tratamientos, cobrados por adelantado.',
      en: 'Consults and treatments, paid up front.',
    },
    icon: 'face',
  },
  {
    href: '/negocios/implante-capilar',
    name: { es: 'Implante capilar', en: 'Hair restoration' },
    desc: {
      es: 'Diagnósticos agendados y fechas aseguradas con anticipo.',
      en: 'Consults booked and dates secured with a deposit.',
    },
    icon: 'hair',
  },
  {
    href: '/negocios/odontologia',
    name: { es: 'Odontología', en: 'Dental offices' },
    desc: {
      es: 'Turnos que se confirman solos, sin recepción saturada.',
      en: 'Appointments that confirm themselves, no swamped front desk.',
    },
    icon: 'tooth',
  },
  {
    href: '/negocios/estetica-spa',
    name: { es: 'Estética y spa', en: 'Spa & wellness' },
    desc: {
      es: 'Reservas 24/7 por WhatsApp e Instagram.',
      en: '24/7 bookings by text, WhatsApp and Instagram.',
    },
    icon: 'flower',
  },
];

const sizeLinksRaw: RawLink[] = [
  {
    href: '/negocios/multi-local',
    name: { es: 'Multi-local', en: 'Multi-location' },
    desc: {
      es: 'Varias sedes, una sola Sara y todo en un panel.',
      en: 'Several locations, one Sara, one dashboard.',
    },
    icon: 'buildings',
  },
  {
    href: '/negocios/local-unico',
    name: { es: 'Local único', en: 'Single location' },
    desc: { es: 'Tu recepción, disponible las 24 horas.', en: 'Your front desk, open around the clock.' },
    icon: 'storefront',
  },
  {
    href: '/negocios/independiente',
    name: { es: 'Profesional independiente', en: 'Solo practitioner' },
    desc: {
      es: 'Atiende y agenda mientras estás con un paciente.',
      en: 'Answers and books while you are with a patient.',
    },
    icon: 'person',
  },
];

// "Casos" salió del top menu a pedido de Franco (ago 2026); /caso sigue viva y
// linkeada desde las tarjetas de caso de los mega menús y las campañas.
const topLinksRaw: RawLink[] = [
  {
    href: '/implementacion',
    name: { es: 'Cómo funciona', en: 'How it works' },
    desc: { es: 'Conectas tu calendario y listo.', en: 'Connect your calendar and you are set.' },
  },
  {
    // Slug localizado: /es/integraciones ↔ /en/integrations.
    href: '/integraciones',
    name: { es: 'Integraciones', en: 'Integrations' },
    desc: { es: 'Con lo que tu clínica ya usa.', en: 'With the tools your clinic already uses.' },
  },
];
// "Precios" salió del top menu a pedido de Franco (ago 2026): prefiere no
// mostrar precios en la navegación. La página /precios sigue viva por si hay
// links directos (ads, contratos); solo dejó de promocionarse.

const pickLink = (l: RawLink, lang: Locale): FeatureLink => ({
  href: l.href,
  name: l.name[lang],
  desc: l.desc[lang],
  icon: l.icon,
});

export const getProductGroups = (lang: Locale): FeatureGroup[] =>
  productGroupsRaw.map((g) => ({ label: g.label[lang], items: g.items.map((i) => pickLink(i, lang)) }));

/** Lista plana de todas las funcionalidades (los grupos de producto sin agrupar),
 * en el orden del mega menú. La usa el footer para su columna "Funcionalidades". */
export const getProductLinks = (lang: Locale): FeatureLink[] =>
  productGroupsRaw.flatMap((g) => g.items.map((i) => pickLink(i, lang)));

export const getIndustryLinks = (lang: Locale): FeatureLink[] => industryLinksRaw.map((l) => pickLink(l, lang));
export const getSizeLinks = (lang: Locale): FeatureLink[] => sizeLinksRaw.map((l) => pickLink(l, lang));
export const getTopLinks = (lang: Locale): FeatureLink[] => topLinksRaw.map((l) => pickLink(l, lang));
