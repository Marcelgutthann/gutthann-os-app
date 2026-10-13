import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('./dashboard.js',import.meta.url),'utf8');

test('project cost loads from confirmed cost source and clears a stale value on error',()=>{
  assert.match(source,/sb\.rpc\('kostenstand'/);
  assert.match(source,/const a=!error&&ks&&ks\.aktuell\?ks\.aktuell:null/);
  assert.match(source,/budget:null/);
});

test('dashboard does not infer a budget or completed earlier phases',()=>{
  assert.doesNotMatch(source,/vs\. Budget|Budgetabweichung|Kosten aktuell/);
  assert.doesNotMatch(source,/fa&&i<fa\?'done'/);
  assert.match(source,/phaseEvidence\(PL,proj\.termin_check\)/);
});

test('unverified project metrics are not promoted into the leading KPI',()=>{
  assert.match(source,/bgf_m2'\)\.verifiziert===true/);
  assert.match(source,/Export gesperrt/);
});

test('phase progress is independent for each parallel phase and requires a source',()=>{
  assert.match(source,/function phasePct\(/);
  assert.match(source,/fortschritt\[i\]/);
  assert.match(source,/quelle\.length<8/);
  assert.match(source,/art:'manuelle_einschaetzung'/);
  assert.doesNotMatch(source,/kpi\('accent','Aktive Phase'/);
});
