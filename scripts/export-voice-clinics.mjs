// Exporta las clínicas ficticias de la demo (src/data/voiceDemoClinics.ts) a JSON para
// que el scrapper (modo "demo paciente" por WhatsApp) use exactamente la misma fuente.
//   node scripts/export-voice-clinics.mjs ../RAY-Scrapper/server/data/patientDemoClinics.json
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const out = process.argv[2];
if (!out) { console.error('uso: node scripts/export-voice-clinics.mjs <salida.json>'); process.exit(1); }
const { voiceDemoClinics } = await import(pathToFileURL(resolve('src/data/voiceDemoClinics.ts')).href);
const json = { generatedAt: new Date().toISOString(), source: 'holasara.ai/src/data/voiceDemoClinics.ts', clinics: voiceDemoClinics };
writeFileSync(resolve(out), JSON.stringify(json, null, 2) + '\n');
console.log(`escrito ${out} (${Object.keys(voiceDemoClinics).join(', ')})`);
