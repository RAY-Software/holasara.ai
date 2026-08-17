// Arquitectura de información del sitio. Fuente única para el mega menú (desktop
// + mobile), el footer y los índices. Cada feature es una página dedicada.

export interface FeatureLink {
  name: string;
  href: string;
  desc: string;
}

export interface FeatureGroup {
  label: string;
  items: FeatureLink[];
}

// Mega menú "Producto", agrupado por lo que hace Sara.
export const productGroups: FeatureGroup[] = [
  {
    label: 'Atiende',
    items: [
      { name: 'Conoce a Sara', href: '/sara', desc: 'La secretaria con IA, de punta a punta.' },
      { name: 'WhatsApp e Instagram 24/7', href: '/canales', desc: 'Responde donde te escriben, siempre.' },
      { name: 'Modo operador', href: '/operador', desc: 'Tu equipo le pide cosas por WhatsApp.' },
    ],
  },
  {
    label: 'Agenda',
    items: [
      { name: 'Reactivación y lista de espera', href: '/reactivacion', desc: 'Trae de vuelta a quien no vuelve, llena los huecos.' },
      { name: 'Agenda automática', href: '/agenda', desc: 'Agenda sola, recuerda y confirma, sin dobles reservas.' },
    ],
  },
  {
    label: 'Cobros',
    items: [
      { name: 'Anticipo y consulta', href: '/cobros', desc: 'Cobra antes de atender.' },
      { name: 'Gift cards', href: '/gift-cards', desc: 'Vende tratamientos por adelantado.' },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { name: 'Instagram con IA', href: '/instagram', desc: 'Publica y agenda a quien responde.' },
      { name: 'Reseñas', href: '/resenas', desc: 'Más reseñas de 5 estrellas, solas.' },
    ],
  },
];

// Mega menú "Negocios": para quién es Sara. Dos ejes, por industria y por
// tamaño (como GlossGenius). Piloto vivo: /negocios/depilacion-laser. El resto
// apunta a /demo hasta que se construya su página propia (ver TODO).
export const industryLinks: FeatureLink[] = [
  { name: 'Depilación láser', href: '/negocios/depilacion-laser', desc: 'La agenda llena entre sesiones, sin ausencias.' },
  { name: 'Medicina estética', href: '/negocios/medicina-estetica', desc: 'Consultas y tratamientos, cobrados por adelantado.' },
  { name: 'Odontología', href: '/negocios/odontologia', desc: 'Turnos que se confirman solos, sin recepción saturada.' },
  { name: 'Estética y spa', href: '/negocios/estetica-spa', desc: 'Reservas 24/7 por WhatsApp e Instagram.' },
];

export const sizeLinks: FeatureLink[] = [
  { name: 'Multi-local', href: '/negocios/multi-local', desc: 'Varias sedes, una sola Sara y todo en un panel.' },
  { name: 'Local único', href: '/negocios/local-unico', desc: 'Tu recepción, disponible las 24 horas.' },
  { name: 'Profesional independiente', href: '/negocios/independiente', desc: 'Atiende y agenda mientras estás con un paciente.' },
];

// Ítems top-level del nav (además de los mega menús "Producto" y "Negocios").
export const topLinks: FeatureLink[] = [
  { name: 'Casos', href: '/caso', desc: 'Clínicas reales con Sara.' },
  { name: 'Cómo funciona', href: '/implementacion', desc: 'Conectas tu calendario y listo.' },
  { name: 'Precios', href: '/precios', desc: 'Planes por país.' },
];
