// Landings por país (/es/mexico, /es/colombia, /es/uruguay). Una entrada por
// país, con el copy es/en adentro. Reglas: el ÚNICO precio público es el piso
// de México (src/lib/pricing.ts); el resto deriva a la demo, igual que /precios.
// El único caso publicable es ViaLaser (Uruguay). Nada inventado.
import { PRICE_MX, PRICE_UNIT } from '../lib/pricing';

export interface CountryQA {
  q: string;
  a: string;
}

export interface CountryCopy {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string; // puede llevar <em> y &nbsp;
  lead: string;
  bullets: { title: string; body: string }[];
  dialect: { title: string; body: string };
  price: { title: string; body: string };
  proof?: { body: string; cta: string }; // solo UY (ViaLaser)
  faq: CountryQA[];
}

export interface Country {
  slug: string; // segmento de URL: /es/<slug>
  name: { es: string; en: string };
  copy: { es: CountryCopy; en: CountryCopy };
}

export const countries: Country[] = [
  {
    slug: 'mexico',
    name: { es: 'México', en: 'Mexico' },
    copy: {
      es: {
        metaTitle: 'Sara AI en México: la secretaria con IA para clínicas',
        metaDescription: `Sara atiende el WhatsApp e Instagram de clínicas en México las 24 horas: responde precios, agenda en tu Google Calendar y cobra el anticipo en pesos. Desde ${PRICE_MX.display} ${PRICE_UNIT}.`,
        eyebrow: 'Sara AI en México',
        title: 'La recepción que contesta a las 11 de la noche, también en&nbsp;México.',
        lead: 'Las clínicas mexicanas reciben la consulta por WhatsApp o Instagram cuando la recepción ya se fue. Sara contesta al momento, informa precios en pesos, agenda en tu Google Calendar y cobra el anticipo para que la cita quede en firme.',
        bullets: [
          { title: 'Responde como se habla en México', body: 'Tuteo natural, sin sonar a robot ni a call center de otro país.' },
          { title: 'Cobra el anticipo en pesos', body: 'Link de pago en el mismo chat. La cita queda apartada y pagada.' },
          { title: 'Tu agenda de siempre', body: 'Sara agenda en el Google Calendar que tu clínica ya usa. Sin migrar nada.' },
        ],
        dialect: {
          title: 'Habla como tu&nbsp;paciente',
          body: 'Sara adapta el registro al país de la clínica: en México tutea y usa el vocabulario local. El paciente siente que le contesta la recepción, no un bot genérico entrenado en otro español.',
        },
        price: {
          title: 'Precio para&nbsp;México',
          body: `El plan arranca en ${PRICE_MX.display} ${PRICE_UNIT} con todo incluido y sin comisión por cita. Es un piso: el número final depende de cuántas sucursales tengas, y te lo damos exacto en la demo.`,
        },
        faq: [
          { q: '¿Cuánto cuesta Sara en México?', a: `Desde ${PRICE_MX.display} ${PRICE_UNIT}, todo incluido y sin comisión por cita. El precio final depende de las sucursales; en la demo te pasamos el exacto.` },
          { q: '¿Sara cobra en pesos mexicanos?', a: 'Sí. El anticipo se cobra con un link de pago dentro del chat, en la moneda de tu clínica.' },
          { q: '¿Tengo que cambiar mi agenda o mi software?', a: 'No. Sara lee y escribe en el Google Calendar que ya usas. No hay migración ni sistema nuevo que aprender.' },
          { q: '¿Atiende WhatsApp e Instagram a la vez?', a: 'Sí, los dos canales, las 24 horas, con la información y el tono de tu clínica. Si algo se sale de lo que sabe, lo deriva a tu equipo con el contexto completo.' },
        ],
      },
      en: {
        metaTitle: 'Sara AI in Mexico: the AI receptionist for clinics',
        metaDescription: `Sara answers WhatsApp and Instagram for clinics in Mexico around the clock: quotes prices, books into your Google Calendar and collects the deposit in pesos. From ${PRICE_MX.display} per location / month.`,
        eyebrow: 'Sara AI in Mexico',
        title: 'The front desk that answers at 11 pm, in Mexico&nbsp;too.',
        lead: 'Mexican clinics get the enquiry on WhatsApp or Instagram after the front desk has gone home. Sara answers on the spot, quotes prices in pesos, books into your Google Calendar and collects the deposit so the appointment is locked in.',
        bullets: [
          { title: 'Speaks like Mexico speaks', body: 'Natural local Spanish, not a generic bot or an offshore call center.' },
          { title: 'Collects the deposit in pesos', body: 'Payment link inside the chat. The slot is reserved and paid.' },
          { title: 'Your same calendar', body: 'Sara books into the Google Calendar your clinic already uses. No migration.' },
        ],
        dialect: {
          title: 'Speaks like your&nbsp;patient',
          body: 'Sara adapts its register to the clinic’s country: in Mexico it uses local phrasing and vocabulary. Patients feel the front desk answered, not a generic bot trained on someone else’s Spanish.',
        },
        price: {
          title: 'Pricing for&nbsp;Mexico',
          body: `Plans start at ${PRICE_MX.display} per location / month, everything included, no per-appointment commission. That’s a floor: the final number depends on your locations, and we’ll give you the exact one in the demo.`,
        },
        faq: [
          { q: 'How much does Sara cost in Mexico?', a: `From ${PRICE_MX.display} per location per month, everything included, no per-appointment commission. The final price depends on locations; you get the exact number in the demo.` },
          { q: 'Does Sara charge in Mexican pesos?', a: 'Yes. The deposit is collected with a payment link inside the chat, in your clinic’s currency.' },
          { q: 'Do I have to change my calendar or software?', a: 'No. Sara reads and writes to the Google Calendar you already use. No migration, no new system to learn.' },
          { q: 'Does it cover WhatsApp and Instagram at the same time?', a: 'Yes, both channels, around the clock, with your clinic’s information and tone. Anything outside what it knows gets handed to your team with full context.' },
        ],
      },
    },
  },
  {
    slug: 'colombia',
    name: { es: 'Colombia', en: 'Colombia' },
    copy: {
      es: {
        metaTitle: 'Sara AI en Colombia: IA que responde WhatsApp y confirma citas',
        metaDescription: 'Sara atiende el WhatsApp e Instagram de clínicas en Colombia las 24 horas: responde, agenda en tu Google Calendar, cobra el anticipo y baja las ausencias con confirmación automática.',
        eyebrow: 'Sara AI en Colombia',
        title: 'Menos ausencias, agenda llena, sin sumar&nbsp;recepción.',
        lead: 'En Colombia la consulta entra por WhatsApp a cualquier hora, y la cita sin confirmar se convierte en silla vacía. Sara responde al momento, agenda en tu Google Calendar, cobra el anticipo y confirma cada cita sin que nadie levante el teléfono.',
        bullets: [
          { title: 'Confirma y recuerda sola', body: 'Recordatorio y confirmación automáticos por WhatsApp. La ausencia baja porque la cita llega recordada y pagada.' },
          { title: 'Cobra el anticipo al reservar', body: 'Link de pago en el mismo chat. El que aparta con plata, llega.' },
          { title: 'Tu agenda de siempre', body: 'Sara agenda en el Google Calendar que tu clínica ya usa. Sin migrar nada.' },
        ],
        dialect: {
          title: 'Habla como tu&nbsp;paciente',
          body: 'Sara adapta el registro al país de la clínica: en Colombia escribe con el tuteo y el vocabulario local. El paciente siente que le contesta la recepción, no un bot genérico.',
        },
        price: {
          title: 'Precio para&nbsp;Colombia',
          body: 'Un plan con todo incluido y sin comisión por cita, ajustado al país y a cuántas sedes tengas. Pide el número exacto en la demo: sale con tu propia clínica cargada.',
        },
        faq: [
          { q: '¿Cómo baja Sara las ausencias?', a: 'Con tres capas: el anticipo cobrado al reservar, el recordatorio automático y la confirmación por WhatsApp. Y si alguien cancela, la lista de espera ofrece el hueco a otro paciente.' },
          { q: '¿Cuánto cuesta Sara en Colombia?', a: 'El plan se ajusta al país y a la cantidad de sedes, con todo incluido y sin comisión por cita. En la demo te damos el número exacto para tu clínica.' },
          { q: '¿Tengo que cambiar mi agenda o mi software?', a: 'No. Sara lee y escribe en el Google Calendar que ya usas. No hay migración ni sistema nuevo que aprender.' },
          { q: '¿Sirve para clínicas con varias sedes?', a: 'Sí. Sara maneja la disponibilidad por sede y agenda en el calendario que corresponde, con los precios y horarios de cada una.' },
        ],
      },
      en: {
        metaTitle: 'Sara AI in Colombia: AI that answers WhatsApp and confirms appointments',
        metaDescription: 'Sara answers WhatsApp and Instagram for clinics in Colombia around the clock: replies, books into your Google Calendar, collects the deposit and lowers no-shows with automatic confirmation.',
        eyebrow: 'Sara AI in Colombia',
        title: 'Fewer no-shows, a full calendar, no extra&nbsp;staff.',
        lead: 'In Colombia the enquiry arrives on WhatsApp at any hour, and an unconfirmed appointment becomes an empty chair. Sara answers on the spot, books into your Google Calendar, collects the deposit and confirms every appointment without anyone picking up the phone.',
        bullets: [
          { title: 'Confirms and reminds on its own', body: 'Automatic WhatsApp reminders and confirmation. No-shows drop because every appointment arrives reminded and paid.' },
          { title: 'Collects the deposit at booking', body: 'Payment link inside the chat. Patients who pay to reserve, show up.' },
          { title: 'Your same calendar', body: 'Sara books into the Google Calendar your clinic already uses. No migration.' },
        ],
        dialect: {
          title: 'Speaks like your&nbsp;patient',
          body: 'Sara adapts its register to the clinic’s country: in Colombia it writes with local phrasing and vocabulary. Patients feel the front desk answered, not a generic bot.',
        },
        price: {
          title: 'Pricing for&nbsp;Colombia',
          body: 'One plan with everything included and no per-appointment commission, adjusted to your country and number of locations. Ask for the exact number in the demo: it comes with your own clinic loaded.',
        },
        faq: [
          { q: 'How does Sara lower no-shows?', a: 'Three layers: the deposit collected at booking, the automatic reminder, and WhatsApp confirmation. If someone cancels, the waitlist offers the slot to another patient.' },
          { q: 'How much does Sara cost in Colombia?', a: 'The plan adjusts to your country and number of locations, everything included, no per-appointment commission. You get the exact number for your clinic in the demo.' },
          { q: 'Do I have to change my calendar or software?', a: 'No. Sara reads and writes to the Google Calendar you already use. No migration, no new system to learn.' },
          { q: 'Does it work for clinics with several locations?', a: 'Yes. Sara handles availability per location and books into the right calendar, with each location’s prices and hours.' },
        ],
      },
    },
  },
  {
    slug: 'uruguay',
    name: { es: 'Uruguay', en: 'Uruguay' },
    copy: {
      es: {
        metaTitle: 'Sara AI en Uruguay: la IA que ya atiende clínicas uruguayas',
        metaDescription: 'Sara ya trabaja en Uruguay: en ViaLaser agenda 7 de cada 10 citas por WhatsApp, Instagram y la web. Atiende con voseo, agenda en tu Google Calendar y cobra la seña.',
        eyebrow: 'Sara AI en Uruguay',
        title: 'En Uruguay, Sara ya está&nbsp;trabajando.',
        lead: 'No es una promesa: ViaLaser tiene a Sara atendiendo su WhatsApp, Instagram y web en vivo, y 7 de cada 10 citas las agenda Sara. Atiende con voseo, agenda en el Google Calendar de la clínica y cobra la seña para que la cita quede confirmada.',
        bullets: [
          { title: 'Vosea como un uruguayo', body: 'Sara adapta el registro al país: escribe con voseo natural, no con un español neutro de manual.' },
          { title: 'Cobra la seña al reservar', body: 'Link de pago en el mismo chat. La cabina queda ocupada y paga.' },
          { title: 'Tu agenda de siempre', body: 'Sara agenda en el Google Calendar que tu clínica ya usa. Sin migrar nada.' },
        ],
        dialect: {
          title: 'Habla como tu&nbsp;paciente',
          body: 'El paciente uruguayo nota al instante un bot que tutea. Sara escribe con el voseo y el vocabulario del país, con la información y el tono de tu clínica.',
        },
        price: {
          title: 'Precio para&nbsp;Uruguay',
          body: 'Un plan con todo incluido y sin comisión por cita, ajustado al país y a cuántas sucursales tengas. Pedí el número exacto en la demo: sale con tu propia clínica cargada.',
        },
        proof: {
          body: 'ViaLaser (depilación láser) puso a Sara a atender su WhatsApp, Instagram y web. 114 conversaciones atendidas sin que recepción tocara nada y 7 de cada 10 citas agendadas por Sara.',
          cta: 'Ver el caso completo',
        },
        faq: [
          { q: '¿Sara ya funciona en alguna clínica de Uruguay?', a: 'Sí. ViaLaser tiene a Sara atendiendo en vivo su WhatsApp, Instagram y web: 7 de cada 10 citas las agenda Sara. Es el caso que publicamos con números reales.' },
          { q: '¿Sara escribe con voseo?', a: 'Sí. Adapta el registro al país de la clínica: en Uruguay vosea con naturalidad, con el vocabulario local.' },
          { q: '¿Cuánto cuesta Sara en Uruguay?', a: 'El plan se ajusta al país y a la cantidad de sucursales, con todo incluido y sin comisión por cita. En la demo te damos el número exacto para tu clínica.' },
          { q: '¿Tengo que cambiar mi agenda o mi software?', a: 'No. Sara lee y escribe en el Google Calendar que ya usás. No hay migración ni sistema nuevo que aprender.' },
        ],
      },
      en: {
        metaTitle: 'Sara AI in Uruguay: the AI already working in Uruguayan clinics',
        metaDescription: 'Sara already works in Uruguay: at ViaLaser it books 7 out of 10 appointments across WhatsApp, Instagram and the web. It writes in local voseo Spanish, books into your Google Calendar and collects the deposit.',
        eyebrow: 'Sara AI in Uruguay',
        title: 'In Uruguay, Sara is already on the&nbsp;job.',
        lead: 'Not a promise: ViaLaser has Sara answering its WhatsApp, Instagram and website live, and 7 out of 10 appointments are booked by Sara. It writes in local voseo Spanish, books into the clinic’s Google Calendar and collects the deposit so the appointment is confirmed.',
        bullets: [
          { title: 'Writes voseo like a local', body: 'Sara adapts its register to the country: natural Uruguayan Spanish, not textbook neutral.' },
          { title: 'Collects the deposit at booking', body: 'Payment link inside the chat. The slot is taken and paid.' },
          { title: 'Your same calendar', body: 'Sara books into the Google Calendar your clinic already uses. No migration.' },
        ],
        dialect: {
          title: 'Speaks like your&nbsp;patient',
          body: 'Uruguayan patients instantly notice a bot that gets the register wrong. Sara writes with the country’s voseo and vocabulary, with your clinic’s information and tone.',
        },
        price: {
          title: 'Pricing for&nbsp;Uruguay',
          body: 'One plan with everything included and no per-appointment commission, adjusted to your country and number of locations. Ask for the exact number in the demo: it comes with your own clinic loaded.',
        },
        proof: {
          body: 'ViaLaser (laser hair removal) put Sara on its WhatsApp, Instagram and website. 114 conversations handled without the front desk touching a thing, and 7 out of 10 appointments booked by Sara.',
          cta: 'See the full case',
        },
        faq: [
          { q: 'Is Sara already working in a clinic in Uruguay?', a: 'Yes. ViaLaser has Sara answering its WhatsApp, Instagram and website live: 7 out of 10 appointments are booked by Sara. It’s the case we publish with real numbers.' },
          { q: 'Does Sara write in voseo?', a: 'Yes. It adapts its register to the clinic’s country: in Uruguay it uses natural voseo with local vocabulary.' },
          { q: 'How much does Sara cost in Uruguay?', a: 'The plan adjusts to your country and number of locations, everything included, no per-appointment commission. You get the exact number for your clinic in the demo.' },
          { q: 'Do I have to change my calendar or software?', a: 'No. Sara reads and writes to the Google Calendar you already use. No migration, no new system to learn.' },
        ],
      },
    },
  },
];
