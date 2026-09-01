#!/usr/bin/env node
/**
 * Check sintético POST-DEPLOY del funnel del Free Trial, contra PRODUCCIÓN. Corre en cron
 * (synthetic-check.yml). NO crea datos: valida el HTML servido + que los <script> inline
 * parseen + que el form esté cableado + una sonda de liveness al backend del demo.
 *
 * Falla (exit 1 → GitHub notifica) si el funnel está roto. Existe porque el bug del 10-ago
 * estuvo caído ~5 días sin que nadie lo viera: esto lo habría cazado en ≤6h.
 *
 * Overrides por env: PRUEBA_URL, DEMO_API_BASE.
 */
import { extractServedInlineScripts, syntaxError } from './lib/inline-scripts.mjs';

const PRUEBA_URL = process.env.PRUEBA_URL || 'https://holasara.ai/prueba';
const DEMO_API_BASE = (process.env.DEMO_API_BASE || 'https://prueba.rayapp.ai').replace(/\/$/, '');
const UA = { 'user-agent': 'sara-synthetic-check (funnel liveness)' };

const problems = [];

async function main() {
  // 1) La página carga.
  let html = '';
  try {
    const res = await fetch(PRUEBA_URL, { headers: UA });
    if (!res.ok) problems.push(`GET ${PRUEBA_URL} → HTTP ${res.status}`);
    html = await res.text();
  } catch (e) {
    problems.push(`No se pudo cargar ${PRUEBA_URL}: ${e.message}`);
  }

  // 2) Todos los <script> inline parsean (el bug del 10-ago).
  let checked = 0;
  for (const { body } of extractServedInlineScripts(html)) {
    checked++;
    const err = syntaxError(body);
    if (err) problems.push(`<script> inline con SyntaxError: ${err}`);
  }
  if (html && checked === 0) problems.push('No se encontró ningún <script> inline (¿HTML inesperado?)');

  // 3) El wiring del funnel sigue presente.
  if (html && !/id=["']trial-form["']/.test(html)) problems.push('Falta el <form id="trial-form">');
  if (html && !/\/api\/public\/demo/.test(html)) problems.push('El form no referencia /api/public/demo');

  // 4) Backend del demo vivo — sonda NO destructiva: un token inexistente debe dar 404
  //    (ruta montada + DB conectada). 503 = DB caída; otra cosa = ruteo roto.
  try {
    const probe = await fetch(`${DEMO_API_BASE}/api/public/demo/synthetic-liveness-probe`, { headers: UA });
    if (probe.status !== 404) problems.push(`Sonda al backend del demo esperaba 404, dio HTTP ${probe.status}`);
  } catch (e) {
    problems.push(`No se pudo alcanzar el backend del demo (${DEMO_API_BASE}): ${e.message}`);
  }

  if (problems.length) {
    console.error('✗ Funnel del Free Trial ROTO:');
    for (const p of problems) console.error(`  · ${p}`);
    process.exit(1);
  }
  console.log(`✓ Funnel OK — página carga, ${checked} <script> inline parsean, form cableado, backend del demo vivo.`);
}

main().catch((e) => {
  console.error('✗ El check sintético reventó:', e?.stack || e);
  process.exit(1);
});
