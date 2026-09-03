# Sara por voz. Fase 1: mapeo

Fecha: 2026-09-03. Solo lectura, sin código. Insumo para `docs/voice.md` (Fase 2).

Aclaración de repos: este repo (sara-ai-website) es el sitio Astro estático, no tiene
agente. El agente de chat de Sara vive en `~/Desktop/sara-ai-app` (monorepo
"clinic-platform", backend compartido en `packages/clinic-core`). El voice agent de
RAY está en `~/Desktop/RAY-Website`. Se revisó también `~/Desktop/diezx-app` porque
apareció como posible fuente de wiring de Vapi: no lo es (ver 2.4).

---

## 1. Sara chat (sara-ai-app / clinic-platform)

Todo en `packages/clinic-core/src/`.

### 1.1 Entradas y resolución de clínica

| Canal | Ruta | Cómo resuelve la clínica |
|---|---|---|
| WhatsApp (YCloud) | `POST /api/whatsapp/webhook` (`routes/whatsapp.ts:232`) | número destino → `Channel{type:'whatsapp', waPhone}` → `Company` (`lib/whatsappRouting.js:49`) |
| WhatsApp (Twilio) | `POST /api/whatsapp/twilio/webhook` (`routes/whatsapp.ts:322`) | ídem, por `To` |
| Instagram | `POST /api/instagram/webhook` (`routes/instagram.ts:87`) | `entry[].id` → `Channel{igUserId}` |
| Web chat | `POST /api/chat` (`routes/chat.ts:26`) | host HTTP → `tenancyMiddleware` (`lib/tenancy.js:83`) |

Una vez resuelta, el turno corre dentro de `runWithCompany(company, …)` (AsyncLocalStorage)
y se precarga `ensureSaraPersonaLoaded`. `Channel.waPhone` es clave única global: el
mismo patrón "número destino → Channel → Company" sirve para un número de voz.

Estado de la conversación: `models/SaraConversation.js` (un doc por `{companyId, sessionId}`,
`channel` enum `web|whatsapp|instagram|manual|form|api` en `:57`, `messages[]`,
`offeredSlots[]`, `booking{}`, `pendingPayment{}`, `humanControl`).

### 1.2 El agente

- Gemini `gemini-2.5-flash` vía `@google/generative-ai` (`services/sara/ai.js:12`). No hay OpenAI ni Anthropic.
- JSON mode con `RESPONSE_SCHEMA` (`ai.js:48-73`), temp 0.6, 2 reintentos, 15 s timeout.
- System prompt: `buildSystemInstruction` (`ai.js:38`) = `SaraPersona.systemPrompt` (por tenant, Mongo)
  + `salesPlaybook` + `Settings.salesGuidance` + guardrail anti invención.
- Contexto de clínica: `buildUserPrompt` (`services/sara/prompt.js:82-256`) inyecta fecha en tz de la
  sucursal, `SaraPersona.knowledge`, precios (`pricing.js`), sucursales, horarios, política de
  cancelación, profesionales, slots ofrecidos e historial (24 turnos). Todo se junta en
  `services/sara/handler.js:437-470`.
- Idioma: lo decide el modelo por regla de prompt (`prompt.js:45-54`, responde en el idioma del
  último mensaje). Dialecto de español por `WebsiteConfig.branding.locale` (`prompt.js:60-71`).

### 1.3 "Tools": no hay function calling

Sara no llama tools. Gemini devuelve un JSON con `action` y el código despacha:

| action | Dónde | Función de negocio | Reusable desde voz |
|---|---|---|---|
| ofrecer slots (cada turno) | `handler.js:412-427` | `getAvailableSlots` (`lib/availability.js:319`) | Sí, servicio puro |
| slots de una fecha | `handler.js:494-509` | `getSlotsForDate` (`availability.js:360`) | Sí |
| `confirm_booking` | `handler.js:677` → `bookingConfirmation.js:50` | `reserveSlot` (`services/booking/reserveSlot.js:49`) | `reserveSlot` sí; el wrapper está atado al doc `convo` |
| `reschedule_booking` | `handler.js:688-806` | `rescheduleWithClaim` (`services/booking/rescheduleClaim.js:35`) | Sí, deps inyectadas |
| `cancel_booking` | `handler.js:808-856` | inline + `releaseBooking` (`availability.js:546`) | Lógica inline, hay que extraerla |
| link de seña | `bookingConfirmation.js:87-142` | `startAppointmentCheckout` (`lib/appointmentPayment.js:164`) devuelve `{url}` | Sí, pero el mensaje es burbuja de chat |
| handoff humano | `bookingConfirmation.js:200`, `handler.js:770` | `notifyHumanHandoff` (`services/sara/notify.js:532`) | Sí |

