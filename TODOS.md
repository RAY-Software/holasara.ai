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

**Convención nueva (Franco, 3-sep-2026): los slugs se localizan por idioma.** Las landings de esta lista nacen con slug en su idioma (`/es/recordatorio-de-citas-por-whatsapp` <-> `/en/appointment-reminders`, `/en/ai-receptionist`, `/en/dental-seo`). Trabajo técnico previo, de una sola vez: `getStaticPaths` con mapa de slug por idioma, `localePath` resolviendo el slug según el idioma, hreflang y canonical emparejando ambas URLs, y 301 de los slugs viejos donde ya haya algo indexado (hoy casi nada). Las páginas existentes (`/en/llamadas`, `/en/agenda`, etc.) migran en esa misma tarea.

Fuente: `docs/research/keywords-mx-us-2026-09.md` (otra sesión) y https://claude.ai/code/artifact/65cd0f82-c68a-4078-ab4c-a323fd663660. El sitio arranca de cero en orgánico (51 impresiones en 90 días, todas de marca). El cluster "recepcionista virtual" en español casi no tiene volumen (40/mes): se mantiene en la home por message match con Ads, no por SEO. La demanda orgánica real en MX está en recordatorios y agenda por WhatsApp; en US (10x volumen) en "ai receptionist", "medical answering service", "appointment reminders" y las páginas de Mia (dental SEO, med spa SEO, Instagram automation, AEO/GEO). Los datos respaldan la dirección B (Mia se sostiene con páginas propias en /en, no cambiando la home).

- [ ] ES: landing nueva `/es/recordatorio-de-citas-por-whatsapp` ("recordatorio de citas por whatsapp" 200/mes, KD 26, SERP débil). Hoy es un ancla dentro de /agenda.
- [ ] ES: reenfocar `/es/agenda` a "agenda de citas con whatsapp para clínicas y consultorios" (KD 1-2).
- [ ] EN: landing nueva `/en/ai-receptionist` (medical + dental; "ai receptionist" 7.8K, "virtual medical receptionist" 1K KD 7) con sección "AI vs human virtual medical receptionist".
- [ ] EN: reescribir `/en/llamadas` hacia "medical answering service" (2K, KD 0; "hipaa compliant medical answering service" 450, KD 4).
- [ ] EN: landing nueva `/en/appointment-reminders` ("appointment reminder" 1.4K, KD 8).
- [ ] EN, páginas de Mia: `/en/dental-seo`, `/en/med-spa-seo`, `/en/instagram-automation`, `/en/aeo` (answer/generative engine optimization).
- [ ] Comparativas: sumar `sara-vs-dentalink` (marca dental más buscada en MX). Doctocliq, Kura y Cloudia no traen tráfico de marca.
