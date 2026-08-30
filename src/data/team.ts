// Fuente única del elenco de Sara AI: Sara (recepción), Mia (marketing) y
// Daniel (finanzas). La usan el mega menú del Header, la página /equipo y las
// páginas internas /equipo/[member]. Bilingüe (ES principal, EN traducción, no
// calco): los textos traen las dos variantes y se eligen con getTeam/getMember.
//
// Framing del vertical: son empleados con IA que TRABAJAN SOLOS y te escriben
// ellos. Nada de "chatbots que responden" ni "preguntales lo que quieras".

import type { Locale } from '../i18n/config';

export type MemberId = 'sara' | 'mia' | 'daniel';

interface Bubble {
  who: 'in' | 'out';
  text: string;
  t?: string;
}

interface RawMember {
  id: MemberId;
  // Identidad (no cambia por idioma)
  video: string;
  poster: string;
  avatar: string;
  featureHref?: string; // página de funcionalidad relacionada (si existe)
  // Textos bilingües
  role: Record<Locale, string>;
  tag: Record<Locale, string>;
  oneliner: Record<Locale, string>;
  // Página interna (hero + meta)
  metaTitle: Record<Locale, string>;
  metaDescription: Record<Locale, string>;
  heroEyebrow: Record<Locale, string>;
  heroTitle: Record<Locale, string>; // admite <em> y &nbsp;
  heroLead: Record<Locale, string>;
  // Sección de detalle (demo de chat)
  kicker: Record<Locale, string>;
  h2: Record<Locale, string>; // admite <em> y &nbsp;
  paragraph: Record<Locale, string>;
  points: Record<Locale, string[]>;
  chatSubtitle: Record<Locale, string>;
  bubbles: Record<Locale, Bubble[]>;
  featureLinkLabel: Record<Locale, string>; // CTA hacia featureHref o /demo
}

