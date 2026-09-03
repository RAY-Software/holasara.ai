# Sara por voz: demo web en holasara.ai. Diseño

Fecha: 2026-09-03. Mapeo previo en `docs/voice-mapeo.md`. Reemplaza la primera versión, que asumía
un canal de voz real en clinic-platform.

## 0. Qué es y qué no es

- **Es un lead magnet**, igual que la demo de Hello Patient. El visitante (dueño de clínica) elige tipo
  de clínica e idioma, juega a ser paciente de una clínica inventada y ve cómo trabaja Sara. El objetivo
  es que deje su teléfono y entre al pipeline SDR.
- **Solo browser.** No hay número de teléfono, ni telefonía, ni transferencia de llamada.
- **Clínicas ficticias, sin tenants en clinic-platform.** El contexto de cada clínica es un archivo de
  config en este repo; la agenda es simulada. clinic-platform no se toca.
- **Motor: Gemini Live API desde el browser** con token efímero (el patrón de diezx, sin la API key en el
  cliente). Mismo proveedor que el chat de Sara. Vapi queda como plan B (ver §7).
- **UI propia** al estilo Hello Patient: tiles en el medio, transcript en vivo, onda, timer, corte,
  pantalla final con CTA.
- **Todo vive en este repo**: componente Astro + script cliente + funciones serverless en `api/`
  (Vercel), con el mismo patrón de secrets que `api/_key.js`.

Lo que queda para después (§8): voz como canal real de producto, con tools contra clinic-platform.

---

## 1. Arquitectura

```
holasara.ai (Astro estático + Vercel functions)                          Google
┌─────────────────────────────────────────────────────────┐
│ VoiceDemo.astro   tiles (estética/dental/consultorio)    │
│                   toggle ES/EN, botón, transcript, timer │
│ voice-client.ts   harness de audio (port de diezx)       │
│    ├─ POST /api/voice-session {intent, lang} ───────────►│ api/voice-session.js
│    │     ◄── {sessionId, ephemeralToken, model, voice,   │   rate limit, kill switch,
│    │          systemInstruction, tools, greeting, maxSec}│   arma prompt desde
│    │                                                     │   src/data/voiceDemoClinics.ts,
│    │                                                     │   pide token efímero ─────────► auth_tokens.create
│    ├─ WS BidiGenerateContent (audio 16k ↑, 24k ↓) ───────┼────────────────────────────────► Gemini Live
│    │     ◄── audio + inputTranscription/outputTranscription + functionCall
│    ├─ tools: agenda simulada, corren EN EL BROWSER        │
│    │     (get_available_slots, book_appointment, …)       │
│    ├─ POST /api/voice-event  {sessionId, kind, data} ────►│ api/voice-event.js → PostHog/Mixpanel
│    └─ POST /api/voice-notify {sessionId, phone, consent}─►│ api/voice-notify.js
│                                                          │   ES → scrapper POST /inbound/sdr-lead
│                                                          │   EN → Twilio SMS + lead (ver §4)
└─────────────────────────────────────────────────────────┘
```

### 1.1 Decisiones de diseño

- **Tools en el browser.** Como la agenda es simulada, no hay nada que proteger del lado del server. Los
  function calls de Gemini se resuelven en el cliente contra una agenda determinista (próximos 7 días,
  horarios de la clínica ficticia, 60 % de ocupación pseudoaleatoria por sesión). El **contrato** de los
  tools (nombres y args) se define igual al que tendría clinic-platform (§8), para que pasar a tools
  reales sea cambiar el adapter, no el prompt.
- **Sin relay.** El browser habla directo con Gemini con token efímero de un solo uso y vida corta. El
  prompt viaja al cliente; es una clínica inventada, no importa.
- **Sin base de datos.** No hay Mongo en Vercel. Lo que se persiste va como eventos a PostHog o Mixpanel
  (ya hay `src/lib/tracking.ts`): sesión creada, conectada, cada tool, reserva, corte, notify. El
  transcript completo se manda al final como un evento, truncado a 8 KB.
- **Idioma fijo por sesión** (`lang` de la ruta o del toggle), no detectado por el habla. Fija la regla de
  idioma del prompt, la voz y el idioma del saludo.

### 1.2 `api/voice-session.js`