La frontera limpia es `handleMessage({sessionId, message, channel, locationId})` (`handler.js:111`)
que devuelve `{bubbles[]}`. Un canal de voz podría llamarla, pero: el enum `channel` no tiene
`voice`, `originForChannel` (`bookingConfirmation.js:26`) no lo conoce, y las burbujas están
pensadas para chat (split por `||`, links).

### 1.4 Qué ya es API HTTP (llamable desde un webhook de voz)

Ya existe con auth de máquina (`x-api-key` = `Settings.posApiKey`, `routes/pos.ts`):
- `GET /api/pos/slots-available` (`:382`)
- `POST /api/pos/appointments` (`:442`), crea `SaraConversation` para que anden recordatorios
- `GET /api/pos/appointments`, `/:eventId`, `/clients`, `/clients/:phone`

Público por host: `GET /api/booking/locations|resources|slots-available`, `POST /api/booking`.

Faltan como HTTP (hoy solo función interna o admin-session):
- cancelar y reprogramar con auth de máquina (solo `POST /api/admin/booking/cancel|reschedule`)
- crear link de seña (`startAppointmentCheckout`)
- mandar WhatsApp saliente (`lib/whatsapp/index.js` `sendText`/`sendTemplate`)
- `handleMessage` para canales que no sean web

### 1.5 Pagos

Stripe Connect o Clip (MX), elegido por `Settings.paymentProvider`. Gate: `Company.paymentBeforeBookingEnabled`
+ `Settings.appointmentDeposit`. `startAppointmentCheckout` crea `AppointmentPayment` pending y devuelve URL.
La cita se crea al confirmarse el pago (webhooks `routes/stripe.ts:270`, `routes/clip.ts:56`) y el paciente
recibe confirmación por WhatsApp (`notifyPatientDeposit`, solo WhatsApp). Sara entrega el link como
3 burbujas (`depositMessage`, `appointmentPayment.js:145`).

### 1.6 Handoff humano

Sara nunca escala sola (regla dura en `prompt.js:251`, `handler.js:596`). El humano toma control desde el
panel (`POST /api/admin/conversations/:sessionId/control`, `routes/admin/inbox.ts:877`); con `humanControl`
Sara guarda el mensaje y no responde (`handler.js:305`). `notifyHumanHandoff` avisa por WhatsApp a operadores
(`operatorNotify.js`), push (`operatorPush.js`) y email. Auto-release por inactividad (`handoff.js:67`).

### 1.7 Horarios

1. `Channel.activeDays` + `isChannelActiveNow` (`lib/channelSchedule.js:42`): fuera de horario Sara no responde
   y deja el hilo para un humano (`whatsappDispatch.js:47`).
2. `Branch.hours` + `Branch.timezone` (`models/Branch.js:31,58`): limitan qué slots existen; opcionalmente
   van al prompt (`Settings.mentionBusinessHours`). `Settings.minNoticeHours` (default 2 h).
3. Ventana de envíos salientes para recordatorios y follow-ups (`followup.js` `isWithinSendWindow`).

### 1.8 Mensajería saliente

- Facade `lib/whatsapp/index.js`: `sendText` (`:36`), `sendTemplate` (`:45`). Proveedor por tenant
  `Settings.whatsappProvider` (`ycloud|twilio`). Impl en `lib/ycloud.js:124/153`, `lib/twilio.js:96/122`.
- Templates ya en uso: recordatorio 24 h (`reminders.js:187`), follow-up, reseñas, link de pago POS
  (`lib/posWhatsapp.js:36`), confirmación de seña.
