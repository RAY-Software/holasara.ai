import { rewrite, next } from '@vercel/edge';

// El 2º arg del middleware trae waitUntil (para tareas fire-and-forget que el
// runtime termina después de responder). Lo tipamos estructuralmente para no
// atarnos al nombre del tipo exportado por la versión de @vercel/edge.
type EdgeContext = { waitUntil(promise: Promise<unknown>): void };

// Vercel Edge Middleware — corre ANTES del filesystem. Tres trabajos:
//
//  0) Medición de scrapers de LLMs: cada request de un bot de IA conocido
//     (GPTBot, ClaudeBot, PerplexityBot, etc.) dispara un evento server-side a
//     GA4 vía Measurement Protocol. Es la ÚNICA forma de verlos: no ejecutan JS,
//     así que el gtag del navegador nunca los registra. Fire-and-forget con
//     waitUntil — no agrega latencia a la respuesta que recibe el bot.
//
//  1) Vista de agente (?mode=agent): cualquier URL con ?mode=agent se reescribe a
//     /agent (la vista Markdown para LLMs) preservando la URL.
//
//  2) i18n: el sitio vive bajo /es/* y /en/*. Una URL sin prefijo de idioma
//     (incluida la raíz y las URLs viejas indexadas, ej. /precios) se redirige al
//     idioma detectado — cookie `sara_lang` primero (respeta el switch manual),
//     si no, Accept-Language; default es. Mismo patrón que RAY-Website.

export const config = {
  // Todo menos assets de Astro y archivos con extensión...
  matcher: [
    '/((?!_astro/|.*\\.).*)',
    // ...salvo estos, que sumamos a propósito para contar el scraping del sitemap
    // y del robots (los LLMs los piden para descubrir todas tus URLs). El guard de
    // "path con extensión" más abajo los sirve tal cual, sin localizarlos.
    '/robots.txt',
    '/sitemap-index.xml',
    '/sitemap-0.xml',
  ],
};

const LOCALES = ['es', 'en'] as const;
const DEFAULT_LOCALE = 'es';
const COOKIE = 'sara_lang';

// Paths de primer nivel que NO se localizan (vistas técnicas / bridge / redirect
// estático de Astro). Se sirven tal cual.
const RESERVED = new Set(['agent', 'wa', 'recordatorios', 'api']);

// ─────────────────────────────────────────────────────────────────────────────
// Medición de crawlers de LLMs
// ─────────────────────────────────────────────────────────────────────────────

// GA4: el mismo stream que usa el sitio. El api_secret NO es público — se crea en
// GA4 → Admin → Data Streams → Measurement Protocol API secrets y se carga como env
// var en Vercel. Si falta, el tracking se saltea en silencio (nada se rompe).
const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID || 'G-NRN8H0WR62';
const GA4_API_SECRET = process.env.GA4_API_SECRET || '';

// Bots de IA conocidos. `purpose`:
//   train  → arma dataset de entrenamiento (te lee para "aprender")
//   search → indexa para el buscador/RAG del asistente (te lee para poder citarte)
//   user   → fetch en vivo porque un usuario preguntó algo AHORA y el modelo entró
// El `user` es el más valioso: significa que ya apareciste en una conversación real.
const LLM_BOTS: ReadonlyArray<{ re: RegExp; bot: string; vendor: string; purpose: string }> = [
  // OpenAI
  { re: /GPTBot/i, bot: 'GPTBot', vendor: 'OpenAI', purpose: 'train' },
  { re: /OAI-SearchBot/i, bot: 'OAI-SearchBot', vendor: 'OpenAI', purpose: 'search' },
  { re: /ChatGPT-User/i, bot: 'ChatGPT-User', vendor: 'OpenAI', purpose: 'user' },
  // Anthropic
  { re: /ClaudeBot/i, bot: 'ClaudeBot', vendor: 'Anthropic', purpose: 'train' },
  { re: /Claude-SearchBot/i, bot: 'Claude-SearchBot', vendor: 'Anthropic', purpose: 'search' },
  { re: /Claude-User/i, bot: 'Claude-User', vendor: 'Anthropic', purpose: 'user' },
  { re: /anthropic-ai/i, bot: 'anthropic-ai', vendor: 'Anthropic', purpose: 'train' },
  // Perplexity
  { re: /PerplexityBot/i, bot: 'PerplexityBot', vendor: 'Perplexity', purpose: 'search' },
  { re: /Perplexity-User/i, bot: 'Perplexity-User', vendor: 'Perplexity', purpose: 'user' },
  // Google (Gemini / Vertex / entrenamiento)
  { re: /Google-Extended/i, bot: 'Google-Extended', vendor: 'Google', purpose: 'train' },
  { re: /GoogleOther/i, bot: 'GoogleOther', vendor: 'Google', purpose: 'search' },
  // Microsoft Copilot
  { re: /BingBot/i, bot: 'BingBot', vendor: 'Microsoft', purpose: 'search' },
  // Otros que alimentan modelos
  { re: /CCBot/i, bot: 'CCBot', vendor: 'CommonCrawl', purpose: 'train' },
  { re: /Bytespider/i, bot: 'Bytespider', vendor: 'ByteDance', purpose: 'train' },
  { re: /Amazonbot/i, bot: 'Amazonbot', vendor: 'Amazon', purpose: 'search' },
  { re: /Applebot-Extended/i, bot: 'Applebot-Extended', vendor: 'Apple', purpose: 'train' },
  { re: /Applebot/i, bot: 'Applebot', vendor: 'Apple', purpose: 'search' },
  { re: /meta-externalagent/i, bot: 'Meta-ExternalAgent', vendor: 'Meta', purpose: 'train' },
  { re: /cohere-ai/i, bot: 'cohere-ai', vendor: 'Cohere', purpose: 'train' },
  { re: /YouBot/i, bot: 'YouBot', vendor: 'You.com', purpose: 'search' },
  { re: /DuckAssistBot/i, bot: 'DuckAssistBot', vendor: 'DuckDuckGo', purpose: 'search' },
  { re: /MistralAI-User/i, bot: 'MistralAI-User', vendor: 'Mistral', purpose: 'user' },
];

