// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Sitio de marketing de Sara — la recepción con IA para clínicas.
// Estático. Español (LATAM) como idioma principal; EN se puede sumar bajo /en más adelante.
export default defineConfig({
  site: 'https://holasara.ai',
  // /recordatorios (URL vieja) hoy apunta a la landing propia de recordatorios
  // (slug localizado, ver src/i18n/slugs.ts). Antes iba al ancla de /agenda.
  // El idioma se resuelve por prefijo (/es, /en). En prod, el Edge Middleware
  // (middleware.ts) redirige las URLs sin prefijo al idioma detectado (301).
  redirects: {
    '/recordatorios': '/es/recordatorio-de-citas-por-whatsapp',
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
