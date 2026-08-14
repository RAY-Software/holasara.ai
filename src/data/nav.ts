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
      { name: 'Agenda automática', href: '/agenda', desc: 'Agenda sola, sin dobles reservas.' },
      { name: 'Recordatorios y confirmación', href: '/recordatorios', desc: 'Menos ausencias, sin llamar.' },
      { name: 'Lista de espera y reactivación', href: '/reactivacion', desc: 'Llena huecos y trae de vuelta.' },
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

// Ítems top-level del nav (además del mega menú "Producto").
export const topLinks: FeatureLink[] = [
  { name: 'Casos', href: '/caso', desc: 'Clínicas reales con Sara.' },
  { name: 'Implementación', href: '/implementacion', desc: 'Conectas tu calendario y listo.' },
  { name: 'Precios', href: '/precios', desc: 'Planes por país.' },
  {
    name: 'Escáner de Google',
    // `product=servicios` le dice al grader que este visitante viene de Sara:
    // persiste cookie y todos sus CTAs de demo apuntan a holasara.ai/demo
    // en vez del sitio de Food. NO quitar el parámetro.
    href: 'https://grader.rayapp.ai/?product=servicios&utm_source=header&utm_medium=website&utm_campaign=holasara',
    desc: 'Mira cómo aparece tu negocio en Google, gratis.',
  },
];
