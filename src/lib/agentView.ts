import { getProductGroups, getTopLinks } from '../data/nav';

// El agent view se publica en español (idioma principal del sitio).
const productGroups = getProductGroups('es');
const topLinks = getTopLinks('es');

// ─────────────────────────────────────────────────────────────────────────────
// Vista de agente (patrón de konghq.com/?mode=agent): arma un Markdown limpio y
// link-rich del sitio para que lo naveguen los LLMs. Fuente única: la misma IA
// del sitio (nav.ts) + el llms.txt ya publicado → nunca diverge de lo humano.
// Puro y testeable; la página /agent lo pinta como texto monoespaciado.
// ─────────────────────────────────────────────────────────────────────────────

const SITE = 'https://holasara.ai';
const WHATSAPP = 'https://wa.me/526144659466';

const abs = (href: string) => (href.startsWith('http') ? href : SITE + href);

/** El sitio → Markdown para agentes. `llmsBody` = el cuerpo del /llms.txt (sin su
 *  título ni intro) para dar profundidad sin duplicar la fuente. */
export function buildAgentMarkdown(llmsBody = ''): string {
  const lines: string[] = [
    '# Sara — la recepción que nunca cierra',
    '',
    '> La secretaria con IA para clínicas: atiende WhatsApp e Instagram las 24 horas,',
    '> informa tratamientos y precios, agenda la cita, cobra el anticipo y baja las ausencias.',
    '',
    '## Empezá acá',
    `- [Probar gratis](${abs('/prueba')})`,
    `- [Ver una demo](${abs('/demo')})`,
    `- [Precios por país](${abs('/precios')})`,
    '',
    '## Producto',
  ];

  for (const g of productGroups) {
    lines.push(`### ${g.label}`);
    for (const it of g.items) lines.push(`- [${it.name}](${abs(it.href)}): ${it.desc}`);
    lines.push('');
  }

  lines.push('## Más');
  for (const it of topLinks) lines.push(`- [${it.name}](${abs(it.href)}): ${it.desc}`);
  lines.push('');

  lines.push(
    '## Contacto',
    `- WhatsApp: ${WHATSAPP}`,
    `- Web: ${SITE}`,
    `- Referencia completa para IA: [llms.txt](${abs('/llms.txt')})`,
    '',
  );

  const body = llmsBody.trim();
  if (body) lines.push('---', '', body);

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/** Quita el título H1 y la intro del llms.txt: deja desde la primera sección `## `.
 *  Así el cuerpo entra bajo el índice sin duplicar H1 ni el blockquote. */
export function llmsBodyOnly(llms: string): string {
  const i = llms.indexOf('\n## ');
  return i === -1 ? '' : llms.slice(i + 1);
}
