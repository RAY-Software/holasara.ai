// Modelo de precios público de Sara (fuente única de la página /precios).
//
// Decisión de rumbo (8-sep-2026, pedido de Alex, confirmado por Franco): el sitio vuelve
// a publicar precios, ahora transparentes y self-serve ("sin demo, empiezas hoy"). Revierte
// la política de "cero precios" de agosto 2026.
//
// El cobro es POR AGENDA (un calendario reservable = una agenda), no por sucursal. El precio
// de Sara baja por tramos de volumen: cada tramo fija el precio de las agendas que caen dentro
// de él, y las anteriores conservan el suyo (marginal, no retroactivo). Mia y Daniel son un
// monto fijo por cuenta, sin importar cuántas agendas o sucursales.
//
// OJO coherencia: el backend (clinic-platform) todavía da el piso viejo "US$400 por sucursal"
// por WhatsApp (ver src/lib/pricing.ts). Alinear ese número con este modelo vive en el backend,
// no acá.

/** Precio de entrada de Sara (plan Start, con tope mensual de conversaciones). USD/mes por agenda. */
export const SARA_START = 49;

/** Precio fijo de Mia y de Daniel. USD/mes por cuenta, no escala con las agendas. */
export const ADDON_MIA = 110;
export const ADDON_DANIEL = 110;

export interface Tier {
  /** Índice de la primera agenda del tramo (1-based). */
  from: number;
  /** Índice de la última agenda del tramo, o null para "y más". */
  to: number | null;
  /** Precio de cada agenda dentro de este tramo (Sara Full). USD/mes. */
  price: number;
}

/** Tramos por volumen de Sara Full. El precio es marginal: aplica a las agendas del tramo. */
export const SARA_TIERS: Tier[] = [
  { from: 1, to: 2, price: 129 },
  { from: 3, to: 5, price: 109 },
  { from: 6, to: 10, price: 89 },
  { from: 11, to: null, price: 69 },
];

/** Precio de la n-ésima agenda de Sara Full (según su tramo). */
export function tierPriceAt(index: number): number {
  for (const t of SARA_TIERS) {
    if (index >= t.from && (t.to === null || index <= t.to)) return t.price;
  }
  return SARA_TIERS[SARA_TIERS.length - 1].price;
}

/** Total mensual de Sara Full para n agendas (suma de cada agenda por su tramo). */
export function saraTotal(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) sum += tierPriceAt(i);
  return sum;
}

export interface CalcRow {
  agendas: number;
  /** Solo Sara (Full). */
  sara: number;
  /** Sara + Mia. */
  saraMia: number;
  /** Equipo completo (Sara + Mia + Daniel). */
  equipo: number;
  /** Costo promedio por agenda del equipo completo (redondeado). */
  perAgenda: number;
}

export function calcRow(n: number): CalcRow {
  const sara = saraTotal(n);
  const equipo = sara + ADDON_MIA + ADDON_DANIEL;
  return { agendas: n, sara, saraMia: sara + ADDON_MIA, equipo, perAgenda: Math.round(equipo / n) };
}

/** Filas de la tabla-calculadora (nº de agendas representativos). */
export const CALC_ROWS: CalcRow[] = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map(calcRow);

/** Formato de monto en USD, separador de miles con coma (formato del PDF). Sin símbolo. */
export const fmt = (n: number): string => n.toLocaleString('en-US');
