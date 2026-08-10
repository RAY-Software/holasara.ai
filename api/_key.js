// Placeholder. El valor real lo escribe el workflow de deploy antes de `vercel build`,
// desde el secret PLACES_API_KEY de GitHub.
//
// Por qué acá y no en una env var: las funciones de Vercel leen su entorno de runtime
// desde la configuración del proyecto en Vercel, que no controlamos (cuenta de Franco).
// Lo que sí controlamos es el build, que corre en nuestro runner — así que la key viaja
// dentro del bundle. El código de una función no se sirve al navegador: queda del lado
// del servidor igual.
//
// Vacío en el repo a propósito: si alguien buildea local, compila y el autocompletado
// simplemente no anda. Nunca commitear el valor real acá.
export const PLACES_API_KEY = '';
