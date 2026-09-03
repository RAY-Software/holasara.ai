// Placeholder. Mismo mecanismo que api/_key.js: el workflow de deploy escribe el valor
// real antes de `vercel build`, desde el secret GEMINI_API_KEY de GitHub. La key solo
// vive en la función (server); el browser recibe tokens efímeros de un solo uso.
// Nunca commitear el valor real acá. En local, api/voice-session.ts cae a la env
// GEMINI_API_KEY (scripts/voice-dev.mjs la lee de ~/.config/gemini/api-key).
export const GEMINI_API_KEY = '';