- SMS: no existe ningún envío de SMS en el repo.

### 1.9 Pistas de voz existentes

- Twilio Voice ya está, solo para OTP de alta de número: `routes/twilioOtp.ts` devuelve TwiML `<Record>`
  (`:62`), `lib/twilioPlatform.js:50` `setVoiceUrl`, transcripción del audio con Gemini (`lib/otpTranscribe.js:33`).
- Credenciales Twilio por tenant (`Settings.twilioAccountSid/AuthToken/FromPhone`) y de plataforma
  (`TWILIO_PLATFORM_*`). Pool de números: `models/PhoneLine.js`.
- Vapi: una mención en `docs/plans/hola-equipo-2026-08-29.md:33`. Retell/ElevenLabs/Deepgram: cero.

### 1.10 Config de tenant relevante para voz

- `Company`: `slug`, `name`, `hosts[]`, planes. Sin teléfono, tz ni locale (locale en `WebsiteConfig.branding.locale`).
- `Branch`: `timezone`, `hours`, `phone`, `whatsapp`, `serviceDurationMin`, `appointmentSource`.
- `Channel`: `type` (`instagram|whatsapp`), `waPhone` único, `activeDays`. Es el modelo a extender con `type:'voice'`.
- `SaraPersona`: `systemPrompt`, `knowledge`, `brandName`.

---

## 2. Voice agent de RAY (RAY-Website)

### 2.1 Qué hay

Un embed del widget prebuilt de Vapi, 100 % cliente. Un solo archivo relevante:
`src/components/pages/product/VoiceAgent.tsx` (668 líneas, casi todo copy).

- Sin SDK en `package.json`; carga `https://unpkg.com/@vapi-ai/client-sdk-react@0.0.15/dist/embed/widget.umd.js` (`:123`).
- Inyecta `<vapi-widget public-key="90d98cb0-…" assistant-id="6974c1fa-…" mode="voice" show-transcript="true" require-consent="true" …>` (`:90-124`). Public key y assistant id hardcodeados.
- Transporte: Daily.co WebRTC (dentro del widget).
- Mic, inicio, transcript, timer y corte: todo dentro del widget. La app no renderiza nada propio.
- No pasa variables (ni `assistant-overrides` ni `variableValues`): mismo asistente para ES y EN.
- Cero env vars de voz, cero rutas API de voz, cero verificación de firma.

### 2.2 Qué NO hay en el repo

- System prompt, modelo, voz, tools: viven solo en el dashboard de Vapi del asistente `6974c1fa…`.
- Webhooks de tools (disponibilidad, reserva, transferir): no existen en `rayapp.ai`. Si el asistente los tiene, apuntan a otro server URL configurado en Vapi.
- Mapeo número → restaurante: no existe. Lo hace Vapi (número → asistente) o un backend no identificado.
- "POS de prueba": es copy (`VoiceAgent.tsx:533`), no hay endpoint ni env var.

### 2.3 Reutilizable vs acoplado

Reutilizable (unas 150 líneas): inyección del widget y orden de carga (`:61-124`), teardown (`:177-186`),
limpieza de `vapi_call_id`/`vapi_session_id` en localStorage (`:71-83`), gate de consentimiento (`:107-109`),
props de theme.

Acoplado a restaurantes: el assistant id, el copy, la grilla de POS, la ruta `product/voice-agent`.

Conclusión: de RAY se hereda la decisión de proveedor (Vapi) y una cuenta ya operativa. Toda la capa server
(tools, auth de callbacks, resolución de tenant, prompt dinámico) hay que construirla.

### 2.4 diezx-app (revisado por si tenía wiring de Vapi)

No tiene Vapi. Su agente de voz es Gemini Live + Recall.ai para reuniones, y ElevenLabs para clonado. Lo único
que vale copiar como patrón: verificación de firma Twilio fail-closed con ack rápido y proceso async
(`backend/src/domains/messaging/whatsapp/controllers/whatsappWebhookController.ts:79-96`). Advertencia: ahí
mandan la API key de Gemini al browser; no replicar.

