// Páginas "Sara vs X" (/es/sara-vs-<slug>). Datos de los sitios públicos de
// cada competidor (agosto 2026). Reglas: nada inventado, mismos hechos que la
// comparativa general (/mejores-asistentes-ia-clinicas); si un dato no es
// público se dice "no publica". El tono es honesto: cada página dice también
// cuándo conviene elegir al otro.
import { PRICE_MX, PRICE_UNIT } from '../lib/pricing';

export type VsCell = 'yes' | 'no' | 'partial' | 'text';

export interface VsRow {
  label: string;
  sara: { v: VsCell; note?: string };
  them: { v: VsCell; note?: string };
}

export interface CompetitorCopy {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string; // puede llevar <em> y &nbsp;
  lead: string;
  verdictThem: { title: string; body: string };
  verdictSara: { title: string; body: string };
  rows: VsRow[];
  faq: { q: string; a: string }[];
  compareAllCta: string;
}

export interface Competitor {
  slug: string; // /es/sara-vs-<slug>
  name: string;
  home: string;
  copy: { es: CompetitorCopy; en: CompetitorCopy };
}

const saraPrice = `desde ${PRICE_MX.display} ${PRICE_UNIT} (México)`;
const saraPriceEn = `from ${PRICE_MX.display} per location / month (Mexico)`;