Body `{ intent: 'estetica'|'dental'|'consultorio', lang: 'es'|'en' }`.
1. Origen permitido (mismo set que `api/places-autocomplete.js`), rate limit por IP (3 por hora, con el
   mismo `Map` por instancia que ya usa Places, más un tope diario global en memoria), kill switch
   `VOICE_DEMO_ENABLED`.
2. Carga la clínica desde `src/data/voiceDemoClinics.ts` y arma `systemInstruction` (§2).
3. Pide token efímero con `@google/genai` (`ai.authTokens.create`, `uses: 1`, `expireTime` a 2 min,
   `newSessionExpireTime` a 1 min, `liveConnectConstraints` con modelo y config fijados).
4. Responde `{ sessionId, ephemeralToken, model, voiceName, systemInstruction, tools, greeting, maxSec: 240 }`.

La key de Gemini entra al bundle de la función por el mismo mecanismo que `PLACES_API_KEY`
(`api/_key.js`, escrito por el workflow de deploy desde un secret de GitHub).

### 1.3 Cliente (`src/scripts/voice-client.ts`)

Port a TypeScript del harness de `diezx-app/backend/src/public/voice-agent/index.html`, sin nada del clone:
- captura 16 kHz por AudioWorklet, playback 24 kHz, barge-in (cortar la cola de audio cuando el usuario habla),
  reconexión en cierre de WS, cierre limpio al cortar o al ocultar la pestaña, wake lock;
- eventos: `status`, `transcript(role, text, final)`, `speaking(role)`, `level`, `toolCall`, `ended(reason)`;
- `setup` con `systemInstruction`, `tools`, `inputAudioTranscription: {}` y `outputAudioTranscription: {}`;
- `toolResponse` → `{ functionResponses: [{ id, name, response }] }`;
- tope duro de duración (`maxSec`) con aviso a los 30 s finales.

### 1.4 UI (`src/components/VoiceDemo.astro`)

- Reemplaza el mock `CallDemo.astro` en el hero de `/llamadas`, y se puede sumar a `/demo` y al home.
- Tiles: Estética · Dental · Consultorio médico. Toggle ES/EN arriba a la derecha, default por ruta.
- Botón "Hablar con Sara" → aviso de mic y de grabación → conectar. Saludo lo inicia Sara (`greeting`
  se manda como primer turno de usuario oculto, como `sendGreeting()` en diezx).
- Transcript: fila `draft` por hablante que se reescribe con cada parcial y se fija con `final`
  (idéntico a Hello Patient). Etiquetas "VOS:" / "SARA:" en ES, "YOU:" / "SARA:" en EN.
- Onda ligada al `level` real del mic y a `speaking('sara')`. Timer `m:ss`.
- Cambiar de tile en medio de la sesión corta y abre otra.
- Pantalla final: resumen de lo agendado, "¿Querés recibir la confirmación por WhatsApp?" (ES) /
  "Want the confirmation by text?" (EN) con input de teléfono y consentimiento, CTA "Agendar una demo"
  a `/demo`, y "Probar de nuevo".

---

## 2. Clínicas ficticias y prompt

`src/data/voiceDemoClinics.ts`, una entrada por `intent`, bilingüe:

| intent | Nombre ES / EN | Ciudad ES / EN | Servicios (6) | Particularidad |
|---|---|---|---|---|
| `estetica` | Lumen Estética / Lumen Aesthetics | CDMX / Miami | limpieza facial, láser, botox, rellenos, peeling, drenaje | pide seña del 20 % |
| `dental` | Sonrisa Dental / Bright Smile Dental | Guadalajara / Miami | limpieza, blanqueamiento, ortodoncia, implante, urgencia, control | urgencias el mismo día |
| `consultorio` | Consultorio Dra. Rivas / Dr. Rivas Family Practice | Monterrey / Miami | consulta general, control, certificado, vacunas, análisis, telemedicina | pregunta si es paciente nuevo |

Cada entrada: `name`, `city`, `timezone`, `hours` por día, `services[{name, durationMin, price}]`,
`professionals[]`, `policies` (cancelación, seña), `persona` (tono), `greeting` por idioma.

