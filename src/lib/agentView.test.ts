import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildAgentMarkdown } from './agentView.ts';

test('la vista de agente publica solo URLs canónicas con prefijo de idioma', () => {
  const md = buildAgentMarkdown('');
  const links = [...md.matchAll(/\]\((https:\/\/holasara\.ai[^)]*)\)/g)].map((m) => m[1]);
  assert.ok(links.length > 10, 'no se encontraron links');
  for (const href of links) {
    const path = new URL(href).pathname;
    assert.ok(/^\/(es|en)\//.test(path) || path === '/llms.txt', `link sin prefijo de idioma: ${href}`);
  }
  // Un slug localizado sale con su forma ES canónica, no como URL pelada.
  assert.ok(md.includes('https://holasara.ai/es/recepcionista-virtual'));
  assert.ok(!md.includes('https://holasara.ai/recepcionista-virtual'));
});
