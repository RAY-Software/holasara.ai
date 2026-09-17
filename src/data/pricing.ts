// Modelo de precios público de Sara (fuente única de la página /precios).
//
// Decisión de rumbo (17-sep-2026, esquema de Alex, Head of Sales, confirmado por Franco):
// el sitio pasa al modelo "plan base + catálogo de add-ons", con precios en MXN para el
// mercado mexicano (/es) y su equivalente en USD para el sitio de producto US (/en).
// Reemplaza el modelo anterior (tramos por agenda en USD, Mia/Daniel a US$110).
//
// TRES UNIDADES DE COBRO (la parte delicada de explicar):
//   - 'agenda' → por calendario reservable. El plan base incluye 1; cada agenda extra se cobra
//                aparte y baja por volumen.
//   - 'local'  → por sucursal. El trabajo pasa en el mostrador de cada local (caja, inventario,
//                la ficha de Google de ese local), así que se cobra en cada uno.
//   - 'marca'  → una sola vez para toda la cuenta, tengas una sucursal o mil (web, Instagram,
//                contabilidad, voz, API). Es de la marca entera, no de un local.
// La regla que lo vuelve simple para el dueño: "lo que pasa dentro de cada local se cobra por
// local; lo que es de toda la marca se paga una sola vez". La UI muestra esto como un badge por
// add-on, no como una columna que obligue a calcular.
//
// PRECIOS: se guardan MXN y USD explícitos por ítem, tomados del deck de Alex (conversión
// nominal ~17 MXN/USD, pero redondeada distinto en cada ítem). No los derivamos con una
// multiplicación para no desincronizarnos de lo que Ventas ya comunica.
//
// SUPUESTO A CONFIRMAR CON ALEX: los tramos de "calendario adicional" ($199 → $179 desde 5 →
// $159 desde 10) se interpretan como marginales sobre los calendarios EXTRA (más allá del que
// incluye el plan base). Si Alex los quiso sobre el total de calendarios, ajustar CALENDAR_TIERS.

/** Descuento anual: pagas 10 meses y usas 12 (2 meses gratis). Aplica a todo. */
export const ANNUAL_MONTHS_CHARGED = 10;
/** Monto mensual equivalente cuando se factura anual (con el descuento aplicado). */
export const annualMonthly = (monthly: number): number => Math.round((monthly * ANNUAL_MONTHS_CHARGED) / 12);

export type Currency = 'MXN' | 'USD';

/** Un precio en las dos monedas. Se elige la columna según el idioma de la página. */
export interface Price {
  mxn: number;
  usd: number;
}

/** Toma el monto de la moneda pedida. */
export const amount = (p: Price, currency: Currency): number => (currency === 'MXN' ? p.mxn : p.usd);

// ── Plan base: 1 agenda + Sara ──
export const BASE_PRICE: Price = { mxn: 499, usd: 29 };

// ── Calendario adicional (unidad 'agenda'): tramos marginales sobre los calendarios extra ──
export interface CalendarTier {
  /** Índice del primer calendario EXTRA del tramo (1-based; el 1º extra es el 2º calendario). */
  from: number;
  /** Índice del último calendario extra del tramo, o null para "y más". */
  to: number | null;
  price: Price;
}

export const CALENDAR_TIERS: CalendarTier[] = [
  { from: 1, to: 4, price: { mxn: 199, usd: 12 } },
  { from: 5, to: 9, price: { mxn: 179, usd: 11 } },
  { from: 10, to: null, price: { mxn: 159, usd: 9 } },
];

/** Precio del n-ésimo calendario extra (según su tramo), en la moneda pedida. */
export function calendarExtraPriceAt(indexExtra: number, currency: Currency): number {
  for (const t of CALENDAR_TIERS) {
    if (indexExtra >= t.from && (t.to === null || indexExtra <= t.to)) return amount(t.price, currency);
  }
  return amount(CALENDAR_TIERS[CALENDAR_TIERS.length - 1].price, currency);
}

/** Total mensual de la cuenta: plan base + (agendas − 1) calendarios extra, marginal. */
export function accountTotal(agendas: number, currency: Currency): number {
  let sum = amount(BASE_PRICE, currency);
  for (let i = 1; i <= agendas - 1; i++) sum += calendarExtraPriceAt(i, currency);
  return sum;
}

// ── Catálogo de add-ons ──
export type Unit = 'agenda' | 'local' | 'marca';
export type Category = 'capacidad' | 'operacion' | 'crecimiento' | 'dinero';

export interface AddOn {
  /** Id estable; la copy (nombre/descripción) vive en el dict de la página, por idioma. */
  id: string;
  category: Category;
  unit: Unit;
  price: Price;
}

/**
 * Los 11 add-ons del esquema de Alex, en orden de catálogo por categoría.
 * El "Calendario adicional" NO va acá: es la unidad 'agenda' del plan base y vive en la
 * calculadora, no en el catálogo de add-ons.
 */
export const ADDONS: AddOn[] = [
  // Capacidad
  { id: 'voz', category: 'capacidad', unit: 'marca', price: { mxn: 690, usd: 41 } },
  // Operación
  { id: 'caja', category: 'operacion', unit: 'local', price: { mxn: 290, usd: 17 } },
  { id: 'inventario', category: 'operacion', unit: 'local', price: { mxn: 290, usd: 17 } },
  // Crecimiento
  { id: 'instagram', category: 'crecimiento', unit: 'marca', price: { mxn: 790, usd: 46 } },
  { id: 'seo', category: 'crecimiento', unit: 'marca', price: { mxn: 890, usd: 52 } },
  { id: 'resenas', category: 'crecimiento', unit: 'local', price: { mxn: 190, usd: 11 } },
  { id: 'soporte', category: 'crecimiento', unit: 'marca', price: { mxn: 390, usd: 23 } },
  { id: 'api', category: 'crecimiento', unit: 'marca', price: { mxn: 690, usd: 41 } },
  // Dinero
  { id: 'finanzas', category: 'dinero', unit: 'marca', price: { mxn: 590, usd: 35 } },
  { id: 'giftcards', category: 'dinero', unit: 'marca', price: { mxn: 190, usd: 11 } },
];

/** Orden de las categorías en la página. */
export const CATEGORY_ORDER: Category[] = ['capacidad', 'operacion', 'crecimiento', 'dinero'];

/** Add-ons de una categoría, en el orden de ADDONS. */
export const addonsByCategory = (c: Category): AddOn[] => ADDONS.filter((a) => a.category === c);

// ── Formato ──
/** Separador de miles con coma (1,699). Sin símbolo: el símbolo lo pone la página. */
export const fmt = (n: number): string => n.toLocaleString('en-US');

/** Símbolo delante del número según la moneda: "$" para MXN, "US$" para USD. */
export const symbol = (currency: Currency): string => (currency === 'MXN' ? '$' : 'US$');

/** Monto listo para mostrar, con símbolo. Ej: sara(BASE_PRICE,'MXN') → "$499". */
export const withSymbol = (p: Price, currency: Currency): string => symbol(currency) + fmt(amount(p, currency));
