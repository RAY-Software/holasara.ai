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
  /** URL visible en la burbuja (p. ej. link de pago), como la pinta WhatsApp. */
  link?: string;
  /** Post de Instagram adjunto (preview dentro de la burbuja), p. ej. la promo que Mia acaba de publicar. */
  post?: { img: string; handle: string; caption: string };
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
  // Casos de uso (grid "lo que hace"). Opcional por personaje.
  // logo: path a un SVG de marca. icon: keyword de ícono inline (ver [member].astro).
  useCases?: Record<Locale, { title: string; desc: string; logo?: string; icon?: string }[]>;
  // Bloque de Instagram (solo Mia): flujo de 3 pasos con posts mock (IgPost),
  // reusando el material de la página /instagram.
  igFlow?: Record<
    Locale,
    {
      title: string; // admite <em>
      intro: string;
      steps: { img: string; caption: string; likes: string; comment?: string; step: string; body: string }[];
    }
  >;
  // Storyboard de escenas animadas (chats encadenados). Opcional por personaje.
  // name/avatar: overrides por escena (p. ej. la escena donde Sara ejecuta lo
  // que Daniel o Mia dispararon); si faltan, usa los del personaje.
  scenesTitle?: Record<Locale, string>; // admite <em> y &nbsp;
  scenesIntro?: Record<Locale, string>;
  // Texto del conector entre escena 1 y 2 (mobile, donde las columnas se apilan).
  scenesHandoff?: Record<Locale, string>;
  scenes?: Record<
    Locale,
    { who: string; label: string; subtitle?: string; name?: string; avatar?: string; bubbles: Bubble[] }[]
  >;
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
      es: "Tu recepción.<br /><em class='text-pine-dark'>Y tu secretaria.</em>",
      en: "Your front desk.<br /><em class='text-pine-dark'>And your secretary.</em>",
    },
    heroLead: {
      es: 'Sara es la recepcionista y la secretaria con IA de tu clínica. Atiende, vende, agenda y cobra por WhatsApp, Instagram y teléfono. Y le pides lo que necesites (bloquear tu agenda, reagendar, reactivar pacientes) y lo hace. De noche, los fines de semana y en los picos.',
      en: 'Sara is your clinic’s AI receptionist and secretary. She answers, sells, books and collects over WhatsApp, Instagram and phone. And you ask her for whatever you need (block your calendar, reschedule, win patients back) and she does it. At night, on weekends and at peak times.',
    },
    kicker: { es: 'Cómo trabaja Sara', en: 'How Sara works' },
    h2: {
      es: 'No es un bot.<br /><em class="text-pine-dark">Atiende como<br />tu mejor recepción.</em>',
      en: 'Not a bot.<br /><em class="text-pine-dark">She answers like<br />your best front desk.</em>',
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
        { who: 'out', text: 'Listo, jueves 17:30 reservado. Te paso el link del anticipo y te llega el recordatorio un día antes.', t: '23:43' },
      ],
      en: [
        { who: 'out', text: 'Hi! Full legs come in our 6-session pack at $6,900, with a free first trial session. Want me to book that first one?', t: '11:41' },
        { who: 'in', text: 'Yes, anything this week?', t: '11:42' },
        { who: 'out', text: 'Yes! Thursday 5:30pm or Friday 6:00pm. A deposit locks in the booking. Which works better?', t: '11:42' },
        { who: 'in', text: 'Thursday', t: '11:43' },
        { who: 'out', text: 'Done, Thursday 5:30pm booked. I’ll send the deposit link and a reminder a day before.', t: '11:43' },
      ],
    },
    featureLinkLabel: { es: 'Ver todo lo que hace Sara', en: 'See everything Sara does' },
    scenesTitle: {
      es: 'Le pides algo a Sara. <em class="text-pine-dark">Y ella sale a resolverlo.</em>',
      en: 'You ask Sara for something. <em class="text-pine-dark">And she goes and gets it done.</em>',
    },
    scenesHandoff: {
      es: 'Sara le escribe a cada paciente',
      en: 'Sara messages each patient',
    },
    scenesIntro: {
      es: 'Así se ve en la vida real: el doctor le pide reagendar una tarde entera, y Sara habla con cada paciente hasta dejar todo resuelto.',
      en: 'Here’s what it looks like in real life: the doctor asks her to reschedule a whole afternoon, and Sara talks to each patient until everything is sorted.',
    },
    scenes: {
      es: [
        {
          who: '1 · Tú y Sara',
          label: 'le pides reagendar',
          subtitle: 'tu secretaria por WhatsApp',
          bubbles: [
            { who: 'in', text: 'Sara, me salió una cirugía el martes a la tarde. Reagenda a los pacientes que tengo ese día después de las 14.', t: '11:02' },
            { who: 'out', text: 'Claro, doctor. El martes después de las 14 tiene 3 pacientes: Laura G. (14:30, limpieza), Marco P. (15:30, valoración) y Sofía T. (17:00, control). ¿Les propongo pasarse al jueves o al viernes?', t: '11:02' },
            { who: 'in', text: 'Sí, dales prioridad el jueves', t: '11:04' },
            { who: 'out', text: 'Perfecto. Les escribo ahora a los tres con opciones del jueves y le confirmo apenas cierre cada uno.', t: '11:04' },
            { who: 'in', text: 'Avísame si alguno no puede esta semana', t: '11:05' },
            { who: 'out', text: 'Se lo marco. Si alguien no puede, le ofrezco la semana próxima y se lo dejo anotado en su agenda para que lo vea.', t: '11:05' },
          ],
        },
        {
          who: '2 · Sara y el paciente',
          label: 'lo resuelve',
          subtitle: 'con tu paciente',
          bubbles: [
            { who: 'out', text: 'Hola Laura, te escribo de la clínica. El doctor tuvo que mover su agenda del martes y necesitamos reagendar tu limpieza de las 14:30. ¿Te queda bien el jueves 15:00 o 17:30?', t: '11:07' },
            { who: 'in', text: 'Uy, sí. El jueves 17:30 me va perfecto', t: '11:15' },
            { who: 'out', text: 'Listo, jueves 17:30 confirmado. Tu limpieza queda igual que estaba y te llega el recordatorio un día antes.', t: '11:15' },
            { who: 'in', text: 'Genial, gracias por avisar con tiempo', t: '11:16' },
            { who: 'out', text: 'Gracias a ti por la flexibilidad. Cualquier cosa me escribes por aquí. Nos vemos el jueves.', t: '11:16' },
          ],
        },
      ],
      en: [
        {
          who: '1 · You and Sara',
          label: 'you ask her to reschedule',
          subtitle: 'your secretary on WhatsApp',
          bubbles: [
            { who: 'in', text: 'Sara, a surgery came up on Tuesday afternoon. Reschedule my patients that day after 2pm.', t: '11:02' },
            { who: 'out', text: 'Of course, doctor. Tuesday after 2pm you have 3 patients: Laura G. (2:30, cleaning), Marco P. (3:30, assessment) and Sofía T. (5:00, follow-up). Shall I offer them Thursday or Friday?', t: '11:02' },
            { who: 'in', text: 'Yes, prioritize Thursday', t: '11:04' },
            { who: 'out', text: 'Perfect. I am messaging all three now with Thursday options and I will confirm as each one closes.', t: '11:04' },
            { who: 'in', text: 'Let me know if anyone cannot make it this week', t: '11:05' },
            { who: 'out', text: 'Noted. If someone cannot, I will offer next week and leave it flagged on your calendar so you see it.', t: '11:05' },
          ],
        },
        {
          who: '2 · Sara and the patient',
          label: 'she sorts it out',
          subtitle: 'with your patient',
          bubbles: [
            { who: 'out', text: 'Hi Laura, it is the clinic. The doctor had to move his Tuesday schedule and we need to reschedule your 2:30 cleaning. Would Thursday 3:00 or 5:30 work?', t: '11:07' },
            { who: 'in', text: 'Oh, sure. Thursday 5:30 works great', t: '11:15' },
            { who: 'out', text: 'Done, Thursday 5:30 confirmed. Your cleaning stays exactly as it was and you will get a reminder the day before.', t: '11:15' },
            { who: 'in', text: 'Great, thanks for the heads-up', t: '11:16' },
            { who: 'out', text: 'Thank you for being flexible. Anything you need, just write me here. See you Thursday.', t: '11:16' },
          ],
        },
      ],
    },
    useCases: {
      es: [
        { title: 'Tu secretaria', icon: 'chat', desc: 'Le pides las cosas por WhatsApp, como "bloquea el viernes" o "reagenda a Juan", y las hace al instante.' },
        { title: 'WhatsApp e Instagram', logo: '/img/logos/whatsapp.svg', desc: 'Atiende al instante donde te escriben, 24/7, con el criterio de tu clínica.' },
        { title: 'Atiende el teléfono', icon: 'phone', desc: 'Contesta las llamadas por voz, informa y agenda, sin que suene ocupado.' },
        { title: 'Agenda y recordatorios', icon: 'calendar', desc: 'Reserva en tu calendario, recuerda y confirma. Sin dobles reservas.' },
        { title: 'Cobra el anticipo', icon: 'card', desc: 'Cobra la seña o la consulta en el mismo chat, antes de la cita.' },
        { title: 'Reactiva pacientes', icon: 'refresh', desc: 'Trae de vuelta a los que no vuelven y llena los huecos de la agenda.' },
      ],
      en: [
        { title: 'Your secretary', icon: 'chat', desc: 'You ask her over WhatsApp, like "block Friday" or "move Juan", and she does it instantly.' },
        { title: 'WhatsApp & Instagram', logo: '/img/logos/whatsapp.svg', desc: 'Answers instantly wherever they message you, 24/7, with your clinic’s judgment.' },
        { title: 'Answers the phone', icon: 'phone', desc: 'Picks up voice calls, informs and books, with no busy tone.' },
        { title: 'Scheduling & reminders', icon: 'calendar', desc: 'Books in your calendar, reminds and confirms. No double bookings.' },
        { title: 'Takes the deposit', icon: 'card', desc: 'Charges the deposit or consult in the same chat, before the appointment.' },
        { title: 'Wins patients back', icon: 'refresh', desc: 'Brings back those who don’t return and fills the gaps in your calendar.' },
      ],
    },
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
      es: 'Tu marketing completo: web, Google e Instagram. Y te dice dónde crecer.',
      en: 'Your whole marketing: web, Google and Instagram. And tells you where to grow.',
    },
    metaTitle: {
      es: 'Mia · Marketing con IA: web, Google Business, campañas e Instagram',
      en: 'Mia · AI marketing: website, Google Business, campaigns and Instagram',
    },
    metaDescription: {
      es: 'Mia es la jefa de marketing con IA de tu negocio. Maneja tu Instagram, corre tus campañas de Google Ads, optimiza tu ficha de Google Business y mira los números de tu web. Y como es proactiva, te escribe la propuesta para traer más pacientes.',
      en: 'Mia is your business’s AI head of marketing. She runs your Instagram, runs your Google Ads campaigns, optimizes your Google Business profile and watches your website numbers. And since she’s proactive, she sends you the proposal to bring in more patients.',
    },
    heroEyebrow: { es: 'Mia · Marketing', en: 'Mia · Marketing' },
    heroTitle: {
      es: "Maneja todo tu marketing.<br /><em class='text-pine-dark'>Y te dice dónde&nbsp;crecer.</em>",
      en: "Runs all your marketing.<br /><em class='text-pine-dark'>And tells you where to grow.</em>",
    },
    heroLead: {
      es: 'Mia es la jefa de marketing con IA de tu negocio. Maneja tu Instagram, tus campañas de Google Ads y tu ficha de Google Business, y vive encima de los números de tu web. Cuando ve una forma de traer más pacientes, te la escribe lista para aprobar.',
      en: 'Mia is your business’s AI head of marketing. She runs your Instagram, your Google Ads campaigns and your Google Business profile, and lives on top of your website numbers. When she sees a way to bring in more patients, she sends it to you ready to approve.',
    },
    kicker: { es: 'Cómo trabaja Mia', en: 'How Mia works' },
    h2: {
      es: 'No le pides nada.<br /><em class="text-pine-dark">Te trae pacientes.</em>',
      en: 'You don’t ask.<br /><em class="text-pine-dark">She brings you patients.</em>',
    },
    paragraph: {
      es: 'Mia lleva tu marketing de punta a punta: crea y publica tu Instagram, corre tus campañas de Google Ads, optimiza tu ficha de Google Business y mira las métricas de tu web. Y como es proactiva, no espera a que le pidas: cuando ve una forma de traer más pacientes (una ficha que bajó, una campaña que rinde, una semana floja) te escribe la propuesta lista. La apruebas por chat y ella la ejecuta.',
      en: 'Mia runs your marketing end to end: she creates and posts your Instagram, runs your Google Ads campaigns, optimizes your Google Business profile and watches your website metrics. And since she’s proactive, she doesn’t wait to be asked: when she sees a way to bring in more patients (a profile that slipped, a campaign that’s working, a slow week) she sends you the proposal, ready to go. You approve over chat and she runs it.',
    },
    points: {
      es: [
        'Lleva tu Instagram: contenido, respuestas y agenda',
        'Corre tus campañas de Google Ads y optimiza tu ficha de Google',
        'Te escribe la propuesta y la ejecuta cuando la apruebas',
      ],
      en: [
        'Runs your Instagram: content, replies and bookings',
        'Runs your Google Ads campaigns and optimizes your Google profile',
        'Sends you the proposal and runs it once you approve',
      ],
    },
    chatSubtitle: { es: 'Experta en marketing', en: 'Marketing expert' },
    bubbles: {
      es: [
        { who: 'out', text: 'Resumen de la semana. Tu web: +18% de visitas desde Google. Tu ficha de Google apareció en 2,400 búsquedas y entraron 9 llamadas. Instagram: +320 seguidores.', t: '09:12' },
        { who: 'out', text: 'Dos movimientos para esta semana: subo 6 fotos nuevas a tu ficha de Google (hace 40 días que no se toca y bajó en el mapa) y lanzo una campaña de Google Ads para "botox + tu zona" con $150 de prueba. ¿Le damos?', t: '09:12' },
        { who: 'in', text: 'Sube las fotos. La campaña empieza con $100', t: '09:20' },
        { who: 'out', text: 'Listo. Fotos arriba y campaña activa con $100 semanales. El jueves te paso los primeros resultados y quién llamó.', t: '09:21' },
      ],
      en: [
        { who: 'out', text: 'Week recap. Your website: +18% visits from Google. Your Google profile showed in 2,400 searches and drove 9 calls. Instagram: +320 followers.', t: '09:12' },
        { who: 'out', text: 'Two moves for this week: I add 6 fresh photos to your Google profile (untouched for 40 days, it slipped on the map) and launch a Google Ads campaign for "botox + your area" with a $150 test. Shall we?', t: '09:12' },
        { who: 'in', text: 'Do the photos. Start the campaign at $100', t: '09:20' },
        { who: 'out', text: 'Done. Photos up and campaign live at $100 a week. Thursday I’ll send the first results and who called.', t: '09:21' },
      ],
    },
    featureLinkLabel: { es: 'Ver Instagram con Mia', en: 'See Instagram with Mia' },
    igFlow: {
      es: {
        title: 'Tu Instagram, <em class="text-pine-dark">de punta a punta.</em>',
        intro:
          'Mia entiende el feed de tu marca, propone las ideas, crea el contenido y lo publica. Y cada mes te dice qué publicación trajo consultas y cuánto facturaste a partir de cada una.',
        steps: [
          {
            img: '/img/tenants/faceup.jpg',
            likes: '312',
            caption: '<b>clinicaaurora</b> Ácido hialurónico en labios: qué esperar la primera semana',
            step: '1 · Entiende tu feed y propone',
            body: 'Estudia tu marca y tu feed, y te propone el calendario del mes con ideas listas para aprobar.',
          },
          {
            img: '/img/tenants/physiup.jpg',
            likes: '208',
            caption: '<b>clinicaaurora</b> Desliza para ver el paso a paso',
            comment: '<b>camifer_</b> ¿Cuánto sale la valoración?',
            step: '2 · Crea y publica',
            body: 'Escribe el texto, arma la pieza con tu identidad y la publica. Nada sale sin tu aprobación.',
          },
          {
            img: '/img/tenants/sorace.jpg',
            likes: '176',
            caption: '<b>clinicaaurora</b> Agenda tu valoración por mensaje',
            step: '3 · Mide lo que facturó',
            body: 'Te dice qué publicación trajo consultas y cuánto se facturó a partir de cada una. Nada de likes de vanidad.',
          },
        ],
      },
      en: {
        title: 'Your Instagram, <em class="text-pine-dark">end to end.</em>',
        intro:
          'Mia understands your brand’s feed, pitches the ideas, creates the content and publishes it. And every month she tells you which post brought enquiries and how much you billed from each one.',
        steps: [
          {
            img: '/img/tenants/faceup.jpg',
            likes: '312',
            caption: '<b>clinicaaurora</b> Lip hyaluronic acid: what to expect in week one',
            step: '1 · Understands your feed and pitches',
            body: 'She studies your brand and your feed, and pitches the month’s calendar with ideas ready to approve.',
          },
          {
            img: '/img/tenants/physiup.jpg',
            likes: '208',
            caption: '<b>clinicaaurora</b> Swipe to see the step by step',
            comment: '<b>camifer_</b> How much is the assessment?',
            step: '2 · Creates and publishes',
            body: 'She writes the copy, builds the piece with your identity and publishes it. Nothing goes out without your approval.',
          },
          {
            img: '/img/tenants/sorace.jpg',
            likes: '176',
            caption: '<b>clinicaaurora</b> Book your assessment by message',
            step: '3 · Measures what it billed',
            body: 'She tells you which post brought enquiries and how much you billed from each one. No vanity likes.',
          },
        ],
      },
    },
    scenesTitle: {
      es: 'Mia ve la agenda floja. <em class="text-pine-dark">Y el equipo la llena.</em>',
      en: 'Mia sees a slow week. <em class="text-pine-dark">And the team fills it.</em>',
    },
    scenesHandoff: {
      es: 'El paciente ve la promo en Instagram y escribe',
      en: 'The patient sees the promo on Instagram and writes in',
    },
    scenesIntro: {
      es: 'Así se ve en la vida real: Mia detecta los días flojos y te propone la promo. La apruebas, ella la publica, y a quien responde lo agenda Sara con el anticipo cobrado.',
      en: 'Here’s what it looks like in real life: Mia catches the slow days and pitches the promo. You approve, she publishes, and whoever replies gets booked by Sara, deposit collected.',
    },
    scenes: {
      es: [
        {
          who: '1 · Mia y tú',
          label: 'te propone la promo',
          subtitle: 'contigo, por WhatsApp',
          bubbles: [
            { who: 'out', text: 'Hola, vi que el jueves y el viernes quedaron flojos: 9 huecos entre los dos, casi todos a la tarde.', t: '09:12' },
            { who: 'out', text: 'Te armo una promo para llenarlos: "Botox jueves y viernes, agenda con anticipo y llevas la segunda zona a mitad de precio". La pieza para feed y para historia ya está lista, con tu marca.', t: '09:12' },
            { who: 'in', text: 'Sí, pero baja el descuento a 30%. ¿Cuándo la publicarías?', t: '09:20' },
            { who: 'out', text: 'Ajustado al 30%. La publico hoy a las 18:00, que es cuando tu cuenta tiene más alcance, y mañana temprano repito la historia.', t: '09:20' },
            { who: 'in', text: 'Perfecto, adelante', t: '09:21' },
            { who: 'out', text: 'Publicada. A quien responda lo agenda Sara con el anticipo cobrado. El lunes te paso cuántas citas salieron de la promo.', t: '18:02', post: { img: '/img/tenants/faceup.jpg', handle: 'clinicaaurora', caption: 'Botox jueves y viernes: agenda con anticipo y llevas la segunda zona con 30% de descuento' } },
          ],
        },
        {
          who: '2 · Sara y el paciente',
          label: 'agenda la cita',
          name: 'Sara',
          avatar: '/equipo/sara-avatar.jpg',
          subtitle: 'con tu paciente',
          bubbles: [
            { who: 'in', text: 'Hola! Vi la promo de botox en Instagram. ¿Sigue disponible?', t: '13:47' },
            { who: 'out', text: 'Sí. Aplica jueves y viernes: agendas con anticipo y llevas la segunda zona con 30% de descuento. ¿Sería tu primera vez con nosotros?', t: '13:47' },
            { who: 'in', text: 'Sí, primera vez', t: '13:51' },
            { who: 'out', text: 'Perfecto, entonces la doctora te hace una valoración corta en la misma cita, sin costo extra. Tengo jueves 16:00 o viernes 11:30. ¿Cuál te queda mejor?', t: '13:51' },
            { who: 'in', text: 'Viernes 11:30', t: '13:52' },
            { who: 'out', text: 'Listo, viernes 11:30 reservado. Te dejo el link para pagar el anticipo y con eso queda confirmado.', t: '13:52', link: 'holasara.ai/pago/8k2f' },
            { who: 'in', text: 'Ya está, pagado', t: '13:56' },
            { who: 'out', text: 'Pago recibido. Tu cita del viernes 11:30 queda confirmada y un día antes te llega el recordatorio. Nos vemos.', t: '13:56' },
          ],
        },
      ],
      en: [
        {
          who: '1 · Mia and you',
          label: 'pitches the promo',
          subtitle: 'with you, on WhatsApp',
          bubbles: [
            { who: 'out', text: 'Hey, Thursday and Friday are looking light: 9 open slots between them, almost all in the afternoon.', t: '09:12' },
            { who: 'out', text: 'Let me put together a promo to fill them: "Botox Thursday and Friday, book with a deposit and get the second area half off." The feed and story pieces are ready, with your brand.', t: '09:12' },
            { who: 'in', text: 'Yes, but drop the discount to 30%. When would you publish it?', t: '09:20' },
            { who: 'out', text: 'Set to 30%. I would post today at 6pm, when your account gets the most reach, and repeat the story early tomorrow.', t: '09:20' },
            { who: 'in', text: 'Perfect, go ahead', t: '09:21' },
            { who: 'out', text: 'Published. Whoever replies gets booked by Sara with the deposit collected. On Monday I will send you how many appointments came from the promo.', t: '18:02', post: { img: '/img/tenants/faceup.jpg', handle: 'clinicaaurora', caption: 'Botox Thursday and Friday: book with a deposit and get 30% off the second area' } },
          ],
        },
        {
          who: '2 · Sara and the patient',
          label: 'books the visit',
          name: 'Sara',
          avatar: '/equipo/sara-avatar.jpg',
          subtitle: 'with your patient',
          bubbles: [
            { who: 'in', text: 'Hi! I saw the botox promo on Instagram. Is it still on?', t: '13:47' },
            { who: 'out', text: 'It is. Valid Thursday and Friday: book with a deposit and get 30% off the second area. Would this be your first time with us?', t: '13:47' },
            { who: 'in', text: 'Yes, first time', t: '13:51' },
            { who: 'out', text: 'Perfect, then the doctor does a short assessment in the same visit, at no extra cost. I have Thursday 4:00pm or Friday 11:30am. Which works better?', t: '13:51' },
            { who: 'in', text: 'Friday 11:30', t: '13:52' },
            { who: 'out', text: 'Done, Friday 11:30am booked. Here is the link to pay the deposit, and that confirms it.', t: '13:52', link: 'holasara.ai/pago/8k2f' },
            { who: 'in', text: 'All set, paid', t: '13:56' },
            { who: 'out', text: 'Payment received. Your Friday 11:30am appointment is confirmed and you will get a reminder the day before. See you.', t: '13:56' },
          ],
        },
      ],
    },
    useCases: {
      es: [
        { title: 'Instagram', logo: '/img/logos/instagram.svg', desc: 'Crea las publicaciones con tu marca, responde a quien comenta y lo lleva hasta la cita.' },
        { title: 'Google Ads', logo: '/img/logos/google-ads.svg', desc: 'Arma y maneja tus campañas en Google para que te encuentren justo cuando buscan tu tratamiento.' },
        { title: 'Google Business', logo: '/img/logos/google-business.svg', desc: 'Optimiza tu ficha: fotos, reseñas y datos, para que aparezcas primero en el mapa.' },
        { title: 'Tu web y tus números', desc: 'Mira las métricas de tu sitio y te dice qué está trayendo pacientes y qué no.' },
      ],
      en: [
        { title: 'Instagram', logo: '/img/logos/instagram.svg', desc: 'Creates on-brand posts, replies to whoever comments and takes them to a booking.' },
        { title: 'Google Ads', logo: '/img/logos/google-ads.svg', desc: 'Builds and runs your Google campaigns so people find you right when they search your treatment.' },
        { title: 'Google Business', logo: '/img/logos/google-business.svg', desc: 'Optimizes your profile: photos, reviews and details, so you show up first on the map.' },
        { title: 'Your site and your numbers', desc: 'Watches your website metrics and tells you what’s bringing in patients and what isn’t.' },
      ],
    },
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
      es: "Te dice cómo va el dinero.<br /><em class='text-pine-dark'>Antes de que&nbsp;preguntes.</em>",
      en: "Tells you how the money’s doing.<br /><em class='text-pine-dark'>Before you ask.</em>",
    },
    heroLead: {
      es: 'Daniel es el analista de finanzas con IA de tu clínica. Lleva las cuentas y te avisa lo que importa: cuánto facturaste, qué te falta cobrar y qué tratamiento deja más margen. Sin abrir un solo Excel.',
      en: 'Daniel is your clinic’s AI finance analyst. He keeps the books and flags what matters: how much you billed, what’s still to collect and which treatment leaves the most margin. Without opening a single spreadsheet.',
    },
    kicker: { es: 'Cómo trabaja Daniel', en: 'How Daniel works' },
    h2: {
      es: 'Daniel te dice cómo va el dinero. <em class="text-pine-dark">Antes de que preguntes.</em>',
      en: 'Daniel tells you how the money’s doing. <em class="text-pine-dark">Before you ask.</em>',
    },
    paragraph: {
      es: 'Daniel lleva las cuentas de tu clínica y te avisa lo que importa: cuánto facturaste, qué te falta cobrar y qué tratamiento deja más margen. Cuando hay algo para hacer, te lo propone y el equipo lo ejecuta. Sin abrir un solo Excel.',
      en: 'Daniel keeps your clinic’s books and flags what matters: how much you billed, what’s still to collect, and which treatment leaves the most margin. When there’s something to do, he pitches it and the team runs it. Without opening a single spreadsheet.',
    },
    points: {
      es: [
        'Te resume la facturación sin que abras un Excel',
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
        { who: 'out', text: 'Cerré los números de octubre. Facturaste $312,000 y gastaste $187,400: te quedó un margen de 40%, tres puntos arriba que septiembre.', t: '08:30' },
        { who: 'out', text: 'Lo que más empujó fue el láser: $96,000 facturados con 68% de margen. La consulta de valoración sigue siendo lo que menos deja. Te dejé el detalle completo en el panel.', t: '08:30' },
        { who: 'in', text: '¿Y noviembre cómo viene?', t: '08:41' },
        { who: 'out', text: 'A este ritmo, noviembre cierra en unos $290,000. Viene un poco más lento por los feriados, pero la segunda quincena ya está 70% llena. Si algo se mueve, te aviso.', t: '08:42' },
      ],
      en: [
        { who: 'out', text: 'Closed October. You billed $312,000 and spent $187,400: a 40% margin, three points up from September.', t: '08:30' },
        { who: 'out', text: 'Laser drove most of it: $96,000 billed at a 68% margin. The assessment consult is still your lowest earner. The full detail is in your dashboard.', t: '08:30' },
        { who: 'in', text: 'And how is November looking?', t: '08:41' },
        { who: 'out', text: 'At this pace, November lands around $290,000. A bit slower with the holidays, but the second half of the month is already 70% booked. If anything shifts, I will let you know.', t: '08:42' },
      ],
    },
    featureLinkLabel: { es: 'Pedir una demo', en: 'Book a demo' },
    scenesTitle: {
      es: 'Daniel encuentra dinero por cobrar. <em class="text-pine-dark">Y Sara sale a cobrarlo.</em>',
      en: 'Daniel finds money to collect. <em class="text-pine-dark">And Sara goes and collects it.</em>',
    },
    scenesHandoff: {
      es: 'Sara le escribe a cada paciente con su link de pago',
      en: 'Sara messages each patient with their payment link',
    },
    scenesIntro: {
      es: 'Así trabaja el equipo junto: Daniel detecta anticipos sin cobrar, tú apruebas con un mensaje, y Sara le escribe a cada paciente hasta recuperarlos.',
      en: 'Here’s the team working together: Daniel spots uncollected deposits, you approve with one message, and Sara writes each patient until the money comes in.',
    },
    scenes: {
      es: [
        {
          who: '1 · Daniel y tú',
          label: 've anticipos sin cobrar',
          subtitle: 'te avisa cómo van los números',
          bubbles: [
            { who: 'out', text: 'Revisé la semana. Tienes $18,400 en anticipos sin cobrar, repartidos en 7 citas de los próximos días.', t: '08:30' },
            { who: 'out', text: 'Los tres más grandes: Laura G. ($4,500, jueves), Marco P. ($3,800, viernes) y Sofía T. ($2,900, sábado). Si quieres, se los paso a Sara para que los cobre por WhatsApp hoy mismo.', t: '08:30' },
            { who: 'in', text: 'Sí, adelante. ¿Cuánto recuperamos el mes pasado así?', t: '08:41' },
            { who: 'out', text: 'El mes pasado Sara recuperó $21,300 de $24,000 pendientes, casi todo dentro de las 48 horas. Le paso la lista ahora y te aviso a medida que entren los pagos.', t: '08:41' },
            { who: 'in', text: 'Perfecto, gracias', t: '08:42' },
          ],
        },
        {
          who: '2 · Sara y el paciente',
          label: 'cobra el anticipo',
          name: 'Sara',
          avatar: '/equipo/sara-avatar.jpg',
          subtitle: 'con tu paciente',
          bubbles: [
            { who: 'out', text: 'Hola Laura, te escribo de la clínica. Quedó pendiente el anticipo de tu cita del jueves 17:30. Te dejo el link para pagarlo y asegurar tu lugar.', t: '09:05', link: 'holasara.ai/pago/3d7q' },
            { who: 'in', text: 'Uy, se me pasó por completo. ¿Hasta cuándo puedo pagarlo?', t: '09:18' },
            { who: 'out', text: 'No te preocupes. Si lo pagas hoy, tu cita queda tal cual está. Si prefieres, también puedo moverte de horario.', t: '09:18' },
            { who: 'in', text: 'No, el jueves está bien. Ya lo pago', t: '09:19' },
            { who: 'out', text: 'Pago recibido. Tu cita del jueves 17:30 queda confirmada y te llega el recordatorio un día antes. Gracias, Laura.', t: '09:22' },
          ],
        },
      ],
      en: [
        {
          who: '1 · Daniel and you',
          label: 'flags unpaid deposits',
          subtitle: 'flags how the numbers are doing',
          bubbles: [
            { who: 'out', text: 'Went over the week. You have $18,400 in uncollected deposits across 7 upcoming appointments.', t: '08:30' },
            { who: 'out', text: 'The three largest: Laura G. ($4,500, Thursday), Marco P. ($3,800, Friday) and Sofía T. ($2,900, Saturday). If you want, I will hand them to Sara to collect over WhatsApp today.', t: '08:30' },
            { who: 'in', text: 'Yes, go ahead. How much did we recover last month this way?', t: '08:41' },
            { who: 'out', text: 'Last month Sara recovered $21,300 out of $24,000 pending, almost all within 48 hours. I am sending her the list now and I will let you know as payments come in.', t: '08:41' },
            { who: 'in', text: 'Perfect, thanks', t: '08:42' },
          ],
        },
        {
          who: '2 · Sara and the patient',
          label: 'collects it',
          name: 'Sara',
          avatar: '/equipo/sara-avatar.jpg',
          subtitle: 'with your patient',
          bubbles: [
            { who: 'out', text: 'Hi Laura, it is the clinic. The deposit for your Thursday 5:30pm appointment is still pending. Here is the link to pay it and keep your spot.', t: '09:05', link: 'holasara.ai/pago/3d7q' },
            { who: 'in', text: 'Oh, it completely slipped my mind. Until when can I pay it?', t: '09:18' },
            { who: 'out', text: 'No worries. If you pay today, your appointment stays exactly as it is. If you prefer, I can also move you to another time.', t: '09:18' },
            { who: 'in', text: 'No, Thursday is fine. Paying now', t: '09:19' },
            { who: 'out', text: 'Payment received. Your Thursday 5:30pm appointment is confirmed and you will get a reminder the day before. Thank you, Laura.', t: '09:22' },
          ],
        },
      ],
    },
    useCases: {
      es: [
        { title: 'Cierre del mes', icon: 'chart', desc: 'Te resume cuánto facturaste y cómo vienes contra el mes anterior, sin hojas de cálculo.' },
        { title: 'Cobros pendientes', icon: 'card', desc: 'Detecta anticipos y pagos sin cobrar y te los pasa para recuperar.' },
        { title: 'Rentabilidad', icon: 'coin', desc: 'Te dice qué tratamiento deja más margen y cuál no está rindiendo.' },
        { title: 'Alertas', icon: 'bell', desc: 'Si algo se mueve, un gasto raro o una caída de ingresos, te avisa a tiempo.' },
      ],
      en: [
        { title: 'Monthly close', icon: 'chart', desc: 'Sums up how much you billed and how you’re tracking vs last month, no spreadsheets.' },
        { title: 'Money to collect', icon: 'card', desc: 'Spots unpaid deposits and payments and hands them over to recover.' },
        { title: 'Profitability', icon: 'coin', desc: 'Tells you which treatment leaves the most margin and which isn’t paying off.' },
        { title: 'Alerts', icon: 'bell', desc: 'If something shifts, an odd expense or a dip in revenue, he flags it in time.' },
      ],
    },
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
  useCases?: { title: string; desc: string; logo?: string; icon?: string }[];
  igFlow?: {
    title: string;
    intro: string;
    steps: { img: string; caption: string; likes: string; comment?: string; step: string; body: string }[];
  };
  scenesTitle?: string;
  scenesIntro?: string;
  scenesHandoff?: string;
  scenes?: { who: string; label: string; subtitle?: string; name?: string; avatar?: string; bubbles: Bubble[] }[];
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
  useCases: m.useCases ? m.useCases[lang] : undefined,
  igFlow: m.igFlow ? m.igFlow[lang] : undefined,
  scenesTitle: m.scenesTitle ? m.scenesTitle[lang] : undefined,
  scenesIntro: m.scenesIntro ? m.scenesIntro[lang] : undefined,
  scenesHandoff: m.scenesHandoff ? m.scenesHandoff[lang] : undefined,
  scenes: m.scenes ? m.scenes[lang] : undefined,
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
