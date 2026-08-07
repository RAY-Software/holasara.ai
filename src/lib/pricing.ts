// Piso de precio para México, vertical Health (clínicas). Es el mismo número que Sara da
// por WhatsApp desde el release 6.94.4 del backend, así que el sitio y el agente tienen
// que decir lo mismo: si acá dice otra cosa, el lead lo nota en el primer mensaje.
//
// Es un PISO ("desde"), no el precio final: el plan se arma por sucursal. La página lo
// dice explícitamente para no prometer de menos en clínicas grandes.
//
// Solo México a propósito — es el único mercado con campañas. El backend tiene un piso
// distinto para Argentina (US$250), pero mientras no haya campaña de AR no lo publicamos.
export interface PriceFloor {
  currency: string;
  amount: number;
  /** Formato listo para mostrar, sin el "desde". */
  display: string;
}

export const PRICE_MX: PriceFloor = { currency: 'USD', amount: 400, display: 'US$400' };

/** Unidad de facturación. Va al lado del número en todas las apariciones. */
export const PRICE_UNIT = 'por sucursal / mes';
