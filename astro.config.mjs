// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Sitio de marketing de Sara — la recepción con IA para clínicas.
// Estático. Español (LATAM) como idioma principal; EN se puede sumar bajo /en más adelante.
export default defineConfig({
  site: 'https://holasara.ai',
  // /recordatorios se colapsó dentro de /agenda (la historia de recordar y
  // confirmar vive completa ahí). Mantenemos la URL viva apuntando al ancla.
  // El idioma se resuelve por prefijo (/es, /en). En prod, el Edge Middleware
  // (middleware.ts) redirige las URLs sin prefijo al idioma detectado (301).
  redirects: {
    '/recordatorios': '/es/agenda#recordatorios',
  },
  // Fuera del sitemap (evita errores de auditoría por URLs no indexables/redirigidas):
  //  - /agent: la vista Markdown para LLMs (noindex).
  //  - la raíz "/": el middleware la redirige (307) al idioma; la canónica es /es/.
  //  - /wa: el bridge de WhatsApp (noindex, redirige a wa.me).
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return !path.includes('/agent') && path !== '/' && !path.startsWith('/wa');
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
