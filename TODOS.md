# TODOS

Diferidos por /autoplan (2026-09-03, home "Sara y su equipo"):

- [ ] **Ads: apuntar las campañas a una landing Sara-only.** `/sara` ya es una página Sara-only ("Tu recepción. Y tu secretaria."); mover la URL de destino en Meta y Google (o crear alias `/recepcionista`) libera a la home para contar el equipo con más fuerza. Decisión de Franco; coordinar con la campaña activa de septiembre.
- [ ] **Un número publicable de Mia o Daniel** (posts publicados por mes, clínicas con Daniel activo, etc.). Es el verdadero gate de la fase 2 (hero con el equipo), no los tres avatares.
- [ ] **Unificar "recepcionista" vs "secretaria"** en kicker, meta, nav, llms.txt, JSON-LD, spotlight y agentView. PR aparte.
- [ ] **Pregunta abierta:** ¿Mia y Daniel se contratan hoy sobre la misma cuenta que Sara o se activan en la demo? Define la FAQ de la home y el llms.txt.
- [ ] **Codex:** `codex login` para que /autoplan y /review vuelvan a tener segunda voz.
- [ ] **Medición:** la campaña arranca sin tráfico previo, así que no hay línea base. Franco deja una anotación en Analytics en la fecha del deploy; comparar CTR y conversión a /demo a los 14 y 30 días desde ahí.
- [ ] **Cierre del rediseño de la home (pedido de Franco):** revisar que `public/llms.txt` refleje la home final (tres actos, qué hace cada agente, piezas de Mia) y que el schema JSON-LD esté al día: qué schema tiene la home hoy (Layout: Organization + WebSite) y si conviene sumar algo por la home nueva; y que `/equipo` y las fichas `/equipo/*` tengan schema propio (hoy solo heredan el del Layout).

## SEO: landings nuevas (investigación Ahrefs MX/US, 3-sep-2026)

**Convención nueva (Franco, 3-sep-2026): los slugs se localizan por idioma.** Hecho (sep 2026, rama `claude/seo-landings-nicho-integraciones`): mapa en `src/i18n/slugs.ts`, `localePath` traduce el slug, hreflang/canonical y switch de idioma emparejan ambas URLs, 301 de `/en/llamadas`. Las páginas con slug localizado viven en `src/pages/[lang]/[<key>].astro` y usan `export function getStaticPaths() { return localizedStaticPaths('<key>') }` (la forma arrow `export const` rompe el dev server). Pendiente: migrar las páginas históricas (`/en/agenda`, `/en/cobros`, etc.) a slugs EN propios cuando se decida cuáles.

Fuente: `docs/research/keywords-mx-us-2026-09.md` (otra sesión) y https://claude.ai/code/artifact/65cd0f82-c68a-4078-ab4c-a323fd663660. El sitio arranca de cero en orgánico (51 impresiones en 90 días, todas de marca). El cluster "recepcionista virtual" en español casi no tiene volumen (40/mes): se mantiene en la home por message match con Ads, no por SEO. La demanda orgánica real en MX está en recordatorios y agenda por WhatsApp; en US (10x volumen) en "ai receptionist", "medical answering service", "appointment reminders" y las páginas de Mia (dental SEO, med spa SEO, Instagram automation, AEO/GEO). Los datos respaldan la dirección B (Mia se sostiene con páginas propias en /en, no cambiando la home).

- [x] ES: landing nueva `/es/recordatorio-de-citas-por-whatsapp` (hecha, `[reminders].astro`, también genera `/en/appointment-reminders`) ("recordatorio de citas por whatsapp" 200/mes, KD 26, SERP débil). Hoy es un ancla dentro de /agenda.
- [ ] ES: reenfocar `/es/agenda` a "agenda de citas con whatsapp para clínicas y consultorios" (KD 1-2).
- [x] EN: landing nueva `/en/ai-receptionist` (hecha, `[receptionist].astro`, ES `/es/recepcionista-virtual`) (medical + dental; "ai receptionist" 7.8K, "virtual medical receptionist" 1K KD 7) con sección "AI vs human virtual medical receptionist".
- [x] EN: reescribir `/en/llamadas` hacia "medical answering service" (hecho: `/en/medical-answering-service`, `[answering].astro`) (2K, KD 0; "hipaa compliant medical answering service" 450, KD 4).
- [x] EN: landing nueva `/en/appointment-reminders` (misma fuente que la ES de recordatorios) ("appointment reminder" 1.4K, KD 8).
- [x] EN, páginas de Mia: `/en/dental-seo`, `/en/med-spa-seo` y `/en/aeo` hechas (con hermanas ES). Pendiente: `/en/instagram-automation`.
- [x] EN, Daniel: `/en/medical-practice-bookkeeping` (ES `/es/contabilidad-para-clinicas`), con Plaid y QuickBooks.
- [x] Integraciones: `/es/integraciones` ↔ `/en/integrations` (lista pendiente de confirmar por Franco: qué es nativo y qué es vía API; SMS y chat web incluidos porque el sitio ya los afirma).
- [ ] Comparativas: sumar `sara-vs-dentalink` (marca dental más buscada en MX). Doctocliq, Kura y Cloudia no traen tráfico de marca.
- [ ] **Portada del video de la home**: es el thumbnail automático de YouTube (video -HAjxKXeltI) y muestra la placa vieja "Marketing que no depende de que tengas tiempo" con el mock de Instagram anterior. Cambiar la miniatura en YouTube Studio o servir una portada propia (public/img) en index.astro.
