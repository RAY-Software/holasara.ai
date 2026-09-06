import { test } from 'node:test';
import assert from 'node:assert/strict';
import { localePath, localizedStaticPaths, slugFor } from './config.ts';

test('localePath prefija paths comunes y respeta externos', () => {
  assert.equal(localePath('/agenda', 'es'), '/es/agenda');
  assert.equal(localePath('/agenda', 'en'), '/en/agenda');
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

test('localizedStaticPaths genera un path por idioma con el param de la key', () => {
  assert.deepEqual(localizedStaticPaths('reminders'), [
    { params: { lang: 'es', reminders: 'recordatorio-de-citas-por-whatsapp' } },
    { params: { lang: 'en', reminders: 'appointment-reminders' } },
  ]);
  assert.equal(slugFor('answering', 'en'), 'medical-answering-service');
});
