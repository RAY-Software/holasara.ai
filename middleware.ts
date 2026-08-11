import { rewrite, next } from '@vercel/edge';

// Vercel Edge Middleware — corre ANTES del filesystem (a diferencia de los `rewrites`
// de vercel.json, que son afterFiles y se saltean cuando la ruta ya tiene un archivo
// estático). Sirve el patrón konghq.com/?mode=agent: cualquier URL con ?mode=agent
// se reescribe a /agent (la vista Markdown para LLMs) preservando la URL en el browser.
export const config = {
  // Todo menos assets de Astro y archivos con extensión (no llevan ?mode=agent).
  matcher: '/((?!_astro/|.*\\.).*)',
};

export default function middleware(request: Request) {
  const url = new URL(request.url);
  if (url.pathname !== '/agent' && url.searchParams.get('mode') === 'agent') {
    url.pathname = '/agent';
    url.search = '';
    return rewrite(url);
  }
  return next();
}
