import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateCurriculum,lessonSearchRecord} from '../render_learn.mjs';
import {buildSearchIndex} from '../generate_search_index.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../../'+p,import.meta.url),'utf8'));
const hub=read('content/hub.json'),course=read('content/learn-curriculum.json');
test('the complete curriculum has ordered prerequisites, diagrams, exercises and references',()=>{
 assert.doesNotThrow(()=>validateCurriculum(course,hub.entries));
 assert.equal(course.lessons.length,14);assert.equal(course.redirects.length,18);
 const broken=structuredClone(course);[broken.lessons[0],broken.lessons[1]]=[broken.lessons[1],broken.lessons[0]];
 assert.throws(()=>validateCurriculum(broken,hub.entries),/Prerequisite/);
});
test('merged articles are absent from search and route to a published canonical lesson',()=>{
 const index=buildSearchIndex();
 for(const r of course.redirects){
  assert.ok(hub.entries.some(e=>e.id===r.toId&&e.indexable&&!e.draft));
  assert.ok(!index.some(i=>i.url===r.fromPath||i.url==='tr/'+r.fromPath));
 }
});
test('search exposes real lesson sections rather than only title and summary',()=>{
 for(const language of ['en','tr']) {
  const entry=hub.entries.find(e=>e.id==='sqlite-as-canonical-agent-memory');
  const record=lessonSearchRecord(entry,language);
  assert.ok(record.sections.find(s=>s.id==='idempotency').text.toLowerCase().includes('fencing'));
  const indexed=buildSearchIndex().find(i=>i.id===entry.id+'-'+language);
  assert.deepEqual(indexed.sections,record.sections);
  assert.ok(indexed.content.includes('fencing'));
 }
});
