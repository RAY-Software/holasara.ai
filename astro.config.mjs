// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Sitio de marketing de Sara — la recepción con IA para clínicas.
// Estático. Español (LATAM) como idioma principal; EN se puede sumar bajo /en más adelante.
export default defineConfig({
  site: 'https://holasara.ai',
  vite: {
    plugins: [tailwindcss()],
  },
});