`systemInstruction` = persona de Sara (copiar la base de `SaraPersona.systemPrompt` de `sara-dev`,
sin datos de tenant) + bloque de datos de la clínica + `REGLAS DE VOZ`:
- frases cortas, una pregunta por turno, nunca leer URLs ni emojis;
- horarios en palabras ("el jueves a las once y media");
- confirmar nombre y, si hay duda, pedir que lo deletree (ver "Frank over to piano" en la demo de Hello Patient);
- no inventar servicios ni precios fuera de la lista (misma regla `NO_INVENTAR_CONDICIONES` del chat);
- si hay seña: "te reservo y te mando el link por WhatsApp", nunca decir el link;
- si piden un humano o algo médico: "te escribo por WhatsApp y una persona del equipo te sigue por ahí";
- si el visitante se despide: `end_call`;
- y una línea que recuerde que es una demo solo si el visitante pregunta si es real.

Tools declarados (contrato compartido con §8):

| Tool | Args | Adapter demo |
|---|---|---|
| `get_available_slots` | `{ service, date?, professional? }` | agenda simulada |
| `book_appointment` | `{ slotId, name, phone? }` | marca el slot, devuelve `{ ok, when, requiresDeposit }` |
| `reschedule_appointment` | `{ slotId }` | |
| `cancel_appointment` | `{}` | |
| `request_human` | `{ reason }` | solo marca `humanRequested` para la pantalla final |
| `end_call` | `{}` | cierra |

---

## 3. Lo que en chat es un link, en voz es un mensaje

En la demo no hay pago real. La seña se representa así: `book_appointment` en `estetica` devuelve
`requiresDeposit: true`, Sara dice que manda el link por WhatsApp, y el WhatsApp que llega después
(§4) es la confirmación de la cita. No se manda ningún link de pago falso.

---

## 4. "¿Prefieres escribir?": el segundo camino, por WhatsApp (solo ES)

Decisión 2026-09-03: no es "mandame la confirmación". Es el camino para el visitante que no va a
hablar (oficina, sin ganas, sin mic): chatea con Sara como paciente de la misma clínica ficticia,
y queda como lead. Igual que el "Prefer to text?" de Hello Patient. Solo español y WhatsApp; SMS
para US queda fuera hasta tener número.

### 4.1 Entrada: click-to-chat, no formulario

El visitante toca "Escribirle a Sara por WhatsApp" y se abre `wa.me` a la línea SDR (ruteo AR/MX
que ya hace `src/lib/whatsapp.ts`) con el texto precargado:

    Hola Sara, quiero pedir una cita en Lumen Estética. [src:hs][demo:estetica]

Por qué así y no un campo de número como Hello Patient:
- El visitante manda el primer mensaje → se abre la ventana de 24 h de Meta → Sara responde en
  texto libre al instante. Con un campo de número, el primer mensaje tiene que ser una template
  aprobada por Meta y el envío inmediato hoy no existe en el scrapper (el planner ni siquiera
  contacta leads inbound fuera de campaña).
- Cero infra nueva en holasara.ai: ni endpoint, ni consentimiento, ni validación de número.
- En celular abre WhatsApp directo; es el gesto nativo del canal.
- El marcador `[demo:<intent>]` viaja en el texto igual que `[src:hs]` y los click-ids, y el
  scrapper ya tiene el patrón para leerlo (`extractSource`, `extractClickId`).

En la home y en `/llamadas`, el bloque va al lado del botón de voz desde el primer momento, no en
la pantalla final. Evento `voice_demo_cta` con `target: 'whatsapp'`. En `/en` no se muestra.

### 4.2 Scrapper: modo "demo paciente"

Implementado en `RAY-Scrapper` (branch `claude/sdr-patient-demo`, `server/services/sdrPatientDemo.js`).
Todo en `RAY-Scrapper`, sobre la línea y el pipeline que ya existen. Sin staging: se prueba con
`sender.dryRun`, `previewReply` y tests con mocks (`server/__tests__/sdrReplyHandler.*.test.js`).

1. **Detección**: `extractDemoIntent(text)` → `[demo:(estetica|dental|consultorio)]`. En
   `handleInbound`, si la conversación no tiene modo y el texto trae el marcador:
   `conversation.mode = 'patient-demo'`, `conversation.demoScenario = { intent, clinic, slots, booking }`.
2. **Modelo**: `SdrConversation` suma `mode` (`sales` | `patient-demo`, default `sales`),
   `demoScenario` (Mixed) y `demoPivotedAt`. `SdrLead` suma `inboundSource: 'voice-demo'` como valor
   válido; el lead se crea en el primer inbound si no existe (hoy solo se busca), con
   `whatsappSource: 'inbound-form'`, `priorityFactors.reason: 'raised-hand'`.