function detectLLMBot(ua: string) {
  if (!ua) return null;
  for (const b of LLM_BOTS) if (b.re.test(ua)) return b;
  return null;
}

// Envía el evento a GA4 sin bloquear la respuesta. Devuelve la promesa para
// pasársela a context.waitUntil (el runtime la termina después de responder).
function sendCrawlEvent(
  bot: { bot: string; vendor: string; purpose: string },
  url: URL,
  ua: string
): Promise<unknown> {
  if (!GA4_API_SECRET) return Promise.resolve(); // no configurado → no-op

  const endpoint =
    `https://www.google-analytics.com/mp/collect` +
    `?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`;

  // client_id estable por bot: evita que GA4 cuente cada hit como un "usuario"
  // nuevo. No es un humano, así que un id sintético y determinístico alcanza.
  const clientId = `llmbot.${bot.bot.toLowerCase()}`;

  const body = JSON.stringify({
    client_id: clientId,
    // non_personalized_ads + un solo evento con nombre propio: no ensucia sesiones
    // ni usuarios de los reportes normales. Filtralo/segmentalo por event_name.
    events: [
      {
        name: 'llm_crawl',
        params: {
          bot: bot.bot,
          vendor: bot.vendor,
          crawl_purpose: bot.purpose,
          page_path: url.pathname,
          page_location: url.href,
          user_agent: ua.slice(0, 100),
          engagement_time_msec: '1',
        },
      },
    ],
  });

  return fetch(endpoint, { method: 'POST', body }).catch(() => {
    // Nunca queremos que un fallo de GA afecte lo que ve el bot.
  });
}

function detectLocale(request: Request): string {
  // 1) Preferencia guardada (switch manual o visita previa).
  const cookie = request.headers.get('cookie') || '';
  const m = cookie.match(/(?:^|;\s*)sara_lang=(es|en)\b/);
  if (m) return m[1];

  // 2) Accept-Language: primer idioma con calidad más alta que matchee es/en.
  const header = request.headers.get('accept-language') || '';
  const primary = header.split(',')[0]?.trim().toLowerCase() || '';
  if (primary.startsWith('en')) return 'en';
  if (primary.startsWith('es')) return 'es';

  return DEFAULT_LOCALE;
}

export default function middleware(request: Request, context: EdgeContext) {
  const url = new URL(request.url);
  const { pathname } = url;

  // 0) Medición de scrapers de LLMs — observa, no altera. Corre para cualquier
  //    path del matcher (páginas, sitemap, robots) antes de cualquier redirect.
  const ua = request.headers.get('user-agent') || '';
  const bot = detectLLMBot(ua);
  if (bot) context.waitUntil(sendCrawlEvent(bot, url, ua));

  // Paths técnicos con extensión (sitemap-*.xml, robots.txt): servir tal cual.
  // Ya los contamos arriba; acá solo evitamos localizarlos o redirigirlos.
  if (/\.[a-z0-9]+$/i.test(pathname)) return next();

  // 1) Vista de agente — preserva el path en el browser.
  if (pathname !== '/agent' && url.searchParams.get('mode') === 'agent') {
    url.pathname = '/agent';
    url.search = '';
    return rewrite(url);
  }

  const firstSegment = pathname.split('/')[1] || '';

  // Ya tiene prefijo de idioma → seguir. Fijamos la cookie al idioma actual
  // SIEMPRE (así el switch manual ES/EN persiste y sobreescribe el anterior).
  if ((LOCALES as readonly string[]).includes(firstSegment)) {
    const res = next();
    res.headers.set('Vary', 'Accept-Language');
    res.headers.append(
      'Set-Cookie',
      `${COOKIE}=${firstSegment}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`
    );
    return res;
  }

  // Reservados (agent, wa, recordatorios, api) → no localizar.
  if (RESERVED.has(firstSegment)) return next();

  // Sin prefijo → redirigir al idioma detectado, preservando path y query.
  const locale = detectLocale(request);
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  const redirect = new Response(null, {
    status: 307,
    headers: {
      Location: url.toString(),
      Vary: 'Accept-Language',
      'Set-Cookie': `${COOKIE}=${locale}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`,
    },
  });
  return redirect;
}
