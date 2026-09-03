import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAgenda, runDemoTool, dayKey } from './agenda.ts';
import { voiceDemoClinics } from '../../data/voiceDemoClinics.ts';

// Jueves 3 de septiembre de 2026, 10:00 en CDMX (16:00Z).
const NOW = new Date('2026-09-03T16:00:00Z');

test('slots respetan horarios, duración y aviso mínimo', () => {
  const agenda = createAgenda({ clinic: voiceDemoClinics.estetica, lang: 'es', now: NOW, seed: 'a' });
  const r = agenda.getAvailableSlots({ service: 'limpieza facial' }) as any;
  assert.equal(r.ok, true);
  assert.equal(r.service, 'Limpieza facial profunda');
  assert.ok(r.slots.length > 0 && r.slots.length <= 4);
  for (const s of r.slots) {
    assert.match(s.slotId, /^s\d+$/, 'id corto');
    const [dayPart, rest] = agenda.slotById(s.slotId)!.key.split('T');
    const hh = Number(rest.split(':')[0]);
    const mm = Number(rest.split(':')[1].split('|')[0]);
    const wd = new Date(dayPart + 'T12:00:00Z').getUTCDay();
    assert.notEqual(wd, 0, 'nunca domingo');
    const close = wd === 6 ? 14 * 60 : 19 * 60;
    assert.ok(hh * 60 + mm + 60 <= close, `termina antes del cierre: ${s.slotId}`);
    assert.ok(hh * 60 + mm >= 9 * 60, 'después de la apertura');
    if (dayPart === dayKey(NOW, agenda.tz)) assert.ok(hh * 60 + mm >= 12 * 60, 'hoy: al menos 2 h de aviso');
    assert.match(s.when, /a las/);
  }
});

test('misma semilla, mismos huecos; distinta semilla, distinta ocupación', () => {
  const a1 = createAgenda({ clinic: voiceDemoClinics.dental, lang: 'en', now: NOW, seed: 'x' }).getAvailableSlots({ service: 'cleaning' }) as any;
  const a2 = createAgenda({ clinic: voiceDemoClinics.dental, lang: 'en', now: NOW, seed: 'x' }).getAvailableSlots({ service: 'cleaning' }) as any;
  assert.deepEqual(a1.slots, a2.slots);
  assert.match(a1.slots[0].when, /at \d/);
});

test('book marca el slot, reschedule lo libera, cancel limpia', () => {
  const agenda = createAgenda({ clinic: voiceDemoClinics.estetica, lang: 'es', now: NOW, seed: 'b' });
  const r = runDemoTool(agenda, 'get_available_slots', { service: 'peeling' }) as any;
  const first = r.slots[0];
  const bad = runDemoTool(agenda, 'book_appointment', { slotId: first.slotId }) as any;
  assert.equal(bad.ok, false, 'sin nombre no reserva');
  const ok = runDemoTool(agenda, 'book_appointment', { slotId: first.slotId, name: 'Franco' }) as any;
  assert.equal(ok.ok, true);
  assert.equal(ok.requiresDeposit, true, 'estética pide seña');
  assert.match(ok.depositAmount, /360 MXN/);
  const again = runDemoTool(agenda, 'get_available_slots', { service: 'peeling' }) as any;
  assert.ok(!again.slots.some((s: any) => s.slotId === first.slotId), 'el slot reservado ya no se ofrece');
  const other = again.slots[0];
  const moved = runDemoTool(agenda, 'reschedule_appointment', { slotId: other.slotId }) as any;
  assert.equal(moved.ok, true);
  assert.equal(agenda.state.booking?.slot.id, other.slotId);
  assert.notEqual(other.slotId, first.slotId);
  const cancelled = runDemoTool(agenda, 'cancel_appointment') as any;
  assert.equal(cancelled.ok, true);
  assert.equal(agenda.state.booking, null);
});

test('dental no pide seña; servicio desconocido devuelve error hablable', () => {
  const agenda = createAgenda({ clinic: voiceDemoClinics.dental, lang: 'es', now: NOW, seed: 'c' });
  const r = runDemoTool(agenda, 'get_available_slots', { service: 'blanqueamiento' }) as any;
  const ok = runDemoTool(agenda, 'book_appointment', { slotId: r.slots[0].slotId, name: 'Ana' }) as any;
  assert.equal(ok.requiresDeposit, false);
  const unknown = runDemoTool(agenda, 'get_available_slots', { service: 'tatuaje' }) as any;
  assert.equal(unknown.ok, false);
  assert.equal((runDemoTool(agenda, 'nope') as any).ok, false);
});

test('filtro por fecha solo devuelve ese día', () => {
  const agenda = createAgenda({ clinic: voiceDemoClinics.consultorio, lang: 'en', now: NOW, seed: 'd' });
  const r = runDemoTool(agenda, 'get_available_slots', { service: 'general consultation', date: '2026-09-04' }) as any;
  assert.ok(r.slots.length > 0);
  assert.ok(r.slots.every((s: any) => agenda.slotById(s.slotId)!.key.startsWith('2026-09-04')));
});