3. **Clínicas ficticias**: `server/data/patientDemoClinics.json`, generado desde
   `src/data/voiceDemoClinics.ts` de holasara.ai por `scripts/export-voice-clinics.mjs` (misma
   fuente, dos repos; el script evita que diverjan). La agenda simulada se genera al entrar en modo
   demo (próximos 7 días, horarios de la clínica, ocupación pseudoaleatoria) y se guarda en
   `demoScenario.slots`; el modelo elige por índice, nunca por fecha libre.
4. **Prompt**: un segundo system prompt `docs/sdr-ai-patient-demo-prompt.md` (Sara recepcionista de
   la clínica, español neutro, cita/anticipo, no inventar) elegido por modo en `loadSystemPrompt`
   (hoy cachea uno solo). User prompt con datos de la clínica, agenda, cita actual e historial.
   Reusa `RESPONSE_SCHEMA` con acciones `reply | book | reschedule | cancel | demo_complete`.
5. **Validador**: `validateAiOutput` hoy rechaza cualquier precio que no sea el piso de RAY y limita
   templates y palabras. Se le pasa un ruleset por modo: en demo, precios de la clínica ficticia
   permitidos, sin templates, tope 120 palabras.
6. **Bypass de lo comercial**: en modo demo `handleInbound` no llama a knowledge/site knowledge/
   grader, no toca Google Calendar (`confirm_slot` real), no sube conversiones a Ads/Meta, no
   pasa por `markDemoBooked` ni HubSpot. Solo: historial → decisión → `sendBubbles` → outbox.
7. **Pivot a venta**: cuando el modelo devuelve `demo_complete` (el paciente se despidió o ya
   reservó), cuando el visitante pregunta por Sara o el producto, o al turno 12: `mode = 'sales'`,
   `demoPivotedAt`, y un mensaje puente en el mismo hilo: "Eso que acabas de vivir es lo que Sara
   hace en tu clínica, todos los días…" seguido de la pregunta de calificación habitual. Desde el
   siguiente inbound corre el flujo SDR normal, con el historial completo como contexto.
8. **Handoff y opt-out** siguen funcionando igual: `handed_off` y `opted_out` cortan antes del modo.

### 4.3 Lo que hay que mirar al implementar

- `handleYCloudInbound` no deduplica por `ycloudMessageId`: un retry de YCloud dispara dos
  respuestas. Conviene arreglarlo de paso (índice único o check previo).
- El webhook de YCloud es fail-open sin `YCLOUD_WEBHOOK_SECRET`. No es de este cambio, pero anotarlo.
- `resolveVertical` debe mapear `demo` → `health`, para que el pivot a venta arranque con el
  framing de clínicas.
- Zapier `ZAPIER_SDR_INBOUND_WEBHOOK` se dispara en el primer mensaje: decidir si un demo cuenta
  como "primer mensaje" comercial o recién al pivot.

## 5. Humano y fuera de horario

- Sin transferencia. `request_human` solo marca la sesión; Sara ofrece seguir por WhatsApp y la pantalla
  final lo destaca. El equipo lo ve como lead `voice-demo` con `humanRequested: true`.
- Sara atiende siempre. Si la clínica ficticia está cerrada a esa hora, lo dice y agenda para cuando abre.
  El tz de la clínica es el de la config, no el del visitante.

---

## 6. Costos, abuso y métricas

- Sesión máxima 4 min. 3 sesiones por IP por hora. Tope diario global de minutos con kill switch por env.
- Turnstile solo si aparece abuso; no ponerlo de entrada, mata la conversión.
- Eventos (GA4 vía `gtag`, más Meta `trackCustom` en start y booked; helper `src/lib/voiceDemo/track.ts`):
  `voice_demo_visible`, `voice_demo_start`, `voice_demo_connected` (connect_ms), `voice_demo_tool` (tool, ok),
  `voice_demo_booked` (service, requires_deposit), `voice_demo_ended` (reason, duration_sec, booked,
  human_requested, turns), `voice_demo_error` (detail), `voice_demo_switch` (kind, from, to, mid_call),
  `voice_demo_cta` (target). Nunca viaja el teléfono ni el transcript. Con eso sale el embudo:
  visible → start → connected → booked → cta.
- Aviso de grabación antes de conectar y nada de audio guardado. Solo transcript.

---

## 7. Plan en pasos chicos

