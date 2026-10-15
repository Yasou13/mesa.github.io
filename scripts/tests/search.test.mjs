import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../../dist/app.js',import.meta.url),'utf8');
const helper=source.match(/function searchText\(value\) \{[\s\S]*?\n\}/)[0];
test('search handles dotted and dotless Turkish I',()=>{
  const context=vm.createContext({isTurkish:true});vm.runInContext(helper,context);
  assert.equal(context.searchText('İÇE AKTARMA'),context.searchText('içe aktarma'));
  assert.equal(context.searchText('IŞIK'),context.searchText('ışık'));
});