const RAW: RawMember[] = [
  {
    id: 'sara',
    video: '/videos/equipo/sara.mp4',
    poster: '/equipo/sara.jpg',
    avatar: '/equipo/sara-avatar.jpg',
    featureHref: '/sara',
    role: { es: 'Recepción', en: 'Reception' },
    tag: { es: 'Trabajando ahora', en: 'Working now' },
    oneliner: {
      es: 'Atiende, agenda y cobra. Con el criterio de tu clínica.',
      en: 'Answers, books and collects. With your clinic’s judgment.',
    },
    metaTitle: {
      es: 'Sara · Recepción con IA que atiende, agenda y cobra',
      en: 'Sara · AI reception that answers, books and collects',
    },
    metaDescription: {
      es: 'Sara es la recepcionista con IA de tu clínica. Atiende WhatsApp e Instagram 24/7, informa con precios reales, agenda y cobra el anticipo. Sin sumar a nadie a recepción.',
      en: 'Sara is your clinic’s AI receptionist. She answers WhatsApp and Instagram 24/7, quotes real prices, books and takes the deposit. Without adding anyone to your front desk.',
    },
    heroEyebrow: { es: 'Sara · Recepción', en: 'Sara · Reception' },
    heroTitle: {
      es: "Atiende, agenda y cobra. <em class='text-pine-dark'>Sola.</em>",
      en: "Answers, books and collects. <em class='text-pine-dark'>On her own.</em>",
    },
    heroLead: {
      es: 'Sara es la recepcionista con IA de tu clínica. Responde al instante, arma la propuesta que conviene, agenda la cita y cobra el anticipo. De noche, los fines de semana y en los picos.',
      en: 'Sara is your clinic’s AI receptionist. She replies instantly, builds the offer that fits, books the appointment and takes the deposit. At night, on weekends and at peak times.',
    },
    kicker: { es: 'Cómo trabaja Sara', en: 'How Sara works' },
    h2: {
      es: 'No es un bot con botones. <em class="text-pine-dark">Atiende como tu mejor recepcionista.</em>',
      en: 'Not a bot with buttons. <em class="text-pine-dark">She answers like your best receptionist.</em>',
    },
    paragraph: {
      es: 'Responde WhatsApp, Instagram y el chat de tu web a toda hora. Informa con precios reales, arma la propuesta que conviene, agenda la cita y cobra el anticipo en la misma conversación. Sin sumar a nadie a recepción.',
      en: 'She replies on WhatsApp, Instagram and your website chat around the clock. She quotes real prices, builds the offer that fits, books the appointment and takes the deposit in the same conversation. Without adding anyone to your front desk.',
    },
    points: {
      es: [
        'Atiende y vende con el criterio que defines',
        'Agenda, recuerda y confirma sin dobles reservas',
        'Cobra el anticipo antes de dar la cita',
      ],
      en: [
        'Answers and sells with the judgment you set',
        'Books, reminds and confirms with no double bookings',
        'Takes the deposit before giving the slot',
      ],
    },
    chatSubtitle: { es: 'en línea · responde al instante', en: 'online · replies instantly' },
    bubbles: {
      es: [
        { who: 'out', text: '¡Hola! Piernas enteras las tenemos en el pack de 6 sesiones a $6,900, con la primera de prueba sin costo. ¿Te agendo esa primera sesión?', t: '23:41' },
        { who: 'in', text: 'Sí, ¿tienen esta semana?', t: '23:42' },
        { who: 'out', text: '¡Sí! Jueves 17:30 o viernes 18:00. Para dejar la reserva confirmada va un anticipo. ¿Cuál te queda mejor?', t: '23:42' },
        { who: 'in', text: 'Jueves', t: '23:43' },
        { who: 'out', text: '¡Listo! Jueves 17:30 reservado ✅ Te paso el link del anticipo y te llega el recordatorio un día antes.', t: '23:43' },
      ],
      en: [
        { who: 'out', text: 'Hi! Full legs come in our 6-session pack at $6,900, with a free first trial session. Want me to book that first one?', t: '11:41' },
        { who: 'in', text: 'Yes, anything this week?', t: '11:42' },
        { who: 'out', text: 'Yes! Thursday 5:30pm or Friday 6:00pm. A deposit locks in the booking. Which works better?', t: '11:42' },
        { who: 'in', text: 'Thursday', t: '11:43' },
        { who: 'out', text: 'Done! Thursday 5:30pm booked ✅ I’ll send the deposit link and a reminder a day before.', t: '11:43' },
      ],
    },
    featureLinkLabel: { es: 'Ver todo lo que hace Sara', en: 'See everything Sara does' },
  },

  {
    id: 'mia',
    video: '/videos/equipo/mia.mp4',
    poster: '/equipo/mia.jpg',
    avatar: '/equipo/mia-avatar.jpg',
    featureHref: '/instagram',
    role: { es: 'Marketing', en: 'Marketing' },
    tag: { es: 'Trabajando ahora', en: 'Working now' },
    oneliner: {
      es: 'Tu marketing completo: web, Google e Instagram. Y te escribe con la jugada.',
      en: 'Your whole marketing: web, Google and Instagram. And she messages you the play.',
    },
    metaTitle: {
      es: 'Mia · Marketing con IA: web, Google Business, campañas e Instagram',
      en: 'Mia · AI marketing: website, Google Business, campaigns and Instagram',
    },
    metaDescription: {
      es: 'Mia es la jefa de marketing con IA de tu clínica. Está encima de tu web, tu ficha de Google, tus campañas de Search y tu Instagram. Cuando ve una oportunidad, te escribe la jugada y la ejecuta cuando la apruebas.',
      en: 'Mia is your clinic’s AI head of marketing. She’s on top of your website, your Google Business profile, your Search campaigns and your Instagram. When she spots an opening, she messages you the play and runs it once you approve.',
    },
    heroEyebrow: { es: 'Mia · Marketing', en: 'Mia · Marketing' },
    heroTitle: {
      es: "Maneja todo tu marketing. <em class='text-pine-dark'>Y te escribe con la jugada.</em>",
      en: "Runs all your marketing. <em class='text-pine-dark'>And messages you the play.</em>",
    },
    heroLead: {
      es: 'Mia es la jefa de marketing con IA de tu clínica. Está encima de tu web, tu ficha de Google, tus campañas de Search y tu Instagram. Y como es proactiva, cuando ve una oportunidad te escribe la jugada lista para aprobar.',
      en: 'Mia is your clinic’s AI head of marketing. She’s on top of your website, your Google Business profile, your Search campaigns and your Instagram. And since she’s proactive, when she spots an opening she messages you the play, ready to approve.',
    },
    kicker: { es: 'Cómo trabaja Mia', en: 'How Mia works' },
    h2: {
      es: 'No espera el brief. <em class="text-pine-dark">Ve la oportunidad y te escribe.</em>',
      en: 'She doesn’t wait for a brief. <em class="text-pine-dark">She spots the opening and writes you.</em>',
    },
    paragraph: {
      es: 'Mia lleva tu marketing de punta a punta: mira las métricas de tu web, cuida tu ficha de Google, maneja tus campañas de Search y lleva la estrategia de tu Instagram. Y como es proactiva, no espera a que le pidas: cuando ve una oportunidad (una ficha que bajó, una campaña que rinde, un hueco en la agenda) te escribe la jugada lista. La apruebas por chat y ella la ejecuta.',
      en: 'Mia runs your marketing end to end: she watches your website metrics, looks after your Google Business profile, manages your Search campaigns and owns your Instagram strategy. And since she’s proactive, she doesn’t wait to be asked: when she spots an opening (a profile that slipped, a campaign that’s working, a gap in the calendar) she messages you the play, ready to go. You approve over chat and she runs it.',
    },
    points: {
      es: [
        'Vigila tu web, tu ficha de Google y tu Instagram',
        'Maneja tus campañas de Google y tu estrategia de contenido',
        'Te escribe la jugada y la ejecuta cuando la apruebas',
      ],
      en: [
        'Watches your website, your Google profile and your Instagram',
        'Runs your Google campaigns and your content strategy',
        'Messages you the play and runs it once you approve',
      ],
    },
    chatSubtitle: { es: 'te escribe cuando ve una oportunidad', en: 'writes you when she spots an opening' },
    bubbles: {
      es: [
        { who: 'out', text: 'Resumen de la semana 👋 Tu web: +18% de visitas desde Google. Tu ficha de Google apareció en 2,400 búsquedas y entraron 9 llamadas. Instagram: +320 seguidores.', t: '09:12' },
        { who: 'out', text: 'Dos jugadas para esta semana: subo 6 fotos nuevas a tu ficha de Google (hace 40 días que no se toca y bajó en el mapa) y lanzo una campaña de Search para "botox + tu zona" con $150 de prueba. ¿Le damos?', t: '09:12' },
        { who: 'in', text: 'Dale con las fotos. La campaña arranca con $100', t: '09:20' },
        { who: 'out', text: '¡Listo! Fotos arriba y campaña activa con $100 semanales. El jueves te paso los primeros resultados y quién llamó. 📈', t: '09:21' },
      ],
      en: [
        { who: 'out', text: 'Week recap 👋 Your website: +18% visits from Google. Your Google profile showed in 2,400 searches and drove 9 calls. Instagram: +320 followers.', t: '09:12' },
        { who: 'out', text: 'Two plays for this week: I add 6 fresh photos to your Google profile (untouched for 40 days, it slipped on the map) and launch a Search campaign for "botox + your area" with a $150 test. Shall we?', t: '09:12' },
        { who: 'in', text: 'Do the photos. Start the campaign at $100', t: '09:20' },
        { who: 'out', text: 'Done! Photos up and campaign live at $100 a week. Thursday I’ll send the first results and who called. 📈', t: '09:21' },
      ],
    },
    featureLinkLabel: { es: 'Ver Instagram con Mia', en: 'See Instagram with Mia' },
  },

  {
    id: 'daniel',
    video: '/videos/equipo/daniel.mp4',
    poster: '/equipo/daniel.jpg',
    avatar: '/equipo/daniel-avatar.jpg',
    role: { es: 'Finanzas', en: 'Finance' },
    tag: { es: 'Trabajando ahora', en: 'Working now' },
    oneliner: {
      es: 'Lleva las cuentas de tu clínica y te avisa lo que importa.',
      en: 'Keeps your clinic’s books and flags what matters.',
    },
    metaTitle: {
      es: 'Daniel · Finanzas con IA que lleva las cuentas de tu clínica',
      en: 'Daniel · AI finance that keeps your clinic’s books',
    },
    metaDescription: {
      es: 'Daniel es el analista de finanzas con IA de tu clínica. Lleva las cuentas y te avisa lo que importa: cuánto facturaste, qué te falta cobrar y qué tratamiento deja más margen.',
      en: 'Daniel is your clinic’s AI finance analyst. He keeps the books and flags what matters: how much you billed, what’s still to collect and which treatment leaves the most margin.',
    },
    heroEyebrow: { es: 'Daniel · Finanzas', en: 'Daniel · Finance' },
    heroTitle: {
      es: "Te dice cómo va la plata. <em class='text-pine-dark'>Antes de que preguntes.</em>",
      en: "Tells you how the money’s doing. <em class='text-pine-dark'>Before you ask.</em>",
    },
    heroLead: {
      es: 'Daniel es el analista de finanzas con IA de tu clínica. Lleva las cuentas y te avisa lo que importa: cuánto facturaste, qué te falta cobrar y qué tratamiento deja más margen. Sin abrir una sola planilla.',
      en: 'Daniel is your clinic’s AI finance analyst. He keeps the books and flags what matters: how much you billed, what’s still to collect and which treatment leaves the most margin. Without opening a single spreadsheet.',
    },
    kicker: { es: 'Cómo trabaja Daniel', en: 'How Daniel works' },
    h2: {
      es: 'Daniel te dice cómo va la plata. <em class="text-pine-dark">Antes de que preguntes.</em>',
      en: 'Daniel tells you how the money’s doing. <em class="text-pine-dark">Before you ask.</em>',
    },
    paragraph: {
      es: 'Daniel lleva las cuentas de tu clínica y te avisa lo que importa: cuánto facturaste, qué te falta cobrar y qué tratamiento deja más margen. Cuando hay algo para hacer, te lo propone y el equipo lo ejecuta. Sin abrir una sola planilla.',
      en: 'Daniel keeps your clinic’s books and flags what matters: how much you billed, what’s still to collect, and which treatment leaves the most margin. When there’s something to do, he pitches it and the team runs it. Without opening a single spreadsheet.',
    },
    points: {
      es: [
        'Te resume la facturación sin que abras una planilla',
        'Detecta anticipos y pagos pendientes por cobrar',
        'Te dice qué tratamiento deja más margen',
      ],
      en: [
        'Sums up your billing without you opening a spreadsheet',
        'Catches deposits and payments still to be collected',
        'Tells you which treatment leaves the most margin',
      ],
    },
    chatSubtitle: { es: 'te avisa cómo van los números', en: 'flags how the numbers are doing' },
    bubbles: {
      es: [
        { who: 'out', text: 'Cerré los números de octubre 👋 Facturaste $312,000, un 12% arriba que septiembre. Te dejo lo importante.', t: '08:30' },
        { who: 'out', text: 'Tienes $18,400 en anticipos sin cobrar de 7 citas de esta semana. Y el láser sigue siendo lo más rentable: 68% de margen. ¿Te armo el recordatorio de cobro?', t: '08:30' },
        { who: 'in', text: 'Sí, dale', t: '08:41' },
        { who: 'out', text: '¡Listo! Se los pasé a Sara para que los cobre por WhatsApp. Te aviso cuando entren. 📊', t: '08:41' },
      ],
      en: [
        { who: 'out', text: 'Closed October’s numbers 👋 You billed $312,000, up 12% from September. Here’s what matters.', t: '08:30' },
        { who: 'out', text: 'You’ve got $18,400 in uncollected deposits across 7 appointments this week. And laser is still the most profitable: 68% margin. Want me to set up the payment reminders?', t: '08:30' },
        { who: 'in', text: 'Yes, go ahead', t: '08:41' },
        { who: 'out', text: 'Done! Handed them to Sara to collect over WhatsApp. I’ll let you know as they come in. 📊', t: '08:41' },
      ],
    },
    featureLinkLabel: { es: 'Pedir una demo', en: 'Book a demo' },
  },
];