| # | Paso | Verificación |
|---|---|---|
| 0 | **Spike (1 día)**: HTML suelto con el harness de diezx + función de Vercel que pide token efímero. Español e inglés, 3 voces, un tool dummy. Medir latencia desde MX y AR, costo por minuto, y confirmar que `liveConnectConstraints` fija modelo y config. | 2 min de charla por idioma sin cortes; transcripción legible; costo anotado |
| 1 | `src/data/voiceDemoClinics.ts` + builder de prompt + agenda simulada + tools en cliente, con tests unitarios (vitest no está en el repo; sumarlo o usar `node --test`). | Tests: slots respetan horarios, book marca el slot, reschedule libera el anterior |
| 2 | `api/voice-session.js` con rate limit, kill switch y token efímero. | curl: 200 con token; 429 al cuarto intento; 503 con el flag apagado |
| 3 | `voice-client.ts` + `VoiceDemo.astro` en `/llamadas` detrás de `?voice=1`. | Agendar hablando de punta a punta en desktop; luego iOS Safari y Android Chrome |
| 4 | `api/voice-event.js` + eventos de tracking. | Funnel visible en PostHog/Mixpanel |
| 5 | `api/voice-notify.js` + cambio en scrapper (aceptar `US`, template `voice_demo_confirmacion`, ruteo por `inboundSource`). SMS por Twilio para EN. | Lead aparece en la bandeja SDR con `voice-demo`; WhatsApp llega a un número MX/AR; SMS a uno US |
| 6 | Hardening y copy final, sacar el flag, sumar a `/demo` y home. | Script de abuso de 50 sesiones: se corta en el tope; Lighthouse de `/llamadas` sin regresión |

Verificación transversal: cada paso se prueba con `astro dev` local (las funciones de `api/` con `vercel dev`)
y con Chrome real vía la extensión.

---

## 8. Después: voz como canal de producto

Si la demo convierte, el camino a producto real es:
1. Los mismos tools, implementados en clinic-platform como `services/sara/tools.js` sobre los servicios
   que ya existen (`getAvailableSlots`, `reserveSlot`, `rescheduleWithClaim`, `releaseBooking`,
   `startAppointmentCheckout`, `sendTemplate`), expuestos en `POST /api/voice/sessions/:token/tool`.
2. `channel: 'voice'` en `SaraConversation` y el prompt armado por `buildSystemInstruction` + contexto real.
3. Relay o firma de tool calls para tenants reales (el prompt y las escrituras dejan de ser inocuas).
4. Botón "Hablá con Sara" en `generic-website` resolviendo tenant por host.
5. Teléfono, si algún día se quiere: ahí sí un proveedor (Vapi, Retell, LiveKit Agents) delante del mismo
   endpoint de tools.

---

## 9. Riesgos y lo que no sé

1. **Token efímero.** Creo que `auth_tokens.create` con `liveConnectConstraints` existe en v1alpha del SDK
   `@google/genai`; no lo verifiqué. El spike lo confirma. Si no existe, alternativa: relay WebSocket
   mínimo en Cloud Run (Vercel no sostiene WS), lo que rompe "todo en este repo".
2. **Gemini Live es preview.** El modelo (`gemini-2.5-flash-native-audio-preview-12-2025` en diezx) puede
   cambiar de nombre o cuota. Modelo por env. Plan B: Vapi con SDK web (`@vapi-ai/web`) y la misma UI;
   cambia `voice-client.ts` y la función de sesión, nada más.
3. **Voces en español.** Las prebuilt de Gemini no tienen acento LATAM. Escuchar varias en el spike.
4. **Latencia desde LATAM** y **costo por minuto**: sin medir. Definen los topes de §6.
5. **iOS Safari**: `AudioContext` debe crearse en el tap; AudioWorklet y autoplay son quisquillosos.
6. **Scrapper**: la secuencia SDR contacta al lead con su timing, no al instante; y hoy solo AR|MX. El
   "te escribo por WhatsApp" que dice Sara puede tardar. Hay que ajustar la promesa en el prompt ("te van
   a escribir en un rato") o meter un envío inmediato en scrapper para `voice-demo`.
7. **SMS US**: trámite de número (toll-free verificado o 10DLC), días o semanas.
8. **Vercel functions**: estado en memoria por instancia, así que el rate limit es aproximado (igual que
   en Places). Para un tope diario real haría falta KV; aceptable arrancar sin eso.
9. **Nombres mal transcriptos** y ruido de fondo: mitigación por prompt, no bloquea la reserva.
