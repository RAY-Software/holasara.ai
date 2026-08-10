// Sonda temporal: confirma que Vercel toma funciones serverless de api/ en este
// proyecto, que es estático (astro build sin adapter) y se despliega con
// `vercel build --prod` + `vercel deploy --prebuilt` desde el runner de GitHub.
//
// Si responde, el endpoint real de Places puede vivir acá y la key de Google se
// queda del lado del servidor, sin viajar nunca al navegador.
//
// Borrar en cuanto esté verificado.
export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    node: process.version,
    // Confirma que el bundle de la función puede leer variables SIN prefijo PUBLIC_
    // (las PUBLIC_ se hornean en el cliente; estas no salen del servidor).
    vePrivadas: typeof process.env.PLACES_API_KEY === 'string',
  });
}
