// Proxy de autocompletado de clínicas.
//
// El navegador le pregunta a este endpoint, y este endpoint le pregunta a Google. La
// key nunca sale del servidor, así que no hay nada que copiar del HTML. Reemplaza al
// widget de Places, que exigía la key en el cliente.
//
// Este endpoint es público por necesidad: lo llaman visitantes anónimos, y no hay
// ningún secreto que el navegador pueda guardar. En vez de autenticar, se acota —
// origen, tamaño de la consulta, frecuencia por IP y cache.
import { PLACES_API_KEY } from './_key.js';

const ORIGENES = new Set(['https://holasara.ai', 'https://www.holasara.ai']);

// Estado por instancia. Serverless recicla instancias, así que esto no es un límite
// global exacto — es un freno barato contra el abuso obvio, no una cuota contable.
const golpes = new Map(); // ip -> timestamps
const cache = new Map();  // query -> { hasta, datos }

const VENTANA_MS = 60_000;
const MAX_POR_VENTANA = 20;
const CACHE_MS = 5 * 60_000;
const MAX_CACHE = 500;

function limitado(ip) {
  const ahora = Date.now();
  const previos = (golpes.get(ip) || []).filter((t) => ahora - t < VENTANA_MS);
  previos.push(ahora);
  golpes.set(ip, previos);
  if (golpes.size > 5000) golpes.clear(); // techo de memoria
  return previos.length > MAX_POR_VENTANA;
}

export default async function handler(req, res) {
  const origen = req.headers.origin;
  if (origen && ORIGENES.has(origen)) {
    res.setHeader('Access-Control-Allow-Origin', origen);
    res.setHeader('Vary', 'Origin');
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'GET') return res.status(405).json({ error: 'method_not_allowed' });

  const q = String(req.query?.q ?? '').trim();
  // Menos de 3 caracteres no da sugerencias útiles y multiplica las llamadas facturables.
  if (q.length < 3 || q.length > 120) return res.status(200).json({ sugerencias: [] });

  if (!PLACES_API_KEY) {
    console.error('[places] sin key: el build no la inyectó');
    return res.status(503).json({ error: 'no_configurado', sugerencias: [] });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'desconocida';
  if (limitado(ip)) return res.status(429).json({ error: 'demasiadas_consultas', sugerencias: [] });

  const clave = q.toLowerCase();
  const enCache = cache.get(clave);
  if (enCache && enCache.hasta > Date.now()) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json({ sugerencias: enCache.datos });
  }

  try {
    const r = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': PLACES_API_KEY,
        // Pedimos solo lo que se pinta en la lista. Menos payload y menos datos de
        // terceros dando vueltas por nuestro servidor.
        'X-Goog-FieldMask':
          'suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat',
      },
      body: JSON.stringify({
        input: q,
        includedRegionCodes: ['mx'],
        languageCode: 'es',
      }),
    });

    if (!r.ok) {
      const detalle = await r.text().catch(() => '');
      console.error(`[places] google respondió ${r.status}: ${detalle.slice(0, 300)}`);
      return res.status(502).json({ error: 'upstream', sugerencias: [] });
    }

    const json = await r.json();
    const sugerencias = (json.suggestions || [])
      .map((s) => s.placePrediction)
      .filter(Boolean)
      .map((p) => ({
        texto: p.text?.text ?? '',
        principal: p.structuredFormat?.mainText?.text ?? '',
        secundario: p.structuredFormat?.secondaryText?.text ?? '',
      }))
      .filter((s) => s.texto);

    if (cache.size > MAX_CACHE) cache.clear();
    cache.set(clave, { hasta: Date.now() + CACHE_MS, datos: sugerencias });

    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json({ sugerencias });
  } catch (err) {
    console.error(`[places] error: ${err.message}`);
    return res.status(502).json({ error: 'upstream', sugerencias: [] });
  }
}