export interface TeamMember {
  id: MemberId;
  name: string;
  video: string;
  poster: string;
  avatar: string;
  featureHref?: string;
  role: string;
  tag: string;
  oneliner: string;
  metaTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  kicker: string;
  h2: string;
  paragraph: string;
  points: string[];
  chatSubtitle: string;
  bubbles: Bubble[];
  featureLinkLabel: string;
  /** Path interno de la ficha del personaje: /equipo/sara, /equipo/mia, … */
  href: string;
}

const pick = (m: RawMember, lang: Locale): TeamMember => ({
  id: m.id,
  name: m.id.charAt(0).toUpperCase() + m.id.slice(1),
  video: m.video,
  poster: m.poster,
  avatar: m.avatar,
  featureHref: m.featureHref,
  role: m.role[lang],
  tag: m.tag[lang],
  oneliner: m.oneliner[lang],
  metaTitle: m.metaTitle[lang],
  metaDescription: m.metaDescription[lang],
  heroEyebrow: m.heroEyebrow[lang],
  heroTitle: m.heroTitle[lang],
  heroLead: m.heroLead[lang],
  kicker: m.kicker[lang],
  h2: m.h2[lang],
  paragraph: m.paragraph[lang],
  points: m.points[lang],
  chatSubtitle: m.chatSubtitle[lang],
  bubbles: m.bubbles[lang],
  featureLinkLabel: m.featureLinkLabel[lang],
  href: `/equipo/${m.id}`,
});

/** Los tres integrantes, en orden, localizados. */
export const getTeam = (lang: Locale): TeamMember[] => RAW.map((m) => pick(m, lang));

/** Un integrante por id (o undefined si no existe). */
export const getMember = (id: string, lang: Locale): TeamMember | undefined => {
  const m = RAW.find((r) => r.id === id);
  return m ? pick(m, lang) : undefined;
};

/** Ids para getStaticPaths de las páginas internas. */
export const memberIds: MemberId[] = RAW.map((m) => m.id);
