import { rewrite, next } from '@vercel/edge';

// Vercel Edge Middleware — corre ANTES del filesystem. Dos trabajos:
//
//  1) Vista de agente (konghq.com/?mode=agent): cualquier URL con ?mode=agent se
//     reescribe a /agent (la vista Markdown para LLMs) preservando la URL.
//
//  2) i18n: el sitio vive bajo /es/* y /en/*. Una URL sin prefijo de idioma
//     (incluida la raíz y las URLs viejas indexadas, ej. /precios) se redirige al
//     idioma detectado — cookie `sara_lang` primero (respeta el switch manual),
//     si no, Accept-Language; default es. Mismo patrón que RAY-Website.

export const config = {
  // Todo menos assets de Astro y archivos con extensión.
  matcher: '/((?!_astro/|.*\\.).*)',
};

const LOCALES = ['es', 'en'] as const;
const DEFAULT_LOCALE = 'es';
const COOKIE = 'sara_lang';

// Paths de primer nivel que NO se localizan (vistas técnicas / bridge / redirect
// estático de Astro). Se sirven tal cual.
const RESERVED = new Set(['agent', 'wa', 'recordatorios', 'api']);

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

export default function middleware(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

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