export const competitors: Competitor[] = [
  {
    slug: 'cloudia',
    name: 'Cloudia',
    home: 'cloudia.com.br',
    copy: {
      es: {
        metaTitle: 'Sara AI vs Cloudia: ¿cuál conviene para tu clínica? (2026)',
        metaDescription: 'Comparamos Sara AI y Cloudia para clínicas: IA conversacional real vs flujos con IA como módulo aparte, cobro de la seña en el chat, agenda y precios públicos a agosto 2026.',
        eyebrow: 'Sara AI vs Cloudia',
        title: 'Sara AI vs Cloudia, sin&nbsp;vueltas.',
        lead: 'Cloudia es la secretaria virtual más instalada de Brasil, con 1.500+ clínicas. Sara es el asistente con IA conversacional para clínicas de habla hispana. Acá va la comparación honesta, con datos públicos de agosto 2026.',
        verdictThem: {
          title: 'Elige Cloudia si...',
          body: 'tu clínica está en Brasil o Portugal y ya usas uno de los 40+ software de gestión que integra. Es la opción más barata del mercado y tiene años de recorrido con casos grandes como OdontoCompany.',
        },
        verdictSara: {
          title: 'Elige Sara AI si...',
          body: 'atiendes en español y quieres IA conversacional de verdad en WhatsApp e Instagram desde el primer día, con la cita agendada en tu Google Calendar y la seña cobrada dentro del chat. En Cloudia la conversación con IA generativa es un módulo adicional que se paga aparte; en Sara es el corazón del producto.',
        },
        rows: [
          { label: 'IA conversacional real', sara: { v: 'yes' }, them: { v: 'partial', note: 'módulo de IA generativa pago aparte; la base son flujos' } },
          { label: 'Instagram DM', sara: { v: 'yes' }, them: { v: 'yes' } },
          { label: 'Cobra la seña dentro del chat', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Usa tu Google Calendar sin migrar', sara: { v: 'yes' }, them: { v: 'partial', note: 'integra 40+ software de gestión' } },
          { label: 'Reactivación y lista de espera', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Crea el contenido de Instagram', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Idioma principal', sara: { v: 'text', note: 'español (LATAM)' }, them: { v: 'text', note: 'portugués (BR y PT)' } },
          { label: 'Precio público', sara: { v: 'text', note: saraPrice }, them: { v: 'text', note: '~R$49-80/mes + módulo de IA' } },
        ],
        faq: [
          { q: '¿Cloudia tiene IA como la de Sara?', a: 'Cloudia nació como chatbot de flujos y ofrece la conversación con IA generativa como módulo adicional pago. En Sara la IA conversacional es el producto: entiende lenguaje natural, responde precios y agenda sin árboles de botones.' },
          { q: '¿Cuál cobra la seña?', a: 'Sara cobra la seña con un link de pago dentro del mismo chat, antes de confirmar la cita. Cloudia no cobra dentro de la conversación.' },
          { q: '¿Cuál conviene en Brasil?', a: 'Si tu clínica está en Brasil y ya usas un software de gestión que Cloudia integra, Cloudia es una gran opción local. Sara está enfocada en clínicas de habla hispana.' },
        ],
        compareAllCta: 'Ver la comparativa completa de asistentes con IA',
      },
      en: {
        metaTitle: 'Sara AI vs Cloudia: which one fits your clinic? (2026)',
        metaDescription: 'We compare Sara AI and Cloudia for clinics: real conversational AI vs flows with AI as a paid add-on, in-chat deposit collection, scheduling and public pricing as of August 2026.',
        eyebrow: 'Sara AI vs Cloudia',
        title: 'Sara AI vs Cloudia, straight&nbsp;up.',
        lead: 'Cloudia is Brazil’s most installed virtual receptionist, with 1,500+ clinics. Sara is the conversational AI assistant for Spanish-speaking clinics. Here’s the honest comparison, with public data from August 2026.',
        verdictThem: {
          title: 'Pick Cloudia if...',
          body: 'your clinic is in Brazil or Portugal and you already use one of the 40+ management systems it integrates. It’s the cheapest option on the market, with years of track record and large cases like OdontoCompany.',
        },
        verdictSara: {
          title: 'Pick Sara AI if...',
          body: 'you serve patients in Spanish and want real conversational AI on WhatsApp and Instagram from day one, with the appointment booked into your Google Calendar and the deposit collected inside the chat. In Cloudia, generative AI conversation is a paid add-on; in Sara it’s the heart of the product.',
        },
        rows: [
          { label: 'Real conversational AI', sara: { v: 'yes' }, them: { v: 'partial', note: 'paid generative AI add-on; the core is flow-based' } },
          { label: 'Instagram DM', sara: { v: 'yes' }, them: { v: 'yes' } },
          { label: 'Collects the deposit in the chat', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Uses your Google Calendar, no migration', sara: { v: 'yes' }, them: { v: 'partial', note: 'integrates 40+ management systems' } },
          { label: 'Reactivation and waitlist', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Creates your Instagram content', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Main language', sara: { v: 'text', note: 'Spanish (LATAM)' }, them: { v: 'text', note: 'Portuguese (BR and PT)' } },
          { label: 'Public pricing', sara: { v: 'text', note: saraPriceEn }, them: { v: 'text', note: '~R$49-80/mo + AI module' } },
        ],
        faq: [
          { q: 'Does Cloudia have AI like Sara’s?', a: 'Cloudia started as a flow-based chatbot and offers generative AI conversation as a paid add-on. In Sara, conversational AI is the product: it understands natural language, quotes prices and books without button trees.' },
          { q: 'Which one collects the deposit?', a: 'Sara collects the deposit with a payment link inside the same chat, before confirming the appointment. Cloudia does not charge inside the conversation.' },
          { q: 'Which one is better in Brazil?', a: 'If your clinic is in Brazil and already uses a management system Cloudia integrates, Cloudia is a great local option. Sara focuses on Spanish-speaking clinics.' },
        ],
        compareAllCta: 'See the full AI assistant comparison',
      },
    },
  },
  {
    slug: 'doctocliq',
    name: 'Soyla (Doctocliq)',
    home: 'doctocliq.com',
    copy: {
      es: {
        metaTitle: 'Sara AI vs Soyla de Doctocliq: ¿cuál conviene para tu clínica? (2026)',
        metaDescription: 'Comparamos Sara AI y Soyla (Doctocliq) para clínicas: las dos tienen IA real por WhatsApp, pero difieren en Instagram, en el cobro de la seña y en si te obligan a migrar la agenda.',
        eyebrow: 'Sara AI vs Soyla (Doctocliq)',
        title: 'Sara AI vs Soyla, sin&nbsp;vueltas.',
        lead: 'Soyla es el asistente con IA de Doctocliq, la suite clínica peruana. Las dos tienen IA conversacional real por WhatsApp; la diferencia está en todo lo demás. Datos públicos de agosto 2026.',
        verdictThem: {
          title: 'Elige Doctocliq (con Soyla) si...',
          body: 'necesitas la suite clínica completa: historia clínica con odontograma, presupuestos dentales y facturación electrónica en Perú, México, Colombia o Ecuador. Soyla es de las mejores IA del mercado, pero funciona solo si migras tu operación a Doctocliq.',
        },
        verdictSara: {
          title: 'Elige Sara AI si...',
          body: 'quieres la IA sin cambiar de sistema: Sara agenda en el Google Calendar que ya usas, atiende también Instagram (Soyla es solo WhatsApp) y cobra la seña dentro del chat. Además reactiva pacientes, llena huecos con lista de espera y crea tu contenido de Instagram.',
        },
        rows: [
          { label: 'IA conversacional real', sara: { v: 'yes' }, them: { v: 'yes' } },
          { label: 'Instagram DM', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Cobra la seña dentro del chat', sara: { v: 'yes' }, them: { v: 'partial', note: 'pagos en la suite, no en el chat' } },
          { label: 'Usa tu Google Calendar sin migrar', sara: { v: 'yes' }, them: { v: 'no', note: 'requiere la agenda de Doctocliq' } },
          { label: 'Historia clínica y odontograma', sara: { v: 'no', note: 'a propósito: no toca datos clínicos' }, them: { v: 'yes' } },
          { label: 'Facturación electrónica', sara: { v: 'no' }, them: { v: 'yes', note: 'PE, MX, CO, EC' } },
          { label: 'Crea el contenido de Instagram', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Precio público', sara: { v: 'text', note: saraPrice }, them: { v: 'text', note: 'suite desde US$19; Soyla aparte' } },
        ],
        faq: [
          { q: '¿Puedo usar Soyla sin Doctocliq?', a: 'No: Soyla consulta la disponibilidad en la agenda de Doctocliq, así que implica adoptar su suite. Sara trabaja sobre el Google Calendar que tu clínica ya usa.' },
          { q: '¿Cuál atiende Instagram?', a: 'Sara atiende WhatsApp e Instagram con la misma IA. Soyla es solo WhatsApp.' },
          { q: '¿Y si necesito historia clínica?', a: 'Ahí Doctocliq es más completo: historia clínica, odontograma y facturación electrónica. Sara no toca datos clínicos a propósito, y convive con el software clínico que ya tengas.' },
        ],
        compareAllCta: 'Ver la comparativa completa de asistentes con IA',
      },
      en: {
        metaTitle: 'Sara AI vs Soyla by Doctocliq: which one fits your clinic? (2026)',
        metaDescription: 'We compare Sara AI and Soyla (Doctocliq) for clinics: both have real WhatsApp AI, but they differ on Instagram, deposit collection and whether you must migrate your calendar.',
        eyebrow: 'Sara AI vs Soyla (Doctocliq)',
        title: 'Sara AI vs Soyla, straight&nbsp;up.',
        lead: 'Soyla is the AI assistant of Doctocliq, the Peruvian clinical suite. Both have real conversational AI on WhatsApp; the difference is everything else. Public data from August 2026.',
        verdictThem: {
          title: 'Pick Doctocliq (with Soyla) if...',
          body: 'you need the full clinical suite: patient records with dental charting, treatment estimates and e-invoicing in Peru, Mexico, Colombia or Ecuador. Soyla is among the best AIs on the market, but it only works if you move your operation onto Doctocliq.',
        },
        verdictSara: {
          title: 'Pick Sara AI if...',
          body: 'you want the AI without changing systems: Sara books into the Google Calendar you already use, also covers Instagram (Soyla is WhatsApp only) and collects the deposit inside the chat. It also reactivates patients, fills freed slots from a waitlist and creates your Instagram content.',
        },
        rows: [
          { label: 'Real conversational AI', sara: { v: 'yes' }, them: { v: 'yes' } },
          { label: 'Instagram DM', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Collects the deposit in the chat', sara: { v: 'yes' }, them: { v: 'partial', note: 'payments in the suite, not in the chat' } },
          { label: 'Uses your Google Calendar, no migration', sara: { v: 'yes' }, them: { v: 'no', note: 'requires the Doctocliq calendar' } },
          { label: 'Patient records and dental charting', sara: { v: 'no', note: 'on purpose: no clinical data' }, them: { v: 'yes' } },
          { label: 'E-invoicing', sara: { v: 'no' }, them: { v: 'yes', note: 'PE, MX, CO, EC' } },
          { label: 'Creates your Instagram content', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Public pricing', sara: { v: 'text', note: saraPriceEn }, them: { v: 'text', note: 'suite from US$19; Soyla apart' } },
        ],
        faq: [
          { q: 'Can I use Soyla without Doctocliq?', a: 'No: Soyla checks availability against the Doctocliq calendar, so it means adopting their suite. Sara works on top of the Google Calendar your clinic already uses.' },
          { q: 'Which one covers Instagram?', a: 'Sara answers WhatsApp and Instagram with the same AI. Soyla is WhatsApp only.' },
          { q: 'What if I need patient records?', a: 'That’s where Doctocliq is more complete: records, dental charting and e-invoicing. Sara never touches clinical data on purpose, and coexists with whatever clinical software you already have.' },
        ],
        compareAllCta: 'See the full AI assistant comparison',
      },
    },
  },
  {
    slug: 'kura',
    name: 'Kura',
    home: 'getkura.ai',
    copy: {
      es: {
        metaTitle: 'Sara AI vs Kura: ¿cuál conviene para tu clínica? (2026)',
        metaDescription: 'Comparamos Sara AI y Kura para clínicas: las dos tienen IA real por WhatsApp, pero difieren en Instagram, cobro de la seña, agenda y mercado (LATAM vs España). Datos de agosto 2026.',
        eyebrow: 'Sara AI vs Kura',
        title: 'Sara AI vs Kura, sin&nbsp;vueltas.',
        lead: 'Kura es un agente IA español para clínicas, fuerte en calificación de leads de anuncios y recuperación de presupuestos. Sara es el asistente para clínicas de LATAM que además cobra y hace el marketing. Datos públicos de agosto 2026.',
        verdictThem: {
          title: 'Elige Kura si...',
          body: 'tu clínica está en España, te importa el compliance europeo (RGPD, datos en la UE) y tu canal es solo WhatsApp. Hace muy bien la calificación de leads de Meta y Google Ads y el follow-up de presupuestos, con encuestas NPS incluidas.',
        },
        verdictSara: {
          title: 'Elige Sara AI si...',
          body: 'tu clínica está en Latinoamérica y quieres que la conversación termine en cita cobrada: Sara atiende WhatsApp e Instagram, agenda en tu Google Calendar sin migrar, cobra la seña en el chat, reactiva pacientes y crea tu contenido de Instagram. Y escribe como se habla en tu país.',
        },
        rows: [
          { label: 'IA conversacional real', sara: { v: 'yes' }, them: { v: 'yes' } },
          { label: 'Instagram DM', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Cobra la seña dentro del chat', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Usa tu Google Calendar sin migrar', sara: { v: 'yes' }, them: { v: 'no', note: 'agenda propia; HIS solo en Enterprise' } },
          { label: 'Reactivación de pacientes', sara: { v: 'yes' }, them: { v: 'yes' } },
          { label: 'Pide reseñas de Google', sara: { v: 'yes' }, them: { v: 'yes' } },
          { label: 'Encuestas NPS', sara: { v: 'no' }, them: { v: 'yes' } },
          { label: 'Mercado principal', sara: { v: 'text', note: 'Latinoamérica' }, them: { v: 'text', note: 'España' } },
          { label: 'Precio público', sara: { v: 'text', note: saraPrice }, them: { v: 'text', note: '59,99 € por profesional / mes' } },
        ],
        faq: [
          { q: '¿Cuál cobra la seña?', a: 'Sara cobra la seña con un link de pago dentro del chat antes de confirmar la cita. Kura no cobra dentro de la conversación.' },
          { q: '¿Kura funciona con mi Google Calendar?', a: 'Kura usa su propio calendario de equipo; la integración con sistemas existentes es de su plan Enterprise. Sara agenda directo en el Google Calendar que ya usas.' },
          { q: '¿Cuál conviene en España?', a: 'Si tu clínica está en España y el compliance europeo es prioritario, Kura es una opción sólida. Sara está enfocada en clínicas de Latinoamérica y adapta el registro a cada país.' },
        ],
        compareAllCta: 'Ver la comparativa completa de asistentes con IA',
      },
      en: {
        metaTitle: 'Sara AI vs Kura: which one fits your clinic? (2026)',
        metaDescription: 'We compare Sara AI and Kura for clinics: both have real WhatsApp AI, but they differ on Instagram, deposit collection, scheduling and market (LATAM vs Spain). Data from August 2026.',
        eyebrow: 'Sara AI vs Kura',
        title: 'Sara AI vs Kura, straight&nbsp;up.',
        lead: 'Kura is a Spanish AI agent for clinics, strong at qualifying ad leads and recovering estimates. Sara is the assistant for LATAM clinics that also collects payments and does the marketing. Public data from August 2026.',
        verdictThem: {
          title: 'Pick Kura if...',
          body: 'your clinic is in Spain, EU compliance matters to you (GDPR, data in the EU) and WhatsApp is your only channel. It does Meta and Google Ads lead qualification and estimate follow-up very well, with NPS surveys included.',
        },
        verdictSara: {
          title: 'Pick Sara AI if...',
          body: 'your clinic is in Latin America and you want the conversation to end as a paid appointment: Sara covers WhatsApp and Instagram, books into your Google Calendar with no migration, collects the deposit in the chat, reactivates patients and creates your Instagram content. And it writes the way your country speaks.',
        },
        rows: [
          { label: 'Real conversational AI', sara: { v: 'yes' }, them: { v: 'yes' } },
          { label: 'Instagram DM', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Collects the deposit in the chat', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Uses your Google Calendar, no migration', sara: { v: 'yes' }, them: { v: 'no', note: 'own calendar; HIS only on Enterprise' } },
          { label: 'Patient reactivation', sara: { v: 'yes' }, them: { v: 'yes' } },
          { label: 'Asks for Google reviews', sara: { v: 'yes' }, them: { v: 'yes' } },
          { label: 'NPS surveys', sara: { v: 'no' }, them: { v: 'yes' } },
          { label: 'Main market', sara: { v: 'text', note: 'Latin America' }, them: { v: 'text', note: 'Spain' } },
          { label: 'Public pricing', sara: { v: 'text', note: saraPriceEn }, them: { v: 'text', note: '€59.99 per professional / month' } },
        ],
        faq: [
          { q: 'Which one collects the deposit?', a: 'Sara collects the deposit with a payment link inside the chat before confirming the appointment. Kura does not charge inside the conversation.' },
          { q: 'Does Kura work with my Google Calendar?', a: 'Kura uses its own team calendar; integrating with existing systems is an Enterprise feature. Sara books directly into the Google Calendar you already use.' },
          { q: 'Which one is better in Spain?', a: 'If your clinic is in Spain and EU compliance is a priority, Kura is a solid option. Sara focuses on Latin American clinics and adapts its register to each country.' },
        ],
        compareAllCta: 'See the full AI assistant comparison',
      },
    },
  },
  {
    slug: 'agendapro',
    name: 'AgendaPro',
    home: 'agendapro.com',
    copy: {
      es: {
        metaTitle: 'Sara AI vs AgendaPro: ¿cuál necesita tu clínica? (2026)',
        metaDescription: 'AgendaPro es un software de agenda; Sara es un asistente con IA que conversa, agenda y cobra. Comparamos qué hace cada uno y cuándo conviene cada opción, con datos de agosto 2026.',
        eyebrow: 'Sara AI vs AgendaPro',
        title: 'Sara AI vs AgendaPro: no compiten por lo&nbsp;mismo.',
        lead: 'AgendaPro es uno de los software de agenda más usados de LATAM, con más de 20.000 negocios. Sara no es un software de agenda: es la que atiende la conversación y la convierte en cita cobrada. La comparación honesta, con datos de agosto 2026.',
        verdictThem: {
          title: 'Elige AgendaPro si...',
          body: 'lo que buscas es el software: reservas online, ficha, POS, inventario y reportes para tu operación. Es una suite madura y probada en toda la región. Su chatbot responde preguntas frecuentes, pero no conversa ni vende por ti.',
        },
        verdictSara: {
          title: 'Elige Sara AI si...',
          body: 'tu problema no es la agenda sino quién contesta: el WhatsApp y el Instagram que suenan a las 23:00 con alguien que quiere precio y horario. Sara conversa con IA real, agenda en tu Google Calendar y cobra la seña. Y si ya usas una agenda que te gusta, no te pide cambiarla.',
        },
        rows: [
          { label: 'IA conversacional real', sara: { v: 'yes' }, them: { v: 'partial', note: 'chatbot de preguntas frecuentes' } },
          { label: 'Instagram DM', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Cobra la seña dentro del chat', sara: { v: 'yes' }, them: { v: 'partial', note: 'pago online al reservar en su sistema' } },
          { label: 'Usa tu Google Calendar sin migrar', sara: { v: 'yes' }, them: { v: 'no', note: 'hay que migrar a su agenda' } },
          { label: 'Ficha clínica, POS e inventario', sara: { v: 'no', note: 'a propósito: no reemplaza tu software' }, them: { v: 'yes' } },
          { label: 'Gift cards', sara: { v: 'yes' }, them: { v: 'yes' } },
          { label: 'Crea el contenido de Instagram', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Precio público', sara: { v: 'text', note: saraPrice }, them: { v: 'text', note: 'no publica (~US$19-59 según terceros)' } },
        ],
        faq: [
          { q: '¿Sara reemplaza a AgendaPro?', a: 'No necesariamente: resuelven cosas distintas. AgendaPro es el software de gestión; Sara es quien atiende la conversación. De hecho pueden convivir: Sara agenda en Google Calendar y tu operación sigue donde está.' },
          { q: '¿El chatbot de AgendaPro es como Sara?', a: 'No. El chatbot de AgendaPro responde preguntas frecuentes como horarios y ubicación. Sara mantiene una conversación real: entiende lo que pide el paciente, cotiza, propone horarios, agenda y cobra la seña.' },
          { q: '¿Cuál conviene para empezar?', a: 'Si no tienes ningún sistema y quieres digitalizar toda la operación, AgendaPro es un buen punto de partida. Si lo que pierdes son las consultas que nadie contesta, Sara ataca ese problema desde el primer día.' },
        ],
        compareAllCta: 'Ver la comparativa completa de asistentes con IA',
      },
      en: {
        metaTitle: 'Sara AI vs AgendaPro: which one does your clinic need? (2026)',
        metaDescription: 'AgendaPro is scheduling software; Sara is an AI assistant that converses, books and collects. We compare what each one does and when each option makes sense, with data from August 2026.',
        eyebrow: 'Sara AI vs AgendaPro',
        title: 'Sara AI vs AgendaPro: not competing for the same&nbsp;job.',
        lead: 'AgendaPro is one of LATAM’s most used scheduling platforms, with over 20,000 businesses. Sara is not scheduling software: it’s the one answering the conversation and turning it into a paid appointment. The honest comparison, with data from August 2026.',
        verdictThem: {
          title: 'Pick AgendaPro if...',
          body: 'what you want is the software: online booking, records, POS, inventory and reports for your operation. It’s a mature suite proven across the region. Its chatbot answers FAQs, but it doesn’t converse or sell for you.',
        },
        verdictSara: {
          title: 'Pick Sara AI if...',
          body: 'your problem isn’t the calendar but who answers: the WhatsApp and Instagram ringing at 11 pm with someone asking for prices and slots. Sara converses with real AI, books into your Google Calendar and collects the deposit. And if you already like your scheduling software, it won’t ask you to change it.',
        },
        rows: [
          { label: 'Real conversational AI', sara: { v: 'yes' }, them: { v: 'partial', note: 'FAQ chatbot' } },
          { label: 'Instagram DM', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Collects the deposit in the chat', sara: { v: 'yes' }, them: { v: 'partial', note: 'online payment when booking in their system' } },
          { label: 'Uses your Google Calendar, no migration', sara: { v: 'yes' }, them: { v: 'no', note: 'you migrate to their calendar' } },
          { label: 'Records, POS and inventory', sara: { v: 'no', note: 'on purpose: it doesn’t replace your software' }, them: { v: 'yes' } },
          { label: 'Gift cards', sara: { v: 'yes' }, them: { v: 'yes' } },
          { label: 'Creates your Instagram content', sara: { v: 'yes' }, them: { v: 'no' } },
          { label: 'Public pricing', sara: { v: 'text', note: saraPriceEn }, them: { v: 'text', note: 'not published (~US$19-59 per third parties)' } },
        ],
        faq: [
          { q: 'Does Sara replace AgendaPro?', a: 'Not necessarily: they solve different problems. AgendaPro is the management software; Sara answers the conversation. They can coexist: Sara books into Google Calendar and your operation stays where it is.' },
          { q: 'Is AgendaPro’s chatbot like Sara?', a: 'No. AgendaPro’s chatbot answers FAQs like opening hours and location. Sara holds a real conversation: it understands what the patient wants, quotes, proposes slots, books and collects the deposit.' },
          { q: 'Which one should I start with?', a: 'If you have no system and want to digitize the whole operation, AgendaPro is a good starting point. If what you’re losing are the enquiries nobody answers, Sara attacks that problem from day one.' },
        ],
        compareAllCta: 'See the full AI assistant comparison',
      },
    },
  },
  {
    slug: 'glossgenius',
    name: 'GlossGenius (Reception)',
    home: 'glossgenius.com',
    copy: {
      es: {
        metaTitle: 'Sara AI vs GlossGenius: ¿cuál conviene para tu clínica? (2026)',
        metaDescription: 'Comparamos Sara AI y GlossGenius (Reception) para clínicas: WhatsApp e Instagram vs recepcionista por voz, agenda propia vs tu Google Calendar, mercado LATAM vs EE.UU. Datos de agosto 2026.',
        eyebrow: 'Sara AI vs GlossGenius',
        title: 'Sara AI vs GlossGenius, sin&nbsp;vueltas.',
        lead: 'GlossGenius es la plataforma de gestión para salones y medspas de EE.UU., y su IA (Genius AI / Reception) atiende las llamadas por voz. Sara es la recepcionista con IA para clínicas de LATAM, en WhatsApp e Instagram. Atacan el mismo problema en mercados y canales distintos. Datos públicos de agosto 2026.',
        verdictThem: {
          title: 'Elige GlossGenius si...',
          body: 'estás en Estados Unidos y querés una suite de gestión todo-en-uno para tu medspa: agenda, ficha clínica con HIPAA, sign-off médico, POS y pagos, con su recepcionista de IA (Reception) atendiendo las llamadas por voz. Todo vive dentro de su plataforma.',
        },
        verdictSara: {
          title: 'Elige Sara AI si...',
          body: 'atendés en español y tus pacientes te escriben por WhatsApp e Instagram, no te llaman por teléfono. Sara conversa con IA real en esos canales, agenda en el Google Calendar que ya usás (sin migrar), cobra la seña en el chat, reactiva pacientes, crea tu contenido de Instagram y pide las reseñas, sin atarte a una plataforma nueva ni tocar la historia clínica.',
        },
        rows: [
          { label: 'IA conversacional real', sara: { v: 'yes' }, them: { v: 'yes', note: 'Reception, por voz' } },
          { label: 'WhatsApp e Instagram con IA', sara: { v: 'yes' }, them: { v: 'no', note: 'recepcionista por voz/llamada' } },
          { label: 'Atiende llamadas telefónicas (voz)', sara: { v: 'no', note: 'Sara es chat, no voz' }, them: { v: 'yes' } },
          { label: 'Usa tu Google Calendar sin migrar', sara: { v: 'yes' }, them: { v: 'no', note: 'requiere la plataforma GlossGenius' } },
          { label: 'Cobra la seña dentro del chat', sara: { v: 'yes' }, them: { v: 'partial', note: 'cobros y depósitos en su plataforma' } },
          { label: 'Reactiva pacientes', sara: { v: 'yes' }, them: { v: 'yes' } },
          { label: 'Pide reseñas de Google', sara: { v: 'yes' }, them: { v: 'yes' } },
          { label: 'Crea el contenido de Instagram', sara: { v: 'yes' }, them: { v: 'partial', note: 'marketing, sin creación con IA' } },
          { label: 'Ficha clínica / HIPAA', sara: { v: 'no', note: 'a propósito: no toca datos clínicos' }, them: { v: 'yes', note: 'charting + sign-off médico' } },
          { label: 'Idioma y mercado', sara: { v: 'text', note: 'español, LATAM' }, them: { v: 'text', note: 'inglés, EE.UU.' } },
          { label: 'Precio público', sara: { v: 'text', note: saraPrice }, them: { v: 'text', note: 'desde ~US$56/mes; medspa US$148-248/mes' } },
        ],
        faq: [
          { q: '¿GlossGenius funciona en español y en LATAM?', a: 'Es una plataforma de Estados Unidos, en inglés, pensada para el mercado norteamericano. Sara está hecha para clínicas de LATAM y adapta el registro al país de cada clínica.' },
          { q: '¿Reception atiende WhatsApp e Instagram?', a: 'Reception es principalmente una recepcionista por voz (atiende las llamadas) dentro de la plataforma GlossGenius. Sara atiende WhatsApp e Instagram con IA, que es donde entra la consulta en Latinoamérica.' },
          { q: '¿Tengo que cambiar mi software para usar Reception?', a: 'Reception funciona dentro de GlossGenius, así que implica adoptar su plataforma. Sara trabaja sobre el Google Calendar que tu clínica ya usa, sin migración.' },
          { q: '¿Cuál conviene para un medspa en EE.UU. con ficha clínica y HIPAA?', a: 'Ahí GlossGenius es más completo: tiene charting, HIPAA y sign-off médico. Sara no toca la historia clínica a propósito y se enfoca en la conversación, la agenda y el cobro por WhatsApp e Instagram.' },
        ],
        compareAllCta: 'Ver la comparativa completa de asistentes con IA',
      },
      en: {
        metaTitle: 'Sara AI vs GlossGenius: which one fits your clinic? (2026)',
        metaDescription: 'We compare Sara AI and GlossGenius (Reception) for clinics: WhatsApp and Instagram vs a voice receptionist, your Google Calendar vs their platform, LATAM vs US market. Data from August 2026.',
        eyebrow: 'Sara AI vs GlossGenius',
        title: 'Sara AI vs GlossGenius, straight&nbsp;up.',
        lead: 'GlossGenius is the management platform for US salons and medspas, and its AI (Genius AI / Reception) answers phone calls by voice. Sara is the AI receptionist for LATAM clinics, on WhatsApp and Instagram. Same problem, different markets and channels. Public data from August 2026.',
        verdictThem: {
          title: 'Pick GlossGenius if...',
          body: 'you are in the United States and want an all-in-one management suite for your medspa: scheduling, clinical charting with HIPAA, medical sign-off, POS and payments, with its AI receptionist (Reception) answering calls by voice. Everything lives inside their platform.',
        },
        verdictSara: {
          title: 'Pick Sara AI if...',
          body: 'you serve patients in Spanish and they message you on WhatsApp and Instagram rather than calling. Sara holds a real AI conversation on those channels, books into the Google Calendar you already use (no migration), collects the deposit in the chat, reactivates patients, creates your Instagram content and asks for reviews, without locking you into a new platform or touching clinical records.',
        },
        rows: [
          { label: 'Real conversational AI', sara: { v: 'yes' }, them: { v: 'yes', note: 'Reception, by voice' } },
          { label: 'WhatsApp and Instagram with AI', sara: { v: 'yes' }, them: { v: 'no', note: 'voice/phone receptionist' } },
          { label: 'Answers phone calls (voice)', sara: { v: 'no', note: 'Sara is chat, not voice' }, them: { v: 'yes' } },
          { label: 'Uses your Google Calendar, no migration', sara: { v: 'yes' }, them: { v: 'no', note: 'requires the GlossGenius platform' } },
          { label: 'Collects the deposit in the chat', sara: { v: 'yes' }, them: { v: 'partial', note: 'payments and deposits in their platform' } },
          { label: 'Patient reactivation', sara: { v: 'yes' }, them: { v: 'yes' } },
          { label: 'Asks for Google reviews', sara: { v: 'yes' }, them: { v: 'yes' } },
          { label: 'Creates your Instagram content', sara: { v: 'yes' }, them: { v: 'partial', note: 'marketing, no AI post creation' } },
          { label: 'Clinical records / HIPAA', sara: { v: 'no', note: 'on purpose: no clinical data' }, them: { v: 'yes', note: 'charting + medical sign-off' } },
          { label: 'Language and market', sara: { v: 'text', note: 'Spanish, LATAM' }, them: { v: 'text', note: 'English, US' } },
          { label: 'Public pricing', sara: { v: 'text', note: saraPriceEn }, them: { v: 'text', note: 'from ~US$56/mo; medspa US$148-248/mo' } },
        ],
        faq: [
          { q: 'Does GlossGenius work in Spanish and in LATAM?', a: 'It is a US platform, in English, built for the North American market. Sara is made for LATAM clinics and adapts its register to each clinic’s country.' },
          { q: 'Does Reception cover WhatsApp and Instagram?', a: 'Reception is primarily a voice receptionist (it answers calls) inside the GlossGenius platform. Sara answers WhatsApp and Instagram with AI, which is where the enquiry arrives in Latin America.' },
          { q: 'Do I have to change my software to use Reception?', a: 'Reception works inside GlossGenius, so it means adopting their platform. Sara works on top of the Google Calendar your clinic already uses, with no migration.' },
          { q: 'Which one is better for a US medspa with clinical records and HIPAA?', a: 'GlossGenius is more complete there: it has charting, HIPAA and medical sign-off. Sara never touches clinical records on purpose and focuses on the conversation, the calendar and payment on WhatsApp and Instagram.' },
        ],
        compareAllCta: 'See the full AI assistant comparison',
      },
    },
  },
];
