import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { localePath, alternatePath, localizedStaticPaths } from './config.ts';
import { localizedSlugs, slugKeyOf } from './slugs.ts';

const pagesDir = new URL('../pages/[lang]/', import.meta.url);

test('localePath prefija paths comunes y respeta externos', () => {
  assert.equal(localePath('/demo', 'es'), '/es/demo');
  assert.equal(localePath('/demo', 'en'), '/en/demo');
  assert.equal(localePath('/', 'en'), '/en');
  assert.equal(localePath('https://wa.me/1', 'en'), 'https://wa.me/1');
  assert.equal(localePath('#faq', 'en'), '#faq');
});

test('localePath traduce slugs localizados en ambas direcciones', () => {
  assert.equal(localePath('/recordatorio-de-citas-por-whatsapp', 'en'), '/en/appointment-reminders');
  assert.equal(localePath('/appointment-reminders', 'es'), '/es/recordatorio-de-citas-por-whatsapp');
  assert.equal(localePath('/llamadas', 'en'), '/en/medical-answering-service');
  assert.equal(localePath('/llamadas', 'es'), '/es/llamadas');
  assert.equal(localePath('/medical-answering-service', 'es'), '/es/llamadas');
  assert.equal(localePath('/integraciones#whatsapp', 'en'), '/en/integrations#whatsapp');
  assert.equal(localePath('/dental-seo?ref=nav', 'es'), '/es/seo-dental?ref=nav');
});

test('localePath: bordes (sin barra inicial, barra final, subpaths, mayúsculas, vacío)', () => {
  assert.equal(localePath('llamadas', 'en'), '/en/medical-answering-service');
  assert.equal(localePath('/llamadas/', 'en'), '/en/medical-answering-service/');
  assert.equal(localePath('/llamadas/algo', 'en'), '/en/medical-answering-service/algo');
  assert.equal(localePath('/negocios/depilacion-laser', 'en'), '/en/negocios/depilacion-laser');
  assert.equal(localePath('/equipo/mia', 'es'), '/es/equipo/mia');
  assert.equal(localePath('/sara-vs-cloudia', 'en'), '/en/sara-vs-cloudia');
  assert.equal(localePath('/LLAMADAS', 'en'), '/en/LLAMADAS');
  assert.equal(localePath('', 'en'), '/en');
  assert.equal(slugKeyOf(''), undefined);
  assert.equal(slugKeyOf('demo'), undefined);
});

test('alternatePath empareja la página actual con el otro idioma (hreflang y switch)', () => {
  assert.equal(alternatePath('/es/llamadas', 'en'), '/en/medical-answering-service');
  assert.equal(alternatePath('/en/medical-answering-service', 'es'), '/es/llamadas');
  assert.equal(alternatePath('/en/appointment-reminders', 'es'), '/es/recordatorio-de-citas-por-whatsapp');
  assert.equal(alternatePath('/es/negocios/depilacion-laser', 'en'), '/en/negocios/depilacion-laser');
  assert.equal(alternatePath('/en/aeo', 'es'), '/es/aeo');
  assert.equal(alternatePath('/es', 'en'), '/en');
  assert.equal(alternatePath('/es/', 'en'), '/en');
  assert.equal(alternatePath('/es', 'es'), '/es');
});

test('localizedStaticPaths genera un path por idioma con el param de la key', () => {
  assert.deepEqual(localizedStaticPaths('reminders'), [
    { params: { lang: 'es', reminders: 'recordatorio-de-citas-por-whatsapp' } },
    { params: { lang: 'en', reminders: 'appointment-reminders' } },
  ]);
});

test('slugs localizados: únicos entre keys y sin chocar con otras rutas de [lang]/', () => {
  const seen = new Map<string, string>();
  for (const [key, s] of Object.entries(localizedSlugs)) {
    for (const slug of new Set([s.es, s.en])) {
      assert.equal(seen.get(slug), undefined, `slug "${slug}" repetido en ${seen.get(slug)} y ${key}`);
      seen.set(slug, key);
    }
  }
  const staticPages = readdirSync(pagesDir)
    .filter((f) => f.endsWith('.astro') && !f.startsWith('['))
    .map((f) => f.replace(/\.astro$/, ''));
  const countriesSrc = readFileSync(new URL('../data/countries.ts', import.meta.url), 'utf8');
  const countrySlugs = [...countriesSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
  assert.ok(countrySlugs.length >= 3, 'no se pudieron leer los slugs de países');
  for (const other of [...staticPages, ...countrySlugs]) {
    assert.equal(seen.has(other), false, `slug "${other}" choca con otra ruta de [lang]/`);
  }
});

test('cada key de localizedSlugs tiene su [key].astro, y cada [x].astro (salvo country) está en el mapa', () => {
  const dynamicPages = readdirSync(pagesDir)
    .filter((f) => /^\[[^\]]+\]\.astro$/.test(f))
    .map((f) => f.slice(1, -'].astro'.length));
  const ownStaticPaths = new Set(['country']);
  for (const key of Object.keys(localizedSlugs)) {
    assert.ok(dynamicPages.includes(key), `falta src/pages/[lang]/[${key}].astro`);
  }
  for (const p of dynamicPages) {
    if (!ownStaticPaths.has(p)) assert.ok(p in localizedSlugs, `[${p}].astro no está en localizedSlugs`);
  }
});

test('los 301 de vercel.json y astro.config apuntan a los slugs vigentes del mapa', () => {
  const vercel = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8')) as {
    redirects: { source: string; destination: string }[];
  };
  const llamadas = vercel.redirects.filter((r) => r.source.replace(/\/$/, '') === '/en/llamadas');
  assert.equal(llamadas.length, 2, 'faltan las dos variantes (con y sin barra final) del 301 de /en/llamadas');
  for (const r of llamadas) assert.equal(r.destination, localePath('/llamadas', 'en'));
  const astroCfg = readFileSync(new URL('../../astro.config.mjs', import.meta.url), 'utf8');
  assert.ok(astroCfg.includes(`'/recordatorios': '${localePath('/recordatorio-de-citas-por-whatsapp', 'es')}'`));
});
