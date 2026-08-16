import vm from 'node:vm';

/**
 * Guardas contra el incidente del 10-ago: un `<script is:inline>` con un SyntaxError se
 * sirve tal cual (Astro no lo procesa) y mata TODO el bloque → el handler del form del free
 * trial nunca se enganchó → el funnel quedó caído para el 100% de las visitas, en silencio.
 * Estas funciones detectan exactamente esa forma de bug, en el source (pre-deploy) y en el
 * HTML servido en prod (check sintético).
 */

/** Cuerpos de los `<script ... is:inline ...>…</script>` con cuerpo JS literal de un source .astro. */
export function extractInlineScripts(html) {
  // Sacá primero los self-closing `<script .../>` (gtag/pixel con src= o set:html=): no tienen
  // cuerpo JS literal y, si no, la regex de pares se los tragaría hasta el próximo </script>.
  const paired = html.replace(/<script\b[^>]*\/>/g, '');
  const out = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(paired))) {
    const attrs = m[1] || '';
    const body = m[2] || '';
    if (!/\bis:inline\b/.test(attrs)) continue;   // solo los que se sirven tal cual
    if (/\bsrc\s*=/.test(attrs)) continue;         // externo, sin cuerpo
    if (/\bset:html\b/.test(attrs)) continue;      // cuerpo inyectado por expresión, no literal
    if (!body.trim()) continue;
    out.push({ attrs, body });
  }
  return out;
}

/**
 * Cuerpos de TODO `<script>…</script>` inline de un HTML ya servido. Descarta los externos
 * (`src=`), los de JSON (`type="application/…json"`) y los vacíos. En el HTML horneado Astro ya
 * resolvió `define:vars` a `const …`, así que estos parsean solos.
 */
export function extractServedInlineScripts(html) {
  const paired = html.replace(/<script\b[^>]*\/>/g, '');
  const out = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(paired))) {
    const attrs = m[1] || '';
    const body = m[2] || '';
    if (/\bsrc\s*=/.test(attrs)) continue;
    if (/\btype\s*=\s*["'][^"']*json["']/i.test(attrs)) continue;
    if (!body.trim()) continue;
    out.push({ attrs, body });
  }
  return out;
}

/**
 * `null` si el cuerpo parsea como JS; el mensaje si tiene un SyntaxError. Compila sin ejecutar
 * (`vm.Script`), así que variables no declaradas (p.ej. las de `define:vars`) NO son error —
 * solo nos importa la sintaxis, que es lo que rompió el funnel.
 */
export function syntaxError(body) {
  try {
    new vm.Script(body, { filename: 'inline.js' });
    return null;
  } catch (e) {
    return e instanceof SyntaxError ? e.message : null;
  }
}
