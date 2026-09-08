// Países del selector de WhatsApp del Free Trial. Alineado 1:1 con lib/phone.js del backend
// (RAY-Software/ray-clinics): mismos ISO, dial y largos nacionales, así el número que valida el form
// es el mismo que normaliza y acepta createDemo. Agregar un país acá exige agregarlo también allá.
// `lengths` = largos válidos del número NACIONAL (sin el dial). AR lleva el 9 de celular al normalizar.
export type Country = { iso: string; name: string; dial: string; flag: string; lengths: number[] };

// Orden: mercados principales primero (AR, MX), luego el resto alfabético.
export const COUNTRIES: Country[] = [
  { iso: 'AR', name: 'Argentina', dial: '54', flag: '🇦🇷', lengths: [10] },
  { iso: 'MX', name: 'México', dial: '52', flag: '🇲🇽', lengths: [10] },
  { iso: 'BR', name: 'Brasil', dial: '55', flag: '🇧🇷', lengths: [10, 11] },
  { iso: 'CL', name: 'Chile', dial: '56', flag: '🇨🇱', lengths: [9] },
  { iso: 'CO', name: 'Colombia', dial: '57', flag: '🇨🇴', lengths: [10] },
  { iso: 'ES', name: 'España', dial: '34', flag: '🇪🇸', lengths: [9] },
  { iso: 'US', name: 'Estados Unidos', dial: '1', flag: '🇺🇸', lengths: [10] },
  { iso: 'PY', name: 'Paraguay', dial: '595', flag: '🇵🇾', lengths: [9] },
  { iso: 'PE', name: 'Perú', dial: '51', flag: '🇵🇪', lengths: [9] },
  { iso: 'UY', name: 'Uruguay', dial: '598', flag: '🇺🇾', lengths: [8, 9] },
];

export const COUNTRY_BY_ISO: Record<string, Country> = Object.fromEntries(COUNTRIES.map((c) => [c.iso, c]));
