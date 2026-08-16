#!/usr/bin/env node
/**
 * Guarda PRE-DEPLOY: valida que todo `<script is:inline>` de las páginas .astro parsee como JS.
 * Corre en el deploy (deploy.yml) antes de buildear. Hubiera frenado el deploy del commit
 * 52158c0 que dejó el funnel del free trial caído ~5 días. Sin red, instantáneo.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { extractInlineScripts, syntaxError } from './lib/inline-scripts.mjs';

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (name.endsWith('.astro')) acc.push(p);
  }
  return acc;
}

const files = walk('src');
let checked = 0;
const failures = [];

for (const f of files) {
  const html = readFileSync(f, 'utf8');
  for (const { body } of extractInlineScripts(html)) {
    checked++;
    const err = syntaxError(body);
    if (err) failures.push({ f, err });
  }
}

console.log(`Chequeados ${checked} <script is:inline> en ${files.length} páginas .astro.`);

if (failures.length) {
  console.error('');
  for (const { f, err } of failures) {
    console.error(`✗ ${f}: SyntaxError en un <script is:inline> → ${err}`);
  }
  console.error(
    `\n${failures.length} script(s) inline con SyntaxError. Un is:inline roto se sirve tal cual y ` +
    `rompe el JS de la página entera (fue el bug del funnel del free trial del 10-ago). Deploy abortado.`
  );
  process.exit(1);
}

console.log('✓ Todos los <script is:inline> parsean.');
