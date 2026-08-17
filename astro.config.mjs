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
  redirects: {
    '/recordatorios': '/agenda#recordatorios',
  },
  // La /agent es la vista para LLMs (noindex) → fuera del sitemap.
  integrations: [sitemap({ filter: (page) => !page.includes('/agent') })],
  vite: {
    plugins: [tailwindcss()],
  },
});
