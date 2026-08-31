#!/usr/bin/env node
/**
 * Lanza el entrenamiento del LoRA de Sara en fal.ai (Flux LoRA fast training).
 * Sube el zip, dispara el training, hace polling y al final imprime la URL del .safetensors.
 *
 * Key: env FAL_KEY o ~/.config/fal/api-key (NUNCA en el repo ni en el chat).
 *
 * Uso:
 *   FAL_KEY=xxxx node fal-train.mjs                      # usa sara-lora-trainset.zip + trigger sara_ray
 *   node fal-train.mjs <zip> <trigger_word> <steps>      # override
 */
import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fal } from '@fal-ai/client';

const ZIP = process.argv[2] || 'sara-lora-trainset.zip';
const TRIGGER = process.argv[3] || 'sara_ray';
const STEPS = Number(process.argv[4] || 1000);

function getKey() {
  if (process.env.FAL_KEY && process.env.FAL_KEY.trim()) return process.env.FAL_KEY.trim();
  const p = join(homedir(), '.config', 'fal', 'api-key');
  if (existsSync(p)) { const k = readFileSync(p, 'utf8').trim(); if (k) return k; }
  console.error('Falta la key: exportá FAL_KEY o poné ~/.config/fal/api-key');
  process.exit(1);
}
if (!existsSync(ZIP)) { console.error('No existe el zip:', ZIP); process.exit(1); }

fal.config({ credentials: getKey() });

console.log(`[1/3] Subiendo ${ZIP} a fal storage...`);
const buf = readFileSync(ZIP);
const file = new File([buf], ZIP.split('/').pop(), { type: 'application/zip' });
const imagesUrl = await fal.storage.upload(file);
console.log('      OK, data url listo.');

console.log(`[2/3] Lanzando training (trigger="${TRIGGER}", steps=${STEPS})...`);
const result = await fal.subscribe('fal-ai/flux-lora-fast-training', {
  input: {
    images_data_url: imagesUrl,
    trigger_word: TRIGGER,
    steps: STEPS,
    create_masks: true,   // segmenta al sujeto -> mejor identidad, ignora fondos
    is_style: false,
  },
  logs: true,
  onQueueUpdate: (u) => {
    if (u.status === 'IN_PROGRESS') (u.logs || []).map((l) => l.message).forEach((m) => m && console.log('      ·', m));
    else console.log('      status:', u.status);
  },
});

console.log('[3/3] LISTO. Resultado:');
const d = result.data || result;
console.log(JSON.stringify(d, null, 2));
const loraUrl = d?.diffusers_lora_file?.url;
if (loraUrl) console.log('\n>>> LoRA (.safetensors):', loraUrl);
console.log('request_id:', result.requestId);