---

## 3. Hello Patient (competidor)

Fuentes descargadas en el scratchpad de esta sesión (`hellopatient/index.html`, `website-demo.umd.cjs`).

- Sitio: Webflow. La demo es un embed custom: bundle propio `https://cdn.hellopatient.com/website-demo/website-demo.umd.cjs` (Vite, UMD `window.WebsiteDemo`) + 3 scripts inline que pegan tiles, transcript y form.
- Proveedor de voz: LiveKit (livekit-client 2.13.4, 116 hits). No usan Vapi, Retell ni ElevenLabs en el browser. El backend es un pipeline tipo LiveKit Agents con STT/LLM/TTS enchufables (enums de config: Deepgram/Google STT; Cartesia/Deepgram/ElevenLabs/Rime TTS; Anthropic/Bedrock/Google/OpenAI LLM).
- Backend: `https://api.hellopatient.com` (Fern SDK, sin token, CORS solo a su dominio).
  - `POST /webrtc/demo/sessions?intent=…` → `{server_url, room_name, participant_name, participant_token}`. Verificado en vivo: sin params devuelve 400 "Either intent or practice_phone_number must be provided".
  - `POST /webrtc/demo/text?phone_number=+1…&intent=…` → el server manda el SMS; la UI ignora la respuesta y muestra "Texting you momentarily".
- Cambio de especialidad: un solo endpoint y un enum `intent` (`veterinary|dermatology|orthopedics|ent|urgent_care|dentistry|my_dentist_demo`). No hay un assistantId por especialidad en el front. Clickear otra tile corta la room y abre otra sesión. El nombre de clínica ("Divine Dermatology") sale de la config server-side del intent; el HTML tiene placeholders viejos ("Winter Dermatology").
- Parámetro alternativo `practice_phone_number` (E.164): misma demo pero contra el agente real de una práctica configurada. Es el equivalente a nuestra "clínica de prueba" pero apuntando a tenants reales.
- Transcript en vivo: evento nativo `RoomEvent.TranscriptionReceived` de LiveKit; el script pinta filas `YOU:`/`AGENT:`, reescribe el texto en cada segmento parcial y fija la fila con `final`. La onda no está ligada al audio real (setInterval de opacidad). Timer con setInterval.
- "Text Me": solo US (+1, 10 dígitos), checkbox de consentimiento, sin captura de nombre/email. Carrier no visible; Telnyx aparece en enums, inferencia.
- Sin límites de duración ni rate limit visibles en cliente. Pantalla final con "Book a Call / Try it Again".

---

## 4. Lectura cruzada para la Fase 2

1. Proveedor: Vapi es lo que ya tenemos operando (cuenta y widget de RAY). Hello Patient hizo stack propio sobre LiveKit; no hace falta para nosotros.
2. La lógica de negocio de Sara está bien factorizada en servicios puros (`getAvailableSlots`, `reserveSlot`, `rescheduleWithClaim`, `releaseBooking`, `startAppointmentCheckout`, `sendText/sendTemplate`). Falta exponerlas como un endpoint de tools con auth de máquina; hoy solo crear y leer están en `/api/pos/*`.
3. Resolución de clínica en voz: calcar WhatsApp (número → `Channel{type:'voice'}` → `Company`), con el `assistant-request` de Vapi construyendo el prompt desde `SaraPersona` + `buildUserPrompt`.
4. Lo que en chat es un link (seña) en voz es un WhatsApp saliente durante la llamada: `sendTemplate` ya existe, pero necesita template aprobada y endpoint HTTP.
5. Demo web: un endpoint tipo `/demo/sessions?intent=&lang=` que devuelva config de asistente para el widget de Vapi, con una clínica de prueba por tipo (estética/dental/consultorio) y dos idiomas. El "escribime por WhatsApp" reemplaza al SMS de Hello Patient y puede ir por la línea SDR (YCloud, repo `scrapper`) o por la línea de la clínica de prueba.
6. Riesgo ya visible: `SaraConversation.channel`, `originForChannel` y `depositMessage` asumen chat; hay que introducir `voice` sin romper WhatsApp.
